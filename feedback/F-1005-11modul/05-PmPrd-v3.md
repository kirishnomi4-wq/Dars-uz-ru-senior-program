# 11-Modul · 5-dars (PM) «G'oyangiz bir sahifaga sig'adimi?» — MD v3

Fayl: `src/9-Modull/PmPrdLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m9-05` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta, yozilgani ixcham qatorga uchadi) · mahsulot nomi «Maydon Jamoa» o'z rangida, telefon maketida ·
ekranga kirganda bo'sh, ma'nosiz element yo'q · ekranda ≤ 3 blok · maket chapda, karta o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **C** (`2`) · 7-ekran — **A** (`0`) · 12-ekran — **D** (`3`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 375–377, DE-205): `m9-04` «O'n intervyudan keyin qaysi g'oya qoladi?» → **`m9-05` «G'oyangiz bir sahifaga sig'adimi?»** (osti: «Mentor tekshiruvi va to'liq PRD») → `m9-06` «Bitiruvgacha nimani qachon qurasiz?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (yetti bo'limli PRD), mustaqil ish majburiy (9-ekran). Keys — **K16 Amazon** (tayanch 5, faqat bank matni). REPO yo'q (PM darsi; `maydon-jamoa` 7-darsdan).
Kod mexanikasi (tayanch 4): VS Code — `PRD.md` (Markdown — kod emas, hujjat; K16: hujjat koddan oldin). 4-dars — `node sanoq.js`, 6-dars — kod oynasi: mexanika takrorlanmaydi (PM_DARS_ETALON 26).
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 6 · tushuncha, keys va testlar (2–8) ≈ 33 · PRD yozish ≈ 20 · uch savol ≈ 8 · `PRD.md` ≈ 10 · yakuniy savol, podium, kartochkalar, arena ≈ 13.
Manba: `00-MODUL-TAYANCH.md` (1 — ip, muammo gapi, bosh raqam · 1.3 — 10 yozuv va sanoq · 1.4 — PRD aynan · 2 — atamalar · 4 · 5 — K16 · 7 · 8 — kalitlar · 9 — to'lqin kelishuvlari) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 3, 17) · `00-TAQIQLAR.md` · 8-Modul PRD ko'prigi — `feedback/F-0929-QA-6modul/YAKUNIY/02-PmLesson22.md` (`m6-02`) · 9-Modul MVP qutilari — `feedback/F-1005-9modul/03-PmInterviewMvp-v3.md`.
⚠️ Modul raqami: tayanchdagi «6-Modul `m6-02`» — kod raqami; o'quvchi matnida LMS raqami **«8-Modul»** (10-Modul tayanchi 136-qator: kod 6 = LMS 8). TAYANCHGA SAVOL 1 — yopildi: 9.47; o'quvchi matnida «6-Modul» yo'q.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: Mentor tekshiruvi va to'liq PRD; dastur iborasi so'zma-so'z — faqat 8-ekran O'qituvchi eslatmasida, 9.41):** o'quvchi o'z final g'oyasi uchun yetti bo'limli PRD yozadi, uni Mentor tekshiruvining
   uch savoli bilan tekshiradi (javob — **qabul** yoki **tuzatish**, qaysi bo'lim ekani bilan; 9.41) va VS Code'da `PRD.md` fayliga yozadi. Saqlanadi: `pm-m9d5-prd` (6, 7, 16-darslar o'qiydi).
   Bugun funksiyalar RICE bilan tartiblanmaydi va ufqlarga ajratilmaydi — bu roadmap darsining ishi (dars ichida va'da qilinmaydi, T-038).
2. **Bugungi asosiy fikr (P-013):** G'oya bir sahifaga yetti bo'lim bo'lib yoziladi va qurishdan oldin uch savol bilan tekshiriladi. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - **PRD** — 8-Modul `m6-02`: «Bunday varaqni PRD deyishadi — mahsulot talablari hujjati (Product Requirements Document). Katta jamoada u bir necha sahifa, bizda — to'rt katak.»
     To'rt katak: **Muammo** (Nima qiynayapti?) · **Kim** (Aynan kim qiynalyapti?) · **Yechim** (Nima quriladi?) · **O'lchov** (Natijani qaysi sondan bilamiz?).
     Bu darsda ta'rif **bir marta** — 1-ekran Mentor gapida (birinchi ko'rinish, T-036); boshqa hech qayerda «talab» so'zi yo'q (T-015, tayanch 1.4 — «talab» 9-Moduldan agentga yoziladigan matn).
   - **muammo gapi** (4-dars, so'zma-so'z) · **intervyu** · **yozuv** · **harakat belgisi** (3-dars) · **dalil** (4-dars: «10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.»).
   - **«Qilamiz» · «Keyin» · «Qilmaymiz»** — 9-Modul MVP doskasining uch qutisi: «Qilamiz»ga busiz muammo hal bo'lmaydigan ish kiradi; «Keyin»ga yozuvlarda sababi bor ish (o'chirilmaydi, navbati suriladi);
     «Qilmaymiz»ga yozuvlarda sababi topilmagan ish (9-Modul `m7-03` so'zma-so'z). Quti yonida ravish «keyin» ishlatilmaydi — «so'ng» (9-Modul qoidasi).
   - **bosh raqam** — «mahsulot o'z ishini bajarganini ko'rsatadigan bitta raqam» (10-Modul; «Maydon»da — haftada band qilingan vaqtlar).
   - **Markdown** — 8-Modulda `SKILL.md` shu usulda yozilgan («`###` — Markdown'da sarlavha belgisi»); 9–10-Modulda `README.md`. 11-ekranda bir gap bilan eslatiladi.
   - **g'oya** (1-dars, so'zma-so'z): «G'oya uch qismdan iborat: muammo, kim uchun va yechim.» — PRD ning 1, 3, 4-bo'limlari shu uch qism.
4. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **to'liq PRD** — «Bizda to'liq PRD — g'oyaning yetti bo'limli bir sahifasi.» (2-ekran: uch bo'lim qo'shilgandan so'ng tug'iladi; «Bizda» — 8-Modul «bizda — to'rt katak» bilan bir, PRD ning umumiy ta'rifi emas — 05-FILTR 3.) Yetti bo'lim, shu tartibda (tayanch 1.4):
     **1 Muammo · 2 Dalil · 3 Kim uchun · 4 Yechim · 5 Uchta asosiy funksiya · 6 Qilmaymiz / Keyin · 7 Bosh raqam.** 8-Moduldagi «Kim» → «Kim uchun» (g'oya qismi), «O'lchov» → «Bosh raqam».
   - **Mentor tekshiruvi** — «PRD ni uch savol bilan ko'rish — Mentor tekshiruvi deyiladi.» Uch savol (tayanch 1.4, aynan): **«Dalil bormi?» · «Bajariladimi?» · «Bosh raqam sanaladimi?»**
     Javob: **qabul** yoki **tuzatish** (qaysi bo'lim) — 9.41. Savollar bitta manbadan (`TEKSHIRUV_SAVOLLAR`, P-063): 8, 10-ekranlar, kartochka, recap, yakun.
   - **asosiy funksiya** — PRD dagi uchta funksiyadan biri, nomi bilan (tayanch 2; F1/F2/F3 — faqat MD va kodda).
   - **press-reliz** — «kompaniya yangi mahsulot chiqqani haqida yozadigan xabar» (6-ekran, faqat keysda). 5-Modulda (`m4-12`) «matbuot e'loni (press-reliz)» deyilgan — bu modulda «e'lon» o'yin e'loni ma'nosida band, shuning uchun faqat «press-reliz» (T-015; TAYANCHGA SAVOL 8).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«bo'lim»** — PRD dagi yetti sarlavhaning har biri («qism» — faqat g'oya ta'rifida, 9.46); **«katak»** — faqat 8-Moduldagi to'rt katakli varaq haqida; **«sahifa»** — PRD ning bir sahifasi (dars ekrani «sahifa» deb atalmaydi, T-064).
   - **«e'lon»** — faqat o'yin e'loni (tashkilotchi beradi). **«tasdiq»** — faqat 2-funksiya nomida «O'yin kuni tasdiq» (T-015, 9.41). **«qabul»** / **«tuzatish»** — Mentor tekshiruvi javobi
     («PRD ingiz qabul qilindi»). Dastur iborasi «Mentor g'oyani tasdiqlaydi» — faqat O'qituvchi eslatmasida (8-ekran).
   - **«maydon»** — faqat futbol maydoni; **«jamoa»** — faqat futbol jamoasi (Qaror-0 3). **«maydon pulini bo'lishish»** — 1.1 dagi g'oya nomi; tayanch 1.4 dagi «to'lovni bo'lishish» shu so'z bilan (TAYANCHGA SAVOL 2).
   - **«keyin»** — «Keyin» qutisi (bosh harf, qo'shtirnoq); ravish ma'nosida — «so'ng».
   - **Ishlatilmaydi:** talab (PRD ma'nosida) · spec · TZ · chekpoint · ficha · prioritet · push · real-time · «e'lon» (press-reliz ma'nosida).
6. **Mentor misoli — «Maydon Jamoa» PRD si (`MENTOR_PRD`, tayanch 1.4 aynan; mahsulot nomi 4-darsdan, 9.23):**

| № | Bo'lim | Matn (o'quvchi ko'radi) |
|---|---|---|
| 1 | Muammo | O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi. |
| 2 | Dalil | 10 intervyu. Jamoa yig'ish bo'yicha 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan; 5 tadan 4 tasi birinchi versiyani sinab ko'rishga kun belgilagan (harakat belgisi). · kulrang qator: 10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas. |
| 3 | Kim uchun | Mahalladagi mini-futbol o'yinchilari: tashkilotchi — o'yinni e'lon qiladi, o'yinchi — o'yinga qo'shiladi. |
| 4 | Yechim | Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi. |
| 5 | Uchta asosiy funksiya | **O'yin e'loni va qo'shilish** — tashkilotchi e'lon beradi (kun, soat, maydon, nechta odam kerak), o'yinchi «Qo'shilaman»ni bosadi, «8 / 10» o'zgaradi · **O'yin kuni tasdiq** — o'yin kuni qo'shilganlar «Kelaman»ni bosadi, tashkilotchi kim aniq kelishini ko'radi · **Chiqish va navbat** — o'yinchi chiqsa, joy bo'shaydi; o'yin to'lgan bo'lsa, yangi odam navbatga yoziladi va bo'shagan joyga navbatdagi kiradi |
| 6 | Qilmaymiz / Keyin | **Qilmaymiz:** chat (Telegram bor) · reyting va baho. **Keyin:** o'yindan oldin eslatma · ro'yxat o'zi yangilanadi · maydon pulini bo'lishish |
| 7 | Bosh raqam | Haftada to'lgan o'yinlar — kerakli odam soniga yetgan e'lonlar soni. |

   - **Qoralama (2, 4-ekranlar; tekshiruvdan oldin):** 5-bo'limning uchinchi funksiyasi — **Maydon pulini bo'lishish** («o'yinchilar maydon pulini bo'lishadi; kim to'lagani ro'yxatda ko'rinadi» — 1.1 dagi 2-g'oya yechimi);
     6-bo'lim «Keyin»ida faqat eslatma va ro'yxat o'zi yangilanadi. 8-ekranda «Bajariladimi?» savoli uni «Keyin»ga o'tkazadi, o'rniga **Chiqish va navbat** yoziladi (tayanch 1.4 — tuzatish namunasi), so'ng — **qabul**.
   - O'quvchi matnida «push», «real vaqt» qavslari yo'q (tayanch 1.4 dagi qavslar — atamalar, 8-dars va 12-Modulniki; TAYANCHGA SAVOL 5).
7. **Raqamlar (faqat tayanchdan, «Mentor misolida»):** 10 intervyu · jamoa yig'ish — 5 o'yinchidan 4 tasida muammo, 4 tasi sinovga kun belgilagan · to'garaklar — 5 kishidan 3 tasi to'garak topishda qiynalgan (3-ekran testi) ·
   9-Modul intervyusi — 5 kishidan 1 tasi «pulni bo'lishish qiyin» (8-ekran, 9.26) · namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» (9.2, 9.30) · K16 — 1995 (bank). Boshqa son yo'q.
8. **Keys — K16 Amazon (tayanch 5, bank matni aynan):** «Yangi mahsulot ichkarida chiqqanlik haqidagi press-reliz bilan boshlanadi — go'yo mahsulot allaqachon chiqqan. Press-reliz hech kimni qiziqtirmasa — mahsulot qilinmaydi.
   Hujjat koddan OLDIN yoziladi. Amazon o'zi tor boshlagan: 1995-yilda faqat kitoblar.» Raqamsiz (1995 — yil). Ko'prik: PRD koddan oldin; tor boshlash — «Qilmaymiz / Keyin».
   Amazon 5-Modulning «Ilova nimani yozib qoladi?» darsida (`m4-12`) ham bor — bugungi savol boshqa: PRD qachon yoziladi va nimani qurmaslik nega yoziladi.
9. **Ikkinchi misol faqat testda (P-002):** Mentorning boshqa ikki g'oyasi — mahalla to'garaklari (3-ekran, 1.3 sanog'i) va sinf uy vazifalari (5-ekran, 1.1).
10. **Toza yuza (185):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 1–4-darslarda Mentor oltita g'oyadan final g'oyaga keldi va unga nom berdi — «Maydon Jamoa». Bugun final g'oya bir sahifaga yoziladi va tekshiriladi; roadmap, prototip va qurish — so'ng.
- **Dars ipi:** 0 — g'oya bir sahifaga sig'adimi (so'rovnoma) → 2 — 8-Moduldagi to'rt katak «Maydon Jamoa» bilan yoziladi; quradigan odamning uch savoli uch bo'limni qo'shadi → to'liq PRD (atama) →
  3 — test: dalil nima → 4 — 9-Modul qutilari bo'yicha «Qilmaymiz / Keyin» yoziladi → 5 — test → 6 — Amazon: hujjat koddan oldin, tor boshlash → 7 — test →
  8 — Mentor tekshiruvi: uch savol, bitta tuzatish, qabul (atama) → 9 — o'quvchi o'z PRD sini yozadi → 10 — o'z PRD si uch savoldan o'tadi → 11 — `PRD.md` VS Code'da →
  12 — yakuniy test → podium → kartochkalar → yakun, uyda — PRD ni tekshirtirish va tuzatish.
- **Bitta vizual — PRD sahifasi (`PrdSahifa`, dars bo'yi, 163/180; bitta manba `MENTOR_PRD` + o'quvchi PRD si):**
  - Oq sahifa (A4 nisbati, ramka ostida kulrang yorliq «1 sahifa»), tepada nom: Mentor misolida **Maydon Jamoa** (o'z rangida) · o'quvchida — o'z final g'oyasi nomi (`pm-m9d4-final.goya`) yoki «Mening PRD sahifam».
  - **Rejimlar (bitta komponentdan):** **to'rt katak** (8-Modul varag'i: 2 × 2, har katak ustida kulrang savoli) → **to'liq** (yetti bo'lim, bir ustun: raqam · bo'lim nomi · matn) →
    **ixcham** (yetti bo'lim nomi + ✓, hisoblagich «PRD · n / 7»; 9, 10, 11-ekranlar va artefakt-strip).
  - **Bo'lim holatlari:** bo'sh (kulrang uzuq chiziq — U-041) → joriy (accent chegara) → yozildi (matn sirg'alib kiradi, ~1 s yashil) → tekshiruvda (accent halqa) → tuzatish (`err` fon bir lahza) ;
    sahifa tepasida muhr: yashil **«Qabul»** yoki accent **«Tuzatish: {bo'lim}»**.
  - **Telefon (`JamoaTelefon`, ≈170×272, 0, 2, 8-ekranlarda sahifaning chapida):** «Maydon Jamoa» nomi o'z rangida; ikki holat — **muammo** (Telegram guruhi: «Kim keladi?» va «+» javoblar boshqa xabarlar orasida)
    va **e'lon** (o'yin e'loni «Shanba, 18:00 · Mahalla maydoni · 8 / 10», «Qo'shilaman» tugmasi); ostida kulrang yorliq «chizma — hali qurilmagan» (prototip 7-darsda).
  - `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, juda yengil to'lqin (≤3%, ≥2 s — SABOQ 32, F-1006-270: «tebranish oshib ketibdi»); tanlov guruhida bitta halqa (har variantda emas — SABOQ 32). Yoqilgan pastki tugma ham halqada.
- **Bashorat (SABOQ 11, 25):** tanlangach karta yo'qolmaydi — savol va «Taxminingiz: …» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa joyidan joyiga uchadi (bo'lim sahifaga, ish qutiga, funksiya «Keyin»ga) · yangi qator sirg'alib kirib ~1 s yashil yonadi ·
  muhr bir lahza kattalashib «tushadi». Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **G'oyangiz bir sahifaga sig'adimi?** (33) — dars nomi (DE-205)
- Mentor: Final g'oya tanlandi, nomi — Maydon Jamoa. Endi uni quradigan odam o'qiydigan qilib yozish kerak: o'zingizga yaqin javobni belgilang.
- Maket (chap; bitta chizma): telefon «Maydon Jamoa» (e'lon holati, «chizma — hali qurilmagan») va uning yonida bo'sh sahifa (ramka, yorliq «1 sahifa»);
  sahifa tepasida o'tgan darslardan uchta kichik yopiq karta qiya turadi — «g'oya» · «10 yozuv» · «muammo gapi» (matnsiz, faqat yorliq).
- Variantlar (radio, o'ng; bir uzunlikda):
  - Ha, bitta gapga ham sig'adi (27)
  - Ha, bir sahifaga sig'adi (24)
  - Yo'q, bir necha sahifa kerak (28)
- Javob (uchalasida bir xil, maqtovsiz): Uchalasi ham bor: yechim bir gapda aytiladi, katta jamoada hujjat bir necha sahifa. Bugun — bir sahifa. (103)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant ixcham qator bo'lib qoladi; uchta yopiq karta navbat bilan (100 ms) sahifaga uchib kiradi va sahifaning tepa qismida kulrang qatorlarga aylanadi
  (bo'lim nomlari yo'q — 2-ekran kashfiyotini ochmaydi, P-036). Ikkala «Ha» va «Yo'q» teng tutiladi — hech biri xiralashmaydi (P-016). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan so'ng «Davom etish».
- O'qituvchi eslatmasi: Javobni muhokama qilmang — 2-ekran sahifani o'zi to'ldiradi. Sinfdan bir-ikki kishidan so'rang: final g'oyangizni hozir qayerda yozib qo'ygansiz?

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun final g'oyangizni bir sahifaga yozasiz.** (45)
- Mentor: 8-Modulda to'rt katakli varaqni PRD deb atagansiz — mahsulot talablari hujjati (Product Requirements Document). Bugun shu hujjat final g'oyangiz uchun to'liq yoziladi.
  (PRD ning darsdagi birinchi ko'rinishi — 8-Modul ta'rifi so'zma-so'z, bir marta; T-036. Darsda «talab» so'zi faqat shu yerda.)
- Chap — «Dars oxirida: Mentor tekshiruvi va to'liq PRD» (App.jsx osti, P-015) + vizual: bo'sh sahifaga kulrang qatorlar 0.4 s oraliqda yoziladi (matnsiz, bo'lim nomlarisiz),
  oxirida sahifa tepasiga yashil muhr «Qabul» bir lahza kattalashib tushadi.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · To'rt katakli varaqdan to'liq PRD ga o'tasiz · `PRD`
  - 02 · Nimani qurmaslikni ham yozishni bilib olasiz · `qilmaymiz`
  - 03 · Amazon hujjatni qachon yozishini ko'rasiz · `voqea`
  - 04 · PRD yozib, uni uch savol bilan tekshirasiz · `tekshiruv`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada atama yo'q (T-011); reja bo'limlar sonini aytmaydi — 2-ekran bashorati shu son haqida (P-015).

## 2 · To'rt katakdan yetti bo'limga  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · to'liq PRD
- Sarlavha: **To'rt katakka yana qaysi bo'limlar qo'shiladi?** (46) — to'rt katak noto'g'ri emas, final loyihaga to'ldiriladi (05-FILTR 4)
- Mentor: Varaqni o'qib, qurishni boshlagan odam beradigan savollarni birma-bir bosing.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **To'rt katakka yana nechta bo'lim kerak?** · 1 · 2 · 3 —
  tanlangach ixcham qator «Taxminingiz: N» natijagacha turadi; savol-tugmalar shundan so'ng yoqiladi.
- Vizual (keng; SABOQ 21 — telefon chapda, sahifa o'ngda):
  - **chapda — telefon** «Maydon Jamoa» (e'lon holati).
  - **o'ngda — sahifa, to'rt katak rejimida** (8-Modul varag'i, har katak ustida kulrang savoli): Muammo — muammo gapi · Kim — tashkilotchi va o'yinchilar · Yechim — yechim gapi · O'lchov — haftada to'lgan o'yinlar.
    Sahifa ostida uch savol-tugma (faqat joriysi yoqilgan, halqada): «Bu muammo kimda bo'lgan?» · «Birinchi nimani quramiz?» · «Nimani qurmaymiz?»
- **Harakat → Vizual o'zgarish:**
  1. «Bu muammo kimda bo'lgan?» → sahifa bir ustunga yoyiladi, Muammo ostiga yangi bo'lim **Dalil** sirg'alib kiradi (A-6 matni, sonlar «4 tasida», «4 tasi» bir lahza ajraladi; ostida kulrang qator
     «10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.»). Telefon **muammo** holatiga o'tadi: Telegram guruhi, «Kim keladi?», «+» javoblar boshqa xabarlar ostida qoladi.
  2. «Birinchi nimani quramiz?» → Yechim ostiga **Uchta asosiy funksiya** kiradi — uch qator navbat bilan: O'yin e'loni va qo'shilish · O'yin kuni tasdiq · Maydon pulini bo'lishish (qoralama).
     Telefon **e'lon** holatiga qaytadi; «Qo'shilaman» bir marta o'zi bosiladi, «8 / 10» silliq «9 / 10» ga o'tadi (birinchi funksiya namoyishi).
  3. «Nimani qurmaymiz?» → funksiyalar ostiga **Qilmaymiz / Keyin** kiradi — ikki ustun, ichi bo'sh uzuq chiziqli (4-ekranda yoziladi); telefon ostida kulrang qator «chat yo'q — Telegram bor».
  Uchinchi bo'limdan so'ng katak nomlari almashadi: «Kim» → **Kim uchun**, «O'lchov» → **Bosh raqam** (yangi nom bir lahza accent);
  bo'limlar raqam oladi 1–7, sahifa ostida yorliq **to'liq PRD** paydo bo'ladi (atama — misoldan so'ng),
  `QIzoh`: To'rt katakka uch bo'lim qo'shildi — yetti bo'limli bu sahifa to'liq PRD deyiladi. (82)
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: N · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bizda to'liq PRD — g'oyaning yetti bo'limli bir sahifasi. (51)
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Sahifa ostidagi yoqilgan savolni bosing — sahifada nima qo'shilishini ko'ring.
- Tugma (pastki): Savollarni bosing (N/3) → Davom etish · `tugadi`: savol-tugmalar yo'qoladi, telefon va sahifa butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy savol-tugma (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: 8-Modulda (basseyn ilovasi) PRD to'rt katak edi — eslating. «O'lchov» katagi endi bosh raqam: mahsulot o'z ishini bajarganini ko'rsatadigan bitta raqam.
  Uchinchi funksiya hozircha qoralama — 8-ekranda tekshiruv uni o'zgartiradi; buni oldindan aytmang.

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · dalil
- Savol: **To'garaklar PRD sida Dalil bo'limiga qaysi qator yoziladi?** (8 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — Mahallada yaqinda 2 ta yangi to'garak ochildi (45)
  - ✔ B — 5 kishidan 3 tasi to'garak topishda qiynalgan (45)
  - C — O'smirlar xaritani ishlatsa kerak, deb o'ylayman (48)
  - D — To'garaklar xaritasi va jadvalini ko'rsatadi (44)
- To'g'ri izohi: Bu PRD da dalil — intervyudan sanoq: nechta odamdan nechtasida muammo bo'lgan.
- Xato izohlari: A — To'garaklar haqida rost gap, lekin kim qiynalgani yo'q. (55) · C — Bu taxmin — intervyuda bo'lib o'tgan ish emas. (46) ·
  D — Bu — yechim bo'limining qatori. (31) · (umumiy) Dalil intervyudan keladi: unda nima sanalgan? (45)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan so'ng; SABOQ 4): savol ostida kichik sahifa bo'lagi **Mahalla to'garaklari** — 1 Muammo «qaysi to'garak qayerda va qachon — bilinmaydi» ·
  2 Dalil — accent, ichida to'g'ri variant matni.
- Izoh (MD): raqam ikki variantda (A, B) — faqat to'g'rida emas; A — rost fakt, lekin muammo sanog'i emas (S-004); D — boshqa bo'lim qatori (2-ekran qoidasi). Sanoq — tayanch 1.3 (to'garak: 3 / 5).

## 4 · Qilmaymiz va Keyin  ← QTushuncha (ketma-ket, 4 ish; SABOQ 9/13)
- Eyebrow: Tushuncha · Qilmaymiz / Keyin
- Sarlavha: **Qurilmaydigan ish ham PRD ga yoziladimi?** (40)
- Mentor: Mentor o'ylagan to'rtta qo'shimcha ishni birma-bir joylang: yozuvlarda sababi bor ishni «Keyin»ga, sababi yo'q ishni «Qilmaymiz»ga.
- Qadam chiplari (`QQadamlar`, ixcham; joriysi accent, o'tgani ✓): 1 Chat · 2 Eslatma · 3 Reyting · 4 Ro'yxat
- **Chapda — sahifa** (to'liq rejim, 5 va 6-bo'limlar ochiq, qolganlari bir qatorga yig'ilgan): 6-bo'lim **Qilmaymiz / Keyin** — ikki quti yonma-yon, 9-Modul MVP doskasi qutilari ko'rinishida (yorliq bilan, «N ta»).
- **O'ngda — bitta katta ish kartasi** (navbat bilan chiqadi) va ostida ikki tugma: «Qilmaymiz» · «Keyin». Ishlar va to'g'ri joyi (yozuvlar — tayanch 1.3):
  1. **Chat** → Qilmaymiz — Telegram allaqachon bor: qiyinchilik chat yo'qligida emas, kim kelishi bilinmasligida. (86; 05-FILTR 7)
  2. **O'yindan oldin eslatma** → Keyin — 2-yozuv: «ikki kishi oxirgi daqiqada kelmadi». (46)
  3. **Reyting va baho** → Qilmaymiz — O'n yozuvda baho haqida gap yo'q. (33)
  4. **Ro'yxat o'zi yangilanadi** → Keyin — 5-yozuv: «kim kelishini bilmadi» — ro'yxat ochiq turganda ham yangi qo'shilganlar ko'rinsin. (92; ehtiyoj — yozuvdan, «o'zi yangilanadi» — yechim, 05-FILTR 8)
  Sabab qatori — joylangandan so'ng, karta ostida (kulrang, bitta qator); u ishni «Qilmaymiz»ga yoki «Keyin»ga kiritgan yozuvni ko'rsatadi.
- `QXato` (≤60; javobni aytmaydi): «Keyin» tanlandi, kerak «Qilmaymiz»: O'n yozuvda bunga sabab topilmadi. (34) · «Qilmaymiz» tanlandi, kerak «Keyin»: Yozuvlarda bunga sabab bor — o'chirmang, navbatini suring. (58)
- Yordam (birinchi xatodan so'ng, P-033): «Keyin» — o'chirilmaydi, navbati suriladi: yozuvlarda sababi bor. «Qilmaymiz» — yozuvlarda sababi topilmagan ish.
- **Harakat → Vizual o'zgarish:** tugma → ish kartasi kichrayib tanlangan qutiga uchadi, quti hisoblagichi «N ta» sanab o'sadi, ostida sabab qatori ~1 s yashil; xato → karta silkinadi, bitta `QXato`.
  4/4 dan so'ng 5-bo'lim («Uchta asosiy funksiya») bir lahza accent bo'ladi va yonida `QIzoh`: Uchta asosiy funksiya — 9-Moduldagi «Qilamiz» qutisi: busiz muammo hal bo'lmaydi. (81)
- Natija (`tugadi`): ish kartasi va tugmalar yo'qoladi; sahifa butun enga — 6-bo'lim: Qilmaymiz 2 · Keyin 2.
- Xulosa: Bu misolda qo'shimcha ishlardan «Keyin»ga yozuvlarda sababi borlari, «Qilmaymiz»ga sababsizlari tushdi. (103)
- Tugma (pastki): Ishlarni joylang (N/4) → Davom etish
- Keyingi bosiladigan joy: joriy ish kartasi ostidagi ikki tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Clear Limits! (to'rttasi birinchi urinishda).
- O'qituvchi eslatmasi: 9-Modulda o'quvchilar aynan shu uch qutini to'ldirgan (Qilamiz · Keyin · Qilmaymiz) — PRD da ular 5 va 6-bo'lim. Sinfdan so'rang: «Qilmaymiz» yozilmasa, quradigan odam chat qo'shadimi?
  (8-Modul qoidasi: bo'sh qolgan joyni quradigan odam o'z taxmini bilan to'ldiradi.)
  Bu qoida qo'shimcha ishlar uchun: kirish, xavfsizlik kabi zarur ishlar intervyuda aytilmasa ham quriladi (05-FILTR 6).

## 5 · 2-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · Qilmaymiz yoki Keyin
- Savol: **Uy vazifasi ilovasi: intervyularda reyting haqida hech kim gapirmadi. Qayerga yoziladi?** (11 so'z) · savol ustida yorliq yo'q
  - A — Asosiy funksiyalarga — u ilovani qiziq qiladi (45)
  - B — «Keyin»ga — kelajakda kerak bo'lib qolishi mumkin (49)
  - ✔ C — «Qilmaymiz»ga — uni qurish uchun sabab topilmadi (48)
  - D — Bosh raqamga — reytingni har hafta sanasa bo'ladi (49)
- To'g'ri izohi: Yozuvlarda sababi yo'q ish «Qilmaymiz»ga yoziladi.
- Xato izohlari: A — Asosiy funksiyaga busiz muammo hal bo'lmaydigan ish kiradi. (59) · B — «Keyin»ga yozuvlarda sababi bor ish tushadi. (44) ·
  D — Bosh raqam mahsulot o'z ishini bajarganini sanaydi. (51) · (umumiy) Yozuvlarda bu ishga sabab bormi — shuni eslang. (47)
- Javob topilgach (kichik, savol ostida): **Sinf uy vazifalari** sahifasining 6-bo'limi — «Qilmaymiz» qutisiga «reyting» chipi uchib tushadi.
- Izoh (MD): qo'shtirnoq ikki variantda (B, C), tire to'rtalasida (belgi faqat to'g'rida emas); har noto'g'ri variant dars qoidasi bo'yicha noto'g'ri (4-ekran, 9-Modul qutilari — S-004).

## 6 · Amazon  ← QVoqea (PM keys K16; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Amazon yangi mahsulotni nimadan boshlaydi?** (42)
- Nuqtalar (3) · yorliq **Amazon · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Amazon** (o'z rangida) — juda katta internet-magazin. Logotip yo'q. (5-Modul `m4-12` izohi bilan bir.)
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; SABOQ 8). Sahnada faqat bosqich nomi va jonli maket; slayd ichida takror matn yo'q.
- Sahna (`AmazonSahna`, chizilgan CSS/SVG; bosqichga qarab o'zgaradi; bankda yo'q narsa chizilmaydi — asoschi, son, mahsulot nomi yo'q):
  - 1/3 **Press-reliz** — Mentor: Amazon'da yangi mahsulot uchun bitta matn yoziladi — press-reliz. Press-reliz — kompaniya yangi mahsulot chiqqani haqida yozadigan xabar.
    · sahna: chapda brauzer oynasi «Amazon» (nom o'z rangida), sahifada kulrang joy «mahsulot hali yo'q»; o'ngda varaq «Press-reliz» — kulrang qatorlar yozila boshlaydi; pastda kichik kod oynasi — yopiq (javobni ochmaydi, P-053 `pre` kadr).
    · bashorat (sahna ostida, bitta qator; S-015 — bir o'lchov, kechdan erta tomon): **Bu press-reliz qachon yoziladi?** · Kod tugagach · Kod bilan birga · ✔ Koddan oldin
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi.
  - 2/3 **Go'yo chiqqandek** — Mentor: Press-reliz go'yo mahsulot allaqachon chiqqandek yoziladi, kod esa hali yo'q. Press-reliz hech kimni qiziqtirmasa, mahsulot qilinmaydi.
    · sahna: varaq qatorlari yozilib bo'ladi (sarlavha qatori yashil «chiqdi» belgisi bilan); kod oynasi ochiladi — ichi bo'sh, yorliq «0 qator»; varaq oldida bir guruh siluet (bir-biriga yopishgan, sanab bo'lmaydigan — son emas, 05-FILTR 16) o'qiydi va birga kulrang tortadi (qiziqmadi);
      kod oynasi ustiga yorliq «qilinmaydi» tushadi, kod oynasi yopiladi — bir qator ham yozilmagan.
  - 3/3 **Tor boshlash** — Mentor: Amazon o'zi ham tor boshlagan: 1995-yilda u faqat kitob sotgan.
    · sahna: brauzer oynasi «Amazon · 1995» — sahifada faqat kitob javonlari (chizilgan kitob qatorlari, har birida kitob muqovasi shakli), boshqa bo'lim yo'q.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: koddan oldin» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan so'ng, pastda, yashil): Bu voqeada hujjat koddan oldin yozildi, mahsulot esa tor boshlandi — faqat kitobdan. (84)
- Tugma (pastki): Keyingi bosqich (N/3) → Davom etish
- O'qituvchi eslatmasi: Amazon 5-Modulning «Ilova nimani yozib qoladi?» darsida ham bo'lgan — eslating; bugungi savol boshqa: PRD qachon yoziladi va nima uchun unda «Qilmaymiz» bor.
  Sinfdan so'rang: Amazon faqat kitobdan boshlagan — sizning PRD ingizda «Qilmaymiz»ga nima tushadi? Bankdan tashqari raqam, yil va voqea qo'shmang.
  Press-reliz — PRD emas: ikkalasi ham koddan oldin yoziladigan hujjat, umumiy joyi shu (05-FILTR 15).
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K16 (bank: raqamsiz; 1995 — yil) · tayanch 5 (o'zbekcha matn). «Press-reliz — … xabar» — atama izohi (bizniki, bankda yo'q). «Kitob sotgan» — 5-Modul «faqat kitob sotardi».

## 7 · 3-savol  ← QTest (✔ A, `correctIdx 0`; Amazon qoidasi — o'quvchining o'z PRD si)
- Eyebrow: Tekshiruv · Amazon'dagidek
- Savol: **Amazon'dagidek hujjat koddan oldin bo'lsa, PRD ni qachon yozasiz?** (9 so'z; press-reliz — PRD emas, 05-FILTR 15) · savol ustida yorliq yo'q
  - ✔ A — Kod yozishdan oldin, nimani qurishni hal qilib (46)
  - B — Ilova tayyor bo'lgach, nima qurilganini ko'rib (46)
  - C — Kod bilan birga, har kuni bittadan bo'limini (44)
  - D — Birinchi foydalanuvchi ilovani ochgan kuni (42)
- To'g'ri izohi: Amazon'da hujjat koddan oldin yoziladi: nima qurilishini u hal qiladi.
- Xato izohlari: B — Ilova tayyor bo'lsa, nima qurilishi allaqachon hal bo'lgan. (59) · C — Amazon'da press-reliz yozilganda kod qay holatda edi? (53) ·
  D — Foydalanuvchi ochganda ilova allaqachon qurilgan bo'ladi. (57) · (umumiy) Press-reliz kod bilan qaysi tartibda edi? (41)
- Izoh (MD): vergul to'rtala variantda; «kod» uch variantda (kalit so'z faqat to'g'rida emas); distraktorlar — kechroq vaqt, bank faktiga zid emas, bank tartibiga zid (S-004).

## 8 · Uch savol  ← QTushuncha (markaziy; ketma-ket, 3 qadam)
- Eyebrow: Tushuncha · Mentor tekshiruvi
- Sarlavha: **PRD ni qurishdan oldin qanday tekshirasiz?** (42)
- Mentor: Mentor misolidagi PRD ni uchta savol bilan birma-bir tekshiring.
  (Birinchi harakat — bashorat; yo'rig'i `QBashorat` yorlig'ida.)
- Bashorat (ballsiz; S-015 — bir o'lchov, o'sish tartibida): **Mentor PRD si uch savoldan qanday o'tadi?** · Tuzatishsiz · Bitta tuzatish bilan · Uch tuzatish bilan —
  tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi.
- Qadam chiplari (`QQadamlar`): 1 Dalil bormi? · 2 Bajariladimi? · 3 Bosh raqam sanaladimi?
- **Chapda — telefon** «Maydon Jamoa» (e'lon holati) · **o'rtada — sahifa** (to'liq rejim, qoralama: 5-bo'limning uchinchi funksiyasi — Maydon pulini bo'lishish) ·
  **o'ngda — bitta savol kartasi** (navbat bilan): savol · «Nimaga qarang» bir qatori · ikki tugma «Ha» · «Yo'q». Joriy savolga tegishli bo'lim accent halqada.
  1. **Dalil bormi?** — Nimaga qarang: Dalil yozuvlardanmi va unda sanoq bormi — nechta odamdan nechtasi? → 2-bo'lim accent, sonlar ajraladi. To'g'ri — «Ha».
  2. **Bajariladimi?** — Nimaga qarang: har funksiya muammo gapiga xizmat qiladimi va uchalasi shu modulda quriladimi? (05-FILTR 9) → 5-bo'lim accent; har funksiya yonida kulrang qayerdan kelgani:
     «muammo gapidan: yetarli odam» · «muammo gapidan: kim aniq keladi» · «oltita g'oyadan biri: maydon pulini bo'lishish». Bu qadamda o'quvchi sig'maydigan funksiyani bosadi (tugmalar o'rniga).
     To'g'ri — **Maydon pulini bo'lishish**: u 6-bo'limning «Keyin» qutisiga uchadi, yonida dalil-chip «9-Modul intervyusi: 5 kishidan 1 tasi «pulni bo'lishish qiyin»» (sababi bor — o'chirilmaydi);
     bo'shagan joyga **Chiqish va navbat** sirg'alib kiradi, yonida «muammo gapidan: yetarli odam — chiqqan o'rniga navbatdagi kiradi» (05-FILTR 10); 5-bo'lim ustida bir lahza accent muhr «Tuzatish: Uchta asosiy funksiya», so'ng ✓.
  3. **Bosh raqam sanaladimi?** — Nimaga qarang: bu raqamni har hafta sanab bo'ladimi? → 7-bo'lim accent; telefonda «Qo'shilaman» ikki marta o'zi bosiladi: «8 / 10» → «9 / 10» → «10 / 10 · To'ldi»,
     telefon ostida hisoblagich «Bu hafta to'lgan o'yinlar: 1» sanab o'sadi, ostida kulrang qator: Bu raqam muammo gapiga qaraydi: o'yin kerakli odam soniga yetdimi? (66) To'g'ri — «Ha».
- `QXato` (≤60): 1 «Yo'q» — Dalil bo'limini qayta o'qing: unda nechta odamdan nechtasi? (59) · 2 boshqa funksiya bosildi — Bu funksiya muammo gapidan keladi — boshqasini qarang. (54) ·
  3 «Yo'q» — Telefonga qarang: «10 / 10» — bitta to'lgan o'yin. (50)
- **Harakat → Vizual o'zgarish:** savol kartasidagi tugma (2-qadamda — funksiya qatori) → tegishli bo'lim accent bo'ladi, sahifa va telefon yuqoridagidek o'zgaradi, qadam ✓, keyingi savol kartasi kiradi.
  3/3 dan so'ng sahifa tepasiga yashil muhr **«Qabul»** bir lahza kattalashib tushadi, ostida kulrang qator: Qabul — bugungi tekshiruv natijasi: PRD keyin ham yangilanadi. (62); sahifa ostida yorliq **Mentor tekshiruvi** paydo bo'ladi (atama — misoldan so'ng) va
  `QIzoh`: PRD ni uch savol bilan ko'rish — Mentor tekshiruvi deyiladi. Javob — qabul yoki tuzatish. (89)
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: bitta tuzatish bilan» yoki «Taxminingiz to'g'ri chiqdi».
- Natija (`tugadi`): savol kartasi va qadam chiplari yo'qoladi; telefon va sahifa butun enga (5-bo'limda Chiqish va navbat, 6-bo'lim «Keyin»ida uchta ish, tepada «Qabul»).
- Xulosa: Mentor tekshiruvi — uch savol: dalil bormi, bajariladimi, bosh raqam sanaladimi. (80)
- Tugma (pastki): Savollarni bering (N/3) → Davom etish · vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → savol kartasi tugmalari (2-qadamda — uch funksiya qatori halqada) → «Davom etish».
- O'qituvchi eslatmasi: Dastur bu darsni «Mentor g'oyani tasdiqlaydi» deb ataydi — tekshiruv shu uch savol, javobi «qabul» yoki «tuzatish» (o'quvchi matnida «tasdiq» faqat «O'yin kuni tasdiq» funksiyasida — 9.41).
  Tuzatish — yomon belgi emas: Mentor PRD si ham bitta tuzatishdan so'ng qabul qilindi.
  «Bajariladimi?» — saralashdagi savol bilan bir ildiz: u yerda g'oya, bu yerda uchta funksiya. Maydon pulini bo'lishish ikki mezondan ham o'tmaydi: muammo gapidan kelmaydi (boshqa g'oya) va to'lov ishi modulga sig'maydi.

## 9 · O'z PRD ingiz  ← QMustaqil (USTAXONA — ketma-ket karta, 7 bo'lim; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Final g'oyangiz uchun yetti bo'limni yozing.** (44)
- Mentor: Muammo va dalil o'tgan darsdan keldi — ularni o'qib chiqing va qolgan beshta bo'limni bittalab yozing.
  (`pm-m9d4-final` yo'q bo'lsa — Mentor: Yetti bo'limni bittalab yozing: avval muammo, so'ng dalil.)
- **Tepada — ixcham sahifa «PRD · n / 7»** (bo'lim nomlari, yozilgani ✓; ramka «1 sahifa» to'lib boradi) — bitta qator, tahrirlanmaydi (SABOQ 17).
- **Markazda — bitta katta bo'lim kartasi (joriy):** bo'lim nomi · kulrang savoli · maydon · belgilar hisoblagichi · «Saqlash» o'ngda (187). Bo'limlar va maydonlar (placeholder qisqa, tayyor javobsiz — §32):
  1. **Muammo** — oldindan: `pm-m9d4-final.muammoGapi` (tahrirlasa bo'ladi); yo'q bo'lsa placeholder «Kim nimadan qiynaladi?» · ≤ 160 belgi
  2. **Dalil** — oldindan: 4-darsdagi sanoq, final g'oya bo'yicha («{yozuvlarSoni} intervyu. Muammo takrorlandi: {takror}. Harakat belgisi: {belgi}.» — TAYANCHGA SAVOL 6); yo'q bo'lsa placeholder «Nechta odamdan nechtasida?» · ≤ 200
  3. **Kim uchun** — «Aynan qanday odamlar?» · ≤ 140
  4. **Yechim** — «Mahsulot nima qiladi? Bir gap.» · ≤ 160
  5. **Uchta asosiy funksiya** — uch qisqa maydon «1-funksiya nomi» · «2-funksiya nomi» · «3-funksiya nomi» · har biri ≤ 40
  6. **Qilmaymiz / Keyin** — «Qilmaymiz» — bitta maydon «Nimani qurmaysiz?» (≤ 120) · «Keyin» — ro'yxat: 1–3 qisqa qator «Keyinga qoldirilgan ish» (har biri ≤ 40; «+ Yana ish»), har ish alohida saqlanadi (6-dars ularni alohida karta qiladi — 06-FILTR 13)
  7. **Bosh raqam** — «Qaysi bitta raqam mahsulot ishini ko'rsatadi?» · ≤ 120 (Yordam: «Mentor misolida: haftada to'lgan o'yinlar» — «haftada» Mentorniki, 05-FILTR 13)
  Uzunlik chegarasi bilan yetti bo'lim bir sahifaga sig'adi (dars nomi savoliga javob — ramka to'lib boradi, toshmaydi). Chegaralar — maket qo'riqchisi, qoida emas: xato matni yo'q, faqat hisoblagich;
  aniq qiymatlar qurishda 1280×800 va 393 px suratlarida o'lchab qo'yiladi (05-FILTR 19, 20).
- Tekshiruv (`QXato`, ≤60; javob maydon ostida; yumshoq — ikkinchi «Saqlash» bilan o'tadi, «bo'sh» dan tashqari):
  - maydon bo'sh (bloklaydi): Bo'lim bo'sh — quradigan odam uni taxmin qiladi. (48)
  - Muammoda xohish («xohlaydi», «xohlardi», «yoqadi», «yaxshi ko'radi», «bo'lsa yaxshi»): Bu xohish — odam nimadan qiynalgani ko'rinmaydi. (48)
  - Dalilda raqam yo'q: Dalilda son bo'lsin: nechta odamdan nechtasi. (45)
  - Kim uchun qatori butunicha «hamma», «odamlar», «hamma odamlar», «barcha odamlar», «har kim» yoki «hamma uchun»: Kim uchun aniqroq bo'lsin: qanday odamlar? (42)
  - Yechim ≤ 2 so'z va unda «ilova», «sayt», «bot» yoki «AI» bor: Mahsulot aynan nima qiladi? Bir gap bilan yozing. (49)
  - Funksiyalardan biri bo'sh (bloklaydi): Uchta funksiyani ham yozing. (28) · ikki funksiya bir xil: Bu funksiya yuqorida bor — boshqasini yozing. (45)
  - Bosh raqamda «yoqadi», «mamnun», «qulay», «chiroyli», «yaxshi»: Buni sanab bo'lmaydi — nima sanalishini yozing. (47)
  - Yorliq (yumshoq xatodan so'ng): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (bo'limga qarab bitta qator — Mentor misolidan, A-6 jadvali): masalan 7-bo'limda «Mentor misolida: Haftada to'lgan o'yinlar — kerakli odam soniga yetgan e'lonlar soni.»
- **Harakat → Vizual o'zgarish:** «Saqlash» → karta kichrayib tepadagi ixcham sahifaga uchadi (bo'lim nomi yonida ~1 s yashil ✓), hisoblagich n / 7 sanab o'sadi, ramka bir qadam o'sadi, pastdan keyingi bo'lim kartasi kiradi.
  Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. 7/7 da karta yopiladi; sahifa to'liq rejimda butun enga — yetti bo'lim, har biri ✎ bilan (bosilsa o'sha bo'lim katta karta bo'lib ochiladi — SABOQ 29).
- Xulosa: PRD ingiz yozildi: yetti bo'lim — bir sahifada. (47)
- Tugma (pastki): Yana N ta bo'lim yozing → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → «Saqlash» (maydon yozilgach halqada).
- Artefakt-strip (U-042): shu ekrandan — «PRD · n/7» (ixcham); 10, 11, 15-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Nishon: Full PRD! (7/7).
- Mentor rejimi: forma o'rniga Mentor misolining to'liq PRD si (8-ekran natijasi). Mentor statistikasi: «Yetti bo'limni yozganlar» · «Dalilida son borlar».
  **KOD:** Mentor ekranida — har o'quvchi PRD si (ism · n / 7; bosilsa yetti bo'lim ochiladi) — TAYANCHGA SAVOL 10.
- O'qituvchi eslatmasi: Taymer yo'q — 20 daqiqadan so'ng 10-ekranga o'ting; ulgurmagan bo'lim uyda yoziladi. Eng ko'p xato — dalilni fikr bilan yozish («hammaga kerak»):
  «Intervyuda nechta odamdan nechtasi aytdi?» deb so'rang. Ikkinchi xato — funksiya o'rniga butun mahsulot nomi: «Bu ish o'yinchiga aynan nima beradi?»

## 10 · Uch savol — o'z PRD ingiz  ← QMustaqil (juftlik + yakka rejim, 3 qadam)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **PRD ingiz uch savoldan o'tadimi?** (32)
- Mentor: Sherigingiz PRD ingizni o'qib, uch savolni beradi — javobni birga belgilang.
  Yakka rejimda: Uch savolni o'zingizga bering va javobini PRD dan toping.
- Qadam chiplari (`QQadamlar`, bitta manba `TEKSHIRUV_SAVOLLAR`): 1 Dalil bormi? · 2 Bajariladimi? · 3 Bosh raqam sanaladimi?
- **Chapda — o'quvchining sahifasi** (to'liq rejim, 9-ekrandan); joriy savolga tegishli bo'lim accent halqada (1 → Dalil · 2 → Uchta asosiy funksiya · 3 → Bosh raqam).
- **O'ngda — savol kartasi:** savol · «Nimaga qarang» bir qatori · ikki tugma «Ha» · «Yo'q — tuzataman»:
  1. Dalil bormi? — Nimaga qarang: Dalil yozuvlardanmi va unda sanoq bormi — nechta odamdan nechtasi?
  2. Bajariladimi? — Nimaga qarang: har funksiya muammo gapiga xizmat qiladimi va uchalasi shu modulda quriladimi?
  3. Bosh raqam sanaladimi? — Nimaga qarang: bu raqamni muntazam — har hafta yoki har oy — sanab bera olasizmi?
- «Yo'q — tuzataman» → o'sha bo'lim katta karta bo'lib ochiladi (9-ekran maydoni, tekshiruvlari bilan) + «Saqlash»; saqlangach savol qaytadi va «Ha» faol.
  Hozir tuzatib bo'lmasa (masalan dalil uchun yana intervyu kerak) — kartada kichik tugma «Uyda tuzataman»: bo'lim «tuzatish» holatida qoladi.
- **Harakat → Vizual o'zgarish:** «Ha» → bo'lim yonida yashil ✓, qadam ✓, keyingi savol kartasi kiradi · «Yo'q — tuzataman» → bo'lim kartasi chiqadi, saqlangach sahifaga uchib qaytadi (~1 s yashil) ·
  3/3 dan so'ng sahifa tepasiga muhr tushadi: yashil **«Qabul»** (juftlikda yoki jonli darsda Mentor ko'rganda) · yakka rejimda — yashil **«Tuzatish topilmadi»** · yoki accent **«Tuzatish: {bo'lim}»** («Uyda tuzataman» bosilgan bo'lsa).
  `pm-m9d4-final.vaqtincha` true bo'lsa — «Dalil bormi?» savolida «Ha» o'chiq, natija «Tuzatish: Dalil» (yozuvlar 5 + 5 ga yetkaziladi; 05-FILTR 1).
- Xulosa (tanlovdan, P-046):
  - tuzatishsiz: Uch savolga ham «ha» — PRD ingiz qabul qilindi. (47) · yakka rejimda: Uch savolga ham «ha» — o'z tekshiruvingizda tuzatish topilmadi. (63)
  - darsda tuzatilgan: Mentor misolidagidek: tuzatishdan so'ng PRD ingiz qabul qilindi. (64)
  - «Uyda tuzataman»: Tuzatish: {bo'lim} bo'limi. Uni uyga vazifada tuzatasiz. (56) — `{bo'lim}` o'rnida bo'lim nomi; eng uzuni «Uchta asosiy funksiya» bilan 70 belgi
- Saqlash: `pm-m9d5-prd.tekshiruv` = `'qabul'` | `'tuzatish'` va `pm-m9d5-prd.tuzatish` = bo'lim id (`'dalil'`, `'funksiyalar'`, `'boshRaqam'`, …) yoki `null` (9.41; TAYANCHGA SAVOL 7 — yopildi).
- Tugma (pastki): Uch savolni bering (N/3) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy savol kartasidagi «Ha» / «Yo'q — tuzataman» → (tuzatishda) maydon → «Saqlash» → «Davom etish».
- Nishon: Three Questions! (uch savol javoblanganda).
- Jonli darsda: o'qituvchi — Mentor. **KOD:** Mentor ekranida har o'quvchi PRD si va tekshiruv natijasi («Qabul» / «Tuzatish: …»); o'qituvchi 2–3 o'quvchining PRD sini sinf bilan
  uch savol orqali tekshiradi (ekranga chiqarib), qolganlar juftlikda. Mentor statistikasi: «Qabul» · «Tuzatish» (qaysi bo'lim bo'yicha).
- O'qituvchi eslatmasi: Juftlikda sherik o'z ekranida emas, o'quvchining ekranida savol beradi — 4 daqiqadan so'ng «O'rin almashing» deng. «Tuzatish» — yaxshi natija: muammo qurishdan oldin topildi.

## 11 · PRD.md  ← QKod (VS Code; kod oynasi yo'q — hujjat; PM-082 c, d, e)
- Eyebrow: VS Code · PRD.md
- Sarlavha: **PRD ni koddan oldin faylga yozamiz.** (35) — PM-082(a) «…digan kod yozamiz» oilasi emas: bu ekranda kod yo'q, hujjat (tayanch 4; TAYANCHGA SAVOL 11)
- Mentor: PRD — kod emas, hujjat: uni VS Code'da `PRD.md` fayliga yozasiz. Bo'lim sarlavhalarini qo'lda terasiz — shunda Markdown yozuvi esda qoladi.
- Darvoza-mashq (PM-082 c/e, fayldan oldin, ballsiz): **Markdown'da bo'lim sarlavhasi qaysi qator bo'ladi?** — uch tanlov:
  ✔ «`## Muammo`» · «`// Muammo`» · «`Muammo:`»
  - xato (`//`): `//` — JavaScript izohi; Markdown'da u oddiy matn. (50) · xato (`Muammo:`): Bu oddiy qator bo'lib chiqadi, sarlavha emas. (45)
  - to'g'ri tanlovdan so'ng bir qator: Markdown — matnni belgilar bilan sarlavha va ro'yxatga ajratib yozish usuli; 8-Modulda `SKILL.md` ham shunday yozilgan.
- Chap (vazifa, 3 band; bosiladigan katakcha emas):
  1. Kompyuteringizda mahsulotingiz nomi bilan papka oching va VS Code'da unda `PRD.md` faylini yarating.
  2. Yetti bo'limni `## ` bilan boshlang, har sarlavha ostiga — PRD ingizdagi matn; funksiyalar `- ` bilan ro'yxat bo'ladi.
  3. Ko'rinishni oching: Ctrl+Shift+V (Mac'da Cmd+Shift+V) — yetti sarlavha ko'rinsin.
- Yordam: Bitta bo'limdan boshlang: `## Muammo`, ostiga muammo gapingiz. Sarlavhadan oldin bo'sh qator qoldiring. Ko'rinish yonma-yon kerak bo'lsa — Ctrl+K, so'ng V.
  (VS Code tugmalari — rasmiy hujjat: code.visualstudio.com/docs/languages/markdown, 06.10 o'qildi. Papka ochish va yangi fayl menyu nomlari yozilmaydi — umumiy so'z, P-028.)
- O'ng: `PRD.md` namunasi — o'quvchining o'z PRD sidan yig'ilgan (`pm-m9d5-prd`; yo'q bo'lsa — Mentor misoli). Sarlavha va ro'yxat belgilari (`#`, `##`, `- `) nusxalanmaydi (`user-select: none`);
  har bo'lim matni yonida kichik «Nusxalash» — o'quvchining o'zi yozgan matni, kod emas (PM-082 ISTISNO: kod bo'lmagan uzun qiymat; TAYANCHGA SAVOL 11). Preview-panel yo'q (PM-082 b) — ko'rinishni o'quvchi o'z VS Code'ida ochadi.
- Namuna (Mentor misoli; o'quvchida — o'z matni):
```markdown
# Maydon Jamoa — PRD
Mentor tekshiruvi: qabul

## Muammo
O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.

## Dalil
10 intervyu. Jamoa yig'ish bo'yicha 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan; 5 tadan 4 tasi birinchi versiyani sinab ko'rishga kun belgilagan (harakat belgisi).

## Kim uchun
Mahalladagi mini-futbol o'yinchilari: tashkilotchi — o'yinni e'lon qiladi, o'yinchi — o'yinga qo'shiladi.

## Yechim
Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.

## Uchta asosiy funksiya
- O'yin e'loni va qo'shilish
- O'yin kuni tasdiq
- Chiqish va navbat

## Qilmaymiz / Keyin
Qilmaymiz: chat (Telegram bor), reyting va baho.
Keyin: o'yindan oldin eslatma, ro'yxat o'zi yangilanadi, maydon pulini bo'lishish.

## Bosh raqam
Haftada to'lgan o'yinlar — kerakli odam soniga yetgan e'lonlar soni.
```
- **Harakat → Vizual o'zgarish:** darvozada to'g'ri tanlov → o'ngdagi namunada yetti `##` belgisi navbat bilan bir lahza ajraladi (sarlavha rangida) va «Bajardim» tugmasi ochiladi;
  «Bajardim» → namunadagi yetti sarlavha yonida navbat bilan ✓ (preview emas — ro'yxat belgisi), artefakt-strip «PRD · 7/7 · PRD.md ✓».
- Tugma (bitta halol — PM-082 e, KORPUS §19): ✓ PRD.md yozildi — yetti sarlavha ko'rindi · qulf-holat: Avval savolni yeching
- Hammasi bajarilgach (yashil): PRD ingiz fayl bo'ldi: yetti bo'lim — kod yozilishidan oldin. (61)
- Nishon: Doc First! («Bajardim» bosilganda).
- O'qituvchi eslatmasi: 10 daqiqa. `PRD.md` 7-darsda o'quvchi repo'si ochilganda repo ildiziga, `README.md` yoniga qo'shiladi (9.45) — papkani keyin topa oladigan joyga saqlashni ayting. VS Code'da ko'rinish ochilmasa, fayl kengaytmasini tekshiring: `.md` bo'lishi kerak.
  Kod oynasi qoralamasi yo'q (`pm-m9d5-code` kerak emas — fayl o'quvchining kompyuterida).

## 12 · Yakuniy savol  ← QTest (✔ D, `correctIdx 3`; Mentor tekshiruvi javobi)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Sherigingiz PRD sida Dalil bo'limi bo'sh. Tekshiruv javobi qanday?** (9 so'z) · savol ustida yorliq yo'q
  - A — Qabul — qolgan olti bo'lim yozilgan (35)
  - B — Tuzatish — PRD ni boshidan qayta yozish (39)
  - C — Qabul — dalilni kod yozilgach qo'shadi (38)
  - ✔ D — Tuzatish — Dalil bo'limini to'ldirish (37)
- To'g'ri izohi: «Dalil bormi?» savoliga javob — yo'q: tuzatish, bo'lim nomi bilan.
- Xato izohlari: A — Qabul uchun uch savolga ham «ha» kerak. (39) · B — Tuzatish butun PRD ni emas, bitta bo'limni aytadi. (50) ·
  C — Amazon'dagidek: hujjat koddan oldin to'liq bo'ladi. (51) · (umumiy) Qaysi savolga «yo'q» chiqdi — shuni eslang. (43)
- Javob topilgach (kichik, savol ostida): ixcham sahifa — Dalil bo'limi `err` fon, tepada accent muhr «Tuzatish: Dalil».
- Izoh (MD): tire to'rtalasida; «Qabul» ikki, «Tuzatish» ikki variantda (S-006 — ha/yo'q hukmlari teng); C — 6-ekran qoidasiga zid (S-004).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Dalil bo'limi · 2 — Qilmaymiz yoki Keyin · 3 — Amazon · 4 — Tekshiruv javobi

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| 8-Moduldagi to'rt katakka qaysi uch bo'lim qo'shildi? | Dalil, uchta asosiy funksiya va «Qilmaymiz / Keyin» |
| Bu PRD ning dalil bo'limiga nima yoziladi? | Intervyudan sanoq: nechta odamdan nechtasida muammo bo'lgan |
| 9-Moduldagi «Qilamiz» qutisi PRD ning qaysi bo'limi bo'ldi? | Uchta asosiy funksiya bo'limi |
| «Keyin» bilan «Qilmaymiz» farqi nima? | «Keyin»ga yozuvlarda sabab bor, «Qilmaymiz»ga yo'q |
| Nega PRD ga qurilmaydigan ish ham yoziladi? | Yozilmasa, quradigan odam uni o'z taxmini bilan qo'shishi mumkin |
| Bosh raqam nimani ko'rsatadi? | Mahsulot o'z ishini bajarganini ko'rsatadigan bitta raqam |
| Mentor tekshiruvida qaysi uch savol beriladi? | Dalil bormi? Bajariladimi? Bosh raqam sanaladimi? |
| Mentor tekshiruvining javobi qanday bo'ladi? | Qabul yoki tuzatish; tuzatishda bo'lim nomi aytiladi |
| Mentor misolida tekshiruvdan so'ng uchinchi funksiya qaysi bo'ldi? | Chiqish va navbat |
| Amazon'da press-reliz qanday yoziladi? | Go'yo mahsulot allaqachon chiqqandek — kod hali yo'q |
| Amazon o'zi qanday boshlagan? | Tor: 1995-yilda faqat kitob sotgan |
| `PRD.md` da bo'lim sarlavhasi qanday yoziladi? | `##` belgisi bilan, masalan `## Dalil` |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (uch bo'lim — 2 · dalil — 2, 3, 9 · «Qilamiz» — 4 · «Keyin»/«Qilmaymiz» — 4, 5 · taxmin — 4 eslatma, 9 xato izohi · bosh raqam — 2 eslatma, 8 · uch savol — 8, 10 ·
  qabul/tuzatish — 8, 10, 12 · Chiqish va navbat — 8 · Amazon — 6 · `##` — 11). S-027: «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Izoh (MD): 5-kartochka javobi «qo'shishi mumkin» (kafolat emas) — 8-Modul `m6-02` «Katak bo'sh qolsa, dasturchi taxmin qiladi» qoidasi bilan bir.

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **PRD ingiz yozildi va tekshirildi.** (33) · tekshiruv `'tuzatish'` bo'lsa (P-046): **PRD ingiz yozildi — bitta bo'lim tuzatiladi.** (44)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): G'oya bir sahifaga yetti bo'lim bo'lib yoziladi va qurishdan oldin uch savol bilan tekshiriladi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Bizda to'liq PRD — g'oyaning yetti bo'limli bir sahifasi.
  - Bu PRD da dalil — intervyudan sanoq: nechta odamdan nechtasi.
  - «Keyin»ga yozuvlarda sababi bor ish, «Qilmaymiz»ga sababsiz ish yoziladi.
  - Mentor tekshiruvi uch savol beradi: dalil bormi, bajariladimi, bosh raqam sanaladimi.
  - Amazon'da hujjat koddan oldin yoziladi.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: uydagilardan biri · Nechta: 1 PRD, 3 savol · Muddat: keyingi darsgacha
  - ① `PRD.md` ni yetti bo'limgacha yakunlang — darsdagi PRD ingizdan.
  - ② PRD ni uydagilardan biriga o'qing: u tushunmagan joyni belgilang. Uch savolni esa o'zingiz qayta bering: dalil bormi, bajariladimi, bosh raqam sanaladimi.
  - ③ Tushunilmagan yoki «yo'q» chiqqan bo'limni tuzating — `PRD.md` da ham, darsdagi PRD ingizda ham.
  - (MD: darsdagi PRD — 9-ekranda ✎ bilan tahrirlanadi; o'quvchi matnida ekran raqami yo'q.)
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Bitiruvgacha nimani qachon qurasiz?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ichki skroll qutisi yo'q (SABOQ 18); «Kim bilan» — HwCard yorlig'i, PRD dagi «Kim uchun» bo'limi bilan to'qnashmaydi (T-015).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Clear Limits!** (4-ekran, to'rttasi birinchi urinishda) — To'rt ishni birinchi urinishda «Qilmaymiz» yoki «Keyin»ga to'g'ri joyladingiz
- **Full PRD!** (9-ekran, 7/7) — Final g'oyangiz uchun yetti bo'limni yozdingiz
- **Three Questions!** (10-ekran, uch savol javoblanganda) — PRD ingizni uch savol bilan tekshirdingiz
- **Doc First!** (11-ekran, «Bajardim») — PRD ni koddan oldin `PRD.md` fayliga yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Dalil — intervyudan sanoq** — 1 Bu PRD da dalil bo'limiga intervyudan sanoq yoziladi. · 2 Har son yonida sharti: nechta odamdan nechtasi. · 3 Fikr va taxmin dalil emas — ular bo'lib o'tgan ish emas.
  — Sinfga savol: Sizning PRD ingizdagi dalil qaysi yozuvlardan keladi?
- **5 · «Qilmaymiz» va «Keyin»** — 1 «Keyin»ga yozuvlarda sababi bor ish tushadi: u o'chirilmaydi, navbati suriladi. · 2 «Qilmaymiz»ga yozuvlarda sababi topilmagan ish tushadi. ·
  3 Yozilmagan ishni quradigan odam o'z taxmini bilan qo'shishi mumkin. — Sinfga savol: Mahsulotingizda nimani qurmaysiz?
- **7 · Amazon — hujjat koddan oldin** — 1 Amazon'da ish press-relizdan boshlanadi — go'yo mahsulot allaqachon chiqqandek. · 2 Press-reliz hech kimni qiziqtirmasa, mahsulot qilinmaydi. ·
  3 Amazon o'zi ham tor boshlagan: 1995-yilda faqat kitob. — Sinfga savol: PRD ingizda nimani qurmasligingiz qaysi bo'limda yozilgan?
- **12 · Qabul yoki tuzatish** — 1 Uch savol: dalil bormi, bajariladimi, bosh raqam sanaladimi. · 2 Uchalasiga «ha» — qabul. · 3 Bittasiga «yo'q» — tuzatish, bo'lim nomi bilan.
  — Sinfga savol: Mentor misolida qaysi savolda tuzatish chiqdi?

## Jonli viktorina — 12 savol (✔ o'rni: A 3·6·9 · B 1·5·12 · C 4·8·11 · D 2·7·10 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. 8-Moduldagi to'rt katakka PRD da yana nima qo'shildi? (2)
   - Ekranlar rasmi, ranglar va shriftlar (36)
   - ✔ Dalil, funksiyalar va qurilmaydiganlar (38)
   - Ishning narxi, muddati va ish jadvali (37)
   - Dasturchilar ro'yxati va ularning ishi (38)
2. Sinfdoshingiz dalilga «hammaga yoqadi» deb yozdi. Nima yetishmaydi? (3, 9)
   - Ilovaning chiroyli nomi va rangi (32)
   - Yechimning uzun va batafsil matni (33)
   - O'xshash ilovalarning ro'yxati (30)
   - ✔ Intervyuda buni aytganlar soni (30)
3. Qaysi ish uchta asosiy funksiya qatoriga kiradi? (4)
   - ✔ Busiz muammo hal bo'lmaydigan ish (33)
   - Eng chiroyli ko'rinadigan ish (29)
   - Boshqa ilovalarda bor bo'lgan ish (33)
   - Qurish uchun eng oson bo'lgan ish (33)
4. Yozuvlarda sababi bor, lekin hozir shart emas. Qayerga yozasiz? (4)
   - Uchta asosiy funksiya qatoriga (30)
   - Qilmaymiz qutisiga, o'chirib (28)
   - ✔ Keyin qutisiga, saqlab qo'yib (29)
   - Yechim gapiga qo'shib yozib (27)
5. «O'yinchilar ilovadan mamnun» — bosh raqam bo'la oladimi? (8, 9)
   - Ha — o'yinchilarning fikri muhim (32)
   - ✔ Yo'q — mamnunlikni sanab bo'lmaydi (34)
   - Ha — intervyuda shunday deyishgan (33)
   - Yo'q — bosh raqam faqat pul bo'ladi (35)
6. «Bajariladimi?» savoli nimani tekshiradi? (8)
   - ✔ Funksiyalar modulga sig'ishini (30)
   - Muammo gapi qanchalik qisqaligini (33)
   - Dalilda nechta odam yozilganini (31)
   - Bosh raqam qanday nomlanganini (30)
7. Mentor tekshiruvida uch savolga ham «ha». Javob qanday? (8, 10)
   - Tuzatish — har ehtimolga qarshi (31)
   - Tuzatish — yana intervyular kerak (33)
   - Javob yo'q — PRD dan oldin kod kutiladi (39) ✎ F-1006-276: «PRD» faqat to'g'ri variantda edi (lint-tell, quruvchi)
   - ✔ Qabul — PRD bilan qursa bo'ladi (31)
8. Amazon'da press-reliz qanday yoziladi? (6)
   - Mahsulot sotuvga chiqqan kunida (31)
   - Kod tugagach, xatolar bilan birga (33)
   - ✔ Mahsulot go'yo chiqib bo'lgandek (32)
   - Dasturchilar uchun ichki xat qilib (34)
9. Amazon'da press-reliz hech kimni qiziqtirmasa, nima bo'ladi? (6)
   - ✔ Mahsulot umuman qilinmaydi (26)
   - Kichikroq hajmda quriladi (25)
   - Baribir oxirigacha quriladi (27)
   - Boshqa nom bilan chiqadi (24)
10. Mentor misolida maydon pulini bo'lishish nega funksiyalardan chiqdi? (8)
    - Yozuvlarda unga hech qanday sabab yo'q (38)
    - Bosh raqamni u hech sanab bera olmadi (37)
    - Telegram guruhida bu ish allaqachon bor (39)
    - ✔ U alohida g'oya, shu modulga sig'madi (37)
11. PRD.md faylida «## Dalil» qatori nima? (11)
    - JavaScript'dagi izoh qatori (27)
    - Fayl nomining bitta bo'lagi (27)
    - ✔ Dalil bo'limining sarlavhasi (28)
    - Ro'yxatdagi bitta band qatori (29)
12. PRD dagi yechim bo'limiga nima yoziladi? (2, 9)
    - Uchta funksiyaning to'liq tavsifi (33)
    - ✔ Mahsulot nima qilishi, bir gapda (32)
    - Intervyudagi har bir odamning gapi (34)
    - Ilova qaysi kod tilida yozilishi (32)
- Arena yozuvlari — platforma shabloni (namuna `feedback/F-0929-QA-6modul/YAKUNIY/14-PmLesson25.md` dagidek).
- Izoh (MD): 1-savol — to'g'ri variantda qo'shtirnoq va qiyshiq chiziq yo'q («qurilmaydiganlar» — 6-bo'lim mazmuni so'z bilan). 5, 7-savollarda tire to'rtalasida, ha/yo'q teng (S-006).
  10-savol — 1-variant noto'g'ri: 9-Modulda «pulni bo'lishish qiyin» degan bitta yozuv bor, shuning uchun u «Keyin»da.
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — PRD · muammo · dalil · kim uchun · yechim · funksiya · Qilmaymiz · Keyin · bosh raqam · qabul · tuzatish · Markdown ·
  uyga vazifa banneri — PRD · dalil · qabul · tuzatish.

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/9-Modull/PmPrdLesson.jsx` — skeletdan. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s6 `QVoqea` · s9/s10 `QMustaqil` · s11 `QKod` (kod oynasisiz, VS Code rejimi — 8-Modul `m6-02` «VS Code'da yozdim» naqshi) · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')`.
2. **`PrdSahifa`** — bitta vizual (180): rejimlar `tortKatak` · `toliq` · `ixcham`; bo'lim holatlari (bo'sh/joriy/yozildi/tekshiruvda/tuzatish); muhr «Qabul» / «Tuzatish: {bo'lim}»; ramka «1 sahifa»;
   nom — Mentor misolida «Maydon Jamoa» o'z rangida. **`JamoaTelefon`** — ≈170×272, holatlar `muammo` (Telegram guruhi) · `elon` («Shanba, 18:00 · Mahalla maydoni · 8 / 10», «Qo'shilaman», son silliq o'zgaradi — 9.14 naqshi);
   yorliq «chizma — hali qurilmagan». Rangli yon chiziq yo'q; `reduced-motion` — o'tishsiz; qolip-maket izohi faylda e'lon qilinadi (`// qolip-maket: …`).
3. **`MENTOR_PRD`** — 7 × `{ id, nom, savol, matn }`, A-6 jadvali aynan + `qoralama: { funksiya3: 'Maydon pulini bo'lishish', keyin: [eslatma, royxat] }`; **`TEKSHIRUV_SAVOLLAR`** — 3 × `{ savol, qarang, bolim }`
   (bitta manba: s8, s10, kartochka 7, recap 12, yakun — P-063). **`BOLIMLAR`** — 7 × `{ id, nom, savol, max }` (s2, s9, s10, s11).
4. s0: `QKirish` sof so'rovnoma — hammaga `correct: false`, maqtov yo'q (J-026); javob 103 belgi; maket — telefon + bo'sh sahifa + uch yopiq karta, uchish (100 ms).
5. s2: `QBashorat` 1/2/3 → ixcham qator; `S2_SAVOLLAR` 3 × `{ savol, bolim }`; sahifa `tortKatak` → `toliq` (bo'limlar sirg'alib kiradi, nomlar «Kim» → «Kim uchun», «O'lchov» → «Bosh raqam»);
   telefon `muammo` ↔ `elon`; `QIzoh` + `QTaxmin` + xulosa bitta natija blokida (SABOQ 25); 40 s ipucha.
6. s4: `S4_ISHLAR` 4 × `{ nom, togri: 'qilmaymiz' | 'keyin', sabab }`; ketma-ket karta, ikki tugma; quti hisoblagichlari; xato izohlari 2 xil; yordam birinchi xatodan; `QIzoh` («Qilamiz»); nishon `clearLimits` (birinchi urinish).
7. s6: `AMAZON_BOSQICH` 3 × `{ h — bosqich nomi, m — Mentor gapi }` (SABOQ 8); `AmazonSahna` (brauzer oynasi «Amazon», press-reliz varag'i, kod oynasi «0 qator», siluetlar, «qilinmaydi»; 1995 — kitob javonlari);
   nom «Amazon» o'z rangida (`Brend` komponenti), logotip yo'q; bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); manba izohi faylda.
8. s8: `QBashorat` (Tuzatishsiz · Bitta tuzatish bilan · Uch tuzatish bilan); 3 qadam (`QQadamlar`); 2-qadam — funksiya qatorlari bosiladi (to'g'risi — qoralama 3-funksiya), «Keyin»ga uchish, «Chiqish va navbat» kirishi, dalil-chip;
   3-qadam — telefon «8 / 10» → «10 / 10 · To'ldi», hisoblagich; muhr «Qabul»; `QIzoh` (atama), `QTaxmin`, xulosa.
9. s9 artefakt: o'qiydi `pm-m9d4-final` (`muammoGapi` → 1-bo'lim, `dalil[final]` + `yozuvlarSoni[final]` → 2-bo'lim matni, `goya` → sahifa nomi; `vaqtincha: true` bo'lsa — nom yonida kulrang yorliq «vaqtincha tanlov» (04-FILTR 1); yo'q bo'lsa — bo'sh, Mentor gapining ikkinchi varianti); yozadi
   `localStorage` `pm-m9d5-prd` = `{ muammo, dalil, kim, yechim, funksiyalar: [3], qilmaymiz, keyin: [1–3], boshRaqam, tekshiruv, tuzatish, savedAt }` (tayanch 8 + 9.41; `tekshiruv`: `'qabul'` | `'tuzatish'`, `tuzatish` — bo'lim id yoki `null`; ikkalasi s10 da);
   ketma-ket karta (bitta katta, qolgani ixcham — SABOQ 29), `maxLength` (A — 9-ekran), tekshiruvlar (bo'sh — bloklaydi, qolgani yumshoq), ✎; nishon `fullPrd`; artefakt-strip «PRD · n/7».
10. s10: 3 qadam; «Yo'q — tuzataman» → s9 maydon komponenti (tekshiruvlari bilan) shu ekranda; «Uyda tuzataman»; muhr; `tekshiruv` yoziladi; `optionalLive`; nishon `threeQuestions`; yakka rejim — Mentor gapining ikkinchi varianti.
   **Jonli:** o'quvchi PRD si va natijasi Mentor ekraniga (ism · n/7 · «Qabul»/«Tuzatish: …», ochilsa yetti bo'lim) — yangi jonli maydon kerak bo'lishi mumkin (TAYANCHGA SAVOL 10). Mentor statistikasi 9 va 10-ekranlarda.
11. s11: `QKod` VS Code rejimi — kod oynasi va «Kompilyatorni ochish» tugmasi yo'q; darvoza `MD_DARVOZA` (3 tanlov); `PrdMarkdown` — o'quvchi PRD sidan yig'ilgan matn (`#`, `##`, `- ` belgilari `user-select: none`,
    bo'lim matni yonida «Nusxalash»), preview-panel yo'q (PM-082 b); bitta halol tugma; nishon `docFirst`. ⚠️ Namuna matni ichida backtik yo'q (template-satr emas) — CSS/JSX tuzog'i (CLAUDE.md).
12. Testlar s3/s5/s7/s12 — `correctIdx` 1/2/0/3 = `INLINE_KEYS`; `RECAPS` 3/5/7/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6).
    s3/s5/s12 karta — `QuestionScreen` `vizual`: savol ostida, faqat javob topilgach / natija ochilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. `ACHIEVEMENTS` 4 (`clearLimits`, `fullPrd`, `threeQuestions`, `docFirst`); s15 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — ScoreRing ostida (P-013); `HW_TOKENS` — faqat so'z.
14. Uyga vazifa — yangi `HwCard` (dars yangi; PM-027 bu yerga tegishli emas): yorliqlar «Kim bilan · Nechta · Muddat», 3 qadam, yakun ekranida aynan shular; tekshiruv `'tuzatish'` bo'lsa sarlavha ikkinchi variantda. Alohida `.homework.jsx` yo'q.
15. App.jsx: `m9-05` qatoriga `comp: PmPrdLesson` + import — asosiy seans (bu agent tegmaydi). Nom «G'oyangiz bir sahifaga sig'adimi?» ✓ va osti «Mentor tekshiruvi va to'liq PRD» ✓ (App.jsx 376-qator).
16. **REPO — yo'q** (PM darsi). `PRD.md` — o'quvchining kompyuterida; 7-darsda o'z repo'si ildiziga, `README.md` yoniga qo'shiladi (9.45).
- Darvozalar: `npm run gates -- src/9-Modull/PmPrdLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — javob kerak; yopilganlari «yopildi: 9.N»)
> **Holat (06.10, 05-FILTR):** 2, 4, 5, 7, 8, 9, 11, 12, 13 — qabul (auditor ham) · 3 — qisman: «Bajariladimi?» mezoni — muammo gapiga xizmat + modulga sig'ish · 6 — yopildi: tayanch 8 (`final`, `vaqtincha`) ·
> 10 — ochiq (jonli kanalda Mentor ekrani — MEXANIZM-TAKLIF 5) · 1 — yopilgan (9.47). Harakat belgisi — HB-q0 A.
1. **Modul raqami — yopildi: 9.47** (tayanch 2-bo'lim boshidagi moslik jadvali). Tayanch 1.4 «6-Modul `m6-02`» deydi — bu kod raqami; 10-Modul tayanchi 136-qator: kod 6 = **LMS 8**. O'quvchi matnida «8-Modulda» yozdim (to'rt katak, `SKILL.md`).
   Xuddi shunday Amazon (`src/4-Modull/PmLesson13.jsx`, `m4-12`) — LMS **5-Modul**. Tayanch 1.6 dagi «6-Modulda Stack Navigator bilan …» (9-dars ko'prigi) ham o'quvchi matnida «8-Modulda» bo'lishi kerak — 9-dars MD siga tegadi.
   `00-TAQIQLAR.md` 3-bo'limidagi misol «6-Modulda» ham shu sababdan chalg'itadi.
2. **«to'lovni bo'lishish» = «maydon pulini bo'lishish» — yopildi: 9.42.** Tayanch 1.4 qoralamada «to'lovni bo'lishish», «Keyin»da «maydon pulini bo'lishish» — bir ish ikki nom (T-014). Darsda hamma joyda «maydon pulini bo'lishish» (1.1 dagi g'oya nomi). Tayanchni ham bir so'zga keltirish taklifi.
3. **Tuzatish sababi.** Tayanch: F3 «Bajariladimi?» savolida «keyin»ga o'tgan. Sababini o'zim aniqladim: u oltita g'oyadan biri (1.1, 2-g'oya) — alohida g'oya, uchta funksiya bilan shu modulga sig'maydi;
   «Qilmaymiz» emas, «Keyin» — 9-Modul intervyusida 5 kishidan 1 tasi «pulni bo'lishish qiyin» degan (9.26). O'rniga «Chiqish va navbat» — muammo gapining «yetarli odam» qismiga javob.
   O'quvchi uchun «Bajariladimi?» yo'rig'i: «uchala funksiya shu modulda quriladimi? Qaysi biri alohida g'oya?» — 1.2 dagi «bajariladimi — 6 haftada qura olamanmi» bilan bir ildiz.
4. **«Qilmaymiz» / «Keyin» qoidasi** — 9-Modul `m7-03` aynan («Keyin»ga yozuvlarda sabab bor, «Qilmaymiz»ga yo'q). Sabablar tayanch 1.3 yozuvlaridan: eslatma — 2-yozuv; ro'yxat o'zi yangilanadi — 5-yozuv
   («maydonda kutdi, kim kelishini bilmadi» — sabab kuchsizroq, shubhali joylarda); chat — beshala o'yinchi Telegram guruhida; reyting — yozuvlarda yo'q.
5. **«(push)» va «(real vaqt)»** (tayanch 1.4 «Keyin» ro'yxati) — o'quvchi matnida tushirildi: «push» bu modulda o'tilmaydi, «real vaqt nuqtasi» — 8-dars atamasi; nomlar o'zi tushunarli («o'yindan oldin eslatma», «ro'yxat o'zi yangilanadi»).
6. **`pm-m9d4-final` shakli — yopildi: tayanch 8 (04-FILTR 23 — `final: 'a' | 'b'`, `bolaklar`, `qiyin`, `keyin`, `vaqtincha`)**. Eski izoh: — qisman yopildi: 9.44 (o'quvchi 4-darsda o'z sanog'ini kiritadi; maydon shakli hali ochiq). `dalil: { a: { takror, belgi }, b: { … } }` — final g'oya `a` mi yoki `b` mi (`goya` bilan qanday bog'lanadi), `takror`/`belgi` — son yoki «4 / 5» matni? Darsda 2-bo'lim matni:
   «{yozuvlarSoni} intervyu. Muammo takrorlandi: {takror}. Harakat belgisi: {belgi}.» — 4-dars MD si bilan solishtirish kerak. `goya` — nom (sahifa sarlavhasi) deb oldim.
7. **`pm-m9d5-prd` ga qo'shimcha — yopildi: 9.41** (taklif qabul) — `tuzatish: '<bo'lim id>'` (qaysi bo'lim; tayanch 1.4: «tuzatish (qaysi bo'lim)»); `funksiyalar` — faqat nomlar (7-dars ularni tugma yorlig'i qiladi, ≤ 40 belgi).
8. **«press-reliz».** 5-Modul `m4-12` da «matbuot e'loni (press-reliz)», kodda «e'lon». Bu modulda «e'lon» — o'yin e'loni (F1), shuning uchun darsda faqat «press-reliz» + bir qator izoh (T-015).
9. **`PRD.md` qayerda turadi? — yopildi: 9.45** (7-darsda o'quvchi repo'si ildiziga, `README.md` yoniga). O'quvchi repo'si 7-darsda ochiladi — `PRD.md` o'shanda repo ildiziga qo'shilsinmi? Mentor repo'si `maydon-jamoa` da ham `PRD.md` bo'lsinmi (tayanch 3 teg jadvalida yo'q)? Darsda — «mahsulotingiz nomi bilan papka».
10. **Mentor ekranida har o'quvchi PRD si** (9, 10-ekranlar, foydalanuvchi eslatmasi) — jonli kanal o'quvchining matnini Mentorga yubora oladimi? 15-dars («har o'quvchi varag'i») bilan bitta mexanizm bo'lishi kerak — asosiy seans qarori.
11. **11-ekran shakli.** Tayanch 4: «`PRD.md` — kod emas, hujjat». Shuning uchun (a) sarlavha PM-082(a) «…digan kod yozamiz» oilasidan emas («PRD ni koddan oldin faylga yozamiz.»), (b) bo'lim matni yonida «Nusxalash»
    (o'quvchining o'z matni — PM-082 ISTISNO), sarlavha va ro'yxat belgilari qo'lda. Butun faylni qo'lda terish kerak bo'lsa — vaqt ≈ 15 daqiqa, 9-ekranni qisqartirish kerak.
12. **Bo'lim nomi «Qilmaymiz / Keyin»** — tayanchda «Qilmaymiz / keyin»; 9-Modul quti nomlari bosh harf bilan («Keyin» qutisi, 9.22), shuning uchun «Keyin». Ravish «keyin» quti yonida — «so'ng» (9-Modul qoidasi).
13. **«tasdiq» ikki joyda — yopildi: 9.41** (Mentor tekshiruvi javobi — «qabul» / «tuzatish»; «tasdiq» — faqat «O'yin kuni tasdiq»). Tekshiruv javobi «tasdiq» va funksiya nomi «O'yin kuni tasdiq» (tayanch 1.4) — bir ildiz, ikki ma'no (T-015). Darsda ular yonma-yon gapda kelmaydi; funksiya nomini «O'yin kuni «Kelaman»» qilish taklifi (11–12-darslarga tegadi).
14. **Dalil matni** (1.4: «10 intervyudan sanoq (4 / 5 · 4 / 5)») — darsda: «10 intervyu. Jamoa yig'ish bo'yicha 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan; 5 tadan 4 tasi birinchi versiyani sinab ko'rishga kun belgilagan
    (harakat belgisi).» + 4-darsning halol gapi kulrang qatorda. Har son yonida sharti (7-bo'lim 3).

## Shubhali joylar (ishonchim komil emas)
- 1-ekran Mentor gapida «mahsulot talablari hujjati» — «talab» so'zi darsda bir marta qoladi (tayanch: 8-Modul ta'rifi bir marta). Agar «talab» umuman bo'lmasin desangiz — faqat «Product Requirements Document» qoladi.
- 6-ekran: «Press-reliz — kompaniya yangi mahsulot chiqqani haqida yozadigan xabar» — bankda so'zma-so'z yo'q (umumiy bilim, atama izohi). «Kitob sotgan» — bankda «faqat kitoblar» (fe'lsiz), fe'l 5-Modul matnidan.
  Sahnadagi «chiqdi» belgisi, siluetlar va «0 qator» — tasvir; bankda yo'q son yoki nom qo'shilmagan.
- 6-ekran bashorati «Bu press-reliz qachon yoziladi?» — sarlavha («…nimadan boshlaydi?») javobga ishora qiladi: bashorat yengil chiqishi mumkin (ballsiz, P-053 `pre` kadr saqlangan).
- 4-ekran: «Ro'yxat o'zi yangilanadi» uchun 5-yozuv sababi kuchsiz — 1-funksiya «8 / 10» ni ekran ochilganda ko'rsatadi; o'quvchi «Qilmaymiz» deb ham asoslashi mumkin.
- 8-ekran 2-qadam: funksiyalar yonidagi «muammo gapidan: …» va «oltita g'oyadan biri» yorliqlari javobni ko'rsatib qo'yadi — tushuncha-ekran (ballsiz), test emas; yetarli darajada o'ylatadimi — ko'rish kerak.
- 10-ekran natijasi halol tugmalarga tayanadi («Ha» / «Yo'q») — tekshirib bo'lmaydi; jonli darsda o'qituvchi 2–3 PRD ni sinf bilan ko'radi.
- 11-ekran: VS Code tugmalari rasmiy hujjatdan (Ctrl+Shift+V, Cmd+Shift+V, Ctrl+K V); papka ochish va fayl yaratish — umumiy so'z (menyu nomlari taxmin qilinmadi). Markdown'da `//` oddiy matn bo'lib chiqishi — to'g'ri.
- 9-ekran: `maxLength` qiymatlari (140–200) — bir sahifaga sig'ishi uchun mening taxminim; sahifa balandligi qurishda o'lchanadi.
- Arena 4: «Keyin qutisiga, saqlab qo'yib» — 9-Modul «navbati suriladi» bilan bir ma'no, boshqa so'z (karta 4 bilan kalit-aks-sadosi bo'lmasin deb).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 375–377 — `m9-04` «O'n intervyudan keyin qaysi g'oya qoladi?» → **`m9-05` «G'oyangiz bir sahifaga sig'adimi?»**
  (osti «Mentor tekshiruvi va to'liq PRD» — reja chap qatori so'zma-so'z) → `m9-06` «Bitiruvgacha nimani qachon qurasiz?» (yakun qatori).
- [x] Bitta misol-ip: «Maydon Jamoa» PRD si (1.4 aynan); metafora yo'q; bitta vizual — `PrdSahifa` (to'rt katak · to'liq · ixcham) + `JamoaTelefon`. Ikkinchi misol faqat testda (to'garaklar, uy vazifalari — 1.1/1.3). Amazon — keys sahnasi.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 8 (QTushuncha) + 0, 6, 9, 10, 11; testlarda javobdan keyingi karta. «bosish → matn-karta» yo'q — har bosish sahifa, telefon yoki qutini o'zgartiradi.
- [x] O'lchov (skript bilan sanaldi, `scratchpad/md05/olchov.py`): sarlavha ≤ 55, bitta qator · Mentor ≤ 2 gap (interaktiv ekranlarda 1) va sarlavhani takrorlamaydi · xulosa ≤ 110 · hook javobi ≤ 120 · xato izohi ≤ 60 — natija hisobotda.
- [x] Atamalar: PRD (8-Modul ta'rifi bir marta), muammo gapi, dalil, harakat belgisi, «Qilamiz / Keyin / Qilmaymiz» (9-Modul so'zma-so'z), bosh raqam (10-Modul), g'oya (1-dars) — o'sha so'zlar bilan;
  yangi — to'liq PRD, Mentor tekshiruvi (misoldan so'ng, sarlavhada yo'q); «e'lon», «maydon», «jamoa», «keyin» — bir ma'noda; siz-forma, tugmalar ot-shaklda («Saqlash», «Davom etish», «Nusxalash»).
- [x] Testlar: 4 variant, uzunlik teng (s3 45/45/48/44 · s5 45/49/48/49 · s7 46/46/44/42 · s12 35/39/38/37 — farq ≤ 15%); to'g'ri javob yolg'iz eng uzun emas; raqam, qo'shtirnoq, tire faqat to'g'rida emas.
  Arena 12 — farq ≤ 15%, ✔ A3 B3 C3 D3. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «hech qachon», «albatta», «100%» — grep 0); «mumkin», «bu misolda» bilan chegaralangan.
- [x] Ichki kodlar yo'q (o'quvchi matnida F1–F3, `m9-NN`, «Modul 11» yo'q; modul raqami LMS raqamida — «8-Modul», «9-Modul», «5-Modul» — eslatmada). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 16 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (to'liq PRD, Mentor tekshiruvi — misoldan so'ng) · T-014/T-015 (bir so'z — bir ma'no: press-reliz, «Keyin», «Kim bilan») · T-016 (metafora yo'q) · T-036 (PRD ochilishi birinchi ko'rinishda) ·
  T-038 (va'da yo'q — kelajak faqat uyga vazifa muddatida) · T-039 («PRD ingiz» — 9-ekrandan so'ng; reja «PRD yozib») · T-042 (ta'rif so'zma-so'z: 2, 15, kartochka) · T-043 («bu misolda», halol gap) ·
  T-047/T-048 (Mentor ekrandagini aytmaydi) · T-052 (8-Modul va 9-Modul atamalari bir gap bilan tenglashtirilgan) · P-001 · P-008 · P-013 · P-015 · P-025 · P-033 · P-036 (0-ekranda bo'lim nomlari yo'q) · P-046 (10-ekran xulosasi) ·
  P-053 (keys sahnasi, `pre` kadr) · P-062 · P-063 (`TEKSHIRUV_SAVOLLAR`) · P-064 (bashorat 2, 6, 8) · P-067 · S-001 · S-002/S-004 · S-006 · S-010 · S-015 · S-018 (Amazon izohi) · S-020 · S-026 · S-027 · S-040 ·
  PM-005 (2-tur) · PM-017 · PM-018 (Amazon — faqat bank) · PM-082 (c, d, e; a va b — TAYANCHGA SAVOL 11) · J-026 · SABOQ 1–31.
