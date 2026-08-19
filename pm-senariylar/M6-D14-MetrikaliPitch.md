# M6-D14 — Raqamingiz nimani isbotlaydi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl (kelajakda): `src/6-Modull/PmLesson25.jsx` (hozirgi `-v16` avlod BUTUNLAY almashadi;
> yangi `lessonId: pm-m6d14-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.
> 🔴 Bu dars **6-Modulni va Demo Day 3 ni YOPADI** — dasturdagi **beshinchi** pitch darsi.
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` «🔒 BATCH 5» ikki bo'limi — o'zgartirilmagan.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 6 — «To'liq tizim va AI» |
| **Dars** | M6-D14 (modulning 14-darsi, oxirgi PM darsi) · `key: m6-14` |
| **Mavzu** | Sahnaga chiqadigan bitta slayd: qaysi raqam isbot beradi, qaysi raqam shovqin |
| **TUR** | 🔴 **2-TUR (sof PM)** — artefakt = matn (slaydning uch qatori). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | **K12 ♻️ · AIRBNB PITCH DECK** — 🔴 **BESHINCHI burchak: raqamli qadam.** Bankdagi besh qadamli tartibda («qiyinchilik → yechim → yechimni qancha odam kutayotgani → mahsulot → jamoa») raqam bilan gapiradigan qadam **bittagina** va u **o'rtada** turadi. Band burchaklar TAKRORLANMAYDI: M1-D12 tuzilish · M2-D13 tinglovchi · M3-D14 tartib va jamoa · M4-D15 «besh qadamda texnika yo'q». 🔴 **RAQAM-CHEGARASI:** K12 bankda «raqamsiz» belgisi bilan turadi — Airbnb varag'idagi raqamning O'ZI (nechaligi) **hech qayerda aytilmaydi**; dars faqat o'sha qadam BORLIGI va u NIMANI ko'rsatgani haqida gapiradi (10-qonun · §101 · §122) |
| **ISHLATILGAN_KEYS (modul-ichi)** | M6 da band: K7 (m6-02) · zaxira ilgak (m6-06) · K17 (m6-12) → **K12 M6 da birinchi marta** ✓ (registr 4-bo'lim: modul-ichi qoidasi) |
| **Oldingi PM dars (m6-12) TEKSHIRUV mexanikasi** | **ufq-joylash** (registr R2 Batch 5; senariy parallel yozilmoqda) — takrorlanmaydi ✓ |
| **Band mexanikalar (TAQIQ — registr 5-bo'lim TO'LIQ)** | story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli foyda-vaqt doskasi · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «YUK-SINOVI» · «RELIZ-TASMASI» · «SIFAT-TAROZI» · «O'LCHAGICH-PANELI» · «BIRINCHI 20» · «INTERVYU-STOLI» · «QAYTISH-KALENDARI» · Hotspot · Timeline · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · signal-saralash · nosozlik-navbati · savol-elak · joy-quvuri · kun-belgilash · haftaga-sig'dirish darvozasi · yuk-tartiblash · sxema-shart tekshiruvi · katak-tekshiruv · oqibat-juftlash · ufq-joylash |
| **🔴 PITCH-OILASI (alohida taqiq, TO'LIQ)** | tushunish chizig'i · so'z-elagi · tinglovchi-javobi kartalari · uch qatlam o'xshatishi · **tinglovchi kursisi** (M2-D13) · sahna-taymeri · **MicRecorder ovoz-yozuv** (M1-D14) · texnik↔odamcha juftlik-tanlovi · demo 3 qadam-akkordeoni · **ota-ona savollari** · repetitsiya kabinasi (M1-D14) · 30s juftlik-sekundomeri (M1-D12) · **«GAPSIZ KO'RSATUV» 4 kadrli tasma** (M3-D14) · **«UCH QAVAT KESIMI»** va **«QAROR-SABAB TANLOVI»** (M4-D15) |
| **Misol-ip (91/108 + 95 + 96 + 96c)** | 🎤 **DEMO DAY SAHNASI va o'quvchining O'Z to'liq tizimi.** Sahnadagi slayd — ariza qabul qiladigan tizim haqida (o'quvchi m6-08 da aynan shunday yo'l qurgan: ariza kelib, javob qaytadi). 95-qonun: o'quvchi Demo Day'ga o'zi chiqadi, sahnani ikki marta ko'rgan (M1-D14, M3-D14) ✓ · 96c(e) to'qnashuv: **yangi mahsulot-olam kiritilmadi** — lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · 🏀 maydoncha · musiqa ilovasi · maktab jurnali · kutubxona · 🅿️ AvtoStoyanka · skuter-ijara · sinfdosh-loyiha poygasi · Netlify sayti · o'quvchining Telegram-boti — **birortasi ishlatilmadi** ✓ |
| **Kirish-artefakt** | `pm-m6d12-yol` = `{ ufqlar: [ { ufq, ish } × 3 ], savedAt }` — 🔴 **jim zaxira**: s8 tepasida `ufq === 'hozir'` qatoridagi `ish` bitta qatorda ko'rinadi. «BOR» va «YO'Q» tarmoqlari **bir xil shaklda** yoziladi, «topilmadi / saqlanmagan / bo'sh» so'zlari **0** (korpus §69) |
| **Chiqish-artefakt** | 🔴 `pm-m6d14-pitch` = `{ slayd: { raqam, nima, isbot }, savedAt }` — registr muhri, o'zgartirilmagan. **M6 ni va Demo Day 3 ni yopadi** |
| **Yordamchi kalitlar** | `pm-m6d14-hook-choice` (faqat YOZILADI — 100c) · `pm-m6d14-slayd` (s4 holati) · `pm-m6d14-juft` (s9 holati) · `pm-m6d14-code` · `pm-m6d14-reflection` · `pm-m6d14-hw-target` · `ccProgress` |
| **Koding** | 🖥 **KOMPILYATOR** — R1 navbati (m6-12 VS Code → **m6-14 kompilyator**). Sof JS · `previewUrl` YO'Q · qobiq `zoom: 'calc(1 / var(--lz, 1))'` bekori bilan tug'iladi (etalon `PmLesson15`/`PmLesson17`) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D10 dan beri tasdiqlangan yakun-tuzilmasi bilan bir xil |

### Atama-glosslar (62/39-qonun + korpus §20/§104/§126 — avval hodisa, keyin nom)

- 🔴 **«METRIKA» SO'ZI O'QUVCHI EKRANIDA YO'Q.** U — M8-D1 (`PmMetricsLesson`) ning bosh atamasi;
  29-qonun bo'yicha kelajak-dars atamasi joriy darsga oqmaydi. Shu bilan birga **«retention»,
  «DAU», «konversiya», «voronka», «foiz», «o'rtacha chek»** ham ishlatilmaydi. Darsning yagona
  so'zi — **«raqam»**. «Metrikali pitch» — dars-kartaning eski nomi; 14-bo'lim 1-bandiga qarang;
- 🔴 **«isbot» — darsning bosh atamasi**, s2 da tug'iladi (maqsad-ekranda YO'Q — §126). Kanonik
  ta'rif dars bo'ylab AYNAN bir xil: **«Tizim odam uchun nima qilganini sanab turgan raqam —
  isbot»** (§109: zamon-iborasi, yasama ot emas). Shu ta'rif s2 xulosasi · flashcard-1 · RECAPS ·
  s15 ro'yxatida so'zma-so'z takrorlanadi;
- 🔴 **«shovqin» — juft atama**, o'sha ekranda tug'iladi: **«Faqat siz qancha ishlaganingizni
  sanaydigan raqam — shovqin»**. Ohang ayblovsiz: mehnat yomon emas, u sahnada boshqa ishni
  bajaradi. Ekranda hech qachon «yomon raqam», «keraksiz raqam» deyilmaydi;
- 🔴 **Fe'l-intizomi (korpus §80 — bir mashq, bir fe'l):** raqam **sanaydi** · raqam
  **ko'rsatadi** · slayd va undagi raqam **gapiradi** · tizim odam uchun ish **bajarib beradi** · odam tizimni
  **ochadi**. ❌ «o'lchaydi», «hisoblab chiqadi», «tahlil qiladi» — ishlatilmaydi;
- 🔴 **Slaydning uch qatori butun darsda bitta nom bilan:** **① raqam · ② nimani sanadi ·
  ③ nimani ko'rsatadi.** Shu uchlik s1 demo · s4 · s8 yozuv-kartasi · flashcard · yakun-ro'yxatida
  bir xil so'z bilan yuradi. Artefakt kalitlari (`raqam` · `nima` · `isbot`) — kod tomonda,
  ekranda uchinchi qator har doim «nimani ko'rsatadi» deb yorliqlanadi;
- 🔴 **«qaytgan odam» hodisasi bu darsda O'RGATILMAYDI** — u m5-11 niki (29-qonun qo'shni
  yo'nalishi). s4/s9 raqamlari qaytishni sanamaydi: ochish · telefondan ochish · arizaga javob;
- ❌ **«pitch» o'quvchi matnida faqat bir marta — flashcard-10 javobida** («Pitch — sahnada
  mahsulotni qisqa tanishtirish»). Dars bo'ylab **«sahnadagi qisqa taqdimot»** yoki shunchaki «slayd»;
- ❌ **«dashboard», «grafik», «diagramma», «statistika», «analitika»** — kalka/kelajak-atama:
  **«raqam»**, «raqamlar qatori»;
- ❌ **«KPI», «maqsad-raqami», «o'sish sur'ati»** — kattalar lug'ati, ishlatilmaydi;
- ❌ **«slayd tuzilishi», «uch qavat», «qaror-sabab»** — M1-D12 / M4-D15 burchaklari; bu dars
  ularga qaytmaydi.

🔴 **§40 darvozasi (o'quvchida hali YO'Q narsa uniki qilib aytilmaydi).** Dars boshida o'quvchida
**BOR:** ishlaydigan to'liq tizim (m6-01 · m6-08: sayt + server + baza + AI + bot, ariza
uchidan-uchiga o'tadi), **telefonda ochiladigan mobil ko'rinish** (m6-09…11), **loyiha kuni**da
yig'ilgan ish (m6-13) va **uch ufqli yo'l** (m6-12 artefakti). **YO'Q:** tashqi foydalanuvchilar
va ular haqidagi tayyor raqamlar. Shuning uchun: **s4 va s9 dagi raqamlar sahnadagi slaydniki**
(«tizim» deb ataladi, «tizimingiz» EMAS); **s8 da esa o'quvchi O'ZI sanay oladigan raqamni**
yozadi va YORDAM ikki yo'lni ham beradi: kimdir sinab ko'rgan bo'lsa — o'sha odamlar soni; hali
sinamagan bo'lsa — tizim bajarib bergan ishlar soni. 🔴 **«Yo'q raqamni o'ylab topmaysiz — bor
raqamni gapirtirasiz»** darsning ochiq qoidasi (s8 va s15).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «METRIKA-SLAYDI»** (registr muhri) — 🔴 **ekranda bu nom ko'rinmaydi**
(14-bo'lim 2-bandi: muhrni «GAPIRADIGAN SLAYD» ga o'zgartirish taklifi). 23-qonun: registr
5-bo'limidagi birorta band vizual klonlanmaydi.

Ekran ikkiga bo'linadi. **O'ngda** — sahna ekrani: katta oq slayd, ustida uch qator o'rni
(birinchisida katta raqam, ostida ikki bo'sh qator). **Chapda** — uchta qator-tugmasi va ularning
ostida bitta **«Slayd nima aytdi?»** javob-qatori.

**1-bosqich — qatorlarni ochish.** O'quvchi qatorlarni birma-bir ochadi; har ochilishda slayd
o'zgaradi va javob-qatori yangilanadi:

| Qadam | Slaydda ko'rinadi | «Slayd nima aytdi?» |
|---|---|---|
| ① raqam | **41** | 🤔 Slayd bitta narsa aytdi: 41. Nimaning 41 tasi ekani noma'lum |
| ② nimani sanadi | 41 · odam tizimni ochdi | 🤔 Endi ma'lum: 41 odam ochgan. Bu tizim haqida nima ko'rsatishi hali aytilmagan |
| ③ nimani ko'rsatadi | 41 · odam tizimni ochdi · demak odamlar tizimni ochib ko'rgan | ✅ Slayd to'liq gapirdi: raqam, nimani sanagani va nimani ko'rsatgani |

**2-bosqich — kuchliroq raqam** (uchinchi qator ochilgach chiqadi — 94-qonun progressiv
ochilish): slayd tozalanadi va yonma-yon ikki raqam keladi, ikkalasi ham odamning ishini sanaydi:

| Raqam | Nimani sanadi |
|---|---|
| **9** | odam tizimni telefondan ochdi |
| **12** | odam arizasiga javob oldi |

Savol-kartasi: *«Ikkalasi ham odam bilan bog'liq. Sahnada bitta joy bor — qaysi biri tizim
ishlaganini ko'proq ko'rsatadi?»*

- **12 tanlansa:** «✅ Ariza javob olgan — demak tizim ishni oxirigacha bajarib bergan.»
- **9 tanlansa:** «Ochish — ishning boshlanishi. Oxirigacha bajarilgan ishni 12 ko'rsatadi.»
  (56-qonun: ball yo'q, qizil baho yo'q, asl javob DOIM ochiladi; qayta tanlash ochiq.)

Yakun-qatori (bitta gap): **«✅ Buni o'zingiz ko'rdingiz: raqam uch qator bilan gapiradi, va
kuchli raqam ish oxirigacha bajarilganini ko'rsatadi.»**

🔴 **Rang-qonuni (palitra-pasporti):** to'lmagan qator — xira-punktir `line`; to'lgan qator —
`accent`; javob-qatoridagi 🤔 — neytral `accentSoft` (**xato EMAS**, shuning uchun `err` rangi
ishlatilmaydi); ✅ — `success`. 2-bosqichdagi «9» tanlovi ham qizil emas: u rost raqam, faqat
kuchsizroq isbot. 🔴 **Rang-legendasi (§134/§135-C):** ranglar hech qanday yashirin ma'no
tashimaydi — har holat yonida so'z bilan yozilgan qator turadi, ya'ni rangni «o'qish» talab
qilinmaydi.

🔴 **Nima uchun aynan shu:** raqamni **o'qib** tushunib bo'lmaydi — u **yolg'iz qolganda**
jimligini ko'rgan bola boshqa qaramaydi. Bu yerda o'quvchi qatorni O'ZI ochadi va slaydning
har qadamda nima aytayotganini o'qiydi; keyin ikki rost raqamdan kuchlirog'ini tanlaydi. Bu —
darsning butun qarori («sahnaga qaysi raqam chiqadi») qo'lda o'ynaladigan shakli.

🔴 **Mexanika-farqi (26/59-qonun · pitch-oilasi bilan yonma-yon):**

| Dars | U yerda nima qilingan | Bu darsdan farqi |
|---|---|---|
| **M1-D14** `PmLesson3` (Demo Day 1) | 3 daqiqalik **nutqni mashq qilish**: mikrofon-yozuv, repetitsiya kabinasi, muammo-qidiruv | Bu yerda ovoz ham, taymer ham, yozib olish ham YO'Q — **bitta slaydning matni** yoziladi |
| **M2-D13** `PmLesson6` | **Tinglovchi** burchagi: kursi, tinglovchi-javobi kartalari, so'z-elagi, texnik↔odamcha almashtirish | Bu yerda tinglovchi umuman modellashtirilmaydi — hukmni **slaydning o'zi** beradi («slayd nima aytdi») |
| **M3-D14** `PmLesson10` (Demo Day 2) | **Ko'rsatuv tartibi**: gapsiz 4 kadrli tasma, Hotspot bilan bosiladigan joy | Bu yerda kadr ham, tartib ham yo'q — **bitta ekran, uch qator** |
| **M4-D15** `PmLesson14` | **Arxitekturani odam tiliga o'girish**: uch qavat kesimi, qaror↔sabab juftlash | Bu yerda texnika umuman gapirilmaydi — obyekt **raqam**, mezon «kimning ishini sanaydi» |

🔴 **Bu darsning o'ziga xosligi bitta gapda: RAQAM GAPIRADI.** Nutq mashqi emas, ko'rsatuv
tartibi emas, arxitektura tushuntirish emas — sahnaga chiqadigan bitta raqamning uch qatori.

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 40–45 soniya harakatsizlikdan keyin bitta
qoida-ipuchasi: «Keyingi qatorni oching — slayd yana nima aytishini ko'ring» — javobni
AYTMAYDIGAN shaklda (korpus §77).

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D10 dan beri o'zgarmagan etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Sahnada bitta katta raqam: 41. Shu slayd nima qiladi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — slaydning uch qatori o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — men qilgan ish ↔ tizim odam uchun qilgan ish | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **GAPIRADIGAN SLAYD** (uch qator + kuchliroq raqam) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K12 beshinchi burchak (4 slayd + 2 bashorat + hisoblagich) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **slaydning uch qatori** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **IKKI RAQAM — BIR JOY** | 5 | — | 🔴 juftlik-tanlovi (yangi mexanika) |
| s10 | KODING — isbot beradigan raqamlarni ajratadigan kod | 6 | — | 26/82/87-qonun · kompilyator |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Metrika-slaydi», «imzo-vizual», «artefakt», «bashorat» — senariy-ichi nomlar**, o'quvchi
ekranida YO'Q (14-qonun). Ekranda: «slayd», «qator», «raqam», «tanlov».

🔴 **47-qonun:** interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>`
shu to'rt ekranda **0**; teoriya va refleksiya ekranlarida (s0 · s2 · s12) sarlavha —
savol-murojaat.

🔴 **Ekran-ritmi (109-qonun · TMI):** har mashq-ekranida bir vaqtda ko'rinadigan matn-blok ≤2
(sarlavha + mentor-gap), qolgan hamma narsa harakatdan KEYIN chiqadi.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 6 — To'liq tizim va AI
DARS: M6-D14 (14-dars)
DARS_MAVZUSI: Sahnaga chiqadigan bitta slayd — qaysi raqam isbot beradi
ISHLATILGAN_KEYS: K12
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Demo Day. Sahnadagi katta ekranda bitta slayd turibdi, unda bitta katta
raqam yozilgan: 41. Boshqa hech qanday yozuv yo'q. Shu slayd sahnada nima qiladi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: katta raqam ko'rinadi ham,
savol ham tug'diradi; yolg'iz raqam o'sha savolga javob bermaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkala tomonning ham dalili bor. Payoffdan keyin bitta
savol bering: «41 nimaning 41 tasi?» — javob yo'qligi darsga eshik ochadi.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 💥 Ko'zga tashlanadi — katta raqam darrov ko'rinadi | 48 |
| ❓ Savol tug'diradi — odam «41 nima?» deb so'raydi | 47 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham bo'ladi: katta raqam darrov ko'rinadi va darrov savol tug'diradi. Yolg'iz raqam esa o'sha savolga javob bermaydi — u **nimaning** 41 tasi ekanini aytmaydi. Bugun raqamni gapirtirasiz.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsa (Demo Day sahnasi, 41) + harakat-fe'l («so'raydi») + o'quvchining o'z holatidan o'sadi — u shu sahnaga chiqmoqda.
> 🔴 **104-qonun va korpus §119:** to'g'ri javob YO'Q; payoff **ikkala** tanlovni ham rost deb tasdiqlaydi («ko'rinadi VA savol tug'diradi») — hech kimning javobi rad etilmaydi.
> 🔴 **100-qonun:** tanlov `pm-m6d14-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62/126-qonun:** «isbot» va «shovqin» bu ekranda YO'Q — ular s2 da tug'iladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **§40:** slayd sahnada turibdi — «slaydingiz» EMAS; 41 hali hech kimniki emas.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida sahnaga chiqadigan bitta slaydni yozib olasiz: qaysi raqam,
u nimani sanaydi va u nimani ko'rsatadi.
HARAKAT: O'quvchi kuzatadi: bo'sh slaydga uch qator o'z-o'zidan yozilib chiqadi,
har birining yoniga ✅ qo'yiladi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uch qator yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

**Demo-slayd (o'z-o'zidan yozilib chiqadi) — uch qator, ustun-sarlavhasiz (korpus §67d):**

| Ekranda ko'rinadigan qator |
|---|
| **8** |
| odam tizimdan foydalandi |
| demak tizim odamlarning ishini bajarib berdi |

> 🔴 **§126:** s1 da «isbot» va «shovqin» so'zlari **0** — bosh atama maqsad-ekranda tug'ilmaydi; qator-yorliqlari sodda so'z bilan: «raqam», «nimani sanadi», «nimani ko'rsatadi».
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo raqami **8** — s4 (41 · 9 · 12) va s9 (312 · 41 · 5 · 7 · 9 · 12) to'plamlariga KIRMAYDI.
> 🔴 **§128 (namuna o'z qoidasidan o'tadi):** demo qatori darsning o'z qoidasini bajaradi — «odam tizimdan foydalandi» odamning ishini sanaydi, uchinchi qator esa tizim haqida gapiradi.
> 🔴 **§125 (maqsad-ekran natijani NOMLAYDI):** demo yadro-kashfiyotini (ikki rost raqamdan qaysi biri kuchli) oshkor qilmaydi — u faqat slayd shaklini ko'rsatadi.
> 🔴 **40-qonun:** «yozib olasiz» (artefakt) · «slaydingiz» hali YO'Q — u s8 dan keyin paydo bo'ladi.
> 🔴 **42-qonun:** suyuqlik-fe'li yo'q — «o'z-o'zidan yozilib chiqadi»; **54(b/c):** ikkinchi sarlavha-qatori YO'Q, demo ostidagi izoh YO'Q.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (gapiradigan slayd) + 3 × Quiz
EKRAN: Tizim odam uchun nima qilganini sanab turgan raqam — isbot. Faqat siz qancha
ishlaganingizni sanaydigan raqam esa shovqin: u sahnada hech narsani isbotlamaydi.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) slaydning uch qatorini birma-bir
ochadi va keyin ikki rost raqamdan kuchlirog'ini tanlaydi; (s6) keys-slaydlarini
oldindan belgilash bilan ochadi.
JAVOB: s4 — uchinchi qator ochilgach slayd to'liq gapiradi; kuchliroq raqam: 12
(odam arizasiga javob oldi).
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar uchinchi qatorni ochib to'xtaydi. Ikki raqamli savol chiqqach
«endi bittasini tanlang» deb turtki bering — qaror aynan shu lahzada.
```

**s2 — TEORIYA-1: men qilgan ish va tizim odam uchun qilgan ish** (korpus §73: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Qaysi raqam sahnada gapira oladi?»**

Mentor (≤2 gap, 32b):
> Ikki kartada bitta tizim haqidagi oltita raqam turibdi. Bosib solishtiring.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 🔧 **Men qilgan ish** | 312 ta kod satri yozildi · 5 hafta ishlandi · 7 ta sahifa qilindi |
| 👥 **Tizim odam uchun qilgan ish** | 41 odam tizimni ochdi · 9 odam telefondan ochdi · 12 odam arizasiga javob oldi |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif):
> **Tizim odam uchun nima qilganini sanab turgan raqam — isbot.** Faqat siz qancha ishlaganingizni sanaydigan raqam esa **shovqin**: u sahnada hech narsani isbotlamaydi.

> 🔴 **39-qonun qolipi:** avval hodisa (ikki karta, olti raqam), keyin «… isbot», «… shovqin». Sarlavhada yangi atama YO'Q — «gapiradi» hook payoffidan tanish fe'l (§126: «isbot» ildizi sarlavhaga ham chiqmaydi) ✓.
> 🔴 **§109:** ta'rif zamon-iborasi bilan («nima qilganini sanab turgan»), yasama ot emas.
> 🔴 **Ohang (7-C.1):** «shovqin» ayblov emas — xulosa ochilgach bitta gap chiqadi: «Mehnatingiz yomon emas, faqat u sahnada boshqa ishni bajaradi.»
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan.
> 🔴 **Sanoq-mosligi (22) va §135-A:** matnda «oltita raqam» — kartalarda 3 + 3 = 6 ✓; raqamlar kartalar ichida turgani mentor gapida ochiq aytiladi (yopiq kartada ko'rinmaydigan narsa «yozilgan» deb da'vo qilinmaydi).

**s4 — YADRO: GAPIRADIGAN SLAYD** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Slaydning qatorlarini birma-bir oching.»**

Mentor (interaktiv ekran — 1 gap, 32b):
> Har qatordan keyin pastdagi javob-qatorini o'qing: slayd shu payt nima aytdi?

> 🔴 **98b:** mentor qaysi raqam kuchli ekanini AYTMAYDI — javob-qatorlari harakatdan KEYIN chiqadi.
> 🔴 **106d/71:** har ochishda javob darhol: belgi (🤔 yoki ✅) **va** bitta javob-qatori.
> 🔴 **§106 (test ko'chirma bo'lmasin):** javob-qatorlari SLAYD-darajasida gapiradi («41 odam ochgan»); umumiy qoida («uchinchi qator raqam nimani ko'rsatishini yozadi») ekranda yozilmaydi — uni bola s5 testida o'zi chiqaradi, reveal muhrlaydi.
> 🔴 **§130 (yashil qator rost bo'lsin):** «Slayd to'liq gapirdi» faqat uchala qator ochilgach chiqadi — ekranda chindan uch qator turibdi.
> 🔴 **§95 (raqam manbasi ko'rinadi):** 41 · 9 · 12 — hammasi s2 dagi «tizim odam uchun qilgan ish» kartasida bir marta ko'rilgan; yangi raqam kiritilmaydi.
> 🔴 **§135-A (matn ekranga zid bo'lmasin):** 2-bosqichda «ikkalasi ham odam bilan bog'liq» deyiladi — ekranda chindan ikkala qator ham odamning harakatini sanaydi ✓.
> 🔴 **72-qonun:** qator-tugmalari yorliqli idishda, diqqat-signali bilan; birinchi ochishdan keyin signal tinadi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + 2-bosqich savoli + yakun-qatori = **352 grapheme** proza (chegara 400) ✓; javob-qatorlari harakatdan keyin bittadan chiqadi.

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Sahnaga chiqadigan slaydni yozing.
(mentor, 1 gap) Uchta qatorni birma-bir to'ldiring — slayd yonma-yon yozilib boradi.
HARAKAT: Uch qatorni BITTALAB yozadi: avval raqam, keyin u nimani sanashi, oxirida
u nimani ko'rsatishi. Har saqlashda o'ngdagi slaydga o'sha qator chiqadi.
JAVOB: Uch qator ham yozilgan · raqam — son · ikkinchi qator odamning yoki tizimning
ishini aytadi · uchinchi qator ikkinchisini takrorlamaydi va tizim haqida gapiradi.
RO'YXAT: Raqam yozilgan · Ikkinchi qator odam yoki tizim ishini aytadi ·
Uchinchi qator raqam nimani ko'rsatishini aytadi
YULDUZCHA: Ikkinchi slayd yozing: shu tizim haqidagi boshqa raqam bilan.
YORDAM: Sanashni ikki joydan boshlang: tizimingizni kimdir sinab ko'rgan bo'lsa —
o'sha odamlar soni; hali sinamagan bo'lsa — tizim bajarib bergan ishlar soni.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «312 ta kod satri» turidagi javoblar chiqadi — bu eng foydali xato. Javob-qatori
uni tutadi, siz so'rang: shu raqam tizim odam uchun nima qilganini aytyaptimi?
```

🔴 **Kirish-artefakt tepada bitta qatorda (korpus §69 — «BOR» va «YO'Q» tarmoqlari bir shaklda):**

| Tarmoq | Ekranda ko'rinadigan qator |
|---|---|
| Yo'l yozilgan | Yo'lingizda hozir turgan ish: **«{ish}»**. Shu ish bajarilganini qaysi raqam ko'rsatadi? |
| Yo'l yozilmagan | Hozir turgan ish: **«tizimni odamlarga ko'rsatish»**. Shu ish bajarilganini qaysi raqam ko'rsatadi? |

> Ikkala qator ham bir xil uzunlikda, bir xil shaklda; «topilmadi», «saqlanmagan», «bo'sh»
> so'zlari **0**. Manba: `pm-m6d12-yol.ufqlar` dagi `ufq === 'hozir'` qatori.

🔴 **Yozuv-kartasi (80b) — bitta karta, uch qadam ichida:**

| Qadam | Ipucha (korpus §32: qisqa savol, tayyor javob YO'Q) |
|---|---|
| ① Raqam (son) | `Nechta?` |
| ② Nimani sanadi (matn) | `Nima nechta bo'ldi?` |
| ③ Nimani ko'rsatadi (matn) | `Bu raqam tizim haqida nima deydi?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida ro'yxat-paneli YO'Q; korpus §12; 106d ikki tomonlama):**
- ✅ uch qator ham to'ldi → «✅ Uch qator ham joyida: raqam, u nimani sanagani va nimani ko'rsatgani.»
- 🤔 ikkinchi qatorda faqat mehnat-so'zi (*kod · satr · hafta · soat · ekran · dastur*) → «Bu raqam mehnatingizni sanabdi. Tizim odam uchun nima qilganini sanaydigan raqam toping.»
- 🤔 uchinchi qator ikkinchisini takrorlasa → «Uchinchi qator yangi narsa aytsin: shu raqam tizim haqida nimani ko'rsatadi?»
- 🤔 uchinchi qator «men» bilan boshlansa → «Uchinchi qator tizim haqida gapirsin — sahnada tizim ishlagani ko'rinishi kerak.»
- 🤔 raqam o'rniga so'z yozilsa → «Birinchi qatorga son yozing — sahnada raqam turadi.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **§130 (yashil qator faqat tekshirilganini tasdiqlaydi):** ✅ qatori «isbot topdingiz» demaydi —
u faqat **uch qator borligini** aytadi; isbot-hukmini o'quvchi s9 da o'zi qo'llaydi.

🔴 **Ekran-o'lchovi:** sarlavha + mentor + kirish-qatori = **178 grapheme** ✓ (javob-qatorlar harakatdan keyin, bittadan chiqadi).

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (ikki raqam — bir joy)
EKRAN: (topshiriq) Har juftlikdan slaydga chiqadigan raqamni tanlang.
(yo'riqnoma) Uch juftlik keladi. Har juftlikda slaydda bitta joy bor — qaysi raqam
tizim ishlaganini ko'proq ko'rsatadi?
HARAKAT: Uch raund: har raundda yonma-yon ikki raqam turadi, o'quvchi bittasini
bosadi. Tanlovdan keyin IKKALA raqamga ham bir qatorlik izoh ochiladi.
JAVOB: 1) 41 odam tizimni ochdi · 2) 9 odam telefondan ochdi · 3) 12 odam
arizasiga javob oldi (izohlar quyida jadvalda).
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Bitta savol bering: bu raqam kimning ishini sanadi —
tizimni qurgan odamningmi, tizimdan foydalangan odamningmi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda ishlating: har o'quvchi sherigining slaydini o'qib, uchinchi qatorga
bitta savol beradi — «shu raqam tizim haqida nimani ko'rsatyapti?». Javob topilmasa,
uchinchi qator qayta yoziladi.
MENTORGA: Eng ko'p adashiladigan joy — uchinchi raund: ikkala raqam ham rost va
ikkalasi ham odam bilan bog'liq. Farqni ochiq so'rang: qaysi biri tugagan ishni sanadi?
```

**Uch juftlik (sahnadagi o'sha tizim — s2/s4 raqamlari, yangi to'plam EMAS):**

| Raund | Chapdagi raqam | O'ngdagi raqam | Slaydga chiqadi | Izoh ochilgandan keyin |
|---|---|---|---|---|
| 1 | 312 ta kod satri yozildi | 41 odam tizimni ochdi | **41 odam tizimni ochdi** | 312 mehnatingizni sanadi · 41 tizimdan foydalangan odamlarni sanadi |
| 2 | 7 ta sahifa qilindi | 9 odam telefondan ochdi | **9 odam telefondan ochdi** | 7 sizning ishingiz · 9 tizim telefonda ham ishlaganini ko'rsatdi |
| 3 | 41 odam tizimni ochdi | 12 odam arizasiga javob oldi | **12 odam arizasiga javob oldi** | 41 boshlanishni sanadi · 12 oxirigacha bajarilgan ishni sanadi |

O'tish-gap (22-qonun — mentor 1 gap):
> Slaydingiz tayyor — endi shu qoidani uch juftlikda qo'llaymiz.

Yakun-qatori:
> ✅ **Sahnaga tizim odam uchun bajargan ishni sanagan raqam chiqadi; ikkala raqam ham shunday bo'lsa — oxirigacha bajarilgan ishni sanagani chiqadi.**

> 🔴 **26/59-qonun — farq-dalili:** m4c-06 «signal-saralash»da har element **ikki YO'Ldan biriga** yuboriladi (obyekt — tizim yuborgan xabar); m4b-02 «nosozlik-navbati»da karta **javonga** tushadi; M4a-D2 «yuk-tartiblash»da tartib quriladi; M4-D15 «qaror-sabab tanlovi»da qaror sababga ulanadi. Bu yerda esa **yonma-yon ikki nomzod va bitta joy** — saralash ham, tartiblash ham, juftlash ham yo'q: har raund **bitta duel**. 🔴 Yagona mexanika bo'lib qoladigan yangilik — **3-raund**: ikkala nomzod ham birinchi mezondan o'tadi, hukmni ikkinchi, nozikroq qoida chiqaradi (band mexanikalarning birortasida bunday raund yo'q).
> 🔴 **106d + korpus §77/§98:** noto'g'ri tanlovda javob DOIM ochiladi va IKKALA raqam ham izoh oladi — o'quvchi nima uchun ekanini o'qiydi, taxminda qolmaydi. YORDAM faqat birinchi xatodan keyin.
> 🔴 **§120 (har shart bitta javobni himoyalaydi):** har juftlikda mezon aynan bitta raqamni himoyalaydi — 1/2-raundda «kimning ishi», 3-raundda «boshlanishmi yoki tugagan ish». Ikkala mezon ham s2 va s4 da ochiq o'rgatilgan.
> 🔴 **§102 (yangi to'plam yo'q):** oltala raqam s2 kartalarida ko'rilgan — testda ekran-ko'chirma tug'ilmasin uchun s9 ballanmaydi.
> 🔴 **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **158 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (kompilyator — R1 navbati)
EKRAN: (sarlavha) Isbot beradigan raqamlarni ajratadigan kod yozamiz.
(mentor, 2 gap) Hozirgina uch juftlikni qo'lda ajratdingiz — endi o'sha ishni kod
bajaradi. Raqamlar o'sha tizimniki.
HARAKAT: isbotlar(royxat) funksiyasini to'ldiradi: odam ishini sanagan raqamlarni
ro'yxatga yig'ib qaytaradi. Uch natija bilan ko'radi.
JAVOB: Uch natija to'g'ri chiqadi: ikki yozuvli ro'yxat · bo'sh ro'yxat · bitta yozuvli ro'yxat.
RO'YXAT: Funksiya ro'yxat (massiv) qaytaradi · Faqat odam ishini sanagan raqam tushadi ·
Uch natija to'g'ri chiqdi
YULDUZCHA: royxat ga o'z tizimingizdan bitta raqam qo'shing va natijada chiqishini ko'ring.
YORDAM: Bitta yozuvdan boshlang: birinchi raqamning sanagani qiymati "odam" mi?
Ishlagach qolganlariga o'ting.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod — s9 dagi ishning to'g'ridan-to'g'ri tarjimasi, shuni ochiq ayting:
o'quvchi qo'lda bosgan tanlov endi shart-tekshiruvi bo'ldi.
```

> 🔴 **87-qonun (o'tilgan texnik material):** obyekt, massiv, `if`, taqqoslash, `push`, funksiya, `console.log` — hammasi M2 da o'tilgan; M6 texnik atamalari (AI-agent, Skills, pipeline, mobil qurilish) topshiriqqa KIRMAYDI.
> 🔴 **26-qonun / R1:** m6-12 VS Code → **m6-14 kompilyator** — registr navbati, senariy o'zgartirmaydi. Qobiq `zoom: 'calc(1 / var(--lz, 1))'` bekori bilan quriladi.
> 🔴 **Korpus §19/§48:** sarlavha «…digan **kod** yozamiz» oilasidan, natijani aytadi.
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»). Nusxa-tugmasi YO'Q.
> 🔴 **18-ov:** boshlang'ich kod yashil emas — `return []` bilan tug'iladi: uchala natija ham bo'sh chiqadi, shundan ikkitasi noto'g'ri (birinchisida ikki yozuv, uchinchisida bitta yozuv kutiladi).
> 🔴 **§135-D:** boshlang'ich kodda faqat qo'shtirnoq — o'zbekcha matnda apostrof bo'lgani uchun bitta tirnoq kodni sindiradi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **153 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Slaydingizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan javob bering: qaysi raqamni sahnaga chiqarasiz va u
nimani ko'rsatadi? Avval sherigingizga ayting, so'ng shu javobni bir qatorda yozing.
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
MENTORGA: Uchdan biri uchinchi qatorni ayta olmasa — s4 ekranini qayta oching va
uchinchi qatorni birga o'qing.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — **«O'zingizni sinab ko'ring.»** (platformaning odatiy shakli; bu darsda «sin-» ildizi band emas).
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, so'ng shu javobni bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda slaydingizni sahnaga tayyorlaysiz: tizimingizdan yana bitta raqam
topib, unga ham uch qator yozasiz va ikkitasidan qaysi biri sahnaga chiqishini
belgilaysiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
HARAKAT: Ikkinchi raqamga uch qator yozadi; ikki slayddan bittasini sahnaga tanlaydi
va sababini bir gap bilan yozadi.
JAVOB: —
RO'YXAT: Ikkinchi raqamga uch qator yozilgan · Sahnaga chiqadigani belgilangan ·
Sababda raqam kimning ishini sanagani aytilgan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Slaydingizning uchinchi qatorini uyda ovoz chiqarib aytib ko'ring va
tushunarli bo'lmasa qayta yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Muddat — Demo Day kunigacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni sanoqni aytadi, lekin qadam-raqamlari faqat To'liq-kartada turadi.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — uch qator yozish s8 da, ikki raqamdan bittasini tanlash s4 (2-bosqich) va s9 da bajarilgan.
> 🔴 **§125 (uy-vazifa kuzatiladigan hodisani aytadi):** «tushunarli bo'lmasa qayta yozing» — o'quvchi o'z ovozidan eshitadigan aniq hodisa.

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
MAVZU: Isbot beradigan raqam nimani sanaydi; shovqin-raqam nimani sanaydi; slaydning
uch qatori; uchinchi qator nima yozadi; yolg'iz raqam nima qiladi; ikki rost raqamdan
qaysi biri kuchli; Airbnb varaqlarida raqamli qadam qayerda turgan; o'sha raqam nimani
ko'rsatgan; o'sha varaqlar bugun qayerda; yo'q raqam nima qilinadi; sahnaga chiqadigan
raqamni kim tanlaydi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §106 (slayddan ko'chirma emas) · §110 (mutlaq so'z va kulgili-bo'sh variant yo'q) · §118 (cheklov-so'zsiz) · §127 (dars atamasi ≥2 variantda) · §135-C (yakka-uchraydigan so'z ham tell).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 📊 Sahnadagi slaydga uch raqam taklif qilindi. Qaysi biri tizim ishlaganini ko'rsatadi?
- A. Uch odam tizimni qurishga yordam berdi *(38)*
- **B.** Uch odam ariza yuborib javob oldi ✅ *(33)*
- C. Uch hafta ichida ariza formasi qilindi *(38)*

**Reveal:** To'g'ri — raqam tizim odam uchun bajargan ishni sanadi; qolgan ikkitasi tizim qanday qurilganini sanaydi.

> 🔴 **§106:** uchala variant ham s2 kartalarida YO'Q — u yerda 312 · 5 · 7 va 41 · 9 · 12 turgan edi; bu yerda yangi holat, ya'ni bola qoidani **qo'llaydi**, ko'chirmaydi.
> 🔴 **§127/§135-C:** «odam» ikki variantda (A va B), «ariza» ham ikki variantda (B va C) — yakka-uchraydigan kalit so'z YO'Q; A odamning ishini aytadi, lekin u **tizimni qurgan** odam, ya'ni mehnat tomoni.
> 🔴 **§110:** kulgili-bo'sh variant yo'q; uchalasi ham hayotda rost bo'lishi mumkin, faqat bittasi tizim ishlaganini ko'rsatadi. Uzunlik: 38 · 33 · 38 (to'g'ri javob eng uzun EMAS ✓).
> 🔴 **§99:** uchalasi ham «Uch …» bilan boshlanadigan slayd-qatori shaklida.

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** ⌨️ Slaydda raqam va u nimani sanagani turibdi. Odam yana nimani bilishi kerak?
- A. Tizim raqamni qaysi kuni sanaganini *(35)*
- B. Raqamni tizimning qaysi qismi sanaganini *(40)*
- **C.** Raqam tizim haqida nima deyishini ✅ *(33)*

**Reveal:** To'g'ri — uchinchi qator raqam tizim haqida nimani ko'rsatishini aytadi; shundan keyingina slayd to'liq gapiradi.

> 🔴 **§129 (kalit xulosadan emas, odam harakatidan):** savol s4 ning qator-yorlig'ini takrorlamaydi — u sahnadagi odam nimani bilishi kerakligini so'raydi; formulani reveal muhrlaydi.
> 🔴 **§127/§135-C:** «raqam» ham, «tizim» ham uchala variantda bor — darsning kalit so'zi faqat to'g'ri javobda yashamaydi. Uzunlik: 35 · 40 · 33 (to'g'ri javob eng uzun EMAS ✓).
> 🔴 **§102:** A va B — bolaga ishonarli, lekin darsning birorta ekranida ko'rsatilmagan; s4 javob-qatorlari ularni ochiq rad etadi (u yerda sana ham, tizimning qaysi qismi sanagani ham gapirilmaydi).

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 🏠 Airbnb varag'idagi raqamni ko'rgan odam nimani bilib olgan?
- **A.** Qiyinchilik qancha odamda borligini ✅ *(35)*
- B. Saytni qurish qancha qiyin bo'lganini *(37)*
- C. Jamoada qancha odam ishlaganini *(31)*

**Reveal:** To'g'ri — o'sha raqam qiyinchilik qancha odamda borligini ko'rsatgan: u qiyinchilikning kattaligini aytgan, mahsulotni emas.

> 🔴 **§124 (ball-javob sof bank-fakti):** to'g'ri javob bankdagi qadamning O'ZI («yechimni qancha odam kutayotgani»), xulosa esa reveal'da qoladi.
> 🔴 **§102 (o'qiganni mukofotlaydi):** B — sayt qurishning qiyinligi besh qadamda yo'q, buni keys-slaydi ochiq aytadi; C — jamoa besh qadamning oxirgisi, lekin u raqam bilan gapirmaydi. Uzunlik: 35 · 37 · 31 (tell 1.19 ✓).
> 🔴 **§135-C:** «qancha» uchala variantda, «qiyin-» ikkitasida (A va B), «odam» ikkitasida (A va C) — kalitni yakka so'z oshkor qilmaydi.
> 🔴 **§101/§122:** savol ham, variantlar ham Airbnb raqamining **nechaligini** so'ramaydi — bankda raqam yo'q.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 📋 Sahnaga chiqadigan raqam qanday tanlanadi?
- A. Sahnada eng katta bo'lib ko'ringan raqam tanlanadi *(50)*
- **B.** Tizim odam uchun qilganini sanagani tanlanadi ✅ *(45)*
- C. Tizimga eng ko'p vaqt ketgani tanlanadi *(39)*

**Reveal:** To'g'ri — sahnaga tizim odam uchun bajargan ishni sanagan raqam chiqadi; katta son o'zi hech narsani isbotlamaydi.

> 🔴 A — hook'da aynan shu tuzoq ko'rilgan (katta 41 yolg'iz turib savol tug'dirgan edi), ya'ni darsni o'qigan bola uni ishonch bilan rad etadi; C — s2 ning «men qilgan ish» kartasidagi «5 hafta ishlandi» oilasi. Uzunlik: 50 · 45 · 39 (to'g'ri javob eng uzun EMAS ✓, tell 1.28).
> 🔴 **§135-C:** kalit-gap s2 xulosasining so'zi bilan yozilgan, lekin «tizim» B va C da, «eng» A va C da — yakka-uchraydigan tell YO'Q.
> 🔴 **§99:** uchala variant ham «… tanlanadi» bilan tugaydi — farq faqat MA'NOda.

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydi.

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — yozilgani yashil ✓, joriysi indigo-nurda, kelgusi kulrang-punktir. Doira nomlari: **raqam · nimani sanadi · nimani ko'rsatadi**.

**Yozuv-kartasi (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida: bitta maydon va uning ostida jonli javob-qatori. O'ngda — **sahna slaydi**: har saqlangan qator slaydga chiqadi va o'sha yerda qoladi (o'quvchi natijani yozayotib ko'radi — 18-qonun).

**Yozilganlar (80c):** slayd o'zi yozilganlar ro'yxati bo'lib turadi; alohida ro'yxat-paneli YO'Q. Uchala qator yozilgach ✎ tahrirlash ochiladi.

**Ipuchalar (92c/85 · korpus §32/§115 — bir ustunning ipuchalari bitta gap-turida):** `Nechta?` · `Nima nechta bo'ldi?` · `Bu raqam tizim haqida nima deydi?` — uchalasi ham savol; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q.

**106d javob (ikki tomonlama):** ✅ «Uch qator ham joyida: raqam, u nimani sanagani va nimani ko'rsatgani.» · 🤔 «Bu raqam mehnatingizni sanabdi. Tizim odam uchun nima qilganini sanaydigan raqam toping.»

**Mehnat-so'zlari ro'yxati** (106d(c), darsning o'z lug'atidan): *kod · satr · hafta · soat · ekran · dastur · sahifa*. Ikkinchi qatorda faqat shular chiqsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

**Halollik-sharti (§40 + darsning o'z qoidasi):** o'quvchi raqamni O'ZI sanaydi. YORDAM ikki yo'lni beradi va ekranda bitta gap turadi: **«Yo'q raqamni o'ylab topmaysiz — bor raqamni gapirtirasiz.»** Bu gap saqlash tugmasi yonida, doim ko'rinadigan bitta qator.

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K12 · 91b/33/43/56/100/§101/§124)

**Freym (91b):** eyebrow — **«🏠 Haqiqiy voqea»**, K-kodi ekranga chiqmaydi (93-qonun: takrorlanadigan element M4-D15 dan so'zma-so'z ko'chirildi).

🔴 **BESHINCHI BURCHAK (majburiy).** K12 to'rt darsda ishlatilgan; band burchaklar va bashoratlar TAKRORLANMAYDI (shapka). Bu dars burchagi: **besh qadamli tartibda raqam bilan gapiradigan qadam bittagina — «yechimni qancha odam kutayotgani» — va u o'rtada turadi, ya'ni raqam qiyinchilik va yechim aytilgandan KEYIN keladi.**

🔴 **RAQAM-CHEGARASI (10-qonun · §101 · §122).** K12 bankda «raqamsiz» belgisi bilan turadi. Shuning uchun Airbnb varag'idagi raqamning **nechaligi** hech qayerda aytilmaydi — na slaydda, na bashoratda, na testda, na arenada. Dars faqat ikki narsani aytadi: o'sha qadam **bor** va u **qiyinchilik qancha odamda borligini** ko'rsatgan. 🔧 Tekshiruv: keys bo'limida birorta Airbnb raqami yozilgan bo'lsa — nuqson.

🔴 **INKOR CHEGARASI (§124, M4-D15 sabog'i):** har gap «**bu besh qadamda**» shaklida yoziladi. ❌ «bironta varaqda raqam yo'q», «boshqa hech qayerda raqam ishlatilmagan» — bank bunday demaydi (u ~10 varaqni emas, tartibning besh qadamini sanaydi).

🔴 **KEYS-EKRAN QOIDASI (registr R3):** **2 bashorat ikki O'LCHOVDA** — b1: raqamning ISHI («nimani ko'rsatgan?») · b2: qadamning O'RNI («qayerda turgan?») — **+ UZLUKSIZ HISOBLAGICH:** ekran tepasida bitta doira-qator: 4 slayd-doirasi orasida 2 ta 🎲 belgilash-nuqtasi; ochilgan doira bo'yalgan holatga o'tadi, topilsa 🎯, adashsa ⚪ bo'lib QOLADI (qizil yo'q, reset yo'q — hisoblagich ekran oxirigacha uzluksiz). Ball-relsga yozilmaydi. 🔴 **93-qonun izohi:** doira-qator — keys-ekranining RELSI (M4-D15 da muhrlangan shakl), imzo-vizual EMAS; K12 raqamsiz keys bo'lgani uchun jonli son-hisoblagichi mumkin emas.

**Oqim (4 slayd + 2 bashorat):**

1. **Slayd-1:** «Airbnb — odam boshqa birovning uyida ijaraga turadigan sayt. O'z ishini birinchi marta tushuntirganda qo'lida o'nga yaqin oddiy varaq bor edi.»
2. **Bashorat-1** *(o'lchov: raqamning ishi)* — «O'sha varaqlarning bittasi raqam bilan gapirgan. Sizningcha, u raqam nimani ko'rsatgan?» → «Saytda nechta uy borligini» *(26)* · «Qiyinchilik qancha odamda borligini» ✅ *(35)* · «Jamoada nechta odam ishlaganini» *(31)*
3. **Slayd-2 (reveal):** «Varaqlardan biri — "yechimni qancha odam kutayotgani". Raqam o'sha yerda turgan: u qiyinchilik qancha odamda borligini ko'rsatgan.»
4. **Bashorat-2** *(o'lchov: qadamning o'rni)* — «Varaqlar besh qadam bo'yicha ketgan. Sizningcha, raqamli qadam qayerda turgan?» → «Eng birinchi qadamda — hammasidan oldin» *(39)* · «Qiyinchilik va yechimdan keyin» ✅ *(30)* · «Eng oxirgi qadamda — jamoadan keyin» *(35)*
5. **Slayd-3 (reveal):** «Besh qadam shunday bo'lgan: odamlarning qiyinchiligi, yechim, yechimni qancha odam kutayotgani, mahsulot va jamoa. Raqamli qadam uchinchi o'rinda — avval qiyinchilik va yechim aytilgan.»
6. **Slayd-4 (xulosa):** «Raqam yolg'iz turmagan: u qiyinchilikning davomi bo'lgan. O'sha varaqlar bugungacha internetda ochiq turibdi — ular eng ko'p o'rganiladigan taqdimotlardan biri.»

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! …» — quyruqsiz; adashsa «Adashdingiz — asl javob: …». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — to'liq nom bilan, darsga qaytadi):**
> Airbnb varag'ida raqam yolg'iz turmagan: u qiyinchilik qancha odamda borligini ko'rsatgan. Sahnaga chiqadigan slaydingizda ham shunday bo'ladi — raqam nimani sanaganini va nimani ko'rsatishini o'zi bilan olib chiqadi. Buni kod emas, mahsulotni o'ylaydigan odam hal qiladi.

> 🔴 **10-qonun (keys-sadoqati — tekshirildi):** bankda bor — Airbnb ijara sayti · o'nga yaqin oddiy varaq · besh qadamli tartib (qiyinchilik → yechim → yechimni qancha odam kutayotgani → mahsulot → jamoa) · varaqlar ochiq turibdi · eng ko'p o'rganiladigan taqdimotlardan biri. Bankdan tashqari birorta fakt va birorta raqam YO'Q ✓.
> 🔴 **§123 (jonli hisoblagich bashorat javobini oshkor qilmasin):** doira-qator faqat ochilgan slaydlar sonini ko'rsatadi, slayd MAZMUNINI emas.
> 🔴 **§102/§123 (bashorat-varianti izohsiz atama tug'dirmasin):** bashorat variantlarida yangi atama yo'q — hammasi kundalik so'zlar.
> 🔴 **§106 (test kaliti slayddan ko'chirilmasin):** TEST-3 ning to'g'ri javobi slayd-2 ning so'zma-so'z takrori emas — slayd qadam NOMINI beradi («yechimni qancha odam kutayotgani»), test esa **odam nimani bilib olgani**ni so'raydi.
> 🔴 **Bashorat halolligi (17/43/64):** har bashorat bitta o'lchovning uch darajasi; hech biri boshqa slaydda rost bo'lib chiqmaydi. Uzunliklar: b1 26 · 35 · 31 (tell 1.35 ✓) · b2 39 · 30 · 35 (tell 1.30 ✓; to'g'ri javob eng uzun EMAS).
> 🔴 **Burchak-farqi (M1-D12 · M2-D13 · M3-D14 · M4-D15):** u darslar tuzilish, tinglovchi, tartib va texnika-yo'qligi haqida gapirgan; bu dars **faqat raqamli qadam** haqida — yangi fakt qo'shilmagan, burchak bankdagi tartib-ro'yxatining uchinchi qadamidan chiqarilgan.

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · kompilyator)

**Darvoza-mashq (82e):** bitta savol-tanlov: «Isbot beradigan raqam nimani sanaydi?» → «Tizim odam uchun bajargan ishni» ✅ *(31)* / «Tizimni qurishga ketgan umumiy vaqtni» *(37)* / «Tizim kodida yozilgan satrlar sonini» *(36)* — tell 1.19 ✓, «tizim» uchala variantda (§135-C), uchala variant ham bir turdagi ot-birikma (§133).

**Boshlang'ich kod:**

```js
// Sahnadagi tizimning raqamlari (s9 dagi juftliklardan)
const royxat = [
  { son: 312, nima: "kod satri yozildi",    sanagani: "mehnat" },
  { son: 41,  nima: "odam tizimni ochdi",   sanagani: "odam"   },
  { son: 5,   nima: "hafta ishlandi",       sanagani: "mehnat" },
  { son: 12,  nima: "odam arizasiga javob oldi", sanagani: "odam"   }
];

function isbotlar(raqamlar) {
  // Odam ishini sanagan raqamlarni ro'yxatga yig'ing (son va nima birga)
  return [];   // bu joyni siz to'ldirasiz
}

console.log(isbotlar(royxat));
// ["41 odam tizimni ochdi", "12 odam arizasiga javob oldi"]
console.log(isbotlar([]));
// []
console.log(isbotlar([royxat[1]]));
// ["41 odam tizimni ochdi"]
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. Funksiya ro'yxat (massiv) qaytaradi
2. Faqat odam ishini sanagan raqam tushadi
3. Uch natija to'g'ri chiqdi

**YORDAM (yechimni aytmaydi — korpus §77):** Bitta yozuvdan boshlang: birinchi raqamning `sanagani` qiymati `"odam"` mi? Ishlagach qolganlariga o'ting.

**YULDUZCHA:** `royxat` ga o'z tizimingizdan bitta raqam qo'shing va natijada chiqishini ko'ring.

> 🔴 **Sanoq-mosligi (22-qonun):** 312 · 41 · 5 · 12 — s2 kartalarida va s9 juftliklarida ko'rilgan raqamlar; yangi son kiritilmadi (korpus §95: raqamning manbasi ko'rinadi). 4 yozuv · 3 natija — matndagi sonlar ekrandagiga teng.
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`royxat` · `isbotlar` · `sanagani`): kodda `royxat`, prozada «ro'yxat».
> 🔴 **§135-D:** kod-satrlaridagi o'zbekcha matn qo'shtirnoqda va apostrofsiz — `"odam tizimni ochdi"`, `"odam arizasiga javob oldi"`; imlo buzilmadi.
> 🔴 **87-qonun:** massiv + obyekt + `if` + `push` — M2 materiali; `filter` bilan yozgan o'quvchiga ham ruxsat (M3 da o'tilgan), ikkala yo'l JAVOB shartini bajaradi.
> 🔴 **Pedagogik ulanish (87c):** mentor ochiq aytadi — qo'lda bosilgan tanlov endi shart-tekshiruvi bo'ldi; YULDUZCHA s8 artefaktini kodga olib kiradi.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qator CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo raqami **8** — s4/s9 to'plamlariga KIRMAYDI; «isbot»/«shovqin» so'zlari 0 (§126) |
| **s12 REFLEKSIYA** | Sarlavha: «Slaydingizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga» |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q. 🔴 §130: yuklanish-matni «Natijalar kelmoqda…» (dars ildizlari «raqam/sanamoq» platforma-matnida boshqa ma'no bermasin) |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Tizim odam uchun nima qilganini sanab turgan raqam — isbot.» · «Faqat mehnatingizni sanaydigan raqam sahnada hech narsani isbotlamaydi.» · «Gapiradigan slaydda uch qator bor: raqam, u nimani sanadi, u nimani ko'rsatadi.» · «Yo'q raqamni o'ylab topmaysiz — bor raqamni gapirtirasiz.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.
> 🔴 Kalit-almashinuvi (registr talabi): **0,3,2,1 · 1,0,2,3 · 0,2,1,3**.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | Isbot beradigan raqam nimani sanaydi? | s2 |
| 2 | Shovqin-raqam nimani sanaydi? | s2 |
| 3 | Yolg'iz raqam sahnada nima qiladi? | s0 + s4 |
| 4 | Gapiradigan slaydda nechta qator bor? | s4 |
| 5 | Uchinchi qator nima yozadi? | s4 + s5 |
| 6 | Ikki rost raqamdan qaysi biri kuchli? | s4 |
| 7 | «41 odam tizimni ochdi» nimani ko'rsatadi? | s4 + s9 |
| 8 | Airbnb varaqlarida raqamli qadam qayerda turgan? | s6 |
| 9 | O'sha raqam nimani ko'rsatgan? | s6 + s7 |
| 10 | Airbnb varaqlari bugun qayerda? | s6 |
| 11 | Raqam topilmasa nima qilinadi? | s8 + s15 |
| 12 | Sahnaga qaysi raqam chiqishini kim hal qiladi? | s6 + s15 |

> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q — «metrika», «retention», «DAU», «pitch», «dashboard» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «raqam», «isbot», «shovqin», «slayd», «qator» so'zlari bilan.
> 🔴 **§101/§122:** 8–10-savollar Airbnb raqamining **nechaligini** so'ramaydi — bank raqam bermagan; savollar qadamning o'rni, ishi va varaqlarning bugungi holati haqida.
> 🔴 **§114:** arena fon-dekor so'zlari shu dars lug'atidan (`raqam · slayd · qator · sahna`) — klon-qoldiq tekshiriladi.

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Slide Talker!** | Slaydning uch qatorini o'zingiz ochdingiz | 40 | s4: uchala qator ochildi |
| **Proof Finder!** | Ikki rost raqamdan kuchlirog'ini topdingiz | 42 | s4: 2-bosqich to'g'ri yakunlandi |
| **Stage Ready!** | Sahnaga chiqadigan slaydni yozdingiz | 36 | s8: uch qator saqlandi |
| **Number Duel!** | Uch juftlikda raqamni tanladingiz | 33 | s9: 3/3 raund bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 33–42 belgi (§63 oralig'i) ✓.
> 🔴 **§100 (omonim-tekshiruvi):** «Slide», «Proof», «Stage», «Duel», «Number» — kursning texnik lug'atida boshqa ma'no bermaydi ✓ («Log» ataylab olinmadi — u `console.log` bilan to'qnashardi).
> 🔴 **§93/§130/§133 (tasdiq faqat REAL bajarilgan ishni aytadi):** «Number Duel!» tavsifi «to'g'ri tanladingiz» demaydi — s9 noto'g'ri tanlovda ham davom etadi, shuning uchun tavsif faqat **tanlov qilinganini** aytadi. «Proof Finder!» esa faqat to'g'ri yakunda beriladi, shuning uchun «topdingiz» rost.

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Isbot beradigan raqam qanday raqam? | Tizim odam uchun nima qilganini sanab turgan raqam |
| 2 | Shovqin-raqam nimani sanaydi? | Faqat siz qancha ishlaganingizni |
| 3 | Gapiradigan slaydda nechta qator bor? | Uchta: raqam, u nimani sanadi, u nimani ko'rsatadi |
| 4 | Uchinchi qator nima yozadi? | Raqam tizim haqida nimani ko'rsatishini |
| 5 | Yolg'iz raqam sahnada nima qiladi? | Savol tug'diradi, lekin javob bermaydi |
| 6 | Ikki rost raqamdan qaysi biri kuchli? | Ish oxirigacha bajarilganini sanagani |
| 7 | Airbnb varaqlarida raqamli qadam qayerda turgan? | Qiyinchilik va yechim aytilgandan keyin |
| 8 | O'sha raqam nimani ko'rsatgan? | Qiyinchilik qancha odamda borligini |
| 9 | Sanaydigan raqam topilmasa nima qilinadi? | Yo'q raqam o'ylab topilmaydi — bor raqam olinadi |
| 10 | Sahnadagi qisqa taqdimot qanday ataladi? | Pitch — sahnada mahsulotni qisqa tanishtirish |

> 🔴 **Korpus §20/§52:** 1-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **Korpus §76/§132:** 10-karta old tomonida chet so'z YO'Q — u javobda gloss bilan chiqadi; «pitch» dars matnida boshqa hech qayerda ishlatilmaydi.
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ikki ta'rif · uch qator · uchinchi qator · yolg'iz raqam · kuchli raqam · keys o'rni · keys ishi · halollik-qoidasi · nom).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Isbot — tizim odam uchun nima qilganini sanagan raqam»** — (1) kanonik ta'rif · (2) mehnatni sanagan raqam sahnada boshqa ishni bajaradi · (3) sinfga savol
**s5 · «Slayd uch qator bilan gapiradi»** — (1) raqam, u nimani sanadi, u nimani ko'rsatadi · (2) uchinchi qator bo'lmasa savol javobsiz qoladi · (3) savol
**s7 · «Raqam qiyinchilikning davomi»** — (1) Airbnb varaqlarida raqamli qadam uchinchi o'rinda turgan · (2) u qiyinchilik qancha odamda borligini ko'rsatgan · (3) savol
**s11 · «Sahnaga bitta raqam chiqadi»** — (1) tizim odam uchun bajargan ishni sanagani chiqadi · (2) ikkalasi ham odamniki bo'lsa, oxirigacha bajarilgan ish chiqadi · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** ❌ «K12 xulosasi» → «Airbnb misolida».

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K12** — M6 modulida ishlatilmagan (modul-ichi qoidasi, registr 4-bo'lim) ✓
6. TEKSHIRUV mexanikasi oldingi PM darsni takrorlamaydi — m6-12 ufq-joylash · **m6-14 «ikki raqam — bir joy» (juftlik-duel)** ✓
7. 2-shaxs birlik murojaati — **0** ✓ (butun matn siz-formada)
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): Demo Day sahnasi va o'quvchining o'z tizimi — s0 dan s15 gacha; keys 91b freymi bilan kiradi va ko'prik bilan qaytadi ✓
- 95 (Toshkent o'smiri): o'quvchi shu sahnaga o'zi chiqadi, oldingi ikki Demo Day'da bo'lgan ✓
- 96c(e) (demo to'qnashuvi): yangi mahsulot-olam kiritilmadi; band olamlarning birortasi ishlatilmadi ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m6-12 VS Code → m6-14 kompilyator) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat M2 materiali (massiv · obyekt · `if` · `push`) ✓
- 29 (kelajak-atama oqmaydi): «metrika», «retention», «DAU», «konversiya», «voronka», «foiz» o'quvchi matnida **0** ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104/§119: hook ikki tanlovi teng (48 ↔ 47 belgi) va payoff ikkalasini ham rost deb tasdiqlaydi ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish va yadro ekranlarida 1 gap) ✓
- 92d: majburiy maydonlar faqat o'quvchida ANIQ bor ma'lumot uchun (raqam o'zi sanaydi; YORDAM ikki yo'l beradi) ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN o'qildi — §99–136 bilan birga):**
1. **§20/§80/§85:** «raqam» yagona nom; kanonik ta'rif 4 yuzada so'zma-so'z; «metrika» o'quvchi ekranida 0 ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 slayd-qatori · T2 «… -ni» · T3 «… -ni» · T4 «… tanlanadi») ✓
3. **§102:** distraktorlar ekranda rost bo'lib ko'rinmaydi; T4-A hook'da ochiq rad etilgan ✓
4. **§104/§126:** «isbot» va «shovqin» s2 da ta'rif-gap bilan tug'iladi, maqsad-ekranda 0 ✓
5. **§105/§121 (ildiz-intizomi):** «qator» faqat slaydning qatori (kod satri — «satr», sayt sahifasi — «sahifa»); «raqam» faqat son ma'nosida; «sanamoq» faqat sanash ma'nosida; «shovqin» boshqa ma'noda ishlatilmaydi; platforma-matnida ham ildiz tekshiriladi (podium: «Natijalar kelmoqda…») ✓
6. **§106/§129:** T2 s4 qator-yorlig'ini takrorlamaydi (odam harakatiga o'girilgan); T3 bank-faktini so'raydi, xulosa reveal'da ✓
7. **§107:** ha/yo'q-savol yo'q ✓
8. **§108:** hech bir savol rostni rad ettirmaydi ✓
9. **§109:** bosh ta'rif zamon-iborasi bilan ✓
10. **§110/§118:** mutlaq so'z ham, cheklov-so'zi ham distraktorlarda yo'q; kulgili-bo'sh variant yo'q ✓
11. **§111:** «degan javob» qurilmasi 0 ✓
12. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi 2-bosqich savoli chiqqandan keyin) ✓
13. **§119:** hook payoffi ikkala tanlovni ham rost deb tasdiqlaydi ✓
14. **§120:** s9 da har juftlik uchun mezon aynan bitta raqamni himoyalaydi; ikkala mezon ham s2/s4 da o'rgatilgan ✓
15. **§122/§124:** keys-raqami darsning ta'rifiga zo'rlanmadi — Airbnb raqamining nechaligi umuman aytilmaydi; inkor «bu besh qadamda» bilan chegaralangan ✓
16. **§127/§135-C:** dars atamasi kamida ikki variantda va yakka-uchraydigan kalit so'z yo'q (T1 «odam» A-B, «ariza» B-C · T2 «raqam» va «tizim» uchalasida · T3 «qancha» uchalasida, «qiyin-» A-B · T4 «tizim» B-C, «eng» A-C · darvoza-mashqida «tizim» uchalasida) ✓
17. **§130/§133:** yashil qatorlar faqat tekshirilgan ishni tasdiqlaydi; nishon-tavsiflari real triggerga mos ✓
18. **§134/§135-C:** rangga yashirin ma'no yuklanmaydi — har holat yonida so'z bilan yozilgan qator turadi; son-echo va vaqt-so'zi tell qilinmadi ✓
19. **§135-A:** ekranda ko'ringan narsaga zid da'vo yo'q — «oltita raqam» (3+3) · «uch juftlik» (3 raund) · «uch qator» (3 qator) ✓
20. **§135-B:** «isbot» ham, «shovqin» ham ta'rif-gap bilan ekranga chiqadi; ta'rifsiz atama qolmadi ✓
21. **§69:** «topilmadi / saqlanmagan / bo'sh» 0 — kirish-artefaktning ikki tarmog'i bir shaklda ✓
22. **§40:** «tizimingiz» faqat o'quvchida BOR narsa uchun (m6-13 dan keyin tizim bor); s4/s9 raqamlari «sahnadagi slayd»niki ✓
23. **§136 / MATN_ETALONI 7-C:** kantselyarit 0 · sheva 0 · so'zlashuv-maqtovi va qarindosh-murojaati 0; ovoz-testi qo'lda o'tkazildi — har gap tirik o'qituvchi ovozi bilan o'qildi ✓
24. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo qator (s1) · 3+3 raqam (s2) · 3 qator + 2 raqam (s4) · 4 slayd + 2 bashorat (s6) · 3 qator (s8) · 3 raund × 2 raqam (s9) · 4 qator + 3 natija (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
25. **Ekran-prozalari (Intl.Segmenter):** s0 254 (savol + ikki tanlov; payoff harakatdan keyin) · s1 ~150 · s2 ~300 · s4 352 · s8 178 · s9 158 · s10 153 grapheme (chegara 400) ✓

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**
**(a) Umumiy:** `npm run lint:til src/6-Modull/PmLesson25.jsx` → **0 error** shart (87 qoida).

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M6-D14 ga tegishli):
`metrika` · `retention` · `DAU` · `konversiya` · `voronka` · `foiz` · `o'rtacha chek` (29-qonun — o'quvchi matnida **0**) ·
`dashboard` · `grafik` · `diagramma` · `statistika` · `analitika` (kalka **0**) ·
`KPI` · `o'sish sur'ati` (kattalar lug'ati **0**) ·
`pitch` (faqat flashcard-10 javobida — boshqa joyda **0**) ·
`qaytgan` · `qaytdi` (m5-11 hodisasi bu darsda o'rgatilmaydi) ·
`o'lchaydi` · `o'lchov` · `hisoblab chiqadi` · `tahlil` (fe'l-intizomi: faqat «sanaydi/ko'rsatadi») ·
`mikrofon` · `ovoz yozib` · `taymer` · `sekundomer` · `tinglovchi kursisi` · `kadr` · `tasma` ·
`qavat` · `so'z-elagi` (pitch-oilasi mexanikalari **0**) ·
`slaydingiz` s8 dan OLDIN (§40) · `tizimingiz` s4/s9 da (**0** — u yerda «tizim») ·
`topilmadi` · `saqlanmagan` (§69) ·
`ko'pchilik` · `ovozlar` · `sinf` (§97, o'quvchi matnida) · `ball emas` · `degandingiz` (100-qonun) ·
Airbnb bilan bir gapda turgan har qanday **son** (§101/§122 — bank raqamsiz) ·
`Natijalar yuklanmoqda` (§130 — platforma-matni «Natijalar kelmoqda…»).

---

## 13-A. METODIST-KORREKTURA (2026-08-19 · F-0819-08 · senariy-bosqichi)

> Quruvchidan OLDINGI til/pedagogika raundi. Kalit-indekslar (to'g'ri javob POZITSIYASI) **tegilmadi** —
> T1 B · T2 C · T3 A · T4 B o'z joyida qoldi; ekran soni, mexanika va artefakt-shakli ham o'zgarmadi.
> Faqat MATN, kod-namunasi va senariy-annotatsiyalari tuzatildi.

**A · Test-halolligi va so'z-telli (§135-C — yakka-uchraydigan so'z kalitni oshkor qiladi)**
1. **T1-C** «Uch hafta ichida tizim yig'ildi» → **«Uch hafta ichida ariza formasi qilindi»**: «ariza» faqat to'g'ri javobda turgan edi, endi B va C da.
2. **T2-A/B** «Raqam qaysi kuni sanalganini» · «Raqamni qaysi dastur **hisoblab berganini**» → **«Tizim raqamni qaysi kuni sanaganini»** · **«Raqamni tizimning qaysi qismi sanaganini»**: «tizim» faqat kalitda edi (endi uchalasida) va distraktor darsning taqiq-fe'lini («hisoblab») ekranga chiqarardi.
3. **T3-B/C** → **«Saytni qurish qancha qiyin bo'lganini»** · **«Jamoada qancha odam ishlaganini»**: «qiyinchilik» faqat kalitda edi; endi «qancha» uchalasida, «qiyin-» ikkitasida. Ustiga eski B «qurib chiqarilganini» — hujjat-shakli (7-C).
4. **T4** uchalasi qayta yozildi: **A** «Sahnada eng katta bo'lib ko'ringan raqam tanlanadi» · **B** «Tizim odam uchun qilganini sanagani tanlanadi» ✅ · **C** «Tizimga eng ko'p vaqt ketgani tanlanadi». Sabab: «odam» faqat kalitda edi, ustiga kalit-gap darsning kanonik ta'rifidan uzilib qolgan edi («odamning ishi» va «tizim odam uchun qilgan ishi» — bir xil mezon emas; quyida 11-band).
5. **s10 darvoza-mashqi:** «Loyihaga ketgan umumiy vaqtni» · «**Kodda yozilgan qatorlar** sonini» → «Tizimni qurishga ketgan umumiy vaqtni» · «Tizim kodida yozilgan **satrlar** sonini» — «tizim» uchala variantda, «qator» omonimi ketdi (tell 1.07 → 1.19, kalit eng qisqa).

**B · Ildiz-intizomi (§105/§121): darsning O'Z so'zi ikkinchi ma'noda yashamasin**
6. **«312 qator kod yozildi» → «312 ta kod satri yozildi».** Darsning bosh birligi — **slaydning uch qatori**; o'sha ekranda «qator» kod satrini ham bildirardi (M4a-D2 «joy → qism» pretsedenti). Kaskad: s2 kartasi · s9 1-raundi · s10 kod-namunasi · MENTORGA · 14-bo'lim 7-bandi.
7. **«7 ta ekran qilindi» → «7 ta sahifa qilindi».** «Ekran» bu darsda sahnadagi ekran (s0) va dars ekranlari — uchinchi ma'no berilmaydi. Kaskad: s2 · s9 2-raundi.
8. **Mehnat-so'zlari ro'yxati** (*kod · **qator** · hafta …*) → *kod · **satr** · hafta …*: ro'yxat darsning o'z kalit so'zini «mehnat-so'zi» deb belgilab qo'yardi.
9. **Koding matni:** «bitta **qatorga** yig'ib» · «**qator** qilib qaytaring» · «ikki **qatorli** ro'yxat» · «4 **qator**» → «ro'yxatga yig'ib» · «yozuv». Kod maydoni **`kimningIshi` → `sanagani: "odam" | "mehnat"`** — eski nom («kimning ishi») darsning ikki xil mezonini aralashtirardi, yangisi to'g'ridan-to'g'ri dars so'zlari bilan gapiradi.

**C · Matn ekranga ZID bo'lmasin (§135-A) va qoida o'z mexanikasiga zid emas**
10. **s9 yo'riqnomasi** «Slaydda bitta joy bor — qaysi raqam tizim ishlaganini ko'rsatadi?» → **«Har juftlikda slaydda bitta joy bor — qaysi raqam tizim ishlaganini ko'proq ko'rsatadi?»**. 🔴 Eng qimmatli topilma: 41 **1-raundda g'olib, 3-raundda mag'lub**; mutlaq shaklda «41 odam tizimni ochdi» 3-raundda ham ROST javob bo'lib qolardi (§17/§120 — ikki himoyalanadigan javob). s4 ning 2-bosqichi allaqachon «ko'proq» deb so'raydi — endi ikkalasi bir shaklda.
11. **s9 yakun-qatori** va **RECAP s11-1** «raqam **odamning ishini** sanaydi» → «raqam **tizim odam uchun bajargan ishni** sanaydi». Dars bitta mezonni ikki xil so'z bilan aytardi: T1-A («uch odam tizimni qurishga yordam berdi») «odamning ishi» mezoniga ko'ra ROST bo'lib qolardi. s9 1-raundining izohi ham aniqlashtirildi: «41 odamning ishini sanadi» → «41 **tizimdan foydalangan odamlarni** sanadi».
12. **s10 uchinchi tekshiruvi** `isbotlar([royxat[0]])` → **`isbotlar([royxat[1]])` → `["41 odam tizimni ochdi"]`.** Eski holatda ikkita natija ham `[]` edi, ya'ni boshlang'ich `return []` uchtadan **ikkitasini to'g'ri** chiqarardi — senariyning «uchala natija ham noto'g'ri chiqadi» da'vosi yolg'on edi (18-ov bandi ham tuzatildi).
13. **s2 mentori** «Bitta tizim haqida oltita raqam **yozilgan**» → «**Ikki kartada** bitta tizim haqidagi oltita raqam turibdi. Bosib solishtiring.» — kartalar yopiq turadi, ekranda hech qanday raqam ko'rinmasdi.
14. **s1 demosining 3-qatori** «demak tizim odamlarga **kerak bo'ldi**» → «demak tizim odamlarning **ishini bajarib berdi**»: 8 raqamidan «kerak bo'ldi» xulosasi chiqmaydi, ustiga namuna darsning o'z fe'l-intizomiga tushdi (§128).

**D · Atama-izchilligi va til-sayqali**
15. **s2 sarlavhasi** «Sahnada qaysi raqam nimanidir isbotlaydi?» → **«Qaysi raqam sahnada gapira oladi?»**: bosh atamaning ildizi («isbot») sarlavhada, ta'rifdan OLDIN tug'ilardi (§126/39-qonun — senariyning o'z bandiga zid); yangi sarlavha hook payoffining fe'lini oladi.
16. **RECAP s3 sarlavhasi** «Isbot — odam uchun bajarilgan ishning raqami» (yasama ot-birikma) → «Isbot — tizim odam uchun nima qilganini sanagan raqam» (§109 zamon-iborasi, kanonik ta'rif bilan bir xil).
17. **«ariza uchidan-uchiga javob oldi» → «12 odam arizasiga javob oldi»** (s4 · s9 · s2 · kod). «Uchidan-uchiga» — izohsiz kalka (end-to-end), darsda hech qayerda ochilmasdi (§135-B); yangi shakl bilan uchala odam-raqami bir qolipda: «41 odam …», «9 odam …», «12 odam …».
18. **Flashcard-10 javobi** shapkada va 11-bo'limda ikki xil yozilgan edi → bitta shakl: «Pitch — sahnada mahsulotni qisqa tanishtirish».
19. **Keys slayd-4:** «O'sha varaqlar … ochiq turibdi **va** eng ko'p o'rganiladigan taqdimotlardan biri» → «… ochiq turibdi — **ular** eng ko'p o'rganiladigan taqdimotlardan biri» (ko'plik ↔ «biri» kelishmovchiligi).

**E · Qayta o'lchandi:** variant-telllari T1 1.15 · T2 1.21 · T3 1.19 · T4 1.28 · darvoza 1.19 (chegara 1.4 ✓, to'g'ri javob birortasida eng uzun emas) · ekran-prozalari s0 254 · s9 158 · s10 153 (chegara 400 ✓; qolganlari o'zgarmadi) · nishon tavsiflari 33–42 belgi ✓. `node til-lint.mjs pm-senariylar/M6-D14-MetrikaliPitch.md` — **0 error / 2 warn** (ikkala warn senariy-annotatsiyasidagi blok-nomiga tegishli, o'quvchi matnida emas) · `node prompt-lint.mjs` toza.

---

## 14. ⚠️ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq, 2026-08-19)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi.

1. 🔴 **DARS SARLAVHASI VA SUB.** `App.jsx` `m6-14` hozir: title «Metrikali pitch» · sub «metrika isbot beradi, arxitektura slaydga chiqadi». Ikkala so'z ham taqiqda: «metrika» — M8-D1 atamasi (29-qonun), «arxitektura» — m6-03/m4-15 atamasi. **Taklif:** title → **«Raqamingiz nimani isbotlaydi?»** · sub → **«bitta raqam — bitta slayd»**. Tasdiqlaysizmi?

2. 🔴 **IMZO-NOMI REGISTRDA O'ZGARSINMI.** Registrda muhr «METRIKA-SLAYDI»; lekin «metrika» so'zi bu darsda ekranga chiqmaydi, ya'ni muhr-nomi va dars lug'ati bir-biriga zid turadi. **Taklif:** registr muhri → **«GAPIRADIGAN SLAYD»** (mazmuni o'zgarmaydi: raqam gapiradigan slayd). Tasdiqlaysizmi — yoki muhr faqat senariy-ichi nom bo'lib qolsinmi?

3. 🔴 **BOSH ATAMA JUFTLIGI: «ISBOT» va «SHOVQIN».** «Metrika» o'rnini **«raqam»** oladi, hukm-juftligi esa **isbot ↔ shovqin**. Sabab: ikkalasi ham o'smirga tanish o'zbek so'zi, ta'rifi bir gapda ochiladi, fe'llari tabiiy («sanaydi», «ko'rsatadi»). Rozimisiz — yoki «shovqin» o'rniga yumshoqroq so'z izlansinmi (masalan «yon-raqam»)?

4. 🔴 **K12 BESHINCHI BURCHAGI.** Burchak: besh qadamda raqamli qadam bittagina («yechimni qancha odam kutayotgani») va u o'rtada turadi. Bashoratlar: b1 — raqamning ISHI · b2 — qadamning O'RNI. 🔴 **Raqam-chegarasi:** bank K12 ni «raqamsiz» deb belgilagani uchun Airbnb varag'idagi raqamning **nechaligi** hech qayerda aytilmaydi. Shu chegara yetarlimi — yoki burchak boshqa yo'nalishga o'girilsinmi?

5. 🔴 **s4 IKKI BOSQICHLI.** 1-bosqich: uch qatorni birma-bir ochish (yolg'iz raqam jim turadi). 2-bosqich: ikki ROST raqamdan kuchlirog'ini tanlash (9 telefondan ochdi ↔ 12 odam arizasiga javob oldi). Sabab: birinchi qoida «kimning ishi», ikkinchisi «boshlanishmi yoki tugagan ish» — s9 ning 3-raundi aynan shunga tayanadi. Qo'shimcha bosqichni tasdiqlaysizmi?

6. 🔴 **§40 YECHIMI — RAQAM QAYERDAN KELADI.** O'quvchida tashqi foydalanuvchilar bo'lmasligi mumkin. Shuning uchun s4/s9 raqamlari **sahnadagi slaydniki**, s8 da esa o'quvchi O'ZI sanaydi va YORDAM ikki yo'lni beradi (kimdir sinab ko'rgan bo'lsa — odamlar soni; bo'lmasa — tizim bajarib bergan ishlar soni). Ekranda ochiq qoida turadi: «Yo'q raqamni o'ylab topmaysiz — bor raqamni gapirtirasiz.» Shu yechim tasdiqlanadimi?

7. 🟡 **RAQAMLAR-TIZIMI.** Sahnadagi tizim raqamlari: 312 kod satri · 5 hafta · 7 sahifa (mehnat) ↔ 41 odam ochdi · 9 telefondan ochdi · 12 odam arizasiga javob oldi (odam tomoni). Shu oltilik s2 · s4 · s9 · s10 da AYNAN takrorlanadi; s1 demosi alohida raqam (8) oladi. Tasdiqlaysizmi?

8. 🟡 **TEKSHIRUV MEXANIKASI NOMI.** «IKKI RAQAM — BIR JOY»: uch raund, har raundda yonma-yon ikki nomzod, bitta joy. 3-raundda ikkala nomzod ham birinchi mezondan o'tadi — hukmni nozikroq qoida chiqaradi (band mexanikalarda bunday raund yo'q). Nom va shakl tasdiqlansinmi?

9. 🟡 **ARTEFAKT SHAKLI (registr muhri — o'zgartirilmadi).** `pm-m6d14-pitch = { slayd: { raqam, nima, isbot }, savedAt }`. **Taklif (majburiy emas):** `raqam` ni son sifatida emas, **matn** sifatida saqlash — o'quvchi «12» ham, «12 dan 9 tasi» ham yozishi mumkin. Shu aniqlik muhrga qo'shilsinmi?

10. 🟡 **KIRISH-ARTEFAKT ISHLATILISHI.** `pm-m6d12-yol` dan faqat `ufq === 'hozir'` qatoridagi `ish` olinadi va s8 tepasida bitta qatorda ko'rinadi («Yo'lingizda hozir turgan ish: …»). Ikkala tarmoq bir shaklda (§69). Shu yetarlimi — yoki uch ufqning hammasi ko'rsatilsinmi?

11. 🟡 **UY-VAZIFA IKKINCHI SLAYD.** To'liq variant ikkinchi raqamga uch qator yozdiradi va ikkitasidan bittasini sahnaga tanlatadi (Demo Day kunigacha). Rozimisiz — yoki uy-vazifa faqat mavjud slaydni sayqallash bo'lib qolsinmi?

12. 🟢 **FLASHCARD-10 «PITCH».** Dars bo'ylab «pitch» so'zi ishlatilmaydi (o'zbekcha «sahnadagi qisqa taqdimot»), lekin oxirgi kartada u gloss bilan bir marta chiqadi — o'quvchi bu so'zni M1/M2/M3 pitch darslarida ko'rgan. Shu bitta chiqish OQLANADIMI?

**Metodist raundi qo'shgan savollar (2026-08-19 · F-0819-08):**

13. 🟡 **UCHINCHI RAQAM SHAKLI O'ZGARDI.** «12 ta ariza uchidan-uchiga javob oldi» → **«12 odam arizasiga javob oldi»**: «uchidan-uchiga» darsda ochilmaydigan kalka edi, yangi shakl bilan uchala odam-raqami bir qolipda yuradi («41 odam …», «9 odam …», «12 odam …»). Ma'no saqlandi: 3-raundda 12 baribir **oxirigacha bajarilgan ishni** sanaydi. Tasdiqlaysizmi?

14. 🟡 **KOD-NAMUNASIDA IKKI TUZATISH.** (a) maydon nomi `kimningIshi` → **`sanagani: "odam" | "mehnat"`** — darsning ikki so'zi bilan gapiradi; (b) uchinchi tekshiruv `royxat[0]` (natija `[]`) → **`royxat[1]`** (natija `["41 odam tizimni ochdi"]`), chunki eski holatda boshlang'ich `return []` uchta natijadan ikkitasini «to'g'ri» chiqarib qo'yardi. Kod-topshirig'ining og'irligi o'zgarmadi. Tasdiqlaysizmi?

15. 🟡 **«QATOR» FAQAT SLAYDNIKI.** Omonim tozalandi: «312 **qator kod**» → «312 ta **kod satri**», «7 ta **ekran**» → «7 ta **sahifa**» (ekran — sahnadagi ekran), mehnat-so'zlari ro'yxatida «qator» → «satr». Shu almashuv tasdiqlansinmi — yoki mehnat-raqamlari butunlay boshqa uchlikka o'girilsinmi?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (0–136) · MATN_ETALONI (lug'at + 7-B + 7-C) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2 Batch 5/R3 pasporti) bo'yicha yozildi. `pm-metodist` SENARIY-KORREKTURA bajarildi (2026-08-19 · F-0819-08 · 13-A bo'lim). Keyingi qadam: **[GATE S]** — 14-bo'lim savollari (1–15).*

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
