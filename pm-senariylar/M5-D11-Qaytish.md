# M5-D11 — Kecha kelgan odam bugun ham keldimi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI → **pm-metodist korrekturasi BAJARILDI** (13-A bo'limi, 2026-08-18) → **[GATE S]** kutmoqda.
> Fayl: `src/5-Modull/PmLesson21.jsx` (hozirgi `pm-metrics-users-21-v16` chala avlod BUTUNLAY
> almashadi; yangi `lessonId: pm-m5d11-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 **BATCH 4** — yo'lakchadan chiqilmadi.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 5 — «Botlar va avtomatlashtirish» (oy 9.5–11) · modul g'oyasi: «Real odamlar bilan birinchi jonli mahsulot tajribasi. 20+ real foydalanuvchi» |
| **Dars** | M5-D11 (modulning 11-darsi, uchinchi va oxirgi PM darsi) · `key: m5-11` |
| **Mavzu** | Qaytish — botga kelgan odam **ertasi kuni yana keldimi**; kelganlar soni va qaytganlar soni bir narsa emas |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z botining uch kunini **yozadi**; artefakt = uch qatorlik hisob (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | 🦉 **K5 · DUOLINGO** ♻️ (registr 3-bo'lim: m5-11 → K5, modul-ichi qoidasi bo'yicha M5 da birinchi marta). Bank: `PM_Prompt_v8` K5 bandi — ketma-ket kunlar hisobi · bir kun tashlansa hisob yo'qoladi · atrofida eslatmalar va «muzlatish» · **raqam YO'Q** |
| 🔴 **K5 FARQ-DALILI (takroriy keys — burchagi almashadi)** | K5 **band edi: M8-D1 `PmMetricsLesson`** (`src/pm/PmMetricsLesson.jsx`, `K5_SLIDES`, 1201–1207-qatorlar). O'sha darsning burchagi: **«ketma-ket kunlar hisobi — odamni qaytaradigan USUL»** (muammo → hisob nima → yo'qotish qo'rquvi + odat → muzlatish/eslatma → xulosa: bu qaytishni oshiradi). Bashoratlari: «hisob nolga tushay deb qolsa odam nima qiladi?» va «bir kun o'tkazsangiz ilova nima qiladi?». 🔴 **M5-D11 burchagi boshqa: «ilova NIMANI sanaydi — o'lchov birligi qanday»** — hisob so'zlarni ham, darslarni ham emas, **kunlarni** sanaydi; eslatma ham, muzlatish ham aynan **bitta kunni** yopadi; demak butun hisob bitta savolga tayanadi: «kecha kelgan odam bugun ham keldimi». Usul emas — **sanoq birligi**. Bashoratlarim ham boshqa o'lchovlarda (nima sanaladi · ilova nima yuboradi), M8-D1 ikkalasi ham qaytarilmaydi. Ustiga: M8-D1 «streak» so'zini ekranga chiqaradi va **foiz** hisoblaydi — bu darsda ikkalasi ham **0** (8-bo'lim) |
| 🔴 **PmMetricsLesson dan FARQ-DALILI (eng jiddiy takror-xavfi)** | `src/pm/PmMetricsLesson.jsx` (M8-D1) — **metrika NIMA** darsi: DAU · retention · churn · North Star to'rtligini tanishtiradi, MatchPairs bilan juftlashtiradi, «Metrika alangasi» imzo-vizuali bor, koding'i **retention foizini** hisoblaydi. **M5-D11 metrika nima ekanini O'RGATMAYDI** — u yerda «metrika» so'zi ham, to'rt nomdan bittasi ham ekranga chiqmaydi. Bu dars **bitta o'lchov** haqida: kelgan odam ertasiga qaytdimi. Farq uch joyda qattiq: (a) **atama:** M8-D1 — to'rt inglizcha nom; M5-D11 — bitta o'zbekcha ibora, «qaytish»; (b) **sanoq:** M8-D1 — foiz («yuz odamdan nechtasi»); M5-D11 — **foiz yo'q**, tirik sanoq («9 odam keldi, 4 tasi qaytdi»); (c) **ish:** M8-D1 — kartalarni juftlash va foiz hisoblash; M5-D11 — o'quvchi O'Z botining uch kunini kalendarda ochib, ikki sonni o'zi yozadi. Zanjirda M5-D11 **oldin** turadi (M5), M8-D1 keyin (M8) — ya'ni bu dars hodisani beradi, M8-D1 keyinchalik unga nom qo'yadi. `M3-D10-Acceptance.md` bilan ham kesishmaydi: u yerda «shartlar ro'yxati» yoziladi, bu yerda **sonlar jadvali** |
| **ISHLATILGAN_KEYS** | **K5** (♻️) · M5 ichida band: m5-02 → K8 (META), m5-08 → K4 (Airbnb — mijozni jonli o'rganish). K5 M5 modulida **birinchi marta** ✓ (modul-ichi qoidasi, registr 4-bo'lim 1-band) |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | m5-08 → «savol-elak» · m5-02 → «kanal-funnel» (ikkalasi Batch 4, parallel) · m4c-06 → signal-saralash · m4c-02 → haftaga-sig'dirish darvozasi · m4b-02 → nosozlik-navbati · M4a-D2 → yuk-tartiblash · M4-D15 → qaror-sabab tanlovi · M4-D12 → sxema-shart tekshiruvi · M4-D2 → jadval-qatorini belgilash. **M5-D11 = «KUN-BELGILASH»** — odamning kunlar qatorida **qaytish kunlarini** topib belgilash. Hammasidan farq qiladi (26/59-qonun; dalil 1-bo'lim va s9 izohi) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq: story-silosi · JTBD shtampi · **Metrika alangasi (M8-D1 — eng yaqin xavf)** · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» formasi · «GAPSIZ KO'RSATUV» · «XOTIRA TUGMALARI» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «UCH QAVAT KESIMI» · «YUK-SINOVI» · «SIFAT-TAROZI» · «RELIZ-TASMASI» · «O'LCHAGICH-PANELI» · Batch 4 yo'lakchalari: «BIRINCHI 20» (m5-02) · «INTERVYU-STOLI» (m5-08) · Hotspot · Timeline · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · xabardan ortiqcha qatorni olib tashlash · yuk-tartiblash · sxema-shart tekshiruvi · qaror-sabab tanlovi · bug-triaj/nosozlik-navbati · haftaga-sig'dirish · signal-saralash · kanal-funnel · savol-elak · pitch-oilasi ro'yxati |
| **Misol-ip (91/108 + 95 + 96c)** | 🤖 **O'quvchining O'Z Telegram-boti** — M5 bo'yi qurgan boti (`BotIntroLesson` → `BotApiButtonsLesson` → `BotStatefulMemoryLesson` → `BotFullProjectLesson`), m5-02 da birinchi 20 odamni yig'gan, m5-08 da uchtasi bilan gaplashgan. **Bitta ip, boshqa olam yo'q** (108-qonun). 95-qonun: bu uning o'z ishi ✓. 96c(e) to'qnashuv-grep: `Duolingo` `src/` bo'yicha **faqat `src/pm/PmMetricsLesson.jsx` da** uchraydi (grep bilan tasdiqlandi) — ya'ni Duolingo bu darsda **keys**, misol-olam EMAS; misol-olam — o'quvchining o'z boti. Band olamlar (lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · maydoncha · musiqa ilovasi · maktab jurnali · kutubxona · AvtoStoyanka · konsert-chipta · skuter-ijara · sinfdosh-poyga · o'quvchining Netlify-sayti) — birortasi ham olinmadi ✓ · «kalendar/taqvim» so'zi `src/` da **0 marta** (grep) — imzo-vizual toza ✓ |
| 🔴 **Personaj-taqiq** | M5 texnik darslari «**Botjon**» degan qahramon-lug'atida yuradi (`BotStatefulMemoryLesson` shapkasi). PM darsida o'ylab topilgan qahramon **ishlatilmaydi** (DARS_ETALON 5.8, F-0729-27): dars bo'ylab **«botingiz»**, vazifani Mentor beradi. «Botjon» so'zi ekranda **0** ⚠️ GATE S 8-savoli |
| **Kirish-artefakt** | `pm-m5d8-javoblar` = `{ javoblar: [ { savol, eshitgan } × 3 ], savedAt }` — m5-08 chiqishi (bosh-agent muhri). O'qiladigan joy: **s8** — o'quvchi uch odamdan eshitgan gaplarini bir qatorlik tasmada ko'radi va ko'prik-gap: «gaplarini eshitgansiz — endi ular ertasiga qaytdimi, buni son aytadi». 🔴 **Jim zaxira:** kalit yo'q yoki buzuq bo'lsa tasma render bo'lmaydi, mentor-gapning umumiy shakli chiqadi (bir shakl, bir uzunlik — §69b); «topilmadi / saqlanmagan» matni **YO'Q** |
| **Chiqish-artefakt** | 🔴 `pm-m5d11-metrika` = `{ kunlar: [ { kun: 1\|2\|3, kelgan: son, qaytgan: son } × 3 ], savedAt }` · `kun` tartibi qat'iy (1 → 2 → 3) · `kelgan` — o'sha kuni botga kelgan odamlar soni · `qaytgan` — ulardan ertasi kuni yana kelganlari soni · `qaytgan ≤ kelgan` (saqlash-sharti). 🔴 **M5 modulini YOPADI** — undan keyingi PM darsi m6-02, u modul-ochilishi (kirishsiz) |
| **Yordamchi kalitlar** | `pm-m5d11-hook-choice` (faqat YOZILADI — 100c) · `pm-m5d11-kun` (s4 holati: qaysi kunlar ochildi, e'lon bosildimi) · `pm-m5d11-belgi` (s9 to'rt qator) · `pm-m5d11-code` · `pm-m5d11-reflection` · `pm-m5d11-hw-target` · `ccProgress` · **o'qiladi:** `pm-m5d8-javoblar` |
| **Koding** | 🖥 **KOMPILYATOR** — R1 navbati (registr: m5-08 VS Code → **m5-11 kompilyator**). Sof JS · `previewUrl` **YO'Q** · shartlar **xulq-atvorda** tekshiriladi (matn-grep emas) · starter yashil emas (18-ov bandi) · kompilyator qobig'ida `zoom: 'calc(1 / var(--lz, 1))'` bekori **majburiy** (7-bo'lim) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — B3 senariylari bilan bir xil yakun-tuzilma |

**Atama-glosslar (62/39-qonun + korpus §20 — avval hodisa, keyin nom):**

- 🔴 **«retention», «DAU», «MAU», «churn», «kogorta», «metrika», «dashboard», «analitika», «voronka», «konversiya», «streak» ekranga CHIQMAYDI** (8-bo'lim taqiq-ro'yxati). Sabab — korpus §20: markaziy tushuncha chet so'z bo'lsa o'zbekcha ibora uning O'RNINI oladi; ustiga «metrika · retention · churn» — **M8-D1 ning atamalari** (29-qonun: kelajak-dars atamasi oqmaydi). Inglizcha juftlik hech qayerda yozilmaydi — qaytishga ot-nom qo'yish M8-D1 ning ishi;
- 🔴 **«qaytish» / «qaytgan» — darsning yagona bosh nomi.** Kanonik ta'rif dars bo'ylab AYNAN bir xil: **«Bugun kelgan odam ertasi kuni yana kelsa — u qaytgan hisoblanadi»** (§109: zamon-iborasi «ertasi kuni», yasama ot emas — §103). Shu ta'rif s2 xulosa-kartasi · flashcard-1 · RECAPS s5 · s15 yakun-ro'yxatida **so'zma-so'z**. So'z o'smirga jismonan tanish (uyga qaytdi, o'yinga qaytdi);
- 🔴 **Ikki son hodisa-tilida, hamma yuzada bir xil yorliq:** 👥 **«Keldi»** — o'sha kuni botni ochgan odamlar soni · ↩️ **«Qaytdi»** — ulardan ertasi kuni yana kelganlari soni. Yozuv-kartasida to'liq shakl: «Nechta odam keldi» · «Ulardan ertasiga nechtasi yana keldi»;
- 🔴 **«ertasi kuni» — darsning o'lchov birligi**, hamma joyda shu ibora. ❌ «keyingi kuni», ❌ «kelasi kuni» (bir tushuncha — bir nom, §80);
- 🔴 **Fe'l-intizomi (korpus §80/§121):** odam **keladi / yana keladi / qaytadi / qaytmaydi**, bot **javob beradi**, e'lon **odam olib keladi**, hisob **o'sadi / noldan boshlanadi**. 🔴 **«kir-» o'zagi odam haqida ISHLATILMAYDI** — dars bo'ylab bitta fe'l: **«keldi»**. Sabab: «kirdi» qo'shni M5 texnik darslarida boshqa ma'noda yuradi (bot ichiga kirish, bazaga yozuv kirishi) va til-lint ning `yana-kirish` qoidasi bilan to'qnashadi. ❌ «yiqildi», «tashlab ketdi», «yo'qoldi» — odam haqida bitta ibora: **«qaytmadi»**;
- 🔴 **«e'lon»** — kundalik so'z, atama emas: «kanalga e'lon berish». s4 da hodisa sifatida ko'rinadi, ta'rif talab qilmaydi;
- 🔴 **«ketma-ket kunlar hisobi»** (s6, Duolingo) — «streak» so'zining o'rnini oladi (korpus §20). Ekranda **«🔥 hisob»** yorlig'i bilan turadi; ta'rifi bitta gapda: «ketma-ket necha kun dars qilganingizni sanaydigan son». ❌ «streak», ❌ «seriya», ❌ «zanjir» (til-lint qoidasi);
- ❌ **«foiz», «%», «yuz odamdan nechtasi»** — bu darsda **0**. Sanoq tirik: «9 odam keldi, 4 tasi qaytdi». Foiz — M8-D1 ning ishi (29-qonun) ⚠️ GATE S 2-savoli;
- ❌ **«ko'rsatkich», «o'sish sur'ati», «faol foydalanuvchi»** — kantselyarit/kattalar tili; o'rniga «son», «ko'paydi», «kelgan odam»;
- ❌ **«Botjon»** — M5 texnik darslarining qahramon-lug'ati; PM darsida personaj yo'q (yuqoridagi taqiq).

🔴 **§40 darvozasi:** o'quvchida bot BOR (M5 bo'yi qurgan) — dars bo'ylab **«botingiz»**. Lekin **sonlar** hali unda yo'q: shuning uchun s1 «uch kunlik hisob **yozib olasiz**» deydi, «hisobingiz» s8 dan KEYIN paydo bo'ladi. Kalendar — darsniki («botingizning kunlari» degan sahna), s4 da «kalendaringiz» yozilmaydi. Odamlar ismi ham so'ralmaydi (92d) — s9 dagi to'rt ism sahnaning o'z materiali.

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «QAYTISH-KALENDARI»** (23-qonun: har darsda YANGI — registr 5-bo'limidagi birorta band vizual klonlanmaydi; `src/` da «kalendar/taqvim» so'zi umuman yo'q — grep bilan tasdiqlandi).

Ekran bitta yirik jadval: **kunlar — ustun, odamlar — belgilar.**

```
        1-kun    2-kun    3-kun    [4-kun]  [5-kun]
        👤👤👤   👤👤👤   👤👤👤
        👤👤👤   👤👤👤   👤👤👤
        👤👤👤   👤
   👥 Keldi:  9       7        6
   ↩️ Qaytdi: —       4        4
```

Har ustun — bitta kun. Ustundagi har belgi — o'sha kuni botga kelgan bitta odam. **Kecha ham kelgan odamning belgisi to'ldirilgan yashil** (`success`), birinchi marta kelgani — kontur-belgi (`accent`). 🔴 **Rang-legendasi majburiy** (§134: rang ma'nosi o'quvchi MATNIDA o'rgatilsin) — kalendar ostida ikki chip: **«🟩 kecha ham kelgan · ⬜ birinchi marta kelgan»**. Ya'ni ikkala son ham ekranda **sanab ko'riladi** (korpus §95: raqamning manbasi ko'rinib turadi — bola xohlasa belgilarni birma-bir sanaydi).

**1-bosqich — kunlarni ochish.** Bitta tugma: **«▶ Keyingi kun»**. Har bosishda bitta ustun to'lib chiqadi va ustun ostida **bitta fakt-qator** paydo bo'ladi:

| Kun | Ekranda ko'rinadigan fakt-qator |
|---|---|
| 1-kun | 9 odam keldi. Bundan oldingi kun yo'q — shuning uchun 1-kunning qaytgani ham yo'q |
| 2-kun | 7 odam keldi — ulardan 4 tasi kecha ham kelgan edi |
| 3-kun | 6 odam keldi — ulardan 4 tasi kecha ham kelgan edi |

**2-bosqich — e'lon** (uch kun ochilgach ochiladi — 94-qonun progressiv ochilish). Ekranga bitta tugma chiqadi: **«📣 Kanalga e'lon berish»**. Bosilgach 4- va 5-kun ustunlari ketma-ket to'lib chiqadi:

| Kun | Fakt-qator |
|---|---|
| 4-kun | 23 odam keldi — ulardan 4 tasi kecha ham kelgan edi |
| 5-kun | 8 odam keldi — ulardan 5 tasi kecha ham kelgan edi |

Kalendar to'lgach **yakun-kartasi** ochiladi (69-qonun — xulosa, maqtov emas):

> **E'lon bir kunda 23 odam olib keldi — kecha 6 odam kelgan edi.** Ertasiga qaytganlar esa 4 dan 5 ga chiqdi. Yangi odam olib kelish e'lonning qo'lidan keladi, odamni ertaga qaytarish esa qo'lidan kelmaydi.

🔴 **Atama-tartibi (§104/§126):** «qaytish» atamasi bu ekranda **tug'ilmaydi** — u s2 xulosa-kartasida allaqachon ochilgan; s4 esa atamani **ishlatadi** va uning ustiga darsning kashfiyotini qo'yadi (ikki son bir yo'nalishda yurmaydi). Bir ekran — bir yangilik (109-qonun).

🔴 **Raqamlarning halolligi (korpus §36/§95):** bular o'ylab topilgan statistika EMAS va hech qayerda «shuncha bo'ladi» deb aytilmaydi — bu **o'quvchining o'z boti ustidagi sahna**, va har son o'sha zahoti ekranda belgilar bilan sanab ko'riladi. Hech bir gap «botlarda odatda shunday» demaydi ⚠️ GATE S 4-savoli.

🔴 **Rang-qonuni (palitra-pasporti):** qaytgan odam belgisi — `success` yashil (bu chindan yutuq: odam qaytdi) · birinchi marta kelgan — `accent` kontur · 4-kunning past qaytishi **qizil bo'yalmaydi**: bu o'quvchi xatosi ham, nosozlik ham emas — neytral indigo qoladi (M3-D10 pretsedenti: qizil faqat haqiqiy nosozlikda).

🔴 **Nima uchun aynan shu:** «qaytish» sonini o'qib tushunib bo'lmaydi — u **ikki kunning ustma-ust qo'yilishidan** tug'iladi, ya'ni uni ko'rish uchun kunlar yonma-yon turishi kerak. Kalendar aynan shuni qiladi: bola kunlarni o'zi ochadi, belgilarni ko'radi, keyin e'lon tugmasini bosib **bir sonni ko'tarib, ikkinchisini joyida qoldiradi**. Darsning butun qarori («qaysi son men uchun muhim») shu ikki qator ostida qo'lda o'ynaladi.

🔴 **Mexanika-farqi (26/59-qonun):** M4c-D6 da o'quvchi **bir kunlik chiziqda o'lchagich raqamlarini kuzatib chegara qo'yardi** (obyekt — raqam, harakat — chegara tanlash); M4a-D2 da **surmani surib sinish nuqtasini** topardi; M4-D2 da **tugmani yoqib-o'chirardi**; M3-D10 da **soxta formani bosardi**. Bu yerda obyekt — **odamlar** (kunlar bo'yicha belgilar), harakat — **kunni ochish va e'lon berish**, maqsad — **ikki sonning bir-biriga ergashmasligini ko'rish**. Chegara ham, surma ham, forma ham yo'q — ikkita tugma.

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** e'lon tugmasi ochilgandan keyin 40–45 soniya harakatsizlikda bitta qoida-ipuchasi chiqadi: «Tugmani bosing va ikki qatorni birga kuzating» — javobni AYTMAYDIGAN shakl (korpus §77), «kelganlar oshadi» degan xulosa ipuchada YO'Q.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi B3 senariylaridagidek — etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Botingizni kecha ochgan odam bugun ham ochdimi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch kunlik hisob qatori o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — «Keldi» ↔ «Qaytdi» ikki kartasi | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **QAYTISH-KALENDARI** (kunlar + e'lon) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — 🦉 Duolingo (4 slayd + 2 bashorat + ko'prik) | 3 | — | keys-slayd qolipi · bosqich-hisoblagichi 1/7 |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **uch kunlik hisob** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **KUN-BELGILASH** (qaytish kunlarini topish) | 5 | — | 🔴 yangi mexanika |
| s10 | KODING — qaytganlarni sanaydigan kod (kompilyator) | 6 | — | 26/82/87-qonun · sof JS |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ustaxona», «kalendar-mexanika», «keys» so'zlari o'quvchi ekranida YO'Q** (korpus §84) — senariy-ichi nomlar. «QAYTISH-KALENDARI» imzo-nomi ham ekranga chiqmaydi — ekranda o'quvchi «botingizning kunlari»ni ko'radi.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 5 — Botlar va avtomatlashtirish
DARS: M5-D11 (11-dars)
DARS_MAVZUSI: Qaytish — kelgan odam ertasi kuni yana keldimi; kelganlar va qaytganlar
ISHLATILGAN_KEYS: K5 (Duolingo — ketma-ket kunlar hisobi, sanoq birligi burchagi)
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Botingizni ishga tushirganingizga anchadan beri bo'ldi. Kecha uni ochgan
odam bugun ham ochdimi — buni hozir ayta olasizmi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: bu boshqa son, va u o'zi ko'rinmaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkalasi ham halol javob. Payoff «o'zi ko'rinmaydi»
degan joyda to'xtang: aynan shu bo'shliqni bugungi dars to'ldiradi.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 🟢 Ayta olaman — kelganlarni o'zim sanab turaman | 44 |
| 🤷 Ayta olmayman — hech kim ularni sanamagan | 43 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham bo'ladi. Lekin «kechagi odamlardan bugun nechtasi yana keldi» — bu butunlay boshqa son: u ikki kunni yonma-yon qo'yganda ko'rinadi. Bugun shu ikki sonni o'zingiz yozasiz.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsa (o'quvchining o'z boti) + harakat-fe'l («ochdimi») + o'quvchining o'z holatidan o'sadi. Ovoz chiqarib o'smir og'zidan: «kecha kelgan odam bugun ham keldimi?» — tabiiy.
> 🔴 **104-qonun + korpus §119:** to'g'ri javob YO'Q — payoff ikkala tanlovni ham yolg'onga chiqarmaydi: «sanab turaman» degan bola ham xato deb topilmaydi, chunki payoff u sanagan sondan **boshqa** son haqida gapiradi (kelganlar ↔ ertasiga qaytganlar). ❌ «To'g'ri sezdingiz…» yozilmaydi.
> 🔴 **100-qonun:** tanlov `pm-m5d11-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62/126-qonun:** «qaytgan» atamasi bu ekranda YO'Q — «yana keldi» hodisa-tilida aytiladi; atama s2 da tug'iladi.
> 🔴 **Spoyler-taqiq:** payoff «uni ikki kunni yonma-yon qo'yganda ko'rasiz» deydi — e'lon kashfiyoti (s4) va Duolingo burchagi (s6) butun qoladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ekran-o'lchovi:** savol + ikki tanlov + payoff = **393 grapheme** (chegara 400) ✓.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida botingiz uchun uch kunlik hisob yozib olasiz: har kuni nechta
odam kelgani va ulardan ertasiga nechtasi yana kelgani.
HARAKAT: O'quvchi kuzatadi: bo'sh jadvalga uchta qator o'z-o'zidan yozilib chiqadi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Jadval yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

**Demo-uch qator (o'z-o'zidan yozilib chiqadi) — sonlar o'rnida savol belgisi, ustun-sarlavhali (korpus §67d):**

| Kun | Keldi | Ertasiga yana keldi |
|---|---|---|
| 1-kun | ? | ? |
| 2-kun | ? | ? |
| 3-kun | ? | ? |

> 🔴 **39/62/126-qonun:** s1 da «qaytgan», «qaytish» so'zlari **0** — bosh atama maqsad-ekranda tug'ilmaydi, u s2 ga qoldiriladi. Ustun nomi hodisa-tilida: «Ertasiga yana keldi».
> 🔴 **§125:** maqsad-ekran natijani **NOMLAYDI, ko'rsatmaydi** — kataklarda son emas, `?` turadi. Shu sababli s4 kashfiyoti (e'lon) ham, s8 mashqi ham oshkor bo'lmaydi.
> 🔴 **§128 (namuna o'z qoidasidan o'tadi):** demo qatorlarida son yo'q — ya'ni uni ko'chirib bo'lmaydi; s8 esa aynan sonni so'raydi, bola o'zi yozadi. ✅ belgisi qo'yilmaydi (§94: hali hech narsa bajarilmagan).
> 🔴 **40-qonun / korpus §40:** «yozib olasiz» (artefakt) · «botingiz» — o'quvchida bot bor ✓ («hisobingiz» hali yo'q — u s8 dan keyin).
> 🔴 **42-qonun:** «o'z-o'zidan yozilib chiqadi»; **54(b/c):** `ta-sub` ikkinchi qator YO'Q, demo ostidagi caption YO'Q.
> 🔴 **Ekran-o'lchovi:** proza **132 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (qaytish-kalendari) + 3 x Quiz
EKRAN: Bugun kelgan odam ertasi kuni yana kelsa — u qaytgan hisoblanadi. Demak har
kunda ikki son bo'ladi: nechta odam keldi va ulardan nechtasi qaytdi.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) kunlarni birma-bir ochib ikki
qatorni kuzatadi, keyin e'lon tugmasini bosib ikkalasining o'zgarishini solishtiradi;
(s6) Duolingo hisobini bashorat bilan ochadi.
JAVOB: s4 — e'londan keyin kelganlar 6 dan 23 ga chiqadi, qaytganlar 4 dan 5 ga.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar e'lon tugmasini bosib «23 ta! zo'r» deydi. Shu payt pastki
qatorni ko'rsating va so'rang: ertasiga nechtasi qaytdi? Xulosani siz aytmang —
ikki qatorni birga o'qing, bolalar o'zi aytsin.
```

**s2 — TEORIYA-1: «Keldi» ↔ «Qaytdi»** (korpus §73: ikki narsani yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Bugun kelgan odamlar ertaga ham o'shalarmi?»**

Mentor (≤2 gap, 32b):
> Botingizga har kuni odam keladi. Ikki kartani bosib solishtiring — ular bir xil sonni aytmaydi.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 👥 **Bugun kelganlar** | Bugun botni ochgan hamma odam. Kim birinchi marta kelganini bu son aytmaydi |
| ↩️ **Ertasiga yana kelganlar** | Kechagi odamlardan bugun yana kelganlari. Bu son kelganlardan oshmaydi va bitta kundan ko'rinmaydi |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif):
> **Bugun kelgan odam ertasi kuni yana kelsa — u qaytgan hisoblanadi.** Demak har kunda ikki son bo'ladi: nechta odam keldi va ulardan nechtasi qaytdi.

> 🔴 **39-qonun qolipi:** avval hodisa (ikki karta), keyin «… qaytgan hisoblanadi». Sarlavhada yangi atama YO'Q ✓ (§126: bosh atama s1 da emas, s2 da tug'iladi).
> 🔴 **§104:** ta'rif-gap to'liq (hodisa → shart → nom), kesik qurilma emas.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan.
> 🔴 **§103:** qoida fe'l bilan yozilgan («yana kelsa — qaytgan hisoblanadi»), yasama ot («qaytishlik», «qaytuvchanlik») YO'Q.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **283 grapheme** proza ✓ (karta matnlari — mashq-materiali; ikkala karta bir vaqtda ochiq turmasin — 15-bo'lim eslatmasi).

**s4 — YADRO: QAYTISH-KALENDARI** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Kunlarni oching va ikki qatorni birga kuzating.»**

Mentor (1 gap — 92a/ETALON 32: «▶ Keyingi kun» tugmasi ekranda ko'rinib turibdi, takror ko'rsatma olib tashlandi):
> Har ustun — botingizning bitta kuni, ostida esa o'sha kunning ikki soni.

> 🔴 **98b:** mentor e'londan keyin nima bo'lishini AYTMAYDI — fakt-qatorlar kun to'lgach chiqadi, o'quvchi o'zi o'qiydi.
> 🔴 **106d/71:** har kun ochilganda javob darhol: ustun belgilari **va** bitta fakt-qator — o'quvchi «qanchasi kecha ham kelgan?» savoliga javobni o'qiydi.
> 🔴 **72-qonun:** «▶ Keyingi kun» — yorliqli, diqqat-signali bilan; uch kun ochilgach signal e'lon tugmasiga ko'chadi.
> 🔴 **§95:** fakt-qatorlardagi har son ustundagi belgilar bilan bir xil — bola sanab tekshira oladi.
> 🔴 **§131 (yig'iladigan natija HAR qadamda sanalib borsin):** ikki qator («👥 Keldi» · «↩️ Qaytdi») har kun ochilganda darhol yangilanadi — xulosa faqat oxirida chiqmaydi, bola o'sishni bosqichma-bosqich ko'radi.
> 🔴 **§105/§121 (ildiz-tozaligi):** «qayt-» o'zagi darsda FAQAT bitta ma'noda — odam ertasi kuni yana kelgani. ❌ «pulni qaytarish», ❌ «javobni qaytaradi» (kod-izohida ham «natijani beradi» deb yoziladi).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + rang-legendasi + yakun-karta = **364 grapheme** ✓ (fakt-qatorlar — mashq-materiali).

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Botingizning uch kunini yozing.
(mentor, 1 gap · artefakt bor) Uch odamdan gaplarini eshitgansiz — endi ular ertasiga
qaytdimi, buni son aytadi.
(mentor, 1 gap · artefakt yo'q) Botingizga odamlar kelyapti — endi ular ertasiga
qaytdimi, buni son aytadi.
HARAKAT: Uch kunni BITTALAB yozadi (tartib qat'iy: 1-kun → 2-kun → 3-kun). Har kartada:
o'sha kuni nechta odam kelganini yozadi, keyin ulardan ertasiga nechtasi yana kelganini
yozadi. Saqlaganda qator o'ngdagi jadvalga ko'chadi.
JAVOB: Uch kun ham yozilgan · har katakda son bor · qaytganlar soni o'sha kuni
kelganlar sonidan oshmaydi.
RO'YXAT: Uch kun ham yozilgan · Har kunda ikki son bor · Qaytganlar kelganlardan oshmaydi
YULDUZCHA: Uch kunning qaytgan sonlarini yonma-yon qo'ying: qaysi kuni eng ko'p odam
qaytdi? O'sha kuni botingizda nima boshqacha bo'lganini bir qatorda yozing.
YORDAM: Kechagi ro'yxatni oching va bugungisi bilan solishtiring: ikkalasida ham bor
odamlar — qaytganlar.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Sonlarni hali sanamagan bolalar bo'ladi — ular bugungi kunni o'sha zahoti
sanaydi, qolgan ikki kunni botdagi yozuvlardan topadi. Aniq son topilmasa, taxminiy
sonni yozib, yoniga belgi qo'ymaydi — bu vazifa emas, hisobning boshlanishi.
```

🔴 **Kirish-artefakt tarmog'i (korpus §69 — ikki tarmoq bir shaklda, bir uzunlikda; mentor pufagi AYNAN shu bitta gap — ETALON 32):**
- **Artefakt BOR (`pm-m5d8-javoblar`):** sarlavha ostida bir qatorlik tasma — «🎙 Eshitganingiz: … · … · …» (`javoblar[].eshitgan`, uzuni qisqartirilib) + mentor: «Uch odamdan gaplarini eshitgansiz — endi ular ertasiga qaytdimi, buni son aytadi.» *(85)*
- **Artefakt YO'Q:** tasma render bo'lmaydi; mentor: «Botingizga odamlar kelyapti — endi ular ertasiga qaytdimi, buni son aytadi.» *(80)*
- 🔴 «topilmadi / saqlanmagan / bo'sh» so'zlari **0** · yo'qlik haqida gap YO'Q — jim zaxira (pasport talabi).
- 🔴 **Tasma — 92b:** yig'ilgan bir qator, to'liq javob matnlari EMAS; u ko'prik, ish-materiali emas — o'quvchi unga hech narsa yozmaydi.
- 🔴 **Ikki tomonlama shart (F-0803-22-B):** kalit va shakl bosh-agent muhridan (`{ javoblar: [{savol, eshitgan}x3], savedAt }`); m5-08 senariysi shu shaklni yozadi ⚠️ GATE S 6-savoli.

🔴 **Yozuv-kartasi (80b) — bitta karta, uch kun uchun uch marta:**

| Qadam | Kartada nima turadi | Ipucha (placeholder — korpus §32: qisqa savol, tayyor javob YO'Q) |
|---|---|---|
| Kun (o'zgarmas yorliq) | 1-kun · 2-kun · 3-kun | — |
| Keldi (qisqa son-maydon) | «Nechta odam keldi» | `Nechta odam?` |
| Qaytdi (qisqa son-maydon) | «Ulardan ertasiga nechtasi yana keldi» | `Ulardan nechtasi?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12; 106d ikki tomonlama):**
- ✅ ikkala katakda ham son, `qaytgan ≤ kelgan` → «✅ 2-kun yozildi: 7 odam keldi, 4 tasi qaytdi.» *(son o'quvchining o'zinikidan olinadi — §94: yozilgan narsani takrorlaydi, tekshirilmagan narsani tasdiqlamaydi)*
- 🤔 katakda son yo'q → «Bu katakka son yoziladi: nechta odam kelgan bo'lsa, shuni yozing.»
- 🤔 `qaytgan > kelgan` → «Ertasiga qaytganlar o'sha kuni kelganlardan ko'p bo'lolmaydi — ular o'sha kelganlarning ichidan sanaladi.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **Nega faqat son so'raladi (109-qonun · TMI):** chiqish-artefakt shakli muhrlangan (`{kun, kelgan, qaytgan}`) — «sabab» maydoni YO'Q va qo'shilmaydi. Bir dars — bitta ish: bu darsda o'quvchi **sanashni** o'rganadi, izohlashni emas. Sababni so'raydigan savol YULDUZCHA da qoladi (ballanmaydi).

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **113 grapheme** (artefakt bor) / **108** (artefakt yo'q) ✓ — javob-qatorlar harakatdan keyin, bittadan chiqadi.

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (kun-belgilash — qaytish kunlarini topish)
EKRAN: (topshiriq) Har qatorda qaytish kunlarini belgilang.
(yo'riqnoma) Mana bir haftalik ro'yxat: to'rt odam, har birining kelgan kunlari
yashil. Odam kecha ham kelgan bo'lsa — o'sha kunni bosing: bu qaytish kuni.
HARAKAT: To'rt qatorni BITTALAB o'tadi. Har qatorda yashil kataklardan qaytish
kunlarini bosadi; hech biri bo'lmasa «↩︎ Bu odam qaytmagan» tugmasini bosadi.
Tekshirgandan keyin javob va bir qatorlik sabab ochiladi; oxirida to'rttasi
xulosa-tasmada.
JAVOB: 1) Aziz (1·2·5) → 2-kun · 2) Dilnoza (2·3·4) → 3- va 4-kun · 3) Shohrux
(1·3·5) → qaytmagan · 4) Malika (3·4·5) → 4- va 5-kun. Jami 5 ta qaytish kuni.
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Bitta savol bering: shu katakning CHAP yonidagi
kun ham yashilmi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda: har o'quvchi sherigining uch kunlik hisobini o'qib, «qaysi kuni eng
ko'p odam qaytdi?» deb so'raydi. Javob topilmasa — hisob qayta o'qiladi.
MENTORGA: Eng ko'p adashiladigan joy — Shohrux qatori: u uch kun kelgan, demak
bolalar «qaytgan» deb belgilaydi. Yordamni eslating: chap yonidagi kun yashilmi?
Yo'q — kunlari oralab kelgan.
```

**To'rt qator (bir hafta, 5 kun — s4 kalendaridan BOSHQA to'plam, boshqa sahna):**

| Odam | 1-kun | 2-kun | 3-kun | 4-kun | 5-kun | To'g'ri belgilanadigan kunlar |
|---|---|---|---|---|---|---|
| 👤 Aziz | 🟩 | 🟩 | ⬜ | ⬜ | 🟩 | 2-kun |
| 👤 Dilnoza | ⬜ | 🟩 | 🟩 | 🟩 | ⬜ | 3- va 4-kun |
| 👤 Shohrux | 🟩 | ⬜ | 🟩 | ⬜ | 🟩 | — (qaytmagan) |
| 👤 Malika | ⬜ | ⬜ | 🟩 | 🟩 | 🟩 | 4- va 5-kun |

Javob ochilgandagi sabab-qatorlari:

| # | Javob-qatori |
|---|---|
| 1 | 2-kun: chap yonida 1-kun ham yashil — Aziz kecha ham kelgan edi |
| 2 | 3- va 4-kun: Dilnoza uch kun ketma-ket kelgan, demak ikki qaytish kuni |
| 3 | Shohrux kunlarini oralab kelgan — hech qaysi kunning chap yoni yashil emas |
| 4 | 4- va 5-kun: Malika 3-kundan boshlab uzilmay kelgan |

O'tish-gap (22-qonun — yangi sahna ochiq aytiladi, mentor 1 gap):
> Uch kunlik hisobingiz tayyor — endi bir haftalik to'rt odamda qaytish kunlarini topamiz.

Yakun-qatori (xulosa-tasma ostida):
> ✅ **Bir haftada to'rt odamdan uchtasi qaytdi: jami 5 ta qaytish kuni. Qaytish bitta katakdan emas, ikki kunning yonma-yon turishidan ko'rinadi.**

> 🔴 **26/59-qonun — farq-dalili (pasport talabi):** M4-D2 da o'quvchi **jadval qatorini** bo'lim nomiga MOSLIGI uchun belgilardi (mezon — mazmun); M3-D5 da kartani **ko'chirardi**; M4a-D2 da **tartib qurardi**; M4c-D6 da har xabarga **yo'l tanlardi**; m5-08 da savolni **elakdan o'tkazadi**; m5-02 da kanalni **funnelga joylaydi**. Kun-belgilashda esa hech narsa ko'chirilmaydi, tartiblanmaydi, yo'naltirilmaydi va mazmuniga qarab tanlanmaydi — bola **katakning CHAP YONIGA** qaraydi: mezon **o'rinlar munosabati**, mazmun emas. Boshqa obyekt (kun-katagi), boshqa harakat (yonini tekshirib belgilash), boshqa maqsad (qaytish kunini sanash).
> 🔴 **§120 (material har shart uchun bitta javobni himoyalaydi):** har qatorda beshta kunning holati to'liq ko'rinadi va qoida bitta (chap yon yashilmi) — ikkinchi javobni himoyalaydigan bo'shliq yo'q. Shohrux qatori ataylab «uch kun kelgan, lekin qaytmagan» qilib qo'yilgan: shu bitta qator «ko'p kelgan = qaytgan» degan yon-mantiqni materialning O'ZIDA yiqitadi.
> 🔴 **§107 (teng nisbat):** to'rt qatordan uchtasida qaytish bor, bittasida yo'q — «hammasida bor» naqshi yo'q; qaytish kunlari soni ham har xil (1 · 2 · 0 · 2), shakl bilan topib bo'lmaydi.
> 🔴 **§116:** YORDAM-savoli («chap yonidagi kun ham yashilmi?») mashqning HAR to'g'ri javobiga olib boradi — to'rt qatorning to'rtalasida ham teskari ishlamaydi (Shohrux uchun javob «yo'q» → qaytmagan ✓).
> 🔴 **106d + korpus §77/§98:** noto'g'ri belgilashda javob DOIM ochiladi: «🤔 Bu kunning chap yoni bo'sh — bu odam kecha kelmagan edi»; YORDAM faqat birinchi xatodan keyin.
> 🔴 **61-qonun:** tugma baho EMAS — «↩︎ Bu odam qaytmagan» harakat-gapi (MATN 6).
> 🔴 **SOFT aynan shu blokda** · **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ismlar (92d):** to'rt ism — sahnaning o'z materiali, o'quvchidan hech qanday ism so'ralmaydi.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **183 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (kompilyator, sof JS — R1 navbati)
EKRAN: (sarlavha) Qaytganlarni sanaydigan kod yozamiz.
(mentor, 2 gap) Siz qo'lda sanagan ishni endi kod bajaradi.
Sizga faqat bitta funksiya qoladi.
HARAKAT: Uch kunlik ro'yxat berilgan; har kun uchun kelganlar sonini va kechagi
ro'yxatda ham bor odamlar sonini qaytaradigan funksiyani yozadi.
JAVOB: Uch yozuv chiqadi: 1-kun 4 va 0 · 2-kun 3 va 2 · 3-kun 4 va 2.
RO'YXAT: Uch kun uchun uch yozuv qaytadi · Har yozuvda kun, kelgan, qaytgan bor ·
Birinchi kunning qaytgani 0
YULDUZCHA: Uch kunning qaytgan sonlarini qo'shib, haftaning jami qaytish kunini
chiqaring — s9 dagi 5 soni bilan bir xil hisob.
YORDAM: Bitta kundan boshlang: kechagi ro'yxatni oling va bugungi har odamni
undan qidiring. Birinchi kundan oldin kun yo'q — uning qaytgani 0.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Birinchi kunni 0 qilish esdan chiqadi — eng foydali xato. Shartlar buni
tutadi; s4 dagi «undan oldingi kun yo'q» fakt-qatorini eslating.
```

> 🔴 **87-qonun (o'tilgan texnik material):** massiv, obyekt, `for…of`, `if`, `push`, `.length`, `.includes`, `console.log` — M2–M4 da o'tilgan. `filter` bilan yozgan o'quvchiga ham ruxsat: JAVOB sharti **xulq-atvorda** tekshiriladi, matn-grep emas.
> 🔴 **26-qonun / R1:** m5-08 VS Code → **m5-11 kompilyator** — registr navbati, senariy o'zgartirmaydi.
> 🔴 **Korpus §19/§48:** sarlavha «…digan **kod** yozamiz» oilasidan, natijani aytadi.
> 🔴 **87c (halol ulanish):** PM tushunchasi (qaytish) kodda «kechagi ro'yxatda ham bormi?» shartiga aylanadi — bu halol: qaytish aynan shu tekshiruv.
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **115 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Ikki sonni yoddan ayta olasizmi?
(mentor) Ekranga qaramay javob bering: 2-kuni botingizga nechta odam keldi va
ulardan nechtasi qaytdi? Avval sherigingizga ayting, keyin bir qatorda yozing.
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
MENTORGA: Uchdan biri ikkinchi sonni aytolmasa — s4 kalendarini qayta oching va
2-kun ustunini birga sanang.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — **«O'zingizni sinab ko'ring.»**
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, keyin bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **106f(b):** yozib bo'lgach mukofot: «Endi botingizga kelgan odamlarni sanabgina qolmaysiz — ulardan nechtasi ertasiga qaytganini ham bilasiz» + qoida-qatori «🎯 Bugungi qoida: qaytish ikki kunning yonma-yon turishidan ko'rinadi».

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda hisobni o'zingiz yuritasiz: har kuni botingizga kim kelganini yozib
qo'yasiz, keyin ikki kunni yonma-yon qo'yib qaytganlarni topasiz. Qancha kun
kuzatasiz — o'zingiz tanlaysiz.
HARAKAT: Har kuni botga kelgan odamlarning ismini bitta ro'yxatga yozadi; ertasi
kuni yangi ro'yxat yozadi va ikkalasida ham bor ismlarni belgilaydi — o'sha kunning
qaytgan soni shu.
JAVOB: —
RO'YXAT: Har kunga kelganlar ro'yxati yozilgan · Ikki kun yonma-yon solishtirilgan ·
Har kunning qaytgan soni yozilgan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Ikki kunning ro'yxatini yozing va ikkalasida ham bor odamlarni
sanang — o'sha son ikkinchi kunning qaytgani bo'ladi.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Boti hali odam yig'magan bolalar sinfdoshining botida bajaradi — qoida o'sha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «uch kun», «ikki kun» faqat variant-kartalarida.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — ro'yxatlarni yonma-yon qo'yish s9 da, qaytganlarni sanash s4/s8 da bajarilgan.
> 🔴 **92d:** boti hali odam yig'magan o'quvchi sinfdoshining botida bajaradi — vazifa devor bo'lmaydi (kartada bitta qator: «Botingizda odam kam bo'lsa — sinfdoshingiznikida»).
> 🔴 **Korpus §125:** kuzatiladigan hodisa aytiladi («ikkalasida ham bor ismlar»), mavhum «e'tibor bering» emas.

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
MAVZU: Qaytgan odam kim (ertasi kuni yana kelgan); kunning ikki soni (keldi va
qaytdi); birinchi kunning qaytgani; qaytganlar kelganlardan oshmasligi; e'lon qaysi
sonni ko'taradi; qaytish ikki kunning yonma-yon turishidan ko'rinishi; Duolingo
hisobi kunlarni sanashi; bir kun tashlansa hisob noldan boshlanishi; uch kunlik
hisobni kim yozishi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §110 (mutlaq so'z ≤1) · §118 (cheklov-so'zsiz) · §127 (atama ≥2 variantda yoki hech birida) · §129 (kalit xulosadan so'zma-so'z emas) · §133 (xulosa-bandi keyingi test kaliti emas) · §134 (rang-holati distraktorda ishlamaydi; kalitda savol soni qaytmaydi). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🤖 Seshanbagi 5 odamdan 3 tasi dushanba ham kelgan. Kim qaytgan hisoblanadi?
- A. Seshanba kuni kelgan besh odam *(30)*
- **B.** Ikki kunda ham kelgan uch odam ✅ *(30)*
- C. Dushanba kuni kelmagan ikki odam *(32)*

**Reveal:** To'g'ri — qaytgan degani ertasiga yana kelgani: uch odam ikkala kunda ham bor.

> 🔴 **§129/§106:** s2 xulosasi qoidani aytadi — savol esa VAZIYATNI beradi (ikki kun, ikki son) va bola qoidani QO'LLAYDI. Kalit so'zma-so'z ko'chirma emas.
> 🔴 **§102:** A — seshanba kuni ular chindan kelgan (ekranda rost bo'lib ko'rinadi), lekin hammasi qaytgan emas; C — 5−3=2 hisobi to'g'ri, lekin bu qaytmagan odamlar. Ikkalasi ham darsni O'QIGANNI mukofotlaydi.
> 🔴 **§127:** dars atamasi («qaytgan») faqat savolda; uchala variantda ham yo'q — kalit-so'z bilan topib bo'lmaydi ✓.
> 🔴 **§99:** uchalasi ham «qanaqa odam?» shaklida, «… odam» bilan tugaydi. Uzunlik: 30 · 30 · 32 (to'g'ri javob eng uzun emas, narvon yo'q, tell 1.07) ✓. Savol 11 so'z ✓.
> 🔴 **§134:** savoldagi sonlar (5 · 3) uchala variantda ham qaytadi — son-echo hech kimga yo'l ochmaydi.

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 📣 Do'stingiz e'lon berdi: bir kunda 40 yangi odam keldi. Ertasiga u nimani ko'radi?
- **A.** Ozchiligi ertasiga yana keldi ✅ *(28)*
- B. Deyarli hammasi ertasiga yana keldi *(34)*
- C. Ertasiga yangi 40 odam keldi *(27)*

**Reveal:** To'g'ri — e'lon yangi odam olib keladi, lekin ulardan ertasiga ozchiligi qaytadi.

> 🔴 **§129/§133:** s4 yakun-kartasi «yangi odam olib kelish oson» deydi; test **BOSHQA son** (40, s4 da yo'q) va **boshqa odam** (do'sti) beradi, savol esa odamlarning HARAKATINI so'raydi. Xulosa-gapning bandi kalitga aylanmadi.
> 🔴 **§102:** B — «e'lon kuchli bo'lsa hammasi qoladi» degan kundalik tasavvur, s4 uni ochiq rad etadi (4 dan 5 ga); C — ertasiga e'lon takrorlanmaydi, s4 5-kuni buni ko'rsatgan. Ikkalasi ham ishonarli, lekin darsda yolg'onga chiqarilgan.
> 🔴 **§110:** mutlaq so'z bitta variantda («deyarli hammasi» — u ham yumshatilgan) ✓ · kulgili-bo'sh variant yo'q.
> 🔴 **§99:** uchalasi ham «ertasiga nima bo'ldi» shaklidagi fe'l-gap. Uzunlik: 28 · 34 · 27 (tell 1.26, to'g'ri javob eng uzun EMAS) ✓.
> 🔴 **§127:** «qaytish» atamasi hech bir variantda yo'q; uchalasida ham «keldi» ✓.

### TEST-3 (s7 — s6 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 🦉 Duolingo'dagi 🔥 hisob o'sishi uchun odam nima qilishi kerak?
- A. Bir kunda bir nechta dars qilishi *(31)*
- B. Bir haftada bir marta dars qilishi *(33)*
- **C.** Kunini tashlamay dars qilishi ✅ *(28)*

**Reveal:** To'g'ri — bu hisob kunlarni sanaydi: kecha dars qilgan odam bugun ham qilsagina u o'sadi.

> 🔴 **§106/§129:** slaydlar hisob **nimani sanashini** va bir kun tashlansa **noldan boshlanishini** alohida aytadi; savol ikkovini QO'SHIB qo'llashni so'raydi va javobni odam harakatiga o'giradi — birorta slayd gapi so'zma-so'z ko'chirilmaydi.
> 🔴 **§102:** A — «ko'p dars = ko'p natija» degan maktab-mantig'i; slayd-1 uni rad etadi (hisob darslarni emas, kunlarni sanaydi). B — til o'rganish haqidagi tasavvur; slayd-2 rad etadi. Ikkalasi ham o'qiganni mukofotlaydi.
> 🔴 **§127:** «kun» so'zi uchala variantda ham bor — kalit-so'z telli yo'q ✓.
> 🔴 **§99:** uchalasi ham «… qilishi» bilan tugaydigan harakat-shart. Uzunlik: 31 · 33 · 28 (tell 1.18, to'g'ri javob eng qisqa) ✓. Savol 9 so'z ✓.
> 🔴 **§21:** ballanadigan matnda izohsiz chet so'z yo'q — «streak» YO'Q, «🔥 hisob» s6 da ochilgan.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 🤖 Chorshanba 15 odam keldi; ulardan 4 tasi seshanba ham kelgan edi. Nimani yozasiz?
- A. Chorshanba: keldi 15, qaytdi 15 *(31)*
- **B.** Chorshanba: keldi 15, qaytdi 4 ✅ *(30)*
- C. Chorshanba: keldi 4, qaytdi 15 *(30)*

**Reveal:** To'g'ri — «qaytdi» katagiga faqat kecha ham kelganlar yoziladi: to'rt odam.

> 🔴 **§129:** savol darsning O'Z ishini (s8 dagi hisob-qatorini) yangi sonlar bilan takrorlashni so'raydi — xulosa-ko'chirma emas, ish-ko'chirma: bola qoidani amalda qo'llaydi.
> 🔴 **§99/§133:** uchala variant ham AYNAN bir qolipda («Chorshanba: keldi _, qaytdi _») — tinish-shakl telli yo'q, farq faqat sonlarning joyida. Uzunlik: 31 · 30 · 30 (tell 1.03) ✓ to'g'ri javob eng uzun emas ✓.
> 🔴 **§134:** savoldagi ikki son (15 · 4) uchala variantda ham qaytadi — son-echo bilan kalit topib bo'lmaydi; tanlov ma'noda qoladi.
> 🔴 **§102:** A — «kelganlarning hammasi qaytadi» tasavvuri, s2 kartasi rad etadi; C — ikki sonning o'rni almashgan, s8 shartida ochiq rad etilgan (`qaytgan ≤ kelgan`).
> 🔴 **§127:** «qaytdi» uchala variantda ham bor ✓ — atama to'g'ri javobda yolg'iz yashamaydi.

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan (✅ savol oldida turmaydi).

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — «1-kun · 2-kun · 3-kun»: yozilgani yashil ✓, joriysi indigo miltillashda, kelgusi kulrang-punktir. Indikator o'quvchiga qaysi kunga son yozayotganini aytadi — alohida yorliq kerak emas.

**Yozuv-kartasi (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida: kun-yorlig'i (o'zgarmas, katta) → «Nechta odam keldi» son-maydoni → «Ulardan ertasiga nechtasi yana keldi» son-maydoni + jonli javob-qatori. Uch kun uchun bir xil karta — bir shakl, uch marta.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI — faqat indikator chirog'i yonadi; uchtasi ham yozilgach jadval to'liq enda ochiladi (✎ tahrir shu yerda). Saqlangan qator ko'rinishi: `2-kun · 👥 keldi 7 · ↩️ qaytdi 4` — s1 demo jadvali bilan bir shaklda (korpus §67d).

**Ipuchalar (92c/85 · korpus §32 · §115 bir tilda):** `«Nechta odam?»` · `«Ulardan nechtasi?»` — ikkalasi ham qisqa savol, bitta gap-turida; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q. s4 dagi sonlar (9 · 7 · 6) placeholder'ga yozilmaydi — o'quvchi o'z botining sonlarini yozadi.

**106d javob (ikki tomonlama):** ✅ «2-kun yozildi: 7 odam keldi, 4 tasi qaytdi.» *(o'quvchining O'Z soni qaytariladi — §94/§130: tekshirilmagan narsa tasdiqlanmaydi)* · 🤔 «Bu katakka son yoziladi: nechta odam kelgan bo'lsa, shuni yozing.»

**Mantiqiy shart (yumshoq emas — qat'iy):** `qaytgan > kelgan` bo'lsa saqlanmaydi va sabab ochiq aytiladi: «Ertasiga qaytganlar o'sha kuni kelganlardan ko'p bo'lolmaydi — ular o'sha kelganlarning ichidan sanaladi.» Bu darsning yagona qat'iy sharti: u qoidaning O'ZI (§120).

**Nol ruxsat etiladi:** `qaytdi = 0` — to'liq haqiqiy javob, hech qanday ogohlantirish chiqmaydi. Botga endi odam yig'ilayotgan o'quvchi 0 yozadi va bu xato emas (§94: yolg'on tasdiq yo'q).

**Kirish-tasma (`pm-m5d8-javoblar`):** sarlavha ostida ixcham bir qator, ish-maydoni EMAS; artefakt yo'q bo'lsa — qator yo'q, oradagi joy yopiladi (bo'shliq qolmaydi).

---

## 6. KEYS SPETSIFIKATSIYASI (s6 — K5 DUOLINGO · 33/56/100-qonun qolipi)

🔴 **Burchak (0-bo'limdagi farq-dalili):** M8-D1 streak'ni **usul** sifatida ochgan (qo'rquv → odat → qaytish). Bu ekran esa **sanoq birligini** ochadi: hisob nimani sanaydi, va nega aynan **kun**.

🔴 **Bankdan tashqari fakt YO'Q** (§101/§124): ekranga faqat `PM_Prompt_v8` K5 bandidagi narsalar chiqadi — ketma-ket kunlar hisobi · bir kun tashlansa hisob yo'qoladi · eslatmalar · «muzlatish». **Raqam yo'q** (bank bu keysga birorta son bermagan) — demak §122 buzilishi imkonsiz: darsning ta'rifiga zo'rlab kiygiziladigan keys-raqamining O'ZI yo'q. Foydalanuvchi soni, kun soni, o'sish — hech biri aytilmaydi.

**Freym (91b):** eyebrow — **«🦉 Duolingo»**. «Keys» so'zi ekranda yo'q (korpus §84).

**Bosqich-hisoblagichi (17-ov b · uzluksiz):** eyebrow har bosqichda bitta hisoblagich bilan turadi — «🦉 Duolingo · 1/7» … «7/7». Bosqichlar: slayd-1 · bashorat-1 · slayd-2 · bashorat-2 · slayd-3 · slayd-4 · ko'prik-gap. Bashorat javobidan keyin hisoblagich yo'qolmaydi, uzuq raqam qolmaydi (naqsh: `PmLesson9.jsx` s6). 🔴 **Jonli son-hisoblagichi YO'Q** — bank raqamsiz, o'ylab topilgan son sanalmaydi (§101/§123 — M4-D7 va M4c-D6 pretsedenti).

**4 slayd (hikoya tilida — 42-qonun · ovoz chiqarib o'qib tekshirildi):**

1. **Duolingo — til o'rgatadigan ilova.** Uni ochganingizda birinchi ko'zga tashlanadigan narsa — ekran tepasidagi **🔥 hisob**. U sizning darslaringizni emas, boshqa narsani sanaydi.
2. *(bashorat-1 dan keyin)* **🔥 hisob ketma-ket necha kun dars qilganingizni sanaydi.** Kecha ham, bugun ham dars qilgan bo'lsangiz — son o'sadi. Bitta kunni tashlab ketsangiz, u **yana noldan boshlanadi**.
3. *(bashorat-2 dan keyin)* Shuning uchun ilova **har kuni eslatma yuboradi**, va bitta kunni yopib turadigan **«muzlatish»** ham beradi: bir kun kelolmagan odamning hisobi saqlanib qoladi.
4. **Demak Duolingo'ning butun hisobi bitta savolga tayanadi:** kecha kelgan odam bugun ham keldimi. Uning o'lchov birligi — **kun**: soat bilan ham, hafta bilan ham sanamaydi.

**Bashorat-1 (2-slayddan oldin · 1-o'lchov: NIMA SANALADI):**
**Savol:** «Ekran tepasidagi 🔥 hisob nimani sanaydi?»
- «Jami yodlagan so'zlaringiz sonini» *(35)*
- «Ketma-ket dars qilgan kunlaringizni» ✅ *(34)*
- «Ilovada o'tkazgan umumiy vaqtingizni» *(36)*

**Bashorat-2 (3-slayddan oldin · 2-o'lchov: ILOVA NIMA QILADI):**
**Savol:** «Bu hisob uzilib qolmasligi uchun ilova odamga nima yuboradi?»
- «Yangi darslar ro'yxatini» *(24)*
- «Kunlik eslatma xabarini» ✅ *(23)*
- «Bepul sovg'a va ballarni» *(23)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! …» — quyruqsiz; adashsa «Adashdingiz — asl javob: …». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — darsga qaytadi) — 🔴 ALOHIDA BOSQICH (7/7):**
> Duolingo'ning savoli sizning botingizda ham turadi: kecha kelgan odam bugun ham keldimi. Duolingo buni kunlar hisobi bilan sanaydi — siz esa uni ikki kunni yonma-yon qo'yib sanaysiz.

> 🔴 **M8-D1 bashoratlaridan farq (majburiy tekshiruv):** M8-D1 bashoratlari — «hisob nolga tushay deb qolsa **odam** nima qiladi?» va «bir kun o'tkazsangiz **Duolingo** nima qiladi?» (javob: muzlatish). Bu ekranning bashoratlari — «hisob **nimani sanaydi**?» va «ilova odamga **nima yuboradi**?». Savollar ham, javoblar ham kesishmaydi ✓. «Muzlatish» bu darsda **slayd-3 da fakt sifatida** aytiladi, bashorat javobi qilinmaydi — ya'ni ikki dars bir savolga ikki xil to'g'ri javob bermaydi.
> 🔴 **Bashorat halolligi (17/43/64):** har bashorat bitta o'lchovning uch nomzodi; distraktorlar bank-faktlariga zid emas, shunchaki boshqa narsani nomlaydi. Uzunlik: 35·34·36 · 24·23·23 (to'g'ri eng uzun emas) ✓ — bashorat BALLANMAYDI.
> 🔴 **§123 (bashorat-chipida izohsiz atama yo'q):** «🔥 hisob» slayd-1 da hodisa bilan ko'rilgan; «muzlatish» qo'shtirnoqda va o'sha gapda ochilgan.
> 🔴 **§101(b) ketma-ketlik tekshiruvi:** slayd-1 «darslarni emas, boshqa narsani sanaydi» deydi → slayd-2 uni ochadi (kunlar); slayd-2 «bir kun tashlansa noldan» deydi → slayd-3 buni yumshatadigan istisnoni beradi (muzlatish) va **oldingi gapni yolg'onga chiqarmaydi** (muzlatish — alohida yordam, qoidaning o'zi emas). Slayd-4 uchalasidan chiqadigan xulosa.
> 🔴 **§124 (chegaralangan inkor):** «soat bilan ham, hafta bilan ham sanamaydi» — bu bankdagi faktning o'zi (hisob kunlar bilan yuradi) konkret o'lchovda aytilgani; bank JIM bo'lgan narsa haqida inkor yozilmaydi.
> 🔴 **§20:** «streak» so'zi ekranda **0** — o'zbekcha ibora («ketma-ket kunlar hisobi») uning o'rnini oladi.
> 🔴 **Ekran-o'lchovi:** slayd-2 = 196 · slayd-3 = 214 · slayd-4 = 202 · ko'prik = 199 grapheme ✓ (ko'prik slayd-4 bilan bir vaqtda ekranda turmaydi).
> 🔴 **Mentorga (`MentorNote`):** «Bu keysda rasmiy raqam yo'q — foydalanuvchi soni yoki o'sishini o'zingizdan aytmang. Sinfda Duolingo ishlatadigan bolalar bo'ladi: hisoblarini so'rang, lekin taqqoslash tanloviga aylantirmang.»

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · KOMPILYATOR, sof JS)

🔴 **Qobiq-talablari (pasport):** sof JS · **`previewUrl` YO'Q** (natija — `console.log`) · shartlar **xulq-atvorda** tekshiriladi (matn-grep emas) · **starter yashil emas** (18-ov bandi) · to'liq-ekran qobig'ida `zoom: 'calc(1 / var(--lz, 1))'` bekori **majburiy** — `PmLesson15.jsx:1841` va `PmLesson17` naqshi (`.lesson-root` da `zoom: var(--lz)` bor, kompilyator qobig'i uni ikkinchi marta qo'llasa 2560×1440 da ekran ikki barobar kattalashadi).

**Darvoza-mashq (82e):** bitta savol-tanlov: «2-kuni kelganlar: Dilnoza · Shohrux · Nodira. Kecha ro'yxatda Dilnoza va Shohrux bor edi. Bu kunning qaytgani nechta?» → «3 — o'sha kuni kelgan hamma odam» *(31)* / «2 — kecha ham kelgan ikki odam» ✅ *(30)* / «1 — kecha kelmagan bitta odam» *(29)* — uchalasi bir turda (son + sabab, §129), tell 31 ÷ 29 = 1.07 ✓, to'g'ri javob eng uzun emas ✓.

**Boshlang'ich kod:**

```js
// Botingizning uch kuni — har kuni kim kelgani
const kunlar = [
  { kun: 1, kelganlar: ['aziz', 'dilnoza', 'shohrux', 'malika'] },
  { kun: 2, kelganlar: ['dilnoza', 'shohrux', 'nodira'] },
  { kun: 3, kelganlar: ['shohrux', 'nodira', 'jasur', 'aziz'] },
];

function hisob(kunlar) {
  // Har kun uchun bitta yozuv tayyorlang: { kun, kelgan, qaytgan }.
  // qaytgan — kechagi ro'yxatda ham bor odamlar soni.
  // Birinchi kundan oldin kun yo'q: uning qaytgani 0.
  return [];   // <- bu joyni siz to'ldirasiz
}

console.log(hisob(kunlar));
// [{ kun: 1, kelgan: 4, qaytgan: 0 },
//  { kun: 2, kelgan: 3, qaytgan: 2 },
//  { kun: 3, kelgan: 4, qaytgan: 2 }]
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda — xulq-atvor bo'yicha tekshiriladi):**
1. Uch kun uchun uch yozuv qaytadi — `Array.isArray(n) && n.length === 3`
2. Har yozuvda kun, kelgan, qaytgan bor va `kelgan` to'g'ri — har `i` uchun `n[i].kun === i+1 && n[i].kelgan === kunlar[i].kelganlar.length`
3. Birinchi kunning qaytgani 0, qolganlari to'g'ri sanalgan — `n.map(x => x.qaytgan)` aynan `[0, 2, 2]`

**YORDAM (yechimni aytmaydi — korpus §77):** Bitta kundan boshlang: kechagi ro'yxatni oling va bugungi har odamni undan qidiring. Birinchi kundan oldin kun yo'q — uning qaytgani 0.

**YULDUZCHA:** Uch kunning qaytgan sonlarini qo'shib chiqaring — bitta son bilan butun hafta haqida gapira olasiz.

> 🔴 **18-ov (starter yashil emas):** boshlang'ich `return []` — 1-shart `length === 3` talab qilgani uchun qizil, 2- va 3-shart ham qizil. Uch shartning uchalasi ham boshida qizil ✓.
> 🔴 **Sanoq-mosligi (22-qonun):** natija `[0, 2, 2]` — birinchi kunning 0 i s4 dagi «undan oldingi kun yo'q» fakt-qatori bilan bir xil qoida; ismlar s9 dagi to'rt ism bilan bir oila (Aziz · Dilnoza · Shohrux · Malika + Nodira · Jasur), lekin **sonlar boshqa** — kod s9 javobini takrorlamaydi.
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`kunlar` · `kelganlar` · `kelgan` · `qaytgan` · `hisob`): kodda ham, artefaktda ham bir xil shakl (`pm-m5d11-metrika.kunlar[].kelgan/qaytgan`) — o'quvchi kod natijasi va o'z hisobi bir tilda ekanini ko'radi ⚠️ GATE S 7-savoli.
> 🔴 **87-qonun:** massiv · obyekt · `for…of` · `if` · `push` · `.length` · `.includes` — M2–M4 materiali. `filter`/`reduce` bilan yozgan o'quvchi ham o'tadi (shartlar xulq-atvorda).
> 🔴 **Pedagogik ulanish (87c):** mentor ochiq aytadi — s9 da qo'l bilan qilingan ish («chap yonidagi kun yashilmi?») kodda «kechagi ro'yxatda bormi?» ga aylanadi.
> 🔴 **82(c):** panel (yo'riq + darvoza-mashq + «✅ Bajardim — uch yozuv chiqdi») CHAPDA, kod O'NGDA · **82(f):** sinf-natijasi o'quvchiga ko'rinmaydi.
> 🔴 **89-qonun:** takrorlash-yo'li (erkin rejim, matn-havola): «✓ Bu mashqni sinfda bajarganman — davom etish →».

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qator CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Kataklarda son emas, `?` — kashfiyot oshkor bo'lmaydi (§125) |
| **s12 REFLEKSIYA** | Sarlavha: «Ikki sonni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». Yozgach mukofot (106f-b) |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q) |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |
| **Bot-nomi** | Ekranda bot nomi so'ralmaydi va ko'rsatilmaydi — hamma joyda «botingiz» (92d). «Botjon» **0** |

**s15 «Endi siz bilasiz» 4 qator (korpus §52 — qisqa, tugal, mustaqil gap):**
1. «Bugun kelgan odam ertasi kuni yana kelsa — u qaytgan hisoblanadi.»
2. «Har kunda ikki son bo'ladi: nechta odam keldi va ulardan nechtasi qaytdi.»
3. «E'lon kelganlar sonini ko'taradi — qaytganlar soni esa deyarli o'zgarmaydi.»
4. «Qaytish ikki kunning yonma-yon turishidan ko'rinadi — bitta kundan emas.»

### 8-A. 🔴 TAQIQ-SO'ZLAR (senariy-yozuvchi belgiladi — har biri bu darsda **0**)

| So'z | Nega taqiq | Nima ishlatiladi |
|---|---|---|
| `retention` | M8-D1 atamasi (29-qonun) + korpus §20 | «qaytish» · «qaytgan» |
| `DAU` · `MAU` | izohsiz qisqartma (korpus §20) + M8-D1 atamasi | «bugun kelganlar soni» |
| `churn` | M8-D1 atamasi | «qaytmaganlar» |
| `kogorta` | kattalar atamasi, o'smir lug'atida yo'q | «o'sha kuni kelgan odamlar» |
| `metrika` | M8-D1 ning bosh atamasi (29-qonun) | «son» · «hisob» |
| `dashboard` · `panel` | M4c-D6 ning imzo-nomi + inglizcha | «kalendar» (senariy-ichi), ekranda «botingizning kunlari» |
| `analitika` · `statistika` | kattalar tili | «sanash» · «hisob» |
| `voronka` · `funnel` | m5-02 ning TEKSHIRUV mexanikasi (yo'lakcha-taqiq) | — |
| `konversiya` | izohsiz kalka | — |
| `streak` | M8-D1 ekranda ishlatgan; korpus §20 | «🔥 hisob» · «ketma-ket kunlar hisobi» |
| `foiz` · `%` | M8-D1 ning sanoq-usuli; bu dars tirik sanoqda qoladi | «9 odam keldi, 4 tasi qaytdi» |
| `ko'rsatkich` | kantselyarit | «son» |
| `Botjon` | personaj-taqiq (DARS_ETALON 5.8) | «botingiz» |
| `daftar` | global taqiq (F-0729-04) | «ro'yxat» · «jadval» |
| tibbiyot-metaforasi oilasi | til-lint ning tibbiyot-qoidalari (4.1 TAQIQ) | — |
| til-lint global taqiq oilasi | tana-metaforasi · yashirin-so'z · kattalar-sifati qoidalari | — |
| `kirdi` (odam haqida) | ildiz-tozaligi §121 + til-lint `yana-kirish` qoidasi | «keldi» · «yana keldi» |

🔴 **Grep-tekshiruvi (quruvchiga):** yuqoridagi 17 qatorning har biri o'quvchi matni bo'yicha grep qilinadi. Istisno YO'Q: `retention` dars matnida umuman yozilmaydi (29-qonun — kelajak-dars atamasi).

### 8-B. Quruvchiga — `SCREEN_INTENTS` va s4/s9 holat-mashinalari (qisqa)

| Ekran | intent | done-sharti (PRACTICE_BASE signali) |
|---|---|---|
| s0 | hook-vote | tanlov bosildi (payoff ochildi) |
| s1 | preview | animatsiya tugadi (avto) |
| s2 | compare-2 | ikkala karta kamida bir marta ochildi (`seen`, 46-qonun) |
| s4 | calendar-days | uch kun ochildi **va** e'lon bosildi (yakun-karta ochilgach) |
| s6 | case-slides | 4 slayd o'tildi (2 bashorat belgilangan) + ko'prik ko'rildi |
| s8 | workshop-3 | 3/3 saqlandi (`pm-m5d11-metrika` yozildi) |
| s9 | mark-4 | 4/4 qator belgilandi (to'g'ri-noto'g'ri farqsiz — bajarilganlik) |
| s10 | compiler-check | uch shart ham yashil (darvoza-mashq to'g'ri bo'lgach ochiladi) |
| s12 | reflection | bir qator yozildi |

**s4 holat-mashinasi:** `idle` → (▶ Keyingi kun ×3) `day1` → `day2` → `day3` (har qadamda ustun belgilari fade-in bilan chiqadi, fakt-qatori qoladi, ikki qator yangilanadi) → `adOpen` (e'lon tugmasi ochiladi; 40–45 s harakatsizlikda ipucha) → (📣) `day4` → `day5` (ketma-ket, ~3 s oraliq) → `done` (yakun-karta + `Day Two!`). `prefers-reduced-motion`: ustunlar animatsiyasiz to'liq holatda chiqadi, 4- va 5-kun ikki alohida bosish bilan. Holat `pm-m5d11-kun` ga yoziladi (F-0730-01 progress-saqlov: qayta kirganda `done` bo'lsa yakun-karta ochiq turadi).

**s9 holat-mashinasi:** `i = 0..3` · har qatorda yashil kataklar bosiladi (toggle) yoki «↩︎ Bu odam qaytmagan» → «Tekshirish» → javob-qatori (✅/🤔 + sabab) → «Keyingisi ▸» → oxirida `strip` (to'rtta qator bir tasmada: ism + qaytish kunlari) + yakun-qatori. Birinchi noto'g'ri javobdan keyin YORDAM yorlig'i ochiladi (bir marta ko'rinadi). To'rt qator `pm-m5d11-belgi` ga yoziladi.

**s6 slaydlari:** eyebrow «🦉 Duolingo · n/7» (uzluksiz bosqich-hisoblagichi — 17-ov b) · slayd-1 → bashorat-1 → natija-qatori → slayd-2 → bashorat-2 → natija-qatori → slayd-3 → slayd-4 → **ko'prik-gap alohida bosqichda**.

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s · to'g'ri indekslar 0,3,2,1 · 1,0,2,3 · 0,2,1,3)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.

| # | Savol (qisqa) | To'g'ri idx | Manba |
|---|---|---|---|
| 1 | Qaytgan odam kim? | 0 | s2 |
| 2 | Bir kunda qaysi ikki son yoziladi? | 3 | s2/s8 |
| 3 | Birinchi kunning qaytgani nechta? | 2 | s4/s10 |
| 4 | Qaytganlar soni o'sha kuni kelganlardan ko'p bo'lishi mumkinmi? | 1 | s2/s8 |
| 5 | E'lon qaysi sonni ko'taradi? | 1 | s4 |
| 6 | 10 odam keldi, ertasiga 3 tasi yana keldi — qaytgani nechta? | 0 | s2/s4 |
| 7 | Nega bitta kunlik son yetmaydi? | 2 | s2/s4 |
| 8 | Qaytish nimadan ko'rinadi? | 3 | s9 |
| 9 | Duolingo'dagi 🔥 hisob nimani sanaydi? | 0 | s6 |
| 10 | Bir kun dars qilinmasa, o'sha hisob nima bo'ladi? | 2 | s6 |
| 11 | Odam 1, 3 va 5-kunlari kelgan — nechta qaytish kuni bor? | 1 | s9 |
| 12 | Botingizning uch kunlik hisobini kim yozadi? | 3 | s8/s15 |

> 🔴 **§117 (metafora-so'z ballanadigan matnda tug'ilmaydi):** darsda metafora umuman yo'q — hamma so'z to'g'ri ma'nosida ✓.
> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q — «retention», «streak», «metrika», «foiz» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «keldi», «qaytdi», «kun», «e'lon», «hisob» so'zlari bilan.
> 🔴 **§114:** arena-fon/dekor so'zlari shu dars lug'atidan (kun · keldi · qaytdi · odam · hisob · e'lon) — M8-D1 tokenlari (`DAU`, `%`, `retention`, `churn`) fonga CHIQMAYDI (klon-residue-grep majburiy).
> 🔴 **§134:** birorta variant rang-holatiga tayanmaydi (s4 dagi yashil belgi ma'nosi o'quvchi matnida ochilgan bo'lsa ham, arena savoli uni ishlatmaydi).

🔴 **Arena-yozish sharti (metodist · 16-ov + §110/§127 — quruvchiga majburiy):** to'rt variantli savolda **ikki variantlik olam** (ha/yo'q · qaytgan/qaytmagan) bo'lsa, variantlar **2/2** yoziladi va farq SABABda qoladi. Ikki eng xavflisi shu yerda to'liq yozildi, qolgan 10 tasi shu qolipda:

**Q4 (to'g'ri idx 1)** — «Qaytganlar soni o'sha kuni kelganlardan ko'p bo'lishi mumkinmi?»
- «Ha — ertasiga yana yangi odam qo'shiladi» *(40)* · **«Yo'q — qaytganlar shu kelganlar ichidan»** ✅ *(37)* · «Ha — kun uzun bo'lsa son oshib ketadi» *(36)* · «Yo'q — bot ularni ikki marta sanamaydi» *(37)*
- 2 «Ha» / 2 «Yo'q» (§107) — bola hukmni emas, SABABni tanlaydi; ikkinchi «Yo'q»ning sababi darsda ochiq yolg'on (bot ikki marta sanashi haqida hech qayerda gap yo'q — masala sanoqda emas, to'plamda). Uzunlik 40 · 37 · 36 · 37 (tell 1.11, to'g'ri javob eng uzun emas) ✓.

**Q11 (to'g'ri idx 1)** — «Odam 1, 3 va 5-kunlari kelgan — nechta qaytish kuni bor?»
- «Uchta — uch kuni ham kelgani uchun» *(33)* · **«Bittasi ham yo'q — kunlar oralab»** ✅ *(31)* · «Ikkita — 3 va 5-kunlar qaytish» *(30)* · «Bittasi — oxirgi 5-kun qaytish» *(30)*
- «qaytish» atamasi ikki variantda (§127) ✓; to'g'ri javob eng uzun emas ✓ (tell 1.10); har distraktorning sababi savol-materialida yolg'on (kunlar ketma-ket emas).

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Day Two!** | Kunlarni ochib ikki sonni yonma-yon ko'rdingiz | 46 | s4: uch kun ochildi va e'lon bosildi, yakun-karta ochildi |
| **Count Keeper!** | Uch kunning hisobini yozdingiz | 29 | s8: 3/3 saqlandi |
| **Two In A Row!** | To'rt qatorda qaytish kunlarini belgiladingiz | 44 | s9: 4/4 qator belgilandi |
| **Code Counter!** | Qaytganlarni kod bilan sanadingiz | 32 | s10: uch shart ham yashil |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 29–46 belgi ✓.
> 🔴 **§100 (omonim-tekshiruvi):** «Day Two», «Count Keeper», «Two In A Row», «Code Counter» — kursning texnik lug'atida boshqa ma'no bermaydi ✓ (❌ «Pattern Finder» — `pattern` m6-03 «Arxitektura patternlari» darsining atamasi, RAD; ❌ «Streak Master» — «streak» bu darsda taqiq-so'z, RAD; ❌ «Retention Hero» — taqiq-so'z, RAD).
> 🔴 **§93/§133 (tasdiq faqat REAL tekshirilgan ishni aytadi):** s9 ning done-sharti **bajarilganlik** (4/4 belgilandi), to'g'rilik emas — shuning uchun tavsifda «to'g'ri» so'zi YO'Q: «belgiladingiz». s10 tavsifi esa «sanadingiz» — u yerda uch shart chindan yashil bo'lishi talab qilinadi ✓. s4 tavsifi ham faqat bajarilgan ishni aytadi («ochib … ko'rdingiz») — sonni bola «topmaydi», u kun ochilganda o'zi chiqadi ✓.

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Qaytgan odam kim? | Bugun kelgan odam ertasi kuni yana kelsa — u qaytgan hisoblanadi |
| 2 | Bir kunda qanday ikki son bo'ladi? | Nechta odam keldi va ulardan ertasiga nechtasi qaytdi |
| 3 | Qaytganlar soni kelganlardan ko'p bo'ladimi? | Yo'q — ular o'sha kelganlarning ichidan sanaladi |
| 4 | Qaytish nimadan ko'rinadi? | Ikki kunning yonma-yon turishidan; bitta kundan ko'rinmaydi |
| 5 | Birinchi kunning qaytgani nechta? | 0 — undan oldingi kun yo'q |
| 6 | E'lon qaysi sonni ko'taradi? | Kelganlar sonini — qaytganlar soni deyarli o'zgarmaydi |
| 7 | Duolingo'dagi 🔥 hisob nimani sanaydi? | Ketma-ket dars qilingan kunlarni |
| 8 | Bir kun dars qilinmasa, o'sha hisob nima bo'ladi? | Yana noldan boshlanadi; «muzlatish» esa bir kunni yopib turadi |
| 9 | Botingizning uch kunlik hisobida nima yoziladi? | Har kun uchun: kun, kelgan soni, qaytgan soni |
| 10 | 2-kunning qaytgan soni qayerdan olinadi? | 1-kuni kelganlardan 2-kuni yana kelganlarini sanaysiz |

> 🔴 **Korpus §20/§52📌:** 1-karta javobi s2 xulosa-kartasi, RECAPS va s15 yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **§132/§76:** birorta kartaning old-tomonida ham, javobida ham inglizcha nom yo'q — 10-karta hisobdagi sonning qayerdan chiqishini so'raydi (s8 va s10 da bajarilgan ish).
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ta'rif · ikki son · chegara · ko'rinish · birinchi kun · e'lon · keys ikki fakti · artefakt shakli · qaytgan sonining manbasi).
> 🔴 **Inglizcha atama 0** — «retention» dars matnida hech qayerda yozilmaydi: qaytishga ot-nom qo'yish M8-D1 ning ishi (29-qonun, 8-A taqiq-jadvali).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Qaytgan — ertasi kuni yana kelgan»** — (1) kanonik ta'rif so'zma-so'z · (2) kelganlar soni kim birinchi marta kelganini aytmaydi · (3) sinfga savol
**s5 · «Ikki son bir yo'nalishda yurmaydi»** — (1) har kunda ikki son bo'ladi: keldi va qaytdi · (2) e'lon kelganlar sonini ko'taradi, qaytganlar soni esa deyarli o'zgarmaydi · (3) savol
**s7 · «Kun — o'lchov birligi»** — (1) Duolingo hisobi ketma-ket kunlarni sanaydi · (2) bir kun tashlansa hisob yana noldan boshlanadi · (3) savol
**s11 · «Qaytish ikki kundan ko'rinadi»** — (1) qaytish kuni — chap yonidagi kun ham to'lgan kun · (2) qaytganlar kelganlardan oshmaydi · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **§133:** s5 RECAP bandlari s7 va s11 testlarining kaliti emas (T3 Duolingo hisobini, T4 esa hisob-qatorini so'raydi) ✓.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys — **K5 Duolingo**, faqat bank faktlari, o'ylab topilgan raqam/voqea 0 ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — m5-08 savol-elak · m5-02 kanal-funnel · m4c-06 signal-saralash · M4-D2 jadval-qatorini belgilash · **M5-D11 kun-belgilash (chap yonini tekshirish)** ✓
7. Sensirash — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): o'quvchining o'z Telegram-boti — s0 dan s15 gacha; keys (s6) — Duolingo, misol-olam emas ✓
- 95 (Toshkent o'smiri): o'zi qurgan bot, o'zi yig'gan odamlar ✓
- 96c: ip o'quvchining ARTEFAKTIDA (`pm-m5d8-javoblar` → `pm-m5d11-metrika`); to'qnashuv-grep shapkada ✓
- 23 (imzo-vizual yangi): «QAYTISH-KALENDARI» — `src/` da «kalendar/taqvim» 0 ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m5-08 VS Code → m5-11 kompilyator) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat M2–M4 materiali ✓
- 29 (kelajak-atama oqmaydi): «metrika», «retention», «DAU», «churn», «North Star», «foiz» o'quvchi matnida **0** ✓
- 33/56/100: keys 2 bashorat, ikki o'lchov; natija asl javobni aytadi; «ball emas» va hook-echo yo'q ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 101 (nishon inglizcha): 4/4 ✓
- 104/§119: hook ikki tanlovi teng (44 ↔ 43), payoff hech birini yolg'onga chiqarmaydi ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda 1 gap); bir dars — bitta ip; s8 ga «sabab» maydoni QO'SHILMADI ✓
- 5.8 (personaj yo'q): «Botjon» 0, vazifani Mentor beradi ✓
- 92d: majburiy maydonlar faqat o'quvchida bor ma'lumot uchun (uch kunning sonlari); bot nomi, havolasi, odam ismlari HECH QAYERDA so'ralmaydi ✓
- 88: navbat-to'lqini — s4 «Keyingi kun» ×3 → e'lon; s9 qatorlar ketma-ket; testda javobgacha yo'q ✓
- 89: koding takrorlash-yo'li erkin rejimda ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN §99–§134 o'qildi):**
1. **§20/§80/§85:** «qaytish» yagona nom, kanonik ta'rif 4 yuzada so'zma-so'z; «retention» o'quvchi ekranida 0 ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 «… odam» · T2 fe'l-gap · T3 «… qilishi» · T4 hisob-qatori) ✓
3. **§100:** nishon-nomlarida texnik omonim yo'q («Pattern Finder» RAD etildi) ✓
4. **§101:** keys-faktlari bankdan; slaydlar bir-birini yolg'onga chiqarmaydi (slayd-3 istisno beradi, qoidani bekor qilmaydi) ✓
5. **§102:** distraktorlar ekranda rost bo'lib qolmaydi — T1-A/T2-B/T2-C/T4-A darsning boshqa ekrani ochiq rad etadi ✓
6. **§103:** qoida fe'l bilan («yana kelsa — qaytgan hisoblanadi»), «-lik» yasama oti 0 ✓
7. **§104:** bosh atama to'liq ta'rif-gapda tug'iladi (s2 xulosa-kartasi), kesik qurilma yo'q ✓
8. **§105/§121:** «qayt-» ildizi faqat bitta ma'noda; «kir-» odam haqida umuman ishlatilmaydi; «hisob» — faqat ikki sonli yozuv va Duolingo 🔥 hisobi (ikkalasi ham «sanaladigan son», bir ma'no) ✓
9. **§106/§129:** T1 vaziyat-qo'llash · T2 yangi son + yangi odam · T3 ikki slaydni qo'shib qo'llash · T4 ish-takrori — hech biri xulosa-ko'chirma emas ✓
10. **§107:** T1–T4 da ha/yo'q savol yo'q; arena Q4 da 2/2 ✓; s9 to'rt qatorida 3 «qaytgan» / 1 «qaytmagan» — shakl-telli yo'q ✓
11. **§108:** hech bir savol rostni rad ettirmaydi ✓
12. **§109:** bosh ta'rif zamon-iborasi bilan («ertasi kuni») ✓
13. **§110:** mutlaq so'z bir variantdan oshmaydi (T2-B «deyarli hammasi»); kulgili-bo'sh variant yo'q ✓
14. **§111:** «degan javob» 0 ✓
15. **§112:** yangi nom o'tgan dars nomi bilan tenglashtirilmaydi — bu darsda o'tgan darsdan kelgan atama yo'q; **§134 3-bandi bo'yicha tekshirildi:** taqiq-so'z (`retention`) ko'prik uchun ham ishlatilmadi ✓
16. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi e'lon bosilgach; s9 Shohrux qatori) ✓
17. **§114:** arena-dekor so'zlari shu dars lug'atidan; M8-D1 tokenlari (`DAU`, `%`, `retention`, `churn`) fonga chiqmaydi ✓
18. **§115:** ipuchalar bir gap-turida («Nechta odam?» · «Ulardan nechtasi?»); uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?») ✓
19. **§116:** s9 YORDAM-savoli («chap yonidagi kun ham yashilmi?») to'rt qatorning to'rtalasida ham to'g'ri javobga olib boradi ✓
20. **§117:** metafora yo'q; yo'nalish-fe'llari real yo'nalishga mos («e'lon odam olib keladi», «odam qaytadi») ✓
21. **§118:** distraktorlarda cheklov-so'zi umuman yo'q — birorta variant «faqat»/«hech qachon» hisobiga yolg'on bo'lib turmaydi ✓
22. **§119:** hook payoffi hech bir tanlovni yolg'onga chiqarmaydi (u boshqa son haqida) ✓
23. **§120:** s9 har qatorida beshta kun holati to'liq ko'rinadi; Shohrux qatori yon-mantiqni materialning o'zida yiqitadi ✓
24. **§122/§124:** keys raqamsiz — raqam ta'rifga zo'rlash imkoni yo'q; inkor chegaralangan («undan kattasi ham, kichigi ham emas» — bank aytgan narsa haqida) ✓
25. **§123:** s1 demo darsning o'z qoidasiga bo'ysunadi (sonsiz, ko'chirib bo'lmaydi); bashorat-chipida izohsiz atama yo'q; jonli son-hisoblagichi yo'q (bank raqamsiz) ✓
26. **§125:** s1 natijani NOMLAYDI, ko'rsatmaydi (`?` kataklar); hook-savoli o'quvchining o'z tilida; YORDAM mashq tartibiga bo'ysunadi; uy-vazifa kuzatiladigan hodisani aytadi ✓
27. **§126:** bosh atama s1 da yo'q — s2 da tug'iladi; karta-sarlavhalari ham atamasiz («Bugun kelganlar» · «Ertasiga yana kelganlar» — §131 1-bandi) ✓
28. **§127:** har scored-savolda dars atamasi yo hech bir variantda yo'q (T1 · T2 · T3), yo ≥2 variantda (T4 «qaytdi» ×3; arena Q11 «qaytish» ×2) ✓
29. **§128:** shart-yorliqlari darak gapda («Har kunda ikki son bor» · «Qaytganlar kelganlardan oshmaydi»); s1 namunasi sonsiz — s8 shartidan o'tishi ham, ko'chirilishi ham talab qilinmaydi ✓
30. **§130:** hisoblagich yorlig'i o'z-o'zini tushuntiradi («👥 Keldi» · «↩️ Qaytdi», bo'sh holat «—»); ✅-qatori faqat o'quvchi yozgan sonni qaytaradi; checklist mezoni MA'NOni so'raydi ✓
31. **§131:** atama karta-sarlavhasida gloss'dan oldin chiqmaydi; yig'iladigan natija har kunda sanalib boradi ✓
32. **§132:** artefakt-nomi omonimi yo'q; «yo… yo…» juft bog'lovchi yo'q; darvoza-varianti sarlavha so'zini takrorlamaydi; keys 1-slaydi javobni oldindan aytmaydi; flashcard-10 na inglizcha nomni so'raydi, na javobda inglizcha juftlik beradi ✓
33. **§133:** test variantlari bir tinish-shaklda (T4 uchalasi bir qolipda); s4 xulosa-bandi T2 kalitiga aylanmagan; ikki ma'noli fe'l yo'q; nishon-tavsiflari faqat real tekshirilgan ishni aytadi (s9 → «belgiladingiz») ✓
34. **§134:** birorta distraktor rang-holatiga tayanmaydi; test kalitida savolning soni «yolg'iz» qaytmaydi (T1 va T4 da sonlar UCHALA variantda ham bor) ✓
35. **§36/§95:** s4 dagi har son ekranda belgilar bilan sanab ko'riladi; o'ylab topilgan statistika sifatida bir joyda ham «odatda shunday bo'ladi» deyilmaydi ✓
36. **§40:** «botingiz» — o'quvchida bor; «hisobingiz» faqat s8 dan keyin; «kalendaringiz» 0 ✓
37. **§97:** «ko'pchilik / sinf / ovozlar» o'quvchi matnida 0 ✓
38. **§69:** «topilmadi / saqlanmagan / bo'sh» 0 — jim zaxira ✓
39. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo qator (s1) · 2 karta (s2) · 5 kun + 2 son + 1 e'lon (s4) · 4 slayd + 2 bashorat (s6) · 3 kun (s8/s12/uy-vazifa) · 4 qator × 5 kun (s9) · 3 shart (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
40. **Ekran-prozalari** (metodist qayta o'lchadi — Intl.Segmenter): s0 393 (savol + ikki tanlov + payoff) · s1 130 · s2 283 · s4 364 · s6 slayd-1 171 · slayd-2 170 · slayd-3 153 · slayd-4 165 · ko'prik 182 · s8 113/108 · s9 183 · s10 115 · s12 180 · uy-vazifa 181 grapheme (chegara 400) ✓ · variant-telllari T1 1.07 · T2 1.26 · T3 1.18 · T4 1.03 · bashorat 1.06/1.04 · arena Q4 1.11 · Q11 1.10 · hook 1.02 ✓

**Lint natijasi (metodist-korrekturasidan keyin):** `node til-lint.mjs pm-senariylar/M5-D11-Qaytish.md` — **0 error**; qolgan 4 warn
faqat senariy-annotatsiyasida: (a) taqiq-so'zning O'ZI shapkada va gloss-bo'limida nomlangan
(2 marta) — uni yozmasdan taqiqni hujjatlab bo'lmaydi, o'quvchi matnida bu so'z **0**;
(b) `PM_Prompt_v8` ning majburiy 3-blok sarlavhasi va ekran-jadvalidagi o'sha ichki nom
(2 marta) — M4c-D6 pretsedenti, ekranga chiqmaydi. `node prompt-lint.mjs` — toza
(aralash-yozuv so'z topilmadi).

---

## 13-A. 🎓 METODIST-KORREKTURA (pm-metodist · 2026-08-18 · senariy-korrektura rejimi)

> `MATN_KORPUS.md` §99–§134, `MATN_ETALONI.md` LUG'AT, `PM_Prompt_v8.md`, `PM_DARS_ETALON.md` va
> ikki pretsedent (M4c-D6 · M4a-D2) o'qib chiqildi. Quyida **matnga kirgan** tuzatishlar (oldin → keyin).

### (A) Sanoq-halolligi — nisbat-jargoni va soxta hisob (2-tekshiruv nuqtasi)
- ❌ s4 yakun-kartasi: «kelganlar soni **to'rt barobardan ko'proq oshdi**» → ✅ «**kecha 6 odam kelgan edi**».
  Ikki sabab: (a) 6 → 23 «to'rt barobar» EMAS (6×4 = 24) — ekrandagi belgilar bilan sanaganda gap yolg'on
  chiqadi (§36/§95); (b) «barobar» — nisbat-jargoni, dars esa foizni ham, nisbatni ham taqiqlab tirik sanoqqa
  tayanadi. Endi ikkala son ham ustunda sanab ko'riladi.
- ❌ «…uni ertaga qaytarish boshqa ish, va uni **e'lon qilib bo'lmaydi**» (ikki ma'no: «e'lon berib bo'lmaydi»
  ↔ «e'lon uddasidan chiqmaydi») → ✅ «Yangi odam olib kelish **e'lonning qo'lidan keladi**, odamni ertaga
  qaytarish esa **qo'lidan kelmaydi**» (§133 ikki ma'noli fe'l · §43 belgi-formulasiz to'liq gap).
- ❌ s2 sarlavhasi «Bugun kelgan **10 odam** — ertaga ham o'shalarmi?» → ✅ «Bugun kelgan **odamlar** ertaga ham
  o'shalarmi?» — ekranda 10 raqamining manbasi yo'q edi (§36: demo-raqam ham manbasiz bo'lmaydi).
- ❌ s15/RECAP/flashcard: «qaytganlar sonini **o'zi ko'tarmaydi**» → ✅ «qaytganlar soni esa **deyarli
  o'zgarmaydi**» — s4 da qaytganlar 4 dan 5 ga chiqadi, ya'ni eski qoida ekranga zid edi (§113/§94).
  Kaskad: s15 3-qatori · RECAPS s5 · flashcard-6 · TEST-2 reveal birga o'tdi.

### (B) Rang, egalik va ichki nom — o'quvchi ko'radigan matn
- 🔴 **§134:** s4 kalendarida yashil belgi «kecha ham kelgan» degani hech qayerda aytilmagan edi → kalendar
  ostiga **rang-legendasi** qo'shildi: «🟩 kecha ham kelgan · ⬜ birinchi marta kelgan». Legendasiz bola
  belgilarni sanab ikki sonni tekshira olmasdi (§95 buziladi).
- ❌ s9 yo'riqnomasi «**Botingizning** bir haftasi: to'rt odam…» → ✅ «**Mana bir haftalik ro'yxat:** to'rt
  odam…» — Aziz/Dilnoza/Shohrux/Malika o'quvchining odamlari emas, sahnaning materiali (§40 · 92d).
- ❌ s9 ko'rsatmasi «**Kecha ham kelgan kunni** bosing» (ot-birikma, ikki marta o'qiladi) → ✅ «**Odam kecha
  ham kelgan bo'lsa — o'sha kunni bosing:** bu qaytish kuni» (ETALON 43: konkret, subyektli ko'rsatma).
- ❌ s10 mentori «**Kalendarda** va qatorlarda qo'lda sanagan ishni…» → ✅ «**Siz qo'lda sanagan** ishni endi
  kod bajaradi» — «kalendar» senariy-ichi nom, 2-bo'limning o'z qoidasi bo'yicha ekranga chiqmaydi (§84).
- ❌ koding YORDAMI va starter-izohi: «Birinchi kunning **kechasi** yo'q» (kechasi = tunda) → ✅ «Birinchi
  **kundan oldin kun** yo'q» (§117 omonim) — uch joyda birga.

### (C) Fe'l va TMI mikro-tahrirlari
- ❌ «qaysi **kun** eng ko'p **odamni qaytardi**?» (jonsizga odam-fe'li, §28) → ✅ «qaysi **kuni** eng ko'p
  **odam qaytdi**?» — YULDUZCHA va SOFT birga.
- ❌ s4 1-kun fakt-qatori «…bu kunning yana kelgani ham yo'q» → ✅ «…shuning uchun **1-kunning qaytgani** ham yo'q».
- ❌ saqlash-xabari «Bu katakka son yoziladi. **Nechta odam — shuni yozing.**» → ✅ «…: **nechta odam kelgan
  bo'lsa, shuni yozing**» (korpus §12: nima noto'g'ri + qanday tuzatish, tugal gapda).
- ❌ hook payoffi «**«kecha kelgan odam bugun ham keldi» degani** — butunlay boshqa son» (gap — son emas) →
  ✅ «**«kechagi odamlardan bugun nechtasi yana keldi»** — bu butunlay boshqa son» + gap qisqartirildi
  (ekran 416 → **393** grapheme, ikki tanlov bilan birga).
- ❌ slayd-4 «o'lchov birligi — kun, **undan kattasi ham, kichigi ham emas**» → ✅ «**soat bilan ham, hafta
  bilan ham sanamaydi**» (konkret o'lchov, §124 chegarasi buzilmaydi).
- ❌ s12 mukofoti «**ular** ertasiga qaytganini» → ✅ «**ulardan nechtasi** ertasiga qaytganini».
- s2 ikki kartasi va MENTORGA gapi qisqartirildi (TMI · 109-qonun).

### (D) Nishon va flashcard — faqat REAL bajarilgan ish (§133)
- ❌ «Day Two! — Ikkinchi kun sonini o'zingiz **topdingiz**» (son kun ochilganda o'zi chiqadi, bola topmaydi) →
  ✅ «**Kunlarni ochib ikki sonni yonma-yon ko'rdingiz**» (46 belgi).
- ❌ flashcard-10 «Odamlarning qaytishini muntazam sanab borish nima deyiladi? → Qaytishni o'lchash
  (inglizchasi — **retention**)» → ✅ «**2-kunning qaytgan soni qayerdan olinadi?** → 1-kuni kelganlardan
  2-kuni yana kelganlarini sanaysiz». Sabab: 29-qonun (kelajak-dars atamasi) senariyning o'z istisnosidan
  kuchli — nom qo'yish M8-D1 ning ishi. **GATE S 9-savoli** sifatida foydalanuvchiga qo'yildi.

### (E) Metodist hukmlari (tuzatilmadi — OQLANDI)
1. **«hisob» ikki joyda** (o'quvchining uch kunlik hisobi ↔ Duolingo'ning 🔥 hisobi) — §121 bo'yicha
   tekshirildi: ikkalasi ham «sanab boriladigan son», ko'prik-gap ularni ochiq bog'laydi («Duolingo buni
   kunlar hisobi bilan sanaydi — siz uni ikki kunni yonma-yon qo'yib sanaysiz»). Ildiz bir ma'noda ✓.
2. **Foiz/nisbat taqiqi** — butun fayl grep qilindi: «foiz», «%», «yuz odamdan», «ko'rsatkich» o'quvchi
   matnida **0** (faqat taqiq-jadvali va farq-dalilida nomlangan). (A) bandidagi «barobar» — yagona
   qoldiq edi, olib tashlandi ✓.
3. **§133 (oldingi ekran xulosasi keyingi test kaliti):** T1 ← s2, T2 ← s4, T3 ← s6, T4 ← s8 birma-bir
   solishtirildi — birortasida kalit xulosa-gapdan so'zma-so'z olinmagan; T2 boshqa son (40) va boshqa
   odam (do'st) bilan yuradi ✓.
4. **§122:** K5 bankida raqam yo'q — keys-raqamini ta'rifga kiygizish imkoni yo'q ✓.
5. **Yakun ipini yopish:** kelajak-darsga havola qiladigan va'da-iboralari — **0** (grep). s15 to'rt qatori
   ham, uy-vazifa ham darsning o'z ishida qoladi ✓ (73-qonun).

## 14. [GATE S] — FOYDALANUVCHIGA SAVOLLAR

1. 🔴 **K5 burchak-registri.** M8-D1 (`PmMetricsLesson`) K5 ni **usul** burchagidan olgan (ketma-ket kunlar hisobi odamni qanday qaytaradi: qo'rquv → odat → muzlatish). M5-D11 uni **sanoq birligi** burchagidan oladi (hisob nimani sanaydi va nega aynan kun). Bashoratlar ham kesishmaydi. **Shu ikki burchak ajratmasi tasdiqlanadimi?**
2. 🔴 **«foiz» taqiqi.** M8-D1 retention'ni **foizda** o'rgatadi va koding'ida foiz hisoblaydi. M5-D11 da foiz, `%` va «yuz odamdan nechtasi» **umuman yo'q** — sanoq tirik («9 odam keldi, 4 tasi qaytdi»). Bu ikki darsni ochiq ajratadi va 13 yoshli uchun yengilroq. **Tasdiqlanadimi?**
3. 🔴 **Bashorat soni.** Pasport va ETALON 33 «≥2 bashorat, ikki o'lchovda» deydi; 109-qonun ov-ro'yxatida «keys slaydida taxmin maks 1» bandi bor. Batch 2/3 (M4a-D2, M4-D12, M4c-D6) **2 bashorat** bilan yopilgan — shu pretsedent olindi. **Tasdiqlanadimi?**
4. 🔴 **s4 sahna-raqamlari.** Kalendarda 9 · 7 · 6 · 23 · 8 (kelganlar) va — · 4 · 4 · 4 · 5 (qaytganlar) turadi. Bular **statistika sifatida aytilmaydi**, har biri ekranda belgilar bilan sanaladi (§36/§95) va «botlarda odatda shunday» degan gap yo'q. **Demo-simulyatsiya sifatida tasdiqlanadimi?**
5. 🔴 **Chiqish-artefakt M5 ni yopadi.** `pm-m5d11-metrika` dan keyingi PM darsi — m6-02 (modul-ochilishi, kirishsiz). Ammo **m5-13 Demo Day** (dars qurilmaydi, `App.jsx` da `comp` yo'q) mavzusi «jonli bot + 20 foydalanuvchi + metrika». Shu uch kunlik hisob Demo Day nutqida **namuna-qiymat** sifatida ishlatilsinmi (qurilmaydi, faqat tavsiya)?
6. 🔴 **Kirish-artefakt shakli.** `pm-m5d8-javoblar = { javoblar: [{ savol, eshitgan } × 3], savedAt }` — bosh-agent muhri; m5-08 senariysi parallel yozilmoqda. **Ikki tomonlama shart-tekshiruvi (F-0803-22-B) GATE S da yopilsinmi?**
7. 🔴 **Kod-nomlari ↔ artefakt kaliti.** Kodda `kunlar` · `kelgan` · `qaytgan`, artefaktda ham AYNAN shu nomlar — o'quvchi kod natijasi va o'z hisobi bir tilda ekanini ko'radi. Hammasi ASCII, apostrofsiz. **Tasdiqlanadimi?**
8. 🔴 **«Botjon» uzilishi.** M5 texnik darslari (`BotIntroLesson` … `BotAiAgentLesson`) «Botjon» degan qahramon-lug'atida yuradi. PM darsi personaj-taqiqi (DARS_ETALON 5.8) bo'yicha uni **ishlatmaydi** — dars bo'ylab «botingiz». Bu o'quvchi uchun uzilish emasmi, yoki taqiq kuchliroqmi?

9. 🎓 **Flashcard-10 dagi `retention` OLIB TASHLANDI (metodist-qarori — tasdiq so'raladi).** Senariy taqiq-jadvalida `retention` 29-qonun bo'yicha taqiqlangan, keyin esa flashcard-10 javobida istisno sifatida qoldirilgan edi. Metodist hukmi: 29-qonun (kelajak-dars atamasi) §20 ning «inglizcha juftlik» ruxsatidan kuchli — M8-D1 aynan shu nomni qo'yadi, bu dars esa unga hodisani beradi. 10-karta darsning o'z ishiga almashtirildi: «2-kunning qaytgan soni qayerdan olinadi?» → «1-kuni kelganlardan 2-kuni yana kelganlarini sanaysiz». **Tasdiqlanadimi, yoki M4c-D6 dagi «inglizcha juftlik faqat flashcard-10 da» pretsedenti kuchliroqmi?**
10. 🎓 **s4 rang-legendasi (metodist qo'shdi — tuzilmaga tegadi).** Kalendarda yashil to'ldirilgan belgi «kecha ham kelgan» degani, lekin bu ma'no hech bir o'quvchi matnida aytilmagan edi — §134 bo'yicha bola belgilarni sanab sonni tekshira olmaydi. Kalendar ostiga ikki chip qo'shildi: «🟩 kecha ham kelgan · ⬜ birinchi marta kelgan» (+44 grapheme, ekran 364/400). **Tasdiqlanadimi?**

### `App.jsx` KARTA TAKLIFI (29-qonun — «?»li o'quvchi-savoli)

| Maydon | Hozir | Taklif |
|---|---|---|
| `title` | «Foydalanuvchi yig'ish + metrika» | **«Kecha kelgan odam bugun ham keldimi?»** |
| `sub` | «kuniga nechtasi kiradi, nechtasi qaytadi» | **«kelganlar va qaytganlar — ikki xil son»** |
| `emoji` | 📈 | 📈 (o'zgarmaydi) |

> 🔴 Hozirgi `title` — kattalar tili («metrika» — 8-A taqiq-so'zi, ustiga 29-qonun bo'yicha M8-D1 atamasi). Taklif qilingan sarlavha o'quvchining og'zidan chiqadigan savol va darsning yagona savolini aytadi. `sub` dagi «kiradi» ham «keladi» ga o'girildi (§121 ildiz-tozaligi). **Kartani faqat bosh-agent o'zgartiradi.**

---

## 15. QURUVCHIGA — QISQA ESLATMA

- `lessonId: 'pm-m5d11-v1'` · `SCREEN_META.length === screens.length === 16` · `QUIZ_BANK` 3/3/3/3 · `INLINE_KEYS` ↔ `correctIdx` mos.
- **Klon-residue-grep majburiy:** qolip qaysi darsdan olinsa ham, `DAU` · `retention` · `churn` · `North Star` · `streak` · `%` · `o'lchagich` · `signal` · `chegara` · `bo'lak` · `Botjon` so'zlari **hech qayerda** (canvas TOK · `QZ_BG_SHAPES` · `HW_TOKENS` · mentor matnlari · flashcard) qolmasin (§114).
- Kompilyator qobig'i: `zoom: 'calc(1 / var(--lz, 1))'` (`PmLesson15.jsx:1841` naqshi) · `previewUrl` YO'Q · shartlar xulq-atvorda.
- `ccProgress` naqshi majburiy (F-0730-01) · s4 va s9 holatlari o'z kalitlariga yoziladi.
- 🎓 **Metodist-korrekturasidan (13-A):** s4 kalendari ostida **rang-legendasi** ikki chip bilan turadi — «🟩 kecha ham kelgan · ⬜ birinchi marta kelgan» (§134: rang ma'nosi o'quvchi matnida o'rgatilmasa, belgilarni sanab tekshirib bo'lmaydi).
- 🎓 **s2 ikki kartasi akkordeon:** bittasi ochilganda ikkinchisi yopiladi. Ikkalasi birga ochiq tursa ekran matni 501 grapheme bo'ladi (chegara 400) — toggle-mantiqning o'zi buni hal qiladi.
