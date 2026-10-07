# 10-Modul · 1-dars (PM) «Bir oyda qaysi raqamni o'stirasiz?» — MD v3

Fayl: `src/8-Modull/PmOkrLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m8-01` · **15 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **A** (`0`) · 7-ekran — **D** (`3`) · 11-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx, DE-205): `m7-12` «Pitchingizda kimning hikoyasi bor?» → `m7-13` «Zaxira dars» → **`m8-01` «Bir oyda qaysi raqamni o'stirasiz?»** (osti: «bosh raqam, OKR va birinchi tajriba») → `m8-02` «Hodisalar tizimi: har harakat jadvalga yoziladi».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (keyingi oy OKR'i), mustaqil ish majburiy (9-ekran). Keys yo'q (tayanch 5: bankda OKR mavzusi yo'q). REPO yo'q (PM darsi; `m10-dars-02-start` dan boshlanadi).
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 7 · tushuncha va testlar (2–8) ≈ 35 · mustaqil ish ≈ 15 · SQL ≈ 15 · yakuniy savol, podium, kartochkalar, arena ≈ 18.
Manba: `00-MODUL-TAYANCH.md` (1-bo'lim raqamlari va OKR aynan · 2-bo'lim ta'riflari aynan · 5 — keyssiz · 7 — takroriy xatolar · 8 — saqlanadigan natija) · `GATE_M_JAVOB.md` · `00-TAQIQLAR.md`.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: «Keyingi oyga OKR»):** o'quvchi o'z loyihasiga (9-Modulda boshlagan MVP) keyingi oy uchun OKR (maqsad + 3 asosiy natija: hozir → oy oxirida) va unga ulangan birinchi tajribani yozadi.
   Tajriba OKR ning qismi emas — u bitta asosiy natija bilan tekshiriladigan o'zgarish (01-FILTR 1).
   Saqlanadi: `pm-m8d1-okr`. Mentor misoli — «Maydon» (tayanch 1-bo'limdagi OKR va raqamlar aynan).
2. **Bugungi asosiy fikr (P-013):** Maqsad so'z bilan yoziladi, asosiy natija esa unga yetganingizni raqam bilan sanaydi. (Yakun ro'yxatining birinchi qatori — so'zma-so'z shu.)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan:**
   - **bosh raqam** (5-Modul `m5-14`: «Bot o'z ishini bajarganini sanaydigan raqam»; tayanch: «mahsulot o'z ishini bajarganini ko'rsatadigan bitta raqam»). «Maydon»da — **haftada band qilingan vaqtlar**.
     North Star — faqat kartochkada bir marta: «inglizchasi North Star — «Qutb yulduzi»».
   - **metrika** — sanaladigan raqam (5-Modul). Bu darsda o'quvchi matnida ishlatilmaydi — kerak bo'lmadi (bir ma'noga «raqam» yetadi; T-014).
   - **uch qadam** (9-Modul 6-dars): **ochdi → vaqtni tanladi → band qildi** (tayanch shakli). Ustun yorliqlari: «Ochdi» · «Vaqtni tanladi» · «Band qildi».
   - **foiz** (5-Modul «qaytganlar foizi»; lug'at «ulush» → «foiz»): vaqtni tanlagan 100 kishidan nechtasi band qilgani (tayanch ta'rifi).
   - **mehnat raqami** (8-Modul `m6-14` «Raqamingiz nimani isbotlaydi?»: «jarayon va mehnatni ko'rsatadi — natijani emas») — 4-ekranda yorliq bo'lib qaytadi.
   - **hodisa** (9-Modul: analitikaga yoziladigan bitta harakat) — faqat uyga vazifada. **Umami** — 9-Modul 6-darsda ulangan; birinchi ko'rinishda bir qatorli izoh (S-018, 9-ekran Yordami).
4. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan aynan, dars bo'yi so'zma-so'z (T-042):**
   - **maqsad** — so'z bilan yozilgan yo'nalish, raqamsiz. (2-ekran Mentori; maqsad gapi kartada ko'rinib turgandan keyin.)
   - **asosiy natija** — raqam bilan, muddat bilan sanaladigan natija. (2-ekran xulosasi, uch bo'lak qo'shilgandan keyin.) Uch bo'lagi: **nima sanaladi · hozir · oy oxirida**.
   - **OKR** — maqsad + asosiy natijalar (Objectives and Key Results). (2-ekran joriy qatori, maqsad va 1-asosiy natija yonma-yon turgandan keyin.)
   - **tajriba** — asosiy natijani o'zgartirish uchun sinab ko'riladigan bitta o'zgarish. (8-ekran joriy qatori, tugma matni ulangandan keyin.)
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«maqsad»** faqat OKR qismi ma'nosida. Asosiy natijaning oxirgi raqami o'quvchi matnida **«oy oxirida»** deyiladi (maqsad emas) — shu bilan muddat ham ko'rinadi.
     Reja ekranining eyebrow'i — «Reja» («Maqsad» emas). Kod maydoni `maqsad` (tayanch 8) — faqat kodda (TAYANCHGA SAVOL 4).
   - **«natija»** faqat «asosiy natija» ichida. «Dars natijasi», «kutilgan natija», «natijasini ko'rasiz» yozilmaydi. Podium ekrani MD da «Podium» deb ataladi.
   - **«tajriba»** faqat atama ma'nosida («o'z tajribangiz» yozilmaydi). **«sinov»** — 9-Moduldagidek, faqat real odam bilan; bu darsda ishlatilmaydi.
   - **«qadam»** faqat «uch qadam» ma'nosida; ekran ichidagi bosqichlar — «bo'lak», «qator», tugma hisoblagichi — «N/3».
   - **«raqam»** — sanaladigan raqam (bosh raqam, asosiy natija qatoridagi raqam); odam soni — «kishi», «ta». «o'stirish / o'sish» (menyu nomidagi fe'l) — «oshirish» bilan aralashtirilmaydi.
   - **«karta»** o'quvchi matnida OKR uchun ishlatilmaydi — u «OKR doskasi» (tugma «Doskaga yozish»); «karta» — kartochkalar ekranining so'zi (qolip). MD dagi «karta» — doskaning o'ng qismi.
   - **Ishlatilmaydi:** KPI · KR · kalit natija · eksperiment · ulush · konversiya · ko'rsatkich · metrikani ko'taradi · voronka (lug'atdagi qolgan juftliklar — til-lint ushlaydi).
6. **Raqamlar (Mentor misoli, tayanch 1 — dars bo'yi aynan shu sonlar):** o'tgan hafta — ochdi 40 · vaqtni tanladi 25 · band qildi 6; bosh raqam — haftada 6 band.
   OKR (keyingi oy): maqsad «Mahalladagi o'yinchilar maydonni qo'ng'iroqsiz band qilsin.» · 1) haftada band qilingan vaqtlar 6 → 20 · 2) vaqtni tanlaganlardan band qilganlar foizi 24% (6 / 25) → 40% ·
   3) ikkinchi marta band qilgan o'yinchilar 0 → 5 · tajriba — tugma matni, 2-asosiy natijaga (B matni «18:00 ni band qilish» — tayanch 3, 4-dars).
   Hosila (arifmetika, yangi fakt emas): 40 foiz × 25 = 10 (6-ekran surgichi: 24/28/32/36/40 → 6/7/8/9/10).
   **Mashq sharti (tayanch 1, 9.3 — 9-Modul 6-dars naqshi):** «Bu mashqda har kishi har qadamda bir marta sanaladi.» — 6-ekranda bir qator. Shuning uchun 6 / 25 bo'lish bir o'lchovda.
   «Brauzer» so'zi va «turli brauzerlar» sharti 1-darsda ishlatilmaydi — ular 2-darsda o'z tizimimiz bilan tug'iladi (05.10 asosiy seans moslashi).
7. **Muammo gapi (9-Modul, so'zma-so'z):** «O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.» Maqsad shundan o'sadi: muammo hal bo'lgan holat.
8. **Metafora yo'q.** Keys yo'q. Ikkinchi misol faqat testda (P-002): **mini-do'kon sayti** (3-Modul loyihasi — tayanch 4) · 3, 5-ekran; 7-ekran — nomsiz sayt (faqat arifmetika).
9. **Toza yuza (185, D4):** tugma, variant, karta, yorliqda emoji yo'q; kalendar varag'i va odam-belgilari chizilgan (CSS). O'yin qatlami (arena, nishon medali, podium) — mustasno.
10. **Kod yozish (GATE M M-q0 A, PM_DARS_ETALON 26):** Neon SQL Editor topshirig'i — bosh raqamni `bandlar` jadvalidan sanash (`SELECT COUNT(*) … WHERE yaratilgan …`); `m7-12` dagi JS funksiya mexanikasi takrorlanmaydi. Checklist + «Bajardim».

## Darsning ipi va bitta vizual

- **Modul ipi — «Maydon» davomi** (tayanch 1): 9-Modulda qurilgan, sinovdan keyin tuzatilgan MVP endi o'lchanadi, sinaladi, himoyalanadi va prodga chiqadi. 1-dars — bosh raqam va keyingi oyga OKR.
- **Dars ipi:** hook'da o'tgan haftaning uch raqami — qaysi biri o'stiriladi → 2-ekranda maqsad ostiga 1-asosiy natija yig'iladi (OKR tug'iladi) →
  4-ekranda besh qatordan qolgan ikki asosiy natija ajraladi, qolgani — qilinadigan ishlar (mehnat raqami) → 6-ekranda 2-asosiy natija — foiz surib ko'riladi →
  8-ekranda bitta ish tajriba bo'lib 2-asosiy natijaga ulanadi → 9-ekranda o'quvchi o'z OKR'ini yozadi → 10-ekranda bosh raqamni Database'dan SQL bilan oladi → uyda qolgan «hozir» lar.
- **Bitta vizual — OKR doskasi (`OkrDoska`, dars bo'yi, 163/180; bitta manba `MAYDON_OKR`):**
  - **chapda «O'tgan hafta · Mentor misoli»** — uch ustun **Ochdi 40 · Vaqtni tanladi 25 · Band qildi 6** (balandligi songa mos, har ustunda raqam va kichik odam-belgilari).
    Holatlar: oddiy · tanlangan (accent) · ostida kulrang yorliq «bosh raqam» (Band qildi). Qo'shimcha qatlamlar (o'sha komponent):
    «Vaqtni tanladi» → «Band qildi» oralig'ida foiz yorlig'i «24%» va surgich (6-ekran) · shu oraliqda kichik tugma maketi «Band qilish» ↔ «18:00 ni band qilish» (8-ekran) ·
    «Band qildi» ustunidagi bitta odam-belgisi ustida «2» va yorliq «qaytib keldi» (4-ekran).
  - **o'ngda «OKR · keyingi oy» kartasi** — tepada kulrang kirish qatori «Muammo: …» (Mentor misolida — 9-Modul muammo gapi; 9-ekranda — o'quvchiniki);
    **maqsad** qatori · **uchta asosiy natija** qatori (har birida: «nima sanaladi» matni + ikki kichik yorliq «hozir N» → «oy oxirida M» + ular orasida ingichka chiziq);
    karta **ostida, alohida** — **tajriba** qatori (karta chegarasidan tashqarida, bog'lanish chizig'i bitta asosiy natijaga): «OKR · keyingi oy» sarlavhasi faqat maqsad va asosiy natijalarni o'raydi (01-FILTR 1).
    Qator holatlari: bo'sh (kulrang uzuq chiziq, U-041) → yozildi (matn bir lahza ajralib kiradi) → joriy (accent chegara) → xato (`err` fon) → ulangan (tajriba qatoridan asosiy natija qatoriga chiziq).
    Yorliqlar (atama tug'ilgandan keyin): «maqsad» · «asosiy natija» · «tajriba»; karta sarlavhasi «OKR · keyingi oy».
  - **oy oxiri belgisi** — karta burchagida chizilgan kalendar varag'i va savol pufagi (2-ekran: «Nimani sanaysiz?» → «Hozir nechta?» → «Oy oxirida nechta?» → ✓).
  - **«Qilinadigan ishlar»** — karta ostidagi bo'sh ro'yxat (uzuq chiziqli joy; 4-ekranda qatorlar tushadi, 5/5 da ostida yorliq «mehnat raqami»).
  - Ishlatiladi: 0 (chap qism) · 1 (karta skeleti) · 2 · 4 · 6 (chap qism + 2-qator) · 8 · 9 (o'quvchining kartasi) · 13/14 da artefakt-strip «OKR'im». `prefers-reduced-motion` da harakat to'xtaydi, holat birdan qo'yiladi.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · «Maydon» o'tgan hafta
- Sarlavha: **Bir oyda qaysi raqamni o'stirasiz?** (34) — dars nomi (DE-205)
- Mentor: «Maydon» bir hafta ishladi. O'tgan haftaning uch ustunidan bittasini belgilang.
- Maket (chap): OKR doskasi — chap qism: «O'tgan hafta · Mentor misoli», uch ustun **Ochdi 40 · Vaqtni tanladi 25 · Band qildi 6**; o'ng qism (karta) hali yopiq, kulrang.
  Ustunlar ostida kichik kulrang qator (doim ko'rinadi): Mashqda har kishi har qadamda bir marta sanalgan. (01-FILTR 6)
- Variantlar (radio, o'ng; ustun yorliqlari bilan bir xil):
  - Ochdi: 40
  - Vaqtni tanladi: 25
  - Band qildi: 6
- Javob — «Band qildi»: **Aynan!** «Maydon» band qilish uchun qurilgan. Band qilinganlar o'ssa, sayt o'z ishini ko'proq bajaradi. (101)
- Javob — «Ochdi»: **Qiziq fikr!** Ochganlar ko'paysa yaxshi, lekin 40 kishidan 6 tasi band qildi. Sayt band qilish uchun qurilgan. (108)
- Javob — «Vaqtni tanladi»: **Qiziq fikr!** Vaqt tanlagan 25 kishidan 6 tasi band qildi. Sayt band qilinganda o'z ishini bajaradi. (98)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan ustun accent bo'ladi va bir lahza ko'tariladi; keyin «Band qildi» ustuni ostida kulrang yorliq **bosh raqam** paydo bo'ladi (5-Moduldagi atama),
  ustun tepasida uzuq chiziqli bo'sh joy «oy oxirida ?» chiqadi (U-041 — keyin to'ldiriladigan joy). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- O'qituvchi eslatmasi: Bosh raqam 5-Modulda bot uchun o'tilgan: «bot o'z ishini bajarganini sanaydigan raqam». Sinfdan so'rang: «Maydon» o'z ishini qachon bajardi deyish mumkin?

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun loyihangizga oylik maqsad va raqamlar yozasiz.** (52)
- Mentor: O'tgan modulda «Maydon» qurildi va sinovdan keyin tuzatildi. Bugungi misol ham shu sayt haqida.
- Chap — «Dars oxirida — bosh raqam, OKR va birinchi tajriba» (App.jsx osti bilan so'zma-so'z, P-015) + OKR doskasi: karta skeleti
  (maqsad · uchta qator · tajriba) — kulrang chiziqlar 0.9 s oraliqda birma-bir to'q chiziqqa aylanadi (matnsiz — keyingi ekranlar javobini ochmaydi), oxirida tajriba chizig'i bitta qatorga ulanadi.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015):
  - 01 · Qaysi raqamni o'stirishni tanlaysiz · `bosh raqam`
  - 02 · Oy oxirida yetganingizni sanashni o'rganasiz · `asosiy natija`
  - 03 · Oyning birinchi o'zgarishini tanlaysiz · `tajriba`
  - 04 · Loyihangizga keyingi oy uchun yozasiz · `OKR`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada «OKR» yo'q (T-011 — u 2-ekranda tug'iladi); chap qator — App.jsx osti, teglar kulrang yorliq (P-015 «qiyin atama kulrang yorliqqa»).

## 2 · Maqsad va asosiy natija  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · oy oxiri
- Sarlavha: **Oy oxirida yetganingizni qanday bilasiz?** (40)
- Mentor: «Maydon» doskasida muammo hal bo'lgandagi holat yozilgan — o'yinchilar nima qiladi. Ostiga bo'laklarni birma-bir qo'shing va oy oxiri savoliga qarang.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Oy oxirida tekshirish uchun qatorga nechta bo'lak kerak?** · 1 · 2 · 3 — tanlov saqlanadi, bo'laklar shundan keyin ochiladi.
- O'ng — OKR doskasi: karta tepasida kirish qatori «Muammo: O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.» ·
  maqsad qatori «Mahalladagi o'yinchilar maydonni qo'ng'iroqsiz band qilsin.» · ostida bitta bo'sh qator (uzuq chiziq) · burchakda oy oxiri belgisi, pufak «Nimani sanaysiz?».
  Chap qism (uch ustun) kichik, «Band qildi» ostida «bosh raqam».
- Chap — bo'lak tugmalari (`QQadamlar`, 163.8; joriysi accent, qo'shilgani ✓): 1 Nima sanalishini qo'shing · 2 Hozirgi raqamni qo'shing · 3 Oy oxiridagi raqamni qo'shing
- **Harakat → Vizual o'zgarish:** joriy bo'lak tugmasini bosish → bo'sh qator yozilib boradi va pufak javob beradi:
  1. qatorga «Haftada band qilingan vaqtlar» yoziladi; chapda «Band qildi» ustuni bir lahza yonadi → pufak «Hozir nechta?»
  2. yorliq «hozir 6» chiqadi → pufak «Oy oxirida nechta?»
  3. yorliq «oy oxirida 20» chiqadi, ikkalasi orasida chiziq chiziladi → pufak o'rnida ✓; maqsad qatori yonida yorliq **maqsad**, yangi qator yonida **asosiy natija**, karta sarlavhasi **OKR · keyingi oy** bo'ladi (atamalar — misoldan keyin).
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi».
  Joriy qator (`QIzoh`, 3-bo'lakdan keyin): Tepadagi raqamsiz yo'nalish — maqsad, raqamli qator — asosiy natija. Ikkalasi birga OKR deyiladi (Objectives and Key Results). (117)
  Qator (`QIzoh`, xulosadan keyin — yozish qolipi, universal qoida emas): Bu darsda har asosiy natijani uch bo'lak bilan yozamiz: nima sanaladi, hozir nechta, oy oxirida nechta. (98)
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Keyingi bo'lakni qo'shing — oy oxiri savoli qanday o'zgarishini ko'ring.
- Xulosa: Asosiy natija — raqam bilan, muddat bilan sanaladigan natija. (61)
- Tugma (pastki): Bo'laklarni qo'shing (N/3) → Davom etish · `tugadi`: bo'lak tugmalari yopiladi, karta butun enga (DE-199); vizual ⛶ ichida (q17).
- O'qituvchi eslatmasi: Maqsad muammo gapidan o'sadi: muammo hal bo'lsa, o'yinchi qo'ng'iroq qilmasdan band qiladi. «Haftada … 20» — oyning oxirgi haftasidagi raqam, oy bo'yi jami emas.
  20 — Mentor tanlagan maqsad, hisoblab topilgan «to'g'ri son» emas: erishsa bo'ladigan, lekin hozirgidan sezilarli katta son tanlanadi (01-FILTR, kanon 3).
  Sinfdan so'rang: «20» ni maqsad qatoriga yozsak, nima o'zgaradi?

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · asosiy natija
- Savol: **Mini-do'kon: qaysi qatorda uchala bo'lak ham bor?** (7 so'z) — 01-FILTR 2: asosiy natija ta'rifi bo'yicha A ham to'g'ri bo'lardi; savol darsdagi yozish qolipini tekshiradi — (MD izohi, o'quvchiga ko'rinmaydi: mini-do'kon — 3-Moduldagi loyiha, tayanch 4).
  - A — Oy oxirida buyurtmalar 30 ta bo'lsin (36)
  - B — Do'kon xaridorlarga qulayroq bo'lsin (35)
  - ✔ C — Buyurtmalar hozir 12 ta, oy oxirida 30 (38)
  - D — Hozir 12 ta buyurtma bor, ular ko'paysin (40)
- To'g'ri izohi: Unda nima sanalishi, hozirgi raqam va oy oxiridagi raqam bor.
- Xato izohlari: A — Oy oxiri bor, lekin hozir nechta ekani yozilmagan. (50) · B — Bu yo'nalish — maqsadga o'xshaydi, unda raqam yo'q. (51) ·
  D — Hozirgi raqam bor, oy oxirida qanchaga yetishi yo'q. (52) · umumiy — Nima sanaladi, hozir, oy oxirida — qaysi gapda uchalasi? (55)
- Yozuvlar (barcha testlarda bir xil, qolip): To'g'ri · Qaytadan urinib ko'ring · (jonli darsda xato tanlansa) To'g'ri javob: X — …
- Izoh (MD): «hozir» C va D da, «oy oxirida» A va C da — kalit so'z faqat to'g'rida emas (S-003); har noto'g'ri variantda bitta bo'lak yetishmaydi (S-004).

## 4 · Asosiy natija yoki ish  ← QTushuncha (saralash)
- Eyebrow: Tushuncha · kim nima qildi
- Sarlavha: **Qaysi qator mehnatni emas, natijani sanaydi?** (44) — 01-FILTR 3; «mehnatni emas, natijani» — 8-Modul «mehnat raqami» ta'rifi so'zlari
- Mentor: Keyingi oyga yana qatorlar yozildi, hammasida raqam bor. Har birini OKR doskasiga yoki «Qilinadigan ishlar» ro'yxatiga joylang.
- Bashorat (ballsiz, zinapoya — S-015): **Besh qatordan nechtasi asosiy natija bo'ladi?** · 1 · 2 · 3 — tanlov saqlanadi.
- Vizual: OKR doskasi — kartada maqsad + 1-asosiy natija (2-ekrandan) + ikki bo'sh qator (uzuq chiziq); karta ostida «Qilinadigan ishlar» — bo'sh ro'yxat (uzuq chiziqli joy); chapda uch ustun.
- Qatorlar (5, aralash tartibda; hammasi bir shaklda — kodda `QATORLAR`; kartochka ichidagi strelka — yorliq, izoh emas):
  1. Vaqtni tanlaganlardan band qilganlar foizi: 24% → 40% — asosiy natija (2-qator)
  2. Mahalla chatiga yozilgan e'lonlar: 0 → 4 — qilinadigan ish
  3. Ikkinchi marta band qilgan o'yinchilar: 0 → 5 — asosiy natija (3-qator)
  4. Saytga qo'shilgan yangi rasmlar: 0 → 3 — qilinadigan ish
  5. Agentga berilgan talablar: 0 → 6 — qilinadigan ish
- ✎ Qatorlar bittadan (SABOQ 9, 13): bir vaqtda bitta qator katta karta bo'lib chiqadi (tartib aralash); joy bosilgach doskaga yoki ro'yxatga uchib boradi, keyingisi chiqadi.
  Doskadagi bo'sh qatorlar va «Qilinadigan ishlar» ro'yxati uzuq chiziqli bo'sh joysiz — yozilgani paydo bo'ladi (SABOQ 4).
- **Harakat → Vizual o'zgarish:** qatorni bosib, joyni bosish (yoki sudrash) →
  - asosiy natija → OKR doskasidagi bo'sh qatorga yoziladi; chapda u sanaydigan joy yonadi: foiz — «Vaqtni tanladi» → «Band qildi» oralig'i (yorliq «24%»);
    ikkinchi marta — «Band qildi» ustunidagi bitta odam-belgisi ustida «2» va yorliq **qaytib keldi**;
  - ish → «Qilinadigan ishlar» ro'yxatiga tushadi; uch ustun ustidan bir lahza kulrang chiziq o'tadi (sanaydigan joy topilmadi).
  - Noto'g'ri joy → qator silkinib qaytadi, bitta `QXato` (ikkala yo'nalishda bir xil — bitta belgi): Bu raqam qilgan ishingizni sanaydimi yoki natijani? (51)
- 5/5 da «Qilinadigan ishlar» ostida yorliq **mehnat raqami** paydo bo'ladi (8-Moduldagi atama). Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: 2».
- Xulosa: Bu misolda asosiy natijalar o'yinchilar nima qilganini sanaydi. Siz qilgan ish soni — mehnat raqami. (97)
- Tugma (pastki): Qatorlarni joylang (N/5) → Davom etish · `tugadi`: qatorlar paneli yopiladi, karta va ro'yxat butun enga.
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xato bo'lsa) Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: «Mehnat raqami» — «Raqamingiz nimani isbotlaydi?» darsidan: u jarayonni ko'rsatadi. Sinfdan so'rang: e'lonlar 4 ta bo'ldi, lekin hech kim band qilmadi — maqsadga yaqinlashdikmi?
  Mezon — «mehnatmi yoki natijami», «kim qildi» emas: boshqa mahsulotda asosiy natija sahifa xatolari kamayishi ham bo'lishi mumkin. 3-qatorning «hozir 0» si `bandlar` jadvalidagi telefon raqamlaridan sanaladi (Umami buni bermaydi).
  Ishlar kerak — ular asosiy natijani o'zgartirish uchun qilinadi (8-ekranga ko'prik, aytib bermang).

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · kim nima qildi
- Savol: **Mini-do'konning keyingi oy OKR'iga qaysi qator asosiy natija?** (8 so'z)
  - ✔ A — Buyurtma berganlar haftada 3 tadan 10 taga (42)
  - B — Yozilgan mahsulot tavsiflari 5 tadan 20 taga (44)
  - C — Saytga qo'shilgan rasmlar 10 tadan 30 taga (42)
  - D — Do'stlarga yuborilgan havolalar 0 dan 15 taga (45)
- To'g'ri izohi: Buyurtmalar — maqsaddagi natija; qolgan qatorlar siz qiladigan ishni sanaydi.
- Xato izohlari: B — Tavsiflarni siz yozasiz — bu mehnat raqami. (43) · C — Rasmlarni siz qo'shasiz — bu ham sizning ishingiz. (50) ·
  D — Havolani siz yuborasiz — xaridor hali hech narsa qilmadi. (57) · umumiy — Mehnatni emas, natijani sanaydigan qatorni toping. (50)
- Izoh (MD): to'rtala variantda «… dan … ga» (hozir va oy oxiri bor), muddat — savoldagi «keyingi oy»; farq faqat kim qilgani — 4-ekran qoidasi.

## 6 · Foiz  ← QTushuncha
- Eyebrow: Tushuncha · foiz
- Sarlavha: **Foiz 24 dan 40 ga o'ssa, nima o'zgaradi?** (40)
- Mentor: Bu darsdagi foiz — vaqtni tanlagan har 100 kishidan nechtasi band qilgani. Foizni o'ngga surib, «Band qildi» ustuniga qarang.
- Bashorat (ballsiz, zinapoya): **Vaqtni yana 25 kishi tanlasa, 40 foizda nechtasi band qiladi?** · 6 · 8 · 10 — tanlov saqlanadi.
- Vizual: OKR doskasi — chap qism kattalashadi: uch ustun 40 · 25 · 6, «Vaqtni tanladi» → «Band qildi» oralig'ida yorliq «24%»; ostida surgich «Foiz» (24 · 28 · 32 · 36 · 40).
  O'ngda kartaning 2-asosiy natija qatori joriy (accent).
- Bitta qator (`QIzoh`, ustunlar ustida — tayanch 1, mashq sharti): Bu mashqda har kishi har qadamda bir marta sanaladi. (54)
- **Harakat → Vizual o'zgarish:** surgichni o'ngga surish → «Band qildi» ustuni o'sadi: 24 → 6 · 28 → 7 · 32 → 8 · 36 → 9 · 40 → 10 («Vaqtni tanladi» 25 qoladi);
  ustundagi raqam va odam-belgilari ko'payadi, oraliq yorlig'i surgichdagi foizni ko'rsatadi. 40 da kartadagi 2-qator chizig'i oxirigacha chiziladi.
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: 10» yoki «Taxminingiz to'g'ri chiqdi».
  Ipucha (40 s): Surgichni o'ngga suring — ustun qanday o'zgarishini ko'ring.
- Xulosa: Bu misolda 25 kishidan 10 tasi band qilsa — 40 foiz, bosh raqam esa 6 dan 10 ga o'sadi. (87)
- Tugma (pastki): Foizni 40 gacha suring → Davom etish · `tugadi`: surgich yopiladi, ustunlar fokusga.
- O'qituvchi eslatmasi: Sinfdan so'rang: foiz 40 bo'lganda haftada 20 band bo'lishi uchun vaqtni nechta kishi tanlashi kerak? (50.) Shuning uchun bitta asosiy natija yetmaydi — 1 va 2-qator birga.

## 7 · 3-savol  ← QTest (✔ D, `correctIdx 3`)
- Eyebrow: Tekshiruv · foiz
- Savol: **20 kishi vaqt tanladi, 5 tasi band qildi. Foiz qancha?** (10 so'z)
  - A — 5 foiz
  - B — 15 foiz
  - C — 4 foiz
  - ✔ D — 25 foiz
- To'g'ri izohi: 20 kishidan 5 tasi — 100 kishidan 25 tasi degani.
- Xato izohlari: A — 5 — band qilganlar, foiz emas. (30) · B — 15 — band qilmay ketganlar, foiz emas. (38) · C — 20 ni 5 ga bo'ldingiz — bo'lish teskari. (37) ·
  umumiy — Vaqt tanlagan 100 kishidan nechtasi band qilgan bo'lardi? (57)
- Izoh (MD): distraktorlar — uch yanglish yo'l: sonning o'zi (5), ayirish (15), teskari bo'lish (20 / 5). Savoldagi son kalitda takrorlanmaydi (S-019).

## 8 · Tajriba  ← QTushuncha
- Eyebrow: Tushuncha · bitta o'zgarish
- Sarlavha: **Tugma matnini qaysi raqam bilan tekshirasiz?** (44) — 01-FILTR 4
- Mentor: Mentor misolida «Band qilish» tugmasida tanlangan soat yoziladi. Shu o'zgarishni eng bevosita tekshiradigan asosiy natijaga ulang.
- Vizual: OKR doskasi — chapda uch ustun; «Vaqtni tanladi» va «Band qildi» oralig'ida kichik tugma maketi: «Band qilish» bir marta «18:00 ni band qilish» ga almashadi, keyin ikkalasi yonma-yon turadi
  (kulrang yorliqlar «hozir» · «yangi»). O'ngda karta: maqsad + uchta asosiy natija; pastda bo'sh qator va unga tayyor o'zgarish bo'lagi «Tugmada tanlangan soat yozilsin».
- **Harakat → Vizual o'zgarish:** o'zgarish bo'lagini bitta asosiy natija qatoriga ulash (bosish yoki sudrash) →
  - 2-qator (foiz) → bo'lakdan qatorga chiziq chiziladi; chapda tugma turgan oraliq yonadi; bo'lak pastki qatorga o'tiradi: «Tugmada tanlangan soat yozilsin · 2-asosiy natijaga»;
  - 1-qator → bo'lak sekin qaytadi (silkinishsiz, xato rangisiz), `QIzoh`: Haftalik bandlar ham o'zgarishi mumkin. Lekin tugma vaqt tanlashdan band qilishga o'tishga bevosita tegadi — asosiy o'lchov uchun 2-qatorni oling. (01-FILTR 4: 1-qator xato emas)
  - 3-qator → bo'lak silkinib qaytadi, `QXato`: Ikkinchi marta kelish keyin bo'ladi — tugma qaysi qadamda? (58)
  Joriy qator (`QIzoh`, ulangandan keyin): Asosiy natijani o'zgartirish uchun sinab ko'riladigan bitta o'zgarish tajriba deyiladi. Yordam berdimi — buni raqam ko'rsatadi. (120) — pastki qator yonida yorliq **tajriba**, qator karta ostida alohida.
- Xulosa: Tajriba bitta bo'lsa, raqam o'zgarganda nima yordam berganini ajratish osonroq. (79)
- Tugma (pastki): O'zgarishni ulang → Davom etish · `tugadi`: doska butun enga, chiziq va oraliq yonib turadi.
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: «Nega bitta?» — o'tgan modulning tuzatish darsidagidek: bir nechtasi birga o'zgarsa, qaysi biri yordam berganini ajratish qiyin.
  Tajriba ishladimi — hozir aytmang: buni oy davomida raqam ko'rsatadi. Tugma — 9-Modul tuzatishidan keyin ekran pastiga qotirilgan o'sha tugma.

## 9 · Mustaqil ish  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Loyihangizga keyingi oy OKR'ini yozing.** (39)
- Mentor: Maqsadni muammo gapingizdan oling: muammo hal bo'lganda odamlar nima qiladi? Har qatorni yozib, «Doskaga yozish»ni bosing.
- Kirish qatori (kulrang, doska tepasida; P-046): `pm-m7d3-muammo` bo'lsa — «Muammo: <o'quvchining muammo gapi>»; yo'q bo'lsa — bitta maydon «Loyihangiz muammosini bir gapda yozing» (M-q5).
- Bitta ustun: OKR doskasi (o'ng qism: maqsad · uchta qator · tajriba; joriy qator accent) → forma (har bosqichda bitta blok) → Yordam · «Doskaga yozish» o'ngda (187).
- Bosqich chiplari 1–5 (joriysi accent, yozilgani ✓) va maydonlar (placeholder qisqa, tayyor javobsiz — §32):
  1. maqsad — «Odamlar nima qilsin?»
  2. 1-asosiy natija · 3. 2-asosiy natija · 4. 3-asosiy natija — har birida uch maydon: «Nima sanaladi?» · «Hozir» · «Oy oxirida»
  5. tajriba — «Bitta o'zgarish» + «Qaysi asosiy natijaga?» (uchta tanlov — o'quvchi yozgan qatorlar matni bilan)
- Tekshiruv (`QXato`, ≤60; javob forma ostida, yozilgan zahoti — 106d):
  - maqsadda raqam bor (bloklaydi): Maqsadda raqam bo'lmaydi — uni asosiy natijaga o'tkazing. (57)
  - «Hozir» bo'sh (bloklaydi): Hozirgi raqamni yozing; bilmasangiz — «?» qo'ying. (49)
  - «Oy oxirida» raqam emas (bloklaydi): Oy oxirida qancha bo'lishini raqam bilan yozing. (48)
  - «Oy oxirida» = «Hozir» (yo'naltiradi): Oy oxiridagi raqam hozirgidek — o'sish qayerda? (47)
  - «Nima sanaladi?» da ish so'zlari — «qo'shish», «yozish», «joylash», «yuborish», «post», «e'lon», «rasm» (yo'naltiradi, bloklamaydi): Bu siz qiladigan ishga o'xshaydi — odamlar nima qiladi? (55)
  - tajriba qatori tanlanmagan (bloklaydi): Tajriba qaysi asosiy natijaga ulanadi? Bittasini tanlang. (57)
  - o'tgan qator (106d-a): doskada yashil ✓ oladi — alohida maqtov-matni yo'q.
- Doimiy qator (forma ostida): Yo'q raqamni o'ylab topmaysiz: hozirgisini bilmasangiz, «?» qo'yasiz. (69) — 8-Modul «Yo'q raqamni o'ylab topmaysiz» qoidasining davomi.
- Yordam: Hozirgi raqamni bor manbadan oling: Umami (saytingizda odamlar nima qilganini yozib boradigan xizmat, o'tgan modulda ulangan) yoki Database. Hali sanay olmaydiganiga «?» qo'ying. Asosiy natija topilmasa — o'z uch qadamingizdan boshlang: odamlar oxirgi qadamga qancha yetdi? (01-FILTR 5)
- **Harakat → Vizual o'zgarish:** qatorni yozib «Doskaga yozish» → qator doskaga kiradi, joriy belgi keyingisiga o'tadi; tekshiruvdan o'tgani yashil ✓, o'tmagani `err` fon va ostida bitta `QXato`;
  tajriba tanlanganda doskada tajriba → asosiy natija chizig'i chiziladi. 5/5 da forma yopiladi, doska butun enga (DE-199), har qatorda ✎ (tahrirlash).
- Xulosa: OKR'ingiz va unga ulangan birinchi tajribangiz tayyor. (61)
- Tugma (pastki): Beshta qatorni yozing (N/5) → Davom etish
- Artefakt-strip (U-042): shu ekrandan — «OKR'im» (ixcham, holat «3/5»); 10, 13, 14-ekranlarda ko'rinadi, test, arena va podiumda yo'q.
- O'qituvchi eslatmasi (`MentorNote`): Juftlikda sherigining doskasini o'qisin: maqsadda raqam yo'qmi, har asosiy natijada uch bo'lak bormi, tajriba bitta qatorga ulanganmi.
  «?» qo'yilgan qatorlar — uyga vazifa ①. Jonli darsda bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 10 · Kod yozish: bosh raqam  ← QKod (Neon varianti — kod oynasi o'rnida Neon maketi; GATE M M-q0 A, PM_DARS_ETALON 26)
- Eyebrow: Kod yozish · Neon
- Sarlavha: **Bosh raqamni Database'dan sanaydigan SQL yozamiz.** (49) — PM-082(a) sarlavha oilasi
- Mentor: Doskadagi «haftada 6 band» o'ylab topilmagan — u «Maydon»ning `bandlar` jadvalidan sanalgan. Neon'dagi SQL Editor'da shu sonni o'zingiz oling.
- Darvoza-mashq (PM-082 c/e, SQL oldidan, ballsiz): **Haftada band qilingan vaqtlarni qaysi ustun bo'yicha sanaymiz?** · `kun` · `soat` · ✔ `yaratilgan`
  - xato `kun`: `kun` — o'yin kuni, band qilingan kun emas. (belgisiz)
  - xato `soat`: `soat` — vaqt katagi, unda sana yo'q. (belgisiz)
- Chap (vazifa, 3 band; bosiladigan katakcha emas — qadam ro'yxati):
  1 Neon'da `maydon` loyihangizni oching va SQL Editor'ga o'ting.
  2 Bo'sh joyni to'ldirib, SQL'ni o'zingiz yozing va «Run»ni bosing.
  3 Neon ko'rsatgan sonni pastdagi maydonga yozing.
- SQL (ekranda; nusxalash tugmasi yo'q — qo'lda yozganda o'rganiladi, korpus §19):
```sql
SELECT COUNT(*)
FROM bandlar
WHERE ______ >= NOW() - INTERVAL '7 days';
```
- Maydon (vazifa ostida): **Oxirgi 7 kunda: ___** — placeholder: `Neon ko'rsatgan son` · tekshiruv (`QXato`, bloklaydi): son bo'lmasa — Neon ko'rsatgan sonni shu yerga yozing. (44)
- Yordam: Eslatma (SQL darslaridan): `SELECT` — ma'lumotni ko'rsatadi · `WHERE` — qaysi qatorlar olinishi · `COUNT(*)` — qatorlarni sanaydi · `NOW() - INTERVAL '7 days'` — hozirdan 7 kun oldin.
  `bandlar` jadvali — o'tgan modulda «Maydon»ga qo'shilgan jadval (namuna bandlar ham shu yerda). ✎ (06.10, T-036: o'quvchi matnida modul raqami yo'q)
- O'ng — Neon maketi (`NeonMaket`, chizilgan; logotip yo'q): tepada SQL Editor oynasi — SQL matni (bo'sh joy bilan), o'ng burchakda «Run»; ostida jadval: ustun `count`, bitta katak — kulrang «?».
  Maket ostida (`QIzoh`): Sizning soningiz shu katakda chiqadi — u sizning Database'ingizdan. Mentor misolida — 6. (73)
- **Harakat → Vizual o'zgarish:** darvozada `yaratilgan` tanlanadi → SQL dagi bo'sh joyda `yaratilgan` bir lahza ajralib turadi (maketda ham); maydonga son yozilganda katakdagi «?» o'rniga o'quvchining soni chiqadi;
  doskadagi «Band qildi» ustuni ostida kulrang yorliq «Database'dan» paydo bo'ladi (P-046 — o'quvchining haqiqiy soni).
- Tugma: **Bajardim — SQL ishladi, son yozildi** (qulf: darvoza yechilmagan bo'lsa — «Avval ustun savolini yeching»; son yozilmagan bo'lsa — «Avval Neon ko'rsatgan sonni yozing»). Bitta halol tugma (korpus §19).
- Hammasi bajarilgach (yashil): Bosh raqam Database'dan olindi — u o'ylab topilmaydi. (55)
- O'qituvchi eslatmasi: Laptopdagi va Render'dagi Backend bitta Neon Database'ga yozadi — o'quvchining o'z tekshiruv bandlari va namuna bandlar ham sanaladi (tayanch 9.11): son Mentornikidan farq qilishi tabiiy.
  Telefon raqamlarini ekranga chiqarmang: `SELECT *` emas — faqat son. `NOW()` Database vaqtida ishlaydi; 7 kunlik oraliq uchun Toshkent vaqti farqi sezilmaydi.
  O'z loyihasida boshqa jadval bo'lsa — uyda o'sha jadval nomi bilan (9-ekrandagi «Hozir» shu yerdan olinishi mumkin). Foiz hisobi 6-ekran surgichida — bu ekranda takrorlanmaydi.
- Manba (o'quvchiga ko'rinmaydi): Neon rasmiy hujjati — neon.com/docs/get-started/query-with-neon-sql-editor («SQL Editor … click Run»; 11-dars MD si bilan bir xil manba);
  SQL asoslari — 4-Modul `m4-06` (`SELECT`, `WHERE`); repo `dars-11-done`: `band.entity.ts` — `yaratilgan` (`timestamptz`, `CreateDateColumn`).

## 11 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`; ikki qoida birga — tajriba bitta o'zgarish va u raqamning o'zi emas)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Ikkinchi marta band qilganlar uchun qaysi biri tajriba?** (8 so'z)
  - A — Ikkinchi marta band qilganlar 5 taga yetsin (43)
  - ✔ B — O'yindan keyin o'yinchiga eslatma yuborish (42)
  - C — O'yinchilar «Maydon»ni yaxshi ko'rib qolsin (43)
  - D — Saytning hamma sahifasini birdan yangilash (42)
- To'g'ri izohi: Bu bitta o'zgarish, u qaytib kelishni sanaydigan raqamga ulanadi.
- Xato izohlari: A — Bu raqam — asosiy natija, o'zgarishning o'zi emas. (50) · C — Bu yo'nalish, raqamsiz — maqsadga o'xshaydi. (44) ·
  D — Hammasi birdan o'zgarsa, nima yordam bergani ajralmaydi. (56) · umumiy — Qaytib kelishni o'zgartiradigan bitta o'zgarishni toping. (57)
- Izoh (MD): eslatma — 9-Modul MVP ning «Keyin» qutisidan (tayanch 9-Modul 1: «Keyin — to'lov · jamoa yig'ish · eslatma»); «Maydon»da qurilmagan — test ichida tajriba g'oyasi.

## 12 · Podium  ← QNatija
- Jonli reyting — qolip standarti.
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Asosiy natija bo'laklari · 2 — Kim qilgani sanaladi · 3 — Foiz hisobi · 4 — Bitta tajriba

## 13 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**
- ✎ Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Bosh raqam nimani ko'rsatadi? | Mahsulot o'z ishini bajarganini; «Maydon»da — haftada band qilingan vaqtlar (inglizchasi North Star — «Qutb yulduzi») |
| Muammo gapidan maqsad qanday olinadi? | Muammo hal bo'lgan holat yoziladi: odamlar nima qiladi |
| Maqsadda raqam bo'ladimi? | Yo'q: maqsad — so'z bilan yozilgan yo'nalish, raqamsiz |
| Bu darsda asosiy natija qaysi uch bo'lak bilan yoziladi? | Nima sanalishi, hozirgi raqam va oy oxiridagi raqam |
| «Mahalla chatiga 4 ta e'lon» — asosiy natijami? | Yo'q, bu mehnat raqami: u siz qilgan ishni sanaydi |
| «Maydon» maqsadi qanday? | Mahalladagi o'yinchilar maydonni qo'ng'iroqsiz band qilsin |
| Vaqtni 25 kishi tanlab, 6 tasi band qilsa, foiz qancha? | 24 foiz |
| Bu darsdagi foiz nimani sanaydi? | Vaqtni tanlagan har 100 kishidan nechtasi band qilganini |
| Tajriba nima? | Asosiy natijani o'zgartirish uchun sinab ko'riladigan bitta o'zgarish |
| «Maydon» tajribasi qaysi asosiy natija bilan tekshiriladi? | Vaqtni tanlaganlardan band qilganlar foizi bilan |
| Bosh raqamni qayerdan olasiz? | Database'dan — `bandlar` jadvalini SQL bilan sanab |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 11/11 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi atama darsda bor (bosh raqam — 0, maqsad, asosiy natija, OKR — 2, muammo → maqsad — 9, mehnat raqami — 4, foiz — 6, tajriba — 8, SQL — 10); North Star — tayanch bo'yicha faqat shu kartada.
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol).

## 14 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Loyihangizda endi OKR va birinchi tajriba bor.** (46)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Maqsad so'z bilan yoziladi, asosiy natija esa unga yetganingizni raqam bilan sanaydi.
- Endi siz bilasiz (bugungi asosiy fikr yuqorida — bu yerda takrorlanmaydi, T-048):
  - Bu darsda asosiy natija uch bo'lak bilan yozildi: nima sanaladi, hozir nechta, oy oxirida nechta.
  - Siz qilgan ish soni — mehnat raqami, u asosiy natija bo'lmaydi.
  - Tajriba OKR ning qismi emas: bu bitta o'zgarish, uni bitta asosiy natija bilan tekshirasiz.
  - Hozirgi raqamni bilmasangiz, uni o'ylab topmaysiz — «?» qo'yasiz.
- Uyga vazifa (karta, P-025): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: o'z loyihangiz · Nechta: 1 OKR · Muddat: keyingi darsgacha
  - ① Umami yoki Database ko'rsatadigan «Hozir» raqamlarini o'sha joydan olib yozing.
  - ② Ko'rsatmaydigan qatorda «?» qoldiring va yoniga yozing: uni sanash uchun qaysi harakat yozilishi kerak. (01-FILTR 5 — 2-darsga ko'prik)
  - ③ Maqsadingizni bir do'stingizga o'qib bering; tushunarsiz bo'lsa — qayta yozing.
  - Karta ostida (bitta kulrang qator): Umami'da raqam 0 bo'lsa — 0 yozing: bu ham hozirgi holat.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Hodisalar tizimi: har harakat jadvalga yoziladi».
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Bugungi asosiy fikr» faqat ScoreRing ostida (P-013); «Endi siz bilasiz» uni takrorlamaydi. Kartochkalarda ham yo'q (P-013).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Result Finder!** (4-ekran, birinchi urinishda xatosiz) — Besh qatordan asosiy natijalarni topdingiz
- **One Change!** (8-ekran, birinchi urinishda to'g'ri) — Tajribani u bevosita tegadigan asosiy natijaga uladingiz
- **OKR Writer!** (9-ekran, 5/5) — Loyihangizga keyingi oy OKR'ini yozdingiz
- **Own Count!** (10-ekran, «Bajardim») — Bosh raqamni Database'dan o'zingiz sandingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034); 6-ekran (surgich) nishonsiz.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Asosiy natijaning uch bo'lagi** — 1 Nima sanaladi: haftada band qilingan vaqtlar. · 2 Hozirgi raqam: 6. · 3 Oy oxiridagi raqam: 20. — Sinfga savol: 3-ekran savoli
- **5 · Mehnatmi yoki natijami** — 1 Bu misolda asosiy natija o'yinchilar nima qilganini sanaydi. · 2 E'lon, rasm, talab — siz qilgan ish, mehnat raqami. ·
  3 Ishlar asosiy natijani o'zgartirish uchun qilinadi. — Sinfga savol: 5-ekran savoli
- **7 · Foiz hisobi** — 1 Vaqtni 25 kishi tanladi. · 2 Ulardan 6 tasi band qildi. · 3 6 ni 25 ga bo'lib, 100 ga ko'paytirsak — 24 foiz. — Sinfga savol: 7-ekran savoli
- **11 · Bitta tajriba** — 1 Tajriba — bitta o'zgarish. · 2 U o'zi tegadigan asosiy natijaga ulanadi. · 3 Bir nechtasi birga o'zgarsa, nima yordam berganini ajratish qiyin. — Sinfga savol: 11-ekran savoli

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. «Maydon»da bosh raqam qaysi? (0, 2)
   - ✔ A — Haftada band qilingan vaqtlar
   - B — Haftada saytni ochganlar soni
   - C — Haftada vaqt tanlaganlar soni
   - D — Haftada chatga yozilgan e'lonlar
2. Qaysi gap maqsad bo'la oladi? (2)
   - A — Har haftada 20 ta vaqt band qilinsin
   - ✔ B — O'yinchilar maydonni oson band qilsin
   - C — Tugmaga tanlangan soatni yozib qo'yish
   - D — Band qilganlar foizi 40 ga yetib borsin
3. «Haftada band qilingan vaqtlar: hozir 6, oy oxirida 20» — bu nima? (2)
   - A — Maqsad qatori
   - B — Tajriba qatori
   - ✔ C — Asosiy natija
   - D — Mehnat raqami
4. Hozirgi raqamni bilmasangiz, nima yozasiz? (9)
   - A — Oy oxiridagi raqamni
   - B — O'ylab topilgan raqamni
   - C — Hozircha 0 raqamini
   - ✔ D — So'roq belgisini
5. Vaqtni 50 kishi tanladi, 20 tasi band qildi. Foiz qancha? (6, 7)
   - ✔ A — 40 foiz
   - B — 20 foiz
   - C — 30 foiz
   - D — 250 foiz
6. «Sayt uchun yozilgan yangi matnlar: 0 dan 5 ga» — qanday raqam? (4)
   - A — Bosh raqam
   - ✔ B — Mehnat raqami
   - C — Asosiy natija
   - D — Qadam foizi
7. «Maydon» tajribasida nima o'zgaradi? (8)
   - A — Saytning ranglari va shrifti
   - B — Vaqt kataklarining soni
   - ✔ C — Band qilish tugmasi matni
   - D — Ega sahifasidagi parol
8. Tajriba nega bitta o'zgarish bo'ladi? (8)
   - A — Bitta o'zgarishni tezroq qilsa bo'ladi
   - B — Bitta o'zgarishni yozish qisqaroq
   - C — Doskada tajriba uchun bitta qator bor
   - ✔ D — Yordam bergan narsa osonroq ajraladi
9. OKR qisqartmasi qaysi qismlarni bildiradi? (2)
   - ✔ A — Maqsad va asosiy natijalar
   - B — Bosh raqam va qadam foizlari
   - C — Muammo gapi va yechimlar
   - D — Tajriba va qilinadigan ishlar
10. Sinfdosh maqsadiga «haftada 30 buyurtma» deb yozdi. Nima qilasiz? (9)
    - A — Shunday qoldirasiz, maqsad tayyor bo'ldi
    - ✔ B — Raqamni asosiy natijaga o'tkazasiz
    - C — Raqamni tajriba qatoriga ko'chirasiz
    - D — Yoniga yana bitta raqam qo'shasiz
11. «Ikkinchi marta band qilganlar» nimani ko'rsatadi? (4 — yorliq «qaytib keldi»)
    - A — Saytni nechta odam ochganini
    - B — Vaqt tanlaganlar foizini
    - ✔ C — O'yinchilar qaytib kelganini
    - D — Ega nechta vaqt ochganini
12. Sinfdosh tajribasi bitta, lekin hech bir qatorga ulanmagan. Nima qilasiz? (8, 9)
    - A — Yana ikkita tajriba yozib qo'yasiz
    - B — Tajribani maqsad qatoriga ko'chirasiz
    - C — Tajribani doskadan o'chirib tashlaysiz
    - ✔ D — U tegadigan asosiy natijaga ulaysiz

- Arena yozuvlari — umumiy shablon (9-Modul 12-dars bilan bir xil).
- **Fon so'zlari** (R-008, {uz, ru}): arena — OKR · maqsad · asosiy natija · tajriba · foiz · bosh raqam · hafta · oy · band · raqam · uyga vazifa banneri — maqsad · raqam · hozir · oy oxiri (faqat so'z, emojisiz).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/8-Modull/PmOkrLesson.jsx`; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m8d1-okr-v1` · «Bir oyda qaysi raqamni o'stirasiz?».
2. Ekran turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s6/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s11 `QTest` (darsning `QuestionScreen` mantig'i, DE-203) ·
   s9 `QMustaqil` · s10 `QKod` (Neon varianti) · s12 `QNatija` (podium) · s13 `QKartochka` · s14 `QYakun`.
3. **`OkrDoska` — qolipda yo'q, yangi** (bitta vizual, 180-qonun): chap — uch ustun (oraliq yorlig'i, surgich, tugma maketi, «2 · qaytib keldi» belgisi); o'ng — OKR kartasi
   (kirish qatori «Muammo», maqsad, uchta asosiy natija qatori «hozir → oy oxirida» + chiziq, tajriba qatori + bog'lanish chizig'i); oy oxiri belgisi (kalendar varag'i + pufak); «Qilinadigan ishlar» ro'yxati.
   Qator holatlari (bo'sh · yozildi · joriy · xato · ulangan), `reduced-motion`. Telefon kengligida (393) chap va o'ng qism ustma-ust.
4. `MAYDON_OKR` — bitta manba (180-qonun): `hafta { ochdi: 40, vaqtniTanladi: 25, bandQildi: 6 }` · muammo gapi · maqsad · `natijalar` ×3 (`nima`, `hozir`, `oyOxirida`) · tajriba (`nima`, `natija: 2`) · `ISHLAR` (3). s0, s2, s4, s6, s8, s10 shundan o'qiydi.
5. s2 — `QBashorat` (1/2/3) → `QQadamlar` (3 bo'lak) → qator va pufak holatlari → yorliqlar «maqsad», «asosiy natija», sarlavha «OKR · keyingi oy»; `QIzoh` (OKR); `QTaxmin`; 40 s ipucha.
6. s4 — `QATORLAR` (5: `matn`, `joy: 'natija' | 'ish'`, `qator`) + saralash (bosish yoki sudrash); bashorat 1/2/3; to'g'ri joyda chap qismda belgi yonadi; 5/5 da yorliq «mehnat raqami»; nishon — birinchi urinish.
7. s6 — surgich 24…40 (qadam 4) → `bandQildi = vaqtniTanladi * foiz / 100`; bashorat 6/8/10; `QIzoh` sanoq sharti; 40 da 2-qator chizig'i oxirigacha chiziladi.
8. s8 — tugma maketi almashinuvi (bir marta, `reduced-motion` da yonma-yon); o'zgarish bo'lagi → qator ulash (3 nishon), `QXato` ×2, `QIzoh` (tajriba); nishon — birinchi urinish.
9. s9 — 5 bosqichli forma; `LS` kalit `pm-m8d1-okr` = `{ maqsad, natijalar: [{ nima, hozir, oyOxirida }] ×3, tajriba: { nima, natija }, savedAt }` (tayanch 9.8 — qat'iy; 01-FILTR 7);
   o'qiydi `pm-m7d3-muammo` (muammo gapi — 9-Modul 3-dars MD maydonlaridan; yo'q bo'lsa bitta maydon); tekshiruv funksiyasi (raqam bormi · «?» yoki son · son · tenglik · ish so'zlari · tajriba tanlovi) —
   PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi; artefakt-strip «OKR'im» (U-042).
10. s10 — Neon varianti: `NeonMaket` (chizilgan; 11-dars bilan bitta naqsh), darvoza (uch ustun), SQL bo'sh joy bilan (nusxasiz), son maydoni + tekshiruv, «Bajardim» qulfi (`ScreenLivePractice` naqshi — PM_DARS_ETALON 26); `koding: -1`, `PRACTICE_BASE+screen`.
11. Jonli ball: `INLINE_KEYS` = { s3: 2, s5: 0, s7: 3, s11: 1, saralash: -1, foiz: -1, tajriba: -1, practice: -1, koding: -1 }; `RECAPS` 3/5/7/11; `Q_LABELS`;
    `QUIZ_BANK` 12 (✔ 0/1/2/3 har biri 3 marta) + `set_quiz_keys`; `SCREEN_META` == screens; `SCREEN_INTENTS`.
12. `ACHIEVEMENTS` 4 · `FLASHCARDS` 11 · `RECAP` 4 · `HW_TOKENS` · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
13. Uyga vazifa — yakun kartasida (`HwCard` mazmuni shu MD dan; alohida `.homework.jsx` yo'q — tayanch 4).
14. App.jsx `m8-01` qatoriga `comp: PmOkrLesson` ulash (osti 01-FILTR 1 dan keyin: «bosh raqam, OKR va birinchi tajriba» — DE-205 ✓). App.jsx ga bu bosqichda tegilmaydi.
15. **REPO — yo'q** (PM darsi; `maydon` repo'ga tegilmaydi).
- Darvozalar: `npm run gates -- src/8-Modull/PmOkrLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

---

## TAYANCHGA SAVOL
1. **40 · 25 · 6 qaysi tizimdan?** O'z hodisalar tizimi 2-darsda quriladi, 1-darsda «Maydon»da faqat Umami bor. Umami bo'yicha sahifa ochilishi va hodisalar har xil sanaladi (9-Modul 6-dars A-5a),
   tayanch esa «har qadamda turli brauzerlar soni» deydi. Darsda manba aytilmadi — «Mentor misoli» yorlig'i va 6-ekranda sanoq sharti bitta qator. Manba (masalan «Mentor qo'lda sanagan») kerak bo'lsa — qo'shiladi.
2. **«band qildi 6» = «band qilingan vaqtlar 6».** Uch qadam brauzerlarni, bosh raqam vaqtlarni sanaydi. Bu misolda ular teng (har brauzer bitta vaqt band qilgan) deb oldim; 6-ekran xulosasi («bosh raqam 6 dan 10 ga») shu tenglikka suyanadi.
3. **Asosiy natijaning muddati.** 1-qator «haftada 6 → 20» ni «oyning oxirgi haftasida 20» deb o'qidim (O'qituvchi eslatmasi). 3-qator «0 → 5» — oy bo'yi jami deb oldim; tayanchda aytilmagan.
4. ✅ (tayanch 9.8: `oyOxirida`, `tajriba: { nima, natija }` — hal qilindi) **`pm-m8d1-okr` maydon nomlari.** `natijalar[].maqsad` — o'quvchi matnidagi «maqsad» atamasi bilan to'qnashadi (T-015); o'quvchi matnida «oy oxirida». Kodda nom qoladimi yoki `oyOxiri` bo'ladimi — 4 va 11-darslar o'qiydi.
   `tajriba` — tayanchda bitta maydon; 4-dars «gipoteza qaysi asosiy natijaga» o'qishi uchun `{ nima, natija }` (natija — 1…3) taklif qildim.
5. ✅ (GATE M M-q0 A — Neon SQL) **Kod ekrani 10-Modulda.** 9-Modul M-q6 «PM darslarida kod ekrani qoladi» — 10-Modul qarorlarida takrorlanmagan; men qoldirdim (PM_DARS_ETALON 3). Lekin PM_DARS_ETALON 26:
   ketma-ket PM darslari bir xil kod mexanikasini takrorlamaydi — `m7-12` ham JS-funksiya kompilyatori edi. Variant: shu kodni VS Code-topshiriq qilish yoki kod ekranini olib tashlash (darsning asosiy ishi — 9-ekran).
6. **«?» ruxsati.** Mustaqil ishda «Hozir» noma'lum bo'lsa «?» qo'yiladi va uyda Umami'dan to'ldiriladi. 4-dars «hozir» ni o'qisa, «?» ni qanday ko'rsatadi — kelishish kerak.
7. **Tajriba matni 1-darsda ochiladi.** «18:00 ni band qilish» — 4-darsning B varianti (tayanch 3). 1-darsda tajriba sifatida ko'rsatildi; 4-darsda gipoteza bo'lib qaytadi. Yashirish kerak bo'lsa — «tugmada tanlangan soat» qoladi, matnsiz.
8. **Mashq raqamlari (Mentor raqami emas).** 3, 5, 7-ekran testlari (mini-do'kon 12 → 30, 3 → 10 …; 20 kishidan 5), 4-ekran ish qatorlari (e'lonlar 0 → 4, rasmlar 0 → 3, talablar 0 → 6) va arena 5 (50 dan 20) —
   mashq uchun yozilgan; real fakt da'vo qilinmaydi. Arena 5 — tayanch raqamlaridan hosila (40 foiz × 50 = 20).
9. **Eslatma (11-ekran).** 9-Modul MVP «Keyin» qutisidan olindi; 10-Modulda qurilmaydi. Tajriba g'oyasi sifatida testda ishlatish mumkinmi?
10. **Ustun yorlig'i «Ochdi».** Tayanch shakli «ochdi»; 9-Modul 6-dars ustuni «Saytni ochdi» edi. Tayanchga moslab «Ochdi» yozdim — modulda bir xil bo'lishi uchun 2, 3-darslar bilan kelishish kerak.

## Shubhali joylar (ishonchim komil emas)
- s0 hook'da ikki «Qiziq fikr!» javobi «40 kishidan 6 tasi», «25 kishidan 6 tasi» — «kishi» so'zi; 6-ekranda sanoq sharti «brauzer». Tayanch foiz ta'rifi ham «kishi» deydi — qoldirdim.
- s2 da maqsad ta'rifi Mentor gapida (atamadan boshlanadi): «maqsad» kundalik so'z va maqsad gapi kartada ko'rinib turibdi, shuning uchun T-011 buzilmaydi deb hisobladim.
- s2 xulosasi ta'rifni so'zma-so'z takrorlaydi: «… sanaladigan natija» — «natija» so'zi ta'rif ichida ikki marta (tayanch shakli, o'zgartirmadim).
- s4 qoidasi «asosiy natija o'yinchilar qilganini sanaydi» — umumiy qonun emas (masalan sayt tezligi ham asosiy natija bo'lishi mumkin), shuning uchun xulosada «Bu misolda»; yakunda teskari shakl: «Siz qilgan ish soni — mehnat raqami».
- s4 «Agentga berilgan talablar» — mehnat raqami ekanini o'quvchi tez ko'rmasligi mumkin (talab — o'quvchining ishi). Yengilroq variant: «Saytga yozilgan yangi matnlar».
- s6 xulosasi «bosh raqam 6 dan 10 ga o'sadi» — faqat «vaqtni tanlaganlar 25 qolsa» rost; surgich shu shart bilan ishlaydi, bashorat savolida «yana 25 kishi» aytilgan.
- s7 savol konteksti nomsiz («20 kishi vaqt tanladi») — o'quvchi «Maydon»ning boshqa haftasi deb o'ylashi mumkin; raqam da'vo emas, faqat hisob.
- s8 xato izohi «Bosh raqam e'lonlardan ham o'sishi mumkin» — 4-ekrandagi e'lon qatoriga suyanadi; e'lon bosh raqamga to'g'ridan-to'g'ri ta'sir qilishi da'vo qilinmadi («mumkin»).
- s9 «ish so'zlari» detektori («rasm», «post», «e'lon») to'g'ri asosiy natijada ham chiqishi mumkin («rasmni ochganlar») — shuning uchun faqat yo'naltiradi.
- s11 B «O'yindan keyin o'yinchiga eslatma yuborish» — telefon raqamiga xabar yuborish 6-darsdagi maxfiylik mavzusiga tegadi; bu darsda tilga olinmadi.
- Arena 8 distraktorlari («tezroq qilsa bo'ladi», «yozish qisqaroq», «doskada bitta qator») — rost, lekin sabab emas (S-004); C vizualga suyanadi, o'quvchi uni sabab deb o'ylashi mumkin.
- «metrika» dastur mavzusida bor («maqsad → metrika → tajriba»), lekin o'quvchi matnida ishlatilmadi: «raqam» bilan yonma-yon sinonim bo'lib qolardi (T-014). Kerak bo'lsa — bitta kartochka: «Bosh raqam ham metrikami?» — «Ha, metrika — sanaladigan raqam».
- ✅ Kod ekrani — Neon SQL (GATE M M-q0 A).
- Modul raqamlari O'qituvchi eslatmalari va A-bo'limda topshiriq va 9-Modul MD laridagidek: «5-Modul» = `m5-14`, «8-Modul» = `m6-14` (kod raqamlari bilan aralash an'ana); o'quvchi matnida modul raqami yo'q.

---

## Qurilish (06.10.2026, F-1005-179) — kodda MD dan farqlar (ertalab ko'rikda tasdiqlanadi)
- Bitta vizual `OkrDoska` (manba `MAYDON_OKR`): chapda «O'tgan hafta · Mentor misoli» — uch ustun, odam-belgilari; o'ngda «OKR · keyingi oy» doskasi, ostida tajriba qatori va bog'lanish chizig'i.
- 0-ekran: yopiq kulrang OKR kartasi ko'rsatilmadi (bo'sh siluet — SABOQ 1, 4); ustunlarni ham bosish mumkin.
- 2-ekran: bo'lak tugmalari doska ostida bitta qatorda (alohida chap ustun emas — SABOQ 21).
- 4-ekran: saralash kartasi chap ustunda, ustunlar ostida; tugagach «Qilinadigan ishlar» bitta ixcham qator; joy faqat bosish bilan (sudrash yo'q).
- 8-ekran: 1-qatorga ulash nishonni kuydirmaydi, faqat 3-qator xato (01-FILTR 4 talqini).
- 9-ekran: kompyuterda forma chapda, doska o'ngda (telefonda MD tartibi); forma sarlavhasida bosqich raqami yo'q;
  **yangi matn:** bloklamaydigan tekshiruvdan keyin «Shunday qoldirsangiz — yana «Doskaga yozish»ni bosing.» (9-Modul naqshi).
- 10-ekran: doska yo'q, «Database'dan» belgisi Neon maketi ostida; Yordam «9-Modulda» → «o'tgan modulda» ✎ (T-036).
- 14-ekran: «Bugungi asosiy fikr» — «Endi siz bilasiz» ro'yxatining birinchi qatori. `lessonTitle.ru` — «Какое число вы увеличите за месяц?».

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (DE-205): App.jsx `m7-12` «Pitchingizda kimning hikoyasi bor?» → `m7-13` «Zaxira dars» → **`m8-01` «Bir oyda qaysi raqamni o'stirasiz?»** → `m8-02` «Hodisalar tizimi: har harakat jadvalga yoziladi»;
  reja chap matni App.jsx ostiga so'zma-so'z («bosh raqam, OKR va birinchi tajriba»).
- [x] Bitta misol-ip — «Maydon» (tayanch 1 raqamlari va OKR aynan); metafora yo'q; bitta vizual — `OkrDoska`. Ikkinchi misol faqat testda (mini-do'kon — 3, 5; nomsiz hisob — 7). Keys yo'q (tayanch 5).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 6, 8 (QTushuncha) + 0, 9, 10. «bosish, keyin matn-karta» naqshi yo'q: har harakatda kartada yoki ustunlarda narsa o'zgaradi.
- [x] O'lchov (python bilan sanaldi, qavsdagi sonlar): sarlavha 33–52 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa 61–90 · hook javobi 98–108 · xato izohi 30–59.
- [x] Atamalar oldingi darslar bilan bir xil (grep): bosh raqam, metrika — `src/pm/PmMetricsLesson.jsx` (m5-14) · uch qadam — 9-Modul 6-dars MD · mehnat raqami — 8-Modul 14-dars YAKUNIY · foiz — m5-14, lug'at.
  Yangi: OKR, maqsad, asosiy natija, tajriba — tayanch 2-bo'lim ta'riflari aynan. Siz-forma; uch qadam yorliqda ot-shaklda (o'tgan zamon), tugmalar siz-formada (§222/224).
- [x] Testlar: 4 variant, uzunlik yaqin (s3 36/35/38/40 · s5 42/44/42/45 · s7 6/7/6/7 · s11 43/42/43/42 — to'g'ri javob eng uzun emas); kalit so'z, strelka, qavs faqat to'g'rida emas
  («hozir», «oy oxirida» — ikki variantda; arena 4 va 7 da qo'shtirnoq olib tashlandi); ✔ o'rni C/A/D/B (yangi dars). Inkor-savol yo'q.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami — nishon, arena, podium — mustasno; ✓ ✗ → — belgilar, faqat vizual yorliqlarda); kafolat gaplari yo'q («har doim», «100%», «darrov», «albatta», «faqat» — o'quvchi matnida yo'q).
- [x] Ichki kodlar o'quvchi matnida yo'q («o'tgan modulda», «3-Moduldagi loyiha» — faqat O'qituvchi eslatmasi va MD izohlarida modul raqami); tarixiy voqea yo'q; «KOD» ro'yxati 15 band, REPO 0.
- [x] Karta T · P · S · PM ko'rildi: T-011 (OKR, maqsad, asosiy natija, tajriba — misoldan keyin; reja sarlavhasida OKR yo'q) · T-014/015 («maqsad», «natija», «tajriba», «qadam», «raqam» — bir ma'noda; «oy oxirida») ·
  T-020 · T-029/T-047 (Mentor ekrandagini ta'riflamaydi, natijani aytmaydi) · T-039 («loyihangiz» — 9-Modul MVP si bor; «OKR'ingiz» — 9-ekrandan keyin) · T-042 (ta'riflar so'zma-so'z) · T-043 («Bu misolda» — 4, 6) ·
  T-064 (ekran «ekran» deb atalmaydi) · P-002 · P-008 · P-012 (testlar ketma-ket emas: 3, 5, 7, 11) · P-013 · P-015 (reja ta'rif va kashfiyotni aytmaydi) · P-016 (hook javobi Mentorda yo'q) · P-025 · P-033 ·
  P-036 (8-ekran xulosasi chiziqni takrorlamaydi) · P-046 (9-ekran o'quvchi yozganidan) · P-048 · P-052 · P-062 (son bir marta) · P-064/181 (bashorat 2, 4, 6) · P-067 ·
  S-001 (savollar 8–10 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-018 (Umami izohi — 9-ekran) · S-019 · S-020 · S-026 · S-027 · §140-B (starter 0/3) · §144/145 ·
  PM-005 (2-tur) · PM-017 · PM-018 (odam roli bilan, halollik-izohi yo'q) · PM-020 · PM-027 (yangi uyga vazifa fayli yo'q) · PM-030 · PM-082/087 (kod — JS moduli materiali) · PM-108 (9-ekran tekshiruvi) · J-026.
- [?] Ochiq: TAYANCHGA SAVOL 5 (kod ekrani va PM_DARS_ETALON 26); 9-ekran 5 bosqichli forma telefonda (393 px) sig'ishi — vizual bosqichda ko'riladi (U-006).
