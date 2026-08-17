# M3-D10 — Qachon «tayyor» deb ayta olamiz? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/3-Modull/PmLesson9.jsx` (hozirgi `pm-acceptance-09-v16` — eski avlod dars
> BUTUNLAY almashadi; yangi `lessonId: pm-m3d10-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 3 — «Frontend — React» (oy 3–4.5) |
| **Dars** | M3-D10 (modulning 10-darsi) · `key: m3-10` |
| **Mavzu** | Ish qachon «tayyor» hisoblanadi — qabul shartlari (Acceptance Criteria) |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z shartlarini **yozadi**; artefakt = matn, keyingi darsga o'tadi (`PM_DARS_ETALON` 1-B). USTAXONA (48/80-qonun) **majburiy** |
| **Bosh keys** | **K10 · CYBERPUNK 2077** (temalar: *sifat · testlash · edge case · ishonch · QA jarayoni*) — mavzuga aynan mos |
| **ISHLATILGAN_KEYS (band)** | K1 · K3 · K5 · K8 · K11 (M3-D2) · K12 · K14 (M3-D5) · K17 · K18 · K19 → **K10 birinchi marta** ✓ |
| **Oldingi PM dars (M3-D5) TEKSHIRUV mexanikasi** | «yangi vaqtga qarab kartani boshqa katakka ko'chirish» — **takrorlanmaydi** |
| **Band mexanikalar (TAQIQ)** | **M3-D2**: 3 hikoya ustaxonasi · tekshiruvchi stoli (tayyorga hukm) · klinika (bo'laklardan yig'ish + tuzoq) · bir o'lchovli prioritet-doska · `hikoyaYasa` kompilyatori · PairTimer · **M3-D5**: ikki o'qli foyda-vaqt doskasi · hafta-chizig'i · rang-juftlash darvozasi · «dasturchi vaqtni qayta hisobladi» · **M2-D7**: bo'laklash-doska · **M7-D2/M8-D1**: MatchPairs |
| **Misol-ip (91 + 95 + 96c)** | 🎒 **Maktab bufeti — tanaffusda oldindan buyurtma** sayti. O'quvchi «Buyurtma berish» tugmasini buyurtma qildi, dasturchi «tayyor» dedi — endi shuni **qabul qilish** kerak. 95-qonun: o'smir bufetga har kuni boradi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · **o'yin-klub (M3-D5)** · Airbnb · Starbucks · Duolingo · Instagram — **bufet band emas** ✓ |
| **Kirish-artefakt** | `pm-m3d5-board` — M3-D5 da tanlangan **«birinchi qilinadigan ish»** + sababi. 🔴 Ikki tomonlama shart-tekshiruvi (F-0803-22-B saboqi): M3-D5 `{ items:[…], birinchi: id, sabab: "…" }` yozadi — o'quvchi dars aynan shu shakl va shu kalitni kutadi |
| **Chiqish-artefakt** | 🔴 `pm-m3d10-shartlar` = `{ ish: "…", shartlar: [3 ta matn], savedAt }` — M3-D14 (pitch) shu ishni «tayyor» deb ko'rsatadi |
| **Yordamchi kalitlar** | `pm-m3d10-hook-choice` (faqat YOZILADI — 100c) · `pm-m3d10-code` · `pm-m3d10-reflection` · `pm-m3d10-hw-target` · `ccProgress` |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D5 da tasdiqlangan yakun-tuzilmasi bilan bir xil |

**Atama-glosslar (62/39-qonun — avval hodisa, keyin nom):**
- 🔴 **«Acceptance Criteria» ekranga CHIQMAYDI** (korpus §20: markaziy atama bo'lsa qavs-gloss yetmaydi — o'zbekcha ibora atamaning O'RNINI oladi). Dars bo'ylab **«qabul shartlari»**, qisqartirilganda **«shartlar»**. Inglizcha juftlik faqat flashcard javobida: «Qabul shartlari (inglizchasi — Acceptance Criteria)»;
- 🔴 **«shart» so'zi tasdiqlandi** (metodist hukmi, korpus §80 «bir tushuncha — bir nom»): o'smir «shart»ni maktabdan biladi va **2-Modulda `if` sharti** bilan allaqachon uchrashgan — shu sabab s10 dagi «shartni kod tekshiradi» ko'prigi o'zi-o'zidan ochiladi. «Talab» OLINMAYDI (lug'at: rasmiy-idoraviy so'z), «tekshiruv» ham — u **harakat**, shartning o'zi emas. Dars bo'ylab: **shart** (nom) · **tekshirish** (harakat) · **kutilmagan holat** (odam adashadigan yo'l);
- 🔴 **«tayyor» — darsning o'zagi, ma'nosi BIR XIL turadi.** s2 da aniqlashadi — «tayyor» degani: **kelishilgan shartlarning hammasi bajarilgan** (43-qonun: teng/teng-emas belgilaridan yasalgan formula o'quvchi matnida ishlatilmaydi — ta'rif to'liq gap bo'ladi). Shundan keyin o'quvchi-matnida «tayyor» **boshqa ma'noda ishlatilmaydi**: ❌ «Bufet oynasi tayyor», ❌ «uchalasi tayyor bo'lgach» → ✅ «pastda turibdi», ✅ «uchtasi ham yozilgach». Istisno — dasturchining qo'shtirnoq ichidagi gapi («Tayyor, ishlaydi»);
- «edge case» → **ishlatilmaydi**; o'rniga «kutilmagan holat» (o'smir tilida).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «ISHGA TUSHIRIB KO'RISH»** (23-qonun: har darsda YANGI — P0 story-silosi · JTBD shtampi · Metrika alangasi · **M3-D5 ikki-o'qli doskasi** klonlanmaydi).

Ekranda **ishlaydigan mini-buyurtma oynasi** turadi (soxta bufet-formasi: taom tanlash, soni, «Buyurtma berish» tugmasi). Yonida — **shartlar ro'yxati**, har biri boshida kulrang `○`.

O'quvchi formani **haqiqatan bosib ko'radi**. Har harakat bitta shartga javob beradi:

| O'quvchi nima qiladi | Qaysi shart tekshiriladi | Ekranda chiqadigan qator |
|---|---|---|
| Taom tanlab yuboradi | «Taom tanlansa, tasdiq xabari chiqadi» | ✅ Tasdiq xabari chiqdi — shart bajarilgan |
| Bo'sh formani yuboradi | «Bo'sh buyurtma yuborilmaydi» | 🔴 Bo'sh buyurtma ham ketdi — shart bajarilmagan |
| Soniga 0 yozib yuboradi | «Taom soni kamida 1 ta bo'ladi» | 🔴 Soni 0 bo'lsa ham o'tdi — shart bajarilmagan |
| Tugmani tez ikki marta bosadi | «Tugma ikki marta bosilsa ham, bitta buyurtma ketadi» | 🔴 Ikkita buyurtma ketdi — shart bajarilmagan |

Shart tekshirilgach `○` → **✅ yoki 🔴** ga aylanadi, yoniga **bitta qisqa qator** chiqadi (yuqoridagi jadval) va qatordan chapga **ingichka chiziq** o'sadi (qaysi harakat qaysi shartni ochganini ko'rsatadi). 🔴 **106d/71-qonun:** rangli belgi yolg'iz qolmaydi — o'quvchi **nega** bajarilmaganini o'sha zahoti o'qiydi.

**Nima uchun aynan shu:** qabul shartlarini **o'qib** tushunib bo'lmaydi — ular **sinab ko'rilganda** ma'noga kiradi. Bola «tayyor» so'zi haqida gapirmaydi, u **o'zi tekshiradi** va dasturchi «tayyor» degan ish aslida tayyor emasligini **o'z qo'li bilan** topadi. Bu K10 keysining darsdagi kichik ko'rinishi.

🔴 **Mexanika-farqi (26/59-qonun):** M3-D5 da o'quvchi **joylashtirardi** (qaror), bu yerda **sinab ko'radi** (tekshiruv). Ikki xil ish, takror emas.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D5 dagidek — etalon (P0 · PmLesson2 · PmLesson4):
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Dasturchi "tayyor" dedi. Ishonasizmi?» | 1 | — | 2 ta holat · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — shartlar ro'yxati o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — «tayyor» so'zi nimani anglatadi | 3 | — | ikki ta'rif solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **ISHGA TUSHIRIB KO'RISH** (4 shart) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K10 Cyberpunk 2077 (4 slayd + 2 bashorat) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | USTAXONA — o'z ishiga **3 shart** yozish (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — qabul qadamlarini tartibga solish | 5 | — | 🔴 Timeline (yangi mexanika) |
| s10 | KODING — shartni tekshiradigan kod | 6 | — | 26/82/87-qonun |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 3 — Frontend: React
DARS: M3-D10 (10-dars)
DARS_MAVZUSI: Ish qachon «tayyor» hisoblanadi — qabul shartlari
ISHLATILGAN_KEYS: K10
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Maktab bufeti sayti uchun «Buyurtma berish» tugmasini so'ragandingiz.
Dasturchi bugun yozdi: «Tayyor, ishlaydi». Ishonasizmi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL natija ochiladi: tugma chindan ishlaydi, lekin bo'sh buyurtmani ham yuboraveradi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: «ishlaydi» va «tayyor» bir narsa emas.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi. «Ishonaman» deganlar ko'p bo'lsa — bu ham dars:
ishonch tekshiruvsiz beriladi, keyin muammo chiqadi.
```

**Ikki tanlov (104-qonun: teng og'irlikda, teng uzunlikda):**

| Tanlov | Ostidagi izoh (tanlangach ochiladi) |
|---|---|
| 👍 Ishonaman — dasturchi tekshirgandir | Ochib ko'ramiz: tugma ishlaydi. Lekin **bo'sh** buyurtma ham ketaverdi. |
| 🤔 O'zim ochib ko'raman | Ochib ko'ramiz: tugma ishlaydi. Lekin **bo'sh** buyurtma ham ketaverdi. |

> 🔴 **104-qonun (teng og'irlik):** hookda to'g'ri javob YO'Q — shuning uchun izoh ikkala tanlovda
> **bir xil** va **maqtovsiz**: ❌ «To'g'ri qildingiz…» (bitta tanlovni to'g'ri deb ko'rsatadi va
> ikkinchisini tanlagan o'quvchini aybdor qiladi).
> 🔴 **97-qonun:** savol o'quvchi og'zidan tabiiy chiqadi — «tayyor dedi, ishonasizmi?».
> 🔴 **100-qonun:** tanlov `pm-m3d10-hook-choice` ga yoziladi, hech qayerda o'qilmaydi.
> 🔴 **62-qonun:** «qabul shartlari» atamasi bu ekranda YO'Q — u s2 da ochiladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi — M3-D5 saboqi):** ovoz-diagrammasi FAQAT jonli darsda
> chiqadi. O'quvchi ekranidagi matnda «ko'pchilik», «sinf», «ovozlar» so'zlari **0** — payoff
> ikkala rejimda so'zma-so'z bir xil o'qiladi. Sinf-kuzatuvi MENTORGA maydonida qoladi.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida «tayyor» so'zini uchta aniq shartga aylantira olasiz —
va dasturchi ishni topshirganda ularni birma-bir tekshirasiz.
HARAKAT: O'quvchi kuzatadi: bo'sh ro'yxatga uchta shart o'z-o'zidan yozilib chiqadi,
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

> 🔴 **40-qonun:** «aylantira olasiz» / «tekshira olasiz» — bilim, rost.
> 🔴 **42-qonun (fe'l ↔ ekran jarayoni):** ro'yxat «to'ladi» EMAS (suvni eslatadi) — **«o'z-o'zidan yozilib chiqadi»**; mentor-eslatmasida ham shu fe'l.
> 🔴 **54(b/c):** `ta-sub` ikkinchi qatori YO'Q · demo ostidagi caption YO'Q.
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo-ro'yxatdagi 3 shart s4 dagi 4 shartga **kirmaydi** — boshqa ish uchun yozilgan (masalan «Menyuni ko'rish» tugmasi).

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (ishga tushirib ko'rish) + 3 × Quiz
EKRAN: «Ishlaydi» va «tayyor» — bir narsa emas. «Ishlaydi» — bitta yo'l tekshirilgan:
hammasi to'g'ri kiritilganda. «Tayyor» — odam adashadigan yo'llar ham tekshirilgan.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) buyurtma oynasini o'zi bosib
ko'radi va to'rt shartning qaysi biri bajarilganini topadi; (s6) keys-slaydlarini
bashorat bilan ochadi.
JAVOB: s4 — to'rt shartdan 1 tasi bajarilgan, 3 tasi yo'q (jadval quyida).
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da o'quvchilar tugmani ikki marta bosishni o'zlari topmasligi mumkin —
«tugmani tez ikki marta bosib ko'ring» deb turtki bering, keyin muhokama qiling.
```

**s2 — TEORIYA-1: «ishlaydi» ↔ «tayyor»** (73-korpus: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat): **«Dasturchi «ishlaydi» dedi — bu «tayyor» deganimi?»**

Ikki karta, bosilganda ochiladi (46-qonun: toggle):

| Karta | Ochilganda |
|---|---|
| 🔧 **Dasturchi «ishlaydi» deganda** | Kod ishladi, tugma bosildi, buyurtma ketdi |
| ✅ **Siz «tayyor» deganda** | Oldindan kelishilgan **hamma** shart bajarildi — kutilmagan holatlarda ham |

Xulosa-karta (69-qonun · uch qisqa gap · blok-gapining O'ZI):
> **«Ishlaydi» va «tayyor» — bir narsa emas.** «Ishlaydi» — bitta yo'l tekshirilgan: hammasi to'g'ri kiritilganda. «Tayyor» — odam adashadigan yo'llar ham tekshirilgan.

> 🔴 **66/42-qonun:** ❌ «Kod xato bermadi» (dasturchi tili + inkor) → ✅ «Kod ishladi».
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi (❌ «Ikkovi bir narsa emas» — nimaning ikkovi?) — predmet nomlanadi.
> 🔴 **Ekran-o'lchovi (Intl.Segmenter):** sarlavha + 2 karta + xulosa = **375 grapheme** (chegara 400). Shuning uchun «shartlar ish boshlanishidan oldin yoziladi» qatori bu ekranga QO'SHILMAYDI — u keys-ko'prigida aytiladi va s9 da o'quvchining O'ZI topadi (korpus §72: bir g'oya ikki martadan ko'p aytilmaydi).

**s4 — YADRO: ISHGA TUSHIRIB KO'RISH** (markaziy mexanika)

Sarlavha (47-qonun — buyruq): **«To'rt shartni o'zingiz bosib tekshiring.»**

Mentor (≤2 gap, 92a):
> Bufet oynasi pastda turibdi, yonida to'rtta shart yozilgan. Qaysi biri chindan bajarilganini **o'zingiz bosib** toping.

**To'rt shart va haqiqiy holat:**

| # | Shart (o'quvchi ekranida shu matn turadi) | Natija-qatori (harakatdan keyin chiqadi) |
|---|---|---|
| 1 | Taom tanlansa, tasdiq xabari chiqadi | ✅ Tasdiq xabari chiqdi — shart bajarilgan |
| 2 | Bo'sh buyurtma yuborilmaydi | 🔴 Bo'sh buyurtma ham ketdi — shart bajarilmagan |
| 3 | Taom soni kamida 1 ta bo'ladi | 🔴 Soni 0 bo'lsa ham o'tdi — shart bajarilmagan |
| 4 | Tugma ikki marta bosilsa ham, bitta buyurtma ketadi | 🔴 Ikkita buyurtma ketdi — shart bajarilmagan |

🔴 **«Qanday tekshiriladi» ustuni o'quvchi ekranida YO'Q** (98b: javob mashq ustida yozilmaydi) — u faqat mentor kaliti: 1) taom tanlab yuborish · 2) hech narsa tanlamay yuborish · 3) soniga 0 yozib yuborish · 4) tugmani tez ikki marta bosish.

Yakun-qatori (bitta gap):
> ✅ **Sinab ko'rdingiz: to'rt shartdan bittasi bajarilgan — ish hali tayyor emas.**

> 🔴 **98b/60-qonun:** mentor qaysi shart bajarilmaganini AYTMAYDI — o'quvchi o'zi topadi.
> 🔴 **72-qonun:** buyurtma oynasi yorliqli idishda, diqqat-pulsi bilan; birinchi bosishdan keyin puls tinadi.
> 🔴 **106d/71-qonun:** har harakatdan keyin javob darhol chiqadi — belgi (`○` → ✅/🔴) **va** yonidagi qisqa qator: o'quvchi nega bajarilmaganini o'qiydi, taxmin qilmaydi.
> 🔴 **Shart-matni o'zi harakatni aytadi:** ❌ «Soni kamida 1» (nimaning soni?), ❌ «Ikki marta bosilsa…» (nima bosiladi?) → ✅ egasi aytilgan to'liq gap.

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (USTAXONA) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish ustaxonasi)
EKRAN: (sarlavha) Ishingizga uchta shart yozing.
(mentor, 1 gap) O'tgan darsda «birinchi qilinadigan» deb tanlagan ishingiz pastda
turibdi — dasturchi «tayyor» deganda aynan shu uchta shartni tekshirasiz.
HARAKAT: Uchta shartni BITTALAB yozadi. Har saqlashda shart o'ngdagi ro'yxatga
ko'chadi, chapga yangi bo'sh maydon keladi.
JAVOB: Uchala shart yozilgan · har biri TEKSHIRIB BO'LADIGAN (o'lchov yoki aniq
harakat bor) · «chiroyli», «qulay», «tez» kabi tekshirib bo'lmaydigan so'zlar yo'q.
RO'YXAT: Uchta shart yozilgan · Har biri tekshiriladigan · Bittasi kutilmagan holat haqida
YULDUZCHA: To'rtinchi shartni yozing — odam eng ko'p adashadigan joy uchun.
YORDAM: O'zingizga savol bering: buni qanday tekshiraman? Javob topilmasa —
shartni qayta yozing.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Sayt chiroyli bo'lsin» kabi shartlar chiqadi — bu eng foydali xato.
Javob-qatori uni tutadi, siz muhokama qiling: buni qanday tekshirasiz?
```

🔴 **Kirish-artefakt tarmog'i (69-korpus — ikki tarmoq bir shaklda, bir uzunlikda):**
- **Artefakt BOR:** «O'tgan darsda «birinchi qilinadigan» deb tanlagan ishingiz pastda turibdi — dasturchi «tayyor» deganda aynan shu uchta shartni tekshirasiz.»
- **Artefakt YO'Q:** «Boshlash uchun bufet ishini olamiz: «Buyurtma berish» tugmasi pastda turibdi — dasturchi «tayyor» deganda aynan shu uchta shartni tekshirasiz.»
- 🔴 «topilmadi / saqlanmagan / bo'sh» so'zlari **0** · zaxira-namuna **shu darsning O'Z olamidan** (bufet, 96c-d).
- 🔴 **Kartada faqat ishning NOMI turadi.** M3-D5 doskasidan kelgan `foyda`/`vaqt` yorliqlari (⏱ 3 hafta kabi) bu ekranda KO'RSATILMAYDI: ular bu darsda hech qanday ish so'ramaydi va manbasi ham tushuntirilmagan bo'ladi (86b + korpus §95).
- 🔴 **Olam farqi normal:** o'quvchining ishi M3-D5 dan (o'yin-klub sayti) keladi, darsning demo-olami esa bufet — 96c(b/d) bo'yicha bu to'g'ri; **shuning uchun matnda «bufet ishingiz» deb yozilmaydi**, doim «o'z ishingiz».

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q):**
- tekshirib bo'lmaydigan so'z topilsa → «Buni qanday tekshirasiz? Aniq harakat yoki son yozing.»
- oldingi shartga juda o'xshash → «Bu shart yuqoridagiga o'xshash — boshqa holatni oling.»
- juda qisqa (2-3 so'z) → «Qisqa qoldi: nima bo'lishi kerakligini to'liq gap bilan yozing.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Timeline (qadamlarni tartibga solish)
EKRAN: Ishni qabul qilish tartibi aralashib ketdi. Beshta qadamni to'g'ri ketma-ketlikka joylang.
HARAKAT: Beshta qadam-kartani to'g'ri tartibda joylashtiradi.
JAVOB: 1) Shartlarni yozamiz → 2) Shartlarni dasturchiga beramiz → 3) Dasturchi kodni
yozadi → 4) Har shartni birma-bir tekshiramiz → 5) Hammasi bajarilsa, «tayyor» deymiz
RO'YXAT: —
YULDUZCHA: —
YORDAM: Bitta savol yetadi: shartlar ish boshlanishidan OLDIN yoziladimi yoki keyinmi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Shartlarni dasturchi bilan BIRGA o'qib chiqing — u «bu qanday tekshiriladi?»
deb so'rasa, shart yaxshi yozilmagan. Sinfda juftlikda sinab ko'ring.
MENTORGA: Eng ko'p adashiladigan joy — shartlarni ishdan KEYIN yozish.
Aynan shu tartib butun darsning ma'nosi.
```

Yakun-qatori:
> ✅ **Shartlar ish boshlanishidan oldin yoziladi — keyin bahs qolmaydi.**

> 🔴 **26-qonun tekshiruvi:** M3-D5 TEKSHIRUVi «kartani boshqa katakka ko'chirish» edi; bu yerda **ketma-ketlikka joylash**. Takror YO'Q ✓
> 🔴 **106d + korpus §77/§98 (M3-D5 saboqi — mashq javobsiz qolmaydi):** karta noto'g'ri joyga tushsa, u qaytib chiqadi va **bitta qoida-qatori** ko'rinadi: «🤔 Shart bajarilganini tekshirish uchun avval shartning O'ZI yozilgan bo'lishi kerak.» — qoida beriladi, qaysi karta qayerga borishi AYTILMAYDI. YORDAM-savoli ekran boshida TURMAYDI: u faqat birinchi xatodan keyin ochiladi.
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda). 🔴 **106f(c):** SOFT matni — sinf ish-tartibi, shuning uchun u `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge
EKRAN: (sarlavha) Shartlarni tekshiradigan kod yozamiz.
(mentor) Buyurtmani qabul qilsa bo'ladimi — shuni aytadigan funksiyani siz to'ldirasiz.
HARAKAT: qabulQilinadimi(buyurtma) funksiyasini to'ldiradi: uchta shartni tekshiradi
va true/false qaytaradi. Keyin to'rtta buyurtma bilan sinab ko'radi.
JAVOB: To'rtala sinov to'g'ri natija beradi (1 ta true, 3 ta false — har shart bittadan sinaladi).
RO'YXAT: Uchta shart tekshirilgan · true yoki false qaytadi · To'rt sinov to'g'ri chiqdi
YULDUZCHA: To'rtinchi shart qo'shing — buyurtma bufet ish vaqtida berilgan bo'lsin.
YORDAM: Bitta shartdan boshlang: taom tanlanganmi? Ishlagach keyingisini qo'shing.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod qabul shartlarining to'g'ridan-to'g'ri tarjimasi — shuni ochiq ayting:
o'quvchi hozirgina o'z ishiga yozgan uchta shart ham xuddi shunday kodga aylanadi.
```

> 🔴 **87-qonun (o'tilgan texnik material):** m3-06 props · **m3-08 `fetch`, JSON, loading** · **m3-09 POST/PUT/DELETE** · `useState`/`useEffect`/`map` · M2 dan `if`, taqqoslash operatorlari. Topshiriqda shundan tashqari hech narsa yo'q.
> 🔴 **26-qonun (mexanika almashadi):** M3-D2 kompilyator → M3-D5 VS Code topshirig'i → **M3-D10 kompilyator** (navbat bilan). ⚠️ Bu GATE S qarori — 14-bo'lim 3-bandiga qarang.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uchta shartingizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan ayting: o'z ishingizga qanday uchta shart yozdingiz va
ularni qanday tekshirasiz? Avval sherigingizga ayting, keyin bir qatorda yozing.
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
MENTORGA: Uchdan biri «qanday tekshiraman» degan savolga javob berolmasa —
s4 dagi buyurtma oynasini qayta oching va bitta shartni birga tekshiring.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha «O'zingizni sinab ko'ring.»
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'qiyotgan o'quvchida sherik YO'Q — unga «Avval **ovoz chiqarib o'zingizga** ayting, keyin bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda shartlaringizni sinovdan o'tkazasiz: har biriga «buni qanday tekshiraman?»
degan javob yozasiz — xuddi bufet oynasini bosib ko'rganingizdek. Qancha vaqtingiz bor —
o'zingiz tanlaysiz.
HARAKAT: Uch shartga tekshirish-usulini yozadi; bittasini kutilmagan holatga moslaydi.
JAVOB: —
RO'YXAT: Har shartga tekshirish-usuli yozilgan · Bittasi kutilmagan holat haqida ·
Uchalasi ham son yoki aniq harakat bilan yozilgan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Bitta shartga tekshirish-usulini yozing — eng muhimiga.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa.
Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **11-korpus:** topshiriq kartasi 3 raqamli qadam + muddat; **yakun-ekranda AYNAN shu takrorlanadi**.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI va qadamlarni aytmaydi — «uch shart», «bittasini» kabi sanoq faqat To'liq-kartada turadi, aks holda «Qisqa» tanlagan o'quvchi ikki xil topshiriqni birga o'qiydi.
> 🔴 **Namunasiz harakat taqiqi (M3-D5 saboqi):** vazifadagi har ish darsda KO'RSATILGAN — «qanday tekshiraman?» javobi s4 da bosib ko'rilgan, «kutilmagan holat» s2/s4 da ochilgan, YULDUZCHA da esa allaqachon bir marta yozilgan.

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
MAVZU: «Ishlaydi» va «tayyor» farqi; qabul shartlari qachon yoziladi (ishdan OLDIN);
tekshirib bo'ladigan va bo'lmaydigan shart; kutilmagan holat; tutilmagan nosozlik
eng ko'p nimani yo'qotadi (Cyberpunk 2077 voqeasi); shartlarni kodga aylantirish.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🔧 Dasturchi «ishlaydi» dedi. Bu nimani anglatadi?
- A. Hamma shart bajarilgan, ish qabul qilinadi *(42)*
- **B.** Bitta yo'l tekshirilgan — hammasi to'g'ri kiritilganda ✅ *(54)*
- C. Kodda birorta xato qolmagan — hammasi joyida *(44)*

**Reveal:** To'g'ri — «ishlaydi» bitta yo'lni aytadi; qolgan yo'llar hali tekshirilmagan.

> 🔴 **64-qonun:** ❌ eski C «Kod xatosiz yozilgan va tekshirishga hojat yo'q» — «hojat» kitobiy so'z, ustiga variant o'zini fosh qiladi (korpus §21: dars aynan tekshirish haqida edi). Yangi C ishonarli: «ishlaydi» ni «kodda xato yo'q» deb tushunish — hayotda eng ko'p qilinadigan xato. Uzunlik: 42 · 54 · 44 (tell 1.29 ✓).

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 📋 To'rt shartdan uchtasi bajarilmadi. Ish qabul qilinadimi?
- A. Ha — eng muhim shart bajarilgan *(31)*
- B. Ha, qolganini keyin tuzatishadi *(31)*
- **C.** Yo'q — hamma shart bajarilishi kerak ✅ *(36)*

**Reveal:** To'g'ri — «tayyor» degani kelishilgan shartlarning **hammasi** bajarilgani.

> 🔴 Grammatika: ❌ «qolganini keyin tuzatiladi» (tushum kelishigi + majhul nisbat to'qnashadi) → ✅ «qolganini keyin tuzatishadi». Emoji ✅ savol oldida TURMAYDI (u «bajarildi» degan yolg'on signal beradi) → 📋. Uzunlik: 31 · 31 · 36 (tell 1.16 ✓).

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 🎮 O'yin nosoz chiqdi. Eng katta yo'qotish nima bo'ldi?
- **A.** Odamlarning ishonchi yo'qoldi ✅ *(29)*
- B. Boshqa o'yinlar sotuvi tushdi *(28)*
- C. Yangi o'yinlar keyinga surildi *(30)*

**Reveal:** To'g'ri — tutilmagan nosozlik kodda emas, odamlarning **ishonchida** qimmatga tushdi.

> 🔴 **17-qonun (bitta himoyalanadigan javob):** ❌ eski A «Odamlar ishonchini yo'qotdi **va pulini qaytarib oldi**» ikki hodisani bitta variantga tiqadi, ❌ eski B «Dasturchilar yangi kod yozishga majbur bo'ldi» esa keysda ROST bo'lgan gap edi — ikki javob himoyalanardi. Yangi B/C — keysda AYTILMAGAN, lekin hayotda bo'lishi mumkin bo'lgan oqibatlar (§21: o'zini fosh qilmaydi). Uzunlik: 29 · 28 · 30 (tell 1.07 ✓).

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 📋 Qaysi shartni tekshirib bo'ladi?
- A. Sayt chiroyli va zamonaviy ko'rinadi *(36)*
- **B.** Bo'sh buyurtma yuborilsa, xabar chiqadi ✅ *(39)*
- C. Foydalanuvchiga qulay va tushunarli bo'ladi *(43)*

**Reveal:** To'g'ri — buni bosib ko'rish mumkin; qolgan ikkitasini har kim boshqacha baholaydi.

> 🔴 B darsning O'Z so'zlari bilan yozildi (s4 · 2-shart): ❌ «ogohlantirish chiqadi» — bu so'z darsda umuman ishlatilmagan. Uzunlik: 36 · 39 · 43 (tell 1.19 ✓).

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask`.

---

## 5. USTAXONA SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — yozilgani yashil ✓, joriysi indigo-pulsda, kelgusi kulrang-punktir.

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida bitta maydon + jonli hint.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI (chalg'itmasin) — faqat indikator chirog'i yonadi; uchtasi ham yozilgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda).

**Placeholder (92c/85):** `«Nimani tekshirasiz?»` — qisqa savol, tayyor javob maydonda TURMAYDI, namuna-chip YO'Q.

**106d javob (ikki tomonlama):**
- ✅ «Buni bosib tekshirsa bo'ladi — shart shunday yoziladi.»
- 🤔 «Buni qanday tekshirasiz? Aniq harakat yoki son yozing.»

**Tekshirib bo'lmaydigan so'zlar ro'yxati** (dars o'z lug'atidan — 106d(c)): *chiroyli · qulay · tez · zamonaviy · yaxshi · sifatli · tushunarli*. O'quvchi shulardan birini yozsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K10 · 91b/33/42/43/56)

**Freym (91b):** eyebrow — **«🎮 Haqiqiy voqea»**, K-kodi ekranga chiqmaydi.

**4 slayd (hikoya tilida — 42-qonun · ovoz chiqarib o'qib tekshirildi):**

1. **2020-yil, dekabr.** Uzoq kutilgan katta o'yin chiqdi — **Cyberpunk 2077**. Chiqqan kuni uni juda ko'p odam sotib oldi.
2. **Lekin o'yin nosoz chiqdi.** Ayniqsa PlayStation'da: o'yin qotib qolardi, ba'zi joylarda umuman o'ynab bo'lmasdi.
3. *(bashorat)* **Sizningcha, keyin nima bo'ldi?**
4. **Sony o'yinni PlayStation do'konidan olib tashladi** — qariyb yarim yilga. Odamlarga puli qaytarildi. Nosozliklar kodda edi, zarar esa **ishonchda**.

**Bashorat (3-slayddan oldin, zinapoya tartibida — 43-qonun · bitta o'lchov: o'yinning do'kondagi taqdiri):**
- «Nosozliklar tuzatildi, o'yin do'konda qoldi» *(43)*
- «O'yin arzonlashtirildi, do'konda qoldi» *(38)*
- «O'yin do'kondan butunlay olib tashlandi» ✅ *(39)*

**Natija-qatori (56/100-qonun):** topsa «🎯 Topdingiz! O'yin do'kondan olib tashlandi» — quyruqsiz; adashsa «Adashdingiz — asl javob: o'yin do'kondan olib tashlandi». 🔴 «Bu ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — to'liq nom bilan):**
> Cyberpunk 2077 chiqishdan oldin ham «ishlaydi» deyilgan edi. Yetishmagani — oldindan yozilgan **qabul shartlari**. Endi o'z ishingizga shunday shartlarni o'zingiz yozasiz.

> 🔴 **10-qonun (keys-sadoqati — metodist tekshiruvi bajarildi):** bankda faqat shu bor — nosozliklar (ayniqsa konsollarda), pul qaytarish to'lqini, Sony o'yinni PlayStation Store'dan **qariyb yarim yilga** yechib qo'ydi, sana **dekabr 2020**. Shuning uchun: ❌ «millionlab odam» (bankda YO'Q) → ✅ «juda ko'p odam»; ❌ «yillar davomida kutishgan» (bankda YO'Q, o'lchov-da'vo) → ✅ «uzoq kutilgan»; ❌ «pristavkalarda» (rus so'zi, umumiy) → ✅ **PlayStation** (bankdagi aniq nom, korpus §57); ❌ «Sotuvchi» (kim ekani noaniq) → ✅ **Sony**.
> 🔴 **Bashorat halolligi (17/64-qonun):** ❌ eski 2-variant «Pul qaytarish boshlandi» — 4-slaydda bu ROST bo'lib chiqadi, ya'ni to'g'ri belgilagan o'quvchiga «Adashdingiz» deyilardi. Yangi uchlik bir o'lchovda va bir-birini inkor qiladi.
> 🔴 **Ko'prik:** ❌ «kim, qaysi holatlarni, qanday tekshiradi» — slot-sanog'i (63-qonun); ❌ «Sizning **bufet** ishingizda» — o'quvchining ishi M3-D5 dan (o'yin-klub) keladi, bufet emas.

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun)

**Darvoza-mashq (82e):** uchta shartni «tekshirib bo'ladi / bo'lmaydi» ga ajratish (darsning O'Z bilimi).

**Boshlang'ich kod:**

```js
function qabulQilinadimi(buyurtma) {
  // Uchta shart: taom tanlangan · soni kamida 1 · vaqt kiritilgan
  return false;   // ← bu joyni siz to'ldirasiz
}

console.log(qabulQilinadimi({ taom: 'somsa', soni: 2, vaqt: '11:30' }));
console.log(qabulQilinadimi({ taom: '',      soni: 2, vaqt: '11:30' }));
console.log(qabulQilinadimi({ taom: 'somsa', soni: 0, vaqt: '11:30' }));
console.log(qabulQilinadimi({ taom: 'somsa', soni: 2, vaqt: ''      }));
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. Uchta shart tekshirilgan
2. Funksiya `true` yoki `false` qaytaradi
3. To'rt sinov to'g'ri chiqdi (`true`, `false`, `false`, `false`)

**YORDAM (yechimni aytmaydi — 77-korpus):** Bitta shartdan boshlang: taom tanlanganmi? Ishlagach keyingisini qo'shing.

**YULDUZCHA:** To'rtinchi shart — buyurtma bufet ish vaqtida berilgan bo'lsin.

> 🔴 **Sanoq-mosligi (22-qonun) tuzatildi:** oldin uchta shart e'lon qilinib, sinov faqat **ikkitasini** sinardi — uchinchisi («vaqt kiritilgan») hech qachon buzilmasdi va o'quvchi uni yozmasa ham «uchala sinov o'tdi» chiqardi. Endi **har shart bittadan sinaladi**: 1 ta `true` + 3 ta `false`. Ustiga bu s4 bilan ham qofiyalanadi (u yerda ham to'rt sinash bor).
> 🔴 **48-korpus:** sarlavha natijani aytadi — ✅ «Shartlarni tekshiradigan **kod** yozamiz» (82a sarlavha-oilasi), ❌ «kod tayyorlaymiz», ❌ «Shartni **odam emas**, kod tekshiradigan qilamiz» (inkordan boshlangan gap — korpus §73).
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi.
> 🔴 **Pedagogik ulanish:** kod — s8 dagi shartlarning to'g'ridan-to'g'ri tarjimasi. Mentor buni ochiq aytadi (87c: bog'lanish halol ko'rsatiladi).

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Ro'yxat CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo-shartlar s4 **to'rtligiga** KIRMAYDI (M3-D5 spoyler-saboqi) |
| **s12 REFLEKSIYA** | Sarlavha: «Uchta shartingizni yoddan ayta olasizmi?» · juftlik-taymer + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga» |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal gap): «"Ishlaydi" — bitta yo'l tekshirilgani, xolos.» · «"Tayyor" — kelishilgan hamma shart bajarilgani.» · «Shartlar ish boshlanishidan oldin yoziladi.» · «Yaxshi shartda aniq harakat yoki son bo'ladi.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s2 · s12) esa sarlavha — savol-murojaat |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | «Ishlaydi» nimani anglatadi? | s2 |
| 2 | «Tayyor» nimani anglatadi? | s2 |
| 3 | Shartlar qachon yoziladi — ishdan oldinmi, keyinmi? | s9 |
| 4 | Bo'sh buyurtma yuborilsa, shart bajarilganmi? | s4 |
| 5 | Tugma tez ikki marta bosilsa, nechta buyurtma ketishi kerak? | s4 |
| 6 | To'rt shartdan uchtasi bajarilmasa, ish qabul qilinadimi? | s4 + s5 |
| 7 | «Sayt chiroyli bo'lsin» — bu yaxshi shartmi? | s8 + s11 |
| 8 | Tekshirib bo'ladigan shartda nima bo'lishi kerak? | s8 |
| 9 | Cyberpunk 2077 bilan nima sodir bo'ldi? | s6 |
| 10 | Tutilmagan nosozlik eng ko'p nimani yo'qotdi? | s6 |
| 11 | Shartlarni kim bilan birga o'qib chiqasiz? | s9 (SOFT) |
| 12 | Kod shart bajarilganini qanday aytadi? | s10 |

> 🔴 **21-qonun (scored-matn glossi):** bu darsda ballanadigan matnda izohsiz chet so'z YO'Q — «Acceptance Criteria», «edge case», «bug», «QA» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «shart», «kutilmagan holat», «nosozlik» so'zlari bilan yoziladi.
> 🔴 Aniqlashtirildi: ❌ 5 «nima tekshiriladi?» (javobi noaniq) · ❌ 10 «nimaga qimmatga tushdi?» (g'aliz qurilma) · ❌ 11 «Shartni kim bilan birga o'qib chiqiladi?» (ega yo'q, majhul nisbat) · ❌ 12 «Kod shartni qanday aytadi?» (nimani aytadi?).

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Bug Hunter!** | Uch nosozlikni o'zingiz topdingiz | 32 | s4: 4/4 shart tekshirildi |
| **Clear Terms!** | Uchta tekshiriladigan shart yozdingiz | 37 | s8: 3/3 saqlandi |
| **Right Order!** | Qabul tartibini to'g'ri joyladingiz | 35 | s9: 5/5 to'g'ri |
| **Code Checker!** | Shartlarni kodga aylantirdingiz | 31 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓ (o'zbekcha nishon-nomi O'TMAYDI), 4/4 tavsif o'zbekcha siz-formada, hammasi ≤48 belgi ✓.
> 🔴 ❌ «Shartni kod tekshiradigan qildingiz» — g'aliz qurilma («…digan qildingiz») → ✅ «Shartlarni kodga aylantirdingiz» (bitta harakat, bitta nafas — korpus §63).

---

## 11. FLASHCARD (10 ta — 76-korpus: tarjimasiz chet so'z yo'q)

| # | Savol | Javob |
|---|---|---|
| 1 | «Ishlaydi» nimani anglatadi? | Bitta yo'l tekshirilgan |
| 2 | «Tayyor» nimani anglatadi? | Kelishilgan hamma shart bajarilgan |
| 3 | Dasturchiga oldindan beriladigan shartlar ro'yxati qanday ataladi? | Qabul shartlari (inglizchasi — Acceptance Criteria) |
| 4 | Shartlar qachon yoziladi? | Ish boshlanishidan oldin |
| 5 | Yaxshi shartda nima bo'ladi? | Aniq harakat yoki son — tekshirib bo'ladi |
| 6 | «Chiroyli bo'lsin» nega yomon shart? | Har kim boshqacha baholaydi |
| 7 | Kutilmagan holat nima? | Odam adashadigan yo'l — bo'sh yuborish, ikki marta bosish |
| 8 | Bitta shart bajarilmasa nima bo'ladi? | Ish hali tayyor emas |
| 9 | Shartlarni kim bilan birga o'qib chiqasiz? | Ishni bajaradigan dasturchi bilan |
| 10 | Kod shart bajarilganini qanday aytadi? | `true` yoki `false` qaytaradi |

> 🔴 **Korpus §24 (referentsiz ko'rsatkich):** ❌ 3-karta «**Bu** ro'yxatning nomi nima?» — karta yolg'iz turadi, «bu» nimaga ishora qilishi ko'rinmaydi → predmet nomlandi.
> 🔴 **Korpus §90(e):** javob darsda ishlatilgan nom bilan — ❌ «Ishni yozadigan odam» → ✅ «dasturchi» (dars bo'ylab shu so'z).
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ («ishlaydi» · «tayyor» · atama · qachon · qanday yoziladi · yomon shart · kutilmagan holat · bitta shart yetmasa · kim bilan · kodda).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «"Ishlaydi" — hali "tayyor" emas»** — (1) ikki ta'rif farqi · (2) nega bu farq muhim · (3) sinfga savol
**s5 · «Hamma shart»** — (1) bittasi bajarilmasa tayyor emas · (2) shuning uchun ro'yxat qisqa bo'ladi · (3) savol
**s7 · «Tutilmagan nosozlik narxi»** — (1) Cyberpunk 2077 xulosasi · (2) ishonch kodda emas, odamda · (3) savol
**s11 · «Tekshiriladigan shart»** — (1) aniq harakat yoki son · (2) baholanadigan so'zlar yaramaydi · (3) savol

> 🔴 **43-qonun (belgi-formula taqiqi):** karta sarlavhasi oldin «teng-emas» belgisi bilan yozilgan edi — bunday matematik belgi o'quvchi-matnida ISHLATILMAYDI, to'liq sodda gap yoziladi.
> 🔴 **K-kod ekranga oqmaydi:** ❌ «K10 xulosasi» → keys nomi bilan.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K10** — ishlatilmagan ✓
6. TEKSHIRUV mexanikasi oldingi darsni (karta ko'chirish) takrorlamaydi ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): bufet — s0 dan s15 gacha; keys 91b freymi bilan kiradi va ko'prik bilan qaytadi ✓
- 95 (Toshkent o'smiri): maktab bufeti ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas ✓
- 26 (koding mexanikasi almashadi): VS Code → kompilyator ✓ *(GATE S tasdig'i kerak)*
- 87 (o'tilgan material): `if` · taqqoslash · obyekt · `console.log` ✓
- 47: `?</h2>` interaktiv ekranlarda 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda ≤1) ✓
- **M3-D5 saboqi:** s1 demo-namunasi s4 mashqining javobini oshkor qilmaydi ✓

**Metodist-korrekturasi darvozalari (2026-08-12 — M3-D5 👦 darvozasining 4 topilmasi):**
1. **Yakka rejimda yolg'on gap YO'Q** (korpus §97): s0 ovoz-diagrammasi faqat jonli rejimda; payoff-matni ikkala tanlov va ikkala rejim uchun bir xil; s12 «sherigingizga» tarmog'i yakka rejimda almashadi; «ko'pchilik/sinf/ovozlar» o'quvchi matnida **0** ✓
2. **Referentsiz ko'rsatkich-so'z YO'Q** (korpus §24): «Ikkovi bir narsa emas» → predmetli xulosa · flashcard «Bu ro'yxatning nomi» → predmetli savol. Qolgan «bu» lar bevosita oldingi gapdagi predmetga ishora qiladi (TEST-1: «Dasturchi «ishlaydi» dedi. **Bu** nimani anglatadi?») ✓
3. **Har mashq javob-manbali** (106d): s4 — belgi + qisqa sabab-qatori · s8 — ikki tomonlama javob · s9 — xatodan keyin qoida-ipuchasi (javobni aytmaydi) · s10 — 4 sinov natijasi ✓
4. **Namunasiz harakat YO'Q:** uy-vazifadagi har ish darsda ko'rsatilgan (s4 bosib tekshirish · s8 YULDUZCHA · s2/s4 kutilmagan holat) ✓
5. **Sanoq-mosligi (22-qonun):** 4 shart (s4/s5/arena-6) · 3 shart (s8/s10/uy-vazifa) · 5 qadam (s9) · 4 sinov (s10) · 12 arena savoli · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator — hammasi matn bilan mos ✓
6. **«tayyor» ma'nosi bir xil** (korpus §80): o'quvchi-matnida faqat «kelishilgan hamma shart bajarilgan» ma'nosida yoki qo'shtirnoq ichida ✓

---

## 14. ✅ [GATE S] — FOYDALANUVCHI QARORLARI (2026-08-12, YOPILDI)

> 🔴 **Quruvchi uchun majburiy:** 8 qaror tasdiqlangan. Qurishda shulardan chetga chiqilmaydi.

| # | Qaror | Hukm |
|---|---|---|
| 1 | **Dars sarlavhasi** | ✅ **ALMASHADI.** `App.jsx` `m3-10`: title → **«Qachon "tayyor" deb ayta olamiz?»** · sub → **«ishni qabul qilish shartlari»** |
| 2 | **Misol-olam** | ✅ 🎒 **Maktab bufeti** — tanaffusda oldindan buyurtma |
| 3 | **Koding** | ✅ **Hozirgi umumiy kompilyator** (`src/compilator/HtmlCompiler.jsx`) ishlatiladi — 26-qonun bo'yicha mexanika almashadi (M3-D5 VS Code → M3-D10 kompilyator). 🔴 **Foydalanuvchi izohi:** LMS tomoni ertaga tayyor bo'lgach, kompilyator masalasi **hamma darsda bir yo'la** hal qilinadi — hozir alohida ish qilinmaydi |
| 4 | **Chiqish-artefakt** | ✅ `pm-m3d10-shartlar` → **M3-D14** (frontend pitch) oladi |
| 5 | **K10 keysi** | ✅ **QOLADI.** Voqea o'yin mazmuni haqida emas, sifat va ishonch haqida; o'yin nomi va sanasi aytiladi, xolos |
| 6 | **«shart» so'zi** | ✅ **QOLADI** (metodist hukmi). Sabab: o'smir «shart»ni maktabdan biladi va 2-Modulda `if` **sharti** bilan uchrashgan — s10 dagi «shartni kod tekshiradi» ko'prigi shundan o'zi ochiladi. «Talab» olinmaydi (idoraviy), «tekshiruv» ham — u harakat, shartning o'zi emas |
| 7 | **s8 kartasidagi eski yorliqlar** | ✅ **KO'RSATILMAYDI** — M3-D5 doskasidan keladigan `👥`/`⏱` yorliqlari chiqmaydi, faqat ish nomi (86b + korpus §95: manbasiz raqam) |
| 8 | **Koding sinovlari** | ✅ **4 ta** — har shartga bittadan (1 `true` + 3 `false`) |

**Quruvchiga qo'shimcha (metodist ogohlantirishi):** s4 — darsning o'zagi va eng xavfli ekrani.
U kashfiyot-mashqi: bola to'rt harakatni o'zi topishi kerak, javob ataylab berilmaydi (98b).
Agar 2–3 daqiqa hech narsa topmasa, ekran devorga aylanadi. **Taklif:** 40–45 soniya
harakatsizlikdan keyin bitta **qoida-ipuchasi** chiqsin («Odam har doim ham to'g'ri to'ldirmaydi —
noto'g'ri to'ldirib ham yuborib ko'ring») — javobni AYTMAYDIGAN shaklda (77-korpus).
Bu senariyda mexanika sifatida yozilmagan; quruvchi qo'shsin.

---

## 14-B. Qaror-nuqtalarning ASL matni (tarix uchun saqlanadi)

1. 🔴 **Dars sarlavhasi.** Hozirgi `App.jsx`: «Acceptance Criteria» · sub «feature qachon tayyor hisoblanadi?». Ikkalasi ham qonunga zid (izohsiz inglizcha atama — korpus §20; «feature» ham inglizcha). **Taklif:** title → **«Qachon "tayyor" deb ayta olamiz?»** · sub → **«ishni qabul qilish shartlari»**.
2. 🟡 **Misol-olam.** Taklif — 🎒 **maktab bufeti** (tanaffusda oldindan buyurtma). 95-qonundan o'tadi, band emas, «tayyor/tayyor emas» aniq tekshiriladi. Muqobil: 🛴 **samokat ijarasi**. Qaysi biri?
3. 🔴 **Koding kompilyatorda bo'lsinmi?** 26-qonun navbat almashishni talab qiladi (M3-D2 kompilyator → M3-D5 VS Code → **M3-D10 kompilyator**). Lekin siz kompilyator mavzusini to'xtatgan edingiz. Uch yo'l: **(a)** umumiy kompilyator ishlatiladi (`src/compilator/HtmlCompiler.jsx` — u JS rejimida ishlaydi va PmLesson1–4 da allaqachon ulangan); **(b)** yana VS Code topshirig'i (lekin 26-qonun buziladi — ketma-ket ikki dars bir xil mexanika); **(c)** boshqa mexanika o'ylab topiladi. Tavsiyam — **(a)**.
4. 🟡 **Chiqish-artefakt keyingi darsga.** `pm-m3d10-shartlar` M3-D14 (frontend pitch) da «bu ish tayyor» dalili sifatida ishlatilishi rejalashtirilgan. Tasdiqlaysizmi, yoki boshqa dars oladimi?
5. 🟡 **K10 va o'smir.** Cyberpunk 2077 — 18+ o'yin. Voqea o'yin mazmuni haqida emas, **sifat va ishonch** haqida (o'yin nomi, chiqish sanasi va PlayStation do'koni aytiladi, xolos). Shunday qoldiramizmi?
6. 🟢 **Atama tanlovi (metodist hukmi — tasdiq so'ralmoqda).** «Qabul shartlari» va qisqartirilganda «**shart**» qoldirildi: o'smir bu so'zni maktabdan biladi va 2-Modulda `if` **sharti** bilan uchrashgan — s10 dagi «shartni kod tekshiradi» ko'prigi shundan o'zi ochiladi. «Talab» olinmadi (lug'at: rasmiy-idoraviy), «tekshiruv» ham (u harakat, shartning o'zi emas). Rozimisiz — yoki butun dars «tekshiruv-ro'yxati» so'ziga o'tsinmi?
7. 🟡 **s8 kartasidagi eski yorliqlar.** O'quvchining ishi M3-D5 doskasidan keladi va u yerda ishga `foyda`/`vaqt` (⏱ 3 hafta kabi) yozilgan edi. Bu darsda ular hech qanday ish so'ramaydi — shuning uchun **faqat ish nomi** ko'rsatiladi deb yozdim (86b). Tasdiqlaysizmi?
8. 🟡 **Koding sinovlari 3 → 4 ga chiqdi.** Uchta shart e'lon qilinib, sinov ikkitasini sinardi (uchinchisi hech qachon buzilmasdi — 22-qonun buzilishi). Endi 1 ta `true` + 3 ta `false`, har shart bittadan sinaladi. Bu s4 dagi «to'rt shartni sinash» bilan ham qofiyalanadi. Tasdiqlaysizmi?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (0–98) bo'yicha yozildi. Keyingi qadam: `pm-metodist` SENARIY-KORREKTURA → **[GATE S]**.*
