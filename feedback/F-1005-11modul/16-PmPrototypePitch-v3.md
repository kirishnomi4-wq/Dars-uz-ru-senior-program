# 11-Modul · 16-dars (PM) «G'oyangiz va ilovangiz guruhni ishontiradimi?» — MD v3

Fayl: `src/9-Modull/PmPrototypePitchLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m9-16` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q · ekranda ≤ 3 blok ·
telefon maketi chapda (≈170×272, o'lchami barqaror), bo'laklar va jadval o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **D** (`correctIdx 3`) · 5-ekran — **B** (`1`) · 7-ekran — **C** (`2`) · 12-ekran — **A** (`0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 386–388, DE-205): `m9-15` «Roadmap bo'yicha qayerdasiz?» → **`m9-16` «G'oyangiz va ilovangiz guruhni ishontiradimi?»** (osti: «muammo → yechim → jonli demo») → `m9-17` «Demo Day 7» (`type: 'Demo'`, `comp` siz).
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (to'rt bo'lakli 3 daqiqalik pitch) va uning juftlikdagi repetitsiyasi; mustaqil ish majburiy (10, 11-ekranlar). Keys — **K19 iPhone** (tayanch 5, faqat bank matni).
REPO yo'q (PM darsi; o'quvchi o'z ilovasini telefonda ko'rsatadi, repo'ga yozilmaydi).
Dastur: «G'oya va prototip pitchi — muammo → yechim → jonli prototip (mobil trekda — telefonda)» · natija «Guruh oldida pitch». **GATE M M-q2 A (06.10):** Backend'li narsa o'quvchi matnida — «ilova», pitch bo'lagi — «Jonli demo», menyu nomi «G'oyangiz va ilovangiz guruhni ishontiradimi?», osti «muammo → yechim → jonli demo»; «prototip» — faqat 7-darsdagi narsa haqida. Ommaviy himoya — Demo Day 7; o'quvchi matnida va'da qilinmaydi (T-038), faqat O'qituvchi eslatmasida.
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 5 · tushuncha, keys va testlar (2–7) ≈ 30 · jonli demo (8) ≈ 6 · SQL ≈ 8 · pitch yozish ≈ 12 · juftlikda pitch va tuzatish ≈ 17 · yakuniy savol, podium, kartochkalar, arena ≈ 12.
Manba: `00-MODUL-TAYANCH.md` (1 — muammo gapi · 1.3 — sanoq · 1.4 — yechim gapi · 1.5 — roadmap · 1.8 — sinov va tuzatish · 1.9 «16» · 2 — atamalar · 4 — kod mexanikasi · 5 — K19 · 6 — Expo Go, Render · 7 — takroriy xatolar · 8 — kalitlar · 9.2 — namuna o'yinlar · 9.27 — PM ritmi) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 3, 13, 14, 16, 17) · `00-TAQIQLAR.md` · 10-Modul `11-PmPitchRehearsal-v3.md` va `11-FILTR.md` (ko'prik: baholash varag'i, fidbek, halol gap — atamalar aynan) · 9-Modul `12-PmUserStoryPitch-v3.md` (pitch, zal, repetitsiya).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur «Guruh oldida pitch», tayanch 1.9 «16»):** o'quvchi o'z final mahsulotining **3 daqiqalik pitchini** yozadi — to'rt bo'lak:
   **Muammo** (dalil bilan) → **Yechim** (bir gapda) → **Jonli demo** (ilova telefonda ishlatib ko'rsatiladi) → **Keyingi qadam** (tuzatilgan rejadan).
   Sherigiga taymer bilan aytadi, sherik **baholash varag'ini** to'ldiradi, o'quvchi ✗ olgan bitta bo'lakni darsda tuzatadi (qolgani — uyda). Vaqt qolsa — 1–2 ko'ngilli guruh oldida aytadi (Mentor rejimi: proyektorda taymer; 90 daqiqa hisobiga kirmaydi — 16-FILTR 34).
   Saqlanadi: `pm-m9d16-pitch` (tayanch 8; ichki shakli — TAYANCHGA SAVOL 5). Jonli demo bo'lagidagi son — o'quvchining o'z Database'idan (9-ekran, Neon SQL Editor; ixtiyoriy qo'shimcha dalil).
2. **Bugungi asosiy fikr (P-013):** Uch daqiqada zal muammoni dalil bilan eshitadi, yechimni bir gapda tushunadi va ilovani telefonda ko'radi. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 9-Modul 12-dars: **pitch** (loyihaning qisqa taqdimoti) · **zal** (pitchni tinglaydiganlar) · **repetitsiya** (sahnadan oldin pitchni ovoz chiqarib aytib ko'rish) · **hikoya** (bitta real odam bilan bo'lib o'tgan ish — bu darsda faqat O'qituvchi eslatmasida).
   - 10-Modul 11-dars: **keyingi qadam** · **fidbek** (pitchdagi aniq joy haqidagi fikr yoki taklif) · **qattiq, lekin hurmatli fidbek** · **baholash varag'i** (u yerda — har slayd uchun zalning bitta savoli; ✓ yoki ✗) ·
     **halol gap** (raqam qanday sanalganini va undan qancha xulosa qilsa bo'lishini ochiq aytish) · Neon **SQL Editor**, `SELECT`, `COUNT(*)`, `WHERE`, «Neon ko'rsatgan son».
   - 11-Modul: **muammo gapi** (4) · **sanoq** — «5 tadan 4 tasi» (4) · **harakat belgisi** — «intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish; Mentor misolida — sinovga kun belgiladi» (3) ·
     «10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas» (4) · **PRD**, **yechim gapi** (5) · **jonli prototip** (7; bugun ilova uchun ishlatilmaydi — GATE M M-q2) · **sinov**, **sinov vazifasi** (12–13) · **asosiy harakat** (9-Modul 9-dars, 11-Modul 12-dars uyga vazifasi) ·
     **tuzatilgan reja**, **risk** (15) · Expo Go, `npx expo start` (9) · Backend, Render (10) · **kutish yozuvi** (15-dars risk qadami; 10-Modulda «kutish holati» — «holat» 15-darsda ish holati, 9.39).
4. **Bu darsda yangi — misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar dars bo'yi so'zma-so'z (T-042):**
   - **To'rt bo'lak** — «Uch daqiqalik pitch to'rt bo'lakdan iborat: muammo, yechim, jonli demo va keyingi qadam.» (2-ekran xulosasi). Bo'lak nomlari har joyda aynan: **Muammo · Yechim · Jonli demo · Keyingi qadam**.
   - **Jonli demo bo'lagi** — «Jonli demo bo'lagida ilova zal oldida telefonda ishlatib ko'rsatiladi.» (2-ekran `QIzoh`, 3-qadamdan keyin; GATE M M-q2 A).
   - **Dalil** (muammo bo'lagida) — sanoq va harakat belgisi (4-ekran). «Dalil» so'zi 4, 5-darslarda («tanlov uchun dalil», PRD «Dalil» bo'limi) — shu ma'noda.
   - **Yechim bir gapda** — mahsulot odamga nima qilishi bitta gapda (6–7-ekranlar; K19 ko'prigi). Yangi atama emas — qoida.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«bo'lak»** — pitchning to'rt qismidan biri. **«qism»** pitch uchun ishlatilmaydi: u 1-darsdagi ta'rifda band («G'oya uch qismdan iborat…»), bo'lak nomlari esa (muammo, yechim) g'oya qismlari bilan ustma-ust tushadi (TAYANCHGA SAVOL 1).
   - **«slayd»** — o'quvchi matnida yo'q (tayanch 1.9 da slayd yo'q; markazda — telefondagi ilova). 10-Moduldagi besh slayd — faqat O'qituvchi eslatmasida.
   - **«zal»** — pitchni tinglaydiganlar. Dars nomidagi **«guruh»** 0-ekranda bir marta tenglashtiriladi («Guruh — bugun sizning zalingiz»), keyin «zal».
   - **«ilova»** — Mentor misoli (mobil). O'quvchiga umumiy gapda — **«mahsulot»** (web-trekda ham to'g'ri keladi); «ilovangiz» — faqat telefon bilan bog'liq yo'riqda, ikkala trekka.
   - **«son»** — Database'dan olingan son («Neon ko'rsatgan son»). **«sanoq»** — intervyu yozuvlaridan sanalgani («5 tadan 4 tasi»). «Raqam» — faqat O'qituvchi eslatmasida (Database'dagi telefon raqamlari; harakat belgisi — «kun belgiladi», HB-q0 A).
   - **«tekshiruv»** — o'quvchining o'zi sinab ko'rgan yozuvlari (tayanch 2: tekshirish — o'z ishini ko'rish). **«sinov»** — faqat real odam bilan (12–13-darslar).
   - **«qo'shilish»** — `ishtirokchilar` jadvalidagi bitta qator (kim qaysi o'yinga qo'shilgani); «o'yinchi» emas — bitta o'yinchi bir necha o'yinga qo'shilishi mumkin (TAYANCHGA SAVOL 6).
     9-ekrandagi 2-son — **hozir band joylar** (`qoshildi` + `keladi`, 9.74): chiqqan va navbatdagilar sanalmaydi — bu butun tarix emas, hozirgi holat (16-FILTR 3).
   - **«jamoa»** — faqat futbol jamoasi; **«maydon»** — faqat futbol maydoni (Qaror-0 3).
   - **Ishlatilmaydi:** «prototip» Backend'li ilova uchun (GATE M M-q2 A — «ilova»); «demo» yolg'iz — faqat «Jonli demo» bo'lagi nomida va «Demo Day 7» da; slayd, Raqamlar slaydi, investor, rubrika, mezon, «sir», «albatta», «darrov», «ishontiradi» kafolat sifatida.
6. **Mentor misoli — «Maydon Jamoa» pitchi (bitta manba `JAMOA_PITCH`, 180-qonun; hamma raqam — tayanch 1, «Mentor misolida»):**
   - **Muammo:** «O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.» (tayanch 1, so'zma-so'z) ·
     dalil — **sanoq:** «5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» (1.3: 4 / 5) · **harakat belgisi:** «5 o'yinchidan 4 tasi birinchi versiyani sinab ko'rishga kun belgiladi.» (1.3: 4 / 5) ·
     halol qator (4-dars aynan): «10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.»
   - **Yechim:** «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» (1.4, so'zma-so'z)
   - **Jonli demo:** telefonda — «Shanba 18:00 · Mahalla maydoni · 8 / 10» → «Qo'shilaman» → «9 / 10» (9.2 namuna o'yini; 1.8 sinov vazifasi «Shanba soat 18:00 dagi o'yinga qo'shiling.») ·
     sinovdagi tuzatish: «Sinovda 3 kishidan 3 tasi bu o'yinni topishda to'xtadi — ro'yxatni kun bo'yicha qildik.» (1.8; tuzatishni isbot deb aytmaydi — nima topilgani va nima o'zgargani) · son — Mentor misolida tayanchda yo'q: maketda «?» (TAYANCHGA SAVOL 2).
   - **Keyingi qadam:** «Mahalla futbol guruhidan 10 kishini sinovga chaqiraman, keyin o'yindan oldin eslatma qo'shaman.» (1.9 — 2-risk qadami · 1.5 — «keyinroq» ufqidagi birinchi ish; Mentorning «Avval» qadami — kutish yozuvi — uyda bajarilgan, teg `m11-dars-15-done`, 9.95–9.96)
   - **Vaqt (mashq uchun boshlang'ich taqsimot, «bu mashqda» — 10-Modul `11-FILTR` 6):** Muammo ≈ 40 soniya · Yechim ≈ 20 soniya · Jonli demo ≈ 1,5 daqiqa · Keyingi qadam ≈ 30 soniya — jami 3 daqiqa.
7. **Zal savollari (`ZAL_SAVOL`, bitta manba — P-063; Sahna pufagi va baholash varag'i qatorlari ham shular):**
   Muammo — «Bu muammo borligini qayerdan bilasiz?» · Yechim — «Mahsulot nima qiladi?» · Jonli demo — «Ishlayotganini ko'rsata olasizmi?» · Keyingi qadam — «Endi nima qilasiz?» (10-Modul aynan).
8. **Keys — K19 iPhone (tayanch 5, bank matni aynan; boshqa fakt qo'shilmaydi):** 2007: raqobatchilar kim ko'proq tugma qiladi deb bellashgan (Nokia, BlackBerry — klaviatura, stilus).
   Apple klaviatura, stilus va deyarli hamma tugmani olib tashlagan — bitta ekran va Home tugmasi. Jobs iPhone'ni «uch qurilma bittada» deb taqdim etgan: iPod + telefon + internet. Taqdimot — 9-yanvar 2007, yozuvi ochiq. Raqamsiz.
   Ko'prik (tayanch): pitchda — mahsulot bir gapda. **Bankda yo'q fakt** («jonli ko'rsatdi», sotuv, narx) **qo'shilmaydi.** Brend izohlari (S-018: Stiv Jobs, iPod, Nokia va BlackBerry) va nom ranglari — tayanch 5 (16-FILTR 16). O'quvchi matnida «+» yo'q — «iPod, telefon va internet» (T-035).
9. **Ikkinchi misol faqat testda (P-002), Mentor g'oyalari olamidan:** uy vazifalari ilovasi (3, 5-ekran — Mentorning 4-g'oyasi), kitob almashish ilovasi (12-ekran — 5-g'oya). Sonlari mashq uchun.
10. **Toza yuza (185, D4):** tugma, variant, karta, yorliqda emoji yo'q; zal siluetlari, taymer chizig'i, telefon va keys qurilmalari chizilgan (CSS/SVG). ✓ ✗ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q.
11. **Kod mexanikasi (tayanch 4 «16», PM_DARS_ETALON 26):** **Neon SQL Editor** — o'z Database'idan pitch soni (nechta o'yin e'lon qilingan, hozir nechta joy band — 9.74). Oldingi PM darsi (15) — kod yo'q, 14 — bloklar.
    10-Modul `m8-11` ham Neon SQL edi (bosh raqam, `bandlar`, 7 kunlik oraliq) — bugun yangisi: ikki jadval, `IN`, va songa nimalar kirgani (halol gap). Son — ixtiyoriy qo'shimcha dalil: pitch sonsiz ham to'liq. Kod oynasi (`HtmlCompiler`) yo'q.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 6 g'oya → saralash va RICE → 10 intervyu → final g'oya va muammo gapi → PRD → roadmap → prototip → platforma → telefonda → poydevor → uch funksiya → sinov → yakkama-yakka (tuzatilgan reja) → **bugun: shu yo'l 3 daqiqalik pitchga yig'iladi**.
- **10-Modul ko'prigi (takrorlanmaydi):** u yerda yillik loyiha uchun 5 daqiqa va besh slayd (Muammo · Yechim · Foydalanuvchi · Raqamlar · Keyingi qadam), fidbek va baholash varag'i o'rgatilgan.
  Bugun — yangi mahsulot, 3 daqiqa, to'rt bo'lak, markazda — telefonda ishlab turgan ilova. Fidbek, «qattiq, lekin hurmatli», halol gap — qayta ta'riflanmaydi, faqat ishlatiladi.
- **Dars ipi:** 0 — zal nimani ko'rmoqchi (telefon, taymer 3:00) → 2 — «Maydon Jamoa» pitchi to'rt bo'lakka yig'iladi, taymer bo'linadi, jonli demo eng uzun bo'lak →
  4 — muammo bo'lagiga ikki dalil (sanoq, harakat belgisi) → 6 — iPhone: «uch qurilma bittada» → 7 — yechim bir gapda → 8 — jonli demo: ilova oldindan ochiladi, bitta asosiy harakat, sinovdagi tuzatish →
  9 — o'z Database'idan son va unga nima kirgani → 10 — o'quvchi o'z pitchini to'rt bo'lakka yozadi → 11 — sherigiga 3 daqiqada aytadi, varaq, bitta bo'lak tuzatiladi → 12 — yakuniy savol → podium → kartochkalar → yakun, uyda — real tinglovchiga.
- **Bitta vizual — `UchDaqiqaSahna` (dars bo'yi, 163/180; bitta manba `JAMOA_PITCH` + o'quvchi pitchi):**
  - **chapda — telefon** (≈170×272, barqaror — SABOQ 22): «Maydon Jamoa» (nom o'z rangida, 7/10-darslardagi bilan bir; logotip yo'q). Ekranlar: **O'yinlar** — kun sarlavhalari «Shanba» · «Yakshanba» (13-dars tuzatishi), to'rt namuna o'yin
    (Shanba 18:00 · Mahalla maydoni · 8 / 10 · Shanba 20:00 · Maktab maydoni · 6 / 10 · Yakshanba 10:00 · Park maydoni · 4 / 8 · Yakshanba 17:00 · Mahalla maydoni · 9 / 10 — tayanch 9.2) ·
    **O'yin** — «‹ O'yinlar», qo'shilganlar ismsiz doiralar, «Qo'shilaman» → «Qo'shildingiz» (o'chiq) · **kutish yozuvi** — «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» va ingichka chiziq (sabab yozilmaydi — 10-Modul qoidasi; tayanch 9.95).
    «8 / 10» → «9 / 10»: son almashadi va bir lahza kattalashib, silliq qaytadi (9.14).
  - **o'ngda — to'rt bo'lak** (ustma-ust ixcham kartalar, bir balandlikda): bo'lak nomi va 1–3 qator. Holatlar: bo'sh (kulrang uzuq chiziq, U-041) → joriy (accent chegara) → yozildi (matn sirg'alib kiradi, ~1 s yashil) →
    ✓ (burchakda yashil ✓) · ✗ (`err` chet) · **tuzatildi** (yashil ✓ + kichik yorliq «tuzatildi»).
  - **bo'laklar ostida — taymer chizig'i** 0–3:00, to'rt bo'lakka bo'lingan (≈40 s · ≈20 s · ≈1,5 daqiqa · ≈30 s; har bo'lak ostida nomi); taymer yurganda joriy bo'lak accent; 3:00 dan oshsa chiziq o'ngga qizil davom etadi, yonida «+m:ss».
  - **bo'laklar ustida — zal:** to'rtta chizilgan bosh-siluet va bitta savol pufagi (`ZAL_SAVOL`); bo'lak javob bersa — pufak o'rnida yashil ✓.
  - **baholash varag'i qatlami** (11-ekran): to'rt qator — bo'lak nomi · zal savoli · ✓ / ✗ · izoh qatori; pastda «Vaqt: m:ss» (taymerdan o'zi yoziladi).
  - Ishlatiladi: 0 · 1 (matnsiz skelet) · 2 · 4 (faqat Muammo bo'lagi va zal; telefon o'rnida — sanoq jadvali, SABOQ 24) · 8 · 9 (Jonli demo bo'lagi ixcham) · 10 · 11. Keys (6) — o'z sahnasi `IphoneSahna`.
    `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi. Telefon kengligida (393) bo'laklar telefon ostiga tushadi.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, juda yengil to'lqin (≤3%, ≥2 s — SABOQ 32, F-1006-270: «tebranish oshib ketibdi»); tanlov guruhida bitta halqa (har variantda emas — SABOQ 32). Yoqilgan pastki tugma ham halqada.
- **Bashorat (SABOQ 11):** tanlangach yo'qolmaydi — savol va «Taxminingiz: …» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi (SABOQ 25).
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa joyidan joyiga uchadi (sanoq qatori jadvaldan bo'lakka, son maketdan bo'lakka) · yangi qator ~1 s yashil yonadi · taymer chizig'i to'lib boradi.
  Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q; kutish yozuvi chizig'i faqat 8-ekran 1-qadamida va bir marta.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · «Maydon Jamoa» pitchi
- Sarlavha: **G'oyangiz va ilovangiz guruhni ishontiradimi?** (45) — dars nomi (DE-205)
- Mentor: Guruh — bugun sizning zalingiz, pitchga esa 3 daqiqa beriladi: sizningcha, zal eng ko'p nimani ko'rmoqchi?
- Maket (chap): Sahna — telefon («Maydon Jamoa», O'yinlar ro'yxati) · o'ngda bo'sh taymer chizig'i 0–3:00 · zal — to'rt siluet, pufakda «?». Bo'laklar hali yo'q (SABOQ 4).
- Variantlar (radio, o'ng; bir uzunlikda):
  - Ilova telefonda qanday ishlab turganini (39)
  - Ilovaning hamma ekranlarini birma-bir (37)
  - Ilova qaysi texnologiyada qurilganini (37)
- Javob — «ishlab turganini»: **Aynan!** Zal ilova ishlab turganini o'zi ko'rmoqchi. Lekin avval u nega kerakligini ham eshitadi. (95)
- Javob — «ekranlarini»: **Qiziq fikr!** Hamma ekran 3 daqiqaga sig'maydi — zal ilova ishlab turganini ko'rmoqchi. (85)
- Javob — «texnologiyada»: **Qiziq fikr!** Texnologiya sizga muhim, zal esa ilova odamga nima qilishini ko'rmoqchi. (84)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent, ixcham qator bo'lib qoladi; zaldagi to'rt bosh telefonga buriladi, taymer chizig'i bir lahza to'liq yonib so'nadi (3:00).
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: O'tgan modulda pitch 5 daqiqa edi va yillik loyiha haqida edi. Bugun — yangi mahsulot va 3 daqiqa. Sinfdan so'rang: 3 daqiqada nimani aytmay qoldirardingiz?

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun 3 daqiqalik pitch yozib, sherigingizga aytasiz.** (53)
- Mentor: PRD, sinov yozuvlari va tuzatilgan rejangiz bugun kerak bo'ladi — ilovangiz telefonda ochilib tursin.
- Chap — «Dars oxirida» + vizual: Sahna skeleti — telefon (kulrang ekran-skelet) va to'rtta nomsiz bo'lak; kulrang chiziqlar 0.6 s oraliqda birma-bir to'q chiziqqa aylanadi, oxirida taymer chizig'i 3:00 gacha to'lib, zal ustida ✓.
  Matnsiz — 2-ekran kashfiyotini ochmaydi (P-015).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang, App.jsx `sub` so'zlari — 07 MD naqshi):
  - 01 · Muammoni dalil bilan aytishni bilib olasiz · `muammo`
  - 02 · Mahsulotni bir gapda aytishni o'rganasiz · `yechim`
  - 03 · Ilovani telefonda ko'rsatishga tayyorlanasiz · `jonli demo`
  - 04 · Pitchni sherigingizga aytib, baholatasiz · `baholash varag'i`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011); `sub` «muammo → yechim → jonli demo» — 01–03 teglari shu uch so'z, strelka reja matnida yozilmaydi (T-035; 07 MD naqshi).
  «ilovangiz» — 16-darsga kelib o'quvchida ilova (yoki web-trekda sayt) bor (T-039).

## 2 · To'rt bo'lak  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · to'rt bo'lak
- Sarlavha: **Zal 3 daqiqada nimani eshitadi va ko'radi?** (42) — 0-ekran savoliga javob (T-064)
- Mentor: O'tgan modulda pitch besh daqiqalik edi: bo'laklarni birma-bir qo'shib, taymerga qarang.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Uch daqiqaning qanchasi ilovani ko'rsatishga ketadi?** · 30 soniya · 1 daqiqa · 1,5 daqiqa —
  tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; qadam-tugmalar shundan keyin yoqiladi.
- Vizual (SABOQ 21): **chapda** telefon (O'yinlar) · **o'ngda** to'rt bo'sh bo'lak o'rni (uzuq chiziq), ostida bo'sh taymer chizig'i 0–3:00, ustida zal (pufakda «?»).
- Qadam chiplari (`QQadamlar`, ixcham, bir qatorda; joriysi accent, o'tgani ✓): 1 Muammoni qo'shing · 2 Yechimni qo'shing · 3 Ilovani ko'rsating · 4 Keyingi qadamni qo'shing
- **Harakat → Vizual o'zgarish:** joriy qadam chipini bosish → bo'lak yoziladi, taymer chizig'iga bo'lagi qo'shiladi, zal pufagi o'sha bo'lak savolini beradi va ✓ ga aylanadi:
  1. **Muammo** — muammo gapi va bitta kichik qator «5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan» · taymerda ≈40 s · pufak «Bu muammo borligini qayerdan bilasiz?» → ✓
  2. **Yechim** — yechim gapi · ≈20 s · pufak «Mahsulot nima qiladi?» → ✓
  3. uchinchi bo'lak (nomsiz, accent) · telefon o'zi o'ynaydi: O'yinlar → «Shanba 18:00 · Mahalla maydoni · 8 / 10» bosiladi → O'yin → «Qo'shilaman» → «9 / 10» · taymerda eng uzun bo'lak ≈1,5 daqiqa ·
     pufak «Ishlayotganini ko'rsata olasizmi?» → ✓. Shundan keyin bo'lak nomi chiqadi: **Jonli demo** (atama — misoldan keyin), `QIzoh`: Jonli demo bo'lagida ilova zal oldida telefonda ishlatib ko'rsatiladi. (70)
  4. **Keyingi qadam** — «Mahalla futbol guruhidan 10 kishini sinovga chaqiraman, keyin o'yindan oldin eslatma qo'shaman.» · ≈30 s · pufak «Endi nima qilasiz?» → ✓. Taymer 3:00 ga yetadi.
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: … · bu mashqda: taxminan 1,5 daqiqa» yoki «Taxminingiz mashqdagi taqsimotga mos».
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan qadamni bosing — zal qaysi bo'lakda nimani so'rashini ko'ring.
- Xulosa: Uch daqiqalik pitch to'rt bo'lakdan iborat: muammo, yechim, jonli demo va keyingi qadam. (88)
- Tugma (pastki): Bo'laklarni qo'shing (N/4) → Davom etish · `tugadi`: qadam chiplari yo'qoladi, Sahna butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy qadam chipi (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: Taymer bo'laklari — mashq uchun boshlang'ich taqsimot: o'z pitchida bo'lak qisqaroq yoki uzunroq bo'lishi mumkin, jami 3 daqiqa qoladi (10-Modul `11-FILTR` 6).
  O'tgan moduldagi besh slaydning Foydalanuvchi va Raqamlar slaydlari bugun jonli demo bo'lagiga sig'adi: zal ilovani o'zi ko'radi. Muammo va yechim nega birinchi — sinfdan so'rang.

## 3 · 1-savol  ← QTest (✔ D, `correctIdx 3`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · to'rt bo'lak
- Savol: **Uy vazifalari ilovasi: «5 sinfdoshdan 4 tasi vazifani chatda yo'qotgan». Qaysi bo'lakka?** (12 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — Jonli demoga — sonni telefonda ko'rsatadi (41)
  - B — Keyingi qadamga — bu sonni kamaytirish kerak (44)
  - C — Yechimga — ilova aynan shuni hal qiladi (39)
  - ✔ D — Muammoga — u muammo borligini ko'rsatadi (40)
- To'g'ri izohi: Bu sanoq muammo nechta odamda bo'lganini ko'rsatadi — u muammo bo'lagidagi dalil.
- Xato izohlari: A — Jonli demoda ilova ishlaydi, bu sanoq esa intervyudan. (54) · B — Keyingi qadam reja haqida, bu sanoq esa bo'lib o'tgan. (51) ·
  C — Yechim ilova nima qilishini aytadi, muammo sanog'ini emas. (58) · (umumiy) Bu sanoq nimani ko'rsatadi: muammonimi yoki ilovanimi? (54)
- Javob topilgach (QuestionScreen `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): to'rt bo'lak kartasi ixcham, «Muammo» bo'lagiga «4 / 5» qatori uchib tushadi.
- Izoh (MD): tire to'rtala variantda (S-003); A — 10-Modul «Raqamlar slaydi» odatiga tayanadi (bugungi pitchda son jonli demo bo'lagida ham bor — 9-ekran), lekin intervyu sanog'i — muammo dalili (S-004).

## 4 · Muammo va dalil  ← QTushuncha (ketma-ket, 3 qadam)
- Eyebrow: Tushuncha · dalil
- Sarlavha: **Muammo borligini zalga qanday ko'rsatasiz?** (42)
- Mentor: Muammo gapi intervyulardan keyin yozilgan edi: yoniga jadvaldan dalil qo'shib, zal savoliga qarang.
- Bashorat (ballsiz; S-015 — o'sish tartibida): **Bu misolda muammo gapi yonida nechta dalil turadi?** · 1 · 2 · 3 — tanlangach ixcham qator; qadamlar shundan keyin yoqiladi.
- Vizual (keng, ≤ 3 blok): **chapda** — Sahnaning faqat **Muammo** bo'lagi (katta karta: bitta yozilgan qator va ikki bo'sh uzuq qator) va uning ustida zal pufagi;
  **o'ngda** — sanoq jadvali (4-dars ko'rinishi, ixcham): ustunlar «Jamoa yig'ish (5)» · «Mahalla to'garaklari (5)» (kulrang); qatorlar — oxirgi marta muammo bo'lgan 4 / 5 · 3 / 5 ·
  hozir nima bilan 5 / 5 · 3 / 5 · eng qiyini 3 / 5 · 3 / 5 · harakat belgisi 4 / 5 · 1 / 5 (tayanch 1.3 aynan). ✎ F-1006-283: «2 / 5» tayanchga zid edi (quruvchi topdi) Telefon bu ekranda yo'q (SABOQ 24).
- Qadam chiplari (ixcham, bir qatorda): 1 Muammo gapini qo'ying · 2 Sanoqni qo'shing · 3 Harakat belgisini qo'shing
- **Harakat → Vizual o'zgarish:**
  1. bo'lakka muammo gapi yoziladi → pufak «Bu muammo borligini qayerdan bilasiz?»
  2. jadvalda «oxirgi marta muammo bo'lgan · 4 / 5» qatori yashil yonadi va bo'lakka uchadi: «5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan» → pufak «Ular bu ilovaga qiziqadimi?»
  3. jadvalda «harakat belgisi · 4 / 5» qatori yonadi (to'garaklar ustunidagi «1 / 5» kulrang qoladi), bo'lakka uchadi: «5 o'yinchidan 4 tasi birinchi versiyani sinab ko'rishga kun belgiladi» → pufak o'rnida ✓,
     bo'lak burchagida yashil ✓. Qatorlar yonida yorliqlar chiqadi: **sanoq** · **harakat belgisi**.
  3/3 dan keyin `QIzoh` (halol qator, 4-dars aynan): 10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas. (60)
  Natija qatori (`QTaxmin`): «Taxminingiz: … · bu misolda: 2» yoki «Taxminingiz to'g'ri chiqdi».
  Ipucha (40 s): Yoqilgan qadamni bosing — zal savoli qanday o'zgarishini ko'ring.
- Xulosa: Bu misolda muammoni ikki dalil ko'rsatdi: necha kishida bo'lgani va kim sinovga kun belgilagani. (97)
- Tugma (pastki): Dalillarni qo'shing (N/3) → Davom etish · `tugadi`: qadam chiplari va jadval yo'qoladi, bo'lak butun enga.
- Keyingi bosiladigan joy: bashorat → joriy qadam chipi → «Davom etish».
- O'qituvchi eslatmasi: Harakat belgisi 3-darsda o'tilgan: «Birinchi versiya tayyor bo'lganda, uni sinab ko'rishga 10 daqiqa vaqt berasizmi? Qaysi kunni belgilaysiz?». Zal «Nega to'garaklar emas?» deb so'rasa — o'sha ustunda kun belgilagan 5 tadan 1 tasi.
  9-Modulda o'tilgan hikoya (bitta odam bilan bo'lib o'tgan ish) ham 3 daqiqaga sig'adi — bitta jumla bilan, masalan 3-darsdagi 1-yozuv: «o'tgan shanba: 10 kishi kerak edi, 7 kishi keldi». Halol qatorni o'tkazib yubormang: 10 intervyu — isbot emas.

## 5 · 2-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · dalil
- Savol: **Uy vazifalari ilovasiga qiziqishni qaysi dalil ishonarliroq ko'rsatadi?** (8 so'z) · savol ustida yorliq yo'q
  - A — 5 kishidan 4 tasi «Albatta yuklab olaman» dedi (46)
  - ✔ B — 5 kishidan 3 tasi sinab ko'rishga kun belgiladi (45)
  - C — 5 kishidan 5 tasi «G'oya juda yaxshi ekan» dedi (47)
  - D — 5 kishidan 4 tasi muammo haqida uzoq gapirdi (44)
- To'g'ri izohi: Sinab ko'rishga kun belgilash — so'z emas, ish: bu harakat belgisi.
- Xato izohlari: A — Bu va'da: odam hali hech narsa qilmadi. (39) · C — Bu fikr: maqtov qiziqishni ish bilan ko'rsatmaydi. (49) ·
  D — Uzoq gap muammoni ko'rsatadi, ilovaga qiziqishni emas. (54) · (umumiy) So'z bilan aytilganmi yoki qilinganmi — shunga qarang. (54)
- Javob topilgach (kichik, savol ostida): ikki ustun — «So'z» (A, C) · «Ish» (B), D kulrang «muammo haqida».
- Izoh (MD): to'g'ri variantda son eng kichik (3) — son emas, dalil turi so'raladi (T-043: test sonni o'qishni so'raydi, bashorat qildirmaydi). Qo'shtirnoq ikki variantda (A, C), ikki variantda yo'q (B, D) — belgi yolg'iz to'g'rida emas.
  A va C — 9-Modul «fikr yoki va'da» (`m7-12`), kelajak savoli («ishlatarmidingiz?») taqiqi bilan bir (tayanch 1.3). «Albatta» — iqtibos ichida (T-008).

## 6 · iPhone  ← QVoqea (PM keys K19; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **iPhone birinchi marta qanday taqdim etilgan?** (44)
- Nuqtalar (3) · yorliq **iPhone · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **iPhone** — Apple kompaniyasining telefoni. Nokia va BlackBerry — 2007-yilda telefon chiqargan kompaniyalar.
  Nomlar o'z rangida (iPhone — Apple'ning qora-kulrangi · Nokia — ko'k · BlackBerry — qora; rang — quruvchi bilan, TAYANCHGA SAVOL 9), logotip yo'q.
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; SABOQ 8). Sahnada faqat bosqich nomi va jonli maket.
- Sahna (`IphoneSahna`, chizilgan CSS/SVG; bosqichga qarab o'zgaradi; bankda yo'q narsa chizilmaydi — sotuv, narx, zal, son yo'q):
  - 1/3 **Ko'p tugma** — Mentor: 2007-yilda telefon kompaniyalari tugmasi ko'proq telefon qilishda bellashgan. Nokia va BlackBerry kabi telefonlarda klaviatura yoki stilus bo'lgan.
    · sahna: ikki chizilgan telefon — biri to'liq klaviaturali (mayda tugmalar birma-bir yonib, ko'payib boradi), ikkinchisi yonida stilus qalami; nomlari ostida, o'z rangida.
    · bashorat (sahna ostida, bitta qator; S-015 — 1 → 3): **Stiv Jobs iPhone'ni nechta qurilma deb taqdim etgan?** · 1 · 2 · 3 — tanlangach ixcham qator natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
    · bashorat ustida bitta kulrang qator (S-018): Stiv Jobs — o'sha paytdagi Apple rahbari. (TAYANCHGA SAVOL 9)
  - 2/3 **Bitta ekran** — Mentor: Apple esa klaviatura, stilus va deyarli hamma tugmani olib tashlagan. Telefonda bitta ekran va Home tugmasi qolgan.
    · sahna: klaviatura tugmalari birma-bir so'nib yo'qoladi, stilus chiqib ketadi → o'rtada iPhone siluetida bitta katta ekran va pastda bitta doira tugma (yorliq «Home»); nom «iPhone» o'z rangida.
  - 3/3 **Uch qurilma bittada** — Mentor: Stiv Jobs iPhone'ni «uch qurilma bittada» deb taqdim etgan: iPod, telefon va internet. iPod — Apple'ning musiqa pleeri.
    · sahna: uchta kichik chizilgan qurilma — pleer (yorliq «iPod»), go'shak (yorliq «telefon»), brauzer oynasi (yorliq «internet») — navbat bilan iPhone ekraniga uchib kiradi; ekran ustida yozuv «uch qurilma bittada».
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: N · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan keyin, pastda, yashil): Apple tugmalarni olib tashlagan, Jobs esa iPhone'ni bitta ibora bilan taqdim etgan: «uch qurilma bittada». (106)
- Tugma (pastki): Keyingi bosqich (N/3) → Davom etish
- O'qituvchi eslatmasi: Taqdimot 9-yanvar 2007 da bo'lgan, yozuvi ochiq — vaqt bo'lsa, «uch qurilma» qismini proyektorda qisqa ko'rsating (bank: fragment ko'rsatish mumkin).
  Ko'prik: pitchdagi Yechim bo'lagi ham shunday — mahsulot bir gapda. Bankdan tashqari fakt qo'shmang: sotuv, narx, «jonli ko'rsatdi» — yo'q. Bu misoldan «hamma pitch shunday» degan qoida chiqarmang.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K19 (263–266-qatorlar; bank: «raqamsiz; taqdimot 9-yanvar 2007, yozuvi ochiq, parcha ko'rsatish mumkin» — ruschadan) · tayanch 5.
  «Stiv Jobs — o'sha paytdagi Apple rahbari», «iPod — Apple'ning musiqa pleeri», «Nokia va BlackBerry — 2007-yilda telefon chiqargan kompaniyalar» — S-018 izohlari, bankda so'zma-so'z yo'q (shubhali joylar).

## 7 · 3-savol  ← QTest (✔ C, `correctIdx 2`; iPhone qoidasi — «Maydon Jamoa»da)
- Eyebrow: Tekshiruv · bir gapda
- Savol: **Zal «Maydon Jamoa nima qiladi?» deb so'radi. Qaysi javob mos?** (10 so'z) · savol ustida yorliq yo'q
  - A — «Unda o'yinlar, o'yin va e'lon berish ekranlari bor» (52)
  - B — «U Expo, NestJS va Neon Database yordamida qurilgan» (52)
  - ✔ C — «O'yinchi e'londagi o'yinga bir bosishda qo'shiladi» (52)
  - D — «U mahalladagi mini-futbol o'yinchilari uchun qilingan» (55)
- To'g'ri izohi: Bu gap ilova o'yinchiga nima qilib berishini bitta gapda aytadi.
- Xato izohlari: A — Ekranlar ro'yxati ilova nima qilishini aytmaydi. (48) · B — Texnologiya zalga ilova nima qilishini aytmaydi. (49) ·
  D — Bu — kim uchun; ilova nima qilishi aytilmagan. (46) · (umumiy) Ilova odamga nima qilib berishini aytgan javobni toping. (56)
- Javob topilgach (kichik, savol ostida): Sahnaning Yechim bo'lagi — to'liq yechim gapi, to'g'ri variant so'zlari unda ajralib turadi.
- Izoh (MD): to'g'ri variant — yechim gapining o'rta qismi (1.4: «…o'yinchilar bir bosishda qo'shiladi…»); to'liq gap variant uchun uzun. A, B, D — rost, lekin mos emas (S-004: ekranlar ro'yxati — 1.6, stek — Qaror-0 12, kim uchun — 1.1).
  Qo'shtirnoq to'rtalasida; to'g'ri variant eng uzuni emas (D eng uzun).

## 8 · Jonli demo  ← QTushuncha (ketma-ket, 3 qadam)
- Eyebrow: Tushuncha · jonli demo
- Sarlavha: **Telefonda zalga qaysi harakatni ko'rsatasiz?** (44)
- Mentor: Pitch boshlanganda ilova kutib qolsa, zal ham kutadi: qadamlarni birma-bir bosing.
- Bashorat (ballsiz; S-015 — o'sish tartibida): **Bepul Backend uxlab qolgan bo'lsa, ilova birinchi ochilishda qancha kutadi?** · bir necha soniya · yarim daqiqa · bir daqiqagacha — tanlangach ixcham qator.
- Vizual: **chapda** — telefon («Maydon Jamoa») · **o'ngda** — to'rt bo'lak ixcham (Muammo va Yechim ✓, **Jonli demo** accent, Keyingi qadam kulrang) va taymer chizig'i; zal pufagi «Ishlayotganini ko'rsata olasizmi?».
- Qadam chiplari (ixcham, bir qatorda): 1 Ilovani oldindan oching · 2 Asosiy harakatni ko'rsating · 3 Sinovdagi tuzatishni ayting
- **Harakat → Vizual o'zgarish:**
  1. telefonda **kutish yozuvi** — «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» va ingichka chiziq sekin uzayadi (sahnada tezlashtirilgan, ~2 s), telefon ustida kulrang yorliq «pitchdan oldin»; taymer chizig'i hali kulrang (pitch boshlanmagan).
     Chiziq to'lgach O'yinlar ro'yxati ochiladi («Shanba» · «Yakshanba»). `QIzoh`: Bu kutish pitchdan oldin o'tdi — taymer hali boshlanmagan. (58)
  2. taymer yuradi: Muammo va Yechim bo'laklari tez yozilib chiqadi, Jonli demo bo'lagi accent · telefonda «Shanba 18:00 · Mahalla maydoni · 8 / 10» bosiladi → O'yin ekrani → «Qo'shilaman» → «9 / 10», tugma «Qo'shildingiz» (o'chiq) ·
     pufak o'rnida ✓. `QIzoh`: Asosiy harakat — sinov vazifasidagi ish: «Shanba soat 18:00 dagi o'yinga qo'shiling.» (85)
  3. telefon O'yinlar ro'yxatiga qaytadi, «Shanba» sarlavhasi accent halqa bilan bir lahza ajraladi; Jonli demo bo'lagiga qator yoziladi: «Sinovda 3 kishidan 3 tasi bu o'yinni topishda to'xtadi — ro'yxatni kun bo'yicha qildik.» ·
     taymer chizig'i Jonli demo bo'lagi oxirigacha yetadi (≈1,5 daqiqa), bo'lak burchagida yashil ✓.
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: bir daqiqagacha» yoki «Taxminingiz to'g'ri chiqdi».
  Ipucha (40 s): Yoqilgan qadamni bosing — telefonda nima o'zgarishini ko'ring.
- Xulosa: Bu misolda jonli demo — oldindan ochilgan ilovada bitta asosiy harakat va sinovdagi tuzatish. (93)
- Tugma (pastki): Qadamlarni bajaring (N/3) → Davom etish · `tugadi`: qadam chiplari yo'qoladi, telefon va bo'laklar butun enga.
- Keyingi bosiladigan joy: bashorat → joriy qadam chipi → «Davom etish».
- O'qituvchi eslatmasi: Render bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈ 1 daqiqa (tayanch 6) — 15-darsdagi 1-risk shu edi. Pitchdan 2–3 daqiqa oldin ilovani bir marta oching.
  Mobil trekda Expo Go laptopdagi `npx expo start` ga ulanadi: laptop yoniq, telefon va laptop bitta Wi-Fi'da (ishlamasa — `npx expo start --tunnel`). Web-trekda mahsulot telefon brauzerida yoki bosh ekrandagi PWA'da ochiladi.
  Zaxira: ilovani ishlatayotgan ekran videosi (telefonning ekran yozuvi bilan oldindan) — jonli ko'rsatish ishlamasa, shuni ko'rsatadi; bu Demo Day 7 da ham asqotadi (o'quvchiga va'da qilib aytilmaydi).

## 9 · Kod yozish: Database'dan son  ← QKod (Neon varianti — kod oynasi o'rnida Neon maketi; tayanch 4 «16»)
- Eyebrow: Kod yozish · Neon
- Sarlavha: **Pitch uchun sonni Database'dan oladigan SQL yozamiz.** (52) — PM-082(a) sarlavha oilasi («…digan SQL yozamiz», korpus §19)
- Mentor: Jonli demo bo'lagiga Database'dagi son qo'shiladi: SQL'ni o'zingiz yozib, Neon ko'rsatgan sonni oling.
- Chap (vazifa, 3 band; bosiladigan katakcha emas — qadam ro'yxati):
  1 Neon'da loyihangizni oching va SQL Editor'ga o'ting.
  2 Avval 1-SQL'ni yozib «Run»ni bosing va sonni yozib oling; keyin uni 2-SQL bilan almashtiring (bo'sh joyni to'ldirib) va yana «Run».
  3 Neon ko'rsatgan ikki sonni pastdagi maydonlarga yozing.
- SQL (ekranda, Mentor misoli; nusxalash tugmasi yo'q — qo'lda yozganda o'rganiladi, korpus §19):
```sql
-- 1) nechta o'yin e'lon qilingan
SELECT COUNT(*) FROM oyinlar;

-- 2) hozir o'yinlarda nechta joy band
SELECT COUNT(*) FROM ______
WHERE holat IN ('qoshildi', 'keladi');
```
- Maydonlar (vazifa ostida, ikki qator): **1-son: ___ ta ___** (placeholder: `son` · `masalan: o'yin`) · **2-son: ___ ta ___** (placeholder: `son` · `masalan: band joy`) ·
  tekshiruv (`QXato`, bloklaydi; son bo'lmasa): Neon ko'rsatgan sonni shu yerga yozing. (39)
- Darvoza-mashq (ballsiz, sonlar yozilgandan keyin; PM-082 c/e): **Neon ko'rsatgan songa nimalar kiradi?** · Faqat sinovchilar qilgan ishlar · ✔ Namuna va tekshiruv qatorlari ham · Faqat oxirgi haftadagi qatorlar
  - xato «sinovchilar»: Sinovchini ajratadigan shart yo'q — hamma qator sanaldi. (56)
  - xato «oxirgi hafta»: SQL'da vaqt sharti yo'q — hamma kunlar sanaldi. (47)
- Yordam: Jadvallaringiz nomi `README.md` dagi «Arxitektura» bo'limida; SQL Editor'da `\dt` yozsangiz, jadvallar ro'yxati chiqadi. Holat ustuni bo'lmasa — `WHERE` qatorini olib tashlang.
  Eslatma: bo'sh joyga kim qaysi o'yinga qo'shilganini saqlaydigan jadval — `ishtirokchilar` yoziladi. SQL darslaridan: `COUNT(*)` — qatorlarni sanaydi · `WHERE` — qaysi qatorlar olinishi · `IN (…)` — qiymat qavsdagilardan biri bo'lsa.
  Database'ga kira olmasangiz — sonni o'ylab topmang: jonli demo bo'lagi sonsiz ham to'liq (pastdagi «Database'ga kira olmadim»).
- O'ng — Neon maketi (`NeonMaket`, chizilgan; logotip yo'q; 10-Modul `m8-11` komponentining davomi): tepada SQL Editor oynasi — ikki SQL (bo'sh joy bilan), o'ng burchakda «Run»; ostida ikki natija jadvali, har birida ustun `count` va bitta katak — kulrang «?».
  Maket ostida (`QIzoh`): Sizning soningiz shu katakda chiqadi — u sizning Database'ingizdan. (67)
  Ostida — Sahnaning Jonli demo bo'lagi ixcham: bo'sh qator «Database'da: …».
- **Harakat → Vizual o'zgarish:** o'quvchi bo'sh joyni o'zi yozadi (Neon'da) → maydonga son yozilganda maket katagidagi «?» o'rniga o'quvchining soni chiqadi →
  darvozada to'g'ri tanlov → son maketdan bo'lakka uchadi va qator yoziladi (P-046 — o'quvchining sonlari va so'zlari):
  «Database'da {a} ta {1-nima} va {b} ta {2-nima} bor — ichida namuna va tekshiruv yozuvlari ham bor.»
- Tugmalar: **Bajardim — SQL ishladi, son yozildi** (qulf: son yozilmagan bo'lsa — «Avval Neon ko'rsatgan sonni yozing»; darvoza yechilmagan bo'lsa — «Avval son savolini yeching») ·
  ikkinchi (chegarali): **Database'ga kira olmadim** → bo'lakka son yozilmaydi, nishon yo'q, «Davom etish» ochiladi (P-026: dars bitta tashqi bog'liqlikka osilmaydi).
- Hammasi bajarilgach (yashil): Son Database'dan olindi — u jonli demo bo'lagiga yozildi. (57)
- O'qituvchi eslatmasi: `SELECT *` emas — faqat son: telefon raqamlari ekranga chiqmasin (10-Modul qoidasi). Laptop va Render bitta Neon Database'ga yozadi — o'quvchining o'z tekshiruvlari ham sanaladi (10-Modul tayanchi 9.11).
  `ishtirokchilar` qatori — bitta qo'shilish: bitta o'yinchi ikki o'yinga qo'shilsa, ikki marta sanaladi; shuning uchun «o'yinchi» emas, «band joy». `chiqdi`, `navbatda` sanalmaydi — son butun tarixni emas, hozirgi holatni ko'rsatadi (9.74). Tez tugatganlar: `SELECT holat, COUNT(*) FROM ishtirokchilar GROUP BY holat;` — qaysi holatda nechta.
- Manba (o'quvchi ko'rmaydi): Neon rasmiy hujjati — «Select Postgres database > SQL Editor … Enter a query into the editor and click Run» (neon.com/docs/get-started/query-with-neon-sql-editor; 10-Modul `11-PmPitchRehearsal-v3.md` da 05.10 ochilgan);
  `\dt` — o'sha sahifa: «The Neon SQL Editor supports using Postgres meta-commands» (`\dt`, `\d`, `\l` …; 06.10 qayta ochildi); bir nechta SQL — «a separate result set for each statement» (16-FILTR 18–20). Jadval va holat nomlari — tayanch 1.6 (`oyinlar`, `ishtirokchilar`, `holat`: `qoshildi` / `keladi` / `navbatda` / `chiqdi`).

## 10 · Pitch yozish  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Pitchingizni to'rt bo'lakka yozing.** (35)
- Mentor: Oldingi darslarda yozganlaringiz shu yerda: har bo'lakni tekshirib, «Saqlash»ni bosing.
- Kirish (P-046, M-q5; saqlangan narsa bo'lsa — o'zi qo'yiladi, tahrirlash mumkin; yo'q bo'lsa — bo'sh, o'quvchi o'zi yozadi):
  - `pm-m9d5-prd` → Muammo «Muammo gapi» (`muammo`), «Dalil» (`dalil`); Yechim (`yechim`). PRD bo'lmasa: `pm-m9d4-final` → «Muammo gapi» (`muammoGapi`) (TAYANCHGA SAVOL 11).
  - `pm-m9d13-sinov` → Jonli demo «Sinovdagi tuzatish» (`tuzatildi: true` bo'lsa; `false` — bo'sh; 9.90): «Sinovda {n} kishidan {k} tasi «{eng to'xtash matni}» joyida to'xtadi — o'zgartirdim.» +
    `qaytaSinov.natija` bo'lsa: «Qayta sinovda bu safar takrorlanmadi.» / «Qayta sinovda yana to'xtadi.» (`tur: 'mashq'` bo'lsa — «Mashq sinovida …»). Isbot so'zi yo'q — fakt (16-FILTR 2).
  - 9-ekrandagi qator → Jonli demo «Son» (bo'lmasa — bo'sh, ixtiyoriy).
  - `pm-m9d15-reja` → Keyingi qadam ustida tugmalar: uchta risk qadami (`risklar[].qadam`; «Avval» belgilangani — `birinchi` — birinchi turadi va halqada) va «boshlanmadi» / «kechikdi» holatidagi ishlar (`holatlar[].ish`); bosilgani maydonga yoziladi (tahrirlanadi). Tugmalar ustida kulrang qator: Uyda «Avval» qadamini bajargan bo'lsangiz — keyingisini tanlang. (64)
- **Tepada — ixcham chiziq «Pitchim · n/4»:** bo'lak nomlari, yozilgani ✓ (bo'sh uzuq qatorlar yo'q, SABOQ 17).
- **Markazda — bitta katta bo'lak kartasi (joriy; bosqich chiplari 1–4: Muammo · Yechim · Jonli demo · Keyingi qadam — joriysi accent, yozilgani ✓):**
  1. **Muammo** — «Muammo gapi» (placeholder: `Kim nimadan qiynaladi?`) · «Dalil» (placeholder: `Necha kishidan nechtasida? Kim sinovga kun belgiladi?`)
  2. **Yechim** — «Bir gap» (placeholder: `Mahsulot odamga nima qiladi?`)
  3. **Jonli demo** — «Asosiy harakat» (placeholder: `Telefonda qaysi harakatni ko'rsatasiz?`) · «Sinovdagi tuzatish» (placeholder: `Sinovda nima topildi, nimani tuzatdingiz?`) · «Son» (9-ekrandan; ixtiyoriy)
  4. **Keyingi qadam** — tugmalar (rejadan) · maydon (placeholder: `Rejangizdagi birinchi ish`)
  «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob maydon ostida; yo'naltiruvchilari ikkinchi «Saqlash» bilan o'tadi):
  - Dalilda son yo'q (bloklaydi): Dalilga sanoqni yozing: necha kishidan nechtasi? (48)
  - Dalilda «hamma», «ko'pchilik», «har kim» (yo'naltiradi): Bu so'z sanoq emas — necha kishidan nechtasi? (45)
  - Muammo gapida xohish so'zlari («xohlaydi», «yoqadi», «bo'lsa yaxshi») (yo'naltiradi): Bu xohish — kim nimadan qiynalgani ko'rinmaydi. (47)
  - Yechimda ikki va undan ko'p gap (nuqta, «!» yoki «?» bilan ajralgan) (yo'naltiradi): Yechimni bitta gapga sig'diring. (32)
  - Yechimda texnologiya nomlari — «React», «Expo», «NestJS», «Neon», «Render», «Netlify» (yo'naltiradi): Bu texnologiya — mahsulot odamga nima qiladi? (45)
  - Asosiy harakat bo'sh (bloklaydi): Telefonda ko'rsatadigan bitta harakatni yozing. (47)
  - Keyingi qadam bo'sh (bloklaydi): Rejangizdan bitta keyingi qadamni yozing. (41)
  - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam: Yechimni tekshiring: uni bir nafasda ayta olasizmi? Dalilda sanoq bo'lsin; harakat belgisi bo'lsa — uni ham yozing. Asosiy harakat — sinov vazifangizdagi ish. Keyingi qadamni tuzatilgan rejangizdan oling.
  Web-trekda ham shunday: jonli demo — mahsulotingiz telefon brauzerida.
- **Harakat → Vizual o'zgarish:** reja tugmasi → matn maydonga sirg'alib yoziladi. «Saqlash» → karta kichrayib tepadagi chiziqqa uchadi (bo'lak nomi yonida ~1 s yashil ✓), pastdan keyingi bo'lak kartasi kiradi;
  tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. 4/4 da karta yopiladi; Sahna butun enga — to'rt bo'lak o'quvchi matni bilan (uzun matn «…» bilan qisqaradi, karta cho'zilmaydi — SABOQ 29), har bo'lakda ✎.
- Xulosa (o'quvchi ma'lumotidan, P-046): To'rt bo'lak tayyor: dalilda sanoq bor, yechim — bir gapda, telefonda — bitta harakat. (86) · sanoq bo'lmasa (yo'naltiruvchi o'tkazilgan): To'rt bo'lak tayyor — dalilga sanoq qo'shing. (45)
- Tugma (pastki): To'rt bo'lakni yozing (N/4) → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → reja tugmalari (4-bosqichda) → «Saqlash» (maydon yozilgach halqada).
- Artefakt-strip (U-042): shu ekrandan — «Pitchim · n/4» (ixcham); 11, 15-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Nishon: Four Parts! (4/4 saqlanganda).
- Mentor rejimi: forma o'rniga «Maydon Jamoa» pitchi (to'rt bo'lak, ochiq); o'quvchilar o'z ekranida yozadi. Mentor statistikasi: «To'rt bo'lakni yozganlar» · «Dalilida sanoq borlar».
- O'qituvchi eslatmasi: Eng ko'p xato — yechim o'rniga texnologiya yoki ekranlar ro'yxati: «Mahsulot odamga nima qiladi?» deb so'rang. 12 daqiqadan keyin juftlikka o'ting; ulgurmagan bo'lak uyda yoziladi.

## 11 · Juftlikda pitch  ← QMustaqil (juftlik, 3 qadam; yakka rejim bor)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Pitchingizni sherigingizga 3 daqiqada ayta olasizmi?** (52) · yakka rejimda: **Pitchingizni 3 daqiqada ayta olasizmi?** (38)
- Mentor: Ilovani telefonda ochib qo'ying, keyin «3 daqiqani boshlash»ni bosib, sherigingizga ayting.
  Yakka rejimda: Ilovani telefonda ochib qo'ying, keyin «3 daqiqani boshlash»ni bosib, pitchni ovoz chiqarib ayting.
- Qadam chiplari (ixcham, tepada): 1 Ayting · 2 Baholang · 3 Tuzating
- 1-qadam:
  - «Pitchdan oldin» — bitta kulrang blok, uch qator (bosilmaydi, katakchasiz — korpus §19):
    Mobil trekda: laptopda `npx expo start` ishlab turibdi, ilova telefonda Expo Go'da ochiq. · Web-trekda: mahsulot telefon brauzerida ochiq. · Ilovani bir marta ochdingiz — birinchi ekran chiqdi.
  - Taymer (har o'quvchi o'z navbatida, o'z dars qurilmasida): 3 daqiqani boshlash · Hozir siz gapirasiz · To'xtatish · Qaytadan. 3:00 dan keyin taymer to'xtamaydi — qizil «+m:ss».
    Juftlik yo'rig'i (bir qator): Avval A gapiradi, B tinglaydi; keyin almashasiz.
  - Ilova ochilmasa (bitta kulrang qator, P-026): Ilova ochilmasa — ekran videosini ko'rsating yoki jonli demo bo'lagini og'zaki aytib bering. (92)
- 2-qadam — baholash varag'i (sherik to'ldiradi, gapiruvchining dars qurilmasida; gapiruvchi shu payt telefonda ilovani ko'rsatadi): to'rt qator — bo'lak nomi · zal savoli (`ZAL_SAVOL`) · ✓ / ✗ · izoh (placeholder: `Nima yetishmadi?`);
  pastda «Vaqt: m:ss» — taymerdan o'zi yoziladi.
  Mentor gapi 2-qadamda (almashadi): Gap tugagach, dars ochiq turgan qurilmangizni sherigingizga bering — u har bo'lakka ✓ yoki ✗ qo'yadi.
- 3-qadam — tuzatish: ✗ olgan qatorni bosish → shu bo'lak kartasi (10-ekrandagi matn bilan) ochiladi → o'zgartirib «Saqlash». Hammasi ✓ bo'lsa — sherik «yanada aniqroq bo'lishi mumkin» deb yozgan bo'lak ochiladi.
  Mentor gapi 3-qadamda: ✗ olgan bo'lakni varaqdagi izohga qarab qayta yozing.
- Tekshiruv (`QXato`, ≤60):
  - belgisiz qator (bloklaydi): Har bo'lakka ✓ yoki ✗ qo'ying. (30)
  - ✗ qatorida izoh 8 belgidan qisqa (bloklaydi): ✗ qo'ydingiz — nima yetishmaganini bir qatorda yozing. (54)
  - to'rtta ✓ (yo'naltiradi): Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin? (56)
  - izohda «yomon», «zerikarli», «yoqmadi» (yo'naltiradi): Odam haqida emas — bo'lakda nima yetishmadi? (44)
  - tuzatishda matn o'zgarmagan (bloklaydi): Matn o'zgarmadi — varaqdagi izohni qayta o'qing. (48)
- Vaqt qatori (`QIzoh`, faqat «Vaqt» 3:00 dan oshgan bo'lsa): Vaqt 3 daqiqadan oshdi — ortiqcha gapni oling, telefonda bitta harakat qoldiring. (81)
- Vizual: Sahna — o'quvchining to'rt bo'lagi (10-ekrandan, ixcham) va taymer chizig'i (to'rt bo'lakli; taymer yurganda joriy bo'lak accent); 2–3-qadamda o'ngda varaq. Telefon maketi yo'q — ilova o'quvchining qo'lida (SABOQ 20: bo'sh ustun yo'q).
  10-ekran yozilmagan bo'lsa (mentor rejimi) — «Maydon Jamoa» pitchi.
- **Harakat → Vizual o'zgarish:** taymer → taymer chizig'i to'lib boradi, joriy bo'lak accent; 3:00 dan oshsa chiziq qizil davom etadi. Varaq to'ldirilganda ✓ bo'laklar yashil ✓, ✗ bo'laklar `err` chet oladi; «Vaqt» qatori taymer ko'rsatgan vaqtni yozadi.
  Tuzatish «Saqlash» → bo'lak `err` chetdan yashil ✓ ga o'tadi, ustida yorliq «tuzatildi»; varaq qatorida ✗ yonida «tuzatildi». Kamida bitta bo'lak tuzatilgach «Davom etish» ochiladi (qolgan ✗ — bloklamaydi).
- Xulosa: Varaq to'ldi va bitta bo'lak tuzatildi. Qolgan ✗ bo'laklar — uyga vazifada. (75)
- Tugmalar: Orqaga · Davom etish (bitta bo'lak tuzatilgach)
- Saqlanadi: `pm-m9d16-pitch` (TAYANCHGA SAVOL 5).
- Keyingi bosiladigan joy: «3 daqiqani boshlash» → «To'xtatish» → varaq qatorlari (✓ / ✗) → ✗ qator → «Saqlash».
- Nishonlar: Three Minutes! (taymer to'xtatilib, varaq to'lganda) · Fixed It! (birinchi tuzatilgan bo'lakda).
- Mentor rejimi: proyektorda katta taymer 3:00 va to'rt bo'lakli chiziq — ko'ngilli guruh oldida aytadi; guruh har bo'lakka qo'l ko'tarib ✓ yoki ✗ beradi, Mentor varaqni ekranda to'ldiradi.
  Mentor statistikasi: «Pitchni aytganlar» · «3 daqiqaga sig'ganlar» · «Bo'lak tuzatganlar».
- O'qituvchi eslatmasi: Taymerni sinf bo'ylab bir vaqtda boshlating: avval hamma A, keyin hamma B (2 × 3 daqiqa + varaq ≈ 10 daqiqa). Vaqt qolsa — 1–2 ko'ngilli guruh oldida, Mentor rejimida (har biri ≈ 4 daqiqa; 90 daqiqa hisobida yo'q).
  Tinglovchi bo'lak haqida yozadi, odam haqida emas (qattiq, lekin hurmatli fidbek — 10-Modulda o'tilgan). Pitch shu ko'rinishda Demo Day 7 ga boradi — o'quvchiga va'da qilib aytilmaydi (T-038).

## 12 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi olam — P-002)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Kitob ilovangiz Database'ida 12 ta kitob; 5 tasi — tekshiruv yozuvingiz. Nima deysiz?** (12 so'z) · savol ustida yorliq yo'q
  - ✔ A — «12 ta kitob bor, 5 tasini o'zim qo'shganman» (45)
  - B — «Ilovamga hozircha 12 ta kitob qo'shilib bo'ldi» (48)
  - C — «Ilovamga 12 ta o'quvchi o'z kitobini qo'shgan» (47)
  - D — «Ilovamga allaqachon juda ko'p kitob qo'shildi» (47)
- To'g'ri izohi: Son va unga nima kirgani birga aytildi — zal xulosani o'zi chiqaradi.
- Xato izohlari: B — Son rost, lekin ichida tekshiruvlaringiz ham bor. (49) · C — SQL kitoblarni sanadi, o'quvchilarni emas. (40) ·
  D — Zal aniq sonni eshitmadi. (25) · (umumiy) Son va unga nima kirganini birga ayting. (40)
- Javob topilgach (kichik, savol ostida): Sahnaning Jonli demo bo'lagi ixcham — «Database'da: 12 ta kitob · ichida 5 ta tekshiruv».
- Izoh (MD): ikki qoida birga — 9-ekran (songa nima kiradi) va 10-Modul halol gapi; qo'shtirnoq to'rtalasida; C — sanoq birligi xatosi (10-Modul `11-FILTR` 7: buyurtma soni kishi soni emas).
  B — rost, lekin to'liq emas (S-004). Sonlar mashq uchun (P-002).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Qaysi bo'lak · 2 — Ish bilan dalil · 3 — Bir gapda yechim · 4 — Songa nima kirgan

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Uch daqiqalik pitch qaysi to'rt bo'lakdan iborat? | Muammo, yechim, jonli demo va keyingi qadam |
| Muammo bo'lagida muammo gapi yonida nima turadi? | Dalil: necha kishida bo'lgani va harakat belgisi |
| Harakat belgisi nimani ko'rsatadi? | Odam qiziqishni so'z bilan emas, ish bilan ko'rsatganini — masalan, sinovga kun belgilagani |
| 10 intervyu natijasi isbot bo'ladimi? | Yo'q: 10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas |
| Yechim bo'lagida nima aytiladi? | Mahsulot odamga nima qilishi — bir gapda |
| Stiv Jobs iPhone'ni qanday taqdim etgan? | «Uch qurilma bittada»: iPod, telefon va internet |
| Apple iPhone'dan nimalarni olib tashlagan? | Klaviatura, stilus va deyarli hamma tugmani: bitta ekran va Home tugmasi qolgan |
| Jonli demo bo'lagida nima qilinadi? | Ilova zal oldida telefonda ishlatib ko'rsatiladi — bitta asosiy harakat |
| Nega ilovani pitchdan oldin bir marta ochasiz? | Bepul Backend uxlab qolgan bo'lsa, birinchi ochilish bir daqiqagacha kutadi |
| Database'dagi songa nimalar kiradi? | Namuna va o'z tekshiruv yozuvlaringiz ham — pitchda shuni aytasiz |
| Keyingi qadam bo'lagiga nima yoziladi? | Tuzatilgan rejangizdagi birinchi ish |
| Baholash varag'ida har bo'lak uchun nima bor? | Zalning bitta savoli — sherik ✓ yoki ✗ qo'yadi va izoh yozadi |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (to'rt bo'lak — 2 · dalil, sanoq, harakat belgisi, halol qator — 4 · iPhone — 6 · jonli demo, oldindan ochish — 2, 8 · Database soni — 9 · keyingi qadam — 2, 10 · varaq — 11).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **3 daqiqalik pitchingiz tayyor va baholandi.** (43) · 11-ekran o'tkazilgan bo'lsa (P-046): **Pitchingiz to'rt bo'lakka yozildi.** (34)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Uch daqiqada zal muammoni dalil bilan eshitadi, yechimni bir gapda tushunadi va ilovani telefonda ko'radi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Muammo bo'lagida sanoq va harakat belgisi turadi; 10 intervyu — dalil, isbot emas.
  - Yechimni bir gapda aytasiz: mahsulot odamga nima qiladi.
  - Ilovani pitchdan oldin ochib qo'yasiz va telefonda bitta asosiy harakatni ko'rsatasiz.
  - Database'dagi sonni aytganda, unga nimalar kirganini ham aytasiz.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: oila a'zosi yoki do'stingiz · Nechta: 1 repetitsiya · Muddat: keyingi darsgacha
  - ① Pitchni bir kishiga 3 daqiqada, taymer bilan, ilovani telefonda ko'rsatib ayting.
  - ② Undan varaqdagi to'rt savolni so'rang va qolgan ✗ bo'laklarni tuzating.
  - ③ Ilovangizni ishlatayotgan qisqa ekran videosini yozib qo'ying — jonli ko'rsatish ishlamasa, shuni ko'rsatasiz.
  - Karta ostida (bitta kulrang qator): Tinglovchi topilmasa — pitchni telefonga yozib oling va varaqni o'zingiz to'ldiring.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Demo Day 7»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ichki skroll qutisi yo'q (SABOQ 18); «Kim bilan» — HwCard yorlig'i. Muddat «keyingi darsgacha» — Demo Day 7 nomi faqat «Keyingi dars» qatorida (tayanch 2, T-038).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Honest Count!** (9-ekran, darvoza birinchi urinishda va «Bajardim») — Database'dan son olib, unga nimalar kirganini aniqladingiz
- **Four Parts!** (10-ekran, 4/4 saqlanganda) — Pitchingizni to'rt bo'lakka yozdingiz
- **Three Minutes!** (11-ekran, taymer to'xtatilib, varaq to'lganda) — Pitchingizni 3 daqiqada aytib, baholatdingiz
- **Fixed It!** (11-ekran, birinchi tuzatilgan bo'lakda) — Varaqdagi izohdan keyin bo'lakni qayta yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda; 2, 4, 8-ekranlar (qadamli tushuncha) nishonsiz. «Database'ga kira olmadim» yo'lida Honest Count! berilmaydi.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Qaysi bo'lak** — 1 Muammo bo'lagida muammo gapi va dalil turadi. · 2 Dalil — necha kishidan nechtasida muammo bo'lgani. · 3 Jonli demo va keyingi qadam boshqa savolga javob beradi.
  — Sinfga savol: «Sinfdoshlarning 5 tadan 4 tasi …» — bu qaysi bo'lak?
- **5 · Ish bilan dalil** — 1 «Kerak», «yuklab olaman» — fikr yoki va'da. · 2 Sinab ko'rishga kun belgilash — ish: bu harakat belgisi. · 3 10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.
  — Sinfga savol: Sizning intervyuingizda kim ish bilan qiziqish ko'rsatdi?
- **7 · Bir gapda yechim** — 1 Stiv Jobs iPhone'ni «uch qurilma bittada» deb taqdim etgan. · 2 Yechim bo'lagi ham bir gapda: mahsulot odamga nima qiladi. · 3 Ekranlar, texnologiya va «kim uchun» — yechim emas.
  — Sinfga savol: Mahsulotingizni bir nafasda ayta olasizmi?
- **12 · Songa nima kirgan** — 1 Shartsiz SQL hamma qatorni sanaydi. · 2 Unda namuna va tekshiruv yozuvlari ham bor. · 3 Pitchda son va unga nima kirgani birga aytiladi.
  — Sinfga savol: Sizning soningizda tekshiruvlaringiz bormi?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·6·11 · B 2·7·10 · C 3·5·12 · D 4·8·9 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Zal «Ishlayotganini ko'rsata olasizmi?» deb so'radi. Nima qilasiz? (2, 8)
   - ✔ Telefonda asosiy harakatni ko'rsatasiz (38)
   - Mahsulot nima qilishini bir gapda aytasiz (41)
   - Intervyudagi sanoqni tartib bilan aytasiz (41)
   - Rejangizdagi birinchi ishni aytib berasiz (41)
2. Muammo gapidan keyin zal «Qayerdan bilasiz?» dedi. Nima aytasiz? (4)
   - Ilova qaysi texnologiyalarda qurilganini (40)
   - ✔ Necha kishidan nechtasida muammo bo'lganini (43)
   - Ilovada nechta ekran va nechta tugma borligini (46)
   - Keyingi oyda qaysi ishni qilmoqchi ekaningizni (46)
3. Harakat belgisi nimani ko'rsatadi? (4, 5)
   - Odam intervyuda uzoq va qiziqib gapirganini (43)
   - Odam g'oyani juda maqtab, yaxshi baho berganini (47)
   - ✔ Odam qiziqishni ish bilan ko'rsatganini (39)
   - Odam ilovani do'stlariga aytib berishini (40)
4. «10 intervyu — kichik son» degan gap nimani aytadi? (4)
   - Intervyular foydasiz, ularni tashlash kerak (43)
   - Yuzta intervyusiz g'oyani tanlab bo'lmaydi (42)
   - To'garaklar g'oyasi yaxshiroq ekanini (37)
   - ✔ Bu tanlov uchun dalil, isbot emasligini (39)
5. Stiv Jobs iPhone'ni qaysi uch qurilma bittada deb taqdim etgan? (6)
   - Kamera, telefon va soat (23)
   - Klaviatura, stilus va telefon (29)
   - ✔ iPod, telefon va internet (25)
   - iPod, radio va kompyuter (24) ✎ F-1006-283: «iPod» faqat to'g'ri variantda edi (lint-tell, quruvchi)
6. Apple iPhone'da nimani qoldirgan? (6)
   - ✔ Bitta ekran va Home tugmasini (29)
   - Klaviatura va stilus qalamini (29)
   - Ko'p tugma va to'liq klaviaturani (33)
   - Stilus va ikkita katta ekranni (30)
7. Yechim bo'lagida zalga nima aytiladi? (7)
   - Ilova qurilgan texnologiyalarning ro'yxati (42)
   - ✔ Mahsulot odamga nima qilishi, bir gapda (39)
   - Ilovadagi hamma ekranlarning to'liq nomlari (43)
   - Mahsulotni qurishga ketgan haftalar soni (40)
8. Nega ilovani pitchdan 2–3 daqiqa oldin ochasiz? (8)
   - Telefon ekrani yorqinroq bo'lishi uchun (39)
   - Zal ilovani oldindan ko'rib turishi uchun (41)
   - Ilova yangi versiyani yuklab olishi uchun (41)
   - ✔ Uxlab qolgan Backend uyg'onishi uchun (37)
9. Jonli demoda qaysi harakatni ko'rsatasiz? (8)
   - Ilovadagi hamma tugmalarni birma-bir (36)
   - Kod yozilgan fayllarni birma-bir (32)
   - Ilovaning sozlamalar sahifasini (31)
   - ✔ Sinov vazifasidagi asosiy harakatni (35)
10. Keyingi qadam bo'lagiga nima yoziladi? (2, 10)
    - Keyinroq qilinadigan hamma ishlar ro'yxati (42)
    - ✔ Tuzatilgan rejangizdagi birinchi ish (36)
    - Sinovda topilgan hamma to'xtashlar (34)
    - Ilova qanday qurilgani haqida hikoya (36)
11. Varaqda «Jonli demo» qatoriga ✗ va «uzoq kutdik» yozildi. Nima qilasiz? (8, 11)
    - ✔ Keyingi safar ilovani oldindan ochasiz (38)
    - Jonli demo bo'lagini pitchdan olasiz (36)
    - Kutish paytida zalga hazil aytib berasiz (40)
    - Sherigingizdan ✓ qo'yishini so'raysiz (37)
12. Pitch 3:40 davom etdi. Nima qilasiz? (11)
    - Taymerni o'chirib, vaqtni umuman sanamaysiz (43)
    - Muammo bo'lagini pitchdan butunlay olib tashlaysiz (50)
    - ✔ Ortiqcha gapni olib, bitta harakat qoldirasiz (45)
    - Oxirgi bo'lakni ancha tezroq gapirib berasiz (44)
- Arena yozuvlari — platforma shabloni (namuna `feedback/F-0929-QA-6modul/YAKUNIY/` 14-dars).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — pitch · zal · muammo · dalil · yechim · telefon · taymer · son · varaq · bo'lak · uyga vazifa banneri — pitch · zal · telefon · daqiqa (faqat so'z, emojisiz).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/9-Modull/PmPrototypePitchLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m9d16-pitch-v1` · «G'oyangiz va ilovangiz guruhni ishontiradimi?».
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s12 `QTest` (darsning `QuestionScreen` mantig'i, DE-203) · s6 `QVoqea` ·
   s9 `QKod` (Neon varianti: o'ngda `HtmlCompiler` o'rnida `NeonMaket`) · s10/s11 `QMustaqil` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`.
2. **`UchDaqiqaSahna`** — bitta vizual (180): telefon (`JamoaTelefon`: O'yinlar · O'yin · kutish yozuvi; «8 / 10» → «9 / 10» son animatsiyasi — 9.14; o'lcham ≈170×272 barqaror) ·
   to'rt bo'lak (holatlar: bo'sh · joriy · yozildi · ✓ · ✗ · tuzatildi) · taymer chizig'i (to'rt bo'lak, 3:00 dan keyin qizil «+m:ss») · zal (4 siluet, `ZAL_SAVOL` pufagi / ✓) · `BaholashVaragi` qatlami (4 qator + «Vaqt»).
   Rangli yon chiziq yo'q. `reduced-motion`; 393 da bo'laklar telefon ostida. Qolip-maket izohi faylda e'lon qilinadi (`// qolip-maket: …`). 10-Modul `PitchSahna` dan ko'chirilmaydi — dars ichida (K-020).
3. **`JAMOA_PITCH`** — bitta manba (A-6 aynan): `muammo: { gap, sanoq, belgi, halol }` · `yechim` · `demo: { harakat: 'Shanba 18:00', tuzatish }` · `keyingi` · `vaqt: [40, 20, 90, 30]` (soniya).
   **`ZAL_SAVOL`** (4) · **`NAMUNA_OYINLAR`** (4, tayanch 9.2 — 7/9-dars `namuna.js` bilan bir). s0, s2, s4, s8, s10/s11 (mentor rejimi) shundan o'qiydi.
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); zal boshlari telefonga buriladi, taymer chizig'i bir lahza yonadi.
5. s2: `QBashorat` (30 soniya · 1 daqiqa · 1,5 daqiqa) → `QQadamlar` (4) → bo'laklar, taymer bo'laklari, pufak; 3-qadamda telefon o'zi o'ynaydi va «Jonli demo» nomi + `QIzoh`; `QTaxmin` («bu mashqda»); 40 s ipucha.
6. s4: `SANOQ_JADVAL` (tayanch 1.3 sanoq jadvali aynan, 4 qator × 2 ustun) · `QBashorat` (1/2/3) · 3 qadam: qator jadvaldan bo'lakka uchadi · pufak holatlari · halol `QIzoh` · `QTaxmin`.
7. s6: `IPHONE_BOSQICH` 3 × `{ h — bosqich nomi, m — Mentor gapi }` (SABOQ 8); `IphoneSahna` (klaviaturali va stilusli telefonlar → tugmalar so'nadi, bitta ekran va Home → uch qurilma ekranga uchadi);
   nomlar o'z rangida (`Brend` komponenti; iPhone · Nokia · BlackBerry — rang TAYANCHGA SAVOL 9), logotip yo'q; bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); S-018 izoh qatorlari; manba izohi faylda.
8. s8: 3 qadam — kutish yozuvi (tezlashtirilgan ~2 s) · asosiy harakat (O'yinlar → O'yin → «Qo'shilaman» → «9 / 10») · «Shanba» sarlavhasi ajralishi va tuzatish qatori; `QBashorat` (bir necha soniya · yarim daqiqa · bir daqiqagacha); `QTaxmin`.
9. s9: `NeonMaket` (10-Modul `m8-11` komponentining davomi — dars ichida; ikki SQL, «Run», ikki natija jadvali `count` «?») · ikki son maydoni (`/^\d+$/`) va ikki «nima» maydoni ·
   `GATE_ITEMS` (3 variant; to'g'ri — «Hamma qatorlar…») · «Bajardim» qulfi · ikkinchi tugma «Database'ga kira olmadim» (son yo'q, nishon yo'q). SQL bajarilmaydi va tekshirilmaydi (dars Neon'ga ulanmaydi) — signal: darvoza + o'quvchi yozgan son.
   Natija qatori → `demo.son` (s10 «Son» maydoni). Nishon `honestCount` (darvoza birinchi urinishda + «Bajardim»).
10. s10: 4 bosqichli forma (ketma-ket karta); o'qiydi `pm-m9d5-prd` (`muammo`, `dalil`, `yechim`), `pm-m9d4-final` (`muammoGapi` — PRD bo'lmasa), `pm-m9d13-sinov` (`eng` → `toxtashlar` dagi matn, `tuzatildi`, `tur`), `pm-m9d15-reja` (`risklar[].qadam`, `birinchi`, `holatlar[]` — «boshlanmadi»/«kechikdi»);
    yo'q bo'lsa — bo'sh maydon (M-q5). Tekshiruv funksiyasi (dalilda raqam bormi · «hamma|ko'pchilik|har kim» · xohish so'zlari · yechimda gaplar soni · texnologiya nomlari · bo'sh harakat va keyingi qadam) —
    PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi; artefakt-strip «Pitchim» (U-042); nishon `fourParts`.
11. s11: 3 qadam; `PitchTaymer` (3 daqiqa, to'xtamaydi, «+m:ss»; ▶ ⏹ belgilari yo'q) · varaq formasi (4 × ✓/✗ + izoh ≥ 8 belgi; «hammasi ✓» va baho so'zlari — yo'naltiradi) · tuzatish (bo'lak kartasi, o'zgarish tekshiruvi, «tuzatildi») ·
    vaqt > 3:00 bo'lsa `QIzoh`; juftlik / yakka matnlari; Mentor rejimi — proyektor taymeri va guruh varag'i; `optionalLive`; nishonlar `threeMinutes`, `fixedIt`.
    `localStorage` `pm-m9d16-pitch` = `{ muammo: { gap, dalil }, yechim, demo: { harakat, tuzatish, son }, keyingi, vaqt, varaq: [{ qism, belgi, izoh, tuzatildi }], savedAt }`
    (`qism`: `'muammo' | 'yechim' | 'demo' | 'keyingi'` — tayanch 8 kalit nomi; ichki shakli — TAYANCHGA SAVOL 5).
12. Testlar s3/s5/s7/s12 — `correctIdx` 3/1/2/0 = `INLINE_KEYS`; `RECAPS` 3/5/7/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6).
    s3/s5/s7/s12 karta — `QuestionScreen` `vizual`: savol ostida, faqat javob topilgach / natija ochilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. Jonli ball: `INLINE_KEYS` = { s3: 3, s5: 1, s7: 2, s12: 0, bolaklar: -1, dalil: -1, demo: -1, neon: -1, practice: -1, juftlik: -1 }; `SCREEN_META` == screens; `SCREEN_INTENTS`.
14. `ACHIEVEMENTS` 4 (`honestCount`, `fourParts`, `threeMinutes`, `fixedIt`) · `FLASHCARDS` 12 · s15 `RECAP` 4 band = yakundagi «Endi siz bilasiz» so'zma-so'z · «Bugungi asosiy fikr» — ScoreRing ostida (P-013) ·
    `HW_TOKENS` — faqat so'z · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
15. Uyga vazifa — yangi `HwCard` (dars yangi; PM-027 «tegilmaydi» bu yerga tegishli emas): «Kim bilan · Nechta · Muddat», 3 qadam, yakun ekranida aynan shular. Alohida `.homework.jsx` yo'q.
16. App.jsx: `m9-16` qatoriga `comp: PmPrototypePitchLesson` + import — asosiy seans (bu agent tegmaydi). Nom va osti ✓ (DE-205, App.jsx 387-qator).
17. **REPO — yo'q** (PM darsi).
- Darvozalar: `npm run gates -- src/9-Modull/PmPrototypePitchLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).
  ⚠️ SQL namunasi va CSS ichida backtik yo'q (template-satr tuzog'i, CLAUDE.md).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
**Holat (06.10, 16-FILTR):** 1, 4, 5, 8, 11, 13, 14 — auditor qabul qildi · 2 — o'zgarmadi (Mentor soni o'ylab topilmaydi) · 3 — yopildi: 9.96 (Mentorning «Avval» qadami uyda bajarilgan, keyingi — 2-risk) · 6 — «band joy» (hozirgi holat) · 7 — 9.95 · 9 — tayanch 5 · 10 — 13-FILTR · 12 — tayanch 1.9.
1. **«bo'lak» so'zi.** Pitchning to'rt qismini «bo'lak» dedim: «qism» 1-darsdagi ta'rifda band («G'oya uch qismdan iborat…»), bo'lak nomlari (muammo, yechim) esa g'oya qismlari bilan bir xil — ikkalasi «qism» bo'lsa, o'quvchi ularni
   adashtiradi (T-015). «Slayd» — tayanch 1.9 da yo'q, markazda telefon. Korpus §31 da Demo Day pitchining qismlari ham «bo'lak» («nutq bo'laklari»). Saqlash kalitidagi `qism` — kodda qoladi.
2. **Mentor misolida Database soni** (nechta o'yin, nechta qo'shilish) tayanchda yo'q — darsda Mentor raqami o'ylab topilmadi: Neon maketida «?», bo'lakka faqat o'quvchining soni yoziladi. Tayanchga Mentor soni qo'shilsa — 9-ekran va Mentor rejimi shu bilan.
3. **Mentorning keyingi qadami:** «Mahalla futbol guruhidan 10 kishini sinovga chaqiraman, keyin o'yindan oldin eslatma qo'shaman.» — 1.9 dagi 2-risk qadami va 1.5 «keyinroq» ufqidagi birinchi ish (RICE 15). 15-dars MD si boshqa birinchi qadamni tanlasa — shunga moslanadi.
4. ~~«Jonli prototip» ma'nosi~~ — **yopildi: GATE M M-q2 A (06.10)** — o'quvchi matnida «ilova», bo'lak nomi «Jonli demo» (ta'rif: «Jonli demo bo'lagida ilova zal oldida telefonda ishlatib ko'rsatiladi.»), menyu nomi va osti yangilandi; tayanch 2 da «jonli demo» qatori.
5. **`pm-m9d16-pitch` ichki shakli:** tayanch 8 dagi `{ muammo, yechim, demo, keyingi, vaqt, varaq: [{ qism, belgi, izoh }] }` ga: `muammo: { gap, dalil }` · `demo: { harakat, tuzatish, son }` · `varaq[].tuzatildi` · `savedAt`.
6. **«qo'shilish» va «o'yinchi».** Tayanch 4: «nechta o'yinchi qo'shildi». `ishtirokchilar` qatori — bitta qo'shilish; bitta o'yinchi ikki o'yinga qo'shilsa ikki marta sanaladi. Darsda «qo'shilish» dedim.
   «O'yinchi» kerak bo'lsa — `COUNT(DISTINCT oyinchi_id)` (10-Modulda `COUNT(DISTINCT …)` tayyor holda bor edi); u holda SQL va maydon nomi o'zgaradi.
7. ~~Kutish holati matni~~ — **yopildi: tayanch 9.95 (15-FILTR 33–34)** — maketda «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» (15-dars bilan bir; sabab yozilmaydi); Mentor repo'si — teg `m11-dars-15-done`.
8. **Zal savollari** (`ZAL_SAVOL`): Muammo — «Bu muammo borligini qayerdan bilasiz?» · Yechim — «Mahsulot nima qiladi?» · Jonli demo — «Ishlayotganini ko'rsata olasizmi?» — yangi; Keyingi qadam — 10-Modul aynan.
9. **K19 brend izohlari va ranglari** (S-018): «Stiv Jobs — o'sha paytdagi Apple rahbari», «iPod — Apple'ning musiqa pleeri», «Nokia va BlackBerry — 2007-yilda telefon chiqargan kompaniyalar» — bankda yo'q, umumiy bilim (izoh — nimaligi, fakt emas).
   Ranglar: iPhone — qora-kulrang, Nokia — ko'k, BlackBerry — qora (logotipsiz, faqat nom rangi). «Stiv Jobs» yozilishi — kursda ilk marta (grep: `src/` da yo'q).
10. **Sinovdagi tuzatish jumlasi** «ro'yxatni kun bo'yicha qildik» — 1.8 tuzatishining («kun va soat bo'yicha, har kun o'z sarlavhasi bilan») qisqa aytilishi.
11. **Dalil manbasi:** `pm-m9d4-final.dalil` da `a` / `b` — qaysi biri final g'oya, kalitdan bilinmaydi. Shuning uchun birinchi manba — `pm-m9d5-prd.dalil` (matn); final kalitidan faqat `muammoGapi`. Final kalitiga `dalil.final` kerakmi?
12. **Dalil jumlalari** «5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan» va «5 o'yinchidan 4 tasi birinchi versiyani sinab ko'rishga kun belgiladi» — 1.3 sanog'i, jumla meniki (HB-q0 A).
13. **Ekran videosi zaxirasi** (telefonning ekran yozuvi) — tayanchda yo'q; P-026 uchun qo'shdim (8-ekran O'qituvchi eslatmasi, 11-ekran 1-qadam, uyga vazifa ③). Tugma nomlari yozilmadi.
14. **Juftlikda qurilma:** gapiruvchi telefonda ilovani ko'rsatadi, sherik varaqni gapiruvchining dars qurilmasida to'ldiradi (10-Modul TAYANCHGA SAVOL 10 ham shu savolda ochiq edi).

## Shubhali joylar (ishonchim komil emas)
- **(yopildi 06.10: hujjat qayta ochildi — «Run», `\dt`, har SQL uchun alohida natija; 16-FILTR 18–20)** **Neon SQL Editor:** «Run» nomi va «Postgres database > SQL Editor» — 10-Modul MD dagi rasmiy hujjat iqtibosi (05.10); men qayta ochmadim. Ikki SQL'ni «birma-bir … har biridan keyin «Run»» dedim — bir oynada ikki SQL natijasi qanday chiqishini tekshirmadim. `\dt` — o'zim sinamadim.
- **7-ekran:** to'g'ri variant (60) eng uzun variantdan (A, 52) 15% uzun — chegarada; S-003 bo'yicha xavf. Kerak bo'lsa A va D bir-ikki so'z uzaytiriladi.
- **Arena 5** («Uch qurilma bittada deb», 23) — eng qisqa; arena 6 to'g'ri variant ikkinchi eng uzun — o'lchov jadvalida.
- **Telefonda ekran yozuvi** — iPhone va Android'da bor deb oldim, tugma nomlari yozilmadi (P-028).
- **Render uyg'onishi «bir daqiqagacha»** — tayanch 6 (10-Modul tayanchi). Neon bepul compute ham 5 daqiqada o'chadi (10-Modul tayanchi 6) — birinchi so'rov yana bir oz sekinlashishi mumkin; darsda aytilmadi.
- **Expo Go'da jonli ko'rsatish laptopdagi `npx expo start` ga bog'liq** — maktab Wi-Fi'da QR ishlamasa `--tunnel` (avval `npm i -g @expo/ngrok`, tayanch 6) — bu O'qituvchi eslatmasida, o'quvchi yo'rig'ida faqat birinchi yarmi.
- **Web-trek:** «bosh ekrandagi PWA» — iPhone Safari'da «bosh ekranga qo'shish» tekshirilmagan (tayanch 6); men faqat «telefon brauzerida» dedim, PWA — O'qituvchi eslatmasida.
- **(yopildi: tayanch 5, 16-FILTR 16)** **K19 izohlari** (Stiv Jobs — Apple rahbari, iPod — musiqa pleeri, Nokia/BlackBerry) — umumiy bilim, bankda so'zma-so'z yo'q.
- **Vaqt taqsimoti** (40 / 20 / 90 / 30 soniya) — meniki, «bu mashqda» (10-Modul `11-FILTR` 6 naqshi).
- **Arena 4** «Yana yuzta intervyusiz g'oya tanlanmaydi» — distraktor; «yuzta» soni hech qayerda yo'q (yolg'on fakt emas, noto'g'ri xulosa sifatida).
- **3, 5, 12-ekran sonlari** (5 tadan 4, 5 tadan 3, 12 ta kitob) — mashq uchun, ikkinchi olamda (P-002).
- **11-ekran qurilmasi:** jonli tizim «o'quvchi = qurilma» — sherik gapiruvchining qurilmasida varaq to'ldirsa, ball/statistika gapiruvchiga yoziladi (to'g'ri), lekin sherikning o'z ekrani shu payt bo'sh turadi.
- **4-ekran halol qatori** «10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.» — 4-dars MD si bilan so'zma-so'z bo'lishi kerak (tayanch 1.3 dan oldim; 4-dars MD si hali yo'q).

---

## O'lchov (python bilan sanaldi — `scratchpad/md16/olchov.py`)
| Nima | Son (belgi) | Chegara |
|---|---|---|
| Sarlavhalar: 0 · 1 · 2 · 4 · 6 · 8 · 9 · 10 · 11 (yakka) · 14 · 15 (P-046) | 49 · 53 · 42 · 42 · 44 · 44 · 52 · 35 · 44 (38) · 25 · 43 (34) | ≤55, bitta qator |
| Xulosalar: 2 · 4 · 6 · 8 · 10 (sanoqsiz) · 11 | 92 · 100 · 106 · 97 · 86 (2) · 78 | ≤110 |
| Bugungi asosiy fikr | 106 | ≤110 |
| Hook javoblari («Aynan!» · «Qiziq fikr!» ×2, so'z bilan birga) | 95 · 85 · 84 | ≤120 |
| Hook variantlari | 39 · 37 · 37 | teng |
| Xato izohlari (testlar, `QXato` 9, 10, 11-ekran, darvoza) | 25–58 | ≤60 |
| `QIzoh` qatorlari (2, 4, 8, 9, 11) | 58–85 | bitta qator |
| 3-ekran variantlari (✔ D) | 45 · 44 · 39 · **40** | to'g'ri eng uzun emas, farq ≤15% |
| 5-ekran variantlari (✔ B) | 46 · **43** · 47 · 44 | 〃 |
| 7-ekran variantlari (✔ C) | 52 · 52 · **52** · 55 | 〃 |
| 12-ekran variantlari (✔ A) | **45** · 48 · 47 · 47 | 〃 |
| Test savollari (so'z) | 12 · 8 · 10 · 12 | ≤12 |
| Arena savollari (so'z) | 4–12; to'g'ri variant hech birida yolg'iz eng uzun emas (1: **38** / 41 · 2: **43** / 46 · 3: **39** / 47 · 4: **39** / 43 · 5: **25** / 29 · 6: **29** / 33 · 7: **39** / 43 · 8: **37** / 41 · 9: **35** / 36 · 10: **36** / 42 · 11: **38** / 40 · 12: **45** / 50) | ≤12 |
| Mentor gaplari | 1 gap — interaktiv ekranlarda (0, 1, 2, 4, 8, 9, 10, 11); 2 gap — keys bosqichlari (6) | ≤2 (interaktivda 1) |

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 386–388 — `m9-15` «Roadmap bo'yicha qayerdasiz?» → **`m9-16` «G'oyangiz va ilovangiz guruhni ishontiradimi?»** (osti «muammo → yechim → jonli demo» — reja teglari 01–03 shu so'zlar) →
  `m9-17` «Demo Day 7» (yakun qatori; ekranda va'da yo'q, faqat O'qituvchi eslatmasida — T-038). Hook sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (muammo gapi, sanoq 4 / 5 va belgi 4 / 5, yechim gapi, namuna o'yinlar, sinov va tuzatish — tayanch 1, 1.3, 1.4, 1.8, 1.9, 9.2 aynan); metafora yo'q;
  bitta vizual — `UchDaqiqaSahna` (telefon · to'rt bo'lak · taymer · zal · varaq qatlami). Ikkinchi misol faqat testda (uy vazifalari — 3, 5; kitob almashish — 12, P-002). iPhone — keys sahnasi (PM-028/029).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 8 (QTushuncha) + 0, 6, 9, 10, 11; testlarda javobdan keyingi karta. «bosish → matn-karta» yo'q — har bosish telefon, bo'lak, taymer yoki jadvalni o'zgartiradi.
- [x] O'lchov (python bilan sanaldi — yuqoridagi jadval; `scratchpad/md16/olchov.py`, `tuzat.py`): sarlavha 25–53, bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi, «Bu…»/«Hammasini…» bilan boshlanmaydi ·
  xulosa 45–106 · hook javobi 84–95 · xato izohi 25–58.
- [x] Atamalar oldingi darslar bilan bir xil (grep): pitch, zal, repetitsiya — 9-Modul 12 · fidbek, baholash varag'i, halol gap, keyingi qadam, SQL Editor — 10-Modul 11 · muammo gapi, sanoq, harakat belgisi, «10 intervyu — kichik son…»,
  yechim gapi, jonli demo, sinov, tuzatilgan reja, risk — 11-Modul tayanchi · «Bepul Backend uxlab qolgan bo'lsa…» — 10-dars MD · «kutish yozuvi» — 15-dars (10-Modulda «kutish holati»). Yangi so'z «bo'lak» — TAYANCHGA SAVOL 1.
  Siz-forma; tugmalar ot-shaklda yoki siz-formada («Saqlash», «3 daqiqani boshlash», «Bajardim — SQL ishladi, son yozildi» — korpus §19 naqshi).
- [x] Testlar: 4 variant, uzunlik yaqin, to'g'ri javob eng uzun emas (jadval); tire 3-ekranda to'rtalasida, qo'shtirnoq 7, 12-ekranda to'rtalasida, 5-ekranda ikkitasida (A, C) — belgi yolg'iz to'g'rida emas;
  ✔ o'rni D/B/C/A (yangi dars). Arena 12 — ✔ A3 B3 C3 D3. Inkor-savol yo'q.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✗ › — belgilar) · kafolat so'zlari yo'q: «darrov», «darhol», «har doim», «100%» — grep 0; «albatta» — faqat 5-ekran A variantida iqtibos ichida (T-008) va A-5 ro'yxatida. «Bu misolda» bilan chegaralangan (4, 8).
  `npm run lint:til` — **0 error, 0 warn** (06.10).
- [x] Ichki kodlar o'quvchi matnida yo'q (F1/F2/F3, `m9-16`, «Modul 11», K19 — faqat MD izohlarida); keys — faqat bank matni, manba qatori bilan; «KOD» ro'yxati 17 band, REPO 0.
- [x] Karta T · P · S · PM: T-011/PM-030 (jonli demo bo'lagi, sanoq va harakat belgisi yorliqlari — misoldan keyin; sarlavhalarda yangi atama yo'q) · T-014/T-015 («bo'lak», «son»/«sanoq», «qo'shilish», «zal»/«guruh» — bir ma'noda) ·
  T-016 (metafora yo'q) · T-020 · T-029/T-047 (Mentor ekrandagini aytmaydi, natijani oldindan aytmaydi) · T-035 (strelka, «+» va «teng emas» belgisi o'quvchi matnida yo'q) · T-038 (Demo Day 7 — faqat yakun qatori va O'qituvchi eslatmasi) ·
  T-039 («ilovangiz» — 16-darsda o'quvchida bor) · T-042 (ta'riflar so'zma-so'z: 2-ekran xulosasi, kartochka 1) · T-043 («bu misolda», «bu mashqda») · T-045 (Expo Go laptopdagi `npx expo start` ga ulanadi; prototip ma'nosi — GATE M M-q2 A: «ilova», bo'lak «Jonli demo») ·
  T-064 (2-ekran sarlavhasi 0-ekran savoliga javob) · P-001 · P-002 · P-008 · P-012 (testlar 3, 5, 7, 12 — ketma-ket emas) · P-013 · P-015 · P-016 · P-025 · P-026 (9-ekran «Database'ga kira olmadim», 11-ekran ekran videosi) ·
  P-028 (Neon «Run» — rasmiy hujjat iqtibosi; telefon ekran yozuvi — umumiy so'z) · P-033 · P-036 · P-046 (9, 10, 11, 15 — o'quvchi ma'lumotidan) · P-052 · P-053 (keys sahnasi, bashoratda `pre` kadr) · P-055 · P-062 (2-ekran Mentori sonni takrorlamaydi) · P-063 (`ZAL_SAVOL`) · P-064 · P-067 ·
  S-001 (savollar 4–12 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 (bashoratlar o'sish tartibida, keysda bitta) · S-018 (iPhone, Nokia, BlackBerry, Stiv Jobs, iPod izohlari) · S-019 · S-020 (ballik matnda «Backend», «Database» — modul atamalari; «SQL» — 12-ekran izohida) ·
  S-026 · S-027 · S-040 · §144/§145 · PM-005 (2-tur) · PM-017 · PM-018 (Apple qarori — faqat bank) · PM-021 · PM-027 · PM-082 (darvoza-mashq, «…digan SQL yozamiz», nusxa yo'q) · PM-108 (10-ekran tekshiruvi) · J-026 · SABOQ 1–31.
- [?] Ochiq: TAYANCHGA SAVOL 1 («bo'lak»), 2 (Mentor Database soni), 5 (kalit ichki shakli), 6 («qo'shilish»); 11-ekran varag'i telefonda (393 px) sig'ishi — vizual bosqichda (U-006).
