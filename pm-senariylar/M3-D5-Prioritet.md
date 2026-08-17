# M3-D5 — Qaysi ishni birinchi qilasiz? (SENARIY, PM_Prompt_v8 · ARALASH TUR)

> Holat: YOZILDI (senariy-bosqichi, 2026-08-11) → **pm-metodist SENARIY-KORREKTURASI o'tdi (2026-08-11)** → **[GATE S]** kutmoqda.
> Korrektura kaskadlari: «chorak» → **katak** · «mehnat» → **vaqt** · «muddat» (davomiylik) → **vaqt** ·
> «imkoniyat» → **ish** · «auditoriya» → **odam ko'p/kam** · 4 katak nomi qayta yozildi (sen-forma va
> metafora yo'q) · TEST-1 va TEST-3 tuzoqlari qayta tuzildi. Yangi qaror-bandlari: 14-bo'lim 5–7.
> Fayl: `src/3-Modull/PmLesson8.jsx` (hozirgi `pm-priority-08-v16` — eski avlod dars BUTUNLAY
> almashadi; yangi `lessonId: pm-m3d5-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 3 — «Frontend — React» (oy 3–4.5) |
| **Modul PM-konsepsiyasi** | «Komponent = imkoniyat. Foydalanuvchi hikoyasi koddan OLDIN yoziladi.» |
| **Dars** | M3-D5 (modulning 5-darsi) · `key: m3-05` |
| **Mavzu** | Bir nechta ishdan qaysi biri birinchi qilinadi — **foyda** va **vaqt** bo'yicha qaror |
| **TUR** | 🔀 **ARALASH** (1-B bo'lim): **nazariya-bloki 2-TURdan** (keys-slayd K14, odam va voqea orqali) · **amaliyot-bloki 1-TURdan** (joylashtirish-doska, o'quvchi **quradi**, uzun matn yozmaydi). Sabab: mavzu qaror-qabul qilish haqida — u yozuv emas, **joylashtirish** bilan o'rgatiladi. 🔴 USTAXONA (48/80-qonun) shu sababli **majburiy emas**; o'quvchi yozadigan yagona matn — bitta qaror-qatori (s8) |
| **Bosh keys** | **K14 · INSTAGRAM STORIES** (temalar: *приоритизация · компонент=фича · конкуренция · время запуска*) |
| **ISHLATILGAN_KEYS (band)** | K1 · K3 · K5 · K8 · K11 (M3-D2) · K12 · K18 · K19 → **K14 modulda ham, dasturda ham birinchi marta** ✓ (10-qonun: 3-Modulda faqat K11 band) |
| **Oldingi PM dars (M3-D2) TEKSHIRUV mexanikasi** | Hotspot / xato-topish — **takrorlanmaydi** (`PM_PIPELINE_STATE.md` yozuvi) |
| **Band mexanikalar (TAQIQ)** | **M3-D2 (P0)**: 3 hikoya ustaxonasi (bittalab-yozish) · tekshiruvchi stoli (tayyorga hukm) · klinika (bo'laklardan yig'ish + tuzoq-chip) · **prioritet-doska (BIR o'lchovli, 🔥/⚡/🌱 uch daraja)** · `hikoyaYasa` to'liq-ekran kompilyatori · PairTimer · **M2-D7**: bo'laklash-doska (MVP ro'yxati) · **M7-D2/M8-D1**: MatchPairs · **M1-D2**: bosqichli karta-yig'ish |
| **Misol-ip (91 + 95 + 96c-qonun)** | 🎮 **Maktab yonidagi o'yin-klub (kompyuter klubi) sayti** — klub egasi sayt buyurtma qildi, bir hafta vaqt bor. Butun dars shu bitta sayt ustida yuradi. 95-qonun testi: Toshkent o'smiri o'yin-klubga **o'zi boradi** ✓ · 96c(e) to'qnashuv-tekshiruvi: lavash (M1-D2) · OLX (M1-D5) · kinoteatr (M2-D2/D7) · Uzum · YouTube (M3-D2) · Airbnb · Starbucks · Duolingo — **o'yin-klub band emas** ✓ |
| **Kirish-artefakt** | `pm-m3d2-stories` (M3-D2 da o'quvchi yozgan **3 foydalanuvchi hikoyasi**) — s8 da o'z doskasiga tushadi. 🔴 Ikki tomonlama shart-tekshiruvi (F-0803-22-B saboqi): M3-D2 kartani `{kim, nima, natija}` shaklida yozadi va **aynan 3 ta**; o'quvchi dars ham **shu shakl va shu sonni** kutadi |
| **Chiqish-artefakt** | 🔴 `pm-m3d5-board` = `{ items: [{id, nom, foyda, vaqt, katak}], birinchi: id, sabab: "…", savedAt }` — M3-D10 (Acceptance Criteria) shu «birinchi» ish ustida ishlaydi |
| **Yordamchi kalitlar** | `pm-m3d5-hook-choice` (faqat YOZILADI — 100c-qonun: o'qilmaydi, ekranga chiqmaydi) · `pm-m3d5-code` (koding holati) · `pm-m3d5-reflection` · `pm-m3d5-hw-target` · `ccProgress` (F-0730-01) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 daqiqa bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15); scored: 3 ichki test + 1 yakuniy test + CodeStrike arena (yakun-ekran ichida) |

**Atama-glosslar (62/39-qonun — avval hodisa, keyin nom):**
- 🔴 **Ekran-so'zi — «ish»** (bir tushuncha — bir nom, korpus §80): doskadagi kartalar dars boshidan oxirigacha **ish** deb ataladi — «Oltita ishni doskaga joylashtiring», «bu ish uch hafta oladi», «qaysi ishni birinchi qilasiz?». «Imkoniyat (feature)» atamasi ekran matnida **ishlatilmaydi** (14-bo'lim 5-bandi — dars sarlavhasi GATE S da hal qilinadi);
- «foyda va vaqt doskasi» → avval: «har ishga ikki savol beramiz va javoblariga qarab joylashtiramiz», keyin **bir marta**: «yuqori o'q — foyda, yon o'q — vaqt: shuning uchun bu doskani **foyda va vaqt doskasi** deymiz»;
- 🔴 **«mehnat» so'zi ekranga chiqmaydi** (korpus §80 + MATN_ETALONI lug'ati): darsning ikkinchi o'qi ekranda **vaqt** bilan o'lchanadi («1 kun · 3 hafta»), shuning uchun uning nomi ham **vaqt**. Ikkinchi nom qo'shilsa — o'quvchi ikkita boshqa narsa deb o'ylaydi;
- 🔴 **«Impact vs Effort» ekranga CHIQMAYDI** (korpus §20: markaziy atama bo'lsa qavs-gloss yetmaydi — o'zbekcha ibora atamaning O'RNINI oladi). Inglizcha juftlik faqat flashcard javobida turadi.

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «IKKI O'Q VA HAFTA-CHIZIG'I»** (23-qonun: P0 story-silosi · JTBD shtamp-kartasi · Metrika streak-alangasi klonlanmaydi).

Ekran markazida ikki o'qli maydon. Vertikal o'q — **«Nechta odam so'raydi?»**, gorizontal o'q — **«Qancha vaqt oladi?»**. Karta tanlanib katakka bosilganda u joyiga **siljib o'tiradi** (snap), katak burchagi bir marta yonadi va o'chadi. To'rt katak:

```
  Nechta odam so'raydi? ↑
  ┌────────────────────┬────────────────────┐
  │ 🎯 DARROV QILINADI │ 🏔 REJAGA TUSHADI  │
  ├────────────────────┼────────────────────┤
  │ 🌱 VAQT BO'LSA     │ 🗑 KERAK EMAS      │
  └────────────────────┴────────────────────┘
                          Qancha vaqt oladi? →
```

🔴 Katak nomlari **qarorni aytadi, metafora emas** (korpus §70): har nom ishning taqdirini o'zi aytadi, alohida izoh-blok talab qilmaydi. «Kerak emas» — korpus §70 ning tasdiqlangan namunasi; «Darrov qil» kabi **sen-forma** buyruq nom sifatida ishlatilmaydi (korpus §64).
🔴 «Katak» — platforma atamasi (MATN_ETALONI lug'ati: `kvadrant → katak`). «Chorak» ishlatilmaydi: o'zbek maktabida «chorak» — o'quv choragi, o'quvchi darrov shuni eslaydi.

**Hafta-chizig'i (faqat s8 da, mustaqil ish ekranida):** tepada bitta gorizontal chiziq — «Bir hafta». Har kartada vaqt-belgisi (`1 kun` · `3 kun` · `3 hafta`). «🎯 Darrov qilinadi» katagiga karta tushganda chiziq to'ladi; hafta chegarasidan oshsa chiziq oxiri **qizil** bo'ladi va bitta qator chiqadi: «Bir haftaga sig'madi — bittasini ko'chiring.» Bu darsning asosiy cheklovini **matn bilan emas, vizual bilan** o'rgatadi (63-qonun).

**Nima uchun aynan shu:** M3-D2 doskasi bir o'lchovli edi (faqat «qaysi muhim»). Bu dars ikkinchi o'lchovni qo'shadi — va darsning o'zi shu o'sishni ochiq aytadi (s4 mentor-gapi). Ya'ni mexanika takror emas, **davom**.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> 🔴 **TUZATILDI (2026-08-11, qurishdan keyingi tekshiruv).** Dastlabki ro'yxat 18 ekran edi:
> uy-vazifa, CodeStrike arenasi va flashcard **alohida ekran** qilib qo'yilgan edi. Bu
> **F-0803-04 da allaqachon tuzatilgan xatoning takrori** — `src/2-Modull/PmLesson4.jsx`
> `SCREEN_META` izohi buni so'zma-so'z yozib qoldirgan: «uy-vazifa (s14) va arena (s16)
> alohida ekran edi va flashcard arenadan KEYIN qolgan — ikkovi ham summary ichiga qaytarildi».
> Yakun-tuzilmasi barcha etalonlarda (P0 UserStory · PmLesson2 · PmLesson4) BIR XIL:
> **koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada)**.
> 93-qonun: takrorlanadigan element etalondan grep bilan olinadi, qayta ixtiro qilinmaydi.

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Qaysi birini birinchi qilasiz?» | 1 | — | 4 karta · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — doska o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — har ishga **ikki savol** | 3 | — | kartani bosib ikki javobni ochish (yurish-pulsi) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO-DOSKA — 6 kartani joylashtirish | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K14 Instagram Stories (4 slayd + 2 bashorat) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | MUSTAQIL ISH — o'z 3 kartasi + hafta-chizig'i + qaror-qatori | 4 | — | doska + bitta yozuv-maydoni |
| s9 | TEKSHIRUV — «Dasturchi vaqtni qayta hisobladi»: 2 karta ko'chadi | 5 | — | 🔴 yangi mexanika |
| s10 | KODING — VS Code topshirig'i (React karta-komponenti) | 6 | — | 26/82/87-qonun |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e-qonun) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike arenasi **+** uy-vazifa kartasi bir sahifada | 8 + 9 | ✅ (arena) | 🔴 etalon yakun-tuzilmasi |

🔴 **Test-taqsimot (2-bo'lim qonuni):** s3 · s5 · s7 · s11 — hech biri ketma-ket emas, har biri o'z teoriyasidan keyin turadi.

🔴 **Yakun-ekrani (s15) tarkibi** — etalondan (P0 `Screen16` · PmLesson4 `s18`) grep bilan ko'chiriladi:
hero-sarlavha (`h-sub` YO'Q — 54f) → «Endi siz bilasiz» 4 qator → `CsWordmark` (arenani ochadi,
`QuizArena` overlay bo'lib chiqadi) → uy-vazifa kartasi (3 raqamli qadam + muddat) → nishonlar
(mentor rejimida YO'Q — 1-D). Arena **alohida `SCREEN_META` yozuvi EMAS** (`jsx-lint.mjs` 3a-qoidasi).

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 3 — Frontend: React
DARS: M3-D5 (5-dars)
DARS_MAVZUSI: Qaysi ishni birinchi qilasiz — foyda va vaqt bo'yicha qaror
ISHLATILGAN_KEYS: K14
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish sahnasi)
EKRAN: Maktab yonidagi o'yin-klub sizdan sayt so'radi. Bir hafta vaqt bor —
hammasiga ulgurmaysiz. Pastdagi to'rttadan qaysi birini birinchi qilasiz?
HARAKAT: O'quvchi 4 kartadan bittasini tanlaydi. Tanlagach har kartaning ostida
dasturchi aytgan vaqt ochiladi va sinf ovozlari ko'rinadi.
JAVOB: To'g'ri javob YO'Q — bu fikr-so'rovi. Payoff: eng ko'p ovoz olgan karta
(«Hozir nechta joy bo'sh») uch hafta oladi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linishi darsning o'zagi. «Ko'pchilik xohlagan narsa eng uzun
ish bo'lib chiqdi» — shu qarama-qarshilikni ovoz chiqarib nomlang.
```

**4 karta (86a-qonun: desktopda bitta qatorga sig'adi):**

| Karta | Dasturchi: qancha vaqt oladi (tanlovdan KEYIN ochiladi) |
|---|---|
| 🖥 Hozir nechta joy bo'sh | 3 hafta |
| 💵 Soatlik narxlar | 1 kun |
| 🎥 Zalni 3D'da aylanib ko'rish | 3 hafta |
| 🎖 O'yinchilar reytingi | 3 hafta |

> 🔴 **97-qonun tekshiruvi:** savol o'quvchi og'zidan tabiiy chiqadi — «bir hafta bor, qaysi birini birinchi qilaman?». Aniq narsa (o'yin-klub sayti) + harakat fe'li (qilasiz) + o'quvchi qaror qiladi ✓
> 🔴 **100-qonun:** tanlov `pm-m3d5-hook-choice` ga YOZILADI, lekin hech qayerda **o'qilmaydi** — «dars boshida siz … degandingiz» qaytarishi yo'q.
> 🔴 **Karta nomlari o'zini tushuntiradi:** ❌ «Zalning 3D aylanma turi» — «tur» o'zbekchada «xil/nav» degan ma'noni ham beradi, o'quvchi «3D turi» ni «3D xili» deb o'qiydi → ✅ «Zalni 3D'da aylanib ko'rish». ❌ «Har o'yinchi uchun daraja-reytingi» (og'ir qo'shma nom) → ✅ «O'yinchilar reytingi». To'rt karta nomi uzunlikda ham tenglashdi.
> 🔴 **62-qonun:** kartalar shunchaki **ishlar** — atama-so'z bu ekranda ham, keyin ham qo'yilmaydi (dars bo'ylab bitta nom: «ish»).

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida qaysi ishni birinchi qilishni tanlay olasiz — va nima uchun
aynan uni tanlaganingizni ayta olasiz.
HARAKAT: O'quvchi kuzatadi: bo'sh doska o'z-o'zidan to'lib chiqadi — kartalar
birin-ketin o'z katagiga siljib o'tiradi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Doska to'lib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

> 🔴 **40-qonun:** «tanlay olasiz» / «ayta olasiz» — o'quvchi BILIMga ega bo'ladi (rost). ❌ «doskangiz bo'ladi» — unda hali doska yo'q.
> 🔴 **22-qonun (sanoq-mosligi):** maqsad-gapidan «oltita» soni olib tashlandi — s1 demo-doskasida kartalar soni s4 dan farq qilishi mumkin, o'quvchi esa aytilgan sonni ekranda sanaydi.
> 🔴 **54(b/c)-qonun (P0 dan o'chirishlar meros):** `takeaway` ostida ikkinchi qator YO'Q · demo-doska ostida «sizniki ham shunday bo'ladi» captioni YO'Q.
> 🔴 **42-qonun:** fe'l jarayonga mos — kartalar «to'ladi» emas, **«o'z joyiga siljib o'tiradi»**.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation + Drag&Drop (joylashtirish-doska) + 3 × Quiz
EKRAN: Har ishga ikki savol beriladi: buni nechta odam so'raydi va u qancha
vaqt oladi. Ikki javob — ikki o'q. Kesishgan joy ishning navbatini aytadi.
HARAKAT: (s2) o'quvchi 3 kartani birma-bir bosib, ikki javobini ochadi;
(s4) oltita kartani doskaning to'rt katagiga joylashtiradi;
(s6) keys-slaydlarini bashorat bilan ochadi.
JAVOB: s4 — har karta o'z katagida (jadval quyida, 4-bo'limdan keyin).
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da o'quvchilar 3D kartasini uzoq muhokama qiladi — shu yerda
to'xtang: kam odam so'ragan uzun ish nima uchun umuman qilinmaydi?
```

**s2 — TEORIYA-1 «Ikki savol»** (induktiv: savol → misol → qoida)

Uch karta, har birida ikki yopiq javob (46-qonun: bosilsa ochiladi/yopiladi, bir martalik flip emas):

| Karta | «Nechta odam so'raydi?» | «Qancha vaqt oladi?» |
|---|---|---|
| 💵 Soatlik narxlar | Deyarli hamma | 1 kun |
| 🖥 Hozir nechta joy bo'sh | Deyarli hamma | 3 hafta |
| 🎥 Zalni 3D'da aylanib ko'rish | Kam odam | 3 hafta |

Uchalasi ochilgach chiqadigan **xulosa-karta** (69-qonun: maqtov emas, xulosa):

> **Bitta savol yetmas ekan.** «Soatlik narxlar»ni ham, «Hozir nechta joy bo'sh»ni ham deyarli hamma so'raydi — birinchi savol ularni ajratmadi. Biri bir kunlik ish, ikkinchisi uch haftalik: ajratadigani ikkinchi savol — qancha vaqt oladi.

> 🔴 Xulosa-kartada «kimga kerak?» degan **uchinchi shakl** yo'q: darsda birinchi savolning yagona so'zi — «nechta odam so'raydi» (bir tushuncha — bir nom).
> 🔴 **Ekran-budjeti:** s2 — darsning eng zich ekrani (3 karta × 3 qator + xulosa-karta ≈ 370 grapheme). Xulosa-karta 4 gapdan 2 gapga qisqartirildi; qurish bosqichida ekran matni Intl.Segmenter bilan o'lchanadi va **400 grapheme**dan oshmasligi tekshiriladi.

**s4 — YADRO-DOSKA** (markaziy mexanika)

Mentor (≤2 gap, 92a: ekranda bitta ish):
> O'tgan darsda hikoyalaringizni «qaysi biri muhim» deb tartiblagansiz. Bugun ikkinchi savol qo'shiladi — **qancha vaqt oladi**.

> 🔴 **109/32-qonun:** mentordan «ikki javob kesishgan joy…» quyrug'i olib tashlandi — u EKRAN matnida allaqachon bor, doskaning o'qlari esa buni ko'rsatib turibdi.
> 🔴 **98b/60-qonun:** mentor kartalarning qaysi katakka tushishini AYTMAYDI. Ipucha kerak bo'lsa — doskaning O'Z `hints` mexanikasi beradi (birinchi noto'g'ri joylashtirishdan keyin: «Buni nechta odam so'raydi? Yuqorimi, pastmi?»).
> 🔴 **75-qonun:** yo'riq ikki qadamli — «avval kartani tanlang, so'ng katakni bosing».
> 🔴 **72-qonun:** kartalar doska ostida yalang'och turmaydi — yorliqli idishda: «✋ Oltita ishni doskaga joylashtiring ↓», idish diqqat-pulsida, birinchi harakatdan keyin puls tinadi.
> 🔴 **88(a1)-qonun:** joylashtirilmagan kartalar bo'ylab **yurish** pulsi (to'lqin emas — hammasi joylashishi kerak).

**6 karta va to'g'ri katagi:**

| # | Karta | Nechta odam so'raydi | Qancha vaqt | Katak |
|---|---|---|---|---|
| 1 | 💵 Soatlik narxlar | Deyarli hamma | 1 kun | 🎯 DARROV QILINADI |
| 2 | 🕗 Ish vaqti va manzil | Deyarli hamma | 1 kun | 🎯 DARROV QILINADI |
| 3 | 🖥 Hozir nechta joy bo'sh | Deyarli hamma | 3 hafta | 🏔 REJAGA TUSHADI |
| 4 | 🏆 O'tgan turnir g'oliblari | Kam odam | 1 kun | 🌱 VAQT BO'LSA |
| 5 | 🎥 Zalni 3D'da aylanib ko'rish | Kam odam | 3 hafta | 🗑 KERAK EMAS |
| 6 | 🎖 O'yinchilar reytingi | Kam odam | 3 hafta | 🗑 KERAK EMAS |

Doska to'lgach chiqadigan **bitta qator** (106e: natija bitta qator):
> ✅ **Olti ish o'z joyida — birinchi qilinadigani ikkita.**

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH ===
```
VAQT: 16
KOMPONENT: Simulation (o'z doskasi + hafta-chizig'i) + bitta yozuv-maydoni
EKRAN: Endi o'z loyihangiz. O'tgan darsda yozgan uchta hikoyangiz pastda turibdi.
HARAKAT: 3 kartani doskaga joylashtiradi; hafta-chizig'i to'ladi; «🎯 Darrov
qilinadi» katagidan BITTASINI birinchi deb belgilaydi va bir qatorda sababini yozadi.
JAVOB: Uchala karta joylashgan · birinchi tanlangan · sabab maydoni bo'sh emas
va «nechta odam» yoki «qancha vaqt» haqida gapiradi.
RO'YXAT: Uchala ishingiz doskada · Birinchisi tanlangan · Sabab yozilgan
YULDUZCHA: To'rtinchi ishni o'zingiz o'ylab qo'shing — u qaysi katakka tushadi?
YORDAM: Bitta savoldan boshlang: bu ishni sinfdoshlaringizdan nechtasi so'raydi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Darrov qilinadi»ga hammasini tiqmoqchi bo'lganlar bo'ladi — hafta-chizig'i
qizarganda o'zi ko'rinadi. Aralashmang, chiziq o'rgatadi.
```

> 🔴 **32/94-qonun (shartlar prozada emas):** EKRAN matnidan «Har biriga ikki savolni bering, doskaga joylang — va birinchi qilinadiganini tanlang» uch-qadamli qatori olib tashlandi. Qadamlar bosqichli ochilishning O'Z chiplarida turadi (1 — doskaga joylashtiring · 2 — birinchisini belgilang · 3 — sababini yozing), matnda takrorlanmaydi.

🔴 **Kirish-artefakt tarmog'i (69-korpus: zaxira tizim-xatosidek eshitilmasin):**
- **Artefakt BOR:** «O'tgan darsda yozgan uchta hikoyangiz pastda turibdi.»
- **Artefakt YO'Q:** «Boshlash uchun o'yin-klub ishlaridan uchtasini olamiz — ular sizga tanish.»
- 🔴 Ikkala tarmoq **bir shaklda** yoziladi; «topilmadi / saqlanmagan / bo'sh» so'zlari **0** marta (residue-grep).
- 🔴 Zaxira-namuna **shu darsning O'Z olamidan** (o'yin-klub) — 96c(d).

🔴 **106d-qonun (yozish-mashqi javobsiz qolmaydi):** sabab-maydoni ostida javob darhol chiqadi —
- ✅ «Sababingizda ikki savoldan biri bor — shunday bo'lishi kerak.»
- 🤔 «Bu sabab ishning o'zi haqida. Nechta odam so'rashini yoki qancha vaqt olishini yozing.»

🔴 **92c/85-qonun:** maydon ipuchasi qisqa buyruq — `placeholder="Nega aynan shu birinchi?"`; namuna-chip YO'Q, tayyor javob maydonda TURMAYDI.

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Drag&Drop (qayta joylashtirish)
EKRAN: Dasturchi doskani ko'rib chiqdi: ikki ish endi boshqacha vaqt oladi.
Yangi vaqtni o'qing va ikkala kartani to'g'ri katakka ko'chiring.
HARAKAT: Ikki karta ustida yangi vaqt-yorlig'i chiqadi; o'quvchi ikkalasini
yangi katakka ko'chiradi. Ko'chirilgach katak nomi yangilanadi.
JAVOB: 🖥 «Hozir nechta joy bo'sh» 3 hafta → 2 kun = 🏔 REJAGA TUSHADI → 🎯 DARROV QILINADI ·
🏆 «O'tgan turnir g'oliblari» 1 kun → 2 hafta = 🌱 VAQT BO'LSA → 🗑 KERAK EMAS
RO'YXAT: —
YULDUZCHA: —
YORDAM: Ishning o'zi o'zgarmadi — faqat vaqti o'zgardi. Qaysi o'q qimirlaydi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Dasturchi bilan gaplashish ham shu ishning bir qismi: qancha vaqt ketishini
siz emas, kodni yozadigan odam biladi. Sinfda juftlikda ayting — biringiz
dasturchi bo'ling, biringiz ishni tanlaydigan odam.
MENTORGA: Bu ekran bitta fikrni beradi: qaror bir marta qilinmaydi. Yangi
ma'lumot kelganda doska qayta ko'riladi — va bu xato emas, ish shunday yuradi.
```

Yakuniy qator (bitta gap):
> ✅ **Ikki karta yangi katakka ko'chdi — ish o'zgarmadi, vaqti o'zgardi.**

> 🔴 **«PM» qisqartmasi o'quvchi matnidan olindi** (MATN_ETALONI lug'ati, F-0726-01): SOFT bandida «PM ishi» va «birov PM» bor edi — o'quvchi bu ikki harfni bilmaydi.
> 🔴 **«muddat» → «vaqt»** (bir tushuncha — bir nom): doskaning yon o'qi «Qancha vaqt oladi?» deb turibdi; «muddat» ikkinchi nom bo'lib chalkashtiradi. «Muddat» faqat uy-vazifaning topshirish sanasi ma'nosida qoladi.

> 🔴 **26-qonun tekshiruvi:** oldingi PM darsning (M3-D2) TEKSHIRUVi Hotspot/xato-topish edi — bu yerda **yangi ma'lumotga qarab qayta joylashtirish**. Takror YO'Q ✓
> 🔴 **59-qonun ruhi:** doska mexanikasi s4 da ham, s9 da ham ishlaydi, lekin **vazifasi boshqa** — s4 = noldan qurish, s9 = o'zgargan ma'lumotga qarab qayta ko'rish. Bir dars ichida bu takror hisoblanmaydi.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code-topshirig'i — 26/82-qonun)
EKRAN: O'yin-klub doskasidagi to'rtta kartani sahifada chiqaradigan kod yozamiz.
Har karta o'z katagining rangida chiqsin: darrov qilinadi — yashil, rejaga
tushadi — ko'k, vaqt bo'lsa — kulrang, kerak emas — xira.
HARAKAT: VS Code'da Karta komponentini yozadi: props orqali nom va katakni
oladi, katakka qarab rang beradi; App.jsx da map() bilan 4 kartani chiqaradi.
JAVOB: Sahifada 4 karta chiqadi, har biri o'z katagining rangida.
RO'YXAT: Karta komponenti props oladi · Rang katakka qarab tanlanadi ·
map() bilan to'rttasi chiqadi
YULDUZCHA: Kartalarni shunday tartiblang: «darrov qilinadi» kartalari eng tepada tursin.
YORDAM: Ranglarni oldindan bitta obyektga yozib qo'ying, keyin katak nomi bilan oling.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod nusxalanmaydi — qo'lda yoziladi. Ulgurmagan o'quvchi uni uyga
oladi, u holda uy-vazifasining QISQA varianti beriladi.
```

> 🔴 **87-qonun tekshiruvi (o'tilgan texnik material):** m3-01 React tushunchasi · **m3-03 «Birinchi komponent»** — JSX, `props.name` · **m3-04 «State va Effect»** — `useState`, `map()`, `onClick`. Topshiriqda **shu uchtasidan tashqari hech narsa yo'q**: `useEffect`, `useState`, marshrutlash, API — ishlatilmaydi.
> 🔴 **87b (bo'shliq yopish):** m3-03 props'ni **matn** uzatishda ko'rsatgan; props qiymatiga qarab **ko'rinishni o'zgartirish** praktikasi qilinmagan — koding aynan shu bo'shliqni yopadi. (Qurish bosqichida `ReactFirstComponentLesson.jsx` va `ReactStateEffectLesson.jsx` grep bilan qayta tasdiqlanadi.)
> 🔴 **26-qonun:** M3-D2 kodingi to'liq-ekran **kompilyator** edi (`hikoyaYasa`) — bu dars **VS Code-topshirig'i**. Mexanika almashdi ✓
> 🔴 **Kompilyator-qarori (2026-08-11 foydalanuvchi ko'rsatmasi):** bu darsga **kompilyator-qobiq qurilmaydi**. Kompilyator mavzusi LMS TZ qaytgach barcha darslarga bir yo'la kiritiladi; shu sababli `PmCompiler`/`hcp-*`/`HtmlCompiler` importi bu faylda YO'Q.
> 🔴 **82-qonun bandlari:** sarlavha «…digan **kod** yozamiz» oilasida ✓ · panel CHAPDA, kod O'NGDA · nusxalash bloklangan (`user-select:none` + onCopy/onCut/onPaste) · **honor-checklist YO'Q** — darvoza darsning O'Z mini-mashg'i (quyida) · bitta halol tugma «✅ Bajardim — kartalar rangi bilan chiqdi».
> 🔴 **22-qonun (sanoq-mosligi):** koding o'quvchining O'Z doskasidan emas, **o'yin-klub doskasidan** to'rtta kartani oladi — s8 da o'quvchining doskasida uchta karta bor edi. Sarlavha buni ochiq aytadi («O'yin-klub doskasidagi to'rtta kartani…»), ❌ «Doskangizdagi kartalar» degan gap o'quvchini sanashga majbur qilardi.
> 🔴 **Darvoza-mashq (82e):** 4 katak nomi ↔ 4 rang juftlashtiriladi (darsning o'z bilimi). To'g'ri juftlangach kod-panel ochiladi.
> 🔴 **89-qonun:** «✓ Bu mashqni sinfda bajarganman — davom etish →» xira matn-havolasi (faqat erkin rejimda).

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: Ekranga qaramasdan, yoddan aytib bering: bugun qaysi ishni birinchi
deb tanladingiz va nima uchun aynan uni? Avval sherigingizga ayting,
keyin bir qatorda yozing.
HARAKAT: (s11) yakuniy testga javob beradi; (s12) juftlikda 1 daqiqa aytadi,
keyin bir qator yozadi; (s14) 10 ta takrorlash kartasini o'zi tekshiradi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uchdan biridan ko'pi «nima uchun»ni ayta olmasa — s2 dagi ikki savol
kartasini qayta oching, uchala javobni birga o'qing.
```

> 🔴 **54(e)-qonun:** recap **2 qadam** (ayting + yozing) — uchinchi «3 savol» qadami YO'Q.
> 🔴 **99-qonun:** s14 flashcard ekranida **mentor-pufak YO'Q**; sarlavha — «O'zingizni sinab ko'ring.»
> 🔴 **76-qonun:** sarlavha challenge-savol shaklida; mentor niyatni ochiq aytadi. ❌ «o'z so'zingiz bilan».

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda o'z doskangizga yana ikki ish qo'shing — ikki savolni bering va
joylashtiring. Keyin «Rejaga tushadi» katagidan bitta ishni oling va uni ikkiga
bo'ling: qaysi yarmi bir haftaga sig'adi?
HARAKAT: Doskaga 2 yangi karta qo'shadi; «Rejaga tushadi»dagi bitta ishni
2 bo'lakka bo'lib yozadi. Keyingi darsga tayyor holda keladi.
JAVOB: —
RO'YXAT: Ikki yangi ish doskada · Ikkalasi ham katakka joylashgan ·
Uzoq ish ikkiga bo'lingan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Doskangizga bitta yangi ish qo'shing va uni joylashtiring.
SOFT: —
MENTORGA: Kodingni sinfda tugatganlarga to'liq variant, uyga olganlarga qisqa
variant. Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan nomlanadi — «To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»; «Koding uyga qolsa» shart-yorlig'i YO'Q.
> 🔴 **11-korpus:** topshiriq kartasi «Nechta: 2 ta yangi · Muddat: keyingi darsgacha» + 3 raqamli qadam; **yakun-ekranda AYNAN shu 3 qadam va muddat qaytariladi**.
> 🔴 **73-qonun:** «keyingi darsda …» va'dasi faqat MUDDAT bandida — shu sababli QISQA_VARIANT dan «Ikkiga bo'lish topshirig'i keyingi darsga qoladi» qatori olindi.

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
MAVZU: Ishlarni foyda va vaqt bo'yicha tartiblash; ikki savol («nechta odam
so'raydi», «qancha vaqt oladi»); to'rt katak (darrov qilinadi · rejaga tushadi ·
vaqt bo'lsa · kerak emas); yangi ma'lumot kelganda qarorni qayta ko'rish;
odam ko'p joyda bitta ish ko'proq odamga yetib borishi (K14).
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> Har savol 74-qonun (test-qolipi) · 17-qonun (faqat BITTA himoyalanadigan javob) · 64-qonun (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21-qonun (glossli) · 34-qonun (darsning o'z ta'limiga zid emas) bo'yicha yozilgan. Variant uzunliklari teng (8.4) — korrekturadan keyin o'lchandi: TEST-1 27/25 · TEST-2 18/13 · TEST-3 41/37 · TEST-4 25/21 belgi, hamma juftlik **≤1.4×** (to'g'ri javob uzunligidan bilinmaydi).

### TEST-1 (s3 — s2 «ikki savol» kartasidan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 💵 Narxlar va 🖥 bo'sh joylar — ikkalasini ham hamma so'raydi. Qaysi savol ularni ajratadi?
- **A.** Ishning qancha vaqt olishi ✅
- B. Ishni kim birinchi so'ragani
- C. Ishning chiroyli ko'rinishi

**Reveal-izoh (≤15 so'z, 74d):** To'g'ri — birinchi savol ikkalasini teng qildi, ajratgani ikkinchisi: qancha vaqt oladi.

> 🔴 **Nega qayta yozildi (17/74-qonun):** eski savolda javob savolning O'ZIDA turardi — «uch hafta ish, kam odam qaraydi» deb aytilgach, «Ko'p vaqt oladi, lekin kam odamga foyda beradi» varianti shu gapning takrori edi. Yangi savol s2 ning O'Z xulosasini tekshiradi; tuzoqlar esa hayotda uchraydigan, lekin darsda o'rgatilmagan mezonlar (64/21-qonun).

### TEST-2 (s5 — s4 doskasidan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🖥 «Hozir nechta joy bo'sh» — deyarli hamma so'raydi, uch hafta oladi. Qaysi katak?
- A. 🎯 Darrov qilinadi
- **B.** 🏔 Rejaga tushadi ✅
- C. 🌱 Vaqt bo'lsa

**Reveal-izoh:** To'g'ri — ko'p odam so'raydi, shuning uchun tashlanmaydi; uzoq vaqt oladi, shuning uchun rejaga tushadi.

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 📱 Stories'ni Snapchat o'ylab topdi. Nega u Instagram'da ko'proq ishlatildi?
- A. Instagram uni chiroyliroq qilib chiqargan
- B. Instagram'da reklama ko'proq ko'rsatilgan
- **C.** Instagram'da allaqachon odam ko'p edi ✅

**Reveal-izoh:** To'g'ri — bir xil ish odam ko'p joyda ko'proq odamga yetib bordi.

> 🔴 **Nega qayta yozildi:** eski B varianti («Instagram uni birinchi bo'lib chiqargan») savolning o'zi bilan to'qnashardi — savol «Snapchat o'ylab topdi» deb turibdi, ya'ni variant o'zini fosh qiladi (korpus §21). «Auditoriya» so'zi ham olindi: o'quvchi uni universitet xonasi deb o'qiydi — dars slaydining o'z so'zi «odam ko'p edi» (korpus §42, 21-qonun: ball beriladigan matnda jargon yo'q).

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **A (indeks 0)**
**Savol:** 📋 Ikki ish ham bir kunlik. Qaysi biri birinchi qilinadi?
- **A.** Ko'proq odam so'ragani ✅
- B. Ro'yxatda yuqorida turgani
- C. Qilish qiziqroq bo'lgani

**Reveal-izoh:** To'g'ri — vaqt teng bo'lsa, qarorni birinchi savol hal qiladi: buni nechta odam so'raydi.

> 🔴 **55-qonun:** test savoli **yalang'och** — sarlavha yonida hoshiya, `::before` marker, rangli lenta YO'Q.
> 🔴 **105-qonun:** savol `className="title h-ask"`, variantlar `line-height: 1.45`.

---

## 5. DOSKA SPETSIFIKATSIYASI (s4/s8/s9 — 92/94/106-qonunlar)

**Ekran-budjeti (106-qonun: 4 blok):** sarlavha → karta-idishi («✋ Oltita ishni doskaga joylashtiring ↓») → doska → (bajargach) natija-qatori. Boshqa blok YO'Q: subtitr yo'q, ost-eslatma yo'q, «Namuna» akkordeoni yo'q.

**Bosqichli ochilish (94-qonun):** s8 da uch qadam ketma-ket ochiladi — chip-yorliqlari (≤4 so'z, 32-qonun): (1) «Doskaga joylashtiring» → (2) «Birinchisini belgilang» → (3) «Sababini yozing». Har qadam oldingisi tugagach ochiladi; tugagan qadam bir qatorga yig'iladi (✓ + tanlangan qiymat + ↻).

**Rang-semantikasi (71-qonun — butun dars bo'ylab BIR XIL):**
| Tushuncha | Rang |
|---|---|
| Foyda (nechta odam so'raydi) | `blue` #0E86C4 |
| Vaqt (qancha vaqt oladi) | `accent` #5B3DE6 |
| 🎯 Darrov qilinadi | `success` #12A968 |
| 🏔 Rejaga tushadi | `blue` #0E86C4 |
| 🌱 Vaqt bo'lsa | `ink3` #9C97B4 |
| 🗑 Kerak emas | `line` #E7E3F4 (xira) |

🔴 `err`/`errSoft` (#E5484D) doskada **ishlatilmaydi** — katak tanlovi xato emas. Qizil faqat hafta-chizig'i oshib ketganda (haqiqiy chegara buzilishi).

**Sig'ish (58/60-qonun):** doska + 6 karta 1280×800 da skrollsiz sig'adi; sig'masa kartalar **qisilmaydi** — `.screen > * { flex-shrink: 0 }` va `.stage-content` skroll beradi.

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K14 · 91b/33/42/43/56-qonunlar)

**Freym (91b):** slaydlar ochiq freym bilan kiradi — «Biznes olamidan mashhur voqea:», eyebrow **«📱 Haqiqiy voqea»**, K-kodi ekranga CHIQMAYDI. 🔴 «Keys» so'zi ekranga chiqmaydi — u bizning ichki nomimiz, o'quvchi lug'atida yo'q.

**4 slayd (hikoya tilida — 42-qonun, hisobot tilida emas):**

1. **Snapchat'da yangi narsa paydo bo'ldi:** bir kundan keyin o'chib ketadigan rasm va videolar. Ularni «Stories» deb atashdi — yoshlarga yoqdi.
2. **2016-yilda Instagram xuddi shu narsani o'ziga qo'shdi.** Yashirmadi ham — ochiq ko'chirdi.
3. *(bashorat)* **Sizningcha, keyin nima bo'ldi?**
4. **Stories aynan Instagram'da eng ko'p ishlatildi.** Sabab oddiy: Instagram'da odam allaqachon ko'p edi — yangi narsa birinchi kunidayoq juda ko'p odamga yetib bordi.

**Bashorat-1 (3-slayddan oldin) — zinapoya tartibida (43-qonun):**
- «Snapchat'da qolib ketdi»
- «Ikkalasida bir xil ishlatildi»
- «Instagram'da ko'proq ishlatildi» ✅

**Bashorat-2 (4-slayddan oldin):**
- «Instagram'da dizayni chiroyliroq edi»
- «Instagram'da odam ko'proq edi» ✅
- «Instagram uni birinchi chiqargan edi»

**Natija-qatori (56/100-qonun):**
- topsa: «🎯 Topdingiz! Instagram'da ko'proq ishlatildi» — **quyruqsiz**
- adashsa: «Adashdingiz — asl javob: Instagram'da ko'proq ishlatildi»
- 🔴 «Bu ball emas / Ball yo'q» izohi **YO'Q** (100a) · «dars boshida siz … degandingiz» **YO'Q** (100b)
- 🔴 Tepa-yorliq: «🎲 Avval o'zingiz belgilab ko'ring» (79-qonun)

**Ko'prik-gap (91b — keys darsga qaytadi, 44-qonun: to'liq nom bilan, ichki atamasiz):**
> Instagram'da odam ko'p edi — shuning uchun bitta ish darrov ko'pchilikka yetib bordi. Doskadagi yuqori o'q ham aynan shuni so'raydi: buni nechta odam so'raydi?

> 🔴 **40-qonun:** ko'prikda «doskangizda» EMAS, «doskada» — s6 da o'quvchining O'Z doskasi hali yo'q (u s8 da paydo bo'ladi).

> 🔴 **10-qonun (keys-sadoqat):** K14 «raqamsiz» keys — hech qanday raqam qo'shilmaydi. Yagona sana — **2016** (bankda bor).

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun)

**Darvoza-mashq (82e — kod-panel shundan keyin ochiladi):** 4 katak nomini 4 rangga juftlashtirish.

**Boshlang'ich kod (VS Code-mockupda, NUSXALANMAYDI — 82d):**

```jsx
// Karta.jsx
function Karta(props) {
  return (
    <div className="karta">
      <b>{props.nom}</b>
      <span>{props.katak}</span>
    </div>
  );
}
export default Karta;
```

```jsx
// App.jsx
import Karta from './Karta';

const ISHLAR = [
  { nom: 'Soatlik narxlar',        katak: 'darrov' },
  { nom: 'Hozir nechta joy bo\'sh', katak: 'reja'   },
  { nom: 'Turnir g\'oliblari',      katak: 'keyin'  },
  { nom: 'Zalni 3D\'da ko\'rish',   katak: 'yoq'    },
];

export default function App() {
  return (
    <div>
      {/* ← Bu joyni siz to'ldirasiz: har ish uchun bitta Karta chiqsin */}
    </div>
  );
}
```

**Topshiriq (bitta gap):** `Karta` komponentiga rang qo'shing va `App.jsx` da to'rtta kartani chiqaring.

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. `Karta` `props.nom` va `props.katak` ni oladi
2. Rang `props.katak` ga qarab tanlanadi
3. `map()` bilan to'rtta karta chiqadi

**YORDAM (yechimni AYTMAYDI — 77-korpus):** Ranglarni oldindan bitta obyektga yozib qo'ying, keyin katak nomi bilan oling.

**YULDUZCHA:** «darrov» kartalari eng tepada tursin.

> 🔴 **49-korpus:** kod ichidagi xira izoh keyingi harakatni aytadi — «← Bu joyni siz to'ldirasiz», holatni takrorlamaydi.
> 🔴 **48-korpus:** sarlavha natijani aytadi — «O'yin-klub kartalarini sahifada chiqaramiz», ❌ «kodni tayyorlaymiz».
> 🔴 **88-korpus (narsa kodda yoziladigan nomi bilan ataladi):** ekranda «katak» deyilgani uchun kod-namunasidagi maydon ham `katak` — `props.chorak` qolsa, o'quvchi ikkita nomni bog'lay olmaydi.
> 🔴 **82f:** sinf-pulsi (👥 Sinfda…) bu ekranda o'quvchiga ko'rinmaydi; mentor `MentorPracticeStats` da ko'radi.
> 🔴 **102-qonun:** bu darsda to'liq-ekran oyna YO'Q (kompilyator qurilmaydi) — `open` bayrog'i talab qilinmaydi. Koding holati `pm-m3d5-code` ga `{done:true}` bo'lib yoziladi (89-qonun: takrorlash bepul).

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Doska CSS-taymlayn bilan o'z-o'zidan to'ladi (18-qonun WOW). Statik siluet va `rotate()` qiyshiqlik TAQIQ. `takeaway` — bitta gap, ost-qator yo'q (54b) |
| **s12 REFLEKSIYA** | Juftlik-taymer (1 daqiqa) + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun) |
| **s14 FLASHCARD** | 🔴 Mentor-pufak YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s15 dagi uy-vazifa kartasi** | Topshiriq-karta: 3 raqamli qadam + muddat. Yorliqlar hajm bilan (57-qonun). 🔴 «Shartnoma» so'zi ekranga chiqmaydi — u blok-nomi, o'quvchi lug'atida yo'q |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan **grep bilan** olinadi — jonli «Bugungi g'oliblarimiz», yakka «Bugungi natijangiz». 🔴 90-qonun: «📊 Savollar bo'yicha» kartasi YO'Q |
| **s15 YAKUN** | «Endi siz bilasiz» ro'yxati — har qator tugal gap (52-korpus). Uy-vazifaning 3 qadami va muddati AYNAN takrorlanadi (11-korpus) |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha **buyruq shaklida** — `grep -cE '\?</h2>'` shu 4 ekranda **0**. Savol-sarlavha ruxsat etilgan: s0 · s1 · s2 · s6 · s12 |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savolning yonida uni AYTGAN ekran ko'rsatilgan. Qoplanmagan savol yo'q.

| # | Savol (qisqa) | Manba-ekran |
|---|---|---|
| 1 | Har ishga nechta savol beriladi? | s2 |
| 2 | Birinchi savol nimani so'raydi? | s2 |
| 3 | Ikkinchi savol nimani so'raydi? | s2 |
| 4 | Ko'p odam so'raydi, kam vaqt oladi — qaysi katak? | s4 |
| 5 | Ko'p odam so'raydi, ko'p vaqt oladi — qaysi katak? | s4 |
| 6 | Kam odam so'raydi, ko'p vaqt oladi — qaysi katak? | s4 |
| 7 | Kam odam so'raydi, kam vaqt oladi — qaysi katak? | s4 |
| 8 | Ikki ish ham bir kunlik bo'lsa, qaysi biri birinchi? | s4 + s11 |
| 9 | Ish vaqti o'zgarsa, doska bilan nima qilinadi? | s9 |
| 10 | Ish qancha vaqt olishini kim aytadi? | s9 (SOFT) |
| 11 | Stories'ni kim birinchi o'ylab topgan? | s6 |
| 12 | Nega Stories Instagram'da ko'proq ishlatildi? | s6 |

> 🔴 **9-qonun:** arena seq naqshsiz (sikl TAQIQ), taqsimot teng, uzunlik-tell ≤1.4×.
> 🔴 **21-qonun (ball beriladigan matn):** arena savollarida jargon yo'q — «katak» va «vaqt» darsda ekranda turadi; ❌ «auditoriya», ❌ «muddat-bahosi», ❌ «chorak» olib tashlandi.
> 🔴 **43-qonun (belgi-formula taqiqi):** 4–7-savollardagi `+` va `=` belgilari sodda gapga aylantirildi — o'quvchi matnida formula-belgi ishlatilmaydi.

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha o'yin-nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif (uz) | Belgi | Trigger |
|---|---|---|---|
| **Board Master!** | Olti ishni doskaga joylashtirdingiz | 35 | s4: 6/6 joylashdi |
| **Quick Win!** | Birinchi ishingizni tanladingiz | 31 | s8: `birinchi` + `sabab` saqlandi |
| **Plan Changer!** | Vaqt o'zgargach qarorni yangiladingiz | 37 | s9: ikkala karta ko'chdi |
| **Code Painter!** | Kartalarni rangi bilan chiqardingiz | 35 | s10: «Bajardim» bosildi |

> 🔴 **101a:** `acu-eyebrow` («🏅 Nishon ochildi!») YO'Q. Qatlamlar: medal → nom → tavsif → xira «bosib davom eting».
> 🔴 **1-D bo'lim:** nishonlar mentor rejimida **umuman ko'rinmaydi**.

---

## 11. FLASHCARD (10 ta — old tomoni SAVOL · 76-korpus: tarjimasiz chet so'z yo'q)

| # | Savol | Javob |
|---|---|---|
| 1 | Har ishga qaysi ikki savol beriladi? | Nechta odam so'raydi · Qancha vaqt oladi |
| 2 | Doskaning yuqori o'qi nimani ko'rsatadi? | Nechta odam so'rashini |
| 3 | Doskaning yon o'qi nimani ko'rsatadi? | Qancha vaqt olishini |
| 4 | Ko'p so'raladigan, tez bo'ladigan ish qayerga tushadi? | 🎯 Darrov qilinadi |
| 5 | Ko'p so'raladigan, uzoq ish qayerga tushadi? | 🏔 Rejaga tushadi |
| 6 | Kam so'raladigan, tez ish qayerga tushadi? | 🌱 Vaqt bo'lsa |
| 7 | Kam so'raladigan, uzoq ish qayerga tushadi? | 🗑 Kerak emas |
| 8 | Bu doskaning nomi nima? | Foyda va vaqt doskasi (Impact/Effort) |
| 9 | Ishning vaqti o'zgarsa nima qilinadi? | Karta yangi katakka ko'chiriladi |
| 10 | Vaqt teng bo'lsa, qaysi ish birinchi? | Ko'proq odam so'ragani |

> 🔴 **90(e/f)-qonun:** javoblar darsdagi ASOSIY nom bilan bir xil; har karta darsda bor, darsdagi har qoida kartada bor.
> 🔴 **Lug'at:** «o'lchaydi» → «ko'rsatadi» (MATN_ETALONI: «o'lchash» mavhum; bu yerda o'q raqam o'lchamaydi — javobni ko'rsatadi).

---

## 12. RECAP-KARTALARI (`RECAPS`, 4 qator — har biri o'z teoriyasini qayta tushuntiradi)

1. **Ikki savol.** Har ishga ikki savol beriladi: buni nechta odam so'raydi va u qancha vaqt oladi. Bitta savol yetmaydi — ikkalasi birga qarorni beradi. *(s2)*
2. **To'rt katak.** Ikki javob kesishgan joy ishning navbatini aytadi: ko'p so'raladigan va tez ish — darrov qilinadi; ko'p so'raladigan, uzoq ish — rejaga tushadi. *(s4)*
3. **Qayerda chiqarilgani ham muhim.** Bir xil ish har joyda bir xil natija bermaydi: odam ko'p bo'lgan joyda u ko'proq odamga yetib boradi. *(s6)*
4. **Qaror bir marta qilinmaydi.** Ish vaqti o'zgarsa, karta yangi katakka ko'chadi — bu xato emas, ish shunday yuradi. *(s9)*

---

## 13. O'Z-TEKSHIRUV (PM_Prompt_v8 yakuniy ro'yxati + PM_DARS_ETALON darvozalari)

**PM_Prompt_v8 (8 band):**
1. VAQT yig'indisi = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda bor, tegishli bo'lmagani «—» ✓
3. Blok 4 va blok 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN (to'liq) va QISQA_VARIANT ikkalasi ham to'ldirilgan ✓
5. Bosh keys K14 — modulda va dasturda ishlatilmagan ✓
6. TEKSHIRUV mexanikasi oldingi darsni (Hotspot) takrorlamaydi ✓
7. «Sen» murojaati — **0** ✓ *(korrektura: «🎯 DARROV QIL» katak-nomi sen-forma buyruq edi — «DARROV QILINADI» ga almashtirildi, korpus §64)*
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108-qonun (bitta misol-ip): o'yin-klub — s0 dan s17 gacha; keys 91b freymi bilan kiradi va ko'prik bilan qaytadi ✓
- 95-qonun (Toshkent o'smiri): o'yin-klub — o'quvchi o'zi boradi ✓
- 96c(e) (demo to'qnashuvi): lavash · OLX · kinoteatr · Uzum · YouTube · Airbnb · Starbucks · Duolingo — band emas ✓
- 26-qonun (koding mexanikasi almashadi): M3-D2 kompilyator → M3-D5 VS Code-topshirig'i ✓
- 87-qonun (o'tilgan material): faqat JSX · props · map ✓
- 47-qonun: `?</h2>` interaktiv ekranlarda 0 ✓
- 54-qonun (P0 dan o'chirishlar merosi): hook-osti izohi · `ta-sub` · demo-caption · keys-osti ramkasi · recap 3-qadami · yakun `h-sub` — **oltalasi ham YO'Q** ✓
- 100-qonun: «ball emas» izohi va hook-echo yo'q ✓
- 106-qonun: har mashq-ekranida ≤4 blok ✓
- 109-qonun (TMI): mentor ≤2 gap (yozish-ekranda ≤1); reja-ekran ta'rif aytmaydi ✓
- **Bir tushuncha — bir nom (korpus §80) — korrektura raundi:** «chorak» → **katak** (platforma lug'ati) · «mehnat» → **vaqt** (ekrandagi o'lchov) · «muddat» (davomiylik ma'nosida) → **vaqt** · «imkoniyat» → **ish** · «auditoriya» → **odam ko'p/kam** ✓
- **Ichki jargon ekranda 0:** «Keys», «Shartnoma», «PM», «artefakt», «YADRO» — o'quvchi matnida yo'q ✓
- **Ekran-matni ≤400 grapheme:** eng zich ekran — s2 (≈370). Qolganlari 150–300 oralig'ida; qurish bosqichida Intl.Segmenter bilan o'lchanadi ✓
- **Sanoq-mosligi (22-qonun):** hook 4 · s2 3 · s4 6 · s8 3 · s9 2 · koding 4 · flashcard 10 · arena 12 — matndagi har son ekrandagi element soniga teng ✓

---

## 14. ✅ [GATE S] — FOYDALANUVCHI QARORLARI (2026-08-11, YOPILDI)

> 🔴 **Quruvchi uchun majburiy:** quyidagi 7 qaror tasdiqlangan. Qurishda shulardan chetga chiqilmaydi.

| # | Qaror | Hukm |
|---|---|---|
| 1 | **Dars sarlavhasi** | ✅ **ALMASHADI.** `App.jsx` `m3-05`: title → **«Qaysi ishni birinchi qilasiz?»** · sub → **«Nechta odam so'raydi va qancha vaqt oladi»** |
| 2 | **Bosh keys** | ✅ **K14 · INSTAGRAM STORIES qoladi** (mavzuga eng aniq mos; M2-D7 K3 boshqa modul va boshqa voqea) |
| 3 | **Misol-olam** | ✅ 🎮 **O'yin-klub sayti** (maktab yonidagi kompyuter klubi) |
| 4 | **Uy-vazifaning 2-qadami** | ✅ **QOLADI** — «Rejaga tushadi» katagidagi ishni ikkiga bo'lish (M2-D7 ko'nikmasi yangi joyda mustahkamlanadi). Qisqa variantda bu qadam yo'q |
| 5 | **«Imkoniyat (feature)» atamasi** | ✅ **BITTA gloss-gap** — s2 xulosa-kartasidan keyin: «Saytga qo'shiladigan har bir yangi ish — bu yangi **imkoniyat** (feature).» Qolgan hamma joyda **«ish»** ishlatiladi (bir tushuncha — bir nom) |
| 6 | **Doska nomi** | ✅ **«Foyda va vaqt doskasi»** — shu darsda «vaqt» qoladi; `MATN_ETALONI` lug'atiga PM-izohi qo'shiladi (FullstackFeedback tegilmaydi) |
| 7 | **Bashorat-2 ↔ TEST-3** | ✅ **O'ZGARMAYDI** — 76-qonun bo'yicha mustahkamlash deb qabul qilindi |

**Qurish boshlanishidan oldingi eslatma:** `App.jsx` da `m3-05` qatorining `comp: PmLesson8` ulanishi
TEGILMAYDI — fayl joyida almashtiriladi (`src/3-Modull/PmLesson8.jsx`), faqat `title`/`sub` yangilanadi.

---

## 14-B. Qaror-nuqtalarning ASL matni (tarix uchun saqlanadi)

1. 🔴 **Dars sarlavhasi.** Hozirgi `App.jsx` yozuvi: «Komponent ham funksiya: qaysi biri birinchi?» · sub «Impact vs Effort matritsasi». Ikkalasi ham qonunga zid: sarlavhada tushunarsiz qurilma (39-qonun), subda inglizcha atama (korpus §20). **Taklif (korrekturadan keyin yangilandi):** title → «Qaysi ishni birinchi qilasiz?» · sub → «Nechta odam so'raydi va qancha vaqt oladi». Sabab: dars bo'ylab kartalar **ish** deb ataladi (bir tushuncha — bir nom), sub esa doskaning ikki o'qini so'zma-so'z takrorlaydi. Tasdiqlaysizmi?
2. 🟡 **Keys-brendi takrori.** K14 — Instagram. Instagram allaqachon **M2-D7** da bosh keys bo'lgan (K3, Burbn hikoyasi). 10-qonun modul ichida takrorlashni taqiqlaydi (bu boshqa modul — rasman ruxsat), lekin brend bir xil. Variantlar: **(a)** K14 qoladi — mavzuga eng aniq mos keys (temalarida «приоритизация» va «компонент=фича» bor); **(b)** K17 Tesla roadmap'iga almashtiriladi — brend yangi, lekin mavzu rejalashtirishga siljiydi. Tavsiyam — **(a)**.
3. 🟡 **Misol-olam yon-tekshiruvi.** M2 ning JS darslari (`JsVars/JsConditions/JsLoops`) misollarida «o'yin olami» ishlatilgan (zarar, kuch — o'yin mexanikasi). Bu dars esa **o'yin-klub biznesi** haqida — boshqa narsa, lekin so'z ustma-ust tushadi. Muqobil olam: **🏀 maktab sport seksiyasi sayti**. Qaysi biri?
4. 🟡 **Uy-vazifaning ikkinchi qadami** («Rejaga tushadi» katagidagi ishni ikkiga bo'lish) — bu M2-D7 (dekompozitsiya) ko'nikmasining takrori. Qoldiramizmi (o'tgan modul ko'nikmasini yangi joyda ishlatish) yoki soddalashtiramizmi?

**Korrektura raundida qo'shilgan bandlar (2026-08-11, `pm-metodist`):**

5. 🔴 **«Imkoniyat (feature)» atamasi darsda umuman ishlatilmasinmi?** Korrektura uni ekran matnidan **oldi**: doskadagi kartalar hamma joyda «ish» deb ataladi, ikkita nom o'quvchini ikkiga bo'ladi (korpus §80). Modul konsepsiyasi esa «Komponent = imkoniyat» deb turibdi. Uch variant: **(a)** atama umuman yo'q — hozirgi holat, eng sodda; **(b)** s2 xulosa-kartasidan keyin **bitta** gap: «Saytga qo'shiladigan har bir yangi ish — bu yangi **imkoniyat** (feature)», keyin baribir «ish» ishlatiladi; **(c)** butun dars «imkoniyat» ga o'tadi (tavsiya qilinmaydi: «oltita imkoniyatni joylashtiring» og'ir jaranglaydi). Tavsiyam — **(b)**, chunki modul-ipini uzmaydi va bitta gapdan oshmaydi.
6. 🟡 **«Foyda va vaqt doskasi» nomi.** Platforma lug'atida (`matritsa → doska`) «Foyda / Mehnat doskasi» yozuvi bor (FullstackFeedback, texnik modul). Bu darsda «mehnat» **vaqt** ga almashtirildi — sabab: ekranda ikkinchi o'q faqat vaqt bilan o'lchanadi («1 kun · 3 hafta»), «mehnat» esa hech qayerda ko'rinmaydigan uchinchi so'z bo'lib qolardi. Ikki yo'l: **(a)** shu darsda «vaqt» qoladi va lug'atga PM-izohi qo'shiladi; **(b)** platforma bo'ylab «Foyda va vaqt doskasi» ga o'tiladi (FullstackFeedback ham tuzatiladi). Tavsiyam — **(a)**.
7. 🟡 **Bashorat-2 va TEST-3 yaqinligi.** Bashorat-2 («Instagram'da odam ko'proq edi») va TEST-3 ning to'g'ri javobi bir xil fikrni tekshiradi — ikkalasi orasida bitta ekran bor. 76-qonun bo'yicha bu mustahkamlash, lekin xohlasangiz TEST-3 ni umumlashtiramiz: «Bir xil yangilik ikki ilovada chiqdi — qayerda ko'proq odam ko'radi?» (javob-indeksi o'zgarmaydi).

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (0–90 bo'lim) bo'yicha yozildi. Keyingi qadam: `pm-metodist` SENARIY-KORREKTURA rejimida → **[GATE S]**.*
