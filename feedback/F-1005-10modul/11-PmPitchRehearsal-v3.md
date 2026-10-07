# 10-Modul · 11-dars (PM) «Besh daqiqada nimani ko'rsatasiz?» — MD v3

Fayl: `src/8-Modull/PmPitchRehearsalLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m8-11` · **17 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **D** (`3`) · 7-ekran — **A** (`0`) · 9-ekran — **C** (`2`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx, DE-205): `m8-10` «Bir yilda nimalarni qurdingiz?» → **`m8-11` «Besh daqiqada nimani ko'rsatasiz?»** (osti: «pitch repetitsiyasi va qattiq fidbek») → `m8-12` «Zaxira dars».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (besh slaydli pitch) va uning repetitsiyasi; mustaqil ish majburiy (11-ekran). Keys — **K12 Airbnb pitch deck** (tayanch 5, raqamsiz). REPO yo'q (PM darsi; `maydon` repo'ga tegilmaydi).
Dastur: «Pitch repetitsiyasi — 5 daqiqalik pitchning to'liq repetitsiyasi, qattiq fidbek» · natija «Pitch tuzatilgan». Ommaviy himoya — keyingi modulda (Demo Day 7); o'quvchi matnida va'da qilinmaydi (T-038), faqat O'qituvchi eslatmasida.
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 5 · tushuncha va testlar (2–9) ≈ 30 · SQL ≈ 8 · mustaqil ish ≈ 12 · repetitsiya va baholash ≈ 18 · tuzatish ≈ 6 · podium, kartochkalar, arena ≈ 11.
Manba: `00-MODUL-TAYANCH.md` (1 — A/B raqamlari va OKR aynan · 2 — atamalar · 5 — K12 · 7 — takroriy xatolar · 8 — saqlanadigan natija · 9.1 — kod mexanikasi) · `GATE_M_JAVOB.md` (qaror 13) · `00-TAQIQLAR.md` ·
`feedback/F-1005-9modul/12-PmUserStoryPitch-v3.md` (atamalar, «hikoya», uch slayd va ularning matni aynan) · `08-ProdUpgrade-v3.md` (A/B yakuni yozuvi).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (qaror 13, dastur «Pitch tuzatilgan»):** o'quvchi o'z loyihasining pitchini 5 daqiqaga kengaytiradi — besh slayd: **muammo → yechim → foydalanuvchi → raqamlar → keyingi qadam**;
   sinfdosh oldida taymer bilan aytadi, sinfdosh **baholash varag'ini** to'ldiradi (qattiq, lekin hurmatli fidbek), o'quvchi eng zaif (✗ olgan) slaydni tuzatadi; qolgan ✗ — uyda (11-FILTR 7).
   Saqlanadi: `pm-m8d11-pitch` (TAYANCHGA SAVOL 6). **Raqamlar slaydi — ikki blok:** «Bosh raqam» (oldin → hozir) va «A/B» (A va B) + bitta «Halol gap» — o'lchovlar aralashmaydi (11-FILTR 2).
   Bosh raqamning hozirgi qiymati o'quvchining o'z Database'idan olinadi (10-ekran, Neon SQL Editor). Mentor misoli — «Maydon».
2. **Bugungi asosiy fikr (P-013):** Har slayd zalning bitta savoliga javob beradi; fidbek qaysi javob yetmaganini ko'rsatadi. (Yakunda ScoreRing ostida — so'zma-so'z shu.)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan:**
   - 9-Modul 12-dars (MD aynan): **pitch** (loyihaning qisqa taqdimoti) · **slayd** (taqdimotning bitta sahifasi) · **zal** (pitchni tinglaydiganlar) · **hikoya** — «bitta real odam bilan bo'lib o'tgan ish» ·
     **repetitsiya** — «sahnadan oldin pitchni ovoz chiqarib aytib ko'rish» · uch slayd **Muammo · Yechim · Foydalanuvchi** · intervyu, yozuv, sinov (9-Modul atamalari) · investor — «loyihaga pul tikadigan odam».
   - 8-Modul 14-dars (YAKUNIY): gapiradigan slaydda uch qator — **raqam, u nimani sanadi, u nimani ko'rsatadi** · **mehnat raqami** · «Yo'q raqamni o'ylab topmaysiz — bor raqamga izoh berasiz».
   - 10-Modul: **bosh raqam** (haftada band qilingan vaqtlar) · OKR · A/B test, variant A / variant B · sanoq — har qadamda turli brauzerlar · dashboard · **yillik yo'l**, **keyingi qadam** (10-dars osti yozuvi) · SQL Editor (9-Modul 9-dars, 10-Modul 2, 8).
   - SQL: `SELECT`, `WHERE` (`m4-06` «PostgreSQL so'rovlar — CRUD + AI bilan», LMS 5-Modul — `src/4-Modull/PostgresCrudLesson.jsx`, grep; «so'rov» u yerda SQL ma'nosida, bu darsda ishlatilmaydi) · `COUNT(DISTINCT …)` (2-dars, tayyor holda) · `COUNT(*)` va `NOW() - INTERVAL '7 days'` — bugun yangi, Yordam'da bir qatordan izoh.
4. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar dars bo'yi so'zma-so'z (T-042):**
   - **Raqamlar slaydi** — sayt ishga tushgach sanalgan raqamlar; zal savoli «Sayt ishga tushgach nima bo'ldi?» (2-ekran).
   - **Keyingi qadam slaydi** — keyingi oyda nima qilinishi va qaysi raqam o'sishi; zal savoli «Endi nima qilasiz?» (2-ekran). «Keyingi qadam» — 10-dars osti yozuvidagi so'z.
   - **halol gap** — raqam qanday sanalganini va undan qancha xulosa qilsa bo'lishini ochiq aytish (6-ekran 3-bo'lagi; tayanch 1 «Halol gap: …» shaklidan; «qancha odamdan» emas — sanoq birligi brauzer yoki band, 11-FILTR 3).
   - **fidbek** — tinglovchining pitchdagi aniq joy haqidagi fikri yoki taklifi (8-ekran xulosasi; menyu osti yozuvidagi so'z; 11-FILTR 8-ekran). **Qattiq, lekin hurmatli fidbek** — qaysi slayd va unda nima yetishmagani aniq aytiladi, odam haqida gap yo'q.
   - **baholash varag'i** — har slayd uchun zalning bitta savoli yozilgan varaq; tinglovchi har biriga ✓ yoki ✗ qo'yadi (8-ekran joriy qatori). Varaqdagi narsa — **savol** («band» emas, TAYANCHGA SAVOL 4).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«band»** faqat band qilish ma'nosida (`bandlar` jadvali ham). Baholash varag'idagi narsa — «savol» (MATN_ETALONI lug'ati: baholash-mexanikada «mezon» → «savol»).
   - **«slayd»** — taqdimot sahifasi; besh slayd nomi har joyda aynan: **Muammo · Yechim · Foydalanuvchi · Raqamlar · Keyingi qadam**. «Qism» so'zi pitch uchun ishlatilmaydi.
   - **«natija»** o'quvchi matnida ishlatilmaydi: A/B haqida — «A/B sonlari», SQL haqida — «Neon ko'rsatgan son». «Asosiy natija» ham yo'q (OKR eslatmasi «hozir → oy oxirida» shaklida). «Kutilgan natija» o'rniga — «namuna».
   - **«reja»** faqat reja ekranining yorlig'i. Keyingi qadam haqida — «hali bo'lmagan», «hali oldinda».
   - **«sinov»** — faqat 9-Moduldagi real odam bilan sinov (Foydalanuvchi slaydi); repetitsiya sinov deyilmaydi. **«so'rov»** ishlatilmaydi — SQL «SQL» deb ataladi.
   - **Ishlatilmaydi:** rubrika · mezon · feedback (lotin yozuvida) · konversiya · eksperiment · voronka · «sir».
6. **Mentor misoli — «Maydon» pitchi (bitta manba `MAYDON_PITCH`, 180-qonun):**
   - **Muammo** (9-Modul 12-dars aynan): `4 / 5` · 5 suhbatdan «maydon band edi» deganlar · hikoya: «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.»
   - **Yechim** (aynan): Sayt kun bo'yicha bo'sh vaqt kataklarini ko'rsatadi, katakni band qiladi.
   - **Foydalanuvchi** (aynan): Sinovda o'yinchi shanba 18:00 ga band qilmoqchi bo'ldi, lekin «Band qilish» tugmasini topa olmadi. · Tugmani ekran pastiga qotirdik — qayta sinovda yangi o'yinchi birinchi urinishda band qildi.
   - **Raqamlar** — ikki blok va halol gap (11-FILTR 2):
     · **Bosh raqam:** haftada 6 dan 11 ga band (maqsad — 20) — tayanch 1. Birinchi qoralamada bu blok yo'q — 8-ekranda shu kamchilik fidbek bo'ladi; tuzatilgan holatda qo'shiladi.
     · **A/B** (tayanch 1, 8-dars A/B yakuni; 08 MD yozuvi bilan bir xil): «18:00 ni band qilish» tugmasi (B) — vaqtni tanlagan 40 brauzerdan 17 tasi band qildi · «Band qilish» tugmasi (A) — 42 tadan 12.
     · **Halol gap:** «Farq bor, lekin 82 ta brauzer hali kam — raqamni kuzatib boramiz.» (Mentor gapi aynan) · bosh raqam uchun: «Maqsad 20 edi — yetmadi.» (tayanch 1: «pitchda halol aytiladi»).
   - **Keyingi qadam** (tayanch 1, 10-dars bilan bir xil): Jamoa yig'ish — o'yinchi o'yinga sherik topa olsin (9-Modul suhbatlarida 5 kishidan 2 tasi aytgan). Keyingi oyda: haftada band qilingan vaqtlar 20 ga yetsin (hozir 11).
     (05.10: avvalgi «Hamma o'yinchiga B tugmasi» olindi — u 8-darsda allaqachon qilingan, keyingi qadam emas.)
     (OKR maqsadi «Mahalladagi o'yinchilar maydonni qo'ng'iroqsiz band qilsin» — kulrang yorliq; TAYANCHGA SAVOL 8.)
7. **Keys — K12 Airbnb pitch deck** (bank matni aynan, raqamsiz; boshqa fakt qo'shilmaydi): investorlar uchun birinchi taqdimot · o'nga yaqin oddiy slayd · tartib: muammo → yechim → bozor → mahsulot → jamoa ·
   eng ko'p o'rganiladigan pitchlardan biri, hammaga ochiq turadi. Brend izohi (S-018, birinchi ko'rinishda): «Airbnb — begonaning uyida ijaraga turish xizmati». Yil, pul, slaydlar soni raqam bilan — yo'q.
8. **Metafora yo'q.** Ikkinchi misol faqat testda (P-002): **mini-do'kon sayti** (3-ekran; 3-Moduldagi loyiha) · **AvtoPizza** (7-ekran; 7-Moduldagi bot loyihasi — 05.10 tayanch 4 tuzatildi) — ikkalasi tayanch 4 ro'yxatidan, sonlari mashq uchun.
9. **Toza yuza (185, D4):** tugma, variant, karta, yorliqda emoji yo'q; zal siluetlari va taymer chizig'i chizilgan (CSS). ✓ ✗ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno.
10. **Kod mexanikasi (tayanch 9.1, PM_DARS_ETALON 26):** `m8-10` — JS funksiya kod oynasida; `m8-11` — boshqa mexanika: **Neon SQL Editor topshirig'i** (bosh raqamni o'z Database'idan sanash, `bandlar` jadvali misolida),
    chapda vazifa + bitta bo'sh joyli SQL + Yordam + «Bajardim», o'ngda Neon maketi. Kod oynasi (`HtmlCompiler`) yo'q.

## Darsning ipi va bitta vizual

- **Modul ipi — «Maydon» davomi** (tayanch 1): 9-Modulda qurilgan MVP 10-Modulda o'lchandi (OKR, hodisalar, dashboard), A/B bilan sinaldi, himoyalandi va prodga chiqdi. 11-dars — shu yo'lni 5 daqiqalik pitchga yig'ish.
- **Dars ipi:** hook'da 1 daqiqalik «Maydon» pitchi va bo'sh 4 daqiqa → 2-ekranda ikki slayd qo'shiladi, har slayd ustida zal savoli, vaqt beshga bo'linadi → 4-ekranda Airbnb tartibi (muammodan boshlanadi) →
  6-ekranda Raqamlar slaydi zal ishonadigan holatga keladi → 8-ekranda sinfdosh fidbeki baholash varag'iga yoziladi (Raqamlar slaydida bosh raqam yo'qligi ham shu yerda chiqadi) →
  10-ekranda o'quvchi o'z bosh raqamini Database'dan oladi → 11-ekranda besh slaydni yozadi → 12-ekranda 5 daqiqada aytadi, sinfdosh varaqni to'ldiradi → 13-ekranda ✗ olgan slayd tuzatiladi → uyda real tinglovchiga.
- **Bitta vizual — Sahna (`PitchSahna`, dars bo'yi, 163/180):** 9-Modul 12-dars Sahnasining davomi, bitta komponent, to'rt qatlam:
  - **slayd tasmasi** — 1–5 oq slayd-karta (nomlari yuqorida, aynan); har birida qatorlar. Qator holatlari (9-Moduldagidek): bo'sh (kulrang uzuq chiziq, U-041) → yozildi (matn bir lahza ajralib kiradi) → joriy (accent chegara) →
    xato (`err` fon) → slayd to'liq (burchakda yashil ✓) · yangi holat **tuzatildi** (yashil ✓ + kichik yorliq «tuzatildi», 13-ekran).
  - **taymer chizig'i** — slaydlar ostida 0–5 daqiqa; 2-ekrandan keyin besh teng bo'lakka bo'lingan, har bo'lak ostida slayd nomi; taymer yurganda joriy bo'lak accent; 5:00 dan oshsa chiziq o'ngga qizil davom etadi, yonida «+m:ss».
  - **zal** — to'rtta chizilgan bosh-siluet (CSS doira + yarim doira) va ular ustida bitta **savol pufagi**; slayd to'lmaguncha pufakda shu slaydning zal savoli, to'lsa — yashil ✓.
    Zal savollari (bitta manba `ZAL_SAVOL`, P-063; birinchi uchtasi 9-Modul 12-dars aynan): Muammo — «Bu qanday bo'lgan?» · Yechim — «Sayt nima qiladi?» · Foydalanuvchi — «Kimdir ishlatib ko'rdimi?» ·
    Raqamlar — «Sayt ishga tushgach nima bo'ldi?» · Keyingi qadam — «Endi nima qilasiz?».
  - **baholash varag'i** — zal oldidagi varaq: besh qator (slayd nomi · zal savoli · ✓/✗ katagi · bitta izoh qatori) va pastda «Vaqt: m:ss» (taymerdan o'zi yoziladi). 8, 12, 13-ekranlarda ochiladi.
  - Ishlatiladi: 0 (uch slayd + taymer) · 1 (skelet) · 2 · 4 (slayd tasmasi Airbnb holatida, zal va taymersiz) · 6 (bitta Raqamlar slaydi katta) · 8 (varaq + «Maydon» besh slaydi kichik) · 10 (Raqamlar slaydi ixcham) · 11 · 12 · 13.
    `prefers-reduced-motion` da harakat to'xtaydi, holat birdan qo'yiladi. Telefon kengligida (393) varaq slaydlar ostiga tushadi.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · «Maydon» pitchi
- Sarlavha: **Besh daqiqada nimani ko'rsatasiz?** — dars nomi (DE-205)
- Mentor: «Maydon» pitchi o'tgan modulda bir daqiqa edi va uch slayddan iborat edi. Endi zal sizga besh daqiqa beradi.
- Maket (chap): Sahna — uch slayd (Muammo · Yechim · Foydalanuvchi; matni kichik, A-6 dan) · ostida taymer chizig'i 0–5 daqiqa: birinchi 1 daqiqa to'q, qolgan 4 daqiqa uzuq chiziq · zal — jim, pufakda «?».
- Variantlar (radio, o'ng; bir uzunlikda):
  - Uch slaydni batafsilroq, misollar bilan
  - Sayt ishga tushgach chiqqan raqamlarni
  - Saytni qanday qurganimni, qadamma-qadam
- Javob — «raqamlar»: **Aynan!** Zal sayt ishga tushgach nima bo'lganini ko'rmoqchi. Yana bitta savol ham bor — keyingi ekranda. (102)
- Javob — «batafsilroq»: **Qiziq fikr!** Hikoyani to'liqroq aytish foydali, lekin zal sayt ishga tushgach nima bo'lganini ham kutadi.
- Javob — «qurganimni»: **Qiziq fikr!** Mehnatingiz ko'rinadi, lekin zal odamlar saytni ishlatganini ham ko'rmoqchi.
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent; taymer chizig'idagi bo'sh 4 daqiqa bir lahza yonadi, ustida kulrang yorliq «4 daqiqa bo'sh»; zaldagi boshlar o'sha bo'sh joyga buriladi.
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- O'qituvchi eslatmasi: 1 daqiqalik pitch o'tgan modulning oxirgi darsida yozilgan (uch slayd, juftlikda 2 daqiqa). Sinfdan so'rang: zal sizdan yana nimani so'rashi mumkin?

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun pitchingizni 5 daqiqaga kengaytirib, tuzatasiz.**
- Mentor: Bir daqiqalik pitchingiz, OKR'ingiz va A/B testingizning sonlari bugun kerak bo'ladi.
- Chap — «Dars oxirida — pitch repetitsiyasi va qattiq fidbek» (App.jsx osti bilan so'zma-so'z, P-015) + Sahna: beshta nomsiz slayd skeleti va ostida taymer chizig'i —
  kulrang chiziqlar 0.9 s oraliqda birma-bir to'q chiziqqa aylanadi (matnsiz — keyingi ekranlar javobini ochmaydi), oxirida zal ustida ✓.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015):
  - 01 · Pitchga qaysi slaydlar qo'shilishini bilib olasiz · `5 daqiqa`
  - 02 · Mashhur taqdimot qanday boshlanganini ko'rasiz · `biznes`
  - 03 · Raqamni zal ishonadigan qilib yozasiz · `raqamlar`
  - 04 · Pitchni sinfdoshga aytib, tuzatasiz · `baholash varag'i`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011); «pitchingiz» — o'quvchida 1 daqiqalik pitch bor (T-039). «Baholash varag'i» — faqat kulrang teg (P-015 «qiyin atama kulrang yorliqqa»).

## 2 · Besh slayd  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · besh slayd
- Sarlavha: **Qolgan to'rt daqiqada zal nimani so'raydi?**
- Mentor: «Maydon» pitchining uch slaydi o'tgan modulda tayyor bo'lgan. Ikki slayd qo'shing va har slayd ustida zal nimani so'rashiga qarang.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Besh daqiqaning qanchasi yangi slaydlarga ketadi?** · 1 daqiqa · 2 daqiqa · 3 daqiqa — tanlov saqlanadi, qadamlar shundan keyin ochiladi.
- O'ng — Sahna: uch slayd to'liq (Muammo · Yechim · Foydalanuvchi, burchagida yashil ✓), yonida ikki bo'sh slayd o'rni (uzuq chiziq) · ostida taymer chizig'i (1 daqiqa to'q) · zal, pufakda «?».
- Chap — qadam-ro'yxati (`QQadamlar`, 163.8; joriysi accent, o'tgani ✓): 1 Raqamlar slaydini qo'shing · 2 Keyingi qadam slaydini qo'shing · 3 Vaqtni slaydlarga bo'ling
- **Harakat → Vizual o'zgarish:** joriy qadam tugmasini bosish → Sahna o'zgaradi:
  1. 4-o'rinda **Raqamlar** slaydi paydo bo'ladi, ichida bitta qator: «"18:00 ni band qilish" tugmasi bilan — 40 tadan 17» · pufak shu slayd ustida: «Sayt ishga tushgach nima bo'ldi?» · taymer chizig'iga bir bo'lak qo'shiladi.
  2. 5-o'rinda **Keyingi qadam** slaydi, ichida ikki qator: «Jamoa yig'ish — o'yinchi o'yinga sherik topa olsin» · «Keyingi oyda: haftada band qilingan vaqtlar 20 ga yetsin» · pufak: «Endi nima qilasiz?» · yana bir bo'lak.
  3. taymer chizig'i besh bo'lakka bo'linadi, har bo'lak ostida slayd nomi va «≈1 daqiqa»; zal pufagi beshta slayd ustidan birma-bir o'tib, oxirida ✓ bo'ladi.
  Natija qatori (`QTaxmin`): «Taxminingiz: … · bu mashqda: taxminan 2 daqiqa» yoki «Taxminingiz mashqdagi taqsimotga mos».
  Qator (`QIzoh`, natijadan keyin): Bu mashq uchun boshlang'ich taqsimot — bir slayd qisqaroq, boshqasi uzunroq bo'lishi mumkin; jami 5 daqiqa. (11-FILTR 6)
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Keyingi qadamni bosing — zal qaysi slaydda nimani so'rashini ko'ring.
- Xulosa: Besh daqiqalik pitchda besh slayd bor — har biri zalning bitta savoliga javob beradi.
- Tugma (pastki): Qadamlarni bajaring (N/3) → Davom etish · `tugadi`: qadam-ro'yxati yopiladi, Sahna butun enga (DE-199); vizual ⛶ ichida (q17).
- O'qituvchi eslatmasi: Raqamlar slaydida sanalgan, bo'lib o'tgan raqam turadi; Keyingi qadam slaydida — hali bo'lmagan raqam. Pufak savollarining zamoniga e'tibor bering: «nima bo'ldi?» va «nima qilasiz?».
  Besh bo'lakka teng bo'lish — darsdagi kelishuv (TAYANCHGA SAVOL 2); o'quvchi o'z pitchida vaqtni boshqacha bo'lishi mumkin, jami 5 daqiqa qoladi.

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · raqamlar yoki keyingi qadam
- Savol: **Mini-do'kon: «Oy oxirigacha buyurtmalar 30 taga yetsin». Qaysi slayd?** — (MD izohi: mini-do'kon — 3-Moduldagi loyiha, tayanch 4; son mashq uchun.)
  - A — Raqamlar slaydi — unda aniq son bor
  - ✔ B — Keyingi qadam slaydi — hali bo'lmagan
  - C — Muammo slaydi — bu buyurtmachilar soni
  - D — Yechim slaydi — buni sayt qilib beradi
- To'g'ri izohi: Bu son hali bo'lmagan — u keyingi oyda yetiladigan raqam.
- Xato izohlari: A — Son bor, lekin u hali sanalmagan — u oldinda. · C — Muammo slaydi muammo nechta odamda chiqqanini aytadi. ·
  D — Yechim slaydi sayt nima qilishini aytadi. · umumiy — Bu son bo'lib o'tganmi yoki hali oldindami?
- Yozuvlar (barcha testlarda bir xil, qolip): To'g'ri · Qaytadan urinib ko'ring · (jonli darsda xato tanlansa) To'g'ri javob: X — …
- Izoh (MD): savolda «keyingi» so'zi yo'q — to'g'ri variant savolni takrorlamaydi (T-070); har variant «slayd — sabab» shaklida, tire hamma variantda (S-003).

## 4 · Airbnb  ← QVoqea
- Eyebrow: Biznes olamidan
- Sarlavha: **Airbnb investorlarga birinchi nimani ko'rsatgan?**
- Mentor: Airbnb — begonaning uyida ijaraga turish xizmati. Investor — loyihaga pul tikadigan odam.
- Nuqtalar: 4 ta · yorliq **Airbnb · N/4** (bashorat kartasida ham) · maket: Sahnaning slayd tasmasi Airbnb holatida — o'nga yaqin oddiy oq slayd-karta (son yozilmaydi), zal va taymer yo'q;
  «Airbnb» nom-yorlig'i o'z rangida (182-qonun; rang — TAYANCHGA SAVOL 9), logotip yo'q.
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi):
  - 1/4 **Investorlar uchun taqdimot** — Airbnb investorlarga birinchi taqdimotini tayyorlagan. Unda o'nga yaqin oddiy slayd bo'lgan. · maket: oq slayd-kartalar tasmasi, hammasi bo'sh
  - 2/4 bashorat — **Muammo slaydi tartibda qayerda turgan?** · Boshida · O'rtasida · Oxirida (bitta o'lchov — o'rin, tartib bilan; S-015) · maket: tasma ustida «?» belgisi
  - 3/4 **Muammodan jamoagacha** — Tartib shunday: muammo, yechim, bozor, mahsulot, jamoa. Bozor — mahsulotni ishlatishi mumkin bo'lgan odamlar qanchaligi, jamoa — loyihani qilayotgan odamlar. ·
    maket: tasmadagi birinchi beshta kartaga nomlar birma-bir yoziladi: Muammo · Yechim · Bozor · Mahsulot · Jamoa (karta ichida strelka emas — tartib kartalarning o'zida)
  - 4/4 **Ko'p o'rganiladigan pitch** — Bu taqdimot hammaga ochiq turadi va eng ko'p o'rganiladigan pitchlardan biri. · maket: tasma butun ko'rinadi, «Muammo» kartasi accent
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: boshida» yoki «Taxminingiz to'g'ri chiqdi».
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → tasma holati o'zgaradi: bo'sh kartalar → «?» → nomlar birma-bir yoziladi → «Muammo» kartasi accent. Bashoratda tanlangan variant ✓/✗ va `QTaxmin` qatori.
- Xulosa (4/4 dan keyin, hisoblagichsiz): Airbnb taqdimoti oddiy slaydlardan iborat bo'lgan va muammodan boshlangan.
- ✎ SABOQ 8 (qaror 81 A): bosqich gapini Mentor aytadi — matn o'zgarmaydi, joyi Mentor pufagi, har bosqichda almashadi; sahnada — bosqich nomi va jonli maket; yakuniy xulosa pastda yashil.
- ✎ SABOQ 2, 3: «Airbnb» nom-yorlig'i o'z rangida; slayd tasmasi — tanish taqdimot ko'rinishi (namuna — m6-14 `DeckMock`), logotipsiz; mavhum blok-maket — rad.
- Tugma (pastki): Keyingi bosqich (N/4) → Davom etish
- O'qituvchi eslatmasi: Taqdimot internetda ochiq — vaqt bo'lsa, proyektorda bir marta varaqlab ko'rsating. O'quvchi pitchida bozor va jamoa slaydi yo'q: sinfdagi pitchda zal loyiha va odamlarni so'raydi.
  Investor bilan ishlash — bu darsning mavzusi emas. Airbnb — misol: hamma pitch muammodan boshlanadi degan qoida chiqarmang.
- Manba (o'quvchiga ko'rinmaydi): bank K12 (`PM_Prompt_v8.md`: «Первая презентация Airbnb для инвесторов — около десятка простых слайдов: проблема → решение → рынок → продукт → команда.
  Один из самых разбираемых питчей, лежит в открытом доступе.» · Цифры: без цифр). Brend izohi — S-018 namunasidan aynan. Ochiq manbalar (05.10.2026, qidiruv; o'quvchi matniga olinmagan):
  officechai.com/stories/airbnbs-pitch-deck/ · slideshare.net/ryangum/airbnb-pitch-deck-from-2008 — slaydlar soni manbalarda 10 yoki 14 deb beriladi (shubhali joylar).

## 5 · 2-savol  ← QTest (✔ D, `correctIdx 3`; Airbnb qoidasi «Maydon»ga)
- Eyebrow: Tekshiruv · Airbnb'dagidek
- Savol: **Airbnb'dagidek, «Maydon» pitchi qaysi slayd bilan boshlanadi?**
  - A — Saytni qurgan jamoani tanishtirgan slayd bilan
  - B — Sayt vaqt kataklarini ko'rsatgan slayd bilan
  - C — Saytda A/B testi sonlari yozilgan slayd bilan
  - ✔ D — O'yinchi band maydonga kelgan slayd bilan
- To'g'ri izohi: Bizning pitch tartibimizda ham avval muammo keladi, keyin yechim.
- Xato izohlari: A — Jamoa Airbnb tartibida oxirida turgan. · B — Kataklar — yechim; zal hali muammoni bilmaydi. ·
  C — Raqamlar muammo va yechimdan keyin keladi. · umumiy — Airbnb taqdimoti qaysi slayddan boshlangan edi?
- Izoh (MD): Airbnb — misol, hamma pitch uchun qoida emas (11-FILTR 8); to'g'ri izohi bizning besh slayd tartibi bilan cheklangan.

## 6 · Raqamlar slaydi  ← QTushuncha
- Eyebrow: Tushuncha · raqamlar
- Sarlavha: **A/B raqami qachon tushunarli bo'ladi?**
- Mentor: Raqamlar slaydiga «Maydon» A/B testidan bitta raqam qo'yildi. Bo'laklarni birma-bir qo'shib, zal savoliga qarang.
- Bashorat (ballsiz, zinapoya): **«17» yonida yana nechta bo'lak kerak?** · 1 · 2 · 3 — tanlov saqlanadi.
- O'ng — Sahna: bitta **Raqamlar** slaydi katta; ichida faqat katta «17» va uch bo'sh qator (uzuq chiziq); zal pufagi: «17 nima?»
- Chap — bo'lak tugmalari (`QQadamlar`; joriysi accent, qo'shilgani ✓): 1 U nimani sanashini qo'shing · 2 Solishtirishni qo'shing · 3 Halol gapni qo'shing
- **Harakat → Vizual o'zgarish:** joriy bo'lak tugmasini bosish → bo'sh qator yoziladi va pufak javob beradi:
  1. «"18:00 ni band qilish" tugmasi bilan vaqtni tanlagan 40 brauzerdan 17 tasi band qildi» → pufak «Bu ko'pmi, kammi?»
  2. «"Band qilish" tugmasi bilan — 42 tadan 12» (ikki qator ustma-ust, sonlar bir ustunda) → pufak «Bunga ishonsa bo'ladimi?»
  3. «Farq bor, lekin 82 ta brauzer hali kam — raqamni kuzatib boramiz.» → pufak o'rnida ✓, slayd burchagida yashil ✓; joriy qator (`QIzoh`): Halol gap — raqam qanday sanalganini va undan qancha xulosa qilsa bo'lishini ochiq aytish.
     qatorlar yonida yorliqlar paydo bo'ladi: **nimani sanadi** · **solishtirish** · **halol gap** (atamalar — misoldan keyin).
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi».
  Ipucha (40 s): Keyingi bo'lakni qo'shing — zal savoli qanday o'zgarishini ko'ring.
- Xulosa: Bu misolda raqam tushunarli bo'lishi uchun nimani sanagani, solishtirish va halol gap kerak bo'ldi. (99)
- Tugma (pastki): Bo'laklarni qo'shing (N/3) → Davom etish · `tugadi`: bo'lak tugmalari yopiladi, slayd butun enga.
- O'qituvchi eslatmasi: O'tgan modulda gapiradigan slaydda uch qator bor edi: raqam, u nimani sanadi, u nimani ko'rsatadi. A/B raqamiga solishtirish va halol gap qo'shiladi.
  Bu ekran — A/B bloki; bosh raqam bloki 10-ekranda qo'shiladi (ikki o'lchov aralashmaydi). Sonlar — 8-darsdagi A/B yakuni (B ishga tushgandan beri) (A taxminan 29 foiz, B taxminan 43 foiz); «82 ta brauzer» — Mentorning o'sha darsdagi gapi aynan. Sinfdan so'rang: 17 ni yolg'iz ko'rsak, B yaxshiroqmi?

## 7 · 3-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · raqam yonida
- Savol: **AvtoPizza pitchida «haftada 30 buyurtma». Yoniga nima qo'shasiz?** — (MD izohi: AvtoPizza — 7-Moduldagi bot loyihasi, tayanch 4; son mashq uchun.)
  - ✔ A — Nima sanalgani va o'tgan haftadagi soni
  - B — Botni qurishga ketgan haftalar soni
  - C — Shu raqamning kattaroq va yorqinroq shrifti
  - D — Pitsalarning to'liq menyusi va narxlari
- To'g'ri izohi: Raqam nimani sanagani va nima bilan solishtirilgani bilinadi.
- Xato izohlari: B — Bu mehnat raqami — u jarayonni ko'rsatadi. · C — Shrift raqamni ko'rsatadi, lekin tushuntirmaydi. ·
  D — Menyu yechim haqida — raqamga izoh bermaydi. · umumiy — Raqam nimani sanashi va nima bilan solishtirilgani kerak.

## 8 · Baholash varag'i  ← QTushuncha (saralash)
- Eyebrow: Tushuncha · fidbek
- Sarlavha: **Qaysi gap bilan pitchni tuzatsa bo'ladi?**
- Mentor: Sinfdosh «Maydon» pitchini tinglab, besh gap aytdi. Har gapni varaqdagi o'z slaydiga yoki «Yozilmaydi» qutisiga joylang.
- Bashorat (ballsiz, zinapoya): **Besh gapdan nechtasi varaqqa yoziladi?** · 1 · 2 · 3 — tanlov saqlanadi.
- Vizual: chapda varaq — besh qator (slayd nomi · zal savoli · bo'sh ✓/✗ katagi · bo'sh izoh qatori), sarlavhasiz; o'ngda «Maydon» besh slaydi kichik; varaq ostida «Yozilmaydi» qutisi (uzuq chiziqli joy, U-041); tepada 5 gap-karta, aralash tartibda.
- Gaplar (to'g'ri joyi — kodda `FIDBEK_GAPLAR`):
  1. «Muammo slaydida 4 / 5 va o'yinchining hikoyasi bor — nima bo'lganini tushundim.» — Muammo qatori, ✓
  2. «Yechim slaydida faqat React, NestJS va Neon aytildi — sayt o'yinchiga nima qilishi aytilmadi.» — Yechim qatori, ✗
  3. «Raqamlar slaydida A/B bor, lekin haftada nechta band bo'layotgani aytilmadi.» — Raqamlar qatori, ✗
  4. «Yaxshi pitch, hammasi yoqdi.» — Yozilmaydi
  5. «Bu pitch hech kimga qiziq emas.» — Yozilmaydi
- ✎ Gaplar bittadan (SABOQ 9, 13): bir vaqtda bitta gap katta karta bo'lib chiqadi; joy bosilgach varaq qatoriga yoki «Yozilmaydi» qutisiga uchib boradi, keyingisi chiqadi.
- **Harakat → Vizual o'zgarish:** gap-kartani bosib, joyni bosish (yoki sudrash) →
  - to'g'ri qatorga tushsa: qatorning katagida belgi chiqadi (1-gap — yashil ✓, 2 va 3 — `err` rangli ✗), gap izoh qatoriga ixcham bo'lib o'tiradi; o'ngdagi mos slayd bir lahza yonadi (✓ — yashil, ✗ — `err` chet);
  - «Yozilmaydi» qutisiga to'g'ri tushsa: karta kulrang bo'lib qutiga o'tiradi, ostida kichik yorliq: 4-gap — «qaysi slayd? nima yetishmadi?» · 5-gap — «odam haqida, slayd haqida emas».
  - Noto'g'ri joy → karta silkinib qaytadi, bitta `QXato`:
    - aniq gap «Yozilmaydi»ga: Bu gapda slayd ham, kamchilik ham bor — varaqqa yozing.
    - umumiy gap qatorga: Qaysi slayd? Nima yetishmadi? Bu gapda ikkalasi ham yo'q.
    - aniq gap boshqa qatorga: Gapda qaysi slayd aytilganini qayta o'qing.
- 5/5 da varaq tepasida sarlavha paydo bo'ladi: **Baholash varag'i**. Joriy qator (`QIzoh`): Har slayd uchun zal savoli yozilgan bu varaq baholash varag'i deyiladi.
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: 3».
- Xulosa: Fidbek — pitchdagi aniq joy haqidagi fikr yoki taklif. Slayd va kamchilik aytilsa, u qattiq, lekin hurmatli.
- Tugma (pastki): Gaplarni joylang (N/5) → Davom etish · `tugadi`: kartalar paneli yopiladi, varaq va slaydlar butun enga.
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xato bo'lsa) Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: «Qattiq» — kamchilik yashirilmaydi, ✗ qo'yiladi; «hurmatli» — gap slayd haqida, odam haqida emas. 1-gap ham foydali: ✓ ham sabab bilan aytiladi.
  3-gap «Maydon» pitchining haqiqiy kamchiligi: bosh raqamning hozirgi qiymati slaydda yo'q — 10-ekranda o'quvchi o'z raqamini Database'dan oladi (ko'prik, aytib bermang).

## 9 · Yakuniy savol  ← QTest (✔ C, `correctIdx 2`; ikki qoida birga — slayd va kamchilik)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Qaysi fidbek sinfdoshingizga pitchini tuzatishga yordam beradi?**
  - A — «Slaydlaringiz menga juda yoqdi, rahmat»
  - B — «Siz yaxshi gapira olmaysiz, afsus»
  - ✔ C — «Raqamlar slaydida nimani sanashi yo'q»
  - D — «Slaydlarni boshidan qayta yozib chiqing»
- To'g'ri izohi: Unda slayd va undagi kamchilik aniq aytilgan.
- Xato izohlari: A — Maqtov yoqimli, lekin qaysi slaydni tuzatish kerak? · B — Bu odam haqida — qaysi slaydda nima yetishmadi? ·
  D — Qaysi slaydda nima yetishmagani aytilmagan. · umumiy — Slayd va kamchilik aytilgan fidbekni toping.
- Izoh (MD): qo'shtirnoq to'rtala variantda (S-003); «slayd» so'zi uch variantda (A, C, D) — to'g'risi slayd nomini va kamchilikni aytgani bilan ajraladi, so'z bilan emas.

## 10 · Kod yozish: bosh raqam  ← QKod (Neon varianti — kod oynasi o'rnida Neon maketi; tayanch 9.1)
- Eyebrow: Kod yozish · Neon
- Sarlavha: **Bosh raqamni Database'dan sanaydigan SQL yozamiz.** — PM-082(a) sarlavha oilasi
- Mentor: Bosh raqamni avval ham shu SQL bilan sanagansiz — endi bugungi sonni olib, OKR'dagi «hozir» bilan solishtirasiz. Mentor misolida oy boshida 6 edi.
- Darvoza-mashq (ballsiz, SQL dan keyin — 1-dars SQL'ining takroriga yangi qadam; 05.10 GATE M M-q0): **OKR'da «hozir 6» edi, SQL bugun 11 ko'rsatdi. Slaydga nima yoziladi?** ·
  Haftada 11 band · ✔ Haftada 6 dan 11 ga · Haftada 5 ta ko'proq band
  - xato «11 band»: Zal o'sishni ko'rmaydi — boshlanish soni ham kerak. (belgisiz)
  - xato «5 ta ko'proq»: Farq bor, lekin zal qayerdan boshlanganini bilmaydi. (belgisiz)
- Chap (vazifa, 3 band; bosiladigan katakcha emas — qadam ro'yxati):
  1 Neon'da loyihangizni oching va SQL Editor'ga o'ting.
  2 Bo'sh joyni to'ldirib, SQL'ni o'zingiz yozing va «Run»ni bosing.
  3 Neon ko'rsatgan sonni pastdagi maydonga yozing.
- SQL (ekranda; nusxalash tugmasi yo'q — qo'lda yozganda o'rganiladi, korpus §19):
```sql
SELECT COUNT(*)
FROM bandlar
WHERE ______ >= NOW() - INTERVAL '7 days';
```
- Maydonlar (vazifa ostida): **OKR'dagi «hozir»: ___** (`pm-m8d1-okr` → `natijalar[0].hozir` dan o'zi to'ladi; «?» yoki yo'q bo'lsa — o'quvchi yozadi) · **Oxirgi 7 kunda: ___** — placeholder: `Neon ko'rsatgan son` ·
  tekshiruv (`QXato`, bloklaydi): son bo'lmasa — Neon ko'rsatgan sonni shu yerga yozing.
- Yordam: Jadvalingiz nomi boshqacha bo'lsa — bosh raqamingiz yoziladigan jadval nomini qo'ying. SQL Editor'da `\dt` yozsangiz, jadvallar ro'yxati chiqadi.
  Eslatma: bo'sh joyga band qilingan paytni saqlaydigan ustun — `yaratilgan` yoziladi. SQL darslaridan: `SELECT` — ma'lumotni ko'rsatadi · `WHERE` — qaysi qatorlar olinishi · `COUNT(*)` — qatorlarni sanaydi · `NOW() - INTERVAL '7 days'` — hozirdan 7 kun oldin.
  Database'dan bosh raqamni ola olmasangiz — uni o'ylab topmang: Raqamlar slaydiga sizda bor raqamni va u qayerdan olinganini yozing (dashboard va Umami boshqa narsani sanaydi — 11-FILTR 4).
- O'ng — Neon maketi (`NeonMaket`, chizilgan; logotip yo'q): tepada SQL Editor oynasi — SQL matni (bo'sh joy bilan), o'ng burchakda «Run» tugmasi; ostida jadval: ustun `count`, bitta katak — kulrang «?».
  Maket ostida (`QIzoh`): Sizning soningiz shu katakda chiqadi — u sizning Database'ingizdan.
  Ikkinchi qator (`QIzoh`, son yozilgach): Bu SQL o'yin kunini emas, band yozilgan vaqtni sanaydi. Sonda o'z tekshiruv bandlaringiz ham bo'lishi mumkin. (11-FILTR 5)
  Ostida — Sahnaning Raqamlar slaydi ixcham: bo'sh qator «Bosh raqam: haftada … dan … ga».
- **Harakat → Vizual o'zgarish:** o'quvchi SQL bo'sh joyini o'zi to'ldiradi (`yaratilgan` — takror; Yordam ortida eslatma) → maydonga son yozilganda maket katagidagi «?» o'rniga o'quvchining soni chiqadi → darvozada slayd qatori tanlanadi
  va ixcham Raqamlar slaydida «Bosh raqam» bloki yoziladi: «haftada A dan N ga» (A — OKR'dagi «hozir»; P-046 — o'quvchining haqiqiy soni).
- Tugma: **Bajardim — SQL ishladi, son yozildi** (qulf: son yozilmagan bo'lsa — «Avval Neon ko'rsatgan sonni yozing»; darvoza yechilmagan bo'lsa — «Avval slayd savolini yeching»). Bitta halol tugma, katakcha-ro'yxat yo'q (korpus §19).
- Hammasi bajarilgach (yashil): Bosh raqamingiz Database'dan olindi — u Raqamlar slaydiga yozildi.
- O'qituvchi eslatmasi: Laptopdagi va Render'dagi Backend bitta Neon Database'ga yozadi — o'quvchining o'z tekshiruv bandlari ham sanaladi (tayanch 9.11): «11 ta odam band qildi» emas —
  «oxirgi 7 kunda `bandlar` ga 11 ta band yozildi, ichida tekshiruvlarim ham bor». Mentor misolidagi 11 — kursdagi haqiqiy bosh raqam; o'quvchi SQL soni bilan aralashtirilmaydi.
  Telefon raqamlarini ekranga chiqarmang: `SELECT *` emas — faqat son (6-darsdagi qoida). `NOW()` Database vaqtida ishlaydi; 7 kunlik oraliq uchun Toshkent vaqti farqi sezilmaydi.
  Tez tugatganlar: `SELECT kun, soat FROM bandlar WHERE yaratilgan >= NOW() - INTERVAL '7 days';` — qatorlar orasida o'z tekshiruv bandlari bormi, ko'rsin (ism va telefon so'ralmaydi).
- Manba (o'quvchiga ko'rinmaydi): Neon rasmiy hujjati (05.10.2026 ochildi): «Select **Postgres database** > **SQL Editor** … Enter a query into the editor and click **Run**» — neon.com/docs/get-started/query-with-neon-sql-editor;
  `\dt` meta-buyrug'i SQL Editor'da qo'llanadi (o'sha sahifa). Repo `dars-11-done`: `band.entity.ts` — `kun` (`date`), `soat`, `ism`, `telefon`, `yaratilgan` (`timestamptz`, `CreateDateColumn`).

## 11 · Mustaqil ish  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Pitchingizni besh slaydga yozing.**
- Mentor: O'tgan moduldagi uch slaydingiz shu yerda — tekshirib, ikki yangi slaydni yozing. Har slaydni yozib, «Slaydga chiqarish»ni bosing.
- Kirish (P-046, M-q5; saqlangan narsa bo'lsa — o'zi qo'yiladi, tahrirlash mumkin; yo'q bo'lsa — bo'sh, o'quvchi o'zi yozadi):
  - `pm-m7d12-pitch` → Muammo (`raqam`, `muammoHikoya`), Yechim (`yechim`), Foydalanuvchi (`sinovHikoya`).
  - 10-ekrandagi son → Raqamlar «Bosh raqam» blokiga: «haftada A dan N ga» (A — OKR'dagi «hozir»).
  - `pm-m8d4-gipoteza` → Raqamlar «A/B» bloki yonida kulrang qator: «Gipotezangiz: Agar {agar}, {ozgaradi}.»
  - `pm-m8d1-okr` → Keyingi qadam yonida kulrang qator: «OKR'ingiz: {maqsad} · {1-qator nima}: hozir {hozir} → oy oxirida {oyOxirida}».
  - `pm-m8d10-yol` → Keyingi qadam maydoniga `keyin` (`keyinModul` — 10-darsda saqlanadi, bu darsda ishlatilmaydi; 10-FILTR 4).
- Bitta ustun: Sahna (besh slayd; joriy slayd accent) → forma (har bosqichda bitta blok) → Yordam · «Slaydga chiqarish» o'ngda (187).
- Bosqich chiplari 1–5 (joriysi accent, yozilgani ✓) va maydonlar (placeholder qisqa, tayyor javobsiz — §32):
  1. Muammo — «Raqam»: Necha kishidan nechtasi shu muammoni aytdi? · «Hikoya»: Kim edi, nima qilmoqchi edi, nima bo'ldi?
  2. Yechim — Saytingiz shu muammoni qanday hal qiladi?
  3. Foydalanuvchi — Sinovda odam nimaga qoqildi, siz nimani tuzatdingiz?
  4. Raqamlar — «Bosh raqam»: Nima sanaldi, qanchadan qanchaga? · «A/B» (bo'lmasa — bo'sh qoladi): A va B sonlari, nimani sanaydi? · «Halol gap»: Qanday sanaldi, xulosaga yetadimi?
  5. Keyingi qadam — Keyingi oyda nima qilasiz va qaysi raqam o'sadi?
- Tekshiruv (`QXato`, ≤60; javob forma ostida, yozilgan zahoti — 106d):
  - 4 «Bosh raqam»da son yo'q (bloklaydi): Bosh raqamga bor soningizni va manbasini yozing.
  - 4 «Halol gap» bo'sh (bloklaydi): Raqam qanday sanaldi va xulosaga yetadimi — yozing.
  - 1 va 3 da «hamma», «ko'pchilik», «har kim» (yo'naltiradi): Hikoya bitta odam haqida — u kim edi?
  - 2 da texnologiya nomlari — «React», «NestJS», «Node», «Neon», «PostgreSQL», «Render», «Netlify» (yo'naltiradi, bloklamaydi): Bu texnologiya — sayt odamga nima qilib beradi?
  - 5 da son yo'q (yo'naltiradi): Qaysi raqam o'sadi — sonini ham yozing.
  - o'tgan slayd (106d-a): Sahnada yashil ✓ oladi — alohida maqtov-matni yo'q.
- Doimiy qator (forma ostida): Yo'q raqamni o'ylab topmaysiz — bor raqamga izoh berasiz.
- Yordam: A/B testingiz bo'lmasa — «A/B» blokini bo'sh qoldiring; bosh raqamda solishtirish — OKR'dagi «hozir». Keyingi qadamni yillik yo'lingizdan oling — uni o'tgan darsda yozgansiz.
- **Harakat → Vizual o'zgarish:** slaydni yozib «Slaydga chiqarish» → qatorlar o'z slaydiga kiradi, joriy belgi keyingi slaydga o'tadi; tekshiruvdan o'tgani yashil ✓, o'tmagani `err` fon va ostida bitta `QXato`;
  zal pufagi slayd bo'yicha o'zgaradi (`ZAL_SAVOL`) va 5/5 da ✓. 5/5 da forma yopiladi, Sahna butun enga (DE-199), har slaydda ✎ (tahrirlash).
- Xulosa: Pitchingizning besh slaydi tayyor: muammodan keyingi qadamgacha.
- Tugma (pastki): Besh slaydni yozing (N/5) → Davom etish
- Artefakt-strip (U-042): shu ekrandan — «Pitchim» (ixcham, holat «3/5»); 12, 13, 15, 16-ekranlarda ko'rinadi, test, arena va podiumda yo'q.
- O'qituvchi eslatmasi (`MentorNote`): A/B sonlarini 8-darsdagi SQL sonlaridan oling. Raqamlar slaydida o'z tekshiruv bandlari ham bor bo'lsa — halol gapda aytilsin.
  Jonli darsda bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 12 · Repetitsiya  ← QMustaqil (2 qadam)
- Eyebrow: Mashq · sinfdosh oldida
- Sarlavha: **Pitchingizni 5 daqiqada aytib bera olasizmi?**
- Mentor (juftlikda): Avval sinfdoshingizga 5 daqiqada ayting. Keyin qurilmangizni unga bering — u baholash varag'ini to'ldiradi.
  | (mustaqil): Avval ovoz chiqarib 5 daqiqada ayting. Keyin baholash varag'ini o'zingiz to'ldiring.
- Qadamlar 1/2: 1 Pitchni ayting · 2 Baholash varag'i
  - Taymer (har o'quvchi o'z navbatida, o'z qurilmasida): 5 daqiqani boshlash · Hozir siz gapirasiz · To'xtatish · Qaytadan. 5:00 dan keyin taymer to'xtamaydi — qizil «+m:ss».
    Juftlik yo'rig'i (bir qator): Avval A gapiradi, B tinglaydi; keyin almashasiz.
  - Varaq: besh qator — slayd nomi · zal savoli · ✓ / ✗ · izoh qatori (placeholder: `Nima yetishmadi?`); pastda «Vaqt: m:ss» — taymerdan o'zi yoziladi.
- Tekshiruv (`QXato`, ≤60):
  - belgisiz qator (bloklaydi): Har slaydga ✓ yoki ✗ qo'ying.
  - ✗ qatorida izoh 8 belgidan qisqa (bloklaydi): ✗ qo'ydingiz — nima yetishmaganini bir qatorda yozing.
  - beshta ✓ (yo'naltiradi): Hammasi ✓ — eng zaif slaydni bir qatorda yozing.
  - izohda «yomon», «zerikarli», «yoqmadi» (yo'naltiradi): Odam haqida emas — slaydda nima yetishmadi?
- Vizual: Sahna — 11-ekranda yozilgan besh slayd (ochiq), taymer chizig'i besh bo'lakli; taymer yurganda joriy daqiqaning slaydi accent, zal pufagi o'sha slayd ustida.
  11-ekran yozilmagan bo'lsa (mentor rejimi) — «Maydon» pitchi.
- **Harakat → Vizual o'zgarish:** taymer → har daqiqada keyingi slayd accent bo'ladi; 5:00 dan oshsa chiziq qizil davom etadi. Varaq to'ldirilganda ✓ slaydlar yashil ✓, ✗ slaydlar `err` chet oladi;
  «Vaqt» qatori taymer ko'rsatgan vaqtni yozadi (5:00 dan oshsa — qizil).
- Xulosa (varaq to'lgach): Baholash varag'i to'ldi: qaysi slaydni tuzatish kerakligi endi ko'rinib turibdi.
- Tugmalar: Orqaga · Davom etish (varaq to'lgach)
- O'qituvchi eslatmasi (`MentorNote`): Tinglovchi slayd haqida yozadi, odam haqida emas. ✗ qo'yish — yordam: «hammasi yaxshi» pitchni tuzatmaydi. 5 daqiqadan oshgan pitchni to'xtatmang — vaqt varaqqa yoziladi.
  Pitch shu ko'rinishda keyingi modulda zalga chiqadi (Demo Day 7) — o'quvchiga va'da qilib aytilmaydi (T-038).
  Taymerni sinf bo'ylab bir vaqtda boshlating: avval hamma A gapiradi, keyin hamma B — 18 daqiqaga shunday sig'adi.
- Nishon: Five Minutes (taymer to'xtatilgach va varaq to'lgach).

## 13 · Tuzatish  ← QMustaqil
- Eyebrow: Mashq · tuzatish
- Sarlavha: **Fidbekdan keyin qaysi slaydni tuzatasiz?**
- Mentor: ✗ qo'yilgan slaydni tanlang va varaqdagi izohga qarab qayta yozing.
- Vizual: chapda varaq (ixcham; ✗ qatorlar accent); o'ngda Sahna — besh slayd, ✗ slaydlar `err` chetli. Beshta ✓ bo'lsa — 12-ekranda «eng zaif» deb yozilgan slayd tanlangan holda ochiladi.
- Bitta ustun ostida forma: tanlangan slaydning maydonlari (11-ekrandagi matn bilan, tahrirlash) · «Slaydga chiqarish» o'ngda.
- Vaqt qatori (`QIzoh`, faqat «Vaqt» 5:00 dan oshgan bo'lsa): Vaqt 5 daqiqadan oshdi — har slayddan bitta ortiqcha gapni oling.
- Tekshiruv (`QXato`): matn o'zgarmagan (bloklaydi): Matn o'zgarmadi — varaqdagi izohni qayta o'qing.
- **Harakat → Vizual o'zgarish:** slaydni bosish → forma ochiladi → matnni o'zgartirib «Slaydga chiqarish» → slayd `err` chetdan yashil ✓ holatiga o'tadi, ustida yorliq «tuzatildi»; varaq qatorida ✗ yonida «tuzatildi».
  Kamida bitta slayd tuzatilgach «Davom etish» ochiladi; qolgan ✗ slaydlar ham tuzatilishi mumkin (bloklamaydi).
- Xulosa: Pitchingizning eng zaif slaydi tuzatildi. Qolgan ✗ slaydlarni uyda tuzatasiz.
- Tugma (pastki): Bitta slaydni tuzating → Davom etish
- Saqlanadi: `pm-m8d11-pitch` (TAYANCHGA SAVOL 6).
- O'qituvchi eslatmasi: Vaqt bo'lsa — tuzatilgan slaydni sinfdoshga yana bir marta (1 daqiqa) ayttiring: endi zal savoliga javob bo'ldimi?
- Nishon: Pitch Fixed (birinchi tuzatilgan slaydda).

## 14 · Podium  ← QNatija
- Jonli reyting — qolip standarti.
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Raqamlar yoki keyingi qadam · 2 — Airbnb tartibi · 3 — Raqam yonida nima · 4 — Qaysi fidbek yordam beradi

## 15 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**
- ✎ Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| 5 daqiqalik pitchda qaysi besh slayd bor? | Muammo, yechim, foydalanuvchi, raqamlar va keyingi qadam |
| Har slayd nimaga javob beradi? | Zalning bitta savoliga |
| Raqamlar slaydi zalning qaysi savoliga javob beradi? | «Sayt ishga tushgach nima bo'ldi?» |
| «Keyingi oyda haftada 20 band» qaysi slaydga chiqadi? | Keyingi qadam slaydiga: bu son hali bo'lmagan |
| Raqam tushunarli bo'lishi uchun yonida nima turadi? | Nimani sanagani, nima bilan solishtirilgani va halol gap |
| «Maydon» A/B testida B tugmasi bilan nechta brauzer band qildi? | Vaqtni tanlagan 40 brauzerdan 17 tasi; A bilan — 42 tadan 12 |
| Halol gap nimani aytadi? | Raqam qanday sanalganini va undan qancha xulosa qilsa bo'lishini |
| Airbnb'ning birinchi taqdimoti qaysi slayddan boshlangan? | Muammodan: muammo, yechim, bozor, mahsulot, jamoa |
| Fidbek nima? | Tinglovchining pitchdagi aniq joy haqidagi fikri yoki taklifi |
| Qattiq, lekin hurmatli fidbekda nima aytiladi? | Qaysi slayd va unda nima yetishmagani; odam haqida gap yo'q |
| Baholash varag'ida nima yozilgan? | Har slayd uchun zalning bitta savoli — ✓ yoki ✗ |
| Bosh raqamni pitch uchun qayerdan olasiz? | O'z Database'ingizdan — masalan Neon'dagi SQL Editor'da |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi atama darsda bor (besh slayd, zal savoli — 2 · halol gap — 6 · Airbnb, bozor, jamoa — 4 · fidbek, baholash varag'i, qattiq/hurmatli — 8 · SQL Editor — 10).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol).

## 16 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Pitch besh daqiqalik bo'ldi, eng zaif slayd tuzatildi.**
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Har slayd zalning bitta savoliga javob beradi; fidbek qaysi javob yetmaganini ko'rsatadi.
- Endi siz bilasiz (bugungi asosiy fikr yuqorida — bu yerda takrorlanmaydi, T-048):
  - 5 daqiqalik pitch besh slayddan iborat: muammo, yechim, foydalanuvchi, raqamlar va keyingi qadam.
  - Raqamlar slaydida bosh raqam va A/B alohida turadi; har birida nimani sanagani va halol gap bor.
  - Bosh raqamni o'ylab topmaysiz — o'z Database'ingizdan olasiz.
  - Qattiq, lekin hurmatli fidbek slaydni va undagi kamchilikni aytadi.
- Uyga vazifa (karta, P-025): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: oila a'zosi yoki do'stingiz · Nechta: 1 repetitsiya · Muddat: zaxira darsgacha
  - ① Tuzatilgan pitchni bir kishiga 5 daqiqada, taymer bilan ayting.
  - ② Undan baholash varag'idagi besh savolni so'rang va qolgan ✗ slaydlarni tuzating.
  - ③ Raqamlar slaydidagi sonni Database'dan yana bir marta oling va yangilang.
  - Karta ostida (bitta kulrang qator): Tinglovchi topilmasa — pitchni telefonga yozib oling va varaqni o'zingiz to'ldiring.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Zaxira dars»: ortda qolgan ishni yetkazasiz va pitchni sayqallaysiz.
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Bugungi asosiy fikr» faqat ScoreRing ostida (P-013); «Endi siz bilasiz» va kartochkalarda yo'q.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Feedback Sorter!** (8-ekran, birinchi urinishda xatosiz) — Besh gapdan varaqqa yoziladiganlarini ajratdingiz
- **Real Number!** (10-ekran, «Bajardim») — Bosh raqamingizni Database'dan oldingiz
- **Five Minutes!** (12-ekran, taymer va varaq) — Pitchingizni 5 daqiqada aytdingiz va baholatdingiz
- **Pitch Fixed!** (13-ekran, birinchi tuzatilgan slayd) — Fidbekdan keyin slaydni qayta yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034); 2, 6-ekranlar (qadamli tushuncha) va 11-ekran nishonsiz.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Raqamlar yoki keyingi qadam** — 1 Raqamlar slaydida sayt ishga tushgach sanalgan raqam turadi. · 2 Keyingi qadam slaydida keyingi oyda o'sadigan raqam turadi. ·
  3 Hali bo'lmagan son keyingi qadamga chiqadi. — Sinfga savol: 3-ekran savoli
- **5 · Airbnb tartibi** — 1 Airbnb taqdimotida o'nga yaqin oddiy slayd bo'lgan. · 2 Tartib: muammo, yechim, bozor, mahsulot, jamoa. · 3 Bizning pitchda ham avval muammo, keyin yechim. — Sinfga savol: 5-ekran savoli
- **7 · Raqam yonida nima** — 1 Raqam nimani sanashi aytiladi. · 2 U nima bilan solishtirilgani aytiladi. · 3 Qanday sanalgani va xulosa chegarasi halol aytiladi. — Sinfga savol: 7-ekran savoli
- **9 · Qaysi fidbek yordam beradi** — 1 Fidbek qaysi slayd haqida ekanini aytadi. · 2 Unda nima yetishmaganini aytadi. · 3 «Hammasi yoqdi» va odam haqidagi gap pitchni tuzatmaydi. — Sinfga savol: 9-ekran savoli

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. 5 daqiqalik pitchda birinchi qaysi slayd turadi? (2, 4)
   - ✔ A — Muammo slaydi
   - B — Raqamlar slaydi
   - C — Yechim slaydi
   - D — Foydalanuvchi slaydi
2. Zal «Endi nima qilasiz?» deb so'radi. Qaysi slayd javob beradi? (2)
   - A — Foydalanuvchi slaydi
   - ✔ B — Keyingi qadam slaydi
   - C — Raqamlar slaydi
   - D — Muammo slaydi
3. «B — 40 tadan 17» da 40 nimani sanaydi? (6)
   - A — Saytni ochgan hamma brauzerlarni
   - B — Oxirida band qilgan brauzerlarni
   - ✔ C — Vaqtni tanlagan brauzerlarni
   - D — Sayt ishlagan kunlar sonini
4. Pitchdagi bosh raqam qayerdan olinadi? (10)
   - A — Sinfdoshlar aytgan taxminiy sondan
   - B — Esda qolgan o'tgan haftalik sondan
   - C — Boshqa loyihadagi o'xshash raqamdan
   - ✔ D — O'z Database'ingizdagi jadvaldan
5. «82 ta brauzer hali kam» degan gap nimani aytadi? (6)
   - ✔ A — Xulosaga brauzer kamligini
   - B — Backend sekin ishlayotganini
   - C — Reklamaga kam pul ketganini
   - D — B varianti yomon chiqqanini
6. Airbnb'ning birinchi taqdimotidagi slaydlar qanday bo'lgan? (4)
   - A — Uzun matnli, rasmsiz sahifalar
   - ✔ B — Oddiy va o'nga yaqin
   - C — Asosan raqam va jadvallar
   - D — Har biri bir sahifa matn
7. Airbnb taqdimotida slaydlar qaysi tartibda kelgan? (4)
   - A — Jamoa, mahsulot, bozor, yechim, muammo
   - B — Bozor, jamoa, muammo, mahsulot, yechim
   - ✔ C — Muammo, yechim, bozor, mahsulot, jamoa
   - D — Mahsulot, muammo, jamoa, yechim, bozor
8. Qaysi fidbek qattiq, lekin hurmatli? (8)
   - A — «Muammo slaydi yaxshi, hammasi yoqdi»
   - B — «Raqamlarni aytganda siz qo'rqdingiz»
   - C — «Keyingi qadam slaydi umuman kerak emas»
   - ✔ D — «Yechimda sayt nima qilishi aytilmadi»
9. Baholash varag'ida har slayd uchun nima yozilgan? (8)
   - ✔ A — Zalning bitta savoli
   - B — Slaydning rangi va shrifti
   - C — Gapiruvchining to'liq ismi
   - D — Slayddagi so'zlar soni
10. Sinfdosh Yechim slaydiga ✗ qo'ydi. Keyin nima qilasiz? (13)
    - A — Yechim slaydini butunlay olib tashlaysiz
    - ✔ B — Yechim slaydini izohga qarab yozasiz
    - C — Yechimdagi ✗ belgisini o'chirib qo'yasiz
    - D — Yechim uchun sinfdoshdan ✓ so'raysiz
11. Yechim slaydiga nima yoziladi? (8, 11)
    - A — Saytdagi texnologiyalar ro'yxati
    - B — Saytga ketgan haftalar soni
    - ✔ C — Sayt muammoni qanday hal qilishi
    - D — A/B testidagi ikki variant foizi
12. Pitch 5 daqiqadan oshib ketdi. Nima qilasiz? (12, 13)
    - A — Oxirgi slaydlarni tezroq gapirib berasiz
    - B — Bitta slaydni butunlay olib tashlaysiz
    - C — Taymerni o'chirib, vaqtni sanamaysiz
    - ✔ D — Har slayddan ortiqcha gapni olasiz

- Arena yozuvlari — umumiy shablon (9-Modul 12-dars bilan bir xil).
- **Fon so'zlari** (R-008, {uz, ru}): arena — pitch · slayd · zal · raqam · fidbek · repetitsiya · muammo · yechim · varaq · daqiqa · uyga vazifa banneri — pitch · slayd · zal · daqiqa (faqat so'z, emojisiz).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/8-Modull/PmPitchRehearsalLesson.jsx`; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m8d11-pitch-v1` · «Besh daqiqada nimani ko'rsatasiz?».
2. Ekran turlari: s0 `QKirish` · s1 `QReja` · s2/s6/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s9 `QTest` (darsning `QuestionScreen` mantig'i, DE-203) · s4 `QVoqea` ·
   s10 `QKod` (Neon varianti: o'ngda `HtmlCompiler` o'rnida `NeonMaket`) · s11/s12/s13 `QMustaqil` · s14 `QNatija` (podium) · s15 `QKartochka` · s16 `QYakun`.
3. **`PitchSahna` — 9-Modul 12-dars komponentining davomi** (bitta vizual, 180-qonun): 1–5 slaydli tasma (qator holatlari + «tuzatildi») · taymer chizig'i (besh bo'lak, joriy bo'lak, 5:00 dan keyin qizil davom) ·
   zal (4 siluet, `ZAL_SAVOL` pufagi / ✓) · `BaholashVaragi` qatlami (5 qator + «Vaqt»). 9-Modul darsi hali qurilmagan bo'lsa — shu darsda yoziladi, umumiy qolipga ko'chirish K-020 tartibida (shubhada — dars ichida nusxa).
   4-ekranda slayd tasmasi Airbnb holatida (zal va taymersiz, «Airbnb» nom-yorlig'i). `reduced-motion`; telefonda (393) varaq slaydlar ostida.
4. `MAYDON_PITCH` — bitta manba (180-qonun): besh slayd qatorlari (A-6 aynan) · `ZAL_SAVOL` (5) · `BOSH` { nima: 'haftada band', oldin: 6, hozir: 11, maqsad: 20 } · `AB` { A: { tanladi: 42, band: 12 }, B: { tanladi: 40, band: 17 }, gap } · `KEYINGI` (OKR maqsadi + 20). s0, s2, s6, s8, s12 (mentor rejimi) shundan o'qiydi.
5. s2 — `QBashorat` (1/2/3 daqiqa) → `QQadamlar` (3) → slayd 4, 5 qo'shiladi, taymer chizig'i bo'linadi, pufak slaydlar ustidan o'tadi; `QTaxmin`; 40 s ipucha.
6. s4 — `K_AIRBNB` 4 bosqich (bank matni); slayd tasmasi holatlari (bo'sh → «?» → nomlar → «Muammo» accent); bashorat 3 variant; `.ksc-brand` «Airbnb» (rang — TAYANCHGA SAVOL 9).
7. s6 — bitta slayd, `QBashorat` (1/2/3), 3 bo'lak, pufak holatlari, 3/3 da yorliqlar (nimani sanadi · solishtirish · halol gap).
8. s8 — `FIDBEK_GAPLAR` (5: `matn`, `joy: 'muammo' | 'yechim' | 'raqamlar' | 'yozilmaydi'`, `belgi: '✓' | '✗' | null`, `yorliq`) + varaq qatlami; bosish yoki sudrash; bashorat; 5/5 da varaq sarlavhasi; nishon — birinchi urinish.
9. s10 — `NeonMaket` (yangi, chizilgan: SQL oynasi + «Run» + natija jadvali `count`); `GATE_ITEMS` (`kun`/`soat`/`yaratilgan`); son maydoni (`/^\d+$/`); «Bajardim» qulfi; son → s11 Raqamlar 1-maydoniga.
   SQL bajarilmaydi va tekshirilmaydi (dars Neon'ga ulanmaydi) — signal: darvoza + o'quvchi yozgan son.
10. s11 — 5 bosqichli forma; o'qiydi `pm-m7d12-pitch`, `pm-m8d1-okr`, `pm-m8d4-gipoteza`, `pm-m8d10-yol` (yo'q bo'lsa bo'sh maydon, M-q5); tekshiruv funksiyasi (son bormi · halol gap bo'shmi · «hamma|ko'pchilik|har kim» ·
    texnologiya nomlari · 5-bosqichda son) — PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi; artefakt-strip «Pitchim» (U-042).
11. s12 — `PitchTaymer` (5 daqiqa, to'xtamaydi, «+m:ss»; har daqiqada joriy slayd); varaq formasi (5 × ✓/✗ + izoh ≥8 belgi; «hammasi ✓» va baho so'zlari — yo'naltiradi); juftlik / mustaqil matnlari; ▶ ⏹ belgilari yo'q.
12. s13 — ✗ (yoki «eng zaif») slaydni tanlash → forma (eski matn) → o'zgarish tekshiruvi → «tuzatildi»; vaqt > 5:00 bo'lsa `QIzoh`; `LS` `pm-m8d11-pitch` (TAYANCHGA SAVOL 6).
13. Jonli ball: `INLINE_KEYS` = { s3: 1, s5: 3, s7: 0, s9: 2, beshSlayd: -1, raqamlar: -1, fidbek: -1, neon: -1, practice: -1, repetitsiya: -1, tuzatish: -1 }; `RECAPS` 3/5/7/9; `Q_LABELS`;
    `QUIZ_BANK` 12 (✔ 0/1/2/3 har biri 3 marta) + `set_quiz_keys`; `SCREEN_META` == screens; `SCREEN_INTENTS`.
14. `ACHIEVEMENTS` 4 · `FLASHCARDS` 12 · `RECAP` 4 · `HW_TOKENS` · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
15. Uyga vazifa — yakun kartasida (`HwCard` mazmuni shu MD dan; alohida `.homework.jsx` yo'q — tayanch 4).
16. App.jsx `m8-11` qatoriga `comp: PmPitchRehearsalLesson` ulash (nom va osti o'zgarmaydi — DE-205 ✓). App.jsx ga bu bosqichda tegilmaydi.
17. **REPO — yo'q** (PM darsi; `maydon` repo'ga tegilmaydi).
- Darvozalar: `npm run gates -- src/8-Modull/PmPitchRehearsalLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

---

## TAYANCHGA SAVOL
1. ✅ **(05.10 asosiy seans: tayanch 1 — haftada 11 band, 6 dan; maqsad 20 ga yetmadi)** **«Maydon» bosh raqamining hozirgi qiymati** — 11. Mentor pitchining birinchi qoralamasida bosh raqam bloki yo'q (8-ekran 3-gap fidbek),
   tuzatilgan holatda «Bosh raqam: haftada 6 dan 11 ga (maqsad — 20)» (A-6; 11-FILTR 1).
2. ✅ **(11-FILTR 6)** **Vaqt taqsimoti — har slaydga taxminan 1 daqiqa** — mashq uchun boshlang'ich taqsimot, «haqiqat» emas: natija qatori «bu mashqda», `QIzoh` «bir slayd qisqaroq, boshqasi uzunroq bo'lishi mumkin; jami 5 daqiqa».
3. **Slayd nomlari.** Qaror 13: «muammo → yechim → foydalanuvchi hikoyasi → raqamlar → keyingi qadam». Uchinchi slayd nomini 9-Moduldagidek **Foydalanuvchi** qoldirdim (ichida hikoya). «Keyingi qadam» — 10-dars osti yozuvidagi so'z bilan bir xil.
4. **«baholash varag'i» ta'rifi.** Tayanch: «pitchni baholash bandlari». «Band» bu modulda band qilish (T-015; 08 MD ham shunday qoida qo'ygan) — varaqdagi narsani «savol» dedim (MATN_ETALONI lug'ati: baholash-mexanikada «mezon» → «savol»).
   Varaq savollari = slaydlarning zal savollari (`ZAL_SAVOL`); birinchi uchtasi 9-Modul 12-dars aynan.
5. **«fidbek» atamasi.** Menyu osti yozuvida bor («qattiq fidbek»), tayanch 2-bo'limda yo'q. Ta'rif: «tinglovchining pitch haqidagi fikri»; «qattiq, lekin hurmatli» — qaysi slayd va unda nima yetishmagani aniq aytiladi, odam haqida gap yo'q (o'zim aniqladim). Tayanchga qo'shish kerakmi?
6. ✅ **(11-FILTR: tayanch 8 ga qo'shildi)** **Kalit `pm-m8d11-pitch`**: `{ slaydlar: { muammo: { raqam, hikoya }, yechim, foydalanuvchi, raqamlar: { bosh: { nima, oldin, hozir }, ab: { a, b }, halolGap }, keyingi }, vaqt, varaq: [{ slayd, belgi, izoh }], tuzatildi: [slayd], savedAt }`
   (11-FILTR 2: bosh raqam va A/B alohida — keyingi modulga aralashmasdan o'tadi).
   Keyingi modul (Demo Day 7) o'qishi mumkin.
7. **SQL mexanikasi modul ichida.** Agar `m8-01` kod ekrani GATE M da Neon SQL bo'lsa (bosh raqamni `bandlar` dan sanash) — 11-dars bilan mexanika o'xshaydi (ketma-ket emas: `m8-01` → `m8-04` → `m8-06` → `m8-10` → `m8-11`).
   Farq: bu yerda ustun tanlash (`yaratilgan`) va 7 kunlik oraliq. `INTERVAL` yozuvi 8-dars SQL bilan bir xil bo'lsin (08 MD — davr `variant IS NOT NULL`, oraliq yo'q).
8. ✅ **(05.10: tayanch 1 — jamoa yig'ish, 10-dars bilan bir xil)** **«Maydon» keyingi qadami** — «Jamoa yig'ish … Keyingi oyda: haftada band qilingan vaqtlar 20 ga yetsin (hozir 11)» (A-6).
9. ✅ **(SABOQ 2 — 9-Modul pilot qoidasi)** **Airbnb rangi** (`.ksc-brand`, #FF5A5F) — nom o'z rangida, majburiy; logotip qo'yilmaydi.
10. **Qurilmani almashtirish (12-ekran).** Juftlikda tinglovchi varaqni gapiruvchining qurilmasida to'ldiradi. Jonli tizim (o'quvchi = qurilma) uchun mosmi yoki tinglovchi o'z qurilmasida to'ldirib, ovoz chiqarib o'qib berishi kerakmi?
11. **Kod jadvali va tayanch 9.1.** `PM_Prompt_v8.md` KODING jadvalida pitch mavzusi uchun — interfeys blokini yasash; tayanch 9.1 va topshiriq — Neon SQL. Tayanchga amal qildim.
12. **Uyga vazifa muddati «zaxira darsgacha».** Zaxira dars qurilmaydi; real tinglovchi natijasi qayerda ko'riladi — keyingi modul boshidami?
13. ✅ **AvtoPizza (7-ekran)** — 7-Modul bot loyihasi (05.10 tayanch 4 tuzatildi). O'quvchi uni «bot» bilan eslaydi — «Botni qurishga ketgan haftalar» varianti shunga tayanadi; saytda buyurtma bo'lgani ham tayanch 4 da (sayt + Backend + bot + mobil).

## Shubhali joylar (ishonchim komil emas)
- **17 ekran** — namunadan (9-Modul 12-dars, 16) bitta ko'p: 13-ekran (tuzatish) — dastur natijasi «Pitch tuzatilgan». Vaqt ≈ 90 daqiqaga zich sig'adi; jonli darsda 2 va 6-ekranni tezroq o'tish mumkin.
- **8-ekran zichligi** — uch narsa bir ekranda (fidbek, baholash varag'i, qattiq/hurmatli). Ajratish uchun: QIzoh — varaq, xulosa — fidbek. Og'ir bo'lsa, «qattiq, lekin hurmatli» 12-ekran Mentoriga ko'chadi.
- **Neon menyu yo'li.** Rasmiy hujjatda «Postgres database > SQL Editor» (05.10); 9-Modul 9-dars va 10-Modul 2, 8-darslarda — faqat «Neon'dagi SQL Editor». Men ham shunday yozdim. `\dt` — hujjat bo'yicha SQL Editor'da ishlaydi, o'zim sinamadim.
- **Darvoza `kun` / `yaratilgan`.** «Haftada band qilingan vaqtlar» — bandni qilish vaqti (`yaratilgan`) deb oldim (uch qadam hodisalari ham harakat vaqti bilan sanaladi). O'yin kuni bo'yicha sanash ham himoyalansa bo'ladi — 1-dars bilan kelishish kerak.
- **Airbnb bashorati** «Muammo slaydi tartibda qayerda turgan?» — «boshida»: bank tartibi muammodan boshlanadi; haqiqiy taqdimotda oldin sarlavha slaydi bor (shuning uchun «birinchi» emas, «boshida»).
  «o'nga yaqin» — bank so'zi; ochiq manbalarda 10 yoki 14 slayd deyiladi. Arena 6 «o'nga yaqin slayd» — bank matni, yangi raqam emas deb oldim.
- **«82 ta brauzer»** — Mentor gapi aynan (tayanch 1, 08 MD); slaydning 1-qatorida birlik — brauzer. Bitta slaydda «brauzer» va «kishi» yonma-yon (08 MD ham shunday).
- ✅ (05.10: «Keyingi oyda … (hozir 11)» ga o'zgardi) **2-ekran Keyingi qadam qatori** «Oy oxiriga: haftada band qilingan vaqtlar 20 ga yetsin» — OKR 1-darsda «keyingi oy» uchun yozilgan; 11-darsga kelib o'sha oy tugayotgan bo'lishi mumkin. Mentor misolida vaqt chegarasi aytilmadi.
- **Hook javobi «Aynan!»** raqamlarni ochadi (qoida — tayanch 7.7); «Yana bitta savol ochiq» qatori Keyingi qadam slaydini 2-ekranga qoldiradi (11-FILTR hook).
- **3-ekran xato izohi C** («Muammo slaydidagi raqam muammo nechta odamda chiqqanini aytadi») — mini-do'kon uchun intervyu bo'lmagan bo'lishi mumkin; umumiy qoida sifatida yozildi.
- **11-ekran texnologiya detektori** «Neon», «Render» — to'g'ri yechim gapida ham chiqishi mumkin («saytni Netlify'da ochdim») — shuning uchun faqat yo'naltiradi.
- **12-ekran baho so'zlari detektori** («zerikarli») — slayd haqidagi to'g'ri izohda ham bo'lishi mumkin («raqamlar slaydi zerikarli o'qildi») — faqat yo'naltiradi.
- **Arena 12** «har slayddan ortiqcha gapni olasiz» — 13-ekran `QIzoh` qatoriga tayanadi; u faqat vaqt oshganda ko'rinadi. Kartochkalarda yo'q.
- **Uyga vazifa ②** — tinglovchi oila a'zosi; «baholash varag'idagi besh savol» ni u bilmaydi — o'quvchi savollarni o'qib beradi deb oldim.
- Modul raqamlari O'qituvchi eslatmalari va A-bo'limda topshiriq va 9-Modul MD laridagidek (LMS raqami); o'quvchi matnida modul raqami yo'q («o'tgan modulda»).

---

## O'lchov (python bilan sanaldi, 05.10.2026)
| Nima | Son (belgi) | Chegara |
|---|---|---|
| Sarlavhalar: 0 · 1 · 2 · 4 · 6 · 8 · 10 · 11 · 12 · 13 · 16 | 33 · 53 · 42 · 48 · 37 · 40 · 49 · 33 · 44 · 40 · 54 | ≤55 |
| Xulosalar: 2 · 4 · 6 · 8 · 10 · 11 · 12 · 13 | 85 · 74 · 99 · 108 · 66 · 64 · 80 · 77 | ≤110 |
| Bugungi asosiy fikr | 89 | ≤110 |
| Hook javoblari («Aynan!» · «Qiziq fikr!» ×2) | 102 · 104 · 88 | ≤120 |
| Hook variantlari | 39 · 38 · 39 | teng |
| Xato izohlari (testlar, 8, 10, 11, 12, 13-ekran) | 29–57 | ≤60 |
| 3-ekran variantlari (✔ B) | 35 · **37** · 38 · 38 | to'g'ri eng uzun emas |
| 5-ekran variantlari (✔ D) | 46 · 44 · 45 · **41** | 〃 |
| 7-ekran variantlari (✔ A) | **39** · 35 · 43 · 39 | 〃 |
| 9-ekran variantlari (✔ C) | 40 · 35 · **39** · 41 | 〃 |
| Test savollari (so'z) | 9 · 7 · 8 · 7 | ≤12 |
| Arena savollari (so'z) | 4–10; to'g'ri variant hech birida yolg'iz eng uzun emas | ≤12 |

---

## Qurilish (06.10.2026, F-1005-188) — kodda MD dan farqlar (ertalab ko'rikda tasdiqlanadi)
- Bitta vizual `PitchSahna`: slayd tasmasi · taymer chizig'i · zal (4 siluet, savol pufagi) · baholash varag'i. Airbnb — tanish taqdimot oynasi, nom #FF5A5F, logotipsiz.
- Joylashuv (SABOQ 21): 2 va 6-ekranda qadamlar ustuni o'rniga vizual ostida qadam doiralari; 8 va 13-ekranda slaydlar varaq ustida ixcham qator; 12-ekran 2-qadamda zal va slayd nomlari yo'q.
- Yangi qatorlar: taymer «1 daqiqa» · «0» · «5 daqiqa»; 2-ekran «Zal savollari slaydlar ustidan o'tmoqda…»; 8-ekran ipuchasi «Gapda slayd nomi va nima yetishmagani bormi? Shunga qarab joyini tanlang.»;
  tugmalar «Avval taxminingizni belgilang», «Avval pitchni ayting», «Varaqni to'ldiring»; RECAPS qisqa sarlavhalari. `lessonTitle.ru` «Что вы покажете за пять минут?».
- **MD ichki ziddiyati:** KOD 9 `GATE_ITEMS` (kun / soat / yaratilgan) ↔ 10-ekran matnidagi slayd savoli — kodda ekran matni bo'yicha. 4-ekran 2/4 bosqich uchun Mentor gapi MD da yo'q (1-bosqich gapi qoldi).
- MD ga taklif (agent): 8-ekran — ✓ gap «Yozilmaydi»ga qo'yilsa xabar «Bu gapda slayd aniq aytilgan — varaqqa yozing.»; 11-ekran A/B maydoni bitta (1-qator → `ab.a`, qolgani → `ab.b`) — TAYANCHGA SAVOL.
- Mentor eslatmalaridan ichki kodlar («(T-038)», «Demo Day 7») olindi.

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (DE-205): App.jsx `m8-10` «Bir yilda nimalarni qurdingiz?» → **`m8-11` «Besh daqiqada nimani ko'rsatasiz?»** → `m8-12` «Zaxira dars»;
  reja chap matni App.jsx ostiga so'zma-so'z («pitch repetitsiyasi va qattiq fidbek»); hook sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon» (9-Modul pitch matni aynan, A/B va OKR sonlari tayanch 1 dan); metafora yo'q; bitta vizual — `PitchSahna` (slaydlar · taymer · zal · varaq qatlamlari). Ikkinchi misol faqat testda (mini-do'kon — 3, AvtoPizza — 7); Airbnb — keys (K12).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 6, 8 (QTushuncha) + 0, 4, 10, 11, 12, 13. «bosish, keyin matn-karta» naqshi yo'q: har harakatda Sahna, varaq yoki maket o'zgaradi.
- [x] O'lchov (python bilan sanaldi — «O'lchov» jadvali): sarlavha ≤55 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
- [x] Atamalar oldingi darslar bilan bir xil (grep): pitch, slayd, zal, hikoya, repetitsiya, uch slayd nomi, zal savollari — 9-Modul 12-dars MD · gapiradigan slayd, «Yo'q raqamni o'ylab topmaysiz…» — 8-Modul 14-dars YAKUNIY ·
  A/B sonlari va «82 ta brauzer» — tayanch 1 va 08 MD · `SELECT`/`WHERE` — `PostgresCrudLesson.jsx` · SQL Editor — 9-Modul 9, 10-Modul 2, 8. Yangi: fidbek, baholash varag'i, halol gap, Raqamlar va Keyingi qadam slaydi. Siz-forma; tugmalar siz-formada yoki ot-shaklda (§222/224).
- [x] Testlar: 4 variant, uzunlik yaqin, to'g'ri javob eng uzun emas («O'lchov» jadvali); kalit so'z, strelka, qavs faqat to'g'rida emas (3-ekranda tire hamma variantda; 9-ekranda qo'shtirnoq hamma variantda;
  arena 7 da tartib vergul bilan — strelka yo'q, T-035); ✔ o'rni B/D/A/C (yangi dars). Inkor-savol yo'q.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami — nishon, arena, podium — mustasno; ✓ ✗ — belgilar, varaq va slaydlarda); kafolat gaplari yo'q («har doim», «100%», «darrov», «albatta», «faqat» — o'quvchi matnida yo'q; 8-ekran 2-gapdagi «faqat» — sinfdosh gapi, iqtibos, T-008).
- [x] Ichki kodlar o'quvchi matnida yo'q (K12, «Modul 10», `m8-11` — faqat MD izohlarida); keys fakti — bank matni (manba yozilgan); «KOD» ro'yxati 17 band, REPO 0.
- [x] Karta T · P · S · PM ko'rildi: T-011 (fidbek, baholash varag'i, halol gap — misoldan keyin; sarlavhalarda yangi atama yo'q) · T-014/015 («band», «slayd», «natija», «reja», «so'rov» — bir ma'noda) · T-020 · T-029/T-047 (Mentor natijani aytmaydi) ·
  T-039 («pitchingiz» — o'quvchida 1 daqiqalik pitch bor) · T-042 (ta'riflar so'zma-so'z) · T-043 («Bu misolda» — 6) · T-064 (2-ekran sarlavhasi hook savolining so'zi bilan) · T-070 (3-ekran savolida «keyingi» yo'q) ·
  P-002 · P-008 · P-012 (testlar ketma-ket emas: 3, 5, 7, 9) · P-013 · P-015 · P-016 (hook javobi Mentorda yo'q) · P-025 · P-026 (10-ekran: Database bo'lmasa — yo'l bor) · P-028 (Neon tugmasi rasmiy hujjatdan) · P-033 · P-036 · P-046 (10–13 o'quvchi yozganidan) ·
  P-048 (nishon — ish qilingan ekranda) · P-052 · P-062 · P-063 (`ZAL_SAVOL` bitta manba) · P-064/181 (bashorat 2, 4, 6, 8) · P-067 ·
  S-001 (savollar 7–10 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 (Airbnb bashorati bitta, bir o'lchovda) · S-018 (Airbnb izohi Mentorda) · S-019 · S-020 (bozor, jamoa, investor izohi) · S-026 · S-027 · §144/145 ·
  PM-005 (2-tur) · PM-017 · PM-018 (odam roli bilan) · PM-020 · PM-027 (yangi uyga vazifa fayli yo'q) · PM-030 · PM-082 (darvoza-mashq, «…digan SQL yozamiz») · PM-108 (11-ekran tekshiruvi) · J-026.
- [?] Ochiq: TAYANCHGA SAVOL 1 (Maydon bosh raqami), 6 (yangi kalit), 10 (qurilmani almashtirish); 8 va 12-ekranda varaq + besh slayd telefonda (393 px) sig'ishi — vizual bosqichda ko'riladi (U-006).
