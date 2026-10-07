# 11-Modul · 3-dars (PM) «Ikki g'oyadan qaysi biri odamlarga kerak?» — MD v3

Fayl: `src/9-Modull/PmInterviewsOneLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m9-03` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta, tayyori o'z joyiga uchadi) · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q ·
ekranda ≤ 3 blok · maket chapda, shablon o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **A** (`0`) · 8-ekran — **D** (`3`) · 12-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 373–375, DE-205): `m9-02` «Oltita g'oyadan qaysi uchtasi qoladi?» → **`m9-03` «Ikki g'oyadan qaysi biri odamlarga kerak?»** (osti: «10 intervyu, 1-qism: ikki g'oya, bir xil savollar») → `m9-04` «O'n intervyudan keyin qaysi g'oya qoladi?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (ikki g'oya uchun shablon va birinchi yozuv), mustaqil ish majburiy (9, 10-ekranlar). Keys — **K4 Airbnb** (tayanch 5, faqat bank matni). REPO yo'q (PM darsi; `maydon-jamoa` 7-darsdan).
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 5 · tushunchalar, keys va testlar (2–8) ≈ 33 · shablon ≈ 10 · sinfdosh bilan intervyu ≈ 15 · kod ≈ 10 · yakuniy savol, podium, kartochkalar, arena ≈ 17.
Manba: `00-MODUL-TAYANCH.md` (1 — ip · 1.2 — ikki g'oya · **1.3 — savollar, yozuv qatorlari, 10 yozuv; bu darsda birinchi beshtasi 1, 2, 3, 6, 7 — aynan** · 2 — atamalar · 4 — kod mexanikasi 3 · 5 — K4 · 7 · 8 — kalitlar · 9.1–28) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 15, 17) · `00-TAQIQLAR.md` · 9-Modul `02-PmFiveInterviews-v3.md` (intervyu texnikasi — bu darsda bir ekranda eslatiladi) · `MD_TOPSHIRIQ_2.md` (3-band).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur 3-qatori: «10 intervyu — 1-qism · eng yaxshi 2 g'oya bo'yicha intervyular → birinchi 5 intervyu yozilgan»; tayanch 4: «ikki g'oya uchun intervyu varag'i + birinchi yozuvlar»):
   o'quvchi 2-darsda tanlangan ikki g'oyasi uchun **bitta shablon** tuzadi — besh savol ikkala g'oyaga bir xil, faqat 1-savolda **bo'lak** almashadi — va sinfdoshi bilan 1–2 yozuv oladi
   (sherik g'oya auditoriyasidan bo'lsa — **haqiqiy yozuv**, bo'lmasa — **mashq yozuvi**). Uyda — keyingi darsgacha **jami 10 yozuv, har g'oyaga 5** (darsdagi haqiqiy yozuv ham kiradi).
   Mentor misolida — birinchi beshta yozuv: 1, 2, 3 (jamoa yig'ish) va 6, 7 (mahalla to'garaklari). Saqlanadi: `pm-m9d3-intervyu` (4-dars o'qiydi).
   Bugun yozuvlar **sanalmaydi** va g'oya **tanlanmaydi** — sanoq va final g'oya 4-darsda (ekranda va'da qilinmaydi, T-038).
2. **Bugungi asosiy fikr (P-013):** Ikki g'oyani bir xil savollar bilan tekshirasiz; odamning qiziqishini so'zidan ko'ra ishi aniqroq ko'rsatadi. (Yakunda ScoreRing ostida; kartochkada so'zma-so'z yo'q.)
3. **9-Moduldan qoladigan so'zlar** (qayta o'rgatilmaydi — 2-ekranda bir marta eslatiladi; 9-Modul `m7-02` so'zlari aynan, T-052):
   - **intervyu** — bitta odam bilan suhbat · **yozuv** — to'ldirilgan shablon · **shablon** — har intervyuda bir xil qatorlar (9-Modulda to'rt qator; bugun olti);
   - **voqea savoli** — bo'lib o'tgan ishni so'ragan savol · **bo'sh savol** — javobidan bo'lib o'tgan ish bilinmaydigan savol · **va'da** — hali bo'lmagan ish haqidagi javob · «javob savolda»;
   - **eshitgan javob — u aytganidek**, **o'sha zahoti** yoziladi · **mashq yozuvi** (9-Modul `m7-02` 9-ekrani — o'sha so'z).
4. **Yangi — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **harakat belgisi** (tayanch 2): «Intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish — harakat belgisi.» — 6-ekran xulosasi (atama beshta yozuv yakunlangandan keyin tug'iladi); kartochka, yakun — aynan.
     Mentor misolida — odam sinab ko'rishga kun belgiladimi: **ha / yo'q** (tayanch 1.3; HB-q0 A — telefon raqami so'ralmaydi).
   - **«Hozir nima bilan»** — shablonning yangi qatori, 4-savol «Hozir buni nima bilan hal qilyapsiz?» (atama emas — qator nomi; 4-ekran).
   - **bir xil savollar** — ikkala g'oyaga besh savol aynan; 1-savolda **bo'lak** almashadi: «o'yinga odam yig'ganingiz» ↔ «to'garak izlaganingiz» (tayanch 1.3: «g'oya so'zi almashadi»).
     O'quvchi matnida «bo'lak» — faqat shu ma'noda (TAYANCHGA SAVOL 2).
   - **haqiqiy yozuv · mashq yozuvi** — sherik g'oya auditoriyasidan bo'lsa yozuv haqiqiy (o'ntaga kiradi), bo'lmasa — mashq (GATE_M 15: «auditoriya tengdosh bo'lsa — haqiqiy yozuv»).
5. **Shablon — tayanch 1.3 aynan (`SHABLON`, bitta manba):**
   - Savollar (ikkala g'oyaga bir xil): 1) «Oxirgi marta [o'yinga odam yig'ganingiz / to'garak izlaganingiz] qachon bo'ldi?» · 2) «O'shanda qanday qildingiz?» · 3) «Eng qiyini nima bo'ldi?» ·
     4) «Hozir buni nima bilan hal qilyapsiz?» · 5) «Birinchi versiya tayyor bo'lganda, uni sinab ko'rishga 10 daqiqa vaqt berasizmi? Qaysi kunni belgilaysiz?»
   - Yozuv qatorlari: **Kim · Oxirgi marta · Qanday qildi · Eng qiyini · Hozir nima bilan · Harakat belgisi** (ha / yo'q). «Kim» qatorida savol yo'q — uni intervyu oluvchi yozadi.
6. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«shablon»** — savollar va qatorlar (9-Modul so'zi, tayanch 1.3 «qoladi»); «intervyu varag'i», «savol varag'i», «anketa» — o'quvchi matnida yo'q (TAYANCHGA SAVOL 1).
   - **«ish»** — bo'lib o'tgan ish (9-Modul) va harakat belgisidagi «ish» (qilingan narsa) — bitta ma'no: odam haqiqatda qilgan narsa. 1-savoldagi almashadigan qism — «bo'lak», «ish» emas.
   - **«jamoa»** — faqat futbol jamoasi · **«maydon»** — faqat futbol maydoni (forma joyi — «qator») · **«band»** — faqat Airbnb voqeasida («uy band qilinishi»).
   - **«Jamoa yig'ish» · «Mahalla to'garaklari»** — g'oya nomi (yorliq, 1-dars qoidasi). «Maydon Jamoa» — bu darsda yo'q (9.23).
   - **Ishlatilmaydi:** commitment · va'da (harakat belgisi ma'nosida) · respondent · so'rovnoma (intervyu ma'nosida) · sanoq, takror (4-dars so'zlari) · final g'oya (bugun tanlanmaydi) · «hozirgi yo'l» (qator nomi bilan aytiladi).
7. **Raqamlar (faqat tayanchdan, «Mentor misolida»):** RICE 24 va 20 (1.2, faqat 0-ekran maketida) · 10 yozuv, har g'oyaga 5 (1.3) · beshta yozuvdagi son va yoshlar (1.3 aynan). Boshqa son yo'q.
   Airbnb — raqamsiz (2007-yil va «uchta havo to'shagi» — bank matnida).
8. **Keys — K4 Airbnb (tayanch 5, bank matni aynan):** «2007, San-Fransisko: konferensiya, mehmonxonalar to'la — asoschilar uyida uchta havo to'shagini ijaraga bergan. O'sish to'xtaganda Nyu-Yorkka borib,
   kvartiralarni o'zlari aylanib suratga olgan — yomon suratlar bandlovni o'ldirayotganini o'zlari bilgan. Raqamsiz.» Ko'prik: intervyu — odam oldiga borib, o'zi ko'rish.
   Bankda yo'q natija («band qilishlar ko'paydi», «daromad o'sdi») aytilmaydi va chizilmaydi.
9. **Ikkinchi misol faqat testda (P-002), Mentor olamidan:** sinf uy vazifalari (5-ekran — 1.1 dagi 4-g'oya), sinfdosh iqtibosi (12-ekran).
10. **Toza yuza (185, D-qoidalar):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q.
11. **Kod yozish (tayanch 4: «3 — kod oynasi: intervyu savollari massivi → savol varag'i sahifada»; PM-082):** kod oynasi (`HtmlCompiler`, `app.js` + `index.html`): umumiy savollar massivi va ikki g'oyaning bo'lagi →
    sahifada ikki ustunli shablon. 2-dars — VS Code (`node rice.js`), 4-dars — VS Code (`node sanoq.js`); mexanika takrorlanmaydi (PM_DARS_ETALON 26).
12. **Real odamlar (GATE_M 15):** darsda sinfdosh bilan 1–2 intervyu (10-ekran); uyga — 10 yozuv. **Harakat belgisi shaxsiy ma'lumot so'ramaydi** — odam faqat sinab ko'rish uchun kun belgilaydi, yozuvga «ha» / «yo'q» (HB-q0 A)
    (sinfdosh va tanishlarning shaxsiy ma'lumoti darsda saqlanmaydi; TAYANCHGA SAVOL 7).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 1-dars — Mentorning 6 g'oyasi; 2-dars — saralash va RICE: oldinda ikki g'oya — jamoa yig'ish (24) va mahalla to'garaklari (20).
  3-dars: ikkalasi bir xil savollar bilan intervyuda tekshiriladi, Mentor misolida birinchi beshta yozuv. Final g'oya — 4-darsda (bugun tilga olinmaydi).
- **Dars ipi:** 0 — qaysi g'oya kerakroq? (taxmin) → 2 — 9-Modul qoidasi bilan Mentorning qoralama savollari ajratiladi va ikkinchi g'oyaga ko'chadi, faqat bo'lak almashadi → 3 — test →
  4 — beshta odamga «Hozir buni nima bilan hal qilyapsiz?»: Telegram guruhi va tanishlar → 5 — test → 6 — intervyu oxirida sinab ko'rishga kun: harakat belgisi, Mentorning beshta yozuvi to'liq →
  7 — Airbnb: asoschilar kvartiralarga o'zlari borgan → 8 — test → 9 — o'quvchi o'z ikki g'oyasiga shablon tuzadi → 10 — sinfdosh bilan intervyu → 11 — kod: shablon sahifada ikki ustun →
  12 — yakuniy test → podium → kartochkalar → yakun; uyda — 10 yozuv.
- **Bitta vizual — ikki ustunli shablon (`IkkiShablon` + `YozuvKarta`, dars bo'yi; 163/180; bitta manba `SHABLON` + `MENTOR_YOZUVLAR` + o'quvchi ma'lumoti):**
  - Oq karta, ikki ustun bir balandlikda (SABOQ 1): chapda **Jamoa yig'ish**, o'ngda **Mahalla to'garaklari** (9–11-ekranlarda — o'quvchining ikki g'oyasi; ustun sarlavhasi — g'oyaning yechimi, qisqa «…»).
  - Qatorlar ikki ustunda bir xil: yorliq (kulrang) + savol (kursiv). Qatorlar ekrandan ekranga qo'shiladi: 2-ekran — Kim · Oxirgi marta · Qanday qildi · Eng qiyini (9-Modul) → 4-ekran — **Hozir nima bilan** → 6-ekran — **Harakat belgisi**.
    Yangi qator sirg'alib kiradi va ~1 s yashil yonadi; 1-savoldagi bo'lak — accent fon (almashadigan joy); ikki ustundagi bir xil qatorlar orasida ingichka chiziq (2-ekran oxiridan).
  - Ustun ostida — **«Yozuvlar · n / 5»** va beshta joy (P-056 sig'im-sahnasi: bo'sh joy — kichik uzuq iz, to'ldirilgani — oq `YozuvKarta`).
  - `YozuvKarta`: **ixcham** (Kim · harakat belgisi) va **to'liq** (olti qator, tayanch 1.3 matni); ixchamini bosish → to'liq ochiladi (U-013, toggle). Harakat belgisi: «ha» — yashil ✓, «yo'q» — kulrang.
  - Ishlatiladi: 0 (ikki g'oya kartasi + bo'sh joylar) · 1 (skelet) · 2 · 3 (javobdan keyin, kichik) · 4 · 6 · 9 · 10 · 11 (kutilgan natija) · 12 (javobdan keyin) · 15 (artefakt-strip). `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi.
- **Mentor misolining birinchi beshta yozuvi (`MENTOR_YOZUVLAR`, tayanch 1.3 aynan — 1, 2, 3, 6, 7; 4, 5, 8, 9, 10 bu darsda yo'q):**

| № | G'oya | Kim | Oxirgi marta | Qanday qildi | Eng qiyini | Hozir nima bilan | Belgi |
|---|---|---|---|---|---|---|---|
| 1 | jamoa | o'yinchi, 15 yosh | o'tgan shanba: 10 kishi kerak edi, 7 kishi keldi | Telegram guruhida «kim keladi?» deb yozdi | kim «+» qo'ygani xabarlar orasida yo'qoldi | Telegram guruhi | ha |
| 2 | jamoa | o'yinchi, 14 yosh | kecha: ikki kishi oxirgi daqiqada kelmadi | tanishlariga birma-bir qo'ng'iroq qildi | kim aniq kelishini bilmadi | Telegram guruhi va qo'ng'iroq | ha |
| 3 | jamoa | o'yinchi, 16 yosh, o'yinni ko'pincha o'zi yig'adi | uch kun oldin: 6 kishi yig'ildi, o'yin bo'lmadi | guruhga uch marta yozdi | javoblar boshqa xabarlar ostida qoldi | Telegram guruhi | ha |
| 6 | to'garak | o'smir, 14 yosh | yozda: robototexnika to'garagini qidirdi, topolmadi | onasi tanishlaridan so'radi | qayerda va qachon ekani noma'lum | ota-onaning tanishlari | yo'q |
| 7 | to'garak | ota-ona (o'g'li 13 yoshda) | sentabrda: suzish to'garagini qidirdi | mahalla guruhida va tanishlardan so'radi | jadvalni bilish uchun borib ko'rish kerak | tanishlar | ha |

  O'quvchi ekranida yozuv raqami (№) yo'q — yozuvlar Kim bilan farqlanadi. Yozuvlar yozilgan holda ko'rsatiladi (pufaksiz) — matn tayanchdagidek, o'zgartirilmaydi (TAYANCHGA SAVOL 3).
- **Brend o'z maketida (PM-028/029, S-018, SABOQ 2–3):** **Telegram** — 4-ekran, chat oynasi, nomi o'z ko'k rangida · **Airbnb** — 7-ekran, kvartira sahnasi va brauzer oynasi, nomi o'z qizil-pushti rangida. Logotip chizilmaydi.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, juda yengil to'lqin (≤3%, ≥2 s — SABOQ 32, F-1006-270: «tebranish oshib ketibdi»); tanlov guruhida bitta halqa (har variantda emas — SABOQ 32).
  Yoqilgan pastki tugma («Davom etish», «Keyingi bosqich») ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Bashorat (SABOQ 11, 25):** tanlangach karta yo'qolmaydi — savol va «Taxminingiz: …» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa joyidan joyiga uchadi (savol qatoriga, yozuv ustuniga) · yangi qator ~1 s yashil yonadi · hisoblagich sanab o'sadi.
  Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Ikki g'oyadan qaysi biri odamlarga kerak?** (41) — dars nomi (DE-205)
- Mentor: RICE bo'yicha eng yuqori ikki g'oyam — shular. O'zingizga yaqin javobni belgilang.
- Maket (chap; ikki g'oya kartasi yonma-yon, bir balandlikda — 1-dars `GoyaKarta` ixcham ko'rinishi):
  - **Jamoa yig'ish** — Muammo: o'yinga odam yetmaydi, kim kelishi noma'lum · Kim uchun: mahalladagi o'yinchilar · pastda kulrang yorliq «RICE 24»
  - **Mahalla to'garaklari** — Muammo: qaysi to'garak qayerda va qachon — bilinmaydi · Kim uchun: to'garak izlayotgan o'smirlar · «RICE 20»
- Variantlar (radio, o'ng; bir uzunlikda):
  - Jamoa yig'ish — mahalla o'yinchilariga (38)
  - Mahalla to'garaklari — o'smirlarga (34)
- Javob (ikkalasida bir xil, maqtovsiz — J-026): Ikkalasi ham bo'lishi mumkin. Hozircha bu — taxmin: ikkala g'oya bo'yicha odamlardan hali so'ralmagan. (102)
- **Harakat → Vizual o'zgarish:** variantni tanlash → mos karta accent halqa bilan ko'tariladi; keyin har karta ostida beshtadan kichik uzuq joy navbat bilan (80 ms) chiqadi, ustida yorliq «Yozuvlar · 0 / 5» —
  ikki karta ikki ustunli shablonning sarlavhasiga aylanadi (joylar nima ekani aytilmaydi — P-036). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha ikki variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: Javobni muhokama qilmang va RICE ni qayta hisoblamang — savol taxmin haqida. Sinfdan so'rang: «Kim qaysi birini tanladi va nega?» — javoblar faqat eshitiladi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun ikki g'oya bo'yicha intervyuni boshlaysiz.** (48)
- Mentor: RICE baholari hali taxmin. Endi ularni odamlarning o'z voqeasi bilan tekshirasiz.
- Chap — «Dars oxirida: 10 intervyu, 1-qism: ikki g'oya, bir xil savollar» (App.jsx osti, P-015) + vizual: ikki ustunli shablon skeleti — olti qator matnsiz kulrang chiziq bo'lib chiziladi;
  ostida beshtadan joy, chapdagi uchtasi va o'ngdagi ikkitasi 0.4 s oraliqda oq kartaga aylanib yashil ✓ oladi (Mentor misolining birinchi beshtasi — matnsiz, kashfiyot ochilmaydi).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Ikki g'oyaga bir xil savollar tuzasiz · `shablon`
  - 02 · Odamning so'zi va ishini ajratishni bilib olasiz · `belgi`
  - 03 · Airbnb asoschilari muammoni qayerda topganini ko'rasiz · `voqea`
  - 04 · Sinfdoshingizdan birinchi yozuvni olasiz · `juftlik`
- Harakat yo'q (reja ekrani) — vizual o'zi chiziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada atama yo'q (T-011); reja ta'rif aytmaydi (P-015) — «harakat belgisi» 6-ekranda tug'iladi; teg `belgi` — kulrang yorliq.

## 2 · Ikkinchi g'oyaga savollar  ← QTushuncha (markaziy; 9-Modul texnikasi — shu bitta ekranda)
- Eyebrow: Takror · 9-Modul qoidasi
- Sarlavha: **Ikkinchi g'oyaga qaysi savollarni berasiz?** (42)
- Mentor: Jamoa yig'ish uchun beshta savol yozdim — har birini o'z tomoniga joylang.
- Vizual (keng; chapda harakat, o'ngda shablon — SABOQ 21):
  - **chapda** — bitta katta savol kartasi (ketma-ket, «n / 5»), ostida ikki tomon tugmasi: **Bo'lib o'tgan ishni so'raydi** · **So'ramaydi** (9-Modul `m7-02` 2-ekrani tomonlari);
    karta yonida suhbatdosh siluet (CSS doira + yarim doira) — yorliq «o'yinchi», pufagi bo'sh.
  - **o'ngda** — ikki ustunli shablon: «Jamoa yig'ish» ustunida faqat «Kim» qatori; «Mahalla to'garaklari» ustuni — sarlavhasi bor, qatorlari kulrang skelet.
- Savollar (aralash tartibda, bittadan; → to'g'ri tomon):
  1. «Jamoa yig'adigan ilova bo'lsa, ishlatarmidingiz?» → **So'ramaydi** · pufak «Ha, ishlatardim.» · yorliq «va'da»
  2. «Oxirgi marta o'yinga odam yig'ganingiz qachon bo'ldi?» → **So'raydi** → «Oxirgi marta» qatori
  3. «Odam yig'ish qiyin, shundaymi?» → **So'ramaydi** · pufak «Ha, qiyin.» · yorliq «javob savolda»
  4. «O'shanda qanday qildingiz?» → **So'raydi** → «Qanday qildi» qatori
  5. «Eng qiyini nima bo'ldi?» → **So'raydi** → «Eng qiyini» qatori
- **Harakat → Vizual o'zgarish:**
  1. Tomon tugmasi → to'g'ri bo'lsa: voqea savoli kartasi kichrayib jamoa ustunidagi o'z qatoriga uchadi (qator ~1 s yashil); bo'sh savolda o'yinchi pufagida javob chiqadi,
     ostida kulrang yorliq («va'da» / «javob savolda»), karta kulrang bo'lib pastga tushib ketadi. Noto'g'ri tomon → karta silkinib qaytadi, bitta `QXato`.
  2. 5/5 da tomonlar ustida 9-Moduldagi nomlar chiqadi: chap **voqea savoli**, o'ng **bo'sh savol**; shablon ostida tugma **To'garakka moslash** (halqada).
  3. «To'garakka moslash» → uch savol to'garak ustuniga navbat bilan (150 ms) uchadi; 1-savoldagi bo'lak accent fonda «o'yinga odam yig'ganingiz» → «to'garak izlaganingiz» bo'lib almashadi, ustida kichik kulrang yorliq **bo'lak — g'oyaga qarab almashadi** chiqadi (so'z shu yerda tug'iladi, 03-FILTR 20);
     2 va 3-savol yonida kichik ✓ «o'zgarmadi»; ikki ustundagi bir xil qatorlar orasida ingichka chiziq chiziladi.
- `QXato` (≤60): voqea savoli «So'ramaydi»ga — Bu savol bo'lib o'tgan kunni so'rayapti. (40) · 1 «So'raydi»ga — Ilova hali yo'q — javobi va'da bo'ladi. (39) ·
  3 «So'raydi»ga — Javobni savolning o'zi aytib qo'ydi. (36)
- Natija (`tugadi`): savol kartasi, tomonlar va siluet yo'qoladi; ikki ustunli shablon butun enga (uch qator, bo'lak accent, qatorlar orasida chiziq). ⛶ ichida (q17).
- Xulosa: Savollar ikkala g'oyaga bir xil — shunda javoblarni qatorma-qator solishtirasiz. (80)
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Bu savolning javobida kun yoki qilingan ish bo'ladimi?
- Tugma (pastki): Savollarni joylang (N/5) → To'garakka moslang → Davom etish
- Keyingi bosiladigan joy: ikki tomon tugmasi (navbatma-navbat to'lqin) → «To'garakka moslash» → «Davom etish».
- Nishon: **Same Questions!** (beshala savol birinchi urinishda o'z tomonida).
- O'qituvchi eslatmasi: Tomonlar 9-Modulning «Besh odamdan nimani bilib olasiz?» darsidan — qayta o'rgatmang, bir daqiqada eslating. Bugungi yangisi — o'ng ustun: savollar ikkinchi g'oyaga bitta bo'lak almashib o'tadi.
  Sinfdan so'rang: «To'garak g'oyasiga butunlay boshqa savollar bersak, javoblarni nima bilan solishtiramiz?»

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`)
- Eyebrow: Tekshiruv · bir xil savollar
- Savol: **To'garak izlagan o'smirga birinchi savolingiz qaysi?** (6 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — «To'garaklar xaritasi bo'lsa, ochib ko'rarmidingiz?» (52)
  - B — «Oxirgi marta o'yinga odam yig'ganingiz qachon bo'ldi?» (55)
  - ✔ C — «Oxirgi marta to'garak izlaganingiz qachon bo'ldi?» (51)
  - D — «To'garak topish ko'pincha qiyin bo'ladi, shundaymi?» (53)
- To'g'ri izohi: Savol o'tgan voqeani so'raydi, bo'lagi esa to'garakka almashgan. (64)
- Xato izohlari: A — Xarita hali yo'q — javobi va'da bo'ladi. (40) · B — Bo'lak jamoa yig'ish g'oyasidan qolib ketgan. (45) ·
  D — Javobni savolning o'zi aytib qo'ydi. (36) · (umumiy) Savol o'tgan ishni so'rasin, bo'lagi to'garakka mos bo'lsin. (60)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan keyin; SABOQ 4): savol ostida shablonning bitta qatori — «Oxirgi marta» ikki ustunda, bo'laklar accent fonda.
- Izoh (MD): «Oxirgi marta» B va C da (kalit so'z faqat to'g'rida emas); B — rost voqea savoli, lekin bo'lagi boshqa g'oyadan (S-004 — 2-ekran qoidasi); A, D — 9-Modul bo'sh savollari.

## 4 · Hozir nima bilan  ← QTushuncha (ketma-ket, 5 yozuv; SABOQ 9/13)
- Eyebrow: Tushuncha · to'rtinchi savol
- Sarlavha: **Odamlar bu muammoni hozir nima bilan hal qilyapti?** (50) — savol shu ekranda shablonga kiradi
- Mentor: Birinchi beshta intervyuda shu savolni ham berdim — har odamga «Savolni berish»ni bosing.
- Vizual (ikki blok + natija qatori):
  - **o'ngda — shablon:** ekranga kirganda yangi qator **Hozir nima bilan** — «Hozir buni nima bilan hal qilyapsiz?» — ikkala ustunga sirg'alib kiradi (~1 s yashil).
    Ostida yozuv joylari: jamoa — 3 (1, 2, 3), to'garak — 2 (6, 7); har birida hozircha faqat **Kim** (masalan «o'yinchi, 15 yosh»). Joriy joy halqada, ichida tugma **Savolni berish**.
  - **chapda — telefon maketi** (≈170×272, SABOQ 22): javobga qarab almashadi.
- Ketma-ketlik (yozuv → javob → telefon maketi):
  1. o'yinchi, 15 yosh → **Telegram guruhi** → maket: Telegram chat oynasi (nom «Telegram» o'z ko'k rangida, guruh — «Futbol»): xabar «Shanba o'yin. Kim keladi?», ostida bir necha «+»;
     keyin boshqa xabarlar (stiker, «uy vazifasi nima edi?», ovozli xabar belgisi) birin-ketin kirib, «+» lar yuqoriga surilib ko'rinmay qoladi.
  2. o'yinchi, 14 yosh → **Telegram guruhi va qo'ng'iroq** → maket: chat ustidan «Qo'ng'iroqlar» ro'yxati sirg'alib chiqadi — bir necha chiquvchi qo'ng'iroq qatori (ismsiz, «o'yinchi»).
  3. o'yinchi, 16 yosh, o'yinni ko'pincha o'zi yig'adi → **Telegram guruhi** → maket: chatda bir xil xabar «Kim keladi?» uch marta, har biri boshqa xabarlar ostida qoladi.
  4. o'smir, 14 yosh → **ota-onaning tanishlari** → maket almashadi (to'garak tomoni): ona siluetidan uchta tanish siluetiga chiziq, har birida «?» pufak.
  5. ota-ona (o'g'li 13 yoshda) → **tanishlar** → maket: «Mahalla» guruhi chati — savol xabari va tanishlar siluetlari.
  Har javob: matn joydan «Hozir nima bilan» qatoriga tushadi (joy ~1 s yashil), keyingi joy halqaga o'tadi. Telefon maketidagi chat xabarlari — namoyish (O'qituvchi eslatmasi; manba — yozuvlarning o'zi).
- Natija (`tugadi`): tugmalar yo'qoladi; jamoa ustuni ostida — Telegram guruhi · Telegram guruhi va qo'ng'iroq · Telegram guruhi; to'garak ustuni ostida — ota-onaning tanishlari · tanishlar;
  telefon maketi ikki kichik holatga yig'iladi: Telegram chati («+» lar ko'rinmaydi) | tanishlar siluetlari.
- Xulosa: Bu savol odam muammoni hozir nima bilan hal qilayotganini ochadi — yangi yechimni shu bilan solishtirasiz. (106)
- Tugma (pastki): Savolni bering (N/5) → Davom etish
- Keyingi bosiladigan joy: joriy yozuv joyidagi «Savolni berish» (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: Yozuvlarni sanamang va g'oyalarni solishtirmang — beshta yozuv xulosa uchun kam. Telefon maketidagi xabar matni — namoyish, yozuvning o'zi emas.
  To'garak yozuvlarida ota-ona ham bor: 9-Modulda «muammoning ikki tomoni bo'lsa, ikkalasidan ham so'rang» degan edik. Sinfdan so'rang: «Siz jamoani hozir nima bilan yig'asiz?»
  Hozirgi yo'l borligi muammo bor-yo'qligini ham, og'irligini ham o'zi aytmaydi — og'irligini «Eng qiyini» qatori ko'rsatadi (03-FILTR 16).

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi misol — Mentorning 4-g'oyasi, P-002)
- Eyebrow: Tekshiruv · to'rtinchi savol
- Iqtibos (savol ustida, suhbatdosh pufagida): O'quvchi: «Hozir uy vazifasini sinf chatidan qidiraman.»
- Savol: **Bu javobdan nimani bilib olasiz?** (5 so'z) · savol ustida yorliq yo'q
  - ✔ A — Yangi yechim sinf chati bilan solishtiriladi (44)
  - B — Uy vazifasi bo'yicha unda hech muammo yo'q ekan (46)
  - C — Vazifalar ilovasi chiqsa, uni ishlatib ko'radi (45)
  - D — Yangi ilovani sinf chatiga o'xshatib qurasiz (43)
- To'g'ri izohi: Odam muammoni hozir sinf chati bilan hal qilyapti — yangi yechim shu bilan solishtiriladi. (90)
- Xato izohlari: B — Chatdan qidirish ham mehnat — muammo yo'q demadi. (49) · C — U ilova haqida gapirmadi — bu sizning taxminingiz. (50) ·
  D — Javob hozirgi ishini aytdi, ilova qanday bo'lishini emas. (57) · (umumiy) U hozir nima bilan hal qilyapti — shuni toping. (47)
- Javob topilgach (kichik, savol ostida): yozuv joyi — «Hozir nima bilan: sinf chati» (accent qator).
- Izoh (MD): «sinf chati» A va D da (kalit so'z faqat to'g'rida emas); B — 4-ekran qoidasi (odam muammoni hozir nimadir bilan hal qilayotgani — muammo yo'q degani emas: jamoa yozuvlarida Telegram guruhi ham, qiyinchilik ham bor); C — 9-Modul va'dasi; D — xulosa, javobda yo'q (S-004).

## 6 · Harakat belgisi  ← QTushuncha (ketma-ket, 5 yozuv; atama — misoldan keyin)
- Eyebrow: Tushuncha · so'z va ish
- Sarlavha: **Odam rostdan qiziqqanini qanday bilasiz?** (40)
- Mentor: Oxirgi savolni muammo haqidagi savollardan keyin berdim — beshta yozuvni birma-bir yakunlang.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — so'zdan ishga, o'sish tartibida): **Qaysi javob qiziqishni eng aniq ko'rsatadi?** ·
  G'oyani maqtaydi · «Ishlatardim» deydi · Sinab ko'rishga kun belgilaydi — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; «Oxirgi savolni berish» shundan keyin yoqiladi.
- Vizual (maket chapda, karta o'ngda):
  - **chapda — telefon maketi** (≈170×272): Mentor telefonidagi «Sinov kunlari» ro'yxati — uch qator «Shanba · Yakshanba · Dushanba», har birining yonida bo'sh joylar (maket ichida, bosilmaydi; tayanch 9.57).
  - **o'ngda — bitta katta yozuv kartasi** (joriy; ketma-ket 1 → 2 → 3 → 6 → 7, SABOQ 9): Kim va to'rt qator to'ldirilgan (jadvaldagi matn aynan), oxirgi qator **Harakat belgisi** bo'sh,
    ichida tugma **Oxirgi savolni berish** (halqada). Ustunlar ustida jami, «ha» soni yoki «ko'p» yorlig'i yo'q — 3-darsda belgilar sanalmaydi (03-FILTR 12).
- **Harakat → Vizual o'zgarish:** «Oxirgi savolni berish» → kartada 5-savol «Birinchi versiya tayyor bo'lganda, uni sinab ko'rishga 10 daqiqa vaqt berasizmi? Qaysi kunni belgilaysiz?» chiqadi; telefon maketida:
  - **ha** (1, 2, 3, 7) — odam bitta kunni belgilaydi: o'sha kun yonidagi bo'sh joyga Kim yorlig'i tushadi (1 — Shanba · 2 — Yakshanba · 3 — Shanba · 7 — Yakshanba), ostida «Belgilandi ✓»; kartada «Harakat belgisi — ha» (yashil ✓);
  - **yo'q** (6) — hech bir kun belgilanmaydi, ostida kulrang «Kun belgilanmadi»; kartada «Harakat belgisi — yo'q» (kulrang).
  Keyin karta kichrayib o'z ustuni ostidagi joyga uchadi (ustun ostidagi «Yozuvlar · n / 5» — yozuv soni, belgilar emas), pastdan keyingi yozuv kartasi kiradi.
  5/5 da shablonga oltinchi qator **Harakat belgisi** qo'shiladi va kartalar ustida yorliq **harakat belgisi** paydo bo'ladi (atama — misoldan keyin).
- Natija (`tugadi`; bitta natija bloki — SABOQ 25): telefon maketi va tugma yo'qoladi; shablon butun enga — olti qator, ostida beshta `YozuvKarta` ixcham (Kim · belgi), bosilsa to'liq ochiladi.
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: … · haqiqatda: sinab ko'rishga kun belgilaydi» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish — harakat belgisi. (87)
- Tugma (pastki): Yozuvlarni yakunlang (N/5) → Davom etish · vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy kartadagi «Oxirgi savolni berish» → «Davom etish».
- O'qituvchi eslatmasi: Belgilarni sanamang va g'oyalarni solishtirmang. Nega oxirida: g'oyani boshida aytsangiz, keyingi javoblar maqtovga aylanadi (9-Modul qoidasi).
  Vaqt so'rash — taklif, majburlash emas: «yo'q» ham javob. «Yo'q» — shu yozuvdagi belgi: odam qiziqmaydi yoki g'oya yomon degani emas (03-FILTR 5).
  Sinfdan so'rang: «Do'stingiz g'oyangizni maqtadi — bu harakat belgisimi?»

## 7 · Airbnb  ← QVoqea (PM keys K4; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Airbnb asoschilari muammoni qayerda bilgan?** (43)
- Nuqtalar (3) · yorliq **Airbnb · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Airbnb** (o'z qizil-pushti rangida) — begona odamning uyida ijaraga turish xizmati. Logotip yo'q.
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; SABOQ 8). Sahnada faqat bosqich nomi va jonli maket.
- Sahna (`AirbnbSahna`, chizilgan CSS/SVG; bank matnida yo'q narsa chizilmaydi — asoschi surati, son, natija grafigi yo'q):
  - 1/3 **San-Fransisko · 2007** — Mentor: 2007-yilda San-Fransiskoda katta konferensiya bo'lib, mehmonxonalar to'lgan. Asoschilar o'z uyida uchta havo to'shagini ijaraga bergan.
    · sahna: shahar ko'chasi, mehmonxona eshigida yozuv «Joy yo'q» → uy ichi: polda uchta havo to'shagi navbat bilan paydo bo'ladi, mehmon siluetlari sumka bilan kiradi.
    · bashorat (sahna ostida, bitta qator; S-015 — uzoqdan → yonida): **Saytga yangi odamlar qo'shilmay qolganda, asoschilar nima qilgan?** · Saytni qaytadan chizgan · Uy egalariga xat yozgan · ✔ Kvartiralarga o'zlari borgan
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; 1/3 sahnasi javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **Nyu-York** — Mentor: Saytga yangi odamlar qo'shilmay qolganda, asoschilar Nyu-Yorkka borgan. Kvartiralarni o'zlari aylanib, suratga olgan.
    · sahna: baland uylar qatori; asoschilar siluetlari kamera bilan eshikdan eshikka yuradi; kvartira ichi (divan, deraza), kamera chaqnaydi.
  - 3/3 **Yomon suratlar** — Mentor: Shunda ular yomon suratlar uylar band qilinishiga xalaqit berayotganini bilgan. Buni saytga qarab emas, kvartiralarga borib ko'rishgan.
    · sahna: brauzer oynasi (manzil satri, nom «Airbnb» o'z rangida) — uy e'lonlari kartalari, suratlari xira va qorong'i (yorliq «suratlar xira»); kamera chaqnaydi → xira e'lon kartasi yonida kameradan olingan yorug' kadr alohida chiqadi; e'lon kartasi o'zgarmaydi (bankda suratlar saytga qo'yilgani yo'q — natija chizilmaydi, 03-FILTR 18).
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: kvartiralarga o'zlari borgan» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan keyin, pastda, yashil): Airbnb asoschilari muammoni saytga qarab emas, kvartiralarga o'zlari borib bilgan. (82)
- Tugma (pastki): Keyingi bosqich (N/3) → Davom etish · nuqtalar ustida: Avval shu bosqichni tugating
- O'qituvchi eslatmasi: Airbnb 7-Modulda («Botingizni ishlatgan odamdan nimani so'raysiz?») ham bo'lgan — bugungi savol boshqa: muammoni qayerda bilgan. Ko'prik og'zaki: intervyu ham shunday — odamning oldiga borib,
  uning voqeasini o'zingiz eshitasiz. Bankdan tashqari son va natija qo'shmang («band qilishlar ko'paydi» — bankda yo'q).
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K4 (bank: raqamsiz) · tayanch 5 (o'zbekcha matn). «bandlovni o'ldirayotgan» → «band qilinishiga xalaqit berayotgan» (ma'no o'sha, ibora yumshoq — TAYANCHGA SAVOL 9);
  «O'sish to'xtaganda» → «Saytga yangi odamlar qo'shilmay qolganda» (KORPUS §138 B — o'sha keys uchun tasdiqlangan ifoda).

## 8 · 3-savol  ← QTest (✔ D, `correctIdx 3`; Airbnb qoidasi — to'garak olamida)
- Eyebrow: Tekshiruv · Airbnb'dagidek
- Savol: **Airbnb asoschilaridek, to'garak muammosini qanday bilasiz?** (6 so'z) · savol ustida yorliq yo'q
  - A — Internetda to'garaklar haqidagi sharhlarni o'qiysiz (51)
  - B — Sinf chatiga «to'garak kerakmi?» deb yozib so'raysiz (52)
  - C — To'garaklar xaritasini chizib, do'stga ko'rsatasiz (50)
  - ✔ D — To'garak izlagan odamning o'zi bilan gaplashasiz (48)
- To'g'ri izohi: Asoschilar kvartiralarga o'zlari borib ko'rgan; siz odamning oldiga borib, voqeasini o'zingiz eshitasiz. (104)
- Xato izohlari: A — Sharhni boshqalar yozgan — odamni o'zingiz ko'rmadingiz. (56) · B — Bu savolga va'da yoki baho keladi, voqea emas. (46) ·
  C — Xaritani ko'rsatsangiz, g'oyangizga baho eshitasiz. (51) · (umumiy) Asoschilar muammoni qayerda bilganini eslang. (45)
- Javob topilgach (kichik, savol ostida): 7-ekran 3/3 sahnasining kichik nusxasi — kamera chaqnagan kvartira.
- Izoh (MD): «to'garak» to'rtala variantda (kalit so'z faqat to'g'rida emas); B — so'rash, lekin uzoqdan va bo'sh savol bilan; A, C — odam oldiga bormaslik (S-004 — 7-ekran qoidasi).

## 9 · Ikki g'oyangizga shablon  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Ikki g'oyangiz bo'yicha kimdan nimani so'raysiz?** (48)
- Kirish qatori (kulrang, bitta; ikki tarmoq bir shaklda):
  - (`pm-m9d2-rice` da `ikkita` bor) 2-darsda tanlangan ikki g'oyangiz: «{1-g'oya}» va «{2-g'oya}».
  - (yo'q) Ikki g'oyangizning muammosini yozing — har biriga bitta qator.
- Mentor: Har g'oya uchun kimdan so'rashni va 1-savoldagi bo'lakni yozing: qolgan to'rt savol ikkalasiga bir xil.
- Bitta ustun: qadam tugmalari 1/2/3 → bitta katta karta (joriy qadam) → Yordam · «Shablonga yozish» o'ngda (187) · ostida ikki ustunli shablon (o'quvchi g'oyalari bilan).
- Qadamlar:
  - **1 · 1-g'oya** — ikki qator: **Kimdan so'raysiz** (placeholder «Bu muammoga kim duch keladi?»; `pm-m9d1-goyalar` dagi «Kim uchun» bo'lsa — oldindan yozilgan, tahrirlanadi) ·
    **Bo'lak** — savol ichida: «Oxirgi marta [ … ] qachon bo'ldi?» (placeholder «masalan: to'garak izlaganingiz»).
  - **2 · 2-g'oya** — xuddi shunday.
  - **3 · Qolgan savollar** — tugma **Ikkala g'oyaga qo'shish**: 2–5-savollar ikkala ustunga bir vaqtda uchadi.
- Tekshiruv (`QXato`, ≤60; o'tmasa qator `err` fonda, shablonga yozilmaydi):
  - «Kimdan» qatori butunicha «hamma», «odamlar», «har kim»: "Hamma" — juda keng. Aynan kim duch keladi? (43)
  - bo'lakda kelajak yoki shart («bo'lsa», «-armidingiz», «kelasi», «keyingi»): Bu ish hali bo'lmagan — o'tgan kunni so'rang. (45)
  - bo'lakda g'oya so'zi («ilova», «sayt», «bot», «g'oya»): Savolda g'oyangiz bor — odamning o'zi haqida so'rang. (53)
  - bo'lak bo'sh: Bo'lakni yozing: odam nima qilganda qiynalgan? (46)
  - o'tsa (yashil, bitta qator): Savol o'tgan voqeani so'rayapti — shablonga yozildi. (52)
- Yordam: Bo'lakni «-ganingiz» bilan yozing, masalan: «to'garak izlaganingiz». Kimdan — g'oyaning «Kim uchun» qatoridagi odamlar.
- **Harakat → Vizual o'zgarish:** «Shablonga yozish» → ustun sarlavhasi ostiga «Kimdan: …» qatori va 1-savol sirg'alib kiradi, bo'lak accent fonda; joriy qadam ✓, keyingi karta kiradi.
  3-qadamda «Ikkala g'oyaga qo'shish» → to'rt savol ikki ustunga bir vaqtda uchadi, bir xil qatorlar orasida chiziq chiziladi. Tekshiruvdan o'tmagan qator `err` fon, ostida bitta `QXato`.
  3/3 da forma yopiladi, shablon butun enga (199), har qatorda ✎ (bosilsa o'sha qator katta karta bo'lib ochiladi).
- Xulosa: Shablon tayyor: ikki g'oyaga besh savol, faqat birinchisida bo'lak har xil. (75)
- Tugma (pastki): Uch qadamni bajaring (N/3) → Davom etish
- Keyingi bosiladigan joy: joriy qadam kartasining bo'sh qatori (accent, to'lqin) → «Shablonga yozish» → 3-qadamda «Ikkala g'oyaga qo'shish».
- Artefakt-strip (U-042): shu ekrandan — «Shablonim · 2 g'oya» (ixcham); 10, 11, 15-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Nishon: **Two Ideas Ready!** (shablon to'liq).
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda. Mentor rejimi: forma o'rniga Mentor misolining shabloni (2-ekran natijasi + olti qator).
- O'qituvchi eslatmasi: 2-dars natijasi yo'q o'quvchi 1-dars ro'yxatidan ikkita g'oyani tanlasin. Eng ko'p xato — bo'lakka g'oyani yozish («ilovani ishlatganingiz»): «Odam nima qilganda qiynalgan edi?» deb so'rang.

## 10 · Sinfdosh bilan intervyu  ← QMustaqil (juftlik, 3 qadam; yakka rejim bilan)
- Eyebrow: Juftlikda · intervyu · yakka rejimda: Mustaqil ish
- Sarlavha: **Sinfdoshingizdan birinchi yozuvni oling.** (40)
- Mentor (jonli darsda): Avval siz so'raysiz, keyin sherigingiz: javobni o'sha zahoti, u aytganidek yozing.
- Mentor (mustaqil rejimda): Yoningizdagi bir odamga savollaringizni bering: javobni o'sha zahoti, u aytganidek yozing.
- Qadam tugmalari: 1 Kim · 2 Savollar · 3 Harakat belgisi. Bitta ustun: bitta katta yozuv kartasi (joriy qadam) · Yordam · «Yozuvga qo'shish» o'ngda · ostida 9-ekrandagi shablon (ikki ustun, «Yozuvlar · n / 5»).
- **1 · Kim** — savol: **Sherigingiz qaysi g'oyangizning «Kim uchun» qatoriga mos keladi?** — uch tugma: «{1-g'oya}» · «{2-g'oya}» · «Hech biri» (g'oya tugmalari ostida kulrang «Kim uchun: …» — 03-FILTR 14); ostida qator «Kim» (oldindan «sinfdosh», ✎ — yoshini qo'shish mumkin).
  - g'oya tanlansa → kartada yorliq **haqiqiy yozuv** (yashil), karta o'sha ustunga bog'lanadi; `QIzoh`: Haqiqiy yozuv — «Kim uchun» qatoriga mos odamdan olingan yozuv: u o'ntaga kiradi. (81)
  - «Hech biri» → yorliq **mashq yozuvi** (kulrang) va ikki tugma — qaysi g'oya savollari bilan mashq qilasiz; `QIzoh`: Mashq yozuvi o'ntaga kirmaydi — u savol berishni sinash uchun. (62)
- **2 · Savollar** — 1–4-savollar bittadan (tepada savol, ostida qator «U nima dedi?»), «Yozuvga qo'shish».
- **3 · Harakat belgisi** — 5-savol va ikki tugma: **Ha — kun belgiladi** · **Yo'q — belgilamadi**; `QIzoh`: Yozuvga faqat «ha» yoki «yo'q» tushadi. (39)
- Tekshiruv (`QXato`, ≤60):
  - xulosa so'zi («kerak», «hamma», «ko'pchilik», «odatda»): Bu xulosaga o'xshaydi — u aytganidek yozing. (44) — yumshoq: xuddi shu matn bilan ikkinchi bosishda qabul qilinadi; yorliq «Shunday qoldirsangiz — yana bosing.»
  - qator bo'sh: tugma o'chiq emas, yonida qulf-yorliq: Sherigingiz nima dedi — shuni yozing. (37)
- Yordam: Sherigingizda bu voqea bo'lmagan bo'lsa — shuni yozing: bu ham javob. Kamroq gapiring, ko'proq tinglang.
- **Harakat → Vizual o'zgarish:** g'oya tugmasi → karta ustida yorliq (haqiqiy / mashq), shablonda mos ustun ajraladi · «Yozuvga qo'shish» → javob qatorga qo'shtirnoqda sirg'alib kiradi (~1 s yashil) ·
  «Ha» / «Yo'q» → Harakat belgisi qatori yoziladi. 3/3 da karta kichrayib o'z ustuni ostidagi joyga uchadi («Yozuvlar · 1 / 5»; mashq yozuvi — ustunlar ostidagi alohida «Mashq» joyiga), forma yopiladi.
  Ikkinchi tugma **Yana bitta yozuv** — sherik bilan o'rin almashgandan keyin, boshqa sinfdosh bo'lsa (darsda ko'pi bilan 2).
- Xulosa (tanlovdan, P-046):
  - haqiqiy: Haqiqiy yozuv tayyor: u shu g'oya ustunidagi beshtaning birinchisi. (67)
  - mashq: Mashq yozuvi tayyor: savollarni sinadingiz, lekin u o'ntaga kirmaydi. (69)
- Yakka rejim (sherik yo'q): Mentor gapi — Yoningizda odam bo'lmasa, uydagilardan biriga qo'ng'iroq qilib so'rang yoki bu qadamni uyda bajaring. Tugma: Davom etish (`optionalLive`).
- Tugma (pastki): Uch qadamni bajaring (N/3) → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: uch g'oya tugmasi → joriy savol ostidagi qator → «Yozuvga qo'shish» → «Ha» / «Yo'q».
- Nishon: **First Interview!** (bitta yozuv — haqiqiy yoki mashq — yakunlanganda).
- Mentor statistikasi: «Haqiqiy yozuv» · «Mashq yozuvi» (sinf bo'yicha son).
- O'qituvchi eslatmasi: Juftlikka 8 daqiqa — 4 daqiqa birinchisi so'raydi, 4 daqiqa ikkinchisi. Sinfdosh ko'p g'oyaning auditoriyasi (o'smirlar, sinfdoshlar) — bo'lmasa mashq: bu ham foydali.
  Telefon raqami so'ralmaydi: odam faqat sinab ko'rish uchun kun belgilaydi, yozuvga «ha» / «yo'q» (HB-q0 A). Sherigida voqea bo'lmagan bo'lsa — aynan shuni yozsin; «muammo yo'q» degan xulosani o'zi qo'shmasin (03-FILTR 15).

## 11 · Kod yozish  ← QKod (kod oynasi; tayanch 4; PM-082)
- Eyebrow: Kod yozish
- Sarlavha: **Savollarni ikki g'oyaga moslaydigan kod yozamiz.** (48) — PM-082(a) sarlavha oilasi (KORPUS §19, §48)
- Mentor: Shablon kodda turibdi: har g'oya uchun besh savollik ro'yxat yig'asiz.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **Ikkinchi g'oya uchun savollarning qaysi qismi o'zgaradi?** — uch tanlov:
  ✔ «Birinchi savoldagi bo'lak» · «Beshala savolning hammasi» · «Oxirgi savoldagi «10 daqiqa»»
  - xato («hammasi»): Hammasi o'zgarsa, javoblarni solishtirib bo'lmaydi. (51) · xato («10 daqiqa»): Oxirgi savol ikkala g'oyaga bir xil. (36)
- Chap (vazifa, 3 band; bosiladigan katakcha emas): 1 `savollar` besh savollik ro'yxat qaytaradi · 2 Birinchi savolda `goya.bolak` turadi · 3 Sahifada ikki ustun, har birida besh savol
- Yordam: Avval birinchi savolni yasang: `"Oxirgi marta " + goya.bolak + " qachon bo'ldi?"`. Keyin `umumiy` dagi to'rt savolni `forEach` bilan ro'yxatga `push` qiling.
  Eslatma (JavaScript darslaridan): massiv — ro'yxat · `+` — ikki matnni qo'shadi · `push` — ro'yxat oxiriga qo'shadi · `forEach` — ro'yxatdagi har element uchun bir marta ishlaydi.
  Qo'shimcha: `goyalar` ga o'z ikki g'oyangizning bo'lagini yozing — sahifada o'z shabloningiz chiqadi.
- O'ng: kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d, `user-select: none`) va platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`).
  Mentor gapi (o'ng, tugma ustida): Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz. «Kompilyator» ta'riflanmaydi — «kod oynasi».
- Kod (`app.js`):
```js
// Mentorning ikki g'oyasi: birinchi savolda almashadigan bo'lak
const goyalar = [
  { nom: "Jamoa yig'ish", bolak: "o'yinga odam yig'ganingiz" },
  { nom: "Mahalla to'garaklari", bolak: "to'garak izlaganingiz" }
];

// 2–5-savollar ikkala g'oyaga bir xil
const umumiy = [
  "O'shanda qanday qildingiz?",
  "Eng qiyini nima bo'ldi?",
  "Hozir buni nima bilan hal qilyapsiz?",
  "Birinchi versiya tayyor bo'lganda, uni sinab ko'rishga 10 daqiqa vaqt berasizmi? Qaysi kunni belgilaysiz?"
];

function savollar(goya) {
  // birinchi savolni goya.bolak bilan yasang, keyin umumiy savollarni qo'shing
  return [];   // shu joyni siz yozasiz
}

// har g'oya — sahifada bitta ustun (bu qism tayyor)
const joy = document.getElementById("shablon");
goyalar.forEach(function (goya) {
  const ustun = document.createElement("div");
  ustun.className = "ustun";
  const sarlavha = document.createElement("h2");
  sarlavha.textContent = goya.nom;
  ustun.appendChild(sarlavha);
  const royxat = document.createElement("ol");
  savollar(goya).forEach(function (matn) {
    const qator = document.createElement("li");
    qator.textContent = matn;
    royxat.appendChild(qator);
  });
  ustun.appendChild(royxat);
  joy.appendChild(ustun);
});
```
- `index.html` (tayyor, o'zgarmaydi): `<h1>Shablon: ikki g'oya</h1>` · `<div id="shablon"></div>` — `app.js` ni kod oynasi o'zi ulaydi (10-Modul 2-dars naqshi: `app.js` + `index.html`).
  `previewCss`: `#shablon` — ikki ustun yonma-yon (grid, oraliq 16 px); `.ustun` — oq karta, ingichka chegara, 8 px radius; `.ustun ol` — raqamli ro'yxat, qatorlar orasida bo'shliq.
- Kutilgan natija: chap ustun «Jamoa yig'ish» — 1. Oxirgi marta o'yinga odam yig'ganingiz qachon bo'ldi? 2. O'shanda qanday qildingiz? … 5. Birinchi versiya tayyor bo'lganda, uni sinab ko'rishga 10 daqiqa vaqt berasizmi? Qaysi kunni belgilaysiz? ·
  o'ng ustun «Mahalla to'garaklari» — 1. Oxirgi marta to'garak izlaganingiz qachon bo'ldi? va o'sha to'rt savol.
- Kod oynasi sarlavhasi: `app.js — savollar funksiyasini yakunlang` · placeholder: `// birinchi savolni yasang, keyin umumiy savollarni qo'shing`
- Shart xabarlari (≤60): 1 — Har g'oyaga besh savol: ro'yxat uzunligi 5 bo'lsin. (51) · 2 — 1-savol: «Oxirgi marta», bo'lak va «qachon bo'ldi?» (51) ·
  3 — Sahifada ikki ustun, har birida besh savol bo'lsin. (51)
- **Harakat → Vizual o'zgarish:** darvozada to'g'ri tanlov → kod namunasida `bolak` qiymatlari bir lahza ajraladi (shablondagi accent rangida);
  kod oynasida kod ishga tushganda natija oynasida ikki ustun chiqadi, 1-savollardagi bo'lak boshqa-boshqa; shartlar birma-bir ✓. Kod oynasidagi «Davom etish» faqat uch shart ✓ bo'lganda ochiladi.
- Hammasi bajarilgach (yashil): Kod ikki g'oyaga bitta shablonni sahifaga chiqardi. (51)
- Tugmalar: Orqaga · ① Kod-savolini yeching → ② Kodni yozing → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Nishon: **Question Coder!** (uch shart ✓).
- O'qituvchi eslatmasi: Kod — 3–4 daqiqalik mashq, yangi qoida yo'q: bir xil savollar va almashadigan bo'lak. O'z g'oyalarini `goyalar` ga yozgan o'quvchini maqtang — shart emas.
- Saqlash: kod oynasi qoralamasi `pm-m9d3-code` (tayanch 8).

## 12 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`; harakat belgisi)
- Eyebrow: Yakuniy tekshiruv
- Iqtibos (savol ustida, pufakda): Sinfdosh: «Ajoyib g'oya, men ishlatardim!» — ostida kulrang qator: sinab ko'rishga kun belgilamadi.
- Savol: **Harakat belgisi qatoriga nima yozasiz?** (5 so'z) · savol ustida yorliq yo'q
  - A — «ha» — ishlatishini o'zi aytdi (30)
  - ✔ B — «yo'q» — kun belgilamadi (26)
  - C — «ha» — g'oyani maqtab gapirdi (29)
  - D — Hech narsa — javob noaniq bo'ldi (32)
- To'g'ri izohi: Maqtov va «ishlatardim» — so'z; kun belgilanmadi — bu yozuvda belgi «yo'q». (78)
- Xato izohlari: A — «Ishlatardim» — hali bo'lmagan ish haqida va'da. (48) · C — Maqtov — g'oyaga baho, ish emas. (32) · D — Javob bor: u kun belgilamadi. (29) ·
  (umumiy) Odam so'z aytdimi yoki ish qildimi — shuni qarang. (50)
- Javob topilgach (kichik, savol ostida): `YozuvKarta` oxirgi qatori — «Harakat belgisi — yo'q» (kulrang).
- Izoh (MD): tire to'rtala variantda, qo'shtirnoq uchtasida (belgi faqat to'g'rida emas); A, C — 9-Modul va'da va baho; D — javob bor (S-004).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — To'garakka birinchi savol · 2 — Hozir nima bilan · 3 — Airbnb'dagidek · 4 — Harakat belgisi

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Nega ikki g'oyani bir xil savollar bilan tekshirasiz? | Javoblarni qatorma-qator solishtirish uchun |
| Ikkinchi g'oyada savolning qaysi qismi almashadi? | Faqat 1-savoldagi bo'lak: «o'yinga odam yig'ganingiz» o'rniga «to'garak izlaganingiz» |
| Qaysi savol bo'lib o'tgan ishni so'raydi? | «Oxirgi marta … qachon bo'ldi?» kabi savol — voqea savoli |
| «Ilova bo'lsa, ishlatarmidingiz?» savoliga qanday javob keladi? | Va'da: ilova hali yo'q |
| «Hozir buni nima bilan hal qilyapsiz?» savoli nimani ochadi? | Odam muammoni hozir nima bilan hal qilayotganini — yangi yechim shu bilan solishtiriladi |
| Harakat belgisi nima? | Intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish |
| Mentor misolida harakat belgisi qaysi ish edi? | Odam sinab ko'rishga kun belgiladimi — «ha» yoki «yo'q» |
| Odam sinovga kun belgiladi. Bu nega maqtovdan kuchliroq? | U o'z vaqtini berishga rozi bo'ldi — maqtov esa hech narsa talab qilmaydi |
| Odam «ishlatardim» dedi, lekin kun belgilamadi. Belgi qanday? | «Yo'q»: so'z bor, ish yo'q |
| Airbnb asoschilari yomon suratlarni qanday bilgan? | Nyu-Yorkdagi kvartiralarni o'zlari aylanib, suratga olib |
| Sherigingiz g'oyangiz auditoriyasidan bo'lmasa, yozuv qanday bo'ladi? | Mashq yozuvi: u o'ntaga kirmaydi |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 11/11 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (bir xil savollar, bo'lak — 2, 9 · voqea savoli, va'da — 2 · hozir nima bilan — 4 · harakat belgisi, «ha / yo'q» — 6, 10, 12 · Airbnb — 7 · mashq yozuvi — 10).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Shablon va birinchi yozuvingiz tayyor.** (38) · yozuv bo'lmasa (P-046): **Shablon tayyor — yozuvlar uyda.** (31)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Ikki g'oyani bir xil savollar bilan tekshirasiz; odamning qiziqishini so'zidan ko'ra ishi aniqroq ko'rsatadi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Ikkala g'oyaga savollar bir xil — faqat 1-savolda bo'lak almashadi.
  - «Hozir buni nima bilan hal qilyapsiz?» savoli yangi yechim nima bilan solishtirilishini ochadi.
  - Harakat belgisi — intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish.
  - Sherik g'oya auditoriyasidan bo'lmasa, yozuv mashq bo'lib qoladi.
  - Airbnb asoschilari muammoni kvartiralarga o'zlari borib bilgan.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: ikki g'oyangiz auditoriyasidan · Nechta: 10 yozuv — har g'oyaga 5 · Muddat: keyingi darsgacha
  - ① Har g'oya uchun «Kim uchun» qatoridagi odamlardan beshtasini toping — 1-darsdagi qog'ozingizdan boshlang.
  - ② Har biriga shablondagi besh savolni bering: g'oyangizni faqat oxirgi savolda aytasiz.
  - ③ Javobni o'sha zahoti, u aytganidek qog'ozga yozing; harakat belgisiga faqat «ha» yoki «yo'q».
  - ④ O'nta yozuvli qog'ozni keyingi darsga olib keling — darsdagi haqiqiy yozuv ham shu o'ntaga kiradi.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «O'n intervyudan keyin qaysi g'oya qoladi?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ichki skroll qutisi yo'q (SABOQ 18); «Kim bilan» — HwCard yorlig'i («Kim uchun» — g'oya qismi bilan to'qnashmasin, T-015).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Same Questions!** (2-ekran, beshala savol birinchi urinishda) — Savollarni birinchi urinishda ajratib, ikkinchi g'oyaga moslab berdingiz
- **Two Ideas Ready!** (9-ekran, shablon to'liq) — Ikki g'oyangizga bir xil savollar bilan shablon tuzdingiz
- **First Interview!** (10-ekran, bitta yozuv yakunlanganda) — Sinfdoshingizdan intervyu olib, birinchi yozuvni to'ldirdingiz
- **Question Coder!** (11-ekran, uch shart ✓) — Savollarni ikki g'oyaga moslaydigan kod yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Bir xil savollar** — 1 Voqea savoli bo'lib o'tgan ishni so'raydi; «ishlatarmidingiz?» — bo'sh savol. · 2 Ikkala g'oyaga savollar bir xil. · 3 Faqat 1-savolda bo'lak almashadi.
  — Sinfga savol: Sinf uy vazifalari g'oyasida birinchi savol qanday bo'ladi?
- **5 · Hozir nima bilan** — 1 To'rtinchi savol: «Hozir buni nima bilan hal qilyapsiz?» · 2 Javob odam hozir nima qilayotganini aytadi. · 3 Yangi yechim shu bilan solishtiriladi.
  — Sinfga savol: Siz jamoani hozir nima bilan yig'asiz?
- **8 · Airbnb — odam oldiga borish** — 1 2007-yilda asoschilar o'z uyida uchta havo to'shagini ijaraga bergan. · 2 Saytga yangi odamlar qo'shilmay qolganda, ular Nyu-Yorkdagi kvartiralarni o'zlari aylangan. ·
  3 Yomon suratlar xalaqit berayotganini o'sha yerda bilgan. — Sinfga savol: Ikki g'oyangiz odamlarini qayerda uchratasiz?
- **12 · Harakat belgisi** — 1 Intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish — harakat belgisi. · 2 Mentor misolida — odam sinab ko'rishga kun belgiladimi. · 3 Yozuvga faqat «ha» yoki «yo'q» tushadi.
  — Sinfga savol: Do'stingiz g'oyangizni maqtadi — bu harakat belgisimi?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·6·11 · B 4·8·12 · C 2·5·9 · D 3·7·10 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Ikki g'oyani intervyuda qanday savollar bilan tekshirasiz? (2)
   - ✔ Ikkalasiga bir xil savollar bilan (33)
   - Har biriga alohida savollar bilan (33)
   - Kuchlirog'iga ko'proq savollar bilan (36)
   - Har biriga bitta-ikkita savol bilan (35)
2. To'garak g'oyasida savollarning nimasi almashadi? (2)
   - Beshala savolning hammasi birdan (32)
   - Faqat oxirgi savoldagi bitta so'z (33)
   - ✔ Faqat birinchi savoldagi bo'lak (31)
   - Savollar qaysi tartibda kelishi (31)
3. To'garak izlagan odamga qaysi savol voqeani ochadi? (2)
   - «Xaritasi bo'lsa, ochib ko'rardingizmi?» (40)
   - «Yozda to'garak topish qiyin edimi?» (36)
   - «Odatda to'garakni qanday tanlaysiz?» (37)
   - ✔ «Yozda to'garakni qanday qidirdingiz?» (38)
4. «Hozir buni nima bilan hal qilyapsiz?» savoli nimani ochadi? (4)
   - Odam ilovani qaysi kuni yuklab olishini (39)
   - ✔ Muammo chiqqanda odam bugun qanday yo'l tutishini (49) ✎ F-1006-275: savol so'zlarini («hozir», «nima») faqat to'g'ri variant takrorlardi (lint-tell)
   - Odamga ikki g'oyadan qaysi biri yoqishini (41)
   - Odam bu muammoni kimdan eshitib qolganini (41)
5. Mentor misolida o'yinchilar jamoani hozir qanday yig'adi? (4)
   - Maktabdagi e'lon taxtasi orqali (31)
   - Maydon egasiga qo'ng'iroq qilib (31)
   - ✔ Telegram guruhiga yozib, so'rab (31)
   - Maxsus futbol ilovasi orqali yozib (34)
6. Mentor misolida qaysi biri harakat belgisi? (6)
   - ✔ Sinovga kun belgiladi (21)
   - «Ajoyib g'oya» deb maqtadi (26)
   - «Ishlatardim» deb aytdi (23)
   - Intervyuda uzoq gapirdi (23)
7. Harakat belgisi savoli intervyuning qayerida beriladi? (6)
   - Eng boshida, salomlashgandan keyin (34)
   - Birinchi savolni berishdan oldin (32)
   - Uchinchi savoldan keyin, o'rtada (32)
   - ✔ Oxirida, muammo haqida so'ragach (32)
8. Yozuvning harakat belgisi qatoriga nima tushadi? (6, 10)
   - Odamning ismi va sinov kuni (29)
   - ✔ Faqat «ha» yoki «yo'q» belgisi (30)
   - Odamning «ishlatardim» degan gapi (33)
   - Sizning g'oya haqidagi fikringiz (32)
9. Saytga yangi odamlar qo'shilmay qolganda Airbnb asoschilari nima qilgan? (7)
   - Saytdagi tugmalarni o'zgartirgan (32)
   - Uy egalariga uzun xatlar yozgan (31)
   - ✔ Kvartiralarni o'zlari aylangan (30)
   - Saytga ko'proq reklama bergan (29)
10. Airbnb asoschilari kvartiralarda nimani bilgan? (7)
    - Uylarning narxi juda balandligini (33)
    - Uy egalari saytni bilmasligini (30)
    - Mehmonlar uyda shovqin qilishini (32)
    - ✔ Yomon suratlar xalaqit berishini (32)
11. Sherigingiz g'oya auditoriyasidan emas. Uning yozuvi qanday bo'ladi? (10)
    - ✔ Mashq yozuvi — o'ntaga kirmaydi (31)
    - Haqiqiy yozuv — o'ntaga qo'shiladi (34)
    - Yozuv olinmaydi — vaqt bekor ketadi (35)
    - Ikki yozuv — har g'oyaga bittadan (33)
12. Sinfdoshingiz javobini yozuvga qanday yozasiz? (10)
    - Uyda, eslab qolganingizcha (26)
    - ✔ O'sha zahoti, u aytganidek (26)
    - O'z xulosangiz bilan qo'shib (28)
    - Bitta so'z bilan, qisqartirib (29)
- Arena yozuvlari — platforma shabloni (namuna 6-Modul YAKUNIY 14-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — intervyu · yozuv · savol · shablon · voqea · belgi · g'oya · sherik ·
  uyga vazifa banneri — intervyu · yozuv · savol · g'oya.

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/9-Modull/PmInterviewsOneLesson.jsx` — skeletdan. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s6 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s8/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s7 `QVoqea` · s9/s10 `QMustaqil` · s11 `QKod` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')`.
2. **`SHABLON`** — bitta manba (180): 6 × `{ kalit: 'kim' | 'oxirgi' | 'qanday' | 'qiyin' | 'hozir' | 'belgi', nom, savol }` (tayanch 1.3 aynan; `kim` da savol yo'q; 1-savolda `{bolak}` joyi).
   **`IkkiShablon`** — ikki ustun, qatorlar soni prop bilan (3 → 4 → 6 — 2, 4, 6-ekranlar), bo'lak accent, qatorlar orasida chiziq; **`YozuvKarta`** (`ixcham` · `toliq`), ustun ostida «Yozuvlar · n / 5» va 5 joy (P-056).
   Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. Qolip-maket izohi faylda e'lon qilinadi.
3. **`MENTOR_GOYALAR2`** — 2 × `{ nom, muammo, kim, bolak }` (tayanch 1.1 — 1 va 3-g'oya; bo'lak — 1.3). **`MENTOR_YOZUVLAR`** — 5 × `{ n, goya: 0 | 1, kim, oxirgi, qanday, qiyin, hozir, belgi }` (tayanch 1.3 — 1, 2, 3, 6, 7 aynan).
   Bitta manba: 0, 2, 4, 6, 9 (mentor rejimi), 11 (kod namunasidagi bo'lak — shu yerdan).
4. s0: `QKirish` sof so'rovnoma — hammaga `correct: false`, maqtov yo'q (J-026); ikki g'oya kartasi (`GoyaKarta` ixcham — 1-dars komponenti nusxa emas, shu darsning o'z ko'rinishi) + «RICE 24/20» yorlig'i; tanlovdan keyin 5+5 joy.
5. s2: `S2_SAVOLLAR` 5 × `{ matn, tomon: 'voqea' | 'bosh', javob?, yorliq?, qator? }`; ketma-ket karta; ikki tomon tugmasi; 5/5 da tomon nomlari; «To'garakka moslash» — uch savol uchadi, bo'lak almashadi;
   `QXato` matnlari tomonga qarab; 40 s ipucha; nishon `sameQuestions` (birinchi urinish).
6. s4: 5 yozuv joyi, «Savolni berish» ketma-ket; `TelefonMaket` holatlari: `tgChat` (xabarlar oqimi, «+» lar suriladi) · `qongiroq` · `tgUchMarta` · `tanishlar` · `mahallaChat` (namoyish matnlari — faylda izoh bilan);
   «Telegram» nomi o'z rangida (`Brend`); natijada ikki kichik holat.
7. s6: `QBashorat` 3 variant (o'sish tartibi) → ixcham qator; ketma-ket katta `YozuvKarta` (1, 2, 3, 6, 7); `TelefonMaket` «Sinov kunlari» (belgilangan kun yonida Kim yorlig'i yoki «Kun belgilanmadi»); karta ustunga uchadi; 5/5 da 6-qator va yorliq «harakat belgisi»;
   `QTaxmin` + xulosa bitta natija blokida (SABOQ 25).
8. s7: `AIRBNB_BOSQICH` 3 × `{ h — bosqich nomi, m — Mentor gapi }` (SABOQ 8); `AirbnbSahna` (mehmonxona «Joy yo'q» → havo to'shaklari → Nyu-York uylari, kamera → brauzer oynasidagi xira e'lon yonida alohida yorug' kadr, e'lon almashmaydi);
   nom «Airbnb» o'z rangida (`Brend`), logotip yo'q; bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); manba izohi faylda (bank K4, KORPUS §138 B).
9. s9 artefakt: o'qiydi `pm-m9d2-rice` (`ikkita`) va g'oya matni uchun `pm-m9d1-goyalar` (TAYANCHGA SAVOL 4); yo'q bo'lsa erkin qator. Yozadi `localStorage` `pm-m9d3-intervyu` =
   `{ goyalar: [{ matn, kim, bolak }] × 2, savollar: [5] (1-savolda «{bolak}»), yozuvlar: [], savedAt }`. Tekshiruv `RegExp` lari (kelajak/shart, g'oya so'zi, «hamma»); ketma-ket karta; ✎; nishon `twoIdeas`; artefakt-strip «Shablonim».
10. s10: 3 qadam; g'oya tugmalari 9-ekran ma'lumotidan; `tur: 'haqiqiy' | 'mashq'`; yozuv `pm-m9d3-intervyu.yozuvlar` ga `{ goya, kim, oxirgi, qanday, qiyin, hozir, belgi: 'ha' | 'yo'q', tur }` (kun va shaxsiy ma'lumot maydoni YO'Q);
    xulosa so'zi tekshiruvi yumshoq (ikkinchi bosishda o'tadi); «Yana bitta yozuv» (≤ 2); yakka rejim matni; `optionalLive`; Mentor statistikasi; nishon `firstInterview`.
11. s11: `KOD_TASK` — `files: [{ name: 'app.js' }, { name: 'index.html' }]`, `previewCss` (`#shablon`, `.ustun`), 3 shart (`C.evalEquals`):
    (1) `savollar(goyalar[0]).length` = `5` va `savollar(goyalar[1]).length` = `5` · (2) `savollar(goyalar[1])[0]` = `Oxirgi marta to'garak izlaganingiz qachon bo'ldi?` va
    `savollar(goyalar[0]).slice(1).join("|")` = `umumiy.join("|")` · (3) `#shablon .ustun` soni 2 va `#shablon li` soni 10 (`C.custom` yoki `evalEquals`, `window` ichida);
    darvoza `KOD_DARVOZA` (3 tanlov); `KodNamuna` (`bolak` qiymatlari ajralishi, nusxalanmaydi); `storageKey="pm-m9d3-code"`; QKod o'ng ustun propi — 9-Modul 1-dars `QKOD_ONG` yechimi (til-lint); nishon `questionCoder`.
    ⚠️ Starter matni ichida backtik yo'q (template-satr emas) — CSS/JSX tuzog'i (CLAUDE.md). Satrlar qo'shtirnoqda (apostrof).
12. Testlar s3/s5/s8/s12 — `correctIdx` 2/0/3/1 = `INLINE_KEYS`; `RECAPS` 3/5/8/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6).
    s3/s5/s8/s12 karta — `QuestionScreen` `vizual`: savol ostida, faqat javob topilgach / natija ochilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. `ACHIEVEMENTS` 4 (`sameQuestions`, `twoIdeas`, `firstInterview`, `questionCoder`); s15 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — ScoreRing ostida (P-013); `HW_TOKENS` — faqat so'z.
14. Uyga vazifa — yangi `HwCard` (dars yangi; PM-027 «tegilmaydi» bu yerga tegishli emas): yorliqlar «Kim bilan · Nechta · Muddat», 4 qadam, yakun ekranida aynan shular. Alohida `.homework.jsx` yo'q.
15. App.jsx: `m9-03` qatoriga `comp: PmInterviewsOneLesson` + import — asosiy seans (bu agent tegmaydi). Nom «Ikki g'oyadan qaysi biri odamlarga kerak?» ✓ va osti ✓ (DE-205, App.jsx 374-qator).
16. **REPO — yo'q** (PM darsi).
- Darvozalar: `npm run gates -- src/9-Modull/PmInterviewsOneLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
> **Holat (06.10, 03-FILTR):** 1 → 9.43 · 2 → qabul (2-ekran yorlig'i «bo'lak — g'oyaga qarab almashadi») · 3, 4, 8, 11 → qabul · 5 → 9.44 (uy yozuvlari qog'ozda, 4-darsda sanoq kiritiladi) ·
> 7 → 9.43 · 9 → qabul · 10 → tayanch 9.57 · **6 va harakat belgisi — HB-q0 A (06.10): «sinab ko'rishga kun belgilash», telefon raqami so'ralmaydi, 5-savol platformasiz.**
1. **Artefakt nomi — «shablon».** Tayanch 4 da «intervyu varag'i» (natija), kod mexanikasida «savol varag'i», 1.3 da «9-Moduldan qoladi: shablon». Bitta narsaga uch nom bo'lmasin (T-014) — darsda faqat **«shablon»**
   (o'quvchi 9-Modulda o'rgangan so'z, ta'rifi «har intervyuda bir xil qatorlar» o'zgarmaydi; bugun qatorlar oltita). 4-dars ham shu so'zni ishlatsin.
2. **«Bo'lak»** — 1-savolda almashadigan qism (tayanch 1.3: «g'oya so'zi almashadi»). «G'oya so'zi» deb yozilmadi: 9-Modul tekshiruvida «g'oya so'zi» — savoldagi «sayt / ilova» (bo'sh savol belgisi), ma'no to'qnashadi;
   «ish» ham olinmadi — u harakat belgisi ta'rifida («ish bilan ko'rsatgan»). Kodda `bolak`.
3. **Yozuv matni 3-shaxsda** (tayanch 1.3: «… deb yozdi», «… so'radi»), 9-Modul qoidasi «u aytganidek» — 1-shaxs iqtibos. Darsda Mentor yozuvlari **pufaksiz, yozilgan holda** ko'rsatiladi (matn aynan),
   o'quvchi o'z yozuvida sherigining gapini o'zi aytganidek yozadi. Yozuvlar 1-shaxsga o'tkazilsa — tayanchda tuzatilsin (4-dars bilan birga).
4. **Kalitlar.** (a) 9-ekran g'oya matni uchun `pm-m9d2-rice` (`ikkita` — indeks) bilan birga `pm-m9d1-goyalar` ni ham o'qiydi (tayanch 8 da 3-dars faqat `pm-m9d2-rice` ni o'qiydi; indeks qaysi ro'yxatga ekani 2-dars MD si bilan kelishilsin).
   (b) `pm-m9d3-intervyu.goyalar` — `[{ matn, kim, bolak }]`, `savollar[0]` da `{bolak}` joyi. (c) yozuvga yangi maydon **`tur: 'haqiqiy' | 'mashq'`** — 4-dars mashq yozuvini o'ntaga qo'shmasin.
5. **Uyga vazifa hajmi: 10 yozuv (har g'oyaga 5), keyingi darsgacha** — `MD_TOPSHIRIQ_2.md` 3-band va topshiriq xabari bo'yicha. Tayanch 4 da «darsda 1–2, uyda 5 gacha», menyu ostida «birinchi 5 yozuv» —
   menyudagi «birinchi 5 yozuv» darsda Mentor misolining beshtasi deb o'qildi. Uydagi yozuvlar qayerga kiritilishi — 4-dars MD si bilan kelishilsin (`pm-m9d3-intervyu.yozuvlar` da faqat darsdagi 1–2 yozuv bo'ladi).
6. ~~**5-savol matni** «Ilova chiqsa, …»~~ — **yopildi: HB-q0 A** — «Birinchi versiya tayyor bo'lganda, …». Eski izoh: o'quvchi shablonida ham aynan qoldi (tayanch 1.3). Platforma 8-darsda tanlanadi — sayt qiladigan o'quvchi uchun «Sayt chiqsa, …» kerakmi? Hozir — o'zgartirilmadi.
7. ~~**Telefon raqamining o'zi yozuvga tushmaydi**~~ — **yopildi: HB-q0 A** — raqam umuman so'ralmaydi. Eski izoh: — faqat «ha» / «yo'q» (o'smir va sinfdoshlarining shaxsiy ma'lumoti dars `localStorage`ida saqlanmasin). Tayanchda yo'q — o'zim qo'shdim (10-ekran `QIzoh`, uyga vazifa ③, kartochka).
8. **Haqiqiy / mashq yozuv** — o'quvchi tugma bilan o'zi belgilaydi (halol tugma, tekshirib bo'lmaydi). GATE_M 15 «auditoriya tengdosh bo'lsa — haqiqiy yozuv» shu bilan amalga oshadi.
9. **Airbnb iborasi:** bank «bandlovni o'ldirayotganini» → darsda «uylar band qilinishiga xalaqit berayotganini» (o'smir tili, ma'no o'sha). «O'sish to'xtaganda» → «Saytga yangi odamlar qo'shilmay qolganda» (KORPUS §138 B).
   Yozilish: tayanch «San-Fransisko»; 7-Modul YAKUNIY `08-PmLesson20.md` da «San-Frantsisko» — kursda ikki xil, bu darsda tayanchdagidek.
10. **Telefon maketidagi chat matnlari** (4-ekran: «Shanba o'yin. Kim keladi?», «+», boshqa xabarlar) va 6-ekran «Sinov kunlari» ro'yxati (HB-q0 A) — namoyish uchun o'zim yozdim; yozuvlar mazmuniga zid emas, yangi fakt yo'q.
11. **5-ekran (test) ikkinchi misoli** — Mentorning 4-g'oyasi «Sinf uy vazifalari» olamidan iqtibos «Hozir uy vazifasini sinf chatidan qidiraman.» — o'ylab topildi (Mentor yozuvi emas, test vaziyati).

## Shubhali joylar (ishonchim komil emas)
- 2-ekran bitta ekranda ikki ishni bajaradi: 9-Modul qoidasini eslatish (tomonlar) va savollarni ikkinchi g'oyaga moslash — bir mexanika ichida, lekin P-008 ga yaqin turadi; ekran soni 16 da qolishi uchun shunday birlashtirildi.
- ~~4-ekran xulosasi «mahsulot shu bilan solishtiriladi»~~ — **yopildi (03-FILTR 9):** «yangi yechimni shu bilan solishtirasiz» — mahsulot hali qurilmagan.
- 5-ekran B varianti («muammo yo'q ekan») — dars qoidasi bo'yicha noto'g'ri (hozirgi yo'l borligi muammo yo'qligini bildirmaydi), lekin kimdir «chatda topsa — hal bo'lgan» deb bahslashishi mumkin.
- 0-ekran variantlari uzunligi 38 va 34 — sof so'rovnoma, to'g'ri javob yo'q; teng bo'lishi uchun «mahalladagi o'yinchilar» → «mahalla o'yinchilari» qisqartirildi.
- 10-ekran yakka rejimi — darsning yagona real-odam qadami; sherik bo'lmasa qadam uyga o'tadi (P-028 xavfi 9-Moduldagidek qoladi).
- 12-ekran iqtibosi «Ajoyib g'oya, men ishlatardim!» — o'ylab topilgan sinfdosh gapi (test vaziyati).
- Arena 5 («Telegram guruhida yozishib») — Mentor yozuvlaridan o'qish savoli; 2-yozuvda «qo'ng'iroq» ham bor — distraktor «Maydon egasiga qo'ng'iroq qilib» boshqa odamga qo'ng'iroq, lekin o'quvchi chalkashishi mumkin.
- 11-ekran: `push`, `forEach` — JavaScript darslarida o'tilgan deb oldim (9-Modul 2-dars kodi ham `push` ishlatgan).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 373–375 — `m9-02` «Oltita g'oyadan qaysi uchtasi qoladi?» → **`m9-03` «Ikki g'oyadan qaysi biri odamlarga kerak?»**
  (osti «10 intervyu, 1-qism: ikki g'oya, bir xil savollar» — reja chap qatori so'zma-so'z) → `m9-04` «O'n intervyudan keyin qaysi g'oya qoladi?» (yakun qatori).
- [x] Bitta misol-ip: Mentorning ikki g'oyasi va birinchi beshta yozuvi (1.3 aynan); metafora yo'q; bitta vizual — ikki ustunli shablon (`IkkiShablon` + `YozuvKarta`), qatorlar ekrandan ekranga qo'shiladi.
  Ikkinchi misol faqat testda (5 — sinf uy vazifalari, 12 — sinfdosh iqtibosi). Airbnb — keys sahnasi (PM-028/029). «Maydon Jamoa» yo'q.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 6 (QTushuncha) + 0, 7, 9, 10, 11; testlarda javobdan keyingi karta. «bosish → matn-karta» yo'q — har bosish shablonni, yozuvni yoki telefon maketini o'zgartiradi.
- [x] O'lchov (skript bilan sanaldi, `scratchpad/md03/olchov.py`): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktiv ekranlarda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
- [x] Atamalar: intervyu, yozuv, shablon, voqea savoli, bo'sh savol, va'da, «u aytganidek», «o'sha zahoti», mashq yozuvi — 9-Modul `m7-02` so'zlari aynan; harakat belgisi — tayanch 2 ta'rifi so'zma-so'z (6, 14, 15);
  «jamoa», «maydon», «band» — bir ma'noda; siz-forma; tugmalar ot-shaklda («Savolni berish», «Shablonga yozish», «Yozuvga qo'shish», «To'garakka moslash»).
- [x] Testlar: 4 variant, uzunlik teng (farq ≤15%, skript); to'g'ri javob yolg'iz eng uzun emas; kalit so'z / tire / qo'shtirnoq faqat to'g'rida emas (s3 «Oxirgi marta» B va C da · s5 «sinf chati» A va D da ·
  s8 «to'garak» to'rtalasida · s12 tire to'rtalasida). Arena 12 — farq ≤15%, ✔ A3 B3 C3 D3. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «albatta», «100%» — grep 0; «bu misolda», «Mentor misolida» bilan chegaralangan).
- [x] Ichki kodlar yo'q (o'quvchi matnida F-kod, `m9-NN`, «Modul 11», №-raqam yo'q; modul raqami LMS raqamida — «9-Modul», «7-Modul» faqat O'qituvchi eslatmasida). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 16 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (harakat belgisi — beshta yozuvdan keyin, sarlavhada yo'q) · T-014/T-015 (shablon — bitta nom; «bo'lak», «ish» ajratildi; «Kim bilan» yorlig'i) · T-016 (metafora yo'q) ·
  T-029 (Mentor «Bu…» bilan boshlanmaydi) · T-039 («shabloningiz» — 9-ekrandan keyin) · T-042 (ta'rif so'zma-so'z: 6, 14, 15) · T-043 («bu misolda», yozuvlar sanalmaydi) · T-047/T-048 (asosiy fikr yakunda bir marta) ·
  T-052 (9-Modul so'zlari aynan) · P-001 (bitta ip) · P-008 · P-013 · P-015 · P-025 (uyga vazifa karta + 4 qadam) · P-033 (yordam xatodan keyin) · P-036 (0, 1-ekranda joylar nima ekani aytilmaydi) ·
  P-046 (10-ekran va yakun sarlavhasi o'quvchi ma'lumotidan) · P-053 (keys sahnasi bosqichma-bosqich, bashoratda `pre` kadr) · P-056 («n / 5» joylar) · P-062 · P-064 (bashorat 6, 7) · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004 · S-006 · S-010 · S-015 (bashorat zinapoya: so'zdan ishga · uzoqdan yoniga) · S-018 (Airbnb izohi) · S-020 · S-026 · S-027 · S-040 ·
  PM-005 (2-tur) · PM-017 (namuna — Mentor yozuvlari, rost) · PM-018 (Airbnb — faqat bankdagi qaror) · PM-082 (kod ekrani darvozasi, nusxa yo'q) · J-026 (hook) · SABOQ 1–31.
- [ ] Ochiq: TAYANCHGA SAVOL 1 (shablon nomi), 3 (yozuv shaxsi), 4 (kalitlar), 5 (uydagi yozuvlar qayerga kiritiladi) — 2 va 4-dars MD lari bilan kelishish kerak.
