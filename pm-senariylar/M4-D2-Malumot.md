# M4-D2 — Ilova nimani eslab qolsin? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/4-Modull/PmLesson11.jsx` (hozirgi `-v16` avlod dars BUTUNLAY almashadi;
> yangi `lessonId: pm-m4d2-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 4 — «Backend» (Node/Express/PostgreSQL) |
| **Dars** | M4-D2 (modulning 2-darsi) · `key: m4-02` |
| **Mavzu** | Ma'lumot ham mahsulot qarori — nimani saqlaymiz va nega |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z maydonlarini **yozadi**; artefakt = matn, keyingi darsga o'tadi (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | **K6 · NETFLIX** (temalar: *ma'lumot qaror qiladi · ma'lumot-sxemasi · analitika*) — mavzuga aynan mos |
| **ISHLATILGAN_KEYS** | K6 · 🔴 modul-ichi qoidasi (registr 4-bo'lim, 2026-08-13 qarori): 4-Modulda birinchi keys — takror YO'Q ✓ |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | **M3-D10** → «Timeline — qabul qadamlarini tartibga solish» · **M3-D14** → «**Hotspot**» (2026-08-13 da m3-14 ga muhrlandi — parallel yozilgan senariy bilan to'qnashuv). m3-14 → m4-02 o'quvchi yo'lida **ketma-ket** PM darslar, shuning uchun 26/59-qonun bo'yicha **ikkalasi ham takrorlanmaydi** |
| **Band mexanikalar (TAQIQ)** | **Hotspot (M3-D14)** · Timeline (M3-D10) · MatchPairs (M7-D2, M8-D1) · kartani boshqa katakka ko'chirish (M3-D5) · klinika (M3-D2) · tekshiruvchi stoli · story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli foyda-vaqt doskasi · «ISHGA TUSHIRIB KO'RISH» soxta formasi · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · 3 hikoya ekrani · `hikoyaYasa` kompilyatori |
| **Misol-ip (91/108 + 95 + 96c)** | 🎧 **Musiqa ilovasi** — har kuni tinglanadigan qo'shiqlar va ular yig'iladigan bo'limlar. 95-qonun: o'smir buni har kuni O'ZI ochadi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · kitob do'koni — **musiqa ilovasi band emas** ✓. Grep-dalili: `pleylist` faqat `DataIntroLesson` lug'at-qatorida (`playlists — to'plamlar`), `musiqa` esa `PmLesson4` da «baland fon musiqasi» ma'nosida — ikkalasi ham boshqa hodisa, bosh-misol EMAS. ⚠️ Yagona yaqinlik: `m4-03 DbSqlNosqlLesson` qadoqxona metaforasida bitta 🎵 «musiqa» kartasi bor — u dars-olami emas, bitta namuna-karta; to'qnashuv darajasiga yetmaydi |
| **Kirish-artefakt** | 🔴 **YO'Q.** Bu modul ochilish darsi — o'quvchi oldingi moduldan 2–3 oy oralab keladi. Oldingi artefaktga bog'lanmaydi, «topilmadi/saqlanmagan» tarmog'i ham YOZILMAYDI (korpus §69) |
| **Chiqish-artefakt** | 🔴 `pm-m4d2-data` = `{ qatorlar: [ {maydon, bolim} × 3 ], savedAt }` — **M4-D7** (xavfsizlik) shu uch qatorni oladi va «qaysi biri sizib ketsa qimmatga tushadi?» deb so'raydi |
| **Yordamchi kalitlar** | `pm-m4d2-hook-choice` (faqat YOZILADI — 100c) · `pm-m4d2-switches` (s4 holati) · `pm-m4d2-code` · `pm-m4d2-reflection` · `pm-m4d2-hw-target` · `ccProgress` |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D10 da tasdiqlangan yakun-tuzilmasi bilan bir xil |

**Atama-glosslar (62/39-qonun + korpus §20 — avval hodisa, keyin nom):**

- 🔴 **«Ma'lumotlar bazasi sxemasi» ekranga CHIQMAYDI** (korpus §20: markaziy atama bo'lsa qavs-gloss yetmaydi — o'zbekcha ibora atamaning O'RNINI oladi). Dars bo'ylab markaziy ibora — **«ilova nimani eslab qoladi»**, qisqartirilganda **«nimani saqlaymiz»**;
- 🔴 **«maydon» — darsning yagona nomi** (korpus §80/§85: bir tushuncha — bir nom). Ta'rifi dars bo'ylab AYNAN bir xil turadi: **«ilova har tinglash haqida yozib qo'yadigan bitta narsa»**. Shu ta'rif s2 · flashcard · RECAPS · yakun-ro'yxatida so'zma-so'z takrorlanadi;
- 🔴 **«ustun» — butun darsda AYNAN BIR MARTA**, s2 mentor gapida, m4-01 ga orqaga-havola sifatida (korpus §59: o'quvchi KO'RGAN so'z bilan; m4-01 da «ustun» 87 marta, «maydon» 11 marta). Boshqa hech qayerda ishlatilmaydi — aks holda bir narsa ikki nom oladi. 🔴 **Quruvchiga ogohlantirish:** s9 da jadval ekranda ko'rinadi va uning sarlavha-qatori «ustun» deyishga chorlaydi — **deyilmaydi**: jadval sarlavhalari s4 dagi uch **maydon** nomining o'zi (🎵 Qaysi qo'shiq · ⏰ Qachon · ☑️ Oxirigacha), ya'ni ustun = maydon ekani so'zsiz ko'rinadi. ⚠️ GATE S qarori — 14-bo'lim 5-bandiga qarang;
- 🔴 **«qator» O'QUVCHI MATNIDA ARTEFAKT NOMI SIFATIDA ISHLATILMAYDI** (metodist topilmasi, 2026-08-13). Dalil: o'tgan dars — `m4-01 DataIntroLesson` — aynan shuni o'rgatadi: «**Qator = bitta yozuv**», «Bitta qator — bitta to'liq post», «**Ustun = bitta maydon**», «Jadval — qatorlar (yozuvlar) va ustunlar (maydonlar) to'ri». Ya'ni o'quvchi uchun «qator» = **jadvaldagi yozuv**. M4-D2 esa s9 da EKRANDA jadval ko'rsatadi va shu payt o'quvchining o'z ishini ham «uch qatoringiz» desa — bir ekranda ikki xil «qator» paydo bo'ladi. Shuning uchun: o'quvchi YOZGAN narsa — **«uch maydon»** (har biriga bitta bo'lim); jadvaldagi yozuvlar — **«yozuv»** (m4-01 ning o'z so'zi); «qator» esa faqat kundalik ma'noda qoladi («birinchi qatorda turadi»). ⚠️ Bu artefakt kalitiga ham tegadi — 14-bo'lim 10-bandiga qarang;
- 🔴 **«maydon» — o'quvchi ekranida FAQAT ma'lumot ma'nosida.** Yozish-kartasidagi ikki kirish-katagi hech qachon «maydon 1 / maydon 2» deb yorliqlanmaydi — ularning yorlig'i savolning o'zi («Nimani saqlaymiz?» · «Qaysi bo'lim quriladi?»). Senariyda «ikki maydon» deyilgan joylar — quruvchiga aytilgan gap, ekran yorlig'i emas;
- 🔴 **«bo'lim»** — ilovadagi ko'rinadigan qism («Yaqinda tinglaganlaringiz»). Bu dars ikki so'z ustida turadi: **maydon** (saqlanadi) → **bo'lim** (ko'rinadi). Uchinchi nom kiritilmaydi — «qism», «oyna», «panel», «joy» so'zlari bu ma'noda **0** marta ishlatiladi (`MATN_ETALONI` lug'at 178-qatori: bir tushuncha — bir nom). ⚠️ Lug'atning o'sha qatori «dastur bo'lagi» uchun «panel» ni tavsiya qiladi, lekin u **VS Code interfeysi** hukmi (F-0810-01) — musiqa ilovasining kontent-qatori uchun «bo'lim» tabiiyroq. GATE S 5-bandiga qarang;
- ❌ **«metrika» ISHLATILMAYDI** — u M8-D1 ning bosh atamasi (29-qonun: kelajak-dars atamasi joriy darsga oqmaydi). ⚠️ `App.jsx` sub-sarlavhasida hozir turibdi — 14-bo'lim 4-bandiga qarang;
- ❌ **«SQL», «NoSQL», «PostgreSQL» ISHLATILMAYDI** — ular m4-03 va m4-06 niki (29-qonun). Bu PM darsi: SQL sintaksisi O'RGATILMAYDI, faqat **qaror** o'rgatiladi;
- ❌ «data», «user», «field», «retention» — kalka, ishlatilmaydi: **ma'lumot · foydalanuvchi · maydon · qaytib kelish**.

🔴 **§40 darvozasi (o'quvchida hali YO'Q narsa uniki qilib aytilmaydi):** o'quvchida musiqa ilovasi YO'Q — shuning uchun dars bo'ylab **«musiqa ilovasi» / «ilova»**, hech qachon «ilovangiz». O'quvchiniki bo'ladigan yagona narsa — u YOZGAN uch qator («uch qatoringiz»).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «XOTIRA TUGMALARI»** (23-qonun: har darsda YANGI — story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · **M3-D10 «ISHGA TUSHIRIB KO'RISH» formasi** klonlanmaydi).

Ekran ikkiga bo'linadi. **Chapda** — beshta tugma, har biri ilova eslab qolishi mumkin bo'lgan bitta narsa. **O'ngda** — musiqa ilovasining ekrani (telefon ko'rinishida). Boshida **beshala tugma ham o'chiq**, ilova ekrani deyarli bo'sh.

O'quvchi tugmani yoqadi — ilova ekranida **bo'lim o'sib chiqadi**. O'chiradi — bo'lim **so'nib yo'qoladi**.

| Tugma (ilova nimani eslab qoladi) | Yoqilganda ilova ekranida | Yonidagi qator |
|---|---|---|
| 🎵 Qaysi qo'shiq tinglandi | «Yaqinda tinglaganlaringiz» bo'limi o'sib chiqadi | ✅ Bu bo'lim qo'shiq nomlaridan quriladi |
| ⏰ Qachon tinglandi | «Kechqurun tinglaganlaringiz» bo'limi o'sib chiqadi | ✅ Bu bo'lim tinglash vaqtidan quriladi |
| ☑️ Qo'shiq oxirigacha tinglandimi | «Sizga yoqadi» bo'limi o'sib chiqadi | ✅ Bu bo'lim oxirigacha tinglanganidan quriladi |
| 📍 Qayerda tinglandi | Ilova ekrani o'zgarmaydi | ⬜ Saqlandi, lekin bitta ham bo'lim ochilmadi |
| 📇 Telefondagi kontaktlar | Ilova ekrani o'zgarmaydi | ⬜ Saqlandi, lekin bitta ham bo'lim ochilmadi |

🔴 **Rang-qonuni (23-qonun · palitra-pasporti):** tugmani o'chirish — **XATO EMAS**, shuning uchun `err/errSoft` (qizil) bu ekranda umuman ishlatilmaydi. O'chiq holat — kulrang-xira; yoqilgan holat — indigo; bo'lim o'sishi — `success`.

🔴 **Matn-qonuni (korpus §69 — yo'qlik haqida gapirilmaydi):** bo'lim yo'qolganda qator «yo'qoldi / saqlanmagan / topilmadi» demaydi — u bo'limning **nimadan qurilishini** aytadi. Yo'qolishning O'ZINI vizual ko'rsatadi, matn esa sababni nomlaydi.

🔴 **Metafora-tekshiruvi (4.1-qonun · korpus §28):** «ilova **eslab qoladi**» — jonsiz narsaga odam-fe'li. Ataylab qoldirildi: o'smir ilova haqida aynan shu so'z bilan gapiradi («ilova eslab qolibdi»), ya'ni bu kalka emas, tirik og'zaki shakl. 🔴 Chegara: bundan **nariga o'tilmaydi** — «ilovaning **miyasi**», «**yuragi**», «o'ylaydi», «biladi» kabi a'zo/aql metaforalari 4.1-taqiq bo'yicha ISHLATILMAYDI. Ekranda faqat ikki fe'l yuradi: **eslab qoladi** (saqlash) va **ko'rsatadi** (chiqarish).

**Nima uchun aynan shu:** «nimani saqlaymiz» degan qarorni o'qib tushunib bo'lmaydi — uning narxi faqat **oqibati ko'ringanda** bilinadi. Bola ma'lumot haqida gapirmaydi, u **tugmani o'chiradi va bo'lim yo'qolishini ko'radi**. Shu lahzada dars qoidasi o'zi ochiladi: saqlamagan narsangni keyin ko'rsata olmaysan. Ikki foydasiz tugma esa qarama-qarshi tomonni o'rgatadi — hamma narsani saqlash ham yechim emas.

🔴 **Mexanika-farqi (26/59-qonun):** M3-D10 da o'quvchi **soxta formani bosib sinardi** (tekshiruv — ish tayyormi?), bu yerda **tugmani yoqib-o'chirib oqibatini ko'radi** (qaror — nimani saqlaymiz?). Ikki xil ish, takror emas.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D10 dagidek — etalon (P0 · PmLesson2 · PmLesson4):
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Ilova buni eslab qolsinmi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch qator o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — ilova ertaga nimani ko'rsata oladi | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **XOTIRA TUGMALARI** (5 tugma) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K6 Netflix (4 slayd + bashorat) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 maydon** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **BO'LIMNI JADVALDAN QURING** | 5 | — | 🔴 jadval-qatorini belgilash (yangi mexanika) |
| s10 | KODING — yoqqan qo'shiqlarni ajratadigan kod | 6 | — | 26/82/87-qonun |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ustaxona» so'zi o'quvchi ekranida YO'Q** (korpus §84 taqiq-oilasi — hunarmandchilik obrazlari o'smir olamida yashamaydi). Bu — senariy-ichi blok nomi; ekranda sarlavha aniq harakatni aytadi.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 4 — Backend: Node, Express, PostgreSQL
DARS: M4-D2 (2-dars)
DARS_MAVZUSI: Ma'lumot ham mahsulot qarori — nimani saqlaymiz va nega
ISHLATILGAN_KEYS: K6
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Bir qo'shiqni takror-takror tinglaysiz — ilova buni eslab qolsinmi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi: ikki strelkali qator — har tanlovning o'z yutug'i va
yo'qotishi bor.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: eslab qolish ham, eslamaslik ham qaror.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkala tomon ham himoyalanadi. «Eslamasin» deganlar
ko'p bo'lsa, bu ham dars: saqlashning narxini bola o'zi sezyapti.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 👍 Eslab qolsin — ertaga o'zi topib bersin | 41 belgi |
| 🙅 Eslamasin — nima tinglaganim o'zimda qolsin | 44 belgi |

**Payoff (ikkala tanlovda ham AYNAN bir xil — korpus §67d strelkali juftlik, proza emas):**

| | |
|---|---|
| Eslab qolsa | → ertaga «yana o'sha qo'shiq» birinchi qatorda turadi |
| Eslamasa | → ertaga o'sha qo'shiqni yana o'zingiz qidirasiz |

Yopuvchi qator: **«Ikkalasida ham yutuq bor, yo'qotish ham bor. Shu qarorni bugun siz qabul qilasiz.»**

> 🔴 **104-qonun (teng og'irlik):** hookda to'g'ri javob YO'Q — shuning uchun payoff ikkala
> tanlovda **bir xil** va **maqtovsiz**: ❌ «To'g'ri qildingiz…» (bitta tanlovni to'g'ri deb
> ko'rsatadi va ikkinchisini tanlagan o'quvchini aybdor qiladi).
> 🔴 **97-qonun / korpus §57:** savol o'quvchi og'zidan tabiiy chiqadi va uning O'Z harakatidan
> o'sadi («takror-takror tinglaysiz»). Bitta gap — ikkinchi gap yozilmaydi (§56).
> 🔴 **Metodist-tuzatmasi (korpus §4 + §40):** ❌ «Kecha besh marta tinglagan qo'shig'ingizni…»
> — «kecha … -ngiz» sun'iy qolipi korpus §4 da rad etilgan, ustiga «besh marta» o'quvchining
> kechagi kuni haqida yolg'on bo'lishi mumkin (o'quvchida bo'lmagan narsa uniki qilib aytilmaydi).
> ✅ odat-shakli: «Bir qo'shiqni takror-takror tinglaysiz» — har o'quvchi uchun rost.
> 🔴 **Metodist-tuzatmasi (4.1-taqiq):** payoffning ikkinchi qatorida «ilova sizni **tanimaydi**»
> turgan edi — «tanimoq» aql-fe'li, 1-bo'limdagi ikki fe'l chegarasini («eslab qoladi» /
> «ko'rsatadi») buzadi. ✅ Oqibat o'quvchining O'Z harakati bilan aytiladi: «yana o'zingiz
> qidirasiz». Yopuvchi qatordagi «narxi bor» ham olindi — o'smir «narx»ni pul deb o'qiydi.
> 🔴 **100-qonun:** tanlov `pm-m4d2-hook-choice` ga yoziladi, hech qayerda o'qilmaydi.
> 🔴 **62-qonun:** «maydon» atamasi bu ekranda YO'Q — u s2 da ochiladi. Hookda atama
> ishlatilmaydi (korpus §67d).
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda chiqadi.
> O'quvchi ekranidagi matnda «ko'pchilik», «sinf», «ovozlar» so'zlari **0** — payoff ikkala
> rejimda so'zma-so'z bir xil o'qiladi. Sinf-kuzatuvi MENTORGA maydonida qoladi.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida musiqa ilovasi eslab qoladigan uchta narsani o'zingiz yozib olasiz.
HARAKAT: O'quvchi kuzatadi: bo'sh ro'yxatga uchta qator o'z-o'zidan yozilib chiqadi,
har birining yoniga ✅ qo'yiladi.
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

**Demo-uch qator (o'z-o'zidan yozilib chiqadi) — ekranda strelkali juftlik bo'lib chiqadi, ustun-sarlavhasiz:**

| Ekranda ko'rinadigan qator |
|---|
| Qo'shiqchi nomi → «Qo'shiqchining boshqa qo'shiqlari» |
| Qo'shiq matni → «Matn bilan tinglash» |
| Albom nomi → «Albomdagi qo'shiqlar» |

> 🔴 **Metodist-tuzatmasi (39/62-qonun — atama o'z ekranida ochiladi):** s1 da «maydon» va «bo'lim» so'zlari **0** — ular s2 da ochiladi. Shuning uchun demo ustun-sarlavhalari («Maydon | Bo'lim») ekranga CHIQMAYDI: har qator strelkali juftlik bo'lib yoziladi (korpus §67d), s8 dagi saqlangan qator ko'rinishi bilan bir xil shaklda.
> 🔴 **Metodist-tuzatmasi (§20/§80 — bir tushuncha, bir nom):** o'ng bo'lakda AYNAN «bo'lim» bo'lishi shart. Avvalgi «"Qancha qoldi" ko'rsatkichi» va «To'plam muqovasi» bo'lim emas edi (ular ilova bezagi) — o'quvchi s4 da «bo'lim» ni boshqa narsa deb ko'rardi. Endi uchalasi ham ilovada nomi bilan turadigan haqiqiy bo'lim.
> 🔴 **40-qonun / korpus §40:** artefakt → «**yozib olasiz**» (bilim bo'lsa «bilib olasiz» bo'lardi). «Ilovangiz» YOZILMAYDI — o'quvchida ilova yo'q.
> 🔴 **42-qonun (fe'l ↔ ekran jarayoni):** suyuqlik-fe'li ISHLATILMAYDI (u idishni eslatadi) — **«o'z-o'zidan yozilib chiqadi»**; mentor-eslatmasida ham shu fe'l.
> 🔴 **54(b/c):** `ta-sub` ikkinchi qatori YO'Q · demo ostidagi caption YO'Q.
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo-uchligining bironta maydoni s4 dagi beshlikka **kirmaydi** — u ilovaning boshqa qismi (qo'shiq sahifasi) haqida. s4 esa tinglash tarixi haqida.
> 🔴 **63-qonun (slot-sanog'i taqiqi):** EKRAN matni «maydon» va «bo'lim» so'zlarini ta'riflamaydi va «har qatorda bitta narsa va u ochadigan bitta bo'lim» kabi slot-sanog'ini AYTMAYDI (korrekturada olib tashlandi) — uch strelkali qatorning o'zi ko'rsatadi.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (xotira tugmalari) + 3 × Quiz
EKRAN: Ilova faqat yozib qo'ygan narsasini qaytadan ko'rsata oladi. Yozib qo'yilmagan
narsa faqat o'sha payt ko'rinadi. Ilova har tinglash haqida yozib qo'yadigan bitta
narsa — maydon deyiladi.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) beshta tugmani yoqib-o'chirib
ilova ekrani qanday o'zgarishini o'zi topadi; (s6) keys-slaydlarini bashorat bilan ochadi.
JAVOB: s4 — beshta tugmadan uchtasi bo'lim ochadi, ikkitasi hech narsa ochmaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar odatda beshala tugmani ham yoqib qo'yadi va to'xtaydi.
«Endi bittasini o'chirib ko'ring» deb turtki bering — dars aynan shu lahzada ochiladi.
```

**s2 — TEORIYA-1: ekranda ko'ringan ↔ yozib qo'yilgan** (korpus §73: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Ilova ertaga sizga nimani qaytadan ko'rsata oladi?»**

Mentor (≤2 gap, 32b):
> O'tgan darsda ma'lumot jadval **ustunlarida** turganini ko'rgansiz. Endi ikki kartani bosib solishtiring.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 📱 **Ekranda bir marta ko'ringan** | Faqat o'sha payt ko'rinadi |
| 💾 **Ilova yozib qo'ygan** | Ertaga ham, bir oydan keyin ham qaytadan chiqadi |

Xulosa-karta (69-qonun · uch qisqa tugal gap · blok-gapining O'ZI):
> **Ilova faqat yozib qo'ygan narsasini qaytadan ko'rsata oladi.** Yozib qo'yilmagan narsa faqat o'sha payt ko'rinadi. Ilova har tinglash haqida yozib qo'yadigan bitta narsa — **maydon** deyiladi.

> 🔴 **39-qonun qolipi:** [oddiy gap — nima bo'lishini aytadi] → «shu … **maydon** deyiladi» → keyin «maydon» ishlataveriladi. Sarlavhada yangi atama YO'Q ✓
> 🔴 **Korpus §59 (orqaga-havola):** m4-01 ga havola o'quvchi KO'RGAN so'z bilan — «jadval ustunlari». Bu **butun darsdagi yagona** «ustun» ishlatilishi (avval bitta gapda ikki marta turgan edi — bittaga tushirildi).
> 🔴 **Metodist-tuzatmasi (60-qonun):** mentorning ikkinchi yarmi «endi shu ustunlarni **kim tanlashini** ko'ramiz» degan edi, ekranda esa boshqa narsa — «ko'ringan ↔ yozib qo'yilgan» solishtiruvi — turadi. Va'da ekranga mos bo'lmasa, o'quvchi javobni boshqa joydan qidiradi. Endi mentor faqat sahnani qo'yadi va bitta harakat aytadi.
> 🔴 **Metodist-tuzatmasi (ikki ma'noli gap):** «Ekranda bir marta ko'ringan narsa **o'sha lahzada qoladi**» — o'quvchi «qoladi» ni «saqlanib qoladi» deb, ya'ni TESKARI o'qishi mumkin edi. ✅ «Yozib qo'yilmagan narsa faqat o'sha payt ko'rinadi» — karta matni bilan ham so'zma-so'z bir xil.
> 🔴 **Ta'rif-qolipi:** «bitta narsa — **bitta** maydon deyiladi» dagi ikkinchi «bitta» olindi; ta'rifning kanonik shakli («ilova har tinglash haqida yozib qo'yadigan bitta narsa») s2 · flashcard-2 · RECAPS · s15 da AYNAN bir xil turadi.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet («Ilova») nomlanadi.
> 🔴 **Korpus §73:** inkordan boshlanmaydi — ❌ «Ilova hamma narsani ko'rsata olmaydi» → ✅ ijobiy shakl.
> 🔴 **Ekran-o'lchovi (Intl.Segmenter):** sarlavha + mentor + xulosa = **339 grapheme** proza (chegara 400; korrekturadan keyin qayta o'lchandi). Karta matnlari mashq-materiali — sanalmaydi (9-qonun 2026-07-25 aniqlashtirishi).

**s4 — YADRO: XOTIRA TUGMALARI** (markaziy mexanika)

Sarlavha (47-qonun — buyruq · korpus §48 natijani aytadi): **«Ilova nimani eslab qolishini o'zingiz tanlang.»**

Mentor (≤2 gap, 92a):
> O'ngda musiqa ilovasi turibdi, chapda esa beshta tugma. Ularni **yoqib-o'chirib** ko'ring — ilovada nima o'zgarishini o'zingiz topasiz.

**Beshta tugma va haqiqiy oqibat:**

| # | Tugma (o'quvchi ekranida shu matn turadi) | Yoqilganda | Yonidagi qator |
|---|---|---|---|
| 1 | 🎵 Qaysi qo'shiq tinglandi | «Yaqinda tinglaganlaringiz» o'sib chiqadi | ✅ Bu bo'lim qo'shiq nomlaridan quriladi |
| 2 | ⏰ Qachon tinglandi | «Kechqurun tinglaganlaringiz» o'sib chiqadi | ✅ Bu bo'lim tinglash vaqtidan quriladi |
| 3 | ☑️ Qo'shiq oxirigacha tinglandimi | «Sizga yoqadi» o'sib chiqadi | ✅ Bu bo'lim oxirigacha tinglanganidan quriladi |
| 4 | 📍 Qayerda tinglandi | Ilova ekrani o'zgarmaydi | ⬜ Saqlandi, lekin bitta ham bo'lim ochilmadi |
| 5 | 📇 Telefondagi kontaktlar | Ilova ekrani o'zgarmaydi | ⬜ Saqlandi, lekin bitta ham bo'lim ochilmadi |

> 🔴 **Metodist-tuzatmasi (bir shakl — bir o'qish):** beshala tugma endi bir xil shaklda — «ilova nimani yozib qo'yadi» degan savolga javob beradi. Avval 4-tugma «📍 Qayerda **turgan edingiz**» (o'tgan zamon, o'quvchiga murojaat), 5-tugma esa ot-birikma edi: bir ro'yxatda uch xil grammatika o'quvchini «bu qanaqa ro'yxat o'zi?» degan savolga olib boradi. 1-qatordagi «qaysi qo'shiq **ekanidan** quriladi» ham chigal edi → «qo'shiq nomlaridan».

🔴 **Boshlang'ich holat: beshala tugma ham O'CHIQ** (88/1-C.5-qonun: sukut bo'yicha ochiq turgan element yonmaydi — ko'rilmagani yonadi). Ilova ekrani deyarli bo'sh boshlanadi va o'quvchi uni bosqichma-bosqich o'zi quradi.

🔴 **«Qanday tekshiriladi» ustuni o'quvchi ekranida YO'Q** (98b: javob mashq ustida yozilmaydi). Mentor qaysi tugma bo'lim ochishini AYTMAYDI.

Yakun-qatori (bitta gap, darsning qoidasi — 69-qonun):
> ✅ **Uch tugma ilovada bittadan bo'lim ochdi, ikkitasi hech narsa ochmadi. Har saqlanadigan maydon ortida bitta bo'lim turadi.**

> 🔴 **106d/71-qonun:** har bosishdan keyin javob darhol chiqadi — vizual o'zgarish **va** yonidagi bitta qator. O'quvchi nega shunday bo'lganini o'qiydi, taxmin qilmaydi.
> 🔴 **Korpus §69:** qator «yo'qoldi / saqlanmagan / topilmadi» demaydi — bo'limning **nimadan qurilishini** aytadi. Yo'qolishni vizualning o'zi ko'rsatadi.
> 🔴 **72-qonun:** tugma-idishi yorliqli va diqqat-pulsi bilan; birinchi bosishdan keyin puls tinadi.
> 🔴 **Rang:** o'chirish xato emas → qizil YO'Q (palitra-pasporti: `err` faqat haqiqiy xatoga).
> 🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 40–45 soniya harakatsizlikdan keyin bitta **qoida-ipuchasi** chiqadi — «Yoqib ko'rdingiz. Endi bittasini **o'chirib** ham ko'ring» — javobni AYTMAYDIGAN shaklda (korpus §77).

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Musiqa ilovasiga uchta maydon yozing.
(mentor, 1 gap) Har maydonga bitta savol bering: buni saqlasak, ilovada qaysi
bo'lim ochiladi?
HARAKAT: Uchta maydonni BITTALAB yozadi. Har birida ikki yozuv-joyi: nimani saqlaymiz
va undan qaysi bo'lim quriladi. Saqlaganda qator o'ngdagi ro'yxatga ko'chadi.
JAVOB: Uchala maydon yozilgan · har birida bo'lim NOMI bor · uch bo'lim bir-biridan
farq qiladi · «kerak bo'ladi», «foydali» kabi bo'lim-nomi bo'lmagan javoblar yo'q.
RO'YXAT: Uchta maydon yozilgan · Har biriga bitta bo'lim yozilgan · Uch bo'lim bir xil emas
YULDUZCHA: To'rtinchi maydon yozing — ilova **saqlamaydigan** narsa va nega saqlamasligi.
YORDAM: O'zingizga savol bering: bu maydonni o'chirsam, ilovada qaysi bo'lim
yo'qoladi? Bo'lim nomi topilmasa — o'sha maydon kerak emas.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Foydalanuvchi haqida umumiy ma'lumot» kabi qatorlar chiqadi — bu eng
foydali xato. Javob-qatori uni tutadi, siz muhokama qiling: bundan qaysi bo'lim quriladi?
```

🔴 **Kirish-artefakt YO'Q — zaxira-tarmoq ham YO'Q** (korpus §69): bu modul ochilish darsi, shuning uchun ekran «oldingi darsdan kelgan ish» haqida umuman gapirmaydi. Boshlanish gapi to'g'ridan-to'g'ri: «Musiqa ilovasiga uchta maydon yozing.» — «topilmadi / saqlanmagan / bo'sh» so'zlari **0**.

🔴 **Yozish-kartasi (80b) — ikki maydon:**

| Maydon | Ipucha (placeholder — korpus §32: qisqa savol, tayyor javob YO'Q) |
|---|---|
| Nimani saqlaymiz? | `Ilova nimani eslab qolsin?` |
| Qaysi bo'lim quriladi? | `Bundan qaysi bo'lim ochiladi?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12: nima noto'g'ri + qanday tuzatish):**
- ✅ ikkala yozuv-joyi to'g'ri → «✅ Bo'lim nomi aytilgan — bu maydon kerak.»
- 🤔 bo'lim o'rniga umumiy so'z → «Bu hali bo'lim nomi emas. Bundan qaysi bo'lim ochiladi? Masalan: "Kechqurun tinglaganlaringiz".»
- 🤔 oldingi maydon bilan bir xil bo'lim → «Bu bo'lim yuqorida allaqachon yozilgan — boshqa bo'limni oling.»
- 🤔 juda qisqa (2-3 so'z) → «Juda qisqa qoldi — ilova aynan nimani eslab qolishini aniqroq yozing.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **Bo'lim-nomi bo'lmagan so'zlar ro'yxati** (dars o'z lug'atidan — 106d(c)): *kerak bo'ladi · foydali · keyin ishlatamiz · umumiy ma'lumot · hamma narsa · yaxshi bo'ladi*. O'quvchi shulardan birini yozsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

🔴 **106d(a) ikki tomonlama javob majburiy** — to'g'ri yozgan o'quvchi ham javob oladi (faqat xatoni aytadigan tekshiruv uni javobsiz qoldiradi).

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (jadval-qatorini belgilash)
EKRAN: (topshiriq) Bo'limni jadvaldan quring.
(yo'riqnoma) Tepada bo'lim nomi turadi — avval jadvaldan unga mos yozuvlarni
belgilang, so'ng «Bo'limni qurish»ni bosing.
HARAKAT: Uch raund: har safar boshqa bo'lim so'raladi. O'quvchi 6 yozuvli jadvaldan
mos qatorlarni belgilaydi va «Bo'limni qurish» tugmasini bosadi — o'ngdagi telefonda
bo'lim AYNAN uning belgilagan qatorlaridan quriladi.
JAVOB: 1) «Sizga yoqadi» → 1, 3, 4 · 2) «Kechqurun tinglaganlaringiz» → 1, 3, 6 ·
3) «Kechqurun yoqqan qo'shiqlar» → 1, 3 (ikki maydon birga)
RO'YXAT: —
YULDUZCHA: —
YORDAM: (1-2-raund) Bo'lim nomi qaysi maydonni so'rayotganini toping — jadvalda faqat
o'shanga qarang. · (3-raund) Bu safar bo'lim nomi ikki maydonni so'rayapti — yozuv
ikkalasiga ham mos kelsagina belgilanadi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda ishlating: har o'quvchi sherigining uch maydonini o'qib, har biriga
«qaysi bo'lim?» deb so'raydi. Javob topilmasa — o'sha maydon qayta yoziladi.
MENTORGA: 3-raund ikki maydonni birga so'raydi — eng ko'p adashish shu yerda.
Ulgurmagan bolalarga 1 va 2-raund yetadi, 3-raundni birga yeching.
```

**Ilovaning saqlangan jadvali (o'quvchi ekranida shu turadi — sarlavha-qatorida s4 dagi uch maydon nomi, «ustun» so'zi ekranda YO'Q):**

| # | 🎵 Qaysi qo'shiq | ⏰ Qachon | ☑️ Oxirigacha tinglandimi |
|---|---|---|---|
| 1 | Ohang | 21:40 | ha |
| 2 | Yo'l | 08:15 | yo'q |
| 3 | Ohang | 22:05 | ha |
| 4 | Shamol | 07:50 | ha |
| 5 | Tong | 19:20 | yo'q |
| 6 | Daryo | 23:10 | yo'q |

**Uch raund (qiyinlik o'sib boradi):**

| Raund | So'ralgan bo'lim (telefonda shu yorliq turadi) | To'g'ri qatorlar |
|---|---|---|
| 1 | «Sizga yoqadi» | 1 · 3 · 4 |
| 2 | «Kechqurun tinglaganlaringiz (soat 20:00 dan keyin)» | 1 · 3 · 6 |
| 3 | «Kechqurun yoqqan qo'shiqlar (soat 20:00 dan keyin va oxirigacha tinglangan)» | 1 · 3 |

🔴 **Shart yorliqda turadi, javob emas** (98b): «soat 20:00 dan keyin» — bu bo'limning ta'rifi, mashq materiali; qaysi yozuv unga mos kelishini o'quvchi O'ZI hisoblaydi.

🔴 **Metodist-tuzatmasi (halollik):** 3-raund avval «Kechqurun yoqqan qo'shiqlar» deb yolg'iz turgan edi — ikki sharti ham yashirin. 2-raundda ta'rif qavsda berilib, 3-raundda berilmasa, o'quvchi qoidani emas, so'z-topishmoqni yechadi («yoqqan» nimasi?). Endi uchala raundda ham ta'rif bir xil shaklda ochiq turadi; qiyinlik esa **ikki shartni birga hisoblashda** qoladi.

Yakun-qatori:
> ✅ **Bo'lim saqlangan yozuvlardan yig'iladi. Maydon saqlanmagan bo'lsa, bu bo'limni umuman qurib bo'lmaydi.**

> 🔴 **26/59-qonun tekshiruvi (to'qnashuvdan keyin qayta yozildi):** M3-D10 = Timeline · **M3-D14 = Hotspot** · M4-D2 = **jadval-qatorini belgilash**. Uchalasi ham boshqa ✓
> 🔴 **Band-oilalardan farqi:** *Hotspot* emas — yashirin nishon yo'q, jadval ochiq material va o'quvchi **bir nechta** qatorni belgilaydi · *MatchPairs* emas — ikki ustun juftlanmaydi · *kartani ko'chirish* emas — hech narsa joyidan qimirlamaydi · *klinika* emas — bo'laklardan gap yig'ilmaydi, tayyor yozuvlar shart bo'yicha saralanadi · *tekshiruvchi stoli* emas — ✓/✕ hukmi yo'q.
> 🔴 **s4 dan farqi (koordinator sharti):** s4 da harakat — **tugmani yoqib-o'chirish** (ilova sozlamasi ustida, oqibat darhol ko'rinadi, kashfiyot). s9 da harakat — **jadvaldagi yozuvlarni belgilash va bo'limni qurish** (ma'lumotning O'ZI ustida, natija faqat tasdiqdan keyin, bilimni qo'llash). Boshqa obyekt, boshqa harakat, boshqa maqsad.
> 🔴 **Rang:** belgilangan qator — indigo; qurilgan bo'lim — `success`; qizil FAQAT ortiqcha belgilangan qatorga.
> 🔴 **106d + korpus §77/§98 (mashq javobsiz qolmaydi):** «Bo'limni qurish» bosilgach natija DOIM ochiladi. Ortiqcha yozuv bo'lsa: «🤔 Bu yozuv bo'lim nomiga mos kelmaydi — uni yana bir bor o'qing.» Yetishmasa: «🤔 Bo'limga mos yana bitta yozuv bor.» — **qoida beriladi, yozuv raqami AYTILMAYDI.** YORDAM ekran boshida TURMAYDI — faqat birinchi xatodan keyin ochiladi.
> 🔴 **Metodist-tuzatmasi (atama-gigiena):** javob-qatorlaridan «**qiymat**» (o'quvchiga tanishtirilmagan so'z) va «**shart**» (o'smir uni «shart — majbur» ma'nosida ham o'qiydi) olib tashlandi; ikkalasi ham «bo'lim nomiga mos kelish» iborasi bilan almashdi. YORDAM esa korpus §92 bo'yicha qayta yozildi: avvalgi «Faqat so'ralgan **maydonga** qarang» 3-raundda YOLG'ON bo'lardi — u yerda ikki maydon birga so'raladi.
> 🔴 **87/29-qonun:** bu mashq m4-06 dagi `SELECT … WHERE` ga tabiiy tayyorgarlik, lekin **«SQL», «so'rov», «filtr» so'zlari AYTILMAYDI** — o'quvchi buni faqat qo'li bilan bajaradi. Kelajak-dars atamasi oqmaydi.
> 🔴 **s10 ga ulanish:** o'quvchi bu yerda **qo'lda** qilgan ish — aynan s10 dagi `yoqqanlar(tarix)` funksiyasi qiladigan ish (1-raund = o'sha jadval, o'sha shart). Mentor buni s10 da ochiq aytadi (87c).
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda). 🔴 **106f(c):** SOFT matni — sinf ish-tartibi, shuning uchun u `MentorNote` da yashaydi, o'quvchi ekranida YO'Q; shuning uchun u endi o'qituvchiga qaratilgan shaklda yozildi («Juftlikda ishlating…»), o'quvchiga emas.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge
EKRAN: (sarlavha) Yoqqan qo'shiqlarni ajratadigan kod yozamiz.
(mentor, 2 gap) Hozirgina «Sizga yoqadi» bo'limini jadvaldan o'zingiz qurdingiz —
endi shu ishni kod qiladi. Yozuvlar boshqa, qoida o'sha.
HARAKAT: yoqqanlar(tarix) funksiyasini to'ldiradi: oxirigacha tinglangan qo'shiqlar
nomini qaytaradi. Keyin natijani konsolda tekshiradi.
JAVOB: Konsolda uchta nom chiqadi: ['Ohang', 'Ohang', 'Shamol'].
RO'YXAT: Funksiya ro'yxat (massiv) qaytaradi · Faqat oxirigacha tinglanganlar qoladi · Natijada uch nom chiqdi
YULDUZCHA: Ikkinchi funksiya yozing — kechqurun (soat 20:00 dan keyin) tinglangan
qo'shiqlarni qaytarsin.
YORDAM: Bitta yozuvdan boshlang: uning oxirigacha maydoni rostmi? Ishlagach
qolganlariga o'ting.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Bog'lanish endi mentor gapida ochiq turibdi (87c). Siz yana bir narsani
qo'shing: kod — o'quvchi s8 da yozgan maydonlarning to'g'ridan-to'g'ri tarjimasi.
```

> 🔴 **87-qonun (o'tilgan texnik material):** **m4-01 JSON, jadval, ustun, PK/FK** · M3 dan `map`/`useState`/`fetch` · **M2 dan `if`, taqqoslash, massiv, obyekt, sikl, funksiya, `console.log`**. Topshiriqda shundan tashqari hech narsa yo'q.
> 🔴 **SQL YO'Q:** m4-03 va m4-06 hali o'tilmagan — `SELECT`/`WHERE` topshiriqqa kirmaydi (29-qonun).
> 🔴 **26-qonun (mexanika almashadi):** M3-D5 VS Code → M3-D10 kompilyator → **M4-D2 kompilyator?** ⚠️ Bu GATE S qarori — 14-bo'lim 2-bandiga qarang.
> 🔴 **Korpus §19/§48:** sarlavha natijani aytadi va «…adigan **kod** yozamiz» oilasidan ✓

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch maydoningizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan javob bering: musiqa ilovasi nimani eslab qoladi va har
biridan qaysi bo'lim quriladi? Avval sherigingizga ayting, so'ng shu javobni bir qatorda yozing.
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
MENTORGA: Uchdan biri «qaysi bo'lim quriladi» degan savolga javob berolmasa —
s4 dagi tugmalarni qayta oching va bittasini birga o'chirib ko'ring.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha «O'zingizni sinab ko'ring.»
> 🔴 **Korpus §3:** refleksiya-sarlavhasi challenge shaklida, mentor niyatni OCHIQ aytadi.
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'qiyotgan o'quvchida sherik YO'Q — unga «Avval **ovoz chiqarib o'zingizga** ayting, so'ng shu javobni bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **Metodist-tuzatmasi:** bitta pufakda «ayting … ayting» takrori bor edi — birinchisi «javob bering» ga almashdi; ikkinchi gap esa nima yozilishini aniq aytadi («shu javobni»).

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda maydonlaringizni tekshirib chiqasiz: har biriga «bu maydon bo'lmasa,
ilovada nima yo'qoladi?» degan javob yozasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
HARAKAT: Har maydonga yo'qolish-javobini yozadi; bittasini ilova saqlamaydigan narsaga
moslaydi.
JAVOB: —
RO'YXAT: Har maydonga javob yozildi · Har javobda bo'lim nomi bor · Bittasi — ilova
saqlamaydigan narsa
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Eng muhim bitta maydonni tanlang va unga «bu bo'lmasa, ilovada nima
yo'qoladi?» degan javob yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa.
Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; **yakun-ekranda AYNAN shu takrorlanadi**.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI va qadamlarni aytmaydi — «uch maydon», «bittasini» kabi sanoq faqat To'liq-kartada turadi, aks holda «Qisqa» tanlagan o'quvchi ikki xil topshiriqni birga o'qiydi.
> 🔴 **Metodist-tuzatmasi (lug'at + ≤5 so'z):** «**busiz** nima yo'qoladi» kitobiy qisqartma edi — to'liq shakl bilan almashdi («bu bo'lmasa…»); RO'YXAT bandlari esa checklist-o'lchoviga tortildi (ETALON 25: yorliq ≤5 so'z). «Sinovdan o'tkazasiz» → «tekshirib chiqasiz» (sodda fe'l).
> 🔴 **Namunasiz harakat taqiqi:** vazifadagi har ish darsda KO'RSATILGAN — «busiz nima yo'qoladi» s4 da o'chirib ko'rilgan, «ilova saqlamaydigan narsa» s4 ning 4/5-tugmasida ochilgan va s8 YULDUZCHA sida bir marta yozilgan.

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
MAVZU: Ilova nimani qaytadan ko'rsata oladi; maydon nima; har maydon ortida bitta
bo'lim; bo'lim bermaydigan maydon; «Sizga yoqadi» qaysi maydondan quriladi;
Netflix bosh sahifasi nimadan yig'iladi (2016-yil bayonoti); nimani saqlash kimning qarori.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 💾 Ilova ertaga nimani qaytadan ko'rsata oladi?
- A. Ekranda bir marta ko'ringan hamma narsani *(41)*
- **B.** Faqat o'zi yozib qo'ygan narsani ✅ *(33)*
- C. Foydalanuvchi so'ragan hamma narsani *(35)*

**Reveal:** To'g'ri — yozib qo'yilmagan narsa faqat o'sha payt ko'rinadi.

> 🔴 **64-qonun:** A va C bir-birining ma'nodoshi EMAS — A «ko'rilgan hammasi» (ekran-xotirasi haqidagi xato tasavvur), C «so'ralgan hammasi» (ilova buyruq bilan ishlaydi degan xato tasavvur). Ikkalasi ham hayotda qilinadigan xato, ikkalasi ham darsda RAD etilgan. Uzunlik: 41 · 33 · 35 (tell 41/33 = 1.24 ✓).

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 🎛 Maydon saqlandi, lekin bitta ham bo'lim ochilmadi. Bu nimani bildiradi?
- **A.** Bu maydon hozircha hech narsaga kerak emas ✅ *(41)*
- B. Bo'lim keyinroq o'z-o'zidan paydo bo'ladi *(39)*
- C. Ilova bu maydonni o'qiy olmayapti *(34)*

**Reveal:** To'g'ri — bo'lim bermaydigan maydon bekorga saqlanadi.

> 🔴 **17-qonun:** faqat A himoyalanadi. B — «vaqt o'tsa o'zi bo'ladi» degan keng tarqalgan xato; C — texnik nosozlik deb tushunish. Ikkalasi ham darsda RAD etilgan. Emoji ✅ savol oldida TURMAYDI (u «bajarildi» degan yolg'on signal beradi) → 🎛. Uzunlik: 41 · 39 · 34 (tell 41/39 = 1.05 ✓). Savol 11 so'z (105b ✓).

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 🎬 Netflix bosh sahifasi nimadan yig'iladi?
- **A.** Har kim o'zi ko'rgan kinolardan ✅ *(30)*
- B. Eng ko'p pul ishlagan kinolardan *(31)*
- C. Hamma uchun tuzilgan bitta ro'yxatdan *(37)*

**Reveal:** To'g'ri — bosh sahifa har kimning o'z ko'rish tarixidan quriladi.

> 🔴 **10-qonun (keys-sadoqati):** B va C bankda AYTILMAGAN — shuning uchun ular halol tuzoq (korpus §21: ishonarli, lekin noto'g'ri). A — bankning aynan o'z gapi.
> 🔴 **Metodist-tuzatmasi (17-qonun — bitta himoyalanadigan javob):** eski C «Yangi chiqqan kinolar ro'yxatidan» edi. Netflix'ni ko'rgan o'quvchi bosh sahifada «Yangi chiqqanlar» qatorini haqiqatan ko'rgan — ya'ni C qisman ROST bo'lib, to'g'ri o'ylagan bola adashishi mumkin edi. Yangi C esa 1-slaydga to'g'ridan-to'g'ri zid («ikki odam bir xil bosh sahifani ko'rmaydi») — ishonarli, lekin aniq noto'g'ri. Kalit-indeks TEGILMADI.
> 🔴 **17-qonun:** s6 dagi bashorat «ko'rishlarning qanchasi tavsiyadan keladi» ni so'raydi, bu savol «bosh sahifa nimadan yig'iladi» ni — bir keysning ikki boshqa gapi, takror emas. Uzunlik: 30 · 31 · 37 (tell 37/30 = 1.23 ✓).

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 📋 Qaysi maydonni saqlashga arziydi?
- A. Foydalanuvchi telefonining rangi *(33)*
- **B.** Qo'shiq oxirigacha tinglandimi ✅ *(31)*
- C. Foydalanuvchi haqida umumiy ma'lumot *(38)*

**Reveal:** To'g'ri — bundan «Sizga yoqadi» bo'limi quriladi; qolgan ikkitasi bo'lim bermaydi.

> 🔴 B darsning O'Z so'zlari bilan yozildi (s4 · 3-tugma). C — s8 ning javob-qatorida ataylab tutiladigan ibora («umumiy ma'lumot»), ya'ni o'quvchi uni allaqachon bir marta ko'rgan. Uzunlik: 33 · 31 · 38 (tell 38/33 = 1.15 ✓).

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask`.

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — yozilgani yashil ✓, joriysi indigo-pulsda, kelgusi kulrang-punktir.

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida ikki maydon (nima → qaysi bo'lim) + jonli javob-qatori.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI (chalg'itmasin) — faqat indikator chirog'i yonadi; uchtasi ham yozilgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda).

**Ipuchalar (92c/85 · korpus §32):** `«Ilova nimani eslab qolsin?»` va `«Bundan qaysi bo'lim ochiladi?»` — qisqa savollar; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q.

**106d javob (ikki tomonlama):**
- ✅ «Bo'lim nomi aytilgan — bu maydon kerak.»
- 🤔 «Bu hali bo'lim nomi emas. Bundan qaysi bo'lim ochiladi? Masalan: "Kechqurun tinglaganlaringiz".»

**Bo'lim-nomi hisoblanmaydigan so'zlar** (dars o'z lug'atidan — 106d(c)): *kerak bo'ladi · foydali · keyin ishlatamiz · umumiy ma'lumot · hamma narsa · yaxshi bo'ladi*.

**Saqlangan maydon ko'rinishi:** `🎵 Qaysi qo'shiq tinglandi → «Yaqinda tinglaganlaringiz»` — strelka bilan, ikki bo'lak bir nafasda o'qiladi (korpus §67d). 🔴 s1 demosidagi uch qator ham AYNAN shu shaklda chiqadi — o'quvchi bir xil ko'rinishni ikki marta ko'radi va yozishdan oldin uni allaqachon o'qigan bo'ladi.

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K6 · 91b/33/42/43/56)

**Freym (91b):** eyebrow — **«🎬 Haqiqiy voqea»**, K-kodi ekranga chiqmaydi.

**4 slayd (hikoya tilida — 42-qonun · korpus §42 · ovoz chiqarib o'qib tekshirildi):**

1. **Netflix** — kino va serial ko'rsatadigan ilova. Uni bir vaqtda ochgan ikki odam **bir xil bosh sahifani ko'rmaydi**.
2. Har kimning bosh sahifasi **uning o'zi ko'rgan kinolaridan** yig'iladi. Ilova nimani ko'rganingizni yozib boradi va o'xshash kinolarni o'zi taklif qiladi. Shu taklif — **tavsiya**.
3. *(bashorat)* **Sizningcha, odamlar ko'radigan kinolarning qanchasi tavsiyadan keladi?**
4. **2016-yilda Netflix buni ochiq aytdi: ko'rishlarning qariyb 80 foizi tavsiyadan keladi** — ya'ni har beshta ko'rishning to'rttasi. Qidirib topilgani esa ancha kam.

**Bashorat (3-slaydda, zinapoya tartibida — 43-qonun · korpus §43 · bitta o'lchovning uch darajasi, o'sish tartibida):**
- «Har to'rttadan bittasi tavsiyadan keladi» *(38)*
- «Har ikkitadan bittasi tavsiyadan keladi» *(38)*
- «Har beshtadan to'rttasi tavsiyadan keladi» ✅ *(40)*

**Natija-qatori (56/100-qonun):** topsa «🎯 Topdingiz! Har beshtadan to'rttasi tavsiyadan keladi» — quyruqsiz; adashsa «Adashdingiz — asl javob: har beshtadan to'rttasi tavsiyadan keladi». 🔴 «Bu ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — to'liq nom bilan):**
> Netflix bosh sahifasi — saqlangan ma'lumotdan qurilgan bo'lim. Netflix «kim nimani ko'rdi» ni yozib bormaganda, bu sahifa umuman bo'lmasdi. Nimani yozib borishni esa kod emas, mahsulotni o'ylaydigan odam hal qiladi — endi shu qarorni siz qabul qilasiz.

> 🔴 **10-qonun (keys-sadoqati — metodist tekshiruvi bajarildi):** bankda faqat shu bor — bosh sahifa har kimda o'ziniki, tavsiyalar ko'rish tarixidan yig'iladi, **~80% ko'rishlar tavsiyadan (qidiruvdan emas), Netflix ochiq bayonoti, 2016**. Shuning uchun: ❌ «millionlab obunachi» (bankda YO'Q) · ❌ «sun'iy intellekt tanlaydi» (bankda YO'Q, ustiga m6 atamasi) · ❌ raqamni yilsiz aytish (10-qonun) → ✅ **«2016-yilda»** har doim raqam bilan birga turadi.
> 🔴 **Bashorat halolligi (17/43/64-qonun):** uch variant **bitta o'lchovning** uch darajasi va bir-birini inkor qiladi; hech biri 4-slaydda ROST bo'lib chiqmaydi. Foiz o'rniga «har beshtadan to'rttasi» — o'smir buni bir qarashda tasavvur qiladi.
> 🔴 **Ko'prik:** ❌ «kim, nimani, qachon ko'rganini» — slot-sanog'i (63-qonun); ❌ «Sizning ilovangizda» — o'quvchida ilova yo'q (§40).
> 🔴 **Metodist-tuzatmasi (21/39-qonun — «tavsiya» glossi):** «tavsiya» so'zi avval 3-slaydda, ta'rifsiz, to'g'ridan-to'g'ri bashorat-savolida chiqardi — u esa flashcard-8 va arena savoliga (ballanadigan matnga) o'tadi. Endi 2-slayd hodisani ko'rsatib nomini beradi: «…o'xshash kinolarni o'zi taklif qiladi. Shu taklif — tavsiya».
> 🔴 **Metodist-tuzatmasi (fe'l va referent):** ❌ «nimani yozib borishini o'zingiz **yozasiz**» (bir gapda ikki «yoz-»); ❌ «**Ular** yozib bormaganda» (referent Netflix'mi, ilovami — chalkash). Ko'prikning oxirgi gapi endi darsning bosh g'oyasini — **qarorni kim qabul qiladi** — nomlaydi va s8 ga olib o'tadi.

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun)

**Darvoza-mashq (82e):** uch maydondan qaysi biri «Sizga yoqadi» bo'limini qurishini tanlash (darsning O'Z bilimi, s4/s9 dan).

**Boshlang'ich kod:**

```js
// Ilova har tinglash haqida bitta yozuv saqlaydi
const tarix = [
  { qoshiq: 'Ohang',  vaqt: '21:40', oxirigacha: true  },
  { qoshiq: 'Yo\'l',  vaqt: '08:15', oxirigacha: false },
  { qoshiq: 'Ohang',  vaqt: '22:05', oxirigacha: true  },
  { qoshiq: 'Shamol', vaqt: '07:50', oxirigacha: true  }
];

function yoqqanlar(tarix) {
  // Oxirigacha tinglangan qo'shiqlar nomini qaytaring
  return [];   // ← bu joyni siz to'ldirasiz
}

console.log(yoqqanlar(tarix));
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. Funksiya ro'yxat qaytaradi
2. Faqat oxirigacha tinglanganlar qoladi
3. Natijada uch nom chiqdi — `['Ohang', 'Ohang', 'Shamol']`

**YORDAM (yechimni aytmaydi — korpus §77):** Bitta yozuvdan boshlang: uning `oxirigacha` maydoni rostmi? Ishlagach qolganlariga o'ting.

**YULDUZCHA:** Ikkinchi funksiya — kechqurun (soat 20 dan keyin) tinglangan qo'shiqlarni qaytarsin (`vaqt` maydonidan).

> 🔴 **87-qonun:** sikl + `if` + massivga qo'shish — hammasi M2 da o'tilgan; `map`/`filter` bilan yozgan o'quvchiga ham ruxsat (M3 da o'tilgan). Ikkala yo'l ham JAVOB shartini bajaradi.
> 🔴 **Metodist-tuzatmasi (22-qonun, o'tish-gapi o'quvchi matnida bo'lsin):** s9 jadvali **6 yozuv**, s10 massivi esa **4 yozuv** — bu ataylab. Lekin o'tish-gap avval faqat MENTORGA maydonida turgan edi, ya'ni yakka o'qiyotgan o'quvchi «nega yozuvlar boshqa?» degan savol bilan qolardi. Endi u mentor-pufagining O'ZIDA: «Yozuvlar boshqa, qoida o'sha».
> 🔴 **Sanoq-mosligi (22-qonun):** massivda **4 yozuv**, javobda **3 nom** — matnda aytilgan har son ekrandagi real songa teng. `Ohang` ataylab ikki marta: o'quvchi «takrorlarni olib tashlash kerakmi?» deb o'ylab ko'radi, javob — yo'q (bo'lim tinglash SONINI ham ko'rsatadi).
> 🔴 **Korpus §19/§48:** sarlavha natijani aytadi — ✅ «Yoqqan qo'shiqlarni ajratadigan **kod** yozamiz», ❌ «Kod tayyorlaymiz», ❌ «Ma'lumotni filtrlaymiz» (kalka).
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»).
> 🔴 **Pedagogik ulanish:** kod — s8 dagi qatorlarning to'g'ridan-to'g'ri tarjimasi. Mentor buni ochiq aytadi (87c: bog'lanish halol ko'rsatiladi).

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qator CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo-maydonlar s4 **beshligiga** KIRMAYDI — ular ilovaning boshqa qismidan (qo'shiq sahifasi) |
| **s12 REFLEKSIYA** | Sarlavha: «Uch maydoningizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga» |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Ilova faqat yozib qo'ygan narsasini qaytadan ko'rsata oladi.» · «Maydon — ilova har tinglash haqida yozib qo'yadigan bitta narsa.» · «Har saqlanadigan maydon ortida bitta bo'lim turadi.» · «Ilova nimani eslab qolishini kod emas, mahsulotni o'ylaydigan odam hal qiladi.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s2 · s12) esa sarlavha — savol-murojaat |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | Ilova ertaga nimani qaytadan ko'rsata oladi? | s2 |
| 2 | Maydon nima? | s2 |
| 3 | «Yaqinda tinglaganlaringiz» qaysi maydondan quriladi? | s4 + s9 |
| 4 | «Sizga yoqadi» qaysi maydondan quriladi? | s4 + s9 |
| 5 | «Kechqurun tinglaganlaringiz» qaysi maydondan quriladi? | s4 + s9 |
| 6 | Maydon saqlandi, lekin bo'lim ochilmadi — bu nimani bildiradi? | s4 + s5 |
| 7 | Yaxshi maydonning belgisi nima? | s4 + s8 |
| 8 | «Umumiy ma'lumot» nega yomon maydon? | s8 + s11 |
| 9 | Netflix bosh sahifasi nimadan yig'iladi? | s6 |
| 10 | Netflix ko'rishlarining qanchasi tavsiyadan keladi? | s6 |
| 11 | Bo'lim ilovada nimadan yig'iladi? | s9 |
| 12 | Nimani saqlashni kim hal qiladi? | s15 |

> 🔴 **21-qonun (scored-matn glossi):** bu darsda ballanadigan matnda izohsiz chet so'z YO'Q — «SQL», «schema», «data», «retention», «backend» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «maydon», «bo'lim», «saqlash», «ma'lumot» so'zlari bilan yoziladi.
> 🔴 **Metodist-tuzatmasi (arena 10-savol):** avval savol keysning YILINI so'rardi — bu bilim emas, yod olingan sana (o'quvchi tushunchani bilsa ham ball yo'qotadi). Endi savol raqamning O'ZINI so'raydi; yil esa 4-slaydda va flashcard-8 da raqam bilan birga turaveradi (10-qonun shu yerda bajarilgan).
> 🔴 **Metodist-tuzatmasi (12-savol):** «kimning qarori?» ichki-PM iborasi edi; endi savol ham, s15 qatori ham, flashcard-10 ham bir xil sodda shaklda — «Nimani saqlashni kim hal qiladi?» → «Mahsulotni o'ylaydigan odam — kod emas».

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Memory Maker!** | Beshta tugmani sinab ko'rdingiz | 31 | s4: 5/5 tugma sinaldi |
| **Field Writer!** | Uch maydonni bo'limi bilan yozdingiz | 35 | s8: 3/3 saqlandi |
| **Section Builder!** | Uch bo'limni jadvaldan qurdingiz | 32 | s9: 3/3 raund to'g'ri |
| **Data Coder!** | Yoqqan qo'shiqlarni kod ajratdi | 31 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓ (o'zbekcha nishon-nomi O'TMAYDI), 4/4 tavsif o'zbekcha siz-formada, hammasi ≤48 belgi va korpus §63 ning 32–42 oralig'ida ✓.
> 🔴 **Metodist-tuzatmasi (tavsif = bajarilgan ishning O'ZI):** ❌ «Ilova **xotirasini** o'zingiz yoqdingiz» — «xotira» so'zi o'quvchi ekranida umuman yo'q (u — senariy-ichi imzo-vizual nomi), ustiga «xotirani yoqish» hech qanday rasm chizmaydi. ❌ «Uch maydonni **sababi** bilan yozdingiz» — o'quvchi sabab emas, **bo'lim** yozgan. ❌ «Maydondan bo'lim yasadingiz» — s10 da kod bo'lim yasamaydi, u yoqqan qo'shiqlarni ajratadi (korpus §93: tasdiq aynan bajarilgan ishni aytsin).
> 🔴 Tavsif nom aytgan narsani takrorlamaydi (101c) va bitta nafasda o'qiladi.

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Ilova ertaga nimani qaytadan ko'rsata oladi? | Faqat o'zi yozib qo'ygan narsani |
| 2 | Maydon nima? | Ilova har tinglash haqida yozib qo'yadigan bitta narsa |
| 3 | Yaxshi maydonning belgisi nima? | Ortida bitta bo'lim turadi |
| 4 | Bo'lim bermaydigan maydon nima bo'ladi? | Bekorga saqlanadi |
| 5 | «Sizga yoqadi» bo'limi qaysi maydondan quriladi? | Qo'shiq oxirigacha tinglanganidan |
| 6 | «Kechqurun tinglaganlaringiz» qaysi maydondan quriladi? | Tinglash vaqtidan |
| 7 | Netflix bosh sahifasi nimadan yig'iladi? | Har kimning o'z ko'rish tarixidan |
| 8 | Netflix 2016-yilda qanday raqamni aytdi? | Ko'rishlarning qariyb 80 foizi tavsiyadan keladi |
| 9 | Maydon saqlanmasa, ilovada nima bo'ladi? | O'sha maydondan quriladigan bo'lim ochilmaydi |
| 10 | Nimani saqlashni kim hal qiladi? | Mahsulotni o'ylaydigan odam — kod emas |

> 🔴 **Korpus §20/§52📌:** 2-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi ta'rif bilan **so'zma-so'z** bir xil.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan (karta yolg'iz turadi).
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ko'rsata olish · maydon ta'rifi · yaxshi maydon · foydasiz maydon · uch bo'lim-maydon juftligi · keys · keys yili · yo'qolish oqibati · kimning qarori).
> 🔴 **Korpus §76:** javoblar bir turkumda — hammasi ot yoki gap; fe'l-ot aralashmasi yo'q.

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Yozib qo'yilgan narsa qaytadi»** — (1) ekranda ko'ringan va yozib qo'yilgan farqi · (2) shuning uchun maydon tanlanadi · (3) sinfga savol
**s5 · «Har maydon ortida bitta bo'lim»** — (1) bo'lim bermaydigan maydon bekorga saqlanadi · (2) shuning uchun ro'yxat qisqa bo'ladi · (3) savol
**s7 · «Bosh sahifa ma'lumotdan quriladi»** — (1) Netflix xulosasi (2016, 80 foiz) · (2) ma'lumot qaror qiladi, bezak emas · (3) savol
**s11 · «Saqlashga arziydigan maydon»** — (1) bo'lim nomi aytilsa arziydi · (2) umumiy so'zlar bo'lim bermaydi · (3) savol

> 🔴 **43-qonun (belgi-formula taqiqi):** karta sarlavhasida matematik tenglik/qarama-qarshilik belgilari YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** ❌ «K6 xulosasi» → keys nomi bilan.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K6** — 4-Modulda ishlatilmagan ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — M3-D10 Timeline · M3-D14 Hotspot · **M4-D2 jadval-qatorini belgilash** ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): musiqa ilovasi — s0 dan s15 gacha; keys 91b freymi bilan kiradi va ko'prik bilan qaytadi ✓
- 95 (Toshkent o'smiri): musiqa ilovasi — har kuni o'zi ochadi ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas (grep bilan tasdiqlandi) ✓
- 26/59 (mexanika almashadi): TEKSHIRUV Timeline (M3-D10) → Hotspot (M3-D14) → **jadval-qatorini belgilash (M4-D2)** ✓ · s4 (tugma yoqish) ↔ s9 (qator belgilash) ham bir-birini takrorlamaydi ✓ · koding — *(GATE S tasdig'i kerak)*
- 87 (o'tilgan material): m4-01 JSON/jadval/ustun · M2 `if`, sikl, massiv, obyekt, funksiya ✓
- 29 (kelajak-atama oqmaydi): «SQL», «NoSQL», «PostgreSQL», «metrika» — **0** ✓
- 47: `?</h2>` interaktiv ekranlarda 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104: hook ikki tanlovi teng sonli va teng uzunlikda (41 ↔ 44 belgi) ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda ≤1) ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN o'qildi):**
1. **§20/§80/§85 (bir tushuncha — bir nom):** «maydon» yagona nom; «ustun» aynan 1 marta (s2 mentor, m4-01 ga havola); markaziy atama o'rnida o'zbekcha ibora ✓
2. **§69 (yo'qlik haqida gapirilmaydi):** «topilmadi · saqlanmagan · bo'sh ekan» o'quvchi matnida **0**; s4 qatorlari bo'limning **nimadan qurilishini** aytadi ✓
3. **§43 (bashorat zinapoyasi):** uch variant bitta o'lchovning uch darajasi, o'sish tartibida ✓
4. **§67d (payoff strelkali juftlik):** hook payoffi proza emas, ikki strelkali qator ✓
5. **§84 («ustaxona» taqiqi):** so'z faqat senariy-ichi blok nomi, o'quvchi ekranida **0** ✓
6. **§40 («ilovangiz» taqiqi):** o'quvchida ilova yo'q — dars bo'ylab «musiqa ilovasi»; «-ingiz» faqat u YOZGAN uch maydonga ✓
7. **§32/§77 (ipucha va maslahat javobni aytmaydi):** placeholder — qisqa savol; YORDAM faqat birinchi xatodan keyin ✓
8. **§97 (yakka rejim):** «ko'pchilik / sinf / ovozlar» o'quvchi matnida **0** ✓
9. **§63 (nishon o'lchovi):** 4 tavsif 27–35 belgi ✓
10. **§96 (variantli vazifa):** EKRAN matni sonni aytmaydi ✓
11. **Sanoq-mosligi (22-qonun):** 5 tugma (s4/s5/nishon) · 6 yozuv × 3 maydon, 3 raund → 3/3/2 yozuv (s9/nishon) · 3 maydon (s8/uy-vazifa/refleksiya) · 4 yozuv → 3 nom (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
12. **s9 ↔ s10 jadval-mosligi:** s9 jadvali 6 yozuv, s10 massivi 4 yozuv — **ataylab boshqa** (22-qonun: test o'quvchi artefaktidan boshqa to'plamni olsa, o'tish-gap buni ochiq aytadi). ✅ Korrekturadan keyin o'tish-gap MENTORGA maydonidan o'quvchi ekranidagi mentor-pufagiga ko'chirildi: «Hozirgina «Sizga yoqadi» bo'limini jadvaldan o'zingiz qurdingiz — endi shu ishni kod qiladi. Yozuvlar boshqa, qoida o'sha.»

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**
**(a) Umumiy taqiq-so'zlar:** alohida ro'yxat yozilmaydi — manba `til-lint-rules.json` (74 qoida). Qurilgandan keyin `npm run lint:til src/4-Modull/PmLesson11.jsx` → **0 error** shart.

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M4-D2 ga tegishli):
`topilmadi` · `saqlanmagan` · `bo'sh ekan` (korpus §69 — yo'qlik haqida gapirilmaydi) ·
`ilovangiz` (§40 — o'quvchida ilova yo'q) · `ko'pchilik` · `sinf` · `ovozlar` (§97 — yakka rejim) ·
`SQL` · `NoSQL` · `Postgres` · `so'rov` · `filtr` · `metrika` (29-qonun — kelajak-dars atamalari) ·
`ustun` (s2 mentor gapidan tashqari **0** — bir tushuncha, bir nom) ·
`panel` · `qism` · `oyna` («bo'lim» ma'nosida **0**) · `ball emas` · `boshida siz` · `degandingiz` (100-qonun) ·
**(metodist korrekturasidan keyin qo'shildi):** `qatoringiz` · `qatorlaringiz` · `uch qator` (o'quvchi artefakti «uch **maydon**» deyiladi — m4-01 da «qator = jadvaldagi yozuv») ·
`xotira` (imzo-vizual nomi — o'quvchi matnida **0**) · `narx` (hook payoffida pul-ma'nosi) · `tanimaydi` · `biladi` · `o'ylaydi` (4.1 a'zo/aql-metaforasi) ·
`qiymat` · `shartiga` (s9 javob-qatorlarida tanishtirilmagan atama) · `busiz` · `sinovdan o'tkaz` (uy-vazifa) · `lahza`.

---

## 14. ⚠️ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq, 2026-08-13)

> 🔴 Senariy shu 11 savolga javob olmaguncha qurishga o'tmaydi (9–11 — pm-metodist korrekturasidan keyin qo'shildi).

1. 🔴 **MODUL-IPI TO'QNASHUVI (eng muhimi).** 96-qonun: «modulning LOYIHA kunlari qanday mahsulot qursa, o'sha modulning nazariy darslari ham shu mahsulotning bo'laklarida o'rgatiladi». 4-Modulning loyiha kunlari esa `App.jsx` bo'yicha **AvtoIjara** (m4-08) va **AvtoStoyanka** (m4-13). Pasport esa misol-ip qilib 🎧 **musiqa ilovasi** ni biriktirgan. Uch yo'l: **(a)** dars musiqa ilovasida qoladi, modul-ipi 96c(b) bo'yicha faqat o'quvchi ARTEFAKTI orqali yuradi (demo har darsda yangilanadi) — **tavsiyam shu**, chunki M4-D2 da kirish-artefakt yo'q va musiqa ilovasi 95-qonundan eng yaxshi o'tadi; **(b)** butun dars AvtoIjara olamiga ko'chiriladi (lekin o'smir mashina ijarasiga O'ZI bormaydi — 95-qonun buziladi); **(c)** 4-Modulning loyiha mahsuloti qayta ko'rib chiqiladi. Qaysi biri?

2. 🔴 **KODING KOMPILYATORDAMI?** 26-qonun ketma-ket PM darslarida bir xil koding-mexanikani taqiqlaydi. Navbat: M3-D5 VS Code → M3-D10 kompilyator → **M4-D2 = VS Code bo'lishi kerak**. Lekin oradagi **m3-14 hali yozilmagan** — u navbatni o'zgartiradi. Ustiga M3-D10 GATE S da siz «LMS tomoni tayyor bo'lgach, kompilyator masalasi hamma darsda bir yo'la hal qilinadi» degan edingiz. Uch yo'l: **(a)** kompilyator (topshiriq sof JS — kompilyator uni bajaradi); **(b)** VS Code-topshiriq (26-qonun navbatiga sodiq); **(c)** m3-14 yozilgunicha kutiladi. Tavsiyam — **(a)**, va m3-14 ga VS Code biriktiriladi.

3. 🟡 **CHIQISH-ARTEFAKT SHAKLI.** `pm-m4d2-data = { qatorlar: [ {maydon, bolim} × 3 ], savedAt }` — M4-D7 (xavfsizlik) shu uch qatorni o'qiydi va «qaysi biri sizib ketsa qimmatga tushadi?» deb so'raydi. Savol: **s8 YULDUZCHA sida yoziladigan «ilova saqlamaydigan narsa» ham artefaktga majburiy 4-qator qilib kiritilsinmi?** Hozir u ixtiyoriy — ya'ni M4-D7 unga TAYANMAYDI (F-0803-22-B saboqi: ikki tomonlama shart-tekshiruvi). Tasdiqlaysizmi?

4. 🟡 **DARS SARLAVHASI VA SUB.** `App.jsx` `m4-02`: title «Ma'lumot ham mahsulot qarori» · sub «**nimani saqlaymiz va nega — metrikalar**». 🔴 «metrikalar» so'zi 29-qonunga zid: «metrika» M8-D1 ning bosh atamasi va bu darsda umuman o'rgatilmaydi. **Taklif:** title → **«Ilova nimani eslab qolsin?»** · sub → **«nimani saqlaymiz va nega»**. Tasdiqlaysizmi?

5. 🔴 **«MAYDON» va «BO'LIM» SO'ZLARI (metodist hukmi — tasdiq so'ralmoqda).** Dalillar tekshirildi:
   - `m4-01 DataIntroLesson` — «ustun» **87 marta**, «maydon» **11 marta** (o'quvchi ko'rgan so'z «ustun»);
   - `m4-03 DbSqlNosqlLesson` — ma'lumot-maydoni ma'nosida **«maydon»** ishlatadi («istalgan maydon bemalol»);
   - `m4-06 PostgresCrudLesson` — jadval kontekstida **«ustun = xususiyat»**;
   - `MATN_ETALONI` lug'at **178-qatori** «bo'lim / qism / oyna / maydon → panel» deydi, ammo u **VS Code interfeysi** hukmi (F-0810-01) — ma'lumot-maydoniga tegishli emas.
   
   Ya'ni 4-Modulda ikkala so'z ham yashaydi va lint hech birini tutmaydi. Men **«maydon»** ni tanladim: bu darsda jadval ekranda ko'rinmaydi (vizual — tugmalar va ilova ekrani), «ustun» esa ko'rinadigan jadvalsiz ma'nosini yo'qotadi; «maydon» m4-03 bilan ham bir xil bo'ladi. «Ustun» butun darsda **aynan bir marta**, s2 mentor gapida m4-01 ga orqaga-havola sifatida qoladi (korpus §59). Ko'rinadigan qism uchun **«bo'lim»**. Rozimisiz — yoki (a) dars butunlay «ustun» ga o'tsinmi, (b) «bo'lim» «panel» ga almashsinmi?

6. 🟡 **s4 TUGMALAR SONI.** Beshta: uchtasi bo'lim ochadi, ikkitasi hech narsa ochmaydi. Ikkita «foydasiz» tugma darsning ikkinchi yarmini (hamma narsani saqlash yechim emas) ochadi va M4-D7 ga ko'prik quradi. Kamaytirish kerakmi (106-qonun blok-budjeti) yoki beshta qoladimi?

7. 🟡 **FOYDASIZ TUGMALAR TANLOVI.** «📍 Qayerda tinglandi» va «📇 Telefondagi kontaktlar» (metodist korrekturasida beshala tugma bir shaklga keltirildi) — ikkalasi ham real ilovalar so'raydigan, o'smirga tanish narsalar. Lekin ular **xavfsizlik/maxfiylik** mavzusiga tegadi, u esa M4-D7 niki. Bu darsda ular faqat «bo'lim bermaydi» tomonidan ko'rsatiladi, maxfiylik so'zi AYTILMAYDI (29-qonun). Shunday qoldiramizmi, yoki neytralroq ikkita narsa olinsinmi (masalan «telefon batareyasi darajasi», «ekran yorqinligi»)?

8. 🟡 **s9 NING 3-RAUNDI IKKI MAYDONNI BIRGA SO'RAYDI.** Yangi TEKSHIRUV mexanikasi («BO'LIMNI JADVALDAN QURING», 2026-08-13 da Hotspot m3-14 ga muhrlangach qayta yozildi) uch raunddan iborat: 1-raund bitta maydon (`oxirigacha`), 2-raund bitta maydon (`vaqt`), **3-raund ikkalasi birga** (`kechqurun VA yoqqan`). Uchinchi raund darsning eng qiyin joyi va u 6 daqiqaga sig'masligi mumkin. Uch yo'l: **(a)** uchalasi qoladi, 3-raund ulgurmaganlarga MENTORGA bandi bo'yicha birga yechiladi — **tavsiyam shu** (u «ikki shart birga» g'oyasini beradi va s10 YULDUZCHA siga tayyorlaydi); **(b)** 3-raund olib tashlanadi, TEKSHIRUV ikki raund bo'ladi (lekin nishon-trigeri 3/3 dan 2/2 ga o'zgaradi); **(c)** 3-raund YULDUZCHA ga ko'chiriladi. Qaysi biri?

9. 🟢 **s9 JADVALI m4-06 NI OLDINGA TORTMAYDIMI?** Ekranda 6 yozuvli jadval turadi va o'quvchi uni shart bo'yicha saralaydi — bu amalda `SELECT … WHERE` ning qo'l bilan bajarilgan ko'rinishi. Men **«SQL», «so'rov», «filtr» so'zlarini butunlay olib tashladim** (29-qonun: kelajak-dars atamasi oqmaydi) — o'quvchi ishni bajaradi, nomini m4-06 da biladi. Shu chegara yetarlimi, yoki jadval umuman ko'rsatilmasinmi?

10. 🔴 **ARTEFAKT BIRLIGINING NOMI: «qator» → «maydon»** (metodist korrekturasi, 2026-08-13 — sizning tasdig'ingiz kerak, chunki M4-D7 shu kalitni o'qiydi). Dalil: o'tgan dars `m4-01 DataIntroLesson` o'quvchiga «**Qator = bitta yozuv**» va «**Ustun = bitta maydon**» ni o'rgatgan (jadval kartalari + tekshiruv-testi). M4-D2 esa s9 da EKRANDA jadval ko'rsatadi — agar o'quvchining o'z ishi ham «uch qatoringiz» deb atalsa, bitta ekranda «qator» ikki xil narsani bildiradi. Shuning uchun o'quvchi matnida: yozgan ishi — «**uch maydon**» (har biriga bitta bo'lim), jadvaldagilar — «**yozuv**». Savol: artefakt kaliti ham `{ maydonlar: [ {maydon, bolim} × 3 ] }` bo'lsinmi (M4-D7 shunga qarab o'qiydi), yoki kalit ichki nom sifatida `qatorlar` bo'lib qolaversinmi (ekranda baribir ko'rinmaydi)?

11. 🟡 **s6 dagi «tavsiya» so'zi** endi 2-slaydda hodisa bilan ochiladi («…o'xshash kinolarni o'zi taklif qiladi. Shu taklif — tavsiya»). Sabab: bu so'z flashcard-8 va arena savoliga, ya'ni ballanadigan matnga o'tadi (21-qonun). Shu gloss yetarlimi, yoki «tavsiya» butunlay «ilova o'zi taklif qilgan kinolar» iborasi bilan almashtirilsinmi?

---

## 15. 🎓 pm-metodist SENARIY-KORREKTURASI (2026-08-13) — nima o'zgardi

> Manba: `MATN_KORPUS` (yozishdan oldin o'qildi) · `MATN_ETALONI` (8-checklist + lug'at) · `PM_Prompt_v8`.
> Mexanika, ekran-soni va ball-logikasiga TEGILMADI — ular [GATE S] da.

**A · Test halolligi va bashorat**
1. TEST-3 C-varianti «Yangi chiqqan kinolar ro'yxatidan» → «Hamma uchun tuzilgan bitta ro'yxatdan» (eski variant Netflix ko'rgan bola uchun qisman ROST edi — 17-qonun). Kalit-indeks tegilmadi.
2. Bashorat (s6-3) tekshirildi: 25% → 50% → 80% zinapoyasi, faqat bittasi 4-slaydda rost ✓ takror emas.
3. Arena 10-savoli «qaysi yilda?» (yod-sana) → «ko'rishlarining qanchasi tavsiyadan keladi?»; 12-savol · flashcard-10 · s15 qatori bir shaklga keltirildi.

**B · Atama-intizomi (darsning eng nozik joyi)**
4. «qator» o'quvchi artefakti nomi sifatida OLIB TASHLANDI → «**uch maydon**». Sabab: m4-01 «qator = jadvaldagi yozuv» deb o'rgatgan, s9 da esa ekranda jadval turadi ([GATE S] 10-band).
5. s1 demosida «Maydon | Bo'lim» ustun-sarlavhalari ekrandan olindi (atama s2 da ochiladi) + o'ng bo'lakdagi ikki qiymat haqiqiy bo'limga almashtirildi.
6. «tavsiya» 2-slaydda hodisa bilan ochildi (ballanadigan matnga o'tadi — 21-qonun).
7. «mahsulot qarori» endi darsda AYTILADI (s6 ko'prigi) — avval faqat s15/flashcard/arenada, ya'ni o'rgatilmagan holda turgan edi.
8. s9 javob-qatorlaridan «qiymat» va «shart» olindi; jadval sarlavhasi to'liq shaklga keltirildi.
9. «ustun» s2 mentor gapida bir gapda ikki marta edi → bir marta (butun darsda 1 ✓).

**C · Ohang, kollokatsiya, kalka**
10. Hook: «Kecha besh marta tinglagan qo'shig'ingiz…» → odat-shakli (korpus §4 sun'iy «kecha…-ngiz» qolipi).
11. Payoff: «ilova sizni **tanimaydi**» → «yana o'zingiz qidirasiz» (4.1 aql-fe'li); «narxi bor» → «yutuq bor, yo'qotish ham bor».
12. s2 xulosasi: «o'sha lahzada **qoladi**» (teskari o'qilardi) → «faqat o'sha payt ko'rinadi».
13. s4: beshala tugma bir grammatik shaklda; «bo'lim **berdi**» → «bo'lim **ochdi**» (dars fe'li bilan).
14. s8 mentori: «Har maydonga bitta savol javob beradi» (teskari qurilma: savol maydonga javob berayotgandek) → «Har maydonga bitta savol bering».
15. Uy-vazifa: «busiz» · «sinovdan o'tkazasiz» → sodda shakl; RO'YXAT bandlari ≤5 so'zga tortildi (ETALON 25).
16. Nishon tavsiflari bajarilgan ishning O'ZIGA moslandi («xotira», «sababi bilan», «bo'lim yasadingiz» — uchalasi ham ekranda bo'lmagan ishni aytardi).

**D · Pedagogik bo'shliqlar**
17. s10 mentori: 6 yozuv → 4 yozuv o'tish-gapi MENTORGA dan o'quvchi pufagiga ko'chirildi (22-qonun yakka o'quvchi uchun ham bajarilsin).
18. s9 YORDAM 3-raundda yolg'on bo'lardi («faqat so'ralgan maydonga qarang») → korpus §92 bo'yicha ikkala maydonni ham qamraydi; 3-raund yorlig'iga ta'rif qo'shildi.
19. s2 mentori ekranda bo'lmagan narsani va'da qilardi («ustunlarni kim tanlashini ko'ramiz») → sahna + bitta harakat.
20. BLOK 5 dagi takrorlangan izoh-qator o'chirildi; SOFT o'qituvchiga qaratilgan shaklda qayta yozildi (106f(c)).

**Tekshiruvlar:** kirill **0** · qiyshiq apostrof **0** · «sen»-forma o'quvchi matnida **0** · SQL/NoSQL/Postgres/so'rov/filtr/metrika o'quvchi matnida **0** (barcha uchrashuvi senariy-izohida) · «ustun» o'quvchi matnida **1** (s2) · «panel/qism/oyna» bo'lim ma'nosida **0** · ekran-prozasi: s0 357 · s2 339 · s4 300 · s8 182 · s9 229 · s10 167 grapheme (chegara 400) · `npm run lint:til` → **0 error**.

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (0–98) · PM_KEYS_MEXANIKA_REGISTRI bo'yicha yozildi. `pm-metodist` SENARIY-KORREKTURASI bajarildi (2026-08-13). Keyingi qadam: **[GATE S]** — 14-bo'limdagi 11 savol.*

---

## ✅ [GATE S] YOPILDI — 2026-08-13, foydalanuvchi («tavsiyang bo'yicha»)

1. **Modul-ipi:** 🎧 musiqa olami QOLADI, ip artefakt orqali yuradi (96c(b)) — AvtoIjara olamiga ko'chirilmaydi.
2. **Koding = kompilyator** — TASDIQLANDI (navbat: M3-D14 VS Code → M4-D2 kompilyator, umumiy `HtmlCompiler` qatlami).
3. **Chiqish-artefakt 3 maydon** — 4-qator («saqlamaydigan narsa») majburiy EMAS.
4. **App.jsx m4-02 sub'dan «metrikalar» olib tashlandi** (29-qonun) — bajarildi.
5. **«maydon» hukmi** — TASDIQLANDI (m4-01 dalili bilan).
6. **s4 tugmalar 5 ta qoladi** (3 ochadi + 2 bo'sh).
7. **Foydasiz tugmalar** («Qayerda tinglandi», «kontaktlar») QOLADI — tugma hech narsa ochmaydi, atama o'rgatilmaydi, M4-D7 ga ko'prik.
8. **s9 3-raundi QOLADI** — variant (a): ulgurmaganlarga MENTORGA bandi bo'yicha birga yechiladi.
9. **s9 jadvali** — OQLANDI (SQL atamalarisiz, m4-06 ni oldinga tortmaydi).
10. 🔴 **Artefakt kaliti: `qatorlar` → `maydonlar`** — TASDIQLANDI. Yakuniy shakl:
    `pm-m4d2-data = { maydonlar: [ {maydon, bolim} × 3 ], savedAt }`. M4-D7 kirishi shunga moslangan.
11. **«tavsiya» gloss bilan qoladi** (2-slaydda hodisa bilan ochiladi).
