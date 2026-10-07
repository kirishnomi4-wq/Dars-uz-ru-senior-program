# 11-Modul · 1-dars (PM) «Oltita g'oyani qayerdan topasiz?» — MD v3

Fayl: `src/9-Modull/PmTenIdeasLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m9-01` · **15 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta, yozilgani ixcham qatorga uchadi) · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q ·
ekranda ≤ 3 blok · maket chapda, karta o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **A** (`0`) · 7-ekran — **D** (`3`) · 11-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx, DE-205): `m8-11` «Besh daqiqada nimani ko'rsatasiz?» → `m8-12`, `m8-13` «Zaxira dars» → **`m9-01` «Oltita g'oyani qayerdan topasiz?»** (osti: «muammo, kim uchun va yechim — 6 yozma g'oya») → `m9-02` «Oltita g'oyadan qaysi uchtasi qoladi?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (oltita g'oya), mustaqil ish majburiy (8-ekran). Keys — **K18 Starbucks** (tayanch 5, faqat bank matni). REPO yo'q (PM darsi; `maydon-jamoa` 7-darsdan).
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 6 · tushuncha, keys va testlar (2–7) ≈ 30 · oltita g'oya ≈ 15 · juftlik ≈ 9 · kod ≈ 12 · yakuniy savol, podium, kartochkalar, arena ≈ 15.
Manba: `00-MODUL-TAYANCH.md`i (1-bo'lim ip · 1.1 Mentorning 6 g'oyasi aynan · 2 — «g'oya» · 4 — kod mexanikasi · 5 — K18 · 7 — takroriy xatolar · 8 — kalitlar) · `GATE_M_JAVOB.md` (Qaror-0 1, 2, 3, 17) · `00-TAQIQLAR.md`.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: «Bir darsda 10 g'oya: muammo + auditoriya + yechim → asoslangan 10 yozma g'oya»; **foydalanuvchi qarori 06.10 — 6 g'oya**, Mentor ham 6, F-1006-272):** o'quvchi oltita g'oya yozadi; har birida uch qism
   (muammo · kim uchun · yechim) va manba — muammo qayerdan kelgani. «Asoslangan» shu ma'noda: har g'oyada muammo qayerdan kelgani ko'rsatilgan (9-Modul ro'yxati, MVP'ning «Keyin» qutisi, yangi kuzatuv) — bu isbot emas, dalil 3–4-darslarda intervyu bilan yig'iladi (01-FILTR 7).
   **Oltita — darsda (01-FILTR 1):** yakka rejimda 8-ekranda «Davom etish» 6 / 6 bo'lmaguncha yopiq («Yana N ta g'oya yozing»); jonli darsda Mentor ≈20 daqiqadan keyin juftlikka o'tkazadi —
   oltitaga yetmagan o'quvchi uyda to'ldiradi (uyga vazifa ① — shartli), 2-dars oltitadan saralaydi.
   Saqlanadi: `pm-m9d1-goyalar` (2-dars o'qiydi). Bugun g'oyalar baholanmaydi va tanlanmaydi — saralash va RICE 2-darsda (dars ichida va'da qilinmaydi, T-038).
2. **Bugungi asosiy fikr (P-013):** G'oya nom emas: unda muammo, kim uchun va yechim yoziladi. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **Yangi atama — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **g'oya** — «G'oya uch qismdan iborat: muammo, kim uchun va yechim.» (2-ekran xulosasi; atama «Jamoa yig'ish» yozuvi uch savoldan keyin to'lgandan so'ng tug'iladi.)
     Tayanch 2 da «uch qismli bitta gap» — darsda «uch qismdan iborat» (karta uch qatori), sababi — TAYANCHGA SAVOL 1.
   - **qism** — g'oyaning uch bo'lagidan biri: **muammo** · **kim uchun** · **yechim** (kartada — qator yorlig'i, shu tartibda, tayanch 1.1 ustunlari bilan bir).
   - **manba** — g'oyaning muammosi qayerdan kelgani: **9-Modul ro'yxati** · **«Keyin» qutisi** · **yangi kuzatuv** (4-ekran). «Manba» so'zi 9-Modulda ham shu ma'noda (yorliq «sinfdoshdan / o'zim ko'rdim»).
   - **yangi kuzatuv** — atrofda kim, qayerda, nimadan qiynalganini o'zingiz ko'rish (9-Modul muammo qolipi «Kim, qayerda, nimadan qiynaldi?» so'zma-so'z).
4. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - **muammo** — odam nimadan qiynalishi; xohish muammo emas (9-Modul `m7-01`: «Bu xohish — odam nimadan qiynalgani ko'rinmaydi»).
   - **yechim** — mahsulot nima qilishi (9-Modul `m7-01`: «YECHIM — ilova nima qilishi»; `m2-02`: «sayt beradigan bitta aniq foyda-ish»).
   - **muammolar ro'yxati** — 9-Modul 1-darsidagi «atrofdan muammolar» (`pm-m7d1-muammolar`); Mentorniki — «Mentor ro'yxati».
   - **MVP · «Keyin» qutisi** — 9-Modul 3-darsdagi uch quti (Qilamiz · Keyin · Qilmaymiz, `pm-m7d3-mvp`); Mentorning «Keyin»i: to'lov · jamoa yig'ish · eslatma.
     GATE_M_JAVOB 2 da «Keyin» ro'yxati — o'quvchi 9-Modulda «quti» ko'rgan, shuning uchun darsda **«Keyin» qutisi** (TAYANCHGA SAVOL 7).
   - **intervyu** — faqat dalil-chipida («9-Modul intervyusi: …»); ballik matnda yo'q (S-020) — arena 5 da «9-Modulda 5 kishidan 2 tasi».
   - **auditoriya-karta** (KIM · MUAMMO · YECHIM, `m1-02`, 9-Modul `m7-01`) — o'quvchi matnida ishlatilmaydi (bir ko'rinishga ikki nom bo'lmasin, T-014); ko'prik faqat O'qituvchi eslatmasida (2-ekran).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«g'oya»** — faqat atama ma'nosida; kundalik «fikr», «idea», «startap g'oyasi» yo'q. **«nom»** — g'oya kartasining yorlig'i («Jamoa yig'ish»), qism emas.
   - **«yozuv»** — kartaga yoki ro'yxatga yozilgan bitta qator (9-Modul 1-darsdagidek: «Mentor yozuvi», «manbadan kelgan yozuv»); intervyu yozuvi bu darsda yo'q.
   - **«qator»** — kartadagi joy (Muammo qatori …); forma joyi ham «qator». **«maydon» — faqat futbol maydoni** (9-Modul qoidasi). **«jamoa» — faqat futbol jamoasi** (Qaror-0 3).
   - **«qahva»** — dars bo'yi bitta so'z (bank: «qahva nuqtasi»); «kofe» yozilmaydi.
   - **«baholash» / «tanlash»** — bugun g'oyalar baholanmaydi, tanlanmaydi; «tanlang» faqat manba, tugma, variant uchun. «saralash», «RICE» — o'quvchi matnida yo'q (2-dars).
   - **Ishlatilmaydi:** idea · startap g'oyasi · fikr (g'oya ma'nosida) · brainstorm · ficha · prioritet · baho qo'yish · «Maydon Jamoa» (mahsulot nomi — final g'oya 4-darsda tanlanadi).
6. **Raqamlar (faqat tayanchdan, «Mentor misolida»):** 9-Modul intervyusi — 5 kishidan 2 tasi «jamoaga odam yetmadi» (tayanch 1); 5 kishidan 1 tasi «pulni bo'lishish qiyin» (9-Modul tayanchi 1, TAYANCHGA SAVOL 12);
   e'lon namunasi «8 / 10» → «9 / 10» (tayanch 1, F1). Boshqa son yo'q. Starbucks — raqamsiz.
7. **Misol-ip — Mentorning 6 g'oyasi (tayanch 1.1 aynan):** «jamoa yig'ish» — oltitaning biri, xolos; bugun hech biri tanlanmaydi. Tayanch 1.1 dagi «+» (1-g'oya yechimi) o'quvchi matnida «va» (T-035, TAYANCHGA SAVOL 5).
   Mahsulot nomi «Maydon Jamoa» bu darsda aytilmaydi (TAYANCHGA SAVOL 8). Metafora yo'q.
8. **Keys — K18 Starbucks (tayanch 5, bank matni aynan):** «Shuls Starbucks'ni «qahva nuqtasi» emas, uy bilan ish/maktab o'rtasidagi «uchinchi joy» qilib qurgan: o'tirish, ishlash, uchrashish.
   Odamlar ichimlik uchun emas, joy va muhit uchun to'laydi. Raqamsiz.» Ko'prik: g'oyani nom (nima sotilishi) emas — kim uchun va nima uchun ekani tasvirlaydi. Bankdan tashqari fakt yo'q.
9. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** maktab oshxonasi boti (3), bekatdagi avtobus (5), kafe (7).
10. **Toza yuza (185, D-qoidalar):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q.
11. **Kod yozish (tayanch 4, PM_DARS_ETALON 26, PM-082):** kod oynasi (`HtmlCompiler`, `app.js` + `index.html`): g'oyalar massivi → har g'oya sahifada karta. 10-Modul oxiri (`m8-11`) — Neon SQL; mexanika takrorlanmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 9-Modulda Mentor «Maydon»ni qurdi, 10-Modulda o'lchadi va prodga chiqardi; yillik yo'l darsida keyingi qadamni «jamoa yig'ish» deb yozdi.
  11-Modulda final mahsulot noldan tanlanadi — xuddi o'quvchi kabi. 1-dars: oltita g'oya.
- **Dars ipi:** 0 — g'oyani qayerdan qidirasiz (uch manba; Mentorning yopiq 6 kartasi) → 2 — Mentorning ikki so'zli yozuvi «Jamoa yig'ish» uch savoldan keyin g'oya bo'ladi (atama) →
  3 — test: nima yetishmaydi → 4 — Mentor qolgan g'oyalarini uch manbadan to'ldiradi, ro'yxat 6 / 6 → 5 — test: yechim muammoga mosmi → 6 — Starbucks: nom emas, odamlar u yerda nima qiladi →
  7 — test → 8 — o'quvchi o'z manbalaridan oltita g'oya yozadi → 9 — juftlikda faqat yechim o'qiladi: bitta yechim bir nechta muammoga mos kelishi tajribada ko'rinadi →
  10 — kod: g'oyalar massivi sahifada karta bo'ladi → 11 — MVP davomi ham g'oya → podium → kartochkalar → yakun; uyda — oltitaga yetmagani to'ldiriladi, bitta g'oya faqat yechim bilan uydagilarga o'qiladi, tanishlar qog'ozga yoziladi.
- **Bitta vizual — g'oya kartasi (`GoyaKarta`, dars bo'yi, 163/180; bitta manba `MENTOR_GOYALAR` + o'quvchi g'oyalari):**
  - Oq karta: tepada **nom** (bo'lsa) va **manba chipi** (kulrang fon, matn bilan farqlanadi: «9-Modul ro'yxati» · «Keyin» qutisi · «Yangi kuzatuv»); ichida uch qator, shu tartibda:
    **Muammo** · **Kim uchun** · **Yechim**. Yorliq «g'oya» — atama tug'ilgandan keyin (2-ekran oxiri).
  - Qator holatlari: bo'sh (kulrang uzuq chiziq — U-041, keyin to'ldiriladigan joy) → joriy (accent chegara, ichida savol-tugma yoki tanlovlar) → yozildi (matn sirg'alib kiradi, ~1 s yashil yonadi) →
    xato (`err` fon, bir lahza) → yopiq (9-ekran: kulrang parda «yopiq», «Ochish» bilan ko'tariladi).
  - Ko'rinishlar (bitta komponentdan): **to'liq** (3 qator) · **ixcham qator** (ro'yxatda: nom yoki yechim qisqa «…» · manba chipi · ✎ yoki ›) · **yopiq qatorli** (9-ekran).
  - **Ro'yxat** — ixcham qatorlar + hisoblagich «n / 6» (bo'sh uzuq qatorlar yo'q, SABOQ 9/17): «Mentorning g'oyalari» (0, 2, 4, 11) · «G'oyalarim» (8, 9, 14, artefakt-strip).
    6 qator — ikki ustun × 3 (SABOQ 27); matn ≥ 12 px.
  - Ishlatiladi: 0 (yopiq kartalar to'plami) · 1 (skelet) · 2 · 3 va 5 (javobdan keyin, kichik) · 4 · 8 · 9 · 11 (javobdan keyin) · 14 (artefakt-strip). `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi.
- **Mentorning 6 g'oyasi (`MENTOR_GOYALAR`, tayanch 1.1 aynan; manba ustuni — TAYANCHGA SAVOL 2):**

| № | Nom | Muammo | Kim uchun | Yechim | Manba |
|---|---|---|---|---|---|
| 1 | Jamoa yig'ish | o'yinga odam yetmaydi, kim kelishi noma'lum | mahalladagi o'yinchilar | o'yin e'loni va «Qo'shilaman» | «Keyin» qutisi |
| 2 | Maydon pulini bo'lishish | kim qancha to'lagani unutiladi | maydonni birga band qiladigan o'yinchilar | kim to'lagani ro'yxati | «Keyin» qutisi + 9-Modul intervyusi (1 / 5) |
| 3 | Mahalla to'garaklari | qaysi to'garak qayerda va qachon — bilinmaydi | to'garak izlayotgan o'smirlar | to'garaklar xaritasi va jadvali | yangi kuzatuv |
| 4 | Sinf uy vazifalari | uy vazifasi chatlarda yo'qoladi | sinfdoshlar | har fan bo'yicha vazifalar bir joyda | yangi kuzatuv |
| 5 | Eski darsliklar | eski darsligini kimga berishni bilmaydi, u uyda yillab turadi | o'quvchilar | ishlatilgan darsliklar e'loni | 9-Modul ro'yxati |
| 6 | Yo'qolgan buyumlar | maktabda yo'qolgan narsa topilmaydi | maktab o'quvchilari | topilgan buyumlar e'loni | yangi kuzatuv |

- **Brend o'z maketida (PM-028/029, S-018, SABOQ 2–3):** «Starbucks» — nomi o'z yashil rangida, kafe sahnasida (peshtaxta, stollar, divan); logotip chizilmaydi, emoji yo'q, son yo'q.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, juda yengil to'lqin (≤3%, ≥2 s — SABOQ 32, F-1006-270: «tebranish oshib ketibdi»); tanlov guruhida bitta halqa (har variantda emas — SABOQ 32).
  Yoqilgan pastki tugma («Davom etish», «Keyingi bosqich») ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Bashorat (SABOQ 11):** tanlangach karta yo'qolmaydi — savol va «Taxminingiz: N» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi (SABOQ 25).
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa joyidan joyiga uchadi (yozuv manbadan kartaga, karta ro'yxatga) · yangi qator sirg'alib kirib ~1 s yashil yonadi · son sanab o'sadi.
  Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Oltita g'oyani qayerdan topasiz?** (31) — dars nomi (DE-205)
- Mentor: Bu modulda bitiruvgacha quriladigan mahsulot tanlanadi: o'zingizga yaqin javobni belgilang.
- Maket (chap; bitta chizma, uch tanish obyekt — har biri bitta variantga mos):
  - 9-Modul muammolar ro'yxati — ixcham qator «Muammolar ro'yxati · 6 / 6 ✓» (9-Modul 1-dars ko'rinishi);
  - MVP doskasi — uch quti «Qilamiz · Keyin · Qilmaymiz», «Keyin» qutisida uchta kulrang chip (matnsiz);
  - mahalla ko'chasi chizmasi — maktab, bekat, maydon (chizilgan, odam siluetlari).
  «Mentorning g'oyalari» qutisi ekranga kirganda yo'q — tanlovdan keyin chiqadi (SABOQ 4).
- Variantlar (radio, o'ng; bir uzunlikda):
  - 9-Modulda yig'gan muammolarimdan (32)
  - MVP'imning «Keyin» qutisidan (28)
  - Atrofda yangi narsa kuzatib (27)
- Javob (uchalasida bir xil, maqtovsiz): Uchalasi ham g'oya manbai bo'ladi. Mentor oltita g'oyasini shu uch joydan yig'di. (80)
- **Harakat → Vizual o'zgarish:** variantni tanlash → mos obyekt accent halqa bilan ko'tariladi; keyin uchala obyektdan kichik yopiq kartalar navbat bilan (100 ms) uchib, «Mentorning g'oyalari» qutisiga tushadi,
  son 0 → 6 sanab o'sadi. Kartalar yopiq — mazmuni 2 va 4-ekranlarda ochiladi (P-036). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: 9-Modul ro'yxati yoki MVP doskasi saqlanmagan o'quvchi ham tanlaydi — savol odat haqida. Javobni muhokama qilmang: 4-ekran manbalarni o'zi ochadi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun oltita g'oyani yozib chiqasiz.** (35)
- Mentor: O'tgan modulda «Maydon» o'lchandi va prodga chiqdi. Yangi mahsulot esa g'oyadan boshlanadi.
- Chap — «Dars oxirida: muammo, kim uchun va yechim — 6 yozma g'oya» (App.jsx osti, P-015) + vizual: oltita ixcham qator — Mentorning g'oya nomlari (1.1: Jamoa yig'ish · Maydon pulini bo'lishish · …) 0.4 s oraliqda yashil ✓ oladi;
  oxirida bittasi kattalashib uch qatorli karta-skeletga aylanadi (qator yorliqlari yo'q — 2-ekran kashfiyotini ochmaydi). Matnsiz bo'sh chiziqlar — RAD (foydalanuvchi, F-1006-270: «barchasi bo'sh turadimi»).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Ikki so'zli yozuvni to'liq g'oyaga aylantirasiz · `g'oya`
  - 02 · G'oya uchun muammoni qayerdan topishni bilib olasiz · `manba`
  - 03 · Starbucks qanday joy bo'lib qurilganini ko'rasiz · `voqea`
  - 04 · Oltita g'oya yozib, bittasini sherigingizga o'qiysiz · `juftlik`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada atama yo'q (T-011); reja ta'rif aytmaydi (P-015) — «uch qism» 2-ekranda tug'iladi.

## 2 · Nomdan g'oyaga  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · g'oya
- Sarlavha: **Ikki so'zli yozuvdan nima qurishni bilasizmi?** (45)
- Mentor: O'tgan modulda «Maydon»ning keyingi qadamini ikki so'z bilan yozgan edim: kartadagi savollarni birma-bir bosing.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Nima qurishni bilish uchun bu yozuvga nechta savol kerak?** · 1 · 2 · 3 —
  tanlangach ixcham qator «Taxminingiz: N» natijagacha turadi; savol-tugmalar shundan keyin yoqiladi.
- Vizual (keng; SABOQ 21 — sahna chapda, karta o'ngda):
  - **chapda — sahna** (telefon o'lchamidagi joy, ≈170×272): boshida «Maydon» ilovasining kartasi (9-Modul MVP, telefon o'lchamida) va uning «Keyin» qutisi; qutidan «jamoa yig'ish» chipi ko'tarilib chiqadi va karta nomiga uchadi.
    Vaqt chizig'i (nuqta va chiziq) — RAD (foydalanuvchi, F-1006-270: «1-holati yoqmadi»).
  - **o'ngda — g'oya kartasi:** tepada nom **Jamoa yig'ish** (kulrang yorliq «Mentor misoli»), ostida uch bo'sh qator; har qatorda savol-tugma: «Qanday muammo?» · «Kim uchun?» · «Qanday yechim?» —
    faqat joriysi yoqilgan (halqada). Qator yorliqlari (Muammo · Kim uchun · Yechim) qator yozilgandan keyin chiqadi.
- **Harakat → Vizual o'zgarish:**
  1. «Qanday muammo?» → qatorga **o'yinga odam yetmaydi, kim kelishi noma'lum** sirg'alib yoziladi; ostida kulrang dalil-chip «9-Modul intervyusi: 5 kishidan 2 tasi «jamoaga odam yetmadi»».
     Sahna almashadi: futbol maydoni chizmasi — bir necha o'yinchi siluetlari, bir necha o'rin uzuq doira (bo'sh), tepada savol pufagi «Kim keladi?» (son yozilmaydi).
  2. «Kim uchun?» → qatorga **mahalladagi o'yinchilar**; sahnada maydon atrofida mahalla uylari chiziladi, siluetlar ustida yorliq «o'yinchilar».
  3. «Qanday yechim?» → qatorga **o'yin e'loni va «Qo'shilaman»**; sahna telefon maketiga aylanadi: e'lon kartasi «Bugun · 18:00 · 8 / 10» va «Qo'shilaman» tugmasi;
     tugma bir marta o'zi bosiladi (namoyish), «8 / 10» silliq «9 / 10» ga o'tadi. Telefon ostida kulrang yorliq «chizma — hali qurilmagan».
  Uch qator to'lgach nom yonida yorliq **g'oya** paydo bo'ladi (atama — misoldan keyin), `QIzoh`: Uch savolga javob yozilgan yozuv — g'oya. «Jamoa yig'ish» esa uning nomi. (73)
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: N · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: G'oya uch qismdan iborat: muammo, kim uchun va yechim. (54)
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Kartadagi yoqilgan savolni bosing — qator nima bo'lishini ko'ring.
- Tugma (pastki): Savollarni bosing (N/3) → Davom etish · `tugadi`: savol-tugmalar yo'qoladi, sahna va karta butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy savol-tugma (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: «Jamoa yig'ish» — 10-Modul yillik yo'l darsidagi keyingi qadam; bugun u Mentorning olti g'oyasidan biri, xolos — hech qaysi g'oya tanlanmaydi.
  9-Modulda auditoriya-kartada YECHIM qatori bo'sh qolgan edi («hali yo'q») — g'oyada uchala qism yoziladi; sinfga shu ko'prikni og'zaki ayting.
  Mahsulot nomini aytmang: bu hali g'oya, mahsulot emas.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · g'oyaning uch qismi
- Savol: **«O'quvchilar uchun oshxona menyusini ko'rsatadigan bot» — nima yetishmaydi?** (9 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — Kim uchun — botni qaysi odamlar ochadi (38)
  - B — Yechim — bot odamlarga nima qilib beradi (40)
  - ✔ C — Muammo — o'quvchilar nimadan qiynaladi (38)
  - D — Nom — botning qisqa va esda qolar nomi (38)
- To'g'ri izohi: Kim va yechim yozilgan, lekin o'quvchilar nimadan qiynalishi yo'q.
- Xato izohlari: A — Kim yozilgan: o'quvchilar. Boshqa qismni qidiring. (50) · B — Yechim yozilgan: bot menyuni ko'rsatadi. (40) ·
  D — Nom g'oyaning qismi emas — uch qismga qarang. (45) · (umumiy) Uch qismni birma-bir qidiring: qaysi biri yo'q? (47)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan keyin; SABOQ 4): savol ostida kichik g'oya kartasi **Oshxona boti** — Kim uchun ✓ «o'quvchilar» · Yechim ✓ «oshxona menyusini ko'rsatadi» ·
  Muammo — accent qator, ichida 9-Modul Mentor ro'yxatidagi yozuv: «Oshxonada bugun nima borligini bilish uchun navbatga turib ko'rishadi.». Yorliq yo'q (foydalanuvchi, F-1006-270: «kerak emas»).
- Izoh (MD): «Nom» varianti — 2-ekran qoidasi (nom qism emas); «Kim uchun» va «Yechim» yozuvda bor — har noto'g'ri variant dars qoidasi bo'yicha noto'g'ri (S-004).

## 4 · Uch manba  ← QTushuncha (ketma-ket, 3 qadam; SABOQ 9/13)
- Eyebrow: Tushuncha · manba
- Sarlavha: **Mentor qolgan g'oyalarini qayerdan topdi?** (41) — 0-ekran savoliga javob (T-064)
- Mentor: Har manbadan bitta yozuv keladi: kartadagi bo'sh qatorni to'ldiring.
- Qadam chiplari (`QQadamlar`, ixcham, bir qatorda; joriysi accent, o'tgani ✓): 1 «Keyin» qutisi · 2 9-Modul ro'yxati · 3 Yangi kuzatuv
- **Chapda — manba sahnasi** (har qadamda almashadi):
  1. MVP doskasi (9-Modul 3-darsdagi uch quti): «Keyin» qutisida uch chip — to'lov · jamoa yig'ish (kulrang, ✓) · eslatma; «to'lov» chipi ko'tariladi, ostida 9-Modul intervyusidagi yozuv chiqadi —
     dalil-chip «9-Modul intervyusi: 5 kishidan 1 tasi «pulni bo'lishish qiyin»»; ikkalasi birga kartaga uchadi (manba — «Keyin» qutisi va intervyu yozuvi, 01-FILTR 5).
  2. Mentor ro'yxati (9-Modul 1-darsdagi ixcham ro'yxat, **olti qator** — foydalanuvchi, F-1006-270; matn qisqa «…»): «Eski darsliklarni kimga berishni bilmay, …» qatori yonadi va kartaga uchadi.
  3. Yangi kuzatuv — chizilgan maktab yo'lagi (jonli, F-1006-270: avvalgi quti-siluet sahna rad): e'lon taxtasi, unda bir nechta qog'oz, eng kattasi «Yo'qoldi: sumka», taxtaga qarab turgan real ko'rinishdagi o'quvchi; ustida Mentor yozuvi «Tanaffusda ko'rdim» (TAYANCHGA SAVOL 3). Qog'oz kartaga uchadi.
- **O'ngda — g'oya kartasi** (manbadan kelgan ikki qator yozilgan, bo'sh qator accent) va uning ostida 3 tanlov (navbat bilan chiqadi; aralash tartib, to'g'ri o'rni har qadamda boshqa):
  1. **Maydon pulini bo'lishish** · manba «Keyin» qutisi · yozilgan: Kim uchun — maydonni birga band qiladigan o'yinchilar · Yechim — kim to'lagani ro'yxati · bo'sh: **Muammo**
     - ilovada to'lov bo'lishini xohlaydi (34)
     - ✔ kim qancha to'lagani unutiladi (30)
     - ilovada to'lov tugmasi hali yo'q (32)
     - dalil-chip kartada manba chipi ostida turadi (sahnadan birga kelgan) — tanlovdan oldin ko'rinadi
  2. **Eski darsliklar** · manba 9-Modul ro'yxati · yozilgan: Muammo — eski darsligini kimga berishni bilmaydi, u uyda yillab turadi · Kim uchun — o'quvchilar · bo'sh: **Yechim**
     - darslikni qiziq qiladigan o'yin (31)
     - yangi darsliklar sotiladigan sayt (33)
     - ✔ ishlatilgan darsliklar e'loni (29)
  3. **Yo'qolgan buyumlar** · manba yangi kuzatuv · yozilgan: Muammo — maktabda yo'qolgan narsa topilmaydi · Yechim — topilgan buyumlar e'loni · bo'sh: **Kim uchun**
     - ✔ maktab o'quvchilari (19)
     - hamma yoshdagi odamlar (22)
     - telefoni bor har kim (20)
  Tuzoqlar har qadamda bitta xato-sinf (S-040): 1 — qiynalish yo'q (xohish · yechimning yo'qligi) · 2 — boshqa muammoga javob · 3 — «hamma» (aniq emas).
- `QXato` (≤60): 1 — Bu gapda odam nimadan qiynalgani ko'rinmaydi. (45) · 2 — Bu yechim boshqa muammoga javob beradi. (39) · 3 — Kim uchun aniqroq bo'lsin: qanday odamlar? (42)
- Yordam (birinchi xatodan keyin, P-033; qadamga qarab bitta qator): Muammo — odam nimadan qiynalishi; xohish muammo emas. · Yechim muammo qatoridagi qiyinchilikni yengillashtirsin. ·
  «Hamma» aniq emas: muammo aynan qanday odamlarda?
- **Harakat → Vizual o'zgarish:** 1-manba ekranga kirganda, keyingilari oldingi qadam ✓ bo'lgach ≈1 s da **o'zi ochiladi** (bosish kerak emas — F-1006-270: 2-qadamda o'tib bo'lmadi) → chapda manba sahnasi kiradi, yozuv kartaga uchib, ikki qator yoziladi; bo'sh qator accent, ostida 3 tanlov.
  To'g'ri tanlov → qator yoziladi (~1 s yashil), qadam ✓; karta kichrayib o'ngdagi ro'yxatga uchadi: «Mentorning g'oyalari · n / 6» (2-ekrandagi «Jamoa yig'ish» birinchi qatorda).
  Xato → tanlov silkinadi, qator bir lahza `err` fon, bitta `QXato`.
  Manbadan olingan yozuv (chapda) va kartadagi u to'ldirgan qator bir xil belgi bilan ajraladi, uchish chizig'i ko'rinadi — chap «qayerdan», o'ng «nima yetishmaydi» (F-1006-270).
  3/3 dan keyin qolgan ikkita g'oya (3, 4) navbat bilan ro'yxatga uchib kiradi, hisoblagich sanab 6 / 6 ga yetadi.
- Natija (`tugadi`): qadam chiplari, sahna va tanlovlar yo'qoladi; ro'yxat butun enga — ikki ustun × 3 (nom · manba chipi · ›); qatorni bosish → uning uch qismi ochiladi (U-013, toggle).
  `QIzoh`: «Maydon»ni davom ettiradigan ikki g'oya ham ro'yxatda boshqalar bilan teng turibdi. (83)
- Xulosa: Bu misolda har manbadan kelgan yozuvga bitta qism yetishmadi — uni siz qo'shdingiz. (83)
- Tugma (pastki): Bo'sh qatorni to'ldiring (N/3) → Davom etish (manbalar o'zi ochiladi — F-1006-270)
- Keyingi bosiladigan joy: joriy qadam chipi → uch tanlov (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Source Finder! (uch qadamda birinchi urinishda).
- O'qituvchi eslatmasi: «Keyin» qutisi — 9-Modul 3-darsdagi MVP doskasi. «To'lov» va «jamoa yig'ish» Mentorning «Maydon»ini davom ettiradi — ular ham boshqa g'oyalar bilan bitta ro'yxatda.
  Sinfdan so'rang: «Sizning «Keyin» qutingizda nima qolgan edi?»

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · yechim va muammo
- Savol: **Bekatda avtobus qachon kelishi bilinmaydi. Qaysi yechim mos?** (8 so'z) · savol ustida yorliq yo'q
  - ✔ A — Avtobus necha daqiqada kelishini ko'rsatadi (43)
  - B — Bekatda kutganlarga qiziqarli video ko'rsatadi (46)
  - C — Avtobusdagi bo'sh o'rindiqlar sonini ko'rsatadi (47)
  - D — Yo'l haqini telefondan to'lashga yordam beradi (46)
- To'g'ri izohi: Bu yechim aynan shu muammoga javob beradi: kutgan odam vaqtni biladi.
- Xato izohlari: B — Video kutishni qiziq qiladi, vaqt esa baribir noma'lum. (55) · C — Bo'sh o'rin — boshqa muammo, vaqt baribir noma'lum. (51) ·
  D — To'lov — boshqa muammo, avtobus vaqti noma'lum. (47) · (umumiy) Muammo qatorini qayta o'qing: yechim shunga javob bersin. (57)
- Javob topilgach (kichik karta, savol ostida): **Avtobus vaqti** — Muammo «avtobus qachon kelishi bilinmaydi» · Kim uchun «bekatda kutadigan o'quvchilar» · Yechim — to'g'ri variant matni; muammo va yechim orasida yashil chiziq.
- Izoh (MD): distraktorlar rost, lekin boshqa muammoga javob beradi (S-004) — 4-ekran 2-qadam qoidasi; «ko'rsatadi» uch variantda bor (kalit so'z faqat to'g'rida emas).

## 6 · Starbucks  ← QVoqea (PM keys K18; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Starbucks qanday joy bo'lib qurilgan?** (37)
- Nuqtalar (3) · yorliq **Starbucks · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Starbucks** (o'z yashil rangida) — qahva va boshqa ichimliklar sotadigan kafelar. Logotip yo'q.
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; SABOQ 8). Sahnada faqat bosqich nomi va jonli maket; slayd ichida takror matn yo'q.
- Sahna (`StarbucksSahna`, chizilgan CSS/SVG; bosqichga qarab o'zgaradi; MD va bankda yo'q narsa chizilmaydi — asoschi surati, yil, son yo'q):
  - 1/3 **Qahva nuqtasi** — Mentor: Qahva nuqtasi — qahva olib, chiqib ketadigan joy. Shuls Starbucks'ni qanday qurganini bosqichma-bosqich ko'ring.
    · sahna: tor peshtaxta, stakan, odam siluet kiradi → stakanni oladi → chiqib ketadi (halqa bo'lib takrorlanadi 2 marta); stol-stul yo'q. Yorliq «qahva nuqtasi».
    · bashorat (sahna ostida, bitta qator; S-015 — tor → keng): **Odamlar Starbucks'da nima uchun pul to'laydi?** · Ichimlik uchun · Ichimlik va tezlik uchun · ✔ Joy va muhit uchun
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **Uchinchi joy** — Mentor: Birinchi joy — uy, ikkinchisi — ish yoki maktab. Shuls Starbucks'ni ularning o'rtasidagi «uchinchi joy» qilib qurgan.
    · sahna: gorizontal yo'l — chapda uy, o'ngda maktab va ish binosi; o'rtada kafe (ustida nom «Starbucks» yashil) yonadi, yo'ldagi odam siluet shu yerda to'xtaydi.
  - 3/3 **O'tirish, ishlash, uchrashish** — Mentor: U yerda odamlar o'tiradi, ishlaydi va uchrashadi. Ular ichimlik uchun emas, joy va muhit uchun to'laydi.
    · sahna: kafe ichi — divan (o'tirgan siluet), stol va noutbuk (ishlayotgan siluet), ikki siluet suhbatda; har biri navbat bilan kiradi; stakan kichik, chetda.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: joy va muhit uchun» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan keyin, pastda, yashil): Shuls Starbucks'ni ichimlik uchun emas, o'tirish, ishlash va uchrashish uchun joy qilib qurgan. (96)
- Tugma (pastki): Keyingi bosqich (N/3) → Davom etish
- O'qituvchi eslatmasi: Starbucks 4-Modulning «Bitta natija, uch xil sabab» darsida ham «uchinchi joy» bo'lib chiqqan — eslating; bugungi savol boshqa: kafeni nima tasvirlaydi.
  Sinfdan so'rang: «Qahva nuqtasi» va «uchinchi joy» — ikkalasida ham qahva bor; farq nimada? Bankdan tashqari raqam, yil va voqea qo'shmang.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K18 (bank: raqamsiz) · tayanch 5 (o'zbekcha matn). «Qahva nuqtasi — qahva olib, chiqib ketadigan joy» — bankdagi qarama-qarshi atamaning izohi (bizniki).

## 7 · 3-savol  ← QTest (✔ D, `correctIdx 3`; Starbucks qoidasi — kafe olamida)
- Eyebrow: Tekshiruv · Starbucks'dagidek
- Savol: **Qaysi gap kafeni Starbucks'dagidek tasvirlaydi?** (5 so'z) · savol ustida yorliq yo'q
  - A — Shaharda eng mazali qahva sotiladigan joy (41)
  - B — Qahvani tez olib, chiqib ketiladigan nuqta (42)
  - C — Ichimliklari eng arzon bo'lgan kichik kafe (42)
  - ✔ D — Uy va maktab o'rtasida uchrashadigan joy (40)
- To'g'ri izohi: Starbucks'da odamlar ichimlik uchun emas, joy va muhit uchun to'laydi.
- Xato izohlari: A — Mazali qahva — ichimlik haqida, joy haqida emas. (48) · B — Bu — qahva nuqtasi: olib, chiqib ketiladi. (42) ·
  C — Narx — ichimlik haqida; odamlar joy uchun keladi. (49) · (umumiy) Starbucks'da odamlar nima qiladi — shuni eslang. (48)
- Izoh (MD): «joy» A da ham bor (kalit so'z faqat to'g'rida emas); distraktorlar — ichimlik yoki tezlik haqida, bank faktiga zid emas (S-004).

## 8 · Oltita g'oya  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Oltita g'oyani bittalab yozing.** (30)
- Mentor: Avval manbani tanlang, keyin uch qatorni yozing: bugun g'oyalar baholanmaydi.
- **Tepada — ixcham ro'yxat «G'oyalarim · n / 6»:** yozilganlar bittadan qator (yechim qisqa «…» · manba chipi · ✎); bo'sh uzuq qatorlar yo'q. Ro'yxat bo'sh bo'lsa — faqat sarlavha va «0 / 6».
- **Markazda — bitta katta g'oya kartasi (joriy):**
  1. Manba chiplari (birinchi harakat, halqada): «9-Modul ro'yxati» · «Keyin» qutisi · «Yangi kuzatuv»
     - «9-Modul ro'yxati»: `pm-m7d1-muammolar` bo'lsa — karta ustida o'quvchining muammolari ixcham ro'yxat bo'lib ochiladi (ishlatilgani kulrang ✓); bittasini bosish → matn Muammo qatoriga yoziladi (tahrirlasa bo'ladi).
       Yo'q bo'lsa — kulrang qator: Ro'yxat topilmadi — muammoni o'zingiz yozing.
     - «Keyin» qutisi: `pm-m7d3-mvp` (`keyin`) bo'lsa — o'quvchining «Keyin» chiplari; bosilgani Yechim qatoriga yoziladi. Yo'q bo'lsa — kulrang qator: Qutingiz topilmadi — funksiyani o'zingiz yozing.
     - «Yangi kuzatuv»: uch qator bo'sh; Muammo qatori ustida kulrang yo'riq: Kim, qayerda, nimadan qiynaldi?
  2. Uch qator (placeholder qisqa, tayyor javobsiz — §32): Muammo — «Odamlar nimadan qiynaladi?» · Kim uchun — «Aynan qanday odamlar?» · Yechim — «Mahsulot nima qiladi?»
  3. «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob qator ostida; yumshoq — ikkinchi «Saqlash» bilan o'tadi, «bo'sh» dan tashqari):
  - qator bo'sh (bloklaydi): Uch qatorni ham yozing. (23)
  - Muammoda xohish («xohlaydi», «xohlardi», «yoqadi», «yaxshi ko'radi», «bo'lsa yaxshi»): Bu xohish — odam nimadan qiynalgani ko'rinmaydi. (48)
  - Kim uchun qatori butunicha «hamma», «odamlar», «hamma odamlar», «barcha odamlar», «har kim» yoki «hamma uchun» bo'lsa: Kim uchun aniqroq bo'lsin: qanday odamlar? (42)
  - Yechim ≤ 2 so'z va unda «ilova», «sayt», «bot» yoki «AI» bor (masalan «futbol ilovasi»): Mahsulot aynan nima qiladi? Bir gap bilan yozing. (49)
  - takror (oldingi g'oya bilan muammo va yechim bir xil): Bu g'oya ro'yxatda bor — boshqasini yozing. (43)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam: Manbalarni birma-bir oching: 9-Modul ro'yxatidagi muammoga yechim yozing, «Keyin» qutisidagi funksiyaga muammo toping, keyin bugun yo'lda ko'rganingizni eslang.
  O'z MVP'ingizni davom ettirish ham g'oya — u boshqalar qatorida turadi.
- **Harakat → Vizual o'zgarish:** manba chipi → karta tepasida manba yorlig'i; ro'yxatdan tanlansa qator sirg'alib yoziladi. «Saqlash» → karta kichrayib tepadagi ro'yxatga uchadi (yangi qator ~1 s yashil),
  hisoblagich n / 6 sanab o'sadi, pastdan keyingi bo'sh karta kiradi. Tekshiruvdan o'tmagan qator `err` fon, ostida bitta `QXato`.
  6/6 da karta yopiladi; ro'yxat butun enga — ikki ustun × 3, har qatorda ✎ (bosilsa o'sha g'oya katta karta bo'lib ochiladi, qolganlari ixcham qoladi — SABOQ 29).
- Xulosa (o'quvchi sonidan, P-046; 0 bo'lgan bo'lak tushib qoladi): G'oyalaringiz tayyor: {a} tasi 9-Modul ro'yxatidan, {b} tasi «Keyin» qutisidan, {c} tasi yangi kuzatuvdan. (≈100; namuna 3/2/5 — 100)
- Tugma (pastki): Yana N ta g'oya yozing → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: manba chiplari → bo'sh qator (accent, to'lqin) → «Saqlash» (qator yozilgach halqada).
- Artefakt-strip (U-042): shu ekrandan — «G'oyalarim · n/6» (ixcham); 9, 10, 14-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Nishon: Six Ideas! (6/6).
- Mentor rejimi: forma o'rniga Mentorning 6 g'oyasi (4-ekran ro'yxati, ochiq); o'quvchilar o'z ekranida yozadi. Mentor statistikasi: «Oltita g'oyani yozganlar» · «Yangi kuzatuvdan yozilganlar».
- O'qituvchi eslatmasi: Taymer yo'q — 20 daqiqadan keyin juftlikka o'ting; oltitaga yetmagan o'quvchi uyda to'ldiradi. Eng ko'p xato — yechim o'rniga nom yozish («futbol ilovasi»): «Ilova aynan nima qiladi?» deb so'rang.
  G'oyani «yomon» demang — bugun faqat yoziladi.

## 9 · Faqat yechim  ← QMustaqil (juftlik, 3 qadam; P-057 solishtirish sahnasi)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Yechimni eshitgan sherigingiz muammoni topadimi?** (48) · yakka rejimda: **Yechimdan Mentorning muammosini topa olasizmi?** (46)
- Mentor: Bitta g'oyangizni tanlang va sherigingizga faqat yechim qatorini o'qing.
  Yakka rejimda: Mentor g'oyasining faqat yechimi ochiq: muammoni o'zingiz topib yozing.
- Qadam chiplari: 1 G'oyani tanlang · 2 Yechimni o'qing · 3 Solishtiring (yakka: 1 Yechimni o'qing · 2 Muammoni yozing · 3 Solishtiring)
- 1-qadam: «G'oyalarim» ro'yxati (8-ekrandan, ixcham, halqada) → bitta qator bosiladi → katta g'oya kartasi: Yechim ochiq; Muammo va Kim uchun qatorlari kulrang parda «yopiq».
- 2-qadam: «1 daqiqani boshlash» (taymer; ▶ belgisiz) · qator «Sherigingiz aytgan muammo» (placeholder «U nima dedi?») · «Saqlash».
- 3-qadam: «Ochish» → pardalar ko'tariladi; solishtirish: chapda pufak «Sherigingiz: …», o'ngda karta Muammo qatori; ostida ikki tugma: «Bir xil» · «Boshqacha» (belgisiz — hech biri xato emas, 01-FILTR 2).
- **Harakat → Vizual o'zgarish:** qator bosish → karta kattalashib chiqadi, ikki qator parda ostida · taymer → sanoq · «Ochish» → parda yuqoriga sirg'aladi ·
  «Bir xil» → pufak va Muammo qatori orasida yashil chiziq · «Boshqacha» → sherik aytgan muammo pufakdan kartaga ikkinchi muammo qatori bo'lib tushadi (kulrang, yorliq «Sherigingiz aytgani»),
  ikkala muammo qatoridan Yechim qatoriga ikki ingichka accent chiziq — bitta yechim, ikki muammo. Qizil rang va tahrir tugmasi yo'q: sherikning javobi kuzatuv, xato emas (01-FILTR 2).
- Xulosa (tanlovdan, P-046):
  - «Bir xil»: Sherigingiz muammoni topdi. Baribir uni g'oyada alohida yozasiz — boshqalar topmasligi mumkin. (94)
  - «Boshqacha»: Bitta yechim bir nechta muammoga mos kelishi mumkin — shuning uchun g'oyada muammo alohida yoziladi. (100)
- Yakka rejim (sherik yo'q yoki 8-ekran bo'sh): Mentorning 3-g'oyasi **Mahalla to'garaklari** — Yechim «to'garaklar xaritasi va jadvali» ochiq; o'quvchi muammoni yozadi;
  ochilganda — Muammo «qaysi to'garak qayerda va qachon — bilinmaydi», Kim uchun «to'garak izlayotgan o'smirlar». Xulosa: «Bir xil» — Muammoni topdingiz. Baribir g'oyada u alohida yoziladi — boshqalar topmasligi mumkin. (85) · «Boshqacha» — yuqoridagi 100 belgilik matn.
  Yakka rejimda pufak yorlig'isiz («Sherigingiz:» yo'q), kartadagi ikkinchi qator yorlig'i — **«Siz yozgan»**. «Boshqacha» dan keyin pufak kartaga tushgach chap ustun yig'iladi — karta o'rtada yolg'iz qoladi (pilot ko'rigi 06.10).
- Tugma (pastki): Solishtiring → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: ro'yxat qatorlari → «1 daqiqani boshlash» → yozish qatori → «Ochish» → «Bir xil» / «Boshqacha».
- Nishon: Pair Check! (solishtirish bajarilganda).
- Mentor statistikasi: «Bir xil» · «Boshqacha» (sinf bo'yicha son).
- O'qituvchi eslatmasi: 1 daqiqadan keyin «O'rin almashing» deng — sherik o'z ekranida shu ishni qiladi. «Boshqacha» chiqqani g'oya yomon degani emas: bitta yechim ikki muammoga mos kelishi mumkin — shuning uchun muammo kartada alohida yoziladi. G'oyani shu yerda tuzatish shart emas.
  2–3 juftlikdan so'rang: sherik qaysi muammoni aytdi — ikkalasi ham shu yechimga mos keladimi?

## 10 · Kod yozish  ← QKod (kod oynasi; tayanch 4; PM-082)
- Eyebrow: Kod yozish
- Sarlavha: **Yozuvlarni kartaga aylantiradigan kod yozamiz.** (46) — PM-082(a) sarlavha oilasi (korpus §19, §48); «yozuv» — uchinchisi yechimsiz, hali g'oya emas
- Mentor: Mentorning uchta yozuvi kodda massiv bo'lib turibdi: har birini sahifada karta qilib chiqaring.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **Kartaning uch qatori qaysi kalitlardan olinadi?** — uch tanlov (har biri uchta kalit):
  «`nom`, `muammo`, `yechim`» · ✔ «`muammo`, `kim`, `yechim`» · «`manba`, `kim`, `yechim`»
  - xato (`nom` bor): `nom` — yorliq, g'oyaning qismi emas. (37) · xato (`manba` bor): `manba` muammo qayerdan kelganini aytadi, u qism emas. (54)
- Chap (vazifa, 3 band; bosiladigan katakcha emas): 1 `qatorlar` uch qatorli ro'yxat qaytaradi · 2 Yechimi bo'sh yozuvda «Yechim: hali yo'q» chiqadi · 3 Sahifada uchta karta, har birida uch qator
- Yordam: Bitta yozuvdan boshlang: `return ["Muammo: " + goya.muammo, …];`. Yechim bo'sh bo'lsa (`goya.yechim === ""`), uning o'rniga «hali yo'q» qo'ying.
  Eslatma (JavaScript darslaridan): massiv — ro'yxat · `+` — ikki matnni qo'shadi · `forEach` — ro'yxatdagi har element uchun bir marta ishlaydi.
- O'ng: kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d, `user-select: none`) va platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`).
  Mentor gapi (o'ng, tugma ustida): Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz. «Kompilyator» ta'riflanmaydi — «kod oynasi».
- Kod (`app.js`):
```js
// Mentorning uchta yozuvi: muammo, kim uchun va yechim
const goyalar = [
  { muammo: "o'yinga odam yetmaydi, kim kelishi noma'lum", kim: "mahalladagi o'yinchilar", yechim: "o'yin e'loni va «Qo'shilaman»" },
  { muammo: "uy vazifasi chatlarda yo'qoladi", kim: "sinfdoshlar", yechim: "har fan bo'yicha vazifalar bir joyda" },
  { muammo: "eski darsligini kimga berishni bilmaydi, u uyda yillab turadi", kim: "o'quvchilar", yechim: "" }   // yechim hali yozilmagan
];

function qatorlar(goya) {
  // uch qatorni ro'yxat qilib qaytaring: "Muammo: …", "Kim uchun: …", "Yechim: …"
  return [];   // shu joyni siz yozasiz
}

// har yozuv — sahifada bitta karta (bu qism tayyor)
const joy = document.getElementById("goyalar");
goyalar.forEach(function (goya) {
  const karta = document.createElement("div");
  karta.className = "goya";
  qatorlar(goya).forEach(function (matn) {
    const p = document.createElement("p");
    p.textContent = matn;
    karta.appendChild(p);
  });
  joy.appendChild(karta);
});
```
- `index.html` (tayyor, o'zgarmaydi): `<h1>Mentorning yozuvlari</h1>` · `<div id="goyalar"></div>` — `app.js` ni kod oynasi o'zi ulaydi (10-Modul 2-dars naqshi: `app.js` + `index.html`).
  `previewCss`: `.goya` — oq karta, ingichka chegara, 8 px radius, kartalar orasida bo'shliq; `.goya p` — qator, birinchisi qalin emas (uch qator teng).
- Kutilgan natija: 1-karta — «Muammo: o'yinga odam yetmaydi, kim kelishi noma'lum» · «Kim uchun: mahalladagi o'yinchilar» · «Yechim: o'yin e'loni va «Qo'shilaman»»; 3-karta oxirgi qatori — «Yechim: hali yo'q».
- Kod oynasi sarlavhasi: `app.js — qatorlar funksiyasini yakunlang` · placeholder: `// uch qatorni ro'yxat qilib qaytaring`
- Shart xabarlari (≤60): 1 — Uch qator: «Muammo: …», «Kim uchun: …», «Yechim: …». (52) · 2 — Yechim bo'sh bo'lsa, «Yechim: hali yo'q» chiqsin. (49) ·
  3 — Sahifada uchta karta, har birida uch qator bo'lsin. (51)
- **Harakat → Vizual o'zgarish:** darvozada to'g'ri uchlik → kod namunasida `muammo`, `kim`, `yechim` kalitlari bir lahza ajraladi (karta qatorlari rangida);
  kod oynasida kod ishga tushganda natija oynasida uchta karta chiqadi, uchinchisining oxirgi qatori kulrang «Yechim: hali yo'q»; shartlar birma-bir ✓. Kod oynasidagi «Davom etish» faqat uch shart ✓ bo'lganda ochiladi.
- Hammasi bajarilgach (yashil): Uch yozuv sahifada karta bo'ldi — yechimi yozilmagani ham ko'rinib turibdi. (75)
- O'qituvchi eslatmasi: Kod — 2–3 daqiqalik mashq, yangi qoida yo'q: g'oyaning uch qismi va «yechim hali yo'q» holati. O'z g'oyasini to'rtinchi element qilib qo'shgan o'quvchini maqtang — shart emas.
- Saqlash: kod oynasi qoralamasi `pm-m9d1-code` (tayanch 8).

## 11 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`; MVP davomi ham g'oya — Qaror-0 2)
- Eyebrow: Yakuniy tekshiruv
- Savol: **O'z MVP'ingizni davom ettirmoqchisiz. Bu g'oya ro'yxatda qanday turadi?** (9 so'z) · savol ustida yorliq yo'q
  - A — Ro'yxatdan tashqarida — u allaqachon tanlangan (46)
  - ✔ B — Boshqalar qatorida — uch qismi bilan yozilib (44)
  - C — Ro'yxat boshida — u eng yaxshi g'oya bo'ladi (44)
  - D — Faqat nomi bilan — uni hamma allaqachon biladi (46)
- To'g'ri izohi: MVP davomi ham g'oya: u uch qism bilan yoziladi va boshqalar qatorida turadi.
- Xato izohlari: A — Bugun hech bir g'oya tanlanmaydi — faqat yoziladi. (50) · C — Bugun g'oyalar baholanmaydi — hammasi teng turadi. (50) ·
  D — Nom g'oya emas — uning uch qismi yoziladi. (42) · (umumiy) Mentor «Maydon» davomini qayerga yozganini eslang. (50)
- Javob topilgach (kichik, savol ostida): 4-ekrandagi «Mentorning g'oyalari» ro'yxati — «Jamoa yig'ish» va «Maydon pulini bo'lishish» qatorlari accent, boshqalar bilan bir qatorda.
- Izoh (MD): tire to'rt variantda (belgi faqat to'g'rida emas); «MVP» — 9-Modul 3-darsdan, savolda o'quvchining o'z MVP'i.

## 12 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Nima yetishmaydi · 2 — Mos yechim · 3 — Starbucks · 4 — MVP davomi

## 13 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| G'oya qaysi uch qismdan iborat? | Muammo, kim uchun va yechim |
| Muammo qatoriga nima yoziladi? | Odamlar nimadan qiynalishi; xohish muammo emas |
| «Kim uchun» qatori qanday yoziladi? | Aynan qanday odamlar ekani; «hamma» aniq emas |
| Yechim qatori nimaga javob beradi? | Shu g'oyaning muammosiga: mahsulot nima qilishini aytadi |
| G'oya uchun muammoni qayerdan topasiz? | 9-Modul ro'yxatidan, MVP'ning «Keyin» qutisidan va yangi kuzatuvdan |
| Manbadan kelgan yozuvga bitta qism yetishmasa, nima qilasiz? | Yetishmagan qismni o'zingiz yozasiz — g'oyada uchala qism bo'ladi |
| Bugun g'oyalar baholanadimi? | Yo'q: bugun oltitasi yoziladi, tanlov keyinroq |
| Nega Starbucks «uchinchi joy» deyiladi? | Birinchi joy — uy, ikkinchisi — ish yoki maktab; Starbucks ularning o'rtasida |
| Starbucks'da odamlar nima uchun to'laydi? | Ichimlik uchun emas, joy va muhit uchun |
| Nega g'oyada muammo alohida yoziladi? | Faqat yechimni eshitgan odam muammoni boshqacha tushunishi mumkin |
| O'z MVP'ingizni davom ettirish g'oya bo'ladimi? | Ha: u uch qism bilan yoziladi va boshqa g'oyalar qatorida turadi |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 11/11 atama yodlandi · Qaytadan takrorlash» (qolip yorlig'i)
- §145: har javobdagi so'z darsda bor (uch qism — 2 · muammo, kim uchun, yechim qoidalari — 4 · manba — 4, 8 · baholanmaydi — 8 · Starbucks — 6 · juftlik — 9 · MVP davomi — 4, 11).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).

## 14 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Oltita g'oyangiz tayyor.** (23) · oltitaga yetmagan bo'lsa (P-046): **{n} ta g'oya yozildi — qolgani uyda.** (≈34)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): G'oya nom emas: unda muammo, kim uchun va yechim yoziladi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Muammoni uch manbadan topasiz: 9-Modul ro'yxati, MVP'ning «Keyin» qutisi va yangi kuzatuv.
  - Manbadan kelgan yozuvga yetishmagan qismni o'zingiz yozasiz.
  - Faqat yechimni eshitgan odam muammoni boshqacha tushunishi mumkin.
  - O'z MVP'ingizni davom ettirish ham g'oya — u boshqalar qatorida turadi.
  - Starbucks'da odamlar ichimlik uchun emas, joy va muhit uchun to'laydi.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: uydagilardan biri · Nechta: 6 g'oya · Muddat: keyingi darsgacha
  - ① «G'oyalarim» ro'yxatida oltitadan kam bo'lsa — oltitaga yetkazing.
  - ② Bitta g'oyangizni uydagilardan biriga faqat yechim bilan o'qing va u aytgan muammoni qog'ozga yozing. Keyin uch qismni birga o'qing — ikki muammoni solishtiring.
  - ③ Har g'oyaning «Kim uchun» qatorini o'qing: shunday odamlardan kimni taniysiz? Har g'oya uchun bittasini qog'ozga yozing: ismi emas, kimligi (masalan: «qo'shni bola, maydonda o'ynaydi»).
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Oltita g'oyadan qaysi uchtasi qoladi?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ichki skroll qutisi yo'q (SABOQ 18); «Kim bilan» — HwCard yorlig'i, «Kim uchun» emas (g'oya qismi bilan to'qnashmasin, T-015).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Source Finder!** (4-ekran, uch qadamda birinchi urinishda) — Uch manbadan kelgan yozuvlarni birinchi urinishda g'oyaga aylantirdingiz
- **Six Ideas!** (8-ekran, 6/6) — Oltita g'oyani uch qismi bilan yozdingiz
- **Pair Check!** (9-ekran, solishtirish bajarilganda) — Bitta g'oyani faqat yechimidan solishtirdingiz (juftlikda ham, yakka rejimda ham rost — pilot ko'rigi 06.10)
- **Card Coder!** (10-ekran, uch shart ✓) — Yozuvlarni sahifada kartaga aylantiradigan kod yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · G'oyaning uch qismi** — 1 Muammo — odamlar nimadan qiynalishi. · 2 Kim uchun — aynan qanday odamlar. · 3 Yechim — mahsulot nima qilishi.
  — Sinfga savol: «Futbol ilovasi» — g'oyami? Unga nima yetishmaydi?
- **5 · Yechim muammoga javob beradi** — 1 Avval muammo qatorini o'qing. · 2 Yechim aynan shu qiyinchilikni yengillashtirsin. · 3 Boshqa muammoga javob beradigan yechim mos emas.
  — Sinfga savol: Uy vazifasi chatda yo'qolsa, qaysi yechim mos?
- **7 · Starbucks — uchinchi joy** — 1 Qahva nuqtasi — qahva olib, chiqib ketadigan joy. · 2 Shuls Starbucks'ni uy bilan ish yoki maktab o'rtasidagi «uchinchi joy» qilib qurgan. ·
  3 Odamlar ichimlik uchun emas, joy va muhit uchun to'laydi. — Sinfga savol: Bitta g'oyangizda odamlar mahsulotdan nima uchun foydalanadi?
- **11 · MVP davomi ham g'oya** — 1 O'z MVP'ingizni davom ettirish ham g'oya bo'ladi. · 2 U ham uch qism bilan yoziladi. · 3 Bugun g'oyalar baholanmaydi — hammasi bitta ro'yxatda.
  — Sinfga savol: Mentorning qaysi g'oyalari «Maydon»ni davom ettiradi?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·10 · B 3·7·12 · C 2·8·11 · D 4·6·9 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Sinfdoshingiz «maktab ilovasi qilaman» dedi. G'oyaga yana nima kerak? (2)
   - ✔ Muammo, kim uchun va yechim (27)
   - Ilovaning chiroyli nomi, rangi (30)
   - Ilovaning narxi va reklamasi (28)
   - Tugmalar soni va ekran rangi (28)
2. Qaysi gap g'oyaning yechim qatoriga yoziladi? (4)
   - Sinfdoshlar vazifani chatda yo'qotadi (37)
   - Maktabdagi barcha sinf o'quvchilari uchun (41)
   - ✔ Har fan vazifasini bir joyda ko'rsatadi (39)
   - Vazifalar chiroyli turishini xohlaydi (37)
3. Qaysi gap g'oyaning muammo qatoriga yoziladi? (4, 8)
   - Ilovada chat bo'lishini xohlaydi (32)
   - ✔ Uy vazifasi chatlarda yo'qoladi (31)
   - Ilova chiroyli bo'lsa yaxshi edi (32)
   - Bot tez ishlashini juda xohlaydi (32)
4. «Kim uchun» qatoriga qaysi biri aniq yozilgan? (4)
   - Shahardagi har xil yoshdagi odamlar (35)
   - Telefoni va interneti bor har bir odam (38)
   - Yoshlar ham, kattalar ham — hamma odam (38)
   - ✔ To'garak izlayotgan maktab o'smirlari (37)
5. Mentorning jamoa yig'ish g'oyasida muammoga qanday dalil bor? (2)
   - ✔ 9-Modulda 5 kishidan 2 tasi shuni aytgan (40)
   - Futbolni hamma yaxshi ko'radi, demak kerak (42)
   - Mentorning o'zi futbolni yaxshi ko'radi (39)
   - Ilova nomi chiroyli va eslab qolinadi (37)
6. Keyinga qoldirilgan funksiyadan g'oya qilish uchun nima topiladi? (4)
   - Funksiyaga qisqa va qiziq nom (29)
   - Shunga o'xshash ilovaning nomi (30)
   - Funksiyani qurish uchun kod (27)
   - ✔ Funksiya hal qiladigan muammo (29)
7. Shuls Starbucks'ni qanday joy qilib qurgan? (6)
   - Qahva tez olinadigan kichik nuqta (33)
   - ✔ Uy va ish o'rtasidagi uchinchi joy (34)
   - Faqat ishlash uchun jimjit katta ofis (37)
   - Ichimlik arzonroq sotiladigan do'kon (36)
8. Starbucks'da odamlar nima qiladi? (6)
   - Qahva olib, tezda chiqib ketadi (31)
   - Faqat telefonini quvvatlab oladi (32)
   - ✔ O'tiradi, ishlaydi va uchrashadi (32)
   - Navbatda turib, ichimlik kutadi (31)
9. Oltita g'oyani yozayotganda har biri bilan nima qilasiz? (8)
   - Yozgan zahoti kuchsizini o'chirasiz (35)
   - Faqat eng qiziq uchtasini yozib olasiz (38)
   - Har biriga chiroyli nom o'ylab topasiz (38)
   - ✔ Uch qismini yozib, keyingisiga o'tasiz (38)
10. Sherigingiz faqat yechimni eshitib, boshqa muammoni aytdi. Bu nimani bildiradi? (9)
    - ✔ Faqat yechimdan muammo bilinmasligi mumkin (42)
    - Sherigingiz g'oyani yaxshi tinglamay qolgan (43)
    - G'oyani o'chirib, yangisini yozish kerak (40)
    - Yechim qatorini butunlay olib tashlash kerak (44)
11. Atrofni kuzatganda nimaga qaraysiz? (8)
    - Qaysi ilova eng ko'p yuklanganiga (33)
    - Do'stlar qaysi o'yinni o'ynashiga (33)
    - ✔ Kim, qayerda, nimadan qiynalganiga (34)
    - Qaysi texnologiya eng yangi ekaniga (35)
12. 9-Moduldagi muammolar ro'yxatidan g'oya qilish uchun nima qo'shasiz? (4)
    - Muammoga qisqa va esda qoladigan nom (36)
    - ✔ Mahsulot nima qilishini aytadigan yechim (40)
    - Shu muammoga o'xshash yana bir xohish (37)
    - Ro'yxatdagi yana ikki-uchta boshqa muammo (41)
- Arena yozuvlari — platforma shabloni (namuna 6-Modul YAKUNIY 14-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — g'oya · muammo · kim uchun · yechim · manba · kuzatuv · ro'yxat · sherik ·
  uyga vazifa banneri — g'oya · muammo · yechim · ro'yxat.

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/9-Modull/PmTenIdeasLesson.jsx` — skeletdan. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s11 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s6 `QVoqea` · s8/s9 `QMustaqil` · s10 `QKod` · s12 `QNatija` · s13 `QKartochka` · s14 `QYakun`; palitra `qolipRang('pm')`.
2. **`GoyaKarta`** — bitta vizual (180): uch ko'rinish (`toliq` · `ixcham` · `yopiq`), qator holatlari (bo'sh/joriy/yozildi/xato/yopiq), nom va manba chipi, yorliq «g'oya» (2-ekrandan keyin).
   **`GoyaRoyxat`** — ixcham qatorlar + «n / 6», ikki ustun × 3 (6 da), qator ✎ yoki › (toggle). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. Qolip-maket izohi faylda e'lon qilinadi.
3. **`MENTOR_GOYALAR`** — 6 × `{ nom, muammo, kim, yechim, manba: 'keyin' | 'royxat' | 'kuzatuv' }`, tayanch 1.1 aynan (1-g'oya yechimida «+» → «va»). **`MANBALAR`** — 3 × `{ id, t }`
   («9-Modul ro'yxati» · «Keyin» qutisi · «Yangi kuzatuv»). Bitta manba: 0, 2, 4, 8 (mentor rejimi), 9 (yakka), 11 (javobdan keyin).
4. s0: `QKirish` sof so'rovnoma — hammaga `correct: false`, maqtov yo'q (J-026); javob 80 belgi; `HookManba` maket (uch obyekt) + «Mentorning g'oyalari» qutisi, kartalar uchishi (100 ms), son 0 → 6.
5. s2: `S2_SAVOLLAR` 3 × `{ savol, qator, matn, sahna }`; `S2Sahna` («Maydon» kartasi va «Keyin» qutisi, chip nomga uchadi → maydon siluetlari va «Kim keladi?» → mahalla → telefon e'loni «8 / 10» → «9 / 10» namoyish);
   `QBashorat` 1/2/3 → ixcham qator; savol-tugmalar bashoratdan keyin; dalil-chip; `QIzoh` + `QTaxmin` + xulosa bitta natija blokida (SABOQ 25); 40 s ipucha.
6. s4: `S4_QADAM` 3 × `{ manba, goya (indeks 2/5/6 — 1.1 dagi raqam), bosh: 'muammo' | 'yechim' | 'kim', tanlov: [3], togri, xato, yordam, dalil? }`; `S4Manba` sahnalar (MVP doskasi «Keyin» chiplari · Mentor ro'yxati 6 qator ·
   maktab yo'lagi va e'lon taxtasi); uchish animatsiyalari; 3/3 dan keyin qolgan 2 g'oya (3, 4) ro'yxatga; manbalar o'zi ochiladi; manba yozuvi va qator bir xil raqamli belgi + uchish chizig'i; ro'yxat qatori toggle; nishon `sourceFinder` (birinchi urinish).
7. s6: `STARBUCKS_BOSQICH` 3 × `{ h — bosqich nomi, m — Mentor gapi }` (SABOQ 8); `StarbucksSahna` (qahva nuqtasi — kirib-chiqish halqasi · uy — Starbucks — maktab/ish yo'li · kafe ichi: divan, stol va noutbuk, suhbat);
   nom «Starbucks» yashil (brend rangi — o'quvchi yuzasida yagona tashqi rang, `Brend` komponenti), logotip yo'q; bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); manba izohi faylda.
8. s8 artefakt: `localStorage` `pm-m9d1-goyalar` = `{ goyalar: [{ muammo, kim, yechim, manba }] × 6, savedAt }` (manba — TAYANCHGA SAVOL 4); o'qiydi `pm-m7d1-muammolar` (muammolar ro'yxati) va
   `pm-m7d3-mvp` (`keyin`; TAYANCHGA SAVOL 4); ishlatilgan muammo/funksiya kulrang ✓; tekshiruv: bo'sh — bloklaydi, qolgani yumshoq (ikkinchi «Saqlash»); tekshiruvlar — xohish so'zlari, kim uchun qatori butunicha «hamma / odamlar / hamma odamlar / barcha odamlar / har kim / hamma uchun»,
   yechim ≤ 2 so'z va unda ilova/sayt/bot/AI, takror (8-ekran ro'yxati aynan); ketma-ket karta (bitta katta, qolgani ixcham — SABOQ 29); ✎ — o'sha g'oyani katta karta qiladi; nishon `sixIdeas`; artefakt-strip «G'oyalarim».
9. s9: 3 qadam; `PairTimer` 1 daqiqa (▶ ⏹ belgisiz); yozish qatori; parda «yopiq» → «Ochish»; `Bir xil` / `Boshqacha` → chiziq yoki ikkinchi muammo qatori + xulosa (P-046); tahrir yo'q — `pm-m9d1-goyalar` ga yozilmaydi (01-FILTR 2);
   yakka rejim — `MENTOR_GOYALAR[2]` (Mahalla to'garaklari); `optionalLive`; Mentor statistikasi; nishon `pairCheck`. Yangi kalit yo'q.
10. s10: `KOD_TASK` — `files: [{ name: 'app.js' }, { name: 'index.html' }]`, `previewCss` (`.goya`), 3 shart (`C.evalEquals`) — **ma'lumotdan mustaqil** (SABOQ 37, F-1006-270): (1) `qatorlar({ muammo: "a", kim: "b", yechim: "c" }).join("|")` =
    `Muammo: a|Kim uchun: b|Yechim: c` · (2) `qatorlar({ muammo: "a", kim: "b", yechim: "" })[2]` = `Yechim: hali yo'q` ·
    (3) `#goyalar .goya` soni = `goyalar.length`, har birida 3 `p`; boshlang'ich kodda har yozuv ko'p qatorli obyekt (har kalit alohida qatorda, ≤ 70 belgi) (`C.custom` yoki `evalEquals` bilan, `window` ichida); darvoza `KOD_DARVOZA` (`nom`/`manba` uchliklari — xato, `muammo · kim · yechim` — to'g'ri);
    `KodNamuna` (kalitlar ajralishi, nusxalanmaydi); `storageKey="pm-m9d1-code"`; QKod o'ng ustun propi — 9-Modul 1-dars `QKOD_ONG` yechimi (til-lint); «kompilyator» ta'riflanmaydi; nishon `cardCoder`.
    ⚠️ Starter matni ichida backtik yo'q (template-satr emas) — CSS/JSX tuzog'i (CLAUDE.md).
11. Testlar s3/s5/s7/s11 — `correctIdx` 2/0/3/1 = `INLINE_KEYS`; `RECAPS` 3/5/7/11 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6).
    s3/s5/s11 karta — `QuestionScreen` `vizual`: savol ostida, faqat javob topilgach / natija ochilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
12. `ACHIEVEMENTS` 4 (`sourceFinder`, `sixIdeas`, `pairCheck`, `cardCoder`); s14 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — ScoreRing ostida (P-013); `HW_TOKENS` — faqat so'z.
13. Uyga vazifa — yangi `HwCard` (dars yangi; PM-027 «tegilmaydi» bu yerga tegishli emas): yorliqlar «Kim bilan · Nechta · Muddat», 3 qadam, yakun ekranida aynan shular. Alohida `.homework.jsx` yo'q.
14. App.jsx: `m9-01` qatoriga `comp: PmTenIdeasLesson` + import — asosiy seans (bu agent tegmaydi). Nom «Oltita g'oyani qayerdan topasiz?» ✓ va osti ✓ (DE-205, App.jsx 372-qator).
15. **REPO — yo'q** (PM darsi; `maydon-jamoa` 7-darsdan).
- Darvozalar: `npm run gates -- src/9-Modull/PmTenIdeasLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
> **Holat (06.10, 01-FILTR):** hammasi yopildi — 1 → tayanch 9.20 · 2 → 1.1 tepasi · 3 → 1.1 tepasida (9-g'oya kuzatuvi) · 4 → tayanch 8 · 5 → 1.1 («va») · 6 → 1.1 (5, 6-g'oya muammosi 01-FILTR 4 bilan yangilandi) ·
> 7 → 9.22 · 8 → 9.23 · 9 → 9.24 (2-dars «kamida 5 tanish» so'raydi) · 10, 11 → 9.25, GATE M M-q4 · 12 → 9.26.
1. **«G'oya» ta'rifi.** Tayanch 2: «muammo + kim uchun + yechim — uch qismli bitta gap». Darsda: «G'oya uch qismdan iborat: muammo, kim uchun va yechim.» Nega: o'quvchi uch qatorni alohida yozadi (kalit ham
   `{ muammo, kim, yechim }`); uchalasini bitta gapga yig'ish qolipi (masalan «{muammo} — {kim} uchun {yechim}») har o'quvchi matnida grammatik tugal chiqmaydi (KORPUS §37) va 1.1 dagi 3, 5-g'oyada tire/«uchun» takrorlanadi.
   «Bitta gap» shart bo'lsa — qolip tasdiqlansin.
2. **Mentor g'oyalarining manbasi** (1.1 ga yangi ustun): 1, 2 — «Keyin» qutisi (9-Modul MVP: jamoa yig'ish, to'lov); 6 — 9-Modul Mentor ro'yxati («eski darsliklar» yozuvi); 3, 4, 5, 7, 8, 9, 10 — yangi kuzatuv.
   Nega: 4-ekran «qayerdan topdi» savoliga javob beradi. 2–4-darslar shunga zid gapirmasin (masalan 2-darsda 5, 9 — «real auditoriya topilmadi»: yangi kuzatuv bo'lsa ham mumkin).
3. **4-ekran 3-qadamidagi Mentor kuzatuvi** (maktab yo'lagida e'lon taxtasi, qog'oz «Yo'qoldi: sumka», «Tanaffusda ko'rdim») — o'ylab topildi; 9-g'oyaning muammo va yechimiga mos.
4. **Kalitlar.** (a) `pm-m9d1-goyalar` ga `manba` maydoni (`'royxat' | 'keyin' | 'kuzatuv'`) — «asoslangan g'oya» shu bilan ko'rinadi; 2-dars o'qishiga xalaqit bermaydi.
   (b) 8-ekran `pm-m7d3-mvp` (`keyin`) ni ham o'qiydi — tayanch 8 da 1-dars faqat `pm-m7d1-muammolar` ni o'qiydi; GATE_M_JAVOB 2 dagi «o'z MVP sining «Keyin» ro'yxati» shu kalitda.
   (c) `nom` maydoni yo'q — o'quvchi g'oyasida nom yozilmaydi (ixcham qatorda yechim ko'rinadi); 2-dars RICE jadvali qisqa nom so'rasa — maydon qo'shilsin.
5. **1.1 dagi «+»** (1-g'oya yechimi «o'yin e'loni + «Qo'shilaman»») — o'quvchi matnida «va» (T-035: belgi-formula yo'q). Tayanchda ham «va» qilish taklifi.
6. **1.1 dagi 5 va 8-g'oya muammosi** («o'qilgan kitob javonda turadi», «o'yinlar jadvali va natijasi qog'ozda») — qiynalish ko'rinmaydi, rost fakt; 9-Modul qoidasi bo'yicha bu muammo emas.
   Shuning uchun darsda «rost fakt» tuzog'i ishlatilmadi (faqat xohish va yechimning yo'qligi). Taklif: 5 — «o'qib bo'lgan kitobini kimga berishni bilmaydi», 8 — «jadval qog'ozda — o'yinchilar qachon o'ynashini bilmaydi».
7. **«Keyin» qutisi** — GATE_M_JAVOB 2 da «Keyin» ro'yxati; o'quvchi 9-Modul 3-darsda «uch quti» ko'rgan (Qilamiz · Keyin · Qilmaymiz). Modul bo'yi «Keyin» qutisi bo'lsin.
8. **«Maydon Jamoa» nomi** bu darsda yo'q — g'oya hali tanlanmagan; nom 4-darsdan (final g'oya) yoki 5-darsdan (PRD). 2–3-darslar ham nomsiz «jamoa yig'ish» desin.
9. **Uyga vazifa ③** («kim uchun» qatoridagi tanishlar, qog'ozga) — 2-dars saralashidagi «real auditoriya bormi» savoliga tayyorlov. 2-dars MD si shu bilan boshlansinmi? Saqlanmaydi (yangi kalit yo'q).
10. **Starbucks asoschisi nomi:** tayanch «Shuls»; 4-Modul `m3-17` (`src/pm/PmJtbdLesson.jsx`) — «Govard Shuls». Kurs bo'yi bitta yozilish tanlansin. Bu darsda — tayanchdagidek «Shuls».
11. **«qahva» / «kofe»:** bank va tayanch «qahva nuqtasi»; `m3-17` da «kofe». Darsda faqat «qahva» (bir so'z).
12. **«5 kishidan 1 tasi «pulni bo'lishish qiyin»»** — 9-Modul tayanchi 1-bo'limdan (11-Modul tayanchida yo'q); 4-ekran 1-qadam dalil-chipida.

## Shubhali joylar (ishonchim komil emas)
- ~~4-ekran 2-qadam: 9-Modul yozuvi va 1.1 muammosi bir emas~~ — **yopildi (01-FILTR 4):** 6-g'oya muammosi 9-Modul yozuvidan («eski darsligini kimga berishni bilmaydi, u uyda yillab turadi»); 5-g'oya takrorlanmasin deb «yangi kitob qimmat — o'qimoqchi bo'lganini ololmaydi».
- ~~4-ekran 1-qadam: «to'lov» → «kim to'lagani ro'yxati»~~ — **yopildi (01-FILTR 5):** manba sahnasida «to'lov» chipi bilan birga 9-Modul intervyu yozuvi (1 / 5 «pulni bo'lishish qiyin») — 9-Modulda «To'lov» shu bitta yozuv sababli «Keyin»da turgan (`PmInterviewMvpLesson`).
- Starbucks tanishtiruvi «qahva va boshqa ichimliklar sotadigan kafelar» va «Qahva nuqtasi — qahva olib, chiqib ketadigan joy» — bankda so'zma-so'z yo'q, umumiy bilim va atama izohi.
- 9-ekran natijasi sherikka bog'liq: «Bir xil / Boshqacha»ni o'quvchi o'zi belgilaydi — halol tugma, tekshirib bo'lmaydi.
- 5-ekran (avtobus) — Toshkentda avtobus vaqtini ko'rsatadigan ilovalar bor; test faqat «yechim muammoga mosmi»ni so'raydi, ilova nomi aytilmaydi.
- 0-ekran: 9-Modulni boshqa platformada o'tgan o'quvchida 9-Modul ro'yxati va MVP doskasi saqlanmagan bo'lishi mumkin — 8-ekranda erkin qator bor (M-q5).
- Arena 4: «To'garak izlayotgan maktab o'smirlari» — 1.1 dagi «to'garak izlayotgan o'smirlar»dan bir so'z ortiq (uzunlik tengligi uchun).
- 10-ekran: `forEach`, `createElement` — JS darslarida o'tilgan deb oldim (2-Modul DOM); o'quvchi faqat `qatorlar` ichini yozadi.
- 10-ekran: tayanch 4 «g'oyalar massivi → har g'oya kartasi» — kodda massiv nomi `goyalar`, lekin uchinchi element yechimsiz (hali g'oya emas), shuning uchun sarlavha va Mentor «yozuv» deydi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 363–372 — `m8-11` «Besh daqiqada nimani ko'rsatasiz?» → `m8-12`, `m8-13` «Zaxira dars» → **`m9-01` «Oltita g'oyani qayerdan topasiz?»**
  (osti «muammo, kim uchun va yechim — 6 yozma g'oya» — reja chap qatori so'zma-so'z) → `m9-02` «Oltita g'oyadan qaysi uchtasi qoladi?» (yakun qatori).
- [x] Bitta misol-ip: Mentorning 6 g'oyasi (1.1 aynan), «jamoa yig'ish» — biri, tanlov yo'q; metafora yo'q; bitta vizual — `GoyaKarta` (to'liq · ixcham · yopiq) + `GoyaRoyxat`.
  Ikkinchi misol faqat testda, o'smir olamidan (oshxona boti, bekat, kafe — P-002). Starbucks — keys sahnasi (PM-028/029).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4 (QTushuncha) + 0, 6, 8, 9, 10; testlarda javobdan keyingi karta. «bosish → matn-karta» yo'q — har bosish sahna yoki kartani o'zgartiradi.
- [x] O'lchov (skript bilan sanaldi, `scratchpad/md01/olchov.py`): sarlavha 23–48, bitta qator · Mentor ≤2 gap (interaktiv ekranlarda 1), sarlavhani takrorlamaydi · xulosa 54–100 · hook javobi 80 · xato izohi 23–57.
- [x] Atamalar: muammo, yechim (9-Modul `m7-01`, `m2-02`), muammolar ro'yxati (`m7-01`), MVP va «Keyin» qutisi (`m7-03`) — so'zma-so'z; yangi «g'oya» misoldan keyin; «maydon», «jamoa», «qahva» — bir ma'noda;
  siz-forma, tugmalar ot-shaklda («Saqlash», «Ochish», «Davom etish»).
- [x] Testlar: 4 variant, uzunlik teng (s3 38/40/38/38 · s5 43/46/47/46 · s7 41/42/42/40 · s11 46/44/44/46 — farq ≤15%); to'g'ri javob hech qayerda yolg'iz eng uzun emas;
  tire / kalit so'z faqat to'g'rida emas (s3, s11 — tire to'rtalasida; s5 «ko'rsatadi» uchtasida; s7 «joy» ikkitasida). Arena 12 — farq ≤15%, ✔ A3 B3 C3 D3. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «100%» — grep 0; «mumkin», «bu misolda» bilan chegaralangan).
- [x] Ichki kodlar yo'q (o'quvchi matnida F-kod, `m9-NN`, «Modul 11» yo'q; modul raqami LMS raqamida — «9-Modul»). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 15 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (g'oya atamasi misoldan keyin, sarlavhada yo'q) · T-014/T-015 (bir so'z — bir ma'no; «Kim bilan» yorlig'i) · T-016 (metafora yo'q) · T-039 («g'oyangiz» — yozilgandan keyin) ·
  T-042 (ta'rif so'zma-so'z: 2, 13, kartochka 1) · T-043 («bu misolda») · T-047/T-048 (Mentor ekrandagini aytmaydi; asosiy fikr yakunda bir marta) · T-064 (4-ekran sarlavhasi 0-ekran savoliga javob) ·
  P-001 (bitta ip) · P-008 (bir ekran — bir ish) · P-013 · P-015 (reja ta'rif aytmaydi) · P-025 (uyga vazifa karta) · P-033 (yordam xatodan keyin) · P-036 (0-ekranda kartalar yopiq) · P-046 (8, 9-ekran xulosasi
  o'quvchi ma'lumotidan) · P-053 (keys sahnasi bosqichma-bosqich, bashoratda `pre` kadr) · P-057 (9-ekran solishtirish) · P-062 (son ekranda bir marta) · P-064 (bashorat 2, 6) · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004 (bitta himoyalanadigan javob; distraktor dars qoidasi bo'yicha noto'g'ri) · S-006 · S-010 · S-015 (keysda bitta bashorat, tor → keng) · S-018 (Starbucks izohi) ·
  S-020 (ballik matnda atama glossasiz yo'q — «intervyu» arena 5 da yo'q) · S-026 (recap raqam) · S-027 · S-040 (har qadam tuzoqlari bitta xato-sinf) · PM-005 (2-tur) · PM-017 (namuna — bitta olam, rost) ·
  PM-018 (Starbucks — faqat bankdagi qaror) · PM-082 (kod ekrani darvozasi, nusxa yo'q) · J-026 (hook) · SABOQ 1–31 (A-bo'limda va har ekranda).
