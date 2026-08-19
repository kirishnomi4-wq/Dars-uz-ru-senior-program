# M5-D8 — Botingizni ishlatgan odamdan nimani so'raysiz? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/5-Modull/PmLesson20.jsx` (hozirgi `-v16` chala avlod BUTUNLAY almashadi;
> yangi `lessonId: pm-m5d8-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 **BATCH 4** — yo'lakchadan chiqilmadi.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 5 — «Telegram bot + AI» (oy 10–11) · modul g'oyasi: «Bot — ishlaydigan mahsulot; uni odamlar ishlatadi» |
| **Dars** | M5-D8 (modulning 8-darsi, ikkinchi PM darsi) · `key: m5-08` |
| **Mavzu** | Custdev (mijozni o'rganish): odamning oldiga borib, uning bo'lib o'tgan ishini so'rash; qaysi savol ish beradi, qaysi savol quruq «ha» olib keladi; eshitganini o'z so'zi bilan yozib olish |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi uchta savol yozadi, ularni jonli odamga beradi va eshitganini yozadi; artefakt = matn (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | 🏠 **K4 — AIRBNB** (`PM_Prompt_v8` bank). Burchak: **«o'sish to'xtaganda asoschilar odamlarning oldiga o'zlari borgan»** (Nyu-York, uy-ma-uy yurish, uylarni o'zlari suratga olish, yomon surat topilmasi). Registr 3-bo'limi K4 ni ikki darsga bergan: **m5-08 (odamning oldiga borib so'rash)** va **m7-03 (muammo izlash)** — burchaklar ayri: m7-03 boshlanishni (havo to'shak → muammo qayerdan topiladi) oladi, M5-D8 esa faqat **o'sishdan keyingi Nyu-York bo'lagini** oladi; havo to'shak bu darsda bitta kirish-gapida, hodisa-freymi sifatida turadi. Zaxira ilgak KERAK EMAS — keys mavzuga halol yopishadi |
| **ISHLATILGAN_KEYS** | **K4** · M5 ichida band: m5-02 → K8 (META, tor auditoriya) · m5-11 → K5 (Duolingo). K4 M5 da birinchi marta — modul-ichi qoidasi bajarildi ✓ |
| **Keys-raqamlari** | Bankda K4 — **«raqamsiz»** belgili keys. Shuning uchun darsda K4 ga tegishli birorta o'lchov-raqami YO'Q va **jonli son-hisoblagichi ham YO'Q** (M4-D7 / M4c-D6 pretsedenti). Yagona sana — **2007-yil** (bank uni voqea bilan birga bergan) · «uchta havo to'shak» — bankdagi hikoya-detali, o'lchov emas |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | m5-02 → «kanal-funnel» (Batch 4, parallel) · m4c-06 → «signal-saralash» · m4c-02 → «haftaga-sig'dirish darvozasi» · m4b-02 → «nosozlik-navbati» · M4a-D2 → «yuk-tartiblash» · M4-D15 → «qaror-sabab tanlovi» · M4-D12 → «sxema-shart tekshiruvi». **M5-D8 = «SAVOL-ELAK» — har savol ikki to'siqli elakdan tushadi va o'quvchi uni QAYSI to'siq ushlab qolganini nomlaydi** (26/59-qonun; to'liq farq-dalili 1-bo'lim va 8-bo'lim izohida) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq: story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «GAPSIZ KO'RSATUV» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «UCH QAVAT KESIMI» · «YUK-SINOVI» · «SIFAT-TAROZI» · «RELIZ-TASMASI» · «O'LCHAGICH-PANELI» · «BIRINCHI 20» (m5-02, parallel) · «juftlik-lenta» (M2-D2) · «TUSHUNISH CHIZIG'I» (M2-D13) · Hotspot · Timeline · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · xabardan ortiqcha qatorni olib tashlash · yuk-tartiblash · sxema-shart tekshiruvi · qaror-sabab tanlovi · bug-triaj/nosozlik-navbati · haftaga-sig'dirish darvozasi · signal-saralash · so'z-elagi (M2-D13) · ro'yxat-tozalash (M2-D2) · kanal-funnel (m5-02) · pitch-oilasi ro'yxati |
| **Misol-ip (91/108 + 95 + 96c)** | 🤖 **O'quvchining O'Z Telegram-boti** — M5 da o'zi qurgan bot (m5-03 `BotApiButtons` da Telegraf bilan yozgan, m5-07 da to'liq yig'gan). 95-qonun: bot uning o'z ishi, u har kuni Telegramni ochadi ✓ · 96c: ip o'quvchining ARTEFAKTIDA — pasport aynan shuni belgilagan; suhbatdosh nomi `pm-m5d2-yigirmata` dagi `kanallar[].kim` dan o'qiladi, yo'q bo'lsa **«sinfdosh»** (shu darsning o'z zaxira-nomi, jim — §69). 96c(e) to'qnashuv-grep: `src/` da bosh-misol sifatida Telegram-boti faqat **M5 ning o'z texnik darslarida** (`BotIntro` · `BotApiButtons` · `BotStatefulMemory` · `BotAiBrain` · `BotFullProject` · `BotFeedbackIteration` · `BotAiAgent`) — ya'ni modulning O'Z mahsuloti (96-qonun modul-ipi), boshqa PM darsining bosh-misoli EMAS; K13 «Telegram tezligi» keysi m4c-02 da — u **keys**, olam emas ✓. Band olamlar (lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · maydoncha · musiqa ilovasi · maktab jurnali · kutubxona · AvtoStoyanka · konsert-chipta · skuter-ijara · sinfdosh-poyga · o'quvchining Netlify-sayti) — birortasi emas ✓ |
| **Kirish-artefakt** | `pm-m5d2-yigirmata` = `{ kanallar: [ { kanal, kim, nechta } × 3 ], savedAt }` — m5-02 chiqishi (bosh-agent muhri; shakl O'ZGARTIRILMAYDI). Undan **`kim`** ustuni olinadi: o'quvchi kimni tanlashini shu ro'yxatdan ko'radi. O'qiladigan ikki joy: **s4** (suhbatdosh yorlig'i — `kanallar[0].kim`) va **s8** (sarlavha ostidagi bir qatorlik tasma). m5-02 (`PmLesson19`) shu batchda qayta quriladi va kalitni YOZADI — demak asosiy yo'l = **artefakt BOR** tarmog'i. 🔴 **Jim zaxira:** o'quvchi m5-02 ni o'tkazib yuborgan bo'lsa kalit bo'lmaydi — o'shanda tasma render bo'lmaydi, yorliq «sinfdosh» deb turadi, mentor-gapning ikkinchi tarmog'i chiqadi. «Topilmadi / saqlanmagan» matni **YO'Q** (§69). 🔴 m5-02 o'quvchi matnida bu ro'yxat «joy» so'zi bilan atalgan (`kanal` — faqat kalit-nomi), shuning uchun M5-D8 ekranida «kanal» so'zi **0**: o'quvchi faqat odamlar ro'yxatini ko'radi |
| **Chiqish-artefakt** | 🔴 `pm-m5d8-javoblar` = `{ javoblar: [ { savol, eshitgan } × 3 ], savedAt }` (bosh-agent muhri) · `savol` — o'quvchi yozgan savol · `eshitgan` — odam aytgan gap, o'quvchi yozib olgan holda. m5-11 (`PmLesson21`, qaytish-kalendari) shu uch javobni kirish sifatida o'qiydi |
| **Yordamchi kalitlar** | `pm-m5d8-hook-choice` (faqat YOZILADI — 100c) · `pm-m5d8-stol` (s4 holati: berilgan savollar + yozuv-tanlovi) · `pm-m5d8-elak` (s9 to'rt qaror) · `pm-m5d8-code` · `pm-m5d8-reflection` · `pm-m5d8-hw-target` · `ccProgress` · **o'qiladi:** `pm-m5d2-yigirmata` |
| **Koding** | ⌨️ **VS CODE** — R1 navbati (registr: m5-02 kompilyator → **m5-08 VS Code**). Senariy buni o'zgartirmaydi. Fayl `suhbat.js`, terminal `node suhbat.js` — o'quvchi O'Z uch javobini kodga qo'yib chiqaradi |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — B3 senariylari bilan bir xil yakun-tuzilma |

**Takror-xavfi — farq-dalillari (majburiy, uchta qo'shni dars):**

- 🔴 **↔ M1-D2 «Auditoriya» (`pm-senariylar/M1-D2-Auditoriya.md`):** u darsda o'quvchi auditoriyani **TA'RIFLAYDI** — KIM/MUAMMO/YECHIM kartasini yozadi, TEKSHIRUV = Hotspot («kartadagi buzuq bo'lakni bosing»), odamdan so'rash faqat UY VAZIFASIDA va bitta yopiq savol bilan («Siz shunday saytga kirarmidingiz?»). M5-D8 da o'quvchi hech kimni ta'riflamaydi: u **sinfda jonli suhbat o'tkazadi**, savol TURINI ajratadi va eshitganini yozib oladi. Keys ham ayri: M1-D2 → K8 META, M5-D8 → K4 Airbnb ✓
- 🔴 **↔ M2-D2 «Muammodan yechimga»:** u yerda muammo **o'ylab topiladi** (qiyinchilik ↔ imkoniyat juftlanadi), TEKSHIRUV = «ro'yxat-tozalash» (qiyinchiligi yo'q band javonga). M5-D8 da hech narsa juftlanmaydi va hech narsa javonga chiqmaydi: savol **elakdan tushadi** va o'quvchi uni ushlab qolgan **to'siqni nomlaydi**. Keys ayri (K1 UZUM ↔ K4) ✓
- 🔴 **↔ M2-D13 «so'z-elagi»:** obyekt — tayyor GAP ichidagi **so'z**; harakat — so'zni bosib belgilash va ostiga sodda almashtiruvchi so'z chiqarish; mezon — so'z tinglovchiga tanishmi. **«Savol-elak»da obyekt — butun SAVOL**, harakat — savolni elakka tushirib, uni ushlagan to'siqni tanlash, mezon — **ish allaqachon bo'lganmi**; natija — almashtiruvchi so'z emas, savolning suhbat varag'iga tushishi. Hech qanday so'z chizilmaydi va almashtirilmaydi ✓

**Atama-glosslar (62/39-qonun + korpus §20 — avval hodisa, keyin nom):**

- 🔴 **«custdev», «intervyu», «insayt», «pain», «segment», «respondent», «gipoteza», «skript», «yetaklovchi savol», «gipotetik/faraziy savol», «xushomad» ekranga CHIQMAYDI** (pasport taqig'i + korpus §20). Inglizcha nom faqat flashcard-10 ning JAVOB tomonida, alohida gap bo'lib turadi: «Kattalar bu ishni inglizcha «custdev» deb atashadi» (§132: savol-tomonida o'rgatilmagan inglizcha nom so'ralmaydi; §133: qavs-gloss emas, alohida gap). «Mijoz» so'zi bilan tarjima qilinmaydi — 95-qonun bo'yicha u o'quvchi matnida umuman yo'q. Dars nomidagi «Custdev» faqat `App.jsx` kartasida qoladi va u ham 14-bo'limda qayta yoziladi;
- 🔴 **«suhbat» — darsning yagona bosh nomi.** Kanonik ta'rif dars bo'ylab AYNAN bir xil: **«Odamning oldiga borib, bo'lib o'tgan ishini so'rash — suhbat»** (§109: zamon-iborasi «bo'lib o'tgan», yasama ot emas). Shu ta'rif s2 xulosasi · flashcard-1 · RECAPS s3 · s15 yakun-ro'yxatida so'zma-so'z. So'z o'smirga tanish (suhbat, suhbatdosh) va bu darsda **faqat shu ma'noda** yashaydi;
- 🔴 **«voqea savoli»** — s4 **yakun-kartasida** tug'iladi (hodisa avval — to'rt javob eshitilgan, nom keyin). Kanonik: **«Bo'lib o'tgan ishni so'ragan savol — voqea savoli»**. Javobida kun, joy yoki qilingan ish bo'ladi;
- 🔴 **«bo'sh savol»** — o'sha yakun-kartada, voqea savoli bilan juft tug'iladi. Kanonik: **«Javobidan bo'lib o'tgan ish bilinmaydigan savol — bo'sh savol»**. «Bo'sh» o'smirga «bo'sh gap» orqali tanish. ❌ «yomon savol» (baho beradi), ❌ «noto'g'ri savol» (o'quvchi xatosidek eshitiladi);
- 🔴 **«eshitgan javob»** — s4 **yakun-kartasida**, ikkinchi bosqich hodisasidan keyin tug'iladi: **«Odam aytgan gapni o'z so'zi bilan yozib qo'ysangiz — bu eshitgan javob»**. Bu gap yakun-kartada AYNAN shu shaklda turadi (avvalgi tahrirda atama hech bir ekranda ta'riflanmay qolgan edi, s8/koding/flashcardda esa ishlatilardi). Qoida-shakli: **«Eshitganingizni yozing, o'ylaganingizni emas.»**;
- 🔴 **§121 ildiz-tozaligi (majburiy grep):** **«bo'sh»** ildizi darsda FAQAT «bo'sh savol / bo'sh javob» ma'nosida yashaydi — o'quvchi matnida «bo'sh joy», «bo'sh maydon», «bo'sh varaq» YO'Q (→ «to'ldirilmagan», «hali yozilmagan»). **«voqea»** ildizi faqat «bo'lib o'tgan ish» ma'nosida — shuning uchun keys eyebrow'i «mashhur voqea» EMAS, **«🏠 Biznes olamidan»** deb yoziladi. **«suhbat»** ildizi faqat darsning o'z ma'nosida (suhbat · suhbatdosh);
- 🔴 **Fe'l-intizomi (korpus §80):** odam **aytadi / eslaydi / ko'rsatadi**, siz **so'raysiz / eshitasiz / yozib olasiz**, savol **beriladi**, javob **keladi**, savol elakdan **o'tadi** yoki to'siqda **qoladi**. ❌ «so'rov o'tkazish», «fikr yig'ish», «ma'lumot to'plash» (idoraviy shakl, korpus §82), ❌ «tadqiqot», ❌ «anketa / so'rovnoma»;
- ❌ **«mijoz», «biznes egasi», «foydalanuvchi tadqiqoti»** — 95-qonun: Toshkent o'smiri bunday odam bilan uchrashmaydi. Suhbatdoshlar uning o'z doirasidan: **sinfdosh · to'garakdosh · qo'shni · aka-opa**;
- ❌ **«metrika», «retention», «kuniga nechta»** — m5-11 ning atamalari (29-qonun), bu darsda 0;
- ❌ **«savol shabloni», «5 savol»** — eski `-v16` faylning tuzilishi (o'sha yerda 8 dan 5 tasini tanlash mexanikasi bor edi). Yangi darsda savol soni **uchta** va shablon berilmaydi.

🔴 **§40 darvozasi:** o'quvchida bot BOR (m5-03/m5-07) — dars bo'ylab **«botingiz»**. Suhbatdosh esa hali uniki emas: s4 da u **«suhbatdoshingiz»** emas, **«suhbatdosh»** deb ataladi (stol darsniki), «savollaringiz» esa faqat s8 dan keyin ishlatiladi. Sayt-havolasi, bot-nomi, foydalanuvchi soni **hech qayerda so'ralmaydi** (92d).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «INTERVYU-STOLI»** (senariy-ichi nom; ekranga CHIQMAYDI — o'quvchi «stol» va «suhbatdosh»ni ko'radi). 23-qonun: registr 5-bo'limidagi birorta band vizual klonlanmaydi.

Ekran ikki tomonli. **O'ngda** — stol ortidagi suhbatdosh kartasi: yumaloq avatar-belgi 👤 va ostida bitta yorliq (`kanallar[0].kim` dan: «sinfdosh» · «to'garakdosh» · «qo'shni»; kalit yo'q bo'lsa **«sinfdosh»**). Uning tepasida hali yozilmagan gap-pufak turadi. **Chapda** — to'rtta savol-kartasi, ustma-ust.

**1-bosqich — savol berish va javobni eshitish.** O'quvchi savol-kartasini bosadi → karta stolga «qo'yiladi» → gap-pufakda javob **jonli yozilib chiqadi** (~1,2 s; `prefers-reduced-motion` da darhol to'liq chiqadi). Javob to'liq chiqqach, uning ostida bitta **bilingan-qatori** ochiladi (korpus §95 — har xulosa nimadan chiqqani ko'rinib turadi):

| # | Savol-kartasi | Suhbatdosh javobi | Bilingan-qatori |
|---|---|---|---|
| 1 | «Botim yoqdimi?» | «Ha, zo'r ekan!» | Hech narsa bilinmadi — u qilgan biror ishini aytmadi |
| 2 | «Botga eslatma tugmasi qo'shsam, ishlatasizmi?» | «Ha, ishlataman.» | Bu hali qilinmagan ish — javobi va'da bo'ldi |
| 3 | «Uy vazifasini oxirgi marta qachon unutgansiz?» | «O'tgan payshanba. Ertalab guruhni ochsam, vazifa kechqurun yozilgan ekan.» | Payshanba kuni ham, o'sha kuni bo'lgan ish ham aytildi |
| 4 | «O'sha kuni vazifani qanday topdingiz?» | «Guruhdagi xabarlarni yuqoriga surib qidirdim, o'n daqiqa ketdi.» | Vazifani hozir qanday topayotgani ko'rindi |

**Hisoblagich (17-ov b · uzluksiz):** stol tepasida bitta yorliq — «Berilgan savol · 1/4» … «4/4». Javob chiqqanda ham, yozuv-bosqichida ham raqam yo'qolmaydi.

**2-bosqich — eshitganini yozib olish** (to'rtala savol berilgach ochiladi — 94-qonun progressiv ochilish). Ekranga bitta karta chiqadi: 3-javob **so'zma-so'z qaytariladi** («O'tgan payshanba. Ertalab guruhni ochsam, vazifa kechqurun yozilgan ekan.») va uch qator taklif qilinadi — o'quvchi bittasini varaqqa yozadi:

| Qator | Bosilgandagi javob |
|---|---|
| «Sinfdoshlarim vazifani ko'p unutadi» | 🤔 Buni u aytmadi — bitta odam aytgan gapni hammaga yoydingiz |
| **«Payshanba kuni vazifani unutgan — kechqurun yozilgan ekan»** ✅ | ✅ Aynan shu — odamning o'z gapi |
| «Botga eslatma tugmasi kerak» | 🤔 Bu sizning xulosangiz — u tugma haqida hech narsa demadi |

Uchala qator ham bosilishi mumkin (61/106d: javob DOIM ochiladi, hech biri bloklamaydi); to'g'ri qator tanlangach yakun-kartasi ochiladi (69-qonun — xulosa, maqtov emas):

> **Bo'lib o'tgan ishni so'ragan savol — voqea savoli.** Uning javobida kun ham, qilingan ish ham bo'ladi. **Javobidan bo'lib o'tgan ish bilinmaydigan savol — bo'sh savol.** Odam aytgan gapni o'z so'zi bilan yozib qo'ysangiz — bu **eshitgan javob**. Varaqqa xulosangiz emas, aynan shu tushadi.

🔴 **Atama-tartibi (§104/§126):** 1-bosqichda ham, 2-bosqichda ham «voqea savoli», «bo'sh savol», «eshitgan javob» so'zlari YO'Q — u yerda faqat hodisa tili («u qilgan biror ishini aytmadi», «javobi va'da bo'ldi»). Uchala atama ham **yakun-kartasida**, ko'rilgan hodisadan keyin tug'iladi.

🔴 **Rang-qonuni (palitra-pasporti):** bilingan-qatori topilma bo'lsa `success` yashil, bo'lmasa **neytral indigo** — qizil YO'Q (bo'sh savol o'quvchining xatosi emas, darsning o'zi). 2-bosqichdagi noto'g'ri qatorlar ham indigo. `err` rangi bu darsda umuman ishlatilmaydi. 🔴 **§134:** rang holati hech bir test yoki arena variantida ishlatilmaydi — ranglarning ma'nosi o'quvchi matnida o'rgatilmagan.

🔴 **Nima uchun aynan shu:** «yaxshi savol / yomon savol» qoidasini o'qib tushunib bo'lmaydi — u faqat **javobni eshitganda** bilinadi. Bola savolni o'zi tanlaydi, javob ko'z oldida yozilib chiqadi va u «bu javobdan menga nima qoldi?» degan savolga o'zi javob beradi. To'rt savol ketma-ket berilgach farq o'z-o'zidan ko'rinadi: ikkitasidan kun va harakat qoldi, ikkitasidan bir og'iz «ha». Ikkinchi bosqich esa darsning ikkinchi yarmini ochadi — eshitilgan gap varaqqa qanday tushadi.

🔴 **Mexanika-farqi (26/59-qonun):** m5-02 da o'quvchi **kanallarni taqsimlaydi** (funnel); m4c-06 da **signalga yo'l tanlaydi**; m4b-02 da **kartani javonga qo'yadi**; M4a-D2 da **surmani suradi**. Bu yerda o'quvchi **savol beradi va javobni eshitadi** — boshqa obyekt (jonli javob), boshqa harakat (savol tanlash), boshqa maqsad (javobdan nima qoldi). Hech narsa saralanmaydi, tartiblanmaydi, juftlanmaydi va o'chirilmaydi.

🔴 **Kashfiyot-himoyasi:** 1-bosqichda 40–45 soniya harakatsizlikdan keyin bitta qoida-ipuchasi: «Qolgan savollarni ham bering — javoblarni solishtiring» — «voqea savoli» va «bo'sh savol» bu bosqichda hali tug'ilmagan (§104); javobni AYTMAYDIGAN shakl (korpus §77).

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi B3 senariylaridagidek — etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Botingizni ko'rsatsangiz, u nima deydi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — varaqning uch qatori o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — stol ortida o'ylash ↔ odamning oldiga borish | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **INTERVYU-STOLI** (4 savol + yozuv-tanlovi) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | BIZNES OLAMIDAN — K4 Airbnb (4 slayd + 2 bashorat) | 3 | — | keys-slayd qolipi |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 savol + eshitgan javob** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **SAVOL-ELAK** (4 savol, ikki to'siq) | 5 | — | 🔴 yangi mexanika |
| s10 | KODING — suhbat varag'ini chiqaradigan kod (VS Code) | 6 | — | 26/82/87-qonun · VS Code + terminal |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ustaxona», «keys», «elak-mexanikasi», «INTERVYU-STOLI» so'zlari o'quvchi ekranida YO'Q** (korpus §84) — senariy-ichi nomlar. s9 da o'quvchi ekranda **elak**ni ko'radi va «elak» so'zini o'qiydi — u vizualning o'z nomi, mexanika-nomi emas.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 5 — Telegram bot + AI
DARS: M5-D8 (8-dars)
DARS_MAVZUSI: Odamning oldiga borib bo'lib o'tgan ishini so'rash; voqea savoli va bo'sh savol; eshitganini o'z so'zi bilan yozib olish
ISHLATILGAN_KEYS: K4
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Botingizni yozib bo'ldingiz va uni yoningizdagi odamga ko'rsatdingiz.
U nima deydi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: ikkala javobdan ham botga nima
qo'shish kerakligi bilinmaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkalasi ham halol javob. Payoff «nima qo'shish
kerakligi bilinmaydi» degan joyda to'xtang: bugungi dars aynan shu bo'shliqni
to'ldiradi.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 🙂 «Zo'r ekan» deydi — meni xafa qilgisi kelmaydi | 46 |
| 🤔 Bir-ikki kamchilik aytadi — to'g'risini aytadi | 46 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham bo'ladi. Lekin ikkala javob ham bot haqidagi gap: odam o'zi nima qilganini aytmadi. Shuning uchun botga nima qo'shish kerakligi ikkalasidan ham bilinmaydi. Bugun bilib olasiz: shu odamdan nimani so'rasangiz, javobi ish beradi.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsa (o'quvchining o'z boti, yonidagi odam) + harakat-fe'l («ko'rsatdingiz», «nima deydi») + o'quvchining o'z holatidan o'sadi (botni u o'zi yozgan). Ovoz chiqarib o'smir og'zidan: «botimni ko'rsatsam, nima deydi?» — tabiiy.
> 🔴 **104-qonun + korpus §119:** to'g'ri javob YO'Q — payoff ikkala tanlovda bir xil va hech birini yolg'onga chiqarmaydi: «zo'r ekan» degan bola ham, «kamchilik aytadi» degan bola ham o'zini xato deb topmaydi (kamchilik aytilganda ham u bot haqidagi fikr bo'lib qoladi). «To'g'ri sezdingiz…» yozilmaydi.
> 🔴 **100-qonun:** tanlov `pm-m5d8-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62/126-qonun:** «suhbat», «voqea savoli», «bo'sh savol» atamalari bu ekranda YO'Q — s2/s4 da ochiladi.
> 🔴 **Spoyler-taqiq:** payoff «bilinmaydi» deydi — QANDAY so'rash kerakligini aytmaydi; s2/s4 kashfiyoti butun qoladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ekran-o'lchovi:** savol + payoff = **323 grapheme** proza (chegara 400) ✓.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida sizda bitta varaq bo'ladi: uchta savol va odamdan
eshitgan uchta javob.
HARAKAT: O'quvchi kuzatadi: hali yozilmagan varaqqa uch qator o'z-o'zidan yozilib
chiqadi, har birining yoniga belgi qo'yiladi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Varaq yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

**Demo-uch qator (o'z-o'zidan yozilib chiqadi) — strelkali juftlik, ustun-sarlavhasiz (korpus §67d):**

| Ekranda ko'rinadigan qator |
|---|
| 1-savol → eshitgan javob ✅ |
| 2-savol → eshitgan javob ✅ |
| 3-savol → eshitgan javob ✅ |

> 🔴 **39/62/126-qonun:** s1 da «suhbat», «voqea savoli», «bo'sh savol» so'zlari **0** — atamalar o'z ekranida ochiladi; demo faqat natijani NOMLAYDI (korpus §125: «Sahifa — ko'rsatadi» naqshi), savol matnini ham, javob matnini ham aytmaydi — ular s4 va s8 kashfiyoti.
> 🔴 **Spoyler-taqiq:** demo-qatorlar s4 ning to'rt savolini va s9 to'rtligini TAKRORLAMAYDI.
> 🔴 **§128 (namuna o'z qoidasidan o'tadi):** demo qatorlari — shakl-namuna, matn-namuna emas; o'quvchi ularni s8 ga ko'chira olmaydi (ularda savol matni yo'q), shuning uchun s8 ning saqlash-sharti bilan to'qnashmaydi.
> 🔴 **40-qonun / korpus §40:** «sizda … varaq bo'ladi» (artefakt); «savollaringiz» hali yo'q — u s8 dan keyin.
> 🔴 **42-qonun:** «o'z-o'zidan yozilib chiqadi»; **54(b/c):** `ta-sub` ikkinchi qator YO'Q, demo ostidagi caption YO'Q.
> 🔴 **Ekran-o'lchovi:** proza **84 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (suhbat stoli) + 3 × Quiz
EKRAN: Odamning oldiga borib, bo'lib o'tgan ishini so'rash — suhbat deyiladi.
Suhbatda siz odamning fikrini emas, bo'lib o'tgan ishini so'raysiz.
(Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) to'rt savolni birma-bir berib
javoblarni eshitadi, keyin eshitganini varaqqa qaysi qator bilan yozishni tanlaydi;
(s6) Airbnb hodisasini bashorat bilan ochadi.
JAVOB: s4 — 3- va 4-savol javobida kun va qilingan ish bor; 1- va 2-savoldan hech
qanday ish qolmaydi. Yozuv-tanlovi: odamning o'z gapi yoziladi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar odatda 1-savoldan boshlaydi va «ha, zo'r» javobiga kuladi.
To'rttasi ham berilgach so'rang: qaysi ikki javobdan payshanba kuni chiqdi? Voqea
savoli va bo'sh savol farqini shu yerda ular aytsin, siz aytmang.
```

**s2 — TEORIYA-1: stol ortida o'ylash ↔ odamning oldiga borish** (korpus §73: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Botingizga nima kerakligini kim biladi?»**

Mentor (≤2 gap, 32b):
> Ikki kartani bosib solishtiring — javob qayerda turganini ko'rasiz.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 💭 **Stol ortida** | Botga qanday tugma kerakligini o'zingiz o'ylab topasiz. Tugma tayyor bo'lgandan keyin bilasiz: uni hech kim bosmagan |
| 🚶 **Odamning oldida** | Botni ishlatgan odamdan o'tgan hafta nima qilganini so'raysiz. Javobida kun ham, qilingan ish ham chiqadi |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif):
> **Odamning oldiga borib, bo'lib o'tgan ishini so'rash — suhbat deyiladi.** Suhbatda siz odamning fikrini emas, bo'lib o'tgan ishini so'raysiz.

> 🔴 **39-qonun qolipi:** avval hodisa (ikki karta), keyin «… suhbat deyiladi». Sarlavhada yangi atama YO'Q ✓ (§126: bosh atama s1 da emas, s2 da tug'iladi).
> 🔴 **§104:** ta'rif-gap to'liq (hodisa → nom → nima ekani), kesik qurilma emas.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan.
> 🔴 **§121:** «o'ylab topasiz» — bu darsda «o'ylash» faqat shu ma'noda (javobni odamsiz chiqarish); «o'ylab ko'ring» kabi ko'rsatma o'quvchi matnida ishlatilmaydi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **246 grapheme** proza (karta matnlari — mashq-materiali) ✓.

**s4 — YADRO: INTERVYU-STOLI** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Savolni tanlang va javobni eshiting.»**

Mentor (1 gap — 92a/ETALON 32: savol-kartalari va stol ekranda ko'rinib turibdi):
> Stol ortida suhbatdosh o'tiribdi, chapda to'rt savol.

> 🔴 **98b:** mentor qaysi savol ish berishini AYTMAYDI — bilingan-qatori javobdan keyin chiqadi, o'quvchi o'qiydi.
> 🔴 **106d/71:** har savolda javob darhol: gap-pufak va bitta bilingan-qatori — o'quvchi «bu javobdan menga nima qoldi?» savoliga javobni o'qiydi. Bilingan-qatori hodisani aytadi («u qilgan biror ishini aytmadi») — QOIDA («bo'lib o'tgan ishni so'rang») ekranda yakun-kartagacha yozilmaydi (§106).
> 🔴 **72-qonun:** savol-kartalari — yurish naqshi (berilmaganlar navbat bilan yonadi, berilgani navbatdan chiqadi); 2-bosqichdagi uch qator — to'lqin (88a1: bittasi tanlanadi, teng emas).
> 🔴 **§95:** 2-bosqichda 3-javob so'zma-so'z qaytariladi — o'quvchi yozayotgan qatorini ekranda turgan gap bilan solishtiradi, xotiradan emas.
> 🔴 **§104/§126:** «voqea savoli», «bo'sh savol», «eshitgan javob» ikkala bosqichda ham YO'Q — uchalasi yakun-kartasida tug'iladi.
> 🔴 **§133 (fe'l ikki ma'noli bo'lmasin):** «savol o'tdi» iborasi bu ekranda ishlatilmaydi — «o'tish» faqat s9 elagining fe'li; s4 da «savol berildi» deyiladi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + yakun-karta = **370 grapheme** ✓ (javoblar, bilingan-qatorlar va uch yozuv-qatori — mashq-materiali).

**s6 — BIZNES OLAMIDAN:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Uchta savolingizni yozing.
(mentor, 1 gap · artefakt bor) Tepadagi ro'yxatdan bitta odamni tanlang — uchta
savolni o'shanga berasiz.
(mentor, 1 gap · artefakt yo'q) Yoningizdagi odamlardan birini tanlang — uchta savolni
o'shanga berasiz.
HARAKAT: Uchta savolni BITTALAB yozadi. Har kartada: savolni yozadi, savolni
yonidagi odamga beradi, eshitgan javobini o'sha zahoti yozadi. Saqlaganda qator o'ngdagi
varaqqa ko'chadi va yangi karta keladi.
JAVOB: Uchala savol bo'lib o'tgan ishni so'raydi (qachon, qanday, oxirgi marta);
har javobda odamning o'z gapi bor (kun, joy yoki qilingan ish); «kerak», «yaxshi
bo'lardi», «muhim» kabi xulosa javob emas.
RO'YXAT: Uch savol yozilgan · Savol bo'lib o'tgan ishni so'raydi · Har javob
odamning o'z gapi
YULDUZCHA: Uch javobingizni qayta o'qing: ikkitasida bir xil narsa takrorlanganmi?
Topganingizni bir qatorda yozing.
YORDAM: Savolingizni «Oxirgi marta qachon …?» yoki «O'sha kuni qanday
qildingiz?» deb boshlang.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda: uchta savolingizni yoningizdagi odamga berasiz, keyin o'rin
almashasiz. Javobni yozayotganda odamning o'z so'zini o'zgartirmang.
MENTORGA: «Yoqdimi?», «Kerakmi?» kabi savollar ko'p chiqadi — eng foydali xato.
Javob-qatori uni tutadi; siz s4 dagi 1-savol javobini eslating: «Ha, zo'r ekan».
Juftlik almashinuvini o'zingiz boshqaring — har o'quvchiga 3 daqiqadan.
```

🔴 **Kirish-artefakt tarmog'i (korpus §69 — ikki tarmoq bir shaklda, bir uzunlikda; mentor pufagi AYNAN shu bitta gap — ETALON 32):**
- **Artefakt BOR (`pm-m5d2-yigirmata`) — asosiy yo'l:** sarlavha ostida bir qatorlik tasma — «👥 Siz yozgan odamlar: sinfdosh · to'garakdosh · qo'shni» (`kanallar[].kim`, uzuni qisqartirilib; §95 — ro'yxat qayerdan kelgani aytiladi) + mentor: «Tepadagi ro'yxatdan bitta odamni tanlang — uchta savolni o'shanga berasiz.» *(78)*
- **Artefakt YO'Q:** tasma render bo'lmaydi, oradagi joy yopiladi; mentor: «Yoningizdagi odamlardan birini tanlang — uchta savolni o'shanga berasiz.» *(76)*
- 🔴 «topilmadi / saqlanmagan / hali yozmagansiz» so'zlari **0** · yo'qlik haqida gap YO'Q — jim zaxira (pasport talabi).
- 🔴 **Tasma — 92b:** yig'ilgan bir qator (faqat `kim` qiymatlari), to'liq jadval EMAS; u ko'prik, ish-materiali emas — o'quvchi unga hech narsa yozmaydi.
- 🔴 **Ikki tomonlama shart (F-0803-22-B):** kalit va shakl bosh-agent muhridan (`{ kanallar: [{kanal, kim, nechta}×3], savedAt }`); m5-02 shu batchda AYNAN shu shaklni yozadi — demak asosiy yo'l artefakt BOR tarmog'i, YO'Q tarmog'i esa m5-02 ni o'tkazib yuborgan o'quvchi uchun jim zaxira bo'lib turadi. 🔴 m5-02 o'quvchi matnida bu ro'yxat «joy» deb ataladi (`kanal` — kalit-nomi, ekranda yo'q): shu darsda ham «kanal» so'zi ishlatilmaydi, tasma faqat odamlarni ko'rsatadi.

🔴 **Yozish-kartasi (80b) — bitta karta, uch savol uchun uch marta:**

| Qadam | Kartada nima turadi | Ipucha (placeholder — korpus §32: qisqa savol, tayyor javob YO'Q) |
|---|---|---|
| ① Savol (matn) | — | `Nimani so'raysiz?` |
| ② Bering | «Savolni o'qib bering» tugmasi — bosilganda karta o'qish holatiga o'tadi (92e) | — |
| ③ Eshitgan javob (matn) | — | `U nima dedi?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12; 106d ikki tomonlama):**
- ✅ savol bo'lib o'tgan ishni so'raydi + javobda kun/joy/qilingan ish bor → «✅ Savolingiz bo'lib o'tgan ishni so'radi, javobda odamning o'z gapi turibdi.»
- 🤔 savol «-mi?» bilan tugaydi va javobi «ha/yo'q» bo'ladi → «Bunga odam "ha" deb qo'ya qoladi. Bo'lib o'tgan ishni so'rang: oxirgi marta qachon?»
- 🤔 savol hali qilinmagan ish haqida (*qo'shsam · bo'lsa · kelasi · keyin*) → «Bu ish hali bo'lmagan — javobi va'da bo'ladi. Allaqachon bo'lgan kunni so'rang.»
- 🤔 eshitgan javob o'rniga xulosa yozilgan (*kerak · muhim · yaxshi bo'lardi · qulay · zarur*) → «Bu sizning xulosangiz. Odam aytgan gapni o'z so'zi bilan yozing.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **Belgi-lug'ati** (qoida-asosidagi tekshiruv — 106d(c), dars o'z so'zlaridan): bo'lib o'tgan ish belgilari: *qachon · oxirgi marta · o'sha kuni · qanday qildingiz · nima qildingiz*; hali bo'lmagan ish belgilari: *qo'shsam · bo'lsa · kelasi · keyin · ishlatasizmi*; xulosa-so'zlari: *kerak · muhim · yaxshi bo'lardi · qulay · zarur*. Checklist yorlig'ida o'quvchi ko'radigan matn — **«Savol bo'lib o'tgan ishni so'raydi»** va **«Har javob odamning o'z gapi»** (ikkalasi ham 5 so'z — ETALON 25) (§130: mezon AYNAN so'zni emas, MA'NOni so'raydi — bola «qachon» so'zini ko'chirish shart deb o'qimasin). Yordam chipida ikki savol turadi: «Bu ish allaqachon bo'lganmi?» · «Bu gapni odam aytdimi, siz chiqardingizmi?»

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **101 grapheme** (artefakt bor, ustiga tasma 55) / **99** (artefakt yo'q) ✓ — javob-qatorlar harakatdan keyin, bittadan chiqadi.

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (savol-elak — ikki to'siqli elak)
EKRAN: (topshiriq) Har savolni elakdan o'tkazing.
(yo'riqnoma) Elakda ikki to'siq bor: ish allaqachon bo'lganmi? Javobni odam
o'zi aytadimi?
HARAKAT: To'rt savolni BITTALAB elakka tashlaydi; har birida uch tugmadan birini
bosadi: «Ish hali bo'lmagan», «Javob savolning ichida», «O'tdi — varaqqa».
Har tanlovdan keyin javob va bir qatorlik sabab ochiladi; oxirida to'rttasi
xulosa-tasmada.
JAVOB: 1) «Botni oxirgi marta qachon ochgansiz?» → O'tdi · 2) «Botga o'yin qo'shsam,
ko'proq ishlatasizmi?» → Ish hali bo'lmagan · 3) «Guruhda vazifani topish qiyin,
shundaymi?» → Javob savolning ichida · 4) «O'sha kuni vazifani qanday topdingiz?»
→ O'tdi
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Ikki savol bering: bu ish allaqachon bo'lganmi?
Javobni savolning o'zi aytib turibdimi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Eng ko'p adashiladigan joy — 3-savol: «vazifa topish qiyin-ku, to'g'ri
aytilgan». Ikkinchi savolni eslating: javobni savolning o'zi aytib turibdimi? Ha —
demak odam faqat «ha» deydi.
```

**To'rt savol (yangi to'plam — o'quvchining o'z uch savoli EMAS):**

| # | Savol-kartasi | To'g'ri yo'l | Javob ochilgandagi sabab-qatori |
|---|---|---|---|
| 1 | «Botni oxirgi marta qachon ochgansiz?» | ⬇️ O'tdi | Bo'lib o'tgan kun so'raldi — odam kunni o'zi aytadi |
| 2 | «Botga o'yin qo'shsam, ko'proq ishlatasizmi?» | ⏳ Ish hali bo'lmagan | Bu o'yin hali qo'shilmagan — javobi va'da bo'ladi |
| 3 | «Guruhda vazifani topish qiyin, shundaymi?» | 🗣 Javob savolning ichida | Javob savolda yozib qo'yilgan — odam «ha» deb qo'ya qoladi |
| 4 | «O'sha kuni vazifani qanday topdingiz?» | ⬇️ O'tdi | Bo'lib o'tgan ish so'raldi — odam qadamlarini o'zi aytadi |

O'tish-gap (22-qonun — yangi to'plam ochiq aytiladi, mentor 1 gap):
> Uch savolingiz varaqda tayyor — endi yangi to'rt savolni elakdan o'tkazamiz.

Yakun-qatori (xulosa-tasma ostida):
> ✅ **Elakdan faqat bo'lib o'tgan ishni so'ragan savol o'tadi. Qolgani javob emas, bir og'iz «ha» olib keladi.**

> 🔴 **26/59-qonun — farq-dalili (pasport talabi):** «tekshiruvchi stoli» (M3-D2) tayyor kartaga ✓/✕ hukm beradi (ikki natija, baho); «ro'yxat-tozalash» (M2-D2) bandni javonga chiqaradi (ikki natija, olib tashlash); «signal-saralash» (M4c-D6) har xabarga yo'l tanlaydi (ikki manzil, ikkalasi ham yaroqli); «so'z-elagi» (M2-D13) gap ichidagi so'zni belgilab almashtiradi; «nosozlik-navbati» (M4b-D2) navbat quradi; «kanal-funnel» (m5-02) odamlarni kanalga taqsimlaydi. Savol-elakda esa uch natija bor va o'quvchi baho bermaydi — u savolni QAYSI TO'SIQ ushlab qolganini nomlaydi; ushlangan savol ham o'chirilmaydi, ham javonga chiqmaydi — u elak ustida sababi bilan ko'rinib turadi. Boshqa obyekt (butun savol), boshqa harakat (to'siqni nomlash), boshqa maqsad (savolni berishdan oldin uni tekshirish).
> 🔴 **§120 (material har shart uchun bitta javobni himoyalaydi):** har savol to'liq yozilgan va uchala to'siqqa birma-bir solinadi; 3-savolda «shundaymi?» so'zi ochiq turibdi (s4 da bola «Ha, zo'r ekan» javobini bir marta ko'rgan), shuning uchun «bu ham bo'lib o'tgan ish-ku» degan yon-mantiq materialdan yiqiladi.
> 🔴 **§107:** natijalar 2 o'tdi / 2 qoldi, qolgan ikkitasining to'sig'i har xil; tartib naqshsiz.
> 🔴 **§116:** YORDAM ikkala to'siqni ham qamraydi (bo'lganmi? · javob savolda turibdimi?) — to'rtala savolning har biriga to'g'ri yo'lni beradi.
> 🔴 **106d + korpus §77/§98:** noto'g'ri tanlovda javob DOIM ochiladi: «🤔 Bu ish allaqachon bo'lgan — savol o'tadi» / «🤔 Javob savolda yozilgan emas — odam kunni o'zi aytadi»; YORDAM faqat birinchi xatodan keyin.
> 🔴 **61-qonun:** tugmalar baho EMAS (✓/✕ emas) — uch harakat-nomi.
> 🔴 **106f(c):** sinf ish-tartibi `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **108 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code + terminal — R1 navbati)
EKRAN: (sarlavha) Suhbat varag'ini chiqaradigan kod yozamiz.
(mentor, 2 gap) Uch javobingiz endi kodda turadi. Siz bitta sikl va bitta if
yozasiz.
HARAKAT: VS Code'da suhbat.js faylini ochadi, massivga O'Z uch javobini yozadi,
sikl bilan har qatorni chiqaradi, qisqa javobga belgi qo'yadigan if ni yozadi va
terminalda `node suhbat.js` bilan ishga tushiradi.
JAVOB: Terminalda uch qator chiqadi: «1) savol → eshitgan javob»; eshitgan javobi
25 belgidan qisqa bo'lganiga «⚠️ qisqa javob» belgisi qo'shiladi.
RO'YXAT: node suhbat.js uch qatorni chiqaradi · Har qatorda savol va javobi ·
Qisqa javobga belgi qo'yildi
YULDUZCHA: Qisqa javoblarni sanab boring va oxirida bitta qatorda chiqaring: «n ta
javob qisqa».
YORDAM: Avval bitta qatorni chiqarib ko'ring: javoblar[0].savol. Ishlagach siklni,
keyin if ni qo'shing.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Javoblari hali to'liq yozilmagan bolalar boshlang'ich koddagi namuna
qatorni qoldiradi — kod baribir ishlaydi. Javob matnini doim qo'shtirnoq (")
ichida yozishni ayting: bitta tirnoq (') ichidagi apostrof kodni sindiradi.
```

> 🔴 **87-qonun (o'tilgan texnik material):** massiv va obyekt (m2-06 `JsFunctions`), `for` sikli va `.length` (m2-05 `JsLoops`), `if`, `console.log`, matn qo'shish `+`, `node fayl.js` (M4) — hammasi o'tilgan. `for...of`, `map`, shablon-satr topshiriqqa KIRMAYDI.
> 🔴 **§134 (senariy taqiq-so'zi §112 ko'prigidan kuchli):** ko'prik texnik atama ustida emas, tanish BUYRUQ ustida quriladi — «Kodni `node` buyrug'i bilan ilgari ham yurgizgansiz» ✓; «server», «skript», «konsol» so'zlari o'quvchi matnida 0.
> 🔴 **26-qonun / R1:** m5-02 kompilyator → m5-08 VS Code — registr navbati, senariy o'zgartirmaydi.
> 🔴 **Korpus §19/§48:** sarlavha «…digan kod yozamiz» oilasidan, natijani aytadi.
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»).
> 🔴 **87c (halol ulanish):** PM qoidasi kodda haqiqiy shartga aylanadi — «javob qisqa bo'lsa, undan bo'lib o'tgan ish bilinmaydi» qoidasi `if` bo'lib yoziladi, o'ylab topilgan bog'lanish emas.
> 🔴 **40-qonun (3 holat sinovi):** massiv boshlang'ich kodda bitta to'liq namuna qator bilan keladi — o'quvchi javoblari hali yozilmagan bo'lsa ham kod ishlaydi va natija chiqadi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **112 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uchta savolingizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan ayting: qaysi savolingizdan eng aniq javob keldi va
o'sha javobda nima bor edi? Avval sherigingizga ayting, keyin bir qatorda yozing.
HARAKAT: (s11) yakuniy testga javob beradi; (s12) juftlikda aytadi va bir qator
yozadi; (s14) 10 ta takrorlash kartasini o'zi tekshiradi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uchdan biri «javobda nima bor edi» savoliga javob berolmasa — s4 ekranini
qayta oching va 3-savol javobini birga o'qing.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — **«O'zingizni sinab ko'ring.»**
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, keyin bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **106f(b):** yozib bo'lgach mukofot: «Endi siz odam nima deydi deb o'ylab o'tirmaysiz — borib so'raysiz» + qoida-qatori «🎯 Bugungi qoida: bo'lib o'tgan ishni so'rang, eshitganingizni o'z so'zi bilan yozing».
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **193 grapheme** ✓.

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda o'sha uch savolni yana boshqa odamlarga berasiz va eshitganingizni
o'sha zahoti yozib olasiz. Keyin ikki varaqni yonma-yon qo'yib, takrorlangan
gapni topasiz. Qaysi variantni olishni o'zingiz tanlaysiz.
HARAKAT: Uch savolni yangi odamlarga beradi, har javobni odamning o'z so'zi bilan
yozadi va ikki varaqda takrorlangan bitta gapni belgilaydi.
JAVOB: —
RO'YXAT: Yangi javoblar yozilgan · Har javobda odamning o'z gapi ·
Takrorlangan gap belgilangan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Uch savolni yana bitta odamga bering va eshitganingizni yozib oling;
sinfdagi javoblar bilan solishtirib, takrorlangan bitta gapni belgilang.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Uyda odam topolmaganlar sinfdagi boshqa juftlikdan so'raydi — qoida o'sha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «ikki odam», «bitta odam» faqat To'liq/Qisqa kartalarida.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — savol berish s8 da, eshitganini yozish s4/s8 da bajarilgan.
> 🔴 **92d:** uyda odam topolmagan o'quvchi devorga urilmaydi — kartada bitta qator: «Uyda odam topolmasangiz — sinfdagi boshqa juftlikdan so'rang».
> 🔴 **Korpus §125:** kuzatiladigan hodisa aytiladi («takrorlangan gapni topasiz»), mavhum «e'tibor bering» emas.

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
MAVZU: Suhbat nima va u qayerda o'tadi (odamning oldida); voqea savoli va bo'sh
savol; javobda kun va qilingan ish bo'lishi; «ha» olib keladigan savol; eshitgan
javobni odamning o'z so'zi bilan yozish; bir odam aytgan gapni hammaga yoymaslik;
Airbnb asoschilari Nyu-Yorkda nima qilgani va nimani topgani; suhbatni kimdan
boshlash.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §110 (mutlaq so'z ≤1) · §118 (cheklov-so'zsiz) · §127 (atama ≥2 variantda yoki hech birida) · §129 (kalit xulosadan so'zma-so'z emas) · §133 (tinish-shakl telli yo'q) · §134 (rang-holati distraktorda yo'q · savol soni kalitda qaytmaydi). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🗣 Sinfdoshingiz botingizni ko'rib «Zo'r ekan» dedi. Bundan nimani bilib oldingiz?
- A. Bot unga yoqqanini — endi shu yo'ldan ketaverasiz *(49)*
- **B.** Hech narsani — u qilgan biror ishini aytmadi ✅ *(44)*
- C. Botni ishlatib ko'rganini — shuning uchun maqtadi *(49)*

**Reveal:** To'g'ri — maqtov gapida odamning o'zi qilgan biror ish yo'q.

> 🔴 **§129:** s2 xulosasi ta'rifni aytadi, hook payoffi «bilinmaydi» deydi — savol esa VAZIYATNI beradi va bola qoidani QO'LLAYDI: gapda ish bormi yo'qmi. Kalit so'zma-so'z ko'chirma emas.
> 🔴 **§102:** A — hook payoffi ochiq rad etadi (ikkala javobdan ham nima qilish kerakligi bilinmaydi) — darsni o'qiganni mukofotlaydi; C — «maqtadi, demak ishlatgan» xulosasi ishonarli, lekin darsning o'zi rad etadi: maqtov gapida qilingan ish yo'q. Uzunlik: 49 · 44 · 49 (tell 1.11, to'g'ri javob eng uzun emas) ✓.
> 🔴 **§127:** darsning birorta atamasi («suhbat») variantlarda YO'Q — kalit-so'z bilan topib bo'lmaydi ✓.
> 🔴 **§110:** mutlaq so'z («hech narsani») bitta variantda ✓. **§133:** uchala variant bir tinish-qolipda («… — …»).

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** ⏳ «Kelasi haftadan botni ishlatasizmi?» — bu savolga javob qanday bo'ladi?
- A. O'tgan haftada qilgan ishi haqida gap bo'ladi *(45)*
- **B.** Hali qilmagan ishi haqida va'da bo'ladi ✅ *(39)*
- C. Botni ochgan aniq kun va soat bo'ladi *(37)*

**Reveal:** To'g'ri — hali bo'lmagan ish haqida odam faqat va'da bera oladi.

> 🔴 **§106/§129:** s4 da 2-savolga «Ha, ishlataman» javobi kelgan edi; test YANGI savol (kelasi hafta) beradi va javobning TURINI so'raydi — qoida (voqea savoli / bo'sh savol) reveal'da va s4 yakun-kartasida qoladi, savolda emas.
> 🔴 **§127/§121:** darsning birorta atamasi variantlarda YO'Q — «voqea» ildizi ham olib tashlandi (u darsda faqat «voqea savoli» atamasida yashaydi); uchala variant ham hodisa tilida ✓.
> 🔴 **§102:** A — s4 ning 3-javobi shaklidagi gap, lekin o'sha savol uchun rost, bu savol uchun emas; C — 1-savol javobiga o'xshaydi, ishonarli, yolg'on. Uzunlik: 45 · 39 · 37 (tell 1.22) ✓.
> 🔴 **§99:** uchalasi ham «javob qanday bo'ladi?» savoliga bir turdagi gap bilan javob beradi.

### TEST-3 (s7 — s6 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🏠 Airbnb asoschilari uy egalarining oldiga borib nimani bilib oldi?
- A. Uy egalari narxni juda baland qo'yib yuborganini *(48)*
- **B.** Yomon surat qo'yilgan uy band qilinmasligini ✅ *(44)*
- C. Uy egalari saytga kam kirib turishini *(37)*

**Reveal:** To'g'ri — buni ular uzoqdan emas, uy egalarining yonida turib bilishdi.

> 🔴 **§124 (ball-javob sof bank-fakti):** to'g'ri javob bankdagi faktning o'zi (asoschilar yomon suratlar band qilishni to'xtatayotganini o'zlari, joyida aniqlagan) — bank-ro'yxatdan chiqarilgan XULOSA emas ✓.
> 🔴 **§106:** savol slaydni takrorlamaydi — slayd-4 topilmani aytadi, test esa uni HARAKATga bog'laydi («oldiga borib nimani bilib oldi») va uchta ishonarli topilmadan tanlatadi.
> 🔴 **§102:** A va C — bank aytmagan, lekin sayt haqida o'ylaganda tabiiy tuyuladigan sabablar; ikkalasi ham slayd-4 tomonidan ochiq rad etiladi ✓. Uzunlik: 48 · 44 · 37 (tell 1.09) ✓.
> 🔴 **§122:** keys-raqami yo'q — zo'rlash imkoni ham yo'q.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Kartochka (49-qonun — faqat tahlil-material):**
> Suhbatdosh: «Kecha kechqurun botni ochdim, lekin tugmani topolmay chiqib ketdim.»

**Savol:** 📝 Qaysi qator varaqqa tushadi?
- A. Botning tugmalarini qayta joylash kerak *(39)*
- **B.** Kecha tugmani topolmay chiqib ketgan ✅ *(36)*
- C. Odamlar kecha tugmani topa olmadi *(33)*

**Reveal:** To'g'ri — varaqqa odamning o'z gapi tushadi; nima qilish kerakligini keyin o'zingiz hal qilasiz.

> 🔴 **§134 (kalitda savolning so'zi qaytmasin — chegaralangan tatbiq):** bu darsda kalit odamning gapini QAYTARISHI pedagogik talab («eshitganingizni yozing»). Shu sababli echo-yo'li boshqacha yopilgan: **«tugma» so'zi UCHALA variantda ham bor** (§127 himoyasi) va kalit kartochkadagi gapning so'zma-so'z nusxasi emas — u uchinchi shaxsga o'girilgan («chiqib ketdim» → «chiqib ketgan»). Bola so'zni emas, GAP EGASINI tanlaydi.
> 🔴 **§102:** A — s4 ning 2-savoli («eslatma tugmasi qo'shsam…») ochiq rad etadi: odam tugma haqida hech narsa demagan; C — bitta odam aytgan gapni hammaga yoyish, s4 ning 2-bosqichida ochiq rad etilgan ✓.
> 🔴 **§133 (xulosa-bandi keyingi test kaliti bo'lmasin):** s4 yakun-kartasining oxirgi gapi («Varaqqa esa odam aytgan gap tushadi…») bilan bu test bir mavzuda — shuning uchun test o'sha gapni SO'RAMAYDI, balki YANGI materialga (kecha kechqurun, tugma) qo'llatadi. Uzunlik: 39 · 36 · 33 (tell 1.18, to'g'ri javob eng uzun EMAS) ✓. 🔴 **§134 (kalitda savol-so'zi qaytmasin):** «kecha» endi ikki variantda (B va C) — avval u faqat kalitda turib, so'z-telli bo'lib qolgan edi.

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan.

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — «1 · 2 · 3»: yozilgani yashil ✓, joriysi indigo miltillashda, kelgusi kulrang-punktir. Indikator o'quvchiga nechanchi savolda ekanini aytadi — alohida yorliq kerak emas.

**Yozish-kartasi (80b):** ekranning yagona kartasi, aksent-halqa bilan. Uch qadam bitta kartada ketma-ket ochiladi (94-qonun progressiv ochilish):
① **Savol** maydoni → ② **«Savolni o'qib bering»** tugmasi (bosilganda karta o'qish holatiga o'tadi: savol katta shriftda, tahrir «✎» ortiga yashiriladi — 92e) → ③ **Eshitgan javob** maydoni + jonli javob-qatori. Uch savol uchun bir xil karta — bir shakl, uch marta.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI — faqat indikator chirog'i yonadi; uchtasi ham yozilgach varaq to'liq enda ochiladi (✎ tahrir shu yerda). Saqlangan qator ko'rinishi: `Uy vazifasini oxirgi marta qachon unutgansiz? → «O'tgan payshanba, ertalab guruhni ochsam yozilgan ekan»` (strelkali juftlik, s1 demo bilan bir shaklda — korpus §67d).

**Ipuchalar (92c/85 · korpus §32 · §115 bir tilda):** `«Nimani so'raysiz?»` · `«U nima dedi?»` — ikkalasi ham qisqa savol; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q. s4 dagi savollar placeholder'ga ko'chirilmaydi — o'quvchi o'z savolini yozadi.

**106d javob (ikki tomonlama):** ✅ «Savolingiz bo'lib o'tgan ishni so'radi, javobda odamning o'z gapi turibdi.» · 🤔 to'rt tarmoq — 3-bo'lim BLOK 4 dagi ro'yxat.

**Xulosa-so'zlar ro'yxati** (106d(c), dars o'z lug'atidan): *kerak · muhim · yaxshi bo'lardi · qulay · zarur*. O'quvchi «eshitgan javob» maydoniga faqat shulardan biri bilan gap yozsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

**«-mi?» sharti (yumshoq):** savol `-mi?` / `-misiz?` bilan tugasa hint chiqadi, lekin saqlash bloklanmaydi — ba'zi to'g'ri savol ham shunday tugashi mumkin («Oxirgi marta qachon ochgansiz?» tugamaydi, lekin «Kecha ochdingizmi?» tugaydi va u chindan bo'sh savol). Hint yo'naltiradi, hukm chiqarmaydi.

**Kirish-tasma (`pm-m5d2-yigirmata`):** sarlavha ostida ixcham bir qator — «👥 Siz yozgan odamlar: …» (faqat `kim` qiymatlari), ish-maydoni EMAS; artefakt yo'q bo'lsa — qator yo'q, oradagi joy yopiladi (oraliq qolmaydi). «Kanal» so'zi bu qatorda ham, boshqa joyda ham yo'q.

**§28 (narrow taqiqi):** ekran to'liq kenglikda — chapda yozish-kartasi, o'ngda varaq-paneli; ikkala qatlam ham hali yozilmagan, yarim va to'liq holatda ko'rinib turadi.

---

## 6. KEYS SPETSIFIKATSIYASI (s6 — K4 AIRBNB · 33/56/100-qonun qolipi)

🔴 **Freym (91b):** eyebrow — **«🏠 Biznes olamidan»**. K-kodi ekranga chiqmaydi. Eyebrow'da «voqea» so'zi ATAYLAB yo'q (§121: «voqea» ildizi darsda faqat «bo'lib o'tgan ish» ma'nosida yashaydi).

🔴 **Bosqich-hisoblagichi (17-ov b · uzluksiz):** eyebrow har bosqichda bitta hisoblagich bilan turadi — «🏠 Biznes olamidan · 1/7» … «7/7». Bosqichlar: slayd-1 · bashorat-1 · slayd-2 · slayd-3 · bashorat-2 · slayd-4 · ko'prik-gap. Bashorat javobidan keyin hisoblagich yo'qolmaydi, uzuq raqam qolmaydi (naqsh: `PmLesson9.jsx` s6).

🔴 **Jonli son-hisoblagichi YO'Q** — K4 bankda «raqamsiz» belgili keys (M4-D7 pretsedenti). Sanaladigan raqam bo'lmagani uchun jonli hisoblagich ham qo'yilmaydi.

**4 slayd (hikoya tilida — 42-qonun · ovoz chiqarib o'qib tekshirildi):**

1. **2007-yil. San-Frantsiskoda katta yig'in bo'ldi, mehmonxonalarda joy qolmadi.** Shunda Airbnb asoschilari o'z uyiga uchta havo to'shagi qo'yib, kelganlarga joy berishdi. Kompaniya shundan boshlandi.
2. *(bashorat-1 dan keyin)* **Keyinroq o'sish to'xtadi.** Asoschilar javobni izlab Nyu-Yorkka jo'nashdi.
3. **Nyu-Yorkda uy-ma-uy yurishdi:** uy egalarining oldiga kirib, uylarni o'zlari suratga olishdi.
4. *(bashorat-2 dan keyin)* **Shunda ma'lum bo'ldi:** yomon surat qo'yilgan uyni hech kim band qilmas ekan. Buni ular uy egalarining yonida turib topishdi.

**Bashorat-1 (2-slayddan oldin · 1-o'lchov: HARAKAT — asoschilar nima qildi):**
**Savol:** «O'sish to'xtaganda asoschilar nima qildi?»
- «Saytga yangi tugma qo'shdi» *(26)*
- «Uy egalariga xat yozdi» *(22)*
- «Nyu-Yorkka jo'nab ketdi» ✅ *(23)*

**Bashorat-2 (4-slayddan oldin · 2-o'lchov: TOPILMA — uylarda nimani ko'rdi):**
**Savol:** «Uylarni ko'rib ular nimani topdi?»
- «Uy egalari narxni oshirgan» *(26)*
- «Suratlar yomon chiqqan» ✅ *(22)*
- «Sayt sekin ochilib qolgan» *(25)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! …» — quyruqsiz; adashsa «Adashdingiz — asl javob: …». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — darsga qaytadi) — 🔴 ALOHIDA BOSQICH (7/7):**
> Javob ularning stolida emas, uy egalarining yonida turgan edi. Sizning botingiz ham shunday: javob sizda emas, uni ishlatgan odamda. Endi shu odamga beradigan uchta savolni o'zingiz yozasiz.

> 🔴 **Nima uchun ko'prik alohida bosqich:** 44-qonun ko'prikni darsga qaytaruvchi LAHZA deb belgilaydi — u slayd-4 bilan bir ekranda tursa, o'quvchi uni keys-hikoyasining davomi deb o'qiydi va s8 ga chorlov yo'qoladi. Ikkalasi birga 313 grapheme bo'lib chegaradan o'tmasa ham, bosqich-ritmi ularni ajratadi.
> 🔴 **Fakt-halolligi (§101/§124 — bank bilan yonma-yon tekshirildi):** 2007-yil · San-Frantsiskodagi yig'in · mehmonxonalarda joy qolmagani · uchta havo to'shak · o'sish to'xtagani · Nyu-Yorkka borish · uy-ma-uy yurish · uylarni o'zlari suratga olish · yomon surat band qilishni to'xtatgani — **hammasi bank matnida bor** ✓. Bankda YO'Q birorta gap qo'shilmagan: «ofisda topa olishmadi», «nechta uyga kirishdi», «necha kun yurishdi» kabi «kuchaytirish» gaplari yozilmadi.
> 🔴 **§124 (inkor chegaralangan):** «hech kim band qilmas ekan» — bu bankning O'Z gapi (yomon surat band qilishni o'ldiradi), kengaytirilgan inkor emas.
> 🔴 **Bashorat halolligi (17/43/64):** har bashorat bitta o'lchovning uch varianti; 1-bashorat ikkinchisining javobini ochmaydi (harakat ↔ topilma — ikki ayri o'lchov, 17-ov c ✓). Distraktorlar hayotda ham, slaydda ham rost emas. Uzunlik: 26·22·23 (tell 1.18, to'g'ri eng uzun emas ✓) · 26·22·25 (tell 1.18) ✓.
> 🔴 **§123 (bashorat-chipida izohsiz atama yo'q):** «Nyu-York», «surat», «narx» — hammasi kundalik so'z ✓.
> 🔴 **§132 (bashorat-slaydi javobni oldindan aytmasin):** slayd-3 uylarga kirib surat olishni aytadi, lekin **nima topilganini aytmaydi** — topilma faqat slayd-4 da, bashorat-2 dan keyin ochiladi ✓.
> 🔴 **24-qonun (kundalik-ilova misoli takrorlanmaydi):** Airbnb PM darslarida keys sifatida ishlatilgan (K12 pitch — M1-D14/M2-D13/M3-D14/M4-D15), lekin **K4 hikoyasi** (matras, Nyu-York) hech qayerda ochilmagan — bu keysning birinchi ochilishi ✓.
> 🔴 **Mentorga (`MentorNote`):** «Bolalar "nega o'zlari surat olgan, fotograf yollashsa bo'lardi-ku?" deb so'raydi. Javob berib qo'ymang — so'rang: fotograf yuborilsa, asoschilar uy egasining gapini eshitarmidi?»

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · VS Code + terminal)

**Darvoza-mashq (82e):** bitta savol-tanlov: «Kod `javoblar[0].savol` ni chiqarsa, terminalda nima ko'rinadi?» → «Massivdagi birinchi savol matni» ✅ *(31)* / «Massivdagi birinchi javob matni» *(31)* / «Massivdagi javoblar soni» *(24)* — §129: uchala variant ham bir turdagi natija-gapi, farq faqat ma'noda.

**Boshlang'ich kod (`suhbat.js` — VS Code-mockup'da, qo'lda yoziladi):**

```js
// suhbat.js — suhbat varag'i
const javoblar = [
  { savol: "Uy vazifasini oxirgi marta qachon unutgansiz?",
    eshitgan: "O'tgan payshanba, ertalab guruhni ochsam yozilgan ekan" },
  { savol: "", eshitgan: "" },
  { savol: "", eshitgan: "" },
];

for (let i = 0; i < javoblar.length; i++) {
  const j = javoblar[i];

  // 1) har qatorni chiqaring:
  //    console.log((i + 1) + ") " + j.savol + "  ->  " + j.eshitgan);
  // 2) j.eshitgan.length 25 dan kichik bo'lsa, yana bir qator chiqaring:
  //    "   qisqa javob — bo'lib o'tgan ish ko'rinmayapti"
}
```

Terminal: `node suhbat.js`

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. `node suhbat.js` uch qatorni chiqaradi
2. Har qatorda savol va javobi
3. Qisqa javobga belgi qo'yildi

**YORDAM (yechimni aytmaydi — korpus §77):** Avval bitta qatorni chiqarib ko'ring: `javoblar[0].savol`. Ishlagach siklni, keyin `if` ni qo'shing.

**YULDUZCHA:** Qisqa javoblarni sanab boring va oxirida bitta qatorda chiqaring: «n ta javob qisqa».

> 🔴 **Sanoq-mosligi (22-qonun):** massivda AYNAN 3 o'rin — s8 dagi uch savol bilan bir xil; boshlang'ich koddagi namuna qator s4 ning 3-javobidan olingan (o'quvchi uni bir marta ko'rgan).
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`javoblar` · `savol` · `eshitgan` · `suhbat.js`): kodda `eshitgan`, prozada «eshitgan javob» (lug'at `tolov` pretsedenti). 🔴 **Matn-qiymatlari qo'shtirnoq (") bilan yoziladi** — o'quvchi javobida apostrof bo'ladi («o'tgan», «bo'lib»), bitta tirnoq ichida u kodni sindiradi; boshlang'ich kod, izoh-namunalar va chiqariladigan qator shu sababli qo'shtirnoqda.
> 🔴 **87-qonun:** massiv, obyekt, `for`, `.length`, `if`, `console.log`, matn qo'shish `+` — hammasi M2 da o'tilgan; `node fayl.js` — M4 da. O'tilmagan hech narsa yo'q, shuning uchun «tayyor turadigan» bo'lak ham kerak emas.
> 🔴 **Pedagogik ulanish (87c):** mentor ochiq aytadi — s8 da yozgan uch qator endi kodda turadi; `if` esa darsning o'z qoidasini tekshiradi (qisqa javobdan bo'lib o'tgan ish ko'rinmaydi).
> 🔴 **82(c):** panel (yo'riq + darvoza-mashq + «✅ Bajardim — uch qator chiqdi») CHAPDA, kod O'NGDA · **82(f):** sinf-holati o'quvchiga ko'rinmaydi.
> 🔴 **89-qonun:** takrorlash-yo'li (erkin rejim, matn-havola): «✓ Bu mashqni sinfda bajarganman — davom etish →».
> 🔴 **40-qonun (3 holat):** javoblari yozilmagan o'quvchida ham massivda bitta to'liq namuna bor — natija chiqadi, singan ekran yo'q.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qator CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo matnsiz — savol va javob matni s4/s8 kashfiyoti |
| **s12 REFLEKSIYA** | Sarlavha: «Uchta savolingizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». Yozgach mukofot (106f-b) |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Odamning oldiga borib, bo'lib o'tgan ishini so'rash — suhbat.» · «Bo'lib o'tgan ishni so'ragan savol — voqea savoli.» · «Javobidan bo'lib o'tgan ish bilinmaydigan savol — bo'sh savol.» · «Varaqqa odamning o'z gapi tushadi, sizning xulosangiz emas.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/hook/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |
| **Suhbatdosh nomi** | s4 yorlig'i va s8 tasmasi `pm-m5d2-yigirmata` dan o'qiydi; bo'lmasa «sinfdosh» — jim (§69), «ro'yxatingiz yo'q» kabi matn 0 |

### 8-A. Quruvchiga — `SCREEN_INTENTS` va s4/s9 holat-mashinasi (qisqa)

| Ekran | intent | done-sharti (PRACTICE_BASE signali) |
|---|---|---|
| s0 | hook-vote | tanlov bosildi (payoff ochildi) |
| s1 | preview | animatsiya tugadi (avto) |
| s2 | compare-2 | ikkala karta kamida bir marta ochildi (`seen`, 46-qonun) |
| s4 | table-talk | to'rt savol ham berildi **va** yozuv-qatori tanlandi (yakun-karta ochilgach) |
| s6 | case-slides | 4 slayd o'tildi (2 bashorat belgilangan) |
| s8 | workshop-3 | 3/3 saqlandi (`pm-m5d8-javoblar` yozildi) |
| s9 | sieve-4 | 4/4 qaror qilindi (to'g'ri-noto'g'ri farqsiz — bajarilganlik) |
| s10 | vscode-check | «✅ Bajardim — uch qator chiqdi» (darvoza-mashq to'g'ri bo'lgach ochiladi) |
| s12 | reflection | bir qator yozildi |

**s4 holat-mashinasi:** `idle` → har savol bosilganda `asking(i)` (gap-pufak ~1,2 s yozilib chiqadi; `prefers-reduced-motion` da darhol) → `heard(i)` (bilingan-qatori chiqadi va QOLADI) → to'rttasi ham `heard` bo'lgach `writeStep` (3-javob qaytariladi + uch yozuv-qatori) → qator tanlangach `done` (yakun-karta + `Good Listener!`). Berilgan savollar va yozuv-tanlovi `pm-m5d8-stol` ga yoziladi (F-0730-01 progress-saqlov: qayta kirganda `done` bo'lsa yakun-karta ochiq turadi).

**s9 holat-mashinasi:** `i = 0..3` · har savol elak tepasida turadi → uch tugmadan biri bosiladi → karta to'siqda qoladi yoki pastdagi varaqqa tushadi (~0,5 s tushish animatsiyasi) → javob-qatori (✅/🤔 + sabab) → «Keyingisi ▸» → oxirida `strip` (to'rttasi bir qatorda: savol + to'siq/varaq) + yakun-qatori. Birinchi noto'g'ri tanlovdan keyin YORDAM chipi bir marta ochiladi. To'rt qaror `pm-m5d8-elak` ga yoziladi.

**s6 slaydlari:** eyebrow «🏠 Biznes olamidan · n/7» (uzluksiz bosqich-hisoblagichi — 17-ov b) · slayd-1 → bashorat-1 → natija-qatori → slayd-2 → slayd-3 → bashorat-2 → natija-qatori → slayd-4 → **ko'prik-gap alohida bosqichda**.

### 8-B. 🔴 TAQIQ-SO'ZLAR (o'quvchi matnida — har biri bu darsda 0)

Ro'yxat senariy-yozuvchi tomonidan belgilandi; qurishdan keyin residue-grep bilan yuritiladi.

| Guruh | So'zlar | Nima uchun | O'rniga |
|---|---|---|---|
| **Kasb-jargoni** | `custdev` (faqat flashcard-10 JAVOBIDA, «mijoz» so'zisiz) · `intervyu` · `insayt` · `pain` · `segment` · `respondent` · `gipoteza` · `skript` · `shablon` | 21/62-qonun: ball beriladigan va o'qiladigan matnda izohsiz chet so'z yo'q | «suhbat» · «savol» · «eshitgan javob» |
| **Savol-turining kitobiy nomlari** | `ochiq savol` · `yopiq savol` · `yetaklovchi savol` · `gipotetik savol` · `faraziy savol` | §104: atama hodisadan keyin tug'iladi, kitobiy tasnif berilmaydi | «voqea savoli» · «bo'sh savol» |
| **Eski `-v16` fayl merosi** | `xushomad` · `5 savol` · `savol shabloni` · `mini-intervyu` | 4.1 TAQIQ: eski avlodning tuzilishi va so'zlari butunlay olib tashlanadi | dars uch savol bilan ishlaydi |
| **Idoraviy shakl** | `so'rov o'tkazish` · `fikr yig'ish` · `ma'lumot to'plash` · `tadqiqot` · `anketa` · `so'rovnoma` | korpus §82: to'g'ridan-to'g'ri buyruq va hodisa-fe'li | «so'rang» · «eshiting» · «yozib oling» |
| **95-qonun (o'smir doirasi)** | `mijoz` · `biznes egasi` · `foydalanuvchi tadqiqoti` | Toshkent o'smiri bunday odam bilan uchrashmaydi | «sinfdosh» · «to'garakdosh» · «qo'shni» · «aka-opa» |
| **Kelajak-dars atamalari (29-qonun)** | `metrika` · `retention` · `kuniga nechta kirdi` | m5-11 ning atamalari | bu darsda umuman yo'q |
| **§121 ildiz-tozaligi** | `bo'sh joy` · `bo'sh maydon` · `bo'sh varaq` | «bo'sh» faqat «bo'sh savol / bo'sh javob» ma'nosida yashaydi | «hali yozilmagan» · «to'ldirilmagan» |
| **§121 ildiz-tozaligi** | `mashhur voqea` (keys eyebrow'i) · `voqea` boshqa ma'noda | «voqea» faqat «bo'lib o'tgan ish» ma'nosida | eyebrow «🏠 Biznes olamidan» |
| **Kod-olamining atamalari** | `server` · `konsol` · `funksiya chaqirish` | §134: ko'prik tanish buyruq (`node`) ustida quriladi | «kodni `node` bilan yurgizasiz» |
| **Platforma taqiqlari** | `daftar` · tugma-o'rnidagi inglizcha atama · tana-a'zosi metaforasi (4.1 oilasi) · «haqiqiy» o'rnidagi chet sifat · `mezon` · to'liq-emas ma'nosidagi qisqartma · sirli-so'z oilasi · kelajak-va'da qatori (73-qonun) | MATN_ETALONI lug'ati + til-lint 74 qoidasi (to'liq ro'yxat o'sha yerda) | «varaq» · «tugma / karta» · «savol» · «to'liq emas» |
| **Bashorat-ekrani** | `ball emas` · `degandingiz` · buyruq-shaklidagi taxmin-chorlovi | 79/100-qonun | «🎲 Avval o'zingiz belgilab ko'ring» |
| **Yakka rejim (§97)** | `ko'pchilik` · `sinf` · `ovozlar` | o'quvchi yolg'iz o'qiyotgan bo'lishi mumkin | ikki tarmoq bir shaklda |
| **Jim zaxira (§69)** | `topilmadi` · `saqlanmagan` · `hali yozmagansiz` | artefakt yo'qligi tizim-xatosidek eshitilmaydi | tarmoq jim almashadi |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s · to'g'ri indekslar 0,3,2,1 · 1,0,2,3 · 0,2,1,3)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.

| # | Savol (qisqa) | To'g'ri idx | Manba |
|---|---|---|---|
| 1 | Suhbat nima? | 0 | s2 |
| 2 | Suhbatda nima so'raladi? | 3 | s2 |
| 3 | Voqea savoli nima? | 2 | s4 |
| 4 | Bo'sh savol nima? | 1 | s4 |
| 5 | «Botim yoqdimi?» — bu qanday savol? | 1 | s4 |
| 6 | «Oxirgi marta qachon unutgansiz?» — bu qanday savol? | 0 | s4 |
| 7 | Suhbatdosh «Ha, ishlataman» dedi — bundan nima bilinadi? | 2 | s4/s5 |
| 8 | Varaqqa qaysi gap tushadi? | 3 | s4/s11 |
| 9 | Airbnb asoschilari o'sish to'xtaganda qayerga bordi? | 1 | s6 |
| 10 | Ular uy egalarining oldida nimani bilib oldi? | 0 | s6/s7 |
| 11 | Suhbatni kimdan boshlaysiz? | 2 | s8 |
| 12 | Bir odam aytgan gapni varaqqa qanday yozasiz? | 3 | s4/s15 |

> 🔴 **§117 (metafora-so'z ballanadigan matnda tug'ilmaydi):** «bo'sh savol» arenaga s4 yakun-kartasidan keyin keladi — dars ichida ochilgan ✓.
> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q — «custdev», «intervyu», «insayt», «segment» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «suhbat», «voqea savoli», «bo'sh savol», «eshitgan javob», «varaq» so'zlari bilan.
> 🔴 **§114:** arena-fon/dekor so'zlari shu dars lug'atidan (suhbat · savol · javob · varaq · odam) — bot-kodining so'zlari (`bot.on`, token) fonga chiqmaydi.
> 🔴 **§134:** birorta variantda rang-holati ishlatilmaydi (darsda rang ma'nosi o'quvchi matnida o'rgatilmagan).

🔴 **Arena-yozish sharti (metodist · 16-ov + §110/§127 — quruvchiga majburiy):** to'rt variantli savolda **ikki qiymatli olam** (voqea savoli / bo'sh savol) bo'lsa, variantlar **2/2** yoziladi va farq SABABda qoladi — bo'sh to'ldiruvchi variant o'ylab topilmaydi. Ikki eng xavflisi shu yerda to'liq yozildi, qolgan 10 tasi shu qolipda:

**Q5 (to'g'ri idx 1)** — «"Botim yoqdimi?" — bu qanday savol?»
- «Voqea savoli — botni tilga olgan savol» *(38)* · **«Bo'sh savol — qilgan ish so'ralmadi»** ✅ *(35)* · «Bo'sh savol — savol juda qisqa» *(30)* · «Voqea savoli — javobi bir og'iz» *(31)*
- 2 «voqea savoli» / 2 «bo'sh savol» — bola atama-nomini emas, SABABni tanlaydi (§107); ikkinchi «bo'sh savol»ning sababi darsda ochiq yolg'on (savolning uzunligi hech qayerda mezon emas).

**Q6 (to'g'ri idx 0)** — «"Oxirgi marta qachon unutgansiz?" — bu qanday savol?»
- **«Voqea savoli — bo'lgan kunni so'radi»** ✅ *(36)* · «Voqea savoli — javobi "ha" bo'lib qoladi» *(40)* · «Bo'sh savol — kelajakni so'radi» *(31)* · «Bo'sh savol — botni tilga olmadi» *(32)*
- 2/2 qolip; to'g'ri javob eng uzun emas; har distraktorning sababi darsda ochiq rad etilgan (s4 3-javobi kun bilan keldi, «ha» emas).

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Good Listener!** | To'rt javobni oxirigacha eshitdingiz | 36 | s4: to'rt savol ham berildi, yakun-karta ochildi |
| **Note Taker!** | Uch savol va uch javobni yozdingiz | 34 | s8: 3/3 saqlandi |
| **Sharp Sifter!** | To'rt savolning to'sig'ini tanladingiz | 38 | s9: 4/4 qaror qilindi |
| **Sheet Maker!** | Suhbat varag'ini kod bilan chiqardingiz | 39 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 34–39 belgi ✓.
> 🔴 **§100 (omonim-tekshiruvi):** «Good Listener», «Note Taker», «Sharp Sifter», «Sheet Maker» — kursning texnik lug'atida boshqa ma'no bermaydi ✓ (❌ «Script Writer» — script texnik atama, rad; ❌ «Query Master» — query bazadan tanish, rad; ❌ «Builder» — `build` CI/CD darsidan tanish, rad).
> 🔴 **§133 (tavsif faqat REAL tekshirilgan ishni aytadi):** «Sharp Sifter» nishon **to'g'ri javobga emas, to'rt qarorning bajarilishiga** beriladi (s9 done-sharti) — shuning uchun tavsif «to'g'ri o'tkazdingiz» emas, «**to'sig'ini tanladingiz**» deb yozildi. Qolgan uchtasi ham bajarilgan ishni aytadi: «eshitdingiz» (s4 da to'rt javob eshitilgan), «yozdingiz» (s8 3/3), «kod bilan chiqardingiz» (s10 real natija).

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Suhbat nima? | Odamning oldiga borib, bo'lib o'tgan ishini so'rash |
| 2 | Voqea savoli nima? | Bo'lib o'tgan ishni so'ragan savol |
| 3 | Bo'sh savol nima? | Javobidan bo'lib o'tgan ish bilinmaydigan savol |
| 4 | Voqea savoliga javobda nima bo'ladi? | Kun, joy yoki qilingan ish |
| 5 | «Botim yoqdimi?» — qanday savol? | Bo'sh savol: javobida qilingan ish qolmaydi |
| 6 | Hali qilinmagan ish haqida so'rasangiz, javob qanday bo'ladi? | Va'da bo'ladi — bunday ish hali bo'lmagan |
| 7 | Varaqqa nima yoziladi? | Odam aytgan gap, uning o'z so'zi bilan |
| 8 | Varaqqa nima yozilmaydi? | Sizning xulosangiz va bitta odamning gapidan chiqarilgan umumiy gap |
| 9 | Airbnb asoschilari uy egalarining oldida nimani bilib oldi? | Yomon surat qo'yilgan uy band qilinmasligini |
| 10 | Suhbatni kimdan boshlaysiz? | Botingizni ishlatgan odamdan: sinfdosh, to'garakdosh yoki qo'shni. Suhbatning inglizcha nomi — custdev |

> 🔴 **Korpus §20/§52:** 1-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil; 2- va 3-kartalar ham s4 yakun-kartasi bilan so'zma-so'z.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ta'rif · voqea savoli · bo'sh savol · javob tarkibi · misol · va'da · varaqqa yoziladigani · yozilmaydigani · keys topilmasi · inglizcha juftlik).
> 🔴 **§132 (flashcard old-tomoni o'rgatilmagan inglizcha nomni so'ramaydi):** 10-karta savoli darsda o'rgatilgan ishni so'raydi («kimdan boshlaysiz?» — s8 mentori), inglizcha nom esa JAVOB tomonida, alohida gap bo'lib turadi ✓ (§133: qavs-gloss emas). «Mijoz» so'zi bilan tarjima qilinmaydi — 95-qonun.
> 🔴 **Inglizcha atama faqat 10-karta JAVOBIDA** — dars ichida boshqa hech qayerda yo'q (korpus §20); u ball beriladigan birorta matnga kirmaydi (21-qonun).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Javob odamning oldida»** — (1) kanonik ta'rif: «Odamning oldiga borib, bo'lib o'tgan ishini so'rash — suhbat» · (2) stol ortida o'ylab topilgan javobni hech kim tasdiqlamaydi · (3) sinfga savol
**s5 · «Bo'lib o'tgan ishni so'rang»** — (1) «Bo'lib o'tgan ishni so'ragan savol — voqea savoli» · (2) hali qilinmagan ish haqida odam faqat va'da beradi · (3) savol
**s7 · «Javob odamning yonida topiladi»** — (1) Airbnb asoschilari Nyu-Yorkda uy-ma-uy yurdi · (2) yomon surat qo'yilgan uy band qilinmas ekan — buni ular joyida bilishdi · (3) savol
**s11 · «Eshitganingizni yozing»** — (1) varaqqa odamning o'z gapi tushadi · (2) xulosa ham, umumlashtirilgan gap ham javob emas · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** keys «Biznes olamidan» deb ataladi.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys — **K4 Airbnb**, M5 ichida ishlatilmagan (m5-02 → K8, m5-11 → K5) ✓; bankdan tashqari fakt, raqam va sana qo'shilmagan ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — m5-02 kanal-funnel · m4c-06 signal-saralash · m4c-02 haftaga-sig'dirish · m4b-02 nosozlik-navbati · **M5-D8 savol-elak (uch natija, to'siqni nomlash)** ✓
7. Sensirash — **0** ✓
8. SOFT **aynan bitta blokda** (blok 4) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): o'quvchining o'z Telegram-boti — s0 dan s15 gacha; keys (s6) yagona freymlangan janr-lahzasi, ko'prik bilan darsga qaytadi ✓
- 95 (Toshkent o'smiri): suhbatdoshlar — sinfdosh · to'garakdosh · qo'shni · aka-opa; «mijoz» 0 ✓
- 96/96c: ip o'quvchining ARTEFAKTIDA (`pm-m5d2-yigirmata` → `pm-m5d8-javoblar`), demo-olam emas; to'qnashuv-grep shapkada ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m5-02 kompilyator → m5-08 VS Code) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat M2 (massiv, obyekt, `for`, `.length`, `if`, `console.log`) va M4 (`node fayl.js`) materialidan; `for...of`, `map`, shablon-satr, `fs`, `localStorage` YO'Q ✓
- 29 (kelajak-atama oqmaydi): «metrika», «retention», «qaytish» o'quvchi matnida **0** ✓
- 33/56/100: keys 2 bashorat, ikki o'lchov (harakat · topilma); natija asl javobni aytadi; «ball emas» va hook-echo yo'q ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 104/§119: hook ikki tanlovi teng (46 ↔ 46), payoff hech birini yolg'onga chiqarmaydi ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda 1 gap); dars **uchta** tushuncha bilan chegaralangan (suhbat · voqea/bo'sh savol · eshitgan javob) ✓
- 92d: majburiy maydonlar faqat o'quvchi darsda O'ZI oladigan ma'lumot uchun (savol + eshitgan javob); bot nomi, havola, foydalanuvchi soni hech qayerda so'ralmaydi ✓
- 88: navbat — s4 savol-kartalarida yurish, 2-bosqichda to'lqin; s9 uch tugma to'lqin; testda javobgacha yo'q ✓
- 89: koding takrorlash-yo'li erkin rejimda ✓
- 101 (nishon bayrami): 4 nishon, tavsif 34–39 belgi, e'lon-sarlavha yo'q ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN §99–134 o'qildi):**
1. **§20/§80/§85:** «suhbat» yagona bosh nom, kanonik ta'rif 4 yuzada so'zma-so'z (s2 xulosa · flashcard-1 · RECAPS s3 · s15); «custdev» faqat flashcard-10 javob-tomonida, alohida gapda; «mijoz» so'zi butun darsda 0 (95-qonun) ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 «nimani bilib oldingiz» → bilim-gapi · T2 «javob qanday bo'ladi» → javob-turi · T3 «nimani bilib oldi» → topilma · T4 «qaysi qator» → varaq-qatori) ✓
3. **§102:** distraktorlar darsning ekranida rost bo'lib qolmaydi — T1-A hook payoffi bilan, T2-A/C s4 javoblari bilan, T4-A/C s4 ning 2-savoli va 2-bosqichi bilan ochiq rad etiladi ✓
4. **§105/§121:** «suhbat» faqat dars-ma'nosida · «bo'sh» faqat savol/javob turi sifatida · «voqea» faqat «bo'lib o'tgan ish» ma'nosida (keys eyebrow'i «Biznes olamidan») · «o'tish» faqat s9 elagining fe'li (s4 da «savol berildi») ✓
5. **§106/§129:** T1 vaziyat-qo'llash · T2 yangi savol + javob-turi · T3 harakatga bog'langan topilma · T4 yangi kartochka — hech biri xulosa-ko'chirma emas ✓
6. **§107:** ha/yo'q-savol yo'q; s9 natijalari 2 o'tdi / 2 qoldi; arena Q5/Q6 2/2 ✓
7. **§108:** hech bir savol rostni rad ettirmaydi ✓
8. **§109:** bosh ta'rif zamon-iborasi bilan («bo'lib o'tgan ishini so'rash»), yasama ot emas ✓
9. **§110:** mutlaq so'z bir variantdan oshmaydi («hech narsani» — T1-B); kulgili-bo'sh variant yo'q ✓
10. **§111:** «degan javob» 0 ✓
11. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi to'rt javob eshitilgach; s9 3-savol savoli; s6 fotograf savoli) ✓
12. **§114:** arena-dekor so'zlari shu dars lug'atidan ✓
13. **§115:** ipuchalar bir gap-turida («Nimani so'raysiz?» · «U nima dedi?»); uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?») ✓
14. **§116:** s9 YORDAM-savoli ikkala to'siqni qamraydi ✓
15. **§117:** metafora-so'z ballanadigan matnda tug'ilmaydi («bo'sh savol» s4 yakun-kartasida ochiladi, keyin arenaga chiqadi) ✓
16. **§118:** distraktorlarda cheklov-so'zi umuman yo'q; hech bir distraktor «faqat» hisobiga yolg'on bo'lib turmaydi ✓
17. **§119:** hook payoffi hech bir tanlovni yolg'onga chiqarmaydi ✓
18. **§120:** s9 har savolda yetarli material (savol to'liq yozilgan, uchala to'siqqa solinadi) ✓
19. **§122/§124:** K4 raqamsiz keys — raqam zo'rlanmagan; inkor faqat bank aytgan narsaga («yomon surat qo'yilgan uy band qilinmas ekan») ✓
20. **§123:** demo-namuna (s1) darsning o'z qoidasiga bo'ysunadi; bashorat-chipida izohsiz atama yo'q; jonli son-hisoblagichi yo'q (raqam yo'q) ✓
21. **§125:** s1 natijani NOMLAYDI, matnini ko'rsatmaydi ✓
22. **§126:** bosh atama s1 da yo'q — s2 da tug'iladi; «voqea savoli»/«bo'sh savol» s4 da ✓
23. **§127/§121:** har scored-savolda dars atamasi yo umuman yo'q (T1, T2, T4 — T2 dan «voqea» ildizi ham olindi), yo ≥2 variantda (arena Q5/Q6 2/2) ✓
24. **§128:** shart-yorliqlari darak gapda («Savol bo'lib o'tgan ishni so'raydi»); s1 namunasi s8 shartidan o'tadi (u shakl-namuna, matn-namuna emas) ✓
25. **§130:** checklist mezoni MA'NOni so'raydi, so'zni emas; ✅-qatori faqat tekshirilgan narsani tasdiqlaydi ✓
26. **§131:** atama karta-sarlavhasida gloss'dan oldin chiqmaydi (s2 kartalari «💭 Stol ortida» / «🚶 Odamning oldida» — atamasiz) ✓
27. **§132:** bashorat-slaydi javobni oldindan aytmaydi (slayd-3 surat olishni aytadi, topilma slayd-4 da); flashcard-10 old-tomoni darsda o'rgatilgan ishni so'raydi, inglizcha nom javob tomonida qoladi ✓
28. **§133:** test variantlari bir tinish-qolipda; s4 yakun-kartasining oxirgi bandi T4 ning kaliti bo'lib qaytmaydi (T4 yangi materialga qo'llatadi); nishon-tavsifi faqat REAL tekshirilgan ishni aytadi («to'sig'ini tanladingiz») ✓
29. **§134:** rang-holati birorta distraktorda yo'q; T4 da kalit kartochkaning so'zma-so'z nusxasi emas va «tugma» so'zi uchala variantda; koding-ko'prigi taqiq-atamasiz, tanish `node` buyrug'i ustida ✓
30. **§40/§69/§97:** «savollaringiz» faqat s8 dan keyin · «topilmadi/saqlanmagan» 0 · «ko'pchilik/sinf/ovozlar» 0 ✓
31. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo-qator (s1) · 2 karta (s2) · 4 savol + 3 yozuv-qatori (s4) · 4 slayd + 2 bashorat (s6) · 3 savol (s8/s12/koding/uy-vazifa) · 4 savol, 3 tugma (s9) · 3 shart (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
32. **Ekran-prozalari (Intl.Segmenter bilan qayta o'lchandi — metodist raundi):** s0 **323** · s1 84 · s2 246 · s4 **370** · s6 slayd-1 195 · slayd-2 72 · slayd-3 91 · slayd-4 123 · ko'prik 190 · s8 101 (+55 tasma) / 99 · s9 108 · s10 112 · s12 193 · uy-vazifa 207 grapheme (chegara 400) ✓ · variant-telllari T1 1.11 · T2 1.22 · T3 1.09 · T4 1.18 · bashorat 1.18/1.18 · arena Q5 1.09 · Q6 1.11 · hook 1.00 ✓ · to'g'ri javob hech bir testda eng uzun EMAS ✓

**Lint natijasi (metodist korrekturasidan keyin qayta yuritildi):** `node til-lint.mjs pm-senariylar/M5-D8-Custdev.md` — **0 error** · 10 warn, hammasi senariy-annotatsiyasida va izohlangan: **(a) `custdev` × 8** — atamaning O'ZI shu senariyda muhokama predmeti (taqiq-ro'yxati, gloss-bo'limi, flashcard-10 va GATE S savoli). Qoida «custdev (mijozni o'rganish)» shaklini kutadi, lekin bu darsda «mijoz» so'zi 95-qonun bo'yicha TAQIQ (Toshkent o'smiri mijoz bilan uchrashmaydi) — shuning uchun gloss teskari shaklda berilgan: flashcard-10 javobida «Suhbatning inglizcha nomi — custdev», ya'ni atamaning ma'nosi darsning o'z so'zi bilan aytilgan (§133: qavs-gloss emas, alohida gap). Ball beriladigan birorta matnda atama yo'q. **(b) `YADRO` × 2** — `PM_Prompt_v8` ning MAJBURIY blok-sarlavhasi (=== BLOK 3: YADRO ===), o'quvchi matnida 0. `node prompt-lint.mjs` — **toza** (aralash-yozuv so'z topilmadi).

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**
**(a) Umumiy:** `npm run lint:til src/5-Modull/PmLesson20.jsx` → **0 error** shart.

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M5-D8 ga tegishli) — to'liq ro'yxat va sabablari **8-B bo'limda**; qisqa shakli:
`custdev` (flashcard-10 javobidan tashqari 0) · `mijoz` (butun darsda 0) · `intervyu` · `insayt` · `segment` · `respondent` · `gipoteza` ·
`ochiq savol` · `yopiq savol` · `yetaklovchi` · `gipotetik` · `faraziy` ·
`xushomad` · `5 savol` · `savol shabloni` · `mini-intervyu` (eski v16 merosi) ·
`so'rov o'tkaz` · `fikr yig'` · `ma'lumot to'pla` · `tadqiqot` · `anketa` · `so'rovnoma` ·
`mijoz` · `biznes egasi` ·
`metrika` · `retention` (29-qonun) ·
`bo'sh joy` · `bo'sh maydon` · `bo'sh varaq` (§121) ·
`mashhur voqea` (§121 — eyebrow «Biznes olamidan») ·
`server` · `konsol` (§134) ·
`topilmadi` · `saqlanmagan` (§69) · `ko'pchilik` · `ovozlar` (§97) · `ball emas` · `degandingiz` (100-qonun) ·
`savol-turi` · `to'siq-nomi` (defisli ichki birikma o'quvchi matnida 0).

---

## 14. ⏳ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq savollar)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi. Bosh-agent avto-GATE S bilan yopishi mumkin.

1. 🔴 **DARS SARLAVHASI VA SUB (`App.jsx` `m5-08`).** Hozir: title «Custdev: jonli foydalanuvchi» · sub «5 savol shabloni, 5 mini-intervyu». Ikkalasi ham muammoli: «Custdev» — o'quvchi ekranida 0 bo'lgan chet atama, «5 savol shabloni» esa eski `-v16` fayl tuzilishini aytadi (yangi darsda **uchta** savol va shablon yo'q). **Taklif (29-qonun, «?»li o'quvchi-savoli) — metodist raundida aniqlashtirildi:** title → **«Botingizni ishlatgan odamdan nimani so'raysiz?»** · sub → **«bo'lib o'tgan ishini so'rash va eshitganini yozib olish»**. *(Avvalgi taklif «…odam nima deydi?» edi — u darsning o'z xulosasiga zid eshitiladi: dars aynan «nima deydi» emas, «nima qilgan» so'ralishini o'rgatadi; hook-savoli esa o'sha «nima deydi?» shaklida qoladi va s2 uni ochib beradi.)* Tasdiqlaysizmi?

2. 🔴 **BOSH ATAMA «SUHBAT» + «VOQEA SAVOLI» / «BO'SH SAVOL».** «Custdev» va «intervyu» o'rnini butun darsda **suhbat** oilasi oladi (suhbat · suhbatdosh · voqea savoli · bo'sh savol · eshitgan javob); inglizcha juftlik faqat flashcard-10 da. Sabab: «suhbat» o'smirga jismonan tanish, ta'rifi bir gapda ochiladi; «voqea» va «bo'sh» — kundalik so'zlar («bo'sh gap»). Muqobil variantlar rad etildi: «ochiq/yopiq savol» (kitobiy tasnif, hodisa tilida emas), «yaxshi/yomon savol» (baho beradi), «kuchli savol» (mavhum). 🔴 **Metodist hukmi (§121 ildiz-grepi bilan):** nomlar o'tadi — «suhbat/suhbatdosh» o'smir kundalik lug'atida bor, «voqea» ham («qiziq voqea bo'ldi»), «bo'sh savol» esa «bo'sh gap» orqali darrov o'tiradi; uchala ildiz ham darsda boshqa ma'noda ishlatilmaydi. Qo'shimcha ta'rif-gap («bo'lib o'tgan ish — voqea») ATAYLAB qo'shilmadi: u s4 yakun-kartasida «bo'lib o'tgan ish» iborasini uch marta takrorlab, TMI beradi (109-qonun), atama esa ta'rif-gapning o'zidan tushunarli. Rozimisiz?

3. 🔴 **K4 BURCHAK-BO'LINISHI (m5-08 ↔ m7-03).** Registr K4 ni ikki darsga bergan. Bu senariy **faqat Nyu-York bo'lagini** oladi (o'sish to'xtadi → borishdi → uy-ma-uy → yomon surat topilmasi); havo to'shak faqat 1-slaydda, hodisani boshlab berish uchun turadi. m7-03 («Muammoni qanday izlash») uchun **matras-boshlanishi va muammo qayerdan topilgani** burchagi butun qoladi. Shu bo'linish muhrlansinmi?

4. 🔴 **KIRISH-ARTEFAKT — ASOSIY YO'L «BOR».** `pm-m5d2-yigirmata` ni m5-02 (`PmLesson19`) yozadi va u **shu batchda qayta quriladi** — demak M5-D8 ning asosiy yo'li **artefakt BOR** tarmog'i: s8 sarlavhasi ostida «👥 Siz yozgan odamlar: sinfdosh · to'garakdosh · qo'shni» tasmasi turadi va mentor «Tepadagi ro'yxatdan bitta odamni tanlang» deydi; s4 suhbatdosh yorlig'i ham shu ro'yxatning birinchi qiymatidan o'qiladi. **YO'Q tarmog'i** — m5-02 ni o'tkazib yuborgan o'quvchi uchun jim zaxira: tasma render bo'lmaydi, yorliq «sinfdosh» deb turadi, mentor «Yoningizdagi odamlardan birini tanlang» deydi; «topilmadi / saqlanmagan» matni YO'Q (§69). 🔴 **Til-mosligi:** m5-02 o'quvchi matnida bu ro'yxat «joy» so'zi bilan ataladi (`kanal` — faqat kalit-nomi), shuning uchun M5-D8 ekranida «kanal» so'zi ishlatilmaydi va tasma faqat odamlarni ko'rsatadi — ikki dars matni bir-biriga zid bo'lmaydi. **Tavsiya: ikkala tarmoq ham qurilsin** (F-0803-22-B ikki tomonlama shart). Tasdiqlaysizmi?

5. 🔴 **CHIQISH-ARTEFAKT «ESHITGAN» MAYDONI — YAKKA REJIM.** `pm-m5d8-javoblar` ning `eshitgan` maydoni o'quvchi jonli odamdan javob olganini talab qiladi. Jonli darsda bu juftlik ishi (BLOK 4 SOFT). **Yakka (erkin) rejimda** o'quvchi yolg'iz o'qiyotgan bo'lishi mumkin. Senariy yechimi: mentor-gapning ikki tarmog'i bir shaklda («Tepadagi ro'yxatdan…» / «Yoningizdagi…»), maydon esa baribir majburiy — chunki savol berish darsning O'Z harakati (92d: bu o'quvchi darsda o'zi oladigan ma'lumot, tashqi ma'lumot emas). Muqobil: yakka rejimda `eshitgan` maydonini ixtiyoriy qilish va uy-vazifada to'ldirtirish — lekin unda s10 kodi va m5-11 kirishi bo'sh qoladi. **Tavsiya: hozirgi shakl qolsin.** Tasdiqlaysizmi?

6. 🔴 **s9 «SAVOL-ELAK» — UCH NATIJA.** Elakda ikki to'siq bor va o'quvchi uch tugmadan birini bosadi: «Ish hali bo'lmagan» · «Javob savolning ichida» · «O'tdi — varaqqa». Uch natija ataylab tanlangan: ikki natija bo'lsa mexanika M3-D2 «tekshiruvchi stoli»ning ✓/✕ hukmiga yaqinlashardi, uch natija esa o'quvchidan **sababni nomlashni** talab qiladi. Ikkinchi to'siq («javob savolning ichida») s4 da hodisa sifatida ko'rsatilgan (1-savol «Botim yoqdimi?» → «Ha, zo'r ekan») — ya'ni yangi tushuncha emas. Uch tugma shakli tasdiqlansinmi — yoki ikkitaga tushirilsinmi (o'tdi / o'tmadi)?

7. 🟡 **s4 IKKINCHI BOSQICHI (eshitganini yozib olish).** To'rt javob eshitilgach, 3-javob qaytariladi va uch yozuv-qatoridan bittasi tanlanadi. Bu darsning ikkinchi yarmini (varaqqa nima tushadi) mexanika ichida ochadi va s8 ga to'g'ridan-to'g'ri tayyorlaydi. Muqobil: bu bosqichni alohida ekranga chiqarish (ekran soni 17 bo'lardi). **Tavsiya: bitta ekranda qolsin** (s4 prozasi 332/400, ikkala bosqich ham ish-materiali). Rozimisiz?

8. 🟡 **KODING: `suhbat.js` + `node suhbat.js`.** M5 texnik darslarida real terminal buyrug'i ishlatilmagan (u yerda Telegraf kodi VS Code'da yoziladi), lekin `node fayl.js` M4 da o'tilgan. Topshiriq faqat massiv + `for` + `.length` + `if` + `console.log` ustiga qurilgan; `for...of`, shablon-satr, `map` KIRMAYDI. Muqobil: topshiriqni Telegraf boti ichiga qo'yish (`bot.command('varaq', …)`) — lekin unda bot ishga tushishi, token va internet kerak bo'ladi va 10 daqiqaga sig'maydi. **Tavsiya: hozirgi shakl.** Tasdiqlaysizmi?

9. 🟡 **DEMO-JAVOBLAR TIZIMI.** s4 to'rt javobi (zo'r ekan · ha ishlataman · o'tgan payshanba · yuqoriga surib qidirdim), s9 to'rt savoli va T4 kartochkasi bitta olamda (bot + guruh + uy vazifasi) va bir-birini takrorlamaydi. Hammasi demo-qiymat, bank-fakt emas. Tasdiqlaysizmi?

10. 🟢 **SUHBATDOSH YORLIG'I.** s4 da suhbatdosh **«sinfdosh»** deb ataladi (artefakt bo'lsa `kanallar[0].kim`). Ism berilmaydi — personaj-taqiq (DARS_ETALON 5.8, F-0729-27). Rozimisiz?

11. 🟢 **UY-VAZIFA: ODAM TOPOLMASA.** Kartada bitta qator: «Uyda odam topolmasangiz — sinfdagi boshqa juftlikdan so'rang» (92d). Rozimisiz?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (§99–134 bilan) · MATN_ETALONI (lug'at + 7-B) · PM_KEYS_MEXANIKA_REGISTRI (R1 / R2 Batch 4 pasporti / R3) bo'yicha yozildi. Keyingi qadam: pm-metodist SENARIY-KORREKTURA → **[GATE S]** — 14-bo'lim savollari (1–11).*
