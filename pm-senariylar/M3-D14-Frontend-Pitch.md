# M3-D14 — Ishlayotgan saytingizni qanday ko'rsatasiz? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/3-Modull/PmLesson10.jsx` (hozirgi `-v16` avlod dars BUTUNLAY almashadi;
> yangi `lessonId: pm-m3d14-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.
> 🔴 Bu dars **3-Modulni YOPADI** — chiqish-artefakti moduldan tashqariga chiqadi.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 3 — «Frontend — React» (oy 3–4.5) |
| **Dars** | M3-D14 (modulning 14-darsi) · `key: m3-14` |
| **Mavzu** | Ishlaydigan frontend mahsulotini jonli ko'rsatish — **ko'rsatuv** (pitch) |
| **TUR** | 🔴 **2-TUR (sof PM)** — artefakt = matn/nutq, keyingi modulga o'tadi (`PM_DARS_ETALON` 1-B). USTAXONA (48/80-qonun) **majburiy** |
| **Bosh keys** | **K12 · AIRBNB PITCH DECK** (temalar: *pitch tuzilishi · storytelling*) |
| **ISHLATILGAN_KEYS (modul-ichi)** | M3 da band: K11 (M3-D2) · K15 (M3-D2, yordamchi) · K14 (M3-D5) · K10 (M3-D10) → **K12 M3 da birinchi marta** ✓ (registr 4-bo'lim: modul-ichi qoidasi). 🔴 Global: K12 M1-D14 va M2-D13 da ishlatilgan — **uchinchi burchak** olindi (pastda 6-bo'lim) |
| **Oldingi PM dars (M3-D10) TEKSHIRUV mexanikasi** | **Timeline** (qabul qadamlarini tartibga solish) — **takrorlanmaydi** |
| **Band mexanikalar (TAQIQ)** | **M3-D10**: «ISHGA TUSHIRIB KO'RISH» soxta formasi · Timeline · **M3-D5**: ikki o'qli foyda-vaqt doskasi · kartani boshqa katakka ko'chirish · hafta-chizig'i · rang-juftlash · **M3-D2**: story-silosi · 3 hikoya ustaxonasi · tekshiruvchi stoli · klinika · `hikoyaYasa` kompilyatori · PairTimer · **M2-D7**: bo'laklash-doska · **M7-D2/M8-D1**: JTBD shtampi · Metrika alangasi · MatchPairs · 🔴 **PITCH-DARSLARIDAN**: tushunish chizig'i · so'z-elagi · tinglovchi-javobi kartalari · uch qatlam o'xshatishi · **tinglovchi kursisi** (M2-D13) · TimeLine/sahna-taymeri · **MicRecorder ovoz-yozuv** · texnik↔odamcha juftlik-tanlovi · demo 3 qadam-akkordeoni · **ota-ona savollari** · repetitsiya kabinasi (M1-D14) · 30s juftlik-sekundomeri (M1-D12) |
| **Misol-ip (91 + 95 + 96c + 108)** | 🏀 **MAYDONCHA** — maktab yonidagi futbol maydonchasini band qilish sayti (sinfdoshi qurgan React sayti). **Demo-olam** shu; **o'quvchining O'Z ishi** esa uning M3 loyihasidan keladi (96c(b/d): ikkovi boshqa olam — bu normal). 95-qonun: o'smir maydonchani do'stlari bilan haftada bir marta band qiladi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti (M3-D10) — **maydoncha band emas** ✓ *(muqobil: 🎒 maktab to'garaklari — 14-bo'lim 2-bandi)* |
| **Kirish-artefakt** | `pm-m3d10-shartlar` = `{ ish: "…", shartlar: [3 ta matn], savedAt }` — M3-D10 da «tayyor» deb qabul qilingan ish. 🔴 Ikki tomonlama shart-tekshiruvi (F-0803-22-B): shakl va kalit AYNAN shu; **faqat `ish` maydoni o'qiladi** (14-bo'lim 6-bandi), yo'q bo'lsa zaxira yo'l ishlaydi |
| **Chiqish-artefakt** | 🔴 `pm-m3d14-pitch` = `{ ish: "…", kadrlar: [ {gap, harakat} ×3 ], savedAt }` — modulni yopadi; keyingi egasi 14-bo'lim 7-bandida |
| **Yordamchi kalitlar** | `pm-m3d14-hook-choice` (faqat YOZILADI — 100c) · `pm-m3d14-code` · `pm-m3d14-reflection` · `pm-m3d14-hw-target` · `ccProgress` |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D10/M3-D5 da tasdiqlangan yakun-tuzilmasi bilan bir xil |

**Atama-glosslar (62/39-qonun — avval hodisa, keyin nom):**
- 🔴 **«pitch» ekranga CHIQMAYDI** (korpus §20: markaziy atama bo'lsa qavs-gloss yetmaydi — o'zbekcha ibora atamaning O'RNINI oladi). Dars bo'ylab **«ko'rsatuv»**. Inglizcha juftlik faqat flashcard javobida: «Ko'rsatuv (inglizchasi — pitch)». Lug'at-asos: «sotuv-nutq (pitch haqida) → ishontiradigan» qatori (MATN_ETALONI 3-lug'at, F-0722);
- 🔴 **«demo» ishlatilmaydi** → **«ko'rsatuv»** / «jonli ko'rsatish». Sabab: bir tushuncha — bir nom (korpus §80). ⚠️ M1-D14 da «jonli demo» bo'lak-nomi bor — bu dars u so'zni OLMAYDI;
- 🔴 **«feature» ishlatilmaydi** → **«imkoniyat»** (lug'at); **«stakeholder»**, **«investor»** darsga umuman kirmaydi (109 TMI: keys uchun kerak emas — Airbnb slaydlarida tinglovchi umuman nomlanmaydi, pastdagi «qarab turgan odam» bandiga qarang);
- 🔴 **«kadr» — darsning O'Z so'zi** (41-qonun: metafora darsning o'z lug'atidan). Kadr = ko'rsatuvning bitta lahzasi: **bitta gap + bitta harakat**. So'z 13 yoshli bolaga tanish (telefon kamerasi, video kadri) va gloss talab qilmaydi;
- «storytelling» → **ishlatilmaydi** (izohsiz inglizcha); dars sarlavhasi ham almashadi (14-bo'lim 1-bandi);
- 🔴 **«ko'rsatuv» ma'nosi BIR XIL turadi:** ishlaydigan saytni odam oldida ochib, uch kadr bilan tushuntirib berish. Boshqa ma'noda («film ko'rsatuvi», «ko'rsatkich») ISHLATILMAYDI.
- 🔴 **Qarab turgan odam — bitta nom** (korpus §80). Ekran matnida **«qarab turgan odam»**; hookda sahna aniq bo'lgani uchun «yoningizdagi odam» ✓. ❌ «tomoshabin» (ko'rsatuv + kadr yonida televizor-ma'nosini kuchaytiradi va o'quvchi video yasashni o'ylaydi) · ❌ «tinglovchi», «investor», «stakeholder».
- 🔴 **Ichki blok-nomlari ekranga OQMAYDI** (korpus §84, lint `yadro-jargon`): **YADRO · USTAXONA · HOOK · RECAP · artefakt** — senariy-tuzilma nomlari. Eyebrow/chip/sarlavhada sodda o'zbekcha: «Muhokama», «O'z ishingiz», «Kirish», «Takrorlash», «tayyor natija». Quruvchi uchun majburiy tekshiruv: `grep -ni "yadro\|ustaxona\|artefakt"` — JSX satri ichida **0**.

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «GAPSIZ KO'RSATUV»** (23-qonun: har darsda YANGI — P0 story-silosi · JTBD shtampi ·
Metrika alangasi · M3-D5 ikki-o'qli doskasi · **M3-D10 «ishga tushirib ko'rish» formasi** klonlanmaydi;
pitch-darslarining tushunish chizig'i (M2-D13) va 3 daqiqalik TimeLine + mikrofon (M1-D14) ham klonlanmaydi).

Ekranda **to'rt kadrli tasma** turadi — sinfdoshining sayt ko'rsatuvi. Har kadr ikki qavatli:
**tepasi — ekran lahzasi** (kichik brauzer oynasi: sahifa, qidiruv, tugma, ro'yxat),
**pasti — gap-qatori**, hozircha bo'sh (`💬 …`). Ya'ni ko'rsatuv **gapsiz** turibdi.

O'quvchi kadrni bosadi → gap-qatoriga **sinfdoshi o'sha lahzada aytgan gap yoziladi**, va darhol
yonida bitta qisqa hukm-qator chiqadi:

| # | Kadrda ekranda ko'rinadi | Bosilganda yoziladigan gap | Hukm-qatori |
|---|---|---|---|
| 1 | Bo'sh soatlar ro'yxati | «Bu — bosh sahifa, tepasida menyu bor.» | ⚪ Buni ekranning o'zi ko'rsatib turibdi — gap hech narsa qo'shmadi |
| 2 | Qidiruv maydoniga «shanba» yozildi | «Bu yerda qidiruv bor.» | ⚪ Buni ekranning o'zi ko'rsatib turibdi — gap hech narsa qo'shmadi |
| 3 | «Band qilaman» tugmasi bosildi | «Ilgari bo'sh soatni guruhda so'rab yurardik — mana, bir bosishda band bo'ladi.» | ✅ Buni ekran ko'rsatmaydi — gap yangi narsa qo'shdi |
| 4 | Ro'yxatda yangi qator paydo bo'ldi | «Qarang, hozir band qildim — ismim darhol ro'yxatga tushdi.» | ✅ Buni ekran ko'rsatmaydi — gap yangi narsa qo'shdi |

🔴 **Rang semantikasi (71-qonun + palitra):** bo'sh gap **qizil EMAS** — u o'quvchining xatosi emas,
kashfiyot-materiali. Bo'sh gap = **xira kulrang** qator (`ink3`), qo'shgan gap = **yashil ✓** (`success`).
`err/errSoft` bu ekranda umuman ishlatilmaydi.

🔴 **106d/71-qonun:** belgi yolg'iz qolmaydi — har bosishdan keyin o'quvchi **nega** shundayligini
o'sha zahoti o'qiydi, taxmin qilmaydi.

**Nima uchun aynan shu:** ko'rsatuvni **tushuntirib** o'rgatib bo'lmaydi — bola «gapiring» degan
maslahatni allaqachon eshitgan. Bu yerda u **o'zi eshitadi**: to'rt gapdan ikkitasi ekranda ko'rinib
turgan narsani takrorlaydi va hech narsa qo'shmaydi. Bu — darsning butun ma'nosi, va uni mentor
AYTMAYDI (98b): o'quvchi to'rt bosishda o'zi topadi.

🔴 **Mexanika-farqi (26/59-qonun):** M3-D10 da o'quvchi **sinab ko'rardi** (tekshiruv), M3-D5 da
**joylashtirardi** (qaror), bu yerda **ochib o'qiydi va solishtiradi** (kuzatuv). Uch xil ish, takror emas.
🔴 **M1-D14 dan farq (majburiy):** M1-D14 = **nutqni mashq qilish** (mikrofon, 3 daqiqa sanog'i,
repetitsiya). M3-D14 = **ishlaydigan mahsulotni ko'rsatish tartibi** (kadr, harakat, natija).
Bu darsda mikrofon YO'Q, taymer YO'Q, sekundomer YO'Q.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D10 dagidek — etalon (P0 · PmLesson2 · PmLesson4):
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Saytni ochib ko'rsatdingiz. Odam nima deydi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch kadr o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — ekran nimani aytadi, gap nimani aytadi | 3 | — | ikki karta tap-ochilma (46-qonun) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **GAPSIZ KO'RSATUV** (4 kadr) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K12 Airbnb (4 slayd + 1 bashorat) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | USTAXONA — o'z ishiga **3 kadr** yozish (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — ko'rsatiladigan harakatni topish | 5 | — | 🔴 **Hotspot** (yangi mexanika) |
| s10 | KODING — natijani ko'rinadigan qilish | 6 | — | 26/82/87-qonun · VS Code topshirig'i |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.
🔴 **47-qonun darvozasi:** interaktiv ekranlarda (**s4 · s8 · s9 · s10**) sarlavha buyruq shaklida —
`?</h2>` shu 4 ekranda **0**; hook · teoriya · keys · refleksiya (s0 · s2 · s6 · s12) da savol-sarlavha RUXSAT.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 3 — Frontend: React
DARS: M3-D14 (14-dars)
DARS_MAVZUSI: Ishlaydigan saytni jonli ko'rsatish — uch kadrlik ko'rsatuv
ISHLATILGAN_KEYS: K12
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Saytingizni ochib «mana, qildim» dedingiz. Yoningizdagi odam ekranga qaraydi —
keyin nima deydi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL natija ochiladi: ekranda ro'yxat ham, tugma ham bor — lekin sayt nima uchun
qilinganini ekranning o'zi aytmaydi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: ekran ko'rsatadi, tushuntirmaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Tanlovlar bo'linadi. «Zo'r ekan» deganlar ko'p bo'lsa — bu ham dars:
maqtov tushunish degani emas.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Ostidagi izoh (tanlangach ochiladi) |
|---|---|
| 👍 «Zo'r ekan!» deb qo'yadi | Ochib ko'ramiz: ekranda ro'yxat ham, tugma ham bor. Lekin bu sayt **nima uchun** qilinganini o'sha odam baribir bilmaydi. |
| 🤔 «Xo'sh, bu nima o'zi?» deb so'raydi | Ochib ko'ramiz: ekranda ro'yxat ham, tugma ham bor. Lekin bu sayt **nima uchun** qilinganini o'sha odam baribir bilmaydi. |

> 🔴 **104-qonun (teng og'irlik):** hookda to'g'ri javob YO'Q — shuning uchun izoh ikkala tanlovda
> **bir xil** va **maqtovsiz**: ❌ «To'g'ri sezdingiz…» (bitta tanlovni to'g'ri qilib ko'rsatadi).
> 🔴 **97-qonun:** savol o'quvchi bajargan harakatdan o'sadi — u kecha saytini qurdi, bugun ko'rsatadi.
> 🔴 **100-qonun:** tanlov `pm-m3d14-hook-choice` ga yoziladi, hech qayerda o'qilmaydi.
> 🔴 **62-qonun:** «ko'rsatuv» atamasi bu ekranda YO'Q — u s1/s2 da ochiladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda chiqadi.
> O'quvchi matnida «ko'pchilik», «sinf», «ovozlar» so'zlari **0** — payoff ikkala rejimda
> so'zma-so'z bir xil o'qiladi. Sinf-kuzatuvi MENTORGA maydonida qoladi.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida ishingizni istalgan odamga uch kadrda ko'rsatib bera olasiz —
har kadrda bitta gap va bitta harakat. Shu uch kadr birga ko'rsatuv deyiladi.
HARAKAT: O'quvchi kuzatadi: uchta bo'sh kadr o'z-o'zidan yozilib chiqadi — avval gap,
keyin harakat.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kadrlar yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

> 🔴 **40-qonun:** «ko'rsatib bera olasiz» — bilim, rost.
> 🔴 **39-qonun (avval oddiy gap, keyin nom):** atama ekranning BIRINCHI so'zi bo'lmaydi —
> avval nima bo'lishi aytiladi, keyin «shu uch kadr birga **ko'rsatuv** deyiladi». Shundan
> so'ng «ko'rsatuv» dars bo'ylab erkin ishlatiladi.
> 🔴 **42-qonun (fe'l ↔ ekran jarayoni):** kadrlar «to'ladi» EMAS — **«o'z-o'zidan yozilib chiqadi»**.
> 🔴 **54(b/c):** `ta-sub` ikkinchi qatori YO'Q · demo ostidagi caption YO'Q.
> 🔴 **Spoyler-taqiq (M3-D5/M3-D10 saboqi):** demo-kadrlar **boshqa ish uchun** yozilgan
> («Bo'sh soatlarni ko'rish») — ular s4 ning to'rtligiga ham, s8 javoblariga ham KIRMAYDI.
> 🔴 **63-qonun:** mentor kadr-bo'laklarini SANAB bermaydi — vizual o'zi ko'rsatadi.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (gapsiz ko'rsatuv tasmasi) + 3 × Quiz
EKRAN: Ishlaydigan sayt o'zini o'zi tushuntirmaydi. Ekran nima borligini ko'rsatadi —
nima uchun kerakligini faqat sizning gapingiz aytadi.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) to'rt kadrni bosib gaplarini o'qiydi va
qaysi ikkitasi hech narsa qo'shmaganini topadi; (s6) keys-slaydlarini bashorat bilan ochadi.
JAVOB: s4 — to'rt gapdan ikkitasi ekranni takrorlaydi, ikkitasi yangi narsa qo'shadi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da o'quvchilar to'rttala kadrni ochib bo'lgach so'rang: qaysi ikki gapni
olib tashlasak, ko'rsatuv hech narsa yo'qotmaydi?
```

**s2 — TEORIYA-1: ekran nimani aytadi, gap nimani aytadi** (73-korpus: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat): **«Ishlaydigan sayt o'zini o'zi tushuntiradimi?»**

Ikki karta, bosilganda ochiladi (46-qonun: toggle):

| Karta | Ochilganda |
|---|---|
| 🖥 **Ekran nimani ko'rsatadi** | Nima borligini: ro'yxat, tugma, sahifalar |
| 🗣 **Siz nimani aytasiz** | Nima uchun kerakligini: ilgari bu ish qanday og'ir edi, endi nima oson |

Xulosa-karta (69-qonun · uch qisqa gap · blok-gapining O'ZI):
> **Ishlaydigan sayt o'zini o'zi tushuntirmaydi.** Ekran nima borligini ko'rsatadi. Nima uchun kerakligini faqat sizning gapingiz aytadi.

> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlanadi.
> 🔴 **Ekran-o'lchovi (Intl.Segmenter):** sarlavha + 2 karta + xulosa ≈ **330 grapheme** (chegara 400).
> Shuning uchun «bo'sh gap» tushunchasi bu ekranga QO'SHILMAYDI — u s4 da o'quvchining O'ZI
> topadigan narsa (korpus §72: bir g'oya ikki martadan ko'p aytilmaydi).

**s4 — YADRO: GAPSIZ KO'RSATUV** (markaziy mexanika)

Sarlavha (47-qonun — buyruq): **«To'rt kadrni bosib, sinfdoshingiz nima deganini o'qing.»**

Mentor (1 gap — sarlavhadagi buyruqni TAKRORLAMAYDI, faqat sahnani qo'yadi · korpus §67b):
> Pastda sinfdoshingiz o'z saytini ko'rsatyapti — to'rt kadr, gaplari hali yozilmagan.

**To'rt kadr, gaplar va hukm-qatorlari:** 1-bo'limdagi jadval (ekranda AYNAN shu matnlar turadi).

🔴 **«Qaysi gap bo'sh» ustuni o'quvchi ekranida YO'Q** (98b: javob mashq ustida yozilmaydi) —
hukm-qatori faqat kadr **bosilgandan keyin** o'sha kadrning ostida chiqadi.

Yakun-qatori (to'rttala kadr ochilgach, bitta gap):
> ✅ **To'rt gapdan ikkitasi ekranda ko'rinib turgan narsani takrorladi. Gap ekranda ko'rinmaydigan narsani qo'shishi kerak.**

> 🔴 **98b/60-qonun:** mentor qaysi gap bo'shligini AYTMAYDI — o'quvchi o'zi topadi.
> 🔴 **72-qonun:** kadr-tasmasi yorliqli idishda, diqqat-pulsi bilan; birinchi bosishdan keyin puls tinadi.
> 🔴 **88-qonun (yurish naqshi):** to'rttala kadr ham ochilishi kerak — puls faqat **ochilmaganlar**
> bo'ylab aylanadi, ochilgani navbatdan chiqadi (1-C.4).
> 🔴 **106d:** har bosishdan keyin javob darhol chiqadi — belgi (⚪/✅) **va** yonidagi qisqa qator.
> 🔴 **Gap-matnlari jonli og'zaki** (korpus §42): «Qarang, hozir band qildim» — bola shunday gapiradi.
> ⚠️ **Ekran-yuki (metodist o'lchovi, Intl.Segmenter):** boshlanishda ekranda **~230 grapheme**
> (sarlavha + mentor + 4 kadr yorlig'i) ✓; to'rttala kadr ochilgach **686** bo'ladi — 400 dan
> yuqori, lekin bu matn **birdaniga emas, o'quvchining O'Z to'rt bosishi bilan** ochiladi va har
> bosishdan keyin u faqat bitta yangi juftlikni o'qiydi. Shuning uchun kadr-gaplari
> qisqartirilmaydi; o'rniga: **mentor pufagi 1 gap** (yuqorida qisqartirildi) va **yakun-qatori
> faqat to'rttasi ochilgandan keyin** chiqadi. Quruvchiga: bu ekranga boshqa hech qanday
> tushuntirish-blok qo'shilmaydi (106-budjet shu yerda tugadi).

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (USTAXONA) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish ustaxonasi)
EKRAN: (sarlavha) Ishingizga uch kadr yozing.
(mentor, 1 gap) O'tgan PM darsida «tayyor» deb qabul qilgan ishingiz pastda turibdi —
uch kadrni aynan shu ish uchun yozasiz.
HARAKAT: Uch kadrni BITTALAB yozadi. Har kadrda ikki maydon: gap (bitta jumla) va
harakat (3–5 so'z). Saqlangach kadr o'ngdagi tasmaga ko'chadi, chapga keyingisi keladi.
JAVOB: Uch kadr ham yozilgan · har kadrda bitta harakat bor · birorta gap ekranda
ko'rinib turgan narsani takrorlamaydi.
RO'YXAT: Uch kadr yozilgan · Har kadrda bitta harakat bor · Birorta gap ekranni takrorlamaydi
YULDUZCHA: Uchinchi kadrni bitta raqam bilan kuchaytiring: ilgari necha qadam kerak
edi, endi nechta?
YORDAM: Bitta savoldan boshlang: bu ish sayt bo'lmaganda qanday qilinardi? Javobingiz —
birinchi kadr gapi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Bu yerda ro'yxat chiqadi» kabi gaplar chiqadi — bu eng foydali xato.
Javob-qatori uni tutadi, siz muhokama qiling: buni odam ekranda ko'rmayaptimi?
```

🔴 **Kirish-artefakt tarmog'i (69-korpus — ikki tarmoq bir shaklda, bir uzunlikda):**
- **Artefakt BOR:** «O'tgan PM darsida «tayyor» deb qabul qilgan ishingiz pastda turibdi — uch kadrni aynan shu ish uchun yozasiz.»
- **Artefakt YO'Q:** «Boshlash uchun maydoncha saytidan tanish ish pastda turibdi — uch kadrni aynan shu ish uchun yozasiz.» *(kartada ishning nomi: «Soatni band qilish»)*
- 🔴 «topilmadi / saqlanmagan / bo'sh» so'zlari **0** · zaxira-namuna **shu darsning O'Z olamidan** (maydoncha, 96c-d).
- 🔴 **Ikki tarmoq bir shaklda** (korpus §69): ikkalasi ham **ISHNI** nomlaydi va bir xil ikkinchi yarim bilan tugaydi. ❌ oldingi variant: bir tarmoqda «ishingiz», ikkinchisida «"Band qilaman" **tugmasi**» — o'quvchi zaxira tarmoqda ish o'rniga tugma haqida yozib qo'yardi.
- 🔴 **Kartada faqat ishning NOMI turadi.** M3-D10 dan keladigan uchta shart bu ekranda
  KO'RSATILMAYDI: ular bu darsda hech qanday ish so'ramaydi va ekranga to'rtinchi blok qo'shadi
  (86b + 106-qonun budjeti). ⚠️ Bu GATE S qarori — 14-bo'lim 6-bandiga qarang.
- 🔴 **Olam farqi normal:** o'quvchining ishi uning O'Z M3 loyihasidan keladi, darsning demo-olami
  esa maydoncha — 96c(b/d) bo'yicha bu to'g'ri; **shuning uchun matnda «maydoncha ishingiz» deb
  yozilmaydi**, doim «o'z ishingiz».

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Hotspot (sayt ustida joy tanlash)
EKRAN: Ko'rsatuvda bosiladigan joyni tanlang.
(yo'riqnoma, ≤20 so'z) Hamma sahifani ochib chiqmaysiz — bitta joyni bosasiz: bu ish
chindan bajarilishini ko'rsatadigan joyni.
HARAKAT: Soxta sayt ustidagi beshta joydan bittasini bosadi. To'g'ri topgach ikkinchi
bosqich ochiladi: natija qayerda ko'rinishini ham bosib ko'rsatadi.
JAVOB: 1-bosqich — «Band qilaman» tugmasi · 2-bosqich — ro'yxatdagi yangi qator.
RO'YXAT: —
YULDUZCHA: —
YORDAM: Bitta savol yetadi: qaysi joy bosilsa, ish chindan bajariladi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Ko'rsatuvingizni sherigingizga o'qib bering — u «qayerni bosasiz?» deb so'rasa,
harakat aniq yozilmagan. Sinfda juftlikda sinab ko'ring.
MENTORGA: Eng ko'p bosiladigan noto'g'ri joy — menyu. Aynan shu yerda so'rang:
menyuni ochsak, qarab turgan odam nimani bilib oladi?
```

**Beshta bosiladigan joy va qoida-qatorlari:**

| Joy | Bosilganda |
|---|---|
| ① Yuqoridagi menyu | 🤔 Bu joy saytda bor, lekin bu yerda ish bajarilmaydi |
| ② Qidiruv maydoni | 🤔 Bu joy saytda bor, lekin bu yerda ish bajarilmaydi |
| ③ **«Band qilaman» tugmasi** ✅ | ✅ Ish aynan shu yerda bajariladi |
| ④ Pastdagi aloqa qatori | 🤔 Bu joy saytda bor, lekin bu yerda ish bajarilmaydi |
| ⑤ Sozlamalar belgisi | 🤔 Bu joy saytda bor, lekin bu yerda ish bajarilmaydi |

**2-bosqich (94-qonun — birinchisi tasdiqlangach ochiladi):** «Endi natija qayerda ko'rinishini
ko'rsating.» → ro'yxatdagi yangi qator ✅.

Yakun-qatori:
> ✅ **Ko'rsatuv — bitta harakat va uning ko'rinadigan natijasi.**

> 🔴 **26-qonun tekshiruvi:** M3-D10 TEKSHIRUVi Timeline (qadamlarni tartibga solish) edi; bu yerda
> **Hotspot**. Takror YO'Q ✓ · PM darslarida Hotspot birinchi marta (registr 5-bo'limi) — 14-bo'lim 8-bandi.
> 🔴 **7-qonun (hotspot rangi):** topilgan joy YASHIL ✓; qizil FAQAT noto'g'ri bosilganda.
> 🔴 **106d + korpus §98:** noto'g'ri bosishda **qoida** beriladi, qaysi joy to'g'riligi AYTILMAYDI;
> qoida-qatori beshta joyning birortasining NOMINI ishlatmaydi. YORDAM-savoli ekran boshida
> TURMAYDI — u faqat birinchi xatodan keyin ochiladi.
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda). 🔴 **106f(c):** SOFT matni —
> sinf ish-tartibi, shuning uchun u `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code topshirig'i)
EKRAN: (sarlavha) Natijani ko'rinadigan qiladigan kod yozamiz.
(mentor) Tugmani bosdingiz — qarab turgan odam nimani ko'radi? Shu javobni kodga yozasiz.
HARAKAT: O'z loyihasini VS Code'da ochadi va asosiy tugmasiga tasdiq qatorini qo'shadi:
holat o'zgaradi va ekranda bitta qator chiqadi. Keyin sahifada o'zi bosib ko'radi.
JAVOB: Tugma bosilganda ekranda tasdiq qatori chiqadi (o'quvchi o'z brauzerida ko'radi).
RO'YXAT: Tugma bosilganda holat o'zgaradi · Tasdiq qatori ekranda chiqadi · Sahifada
o'zingiz bosib ko'rdingiz
YULDUZCHA: Tasdiq qatoriga bosilgan narsaning nomini ham chiqaring.
YORDAM: Bitta qadamdan boshlang: tugma bosilganda holatni rost qiling. Ekranda
chiqarishni keyin qo'shing.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Bu topshiriq ko'rsatuvning ikkinchi kadrini ishlaydigan qiladi — shuni ochiq
ayting: tasdiq qatori bo'lmasa, qarab turgan odam bosilganini bilmaydi.
```

> 🔴 **87-qonun (o'tilgan texnik material):** m3-03 JSX · **m3-04 `useState`** · m3-06 props ·
> m3-08 `fetch`/JSON · m3-09 POST/PUT/DELETE · m3-11 Router · **m3-12/m3-13 o'z loyihasi** ·
> M2 dan `if`, `console.log`. Topshiriqda shundan tashqari hech narsa yo'q.
> 🔴 **26-qonun (mexanika almashadi):** M3-D5 VS Code topshirig'i → M3-D10 kompilyator →
> **M3-D14 VS Code topshirig'i** (navbat bilan). ⚠️ GATE S qarori — 14-bo'lim 5-bandi.
> 🔴 **82(b/d):** preview/mock-panel YO'Q · kod NUSXALANMAYDI, sabab ochiq aytiladi.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch kadringizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan uch kadringizni ayting: nima deysiz, nimani bosasiz, nima
osonlashadi. Avval sherigingizga ayting, keyin bir qatorda yozing.
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
MENTORGA: Uchdan biri ikkinchi kadrni ayta olmasa — s9 dagi saytni qayta oching va
bitta harakatni birga toping.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha «O'zingizni sinab ko'ring.»
> 🔴 **76-qonun:** mentor niyatni OCHIQ aytadi va dars atamalari bilan savol beradi.
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'qiyotgan o'quvchida sherik YO'Q — unga «Avval
> **ovoz chiqarib o'zingizga** ayting, keyin bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl,
> bir uzunlikda.

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda ko'rsatuvingizni haqiqiy saytda sinab ko'rasiz: kadrni o'qiysiz, aytgan
harakatingizni bajarasiz va mos kelmasa kadrni tuzatasiz. Qancha vaqtingiz bor —
o'zingiz tanlaysiz.
HARAKAT: Kadrlarni o'z saytida sinab ko'radi va mos kelmaganini tuzatadi.
JAVOB: —
RO'YXAT: Uch kadr saytda sinab ko'rilgan · Har kadrdagi harakat chindan bajarilgan ·
Mos kelmagan kadr tuzatilgan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Ikkinchi kadrni saytda sinab ko'ring — aytgan harakatingiz chindan
ishlaydimi?
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa.
Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **11-korpus:** topshiriq kartasi 3 raqamli qadam + muddat; **yakun-ekranda AYNAN shu takrorlanadi**.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «uch kadr» sanog'i
> faqat To'liq-kartada turadi, aks holda «Qisqa» tanlagan o'quvchi ikki xil topshiriqni birga o'qiydi.
> 🔴 **Namunasiz harakat taqiqi:** vazifadagi har ish darsda KO'RSATILGAN — kadrni o'qish s4 da,
> harakatni bosish s9 da, kadrni tuzatish s8 ning ✎ tahririda.

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
MAVZU: Ishlaydigan sayt o'zi nimani aytmasligi; ekranni takrorlagan gap (bo'sh gap);
uch kadr va ularning tartibi; ko'rsatuvda nechta harakat bosilishi; harakat va uning
ko'rinadigan natijasi; Airbnb taqdimotining tartibi va oxiri.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) ·
> 105b (bir nafasda o'qiladigan) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas).
> Variant uzunliklari teng (8.4) — qavsdagi son = belgi soni.

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🖥 Saytingizni ochib ko'rsatdingiz. Ekranning o'zi nimani aytmaydi?
- A. Qanday tugmalar borligini *(25)*
- **B.** Nima uchun kerakligini ✅ *(22)*
- C. Sahifa qanday ko'rinishini *(26)*

**Reveal:** To'g'ri — ekran nima borligini ko'rsatadi, nima uchun kerakligini siz aytasiz.

> 🔴 **17-qonun:** A va C — ekran chindan KO'RSATADIGAN narsalar, ya'ni «aytmaydi» savoliga
> javob bo'lolmaydi; faqat B himoyalanadi. Uzunlik-tell: 26 ÷ 22 = 1.18 ✓ (≤1.4).

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 💬 Qaysi gap ko'rsatuvga hech narsa qo'shmaydi?
- A. Ilgari buni guruhda so'rab yurardik *(35)*
- B. Mana, hozir bosdim — ro'yxatga tushdi *(37)*
- **C.** Bu — bosh sahifa, tepasida menyu bor ✅ *(36)*

**Reveal:** To'g'ri — bu gap ekranda ko'rinib turgan narsani takrorlaydi.

> 🔴 **64-qonun:** A (ilgarigi holat) va B (jonli natija) — ikkalasi ham ekranda YO'Q narsani
> qo'shadi, ya'ni C dan ma'no jihatdan uzoq. Uzunlik-tell: 37 ÷ 36 = 1.03 ✓.
> 🔴 Emoji savol oldida ✅ EMAS (u «to'g'ri» degan yolg'on signal beradi) → 💬.

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 📊 Airbnb taqdimoti nima bilan tugagan?
- **A.** Jamoa bilan — ishni kim qilayotgani ✅ *(35)*
- B. Narx bilan — qancha turishi *(27)*
- C. Sayt ekranlari bilan — qanday ko'rinishi *(40)*

**Reveal:** To'g'ri — oxirgi varaqda jamoa turgan: ishni kim qilayotgani.

> 🔴 **10-qonun (keys-sadoqati):** bankda tartib aynan shunday — muammo → yechim → bozor →
> mahsulot → **jamoa**. B (narx) bankda umuman YO'Q, C esa mahsulot varag'ini oxirgi qilib
> ko'rsatadi — ikkalasi ham ishonarli, lekin noto'g'ri (korpus §21). Uzunlik-tell: 40 ÷ 35 = 1.14 ✓.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 🎬 Ko'rsatuvda bosiladigan joy qanday tanlanadi?
- A. Sahifada birinchi ko'ringan joy tanlanadi *(41)*
- **B.** Ish chindan bajariladigan joy tanlanadi ✅ *(39)*
- C. Eng chiroyli ko'ringan sahifa tanlanadi *(39)*

**Reveal:** To'g'ri — bitta harakat ishning bajarilishini ko'rsatadi; qolgan sahifalarni ochib o'tirmaysiz.

> 🔴 B darsning O'Z so'zlari bilan yozildi (s9 yo'riqnomasi). Uzunlik-tell: 41 ÷ 39 = 1.05 ✓.
> 🔴 **Savol-variant mosligi:** uchala variant ham «qanday tanlanadi?» savoliga **tanlash mezoni**
> bilan javob beradi. ❌ oldingi A «Sahifaning hamma bo'limi ochib chiqiladi» — mezon emas, boshqa
> harakat haqidagi gap edi; o'quvchi savol bilan variantni bog'lay olmasdi.
> 🔴 A va C **darsda hech qayerda rost emas** (17-qonun): s9 da hamma joy emas, bitta joy bosiladi
> va tanlov chiroylilikka qarab qilinmaydi — faqat B himoyalanadi.
> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask`.

---

## 5. USTAXONA SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira, har birining ostida nomi —
**«Ilgari qanday edi» · «Mana, ishlaydi» · «Endi nima oson»**.

> 🔴 **Kadr-nomlari butun darsda AYNAN shu uchtasi** (korpus §80 · §31: nom o'zi nima
> yozilishini aytadi). ❌ oldingi variant «Nega ochaman» — «ochaman» nimani ochishini
> aytmaydi va flashcard javobi («ilgari bu ish qanday og'ir qilinardi») bilan mos emas edi:
> bitta kadr uch xil nom bilan atalardi. Kaskad: indikator · maydon-ipuchalari · s12 mentor ·
> s15 yakun-qatori · flashcard 5–7 — hammasi shu uch nom bilan.
Yozilgani yashil ✓, joriysi indigo-pulsda, kelgusi kulrang-punktir.

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida **ikki maydon**:
`gap` (bitta jumla) va `harakat` (3–5 so'z), ostida jonli hint.

**Maydon-ipuchalari (92c/85 — qisqa savol, tayyor javob maydonda TURMAYDI, namuna-chip YO'Q):**

| Kadr | `gap` ipuchasi | `harakat` ipuchasi |
|---|---|---|
| 1 · Ilgari qanday edi | «Ilgari bu ish qanday qilinardi?» | «Nimani ochasiz?» |
| 2 · Mana, ishlaydi | «Hozir nima qilyapsiz?» | «Nimani bosasiz?» |
| 3 · Endi nima oson | «Endi nima oson bo'ldi?» | «Natija qayerda ko'rinadi?» |

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI (chalg'itmasin) — faqat indikator chirog'i yonadi;
uchtasi ham yozilgach kadr-tasmasi to'liq enda ochiladi (✎ tahrir shu yerda).

**106d javob (ikki tomonlama, saqlash paytida — alohida checklist-panel YO'Q):**
- ✅ «Bu gap ekranda ko'rinmaydi — siz qo'shdingiz.»
- 🤔 «Bu gap ekranda ko'rinib turibdi. Ilgari bu ish qanday qilinardi — shuni yozing.»
- 🤔 (qisqa qolsa) «Qisqa qoldi: to'liq gap bilan yozing.»
- 🤔 (harakat maydoni gapga aylansa) «Harakat qisqa bo'ladi: nimani bosasiz?»
- Holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

**Ekranni takrorlaydigan so'zlar ro'yxati** (dars o'z lug'atidan — 106d(c)):
*bosh sahifa · menyu · tugma · ro'yxat · rang · sahifa · «bu yerda … bor»*.
O'quvchi shulardan biriga tayanib gap yozsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K12 · 91b/33/42/43/56)

**Freym (91b):** eyebrow — **«🏠 Haqiqiy voqea»**, K-kodi ekranga chiqmaydi (lug'at: «Case study» → «Haqiqiy misol»).

🔴 **UCHINCHI BURCHAK (majburiy — 23/26-qonun ruhi).** K12 ikki darsda ishlatilgan va ularning
matnlari BAND: «birinchi slaydda odamlarning muammosi / mehmonxonalar qimmat» (M1-D12 + M2-D13) ·
«o'nga yaqin sodda slayd» (ikkalasida) · «har slaydda bitta sodda fikr» (M2-D13) ·
bashorat «Birinchi slaydda nima turgan?» va «Har slaydda qancha gap bo'lgan?» (M2-D13).
Bu dars **boshqa burchakni** oladi: **varaqlarning TARTIBI tasodifiy emas** va **taqdimot nima
bilan tugaydi**.

> 🔴 **Keys-sadoqati tuzatildi (10-qonun, senariy-korrektura 2026-08-13):** ❌ «Airbnb'da
> ko'rsatadigan tayyor dastur yo'q edi» — bu gap **keys-bankda YO'Q** (bank: birinchi taqdimot ·
> o'nga yaqin oddiy varaq · tartib · ochiq turibdi · raqamsiz). Ustiga u 2-slaydga ZID edi:
> tartibda «mahsulotning o'zi» varag'i bor, ya'ni ko'rsatadigan mahsulot bor edi — o'quvchi
> qarama-qarshilikni sezadi. Slayd-1, ko'prik-gap va arena-10 shu sababli qayta yozildi.

**4 slayd (hikoya tilida — 42-qonun · ovoz chiqarib o'qib tekshirildi):**

1. **Airbnb boshlanganda** o'z ishini o'ntacha oddiy varaq bilan tushuntirgan. O'sha varaqlar hozir ham internetda ochiq turibdi.
2. **Varaqlar tasodifan terilmagan.** Tartibi aniq edi: avval odamlarning qiyinchiligi, keyin uni yengadigan yechim. Undan keyin buni qancha odam kutayotgani, so'ng mahsulotning o'zi.
3. *(bashorat)* **Sizningcha, oxirgi varaqda nima turgan?**
4. **Oxirgi varaqda jamoa turgan** — ishni kim qilayotgani. Shu taqdimotni bugun ham dunyo bo'ylab o'rganishadi.

**Bashorat (3-slayddan oldin — 43-qonun · bitta o'lchov: oxirgi varaqda nima turadi):**
- «Mahsulot ekranlari» *(18)*
- «Narx va to'lov» *(14)*
- «Ishni qilayotgan jamoa» ✅ *(22)*

**Natija-qatori (56/100-qonun):** topsa «🎯 Topdingiz! Oxirgi varaqda jamoa turgan» — quyruqsiz;
adashsa «Adashdingiz — asl javob: oxirgi varaqda jamoa turgan». 🔴 «Bu ball emas» izohi YO'Q ·
hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».
🔴 **TMI ov-ro'yxati #6:** keys-slaydlarida bashorat **AYNAN BITTA**.

**Ko'prik-gap (91b · 44-qonun — to'liq nom bilan):**
> Airbnb o'z ishini varaqlar bilan tushuntirdi — va varaqlar aniq tartibda turdi. Sizda esa **ishlaydigan sayt bor**: uni ham shunday tartib bilan ko'rsatasiz — avval ilgari qanday og'ir bo'lganini aytasiz, keyin bosib ko'rsatasiz.

> 🔴 **10-qonun (keys-sadoqati):** bankda faqat shu bor — birinchi taqdimot, o'nga yaqin oddiy slayd,
> tartib «muammo → yechim → bozor → mahsulot → jamoa», taqdimot ochiq turibdi, **raqam yo'q**.
> Shuning uchun: ❌ «millionlab dollar yig'ishdi» (bankda YO'Q) → aytilmaydi;
> ❌ «ko'rsatadigan dastur yo'q edi» (bankda YO'Q, ustiga 2-slaydga zid) → aytilmaydi;
> ❌ «investorlar» / «tinglayotgan odamlar» — tinglovchi umuman **nomlanmaydi** (109 TMI:
> keys uchun kerak emas, gap Airbnb'ning O'ZI nima qilgani haqida); ❌ «matras/konferensiya»
> (bu K4 keysi, biriktirilmagan) → KIRMAYDI.
> 🔴 **Bashorat halolligi (17/64-qonun):** uch variant bir o'lchovda (oxirgi varaq mazmuni) va
> bir-birini inkor qiladi; 4-slayd ikkitasini rost qilib qo'ymaydi.
> 🔴 **Ko'prik:** ❌ «Sizning **maydoncha** ishingizda» — o'quvchining ishi O'Z loyihasidan keladi,
> maydoncha emas (96c-b).

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · VS Code topshirig'i)

**Darvoza-mashq (82e — honor-checkbox YO'Q, darsning O'Z bilimi):**
«Qaysi qator natijani ekranda ko'rsatadi?»

```
a)  console.log('Band qilindi');
b)  {bandQilindi && <p className="ok">✓ Band qilindi</p>}
c)  // Band qilindi
```
✅ **b**. Izoh: «`console.log` yozganini faqat dasturchi ko'radi; izoh esa ekranda umuman chiqmaydi.»

**Boshlang'ich kod (VS Code-mockupda ko'rsatiladi, nusxalanmaydi — 82d):**

```jsx
function BandQilish() {
  const [bandQilindi, setBandQilindi] = useState(false);

  function bosildi() {
    // ← bu joyni siz to'ldirasiz
  }

  return (
    <div>
      <button onClick={bosildi}>Band qilaman</button>
      {/* ← natija qatori shu yerga qo'shiladi */}
    </div>
  );
}
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. Tugma bosilganda holat o'zgaradi
2. Tasdiq qatori ekranda chiqadi
3. Sahifada o'zingiz bosib ko'rdingiz

**Tasdiqlash tugmasi (korpus §93 — aynan bajarilgan ishni aytadi):**
«✅ **VS Code'da qo'shdim** — tugmani bosdim, tasdiq qatori chiqdi»

**YORDAM (yechimni aytmaydi — korpus §77):** Bitta qadamdan boshlang: tugma bosilganda holatni
rost qiling. Ekranda chiqarishni keyin qo'shing.

**YULDUZCHA:** Tasdiq qatoriga bosilgan narsaning nomini ham chiqaring.

> 🔴 **Namuna-komponent demo-olamdan** (`BandQilish`) — o'quvchi uni O'Z loyihasidagi asosiy
> tugmasiga qo'llaydi; matn buni ochiq aytadi: «namunadagi nomlar sizniki bilan boshqacha bo'ladi».
> 🔴 **48-korpus:** sarlavha natijani aytadi — ✅ «Natijani **ko'rinadigan qiladigan kod** yozamiz»
> (82a sarlavha-oilasi), ❌ «kod tayyorlaymiz», ❌ «Tugmani jonlantiramiz» (86-korpus: «jon» — JS emas, bezak so'zi).
> 🔴 **Pedagogik ulanish (87c):** kod — s8 dagi **ikkinchi kadrni** ishlaydigan qiladi.
> Tasdiq qatori bo'lmasa, qarab turgan odam bosilganini bilmaydi. Mentor buni ochiq aytadi.
> 🔴 **82(f):** sinf-pulsi bu ekranda o'quvchiga ko'rinmaydi (mentor `MentorPracticeStats` da ko'radi).

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch kadr CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun): avval gap, keyin harakat. 🔴 Demo-kadrlar boshqa ish uchun — s4 to'rtligiga ham, s8 javoblariga ham KIRMAYDI (spoyler-taqiq) |
| **s12 REFLEKSIYA** | Sarlavha: «Uch kadringizni yoddan ayta olasizmi?» · juftlik-mashq + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». 🔴 Taymer/sekundomer YO'Q (M1-D12/M1-D14 dan farq) |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal gap): «Ishlaydigan sayt o'zini o'zi tushuntirmaydi.» · «Ekranda ko'rinib turgan narsani takrorlagan gap hech narsa qo'shmaydi.» · «Ko'rsatuvda bitta harakat va uning natijasi ko'rsatiladi.» · «Ko'rsatuv uch kadrdan iborat: ilgari qanday edi, mana ishlaydi, endi nima oson.» |
| **Barcha ekranlar** | 🔴 47-qonun: `?</h2>` s4 · s8 · s9 · s10 da **0**; s0 · s2 · s6 · s12 da savol-sarlavha RUXSAT |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | Ishlaydigan sayt o'zi nimani aytmaydi? | s2 |
| 2 | Ekranda ko'rinib turgan narsani takrorlagan gap nima qo'shadi? | s4 |
| 3 | «Bu — bosh sahifa» degan gap ko'rsatuvga nima beradi? | s4 |
| 4 | Ko'rsatuv nechta kadrdan iborat? | s1 + s8 |
| 5 | Birinchi kadrda nima aytiladi? | s8 |
| 6 | Ikkinchi kadrda nima ko'rsatiladi? | s8 + s9 |
| 7 | Uchinchi kadrda nima aytiladi? | s8 |
| 8 | Ko'rsatuvda nechta harakat bosiladi? | s9 |
| 9 | Ko'rsatuvda qanday joy bosiladi? | s9 + s11 |
| 10 | Airbnb o'z ishini nima bilan tushuntirgan? | s6 |
| 11 | Airbnb taqdimoti nima bilan tugagan? | s6 |
| 12 | Qarab turgan odam natijani ko'rishi uchun kodda nima qo'shiladi? | s10 |

> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q — «pitch», «demo»,
> «feature», «storytelling» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «ko'rsatuv»,
> «kadr», «harakat», «tasdiq qatori» so'zlari bilan yoziladi.

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Silent Watch!** | Gapsiz ko'rsatuvni ochib chiqdingiz | 35 | s4: 4/4 kadr ochildi |
| **Three Frames!** | Uch kadrlik ko'rsatuv yozdingiz | 31 | s8: 3/3 saqlandi |
| **Spot On!** | Ko'rsatiladigan harakatni topdingiz | 35 | s9: 2/2 to'g'ri |
| **Live Proof!** | Natijani ekranda ko'rinadigan qildingiz | 39 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi ≤48 belgi ✓ ·
> 101(c): tavsif nishon NOMI aytgan narsani takrorlamaydi.
> 🔴 **Nom-tuzog'i (korrektura 2026-08-13):** ❌ «Right Click!» — dasturchi olamida bu
> **sichqonchaning o'ng tugmasi**; kod o'rganayotgan bola nishonni o'sha ma'noda o'qiydi va
> nima uchun berilganini tushunmaydi. → ✅ «Spot On!» (aynan «topdingiz» ma'nosi, hotspot bilan mos).

---

## 11. FLASHCARD (10 ta — 76-korpus: tarjimasiz chet so'z yo'q)

| # | Savol | Javob |
|---|---|---|
| 1 | Ishlaydigan sayt o'zi nimani aytmaydi? | Nima uchun kerakligini |
| 2 | Ekranda ko'rinib turgan narsani takrorlagan gap qanday gap? | Bo'sh gap — hech narsa qo'shmaydi |
| 3 | Ishlaydigan mahsulotni odam oldida ochib tushuntirish qanday ataladi? | Ko'rsatuv (inglizchasi — pitch) |
| 4 | Ko'rsatuv nechta kadrdan iborat? | Uch kadr |
| 5 | Birinchi kadrda nima aytiladi? | Ilgari bu ish qanday og'ir qilinardi |
| 6 | Ikkinchi kadrda nima bo'ladi? | Bitta harakat qilinadi va natija ko'rinadi |
| 7 | Uchinchi kadrda nima aytiladi? | Endi nima oson bo'lgani |
| 8 | Ko'rsatuvda nechta joy bosiladi? | Bittasi — ish chindan bajariladigani |
| 9 | Airbnb taqdimoti nima bilan tugagan? | Jamoa bilan — ishni kim qilayotgani |
| 10 | Qarab turgan odam natijani ko'rishi uchun kodda nima kerak? | Ekranda chiqadigan tasdiq qatori |

> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ ·
> darsning har kalit qoidasi kartada bor ✓ (ekran ↔ gap · bo'sh gap · atama · uch kadr ·
> har kadrning ishi · bitta harakat · keys · kod).
> 🔴 **Korpus §24:** kartada referentsiz «bu» YO'Q — predmet nomlanadi.

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Ekran nimani aytmaydi»** — (1) ekran nima borligini ko'rsatadi · (2) nima uchunligini gap aytadi · (3) sinfga savol
**s5 · «Bo'sh gap»** — (1) ekranni takrorlagan gap hech narsa qo'shmaydi · (2) gap ekran ayta olmaydigan narsani aytadi · (3) savol
**s7 · «Tartib tasodifiy emas»** — (1) Airbnb varaqlarining tartibi · (2) oxirgi varaqda jamoa · (3) savol
**s11 · «Bitta harakat»** — (1) hamma sahifa ochib chiqilmaydi · (2) ish chindan bajariladigan joy bosiladi · (3) savol

> 🔴 **43-qonun:** karta sarlavhasida teng, teng-emas va strelka kabi matematik belgilar YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** ❌ «K12 xulosasi» → keys nomi bilan.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K12** — M3 modulida ishlatilmagan ✓ (modul-ichi qoidasi, registr 4-bo'lim)
6. TEKSHIRUV mexanikasi oldingi darsni (Timeline) takrorlamaydi — **Hotspot** ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): maydoncha — s0 dan s15 gacha; keys 91b freymi bilan kiradi va ko'prik bilan qaytadi ✓
- 95 (Toshkent o'smiri): maktab yonidagi maydoncha ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas ✓
- 23 (imzo-vizual yangi): «GAPSIZ KO'RSATUV» — band ro'yxatning hech biri emas ✓
- 26 (koding mexanikasi almashadi): kompilyator → VS Code topshirig'i ✓ *(GATE S tasdig'i kerak)*
- 87 (o'tilgan material): `useState` · shartli render · o'z loyihasi ✓
- 47: `?</h2>` interaktiv ekranlarda 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda ≤1) · keysda bashorat 1 ta ✓
- **M1-D14 farqi (majburiy):** mikrofon YO'Q · 3 daqiqa sanog'i YO'Q · muammo-qidiruv YO'Q ✓
- **M2-D13 farqi:** tushunish chizig'i YO'Q · so'z-elagi YO'Q · tinglovchi kursisi YO'Q ✓
- **K12 uchinchi burchak:** band slayd-matnlari va ikkala band bashorat savoli ishlatilmadi ✓

**Matn-darvozalari (MATN_KORPUS):**
1. §42 (keys hikoya tilida): slaydlar ovoz chiqarib o'qildi — «tushuntirgan», «ochiq turibdi» ✓
2. §52 (yakuniy xulosa qisqa va tugal gap): 4 qatorning har biri mustaqil fikr ✓
3. §80 (bir tushuncha — bir nom): ko'rsatuv · kadr · gap · harakat · natija · **qarab turgan odam** ·
   **kadr-nomlari (ilgari qanday edi · mana, ishlaydi · endi nima oson)** — har biri BITTA nomda ✓
4. §94 (holat-matni halol): «gap yoziladi» (chindan yoziladi), ❌ «eshiting» (ovoz yo'q) ✓
5. §95 (raqam manbasi): ekranda manbasiz raqam YO'Q ✓
6. §96 (variantli uy-vazifa): tepadagi matn sonni aytmaydi ✓
7. §97 (yakka rejim): «ko'pchilik/sinf/ovozlar» o'quvchi matnida 0 ✓
8. §98 (ipucha qoida beradi): s9 qoida-qatori beshta joyning nomini aytmaydi ✓
9. **Sanoq-mosligi (22-qonun):** 4 kadr (s4/arena-2,3) · 3 kadr (s1/s8/uy-vazifa/flashcard-4) ·
   5 joy (s9) · 2 bosqich (s9) · 12 arena savoli · 10 flashcard · 4 nishon ·
   «Endi siz bilasiz» 4 qator — hammasi matn bilan mos ✓
10. **Test halolligi (17-qonun, har savol qayta o'qildi):** TEST-1 A/C — ekran KO'RSATADIGAN
   narsalar, «aytmaydi» savoliga javob bo'lolmaydi ✓ · TEST-2 A/B — ikkalasi ham ekranda YO'Q
   narsani qo'shadi ✓ · TEST-3 B (narx) bankda yo'q, C (mahsulot) oxirgi emas ✓ · TEST-4 A/C
   darsda hech qayerda rost emas ✓. **Bashorat** (s6) uch variant bir o'lchovda, 4-slayd
   ikkitasini rost qilib qo'ymaydi ✓. **Hook** — to'g'ri javob yo'q, ikkala izoh bir xil ✓.
11. **Keys-sadoqati qayta o'lchandi:** slaydlarda faqat bankdagi to'rt fakt bor (o'ntacha oddiy
   varaq · tartib · oxirida jamoa · ochiq turibdi va o'rganiladi) · raqam, sana, pul, tinglovchi
   nomi YO'Q ✓

---

## 14. ⚠️ [GATE S] — FOYDALANUVCHI QARORLARI (OCHIQ, 2026-08-13)

> 🔴 Quruvchi ishni BOSHLAMAYDI — quyidagi 9 savol yopilishi shart.

| # | Savol | Taklif |
|---|---|---|
| 1 | 🔴 **Dars sarlavhasi.** `App.jsx` `m3-14`: title «Storytelling: frontend pitchi» · sub «mahsulotni jonli ko'rsatish». «Storytelling» va «pitch» — izohsiz inglizcha (korpus §20 buzilishi) | title → **«Ishlayotgan saytingizni qanday ko'rsatasiz?»** · sub → **«uch kadrlik ko'rsatuv»**. Tasdiqlaysizmi? |
| 2 | 🟡 **Misol-olam.** Taklif — 🏀 **maydoncha** (maktab yonidagi futbol maydonchasini band qilish sayti): 95-qonundan o'tadi, band emas, «bosaman → natija ko'rinadi» aniq ko'rinadi. Muqobil: 🎒 **maktab to'garaklari** (ro'yxat + «Yozilaman») — lekin M3-D10 allaqachon **maktab bufeti** olamida edi, ikki dars ketma-ket «maktab» bo'lib qoladi | **Maydoncha**. Qaysi biri? |
| 3 | 🔴 **K12 uchinchi marta.** Registr modul-ichi qoidasi bo'yicha M3 da K12 birinchi marta — ruxsat. Lekin global u M1-D14 (senariy M1-D12) va M2-D13 da ishlatilgan, va **eng ko'p eslanadigan detallari band**. Shuning uchun bu dars uchinchi burchakni oldi: «varaqlarning tartibi tasodifiy emas» + «taqdimot jamoa bilan tugagan». ⚠️ Korrekturada tuzatildi: «ko'rsatadigan mahsulot yo'q edi» gapi keys-bankda yo'q edi va slayd-2 ga zid edi — olib tashlandi | K12 **qoladi** shu burchak bilan. Yoki zaxira ilgakka (o'smir hayotidan sahna) o'tamizmi? |
| 4 | 🟢 **Atama tanlovi.** «pitch» ekranga chiqmaydi, dars bo'ylab **«ko'rsatuv»**; inglizcha juftlik faqat flashcard javobida. «demo» ham ishlatilmaydi (M1-D14 da «jonli demo» band) | «Ko'rsatuv». Rozimisiz? |
| 5 | 🔴 **Koding.** 26-qonun navbat almashishni talab qiladi: M3-D5 VS Code → M3-D10 kompilyator → **M3-D14 VS Code topshirig'i**. Bu ayni paytda qulay: LMS kompilyator masalasi hali hal qilinmagan (M3-D10 GATE S 3-bandi), VS Code topshirig'i esa undan mustaqil. Topshiriq — o'quvchining O'Z loyihasidagi tugmaga tasdiq qatori qo'shish (`useState` + shartli render) | **VS Code topshirig'i**. Tasdiqlaysizmi? |
| 6 | 🟡 **s8 kartasida M3-D10 shartlari.** Kirish-artefaktda `shartlar[3]` bor. Taklif: **ko'rsatilmaydi**, faqat `ish` nomi — shartlar bu darsda hech qanday ish so'ramaydi va ekranga to'rtinchi blok qo'shadi (86b + 106 budjeti; M3-D10 ning O'Z 7-qarori bilan bir mantiq) | Ko'rsatilmasin. Tasdiqlaysizmi? |
| 7 | 🔴 **Chiqish-artefakt kimga boradi.** `pm-m3d14-pitch` = `{ ish, kadrlar:[{gap,harakat}×3], savedAt }`. M3 shu yerda yopiladi. Registr 6-bo'limida keyingi halqa chizilmagan; tabiiy nomzod — **m4-15 «Fullstack arxitektura pitchi»** (u ham K12 ♻️) | Zanjir m4-15 ga ulansinmi, yoki M3 da yopiq qolsinmi? |
| 8 | 🟡 **s9 TEKSHIRUV — Hotspot.** Ordering (M3-D10), karta ko'chirish (M3-D5), MatchPairs, tekshiruvchi stoli, klinika — hammasi band. Hotspot PM darslarida hali ishlatilmagan va PM_Prompt_v8 ruxsat etgan turlar ichida. Ikki bosqichli: harakat → natija | Hotspot. Tasdiqlaysizmi? |
| 9 | 🟡 **«ish» so'zi (metodist qo'shdi).** ETALON 43 ko'p ma'noli «ish» so'zini o'z darsidan tashqarida aniq so'z bilan almashtirishni talab qiladi. Bu yerda «ish» — **M3-D10 dan keladigan artefaktning O'Z maydoni** (`{ ish: "…" }`) va o'quvchi uni o'tgan darsda shu nom bilan yozgan, ya'ni modullararo izchillik uni ushlab turibdi. Matnda u doim aniqlovchi bilan keladi: «**o'z ishingiz**», «**bu ish** chindan bajarilishi» | «ish» **qoladi** (artefakt izchilligi kuchliroq). Muqobil: hamma joyda «saytingiz bajaradigan ish» — lekin bu 6 ekranda uzun qurilma beradi. Qaysi biri? |

**Quruvchiga qo'shimcha (metodist ogohlantirishi):** s4 — darsning o'zagi. U kashfiyot-mashqi:
bola to'rt kadrni ochib, ikkitasi bo'sh ekanini O'ZI ko'rishi kerak (98b). Kadr-gaplari **jonli
og'zaki** bo'lishi shart — «Qarang, hozir band qildim» kabi. Agar gaplar hisobot tilida yozilsa
(«Foydalanuvchi band qilish amalini bajardi»), mexanika butunlay ishlamaydi va ekran o'qish-matniga
aylanadi. Har gap topshirilishidan oldin **ovoz chiqarib o'qib** tekshiriladi (korpus §42, 0-tamoyil 5).

---

## 15. SENARIY-KORREKTURA JURNALI (`pm-metodist` · 2026-08-13)

> Matn va pedagogika bo'yicha tuzatildi; tuzilma, mexanika va ball-logikasi TEGILMADI.

| # | Nima topildi | Nima qilindi |
|---|---|---|
| 1 | 🔴 **Keys-sadoqati:** «Airbnb'da ko'rsatadigan tayyor dastur yo'q edi» keys-bankda YO'Q va slayd-2 ga zid (tartibda «mahsulotning o'zi» varag'i bor) | Slayd-1, ko'prik-gap, arena-10 bankdagi faktlarga qayta yozildi; K12 burchagi «tartib tasodifiy emas» bo'lib qoldi |
| 2 | 🔴 **TEST-4 A varianti** savolga mezon bilan javob bermasdi («hamma bo'limi ochib chiqiladi») | A → «Sahifada birinchi ko'ringan joy tanlanadi»; uzunlik-tell 1.05; `correct` indeks TEGILMADI |
| 3 | 🔴 **Bir tushuncha — uch nom:** kadr-1 «Nega ochaman» / ipucha «Ilgari bu qanday qilinardi» / flashcard «Ilgari bu ish qanday og'ir qilinardi» | Kadr-nomlari yagona to'plamga tortildi: «Ilgari qanday edi · Mana, ishlaydi · Endi nima oson» (indikator · ipucha · s12 · s15 · flashcard kaskadi) |
| 4 | 🔴 **Tinglovchi uch xil atalgan** (yoningizdagi odam · tinglayotgan odamlar · tomoshabin); «tomoshabin» + «kadr» + «ko'rsatuv» birgalikda televizor-ma'nosini kuchaytiradi | Ekran matnida yagona «qarab turgan odam»; keys-slaydda tinglovchi umuman nomlanmaydi |
| 5 | 🔴 **Nishon «Right Click!»** — kod o'rganayotgan bola uni sichqoncha tugmasi deb o'qiydi | → «Spot On!» |
| 6 | 🟡 **s9 «Butun sayt aylanmaydi»** — g'aliz fe'l (43-qonun: aniq harakat) | «Hamma sahifani ochib chiqmaysiz — bitta joyni bosasiz…» |
| 7 | 🟡 **«ishning ishlashini»** takror-o'zak (5 joyda), ovoz chiqarib o'qilmaydi | Hamma joyda «ish chindan bajariladi» (hotspot qatorlari · TEST-4 · flashcard-8 · RECAP-s11 · arena-9) |
| 8 | 🟡 **s4 mentori sarlavhadagi buyruqni takrorlardi** (109 TMI · korpus §67b) | Mentor 1 gap — faqat sahna; sarlavha «egasining» → «sinfdoshingiz» (referent oldinda) |
| 9 | 🟡 **s4 hukm-qatori «gap qo'shdi»** — nimani qo'shgani aytilmagan | «Buni ekran ko'rsatmaydi — gap yangi narsa qo'shdi» / «Buni ekranning o'zi ko'rsatib turibdi…» |
| 10 | 🟡 **s1 da atama birinchi jumlada** (39-qonun) | Avval nima bo'lishi, keyin nom: «…Shu uch kadr birga ko'rsatuv deyiladi» |
| 11 | 🟡 **Zaxira-tarmoq shakli boshqacha edi** (biri ISHni, ikkinchisi TUGMAni nomlardi — korpus §69) | Ikkala tarmoq ham ishni nomlaydi, ikkinchi yarmi so'zma-so'z bir xil |
| 12 | 🟡 **Hook payoff s2 qoidasini oldindan aytardi** | Payoff endi hodisani aytadi («o'sha odam baribir bilmaydi»), qoida s2 da ochiladi |
| 13 | 🟡 **s12 mentori uch slotli uzun savol** edi | Uch parallel so'z bilan qisqartirildi: «nima deysiz, nimani bosasiz, nima osonlashadi» |
| 14 | 🟡 **Ichki blok-nomlari** ekranga oqib ketishi mumkin edi | Atama-glosslarga alohida taqiq-bandi + Quruvchi uchun grep-shart qo'shildi |

**OQLANDI — `lint:til`: 🔴 error 0 · 🟡 warn 10, hammasi senariy-meta matnida; o'quvchi
ekraniga chiqadigan birorta matn emas.** Qatorlar (korrekturadan keyingi raqamlar):
30 — lug'at qoidasining iqtibosi · 92 va 187 — PM_Prompt_v8 blok-nomi · **37 — korrekturada
QO'SHILGAN taqiq-bandining o'zi** (blok-nomlari ekranga oqmasin) · 181 — 42-qonunning ❌ misoli ·
243 va 244 — diqqat-animatsiyasi (mahsulot holati emas) · 646 — mentor paneli · 748 —
o'z-tekshiruv bandining o'z nomi · 803 — artefakt ketma-ketligi (o'yin-hisobi emas).

**GATE S ga QOLDIRILDI:** 9-savol («ish» so'zi) · 3-savol (K12 uchinchi marta — burchak
tuzatilgandan keyin ham qaror foydalanuvchiniki) · 4-savol («ko'rsatuv» atamasi va flashcarddagi
yagona inglizcha juftlik «Ko'rsatuv (inglizchasi — pitch)»).

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–112) · MATN_KORPUS (0–98) ·
MATN_ETALONI (lug'at) · PM_KEYS_MEXANIKA_REGISTRI bo'yicha yozildi.
Keyingi qadam: **[GATE S]** (senariy-korrektura 2026-08-13 da bajarildi).*

---

## ✅ [GATE S] YOPILDI — 2026-08-13, foydalanuvchi («tavsiyang bo'yicha»)

1. **Sarlavha almashadi** → «Ishlayotgan saytingizni qanday ko'rsatasiz?» (App.jsx m3-14 kartasi yangilandi: «Storytelling» ketdi).
2. **Misol-olam:** 🏀 maydoncha QOLADI (muqobil to'garaklar rad).
3. **K12 uchinchi marta** — TASDIQLANDI (uchinchi burchak: «tartib ishladi» + «jamoa bilan tugagan»).
4. **Atama «ko'rsatuv»** — TASDIQLANDI (pitch ekranga chiqmaydi, flashcardda juftlik).
5. **Koding = VS Code topshirig'i** — TASDIQLANDI (navbat: M3-D10 kompilyator → M3-D14 VS Code).
6. **s8 kartada M3-D10 shartlari ko'rsatilmaydi** — TASDIQLANDI (yozuvchi taklifi).
7. **`pm-m3d14-pitch` M3 da yopiq qoladi** — m4-15 ulanishi o'sha darsning senariysida hal qilinadi.
8. **Hotspot TEKSHIRUV** — TASDIQLANDI (registrga muhrlangan, m4-02 dan olib tashlangan).
9. **«ish» so'zi qoladi** — M3-D10 artefaktining o'z maydoni (metodist taklifi).
