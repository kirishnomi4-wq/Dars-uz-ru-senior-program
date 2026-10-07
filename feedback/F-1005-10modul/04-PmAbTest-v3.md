# 10-Modul (kod: `src/8-Modull`) · 4-dars (PM + amaliyot) «Ikki variantdan qaysi biri yaxshiroq ishlaydi?» — MD v3

Fayl: `src/8-Modull/PmAbTestLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m8-04` · **12 ekran** (PM qismi 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; kartochkalar alohida — SABOQ 12) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 8-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa — PM qismi ≈ 20 (0–5-ekran) · A1 ≈ 27 (gipoteza formasi bilan) · A2 ≈ 25 (push va sinfdoshlar bilan) · yakuniy savol, podium, kartochkalar, arena ≈ 18.
Tuzilma (dastur v9, tayanch 4): PM+PRAKT — PM nazariya 0–5 → A1 · A2 → yakuniy savol · podium · yakun (kartochkalar ichida). Mustaqil ish alohida ekran emas — A1 ning 5-qadami (o'quvchining gipotezasi).
Menyu nomi (DE-205): App.jsx 332-qator `m8-04` — «Ikki variantdan qaysi biri yaxshiroq ishlaydi?» (osti: «gipoteza va A/B test — B varianti bugun ishga tushadi») ·
oldingi `m8-03` «Loyiha kuni: jonli dashboard» · keyingi `m8-05` «Kiberxavfsizlik: zaiflikni topib yopamiz» (App.jsx 331–333, grep, 05.10).
Tur (PM-005): aralash — PM qismi **2-tur** (artefakt — yozma matn: gipoteza; USTAXONA — A1 5-qadami), amaliyot — repo bloklari (tayanch 9.1: `m8-04` — repo bloklari; JS kod oynasi yo'q).
Manba: `00-MODUL-TAYANCH.md` (1 — A/B 4-dars raqamlari va halol gap aynan · 2 — ta'riflar aynan · 3 — `m10-dars-04-*` nomlari aynan · 5 — K9 · 8, 9 — saqlanadigan natija va kelishuvlar) ·
`GATE_M_JAVOB.md` (qaror 7 — A/B usuli va Mentor gipotezasi, 11 — sinfdoshlar va real odamlar) · `00-TAQIQLAR.md` · `PM_Prompt_v8.md` K9 · tashqi xizmatlar — rasmiy hujjat (pastda «Manbalar»).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Bitta natija (dastur: «1 A/B test ishga tushirilgan»).** Dars oxirida:
   - o'quvchi o'z loyihasi uchun **gipoteza** yozgan («Agar … qilsak, … o'zgaradi, chunki …» + qaysi raqamga qaraladi) — A1 5-qadamida, saqlanadi `pm-m8d4-gipoteza`;
   - `maydon` repo'sida (o'quvchining nusxasi) **B varianti ishga tushgan**: har brauzer birinchi kirishda A yoki B ni tasodifiy oladi va eslab qoladi, tugma matni variantga qarab,
     har hodisaga `variant` qo'shiladi, dashboard'da A va B foizi; push qilingan — sinfdoshlar Netlify manzilida ochadi (qaror 11). Teg: `m10-dars-04-start` → `m10-dars-04-done`.
2. **Bugungi asosiy fikr (P-013):** Gipoteza qaysi raqamga qarashni oldindan aytadi, A/B test shu raqamni ikki guruhda bir vaqtda solishtiradi.
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (grep: `01-PmOkr-v3.md`, `02-EventTracking-v3.md`, `03-LiveDashboard-v3.md`):**
   - **tajriba** (1-dars: asosiy natijani o'zgartirish uchun sinab ko'riladigan bitta o'zgarish) — «Maydon» OKR'ida: «Tugmada tanlangan soat yozilsin · 2-asosiy natijaga».
     Gipoteza shu tajribadan boshlanadi (tayanch 9.8). **asosiy natija** · **OKR** — 1-darsdan, faqat eslatma.
   - **foiz** (1-dars, tayanch 2: vaqtni tanlagan 100 kishidan nechtasi band qildi) — bu darsda har variantda alohida.
   - **uch qadam** — ochdi → vaqtni tanladi → band qildi (yorliq) · **hodisa** (`ochdi` · `vaqt-tanladi` · `band-qildi`) · **`hodisaYoz`** · **`hodisalar` jadvali** — 2-darsdan.
   - **brauzer ID** (tasodifiy harf va raqamlar: bitta brauzerni ajratadi, odamning ismini ham, telefonini ham bildirmaydi — tayanch aynan; localStorage `maydon-brauzer`) — 2-darsdan.
   - **dashboard** (kerakli raqamlarni bir sahifada ko'rsatadigan sahifa; «Maydon»da har 5 soniyada yangilanadi, `/dashboard`, egaga parol bilan) · **«Oxirgi 5 daqiqada»** (oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar) — 3-darsdan (03-FILTR).
   - **sanoq sharti** — «har qadamda turli brauzerlar soni» (tayanch 7.3, 9.3) — har variant uchun ham shu.
   - **inkognito oyna** (sayt unga yangi brauzer ID beradi; Chrome va Edge — Ctrl+Shift+N, Mac — Cmd+Shift+N) — 2–3-darslardan, tekshiruv vositasi.
   - **talab** (qayerda · nima qilsin · nima buzilmasin) · **prompt** · **agent** (Antigravity) · **tekshirish** (natijani o'zingiz ko'rib chiqasiz) — 9-Modul va 3-darsdagidek.
4. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan aynan, dars bo'yi so'zma-so'z (T-042):**
   - **gipoteza** — «Agar … qilsak, … o'zgaradi, chunki …» shaklidagi tekshiriladigan taxmin. 2-ekranda, uch bo'lak tanlangandan keyin joriy qatorda tug'iladi.
     Gipotezaning to'rtinchi bo'lagi — **raqam**: qaysi raqam bilan tekshirilishi (tayanch 8 `olchov`). O'quvchi matnida «o'lchov» emas, «raqam» — lug'atda «o'lchash» ildizi «sanash» ga almashtirilgan (T-066) va «raqam» 1-darsdan tanish.
   - **A/B test · variant A · variant B** — odamlarning bir qismi A ni, qolgani B ni ko'radi, raqamlar solishtiriladi; A — hozirgi, B — yangi. 4-ekranda (Booking.com) 3/5 slaydda tug'iladi
     (5-Modulda Booking hikoyasi «A/B» so'zisiz berilgan — tayanch 5).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«variant»** — faqat A/B varianti ma'nosida (dars nomidagi «ikki variant» ham — tugmaning ikki matni). Savol javoblari o'quvchi matnida «variant» deb atalmaydi — «javob».
   - **«guruh»** — A ni ko'rganlar yoki B ni ko'rganlar. **«test»** — faqat «A/B test» ichida; dars savollari — «savol», eyebrow «Tekshiruv».
   - **«raqam»** — gipotezaning to'rtinchi bo'lagi va dashboard'dagi son (1–3-darslar bilan bir oila). **«natija»** — o'quvchi matnida faqat «asosiy natija» (1-dars) va qolip yorlig'i «kutilgan natija» (QBlok standarti).
   - **«tajriba»** — faqat 1-dars ma'nosida. Booking hikoyasida «tekshiriladi» deyiladi — «tajriba» ikki ma'noda yashamasin.
   - **«sinov»** — ishlatilmaydi (9-Modul: real odam ilovani ishlatadi, siz kuzatasiz). Sinfdoshlar saytni ochishi — «tekshirish» (3-dars A3 dagidek).
   - **Ishlatilmaydi:** faraz · eksperiment · split test · konversiya · ulush · segment · voronka · sessiya · «o'lchov» (o'quvchi matnida).
6. **Mentor misolidagi raqamlar (tayanch 1, aynan — dars bo'yi faqat shular):**
   - **A/B (4-dars, sinfda):** A — 9 brauzer vaqt tanladi, 3 tasi band qildi · B — 8 tadan 4 tasi. Hisob (yangi fakt emas): A ≈ 33 foiz (3 / 9), B — 50 foiz (4 / 8), jami 17 = 9 + 8.
     Halol gap (aynan): **«17 ta brauzer xulosa uchun kam — bu ishga tushirish mashqi.»** Sanoq sharti — har qadamda turli brauzerlar soni (9.3). «kishi» — halol gap aynan (TAYANCHGA SAVOL 6).
   - **OKR bog'i (tayanch 1):** tajriba — tugma matni, 2-asosiy natijaga (vaqtni tanlaganlardan band qilganlar foizi 24% → 40%). 24% faqat 2-ekran O'qituvchi eslatmasida — A/B da solishtirish o'tgan hafta bilan emas, A guruhi bilan.
   - **Mentor gipotezasi** (qaror 7: «tugmada tanlangan soat yozilsa («18:00 ni band qilish»), ko'proq odam band qiladi»; bitta manba `MAYDON_GIPOTEZA`, dars bo'yi aynan; «chunki» — TAYANCHGA SAVOL 1):
     - Agar — **tugmada tanlangan soatni yozsak**
     - … o'zgaradi — **vaqtni tanlaganlardan ko'proq o'yinchi band qiladi**
     - chunki — **o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi**
     - Raqam — **vaqtni tanlaganlardan band qilganlar foizi**
   - Tugma matnlari (tayanch 3, aynan): A — «Band qilish», B — «{soat} ni band qilish» (maketlarda «18:00 ni band qilish»).
7. **Keys — K9 Booking.com** (tayanch 5; `PM_Prompt_v8.md` bank, asl matni — «Manbalar»): bankda — saytdagi deyarli har o'zgarish (tugma rangi, matn, bo'limlar tartibi) avval foydalanuvchilarning bir qismida tekshiriladi ·
   raqam: bir vaqtda 1000 dan ortiq A/B test (kompaniyaning ochiq chiqishlari, 2017). Darsda: «Kompaniyaning o'zi aytishicha, deyarli har o'zgarish … avval foydalanuvchilarning bir qismida tekshiriladi» ·
   «Kompaniyaning 2017-yildagi chiqishlariga ko'ra, saytda bir vaqtda 1000 dan ortiq A/B test o'tkazilgan» (yumshatish — tayanch 7.5). Brend izohi — 4-ekran Mentorida, bir marta (S-018).
   Booking'ning biror aniq testi va natijasi aytilmaydi (bankda yo'q — PM-016, PM-018).
8. **Bitta misol-ip — «Maydon»** (P-001). Ikkinchi misol yo'q; 3-ekran testi ham «Maydon» ichida (boshqa o'zgarish — kun strelkalari). O'quvchining o'z loyihasi — faqat A1/A2 5-qadami va uyga vazifa (P-004).
9. **Metafora yo'q. Toza yuza (185, D4):** tugma, variant, karta, yorliqda emoji yo'q; telefonlar, odam-belgilari, Booking sahnasi chizilgan (CSS), logotip yo'q. O'yin qatlami (arena, nishon medali, podium) — mustasno.
10. **Kod yozish — Antigravity (173).** Prompt — uch qator, har qator o'z yorlig'i bilan (Qayerda · Nima qilsin · Nima buzilmasin), oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» (3-dars naqshi).
    Promptda faqat repo'dagi nomlar (`hodisalar`, `variant`, `maydon-variant`, `hodisaYoz`, `web/src/hodisa.js`, `web/src/BandForma.jsx`, `GET /hodisalar/sanoq`). Prompt matni sen-formada (T-002).
    Xato yo'li — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» **Talab zinapoyasi (tayanch 9.2):** A1 — tayyor talab + bitta joy · A2 — bitta qator («Nima qilsin»), namuna «Yordam» ortida.
11. **Real odam bilan ish (qaror 11):** darsda — sinfdoshlar bir-birining saytini telefonida ochadi (A2 4-qadam); real odamlarga havola — uyga; raqamlar dashboard'da, odamlar kirgan kuni.
    «17 ta brauzer xulosa uchun kam» halol aytiladi (A2, 8-ekran, yakun). Statistik qoida (necha kishi yetadi) aytilmaydi.
12. **Texnik faktlar (manba, 05.10.2026; o'quvchiga ko'rinmaydi):**
    - TypeORM `synchronize: true` (repo `backend/src/app.module.ts`, `dars-11-done`) — yangi `variant` ustuni Backend qayta ishga tushganda o'zi qo'shiladi; migratsiya qadami yo'q.
      TypeORM hujjati: «don't use this in production — otherwise you can lose production data» — A1 O'qituvchi eslatmasi va TAYANCHGA SAVOL 9.
    - localStorage origin bo'yicha alohida: `localhost:5173` va Netlify manzili — ikki xil brauzer ID va ikki xil variant (02 MD, MDN). Inkognito oyna yopilsa, sayt ma'lumoti o'chadi (Chrome yordami).
    - Render (Auto-Deploy, sukut «On Commit») va Netlify (continuous deployment) — `git push` dan keyin o'zi yangilanadi; Render bepul rejasi uxlasa, uyg'onishi ≈1 daqiqa (tayanch 6).
    - Neon SQL Editor — Neon Console'da SQL so'rovini ishga tushirish oynasi (rasmiy nom).
    - «Band qilish» tugmasi — `web/src/BandForma.jsx` dagi forma tugmasi (`type="submit"`, yuborilayotganda «Yuborilmoqda…»); forma sarlavhasi «Bugun · 18:00–19:00» (`kunNomi` — bugun uchun «Bugun»).

## Darsning ipi va bitta vizual

- **Modul ipi — «Maydon» davomi** (tayanch 1): 1-darsda OKR va tajriba (tugma matni), 2-darsda uch hodisa o'z jadvalimizga, 3-darsda dashboard. Bugun tajriba gipotezaga aylanadi va B varianti odamlarga ketadi.
- **Dars ipi:** hook — tugmaning ikki matni: qaysi biri yaxshiroq? → 2: tajriba gapi gipotezaga aylanadi (nima o'zgaradi, nega, qaysi raqam) → 3: boshqa o'zgarish uchun raqam tanlanadi →
  4: Booking.com — A/B test atamasi va 2017-yil raqami → 5: sinfdoshlarni ikki guruhga qanday bo'lish → A1: «Maydon»da variant va tugma matni → A2: dashboard'da A va B foizi, sinfdoshlar ochadi →
  8: 17 ta brauzerdan xulosa chiqaramizmi? Hook savoliga javob — 8-ekran: hozircha raqam kam, test davom etadi.
- **Bitta vizual — A/B maketi (`AbMaket`, dars bo'yi, 163/180; bitta manba `MAYDON_AB`):**
  - **o'yinchi telefoni** — «Maydon» formasi: «Bugun · 18:00–19:00» · Ism · Telefon (bo'sh) · tugma. Holatlar: bitta telefon, tugma ikki holatda yonma-yon (kulrang yorliqlar «hozir» · «yangi»; 2-ekran) ·
    ikki telefon yonma-yon: **A** «Band qilish» | **B** «18:00 ni band qilish» (0, 1, 5, bloklar). B telefon ramkasi — accent, A — kulrang.
  - **har telefon ostida mini uch qadam** — ochdi · vaqtni tanladi · band qildi (kichik ustunlar), «vaqtni tanladi → band qildi» oralig'ida foiz yorlig'i (bo'sh — «?»). Raqam faqat A2 va 8-ekranda.
  - **kirish oqimi** (5-ekran) — brauzer belgilari (doira + qisqa ID, masalan `c2a8…`) tepadan keladi → ajratgich → har biri A (kulrang halqa) yoki B (accent halqa) oladi va o'z telefoni tomonga o'tadi.
  - **gipoteza kartasi** (o'ngda; 2-ekran va A1 5-qadami) — to'rt qator: «Agar …» · «… o'zgaradi» · «chunki …» · «Raqam»; holatlar: bo'sh (uzuq chiziq, U-041) → yozildi → joriy (accent) → xato (`err` fon);
    gipoteza tug'ilgach karta yorlig'i «gipoteza».
  - **o'yinchi pufagi** (telefon ustida, 2 va 5-ekran) — o'yinchi o'yi bitta qisqa gapda.
  - **kalendar** (5-ekran, 1-usul) — «O'tgan hafta · A» va «Bu hafta · B» kataklari, «Bu hafta» ga kulrang karta «Mahalla chatida e'lon» tushadi (1-darsdagi «Qilinadigan ishlar» qatori).
  - Ishlatiladi: 0 · 1 · 2 · 5 · A1 (o'ng) · A2 (o'ng, `DashMaket` bilan) · 8 (savol ustida, `DashMaket` A/B qismi). 4-ekran — alohida keys sahnasi (P-053). `prefers-reduced-motion` da harakat yo'q, holat birdan qo'yiladi.
- **`DashMaket`** (3-darsdagi maket — o'sha ko'rinish; bugun qo'shiladigan qism): uch qadam ostida «A/B test · tugma matni» — ikki qator: A va B (vaqtni tanladi · band qildi · foiz).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · «Maydon» tugmasi
- Sarlavha: **Ikki variantdan qaysi biri yaxshiroq ishlaydi?** (46) — dars nomi (DE-205)
- Mentor: Mentor misolida «Maydon» formasidagi tugma ikki xil yozildi. O'yinchi bo'lib ikkalasiga qarang va bittasini tanlang.
- Maket (chap): `AbMaket` — ikki telefon yonma-yon, ikkalasida bir xil forma «Bugun · 18:00–19:00» · Ism · Telefon (bo'sh).
  Chap telefonda tugma «Band qilish», o'ngda — «18:00 ni band qilish». Telefonlar ostida uzuq chiziqli bo'sh joy (U-041 — keyin to'ldiriladigan joy). Yorliqlar «A», «B» hali yo'q (atama 4-ekranda).
- Variantlar (radio, o'ng; bir uzunlikda — P-016):
  - Chapdagi tugma (14)
  - O'ngdagi tugma (14)
- Javob (ikkalasida bir xil, maqtovsiz — J-026, P-016): Ikkalasi ham bo'lishi mumkin. Qaysi birida ko'proq o'yinchi band qilishini taxmin emas, raqam ko'rsatadi. (105)
- **Harakat → Vizual o'zgarish:** javobni tanlash → tanlangan telefon accent ramka oladi va bir lahza ko'tariladi; ikkala telefon ostidagi bo'sh joyda kulrang yorliq «band qildi: ?» chiqadi,
  telefonlar orasida katta «?» belgisi. Jonli darsda — sinf ovozlari chizig'i (har javob va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- O'qituvchi eslatmasi: Tugma — 9-Modulda sinovdan keyin telefon ekrani pastiga qotirilgan o'sha «Band qilish». Sinfdan so'rang: «Siz o'yinchi bo'lsangiz, qaysi biri sizga aniqroq?» — javobni ochiq qoldiring:
  bugun raqam emas, savolni to'g'ri qo'yish o'rganiladi.
✎ Hook savoli dars obyektining o'zi (P-001): tugmaning ikki matni. Ikkala javob teng tutiladi, payoff hech birini yolg'onga chiqarmaydi (P-016); 8-ekran shu savolga qaytadi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun «Maydon»da tugmaning yangi matni ishga tushadi.** (53)
- Mentor: Bugungi misol — «Maydon» OKR'idagi tajriba: tugmada tanlangan soat. Kodni Antigravity yozadi, raqamlarni dashboard ko'rsatadi.
- Chap — «Dars oxirida» + App.jsx osti so'zma-so'z (P-015): «gipoteza va A/B test — B varianti bugun ishga tushadi».
  Ostida `AbMaket` o'zi o'ynaydi (DE-200): kulrang doiralar tepadan kirib, ikki telefon tomonga bo'linadi; chap telefonda «Band qilish», o'ngda «18:00 ni band qilish»;
  ostidagi mini ustunlar kulrang chiziq bo'lib qoladi (raqamsiz — 5-ekran va A2 kashfiyotini ochmaydi).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015):
  - 01 · Tajribani tekshirsa bo'ladigan gapga aylantirasiz · `gipoteza`
  - 02 · Odamlarni ikki guruhga bo'lishni o'rganasiz · `A/B test`
  - 03 · «Maydon»da tugmaning yangi matnini ishga tushirasiz · `variant`
  - 04 · Ikki guruh foizini dashboard'da solishtirasiz · `foiz`
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `m10-dars-04-start` · tayyor namuna `m10-dars-04-done`
- Harakat yo'q (reja ekrani) — vizual o'zi o'ynaydi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011); chap qator — App.jsx osti (01-dars naqshi), teglar kulrang yorliq (P-015 «qiyin atama kulrang yorliqqa»).

## 2 · Gipoteza  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · taxmin
- Sarlavha: **Tajribani tekshirsa bo'ladigan gapga aylantiring.** (49)
- Mentor: Tajriba gapi nimani kutishni aytmaydi — har bo'lakda bittasini tanlang.
- O'ng (vizual): `AbMaket` — bitta o'yinchi telefoni (forma «Bugun · 18:00–19:00», tugma «Band qilish», yonida kulrang «18:00 ni band qilish» · yorliqlar «hozir» · «yangi»), ostida mini uch qadam.
  Yonida gipoteza kartasi: 1-qator to'ldirilgan — «Agar **tugmada tanlangan soatni yozsak**» + kulrang yorliq «OKR'dagi tajriba»; qolgan uch qator bo'sh (uzuq chiziq).
- Chap (harakat): bo'lak qatorlari (`QQadamlar` uslubida — joriysi accent, tanlangani ✓); har qatorda javob tugmalari:
  - **… o'zgaradi:** «sayt yaxshiroq bo'ladi» · «vaqtni tanlaganlardan ko'proq o'yinchi band qiladi» · «saytni ko'proq odam ochadi»
  - **chunki …:** «agent tugma matnini tez o'zgartira oladi» · «o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi»
  - **Raqam:** «saytni ochganlar soni» · «vaqtni tanlaganlardan band qilganlar foizi» · «haftada band qilingan vaqtlar»
- **Harakat → Vizual o'zgarish:** javobni bosish → kartaning o'sha qatoriga yoziladi va telefon javob beradi:
  - «… o'zgaradi» to'g'ri → mini «band qildi» ustuni ustida yuqoriga strelka (accent);
    «sayt yaxshiroq bo'ladi» → uch ustun ustida kulrang «?», pufak «Qayerda yaxshiroq?» · `QXato`: Yaxshiroq — qayerda? O'yinchi nimani boshqacha qiladi? (54)
    «saytni ko'proq odam ochadi» → «ochdi» ustuni yonadi, tugma esa hali yo'q (forma vaqt tanlangach ochiladi) · `QXato`: Tugma vaqt tanlangandan keyin chiqadi — ochishga tegmaydi. (58)
  - «chunki …» to'g'ri → tugma ustida o'yinchi pufagi «18:00 — men tanlagan vaqt»;
    «agent …» → pufak «Bu menga nima beradi?» · `QXato`: Bu biz uchun qulay. O'yinchi nega ko'proq band qiladi? (54)
  - «Raqam» to'g'ri → «vaqtni tanladi → band qildi» oralig'ida yorliq «foiz» (accent);
    «saytni ochganlar soni» → «ochdi» ustuni kulrang chiziq bilan o'chadi · `QXato`: Ochganlar hali tugmani ko'rmagan. (33)
    «haftada band qilingan vaqtlar» → ustunlar ustida kalendar belgisi · `QIzoh` (xato rangisiz, 04-FILTR 4 — 01-FILTR 4 bilan bir xil): Bandlar ham o'zgarishi mumkin, lekin tugmaga eng yaqin raqam — vaqt tanlaganlardan band qilganlar foizi. (106)
  - Noto'g'ri qator `err` fon oladi va qayta tanlanadi (holat o'quvchi bosganidan chiziladi — P-046).
  Joriy qator (`QIzoh`, 3/3 dan keyin): «Agar … qilsak, … o'zgaradi, chunki …» shaklidagi tekshiriladigan taxmin gipoteza deyiladi. (91) — karta yorlig'i **gipoteza** bo'ladi.
- Xulosa: Gipoteza nimani o'zgartirishimizni, qanday natija va nega kutayotganimizni, qaysi raqamga qarashimizni aytadi. (110)
- Qator (`QIzoh`, xulosadan keyin; 04-FILTR 1): «Chunki» — nega shunday kutayotganimiz. A/B test raqam o'zgardimi — shuni ko'rsatadi, sababni o'zi isbotlamaydi. (114)
- Tugadi (199): javob tugmalari yopiladi, karta va telefon butun enga, karta ostida to'liq gap: «Agar tugmada tanlangan soatni yozsak, vaqtni tanlaganlardan ko'proq o'yinchi band qiladi,
  chunki o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi. Raqam: vaqtni tanlaganlardan band qilganlar foizi.»; vizual ⛶ ichida (q17).
- Tugma (pastki): Bo'laklarni tanlang (N/3) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Joriy qatordagi javoblarni o'qing — qaysi biri o'yinchi haqida?
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: 1-darsda bu tajriba 2-asosiy natija bilan tekshiriladigan qilib ulangan (24% → 40%; tajriba OKR ning qismi emas — 01-FILTR 1). «chunki» — nega shunday kutayotganimiz haqidagi taxmin; A/B test avvalo tanlangan raqam o'zgardimi — shuni tekshiradi, sababni o'zi isbotlamaydi (B yutsa ham sabab matn aniqligi, tugma uzunligi yoki tasodif bo'lishi mumkin). Sinfdan so'rang: «Tugmada soat yozilsa, kim uchun nima o'zgaradi?»
✎ Bashorat qo'yilmadi: ekranning o'zi har bo'lakda tanlov (9-Modul 8-dars «animatsiya talabi» shakli). 1-darsdagi «bo'laklarni birma-bir qo'shing» mexanikasi takrorlanmadi.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`)
- Eyebrow: Tekshiruv · qaysi raqam
- Savol ustida kichik `AbMaket` telefoni: «‹ Bugun ›» kun strelkalari kattalashgan holatda (kulrang yorliq «yangi»).
- Savol: **Kun strelkalarini kattalashtirdingiz. Unga eng yaqin raqam qaysi?** (7 so'z) — 04-FILTR 4: «asosiy / eng yaqin» raqam
  - A — Vaqtni tanlaganlardan band qilganlar foizi (42)
  - B — Haftada band qilingan vaqtlar soni (34)
  - ✔ C — Ochganlardan vaqtni tanlaganlar foizi (37)
  - D — Dashboard'dagi «Oxirgi 5 daqiqada» raqami (36)
- To'g'ri izohi: Strelka vaqt tanlashdan oldin — o'sha qadam foizi o'zgaradi. (60)
- Xato izohlari (≤60):
  - A: Bu tugma qadami — strelka undan oldin turadi. (45)
  - B: Bandlar ham o'zgarishi mumkin — lekin strelkadan uzoqroq. (55)
  - D: Bu raqam oxirgi 5 daqiqani sanaydi — qadamni emas. (50)
  - (umumiy) Strelka qaysi qadamda? Shu qadamning raqamini toping. (53)
- Yozuvlar (barcha testlarda bir xil, qolip): To'g'ri · Qaytadan urinib ko'ring · (jonli darsda xato tanlansa) To'g'ri javob: X — …
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Right Number — birinchi urinishda to'g'ri.
- Izoh (MD): 2-ekrandagi to'g'ri raqam (A) — bu yerda chalg'ituvchi (§106: slayddan ko'chirib bo'lmaydi); «foizi» A va C da (S-003). Strelkalar — repo'dagi `‹ ›` tugmalari («Oldingi kun» / «Keyingi kun»).

## 4 · Booking.com  ← QVoqea
- Eyebrow: Biznes olamidan
- Sarlavha: **Booking.com bir vaqtda nechta tekshiruv o'tkazgan?** (50)
- Mentor: Booking.com — mehmonxonada yoki ijara uyda oldindan joy band qilinadigan sayt. «Maydon» kabi, u ham band qilish uchun qurilgan.
- Nuqtalar (5) · yorliq **Booking.com · N/5** (bashorat kartasida ham) · sahna `BookingSahna` (P-053: odam-belgilari, nuqta va chiziq, ≤4 tur belgi; logotip yo'q; sahnada raqam faqat 5/5 da, keys-faktdan).
- Bosqichlar (karta matni qisqa, karta cho'zilmaydi):
  - 1/5 **Hammaga birdan emas** — Kompaniyaning o'zi aytishicha, saytdagi deyarli har o'zgarish (tugma rangi, matn, bo'limlar tartibi) avval foydalanuvchilarning bir qismida tekshiriladi. ·
    sahna: saytga odam-belgilari oqadi; bir qismi accent halqa oladi.
  - 2/5 bashorat — **Qolganlar shu paytda nimani ko'radi?** · Yopiq sahifani · Hozirgi sahifani · Ikkalasini navbat bilan — ✔ Hozirgi sahifani.
    Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: hozirgi sahifani» yoki «Taxminingiz to'g'ri chiqdi».
  - 3/5 **Ikki guruh — bir vaqtda** — Odamlarning bir qismi A ni, qolgani B ni ko'radi, keyin raqamlar solishtiriladi. A — hozirgi variant, B — yangi. Bunday tekshiruv **A/B test** deyiladi. ·
    sahna: ikki guruh yonma-yon, ustida «A · hozirgi» va «B · yangi», ostida ikki bo'sh raqam qutisi «?».
  - 4/5 bashorat (zinapoya, S-015) — **2017-yilda Booking.com bir vaqtda nechta A/B test o'tkazgan?** · 10 dan ortiq · 100 dan ortiq · 1000 dan ortiq — ✔ 1000 dan ortiq.
  - 5/5 **Bir vaqtda — 1000 dan ortiq** — Kompaniyaning 2017-yildagi chiqishlariga ko'ra, saytda bir vaqtda 1000 dan ortiq A/B test o'tkazilgan. «Maydon»da hozircha bitta: tugma matni. ·
    sahna: ko'p kichik A/B juftliklari to'r bo'lib turadi, keyin bittasi kattalashib «Maydon» telefoniga aylanadi (A «Band qilish» · B «18:00 ni band qilish»).
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat javobi → sahna o'zgaradi: oqim → bir qismi ajraldi → ikki guruh va ikki «?» → juftliklar to'ri → «Maydon» juftligi.
  Bashoratda tanlangan javob ✓/✗ va `QTaxmin` qatori.
- Xulosa (5/5 dan keyin): Booking.com'da yangi o'zgarish avval foydalanuvchilarning bir qismida tekshiriladi, keyin ikki guruh solishtiriladi. (114)
- ✎ SABOQ 8 (qaror 81 A): bosqich gapini Mentor aytadi — matn o'zgarmaydi, joyi Mentor pufagi, har bosqichda almashadi; sahnada — bosqich nomi va jonli maket; yakuniy xulosa pastda yashil.
- ✎ SABOQ 2, 3: sahna — tanish brauzer oynasi `booking.com` (qidiruv qatori, mehmonxona kartalari — chizilgan, logotipsiz), nom-yorlig'i «Booking.com» o'z rangida (to'q ko'k);
  odam-belgilari shu oynaga oqadi; A va B — o'sha sahifaning ikki ko'rinishi (bitta tugma farqi); 5/5 da juftlik «Maydon» telefoniga aylanadi. Mavhum blok-maket — rad. Namuna — m6-02 `AltairMock`, m6-14 `DeckMock`.
- Tugma (pastki): Keyingi bosqich (N/5) → Davom etish
- O'qituvchi eslatmasi: Booking 5-Modulda «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?» darsida «A/B» so'zisiz ko'rilgan — bugun atama va 2017-yil raqami qo'shildi.
  Booking qaysi testda nimani topgani aytilmaydi — bankda yo'q. Raqam — kompaniyaning ochiq chiqishlaridan (bank: 2017).
✎ Brend izohi Mentorda, bir marta (S-018). Ikki bashorat — har slaydda bittadan (S-015). Sarlavhadagi savolga javob — 5/5.

## 5 · Ikki guruh  ← QTushuncha
- Eyebrow: Tushuncha · ikki guruh
- Sarlavha: **Qaysi o'yinchi A ni, qaysi biri B ni ko'radi?** (45)
- Mentor: Sinfdoshlar bugun «Maydon»ni telefonida ochadi — ularni ikki guruhga bo'lish kerak. Har usulni sinab, maketga qarang.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; zinapoya — S-015): **Nechta usulda guruhlarni to'g'ri solishtirsa bo'ladi?** · Bittasida · Ikkitasida · Uchalasida — tanlov saqlanadi.
- O'ng (vizual): `AbMaket` — tepada kirish oqimi (brauzer belgilari), o'rtada ajratgich, pastda ikki telefon: A «Band qilish» | B «18:00 ni band qilish»; ostida mini uch qadam (bo'sh).
- Chap (harakat) — usul tugmalari (har biri sinab ko'riladi):
  1. Bu hafta hammaga B, keyin o'tgan hafta bilan solishtirish
  2. Har ochilishda tasodifiy — brauzer eslab qolmaydi
  3. Birinchi kirishda tasodifiy — keyin brauzer eslab qoladi
- **Harakat → Vizual o'zgarish:** usulni bosish → maket o'sha usul bilan yuradi:
  - 1 → ajratgich o'rnida kalendar: «O'tgan hafta · A» va «Bu hafta · B»; «Bu hafta» katagiga kulrang karta «Mahalla chatida e'lon» tushadi; B telefoni ostidagi foiz yorlig'i «?» va yuqoriga strelka;
    pufak «Foiz o'zgardi — tugmadanmi, e'londanmi?» · `QXato`: Bu hafta e'lon ham chiqdi — farq qayerdan kelgani noma'lum. (59)
  - 2 → bitta brauzer `c2a8…` sahifani uch marta yangilaydi: tugma «Band qilish» → «18:00 ni band qilish» → «Band qilish»; uning belgisi ikkala telefon tomonida turadi (ikki rangli halqa);
    pufak «Qaysi tugmani ko'rib band qildim?» · `QXato`: Bitta brauzer ikkala guruhga tushdi — qaysi biriga sanaysiz? (60)
  - 3 → brauzerlar birin-ketin kiradi, har biri A yoki B halqani tasodifiy oladi va o'z telefoni tomoniga o'tadi; `c2a8…` sahifani yangilaydi — B da qoladi (halqa yashil ✓ bilan bir lahza yonadi);
    ikki telefon bir vaqtda ishlaydi, ikki guruhdagi belgilar soni sal farq qiladi; yorliq «bir vaqtda · har brauzer o'z variantida».
  Natija qatori (`QTaxmin`, 3/3 dan keyin): «Taxminingiz: … · haqiqatda: bittasida» yoki «Taxminingiz to'g'ri chiqdi».
  Joriy qator (`QIzoh`, 3/3 dan keyin): Tasodifiy bo'lishda guruhlar teng chiqmasligi mumkin — shuning uchun foiz solishtiriladi. (89)
- Xulosa: Bu testda A va B bir vaqtda ishlaydi, har brauzer esa birinchi olgan variantida qoladi. (87)
- Tugadi (199): usul tugmalari yopiladi, maket 3-usul holatida butun enga; vizual ⛶ ichida.
- Tugma (pastki): Usullarni sinab ko'ring (N/3) → Davom etish
- Ipucha (40 s): Hali bosilmagan usulni sinab ko'ring — maketda nima o'zgarishini kuzating.
- O'qituvchi eslatmasi: «Nega o'tgan hafta bilan solishtirmaymiz?» — haftalar orasida boshqa narsa ham o'zgaradi (e'lon, bayram, ob-havo). «Eslab qoladi» — brauzer xotirasi (localStorage), brauzer ID yonida.
  Bitta o'yinchi telefon va laptopdan kirsa, ikki xil variant ko'rishi mumkin: variant brauzerga beriladi, odamga emas (kartochka 8).
✎ «Mahalla chatida e'lon» — 1-darsdagi «Qilinadigan ishlar» qatori (e'lonlar 0 → 4); 1-usulda real raqam yo'q — faqat «?» (T-043, KORPUS §36).

## A1 · Amaliyot 1 — variant va tugma matni  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈27 daq; `screens[6]`)
- Eyebrow: Amaliyot 1 · variant
- Sarlavha: **Brauzer B ni olsa, tugmada tanlangan soat chiqsin.** (50)
- Mentor: Talab tayyor — siz `{qachon va qanday olsin}` joyini yozasiz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Birinchi terminalda `cd backend`, `npm run start:dev`; ikkinchisida `cd web`, `npm run dev`. Brauzerda `localhost:5173` — kataklar chiqsin.
  2. **Prompt** — `{qachon va qanday olsin}` joyiga brauzer variantni qachon va qanday olishini yozing (uch usulli mashqni eslang), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: Backend'da `hodisalar` jadvali va `POST /hodisalar`; saytda `web/src/hodisa.js` va «Band qilish» tugmasi (`web/src/BandForma.jsx`).
     > Nima qilsin: `hodisalar` ga `variant` ustunini qo'sh — `A` yoki `B`, eski qatorlarda bo'sh. Brauzer variantni **{qachon va qanday olsin}**; variant localStorage'dagi `maydon-variant` da tursin.
     > `hodisaYoz` har hodisaga `variant` ni qo'shib yuborsin. Tugma matni: A — «Band qilish», B — tanlangan soat bilan, masalan «18:00 ni band qilish».
     > Nima buzilmasin: uch hodisa va brauzer ID, band qilish va «Bu vaqt band» xabari, `/ega` va `/dashboard`. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordam (bosilsa ochiladi — namuna ibora): «birinchi kirishda A yoki B ni teng ehtimol bilan olsin va keyin o'zgartirmasin»
  3. **Ishga tushirish** — Backend terminali o'zi qayta yukladi (yangi ustun ham o'zi qo'shiladi), sayt o'zi yangilandi, xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — talabning har qatorini tekshiring:
     (1) `localhost:5173` da bo'sh katakni bosing: forma ostidagi tugmada «Band qilish» yoki siz bosgan soat bilan matn. Sahifani yangilang (F5) va yana bosing — matn o'sha: variant eslab qolindi.
     (2) Hamma inkognito oynalarni yoping va yangisini oching (Chrome va Edge: Ctrl+Shift+N, Mac — Cmd+Shift+N) — sayt uni yangi brauzer deb ko'radi va variantni qaytadan beradi.
     O'sha matn yana chiqishi ham to'g'ri — tasodif. Ikkala matnni sinfdoshlar telefonida ko'rasiz (Amaliyot 2). (04-FILTR 10)
     (3) Neon SQL Editor'da: `SELECT nom, brauzer_id, variant FROM hodisalar ORDER BY yaratilgan DESC LIMIT 6;` — yangi qatorlarda `variant` A yoki B, bitta brauzer ID ning hamma qatorida bir xil.
     Mos kelmagan qatorni uch qism bilan agentga yozing. Hammasi mos bo'lsa: `git add .`, `git commit -m "A/B variant"`, `git push` —
     Render va Netlify kodni GitHub'dan olib, o'zi yangilanadi (bir necha daqiqa).
  5. **O'z g'oyangiz** — loyihangiz uchun gipoteza yozing. Javoblaringiz ostidagi promptning qavslariga o'zi qo'yiladi — «Nusxalash», uyda o'z loyihangizda yuborasiz.
     - Kirish qatori (kulrang, forma tepasida; P-046): `pm-m8d1-okr` da tajriba bo'lsa — «Siz yozgan tajriba: {tajriba} · {N}-asosiy natija bilan tekshiriladi: {asosiy natija}»;
       yo'q bo'lsa yoki «?» — bitta maydon «Loyihangizda qaysi bitta o'zgarishni sinab ko'rasiz?» (tayanch 9.8).
     - Forma (bitta ustun; gipoteza kartasi bilan bir xil to'rt qator; placeholder qisqa, tayyor javobsiz — §32):
       Agar … qilsak — «Nima o'zgartirasiz?» (tajriba bo'lsa, uning matni oldindan yozilgan bo'ladi, tahrirlasa bo'ladi) · … o'zgaradi — «Odamlar nimani boshqacha qiladi?» ·
       chunki … — «Nega shunday deb o'ylaysiz?» · Raqam — «Qaysi raqamga qaraysiz?» (OKR bo'lsa, ostida kulrang maslahat: «OKR'ingizdagi asosiy natija: {asosiy natija}»).
     - Tekshiruv (`QXato`, ≤60; forma ostida, yozilgan zahoti — 106d):
       bo'sh qator (bloklaydi): Bu bo'lak bo'sh — uni ham yozing. (33) ·
       «o'zgaradi» da «yaxshiroq», «chiroyli», «zo'r» (yo'naltiradi): Yaxshiroq — qayerda? Odamlar nimani boshqacha qiladi? (53) ·
       «Raqam» da sanaladigan so'z yo'q — son, «foiz», «soni», «nechta», «ta» (yo'naltiradi): Qanday sanaysiz? Masalan: «… foizi» yoki «… soni». (50)
     - «Saqlash» → `pm-m8d4-gipoteza`; kartada to'liq gap yig'iladi, javoblar prompt qavslariga qo'yiladi:
       > Qayerda: **{loyiha papkasi}** — hodisa yuboradigan funksiya va **{o'zgarish joyi}**.
       > Nima qilsin: brauzer birinchi kirishda A yoki B ni tasodifiy olsin va eslab qolsin; har hodisaga `variant` qo'shilsin. A — hozirgidek, B — gipotezam bo'yicha: «Agar **{agar}**».
       > Nima buzilmasin: hozirgi hodisalar va asosiy sahifa. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Kulrang qator (prompt ostida): Loyihangizda hodisa yuboradigan funksiya hali bo'lmasa — promptni saqlab qo'ying. (81)
     - «Bajardim» — gipoteza saqlangach ochiladi.
- O'ng tomon — «kutilgan natija · namuna: Maydon»: ikki telefon (chap — `localhost:5173`, o'ng — inkognito oyna), forma «Bugun · 18:00–19:00»:
  chapda tugma «Band qilish» · o'ngda «18:00 ni band qilish». Ostida karta «Neon · SQL Editor» → `nom · brauzer_id · variant`:
  `vaqt-tanladi · 9e07… · B` · `ochdi · 9e07… · B` · `vaqt-tanladi · b41d… · A` · `ochdi · b41d… · A`.
  Kichik izoh: Sizda variant boshqacha chiqishi mumkin — u tasodifiy.
- Hammasi bajarilgach (yashil): Har brauzer o'z variantini oldi: B da tugmada tanlangan soat chiqadi. (69)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-04-start` (`.env` fayllaringiz o'zgarmaydi)
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: laptopdagi Backend ham, Render'dagisi ham bitta Neon Database'ga yozadi (tayanch 9.11). Ustunni `synchronize: true` qo'shadi — bu kursdagi vaqtinchalik sozlama:
  eski kod bilan qayta ishga tushgan Render Backend'i yangi ustunni o'chirib yuborishi mumkin, shuning uchun push shu blok oxirida va eski teg prodga yuborilmaydi. Prod'da `synchronize` xavfli —
  8-darsdagi prod ro'yxatida «keyin» ishi; migratsiya — keyingi modullarda (GATE M M-q2 A). Teng ehtimol kichik guruhda teng bo'linishni bermaydi — 5-ekran shu haqda.
  5-qadam — darsning asosiy yozma ishi: 6–7 daqiqa bering; juftlikda sherigining gipotezasini o'qisin: «nima o'zgaradi va qaysi raqamga qaraysiz?» savoliga javob bormi.
✎ `{qachon va qanday olsin}` — 5-ekrandagi to'g'ri usulning o'z so'zlari bilan yozilishi; 4-qadam (1)–(2) aynan shu joyni tekshiradi. «Ortda qoldingizmi» — tayanch 3 naqshi.

## A2 · Amaliyot 2 — dashboard'da A va B, sinfdoshlar ochadi  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈25 daq; `screens[7]`)
- Eyebrow: Amaliyot 2 · dashboard va sinfdoshlar
- Sarlavha: **Dashboard A va B foizini yonma-yon ko'rsatsin.** (46)
- Mentor: Endi «Nima qilsin» qatorini o'zingiz yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti. `localhost:5173/dashboard` ga ega paroli bilan kiring: «Oxirgi 5 daqiqada» va uch qadam bor, A va B hali yo'q.
  2. **Prompt** — `{nima qilsin}` qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: Backend'da `GET /hodisalar/sanoq`; saytda `/dashboard` sahifasi (`web/`).
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: «Oxirgi 5 daqiqada» va uch qadam, har 5 soniyalik so'rov, parol bilan kirish va `POST /hodisalar`. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordam (bosilsa ochiladi — namuna qator): «Nima qilsin: sanoq javobiga `variantlar` qo'shilsin — A va B uchun `vaqt-tanladi`, `band-qildi` (shu kun, turli brauzerlar soni) va `foiz`
     (band qildi / vaqtni tanladi × 100, butun songa yaxlitlab; hech kim tanlamagan bo'lsa — 0). Dashboard uch qadam ostida A va B ni yonma-yon ko'rsatsin.»
  3. **Ishga tushirish** — laptopda dashboard'da A va B qatori chiqdi. Keyin `git add .`, `git commit -m "A/B dashboard"`, `git push` — Render va Netlify o'zi yangilanadi (bir necha daqiqa).
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Sinfdoshlar bilan tekshirish** — Netlify manzilingizni (`….netlify.app`) 3–4 sinfdoshingizga bering: ular telefonida ochib, o'zi xohlagan vaqtni tanlasin;
     band qilish-qilmasligini o'zi hal qiladi (ism va telefon — namuna). Telefonlarni yonma-yon qo'ying: tugmada ikki xil matn chiqishi mumkin.
     Siz `….netlify.app/dashboard` da ega paroli bilan kuzating: A va B qatori keyingi so'rovdan keyin yangilanadi.
     Bepul Backend uxlab qolgan bo'lsa, birinchi javob kechikishi mumkin — taxminan bir daqiqagacha (Render hujjati, tayanch 6). Netlify yoki Render yangilanmasa — tekshiruvni laptopda inkognito oyna bilan qiling, push'ni mentor bilan ko'rasiz.
  5. **O'z g'oyangiz** — shu promptni o'z loyihangiz uchun yozing: dashboard gipotezangizdagi raqamni A va B uchun ko'rsatsin. Qavslarni to'ldiring, «Nusxalash» — uyda yuborasiz.
     > Qayerda: **{loyiha papkasi}** — dashboard yoki ega ko'radigan sahifa.
     > Nima qilsin: A va B uchun **{gipotezangizdagi raqam}** yonma-yon chiqsin; har variantda turli brauzerlar sanalsin.
     > Nima buzilmasin: **{nima buzilmasin}**. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     (`{gipotezangizdagi raqam}` — A1 da saqlangan gipotezaning «Raqam» qatoridan o'zi qo'yiladi; saqlanmagan bo'lsa — o'quvchi yozadi. «Bajardim» — «Nima buzilmasin» yozilgach.)
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `maydon-….netlify.app/dashboard`, `DashMaket`):
  - Maydon · dashboard
  - tepada «Oxirgi 5 daqiqada» va uch qadam — kulrang, raqamsiz (bu maketda e'tibor A/B qismida; TAYANCHGA SAVOL 5)
  - **A/B test · tugma matni**
  - A · «Band qilish» — vaqtni tanladi 9 · band qildi 3 · 33%
  - B · «18:00 ni band qilish» — vaqtni tanladi 8 · band qildi 4 · 50%
  - kichik izoh: har variantda — turli brauzerlar soni · Sizda raqamlar boshqacha — o'z tekshiruv bosishlaringiz ham sanaladi.
- Qator (`QIzoh`, natija ostida; 04-FILTR 6): A ning foizi faqat A ni ko'rgan brauzerlardan, B niki — faqat B ni ko'rganlardan chiqadi. (99)
- Qator (`QIzoh`, ostida; tayanch 1 — halol gap aynan): 17 ta brauzer xulosa uchun kam — bu ishga tushirish mashqi. (54)
- Hammasi bajarilgach (yashil): B varianti sinfdoshlarga ketdi, dashboard A va B foizini ko'rsatadi. (68)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-04-done` (Render va Netlify o'zingizniki — 9-Moduldagi deploy'dan)
- Nishon (bonus): B Launched — oxirgi «Bajardim»da (5-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: o'quvchilar saytidagi raqamlar 9 · 3 va 8 · 4 bo'lmaydi — bu Mentor saytidagi sinf holati. Dashboard bugungi kunni ko'rsatadi (kun almashtirgichi yo'q — tayanch 9.4):
  uyda kirgan odamlarning raqamini o'quvchi o'sha kuni yozib qo'yadi (uyga vazifa ②). Bir haftalik yakun — 8-darsda, Neon SQL bilan.
✎ «B varianti shu darsda foydalanuvchilarga ketadi» (dastur) — shu blokning 4-qadami. Sinfdoshlar — real o'yinchi emas: buni «ishga tushirish mashqi» gapi aytadi.

## 8 · 2-savol  ← QTest (✔ B, `correctIdx 1`; yakuniy — ikki blok va PM qismi birga)
- Eyebrow: Yakuniy tekshiruv
- Savol ustida kichik `DashMaket` A/B qismi: A · «Band qilish» — 9 · 3 · 33% · B · «18:00 ni band qilish» — 8 · 4 · 50%.
- Savol: **B ning foizi yuqori. Endi nima qilasiz?** (7 so'z)
  - A — B yutdi — hammaga B ni qo'yamiz (31)
  - ✔ B — Ma'lumot hali kam — test davom etadi (37)
  - C — Guruhlar teng emas — test noto'g'ri (35)
  - D — A yaxshiroq — vaqt tanlaganlar ko'p (35)
- To'g'ri izohi: 17 ta brauzer xulosa uchun kam — bu ishga tushirish mashqi. (54)
- Xato izohlari (≤60):
  - A: B oldinda — rost. Lekin 17 ta brauzer xulosaga yetadimi? (51)
  - C: Tasodifiy bo'lishda 9 va 8 — tabiiy, foiz solishtiriladi. (57)
  - D: Vaqt tanlash tugmadan oldin — gipotezadagi raqam qaysi? (55)
  - (umumiy) Nechta brauzer bor? Shu son xulosaga yetadimi? (47)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Patient Tester — birinchi urinishda to'g'ri.
- Izoh (MD): tire to'rttala variantda (S-003); har noto'g'ri javob darsning o'z qoidasi bilan noto'g'ri: A — halol gap (A2), C — guruhlar teng chiqmasligi mumkin (5-ekran), D — raqam tugma qadamida (2, 3-ekran) — S-004.
  Hook savoliga (0-ekran) javob shu yerda: qaysi biri yaxshiroq ekanini raqam ko'rsatadi, lekin 17 ta brauzerdan chiqqan raqam hali kam.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol + 2 blok «Bajardim» (`PRACTICE_BASE`, ball yo'q — 3-dars naqshi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Strelka qaysi raqamga tegadi» · 8 — «Yakuniy — 17 ta brauzer»

## Kartochkalar — alohida ekran (`sflash`, 11 / 12)  ← QKartochka
- ✎ SABOQ 12 (9-Modul F-1005-88, foydalanuvchining qat'iy qoidasi 05.10): kartochkalar yakun ichida emas — alohida ekran. Tartib: … → podium → **kartochkalar** → yakun.
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16).
- Kartochkalar — 12 ta, matn o'zgarmagan (jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N ·
  birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 10 · Dars yakuni  ← QYakun (kartochkalar — oldingi alohida ekranda)
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha: **Gipoteza endi raqam bilan tekshirilmoqda.** (40) — 04-FILTR
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`, kartochkaga qo'shilmaydi): Gipoteza qaysi raqamga qarashni oldindan aytadi, A/B test shu raqamni ikki guruhda bir vaqtda solishtiradi. (107)
- Endi siz bilasiz (asosiy fikr yuqorida — bu yerda takrorlanmaydi, T-048):
  - Bu misolda raqam — o'zgarishga eng yaqin qadamning foizi.
  - A va B bir vaqtda ishlasa, boshqa vaqtga xos o'zgarishlar kamroq aralashadi.
  - Bizning testda har brauzer variantni tasodifiy oladi va o'sha variantda qoladi.
  - Tasodifiy bo'lishda guruhlar teng chiqmasligi mumkin, shuning uchun foiz solishtiriladi.
  - 17 ta brauzer xulosa uchun kam: bugungi test — ishga tushirish mashqi.
- Uyga vazifa (`HwCard` yakun ekranida — alohida `.homework.jsx` yo'q, tayanch 4) · sarlavha: **Uyda nima qilasiz?**
  - Kim uchun: «Maydon» nusxangiz va o'z loyihangiz · Nechta: 3–5 kishi · Muddat: keyingi darsgacha
  - ① Netlify havolangizni 3–5 kishiga yuboring (oila, do'stlar): «Bo'sh vaqtni tanlab ko'ring». Ism va telefon o'rniga namuna yozishlarini ayting.
  - ② Ular kirgan kuni `/dashboard` ni oching va A, B qatorini yozib qo'ying: vaqtni tanladi, band qildi, foiz.
  - ③ Amaliyot 1 da saqlagan promptni o'z loyihangizga yuboring; hodisalar hali bo'lmasa — saqlab qo'ying.
  - Karta ostida (bitta kulrang qator): Bir-ikki kishi kirsa ham yozing — bu kuzatuv, xulosa emas. (55)
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Kiberxavfsizlik: zaiflikni topib yopamiz».
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- Izoh (MD): uyga vazifa ① da namuna ism va telefon — real odam telefoni mashq saytiga yozilmasin (6-dars mavzusi — maxfiylik; TAYANCHGA SAVOL 7).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Hypothesis Builder!** (2-ekran, birinchi urinishda xatosiz) — Gipotezaning uch bo'lagini birinchi urinishda to'g'ri tanladingiz
- **Right Number!** (3-ekran, birinchi urinishda) — O'zgarish tegadigan raqamni birinchi urinishda topdingiz
- **Patient Tester!** (8-ekran, birinchi urinishda) — 17 ta brauzerdan chiqqan raqamdan shoshilib xulosa chiqarmadingiz
- **B Launched!** (A2, oxirgi «Bajardim» — bonus, P-048: ish bajarilgan) — B variantingiz sinfdoshlarga ketdi
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (B Launched, S-034); 5-ekran (usullar) nishonsiz — har usul sinab ko'riladi.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · Eng yaqin raqam** — 1 Bu misolda o'zgarish qaysi qadamda turganini toping: kun strelkalari — vaqt tanlashdan oldin. ·
  2 Raqam — o'sha qadamning foizi: ochganlardan vaqtni tanlaganlar. · 3 Tugma matni esa keyingi qadamga tegadi: vaqtni tanlaganlardan band qilganlar.
  - Sinfga savol: Formadagi «Ism» qatorini olib tashlasak, qaysi raqamga qaraysiz?
- **8 · 17 ta brauzer** — 1 A: 9 tadan 3 — taxminan 33 foiz. · 2 B: 8 tadan 4 — 50 foiz. · 3 17 ta brauzer xulosa uchun kam — test davom etadi, raqam kuzatiladi.
  - Sinfga savol: B oldinda. Nega hali hammaga B ni qo'ymaymiz?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Gipoteza nima? | «Agar … qilsak, … o'zgaradi, chunki …» shaklidagi tekshiriladigan taxmin | Yoniga qaysi raqamga qarashingiz yoziladi |
| «Maydon» gipotezasi qanday? | Agar tugmada tanlangan soatni yozsak, vaqtni tanlaganlardan ko'proq o'yinchi band qiladi | Chunki o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi |
| Gipotezadagi «chunki» nima uchun kerak? | O'zgarish odamga nega ta'sir qilishini aytadi | Sabab ham taxmin — uni raqam tekshiradi |
| Tugma matni o'zgarsa, qaysi raqamga qaraysiz? | Vaqtni tanlaganlardan band qilganlar foiziga | Tugma vaqt tanlangandan keyin chiqadi |
| A/B test nima? | Odamlarning bir qismi A ni, qolgani B ni ko'radi, keyin raqamlar solishtiriladi | A — hozirgi variant, B — yangi |
| Nega hammaga B ni ko'rsatib, o'tgan hafta bilan solishtirmaymiz? | Haftalar orasida boshqa narsa ham o'zgaradi | Masalan, mahalla chatida e'lon chiqadi |
| Bizning testda brauzer variantni qanday oladi? | Birinchi kirishda tasodifiy, keyin eslab qoladi | `maydon-variant` — sahifa yangilansa ham o'sha variant |
| Bitta o'yinchi telefon va laptopdan kirsa, qaysi variantni ko'radi? | Har brauzerda alohida — ikki xil bo'lishi mumkin | Variant brauzerga beriladi, odamga emas |
| Guruhlar 9 va 8 chiqsa, nimani solishtirasiz? | Har guruhdagi foizni | Tasodifiy bo'lishda guruhlar teng chiqmasligi mumkin |
| A — 9 tadan 3, B — 8 tadan 4. Xulosa chiqarasizmi? | Hali yo'q: 17 ta brauzer xulosa uchun kam | Bu — ishga tushirish mashqi |
| Booking.com o'zgarishni qanday tekshiradi? | Avval foydalanuvchilarning bir qismida, A/B test bilan | 2017-yilda bir vaqtda 1000 dan ortiq A/B test (kompaniya chiqishlari) |
| Hodisa qaysi variantdan kelganini Backend qanday biladi? | `hodisaYoz` har hodisaga `variant` ni qo'shadi | `hodisalar` jadvalida `variant` ustuni |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi atama darsda bor (gipoteza — 2, A/B test — 4, usullar — 5, `maydon-variant` — A1, foiz — A2, `variant` ustuni — A1). S-027: har old tomon — to'liq savol.

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda.
1. Gipoteza qaysi shaklda yoziladi? (2)
   - ✔ A — Agar … qilsak, … o'zgaradi, chunki …
   - B — … ni qilamiz, chunki bu juda yaxshi g'oya
   - C — Hozir … ta bor, oy oxirida … taga yetsin
   - D — Avval … ni qilamiz, keyin … ni ko'ramiz
2. «Maydon» gipotezasida «chunki» qismi qaysi? (2)
   - A — Tugmada tanlangan soatni yozsak
   - ✔ B — O'yinchi tanlagan vaqtini tugmada ko'radi
   - C — Vaqtni tanlaganlardan ko'proq o'yinchi band qiladi
   - D — Vaqtni tanlaganlardan band qilganlar foizi
3. «Band qilish» tugmasi qaysi qadamdan keyin chiqadi? (2)
   - A — Sahifa ochilgandan keyin
   - B — Band qilib bo'lgandan keyin
   - ✔ C — Vaqtni tanlagandan keyin
   - D — Parolni kiritgandan keyin
4. A/B testda variant A qaysi biri? (4)
   - A — Yangi, sinab ko'riladigan variant
   - B — Ega o'zi tanlagan eng yaxshisi
   - C — Dashboard'da birinchi turgani
   - ✔ D — Hozirgi, o'zgarmagan variant
5. Nega A va B bir vaqtda ishlaydi? (5)
   - ✔ A — Boshqa vaqtning farqi aralashmasligi uchun
   - B — Backend'ga kamroq so'rov kelishi uchun
   - C — O'yinchi ikkalasini solishtirishi uchun
   - D — Dashboard'dagi raqamlar tezroq chiqishi uchun
6. Bizning testda brauzer variantni qachon oladi? (5, A1)
   - A — Har safar sahifa yangilanganda
   - ✔ B — Birinchi kirganda, bir marta
   - C — Band qilish tugmasini bosganda
   - D — Ega dashboard'ni ochgan paytda
7. Brauzer sahifani yangilaganda A ni ham, B ni ham ko'rdi. Muammo nima? (5)
   - A — Tugma matni juda uzun bo'lib qoldi
   - B — Backend hodisani qabul qilmay qo'ydi
   - ✔ C — Uni qaysi guruhga sanash noma'lum
   - D — Brauzer ID har safar yangilanadi
8. A — 9 tadan 3, B — 8 tadan 4. B ning foizi qancha? (A2)
   - A — 4 foiz
   - B — 33 foiz
   - C — 12 foiz
   - ✔ D — 50 foiz
9. Guruhlar 9 va 8 chiqdi. Bu nimani bildiradi? (5)
   - ✔ A — Tasodifiy bo'lishda bu tabiiy hol
   - B — Bo'lish noto'g'ri, qayta boshlash kerak
   - C — B guruhidagi tugma kamroq yoqqan
   - D — Kimdir ikki marta sanalib qolgan
10. 2017-yilda Booking.com bir vaqtda nechta A/B test o'tkazgan? (4)
    - A — 10 dan ortiq
    - ✔ B — 1000 dan ortiq
    - C — 100 dan ortiq
    - D — 5000 dan ortiq
11. Hodisa qaysi variantdan kelganini Backend qanday biladi? (A1)
    - A — Brauzer ID ning birinchi harfidan
    - B — Hodisa yozilgan soat va daqiqadan
    - ✔ C — Hodisa bilan kelgan variantdan
    - D — Ega sahifasidagi bandlar ro'yxatidan
12. Gipotezada «sayt yaxshiroq bo'ladi» deyilgan. Nima yetishmaydi? (2)
    - A — Qancha vaqt kutish kerakligi
    - B — Saytga nechta odam kirishi
    - C — Kodni kim yozishi kerakligi
    - ✔ D — Qaysi raqam o'zgarishi

- Har savolda to'g'ri javob yolg'iz eng uzun emas (S-006; 10-savolda D bilan teng); kod belgisi (backtick) arenada yo'q; savollar ≤12 so'z.
- 8-savol — hisob (4 / 8); B «33 foiz» — A guruhining foizi (guruhlarni aralashtirish), C «12 foiz» — sonlarni qo'shish. 10-savol D «5000 dan ortiq» — bankdagi «1000 dan ortiq» dan oshiq, manbada yo'q.
- Kalit ibora testlar bilan takrorlanmaydi (S-008): 3-ekran (strelka → oldingi qadam) ↔ arena 3 (tugma → qaysi qadamdan keyin) · 8-ekran (qaror) ↔ arena 9 (guruhlar teng emasligi ma'nosi).
- **Fon so'zlari** (R-008, kodda {uz, ru}): gipoteza · A/B test · variant A · variant B · foiz · tugma · «Band qilish» · `maydon-variant` · `variant` · dashboard · Booking.com · Maydon.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/8-Modull/PmAbTestLesson.jsx`; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `m8-04-v1`, `lessonTitle` «Ikki variantdan qaysi biri yaxshiroq ishlaydi?».
2. `SCREEN_META` 12: hook · plan · concept · test · story · concept · practice (A1) · practice (A2) · test · stats · flashcards · summary (kartochkalar alohida — SABOQ 12).
   `INLINE_KEYS` { 3: 2, 8: 1 }; `gipoteza: -1`, `usullar: -1`, bloklar `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — test ekranlari (3, 8).
3. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s5 `QTushuncha` (`zoom`, `tugadi` — q17/q18; s5 da `QBashorat` + `QTaxmin`) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s4 `QVoqea` ·
   s6/s7 `QBlok` (`ScreenBlok` ulagichi, 5 qadam) · s9 `QNatija` · `sflash` `QKartochka` (alohida) · s10 `QYakun`.
4. **Bitta vizual `AbMaket`** (qolipda yo'q, yangi; 180): `MAYDON_AB` const — `tugma: { A: 'Band qilish', B: soat => \`${soat} ni band qilish\` }` · `GIPOTEZA` { agar, ozgaradi, chunki, olchov } (A-6 matni) ·
   `SINF` { A: { tanladi: 9, band: 3 }, B: { tanladi: 8, band: 4 } } → foiz `Math.round(band / tanladi * 100)` (33, 50) · `USULLAR` (3, s5) · `QISMLAR` (3 qator × javoblar, s2).
   Holatlar: bitta telefon (hozir/yangi) · ikki telefon A|B · mini uch qadam + foiz yorlig'i · kirish oqimi va ajratgich · gipoteza kartasi (bo'sh · yozildi · joriy · xato) · o'yinchi pufagi · kalendar + e'lon kartasi.
   0, 1, 2, 3, 5-ekranlar va A1 o'ng tomoni shundan. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: ab-telefon ab-qism ab-usul`). `reduced-motion` — o'tishsiz. Telefon kengligida (393) ikki telefon ustma-ust.
5. **`DashMaket`** — 3-darsdagi ko'rinish (`m8-03`), bugun qo'shiladigan «A/B test · tugma matni» qismi bilan (ikki qator, `SINF` dan). A2 o'ng tomoni va s8 savol ustida.
   3-dars komponenti bilan bitta manba bo'lishi kerak (umumiy joyga ko'chirish yoki nusxa — TAYANCHGA SAVOL 10).
6. **`BookingSahna`** (s4, P-053): 5 kadr (oqim → bir qismi ajraldi → ikki guruh + ikki «?» → juftliklar to'ri → «Maydon» juftligi); logotip yo'q; raqam faqat 5/5 karta matnida.
7. s2 — `QISMLAR` (o'zgaradi 3 · chunki 2 · raqam 3), to'g'ri javob → karta qatori + telefon holati, xato → `QXato` + pufak + `err` fon; 3/3 da `QIzoh` (gipoteza ta'rifi) va karta yorlig'i; nishon — birinchi urinish.
8. s5 — 3 usul (har biri bosiladi, N/3), maket ssenariylari (kalendar va e'lon · `c2a8…` uch marta yangilash · tasodifiy bo'lish + eslab qolish); `QBashorat` (1/2/3), `QTaxmin`, `QIzoh`.
9. A1/A2 — `ScreenBlok` (skelet) + `QBlok` + `QPrompt` (9-Modul `src/7-Modull/MvpFirstScreenLesson.jsx` naqshi: `GoyaForma`, `yordam`, `forma: true`, `XATO_YOLI`). Har blok **5 qadam**.
   - A1 promptida bitta joy `{qachon va qanday olsin}` + «Yordam» (namuna ibora); A2 — `{nima qilsin}` + «Yordam» (namuna qator). 4-qadam nomi: «Brauzerda tekshirish» (A1) · «Sinfdoshlar bilan tekshirish» (A2).
   - `ortda`: A1 `m10-dars-04-start`, A2 `m10-dars-04-done` (`ORTDA_FETCH` — `git fetch https://github.com/Azizbekcrypto/maydon --tags`).
   - **A1 5-qadam — gipoteza formasi** (`GoyaForma`): o'qiydi `pm-m8d1-okr` (`tajriba.nima`, `tajriba.natija` → `natijalar[natija − 1].nima`; tayanch 9.8; yo'q yoki «?» — bo'sh maydon);
     4 maydon + tekshiruv (bo'sh · «yaxshiroq/chiroyli/zo'r» · raqam so'zi yo'q) — PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi;
     yozadi `pm-m8d4-gipoteza` = `{ agar, ozgaradi, chunki, olchov, savedAt }` (tayanch 8); prompt qavslari (`{agar}`) formadan; o'quvchi yozadigan qavslar — `{loyiha papkasi}`, `{o'zgarish joyi}`.
   - **A2 5-qadam** — `{gipotezangizdagi raqam}` `pm-m8d4-gipoteza.olchov` dan; yo'q bo'lsa — o'quvchi yozadi.
   - Artefakt-strip (U-042): A1 5-qadamidan keyin — «Gipotezam» (ixcham); A2 va yakunda ko'rinadi, test, arena va podiumda yo'q.
10. Testlar s3/s8 — matn yuqoridagidek, variantlar uzunligi `git diff` dan keyin skript bilan qayta sanaladi; s3 ustida kichik telefon (strelkalar), s8 ustida `DashMaket` A/B qismi.
    `RECAPS` { 3, 8 } (`ask` + 3 karta, PM — raqam 1/2/3); `Q_LABELS` { 3, 8 }.
11. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s2 birinchi urinish xatosiz → Hypothesis Builder · s3 birinchi urinish → Right Number · s8 birinchi urinish → Patient Tester · A2 oxirgi «Bajardim» → B Launched.
12. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3) + `set_quiz_keys`; fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}). `SCREEN_INTENTS`.
13. s10 `QYakun`: `recap` 5 qator, «Bugungi asosiy fikr» `small` (kartochkalar — alohida `sflash`, `FLASHCARDS` 12), `uyga` — `HwCard` yakun ekranida (alohida `.homework.jsx` yo'q), `keyingi` matni.
    Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
14. App.jsx `m8-04` qatoriga `comp: PmAbTestLesson` ulash — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓). App.jsx ga bu bosqichda tegilmaydi.
- Darvozalar: `npm run gates -- src/8-Modull/PmAbTestLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

## REPO — `maydon` ga qo'shiladigan narsalar (`m10-dars-04-start` → `m10-dars-04-done`; yozish — «qur» da, 9-Modul repo'si yopilgandan keyin, qaror 3)
1. **`m10-dars-04-start`** = `m10-dars-03-done` (tayanch 3 naqshi: keyingi dars boshi = oldingi dars oxiri).
2. **`m10-dars-04-done`** = start + A1 + A2 namunasi («Maydon»), tayanch 3 jadvali aynan:
   - `backend/`: `Hodisa` entity'ga `variant` ustuni (`A` / `B`, `nullable` — eski qatorlar bo'sh; `synchronize` o'zi qo'shadi).
     `POST /hodisalar`: `variant` — `A`, `B` yoki yo'q; boshqa qiymat — `400` (`nom` va `brauzer_id` tekshiruvi o'zgarmagan) — TAYANCHGA SAVOL 4.
     `GET /hodisalar/sanoq?kun=` javobiga `variantlar: { A: { "vaqt-tanladi", "band-qildi", foiz }, B: { … } }`: shu kun (Toshkent vaqti), har (nom, variant) uchun `COUNT(DISTINCT brauzer_id)`;
     `foiz` = `Math.round(band-qildi / vaqt-tanladi * 100)`, `vaqt-tanladi` 0 bo'lsa — 0 (TAYANCHGA SAVOL 3). Qolgan maydonlar (`kun`, `hozir`, uch hodisa) o'zgarmagan.
   - `web/src/hodisa.js`: `variantOl()` — localStorage `maydon-variant`; yo'q bo'lsa `Math.random() < 0.5 ? 'A' : 'B'` va saqlanadi; localStorage ishlamasa — shu sahifa xotirasida
     (`maydon-brauzer` bilan bir xil naqsh). Variant o'yinchi sahifasida birinchi `hodisaYoz` yoki tugma chizilganda beriladi (`/ega`, `/dashboard` olmaydi). `hodisaYoz(nom)` → body `{ nom, brauzer_id, variant }`.
   - `web/src/BandForma.jsx`: tugma matni — `variantOl() === 'B' ? \`${soat} ni band qilish\` : 'Band qilish'`; «Yuborilmoqda…» holati, pastga qotirilgan joy va 409 yo'li o'zgarmagan.
   - `web/src/Dashboard.jsx`: uch qadam ostida «A/B test · tugma matni» — A va B qatori: vaqtni tanladi · band qildi · foiz; har 5 soniyalik so'rov o'sha javobdan o'qiydi.
   - README: «Darslar va teglar» jadvaliga 4-dars qatori; «Xatolar»: dashboard'da A/B bo'sh — bugun hali hech kim vaqt tanlamagan yoki sayt yangilanmagan (push) ·
     tugma matni har yangilashda almashadi — `maydon-variant` saqlanmayapti (inkognito oyna yoki brauzer sozlamasi).
3. **Shart:** `m10-dars-04-start` va `m10-dars-04-done` teglari kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida).
4. **Bog'liqlik:** 5-dars `m10-dars-05-start` = shu holat + uch zaiflik (tayanch 3) · 8-dars A/B yakuni — `variant` ustunidan, Neon SQL bilan (tayanch 9.4; `08-ProdUpgrade-v3.md` SQL i shu ustunni o'qiydi) ·
   8-dars `pm-m8d4-gipoteza` ni «Agar {agar}, {ozgaradi}, chunki {chunki}» shaklida o'qiydi — maydon nomlari shu MD bilan bir xil.

## Manbalar (05.10.2026 ochib tekshirildi)
- K9 Booking.com — `PM_Prompt_v8.md` keys banki (213–216-qatorlar, ruscha): hikoya — «Почти любое изменение на сайте (цвет кнопки, текст, порядок блоков) сначала проверяется экспериментом на части пользователей»;
  raqam — «Параллельно идут более 1000 A/B тестов (публичные выступления компании, 2017)». Boshqa manba qo'shilmadi.
- Neon SQL Editor — https://neon.com/docs/get-started/query-with-neon-sql-editor («The Neon SQL Editor allows you to run queries on your Neon databases directly from the Neon Console»).
- Render — https://render.com/docs/deploys (Auto-Deploy, sukut «On Commit»: «Render triggers a deploy as soon as you push or merge a change to your linked branch»).
- Netlify — https://docs.netlify.com/site-deploys/create-deploys/ («Netlify will run your build command and deploy the result whenever you push to your Git repo»).
- Chrome inkognito — https://support.google.com/chrome/answer/95464 (Ctrl + Shift + N; Mac ⌘ + Shift + N; sessiya tugaganda sayt ma'lumoti o'chadi).
- TypeORM — https://typeorm.io/docs/data-source/data-source-options/ (`synchronize`: «don't use this in production — otherwise you can lose production data»).
- Repo — `git -C ~/Desktop/maydon show dars-11-done:` `web/src/BandForma.jsx` (tugma «Band qilish»), `web/src/App.jsx` (`‹ ›` kun strelkalari), `web/src/kunlar.js` («Bugun»), `backend/src/app.module.ts` (`synchronize: true`).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentor gipotezasining to'liq matni.** Tayanchda (qaror 7) faqat «tugmada tanlangan soat yozilsa, ko'proq odam band qiladi». «chunki» qismini men yozdim: «o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi»;
   raqam — «vaqtni tanlaganlardan band qilganlar foizi» (1-dars OKR 2-asosiy natijasi). 8-dars shu gipotezani o'qiydi — A-6 dagi to'rt qator tayanchga yozilsinmi?
2. **To'rtinchi bo'lakning nomi — «Raqam».** Kodda `olchov` (tayanch 8). O'quvchi matnida «o'lchov» emas — lug'atda «o'lchash» ildizi «sanash» ga almashtirilgan. 8 va 11-darslar ham «raqam» deydimi?
3. **`foiz` hisobi** — butun songa yaxlitlash (3 / 9 → 33), `vaqt-tanladi` 0 bo'lsa 0 — tayanchda yo'q. 1-darsdagi `foiz(0, 0)` → 0 qoidasi bilan bir xil qildim.
4. **`POST /hodisalar` da `variant` tekshiruvi** — `A`, `B` yoki yo'q; boshqasi `400`. Tayanchda yo'q (2-dars `nom` tekshiruvi naqshi).
5. **Sinf holatidagi «ochdi» va «Oxirgi 5 daqiqada» soni** tayanchda yo'q (faqat A/B ning 9 · 3 va 8 · 4). A2 maketida tepadagi qism kulrang, raqamsiz qoldirildi — o'ylab topilmadi.
6. **«17 kishi» — birlik** (05.10 asosiy seans: tuzatildi → «17 ta brauzer», tayanch 1). Sanoq brauzerda (har qadamda turli brauzerlar), halol gap esa «kishi» deydi (tayanch aynan). Sinfda har sinfdosh o'z telefonidan ochadi — bitta brauzer odatda bitta kishi;
   lekin bir odam ikki brauzerdan kirsa, ikki sanaladi (kartochka 8). Halol gapni o'zgartirmadim.
7. **Real odamlar uchun ism va telefon — namuna** (uyga vazifa ①, A2 4-qadam). Mashq saytiga real telefon yozilmasin deb qaror qildim (6-dars — maxfiylik). Tayanchda yo'q.
8. **«Natija keyingi darsda dashboard'da» (qaror 11) ↔ «dashboard faqat bugunni ko'rsatadi» (9.4).** Uyga vazifa ②: o'quvchi raqamni odamlar kirgan kuni yozib qo'yadi.
   5-dars kirishidagi bir qator (9.5) qaysi raqamni eslatadi — Mentor misolining 9 · 3 / 8 · 4 inimi?
9. **`synchronize: true` va bitta Neon Database (9.11).** Agent `variant` ustunini qo'shgach, Render hali eski kod bilan qayta ishga tushsa (uyqudan uyg'onish), TypeORM eski entity bo'yicha ustunni o'chirishi mumkin.
   Shuning uchun push A1 oxiriga qo'yildi (A2 da yana push). TypeORM bu holatni «data loss» deb ogohlantiradi, lekin aynan shu ssenariyni repo'da tekshirmadim — «qur» da sinash kerak.
10. **`DashMaket`** — 3-dars komponenti; 4-dars uni A/B qismi bilan ishlatadi. Umumiy faylga chiqarish (bitta manba, 180) yoki 4-darsda nusxa — quruvchi va asosiy seans qarori.
11. **A1 5-qadam — o'z loyihasi uchun A/B prompti.** O'quvchining MVP sida hodisalar tizimi va dashboard bo'lmasligi mumkin (2-dars uyga vazifasi, 3-dars uyga vazifasiz). Yo'l: «promptni saqlab qo'ying».
12. **Kun strelkalari (3-ekran)** — repo'dagi `‹ ›` tugmalari; o'quvchi matnida «kun strelkalari». Ularni kattalashtirish — test ichidagi o'zgarish g'oyasi, «Maydon»da qurilmaydi.
13. ✅ (04-FILTR 9: «teng ehtimol») **Variant tanlash usuli** — `Math.random() < 0.5` (teng ehtimol), tayanchda faqat «tasodifiy». Yordam namunasida «taxminan yarmi A, yarmi B» deb yozdim.

## Shubhali joylar (ishonchim komil emas)
- **Booking raqamining ifodasi:** bank matni — «Manbalar» da (ruscha). Men: «Kompaniyaning 2017-yildagi chiqishlariga ko'ra, saytda bir vaqtda 1000 dan ortiq A/B test o'tkazilgan.»
  Ma'nosi bankdagidek, so'zma-so'z emas. «deyarli har o'zgarish» — bankdagi iboraning tarjimasi (5-Modul matnida ham shunday).
- **4-ekran sarlavhasi** brend nomi bilan boshlanadi, izoh esa Mentorda (S-018 «birinchi ko'rinishda»). Brend sarlavhada birinchi ko'rinadi — izoh bir qator pastda.
- **2-ekran «chunki» javoblari:** «agent tugma matnini tez o'zgartira oladi» noto'g'ri deb belgilandi (bu bizning qulayligimiz, o'yinchining sababi emas). Sabab umuman olganda taxmin — auditor «sababni baholab bo'lmaydi» deyishi mumkin.
- ✅ (04-FILTR 4: savol «eng yaqin raqam») **3-ekran B** («Haftada band qilingan vaqtlar soni») — strelka bandlarni ham oshirishi mumkin; to'g'ri javob «o'zgarish turgan qadam» qoidasiga tayanadi (2-ekran). Xato izohi «ko'p narsadan o'sadi» deydi — ishonarli, lekin bahsli bo'lishi mumkin.
- ✅ (04-FILTR 7: «Ma'lumot hali kam») **«Hali kam kishi»** — qancha kishi yetishi aytilmadi (statistik qoida yo'q; 8-darsda 82 ta brauzer ham «hali kam»). Auditor «nechta kerak?» deb so'rashi mumkin — ataylab javobsiz.
- **5-ekran 1-usul** («o'tgan hafta + e'lon») — mashq uchun yasalgan holat (1-dars e'lon qatoriga suyanadi), real fakt emas; raqam yo'q.
- ✅ (04-FILTR 2: yakun va arena 5 yumshatildi) **5-ekran «bir xil sharoit»** — tasodifiy bo'lish ham guruhlarni to'liq bir xil qilmaydi (kichik guruhda tasodif katta). Shuning uchun xulosa «farq tugmadan» demaydi, faqat qoidani aytadi.
- **A1 4-qadam (2)** — inkognito oynani qayta ochib ikkinchi matnni kutish: har urinish 50/50, omad bo'lmasa 3–4 urinish ketadi. Aniq son yozmadim.
- **A2 4-qadam** — sinfdoshlarning saytingizdagi bandlari bugungi kataklarni egallaydi (kunda 6 katak); kataklar to'lsa, «‹ ›» bilan boshqa kunni tanlashadi. Darsda aytilmadi.
- **«Bir necha daqiqa»** (Render va Netlify yangilanishi) — soni manbasiz, shuning uchun aniq son yozmadim (3-dars bilan bir xil).
- **«kutilgan natija»** — QBlok qolip yorlig'i; 1-darsda «natija» faqat «asosiy natija» uchun ajratilgan edi. Qolip matni bo'lgani uchun o'zgartirmadim.
- **Uyga vazifa «3–5 kishi»** — topshiriq hajmi, fakt emas; qaror 11 dagi «10 kishi xulosa uchun kam» gapi bu darsda «17 ta brauzer» bo'lib keldi (tayanch 1).

---

## Qurilish (06.10.2026, F-1005-185/187) — kodda MD dan farqlar (ertalab ko'rikda tasdiqlanadi)
- A/B maketi bitta manbadan (`MAYDON_AB`, `GIPOTEZA`, `SINF` — 33 va 50%; `USULLAR`, `QISMLAR`); dashboard A/B qismi alohida (`DashAB`, `AbJadval`) — umumiy faylga chiqarish asosiy seans qarori (TAYANCHGA SAVOL 10).
- `INLINE_KEYS`: `gipoteza: -1` va `usullar: -1` olindi (jsx-lint error — jonli serverga adashgan kalit) → `{ s3: 2, s8: 1, practice: -1 }`; KOD 2 yangilansin.
- 2-ekran: telefon chapda, gipoteza kartasi o'ngda, javoblar joriy qatorda; xulosa va «Chunki» qatori karta ustunida. 6-ekran (index 5): tugagach o'ngda uch usul ixcham (✗ · ✗ · ✓) + bitta natija bloki (1-qaytarishdan keyin, F-1005-187).
- 5-ekran Booking: bashorat bosqichlarida Mentor «Avval o'zingiz belgilab ko'ring.»; 5/5 telefon yorlig'i «A · Maydon» / «B · Maydon»; telefonning faqat bir qismi (3-ekran — yuqori, 4-ekran 5/5 va A1 — pastki).
- A1 5-qadam bo'laklar bittadan («Keyingisi →», «Gapni yig'ish →», «Saqlash»); tajriba bo'lmasa: «Loyihangizda qaysi bitta o'zgarishni sinab ko'rasiz?». A1 prompt: «ustunini qo'sh — A yoki B» → «qo'sh: A yoki B» (til-lint).
- T-036: A2 «9-Moduldagi» → «o'tgan moduldagi»; Mentor eslatmalaridan ichki havolalar olindi. 393 da ikki telefon yonma-yon (380 dan torda ustma-ust). `lessonTitle.ru` «Какой из двух вариантов работает лучше?».

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m8-03` «Loyiha kuni: jonli dashboard» → **`m8-04` «Ikki variantdan qaysi biri yaxshiroq ishlaydi?»** → `m8-05` «Kiberxavfsizlik: zaiflikni topib yopamiz» (App.jsx 331–333);
  0-ekran sarlavhasi — dars nomi, reja chap qatori — App.jsx osti so'zma-so'z.
- [x] Bitta misol-ip — «Maydon» (hook → 8-ekran; 3-ekran testi ham «Maydon» ichida); keys — faqat K9 (tayanch 5); metafora yo'q; bitta vizual — `AbMaket` (bloklarda va 8-ekranda `DashMaket` A/B qismi bilan).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (javob → karta qatori, telefon va pufak), 5 (usul → maket ssenariysi), 4 (bosqich/bashorat → sahna) + 0, A1, A2. «bosish, keyin matn-karta» yo'q.
- [x] O'lchov (python bilan sanaldi, qavsdagi sonlar): sarlavhalar 45–53 · Mentor ≤2 gap (interaktiv 2-ekranda 1), sarlavhani takrorlamaydi · xulosalar 79–110 · hook javobi 105 · xato izohlari ≤60.
- [x] Atamalar oldingi darslar bilan bir xil (grep 01/02/03 MD): tajriba, asosiy natija, foiz, uch qadam, hodisa, brauzer ID, dashboard, «Oxirgi 5 daqiqada», inkognito oyna, talab, tekshirish.
  Yangi — gipoteza, A/B test, variant A/B (tayanch 2 ta'riflari aynan). Siz-forma; Antigravity promptlari sen-formada (T-002); tugmalar siz-formada yoki ot-shaklda.
- [x] Testlar: 4 javob, uzunlik yaqin (s3 42/34/37/36 · s8 35/33/35/35 — to'g'ri javob eng uzun emas); kalit so'z faqat to'g'rida emas («foizi» s3 A va C da; tire s8 da to'rttalasida) · ✔ o'rni C/B · arena A·B·C·D ×3. Inkor-savol yo'q.
- [—] Final tartib-mashqi yo'q (PM+PRAKT; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✗ → — belgilar, faqat vizual yorliqlarda) · kafolat so'zlari yo'q («har doim», «100%», «darrov», «darhol», «albatta», «faqat» — o'quvchi matnida yo'q).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m8-04`, K9, modul raqami — faqat MD izohlari va O'qituvchi eslatmasida; blok o'quvchiga «Amaliyot 1») · keys raqami yili va manbasi bilan · «KOD» 14 band, «REPO» 4 band.
- [x] Karta T · P · S · PM ko'rildi: T-002/008 (prompt) · T-011 (gipoteza — 2-ekran harakatdan keyin, A/B test — 4-ekran 3/5; sarlavhalarda yangi atama yo'q) · T-014/015 («variant», «test», «raqam», «tajriba», «sinov» — bir ma'noda) ·
  T-020 · T-029/T-047 · T-039 («loyihangiz» — 9-Modul MVP si bor; «gipotezangiz» — A1 5-qadamidan keyin) · T-042 (ta'riflar so'zma-so'z) · T-043 («Bu misolda», «bizning testda») · T-045 · T-064 («ekran» so'zi yo'q) · T-066 («o'lchov» o'rniga «raqam») ·
  P-001/002/004/008/012 (testlar ketma-ket emas: 3, 8)/013/014/015/016/025/026/028/036/046/048/052/053/062/064/067 · S-001 (savollar 6–12 so'z)/002/004/006/008/010/015/018/019/020/025/026/027/034 ·
  PM-005 (aralash, 2-tur qismi A1 5-qadamida) · PM-018 (Booking ichki qarori da'vo qilinmadi) · PM-020 (prompt qavslari gapda o'qiladi) · PM-021 · PM-027 (yangi uyga vazifa fayli yo'q) · PM-030 · J-026.
  ✗ P-011 (PM V4 tartibi: klinika, koding) — gibrid dars, PM qismi ≈20 daqiqa (dastur); koding o'rniga repo bloklari (tayanch 9.1). ✗ P-059 «4 qadam» — 5 qadam (9-Modul M-q1 «O'z g'oyangiz»).
- [ ] P-028: Neon, Render, Netlify, Chrome nomlari rasmiy hujjatdan tekshirildi; `synchronize` bilan ustun o'chishi ssenariysi repo'da sinalmagan (TAYANCHGA SAVOL 9) — «qur» da ko'rish kerak.
