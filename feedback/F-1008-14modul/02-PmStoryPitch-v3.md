# 14-Modul (kod: `src/12-Modull`) · 2-dars (PM) «Mahsulotingiz hikoyasini qanday aytasiz?» — MD v3

Fayl: `src/12-Modull/PmStoryPitchLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-02` · **15 ekran** (keysli PM — tayanch 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
⚠️ **TAXMIN:** Qaror-0 javobi hali yo'q — `<!-- TAXMIN Tn -->` belgili qatorlar tavsiya (A) variantga tayanadi (ro'yxat — oxirida «TAXMIN belgilari»). Javob boshqacha bo'lsa, aynan shu qatorlar tuzatiladi.
Pilot qoidalari (9-Modul SABOQ 1–18, 10-Modul SABOQ 19–31, 11-Modul SABOQ D 32–39, **12-Modul SABOQ E 40–55** — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; navbatdagi bitta tugma — halqa; Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — natija yashil xulosa qutisining birinchi kichik qatori (E 42) ·
ko'p maydonli ish — bittadan karta (E 53) · yorliq input ichida (E 43) · ekranda ≤ 3 blok · telefon maketi chapda (≈170×272, o'lchami barqaror) · odamlar real ko'rinishda, ismsiz (D 36) · maketda hech narsa kesilmaydi (E 41) · yakun — E 50 standarti, holatga qarab (E 54).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **D** (`3`) · 7-ekran — **C** (`2`) · 11-ekran — **A** (`0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 467–469, grep 08.10.2026, DE-205): `m12-01` «Investorga pitchni qanday tuzasiz?» → **`m12-02` «Mahsulotingiz hikoyasini qanday aytasiz?»** (osti: «5 daqiqalik pitch — hikoya, funksiyalar ro'yxati emas», `type: 'PM'`, `comp` hali yo'q) → `m12-03` «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz». <!-- TAXMIN T20 -->
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn: o'quvchining o'z mahsuloti hikoyasi (kim · lahza · o'zgarish) va uni telefonga aytib, o'zi tekshirishi; mustaqil ish majburiy (8–10-ekranlar). Keys — **K19 Apple iPhone** (tayanch 5; bank so'zi aynan, raqamsiz). <!-- TAXMIN T18 -->
**Kod ekrani yo'q** (tayanch 4 — PM 15 naqshi). **REPO yo'q** (tayanch 3: `m14-dars-02-done` = `-start`).
⚠️ Bu darsning qat'iy chegarasi (TAQIQLAR 1, sinf 9): **video faqat o'quvchining telefonida qoladi** — hech kimga yuborilmaydi, internetga qo'yilmaydi, kalitga havola yoki fayl yozilmaydi; yuz va ism — ixtiyoriy; kadrda boshqa odam yo'q. <!-- TAXMIN T12 -->
⚠️ Modul raqami o'quvchi matnida — LMS raqami («9-Modulda», «11-Modulda»); kod raqami (`m12-02`, `src/12-Modull`) faqat fayl yo'lida. Dars raqami o'quvchi matnida yo'q («o'tgan dars»). «Demo Day», keyingi darslar mazmuni — o'quvchi matnida va'da qilinmaydi (T-038, tayanch 9.13).
Manba: `00-MODUL-TAYANCH.md` (**1.1** — Mentor qoralamasi AYNAN · **1.2 — hikoya, Mentor lahzasi va o'zgarishi, K19, video — AYNAN** · 1.14 — sonlar · 2 — atamalar · 4 — PM 15 naqshi · 5 — K19 · 7 — 18 sinf · 8 — `pm-m12d2-hikoya` · **9 — to'lqin kelishuvlari (9.1, 9.2, 9.3, 9.12, 9.13, 9.14)**) ·
`00-TAQIQLAR.md` · `00-NOMLAR.md` · `00-MANBA.md` (1 — dastur 2-qator · 4 · 6 — K19) · `qaror-0.json` (T1, T12, T18, T19, T20) · `MD_TOPSHIRIQ_2.md` (2-qator, «Pilotlardan saboq», eslatma 2) ·
13-Modul tayanchi (1.0, 2, 7) va `00-TAQIQLAR.md` · 9-Modul `12-PmUserStoryPitch-v3.md` (**«hikoya» ta'rifi — o'tilgan**, TAYANCHGA SAVOL 1) · 11-Modul `16-PmPrototypePitch-v3.md` 6-ekran (**K19 — o'tilgan**, brend izohlari) ·
namunalar: 13-Modul `02-PmMonetization-v3.md` + `02-FILTR.md` · pilot `01-PmInvestorPitch-v3.md` + `01-OZ-AUDIT.md` · `QURUVCHI_SABOQ.md` E 40–55 · `PM_Prompt_v8.md` K19 (263–266-qatorlar).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «O'zini videoga yozadi»; tayanch 1.2, 4): o'quvchi o'z mahsuloti uchun **mahsulot hikoyasini** yozadi — **kim** (rol) · **lahza** (bo'lib o'tgan bitta voqea) · **o'zgarish** (mahsulot bilan nima o'zgaradi) — bittadan karta (E 53),
   so'ng hikoyani **telefoniga 1 daqiqagacha aytib yozadi** va **o'zi bir marta ko'rib**, uch savolga javob beradi: hikoya lahza bilan boshlandimi · funksiyalar ro'yxatisiz gapirdimi · 1 daqiqaga sig'dimi. <!-- TAXMIN T12 -->
   Saqlanadi `pm-m12d2-hikoya` (matn va uch javob; video fayl ham, havola ham emas — 5, 9-darslar o'qiydi, tayanch 8). O'qiydi `pm-m12d1-pitch` (Muammo va Yechim — kartalar ustida yordam qatori).
   Natija besh holatda bo'lishi mumkin (14-ekran sarlavhasi shunga qarab — sinf 6, E 54): hikoya yozildi va videoda uchala savolga «Ha» · hikoya yozildi, videoda «Yo'q» chiqdi · hikoya yozildi, video tekshiruvi hali yo'q · qisman yozildi · hech narsa yozilmagan. Belgi ✓ va nishon — faqat birinchisida.
   Faqat shu A-bo'limda (o'quvchi matnida yo'q — T-038): hikoya 5-darsda guruh oldida pitch ichida aytiladi (tayanch 4: 5-dars `pm-m12d2-hikoya` ni o'qiydi).
2. **Bugungi asosiy fikr** (P-013; dars ichidagi o'q — yakunda KO'RSATILMAYDI, SABOQ E 50): Pitchda funksiyalar ro'yxati o'rniga bitta odamning lahzasi va mahsulot bilan kelgan o'zgarish aytiladi. (104)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 9-Modul (12-dars «Pitchingizda kimning hikoyasi bor?», `src/7-Modull/PmUserStoryPitchLesson.jsx`): **hikoya** — «Hikoya — bitta real odam bilan bo'lib o'tgan ish. U yozuvdan olinadi, o'ylab topilmaydi.» (9-Modul MD 4-ekran xulosasi aynan) ·
     «Raqam — 5 suhbatda bu holat necha kishida chiqqani, hikoya — bitta odamda qanday bo'lgani.» · **zal** (pitchni tinglaydiganlar) · **repetitsiya**. ⚠️ `00-MANBA.md` 4 da «hikoya — o'tilmagan» deyilgan — grep xatosi (TAYANCHGA SAVOL 1).
   - 10–12-Modul: **pitch** · **taymer** · **halol gap** · **dalil** (son yoki kuzatuv) · **Raqamlar** bo'lagi · **jonli demo**.
   - 11-Modul: **funksiya** (PRD dagi uchta funksiya) · **tashkilotchi** · **o'yinchi** (rol bilan, ismsiz) · «Maydon Jamoa» — namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» ·
     **iPhone voqeasi** (16-dars, K19: «uch qurilma bittada»; brend izohlari — 11-Modul tayanchi 9.97).
   - 12–13-Modul: **eslatma** · **Telegram xabari** · **taklif havolasi** · **Pro** · **ekran videosi** (11-Modul — demo B rejasi; bu yerda o'zini yozish — boshqa video, aralashmaydi).
   - 14-Modul o'tgan darsi: **olti bo'lak** (Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam) · **hakam** (glosssiz — 9.12) · **savol-javob** · **qoralama** · `HAKAM_SAVOL`.
4. **Bugun yangi — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):** <!-- TAXMIN T19 -->
   - **mahsulot hikoyasi** — «Mahsulot hikoyasi — bitta odam, bitta lahza va mahsulot bilan kelgan o'zgarish.» (2-ekran xulosasida tug'iladi — uch tugmadan keyin; undan keyin qisqa shakli — **hikoya**).
     Tayanch 2 ta'rifi «bitta odam, bitta lahza va o'zgarish orqali aytish» — 9-Modul ta'rifiga (bitta real odam bilan bo'lib o'tgan ish) uchinchi qism qo'shilgani sifatida yozildi (TAYANCHGA SAVOL 1). Inglizchasi «storytelling» — faqat kartochkada bir marta.
   - **lahza** (oddiy so'z, uch qismdan biri) — bo'lib o'tgan bitta voqea: kuni yoki soati, joyi va nima bo'lgani (2-ekran 2-`QIzoh`; kartochka 3). 9-Modul so'zi bilan tenglashtiriladi: «bitta real odam bilan bo'lib o'tgan ish».
   - **o'zgarish** (oddiy so'z) — mahsulot bilan endi nima bo'ladi; mahsulot bugun ko'rsata oladigan narsa, va'da emas (2-ekran 3-tugma; 8-ekran kulrang qatori).
   - **funksiyalar ro'yxati** (oddiy so'z birikmasi, App.jsx ostida) — mahsulotda nima borligini sanash; hikoyaning juftligi (§146 — ikkala yarmi nomlanadi).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«hikoya»** — faqat mahsulot hikoyasi (kim · lahza · o'zgarish). «User Story» (3-Modul) va «sarguzasht» — yo'q. «storytelling» — faqat kartochkada.
   - **«lahza»** — faqat hikoyaning ikkinchi qismi. MD dagi harakat tavsiflarida ham «bir lahza» ishlatilmaydi (quruvchi kodga ko'chirmasin) — «qisqa vaqt», «~1 s».
   - **«ro'yxat»** — faqat «funksiyalar ro'yxati». **«funksiya»** — mahsulotdagi imkoniyat (11-Modul PRD so'zi); «imkoniyat», «fishka», «ficha» — yo'q.
   - **«bo'lak»** — pitch bo'lagi (olti nom — bosh harf bilan); **«qism»** — hikoyaning uch qismi (kim · lahza · o'zgarish). Ikkalasi aralashmaydi.
   - **«zal»** — pitchni tinglaydiganlar; **«hakam»** — pitchni baholaydigan odam (hook sahnasida yo'q, faqat 6-ekran va savollarda). «tomoshabin», «auditoriya» — yo'q.
   - **«video»** — faqat o'quvchi telefoniga yozgan hikoya videosi. «klip», «reels», «rolik» — yo'q. **«yozish»** ikki joyda: kartaga yozish (8) va telefonga yozish (9) — har biri o'z ekranida, tugma nomi bilan («Saqlash» · «Taymerni boshlash»).
   - **«tekshirish»** — o'quvchining o'z ishi (10-ekran); **«sinov»** — bu darsda yo'q (uyga vazifa ② da ham «tekshirish» emas — «so'rang»). «test» — ballik savol.
   - **«mahsulot»** — o'quvchining o'z mahsuloti (web yoki mobil — sinf 11); **«ilova»** — faqat Mentor misolida.
   - **«son»** — sanalgan miqdor; **«raqam»** — faqat «Raqamlar» bo'lagi nomida.
   - **Ishlatilmaydi:** storytelling (prozada), sarguzasht, «zerikarli», «yomon», «zo'r» (baho-so'zlar — TAQIQLAR 3), «sir», «albatta», «darrov», «har doim», «kafolat», Demo Day.
6. **Mentor misoli — «Maydon Jamoa» (tayanch 1.1, 1.2 AYNAN; bitta manba — `MENTOR_HIKOYA`, `JAMOA_PITCH`, 180-qonun; o'quvchiga «Mentor misolida»):**

| Qism | Matn (o'quvchi ko'radi) | Tayanch |
|---|---|---|
| kim | tashkilotchi | 1.2 («bitta odam»; rol — 1.0) |
| lahza | «Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.» | 1.2 aynan |
| o'zgarish | «Endi tashkilotchi juma kuni ko'radi: 9 / 10, bitta joy bo'sh.» | 1.2 aynan |
| funksiyalar ro'yxati (juftligi) | «Maydon Jamoa»da o'yin e'loni, qo'shilish, eslatmalar, Telegram xabari, taklif havolasi va Pro bor. | 1.0 («13-Modul oxirida bor» — real funksiyalar; son yo'q — TAYANCHGA SAVOL 11) |

   - **Mentor pitchi (1-dars qoralamasi, tayanch 1.1 aynan — 6-ekranda kulrang):** Muammo — «O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» ·
     Bozor — «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» · Yechim — «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» + jonli demo ·
     Raqamlar — «51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.» · Jamoa — «Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.» ·
     Keyingi qadam — «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.» <!-- TAXMIN T1 -->
   - **Qoralama matni bu darsda o'zgarmaydi** (9.2: tuzatish — 5, 8, 13-darslarda). Hikoya pitchga **aytilganda** qo'shiladi: Muammo lahza bilan ochiladi (≈8 soniya, 40 soniya ichida), o'zgarish — Yechimdagi jonli demoda («8 / 10» → «9 / 10»),
     Raqamlar — mahsulotda nechta foydalanuvchi borligi (tayanch 1.2 «hikoya pitchning qayerida»; Raqamlar qatori — TAYANCHGA SAVOL 6). <!-- TAXMIN T1 -->
   - **Pitch vaqti (9.1, bu mashqda):** Muammo 40 · Bozor 30 · Yechim (jonli demo bilan) 90 · Raqamlar 60 · Jamoa 30 · Keyingi qadam 50 soniya = 5:00 — 6-ekrandagi taymer chizig'i. <!-- TAXMIN T1 -->
   - `HAKAM_SAVOL` (9.3) — bu darsda faqat Muammo savoli «Bu muammo borligini qayerdan bilasiz?» (6-ekran, Muammo bo'lagi ustida). Grafik yo'q (9.14).
   - Mentor misoli — namuna, majburiy shakl emas (sinf 4): «Mentor misolida …», «bu misolda …». Ikkinchi misol (testda, P-002) — kitob almashish ilovasi (01 pilot bilan bir olam).
7. **Sonlar (faqat tayanch 1.1, 1.2, 1.14, 9.1):** 18:00, 8 kishi, 2 kishi (lahza) · «8 / 10» → «9 / 10» (o'zgarish, namuna o'yin) · 5 dan 4 (Muammo dalili) · 51 foydalanuvchi (Raqamlar) · 40·30·90·60·30·50 soniya (9.1) · 1 daqiqa (video, tayanch 1.2) · 2007 (K19 — bank yili).
   «12 ta funksiya» (tayanch 1.2 dagi misol-iqtibos) — ishlatilmaydi: 1.14 jadvalida yo'q son (TAYANCHGA SAVOL 11). Har xil o'lchovdagi sonlar qo'shilmaydi. Ikkinchi misol (testda) — sonsiz.
8. **Keys — K19 Apple iPhone (tayanch 5; bank so'zi aynan, raqamsiz; ruscha asli `PM_Prompt_v8.md` 263–266):** 2007-yilda raqobatchilar kim ko'proq tugma qilishi bilan bellashgan (Nokia, BlackBerry — klaviatura, stilus). Apple klaviatura, stilus va deyarli hamma tugmani olib tashlagan — bitta ekran va Home tugmasi.
   Jobs iPhone'ni «uch qurilma bittada» deb taqdim etgan: iPod, telefon va internet. (Bank xulosasi «ko'p funksiyali emas, kerakli funksiyali yutadi» — o'quvchi matnida umumiy qoida qilib aytilmaydi; faqat «bu voqeada».) <!-- TAXMIN T18 -->
   **«uch qurilma bittada»** — 11-Modul 16-darsidagi so'z aynan (kod `src/9-Modull/PmPrototypePitchLesson.jsx` 1218); tayanch 1.2 dagi «uchta qurilma bittada» o'rniga (T-052, TAYANCHGA SAVOL 3).
   Brend izohlari (S-018; 11-Modul tayanchi 9.97 aynan — har darsda qaytariladi): «iPhone — Apple kompaniyasining telefoni» · «Nokia va BlackBerry — 2007-yilda telefon chiqargan kompaniyalar» · «Stiv Jobs — o'sha paytdagi Apple rahbari» · «iPod — Apple'ning musiqa pleeri».
   Nom ranglari — iPhone qora-kulrang, Nokia ko'k, BlackBerry qora (11-Modul bilan bir), logotip yo'q.
   **Bugungi burchak** (11-Moduldagi «yechim bir gapda» burchagidan farqli): ko'p narsani sanash o'rniga keraklisi qoldiriladi — Apple ko'p tugmani olib tashlagan; pitchda funksiyalar ro'yxati o'rniga bitta lahza aytiladi.
   **Bankda yo'q fakt yo'q:** Jobs taqdimotda nimalarni sanagani yoki sanamagani, «jonli ko'rsatdi», narx, sotuv — aytilmaydi (tayanchdagi «xususiyatlar ro'yxati o'rniga bitta hikoya chizig'i» ko'prigi — bank faktiga toraytirildi, TAYANCHGA SAVOL 4).
9. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✗ ✕ › ✎ — belgilar. Telefon, odam qiyofalari, maydon chizmasi, taymer chizig'i, iPhone va boshqa telefonlar — chizilgan (CSS/SVG), logotip yo'q. O'yin qatlami (arena, nishon medali, podium) — mustasno.
   Kafolat so'zlari yo'q: «zal eslab qoladi», «hakam ishonadi», «hikoya yutadi» — yo'q; zal va hakamning reaksiyasi o'ylab topilmaydi va chizilmaydi (TAQIQLAR 0) — sahnada faqat matn, son va bo'lak o'zgaradi.
10. **Video va xavfsizlik (sinf 9; TAQIQLAR 1, 3; tayanch 1.2 — T12 qoidasi):** video o'quvchining o'z telefonida qoladi — hech kimga yuborilmaydi, sinf chatiga, internetga, maktab saytiga qo'yilmaydi; Mentor ham, sinfdosh ham ko'rmaydi (talab qilinmaydi). <!-- TAXMIN T12 -->
    Yuz va ism — ixtiyoriy: kamera yuzga qaratilishi shart emas, ovoz yetadi. Kadrda boshqa odam bo'lmaydi. Kalitga video fayli, havolasi, ism, maktab yozilmaydi (`video` — faqat to'rtta `bool | null`).
    Telefon yo'q, maktab qoidasi ruxsat bermaydi yoki o'quvchi yozishni xohlamasa — **«Yozib bo'lmadi»** yo'li: hikoya taymer bilan ovoz chiqarib aytiladi, video — uyda (uyga vazifa ①); yakun buni rost aytadi (TAYANCHGA SAVOL 9 — ota-ona roziligi).
    Hikoyadagi odam — rol bilan («tashkilotchi», «sinfdoshim», «sotuvchi»), ismsiz. Lahza — bo'lib o'tgan voqea: o'ylab topilmaydi (9-Modul qoidasi).
11. **Trek (sinf 11):** ikkala trekka bitta matn — «mahsulot» so'zi; o'zgarish — mahsulot bugun ko'rsatadigan narsa (web — sahifa, mobil — ilova ekrani); Yechimdagi jonli demo — o'tgan darsdagidek. Trek kaliti o'qilmaydi.
12. **Kod mexanikasi:** kod ekrani yo'q (tayanch 4 — PM 15). Darsning o'z mexanikalari: hikoya sahnasi (0, 2, 6) · keys sahnasi (4) · bittadan karta (8) · taymer va video (9) · o'zini tekshirish varag'i (10). 1-darsdagi tartib-mashqi va olti kartali forma takrorlanmaydi.
13. **Vaqt taqsimoti — 90 daqiqa (sinf 1 — reja, o'lchov emas):** kirish va reja (0, 1) ≈ 5 · ro'yxat va lahza (2) ≈ 8 · iPhone (4) ≈ 7 · hikoya pitchda (6) ≈ 7 · to'rt ballik test (3, 5, 7, 11) ≈ 8 · hikoya kartalari (8) ≈ 18 ·
    video yozish (9) ≈ 12 · videoni ko'rish va uch savol (10) ≈ 10 · podium, kartochkalar, arena, yakun (12–14) ≈ 13 → jami ≈ 88; 2 daqiqa zaxira.
    **Ulgurmasangiz:** 8-ekran — saqlangan karta qoladi, qolgani — uyga vazifa ③; yakun sarlavhasi «hali tugamagan» (E 54) · 9-ekran — «Yozib bo'lmadi» (video uyga — uyga vazifa ①; `optionalLive`) ·
    10-ekran — video bo'lmasa o'tib ketiladi, savollar uyda · arena vaqti qisqarsa — kartochkalar uyda.
    ⛔ Taqsimot — reja: «qur» pilotida 12–15 o'quvchi bilan taymer (ayniqsa 9–10-ekranlar: sinfda bir vaqtda yozish, shovqin, telefon qoidasi); «sig'adi» deyilmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0, 1.1):** o'tgan darsda «Maydon Jamoa» pitchi olti bo'lakka yozildi (qoralama) → **bugun: pitch funksiyalar ro'yxati bilan emas, bitta odamning lahzasi va o'zgarish bilan aytiladi** (yangi funksiya yo'q; qoralama matni o'zgarmaydi).
- **9 va 11-Modul ko'prigi (takrorlanmaydi):** 9-Modulda pitchga bitta real odamning hikoyasi qo'yilgan (raqam — necha kishida, hikoya — bitta odamda qanday bo'lgani); 11-Modulda iPhone voqeasi — «yechim bir gapda».
  Bugun — hikoyaga uchinchi qism (mahsulot bilan kelgan o'zgarish), hikoyaning olti bo'lakdagi joyi va o'zini videoga yozib tekshirish.
- **Dars ipi:** 0 — pitch ro'yxat bilan boshlansa, zal nimani bilib oladi → 2 — ro'yxat o'rniga kim · lahza · o'zgarish; «mahsulot hikoyasi» tug'iladi → 3 — test → 4 — iPhone: ko'p tugma olib tashlangan, keraklisi qolgan → 5 — test →
  6 — hikoya olti bo'lakka qanday tushadi (Muammo · Yechim · Raqamlar) → 7 — test → 8 — o'z hikoyasi uch kartaga → 9 — telefonga 1 daqiqada → 10 — o'zi ko'rib, uch savol, kerak bo'lsa karta tuzatiladi → 11 — yakuniy savol → podium → kartochkalar → yakun.
- **Bitta vizual — `HikoyaSahna` (dars bo'yi, 163/180; bitta manba `MENTOR_HIKOYA` + `FUNKSIYA_ROYXAT` + `JAMOA_PITCH` + `VAQT` + o'quvchi kaliti `pm-m12d2-hikoya`; dars ichida yoziladi — K-020):**
  - **chapda — telefon** (≈170×272, barqaror): «Maydon Jamoa» (nom o'z rangida, 11-Modul yashili; logotip yo'q) — «O'yin» ekrani: «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Qo'shilaman».
    O'zgarish holatida: ekran tepasida kichik yorliq «Juma», son «8 / 10» → «9 / 10» (kattalashib, silliq qaytadi), ostida «bitta joy bo'sh».
  - **o'ngda — hikoya chizig'i**: uch uya chapdan o'ngga, bir balandlikda — **kim** (bitta odam qiyofasi, real ko'rinishda — D 36; ostida rol yorlig'i) · **lahza** (kichik maydon chizmasi: tepada kun va soat; o'nta joy — sakkiztasida o'yinchi qiyofasi, ikkitasi uzuq doira; ostida «o'yin bo'lmadi») ·
    **o'zgarish** (kichik ekran nusxasi «9 / 10»). Uya holatlari: bo'sh (kulrang uzuq chiziq, U-041) → to'ldi (matn sirg'alib kiradi, ~1 s yashil) → joriy (accent chegara).
  - **ro'yxat rejimi** (0, 2-ekran boshi): uyalar o'rnida funksiya nomlari tasmasi — «O'yin e'loni» · «Qo'shilish» · «Eslatmalar» · «Telegram xabari» · «Taklif havolasi» · «Pro» (`FUNKSIYA_ROYXAT`, tayanch 1.0); nomlarda odam ham, kun ham yo'q.
  - **pitch tasmasi** (pastda; 0-ekranda faqat Muammo 0–40 s qismi, 6-ekranda to'liq): olti bo'lak (Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam) va taymer chizig'i 0–5:00 (`VAQT` = `[40, 30, 90, 60, 30, 50]` — 9.1; 12-Modul `TaymerChiziq` naqshi), har bo'lakda Mentor qoralamasining birinchi qatori kulrang.
  - **zal** (faqat 0-ekranda): uchta real ko'rinishdagi qiyofa (bosh, soch, rangli kiyim), ismsiz; reaksiya chizilmaydi (pufak, yuz ifodasi yo'q — TAQIQLAR 0).
  - **o'quvchi rejimi** (8–10-ekranlar): telefon yo'q (SABOQ 24 — telefonsiz rejim); uch uya o'quvchi matni bilan (uzun matn «…» bilan qisqaradi, uya cho'zilmaydi — SABOQ 29).
  - Ishlatiladi: 0 (ro'yxat rejimi + Muammo 40 s + zal) · 1 (matnsiz skelet) · 2 (ro'yxat → uch uya) · 3, 7, 11 (javobdan keyin kichik) · 6 (uch uya + pitch tasmasi) · 8–10 (o'quvchi rejimi). 4-ekran — o'z sahnasi `IphoneSahna` (P-053).
    `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi. Telefon kengligida (393) hikoya chizig'i telefon ostiga tushadi, pitch tasmasi ikki qatorga (3 + 3) bo'linadi — kesilmaydi (E 41). Vizual ⛶ ichida (q17).
- **Keyingi bosiladigan joy (SABOQ 11, E 40):** har holatda bitta faol element — yengil accent halqa, to'lqin 2–3 marta; tanlov guruhida har variantning o'z chegarasi. Yoqilgan pastki tugma ham halqada.
- **Bashorat (SABOQ 11, 25, E 42):** tanlangach yo'qolmaydi — savol va tanlangan javob ixcham qator bo'lib natijagacha turadi; natija — yashil xulosa qutisining birinchi kichik qatori: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …»; `QIzoh` — o'sha qutining oxirgi kichik qatori.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa joyidan joyiga uchadi (gap uyaga, uya matni bo'lakka) · yangi qator ~1 s yashil yonadi. Bezak-harakat (to'xtovsiz miltillash) yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Mahsulotingiz hikoyasini qanday aytasiz?** (40) — dars nomi (DE-205) <!-- TAXMIN T20 -->
- Mentor: Pitchingiz mahsulotdagi funksiyalar ro'yxati bilan boshlansa, zal birinchi 40 soniyada nimani bilib oladi?
- Maket (chap; `HikoyaSahna` ro'yxat rejimi): telefon «Maydon Jamoa» («O'yin» ekrani) · ostida pitch tasmasining Muammo qismi — taymer chizig'i 0 dan 40 soniyagacha sekin uzayadi, chiziq bo'ylab funksiya nomlari birma-bir chiqadi:
  «O'yin e'loni» · «Qo'shilish» · «Eslatmalar» · «Telegram xabari» · «Taklif havolasi» · «Pro» · ustida zal (uch qiyofa, ismsiz, reaksiyasiz). Nomlar ustida kulrang yorliq «Maydon Jamoa» funksiyalari. (≤ 3 blok: maket · variantlar · javob.)
- Variantlar (radio, o'ng; bir uzunlikda):
  - Mahsulotda qanday funksiyalar borligini (39)
  - Kimda qanday voqea bo'lib o'tganini (35)
  - Bu mahsulot kimga va nega kerakligini (37)
- Javob — «funksiyalar»: **Aynan! Ro'yxat mahsulotda nima borligini aytadi. Kimda qanday muammo bo'lgani hali aytilmadi.** (93)
- Javob — «voqea»: **Qiziq fikr! Ro'yxatga qarang: unda odam ham, kun ham yo'q — faqat funksiyalar.** (78)
- Javob — «kimga va nega»: **Qiziq fikr! Ro'yxat nima borligini aytadi, kimga va nega kerakligini emas.** (74)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant ixcham qator bo'lib qoladi; «funksiyalar» tanlansa — funksiya nomlari yashil ✓ bilan birma-bir yonadi (aytildi);
  «voqea» yoki «kimga va nega» tanlansa — nomlar kulrang qoladi va ular yonida nomsiz uzuq uya paydo bo'ladi (accent halqa; nomi yozilmaydi — 2-ekran kashfiyoti, P-036). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant (har birining o'z chegarasi, navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: Ro'yxatdagi funksiyalar — «Maydon Jamoa»da haqiqatan bor (13-Modul oxiri). Ro'yxat yomon emas — u hikoya emas. Zal nima his qilishini aytmang: ekranda faqat nima aytilgani ko'rinadi.
  Sinfdan so'rang: pitchingizning birinchi gapi nima edi?
✎ Hook — o'quvchining o'z pitchi (o'tgan darsda qoralama yozilgan — T-039) va o'z savoli (P-016). «Aynan!» — ro'yxatning ta'rifi bo'yicha rost javob; qolgan ikkitasi «Qiziq fikr!» bilan rad etilmaydi, faqat ro'yxatda nima yo'qligi ko'rsatiladi.
  Mentor gapida «hikoya», «lahza» so'zlari yo'q — javobni oldindan aytmaydi (P-016). Topshiriqdagi «zal zerikdi» hodisasi — reaksiyasiz, tekshiriladigan shaklda (TAYANCHGA SAVOL 5).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun mahsulotingiz hikoyasini yozib, aytib ko'rasiz.** (53)
- Mentor: O'tgan darsdagi pitch qoralamangiz saqlangan bo'lsa, uning Muammo va Yechimi kartalar ustida yordamga chiqadi.
- Chap — «Dars oxirida» + kulrang yorliq **5 daqiqalik pitch — hikoya, funksiyalar ro'yxati emas** (App.jsx osti so'zma-so'z, P-015) +
  vizual: `HikoyaSahna` skeleti — uchta nomsiz uya (kulrang uzuq), yonida kichik telefon siluet va taymer chizig'i 0–1:00; uyalar 0.6 s oraliqda birma-bir to'q bo'ladi, oxirida taymer 1:00 gacha yuradi. Matnsiz — 2-ekran kashfiyotini ochmaydi (P-015, §178).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Funksiyalar ro'yxati bilan hikoya farqini ko'rasiz · `hikoya`
  - 02 · Hikoya pitchning qaysi bo'laklariga tushishini bilib olasiz · `bo'laklar`
  - 03 · O'z mahsulotingiz hikoyasini kartalarga yozasiz · `karta`
  - 04 · Hikoyani telefonga aytib, o'zingiz tekshirasiz · `video` <!-- TAXMIN T12 -->
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz · Keyingi bosiladigan joy: «Boshlaymiz» (vizual tugagach halqada).
- O'qituvchi eslatmasi: Bir gap ayting: bugun yozilgan video faqat o'quvchining telefonida qoladi. O'tgan darsdagi qoralama bo'lmasa — dars to'xtamaydi, kartalar bo'sh ochiladi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011): «hikoya» — 9-Moduldan o'tilgan, dars nomida bor. Uch qism (kim · lahza · o'zgarish) qadam matnida ham, tegda ham yo'q — 2-ekran kashfiyoti (§178). «mahsulotingiz» — final mahsulot o'quvchida bor (T-039).

## 2 · Ro'yxat va lahza  ← QTushuncha (markaziy, ketma-ket 3 tugma)
- Eyebrow: Tushuncha · ro'yxat va hikoya
- Sarlavha: **Ro'yxat o'rniga zalga nimani aytasiz?** (37) — 0-ekran savolining o'z so'zlari bilan (T-064, §163: «ro'yxat», «zal»)
- Mentor: Tugmalarni birma-bir bosing va Mentor ro'yxat o'rniga nimani aytishiga qarang.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov, o'sish tartibida): **Mentor ro'yxat o'rniga nechta voqeani aytadi?** · Bitta · Uchta · Hammasini — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi.
- Vizual (`HikoyaSahna`, ro'yxat rejimi): **chapda** telefon («O'yin» ekrani, «8 / 10») · **o'ngda** funksiya nomlari tasmasi (6 ta) va ostida uchta bo'sh uya (kulrang uzuq).
- Tugmalar (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 Kim · 2 Lahza · 3 O'zgarish
- **Harakat → Vizual o'zgarish:**
  1. «Kim» → funksiya nomlari xiralashib chetga suriladi; 1-uyaga bitta odam qiyofasi kiradi, ostida yorliq «tashkilotchi».
     `QIzoh`: Ro'yxatda odam yo'q edi — bu yerda bitta odam bor: tashkilotchi.
  2. «Lahza» → 2-uyada maydon chizmasi paydo bo'ladi: tepada «Shanba, 18:00», o'nta joydan sakkiztasiga o'yinchi qiyofasi birma-bir kiradi, ikkitasi uzuq doira bo'lib qoladi, ostida «o'yin bo'lmadi»;
     uya ostiga gap yoziladi: «Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.»
     `QIzoh`: 9-Modulda shuni hikoya dedik: bitta real odam bilan bo'lib o'tgan ish.
  3. «O'zgarish» → chapdagi telefonda yorliq «Juma» chiqadi, «8 / 10» → «9 / 10» (kattalashib qaytadi), ostida «bitta joy bo'sh»; 3-uyaga gap yoziladi: «Endi tashkilotchi juma kuni ko'radi: 9 / 10, bitta joy bo'sh.»
     `QIzoh`: Bugun hikoyaga uchinchi qism qo'shildi: mahsulot bilan kelgan o'zgarish.
  Natija (yashil xulosa qutisining birinchi kichik qatori — E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: bitta».
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan tugmani bosing — uyaga nima tushishini ko'ring.
- Xulosa: Mahsulot hikoyasi — bitta odam, bitta lahza va mahsulot bilan kelgan o'zgarish. <!-- TAXMIN T19 -->
- Tugma (pastki): Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar qatori yo'qoladi, funksiya nomlari tasmasi yopiladi, telefon va uch uya butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy tugma (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: 9-Modulda pitchga bitta odamning hikoyasi qo'yilgan edi — bugun unga o'zgarish qo'shiladi. Lahza — Mentor misolida: Muammo dalilidagi «oxirgi o'yinda kimdir kelmagan» holatlaridan biri.
  O'zgarish — ilova bugun ko'rsata oladigan narsa (tashkilotchi sonni oldindan ko'radi), «muammo yo'qoldi» degan da'vo emas. Ro'yxatdagi funksiyalar yo'qolmaydi — ular Yechimda, jonli demoda ko'rinadi.
  Sinfdan so'rang: mahsulotingizdan foydalangan bitta odam bilan nima bo'lgan edi?

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · lahza
- Savol: **Kitob almashish ilovasi pitchida qaysi gap hikoyani boshlaydi?** · savol ustida yorliq yo'q
  - A — Ilovada kitob qidiruvi, chat va xarita bor (42)
  - ✔ B — Dushanba tanaffusida sinfdosh kitob topolmadi (45)
  - C — O'quvchilar ko'pincha kitob topishda qiynaladi (46)
  - D — Yil oxirigacha hamma maktab kitob almashadi (43)
- To'g'ri izohi: Unda bitta odam va bo'lib o'tgan bitta lahza bor. (49)
- Xato izohlari: A — Bu funksiyalar ro'yxati — unda odam bormi? (42) · C — Bu umumiy gap — qaysi kuni, kim bilan bo'ldi? (45) · D — Bu va'da — bo'lib o'tgan lahza qayerda? (38) ·
  (umumiy) Mentor lahzasida qaysi kun va soat bor edi? (43)
- Javob topilgach (QuestionScreen `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): uch uya ixcham — «kim: sinfdosh» · «lahza: dushanba, tanaffus» · «o'zgarish» uyasi kulrang «?» (savol uni so'ramagan).
- Izoh (MD): uch distraktor uch turkumda (S-004, sinf 8): A — funksiyalar ro'yxati, C — umumiy gap (lahzasiz; hayotda muammo gapi bo'la oladi, lekin hikoyani boshlamaydi — «rost, lekin mos emas»), D — kelajak va'dasi (sinf 16).
  «kitob» to'rttala variantda (§204); vergul faqat A da (distraktordagi tinish — tell emas); to'g'ri javob eng uzuni emas.

## 4 · iPhone  ← QVoqea (PM keys K19; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **iPhone 2007-yilda nima bilan ajralib turgan?** (44) <!-- TAXMIN T18 -->
- Nuqtalar (3) · yorliq **iPhone · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta kulrang qator, S-018): iPhone — Apple kompaniyasining telefoni. Nokia va BlackBerry — 2007-yilda telefon chiqargan kompaniyalar.
  Nomlar o'z rangida (iPhone — qora-kulrang · Nokia — ko'k · BlackBerry — qora; 11-Modul bilan bir), logotip yo'q.
- Mentor — kadr gapini aytadi, har kadrda almashadi (≤ 2 gap; SABOQ 8). Sahnada faqat kadr nomi va jonli maket.
- Sahna (`IphoneSahna`, chizilgan CSS/SVG; bankda yo'q narsa chizilmaydi — zal, narx, sotuv, son yo'q):
  - 1/3 **Ko'p tugma** — Mentor: 2007-yilda telefon kompaniyalari kim ko'proq tugma qilishi bilan bellashgan. Nokia va BlackBerry'da klaviatura va stilus bo'lgan.
    · sahna: ikki chizilgan telefon — biri to'liq klaviaturali (mayda tugmalar birma-bir yonib, ko'payib boradi), ikkinchisi yonida stilus qalami; nomlari ostida, o'z rangida.
    · bashorat (sahna ostida, bitta qator; S-015 — bitta o'lchov: tugmalar soni, kamdan ko'pga): **Apple iPhone'da tugmalarni nima qilgan?** · Deyarli hammasini olib tashlagan · O'shancha qoldirgan · Ko'paytirgan <!-- TAXMIN T18 -->
      — tanlangach ixcham qator natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **Bitta ekran** — Mentor: Apple esa klaviatura, stilus va deyarli hamma tugmani olib tashlagan. Telefonda bitta ekran va Home tugmasi qolgan.
    · sahna: klaviatura tugmalari birma-bir so'nib yo'qoladi, stilus chiqib ketadi → o'rtada iPhone siluetida bitta katta ekran va pastda bitta doira tugma (yorliq «Home»); nom «iPhone» o'z rangida.
  - 3/3 **Uch qurilma bittada** — Mentor: Stiv Jobs iPhone'ni «uch qurilma bittada» deb taqdim etgan: iPod, telefon va internet. iPod — Apple'ning musiqa pleeri. <!-- TAXMIN T18 -->
    · sahna ustida kulrang qator (S-018): Stiv Jobs — o'sha paytdagi Apple rahbari.
    · sahna: uchta kichik chizilgan qurilma — pleer (yorliq «iPod»), go'shak (yorliq «telefon»), brauzer oynasi (yorliq «internet») — navbat bilan iPhone ekraniga uchib kiradi; ekran ustida yozuv «uch qurilma bittada».
- Bashorat natijasi (2/3 kadrida; yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: deyarli hammasini olib tashlagan»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Voqea davomi» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, kadr nomi va sahna almashadi (tugmalar ko'payadi → so'nadi → uch qurilma ekranga uchadi).
- Xulosa (3/3 dan keyin, pastda, yashil): Bu voqeada Apple ko'p tugmani olib tashlagan, Jobs esa iPhone'ni tanish uch narsa bilan atagan. <!-- TAXMIN T18 -->
- Tugma (pastki): Voqea davomi (N/3) → Davom etish
- Keyingi bosiladigan joy: «Voqea davomi» (halqada) → 1/3 da bashorat variantlari (har birining o'z chegarasi) → «Voqea davomi» → «Davom etish».
- O'qituvchi eslatmasi: iPhone voqeasini o'quvchilar 11-Modulda ko'rgan («yechim bir gapda»). Bugungi savol boshqa: ko'p narsani sanash o'rniga keraklisi qoldiriladi — pitchda ham funksiyalar ro'yxati o'rniga bitta lahza.
  Taqdimot 2007-yil 9-yanvarda bo'lgan, yozuvi ochiq — vaqt bo'lsa, «uch qurilma» qismini proyektorda qisqa ko'rsating (bank: parcha ko'rsatish mumkin).
  Bankda yo'q faktni qo'shmang: Jobs taqdimotda nimalarni sanagani, narx, sotuv, «jonli ko'rsatdi» — aytilmaydi. «Hamma taqdimot shunday bo'lishi kerak» degan qoida chiqarmang — bu bitta voqea.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K19 (263–266; bank: «raqamsiz; taqdimot 9-yanvar 2007, yozuvi ochiq, parcha ko'rsatish mumkin» — ruschadan) · tayanch 5 · 11-Modul tayanchi 9.97 (brend izohlari, ranglar).
✎ Mentor kadr gaplari va brend izohlari — 11-Modul 16-dars kodi bilan bir xil (T-052: o'quvchi o'sha so'zlarni ko'rgan); sarlavha, bashorat va xulosa — bugungi burchakda yangi.

## 5 · 2-savol  ← QTest (✔ D, `correctIdx 3`; keys ko'prigi)
- Eyebrow: Tekshiruv · iPhone voqeasi
- Savol: **iPhone voqeasi va Mentor hikoyasida nima umumiy?** · savol ustida yorliq yo'q <!-- TAXMIN T18 -->
  - A — Ikkalasida hamma funksiya birma-bir sanalgan (44)
  - B — Ikkalasida voqea 2007-yilda bo'lib o'tgan (41)
  - C — Ikkalasida tugmalar soni ko'paytirilgan (39)
  - ✔ D — Ikkalasida keraklisi qolib, ortig'i olingan (43)
- To'g'ri izohi: Apple ko'p tugmani, Mentor esa ro'yxatni olib tashlagan. (56)
- Xato izohlari: A — Mentor hikoyasida funksiyalar sanaldimi? (40) · B — Mentor lahzasi qaysi kuni bo'lgan edi? (38) · C — Apple tugmalarni ko'paytirganmi? (32) ·
  (umumiy) Ikkalasida nima olib tashlanganini eslang. (42)
- Javob topilgach (kichik, savol ostida): chapda iPhone 2/3 kadri (bitta ekran va Home), o'ngda 2-ekran natijasi — funksiya nomlari xira, uch uya to'liq.
- Izoh (MD): savol «umumiy joy»ni so'raydi (tayanch 5 — ko'prik tenglik emas). Turkumlar (sinf 8): A — voqea teskari o'qilgan (ro'yxat sanalgan — darsga zid) · B — olamlar aralashgan (yil faqat iPhone'niki) · C — bank faktiga zid (tugmalar ko'paytirilmagan).
  To'rttasi «Ikkalasida …» bilan (§204); A (44) ✔ dan (43) uzun — to'g'ri javob yolg'iz eng uzun emas; farq 11%. Distraktorlar Apple haqida yolg'on fakt aytmaydi: A va C — «umumiy» sifatida noto'g'ri, B — Mentor misoliga tegishli emas.

## 6 · Hikoya pitchda  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · hikoya va bo'laklar
- Sarlavha: **Hikoya pitchning qaysi bo'laklariga tushadi?** (44)
- Mentor: Tugmalarni birma-bir bosing va hikoya qismlari qaysi bo'lakka tushishini ko'ring.
- Bashorat (ballsiz; S-015 — bitta o'lchov: son, o'sish tartibida): **Mentor hikoyasi nechta bo'lakka tushadi?** · Bittasiga · Ikkitasiga · Uchtasiga — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi. <!-- TAXMIN T1 -->
- Vizual (keng; telefonsiz — SABOQ 24): `HikoyaSahna` — **tepada** uch uya (2-ekrandan, to'liq: tashkilotchi · lahza · o'zgarish) · **pastda** pitch tasmasi: olti bo'lak, har birida Mentor qoralamasining birinchi qatori kulrang, ostida taymer chizig'i 0–5:00 (40·30·90·60·30·50); Muammo ustida kichik pufak `HAKAM_SAVOL` «Bu muammo borligini qayerdan bilasiz?». <!-- TAXMIN T1 -->
- Tugmalar (ixcham, bir qatorda): 1 Muammo · 2 Yechim · 3 Raqamlar
- **Harakat → Vizual o'zgarish:**
  1. «Muammo» → lahza uyasidagi gap Muammo bo'lagi boshiga uchadi (accent), undan keyin kulrang Mentor gaplari turadi: «O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida…»; taymerdagi Muammo qismining boshi (≈8 s) yashil bo'yaladi.
     `QIzoh`: Lahza Muammoni ochadi; dalil esa bu bitta odamda emasligini aytadi: 5 o'yinchidan 4 tasida.
  2. «Yechim» → o'zgarish uyasidagi gap Yechim bo'lagiga uchadi; Yechimdagi kulrang yorliq «jonli demo» yonadi va uning ichidagi kichik son «8 / 10» → «9 / 10» bo'ladi.
     `QIzoh`: O'zgarish Yechimda jonli demo bilan ko'rinadi: ekranda «9 / 10».
  3. «Raqamlar» → kim uyasidagi bitta odam qiyofasi Raqamlar bo'lagiga uchadi; qiyofa yonida yorliq «1», bo'lakdagi kulrang gap «51 foydalanuvchi; 11 tasi — sinfdoshlarim…» accent bo'ladi.
     `QIzoh`: Hikoya bitta odam haqida; Raqamlar bo'lagi mahsulotda nechta foydalanuvchi borligini aytadi.
  Natija (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: uchtasiga».
  Ipucha (40 s): Yoqilgan tugmani bosing — hikoya qismi qaysi bo'lakka uchishini ko'ring.
- Xulosa: Bu misolda lahza Muammoni ochadi, o'zgarish Yechimda ko'rinadi, Raqamlar esa son aytadi. <!-- TAXMIN T1 -->
- Tugma (pastki): Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar yo'qoladi, pitch tasmasi kattalashib fokusga keladi (DE-199); vizual ⛶ ichida.
- Keyingi bosiladigan joy: bashorat → joriy tugma → «Davom etish».
- O'qituvchi eslatmasi: Mentor qoralamasining olti gapi o'zgarmaydi — hikoya pitch aytilganda qo'shiladi: Muammo lahza bilan ochiladi (taxminan 8 soniya, Muammoning 40 soniyasi ichida), o'zgarish — Yechimdagi jonli demoda.
  Videoga hikoyaning uch qismi ketma-ket yoziladi — bu mashq; pitchda ular bo'laklarga bo'linadi. 51 — ro'yxatdan o'tgan foydalanuvchilar, lahzalar soni emas: «shuncha o'yin to'ldi» demang.
  9-Moduldagi juftlik shu yerda: hikoya — bitta odamda qanday bo'lgani, son — nechta odamda.

## 7 · 3-savol  ← QTest (✔ C, `correctIdx 2`; o'quvchining o'z pitchi)
- Eyebrow: Tekshiruv · hikoya va bo'laklar
- Savol: **Hikoyangizni pitchning qayerida boshlaysiz?** · savol ustida yorliq yo'q <!-- TAXMIN T1 -->
  - A — Keyingi qadamdan keyin, pitch oxirida (37)
  - B — Pitchdan oldin, 5 daqiqadan tashqarida (38)
  - ✔ C — Muammo bo'lagi boshida, lahza bilan (35)
  - D — Funksiyalar ro'yxatini aytib bo'lgach (37)
- To'g'ri izohi: Muammo bo'lagi lahza bilan boshlanadi. (38)
- Xato izohlari: A — Lahza muammoni ochadi — Muammo qaysi bo'lakda? (46) · B — Pitch 5 daqiqa — hikoya shu vaqt ichidami? (42) · D — Ro'yxat bilan boshlansa, zal avval nimani eshitadi? (49) ·
  (umumiy) Mentor lahzasi qaysi bo'lakni ochgan edi? (41)
- Javob topilgach (kichik, savol ostida): pitch tasmasi ixcham — Muammo boshida lahza (accent), Yechimda «9 / 10».
- Izoh (MD): uch distraktor uch turkumda: A — tartib (hikoya oxirga), B — vaqt (5:00 dan tashqari), D — ro'yxat qaytadi. To'rttasi «…, …» yoki «… -gach» shaklidagi joy javobi; «Muammo» faqat C da, lekin «pitch» A, B da, «ro'yxat» D da — kalit so'z yolg'iz emas; ✔ eng qisqa.

## 8 · Hikoyangiz  ← QMustaqil (USTAXONA — bittadan karta, 3 karta; SABOQ 9, 13, 17, 29; E 43, E 53)
- Eyebrow: Mustaqil ish · hikoya
- Sarlavha: **Mahsulotingiz hikoyasini uch kartaga yozing.** (44)
- Mentor: Har kartadagi savolga bitta gap bilan javob bering va «Saqlash»ni bosing.
- Kirish (P-046; saqlangan narsa bo'lsa — o'zi qo'yiladi, tahrirlash mumkin; yo'q bo'lsa — bo'sh, o'quvchi o'zi yozadi):
  - `pm-m12d1-pitch.bolaklar.muammo` (`string`) → Lahza kartasi ustida kulrang qator «Pitchingizdagi Muammo: {matn}» (uzun bo'lsa «…» bilan bir qatorga).
  - `pm-m12d1-pitch.bolaklar.yechim` (`string`) → O'zgarish kartasi ustida kulrang qator «Pitchingizdagi Yechim: {matn}».
  - Kalit yo'q yoki maydon `null` — qator chiqmaydi, karta bo'sh. `pm-m12d2-hikoya` oldin saqlangan bo'lsa — kartalar shundan to'ldiriladi (tahrir rejimi).
- **Tepada — ixcham chiziq «Hikoyam · n/3»:** qism nomlari (Kim · Lahza · O'zgarish), saqlangani ✓ (bo'sh uzuq qatorlar yo'q, SABOQ 17).
- **Markazda — bitta katta karta (joriy; qism tugmalari 1–3 — joriysi accent, saqlangani ✓):** karta sarlavhasi — qism nomi; maydon (yorliq input ichida — E 43: raqam belgisi + placeholder); belgi sanog'i; ostida bitta kulrang qator; tugmalar bir qatorda: «Saqlash» · o'ngda «Yordam».
  1. **Kim** — placeholder `Kimning lahzasi? Rolini yozing, ism emas` · sanoq «n / 60» · kulrang: Rol bilan yozing: o'yinchi, sotuvchi, ota-ona — ism emas.
  2. **Lahza** — placeholder `Qaysi kuni, qayerda, nima bo'ldi?` · sanoq «n / 160» · kulrang: Bo'lib o'tgan voqeani yozing — o'ylab topilmaydi.
  3. **O'zgarish** — placeholder `Mahsulot bilan endi nima bo'ladi?` · sanoq «n / 160» · kulrang: Mahsulot bugun ko'rsata oladigan narsani yozing, va'dani emas.
  «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob maydon ostida; «yo'naltiradi» — ikkinchi «Saqlash» bilan o'tadi, «bloklaydi» — o'tmaydi):
  - maydon bo'sh (bloklaydi): Bu kartaga bitta gap yozing. (28)
  - Kim 60 belgidan uzun (bloklaydi): Faqat rolini yozing — 60 belgigacha. (36)
  - Lahza yoki O'zgarish 160 belgidan uzun (bloklaydi): 160 belgidan oshdi — gapni qisqartiring. (40)
  - Lahza: raqam ham, kun yoki vaqt so'zi ham yo'q (yo'naltiradi; ro'yxat — KOD 6): Lahzaga kun, soat yoki son qo'shing. (36)
  - Lahza: «har doim», «doim», «ko'pincha», «odatda», «hamma» (yo'naltiradi): Bu umumiy gap — bitta voqeani yozing. (37)
  - Lahza: uch va undan ko'p vergul (yo'naltiradi): Bu ro'yxatga o'xshaydi — bitta lahzani yozing. (46)
  - O'zgarish: «tez orada», «albatta», «yetamiz», «hamma ishlatadi» (yo'naltiradi; 12-Modul `VADA_RE`): Bu va'da — mahsulot bugun nima ko'rsatadi? (42)
  - O'zgarish: «React», «Expo», «NestJS», «Neon», «Render», «Netlify», «socket.io» (yo'naltiradi; 12-Modul `TEXNO_RE`): Bu texnologiya — odam uchun nima o'zgaradi? (43)
  - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (qismga qarab bitta qator — Mentor misolidan, A-6 jadvali aynan):
  1 — Mentor misolida: tashkilotchi.
  2 — Mentor misolida: «Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.»
  3 — Mentor misolida: «Endi tashkilotchi juma kuni ko'radi: 9 / 10, bitta joy bo'sh.»
  Har kartada oxirgi qator: Hikoyangiz — o'zingizniki: bo'lib o'tgan voqeadan oling.
- **Harakat → Vizual o'zgarish:** maydon yozilsa — o'ngdagi `HikoyaSahna` (o'quvchi rejimi) uyasida matn shu zahoti ko'rinadi; «Saqlash» → karta kichrayib tepadagi chiziqqa uchadi (qism nomi yonida ~1 s yashil ✓), pastdan keyingi karta kiradi;
  tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. 3/3 da karta yopiladi; «Hikoyam» kartasi butun enga — uch qator (Kim · Lahza · O'zgarish), har birida ✎.
- Xulosa (o'quvchi ma'lumotidan, P-046; faqat 3/3 da): Hikoyangiz yozildi: kim, lahza va o'zgarish — uchalasi kartada. (63)
- Tugma (pastki): Uch kartani yozing (N/3) → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → «Saqlash» (maydon yozilgach halqada) → «Davom etish».
- Artefakt-strip (U-042): shu ekrandan — «Hikoyam · n/3» (ixcham); 9, 10-ekranlarda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon: My Story! (3/3 saqlanganda — bonus, ish bajarilgan; P-048).
- Mentor rejimi: forma o'rniga Mentor misolining «Hikoyam» kartasi (A-6 jadvali); o'quvchilar o'z ekranida yozadi. Mentor statistikasi: «Uch kartani yozganlar».
- O'qituvchi eslatmasi: ≈18 daqiqa. Eng ko'p xato: lahza o'rniga umumiy gap («o'quvchilar qiynaladi») · lahza o'rniga funksiyalar · o'zgarish o'rniga va'da («hamma ishlatadi»). Lahza — o'quvchi o'zi ko'rgan yoki intervyuda eshitgan voqea (9-Modul qoidasi: o'ylab topilmaydi).
  Mahsulotdan hali hech kim foydalanmagan bo'lsa ham hikoya bor: lahza — muammo bo'lgan kun, o'zgarish — mahsulotda endi nima ko'rinadi. Odam — rol bilan; ism, maktab, telefon yozilmaydi. Karta hech kimga yuborilmaydi.
✎ Kirish qatorlari faqat ko'rsatadi — kartaga avtomatik ko'chirilmaydi (o'quvchi lahzani pitch gapidan emas, voqeadan yozadi; P-046). `manba` maydoni yo'q (tayanch 8 sxemasi).

## 9 · Videoga yozish  ← QMustaqil (taymer va telefon; yakka ish)
- Eyebrow: Mustaqil ish · video
- Sarlavha: **Hikoyangizni 1 daqiqada telefonga yozing.** (41) <!-- TAXMIN T12 -->
- Mentor: Telefoningizda video yozishni yoqing, «Taymerni boshlash»ni bosing va hikoyani aytib bering.
- Chap: «Hikoyam» kartasi (8-ekrandan, ixcham; uch qator) — aytayotganda qarab turish uchun. Karta yo'q bo'lsa — Mentor misolining kartasi, ustida kulrang yorliq «Mentor misoli».
- O'ng: taymer — chiziq 0–1:00 va son «m:ss»; 1:00 dan keyin to'xtamaydi — chiziq oxirigacha yetadi, yonida kulrang «+m:ss» (12-Modul taymer naqshi). Taymer ostida ikki kulrang qator: <!-- TAXMIN T12 -->
  - Video faqat telefoningizda qoladi: hech kimga yuborilmaydi va internetga qo'yilmaydi. (85)
  - Yuzingiz ko'rinishi shart emas — ovoz yetadi. Kadrda boshqa odam bo'lmasin. (75)
- Tugmalar: «Taymerni boshlash» → (bosilgach) «To'xtatish» → (to'xtatilgach) ikki tugma bir qatorda: «Video yozildi» · «Yozib bo'lmadi».
  - «Yozib bo'lmadi» → kulrang qator: Hikoyani taymer bilan ovoz chiqarib ayting — videoni uyda yozasiz. (66)
- **Harakat → Vizual o'zgarish:** «Taymerni boshlash» → chiziq uzaya boshlaydi, son sanaydi, «Hikoyam» kartasida qatorlar navbat bilan yengil yonadi (kim → lahza → o'zgarish; vaqtga bog'liq emas, har 20 s da keyingisi);
  «To'xtatish» → son qotadi (masalan «0:52»), 1:00 dan oshgan bo'lsa yonida «+m:ss» qoladi; «Video yozildi» → kartaning tepasida kichik yorliq «video ✓»; «Yozib bo'lmadi» → yorliq «video — uyda».
- Xulosa (holatga qarab): Video yozildi — u faqat telefoningizda qoladi. (46) · «Yozib bo'lmadi»: Video hozir yozilmadi — uyda yozasiz. (37)
- Tugma (pastki): Taymerni boshlang → Davom etish («Video yozildi» yoki «Yozib bo'lmadi» bosilgach; jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: «Taymerni boshlash» (halqada) → «To'xtatish» → «Video yozildi» / «Yozib bo'lmadi» (har birining o'z chegarasi) → «Davom etish».
- Saqlanadi: `pm-m12d2-hikoya.video.yozildi` — «Video yozildi» → `true` · «Yozib bo'lmadi» → `false` · hech biri bosilmagan → `null`; `savedAt` yangilanadi. Taymer soni kalitga yozilmaydi (faqat 10-ekranda ko'rsatiladi — TAYANCHGA SAVOL 10).
- Mentor rejimi: proyektorda taymer va Mentor misolining kartasi; Mentor hikoyani o'zi 1 daqiqada aytib ko'rsatishi mumkin (Mentor videosi yozilmaydi). Mentor statistikasi: «Video yozganlar» (son, ismsiz).
- O'qituvchi eslatmasi: ≈12 daqiqa. Sinfda hamma birdan gapiradi — telefonni og'izga yaqin tuting yoki navbat bilan yozdiring; maktab qoidasi telefonga ruxsat bermasa — hamma «Yozib bo'lmadi» yo'lidan boradi (hikoyani juftlikda emas, o'zi ovoz chiqarib aytadi).
  Videoni ko'rsatishni, yuborishni, sinf chatiga tashlashni so'ramang; kim yozgani qo'l ko'tartirib sanalmaydi. Yuz ko'rinishi shart emas. ⛔ Sinfda bir vaqtda yozish va 12 daqiqa — «qur» pilotida sinaladi.
✎ Telefondagi kamera ilovasi va uning tugma nomlari yozilmaydi (P-028 — umumiy so'z «video yozishni yoqing»); 1 daqiqa — tayanch 1.2 («1 daqiqaga sig'dimi»), yozuv — hikoyaning uch qismi ketma-ket (TAYANCHGA SAVOL 7).

## 10 · O'zingiz tekshiring  ← QMustaqil (o'zini tekshirish varag'i, 3 savol; yakka ish)
- Eyebrow: Mustaqil ish · tekshirish
- Sarlavha (holatga qarab — sarlavha har holatda rost, E 54):
  - `video.yozildi === true`: **Videongizni ko'ring: hikoya qanday chiqdi?** (42)
  - aks holda: **Uyda yozgach, shu uch savolga javob berasiz.** (45) — uch savol tugmasiz ro'yxat bo'lib ko'rinadi (kerak bo'lmagan tugma chizilmaydi — U-051), «Davom etish» faol.
- Mentor: Videoni bir marta ko'ring va har savolga «Ha» yoki «Yo'q»ni bosing.
- Varaq (bitta manba `VIDEO_SAVOL`, tayanch 1.2 — uch savol; har qator — savol · «Ha» / «Yo'q»): <!-- TAXMIN T12 -->
  1) Hikoya lahza bilan boshlandimi? → `lahzaBilan`
  2) Funksiyalar ro'yxatisiz gapirdingizmi? → `royxatYoq` (tayanchdagi «ro'yxat yo'qmi» — «Ha» yaxshi bo'lishi uchun inkorsiz shaklda, TAYANCHGA SAVOL 12)
  3) Hikoya 1 daqiqaga sig'dimi? → `vaqtgaSigdi`; qator yonida kulrang «Taymerda: {m:ss}» (9-ekran taymeridan; to'xtatilmagan bo'lsa — yo'q).
- «Yo'q» bosilgan qator ostida bitta kulrang maslahat va tugma «Kartani ochish» (8-ekrandagi «Hikoyam» kartasi tahrir rejimida, shu qatorga tegishli qism accent):
  - 1 — Lahzani birinchi gapga qo'ying: kun, soat va nima bo'ldi. (50) — Lahza kartasi
  - 2 — Funksiyalar o'rniga bitta o'zgarishni ayting. (41) — O'zgarish kartasi
  - 3 — Har kartadan bitta qisqa gap qoldiring. (39) — uchala karta
  Karta o'zgartirilib «Saqlash» bosilsa — qatorda «Yo'q» yonida yorliq «karta o'zgartirildi» («Yo'q» o'chmaydi: video qayta ko'rilmagan — 13-Modul 2-dars 9-ekran naqshi).
- Tekshiruv (`QXato`, ≤60): javobsiz qator (bloklaydi, video yozilgan bo'lsa): Har savolga «Ha» yoki «Yo'q»ni bosing. (38)
- **Harakat → Vizual o'zgarish:** «Ha» → qator yashil, «Hikoyam» kartasida mos qism ~1 s yashil; «Yo'q» → qator `err` chet, ostida maslahat va «Kartani ochish»; «Saqlash» (karta) → kartadagi o'zgargan qator ~1 s accent, varaq qatorida «karta o'zgartirildi».
- Xulosa (o'quvchi ma'lumotidan, P-046): uchala «Ha» — Uchala savolga «Ha»: hikoya lahzadan boshlandi va 1 daqiqaga sig'di. (68) ·
  «Yo'q» bor — Videoda tuzatadigan joy topildi — kartani o'zgartirib, uyda qayta yozasiz. (74) · video yo'q — xulosa yo'q (sarlavha holatni aytadi).
- Tugma (pastki): Savollarga javob bering (N/3) → Davom etish (video yozilmagan bo'lsa — «Davom etish» boshidanoq faol; jonli darsda `optionalLive`).
- Keyingi bosiladigan joy: birinchi javobsiz qatorning «Ha»/«Yo'q» (har birining o'z chegarasi) → «Yo'q» bo'lsa «Kartani ochish» → «Davom etish».
- Saqlanadi (har javobda): `pm-m12d2-hikoya.video.lahzaBilan` · `.royxatYoq` · `.vaqtgaSigdi` — `true` («Ha») / `false` («Yo'q») / `null` (javobsiz); `savedAt`. O'zgartirilgan karta — `kim` / `lahza` / `ozgarish` maydoniga.
- Nishon: Self Check! (video yozilgan va uchala savolga javob berilganda — javob «Ha» bo'lishi shart emas).
- Mentor rejimi: proyektorda uch savol; Mentor statistikasi: «Uchala savolga javob berganlar» (son). Kim «Yo'q» olgani sanalmaydi va ko'rsatilmaydi.
- O'qituvchi eslatmasi: ≈10 daqiqa. Videoni faqat o'quvchi o'zi ko'radi; quloqchin bo'lmasa — ovozni past qo'yib. «Ha» va «Yo'q» — baho emas, o'z ishini tekshirish: «Yo'q» topilgani yaxshi, keyingi yozuvda tuzatiladi.
  Qayta yozish darsda shart emas (tayanch 1.2 — bir marta ko'radi). ⛔ Sinfda ovozli ko'rish — «qur» pilotida sinaladi.
✎ Uch savol tayanch 1.2 aynan (2-savol shakli — TAYANCHGA SAVOL 12). Varaq kalitga to'rt `bool | null` bo'lib yoziladi, video fayli va havolasi yozilmaydi (sinf 3).

## 11 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; o'quvchining o'z videosi; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Videongizda funksiyalar ro'yxati chiqdi. Nima qilasiz?** · savol ustida yorliq yo'q <!-- TAXMIN T12 -->
  - ✔ A — Ro'yxat o'rniga bitta lahzani aytaman (37)
  - B — Ro'yxatni tezroq aytib, sig'diraman (35)
  - C — Ro'yxatga yana ikki funksiya qo'shaman (38)
  - D — Videoni sinf chatiga tashlab so'rayman (38)
- To'g'ri izohi: Hikoya ro'yxat bilan emas, lahza bilan boshlanadi. (50)
- Xato izohlari: B — Tez aytilgan ro'yxatda ham odam bormi? (38) · C — Ro'yxat uzaydi — bitta lahza qayerda? (37) · D — Video telefoningizda qoladi, hech kimga yuborilmaydi. (52) ·
  (umumiy) Videodan keyingi ikkinchi savolni eslang. (41)
- Javob topilgach (kichik, savol ostida): o'quvchining «Hikoyam» kartasi — Lahza qatori yonadi (karta yo'q bo'lsa — Mentor misoli: «Shanba, 18:00. Maydonda 8 kishi…»).
- Izoh (MD): uch distraktor uch turkumda (sinf 8): B — tezlik (ro'yxat qoladi), C — ko'paytirish (iPhone voqeasiga teskari), D — xavfsizlik (video telefonda qoladi — TAQIQLAR 1). «Ro'yxat» A, B, C da — kalit so'z yolg'iz emas; ✔ eng uzun emas.
  D — hayotda fikr so'rash yomon emas, lekin bu darsning qoidasi bo'yicha video yuborilmaydi (savol «videongizda» deb aynan shu videoni so'raydi — S-004). Kalit ibora 3, 5, 7-ekranlar bilan takrorlanmaydi (S-008).

## 12 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 4 savol (3, 5, 7, 11); 8–10-ekranlar «Saqlash»/«Video yozildi»/javoblar — mentorga signal (`PRACTICE_BASE`, ball yo'q). Kim qanday hikoya yozgani yoki video yozgani sanalmaydi (TAQIQLAR 3).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Hikoyani boshlaydigan gap» · 5 — «2 — iPhone va Mentor hikoyasi» · 7 — «3 — Hikoya pitchda qayerdan» · 11 — «Yakuniy — Videoda ro'yxat chiqsa»

## 13 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi ingichka accent chegara bilan, to'lqin 3 marta (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 14 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha (holatga qarab — sinf 6, E 54; belgi ✓ va nishon faqat birinchi holatda; o'quvchi qilgan ishni aytadi; `pm-m12d2-hikoya` dan):
  - uch karta saqlangan, `video.yozildi: true`, uchala javob `true`: **Hikoyangiz yozildi va videoda tekshirildi.** (42)
  - uch karta saqlangan, `video.yozildi: true`, kamida bitta javob `false`: **Hikoya yozildi — videoda tuzatadigan joy topildi.** (49)
  - uch karta saqlangan, video yozilmagan yoki savollarga javob yo'q (`null`): **Hikoya yozildi, video tekshiruvi hali qilinmagan.** (49) <!-- TAXMIN T12 -->
  - 1–2 karta saqlangan: **Hikoya hali tugamagan: {n} / 3 karta.** (37)
  - birorta karta saqlanmagan: **Mahsulot hikoyasi hali yozilmagan.** (34)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yakunda YO'Q (SABOQ E 50; fikr dars ichida qoladi — A-2).
- Endi siz bilasiz (asosiy fikr so'zma-so'z takrorlanmaydi, T-048):
  - Mahsulot hikoyasi — bitta odam, bitta lahza va mahsulot bilan kelgan o'zgarish. <!-- TAXMIN T19 -->
  - Funksiyalar ro'yxatida odam ham, lahza ham yo'q.
  - Pitchda lahza Muammo bo'lagini ochadi, o'zgarish Yechimda ko'rinadi. <!-- TAXMIN T1 -->
  - iPhone voqeasida Apple ko'p tugmani olib tashlab, keraklisini qoldirgan. <!-- TAXMIN T18 -->
  - Hikoya videosi faqat sizning telefoningizda qoladi. <!-- TAXMIN T12 -->
- Uyga vazifa (`HwCard` — P-025 karta shaklida; yakunda aynan shu qadamlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: o'z pitchingiz · Nechta: 1 hikoya · Muddat: keyingi darsgacha
  - ① (holatga qarab) Video yozilmagan bo'lsa — hikoyangizni 1 daqiqada telefonga yozing va uch savolga javob bering. · «Yo'q» chiqqan bo'lsa — tuzatilgan kartadan qayta yozib, o'sha savolni tekshiring. · Hammasi «Ha» — ko'rinmaydi. <!-- TAXMIN T12 -->
  - ② Hikoyangizni ota-onangizga yoki sinfdoshingizga ayting va so'rang: qaysi lahza esda qoldi?
  - ③ (shartli) Yozilmagan karta qolgan bo'lsa — uni to'ldiring. Hammasi yozilgan bo'lsa ③ ko'rinmaydi.
  - Karta ostida (bitta kulrang qator): Videoni hech kimga yubormang va internetga qo'ymang. (52) <!-- TAXMIN T12 -->
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib (E 50): belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. «Bugungi asosiy fikr» qutisi, holat yorliqlari, artefakt-strip — yakunda yo'q. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Kim uchun» — HwCard yorlig'i (01 bilan bir). Muddat «keyingi darsgacha» — keyingi dars nomi faqat «Keyingi dars» qatorida (T-038; 3-dars mazmuni va'da qilinmaydi). ② — real odam bilan, lekin baho so'ralmaydi: faqat qaysi lahza esda qolgani (javob yozilmaydi, kalitga tushmaydi).
  ① va ③ — shartli (ishi qolmagan o'quvchiga ko'rinmaydi — sinf 14). Video uyda ham telefonda qoladi.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi, ≤48 belgi)
- **One Moment!** (3-ekran, 1-savol birinchi urinishda) — Lahzali gapni birinchi urinishda topdingiz (42)
- **Fewer Buttons!** (5-ekran, 2-savol birinchi urinishda) — iPhone voqeasidagi umumiy joyni topdingiz (41) <!-- TAXMIN T18 -->
- **My Story!** (8-ekran, uch karta saqlanganda — bonus) — Mahsulot hikoyangizni uch kartaga yozdingiz (43)
- **Self Check!** (10-ekran, video yozilgan va uchala savolga javob berilganda) — Videongizni ko'rib, uch savolga javob berdingiz (47) <!-- TAXMIN T12 -->
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (My Story!, S-034: ish qilingan ekranda). 7-ekran va yakuniy savol nishonsiz; 2, 4, 6-ekranlar (ballsiz tushuncha va keys) va 9-ekran nishonsiz. Self Check! — javob mazmuniga emas, tekshirish qilinganiga (rost holat — sinf 6).
- Nomlar `src/` va `feedback/F-1008-14modul/` da band emas (grep 08.10: 0).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Hikoyani boshlaydigan gap** — 1 Funksiyalar ro'yxatida odam ham, lahza ham yo'q. · 2 Lahza — bo'lib o'tgan bitta voqea: kuni, soati va nima bo'lgani. · 3 Umumiy gap va va'da — lahza emas.
  — Sinfga savol: Mahsulotingiz hikoyasi qaysi lahzadan boshlanadi?
- **5 · iPhone va Mentor hikoyasi** — 1 2007-yilda telefon kompaniyalari ko'p tugma bilan bellashgan. · 2 Apple ko'p tugmani olib tashlagan: bitta ekran va Home tugmasi qolgan. · 3 Mentor ham ro'yxatni olib tashlab, bitta lahzani qoldirdi. <!-- TAXMIN T18 -->
  — Sinfga savol: Pitchingizdan nimani olib tashlaysiz?
- **7 · Hikoya pitchda qayerdan** — 1 Lahza Muammo bo'lagini ochadi. · 2 O'zgarish Yechimda, jonli demo bilan ko'rinadi. · 3 Raqamlar bo'lagi mahsulotda nechta foydalanuvchi borligini aytadi. <!-- TAXMIN T1 -->
  — Sinfga savol: Sizning lahzangiz qaysi bo'lakni ochadi?
- **11 · Videoda ro'yxat chiqsa** — 1 Videodan keyin uch savol: lahza bilan boshlandimi, ro'yxatsiz gapirdimmi, 1 daqiqaga sig'dimi. · 2 Ro'yxat chiqsa — uning o'rniga bitta lahza aytiladi. · 3 Video faqat telefoningizda qoladi. <!-- TAXMIN T12 -->
  — Sinfga savol: Ro'yxat o'rniga qaysi lahzani aytasiz?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·10 · B 2·7·12 · C 3·6·9 · D 4·8·11 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Bizda mahsulot hikoyasi qaysi uch qismdan iborat? (2) <!-- TAXMIN T19 -->
   - ✔ Kim, lahza va o'zgarish
   - Muammo, Bozor va Jamoa
   - Funksiya, ekran va tugma
   - Logotip, rang va shrift
2. Mentor misolida lahza qachon bo'lgan? (2)
   - Juma kuni, soat 18:00 da
   - ✔ Shanba kuni, soat 18:00 da
   - Yakshanba kuni, soat 9:00 da
   - Dushanba kuni, tanaffusda
3. Mentor lahzasida maydonda nechta odam bo'lgan? (2)
   - 10 kishi
   - 9 kishi
   - ✔ 8 kishi
   - 2 kishi
4. Mentor hikoyasida o'zgarishdan keyin ekranda nima ko'rinadi? (2)
   - 8 / 10, ikki joy hali bo'sh
   - 10 / 10, hamma joy to'ldi
   - 0 / 10, hech kim yozilmadi
   - ✔ 9 / 10, bitta joy bo'sh
5. Funksiyalar ro'yxati zalga nimani aytadi? (0, 2)
   - ✔ Mahsulotda nimalar borligini
   - Kimda qanday muammo bo'lganini
   - Qaysi kuni nima bo'lganini
   - Mahsulot nima o'zgartirganini
6. Telefon kompaniyalari 2007-yilda nima bilan bellashgan? (4) <!-- TAXMIN T18 -->
   - Kimda tugma kamroq ekani bilan
   - Kimda Home tugmasi borligi bilan
   - ✔ Kimda tugma ko'proq ekani bilan
   - Kimda iPod pleeri borligi bilan
7. Apple iPhone'dan nimalarni olib tashlagan? (4) <!-- TAXMIN T18 -->
   - Ekran va Home tugmasini
   - ✔ Klaviatura va stilusni
   - Telefon va internetni
   - iPod musiqa pleerini
8. Jobs iPhone'ni qaysi ibora bilan taqdim etgan? (4) <!-- TAXMIN T18 -->
   - Ikki qurilma bittada
   - To'rt qurilma bittada
   - Bitta tugmali telefon
   - ✔ Uch qurilma bittada
9. Hikoyadagi o'zgarish pitchning qaysi bo'lagida ko'rinadi? (6) <!-- TAXMIN T1 -->
   - Bozor bo'lagida
   - Muammo bo'lagida
   - ✔ Yechim bo'lagida
   - Keyingi qadamda
10. Hikoyadan keyin Raqamlar bo'lagi nimani aytadi? (6) <!-- TAXMIN T1 -->
    - ✔ Mahsulotda nechta foydalanuvchi borligini
    - Lahza qaysi kuni va soatda bo'lganini
    - Mahsulotni kim va qanday qilayotganini
    - Pitch oxirida hakamlardan nima so'ralishini
11. Videoni ko'rgach o'zingizga qaysi savolni berasiz? (10)
    - Video nechta layk to'plab oldi
    - Videoni qaysi chatga tashlayman
    - Kadrda yuzim yaxshi chiqdimi
    - ✔ Hikoya lahza bilan boshlandimi
12. Hikoya videosi qayerda qoladi? (9) <!-- TAXMIN T12 -->
    - Sinf chatida, hamma ko'rishi uchun
    - ✔ Faqat o'zingizning telefoningizda
    - Maktab saytida, ochiq havola bilan
    - Mentorning telefonida, tekshiruvga
- Arena yozuvlari — platforma shabloni (namuna 12-Modul YAKUNIY dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — hikoya, lahza, o'zgarish, pitch, bo'lak, ro'yxat, video, taymer, zal, telefon · uyga vazifa banneri — hikoya, lahza, video, pitch (faqat so'z, emojisiz).
- Izoh (MD): 2 — juma (o'zgarish kuni) va dushanba (3-ekrandagi kitob misoli) — darsdagi boshqa kunlar; 3 — 10 (kerakli son), 9 (o'zgarishdagi son), 2 (kelmaganlar) — darsdagi boshqa sonlar (sinf 7); 4 — «ikki joy hali bo'sh» — o'zgarishdan oldingi holat, «hamma joy to'ldi» va «hech kim yozilmadi» — darsda yo'q holatlar;
  6 — «kamroq tugma» bank faktini teskari o'qish, Home va iPod — iPhone'ning o'z tafsilotlari (raqobatchilarniki emas); 8 — ikki va to'rt — bir turkum (son), «bitta tugmali telefon» — boshqa turkum;
  10 — B, C, D boshqa bo'laklarning ishi (Muammo lahzasi, Jamoa, Keyingi qadam); 11 — layk va chat — ommaviy joy (TAQIQLAR 1), «yuzim yaxshi chiqdimi» — baho (yuz ixtiyoriy); 12 — uchala noto'g'ri joy darsning video qoidasiga zid.
  Arena 1 «bizda» — kurs qolipi (sinf 4). 6 — savoldagi 2007 kalitda takrorlanmaydi (S-019).

## Kartochkalar (12) — 13-ekran
| Old tomon | Orqa tomon |
|---|---|
| Mahsulot hikoyasi nima? | Bitta odam, bitta lahza va mahsulot bilan kelgan o'zgarish (inglizchasi: storytelling) <!-- TAXMIN T19 --> |
| Funksiyalar ro'yxati nega hikoya emas? | Unda odam ham, lahza ham yo'q: faqat mahsulotda nima borligi |
| Lahzada nima bo'ladi? | Kun yoki soat, joy va nima bo'lgani: bo'lib o'tgan bitta voqea |
| 9-Modulda hikoya qanday ta'riflangan? | Bitta real odam bilan bo'lib o'tgan ish: u yozuvdan olinadi, o'ylab topilmaydi |
| Mentor misolida lahza qanday? | «Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.» |
| Mentor misolida o'zgarish qanday? | «Endi tashkilotchi juma kuni ko'radi: 9 / 10, bitta joy bo'sh.» |
| Hikoya pitchning qaysi bo'lagini ochadi? | Muammo bo'lagini: u lahza bilan boshlanadi <!-- TAXMIN T1 --> |
| Hikoyadagi o'zgarish pitchda qayerda ko'rinadi? | Yechim bo'lagida, jonli demo bilan <!-- TAXMIN T1 --> |
| Apple 2007-yilda iPhone'dan nimani olib tashlagan? | Klaviatura, stilus va deyarli hamma tugmani: bitta ekran va Home tugmasi qolgan <!-- TAXMIN T18 --> |
| Jobs iPhone'ni qanday taqdim etgan? | «Uch qurilma bittada»: iPod, telefon va internet <!-- TAXMIN T18 --> |
| Videoni ko'rgach qaysi uch savolga javob berasiz? | Hikoya lahza bilan boshlandimi, funksiyalar ro'yxatisiz gapirdimmi, 1 daqiqaga sig'dimi |
| Hikoya videosi qayerda qoladi? | Faqat sizning telefoningizda: hech kimga yuborilmaydi va internetga qo'yilmaydi <!-- TAXMIN T12 --> |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (mahsulot hikoyasi, lahza, o'zgarish — 2 · ro'yxat — 0, 2 · 9-Modul ta'rifi — 2 `QIzoh` · Mentor lahzasi va o'zgarishi — 2, 8 Yordam · Muammo, Yechim — 6 · Apple, Jobs — 4 · uch savol — 10 · telefon — 9).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan; «Mahsulot hikoyasi nima?» — atama → ta'rif). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). Inglizchasi «storytelling» — faqat shu yerda bir marta.

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/12-Modull/PmStoryPitchLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m12d2-v1` · «Mahsulotingiz hikoyasini qanday aytasiz?».
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s6 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s4 `QVoqea` · s3/s5/s7/s11 `QTest` (`QuestionScreen` mantig'i, DE-203) · s8/s9/s10 `QMustaqil` · s12 `QNatija` · s13 `QKartochka` · s14 `QYakun`.
2. **`HikoyaSahna`** — bitta vizual (180): telefon (`JamoaTelefon`: «O'yin» ekrani, «8 / 10» → «9 / 10», «Juma» yorlig'i; ≈170×272 barqaror) · hikoya chizig'i (uch uya: `kim` — odam qiyofasi · `lahza` — maydon chizmasi 10 joy, 8 qiyofa, 2 uzuq · `ozgarish` — kichik ekran) ·
   `rejim: 'royxat' | 'hikoya' | 'pitch' | 'oquvchi'` · ro'yxat nomlari (`FUNKSIYA_ROYXAT`) · pitch tasmasi (olti bo'lak + taymer chizig'i `VAQT`, Muammo qismi 0-ekranda) · zal (3 qiyofa, reaksiyasiz; faqat s0) · telefonsiz rejim (s6, s8–s10).
   1-dars `OltiBolakSahna` dan ko'chirilmaydi — dars ichida (K-020). `reduced-motion`; 393 da hikoya chizig'i telefon ostida, pitch tasmasi 3 + 3. Qolip-maket izohi faylda e'lon qilinadi (`// qolip-maket: …`).
3. **Bitta manbalar (180, P-063):** `MENTOR_HIKOYA` `{ kim, lahza, ozgarish }` (A-6 aynan) · `FUNKSIYA_ROYXAT` (6) · `JAMOA_PITCH` (tayanch 1.1 aynan, olti gap; s6 kulrang birinchi qatorlar) · `VAQT` `[40, 30, 90, 60, 30, 50]` (9.1) ·
   `HAKAM_SAVOL.muammo` (9.3 aynan) · `IPHONE_KADR` 3 × `{ h, m }` (s4 — 11-Modul kodi 1218-qator bilan so'zma-so'z: uz/ru) · `VIDEO_SAVOL` 3 `{ id: 'lahzaBilan' | 'royxatYoq' | 'vaqtgaSigdi', t, maslahat, karta }`.
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); taymer chizig'i 0–40 s, funksiya nomlari chiziq bo'ylab; tanlovga qarab nomlar ✓ yoki nomsiz uzuq uya.
5. s2: `QBashorat` (bitta · uchta · hammasi) → 3 tugma (kim + `QIzoh` · lahza + `QIzoh` · o'zgarish + `QIzoh`); xulosa — ta'rif (T-042 so'zma-so'z — kartochka 1, yakun 1); natija va `QIzoh` — yashil xulosa qutisi ichida (E 42); 40 s ipucha.
6. s8: 3 bosqichli forma (ketma-ket karta, E 53); o'qiydi `pm-m12d1-pitch.bolaklar.muammo`, `.yechim` (faqat kulrang qator, kartaga ko'chirilmaydi). Tekshiruv funksiyasi: bo'sh · 60/160 · lahzada raqam yoki kun/vaqt so'zi
   (`/\d/` yoki `dushanba|seshanba|chorshanba|payshanba|juma|shanba|yakshanba|kecha|bugun|ertalab|kechqurun|tanaffus|soat|hafta|oy`) · umumiy so'zlar · vergul ≥ 3 · `VADA_RE` · `TEXNO_RE` — PM-108 tartibida kamida 10 namuna bilan `node` da sinaladi (apostrof `normT` bilan — 12-Modul naqshi).
   Artefakt-strip «Hikoyam» (U-042); nishon `myStory`.
7. s9: taymer (`useTaymer`; 1:00 dan keyin «+m:ss»; to'xtatilgan soniya faqat holatda — s10 «Taymerda» qatori uchun, kalitga yozilmaydi) · tugmalar «Taymerni boshlash» / «To'xtatish» / «Video yozildi» / «Yozib bo'lmadi» · «Hikoyam» kartasida qatorlar har 20 s da navbat bilan yonadi.
   Kamera yoki mikrofon ruxsati **so'ralmaydi** — dars brauzerda yozmaydi, o'quvchi o'z telefonining kamerasidan foydalanadi (getUserMedia yo'q).
8. s10: `VIDEO_SAVOL` varag'i («Ha»/«Yo'q»); «Yo'q» → maslahat + «Kartani ochish» (s8 kartasi modal yoki joyida tahrir; `qism` accent); «karta o'zgartirildi» — sessiya holati (kalitga yozilmaydi); sarlavha `video.yozildi` ga qarab (2 holat); nishon `selfCheck`.
9. **Saqlash** `localStorage` `pm-m12d2-hikoya` = `{ kim, lahza, ozgarish, video: { yozildi, lahzaBilan, royxatYoq, vaqtgaSigdi }, savedAt }` (tayanch 8 aynan) — `kim` (≤60), `lahza`, `ozgarish` (≤160): `string` yoki `null` (hali saqlanmagan);
   `video.*`: `bool | null` (`null` — hali javob yo'q); har «Saqlash» va har javobda o'sha maydon yoziladi (birlashtiriladi), `savedAt` yangilanadi. Ism, telefon, video fayli, havola hech qaysi maydonga yozilmaydi (sinf 3). Boshqa darsning kalitiga yozmaydi (`pm-m12d1-pitch` — faqat o'qiladi).
10. **App.jsx** (asosiy seans; bu agent tegmaydi): `m12-02` qatoriga `comp: PmStoryPitchLesson` + import. `sub` o'zgarmaydi.
11. Testlar s3/s5/s7/s11 — `correctIdx` 1/3/2/0 = `INLINE_KEYS`; `RECAPS` 3/5/7/11 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). Kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4).
    Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
12. Jonli ball: `INLINE_KEYS` = { s3: 1, s5: 3, s7: 2, s11: 0, royxatLahza: -1, iphone: -1, pitchdaHikoya: -1, hikoya: -1, video: -1, tekshirish: -1 }; `SCREEN_META` == screens; `SCREEN_INTENTS`.
13. `ACHIEVEMENTS` 4 (`oneMoment`, `fewerButtons`, `myStory`, `selfCheck`) · `FLASHCARDS` 12 · s14 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z · «Bugungi asosiy fikr» — yakunda yo'q (E 50) ·
    yakun sarlavhasi — saqlangan kartalar soni va `video` dan (5 holat) · `HW_TOKENS` — faqat so'z · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
14. Uyga vazifa — `HwCard` («Kim uchun · Nechta · Muddat», 3 band, ① holatga qarab, ③ shartli); alohida `.homework.jsx` yo'q.
- Darvozalar: `npm run gates -- src/12-Modull/PmStoryPitchLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).
  ⚠️ CSS izohida va kod namunasi ichida backtik yo'q (CLAUDE.md); qo'shtirnoqli gaplar («uch qurilma bittada», «Saqlash») — JS satrida ekranlanadi.

## REPO
Amaliy blok yo'q (PM darsi, kod ekrani yo'q) — o'quvchi repo'siga ham, `maydon-jamoa` ga ham tegilmaydi; video repo'ga qo'shilmaydi. <!-- TAXMIN T4 -->

| Teg | Holat |
|---|---|
| `m14-dars-02-start` | = `m14-dars-01-done` (= `m13-dars-12-done`) |
| `m14-dars-02-done` | = `m14-dars-02-start` (tayanch 3 jadvali) |

«Ortda qoldingizmi» bu darsda yo'q (tayanch 3: birinchi amaliy blokda — 3-dars).

## Manbalar (o'zim tekshirgan fayl va qatorlar, 08.10.2026)
- `PM_Prompt_v8.md` 263–266 (K19) — o'qidim. Ruscha asl: «В 2007 конкуренты соревновались, у кого больше кнопок (Nokia, BlackBerry — клавиатуры, стилусы). Apple убрала клавиатуру, стилус и почти все кнопки — один экран и кнопка Home. Джобс представил iPhone как «три устройства в одном»: iPod + телефон + интернет. Побеждает не тот, у кого больше функций, а тот, у кого правильные.» ·
  «Цифры: Без цифр (презентация 9 января 2007 — запись публична, можно показать фрагмент).» · «Темы: фокус · отсев фич · приоритизация · UX · презентация продукта». Bank qoidasi (156–161): «без цифр» — raqam qo'shilmaydi.
- `feedback/F-1008-14modul/00-MODUL-TAYANCH.md` 1.0, 1.1, 1.2, 1.14, 2, 3, 4, 5, 7, 8, 9 · `00-TAQIQLAR.md` · `00-NOMLAR.md` · `00-MANBA.md` 1, 4, 6 · `qaror-0.json` va `JURNAL.md` «TAXMINLAR» · `MD_TOPSHIRIQ_2.md`.
- `src/App.jsx` 467–469 (`m12-01`, **`m12-02`** nomi va osti, `m12-03` nomi) — grep 08.10.
- 9-Modul `feedback/F-1005-9modul/12-PmUserStoryPitch-v3.md` A-4 (hikoya ta'rifi), 2 va 4-ekran xulosalari · `src/7-Modull/PmUserStoryPitchLesson.jsx` 67, 72, 842 (dars nomi, «hikoya» — o'tilgan) — grep va o'qish.
- 11-Modul `feedback/F-1005-11modul/16-PmPrototypePitch-v3.md` 6-ekran (K19, brend izohlari, ranglar) · 11-Modul tayanchi 307, 522–523 (K19 bank tarjimasi, 9.97) · `src/9-Modull/PmPrototypePitchLesson.jsx` 278, 1218, 1302 («uch qurilma bittada» uz/ru) — o'qidim.
- 13-Modul tayanchi 1.0, 1.11–1.13, 2, 7 · 13-Modul `00-TAQIQLAR.md` · 13-Modul `02-PmMonetization-v3.md` + `02-FILTR.md` (keysli PM shakli) · pilot `01-PmInvestorPitch-v3.md` + `01/03/07-OZ-AUDIT.md`.
- `MATN_KORPUS.md` 1–720 va §101, §119, §122, §124, §154, §162–§163, §178, §204–§205, §208, §215–§219 · `konveyer/1-MD.md` · `konveyer/QURISH_KARTASI.md` · `src/qolip/QOLIP.md` · `QURUVCHI_SABOQ.md` E 40–55.
- Tashqi (internet) fakt bu darsda yo'q: K19 — faqat bank; telefon kamerasi, ekran yozish dasturlari, Lighthouse, Upwork — tilga olinmaydi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **«hikoya» o'tilgan (9-Modul 12-dars «Pitchingizda kimning hikoyasi bor?», `m7-12`):** ta'rif «Hikoya — bitta real odam bilan bo'lib o'tgan ish. U yozuvdan olinadi, o'ylab topilmaydi.» `00-MANBA.md` 4 dagi «hikoya — o'tilmagan» — grep xatosi.
   Yechimim (T-052): 2-ekranda 9-Modul ta'rifi bilan tenglashtirdim, bugungi atama — **«mahsulot hikoyasi»**: «Mahsulot hikoyasi — bitta odam, bitta lahza va mahsulot bilan kelgan o'zgarish.» (tayanch 2 dagi «… orqali aytish» — ot-ta'rif shakliga). Tayanch 2 qatorini shunga yangilashni va MANBA 4 ni tuzatishni taklif qilaman (5, 9-darslar ham shu so'z bilan).
2. **K19 11-Modul 16-darsida bosh-keys bo'lgan** (`m9-16`, «yechim bir gapda») — tayanch 5 da faqat K12 uchun «boshqa modul, ruxsat» yozilgan. Boshqa modul — ruxsat deb oldim; bugungi burchak boshqa (A-8). Tayanch 5 ga eslatma qo'shish taklifi.
3. **«uchta qurilma bittada» (tayanch 1.2) ↔ «uch qurilma bittada» (11-Modul kodi va YAKUNIY)** — o'quvchi ikkinchisini ko'rgan; T-052/T-014 bo'yicha 11-Modul so'zini oldim (ru «три устройства в одном» — bir xil). Tayanch 1.2 ni tuzatish taklifi.
4. **K19 ko'prigi:** tayanch «xususiyatlar ro'yxati o'rniga bitta hikoya chizig'i» — bank Jobs taqdimotida ro'yxat bo'lmaganini aytmaydi (haqiqiy taqdimotda ko'p funksiya ko'rsatilgan bo'lishi mumkin — PM-018 xavfi). Ko'prikni bank faktiga toraytirdim: Apple ko'p tugmani olib tashlagan, keraklisi qolgan ↔ Mentor ro'yxatni olib tashlab, lahzani qoldirgan (5-ekran «umumiy joy»).
5. **«zal zerikdi» (MD_TOPSHIRIQ_2, 2-eslatma):** zal reaksiyasi — o'ylab topilgan real odam gapi (TAQIQLAR 0) va «zerikarli» — baho-so'z (TAQIQLAR 3). Hodisani tekshiriladigan qildim: ro'yxat bilan boshlangan pitch «zal birinchi 40 soniyada nimani bilib oladi?» — mahsulotda nima borligini; kim va qanday muammo — yo'q. Sahnada reaksiya chizilmaydi. Mentor pitchi ro'yxat bilan «boshlangan» deb ham aytilmaydi (1-dars qoralamasida Muammo ro'yxat emas — ichki izchillik, sinf 12).
6. **«Raqamlar — shunday lahzalar nechta» (tayanch 1.2):** Mentor Raqamlar gapida lahzalar soni yo'q (51 — ro'yxatdan o'tgan foydalanuvchi). Yolg'on model bo'lmasligi uchun (T-045): «Raqamlar bo'lagi mahsulotda nechta foydalanuvchi borligini aytadi»; «nechta odamda shunday bo'lgan» — Muammo dalili (5 dan 4) — 6-ekran 1-`QIzoh`. 12-Moduldagi «to'lgan o'yinlar 1 → 3» mos kelardi, lekin 1.14 da yo'q son — olmadim.
7. **Video — «pitchning birinchi daqiqasi (hikoya qismi)»:** 9.1 taqsimotida birinchi daqiqa — Muammo (40) va Bozorning boshi; o'zgarish esa Yechimda. Videoga hikoyaning uch qismini ketma-ket, 1 daqiqagacha yozdirdim (mashq); pitchda ular bo'laklarga bo'linadi (6-ekran). Tayanch 1.2 so'zini shunga aniqlashtirish taklifi.
8. **Mentor pitchida lahza:** qoralama matni o'zgarmaydi (9.2); aytilganda Muammo lahza bilan ochiladi (≈8 soniya, 40 soniya ichida). 5, 8, 13-darslar Mentor pitchini lahza bilan aytadimi — to'lqin kelishuviga (taklif: ha, 1.2 aynan lahza bilan).
9. **Ota-ona roziligi (TAQIQLAR 1, video):** 2-darsda video telefondan chiqmaydi — alohida rozilik qadami qo'ymadim; telefon yoki ruxsat yo'q bo'lsa «Yozib bo'lmadi» yo'li bor, yakun rost. 9-darsdagi (ommaviy emas, havola) rozilik qadami bilan farq — tasdiq kerak.
10. **`pm-m12d2-hikoya`:** `kim` ≤60, `lahza` va `ozgarish` ≤160, `string | null`; `video.*` `null` — javob yo'q; taymer soniyasi kalitga yozilmaydi (sxemada yo'q). 5-dars «1 daqiqaga sig'dimi» dan ko'proq aniqlik kerak bo'lsa — `vaqt: n | null` qo'shish mumkin.
11. **Funksiyalar ro'yxati — tayanch 1.0 dagi real funksiyalar** (o'yin e'loni, qo'shilish, eslatmalar, Telegram xabari, taklif havolasi, Pro). Tayanch 1.2 dagi «ilovada 12 ta funksiya bor» misoli ishlatilmadi: «12» — 1.14 da yo'q son.
12. **Uch savolning ikkinchisi:** tayanch «funksiyalar ro'yxati yo'qmi» — inkor-savol, «Ha» va «Yo'q» ma'nosi chalkashadi (S-006). Shakl: «Funksiyalar ro'yxatisiz gapirdingizmi?» («Ha» — ro'yxat yo'q); maydon `royxatYoq` ma'nosi o'zgarmadi.
13. **`lahza` detektori** (8-ekran) — kun/vaqt so'zlari ro'yxati yo'naltiradi, bloklamaydi: «Bir kuni maydonga borsak…» kabi rost lahza ham ushlanishi mumkin (soxta signal — ikkinchi «Saqlash» bilan o'tadi).
14. **Uyga vazifa ② — real odam bilan** (ota-ona yoki sinfdosh): «qaysi lahza esda qoldi?» — baho emas, javob yozilmaydi. «Sinov» so'zi ishlatilmadi (T-015). Kerak emas deb topilsa — olib tashlanadi, ① yetadi.

## Shubhali joylar (ishonchim komil emas)
- ⛔ **«Qur» darvozasi:** 9–10-ekranlar — sinfda 12–15 o'quvchi bir vaqtda video yozishi (shovqin), maktab telefon qoidasi, quloqchinsiz ko'rish va 22 daqiqa — pilotda taymer bilan · 6-ekran — uch uya + olti bo'lakli tasma 1280×800 da skrollsiz sig'ishi (U-006) ·
  8-ekran tekshiruv funksiyasi (lahza detektori, vergul) — `node` da namuna bilan · 0-ekran — 40 soniyalik chiziq hook uchun uzun bo'lsa, sahnada tezlashtiriladi (~4 s, «40 soniya» yorlig'i qoladi).
- **«lahza» so'zi** — 13 yoshli o'quvchi uchun «bir lahza» (qisqa vaqt) ma'nosi tanishroq; darsda «bo'lib o'tgan bitta voqea» ma'nosida. o'quvchi o'qishida (`OQUVCHI_DARVOZA.md`) tekshirilsin; tushunilmasa — «voqea» (9-Modul so'zi «bo'lib o'tgan ish»ga yaqin) bilan almashtirish mumkin (kalit maydoni `lahza` — tayanch 8, o'zgarmaydi).
- **«uch qurilma bittada» — o'zi ham uch narsali ro'yxat.** O'quvchi «bu ham ro'yxat-ku» deyishi mumkin; javob O'qituvchi eslatmasida yo'q — farq: tinglovchi tanigan uch narsa, mahsulotdagi funksiyalar emas. Auditor ko'rsin.
- **K19 ikkinchi marta** (11-Modulda bosh-keys) — o'quvchi «bu voqeani ko'rganmiz» deydi; sarlavha, bashorat va xulosa yangi, kadr gaplari esa 11-Modul bilan bir. Takror zerikarli tuyulsa — 4-ekranni qisqartirish (2 kadr) mumkin.
- **Raqamlar qatori** (6-ekran 3-tugma) — «hikoya bitta odam, Raqamlar — foydalanuvchilar soni»: tayanchdagi «shunday lahzalar nechta» dan kuchsizroq; 51 ni «lahzalar soni» deb o'qish xavfi O'qituvchi eslatmasida yopildi.
- **Mentor o'zgarishi** «Endi tashkilotchi juma kuni ko'radi: 9 / 10» — ilova imkoniyati, real voqea emas; «o'yin bo'ldi» degan natija yo'q (tayanch aynan). O'quvchilar o'zgarishni natija deb yozishi mumkin («endi hamma keladi») — `VADA_RE` qisman ushlaydi.
- **Arena 11** — «Video nechta layk to'plab oldi» kabi distraktorlar hazilday tuyulishi mumkin (§21: o'zini fosh qiladigan variant). Ular darsning video qoidasiga zid bo'lgani uchun qoldirdim; kuchsiz deb topilsa — almashtiriladi.
- **0-ekran «Aynan!»** — faqat «funksiyalar» varianti; 01 pilotidagi kabi bitta «Aynan!» (sof so'rovnoma emas). «voqea» variantini tanlagan o'quvchi to'g'ri yo'nalishda — javobi «Qiziq fikr!» bilan, rad etilmaydi.

---

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 18 band)
1. [x] **90 daqiqa — reja** — A-13: taqsimot (≈88 + 2 zaxira), «Ulgurmasangiz» (8 — saqlangani qoladi, ③; 9 — «Yozib bo'lmadi», ①; 10 — o'tib ketiladi; arena qisqarsa — kartochkalar uyda), ⛔ pilotda taymer (9–10); «sig'adi» yo'q. Amaliy blok yo'q.
2. [x] **Tekshirilmagan tashqi qadam** — telefon kamerasi va uning tugmalari yozilmagan (umumiy so'z «video yozishni yoqing» — 9 ✎); sinfda yozish, telefon qoidasi, ovozli ko'rish — ⛔ «qur» (Shubhali joylar); K19 — faqat bank.
3. [x] **Saqlash kaliti — shartnoma** — `pm-m12d2-hikoya` tayanch 8 aynan (KOD 9): `string | null`, `video` to'rt `bool | null` (uch holat), `savedAt`; video fayli, havola, ism yozilmaydi; `pm-m12d1-pitch` — faqat o'qiladi; boshqa kalitga yozmaydi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida» (8 Yordam, arena 2–4), «Bu misolda» (6 xulosa), «Bu voqeada» (4 xulosa), «Bizda» (arena 1); uch qism — o'quvchi uchun tayanch; K19 — «bu bitta voqea» (4 eslatma).
5. [x] **Kafolat va sabab da'vosi yo'q** — «zal eslab qoladi», «hikoya yutadi» yo'q (A-9); zal reaksiyasi chizilmaydi (0); o'zgarish — imkoniyat, «muammo yo'qoldi» emas (2 eslatma); K19 bank xulosasi umumiy qoida qilinmagan (A-8); Self Check! — tekshirish fakti.
6. [x] **Yakun, nishon — faqat rost holatda** — 14-ekran 5 holat (hech narsa yozilmagan holati bilan — E 54); ✓ va nishon faqat birinchisida; 10-ekran sarlavhasi video holatiga qarab; «karta o'zgartirildi» — «Yo'q» o'chmaydi (video qayta ko'rilmagan).
7. [x] **Ta'rif sanaladigan** — mahsulot hikoyasi — uch qism (sanaladigan, 8-ekran kartalari bilan bir); lahza — kun/soat, joy, nima bo'lgani (kartochka 3, detektor); 51 — ro'yxatdan o'tgan foydalanuvchi, lahzalar soni emas (6 eslatma).
8. [x] **Test: bitta himoyalanadigan javob** — s3 (ro'yxat · umumiy gap · va'da), s5 (teskari o'qish · olamlar aralashuvi · bankka zid), s7 (tartib · vaqt · ro'yxat), s11 (tezlik · ko'paytirish · xavfsizlik); har testda uch turkum; s3 C — «rost, lekin mos emas» (S-004).
9. [x] **Real odamlar xavfsizligi** — video telefonda qoladi, yuz ixtiyoriy, kadrda boshqa odam yo'q (9); hikoyadagi odam — rol bilan, ismsiz (8); podium — faqat test ballari, kim video yozgani sanalmaydi (9, 12); zal va hakam — ismsiz, gapsiz; uyga vazifa ② — baho so'ralmaydi.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bu darsda agent ishlamaydi; 10-ekrandagi tekshirish — o'quvchining o'zi (agentsiz, akkauntsiz).
11. [x] **Web-trek teng yo'l** — «mahsulot» so'zi (A-5, A-11); o'zgarish — sahifa yoki ilova ekrani; testlar va arena ikkala trekka to'g'ri; video — telefon kamerasi (trekdan qat'i nazar).
12. [x] **Mentor misoli ichki izchil** — lahza va o'zgarish tayanch 1.2 aynan; qoralamaning olti gapi 1-dars bilan bir (1.1 aynan, 6-ekran); Mentor pitchi «ro'yxat bilan boshlangan» deyilmaydi; 3-dars natijasi oldindan ochilmaydi; grafik yo'q (9.14).
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — 8-ekran: kartalar bo'sh (pitch qatorlari faqat ko'rsatiladi, ko'chirilmaydi); Mentor gaplari faqat Yordam'da («Mentor misolida»); hikoya o'quvchining voqeasidan.
14. [x] **Uyga vazifa yengil va aniq** — 1 hikoya, ① holatga qarab, ② bitta savol, ③ shartli; muddat — keyingi darsgacha; videoni yuborish yo'q.
15. [x] **Ayb da'vosi yo'q** — xato izohlari va `QXato` lar aniq keyingi qadamni aytadi («kun, soat yoki son qo'shing», «bitta voqeani yozing»); «Yozib bo'lmadi» — ayb emas, yo'l; «Yo'q» — baho emas (10 eslatma).
16. [x] **Kelajak va'dasi yo'q** — s3 D va s8 `VADA_RE` — va'da distraktor/detektor sifatida; o'zgarish — «mahsulot bugun ko'rsata oladigan narsa»; Demo Day, 3-dars mazmuni va'da qilinmaydi.
17. [x] **Pul va investitsiya** — bu darsda pul so'ralmaydi va tilga olinmaydi; Raqamlar qoralamasidagi «yozma tasdiq — bu hali to'lov emas» o'zgarmagan (6-ekran kulrang, 1.1 aynan); Pro — faqat funksiyalar ro'yxatida nom.
18. [—] **Yosh va rasmiy shartlar** — bu darsda xalqaro sayt va dastur yo'q; yosh tilga olinmaydi (video qoidasi — TAQIQLAR 1, rasmiy shart emas).
+ **RAD etilganlar saqlangan:** hookdagi «Aynan!» / «Qiziq fikr!» (0) · «Keyingi dars — «…»» qatori (14) · reja sarlavhasi — natija-gap (1) · ≤3 blok · bank so'zi yumshatilmagan (4 — kadr gaplari bank aynan).
+ **SABOQ E:** variant chegarasi (0, 9, 10 tugmalari) · maket kesilmaydi (393 — 3 + 3 tasma) · taxmin qatori yashil xulosa ichida (2, 4, 6) · yorliq input ichida (8) · bittadan karta (8) · yakun standart, «Bugungi asosiy fikr» yo'q (14).

## O'lchov (`scratchpad/m14/md02/olchov.py` natijasi — jadval skript chiqishidan, 08.10.2026; to'liq chiqish `md02/olchov-natija.txt`)
| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0, 1, 2, 4, 6, 8, 9, 10 ×2, 13, 14 ×5) | 15 | 25 | 53 | ≤55, bitta qator; qavsdagi sonlar haqiqiy uzunlik bilan bir xil (skript 71 qavsni tekshirdi) |
| Hook javobi («Aynan!» · «Qiziq fikr!» ×2, so'z bilan birga) | 3 | 74 | 93 | ≤120 |
| Hook variantlari (0) | 3 | 35 | 39 | farq 10% |
| Mentor (interaktiv ekranlar 0, 2, 6, 8, 9, 10 va reja 1) | 7 | 67 | 110 | interaktivda 1 gap ✓; sarlavhani takrorlamaydi; «Bu…», «Hammasini…» bilan boshlanmaydi |
| Mentor — keys kadrlari (4: 1/3, 2/3, 3/3) | 3 | 115 | 129 | ≤2 gap ✓ (2 · 2 · 2) |
| Xulosa (2, 4, 6, 8, 9 ×2, 10 ×2) | 8 | 37 | 95 | ≤110 |
| Bugungi asosiy fikr (A-2; yakunda yo'q) | 1 | 104 | 104 | ≤110 |
| `QIzoh` qatorlari (2 ×3, 6 ×3) | 6 | 64 | 92 | bitta qator (≤110) |
| To'g'ri izohi (3, 5, 7, 11) | 4 | 38 | 56 | ≤60, «To'g'ri!» siz |
| Xato izohlari (3, 5, 7, 11 — har biri uch + umumiy) | 16 | 32 | 53 | ≤60 |
| `QXato` va tekshiruv xabarlari (8, 10) | 10 | 28 | 47 | ≤60 |
| Kulrang qatorlar (9 ×3, 10 maslahat ×3, 14) | 7 | 39 | 85 | bitta qator |
| Test variantlari — s3 (✔ B) | 4 | 42 | 46 | farq 9%; ✔ 45 (C 46) — yolg'iz eng uzun emas |
| s5 (✔ D) | 4 | 39 | 44 | farq 11%; ✔ 43 (A 44) |
| s7 (✔ C) | 4 | 35 | 38 | farq 8%; ✔ 35 — eng qisqa |
| s11 (✔ A) | 4 | 35 | 38 | farq 8%; ✔ 37 |
| Test savollari (so'z) | 4 | 4 | 8 | ≤12 |
| Arena 1–12 (variantlar) | 48 | 7 (3-savol) | 43 (10-savol) | har savolda farq ≤15% (eng kattasi 4-savol — 15%); ✔ hech qayerda yolg'iz eng uzun emas |
| Arena savollari (so'z) | 12 | 4 | 7 | ≤12 |
| Nishon tavsiflari | 4 | 41 | 47 | ≤48 (§63) |
| Kartochka old tomoni | 12 | 21 | 50 | to'liq savol, «?» bilan |

Arena ✔ taqsimoti: A — 1, 5, 10 · B — 2, 7, 12 · C — 3, 6, 9 · D — 4, 8, 11 (3/3/3/3). Ekran testlari: s3 B · s5 D · s7 C · s11 A (to'rttasi har xil o'rinda).
`npm run -s lint:til -- feedback/F-1008-14modul/02-PmStoryPitch-v3.md` — **0 error**, 3 warn (`kirill-lotin-matnda` — «Manbalar» va TAYANCHGA SAVOL 3 dagi K19 ruscha asl iqtibosi; o'quvchi matnida kirill yo'q). Oxirgi tahrirdan keyin qayta yurgizildi.

## TAXMIN belgilari (MD dagi `<!-- TAXMIN Tn -->` — 52 qator, 52 belgi)
| Tn | Qaror-0 savoli (tavsiya A) | Soni | Qayerda |
|---|---|---|---|
| **T1** | Olti bo'lak, 5 daqiqa + savol-javob (9.1 vaqtlari bilan) | 13 | A-6 (qoralama, hikoya pitchda, vaqt) · 6 (bashorat, vizual, xulosa) · 7 (savol) · 14 («Endi siz bilasiz» 3) · takrorlash 7 · arena 9, 10 · kartochka 7, 8 |
| **T4** | Teglar `m14-dars-NN` (PM: `-done` = `-start`) | 1 | REPO |
| **T12** | Video qoidasi: yuz/ism ixtiyoriy, ommaviy emas | 16 | sarlavha qatori (chegara) · A-1, A-10 · 1 (reja 04) · 9 (sarlavha, kulrang qatorlar) · 10 (varaq) · 11 (savol) · 14 (3-holat, «Endi siz bilasiz» 5, uyga vazifa ①, karta osti) · Self Check! · takrorlash 11 · arena 12 · kartochka 12 |
| **T18** | K19 Apple iPhone (keyslar) | 15 | sarlavha qatori (Tur) · A-8 · 4 (sarlavha, bashorat, 3/3 kadr, xulosa) · 5 (savol) · 14 («Endi siz bilasiz» 4) · Fewer Buttons! · takrorlash 5 · arena 6, 7, 8 · kartochka 9, 10 |
| **T19** | Atamalar: hikoya (storytelling → «hikoya») | 5 | A-4 · 2 (xulosa — ta'rif) · 14 («Endi siz bilasiz» 1) · arena 1 · kartochka 1 |
| **T20** | Dars nomi «Mahsulotingiz hikoyasini qanday aytasiz?» | 2 | sarlavha qatori (Menyu) · 0 (sarlavha) |
Javob boshqacha bo'lsa: T1 (B — besh bo'lak) → 6-ekran tasmasi, 7-savol va arena 9, 10 (hikoya Muammo va Yechimda qoladi) · T12 (B — ommaviy kanal) → TAQIQLAR 1 ga zid, alohida qaror; 9–11-ekranlar kulrang qatorlari ·
T18 (B — YC) → 4, 5-ekran, kartochka 9, 10, arena 6–8 · T19 (B — inglizcha qavsda) → 2-ekran xulosasi va kartochka 1 · T20 → 0-ekran sarlavhasi.

## GATE M — o'z tekshiruvim (`konveyer/1-MD.md`)
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 467 `m12-01` «Investorga pitchni qanday tuzasiz?» → 468 **`m12-02` «Mahsulotingiz hikoyasini qanday aytasiz?»** → 469 `m12-03` «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz» (yakun qatori). Hook sarlavhasi — dars nomi; reja yorlig'i — App.jsx osti so'zma-so'z.
- [x] Bitta misol-ip — «Maydon Jamoa» (lahza va o'zgarish tayanch 1.2 aynan, qoralama 1.1 aynan, sonlar 1.14); metafora yo'q; bitta vizual — `HikoyaSahna` (telefon · uch uya · funksiya nomlari · pitch tasmasi); keys — o'z sahnasi `IphoneSahna` (P-053). Ikkinchi misol faqat testda (kitob almashish ilovasi — 3; P-002).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 6 (QTushuncha) + 0, 4, 8, 9, 10; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q — har bosish uyani, telefon sonini, tasmani, taymerni yoki varaq qatorini o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil (grep): hikoya — 9-Modul ta'rifi bilan tenglashtirildi (2-ekran `QIzoh`; TAYANCHGA SAVOL 1) · «uch qurilma bittada» va K19 brend izohlari — 11-Modul kodi aynan · olti bo'lak, hakam, savol-javob — o'tgan dars · funksiya — 11-Modul PRD ·
  pitch, zal, taymer, dalil, jonli demo — 9–12-Modul. Yangi — «mahsulot hikoyasi» (lahza, o'zgarish — oddiy so'zlar) — misoldan keyin (2-ekran xulosasi). Siz-forma; tugmalar ot-shaklda yoki siz-formada («Saqlash», «Taymerni boshlash», «Video yozildi», «Yozib bo'lmadi», «Kartani ochish», «Yakunlash →»).
- [x] Testlar: 4 variant, uzunlik teng (farq ≤11%), to'g'ri javob hech qayerda yolg'iz eng uzun emas; kalit so'z yolg'iz emas (s3 «kitob» to'rttasida, s5 «Ikkalasida» to'rttasida, s7 «pitch»/«ro'yxat», s11 «ro'yxat» uchtasida); tire va qavs variantlarda yo'q. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [x] Final tartib-mashqi yo'q (yakuniy — `QTest`); `QTartib` bu darsda yo'q (1-dars mexanikasi takrorlanmaydi).
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✗ ✕ › ✎ ⛶ — belgilar) · kafolat so'zlari yo'q: «darrov», «darhol», «har doim», «100%» — o'quvchi matnida 0; «albatta», «tez orada» — faqat 8-ekran detektor ro'yxatida va A-5 «Ishlatilmaydi» da (MD ichki).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-02`, «Modul 14», K19, «TAXMIN», «storytelling» prozada — yo'q; «storytelling» faqat kartochkada bir marta). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 14 band, REPO — yo'q (teglar jadvali).
- [x] Karta T · P · S · PM: T-008 (Mentor pitch gaplari, lahza va o'zgarish — olam matni) · T-011/PM-030 (mahsulot hikoyasi — misoldan keyin; sarlavhalarda yangi atama yo'q: «hikoya» — 9-Moduldan) · T-014/T-015 (A-5: hikoya, lahza, ro'yxat, bo'lak ↔ qism, yozish — ikki ekranda tugma nomi bilan) ·
  T-016 (metafora yo'q) · T-020 · T-024 (tugma nomlari) · T-029/T-047 (Mentor bashorat yorlig'ini takrorlamaydi) · T-035 (o'quvchi matnida → yo'q) · T-038 (Demo Day, 3-dars — yo'q; faqat «Keyingi dars» qatori) · T-039 («mahsulotingiz», «pitchingiz» — o'quvchida bor) ·
  T-042 (ta'rif so'zma-so'z: 2 xulosa, kartochka 1, yakun 1) · T-043 («Bu misolda», «Mentor misolida», «Bu voqeada») · T-045 (Raqamlar — foydalanuvchilar soni, lahzalar soni emas; Jobs taqdimoti — bank faktidan tashqari da'vo yo'q) · T-052 (hikoya — 9-Modul, iPhone — 11-Modul so'zlari) ·
  T-064 (2-ekran sarlavhasi 0-ekran savolining so'zlari bilan) · P-001 · P-002 · P-008 (≤3 blok; 6, 8–10 telefonsiz) · P-012 (testlar 3, 5, 7, 11 — ketma-ket emas) · P-013 · P-014/P-015 (reja — natija va'dasi, matnsiz skelet) · P-016 · P-025 · P-028 (kamera ilovasi nomi yo'q) · P-033 ·
  P-036 (0-ekranda uch qism nomi yo'q) · P-046 (8 — kartalar o'quvchidan; 10 — javoblardan; yakun — kalitdan) · P-052 · P-053 (4 — `pre` kadr) · P-062 · P-063 (`MENTOR_HIKOYA`, `JAMOA_PITCH`, `VIDEO_SAVOL`) · P-064 · P-067 ·
  S-001 (savollar 4–8 so'z) · S-002/S-004/S-010 · S-006 (10-ekran 2-savol inkorsiz) · S-008 · S-015 (bashoratlar bir o'lchovda, o'sish tartibida; keysda bitta) · S-018 (iPhone, Nokia, BlackBerry, Stiv Jobs, iPod izohlari) · S-019 (arena 6) · S-020 · S-026 · S-027 · §144/§145 ·
  PM-005 (2-tur) · PM-017 · PM-018 (Apple qarori — faqat bank) · PM-021 · PM-027 · PM-108 (8-ekran tekshiruvi) · J-026 · SABOQ 1–31, D 36, E 40–55.
- [x] **Qaror-0 TAXMIN** — 52 qator belgilangan (yuqorida); GATE M sahifasida T12 (video qoidasi) va T18 (K19) javobi bu darsning 4, 5, 9–11-ekranlariga to'g'ridan-to'g'ri tegadi.
