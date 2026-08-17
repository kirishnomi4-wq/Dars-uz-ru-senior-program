# M4-D7 — Sinfdoshingiz sahifangizni ochsa, nimani ko'radi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/4-Modull/PmLesson12.jsx` (hozirgi `pm-security-trust-12-v16` — eski avlod dars
> BUTUNLAY almashadi; yangi `lessonId: pm-m4d7-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 4 — «Ma'lumot va bog'lanishlar» (Node.js + PostgreSQL) |
| **Dars** | M4-D7 (modulning 7-darsi) · `key: m4-07` |
| **Mavzu** | Xavfsizlik — foydalanuvchi ishonchi. Ma'lumot himoyasi mahsulot qiymati sifatida |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z qatorlariga qaror chiqaradi va sababini **yozadi**; artefakt = matn, keyingi darsga o'tadi (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | 🔴 **YO'Q — ZAXIRA ILGAK** (`PM_Prompt_v8` 1-blok). Biriktirilgan **K10 · CYBERPUNK 2077 RAD etildi** — sabab quyida, «Keys-qarori» bandida. ⚠️ Bu GATE S ning 1-savoli |
| **ISHLATILGAN_KEYS** | **—** (bu darsda bank keysi ishlatilmaydi) |
| **Oldingi PM dars (M4-D2) TEKSHIRUV mexanikasi** | «Hotspot — ilova ekranida bo'limni bosish» — **takrorlanmaydi** |
| **Band mexanikalar (TAQIQ)** | story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli foyda-vaqt doskasi · «ISHGA TUSHIRIB KO'RISH» soxta formasi · Timeline · MatchPairs · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · kartani boshqa katakka ko'chirish · PairTimer · klinika · tekshiruvchi stoli · 3 hikoya ustaxonasi · `hikoyaYasa` kompilyatori · 🔴 **+ M4-D2 (batch 1, parallel yozilgan): «XOTIRA TUGMALARI» imzo-vizuali · Hotspot** |
| **Misol-ip (91/108 + 95 + 96c)** | 🏫 **Maktab jurnali ilovasi** — o'quvchining sahifasi: ism, sinf, baholar, ota-onaning telefoni, kirish paroli. 95-qonun: o'smir buni har kuni O'ZI yashaydi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti (M3-D10) · o'quvchining o'z React sayti (M3-D14) · musiqa ilovasi (M4-D2) — **maktab jurnali ilovasi band emas** ✓ |
| **Kirish-artefakt** | `pm-m4d2-data` = `{ qatorlar: [ {maydon, bolim} × 3 ], savedAt }` — M4-D2 da o'quvchi «ilova nimani eslab qolsin» deb tanlagan **uch qator**. 🔴 Ikki tomonlama shart-tekshiruvi (F-0803-22-B): shakl M4-D2 senariysining 23-qatoridan **so'zma-so'z olindi** — o'quvchi dars aynan shu kalitni va shu shaklni kutadi. **Yo'q bo'lsa ham dars ishlaydi** (zaxira yo'l, korpus §69 shaklida) |
| **Chiqish-artefakt** | 🔴 `pm-m4d7-ishonch` = `{ qatorlar: [ { maydon, ruxsat, sabab } × 3 ], savedAt }` · `ruxsat` = `'ochiq' \| 'yopiq'` · `sabab` = o'quvchi yozgan bitta qator. Taklif: **M4-D12** (`PmLesson13`, PRD sxemasi) shu uch qatorni sxemaning «kim ko'radi» ustuni qilib oladi ⚠️ GATE S 4-savoli |
| **Yordamchi kalitlar** | `pm-m4d7-hook-choice` (faqat YOZILADI — 100c) · `pm-m4d7-rows` (s4 holati) · `pm-m4d7-code` · `pm-m4d7-reflection` · `pm-m4d7-hw-target` · `ccProgress` |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D10/M4-D2 da tasdiqlangan yakun-tuzilmasi bilan bir xil |

### 🔴 Keys-qarori: K10 nega RAD etildi

Registr `m4-07` ga **K10 · Cyberpunk 2077** ni 🟡 **qisman moslik** bilan biriktirgan. Yozish
paytida u mavzuga **halol yopishmadi** — uchta sabab bilan:

1. **Punchline allaqachon sarflangan.** K10 M3-D10 da ishlatilgan va uning **ISHONCH** tomoni
   aynan o'sha darsda muhrlangan: TEST-3 to'g'ri javobi — «Odamlarning ishonchi yo'qoldi»,
   RECAPS-7 sarlavhasi — «ishonch kodda emas, odamda». Ya'ni bu yerda olinishi kerak bo'lgan
   yagona tomon — **band**.
2. **96c(b) buzuvi.** «Bitta demo uch-to'rt darsda takrorlansa, o'quvchida "yana shumi?" hissi
   paydo bo'ladi». O'quvchi K10 ni m3-10 da ko'radi, m4-07 da yana ko'radi, registr bo'yicha
   m4b-02 va m7-12 da yana ikki marta ko'radi.
3. **10-qonun (keys-sadoqati) devori.** Bankda K10 haqida **ma'lumot himoyasi** yoki
   **maxfiylik** haqida bironta gap YO'Q. Uni bu darsga bog'lash uchun bankda yozilmagan
   narsani aytish kerak bo'lardi — bu esa to'g'ridan-to'g'ri taqiq.

**Qaror:** `PM_Prompt_v8` 1-blokdagi **zaxira ilgak** olinadi (foydalanuvchi bunga registr
4-bo'limida ruxsat bergan). K10 esa registrda **m4b-02 «Sifat — mahsulot qiymati»** darsiga
✅ «aynan» mosligi bilan tegishli — u yerda to'la kuchda ishlaydi.
🔴 **Zaxira ilgak taqiqi ham amal qiladi** (`PM_Prompt_v8` 1-blok, o'zbekchada):
**kompaniya, raqam va voqeani o'ylab topish har qanday holatda taqiq.** Shuning uchun s6 da
**o'ylab topilgan kompaniya-voqea YO'Q** — o'quvchi
telefonida **o'zi tekshirib ko'ra oladigan** holat olinadi (6-bo'limga qarang).

### Atama-glosslar (62/39-qonun + korpus §20 — avval hodisa, keyin nom)

- 🔴 **«Sir» so'zi va uning barcha shakllari butun darsda ISHLATILMAYDI** — mavzu maxfiylik
  haqida bo'lsa ham. Sabab: `MATN_ETALONI` §7 «"Sir"-uslub TAQIQ» + lug'at 50-qator +
  `til-lint-rules.json` dagi shu o'zakka qo'yilgan **error**-qoidasi (o'zak matnning
  **istalgan joyida** tutiladi). Dars markaziy juftligi —
  **👁 OCHIQ ↔ 🔒 YOPIQ**. Bu juftlik s2 · s4 · s8 · flashcard · RECAPS · arena · yakunda
  AYNAN shu ikki so'z bilan yuradi (korpus §80: bir tushuncha — bir nom);
- 🔴 **Ta'rif dars bo'ylab so'zma-so'z bir xil turadi** (93-qonun): **«Ochiq ma'lumot —
  begona odam ko'rsa ham hech kim zarar ko'rmaydigan ma'lumot. Yopiq ma'lumot — begona odam
  ko'rsa, egasi zarar ko'radigan ma'lumot.»**;
- 🔴 **«parol» QOLADI** — lug'atda taqiq yo'q, o'smir bu so'zni har kuni ishlatadi. Gloss
  kerak emas;
- 🔴 **«maxfiy kalit»** — ilovaning O'Z kaliti haqida gap ketsa (lug'at 47-qator: `secret` →
  «maxfiy kalit»). Bu darsda u **faqat s9 xabar-qatorida** bir marta uchraydi;
- ❌ **`.env` · JWT · token · hash · injection · shifrlash · autentifikatsiya · GDPR ·
  backup · xakerlik · ikki bosqichli tasdiqlash — ISHLATILMAYDI.** Ikki qonun birga:
  **29-qonun** (`.env` va JWT — **m4-11 `AuthEnvLesson`** ning bosh atamalari, ular hali
  o'tilmagan) va **62-qonun** (izohsiz atama turmaydi). ⚠️ `App.jsx` sub-sarlavhasida hozir
  `.env` turibdi — 14-bo'lim 2-bandiga qarang;
- ❌ **«shaxsiy ma'lumot» ISHLATILMAYDI** — kattalar-hujjatlarining iborasi. O'rnida narsaning
  O'Z nomi turadi: **baho · parol · telefon raqami · ism**. Umumlashtirish kerak bo'lsa —
  «o'zingizga tegishli ma'lumot»;
- ❌ **«ustaxona» o'quvchi ekranida YO'Q** (korpus §84 taqiq-oilasi) — bu senariy-ichi blok nomi;
- ❌ **`til-lint-rules.json` dagi barcha error-darajali taqiq-so'zlar YO'Q.** Ro'yxat bu
  yerda takrorlanmaydi — manba bitta (M4-D2 tartibi): qurilgandan keyin
  `npm run lint:til src/4-Modull/PmLesson12.jsx` → **0 error** shart;
- ❌ **«daftar» YO'Q** (F-0729-04) · ❌ **«chala» YO'Q** (7-B.3) — bularni linter tutmaydi,
  qo'lda grep qilinadi;
- ❌ **«... ko'zi bilan ...» ko'chma qurilmasi YO'Q** (lint error) — o'rniga «**uning o'rnida
  ko'ring**» / «**u ochganda**» (korpus §46).

🔴 **§40 darvozasi (o'quvchida hali YO'Q narsa uniki qilib aytilmaydi):** o'quvchi jurnal
ilovasini QURMAGAN — dars bo'ylab **«jurnal ilovasi» / «ilova»**, hech qachon «ilovangiz».
Uniki bo'ladigan narsalar ikkita: u chiqargan **uch qaror va uch sabab** («uch qatoringiz»)
va sahna ichida unga tegishli **sahifa** («sahifangiz») — sahifa ilova emas, u shu darsning
sahnasidagi o'rin, mexanika aynan shunga qurilgan (🧑‍🎓 Siz kirishi). 🔴 Quruvchiga: «sahifangiz»
qoladi, «ilovangiz» chiqmaydi — ikkovini aralashtirmang.

🔴 **Ohang darvozasi (66 + 101 + PM_DARS_ETALON M4-D7 ogohlantirishi):** bu mavzuda eng oson
buziladigan narsa — **qo'rqitish**. Darsda: sinfdosh o'g'ri emas · «sizib ketadi» so'zi
dahshat sifatida emas, **qaror-mezoni** sifatida ishlaydi · hujum texnikasi umuman
O'RGATILMAYDI (parolni qanday buzish, ma'lumotni qanday olish — bir og'iz gap yo'q).
Dars faqat **qaror**ni o'rgatadi: nima ochiq, nima yopiq, va nega.

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «UCH KIRISH — BIR SAHIFA»** (23-qonun: har darsda YANGI — story-silosi ·
JTBD shtampi · Metrika alangasi · ikki o'qli doska · M3-D10 «ISHGA TUSHIRIB KO'RISH» formasi ·
**M4-D2 «XOTIRA TUGMALARI»** klonlanmaydi).

Ekran markazida — **maktab jurnali ilovasining bitta sahifasi** (telefon ko'rinishida).
Sahifada **beshta qator** turadi. Tepada — **uchta kirish tugmasi**: sahifani kim ochgani.

| Kirish tugmasi | Ekran tepasidagi bitta qator (freym) |
|---|---|
| 🧑‍🎓 **Siz** | Bu sizning sahifangiz. |
| 🧑‍🏫 **Sinf rahbari** | U butun sinfning sahifasini ochadi. |
| 🙋 **Sinfdoshingiz** | U sizning sahifangizni ochdi. |

O'quvchi tugmani bosadi — sahifa **o'sha odam ochganidek qayta chiziladi**. Uchala kirishda
ham **beshala qator o'qilib turadi**: ilova hozir hech narsani yopmaydi. 🔴 **Bu javob EMAS,
material** — qaysi qator ortiqcha ekanini ekran AYTMAYDI (98b).

Uchala kirish ochilgach (`seen` 3/3 — 46/94-qonun) bitta topshiriq ochiladi:
**«Sinfdoshingiz ochganda qaysi qatorlar turmasligi kerak? Ularni bosing.»**

| # | Sahifadagi qator | Baza ustuni (s10) | To'g'ri qaror | Bosilganda chiqadigan bitta qator |
|---|---|---|---|---|
| 1 | 📛 Ism | `ism` | 👁 ochiq qoladi | 🤔 Sinfdoshingiz ismingizni allaqachon biladi. |
| 2 | 🏫 Sinf | `sinf` | 👁 ochiq qoladi | 🤔 Sinf bitta odamniki emas — u butun guruhga tegishli. |
| 3 | 📊 Baholar | `baho` | 🔒 yopiladi | ✅ Bahoyingizni faqat siz va uydagilaringiz biladi. |
| 4 | ☎️ Ota-onaning telefoni | `ota_telefon` | 🔒 yopiladi | ✅ Bu raqam sizniki ham emas — boshqa odamniki. |
| 5 | 🔑 Kirish paroli | `parol` | 🔒 yopiladi | ✅ Parolni bilgan odam sizning nomingizdan kiradi. |

Yopilgan qator sahifada **`••••••`** ga aylanadi va sinfdosh kirishida shundayligicha qoladi;
🧑‍🎓 Siz kirishida esa o'qilib turaveradi — **bir harakat ikki ekranda ko'rinadi**, oqibat
shu yerda ko'zga tashlanadi.

🔴 **Rang-qonuni (palitra-pasporti + 106d):** ochiq qolishi kerak bo'lgan qatorni bosish
**XATO EMAS** — bu qaror. Shuning uchun `err/errSoft` (qizil) bu ekranda umuman
ishlatilmaydi: to'g'ri qaror — `success` + ✅, ortiqcha qaror — `accentSoft` + 🤔.
Qator qaytib ochiladi, hisob buzilmaydi.

Yakun-qatori (69-qonun — maqtov emas, xulosa):
> ✅ **Uch qator yopildi, ikkitasi ochiq qoldi. Hamma qatorni yopib qo'ysangiz, ilovadan
> foyda qolmaydi — savol «nimani yopamiz» emas, «kim zarar ko'radi».**

**Nima uchun aynan shu:** «yopiq ma'lumot» ni ta'rifdan tushunib bo'lmaydi — u faqat **boshqa
odam ochganda** ma'noga kiradi. Bola maxfiylik haqida gapirmaydi, u **sahifani sinfdoshi
ochganidek ko'radi** va ortiqcha qatorni **o'zi topadi**. Ikkita ochiq qator esa qarama-qarshi
tomonni o'rgatadi: hammasini yopish ham yechim emas.

🔴 **Mexanika-farqi (26/59-qonun):** M4-D2 da o'quvchi **tugmani yoqib-o'chirib** ilova
ekraniga bo'lim qo'shardi (qaror — nimani saqlaymiz?); bu yerda u **kirishni almashtiradi**
va bitta sahifa **uch odamda uch xil ko'rinishini** ochadi (qaror — kim ko'radi?). Ma'lumot
ro'yxati o'zgarmaydi, **qarovchi** o'zgaradi. Ikki xil ish, takror emas.
🔴 **M3-D10 dan farqi:** u yerda o'quvchi **soxta formani bosib sinardi** (ish tayyormi?).

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D10/M4-D2 dagidek — etalon (P0 · PmLesson2 · PmLesson4):
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Sinfdoshingiz sahifangizni ochsa, nimani ko'radi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch qaror va uch sabab o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — ochiq ma'lumot va yopiq ma'lumot | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **UCH KIRISH** (3 kirish · 5 qator) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | HAQIQIY HOLAT — ilova sahifasidagi ro'yxat (4 slayd + 1 bashorat) | 3 | — | 🔴 zaxira ilgak (33/56-qonun qolipi) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 qator**: qaror + sabab (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **ORTIQCHASINI OLIB TASHLANG** (xabarni tozalash) | 5 | — | 🔴 yangi mexanika |
| s10 | KODING — kerakli ustunlarni so'raydigan so'rov | 6 | — | 26/82/87-qonun |
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
DARS: M4-D7 (7-dars)
DARS_MAVZUSI: Xavfsizlik — foydalanuvchi ishonchi: kim nimani ko'radi va nega
ISHLATILGAN_KEYS: —
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Maktab jurnali ilovasida sizning sahifangiz bor.
Sinfdoshingiz uni ochsa, nimani ko'radi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL natija ochiladi: sahifa ochiladi va unda beshala qator o'qilib turadi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: ilova hozir hech narsani yopmaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi. Ikkinchi tanlovni ko'p bolalar tanlasa ham — payoff bir xil:
gap taxminda emas, ilova nimani yopishida.
```

**Ikki tanlov (104-qonun: teng sonli, teng og'irlikda, teng uzunlikda):**

| Tanlov | Ostidagi izoh (tanlangach ochiladi) |
|---|---|
| 📛 Faqat ismim va sinfimni ko'radi | Sahifani ochamiz: unda beshala qator o'qilib turibdi — **baholaringiz** ham. |
| 📋 Sahifamdagi hamma qatorni ko'radi | Sahifani ochamiz: unda beshala qator o'qilib turibdi — **baholaringiz** ham. |

> 🔴 **104-qonun (teng og'irlik):** hookda to'g'ri javob YO'Q — izoh ikkala tanlovda **bir xil**
> va **maqtovsiz**: ❌ «To'g'ri sezdingiz…» (bitta tanlovni to'g'ri deb ko'rsatadi).
> 🔴 **97-qonun:** savol o'quvchi og'zidan tabiiy chiqadi — aniq narsa (maktab jurnali ilovasi)
> + harakat fe'li (ochsa / ko'radi). ❌ «Ma'lumot xavfsizligi nima?» — darslik tili.
> 🔴 **66/101-qonun (qo'rqitish taqiqi):** sinfdosh **o'g'ri emas** — u shunchaki sahifani
> ochdi. Hookda «o'g'irlash», «buzish», «xavf» so'zlari **0**.
> 🔴 **100-qonun:** tanlov `pm-m4d7-hook-choice` ga yoziladi, hech qayerda o'qilmaydi.
> 🔴 **62-qonun:** «ochiq ma'lumot» / «yopiq ma'lumot» atamalari bu ekranda YO'Q — s2 da ochiladi.
> 🔴 **Spoyler-tekshiruvi (M3-D5 saboqi):** payoff «hammasi ko'rinadi» deydi, **qaysi qator
> ortiqcha ekanini aytmaydi** — s4 ning kashfiyoti butun qoladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda chiqadi.
> O'quvchi matnida jamoa-murojaati **0**: «ko'pchilik», «ovozlar», «sinfdagilar», «hammamiz».
> ⚠️ **«Sinf» so'zi bundan mustasno** — u bu darsda mazmun so'zi (sahifadagi 🏫 Sinf qatori,
> 🧑‍🏫 Sinf rahbari, «sinfimni ko'radi» tanlovi). Taqiq faqat **jamoa-ovozi** ma'nosidagi
> ishlatishga tegishli.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida uchta qatorni ochiq va yopiqqa ajrata olasiz —
va har biriga nega shunday qilganingizni bir qatorda yoza olasiz.
HARAKAT: O'quvchi kuzatadi: bo'sh uch qatorga belgi qo'yiladi va yoniga sabab
o'z-o'zidan yozilib chiqadi.
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

**Demo-uchlik (jonli preview — 18/42-qonun):**

| Qator | Belgi | O'z-o'zidan yozilib chiqadigan sabab |
|---|---|---|
| 🖼 Profil rasmi | 👁 | Uni sinfdoshingiz baribir ko'radi. |
| 🎂 Tug'ilgan kun | 👁 | Sinf uni birga nishonlaydi. |
| 🏠 Uy manzili | 🔒 | Manzilni oilangiz va maktab biladi, boshqasi emas. |

> 🔴 **40-qonun:** «ajrata olasiz» / «yoza olasiz» — bilim, rost.
> 🔴 **42-qonun (fe'l ↔ ekran jarayoni):** ekranda MATN paydo bo'ladi, suyuqlik emas —
> shuning uchun sabab **«o'z-o'zidan yozilib chiqadi»**; suv-fe'li (lint warn-qoidasi)
> ishlatilmaydi. Mentor-eslatmasida ham aynan shu fe'l.
> 🔴 **54(b/c):** `ta-sub` ikkinchi qatori YO'Q · demo ostidagi caption YO'Q.
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo-uchligi s4 ning **beshligiga KIRMAYDI** — uchala
> qator boshqa (profil rasmi · tug'ilgan kun · uy manzili). Bir olam, boshqa qatorlar.
> 🔴 **§40:** «ilovangiz» EMAS — o'quvchida jurnal ilovasi yo'q.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (uch kirish) + 3 × Quiz
EKRAN: Ochiq ma'lumot — begona odam ko'rsa ham hech kim zarar ko'rmaydigan ma'lumot.
Yopiq ma'lumot — begona odam ko'rsa, egasi zarar ko'radigan ma'lumot.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) sahifani uch kirishda ochadi va
sinfdosh kirishida ortiqcha qatorlarni o'zi topadi; (s6) slaydlarni bashorat bilan ochadi.
JAVOB: s4 — besh qatordan 3 tasi yopiladi, 2 tasi ochiq qoladi (jadval 1-bo'limda).
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar odatda beshala qatorni ham yopib qo'yishga urinadi. Bu eng
foydali xato: ikkita 🤔 javobi shu yerda dars beradi, siz muhokama qiling — nega ochiq qoldi?
```

**s2 — TEORIYA-1: ochiq ma'lumot ↔ yopiq ma'lumot** (korpus §73: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat — 47-qonun teoriya-istisnosi): **«Ilovadagi hamma narsa hammaga ko'rinishi kerakmi?»**

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 👁 **Ochiq ma'lumot** | Begona odam ko'rsa ham hech kim zarar ko'rmaydi |
| 🔒 **Yopiq ma'lumot** | Begona odam ko'rsa, egasi zarar ko'radi |

Xulosa-karta (69-qonun · uch qisqa gap · blok-gapining O'ZI):
> **Ilovadagi ma'lumot ikki xil bo'ladi.** Ochig'ini begona odam ko'rsa ham hech kim zarar ko'rmaydi. Yopig'ini ko'rsa — egasi zarar ko'radi.

> 🔴 **Korpus §73 (inkordan boshlanmaydi):** ❌ «Yopiq ma'lumot — bu hamma ko'radigan narsa
> EMAS» → ✅ ikki turni yonma-yon qo'yish.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi (❌ «Ikkovi bir xil emas» —
> nimaning ikkovi?) — predmet nomlanadi.
> 🔴 **43a:** ikki turni matematik belgi bilan qarshi qo'yish YO'Q (ekranda «ochiq» va
> «yopiq» orasida faqat so'z turadi) — to'liq gap bilan yoziladi.
> 🔴 **Ekran-o'lchovi (Intl.Segmenter bilan qayta o'lchandi):** sarlavha + 2 karta + xulosa =
> **311 grapheme** — 400 chegarasidan ham, TMI o'lchovidan (≤354) ham past ✓. Xulosa-kartani
> qisqartirish **kerak emas**; ta'rif 93-qonun bo'yicha so'zma-so'z shu holida qoladi.
> Quruvchi bu ekranga mentor-pufak qo'shsa — u ≤40 belgi bo'lsin.

**s4 — YADRO: UCH KIRISH** (markaziy mexanika)

Sarlavha (47-qonun — buyruq): **«Sahifangizni uch odam ochib ko'ring.»**

Mentor (≤2 gap, 92a · 109 TMI):
> Bitta sahifa — lekin uni uch xil odam ochadi. Uchala kirishni birma-bir bosing.

Uchala kirish ochilgach chiqadigan topshiriq-qatori:
> **Sinfdoshingiz ochganda qaysi qatorlar turmasligi kerak? Ularni bosing.**

To'liq jadval, freym-qatorlari va javob-qatorlari — **1-bo'limda**.

Yakun-qatori: 1-bo'limdagi xulosa.

> 🔴 **98b/60-qonun:** mentor qaysi qator ortiqcha ekanini AYTMAYDI — o'quvchi o'zi topadi.
> Kirish-freymlari («U sizning sahifangizni ochdi») ham javobni bermaydi, faqat sahnani qo'yadi.
> 🔴 **72-qonun:** uch kirish tugmasi yorliqli idishda, diqqat-signali (sekin yorishib-so'nish)
> bilan; birinchi bosishdan keyin signal tinadi.
> 🔴 **Ekran-o'lchovi (Intl.Segmenter):** sarlavha + mentor + 3 tugma + 1 kirish-freymi +
> 5 qator + topshiriq + 1 javob-qatori = **378 grapheme** — 400 ga yaqin. ⚠️ Quruvchiga shart:
> kirish-freymi **bittasi** (faol kirishniki) va javob-qatori **bittasi** (oxirgi bosilganiniki)
> ko'rinadi; ikkitasi birga qolsa ekran chegaradan chiqadi.
> 🔴 **106d/71-qonun:** har bosishdan keyin javob darhol chiqadi — belgi (✅/🤔) **va**
> yonidagi bitta qator: o'quvchi nega shundayligini o'qiydi, taxmin qilmaydi.
> 🔴 **106c (4 blok budjeti):** sarlavha → uch kirish tugmasi → sahifa → javob-qatori. Beshinchi blok YO'Q.
> 🔴 **Devor-himoyasi (M3-D10 GATE S saboqi):** s4 — kashfiyot-mashqi. Agar 40–45 soniya
> harakatsizlik bo'lsa, bitta **qoida-ipuchasi** chiqsin: «🤔 Har qator uchun bitta savol:
> buni sinfdoshingiz ko'rsa, kim zarar ko'radi?» — javobni AYTMAYDIGAN shaklda (korpus §98).

**s6 — HAQIQIY HOLAT:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (yozish-ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Uch qatoringizga qaror chiqaring.
(mentor, 1 gap) Har qatorga belgi qo'ying va sababini bitta qatorda yozing.
HARAKAT: Uch qatorni BITTALAB o'tadi. Har qatorda avval belgi tanlanadi, keyin
sabab yoziladi; saqlangach keyingi qatorga o'tiladi.
JAVOB: Uchala qatorga belgi qo'yilgan · har sababda KIM zarar ko'rishi yoki KIM
bilishi aytilgan · «yomon», «xavfli», «kerak emas» kabi sababsiz so'zlar yo'q.
RO'YXAT: Uchala qatorga belgi qo'yilgan · Har sababda odam nomlangan · Kamida bittasi 🔒
YULDUZCHA: To'rtinchi qator qo'shing — ilova umuman saqlamasligi kerak bo'lgan narsa.
YORDAM: O'zingizga bitta savol bering: buni begona ko'rsa, KIM zarar ko'radi?
Javob topilmasa — qator ochiq bo'lishi mumkin.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Bu yomon narsa» kabi sabablar chiqadi — bu eng foydali xato. Javob-qatori uni
tutadi, siz muhokama qiling: yomon EMAS, KIM uchun yomon?
```

🔴 **Kirish-artefakt tarmog'i (korpus §69 — ikki tarmoq bir shaklda, bir uzunlikda):**
- **Artefakt BOR:** «O'tgan darsda ilova eslab qoladigan uchta narsani o'zingiz tanlagandingiz — ular pastda turibdi. Endi har biriga bitta qaror chiqarasiz.»
- **Artefakt YO'Q:** «Boshlash uchun jurnal ilovasining uchta qatorini olamiz — ular pastda turibdi. Endi har biriga bitta qaror chiqarasiz.»
- 🔴 «topilmadi / saqlanmagan / bo'sh» so'zlari **0** · zaxira-namuna **shu darsning O'Z
  olamidan** (jurnal ilovasi, 96c-d). Zaxira uchlik: **📊 Baholar · ☎️ Ota-onaning telefoni ·
  🖼 Profil rasmi** (🔴 s4 ning beshligidan farq qiladigan uchlik EMAS — aksincha, ikkitasi
  aynan s4 dan olinadi, chunki bu yerda o'quvchi ularni endi **o'z so'zi bilan** izohlaydi;
  uchinchisi s1 demo-uchligidan keladi. Bu takror emas, **qo'llash**).
- 🔴 **Olam farqi normal (96c b/d):** o'quvchining uch qatori M4-D2 dan (musiqa ilovasi)
  keladi, darsning demo-olami esa maktab jurnali. Shuning uchun matnda hech qachon
  «musiqa ilovasidagi qatorlaringiz» deb yozilmaydi — doim **«uch qatoringiz»**.
- 🔴 **Kartada faqat qator NOMI turadi.** M4-D2 dan keladigan `bolim` maydoni (masalan
  «Yaqinda tinglaganlaringiz») bu ekranda KO'RSATILMAYDI: u bu darsda hech qanday ish
  so'ramaydi va manbasi ham tushuntirilmagan bo'lardi (86b + korpus §95).

🔴 **Saqlash-shartining javob-qatorlari (48/106d-qonun — alohida checklist-panel YO'Q):**
- sababda odam nomlanmagan → «🤔 Kim zarar ko'radi yoki kim biladi — shuni yozing.»
- sababi joyida → «✅ Kim zarar ko'rishini aytdingiz — sabab shunday yoziladi.»
- oldingi sababga juda o'xshash → «🤔 Bu sabab yuqoridagiga o'xshash — boshqa odamni oling.»
- juda qisqa (2-3 so'z) → «🤔 Qisqa qoldi: to'liq gap bilan yozing.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi tayyor»
- 🔴 **Mentor-diyetasi (ETALON 32):** yozish-ekranida pufak **1 gap** va u qadam-ro'yxatini
  AYTMAYDI. Qadamlar UI'da ko'rinib turibdi (👁/🔒 tugmalari → sabab maydoni), shartlar esa
  RO'YXAT chiplarida (har yorliq ≤5 so'z). «Avval …, keyin …» qurilmasi pufakda **0**.

🔴 **Baholanmaydigan so'zlar ro'yxati** (dars o'z lug'atidan — 106d(c)): *yomon · xavfli ·
kerak emas · noto'g'ri · yaxshi emas*. O'quvchi shulardan birini yolg'iz yozsa — savol
qaytariladi (bloklamaydi, yo'naltiradi).

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (xabardan qator olib tashlash)
EKRAN: (topshiriq) Ota-onangizga ketadigan xabardan ortiqchasini olib tashlang.
(yo'riqnoma) Xabar har juma jurnal ilovasidan yuboriladi. Qatorni bossangiz — u xabardan olib tashlanadi.
HARAKAT: Besh qatorli xabardan ortiqcha qatorlarni bosib olib tashlaydi.
JAVOB: Ikki qator olib tashlanadi: «Butun sinfning baholari ro'yxati» va «Ilovaga kirish
paroli». Qolgan uchtasi xabarda qoladi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: Bitta savol yetadi: bu qator shu oilaga tegishlimi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Sherigingizning uch sababini o'qing va har biriga bitta savol bering: «kim zarar
ko'radi?» Javob topilmasa — o'sha sabab qayta yoziladi. Sinfda juftlikda sinab ko'ring.
MENTORGA: Eng ko'p adashiladigan joy — parol qatorini qoldirish («ota-onamga kerak-ku»).
Aynan shu yerda qoida ochiladi: parol xabarga yozilmaydi, u faqat egasida turadi.
```

**Xabar (o'zgarmas material — 7-B: KARTOCHKA ichida yo'riq YO'Q):**

| # | Xabar qatori | Qaror |
|---|---|---|
| 1 | 📊 Bu hafta olgan baholaringiz: 5, 4, 5 | qoladi |
| 2 | 👥 Butun sinfning baholari ro'yxati | 🔴 olib tashlanadi |
| 3 | 📅 Ertangi dars jadvali | qoladi |
| 4 | 🔑 Ilovaga kirish paroli | 🔴 olib tashlanadi |
| 5 | 📍 Maktab manzili va telefoni | qoladi |

Ortiqcha bo'lmagan qator bosilsa → qator **qaytib chiqadi** va bitta qoida-qatori ko'rinadi
(korpus §98 — qoida beriladi, javob AYTILMAYDI):
> 🤔 **Har qator uchun bitta savol: bu narsa shu oilaga tegishlimi?**

Holat ko'rsatkichi (106c-b): «Xabardan 1 qator olib tashlandi».

Yakun-qatori:
> ✅ **Xabarda faqat shu oilaga tegishli narsa qoldi. Yuborilmagan ma'lumot sizib ham ketmaydi.**

> 🔴 **26/59-qonun tekshiruvi:** M4-D2 TEKSHIRUVi **Hotspot** edi (ekranda bo'limni bosib
> TOPISH); M3-D10 niki **Timeline** (tartibga solish). Bu yerda o'quvchi hech narsa topmaydi
> va tartiblamaydi — u **tayyor matndan qator olib tashlaydi**, ya'ni artefaktning O'ZINI
> o'zgartiradi (`PM_Prompt_v8` blok 5 talabi, o'zbekchada: «birovning tayyor ishidagi xatoni
> toping»). Takror YO'Q ✓
> 🔴 **«Bo'laklash-doska»dan farqi (M2-D7 taqiqi):** u yerda bo'laklar **zonaga ko'chirilardi**
> («🗑 Keraksizlar» idishi — korpus §70). Bu yerda **zona YO'Q**: qator xabarning ichidan
> chiqib ketadi, boradigan joyi yo'q. ⚠️ Bu GATE S ning 7-savoli.
> 🔴 **7-B tartibi:** TOPSHIRIQ (buyruq, 6 so'z) → YO'RIQNOMA (2 gap, 19 so'z) → KARTOCHKA
> (faqat xabar) → holat ko'rsatkichi.
> 🔴 **Bir harakat — bir fe'l (korpus §80):** ekranda **«olib tashlash»** yuradi (topshiriq ·
> yo'riqnoma · holat ko'rsatkichi · nishon tavsifi). «O'chirish» so'zi o'quvchi matnida **0** —
> u faqat senariy-ichi mexanika nomi.
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda). 🔴 **106f(c):** SOFT matni —
> sinf ish-tartibi, shuning uchun u `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **YORDAM ekran boshida TURMAYDI** — u faqat birinchi ortiqcha bosishdan keyin ochiladi.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code-topshirig'i)
EKRAN: (sarlavha) Kerakli ustunlarni so'raydigan kod yozamiz.
(mentor) Sinfdoshingiz sahifangizni ochganda server bazadan shu so'rovni yuboradi —
uni siz qisqartirasiz.
HARAKAT: SELECT * ni ustun nomlari bilan almashtiradi: sinfdosh ko'rishi mumkin bo'lgan
ustunlar qoladi. Keyin so'rovni ishga tushirib natijani ko'radi.
JAVOB: So'rov ikkita ustun qaytaradi — ism va sinf. Parol, baho va telefon qaytmaydi.
RO'YXAT: SELECT * o'rniga ustun nomlari yozilgan · Parol va telefon so'rovda yo'q ·
So'rov ikkita ustun qaytardi
YULDUZCHA: Ikkinchi so'rov yozing — sinf rahbari ochganda baho ham qaytsin.
YORDAM: Yulduzcha o'rniga ustun nomlarini vergul bilan yozing. Bittadan boshlang.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod — s4 dagi qarorning to'g'ridan-to'g'ri tarjimasi. Shuni ochiq ayting:
o'quvchi qaysi qatorni yopgan bo'lsa, o'sha ustun so'rovga yozilmaydi.
```

> 🔴 **87-qonun (o'tilgan texnik material — `src/App.jsx` `MODULES` bo'yicha tekshirildi):**
> **m4-06 `PostgresCrudLesson`** (`SELECT ... WHERE`, ustun nomlari, `INSERT/UPDATE/DELETE`) ·
> **m4-05 `RoutingLesson`** (method + path) · **m4-04 `NodeServerLesson`** (Express, endpoint) ·
> **m4-01 `DataIntroLesson`** (jadval, ustun, `id`, tashqi kalit) · M2 dan `if`, taqqoslash.
> Topshiriqda shundan tashqari hech narsa yo'q.
> 🔴 **TAQIQ — hali o'tilmagan:** `.env` · `process.env` · JWT · `req.body` · `express.json()` ·
> CORS · `pool.query` — hammasi **m4-08…m4-11** da. 29-qonun bo'yicha topshiriqqa kirmaydi.
> 🔴 **26-qonun (mexanika almashadi):** M3-D5 VS Code → M3-D10 kompilyator → M4-D2 kompilyator
> → **M4-D7 VS Code-topshirig'i**. Navbat to'g'ri almashadi ✓ Texnik sabab ham bor: SQL so'rovi
> HTML/JS kompilyatorida ishlamaydi. ⚠️ Bu GATE S ning 3-savoli.
> 🔴 **82(a):** sarlavha «…adigan **kod** yozamiz» oilasidan ✓ · **82(d):** kod nusxalanmaydi.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch qaroringizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan ayting: qaysi qatorni yopdingiz va kim zarar ko'rmasligi
uchun? Avval sherigingizga ayting, keyin bir qatorda yozing.
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
MENTORGA: Uchdan biri «kim zarar ko'radi» savoliga javob berolmasa — s4 dagi sahifani
qayta oching va sinfdosh kirishida bitta qatorni birga o'qing.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha
> «O'zingizni sinab ko'ring.»
> 🔴 **76-qonun:** «…so'zingiz bilan» qurilmasi (lint error-qoidasi) o'rnida ✅ «ekranga
> qaramasdan» ishlatiladi.
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'qiyotgan o'quvchida sherik YO'Q — unga «Avval
> **ovoz chiqarib o'zingizga** ayting, keyin bir qatorda yozing» ko'rinadi. Ikki tarmoq bir
> shakl, bir uzunlikda.
> 🔴 **106f(b):** yozib bo'lgach mukofot chiqadi — bitta tabrik-gap («Endi siz har qatorga
> "kim zarar ko'radi?" degan savol bilan qaraydigan bo'ldingiz») + bitta qoida-qatori
> («🎯 Bugungi qoida: ma'lumotni zarar yopadi»).
> 🔴 **«Yopiqlik» kabi yasama otlar ISHLATILMAYDI** (har ko'ringan so'z tushunarli qonuni) —
> qoida hamma joyda **fe'l bilan**: «ma'lumotni zarar yopadi».

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda ilovalar do'konini ochasiz, o'zingiz ishlatadigan ilovaning sahifasini topasiz
va «qanday ma'lumot yig'adi» ro'yxatini o'qiysiz — so'ng ro'yxatdagi bandlarni ochiq va
yopiqqa ajratasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
HARAKAT: Ro'yxatdagi bandlarga belgi qo'yadi va har biriga sabab yozadi.
JAVOB: —
RO'YXAT: Uchta band yozilgan · Har biriga 👁 yoki 🔒 qo'yilgan · Har sababda odam nomlangan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Bitta bandni yozing — eng yopig'ini — va bir qator sabab yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa.
Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; **yakun-ekranda AYNAN shu takrorlanadi**.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «uchta band»
> sanog'i faqat To'liq-kartada turadi.
> 🔴 **Namunasiz harakat taqiqi:** vazifadagi har ish darsda KO'RSATILGAN — ilova sahifasidagi
> ro'yxat s6 da ochilgan, 👁/🔒 ajratish s4 da qilingan, sabab yozish s8 da qilingan.
> 🔴 **73-qonun:** kelasi darsga havola faqat MUDDAT bandida («Muddat — keyingi darsgacha»);
> boshqa ekranlarda va'da-qatori YO'Q.

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
MAVZU: Ochiq va yopiq ma'lumot farqi; ma'lumotni nima yopadi (zarar); nega hamma
qatorni yopib bo'lmaydi; parol kimda turadi; xabarga nima yozilmaydi; yuborilmagan
ma'lumot; ilova nimani yig'ishini odam qachon o'qiydi; SELECT * nima qaytaradi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas,
> bitta xato-sinf) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas).
> Variant uzunliklari teng (8.4 · tell ≤1.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🔒 Ma'lumot qachon yopiq hisoblanadi? *(5 so'z)*
- A. Uni yozish uchun ko'p vaqt ketganda *(35)*
- **B.** Begona odam ko'rsa, egasi zarar ko'rganda ✅ *(41)*
- C. Uni ilovada juda kam odam ochganda *(34)*

**Reveal:** To'g'ri — ma'lumotni **zarar** yopadi, turi emas.

> 🔴 **64-qonun (bitta xato-sinf):** ikkala tuzoq ham «**noto'g'ri mezon**» sinfida —
> A mehnat bo'yicha, C ommaboplik bo'yicha o'lchaydi. Ikkalasi ham hayotda aytiladigan,
> lekin darsning ta'rifiga zid gap. Uzunlik: 35 · 41 · 34 (tell 1.21 ✓).
> 🔴 **21-qonun:** ballanadigan matnda izohsiz chet so'z **0**.

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 👁 Ilova nega ism va sinfni sinfdoshingizga ko'rsataveradi? *(7 so'z)*
- A. Ular baho va paroldan kamroq joy oladi *(38)*
- **B.** Ularni ko'rgan odam hech kimga zarar bermaydi ✅ *(45)*
- C. Ular yopilsa, ilova sekin ishlab qoladi *(39)*

**Reveal:** To'g'ri — ochiq qator ham qaror: uni ko'rgan odam hech kimga zarar bermaydi.

> 🔴 Savol s4 ning **ikkinchi yarmini** tekshiradi (hamma narsani yopish yechim emas) —
> birinchi yarmi (qaysi qator yopiladi) arenaga qoldirildi, aks holda bir g'oya uch marta
> so'raladi (korpus §72).
> 🔴 **64-qonun:** ikkala tuzoq ham «**texnik bahona**» sinfida (joy · tezlik) — ikkalasi
> ham qaror emas, ilovaning ishlashi haqida. Uzunlik: 38 · 45 · 39 (tell 1.18 ✓).
> 🔴 **17-qonun tuzatildi (metodist, korrektura):** eski C varianti «Ularni ilova baribir
> yopa olmaydi» edi — u **ROST bo'lib chiqardi**: s4 da o'quvchi ism/sinf qatorini bossa,
> qator qaytib ochiladi (rang-qonuni: bu xato emas, qaror). Ya'ni ekran «ilova ularni yopmadi»
> deb ko'rsatadi va to'g'ri kuzatgan bola tuzoqqa tushardi. Yangi C hech qayerda
> ko'rsatilmagan va rost emas — bitta himoyalanadigan javob B ✓.

### TEST-3 (s7 — s6 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 📱 Ilova qanday ma'lumot yig'ishini odam qachon o'qiy oladi? *(8 so'z)*
- **A.** Ilovani yuklashdan oldin ham ✅ *(28)*
- B. Faqat bir oy foydalangandan keyin *(33)*
- C. Faqat ma'lumoti sizib ketganda *(30)*

**Reveal:** To'g'ri — ro'yxat ilova sahifasida, yuklashdan **oldin** turadi.

> 🔴 **64-qonun:** ikkala tuzoq ham «**faqat keyin**» sinfida. Uzunlik: 28 · 33 · 30 (tell 1.18 ✓).
> 🔴 **17-qonun tuzatildi (metodist, korrektura):** eski savol «…odam qachon **biladi**?» edi
> va tuzoqlarda «faqat» so'zi yo'q edi — hayotda odam ma'lumoti sizib ketganda ham «biladi»,
> ya'ni C rost bo'lib qolardi. Yangi shaklda savol **o'qish imkoniyati** haqida, «faqat»
> esa B va C ni aniq yolg'on qiladi: ro'yxatni yuklashdan oldin ham o'qish mumkin ✓
> 🔴 **34-qonun:** hech bir variant darsning o'z ta'limiga zid emas — ular shunchaki kech.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 🔑 Ilovaga kirish paroli qayerda turmasligi kerak? *(6 so'z)*
- A. Faqat parol egasining o'zida *(28)*
- **B.** Ota-onaga ketadigan xabar ichida ✅ *(32)*
- C. Ilova so'raydigan kirish maydonida *(34)*

**Reveal:** To'g'ri — xabarga yozilgan parolni xabarni ko'rgan har kim o'qiydi.

> 🔴 B darsning O'Z so'zlari bilan yozildi (s9 · 4-qator). ❌ «maxfiy joyda saqlanmasa» —
> bu ibora darsda umuman ishlatilmagan.
> 🔴 **17-qonun:** A va C — parol **turishi kerak** bo'lgan ikki joy, ya'ni ikkalasi ham
> savolga «yo'q» javobini beradi; bitta himoyalanadigan javob B ✓. Uzunlik: 28 · 32 · 34 (tell 1.21 ✓).
> 🔴 **65-qonun:** savol s9 ekraniga bog'langan ✓

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask`.

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — yozilgani yashil ✓, joriysi indigo-pulsda,
kelgusi kulrang-punktir; oradagi chiziq yashillanib boradi.

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida:
qator nomi (o'zgarmas) → ikki tugma **👁 Ochiq** / **🔒 Yopiq** → sabab maydoni.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI (chalg'itmasin) — faqat indikator chirog'i
yonadi; uchtasi ham tayyor bo'lgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda).

**Placeholder (92c/85/106d-d):** `«Kim zarar ko'radi?»` — qisqa savol, tayyor javob maydonda
TURMAYDI, namuna-tugmalari YO'Q.

**106d javob (ikki tomonlama)** — 3-blokdagi javob-qatorlari ro'yxati.

**Tugma (80b + korpus §93):** «✓ Saqlash» matni **o'zgarmas**. Tugma hali faol bo'lmasa,
yonida nima yetishmayotgani so'z bilan yoziladi: «belgi qo'yilmagan» yoki «sabab yozilmagan».
🔴 **«2/2 tayyor» kabi hisobcha bu tugmada YO'Q** (metodist tuzatishi — «har ko'ringan so'z
tushunarli»: bola «2/2» ni ekrandagi uch qator sanog'i bilan chalkashtiradi). Sanoq faqat
ekran tepasida va faqat qatorlar bo'yicha turadi: «3 tadan 2 tasi tayyor».

🔴 **Ikki ish bir kartada — ruxsat sababi:** 92a «bir ekran — bir ish» buzilmaydi, chunki
belgi va sabab **bitta yozuvning ikki bo'lagi** (bittasisiz yozuv saqlanmaydi) va ular
ketma-ket ochiladi: belgi tanlanmaguncha sabab maydoni chiqmaydi (106d-e: tugma ish tayyor
bo'lgandagina chiqadi).

---

## 6. HAQIQIY HOLAT SPETSIFIKATSIYASI (s6 — ZAXIRA ILGAK · 33/56/100-qonun qolipi)

🔴 **Nima uchun keys emas:** 0-bo'limdagi «Keys-qarori» bandiga qarang. Bu ekran keys-slayd
QOLIPINI (freym → slaydlar → bitta bashorat → ko'prik-gap) saqlaydi, lekin mazmuni bank
keysi emas.

🔴 **O'ylab topilgan voqea, kompaniya va raqam YO'Q** (`PM_Prompt_v8` zaxira-ilgak sharti).
Ekran o'quvchi **o'z telefonida 10 soniyada tekshirib ko'ra oladigan** holatni ko'rsatadi.

**Freym (91b):** eyebrow — **«📱 Haqiqiy holat»**. K-kodi ham, kompaniya nomi ham ekranga chiqmaydi.

**4 slayd (hikoya tilida — 42-qonun · ovoz chiqarib o'qib tekshirildi):**

1. **Telefoningizda ilovalar do'koni bor.** Har ilovaning o'z sahifasi turadi: rasmlar, izoh, baho.
2. **O'sha sahifada yana bitta ro'yxat bor:** «Bu ilova qanday ma'lumot yig'adi». Uni ilovani yuklashdan **oldin** o'qish mumkin.
3. *(bashorat)* **Sizningcha, bu ro'yxat u yerda nima uchun turadi?**
4. **Ro'yxat o'sha yerda bir ish uchun turadi:** yuklaydigan odam nimaga rozi bo'layotganini **oldindan** ko'rsin. O'qish yoki o'qimaslik — odamning o'zida.

**Bashorat (3-slayddan oldin, zinapoya tartibida — korpus §43 · bitta savol: ro'yxat NEGA u yerda turadi):**
- «Dasturchilarga eslatma sifatida» *(28)*
- «Telefon uni o'zi yozib qo'yadi» *(31)*
- «Yuklaydigan odam oldindan bilsin uchun» ✅ *(35)*

**Natija-qatori (56/100-qonun):** topsa «🎯 Topdingiz! Yuklaydigan odam oldindan bilsin uchun»
— quyruqsiz; adashsa «Adashdingiz — asl javob: yuklaydigan odam oldindan bilsin uchun».
🔴 «Bu ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b):**
> Demak ilova nimani yig'ishi — yashirin narsa emas, odam **oldindan** o'qiydigan narsa.
> Endi o'z uch qatoringizga shu savolni berasiz: buni begona ko'rsa, kim zarar ko'radi?

> 🔴 **109-qonun (TMI ov-ro'yxati 6-bandi):** keys/hikoya slaydlarida ball bermaydigan
> bashorat — **maks 1 ta** ✓ (bitta).
> 🔴 **36-korpus (raqam manbasi):** bu ekranda birorta raqam YO'Q — o'ylab topilgan statistika
> («odamlarning 40 foizi…») **taqiq**.
> 🔴 **Fakt-halolligi tuzatildi (metodist, korrektura — M3-D14 saboqi):** 4-slaydda ilgari
> «Ro'yxat uzun bo'lsa, **ba'zi odamlar ilovani umuman yuklamaydi**» degan gap turgan edi —
> bu odamlar xatti-harakati haqidagi tekshirib bo'lmaydigan da'vo (raqamsiz bo'lsa ham).
> Yangi 4-slayd faqat **ekranda ko'rinadigan narsani** aytadi: ro'yxat sahifada turadi va u
> yuklaydigan odam uchun. To'rttala slayd ham o'quvchi telefonida tasdiqlanadi ✓
> 🔴 **Bashorat halolligi (17-qonun):** uchala variant ham «ro'yxat nega u yerda turadi»
> savoliga javob beradi; 1-2 variantlar slaydlarda ham, hayotda ham rost emas (ro'yxatni
> telefon emas, ilovani yozgan tomon to'ldiradi) — to'g'ri belgilagan bola «Adashdingiz»
> olmaydi, noto'g'ri belgilagan bola esa rost gapni yo'qotmaydi ✓
> 🔴 **62/29-qonun:** ro'yxatning rasmiy nomi (ilovalar do'konidagi maxfiylik yorlig'i)
> ekranga CHIQMAYDI — u o'quvchi ekranda ko'radigan so'zlar bilan ataladi: «qanday ma'lumot
> yig'adi» ro'yxati.
> 🔴 **Mentorga:** «Hozir telefonini ochib ko'rmoqchi bo'lganlar bo'ladi — ruxsat bering,
> bu darsning eng foydali 30 soniyasi» (`MentorNote`).

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun)

**Darvoza-mashq (82e):** bitta savol darsning O'Z texnik bilimidan (m4-06):
**«`SELECT *` nimani qaytaradi?»** → «Faqat birinchi ustunni» · «**Jadvaldagi hamma ustunni**» ✅ · «Hech narsani».
Qulf-yorlig'i (30-qonun): «🔒 Avval kod-savolini yeching — bosing, ko'rsataman».

**Jadval (o'quvchiga ko'rsatiladigan sxema — m4-01 dan tanish shakl):**

| Ustun | `id` | `ism` | `sinf` | `baho` | `ota_telefon` | `parol` |
|---|---|---|---|---|---|---|

**Boshlang'ich kod:**

```sql
-- Sinfdoshingiz sahifangizni ochganda server shu so'rovni yuboradi:

SELECT * FROM oquvchilar WHERE sinf = '8-B';
--     ^ bu joyni siz to'ldirasiz
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. `SELECT *` o'rniga ustun nomlari yozilgan
2. Parol va telefon so'rovda yo'q
3. So'rov ikkita ustun qaytardi

**To'g'ri natija:**
```sql
SELECT ism, sinf FROM oquvchilar WHERE sinf = '8-B';
```

**YULDUZCHA:** Ikkinchi so'rov yozing — sinf rahbari ochganda baho ham qaytsin.
(`SELECT ism, sinf, baho FROM oquvchilar WHERE sinf = '8-B';`)

**YORDAM (yechimni aytmaydi — korpus §77):** Yulduzcha o'rniga ustun nomlarini vergul bilan
yozing. Bittadan boshlang.

**Tasdiq-tugmasi (korpus §93 — bajarilgan ishni nomlaydi):**
«✅ VS Code'da yozdim — so'rov ikkita ustun qaytardi»

> 🔴 **Pedagogik ulanish (87c):** kod — s4 dagi qarorning to'g'ridan-to'g'ri tarjimasi.
> Beshta qator ↔ beshta ustun, uch yopiq ↔ uch yozilmaydigan ustun. **Sanoq-mosligi (22-qonun)
> aynan:** s4 da 5 qator (2 ochiq / 3 yopiq) · s10 da 5 ustun (2 so'raladi / 3 so'ralmaydi).
> 🔴 **82(d):** kod NUSXALANMAYDI — «🔒 qo'lda yoziladi», copy/cut/paste bloklangan;
> sabab ochiq aytiladi: «qo'lda yozganda o'rganiladi».
> 🔴 **82(b):** preview/mock-panel YO'Q · **82(c):** panel chapda, kod o'ngda ·
> **82(e):** honor-checklist YO'Q, darvoza — yuqoridagi bitta kod-savoli.
> 🔴 **Atama-glossi (lug'at 161):** «VS Code (kod yoziladigan dastur)» — birinchi ko'rinishda.
> 🔴 **`.env` bu yerda YO'Q:** o'quvchi hali `process.env` ni ko'rmagan (m4-11). Parol
> **so'rovga yozilmasligi** bilan himoyalanadi — bu m4-06 bilimi bilan to'liq bajariladi.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qator CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo-uchligi s4 **beshligiga KIRMAYDI** (M3-D5 spoyler-saboqi) |
| **s12 REFLEKSIYA** | Sarlavha: «Uch qaroringizni yoddan ayta olasizmi?» · juftlik-taymer + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». Yozilgach 106f(b) mukofot-blogi |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal gap; 93-qonun: ta'rif so'zma-so'z bir xil): «Ochiq ma'lumotni begona odam ko'rsa ham hech kim zarar ko'rmaydi.» · «Yopiq ma'lumotni begona odam ko'rsa, egasi zarar ko'radi.» · «Hamma qatorni yopib qo'ysangiz, ilovadan foyda qolmaydi.» · «Yuborilmagan ma'lumot sizib ham ketmaydi.» |
| **s15 · 103-qonun** | 🔴 «Bugungi asosiy fikr —» bitta gap (hero+ScoreRing dan keyin, CodeStrike CTA dan oldin): **«Ilova qaysi qatorni yopiq tutishini tanlaydi — odam esa shu tanlovga qarab ishonadi.»** Flashcardga qo'shilmaydi, kalit so'zlar ro'yxati yakunda YO'Q |

---

## 9. CODESTRIKE — 12 SAVOL (arena · to'g'ri indekslar 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.
> 🔴 **21-qonun:** savol o'zagida ham, variantlarda ham izohsiz chet so'z **0** —
> «ma'lumot», «parol», «ustun», «so'rov», «qator» so'zlari bilan yoziladi.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | Ochiq ma'lumot nima? | s2 |
| 2 | Yopiq ma'lumot nima? | s2 |
| 3 | Ma'lumotni yopiq qiladigan narsa nima? | s2 + s5 |
| 4 | Sinfdoshingiz ochganda qaysi qator turmasligi kerak? | s4 |
| 5 | Ism va sinf nega ochiq qoladi? | s4 + s5 |
| 6 | Hamma qatorni yopib qo'ysangiz nima bo'ladi? | s4 |
| 7 | Ota-onaning telefon raqami kimniki? | s4 |
| 8 | Parolni bilgan odam nima qila oladi? | s4 |
| 9 | Ilova nimani yig'ishini odam qachon o'qiy oladi? | s6 |
| 10 | Ota-onaga ketadigan xabarga nima yozilmaydi? | s9 |
| 11 | Yuborilmagan ma'lumot haqida qoida nima? | s9 |
| 12 | `SELECT *` nimani qaytaradi? | s10 |

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Eyes Open!** | Uch qatorni sinfdoshdan yopdingiz | 33 | s4: 3/3 to'g'ri yopildi |
| **Clear Reasons!** | Uchala qatorga sababini yozdingiz | 33 | s8: 3/3 saqlandi |
| **Clean Message!** | Xabardan ortiqchasini olib tashladingiz | 39 | s9: 2/2 to'g'ri |
| **Column Picker!** | So'rovni kerakli ustunlarga qisqartirdingiz | 43 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓ · 4/4 tavsif o'zbekcha siz-formada ✓ · hammasi ≤48 belgi ✓ ·
> hech biri nishon NOMINI takrorlamaydi (101c) ✓ · «to'g'ri/o'zingiz/to'liq» to'ldiruvchilari YO'Q (101d) ✓
> 🔴 **40-qonun (nishon-halolligi):** to'rttala trigger ham real bajariladigan harakatga
> bog'langan; `ACHIEVEMENTS` ↔ `ACH_TRIGGERS` xaritasi 4↔4.

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q)

| # | Savol | Javob |
|---|---|---|
| 1 | Ochiq ma'lumot nima? | Begona odam ko'rsa ham hech kim zarar ko'rmaydigan ma'lumot |
| 2 | Yopiq ma'lumot nima? | Begona odam ko'rsa, egasi zarar ko'radigan ma'lumot |
| 3 | Ma'lumotni yopiq qiladigan narsa nima? | Zarar — ma'lumotning turi emas |
| 4 | Nega hamma qatorni yopib bo'lmaydi? | Ilovadan foyda qolmaydi |
| 5 | Parolni bilgan odam nima qila oladi? | Sizning nomingizdan ilovaga kiradi |
| 6 | Ota-onaning telefon raqami kimniki? | Boshqa odamniki — uni siz tarqata olmaysiz |
| 7 | Ota-onaga ketadigan xabarga nima yozilmaydi? | Ilovaga kirish paroli |
| 8 | Yuborilmagan ma'lumot haqida qoida nima? | Yuborilmagan ma'lumot sizib ham ketmaydi |
| 9 | Ilova nimani yig'ishini odam qachon o'qiy oladi? | Ilovani yuklashdan oldin ham |
| 10 | `SELECT *` nimani qaytaradi? | Jadvaldagi hamma ustunni |

> 🔴 **Korpus §24 (referentsiz ko'rsatkich):** har savolda predmet nomlangan — «bu», «shu»
> bilan boshlanadigan karta YO'Q ✓
> 🔴 **Korpus §90(e):** javob darsda ishlatilgan nom bilan — «begona odam», «egasi», «qator»,
> «ustun» dars bo'ylab shu so'zlar ✓
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ ·
> darsning har kalit qoidasi kartada bor ✓ (ta'rif ×2 · mezon · chegara · parol · egalik ·
> xabar · yuborilmaganlik · vaqt · kod).
> 🔴 **Korpus §76 + 107-qonun:** yagona chet token — `SELECT *`, u kod bo'lgani uchun
> monoshriftda qoladi (`fcIsCode` belgi-tokeni). Qolgan 9 javob — gap, `t3`/`t4` + Manrope.

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Ma'lumotni zarar yopadi»** — (1) ikki turning farqi · (2) nega mezon aynan zarar · (3) sinfga savol
**s5 · «Ochiq qolish ham qaror»** — (1) hamma narsani yopish nega ishlamaydi · (2) ilova nimasiz ishlay olmaydi · (3) savol
**s7 · «Oldindan o'qiladigan ro'yxat»** — (1) ilova sahifasidagi ro'yxat · (2) odam qaror qiladigan lahza · (3) savol
**s11 · «Parol qayerda turadi»** — (1) parol faqat egasida · (2) xabar ko'p odamdan o'tadi · (3) savol

> 🔴 **43-qonun (belgi-formula taqiqi):** karta sarlavhalarida matematik va strelka belgilari
> YO'Q — to'rttala sarlavha ham to'liq gap yoki gap-bo'lagi.
> 🔴 **K-kod ekranga oqmaydi:** s7 kartasida keys-kodi ham, kompaniya nomi ham yo'q.
> 🔴 **34-qonun:** RECAPS kartalari aynan o'z teoriyasini qayta tushuntiradi, yangi ta'rif kiritmaydi.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys — **bank keysi olinmadi** (zaxira ilgak; sabab 0-bo'limda yozilgan) ✓
6. TEKSHIRUV mexanikasi oldingi darsni (Hotspot) takrorlamaydi ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): maktab jurnali ilovasi — s0 dan s15 gacha; s6 freym bilan kiradi va ko'prik bilan qaytadi ✓
- 95 (Toshkent o'smiri): maktab jurnali · o'z telefonidagi ilovalar do'koni ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas ✓
- 23 (imzo-vizual yangi): «UCH KIRISH» — band ro'yxatning hech biri emas ✓
- 26 (koding mexanikasi almashadi): kompilyator → **VS Code-topshirig'i** ✓
- 87 (o'tilgan material): `SELECT`, ustun nomlari, `WHERE` — m4-06 ✓ · `.env`/JWT **YO'Q** ✓
- 29 (kelajak-atama): `.env` · JWT · token — o'quvchi matnida **0** ✓
- 47: `?</h2>` interaktiv ekranlarda (s4·s8·s9·s10) **0** ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104: hook ikki tanlovi teng sonli, teng uzunlikda, bir xil payoff ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda ≤1) ✓
- 103: yakun bitta gap bilan yopiladi ✓

**Til-darvozalari (`MATN_ETALONI` + `til-lint-rules.json`):**

**(a) Umumiy taqiq-so'zlar:** ro'yxat bu yerda takrorlanmaydi — manba bitta,
`til-lint-rules.json` (74 qoida). Senariyning o'zi ham, qurilgan fayl ham shu darvozadan
o'tadi: `npm run lint:til pm-senariylar/M4-D7-Ishonch.md` va qurilgandan keyin
`npm run lint:til src/4-Modull/PmLesson12.jsx` → ikkalasida ham **0 error** shart.
🔴 M4-D2 tartibi (2026-08-13): taqiq-so'zning O'ZI senariyga yozilmaydi — aks holda
qonun-iqtibosi linterni yoqib yuboradi va haqiqiy topilma ko'rinmay qoladi.

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M4-D7 ga tegishli):
`.env` · `process.env` · `JWT` · `token` · `hash` (29-qonun — m4-11 atamalari) ·
`shaxsiy ma'lumot` (kattalar-hujjati iborasi) · `ilovangiz` (§40 — «sahifangiz» qoladi) ·
`o'g'ir` · `buzish` · `xakerlik` · `xavf` (66/101 — qo'rqitish taqiqi) ·
`o'chiring` · `o'chirish` (s9 da bitta fe'l — «olib tashlash») ·
`yopiqlik` (yasama ot — «ma'lumotni zarar yopadi») ·
`ko'pchilik` · `ovozlar` · `hammamiz` (§97 — yakka rejim; «sinf» mazmun so'zi sifatida qoladi) ·
`ustaxona` · `daftar` · `chala` · `buzuq` · `g'alati` ·
`ball emas` · `boshida siz` (100-qonun) · kirill harflar · qiyshiq apostrof.

**(c) Sanoq-mosligi (22-qonun):** 3 kirish (s4) · 5 qator (s4) · 2 ochiq / 3 yopiq (s4, s10) ·
5 ustun + `id` (s10) · 3 qator (s1 demo, s8, uy-vazifa) · 5 qatorli xabar / 2 ortiqcha (s9) ·
12 arena · 10 flashcard · 4 nishon · 4 «Endi siz bilasiz» — hammasi matn bilan mos ✓

**(d) 93-qonun (ta'rif so'zma-so'z bir xil):** «Ochiq ma'lumot — begona **odam** ko'rsa ham
hech kim zarar ko'rmaydigan ma'lumot» shakli s2 · flashcard 1-2 · s15 da bir xil ✓

**(e) 21-qonun (scored gloss):** to'rt testda ham, 12 arena savolida ham izohsiz chet so'z
**0**; yagona kod-tokeni `SELECT *` s10 darvoza-mashqida ochilgandan keyin ishlatiladi ✓

**(f) 17-qonun (bitta himoyalanadigan javob):** to'rt test + s6 bashorati qayta tekshirildi;
ikki nuqson topildi va tuzatildi (TEST-2 C · TEST-3 savol-fe'li) — 4-bo'limga qarang ✓

---

## 14. ⏳ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq savollar)

> 🔴 Senariy qurishga o'tishdan OLDIN shu 9 savol yopiladi.

| # | Savol | Taklifim |
|---|---|---|
| 1 | 🔴 **K10 keysi RAD etildi.** Registr `m4-07` ga K10 ni 🟡 «qisman» bilan bergan, lekin uning ISHONCH tomoni M3-D10 da allaqachon muhrlangan (TEST-3 javobi + RECAPS-7), bankda esa ma'lumot himoyasi haqida bironta gap yo'q (10-qonun devori). O'rniga **zaxira ilgak** olindi (s6 — o'quvchi telefonida tekshiriladigan holat). **Tasdiqlaysizmi — yoki K10 zo'rlab qoldirilsinmi?** | ✅ Zaxira ilgak. K10 registrda **m4b-02** ga ✅ «aynan» mos — u yerda to'la kuchda ishlaydi |
| 2 | 🔴 **Dars kartasi (`App.jsx` `m4-07`).** Hozirgi sub: «**.env** va ma'lumot himoyasi — mahsulot qiymati». `.env` — **m4-11** ning bosh atamasi va bu darsda o'rgatilmaydi ⇒ 29-qonunga zid (M3-D10 da «Acceptance Criteria» kartasi shu sababdan almashtirilgan edi) | title → «**Sinfdoshingiz sahifangizni ochsa, nimani ko'radi?**» · sub → «**kim nimani ko'radi — va nega**» |
| 3 | 🔴 **Koding qayerda bajariladi?** Topshiriq — SQL so'rovi, u HTML/JS kompilyatorida ishlamaydi. 26-qonun ham navbat almashishni talab qiladi (M3-D10 kompilyator → M4-D2 kompilyator → M4-D7 ?) | **VS Code-topshirig'i** (o'quvchi m4-06 da PostgreSQL bilan allaqachon ishlagan). Muqobil: kompilyatorga SQL rejimi — lekin bu LMS ishi bilan birga hal qilinsin |
| 4 | 🟡 **Chiqish-artefakt keyingi darsga.** `pm-m4d7-ishonch` = `{ qatorlar:[{maydon, ruxsat, sabab}×3], savedAt }`. Zanjir registrda m3-14 dan keyin ochiq qolgan | **M4-D12** (`PmLesson13`, PRD sxemasi) olsin — uch qator sxemaning «kim ko'radi» ustuni bo'ladi |
| 5 | 🟡 **Kirish-artefakt olami.** `pm-m4d2-data` musiqa ilovasining qatorlarini beradi, bu darsning demo-olami esa maktab jurnali. 96c(b/d) bo'yicha bu to'g'ri (M3-D10 pretsedenti: o'yin-klub ↔ bufet), shuning uchun matnda doim «uch qatoringiz» deyiladi | ✅ Shunday qolsin |
| 6 | 🟡 **«Sir» so'zi va shakllari butun darsda ishlatilmaydi.** Mavzu maxfiylik haqida bo'lsa ham: `MATN_ETALONI` §7 + shu o'zakka qo'yilgan lint error-qoidasi. Markaziy juftlik — **👁 ochiq / 🔒 yopiq** | ✅ Tasdiqlansin — juftlik dars bo'ylab bitta nom bilan yuradi (korpus §80) |
| 7 | 🟡 **s9 mexanikasi «bo'laklash-doska»ga yaqinmi?** M2-D7 da bo'laklar **zonaga ko'chirilardi** («🗑 Keraksizlar»). Bu yerda zona YO'Q — qator xabar ichidan chiqib ketadi, boradigan joyi yo'q | ✅ Farq yetarli deb hisoblayman. Agar shubha bo'lsa — muqobil: qatorni bosish o'rniga chizib tashlash (`line-through`), xabar uzunligi o'zgarmaydi |
| 8 | 🟡 **s6 mazmuni.** Zaxira ilgak sifatida «ilovalar do'konidagi *qanday ma'lumot yig'adi* ro'yxati» olindi — o'quvchi buni darsda o'z telefonida tekshira oladi, ya'ni o'ylab topilgan voqea emas | ✅ Tasdiqlansin. Mentor 30 soniya telefon ochishga ruxsat bersin (`MentorNote`) |
| 9 | 🔴 **Registrni yangilash.** `PM_KEYS_MEXANIKA_REGISTRI.md` 5-bo'limiga qator qo'shilsin: imzo-vizual **«UCH KIRISH»** · TEKSHIRUV **«xabardan ortiqcha qatorni olib tashlash»** · olam **🏫 maktab jurnali ilovasi** · keys **—** (zaxira ilgak). 6-bo'limga: `pm-m4d2-data` → `pm-m4d7-ishonch` → (m4-12?) | ✅ GATE S yopilgach darhol |

---

## 15. 🎓 METODIST-KORREKTURA (2026-08-13 · SENARIY-KORREKTURA rejimi)

**Tuzatildi (matn va pedagogika):**
1. **TEST-2 · C varianti almashdi** — eski «Ularni ilova baribir yopa olmaydi» s4 mexanikasida
   ROST bo'lib chiqardi (ism/sinf qatori bosilsa qaytib ochiladi). 17-qonun buzuvi. Yangi C:
   «Ular yopilsa, ilova sekin ishlab qoladi». Indeks (B) tegilmadi.
2. **TEST-3 savol-fe'li va tuzoqlar** — «qachon **biladi**?» hayotda C ni ham rost qilardi.
   Endi «qachon **o'qiy oladi**?» + tuzoqlarda «faqat». Indeks (A) tegilmadi.
3. **s6 4-slaydi** — odamlar xatti-harakati haqidagi tekshirib bo'lmaydigan da'vo olib
   tashlandi; slayd endi faqat ekranda ko'rinadigan narsani aytadi (zaxira-ilgak sharti).
4. **«Yopiqlik» yasama oti** ketdi — qoida hamma joyda fe'l bilan: **«ma'lumotni zarar yopadi»**
   (reveal · mukofot-qatori · RECAPS s3 sarlavhasi · arena MAVZU).
5. **s9 da bitta fe'l** — «o'chiring» → «olib tashlang» (nishon va holat ko'rsatkichi bilan bir xil).
6. **s8 mentor-pufagi 1 gapga tushdi** (ETALON 32: qadamlar pufakda emas, UI'da) ·
   tugma yonidagi tushunarsiz «2/2 tayyor» hisobchasi so'z bilan almashdi.
7. **Uyga vazifa aniqlashdi** — «ilovani ochib, uning sahifasidagi ro'yxat» mumkin emas edi
   (ro'yxat do'kon sahifasida turadi). Endi harakat s6 bilan aynan bir xil.
8. **93-qonun ta'rifi tiklandi** — flashcard 1-2 va s15 da «begona **odam**» so'zi qaytarildi.
9. **s2 o'lchovi qayta o'lchandi** — 362 emas, **311 grapheme**: qisqartirish kerak emas,
   ta'rif so'zma-so'z qoladi.
10. **§40 qarama-qarshiligi yopildi** — «ilovangiz» taqiq, «sahifangiz» ruxsat (sahna-o'rni);
    quruvchi bu ikkovini aralashtirmasin.
11. **§97 «sinf» istisnosi yozildi** — taqiq faqat jamoa-ovozi ma'nosida; «Sinf rahbari»,
    «🏫 Sinf» qatori va «sinfimni» tanlovi mazmun so'zlari.
12. **Til-darvozasi M4-D2 tartibiga o'tdi** — taqiq-so'zlar senariyda so'zma-so'z yozilmaydi,
    manba `til-lint-rules.json`; 13-bo'limda faqat shu darsning O'Z residue-greplari.
    Natija: `npm run lint:til pm-senariylar/M4-D7-Ishonch.md` → **0 error** (ilgari 15 edi).
13. **Kirill iqtiboslar** o'zbekchaga o'girildi (prompt-gigiena).

**Oqlandi (o'zgarmadi, sababi bilan):**
- **Zaxira ilgak (K10 RAD)** — 1-4-slayd o'quvchi telefonida tekshiriladi; kompaniya nomi,
  raqam, sana, o'ylab topilgan voqea YO'Q ✓ 10-qonun buzilmagan.
- **s6 bashorat-variantlari** — 1 va 2 slaydlarda ham, hayotda ham rost emas; to'g'ri
  belgilagan bola «Adashdingiz» olmaydi ✓ («Adashdingiz — asl javob…» qolipi M3-D10/M4-D2 dan).
- **TEST-1 va TEST-4** — har birida bitta himoyalanadigan javob; TEST-4 da A va C parol
  turishi KERAK bo'lgan joylar ✓.
- **Hook ikki tanlovi** — payoff bir xil, maqtov yo'q, «to'g'ri taxmin» tushunchasi yo'q ✓.
- **`.env` · JWT · token · hash** — senariyda faqat taqiq-izohlarida; o'quvchi matnida 0 ✓.
  Karta-sub tuzatishi (`App.jsx` m4-07) **GATE S ga qoldirildi** — 14-bo'lim 2-bandi.
- **«egasi» so'zi glosssiz** — o'zbekchada kundalik so'z, s4 javob-qatorlari uni aniq
  odamlar bilan ko'rsatadi («Bahoyingizni faqat siz va uydagilaringiz biladi»).
- **`SELECT *`** — s10 darvoza-mashqi uni ishlatishdan OLDIN ochadi, ya'ni gloss ekranning
  o'zida (21-qonun bajarildi).

**GATE S ga qoldirildi (metodist hal qilmaydi):** 14-bo'limdagi 9 savol · `App.jsx` karta
matni · koding qayerda bajarilishi · chiqish-artefakt egasi · registr-yozuvi.

---

*Senariy `PM_Prompt_v8` (9 blok · 13 maydon) · `PM_DARS_ETALON` (1–113) · `MATN_KORPUS` (§0–§98) ·
`MATN_ETALONI` (lug'at + 7-B) · `PM_KEYS_MEXANIKA_REGISTRI` bo'yicha yozildi.
2026-08-13: `pm-metodist` SENARIY-KORREKTURA bajarildi (15-bo'lim) → keyingi qadam **[GATE S]**.*

---

## ✅ [GATE S] YOPILDI — 2026-08-13, foydalanuvchi («tavsiyang bo'yicha»)

1. 🔴 **K10 RAD → ZAXIRA ILGAK TASDIQLANDI** (K10 ning ishonch tomoni M3-D10 da band; bankda maxfiylik yo'q).
2. **App.jsx m4-07 sub'dan `.env` olib tashlandi** (29-qonun — u m4-11 `AuthEnvLesson` niki) — bajarildi.
3. **Koding = VS Code topshirig'i** — TASDIQLANDI (navbat: M4-D2 kompilyator → M4-D7 VS Code).
4. **Chiqish-artefakt → m4-12 (PRD sxemasi)** — taklif qoladi, m4-12 senariysida yakunlanadi.
5. 🔴 **Kirish-artefakt kaliti M4-D2 GATE S qaroriga moslanadi:** `pm-m4d2-data.maydonlar` (`qatorlar` EMAS).
6. **«sir» so'zining taqiqi** — TASDIQLANDI (markaziy juftlik: 👁 ochiq ↔ 🔒 yopiq).
7. **s9 «ORTIQCHASINI OLIB TASHLANG»** — TASDIQLANDI (yozuvchi taklifi bo'yicha).
8. **s6 zaxira-ilgak mazmuni** — TASDIQLANDI (o'quvchi telefonida 10 soniyada tekshiradigan holat, kompaniya/raqam/sanasiz).
9. **Registr yangilandi** — bajarildi.
