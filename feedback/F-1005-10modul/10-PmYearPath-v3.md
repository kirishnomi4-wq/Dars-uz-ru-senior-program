# 10-Modul · 10-dars (PM) «Bir yilda nimalarni qurdingiz?» — MD v3

Fayl: `src/8-Modull/PmYearPathLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m8-10` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **D** (`correctIdx 3`) · 5-ekran — **B** (`1`) · 8-ekran — **A** (`0`) · 12-ekran — **C** (`2`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx, DE-205): `m8-09` «Loyiha kuni: prodga ko'tarish — 2-qism» → **`m8-10` «Bir yilda nimalarni qurdingiz?»** (osti: «yillik yo'l: loyihalar vaqt chizig'ida va keyingi qadam») → `m8-11` «Besh daqiqada nimani ko'rsatasiz?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma: o'quvchining o'z vaqt chizig'i (har modul: nima qurdi, nima o'rgandi) + bitta keyingi qadam. USTAXONA — 9 va 10-ekran. Keys — **K1 Uzum** (mintaqaviy, tayanch 5). REPO yo'q (PM darsi).
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 6 · tushuncha va testlar (2–8) ≈ 32 · mustaqil ish ≈ 15 · juftlikda ish ≈ 8 · kod ≈ 12 · yakuniy savol, podium, kartochkalar, arena ≈ 17.
Manba: `00-MODUL-TAYANCH.md` (1 — «Maydon»; 2 — «vaqt chizig'i»; 4 — «10-dars uchun loyihalar»; 5 — K1 Uzum; 7 — takroriy xatolar; 8 — `pm-m8d10-yol`; 9 — kelishuvlar) · `GATE_M_JAVOB.md` · `00-TAQIQLAR.md` ·
App.jsx `Proyekt` qatorlari (loyiha nomlari) · dastur v9 (`CoddyCamp_Senior_2026_v9_14modul .html`, modul nomlari) · `PM_Prompt_v8.md` bank K1 · 9-Modul tayanchi (Maydon faktlari).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: «Yilning vizual vaqt chizig'i»):** o'quvchi o'z vaqt chizig'ini tuzadi — har moduldan asosiy loyihasi («Qurdim» — nomi, «O'rgandim» — endi nima qila oladi) va oxirida bitta **keyingi qadam**.
   Darsda — kamida beshta to'liq loyiha va keyingi qadam; bo'sh qolgan joylar — uyda (10-FILTR 3). Qoida: chiziqda **har moduldan asosiy loyiha** turadi («hammasi» emas — 10-FILTR 1).
   Saqlanadi: `pm-m8d10-yol` = `{ loyihalar: [{ modul, nom, nima }], keyin, keyinModul }` (tayanch 8; 11-dars o'qiydi; `keyinModul` — keyingi qadam qaysi loyihadan o'sgani, 10-FILTR 4). Mentor misoli — «Maydon» (9–10-modul) — chiziqning oxirgi qismi; o'ylab topilgan qahramon yo'q.
2. **Bugungi asosiy fikr (P-013):** Vaqt chizig'i bir yilda nima bo'lganini ko'rsatadi, keyingi qadam esa shu chiziqdan o'sadi. (ScoreRing ostida, `small`; kartochkalarga qo'shilmaydi.)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan:**
   - **portfolio** — 2-modul (App.jsx `m1-08` «HTML Praktika — Portfolio sayt», `m1-10`, Netlify `m1-11`); bo'limlari: Men haqimda · **Loyihalarim** · Aloqa (`HtmlPractice.jsx`). Hook va uyga vazifa shu «Loyihalarim» bo'limiga tayanadi.
   - **loyiha** — 9-Modul ta'rifi: boshlanishi va oxiri bor qurish ishi. Bu darsda ta'rif aytilmaydi; «mahsulot» so'zi ishlatilmaydi (kerak bo'lmadi).
   - **keyingi qadam** — 2-modul Demo Day nutqining oxirgi bo'lagi (`PmLesson3.jsx`: «Keyingi qadam»). Bu darsda shu so'z yillik chiziq uchun aniq ta'rif oladi (7-ekran).
   - **prod** (10-Modul: haqiqiy foydalanuvchilar ishlatadigan versiya) · **deploy** · **MVP** · **bosh raqam**, **OKR**, **A/B test** — faqat «Maydon» pastki nuqtalari yorlig'ida.
   - **suhbat** — 9-Modul intervyulari shu so'z bilan (`00-TAQIQLAR.md` 6: «intervyu» 10-Modulda faqat 11-darsda; 9-Modul 3-dars nomi «Besh suhbatdan qaysi muammo chiqdi?»).
4. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **vaqt chizig'i** — **loyihalar qurilgan vaqti tartibida turgan bitta chiziq**. (2-ekran `QIzoh`, yetti karta joylangandan keyin.) Tayanch 2: «loyihalar sanasi bo'yicha bir chiziqda» — sana o'rniga modul tartibi (TAYANCHGA SAVOL 6).
   - **keyingi qadam** — **vaqt chizig'idan o'sadigan bitta aniq ish**. Uch belgisi (yorliq): **bitta** · **aniq** · **chiziqdan o'sadi**. (7-ekran `QIzoh`, to'g'ri karta «Keyin»ga tushgandan keyin.)
     «Chiziqdan o'sadi» ochib aytiladi (kulrang qator): oldingi loyiha, kuzatuv, raqam yoki tugallanmagan ishdan kelib chiqadi (10-FILTR 6).
   - **«unicorn»** (faqat keys ichida; oldingi darslardagi yozilish — `m2-02`, `m4a-02`) — **bahosi 1 milliard dollardan oshgan kompaniya** (tayanch 5: atamani tushuntirish uchun summa aytiladi). Bashorat chipida atama izohsiz tug'ilmaydi (korpus §123) — ta'rif 3/4 slayd matnida, savoldan oldin.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«chiziq»** — vaqt chizig'ining qisqa nomi. **«yo'l»** — faqat reja ekranining chap matnida (App.jsx osti so'zma-so'z: «yillik yo'l») va yakun sarlavhasida (u yerda «vaqt chizig'i va keyingi qadam» deb ochiladi). Boshqa joyda «yo'l» yozilmaydi («Uzum yo'li», «Maydon yo'li» — yo'q).
   - **«Qurdim» · «O'rgandim»** — chiziqdagi har loyihaning ikki yozuvi (yorliq). «O'rgandim»ga masdar yoziladi, egaliksiz (korpus §13): «botga Database va AI'ni ulash».
   - **«qadam»** — faqat «keyingi qadam» va Uzum'ning «birinchi qadami» (chiziqdagi qadam ma'nosida). 10-Modulning «uch qadam» (ochdi → vaqtni tanladi → band qildi) bu darsda ishlatilmaydi. Ekran ichidagi bosqichlar — «1/3», tugma hisoblagichi — «N/3».
   - **«qator»** o'quvchi matnida yo'q (modul qoidasi: faqat jadval qatori). Kod ekranida — «matn».
   - **«modul»** — LMS raqami bilan («2-modul · HTML-CSS»); kod raqami (`m8-10`, `8-Modull`) o'quvchiga aytilmaydi (topshiriq).
   - **Ishlatilmaydi:** taymlayn · intervyu · «unicorn» (oldingi darslarda «unicorn» — 05.10 tayanch tuzatildi) · rezyume · ko'nikma (o'rniga «endi nima qila olasiz») · «mahsulot» · «yillik himoya» (dastur mavzusi; o'quvchi matnida yo'q — 11-darsdagi pitch bilan aralashmasin).
6. **Chiziq ma'lumoti — bitta manba `CHIZIQ` (180-qonun):** modul nomlari — tayanch 4 / dastur v9; loyiha nomlari — App.jsx `Proyekt` qatorlari; «O'rgandim» — App.jsx `sub` yozuvlaridan (o'zim qisqartirdim — TAYANCHGA SAVOL 2).

   | modul | yorliq (v9) | Qurdim (App.jsx) | O'rgandim (Mentor misoli) | manba |
   |---|---|---|---|---|
   | 1 | Foundation | — uzuq: «bo'lgan bo'lsa — o'zingiz qo'shasiz» | — | v9; App.jsx da yo'q (tayanch 4) |
   | 2 | HTML-CSS | Portfolio sayt | HTML va CSS'da sahifa yasash | `m1-08`, `m1-10` |
   | 3 | JavaScript | Mini-do'kon | saytni bo'laklab, AI bilan yig'ish | `m2-11`, `m2-12` |
   | 4 | React | AvtoIjara | React'da sahifa va API bilan ishlash | `m3-12` |
   | 5 | Node + PostgreSQL | AvtoStoyanka | Backend yozib, ma'lumotni PostgreSQL'da saqlash | `m4-13`, `m4-14` |
   | 6 | NestJS, test, CI/CD | KitobShop | NestJS'da Backend yozish va deployni avtomatlashtirish | `m4a-04`, `m4c-04`, `m4c-07` |
   | 7 | Botlar | Telegram bot | botga Database va AI'ni ulash | `m5-05`, `m5-07` |
   | 8 | To'liq tizim | To'liq tizim | sayt, ilova va botni bitta Backend'ga ulash | `m6-08`, `m6-11`, `m6-13` |
   | 9 | Loyiham kim uchun | Maydon | muammoni odamlardan so'rab topish | 9-Modul (tayanch) |
   | 10 | Gipotezani tekshirish | Maydon prodda | hodisalarni sanab, gipotezani raqam bilan tekshirish | 10-Modul (tayanch) |
   | Keyin | — | jamoa yig'ish: o'yinchi «odam kerak» deb yozadi | — | 9-Modul MVP «Keyin» ro'yxati; suhbatlarda 2 / 5 |

   **«Maydon» pastki nuqtalari** (7-ekran, 9–10 kengayganda; tayanchlardan): 9 — Muammo topildi · Besh suhbat (yorliq «jamoaga odam yetmadi — 2 / 5») · MVP va deploy · Sinov va tuzatish;
   10 — Bosh raqam va OKR · Hodisalar va dashboard · A/B test · Himoya va prod.
7. **Keys K1 Uzum — bankdagi gap va sana aynan:** 2022-yil oktabr — ishga tushdi; saytdan emas, yetkazib berishdan boshladi (o'z mashinalari, topshirish punktlari, ertasi kuni yetkazish), chunki bungacha odamlar
   Telegram va Instagram guruhlaridan yetkazib berishsiz olardi · 2024-yil mart — mamlakatning birinchi «unicorn»i. Boshqa raqam (foydalanuvchilar soni, 2025-yil bahosi) qo'shilmaydi.
   Tashqi tasdiq (10-FILTR, 05.10 o'qildi): TechCrunch, 25.03.2024 — «Uzum started by setting up its logistics, a fleet, and established pickup points to offer next-day deliveries»,
   «Uzbeks used to primarily shop online through social media apps such as Instagram, TikTok and Telegram», «launched in October 2022», «the country's first unicorn». «Yetkazib berishsiz» — bank so'zi; o'quvchi matnida «ko'pincha» bilan.
   O'quvchilar bu voqeani avval ikki marta ko'rgan (`m2-02` «Muammodan yechimga», `m4a-02` «Hamma birdan kirsa, sayt chidaydimi?») — bu darsda yangi burchak: ikki sana chiziqda va ular orasidagi vaqt (bashorat).
   Mentor buni ochiq aytadi («Bu voqeani eshitgansiz»). `m2-02` bashorati («birinchi navbatda nimani qurdi?») takrorlanmaydi.
8. **Metafora yo'q.** Ikkinchi misol faqat testda (P-002): **darslik almashish boti** (8-ekran) — 9-Modul 1-dars Mentor ro'yxatidagi «eski darsliklar» muammosidan (tanish olam).
9. **Toza yuza (185, D4):** tugma, variant, karta, yorliqda emoji yo'q; Uzum sahnasidagi telefon, mashina, topshirish punkti — chizilgan (CSS/SVG). O'yin qatlami (arena, nishon medali, podium) — mustasno.
10. **Kod yozish (PM-082, tayanch 9.1):** JS funksiya kod oynasida — `for`, `if`, `push`, satr qo'shish (JavaScript modulidan). Oldingi PM darsi (`m8-06`) — repo bloklari; 1-darsdagi foiz funksiyasi takrorlanmaydi (bu yerda — ro'yxatdan matn yig'ish).
    Kod oynasi `HtmlCompiler`; «kompilyator» ta'riflanmaydi — «kod oynasi».

## Darsning ipi va bitta vizual

- **Modul ipi — «Maydon» davomi** (tayanch 1): MVP o'lchandi, sinaldi, himoyalandi va prodga chiqdi. 10-dars — bir yil bo'yi qurilgan loyihalar vaqt chizig'ida, «Maydon» — oxirgisi.
- **Dars ipi:** hook — portfolio'dagi «Loyihalarim» va bo'sh chiziq → 2-ekranda kursdagi loyihalar chiziqqa joylanadi (atama «vaqt chizig'i») → 4-ekranda har loyihaga «O'rgandim» qo'shiladi →
  6-ekranda Uzum'ning ikki sanasi chiziqda → 7-ekranda «Maydon» qismi kengayadi va «Keyin»ga bitta karta tushadi (atama «keyingi qadam») → 9-ekranda o'quvchi o'z chizig'ini tuzadi →
  10-ekranda sherigiga aytib, «Keyin»ni yozadi → 11-ekranda kod chiziqni portfolio uchun matnga aylantiradi → uyda chiziq portfolio'ning «Loyihalarim» bo'limiga tushadi.
- **Bitta vizual — vaqt chizig'i (`YilChizigi`, dars bo'yi, 163/180; bitta manba `CHIZIQ`):**
  - Gorizontal chiziq: o'nta modul nuqtasi + o'ng chetda uzuq **«Keyin»** nuqtasi (strelka bilan). Chiziq ustida ikki yorliq-qavs: **«Nima bo'ldi?»** (1–10 ustida) va **«Keyin nima?»** («Keyin» ustida) — 7-ekrandan keyin ochiq.
  - Har nuqta: tepada modul yorlig'i («2 · HTML-CSS», kulrang, kichik) · doira · ostida karta: **Qurdim:** nom · **O'rgandim:** gap (yoki uzuq chiziq).
  - Nuqta holatlari: bo'sh (uzuq doira, U-041) → nom yozildi (to'q doira) → to'liq (ikki yozuv, karta burchagida yashil ✓ (yon chiziq yo'q — SABOQ 7)) → joriy (accent chegara) → xato (`err` fon, bir lahza) →
    o'tkazildi (kulrang, chiziq uni ingichka yoy bilan aylanib o'tadi) → Mentor misoli (9, 10 — accent chegara, kichik yorliq «Mentor misoli»).
  - Ko'rinishlar (bitta komponent): **to'liq** (o'n nuqta, 2, 9, 10-ekran) · **ixcham** (nuqtalar + nomlar, kartasiz — 0, 1, 4-ekran fon) · **kengaygan** (9–10 pastki nuqtalari, 7-ekran) ·
    **voqea** (Uzum: «bungacha» · «2022 · oktabr» · «2024 · mart» · uzuq «keyin?», 6-ekran).
  - Telefon kengligida (393) chiziq vertikal: nuqtalar tepadan pastga, kartalar o'ngda; «Keyin» — eng pastda. `prefers-reduced-motion` da harakat to'xtaydi, holat birdan qo'yiladi.
  - Ishlatiladi: 0 (skelet) · 1 (skelet) · 2 · 4 · 6 (voqea) · 7 (kengaygan) · 9 · 10 (o'quvchiniki) · 11 (kichik, Maydon qismi) · 14/15 da artefakt-strip «Chizig'im».

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Portfolio saytingizda nechta loyiha turibdi?** (44)
- Mentor: Bir yil oldin portfolio'ga «Loyihalarim» bo'limini qo'shgandingiz. Eslab ko'ring va bittasini tanlang.
- Maket (chap): brauzer oynasi — nuqtalar, manzil `ismingiz.netlify.app`, portfolio skeleti: ism · «Men haqimda» · **«Loyihalarim»** (uchta bo'sh kulrang chiziq) · «Aloqa».
  Ostida vaqt chizig'i skeleti — hali nuqtasiz ingichka kulrang chiziq.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Hali bitta ham o'z loyiham yo'q (31)
  - Bir-ikkita o'z loyiham turibdi (30)
  - Uchta va undan ko'p loyiham bor (31)
- Javob (uchalasida bir xil, maqtovsiz): Portfolio bir yil oldin yozilgan. O'shandan beri kursda ko'p loyiha qurildi — ular hali bitta joyga yig'ilmagan. (112)
- **Harakat → Vizual o'zgarish:** variantni tanlash → «Loyihalarim» ro'yxatida tanlanganga mos sonda chiziq to'q bo'ladi (0 · 2 · 3); keyin maket ostidagi chiziqda modul yorliqlari bilan
  o'nta kulrang nuqta birma-bir chiqadi («1 · Foundation» … «10 · Gipotezani tekshirish») — hammasi bo'sh. Portfolio'dagi to'q chiziqlar va o'nta bo'sh nuqta yonma-yon turadi. Jonli darsda — sinf ovozlari chizig'i.
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- O'qituvchi eslatmasi: Portfolio sayti ochilmaydigan o'quvchi ham tanlaydi — savol eslash haqida. Javobni muhokama qilmang: chiziqni keyingi ekranlar to'ldiradi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun bir yilda qurganingizni bitta chiziqqa qo'yasiz.** (54)
- Mentor: Chiziqning oxirida «Maydon» turadi — bugungi misol shu. Darsda chiziqni boshlab, keyingi qadamni yozasiz; bo'sh joylarini uyda to'ldirasiz.
- Chap — «Dars oxirida — yillik yo'l: loyihalar vaqt chizig'ida va keyingi qadam» (App.jsx osti bilan so'zma-so'z, P-015) + vaqt chizig'i skeleti:
  o'nta kulrang nuqta 0.5 s oraliqda birma-bir to'q bo'ladi (matnsiz — 2-ekran javobini ochmaydi), oxirida uzuq «Keyin» nuqtasiga strelka chiziladi.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015):
  - 01 · Loyihalaringizni qurilgan tartibida bitta chiziqqa qo'yasiz · `vaqt chizig'i`
  - 02 · Har loyihada nimani o'rganganingizni yozasiz · `o'rgandim`
  - 03 · Uzum'ning ikki sanasini chiziqda ko'rasiz · `voqea`
  - 04 · Bitta keyingi qadamni tanlaysiz · `keyingi qadam`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011 — «vaqt chizig'i» 2-ekranda tug'iladi); chap qator — App.jsx osti; teglar kulrang yorliq (P-015). Reja «keyingi qadam» ta'rifini aytmaydi.

## 2 · Vaqt chizig'i  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · vaqt chizig'i
- Sarlavha: **Loyihalaringiz qaysi tartibda qurilgan?** (39)
- Mentor: Kurs loyihalarining kartalari aralashib ketgan. Kartani tanlang, so'ng uning modulini bosing.
- Vizual (o'ng, keng): vaqt chizig'i — o'nta modul nuqtasi, chiziq hali kulrang uzuq. Har nuqta ustida modul yorlig'i (`CHIZIQ`): 1 · Foundation (uzuq, ostida kulrang «bo'lgan bo'lsa — o'zingiz qo'shasiz») ·
  2 · HTML-CSS · 3 · JavaScript · 4 · React · 5 · Node + PostgreSQL · 6 · NestJS, test, CI/CD · 7 · Botlar · 8 · To'liq tizim · **9 · Loyiham kim uchun — «Maydon»** · **10 · Gipotezani tekshirish — «Maydon prodda»**
  (9 va 10 to'la, accent chegara, yorliq «Mentor misoli»). O'ng chetda uzuq «Keyin» nuqtasi — yopiq, kulrang.
- Harakat (chap yoki chiziq ostida): yetti karta — ✎ bittadan (SABOQ 9, 13): bir vaqtda bitta karta katta bo'lib chiqadi (tartib aralash: Telegram bot · Portfolio sayt · KitobShop · AvtoIjara · To'liq tizim · Mini-do'kon · AvtoStoyanka);
  modul nuqtasi bosilgach karta o'sha nuqta ostiga uchib o'tiradi, keyingi karta chiqadi. Kartalar ro'yxati birdaniga to'kilmaydi.
- **Harakat → Vizual o'zgarish:** kartani tanlash, so'ng modul nuqtasini bosish (yoki sudrash) →
  - to'g'ri: karta nuqta ostiga o'tiradi («Qurdim: …»), doira to'q bo'ladi, oldingi to'la nuqtadan unga chiziq bo'lagi chiziladi; hisoblagich «n / 7»;
  - noto'g'ri: karta silkinib qaytadi, nuqta bir lahza `err`, bitta `QXato`: Bu loyiha boshqa modulda qurilgan — modul nomiga qarang. (56)
  - AvtoIjara 5-modulga qo'yilsa (alohida `QXato`): AvtoIjara Backend'i shu yerda, sayti esa oldinroq qurilgan. (59) — App.jsx: `m4-08`, `m4-10` (Backend va ulash) 5-modulda, sayt `m3-12` 4-modulda.
  - 7/7 dan keyin: chiziq boshidan oxirigacha to'q bo'ladi; birinchi to'la nuqta (Portfolio sayt) ostida kulrang yorliq **«bitta sahifa»**, oxirgisi («Maydon prodda») ostida **«prodda ishlayotgan sayt»**,
    ikkalasi orasida chiziq ostidan ingichka strelka «bir yil». So'ng joriy qator (`QIzoh`): Loyihalar qurilgan vaqti tartibida turgan chiziq vaqt chizig'i deyiladi. (72)
  - Ipucha (40 s harakatsizlikda; javobni aytmaydi): Kartadagi loyihada nima ishlatilgan edi? Shu nomdagi modulni toping.
  - Bitta kartada ikkinchi xatodan keyin kartaning ostida kichik yorliq ochiladi — nima ishlatilgani (`KARTALAR.ishora`, masalan AvtoStoyanka · «Backend + PostgreSQL»): ekran — tartib, xotira testi emas (10-FILTR, 2-ekran).
- Xulosa: Bu chiziqda bir yillik o'sish ko'rinadi: bitta sahifadan prodda ishlayotgan saytgacha. (86)
- Tugma (pastki): Kartalarni joylang (N/7) → Davom etish · `tugadi`: kartalar paneli yopiladi, chiziq butun enga (DE-199); vizual ⛶ ichida (q17).
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xato bo'lsa) Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: Foundation moduli bo'lmagan guruhda 1-nuqta bo'sh qoladi — bu xato emas. Sinfdan so'rang: bir yil oldin shu yetti loyihadan qaysi birini qura olardingiz?
  «Portfolio — bitta sahifa» yorlig'i 2-moduldagi HTML praktikasidan (besh bo'limli bitta sahifa).

## 3 · 1-savol  ← QTest (✔ D, `correctIdx 3`)
- Eyebrow: Tekshiruv · vaqt chizig'i
- Savol: **Yillik vaqt chizig'iga qaysi loyihalaringizni qo'yasiz?** (6 so'z)
  - A — Eng yaxshi chiqqan ikki-uchtasini
  - B — Oxirgi va eng katta bittasini
  - C — Internetga chiqib ishlayotganlarini
  - ✔ D — Har moduldagi asosiy loyihasini
- To'g'ri izohi: Har moduldan asosiy loyiha turadi — kichigi ham o'sishni ko'rsatadi.
- Xato izohlari: A — Yaxshisini tanlasangiz, qayerdan boshlaganingiz ko'rinmaydi. · B — Bitta loyihadan chiziq chiqmaydi — o'sish ko'rinmaydi. ·
  C — Internetga chiqmagan loyihada ham o'rganganingiz bor. · umumiy — Bir yillik o'sish ko'rinishi uchun nima kerak?
- Yozuvlar (barcha testlarda bir xil, qolip): To'g'ri · Qaytadan urinib ko'ring · (jonli darsda xato tanlansa) To'g'ri javob: X — …
- Izoh (MD): qoida 2-ekran xulosasidan (o'sish bitta sahifadan boshlanadi — kichigi chiqarilsa boshi yo'qoladi). Har distraktor — portfolio odati («eng yaxshisini qo'yaman») ning bir ko'rinishi (S-004).
  To'g'ri javob (31) eng uzuni emas — C 35 (S-003). «Hammasi» olib tashlandi: chiziq har moduldan bitta asosiy loyihani ko'rsatadi (10-FILTR 1). Kalit so'z «chiziq», «tartib» variantlarda yo'q (T-070: ta'rif-savol emas, qo'llash-savol).

## 4 · Qurdim va o'rgandim  ← QTushuncha
- Eyebrow: Tushuncha · qurdim va o'rgandim
- Sarlavha: **Loyiha nomidan nima o'rganganingiz bilinadimi?** (46)
- Mentor: Bu loyihalarda «O'rgandim» hali bo'sh. Har biriga mos gapni tanlang.
- Chap — qadam-ro'yxati (`QQadamlar`, 163.8; joriysi accent, o'tgani ✓): 1 AvtoStoyanka · 2 Telegram bot · 3 Maydon
- O'ng — vaqt chizig'i (ixcham), joriy nuqta kattalashgan karta bo'ladi: **Qurdim:** AvtoStoyanka · **O'rgandim:** uzuq chiziq. Karta ostida uchta tanlov (bir uzunlikda, aralash tartibda; to'g'ri — ✔):
  1. **AvtoStoyanka**
     - ✔ Backend yozib, ma'lumotni PostgreSQL'da saqlash
     - AvtoStoyanka sayti va panelini oxirigacha qurish
     - Loyiha kuni sinfda hammaga juda qiziq o'tdi
  2. **Telegram bot**
     - ✔ Botga Database va AI'ni ulash
     - Bot loyihasini oxirigacha qurish
     - Sinfdoshlar Telegram botni maqtagani
  3. **Maydon**
     - ✔ Muammoni odamlardan so'rab topish
     - Maydon saytini noldan qurib chiqish
     - Futbol haqidagi loyiha menga yoqqani
- **Harakat → Vizual o'zgarish:** tanlovni bosish → to'g'ri bo'lsa «O'rgandim» yozuviga gap kiradi, karta burchagida yashil ✓ (yon chiziq yo'q — SABOQ 7), qadam ✓ va chiziqda keyingi nuqta kattalashadi;
  xato bo'lsa tanlov silkinib qaytadi, «O'rgandim» bir lahza `err` fon, bitta `QXato`: Bu gap endi nima qila olishingizni aytmaydi. (44)
  — ikkala tuzoq bitta xato-sinf (S-040): loyiha nomining takrori yoki fikr; ikkalasida ham «endi nima qila olaman» yo'q.
  Ipucha (42 s; javobni aytmaydi): Shu loyihadan keyin nimani qila oladigan bo'ldingiz? O'shani toping.
- 3/3 dan keyin uch karta chiziqda yonma-yon, har birida ikki yozuv.
- Xulosa: Loyiha nomi nima qurilganini aytadi. «O'rgandim» esa endi nima qila olishingizni ko'rsatadi. (92)
- Tugma (pastki): «O'rgandim»ni toping (N/3) → Davom etish · `tugadi`: qadam-ro'yxati yopiladi, uch karta butun enga.
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: Har loyihada sinfdan bitta odamni so'rang: «Shu loyihadan keyin nima qila oladigan bo'ldingiz?» «AvtoIjara qildim» desa — bu nom, «O'rgandim» emas.
  Masdar shakli («saqlash», «ulash») — chiziqdagi yozuv shakli; og'zaki javob «… qila olaman» bo'lishi mumkin.

## 5 · 2-savol  ← QTest (✔ B, `correctIdx 1`)
- Eyebrow: Tekshiruv · o'rgandim
- Savol: **Portfolio sayt uchun «O'rgandim»ga qaysi gap yoziladi?** (7 so'z)
  - A — Portfolio sayt loyihasini oxiriga yetkazish
  - ✔ B — Sahifani HTML va CSS'da qo'lda yasash
  - C — Sayt do'stlarga CSS bilan chiroyli ko'ringani (✎ pilot: lint:tell — texnik atama faqat to'g'ri variantda edi)
  - D — Sayt bir yildan beri internetda turgani
- To'g'ri izohi: Bu gap loyihadan keyin nima qila olishingizni aytadi.
- Xato izohlari: A — Bu loyiha nomini takrorladi — nima o'rgandingiz? · C — Bu fikr — endi nima qila olasiz? · D — Bu sayt haqida gap — siz nima qila olasiz? ·
  umumiy — Loyihadan keyin nima qila oladigan bo'ldingiz?
- Izoh (MD): A — nom takrori, C — fikr, D — rost bo'lishi mumkin bo'lgan, lekin ko'nikma bo'lmagan gap (S-004: «rost, lekin mos emas»). 4-ekrandagi uch loyihadan boshqa loyiha (qo'llash).

## 6 · Uzum  ← QVoqea (K1, mintaqaviy)
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Uzum'ning ikki sanasi nimani ko'rsatadi?** (40)
- Mentor: Uzum — narsani telefonda tanlasangiz, yetkazib beradigan internet-magazin. Bu voqeani eshitgansiz — endi uni vaqt chizig'ida ko'ring.
- Nuqtalar (4) · yorliq **Uzum · N/4** (bashorat kartasida ham) · maket — vaqt chizig'i, «voqea» ko'rinishi (bitta vizual — P-053: keysda sahna maket o'rnini oladi). Logotip yo'q; brend nom-yorlig'i o'z rangida (PM-028, TAYANCHGA SAVOL 9).
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi):
  - 1/4 **Bungacha** — Uzum'gacha odamlar narsani ko'pincha Telegram va Instagram guruhlaridan olardi — yetkazib berishsiz.
    · sahna: chiziqning chap uchida kulrang nuqta «bungacha»; chizilgan telefon, ichida guruh-chat pufaklari (matnsiz chiziqlar); ostida yorliq «yetkazib berishsiz».
  - 2/4 **2022-yil oktabr · ishga tushdi** — Uzum saytdan emas, yetkazib berishdan boshladi: o'z mashinalari, topshirish punktlari va ertasi kuni yetkazish.
    · sahna: chiziqda birinchi to'q nuqta «2022 · oktabr»; chizilgan mashina va topshirish punkti; «bungacha» → «2022» orasida strelka, yorliq «muammodan».
  - 3/4 bashorat — Bahosi 1 milliard dollardan oshgan kompaniya «unicorn» deyiladi. O'zbekistonda bunday kompaniya hali yo'q edi.
    **Uzum «unicorn» bo'lishiga qancha vaqt ketdi?** · Bir yilga yetmay · ✔ Bir yarim yilga yaqin · Besh yildan ko'proq (bir o'lchov, o'sish tartibida — S-015)
    · sahna (`pre` kadr — javobni ochmaydi): chiziqda ikkinchi nuqta joyi uzuq, ustida «?».
  - 4/4 **2024-yil mart · birinchi «unicorn»** — Ishga tushganidan bir yarim yilga yaqin o'tib, Uzum mamlakatning birinchi «unicorn»i bo'ldi.
    · sahna: ikkinchi to'q nuqta «2024 · mart», yorliq «unicorn»; 2022 → 2024 oralig'ida qavs «bir yarim yilga yaqin»; o'ng chetda uzuq «keyin?» nuqtasi (savolsiz, kulrang).
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: bir yarim yilga yaqin» yoki «Taxminingiz to'g'ri chiqdi».
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → chiziqqa nuqta qo'shiladi va oraliq chiziladi: bungacha → 2022 (strelka «muammodan») → 2024 (qavs «bir yarim yilga yaqin») → uzuq «keyin?».
  Bashoratda tanlangan variant ✓/✗ va `QTaxmin` qatori.
- Xulosa (4/4 dan keyin): Uzum'ning ikki sanasi chiziqda turibdi. Birinchi qadam muammodan o'sgan: xarid yetkazib berishsiz edi. (102)
- ✎ SABOQ 8 (qaror 81 A): bosqich gapini Mentor aytadi — matn o'zgarmaydi, joyi Mentor pufagi, har bosqichda almashadi; sahnada — bosqich nomi va jonli maket; yakuniy xulosa pastda yashil.
- ✎ SABOQ 2, 3: «Uzum» nom-yorlig'i o'z rangida (binafsha), telefon — tanish ilova oynasi (guruh-chat, keyin Uzum ilovasi ekrani), mashina va topshirish punkti — chizilgan, logotipsiz; mavhum blok-maket — rad.
- Tugma (pastki): Keyingi bosqich (N/4) → Davom etish
- O'qituvchi eslatmasi: «Baho» — kompaniya qancha turishi. Raqam va sanalar keys bankidan; boshqa raqam (foydalanuvchilar soni, keyingi yillar bahosi) qo'shmang.
  Uzum'ning keyingi qadami bankda yo'q — «keyin?» nuqtasi bo'sh qoladi, uni taxmin qilib to'ldirmang.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` bank, K1 Uzum (bank reviziyasi: yanvar 2026; bank matni ruscha — so'zma-so'z tarjima): marketpleys 2022-yil oktabrda ishga tushdi;
  «saytdan emas, logistikadan boshlashdi: o'z mashinalari, topshirish punktlari, ertasi kuni yetkazish — chunki bungacha o'zbeklar Instagram/Telegram guruhlari orqali yetkazib berishsiz xarid qilardi»;
  2024-yil martda mamlakatning birinchi «unicorn»i bo'ldi; «unicorn» = bahosi 1 mlrd dollardan yuqori.
  «Bir yarim yilga yaqin» — ikki bank sanasi orasidagi hisob (2022-yil oktabr → 2024-yil mart = 17 oy), yangi fakt emas.

## 7 · Keyingi qadam  ← QTushuncha
- Eyebrow: Tushuncha · keyingi qadam
- Sarlavha: **«Maydon» chizig'ining davomiga nima yoziladi?** (45)
- Mentor: Chiziq ikki savolga javob beradi: nima bo'ldi va keyin nima. Kartalardan bittasini «Keyin»ga qo'ying.
- Vizual: vaqt chizig'i, «kengaygan» ko'rinish — 1–8 nuqtalar ixcham chapga suriladi, 9 va 10 pastki nuqtalari bilan ochiladi:
  9 «Maydon»: Muammo topildi · **Besh suhbat** · MVP va deploy · Sinov va tuzatish · 10 «Maydon prodda»: Bosh raqam va OKR · Hodisalar va dashboard · A/B test · Himoya va prod.
  O'ng chetda katta uzuq **«Keyin»** nuqtasi, ustida qavs «Keyin nima?», 1–10 ustida qavs «Nima bo'ldi?». «Keyin» ostida uch kulrang yorliq: **bitta** · **aniq** · **chiziqdan o'sadi**.
- Kartalar (3, bir uzunlikda, aralash tartibda):
  - Ko'proq narsa o'rganib, keyin «Maydon»ni yaxshilash
  - Jamoa yig'ish va eslatmani birga qo'shish
  - ✔ Jamoa yig'ish: o'yinchi «odam kerak» deb yozadi
- **Harakat → Vizual o'zgarish:** kartani «Keyin» nuqtasiga qo'yish (bosish yoki sudrash) → karta nuqtaga tushadi va uch yorliq birma-bir tekshiriladi (✓ yashil / ✗ qizil):
  - «Ko'proq narsa o'rganib, keyin…» → bitta ✓ · aniq ✗ · chiziqdan o'sadi ✓ → karta qaytadi, `QXato`: Qaysi ish qilinadi — aniq yozilmagan. (37)
  - «Jamoa yig'ish va eslatmani…» → bitta ✗ · aniq ✓ · chiziqdan o'sadi ✓ → karta qaytadi, `QXato`: Bu ikki ish — qaysi biri birinchi? (34)
  - «Jamoa yig'ish…» → ✓ ✓ ✓ → «Besh suhbat» pastki nuqtasidan «Keyin»ga chiziq chiziladi, chiziq ustida yorliq «jamoaga odam yetmadi — 2 / 5»; «Keyin» to'q bo'ladi.
  Joriy qator (`QIzoh`, to'g'ri kartadan keyin): Vaqt chizig'idan o'sadigan bitta aniq ish keyingi qadam deyiladi. (65)
  Ostida kulrang: «Chiziqdan o'sadi» — oldingi loyiha, kuzatuv, raqam yoki tugallanmagan ishdan kelib chiqadi. (92)
  Ipucha (40 s): Har kartani «Keyin» ostidagi uch yorliq bilan solishtiring.
- Xulosa: Bu misolda Mentor jamoa yig'ishni tanladi; suhbatdagi «2 / 5» — shu qarorning dalillaridan biri. (96)
- Tugma (pastki): Kartani «Keyin»ga qo'ying → Davom etish · `tugadi`: kartalar yopiladi, kengaygan chiziq va bog'lanish chizig'i butun enga.
- O'qituvchi eslatmasi: Birinchi Demo Day nutqining oxirgi bo'lagi ham «Keyingi qadam» edi — eslating. To'lov, eslatma va jamoa yig'ish — uchalasi o'tgan moduldagi MVP'ning «Keyin» ro'yxatidan;
  bittasi tanlanadi: suhbatlarda jamoa — 2 / 5, pul — 1 / 5, eslatma — 0. Son — dalil, avtomatik tanlov emas: qaysi birini tanlash — mahsulot qarori (10-FILTR 5; 3-dars naqshi). Sinfdan so'rang: «Keyin»ga «hammasini yaxshilash» yozilsa, ertaga nimadan boshlaysiz?

## 8 · 3-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · keyingi qadam
- Savol: **Darslik almashish botida odamlar kerakli darslikni topolmadi. Keyingi qadam qaysi?** (10 so'z)
  - ✔ A — Botga darslikni nomidan qidirishni qo'shish
  - B — Dasturlashni har kuni ko'proq o'rganib borish
  - C — Botga sayt, mobil ilova va chatni birdan qo'shish
  - D — Bir kun katta IT kompaniyasida ishlay boshlash
- To'g'ri izohi: Bu bitta aniq ish va u odamlar topolmagan narsadan o'sadi.
- Xato izohlari: B — Bu niyat — qaysi ish qilinishi aniq emas. · C — Uchta ish birdan — qaysi biri birinchi? · D — Bu orzu — botdagi muammodan o'smaydi. ·
  umumiy — Uch belgini eslang: bitta, aniq, chiziqdan o'sadi.
- Izoh (MD): har distraktor bitta belgini buzadi — B aniq emas, C bitta emas, D chiziqdan o'smaydi (S-004). «Botga» A va C da — kalit so'z faqat to'g'rida emas (S-003). To'g'ri javob eng uzuni emas.

## 9 · Mustaqil ish  ← QMustaqil (USTAXONA 1 — o'z vaqt chizig'i)
- Eyebrow: Mustaqil ish
- Sarlavha: **O'z loyihalaringizni chiziqqa qo'ying.** (38)
- Mentor: Kursdagi nomlar oldindan yozilgan — o'zingiz qurganingizga almashtiring. Har biriga «O'rgandim»ni yozing.
- Bitta ustun: tepada o'quvchining vaqt chizig'i (o'n nuqta + uzuq «Keyin»; 2–10 da «Qurdim» oldindan yozilgan — `CHIZIQ` nomlari, «O'rgandim» bo'sh; 1-nuqta «o'tkazildi» holatida, «Qo'shish» bilan ochiladi) →
  nuqtani bosish → forma (shu nuqta uchun ikki maydon) → «Bu modulda loyiha qurmadim» (ikkinchi tugma, chap) · Yordam · «Chiziqqa yozish» o'ngda (187).
- Maydonlar (placeholder qisqa, tayyor javobsiz — §32): «Qurdim» — Loyiha nomi · «O'rgandim» — Endi nima qila olasiz?
- Tekshiruv (`QXato`, ≤60; yumshoq — ikkinchi «Chiziqqa yozish» bilan o'tadi, bloklaydiganlari belgilangan):
  - «Qurdim» bo'sh (bloklaydi): Loyiha nomini yozing. (21)
  - «O'rgandim» bo'sh (bloklaydi): Bu loyihada nimani o'rgandingiz? Bitta gap yozing. (50)
  - «O'rgandim» loyiha nomini takrorlasa (nomdagi so'z bor va gap 4 so'zdan qisqa, yoki «qurdim», «qildim», «bitirdim» bilan tugasa) (yo'naltiradi): Nomni takrorlayotganga o'xshaydi — nima qila olasiz? (52)
  - «O'rgandim»da fikr so'zlari — «yoqdi», «qiziq», «chiroyli», «maqtadi» (yo'naltiradi): Bu fikrga o'xshaydi — endi nima qila olasiz? (44)
  - Tekshiruvlar — taxmin, hukm emas: matnlar «o'xshaydi» shaklida, «tizim aniqladi» deyilmaydi (10-FILTR 8).
  - juda qisqa (≤10 belgi): Juda qisqa: aniq nimani qila olasiz? (36)
  - Shunday qoldirsangiz — yana «Chiziqqa yozish»ni bosing.
  - o'tgan nuqta (106d-a): chiziqda yashil ✓ oladi — alohida maqtov-matni yo'q.
- Doimiy qator (forma ostida): Qurmagan loyiha yozilmaydi — bunday modulni «o'tkazildi» deb belgilaysiz. (73)
- Yordam: Eslay olmasangiz, portfolio saytingiz va GitHub'dagi repo'laringizga qarang. Ichingizda «Endi … qila olaman» deb ayting va o'rtasini yozing.
- **Harakat → Vizual o'zgarish:** nuqtani tanlash → forma shu nuqta uchun ochiladi, nuqta accent; «Chiziqqa yozish» → nuqta kartasida ikki yozuv paydo bo'ladi, burchagida yashil ✓, keyingi bo'sh nuqta joriy bo'ladi;
  «Bu modulda loyiha qurmadim» → nuqta kulrang «o'tkazildi», chiziq uni ingichka yoy bilan aylanib o'tadi. Tekshiruvdan o'tmagan yozuv `err` fonda, ostida bitta `QXato`. Hammasi to'lsa forma yopiladi,
  chiziq butun enga (DE-199), har kartada ✎ (tahrirlash).
- Xulosa (o'quvchi sonidan yig'iladi, P-046): Vaqt chizig'ingizda {n} ta loyiha bor: har birida nima o'rganganingiz yozilgan. (79)
- Tugma (pastki): Chiziqni to'ldiring (n / N) → 5 ta to'liq nuqtadan keyin «Davom etish» ochiladi (N — o'tkazilmagan nuqtalar soni; qolgani — uyga vazifa ①). Jonli darsda mentor o'tkazishi mumkin (`optionalLive`).
- Artefakt-strip (U-042): shu ekrandan — «Chizig'im» (ixcham, holat «n / N»); 10, 11, 14, 15-ekranlarda ko'rinadi, test, arena va podiumda yo'q.
- Mentor rejimi: forma o'rniga Mentor misoli chizig'i (`CHIZIQ`, namuna). Mentor statistikasi: «Chiziqni to'ldirganlar (5+)».
- O'qituvchi eslatmasi (`MentorNote`): Eng ko'p xato — «O'rgandim»ga loyiha nomini qayta yozish («AvtoIjara qildim»). «Shu loyihadan keyin nima qila oladigan bo'ldingiz?» deb so'rang.
  Kursdagi nom o'quvchiniki bo'lmasa (o'z g'oyasini qurgan bo'lsa) — o'zinikini yozadi. 5 tadan kam yozgan o'quvchi uyda to'ldiradi.

## 10 · Juftlikda ish  ← QMustaqil (USTAXONA 2 — keyingi qadam, sinfdosh bilan)
- Eyebrow: Juftlikda ish
- Sarlavha: **Sherigingiz «Keyin nima?» desa, nima deysiz?** (44)
- Mentor: Chizig'ingizni sherigingizga birinchi loyihadan boshlab aytib bering, keyin o'rin almashing. Javobingizni «Keyin»ga yozing.
- Qadamlar 1/2: 1 Sherigingizga aytib bering (taymer 1 daqiqa; sherik oxirida «Keyin nima?» deb so'raydi) · 2 «Keyin»ni yozing.
  Yakka rejimda (sherik yo'q) 1-qadam: Chizig'ingizni ovoz chiqarib aytib bering (30 soniya).
- Vizual: o'quvchining vaqt chizig'i (9-ekrandan; yo'q bo'lsa — Mentor misoli); «Keyin» nuqtasi joriy (accent), ostida uch kulrang yorliq: bitta · aniq · chiziqdan o'sadi.
- Forma (bitta ustun): «Keyin» maydoni — placeholder: Bitta aniq ish: nima qilasiz? · ostida tanlov **«Qaysi loyihadan o'sadi?»** — chiziqdagi to'liq nuqtalar nomi (bittasi tanlanadi) · Yordam · «Chiziqqa yozish» o'ngda.
- Tekshiruv (`QXato`, ≤60):
  - bo'sh (bloklaydi): Keyingi qadamni yozing. (23)
  - juda qisqa (≤12 belgi): Juda qisqa: aniq nima qilasiz? (30)
  - bir nechta ish — vergul bilan uch va undan ko'p bo'lak, yoki « va » ikki fe'lni ulasa (yo'naltiradi): Bir nechta ishga o'xshaydi — birinchisini qoldiring. (52)
  - mavhum — «ko'proq», «yaxshilash», «rivojlantirish», «o'rganaman» bor va boshqa ot yo'q (yo'naltiradi): Aniqroq: qayerda va nima qilasiz? (33)
  - loyiha tanlanmagan (bloklaydi): Keyingi qadam qaysi loyihadan o'sadi? Bittasini tanlang. (56)
- Yordam: Oxirgi loyihangizga qarang: odamlar nimadan qiynaldi yoki nima so'radi? Keyingi qadam shundan o'sadi.
- **Harakat → Vizual o'zgarish:** taymer → aytish; «Keyin» yozilib loyiha tanlanganda — «Keyin» nuqtasi to'q bo'ladi, tanlangan nuqtadan unga chiziq chiziladi, uch yorliq yashil bo'ladi
  (tekshiruv o'tgani bo'yicha; yo'naltirilgan holatda tegishli yorliq kulrang qoladi). Chiziq ustida «Nima bo'ldi?» va «Keyin nima?» qavslari ochiladi.
- Xulosa: Chizig'ingiz to'liq: nima bo'ldi va keyin nima. (47)
- Taymer tugmalari: 1 daqiqani boshlash · To'xtatish · ↻ Yana 1 daqiqa (yakka rejimda — 30 soniya)
- Tugma (pastki): «Keyin»ni yozing → Davom etish
- Mentor statistikasi: «Keyingi qadamni yozganlar».
- O'qituvchi eslatmasi: Taymerni siz boshqaring — 1 daqiqadan keyin «O'rin almashing» deng. Sherik «Keyin nima?» deb so'raganda javob bitta ish bo'lsin; «hammasini» desa — «Ertaga nimadan boshlaysiz?» deb so'rang.
  Bu bir daqiqalik aytib berish — 11-darsdagi besh daqiqalik pitchga tayyorgarlik (o'quvchiga aytilmaydi, T-038).

## 11 · Kod yozish  ← QKod (≈12 daqiqa; yangi qoida yo'q — 2, 4, 7-ekran takrori)
- Eyebrow: Kod yozish
- Sarlavha: **Chiziqdan portfolio matnini chiqaradigan kod yozamiz.** (53) — PM-082(a) sarlavha oilasi (korpus §19, §48); kodning maqsadi (portfolio) sarlavhada (10-FILTR)
- Mentor: Loyihalarni qo'lda yozdingiz — endi shu ishni funksiya bajaradi. Ma'lumot — «Maydon» qismidan, natija — portfolio uchun.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **Natija massivining oxirgi elementi nima bo'ladi?** · Birinchi loyiha · Eng katta loyiha · ✔ Keyingi qadam
  - xato «Birinchi loyiha»: Chiziq birinchi loyihadan boshlanadi, tugamaydi. (48)
  - xato «Eng katta loyiha»: Chiziq hajm bo'yicha emas, vaqt bo'yicha turadi. (48)
- Chap (vazifa, 3 band): 1 Har loyiha uchun «Nom (N-modul): o'rgandim» matni qo'shiladi · 2 «O'rgandim» bo'sh bo'lsa, o'rniga «?» qo'yiladi · 3 Oxirida «Keyin: …» turadi
- Yordam: Bo'sh massiv oching, loyihalarni `for` bilan aylanib, har biriga matn qo'shing. Sikl tugagach, «Keyin: …» ni qo'shing.
  Eslatma (JavaScript darslaridan): `for` — ro'yxatni birma-bir aylanadi · `if` — shart to'g'ri bo'lsa ishlaydi · `push` — massiv oxiriga qo'shadi · `return` — qiymatni qaytaradi.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`, `app.js`). Mentor gapi: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va nima chiqqanini shu yerda ko'rasiz.
  Kod nusxalanmaydi (PM-082 d).
- Kod:
```js
// «Maydon» — vaqt chizig'ining oxirgi qismi (Mentor misoli)
const loyihalar = [
  { modul: 8, nom: "To'liq tizim", nima: "sayt, ilova va botni bitta Backend'ga ulash" },
  { modul: 9, nom: "Maydon", nima: "muammoni odamlardan so'rab topish" },
  { modul: 10, nom: "Maydon prodda", nima: "hodisalarni sanab, gipotezani raqam bilan tekshirish" }
];

function vaqtChizigi(royxat, keyin) {
  // har loyiha uchun: "Maydon (9-modul): muammoni odamlardan so'rab topish"
  // "O'rgandim" bo'sh bo'lsa — "?"; eng oxirida: "Keyin: ..."
  return [];   // shu joyni siz yozasiz
}

console.log(vaqtChizigi(loyihalar, "jamoa yig'ish"));
// [ "To'liq tizim (8-modul): sayt, ilova va botni bitta Backend'ga ulash",
//   "Maydon (9-modul): muammoni odamlardan so'rab topish",
//   "Maydon prodda (10-modul): hodisalarni sanab, gipotezani raqam bilan tekshirish",
//   "Keyin: jamoa yig'ish" ]
console.log(vaqtChizigi([], "birinchi loyiha"));
// [ "Keyin: birinchi loyiha" ]
console.log(vaqtChizigi([{ modul: 7, nom: "Telegram bot", nima: "" }], "qidiruv qo'shish"));
// [ "Telegram bot (7-modul): ?", "Keyin: qidiruv qo'shish" ]
```
- Ma'lumot shakli — `pm-m8d10-yol.loyihalar` bilan bir xil (`{ modul, nom, nima }`; 10-FILTR).
- Boshlang'ich kod tekshiruvi (§140-B): funksiya bo'sh massiv qaytaradi — tegilmagan kod 0/3. Namuna yechim (`for` + `if` + `push`) `node` da 3/3 (05.10, scratchpad `md10/kod-sinov.js`);
  «Keyin» sikl ichiga qo'yilgan xato yechim 1 va 2-shartda yiqiladi.
- Kod oynasi sarlavhasi: `app.js — vaqtChizigi funksiyasini yakunlang` · placeholder: `// har loyiha uchun matn, oxirida «Keyin»`
- Shart xabarlari (≤60): 1 — Har loyihaga «Nom (N-modul): o'rgandim» matni qo'shilsin. (57) · 2 — Bo'sh ro'yxatda ham oxirida «Keyin: …» tursin. (46) ·
  3 — «O'rgandim» bo'sh bo'lsa, o'rniga «?» qo'ying. (46)
- **Harakat → Vizual o'zgarish:** darvozada tanlanadi → kod namunasida `keyin` parametri bir lahza ajraladi; kod ishga tushganda Console'da massivlar chiqadi, shartlar birma-bir ✓;
  o'ng tepadagi kichik vaqt chizig'ida (Maydon qismi) har to'g'ri element o'z nuqtasini, oxirgisi «Keyin»ni yoqadi.
- O'qituvchi eslatmasi: Ko'p uchraydigan xato — «Keyin»ni sikl ichiga qo'yish: u har loyihadan keyin takrorlanadi. Console'da ko'rsating: chiziqda «Keyin» bitta va eng oxirida.

## 12 · Yakuniy savol  ← QTest (✔ C, `correctIdx 2`; ikki qoida birga — chiziq tartibi va keyingi qadam oxirida)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Sherigingizga chizig'ingizni qaysi tartibda aytib berasiz?** (6 so'z)
  - A — Eng yoqqan loyihadan boshlab, so'ng qolganlarini
  - B — Keyingi qadamdan boshlab, so'ng loyihalarni
  - ✔ C — Birinchisidan boshlab, oxirida keyingi qadam
  - D — Eng katta loyihadan boshlab, kichigiga qarab
- To'g'ri izohi: Bu darsda chiziq qurilgan tartibda aytiladi, keyingi qadam — oxirida.
- Xato izohlari: A — Yoqqanidan boshlasangiz, o'sish tartibi buziladi. · B — Nima bo'lganini eshitmasa, keyingi qadam tushunarsiz. ·
  D — Kattasidan boshlasangiz, qayerdan boshlaganingiz yo'qoladi. · umumiy — Chiziq qaysi tartibda turadi — shuni eslang.
- Izoh (MD): «keyingi qadam» B va C da (S-003); har variant «…dan boshlab, …» shaklida, 3-vs-1 shakl yo'q. 10-ekran Mentori tartibni aytgan — test undan keyin (P-012).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti.
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Qaysi loyihalar qo'yiladi · 2 — «O'rgandim» gapi · 3 — Keyingi qadam · 4 — Aytib berish tartibi

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**
- ✎ Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Vaqt chizig'i nima? | Loyihalar qurilgan vaqti tartibida turgan bitta chiziq |
| Vaqt chizig'iga qaysi loyihalar qo'yiladi? | Har moduldan asosiy loyiha — kichigi ham |
| Chiziqda bir yillik o'sish qanday ko'rinadi? | Bitta sahifadan prodda ishlayotgan saytgacha |
| Loyiha nomi nimani aytadi? | Nima qurilganini |
| «O'rgandim»ga nima yoziladi? | Endi nima qila olishingiz |
| «AvtoStoyanka saytini qurdim» — «O'rgandim» bo'ladimi? | Yo'q: u loyiha nomini takrorlaydi |
| Uzum nimadan boshlagan? | Saytdan emas, yetkazib berishdan (2022-yil oktabr) |
| «Unicorn» nima? | Bahosi 1 milliard dollardan oshgan kompaniya |
| Uzum qachon mamlakatning birinchi «unicorn»i bo'ldi? | 2024-yil martda |
| Keyingi qadam nima? | Vaqt chizig'idan o'sadigan bitta aniq ish |
| Keyingi qadamning uch belgisi qaysilar? | Bitta · aniq · chiziqdan o'sadi |
| Mentor «Maydon»ga nega jamoa yig'ishni tanladi? | Dalil bor edi: suhbatlarda beshtadan ikkitasiga jamoaga odam yetmagan — tanlov Mentorniki |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi narsa darsda bor (vaqt chizig'i, har moduldan asosiy loyiha, o'sish — 2, 3 · nom va «O'rgandim» — 4, 5 · Uzum, «unicorn» — 6 · keyingi qadam, belgilar, suhbatlar — 7, 8).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Yillik yo'l tayyor: vaqt chizig'i va keyingi qadam.** (51)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Vaqt chizig'i bir yilda nima bo'lganini ko'rsatadi, keyingi qadam esa shu chiziqdan o'sadi.
- Endi siz bilasiz (bugungi asosiy fikr yuqorida — bu yerda takrorlanmaydi, T-048):
  - Vaqt chizig'iga har moduldan asosiy loyiha qo'yiladi, kichigi ham.
  - «O'rgandim» loyiha nomini takrorlamaydi: u endi nima qila olishingizni aytadi.
  - Uzum'ning birinchi qadami odamlarning muammosidan o'sgan: xarid yetkazib berishsiz edi.
  - Keyingi qadam bitta va aniq ish; u oldingi dalildan o'sadi, tanlov esa sizniki.
- Uyga vazifa (karta, P-025): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: portfolio'ngizni ochadigan odamlar · Nechta: 1 vaqt chizig'i · Muddat: keyingi darsgacha
  - ① Chizig'ingizdagi bo'sh qolgan loyihalarga «O'rgandim»ni yozing.
  - ② Portfolio saytingizning «Loyihalarim» bo'limiga chiziqdagi loyihalarni tartib bilan yozing va qayta deploy qiling.
  - ③ Chizig'ingizni oilangizdan yoki tanishlaringizdan bir kishiga bir daqiqada aytib bering; u tushunmagan joyni qayta yozing.
  - Karta ostida (bitta kulrang qator, P-026): Portfolio saytingiz ochilmasa — chiziqni GitHub'dagi istalgan repo'ngizning README fayliga yozing.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Besh daqiqada nimani ko'rsatasiz?».
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Bugungi asosiy fikr» faqat ScoreRing ostida (P-013); «Endi siz bilasiz» uni takrorlamaydi. Yakun sarlavhasi App.jsx ostidagi «yillik yo'l»ni ochadi: vaqt chizig'i + keyingi qadam.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi; S-031: tavsif ≤48)
- **Time Keeper!** (2-ekran, birinchi urinishda xatosiz) — Loyihalarni qurilgan tartibida joyladingiz
- **Skill Spotter!** (4-ekran, birinchi urinishda uchalasi) — Uch loyihada nima o'rganilganini topdingiz
- **Timeline Builder!** (9-ekran, 5 ta to'liq nuqta) — O'z vaqt chizig'ingizni tuzdingiz
- **Next Step!** (10-ekran, «Keyin» tekshiruvdan o'tdi va loyiha tanlandi) — Chizig'ingizga keyingi qadamni yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034); 6-ekran (voqea) va 11-ekran (kod) nishonsiz.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Qaysi loyihalar qo'yiladi** — 1 Vaqt chizig'i — loyihalar qurilgan vaqti tartibida turgan bitta chiziq. · 2 Har moduldan asosiy loyiha qo'yiladi, kichigi ham. ·
  3 O'sish shundan ko'rinadi: bitta sahifadan prodda ishlayotgan saytgacha. — Sinfga savol: Bir yil oldin qaysi loyihani qura olardingiz?
- **5 · «O'rgandim» gapi** — 1 Loyiha nomi nima qurilganini aytadi. · 2 «O'rgandim» endi nima qila olishingizni ko'rsatadi. · 3 Nom takrori yoki fikr («yoqdi») — «O'rgandim» emas. —
  Sinfga savol: AvtoIjara'dan keyin nima qila oladigan bo'ldingiz?
- **8 · Keyingi qadam** — 1 Keyingi qadam — vaqt chizig'idan o'sadigan bitta aniq ish. · 2 Uch belgi: bitta, aniq, chiziqdan o'sadi. ·
  3 «Maydon»da Mentor jamoa yig'ishni tanladi — suhbatdagi «2 / 5» dalillardan biri. — Sinfga savol: Darslik almashish botida yana qanday keyingi qadam bo'lishi mumkin?
- **12 · Aytib berish tartibi** (bu darsdagi usul; 11-dars pitchi boshqa tartibda bo'lishi mumkin) — 1 Birinchi loyihadan boshlanadi. · 2 Oxirgisigacha qurilgan tartibda boriladi. · 3 Eng oxirida — keyingi qadam. —
  Sinfga savol: Sherigingiz eng yoqqan loyihasidan boshlasa, nima ko'rinmay qoladi?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Vaqt chizig'ida loyihalar qanday tartibda turadi? (2)
   - ✔ A — Qurilgan vaqti bo'yicha, birinchisidan
   - B — Eng yoqqanidan boshlab, eng yoqmaganigacha
   - C — Eng kattasidan boshlab, kichigigacha
   - D — Ko'p vaqt olganidan boshlab, ozigacha
2. Bir yil oldingi portfolio sayt chiziqning qayeriga yaqin turadi? (2)
   - A — Oxiriga — eng yangi loyiha sifatida
   - ✔ B — Boshiga — dastlabki loyihalardan biri
   - C — O'rtasiga — eng muhim loyiha bo'lgani uchun
   - D — Hech qayerga — u juda kichik loyiha
3. «AvtoIjara saytini qurdim» — «O'rgandim»ga to'g'ri keladimi? (4, 5)
   - A — Ha — loyiha nomi aniq yozilgan
   - B — Ha — gap o'tgan zamonda to'g'ri yozilgan
   - ✔ C — Yo'q — u loyiha nomini takrorlaydi
   - D — Yo'q — gap juda qisqa yozilgan
4. Qaysi gap «O'rgandim»ga mos keladi? (4)
   - A — Endi loyiham juda chiroyli ko'rinadi
   - B — Endi KitobShop'ni oxirigacha qurib bo'ldim
   - C — Endi Mentor loyihamni juda maqtaydi
   - ✔ D — Endi botga AI'ni o'zim ulay olaman
5. Uzum qachon ishga tushgan? (6)
   - ✔ A — 2022-yil oktabrda
   - B — 2020-yil sentabrda
   - C — 2024-yil martda
   - D — 2019-yil oktabrda
6. Uzum'gacha odamlar narsani ko'pincha qayerdan olardi? (6)
   - A — Chet eldagi katta saytlardan
   - ✔ B — Telegram va Instagram guruhlaridan
   - C — Shahardagi katta bozor va do'konlardan
   - D — Maktabdagi e'lonlar taxtasidan
7. Uzum 2024-yilda «unicorn» bo'ldi. Bu nimani bildiradi? (6)
   - A — Ishchilari soni mingtadan oshganini
   - B — Bir yilda o'nta shaharga ochilganini
   - ✔ C — Bahosi 1 milliard dollardan oshganini
   - D — Hamma xaridni o'zi yetkaza boshlaganini
8. Uzum'ning birinchi qadami nimadan o'sgan? (6)
   - A — Sayt dizayni eskirib qolganidan
   - B — Shaharda do'konlar kamligidan
   - C — Reklama juda arzonlashganidan
   - ✔ D — Yetkazib berishsiz xariddan
9. Keyingi qadamning belgilaridan biri qaysi? (7)
   - ✔ A — Bitta va aniq ish
   - B — Eng katta va qiyin ish
   - C — Hammaga yoqadigan ish
   - D — Tez tugaydigan ish
10. «Ko'proq o'rganaman» — keyingi qadam bo'ladimi? (7, 8)
    - A — Ha — u kelajakdagi ish haqida yozilgan
    - ✔ B — Yo'q — qaysi ish ekani aniq emas
    - C — Ha — o'rganish hammaga kerak
    - D — Yo'q — u juda uzun yozilgan
11. «Maydon» keyingi qadami nimadan o'sdi? (7)
    - A — Mentorning futbolga qiziqishidan
    - B — Boshqa saytlarda ko'rgan narsadan
    - ✔ C — Suhbatda o'yinchilar aytganidan
    - D — A/B testdagi B variantining yutug'idan
12. Bu modulda loyiha qurmagan bo'lsangiz, chiziqda nima qilasiz? (9)
    - A — Sinfdoshimning loyihasini yozib qo'yaman
    - B — O'ylab topilgan loyiha nomini yozaman
    - C — Chiziqni shu joyda tugatib qo'yaman
    - ✔ D — Modulni «o'tkazildi» deb belgilayman

- Arena yozuvlari — umumiy shablon (9-Modul 12-dars bilan bir xil).
- Izoh (MD): 3 va 10 — «Ha» / «Yo'q» 2/2 (S-006). 5 — C (2024-yil mart) rost sana, lekin boshqa voqea (S-004); B, D — sana distraktorlari. 6, 8 — distraktorlar bankda yo'q sabablar (shubhali joylar).
  11 — D rost fakt (8-darsda B qoldirildi), lekin keyingi qadamning manbai emas. 12 — 9-ekran doimiy qatoridagi qoida (halol chiziq).
- **Fon so'zlari** (R-008, {uz, ru}): arena — chiziq · loyiha · modul · yil · o'rgandim · keyin · qadam · portfolio · uyga vazifa banneri — chiziq · loyiha · portfolio · keyin (faqat so'z, emojisiz).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/8-Modull/PmYearPathLesson.jsx`; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m8d10-yol-v1` · «Bir yilda nimalarni qurdingiz?».
2. Ekran turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s7 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s8/s12 `QTest` (darsning `QuestionScreen` mantig'i, DE-203) · s6 `QVoqea` ·
   s9/s10 `QMustaqil` · s11 `QKod` · s13 `QNatija` (podium) · s14 `QKartochka` · s15 `QYakun`.
3. **`YilChizigi` — qolipda yo'q, yangi** (bitta vizual, 180-qonun): o'nta modul nuqtasi + «Keyin»; nuqta kartasi (Qurdim / O'rgandim); holatlar (bo'sh · nom · to'liq · joriy · xato · o'tkazildi · Mentor misoli);
   ko'rinishlar `toliq` · `ixcham` · `kengaygan` (9–10 pastki nuqtalari, «Keyin» ostida uch yorliq, bog'lanish chizig'i) · `voqea` (Uzum: 4 nuqta, strelka, qavs); qavslar «Nima bo'ldi?» / «Keyin nima?»;
   telefon (393) — vertikal; `reduced-motion`. Qolip-maket izohi faylda e'lon qilinadi (`// qolip-maket: …`).
4. `CHIZIQ` — bitta manba: 10 element `{ modul, yorliq, nom, nima, mentor?: true }` + `KEYIN_MENTOR` (`jamoa yig'ish…`, bog'lanish — 9-modul «Besh suhbat») + `MAYDON_PASTKI` (9: 4, 10: 4; «Besh suhbat» yorlig'i «jamoaga odam yetmadi — 2 / 5»).
   s0, s1, s2, s4, s7, s9 (namuna nomlar), s11 shundan o'qiydi.
5. s0: `QKirish` sof so'rovnoma — hammaga `correct: false`, maqtov yo'q (J-026); javob ≤120; brauzer maketi (portfolio, «Loyihalarim») + chiziq skeleti.
6. s2 — `KARTALAR` 7 (`nom`, `modul`, `ishora` — ikkinchi xatodan keyin ochiladigan yorliq) + joylash (bosish yoki sudrash); AvtoIjara → 5 uchun alohida `QXato`; 7/7 da «bitta sahifa» / «prodda ishlayotgan sayt» yorliqlari + «bir yil» strelkasi; `QIzoh`; 40 s ipucha; nishon `timeKeeper` (birinchi urinish).
7. s4 — `QQadamlar` 3 (`ORGANDIM_TANLOV`: `{ nom, togri, tuzoq: [2] }`), tanlov tartibi aralash (to'g'ri o'rni har qadamda boshqa); bitta `QXato` matni; 42 s ipucha; nishon `skillSpotter`.
8. s6 — `K_SLIDES` 4; bashorat 3/4 (zinapoya, ballsiz; `pre` kadr); `QTaxmin`; `YilChizigi voqea`; manba izohi faylda.
9. s7 — `KEYIN_KARTALAR` 3 (`{ t, belgilar: { bitta, aniq, osadi } }`) → «Keyin» nuqtasiga qo'yish; uch yorliq tekshiruvi; 2 `QXato`; to'g'rida bog'lanish chizig'i; `QIzoh`.
10. s9 — o'quvchi chizig'i: `LS` kalit `pm-m8d10-yol` = `{ loyihalar: [{ modul, nom, nima }], keyin, keyinModul, savedAt }` (tayanch 8; o'tkazilgan modul massivga kirmaydi; `modul` — LMS raqami, son — TAYANCHGA SAVOL 3);
    nomlar `CHIZIQ` dan oldindan; tekshiruv funksiyasi (bo'sh · nom takrori · fikr so'zlari · qisqa) — PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi (uz; ru — 6-RU da); 5 ta to'liqdan keyin «Davom etish»; `optionalLive`; artefakt-strip «Chizig'im».
11. s10 — `PairTimer` 1 daqiqa / 30 soniya (▶ ⏹ belgisiz); «Keyin» maydoni + «Qaysi loyihadan o'sadi?» tanlovi (s9 to'liq nuqtalaridan); tekshiruv (bo'sh · qisqa · bir nechta ish · mavhum · tanlanmagan) — PM-108 namunalari bilan;
    `pm-m8d10-yol.keyin` va `keyinModul` (tanlangan loyihaning modul raqami) ga yoziladi — qayta yuklanganda chiziq chizig'i tiklanadi; nishon `nextStep`.
12. s11 — `KOD_TASK` (`loyihalar`, `vaqtChizigi`), starter 0/3 (§140-B), 3 `evalEquals` (`JSON.stringify` bilan: 4 element · faqat «Keyin» · «?»), `GATE_ITEMS` (oxirgi element), requirement yorliqlari va xabarlari;
    kod oynasi qoralamasi `pm-m8d10-code` (9-Modul naqshi `pm-m7dN-code`).
13. Jonli ball: `INLINE_KEYS` = { s3: 3, s5: 1, s8: 0, s12: 2, chiziq: -1, organdim: -1, keyin: -1, practice: -1, juftlik: -1, koding: -1 }; `RECAPS` 3/5/8/12; `Q_LABELS`;
    `QUIZ_BANK` 12 (✔ 0/1/2/3 har biri 3 marta) + `set_quiz_keys`; `SCREEN_META` == screens (16); `SCREEN_INTENTS`.
14. `ACHIEVEMENTS` 4 (`timeKeeper`, `skillSpotter`, `timelineBuilder`, `nextStep`) · `FLASHCARDS` 12 · `RECAP` 4 · `HW_TOKENS` · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
15. Uyga vazifa — yakun kartasida (`HwCard` mazmuni shu MD dan; alohida `.homework.jsx` yo'q — tayanch 4).
16. App.jsx `m8-10` qatoriga `comp: PmYearPathLesson` ulash (nom va osti o'zgarmaydi — DE-205 ✓). App.jsx ga bu bosqichda tegilmaydi.
17. **REPO — yo'q** (PM darsi; `maydon` repo'ga tegilmaydi).
- Darvozalar: `npm run gates -- src/8-Modull/PmYearPathLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

---

## TAYANCHGA SAVOL
1. ✅ **(05.10 asosiy seans: qabul, tayanch 4 tuzatildi)** **8-modul loyihasi — AvtoPizza emas (App.jsx va kod bo'yicha).** Tayanch 4: «8 To'liq tizim — AvtoPizza (sayt + Backend + bot + mobil)». Lekin App.jsx `Proyekt` qatorlarida (`m6-08`, `m6-11`, `m6-13`) AvtoPizza yo'q;
   6-Modul YAKUNIY (kodga mos, 05.10) da ham yo'q — 13-dars «O'z loyihangizda barcha kanalni (web / mobil / bot) bitta backend'ga ulang», 11-dars — mini-do'kon mobil ilovasi.
   AvtoPizza kodda **7-modul** (bot) darslarida turadi: `src/5-Modull` dagi 8 fayl (`BotIntroLesson` … `BotAiAgentLesson`). Men App.jsx bo'yicha yozdim: 7 — «Telegram bot», 8 — «To'liq tizim».
   11-dars MD (TAYANCHGA SAVOL 13) AvtoPizza'ni 8-modul loyihasi deb oladi — ikkalasi bir xil bo'lishi kerak.
2. **«O'rgandim» matnlari (Mentor misoli, 2–8-modul)** — App.jsx `sub` yozuvlaridan o'zim qisqartirdim (masalan `m4a-04` «o'z controller + service», `m4c-07` «test + lint + deploy + monitoring» → «NestJS'da Backend yozish va deployni avtomatlashtirish»).
   Ular o'quvchiga namuna (9-ekranda «Qurdim» oldindan yoziladi, «O'rgandim» — yo'q). «lenta» (4c-Modul obrazi) ishlatilmadi — izoh talab qiladi.
3. **`pm-m8d10-yol` maydonlari.** `modul` — LMS raqami (1–10, son) · `nom` — «Qurdim» · `nima` — «O'rgandim» (masdar gap) · `keyin` — satr. O'tkazilgan modul massivga kirmaydi.
   ✅ (10-FILTR 4) 10-ekrandagi «Qaysi loyihadan o'sadi?» tanlovi — `keyinModul` (modul raqami) bo'lib saqlanadi; tayanch 8 yangilandi.
4. **«Maydon» keyingi qadami — «jamoa yig'ish».** 9-Modul MVP «Keyin» ro'yxatidan (to'lov · jamoa yig'ish · eslatma) va suhbat sanog'idan: Mentor tanlovi; suhbat sanog'i — dalillardan biri, avtomatik ustuvorlik emas (10-FILTR 5) (jamoa — 2 / 5; to'lov — «pulni bo'lishish» 1 / 5; eslatma — 0).
   11-dars MD (TAYANCHGA SAVOL 8) Mentor misolining keyingi qadamini OKR'dan oldi («Oy oxiriga: haftada band qilingan vaqtlar 20 ga yetsin») va 10-dars bilan moslashni so'raydi.
   Taklif: 11-darsning «Keyingi qadam» slaydi — ish + raqam: «Jamoa yig'ishni qo'shamiz: o'yinchi «odam kerak» deb yozadi. Oy oxiriga haftada band qilingan vaqtlar 20 ga yetsin.»
   Keyingi qadam ta'rifi ikki darsda bitta bo'lsin (T-042): 10-dars — «vaqt chizig'idan o'sadigan bitta aniq ish»; 11-dars — «keyingi oyda nima qilinishi va qaysi raqam o'sishi».
5. **Foundation (1-modul)** App.jsx da yo'q (tayanch 4: «o'quvchi o'zi qo'shadi»). App.jsx `m1` period «oy 1–1.5» — bu guruh Foundation'ni o'tmagan bo'lishi mumkin. 1-nuqta uzuq «bo'lgan bo'lsa — o'zingiz qo'shasiz»;
   9-ekranda boshlang'ich holati «o'tkazildi». Hook javobi «portfolio'dan beri» deb sanaydi — Foundation'ga suyanmaydi.
6. ✅ (10-FILTR — auditor: sana shart emas) **«Vaqt chizig'i» ta'rifi.** Tayanch 2 yangilandi; avval: «loyihalar sanasi bo'yicha bir chiziqda». `pm-m8d10-yol` da sana maydoni yo'q, modul tartibi = vaqt tartibi — o'quvchi matnida «qurilgan vaqti tartibida turgan bitta chiziq».
   Sana (Uzum) faqat keysda. Tayanch ta'rifini shunga moslash kerakmi?
7. **Modul raqami o'quvchi matnida** («2-modul · HTML-CSS», kodda «Maydon (9-modul)»). Topshiriq: LMS raqami bilan. P-023 / T-036 «modul raqamisiz» qoidasini «Keyingi dars» qatori va ichki kodlarga tegishli deb oldim — bu darsda modul — chiziqning o'qi.
8. **«unicorn» yozuvi.** Tayanch — «unicorn»; oldingi darslar (`m2-02` PmLesson4, `m4a-02` PmLesson15) o'quvchiga «unicorn» deb yozgan. Bu darsda tayanch bo'yicha «unicorn» (T-014 — modullararo bir xil bo'lishi uchun qaror kerak).
   Oy nomi — «oktabr» (tayanch); oldingi darslarda «oktyabr».
9. ✅ **(SABOQ 2 — 9-Modul pilot qoidasi)** **Uzum brend rangi** (`.ksc-brand`, PM-028) — nom o'z rangida, majburiy; logotip qo'yilmaydi.
10. **K1 Uzum uchinchi marta.** Bank qoidasi faqat modul ichida takrorni taqiqlaydi; o'quvchilar uni `m2-02` va `m4a-02` da ko'rgan. Mentor buni ochiq aytadi, bashorat — yangi (sanalar orasidagi vaqt). Boshqa keys kerakmi — qaror sizda (bankdagi ikkinchi mintaqaviy keys — K2 Telegram Premium, mavzusi monetizatsiya — bu darsga mos emas).
11. **Uyga vazifa ②** (portfolio'ga chiziqni qo'shib, qayta deploy) — portfolio repo'si va Netlify har o'quvchida bor deb oldim (9-Modul 1-dars TAYANCHGA SAVOL 8 bilan bir xil); zaxira — README.

## Shubhali joylar (ishonchim komil emas)
- s0 hook — 9-Modul 1-dars hookiga o'xshash maket (portfolio, `ismingiz.netlify.app`); savol boshqa («Loyihalarim» soni), lekin o'quvchi «yana portfolio» deyishi mumkin.
- s0 javobi «O'shandan beri kursda ko'p loyiha qurildi» (10-FILTR 2: «har modulda» Foundation bilan zid edi) — kurs bo'yicha rost (2–10-modul `Proyekt` darslari); o'z g'oyasini qurgan yoki dars qoldirgan o'quvchi uchun «qurildi» (majhul) shaklida yozildi.
- s2 juda oson bo'lishi mumkin: «To'liq tizim» → «8 · To'liq tizim», «Telegram bot» → «7 · Botlar» nom bo'yicha topiladi. Ekranning ishi — chiziqni qurish va o'sishni ko'rish; nishon shuni ham hisobga oladi.
- s2 yorliqlari «bitta sahifa» / «prodda ishlayotgan sayt» — o'sish da'vosi; «Bu chiziqda» bilan chegaralangan (T-043). Portfolio — besh bo'limli bitta sahifa (`HtmlPractice.jsx`).
- s5 D «Sayt bir yildan beri internetda turgani» — hamma o'quvchida rost emas; distraktor sifatida «sayt haqida gap» bo'lib ishlaydi.
- s6 1/4 — «ko'pincha» qo'shildi (TechCrunch: «primarily … Instagram, TikTok and Telegram»); «yetkazib berishsiz» — bank so'zi, TechCrunch'da bu so'z yo'q (bank qonun fayli — MEXANIZM-TAKLIF 5).
- s6 3/4 «O'zbekistonda bunday kompaniya hali yo'q edi» — bankdagi «mamlakatning birinchi «unicorn»i» dan xulosa.
- s7 1-karta «chiziqdan o'sadi ✓» deb belgilandi (u «Maydon» haqida), xatosi faqat «aniq emas»; 2-karta faqat «bitta emas». Har noto'g'ri karta bitta belgini buzadi — «chiziqdan o'sadi» belgisi 8-savolda (D) tekshiriladi.
- s8 darslik almashish boti — 9-Modul ro'yxatidagi muammodan; «nomidan qidirish» — o'ylab topilgan mashq, real fakt emas.
- s9 nom takrori detektori («qurdim», «qildim», «bitirdim» bilan tugash) to'g'ri gapda ham chiqishi mumkin — shuning uchun faqat yo'naltiradi.
- s10 «bir nechta ish» detektori (« va » + ikki fe'l) bitta ishni tasvirlaydigan gapda ham chiqishi mumkin («ism va telefonni so'rash») — yo'naltiradi, bloklamaydi.
- Arena 6 va 8 distraktorlari («chet eldagi saytlar», «dizayn eskirgani» va h.k.) — bankda yo'q sabablar; savol bank faktini so'raydi, distraktorlar ishonarli, lekin manbasiz.
- Arena 2 «Boshiga — dastlabki loyihalardan biri»: Foundation o'tgan guruhda portfolio 2-nuqta — «biri» so'zi shuni qoplaydi.
- Uyga vazifa zaxirasi «README» — o'quvchi README ni bilishi 9-Modul repo'sidan (Maydon README) taxmin qilindi.
- Mentor misolidagi 2–8-modul nomlari kursning umumiy loyihalari; ularni «Mentor misoli» emas, «kursdagi loyihalar» deb atadim — Mentor misoli faqat 9–10 (topshiriq).

---

## O'lchov (python bilan sanaldi — belgi soni; skript: scratchpad `md10/olchov.py`, 05.10)
- Sarlavhalar (11): 25–54 · hammasi ≤55, bitta qator (yakuniy hukm — brauzerda, T-069).
- Xulosalar (6): 47–102 (≤110) · hook javobi: 112 (≤120) · `QIzoh`: 72, 65.
- Xato izohlari, `QXato`, tekshiruv xabarlari, shart xabarlari (32 ta): 21–60 (≤60).
- Mentor: har ekranda 2 gap; sarlavha bilan umumiy o'zak (5 harf) — 0–43%, hech qayerda ≥50% emas (T-072).
- Ballik savollar: 6, 7, 10, 6 so'z (≤12).
- Variantlar — [A, B, C, D] uzunligi · to'g'ri: 3-savol [33, 29, 35, 26] · D 26 · 5-savol [43, 37, 40, 39] · B 37 · 8-savol [43, 45, 49, 46] · A 43 · 12-savol [48, 43, 44, 44] · C 44.
  Arena: 1 [38, 42, 36, 37] · 2 [35, 37, 43, 35] · 3 [30, 40, 34, 30] · 4 [36, 42, 35, 34] · 5 [17, 18, 15, 17] · 6 [28, 34, 38, 30] · 7 [35, 36, 37, 39] · 8 [31, 29, 29, 27] ·
  9 [17, 22, 21, 18] · 10 [38, 32, 28, 27] · 11 [32, 33, 31, 38] · 12 [40, 37, 35, 36] — hech qayerda to'g'ri javob yolg'iz eng uzun emas.
- `lint:til` — 0 error; 5 warn `kelajak-okr` (A-bo'lim, 7-ekran «Bosh raqam va OKR» yorlig'i, TAYANCHGA SAVOL, shu qator) — topshiriqda kutilgan.

## Pilot qurilishi (05.10.2026, F-1005-169) — kodda MD dan farqlar (ko'rikda tasdiqlanadi)
- 5-ekran C: «Sayt do'stlarga CSS bilan chiroyli ko'ringani» (darvoza `lint:tell`; ✎ belgili).
- 6-ekran: «Uzum — … internet-magazin» — sahnada 1/4 da bir qatorli izoh (SABOQ 2); Mentor gapi «Bu voqeani eshitgansiz…» + bosqich gapi (SABOQ 8). 3/4 bosqich nomi — «Qancha vaqt ketdi?» (MD da nom yo'q);
  sahna yorliqlari MD bosqich matnidan: «ertasi kuni yetkazish», «o'z mashinalari · topshirish punkti», telefonda «ertaga».
- 2-ekran `ishora` yorliqlari (7 ta, masalan «HTML + CSS», «React + API») — quruvchi yozgan. `RECAPS` kartalariga qisqa sarlavhalar qo'shilgan.
- 9-ekran tekshiruvi: «fikr» tekshiruvi «nom takrori»dan oldin; «bir nechta ish» — « va » ning ikkala tomonida fe'l bo'lsa (node: 24/24 namuna).
- 10-ekran: nextStep nishoni ogohlantirishsiz o'tganda; 2-qadam taymer tugagach yoki «To'xtatish»dan keyin; saqlangandan keyin «Tahrirlash» tugmasi; yakka rejimda faqat 1-qadam yorlig'i almashadi.
- «Chizig'im» lentasi 10, 11, 14, 15-ekranlarda (9-ekranda chiziqning o'zi). 11-ekran mini chizig'i kod tugagach yonadi.
- ~~Ochiq vizual~~ → tuzatildi 05.10 kech (F-1005-171): telefonda 7-ekran — 1–8-modullar bitta gorizontal qatorda, uch karta birinchi ekranda (SABOQ 11);
  telefonda egri chiziq yo'q (matnni kesardi) — «Besh suhbat» rangda, «Keyin» ostida dalil qatori «Besh suhbat: jamoaga odam yetmadi — 2 / 5» (mavjud ikki yozuvdan; kompyuterda chiziq va yorliq o'zgarmadi) ·
  ⛶ telefonda mazmun ustida alohida qatorda (0, 6, 7, 9-ekranlar) · 6-ekran: bashoratdan keyin chip, yakunda faqat natija qatori — «Taxminingiz» bir marta.

### Qayta qurish (06.10.2026, foydalanuvchi fidbeki F-1005-175 → F-1005-178) — kodda shunday, ertalab ko'rikda tasdiqlanadi (yangi o'quvchi matni yo'q)
- **YilChizigi:** «oyoq» yoylar (`yc-yoy`) hamma joydan olindi — o'tkazilgan modul ostida kulrang «o'tkazildi» chipi; to'liq ko'rinish 7 dan ko'p nuqtada ikki qator (1–5 · 6–10 + «Keyin»);
  yangi ko'rinishlar `tik` (vertikal, kirishda chiziladi) va `qadam` (raqamli doira, holat belgisi, qisqartirilgan nom); bosilgan narsa joyiga uchadi.
- **0-ekran:** portfolio yonida vertikal chiziq kirishda 1→10 chiziladi; javobdan keyin chiziqdan «Loyihalarim»ga strelka va tanlangan son. **1-ekran:** chiziqning oldindan ko'rinishi — matnsiz kartalar navbat bilan, oxirida «Keyin».
- **2-ekran:** chiziq ikki qatorda; joriy karta katta, to'g'ri bosilganda modul ostiga uchadi; Foundation yozuvi, «bitta sahifa», «prodda ishlayotgan sayt» — oddiy chip.
- **4-ekran:** `QQadamlar` olindi — chiziqdagi uch loyiha qadam vazifasini bajaradi. **6-ekran:** sahna yorliqlari faqat o'z bosqichida; yakunda sahna kichrayadi, taxmin xulosaning birinchi qatori.
- **7-ekran:** uch karta «Keyin» yonida ustunda; bir bosishda katakka uchadi (sudrash ham ishlaydi); belgilar navbat bilan ✓/✗.
- **9-ekran:** tepada «qadam» chizig'i, nuqta bosilsa bitta katta karta (✎ o'rniga nuqta); uzun nom «…» bilan qisqaradi.
- **10-ekran:** «Chizig'im» lentasi olindi (chiziqning o'zi turibdi); bir vaqtda bitta katta qadam (150 px taymer → «Keyin» formasi, sarlavhada «1 / 2»); saqlangach tirsak ulagich.
- **11-ekran:** o'ngdagi kichik chiziq o'rniga chapda natija massivi oldindan: `[0]…[3]`, javobdan keyin qatorlar tushadi, kod yechilgach ✓ (qatorlar `KOD_STARTER` izohidagi kutilgan natijadan).
- Ochiq: telefonda 10-ekran taymer tugmasi birinchi ko'rinishdan pastda; RU 7-ekran 10-modul yozuvlari zich.

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (DE-205): App.jsx `m8-09` «Loyiha kuni: prodga ko'tarish — 2-qism» → **`m8-10` «Bir yilda nimalarni qurdingiz?»** → `m8-11` «Besh daqiqada nimani ko'rsatasiz?»;
  reja chap matni App.jsx ostiga so'zma-so'z («yillik yo'l: loyihalar vaqt chizig'ida va keyingi qadam»); yakun «Keyingi dars — «Besh daqiqada nimani ko'rsatasiz?»».
- [x] Bitta misol-ip — «Maydon» (tayanch 1; 9–10 — chiziqning oxirgi qismi); metafora yo'q; bitta vizual — `YilChizigi` (to'liq · ixcham · kengaygan · voqea). Ikkinchi misol faqat testda (darslik almashish boti — 8). Keys — K1 Uzum (tayanch 5), sahnasi — o'sha vizual.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 7 (QTushuncha) + 0, 6, 9, 10, 11. «bosish, keyin matn-karta» naqshi yo'q: har harakatda chiziqda nuqta, yozuv, chiziq yoki yorliq o'zgaradi.
- [x] O'lchov: sarlavha ≤55 bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — sonlar yuqoridagi «O'lchov» bo'limida.
- [x] Atamalar oldingi darslar bilan bir xil (grep): portfolio va «Loyihalarim» — `HtmlPractice.jsx` · keyingi qadam — `PmLesson3.jsx` (Demo Day nutqi bo'lagi) · suhbat — 9-Modul 3-dars nomi va `00-TAQIQLAR` 6 ·
  loyiha nomlari — App.jsx `Proyekt` qatorlari · modul nomlari — tayanch 4 / v9. Yangi: vaqt chizig'i (tayanch 2), keyingi qadam ta'rifi, «unicorn» (tayanch 5). Siz-forma; tugmalar ot-shaklda yoki siz-formada (§222/224).
- [x] Testlar: 4 variant, uzunlik yaqin, to'g'ri javob eng uzun emas (sonlar — o'lchov natijasida); kalit so'z faqat to'g'rida emas («Botga» — 8-A, C; «keyingi qadam» — 12-B, C; «Ha/Yo'q» 2/2);
  strelka va qavs variantlarda yo'q (T-035); ✔ o'rni D/B/A/C (yangi dars). Inkor-savol yo'q.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami — nishon, arena, podium — mustasno; ✓ ✗ → — belgilar, faqat vizual yorliqlarda); kafolat gaplari yo'q («har doim», «100%», «darrov», «albatta», «faqat» — o'quvchi matnida yo'q).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m8-10`, «8-Modull», T/P kodlari — faqat MD izohlarida; modul — LMS raqami bilan); tarixiy voqea — K1 bank manbasi bilan (6-ekran «Manba»); «KOD» ro'yxati 17 band, REPO 0.
- [x] Karta T · P · S · PM ko'rildi: T-011 (vaqt chizig'i, keyingi qadam — misoldan keyin; reja sarlavhasida atama yo'q) · T-014/T-015 («chiziq», «qadam», «yo'l», «qator», «suhbat» — bir ma'noda) ·
  T-016/017 (metafora yo'q) · T-020 · T-029/T-047 (Mentor ekrandagini ta'riflamaydi, natijani aytmaydi) · T-039 («chizig'ingiz» — 9-ekrandan keyin; 0-ekranda «portfolio saytingiz» — o'quvchida bor) ·
  T-042 (ta'riflar so'zma-so'z: A-4, QIzoh, kartochka, recap, yakun) · T-043 («Bu chiziqda», «Bu misolda» — 2, 7) · T-046 (darslik boti — o'smir olami) · T-052 (keyingi qadam — Demo Day bo'lagi bilan tenglashtirildi, O'qituvchi eslatmasida) ·
  T-064 · T-070 (3-savol qo'llash-savol) · P-001/P-002 · P-008 · P-010 · P-012 (testlar ketma-ket emas: 3, 5, 8, 12) · P-013 · P-014/P-015 · P-016 · P-025 (uyga vazifa karta, P-026 zaxira qatori) · P-033 ·
  P-036 (Mentor xulosani oldindan aytmaydi) · P-046 (9-ekran xulosasi o'quvchi sonidan) · P-048 · P-052/P-053 (keys sahnasi — o'sha vizual) · P-062 (son ekranda bir marta: Mentor «uchta», «yetti» demaydi) · P-064 · P-067 ·
  S-001 (savollar 6–10 so'z) · S-002/S-004/S-010 · S-003 · S-006 · S-008 · S-015 (keysda 1 bashorat, zinapoya) · S-018 (Uzum izohi 6-ekran Mentorida) · S-019 · S-020 (CI/CD, Backend, deploy — faqat yorliqlarda; ballik matnda «prod», «NestJS» kabi atama yo'q, A/B — shu modulda o'tilgan) ·
  S-026 · S-027 · S-031/S-034 · §123 (bashorat chipida atama — ta'rif oldin) · §140-B (starter 0/3) · §144/145 ·
  PM-005 (2-tur) · PM-016 (keys bankdan; boshqa darsning keysi tilga olinmaydi — Uzum shu darsning keysi) · PM-017 · PM-018 (odam roli bilan, halollik-izohi yo'q) · PM-020 · PM-027 (yangi uyga vazifa fayli yo'q) · PM-028 · PM-030 · PM-082 · PM-108 · J-026.
- [?] Ochiq: TAYANCHGA SAVOL 1 (AvtoPizza) va 4 (Maydon keyingi qadami — 11-dars bilan); 9-ekran o'n nuqta + forma telefonda (393 px) sig'ishi, 7-ekran kengaygan chiziq 1280 da — vizual bosqichda ko'riladi (U-006).
