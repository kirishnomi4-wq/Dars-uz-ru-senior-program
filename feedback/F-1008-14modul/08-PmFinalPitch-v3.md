# 14-Modul (kod: `src/12-Modull`) · 8-dars (PM) «Final pitchingiz 5 daqiqaga tayyormi?» — MD v3 <!-- TAXMIN T20 -->

Fayl: `src/12-Modull/PmFinalPitchLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-08` · **12 ekran** (keyssiz PM — tayanch 4; 12-Modul 11-dars shakli: 2 tushuncha · test · 3 mustaqil ish · yakuniy test · podium · kartochkalar · yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
⚠️ **TAXMIN:** Qaror-0 javobi hali yo'q — `<!-- TAXMIN Tn -->` belgili qatorlar tavsiya (A) variantga tayanadi (ro'yxat — oxirida «TAXMIN belgilari»). Javob boshqacha bo'lsa, aynan shu qatorlar tuzatiladi.
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · ko'p elementli ish ketma-ket, bir vaqtda bitta katta karta (E 53) · yorliq input ichida (E 43) · ekranda ≤ 3 blok ·
maketda hech narsa kesilmaydi (E 41) · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 4-ekran — **C** (`correctIdx 2`) · 8-ekran — **A** (`correctIdx 0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 473–475, grep 08.10.2026, DE-205): `m12-07` «Investor ko'zi bilan: demo buzilmaydimi?» → **`m12-08` «Final pitchingiz 5 daqiqaga tayyormi?»** (osti: «pitch mashqi 2: taymer va savol-javob», `type: 'PM'`) → `m12-09` «Video-portfolio: 3 daqiqada o'zingiz va mahsulot». <!-- TAXMIN T20 -->
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn va aytilgan pitch: 5-darsdagi tuzatishlar qo'llangan bo'laklar, taymer bilan aytilgan pitch vaqti va uch hakam savoliga javob qisqasi; mustaqil ish majburiy (5, 6, 7-ekranlar). **Keyssiz** (tayanch 5). <!-- TAXMIN T18 -->
**Kod ekrani yo'q** (tayanch 4: «taymer 5:00 + savol-javob mashqi»). **REPO yo'q** (tayanch 3: `m14-dars-08-done` = `07-done`).
⚠️ Bu modulning qat'iy chegarasi (TAQIQLAR 1, sinf 17): **investitsiya so'ralmaydi** — Mentor pitchining Keyingi qadami tayanch 1.1 aynan (aniq so'rov, pul emas); savol-javobda ham pul summasi, ulush aytilmaydi; «tasdiq — to'lov emas».
⚠️ Modul raqami o'quvchi matnida — LMS raqami; kod raqami (`m12-08`, `src/12-Modull`) faqat fayl yo'lida. Shu moduldagi darslar — «5-darsdagi», «6-darsdagi» (07 pilot naqshi; TAYANCHGA SAVOL 11). «Demo Day», 13-dars, video-portfolio — o'quvchi matnida va'da qilinmaydi (T-038, tayanch 9.13).
Manba: `00-MODUL-TAYANCH.md` (1.0 · **1.1 — olti bo'lak, Mentor pitchi AYNAN** · 1.5 — Mentor varag'i · **1.8 — taymer 5:00, savol-javob, bank** · 1.14 — sonlar · 2 — atamalar · 3 — teg · 4 — PM 12 · 7 — 18 sinf · 8 — `pm-m12d1-pitch`, `pm-m12d5-varaq`, `pm-m12d8-final` · **9 — 1, 2, 3, 4, 6, 10, 12, 13, 14**) ·
`00-TAQIQLAR.md` · `00-NOMLAR.md` · `MD_AGENT_TOPSHIRIQ.md` · `MD_TOPSHIRIQ_2.md` (8-qator, 8-eslatma, «Pilotlardan saboq») · pilot MD lar `01-PmInvestorPitch-v3.md` (olti bo'lak, `HAKAM_SAVOL`, `OltiBolakSahna`) va `07-PmDemoTest-v3.md` + `NN-OZ-AUDIT.md` ·
13-Modul tayanchi (1.4 — «raqobat — tashkilotchi bugun o'yinni Telegram guruhida bepul yig'adi» · 1.9 — yozma tasdiq · 1.10 — jami 51 · 2, 7) · 11-Modul tayanchi 1 (intervyu: «Hozir qanday hal qilishadi») · 12-Modul tayanchi 116-qator (mahalla futbol guruhi — Telegram guruhi, 60 kishi) ·
namunalar (tuzilish va hajm; matn ko'chirilmadi): 12-Modul `12-PmGrowthPitch-v3.md` + `12-FILTR.md` (taymer, juftlik, varaq) · 12-Modul `11-PmPitchReview-v3.md` (12 ekranli PM shakli) · 11-Modul `16-PmPrototypePitch-v3.md` + `16-FILTR.md` (juftlik va yakka rejim).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «Tuzatishlar + taymer bilan final repetitsiya» → «Final pitch tayyor»; tayanch 1.8, 4): o'quvchi 5-darsdagi **tuzatishlar ro'yxatini** pitch bo'laklariga qo'llaydi — tuzatish eski gap o'rniga yoziladi (5-ekran) → <!-- TAXMIN T11 -->
   olti bo'lakli pitchni **taymer bilan 5:00** ichida sherigiga (yoki yakka — ovoz chiqarib) aytadi, Yechim ichida jonli demo bilan (6-ekran) → **savol-javob mashqi**: uch hakam savoli, har biriga bir daqiqagacha javob — son yoki fakt bilan, bilmasa «tekshirib aytaman» (7-ekran). <!-- TAXMIN T1, T11 -->
   Saqlanadi `pm-m12d8-final` (A-12; 13-dars o'qiydi). Natija besh holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab; ✓ va nishon — faqat birinchisida; «hech narsa qilinmagan» holati ham — E 54).
   Faqat shu A-bo'limda (o'quvchi matnida yo'q — T-038, tayanch 9.13): bu pitch 13-darsda Demo Day 8 formatidagi to'liq o'tishda yana aytiladi (tayanch 1.13).
2. **Bugungi asosiy fikr** (P-013; dars ichidagi o'q — yakunda KO'RSATILMAYDI, SABOQ E 50): Tuzatish eski gap o'rniga yoziladi; savolga javob — son yoki fakt, bilmasangiz «tekshirib aytaman». (98)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 9–12-Modul: **pitch** · **taymer** · **bo'lak** (pitchning qismi) · **jonli demo** · **fidbek** · **baholash varag'i** · **sherik** (juftlikdagi sinfdosh — 12-Modul 12-dars) · **halol gap** · **dalil** · **manba** · **Database** · **namuna akkaunt**.
   - 13-Modul: **Pro** · **«Doimiy o'yin»** · **test rejim** · **yozma tasdiq** (real to'lov emas, 1.9) · **taklif havolasi** · **raqobat** — «odam bugun shu ishni nima bilan qiladi» (4-dars; bugun bu so'z ishlatilmaydi, faqat O'qituvchi eslatmasida — A-5).
   - 14-Modul 1-dars: **hakam** (glosssiz — tayanch 9.12) · **savol-javob** — «Pitch 5 daqiqa; undan keyin hakamlar savol beradi, siz javob berasiz — bu savol-javob deyiladi.» · olti bo'lak **Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam** · **aniq so'rov** · **qoralama**. <!-- TAXMIN T1, T19 -->
   - 14-Modul 5-dars: **tuzatishlar ro'yxati** (3 band: qaysi bo'lak · nima o'zgaradi) · **hakam savoli** (varaqdagi bitta savol) · varaqdagi ✓ / ✗ va izoh. <!-- TAXMIN T11 -->
   - 14-Modul 6-dars: **demo stsenariysi** · **B reja** (60 soniyalik video) · Backend'ni **uyg'otish** (bitta so'rov). <!-- TAXMIN T8 -->
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar dars bo'yi so'zma-so'z (T-042):**
   - **final pitch** — «Tuzatishlar qo'llangan, 5 daqiqaga sig'adigan pitch — bu darsda final pitch deyiladi.» (3-ekran, 3-tugmadan keyin `QIzoh`; kartochka 1; yakun). Dars nomida turgan so'z — ta'rifi shu yerda tug'iladi; «bu darsda» — kurs qolipi (sinf 4). <!-- TAXMIN T1, T11 -->
   - **«tekshirib aytaman»** (oddiy ibora, atama emas) — javob bilinmaganda aytiladigan gap: son va fakt o'ylab topilmaydi (2-ekran, 3-kartadan keyin `QIzoh`; tayanch 1.8 aynan: «bilmasa «tekshirib aytaman»»).
   - **javob vaqti** — «Bu mashqda har javobga bir daqiqagacha vaqt bor: bir-ikki gap yetadi.» (2-ekran, 1-kartadan keyin `QIzoh`; tayanch 1.8 «har biriga ≤1 daqiqa»). «Bu mashqda» — kurs qoidasi, umumiy qonun emas.
   - **tuzatishni qo'llash** · yorliq **«qo'llandi»** — tuzatish bo'lak gapiga yozildi (3, 5-ekranlar). «Qo'llandi» — ish fakti; bo'lak qayta baholanmagan («endi yaxshi» degani emas — 12-FILTR 32 naqshi; TAYANCHGA SAVOL 7).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«tuzatish»** — faqat 5-darsdagi ro'yxat bandi va uni qo'llash; 7-darsdagi «Tuzatish qilindi» (agent ishi) bu darsda yo'q. «Tuzatilgan pitch» (12-Modul 11-darsi atamasi — boshqa ma'no) ishlatilmaydi; «final pitch» — A-4.
   - **«savol»** — hakam savoli (pitchdan keyin); ballik testlar eyebrow'da «Tekshiruv» (07 pilotidagi «1-savol» yorlig'i bu darsda yo'q — hakam savoli bilan aralashmasin). **«javob»** — hakam savoliga javob; javob qisqasi — 7-ekranda yoziladigan bir qator.
   - **«sherik»** — juftlikda hakam o'rnida tinglaydigan va savol beradigan sinfdosh (ixtiyoriy, ismsiz). «Tinglovchi» — uyga vazifadagi oila a'zosi yoki do'st. **«sinov»** — bu darsda yo'q (TAQIQLAR 5).
   - **Bo'lak nomlari** — atoqli, bosh harf bilan (tayanch 1.1). «Jamoa» faqat bo'lak nomi; futbol ma'nosi faqat Mentorning pitch va javob gaplari ichida (olam matni, T-008).
   - **«son»** — sanalgan miqdor; **«raqam»** — faqat «Raqamlar» bo'lagi nomida. **«fakt»** — tekshirsa bo'ladigan, kimdandir eshitilgan yoki ko'rilgan narsa (Mentor misolida — intervyudagi gap).
   - **«demo»** — Yechim ichidagi jonli demo (6-darsdagi demo stsenariysi bo'yicha). «demo o'tishi», «demo tekshiruvi» bu darsda tilga olinmaydi.
   - **Ishlatilmaydi:** Q&A (prozada) · progon · repetitsiya (bu darsda — «pitch mashqi», App.jsx osti) · «raqobat» (o'quvchi matnida; bank savoli o'z so'zi bilan) · «tuzatildi» (bo'lak belgisi sifatida) · Demo Day · investitsiya (summa) · «albatta», «darrov», «kafolat», «tez orada» (faqat detektor ro'yxatida) · «sir» · daftar.
6. **Mentor misoli — «Maydon Jamoa» final pitchi (bitta manba `JAMOA_PITCH`; tayanch 1.1 AYNAN + 5-darsdagi uch tuzatish — 9.2; sonlar 1.14; o'quvchiga «Mentor misolida»):** <!-- TAXMIN T1, T2, T3 -->

| Bo'lak (vaqt — «bu mashqda», tayanch 9.1) | Matn (o'quvchi ko'radi) | Holat |
|---|---|---|
| Muammo (≈40 soniya) | «O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» | 1.1 aynan |
| Bozor (≈30 soniya) | eski: «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» → **yangi:** «Mahalla futbolining Telegram guruhida — 60 a'zo; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» (116) | ✗ → qo'llandi (TAYANCHGA SAVOL 3) <!-- TAXMIN T2 --> |
| Yechim (≈1,5 daqiqa, jonli demo bilan) | «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» + jonli demo: 1-qurilmada «Qo'shilaman» → 2-qurilmada «8 / 10» o'rniga «9 / 10» | 1.1 aynan |
| Raqamlar (≈1 daqiqa) | eski: «51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.» → **yangi:** «51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro uchun to'lashga tayyorligini yozdi — real to'lov hali yo'q.» (154) | ✗ → qo'llandi (TAYANCHGA SAVOL 3) |
| Jamoa (≈30 soniya) | «Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.» | 1.1 aynan |
| Keyingi qadam (≈50 soniya) | eski: «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.» → **yangi:** «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Ilova hozir maydon egalariga xizmat qilmaydi — sizdan bitta so'rov: ular bilan tanishtiring.» (155) | hakam savolidan tuzatish → qo'llandi (05 MD 3-band; TAYANCHGA SAVOL 3) <!-- TAXMIN T3 --> |

   - Jami — 5:00 (40 + 30 + 90 + 60 + 30 + 50 soniya — tayanch 9.1); keyin savol-javob. Uch tuzatish — eski gap o'rniga (yangi son yo'q — 9.2); vaqt taqsimoti o'zgarmaydi. <!-- TAXMIN T1 -->
   - **Mentor varag'i (5-dars, tayanch 1.5 aynan; `JAMOA_VARAQ`):** ✗ Bozor — «60 kishi kim — o'yinchimi, guruhmi?» · ✗ Raqamlar — «Tasdiq — to'lovmi?» · qolgan to'rt bo'lak ✓ · hakam savoli — «Nega maydon egalari bunga pul to'lamaydi?».
     **Mentorning tuzatishlar ro'yxati** (05 MD `MENTOR_TUZATISH`, 3 band — 08.10 03:57 da o'qildi): Bozor — «60 kim ekanini aytaman: mahalla futbol guruhi a'zolari» · Raqamlar — «Tasdiq nima ekanini aytaman: yozma javob, pul emas» ·
     Keyingi qadam (hakam savolidan) — «Ilova maydon egalariga xizmat qilmasligini aytaman» (13-Modul 1.2: «Maydon Jamoa» bugun maydon egasiga xizmat qilmaydi). 05 da bo'laklar qayta yozilmaydi — uchalasi shu darsning 3-ekranida qo'llanadi.
   - **Hakam savollari (`HAKAM_SAVOL`, tayanch 9.3 AYNAN; kurs savollari, real hakamning gapi emas):** Muammo — «Bu muammo borligini qayerdan bilasiz?» · Bozor — «Bu mahsulot yana qancha odamga kerak?» · Yechim — «Mahsulot nima qiladi?» ·
     Raqamlar — «Bu son qayerdan va nimani sanaydi?» · Jamoa — «Buni kim qilyapti?» · Keyingi qadam — «Endi nima qilasiz?». **`SAVOL_BANK`** (savol-javob mashqi, 9.3) = shu oltita + tayanch 1.8 dagi «Odamlar hozir bu ishni nima bilan qiladi?» — 7 savol.
   - **Mentorning uch savoli va javobi (`MENTOR_JAVOB`, 2-ekran; olam matni — T-008; TAYANCHGA SAVOL 1, 2):**

| Savol (manba) | Mentor javobi (✔, «Mentor misolida») | Javob turi | Yonidagi noto'g'ri javob (✕) |
|---|---|---|---|
| «Bu son qayerdan va nimani sanaydi?» (1.8, 9.3 — Raqamlar) | «51 — ilovada ro'yxatdan o'tgan hisoblar, namuna akkauntlarsiz, Database'dan; 11 tasi — sinfdoshlarim.» (101; 13-Modul 1.10, 1.13: 44 + 7, Database) | son va manba | «Juda ko'p odam ishlatyapti — o'yinchilarga ilova yoqdi, ular uni hammaga maqtab, do'stlariga aytyapti.» |
| «Odamlar hozir bu ishni nima bilan qiladi?» (1.8, 9.3) | «Telegram guruhida «kim keladi?» deb yozishadi, javoblar xabarlar orasida yo'qoladi — o'yinchilar shunday degan.» (11-Modul tayanchi 1 «Hozir qanday hal qilishadi»; 13-Modul 1.4) | fakt va kim aytgani | «Hech narsa bilan — bunday ilova hali hech qayerda yo'q, shuning uchun o'yinchilar o'yinni yig'a olmaydi.» |
| «Bu mahsulot yana qancha odamga kerak?» (9.3 — Bozor) | «Mahalla futbol guruhida 60 a'zo bor; boshqa mahallalarni hali tekshirmaganmiz — tekshirib aytaman.» (1.1 Bozor gapidan) <!-- TAXMIN T2 --> | bor son va «tekshirib aytaman» | «Butun shahar futbolchilariga kerak — ular minglab, hammasi xuddi shunday qiynaladi, men bilaman.» |

     1.8 bankidagi «Keyingi olti oyda nima qilasiz?» — Mentor misoliga olinmadi: 12-dars nomi va mazmuni (sinf 12, T-038) va tayanch 9.3 (mashq havzasi) — TAYANCHGA SAVOL 1. Varaqdagi hakam savoli («Nega maydon egalari …») savol-javobga emas, Keyingi qadam tuzatishiga ketgan (05 MD). Noto'g'ri javoblar — Mentor aytmagan gap, faqat tanlov kartasi sifatida (rad etiladi).
7. **Sonlar (faqat tayanch 1.14 va 9.1):** 5 dan 4 (Muammo) · 60 (guruh a'zolari) · 6 (tashkilotchilar) · 51 · 11 · 7 · 3 (Raqamlar) · «8 / 10» → «9 / 10» (namuna o'yin) · vaqt: 5:00 va 40 · 30 · 90 · 60 · 30 · 50 soniya · javob vaqti 1:00. Boshqa son yo'q.
   Pro'ni yoqqanlar, Telegram'ni ulaganlar, Mentorning pitchni aytgan vaqti — **yo'q** (to'qilmaydi; sahnadagi taymer — reja, o'lchov emas). Ikkinchi misol (testlar, P-002) — kitob almashish ilovasi: «maktab chatida 120 kishi» (01 MD dagi mashq soni).
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** kitob almashish ilovasi (4, 8-ekranlar) — 01 MD testidagi olam bilan bir. Metafora yo'q. Keys yo'q.
9. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✗ › ✎ — belgilar. Hakam qiyofalari, telefon, taymer chizig'i — chizilgan (CSS/SVG), logotip yo'q; «Maydon Jamoa» — telefon maketida, o'z yashil rangida (11-Modul 9.62). O'yin qatlami (arena, nishon medali, podium) — mustasno.
   Kafolat so'zlari yo'q: «hakam albatta so'raydi», «pitch 5 daqiqaga sig'adi» — yo'q; sig'ishi — faqat o'quvchining taymeridan (P-046). Belgi-formula o'quvchi izohida va test variantida yo'q.
10. **Xavfsizlik va pul (sinf 9, 17; TAQIQLAR 1, 3):** sherik — ixtiyoriy, ismi hech qayerga yozilmaydi; sherik bo'lak haqida eslaydi, odam haqida baho bermaydi («zerikarli», «yomon» — yo'q; 12-Modul `BAHO_RE`) · podium — faqat test ballari, kim yaxshi gapirgani sanalmaydi ·
    savol-javobda pul summasi, ulush so'ralmaydi; «Endi nima qilasiz?» javobi — Keyingi qadam (aniq so'rov) · laptop ekranida Database va `.env` yopiq (6-ekran) · demo — real odamlar qo'shilmagan o'yinda (12-FILTR 22) · kalitga ism, telefon, sherik ismi yozilmaydi.
11. **Trek (sinf 11):** ikkala trekka bitta matn — «mahsulot» so'zi; jonli demo — 6-darsdagi demo stsenariysi bo'yicha: laptop brauzerida (mobil trek — brauzer ko'rinishi, web-trek — sayt), ikkinchi qurilma — telefon brauzeri (tayanch 9.6). Trek kaliti o'qilmaydi. <!-- TAXMIN T8 -->
12. **Saqlash kalitlari (tayanch 8):**
    - **o'qiydi:** `pm-m12d1-pitch` — `bolaklar` (5-ekran maydonlari, 6-ekran Sahnasi; yo'q bo'lsa — bo'sh maydon, Sahnada faqat bo'lak nomlari) · `pm-m12d5-varaq` — `tuzatishlar` (5-ekran kartalari), `varaq[].izoh` (✗ bo'lsa — 5-ekran kulrang qatori), `hakamSavoli` (7-ekran 1-savoli; TAYANCHGA SAVOL 5).
      Ikkalasi ham yo'q bo'lsa — dars yo'li bor: 5-ekranda o'quvchi o'zi bo'lak tanlaydi va yozadi; 7-ekranda uchala savol bankdan. Kalitlar null-xavfsiz o'qiladi (E 51).
    - **yozadi:** `pm-m12d8-final` = `{ vaqt: n (soniya), savollar: [{ savol, javob }] (3), tuzatildi: [bolak], savedAt }` (tayanch 8 aynan) — maydonlar shartnomasi:
      `vaqt` — 6-ekrandagi oxirgi «To'xtatish» dagi soniya; pitch aytilmagan — `null` (TAYANCHGA SAVOL 4) · `savollar` — 7-ekranda saqlangan javoblar, tartibda (`savol` — savol matni, `javob` — javob qisqasi ≤160; «Tekshirib aytaman» tugmasi bilan yozilgani shu matnda qoladi) ·
      `tuzatildi` — 5-ekranda matni o'zgarib «Saqlash» bilan qo'llangan bo'laklar id lari (`muammo` · `bozor` · `yechim` · `raqamlar` · `jamoa` · `keyingi`, takrorsiz) · `savedAt` — har saqlashda.
      **Taklif (tasdiqlansa — tayanch 8 ga; TAYANCHGA SAVOL 4):** `tur: 'sherik' | 'yakka'` (sinf 3 — real/mashq) · `bolaklar: { <bolak>: gap }` — qo'llangan bo'laklarning yangi matni (aks holda 13-dars tuzatilgan matnni ko'rmaydi: dars `pm-m12d1-pitch` ga yozmaydi).
      Kalitga ism, sherik ismi, telefon, havola yozilmaydi. Dars boshqa darsning kalitiga yozmaydi.
13. **Vaqt taqsimoti — 90 daqiqa (sinf 1 — reja, o'lchov emas):** kirish va reja (0, 1) ≈ 5 · savol-javob tushunchasi (2) ≈ 8 · tuzatish va taymer (3) ≈ 7 · 1-test (4) ≈ 3 · tuzatishlarni qo'llash (5) ≈ 15 ·
    juftlikda pitch (6; 2 × 5 daqiqa + tayyorlov) ≈ 20 · savol-javob mashqi (7; 2 × uch savol + yozish) ≈ 17 · yakuniy savol, podium, kartochkalar, arena (8–11) ≈ 12 → jami ≈ 87; 3 daqiqa zaxira.
    **Ulgurmasangiz:** 5-ekran — «Keyinroq» bilan o'tiladi, qolgan tuzatish — uyga vazifa ① · 6-ekran — juftlikda vaqt yetmasa, B o'quvchi pitchni uyda aytadi (uyga vazifa ②), dars bitta urinish bilan davom etadi ·
    7-ekran — kamida bitta savol, qolgani uyda (②) · yakun sarlavhasi holatga qarab (11-ekran). ⛔ Taqsimot — reja: «qur» pilotida 12–15 o'quvchi bilan taymer (6, 7-ekranlar); «sig'adi» deyilmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.1, 1.5, 1.6, 1.7):** 1-darsda olti bo'lakli pitch qoralamasi yozildi, 5-darsda guruh uni baholadi va tuzatishlar ro'yxati chiqdi, 6–7-darslarda demo tayyorlandi va tekshirildi. **Bugun: tuzatishlar pitchga qo'llanadi, pitch 5:00 ichida aytiladi va hakam savollariga javob mashq qilinadi.** <!-- TAXMIN T11 -->
- **12-Modul ko'prigi (takrorlanmaydi):** u yerda 5 daqiqalik taymer, juftlik va baholash varag'i o'rgatilgan. Bugun varaq to'ldirilmaydi — u 5-darsda bor; yangi narsa — pitchdan keyingi savol-javob va tuzatishni vaqtni buzmasdan qo'llash.
- **Dars ipi:** 0 — pitch tugadi, hakam sonning manbasini so'radi: bilmasangiz nima deysiz? → 2 — Mentorning uch savoli: son va manba · fakt · bor son va «tekshirib aytaman»; bir daqiqa → 3 — Mentor tuzatishlar ro'yxatidagi uch band eski gap o'rniga qo'llanadi, taymer 5:00 ga sig'adi (atama «final pitch») →
  4 — test: tuzatish qayerga yoziladi → 5 — o'z tuzatishlarini qo'llaydi → 6 — sherigiga 5 daqiqada aytadi → 7 — uch savolga bir daqiqadan javob beradi → 8 — yakuniy: bilganda fakt bilan, «tekshirib aytaman» — faqat bilmaganda → podium → kartochkalar → yakun.
- **Bitta vizual — `FinalSahna` (dars bo'yi, 163/180; bitta manba `JAMOA_PITCH` + `JAMOA_VARAQ` + `HAKAM_SAVOL` + `MENTOR_JAVOB` + o'quvchi ma'lumoti; 01 pilotidagi `OltiBolakSahna` va 12-Modul `TaymerChiziq` naqshi — dars ichida yoziladi, K-020):**
  - **o'ngda — olti bo'lak** (ustma-ust ixcham kartalar, bir balandlikda): bo'lak nomi va 1–2 qator. Holatlar: oddiy · joriy (accent chegara) · ✗ (`err` chet + izoh pufagi) · qo'llandi (eski gap ustidan chiziq va xira, yangi gap sirg'alib kiradi; neytral chet + yorliq «qo'llandi»).
  - **bo'laklar ostida — taymer chizig'i** 0–5:00, olti bo'lakka bo'lingan (`[40, 30, 90, 60, 30, 50]` s — tayanch 9.1; har bo'lak ostida nomi va «≈40 s» kabi yorliq); 5:00 dan oshsa chiziq o'ngga qizil davom etadi, yonida «+m:ss». <!-- TAXMIN T1 -->
    5:00 dan keyin alohida **savol-javob bo'lagi** — uch katak «1:00» (bo'sh — kulrang uzuq chiziq, U-041; joriy — accent; javob berilgani — ✓).
  - **bo'laklar ustida — hakamlar:** uchta real ko'rinishdagi qiyofa (bosh, soch, rangli kiyim — D 36), ismsiz; bitta savol pufagi (`HAKAM_SAVOL` yoki o'quvchining savoli); javob berilsa — pufak o'rnida yashil ✓.
  - **chapda — telefon** (≈170×272, barqaror; faqat 3-ekranda, boshqa ekranlarda yo'q): «Maydon Jamoa» (nom o'z rangida, logotip yo'q) — «O'yin» ekrani «Shanba, 18:00 · Mahalla maydoni · 8 / 10»; taymer Yechim bo'lagidan o'tganda «9 / 10» (son bir lahza kattalashib qaytadi).
  - Ishlatiladi: 0 (bo'laklar ixcham + taymer to'la + savol-javob bo'lagi joriy + hakam pufagi) · 1 (matnsiz skelet) · 2 (savol-javob rejimi, telefonsiz) · 3 (to'liq: telefon, bo'laklar, taymer) · 5 (o'quvchi bo'laklari, joriy karta bilan) · 6 (o'quvchi bo'laklari + jonli taymer) · 7 (savol-javob rejimi, o'quvchi savollari) · 4, 8 (javobdan keyin kichik ko'rinish).
    `prefers-reduced-motion` da yurish, sirg'alish va to'lqin yo'q — holat birdan qo'yiladi (DE-200). Telefon kengligida (393) bo'laklar telefon ostiga tushadi, hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Bashorat (E 42):** tanlangach yo'qolmaydi — savol va tanlangan javob ixcham qator bo'lib natijagacha turadi; natija — yashil xulosa qutisining birinchi kichik qatori: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …»; `QIzoh` — o'sha qutining oxirgi kichik qatori.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → karta joyidan joyiga uchadi (javob katakka, yangi gap bo'lakka) · yangi qator ~1 s yashil yonadi · taymer chizig'i to'lib boradi. Bezak-harakat (to'xtovsiz miltillash) yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Final pitchingiz 5 daqiqaga tayyormi?** (37) — dars nomi (DE-205) <!-- TAXMIN T20 -->
- Mentor: Pitch 5 daqiqada tugaydi — keyin hakam savol beradi. Javobni aniq bilmasangiz, nima deysiz? (91)
- Maket (chap; `FinalSahna` «savol» holati): o'quvchining olti bo'lagi ixcham — `pm-m12d1-pitch.bolaklar` dan birinchi qator (yo'q bo'lsa — `JAMOA_PITCH`, ustida kulrang yorliq «Mentor misoli»); taymer chizig'i 5:00 gacha to'la;
  savol-javob bo'lagi joriy (birinchi katak accent); ustida uchta hakam qiyofasi, birining pufagida: «Bu son qayerdan va nimani sanaydi?». Telefon bu ekranda yo'q (≤ 3 blok: maket · variantlar · javob).
- Variantlar (radio, o'ng; bir uzunlikda, bir shaklda — P-016):
  - «Taxminan shuncha» deb yaqin sonni aytaman (42)
  - Raqamlar bo'lagini boshidan qayta aytaman (41)
  - «Tekshirib aytaman» deb javob beraman (37)
- Javob:
  - «Tekshirib aytaman»: **Aynan!** Bilmagan son o'ylab topilmaydi: «tekshirib aytaman» deysiz, keyin aniq sonni manbasi bilan aytasiz. (106)
  - «Taxminan shuncha»: **Qiziq fikr!** Taxmin tez aytiladi. Lekin hakam sonning manbasini so'radi — taxminda manba yo'q. (93)
  - «Raqamlar bo'lagini»: **Qiziq fikr!** Son pitchda bor edi. Hakam esa uning manbasini so'radi — qayta aytish bunga javob bermaydi. (103)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi va hakam pufagi ostiga o'quvchining javob pufagi bo'lib tushadi (variant matni bilan); savol-javob bo'lagining birinchi katagi yonida kichik soat belgisi bir marta aylanadi —
  qaysi javob to'g'ri bo'lishi sahnada ochilmaydi (P-036); javob qatori chiqadi. Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; ism yo'q).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: 5-darsda guruh har pitchga bitta hakam savolini yozgan edi — sinfdan so'rang: «Shu savolga javobingiz tayyormi?» Kim nima deganini sanamang. Hakam savollari — kurs savollari, real hakamning gapi emas.
✎ Hook — o'quvchining o'z pitchi va hakam savoli (P-016: aniq vaziyat + harakat). «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067). Payoff boshqa variantlarni masxara qilmaydi: ular tez va oson — lekin hakam so'ragan manbaga javob bo'lmaydi. Javob Mentor gapida aytilmaydi; pufakdagi savol Mentor gapida takrorlanmaydi (T-047).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun pitchingizni 5 daqiqada aytasiz.** (38)
- Mentor: Pitch qoralamangiz va tuzatishlar ro'yxatingiz saqlangan bo'lsa, bugun ular o'zi ochiladi. (90)
- Chap — «Dars oxirida» + kulrang yorliq **pitch mashqi 2: taymer va savol-javob** (App.jsx osti so'zma-so'z, P-015) <!-- TAXMIN T11 -->
  + vizual: `FinalSahna` skeleti — oltita nomsiz bo'lak (kulrang chiziqlar) va taymer chizig'i; chiziq 5:00 gacha yuradi, so'ng uchta kichik «1:00» katak birma-bir yonadi. Matnsiz, telefonsiz — 2, 3-ekran kashfiyotini ochmaydi (P-015). <!-- TAXMIN T1 -->
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Hakam savoliga qanday javob berishni bilib olasiz · `savol-javob`
  - 02 · Tuzatishlar ro'yxatingizni pitchga qo'llaysiz · `tuzatish`
  - 03 · Pitchingizni taymer bilan 5 daqiqada aytasiz · `taymer`
  - 04 · Uch savolga bir daqiqadan javob berasiz · `hakam savoli`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz · Keyingi bosiladigan joy: «Boshlaymiz» (vizual tugagach halqada).
- O'qituvchi eslatmasi: Bugun baholash varag'i to'ldirilmaydi — u 5-darsda bor. Jonli demo uchun 6-darsdagi demo stsenariysi kerak bo'ladi: ikkinchi qurilma (telefon) dars boshida tayyor tursin.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011): «final» so'zi faqat dars nomida, ta'rifi 3-ekranda (0, 1-ekran Mentor gaplarida ham yo'q). «pitchingiz», «tuzatishlar ro'yxatingiz» — 1, 5-darsda yozilgan (T-039); bo'lmasa ham yo'l bor (5-ekran).

## 2 · Savol-javob  ← QTushuncha (markaziy; ketma-ket 3 karta — P-055, E 53)
- Eyebrow: Tushuncha · savol-javob
- Sarlavha: **Hakam savoliga qanday javob berasiz?** (36) — 0-ekran savoliga javob beradigan ekran (T-064)
- Mentor: Hakam javobni bir daqiqada eshitadi — har savol ostidagi ikki javobdan mosini bosing. (85)
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov, o'sish tartibida): **Mentor nechta savolga «tekshirib aytaman» deydi?** · Hech biriga · Bittasiga · Ikkitasiga — tanlangach ixcham qator; kartalar shundan keyin yoqiladi.
- Vizual (≤ 3 blok: sahna · javob kartalari · natija; telefonsiz — SABOQ 24): `FinalSahna` savol-javob rejimi — **tepada** uchta hakam qiyofasi va joriy savol pufagi · **o'rtada** savol-javob bo'lagi kattalashgan: uch katak «1:00» (joriy — accent) ·
  **pastda** joriy savolning ikki javob kartasi (oq, accent chegara; bir xil balandlikda). Kartalar ustida kulrang yorliq «Mentor misoli».
- Kartalar (navbat bilan; `MENTOR_JAVOB` — A-6; har juftda ✔ o'rni: 1 — ikkinchi · 2 — birinchi · 3 — ikkinchi):
  1. Pufak: **«Bu son qayerdan va nimani sanaydi?»** · kichik yorliq «Raqamlar: 51 foydalanuvchi»
     - «Juda ko'p odam ishlatyapti — o'yinchilarga ilova yoqdi, ular uni hammaga maqtab, do'stlariga aytyapti.»
     - ✔ «51 — ilovada ro'yxatdan o'tgan hisoblar, namuna akkauntlarsiz, Database'dan; 11 tasi — sinfdoshlarim.»
     ✔ → karta 1-katakka uchadi, katak ✓, ostida kulrang teg «son · manba»; hakam pufagi o'rnida yashil ✓. `QIzoh`: Bu mashqda har javobga bir daqiqagacha vaqt bor: bir-ikki gap yetadi. (69)
     ✕ → `QXato`: Hakam manbani so'radi — bu son qayerdan sanalgan? (49)
  2. Pufak: **«Odamlar hozir bu ishni nima bilan qiladi?»**
     - ✔ «Telegram guruhida «kim keladi?» deb yozishadi, javoblar xabarlar orasida yo'qoladi — o'yinchilar shunday degan.»
     - «Hech narsa bilan — bunday ilova hali hech qayerda yo'q, shuning uchun o'yinchilar o'yinni yig'a olmaydi.»
     ✔ → karta 2-katakka uchadi, katak ✓, teg «fakt · kim aytgan».
     ✕ → `QXato`: Ilova yo'q bo'lsa ham, o'yin hozir qanday yig'iladi? (52)
  3. Pufak: **«Bu mahsulot yana qancha odamga kerak?»** · kichik yorliq «Bozor: 60 a'zo» <!-- TAXMIN T2 -->
     - «Butun shahar futbolchilariga kerak — ular minglab, hammasi xuddi shunday qiynaladi, men bilaman.»
     - ✔ «Mahalla futbol guruhida 60 a'zo bor; boshqa mahallalarni hali tekshirmaganmiz — tekshirib aytaman.»
     ✔ → karta 3-katakka uchadi, katak ✓, teg «bor son · tekshirib aytaman». `QIzoh`: Javobni bilmasangiz, «tekshirib aytaman» deyiladi: son va fakt o'ylab topilmaydi. (81)
     ✕ → `QXato`: Boshqa mahallalar soni qayerdan? Tekshirilganmi? (48)
- **Harakat → Vizual o'zgarish:** javob kartasini bosish → to'g'ri bo'lsa karta kichrayib savol-javob bo'lagining joriy katagiga uchadi (~1 s yashil), ostiga teg yoziladi, hakam pufagi ✓ bo'lib keyingi savolga almashadi;
  xato → karta silkinadi, bir lahza `err` fon, bitta `QXato`. 3/3 dan keyin: kartalar yopiladi, savol-javob bo'lagi uch teg bilan butun enga.
- Natija (bitta blok — E 42; `tugadi`: harakat paneli yopiladi, sahna butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi — birinchi kichik qator taxmin: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: bittasiga».
- Xulosa: Bu misolda Mentor bilganini son va fakt bilan aytdi, bilmaganiga — «tekshirib aytaman». (87)
- Tugma (pastki): Avval belgilang → Javoblarni tanlang (N/3) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Hakam nimani so'radi — javob aynan shunga javob beradimi? (57)
- Keyingi bosiladigan joy: bashorat variantlari → joriy juftning ikki kartasi (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Sharp Answer! (uch savol birinchi urinishda).
- O'qituvchi eslatmasi: Uch javob — uch tur: son va manba · fakt va kim aytgani · bor son va «tekshirib aytaman». «Odamlar hozir bu ishni nima bilan qiladi?» — 13-Modulda «raqobat» deb o'tilgan savol (odam bugun shu ishni nima bilan qiladi); bugun o'quvchi matnida bu so'z yo'q.
  Mentor boshqa mahallalarni sanamagan — shuning uchun son to'qimaydi: bilganini (60) aytadi, qolganiga «tekshirib aytaman». «Tekshirib aytaman» — keyin haqiqatan tekshiriladi (uyga vazifa ③). Mentor varag'idagi «Nega maydon egalari …» savoli — 3-ekranda, Keyingi qadam tuzatishida. Hakam savollari — kurs savollari, real hakamning gapi emas.
✎ Sarlavha 0-ekran savoliga javob beradi. Uch savol — `SAVOL_BANK` dan (9.3). Noto'g'ri kartalar — Mentor aytmagan gap (tanlov uchun): umumiy maqtov · mutlaq to'qima · manbasiz katta son — uch turkum. Juftda ✔ o'rni almashadi — o'quvchi o'rin bo'yicha topmaydi.

## 3 · Tuzatish va taymer  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · tuzatish va taymer
- Sarlavha: **Tuzatishlar qo'shilsa, pitch 5 daqiqaga sig'adimi?** (50)
- Mentor: Tugmalarni birma-bir bosing va Mentor pitchi qanday o'zgarishiga qarang. (72)
- Bashorat (ballsiz; S-015 — bitta o'lchov: vaqt, o'sish tartibida): **Tuzatilgan Bozor bo'lagiga taymerda qancha vaqt qoladi?** · Avvalgidan kam · Avvalgidek · Avvalgidan ko'p — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi.
- Vizual (`FinalSahna` to'liq; ≤ 3 blok: sahna · tugmalar qatori · natija): **chapda** telefon («O'yin» ekrani, «8 / 10») · **o'ngda** olti bo'lak — Mentor misoli (A-6 eski matnlari, bir qatordan), ostida taymer chizig'i olti bo'lakli, bo'sh; tepada kulrang yorliq «Mentor misoli · Maydon Jamoa». <!-- TAXMIN T1 -->
- Tugmalar (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 Varaq · 2 Tuzatishlar · 3 Taymer
- **Harakat → Vizual o'zgarish:**
  1. «Varaq» → Bozor va Raqamlar bo'laklari `err` chet oladi, ustida varaq izohi pufakda: «60 kishi kim — o'yinchimi, guruhmi?» · «Tasdiq — to'lovmi?»; Keyingi qadam ustida kulrang hakam savoli pufagi «Nega maydon egalari bunga pul to'lamaydi?»; qolgan uch bo'lak burchagida kichik ✓. Pastda kulrang qator: Mentor misoli · 5-darsdagi baholash varag'i. (44)
  2. «Tuzatishlar» → uch bo'lakda (Bozor, Raqamlar, Keyingi qadam) eski gap ustidan chiziq tortiladi va xiralashadi, o'rniga yangi gap sirg'alib kiradi (A-6); `err` chet va pufaklar yo'qoladi, yorliq **qo'llandi**; taymer chizig'ida shu uch ulush bir lahza accent bilan yonadi — kengligi o'zgarmaydi. <!-- TAXMIN T2, T3 -->
     `QIzoh`: Bu misolda yangi gap eski gap o'rniga yozildi — bo'lak o'z vaqtida qoldi. (73)
  3. «Taymer» → taymer chizig'i 0 dan 5:00 gacha yuradi (tezlashtirilgan, ≈6 s), joriy bo'lak accent; Yechimdan o'tganda telefonda «8 / 10» → «9 / 10» (jonli demo); 5:00 dan keyin savol-javob bo'lagi (uch katak) yonadi va hakam qiyofalari shu bo'lak ustiga o'tadi. <!-- TAXMIN T1 -->
     `QIzoh`: Tuzatishlar qo'llangan, 5 daqiqaga sig'adigan pitch — bu darsda final pitch deyiladi. (85) — atama shu yerda tug'iladi (T-011) <!-- TAXMIN T1, T11 -->
  Natija (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: avvalgidek, 30 soniya».
  Ipucha (40 s): Yoqilgan tugmani bosing — Mentor pitchi qanday o'zgarishini ko'ring. (68)
- Xulosa: Bu misolda uch bo'lak tuzatildi, vaqt taqsimoti o'zgarmadi — jami yana 5 daqiqa. (80) <!-- TAXMIN T1 -->
- Tugma (pastki): Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar qatori yo'qoladi, sahna butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat → joriy tugma (to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Taqsimot — bu mashqda (tayanch 9.1): Muammo ≈40 s · Bozor ≈30 s · Yechim jonli demo bilan ≈1,5 daqiqa · Raqamlar ≈1 daqiqa · Jamoa ≈30 s · Keyingi qadam ≈50 s; o'quvchida boshqacha bo'lishi mumkin, jami 5 daqiqa.
  Tuzatish ko'pincha yangi gap qo'shib yoziladi — shunda bo'lak uzayadi va pitch 5 daqiqadan chiqadi. Mentor misolida yangi gap eskisining o'rnini oldi. Sahnadagi taymer — reja: Mentorning haqiqiy vaqti o'lchanmagan, son aytilmaydi.
  Raqamlar bo'lagida avval «yozma tasdiq» deyilgan edi — tinglovchi uni to'lov deb tushundi; tuzatishda Mentor odamlar nima qilganini oddiy so'z bilan yozdi (13-Modul: tasdiq — yozma javob, real to'lov emas).
  Keyingi qadamga hakam savolidan bitta gap qo'shilmadi — so'rov gapi qisqardi («mahalladagi maydon egalari» → «ular»), ilova maydon egalariga hozir xizmat qilmasligi o'sha gapga kirdi (13-Modul 1.2). Grafik pitchga qaytmaydi (tayanch 9.14).
✎ Varaq izohlari va hakam savoli — tayanch 1.5 aynan; tuzatishlar — 05 MD `MENTOR_TUZATISH`. Yangi gaplar — TAYANCHGA SAVOL 3. Bashoratda to'g'ri javob «Avvalgidek» — o'rta variant (S-015 zinapoyasi saqlangan).

## 4 · Tekshiruv  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · tuzatish (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Kitob ilovangiz pitchi: guruh Bozorga ✗ qo'ydi — «120 kishi kim?». Qanday tuzatasiz?** (12 so'z)
  - A — Bozor bo'lagini pitchdan butunlay olib tashlayman (49)
  - B — Eski gapga yana uch gap qo'shib, batafsil yozaman (49)
  - ✔ C — Eski gap o'rniga ularning kimligini aniq yozaman (48)
  - D — Gapni qoldirib, savol-javobda tushuntirib beraman (49)
- Kalit: **C** (index 2). To'rttasi bir shaklda (birinchi shaxs, «-aman» bilan tugaydi); qo'shtirnoq, tire va qavs hech birida yo'q; «gap» B, C, D da; savoldagi son (120) javobda yo'q (S-019).
  Distraktorlar uch turkumda (sinf 8): A — tuzilma (bo'lakni tashlash) · B — vaqt (gap qo'shish, bo'lak uzayadi) · D — tuzatmaslik (savol-javobga surish).
- To'g'ri izohi: Tuzatish eski gap o'rniga — bo'lak o'z vaqtida qoladi. (54)
- Xato izohlari (≤60):
  - A: Bozor kerak: hakam «qancha odamga kerak?» deb so'raydi. (55)
  - B: Uch gap qo'shilsa, bo'lak o'z vaqtiga sig'adimi? (48)
  - D: Varaqdagi ✗ pitchning o'zida tuzatiladi. (40)
  - (umumiy) Mentor Bozor bo'lagini qanday tuzatgan edi? (47)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): kitob ilovasining Bozor bo'lagi — eski gap ustidan chiziq, o'rniga «Maktab chatida — 120 a'zo …», ostida taymer ulushi kengligi o'zgarmagan.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): «ularning kimligi» — 01 MD dagi kitob ilovasi Bozor gapi («Chatda 120 kishi …») ning aniqlashtirilishi (P-002, mashq soni; javobdan keyingi vizualda — «Maktab chatida — 120 a'zo …»). D — savol-javobda tushuntirish mumkin, lekin dars qoidasi bo'yicha varaqdagi ✗ pitchning o'zida tuzatiladi: aks holda bo'lak noaniq qoladi (S-004).

## 5 · Tuzatishlaringiz  ← QMustaqil (USTAXONA 1/3 — bittadan karta; SABOQ 9, 13, 17, 29; E 43, E 53)
- Eyebrow: Mustaqil ish · tuzatishlar
- Sarlavha: **Tuzatishlar ro'yxatingizni pitchga qo'llang.** (44)
- Mentor (`pm-m12d5-varaq` bor): Har kartadagi tuzatishni o'qing va bo'lak gapini eski gap o'rniga qayta yozing. (79)
  Mentor (yo'q): Tuzatmoqchi bo'lgan bo'lakni tanlang va gapini eski gap o'rniga qayta yozing. (77)
- Kirish (P-046): `pm-m12d5-varaq.tuzatishlar` (3 band) — har band bitta karta; bo'lak gapi — `pm-m12d1-pitch.bolaklar[bolak]` (tahrirlanadi); shu bo'lak varaqda ✗ va `izoh` bo'lsa — kulrang qator.
  - Varaq yo'q: kulrang qator «Tuzatishlar ro'yxatingiz topilmadi — tuzatmoqchi bo'lgan bo'lakni tanlang.» (74) + olti bo'lak chiplari (≤ 3 tanlanadi) → tanlangan har bo'lakka karta (tuzatish qatorisiz; kulrang: Bu bo'lakda nimani aniqroq aytish mumkin?).
  - Pitch yo'q: maydon bo'sh, placeholder — `HAKAM_SAVOL[bolak]`; «Oldin» qatori va uzunlik tekshiruvi yo'q.
- **Tepada — ixcham chiziq «Tuzatishlar · n / N»:** bo'lak nomi · «qo'llandi» yoki «keyinroq» (bo'sh uzuq qatorlar yo'q — SABOQ 17).
- **Markazda — bitta katta karta «Tuzatish n / N»:** sarlavha — bo'lak nomi; kulrang qator 1 — tuzatish (`nima`); kulrang qator 2 (bo'lsa) — «Varaqda: {izoh}»; maydon — bo'lak gapi (yorliq input ichida — E 43: bo'lak nomi belgisi + placeholder);
  belgi sanog'i «n / 160» va yonida kulrang «oldin: {m}» (eski gap uzunligi); tugmalar bir qatorda: «Saqlash» · ikkinchi «Keyinroq» · o'ngda «Yordam». «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; «yo'naltiradi» — ikkinchi «Saqlash» bilan o'tadi, «bloklaydi» — o'tmaydi):
  - matn o'zgarmagan (bloklaydi): Matn o'zgarmadi — tuzatishni qayta o'qing. (42)
  - maydon bo'sh (bloklaydi): Bo'lakka bitta-ikkita gap yozing. (33)
  - 160 belgidan uzun (bloklaydi): 160 belgidan oshdi — bitta gapni qisqartiring. (46)
  - yangi matn eskisidan 40 belgidan ko'p uzun (yo'naltiradi): Gap uzaydi — eski gapning bir qismini olib tashlang. (52)
  - Keyingi qadam: «investitsiya», «pul» (alohida so'z — «pullik» emas), «so'm», «dollar», «ulush», «summa», «million», «mln» (yo'naltiradi; 01 detektori): Bu kursda pul so'ralmaydi — bitta aniq so'rov yozing. (53) <!-- TAXMIN T3 -->
  - har bo'lak: `VADA_RE` — «tez orada», «albatta», «yetamiz», «aniq bo'ladi» (yo'naltiradi; 12-Modul): Bu va'da — keyingi haftada aynan nima qilasiz? (46)
  - Raqamlar: «tasdiq» bor, «to'lov» yo'q (yo'naltiradi): Tasdiq hali to'lov emas — buni gapda ayting. (44)
  - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (bo'lakka qarab; «qayerga qarash» va Mentor misoli):
  - Bozor — Mentor misolida: «Mahalla futbol guruhida — 60 kishi» o'rniga «Mahalla futbolining Telegram guruhida — 60 a'zo». <!-- TAXMIN T2 -->
  - Raqamlar — Mentor misolida: «Pro'ga yozma tasdiq berdi — bu hali to'lov emas» o'rniga «Pro uchun to'lashga tayyorligini yozdi — real to'lov hali yo'q».
  - Keyingi qadam — Mentor misolida: «Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring» o'rniga «Ilova hozir maydon egalariga xizmat qilmaydi — sizdan bitta so'rov: ular bilan tanishtiring». <!-- TAXMIN T3 -->
  - boshqa bo'laklar: Varaqdagi izoh nimani so'ragan bo'lsa, shuni eski gap o'rniga aniq yozing.
  - Har kartada oxirgi qator: Sonlaringiz o'zingizniki — yangi son o'ylab topilmaydi. (55)
- **Harakat → Vizual o'zgarish:** maydonga yozish → belgi sanog'i o'zgaradi, «oldin» dan oshsa sanoq accent rangga o'tadi; «Saqlash» → karta kichrayib tepadagi chiziqqa uchadi (bo'lak nomi yonida «qo'llandi» ~1 s yashil), pastdan keyingi karta kiradi;
  «Keyinroq» → chiziqda kulrang «keyinroq». N/N da karta yopiladi: `FinalSahna` — olti bo'lak o'quvchi matni bilan (uzun matn «…» bilan qisqaradi, karta cho'zilmaydi — SABOQ 29), qo'llangan bo'laklarda yorliq «qo'llandi»; ostida taymer chizig'i (bo'sh).
- Xulosa (o'quvchi ma'lumotidan, P-046; kamida bitta qo'llangan): {n} ta tuzatish pitchingizga qo'llandi. (≈39)
- Xulosa (hech biri qo'llanmagan): Tuzatishlar hali qo'llanmadi — uyga vazifada qoladi. (52)
- Tugma (pastki): Kartalarni ko'ring (n/N) → Davom etish (har karta «Saqlash» yoki «Keyinroq» bilan o'tgach; jonli darsda Mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → «Saqlash» (matn o'zgargach halqada) → keyingi karta → «Davom etish».
- Saqlanadi: `pm-m12d8-final.tuzatildi` (+ taklif `bolaklar` — A-12) har «Saqlash» da, `savedAt` yangilanadi.
- Artefakt-strip (U-042): shu ekrandan — «Final pitch · qo'llandi n» (ixcham); 6, 7-ekranlarda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon: Fix Applied! (kamida bitta tuzatish «Saqlash» bilan qo'llangan va uzunlik ogohlantirishisiz).
- Mentor rejimi: forma o'rniga Mentor misoli (A-6 uch tuzatish, eski va yangi gap yonma-yon). Mentor statistikasi: «Tuzatish qo'llaganlar».
- O'qituvchi eslatmasi: ≈15 daqiqa. Tuzatish — 5-darsdagi ro'yxat bandi; o'quvchi unga qo'shilmasa — «Keyinroq» bosadi va siz bilan qisqa gaplashadi, majburlanmaydi. Eng ko'p xato: yangi gap eskisining ustiga qo'shiladi (bo'lak uzayadi) · Raqamlarga yangi son to'qiladi.
  Pitch va kalitda ism, maktab, telefon yo'q.

## 6 · 5 daqiqa  ← QMustaqil (USTAXONA 2/3 — juftlik; yakka rejim bor)
- Eyebrow: Juftlikda ish · taymer · yakka rejimda: Mustaqil ish · taymer
- Sarlavha: **Final pitchingizni sherigingizga 5 daqiqada ayting.** (51) · yakka rejimda: **Final pitchingizni taymer bilan 5 daqiqada ayting.** (50) <!-- TAXMIN T11 -->
- Mentor: Ikki qurilmada demo yo'lini ochib qo'ying, keyin «5 daqiqani boshlash»ni bosib, sherigingizga ayting. (101)
  Yakka rejimda: Ikki qurilmada demo yo'lini ochib qo'ying, keyin «5 daqiqani boshlash»ni bosib, pitchni ovoz chiqarib ayting. (109)
- **Tepada — «Pitchdan oldin»** (bitta kulrang blok, to'rt qator; bosilmaydi, katakchasiz — korpus §19):
  · Demo — 6-darsdagi demo stsenariysi bo'yicha: laptop brauzerida, ikkinchi qurilma — telefon brauzerida. <!-- TAXMIN T8 -->
  · Backend oldindan uyg'otilgan: bitta so'rov yuborildi.
  · Demo — real odamlar qo'shilmagan o'yinda; demodan keyin holat boshiga qaytariladi.
  · Laptopda Database va `.env` yopiq — ekranni hakam ko'radi.
- **Markazda — `FinalSahna`:** o'quvchining olti bo'lagi (5-ekrandan, ixcham; «qo'llandi» yorliqlari bilan) va taymer chizig'i (olti bo'lakli, `[40, 30, 90, 60, 30, 50]` s). <!-- TAXMIN T1 -->
  Taymer tugmalari: **5 daqiqani boshlash** · **Keyingi bo'lak** (sherik bosadi; ixtiyoriy) · **To'xtatish** · **Qaytadan**. 5:00 dan keyin taymer to'xtamaydi — qizil «+m:ss».
  Juftlik yo'rig'i (bir qator): Avval A gapiradi, B taymerga qarab bo'lak tugaganda «Keyingi bo'lak»ni bosadi; keyin almashasiz. (96)
  Demo ochilmasa (bitta kulrang qator, P-026): Demo ochilmasa — B reja videosini ko'rsating. (45)
- **Harakat → Vizual o'zgarish:** «5 daqiqani boshlash» → chiziq to'lib boradi, rejadagi joriy bo'lak accent bilan yonadi · «Keyingi bo'lak» → o'sha bo'lak ostiga uning haqiqiy vaqti yoziladi («0:52» kabi), rejadagi ulushdan oshgan bo'lsa — bo'lak `err` chet oladi, keyingisi joriy bo'ladi ·
  «To'xtatish» → chiziq to'xtaydi, ostida «Vaqt: m:ss»; 5:00 dan oshgan bo'lsa chiziq qizil davomi bilan qoladi · «Qaytadan» → chiziq bo'shaydi, oldingi vaqt kulrang qatorda qoladi.
- Vaqt qatori (`QIzoh`, faqat «Vaqt» 5:00 dan oshgan bo'lsa): Vaqt 5 daqiqadan oshdi — eng uzun bo'lakdan bitta gapni oling. (62)
- Xulosa (o'quvchi ma'lumotidan, P-046; vaqt ≤ 5:00): Pitch {m:ss} da aytildi — 5 daqiqaga sig'di. (≈44)
- Xulosa (vaqt > 5:00): Pitch {m:ss} da aytildi — 5 daqiqadan {+m:ss} oshdi. (≈52)
- Tugma (pastki): 5 daqiqani boshlang → Davom etish (kamida bitta «To'xtatish» dan keyin; jonli darsda — `optionalLive`).
- Keyingi bosiladigan joy: «5 daqiqani boshlash» (halqa) → «To'xtatish» → «Davom etish».
- Saqlanadi: `pm-m12d8-final.vaqt` — oxirgi «To'xtatish» dagi soniya (A-12). Bo'lak vaqtlari kalitga yozilmaydi — faqat ekranda.
- Nishon: Five Minutes! (vaqt ≤ 5:00).
- Mentor rejimi: proyektorda katta taymer va olti bo'lakli chiziq; vaqt qolsa — 1–2 ko'ngilli guruh oldida aytadi (90 daqiqa hisobida yo'q). Mentor statistikasi: «Pitchni aytganlar» · «5 daqiqaga sig'ganlar».
- O'qituvchi eslatmasi: Taymerni sinf bo'ylab bir vaqtda boshlating: avval hamma A, keyin hamma B (2 × 5 daqiqa + tayyorlov ≈ 15–20). Backend uyg'onishini taymerdan oldin kuting: avval hamma demo yo'lini ochadi, keyin «5 daqiqani boshlash».
  12–15 o'quvchi bir vaqtda ochganda sinf tarmog'i sekinlashishi mumkin — demo ochilmasa B reja videosi. Sherik bo'lak haqida eslaydi, odamga baho bermaydi. Yakka rejimda o'quvchi «Keyingi bo'lak»ni o'zi bosadi yoki bosmaydi — umumiy vaqt yetadi.

## 7 · Savol-javob mashqi  ← QMustaqil (USTAXONA 3/3 — juftlik, bittadan karta; yakka rejim bor)
- Eyebrow: Juftlikda ish · savol-javob · yakka rejimda: Mustaqil ish · savol-javob
- Sarlavha: **Uch hakam savoliga bir daqiqadan javob bering.** (46) <!-- TAXMIN T11 -->
- Mentor: Sherigingiz savolni o'qib, «1 daqiqani boshlash»ni bosadi — siz ovoz chiqarib javob berasiz. (92)
  Yakka rejimda: Savolni oching, «1 daqiqani boshlash»ni bosing va ovoz chiqarib javob bering. (77)
- **Savollar (uchta, bittadan; TAYANCHGA SAVOL 5):** 1-savol — `pm-m12d5-varaq.hakamSavoli` (bo'lsa; ustida kulrang yorliq «5-darsdagi varaqdan») · 2, 3-savol — sherik `SAVOL_BANK` dan tanlaydi (7 chip; tanlangani yopiladi, takrorlanmaydi) ·
  yakka rejimda — dars tanlaydi: karta yopiq turadi, «Savolni ochish» bosilganda bankdan tasodifiy, takrorsiz. `hakamSavoli` yo'q bo'lsa — uchalasi bankdan.
- **Tepada — ixcham chiziq «Savol-javob · n / 3»** (savol qisqa «…» · ✓).
- **Markazda — bitta katta karta «Savol n / 3»:** savol (katta) · taymer 1:00 (pastga sanaydi) · tugmalar «1 daqiqani boshlash» · «To'xtatish» → maydon «Javobingiz qisqasi» (yorliq input ichida — E 43; placeholder `Son yoki fakt — qayerdan bilasiz?`; «n / 160») ·
  ikkinchi tugma **«Tekshirib aytaman»** → maydon oxiriga « Tekshirib aytaman: {nimani}» qo'shiladi, `{nimani}` accent bilan ajralgan · o'ngda «Yordam» · «Saqlash» (o'ngda).
- **O'ngda — `FinalSahna` savol-javob rejimi:** uch katak «1:00» (joriy — accent, to'lib boradi), ustida hakam qiyofasi va joriy savol pufagi.
- 1:00 dan oshsa: taymer qizil «+m:ss» bilan davom etadi; `QIzoh`: Javob bir daqiqadan oshdi — bitta son yoki faktda to'xtang. (59)
- Tekshiruv (`QXato`, ≤60):
  - maydon bo'sh (bloklaydi): Javobingizni bir qatorda yozing. (32)
  - `{nimani}` qolgan (bloklaydi): {nimani} o'rniga nimani tekshirishingizni yozing. (49)
  - «menimcha», «taxminan», «ko'p odam», «hamma», «hech kim» bor, raqam ham, «Tekshirib aytaman» ham yo'q (yo'naltiradi): Bu taxmin — bilmasangiz, «Tekshirib aytaman»ni bosing. (54)
  - `VADA_RE` (yo'naltiradi): Bu va'da — bugun nimani aniq bilasiz? (37)
  - savol «Endi nima qilasiz?», javobda pul so'zlari (yo'naltiradi; 5-ekran ro'yxati): Bu kursda pul so'ralmaydi — bitta aniq so'rov ayting. (53) <!-- TAXMIN T3 -->
  - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam: Javob — bir-ikki gap: son yoki fakt va uni qayerdan bilganingiz. Bilmasangiz — «Tekshirib aytaman» va nimani tekshirishingiz.
  Mentor misolida: «Bu son qayerdan va nimani sanaydi?» — «51 — ilovada ro'yxatdan o'tgan hisoblar, namuna akkauntlarsiz, Database'dan; 11 tasi — sinfdoshlarim.»
  «Endi nima qilasiz?» savoliga javob — Keyingi qadam bo'lagingiz: keyingi ish va bitta aniq so'rov. <!-- TAXMIN T3 -->
- **Harakat → Vizual o'zgarish:** «1 daqiqani boshlash» → kartadagi taymer va sahnadagi joriy katak to'lib boradi · «To'xtatish» → katak ostiga vaqt yoziladi («0:42» kabi), maydon ochiladi · «Tekshirib aytaman» → matn maydonga sirg'alib yoziladi ·
  «Saqlash» → javob qisqasi katakka uchadi, katak ✓ (≤ 1:00 — yashil; oshgan — neytral, yonida «+m:ss»); hakam pufagi keyingi savolga almashadi. 3/3 da karta yopiladi: `FinalSahna` — olti bo'lak va savol-javob bo'lagi uch javob bilan.
- Xulosa (o'quvchi ma'lumotidan, P-046): Uch savolga javob berdingiz: {a} tasi bir daqiqaga sig'di. (≈58)
- Tugma (pastki): Savollarga javob bering (n/3) → Davom etish (kamida bitta saqlangach; jonli darsda — `optionalLive`).
- Keyingi bosiladigan joy: savol chipi (sherik) yoki «Savolni ochish» (yakka) → «1 daqiqani boshlash» → «To'xtatish» → maydon → «Saqlash» → keyingi savol → «Davom etish».
- Saqlanadi: `pm-m12d8-final.savollar` (A-12) har «Saqlash» da.
- Nishon: Three Answers! (uch javob saqlangan va har biri 1:00 ga sig'gan).
- Mentor rejimi: proyektorda `SAVOL_BANK` va katta 1:00 taymer; ko'ngilli bir savolga javob beradi. Mentor statistikasi: «Uch savolga javob berganlar».
- O'qituvchi eslatmasi: ≈17 daqiqa (juftlikda 2 × uch savol va yozish). Sherik savolni ovoz chiqarib o'qiydi va javobni baholamaydi. «Tekshirib aytaman» — xato emas: bilmagan sonni to'qishdan yaxshiroq.
  O'quvchi pitchni qayta aytishni boshlasa — taymer bir daqiqada to'xtatadi. «Endi nima qilasiz?» savoliga javobda pul summasi aytilmaydi — Keyingi qadamdagi aniq so'rov.

## 8 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q — SABOQ 6)
- Lead (bitta gap, S-002): Kitob almashish ilovangiz haqida sinfdoshlardan so'ragansiz. (60)
- Savol: **Hakam «Odamlar hozir bu ishni nima bilan qiladi?» desa, nima deysiz?** (11 so'z)
  - ✔ A — «Chatda so'rab topishadi, sinfdoshlar aytgan» deyman (52)
  - B — «Tekshirib aytaman, hozircha buni bilmayman» deyman (51)
  - C — «Hech narsa bilan, bunday ilova hali yo'q» deyman (49)
  - D — «Ilovamiz hammasidan qulay, sinfdoshlar aytgan» deyman (54)
- Kalit: **A** (index 0). To'rttasi bir shaklda (««…» deyman», ichida vergul); «sinfdoshlar» A va D da (lead so'zi faqat to'g'rida emas — §205); uzunliklar — «O'lchov».
  Distraktorlar uch turkumda: B — qoida noto'g'ri joyda (bilgan narsaga «tekshirib aytaman») · C — mutlaq to'qima · D — maqtov, savolga javob emas.
- To'g'ri izohi: Bilgan faktingiz va uni kimdan bilganingiz aytiladi. (52)
- Xato izohlari (≤60):
  - B: Siz sinfdoshlardan so'ragansiz — javobni bilasiz. (49)
  - C: Ilova yo'q — lekin kitobni hozir qanday topishadi? (50)
  - D: Bu maqtov — hakam hozirgi yo'lni so'radi. (41)
  - (umumiy) Bilgan narsangiz bo'lsa — fakt va manbasi bilan. (49)
- Javob topilgach (kichik, savol ostida): Mentorning shu savolga javobi ixcham — «Telegram guruhida «kim keladi?» deb yozishadi … — o'yinchilar shunday degan.» (2-ekran, 2-karta).
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): ikki qoida birga — javob fakt bilan va «tekshirib aytaman» faqat bilmaganda (S-008: B hayotda «xato» emas, lekin bu holatda o'quvchi javobni biladi — lead shuni aytadi). Ikkala trekka to'g'ri. Kalit ibora 4-ekran bilan takrorlanmaydi.

## 9 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 2 savol (4, 8); 5–7-ekranlar «Saqlash» — mentorga signal (`PRACTICE_BASE`, ball yo'q). Kim yaxshi pitch aytgani sanalmaydi — podium faqat test ballari (TAQIQLAR 3).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 4 — «1 — Tuzatish qayerga» · 8 — «Yakuniy — Bilgan faktni aytish»

## 10 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil halqa bilan ajralib turadi (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugmalar: Orqaga · Yakunlash →
- 12 karta — «Kartochkalar (12)» jadvali (pastda).

## 11 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab — sinf 6, E 54; tekshirish tartibi yuqoridan pastga; belgi ✓ va nishon faqat birinchisida; o'quvchi qilgan ishni aytadi):
  - `vaqt` ≤ 300 va `savollar` 3 ta: **Final pitch 5 daqiqaga sig'di, savollarga javob bor.** (52) <!-- TAXMIN T1 -->
  - `vaqt` > 300: **Pitch aytildi — 5 daqiqaga sig'dirish qoldi.** (44)
  - `vaqt` ≤ 300, `savollar` 3 tadan kam: **Pitch 5 daqiqaga sig'di — savol-javob qoldi.** (44)
  - `vaqt` yo'q, lekin `tuzatildi` yoki `savollar` bor: **Pitchni taymer bilan aytish hali qoldi.** (39)
  - hech narsa saqlanmagan: **Final pitch hali aytilmagan.** (28)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Endi siz bilasiz (asosiy fikr bu yerda yo'q — E 50, T-048):
  - Bu darsda final pitch — tuzatishlar qo'llangan olti bo'lak, 5 daqiqada. <!-- TAXMIN T1 -->
  - Bu mashqda tuzatish eski gap o'rniga yoziladi — pitch 5 daqiqadan oshmasligi uchun.
  - Hakam savoliga javob — bir daqiqagacha: son yoki fakt va uni qayerdan bilganingiz.
  - Javobni bilmasangiz, «tekshirib aytaman» deysiz — son o'ylab topilmaydi.
- Uyga vazifa (`HwCard` — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: oila a'zosi yoki do'stingiz · Nechta: 1 pitch, 3 savol · Muddat: keyingi darsgacha
  - ① «Keyinroq» qoldirgan tuzatishlaringiz bo'lsa — ularni eski gap o'rniga pitchga qo'llang.
  - ② Pitchni bir kishiga taymer bilan ayting, so'ng undan uchta savol berishini so'rang va har biriga bir daqiqada javob bering.
  - ③ «Tekshirib aytaman» degan savolingiz bo'lsa — javobini toping va manbasi bilan yozib qo'ying.
  - Karta ostida (bitta kulrang qator): Tinglovchi topilmasa — taymer bilan o'zingiz ovoz chiqarib ayting.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Video-portfolio: 3 daqiqada o'zingiz va mahsulot»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib (E 50): belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. «Bugungi asosiy fikr» qutisi, holat chiplari, artefakt-strip — yakunda yo'q. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Kim bilan» — HwCard yorlig'i (12-Modul 12-dars bilan bir). ① va ③ — shartli (bajarilgan o'quvchida ko'rinmaydi). Uyda pitch faqat tanish odamga aytiladi; video yozish so'ralmaydi (TAQIQLAR 1). Muddat «keyingi darsgacha» — keyingi dars nomi faqat «Keyingi dars» qatorida (T-038).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi, ≤48 belgi)
- **Sharp Answer!** (2-ekran, uch savol birinchi urinishda) — Uch javobni birinchi urinishda tanladingiz
- **Fix Applied!** (5-ekran, kamida bitta tuzatish uzunlik ogohlantirishisiz qo'llanganda) — Tuzatishni eski gap o'rniga qo'lladingiz
- **Five Minutes!** (6-ekran, vaqt ≤ 5:00) — Pitchingizni 5 daqiqaga sig'dirib aytdingiz
- **Three Answers!** (7-ekran, uch javob saqlangan va har biri 1:00 ga sig'gan) — Uch savolga bir daqiqadan javob berdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda; 3-ekran (tugmali tushuncha) va testlar nishonsiz. Nishon sharti ekranda oldindan aytiladi (§183).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **4 · Tuzatish qayerga** — 1 Varaqdagi ✗ izohi tuzatishlar ro'yxatiga, undan pitchga o'tadi. · 2 Bu mashqda tuzatish eski gap o'rniga yoziladi — bo'lak o'z vaqtida qoladi. · 3 Mentor misolida Bozor, Raqamlar va Keyingi qadam shunday tuzatildi, jami yana 5 daqiqa.
  — Sinfga savol: Tuzatishlaringizdan qaysi biri bo'lakni uzaytirdi?
- **8 · Bilgan faktni aytish** — 1 Javobda son yoki fakt va uni qayerdan bilganingiz aytiladi. · 2 «Tekshirib aytaman» — faqat javobni bilmaganda. · 3 Mentor misolida: o'yinchilar Telegram guruhida «kim keladi?» deb yozishadi — ular shunday degan.
  — Sinfga savol: Hakam «Odamlar hozir bu ishni nima bilan qiladi?» desa, nima deysiz?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa tomon (javob) |
|---|---|
| Bu darsda final pitch qanday pitch? | Tuzatishlar qo'llangan, 5 daqiqaga sig'adigan pitch <!-- TAXMIN T1 --> |
| Final pitchdan keyin nima bo'ladi? | Savol-javob: hakam savol beradi, siz javob berasiz <!-- TAXMIN T1 --> |
| Bu mashqda Yechim bo'lagiga qancha vaqt ajratilgan? | Taxminan bir yarim daqiqa — jonli demo bilan |
| Tuzatish pitchga qanday yoziladi? | Eski gap o'rniga — bo'lak o'z vaqtida qoladi |
| Mentor varag'ida Bozor bo'lagiga qanday izoh yozilgan edi? | «60 kishi kim — o'yinchimi, guruhmi?» |
| Mentor Raqamlar bo'lagida tasdiqni qanday aniqlashtirdi? | «3 tashkilotchi Pro uchun to'lashga tayyorligini yozdi — real to'lov hali yo'q» |
| Taymerdagi «Keyingi bo'lak» tugmasi nimani ko'rsatadi? | Har bo'lak aslida qancha vaqt olganini |
| Javob bir daqiqadan oshsa nima qilasiz? | Bitta son yoki faktda to'xtaysiz |
| Hakam savoliga yaxshi javobda nima bo'ladi? | Son yoki fakt va uni qayerdan bilganingiz |
| Qachon «tekshirib aytaman» deyiladi? | Javobni bilmaganda — son va fakt o'ylab topilmaydi |
| Mentor «Bu son qayerdan va nimani sanaydi?» savoliga nima dedi? | 51 — ilovada ro'yxatdan o'tgan hisoblar, Database'dan; 11 tasi — sinfdoshlar |
| Mentor qaysi savolga «tekshirib aytaman» dedi? | «Bu mahsulot yana qancha odamga kerak?» — boshqa mahallalarni hali tekshirmagan |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (final pitch, savol-javob — 3 · Yechim vaqti — 3, 6 · eski gap o'rniga — 3, 5 · varaq izohi, tasdiq — 3 · «Keyingi bo'lak» — 6 · bir daqiqadan oshsa — 7 · son yoki fakt, «tekshirib aytaman», 51, boshqa mahallalar — 2).
- §144: kartochka savollari arena savollarini takrorlamaydi (arena 1, 5, 6, 7, 9 — boshqa holat; kartochkada vaqt, «Keyingi bo'lak», oshgan javob va varaq izohi so'raladi).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). Inglizchasi «Q&A» bu darsda yo'q (1-darsda bir marta).

## Jonli viktorina — 12 savol (✔ o'rni: A 1·6·11 · B 2·7·9 · C 3·8·10 · D 4·5·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Bu mashqda Raqamlar bo'lagiga qancha vaqt ajratilgan? (3)
   - ✔ Taxminan bir daqiqa
   - Taxminan yarim daqiqa
   - Taxminan ikki daqiqa
   - Taxminan uch daqiqa
2. Mentor Bozordagi «60 kishi»ni qanday aniqlashtirdi? (3, 5) <!-- TAXMIN T2 -->
   - Ularni ilovadagi o'yinchilar deb yozdi
   - ✔ Ularni Telegram guruhi a'zolari deb yozdi
   - Ularni Toshkentdagi futbolchilar deb yozdi
   - Ularni o'zining sinfdoshlari deb yozdi
3. Tuzatish bo'lakni uzaytirsa, nima qilasiz? (3, 5)
   - Pitch vaqtini olti daqiqaga uzaytirasiz
   - Tuzatishni pitchga umuman kiritmaysiz
   - ✔ Eski gapning bir qismini olib tashlaysiz
   - Boshqa bo'lakni pitchdan olib tashlaysiz
4. Mentor boshqa mahallalar haqida hakamga nima dedi? (2) <!-- TAXMIN T2 -->
   - «U yerda ham 60 kishidan bor — biz bilamiz»
   - «Ularga ilova kerak emas — o'yin kam bo'ladi»
   - «Hamma mahallada ham bor — muammo bir xil»
   - ✔ «Hali tekshirmaganmiz — tekshirib aytaman»
5. Pitch 5 daqiqadan oshdi. Nima qilasiz? (6)
   - Savol-javob vaqtidan qo'shib olasiz
   - Jonli demoni pitchdan olib tashlaysiz
   - Tezroq gapirib, hammasini aytib chiqasiz
   - ✔ Eng uzun bo'lakdan bitta gapni olasiz
6. Bu mashqda hakam savoliga javob qancha davom etadi? (2, 7)
   - ✔ Bir daqiqagacha
   - Uch daqiqagacha
   - Besh daqiqagacha
   - Ikki daqiqagacha
7. Siz sanamagan son so'raldi. Hakamga nima deysiz? (0, 2)
   - Yaqin sonni taxmin qilib aytib berasiz
   - ✔ «Tekshirib aytaman» deb javob berasiz
   - Savolni eshitmagandek davom etasiz
   - Pitchni boshidan qayta aytib berasiz
8. Mentor javobi: odamlar hozir o'yinni nima bilan yig'adi? (2)
   - Maxsus sport ilovasida jadval tuzib yig'adi
   - Maktabda tanaffus paytida kelishib yig'adi
   - ✔ Telegram guruhida «kim keladi?» deb yig'adi
   - Ota-onalar orqali telefonda kelishib yig'adi
9. Mentor varag'ida qaysi ikki bo'lak ✗ olgan edi? (3)
   - Muammo va Yechim
   - ✔ Bozor va Raqamlar
   - Jamoa va Raqamlar
   - Yechim va Bozor
10. Pitchdan oldin demo uchun nima qilinadi? (6) <!-- TAXMIN T8 -->
    - Ilovaga yangi funksiya qo'shib qo'yiladi
    - Database oynasi ekranda ochiq qoldiriladi
    - ✔ Backend bitta so'rov bilan uyg'otiladi
    - Ikkinchi telefon butunlay o'chirib qo'yiladi
11. Pitch paytida sherigingiz nima qiladi? (6)
    - ✔ Taymerni kuzatib, bo'lak tugaganini bosadi
    - Har bo'lakka ✓ yoki ✗ qo'yib baholaydi
    - Pitchni siz bilan birga ovoz chiqarib aytadi
    - Sizning o'rningizga jonli demoni ko'rsatadi
12. Hakam «Endi nima qilasiz?» desa, nimani aytasiz? (7) <!-- TAXMIN T3 -->
    - Mahsulot uchun kerakli pul summasini
    - Tez orada hamma ishlatib qolishini
    - Pitchning hamma bo'laklarini qaytadan
    - ✔ Keyingi ishni va bitta aniq so'rovni
- Arena yozuvlari — platforma shabloni (namuna 12-Modul YAKUNIY dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — pitch, bo'lak, taymer, hakam, savol, javob, tuzatish, sherik, demo, so'rov · uyga vazifa banneri — pitch, taymer, savol, javob (faqat so'z, emojisiz).
- Izoh (MD): 2 — ilova, Toshkent, sinfdosh — boshqa o'lchovlar (sinf 7; 60 — guruh a'zolari) · 3 — 4-test (kitob ilovasi) emas, Mentor qoidasi · 4 — uchala distraktor Mentor aytmagan gap (sonsiz da'vo) · 5 — tezroq gapirish 12-Modul qoidasiga zid («har bo'lakdan bitta ortiqcha gap») ·
  7 — 0-ekran hooki ballsiz edi, bu — ballik takror · 8 — distraktorlar Mentor javobi emas (savol Mentor javobini so'raydi) · 10 — yangi funksiya qo'shilmaydi (6-dars), Database yopiq, ikkinchi qurilma kerak · 11 — sherik bu darsda baholamaydi · 9 — C, D da bittadan to'g'ri bo'lak bor, lekin juftlik noto'g'ri · 12 — pul summasi TAQIQLAR 1 ga zid.

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/12-Modull/PmFinalPitchLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m12d8-v1` · «Final pitchingiz 5 daqiqaga tayyormi?».
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s3 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s4/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s5/s6/s7 `QMustaqil` · s9 `QNatija` · s10 `QKartochka` · s11 `QYakun`.
2. **`FinalSahna`** — bitta vizual (180): olti bo'lak (`BolakKarta` holatlari: oddiy · joriy · ✗ + izoh pufagi · qo'llandi — eski gap chizilib xiralashadi, yangi sirg'alib kiradi) · `TaymerChiziq` (`VAQT = [40, 30, 90, 60, 30, 50]`, `JAMI_VAQT = 300`; `sekund`, `joriy`, bo'lak vaqtlari; > 300 — qizil «+m:ss») ·
   savol-javob bo'lagi (uch katak, `JAVOB_VAQT = 60`; bo'sh · joriy · ✓ · oshgan) · hakamlar (3 qiyofa, ismsiz — D 36; pufak / ✓) · telefon (`JamoaTelefon`, ixtiyoriy — faqat 3-ekranda; «8 / 10» → «9 / 10»). Rejimlar: `savol` · `tuzatish` · `taymer` · `toliq` · `skelet`.
   12-Modul `TaymerChiziq` va 01 `OltiBolakSahna` dan ko'chirilmaydi — dars ichida (K-020). Rangli yon chiziq yo'q. `reduced-motion`; 393 da bo'laklar telefon ostida. Qolip-maket izohi faylda (`// qolip-maket: …`).
3. **Bitta manbalar (P-063):** `JAMOA_PITCH` (A-6: oltita gap, Bozor, Raqamlar va Keyingi qadam uchun `eski` va `yangi`) · `JAMOA_VARAQ` (1.5: ✗ Bozor, ✗ Raqamlar izohlari, `hakamSavoli` — Keyingi qadam ustida) · `HAKAM_SAVOL` (9.3, 6 ta; uz/ru 01 bilan bir) ·
   `SAVOL_BANK` (`HAKAM_SAVOL` + «Odamlar hozir bu ishni nima bilan qiladi?») · `MENTOR_JAVOB` (2-ekran: 3 × `{ savol, togri, notogri, teg, xato, togriBirinchi }`) · `BOLAK_ID` (`muammo` · `bozor` · `yechim` · `raqamlar` · `jamoa` · `keyingi`).
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); maket `pm-m12d1-pitch.bolaklar` dan (yo'q — `JAMOA_PITCH` + yorliq «Mentor misoli»); tanlov → javob pufagi.
5. s2: `QBashorat` (hech biriga · bittasiga · ikkitasiga) → 3 juft karta ketma-ket (✔ o'rni `togriBirinchi`: false · true · false); to'g'ri → karta katakka uchadi + teg; xato → silkinish + `QXato`; `QIzoh` ikki marta (1, 3-kartadan keyin) — yashil xulosa qutisi ichida (E 42); 40 s ipucha; nishon `sharpAnswer`.
6. s3: `QBashorat` (kam · avvalgidek · ko'p) → 3 tugma (varaq pufaklari va hakam savoli · uch gap almashinuvi + `QIzoh` · taymer 0→300 tezlashtirilgan ≈6 s, telefon «9 / 10», savol-javob bo'lagi + `QIzoh` final pitch); `tugadi`.
7. s5: o'qiydi `pm-m12d5-varaq` (`tuzatishlar[]`, `varaq[]`, null-xavfsiz) va `pm-m12d1-pitch.bolaklar`; ketma-ket karta (E 53); tekshiruv funksiyasi (o'zgarmagan · bo'sh · 160 · +40 · pul so'zlari · `VADA_RE` · tasdiq/to'lov) — PM-108 tartibida kamida 10 namuna bilan `node` da sinaladi (apostrof `normT` bilan — 12-Modul naqshi).
   Varaq yo'q — bo'lak chiplari (≤ 3); pitch yo'q — bo'sh maydon. «Keyinroq» — kalitga yozilmaydi (faqat dars holati). Nishon `fixApplied`.
8. s6: taymer (`setInterval` 1 s; «Keyingi bo'lak» → bo'lak vaqtlari massivi, faqat ekranda); «To'xtatish» → `vaqt` saqlanadi; «Qaytadan» → yangi urinish (oxirgi saqlanadi). «Pitchdan oldin» bloki — statik matn (trek kaliti o'qilmaydi). Nishon `fiveMinutes`.
9. s7: savollar manbasi — `pm-m12d5-varaq.hakamSavoli` (bo'lsa) + `SAVOL_BANK` (sherik chiplari / yakka — tasodifiy, takrorsiz; tanlangan savollar dars holatida saqlanadi — qayta yuklanganda o'zgarmaydi); taymer 60 s pastga, > 60 — «+m:ss»;
   «Tekshirib aytaman» qo'shimchasi (`{nimani}` qolsa — bloklaydi); tekshiruv (bo'sh · `{nimani}` · taxmin so'zlari · `VADA_RE` · «Endi nima qilasiz?» + pul so'zlari) — `node` da namuna bilan. Nishon `threeAnswers`.
10. **Saqlash** `localStorage` `pm-m12d8-final` = `{ vaqt: n | null, savollar: [{ savol, javob }], tuzatildi: [bolak], savedAt }` (tayanch 8; `null` va taklif maydonlar `tur`, `bolaklar` — TAYANCHGA SAVOL 4: tasdiqlansa qo'shiladi, rad etilsa olib tashlanadi);
    har «Saqlash» / «To'xtatish» da birlashtiriladi, `savedAt` yangilanadi. Ism, telefon, sherik ismi hech qaysi maydonga yozilmaydi (sinf 3). Boshqa darsning kalitiga yozmaydi. Holat shakli kalit bilan birga saqlanadi (E 51 — oq ekran tuzog'i).
11. **App.jsx** (asosiy seans; bu agent tegmaydi): `m12-08` qatoriga `comp: PmFinalPitchLesson` + import. `title`/`sub` — hozirgi holicha (474-qator).
12. Testlar s4/s8 — `correctIdx` 2/0 = `INLINE_KEYS`; `RECAPS` 4/8 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). s8 — `lead` qatori bilan. Kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4).
    Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. Jonli ball: `INLINE_KEYS` = { s4: 2, s8: 0, savolJavob: -1, tuzatishTaymer: -1, practice: -1 }; `SCREEN_META` == screens; `SCREEN_INTENTS`.
14. `ACHIEVEMENTS` 4 (`sharpAnswer`, `fixApplied`, `fiveMinutes`, `threeAnswers`) · `FLASHCARDS` 12 · s11 `RECAP` 4 band = yakundagi «Endi siz bilasiz» so'zma-so'z · «Bugungi asosiy fikr» — yakunda yo'q (E 50) ·
    yakun sarlavhasi — `vaqt`, `savollar.length`, `tuzatildi.length` dan (5 holat, tartib bilan) · `HW_TOKENS` — faqat so'z · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
15. Uyga vazifa — `HwCard` («Kim bilan · Nechta · Muddat», 3 band, ① va ③ shartli); alohida `.homework.jsx` yo'q.
- Darvozalar: `npm run gates -- src/12-Modull/PmFinalPitchLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).
  ⚠️ CSS izohida va kod namunasi ichida backtik yo'q (CLAUDE.md); qo'shtirnoqli gaplar (`"Doimiy o'yin"`, `«kim keladi?»`) — JS satrida ekranlanadi.

## REPO
Amaliy blok yo'q (PM darsi, kod ekrani yo'q) — o'quvchi repo'siga ham, `maydon-jamoa` ga ham tegilmaydi. Jonli demo — 6–7-darslardagi holatdagi mahsulot bilan. <!-- TAXMIN T4 -->

| Teg | Holat |
|---|---|
| `m14-dars-08-start` | = `m14-dars-07-done` (demo tekshiruvidan keyingi tuzatishlar, `XATOLAR.md` qatori) |
| `m14-dars-08-done` | = `m14-dars-07-done` (tayanch 3: 08…13-done = 07-done) |

«Ortda qoldingizmi» bu darsda yo'q (amaliy blok yo'q).

## Manbalar (o'zim tekshirgan fayl va qatorlar, 08.10.2026)
- `feedback/F-1008-14modul/00-MODUL-TAYANCH.md` 1.0, 1.1, 1.5, 1.8, 1.13, 1.14, 2, 3, 4, 7, 8, 9 (1–4, 6, 10, 12–14) · `00-TAQIQLAR.md` · `00-NOMLAR.md` (8, 9-qatorlar) · `qaror-0.json` va `JURNAL.md` «TAXMINLAR» · `MD_TOPSHIRIQ_2.md` (8-qator, 8-eslatma).
- `src/App.jsx` 473–475 (`m12-07`, `m12-08` nomi va osti, `m12-09`) — grep 08.10.
- 13-Modul tayanchi 1.4 («raqobat — tashkilotchi bugun o'yinni Telegram guruhida bepul yig'adi»), 1.9 (tasdiq — yozma javob, real to'lov emas), 1.10 (jami 51 = 44 + 7, Database), 1.13 (sonlar jadvali) — o'qidim.
- 11-Modul tayanchi 1 (16-qator: «Hozir qanday hal qilishadi: Telegram guruhida «kim keladi?» deb yozishadi; javoblar xabarlar orasida yo'qoladi»; 78-qator — «hozir nima bilan») — o'qidim.
- 12-Modul tayanchi 116-qator (mahalla futbol guruhi — Telegram guruhi, 60 kishi) · `src/10-Modull/PmGrowthPitchLesson.jsx` 598–607 (`ZAL_SAVOL`, `VAQT`), 780–807 (`TaymerChiziq`), 1599–1601 (`TEXNO_RE`, `VADA_RE`, `BAHO_RE`) — o'qidim.
- Pilotlar: `01-PmInvestorPitch-v3.md` (A-6 `JAMOA_PITCH`, `HAKAM_SAVOL`, 11-ekran pul detektori, 6-ekrandagi kitob ilovasi testi) · `07-PmDemoTest-v3.md` (12 ekranli tuzilish, «sherik») · `01/03/07-OZ-AUDIT.md`.
- Tashqi (internet) fakt bu darsda yo'q: Lighthouse, Expo, Render (faqat 6-darsdagi «uyg'otish» so'zi), Upwork, YC — tilga olinmaydi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentor misolidagi uch savol (2-ekran):** `SAVOL_BANK` dan — «Bu son qayerdan va nimani sanaydi?» · «Odamlar hozir bu ishni nima bilan qiladi?» (ikkalasi 1.8 dan) · «Bu mahsulot yana qancha odamga kerak?» (9.3 — Bozor).
   1.8 dagi «Keyingi olti oyda nima qilasiz?» olinmadi: 12-dars nomi va mazmuni (sinf 12, T-038), 9.3 mashq havzasida ham yo'q. Mentor varag'idagi hakam savoli («Nega maydon egalari …», 1.5) — 05 MD da Keyingi qadam tuzatishiga aylangan, savol-javobda takrorlanmadi.
2. **Mentorning uch javobi (yangi gap, yangi son yo'q):** «51 — ilovada ro'yxatdan o'tgan hisoblar, namuna akkauntlarsiz, Database'dan; 11 tasi — sinfdoshlarim.» (13-Modul 1.10) · «Telegram guruhida «kim keladi?» deb yozishadi, javoblar xabarlar orasida yo'qoladi — o'yinchilar shunday degan.» (11-Modul tayanchi 1, 13-Modul 1.4) ·
   «Mahalla futbol guruhida 60 a'zo bor; boshqa mahallalarni hali tekshirmaganmiz — tekshirib aytaman.» (1.1 Bozor gapidan). Tayanch 1.8 ga qo'shishni so'rayman — 13-dars ham shularni ishlatsin.
3. **Mentorning tuzatilgan uch bo'lagi (9.2):** tuzatish bandlari — 05 MD `MENTOR_TUZATISH` (08.10 03:57 da o'qildi: Bozor · Raqamlar · Keyingi qadam); 05 bo'laklarni qayta yozmaydi — yangi matnlar shu darsda, mening qarorim:
   Bozor — «Mahalla futbolining Telegram guruhida — 60 a'zo; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» (116) · Raqamlar — «… 3 tashkilotchi Pro uchun to'lashga tayyorligini yozdi — real to'lov hali yo'q.» (154) ·
   Keyingi qadam — «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Ilova hozir maydon egalariga xizmat qilmaydi — sizdan bitta so'rov: ular bilan tanishtiring.» (155). ⚠️ So'rov gapi 9.4 dagidan qisqardi («mahalladagi maydon egalari» → «ular») — tasdiq kerak; 13-dars shu uch matnni ishlatishi kerak (tayanch 1.1 ga «tuzatilgan holat» qatori).
4. **`pm-m12d8-final` sxemasi:** (a) `vaqt: n | null` — pitch aytilmagan holat (sinf 3, uch holat) · (b) `tur: 'sherik' | 'yakka'` — real/mashq (sinf 3) · (c) `bolaklar: { <bolak>: gap }` — dars `pm-m12d1-pitch` ga yozmaydi, shuning uchun qo'llangan matn faqat shu yerda saqlanishi mumkin (13-dars tuzatilgan pitchni ko'rishi uchun) ·
   (d) `tuzatildi` — faqat matni o'zgarib saqlangan bo'laklar («Keyinroq» kirmaydi).
5. **7-ekran savollari:** 1-savol — o'quvchining `pm-m12d5-varaq.hakamSavoli` (guruh yozgan haqiqiy savol), 2–3 — `SAVOL_BANK`. 9.3 «shulardan oladi» deydi — hakam savoli bankdan tashqari bo'lishi mumkin (5-dars uni erkin yozdirsa). Rad etilsa — uchalasi bankdan.
6. **Javob vaqti «bir daqiqagacha»** — tayanch 1.8 «≤1 daqiqa»; o'quvchi matnida «bu mashqda» bilan (kurs qoidasi, sinf 4). 1:00 dan oshgan javob ham saqlanadi (neytral belgi), faqat nishon berilmaydi.
7. **Yorliq «qo'llandi»** (tuzatish bo'lakka yozildi) — 12-Modul «o'zgartirildi» o'rniga, chunki darsga xos eslatma «5-dars tuzatishlari qo'llanganmi» deydi. Bo'lak qayta baholanmagan — «endi yaxshi» degani emas. Bir xil so'z kerak bo'lsa — tayanch 2 ga qator.
8. **Juftlik va yakka rejim** — tayanch 1.8 guruh shaklini aytmaydi; 12-Modul 12-dars naqshi (juftlik, A va B navbat bilan) oldim. 5-darsdagi 3–4 kishilik guruh shu darsda ham bo'lishi mumkin — tanlov Mentorniki (O'qituvchi eslatmasi).
9. **«Keyingi bo'lak» tugmasi (6-ekran)** — sherik bo'lak chegarasini bosadi, bo'lak vaqtlari faqat ekranda (kalitga yozilmaydi). Tayanchda yo'q — 13-dars hakam varag'ida «vaqt» bandi uchun foydali bo'lishi mumkin.
10. **Qo'shimcha o'qish yo'q:** `pm-m12d6-demo.stsenariy` (6-ekran «Pitchdan oldin» blokida o'quvchining o'z stsenariysi ko'rinsa foydali) — jadvalda yo'q, o'qimadim; matnda faqat «6-darsdagi demo stsenariysi» deyiladi. Qo'shish mumkinmi?
11. **Dars raqami o'quvchi matnida** — «5-darsdagi varaqdan», «6-darsdagi demo stsenariysi» (07 pilot naqshi). 12-Modul 11/12-darslarida dars raqami o'rniga natija nomi ishlatilgan edi — modul bo'yi bir qaror kerak.
12. **Ikkinchi misol — kitob almashish ilovasi** (4, 8-ekranlar): 01 MD dagi «Chatda 120 kishi» gapining davomi (mashq soni). Uchala testli dars (01, 08 va boshqalar) bir olamda — modul bo'yi kelishuv sifatida tayanch 9 ga.

## Shubhali joylar (ishonchim komil emas)
- ⛔ **«Qur» darvozasi:** 6-ekran ≈20 daqiqa va 7-ekran ≈17 daqiqa — 12–15 o'quvchi bilan taymer (juftlikda ikki navbat) · jonli demo sinfda: Backend uyg'onishi, sinf tarmog'i, ikkinchi qurilma (telefon brauzeri) — pilotda · sherik «Keyingi bo'lak»ni gapirish paytida bosa olishi (chalg'itmaydimi) ·
  5-ekran «+40 belgi» uzunlik ogohlantirishi — soxta signal darajasi `node` namunalarida · 7-ekran taxmin detektori («ko'p odam», «hamma») — to'g'ri javobni ham ushlashi mumkin (yo'naltiradi, bloklamaydi).
- **05 MD bilan moslik (03:57 da o'qildi):** tuzatish bandlari uchala bo'lakda mos; `hakamSavoli` — 05 da erkin matn (≤120), `tuzatishlar[].nima` ≤120 — 7, 5-ekranlar shunga qurildi. 05 keyin o'zgarsa — 3-ekran va A-6 qayta solishtiriladi.
- **3-ekran bashorati** («Avvalgidek») — rejadagi ulush haqida; Mentorning haqiqiy aytish vaqti o'lchanmagan. O'quvchi «gap uzaydi-ku» deb e'tiroz qilishi mumkin — `QIzoh` «yangi gap eski gap o'rniga yozildi» deydi, uzunligi yaqin (103 → 116, 139 → 154, 130 → 155). Auditor ko'rsin.
- **Raqamlar yangi gapi 154 belgi** — eskisidan 15 belgi uzun; 5-ekrandagi «+40» chegarasidan past. «Bo'lak o'z vaqtida qoldi» — reja bo'yicha; agar auditor «uzaydi» desa, gapni qisqartirish mumkin («… to'lashga tayyorligini yozdi, real to'lov yo'q.»).
- **8-ekran B variant** («Tekshirib aytaman») — hayotda kamtar javob sifatida ham ishlatiladi; lead «sinfdoshlardan so'ragansiz» uni rad etadi. Auditor «ikkinchi to'g'ri» desa — lead kuchaytiriladi.
- **«Odamlar hozir bu ishni nima bilan qiladi?»** savolidagi «bu ishni» — o'quvchi mahsulotida «ish» noaniq bo'lishi mumkin (bank so'zi aynan qoldirildi — 9.3).
- **Hakam qiyofalari** — 01 pilotida uchta; 13-dars «Mentor va mehmon» — bu darsda sherik hakam o'rnida, sahnada esa chizilgan qiyofalar. Aralashmasligi — vizual bosqichda.

---

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 18 band)
1. [x] **90 daqiqa — reja** — A-13: taqsimot (≈87 + 3 zaxira), «Ulgurmasangiz» (5 «Keyinroq», 6 — B uyda, 7 — kamida bitta savol), ⛔ pilotda taymer (6, 7); «sig'adi» yo'q. Amaliy blok yo'q — blok-darajasidagi «Ulgurmasangiz» tegishli emas.
2. [x] **Tekshirilmagan tashqi qadam** — tashqi xizmat yo'q; jonli demo sinf sharoitida (uyg'otish, tarmoq, telefon brauzeri) — ⛔ pilot (Shubhali joylar); tugma/menyu nomi yo'q.
3. [x] **Saqlash kaliti — shartnoma** — `pm-m12d8-final` tayanch 8 shakli (A-12, KOD 10): har maydon ma'nosi, `vaqt: n | null`, real/mashq `tur` — taklif (TS 4); boshqa dars kalitiga yozmaydi; ism, sherik ismi, telefon yo'q.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Bu misolda» (2, 3 xulosalari), «Mentor misolida» (Yordam, recap), «bu mashqda» (javob vaqti, taqsimot, tuzatish qoidasi), «bu darsda final pitch» (ta'rif).
5. [x] **Kafolat va sabab da'vosi yo'q** — «sig'di» faqat o'quvchi taymeridan (6, yakun); «pitch 5 daqiqaga sig'adi», «hakam albatta so'raydi» yo'q; «qo'llandi» — ish fakti, «endi yaxshi» emas (A-4); Mentor vaqti to'qilmagan (A-7).
6. [x] **Yakun, nishon — faqat rost holatda** — 11-ekran 5 holat («hech narsa saqlanmagan» bilan — E 54), ✓ va nishon faqat birinchisida; Five Minutes! — vaqt ≤ 5:00, Three Answers! — uchala javob 1:00 ga sig'ganda; yakka rejim — sarlavhalar ikkala rejimda rost.
7. [x] **Ta'rif sanaladigan** — final pitch: «tuzatishlar qo'llangan, 5 daqiqaga sig'adigan» (taymer bilan tekshiriladi); javob vaqti — 1:00 (taymer); birliklar — soniya, a'zo, hisob.
8. [x] **Test: bitta himoyalanadigan javob** — s4 (tuzilma · vaqt · tuzatmaslik), s8 (qoida noto'g'ri joyda · to'qima · maqtov); s8 lead B ni yopadi; arena izohlari (yuqorida).
9. [x] **Real odamlar xavfsizligi** — sherik ixtiyoriy, ismsiz, odamga baho bermaydi (6, 7, A-10); podium — faqat test ballari; uyda — tanish odam; video so'ralmaydi; o'quvchi Mentor nomidan tasdiqlamaydi.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bu darsda agent ishlamaydi, tekshiruv akkaunti yo'q.
11. [x] **Web-trek teng yo'l** — «mahsulot» so'zi; jonli demo — laptop brauzeri + telefon brauzeri ikkala trekda (A-11, 6-ekran); testlar ikkala trekka to'g'ri.
12. [x] **Mentor misoli ichki izchil** — Muammo, Yechim, Jamoa — 1.1 aynan; Bozor, Raqamlar va Keyingi qadam — 5-darsdagi tuzatish bilan (9.2; 05 MD; TS 3); sonlar 1.14 dan; grafik yo'q (9.14); 9, 13-dars natijasi oldindan ochilmaydi.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — 5-ekran: tuzatish — o'quvchining 5-darsdagi ro'yxati; Mentor gaplari faqat Yordam'da; 7-ekran: savolni sherik tanlaydi, javob o'quvchiniki; `{nimani}` — o'quvchi to'ldiradi.
14. [x] **Uyga vazifa yengil va aniq** — 3 ish, ① va ③ shartli; ② — bitta tanish odam bilan; tinglovchi topilmasa — o'zi ovoz chiqarib (karta ostida).
15. [x] **Ayb da'vosi yo'q** — `QXato` va xato izohlari aniq keyingi qadamni aytadi; «Tekshirib aytaman — xato emas» (O'qituvchi eslatmasi); «sizning xatongiz emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — `VADA_RE` (5, 7); arena 12 B — va'da distraktor; Demo Day, 9, 13-darslar mazmuni va'da qilinmaydi; «tekshirib aytaman» — va'da emas, bilmaganini rost aytish.
17. [x] **Pul va investitsiya** — Keyingi qadam 1.1 aynan (aniq so'rov); 5-ekran pul detektori; 7-ekran «Endi nima qilasiz?» + pul so'zlari; arena 12 A; «tasdiq — to'lov emas» Raqamlarda tuzatilib aniqroq aytiladi.
18. [—] **Yosh va rasmiy shartlar** — bu darsda xalqaro sayt va dastur yo'q.
+ **RAD etilganlar saqlangan:** hookdagi «Aynan!» / «Qiziq fikr!» (0) · «Keyingi dars — «…»» qatori (11) · reja sarlavhasi — natija-gap (1) · ≤3 blok · bank so'zi aynan (`HAKAM_SAVOL`, `SAVOL_BANK`).
+ **SABOQ E:** variant chegarasi (0, 2 kartalar) · maket kesilmaydi (⛔ vizual) · taxmin qatori yashil xulosa ichida (2, 3) · yorliq input ichida (5, 7) · bittadan karta (5, 7) · yakun standart, «Bugungi asosiy fikr» yo'q (11).
+ **Tayanch 9 (to'lqin kelishuvlari):** 1 — taqsimot 40·30·90·60·30·50 (A-6, 3, 6) · 2 — Mentor pitchining olti gapi + tuzatish (A-6) · 3 — `HAKAM_SAVOL` aynan, `SAVOL_BANK` (A-6) · 4 — «so'rov» / «Yordam» ajratilgan (Keyingi qadam gapi; «Yordam» — faqat tugma) ·
  6 — ikkinchi qurilma telefon brauzerida (6-ekran) · 10 — demodan keyin holat boshiga qaytariladi (6-ekran) · 12 — «hakam» glosssiz · 13 — «Demo Day» o'quvchi matnida yo'q · 14 — grafik qaytmaydi. 5, 7, 8, 9, 11, 15 — bu darsga tegmaydi.

## O'lchov (`scratchpad/m14/md08/olchov.py` natijasi — jadval skript chiqishidan, 08.10.2026; to'liq chiqish `md08/olchov-natija.txt`)
| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0, 1, 2, 3, 5, 6 ×2, 7, 10, 11 ×5) | 14 | 25 | 52 | ≤55, bitta qator; qavsdagi sonlar haqiqiy uzunlik bilan bir xil (skript tekshirdi) |
| Hook javobi («Aynan!» · «Qiziq fikr!» ×2, so'z bilan birga) | 3 | 93 | 106 | ≤120 |
| Hook variantlari (0) | 3 | 37 | 42 | farq 12% |
| Mentor (0 — 2 gap; 1, 2, 3, 5 ×2, 6 ×2, 7 ×2 — bittadan gap) | 10 | 72 | 109 | interaktivda 1 gap ✓; «Bu…», «Hammasini…» bilan boshlanmaydi ✓ |
| Xulosa (2, 3, 5 ×2, 6 ×2, 7; `{…}` bilan — taxminiy) | 7 | 39 | 87 | ≤110 |
| Bugungi asosiy fikr (A-2; yakunda yo'q) | 1 | 98 | 98 | ≤110 |
| `QIzoh` qatorlari (2 ×2, 3 ×2, 6, 7) | 6 | 59 | 85 | bitta qator (≤110) |
| `QXato` (2-ekran kartalari) | 3 | 48 | 52 | ≤60 |
| Tekshiruv xabarlari (5, 7) | 11 | 32 | 54 | ≤60 |
| Ipucha (2, 3) | 2 | 57 | 68 | bitta qator |
| To'g'ri izohi (4, 8) | 2 | 52 | 54 | ≤60, «To'g'ri!» siz |
| Xato izohlari (4, 8 — uchtadan; umumiylari ham ≤60) | 6 | 40 | 55 | ≤60 |
| Test variantlari — s4 (✔ C) | 4 | 48 | 49 | farq 2%; ✔ 48 — eng qisqa |
| s8 (✔ A) | 4 | 49 | 54 | farq 9%; ✔ 52 — eng uzun D (54) |
| Test savollari (so'z) | 2 | 11 | 12 | ≤12 (s8 — lead bilan, lead 60 belgi) |
| Arena 1–12 (variantlar) | 48 | 15 (6-savol) | 45 (4-savol) | har savolda farq ≤14%; ✔ hech qayerda yolg'iz eng uzun emas |
| Arena savollari (so'z) | 12 | 5 | 8 | ≤12 |
| Nishon tavsiflari | 4 | 40 | 43 | ≤48 (§63) |

Arena ✔ taqsimoti: A — 1, 6, 11 · B — 2, 7, 9 · C — 3, 8, 10 · D — 4, 5, 12 (3/3/3/3). Ekran testlari: s4 C · s8 A.
2-ekran juft kartalari (ballsiz): ✔ o'rni ikkinchi · birinchi · ikkinchi; uzunliklar (✔ / ✕) 101 / 102 · 111 / 104 · 98 / 96 — to'g'risi uzunligi bilan ajralmaydi.
`npm run -s lint:til -- feedback/F-1008-14modul/08-PmFinalPitch-v3.md` — **0 error, 0 warn** (TOZA). Oxirgi tahrirdan keyin qayta yurgizildi.

## TAXMIN belgilari (MD dagi `<!-- TAXMIN Tn -->`)
44 qator, 51 belgi (skript bilan sanaldi).

| Tn | Qaror-0 savoli (tavsiya A) | Soni | Qayerda |
|---|---|---|---|
| **T1** | Olti bo'lak, 5 daqiqa + savol-javob | 16 | A-1, A-3, A-4, A-6 ×2 · ip (`FinalSahna` taymeri) · 1 (reja vizuali) · 3 (vizual, taymer tugmasi, final pitch `QIzoh`, xulosa) · 6 (Sahna taymeri) · 11 (1-holat, «Endi siz bilasiz» 1) · kartochka 1, 2 |
| **T2** | Bozorda faqat bor sonlar, «hali tekshirilmagan» | 8 | A-6 ×3 (Bozor gapi, Mentor javobi 3) · 2 (3-karta) · 3 (tuzatishlar tugmasi) · 5 (Yordam — Bozor) · arena 2, 4 |
| **T3** | Keyingi qadamda pul emas — aniq so'rov | 8 | A-6 ×2 (Keyingi qadam gapi va tuzatishi) · 3 (tuzatishlar tugmasi) · 5 (pul detektori, Yordam — Keyingi qadam) · 7 (pul detektori, Yordam) · arena 12 |
| **T4** | Teglar `m14-dars-NN` (PM: `-done` = `07-done`) | 1 | REPO |
| **T8** | Demo — laptop brauzeri, ikkinchi qurilma telefon | 4 | A-3 (6-dars atamalari), A-11 · 6 («Pitchdan oldin») · arena 10 |
| **T11** | 8-dars: tuzatilgan pitch, taymer 5:00, savol-javob mashqi (3 savol, 1 daqiqa) | 9 | A-1 ×2, A-3, A-4 · ip · 1 (reja yorlig'i) · 3 (final pitch `QIzoh`) · 6 (sarlavha) · 7 (sarlavha) |
| **T18** | Keyslar: 1 — K12, 2 — K19, qolgani keyssiz | 1 | sarlavha qatori (Tur — «Keyssiz») |
| **T19** | Atamalar: savol-javob, hakam | 1 | A-3 (1-darsdan o'tilgan) |
| **T20** | Dars nomi «Final pitchingiz 5 daqiqaga tayyormi?» | 3 | sarlavha qatori · Menyu · 0 (sarlavha) |
Javob boshqacha bo'lsa: T1 (B — besh bo'lak) → A-6, 3, 6 va yakun · T11 (B — 5 va 8 bir naqsh) → 6, 7 va yakun holatlari · T3 (B — summa mashq sifatida) → 5, 7 detektorlari va arena 12, TAQIQLAR 1 ga zid — alohida qaror · T8 (B — telefon proyektorga) → 6-ekran «Pitchdan oldin» va arena 10.

## GATE M — o'z tekshiruvim (`konveyer/1-MD.md`)
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 473 `m12-07` «Investor ko'zi bilan: demo buzilmaydimi?» → 474 **`m12-08` «Final pitchingiz 5 daqiqaga tayyormi?»** (osti «pitch mashqi 2: taymer va savol-javob» — reja yorlig'i so'zma-so'z) → 475 `m12-09` «Video-portfolio: 3 daqiqada o'zingiz va mahsulot» (yakun qatori).
- [x] Bitta misol-ip — «Maydon Jamoa» (pitch gaplari 1.1, sonlar 1.14); metafora yo'q; bitta vizual — `FinalSahna` (bo'laklar · taymer · savol-javob bo'lagi · hakamlar · telefon). Ikkinchi misol faqat testlarda (kitob almashish ilovasi — 4, 8; P-002).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 3 (QTushuncha) + 0, 5, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q — har bosish kartani katakka uchiradi, gapni almashtiradi yoki taymerni yuritadi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil: pitch, taymer, bo'lak, jonli demo, fidbek, baholash varag'i, sherik, halol gap (9–12-Modul) · Pro, «Doimiy o'yin», test rejim, yozma tasdiq (13-Modul) · hakam, savol-javob, olti bo'lak nomlari, aniq so'rov (1-dars) · tuzatishlar ro'yxati, hakam savoli (5-dars) · demo stsenariysi, B reja, uyg'otish (6-dars).
  Yangi — final pitch (ta'rif 3-ekranda, misoldan keyin), «tekshirib aytaman», javob vaqti, «qo'llandi». Siz-forma; tugmalar ot-shaklda («5 daqiqani boshlash», «Keyingi bo'lak», «Saqlash», «Keyinroq») yoki olam iborasi («Tekshirib aytaman» — qo'shiladigan gap); Mentorning pitch va javob gaplari — «men» shaklida (T-008).
- [x] Testlar: 4 variant, uzunlik teng (O'lchov), to'g'ri javob yolg'iz eng uzun emas; s4 — to'rttasi «-aman» shaklida, qo'shtirnoq va tire hech birida yo'q, savoldagi son javobda yo'q; s8 — to'rttasi ««…» deyman», lead so'zi («sinfdosh») A va D da. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [x] Final tartib-mashqi yo'q (yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✗ ✕ › ✎ ⛶ — belgilar) · kafolat so'zlari yo'q: «albatta», «tez orada» — faqat 5, 7-ekran detektor ro'yxatida, A-5 «Ishlatilmaydi» da va arena 12 B distraktorida (MD ichki / va'da namunasi).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-08`, «Modul 14», A1, «TAXMIN», «Q&A», «keys» — yo'q). Keys yo'q. «KOD» ro'yxati 15 band, REPO — teglar jadvali.
- [x] Karta T · P · S · PM: T-008 (Mentorning pitch va javob gaplari — olam matni) · T-011/PM-030 (final pitch — 3-ekranda misoldan keyin; sarlavhalarda yangi atama yo'q) · T-014/T-015 (A-5: tuzatish — faqat 5-dars bandi; «tuzatilgan pitch» ishlatilmaydi; «savol» — hakam savoli, testlar «Tekshiruv») ·
  T-024 (tugma nomlari) · T-029/T-047 (Mentor pufakdagi savolni takrorlamaydi) · T-035 (formula yo'q) · T-038 (Demo Day, 9, 13-dars — yo'q) · T-039 (pitchingiz, tuzatishlar ro'yxatingiz — shartli Mentor gapi 5-ekranda) · T-042 (final pitch ta'rifi so'zma-so'z: 3, kartochka 1, yakun) · T-043 («Bu misolda», «bu mashqda») ·
  T-064 (2-ekran sarlavhasi 0-ekran savoliga javob) · P-001 · P-002 · P-008 (≤3 blok) · P-012 (testlar 4, 8 — ketma-ket emas) · P-013 · P-014/P-015 (reja — natija va'dasi, osti so'zma-so'z) · P-016 · P-025 · P-033 · P-036 (0-ekranda javob sahnada ochilmaydi) · P-046 (5, 6, 7 xulosalari, yakun) ·
  P-052 · P-055 (2-ekran kartalari bittadan) · P-062 · P-063 (`HAKAM_SAVOL`, `SAVOL_BANK`, `MENTOR_JAVOB`, `JAMOA_PITCH`) · P-064 · P-067 · S-001 (savollar ≤12 so'z) · S-002 (s8 lead) · S-004/S-010 · S-008 · S-015 (bashoratlar zinapoya) · S-019 · S-020 · S-026 · S-027 · §144/§145 ·
  PM-005 (2-tur) · PM-017 · PM-018 · PM-020 («Tekshirib aytaman: {nimani}» qo'shimchasi gapda tugal) · PM-021 · PM-027 · PM-108 (5, 7-ekran tekshiruvi) · J-026 · SABOQ 1–31, D 36, E 40–55.
- [x] **Qaror-0 TAXMIN** — belgilar yuqorida; GATE M sahifasida T1, T11 javobi bu darsning 3, 6, 7-ekranlariga va yakunga to'g'ridan-to'g'ri tegadi.
