# M4b-D2 — Bitta xato — nechta odam ketadi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI → **pm-metodist korrekturasi BAJARILDI** (2026-08-17 · 13-A bo'lim) → **[GATE S]** kutmoqda.
> Fayl: `src/4b-Modull/PmLesson16.jsx` (hozir `-v16` chala avlod; qayta quriladi, yangi `lessonId: pm-m4b2-v1`).
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 Batch 3 — o'zgartirilmagan.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 4b — «Testlash: Jest» (oy 7.5–8) |
| **Dars** | M4b-D2 (modulning 2-darsi, birinchi PM darsi) · `key: m4b-02` |
| **Mavzu** | Sifat — mahsulot qiymati: nosozlik qayerda tutilsa shuncha arzon; hammasini birdan tuzatib bo'lmaydi — navbat |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z kartalarini **yozadi**; artefakt = matn (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | **K10 · CYBERPUNK 2077** ♻️ (M4b da birinchi marta) — **SIFAT-NARX burchagi**: nosozliklar QAYERDA tutildi (sotib olganlar qo'lida) va bu QANCHAGA tushdi (pul qaytarish + do'kondan qariyb yarim yil yo'qlik). ⚠️ M3-D10 (`PmLesson9`) K10 ni **«qabul shartlari oldindan yozilmagan»** burchagida ishlatgan — o'sha slayd-matnlar, bashorat («keyin nima bo'ldi?» → do'kondan olib tashlandi) va TEST-3 javobi («ishonch») TAKRORLANMAYDI (farq-dalili 6-bo'limda) |
| **ISHLATILGAN_KEYS** | K10 · 🔴 modul-ichi qoidasi (registr 4-bo'lim): M4b da birinchi keys — modul ichida takror YO'Q ✓ |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | **M4a-D2** → yuk-tartiblash (raund-saralash) · **M4-D15** → qaror-sabab tanlovi · **M4-D12** → sxema-shart tekshiruvi (registr R2). **M4b-D2 = «NOSOZLIK-NAVBATI»** — hukm-javon: har kartaga ikki savol, javon hukmdan chiqadi (26/59-qonun; farq-dalili 1-bo'lim va s9 izohida) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq ro'yxati: story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «GAPSIZ KO'RSATUV» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «UCH QAVAT KESIMI» · «YUK-SINOVI» surmasi · Hotspot · Timeline · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · yuk-tartiblash (raund-saralash) · qaror-sabab tanlovi · sxema-shart tekshiruvi · pitch-oilasi ro'yxati |
| **Misol-ip (91/108 + 95 + 96c)** | 🛴 **Skuter-ijara ilovasi** — QR bilan ochiladi, daqiqasiga pul yoziladi, «Tugatish» bilan yopiladi. 95-qonun: Toshkent o'smiri skuterni O'ZI ijaraga oladi, hisoblagichni o'zi kuzatadi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · maydoncha · musiqa ilovasi · maktab jurnali · maktab kutubxonasi · AvtoStoyanka · konsert-chipta sayti · KitobShop (m4b-01) — **skuter-ijara band emas** ✓. Grep-dalili: `skuter|samokat|scooter` src/ da faqat `PracticeLesson3.jsx:562` — ro'yxat-mashqidagi bitta so'z («Skeytbord, Samokat, Velosiped, Mashina»), bosh-misol emas, to'qnashuv darajasiga yetmaydi |
| **Kirish-artefakt** | 🔴 **YO'Q.** Modul-chegara qoidasi (registr 6-bo'lim): o'quvchi tanaffusdan keyin keladi. Oldingi artefaktga bog'lanmaydi, «topilmadi/saqlanmagan» tarmog'i ham YOZILMAYDI (korpus §69) |
| **Chiqish-artefakt** | 🔴 `pm-m4b2-sifat` = `{ kartalar: [ {nima, kimda, oqibat} × 3 ], savedAt }` — `nima` erkin matn (nima bosildi — nima bo'ldi) · `kimda` qiymati `'hammada'` yoki `'bazilarda'` · `oqibat` qiymati `'toxtaydi'` yoki `'noqulay'`. Keyingi PM dars (M4c-D2) **o'qishi shart emas** (modul-chegara), lekin shakl shu yerda muhrlanadi |
| **Yordamchi kalitlar** | `pm-m4b2-hook-choice` (faqat YOZILADI — 100c) · `pm-m4b2-tarozi` (s4: qaysi nuqtalar ko'rildi) · `pm-m4b2-navbat` (s9 hukmlari) · `pm-m4b2-code` · `pm-m4b2-reflection` · `pm-m4b2-hw-target` · `ccProgress` |
| **Koding** | ⌨️ **VS CODE** — R1 navbati (registr: m4a-02 kompilyator → **m4b-02 VS Code**). Senariy buni o'zgartirmaydi. Material: m4b-01 (`describe / it / expect().toBe()`, `.spec.ts`, `npm test`) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — B2 senariylari bilan bir xil yakun-tuzilma |

**Atama-glosslar (62/39-qonun + korpus §20 — avval hodisa, keyin nom):**

- 🔴 **«sifat» — darsning bosh atamasi**, s2 da hodisadan KEYIN tug'iladi. Kanonik ta'rif dars bo'ylab AYNAN bir xil: **«Ilova har safar aytganini qilsa — buni sifat deyiladi»** (§109: zamon-iborasi «har safar … qilsa», yasama ot emas). Shu ta'rif s2 xulosasi · flashcard-1 · RECAPS · s15 da so'zma-so'z. s0/s1 da «sifat» so'zi **0** (§126: bosh atama maqsad-ekranda emas);
- 🔴 **«nosozlik (bug)»** — kurs bo'ylab bir nom (M3-D10 shu so'zni ishlatgan; 21-qonun: shu darsda birinchi ko'rinishda qayta gloss). s0/s1 da hodisa **«xato»** so'zi bilan aytiladi; s2 xulosasi ko'prik-gap bilan nomlaydi (§112): «Ilova aytganini qilmasa — bu xato; bunday xatoni **nosozlik** (inglizchasi — bug) deyiladi». Shundan keyin dars bo'ylab faqat «nosozlik»; «bug» — flashcard va bir martalik glossda;
- 🔴 **«nosozlik narxi»** — s4 da hodisa ko'rinadi (tarozi qiyshayadi), qoida s4 yakun-qatorida fe'l bilan tug'iladi (§103): **«Nosozlik qancha kech topilsa, shuncha qimmatga tushadi»**. Bu — darsning ikkinchi kanonik gapi (flashcard-4 · RECAPS · s15 da so'zma-so'z);
- 🔴 **«navbat»** — M3-D5 dan tanish so'z (navbat belgilash). Bu darsda nosozliklarga navbat: **birinchi — hammada ishni to'xtatadigani**. «Triaj/triage» o'quvchi ekraniga CHIQMAYDI — faqat flashcard-10 javobida inglizcha juftlik: «Nosozliklarga navbat qo'yish (inglizchasi — bug triage)»;
- 🔴 **Ikki hukm-yorlig'i hamma yuzada bir xil** (korpus §80): **Kimda?** → «Hammada» / «Ba'zilarda» · **Nima bo'ladi?** → «Ish to'xtaydi» / «Noqulay, lekin ishlaydi». s1 demo · s8 tugmalari · s9 hukm-tugmalari · flashcard · testlar bitta juftlikda gapiradi;
- 🔴 **Javon-nomlari:** 🔴 **«Hozir»** · 🟠 **«Bugun»** · ⚪ **«Keyin»** — s9 da hodisadan keyin ochiladi, boshqa ekranda oldindan aytilmaydi;
- 🔴 **«tutildi/tutiladi»** — nosozlikni topish fe'li (dars bo'ylab bitta fe'l: «tutildi», «tutadi», «tutilmagan»). ❌ «ushlandi», «aniqlandi», «ilindi» — ishlatilmaydi (§80: bir hodisa — bir fe'l). Skuter olamida «tutish» boshqa ma'no bermaydi (skuter tutilmaydi, ochiladi/yopiladi);
- 🔴 **«test» so'zi FAQAT bitta ma'noda (§105/§121):** o'quvchi m4b-01 da «test» = Jest-testi (kodni tekshiradigan kod) deb o'rgangan. Shu darsda «test» aynan shu ma'noda va faqat to'rt yuzada: s4 birinchi nuqtaning fakt-qatori («Test tutdi») · s4 ko'prik-gapi · s10 koding-ekrani · flashcard-5 va arena-12. Ballanadigan savol-ekranlarini o'quvchi matni **«savol»** deb ataydi (platforma eyebrow «To'g'ri javobni tanlang» — o'zgarmaydi); «Yakuniy test» kabi yorliq ekranga chiqmaydi. Dasturchi tekshiruvi umuman aytilganda — **«tekshiruv»**;
- 🔴 **Yo'l-nuqtalari (s4) hamma yuzada bir xil:** 🧑‍💻 **«Kod yozilayotganda»** · 📦 **«Chiqarishdan oldin»** · 📱 **«Odamlar qo'lida»** — flashcard, testlar, arena shu uch nom bilan;
- 🔴 **«ishlaydi/ishlamaydi»** — 61-qonun: hukm-tugmasida emas, faqat holat-tavsifida («Noqulay, lekin ishlaydi» — bu ish holati, o'quvchi hukmi emas); o'quvchi bahosi tugmalari «Hammada/Ba'zilarda», «Ish to'xtaydi/Noqulay» — baho predmetni aytadi;
- ❌ **«edge case», «happy path», «error path», `toThrow`** — m4b-03 niki (29-qonun: kelajak-atama oqmaydi). «chegara holat» ham YO'Q;
- ❌ **«retention», «churn», «DAU»** — M5 niki; `App.jsx` sub'ida hozir «retention» turibdi — 14-bo'lim 1-bandiga qarang. O'rniga «odam ketadi / qoladi»;
- ❌ **«QA», «reliz» (ruscha kalka), «deploy», «prod»** — kalka/jargon: **«tekshiruv», «chiqarish», «chiqarishdan oldin/keyin»**. (m4c-02 «reliz» so'zini o'zi ochadi — bu yerda oqmaydi);
- ❌ **«buzuq», «buzilgan», «g'alati», «chala», «shunchaki»** — 47-qonun taqiq-so'zlari; o'rniga «xato», «noto'g'ri», «ishlamadi», «to'liq emas»;
- ❌ **«ishonch»** — M3-D10 ning K10-xulosasi (TEST-3 javobi + RECAPS). Bu darsda ballanadigan matnda ishlatilmaydi — dars narx va navbat haqida gapiradi;
- ❌ **«sinadi/sindi»** (M4a-D2 nosozlik-fe'li) — bu darsda ishlatilmaydi: nosozlik «chiqadi/tutiladi», ilova «ishlamaydi/aytganini qilmaydi».

🔴 **§40 darvozasi (o'quvchida hali YO'Q narsa uniki qilib aytilmaydi):** o'quvchida skuter ilovasi YO'Q — dars bo'ylab **«skuter ilovasi» / «ilova»**, hech qachon «ilovangiz». O'quvchiniki — u YOZGAN uch karta («kartalaringiz»).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «SIFAT-TAROZI»** (23-qonun: har darsda YANGI — registr 5-bo'limdagi birorta band vizual klonlanmaydi).

Ekran ikkiga bo'linadi. **Yuqorida** — nosozlikning yo'li: uch nuqtali chiziq 🧑‍💻 **Kod yozilayotganda** ─── 📦 **Chiqarishdan oldin** ─── 📱 **Odamlar qo'lida**; chiziq boshida bitta nosozlik-kartasi turibdi: *«"Tugatish" bosilganda hisoblagich to'xtamaydi»* (hook obyekti — 91a). O'quvchining qo'lida bitta **🧪 tekshiruv-belgisi**: uni uch nuqtadan biriga qo'yadi va **«▶ Chiqaramiz»** ni bosadi. **Pastda** — ikki pallali tarozi; palla-yorlig'i o'zini aytadi (§130): chap palla **«Tuzatish vaqti»**, o'ng palla **«Ketgan odamlar»**.

Bosilgach nosozlik-kartasi chiziq bo'ylab yuradi; 🧪 belgi turgan nuqtada to'xtaydi («tutildi»), tarozi shu nuqtaning narxini ko'rsatadi va nuqta ostida **bitta fakt-qator** chiqadi:

| 🧪 qayerda | Chap palla (Tuzatish vaqti) | O'ng palla (Ketgan odamlar) | Fakt-qator |
|---|---|---|---|
| 🧑‍💻 Kod yozilayotganda | bir necha daqiqa | 0 odam | ✅ Test tutdi — dasturchi shu zahoti tuzatdi. Odamlar hech narsani ko'rmadi |
| 📦 Chiqarishdan oldin | bir kun | 0 odam | ✅ Jamoa telefonda tekshirib topdi — chiqarish bir kunga surildi. Odamlar hech narsani ko'rmadi |
| 📱 Odamlar qo'lida | haftalar | bir qism odam ketdi | 🔴 Sharhlarda chiqdi: «pul yeyapti». Tuzatish va yangilanish haftalab tarqaldi — bir qism odam ketib bo'ldi |

Tarozi **jonli qiyshayadi**: 1-nuqtada deyarli tekis · 2-nuqtada chap palla biroz og'ir (vaqt ketdi, odam ketmadi) · 3-nuqtada o'ng palla **pastga bosadi** (odam ketdi). O'quvchi 🧪 belgini boshqa nuqtaga ko'chirib qayta bosadi — uch nuqta ham ko'rilishi kerak (yurish-naqshi 88a1: faqat ko'rilmagan nuqtalar aylanadi).

**Yakun-karta** (uchala nuqta ko'rilgach, 94-qonun progressiv ochilish; bitta gap): **«✅ Buni o'zingiz topdingiz: nosozlik qancha kech topilsa, shuncha qimmatga tushadi.»** Ostida bir qatorlik ko'prik (m4b-01 ga, 87c): *«Kod yozilayotganda tutadigan tekshiruv — o'tgan darsda o'zingiz yozgan test.»*

🔴 **Rang-qonuni (palitra-pasporti):** 3-nuqtadagi qizillik — **haqiqiy yo'qotish holati** (M4a-D2 «singan qism» pretsedenti), o'quvchining xatosi EMAS. 1–2-nuqtalar `success`. Belgi qo'yish tartibida «noto'g'ri» yo'q — hamma nuqta ko'rilishi kerak, tanlov emas kashfiyot.

🔴 **Nima uchun aynan shu:** «nosozlik narxi» so'zini **o'qib** tushunib bo'lmaydi — narx tarozida **og'irlashganda** ma'noga kiradi. Bola narx haqida gapirmaydi: tekshiruvni o'z qo'li bilan yo'lning uch joyiga qo'yadi va bitta xuddi shu nosozlik uch joyda uch xil narx berishini ko'radi. Bu — darsning butun g'oyasi (sifat — mahsulot qiymati; kech tutilgan nosozlik = ketgan odam) qo'lda o'ynaladigan shakli va K10 keysining darsdagi kichik ko'rinishi (Cyberpunk nosozliklari 3-nuqtada chiqqan).

🔴 **Mexanika-farqi (26/59-qonun + 23-qonun):** M4a-D2 da o'quvchi **miqdorni surib** sinish nuqtasini topardi (surma), M4-D2 da **tugmani yoqib-o'chirib** oqibatni ko'rardi, M3-D10 da **soxta formani bosib** ish tayyor-emasligini topardi. Bu yerda **bitta belgini yo'lning uch joyiga navbat bilan qo'yib, o'sha bitta nosozlikning narxi qanday o'zgarishini ko'radi** — boshqa obyekt (tekshiruv-nuqtasi), boshqa harakat (joylash), boshqa ko'rsatkich (tarozi). Surma yo'q, forma yo'q, tugma-holat yo'q.

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 40–45 soniya harakatsizlikdan keyin bitta qoida-ipuchasi: «Belgini boshqa nuqtaga ham qo'yib ko'ring» — javobni AYTMAYDIGAN shaklda (korpus §77).

🔴 **TEKSHIRUV — «NOSOZLIK-NAVBATI» (s9, to'liq spetsifikatsiya 3-bo'lim BLOK 5 da):** 4 nosozlik-kartasi bittalab; har kartaga **ikki savol** — «Kimda?» (Hammada / Ba'zilarda) va «Nima bo'ladi?» (Ish to'xtaydi / Noqulay, lekin ishlaydi). Ikki hukm berilgach karta **o'zi** uch javondan biriga tushadi: 🔴 Hozir (ikkalasi ham og'ir) · 🟠 Bugun (bittasi og'ir) · ⚪ Keyin (ikkalasi yengil). To'rttasi tushgach navbat-chizig'i ochiladi. **Farq-dalili:** M4a-D2 yuk-tartiblashda o'quvchi qolganlar orasidan **«keyingi sinadigani»ni tanlardi** (solishtirma tanlov, raund-raund) — bu yerda har karta **mustaqil**, ikki savolga **hukm** oladi, tartib esa hukmdan **o'zi chiqadi**; o'quvchi tartibni tanlamaydi. M4-D12 sxema-shart tekshiruvida bitta artefakt uch shartdan o'tkazilib nuqson topilardi — bu yerda nuqson topilmaydi, to'rt kartaga og'irlik beriladi. Timeline (vaqt-chiziq) emas, drag emas, juftlash emas.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi B2 senariylari bilan bir xil:
> koding → yakuniy savol → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «"Tugatish"ni bosdingiz — hisoblagich to'xtamadi. Ertaga ilovani yana ochasizmi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch karta-qatori o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — yoqmadi ↔ ishlamadi: sifat va nosozlik | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **SIFAT-TAROZI** (tekshiruv-belgisi + tarozi) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K10 Cyberpunk 2077 (6 bosqich + 2 bashorat + bosqich-hisoblagich) | 3 | — | keys-slayd (33/56-qonun + 17-ov-band) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 nosozlik-kartasi** (sharhdan kartaga, bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **NOSOZLIK-NAVBATI** | 5 | — | 🔴 hukm-javon (yangi mexanika) |
| s10 | KODING — nosozlikni odamlarga yetmasidan tutadigan test | 6 | — | 26/82/87-qonun · VS Code |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ustaxona», «tarozi-ekran», «yadro» so'zlari o'quvchi ekranida YO'Q** (korpus §84 + 14-qonun) — bular senariy-ichi nomlar; ekranda sarlavha aniq harakatni aytadi. «SIFAT-TAROZI» ham senariy-ichi imzo-nomi — ekranda tarozi shunchaki tarozi, yorliqlari «Tuzatish vaqti» / «Ketgan odamlar».

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 4b — Testlash: Jest
DARS: M4b-D2 (2-dars)
DARS_MAVZUSI: Sifat — mahsulot qiymati: nosozlik qayerda tutilsa shuncha arzon; navbat
ISHLATILGAN_KEYS: K10
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Skuterni QR kod bilan ochdingiz, yetib borib «Tugatish»ni bosdingiz —
hisoblagich to'xtamadi, pul yozilib turibdi. Ertaga yana shu ilovani ochasizmi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: kimdir kechiradi, kimdir ketadi —
jamoa esa sababini bilmaydi; nechta odam ketishi xato qayerda tutilganiga bog'liq.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkalasining ham hayotiy dalili bor (kechiradiganlar
ham, boshqa ilovaga o'tadiganlar ham). Shu bo'linishning o'zi darsga eshik.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 🤷 Ochaman — bir marta bo'ldi-da | 31 |
| 😤 Ochmayman — boshqasini yuklayman | 34 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham bo'ladi: kimdir kechiradi, kimdir shu kuniyoq boshqasiga o'tadi. Ilovani yasagan jamoa buni bilmaydi — u faqat kamayib borayotgan odamlar sonini ko'radi. Nechta odam ketishi xato **qayerda tutilganiga** bog'liq — bugun shuni ko'rasiz.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsa (skuter, QR, «Tugatish», hisoblagich) + harakat-fe'llari («ochdingiz», «bosdingiz», «to'xtamadi») + o'quvchining o'z holatidan o'sadi (skuterni o'zi ochib, o'zi tugatgan). Ovoz chiqarib o'smir og'zidan aytildi — «darslik» bo'lib eshitilmaydi.
> 🔴 **104/§119:** to'g'ri javob YO'Q — payoff ikkala tanlovda bir xil va **hech birini yolg'onga chiqarmaydi**: «Ochaman»ga «kimdir kechiradi», «Ochmayman»ga «kimdir o'tadi» — ikkalasi payoffda rost turibdi; ❌ «To'g'ri o'yladingiz…» yozilmaydi.
> 🔴 **100-qonun:** tanlov `pm-m4b2-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62/§126:** «sifat», «nosozlik», «navbat» atamalari bu ekranda YO'Q — hodisa «xato» so'zi bilan; atamalar o'z ekranida ochiladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ekran-o'lchovi:** savol + payoff = **395 grapheme** proza (chegara 400) ✓.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida skuter ilovasidagi uchta xatoni karta qilib yozib olasiz: nima
bo'ldi, kimda bo'ladi, ishni to'xtatadimi — va qaysi biri birinchi tuzatilishini
o'zingiz aytasiz.
HARAKAT: O'quvchi kuzatadi: bo'sh ro'yxatga uchta karta-qatori o'z-o'zidan yozilib
chiqadi, har birining yoniga ✅ qo'yiladi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ro'yxat yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

**Demo-uch qator (o'z-o'zidan yozilib chiqadi) — strelkali juftlik, ustun-sarlavhasiz (korpus §67d):**

| Ekranda ko'rinadigan qator |
|---|
| «Band qilish» bosilsa xato chiqadi → Hammada · Ish to'xtaydi |
| Sharh yozish oynasi yopilmaydi → Ba'zilarda · Noqulay, lekin ishlaydi |
| Profil rasmi qo'yilsa yon ko'rinadi → Ba'zilarda · Noqulay, lekin ishlaydi |

> 🔴 **39/62/§126-qonun:** s1 da «sifat», «nosozlik», «navbat», «narx» so'zlari **0** — hodisa «xato», artefakt «karta»; atamalar o'z ekranida ochiladi. Demo faqat karta-shaklini ko'rsatadi (nima → kimda · nima bo'ladi).
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo-uchlik s4 nosozligiga (hisoblagich), s8 sharhlariga (Boshlash · til · tungi xarita), s9 to'rtligiga (karta qo'shish · signal · tarix · QR-kamera) va test-to'plamlariga (s3 · s11) KIRMAYDI — har to'plam o'z obyektida.
> 🔴 **§128 (namuna o'z qoidasidan o'tadi):** har demo-qatorida harakat va natija bor («bosilsa — xato chiqadi») — demo s8 saqlash-shartidan o'zi o'tadi; bola uni ko'chirsa, kartasi qabul qilinadi.
> 🔴 **§123 (demo o'z qoidasidan o'tadi):** birinchi qator «Hammada · Ish to'xtaydi» — bu s9 da «Hozir» javonining aynan belgisi; demo darsning o'z qoidasiga zid emas. §125: demo natijani NOMLAYDI (nima → kimda · nima bo'ladi), «birinchi/hozir» hukmini oshkor qilmaydi.
> 🔴 **40-qonun / korpus §40:** «yozib olasiz» (artefakt) · «ilovangiz» YO'Q — o'quvchida ilova yo'q.
> 🔴 **42-qonun:** «o'z-o'zidan yozilib chiqadi»; **54(b/c):** `ta-sub` ikkinchi qator YO'Q, demo ostidagi caption YO'Q.
> 🔴 **Ekran-o'lchovi:** proza **174 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (sifat-tarozi) + 3 × Quiz
EKRAN: Ilova har safar aytganini qilsa — buni sifat deyiladi. Ilova aytganini
qilmasa — bu xato; bunday xatoni nosozlik (inglizchasi — bug) deyiladi. Yoqmagan
narsa nosozlik emas.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) tekshiruv-belgisini yo'lning uch
nuqtasiga navbat bilan qo'yib, bitta nosozlikning narxi qanday o'zgarishini ko'radi;
(s6) keys-bosqichlarini bashorat bilan ochadi.
JAVOB: s4 — uchala nuqta ko'rildi; eng arzon — «Kod yozilayotganda», eng qimmat —
«Odamlar qo'lida».
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar odatda 3-nuqtani birinchi tanlaydi va shu yerda to'xtaydi.
«Endi belgini boshiga qo'ying» deb turtki bering — solishtirish aynan shu lahzada.
```

**s2 — TEORIYA-1: yoqmadi ↔ ishlamadi** (korpus §73: ikki holatni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Ilovada nima xato — nima faqat yoqmagan?»**

Mentor (≤2 gap, 32b):
> Skuter safarida ikki xil holat bo'ladi. Ikki kartani bosib solishtiring.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 😒 **Yoqmadi** | Skuter uzoqda turibdi · narx kecha arzonroq edi — ilova aytganini qildi, sizga yoqmadi |
| ⚠️ **Ishlamadi** | «Tugatish»ni bosdingiz, hisoblagich yuraverdi — ilova aytganini qilmadi |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif):
> **Ilova har safar aytganini qilsa — buni sifat deyiladi.** Ilova aytganini qilmasa — bu xato; bunday xatoni **nosozlik** (inglizchasi — bug) deyiladi. Yoqmagan narsa nosozlik emas.

> 🔴 **39-qonun qolipi:** avval hodisa (ikki karta), keyin «… sifat deyiladi». Sarlavhada yangi atama YO'Q ✓.
> 🔴 **§109:** ta'rif zamon-iborasi bilan («har safar aytganini qilsa»), yasama ot emas.
> 🔴 **§112:** yangi nom o'tgan so'z bilan bir gapda tenglashtiriladi: «bunday **xatoni** nosozlik deyiladi» — s0/s1 dagi «xato» shu gapda «nosozlik»ga ulanadi.
> 🔴 **§104:** atama ta'rif-gapda tug'iladi (kesik qurilma emas): «Ilova aytganini qilmasa — bu xato; bunday xatoni nosozlik deyiladi». Ikkala ta'rif bir qolipda («Ilova … qilsa / qilmasa — …») — bola ikkovini yonma-yon eshitadi.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan («Ilova …»).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **286 grapheme** proza (karta matnlari — mashq-materiali, sanalmaydi) ✓.

**s4 — YADRO: SIFAT-TAROZI** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Tekshiruvni yo'lning uch joyiga qo'yib ko'ring.»**

Mentor (≤2 gap, 92a):
> Ilova odamlarga yetguncha uch nuqtadan o'tadi. 🧪 belgini bittasiga qo'ying va «Chiqaramiz»ni bosing.

> 🔴 **98b:** mentor qaysi nuqta arzon-qimmatligini AYTMAYDI — fakt-qatorlar va tarozi harakatdan KEYIN ko'rsatadi.
> 🔴 **106d/71:** har bosishda javob darhol: tarozi qiyshayadi **va** bitta fakt-qator — o'quvchi nega qimmatlashganini o'qiydi. Fakt-qator o'lchovni ham aytadi («bir necha daqiqa» / «bir kun» / «haftalar») — tarozidagi har og'irlikning manbasi ko'rinadi (korpus §95: bu skuter jamoasining namuna-hisobi, ekranda «namuna» belgisi bilan).
> 🔴 **72-qonun:** 🧪 belgi yorliqli idishda («✋ Belgini yo'ldagi nuqtaga qo'ying»), diqqat-signali bilan; birinchi qo'yishdan keyin signal tinadi.
> 🔴 **§106 (test ko'chirma bo'lmasin):** fakt-qatorlar NUQTA-darajasida gapiradi («dasturchi shu zahoti tuzatdi», «bir qism odam ketib bo'ldi»); umumiy QOIDA («kech topilsa qimmat») faqat yakun-kartada, uchala nuqta ko'rilgach; TEST-2 esa qoidani bitta nuqtaga **qo'llashni** so'raydi, ta'rifni emas.
> 🔴 **§121:** «tutildi» — faqat nosozlikni topish; skuter «ochiladi/yopiladi». «Sinadi» ildizi bu darsda 0.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + yakun-karta + ko'prik-qator = **308 grapheme** ✓.

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Har sharhni nosozlik-kartasiga aylantiring.
(mentor, 1 gap) Sharhda his-tuyg'u ko'p — siz undan faktni ajratasiz: nima bosildi,
nima bo'ldi.
HARAKAT: Uchta kartani BITTALAB yozadi. Har kartada: chapda bitta sharh turadi;
o'quvchi «nima bo'ldi»ni o'z so'zi bilan yozadi, «Kimda?» va «Nima bo'ladi?»
tugmalaridan bittadan tanlaydi. Saqlaganda karta o'ngdagi ro'yxatga ko'chadi.
JAVOB: Uchala karta yozilgan · har «nima bo'ldi»da harakat va natija bor (nima
bosildi — nima bo'ldi) · «Kimda?» va «Nima bo'ladi?» sharhdagi belgiga mos · «yomon»,
«sekin», «ishlamaydi» yolg'iz turgan yozuv karta emas.
RO'YXAT: Uchta karta yozilgan · Har kartada harakat va natija bor ·
Kimda va nima bo'lishi belgilangan
YULDUZCHA: To'rtinchi kartani sharhsiz yozing: «Tugatish» bosilganda hisoblagich
to'xtamagan holatni kartaga aylantiring.
YORDAM: Sharhdan ikki narsani toping: odam **nimani bosdi** va **nima bo'lmadi**.
Shu ikkovi — kartaning birinchi qatori.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Ilova yomon ishlaydi» degan kartalar chiqadi — bu eng foydali xato.
Javob-qatori uni tutadi; siz muhokama qiling: dasturchi bu kartadan nimani tuzatadi?
```

🔴 **Kirish-artefakt YO'Q — zaxira-tarmoq ham YO'Q** (korpus §69, modul-chegara): ekran «oldingi darsdan kelgan ish» haqida umuman gapirmaydi. Boshlanish to'g'ridan-to'g'ri: «Har sharhni nosozlik-kartasiga aylantiring.» — «topilmadi / saqlanmagan / bo'sh» so'zlari **0**.

🔴 **Uch sharh (chapda, bittalab; sharh — mashq-materiali, prozaga sanalmaydi):**

| # | Sharh (ilova do'konidan — namuna) | Kutilgan hukm |
|---|---|---|
| 1 | ⭐ «"Boshlash"ni bosaman — "Xatolik" chiqadi, skuter ochilmaydi. Sinfdoshlarimda ham xuddi shunday. Nima qilay??» | Hammada · Ish to'xtaydi |
| 2 | ⭐⭐⭐ «Ilovani o'zbekchaga o'tkazdim, har ochganda yana ruscha bo'lib qoladi 🙄 Ishlaydi-ku, lekin charchatadi» | Ba'zilarda · Noqulay, lekin ishlaydi |
| 3 | ⭐⭐ «Kechqurun menda xarita qop-qora, skuterlar ko'rinmaydi — piyoda ketdim. Do'stimning telefonida esa ko'rinib turibdi» | Ba'zilarda · Ish to'xtaydi |

🔴 **Yozish-kartasi (80b) — bitta karta, uch qadam ichida:**

| Qadam | Ipucha (placeholder — korpus §32: qisqa savol, tayyor javob YO'Q) |
|---|---|
| Nima bo'ldi (matn) | `Nima bosildi — nima bo'ldi?` |
| Kimda? (2 tugma) | «Hammada» / «Ba'zilarda» |
| Nima bo'ladi? (2 tugma) | «Ish to'xtaydi» / «Noqulay, lekin ishlaydi» |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12; 106d ikki tomonlama):**
- ✅ matnda harakat va natija bor, ikkala tugma sharhga mos → «✅ Kartada fakt bor — dasturchi xuddi shu xatoni o'zida ko'ra oladi.»
- 🤔 matn faqat bo'sh so'z (*yomon · sekin · qulay emas · ishlamaydi · xato*) → «Bu hali karta emas. Odam nimani bosdi? Keyin nima bo'lmadi? Shuni yozing.»
- 🤔 «Kimda?» sharhga zid (masalan 1-sharhda «Ba'zilarda») → «Sharhni qayta o'qing: "sinfdoshlarimda ham" — bu bittasidami?»
- 🤔 «Nima bo'ladi?» sharhga zid (masalan 2-sharhda «Ish to'xtaydi») → «Sharhda "ishlaydi-ku" deyilgan — ish to'xtadimi?»
- 🤔 matn sharhdan so'zma-so'z ko'chirilgan (uzun bo'lak) → «Bu sharhning o'zi. Uni bir qatorga qisqartiring: nima bosildi — nima bo'ldi.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **Harakat-belgilar lug'ati** (qoida-asosidagi tekshiruv — 106d(c), dars o'z so'zlaridan): harakat-fe'llari: *bos- · och- · o'tkaz- · skanerla- · tugat- · yoq-*; natija-belgilari: *chiq- · ochilma- · ko'rinma- · qol- · yuraver- · yopil-*. Bloklamaydi — yo'naltiradi. Kutilgan hukm-juftliklari yuqoridagi jadvalda; zid tanlovda javob-qatori sharhning aynan o'sha bo'lagini ko'rsatadi (§120: material har hukm uchun bitta javobni himoyalaydi — «sinfdoshlarimda ham», «ishlaydi-ku», «do'stimning telefonida esa ko'rinib turibdi»). ⚠️ 3-sharhning eski oxiri («Kunduzi hammasi joyida») kunduz/kechqurun farqini ko'rsatardi, ya'ni nosozlik KECHQURUN hammada bo'lardi — diqqatli bola «Hammada» deb to'g'ri o'ylab 🤔 olardi; endi dalil telefonga bog'landi (§120 yechimi: materialga bitta aniqlovchi gap).

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **124 grapheme** ✓ (javob-qatorlar harakatdan keyin, bittadan chiqadi; sharh — material).

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (nosozlik-navbati — hukm-javon)
EKRAN: (topshiriq) Nosozliklarga navbat qo'ying.
(yo'riqnoma) Jamoadan yana to'rt karta keldi. Har kartaga ikki savol bering —
kimda? nima bo'ladi? — karta o'zi javonga tushadi.
HARAKAT: To'rt karta bittalab: har biriga «Kimda?» (Hammada / Ba'zilarda) va «Nima
bo'ladi?» (Ish to'xtaydi / Noqulay, lekin ishlaydi) hukmini beradi. Ikkala hukmdan
keyin karta 🔴 Hozir · 🟠 Bugun · ⚪ Keyin javonidan biriga tushadi va bir qatorlik
sabab ochiladi. To'rttasi tushgach navbat-chizig'i ochiladi.
JAVOB: 1) Karta qo'shilmaydi → Hozir · 2) Ovozli signal chiqmaydi → Keyin ·
3) Ijara tarixi eskidan boshlanadi → Bugun · 4) QR eski kamerada o'qilmaydi → Bugun.
Birinchi tuzatiladigani — karta qo'shilmaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Kartani qayta o'qing va ikki savol bering: bu **hammada**
bo'ladimi? U **ijarani to'xtatadimi** — yoki ijara baribir bo'ladimi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda ishlating: har o'quvchi sherigining uch kartasini o'qib, har biriga
«bu hammadami? ijarani to'xtatadimi?» deb so'raydi. Javob kartada topilmasa — karta
qayta yoziladi.
MENTORGA: Eng ko'p adashiladigan joy — 3 va 4-kartalar: ikkalasi «Bugun» javonida,
lekin sababi har xil (hammada-noqulay ↔ ba'zilarda-to'xtaydi). Bolalar «qaysi biri
muhimroq?» deb so'rasa — ikkalasi bir javonda, tartibi jamoa qarori, deb ayting.
```

**To'rt karta (yangi to'plam: jamoadan kelgan ro'yxat — s8 sharhlaridan BOSHQA nosozliklar):**

| # | Karta (bittalab ko'rinadi) | Kimda? | Nima bo'ladi? | Javon | Javob ochilgandagi sabab-qatori |
|---|---|---|---|---|---|
| 1 | 💳 To'lov sahifasida yangi karta qo'shilmaydi — kartasiz ijara boshlanmaydi. Hamma foydalanuvchida | Hammada | Ish to'xtaydi | 🔴 Hozir | Hammada va ijara boshlanmaydi — ikkalasi ham og'ir |
| 2 | 🔔 Ijara tugaganda ovozli signal chiqmaydi — faqat ovozni yoqqanlarda; ijara baribir tugaydi | Ba'zilarda | Noqulay, lekin ishlaydi | ⚪ Keyin | Ba'zilarda va ijara tugayveradi — ikkalasi ham yengil |
| 3 | 📜 Ijara tarixi eng eskisidan boshlanadi — hammada; kechagi safarni topish uchun uzoq pastga surish kerak | Hammada | Noqulay, lekin ishlaydi | 🟠 Bugun | Hammada, lekin ijara ishlayveradi — bittasi og'ir |
| 4 | 📷 QR kod eski telefon kamerasida o'qilmaydi — faqat eski telefonlarda; skuter ochilmaydi | Ba'zilarda | Ish to'xtaydi | 🟠 Bugun | Ba'zilarda, lekin ijara boshlanmaydi — bittasi og'ir |

O'tish-gap (22-qonun — yangi to'plam ochiq aytiladi, mentor 1 gap):
> Uch kartangiz tayyor — endi shu ikki savolni jamoadan kelgan to'rt kartaga beramiz.

Yakun-qatori (navbat-chizig'i ochilgach):
> ✅ **Birinchi — hammada ishni to'xtatadigani. Keyin — yo hammada, yo ishni to'xtatadigani. Eng oxiri — ba'zilarda va ish baribir bo'ladigani.** Nosozliklarga shunday navbat qo'yiladi.

> 🔴 **26/59-qonun — yuk-tartiblashdan farqi (pasport talabi bo'yicha asoslanadi):** M4a-D2 da o'quvchi qolgan qismlar orasidan **«keyingi sinadigani»ni tanlardi** — solishtirma tanlov, raund-raund, tartibning o'zi to'g'ri javob edi. Bu yerda o'quvchi **tartib tanlamaydi**: har kartaga **ikki mustaqil hukm** beradi (kimda? nima bo'ladi?), javon hukmdan **o'zi chiqadi**, navbat esa javonlardan yig'iladi. Boshqa harakat (hukm, tanlov emas), boshqa natija (javon, o'rin emas), boshqa xato-turi (bitta hukm noto'g'ri — karta noto'g'ri javonga tushadi va sabab ochiladi). M4-D15 qaror-sabab tanlovi (qaror ↔ odam-foydasi) va M4-D12 sxema-shart tekshiruvi (bitta artefaktda nuqson topish) dan ham farqi ochiq: bu yerda juftlanmaydi, nuqson izlanmaydi — to'rt kartaga og'irlik beriladi.
> 🔴 **106d + korpus §56/§77/§98:** noto'g'ri hukmda javob DOIM ochiladi: «🤔 Kartani qayta o'qing: "hamma foydalanuvchida" — bu ba'zilaridami?» — karta o'sha bo'lagini yoritadi, javon esa to'g'ri hukmdan keyin ochiladi (bloklamaydi, qayta hukm ochiq). YORDAM faqat birinchi xatodan keyin.
> 🔴 **§120:** har kartada ikkala hukm uchun dalil-bo'lagi bor («hamma foydalanuvchida» / «faqat … da»; «boshlanmaydi/ochilmaydi» / «baribir tugaydi / ishlaydi») — bitta javob himoyalanadi.
> 🔴 **§116:** YORDAM-savoli ikkala o'lchovni qamraydi (hammadami? to'xtatadimi?) — to'rt kartaning har to'g'ri javobiga olib boradi.
> 🔴 **Sahna yangi, olam o'sha (91-qonun):** s8 — ilova do'konidagi sharhlar, s9 — jamoadan kelgan ro'yxat; bitta ip ichida ikki manba; to'rtlik s8 uchligini takrorlamaydi (§102: mashqda hukm olgan gap keyingi testga ko'chmaydi — TEST-4 yangi holatlar bilan).
> 🔴 **Katta harf emas — qalin (M4a-D2 metodist saboqi):** YORDAM va sabab-qatorlarida urg'u qalin shrift bilan.
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda) · **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **145 grapheme**; yakun-qatori (harakatdan keyin) 178 — jami 323 ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code-topshirig'i — R1 navbati)
EKRAN: (sarlavha) Nosozlikni odamlarga yetmasidan tutadigan test yozamiz.
(mentor, 2 gap) Skuter jamoasi ijara narxini hisoblaydigan kod yozdi. Shu kod to'g'ri
hisoblayaptimi — testda tekshirasiz: tarif kartasidan 5 daqiqalik narxni hisoblang.
HARAKAT: narx.spec.ts dagi it(...) ichiga expect(ijaraNarxi(5)).toBe(4500) yozadi,
npm test bilan ishga tushiradi — test qizil chiqadi (nosozlik tutildi). Keyin
narx.ts dagi hisobni tuzatadi — test yashil chiqadi.
JAVOB: Test avval qizil (kod 2500 qaytardi, 4500 kutilgan), tuzatilgach yashil.
Boshlash haqi hisobga qo'shilgan.
RO'YXAT: it ichida expect(...).toBe(4500) yozilgan · Test avval qizil chiqdi ·
Tuzatilgach test yashil chiqdi
YULDUZCHA: Ikkinchi it yozing: 12 daqiqa uchun kutilgan narx 8000 so'm.
YORDAM: Tarif kartasidan hisoblang: boshlash haqi + daqiqalar soni × daqiqa narxi.
Chiqqan sonni toBe ichiga yozing, keyin npm test.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Test qizil chiqqan lahzani ochiq nomlang: «mana — nosozlik kod yozilayotganda
tutildi, tarozining birinchi nuqtasi». Bolalar qizilni «xato qildim» deb tushunmasin.
```

> 🔴 **87-qonun (o'tilgan texnik material — `src/App.jsx` `MODULES` bo'yicha tekshirildi):** **m4b-01 `JestUnitTestLesson`** (`describe / it / expect().toBe()`, `.spec.ts`, `npm test`, `KitobShop orderTotal` namunasi) · M2 dan funksiya, arifmetika, `const`. Topshiriqda shundan tashqari hech narsa yo'q.
> 🔴 **TAQIQ — hali o'tilmagan:** `toThrow` · «edge case / chegara holat» · «happy path / error path» · `try/catch` topshiriqqa KIRMAYDI (m4b-03). 29-qonun. YULDUZCHA ham oddiy ikkinchi holat (12 daqiqa) — 0 daqiqa yoki manfiy son so'ralmaydi.
> 🔴 **26-qonun / R1:** m4a-02 kompilyator → **m4b-02 VS Code** — registr navbati, senariy o'zgartirmaydi. Texnik sabab ham bor: `npm test`/Jest brauzer-kompilyatorida ishlamaydi.
> 🔴 **Korpus §19/§48 / 82(a):** sarlavha «…digan **test** yozamiz» — «kod yozamiz» oilasining shu darsdagi halol shakli (yoziladigan narsa test-kodi).
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **209 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch kartangizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan javob bering: qaysi nosozlik birinchi tuzatiladi va nega?
Avval sherigingizga ayting, so'ng shu javobni bir qatorda yozing.
HARAKAT: (s11) yakuniy savolga javob beradi; (s12) juftlikda aytadi va bir qator
yozadi; (s14) 10 ta takrorlash kartasini o'zi tekshiradi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uchdan biri «nega» savoliga javob berolmasa — s9 ekranini qayta oching va
1-karta bilan 3-kartani yonma-yon solishtiring.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — **«O'zingizni sinab ko'ring.»** (platforma-etalon; bu darsda «sin-» ildizi boshqa ma'noda ishlatilmaydi — to'qnashuv yo'q).
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, so'ng shu javobni bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **106f(b):** yozib bo'lgach mukofot: bitta tabrik-gap («Endi siz nosozlikni "yomon ishlaydi" deb emas, karta qilib ko'rasiz») + qoida-qatori («🎯 Bugungi qoida: nosozlik qancha kech topilsa, shuncha qimmatga tushadi»).

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda kartalaringizni davom ettirasiz: o'zingiz ishlatadigan ilovada uchragan
nosozlikni karta qilib yozasiz va uni qaysi javonga qo'yishni belgilaysiz. Qancha vaqtingiz bor —
o'zingiz tanlaysiz.
HARAKAT: O'z telefonidagi bitta ilovadan (yoki eslab qolgan holatdan) nosozlik-kartasi
yozadi: nima bosildi — nima bo'ldi, kimda, nima bo'ladi; javonini belgilaydi va
sababini bir gap bilan yozadi.
JAVOB: —
RO'YXAT: Kartada harakat va natija bor · Kimda va nima bo'lishi belgilangan ·
Javoni sabab bilan yozilgan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Uch kartangizdan birinchi tuzatiladiganini belgilang va sababini bir
gap bilan yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «bitta karta», «uch karta» sanoqlari faqat kartalarda.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — karta yozish s8 da, javon belgilash s9 da bajarilgan.
> 🔴 **95-qonun (o'z telefoni):** o'smir har kuni ishlatadigan ilova — o'z olamidan; nosozlik topilmasa «eslab qolgan holat» ham bo'ladi (92d: majburiy maydon faqat o'quvchida ANIQ bor narsa uchun). ⚠️ GATE S 8-savoli.

### === BLOK 9: CODESTRIKE ===
```
VAQT: 8
KOMPONENT: Quiz (arena)
EKRAN: —
HARAKAT: 12 savol · har biri 15 soniya · sinf reytingi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: Sifat nima (ilova har safar aytganini qilsa); nosozlik nima va yoqmagan
narsadan farqi; nosozlik narxi tutilgan joyga bog'liq (kod yozilayotganda / chiqarishdan
oldin / odamlar qo'lida); qaysi nuqtada odam ketadi; nosozlik-kartasi nima yozadi
(nima bosildi — nima bo'ldi, kimda, nima bo'ladi); navbat: birinchi — hammada ishni
to'xtatadigani; Cyberpunk 2077 nosozliklari qayerda chiqqani (sotib olganlar qo'lida,
2020) va do'kondan qancha vaqtga olib tashlangani (qariyb yarim yil); test qizil chiqsa
nima bo'lgani.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §110 (mutlaq so'z/kulgili-bo'sh yo'q) · §118 (cheklov-so'zsiz) · §127 (atama ≥2 variantda) · §129 (kalit xulosadan so'zma-so'z emas). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 🛴 Skuter safarida uch holat bo'ldi. Qaysi biri — nosozlik?
- A. Ilova har ochilganda reklama ko'rsatadi *(39)*
- B. Safar tugagach uzun so'rovnoma chiqadi *(38)*
- **C.** QR skanerlandi, skuter qulfi ochilmadi ✅ *(38)*

**Reveal:** To'g'ri — ilova aytganini qilmadi; qolgan ikkitasi yoqmagan narsa, ilova ularda aytganini qilgan.

> 🔴 **§106/§129 (ko'chirma emas, qo'llash):** s2 kartalarida «Tugatish — hisoblagich yuraverdi» va «skuter uzoqda · narx kecha arzonroq» turadi; test **yangi** uch holat beradi (QR-qulf · reklama · so'rovnoma) — bola s2 qoidasini («aytganini qilmadi» ↔ «yoqmadi») yangi holatga qo'llaydi. Eski A/B varianti s2 kartasining aynan ikki misoli edi (ko'chirma) — almashtirildi.
> 🔴 **§102/§110:** A va B — bola hayotida chindan bo'ladigan va **jahlini chiqaradigan** holatlar (ishonarli distraktor), lekin s2 xulosasi ularni ochiq rad etadi («yoqmagan narsa nosozlik emas») — variant darsni **o'qiganni mukofotlaydi**. Kulgili-bo'sh variant yo'q.
> 🔴 **§99:** uchalasi ham «holat» shaklida (nima bo'ldi). **§127:** dars atamasi variantlarda yo'q — hammasi holat-tili, kalit ma'noda. Uzunlik: 39 · 38 · 38 (tell 1.03 ✓). Savol 10 so'z, predmet nomlangan («Skuter safarida …»).

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 🧑‍💻 Dasturchi nosozlikni kod yozilayotganda tutdi. Ilovaga nima bo'ladi?
- **A.** Hech kim sezmaydi — o'sha kuni tuzatiladi ✅ *(41)*
- B. Sharhlarda odamlar shikoyat yoza boshlaydi *(42)*
- C. Chiqarish bir necha kunga surilib ketadi *(40)*

**Reveal:** To'g'ri — kod yozilayotganda tutilgan nosozlik eng arzon: odamga yetmaydi, chiqarishni ham surmaydi.

> 🔴 **§106:** umumiy qoida («kech topilsa qimmat») ekranda yakun-kartada turadi — shuning uchun test **ta'rifni** so'ramaydi, qoidani **bitta nuqtaga qo'llashni** so'raydi: birinchi nuqtada aynan nima bo'ladi?
> 🔴 **§102:** B — 3-nuqtada, C — 2-nuqtada rost bo'lgan hodisalar; lekin savol 1-nuqtani shart qilib qo'ygan — bola nuqtani ajrata olsa, ikkalasini ishonch bilan rad etadi (o'qiganni mukofotlaydi). Fakt-qatorlar so'zma-so'z ko'chirilmagan (s4 da «shu zahoti tuzatdi», testda «o'sha kuni tuzatiladi»).
> 🔴 **§99:** uchalasi ham «ilovaga nima bo'ladi» ga hodisa bilan javob beradi. Uzunlik: 41 · 42 · 40 (tell 0.98 ✓).

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🎮 Cyberpunk 2077 nosozliklari qachon tutilsa, eng arzon bo'lardi?
- A. Sony o'yinni do'kondan olib tashlagan kuni *(42)*
- **B.** O'yin sotuvga chiqarilishidan oldin ✅ *(35)*
- C. Birinchi sharhlar chiqqan kunning ertasi *(40)*

**Reveal:** To'g'ri — o'yinchilar qo'lida chiqqan nosozlik pul qaytarish va yarim yillik yo'qlikka aylandi; oldin tutilsa, buning hech biri bo'lmasdi.

> 🔴 **§118 (o'lchov-so'zli savol):** «**eng arzon**» — uchala vaqt-nuqtasi ham real (olib tashlangan kun, chiqarishdan oldin, birinchi sharhlar), farq faqat narxda; cheklov-so'zi hech bir variantda yo'q.
> 🔴 **§122/§124 (keys-sadoqati):** savol bankdagi faktga suyanadi (nosozliklar chiqqandan keyin ma'lum bo'ldi, qaytarish to'lqini, do'kondan qariyb yarim yil) — raqam yo'q, ta'rifga zo'rlanmagan; «eng arzon» hukmi s4 dan (dars qoidasi), reveal esa keys-faktini dars qoidasiga bog'laydi.
> 🔴 **§106:** kalit («chiqarilishidan oldin») keys-slaydda so'zma-so'z YO'Q — 3-bosqich «sotib olganlar qo'lida chiqdi» deydi, xulosani bola s4 tarozisidan olib keladi.
> 🔴 **§99/§127:** uchalasi «qachon» ga vaqt-nuqtasi bilan javob beradi; A va C bola uchun ishonarli (ikkalasi ham «erta»dek tuyuladi), lekin ikkalasi ham chiqarishdan KEYIN — s4 3-nuqtasi. Uzunlik: 42 · 35 · 40 (tell 0.83 ✓).

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **A (indeks 0)**
**Savol:** 📋 Uch nosozlik bir kunda keldi. Qaysi biri birinchi tuzatiladi?
- **A.** Hammada: ilova ochilganda oq ekran chiqadi ✅ *(42)*
- B. Hammada: safar cheki mayda, o'qish qiyin *(40)*
- C. Ba'zilarda: eski telefonda xarita sekin ochiladi *(48)*

**Reveal:** To'g'ri — hammada bo'ladi va ilova umuman ochilmaydi: ikkalasi ham og'ir. Qolganlarida bittasi yoki hech biri yo'q.

> 🔴 **§102 (s9 ko'chirmasi emas):** uchala holat **yangi** (oq ekran · mayda chek · sekin xarita) — s9 to'rtligidan birortasi qaytmaydi. ⚠️ Eski A («to'lov bosilsa xato, ijara boshlanmaydi») s9 ning 1-kartasini deyarli so'zma-so'z qaytarardi — almashtirildi. B — «Hammada»li ishonarli distraktor (hukmni bilmagan bola «hammada» so'ziga uchadi); C — «to'xtatadi»mi degan tuzoq (sekin ochiladi — ish baribir bo'ladi).
> 🔴 **§127:** «Hammada» ikki variantda (A, B) — kalit so'zdan emas, ma'nodan topiladi. **§99:** uchalasi «Kimda: holat» shaklida. Uzunlik: 42 · 40 · 48 (tell 1.20 ✓ — eng uzuni distraktor).
> 🔴 **§129:** kalit s9 yakun-qatoridan so'zma-so'z emas — s9: «hammada ishni to'xtatadigani», test: konkret holat («ilova ochilganda oq ekran chiqadi»); qoida reveal'da.

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan (✅ savol oldida turmaydi).

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — yozilgani yashil ✓, joriysi indigo-pulsda, kelgusi kulrang-punktir.

**Yozish-kartasi (80b):** ekranning yagona kartasi, aksent-halqa bilan. Chap yarmida joriy **sharh** (mashq-materiali — sitata ko'rinishida, yulduzchalari bilan), o'ng yarmida: «nima bo'ldi» maydoni → «Kimda?» ikki tugmasi → «Nima bo'ladi?» ikki tugmasi + jonli javob-qatori. Tugma-juftliklar teng vaznda (104-qonun ruhi): birortasi «to'g'ri variant»dek ajratilmaydi.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI — faqat indikator chirog'i yonadi; uchtasi ham yozilgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda). Saqlangan qator ko'rinishi: `⚠️ «Boshlash» bosilsa «Xatolik» chiqadi, skuter ochilmaydi → Hammada · Ish to'xtaydi` (strelkali juftlik, s1 demo bilan bir shaklda — korpus §67d).

**Ipuchalar (92c/85 · korpus §32):** `«Nima bosildi — nima bo'ldi?»` — qisqa savol; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q. Sharh ekranda turibdi — u ham namuna emas, xom material.

**106d javob (ikki tomonlama):** ✅ «Kartada fakt bor — dasturchi xuddi shu xatoni o'zida ko'ra oladi.» · 🤔 «Bu hali karta emas. Odam nimani bosdi? Keyin nima bo'lmadi? Shuni yozing.»

**Bo'sh-so'zlar ro'yxati** (106d(c), dars o'z lug'atidan): *yomon · sekin · qulay emas · ishlamaydi · xato* — matn FAQAT shulardan (harakat-fe'lsiz) iborat bo'lsa savol qaytariladi (bloklamaydi, yo'naltiradi).

**Sharhga moslik-sharti (§120):** har sharhda ikkala hukm uchun dalil-bo'lagi bor; zid tanlovda javob-qatori o'sha bo'lakni sitata qilib qaytaradi (yuqoridagi jadval). Ikkinchi urinishda ham zid bo'lsa — saqlashga ruxsat beriladi (o'quvchi artefakti — uniki), lekin 🤔 qator qoladi (56-qonun ruhi: javob ochiq).

🔴 **«nosozlik-kartasi» — ekranda «karta»** (§84/§80): sarlavhada bir marta «nosozlik-kartasiga aylantiring», qolgan hamma joyda «karta», «kartalaringiz».

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K10 · 91b/33/42/43/56 + 17-ov-band)

**Freym (91b):** eyebrow — **«🎮 Biznes olamidan mashhur voqea»**, K-kodi ekranga chiqmaydi. ❌ M3-D10 eyebrow'i («🎮 Haqiqiy voqea») takrorlanmaydi.

🔴 **M3-D10 dan farq-dalili (pasport talabi):** `PmLesson9` K10 ni **«qabul shartlari oldindan yozilmagan»** burchagida bergan: 4 slayd (chiqdi → nosoz chiqdi, ayniqsa PlayStation → bashorat «keyin nima bo'ldi?» → Sony olib tashladi, «zarar ishonchda»), bitta bashorat (do'kondagi taqdiri), ko'prik «yetishmagani — qabul shartlari», TEST-3 «eng katta yo'qotish — ishonch». Bu dars esa **SIFAT-NARX burchagi**: nosozliklar **QAYERDA tutildi** (sotib olganlar qo'lida — s4 tarozisining 3-nuqtasi) va bu **QANCHAGA tushdi** (pul qaytarish, do'kondan qariyb yarim yil yo'qlik). Bashoratlar yangi va boshqa o'lchovlarda: **kim topdi?** (joy) va **qancha vaqtga?** (muddat). Slayd-matnlar yangi; «ishonch» so'zi ballanadigan matnda YO'Q; ko'prik tarozi va navbatga qaytadi. Faktlar faqat bankdan — ikkala dars bir bankdan ichadi, lekin har biri o'z burchagini oladi.

🔴 **Bosqich-hisoblagich uzluksiz (17-ov-band):** K10 raqamsiz keys (10-qonun: raqam qo'shilmaydi) — shuning uchun jonli **raqam**-hisoblagich emas, ekranda o'zini tushuntiradigan yorliq turadi — **«Voqea — 3/6»** (§130) — va u **bashorat bosqichlarida ham** sanaydi (2/6 va 4/6) — sanoq uzilmaydi (M4-D12 K16 pretsedenti).

🔴 **2 mikro-bashorat — IKKI XIL o'lchovda (17-ov-band):** 1-bashorat **nosozliklarni kim birinchi topdi** (joy/odam-o'lchovi — tarozining o'qi) · 2-bashorat **do'kondan qancha vaqtga** (muddat-o'lchovi, zinapoya).

**6 bosqich (hikoya tilida — 42-qonun · ovoz chiqarib o'qib tekshirildi):**

1. **2020-yil dekabr.** Katta o'yin — **Cyberpunk 2077** — sotuvga chiqdi. Ichida esa juda ko'p nosozlik bor edi.
2. *(bashorat-1)* **Sizningcha, bu nosozliklarni kim birinchi topdi?**
3. **Sotib olgan o'yinchilar.** Nosozliklar odamlar qo'lida chiqdi — ayniqsa PlayStation'da o'yin aytganini qilmasdi.
4. **Odamlar pulini qaytarishni so'radi — qaytarish to'lqini boshlandi.** Sony o'yinni PlayStation do'konidan olib tashladi. *(bashorat-2)* **Sizningcha, qancha vaqtga?**
5. **Qariyb yarim yilga.** O'yin shuncha vaqt do'konda yo'q edi. Nosozlik odamlar qo'lida chiqqanda narxi shu bo'ldi.
6. **Skuter ilovasi bilan bir xil tarozi.** Cyberpunk nosozliklari yo'lning oxirgi nuqtasida — odamlar qo'lida — chiqdi, shuning uchun eng qimmatga tushdi. Endi navbatni o'zingiz qo'yasiz: qaysi nosozlik birinchi tuzatiladi.

**Bashorat-1 (2-bosqich · o'lchov: KIM/QAYERDA topildi):**
- «O'yinni yasagan jamoa, chiqarishdan oldin» *(41)*
- «Do'kon tekshiruvchilari, sotuvga qo'yishdan oldin» *(49)*
- «Sotib olgan o'yinchilar, birinchi kunlarda» ✅ *(42)*

**Bashorat-2 (4-bosqich · o'lchov: MUDDAT — zinapoya, korpus §43):**
- «Bir necha kunga» *(15)*
- «Bir oyga yaqin vaqtga» *(21)*
- «Qariyb yarim yilga» ✅ *(18)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! Sotib olgan o'yinchilar» / «🎯 Topdingiz! Qariyb yarim yilga» — quyruqsiz; adashsa «Adashdingiz — asl javob: sotib olgan o'yinchilar» / «Adashdingiz — asl javob: qariyb yarim yilga». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — to'liq nom bilan, darsga qaytadi):** 6-bosqichning o'zi (yuqorida): tarozining oxirgi nuqtasi → skuter ilovasi → navbat.

> 🔴 **10-qonun (keys-sadoqati — bank bilan solishtirildi):** bankda bor — o'yin konsollarda ko'p nosozlik bilan chiqdi · qaytarish to'lqini · Sony o'yinni PlayStation Store'dan qariyb yarim yilga olib tashladi · dekabr 2020. Shundan tashqari BIRORTA fakt, raqam va sana qo'shilmagan ✓. «Sotib olgan o'yinchilar topdi» — bank «chiqarildi va nosozliklar chiqdi, qaytarish boshlandi» deydi: nosozliklar chiqarilgandan keyin, sotib olganlarda ma'lum bo'lgani bankning o'z hikoyasi (§101 (b): keyingi slaydlar oldingisini yolg'onga chiqarmaydi).
> 🔴 **§101/§124 (chegaralangan inkor):** «hech kim oldin tekshirmagan» kabi da'vo YO'Q — bank jamoa tekshiruvi haqida jim; shuning uchun 3-bosqich faqat «odamlar qo'lida chiqdi» deydi. «Uzoq kutilgan», «millionlab», «qotib qolardi» kabi bankda yo'q tafsilotlar ishlatilmadi (M3-D10 metodist saboqi) — «o'yin aytganini qilmasdi» — s2 ta'rifining o'zi.
> 🔴 **Bashorat halolligi (17/43/64 + §102):** bashorat-1 uch variant bir o'lchovda (kim/qachon topdi), bir-birini inkor qiladi; A va B bola tajribasida «rost» bo'lib chiqmaydi (bank ularni tasdiqlamaydi, ekran ham); bashorat-2 zinapoya bitta o'lchovda (kun → oy → yarim yil), bosqich-4 muddatni AYTMAYDI — javob ekranda ko'rinmaydi. «≥2 bashorat ikki o'lchovda» ✓.
> 🔴 **§123 (bashorat-atama):** bashorat-chiplarida izohsiz atama yo'q («o'yinchilar», «jamoa», «tekshiruvchilar» — oddiy so'zlar).
> 🔴 **§100/§105 (omonim):** «konsol» so'zi darsda umuman ishlatilmaydi — bu kursda «konsol» brauzerdagi panel (M2 JS darslari); slaydda bankning aniq nomi turadi: «ayniqsa **PlayStation'da**».
> 🔴 **Ko'prik:** slot-sanog'i yo'q (63) · «tarozi» so'zi s4 da ko'rilgan predmet — o'quvchi uni ekranda ko'rgan (98a).
> 🔴 **K10 va o'smir (M3-D10 GATE S 5-qarori kuchda):** o'yin mazmuni haqida gap yo'q — nom, sana, do'kon, nosozliklar va narxi, xolos.

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · VS Code)

**Darvoza-mashq (82e):** bitta savol darsning O'Z bilimidan: **«Narx testi qizil chiqdi. Nosozlik qayerda tutildi?»** → «Dasturchi stolida, odamlarga yetmasdan» ✅ *(38)* · «Odamlar qo'lida, birinchi sharhlarda» *(36)* · «Chiqarishdan keyin, birinchi yangilanishda» *(42)*. Qulf-yorlig'i (30/83-qonun): «🔒 Avval savolga javob bering — bosing, ko'rsataman».

> 🔴 **§129 (darvoza-variantlar bir turda):** uchalasi «qayerda, qachon» juftligi — shakl-telli yo'q; uzunlik 38 · 36 · 42, tell 1.17 ✓ (eng uzuni distraktor). **§102:** B/C — s4 3-nuqtasida rost hodisalar, lekin savol «qizil chiqdi» (test = kod yozilayotgan joy) deb shart qo'ygan; s4 ni ko'rgan bola ajratadi.

**Tarif kartasi (ekranda, o'quvchiga ko'rsatiladi — §95 raqam manbasi):**

| 🛴 Skuter tarifi (namuna) | |
|---|---|
| Boshlash (qulfni ochish) | 2000 so'm |
| Har daqiqa | 500 so'm |
| Misol: 5 daqiqa | 2000 + 5 × 500 = **4500 so'm** |

**Boshlang'ich kod (ikki fayl):**

```ts
// narx.ts — skuter ijarasi narxi (so'm)
const BOSHLASH = 2000; // qulfni ochish haqi
const DAQIQA = 500;    // har daqiqa uchun

export function ijaraNarxi(daqiqa: number): number {
  return daqiqa * DAQIQA;
}
```

```ts
// narx.spec.ts — o'tgan darsdagi shakl
import { ijaraNarxi } from './narx';

describe('ijaraNarxi', () => {
  it('5 daqiqa uchun boshlash haqi bilan hisoblaydi', () => {
    // ← bu joyni siz to'ldirasiz: expect(...).toBe(...)
  });
});
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. `it` ichida `expect(...).toBe(4500)` yozilgan
2. Test avval qizil chiqdi
3. Tuzatilgach test yashil chiqdi

**To'g'ri natija:**
```ts
// narx.spec.ts
expect(ijaraNarxi(5)).toBe(4500);

// narx.ts — tuzatilgan hisob
return BOSHLASH + daqiqa * DAQIQA;
```

**YULDUZCHA:** Ikkinchi `it` yozing: 12 daqiqa uchun kutilgan narx 8000 so'm (`expect(ijaraNarxi(12)).toBe(8000)`).

**YORDAM (yechimni aytmaydi — korpus §77):** Tarif kartasidan hisoblang: boshlash haqi + daqiqalar soni × daqiqa narxi. Chiqqan sonni `toBe` ichiga yozing, keyin `npm test`.

**Tasdiq-tugmasi (korpus §93 — bajarilgan ishni nomlaydi):**
«✅ VS Code'da yozdim — test avval qizil, keyin yashil chiqdi»

> 🔴 **Pedagogik ulanish (87c):** kod — s4 tarozisining **1-nuqtasi amalda**: test kod yozilayotganda tutdi, odamlarga yetmadi. Qizil natija — «xato qildim» emas, «nosozlik tutildi» (MENTORGA bandi shuni ochiq aytadi). Boshlang'ich kodda `BOSHLASH` ishlatilmagan turadi — bola buni ko'rishi mumkin, lekin shart «test avval qizil» — ya'ni avval tekshiruv, keyin tuzatish (m4b-01 tartibi).
> 🔴 **Sanoq-mosligi (22-qonun):** tarif kartasidagi 2000/500/4500 ↔ kod ↔ shart-3 — bir xil raqamlar; 3 shart ↔ 3 RO'YXAT bandi.
> 🔴 **82(d):** kod NUSXALANMAYDI — «🔒 qo'lda yoziladi», copy/cut/paste bloklangan; sabab ochiq aytiladi. **82(b):** preview/mock-panel YO'Q · **82(c):** panel chapda, kod o'ngda · **82(e):** honor-checklist YO'Q, darvoza — yuqoridagi bitta savol.
> 🔴 **Atama-glossi:** «VS Code (kod yoziladigan dastur)» — birinchi ko'rinishda; «test» — m4b-01 ma'nosida, boshqa ma'noda 0 (glosslar-bo'limi).
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`ijaraNarxi` · `daqiqa` · `BOSHLASH`): kodda `narx`, prozada «narx» — bu darsda apostrofli so'z kodga tushmaydi.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch karta-qatori CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo-uchlik s4/s8/s9 to'plamlariga KIRMAYDI; «sifat/nosozlik/navbat» 0 |
| **s12 REFLEKSIYA** | Sarlavha: «Uch kartangizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». Yozib bo'lgach mukofot-qatori (106f-b) |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Ilova har safar aytganini qilsa — buni sifat deyiladi.» · «Nosozlik qancha kech topilsa, shuncha qimmatga tushadi.» · «Har nosozlik-kartasi nima bo'lganini, kimda va ishni to'xtatishini aytadi.» · «Birinchi — hammada ishni to'xtatadigan nosozlik tuzatiladi.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan. To'g'ri-indeks ketma-ketligi (brif): **0,3,2,1 · 1,0,2,3 · 0,2,1,3** — naqshsiz, taqsimot 3/3/3/3.

| # | Savol (qisqa) | Manba | To'g'ri idx |
|---|---|---|---|
| 1 | Sifat nima? | s2 | 0 |
| 2 | Qaysi holat — nosozlik? (yangi holat) | s2 + s3 | 3 |
| 3 | Ilova aytganini qildi, lekin yoqmadi — bu nima? | s2 | 2 |
| 4 | Nosozlik qayerda tutilsa eng arzon? | s4 | 1 |
| 5 | Nosozlik qayerda chiqsa odam ketadi? | s4 | 1 |
| 6 | Nosozlik qancha kech topilsa nima bo'ladi? | s4 | 0 |
| 7 | Nosozlik-kartasining birinchi qatorida nima yoziladi? | s8 | 2 |
| 8 | Qaysi nosozlik birinchi tuzatiladi? | s9 + s11 | 3 |
| 9 | «Ba'zilarda · noqulay» karta qaysi javonga tushadi? | s9 | 0 |
| 10 | Cyberpunk 2077 nosozliklari kimning qo'lida chiqdi? | s6 | 2 |
| 11 | Sony o'yinni do'kondan qancha vaqtga olib tashladi? | s6 | 1 |
| 12 | Narx testi qizil chiqdi — bu nima degani? | s10 | 3 |

> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q — «bug», «triage», «QA», «konsol», «reliz» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «nosozlik», «tutildi», «navbat», «javon», «do'kon» so'zlari bilan.
> 🔴 **§102 (arena ma'nodosh distraktori):** 4/5/6-savollarda «ishonch» so'zi distraktor sifatida ishlatilmaydi — u M3-D10 K10-xulosasi, bola uni «rost» deb tanlaydi. Distraktorlar — dars ichida ochiq rad etilgan holatlar (masalan 5-savolga «Kod yozilayotganda» — s4 1-nuqtasi rad etadi).
> 🔴 **§107 (arena shakl-telli):** birorta savol «Ha/Yo'q» qolipida berilmaydi — 3-savol ham holat-savoliga o'girildi («…bu nima?»), variantlari to'rtta nom-gap (eski «Yoqmagan narsa nosozlikmi?» yagona «Yo'q»ni oshkor qilardi).
> 🔴 11-savol muddatni so'raydi (bank: qariyb yarim yil), yilni emas; «2020» savol matnining o'zida turadi (M4-D2 saboqi: yod-sana bilim emas).
> 🔴 **§114:** arena-fon/dekor so'zlari shu dars lug'atidan (nosozlik · karta · tarozi · navbat · javon · skuter) — quruvchiga brifda.

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Cheap Fix!** | Nosozlik narxini uch nuqtada ko'rdingiz | 39 | s4: 3/3 nuqta ko'rildi |
| **Bug Reporter!** | Uch sharhni karta qilib yozdingiz | 33 | s8: 3/3 saqlandi |
| **Priority Call!** | To'rt kartaga to'g'ri hukm berdingiz | 36 | s9: 4/4 karta to'g'ri javonda |
| **Red to Green!** | Testni avval qizil, keyin yashil qildingiz | 42 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 33–42 belgi oralig'ida ✓ (raqamlar korrekturada Intl.Segmenter bilan qayta o'lchanadi).
> 🔴 **§100 (omonim-tekshiruvi):** «Cheap Fix», «Bug Reporter», «Priority Call», «Red to Green» — kursning texnik lug'atida boshqa ma'no bermaydi. ❌ «Bug Hunter!» (M3-D10) · «Rank Master!» (M4a-D2) · «First Green» / «Green Suite» / «Expect Master» (m4b-01) — band nomlar takrorlanmadi. «Catch» so'zi ataylab olinmadi (`try/catch` omonimi).
> 🔴 **§93 (tasdiq bajarilgan ishni aytadi):** «ko'rdingiz» (s4 da uch nuqtani ko'rdi), «yozdingiz» (s8), «hukm berdingiz» (s9 da kartani o'quvchi javonga qo'ymaydi — hukm beradi, karta o'zi tushadi), «qizil, keyin yashil qildingiz» (s10 tasdiq-tugmasi bilan bir xil ish).

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Sifat nima? | Ilova har safar aytganini qilsa — buni sifat deyiladi |
| 2 | Nosozlik nima? | Ilova aytganini qilmasa — bu nosozlik (inglizchasi — bug) |
| 3 | Yoqmagan narsa nosozlikmi? | Yo'q — ilova aytganini qilgan bo'lsa, bu nosozlik emas |
| 4 | Nosozlik narxi nimaga bog'liq? | Qancha kech topilsa, shuncha qimmatga tushadi |
| 5 | Eng arzon qayerda tutiladi? | Kod yozilayotganda — test tutadi, odam ko'rmaydi |
| 6 | Qayerda chiqsa odam ketadi? | Odamlar qo'lida — sharhlarda chiqqanda |
| 7 | Nosozlik-kartasida nima yoziladi? | Nima bosildi — nima bo'ldi · kimda · nima bo'ladi |
| 8 | Qaysi nosozlik birinchi tuzatiladi? | Hammada ishni to'xtatadigani |
| 9 | Cyberpunk 2077 nosozliklari qayerda chiqdi? | Sotib olgan o'yinchilar qo'lida (2020) |
| 10 | Nosozliklarga navbat qo'yishning inglizcha nomi? | Bug triage — birinchi hammada ishni to'xtatadigani |

> 🔴 **Korpus §20/§52📌:** 1-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil; 4-karta — s4 yakun-kartasi bilan.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (sifat ta'rifi · nosozlik · yoqmadi-farqi · narx-qoidasi · eng arzon nuqta · odam ketadigan nuqta · karta shakli · navbat qoidasi · keys-fakt · inglizcha juftlik).
> 🔴 **Inglizcha atamalar faqat 2- va 10-kartada** (bug · bug triage) — «triage» dars ichida boshqa hech qayerda yo'q (korpus §20).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Sifat — ilova aytganini qiladi»** — (1) kanonik ta'rif · (2) yoqmagan narsa nosozlik emas — ilova aytganini qilgan · (3) sinfga savol
**s5 · «Kech topilgan nosozlik qimmat»** — (1) «Nosozlik qancha kech topilsa, shuncha qimmatga tushadi» · (2) kod yozilayotganda — daqiqalar, odamlar qo'lida — ketgan odamlar · (3) savol
**s7 · «Cyberpunk misolida»** — (1) nosozliklar sotib olganlar qo'lida chiqdi (2020) · (2) narxi — pul qaytarish va do'kondan qariyb yarim yil yo'qlik · (3) savol
**s11 · «Navbat: birinchi — hammada to'xtatadigani»** — (1) ikki savol: kimda? nima bo'ladi? · (2) ikkalasi ham og'ir — Hozir; bittasi og'ir — Bugun; ikkalasi ham yengil — Keyin · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** ❌ «K10 xulosasi» → «Cyberpunk misolida».
> 🔴 **§102 (M3-D10 bilan to'qnashuv):** s7 RECAPS'da «ishonch» so'zi YO'Q — bu darsning xulosasi narx haqida.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K10** — M4b modulida ishlatilmagan (modul-ichi qoidasi, registr 4-bo'lim) ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — M4a-D2 yuk-tartiblash · M4-D15 qaror-sabab tanlovi · M4-D12 sxema-shart · **M4b-D2 nosozlik-navbati (hukm-javon)** ✓
7. Murojaat faqat siz-formada ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): skuter-ijara ilovasi — s0 dan s15 gacha; keys 91b freymi bilan kiradi va 6-bosqich ko'prigi bilan qaytadi ✓
- 95 (Toshkent o'smiri): skuterni o'zi ijaraga oladi, hisoblagichni o'zi kuzatadi ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas (grep bilan tasdiqlandi — shapka) ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m4a-02 kompilyator → m4b-02 VS Code) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat m4b-01 (`describe/it/expect/toBe`, `npm test`) + M2 arifmetikasi ✓
- 29 (kelajak-atama oqmaydi): «edge case», «chegara holat», «happy path», «error path», `toThrow`, «retention», «reliz» o'quvchi matnida **0** ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104/§119: hook ikki tanlovi teng (31 ↔ 34 belgi), payoff hech birini yolg'onga chiqarmaydi ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda 1 gap) ✓
- 92d: majburiy maydonlar faqat o'quvchida ANIQ bor ma'lumot uchun (sharh ekranda turadi; uy-vazifada «eslab qolgan holat» ham bo'ladi) ✓
- 33/17-ov: keys-ekran ≥2 bashorat IKKI o'lchovda (kim topdi · qancha vaqtga) + bosqich-hisoblagich uzluksiz ✓
- 10/§101/§124: keys-faktlar bankdan, raqamsiz keysga raqam qo'shilmagan, inkor chegaralangan ✓
- 38: boshqa darsga havola yo'q (M3-D10, m4b-01 nomi o'quvchi matnida 0; «o'tgan darsda yozgan test» — harakat-tili, dars-nomi emas) ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN o'qildi — §99–130 bilan birga):**
1. **§20/§80/§85:** «sifat» yagona bosh atama, kanonik ta'rif 4 yuzada so'zma-so'z; «triaj/triage», «QA», «reliz» o'quvchi ekranida 0 (flashcard-10 dan tashqari) ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 holat · T2 hodisa · T3 vaqt-nuqtasi · T4 «Kimda: holat») ✓
3. **§102:** distraktorlar ekranda rost bo'lib ko'rinmaydi (T2 B/C boshqa nuqtaga tegishli, savol nuqtani shart qilgan; T4 yangi holatlar) ✓
3a. **§105/§121 (kalit so'z bir ma'noda):** «test» faqat Jest-testi ma'nosida va faqat to'rt yuzada (s4 fakt-qatori · s4 ko'prigi · s10 · flashcard-5 va arena-12); ballanadigan savol-ekranlari «savol»; «tutildi» faqat nosozlik; «ishlaydi» hukm-tugmasida emas; «konsol» 0 (§100 omonimi) ✓
3b. **§106/§129 (test ko'chirma emas):** T1 yangi holatlar · T2 nuqtaga qo'llash · T3 bank-fakt + s4 hukmi · T4 yangi holatlar; kalitlar xulosa-gaplardan so'zma-so'z emas ✓
4. **§107:** to'rt testda ham ha/yo'q-savol yo'q; arena-3 ham holat-savoliga o'girildi (yagona «Yo'q» shakl-tellini bermaydi) ✓
5. **§108:** hech bir savol rostni rad ettirmaydi ✓
6. **§109:** bosh ta'rif zamon-iborasi bilan ✓
7. **§110:** mutlaq so'z bir variantdan oshmaydi; kulgili-bo'sh variant yo'q; T1 A/B, T4 B/C darsni o'qiganni mukofotlaydi ✓
8. **§111:** «degan javob» qurilmasi 0 ✓
9. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi 3-nuqtadan keyin; s9 3/4-karta izohi) ✓
10. **§114:** arena-fon so'zlari shu dars lug'atidan ✓
11. **§115:** ipuchalar bir gap-turida (savol); uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?») ✓
12. **§116:** s9 YORDAM-savoli ikkala o'lchovni qamraydi ✓
13. **§117:** metafora-so'z («tarozi») ballanadigan matnda tug'ilmaydi — s4 da ko'rinadi, keyin ko'prikda; ballanadigan matnda «tarozi» 0 ✓
14. **§118:** distraktorlarda takror cheklov-so'zi yo'q; T3 o'lchov-so'zli («eng arzon») ✓
15. **§119:** hook payoffi ikkala tanlovni rost qoldiradi ✓
16. **§120:** s8 sharhlari va s9 kartalari har hukm uchun dalil-bo'lagi bilan ✓
17. **§122/§124:** keys-raqam yo'q; inkor chegaralangan; ball-javob (T3) — bank-fakt + dars-hukmi, xulosa reveal'da ✓
18. **§123:** demo o'z qoidasidan o'tadi; bashorat-chipida izohsiz atama yo'q; hisoblagich (bosqich) bashoratni oshkor qilmaydi ✓
19. **§125:** maqsad-ekran nomlaydi, hukmni oshkor qilmaydi; hook-savol o'quvchining o'z tilida ✓
20. **§126:** «sifat» s1 da 0, s2 da tug'iladi ✓ · **§127:** T4 «Hammada» ikki variantda; T1/T2/T3 kalitda dars atamasi yolg'iz emas ✓ · **§128:** hukm-yorliqlari darak gapda («Ish to'xtaydi»), namuna (s1 demo) s8 shartidan o'tadi ✓
21. **§40:** «ilovangiz» 0 — o'quvchida ilova yo'q ✓ · **§97:** «ko'pchilik / sinf / ovozlar» o'quvchi matnida 0 ✓ · **§69:** «topilmadi / saqlanmagan / bo'sh» 0 ✓
22. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo-qator (s1) · 2 karta (s2) · 3 nuqta (s4) · 6 bosqich + 2 bashorat (s6) · 3 sharh → 3 karta (s8) · 4 karta, 3 javon (s9) · 3 shart (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
23. **Ekran-prozalari (Intl.Segmenter, korrekturadan keyin qayta o'lchandi):** s0 395 · s1 174 · s2 286 · s4 308 · s8 124 · s9 145 (+ yakun-qatori 178) · s10 209 · s12 180 grapheme (chegara 400) ✓
24. **§130:** palla-yorliqlari («Tuzatish vaqti» / «Ketgan odamlar») va keys-hisoblagichi («Voqea — 3/6») o'zini tushuntiradi; checklist mezoni so'zni emas, ma'noni so'raydi («Har kartada harakat va natija bor») ✓

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**
**(a) Umumiy:** `npm run lint:til src/4b-Modull/PmLesson16.jsx` → **0 error** shart (74 qoida).

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M4b-D2 ga tegishli):
`edge` · `chegara holat` · `happy path` · `error path` · `toThrow` · `try` (29-qonun, m4b-03) ·
`retention` · `churn` · `DAU` (M5 atamalari) ·
`triaj` · `triage` (flashcard-10 dan tashqari **0**) · `QA` · `reliz` · `deploy` · `prod` (kalka) ·
`ishonch` (ballanadigan matnda **0** — M3-D10 xulosasi) ·
`buzuq` · `buzilgan` · `g'alati` · `chala` · `shunchaki` (47-qonun) ·
`ilovangiz` (§40) · `sinadi` · `sindi` (M4a-D2 fe'li — bu darsda 0) ·
`ushlandi` · `aniqlandi` · `ilindi` (fe'l-intizomi: faqat «tutildi») ·
`konsol` (§100 — kursda brauzer paneli; keysda «PlayStation'da») · `hisobot` (o'quvchi matnida 0) ·
`qayta chiqar` (§105 — «chiqarish» faqat ilovani odamlarga chiqarish) ·
`Yakuniy test` · `testni yeching` (o'quvchi matnida «test» faqat s10) ·
`ko'pchilik` · `ovozlar` (§97) · `ball emas` · `degandingiz` (100-qonun) ·
`topilmadi` · `saqlanmagan` (§69) · `Bug Hunter` · `Rank Master` (band nishon-nomlari) ·
`Haqiqiy voqea` (M3-D10 eyebrow'i — bu darsda «Biznes olamidan mashhur voqea») ·
`nosozlik-karta` defisli shakli o'quvchi matnida faqat sarlavhada; qolgan joyda «karta» ·
`bug` ballanadigan matnda gloss bilanmi (§21 — arena/test/bashorat KODDA tekshiriladi).

---

## 13-A. METODIST-KORREKTURA (2026-08-17 · senariy-bosqichi)

> Quruvchidan OLDINGI til/pedagogika raundi. Kalit-indekslar (to'g'ri javob POZITSIYASI) **tegilmadi** —
> T1 C · T2 A · T3 B · T4 A o'z joyida qoldi; faqat MATN o'zgardi.

**A · Test-halolligi (4 tuzatish)**
1. **T1 A/B** — s2 «Yoqmadi» kartasining ikki misolini («skuter uzoqda turibdi» · «narx kecha arzonroq edi») deyarli so'zma-so'z qaytarardi: bola darsni emas, oldingi ekranni tanirdi (§106). Yangi ikkovi — s2 da ko'rilmagan, lekin s2 qoidasi ochiq rad etadigan holatlar: «har ochilganda reklama» · «safar tugagach so'rovnoma».
2. **T4-A** — s9 ning 1-kartasi bilan bir xil edi («to'lov … ijara boshlanmaydi»), ya'ni tekshiruv-mashqida hukm olgan gap ball-savoliga ko'chgan (§102 kuchaytirishi). Yangi kalit: «Hammada: ilova ochilganda oq ekran chiqadi». B ham «chek» obyektiga o'tdi.
3. **T3 savol-grammatikasi:** «…qachon **eng arzon tutilgan bo'lardi**?» bir nafasda o'qilmasdi (105b) → «…**qachon tutilsa, eng arzon bo'lardi?**» — o'lchov-so'zi joyida, variantlar tegilmadi.
4. **Arena-3** «Yoqmagan narsa nosozlikmi?» — ha/yo'q qolipi: yagona «Yo'q» javob shakldan ko'rinardi (§107) → holat-savoliga o'girildi: «Ilova aytganini qildi, lekin yoqmadi — bu nima?».

**B · Atama va omonim-intizomi**
5. **«konsol» olib tashlandi (§100):** bu kursda «konsol» — brauzerdagi panel (M2 JS darslari); keys-slaydi endi bankning aniq nomi bilan gapiradi: «ayniqsa **PlayStation'da** o'yin aytganini qilmasdi».
6. **«test» qoidasi ma'no-asosli qilib qayta yozildi:** senariy «faqat s10» der edi, lekin s4 fakt-qatori («Test tutdi»), s4 ko'prigi, flashcard-5 va arena-12 ham «test» ishlatadi — hammasi m4b-01 ma'nosida. Qoida endi MA'NOni qulflaydi (yuza-ro'yxati bilan), sanoq-yolg'oni yo'q.
7. **Nosozlik ta'rifi sinig'i:** «Aytganini qilmagan **joyi** — bunday xatoni nosozlik deyiladi» (ega bilan kesim mos emas, atama kesik qurilmada — §104) → «**Ilova aytganini qilmasa — bu xato; bunday xatoni nosozlik (inglizchasi — bug) deyiladi**». Ikkala ta'rif bir qolipda: «Ilova … qilsa / qilmasa — …». Kaskad: blok-3 EKRAN · s2 xulosa-kartasi · flashcard-2 · §104 izohi.
8. **«qayta chiqara oladi»** (s8 ✅-javob qatori) — bu darsda «chiqarish» = ilovani odamlarga chiqarish; bitta ibora ikki narsani anglatardi (§105) → «**dasturchi xuddi shu xatoni o'zida ko'ra oladi**».
9. **«kechagi hisobot» → «jamoadan kelgan ro'yxat»** (kantselyarit; o'smir «hisobot»ni maktab-hujjati deb o'qiydi) — s9 yo'riqnomasi, o'tish-gapi va izohlarida birga.

**C · Ekran-halolligi va namuna**
10. **s1 demosi darsning O'Z shartidan o'tmasdi (§128):** «Xarita skuterni ko'rsatmaydi» da harakat yo'q, s8 esa har kartadan «nima bosildi — nima bo'ldi» talab qiladi — namunani ko'chirgan bola 🤔 olardi. Yangi uchlik harakat-fe'li bilan: «Band qilish» bosilsa xato chiqadi · Sharh yozish oynasi yopilmaydi · Profil rasmi qo'yilsa yon ko'rinadi (s4 · s8 · s9 va test-to'plamlari bilan to'qnashmaydi).
11. **Checklist mezoni so'zni emas, MA'NOni so'raydi (§130):** «Har kartada «nima bosildi — nima bo'ldi»» → «**Har kartada harakat va natija bor**» (uy-vazifa RO'YXATida ham); ikki savol YORDAM chipida qoldi.
12. **Yorliqlar o'zini tushuntiradi (§130):** tarozi pallalari «Tuzatish» / «Yo'qotish» → «**Tuzatish vaqti**» / «**Ketgan odamlar**»; keys-hisoblagichi «N/6» → «**Voqea — 3/6**».
13. **Nishon-tavsifi bajarilgan ishni aytadi (§93):** «To'rt kartani javonlarga to'g'ri **qo'ydingiz**» → «To'rt kartaga to'g'ri **hukm berdingiz**» — javonga kartani mexanika tushiradi, o'quvchi hukm beradi.
14. **YULDUZCHA ichki havolasi olib tashlandi:** «s2 dagi «Ishlamadi» holatini» (bola ekran-raqamini bilmaydi) → holat o'z so'zi bilan: «"Tugatish" bosilganda hisoblagich to'xtamagan holat».

**D · Mentor-diyeta, belgi-taqiq, so'z-tanlov**
15. **s4 mentorida belgi-formula bor edi** (ETALON 43): «kod → chiqarish → odamlar» → «**Ilova odamlarga yetguncha uch nuqtadan o'tadi.**» — strelka ketdi va yo'lning o'zi glossga aylandi («chiqarish» nima ekani shu gapdan ko'rinadi). Fakt-qatorida «Tuzatish **+** yangilanish» → «va».
16. **s4 sarlavhasi atamani harakatdan OLDIN aytardi** («nosozlik **narxini** toping») → «**Tekshiruvni yo'lning uch joyiga qo'yib ko'ring.**» — narx-qoidasi yakun-kartada tug'iladi (§104/§126), sarlavha esa aniq harakatni aytadi.
17. **s10 mentori chigal edi** («testni kod yozilayotgan joyga qo'yasiz» — mavhum) → ikki aniq gap: kim nima yozdi va siz nimani tekshirasiz.
18. **Mayda til-sayqali:** «Skuterni QR bilan» → «QR **kod** bilan» · s0 payoffida «**ilova** buni bilmaydi, u odamlarni ko'radi» (jonlantirish) → «**ilovani yasagan jamoa** buni bilmaydi — u faqat kamayib borayotgan odamlar **sonini** ko'radi» · s1 «ilovadagi» → «**skuter** ilovasidagi» · s8 sarlavhasi «Uch sharhni» → «**Har** sharhni» (kartalar bittalab yoziladi) · s9 3-kartasi «pastga uzoq **aylantiriladi**» → «uzoq pastga **surish kerak**» · s9 sabab-qatorlari bir qolipga tushdi («ikkalasi ham og'ir / bittasi og'ir / ikkalasi ham yengil») · s9 yakun-qatori javon-qoidasini so'z bilan ochadi («yo hammada, yo ishni to'xtatadigani») · uy-vazifada «bitta kartaga **navbat qo'yasiz**» (navbat bitta kartaga qo'yilmaydi) → «qaysi **javonga** qo'yishni belgilaysiz» · flashcard-10 aylanma javob berardi («navbat qo'yish qanday ataladi? — navbat qo'yish») → inglizcha nom + ma'no · s15 4-qatori tugal gapga o'girildi.

**E · Qayta o'lchandi (Intl.Segmenter):** ekran-prozalari **s0 395 · s1 174 · s2 286 · s4 308 · s8 124 · s9 145** (+ yakun-qatori 178) **· s10 209 · s12 180** (chegara 400 ✓) · variant-telllari **T1 1.03 · T2 1.05 · T3 1.20 · T4 1.20 · darvoza 1.17 · bashorat-1 1.20 · hook 1.10** (chegara 1.4 ✓); bashorat-2 zinapoyasi 15/21 belgi (§43 — qisqadan uzunga, ataylab) · nishon tavsiflari **33–42 belgi** ✓. `node til-lint.mjs pm-senariylar/M4b-D2-Sifat.md` — **0 error / 2 warn** (warn'lar senariy-annotatsiyasidagi «YADRO» blok-nomiga tegishli).

---

## 14. ⚠️ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq, 2026-08-17)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi.

1. 🔴 **DARS SARLAVHASI VA SUB.** `App.jsx` `m4b-02`: title «Sifat — mahsulot qiymati» · sub «bug va retention bog'liqligi». «retention» — M5 atamasi (29-qonun), «bug» — glosssiz. **Taklif:** title → **«Bitta xato — nechta odam ketadi?»** (o'quvchi-savoli shaklida) · sub → **«nosozlik qayerda tutilsa — shuncha arzon»**. Tasdiqlaysizmi?

2. 🔴 **BOSH ATAMA «SIFAT» + KANONIK TA'RIF.** «Ilova har safar aytganini qilsa — buni sifat deyiladi» — «aytganini qilish» iborasi o'smirga tanish (odam aytganini qiladi/qilmaydi), «kutilganidek ishlash» kalkasidan qochildi. Rozimisiz — yoki «va'da qilganini qilsa» kabi boshqa fe'l izlansinmi?

3. 🔴 **s4 IMZO — TEKSHIRUV-BELGISINI YO'LGA QO'YISH.** Pasportdagi «SIFAT-TAROZI — bug-narxi ko'rsatkichi» tarozi sifatida bajarildi; unga **harakat** qo'shdim: o'quvchi 🧪 belgini yo'lning uch nuqtasidan biriga qo'yib «Chiqaramiz»ni bosadi, nosozlik yuradi, tarozi narxni ko'rsatadi; uch nuqta ham ko'rilishi kerak. Sabab: tarozini shunchaki ko'rish qaror emas — «tekshiruvni qayerga qo'yaman?» darsning amaliy savoli va m4b-01 (test) bilan to'g'ridan-to'g'ri ulanadi. Tasdiqlaysizmi — yoki tarozi faqat ko'rsatkich bo'lib, nuqtalar bosib ochilsinmi?

4. 🟡 **TAROZI O'LCHOVLARI.** Chap palla «bir necha daqiqa / bir kun / haftalar», o'ng palla «0 odam / 0 odam / ketgan odamlar» — demo-qiymatlar, ekranda «namuna» belgisi bilan (§95). Aniq raqam (ketgan odam soni) ataylab yo'q — bankdan tashqari raqam to'qilmaydi. Tasdiqlaysizmi?

5. 🔴 **ARTEFAKT SHAKLI.** `pm-m4b2-sifat = { kartalar: [ {nima, kimda: 'hammada'|'bazilarda', oqibat: 'toxtaydi'|'noqulay'} × 3 ], savedAt }`. Keyingi PM dars (M4c-D2) o'qishi shart emas — modul-chegara; shakl shu ko'rinishda muhrlansinmi?

6. 🟡 **s8 — SHARHDAN KARTAGA.** O'quvchi «nima bo'ldi»ni tayyor sharhdan o'z so'zi bilan yozadi (tanlamaydi), «Kimda?»/«Nima bo'ladi?» ni ikki tugmadan tanlaydi; qoida-tekshiruv sharhga moslikni yumshoq tutadi. Sabab: 2-TUR darsida artefakt o'quvchining o'z matni bo'lishi kerak; sharh — real PM ish-materiali. Rozimisiz — yoki uchala maydon ham erkin matn bo'lsinmi?

7. 🟡 **s9 JAVONLARI — «Hozir · Bugun · Keyin».** Ikki hukmdan javon o'zi chiqadi (ikkalasi og'ir → Hozir; bittasi → Bugun; hech biri → Keyin). 3- va 4-kartalar ikkalasi «Bugun»da — ataylab: o'quvchi «ikkalasidan qaysi biri?» deb so'raganda MENTORGA javobi «bir javon, tartibi jamoa qarori». Rozimisiz — yoki to'rt karta to'rt xil o'ringa tushsinmi (unda ikkinchi o'lchov kerak bo'ladi)?

8. 🟡 **UY-VAZIFA O'Z TELEFONIGA CHIQADI.** To'liq variant: o'quvchi o'zi ishlatadigan ilovadan nosozlik topib karta yozadi (yoki eslab qolgan holatdan); qisqa — uch kartasidan birinchisini belgilaydi. Sabab: nosozlik-kartasi — o'z olamida qo'llasa bo'ladigan ko'nikma; M4-D7 «o'z telefoni» pretsedenti. Rozimisiz — yoki M4a-D2 kabi uy-vazifa demo-olamda (skuter ilovasining to'rtinchi kartasi) qolsinmi?

9. 🟢 **K10 BURCHAGI VA BASHORATLAR.** M3-D10 «shartlar oldindan yozilmagan → do'kondan olib tashlandi» burchagida ishlatgan; bu dars «nosozlik qayerda tutildi → narxi» burchagida, bashoratlar «kim topdi?» va «qancha vaqtga?». Bankdan tashqari fakt yo'q. Shu chegara yetarlimi — yoki keysni yana torroq olaylikmi (masalan faqat 4–6 bosqich)?

10. 🟢 **«test» SO'ZI FAQAT JEST-TESTI MA'NOSIDA.** Ballanadigan savol-ekranlarini o'quvchi matni «savol» deb ataydi, eyebrow «To'g'ri javobni tanlang» o'zgarmaydi; «Yakuniy test» kabi yorliq ekranga chiqmaydi. Sabab: m4b-01 da «test» = Jest-testi. Rozimisiz? (Qaysi yuzalarda turishi — 13-savolda.)

11. 🟢 **KODING — «avval qizil, keyin yashil» tartibi.** Boshlang'ich kodda nosozlik ko'rinib turadi (`BOSHLASH` ishlatilmagan); shart baribir «test avval qizil chiqdi» — o'quvchi avval testni yozadi, keyin tuzatadi. Sabab: darsning o'zagi — nosozlik testda tutiladi (1-nuqta). Rozimisiz — yoki nosozlik yashirinroq qilinsinmi (masalan `+ BOSHLASH` o'rniga `+ 200`)?

**Metodist raundi qo'shgan savollar (2026-08-17 · 13-A bo'lim):**

12. 🔴 **IKKI TEST DISTRAKTORI ALMASHDI.** T1 ning A/B variantlari s2 kartasining misollari edi, T4 ning kaliti esa s9 1-kartasining takrori — ikkalasi ham «oldingi ekranni tanigan bola»ni mukofotlardi (§102/§106). Yangi holatlar: T1 — «har ochilganda reklama» va «safar tugagach so'rovnoma»; T4 — «ilova ochilganda oq ekran chiqadi». To'g'ri javob POZITSIYASI o'zgarmadi. Tasdiqlaysizmi?

13. 🟡 **«TEST» SO'ZI s4 DA HAM TURADI.** Eski qoida «faqat s10» der edi, lekin s4 ning 1-nuqta fakt-qatori («Test tutdi») va m4b-01 ga ko'prigi («o'tgan darsda o'zingiz yozgan test») aynan shu so'zsiz ishlamaydi. Qoida ma'noga bog'landi: «test» — faqat Jest-testi, to'rt yuzada. Rozimisiz — yoki s4 fakt-qatori «Tekshiruv tutdi» bo'lib, «test» faqat ko'prik va s10 da qolsinmi?

14. 🟡 **TAROZI YORLIQLARI.** «Tuzatish» / «Yo'qotish» mavhum edi (nima yo'qoladi?) → «**Tuzatish vaqti**» / «**Ketgan odamlar**»: yorliq o'lchovni o'zi aytadi va fakt-qatorlari bilan bir tilda gapiradi (§130). Tasdiqlaysizmi?

15. 🟢 **BASHORAT-2 M3-D10 BILAN KESISHADI.** «Do'kondan qancha vaqtga?» javobi («qariyb yarim yilga») M3-D10 ning 4-slaydida FAKT sifatida aytilgan — o'sha darsni o'tgan bola bashoratni eslab topishi mumkin (bashorat ballanmaydi, lekin kashfiyot kuchsizlanadi). Shunday qoldiramizmi — yoki 2-bashorat boshqa o'lchovga o'girilsinmi (masalan «pulini qaytarib so'raganlar nima qildi?»)?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (0–130, §99–130 bilan) · MATN_ETALONI (lug'at + 7-B) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2/R3 pasporti, Batch 3) bo'yicha yozildi. `pm-metodist` SENARIY-KORREKTURA bajarildi (2026-08-17 · 13-A bo'lim). Keyingi qadam: **[GATE S]** — 14-bo'lim savollari (1–15).*

## ✅ [AVTO-GATE S] YOPILDI — 2026-08-17 (foydalanuvchi avtokontrol-ruxsati asosida, bosh-agent; pretsedent-oila: Batch 2 / M4c-D2 avto-GATE S)

1. **App.jsx karta TASDIQ:** title **«Bitta xato — nechta odam ketadi?»** · sub **«nosozlik qayerda tutilsa — shuncha arzon»** («retention/bug» ketdi; bosh-agent kiritdi).
2. **«Sifat» kanonik ta'rifi TASDIQ:** «Ilova har safar aytganini qilsa — buni sifat deyiladi» (fe'l, o'smir-tanish ibora).
3. **s4 HARAKATLI IMZO TASDIQ** — 🧪 belgini uch nuqtaga qo'yish + «Chiqaramiz» (harakat-blok qonuni; uch nuqta ham ko'rilishi shart, tugma navbat kelganda ochiladi).
4. **Tarozi demo-o'lchovlari TASDIQ** («namuna» belgisi bilan, bankdan tashqari raqam yo'q).
5. **Artefakt MUHR:** `pm-m4b2-sifat = { kartalar: [{nima, kimda:'hammada'|'bazilarda', oqibat:'toxtaydi'|'noqulay'}×3], savedAt }` (modul-chegara — keyingi dars o'qimaydi).
6. **s8 sharhdan-kartaga TASDIQ** («nima» erkin matn, «kimda/oqibat» ikki tugma; qoida-tekshiruv yumshoq, §120 dalil telefonga bog'langan).
7. **s9 javonlari TASDIQ** (Hozir·Bugun·Keyin; 3-4-kartalar bitta javonda — mentor-javobi «tartibi jamoa qarori»).
8. **Uy-vazifa o'z telefoniga TASDIQ** (M4-D7 pretsedenti; qisqa variant — o'z 1-kartasi).
9. **K10 SIFAT-NARX burchagi TASDIQ** (M3-D10 dan farq-dalili 6-bo'limda; «ishonch» ballanadigan matnda 0).
10. **«test» = faqat Jest-testi TASDIQ**, ballanadigan ekranlar «savol»; **13-savol:** ma'no-qoidasi (4 yuza: s4 fakt-qatori «Test tutdi», m4b-01 ko'prigi, flashcard-5, s10) QOLADI — «Tekshiruv tutdi» rad (m4b-01 ko'prigi shu so'zsiz ishlamaydi).
11. **Koding «avval qizil, keyin yashil» TASDIQ** (nosozlik ko'rinib turadi — darsning o'zagi tutish, yashirish emas).
12. **T1/T4 distraktor-almashuvi TASDIQ** (§102/§106; pozitsiyalar o'zgarmagan).
14. **Tarozi yorliqlari «Tuzatish vaqti» / «Ketgan odamlar» TASDIQ** (§130).
15. **Bashorat-2 («qancha vaqtga?») QOLADI** — bank atigi 3 fakt beradi (nosozlik konsollarda · qaytarish to'lqini · do'kondan ~yarim yil), boshqa halol o'lchov yo'q; bashorat ballanmaydi; M3-D10 4 oy oldin o'tilgan. Quruvchiga: chip-matnlari M3-D10 s6 dagi so'zlardan FARQ qilsin (grep), «yarim yil» chip eng uzun/yagona shakl bo'lmasin; reveal ohangi «eslasangiz — M3 da ham shu voqea edi» deb ko'prik beradi (§112). 🟢 foydalanuvchiga savol-ro'yxatiga yozildi (bloklamaydi).
16. Registr yangilanadi (bosh-agent): SIFAT-TAROZI · NOSOZLIK-NAVBATI · skuter · K10 · artefakt.
