# 11-Modul (kod: `src/9-Modull`) · 15-dars (PM) «Roadmap bo'yicha qayerdasiz?» — MD v3

Fayl: `src/9-Modull/PmOneOnOneLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m9-15` · **12 ekran** (qisqa PM dars — tayanch 4 «15-dars»; Qaror-0 14) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta, yozilgani ixcham qatorga uchadi) · telefon maketi chapda, doska o'ngda · ekranda ≤ 3 blok · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 4-ekran — **C** (`correctIdx 2`) · 8-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx, DE-205; grep 06.10, 385–387-qatorlar): `m9-14` «Loyiha kuni: 3-asosiy funksiya» → **`m9-15` «Roadmap bo'yicha qayerdasiz?»** (osti: «Mentor bilan yakkama-yakka: risklar va tuzatilgan reja») → `m9-16` «G'oyangiz va ilovangiz guruhni ishontiradimi?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (holatlar, uch risk va qadam → tuzatilgan reja), mustaqil ish majburiy (5, 6, 7-ekranlar). **Keyssiz** (tayanch 5, Qaror-0 17). **Kod ekrani yo'q** (tayanch 4). REPO yo'q.
Vaqt: ≈ 90 daqiqa — kirish, reja, ikki tushuncha va 1-savol (0–4) ≈ 20 · mustaqil ish va yakkama-yakka (5–7) ≈ 50 · yakuniy savol, podium, kartochkalar, arena (8–11) ≈ 20.
Manba: `00-MODUL-TAYANCH.md` (1.5 — Mentor roadmap'i · 1.7–1.8 — funksiyalar va sinov · **1.9 «15» aynan** — holatlar, uch risk va qadam, risk ta'rifi · 2 — atamalar · 4 — 15-dars shakli · 6 — Expo Go, Render · 7 — takroriy xatolar · 8 — kalitlar · 9 — kelishuvlar) ·
`GATE_M_JAVOB.md` (Qaror-0 14, 17) · `00-TAQIQLAR.md` · namunalar: 10-Modul `04-PmAbTest-v3.md` (12 ekran shakli), 6-Modul YAKUNIY `12-PmLesson24.md` (uch ufq), `01-PmTenIdeas-v3.md` (PM uslubi).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: «Progress vs roadmap; risklar, tuzatishlar → tuzatilgan reja»; tayanch 4: «roadmap holati, uch risk, tuzatilgan reja»):**
   o'quvchi o'z roadmap'idagi har ishga **holat** qo'yadi (bajarildi · kechikdi · boshlanmadi), **uchta risk** va har biriga **bitta qadam** yozadi, qadamlarni roadmap'dagi ufqlarga qo'yadi — bu **tuzatilgan reja**.
   Darsning o'rtasida (5–7-ekranlar paytida) Mentor (o'qituvchi) har o'quvchi bilan **yakkama-yakka** gaplashadi; Mentor ekranida o'sha o'quvchining varag'i ochiq turadi («KOD» 4; jonli varaq ishlamasa — o'quvchi o'z ekranini ko'rsatadi).
   Saqlanadi: `pm-m9d15-reja` (16-dars o'qiydi). Uyga vazifa — tuzatilgan rejaning birinchi qadami.
2. **Bugungi asosiy fikr (P-013):** Holat bo'lib o'tganni ko'rsatadi, qadam esa oldindagi riskni kamaytiradi. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **holat** — «Holat ishning rejadagi vaqtiga nisbatan qayerda ekanini ko'rsatadi: bajarildi, kechikdi yoki boshlanmadi.» (2-ekran xulosasi — Mentor misolidagi besh karta belgilangandan keyin.)
     - **bajarildi** — ish rejadagi vaqtida tugagan va hozir ishlaydi · **kechikdi** — rejadagi vaqtida tugamagan ish, keyin tugagan bo'lsa ham · **boshlanmadi** — vaqti hali kelmagan ish (keyinroq va uzoqroq ufqdagi ishlar).
     Bu modulda hozir ufqidagi ishning «rejadagi vaqti» — o'z darsi (11, 12, 14); Mentor misolida chiqish va navbat 14-darsda tugamagan — kechikdi. Nomlar va izohlar — tayanch 1.9, 9.39 (15-FILTR 1–3).
   - **risk** — «Risk — rejaga xalaqit berishi mumkin bo'lgan narsa.» + qoida «Har riskka bitta qadam yoziladi.» (tayanch 1.9 va 2 — aynan; 3-ekran xulosasi, Mentorning uch riski qadamlari bilan ko'rilgandan keyin.)
     Bo'lib o'tgan ish risk emas — uning holati bor (2 va 3-ekranlar farqi, 4-ekran testi).
   - **qadam** — «Riskni kamaytiradigan bitta aniq ish — qadam.» (3-ekran, birinchi qadam tanlangandan keyin `QIzoh`; ta'rif meniki — TAYANCHGA SAVOL 4.)
   - **tuzatilgan reja** — «Holatlar va risklarga qarshi qadamlar qo'shilgan roadmap — tuzatilgan reja.» (7-ekran, uch qadam ufqlarga qo'yilgandan keyin.)
     Tayanch 2 da: «yakkama-yakkadan keyingi roadmap» — darsda mazmun bilan ta'riflandi, sababi TAYANCHGA SAVOL 5.
   - **yakkama-yakka** — Mentor bilan bir o'quvchining suhbati (tayanch 2). Kundalik so'z — alohida ta'rif ekrani yo'q; 1-ekran Mentorida hodisa sifatida aytiladi («har biringiz bilan yakkama-yakka gaplashaman»), kartochkada — savol bilan.
   - **APK** — Android telefonga o'rnatiladigan ilova fayli (3-ekran, 3-qadam tanlovida; manba — «Manbalar»). Faqat Mentor riskining qadamida; o'quvchiga o'rgatilmaydi.
4. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - **roadmap** — uch ufqli reja, bitiruvgacha: qaysi ish qaysi ufqda (6-dars, tayanch 2). **ufq** · **hozir** · **keyinroq** · **uzoqroq** — 6-Modul `m6-12` va 6-dars; bu modulda ufq yorliqlari tayanch 1.5 dan aynan:
     **Hozir · 11-Modul** · **Keyinroq · 12–13-Modul** · **Uzoqroq · bitiruvdan keyin**. 7-ekrandagi qoida — 6-Moduldan: ishni ufqqa u qachon boshlana olishi qo'yadi.
   - **ish** — roadmap'dagi bir qator (6-dars RICE jadvalidagi «Ish» ustuni). Qadam ham roadmap'ga qo'shilgach — ish.
   - **asosiy funksiya** — nomlari bilan (o'quvchi matnida F1–F3 yo'q): «O'yin e'loni va qo'shilish» · «O'yin kuni tasdiq» · «Chiqish va navbat» (tayanch 1.4).
   - **sinov** · **sinovchi** — faqat real odam bilan (13-dars, 12-dars uyga vazifasi). **to'xtash** — sinovda odam qolib ketgan joy (13-dars, `pm-m9d13-sinov`).
   - **Backend** · **Render** («bepul xizmat» — tayanch 6; «bepul reja» emas: «reja» bu darsda roadmap ma'nosida band, T-015) · **Expo Go** (9-dars; «sinash vositasi» — tayanch 6 va TAQIQLAR T-045) · **foydalanuvchi**.
   - **kutish holati** (10-Modul 8-dars: Backend kechikkanda sayt kutishni aytadigan holat) — bu darsda o'quvchi matnida **«kutish yozuvi»** deyiladi: «holat» so'zi darsda ish holati ma'nosida band (T-015). Ko'prik — 3-ekran O'qituvchi eslatmasida.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«roadmap»** — o'quvchining yoki Mentorning uch ufqli rejasi (artefakt nomi). **«reja»** yolg'iz faqat uchta qotgan joyda: risk ta'rifi («rejaga xalaqit»), holat ta'rifi («rejadagi vaqtiga»), «tuzatilgan reja». Boshqa joyda — «roadmap».
   - **«holat»** — faqat ish holati (bajarildi · kechikdi · boshlanmadi). 10-Modulning «kutish holati» o'quvchi matnida yo'q (yuqorida).
   - **«qadam»** — faqat riskka qarshi bitta aniq ish («keyingi qadam» — pitch qismi, bu darsda ishlatilmaydi). Ekran ichidagi bosqichlar — «1 / 5», «Risk 1 / 3», «Qadam 1 / 3».
   - **«tuzat-»** ildizi — faqat «tuzatilgan reja» / «reja tuzatiladi». Xato tuzatilishi «ishladi», «ishlamadi» bilan aytiladi; 13-darsdagi ish kartada «Ro'yxat kun bo'yicha» deb nomlanadi («sinov tuzatishi» — faqat MD da).
   - **«varaq»** — faqat MD va «KOD» da (Mentor ekranidagi o'quvchi varag'i). O'quvchi matnida — «rejangiz», «Mentor o'z ekranida ko'radi».
   - **«jamoa»** — faqat futbol jamoasi (Qaror-0 3); bu darsda ishlatilmaydi. **«muammo»** — faqat g'oyaning muammosi; bu darsda ishlatilmaydi (risk muammo emas: muammo — foydalanuvchining qiyinchiligi, risk — rejaga xalaqit).
   - **Ishlatilmaydi:** xavf (xavfsizlik ma'nosida band — tayanch 2) · 1-ga-1 · one-on-one · korrektirovka · progress (o'quvchi matnida) · push (bildirishnoma ma'nosida — bu modulda «push» = `git push`; o'rniga «o'yindan oldin eslatma») · daftar.
6. **Raqamlar va holatlar (faqat tayanch 1.5, 1.7, 1.9, 6 dan; o'quvchi matnida «Mentor misolida» deb):**
   - **Mentor roadmap'i (tayanch 1.5 + 13-dars):** Hozir · 11-Modul — O'yin e'loni va qo'shilish (11-dars) · O'yin kuni tasdiq (12-dars) · Ro'yxat kun bo'yicha (13-dars, sinovdan keyin) · Chiqish va navbat (14-dars) ·
     Keyinroq · 12–13-Modul — O'yindan oldin eslatma · Ro'yxat o'zi yangilanadi · Uzoqroq · bitiruvdan keyin — Maydon pulini bo'lishish.
   - **Holatlar (tayanch 1.9 aynan):** O'yin e'loni — bajarildi · O'yin kuni tasdiq — bajarildi · Ro'yxat kun bo'yicha — bajarildi · Chiqish va navbat — **kechikdi** (navbat ikki marta ishlamadi, 14-darsdan keyin ishladi) ·
     12-Modul ishlari — boshlanmadi. Uzoqroq ufqdagi ish ham «boshlanmadi» (tayanch 1.9, 15-FILTR 3).
   - **Uch risk va qadam (tayanch 1.9 aynan; 1-riskda «rejasi» → «xizmati» — T-015, TAYANCHGA SAVOL 16):** 1) Render bepul xizmati uxlaydi — birinchi ochilish bir daqiqagacha → ilovaga kutish yozuvi · 2) 12-Modulda 50 foydalanuvchi kerak, hozir 3 sinovchi →
     mahalla futbol guruhidan 10 kishini sinovga chaqirish · 3) Expo Go — sinash vositasi, hamma o'yinchida yo'q → 12-Modulda APK.
     Qadamlar ufqi (7-ekran namunasi; tayanch 1.9): 1 — hozir · 2 — hozir · 3 — keyinroq (12-Modul). Kutish yozuvi matni — «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» (10-Modul naqshi; 16-dars ham shu — tayanch 9.95).
   - **Render (tayanch 6 → 10-Modul tayanchi 6):** bepul xizmat 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈ 1 daqiqa. **Telefon ekranidagi matnlar** (tayanch 1.7, 1.8): «8 / 10» → «9 / 10» · «Kelaman» · «Kelishini tasdiqladi: 7 / 9» ·
     «Shanba», «Yakshanba» kun sarlavhalari · «Navbatga yozilish». Namuna o'yin — **Shanba 18:00 · Mahalla maydoni · 8 / 10** (tayanch 9.2). Boshqa son yo'q.
7. **Misol-ip — «Maydon Jamoa» (Mentorning final mahsuloti, tayanch 1).** Ikkinchi misol faqat testda (P-002), o'smir olamidan: **imtihon haftasi** (4-ekran). Metafora yo'q. Keys yo'q.
   O'quvchining o'z roadmap'i — 0-ekran maketida (bo'lsa) va 5–7-ekranlarda (P-004). O'quvchiga «Maydon Jamoa» risklari tavsiya qilinmaydi — Yordam'da faqat «qayerga qarash» (uch joy).
8. **Yakkama-yakka — tashkil etilishi (Qaror-0 14; O'qituvchi eslatmalarida batafsil):** suhbat o'qituvchi bilan, darsdan tashqariga chiqmaydi. O'quvchi 6-ekranni (uch risk) tugatgach, Mentor uni chaqiradi (≈ 3–4 daqiqa);
   Mentor ekranida o'sha o'quvchining varag'i: holatlar · uch risk va qadam · qadamlar ufqi. Suhbatda uch savol: qaysi ish kechikdi va nega · qaysi risk eng katta · birinchi qadam qachon va qanday.
   Suhbatdan keyin o'quvchi rejasini ✎ bilan o'zgartiradi, eng katta riskni (6-ekran) va birinchi qadamni (7-ekran) belgilaydi — ular saqlanadi (`eng`, `birinchi`; 15-FILTR 19–20). Jonli varaq ishlamasa — o'quvchi o'z ekranini ko'rsatadi (TAYANCHGA SAVOL 9).
   Vaqt: 12 kishigacha — ≈ 4 daqiqadan; 13–15 kishi bo'lsa — 3 daqiqa taymer bilan yoki ikki aylanishda (avval eng katta risk va birinchi qadam, keyin qolgani) — tayanch 9.96.
9. **Toza yuza (185, D-qoidalar):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ✎ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q.
   Holat ranglari (D3 tokenlari): **bajarildi** — `ok` (✓) · **kechikdi** — `accent` chegara va `accentSoft` fon · **boshlanmadi** — `ink2` (kulrang). Joriy karta — accent halqa va yengil to'lqin (kechikdi fonidan farqli).
10. **Kod ekrani yo'q** (tayanch 4: 15 — qisqa dars; PM_DARS_ETALON 26 — 14-dars bloklar, 16-dars Neon SQL, mexanika takrorlanmaydi).
11. **Saqlash kalitlari (tayanch 8):** o'qiydi `pm-m9d6-roadmap` (`ishlar`, `hozir`) va `pm-m9d13-sinov` (`toxtashlar`, `eng`, `bajardi`, `tur`, `qaytaSinov` — 9.90) · yozadi `pm-m9d15-reja` =
    `{ holatlar: [{ ish, holat }], risklar: [{ risk, qadam, ufq }] × 3, eng: 0–2 | null, birinchi: 0–2 | null, savedAt }` — `ufq` (TAYANCHGA SAVOL 6), `eng` va `birinchi` (15-FILTR 19–20; tayanch 8, 9.96). Kalit bo'lmasa — o'quvchi o'zi yozadi (M-q5, tayanch 8 qoidasi).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 6-darsda roadmap tuzildi, 10–14-darslarda poydevor va uch funksiya qurildi, 13-darsda uch kishi bilan sinov o'tdi. 15-dars — to'xtab, roadmap'ga qaytish: nima bo'ldi, oldinda nima xalaqit berishi mumkin.
- **Dars ipi:** 0 — roadmap bo'yicha qayerdasiz (o'z roadmap'i, «Bugun» chizig'i) → 2 — Mentor roadmap'idagi besh karta: dalil ko'rib holat qo'yiladi (atama «holat») →
  3 — oldinga qarash: Mentorning uch riskiga qadam tanlanadi (atamalar «qadam», «risk») → 4 — test: qaysi biri risk → 5 — o'z roadmap'iga holat → 6 — o'z uch riski va qadami (shu paytdan yakkama-yakka) →
  7 — qadamlar ufqlarga — tuzatilgan reja → 8 — yakuniy: qadam qayerda turadi → podium → kartochkalar → yakun, uyda — birinchi qadam.
- **Bitta vizual — roadmap doskasi (`RejaDoska`, dars bo'yi, 163/180; bitta manba `MENTOR_REJA` + o'quvchi roadmap'i):**
  - Uch ustun: **Hozir · 11-Modul** · **Keyinroq · 12–13-Modul** · **Uzoqroq · bitiruvdan keyin** (ufq yorlig'i ustun tepasida). Hozir ustuni kengroq.
  - Ish kartasi (oq, ingichka chegara, rangli yon chiziq yo'q): ish nomi · hozir ustunida kulrang dars yorlig'i («11-dars») · holat chipi (bo'sh holatda — kulrang «?»).
  - **«Bugun · 15-dars»** — hozir ustunida, 14-dars kartasidan keyin gorizontal accent chiziq.
  - **Qadam kartasi** — accent chegarali kichik karta, tepada kulrang yorliq «qadam», ichida qadam matni; ustunga uchib tushadi (7-ekran; 3-ekranda — Mentor misoli). Risk matni qadam kartasining ostida kulrang, kichik.
  - Doska sarlavhasi: «Roadmap» (Mentor misolida — «Mentor misoli · Maydon Jamoa») → 7-ekranda 3/3 dan keyin «Tuzatilgan reja».
  - Ko'rinishlar (bitta komponentdan): **to'liq** (2, 5, 7-ekranlar) · **ixcham** (tepadagi chiziq: uch ustunda holat chiplari soni — 6-ekran) · **kichik** (0, 1-ekranlar, savol osti).
  - Ishlatiladi: 0 · 1 · 2 · 3 (o'ngda — Mentorning risk kartalari, qadam ufqi yorlig'i bilan) · 5 · 6 (ixcham) · 7 · 8 (javobdan keyin, kichik). `prefers-reduced-motion` da uchish va to'lqin yo'q, yakuniy holat birdan qo'yiladi.
- **Telefon maketi «Maydon Jamoa»** (chapda, ≈ 170×272 — SABOQ 22; nom 7–14-darslardagi o'z rangida, logotip yo'q) — 2 va 3-ekranlarda dalil va risk sahnasi. Telefonda faqat tayanchdagi matnlar (A-6).
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, juda yengil to'lqin (≤3%, ≥2 s — SABOQ 32, F-1006-270: «tebranish oshib ketibdi»); tanlov guruhida bitta halqa (har variantda emas — SABOQ 32).
  Yoqilgan pastki tugma («Davom etish», «Keyingi karta») ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → karta joyidan ustunga uchadi · yangi chip ~1 s yonadi · son sanab o'sadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Roadmap bo'yicha qayerdasiz?** (28) — dars nomi (DE-205)
- Mentor: Poydevor, uch asosiy funksiya va sinov ortda qoldi. Roadmap'ingizni eslang va o'zingizga yaqin javobni belgilang.
- Maket (chap; `RejaDoska` kichik): o'quvchining o'z roadmap'i (`pm-m9d6-roadmap` bo'lsa) — hozir ustunida uch funksiya (dars yorliqlari 11 · 12 · 14) va 13-darsdagi ish (`pm-m9d13-sinov` bo'lsa), har birida kulrang «?» chip,
  ustun ichida «Bugun · 15-dars» chizig'i. Roadmap saqlanmagan bo'lsa — Mentor misoli (kulrang yorliq «Mentor misoli · Maydon Jamoa»), xuddi shu ko'rinishda.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Roadmap bo'yicha ketyapman (26)
  - Roadmap'dan biroz ortdaman (26)
  - Roadmap'dan biroz oldindaman (28)
- Javob (uchalasida bir xil, maqtovsiz — J-026, P-016): Uchalasi ham uchraydi. Buni taxmin emas, roadmap'dagi har ish ko'rsatadi: o'z vaqtida tugadimi? (95)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent halqa bilan qotadi; doskada «Bugun · 15-dars» chizig'i bir marta to'lqinlanadi va hozir ustunidagi «?» belgilari navbat bilan (100 ms) bir lahza ko'tarilib qaytadi —
  holat hali ochilmaydi (2-ekran kashfiyoti, P-036). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — bugun har o'quvchi o'z roadmap'ini dalil bilan ko'radi. «Oldindaman» degan o'quvchidan keyinroq so'rang: keyinroq ufqidagi ishni boshladingizmi?

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun roadmap'ingizni Mentor bilan tuzatasiz.** (45)
- Mentor: Bugun har biringiz bilan yakkama-yakka gaplashaman. Undan oldin roadmap'ingizni birma-bir ko'rib chiqasiz.
- Chap — «Dars oxirida — Mentor bilan yakkama-yakka: risklar va tuzatilgan reja» (App.jsx osti so'zma-so'z, P-015) + vizual: `RejaDoska` (Mentor misoli, kichik) o'zi yuradi (DE-200) —
  kartalardagi «?» belgilari kulrang to'lqin bilan o'tadi, keyin uchta bo'sh uzuq kichik karta (matnsiz, U-041 — keyin to'ldiriladigan joy) ustunlarga sirg'alib kiradi. Holat va qadam matni ko'rinmaydi (2, 3-ekran kashfiyotini ochmaydi).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Roadmap'dagi har ish o'z vaqtida tugaganini belgilaysiz · `holat`
  - 02 · Oldinda rejaga nima xalaqit berishi mumkinligini topasiz · `risk`
  - 03 · Har biriga bitta aniq qadam yozasiz · `qadam`
  - 04 · Qadamlarni roadmap'ga qo'yib, Mentor bilan ko'rasiz · `tuzatilgan reja`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011: «tuzatasiz» — fe'l, atama 7-ekranda); reja ta'rif aytmaydi (P-015); «yakkama-yakka» — kundalik so'z, Mentor gapida hodisa sifatida.

## 2 · Holatlar  ← QTushuncha (markaziy; ketma-ket 5 karta — SABOQ 9/13)
- Eyebrow: Tushuncha · holat
- Sarlavha: **Mentor roadmap'idagi ishlar o'z vaqtida tugadimi?** (49)
- Mentor: Telefondagi dalilni ko'ring va kartaga mos tugmani bosing.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 zinapoya): **Hozir ufqidagi to'rt ishdan nechtasi o'z darsida tugagan?** · 2 · 3 · 4 —
  tanlangach ixcham qator «Taxminingiz: N» natijagacha turadi; karta tugmalari shundan keyin yoqiladi.
- Vizual (SABOQ 21 — telefon chapda, doska o'ngda; ≤ 3 blok: telefon · doska · tugmalar qatori):
  - **chapda — telefon maketi «Maydon Jamoa»** (dalil sahnasi, har kartada almashadi);
  - **o'ngda — `RejaDoska`** (Mentor misoli, to'liq): yetti karta, hammasida «?»; joriy karta accent halqada kattalashgan;
  - **doska ostida — uch tugma:** «Bajarildi» · «Kechikdi» · «Boshlanmadi» (har kartada shu tartibda).
- Kartalar (navbat bilan; har birida telefon dalili — tayanch 1.7, 1.8, 1.9):
  1. **O'yin e'loni va qo'shilish · 11-dars** — telefon: «Shanba, 18:00 · Mahalla maydoni», «Qo'shilaman» bir marta bosiladi, «8 / 10» → «9 / 10»; ostida kulrang yorliq «11-darsda shunday ishladi». ✔ Bajarildi
  2. **O'yin kuni tasdiq · 12-dars** — telefon: o'yin sahifasida «Kelaman» belgisi, tashkilotchi ekranida «Kelishini tasdiqladi: 7 / 9»; yorliq «12-darsda shunday ishladi». ✔ Bajarildi
  3. **Ro'yxat kun bo'yicha · 13-dars** — telefon: o'yinlar ro'yxati «Shanba», «Yakshanba» sarlavhalari bilan, kun va soat bo'yicha; yorliq «13-darsda, sinovdan keyin shunday ishladi». ✔ Bajarildi
  4. **Chiqish va navbat · 14-dars** — telefon: to'lgan o'yinda «Navbatga yozilish»; tepada kichik vaqt chizig'i: «14-dars» ostida ikki qizil ✕ («navbatdagi kirmadi»), keyin «darsdan keyin» ostida yashil ✓. ✔ Kechikdi
  5. **Keyinroq va uzoqroq ufqdagi uch ish** (O'yindan oldin eslatma · Ro'yxat o'zi yangilanadi · Maydon pulini bo'lishish — uchala karta birga ajraladi) — telefon xira, ustida kulrang yorliq «12-Modul hali boshlanmagan». ✔ Boshlanmadi
- **Harakat → Vizual o'zgarish:** tugmani bosish → to'g'ri bo'lsa joriy kartaga holat chipi tushadi (bajarildi — yashil ✓, kechikdi — accent fon, boshlanmadi — kulrang), karta kichrayib o'z joyida qotadi, telefonda keyingi dalil sahnasi kiradi;
  4 va 5-kartada chip ostida bir qator `QIzoh` ~3 s turadi:
  - 4: Kechikdi — rejadagi vaqtida tugamagan ish, keyin tugagan bo'lsa ham. (68)
  - 5: Boshlanmadi — vaqti hali kelmagan ish. (38)
  Xato → tugma silkinadi, karta bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1–3-karta «Kechikdi»: Dalilga qarang: ish o'z darsida ishladi. (40) · «Boshlanmadi»: Telefonda ish ishlab turibdi — demak boshlangan. (48)
  - 4-karta «Bajarildi»: Hozir ishlaydi — lekin 14-darsda tugadimi? (42) · «Boshlanmadi»: Ish 14-darsda boshlangan edi — dalilni o'qing. (46)
  - 5-karta «Bajarildi» yoki «Kechikdi»: Bu ishlarning vaqti hali kelmagan. (34)
- Natija (bitta blok, SABOQ 25; `tugadi` — tugmalar va telefon yopiladi, doska butun enga, vizual ⛶ ichida — q17/q18):
  taxmin qatori (`QTaxmin`, blokning birinchi qatori): «Taxminingiz: N · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi»; doskada hozir ustuni: uch ✓ va bitta «kechikdi».
- Xulosa: Holat ishning rejadagi vaqtiga nisbatan qayerda ekanini ko'rsatadi: bajarildi, kechikdi yoki boshlanmadi. (105) — atama «holat» shu yerda tug'iladi (T-011)
- Tugma (pastki): Kartalarni belgilang (N/5) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Telefondagi kulrang yorliqni o'qing — ish qachon ishladi?
- Keyingi bosiladigan joy: bashorat variantlari → uch tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Status Check! (beshta karta birinchi urinishda).
- O'qituvchi eslatmasi: Eng ko'p bahs — 4-karta: «hozir ishlayapti-ku, nega kechikdi?». Javob: holat ish o'z vaqtiga nisbatan qayerdaligini aytadi; navbat 14-darsda tugamagan, keyin ishlagan.
  Sinfdan so'rang: «Sizda o'z darsida tugamagan ish bormi?» — javoblar 5-ekranga olib boradi.
✎ 13-darsdagi ish «sinov tuzatishi» o'rniga «Ro'yxat kun bo'yicha» deb nomlandi (A-5: «tuzat-» ildizi faqat tuzatilgan rejada). 5-karta uchta ishni birga oladi — tayanch 1.9 «12-Modul ishlari» bitta band (TAYANCHGA SAVOL 3).

## 3 · Risk  ← QTushuncha (ketma-ket, 3 qadam; SABOQ 9/13; P-055)
- Eyebrow: Tushuncha · risk
- Sarlavha: **Mentor roadmap'iga nima xalaqit berishi mumkin?** (47)
- Mentor: Holat o'tganini ko'rsatdi, endi oldinga qaraymiz: har sahnada mos tanlovni bosing.
- Qadam chiplari (`QQadamlar`, ixcham, bir qatorda; joriysi accent, o'tgani ✓): 1 Backend · 2 Foydalanuvchilar · 3 Telefon
- Vizual (≤ 3 blok): **chapda — sahna** (telefon maketi «Maydon Jamoa», har bosqichda almashadi) · **o'ngda — risk kartasi** (Mentor misoli: «Risk» qatori yozilgan, «Qadam» qatori bo'sh uzuq) ·
  **pastda — uch tanlov** (navbat bilan chiqadi; aralash tartib, to'g'ri o'rni har bosqichda boshqa). Yechilgan risk kartalari o'ngda ustma-ust ixcham qatorga yig'iladi: «Risk → qadam · ufq».
- Bosqichlar (risk matni — tayanch 1.9 aynan):
  1. **Backend** — sahna: telefonda «Maydon Jamoa» ochiladi, «O'yinlar» ekrani bo'sh, tepada soniya hisoblagichi 0:00 → 0:59 yuradi (kulrang yorliq «tezlashtirilgan · bir daqiqagacha»), keyin o'yinlar birdan keladi; telefon ustida yorliq «Render · bepul xizmat».
     Risk: **Render bepul xizmati uxlaydi — birinchi ochilish bir daqiqagacha.**
     - ✔ Ilovaga kutish yozuvi qo'shish (30)
     - Ilovani har kuni o'zingiz ochib turish (38) → `QXato`: 15 daqiqa so'rovsiz qolsa, Backend yana uxlaydi. (48)
     - Telegram guruhida ogohlantirish yozish (38) → `QXato`: Ilovani ochgan o'yinchi guruhni ko'rmasligi mumkin. (51)
     To'g'ri tanlovdan keyin sahna qayta yuradi: bo'sh ro'yxat o'rnida yozuv **«O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.»**, o'yinchi siluet kutadi, o'yinlar keladi.
     Karta: Qadam qatori yoziladi, yonida ufq yorlig'i «hozir»; karta ostida kulrang qator: Kutish qisqarmaydi — o'yinchi ilovani yopmaydi. (47) Shu yerda (birinchi qadamdan keyin) `QIzoh`: Riskni kamaytiradigan bitta aniq ish — qadam. (45)
  2. **Foydalanuvchilar** — sahna: telefon ustida chiziq-hisoblagich «Foydalanuvchilar: 3 / 50» (chiziqning uch ellikdan bir qismi yashil, qolgani kulrang; mayda nuqtalar yo'q — SABOQ 27), yorliq «12-Modul: 50 foydalanuvchi».
     Risk: **12-Modulda 50 foydalanuvchi kerak, hozir 3 sinovchi.**
     - 12-Modul boshlanganda foydalanuvchilarni qidirib ko'rish (56) → `QXato`: Odam kech qidirilsa, 12-Modulga yetmasligi mumkin. (50)
     - ✔ Mahalla futbol guruhidan 10 kishini sinovga chaqirish (53)
     - Uch sinovchidan ilovani yana bir necha marta sinashni so'rash (61) → `QXato`: Sinovchilar soni baribir 3 ta qoladi. (37)
     To'g'ri tanlovdan keyin chiziqqa kulrang-accent bo'lak qo'shiladi: «3 + 10 · taklif qilinadi»; karta: Qadam qatori, ufq «hozir»; ostida kulrang: Hali 50 emas: qadam riskni kamaytiradi, yo'qotmaydi. (52)
  3. **Telefon** — sahna: ikki telefon yonma-yon (o'lcham barqaror — SABOQ 22): 1-telefonda Expo Go ichida «Maydon Jamoa» ochiq · 2-telefonning bosh ekranida Expo Go belgisi yo'q, ilova o'rnida kulrang «?»; ustida yorliq «Expo Go — sinash vositasi».
     Risk: **Expo Go — sinash vositasi, hamma o'yinchida yo'q.**
     - Har o'yinchiga Expo Go o'rnatishni aytish (41) → `QXato`: Expo Go — sinash vositasi, o'yinchilar uchun emas. (50)
     - Ilovani faqat o'z telefoningizda ko'rsatish (43) → `QXato`: Unda o'yinchilarning o'zi ilovani ocholmaydi. (45)
     - ✔ 12-Modulda APK: Android'ga o'rnatiladigan fayl (46)
     To'g'ri tanlovdan keyin 2-telefonda «?» o'rniga kulrang ilova belgisi va yorliq «APK · 12-Modul»; karta: Qadam qatori, ufq «keyinroq»; ostida kulrang: APK — Android uchun; iPhone yo'li alohida qaror. (48)
  Tuzoqlar har bosqichda bitta xato-sinf (S-040): 1 — Backend'ning o'zini «uyg'otib» bo'lmaydi (fakt: 15 daqiqa) · 2 — riskni kamaytirmaydi (kech yoki son o'zgarmaydi) · 3 — hamma o'yinchiga yetmaydi.
- Yordam (birinchi xatodan keyin, P-033; bosqichga qarab bitta qator): Qaysi tanlovdan keyin o'yinchi ilovani yopmaydi? · Qaysi tanlovdan keyin 50 ga yaqinlashadi? · Qaysi tanlovdan keyin ilova Expo Go'siz ochiladi?
- **Harakat → Vizual o'zgarish:** qadam chipi yoki «Keyingi risk» → chapda yangi sahna kiradi, o'ngda yangi risk kartasi (Qadam qatori bo'sh uzuq), pastda uch tanlov navbat bilan.
  To'g'ri tanlov → sahna o'zgaradi (yuqorida), tanlov matni kartaning Qadam qatoriga uchib yoziladi (~1 s yashil), ufq yorlig'i chiqadi, karta o'ngdagi ixcham ro'yxatga yig'iladi; bosqich ✓.
  Xato → tanlov silkinadi, Qadam qatori bir lahza `err` fon, bitta `QXato`.
- Natija (`tugadi`: bosqich belgilari, sahna va tanlovlar yo'qoladi; o'ngdagi uch qator butun enga — «Risk → qadam · ufq»):
- Xulosa: Risk — rejaga xalaqit berishi mumkin bo'lgan narsa. Har riskka bitta qadam yoziladi. (84) — atama «risk» shu yerda tug'iladi (T-011)
- Tugma (pastki): Risklarni oching (N/3) → Davom etish
- Keyingi bosiladigan joy: joriy qadam chipi → uch tanlov (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Step Picker! (uch bosqichda birinchi urinishda).
- O'qituvchi eslatmasi: Kutish yozuvi — 10-Moduldagi «kutish holati»ning ilovadagi ko'rinishi (o'sha modulda saytga qo'yilgan edi); o'quvchilarga shunday eslating, «holat» so'zini bu darsda ishlatmang.
  Kutish yozuvi Backend'ni uyg'otmaydi — o'yinchi kutishini aytadi va ilovani yopmasligiga yordam beradi. APK faqat Android uchun; iPhone yo'li 12-Modulda (dastur: «Expo Go / APK»). Hisoblagich tezlashtirilgan — real kutish bir daqiqagacha.
  Sinfdan so'rang: «Holat bilan riskning farqi nima?» (holat — bo'lib o'tgani, risk — oldinda bo'lishi mumkini).

## 4 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · risk
- Savol: **Qaysi biri roadmap'ingizga risk bo'ladi?** (6 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — 14-darsdagi funksiya darsdan keyin tugadi (41)
  - B — Do'stlar sinovga yordam berishi mumkin (37)
  - ✔ C — Imtihon haftasida vaqt qolmasligi mumkin (40)
  - D — Keyinroq ufqidagi ishlar hali boshlanmagan (42)
- To'g'ri izohi: Vaqt qolmasligi oldinda rejaga xalaqit berishi mumkin. (54)
- Xato izohlari (≤60): A — Bu bo'lib o'tgan ish — uning holati: kechikdi. (46) · B — Bu roadmap'ingizga yordam beradi — xalaqit emas. (48) ·
  D — Ularning vaqti hali kelmagan — bu holat, risk emas. (51) · (umumiy) Qaysi biri oldinda rejaga xalaqit berishi mumkin? (49)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan keyin; SABOQ 4): savol ostida kichik risk kartasi «Imtihon haftasida vaqt qolmasligi mumkin» — Qadam qatori bo'sh uzuq, ichida kulrang «?».
- Yozuvlar (barcha testlarda bir xil, qolip): To'g'ri · Qaytadan urinib ko'ring · (jonli darsda xato tanlansa) To'g'ri javob: X — …
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Risk Spotter! — birinchi urinishda to'g'ri.
- Izoh (MD): har noto'g'ri variant darsning o'z qoidasi bo'yicha noto'g'ri (S-004): A — bo'lib o'tgan ish, holati bor (2-ekran) · B — yordam beradigan narsa, xalaqit emas (risk ta'rifi; avvalgi «yana bitta funksiya» bahsli edi — vaqtni olib, xalaqit qilishi mumkin, 15-FILTR 6) · D — «boshlanmadi» holati (2-ekran, 5-karta).
  «mumkin» B va C da (kalit so'z faqat to'g'rida emas — S-003); to'g'ri javob eng qisqasi. «Imtihon haftasi» — o'smir olami (T-046), Mentor misolida yo'q.

## 5 · Roadmap'ingiz  ← QMustaqil (USTAXONA 1/3 — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish · holat
- Sarlavha: **Roadmap'ingizdagi har ishga holat qo'ying.** (42)
- Mentor: Ish o'z vaqtida tugadimi — ilovangizda tekshirib, bitta tugmani bosing.
- Tepada (kulrang, bitta qator; faqat jonli darsda, ish vaqtidagi holatga qarab — KOD 4): Mentor varag'i ishlasa — Yakkama-yakka suhbatda Mentor buni o'z ekranida ko'radi. (56) ·
  ishlamasa — Yakkama-yakkada roadmap'ingizni Mentorga o'z ekraningizda ko'rsatasiz. (69)
- **Doska (`RejaDoska`, to'liq, «Roadmap'im»):** `pm-m9d6-roadmap` dagi ishlar o'z ufqida; hozir ustunida `hozir` tartibida yorliqlar **1-asosiy funksiya · 2-asosiy funksiya · 3-asosiy funksiya** (6-dars bilan bir; dars nomlari ham shunday — asosiy seans, 06.10) va
  `pm-m9d13-sinov` bo'lsa — **13-dars** kartasi (nomi — `eng` to'xtash matnining qisqasi «…», `tur: 'mashq'` bo'lsa — yonida «mashq sinovi»; yo'q bo'lsa — kulrang «13-dars: sinovdan keyingi ish»). Hamma kartada «?».
- **Joriy karta (katta, doska ustida):** ish nomi · ufq · dars yorlig'i · ostida uch tugma «Bajarildi» · «Kechikdi» · «Boshlanmadi».
  Keyinroq va uzoqroq ufqdagi kartalarda «Boshlanmadi» tugmasi halqada turadi (vaqti kelmagan) — o'quvchi bosib belgilaydi; boshlagan bo'lsa, boshqasini bosadi.
  13-dars kartasida (`pm-m9d13-sinov`) karta ostida kulrang qator: «13-darsda: qayta sinovda takrorlanmadi» (`qaytaSinov.natija = 'toxtamadi'`) yoki «13-darsda: qayta sinovda yana to'xtadi» (`'toxtadi'`); qayta sinov yo'q — qator yo'q. Holat tanlovini o'quvchi qiladi (P-046; 13-FILTR 8).
- **Roadmap topilmasa** (boshqa platforma, M-q5): kulrang qator «Roadmap topilmadi — ishlaringizni yozing.» + forma (bitta karta): ish nomi (placeholder «Ish nomi») · ufq chiplari «Hozir · 11-Modul» · «Keyinroq · 12–13-Modul» · «Uzoqroq · bitiruvdan keyin» · «Qo'shish».
  Kamida 3 ish (hozir ufqida kamida bittasi), ko'pi bilan 8; keyin har biriga holat — yuqoridagidek. Bo'sh nom: `QXato` Ish nomini yozing. (18)
- Kulrang izoh (hozir ustunidagi darsi o'tgan ishga «Boshlanmadi» bosilsa; xato emas, bloklamaydi): Darsi o'tgan, lekin boshlanmagan ish — Mentorga shuni ayting. (61)
- **Harakat → Vizual o'zgarish:** tugma → katta karta kichrayib doskadagi joyiga uchadi va holat chipi bilan qotadi (bajarildi — ✓ yashil, kechikdi — accent fon, boshlanmadi — kulrang); keyingi karta kiradi; doska sarlavhasi yonida hisoblagich «n / N» sanab o'sadi.
  N/N da katta karta yopiladi, doska butun enga; har kartada ✎ (bosilsa — o'sha karta katta bo'lib, holati qayta tanlanadi — SABOQ 29).
- Xulosa (o'quvchi ma'lumotidan, P-046; 0 bo'lgan bo'lak tushib qoladi): Roadmap'ingizda: {a} ta ish bajarildi, {b} tasi kechikdi, {c} tasi boshlanmadi. (≈73; namuna 2/1/3)
- Tugma (pastki): Har ishga holat qo'ying (n/N) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy kartaning uch tugmasi (navbatma-navbat to'lqin) → «Davom etish».
- Artefakt-strip (U-042): shu ekrandan — «Roadmap'im · holatlar n/N» (ixcham); 6, 7, 11-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Mentor rejimi: forma o'rniga o'quvchilar ro'yxati — har qatorda ism va holatlar chizig'i (yashil / accent / kulrang soni); qatorni bosish → o'quvchi varag'i («KOD» 4). Mentor statistikasi: «Holat qo'yganlar».
- O'qituvchi eslatmasi: «Bajarildi» sharti — ish o'quvchining telefonida (yoki brauzerida) hozir ishlaydi va rejadagi vaqtida (hozir ufqida — o'z darsida) tugagan. Kechikkan ish uyalish emas: yakkama-yakkada «nima to'xtatdi?» deb so'rang.
  O'quvchi roadmap'idagi ish nomlari 6-darsdagidek; bu ekranda nom o'zgartirilmaydi (holat qo'yiladi).

## 6 · Uch risk  ← QMustaqil (USTAXONA 2/3 — ketma-ket karta; SABOQ 29)
- Eyebrow: Mustaqil ish · risk
- Sarlavha: **Roadmap'ingiz uchun uchta risk yozing.** (38)
- Mentor: Avval riskni, keyin unga bitta aniq qadamni yozing.
- Tepada — ixcham qator «Risklarim · n / 3»: yozilganlar bittadan (risk qisqa «…» → qadam qisqa · ✎); bo'sh uzuq qatorlar yo'q. Uning ustida `RejaDoska` ixcham chizig'i (holatlar soni — 5-ekrandan).
- **Markazda — bitta katta karta «Risk {n}»:**
  - Kulrang yordamchi qatorlar (karta ichida, tepada; o'quvchi ma'lumotidan, P-046; bor bo'lsa):
    5-ekranda «kechikdi» bo'lsa — «Kechikkan ish: {ish}. Shu sabab yana takrorlanishi mumkinmi?» · `pm-m9d13-sinov` bo'lsa — «Sinovda {n} kishi qatnashdi.» (`bajardi.length`; `mashq` bo'lsa — «Mashq sinovida …»).
  - Qator **Risk** — placeholder «Rejaga nima xalaqit berishi mumkin?» · qator **Qadam** — placeholder «Uni kamaytiradigan bitta ish» (qisqa, tayyor javobsiz — §32).
  - «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; qator ostida; yumshoq — ikkinchi «Saqlash» bilan o'tadi, «bo'sh» dan tashqari):
  - qator bo'sh (bloklaydi): Risk va qadamni ham yozing. (27)
  - Risk qatorida bo'lib o'tgan ish so'zlari («kechikdi», «ishlamadi», «bo'lmadi», «ulgurmadim», «qilmadim»): Bu bo'lib o'tgan ish. Oldinda nima xalaqit berishi mumkin? (58)
  - Qadam qatorida umumiy so'zlar («harakat qilaman», «ehtiyot bo'laman», «e'tibor beraman», «yaxshilayman», «o'ylab ko'raman», «tezroq ishlayman», «ko'proq ishlayman»): Bu hali qadam emas: aynan nima qilasiz? (39)
  - takror (risk matni oldingisi bilan bir xil): Bu risk yozilgan — boshqasini toping. (37)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (bosilsa ochiladi; «qayerga qarash», tayyor javob emas): Uch joyga qarang: texnika (Backend, ilovani ochish), odamlar (foydalanuvchilar soni) va vaqt (imtihon, ulgurish) — keyin kechikkan ishingizni eslang.
  (`pm-m9d8-platforma` web bo'lsa, «ilovani» o'rniga «saytni».) Mentor misolidagi uch risk — Backend, foydalanuvchilar, ilovani ochish — O'qituvchi eslatmasida (15-FILTR 44–45).
- **Harakat → Vizual o'zgarish:** «Saqlash» → karta kichrayib tepadagi «Risklarim» qatoriga uchadi (risk → qadam strelkasi bilan, ~1 s yashil), hisoblagich n / 3 sanab o'sadi, pastdan keyingi bo'sh karta kiradi.
  Tekshiruvdan o'tmagan qator `err` fon, ostida bitta `QXato`. 3/3 da karta yopiladi; uch qator butun enga (risk · strelka · qadam), har qatorda ✎.
  3/3 dan keyin (yakkama-yakkadan keyin ham) uch qator ustida kulrang savol: Qaysi risk eng katta? — bitta qatorni bosing (★; ixtiyoriy, qayta bosib almashtiriladi) → `eng`.
- Xulosa: Uch riskka uchta qadam yozildi: har biri — bitta aniq ish. (58)
- Tugma (pastki): Yana N ta risk yozing → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: Risk qatori (accent, to'lqin) → Qadam qatori → «Saqlash» (ikki qator yozilgach halqada).
- Mentor rejimi: o'quvchilar ro'yxatida «Risklar n/3»; 3/3 bo'lgan qator yashil — Mentor shu o'quvchini yakkama-yakkaga chaqiradi. Mentor statistikasi: «Uch risk yozganlar».
- O'qituvchi eslatmasi: **Yakkama-yakka shu ekrandan keyin boshlanadi.** Uch riskni yozgan o'quvchini chaqiring (≈ 3–4 daqiqa; qolganlar 6–7-ekranlarda ishlaydi).
  Uch savol: 1) Qaysi ish kechikdi va nega? 2) Uch riskdan qaysi biri eng katta? 3) Birinchi qadam qachon va qanday bajariladi? — 2 va 3-javobni o'quvchi ★ va «Avval» bilan belgilaydi.
  Vaqt: 12 kishigacha ≈ 4 daqiqa; 13–15 kishi bo'lsa — 3 daqiqa taymer bilan yoki ikki aylanishda (avval 2 va 3-savol, keyin 1-savol). Qadam umumiy bo'lsa («harakat qilaman»), «aynan nima qilasiz?» deb aniqlashtiring.
  Mentor misolini o'quvchiga «to'g'ri javob» qilib bermang — uning mahsuloti boshqa.

## 7 · Tuzatilgan reja  ← QMustaqil (USTAXONA 3/3 — ketma-ket karta)
- Eyebrow: Mustaqil ish · reja
- Sarlavha: **Har qadamni roadmap'ingizdagi ufqqa qo'ying.** (44)
- Mentor: Qadam qachon boshlana oladi — o'sha ufqni bosing.
- **Doska (`RejaDoska`, to'liq, «Roadmap'im»)** — 5-ekrandagi holat chiplari bilan.
- **Joriy karta (katta, doska ustida):** «Qadam {n} / 3» · qadam matni · ostida kulrang «Risk: {risk}» · uch tugma: «Hozir · 11-Modul» · «Keyinroq · 12–13-Modul» · «Uzoqroq · bitiruvdan keyin».
- **Harakat → Vizual o'zgarish:** ufq tugmasi → qadam kartasi (accent chegara, yorliq «qadam») tanlangan ustunga uchib tushadi; ustundagi kartalar joy beradi; keyingi qadam kartasi kiradi.
  3/3 dan keyin doska sarlavhasi «Roadmap'im» → **«Tuzatilgan reja»** (harflar almashadi), doska bir marta yengil yonadi; `QIzoh`: Holatlar va risklarga qarshi qadamlar qo'shilgan roadmap — tuzatilgan reja. (75)
  Har qadam kartasida ✎ (matn yoki ufqni o'zgartirish — yakkama-yakkadan keyin ham).
  3/3 dan keyin kulrang savol: Qaysi qadamdan boshlaysiz? — bitta qadam kartasini bosing (yorliq «Avval», accent) → `birinchi` (ixtiyoriy; qayta bosib almashtiriladi).
- Pastda (kulrang, bitta qator; faqat jonli darsda): Mentor chaqirganda roadmap'ingizni ko'rsating; o'zgarsa — ✎ bilan o'zgartiring. (79)
- «Saqlash» (o'ngda; uch qadam ufqqa qo'yilgach ochiladi) → `pm-m9d15-reja`; saqlangandan keyin tugma «Yangilash» (✎ dan keyin qayta saqlash).
- Xulosa (o'quvchi ma'lumotidan, P-046): Tuzatilgan rejangizda {a} ta qadam hozir ufqida. Birinchisi: {qadam}. (≈90) · hozir ufqida qadam bo'lmasa: Qadamlaringiz keyingi ufqlarda. Birinchisi: {qadam}. (≈75)
  «Birinchisi» — «Avval» belgilangan qadam (`birinchi`); belgilanmagan bo'lsa — hozir ufqidagi birinchi, u ham bo'lmasa — keyinroqdagi birinchisi; uyga vazifa ① va 16-dars shu qadamni oladi.
- Tugma (pastki): Qadamlarni ufqqa qo'ying (n/3) → Tuzatilgan rejani saqlang → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: uch ufq tugmasi (navbatma-navbat to'lqin) → «Saqlash» → «Davom etish».
- Nishon: Plan Fixer! (tuzatilgan reja saqlanganda — bonus, ish bajarilgan; P-048).
- Mentor rejimi: o'quvchi varag'ida qadamlar ufqi chiqadi; Mentor statistikasi: «Tuzatilgan rejani saqlaganlar».
- O'qituvchi eslatmasi: Ufq qoidasi 6-Moduldan: ishni ufqqa u qachon boshlana olishi qo'yadi. Mentor misolida: kutish yozuvi va 10 kishini chaqirish — hozir, APK — keyinroq (12-Modul).
  Hamma qadami «uzoqroq»da bo'lgan o'quvchidan so'rang: «Bu risk bitiruvgacha xalaqit bermaydimi?».
✎ Tayanch 2 ta'rifi «yakkama-yakkadan keyingi roadmap» — o'quvchi bu ekranni suhbatdan oldin ham ko'radi, shuning uchun ta'rif mazmun bilan (TAYANCHGA SAVOL 5).

## 8 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Riskka qadam yozdingiz. Endi u qayerda turadi?** (8 so'z) · savol ustida yorliq yo'q
  - A — Alohida varaqda — roadmap'dan tashqarida (40)
  - ✔ B — Roadmap'da — o'z ufqida, ishlar qatorida (40)
  - C — Faqat Mentorning ekranida — sizda saqlanmaydi (45)
  - D — Risk kartasining ichida — ufqi tanlanmaydi (42)
- To'g'ri izohi: Qadam o'z ufqiga yoziladi — reja shunday tuzatiladi. (52)
- Xato izohlari (≤60): A — Roadmap'dan tashqaridagi qadam unutilishi mumkin. (49) · C — Roadmap sizniki: u sizda ham saqlanadi. (39) ·
  D — Ufqsiz qadam roadmap'da ko'rinmaydi — qachon qilinadi? (54) · (umumiy) Tuzatilgan rejada nima turadi — shuni eslang. (45)
- Javob topilgach (kichik, savol ostida): `RejaDoska` kichik — hozir ustuniga bitta qadam kartasi uchib tushadi (Mentor misoli: «Ilovaga kutish yozuvi qo'shish»).
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): tire to'rttala variantda (S-003); «roadmap» A va B da; to'g'ri javob eng uzuni emas. Har noto'g'ri javob 7-ekran qoidasi bilan noto'g'ri (S-004).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 2 savol (4, 8); 5–7-ekranlar «Saqlash» — mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 4 — «1 — Qaysi biri risk» · 8 — «Yakuniy — Qadam qayerda»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».
- Kartochkalar — 12 ta (jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.

## 11 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha: **Roadmap'ingiz tuzatildi: uch risk, uchta qadam.** (47) · reja saqlanmagan bo'lsa (P-046): **Roadmap'ingizning qolganini uyda yozing.** (40)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Holat bo'lib o'tganni ko'rsatadi, qadam esa oldindagi riskni kamaytiradi. (73)
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Holat ishning rejadagi vaqtiga nisbatan qayerda ekanini ko'rsatadi: bajarildi, kechikdi yoki boshlanmadi.
  - Rejadagi vaqtida tugamagan ish kechikdi deyiladi, keyin tugagan bo'lsa ham.
  - Risk — rejaga xalaqit berishi mumkin bo'lgan narsa.
  - Har riskka bitta qadam yoziladi: riskni kamaytiradigan bitta aniq ish.
  - Qadam roadmap'da o'z ufqiga qo'yiladi — shunda reja tuzatiladi.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: qadamga qarab — agent yoki odamlar · Nechta: 1 qadam · Muddat: keyingi darsgacha
  - ① Tuzatilgan rejada «Avval» deb belgilagan qadamingizni oling: {qadam} (`pm-m9d15-reja.birinchi`; belgilanmagan bo'lsa — hozir ufqidagi birinchisi; saqlanmagan bo'lsa — «Birinchi qadamingizni yozing»).
  - ② Uni bajaring: ilovada bo'lsa — talabni yozib agentga bering; odamlar bilan bo'lsa — ularga yozing yoki ayting.
  - ③ Qadam bajarilganini o'zingiz tekshiring (Mentor misolida — ilova ochilganda kutish yozuvi chiqadimi). Risk o'zgarishi uchun vaqt kerak bo'lishi mumkin.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «G'oyangiz va ilovangiz guruhni ishontiradimi?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ichki skroll qutisi yo'q (SABOQ 18); «Kim bilan» — HwCard yorlig'i (01-dars bilan bir; «Kim uchun» — g'oya qismi bilan to'qnashmasin, T-015). Uyga vazifada pitch va Demo Day aytilmaydi (T-038).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Status Check!** (2-ekran, beshta karta birinchi urinishda) — Mentor roadmap'idagi ishlarga holatni birinchi urinishda to'g'ri qo'ydingiz
- **Step Picker!** (3-ekran, uch bosqich birinchi urinishda) — Uch riskning har biriga mos qadamni birinchi urinishda tanladingiz
- **Risk Spotter!** (4-ekran, 1-savol birinchi urinishda) — Bo'lib o'tgan ish va yordam beradigan narsa orasidan riskni topdingiz
- **Plan Fixer!** (7-ekran, tuzatilgan reja saqlanganda — bonus) — Uch qadamni roadmap'ingizga qo'yib, rejani saqladingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Plan Fixer, S-034: ish qilingan ekranda). Yakuniy savol nishonsiz.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **4 · Risk — oldinda** — 1 Risk — rejaga xalaqit berishi mumkin bo'lgan narsa. · 2 Bo'lib o'tgan ish risk emas — uning holati bor: kechikdi yoki bajarildi. ·
  3 Roadmap'ga yordam beradigan narsa ham risk emas.
  — Sinfga savol: Roadmap'ingizga oldinda nima xalaqit berishi mumkin?
- **8 · Qadam roadmap'ga yoziladi** — 1 Har riskka bitta qadam — riskni kamaytiradigan aniq ish. · 2 Qadam roadmap'da o'z ufqiga qo'yiladi: qachon boshlana olsa. ·
  3 Holatlar va qadamlar qo'shilgan roadmap — tuzatilgan reja.
  — Sinfga savol: Birinchi qadamingiz qaysi ufqda turibdi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Holat nimani ko'rsatadi? | Ishning rejadagi vaqtiga nisbatan qayerda ekanini | Uch holat: bajarildi · kechikdi · boshlanmadi |
| Ish rejadagi vaqtida tugamadi, keyin tugadi. Holati qanday? | Kechikdi | Mentor misolida chiqish va navbat shunday: 14-darsdan keyin ishladi |
| Keyinroq ufqidagi ish hali boshlanmagan. Bu kechikishmi? | Yo'q — holati: boshlanmadi | Uning vaqti hali kelmagan |
| Risk nima? | Rejaga xalaqit berishi mumkin bo'lgan narsa | Bo'lib o'tgan ish risk emas — uning holati bor |
| Har riskka nechta qadam yoziladi? | Bitta — riskni kamaytiradigan aniq ish | «Ehtiyot bo'laman» — hali qadam emas |
| Mentor misolida Render bilan bog'liq risk qaysi? | Bepul xizmat uxlaydi: birinchi ochilish bir daqiqagacha | Qadam: ilovaga kutish yozuvi |
| Ilovani har kuni o'zingiz ochib tursangiz, Backend uxlamaydimi? | Uxlaydi: 15 daqiqa so'rovsiz qolsa | Shuning uchun qadam — kutish yozuvi |
| Mentor misolida foydalanuvchilar bilan bog'liq risk qaysi? | 12-Modulda 50 foydalanuvchi kerak, hozir 3 sinovchi | Qadam: mahalla futbol guruhidan 10 kishini sinovga chaqirish |
| Nega Expo Go Mentor roadmap'iga risk bo'ldi? | U sinash vositasi, hamma o'yinchida yo'q | Qadam: 12-Modulda APK |
| APK nima? | Android telefonga o'rnatiladigan ilova fayli | Mentor misolida — keyinroq ufqida, 12-Modulda |
| Qadam roadmap'ning qaysi ufqiga qo'yiladi? | U qachon boshlana olsa — o'sha ufqqa | Hozir · keyinroq · uzoqroq |
| Tuzatilgan reja nima? | Holatlar va risklarga qarshi qadamlar qo'shilgan roadmap | Mentor bilan ko'rgach, uni yana yangilashingiz mumkin |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (holat — 2 · kechikdi — 2, 4-karta · boshlanmadi — 2, 5-karta · risk — 3 · qadam — 3 · Render, 15 daqiqa — 3 · 50 / 3 sinovchi — 3 · Expo Go, APK — 3 · ufq — 7 · tuzatilgan reja — 7).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunlik — skript bilan sanaldi (`md15/olchov.py`), farq ≤15%, to'g'ri javob yolg'iz eng uzun emas.
1. Holat nimani ko'rsatadi? (2)
   - ✔ A — Ish rejadagi vaqtiga nisbatan qayerda (37)
   - B — Ishga necha kun ketishini oldindan aniq (39)
   - C — Ishni aynan qaysi odam bajarishini (34)
   - D — Ish nechta foydalanuvchiga kerakligini (38)
2. Ish o'z darsida ishladi, telefonda tekshirildi. Holati qanday? (2)
   - A — Kechikdi
   - ✔ B — Bajarildi
   - C — Boshlanmadi
   - D — Bekor qilindi
3. Keyinroq ufqidagi ish hali boshlanmagan. Bu nimani bildiradi? (2)
   - A — Ish kechikdi, uni tezroq qilish kerak (37)
   - B — Roadmap noto'g'ri, qayta yozish kerak (37)
   - ✔ C — Vaqti hali kelmagan, bu odatiy hol (34)
   - D — Ishni roadmap'dan olib tashlash kerak (37)
4. Risk nima? (3)
   - A — Darsda allaqachon bo'lib o'tgan kechikish (41)
   - B — Kelajakda qo'shilishi mumkin bo'lgan funksiya (45)
   - C — Roadmap'dagi bajarilgan ishlar ro'yxati (39)
   - ✔ D — Rejaga xalaqit berishi mumkin bo'lgan narsa (43)
5. Render bepul xizmatida Backend qachon uxlaydi? (3)
   - ✔ A — 15 daqiqa davomida so'rov kelmasa (33)
   - B — Har kuni yarim tunda, o'z-o'zidan (33)
   - C — Kuniga 100 ta so'rovdan keyin (29)
   - D — Ilova telefonda yopilgan zahoti (31)
6. Backend uxlab qolsa, birinchi ochilish qancha kutadi? (3)
   - A — Bir necha soniya
   - ✔ B — Bir daqiqagacha
   - C — Besh daqiqagacha
   - D — Bir soatdan ko'p
7. Mentor misolida «3 sinovchi» riskiga qaysi qadam yozildi? (3)
   - A — Ilovaga yana bitta yangi funksiya qo'shish (42)
   - B — 12-Modul boshlanganda odamlarni qidirish (40)
   - ✔ C — Mahalla futbol guruhidan 10 kishini chaqirish (45)
   - D — Uch sinovchidan ilovani qayta sinashni so'rash (46)
8. Nega Expo Go Mentor roadmap'iga risk bo'ldi? (3)
   - A — U ilovani juda sekin ochgani uchun (34)
   - B — Unda Backend'ga ulanmagani uchun (32)
   - C — U faqat iPhone'da ishlagani uchun (33)
   - ✔ D — U sinash vositasi, hammada yo'q (31)
9. APK nima? (3)
   - ✔ A — Android'ga o'rnatiladigan ilova fayli (37)
   - B — iPhone'dagi ilovalar do'konining nomi (37)
   - C — Expo Go ichidagi maxsus sinov rejimi (36)
   - D — Render'dagi Backend sozlamalari fayli (37)
10. Qadam 12-Modulda bajariladi. Qaysi ufqqa qo'yasiz? (7)
    - A — Hozir — shu 11-Modulda (22)
    - ✔ B — Keyinroq — 12–13-Modul (22)
    - C — Uzoqroq — bitiruvdan keyin (26)
    - D — Ufqsiz — alohida ro'yxatda (26)
11. Qaysi biri riskka qarshi aniq qadam? (6)
    - A — Roadmap'ga ko'proq e'tibor berib ishlash (40)
    - B — Imkon qadar tezroq va ko'proq harakat qilish (44)
    - ✔ C — Shanba kuni 10 kishini sinovga chaqirish (40)
    - D — Risk haqida keyinroq yana o'ylab ko'rish (40)
12. Yakkama-yakkada Mentor bilan nimani ko'rasiz? (5–7)
    - A — Arena natijangiz va ballingizni (31)
    - B — Kodingizning har bir qatorini (29)
    - C — O'nta yangi g'oyangizni birma-bir (33)
    - ✔ D — Holatlar, risklar va qadamlarni (31)

- Savollar ≤12 so'z; kod belgisi arenada yo'q. 4-savolda «mumkin» B va D da (kalit so'z faqat to'g'rida emas); 10-savolda tire to'rttalasida.
- 2-savol bir so'zli javoblar — «Bekor qilindi» holat emas, lekin ishonarli (ish rejadan olingan bo'lishi mumkin). 5, 6-savollar — tayanch 6 faktlari (15 daqiqa, ≈ 1 daqiqa); distraktorlar — boshqa sonlar.
- Kalit ibora testlar bilan takrorlanmaydi (S-008): 4-ekran (qaysi biri risk — o'smir olami) ↔ arena 4 (risk ta'rifi) · 8-ekran (qadam qayerda) ↔ arena 10 (qaysi ufq).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — roadmap · holat · risk · qadam · ufq · bajarildi · kechikdi · boshlanmadi · Render · Expo Go · APK · Maydon Jamoa ·
  uyga vazifa banneri — qadam · risk · reja.
- Arena yozuvlari — platforma shabloni: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/9-Modull/PmOneOnOneLesson.jsx`; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m9d15-v1`, `lessonTitle` «Roadmap bo'yicha qayerdasiz?».
2. `SCREEN_META` 12: hook · plan · concept · concept · test · practice · practice · practice · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 4: 2, 8: 1 };
   `holatlar: -1`, `qadamlar: -1` (2, 3-ekran — ballsiz, nishon bilan), 5–7 `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 4, 8, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s3 `QTushuncha` (`zoom`, `tugadi` — q17/q18; s2 da `QBashorat` + `QTaxmin`) · s4/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s5/s6/s7 `QMustaqil` · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
3. **`RejaDoska`** — bitta vizual (180; qolipda yo'q, yangi): uch ustun (`UFQLAR` — `{ id: 'hozir' | 'keyinroq' | 'uzoqroq', t }`, yorliqlar A-4 aynan), ish kartasi (nom · dars yorlig'i · holat chipi `?` / bajarildi / kechikdi / boshlanmadi),
   «Bugun · 15-dars» chizig'i, qadam kartasi (accent chegara, yorliq «qadam», ostida risk), sarlavha («Roadmap» / «Mentor misoli · Maydon Jamoa» / «Roadmap'im» / «Tuzatilgan reja»), ko'rinishlar `toliq` · `ixcham` · `kichik`.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: rd-karta rd-ufq rd-qadam`). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. Telefon kengligida (393) ustunlar ustma-ust, hozir — tepada.
4. **Mentor varag'i (yangi mexanizm — asosiy seans qarori, TAYANCHGA SAVOL 9):** mentor rejimida 5–7-ekranlarda o'quvchilar ro'yxati (ism · holatlar chizig'i · «Risklar n/3» · «Reja saqlandi ✓»), qatorni bosish → o'sha o'quvchining varag'i:
   holatlar (ish · chip) · uch risk → qadam · ufq. Ma'lumot o'quvchidan jonli sessiya orqali keladi — hozirgi `recordAttempt` `p_texts` (matn 300 belgigacha, «faqat ko'rsatish uchun») yetadimi yoki yangi yo'l kerakmi, tekshirilsin.
   Zaxira (jonli yo'l bo'lmasa): Mentor o'quvchi ekraniga qaraydi; 5-ekran tepasidagi qator shunga qarab almashadi («… o'z ekraningizda ko'rsatasiz») — mexanizm bo'lmasa, «Mentor o'z ekranida ko'radi» deyilmaydi (15-FILTR 21).
   Varaq faqat mentor ekranida; boshqa o'quvchilarga, podiumga va arenaga chiqmaydi.
5. **`MENTOR_REJA`** — 7 × `{ nom, ufq, dars?, holat, dalil }` (A-6 aynan; 13-dars ishi nomi «Ro'yxat kun bo'yicha»). s2 — 5 qadam (4 karta + keyinroq/uzoqroq guruhi), `S2_SAHNA` (telefon dalillari: «8 / 10» → «9 / 10» · «Kelaman», «Kelishini tasdiqladi: 7 / 9» ·
   «Shanba», «Yakshanba» · «Navbatga yozilish» + vaqt chizig'i ✕ ✕ ✓ · xira telefon), `QXato` matnlari (yuqorida), 4 va 5-qadamda `QIzoh`, bashorat 2/3/4 → `QTaxmin`, nishon `statusCheck`.
6. **`MENTOR_RISKLAR`** — 3 × `{ risk, qadam, ufq, sahna, tanlov: [3], togri, xato: {…}, yordam }` (tayanch 1.9 aynan; ufq: hozir · hozir · keyinroq). s3 sahnalari: telefon + hisoblagich 0:00 → 0:59 (yorliq «tezlashtirilgan») va kutish yozuvi «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» ·
   chiziq «Foydalanuvchilar: 3 / 50» → «3 + 10» · ikki telefon (Expo Go bor / yo'q) → «APK · 12-Modul». Birinchi to'g'ri qadamdan keyin `QIzoh` (qadam ta'rifi); 3/3 da xulosa (risk ta'rifi). Nishon `stepPicker`.
7. **s5** — o'qiydi `pm-m9d6-roadmap` (`ishlar[].nom`, `ishlar[].ufq`, `hozir` — dars yorliqlari `hozir` tartibida 11 · 12 · 14) va `pm-m9d13-sinov` (`eng` — `toxtashlar` dagi `id`, karta nomi — o'sha `matn`; `qaytaSinov` — kulrang qator; `tur` — «mashq sinovi» yorlig'i);
   roadmap yo'q — erkin forma (3–8 ish, ufq chiplari); ketma-ket karta (SABOQ 29), keyinroq/uzoqroq kartalarda «Boshlanmadi» halqada; ✎; xulosa o'quvchi sonidan; artefakt-strip «Roadmap'im».
8. **s6** — 3 karta `{ risk, qadam }`; yordamchi qatorlar (5-ekrandagi «kechikdi» ishlar; `pm-m9d13-sinov` — `bajardi.length`); tekshiruv: bo'sh — bloklaydi, qolgani yumshoq (bo'lib o'tgan ish so'zlari · umumiy qadam so'zlari · takror) —
   PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi; Yordam matni trekka qarab (`pm-m9d8-platforma`: web — «saytni»).
9. **s7** — qadam kartalari ketma-ket, uch ufq tugmasi → ustunga uchish; 3/3 da sarlavha almashuvi va `QIzoh`; «Saqlash» → `localStorage` `pm-m9d15-reja` = `{ holatlar: [{ ish, holat }], risklar: [{ risk, qadam, ufq }] × 3, eng: 0–2 | null, birinchi: 0–2 | null, savedAt }`
   (`holat`: `'bajarildi' | 'kechikdi' | 'boshlanmadi'`, `ufq`: `'hozir' | 'keyinroq' | 'uzoqroq'`); ✎ va «Yangilash»; «Avval» tanlovi → `birinchi` (6-ekranda ★ → `eng`); xulosa — `birinchi` qadam (bo'lmasa — hozir ufqidagi birinchi); nishon `planFixer`.
10. s0 — `QKirish` sof so'rovnoma (hammaga `correct: false`, maqtov yo'q — J-026); maket `RejaDoska` `kichik` — `pm-m9d6-roadmap` bo'lsa o'quvchiniki, bo'lmasa `MENTOR_REJA` (yorliq «Mentor misoli · Maydon Jamoa»); javobdan keyin «?» to'lqini.
11. Testlar s4/s8 — `correctIdx` 2/1 = `INLINE_KEYS`; `RECAPS` {4, 8} (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik karta — `QuestionScreen` `vizual` (SABOQ 4).
12. `ACHIEVEMENTS` 4 (`statusCheck`, `stepPicker`, `riskSpotter`, `planFixer`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3) + `set_quiz_keys`; fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}). `SCREEN_INTENTS`.
13. s11 `QYakun`: `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» `small`; `uyga` — yangi `HwCard` (Kim bilan · Nechta · Muddat + 3 qadam; ① `pm-m9d15-reja.birinchi` qadam, bo'lmasa — hozir ufqidagi birinchi); `keyingi` matni. Alohida `.homework.jsx` yo'q.
    Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
14. App.jsx `m9-15` qatoriga `comp: PmOneOnOneLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 386-qator). Bu agent App.jsx ga tegmaydi.
15. **REPO:** darsda yozilmaydi (PM darsi). Mentor misolining uyga vazifasi — kutish yozuvi — teg `m11-dars-15-done` (= `m11-dars-14-done` + «O'yinlar» ekranida kutish yozuvi, `mobil/src/app/index.tsx`); 16-dars jonli demosi shu tegdan (tayanch 3, 9.95).
- Darvozalar: `npm run gates -- src/9-Modull/PmOneOnOneLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

## Manbalar (06.10.2026)
- Holatlar, uch risk va qadam, risk ta'rifi — `00-MODUL-TAYANCH.md` 1.9 va 2 (aynan). Mentor roadmap'i — 1.5; telefon matnlari — 1.7, 1.8, 9.2.
- Render bepul xizmati (15 daqiqa so'rovsiz — uxlaydi, uyg'onishi ≈ 1 daqiqa) — tayanch 6 → 10-Modul tayanchi 6 (render.com/docs/free).
- Expo Go — «Expo Go is a playground for students and learners to test out Expo quickly. It's limited and not useful for building production-grade projects» (tayanch 6; docs.expo.dev/get-started/set-up-your-environment).
- APK — «An Android Package (APK/.apk)» — qurilmaga to'g'ridan-to'g'ri o'rnatiladigan fayl formati (docs.expo.dev/build-reference/apk/, 06.10 o'qildi). Dastur: «APK — 12-Modulgacha» (`00-MANBA.md` 1).
- 12-Modul — 50+ real foydalanuvchi (dastur v9, `00-MANBA.md` 1).
- «Kutish holati» — 10-Modul `08-ProdUpgrade-v3.md` (ta'rif va saytdagi «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» naqshi).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
**Holat (06.10, 15-FILTR):** 1, 4, 6, 14 — auditor ham qabul qildi · 2, 3 — tayanch 1.9, 9.39 (umumiy ta'rif «rejadagi vaqtida») · 5 — tayanch 2 · 7, 8 — 9.95 (matn qoladi; teg `m11-dars-15-done`; 16-dars bilan bir) · 9 — ochiq, matn holatga qarab (KOD 4) · 10 — 9.96 · 11 — 13-FILTR bilan bir · 12 — 9.90 · 13 — 3-ekranda kulrang qator · 15 — «11-Modul» katta harf (TAQIQLAR) · 16 — tayanch 1.9.
1. **12 ekran.** Tayanch 4 «15-dars» ketma-ketligi (hook → reja → risk nazariyasi → test → roadmap holati → uch risk → tuzatilgan reja → yakuniy test → podium → kartochkalar → yakun) 11 bo'g'in.
   12-ga yetkazish uchun reja va risk nazariyasi orasiga **2-ekran «Holatlar»** (Mentor roadmap'iga holat qo'yish, atama «holat») qo'shdim — 5-ekrandagi mustaqil ishning namunasi. Tartib boshqa joyda o'zgarmadi.
2. **Holat izohlari** — tayanchda faqat nomlar (bajarildi · kechikdi · boshlanmadi). Darsda: bajarildi — rejadagi vaqtida ishladi · **kechikdi — o'z darsida tugamagan ish, keyin tugagan bo'lsa ham** (Mentorning chiqish va navbat
   holati shuni talab qiladi: «14-darsdan keyin tuzatildi», lekin «kechikdi») · boshlanmadi — vaqti hali kelmagan ish. Umumiy ta'rif: «Holat ishning rejadagi vaqtiga nisbatan qayerda ekanini ko'rsatadi…».
3. **Uzoqroq ufqdagi ish** (maydon pulini bo'lishish) holati tayanchda yo'q — «boshlanmadi» qo'ydim va «12-Modul ishlari» bilan bitta kartada (2-ekran 5-karta).
4. **«Qadam» ta'rifi** — tayanchda faqat «har riskka bitta qadam». Darsda: «Riskni kamaytiradigan bitta aniq ish — qadam.» 6-ekran tekshiruvi shunga tayanadi («harakat qilaman» — qadam emas).
5. **«Tuzatilgan reja» ta'rifi.** Tayanch 2: «yakkama-yakkadan keyingi roadmap». O'quvchi 7-ekranni suhbatdan oldin ham ko'radi, shuning uchun darsda mazmun bilan: «Holatlar va risklarga qarshi qadamlar qo'shilgan roadmap — tuzatilgan reja.»
   Tayanch ta'rifi shunday o'zgarsinmi?
6. **Kalit `pm-m9d15-reja` ga `risklar[].ufq`** qo'shildi (qadam qaysi ufqda; 7-ekran). 16-dars «keyingi qadam» uchun hozir ufqidagi qadamni o'qiy oladi. Mentor misolida ufqlar: 1 — hozir · 2 — hozir · 3 — keyinroq (tayanchda yo'q, men qo'ydim).
7. **«Kutish holati» → «kutish yozuvi»** (T-015: «holat» bu darsda ish holati). Telefondagi yozuv matni «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» — 10-Modul saytidagi naqshdan, o'ylab topildi. Ilovada shu matn bo'lsinmi?
8. **Mentor misolining birinchi qadami** (kutish yozuvi) — `maydon-jamoa` repo'siga yoziladimi? Tayanch 3 da `m11-dars-15-*` teg yo'q; 16-darsda jonli demo telefonda ko'rsatiladi — kutish yozuvi u yerda bormi, 16-dars MD si bilan kelishilsin.
9. **Mentor varag'i (jonli).** «Mentor ekranida har o'quvchi varag'i» (Qaror-0 14) uchun o'quvchi matni mentorga yetishi kerak. Jonli API da `recordAttempt` `p_texts` (300 belgigacha, «faqat ko'rsatish uchun») bor — yetadimi yoki yangi yo'l kerakmi,
   asosiy seans qaror qilsin. Zaxira — o'quvchi o'z ekranini ko'rsatadi (dars o'zgarmaydi).
10. **Yakkama-yakka tartibi** — o'quvchi 6-ekranni tugatgach, ≈ 3–4 daqiqa, uch savol (A-8). Tayanchda vaqt va savollar yo'q. Sinf 12–15 kishi bo'lsa ≈ 45–50 daqiqa — 5–7-ekranlar vaqti shunga mo'ljallandi.
11. **13-darsdagi ish nomi** — tayanch «sinov tuzatishi»; darsda kartada «Ro'yxat kun bo'yicha» («tuzat-» ildizi faqat tuzatilgan rejada). O'quvchi kartasida — `pm-m9d13-sinov.eng` to'xtash matnining qisqasi.
12. ~~Sinovchilar soni~~ — **yopildi: 9.90** (`bajardi.length`). Avvalgi savol: `pm-m9d13-sinov` da alohida maydon yo'q; 6-ekranda `toxtashlar` dagi turli `kim` lar soni olinadi (to'xtamagan sinovchi sanalmay qolishi mumkin). `sinovchilar` soni maydoni qo'shilsinmi?
13. **APK — faqat Android.** Dastur «Expo Go / APK» deydi; iPhone'dagi o'yinchi uchun 12-Modulda nima bo'lishi tayanchda yo'q. Darsda faqat O'qituvchi eslatmasida «iPhone yo'li 12-Modulda» deb qoldirdim.
14. **Dars yorliqlari** (11 · 12 · 14) — o'quvchi roadmap'idagi `hozir` tartibidan (1, 2, 3-asosiy funksiya = 11, 12, 14-darslar). 6-dars MD si `hozir` ni shu tartibda saqlasa — to'g'ri.
15. **Ufq yorliqlari** «Hozir · 11-Modul» · «Keyinroq · 12–13-Modul» — tayanch 1.5 dagi kichik harf «modul» (10-Modul yillik yo'l darsidagi «2-Modul» naqshi). TAQIQLAR «9-Modulda» katta harf bilan — ufq yorlig'ida qaysi biri bo'lsin?
16. **«Render bepul rejasi» → «Render bepul xizmati».** Tayanch 1.9 da «rejasi»; bu darsda «reja» — roadmap va tuzatilgan reja (T-015), shuning uchun tayanch 6 dagi «bepul xizmat» so'zini oldim.
    Tayanch 1.9 ham shunday tuzatilsinmi (16-dars ham shu riskni aytishi mumkin)?

## Shubhali joylar (ishonchim komil emas)
- **(yopildi: umumiy ta'rif «rejadagi vaqtida», 15-FILTR 1)** **«Kechikdi» va hozir ishlayotgan ish.** Mentorning chiqish va navbat funksiyasi hozir ishlaydi, lekin holati «kechikdi» (tayanch). Auditor «bu bajarildi» deyishi mumkin — darsda izoh bor («keyin tugagan bo'lsa ham»), lekin bahsli.
- **3-ekran 1-bosqich distraktori** «Ilovani har kuni o'zingiz ochib turish» — xato izohi Render faktiga tayanadi (15 daqiqa so'rovsiz qolsa uxlaydi). Ochib turish bir necha daqiqa uyg'oq saqlaydi — «hech foyda yo'q» demadim, faqat «yana uxlaydi».
- **3-ekran hisoblagichi 0:00 → 0:59** — tezlashtirilgan namoyish (yorliq bor). «Bir daqiqagacha» — yuqori chegara; sahna har safar to'liq daqiqani ko'rsatadi.
- **«12-Modulda 50 foydalanuvchi kerak»** — dastur fakti va Mentor riski; o'quvchi matnida kelajak modul tilga olinadi. Bu va'da emas, roadmap ufqi (6-dars) — lekin T-038 nuqtai nazaridan auditor ko'rsatishi mumkin.
- **(yopildi: B almashtirildi, 15-FILTR 6)** **4-ekran B** («Ilovaga yana bitta funksiya qo'shish mumkin») — imkoniyat ham rejaga xalaqit qilishi mumkin (vaqtni oladi). To'g'ri javob «imtihon haftasi» aniqroq, lekin B ni «risk emas» deyish bahsli bo'lishi mumkin.
- **(yopildi: «Risk kartasining ichida — ufqi tanlanmaydi», 15-FILTR 37)** **8-ekran D** («Hech qayerda — uni yodda saqlab yurasiz») — o'zini sal fosh qiladi; ishonarliroq distraktor topa olmadim.
- **2-ekran 1–3-kartalar** — telefon dalili javobni deyarli aytadi («11-darsda shunday ishladi»); qiyini 4 va 5-kartalar. Ataylab: uch holatning nomi avval oson kartada tanishadi.
- **Arena 8** — distraktorlar (sekin ochadi, Backend'ga ulanmaydi, faqat iPhone'da) — rost emas; savol «nega» deb so'raydi, ular noto'g'ri sabab sifatida. Arena 5, 6 — sonli distraktorlar (bankdagi naqsh).
- **APK ta'rifi** «Android telefonga o'rnatiladigan ilova fayli» — Expo hujjatidagi «direct installation» ning soddasi; Android'da noma'lum manbadan o'rnatishga ruxsat kerak bo'lishi aytilmadi (12-Modul mavzusi).
- **Mentor varag'i jonli** ishlamasa, «Yakkama-yakka suhbatda Mentor buni o'z ekranida ko'radi» qatori yolg'on bo'lib qoladi — qator faqat jonli yo'l ishlaganda chiqsin (KOD 4).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 385–387 — `m9-14` «Loyiha kuni: 3-asosiy funksiya» → **`m9-15` «Roadmap bo'yicha qayerdasiz?»** (osti «Mentor bilan yakkama-yakka: risklar va tuzatilgan reja» — reja chap qatori so'zma-so'z) →
  `m9-16` «G'oyangiz va ilovangiz guruhni ishontiradimi?» (yakun qatori). 0-ekran sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (Mentor roadmap'i, holatlar va uch risk — tayanch 1.5, 1.9 aynan); ikkinchi misol faqat testda (imtihon haftasi — P-002); keyssiz; metafora yo'q; bitta vizual — `RejaDoska` (+ chapda telefon maketi 2, 3-ekranlarda).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (tugma → holat chipi, telefon dalili), 3 (tanlov → sahna o'zgaradi, qadam kartaga) + 0, 5, 6, 7; testlarda javobdan keyingi karta. «bosish → matn-karta» yo'q.
- [x] O'lchov (skript: `scratchpad/md15/olchov.py`): sarlavha 25–49, bitta qator · Mentor ≤2 gap (interaktiv ekranlarda 1), sarlavhani takrorlamaydi · xulosa 58–105 · hook javobi 95 · xato izohi 18–58 · to'g'ri izoh 52–54.
- [x] Atamalar: roadmap, ufq va yorliqlari (tayanch 1.5), funksiya nomlari, sinov, Backend, Render, Expo Go — oldingi darslar bilan bir; yangi holat, risk, qadam, tuzatilgan reja — misoldan keyin; «xavf», «push» (eslatma ma'nosida), «sinov tuzatishi» o'quvchi matnida yo'q;
  «holat» bitta ma'noda («kutish holati» → «kutish yozuvi»); siz-forma, tugmalar ot-shaklda yoki siz-formada («Saqlash», «Bajarildi», «Davom etish»).
- [x] Testlar: 4 variant, uzunlik teng (s4 41/43/40/42 · s8 40/40/45/39 — farq ≤15%); to'g'ri javob hech qayerda yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas (s4 «mumkin» B, C da; s8 tire to'rttalasida).
  Arena 12 — farq ≤15% (2, 6-savollar bir-ikki so'zli), ✔ A3 B3 C3 D3. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «100%», «albatta» — yo'q; «mumkin», «Mentor misolida» bilan chegaralangan).
- [x] Ichki kodlar o'quvchi matnida yo'q (F1–F3, `m9-NN`, «Modul 11» yo'q; modul raqami LMS raqamida). Keys yo'q. Tashqi fakt — tayanch 6 va Expo hujjati (manba bilan). «KOD» ro'yxati 15 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (holat, risk, qadam, tuzatilgan reja — misoldan keyin, sarlavhada yo'q) · T-014/T-015 (roadmap/reja, holat, qadam, «tuzat-» — bir ma'noda) · T-016 (metafora yo'q) · T-020 · T-029/T-047 ·
  T-039 («roadmap'ingiz» — 6-darsda tuzilgan) · T-042 (ta'riflar so'zma-so'z: 2, 3, 7-ekran, kartochka, yakun) · T-043 («Mentor misolida») · T-045 (Expo Go — sinash vositasi; APK — Android) · T-048 · T-049 · T-064 ·
  P-001 · P-002 · P-004 (0, 5–7 — o'z roadmap'i) · P-008 · P-012 (testlar 4 va 8 — har biri o'z nazariyasi va mashqidan keyin) · P-013 · P-015 · P-016 · P-025 · P-033 · P-036 · P-046 · P-048 · P-055 · P-062 · P-064 · P-067 ·
  S-001/S-002/S-004/S-006/S-008/S-010/S-015/S-020/S-026/S-027/S-034/S-040 · PM-005 (2-tur) · PM-018 (real kompaniya ichki qarori yo'q) · PM-020 (xulosa qoliplari o'quvchi so'zlari bilan o'qib tekshirildi) · PM-027 (yangi uyga vazifa fayli yo'q) · J-026 · SABOQ 1–31.
- [ ] Ochiq: Mentor varag'i uchun jonli mexanizm (KOD 4, TAYANCHGA SAVOL 9) — asosiy seans qarori; kutish yozuvi matni (TAYANCHGA SAVOL 7).
