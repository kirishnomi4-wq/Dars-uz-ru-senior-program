# 12-Modul (kod: `src/10-Modull`) · 11-dars (PM) «Raqamlaringiz pitchni qanday o'zgartiradi?» — MD v3

Fayl: `src/10-Modull/PmPitchReviewLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m10-11` · **12 ekran** (qisqa PM dars — tayanch 4 «11-dars»; Qaror-0 19) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) ·
bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi · kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta) · ekranga kirganda bo'sh, ma'nosiz element yo'q ·
ekranda ≤ 3 blok · manba oynasi chapda, pitch varag'i o'ngda (SABOQ 21) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 4-ekran — **C** (`correctIdx 2`) · 8-ekran — **B** (`correctIdx 1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 407–409, grep 06.10, DE-205): `m10-10` «50 foydalanuvchiga yetdingizmi?» → **`m10-11` «Raqamlaringiz pitchni qanday o'zgartiradi?»** (osti: «Mentor bilan yakkama-yakka: tuzatilgan pitch», `type: 'PM'`) → `m10-12` «Raqamlaringiz zalni ishontiradimi?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (da'volar, dalillar, qarorlar → tuzatilgan pitch), mustaqil ish majburiy (5, 6, 7-ekranlar). **Keyssiz** (tayanch 5, Qaror-0 22). **Kod ekrani yo'q** (tayanch 4, Qaror-0 19). REPO yo'q (tayanch 3: «PM darslari 11, 12 — repo'ga yozmaydi»).
**Vaqt: ≈ 90 daqiqa** — kirish va reja (0–1) ≈ 5 · ikki tushuncha va 1-savol (2–4) ≈ 17 · mustaqil ish va yakkama-yakka (5–7) ≈ 52 · yakuniy savol, podium, kartochkalar, arena (8–11) ≈ 16. Yakkama-yakka vaqti — A-8 (har o'quvchiga ≈ 2–3 daqiqa; ⛔ pilotda taymer bilan).
11-FILTR (F-1006-365, 06.10.2026) dan keyingi holat: dalilning uch narsasi — **son yoki yozuv · manba · qachon** («sana» emas) · Mentorning 3-da'vosi qaytganlar soni bilan qayta yoziladi (2-da'vo dalili bilan takror edi) · yakkama-yakkada bitta da'vo, bitta dalil, bitta qaror · 8-ekran savoli qayta yozildi.
Manba: `00-MODUL-TAYANCH.md` (1.0 — muammo va yechim gapi · 1.10 — Mentor hisoboti va zaxira reja · **1.11 — da'vo, dalil, Mentorning to'rt da'vosi — AYNAN** · 1.13 — sonlar jadvali · 2 — atamalar · 4 — 11-dars shakli · 7 — oldindan tuzatiladigan sinflar · 8 — `pm-m9d16-pitch`, `pm-m10d10-hisobot`, `pm-m10d11-pitch` · 9 — to'lqin kelishuvlari) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 2, 13, 15, 19, 22) · `00-TAQIQLAR.md` · 11-Modul tayanchi (1.3 — intervyu sanog'i · 1.9 — yakkama-yakka va pitch · 2 · 9.46 «bo'lak» · 9.62 nom rangi · 9.96 yakkama-yakka vaqti · 9.98 pitch dalil jumlalari) ·
namunalar: 11-Modul `15-PmOneOnOne-v3.md` + `15-FILTR.md` (12 ekranli yakkama-yakka) · `16-PmPrototypePitch-v3.md` + `16-FILTR.md` (to'rt bo'lakli pitch — o'quvchi uni ochadi).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «Mentor bilan yakkama-yakka — progress + tuzatishlar → tuzatilgan pitch»; tayanch 1.11, 4; Qaror-0 19):
   o'quvchi 11-Modul pitchini (`pm-m9d16-pitch`) ochadi, undagi va bugun aytmoqchi bo'lgan **da'volarni** belgilaydi, har biriga 10-darsdagi hisobotidan (`pm-m10d10-hisobot`) **dalil** qo'yadi — son yoki yozuv · manba · qachon;
   dalilsiz da'voni **qayta yozadi** yoki **olib tashlaydi**. Natija — **tuzatilgan pitch** (qoralama; saqlanadi `pm-m10d11-pitch`, 12-dars o'qiydi). 5–7-ekranlar paytida Mentor (o'qituvchi) har o'quvchi bilan **yakkama-yakka** gaplashadi va da'volar bilan dalillarni ko'radi (A-8).
   Mentor misoli — namuna, umumiy qolip emas (tayanch 7.2b): o'quvchining da'volari o'z pitchidan va o'z sonlaridan. Uyga vazifa — yakun kartasida (alohida `.homework.jsx` yo'q).
2. **Bugungi asosiy fikr (P-013):** Sonlar pitchni o'zgartiradi: dalili bor gap qoladi, dalilsiz gap qayta yoziladi yoki olib tashlanadi. (Yakunda ScoreRing ostida, `small`; kartochkalarda so'zma-so'z yo'q.)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 11-Modul 16-dars: **pitch** · **zal** · **bo'lak** — pitchning to'rt qismidan biri: **Muammo · Yechim · Jonli demo · Keyingi qadam** (nomlar aynan; 11-Modul 9.46) · **jonli demo** — «Jonli demo bo'lagida ilova zal oldida telefonda ishlatib ko'rsatiladi.» ·
     **dalil** muammo bo'lagida — sanoq («5 o'yinchidan 4 tasi») va harakat belgisi · «10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.» · Database'dagi son va «unga nima kirgani» (16-dars 9-ekran).
   - 11-Modul 15-dars: **yakkama-yakka** (Mentor bilan bir o'quvchining suhbati) · **roadmap**, **risk** — bugun takrorlanmaydi, 1-ekranda bir gap (tayanch 1.11).
   - 12-Modul 7–10-darslar: **ro'yxatdan o'tgan** · **asosiy harakatni qilgan** — «hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan» (navbatda turgani — qo'shilgan emas; tayanch 9.23) · sinfdoshlar sanaladi, lekin alohida aytiladi (Qaror-0 13) · namuna va tekshiruv akkauntlari sanalmaydi ·
     **sanoq sahifasi** (8-dars, `lending/sanoq.html`) · **metrika hisoboti** (10-dars: to'rt son, har birining manbasi va sanasi bilan) · **Mentor tekshiruvi** — «Son qayerdan?» · «Kimlar sanalgan?» · «Oldingi son bormi?» (qabul / tuzatish; tayanch 9.42 a) · **zaxira reja** (bo'g'in · gipoteza · bir haftada bajariladigan bitta ish) · **bosh raqam** · **qaytganlar foizi** · Umami (lending: tashrif va tugma bosilishi) · Neon SQL Editor.
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan, dars bo'yi so'zma-so'z (T-042):**
   - **da'vo** — «Pitchdagi tekshirsa bo'ladigan gap.» · **dalil** — «Da'voni ko'rsatadigan son yoki yozuv.» (2-ekran xulosasi — Mentorning to'rt gapi belgilangandan keyin). 11-Moduldagi «dalil» bilan ko'prik: o'sha so'z, bugun — har da'voda.
   - **son yoki yozuv · manba · qachon** — dalilning uch narsasi (11-FILTR 1, 7; tayanch 9.43 a): **manba** — «Dalil qayerdan olingani.» (3-ekran, manba tanlangandan keyin `QIzoh`) · **qachon** — son qachon sanalgani yoki yozuv qachon olingani: kun yoki davr (3-ekran, tanlangandan keyin `QIzoh`).
     «Sana» so'zi dalilning uchinchi narsasi uchun ishlatilmaydi: Mentor dalillarida kalendar sana yo'q («ishga tushirilganidan bir hafta keyin», «11-Modul 3–4-darslari» — bular sana emas, davr); 10-darsdagi hisobotdan olingan dalilda «qachon» o'rniga hisobotdagi sana turadi. Qaror-0 19 so'zi ham — «qachon sanalgan».
     Manbalar (tayanch 1.11): Database · sanoq sahifasi · Umami — **sanaydigan** manbalar: ulardan olingan dalil — son; intervyu yozuvlari · sinov yozuvlari — odamlar bilan ish: dalil son ham, yozuv ham bo'lishi mumkin («3 sinovchidan 2 tasi tugmani topmadi» yoki «sinovchi tugmani topa olmadi»).
     Xulosa «Bu darsda har dalilda uch narsa bor: son yoki yozuv, manba va qachon olingani.» — «Bu darsda» bilan chegaralangan (tayanch 7.2a).
     **Jonli demo ham dalil** (11-FILTR 5, 6): zal telefonda o'zi ko'radigan gapga bugun dalil kartasi qo'yilmaydi — u «da'vo emas» deyilmaydi, bugungi mashq zal o'zi ko'ra olmaydigan gaplar haqida (A-9).
   - **qayta yozish · olib tashlash** — dalilsiz da'vo bilan nima qilinadi (tayanch 1.11: «Dalilsiz da'vo — qayta yoziladi yoki olib tashlanadi.»). 2-ekranda Mentor qarori ko'rinadi, qoida so'zi — 7-ekran, kartochka va yakunda.
   - **tuzatilgan pitch** — «Har da'vosida dalil bor yoki dalilsiz da'vosi olib tashlangan pitch.» (tayanch 2; 7-ekran, «Saqlash» bosilgandan keyin `QIzoh`). Ta'rif rost bo'lishi uchun pitchda belgilanmagan tekshirsa bo'ladigan gap qolmasligi kerak — 7-ekran yakuniy kartasidagi ko'rik (11-FILTR 9). Qoralama — keyin yana tuzatilishi mumkin (kartochka izohi).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«son»** — o'quvchi matnida hamma sanalgan narsa (Database soni, intervyu sanog'i, Umami tashriflari). **«raqam»** — faqat dars nomida («Raqamlaringiz …», DE-205 — o'zgarmaydi) va atama «bosh raqam» da; boshqa joyda «son» (11-Modul 16-dars odati — «son» / «sanoq»).
     11-Moduldagi «sanoq» («5 tadan 4 tasi») bugun dalilning «son» i sifatida aytiladi; «sanoq sahifasi» — atoqli nom (8-dars).
   - **«bo'lak»** — pitchning to'rt qismidan biri; «qism» pitch uchun ishlatilmaydi (11-Modul 9.46). **«Keyingi qadam»** — faqat bo'lak nomi (atoqli nom, tayanch 2); boshqa ma'noda «qadam» bu darsda yo'q (ekran ichidagi tanlovlar — «Son · Manba · Sana», «1 / 4»).
   - **«gap»** — pitchdagi bitta jumla (da'vo bo'lishi ham, bo'lmasligi ham mumkin). **«da'vo»** — faqat tekshirsa bo'ladigan gap. **«va'da»** — kelajak natijasi haqidagi gap («Tez orada 50 ga yetamiz»; tayanch 1.11 «dalilsiz va'da»).
   - **«ish»** — zaxira rejadagi ish va Keyingi qadam bo'lagiga yoziladigan qiladigan ishingiz (tayanch 2: zaxira rejada — «ish»). **«maqsad»** — 50 (modul maqsadi); maqsadni maqsad deb aytish va'da emas — dalilsiz va'da olib tashlanishi ham, maqsad deb qayta yozilishi ham mumkin («Maqsadimiz — …»); Mentor o'z misolida olib tashlagan (11-FILTR 10–12; 2, 7-ekran).
   - **«tekshir-»** — da'vo ta'rifida («tekshirsa bo'ladigan») va «Mentor tekshiruvi»da; **«sinov»** — faqat real odam bilan (11-Modul 13-dars — «sinov yozuvlari»). **«e'lon»** — faqat o'yin e'loni. **«kishi»** — Database'dagi ro'yxatdan o'tgan hisob (tayanch 1.11 so'zi); **«qurilma»** — sanoq sahifasi; **«tashrif»** — Umami.
   - **«pitch varag'i»**, **«Mentor varag'i»** — faqat MD va «KOD» da. O'quvchi matnida — «pitchingiz», «Pitchim», «Tuzatilgan pitch».
   - **Ishlatilmaydi:** tezis, proof, fakt (da'vo ma'nosida), korrektirovka, slayd, «qism» (pitch uchun), hodisa (bu darsda kerak emas — T-015), push, xabar, bosqich (7-dars reja bo'lagi), «isbotladi» (qayta yozilgan gap haqida), «zal ishonadi» (kafolat), daftar.
6. **Raqamlar (faqat tayanch 1.10, 1.11, 1.13 va 11-Modul tayanchi 1.3 dan; o'quvchi matnida «Mentor misolida» deb):**
   - **Mentorning to'rt da'vosi (1.11 — 11-FILTR dan keyin yangilandi, tayanch 9.43 b):** 1) «O'yinchilar jamoaga odam yig'ishda qiynaladi» — dalil bor: 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan (intervyu yozuvlari, 11-Modul) ·
     2) «Ilovani odamlar ishlatyapti» — dalil qo'shiladi: 38 kishi ro'yxatdan o'tdi, 19 tasi asosiy harakatni qildi (Database, bir hafta keyin; ostida kulrang izoh — 10-darsdagi hisobot so'zi: «asosiy harakat — hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan») ·
     3) «O'yinchilarga ilova yoqdi» — dalilsiz → qayta yoziladi: «Birinchi uch kunda ilovani ochgan 46 qurilmadan 17 tasi keyingi ikki kunda yana ochdi.» (Database, besh kun keyin; birligi — qurilma).
     ⚠️ Avval 3-da'vo «38 kishidan 19 tasi hozir … qatnashyapti» deb qayta yozilgan edi — bu 2-da'voning dalili bilan bitta son (darsning o'z ogohlantirishi «bu dalil boshqa da'voda ham bor» Mentor misolida ishga tushardi). Endi qaytganlar soni: 10-dars hisobotining 4-qatori, 12-darsdagi «qaytib kelyaptimi?» javobi bilan bir yo'nalish ·
     4) «Tez orada 50 ga yetamiz» — dalilsiz va'da → olib tashlanadi; o'rniga keyingi qadam: zaxira rejadagi ish.
   - **Mentor hisoboti (1.10, ishga tushirilganidan bir hafta keyin):** ro'yxatdan o'tgan **38** / 50 (**11 tasi sinfdosh**; Database) · asosiy harakatni qilgan **19** (Database) · sanoq sahifasi (qurilma): ochdi 61 · ro'yxatdan o'tdi 38 · qo'shildi 18 · kelishini tasdiqladi 14 ·
     Umami (lending): tashriflar 74 · «Qo'shilmoqchiman» 41. Zaxira reja ishi — «ilovada e'lon berilgach «Havolani ulashish» tugmasi».
   - **Ro'yxatdan o'tgan, jami (1.13; 3-ekran sana qatorlari):** ishga tushirish kuni **20** · 3 kun keyin **27** · bir hafta keyin **38**.
   - **Intervyu sanog'i (11-Modul tayanchi 1.3, jamoa yig'ish):** oxirgi marta muammo bo'lgan — 4 / 5.
   - Mentor dalillarida «qachon» — tayanchda kalendar sana yo'q: «11-Modul 3–4-darslari» (intervyu) · «ishga tushirilganidan bir hafta keyin» (Database: 38, 19) · «ishga tushirilganidan besh kun keyin» (Database: 46 dan 17). Boshqa son yo'q.
     1-da'vo dalili yonida kulrang: «5 o'yinchi — kichik son: bu tanlov uchun dalil, isbot emas.» (11-Modul 16-dars gapi shakli; 11-FILTR 4).
     Har son yonida nima sanalgani: kishi (Database) · qurilma (sanoq sahifasi) · tashrif (Umami) — har xil o'lchovdagi sonlar ayirilmaydi va solishtirilmaydi (tayanch 1.13).
7. **Misol-ip — «Maydon Jamoa» (tayanch 1).** Mentor pitchi bu darsda — **qoralama** (`MENTOR_PITCH`): 11-Modul pitchining har bo'lagidan asosiy gap va ilova chiqqandan keyin qo'shilgan uch gap. Bo'laklar bo'yicha (TAYANCHGA SAVOL 1, 2):
   - **Muammo** — «O'yinchilar jamoaga odam yig'ishda qiynaladi.» (1-da'vo, 1.11 aynan)
   - **Yechim** — «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» (1.0 so'zma-so'z; kulrang yorliq «jonli demoda ko'rinadi» — A-9)
   - **Jonli demo** — «Telefonda «Qo'shilaman» bosiladi: «8 / 10» o'rniga «9 / 10».» (kulrang, «jonli demoda ko'rinadi») · «Ilovani odamlar ishlatyapti.» (2-da'vo) · «O'yinchilarga ilova yoqdi.» (3-da'vo)
   - **Keyingi qadam** — «Tez orada 50 ga yetamiz.» (4-da'vo) → olib tashlangach o'rniga: «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi.» (1.10 zaxira ishidan — TAYANCHGA SAVOL 6)
   Pitch gaplari — olam ichidagi matn (T-008). Ikkinchi misol faqat testlarda (P-002), Mentorning 11-Moduldagi g'oyalari olamidan: **uy vazifalari ilovasi** (4-ekran), **kitob almashish ilovasi** (8-ekran). Metafora yo'q. Keys yo'q.
8. **Yakkama-yakka — tashkil etilishi (Qaror-0 19; tayanch 1.11; 11-Modul 9.96; O'qituvchi eslatmalarida batafsil):** o'quvchi 6-ekranni (dalillar) tugatgach, Mentor uni chaqiradi; suhbat darsdan tashqariga chiqmaydi.
   **Asosiy yo'l — o'quvchi o'z ekranini Mentorga ko'rsatadi** (11-FILTR 19): yangi mexanizm kerak emas, shaxsiy ma'lumot boshqa ekranga chiqmaydi. Mentorning jonli varag'i — «qur» da mexanizm tayyor bo'lsa qo'shimcha qulaylik («KOD» 10), dars unga bog'liq emas.
   **Har o'quvchida Mentor uchta narsani ko'radi** (11-FILTR 20 — hamma da'voni emas): eng muhim bitta da'vo · uning dalili · bitta dalilsiz gap bo'yicha qaror. Qolgan da'volarni o'quvchi o'zi qiladi.
   Uch savol: «Bu son qayerdan va nimani sanaydi?» (ro'yxatdan o'tganlar soni bo'lsa — «sinfdoshlar alohida aytilganmi?») · «Bu dalil aynan shu gapni ko'rsatadimi?» · «Qaysi da'vo dalilsiz — qayta yozasizmi yoki olib tashlaysizmi?» Qarorni o'quvchi qiladi, Mentor emas.
   Vaqt: birinchi o'quvchi ≈ 28–30-daqiqada; har o'quvchiga ≈ 2–3 daqiqa (12 kishi — ≈ 36 daqiqa, 15 kishi — 2 daqiqadan). ⛔ Pilotda taymer bilan. Kutayotganlar 7-ekranda ishlaydi; suhbatdan keyin ✎ bilan o'zgartiradi.
9. **«Jonli demoda ko'rinadi» (tayanch 9.43 c; 11-FILTR 5, 6):** yechim gapi va telefondagi asosiy harakat — zal ularni jonli demoda telefonda o'zi ko'radi: **jonli demo ham dalil**, faqat boshqa turi. Ular ham tekshirsa bo'ladigan gap — «da'vo emas» deyilmaydi;
   bugungi mashqqa kirmaydi, chunki bugun zal o'zi ko'ra olmaydigan gaplar tekshiriladi: odamlar, sonlar, natija (5-ekranda Yechim kartasi yo'q — kulrang qator; telefondagi harakat kulrang, bosilmaydi).
   11-Modul pitchidagi muammo daliliga yorliq «dalil» (5-ekran) — u 6-ekranda muammo da'vosiga dalil bo'lib taklif qilinadi (u son ham, yozuv ham bo'lishi mumkin — 11-Modulda «sanoq va harakat belgisi»).
10. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; manba oynasi (Neon natijasi, brauzerdagi Umami va sanoq sahifasi, intervyu jadvali), pitch varag'i va zal siluetlari chizilgan (CSS/SVG), logotip yo'q; ✓ ✕ › ✎ — belgilar.
    «Maydon Jamoa» — varaq sarlavhasida o'z rangida (11-Modul 9.62). O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q.
    Matn o'lchovi (python bilan sanalgan, qavsda): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 · test variantlari ±15%.
11. **Kod ekrani yo'q** (tayanch 4: «11 — yo'q»; PM darslarida kod mexanikasi ketma-ket takrorlanmaydi: 10 — Neon SQL · 11 — yo'q · 12 — kod oynasi). Uyga vazifa ② da Neon'da 10-darsdagi SQL qayta ishga tushiriladi — yangi SQL o'rgatilmaydi.
12. **Saqlash kalitlari (tayanch 8):** o'qiydi `pm-m9d16-pitch` (`muammo.gap`, `muammo.dalil`, `yechim`, `demo.harakat`, `demo.tuzatish`, `demo.son`, `keyingi`) va `pm-m10d10-hisobot` (`royxat`, `asosiy`, `bosh`, `qaytgan`, `tekshiruv`, `tuzatishQator`, `zaxira`);
    yozadi `pm-m10d11-pitch` = `{ davolar: [{ id, bolak, gap, dalil: { son, yozuv, manba, qachon } | null, qaror: 'qoldi' | 'qayta-yozildi' | 'olib-tashlandi', yangiGap }], bolaklar, savedAt }` (tayanch 8, 9.43 d).
    **O'zgarmas shartlar (11-FILTR 15):** `qoldi` → `dalil` bor · `qayta-yozildi` → `yangiGap` va unga mos `dalil` bor · `olib-tashlandi` → `dalil` shart emas. `dalil` da `son` yoki `yozuv` dan kamida bittasi to'la; sanaydigan manbada (Database · sanoq sahifasi · Umami) — `son`.
    Kalit yo'q bo'lsa — o'quvchi o'zi yozadi (tayanch 8 qoidasi): pitch yo'q — to'rt bo'lakka bittadan gap (5-ekran); hisobot yo'q — dalilni o'zi yozadi (6-ekran). Kalitga ism, login, akkaunt nomi yozilmaydi.
13. **11-Modul 15-darsi takrorlanmaydi (tayanch 1.11):** roadmap holati va risklar — faqat 1-ekranda bir gap: «Roadmap'ingizni 11-Modulda ko'rgansiz — bugun pitch.»

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 7-darsda ilova odamlarga yuborildi, 8–9-darslarda qadamlar sanaldi va tuzatildi, 10-darsda metrika hisoboti va Mentor tekshiruvi bo'ldi. 11-Modul 16-darsidagi pitch esa ilova odamlarga yetmasdan yozilgan. Bugun — o'sha pitch sonlar bilan tuzatiladi.
- **Dars ipi:** 0 — pitchingiz va 10-darsdagi sonlaringiz: pitchda nima o'zgaradi (ballsiz) → 2 — Mentor pitchidagi to'rt gap: qaysi birining dalili bor; dalilsizlari bilan Mentor nima qildi (atamalar «da'vo», «dalil») →
  3 — Mentor daliliga son, manba va qachon sanalgani yoziladi (zal savollari bilan) → 4 — test: dalilda nima yetishmaydi → 5 — o'z pitchingizdagi da'volar → 6 — har biriga dalil (shu paytdan yakkama-yakka) →
  7 — dalilsizini qayta yozish yoki olib tashlash — tuzatilgan pitch → 8 — yakuniy: dalilsiz va'da → podium → kartochkalar → yakun (holatga qarab), uyda — Mentor so'ragan tuzatish va yangi son.
- **Bitta vizual — «Pitch va dalil» (`PitchDalil`, dars bo'yi, 163/180; bitta manba `MENTOR_PITCH` + `MENTOR_MANBA` + o'quvchi pitchi):**
  - **chapda — manba oynasi** (o'lchami barqaror; sarlavha qatorida manba nomi): **Database** — Neon SQL Editor natija kartasi (chizilgan, logotipsiz; qator nomi va son) · **sanoq sahifasi** — brauzer oynasi `sanoq.html` (to'rt qator, yorliq «qurilma») ·
    **Umami** — brauzer oynasidagi lending hisoboti (tashriflar · «Qo'shilmoqchiman», yorliq «tashrif») · **intervyu yozuvlari** — jadval (11-Modul sanoq qatori). Bo'sh holat — kulrang skelet, sarlavha «Manba». Mentor sonlari ustida kulrang yorliq «Mentor misolida».
  - **o'ngda — pitch varag'i:** to'rt bo'lak ustma-ust (Muammo · Yechim · Jonli demo · Keyingi qadam; bir xil kenglikda, bo'lak nomi kulrang), har bo'lakda 1–3 gap. Gap holatlari:
    oddiy · «jonli demoda ko'rinadi» (kulrang, kichik yorliq) · joriy (accent halqa) · da'vo (accent ostki chiziq) · **dalil tegi** gap ostida — avval bitta katak, keyin uchta: «son yoki yozuv · manba · qachon» (bo'sh — uzuq chiziq, U-041; to'lgani — yashil) ·
    «dalil yo'q» (`err` och fon yorliq) · qayta yozildi (eski gap ustidan chiziq va xira, yangi gap sirg'alib kiradi) · olib tashlandi (ustidan chiziq, qatorga yig'iladi).
    Varaq sarlavhasi: «Mentor misoli · Maydon Jamoa pitchi» (nom o'z rangida) → «Pitchim» → 7-ekranda saqlangach «Tuzatilgan pitch» (harflar almashadi).
  - **zal** (faqat 3-ekranda, varaq ustida): uchta chizilgan bosh-siluet va bitta savol pufagi; javob topilganda pufak o'rnida yashil ✓.
  - Ishlatiladi: 0 (kichik varaq + sonlar chizig'i) · 1 (skelet o'zi yuradi) · 2 · 3 · 4 (javobdan keyin kichik teg) · 5 (o'quvchi varag'i, bitta ustun) · 6 (manba oynasi + joriy da'vo kartasi) · 7 (joriy da'vo; oxirida tuzatilgan pitch butun enga) · 8 (kichik varaq).
    `prefers-reduced-motion` da uchish, chizish va to'lqin yo'q — yakuniy holat birdan qo'yiladi. Telefon kengligida (393) manba oynasi varaq ostiga tushadi.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har holatda bitta faol element — accent halqa doim, yengil to'lqin 2–3 marta; tanlov guruhida har variantda yumshoq halqa. Yoqilgan pastki tugma ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → son manba oynasidan dalil tegiga uchadi · yangi qator ~1 s yashil yonadi · hisoblagich sanab o'sadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Raqamlaringiz pitchni qanday o'zgartiradi?** (42) — dars nomi (DE-205)
- Mentor: 11-Modul pitchingiz mahsulotingiz odamlarga yuborilishidan oldin yozilgan edi, 10-darsda esa foydalanuvchilarni sanadingiz. Sizningcha, pitchda nima o'zgaradi?
- Maket (chap; `PitchDalil` kichik): o'quvchining 11-Modul pitchi (`pm-m9d16-pitch` bo'lsa) — sarlavha «Pitchim · 11-Modul», to'rt bo'lak nomi va har birida birinchi gap (uzun bo'lsa «…»);
  varaq ostida kulrang chiziq — 10-darsdagi ikki son (`pm-m10d10-hisobot` bo'lsa): «Ro'yxatdan o'tgan: {royxat.soni} · Asosiy harakatni qilgan: {asosiy.soni}».
  Pitch yoki hisobot bo'lmasa — Mentor misoli (yorliq «Mentor misoli · Maydon Jamoa», A-7 gaplari; sonlar 38 · 19).
- Variantlar (radio, o'ng; bir uzunlikda):
  - Pitchga yangi sonlar qo'shiladi (31)
  - Ba'zi gaplar qayta yoziladi (27)
  - Ba'zi gaplar olib tashlanadi (28)
- Javob (uchalasida bir xil, maqtovsiz — J-026, P-016): Uchalasi ham uchraydi: Mentor misolida bitta pitchda uchalasi bor. Har gap bilan nima bo'lishini dalil hal qiladi. (114)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent halqa bilan qotadi; varaq ostidagi ikki son bir lahza ko'tarilib, varaq ustida suzadi, har bo'lak yonida kulrang «?» chiqadi —
  son qaysi gapga tushishi ochilmaydi (2-ekran kashfiyoti, P-036). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — uchalasi ham bugun ko'rinadi. Sinfdan so'rang: «11-Modul pitchingizda bugun eskirgan gap bormi?» Dars nomidagi «raqam» — matnda «son» (A-5).
✎ Hook — o'quvchi o'zi qilgan ish (11-Modulda pitch yozdi, 10-darsda sanadi) va o'z savoli (P-016). Uch variant — bitta pitchda uchala o'zgarish (tayanch 1.11: dalil qo'shiladi · qayta yoziladi · olib tashlanadi); payoff hech birini rad etmaydi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun pitchingizni sonlaringiz bilan tuzatasiz.** (47)
- Mentor: Roadmap'ingizni 11-Modulda ko'rgansiz — bugun pitch. Har biringiz bilan yakkama-yakka gaplashaman: pitchingizni birga ko'ramiz.
- Chap — «Dars oxirida — Mentor bilan yakkama-yakka: tuzatilgan pitch» (App.jsx osti so'zma-so'z, P-015) + vizual: `PitchDalil` skeleti o'zi yuradi (DE-200) — to'rt bo'lak kulrang chiziqlar bilan navbat bilan kiradi;
  har bo'lakdagi bitta chiziq ostiga uch katakli bo'sh uzuq teg chiziladi (U-041 — keyin to'ldiriladigan joy), oxirida varaq sarlavhasi yonida kulrang «?». Matn yo'q — 2, 3-ekran kashfiyotini ochmaydi.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Pitchingizdan tekshirsa bo'ladigan gaplarni topasiz · `da'vo`
  - 02 · Har biriga sonlaringizdan dalil qo'yasiz · `dalil`
  - 03 · Dalilsiz gapni qayta yozasiz yoki olib tashlaysiz · `tuzatilgan pitch`
  - 04 · Pitchingizni Mentor bilan yakkama-yakka ko'rasiz · `yakkama-yakka`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: Roadmap holati va risklar bugun ochilmaydi — 11-Modul 15-darsida ko'rilgan (tayanch 1.11). Pitchning Keyingi qadam bo'lagi o'sha rejadan va 10-darsdagi zaxira rejadan.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011: «tuzatasiz» — fe'l; «da'vo», «tuzatilgan pitch» — faqat kulrang teglarda, P-015). Mentorning birinchi gapi — tayanch 1.11 eslatmasi so'zma-so'z. 02 qatori dalilning uch narsasini ochmaydi (3-ekran kashfiyoti).

## 2 · Da'vo va dalil  ← QTushuncha (markaziy; ketma-ket 4 karta — SABOQ 9/13)
- Eyebrow: Tushuncha · da'vo va dalil
- Sarlavha: **Mentor pitchidagi qaysi gapning dalili bor?** (43)
- Mentor: Mentor misolida pitchga ilova chiqqandan keyingi gaplar qo'shilgan — har gapga mos tugmani bosing.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 zinapoya): **Mentor pitchidagi to'rt gapdan nechtasining dalili bor?** · 1 · 2 · 3 —
  tanlangach yopilmaydi: ixcham qator «Taxminingiz: N» natijagacha turadi; karta tugmalari shundan keyin yoqiladi.
- Vizual (SABOQ 21 — manba chapda, varaq o'ngda; ≤ 3 blok: manba oynasi · pitch varag'i · tugmalar qatori):
  - **chapda — manba oynasi** (bo'sh holat: kulrang skelet «Manba»);
  - **o'ngda — pitch varag'i** «Mentor misoli · Maydon Jamoa pitchi» (A-7): to'rt bo'lak, yechim va telefondagi harakat — kulrang, yorliq «jonli demoda ko'rinadi»; to'rt gap oddiy matnda, joriysi accent halqada;
  - **varaq ostida — ikki tugma:** «Dalil bor» · «Dalil yo'q».
- Kartalar (navbat bilan; gaplar va dalillar — tayanch 1.11 aynan):
  1. **Muammo · «O'yinchilar jamoaga odam yig'ishda qiynaladi.»** ✔ Dalil bor — manba oynasida «Intervyu yozuvlari · 11-Modul» jadvali (jamoa yig'ish, 5 o'yinchi) ochiladi, qator «oxirgi marta muammo bo'lgan · 4 / 5» yashil yonadi
     va gap ostiga uchib, kichik qator bo'ladi: «5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.»; ostida kulrang: 5 o'yinchi — kichik son: bu tanlov uchun dalil, isbot emas. (59)
  2. **Jonli demo · «Ilovani odamlar ishlatyapti.»** ✔ Dalil bor — manba oynasida «Database · Neon SQL Editor» natijasi: «ro'yxatdan o'tgan · 38» · «asosiy harakatni qilgan · 19» (yorliq «Mentor misolida»);
     ikki son gap ostiga uchadi: «38 kishi ro'yxatdan o'tdi, 19 tasi asosiy harakatni qildi.»; ostida kulrang: asosiy harakat — hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan. `QIzoh` (~3 s): Dalil pitchda yo'q edi, Database'da bor — pitchga qo'shildi. (60)
  3. **Jonli demo · «O'yinchilarga ilova yoqdi.»** ✔ Dalil yo'q — manba oynasi to'rt manbani navbat bilan ochadi (Database · sanoq sahifasi · Umami · intervyu yozuvlari), har birida kulrang ✕ «yoqdi — sanalmagan»; gap ostiga yorliq «dalil yo'q».
     So'ng Mentor qarori o'zi yuradi: eski gap ustidan chiziq tortiladi va xiralashadi, o'rniga sirg'alib kiradi: «Birinchi uch kunda ilovani ochgan 46 qurilmadan 17 tasi keyingi ikki kunda yana ochdi.»
     (manba oynasida Database ochiladi: «birinchi 3 kunda ochgan · 46» · «keyingi 2 kunda yana ochgan · 17», yorliq «Mentor misolida · qurilma»).
     `QIzoh`: Mentor «yoqdi» o'rniga odamlar nima qilganini Database sonlari bilan yozdi. (75)
  4. **Keyingi qadam · «Tez orada 50 ga yetamiz.»** ✔ Dalil yo'q — manba oynasida Database chizig'i «ro'yxatdan o'tgan: 38 / 50» (yorliq «Mentor misolida · bir hafta keyin»), chiziq oxirida kulrang «?»; gap ostiga yorliq «dalil yo'q».
     So'ng Mentor qarori: gap ustidan chiziq tortiladi va qatorga yig'iladi; o'rniga kiradi: «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi.»
     `QIzoh`: Mentor bu va'dani olib tashladi — o'rniga zaxira rejadagi ish. (62)
- **Harakat → Vizual o'zgarish:** tugmani bosish → to'g'ri bo'lsa manba oynasi o'sha manbani ochadi, son gapga uchadi (1, 2) yoki «dalil yo'q» tushib, Mentor qarori o'ynaydi (3, 4); joriy halqa keyingi gapga o'tadi.
  Xato → tugma silkinadi, joriy gap bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1-gap «Dalil yo'q»: 11-Modul intervyularini eslang: necha o'yinchi qiynalgan? (57)
  - 2-gap «Dalil yo'q»: 10-darsdagi hisobotni eslang: unda qaysi sonlar bor? (52)
  - 3-gap «Dalil bor»: Qaysi manbada «yoqdi» sanalgan? (31)
  - 4-gap «Dalil bor»: Bugungi son bor. «Tez orada» uchun qaysi son bor? (49)
- Natija (bitta blok, SABOQ 25; `tugadi` — tugmalar yopiladi, manba oynasi yig'iladi, varaq butun enga, vizual ⛶ ichida — q17/q18):
  taxmin qatori (`QTaxmin`, blokning birinchi qatori): «Taxminingiz: N · haqiqatda: 2» yoki «Taxminingiz to'g'ri chiqdi»; varaqda: ikki gap dalil qatori bilan · bitta qayta yozilgan (qaytganlar soni bilan) · bitta olib tashlangan va o'rnidagi ish.
- Xulosa: Pitchdagi tekshirsa bo'ladigan gap — da'vo. Da'voni ko'rsatadigan son yoki yozuv — dalil. (89) — atamalar shu yerda tug'iladi (T-011)
- Tugma (pastki): Avval belgilang → Gaplarni belgilang (N/4) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Bu gapni 11-Modul intervyusi yoki 10-darsdagi hisobot ko'rsatadimi?
- Keyingi bosiladigan joy: bashorat variantlari → ikki tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Claim Finder! (to'rt gap birinchi urinishda).
- O'qituvchi eslatmasi: Yechim va telefondagi harakatni zal jonli demoda o'zi ko'radi — bu ham dalil, faqat bugungi mashqqa kirmaydi: bugun zal ko'ra olmaydigan gaplar — odamlar, sonlar, natija (A-9). 3-gapning yangi shakli «yoqdi»ni isbotlamaydi — qurilmalar nima qilganini aytadi.
  1-gap: 5 o'yinchidan 4 tasi — «hamma o'yinchi qiynaladi» degani emas; pitchda gap dalili bilan birga aytiladi. 2-gap: «ishlatyapti» — keng so'z; zal «ishlatish nima?» desa, javob dalil ostidagi kulrang qatorda (hozir o'yinda yoki e'lon qilgan — 19 hisob; 38 — ro'yxatdan o'tganlar).
  4-gapda «50» — modul maqsadi: maqsadni maqsad deb aytish mumkin («Maqsadimiz — 50»), «yetamiz» esa dalilsiz va'da. Mentor uni olib tashladi — bu Mentorning tanlovi, yagona yo'l emas. Sinfga savol: «Pitchingizda «tez orada» yoki «yoqdi» kabi gap bormi?»
✎ Kartalar tartibi — 1.11 dagi to'rt da'vo tartibi. Mentor qarori (3, 4) baholanmaydi — o'zi o'ynaydi: qayta yozish ham, olib tashlash ham mumkin bo'lgan holatda o'quvchi tanlovi xato deb jazolanmaydi (S-008); o'quvchi o'zi 7-ekranda tanlaydi.

## 3 · Son, manba, qachon  ← QTushuncha (ketma-ket, 3 tanlov; P-055)
- Eyebrow: Tushuncha · dalil
- Sarlavha: **Zal sondan tashqari yana nimani so'raydi?** (41)
- Mentor: Mentor dalilini to'ldiramiz: har safar mos variantni bosing va zal savoliga qarang.
- Bashorat (ballsiz; S-015 — o'sish tartibida): **Dalilga sondan tashqari yana nechta narsa yoziladi?** · 0 · 1 · 2 — tanlangach ixcham qator natijagacha turadi; tanlovlar shundan keyin yoqiladi.
- Vizual (≤ 3 blok): **chapda** — manba oynasi · **o'ngda** — pitch varag'ining Jonli demo bo'lagi (katta): gap «Ilovani odamlar ishlatyapti.», ostida dalil tegi — **faqat bitta bo'sh katak** (keyingi kataklar zal savolidan keyin paydo bo'ladi — SABOQ 4);
  varaq ustida — zal (uch siluet, pufakda «?») · **pastda** — joriy tanlovlar. Tanlov chiplari (ixcham, bir qatorda; joriysi accent, o'tgani ✓): Son · Manba · Qachon
- Tanlovlar (Mentor misoli — tayanch 1.10, 1.11, 1.13):
  1. **Son** — ikki variant: «Ko'p odam ishlatyapti» · ✔ «38 kishi ro'yxatdan o'tdi, 19 tasi asosiy harakatni qildi».
     ✔ → katakka son yoziladi, ostida kulrang kichik qatorlar «shundan 11 tasi — sinfdosh» (Qaror-0 13) · «asosiy harakat — hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan»; zal pufagi: «Bu son qayerdan?»; tegda ikkinchi bo'sh katak paydo bo'ladi.
     ✕ → `QXato`: «Ko'p» — son emas: necha kishi? (31)
  2. **Manba** — uch tugma (aralash tartib): «Database» · «Umami» · «Intervyu yozuvlari». Har bosishda manba oynasi o'sha manbani ko'rsatadi (yorliq «Mentor misolida»):
     Database — «ro'yxatdan o'tgan · 38» · «asosiy harakatni qilgan · 19» · Umami — brauzer oynasida lending hisoboti «tashriflar · 74» · «Qo'shilmoqchiman · 41» · intervyu yozuvlari — «jamoa yig'ish · 5 o'yinchi · 11-Modul».
     ✔ Database → katakka «Database» yoziladi, oynadagi 38 tegdagi songa chiziq bilan ulanadi; `QIzoh`: Dalil qayerdan olingani — manba. (32); zal pufagi: «Qachon sanalgan?»; uchinchi bo'sh katak paydo bo'ladi.
     ✕ Umami → `QXato`: Umami lendingga tashrifni sanaydi — ilovadagi ishni emas. (57)
     ✕ Intervyu yozuvlari → `QXato`: Intervyular ilova chiqishidan oldin bo'lgan. (44)
  3. **Qachon** — manba oynasida Database'ning uch qatori (yorliq «ro'yxatdan o'tgan, jami · Mentor misolida»): «ishga tushirish kuni · 20» · «3 kun keyin · 27» · «bir hafta keyin · 38»; o'quvchi tegdagi son sanalgan qatorni bosadi.
     ✔ «bir hafta keyin» → katakka «ishga tushirilganidan bir hafta keyin» yoziladi; zal pufagi o'rnida yashil ✓; `QIzoh`: Qachon sanalgani ham yoziladi: kun yoki davr. (45)
     ✕ 20 yoki 27 qatori → `QXato`: Bu kunda boshqa son sanalgan — tegdagi son qachon edi? (54)
- **Harakat → Vizual o'zgarish:** to'g'ri tanlov → qiymat katakka uchib yoziladi (~1 s yashil), zal pufagi keyingi savolni beradi, tegda yangi bo'sh katak chiziladi; xato → variant silkinadi, katak bir lahza `err` fon, bitta `QXato`.
- Natija (`tugadi`: tanlovlar yo'qoladi; teg butun enga, uch katak to'la): taxmin qatori (`QTaxmin`): «Taxminingiz: N · haqiqatda: 2 — manba va qachon sanalgani» yoki «Taxminingiz to'g'ri chiqdi»;
  teg: «38 kishi ro'yxatdan o'tdi, 19 tasi asosiy harakatni qildi (11 tasi — sinfdosh) · Database · ishga tushirilganidan bir hafta keyin».
- Xulosa: Bu darsda har dalilda uch narsa bor: son yoki yozuv, manba va qachon olingani. (78)
- Tugma (pastki): Avval belgilang → Dalilni to'ldiring (N/3) → Davom etish
- Ipucha (40 s): Zal pufagidagi savolga qaysi variant javob beradi?
- Keyingi bosiladigan joy: bashorat → joriy tanlov variantlari (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Three Parts! (uch tanlov birinchi urinishda).
- O'qituvchi eslatmasi: Umami va Database sonlari — har xil o'lchov: tashrif va ro'yxatdan o'tgan kishi; ular bir-biridan ayirilmaydi (tayanch 1.13). «Qachon» — kun yoki davr: Mentor misolida «ishga tushirilganidan bir hafta keyin», o'quvchida — 10-darsdagi hisobot sanasi. Bu misolda dalil — son; intervyu va sinovdan olingan dalil yozuv ham bo'lishi mumkin («sinovchi tugmani topa olmadi») — 6-mashqda shunday maydon bor.
  Sinfdoshlar sanoqqa kiradi, lekin alohida aytiladi (10-dars). Sinfga savol: «Zal «Qayerdan?» va «Qachon?» deb so'raganda, sizda javob bormi?»
✎ Har tanlovning xato varianti dalilning bitta yo'qolishi mumkin bo'lgan narsasini ko'rsatadi: son yo'q («ko'p odam») · boshqa o'lchov (Umami tashrifi) · eski son (qachon sanalgani). Teg kataklari bittadan paydo bo'ladi — bashorat javobini oldindan ochmaydi.

## 4 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — uy vazifalari ilovasi, P-002)
- Eyebrow: Tekshiruv · dalil (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Uy vazifalari ilovangiz pitchida: «40 kishi ro'yxatdan o'tdi — Database'dan». Dalilga nima yetishmaydi?** (12 so'z)
  - A — Son: necha kishi ro'yxatdan o'tgani (35)
  - B — Manba: bu son aynan qayerdan olingani (37)
  - ✔ C — Qachon: bu son aynan qachon sanalgani (37)
  - D — Foiz: maqsadning necha foizi ekani (34)
- Kalit: **C** (index 2). To'rttalasi bir shaklda («Nom: …»); «aynan» B va C da; uzunliklar — «O'lchov» (11-FILTR dan keyin qayta sanaldi). Javobda savoldagi son yo'q (S-019).
- To'g'ri izohi: Qachon sanalgani yozilmagan — zal buni bilmaydi. (48)
- Xato izohlari (≤60):
  - A: Son gapda bor — zal yana nimani so'raydi? (41)
  - B: Manba yozilgan — qaysi biri yo'q? (33)
  - D: Foiz shart emas — dalilda qaysi uch narsa bor? (46)
  - (umumiy) Dalildagi uch narsadan qaysi biri yo'q? (39)
- Javob topilgach (QuestionScreen `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): dalil tegi «40 kishi · Database · ?» — «?» katagi (qachon) accent halqa bilan bir lahza yonadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Date Check! — birinchi urinishda to'g'ri.
- Izoh (MD): savol sonni o'qishni so'raydi, bashorat qildirmaydi (T-043). A, B — savolda bor narsa (o'quvchi o'qiydi); D — foiz ham son, lekin u dalilning uch narsasidan biri emas (S-004: «rost, lekin mos emas»). Ikkala trekka to'g'ri keladi.

## 5 · Da'volaringiz  ← QMustaqil (USTAXONA 1/3 — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish · da'vo
- Sarlavha: **Pitchingizdagi da'volarni belgilang.** (36)
- Mentor: Tekshirsa bo'ladigan gapni bosing; bugun aytmoqchi bo'lgan yangi gapingiz bo'lsa — qo'shing.
- **Tepada — ixcham chiziq «Da'volarim · n»:** belgilangan gaplar qisqa («…» bilan); bo'sh uzuq qatorlar yo'q (SABOQ 17).
- **Markazda — bitta katta karta: joriy bo'lak** (bo'lak chiplari Muammo · Jonli demo · Keyingi qadam — joriysi accent, o'tgani ✓; Yechim kartasiz — bo'lak tugmalari ustida kulrang qator «Yechim — zal jonli demoda o'zi ko'radi, bugun unga dalil qo'yilmaydi: {yechim}», A-9). Gaplar `pm-m9d16-pitch` dan (har maydon nuqta, «!», «?» bo'yicha gaplarga bo'linadi; bo'sh maydon ko'rinmaydi):
  - Muammo — `muammo.gap` (bosiladi) · `muammo.dalil` (kulrang, yorliq «dalil», bosilmaydi — 6-ekranda shu bo'lak da'vosiga dalil bo'lib taklif qilinadi)
  - Jonli demo — `demo.harakat` (kulrang, «jonli demoda ko'rinadi») · `demo.tuzatish` · `demo.son` (bosiladi)
  - Keyingi qadam — `keyingi` (bosiladi)
  - Har kartada pastda: «+ Yangi gap» (placeholder: `Bugun shu bo'lakda nima demoqchisiz?`) → gap kartaga oddiy gap bo'lib qo'shiladi; tekshirsa bo'ladigan gap bo'lsa, o'quvchi uni boshqa gaplar kabi bosib da'vo deb belgilaydi (har yangi gap o'zidan da'vo bo'lib qolmaydi — 11-FILTR 8).
  - O'ngda: «Keyingi bo'lak» → 3-kartada «Saqlash» (187).
- **Pitch topilmasa** (M-q5): kulrang qator «11-Modul pitchingiz topilmadi — har bo'lakdan asosiy gapni yozing.» + to'rt bo'lakka bittadan maydon (placeholder — bo'lak nomi; Yechim ham yoziladi, lekin belgilanmaydi); keyin belgilash yuqoridagidek.
- Tekshiruv (`QXato`, ≤60; «Saqlash» bosilganda; yumshoqlari ikkinchi «Saqlash» bilan o'tadi):
  - da'vo yo'q (bloklaydi): Kamida bitta da'voni belgilang. (31)
  - 6 dan ko'p (bloklaydi): Oltita yetadi — qolganini birlashtiring yoki olib tashlang. (59)
  - muammo gapi belgilanmagan (yumshoq): Muammo gapi ham da'vo bo'lishi mumkin — qarab chiqing. (54)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (bosilsa ochiladi; «qayerga qarash», tayyor javob emas): Uch joyga qarang: muammo gapi (kim qiynaladi), foydalanuvchilar haqidagi gap (nechta odam, nima qildi) va «tez orada», «hamma», «yoqdi» kabi so'zli gap.
  Yechim va asosiy harakatni zal jonli demoda o'zi ko'radi — bugun ularga dalil qo'yilmaydi. Web-trekda ham shunday — mahsulotingiz telefon brauzerida.
  Belgilamagan gapingiz ham tekshirsa bo'ladigan bo'lsa — u pitchda dalilsiz qoladi: uni belgilang, boshqa gap bilan birlashtiring yoki olib tashlang.
- **Harakat → Vizual o'zgarish:** gapni bosish → gap accent ostki chiziq oladi va qisqa nusxasi tepadagi «Da'volarim» chizig'iga uchadi (hisoblagich n sanab o'sadi); yana bosish → qaytib tushadi.
  «Keyingi bo'lak» → karta chapga suriladi, keyingisi kiradi. «Saqlash» → karta yopiladi; pitch varag'i butun enga — to'rt bo'lak, da'volar accent ostki chiziqda, har birida ✎.
- Xulosa (o'quvchi ma'lumotidan, P-046; 0 bo'lgan bo'lak tushib qoladi): Pitchingizda {n} ta da'vo: {a} tasi 11-Modul pitchidan, {b} tasi yangi. (≈60; namuna 4/2/2)
- Tugma (pastki): Da'volarni belgilang (n) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy bo'lakning birinchi bosiladigan gapi (accent, to'lqin) → «Keyingi bo'lak» → «Saqlash».
- Artefakt-strip (U-042): shu ekrandan — «Pitchim · da'volar n» (ixcham); 6, 7, 11-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Mentor rejimi: forma o'rniga Mentor misoli (`MENTOR_PITCH`, to'rt da'vo belgilangan, ochiq); o'quvchilar ro'yxatida «Da'volar n». Mentor statistikasi: «Da'volarni belgilaganlar».
- O'qituvchi eslatmasi: Ko'p o'quvchining 11-Modul pitchida foydalanuvchilar haqida gap yo'q — u ilova odamlarga yetmasdan yozilgan. «Bugun nima demoqchisiz?» deb so'rang: yangi gapni o'quvchi qo'shadi va tekshirsa bo'ladigan bo'lsa — o'zi belgilaydi.
  Mentor misolini «to'g'ri javob» qilib bermang — da'volar har kimning o'z pitchidan. 11-Modul pitchidagi Database soni (`demo.son`) namuna va tekshiruv yozuvlari bilan sanalgan edi — bugun u ham da'vo.

## 6 · Dalillar  ← QMustaqil (USTAXONA 2/3 — ketma-ket karta; SABOQ 9, 13, 29)
- Eyebrow: Mustaqil ish · dalil
- Sarlavha: **Har da'vongizga dalil qo'ying.** (30)
- Mentor: Dalilni 10-darsdagi hisobotingizdan tanlang; dalil topilmasa — «Dalil yo'q»ni bosing.
- Tepada (kulrang, bitta qator; faqat jonli darsda): Yakkama-yakkada da'vo va dalillaringizni Mentorga o'z ekraningizda ko'rsatasiz. (79)
- Tepada — ixcham chiziq «Dalillar · n / N» (da'vo qisqa «…» · ✓ yoki «dalil yo'q»).
- **Chapda — manba oynasi** (tanlangan dalil manbasi turi bo'yicha maket — Database · sanoq sahifasi · Umami · intervyu yozuvlari · sinov yozuvlari — ichida o'quvchining soni; bo'sh holatda kulrang «Manba») ·
  **o'ngda — bitta katta karta «Da'vo {n} / {N}»:** bo'lak yorlig'i · gap · ostida dalil tegi (uch uzuq katak: son yoki yozuv · manba · qachon).
- **Dalil tanlovlari** (karta ostida, navbat bilan chiqadi; `pm-m10d10-hisobot` dan — bor maydonlargina; har biri bitta qator):
  - «Ro'yxatdan o'tgan: {royxat.soni}, shundan sinfdosh {royxat.sinfdosh} · {royxat.manba} · {royxat.sana}»
  - «Asosiy harakatni qilgan: {asosiy.soni} · {asosiy.manba} · {asosiy.sana}»
  - «{bosh.nima}: {bosh.soni} · {bosh.manba} · {bosh.sana}»
  - «Qaytganlar foizi: {qaytgan.foiz}% — {qaytgan.birinchi} qurilmadan {qaytgan.keyingi} tasi ({qaytgan.davr}) · {qaytgan.manba} · {qaytgan.sana}» (`qaytgan` bo'lsa; ikki son va davr — tayanch 9.42 c, 10-FILTR 3)
  - faqat Muammo bo'lagidagi da'voda: «11-Modul pitchidagi dalil: {muammo.dalil}» → manba «intervyu yozuvlari», qachon «11-Modulda» (ikkalasi tahrirlanadi); matnda raqam bo'lmasa ham qabul qilinadi — bu yozuv (11-Modulda dalil «sanoq va harakat belgisi» edi)
  - **«O'zim yozaman»** → uch maydon: son yoki yozuv (placeholder `Nechta — yoki nimani ko'rdingiz?`) · manba chiplari Database · sanoq sahifasi · Umami · intervyu yozuvlari · sinov yozuvlari · qachon (placeholder `Qaysi kuni yoki qaysi davrda?`)
  - Hisobotdan kelgan tanlovlarda «qachon» — hisobotdagi sana; manba — hisobotda yozilgani («Database» yoki «sanoq sahifasi» — 10-FILTR 4).
  - **«Dalil yo'q»** (ikkinchi, chegarali tugma) · **«Dalilni qo'yish»** (o'ngda; teg to'lgach halqada)
- **Hisobot topilmasa** (M-q5): kulrang qator «10-darsdagi hisobot topilmadi — dalilni o'zingiz yozing.» — faqat «O'zim yozaman» va «Dalil yo'q».
- `pm-m10d10-hisobot.tekshiruv` = `'tuzatish'` bo'lsa (11-FILTR 17): 10-darsda «tuzatish» olgan qatorning tanlovi (`tuzatishQator`) sariq va bosilmaydi, yonida: 10-darsda bu son «tuzatish» olgan — avval uni tuzating. (55)
  Tuzatilgan sonni o'quvchi «O'zim yozaman» orqali kiritadi (son, manba va qachon bilan). Boshqa qatorlar ochiq. `tuzatishQator` yo'q bo'lsa (eski saqlash) — hamma hisobot tanlovlari ustida shu ogohlantirish, bosilganda bir marta so'raydi: «Shu sonni tuzatdingizmi?»
- Tekshiruv (`QXato`, ≤60; teg ostida; yumshoqlari ikkinchi bosish bilan o'tadi):
  - birinchi maydon bo'sh (bloklaydi): Dalilni yozing: son yoki nimani ko'rganingiz. (45)
  - manba Database, sanoq sahifasi yoki Umami, matnda raqam yo'q (bloklaydi): Bu manba sanaydi — sonni yozing: nechta? (40)
  - manba tanlanmagan (bloklaydi): Dalil qayerdan olingan — manbani tanlang. (41)
  - «qachon» bo'sh (bloklaydi): Qachon olingan — kunini yoki davrini yozing. (44)
  - manba intervyu yoki sinov yozuvlari, matnda raqam yo'q — o'tadi (yozuv-dalil); ostida kulrang: Sanagan bo'lsangiz — sonini ham yozing.
  - manba Umami, gapda «ishlat», «ro'yxat», «qo'shil», «e'lon» (yumshoq): Umami lendingga tashrifni sanaydi — ilovadagi ishni emas. (57)
  - bir dalil ikkinchi da'voda ham (yumshoq): Bu dalil boshqa da'voda ham bor — ikkalasiga mosmi? (51)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Dalilni qo'yish»ni bosing. (55)
- Yordam: Dalil 10-darsdagi hisobotingizda: ro'yxatdan o'tganlar, asosiy harakatni qilganlar, bosh raqam, qaytganlar foizi. Muammo uchun — 11-Modul intervyu va sinov yozuvlari: son ham, kuzatgan narsangiz ham bo'ladi. Dalil topilmasa, uni o'ylab topmang — «Dalil yo'q»ni bosing.
- **Harakat → Vizual o'zgarish:** dalil tanlovi → manba oynasida o'sha manba turi ochiladi va o'quvchining soni yonadi; son yoki yozuv, manba va qachon teg kataklariga navbat bilan uchib yoziladi (~1 s yashil).
  «Dalilni qo'yish» → karta kichrayib tepadagi chiziqqa uchadi (✓), keyingi da'vo kiradi. «Dalil yo'q» → tegga «dalil yo'q» tushadi, karta chiziqqa uchadi.
  N/N da karta yopiladi: pitch varag'i butun enga — har da'vo ostida yashil teg yoki «dalil yo'q»; har tegda ✎.
- Xulosa (o'quvchi ma'lumotidan, P-046): {a} ta da'voda dalil bor, {b} tasida yo'q. (≈40) · hammasida bo'lsa: Hamma da'volaringizda dalil bor — manbasi va qachon olingani bilan. (67)
- Tugma (pastki): Dalil qo'ying (n/N) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: birinchi dalil tanlovi (accent, to'lqin) → «Dalilni qo'yish» → keyingi da'vo → «Davom etish».
- Mentor rejimi: o'quvchilar ro'yxatida «Dalil n/N» (saqlash signali — matn emas); N/N bo'lgan qator yashil — Mentor shu o'quvchini yakkama-yakkaga chaqiradi. Mentor statistikasi: «Dalil qo'yganlar».
- O'qituvchi eslatmasi: **Yakkama-yakka shu ekrandan keyin boshlanadi** (A-8): o'quvchi ekranini ko'rsatadi; har o'quvchida bitta eng muhim da'vo, uning dalili va bitta dalilsiz gap — ≈ 2–3 daqiqa.
  Uch savol: «Bu son qayerdan va nimani sanaydi?» (ro'yxatdan o'tganlar soni bo'lsa — «sinfdoshlar alohida aytilganmi?») · «Bu dalil aynan shu gapni ko'rsatadimi?» · «Qaysi da'vo dalilsiz — qayta yozasizmi yoki olib tashlaysizmi?».
  Manba va gap mosligini dars tekshirmaydi (faqat Umami uchun yumshoq ogohlantirish bor) — buni siz ikkinchi savol bilan ko'rasiz: Umami tashrifi «ilovani ishlatyapti» da'vosiga qo'yilgan bo'lsa — «bu son nimani sanaydi?».
  «Dalil yo'q» — xato emas: sonni o'ylab topishdan yaxshiroq. Namuna va tekshiruv akkauntlari sanoqqa kirmagan bo'lishi kerak (10-dars).

## 7 · Tuzatilgan pitch  ← QMustaqil (USTAXONA 3/3 — ketma-ket karta; SABOQ 9, 29)
- Eyebrow: Mustaqil ish · tuzatilgan pitch
- Sarlavha: **Dalilsiz da'volarni qayta yozing yoki olib tashlang.** (52)
- Mentor: Har dalilsiz da'voga bittasini tanlang, oxirida pitchingizni saqlang.
- Tepada — ixcham chiziq «Dalilsiz · n / N» (gap qisqa «…» · «qayta yozildi» yoki «olib tashlandi»).
- **Markazda — bitta katta karta:** bo'lak yorlig'i · gap · yorliq «dalil yo'q» · ikki tugma **«Qayta yozish»** · **«Olib tashlash»**.
  - **Qayta yozish** → gap tahrirlanadigan maydonga aylanadi (eski matn bilan); ostida 6-ekrandagi dalil tanlovlari va «O'zim yozaman»; «Saqlash» (o'ngda).
  - **Olib tashlash** → gap ustidan chiziq tortiladi (dalil shart emas). Bo'lak Keyingi qadam bo'lsa va unda boshqa gap qolmasa — «O'rniga keyingi qadam» maydoni: tanlov «Zaxira rejadagi ish: {zaxira.ish}» (`pm-m10d10-hisobot.zaxira` bo'lsa) yoki erkin qator (placeholder `Keyingi ishingiz`).
  - Dalilsiz da'vo yo'q bo'lsa — karta o'rnida kulrang qator: Dalilsiz da'vo yo'q — pitchingizni ko'rib, saqlang. (51)
- **Yakuniy karta «Pitchim»** (hammasi hal bo'lgach; butun enga): to'rt bo'lak — qolgan va qayta yozilgan gaplar, har da'vo ostida ixcham yashil teg (son yoki yozuv · manba · qachon); olib tashlanganlar ko'rinmaydi; har gapda ✎.
  **Ko'rik (11-FILTR 9):** da'vo deb belgilanmagan gaplar ham shu kartada turadi (dalil qatorisiz). Karta tepasida bitta qator: Belgilanmagan gaplarni ko'zdan kechiring: tekshirsa bo'ladigani qolmadimi? (74)
  Qolgan bo'lsa — ✎: uni da'vo deb belgilab dalil qo'yadi, boshqa gap bilan birlashtiradi yoki olib tashlaydi. «Saqlash»dan oldin belgi «Ko'rib chiqdim» bosiladi (bloklaydi: Avval belgilanmagan gaplarni ko'rib chiqing. (44)).
  Keyingi qadam bo'lagi ostida (faqat `zaxira` bo'lsa va bo'lakdagi gap 11-Modul pitchidan o'zgarmagan bo'lsa): kulrang qator «Keyingi qadam 11-Modulda yozilgan — kerak bo'lsa, zaxira rejadagi ishni qo'ying.» + tanlov «Zaxira rejadagi ish: {zaxira.ish}» (ixtiyoriy; TAYANCHGA SAVOL 14).
  «Saqlash» (o'ngda) → `pm-m10d11-pitch`; saqlangandan keyin tugma «Yangilash» (✎ dan keyin qayta saqlash).
- Tekshiruv (`QXato`, ≤60):
  - qayta yozilgan gapga dalil qo'yilmagan (bloklaydi): Qayta yozilgan gapga dalil qo'ying. (35)
  - qayta yozilgan gap o'zgarmagan (yumshoq): Gap o'zgarmadi — dalil ko'rsatadigan narsani yozing. (52)
  - dalil son, yangi gapda raqam yo'q (yumshoq; bu faqat eslatma — son gapda borligi dalil gapga mosligini bildirmaydi, mosligini Mentor yakkama-yakkada so'raydi — 11-FILTR 16): Yangi gapda dalildagi son aytilsin. (35)
  - Keyingi qadam bo'lagi bo'sh qoldi (bloklaydi): Keyingi qadam bo'sh qoldi — bitta ishingizni yozing. (52)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam: Qayta yozish — dalil topiladigan gap uchun: «yoqdi» o'rniga odamlar nima qilganini yozing. Olib tashlash — dalil topilmaydigan gap uchun. «Tez orada …» kabi va'dani olib tashlash ham, maqsad deb qayta yozish ham mumkin: «Maqsadimiz — …».
  Mentor misolida: «O'yinchilarga ilova yoqdi» o'rniga «Birinchi uch kunda ilovani ochgan 46 qurilmadan 17 tasi keyingi ikki kunda yana ochdi.»
- Pastda (kulrang, bitta qator; faqat jonli darsda): Mentor chaqirganda pitchingizni ko'rsating; o'zgarsa — ✎ bilan o'zgartiring. (76)
- **Harakat → Vizual o'zgarish:** «Qayta yozish» → gap maydonga aylanadi, dalil tanlangach tegga son yoki yozuv, manba va qachon yoziladi; «Saqlash» → eski gap ustidan chiziq, yangi gap sirg'alib kiradi va karta chiziqqa uchadi.
  «Olib tashlash» → gap chizilib, qatorga yig'iladi; kerak bo'lsa o'rniga ish yoziladi. N/N da yakuniy karta butun enga.
  Yakuniy «Saqlash» → varaq sarlavhasi «Pitchim» → **«Tuzatilgan pitch»** (harflar almashadi), varaq bir marta yengil yonadi; `QIzoh`: Har da'vosida dalil bor yoki dalilsiz da'vosi olib tashlangan pitch — tuzatilgan pitch. (87)
- Xulosa (o'quvchi ma'lumotidan, P-046; 0 bo'lgan bo'lak tushib qoladi): Tuzatilgan pitchingizda {a} ta da'vo dalil bilan qoldi, {b} tasi qayta yozildi, {c} tasi olib tashlandi. (≈100; namuna 2/1/1)
- Tugma (pastki): Har da'voni hal qiling (n/N) → Tuzatilgan pitchni saqlang → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: ikki tugma (navbatma-navbat to'lqin) → maydon yoki dalil tanlovi → «Saqlash» → yakuniy «Saqlash» → «Davom etish».
- Nishon: Pitch Fixed! (tuzatilgan pitch saqlanganda — bonus, ish bajarilgan; P-048).
- Mentor rejimi: o'quvchi varag'ida da'vo · dalil · qaror (qoldi · qayta yozildi · olib tashlandi). Mentor statistikasi: «Tuzatilgan pitchni saqlaganlar».
- O'qituvchi eslatmasi: Olib tashlash — mag'lubiyat emas: dalilsiz gap zal savolida qoqiladi. Qayta yozilgan gap eski da'voni isbotlamaydi — odamlar nima qilganini aytadi. Kelajak soni maqsad bo'lsa — maqsad deb aytiladi; «bo'ladi», «yetamiz» degan va'da esa dalil talab qiladi. Yakkama-yakkadan keyin o'quvchi ✎ bilan o'zgartiradi va «Yangilash»ni bosadi.
  Tez tugatgan o'quvchi Mentor chaqirguncha tuzatilgan pitchni sherigiga o'qib beradi; sherik bitta da'voni tanlab so'raydi: «Bu son qayerdan?»

## 8 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Pitchingizdan «Bir oyda 200 kishi bo'ladi» va'dasini olib tashladingiz. O'rniga nima aytasiz?** (12 so'z)
  - A — Shu va'daning kichikroq sonli shaklini (38)
  - ✔ B — Keyingi qiladigan bitta ishingizni (34)
  - C — Ilovangizdagi eng chiroyli ekranni (34)
  - D — Zal beradigan savolning javobini (32)
- Kalit: **B** (index 1). To'rttalasi bir shaklda («… -ni»); javobda savoldagi son yo'q (S-019); uzunliklar — «O'lchov».
- To'g'ri izohi: Keyingi qadam bo'lagida qiladigan ishingiz aytiladi. (52)
- Xato izohlari (≤60):
  - A: Son kichraydi, lekin bu hali ham dalilsiz va'da. (48)
  - C: Ekranni zal jonli demoda ko'radi — bu bo'lak nima haqida? (57)
  - D: Savol hali berilmagan — bo'lakda nima aytiladi? (47)
  - (umumiy) Keyingi qadam bo'lagi nima haqida — eslang. (43)
- Javob topilgach (kichik, savol ostida): kitob ilovasi varag'i — Keyingi qadam bo'lagida gap ustidan chiziq, o'rnida kulrang «keyingi ish: …».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol qayta yozildi (11-FILTR 10, 11). Avvalgisi «Dalil yo'q. Nima qilasiz?» edi va «olib tashlash» yagona to'g'ri javob bo'lgan — lekin dars o'zi «maqsadni maqsad deb aytish va'da emas» deydi: «Maqsadimiz — bir oyda 200 kishi» ham himoyalanadi.
  Endi savol olib tashlash qarorini berilgan deb oladi va o'rniga nima aytilishini so'raydi — bitta himoyalanadigan javob (S-008). A — kichikroq va'da ham va'da · C, D — Keyingi qadam bo'lagining ishi emas. Kitob ilovasi — javobdan keyingi vizualda (P-002).
  Ikkala trekka to'g'ri keladi. Kalit ibora 4-ekran bilan takrorlanmaydi.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 2 savol (4, 8); 5–7-ekranlar «Saqlash» — mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 4 — «1 — Dalilda nima yo'q» · 8 — «Yakuniy — Va'da o'rniga»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab — P-046, tayanch 7.1; belgi ✓ va nishon — faqat birinchi holatda; sarlavha o'quvchi qilgan ishni aytadi):
  - Sarlavha · tuzatilgan pitch saqlangan (7-ekrandagi ko'rik belgisi bilan — 11-FILTR 9, 28): **Tuzatilgan pitchingiz tayyor: har da'voda dalil bor.** (52)
  - Sarlavha · dalillar qo'yilgan, 7-ekran saqlanmagan: **Dalillar qo'yildi — dalilsiz da'volar qoldi.** (44)
  - Sarlavha · da'volar belgilangan, dalillar qo'yilmagan: **Da'volar topildi — dalil qo'yish qoldi.** (39)
  - Sarlavha · da'volar belgilanmagan: **Pitch ochildi — da'volarni uyda belgilang.** (42)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- **[07.10: yakunda KO'RSATILMAYDI — SABOQ E 50 (foydalanuvchi tasdig'i); fikr darsning ichki o'qi bo'lib qoladi]** Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Sonlar pitchni o'zgartiradi: dalili bor gap qoladi, dalilsiz gap qayta yoziladi yoki olib tashlanadi. (101)
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Da'vo — pitchdagi tekshirsa bo'ladigan gap.
  - Dalil — da'voni ko'rsatadigan son yoki yozuv; bu darsda yonida manbasi va qachon olingani turadi.
  - Manba dalil qayerdan olinganini aytadi; sanaydigan manbadan son olinadi.
  - Sinfdoshlar sanoqqa kiradi, lekin dalilda alohida aytiladi.
  - Dalilsiz va'da olib tashlanadi yoki maqsad deb qayta yoziladi; Keyingi qadam bo'lagida qiladigan ishingiz aytiladi.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: o'zingiz · Nechta: 1 tuzatilgan pitch · Muddat: keyingi darsgacha
  - ① Yakkama-yakkada Mentor so'ragan da'voni tuzating: dalil qo'ying, qayta yozing yoki olib tashlang.
  - ② Ro'yxatdan o'tganlar va asosiy harakatni qilganlarni Neon'da 10-darsdagi SQL bilan qayta sanang va bugungi sana bilan yozib qo'ying.
  - ③ Darsda qolgan qismni tugating: {holatga qarab — dalilsiz da'volarni qayta yozing yoki olib tashlang · da'volaringizga dalil qo'ying · pitchingizdagi da'volarni belgilang}. Hammasi tugagan bo'lsa ③ ko'rinmaydi.
  - Karta ostida (bitta kulrang qator): Neon'ga kira olmasangiz — sonni o'ylab topmang: 10-darsdagi hisobot sonini sanasi bilan qoldiring.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Raqamlaringiz zalni ishontiradimi?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Kim bilan» — HwCard yorlig'i (15, 16-darslar bilan bir). Uyga vazifada 12-dars, grafik va Demo Day aytilmaydi (T-038); ② dagi SQL — 10-darsniki (tayanch 9.5, 9.23: ikki son, `namuna = false`), yangi kod o'rgatilmaydi.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Claim Finder!** (2-ekran, to'rt gap birinchi urinishda) — Mentor pitchidagi to'rt gapning dalili bor-yo'qligini birinchi urinishda topdingiz
- **Three Parts!** (3-ekran, uch tanlov birinchi urinishda) — Mentor daliliga son, manba va qachon sanalganini birinchi urinishda qo'ydingiz
- **Date Check!** (4-ekran, 1-savol birinchi urinishda) — Dalilda nima yetishmasligini birinchi urinishda topdingiz
- **Pitch Fixed!** (7-ekran, tuzatilgan pitch saqlanganda — bonus) — Dalilsiz da'volarni hal qilib, tuzatilgan pitchni saqladingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Pitch Fixed, S-034: ish qilingan ekranda). Yakuniy savol nishonsiz. 5, 6-ekranlar nishonsiz (saqlash — mentorga signal).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **4 · Dalilda uch narsa** — 1 Bu darsda har dalilda uch narsa bor: son yoki yozuv, manba va qachon olingani. · 2 Manba — dalil qayerdan olingani. · 3 Qachon sanalgani ham yoziladi: vaqt o'tib son o'zgaradi.
  — Sinfga savol: Pitchingizdagi eng katta son qachon sanalgan?
- **8 · Dalilsiz va'da** — 1 Dalilsiz da'vo qayta yoziladi yoki olib tashlanadi. · 2 Kelajakdagi sonni hech qaysi manba ko'rsatmaydi: va'da olib tashlanadi yoki maqsad deb qayta yoziladi. · 3 O'rniga Keyingi qadam bo'lagida qiladigan ishingiz aytiladi.
  — Sinfga savol: Pitchingizda «tez orada» degan gap bormi?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Da'vo nima? | Pitchdagi tekshirsa bo'ladigan gap | Mentor misolida: «O'yinchilar jamoaga odam yig'ishda qiynaladi» |
| Dalil nima? | Da'voni ko'rsatadigan son yoki yozuv | Bu darsda yonida: manbasi va qachon olingani |
| Manba nima? | Dalil qayerdan olingani | Database, sanoq sahifasi, Umami, intervyu yoki sinov yozuvlari |
| Dalilda nega qachon sanalgani yoziladi? | Son vaqt o'tib o'zgaradi — zal qaysi kungi son ekanini bilishi uchun | Mentor misolida ishga tushirish kuni 20 edi, bir hafta keyin — 38 |
| «Ko'p odam ishlatyapti» degan gap dalil bo'ladimi? | Yo'q: unda aniq son yo'q | Necha kishi — shuni yozing |
| Umami lendingda nimani sanaydi? | Tashrif va tugma bosilishini | Ilovadagi ro'yxatdan o'tganlar — Database'da |
| Dalilsiz da'vo bilan nima qilinadi? | Qayta yoziladi yoki olib tashlanadi | Qayta yozilgan gap dalil ko'rsatadigan narsani aytadi |
| Mentor «O'yinchilarga ilova yoqdi» gapini qanday qayta yozdi? | «Birinchi uch kunda ilovani ochgan 46 qurilmadan 17 tasi keyingi ikki kunda yana ochdi» | Bu gap «yoqdi»ni isbotlamaydi — qurilmalar nima qilganini aytadi |
| «Tez orada 50 ga yetamiz» gapi bilan nima bo'ldi? | Olib tashlandi: bu dalilsiz va'da | O'rniga Keyingi qadam bo'lagida — zaxira rejadagi ish |
| Sinfdoshlar dalilda qanday aytiladi? | Sanaladi, lekin alohida aytiladi | Mentor misolida: 38 kishi, 11 tasi — sinfdosh |
| Tuzatilgan pitch nima? | Har da'vosida dalil bor yoki dalilsiz da'vosi olib tashlangan pitch | Bu — qoralama: uni yana tuzatishingiz mumkin |
| Yakkama-yakkada Mentor nimani ko'radi? | Eng muhim da'vongiz, uning dalili va bitta qaroringizni | Mentor «Bu dalil aynan shu gapni ko'rsatadimi?» deb so'raydi |
- §145: har javobdagi so'z darsda bor (da'vo, dalil — 2 · manba, qachon sanalgani, «ko'p odam», Umami, sinfdosh — 3 · qayta yozish, olib tashlash, «yoqdi», «tez orada» — 2, 7 · tuzatilgan pitch — 7 · yakkama-yakka — 1, 6).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md11/olchov.py` (pastda «O'lchov»).
1. Pitchdagi qaysi gap da'vo? (2, 5)
   - ✔ A — 30 kishi ilovada ro'yxatdan o'tdi (33)
   - B — Hozir telefonda ko'rsatib beraman (33)
   - C — Savollaringiz bo'lsa, bemalol bering (36)
   - D — Tinglaganingiz uchun katta rahmat (33)
2. Dalil nima? (2)
   - A — Pitchdagi eng ishonchli ko'ringan gap (37)
   - ✔ B — Da'voni ko'rsatadigan son yoki yozuv (36)
   - C — Zal pitchdan keyin beradigan savol (34)
   - D — Pitch oxiridagi keyingi qadam gapi (34)
3. Dalildagi manba nimani aytadi? (3)
   - A — Son qanchalik katta ekanini (27)
   - B — Son qaysi kuni sanalganini (26)
   - ✔ C — Bu son qayerdan olinganini (26)
   - D — Sonni kim aytib berganini (25)
4. Mentor misolida «Ilovani odamlar ishlatyapti» dalili qayerdan? (2, 3)
   - A — Umami: lendingga kirganlar soni (31)
   - B — Intervyu yozuvlari, 11-Modul (28)
   - C — Sinfdoshlarning og'zaki gapi (28)
   - ✔ D — Database: ro'yxatdan o'tganlar (30)
5. Umami lendingda nimani sanaydi? (3)
   - ✔ A — Tashrif va tugma bosilishini (28)
   - B — Ro'yxatdan o'tgan akkauntlarni (30)
   - C — O'yinga qo'shilgan odamlarni (28)
   - D — Ilovani ochgan qurilmalarni (27)
6. Ro'yxatdan o'tganlar soni bir haftada o'sdi. Pitchda qaysi sonni aytasiz? (3)
   - A — Birinchi kungi sonni — u aniqroq (32)
   - ✔ B — Eng yangi sonni — sanasi bilan (30)
   - C — Ikki sonning o'rtachasini aytasiz (33)
   - D — Ikki sonni qo'shib, jamini aytasiz (34)
7. Mentor misolida «O'yinchilarga ilova yoqdi» bilan nima qilindi? (2)
   - A — O'zgarishsiz pitchda qoldirildi (31)
   - B — Keyingi qadam bo'lagiga ko'chdi (31)
   - ✔ C — Database soni bilan qayta yozildi (33)
   - D — Sinfdoshlardan so'rab tasdiqlandi (33)
8. Mentor «Tez orada 50 ga yetamiz»ni nega olib tashladi? (2)
   - A — Maqsad sinf uchun juda katta edi (32)
   - B — Zal kelajak haqida gap eshitmaydi (33)
   - C — Sinfdoshlar alohida aytilmagan edi (34)
   - ✔ D — Dalili yo'q edi — bu faqat va'da (32)
9. Sinfdoshlar sanoqqa kirsa, dalilda qanday aytiladi? (3)
   - ✔ A — Alohida: nechtasi sinfdosh ekani (32)
   - B — Aytilmaydi: ular ham foydalanuvchi (34)
   - C — Sanoqdan butunlay olib tashlanadi (33)
   - D — Faqat sinfdoshlar soni aytiladi (31)
10. Qayta yozilgan da'voda nima bo'ladi? (2, 7)
    - A — Ko'proq chiroyli sifat so'zlari (31)
    - ✔ B — Dalildagi son — gapning o'zida (30)
    - C — Zal savoliga oldindan javob (27)
    - D — Avvalgi gapning qisqa shakli (28)
11. Intervyu yozuvlari qaysi da'voga dalil bo'ladi? (2, 6)
    - A — Ilovani nechta odam ishlatishiga (32)
    - B — Lendingga nechta odam kirganiga (31)
    - ✔ C — Odamlar muammodan qiynalganiga (30)
    - D — Bu hafta nechta o'yin to'lganiga (32)
12. Yakkama-yakkada Mentor bilan nimani ko'rasiz? (6, 7)
    - A — Arena natijangiz va ballaringizni (33)
    - B — Kodingizning har bir qatorini (29)
    - C — Lending sahifangizning dizaynini (32)
    - ✔ D — Da'vo, dalil va qarorlaringizni (31)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 4-ekran (qachon sanalgani yetishmaydi) ↔ arena 3 (manba nima), 6 (eng yangi son sanasi bilan) · 8-ekran (dalilsiz va'da — nima qilasiz) ↔ arena 8 (Mentor nega olib tashladi — sabab).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas: 4, 5 — boshqa manba, boshqa o'lchov (3-ekran) · 6 — sonlarni qo'shish yoki o'rtacha olish (eski son — sana qoidasi) · 9 — sinfdoshlarni yashirish yoki chiqarish (Qaror-0 13) · 11 — intervyular ilovadan oldin bo'lgan.
  Arena 6 savolida son yo'q — javobdagi «eng yangi son» savolni takrorlamaydi (S-019). Arena 1 dagi «30 kishi» — mashq uchun (P-002).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — da'vo · dalil · son · manba · qachon · pitch · zal · bo'lak · Database · Umami · Maydon Jamoa · uyga vazifa banneri — pitch · dalil · son. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/10-Modull/PmPitchReviewLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m10d11-v1` (07.10: PM darslar pilot 1 bilan bir — `pm-m10dN-v1`), `lessonTitle` — «Raqamlaringiz pitchni qanday o'zgartiradi?».
2. `SCREEN_META` 12: hook · plan · concept · concept · test · practice · practice · practice · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 4: 2, 8: 1 }; `davolar: -1`, `dalilUch: -1` (2, 3-ekran — ballsiz, nishon bilan);
   5–7 `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 4, 8, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s3 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + `QTaxmin`, yopilmaydigan ixcham qator) · s4/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s5/s6/s7 `QMustaqil` · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
3. **`PitchDalil`** — bitta vizual (180; qolipda yo'q, yangi): manba oynasi (rejimlar `bosh` · `database` · `sanoq` · `umami` · `intervyu` · `sinov` · `vaqt` (20 · 27 · 38 qatorlari) · `chiziq` (38 / 50); chizilgan, logotipsiz) + pitch varag'i
   (to'rt bo'lak; gap holatlari `oddiy` · `demo` · `joriy` · `davo` · `dalil` · `yoq` · `qayta` · `olindi`; dalil tegi — 1→3 katak) + `zal` (3 siluet, pufak) · sarlavhalar «Mentor misoli · Maydon Jamoa pitchi» / «Pitchim» / «Tuzatilgan pitch» ·
   ko'rinishlar `kichik` · `toliq`. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: pd-gap pd-teg pd-manba`). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. 393 da manba oynasi varaq ostida.
4. **`MENTOR_PITCH`** — bitta manba (A-7 aynan): `bolaklar` (to'rt bo'lak, har birida gaplar va `tur`: `davo` | `demo`) · `davolar` 4 × `{ id, bolak, gap, dalil, qaror, yangiGap }` (1.11 aynan; qaror: `qoldi` · `qoldi` · `qayta-yozildi` · `olib-tashlandi`) ·
   **`MENTOR_MANBA`**: intervyu qatori (4 / 5) · Database (38 · 11 sinfdosh · 19; qaytganlar 46 · 17 — 3-da'voning yangi gapi uchun) · sanoq sahifasi (61 · 38 · 18 · 14) · Umami (74 · 41) · vaqt (20 · 27 · 38) · zaxira ishi (gap matni — A-7). Mentor rejimi, s0 (zaxira), s2, s3 shundan o'qiydi.
5. **s2** — `QBashorat` (1 · 2 · 3) → 4 karta, ikki tugma («Dalil bor» / «Dalil yo'q»), kalit `[bor, bor, yoq, yoq]`; manba oynasi animatsiyalari (1 — intervyu qatori, 2 — Database, 3 — to'rt manba navbat bilan ✕, keyin Database qaytganlar qatorlari 46 · 17; 4 — chiziq 38 / 50);
   3, 4-kartada «Dalil yo'q» dan keyin Mentor qarori o'zi o'ynaydi (baholanmaydi); `QIzoh` 2, 3, 4-kartada; `QXato` 4 ta; `QTaxmin` (haqiqatda 2); 40 s ipucha; nishon `claimFinder`.
6. **s3** — `QBashorat` (0 · 1 · 2) → 3 tanlov (Son: 2 variant · Manba: 3 tugma · Qachon: manba oynasidagi 3 qator); teg kataklari bittadan paydo bo'ladi; zal pufagi «?» → «Bu son qayerdan?» → «Qachon sanalgan?» → ✓; `QIzoh` (manba, qachon); `QTaxmin`; nishon `threeParts`.
7. **s5** — o'qiydi `pm-m9d16-pitch` (`muammo.gap`, `muammo.dalil`, `yechim`, `demo.harakat`, `demo.tuzatish`, `demo.son`, `keyingi`); gaplarga bo'lish (`. ` `! ` `? ` bo'yicha; «8 / 10» kabi sonlar bo'linmaydi); kulrang qatorlar (`muammo.dalil` — «dalil», `demo.harakat` — «jonli demoda ko'rinadi»); kartalar 3 ta (Muammo · Jonli demo · Keyingi qadam), `yechim` — bo'lak tugmalari ustidagi kulrang qator;
   «+ Yangi gap» (oddiy gap bo'lib qo'shiladi, o'zidan belgilanmaydi — 11-FILTR 8); da'volar 1–6; tekshiruvlar (bo'sh, 6 dan ko'p — bloklaydi; muammo gapi belgilanmagan — yumshoq); pitch yo'q — to'rt maydon. Ichki holat — dars progressida (`davolar` ro'yxati, `id` `d1`…`d6`, tartib o'zgarmaydi).
8. **s6** — o'qiydi `pm-m10d10-hisobot` (`royxat`, `asosiy`, `bosh`, `qaytgan` — ikki soni va davri bilan, `tekshiruv`, `tuzatishQator`) va `pm-m9d16-pitch.muammo.dalil`; tanlovlar (bor maydonlargina; `tuzatishQator` dagi qator — sariq, bosilmaydi) ·
   «O'zim yozaman» (birinchi maydon — son yoki yozuv; manba — 5 chip; qachon — matn) · «Dalil yo'q»; dalil saqlanishi: sanaydigan manba (Database · sanoq sahifasi · Umami) yoki matnda raqam bor → `son`, aks holda → `yozuv`;
   tekshiruvlar (bo'sh · sanaydigan manbada raqam `/\d/` yo'q · manba · qachon — bloklaydi; intervyu va sinov yozuvlarida raqam shart emas; Umami + so'zlar, takror dalil — yumshoq) — **PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi**; manba oynasi o'quvchi sonini manba turi maketida ko'rsatadi; `tekshiruv === 'tuzatish'` qatori.
9. **s7** — dalilsiz da'volar ketma-ket; «Qayta yozish» (maydon + dalil tanlovi; dalilsiz — bloklaydi, o'zgarmagan yoki sonli dalilda raqamsiz — yumshoq) · «Olib tashlash» (Keyingi qadam bo'sh qolsa — almashtirish: `zaxira.ish` yoki erkin qator, bo'sh — bloklaydi);
   yakuniy «Pitchim» kartasi (✎; tegsiz gaplar ko'rigi — «Ko'rib chiqdim» belgisi bosilmaguncha «Saqlash» bloklanadi, 11-FILTR 9; ixtiyoriy zaxira qatori) → «Saqlash» → `localStorage` `pm-m10d11-pitch` =
   `{ davolar: [{ id, bolak: 'muammo' | 'yechim' | 'demo' | 'keyingi', gap, dalil: { son: string | null, yozuv: string | null, manba, qachon } | null, qaror: 'qoldi' | 'qayta-yozildi' | 'olib-tashlandi', yangiGap: string | null }], bolaklar: { muammo, yechim, demo, keyingi }, savedAt }`
   (`gap` — asl matn, o'zgarmaydi; `yangiGap` — qayta yozilgan matn yoki olib tashlangan o'rniga qo'yilgan keyingi qadam, aks holda `null`; `bolaklar` — yakuniy matn, 12-dars shundan o'qiydi; tayanch 8, 9.43 d). Saqlashdan oldin o'zgarmas shartlar tekshiriladi: `qoldi` → `dalil` bor · `qayta-yozildi` → `yangiGap` va `dalil` bor · `dalil` da `son` yoki `yozuv` to'la. Sarlavha almashuvi, `QIzoh`; «Yangilash»; nishon `pitchFixed`.
10. **Yakkama-yakka — asosiy yo'l: o'quvchi o'z ekranini ko'rsatadi** (11-FILTR 19; yangi mexanizm yo'q). Mentor rejimida 5–7-ekranlarda o'quvchilar ro'yxati — faqat saqlash signallaridan (ism · «Da'volar n» · «Dalil n/N» · «Tuzatilgan pitch ✓»; `PRACTICE_BASE`), matn uzatilmaydi.
    **Qo'shimcha (dars unga bog'liq emas):** o'quvchi matni mentorga yetadigan mexanizm tayyor bo'lsa (`recordAttempt` `p_texts` — asosiy seans qarori; 11-Modul 15-dars «KOD» 4), qatorni bosish → o'quvchi varag'i. Bo'lmasa — hech narsa o'zgarmaydi. Varaq boshqa o'quvchilarga, podium va arenaga chiqmaydi.
11. Testlar s4/s8 — `correctIdx` 2/1 = `INLINE_KEYS`; `RECAPS` {4, 8} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {4, 8}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
12. `ACHIEVEMENTS` 4 (`claimFinder`, `threeParts`, `dateCheck`, `pitchFixed`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
13. s11 `QYakun`: sarlavha **to'rt holat** — s5/s6/s7 saqlash holatidan (P-046); `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» `small`; `uyga` — `HwCard` (Kim bilan · Nechta · Muddat + ①②③; ③ holatdan yig'iladi); `keyingi` — «Raqamlaringiz zalni ishontiradimi?».
    Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
14. App.jsx `m10-11` qatoriga `comp: PmPitchReviewLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 408-qator). Bu agent App.jsx ga tegmaydi.
15. **REPO — yo'q** (PM darsi; tayanch 3).
- Darvozalar: `npm run gates -- src/10-Modull/PmPitchReviewLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md).

## Manbalar (06.10.2026)
- Bu darsda yangi tashqi xizmat qadami yo'q — rasmiy tashqi sahifa **ochilmadi**. Tashqi nomlar faqat o'tilgan ma'noda: Neon SQL Editor va «Run» (11-Modul tayanchi 6, 9.99 — 06.10 qayta ochilgan hujjat), Umami — lending tashrifi va tugma bosilishi (tayanch 1.1, 6), Database — Neon (11-Modul).
- Da'vo, dalil, manba, tuzatilgan pitch ta'riflari va Mentorning to'rt da'vosi — `00-MODUL-TAYANCH.md` 1.11 va 2 (aynan). Mentor hisoboti va zaxira reja — 1.10; sonlar jadvali — 1.13; sinfdoshlar qoidasi — Qaror-0 13.
- Intervyu sanog'i (4 / 5) — 11-Modul tayanchi 1.3; pitch bo'laklari, yechim gapi, «jonli demo» ta'rifi — 11-Modul tayanchi 1.4, 2, 9.46, 9.98 va `16-PmPrototypePitch-v3.md`; yakkama-yakka vaqti — 11-Modul 9.96.
- `pm-m9d16-pitch` ichki shakli — 11-Modul tayanchi 8 (`{ muammo: { gap, dalil }, yechim, demo: { harakat, tuzatish, son }, keyingi, vaqt, varaq }`). `pm-m10d10-hisobot` — 12-Modul tayanchi 8; 10-dars MD si 11-FILTR da o'qildi (10-FILTR dan keyingi shakl: `oldin`, `qaytgan` ning ikki soni va davri, `manba` — haqiqiy yo'l, `tuzatishQator`, `zaxira.dalil`).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
**11-FILTR (F-1006-365) dan keyingi holat — hammasi tayanch 9.43 ga yozildi:**
1. ✅ **Mentor da'volarining bo'laklari** (1 — Muammo · 2, 3 — Jonli demo · 4 — Keyingi qadam) — tasdiq; umumiy qoida emas, Mentor misoli.
2. ✅ **Muammo da'vosining qisqa shakli** — qoladi; dalil yonida «5 o'yinchi — kichik son: bu tanlov uchun dalil, isbot emas» (11-FILTR 4).
3. ✅ **«Jonli demoda ko'rinadi»** — qoida tayanchda (9.43 c): jonli demo ham dalil; «da'vo emas» deyilmaydi — bugungi mashqqa kirmaydi.
4. 🔁 **Mentor dalillarining «sanasi»** — dalilning uchinchi narsasi endi **«qachon»** (kun yoki davr); «sana» so'zi bu ma'noda ishlatilmaydi.
5. ✅ **Sinfdosh qatori** — tasdiq (tayanch 1.11 ga qo'shildi).
6. ✅ **Mentorning yangi Keyingi qadam gapi** — tasdiq (Mentor tanlovi).
7. 🔁 **«Son yoki yozuv»** — ikki model birlashtirildi: dalil — son yoki yozuv; sanaydigan manbadan — son, intervyu va sinovdan — son yoki yozuv; raqam hamma dalilda majburiy emas (11-FILTR 1, 2).
8. ✅ **«Sinov yozuvlari» manbasi** — qo'shildi (tayanch 1.11).
9. ✅ **`bolaklar`, `savedAt`** — tayanch 8 ga kirdi; + `dalil: { son, yozuv, manba, qachon }` va o'zgarmas shartlar.
10. 🔁 **Da'volar 1–6** — qoladi; yakuniy kartada tegsiz gaplar ko'rigi qo'shildi — «har da'voda dalil bor» rost bo'lishi uchun (11-FILTR 9).
11. 🔁 **Mentor varag'i (jonli)** — qo'shimcha; asosiy yo'l — o'quvchi ekranini ko'rsatadi.
12. 🔁 **Yakkama-yakka** — 6-ekrandan keyin; har o'quvchida bitta da'vo, bitta dalil, bitta qaror — ≈ 2–3 daqiqa; ⛔ pilot.
13. 🔁 **`tekshiruv: 'tuzatish'`** — ogohlantirish emas: o'sha qatorning tanlovi bosilmaydi (10-dars kalitiga `tuzatishQator` qo'shildi).
14. ✅ **Keyingi qadamni zaxira ish bilan almashtirish** — ixtiyoriy, tasdiq.
15. ✅ **Uyga vazifa ②** — tasdiq.
16. ✅ **«Raqam» faqat dars nomida** — tasdiq (tayanch 9.43 f).
17. ✅ **Asosiy harakat ta'rifi** — 9.23 shakli; tayanch 1.11 yangilandi. 3-da'voning yangi gapi endi qaytganlar soni bilan (2-da'vo dalili bilan takror edi).

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **Yakkama-yakka vaqti** — endi har o'quvchiga ≈ 2–3 daqiqa (bitta da'vo, bitta dalil, bitta qaror): 12 kishi ≈ 36 daqiqa, 6-ekran ≈ 28–30-daqiqada tugasa, 8-ekran ≈ 66-daqiqada. Bu — reja, o'lchov emas: «qur» pilotida taymer bilan (tayanch 9.43 g).
2. **«Maydon Jamoa» telefon maketisiz.** TAQIQLAR 0 / SABOQ 2: mahsulot nomi — telefon maketida. Bu darsda ilova ishlatilmaydi (pitch matni va sonlar — SABOQ 24), nom faqat varaq sarlavhasida o'z rangida. Vizual bosqichda tekshirilsin.
3. **5-ekranda gaplarga bo'lish** — nuqta bo'yicha bo'lish «Shanba, 18:00.» yoki qisqartmali matnda xato bo'lishi mumkin; o'quvchi ✎ bilan tuzatadi. Node sinovida namunalar bilan.
4. **6-ekran yumshoq tekshiruvi** (Umami + «ishlat», «ro'yxat», «qo'shil», «e'lon») — erkin matnda noto'g'ri ishga tushishi mumkin; yumshoq bo'lgani uchun bloklamaydi.
5. **4-ekran D «Foiz»** (auditor «yagona javobli» dedi — qoldi) — foiz ham son; distraktor «nima yetishmaydi» savolida himoyalanadi (uch narsa — 3-ekran), lekin auditor «foiz ham dalil» deyishi mumkin.
6. ✅ **8-ekran** — auditor bahsli dedi va haq chiqdi: savol qayta yozildi (olib tashlash — berilgan, o'rniga nima aytiladi).
12. **Yozuv-dalil** (11-FILTR 1) — o'quvchi sanaydigan manbani tanlamay, hamma dalilni «intervyu yozuvlari» deb sonsiz yozib ketishi mumkin; dars bloklamaydi — Mentorning ikkinchi savoli («Bu dalil aynan shu gapni ko'rsatadimi?») shu uchun.
13. **Tegsiz gaplar ko'rigi** (7-ekran) — «Ko'rib chiqdim» belgisi rasmiy bosilishi mumkin; dars qaysi gap da'vo ekanini o'zi aniqlay olmaydi. Yakun sarlavhasi shu belgiga tayanadi.
14. **`tuzatishQator`** — 10-dars MD siga shu Filtrda qo'shildi; 10-darsni avval o'tgan o'quvchida (eski saqlash) bo'lmaydi — zaxira yo'l yozilgan.
7. ✅ **`pm-m10d10-hisobot` maydonlari** — 10-dars MD si bilan solishtirildi (10-FILTR dan keyingi shakl).
8. **2-ekran 3-karta** — «yoqdi» ni to'rt manbada izlash sahnasi «yoqqanini sanab bo'lmaydi» degan umumiy taassurot berishi mumkin; yorliq «yoqdi — sanalmagan» faqat Mentor manbalari haqida.
9. **Arena 1 variantlari B–D** — da'vo emasligi ochiq ko'rinadi (tez savol); qiyinlik past.
10. **Arena 6** — «eng yangi son sanasi bilan»; 12-darsda grafikda hamma haftalar aytiladi — savol pitchdagi bitta gap haqida, grafik haqida emas.
11. **«Intervyular ilova chiqishidan oldin bo'lgan»** (3-ekran xato izohi) — 11-Modul 3–4-darslari, ilova 9–14-darslarda: Mentor misolida rost; o'quvchida ham shu tartib (11-Modul dasturi).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 14 band)
1. [x] **Yakun holatga qarab** — 11-ekran: to'rt sarlavha (saqlandi · dalillar qo'yildi · da'volar topildi · ochildi); ✓ va nishon faqat birinchisida; uyga vazifa ③ holatdan yig'iladi; sarlavha o'quvchi qilgan ishni aytadi.
2. [x] **Da'vo isbot emas:** a) «Bu darsda har dalilda uch narsa» (3-ekran xulosasi, recap 4, kartochka 2, yakun) — kurs qoidasi chegaralangan; 1-gap dalili — «kichik son: isbot emas»; va'da — olib tashlash yagona yo'l emas (maqsad deb qayta yozish ham bor); b) Mentor misoli umumiy qolip emas — 5-ekran eslatmasi, Yordam «Mentor misolida», 7-ekran Yordam;
   c) kafolat yo'q — «zal ishonadi» yo'q; «o'zgaradi» faqat pitch matni haqida; d) qayta yozilgan gap eski da'voni isbotlamaydi (2-ekran eslatmasi, kartochka 8 izohi, 7-ekran eslatmasi); 4-da'vo — va'da, maqsad bilan farqi aytilgan.
3. [x] **Maxfiy qiymat chiqmaydi** — agent yo'q, `.env` va token tilga olinmaydi; kalitlarga ism, login, akkaunt nomi yozilmaydi (A-12); dalilda faqat son, ism yo'q; uyga vazifa ② — 10-darsdagi sanoq SQL i (`COUNT`, `SELECT *` emas).
4. [x] **Tashqi xizmat faqat rasmiy hujjat** — yangi tashqi qadam yo'q; Neon «Run» va Umami — tayanch 6 va 11-Modul tayanchidan; tugma va menyu nomi taxmin qilinmagan (Manbalar).
5. [x] **Har sonning manbasi va o'lchovi** — darsning o'zi shu: 2, 3-ekranlarda har Mentor soni ustida «Mentor misolida» va birligi (kishi · qurilma · tashrif); 3-ekran Umami ↔ Database — har xil o'lchov, ayirilmaydi (O'qituvchi eslatmasi); 6-ekran teg — son yoki yozuv · manba · qachon.
6. [x] **Tayanchda yo'q narsa to'qilmaydi** — to'rt da'vo, dalillar, sonlar, zaxira ishi — 1.10, 1.11, 1.13 dan; o'zim qaror qilganlar — TAYANCHGA SAVOL 1–17, 11-FILTR dan keyin tayanch 9.43 da (bo'laklar, «qachon», sinfdosh qatori, Keyingi qadam gapi, manba chipi, kalit maydonlari).
7. [x] **Saqlash kaliti** — `pm-m10d11-pitch` tayanch 8 aynan (`bolaklar`, `savedAt`, `dalil: { son, yozuv, manba, qachon }`, o'zgarmas shartlar — 11-FILTR 13, 15); `davolar[].id` barqaror (`d1`…), tartib o'zgarmaydi; `qaror` — ish fakti, `dalil` — alohida maydon; kalit yo'q bo'lsa o'quvchi o'zi yozadi (5, 6-ekran).
8. [x] **Test: bitta himoyalanadigan javob** — 4-ekran (uch narsadan biri, son javobda yo'q) · 8-ekran (11-FILTR 10 dan keyin: olib tashlash berilgan, o'rniga nima aytiladi — maqsad deb qayta yozish yo'li bilan bahslashmaydi); distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri; «Hech qayerda», «Farqi yo'q» turidagi variant yo'q; to'g'ri javob yolg'iz eng uzun emas (O'lchov).
9. [—] **Keys** — keyssiz dars (Qaror-0 22, tayanch 5).
10. [~] **90 daqiqa** — taqsimot sarlavha ostida va A-8 (reja, pilotda o'lchanadi); yakkama-yakka — har o'quvchiga ≈ 2–3 daqiqa, bitta da'vo; ulgurmagan qism — yakun holati va uyga vazifa ③; «Ortda qoldingizmi» va tashqi kutish — bu darsda yo'q (repo va build yo'q).
11. [x] **Bir ma'no — bir so'z** — A-5: son/raqam, bo'lak/qism, Keyingi qadam (faqat bo'lak nomi), gap/da'vo/va'da, ish, tekshir-/sinov, e'lon; «hodisa», «bosqich», «xabar», «push» bu darsda yo'q.
12. [x] **Web-trek teng yo'l** — PM darsi, blok yo'q; 5-ekran Yordam «web-trekda ham shunday»; hisobot va pitch kalitlari ikkala trekda bir; yakuniy test va yakun ikkala trekka to'g'ri (ikkinchi misol — kitob ilovasi).
13. [x] **Agent va o'quvchi ishi ajratilgan** — bu darsda agent yo'q; qarorlarni o'quvchi qiladi (qaysi gap da'vo, qaysi dalil, qayta yozish yoki olib tashlash); Mentor yakkama-yakkada ko'radi, o'rniga hal qilmaydi.
14. [x] **O'smir xavfsizligi** — dalilda ism yo'q, faqat son; sinfdoshlar — son bilan, ismsiz; yakkama-yakkada o'quvchi o'z ekranini ko'rsatadi — matn boshqa ekranga uzatilmaydi (KOD 10); kalitlarda shaxsiy ma'lumot yo'q; sonlar baho emas (50 ga yetmaslik — 10-dars qoidasi).

## O'lchov — `md11/olchov.py` natijasi (qavsdagi sonlar skript bilan tekshirilgan)
```
Qavsdagi uzunliklar: 116 ta — matn bilan mos (skript har «(N)» ni oldidagi matnga solishtiradi; qolgan 2 signal soxta: «(393)» — piksel, «(umumiy)» — yorliq, matnning o'zi 39).
Sarlavhalar (12 ta, holat variantlari bilan): 25–52 · ≤55, hammasi bitta qator.
Xulosalar (sobit matn): 2-ekran 89 · 3-ekran 78 · 6-ekran («hammasida») 67 · ≤110 (11-FILTR dan keyin qayta sanaldi). O'quvchi ma'lumotli xulosalar — namuna bilan ≈40–100 (5, 6, 7-ekranlar).
Bugungi asosiy fikr: 101 · ≤110.
Hook javobi: 114 · ≤120 (sof so'rovnoma — uchala variantga bitta javob).
To'g'ri izohlar: 48, 56 · ≤60.
Xato izohlari va QXato (25 ta): 31–57 · ≤60.
QIzoh qatorlari: 28–87 (bitta qator).
4-ekran savol: 12 so'z; 8-ekran savol: 12 so'z; arena savollari: 2–10 so'z · ≤12.
4-ekran: A 35 · B 37 · ✔C 37 · D 34 | min/max 34/37 (+9%) — 11-FILTR dan keyin; ✔ yolg'iz eng uzun emas (B bilan teng)
8-ekran: A 38 · ✔B 34 · C 34 · D 32 | min/max 32/38 (+19%; o'rtachadan eng katta farq 10%) — 11-FILTR dan keyin yangi savol
arena 1: ✔A 33 · B 33 · C 36 · D 33 | min/max 33/36 (+9%)
arena 2: A 37 · ✔B 36 · C 34 · D 34 | min/max 34/37 (+9%)
arena 3: A 27 · B 26 · ✔C 26 · D 25 | min/max 25/27 (+8%)
arena 4: A 31 · B 28 · C 28 · ✔D 30 | min/max 28/31 (+11%)
arena 5: ✔A 28 · B 30 · C 28 · D 27 | min/max 27/30 (+11%)
arena 6: A 32 · ✔B 30 · C 33 · D 34 | min/max 30/34 (+13%)
arena 7: A 31 · B 31 · ✔C 33 · D 33 | min/max 31/33 (+6%)
arena 8: A 32 · B 33 · C 34 · ✔D 32 | min/max 32/34 (+6%)
arena 9: ✔A 32 · B 34 · C 33 · D 31 | min/max 31/34 (+10%)
arena 10: A 31 · ✔B 30 · C 27 · D 28 | min/max 27/31 (+15%)
arena 11: A 32 · B 31 · ✔C 30 · D 32 | min/max 30/32 (+7%)
arena 12: A 33 · B 29 · C 32 · ✔D 31 | min/max 29/33 (+14%)
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```
Belgilar soni — bo'shliq bilan, `**` siz; testlar — eng qisqa / eng uzun variant va farq; arena — ✔ o'rni A·B·C·D ×3, to'g'ri variant hech qayerda yolg'iz eng uzun emas (arena 7 — C va D teng 33). Mentor gaplari ko'z bilan sanaldi:
interaktiv ekranlarda (2, 3, 5, 6, 7) bitta gap; kirish va reja — ikki gap (11-Modul 15-dars naqshi). Qavsdagi «(≈…)» — o'quvchi ma'lumotli qolip, namuna bilan sanaldi.
`npm run lint:til` — 11-FILTR dan keyin **0 error, 2 warn** («sana» → «qachon» bo'lgach buyruq-fe'l signallari yo'qoldi). Undan oldin — **0 error, 17 warn**: 17 tasi ham buyruq-fe'l qoidasidan va hammasi dalilning uchinchi narsasi nomi (tayanch 1.11 atamasi, ot) — qoida uni «sanash» buyrug'i deb o'qiydi. O'zgartirilmadi.
Ikki `toladi-fe'l` warn tuzatildi (fe'l «yoziladi» bilan almashdi).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 407–409 (grep 06.10) — `m10-10` «50 foydalanuvchiga yetdingizmi?» → **`m10-11` «Raqamlaringiz pitchni qanday o'zgartiradi?»** (osti «Mentor bilan yakkama-yakka: tuzatilgan pitch» — 1-ekran chap yorlig'i so'zma-so'z) →
  `m10-12` «Raqamlaringiz zalni ishontiradimi?» (yakundagi «Keyingi dars» qatori; bosh seansning `tekshir.py` si ham «OK» dedi). 0-ekran sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (Mentor pitchi, to'rt da'vo, hisobot sonlari — tayanch 1.10, 1.11, 1.13, 9.23); ikkinchi misol faqat testlarda (uy vazifalari, kitob almashish — P-002); keyssiz; metafora yo'q; bitta vizual — `PitchDalil` (manba oynasi + pitch varag'i + 3-ekranda zal).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (tugma → manba oynasi ochiladi, son gapga uchadi, Mentor qarori o'ynaydi), 3 (tanlov → katakka qiymat yoziladi, zal savoli almashadi) + 0, 5, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python, `md11/olchov.py`): sarlavha 25–52 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi, «Bu…»/«Hammasini…» bilan boshlanmaydi · xulosa ≤110 · hook javobi 114 · to'g'ri izoh 48, 56 · xato izohi 31–57.
- [x] Atamalar oldingi darslar bilan bir (grep): pitch, zal, bo'lak va to'rt nom, jonli demo — 11-Modul 16 · yakkama-yakka — 15 · ro'yxatdan o'tgan, asosiy harakatni qilgan (9.23 so'zi), sanoq sahifasi, metrika hisoboti, Mentor tekshiruvi, zaxira reja — 12-Modul 7–10 ·
  yangi: da'vo, dalil, manba, sana, tuzatilgan pitch — misoldan keyin, ta'riflar tayanch 2 so'zma-so'z · siz-forma; tugmalar ot-shaklda yoki siz-formada («Dalil bor», «Qayta yozish», «Olib tashlash», «Dalilni qo'yish», «Saqlash»).
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% (4-ekran 9%, 8-ekran 6%); to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas («aynan» B, C da); javobda savoldagi son yo'q (S-019) · ✔ o'rni 4-ekran C, 8-ekran B (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ — belgilar) · kafolat so'zlari yo'q («har doim», «darrov», «darhol», «albatta», «100%», «hech qachon» — o'quvchi matnida 0; `tekshir.py` bayroqlari faqat MD ichki bo'limlarida) · xulosa «Bu darsda …» bilan chegaralangan.
- [x] Ichki kodlar o'quvchi matnida yo'q (`m10-11`, «A1», «Modul 12», K-raqam yo'q; modul raqami LMS bo'yicha — «11-Modul», «10-darsda»); tarixiy voqea yo'q (keyssiz); «KOD» ro'yxati 15 band, REPO yo'q.
- [x] Karta T · P · S · PM: T-008 (pitch gaplari — olam ichidagi matn) · T-011/PM-030 (da'vo, dalil — 2-ekran oxirida; manba, sana — 3-ekranda tanlovdan keyin; tuzatilgan pitch — 7-ekranda saqlangach) · T-014/T-015 (son/raqam, bo'lak, Keyingi qadam, gap/da'vo/va'da — A-5) ·
  T-016 (metafora yo'q) · T-020 · T-024 · T-029/T-047 · T-038 (12-dars, Demo Day aytilmaydi) · T-039 («pitchingiz», «sonlaringiz» — 11-Modul va 10-darsda bor) · T-042 (ta'riflar so'zma-so'z: 2, 3, 7-ekran, kartochka, yakun) · T-043 («Mentor misolida», «Bu darsda») · T-045 (qayta yozilgan gap isbot emas) · T-048 · T-049 · T-052 · T-064 ·
  P-001 · P-002 · P-004 (5–7 — o'z pitchi) · P-008 · P-012 (testlar 4 va 8 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-025 · P-026 (pitch yoki hisobot bo'lmasa — o'zi yozadi; Neon'ga kira olmasa — son o'ylab topilmaydi) · P-033 · P-036 · P-046 · P-048 · P-052 · P-055 · P-062 · P-064 · P-067 ·
  S-001 (savollar 2–12 so'z) · S-002/S-004/S-010 · S-006 · S-008 (Mentor qarori 2-ekranda baholanmaydi; 8-ekranda «qayta yozish» varianti yo'q) · S-015 · S-019 · S-020 · S-026 · S-027 · S-034 · S-040 · §144/§145 · PM-005 (2-tur) · PM-018 · PM-020 · PM-021 · PM-027 · J-026 · SABOQ 1–31.
- [x] 11-FILTR dan keyin: TAYANCHGA SAVOL 1–17 yopildi (tayanch 9.43); ochiq qolgani — ⛔ yakkama-yakka vaqti (pilot).
