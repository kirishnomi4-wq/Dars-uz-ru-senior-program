# M4-D12 — Ilova nimani yozib qoladi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/4-Modull/PmLesson13.jsx` (hozirgi `-v16` avlod dars BUTUNLAY almashadi;
> yangi `lessonId: pm-m4d12-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 4 — «Ma'lumot va bog'lanishlar» (Node.js + PostgreSQL) |
| **Dars** | M4-D12 (modulning 12-darsi) · `key: m4-12` |
| **Mavzu** | Baza sxemasi — mahsulot qarori: nimani saqlashni oldindan yozilgan e'lon hal qiladi, dasturchining xayoli emas |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z sxemasini **yozadi**; artefakt = matn, keyingi darsga o'tadi (`PM_DARS_ETALON` 1-B). USTAXONA (48/80-qonun) **majburiy** |
| **Bosh keys** | **K16 · AMAZON** (temalar: *hujjat koddan oldin · fokus · stakeholder*) — registr R2 Batch 2 biriktirmasi, mavzuga aynan mos. Raqamsiz keys — raqam qo'shilmaydi (bankdagi yagona sana: 1995 — faqat kitoblar) |
| **ISHLATILGAN_KEYS (M4 ichida band)** | m4-02: K6 (Netflix) · m4-07: — (zaxira ilgak) → **K16 modulda birinchi marta** ✓ |
| **Oldingi PM dars (M4-D7) TEKSHIRUV mexanikasi** | «xabardan ortiqcha qatorni olib tashlash» — **takrorlanmaydi** |
| **Band mexanikalar (TAQIQ)** | story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli foyda-vaqt doskasi · «ISHGA TUSHIRIB KO'RISH» soxta formasi · Timeline · Hotspot · MatchPairs · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · kartani ko'chirish · PairTimer · klinika · tekshiruvchi stoli · 3 hikoya ustaxonasi · `hikoyaYasa` kompilyatori · «GAPSIZ KO'RSATUV» 4 kadrli tasma · barcha pitch-oila mexanikalari (registr ro'yxati) · **M4-D2: «XOTIRA TUGMALARI» · jadval-qatorini belgilash** · **M4-D7: «UCH KIRISH — BIR SAHIFA» · xabardan qator olib tashlash** |
| **Misol-ip (91/108 + 95 + 96c)** | 📚 **Maktab kutubxonasi — kitob band qilish ilovasi.** 95-qonun: o'smir maktab kutubxonasiga o'zi boradi, kitob band qilish tashvishi unga tanish ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti (M3-D10) · 🏀 maydoncha (M3-D14) · musiqa ilovasi (M4-D2) · maktab jurnali ilovasi (M4-D7) — **maktab kutubxonasi band emas** ✓ |
| **Kirish-artefakt** | `pm-m4d7-ishonch` = `{ qatorlar: [ { maydon, ruxsat, sabab } × 3 ], savedAt }` · `ruxsat` = `'ochiq' \| 'yopiq'`. 🔴 Ikki tomonlama shart-tekshiruvi (F-0803-22-B): shakl qurilgan `src/4-Modull/PmLesson12.jsx` dan tekshirildi (`OUT_KEY = 'pm-m4d7-ishonch'`, 1436-qator payload) — o'quvchi dars aynan shu kalitni va shu shaklni o'qiydi. **Yo'q bo'lsa ham dars ishlaydi** (zaxira yo'l, korpus §69 shaklida — 5-bo'lim) |
| **Chiqish-artefakt** | 🔴 `pm-m4d12-sxema` = `{ ustunlar: [ { nom, savol, kim } × 3 ], savedAt }` · `nom` = ustun nomi (kirish-artefaktdagi `maydon`) · `savol` = o'quvchi yozgan bitta qator («odam bu ustundan qaysi savoliga javob oladi») · `kim` = `'ochiq' \| 'yopiq'` (kirish-artefaktdagi `ruxsat` qiymati o'zgarishsiz ko'chadi). **M4-D15** (`PmLesson14`, arxitektura pitchi) shu uch ustunni «ARXITEKTURA-QAVATLARI»ning baza-qavati qilib o'qiydi ⚠️ GATE S 3-savoli |
| **Yordamchi kalitlar** | `pm-m4d12-hook-choice` (faqat YOZILADI — 100c) · `pm-m4d12-board` (s4 holati) · `pm-m4d12-check` (s9 holati) · `pm-m4d12-code` · `pm-m4d12-reflection` · `pm-m4d12-hw-target` · `ccProgress` |
| **Koding** | 🖥 **KOMPILYATOR** (umumiy `HtmlCompiler` qatlami, JS rejimi) — R1 navbati muhrlangan: m4-07 VS Code → **m4-12 kompilyator** (26-qonun) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D10/M4-D7 da tasdiqlangan yakun-tuzilmasi bilan bir xil |

### Atama-glosslar (62/39-qonun + korpus §20 — avval hodisa, keyin nom)

- 🔴 **«PRD» qisqartmasi butun darsda ISHLATILMAYDI** — u **m6-02** («PRD nima», `PmLesson22`)
  ning bosh atamasi, 29-qonun bo'yicha kelajak-dars atamasi joriy darsga oqmaydi. O'rnida
  darsning o'z so'zi — **«e'lon»**: ish boshlanishidan oldin yoziladigan matn, unda ilova odamga
  nima berishi aytiladi. «E'lon» o'smirning kundalik so'zi (maktab e'loni, kanal e'loni) — lekin
  bu darsda unga **maxsus ma'no** beriladi, shuning uchun §104/39 bo'yicha u **hodisa bilan
  tug'iladi** (s4 mentori: avval «qurilishdan oldin yozilgan matn», keyin nomi). K16 keysida
  bir marta rasmiy juftligi ochiladi: «matbuot e'loni (press-reliz)» — keyin yana faqat «e'lon».
  ⚠️ Bu GATE S ning 2-savoli;
- 🔴 **«sxema» — darsning bosh atamasi, hodisa bilan kiritiladi** (korpus §104): s2 da
  «Ilova nimani yozib qolishi oldindan ro'yxat qilinadi — shu ro'yxat sxema deyiladi».
  Kanonik ta'rif (93-qonun, hamma yuzada so'zma-so'z): **«Sxema — ilova nimani yozib
  qolishini ko'rsatadigan ustunlar ro'yxati.»** «Jadval» va «ustun» so'zlari m4-01 dan tanish;
- 🔴 **Bugungi qoida-fe'li (korpus §103 — yasama ot emas, fe'l):** **«Ustunni e'lon ochadi.»**
  Kaskad: s4 yakun-qatori · TEST-2 reveal · RECAPS s5 sarlavhasi · refleksiya mukofot-qatori ·
  arena MAVZU — hammasida shu fe'l;
- 🔴 **👁 ochiq / 🔒 yopiq juftligi M4-D7 dan o'zgarishsiz keladi** (korpus §80: bir tushuncha —
  bir nom). Bu darsda juftlik qayta TA'RIFLANMAYDI — u ustun-belgisi sifatida ishlaydi; yangi
  nom (masalan «maxfiy», «ko'rinmas») kiritilmaydi;
- ❌ **SQL sintaksisi bu darsda O'RGATILMAYDI** — `SELECT`/`CREATE` va boshqa buyruqlar m4-06
  (`PostgresCrudLesson`) niki. Bu dars sxema QARORINI o'rgatadi; koding ham JS yozuv-obyekti
  (7-bo'lim), SQL emas;
- ❌ **«artefakt» · «PRD» · «stakeholder» · «feature» o'quvchi matnida YO'Q** (14-qonun:
  ichki jargon ekranga oqmaydi);
- ❌ **«ma'lumotlar bazasi arxitekturasi» kabi og'ir birikmalar YO'Q** — «sxema», «jadval»,
  «ustun» yetadi (m4-01 dan tanish);
- ❌ **`til-lint-rules.json` dagi barcha error-darajali taqiq-so'zlar YO'Q.** Ro'yxat bu yerda
  takrorlanmaydi — manba bitta (M4-D2 tartibi): `npm run lint:til pm-senariylar/M4-D12-Sxema.md`
  va qurilgandan keyin `npm run lint:til src/4-Modull/PmLesson13.jsx` → ikkalasida **0 error**;
- ❌ **«daftar» YO'Q** (F-0729-04) · ❌ 7-B.3 taqiq-oilasi YO'Q — linter tutmaydiganlarini
  qo'lda grep qilamiz (13-bo'lim b).

🔴 **§80 darvozasi (bir tushuncha — bir nom):** demo-olam dars bo'ylab **faqat «ilova»** deb
ataladi («maktab kutubxonasi ilovasi» → «kutubxona ilovasi» → «ilova»). «Sayt» so'zi o'quvchi
matnida **0** — aks holda bola «sayt bilan ilova bir narsami?» degan savolda qoladi. Bu nom M4
zanjiri bilan ham bir xil (M4-D2 musiqa ilovasi · M4-D7 maktab jurnali ilovasi) va kanonik
ta'rifga aynan mos: «Sxema — **ilova** nimani yozib qolishini…».

🔴 **§40 darvozasi (o'quvchida hali yo'q narsa uniki qilib aytilmaydi):** kutubxona ilovasi —
demo-olam, o'quvchiniki EMAS: hech qachon «ilovangiz». O'quvchiniki bo'ladigan narsa — u s8 da
O'ZI tuzadigan **sxema**: yaratilgandan KEYIN «sxemangiz» to'g'ri (refleksiya, uy-vazifa; s8 ning
O'ZIDA hali «sxemangiz» EMAS). Uch qator M4-D7 dan kelgani uchun «uch qatoringiz» boshidan to'g'ri.

🔴 **«ish» so'zi bir ma'noda (ETALON 43 — ko'p ma'noli so'z):** bu darsda «ish» faqat **ilova
bajaradigan bitta vazifa** («Kitob navbati» ishi, «Yangi kitob qo'shish» ishi). O'quvchining
loyihasi hech qachon «ishingiz» deyilmaydi — «uch qatoringiz» / «sxemangiz» qoladi.

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «SXEMA-TO'QISH» — ustun-bog'lash doskasi** (23-qonun: har darsda YANGI —
story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» ·
«GAPSIZ KO'RSATUV» · «XOTIRA TUGMALARI» · «UCH KIRISH» klonlanmaydi; registr R2 yo'lakchasi).

Ekranning chap tomonida — **e'lon-varag'i** («📄 E'lon» yorlig'i bilan): kutubxona ilovasi uchun
oldindan yozilgan e'lonning **to'rt gapi** (har biri alohida gap-karta). O'ng tomonida — **sxema-ustunlari**: uchta tayyor
ustun-karta va pastda bitta **punktir bo'sh o'rin** («➕ yangi ustun» joyi).

O'quvchi **avval gapni tanlaydi, so'ng mos ustunni bosadi** (75-qonun tartib-qolipi) — ular
orasida **ingichka ip** tortiladi va ustun «yonadi».

| # | E'lon gapi | Mos ustun | Ip ulangach chiqadigan bitta qator |
|---|---|---|---|
| 1 | Kitobni nomidan qidirib topasiz. | 📕 Kitob nomi | ✅ Nomni hamma qidiradi — ustun 👁 ochiq. |
| 2 | Band kitob ro'yxatda «band» deb ko'rinadi. | 🚩 Holati | ✅ Band belgisini hamma ko'radi — ustun 👁 ochiq. |
| 3 | Kitobni kim band qilganini kutubxonachi ko'radi. | 🧑 Band qilgan o'quvchi | ✅ Buni faqat kutubxonachi ko'radi — ustun 🔒 yopiq. |
| 4 | Kitob qachon bo'shashini ko'rasiz. | ➕ (ustun YO'Q — yangisi ochiladi) | ✅ Bu gapga mos ustun yo'q edi — yangi ustun ochildi: 📅 Qaytarish sanasi (👁). |

🔴 **Belgi ipdan tug'iladi (M4-D7 zanjiri):** ustunlar boshida belgisiz turadi; ip ulangach
gap o'zi ustunga **👁 yoki 🔒** bosadi — e'lon nafaqat ustunni ochadi, kim ko'rishini ham aytadi.
Bu M4-D7 ning «kim ko'radi» qarori sxemaning ustuniga aylanadigan lahza.

🔴 **4-gap — kashfiyot:** unga mos ustun yo'q. O'quvchi 4-gapni tanlab punktir o'ringa bossa —
yangi ustun (📅 Qaytarish sanasi) ochilib, ip ulanadi. Punktir o'rin boshidanoq ko'rinib turadi
va u ham qaror-nuqtasi: 1–3-gaplar bilan bosilsa — 🤔 «Bu gap uchun ustun allaqachon bor —
yuqoridagi ustunlarga qarang.» (korpus §98: qoida, juftlik nomlanmaydi).

Noto'g'ri ustun bosilganda (korpus §98 — qoida beriladi, javob aytilmaydi):
> 🤔 Gapni qayta o'qing: odam bu gapda nimani ko'radi? O'sha narsa yoziladigan ustunni tanlang.

Yakun-qatori (69-qonun — maqtov emas, xulosa):
> ✅ **To'rt gap — to'rt ustun, har belgi ham gapdan chiqdi. Ustunni e'lon ochadi.**

🔴 **§106/§102 (test slayddan ko'chirilmaydi):** 4-ip javob-qatori ataylab «ustunsiz qoldi»
demaydi — u FAKTni aytadi («bu gapga mos ustun yo'q edi»). Qoidani («gap ustunsiz qolganda
yangi ustun qo'shiladi») o'quvchi TEST-2 da O'ZI chiqaradi; aks holda test o'lchamaydi,
ko'chirtiradi.

**Nima uchun aynan shu:** «sxemani hujjat belgilaydi» degan gapni o'qib tushunib bo'lmaydi —
buni faqat **gapdan ustunga ip tortganda** his qilish mumkin. Bola sxema haqida gapirmaydi, u
har ustunning **qayerdan kelganini o'z qo'li bilan** topadi — va ustunsiz qolgan gap yangi
ustunni **o'zi ochadi**. Bu K16 keysining darsdagi kichik ko'rinishi: avval matn, keyin qurilish.

🔴 **Mexanika-farqi (23/26/59-qonun):** MatchPairs — ikki tayyor ro'yxatni juftlash o'yini
(har elementning jufti BOR, TEKSHIRUV-primitiv). SXEMA-TO'QISH — juftlash emas, **sxema qurish**:
bitta gapning jufti YO'Q (ustun ochish qarori), har ip ustunga **belgi bosadi**, punktir o'rin
esa qaror-nuqtasi. M4-D2 da o'quvchi tugmani yoqib-o'chirib bo'lim qurardi, M4-D7 da kirishni
almashtirardi — bu yerda **gapdan ustunga ip tortadi**. Uch xil ish, takror emas.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D10/M4-D7 dagidek — etalon (P0 · PmLesson2 · PmLesson4):
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «"Band qilish"ni bossangiz, ilova nimani yozib qoladi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch ustunli sxema o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — yozilgan narsa va yozilmagan narsa · «sxema» atamasi | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **SXEMA-TO'QISH** (4 gap · 3+1 ustun) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K16 Amazon (6 bosqich · 2 bashorat · uzluksiz hisoblagich) | 3 | — | keys-slayd (33/56-qonun + 17-ov-band) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | USTAXONA — o'z sxemasi: 3 ustunga savol (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **SXEMA-SHART TEKSHIRUVI** (artefakt-checklist) | 5 | — | 🔴 yangi mexanika |
| s10 | KODING — sxemani ishlaydigan yozuvga aylantirish | 6 | — | 26/82/87-qonun · kompilyator |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.
🔴 **47-qonun:** interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha **buyruq** shaklida —
`?</h2>` shu 4 ekranda **0**; teoriya/hook/keys/refleksiya ekranlarida (s0 · s2 · s6 · s12)
savol-sarlavha ruxsat (induktiv metodning quroli).

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 4 — Ma'lumot va bog'lanishlar: Node.js + PostgreSQL
DARS: M4-D12 (12-dars)
DARS_MAVZUSI: Baza sxemasi — nimani saqlashni e'lon hal qiladi
ISHLATILGAN_KEYS: K16
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Maktab kutubxonasi ilova chiqardi: kitobni telefondan band qilasiz.
«Band qilish»ni bossangiz, ilova nimani yozib qoladi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL natija ochiladi: ertasi kungi sahna — kitob javonda «band», lekin ilova kim
band qilganini yozmagan, kutubxonachi kitobni kimga saqlashni bilmaydi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi: ikkala tanlovda ham «kim band qilgani» yo'q,
payoff aynan shu yetishmagan narsani ochadi. Payoff: ilova yozib qolmagan narsa —
ilova uchun yo'q narsa.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ikkala tanlov ham taxmin — payoff bir xil. Gap taxminda emas: nimani
yozishni kimdir oldindan hal qilishi kerak edi. Shu savol bilan keyingi ekranga o'ting.
```

**Ikki tanlov (104-qonun: teng sonli, teng og'irlikda, teng uzunlikda):**

| Tanlov | Ostidagi izoh (tanlangach ochiladi) |
|---|---|
| 📕 Kitob nomini va band qilingan kunni | Ertasi kuni: kitob javonda «band» — lekin ilova **kim band qilganini** yozmagan. Kutubxonachi kitobni kimga saqlashni bilmaydi. |
| 🔢 Kitob nomini va javon raqamini | Ertasi kuni: kitob javonda «band» — lekin ilova **kim band qilganini** yozmagan. Kutubxonachi kitobni kimga saqlashni bilmaydi. |

Payoff ostidagi hukm-qatori (bitta gap, korpus §24 — referentdan boshlanadi):
> **Ilova yozib qolmagan narsa — ilova uchun yo'q narsa.**

> 🔴 **104-qonun (teng og'irlik) + hook-halolligi:** izoh ikkala tanlovda **bir xil** va
> **maqtovsiz**. 🔴 Ikkala tanlovda ham «kim band qilgani» **yo'q** — shuning uchun payoff hech
> kimning taxminini rad etmaydi, ikkalasiga ham bir xil yangi narsa qo'shadi. ❌ Eski juftlik
> («Faqat qaysi kitob…» / «Kitobni ham, kim band qilganini ham») yaroqsiz edi: payoff ikkinchi
> tanlovni jimgina yolg'onga chiqarardi, ya'ni «to'g'ri javob yo'q» degani rost bo'lmasdi.
> 🔴 **97-qonun:** savolda aniq narsa (kutubxona ilovasi, «Band qilish» tugmasi) + harakat fe'li
> (bossangiz · yozib qoladi) + o'quvchi qilgan harakat. ❌ «Baza sxemasi nima?» — darslik tili.
> 🔴 **91a:** hook savoli javobsiz osilib qolmaydi — payoff shu ekranda: ilova faqat yozilganini
> biladi. «Nimani yozishni KIM hal qiladi?» degan davomi s4/s6 da ochiladi.
> 🔴 **100-qonun:** tanlov `pm-m4d12-hook-choice` ga yoziladi, hech qayerda o'qilmaydi.
> 🔴 **62-qonun:** «sxema» va «e'lon» atamalari bu ekranda YO'Q — s2/s4 da ochiladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda chiqadi.
> O'quvchi matnida jamoa-murojaati **0**: «ko'pchilik», «ovozlar», «hammamiz».
> 🔴 **Spoyler-tekshiruvi (M3-D5 saboqi):** payoff «kim band qilgani» ustunini aytadi — bu s4 da
> TAYYOR turgan ustun (🧑), kashfiyot emas. s4 ning kashfiyoti (📅 qaytarish sanasi) hookda
> tilga olinmaydi — butun qoladi ✓

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida uch ustunli sxema tuza olasiz —
har ustun odamning bitta savoliga javob beradi.
HARAKAT: O'quvchi kuzatadi: bo'sh sxema-kartaga uchta ustun o'z-o'zidan yozilib
chiqadi — har birida nom, savol va belgi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uch ustun yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

**Demo-uchlik (jonli preview — 18/42-qonun · boshqa ish, o'sha olam):** «Yangi kitob qo'shish»
sxemasi (kutubxonachi ishlatadigan ish):

| Ustun | Savoli | Belgi |
|---|---|---|
| 📕 Kitob nomi | Qaysi kitob keldi? | 👁 |
| ✍️ Muallif | Kim yozgan? | 👁 |
| 💰 Sotib olingan narx | Qancha turgan? | 🔒 |

> 🔴 **40-qonun:** «tuza olasiz» — bilim, rost; «ilovangiz»/«ishingiz» YO'Q (§40 darvozasi:
> o'quvchida hali sxema ham, loyiha-«ish» ham yo'q — maqsad-gapi bilim bilan yopiladi).
> 🔴 **42-qonun (fe'l ↔ ekran jarayoni):** ustunlar **«o'z-o'zidan yozilib chiqadi»** —
> suv-fe'li ishlatilmaydi; mentor-eslatmasida ham shu fe'l.
> 🔴 **54(b/c):** `ta-sub` ikkinchi qatori YO'Q · demo ostidagi caption YO'Q.
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo-uchligi s4 ning ustunlariga KIRMAYDI —
> boshqa ish («Yangi kitob qo'shish»), boshqa ustunlar. Bir olam, boshqa qatorlar.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (sxema-to'qish doskasi) + 3 × Quiz
EKRAN: Ilova faqat sxemaga yozilganini biladi. Sxema — ilova nimani yozib qolishini
ko'rsatadigan ustunlar ro'yxati.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) e'lon gaplaridan ustunlarga ip
tortadi va ustunsiz qolgan gapga yangi ustun ochadi; (s6) keys-bosqichlarini
bashorat bilan ochadi.
JAVOB: s4 — to'rt gap to'rt ustunga ulanadi, bittasi yangi ustun ochadi
(jadval 1-bo'limda).
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar 4-gapni mavjud ustunlarga ulashga urinadi — bu eng foydali
xato: «ustun yetishmayapti» degan kashfiyot aynan shu urinishdan tug'iladi.
Muhokama qiling: gap ustunsiz qolsa, ilova bu savolga javob bera oladimi?
```

**s2 — TEORIYA-1: yozilgan ↔ yozilmagan** (korpus §73: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat — 47-qonun teoriya-istisnosi): **«Ilova band qilingan kitobni qayerdan biladi?»**

Mentor (1 gap — atama hodisa bilan kiradi, korpus §41/§104):
> Ilova nimani yozib qolishi oldindan ro'yxat qilinadi — shu ro'yxat **sxema** deyiladi.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 📝 **Sxemaga yozilgan narsa** | Ilova buni eslab qoladi — istalgan payt ekranga chiqara oladi |
| ⬜ **Sxemaga yozilmagan narsa** | Ilova uchun bu yo'q — ekranga hech qachon chiqmaydi |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif — 93-qonun):
> **Ilova faqat sxemaga yozilganini biladi.** Sxema — ilova nimani yozib qolishini ko'rsatadigan ustunlar ro'yxati.

> 🔴 **Korpus §73 (inkordan boshlanmaydi):** ❌ «Sxema — bu shunchaki jadval EMAS» → ✅ ikki
> holatni yonma-yon qo'yish.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet («ilova») nomlanadi.
> 🔴 **Korpus §72:** «yozilmagan narsa yo'q narsa» g'oyasi hookda (sahna) va shu ekranda
> (ta'rif) — jami 2 marta; boshqa proza-ekranda takrorlanmaydi.
> 🔴 **Ekran-o'lchovi (Intl.Segmenter bilan qurilishda qayta o'lchanadi):** sarlavha (43) +
> mentor (88) + 2 karta (~135) + xulosa (~100) ≈ **366 grapheme** — 400 chegarasidan past ✓.
> Quruvchi shu ekranga qo'shimcha matn QO'SHMAYDI.

**s4 — YADRO: SXEMA-TO'QISH** (markaziy mexanika)

Sarlavha (47-qonun — buyruq): **«Har gapga o'z ustunini ulang.»**

Mentor (≤2 gap, 92a · 109 TMI · **«e'lon» atamasi shu yerda tug'iladi**):
> Kutubxona ilovasi qurilishidan oldin bitta matn yozilgan: ilova odamga nima berishi shunda
> aytilgan — shu matn **e'lon**.
> Avval gapni tanlang, so'ng shu gap yoziladigan ustunni bosing.

To'liq jadval, javob-qatorlari, punktir o'rin va yakun-qatori — **1-bo'limda**.

> 🔴 **Korpus §39/§104 (bosh atama kesik qurilmada tug'ilmaydi):** «e'lon» birinchi marta
> ANIQ ta'rif-gapda chiqadi — avval hodisa («qurilishdan oldin yozilgan matn, unda ilova odamga
> nima berishi aytilgan»), keyin nom. ❌ «Kutubxona sayti uchun oldindan e'lon yozilgan» — nom
> oldinda, ta'rif ergashda: atamani bilmagan bola gapdan ma'no chiqara olmaydi. Kundalik
> «e'lon» (maktab e'loni) bu darsdagi ma'nodan boshqa — shuning uchun gloss majburiy.
> 🔴 **98b/60-qonun:** mentor qaysi gap qaysi ustunga borishini AYTMAYDI — jadvaldagi
> «Mos ustun» ustuni faqat mentor kaliti, o'quvchi ekranida YO'Q.
> 🔴 **72-qonun:** e'lon-varag'i **«📄 E'lon»** yorlig'i bilan alohida idishda turadi (atama
> ekranda ko'rinib, mentor gapiga langar bo'ladi); idish ostida diqqat-signali
> «✋ Har gapni o'z ustuniga ulang ↓» — birinchi tanlovdan keyin signal tinadi.
> 🔴 **106c (4 blok budjeti):** sarlavha → e'lon-varag'i → sxema-ustunlari → javob-qatori
> (oxirgi ulangan ipniki). Beshinchi blok YO'Q; javob-qatorlaridan bittasi ko'rinadi.
> 🔴 **106d/71-qonun:** har ipdan keyin javob darhol chiqadi — belgi (✅/🤔) va bitta qator.
> 🔴 **Devor-himoyasi (M3-D10 GATE S saboqi):** 40–45 soniya harakatsizlikdan keyin bitta
> qoida-ipuchasi: «🤔 Har gapga bitta savol: odam bu gapda nimani ko'radi? O'sha narsa
> yoziladigan ustunni qidiring.» — javobni AYTMAYDIGAN shaklda (korpus §98).
> 🔴 **Ekran-o'lchovi:** sarlavha (29) + mentor (~190) + 4 gap (~150, material) + 4 ustun-nom
> (~70, material) + javob-qatori (~65) — proza ≈ **284**, jami ≈ **504**; darvoza proza ≤400
> bo'yicha o'tadi (9-qonun: ish-materiali sanalmaydi) ✓
> 🔴 **Korpus §37 (yig'iladigan gap):** gap-kartalar to'liq gap holida, ustun-nomlar ot-birikma
> holida — ip ularni jumlaga QO'SHMAYDI, shuning uchun kelishik-mosligi muammosi yo'q.

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (USTAXONA) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish ustaxonasi)
EKRAN: (sarlavha) Har ustunga bitta savol yozing.
(mentor, 1 gap — matni «Kirish-artefakt tarmog'i»da, ikkala tarmoq uchun)
HARAKAT: Uch ustunni BITTALAB o'tadi. Har ustunda nom va belgi tayyor turadi,
o'quvchi savolni yozadi; saqlangach keyingi ustunga o'tiladi.
JAVOB: Uchala ustunga savol yozilgan · har savol odam tilida («odam nimani
bilmoqchi?») · savollar bir-birini takrorlamaydi.
RO'YXAT: Uchala ustunga savol yozilgan · Savol odam nimani bilishini so'raydi ·
Savollar bir-birini takrorlamaydi
YULDUZCHA: To'rtinchi ustun oching: nomini, belgisini va savolini o'zingiz yozing.
YORDAM: O'zingizga savol bering: odam bu ustunga qarab nimani bilib oladi?
Javobingiz — ustun savoli.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Kitob nomi» ustuniga «kitob nomi kerak» degan takror-savollar chiqadi —
eng foydali xato. Javob-qatori uni tutadi; siz muhokama qiling: odam NIMANI bilmoqchi?
```

🔴 **Kirish-artefakt tarmog'i (korpus §69 — ikki tarmoq bir shaklda, bir uzunlikda; mentor
pufagi AYNAN shu bitta gap — ETALON 32):**
- **Artefakt BOR:** «O'tgan darsda chiqargan uch qaroringiz pastda turibdi — endi har biridan
  bitta ustun yasaysiz.» *(84)*
- **Artefakt YO'Q:** «Kutubxona ilovasining uch qatori pastda turibdi — endi har biridan bitta
  ustun yasaysiz.» *(82)*
- 🔴 «sxemangiz» so'zi bu ekranda **YO'Q** (§40): sxema hali tuzilmagan — u s8 tugagach paydo
  bo'ladi va shundan keyin («✓ Sxemangiz tayyor», refleksiya, uy-vazifa) egalik bilan ataladi.
- 🔴 «topilmadi / saqlanmagan» so'zlari **0** · zaxira-uchlik **shu darsning O'Z olamidan**
  (kutubxona, 96c-d): **📕 Kitob nomi (👁) · 🧑 Band qilgan o'quvchi (🔒) · 📅 Qaytarish
  sanasi (👁)** — s4 da ip ulangan ustunlar (M4-D7 pretsedenti: bu takror emas, **qo'llash** —
  o'quvchi endi ularga o'z so'zi bilan savol yozadi).
- 🔴 **Olam farqi normal (96c b/d):** o'quvchining uch qatori M4-D7/M4-D2 zanjiridan (musiqa
  ilovasi olami) keladi, darsning demo-olami esa kutubxona ilovasi. Shuning uchun matnda hech
  qachon «musiqa ilovangizning ustunlari» deyilmaydi — **«uch qatoringiz»**, s8 tugagach
  **«sxemangiz»**.
- 🔴 **Belgi manbasi (korpus §95):** har ustun-kartada 👁/🔒 belgisi tayyor turadi — manbani
  kirish-gapi aytadi («o'tgan darsda qaror chiqargandingiz»); zaxira-tarmoqda belgi kutubxona
  uchligi bilan birga keladi, alohida izoh-qator QO'YILMAYDI (86b).

🔴 **Saqlash-shartining javob-qatorlari (48/106d-qonun — alohida checklist-panel YO'Q):**
- juda qisqa (1–2 so'z) → «🤔 Qisqa qoldi: odam nimani bilmoqchi — to'liq savol qilib yozing.»
- ustun nomini takrorlagan → «🤔 Ustun nomini qaytardingiz. Odam bu ustundan nimani bilib
  oladi — shuni yozing.»
- oldingi savolga juda o'xshash → «🤔 Bu savol yuqoridagiga o'xshash — boshqa savol yozing.»
- savol joyida → «✅ Savol odam tilida — bu ustun nima uchun kerakligi endi yozilgan.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi tayyor»
- 🔴 **Mentor-diyetasi (ETALON 32):** yozish-ekranida pufak **1 gap**, qadam-ro'yxatini
  AYTMAYDI; «avval …, keyin …» qurilmasi pufakda **0** — tartibni UI o'zi ko'rsatadi.

**3-saqlashda** ekran o'zi bajarildi (honor-tugma yo'q) va `pm-m4d12-sxema` yoziladi
(shakli — shapkada). Batafsil spetsifikatsiya — 5-bo'limda.

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (artefakt-checklist — sxema-shart tekshiruvi)
EKRAN: (topshiriq) Dasturchining sxemasini uch shartdan o'tkazing.
(yo'riqnoma) Dasturchi «Kitob navbati» ishiga sxema taklif qildi. Shartga mos kelmagan
ustunni bosing — hammasi joyida bo'lsa, «Bu shart bajarilgan»ni tanlang.
HARAKAT: Uch shartni birma-bir yuritadi: ikkitasida xato ustunni topib bosadi,
bittasida «Bu shart bajarilgan»ni tanlaydi.
JAVOB: 1-shart — 🎂 Tug'ilgan kun (hech qaysi gap so'ramagan) · 2-shart — ☎️ Telefon
raqami (belgisi 👁 turibdi, uni esa faqat kutubxonachi ko'radi — 🔒 bo'ladi) ·
3-shart — bajarilgan.
RO'YXAT: —
YULDUZCHA: —
YORDAM: Har ustunga bitta savol bering: buni e'londagi qaysi gap so'radi? Javob
topilmasa — o'sha ustun shartga mos kelmaydi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Sherigingiz bilan sxemalaringizni almashing: uning har ustuniga bitta savol
bering — «bu qaysi savolga javob?» Javob topilmasa, o'sha ustun qayta ko'riladi.
MENTORGA: Eng ko'p adashiladigan joy — tug'ilgan kun ustunini qoldirish («ilovalar
so'raydi-ku»). Aynan shu yerda qoida ochiladi: e'londa yo'q gapga ustun ham kerak emas.
```

**Material (7-B: KARTOCHKA ichida yo'riq YO'Q). Ish: «Kitob navbati» — e'lon (3 gap):**
1. Band kitobga navbatga yozilasiz — navbat ro'yxatini hamma ko'radi.
2. Navbatda nechanchi ekaningizni ko'rasiz.
3. Telefon raqamingiz faqat kutubxonachiga ko'rinadi.

🔴 **1-gapdagi «navbat ro'yxatini hamma ko'radi» — halollik bandi (17-qonun):** usiz
🧑 «Navbatdagi o'quvchi» ustuni 👁 mi yoki 🔒 mi ekani e'londan chiqmasdi, s4 da esa
o'xshash ustun («Band qilgan o'quvchi») **🔒** bo'lgan edi — darsni diqqat bilan o'qigan bola
2-shartda aynan shu ustunni bosib «🤔» olardi. Endi 2-shartning yagona himoyalanadigan
javobi — ☎️.

**Dasturchi taklif qilgan sxema (5 ustun):**

| Ustun | Belgi | Holat |
|---|---|---|
| 📕 Kitob nomi | 👁 | joyida (1-gap) |
| 🧑 Navbatdagi o'quvchi | 👁 | joyida (1-gap: navbat ro'yxatini hamma ko'radi) |
| 🔢 Navbat raqami | 👁 | joyida (2-gap) |
| ☎️ Telefon raqami | 👁 | 🔴 2-shart xatosi: telefon raqamini faqat kutubxonachi ko'radi — 🔒 bo'lishi kerak |
| 🎂 Tug'ilgan kun | 👁 | 🔴 1-shart xatosi: hech qaysi gap so'ramagan |

**Uch shart (birma-bir ochiladi — 92a: bir vaqtda bitta shart):**

| # | Shart | To'g'ri harakat | Javob-qatori |
|---|---|---|---|
| 1 | Har ustunni e'londagi gap so'ragan | 🎂 ustunini bosish | ✅ Topdingiz — tug'ilgan kunni hech qaysi gap so'ramagan. |
| 2 | Yopiq ma'lumot 🔒 bilan belgilangan | ☎️ ustunini bosish | ✅ Topdingiz — telefon raqamini faqat kutubxonachi ko'radi: ustun 🔒 belgisini oldi. |
| 3 | E'londagi har gapga ustun bor | «Bu shart bajarilgan» tugmasi | ✅ To'g'ri — uchala gapning ham ustuni bor. |

🔴 **1-shart javob-qatori qoidani AYTMAYDI (§106):** u faktni aytadi, ustunning sxemadan
chiqishini esa ekranning O'ZI ko'rsatadi (🎂 chizilib olinadi). «Bunday ustun sxemadan olib
tashlanadi» degan qoida-gapi bu yerdan olib tashlandi — u TEST-4 ning to'g'ri javobi, ya'ni
slaydda turgan bo'lsa test ko'chirtiradi.

Noto'g'ri ustun bosilganda (korpus §98/§116 — qoida ikkala xatoni ham qamraydi, juftlik
nomlanmaydi): 1-shartda → «🤔 Har ustunga bitta savol: buni e'londagi qaysi gap so'radi?» ·
2-shartda → «🤔 E'lonni qayta o'qing: qaysi ma'lumotni hamma emas, bitta odam ko'radi?»

Holat ko'rsatkichi (106c-b): «3 shartdan 1-si tekshirilmoqda» · qulf-yorliq bosqichli
(30-qonun): «① Birinchi shartni tekshiring» → «② Ikkinchi shartni tekshiring» → …

Yakun-qatori:
> ✅ **Ikki xato topildi, bitta shart toza chiqdi. E'londa yo'q gapga ustun ham kerak emas.**

> 🔴 **26/59-qonun tekshiruvi:** M4-D7 TEKSHIRUVi — xabardan qatorni **olib tashlash** (bitta
> o'lchov, bitta harakat); M3-D10 niki — Timeline. Bu yerda o'quvchi **uch xil shartni birma-bir
> yuritadi** va xatoni **topadi** (natijani ekran chizadi: 🎂 chiziladi, ☎️ belgisi almashadi) —
> artefakt-checklist, registrning bo'sh primitivlaridan ✓ Takror YO'Q. ⚠️ GATE S 5-savoli.
> 🔴 **Tekshiruvchi stolidan farqi (59-qonun taqiqi):** u yerda 3 ta MUSTAQIL kartaga ✓/✕ hukm
> berilardi; bu yerda BITTA sxema uch shartdan o'tkaziladi va nuqsonning O'RNI ko'rsatiladi.
> 🔴 **§110 (ishonarli distraktor):** 🎂 tug'ilgan kun — real ilovalar chindan so'raydigan narsa
> (kulgili-bo'sh emas), lekin e'lon uni so'ramagan — darsni o'qiganni mukofotlaydi.
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda) · **106f(c):** SOFT matni sinf
> ish-tartibi — `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **YORDAM ekran boshida TURMAYDI** — faqat birinchi noto'g'ri bosishdan keyin ochiladi.
> 🔴 **Sanoq (22-qonun):** 3 gap · 5 ustun · 3 shart · 2 xato — matn va UI mos.
> 🔴 **Ekran-o'lchovi:** topshiriq (44) + yo'riqnoma (~135) + joriy shart-yorlig'i (~35) +
> javob-qatori (~75) + holat (~30) — proza ≈ **319**; e'lon-gaplari va ustun-nomlari ish
> materiali (9-qonun) ✓

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (kompilyator, JS rejimi)
EKRAN: (sarlavha) Sxemani yozuvga aylantiradigan kod yozamiz.
(mentor) Kutubxona sxemasining to'rt ustuni — bitta yozuvning to'rt maydoni.
Yetishmagan ikkitasini siz yozasiz.
HARAKAT: band yozuv-obyektiga sxemadagi ikki yetishmagan maydonni qo'shadi va
natijada ikkala savol-qatori javob chiqarganini ko'radi.
JAVOB: To'rtala maydon yozuvda bor; «Kim navbatda» va «Qachon bo'shaydi» qatorlari
javob chiqaradi (javobsiz qolmaydi).
RO'YXAT: To'rtala ustun yozuvda bor · Ikkala savol javob chiqardi · Maydon nomlari
sxemadagidek
YULDUZCHA: Ikkinchi yozuv qo'shing — boshqa kitob uchun; ikkala savol unga ham
javob bersin.
YORDAM: Pastdagi ikki qatorga qarang — ular qaysi maydonlarni so'rayapti? O'sha ikki
nomni yozuvga qo'shing, har birining oxiriga vergul qo'ying.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod — s4 sxemasining to'g'ridan-to'g'ri tarjimasi: to'rt ustun ↔ to'rt maydon.
Maydon yozilmagunicha ekranda javob chiqmasligini ochiq ko'rsating — darsning bosh
qoidasi kodda ko'rinadi.
```

> 🔴 **87-qonun (o'tilgan texnik material — `src/App.jsx` `MODULES` bo'yicha tekshirildi):**
> obyekt va maydonlar — M2 + M3-D10 koding pretsedenti (`{ taom: 'somsa', … }`) ·
> `console.log` — M2 · jadval/ustun tushunchasi — m4-01. Topshiriqda shundan tashqari
> hech narsa yo'q. **SQL YO'Q** — sxema qarori JS yozuvida ko'rsatiladi (m4-06 ga tegilmaydi).
> 🔴 **26-qonun (mexanika almashadi):** m4-07 VS Code → **m4-12 kompilyator** — R1 navbati
> muhrlangan, senariy o'zgartirmaydi ✓
> 🔴 **82(a):** sarlavha «…digan **kod** yozamiz» oilasidan ✓ · **82(d):** kod nusxalanmaydi,
> sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»).
> 🔴 **Korpus §77 (YORDAM javobni aytmaydi):** ❌ «Bitta maydondan boshlang: `band_qilgan` —
> qiymatini yozib…» — yechimning yarmi hadya qilinardi. ✅ YORDAM o'quvchini kodning O'ZINI
> o'qishga qaytaradi: javob `console.log` qatorlarida turibdi, uni topish — mashqning o'zi.
> 🔴 **Korpus §112 (yangi nom ko'prigi):** «yozuv» so'zi kod-panel yorlig'ida ham ko'rinsin —
> **«📄 Bitta yozuv»** (m4-01/M4-D2 dagi «jadval qatori» bilan bir narsa ekani shu yerda
> ko'rinadi); mentor pufagi 2 gapdan oshmaydi, shuning uchun ko'prik yorliqda beriladi.
> 🔴 **1-bo'lim palitra-istisnosi (F-0809-05):** kompilyator CodeStrike to'q sariq brendida
> qoladi — indigoga bo'yalmaydi; PM-hissi `task.previewUrl` manzil-qatori orqali.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch ustuningizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan ayting: sxemangizda qaysi uch ustun bor va har biri
odamning qaysi savoliga javob beradi? Avval sherigingizga ayting, keyin bir qatorda yozing.
HARAKAT: (s11) yakuniy testga javob beradi; (s12) juftlikda aytadi va bir qator yozadi;
(s14) 10 ta takrorlash kartasini o'zi tekshiradi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uchdan biri «qaysi savolga javob» deb so'ralganda jim qolsa — s4 dagi
doskani qayta oching va bitta gapdan ustungacha ipni birga o'qing.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha
> «O'zingizni sinab ko'ring.»
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'qiyotgan o'quvchiga «Avval **ovoz chiqarib
> o'zingizga** ayting, keyin bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **106f(b):** yozib bo'lgach mukofot chiqadi — bitta tabrik-gap («Endi siz har ustunga
> "bu qaysi savolga javob?" degan savol bilan qaraydigan bo'ldingiz») + bitta qoida-qatori
> («🎯 Bugungi qoida: ustunni e'lon ochadi»).

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda sxemangiz o'sadi: odamning yangi savolini topib, unga ustun ochasiz va
sxemangizni shartlardan o'tkazasiz. Qancha vaqtingiz bor — o'zingiz tanlang.
HARAKAT: To'rtinchi ustunni ochadi (nom + belgi + savol) va o'z sxemasini uch shartdan
o'tkazadi.
JAVOB: —
RO'YXAT: To'rtinchi ustun ochilgan · Nomi, belgisi va savoli yozilgan · Uch shart
sxemada yuritilgan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Sxemangizni uch shartdan o'tkazing — shartga mos kelmagan ustun
bo'lsa, belgilab qo'ying.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa.
Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; **yakun-ekranda AYNAN shu
> takrorlanadi**.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «to'rtinchi
> ustun» sanog'i faqat To'liq-kartada turadi. ❌ «yana **bitta** savolini topasiz» ham son edi:
> «Qisqa»ni tanlagan bola tepada bitta ish, kartada boshqa ish ko'rardi → ✅ «**yangi** savolini
> topib».
> 🔴 **Namunasiz harakat taqiqi:** vazifadagi har ish darsda KO'RSATILGAN — ustun ochish s4
> va s8-YULDUZCHA da, savol yozish s8 da, shartlardan o'tkazish s9 da qilingan.
> 🔴 **73-qonun:** kelasi darsga havola faqat MUDDAT bandida; boshqa ekranlarda va'da-qatori YO'Q.

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
MAVZU: Sxema — ustunlar ro'yxati; ilova faqat yozilganini biladi; ustunni e'lon ochadi;
gapga ulanmagan ustun olib tashlanadi; ustun belgisi (ochiq/yopiq) gapdan keladi;
e'lon koddan oldin yoziladi (Amazon voqeasi); yozuvda yo'q maydon javobsiz qoladi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas, bitta
> xato-sinf) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) ·
> korpus **§99–118** (distraktor ekranda/hayotda rost emas · mutlaq-so'z ≤1/savol · savol
> rostni rad ettirmasin · savol shaklida javob). Variant uzunliklari teng (tell ≤1.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 🗂 Ilova kitobni kim band qilganini ko'rsatishi uchun nima kerak? *(9 so'z)*
- **A.** Sxemada bu ma'lumot uchun ustun bo'lishi ✅ *(40)*
- B. Kutubxonachining bu o'quvchini tanishi *(37)*
- C. Kitobning javonda turgan bo'lishi *(33)*

**Reveal:** To'g'ri — ilova faqat sxemaga yozilganini biladi: ustun bo'lmasa, bu ma'lumot ham yo'q.

> 🔴 **§106 (test slayddan ko'chirilmasin) — savol QAYTA YOZILDI.** ❌ Eski savol «Ilova qaysi
> ma'lumotni ekranga chiqara oladi?» + javob «Sxemadagi ustunga yozib qo'yilganini» s2 ning
> xulosa-kartasini («Ilova faqat sxemaga yozilganini biladi» · «Ilova buni eslab qoladi —
> istalgan payt **ekranga chiqara oladi**») deyarli so'zma-so'z takrorlardi: bola o'ylamay,
> ustidagi ekrandan **ko'chirib** javob berardi. ✅ Yangi savol o'sha ta'rifni HOOK sahnasiga
> qo'llashni so'raydi — javob esda qolgan gapdan emas, xulosadan chiqadi.
> 🔴 **Korpus §99:** uchala variant ham «…shi» — «nima kerak?» savoliga shart bo'lib ulanadi.
> **§64 (bitta xato-sinf):** B/C — «javob ilovadan tashqarida» sinfi. **§102:** hech biri dars
> ekranida rost bo'lib chiqmaydi (hookda kutubxonachi aynan **bilmaydi**). **§110:** mutlaq
> so'z 0; B/C ishonarli — bola ularni dars bilimisiz chiqarib tashlay olmaydi.
> Uzunlik: 40 · 37 · 33 (tell 1.21 ✓).
> 🔴 **Spoyler:** savol s4 ning TAYYOR ustuniga (🧑) tegadi, kashfiyotiga (📅) emas ✓

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🧵 Sxemaga yangi ustun qachon qo'shiladi? *(6 so'z)*
- A. Dasturchiga kerak bo'lib tuyulganda *(30)*
- **B.** E'londagi gap ustunsiz qolganda ✅ *(31)*
- C. Kutubxonachi qo'shishni so'raganda *(32)*

**Reveal:** To'g'ri — ustunni e'lon ochadi: gap ustunsiz qolsa, ustun qo'shiladi.

> 🔴 **§110 (kulgili-bo'sh variant almashtirildi):** ❌ «Jadvalda joy ortib qolganda» — darsni
> o'qimagan bola ham kulib chiqarib tashlaydi, ya'ni test uch emas, ikki variantli bo'lib
> qolardi. ✅ «Kutubxonachi qo'shishni so'raganda» — hayotda **bo'ladigan** gap (xodim so'raydi),
> lekin dars uni ochiq rad etadi: ustunni xohish emas, e'lon ochadi. Darsni o'qiganni
> mukofotlaydi.
> 🔴 **§99:** uchala variant «…ganda» — vaqt-sharti. **§64:** A/C — «e'longa qaramaydigan
> xohish» sinfi (bitta xato-sinf). **§106:** s4 ning 4-ip javob-qatori endi «ustunsiz» so'zini
> ishlatmaydi (faktni aytadi) — B ni bola O'ZI chiqaradi, formula reveal'da muhrlanadi.
> **§108:** bola o'zi rost bilgan narsani rad etmaydi. Uzunlik: 30 · 31 · 32 (tell 1.07 ✓).

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 🧾 Amazon jamoasi kodni qachon yoza boshlaydi? *(7 so'z)*
- A. G'oya aytilgan kunning o'zidayoq *(31)*
- B. Dizayn tayyor bo'lgandan keyin *(29)*
- **C.** E'lon odamlarni qiziqtirgandan keyin ✅ *(35)*

**Reveal:** To'g'ri — avval e'lon odamlarni qiziqtiradi, kod undan keyin yoziladi.

> 🔴 **§106:** bashorat-2 «e'lon qiziqtirmasa nima bo'ladi?» ni so'ragan edi — bu savol esa
> KOD qachon boshlanishini so'raydi: slayddan ko'chirib bo'lmaydi, xulosa chiqariladi.
> **§64:** A/B — «boshqa ish birinchi» sinfi. **§101 (keys-sadoqati):** uchala variant ham
> bankdagi voqea doirasida — yangi fakt qo'shilmagan (A/B faqat rad etiladigan taxmin, da'vo
> emas). **§110:** B dan «to'liq» olib tashlandi — mutlaq so'z distraktorda turmaydi va
> uzunlik ham tekislandi. Uzunlik: 31 · 29 · 35 (tell 1.21 ✓).

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 🗂 Sxemadagi ustun hech qaysi gapga ulanmasa, nima qilinadi? *(9 so'z)*
- A. Ustun bo'sh holida qoldiriladi *(29)*
- **B.** Ustun sxemadan olib tashlanadi ✅ *(30)*
- C. Ustun zaxira uchun saqlab turiladi *(34)*

**Reveal:** To'g'ri — e'londa yo'q gapga ustun ham kerak emas.

> 🔴 **§106 (yakuniy testda eng muhim):** s9 ning 1-shart javob-qatoridan «Bunday ustun
> sxemadan olib tashlanadi» gapi OLIB TASHLANDI — u TEST-4 ning to'g'ri javobi bilan
> so'zma-so'z bir xil edi, ya'ni yakuniy test o'lchamasdan ko'chirtirardi. Endi s9 FAKTni
> aytadi va ustunning chizilib chiqib ketishini ekran KO'RSATADI; qoidani o'quvchi shu testda
> o'zi aytadi. Ekranga bog'liqlik (65-qonun) saqlanadi ✓
> **§64:** A/C — «saqlab qolish bahonasi» sinfi; C («zaxira uchun») bola hayotda ishonadigan
> gap, lekin dars ochiq rad etgan (§110: darsni o'qiganni mukofotlaydi).
> Uzunlik: 29 · 30 · 34 (tell 1.17 ✓).

> 🔴 **To'g'ri indekslar taqsimoti:** A · B · C · B — naqsh yo'q ✓
> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask`.

---

## 5. USTAXONA SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

> «Ustaxona» — senariy-ichi blok nomi; o'quvchi ekranida bu so'z YO'Q (korpus §84 oilasi).

**Qadam-indikator (80a):** havoda uch doira — yozilgani yashil ✓, joriysi indigo-pulsda,
kelgusi kulrang-punktir; oradagi chiziq yashillanib boradi.

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida:
**ustun nomi** (o'zgarmas — kirish-artefaktdagi `maydon`) + **belgi** (o'zgarmas — `ruxsat`
qiymati: 👁 yoki 🔒) + **savol maydoni** (yoziladi).

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI (chalg'itmasin) — faqat indikator chirog'i
yonadi; uchtasi ham tayyor bo'lgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda).

**Placeholder (92c/85/106d-d):** `«Odam nimani bilmoqchi?»` — qisqa savol, tayyor javob
maydonda TURMAYDI, namuna-tugmalari YO'Q.

**Tugma (80b + korpus §93):** «✓ Saqlash» matni **o'zgarmas**; faol bo'lmasa yonida nima
yetishmayotgani so'z bilan: «savol yozilmagan». Sanoq faqat ekran tepasida: «3 tadan 2 tasi
tayyor».

**Artefakt-yozuvi (3-saqlashda):** `pm-m4d12-sxema = { ustunlar: [ { nom, savol, kim } × 3 ],
savedAt }` — `kim` ga kirish-artefaktdagi `ruxsat` qiymati o'zgarishsiz ko'chadi.

🔴 **Bir ish — bir ekran (92a):** o'quvchi bu ekranda faqat YOZADI (savol); belgi va nom
tayyor keladi — ular M4-D7 ning qarori, bu darsda qayta so'ralmaydi (takror-qaror emas,
zanjir-halqasi).

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K16 · 91b/33/42/43/56 + 17-ov-band)

**Freym (91b):** eyebrow — **«📦 Biznes olamidan mashhur voqea»**, K-kodi ekranga chiqmaydi.

🔴 **Bosqich-hisoblagich uzluksiz (17-ov-band):** ekranda «N/6» ko'rinib turadi va **bashorat
bosqichlarida ham** sanaydi (2/6 va 4/6) — sanoq uzilmaydi.

🔴 **2 mikro-bashorat — IKKI XIL o'lchovda (17-ov-band):** 1-bashorat **qaysi ishdan
boshlanadi** (ish-turi) · 2-bashorat **mahsulot taqdiri** (to'liq → qisman → yo'q zinapoyasi).

**6 bosqich (hikoya tilida — 42-qonun · ovoz chiqarib o'qib tekshirildi):**

1. **Amazon — juda katta internet-magazin.** Yangi mahsulotni ular boshqacha yo'l bilan boshlaydi.
2. *(bashorat-1)* **Sizningcha, Amazon'da yangi mahsulot qaysi ishdan boshlanadi?**
3. **Jamoa mahsulot allaqachon chiqqandek e'lon yozadi:** u odamga nima beradi, nimasi yangi.
   Bunday matnni matbuot e'loni (press-reliz) deyishadi. Kod hali yo'q.
4. *(bashorat-2)* **E'lon hech kimni qiziqtirmasa, nima bo'ladi?**
5. **E'lon hech kimni qiziqtirmasa — mahsulot qurilmaydi.** E'lon koddan oldin yoziladi —
   nimani qurishni o'sha hal qiladi.
6. **Amazon ham birdan hamma narsani sotmagan:** 1995-yilda u faqat **kitob** sotardi.

**Bashorat-1 (2-bosqich · o'lchov: qaysi ish birinchi):**
- «Kod yozishdan» *(13)*
- «Dizayn chizishdan» *(16)*
- «E'lon yozishdan» ✅ *(14)*

**Bashorat-2 (4-bosqich · o'lchov: mahsulot taqdiri, zinapoya — korpus §43):**
- «Mahsulot baribir quriladi» *(24)*
- «Kichikroq qilib quriladi» *(24)*
- «Umuman qurilmaydi» ✅ *(18)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! E'lon yozishdan» / «🎯 Topdingiz!
Umuman qurilmaydi» — quyruqsiz; adashsa «Adashdingiz — asl javob: e'lon yozishdan» /
«Adashdingiz — asl javob: umuman qurilmaydi». 🔴 «Bu ball emas» izohi YO'Q · hook-echo YO'Q.
Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · keys darsga qaytadi):**
> Darsdagi kutubxona e'loni ham xuddi shu ishni qildi: har gapi sxemaga bitta ustun ochdi.
> Endi shunday sxemani o'zingiz tuzasiz.

> 🔴 **10-qonun (keys-sadoqati — bank bilan solishtirildi):** bankda bor — matbuot e'loni
> koddan oldin yoziladi, «mahsulot chiqqandek» yoziladi, hech kimni qiziqtirmasa mahsulot
> qurilmaydi, 1995 da faqat kitoblar. Shundan tashqari BIRORTA fakt, raqam va sana
> qo'shilmagan ✓ «juda katta» — sifat-baho, raqamsiz ✓
> 🔴 **Bashorat halolligi (17-qonun + §102):** ikkala bashoratda ham distraktorlar bola
> kundalik kuzatuvida tasdiqlay olmaydigan taxminlar — to'g'ri belgilagan bola «Adashdingiz»
> olmaydi, adashgan bola rost gapni yo'qotmaydi ✓
> 🔴 **§43:** bashorat-2 zinapoyasi bitta o'lchovda (to'liq → kichikroq → umuman yo'q) ✓ ·
> bashorat-1 ham bitta o'lchovda (ish-turi), uchalasi bir shaklda («…dan») — bu yerda zinapoya
> emas, **tanlov to'plami**, shuning uchun §43 ning tartib-bandi qo'llanmaydi ✓
> 🔴 **62-qonun:** «press-reliz» faqat shu bosqichda, hodisadan KEYIN qavs-juftlik bilan;
> darsning qolgan hamma joyida «e'lon». 🔴 **6-bosqich:** «hammasidan boshlamagan» iborasi
> mavhum edi («nimadan?») → «birdan hamma narsani sotmagan» — bola ko'z oldiga keltiradi.

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun)

**Darvoza-mashq (82e):** bitta savol darsning O'Z bilimidan: **«Sxemadagi ustun yozuvda
yozilmasa, ekranda nima chiqadi?»** → «Savol javobsiz qoladi» ✅ *(21)* · «Ilova o'zi to'ldirib
qo'yadi» *(27)* · «Ilova ogohlantirish chiqaradi» *(29)*. Qulf-yorlig'i (30/83-qonun):
«🔒 Avval kod-savolini yeching — bosing, ko'rsataman».

> 🔴 **§110:** ❌ «Boshqa ustun ikki marta chiqadi» — kulgili-bo'sh edi, bola bilmasdan ham
> chiqarib tashlardi. ✅ «Ilova ogohlantirish chiqaradi» — ilovalarda chindan bo'ladigan narsa,
> lekin bu yerda ekran uni rad etadi (natija-panelda «—» chiqadi). **§64:** ikkala noto'g'ri
> variant bitta sinfda — «ilova o'zi biror ish qiladi». Uzunlik: 21 · 27 · 29 (tell 1.38 ✓).

**Boshlang'ich kod (JS — kompilyator JS rejimi, M3-D10 pretsedenti):**

```js
// Kutubxona sxemasi — bitta yozuv
var band = {
  kitob_nomi: "Ikki eshik orasi",
  holati: "band",
  // ← qolgan ikki maydonni siz yozasiz
};

console.log("Kim navbatda: " + band.band_qilgan);
console.log("Qachon bo'shaydi: " + band.qaytarish_sanasi);
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda · yorliq ≤5 so'z — ETALON 25):**
1. To'rtala ustun yozuvda bor
2. Ikkala savol javob chiqardi
3. Maydon nomlari sxemadagidek

**YORDAM (yechimni aytmaydi — korpus §77):** Pastdagi ikki qatorga qarang — ular qaysi
maydonlarni so'rayapti? O'sha ikki nomni yozuvga qo'shing, har birining oxiriga vergul qo'ying.

**YULDUZCHA:** Ikkinchi yozuv qo'shing — boshqa kitob uchun; ikkala savol unga ham javob bersin.

> 🔴 **Pedagogik ulanish (87c):** kod — s4 sxemasining to'g'ridan-to'g'ri tarjimasi:
> **4 ustun ↔ 4 maydon** (22-qonun sanoq-mosligi). Tuzatishdan OLDIN ikkala savol-qatori
> javobsiz — «yozilmagan narsa yo'q narsa» qoidasi kodda ko'rinadi.
> 🔴 **Quruvchiga shart:** natija-panelda javobsiz maydon «—» ko'rinishida chiqsin —
> `undefined` so'zi o'quvchi ekraniga CHIQMAYDI (21-qonun: izohsiz chet so'z).
> 🔴 **82(d):** kod NUSXALANMAYDI — «🔒 qo'lda yoziladi», copy/paste bloklangan, sabab ochiq
> aytiladi. **82(b):** mock-panel YO'Q. **82(e):** honor-checklist YO'Q — darvoza yuqoridagi
> bitta kod-savoli.
> 🔴 **Kitob nomi** — maktab adabiyotidan tanish real kitob («Ikki eshik orasi»); o'ylab
> topilgan nom emas, raqam-da'vo ham yo'q.
> 🔴 **Kod izohi javobni bermaydi (§49/§77):** ❌ eski birinchi qator ikki yetishmagan maydon
> nomini ochiq sanardi — o'quvchi o'ylamay ko'chirardi. ✅ Endi izoh yozuvning KIMNIKI ekanini
> aytadi, maydon nomlarini esa o'quvchi pastdagi ikki `console.log` qatoridan o'zi topadi
> (YORDAM aynan shu o'qishga yo'naltiradi).

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Sxema-karta CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo-uchligi s4 ustunlariga KIRMAYDI (spoyler-taqiq) |
| **s12 REFLEKSIYA** | Sarlavha: «Uch ustuningizni yoddan ayta olasizmi?» · juftlik-taymer + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». Yozilgach 106f(b) mukofot-blogi |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal gap; 93-qonun: ta'rif so'zma-so'z): «Ilova faqat sxemaga yozilganini biladi.» · «Sxema — ilova nimani yozib qolishini ko'rsatadigan ustunlar ro'yxati.» · «E'londagi har gap sxemada bitta ustun ochadi.» · «E'lon kod yozilishidan oldin yoziladi.» |
| **s15 · 103-qonun** | 🔴 «Bugungi asosiy fikr —» bitta gap (hero+ScoreRing dan keyin, CodeStrike CTA dan oldin): **«Nimani saqlashni dasturchi emas, oldindan yozilgan e'lon hal qiladi.»** Flashcardga qo'shilmaydi, kalit so'zlar ro'yxati yakunda YO'Q |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; fon-dekor so'zlari (canvas TOK · QZ_BG_SHAPES · HW_TOKENS) shu darsning lug'atidan: `sxema · ustun · e'lon · gap · yozuv` (korpus §114) |

---

## 9. CODESTRIKE — 12 SAVOL (arena · to'g'ri indekslar 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.
> 🔴 **21-qonun:** savol o'zagida ham, variantlarda ham izohsiz chet so'z **0** — «sxema»,
> «ustun», «e'lon», «yozuv», «maydon» so'zlari bilan yoziladi.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | Sxema nima? | s2 |
| 2 | Sxemaga yozilmagan narsani ilova ko'rsata oladimi? | s2 |
| 3 | Yangi ustun qachon ochiladi? | s4 |
| 4 | Ustunning belgisini (ochiq yoki yopiq) nima aytadi? | s4 |
| 5 | Kitob qachon bo'shashini ko'rsatish uchun qaysi ustun kerak edi? | s4 |
| 6 | Hech qaysi gapga ulanmagan ustun nima qilinadi? | s9 |
| 7 | «Faqat kutubxonachi ko'radi» degan gap ustunga qaysi belgini beradi? | s9 |
| 8 | E'lon qachon yoziladi — koddan oldinmi, keyinmi? | s6 |
| 9 | E'lon hech kimni qiziqtirmasa nima bo'ladi? | s6 |
| 10 | Amazon 1995-yilda nima sotardi? | s6 |
| 11 | Ustun savoli nimani aytadi? | s8 |
| 12 | Sxemadagi ustun yozuvda yozilmasa nima chiqadi? | s10 |

> 🔴 **Korpus §107:** ha/yo'q savollarda (2-savol) «ha»/«yo'q» soni variantlarda teng bo'ladi,
> yolg'iz «yo'q» to'g'ri javob bo'lib qolmaydi — quruvchi 4 variantda 2/2 nisbat saqlaydi.
> 🔴 **Korpus §102/§106:** distraktorlar dars ekranida rost bo'lib chiqmaydi va to'g'ri javob
> slayddan so'zma-so'z ko'chirilmaydi — quruvchi har savolni shu ikki grep bilan tekshiradi.
> 🔴 **11-savol qayta yozildi:** ❌ «Ustun savoli **kimning tilida** yoziladi?» — «tilida»
> savoli bolani «o'zbekcha/inglizcha?» degan yo'lga ham olib borardi va to'g'ri javob
> («odam tilida») ballanadigan matnda mavhum qolardi. ✅ «Ustun savoli nimani aytadi?» →
> to'g'ri javob: «Odam bu ustundan nimani bilib olishini» (s8 javob-qatori bilan bir tilda).
> 🔴 **Takror-savol bandi:** 3-savol TEST-2 bilan, 6-savol TEST-4 bilan bir xil so'zlarda
> turmasin — arena o'sha qoidani **boshqa vaziyatda** so'rasin (masalan 3-savol: «To'rtinchi
> gapga ustun topilmadi. Endi nima bo'ladi?»), aks holda bola ikkinchi marta o'ylamaydi.
> 🔴 **10-savol (Amazon 1995):** yagona sana-savoli — distraktorlari ham **kitobdan boshqa
> mahsulot nomlari** bo'lsin (yangi fakt-da'vo emas, faqat rad etiladigan taxmin) ✓

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Thread Master!** | To'rt gapni to'rt ustunga uladingiz | 34 | s4: 4/4 ip ulandi |
| **Schema Maker!** | Uch ustunli sxemangizni tuzdingiz | 33 | s8: 3/3 saqlandi |
| **Rule Keeper!** | Sxemani uch shartdan o'tkazdingiz | 33 | s9: 3/3 shart yopildi |
| **Record Builder!** | Yozuvni sxema bo'yicha to'ldirdingiz | 36 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓ · 4/4 tavsif o'zbekcha siz-formada ✓ · hammasi ≤48 belgi ✓ ·
> hech biri nishon nomini takrorlamaydi (101c) ✓ · «to'g'ri/o'zingiz/to'liq» to'ldiruvchilari
> YO'Q (101d) ✓
> 🔴 **Korpus §100 (texnik omonim):** «Thread» kursning texnik lug'atida yo'q (HTML/JS/React
> darslarida bu so'z o'rgatilmaydi) — «Right Click!» sinfidagi to'qnashuv yo'q ✓
> 🔴 **40-qonun (nishon-halolligi):** to'rttala trigger real harakatga bog'langan;
> `ACHIEVEMENTS` ↔ `ACH_TRIGGERS` xaritasi 4↔4.

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q)

| # | Savol | Javob |
|---|---|---|
| 1 | Sxema nima? | Ilova nimani yozib qolishini ko'rsatadigan ustunlar ro'yxati |
| 2 | Ilova nimani ko'rsata oladi? | Faqat sxemaga yozib qolinganini |
| 3 | Yangi ustun qachon ochiladi? | E'londagi gap ustunsiz qolganda |
| 4 | Hech qaysi gapga ulanmagan ustun nima qilinadi? | Sxemadan olib tashlanadi |
| 5 | E'lon qachon yoziladi? | Kod yozilishidan oldin |
| 6 | E'lon hech kimni qiziqtirmasa nima bo'ladi? | Mahsulot qurilmaydi |
| 7 | Ustunning 👁 yoki 🔒 belgisi nimani aytadi? | Ustunni kim ko'rishini |
| 8 | Ustun savoli qanday yoziladi? | Odam tilida — «odam nimani bilmoqchi?» |
| 9 | Sxemadagi ustun yozuvda yozilmasa nima bo'ladi? | Savol javobsiz qoladi |
| 10 | Amazon 1995-yilda nima sotardi? | Faqat kitob |

> 🔴 **Korpus §24:** har savolda predmet nomlangan — «bu», «shu» bilan boshlanadigan karta YO'Q ✓
> 🔴 **Korpus §90(e):** javob darsda ishlatilgan nom bilan — «ustun», «e'lon», «yozuv», «gap»
> dars bo'ylab shu so'zlar ✓ 1-karta javobi — kanonik ta'rif so'zma-so'z (93-qonun) ✓
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ ·
> darsning har kalit qoidasi kartada bor ✓ (ta'rif · ilova nimani biladi · ustun qachon
> ochiladi · ortiqcha ustun · e'lon vaqti · e'lon kuchi · belgi · savol tili · yozuv · keys).
> 🔴 **Korpus §76:** tarjimasiz chet so'z yo'q — «Amazon» nom, atama emas; javoblar bir
> turkumda (hammasi gap/ot-birikma, yolg'iz fe'l yo'q) ✓

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Ilova faqat yozilganini biladi»** — (1) sxema ta'rifi · (2) nega yozilmagani yo'q
hisoblanadi · (3) sinfga savol
**s5 · «Ustunni e'lon ochadi»** — (1) gap ustunsiz qolsa ustun qo'shiladi · (2) belgi ham
gapdan keladi · (3) savol
**s7 · «Avval e'lon, keyin kod»** — (1) Amazon xulosasi · (2) e'lon qiziqtirmasa mahsulot
qurilmaydi · (3) savol
**s11 · «Sxema shartlardan o'tadi»** — (1) har ustunni gap so'ragan bo'ladi · (2) yopiq
ma'lumot belgilanadi · (3) savol

> 🔴 **43-qonun (belgi-formula taqiqi):** karta sarlavhalarida matematik va strelka belgilari
> YO'Q — to'rttala sarlavha to'liq gap yoki gap-bo'lagi.
> 🔴 **K-kod ekranga oqmaydi:** s7 kartasida K-kodi yo'q, voqea Amazon nomi bilan ataladi.
> 🔴 **34-qonun:** RECAPS kartalari aynan o'z teoriyasini qayta tushuntiradi, yangi ta'rif
> kiritmaydi.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K16** — M4 modulida ishlatilmagan ✓
6. TEKSHIRUV mexanikasi oldingi darsni (xabardan qator olib tashlash) takrorlamaydi ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): kutubxona — s0 dan s15 gacha; keys 91b freymi bilan kiradi va ko'prik
  bilan qaytadi ✓
- 95 (Toshkent o'smiri): maktab kutubxonasi — o'quvchi o'zi boradigan joy ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas ✓
- 23 (imzo-vizual yangi): «SXEMA-TO'QISH» — band ro'yxatning hech biri emas ✓
- 26 (koding mexanikasi almashadi): m4-07 VS Code → **m4-12 kompilyator** (R1 navbati) ✓
- 87 (o'tilgan material): obyekt/`console.log` (M2, M3-D10 pretsedenti) · jadval/ustun (m4-01) ✓
  · SQL sintaksisi YO'Q ✓
- 29 (kelajak-atama): «PRD» o'quvchi matnida **0** (m6-02 niki) ✓
- 47: `?</h2>` interaktiv ekranlarda (s4·s8·s9·s10) **0** ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104: hook ikki tanlovi teng sonli, teng uzunlikda, bir xil payoff ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda ≤1); keys-bashorati har bosqichda bittadan ✓
- 103: yakun bitta gap bilan yopiladi ✓
- **17-ov-band (keys-ekran):** 2 bashorat IKKI XIL o'lchovda + hisoblagich uzluksiz ✓

**Til-darvozalari (`MATN_ETALONI` + `til-lint-rules.json`):**

**(a) Umumiy taqiq-so'zlar:** ro'yxat bu yerda takrorlanmaydi — manba bitta,
`til-lint-rules.json` (M4-D2 tartibi: taqiq-so'zning o'zi senariyga yozilmaydi).
`npm run lint:til pm-senariylar/M4-D12-Sxema.md` va qurilgandan keyin
`npm run lint:til src/4-Modull/PmLesson13.jsx` → ikkalasida **0 error** shart.

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M4-D12 ga tegishli):
`PRD` (29-qonun — m6-02 atamasi) · `artefakt` · `stakeholder` · `feature` (14-qonun) ·
`press-reliz` (faqat s6 3-bosqichida 1 marta, boshqa joyda 0) · `SELECT` / `CREATE` /
`INSERT` (SQL bu darsda yo'q) · `undefined` (o'quvchi ekranida 0 — natija-panelda «—») ·
🔴 **`sayt`** (§80 — demo-olam faqat «ilova»; o'quvchi matnida 0) · `ilovangiz` /
`ishingiz` (§40 — «sxemangiz» va «uch qatoringiz» qoladi) ·
`ko'pchilik` · `ovozlar` · `hammamiz` (§97 — yakka rejim) ·
`ma'lumotlar bazasi arxitekturasi` (og'ir birikma) · kirill harflar · qiyshiq apostrof.

**(c) Sanoq-mosligi (22-qonun):** 4 e'lon-gap / 3+1 ustun (s4) · 3 ustun (s1 demo, s8,
chiqish-artefakt, uy-vazifa) · 6 keys-bosqich / 2 bashorat (s6) · 3 gap / 5 ustun / 3 shart /
2 xato (s9) · 4 maydon / 2 savol-qatori (s10) · 12 arena · 10 flashcard · 4 nishon ·
4 «Endi siz bilasiz» — hammasi matn bilan mos ✓

**(d) 93-qonun (ta'rif so'zma-so'z bir xil):** «Sxema — ilova nimani yozib qolishini
ko'rsatadigan ustunlar ro'yxati» shakli s2 · flashcard-1 · s15 da bir xil ✓

**(e) 21-qonun (scored gloss):** to'rt testda ham, 12 arena savolida ham izohsiz chet so'z
**0** ✓

**(f) 17-qonun + korpus §99–118 (test-halolligi oilasi):** to'rt test + 2 bashorat + s9 uch
sharti + s10 darvoza-mashqi shu qoidalar bilan qayta ko'rildi — har distraktor ekran va
kundalik kuzatuv bilan solishtirildi (§102), mutlaq so'z 0 (§110), savol-yo'nalishi rostni
rad ettirmaydi (§108), variantlar savol shaklida (§99), cheklov-so'z bilan halollangan savol
yo'q (§118) ✓ · **§106:** hech bir to'g'ri javob oldingi ekranda so'zma-so'z turmaydi
(TEST-1 qayta yozildi, TEST-2/TEST-4 uchun s4 va s9 javob-qatorlari faktga o'girildi) ✓

**(g) Kaskad-fe'l (korpus §103/§80):** «Ustunni e'lon ochadi» — s4 yakuni · TEST-2 reveal ·
RECAPS s5 sarlavhasi · mukofot-qatori · arena MAVZU — bitta fe'l, bitta shakl ✓

**(h) Bir tushuncha — bir nom (korpus §80):** demo-olam **«ilova»** (sayt = 0) · ilova
bajaradigan vazifa **«ish»** (o'quvchining loyihasi hech qachon «ish» emas) · yozuv/maydon
juftligi m4-01 va M4-D2 dan · 👁 ochiq / 🔒 yopiq M4-D7 dan o'zgarishsiz ✓

---

## 14. ⏳ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq savollar)

> 🔴 Senariy qurishga o'tishdan OLDIN shu 6 savol yopiladi.

| # | Savol | Taklifim |
|---|---|---|
| 1 | 🔴 **Dars kartasi (`App.jsx` `m4-12`).** Hozirgi title: «Sxema — PRD artefakti» · sub: «baza sxemasi mahsulot hujjatining qismi». «PRD» — m6-02 ning bosh atamasi (29-qonun), «artefakt» — ichki jargon (14-qonun) | title → «**Ilova nimani yozib qoladi?**» · sub → «**sxema — ustunlar ro'yxatini e'lon belgilaydi**» |
| 2 | 🔴 **«E'lon» atama-tanlovi.** «PRD» butun darsda ishlatilmaydi; o'rnida K16 dan o'sadigan «e'lon» (matbuot e'loni → e'lon). PRD atamasining o'zi m6-02 da ochiladi va o'sha dars «siz M4 da yozgan e'lon aslida PRD ning bir bo'lagi edi» deb bog'laydi | ✅ Tasdiqlansin — aks holda dars izohsiz qisqartmaga suyanadi |
| 3 | 🟡 **Chiqish-artefakt shakli.** `pm-m4d12-sxema = { ustunlar: [ { nom, savol, kim } × 3 ], savedAt }` — `kim` ga M4-D7 `ruxsat` qiymati o'zgarishsiz ko'chadi. M4-D15 (arxitektura pitchi) shu uchlikni baza-qavati qilib o'qiydi | ✅ Tasdiqlansin — m4-15 senariysi shu shaklga qarab yoziladi |
| 4 | 🟡 **Kirish-shartnoma (hisobot).** Qurilgan `PmLesson12.jsx` tekshirildi: `OUT_KEY = 'pm-m4d7-ishonch'`, payload `{ qatorlar: [ { maydon, ruxsat, sabab } × 3 ], savedAt }` — senariy aynan shu shaklni o'qiydi; zaxira yo'l kutubxona uchligi bilan (korpus §69) | ✅ Ma'lumot uchun — qo'shimcha qaror talab qilmaydi |
| 5 | 🟡 **s9 mexanika-yaqinligi.** 1-shart xatosi ustunning chizilishi bilan tugaydi — M4-D7 dagi «qator olib tashlash»ga uzoqdan o'xshaydi. Farq: u yerda bitta o'lchov + olib tashlash HARAKATI; bu yerda uch shart + xatoni TOPISH (natijani ekran chizadi) | ✅ Farq yetarli deb hisoblayman. Shubha bo'lsa muqobil: 1-shart xato-ustuni chizilmaydi, «e'lonsiz» tamg'a oladi |
| 6 | 🟡 **Registrni yangilash.** `PM_KEYS_MEXANIKA_REGISTRI.md` 5-bo'limiga qator: imzo-vizual **«SXEMA-TO'QISH»** (ustun-bog'lash doskasi) · TEKSHIRUV **«sxema-shart tekshiruvi»** (artefakt-checklist) · olam **📚 maktab kutubxonasi** · keys **K16**. 6-bo'limga: `pm-m4d7-ishonch` → `pm-m4d12-sxema` → m4-15 | ✅ GATE S yopilgach darhol |

---

*Senariy `PM_Prompt_v8` (9 blok · 13 maydon) · `PM_DARS_ETALON` (1–109 + havolalar) ·
`MATN_KORPUS` (§0–§118, test-halolligi oilasi boshidan qo'llandi) · `MATN_ETALONI`
(lug'at + siz-forma) · `PM_KEYS_MEXANIKA_REGISTRI` (R1/R2/R3 pasporti) bo'yicha yozildi.*

---

### ✍️ SENARIY-KORREKTURA raundi (pm-metodist · 2026-08-14 · F-0814-02)

**Halollik-tuzatishlari (17-qonun + korpus §102/§106/§110):**
1. **s0 hook** — ikki tanlov qayta yozildi: eski juftlikda 2-tanlov («kim band qilganini ham»)
   payoff bilan jimgina yolg'onga chiqardi, ya'ni «to'g'ri javob yo'q» degani rost emasdi.
   Endi ikkala tanlovda ham «kim band qilgani» yo'q — payoff ikkalasiga bir xil yangilik.
2. **TEST-1** — savol butunlay qayta yozildi: eskisi s2 xulosa-kartasini so'zma-so'z
   ko'chirtirardi (§106).
3. **TEST-4 / s9** — 1-shart javob-qatoridan «Bunday ustun sxemadan olib tashlanadi» olindi
   (yakuniy testning to'g'ri javobi bilan aynan bir xil edi); qoida endi testda tug'iladi.
4. **TEST-2 / s4** — 4-ip javob-qatori «ustunsiz» so'zisiz faktga o'girildi; distraktor
   «Jadvalda joy ortib qolganda» (kulgili-bo'sh) → «Kutubxonachi qo'shishni so'raganda».
5. **s9 2-shart** — e'lonning 1-gapiga «navbat ro'yxatini hamma ko'radi» qo'shildi: usiz
   🧑 ustuni ham 🔒 deb himoyalanardi (s4 pretsedenti) — ikki javobli shart edi.
6. **TEST-3** — «Dizayn **to'liq** chizilgandan keyin» → «Dizayn tayyor bo'lgandan keyin»
   (§110 mutlaq so'z + uzunlik balansi).
7. **s10 darvoza-mashqi** — «Boshqa ustun ikki marta chiqadi» (kulgili-bo'sh) →
   «Ilova ogohlantirish chiqaradi»; YORDAM va kod-izohi endi javobni bermaydi (§77/§49).

**Til va nom-tuzatishlari:**
8. **§80:** «sayt/ilova» ikki nomi bitta narsaga ishlatilgan edi → butun dars **«ilova»**
   (M4 zanjiri va kanonik ta'rif bilan bir xil); **«ish»** endi faqat ilovaning vazifasi.
9. **§39/§104:** «e'lon» atamasi s4 mentorida hodisadan tug'iladi (nom oldinda emas).
10. **§40:** s8 da «sxemangiz» olib tashlandi (sxema hali yo'q); s1/s6 dan «o'z ishingiz».
11. **§69/ETALON 32:** s8 ikki tarmoq ham bitta gap, bir uzunlikda; mentor topshiriqni
    takrorlamaydi.
12. **§96:** uy-vazifa kirish-matnidan son olindi («yana bitta» → «yangi»).
13. **§116:** s8 YORDAMi endi uchala ustunga ham ishlaydi («birinchi nimani qidiradi?» faqat
    1-ustunga to'g'ri kelardi) · s9 2-shart ipuchasi qoida-savoliga o'girildi.
14. Mayda: «ro'yxat qilib chiziladi» → «ro'yxat qilinadi» · «Gap … dedi» → «Buni faqat
    kutubxonachi ko'radi» · «nuqson/sof chiqdi» → «xato/toza chiqdi» · «hammasidan
    boshlamagan» → «birdan hamma narsani sotmagan» · «boshqa savolni oling» → «boshqa savol
    yozing» · arena 11-savoli.

**Darvoza:** `npm run lint:til pm-senariylar/M4-D12-Sxema.md` → **0 error** (7 warn — hammasi
senariy-ichi izohlarda: `zanjir`, blok-nomi, o'z-tekshiruv qatori).

*Keyingi qadam: **[GATE S]** — foydalanuvchi 6 savolni yopadi.*

---

## ✅ [AVTO-GATE S] YOPILDI — 2026-08-14 (foydalanuvchi avtokontrol-ruxsati asosida, bosh-agent)

1. **App.jsx karta:** «Sxema — PRD artefakti» → **«Ilova nimani yozib qoladi?»** · sub
   «e'londan sxemagacha — uch ustun» (29-qonun; qurilish paytida bosh-agent kiritadi).
2. **«E'lon» atamasi TASDIQ** — PRD o'quvchi matnida 0 (m6-02 ga saqlangan), kaskad izchil,
   §104-tug'ilish metodist tomonidan tuzatilgan.
3. **Chiqish-artefakt TASDIQ:** `pm-m4d12-sxema = { ustunlar: [{nom, savol, kim}×3], savedAt }`
   — m4-15 faqat `nom` ni o'qiydi.
4. Kirish-shartnoma qayd etildi (qaror talab qilmadi).
5. **TEKSHIRUV TASDIQ** — «sxema-shart tekshiruvi», M4-D7 farqi hujjatlangan.
6. Registr yangilanadi (bosh-agent).
