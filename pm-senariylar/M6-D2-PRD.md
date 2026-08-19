# M6-D2 — Bitta gapni uch kishi bir xil tushunadimi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI → **pm-metodist korrekturasi BAJARILDI** (13-A bo'limi, 2026-08-19) → **[GATE S]** kutmoqda.
> Fayl: `src/6-Modull/PmLesson22.jsx` (hozirgi `-v16` avlod BUTUNLAY almashadi; yangi
> `lessonId: pm-m6d2-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 **BATCH 5** — o'zgartirilmagan.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 6 — «Tizimni to'liq yig'aman» (arxitektura + AI + mobil) |
| **Dars** | M6-D2 (modulning 2-darsi, modulning birinchi PM darsi) · `key: m6-02` |
| **Mavzu** | Kod yozishdan oldin bir varaqqa to'rt katak yoziladi: nima qiynayapti · kim qiynalyapti · nima quriladi · qaysi son o'zgaradi |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z varag'ini **yozadi**; artefakt = matn (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | **K7 · MICROSOFT (Altair)** — burchak: **«sotildi, keyin yozildi»**. Bankdagi voqea: 1975-yil, Geyts va Allen yangi kompyuter Altair haqida o'qib, uni chiqargan kompaniyaga qo'ng'iroq qiladi — «bizda shu kompyuter uchun BASIC tili bor»; til hali yozilmagan edi, uni bir necha haftada yozishdi va haqiqiy Altairga bir marta ham tegmasdan ko'rsatuv birinchi urinishdayoq ishladi. 🔴 **Raqamsiz keys** — bankda «raqamsiz» belgisi turibdi, demak darsda K7 ga tegishli birorta o'lchov-raqami YO'Q; yagona sana — **1975** (bank uni voqea bilan bergan) |
| **ISHLATILGAN_KEYS (M6 ichida band)** | M6 da bundan oldin PM dars YO'Q → **K7 modulda birinchi marta** ✓ (modul-ichi qoidasi, registr 4-bo'lim) |
| **Oldingi PM darsning TEKSHIRUV mexanikasi** | **m5-11** → «kun-belgilash» (registr R2 Batch 4). **m6-02 = «katak-tekshiruv»** — undan ham, band ro'yxatdagi hech biridan ham farq qiladi (26/59-qonun; asos: 1-bo'lim va s9 izohi) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq: story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «GAPSIZ KO'RSATUV» · «UCH KIRISH — BIR SAHIFA» · **«SXEMA-TO'QISH»** (m4-12 — eng yaqin xavf) · «UCH QAVAT KESIMI» · «YUK-SINOVI» · «SIFAT-TAROZI» · «RELIZ-TASMASI» · «O'LCHAGICH-PANELI» · «BIRINCHI 20» · «INTERVYU-STOLI» · «QAYTISH-KALENDARI» · Hotspot · Timeline · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · xabardan ortiqcha qatorni olib tashlash · yuk-tartiblash · sxema-shart tekshiruvi · qaror-sabab tanlovi · nosozlik-navbati · haftaga-sig'dirish · signal-saralash · joy-quvuri · savol-elak · kun-belgilash · pitch-oilasi ro'yxati |
| 🔴 **TAKROR-XAVFI №1 — M4-D12 (`PmLesson13`)** | O'sha dars ham «kod yozishdan oldin yoziladigan matn» haqida (K16 Amazon). **Farq uch joyda:** (a) **obyekt** — M4-D12 da o'quvchi **baza ustunlarini** yozadi (`{nom, savol, kim} × 3`), bu yerda **butun tizim haqida to'rt katak**; (b) **atama** — M4-D12 «e'lon» so'zini ishlatadi va «PRD» ni ataylab **shu darsga qoldirgan** (o'sha senariyning atama-glossi: «PRD qisqartmasi butun darsda ISHLATILMAYDI — u m6-02 ning bosh atamasi»); shuning uchun **bu darsda «e'lon» so'zi ishlatilmaydi** (teskari yo'nalishda ham toza qoladi); (c) **keys** — K16 ↔ K7. Ekranda M4-D12 ga havola YO'Q (38-qonun) |
| 🔴 **TAKROR-XAVFI №2 — M2-D7 (dekompozitsiya) va M3-D2 (hikoya)** | M2-D7 katta ishni **bo'laklarga** ajratadi (bo'laklash-doska), M3-D2 esa **hikoya yozadi** (`{kim, nima, natija}` gap-qolipi). Bu dars **hikoya yozish ham, bo'laklash ham emas**: **bitta varaq — to'rt katak**, har katakda bitta qator, va katakning to'rttasi ham **boshqa-boshqa savolga** javob beradi. Gap-qolipi yo'q, ip-tortish yo'q, ustun yo'q |
| **Misol-ip (91/108 + 95 + 96c)** | 🏊 **Basseyn guruhiga yozilish** — o'quvchi suzishga borib, guruh to'lib qolganini ko'radi. 95-qonun: Toshkent o'smiri basseynga/suzish to'garagiga O'ZI boradi, «joy bormi?» savolini o'zi so'raydi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · 🏀 maydoncha · musiqa ilovasi · maktab jurnali · kutubxona · 🅿️ AvtoStoyanka · o'quvchining Telegram-boti · konsert-chipta sayti · skuter-ijara · ikki sinfdosh-loyihasi · Netlify-sayti · KitobShop — va **Batch 5 ning boshqa uch darsi:** ✂️ sartaroshxona (m6-12) · 🛒 mini-do'kon (m6-06) · 🎤 Demo Day sahnasi (m6-14). **Basseyn band emas** ✓. Grep-dalili: `basseyn` · `suzish` · `murabbiy` — `src/` va `pm-senariylar/` da **0 topilma** |
| **O'quvchining O'Z ishi (96c(a))** | Demo-olam faqat o'rgatish uchun (s0 · s2 · s4 · s9 · s10). O'quvchining O'Z artefakti — **M6 da quradigan tizimi** uchun to'ldirilgan varaq (s8 · s12 · uy-vazifa). Ip artefakt orqali yuradi, demo orqali emas |
| **Kirish-artefakt** | 🔴 **YO'Q.** Modul-chegara qoidasi (registr 6-bo'lim): o'quvchi yangi modulga tanaffusdan keyin kiradi. Oldingi artefaktga bog'lanmaydi, «topilmadi / saqlanmagan / bo'sh» tarmog'i ham YOZILMAYDI (korpus §69) |
| **Chiqish-artefakt** | 🔴 `pm-m6d2-prd` = `{ prd: { muammo, kim, yechim, metrika }, savedAt }` — **registr R2 Batch 5 muhri, o'zgartirilmagan**. To'rt qiymat ham o'quvchi yozgan bitta qator. 🔴 **JSON kaliti `metrika`, o'quvchi ekranidagi so'z esa «O'lchov»** — «metrika» M8-D1 ning atamasi (29-qonun), ekranga chiqmaydi; pretsedent: m5-02 da ekranda «joy», kalitda `kanal`. Keyingi dars **m6-06** shu kalitni o'qiydi (jim zaxira) |
| **Yordamchi kalitlar** | `pm-m6d2-hook-choice` (faqat YOZILADI — 100c) · `pm-m6d2-varaq` (s4 holati: to'rt savol berilgan-berilmagani) · `pm-m6d2-check` (s9 holati) · `pm-m6d2-code` · `pm-m6d2-reflection` · `pm-m6d2-hw-target` · `ccProgress` |
| **Koding** | ⌨️ **VS Code** — R1 navbati muhrlangan (registr: m5-11 kompilyator → **m6-02 VS Code**). Senariy buni o'zgartirmaydi. Qobiq — 82-qonun (panel chapda, kod o'ngda, nusxalash yopiq, preview YO'Q) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D10 dan beri tasdiqlangan yakun-tuzilmasi bilan bir xil |

### Atama-glosslar (62/39-qonun + korpus §20/§104/§126 — avval hodisa, keyin nom)

- 🔴 **«PRD» — darsning O'Z atamasi, lekin hodisadan KEYIN tug'iladi.** U s0 · s1 · s2 · s3 da
  **0 marta** uchraydi; birinchi ko'rinishi — **s4 ning oxirgi qatori**, ta'rif-gap shaklida
  (korpus §104): *«Kod yozishdan oldin to'ldiriladigan shu bitta varaq — PRD. Inglizchada
  Product Requirements Document, ya'ni mahsulot talablari varag'i.»* §126: maqsad-ekranda
  (s1) natija **sodda so'z bilan** nomlanadi — «bitta varaq», «to'rt katak»;
- 🔴 **Dars bo'ylab bir tushuncha — bir nom** (korpus §80/§85): **«varaq»** = PRD ning o'zi;
  **«katak»** = varaqning to'rt bo'lagi; **«qator»** = katakka yoziladigan matn; **«gap»** =
  og'zaki aytilgan buyurtma. Bu to'rttasi butun darsda boshqa ma'noda ishlatilmaydi;
- 🔴 **Katak-nomlari va katak-savollari hamma yuzada AYNAN bir xil** (§80 kaskadi):
  🔴 **Muammo** — «Nima qiynayapti?» · 👤 **Kim** — «Kim qiynalyapti?» ·
  🛠 **Yechim** — «Nima quriladi?» · 📊 **O'lchov** — «Qaysi son o'zgaradi?».
  Shu juftlik s1 · s4 · s8 · s9 · s10 · flashcard · RECAPS · arena da so'zma-so'z takrorlanadi;
- 🔴 **Kanonik qoida-gapi** (s2 xulosasi · flashcard-1 · RECAPS · s15 da AYNAN bir xil, §109
  zamon-iborasi bilan): **«Og'zaki aytilgan gapni har kim o'zicha tushunadi — yozilgan qatorni
  hamma bir xil o'qiydi.»**;
- 🔴 **Fe'l-intizomi (korpus §80 — bir mashq, bir fe'l):** katak **to'ldiriladi** yoki
  **yoziladi** · odam **so'raydi** · dasturchi **quradi** · bo'sh katakni dasturchi **o'zicha
  yozadi**. ❌ katakka suyuqlik-fe'li qo'llanilmaydi (42-qonun) — «to'ldiriladi» yoki «yoziladi»;
- 🔴 **«bo'sh katak» ↔ «javobsiz katak» — ikki boshqa narsa** (§121): **bo'sh katak** = umuman
  yozilmagan katak (s4 boshi · s10 kodi · s11 testi · s15 yakuni); **javobsiz katak** = qatori
  bor, lekin o'z savoliga javob bermaydi (faqat s9). s9 yo'riqnomasi bu farqni ekranda ochib
  aytadi, shuning uchun «javobsiz» so'zi ta'rifsiz qolmaydi;
- 🔴 **«metrika» ekranga CHIQMAYDI** — M8-D1 (`PmMetricsLesson`) ning bosh atamasi
  (29-qonun: kelajak-dars atamasi oqmaydi). O'rnida **«o'lchov»**, va katak savoli uni o'zi
  ochadi: «Qaysi son o'zgaradi?». «retention», «DAU», «KPI», «dashboard» ham **0**;
- 🔴 **«e'lon» ekranda ISHLATILMAYDI** — u M4-D12 (`PmLesson13`) ning atamasi (shapka,
  takror-xavfi №1); bu darsda yoziladigan narsa faqat «varaq» va «qator» deb ataladi;
- 🔴 **«Altair» va «BASIC» — keys-slaydida gloss bilan** (21/62-qonun): Altair 1-slaydda
  gapning o'zida tanishtiriladi («jurnalda yangi kompyuter haqida o'qib qoldi. Uning nomi
  Altair edi») · «BASIC — kompyuterga buyruq yozadigan til». 🔴 Ikkala
  so'z ham **ballanadigan matnga KIRMAYDI** (test, bashorat, arena) — savollar odam nomlari
  («Geyts va Allen») va oddiy so'zlar bilan yoziladi;
- ❌ **«texnik topshiriq», «spetsifikatsiya», «dokumentatsiya», «backlog», «user story»** —
  kalka/kelajak-atama, ishlatilmaydi;
- ❌ **«arxitektura», «mikroservis», «MVC», «agent», «Skills», «pipeline»** — m6-01/03/04/05/07/08
  atamalari (29-qonun), o'quvchi matnida **0**.

🔴 **§40 darvozasi (o'quvchida hali YO'Q narsa uniki qilib aytilmaydi) — tekshirib yozildi:**
m6-02 ga kelgan o'quvchida **bor:** M5 da qurilgan Telegram-boti · m6-01 da ko'rgan tizim
bo'laklari (front · back · baza · AI · bot). **Hali YO'Q:** mobil versiya (m6-09…11), AI-agent
(m6-04), Skills (m6-05/07), to'liq pipeline (m6-08), loyiha kuni (m6-13). Shuning uchun dars
bo'ylab **«shu modulda quradigan tizimingiz»** shakli ishlatiladi — ❌ «ishlab turgan tizimingiz»,
❌ «mobil ilovangiz», ❌ «agentingiz». Basseyn ilovasi esa hech qachon «sizniki» emas — u
demo, dars bo'ylab **«ilova»**, hech qachon «ilovangiz».

🔴 **IP-BOSHI:** `pm-m6d2-prd` — M6 ning to'rt PM darsini bog'laydigan ipning birinchi
halqasi (hujjat → chegara → yo'l → sahna). m6-06 undan `prd.yechim` va `prd.kim` ni oladi,
m6-12 undan `prd.metrika` ni oladi (registr 6-bo'lim). Shuning uchun **to'rt katak ham
bo'shliqsiz to'ldirilishi** saqlash-sharti (5-bo'lim).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «BIR VARAQ»** (registr nomi: «BIR VARAQ PRD» — to'rt-katakli yozuv-varag'i;
23-qonun: har darsda YANGI, registr 5-bo'limdagi birorta band vizual klonlanmaydi).

Ekran ikkiga bo'linadi. **Chapda** — basseyn murabbiysi va uning og'zaki buyurtmasi:
*«Basseynga joy band qiladigan ilova kerak.»* **O'ngda** — oq varaq, ustida to'rt bo'sh katak:

| Katak | Katakning savoli |
|---|---|
| 🔴 Muammo | Nima qiynayapti? |
| 👤 Kim | Kim qiynalyapti? |
| 🛠 Yechim | Nima quriladi? |
| 📊 O'lchov | Qaysi son o'zgaradi? |

**1-bosqich — og'zaki buyurtma.** Varaq hali bo'sh. O'quvchi **«▶ Uch dasturchi nima qurdi?»**
tugmasini bosadi — uchta tayyor ilova ekrani ochiladi, har birining ostida bitta fakt-qator:

| Qurilgan ilova | Fakt-qator |
|---|---|
| 📞 Basseynning telefon raqami va manzili | Ilova ochildi. Joy bormi — bilinmadi |
| 🏊 Suzish guruhlari ro'yxati va rasmlari | Ilova ochildi. Joy bormi — bilinmadi |
| 🕐 Bo'sh joy ko'rinadi, lekin band qilib bo'lmaydi | Joy ko'rindi. Borsangiz band bo'lib qolishi mumkin |

Bosqich yakuni (bitta gap): **«Uchalasi ham ishladi. Bekorga qaytish esa kamaymadi.»**

**2-bosqich — to'rt savol** (birinchi bosqich ko'rilgach ochiladi — 94-qonun progressiv
ochilish): o'quvchining qo'lida to'rt savol-tugmasi turadi. Har savolni bosganda murabbiy
javob beradi va javob **varaqning o'z katagiga yozilib chiqadi** (42-qonun fe'li):

| Bosiladigan savol | Murabbiyning javobi → qaysi katakka |
|---|---|
| Nima qiynayapti? | «Odamlar kelib, guruh to'lib qolganini ko'radi va bekorga qaytadi» → 🔴 Muammo |
| Kim qiynalyapti? | «Haftada ikki marta suzishga keladiganlar» → 👤 Kim |
| Nima quriladi? | «Bo'sh joyni ko'rsatib, joyni band qiladigan ilova» → 🛠 Yechim |
| Qaysi son o'zgaradi? | «Bekorga qaytish 10 tadan 2 taga tushsin» → 📊 O'lchov |

To'rt katak ham yozilgach ikkinchi tugma ochiladi: **«▶ Endi nima qurishadi?»** — o'sha uch
dasturchi qayta chaqiriladi va uchalasi ham bir xil ekran quradi: bo'sh joy ko'rinadi, joy
band qilinadi. Yakun-qatori: **«✅ Bitta varaq — uchta bir xil natija.»**

Shundan keyin atama tug'iladi (korpus §104 — hodisa → nom → o'quvchining ishi):
> **Kod yozishdan oldin to'ldiriladigan shu bitta varaq — PRD.** Inglizchada Product
> Requirements Document, ya'ni mahsulot talablari varag'i.

🔴 **Rang-qonuni (palitra-pasporti, 71-qonun):** bo'sh katak — kulrang-punktir (**xato emas**,
shuning uchun `err` rangi YO'Q); yozilgan katak — `success` hoshiya; 1-bosqichdagi uch ilova
neytral indigo bo'lib qoladi — ular ham **buzuq emas**, ular shunchaki boshqa narsa qurdi.
`err/errSoft` bu ekranda umuman ishlatilmaydi.

🔴 **Nima uchun aynan shu:** PRD ni **o'qib** tushunib bo'lmaydi — u faqat **yo'q bo'lganda**
ko'rinadi. Bola avval bitta og'zaki gapdan uch xil natija chiqishini ko'radi, keyin to'rt
savolni **o'zi beradi** (bu — mahsulotni o'ylaydigan odamning asosiy ishi) va o'sha savollar
javobi bitta varaqni to'ldirganda natija bir xil bo'lib qolishini ko'radi. Ya'ni varaqning
qiymati o'quvchining o'z qo'lida ochiladi, mentor gapida emas.

🔴 **Mexanika-farqi (26/59-qonun):** m4-12 «SXEMA-TO'QISH» da o'quvchi **tayyor gaplarni
ustunlarga ip bilan bog'lardi** (obyekt — gap, harakat — ulash); m5-11 «QAYTISH-KALENDARI» da
**kunlar ustunini belgilardi**; m4-02 «XOTIRA TUGMALARI» da **tugmani yoqib-o'chirib oqibatni
ko'rardi**. Bu yerda obyekt — **savol**, harakat — **so'rash**, natija — **varaqning to'lishi
va qayta qurilish**. Uchalasidan ham boshqa obyekt, boshqa harakat, boshqa natija.

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 40–45 soniya harakatsizlikdan keyin bitta
yo'l-ipuchasi chiqadi: «Murabbiydan yana bitta savol so'rang» — javobni AYTMAYDIGAN shaklda
(korpus §77). Ipucha qaysi savol qolganini nomlamaydi.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D10 dan beri o'zgarmaydi — etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Bitta gapni uch kishi eshitdi. Nega uch xil ilova chiqdi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — bo'sh varaq o'z-o'zidan chizilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — og'zaki gap ↔ yozilgan qator | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **BIR VARAQ** (uch qurilma + to'rt savol) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K7 Microsoft (4 slayd + 2 bashorat + bosqich-hisoblagichi) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **4 katak** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **KATAK-TEKSHIRUV** | 5 | — | 🔴 uch varaq, har birida bitta javobsiz katak |
| s10 | KODING — bo'sh katakni topadigan kod | 6 | — | 26/82/87-qonun · VS Code |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ustaxona», «artefakt», «blok» so'zlari o'quvchi ekranida YO'Q** (14-qonun, ichki-jargon) —
bular senariy-ichi nomlar; ekranda sarlavha aniq ishni aytadi.

🔴 **«BIR VARAQ» va «KATAK-TEKSHIRUV» — senariy-ichi imzo-nomlari**, ekranga chiqmaydi
(korpus §84 + M4a-D2 pretsedenti).

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 6 — Tizimni to'liq yig'aman
DARS: M6-D2 (2-dars)
DARS_MAVZUSI: Kod yozishdan oldin bir varaqqa to'rt katak yoziladi
ISHLATILGAN_KEYS: K7
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Basseynga bordingiz — guruh to'lib qolgan, bekorga qaytdingiz. «Joy band
qiladigan ilova kerak», dedingiz. Shu gapni uch kishi eshitdi — uchtasi uch xil
ilova qurdi. Nega?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: gap og'izda qolgani uchun har kim
uni o'zicha tushundi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkala javob ham hayotdan olingan. Bo'linishning o'zi
darsga eshik: sinf «gapni yozib qo'ysa bo'lardi» degan fikrga o'zi keladi.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 🗣 Gap juda qisqa aytilgan | 25 |
| 🧠 Har kim boshqacha tushungan | 29 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham bo'ladi. Sabab esa bitta: gap **og'izda** qoldi. Og'zaki aytilgan gapni har kim o'zicha tushunadi. Bugun shu gapni bitta varaqqa tushirasiz.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsa (basseyn, to'lib qolgan guruh) + harakat-fe'llari («bordingiz», «qaytdingiz», «dedingiz») + o'quvchining o'z holatidan o'sadi — o'smir bekorga qaytishni o'zi boshidan kechirgan.
> 🔴 **104-qonun / korpus §119:** to'g'ri javob YO'Q; payoff **ikkala tanlovni ham rost qoldiradi** («Ikkalasi ham bo'ladi») va ustiga ikkalasida ham yo'q bo'lgan YANGI narsani qo'shadi («gap og'izda qoldi»). Hech kim «demak men xato ekanman» demaydi.
> 🔴 **100-qonun:** tanlov `pm-m6d2-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q; «ball emas» izohi YO'Q.
> 🔴 **62/126-qonun:** «PRD» bu ekranda YO'Q — u s4 da tug'iladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ekran-o'lchovi:** savol + payoff = **321 grapheme** proza (chegara 400) ✓.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida shu modulda quradigan tizimingiz uchun bitta varaq to'ldirasiz:
to'rt katak, har birida bitta qator.
HARAKAT: O'quvchi kuzatadi: bo'sh varaq chizilib chiqadi va ustida to'rt katak
birin-ketin paydo bo'ladi, har birining tepasida o'z nomi turadi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Varaq chizilib bo'lgunicha gapirmang — vizualning o'zi tanishtiradi.
Kataklar ichi bo'sh: nima yozilishini sinf keyingi ekranlarda topadi.
```

**Chizilib chiqadigan varaq (o'z-o'zidan, 18/42-qonun):**

| Ekranda ko'rinadigan katak |
|---|
| 🔴 Muammo |
| 👤 Kim |
| 🛠 Yechim |
| 📊 O'lchov |

> 🔴 **Korpus §125 (maqsad-ekran natijani NOMLAYDI, ko'rsatmaydi):** kataklar **bo'sh** chiziladi — ichida birorta javob yozilmaydi. Aks holda s4 dagi kashfiyot oldindan ochilardi.
> 🔴 **§126:** «PRD» bu ekranda **0** — natija sodda so'z bilan nomlanadi: «bitta varaq», «to'rt katak».
> 🔴 **§40:** «shu modulda quradigan tizimingiz» — o'quvchida to'liq tizim hali yo'q; «tizimingiz ishlab turibdi» kabi gap YOZILMAYDI.
> 🔴 **54(b/c):** `ta-sub` ikkinchi qator YO'Q, varaq ostidagi caption YO'Q.
> 🔴 **42-qonun:** suyuqlik-fe'li yo'q — «chizilib chiqadi», «paydo bo'ladi» (❌ suyuqlik-fe'li).
> 🔴 **Ekran-o'lchovi:** proza **113 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (bir varaq) + 3 × Quiz
EKRAN: Og'zaki aytilgan gapni har kim o'zicha tushunadi — yozilgan qatorni hamma bir
xil o'qiydi. Shuning uchun ish kod bilan emas, yozilgan qator bilan boshlanadi.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) uch dasturchining ishini ochadi,
keyin murabbiyga to'rt savolni birma-bir beradi va varaq to'ldirilgach qayta qurishni
ko'radi; (s6) keys-slaydlarini bashorat bilan ochadi.
JAVOB: s4 — to'rt savol ham berilgan, to'rt katak ham yozilgan.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar odatda birinchi bosqichda to'xtaydi. Uchala ilova ochilgach
so'rang: «murabbiydan nimani so'rash kerak edi?» — savol-tugmalari shu lahzada ochiq.
```

**s2 — TEORIYA-1: og'zaki gap ↔ yozilgan qator** (korpus §73: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Og'zaki aytilgan gap va yozilgan qator — farqi nimada?»**

Mentor (≤2 gap, 32b):
> Bitta buyurtma ikki ko'rinishda turibdi. Ikkala kartani bosib solishtiring.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 🗣 **Og'zaki aytilgan** | Gap aytilib bo'lgach yo'qoladi. Qolgan bo'sh joyni har kim o'z boshida to'ldiradi |
| 📄 **Varaqqa yozilgan** | Gap joyida qoladi. Uch kishi ham bir xil qatorni o'qiydi |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik qoida):
> **Og'zaki aytilgan gapni har kim o'zicha tushunadi — yozilgan qatorni hamma bir xil o'qiydi.** Shuning uchun ish kod bilan emas, yozilgan qator bilan boshlanadi.

> 🔴 **39-qonun qolipi:** avval hodisa (ikki karta), keyin qoida. Sarlavhada yangi atama YO'Q ✓.
> 🔴 **§109:** qoida zamon-iborasi bilan («aytilgan gapni har kim…»), yasama ot emas (§103).
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan.
> 🔴 **§20/§52 kaskadi:** shu ikki gap flashcard-1, RECAPS (s3) va s15 yakun-ro'yxatida **so'zma-so'z** takrorlanadi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **288 grapheme** proza (karta matnlari — mashq-materiali, sanalmaydi) ✓.

**s4 — YADRO: BIR VARAQ** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«To'rt savolni bering va varaqni to'ldiring.»**

Mentor (≤2 gap, 92a):
> Chapda murabbiy, o'ngda bo'sh varaq. Har savolni bosing — javob o'z katagiga yozilib chiqadi.

> 🔴 **98b:** mentor to'rt savolning javobini AYTMAYDI — javoblar bosilgandan keyin chiqadi; birinchi bosqichda uch ilova nega yetmaganini ham mentor aytmaydi, fakt-qatorlar aytadi.
> 🔴 **106d/71:** har harakatga javob darhol: 1-bosqichda uch fakt-qator, 2-bosqichda katakka yozilgan qator. O'quvchi natijani o'qiydi, o'ylab qolmaydi.
> 🔴 **72-qonun:** to'rt savol-tugmasi yorliqli idishda («Murabbiydan so'rang»), diqqat-signali bilan; birinchi savoldan keyin signal tinadi.
> 🔴 **§106 (test ko'chirma bo'lmasin):** ekranda **umumiy qoida yozilmaydi** — «to'rt katak ham to'lmasa dasturchi o'zicha yozadi» degan formula s4 da YO'Q; uni bola s5/s11 testlarida o'zi chiqaradi, reveal muhrlaydi.
> 🔴 **§95 (raqamning manbasi):** ekrandagi yagona raqam — «10 tadan 2 taga» (murabbiyning javobi) va u s10 kodida qaytadi; boshqa raqam yo'q.
> 🔴 **Atama tug'ilishi (§104):** «PRD» — ekranning oxirgi qatori, ikkinchi bosqich yakunlangandan KEYIN. Qavs ichida emas, alohida gapda (§133).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + ikki yakun-qatori + atama-gapi = **364 grapheme** ✓ (fakt-qatorlar va murabbiy javoblari — mashq-materiali).

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Tizimingiz uchun bir varaq to'ldiring.
(mentor, 1 gap) Har katakning bitta savoli bor — javobini bitta qatorda yozing.
HARAKAT: To'rt katakni BITTALAB to'ldiradi. Har qadamda ekranda bitta katak turadi:
tepasida katak nomi va savoli, ostida bitta maydon va jonli javob-qatori. Saqlaganda
qator varaqning o'z katagiga ko'chadi va keyingi katak ochiladi.
JAVOB: To'rt katak ham yozilgan · O'lchov katagida son bor · har katakda bitta qator ·
Yechim katagi Muammo katagini takrorlamaydi · Kim katagida «hamma» yolg'iz turmaydi.
RO'YXAT: To'rt katak ham to'ldirilgan · O'lchov katagida son bor · Har katakda bitta qator
YULDUZCHA: Varag'ingizni ovoz chiqarib o'qing — to'rt qator bitta ish haqida gapiryaptimi?
YORDAM: Ikki savol bering: kimdir shu ishdan qiynalyaptimi? Qiynalgani sonda
ko'rinadimi? Javoblar ikki katakni to'ldiradi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Tizimini hali tanlamagan o'quvchi bo'ladi. Unga ayting: M5 da qurgan
Telegram-botini olsin — u ham shu tizimning bir bo'lagi, varaq o'sha bot uchun
to'ldiriladi. Ikkinchi tez-tez uchraydigan holat — O'lchov katagida son yo'q; javob-qatori
uni tutadi, siz sinfdan so'rang: buni nima bilan sanaymiz?
```

🔴 **Kirish-artefakt YO'Q — zaxira-tarmoq ham YO'Q** (korpus §69, modul-chegara): ekran
«oldingi darsdan kelgan ish» haqida umuman gapirmaydi. Boshlanish to'g'ridan-to'g'ri:
«Tizimingiz uchun bir varaq to'ldiring.» — «topilmadi / saqlanmagan / bo'sh» so'zlari **0**.

🔴 **Yozish-kartasi (80b) — bitta karta, to'rt qadam ichida:**

| Qadam | Katak · savoli | Ipucha (placeholder — korpus §32/§115: qisqa savol, tayyor javob YO'Q) |
|---|---|---|
| 1 | 🔴 Muammo · Nima qiynayapti? | `Odamni nima qiynayapti?` |
| 2 | 👤 Kim · Kim qiynalyapti? | `Kim qiynalyapti?` |
| 3 | 🛠 Yechim · Nima quriladi? | `Nima quriladi?` |
| 4 | 📊 O'lchov · Qaysi son o'zgaradi? | `Qaysi son o'zgaradi?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12;
106d ikki tomonlama; §130 — ✅-qatori faqat ROST narsani aytadi):**
- ✅ O'lchov katagida son topilsa → «✅ O'lchov katagida son bor — ish bajarilganini shu sondan bilib olasiz.»
- ✅ qolgan uch katakda → «✅ Yozildi — bu katakda endi bitta qator bor.»
- 🤔 Muammo katagida faqat sifat (*yaxshi · qulay · chiroyli · zamonaviy*) → «Bu hali muammo emas. Odam nimadan qiynalyapti — shuni yozing.»
- 🤔 Kim katagida yolg'iz «hamma» yoki «foydalanuvchilar» → «"Hamma" — bu kim? Yoshi, joyi yoki ishi bilan ayting.»
- 🤔 Yechim katagi Muammo katagining qatorini takrorlasa → «Bu qator yuqorida turibdi. Bu yerda nima QURILISHI yoziladi.»
- 🤔 O'lchov katagida son yo'q → «Bu katakda son bo'lishi kerak: nechta, necha daqiqa yoki necha kun.»
- holat ko'rsatkichi (106c-b): «4 tadan 2 tasi yozildi»

🔴 **Bo'sh-so'zlar ro'yxati** (106d(c), dars o'z lug'atidan): *yaxshi · qulay · chiroyli ·
zamonaviy · qiziqarli*. O'quvchi katakka faqat shularni yozsa — savol qaytariladi.
Bloklamaydi — yo'naltiradi.

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **102 grapheme** ✓ (javob-qatorlar harakatdan keyin,
bittadan chiqadi).

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (katak-tekshiruv)
EKRAN: (topshiriq) Har varaqda javobsiz katakni toping.
(yo'riqnoma) Katak to'ldirilgan ko'rinadi, lekin qatori o'z savoliga javob bermaydi.
Shu katakni bosing.
HARAKAT: Uch varaq birin-ketin keladi (basseyn tizimining uch bo'limi). Har varaqda
to'rt katak yozilgan; o'quvchi bittasini bosadi. Tanlovdan keyin sabab va to'g'ri
qator ochiladi, keyingi varaq keladi.
JAVOB: 1-varaq — Yechim katagi · 2-varaq — Kim katagi · 3-varaq — O'lchov katagi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Har katakni o'z savoli bilan qo'shib o'qing:
qatori shu savolga javob beryaptimi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda ishlating: har o'quvchi sherigining varag'idagi O'lchov katagini
o'qib, «bu sonni qayerdan bilib olasiz?» deb so'raydi. Javob topilmasa — qator qayta
yoziladi.
MENTORGA: Eng ko'p adashiladigan joy — 2-varaq: «Hamma foydalanuvchilar» qatori
to'ldirilganday ko'rinadi. Bola adashsa, savolni qaytaring: bu odamlarni ko'chada
tanib olasizmi?
```

**Uch varaq (yangi sahna: o'sha basseyn tizimining boshqa uch bo'limi — s4 varag'idan BOSHQA to'plam):**

**1-varaq — 📅 «Murabbiy uchun kunlik ro'yxat»**

| Katak | Yozilgan qator | Holat |
|---|---|---|
| 🔴 Muammo | Murabbiy kim kelishini kun boshida bilmaydi | to'g'ri |
| 👤 Kim | Basseynda ishlaydigan uch murabbiy | to'g'ri |
| 🛠 Yechim | Murabbiyning ishini oson qiladigan ilova | 🔴 **javobsiz** |
| 📊 O'lchov | Bilmay qolgan kun 5 tadan 1 taga tushadi | to'g'ri |

Sabab-qatori: «"Ishini oson qiladigan ilova" — nima qurilishi hali aytilmagan. To'g'ri qator: "Har murabbiyga kunlik ro'yxatni ko'rsatadigan sahifa".»

**2-varaq — 🔔 «Mashg'ulotdan oldin eslatma»**

| Katak | Yozilgan qator | Holat |
|---|---|---|
| 🔴 Muammo | Odam o'zi band qilgan vaqtni o'tkazib yuboradi | to'g'ri |
| 👤 Kim | Hamma foydalanuvchilar | 🔴 **javobsiz** |
| 🛠 Yechim | Vaqtdan 15 daqiqa oldin xabar yuboradigan bot | to'g'ri |
| 📊 O'lchov | O'tkazib yuborilgan vaqt 12 tadan 3 taga tushadi | to'g'ri |

Sabab-qatori: «"Hamma foydalanuvchilar" — bu kim? Yoshi, joyi yoki ishi bilan aytilsa katak yoziladi: "Joyni band qilib, boshqa ishga ketadiganlar".»

**3-varaq — 🏊 «Guruh tanlash»**

| Katak | Yozilgan qator | Holat |
|---|---|---|
| 🔴 Muammo | Odam o'zi xohlagan guruhga tusholmaydi | to'g'ri |
| 👤 Kim | Bitta murabbiyga o'rganib qolganlar | to'g'ri |
| 🛠 Yechim | Joy band qilayotganda guruhni tanlaydigan ro'yxat | to'g'ri |
| 📊 O'lchov | Odamlar tanlovdan mamnun bo'ladi | 🔴 **javobsiz** |

Sabab-qatori: «Mamnunlikni sanab bo'lmaydi. Son bilan aytilsa katak yoziladi: "O'z guruhini tanlaganlar 10 tadan 7 taga chiqadi".»

O'tish-gap (22-qonun — yangi to'plam ochiq aytiladi, mentor 1 gap):
> Varag'ingiz tayyor — endi o'sha to'rt savolni basseyn tizimining boshqa uch bo'limida qo'llaymiz.

Yakun-qatori:
> ✅ **Uch varaqda uch xil javobsiz katak chiqdi: nima qurilishi aytilmagan · kim ekani aytilmagan · son aytilmagan.**

> 🔴 **26/59-qonun — farq-dalili:** m4-12 «sxema-shart tekshiruvi» da o'quvchi **tashqi shartlar ro'yxatini** yuritib ikki nuqson sanardi; m4b-02 «nosozlik-navbati» da **kartani javonga joylardi**; M3-D2 «tekshiruvchi stoli» da tayyorga **✓/✕ hukm** qo'yardi. Bu yerda tashqi shart ham, javon ham, ✓/✕ tugmasi ham YO'Q: mezon — **katakning O'Z savoli**, harakat — to'rttadan bittasini **bosish**, natija — javobsiz katakning nomi ochiladi.
> 🔴 **§120 (material har shart uchun bitta javobni himoyalasin):** har varaqda qolgan uch katak o'z savoliga aniq javob beradi — 1-varaqda O'lchov katagida o'zgaradigan son bor («5 tadan 1 taga»), 2-varaqda Yechim aniq («15 daqiqa oldin xabar yuboradigan bot»), 3-varaqda Kim aniq («bitta murabbiyga o'rganib qolganlar»). Ikkinchi javobni himoyalash imkoni yo'q.
> 🔴 **Uch javobsiz katak — uch xil sinf** (§64 ruhi): yechim aytilmagan · odam aytilmagan · son aytilmagan. Bitta xato-sinf takrorlanmaydi, shuning uchun bola naqsh bilan topolmaydi.
> 🔴 **106d + korpus §77/§98:** noto'g'ri tanlovda javob DOIM ochiladi: «🤔 Bu katak o'z savoliga javob berib turibdi. Qolgan kataklarni savoli bilan qo'shib o'qing.» — qoida beriladi, to'g'ri katak AYTILMAYDI; YORDAM faqat birinchi xatodan keyin.
> 🔴 **Sahna yangi, olam o'sha (91-qonun):** basseynga joy band qilish (s4) → o'sha tizimning uch bo'limi (s9); to'plam s4 varag'ini takrorlamaydi (§102: testda va mashqda ekran-ko'chirma yo'q).
> 🔴 **§134/§135C:** javobsiz katak **rang bilan emas**, qatorining ma'nosi bilan topiladi; ekranda hech qanday rang-legendasi talab qilinmaydi, uchala varaqda ham kataklar bir xil ko'rinadi.
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda) · **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **128 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code-topshiriq — R1 navbati)
EKRAN: (sarlavha) Bo'sh katakni topadigan kod yozamiz.
(mentor, 2 gap) Qatorning ma'nosini odam o'qiydi, kod esa umuman yozilmagan katakni
topadi. Varaq kodda oddiy obyekt bo'lib turadi.
HARAKAT: yozilmaganKataklar(varaq) funksiyasini to'ldiradi: qiymati bo'sh bo'lgan kataklar
nomini ro'yxat qilib qaytaradi. Uch varaqda tekshiradi.
JAVOB: Uch natija to'g'ri chiqadi: ["olchov"] · ["muammo","kim"] · [].
RO'YXAT: Funksiya ro'yxat (massiv) qaytaradi · Bo'sh katakning nomi ro'yxatga tushadi ·
Uch natija to'g'ri chiqdi
YULDUZCHA: tayyormi(varaq) funksiyasini qo'shing: bo'sh katak bo'lmasa true, aks
holda false qaytarsin.
YORDAM: Bitta katakdan boshlang: varaq1.olchov bo'shmi? Ishlagach qolgan uchtasiga
o'ting.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod ma'noni o'qiy olmaydi — u faqat yozilmagan katakni topadi. Shuni ochiq
ayting: s9 dagi ish odamniki, bu ish esa mashinaniki. Nusxalash yopiq —
sababini ayting: qo'lda yozganda o'rganiladi.
```

> 🔴 **87-qonun (o'tilgan texnik material):** obyekt, `const`, massiv, `for`, `if`, `push`, `console.log` — hammasi M2 da o'tilgan; `node` buyrug'i M4/M5 da ishlatilgan. m6-01/03/04 atamalari topshiriqqa KIRMAYDI.
> 🔴 **26-qonun / R1:** m5-11 kompilyator → **m6-02 VS Code** — registr navbati, senariy o'zgartirmaydi.
> 🔴 **82-qonun (VS Code qolipi):** panel (yo'riq + darvoza-mashq + bitta tugma) CHAPDA, kod O'NGDA · preview/mock-panel YO'Q — natijani o'quvchi o'z terminalida `node` bilan ko'radi · kod nusxalanmaydi (`user-select: none`, `onCopy`/`onPaste` yopiq, «🔒 qo'lda yoziladi» belgisi) · honor-checklist YO'Q, darvoza — darsning o'z mini-mashqi (7-bo'lim) · sinf-holati (👥 Sinfda…) bu ekranda o'quvchiga ko'rinmaydi (82f).
> 🔴 **§134 (taqiq-atamasiz ko'prik):** «Kodni **`node`** buyrug'i bilan yurgizgansiz» — «server» so'zi ishlatilmaydi.
> 🔴 **Korpus §19/§48:** sarlavha «…digan **kod** yozamiz» oilasidan, natijani aytadi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **152 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Qaysi katak eng qiyin bo'ldi?
(mentor) Varag'ingizdagi qaysi katak eng qiyin bo'ldi va nega? Avval sherigingizga
ayting, so'ng shu javobni bir qatorda yozing.
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
MENTORGA: Uchdan biri katak nomlarini eslay olmasa — s4 ekranini qayta oching va
to'rt savolni birga o'qing.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — **«O'zingizni sinab ko'ring.»** (platforma etaloni; §105/§121 tekshirildi: «sin-» ildizi bu darsda boshqa ma'noda ishlatilmaydi — dars fe'llari «to'ldirish · so'rash · qurish · yozish»).
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, so'ng shu javobni bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **76-qonun:** mentor niyatni ochiq aytadi; «o'z so'zi bilan» kabi mavhum ibora YO'Q.

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda varag'ingizni bir odamga o'qib berasiz — u qayta so'ragan katakni
yangidan yozasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
HARAKAT: Varaqni uyidagi yoki sinfidagi bir odamga o'qib beradi; o'sha odam qayta
so'ragan katakni topadi va shu katakning qatorini qaytadan yozadi.
JAVOB: —
RO'YXAT: Varaq odamga o'qib berilgan · Qayta so'ralgan katak topilgan ·
O'lchov katagida son bor
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: O'lchov katagidagi sonni qayerdan bilib olishingizni bitta qatorda
yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»); shart-yorliq («Koding uyga qolsa») YO'Q.
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «to'rt katak» sanog'i faqat To'liq-kartada.
> 🔴 **Korpus §125 (kuzatiladigan hodisa):** «qayta so'ragan katak» — kuzatib bo'ladigan hodisa; ❌ «tushunmasa» kabi ichki holat emas.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — katak yozish s8 da, javobsiz katakni topish s9 da bajarilgan.

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
MAVZU: Og'zaki gap bilan yozilgan qatorning farqi; PRD nima va qachon to'ldiriladi;
to'rt katak va ularning savollari; qaysi qator qaysi katakka tushadi; O'lchov
katagida son bo'lishi; bo'sh qolgan katakni dasturchi o'zicha yozishi; Geyts va
Allen telefon qilgan payt (1975) va til qachon yozilgani; ko'rsatuv birinchi
urinishda ishlagani; varaqni kim to'ldiradi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §106 (kalit slayddan ko'chirilmaydi) · §110 (mutlaq so'z / kulgili-bo'sh yo'q) · §118 (cheklov-so'zsiz) · §129 (kalit xulosadan emas — savol odam harakatiga o'giriladi). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 📝 Buyurtmani og'zaki eshitdingiz. Ish boshlashdan oldin birinchi nima qilasiz?
- A. Eng qiyin qismidan kod yozaman *(31)*
- **B.** Eshitganimni qatorga yozib olaman ✅ *(33)*
- C. Ikki kun o'ylab, keyin boshlayman *(31)*

**Reveal:** To'g'ri — yozilgan qator hammada bir xil turadi, og'zaki gap esa har kimning boshida boshqacha.

> 🔴 **§129:** savol s2 xulosasini so'ramaydi, uni **qo'llashga** majbur qiladi — uchala variant ham «odam harakati» shaklida, kalit reveal'da qoladi.
> 🔴 **§102:** A va C darsning birorta ekranida rost bo'lib ko'rinmaydi, lekin ikkalasi ham ishonarli: birinchisi «avval kod» odati, ikkinchisi «avval yaxshilab o'ylash» odati. Uzunlik: 31 · 33 · 31 (tell 1.06 ✓).
> 🔴 **§99:** uchalasi ham «nima qilasiz?» savoliga birinchi shaxsda javob beradi va bir xil qolipda tugaydi.
> 🔴 **62/126:** savolda ham, variantlarda ham «PRD» YO'Q — atama hali tug'ilmagan.

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 📊 «Qaysi son o'zgaradi?» katagiga qaysi qator yozilishi mumkin?
- A. Ilova ochilishi qulay bo'ladi *(29)*
- **B.** Kunda 30 odam joy band qiladi ✅ *(30)*
- C. Murabbiylar ilovadan mamnun *(28)*

**Reveal:** To'g'ri — bu katakda sanab bo'ladigan son turadi; qulaylikni ham, mamnunlikni ham sanab bo'lmaydi.

> 🔴 **§106:** to'g'ri javob s4 ekranidan ko'chirilmagan — u yerda «10 tadan 2 taga» turibdi, bu yerda butunlay boshqa son va boshqa qator; bola qoidani **qo'llaydi**.
> 🔴 **§102:** A va C hech bir ekranda yozilmagan, lekin ikkalasi ham «yaxshi natija» bo'lib eshitiladi — ya'ni darsning o'lchov-qoidasini tushungan bola ularni rad etadi.
> 🔴 **§99/§133:** uchala variant ham bir qolipda — darak gap, «…adi/…ladi» bilan tugaydi; tinish-shakl bir xil, tire yo'q. Uzunlik: 29 · 30 · 28 (tell 1.03 ✓).
> 🔴 **§127:** darsning atamasi («katak») savolning O'ZIDA turadi, variantlarni ajratmaydi — kalit-so'z bilan topish yo'li yopiq.

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 💾 Geyts va Allen yozgan tilning ko'rsatuvi qanday o'tdi?
- A. Uchinchi urinishda ishladi *(25)*
- B. Bir hafta kechiktirildi *(24)*
- **C.** Birinchi urinishdayoq ishladi ✅ *(28)*

**Reveal:** To'g'ri — hech qachon ko'rmagan kompyuter uchun yozilgan til birinchi urinishdayoq ishladi. Nima qurilishi oldindan aniq aytilgan edi.

> 🔴 **§124 (ball-javob — sof bank-fakti):** to'g'ri javob bankdagi gapning o'zi (ko'rsatuv birinchi urinishda ishlagani); darsga bog'laydigan xulosa **reveal'da** qoladi.
> 🔴 **§102/§106:** A va B bankka zid, lekin ishonarli (yangi qurilma bilan birinchi urinish odatda ishlamaydi) — slaydni o'qigan bola ularni ishonch bilan rad etadi. To'g'ri javob birorta bashoratda so'ralmagan (bashorat-1 — tilning holati, bashorat-2 — qayerda sinalgani). Uzunlik: 25 · 24 · 28 (tell 1.12 ✓).
> 🔴 **§21:** savolda ham, variantlarda ham «Altair» va «BASIC» YO'Q — ballanadigan matnda izohsiz chet so'z qolmaydi.
> 🔴 **§99:** uchala variant ham «qanday o'tdi?» savoliga hodisa-gapi bilan javob beradi.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 📄 Varaqning «Kim qiynalyapti?» katagi bo'sh qoldi. Dasturchi endi nima qiladi?
- A. Ishni to'xtatib, kod yozmaydi *(29)*
- **B.** O'zi tanlagan odamga quradi ✅ *(27)*
- C. Boshqa uch katakni qayta yozadi *(31)*

**Reveal:** To'g'ri — bo'sh katak dasturchini to'xtatmaydi, u katakni o'zicha yozadi. Shuning uchun to'rttasi ham yoziladi.

> 🔴 **§102 (o'qiganni mukofotlaydi):** A darsning O'Z ekranida ochiq rad etilgan — s4 ning birinchi bosqichida uch dasturchi varaqsiz ham qurgan edi; ya'ni s4 ni ko'rgan bola A ni ishonch bilan chiqarib tashlaydi.
> 🔴 **§129:** savol xulosani emas, **odam harakatini** so'raydi; uchala variant ham dasturchining harakati. Uzunlik: 29 · 27 · 31 (tell 1.15 ✓).
> 🔴 **§110:** mutlaq so'z birorta variantda yo'q; kulgili-bo'sh variant yo'q — uchalasi ham hayotda uchraydigan xulq.
> 🔴 **§134 (son-echo yo'q):** savolda son yo'q, javobda ham yo'q — kalit sonni takrorlab topilmaydi.

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan (✅ savol oldida turmaydi).
> 🔴 **§107:** birorta savol ha/yo'q shaklida emas — shakl-telli tug'ilmaydi.
> 🔴 **§108:** hech bir savol o'quvchini o'zi rost deb bilgan narsani rad etishga majburlamaydi — to'rttasi ham darsning o'z fe'li yo'nalishida.

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda to'rt doira — yozilgani yashil ✓ va ostida katak nomi,
joriysi indigo halqada, kelgusi kulrang-punktir; oradagi chiziq yashillanib boradi.

**Yozuv-kartasi (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida uch qatlam:
katak nomi (🔴 Muammo) → katakning savoli («Nima qiynayapti?») → bitta matn-maydoni va
ostida jonli javob-qatori. Boshqa hech narsa: qoida-ro'yxati YO'Q, namuna-paneli YO'Q,
ost-eslatma YO'Q (106d(d)).

**Yozilganlar (80c):** yozish paytida varaq KO'RINMAYDI — faqat indikator chirog'i yonadi;
to'rttasi ham yozilgach varaq to'liq enda ochiladi (✎ tahrir shu yerda). Saqlangan varaq
ko'rinishi — s1 da chizilgan varaq bilan bir shaklda, endi kataklari to'ldirilgan.

**Ipuchalar (92c/85 · korpus §32/§115):** to'rttasi ham qisqa savol — `Odamni nima
qiynayapti?` · `Kim qiynalyapti?` · `Nima quriladi?` · `Qaysi son o'zgaradi?`. Tayyor javob
maydonda TURMAYDI, namuna-tugma YO'Q (85-qonun: namuna kerak bo'lsa mentor gapida bir marta).

**106d javob (ikki tomonlama, §130 bilan):** ✅ qatori faqat CHINDAN tekshirilgan narsani
aytadi — O'lchov katagida son topilsa «✅ O'lchov katagida son bor — ish bajarilganini shu
sondan bilib olasiz.», qolgan uch katakda esa «✅ Yozildi — bu katakda endi bitta qator bor.»
(ya'ni mazmun tekshirilmagan joyda mazmun maqtalmaydi).

**Bo'sh-so'zlar ro'yxati** (106d(c), dars o'z lug'atidan): *yaxshi · qulay · chiroyli ·
zamonaviy · qiziqarli*. O'quvchi katakka faqat shularni yozsa — savol qaytariladi
(bloklamaydi, yo'naltiradi).

**Takror-sharti:** Yechim katagining qatori Muammo katagining qatori bilan so'zma-so'z bir
xil bo'lsa — yumshoq hint: «Bu qator yuqorida turibdi. Bu yerda nima QURILISHI yoziladi.»
Bu darsning ikkinchi yarmi: muammoni qayta aytish yechim emas.

**«Hamma»-sharti:** Kim katagida yolg'iz «hamma», «hamma odam» yoki «foydalanuvchilar»
qolsa — savol qaytariladi. Bu shart s9 ning 2-varag'i bilan bir tilda gapiradi (bir mashq —
bir mezon).

**92d (majburiy maydon):** to'rt katak ham o'quvchida ANIQ bor ma'lumot so'raydi — tizimi
haqidagi o'z fikri. Tashqi ma'lumot (havola, hisob nomi, sayt manzili) so'ralmaydi.

**Rels:** unscored · `PRACTICE_BASE + screen` signali · `practice: -1` sentinel
(`INLINE_KEYS`) · `MentorPracticeStats` + `StudentPracticePulse` + mentor-bypass (31-qonun) ·
4-saqlashda ekran O'ZI bajarildi (honor-tugma YO'Q).

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K7 · 91b/33/42/43/56 + keys-ekran qoidasi)

**Freym (91b):** eyebrow — **«💾 Haqiqiy voqea»**, K-kodi ekranga chiqmaydi.

🔴 **Bosqich-hisoblagichi (uzluksiz — 17-ov b):** eyebrow har bosqichda bitta hisoblagich
bilan turadi — «💾 Haqiqiy voqea · 1/7» … «7/7». Bosqichlar: slayd-1 · bashorat-1 · slayd-2 ·
slayd-3 · bashorat-2 · slayd-4 · ko'prik-gap. Bashorat javobidan keyin hisoblagich yo'qolmaydi,
uzuq raqam qolmaydi (naqsh: `PmLesson9.jsx` s6).

🔴 **Jonli son-hisoblagichi YO'Q** — K7 bankda «raqamsiz» belgili keys (M4-D7 · M4c-D6 ·
M5-D8 pretsedenti). Sanaladigan raqam yo'q, demak jonli hisoblagich ham qo'yilmaydi;
`prefers-reduced-motion` da bosqich-hisoblagichi statik qoladi.

**4 slayd (hikoya tilida — 42-qonun · korpus §42):**

1. **1975-yil.** Ikki yigit — Bill Geyts va Pol Allen — jurnalda yangi kompyuter haqida o'qib qoldi. Uning nomi Altair edi.
2. *(bashorat-1 dan keyin)* **Telefon qo'ng'irog'i.** Ular Altairni chiqargan kompaniyaga qo'ng'iroq qilib aytdi: «Bizda shu kompyuter uchun BASIC tili bor». BASIC — kompyuterga buyruq yozadigan til. O'sha paytda bu til hali yozilmagan edi.
3. **Bir necha hafta.** Qo'ng'iroqdan keyin ular tilni bir necha haftada yozdi.
4. *(bashorat-2 dan keyin)* **Ko'rsatuv kuni.** Ular haqiqiy Altairga bir marta ham tegmagan edi — ko'rsatuv birinchi urinishdayoq ishladi. Microsoft shundan boshlandi.

**Bashorat-1 (2-slayddan oldin · 1-o'lchov: HOLAT — qo'ng'iroq paytida til qay holatda edi):**
- «Tayyor turgan edi» *(19)*
- «Yarmi yozilgan edi» *(20)*
- «Hali yozilmagan edi» ✅ *(21)*

**Bashorat-2 (4-slayddan oldin · 2-o'lchov: JOY — qayerda sinab ko'rishdi):**
- «Do'kondan Altair olib, uyda» *(26)*
- «Zavodga borib, o'sha yerda» *(25)*
- «Altairga umuman tegmasdan» ✅ *(25)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! …» — quyruqsiz; adashsa
«Adashdingiz — asl javob: …». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq
«🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — to'liq nom bilan, darsga qaytadi):**
> Ular ishni bitta gapdan boshladi: nima qurilishi va qaysi kompyuter uchun ekani o'sha gapda aytilgan edi. Sizning varag'ingiz — o'sha gapning to'rt katakka yozilgan shakli. Buni kod emas, mahsulotni o'ylaydigan odam yozadi.

> 🔴 **10-qonun (keys-sadoqati — tekshirildi):** bankda bor — 1975-yil · Geyts va Allen yangi kompyuter Altairni ko'rgani · ishlab chiqaruvchiga qo'ng'iroq va «bizda BASIC bor» gapi · tilning hali yo'qligi · bir necha haftada yozilgani · haqiqiy Altairga tegmagani · ko'rsatuvning birinchi urinishda ishlagani · Microsoft shundan boshlangani. **Bankdan tashqari birorta fakt yoki raqam YO'Q**; yagona sana — 1975.
> 🔴 **§101 (bankda yo'q da'vo yozilmaydi):** slaydlarda «ular hujjat yozgan», «ular reja tuzgan», «kompaniya ishondi» kabi gaplar **yo'q** — bank bular haqida jim. Ko'prik-gapdagi «nima qurilishi va qaysi kompyuter uchun ekani» — bankdagi gapning O'ZIDA turibdi («shu kompyuter uchun BASIC tili»), yangi fakt emas.
> 🔴 **§124 (chegaralangan inkor):** «BASIC hali yozilmagan edi» — bank AYNAN shuni aytadi; «hech narsa tayyor emas edi» kabi kengaytirilgan inkor YOZILMAYDI.
> 🔴 **§123 (bashorat-chipida izohsiz atama tug'ilmaydi):** bashoratlarda «BASIC» so'zi YO'Q — bashorat-1 «til» deb so'raydi va uning glossi 2-slaydda beriladi; bashorat-2 da «Altair» turadi, lekin uning glossi 1-slaydda **allaqachon** berilgan (ya'ni gloss oldin, atama keyin).
> 🔴 **§132 (bashorat-slaydi javobni oldindan aytmasin):** 1-slayd tilning holati haqida hech narsa demaydi (bashorat-1 shuni so'raydi); 3-slayd esa qayerda sinalgani haqida jim (bashorat-2 shuni so'raydi).
> 🔴 **Bashorat halolligi (17/43/64):** har bashorat bitta o'lchovning uch darajasi; hech biri boshqa slaydda rost bo'lib chiqmaydi; «≥2 bashorat ikki o'lchovda» sharti bajarildi (holat + joy). Uzunlik-telllari: bashorat-1 21 ÷ 20 = 1.05 ✓ · bashorat-2 da to'g'ri javob eng uzun EMAS (25 ↔ 26) ✓.
> 🔴 **Pul-qoidasi:** K7 raqamsiz — darsda dollar, foiz yoki o'sish soni umuman aytilmaydi; shaxsiy boylik ham aytilmaydi (bank qoidasi).
> 🔴 **43-qonun:** slayd sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **Ko'prik:** slot-sanog'i yo'q (63) · «mahsulotni o'ylaydigan odam» — kurs bo'ylab bir xil ibora (M4-D2 · M4a-D2 bilan bir til).
> 🔴 **Ekran-o'lchovi:** eng uzun slayd (2-slayd) **196 grapheme**; bir vaqtda ekranda bitta slayd va eyebrow turadi — chegara 400 ✓.

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · VS Code)

**Darvoza-mashq (82e):** bitta savol-tanlov: «Qaysi katakda son bo'lishi shart?» →
«O'lchov katagida» ✅ *(16)* / «Muammo katagida» *(15)* / «Kim katagida» *(12)*.
Uchalasi ham bir turdagi javob (katak nomi + «katagida»), farq faqat MA'NOda (§129).
Tell: 16 ÷ 15 = 1.07 ✓.

**Boshlang'ich kod (§135D: qo'shtirnoq majburiy — o'zbek javobida apostrof bor):**

```js
// Bir varaq — to'rt katak
const NOMLAR = ["muammo", "kim", "yechim", "olchov"];

const varaq1 = {
  muammo: "Odamlar kelib, guruh to'lib qolganini ko'radi",
  kim: "Haftada ikki marta suzishga keladiganlar",
  yechim: "Bo'sh joyni ko'rsatib, joy band qiladigan ilova",
  olchov: ""
};

const varaq2 = {
  muammo: "",
  kim: "",
  yechim: "Kunlik ro'yxatni ko'rsatadigan sahifa",
  olchov: "Bilmay qolgan kun 5 tadan 1 taga tushadi"
};

const varaq3 = {
  muammo: "Odam band qilgan vaqtini o'tkazib yuboradi",
  kim: "Joyni band qilib, boshqa ishga ketadiganlar",
  yechim: "Vaqtdan 15 daqiqa oldin xabar yuboradigan bot",
  olchov: "O'tkazib yuborish 12 tadan 3 taga tushadi"
};

function yozilmaganKataklar(varaq) {
  const natija = [];
  // NOMLAR bo'ylab yuring: qiymati bo'sh bo'lsa, nomni natija ro'yxatiga qo'shing
  return natija;
}

console.log(yozilmaganKataklar(varaq1));
console.log(yozilmaganKataklar(varaq2));
console.log(yozilmaganKataklar(varaq3));
```

**Kutilgan uch natija (ekranda izoh bo'lib turadi):** `["olchov"]` · `["muammo", "kim"]` · `[]`

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. Funksiya ro'yxat (massiv) qaytaradi
2. Bo'sh katakning nomi ro'yxatga tushadi
3. Uch natija to'g'ri chiqdi (1 nom · 2 nom · bo'sh ro'yxat)

**YORDAM (yechimni aytmaydi — korpus §77):** Bitta katakdan boshlang: `varaq1.olchov` bo'shmi?
Ishlagach qolgan uchtasiga o'ting.

**YULDUZCHA:** `tayyormi(varaq)` funksiyasini qo'shing: bo'sh katak bo'lmasa `true`, aks holda
`false` qaytarsin. Uch varaqda tekshiring.

> 🔴 **Sanoq-mosligi (22-qonun):** kodda **uch varaq** va **to'rt katak** — s9 dagi uch varaq va s4/s8 dagi to'rt katak bilan AYNAN bir xil; `varaq2` va `varaq3` ning qatorlari s9 ning 1- va 2-varag'idan olingan (o'quvchi ko'z bilan topgan javobsiz katakni endi kodda uchratadi — korpus §95: materialning manbasi ko'rinadi).
> 🔴 **`varaq1` — s4 varag'i, `olchov` katagi ataylab bo'sh:** o'quvchi s4 da ko'rgan varaq kodda «bitta katagi yozilmagan» holatda keladi — darsning butun g'oyasi kod ichida takrorlanadi.
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`olchov` · `yozilmaganKataklar` · `NOMLAR`): kodda `olchov`, prozada «o'lchov». Artefakt-kaliti esa `metrika` (registr muhri) — u kodga ham, ekranga ham chiqmaydi ⚠️ GATE S 5-savoli.
> 🔴 **87-qonun:** obyekt + `for` + `if` + massiv-`push` — M2 materiali; `Object.keys` yoki `filter` bilan yozgan o'quvchiga ham ruxsat, ikkala yo'l JAVOB shartini bajaradi. `NOMLAR` massivi ataylab berilgan — obyekt kalitlarini aylantirish usulini bilish shart emas.
> 🔴 **§135D:** starter qo'shtirnoqda yozilgan — o'quvchi apostrofli o'zbek matnini qo'yganda kod sinmaydi.
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»); `onPaste` ko'p qatorli matnni qo'ymaydi.
> 🔴 **82(b):** preview-panel YO'Q — natijani o'quvchi `node` buyrug'i bilan o'z terminalida ko'radi (§134: «server» so'zi ishlatilmaydi).
> 🔴 **89-qonun:** takrorlash-yo'li (xira matn-havola) faqat erkin rejimda ko'rinadi.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Bo'sh varaq CSS-taymlayn bilan chizilib chiqadi, to'rt katak birin-ketin paydo bo'ladi (18-qonun). 🔴 Kataklar ichi BO'SH — javob yozilmaydi (§125) |
| **s12 REFLEKSIYA** | Sarlavha: «Qaysi katak eng qiyin bo'ldi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga» |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q (90b) |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Og'zaki aytilgan gapni har kim o'zicha tushunadi — yozilgan qatorni hamma bir xil o'qiydi.» · «Kod yozishdan oldin to'ldiriladigan bitta varaq — PRD.» · «To'rt katak: muammo, kim, yechim, o'lchov.» · «Bo'sh qolgan katakni dasturchi o'zicha yozadi.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |
| **Barcha ekranlar** | 🔴 88-qonun (navbat-signali): s2 ikki kartada **yurish**, s4 to'rt savol-tugmasida **yurish** (bosilgani navbatdan chiqadi), s9 to'rt katakda **to'lqin** (kataklar teng — bittasini yoritish javobni aytib qo'yardi), scored testlarda javobgacha YO'Q |
| **Barcha ekranlar** | 🔴 §114 (fon-dekor darsning o'z lug'atidan): arena canvas va `QZ_BG_SHAPES` tokenlari shu darsniki — `varaq` · `katak` · `qator` · `savol` · `o'lchov`; boshqa darsning atamalari (`shart`, `signal`, `yuk`, `kanal`) qolmasin |
| **Barcha ekranlar** | 🔴 §130 (ildiz platforma-matnida): «varaq» va «katak» ildizlari tizim-matnlarida (yuklanish yozuvi, podium, nav-yorliqlar) boshqa ma'noda ishlatilmaydi |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.
> 🔴 **To'g'ri javob indekslari (biriktirilgan sikl):** `0,3,2,1 · 1,0,2,3 · 0,2,1,3` —
> har indeks 3 martadan (3/3/3/3) ✓.

| # | Savol (qisqa) | Manba | Kalit |
|---|---|---|---|
| 1 | Og'zaki aytilgan gap bilan yozilgan qatorning farqi nima? | s2 | 0 |
| 2 | Kod yozishdan oldin to'ldiriladigan bir varaq qanday ataladi? | s4 | 3 |
| 3 | «Nima qiynayapti?» — bu qaysi katakning savoli? | s4 + s8 | 2 |
| 4 | «Kim qiynalyapti?» katagiga nima yoziladi? | s8 + s9 | 1 |
| 5 | «Nima quriladi?» katagiga nima yoziladi? | s4 + s9 | 1 |
| 6 | «Qaysi son o'zgaradi?» katagida nima bo'lishi shart? | s5 + s10 | 0 |
| 7 | Bitta katak bo'sh qolsa, dasturchi nima qiladi? | s11 | 2 |
| 8 | Varaqsiz bitta gapdan uch kishi nima qurdi? | s4 | 3 |
| 9 | Geyts va Allen qo'ng'iroq qilganda til qay holatda edi? | s6 | 0 |
| 10 | Geyts va Allen tilni qayerda sinab ko'rishdi? | s6 | 2 |
| 11 | Ko'rsatuv qanday o'tdi? | s6 + s7 | 1 |
| 12 | Varaqni kim to'ldiradi? | s6 | 3 |

> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q. «Altair» va «BASIC» arena savollariga ham, variantlariga ham **KIRMAYDI** — 9- va 10-savol «til» so'zi bilan yoziladi. **«PRD» arenada faqat 2-savolda**, va u savolning O'ZIDA emas, **javob** tomonida turadi: savol ta'rifdan boshlanadi («Kod yozishdan oldin to'ldiriladigan bir varaq qanday ataladi?») — ya'ni so'zni bilmagan bola ham savolni tushunadi (§21 ning eng xavfsiz shakli).
> 🔴 **§127:** 3-, 4-, 5-, 6-savollarda «katak» so'zi savolning o'zida turadi va variantlarni ajratmaydi — kalit-so'z bilan topish yo'li yopiq.
> 🔴 **§134 (son-echo va yakka-so'z):** 12-savolda son yo'q; 6-savolning to'g'ri javobi «son» so'zini ishlatadi, shuning uchun distraktorlarda ham «son» so'zi bo'ladi — yakka uchraydigan so'z qolmaydi.
> 🔴 **10-qonun:** 1975 sanasi savol matnining o'zida turadi, javob sifatida so'ralmaydi (M4-D2 saboqi: yod-sana bilim emas).

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Right Question!** | To'rt savolni murabbiydan o'zingiz so'radingiz | 46 | s4: to'rt savol ham berildi |
| **One Pager!** | To'rt katakni ham to'ldirdingiz | 30 | s8: 4/4 saqlandi |
| **Sharp Eye!** | Uch varaqda ham javobsiz katakni topdingiz | 42 | s9: 3/3 to'g'ri |
| **Code Check!** | Kod endi bo'sh katakni o'zi topadi | 33 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 31–46 belgi (§63 oralig'i, chegara 48) ✓.
> 🔴 **§100 (omonim-tekshiruvi):** «Right Question», «One Pager», «Sharp Eye», «Code Check» — kursning texnik lug'atida boshqa ma'no bermaydi. «Sheet» so'zi ataylab OLINMADI — M5 bot darslarida u jadval ma'nosida band.
> 🔴 **§101(c):** tavsif nishon nomining tarjimasi emas — har biri boshqa so'z bilan gapiradi.
> 🔴 **§93/§133 (tasdiq faqat REAL bajarilgan ishni aytadi):** «so'radingiz» (s4 da to'rt tugmani bosdi), «to'ldirdingiz» (s8 da to'rt katak saqlandi), «topdingiz» (s9 trigger — 3/3 **to'g'ri**, ya'ni chindan topgan), «kod endi o'zi topadi» (s10 da uch natija chiqdi). Xato javobda beriladigan nishon YO'Q.

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Og'zaki aytilgan gap bilan yozilgan qatorning farqi nima? | Og'zaki gapni har kim o'zicha tushunadi — yozilgan qatorni hamma bir xil o'qiydi |
| 2 | PRD nima? | Kod yozishdan oldin to'ldiriladigan bitta varaq |
| 3 | PRD ning to'rt katagi qaysi? | Muammo · Kim · Yechim · O'lchov |
| 4 | «Muammo» katagida nima turadi? | Odamni nima qiynayotgani |
| 5 | «Kim» katagida nima turadi? | Qiynalayotgan odamlarning aniq guruhi |
| 6 | «Yechim» katagida nima turadi? | Nima qurilishi |
| 7 | «O'lchov» katagida nima turadi? | O'zgarishi kerak bo'lgan son |
| 8 | Bitta katak bo'sh qolsa nima bo'ladi? | Dasturchi uni o'zicha yozadi |
| 9 | Geyts va Allen tilni qachon yozgan? | Telefonda aytilgandan keyin, bir necha haftada |
| 10 | PRD ning inglizcha to'liq nomi qanday? | Product Requirements Document — mahsulot talablari varag'i |

> 🔴 **Korpus §20/§52:** 1-karta javobi s2 xulosa-kartasi, RECAPS va s15 yakun-ro'yxatidagi kanonik qoida bilan **so'zma-so'z** bir xil; 2-karta javobi s4 dagi ta'rif-gapning o'zi.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **Korpus §76/§132:** 10-karta o'rgatilmagan inglizcha nomni SO'RAMAYDI — «PRD» s4 da ochilgan, karta uning to'liq shaklini so'raydi va javobda tarjimasi turibdi.
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (kanonik qoida · atama · to'rt katak · to'rt katakning mazmuni · bo'sh katak oqibati · keys-vaqti · inglizcha juftlik).
> 🔴 **107-qonun (havola):** javoblar gap shaklida — `t3`/`t4` pog'onasi va Manrope odatiy holat; alohida `.fc-tag` o'lchami YOZILMAYDI.

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Yozilgan qator hammada bir xil»** — (1) kanonik qoida (s2 xulosasi bilan so'zma-so'z) · (2) shuning uchun ish kod bilan emas, yozilgan qator bilan boshlanadi · (3) sinfga savol: «Bugun kimdir sizga og'zaki topshiriq berdimi — uni qanday yozib olardingiz?»

**s5 · «O'lchov katagida son turadi»** — (1) bu katak «Qaysi son o'zgaradi?» degan savolga javob beradi · (2) qulaylikni ham, mamnunlikni ham sanab bo'lmaydi — shuning uchun ular bu katakka tushmaydi · (3) savol

**s7 · «Avval aytilgan, keyin yozilgan»** — (1) Geyts va Allen ishni bitta gapdan boshladi: nima qurilishi va qaysi kompyuter uchun ekani o'sha gapda aytilgan edi (1975) · (2) hech qachon ko'rmagan kompyuter uchun yozilgan til birinchi urinishdayoq ishladi · (3) savol

**s11 · «Bo'sh katakni dasturchi o'zicha yozadi»** — (1) bo'sh katak ishni to'xtatmaydi — u jimgina boshqa odam tomonidan to'ldiriladi · (2) shuning uchun to'rttasi ham yoziladi · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** ❌ «K7 xulosasi» → «Microsoft misolida».
> 🔴 **§133:** RECAP-kartasining oxirgi bandi keyingi testning kalitiga aylanmaydi — s5 kartasi s11 javobini aytmaydi, s7 kartasi arena javoblarini aytmaydi.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham to'ldirilgan ✓
5. Bosh keys **K7** — M6 modulida ishlatilmagan (modul-ichi qoidasi, registr 4-bo'lim) ✓
6. TEKSHIRUV mexanikasi oldingi PM darsni takrorlamaydi — m5-11 «kun-belgilash» ↔ **m6-02 «katak-tekshiruv»** ✓
7. 2-shaxs birlik murojaati — **0** (butun senariy siz-formada) ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): basseyn guruhiga yozilish — s0 dan s10 gacha; keys 91b freymi bilan kiradi va ko'prik bilan qaytadi; o'quvchining O'Z tizimi faqat s8/s12/uy-vazifada ✓
- 95 (Toshkent o'smiri): basseyn/suzish to'garagi — o'smir o'zi boradi, «joy bormi?» savolini o'zi so'raydi ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas, Batch 5 ning uch darsi bilan ham kesishmaydi (grep bilan tasdiqlandi — shapka) ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m5-11 kompilyator → m6-02 VS Code) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat M2 materiali (obyekt · massiv · `for` · `if` · `push`) + `node` buyrug'i (M4/M5) ✓
- 29 (kelajak-atama oqmaydi): «metrika», «retention», «arxitektura», «mikroservis», «agent», «Skills», «pipeline», «user story» o'quvchi matnida **0** ✓
- 38 (boshqa darsga havola taqiqi): M4-D12, M2-D7, M3-D2 nomlari va atamalari o'quvchi matnida **0** — farq-dalili faqat senariy shapkasida ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q (hook-ostidagi mentor-izohi · `ta-sub` · demo-caption · keys oxiridagi ramka · uchinchi recap-qadami · `h-sub`) ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104: hook ikki tanlovi teng (25 ↔ 29 belgi, 1.16) ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda 1 gap) ✓
- 92d: majburiy maydonlar faqat o'quvchida ANIQ bor ma'lumot uchun (to'rt katak ham uning o'z fikri) ✓
- 33 (keys-ekran): 2 bashorat, ikki o'lchovda (holat + joy), bosqich-hisoblagichi uzluksiz ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN o'qildi — §99–136 bilan birga):**
1. **§20/§80/§85:** «varaq · katak · qator · gap» — to'rt kalit so'z, har biri bitta ma'noda; kanonik qoida 4 yuzada so'zma-so'z ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 «nima qilasiz?» → harakat · T2 qator · T3 hodisa-gapi · T4 dasturchi harakati) ✓
3. **§102:** distraktorlar darsning birorta ekranida rost bo'lib ko'rinmaydi; T4-A esa ekran ochiq RAD etadi — o'qiganni mukofotlaydi ✓
4. **§104/§126:** «PRD» s0/s1/s2/s3 da 0; birinchi ko'rinishi s4 ning oxirgi qatorida, ta'rif-gap shaklida ✓
5. **§105/§121 (bir ildiz — bir ma'no):** «varaq» faqat PRD · «katak» faqat varaqning bo'lagi · «qator» faqat katakka yozilgan matn · «gap» faqat og'zaki buyurtma · «bo'sh katak» faqat umuman yozilmagan katak, s9 dagi to'ldirilgan-u savoliga javob bermaydigani esa «javobsiz katak» (13-A A-bandi); «sin-» ildizi faqat platforma-sarlavhasida («O'zingizni sinab ko'ring») va dars ma'nosiga tegmaydi ✓
6. **§106/§129:** T1 s2 xulosasini qo'llatadi · T2 to'g'ri javobi s4 da yozilmagan · T3 bank-faktini so'raydi, xulosa reveal'da · T4 odam harakatini so'raydi ✓
7. **§107:** ha/yo'q-savol yo'q ✓
8. **§108:** hech bir savol rostni rad ettirmaydi ✓
9. **§109:** kanonik qoida zamon-iborasi bilan («aytilgan gapni har kim…»), §103: fe'l bilan, yasama otsiz ✓
10. **§110:** mutlaq so'z bir variantdan oshmaydi; kulgili-bo'sh variant yo'q ✓
11. **§111:** «degan javob» qurilmasi 0 ✓
12. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi birinchi bosqich ochilgandan keyin; s9 eslatmasi 2-varaqqa tegishli) ✓
13. **§114:** arena-fon/dekor so'zlari shu dars lug'atidan (varaq · katak · qator · savol · o'lchov) — quruvchiga brifda ✓
14. **§115:** to'rt ipucha ham bir gap-turida (savol); uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?») ✓
15. **§116:** s9 YORDAM-savoli har uch varaqning to'g'ri javobiga olib boradi («qatori shu savolga javob beryaptimi?» — yechim-, kim- va son-bo'shlig'ining uchalasini ham qamraydi) ✓
16. **§117:** metafora-so'z ballanadigan matnda tug'ilmaydi; yo'nalish-fe'llari real yo'nalishda; kesik omonim yo'q ✓
17. **§118:** distraktorlarda takror cheklov-so'zi yo'q («faqat», «hech qachon» — ballanadigan variantlarda 0) ✓
18. **§119:** hook payoffi ikkala tanlovni ham rost qoldiradi va ikkalasida yo'q narsani qo'shadi ✓
19. **§120:** s9 ning har varag'ida qolgan uch katak o'z savoliga aniq javob beradi — ikkinchi javobni himoyalash imkoni yo'q ✓
20. **§122/§124:** keys-raqami (1975) darsning ta'rifiga zo'rlanmagan; ball-javob sof bank-fakti; inkor chegaralangan ✓
21. **§123/§132:** demo-namuna (s1) bo'sh chiziladi · bashorat-chipida izohsiz atama yo'q · bashorat-slaydi javobni oldindan aytmaydi ✓
22. **§125:** maqsad-ekran natijani NOMLAYDI · hook-savoli o'quvchining o'z tilida · YORDAM mashq tartibiga bo'ysunadi · uy-vazifa kuzatiladigan hodisani aytadi («qayta so'ragan katak») ✓
23. **§127:** dars atamasi («katak») faqat to'g'ri variantda yashamaydi — u savolning o'zida turadi ✓
24. **§128:** shart/mezon darak gapda; s4 dagi namuna-javoblar s8 ning saqlash-shartidan o'tadi (to'rttasi ham bo'sh sifatsiz, O'lchov katagida son bor) ✓
25. **§130:** ✅-qatori faqat tekshirilgan narsani tasdiqlaydi · bosh atama ildizi platforma-matnida yashamaydi · checklist ma'noni so'raydi ✓
26. **§131:** atama karta-sarlavhasiga gloss'dan oldin chiqmaydi (s2 kartalari «Og'zaki aytilgan» / «Varaqqa yozilgan» — atama yo'q) ✓
27. **§133/§134/§135:** tinish-shakl telli yo'q · xulosa-bandi keyingi test kaliti emas · nishon-desc rost · son-echo yo'q · rang-holati distraktorda ishlatilmaydi · matn ekranga zid emas · dars ishlatadigan har atama ta'riflangan · starter kod qo'shtirnoqda ✓
28. **§136 / MATN_ETALONI 7-C (F-0818-03 adabiy norma):** `kant-*` qoidalari bo'yicha topilma 0 (hujjat-tarjimasi qoliplari, majhul nisbat, kitobiy bog'lamalar — hech biri yo'q) · `sheva-*` qoidalari bo'yicha topilma 0 (so'zlashuv qisqartmalari va gap oxiri yuklamalari yo'q) · `registr-*` qoidalari bo'yicha topilma 0 (maqtov faqat adabiy shaklda: «Yaxshi!», «Juda yaxshi!», «To'g'ri!») · ovoz-testi: har ekran matni ovoz chiqarib o'qildi — tirik o'qituvchi ovozi, hujjat ham, chat ham emas ✓
29. **§40:** «tizimingiz ishlab turibdi», «mobil ilovangiz», «agentingiz» — 0; «shu modulda quradigan tizimingiz» shakli ✓; demo hech qachon «ilovangiz» emas ✓
30. **§69:** «topilmadi / saqlanmagan / bo'sh» 0 — modul-chegara, zaxira-tarmoq yozilmagan ✓
31. **§97:** «ko'pchilik / sinf / ovozlar» o'quvchi matnida 0 ✓
32. **Sanoq-mosligi (22):** 2 tanlov (s0) · 4 katak (s1) · 2 karta (s2) · 3 ilova + 4 savol (s4) · 4 slayd + 2 bashorat + 7 bosqich (s6) · 4 katak (s8) · 3 varaq × 4 katak (s9) · 3 varaq + 4 katak-nomi (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
33. **Ekran-prozalari (Intl.Segmenter bilan o'lchandi):** s0 321 · s1 113 · s2 288 · s4 364 · s6 196 (eng uzun slayd) · s8 102 · s9 128 · s10 152 · s12 149 grapheme — chegara 400 ✓. 🔴 s4 chegaraga eng yaqin: unga bitta gap ham qo'shilmaydi.
34. **Uzunlik-tell (8.4, chegara 1.4):** T1 1.06 · T2 1.03 · T3 1.12 · T4 1.15 · darvoza-mashqi 1.07 · bashorat-1 1.05 · bashorat-2 (to'g'ri javob eng uzun emas) ✓

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**

**(a) Umumiy:** `npm run lint:til src/6-Modull/PmLesson22.jsx` → **0 error** shart (87 qoida) ·
`npm run lint:jsx` → 0 topilma · `npm run lint:prompt` → 0 topilma.

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M6-D2 ga tegishli):
`metrika` · `retention` · `DAU` · `KPI` · `dashboard` (o'quvchi matnida **0** — 29-qonun; `metrika` faqat artefakt kalitida, kod satrida ham **0**) ·
`bo'sh katak` (s9 ekranida **0** — u yerda «javobsiz katak») · `bosh` (kod-nomlarida **0** — «bo'sh» ning buzuq yozuvi) ·
`e'lon` (o'quvchi matnida **0** — M4-D12 ning atamasi) ·
`sxema` · `ustun` (o'quvchi matnida **0** — M4-D12 ning obyektlari) ·
`hikoya` · `KIM/NIMA/NATIJA` (o'quvchi matnida **0** — M3-D2 ning qolipi) ·
`bo'lak` (o'quvchi matnida **0** — M2-D7 ning obyekti) ·
`arxitektura` · `mikroservis` · `MVC` · `agent` · `Skill` · `pipeline` · `Native` · `Expo` (29-qonun, m6-01/03/04/05/07/08/09 atamalari) ·
`texnik topshiriq` · `spetsifikatsiya` · `dokumentatsiya` · `backlog` · `user story` (kalka) ·
`Altair` · `BASIC` (faqat s6 slaydlarida gloss bilan; test/bashorat/arenada **0**) ·
`tizimingiz ishlab` · `ilovangiz` · `mobil ilovangiz` (§40) ·
`katak to'lad` · `varaq to'lad` (42-qonun suyuqlik-fe'li — «to'ldiriladi/yoziladi») ·
`ko'pchilik` · `ovozlar` (§97) · `ball emas` · `degandingiz` (100-qonun) ·
`topilmadi` · `saqlanmagan` (§69) ·
`sartaroshxona` · `mini-do'kon` · `Demo Day` (Batch 5 ning boshqa uch darsining olamlari — bu darsda **0**) ·
ekran-nomlarining o'zbekcha tarjimalari (Editor · Extensions o'rniga qo'yilgan shakllar) — o'quvchi matnida **0** ·
`PRD` — **s0/s1/s2/s3 da 0**, birinchi uchrashuv s4 ning ta'rif-gapida (dasturiy tekshiruv: qator raqamlarini solishtirish, §126).

---

## 13-A. 🎓 METODIST-KORREKTURA (pm-metodist · 2026-08-19 · senariy-korrektura rejimi)

> `MATN_KORPUS.md` §99–§137 (ayniqsa §134 · §135 · §136), `MATN_ETALONI.md` **7-C** (F-0818-03),
> `PM_Prompt_v8.md`, `PM_DARS_ETALON.md` va ikki pretsedent (M4a-D2 · M5-D11) o'qib chiqildi.
> Quyida **matnga kirgan** tuzatishlar (oldin → keyin), so'ng tuzatilmagan hukmlar.

### (A) «Bo'sh katak» bitta darsda ikki ma'noda edi (§121/§94 — eng qimmat topilma)

- s9 topshirig'i «Har varaqda **bo'sh katakni** toping» derdi, o'sha ekranning yo'riqnomasi esa
  «Katak **to'ldirilgan ko'rinadi**, lekin qatori o'z savoliga javob bermaydi» — ya'ni ekranda
  bo'sh katak umuman yo'q, to'rttasida ham qator bor. Ayni paytda s10 kodida, s11 testida va s15
  da «bo'sh katak» **chindan yozilmagan** katakni bildiradi (`olchov: ""`). Bir ildiz — ikki ma'no.
  → s9 bo'ylab yangi nom: **«javobsiz katak»**; ta'rifi o'sha ekranning yo'riqnomasida turibdi.
  **Kaskad:** ekran-jadvali s9 qatori · topshiriq · uch varaqning holat-belgisi (3 ×) · yakun-qatori
  («Uch varaqda uch xil **javobsiz katak** chiqdi») · §120/§134 izohlari · uy-vazifa izohi ·
  **«Sharp Eye!»** nishon-tavsifi · GATE S 10-savoli. Endi «bo'sh» faqat «umuman yozilmagan» degani.
- Farq atama-glossiga alohida band bo'lib qo'shildi (0-bo'lim).

### (B) Matn ekranga va mexanikaga zid bo'lmasin (§120 · §113 · §135A)

- ❌ s9 1-varaq, O'lchov katagi: «Kun boshida uch murabbiy ham ro'yxatni ochadi» — bu «Qaysi son
  o'zgaradi?» savoliga javob emas (uchlik — murabbiylar soni, u o'zgarmaydi), demak bola **shu
  katakni ham** himoyalab bosa olardi → ✅ «**Bilmay qolgan kun 5 tadan 1 taga tushadi**». Endi
  1-varaqda javobsizi faqat Yechim. Kod (`varaq2.olchov`) ham shu qatorga o'tdi — s9 va s10
  materiali bitta manbadan ko'rinadi (§95).
- ❌ s10 mentori: «Hozirgina uch varaqdagi bo'sh katakni o'zingiz topdingiz — endi **o'sha ishni
  kod bajaradi**» — rost emas: kod qatorning ma'nosini o'qiy olmaydi → ✅ «Qatorning ma'nosini
  odam o'qiydi, kod esa umuman yozilmagan katakni topadi. Varaq kodda oddiy obyekt bo'lib turadi.»
  MENTORGA bandi ham shu ajratmani ochiq aytadi (odam ishi ↔ mashina ishi).
- ❌ Keys ko'prigi: «**kim uchun** va nima qurilishi o'sha gapda aytilgan edi» — bank «**shu
  kompyuter uchun** BASIC tili» deydi, «kim uchun» bankda yo'q (§101) → ✅ «nima qurilishi va
  **qaysi kompyuter uchun** ekani o'sha gapda aytilgan edi» (RECAPS s7 bilan birga).

### (C) Kod o'quvchiga imlosi buzuq so'z ko'rsatmasin (§135D yon-bandi)

- ❌ `boshKataklar()` · `const bosh = []` — ASCII qilinganda «bo'sh» → **`bosh`**, bu esa boshqa
  so'z (boshliq, bosh qism). Bola kodni «bosh kataklar» deb o'qiydi → ✅ **`yozilmaganKataklar()`**
  · **`const natija = []`** (izoh va uch `console.log` bilan birga). `olchov` qoladi — u boshqa
  so'zga aylanmaydi.
- YORDAM bandi kod bilan bir tilda: `varaq.olchov` → `varaq1.olchov`.

### (D) So'z-tanlov va mikro-tahrirlar

- ❌ hook: «"Joy band qiladigan ilova **qilamiz**" dedingiz» («ilova qilish» — biriktirish
  ma'nosidagi omonim) va «**ertasiga** uchtasi uch xil ilova olib keldi» (bir kechada uch ilova —
  ishonarsiz) → ✅ «"Joy band qiladigan ilova **kerak**", dedingiz. Shu gapni uch kishi eshitdi —
  uchtasi uch xil ilova **qurdi**.» (ekran 341 → **321** grapheme).
- ❌ kanonik qoida: «…yozilgan **gapni** hamma bir xil o'qiydi» — darsning o'z lug'atida «gap» =
  og'zaki aytilgani, «qator» = yozilgani → ✅ «…yozilgan **qatorni** hamma bir xil o'qiydi».
  Kaskad 5 yuzada: gloss · blok-3 gapi · s2 xulosa-kartasi · s15 yakun-qatori · flashcard-1.
- ❌ s4, Kim javobi: «suzishga keladigan **o'quvchilar**» — «o'quvchi» platformada bolaning o'zi
  (§105 omonimi) → ✅ «suzishga **keladiganlar**» (kod satri bilan aynan bir xil).
- ❌ «Bekorga **borish** esa **qisqarmadi**» (borish qisqarmaydi) → ✅ «Bekorga **qaytish** esa
  **kamaymadi**»; s4 ning O'lchov javobi ham «bekorga qaytish» ga o'tdi — dars bo'ylab bitta ibora.
- ❌ s1: «**M6 da** quradigan tizimingiz» — modul-kodi ichki yozuv, ekranga chiqmaydi (14-qonun)
  → ✅ «**shu modulda** quradigan tizimingiz» (izohlari bilan birga, 5 o'rin).
- ❌ s8 mentori: «Har katak bitta savol **so'raydi**» (jonsizga odam-fe'li) → ✅ «Har katakning
  bitta **savoli bor** — javobini bitta qatorda yozing».
- ❌ s8 YULDUZCHA uy-vazifaning QISQA variantini so'zma-so'z takrorlardi (ikkalasi ham «O'lchov
  katagidagi sonni qayerdan bilib olasiz») → ✅ YULDUZCHA boshqa ish: «Varag'ingizni ovoz chiqarib
  o'qing — to'rt qator bitta ish haqida gapiryaptimi?»
- ❌ uy-vazifa EKRANi: «u **tushunmagan** katakni qayta yozasiz» — ichki holat, kuzatib bo'lmaydi
  (§125) → ✅ «u **qayta so'ragan** katakni yangidan yozasiz» (HARAKAT bandi bilan bir tilda).
- ❌ s12 sarlavhasi «To'rt katakni yoddan ayta olasizmi?» topshiriqqa mos emas edi (topshiriq —
  qaysi katak qiyin bo'lgani) → ✅ «**Qaysi katak eng qiyin bo'ldi?**»; mentordan «Ekranga
  qaramasdan» (yod-vazifasining qoldig'i) olindi.
- ❌ s2 sarlavhasi taklif qilinayotgan dars-kartasi sarlavhasini so'zma-so'z takrorlardi → ✅
  «Og'zaki aytilgan gap va yozilgan qator — farqi nimada?»
- ❌ T4 varianti «Kimga qulay bo'lsa, shunga quradi» (kimga qulay — dasturchigami, odamgami?) →
  ✅ «**O'zi tanlagan odamga quradi**» (uzunlik 29 · 27 · 31, tell 1.15 ✓).
- ❌ nishon-tavsifi «Murabbiydan **to'rttasini** o'zingiz so'radingiz» (referentsiz son, §24) →
  ✅ «To'rt savolni murabbiydan o'zingiz so'radingiz» (46 belgi, chegara 48).
- ❌ keys 1-slaydi: «Uning nomi Altair edi: o'sha yillarda chiqqan yangi kompyuter» — gloss oldingi
  gapni takrorlardi → ✅ «Uning nomi Altair edi.» (tanishtirish gapning o'zida qoladi). 2-slaydda
  referentsiz «u» → «**bu til** hali yozilmagan edi».
- Arena 12-savolining manbasi «s6 + s15» edi, s15 ning to'rt qatorida bu javob yo'q → **s6**.
- Ekran-prozalari Intl.Segmenter bilan qayta o'lchandi: s0 321 · s1 113 · s2 288 · s4 364 · s8 102 ·
  s9 128 · s10 152 · s12 149 — hammasi chegaradan past ✓ (raqamlar 13-bo'limda yangilandi).

### (E) Tuzatilmadi — metodist hukmi (OQLANDI)

1. **`metrika` (kalit) ↔ «O'lchov» (ekran) ↔ `olchov` (kod) — ajratma IZCHIL.** `metrika`
   o'quvchi matnida ham, kod satrida ham **0 marta**; u faqat `localStorage` kalitida yashaydi.
   Ekranda va kodda esa bitta so'zning ikki yozuvi turadi («O'lchov» ↔ `olchov`) — bola buni
   uzilish deb o'qimaydi, chunki kod-nomlari butun kursda apostrofsiz. m5-02 pretsedenti
   (ekranda «joy», kalitda `kanal`) bilan bir xil ishlaydi. **Tavsiya:** kalit o'zgartirilmasin
   (m6-06 va m6-12 uni o'qiydi), GATE S 5-savoli «uch nomli holat» foydasiga yopilsin.
2. **TEST-2 ning to'g'ri javobi «Kunda 30 odam joy band qiladi»** — sonda o'zgarish
   ko'rsatilmagan. Lekin darsning ishlaydigan mezoni (s8 javob-qatori · s9 3-varag'i) —
   **sanab bo'ladimi**; A ham, C ham sanalmaydi, demak himoyalanadigan javob bitta ✓. O'zbekchada
   «X tadan Y taga» shakli variantni distraktorlardan 1.4 martadan uzun qilardi — matn saqlandi.
3. **95-qonun (🏊 basseyn) — OQLANADI:** Toshkent o'smiri suzish to'garagiga o'zi boradi, «joy
   bormi?» savolini o'zi so'raydi. Sahna tili «to'garak/guruh» da qolsin (klub-abonement tiliga
   o'tmasin) — u bolada YO'Q tajriba.
4. **Atama ta'riflari (§135B) grep bilan tekshirildi:** «varaq» — s4 ta'rif-gapi · «katak» — s1 da
   nomi bilan chiziladi va ekranda ko'rinadi · «O'lchov» — katak-savoli + s8 javob-qatori +
   flashcard-7 · «javobsiz katak» — s9 yo'riqnomasi · «qator» — s2 xulosasi. Ta'rifsiz atama yo'q.
5. **Rang-legendasi (§134) shart emas:** s9 da javobsiz katak rang bilan emas, qatorning ma'nosi
   bilan topiladi; s4 dagi kulrang-punktir «hali yozilmagan» degani va o'sha ekranda harakat bilan
   darhol ochiladi. Ballanadigan birorta variant rangga tayanmaydi ✓.
6. **Adabiy norma (7-C):** senariy ovoz chiqarib o'qildi — kantselyarit qoliplari
   (hujjat-tarjimasi bog'lamalari, majhul nisbat, kitobiy ko'rsatish olmoshlari) va so'zlashuv
   shakllari (qisqargan fe'llar, gap oxiri yuklamalari, ko'cha-registridagi maqtov) — birortasi
   yo'q; maqtov faqat adabiy shaklda («🎯 Topdingiz!»). `node til-lint.mjs` — **0 error**;
   2 warn `yadro-jargon` — PM_Prompt ning majburiy blok-sarlavhasi, ekranga chiqmaydi
   (M4c-D6 · M5-D11 pretsedenti).
7. **«PRD» — yagona nom:** s0–s3 da 0, s4 oxirida ta'rif-gap bilan tug'iladi; «texnik topshiriq»,
   «hujjat», «mahsulot varag'i» sinonimlari senariyda umuman yo'q ✓.

### (F) Quruvchiga — metodistdan

- **Arena variantlari yozilganda** to'g'ri javoblar bitta qolip bilan ajralib turmasin (bugun
  `PmLesson20` da shu nuqson topildi): 3–6-savollarning kaliti «katak nomi + …» shaklida bo'lsa,
  distraktorlar ham aynan shu shaklda yozilsin (§99/§127).
- **s9 ekranida** topshiriq bilan yo'riqnoma birga tursin — «javobsiz» so'zi ta'rifsiz yolg'iz
  ko'rinmasin.
- **Kod-panelida** `yozilmaganKataklar` to'rt joyda (funksiya + uch `console.log`) bir xil yozilsin;
  residue-grep: `bosh` so'zi kodda ham, matnda ham 0.
- **s12 sarlavhasi o'zgardi** — flashcard ekranining sarlavhasi («O'zingizni sinab ko'ring.») bilan
  aralashmasin.
- Residue-grep ro'yxatiga qo'shildi: `bo'sh katak` — s9 ekranida **0** · `metrika` — kod satrida **0**.

---

## 14. ⚠️ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq, 2026-08-19)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi.

1. 🔴 **DARS SARLAVHASI VA SUB.** `App.jsx` `m6-02`: title «PRD nima» · sub «muammo / auditoriya / yechim / metrika». Ikki nuqson: «metrika» — 29-qonun bo'yicha M8-D1 atamasi, «auditoriya» esa darsning katak-nomi emas («Kim»). **Taklif:** title → **«Bitta gapni uch kishi bir xil tushunadimi?»** · sub → **«kod yozishdan oldin — bitta varaq, to'rt katak»**. Tasdiqlaysizmi? (Kartani faqat bosh-agent o'zgartiradi.)

2. 🔴 **BOSH ATAMA — «PRD», s4 DA TUG'ILADI.** Brif bo'yicha PRD darsning O'Z atamasi, lekin §104/§126 bo'yicha u hodisadan KEYIN tug'iladi: s0–s3 da **0 marta**, birinchi ko'rinishi s4 ning oxirgi qatorida ta'rif-gap bilan («Kod yozishdan oldin to'ldiriladigan shu bitta varaq — PRD. Inglizchada Product Requirements Document, ya'ni mahsulot talablari varag'i»). Shundan keyin dars bo'ylab yagona nom — **PRD**; «mahsulot varag'i» ikkinchi nom sifatida ISHLATILMAYDI (§80: bir tushuncha — bir nom). Tasdiqlaysizmi?

3. 🔴 **DEMO-OLAM: 🏊 BASSEYN GURUHIGA YOZILISH.** Batch 5 ning boshqa uch darsi olamlarni allaqachon oldi (✂️ sartaroshxona — m6-12 · 🛒 mini-do'kon — m6-06 · 🎤 Demo Day sahnasi — m6-14), shuning uchun bu darsga yangi olam tanlandi. 96c(e) grep-dalili: `basseyn` · `suzish` · `murabbiy` — `src/` va `pm-senariylar/` da **0 topilma**. 95-qonun: o'smir suzish to'garagiga o'zi boradi, «joy bormi?» savolini o'zi so'raydi. OQLANADIMI — yoki boshqa olam ko'rsatasizmi?

4. 🔴 **s4 IKKI BOSQICHLI.** Pasportdagi imzo-vizual («BIR VARAQ PRD» — to'rt-katakli yozuv-varag'i) 2-bosqich sifatida aynan bajarildi; men unga **1-bosqich** qo'shdim: bitta og'zaki gapdan uch dasturchi uch xil ilova qurishi. Sabab: varaqning qiymati faqat u YO'Q bo'lganda ko'rinadi — 1-bosqichsiz o'quvchi to'rt katakni «yana bitta forma» deb o'qiydi. Qo'shimcha tasdiqlaysizmi — yoki imzo-vizual faqat to'ldirish bo'lib qolsinmi?

5. 🔴 **ARTEFAKT: EKRANDAGI SO'Z ↔ JSON KALITI.** Muhrlangan shakl `pm-m6d2-prd = { prd: { muammo, kim, yechim, metrika }, savedAt }` **o'zgartirilmadi**. Lekin `metrika` — M8-D1 ning atamasi (29-qonun), shuning uchun o'quvchi ekranida katak nomi **«O'lchov»**, kodda esa `olchov` (ASCII). Pretsedent: m5-02 da ekranda «joy», kalitda `kanal` (B4 muhri). Shu uch nomli holat (`metrika` kalit · «O'lchov» ekran · `olchov` kod) tasdiqlanadimi — yoki kalit ham `olchov` ga o'tsinmi (unda m6-06 va m6-12 ni ham xabardor qilish kerak)?

6. 🔴 **s8 NIMA UCHUN VARAQ TO'LDIRILADI.** Ekran «shu modulda quradigan tizimingiz» deydi (§40: to'liq tizim hali yo'q). m6-06 senariysi esa M6 modul-ipini **«o'quvchining O'Z mini-do'koni»** deb belgilagan. Ikkalasi bitta narsani nomlashi kerak. **Taklif:** s8 matni neytral qoladi («quradigan tizimingiz»), bosh-agent esa m6-06 bilan bitta nomga keltiradi. Tasdiqlaysizmi — yoki s8 hoziroq «mini-do'koningiz» deb yozilsinmi?

7. 🟡 **TIZIMINI TANLAMAGAN O'QUVCHI.** s8 da tizimi hali aniq bo'lmagan bola bo'ladi. Yechim ekranda emas, **MENTORGA** bandida: «M5 da qurgan Telegram-botini olsin — varaq o'sha bot uchun to'ldiriladi». Bu o'quvchida ANIQ bor narsa (92d). Rozimisiz — yoki ekranda ham bitta qator ipucha bo'lsinmi?

8. 🟡 **K7 RAQAMSIZ — JONLI HISOBLAGICH YO'Q.** Bankda K7 yonida «raqamsiz» belgisi turibdi. Shuning uchun darsda K7 ga tegishli birorta o'lchov-raqami yo'q, jonli son-hisoblagichi ham qo'yilmaydi (M4-D7 · M4c-D6 · M5-D8 pretsedenti); o'rniga eyebrow'da uzluksiz **bosqich-hisoblagichi** «1/7 … 7/7». Yagona sana — 1975. Tasdiqlaysizmi?

9. 🟡 **KEYS-BURCHAGI VA TEST-3.** Pasport burchagi — «hujjat sotuvdan keyin yozildi». Bank faktlari: qo'ng'iroq paytida til yo'q edi · bir necha haftada yozildi · haqiqiy Altairga tegmadilar · ko'rsatuv birinchi urinishda ishladi. Ikki bashorat ikki faktni oldi (holat · joy), TEST-3 esa uchinchisini (ko'rsatuv) — ya'ni ballanadigan javob **sof bank-fakti** (§124), xulosani reveal aytadi. Ko'prik-gapdagi «nima qurilishi va qaysi kompyuter uchun ekani» — bankdagi gapning O'ZIDA turibdi, yangi da'vo emas (13-A B-bandi). Shu chegara yetarlimi?

10. 🟡 **s9 SAHNASI VA UCH XIL JAVOBSIZ KATAK.** Uch varaq — o'sha basseyn tizimining boshqa uch bo'limi (murabbiy ro'yxati · eslatma · guruh tanlash); har birida bitta javobsiz katak, va uchalasi **uch xil sinf**: yechim aytilmagan · kim aytilmagan · son aytilmagan. Shu tuzilma OQLANADIMI — yoki uch varaqning bittasi butunlay to'g'ri bo'lsinmi (o'quvchi «doim bittasi javobsiz» naqshini o'rganmasin)?

11. 🟡 **KODING — VS Code, natijani terminalda ko'radi.** R1 navbati bo'yicha m6-02 = VS Code, shuning uchun preview-panel yo'q: o'quvchi faylni `node` buyrug'i bilan ishga tushiradi (M4/M5 da qilgan). Uch varaq va to'rt katak — s4/s8/s9 dagi bilan aynan. Tasdiqlaysizmi?

12. 🟡 **UY-VAZIFA — VARAQNI ODAMGA O'QIB BERISH.** To'liq variant: varaqni uydagi yoki sinfdagi bir odamga o'qib berish va **qayta so'ralgan** katakni qaytadan yozish (§125: kuzatiladigan hodisa). Qisqa variant: O'lchov katagidagi sonni qayerdan bilib olishini bir qatorda yozish. Rozimisiz — yoki to'liq variant ham varaqning o'zida qolsinmi?

13. 🎓 **s9 NING NOMI O'ZGARDI: «bo'sh katak» → «javobsiz katak» (metodist qo'shdi).** Eski matn
o'zi bilan zid edi: topshiriq «bo'sh katakni toping» derdi, yo'riqnoma esa «katak to'ldirilgan
ko'rinadi» derdi; ustiga s10 kodi va s11 testi «bo'sh katak» ni **umuman yozilmagan** ma'noda
ishlatadi (§121: bir ildiz — bir ma'no). Endi s9 ning O'Z nomi bor va u yo'riqnomada ta'riflanadi.
Tasdiqlaysizmi — yoki boshqa nom ko'rsatasizmi («javobsiz qator», «savolga tegmagan katak»)?

14. 🎓 **IP-NOMI: m6-02 «tizimingiz» ↔ m6-06 «mini-do'kon» (metodist ogohlantirishi).**
m6-06 s8 tepasida m6-02 varag'idan bir qatorlik karta ko'rsatadi («{kim} uchun — {yechim}») va
o'sha ekranda yozish predmetini **mini-do'kon** deb ataydi. Agar m6-02 da bola varaqni Telegram-boti
uchun to'ldirsa (hozirgi MENTORGA zaxirasi shuni tavsiya qiladi), m6-06 da karta bilan ekran
matni bir-biriga zid ko'rinadi. **Metodist tavsiyasi:** (a) m6-02 s8 da yozish predmeti «shu
modulda quradigan tizimingiz» bo'lib qolsin, (b) m6-06 da esa bitta ko'prik-gap turadi:
«tizimingiz — shu modulda quradigan mini-do'koningiz», (c) MENTORGA zaxirasi bot o'rniga
«tizimingizning bitta bo'limi» ga yo'naltirsin. Uch bandni tasdiqlaysizmi?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_ETALONI (lug'at + 7-B + 7-C) · MATN_KORPUS (§99–136) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2 Batch 5/R3 pasporti) · `pipeline-b5/SENARIY_BRIF_B5.md` + `pipeline-b3/SENARIY_BRIF_B3.md` bo'yicha yozildi. Format-etalon: `pm-senariylar/M4a-D2-Masshtab.md`. `pm-metodist` SENARIY-KORREKTURA bajarildi (2026-08-19 · 13-A bo'lim). Keyingi qadam: **[GATE S]** — 14-bo'lim savollari (1–14).*

## ✅ [AVTO-GATE S] YOPILDI — 2026-08-19 (bosh-agent · foydalanuvchi avtokontrol-ruxsati asosida)

**Pretsedent bilan avto-yopilgan bandlar:** s4 ga ikki bosqichli qo'shimcha (B1–B4 da to'rt marta
tasdiqlangan naqsh) · demo-olam tanlovi va 96c grep-dalili · muhrlangan artefakt-shakllari
(o'zgartirilmadi) · keys «raqamsiz» siyosati va bosqich-hisoblagichi (M4-D7 · M4c-D6 · M5-D8) ·
bosh atamaning hodisadan keyin tug'ilishi (§104/§126) · ekran-so'zi ↔ JSON-kaliti ajratmasi
(m5-02 `kanal`↔«joy» pretsedenti) · uy-vazifaning o'quvchi mahsulotida qolishi · metodist-korrektura
bandlari (13-A bo'limi — hammasi qoida-asosli) · TEKSHIRUV mexanikasining band primitivlardan
farq-dalili · nishon/flashcard qarorlari.

**Foydalanuvchi hukmi (3 band, 2026-08-19):**
1. **Karta-sarlavhalari TASDIQLANDI** va `src/App.jsx` ga kiritildi (esbuild ✅):
   m6-02 «Bitta gapni uch kishi bir xil tushunadimi?» / «kod yozishdan oldin — bitta varaq, to'rt katak» ·
   m6-06 «Ilova o'zi qaror qilsa, kimga tegadi?» / «chegara — mahsulot qarori» ·
   m6-12 «Bugun qaysi ish boshlanadi?» / «uch ufq: hozir, uch oydan keyin, olti oydan keyin» ·
   m6-14 «Raqamingiz nimani isbotlaydi?» / «bitta raqam — bitta slayd».
2. **m6-06 ohang-darajasi TASDIQLANDI** — uch jabr-misoli yengil va tuzatsa bo'ladigan holicha qoladi
   (pul yo'qotish, sog'liq, sud yo'q). Kuchaytirilmaydi.
3. **m6-02 s9 O'ZGARDI:** uch varaqdan **bittasi butunlay to'g'ri** bo'ladi — o'quvchi «doim bittasi
   javobsiz» naqshini o'rganib qo'ymasin, har varaqni haqiqatan o'qishi kerak. Pretsedent: M4-D12
   «sxema-shart tekshiruvi» (3 shartdan 2 nuqson). 🔴 QURUVCHIGA majburiy band.

**Qurishga ruxsat berildi.**
