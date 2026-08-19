# M6-D12 — Bugun qaysi ish boshlanadi, qaysisi kutadi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI → **pm-metodist korrekturasi bajarildi** (2026-08-19 · 13-A bo'lim) → **[GATE S]** kutmoqda.
> Fayl: `src/6-Modull/PmLesson24.jsx` (mavjud v16 avlod TO'LIQ qayta quriladi; `lessonId: pm-m6d12-v1`).
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 Batch 5 — o'zgartirilmagan.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 6 — «Tizimni to'liq yig'aman» (oy 11–12.5) |
| **Dars** | M6-D12 (modulning 12-darsi, uchinchi PM darsi) · `key: m6-12` |
| **Mavzu** | Uzoq reja: qaysi ish bugun boshlanadi, qaysisi uch oydan keyin, qaysisi olti oydan keyin |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z rejasini **yozadi**; artefakt = matn (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | **K17 · TESLA** (bankda birinchi marta ishlatilyapti) — burchak: **«uch ufq: bir varaqdagi uzoq reja»**. Bank «raqamsiz» deb belgilangan: yagona sonlar — **2006-yil** va **«o'n yildan ortiq»**, ikkalasi ham bank matnida bor. Yangi raqam QO'SHILMAYDI (10-qonun) |
| **ISHLATILGAN_KEYS** | K17 · 🔴 modul-ichi qoidasi (registr 4-bo'lim): M6 da K7 (m6-02) · zaxira ilgak (m6-06) · **K17 (m6-12)** · K12 (m6-14) — takror YO'Q ✓ |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | **m6-02** → katak-tekshiruv · **m6-06** → oqibat-juftlash (registr R2 Batch 5). Undan oldingilari: kun-belgilash (m5-11) · savol-elak (m5-08) · joy-quvuri (m5-02). **M6-D12 = «ufq-joylash»** — hech biri bilan to'qnashmaydi (26/59-qonun; asos: 1-bo'lim va s9 izohi) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq ro'yxati: story-silosi · JTBD shtampi · Metrika alangasi · **ikki o'qli foyda-vaqt doskasi** · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «GAPSIZ KO'RSATUV» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «UCH QAVAT KESIMI» · «YUK-SINOVI» · «SIFAT-TAROZI» · «RELIZ-TASMASI» · «O'LCHAGICH-PANELI» · «BIRINCHI 20» · «INTERVYU-STOLI» · «QAYTISH-KALENDARI» · Hotspot · **Timeline** · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · qaror-sabab tanlovi · nosozlik-navbati · haftaga-sig'dirish darvozasi · signal-saralash · pitch-oilasi ro'yxati |
| **Misol-ip (91/108 + 95 + 96c)** | ✂️ **«Sartaroshxona navbati» tizimi** — demo-tizim (s0 · s1 · s2 · s4 · s9 · s10); o'quvchining O'Z to'liq tizimi esa s8 va uy-vazifada (96c: ip artefakt orqali yuradi). 95-qonun: o'smir sartaroshxonaga O'ZI boradi, navbatni o'zi so'raydi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · maydoncha · musiqa ilovasi · maktab jurnali · kutubxona · AvtoStoyanka · konsert-chipta · skuter-ijara · loyiha-poygasi · Netlify sayti · o'quvchining Telegram-boti — **sartaroshxona band emas** ✓. Grep-dalili: `sartarosh` src/ da atigi 2 joyda va ikkalasi ham «kasb egalari» ro'yxatining bitta so'zi (`PmLesson28:123` · `PmLesson30:116`) — bosh-misol emas |
| **Kirish-artefakt** | 🔴 `pm-m6d6-chegara` = `{ chegaralar: [{ qaror, jabr } × 3] }` (m6-06 dan) — **jim zaxira**: BOR bo'lsa s8 da uchala `qaror` qatori ochiladi; YO'Q bo'lsa panel umuman chiqmaydi va «topilmadi / saqlanmagan / bo'sh» so'zlari YOZILMAYDI (§69) |
| **Chiqish-artefakt** | 🔴 `pm-m6d12-yol` = `{ ufqlar: [ {ufq, ish} × 3 ], savedAt }` — `ufq` qiymatlari ASCII: `hozir` · `uch-oy` · `olti-oy` (registr muhri, o'zgartirilmadi). Keyingi PM dars (m6-14) uni O'QIYDI. 🔴 Bu bog'lanish faqat senariy-darajasida: ekranda «keyingi darsda…» va'dasi YOZILMAYDI (73-qonun) |
| **Yordamchi kalitlar** | `pm-m6d12-hook-choice` (faqat YOZILADI — 100c) · `pm-m6d12-yol-holat` (s4 holati: bosilgan ishlar + ko'chirish-qarori) · `pm-m6d12-code` · `pm-m6d12-reflection` · `pm-m6d12-hw-target` · `ccProgress` |
| **Koding** | ⌨️ **VS Code** — R1 navbati (registr: m6-06 kompilyator → **m6-12 VS Code** → m6-14 kompilyator). Senariy buni o'zgartirmaydi |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M4a-D2/M5-D11 da tasdiqlangan yakun-tuzilmasi bilan bir xil |

**Atama-glosslar (62/39-qonun + korpus §20/§104/§126 — avval hodisa, keyin nom):**

- 🔴 **«ufq» — darsning yagona yangi atamasi.** Kanonik ta'rif dars bo'ylab AYNAN bir xil: **«Ishlar qachon boshlanishiga qarab bo'lingan bo'lak — ufq.»** (§109: zamon-iborasi «qachon boshlanishiga qarab», yasama ot emas). Shu ta'rif s2 xulosa-kartasi · flashcard-1 · s10 darvoza-mashqi · RECAPS · s15 da so'zma-so'z takrorlanadi. «Ufq» — maktabdan tanish o'zbek so'zi (ko'z yetadigan eng uzoq joy); yo'l-vizuali uni bir qarashda ochadi;
- 🔴 **§126 darvozasi:** «ufq» **s1 maqsad-ekranida YO'Q**. s1 natijani sodda so'z bilan nomlaydi («uch qatorli reja»), atama s2 da tug'iladi;
- 🔴 **Darsning yagona qoidasi (§103 — yasama ot emas, fe'l):** **«Ish o'zi kutgan narsa tayyor bo'lganda boshlanadi.»** Kaskad: s4 yakun-qatori · TEST-2 revealı · RECAPS · flashcard-4 · s15 — bitta fe'l bilan;
- 🔴 **Uch ufq nomi hamma yuzada bir xil** (korpus §80): **«Hozir»** · **«Uch oydan keyin»** · **«Olti oydan keyin»**. Qisqartma («3 oy», «6 oy») ekranda ishlatilmaydi — kodda esa ASCII kalit: `hozir` · `uch-oy` · `olti-oy`;
- 🔴 **Fe'l-intizomi (korpus §80 — bir mashq, bir fe'l):** ish **boshlanadi** · ish **kutadi** · kerak narsa **tayyor bo'ladi** · ish **to'xtaydi** (boshlab bo'lmaganda). ❌ «qoladi», «kechikadi», «suriladi», «muzlaydi» — ishlatilmaydi;
- 🔴 **«ish» va «reja» bir ma'noda (§105/§121):** «ish» — rejadagi bitta bo'lak (qilinadigan narsa); «reja» — uch ufqli varaqning o'zi. ❌ «ishlayapti», «ishga tushirish» kabi boshqa ma'nodagi shakl o'quvchi matnida turmaydi — tizim haqida «ochiladi», «xabar yuboradi» deyiladi;
- 🔴 **«masofa» so'zi dars bo'ylab ISHLATILMAYDI:** ufq faqat **vaqt** bilan tushuntiriladi (bugun / uch oydan keyin / olti oydan keyin). Yo'l-vizuali ko'zga masofa ko'rsatsa ham, matn vaqtdan chetga chiqmaydi — ikki o'lchov aralashmasin;
- ❌ **«roadmap» / «yo'l-xarita» o'quvchi ekranida CHIQMAYDI** (korpus §20: markaziy atama bo'lsa qavs-gloss yetmaydi). Inglizcha juftlik faqat flashcard-10 javobida: «Yo'l-xarita (inglizchasi — roadmap)». Shu sababli **«xarita»** so'zi ham dars bo'ylab boshqa joyda ishlatilmaydi (§121 ildiz-intizomi) — demo-tizimning ishi «📍 Manzilni sahifada ko'rsatish» deb ataladi;
- ❌ **«RICE», «ICE», «prioritet», «backlog», «sprint», «epic», «deadline», «kvartal», «strategiya», «master-plan» ISHLATILMAYDI** — kalka yoki kelajak/o'tgan dars atamasi (29-qonun). `App.jsx` sub'ida hozir «RICE» turibdi — 14-bo'lim 1-bandiga qarang;
- ❌ **«metrika», «pitch», «slayd» o'quvchi matnida YO'Q** — ular m6-14 niki (29-qonun);
- ❌ **«arxitektura», «pipeline», «Skill», «agent», «mikroservis», «React Native», «Expo» ISHLATILMAYDI** — o'quvchi ularni biladi (m6-01…m6-11), lekin bu dars QAROR haqida; TMI taqiqi (109-qonun) ularni ekrandan chiqarib tashlaydi;
- ❌ «tartibga solish», «ketma-ketlik» — Timeline lug'ati; bu darsda ish **ufqqa qo'yiladi**, tartibga solinmaydi (1-bo'limdagi farq-dalili).

🔴 **§40 darvozasi (o'quvchida hali YO'Q narsa uniki qilib aytilmaydi) — M6 texnik darslari bo'yicha tekshirildi:**

| Nima | Holat | Manba |
|---|---|---|
| Front + back + baza + AI + bot — to'liq tizim | ✅ **BOR** | `m6-01` SystemArchitectureLesson · `m6-08` PipelineProjectLesson |
| O'z Skill'i yozilgan | ✅ BOR | `m6-05` / `m6-07` |
| **Mobil versiya** (o'sha backendga ulangan) | ✅ **BOR** | `m6-09` · `m6-10` · `m6-11` MobileAppPracticeLesson |
| Loyiha kuni — uchidan-uchiga yig'ilgan tizim | ❌ **HALI YO'Q** (`m6-13`) | — |
| Demo Day 3 da ko'rsatilgan | ❌ **HALI YO'Q** (`m6-16`) | — |

→ Shuning uchun **«tizimingiz»** — to'g'ri va halol (o'quvchi uni O'ZI qurgan, mobil versiyasi bilan). ❌ «tizimingiz tugadi», «tizimingizni ko'rsatgansiz», «Demo Day'da…» YOZILMAYDI. Demo-tizim (sartaroshxona navbati) esa hech qachon «tizimingiz» deb atalmaydi — u har doim **«bu tizim»**.

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «UCH UFQ YO'LI»** (23-qonun: har darsda YANGI — registr 5-bo'limdagi birorta band vizual klonlanmaydi).

Ekranning pastida — chapdan o'ngga cho'zilgan **yo'l**, ustida uch bekat (🔴 «bekat» — shu senariydagi vizual-tavsif so'zi; EKRANDA yorliq faqat ufq nomi bilan yoziladi, 13-A/1-band): 🟢 **Hozir** · 🟡 **Uch oydan keyin** · 🔵 **Olti oydan keyin**. Yuqorida — laganchada (72-qonun) sartaroshxona tizimining **oltita ishi**, hammasi hali yo'lga qo'yilmagan holda turadi.

| Ish | Ekranda |
|---|---|
| 📸 Sartarosh ishlaridan surat qo'yish | tizimga sartarosh rasmlarini qo'shish |
| 🔔 Navbatdan bir soat oldin eslatma | bot xabari |
| 📍 Manzilni sahifada ko'rsatish | qaysi ko'chada ekani |
| ⭐ Sartaroshga baho qo'yish | tashrifdan keyin baho |
| 📆 Sartaroshning band kunlarini ko'rsatish | qaysi kun to'lgan |
| 💳 Ilovada oldindan to'lash | navbatni pul bilan band qilish |

**1-bosqich — «Bugun boshlab ko'ring».** O'quvchi har ishning ▶ tugmasini bosadi. Uchtasi yashil bo'ladi, uchtasi to'xtaydi va yonida **bitta fakt-qator** chiqadi:

| Ish | Natija | Fakt-qator |
|---|---|---|
| 📸 Sartarosh suratlari | ✅ | Boshlandi — suratlar sartaroshlarning telefonida bor |
| 🔔 Eslatma xabari | ✅ | Boshlandi — bot allaqachon xabar yubora oladi |
| 📍 Manzil | ✅ | Boshlandi — manzillar bazada yozilgan |
| ⭐ Sartaroshga baho | 🔴 to'xtadi | To'xtadi — baho qo'yish uchun odam avval navbat olishi kerak. Navbat hali yo'q |
| 📆 Band kunlar | 🔴 to'xtadi | To'xtadi — band kunlar real navbatlardan chiqadi. Navbat hali yo'q |
| 💳 Oldindan to'lash | 🔴 to'xtadi | To'xtadi — pulini oldindan berish uchun odam sartaroshga ishonishi kerak. Ishonch baholardan chiqadi, baho hali yo'q |

To'xtagan ish **o'zi** yo'l bo'ylab siljib, kutgan narsasi tayyor bo'ladigan bekatga borib turadi; yo'lda ingichka bog'lovchi chiziq chiziladi. Oltalasi bosilgach yo'l to'liq quriladi: **Hozir 3 ish · Uch oydan keyin 2 ish · Olti oydan keyin 1 ish.**

Yakun-qatori (bitta gap): **«✅ Buni o'zingiz ko'rdingiz: ish o'zi kutgan narsa tayyor bo'lganda boshlanadi.»**

**2-bosqich — qaror** (yo'l qurilgach ochiladi — 94-qonun progressiv ochilish): ekranga bitta savol-karta chiqadi: *«💳 Oldindan to'lashni "Olti oydan keyin"dan "Uch oydan keyin"ga ko'chirsangiz nima bo'ladi?»* Ikki tugma:

- **«Uch oyda boshlanadi»** → «Uch oyda birinchi baholar endi kelgan bo'ladi — odam hali notanish sartaroshga pulini oldindan bermaydi. Ish baribir to'xtaydi.»
- **«Baribir to'xtaydi»** → «✅ Shunday: ishni ufqqa bizning xohishimiz emas, uning kutayotgan narsasi qo'yadi.»

(56-qonun: ball yo'q, qizil baho yo'q, asl javob DOIM ochiladi; qayta tanlash ochiq.)

🔴 **Rang-qonuni (palitra-pasporti + korpus §134/§135-C):** yo'lning uch bekati **ma'no-rangida** va rang-yozuvi ekranda ochiq turadi — 🟢 Hozir · 🟡 Uch oydan keyin · 🔵 Olti oydan keyin. Bu rang-legendasi o'quvchi MATNIDA, kod-izohida emas. To'xtash belgisi (🔴) — **haqiqiy holat**, o'quvchining xatosi EMAS; shuning uchun 2-bosqichdagi noto'g'ri tanlovga qizil baho berilmaydi (neytral indigo).

🔴 **Nima uchun aynan shu:** rejani **o'qib** tushunib bo'lmaydi — ishni bugun boshlab ko'rganda ma'noga kiradi. Bola ufq haqida gapirmaydi: har ishni o'zi bosadi va qaysi ish nimani kutayotganini **o'z qo'li bilan** topadi; keyin bitta ishni yaqinroq ufqqa ko'chirib, xohish yetmasligini ko'radi. Bu — darsning butun qarori («qaysi ish bugun, qaysisi keyin») qo'lda o'ynaladigan shakli, va K17 keysining darsdagi kichik ko'rinishi.

🔴 **Mexanika-farqi (26/59-qonun) — pasport talab qilgan IKKI farq-dalili:**

**(a) M3-D10 «Timeline» (`src/3-Modull/PmLesson9.jsx`, Screen9 — ochib tekshirildi).** U yerda `QADAMLAR` — **bitta ishning beshta qadami** («Shartlarni yozamiz → dasturchiga beramiz → kod yoziladi → tekshiramiz → tayyor deymiz»), bitta chiziq, har kartaga **aynan bitta o'rin**, va **tartibning o'zi to'g'ri javob** (`S9_ARALASH` aralashtirilgan, `tryPlace` faqat navbatdagi qadamni qabul qiladi). Bu yerda esa: **oltita mustaqil ish**, uchta bekat, **bitta bekatga bir nechta ish tushadi** va **ufq ichida tartib YO'Q** — «Hozir»dagi uch ishning qaysi biri oldin qilinishi savol emas. Obyekt boshqa (qadam ↔ ish), o'lchov boshqa (nima birinchi QILINADI ↔ bu ish qachon MUMKIN bo'ladi), natija boshqa (bitta chiziq ↔ uch bekat).

**(b) M3-D5 «ikki o'qli foyda-vaqt doskasi» (`src/3-Modull/PmLesson8.jsx` — ochib tekshirildi).** U yerda doska **ikki o'q** bilan o'qiladi: `foyda` («Nechta odam so'raydi?») va `vaqt` («Qancha vaqt oladi?»), ular kesishib **to'rt katak** beradi (`darrov · reja · keyin · yoq`) — ya'ni mashqning natijasi **qaysi ish qimmatliroq** va **qaysi ish umuman kerak emas**. Bu yerda o'q **bitta**, savol bitta: **«buni bugun boshlab bo'ladimi?»**, va 🔴 **oltala ish ham kerak — bittasi ham tashlanmaydi**. Foyda mezoni bu darsda inkor qilinmaydi (§108): TEST-4 revealı uni ochiq joyiga qo'yadi — «nechta odam so'rashi bitta ufq ichida qaysi ishni oldin qilishni aytadi, ufqni esa emas».

**(c) Qo'shni band mexanikalardan:** «ISHGA TUSHIRIB KO'RISH» (M3-D10) — **soxta forma** to'ldiriladi va yuboriladi; bu yerda forma yo'q, alohida ish kartalari bosiladi. «RELIZ-TASMASI» (m4c-02) — **bitta katta ish** haftalarga bo'linadi; bu yerda oltita **boshqa-boshqa** ish. «QAYTISH-KALENDARI» (m5-11) — kunlar ustun, odamlar belgi; bu yerda kun ham, odam ham yo'q.

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 40–45 soniya harakatsizlikdan keyin bitta qoida-ipuchasi: «Yana bitta ishning ▶ tugmasini bosib ko'ring» — javobni AYTMAYDIGAN shaklda (korpus §77).

🔴 **Navbat-pulsi (88-qonun · 1-C bo'lim):** harakat-zanjiri = «oltala ishni bosish → 2-bosqich savoliga javob → o'tish». Naqsh — **yurish** (`useTurnWalk`): faqat hali bosilmagan ishlar navbatma-navbat aylanadi; oxirgisi bosilgach puls o'chadi va navbat 2-bosqich kartasiga o'tadi.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M4a-D2/M5-D11 dagidek — etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Oltita ish bor, hammasi kerak. Qaysinisidan boshlaysiz?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch qatorli reja o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — bitta ro'yxat ↔ uch bo'lakka ajratilgan reja | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **UCH UFQ YO'LI** (bugun boshlab ko'rish + ko'chirish-qarori) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K17 Tesla (4 slayd + 2 bashorat + hisoblagich) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 ufqqa 3 ish** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **UFQ-JOYLASH** | 5 | — | 🔴 yangi to'plam, hukm-joylash |
| s10 | KODING — rejani ufqlarga ajratadigan kod | 6 | — | 26/82/87-qonun · ⌨️ VS Code |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **s4 va s9 to'plamlari ARALASHMAYDI** (§102 ekran-ko'chirma taqiqi): s4 — sartaroshxona tizimining bugungi oltita ishi; s9 — **bir necha oydan keyingi** yangi oltita ish. s1 demo-uchligi esa ikkalasiga ham kirmaydi (spoyler-taqiq, M3-D5 saboqi).

🔴 **«Ufq» so'zi ekran-sarlavhalarida faqat s2 dan keyin** (§126): s0 va s1 sarlavhalarida ham, matnida ham 0.

🔴 **47-qonun:** interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu to'rt ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 6 — Tizimni to'liq yig'aman
DARS: M6-D12 (12-dars)
DARS_MAVZUSI: Uzoq reja — qaysi ish bugun boshlanadi, qaysisi keyin
ISHLATILGAN_KEYS: K17
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Tizimingizga oltita yangi ish o'ylab topdingiz. Hammasi kerak, hammasi qiziq —
lekin hammasini birdan boshlab bo'lmaydi. Qaysi yo'lni tanlaysiz?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: ikkala yo'l ham ishlaydi, lekin
oltita ishning ba'zisi bugun umuman boshlanmaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkala tomonning ham dalili bor. Shu bo'linishning
o'zi darsga eshik: uchinchi javob bor va u ekranda ochiladi.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| ⚡ Eng oson ishdan — natija tez ko'rinadi | 38 |
| 🎯 Eng foydali ishdan — ko'p odamga kerak | 39 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham ishlaydi. Lekin oltita ishning ba'zisi bugun umuman boshlanmaydi — u sizni emas, **boshqa narsani** kutib turibdi. Qaysi ish nimani kutayotganini bugun o'zingiz topasiz.

> 🔴 **Korpus §119 (payoff hech bir tanlovni yolg'onga chiqarmasin):** payoff ikkala tanlovni ham rad etmaydi — u ikkalasiga ham BIR XIL yangilik qo'shadi («ba'zi ish umuman boshlanmaydi»). «Eng foydali ishdan» tanlovi ham rad etilmaydi: foyda mezoni bu darsda buzilmaydi (§108), u TEST-4 revealida o'z joyiga qo'yiladi.
> 🔴 **97-qonun / korpus §57/§125:** savol o'quvchining O'Z holatidan o'sadi va uning O'Z tilida — tizimi bor, oldida yangi ishlar turibdi (§40 jadvali bilan tekshirildi).
> 🔴 **104-qonun:** to'g'ri javob YO'Q — payoff ikkala tanlovda bir xil; ❌ «To'g'ri o'yladingiz…» yozilmaydi.
> 🔴 **100-qonun:** tanlov `pm-m6d12-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62/§126-qonun:** «ufq» atamasi bu ekranda YO'Q — u s2 da ochiladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ekran-o'lchovi:** savol + payoff = **323 grapheme** proza (chegara 400) ✓ (metodist qayta o'lchadi).

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Bu — sartaroshxonaga navbat oladigan ilovaning rejasi. Dars oxirida o'z
tizimingiz uchun shunday uch qator yozasiz: qaysi ish bugun boshlanadi, qaysisi
uch oydan keyin, qaysisi olti oydan keyin.
HARAKAT: O'quvchi kuzatadi: bo'sh varaqqa uchta qator o'z-o'zidan yozilib chiqadi,
har birining yoniga ✅ qo'yiladi.
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
| Hozir → Sartaroshxona telefon raqamini qo'shamiz |
| Uch oydan keyin → Doimiy mijozga tug'ilgan kun tabrigini yuboramiz |
| Olti oydan keyin → Sartaroshlar uchun alohida kirish ochamiz |

> 🔴 **§126 / 39/62-qonun:** s1 da «ufq» so'zi **0** — atama o'z ekranida (s2) tug'iladi; demo faqat uch qatorli shaklni ko'rsatadi.
> 🔴 **Korpus §125 (maqsad-ekran natijani NOMLAYDI, kashfiyotni oshkor qilmaydi):** demo qatorlarida «nimani kutadi» ustuni YO'Q — u s4 ning kashfiyoti.
> 🔴 **Demo o'z qoidasidan o'tadi (34-qonun / §123 / §128):** telefon raqami bugun bor → bugun; tug'ilgan kun tabrigi doimiy mijozni kutadi (u hali yo'q) → uch oydan keyin; sartaroshlar uchun alohida kirish ko'p sartarosh va muntazam navbatni kutadi → olti oydan keyin. Uchala qator ham darsning o'z qoidasiga bo'ysunadi.
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo-uchlik s4 oltiligiga ham, s9 oltiligiga ham KIRMAYDI.
> 🔴 **40-qonun / korpus §40:** «o'z tizimingiz» — to'g'ri (M6 da qurilgan, mobil versiyasi ham bor); sartaroshxona esa «bu tizim».
> 🔴 **42-qonun:** suyuqlik-fe'li yo'q — «o'z-o'zidan yozilib chiqadi»; **54(b/c):** `ta-sub` ikkinchi qator YO'Q, demo ostidagi caption YO'Q.
> 🔴 **Ekran-o'lchovi:** proza **194 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (uch ufq yo'li) + 3 × Quiz
EKRAN: Ishlar qachon boshlanishiga qarab bo'lingan bo'lak — ufq. Rejada uch ufq bor:
hozir · uch oydan keyin · olti oydan keyin.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) har ishni bugun boshlab ko'radi,
qaysi ish nimani kutayotganini topadi va bitta ishni yaqinroq ufqqa ko'chirib qaraydi;
(s6) keys-slaydlarini bashorat bilan ochadi.
JAVOB: s4 — bugun boshlanadi: suratlar, eslatma, manzil; kutadi: baho va band kunlar
(navbatni), oldindan to'lash (ishonchni). Ko'chirish-qarori: baribir to'xtaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar odatda uchta yashil ishni bosib to'xtaydi. To'rtinchi ish
to'xtagach «nimasi yetishmayapti?» deb so'rang — kashfiyot aynan shu lahzada.
```

**s2 — TEORIYA-1: bitta ro'yxat ↔ uch bo'lakka ajratilgan reja** (korpus §73: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Oltita ish bitta ro'yxatda tursa, nima ko'rinmaydi?»**

Mentor (≤2 gap, 32b):
> Sartaroshxona tizimining oltita ishi ikki xil yozilgan. Ikki kartani bosib solishtiring.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 📋 **Bitta ro'yxat** | Oltita ish yonma-yon turibdi — qaysi biri bugun boshlanishini hech narsa aytmaydi |
| 🛣 **Uch bo'lakka ajratilgan** | O'sha oltita ish uch bo'lakka bo'lingan: bugun boshlanadiganlar alohida, keyinroq boshlanadiganlar alohida |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif):
> Uzoqqa qarasangiz, ko'z yetadigan eng olis joy — ufq. Rejada ham yaqini va uzog'i bor.
> **Ishlar qachon boshlanishiga qarab bo'lingan bo'lak — ufq.** Rejada uch ufq bor: hozir · uch oydan keyin · olti oydan keyin.

> 🔴 **39/§104-qonun qolipi:** avval hodisa (ikki karta), keyin ta'rif-gap «… — ufq». Sarlavhada yangi atama YO'Q ✓.
> 🔴 **§109:** ta'rif zamon-iborasi bilan («qachon boshlanishiga qarab»), yasama ot emas.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan.
> 🔴 **§131 (atama karta-sarlavhasida emas):** karta yorliqlari «📋 Bitta ro'yxat» / «🛣 Uch bo'lakka ajratilgan» — atama yorliqda emas, xulosada tug'iladi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **349 grapheme** proza (karta matnlari — mashq-materiali, sanalmaydi) ✓.

**s4 — YADRO: UCH UFQ YO'LI** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Har ishni bugun boshlab ko'ring.»**

Mentor (≤2 gap, 92a):
> Yuqorida sartaroshxona tizimining oltita ishi, pastda yo'l va undagi uch ufq. Har ishning ▶ tugmasini bosib chiqing.

> 🔴 **98b:** mentor qaysi ish to'xtashini AYTMAYDI — fakt-qatorlar harakatdan KEYIN chiqadi.
> 🔴 **106d/71:** har bosishda javob darhol: belgi (✅ yoki 🔴) **va** bitta fakt-qator — o'quvchi nega to'xtaganini o'qiydi, taxmin qilmaydi.
> 🔴 **§106 (test ko'chirma bo'lmasin):** fakt-qatorlar ISH-darajasida gapiradi («baho qo'yish uchun odam avval navbat olishi kerak»); umumiy QOIDA faqat oltalasi bosilgach yakun-qatorida chiqadi — TEST-2 esa uni QO'LLASHNI so'raydi.
> 🔴 **§135-A (matn ekranga zid bo'lmasin):** yashil uchlik va to'xtagan uchlik yo'lda AYNAN 3 + 2 + 1 bo'lib joylashadi; yakun-hisoblagichi shu sonlarni takrorlaydi — boshqa son ekranda yo'q.
> 🔴 **§134/§135-C (rang-legendasi majburiy):** yo'l bekatlari ustida rang-yozuvi ochiq turadi (🟢 Hozir · 🟡 Uch oydan keyin · 🔵 Olti oydan keyin) — rang ma'nosi o'quvchi matnida o'rgatilgan, kod-izohida emas.
> 🔴 **72-qonun:** oltita ish alohida laganchada, harakat-chorlovi bilan («▶ Bugun boshlash»); birinchi bosishdan keyin chorlov tinadi.
> 🔴 **94-qonun:** 2-bosqich savol-kartasi faqat oltalasi bosilib bo'lgach ochiladi (progressiv ochilish).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + yakun-qatori = **228 grapheme** ✓.

**s6 — KEYS:** 6-bo'limga qarang.

---

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Uch ufqqa uchta ish yozing.
(mentor, 1 gap) Har ishga bitta savol bering: buni bugun boshlab bo'ladimi?
HARAKAT: Uch ishni BITTALAB yozadi — avval «Hozir», keyin «Uch oydan keyin», keyin
«Olti oydan keyin». Har kartada bitta maydon: shu ufqda boshlanadigan ish. Saqlaganda
qator o'ngdagi yo'lga chiqadi.
JAVOB: Uchala ufqqa ham ish yozilgan · «Hozir» ishi bugun boshlanadi · uzoq ufqdagi
ishlar nimanidir kutadi · «kerak», «yaxshi» kabi bo'sh so'zlar ish nomi emas.
RO'YXAT: Uch ufqqa uchta ish yozildi · «Hozir» ishi bugun boshlanadi ·
Uzoq ufqdagi ish nimanidir kutadi
YULDUZCHA: «Olti oydan keyin» ishingiz nimani kutayotganini bir qatorda yozing.
YORDAM: O'zingizga ikki savol bering: buni bugun boshlab bo'ladimi? Bo'lmasa, nimasi
hali yo'q? Ikkinchi savolning javobi ufqni o'zi ko'rsatadi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Uchalasi ham bugun boshlanadi» degan rejalar chiqadi — bu eng foydali
xato. Javob-qatori uni tutadi, siz muhokama qiling: unda bu reja nima?
```

🔴 **Kirish-artefakt — «BOR» tarmog'i to'liq (jim zaxira, §69):** `pm-m6d6-chegara` topilsa, ekran tepasida ixcham panel ochiladi:
> ⚖️ **Oldingi darsda uchta chegara qo'ygan edingiz:** *(uchala `qaror` qatori)* — rejangizdagi ish shu chegaralarni buzmasin.

Topilmasa panel **umuman chiqmaydi** va ekran u haqda **hech narsa demaydi**: «topilmadi / saqlanmagan / bo'sh» so'zlari **0**. Panel faqat o'qiydi — `pm-m6d6-chegara` ga yozmaydi.

🔴 **Yozish-kartasi (80b) — bitta karta, uch qadam ichida:**

| Qadam | Karta yorlig'i | Ipucha (placeholder — korpus §32) |
|---|---|---|
| ① | 🟢 Hozir | `Bugun qaysi ish boshlanadi?` |
| ② | 🟡 Uch oydan keyin | `Uch oydan keyin qaysi ish boshlanadi?` |
| ③ | 🔵 Olti oydan keyin | `Olti oydan keyin qaysi ish boshlanadi?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12; 106d ikki tomonlama; §130 — ✅-qatori faqat ROST gapni aytadi):**
- ✅ ish yozilgan → «✅ Yozildi — bu ish o'z ufqida turibdi.»
- 🤔 bo'sh sifat yozilgan (*kerak · yaxshi · muhim · foydali · qulay*) → «Bu hali ish emas. Tizimingiz nima qilishini yozing.»
- 🤔 «Hozir» kartasida kutish-belgisi bor (*ko'p odam · pul · baho · bo'lgach · yig'ilgach · to'lgach*) → «Bu ish nimanidir kutyapti. Hozirga bugun boshlanadigan ishni yozing — buni keyingi ufqda yozasiz.»
- 🤔 oldingi karta bilan bir xil ish → «Bu ish yuqorida allaqachon yozilgan — boshqa ish yozing.»
- 🤔 uchinchi karta saqlanayotganda uchala ish ham bugun boshlanadigan bo'lsa → «Uchalasi ham bugun boshlanadi — unda bu reja emas, bugungi ro'yxat. Kutadigan bitta ish toping.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **§130 (checklist mezoni AYNAN so'zni emas, MA'NOni talab qiladi):** yorliq «Uzoq ufqdagi ish nimanidir kutadi» — o'quvchidan «kutadi» so'zini ko'chirish TALAB QILINMAYDI; ikki savol Yordam chipida turadi.

🔴 **§92d:** majburiy maydon faqat o'quvchida ANIQ bor ma'lumot uchun — ish nomi uning O'Z tizimidan, u m6-01…m6-11 da qurgan.

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **87 grapheme** ✓ (javob-qatorlar harakatdan keyin, bittadan chiqadi).

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (ufq-joylash)
EKRAN: (topshiriq) Har ishni o'z ufqiga qo'ying.
(yo'riqnoma) Sartaroshxona tizimi ochilganiga bir necha oy bo'ldi: har kuni
navbatlar tushyapti, birinchi baholar endi kelyapti. Oldida yangi oltita ish turibdi.
HARAKAT: Oltita ishni bittalab uch ufqdan biriga qo'yadi. Har qo'yishdan keyin asl
ufq va bir qatorlik sabab ochiladi.
JAVOB: Hozir — ismi bo'yicha sartarosh qidirish · navbatni bekor qilish · tungi ko'rinish.
Uch oydan keyin — uchinchi tashrifga chegirma · sartaroshlar ro'yxati. Olti oydan keyin —
boshqa shaharga ochish.
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) O'zingizga ikki savol bering: buni bugun boshlab
bo'ladimi? Bo'lmasa, nimasi hali yo'q?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda ishlating: har o'quvchi sherigining uch qatorini o'qib, «olti oydagi
ishingiz nimani kutyapti?» deb so'raydi. Javob topilmasa — ish boshqa ufqqa ko'chadi.
MENTORGA: Eng ko'p adashiladigan joy — «sartaroshlar ro'yxati»: baholar endi kelyapti,
ular hali oz. Sabab-qatori ochilgach shuni ovoz chiqarib o'qing.
```

**Oltita yangi ish (yangi sahna: bir necha oy keyin — s4 oltiligidan BOSHQA to'plam):**

| Ish | Asl ufq | Javob ochilgandagi sabab-qatori |
|---|---|---|
| 🔎 Ismi bo'yicha sartarosh qidirish | 🟢 Hozir | Sartaroshlarning ismi bazada allaqachon yozilgan |
| ❌ Navbatni bekor qilish tugmasi | 🟢 Hozir | Navbatlar tushib turibdi — bekor qilishni bugun qo'shsa bo'ladi |
| 🌙 Ilovada tungi ko'rinish | 🟢 Hozir | Ilova ishlab turibdi, ranglarni bugun o'zgartirsa bo'ladi |
| 🎁 Uchinchi tashrifga chegirma | 🟡 Uch oydan keyin | Uchinchi tashrif uchun odam avval uch marta kelishi kerak — ko'pchilik hozircha bir-ikki marta kelgan |
| 🏅 Sartaroshlar ro'yxati — kim ko'p maqtalgan | 🟡 Uch oydan keyin | Ro'yxat baholardan tuziladi — birinchi baholar endi kelyapti, ular hali oz |
| 🏙 Boshqa shaharga ochish | 🔵 Olti oydan keyin | Boshqa shaharga chiqish uchun avval bitta shaharda sartaroshlar to'lishi kerak |

O'tish-gap (22-qonun — yangi to'plam ochiq aytiladi, mentor 1 gap):
> Uch qatoringiz tayyor — endi shu savolni o'sha tizimning yangi oltita ishida beramiz.

Yakun-qatori:
> ✅ **Yaqin ufqda ish ko'p turadi, uzoq ufqda esa oz — reja shunday ko'rinadi.**

> 🔴 **26/59-qonun — Timeline va ikki o'qli doskadan farqi (pasport talabi; to'liq dalil 1-bo'limda):** bu yerda tartib qurilmaydi (Timeline) va katak-kesishmasi qidirilmaydi (M3-D5 doskasi) — har ishga **bitta savol** beriladi: «buni bugun boshlab bo'ladimi?». Bitta bekatga bir nechta ish tushadi, bekat ichida tartib YO'Q, va oltala ish ham rejada qoladi — bittasi ham tashlanmaydi.
> 🔴 **106d + korpus §77/§98 — ikki tomonlama javob (to'g'ri ufq AYTILMAYDI):** ish kerakdan uzoqroq bekatga qo'yilsa → «🤔 Buni kutishning hojati yo'q — unga kerak narsa allaqachon bor.»; yaqinroq bekatga qo'yilsa → «🤔 Buni hali boshlab bo'lmaydi — nimasi yetishmayotganini o'ylab ko'ring.» Javob (asl ufq + sabab-qatori) DOIM ochiladi; qayta qo'yish ochiq. YORDAM faqat birinchi xatodan keyin.
> 🔴 **§116:** YORDAM-savoli oltala ishning ham to'g'ri javobiga olib boradi — uchtasida «ha», uchtasida «yo'q» va yetishmagan narsa nomlanadi.
> 🔴 **§135-A (matn ekranga zid bo'lmasin):** yo'riqnomadagi sahna («ochilganiga bir necha oy») va sabab-qatorlari zid emas — bir necha oyda birinchi baholar endi keladi va ko'pchilik hali bir-ikki marta kelgan bo'ladi. (Metodist: «yarim yil» sahnasi zid edi — yarim yilda odam uch marta ham kelib ulgurardi.)
> 🔴 **Sahna yangi, olam o'sha (91-qonun):** bugungi tizim (s4) → bir necha oydan keyingi tizim (s9) — bitta ip ichida ikki payt; oltilik s4 oltiligini takrorlamaydi (§102).
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda) · **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **178 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code + terminal — R1 navbati)
EKRAN: (sarlavha) Rejani ufqlarga ajratadigan kod yozamiz.
(mentor, 2 gap) Hozirgina oltita ishni qo'lingiz bilan ufqlarga qo'ygan edingiz —
endi o'sha ishni kod bajaradi. Ishlar o'sha tizimniki.
HARAKAT: reja.js faylini yozadi: uch ufq nomini chiqaradi va har ufq ostiga o'z
ishlarini teradi. Terminalda node reja.js bilan ko'radi.
JAVOB: Terminalda uch sarlavha chiqadi, ular ostida 3 · 2 · 1 ta ish turadi.
RO'YXAT: node reja.js uch ufq nomini chiqaradi · Har ufq ostida o'z ishlari turadi ·
Ish boshqa ufq ostiga tushmaydi
YULDUZCHA: Har ufq nomi yonida ish sonini chiqaring: == hozir (3 ta) ==
YORDAM: Avval bitta ufq nomini qo'lda chiqarib ko'ring. Ishlagach ichiga reja bo'yicha
aylanadigan ikkinchi siklni qo'shing — har aylanishda bitta ish qo'lingizda bo'ladi.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod — s4 va s9 dagi ishning tarjimasi, shuni ochiq ayting: bola qo'li bilan
qo'ygan ish endi kodda ufq nomi bo'lib turibdi.
```

> 🔴 **87-qonun (o'tilgan texnik material):** massiv, obyekt, `for`, `if`, `===`, matn qo'shish `+`, `console.log` — M2 da o'tilgan; `node fayl.js` — M4 da. O'tilmagan hech narsa so'ralmaydi.
> 🔴 **26-qonun / R1:** m6-06 kompilyator → **m6-12 VS Code** → m6-14 kompilyator — registr navbati, senariy o'zgartirmaydi.
> 🔴 **82(a):** sarlavha «…digan **kod** yozamiz» oilasidan, natijani aytadi · **82(b):** `previewUrl` YO'Q — natija terminalda ko'rinadi · **82(c):** panel (yo'riq + darvoza-mashq + «✅ Bajardim — uch sarlavha chiqdi») CHAPDA, kod O'NGDA · **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi · **82(f):** sinf-holati o'quvchiga ko'rinmaydi.
> 🔴 **89-qonun:** takrorlash-yo'li (erkin rejim, matn-havola): «✓ Bu mashqni sinfda bajarganman — davom etish →».
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **161 grapheme** ✓.

---

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch qatoringizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan javob bering: olti oydagi ishingiz nimani kutyapti?
Avval sherigingizga ayting, so'ng shu javobni bir qatorda yozing.
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
MENTORGA: Uchdan biri «nimani kutyapti» savoliga javob berolmasa — s4 ekranini qayta
oching va to'xtagan uch ishni birga o'qing.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — platformaning odatiy **«O'zingizni sinab ko'ring.»** (§105/§121 tekshiruvi: «sin-» ildizi bu darsning atamasi EMAS — to'qnashuv yo'q, odatiy naqsh saqlanadi).
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, so'ng shu javobni bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **76-qonun:** mentor niyatni ochiq aytadi («ekranga qaramasdan»).

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda rejangizni davom ettirasiz: ufqlarga yangi ishlar qo'shasiz va uzoq
ufqdagi ish nimani kutayotganini yozasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
HARAKAT: Har ufqqa yana bitta ish qo'shadi; «Olti oydan keyin» ufqidagi ish nimani
kutayotganini bir gap bilan yozadi.
JAVOB: —
RO'YXAT: Har ufqqa yangi ish qo'shilgan · «Olti oydan keyin» ishi nimani kutayotgani
yozilgan · «Hozir» ishi bugun boshlanadi
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Uch ufqingizdan bittasiga yana bitta ish qo'shing va nega o'sha ufqda
turishini bir gap bilan yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi · **§115:** karta sarlavhasi — savol («📝 Uyda nima qilasiz?»).
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «yana bitta», «uch ufq» sanoqlari faqat To'liq-kartada.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — ufqqa ish yozish s8 da, «nimani kutadi» javobi s4 fakt-qatorlarida va s9 sabab-qatorlarida bajarilgan.
> 🔴 **73-qonun:** «keyingi darsda…» va'dasi YO'Q — reja m6-14 ga o'tishi senariy-ma'lumoti, ekran matni emas.

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
MAVZU: Ufq nima va rejada nechta ufq bor; ishni ufqqa nima qo'yadi; nega baho qo'yish
bugun boshlanmaydi; nega surat qo'yish bugun boshlanadi; «olti oydan keyin» ufqi
ishning nimasini aytadi; uzoq ufqdagi ishni yaqinroqqa ko'chirsak nima bo'ladi; qaysi
ufqda ish ko'p turadi; Tesla rejasi qaysi mashinadan boshlangan (2006);
Tesla keyingi mashinani nima bilan qurgan; Tesla rejasi bilan nima qilgan (ochiq
e'lon, o'n yildan ortiq bajarilgan); uzoq rejani kim yozadi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §106/§129 (kalit xulosadan ko'chirilmaydi) · §110 (mutlaq so'z / kulgili-bo'sh yo'q) · §118 (cheklov-so'zsiz) · §133 (tinish-shakl telli emas) · §135-C (yakka-uchraydigan so'z yo'q). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🛣 Rejadagi ish eng uzoq ufqqa tushdi. Bu nimani bildiradi?
- A. Uni olti oy davomida qilamiz *(28)*
- **B.** Uni olti oydan keyin boshlaymiz ✅ *(30)*
- C. Uni olti oyda tugatib qo'yamiz *(31)*

**Reveal:** To'g'ri — ufq ishning uzunligini emas, boshlanish paytini aytadi.

> 🔴 **§106/§129:** kalit s2 xulosasidan so'zma-so'z olinmagan — savol ta'rifni **qo'llashga** majbur qiladi: uch variant ham «olti oy» so'zini ishlatadi, farq faqat MA'NOda (boshlanish ↔ davomiylik ↔ tugash). 🔴 **Metodist:** savol o'zagidagi «Olti oydan keyin» yorlig'i olib tashlandi — u kalit B ning so'zini so'zma-so'z qaytarardi (§129 echo); endi o'quvchi avval «eng uzoq ufq» qaysi ekanini o'zi biladi.
> 🔴 **§110/§102:** B va C — o'smir uchun eng tabiiy ikki noto'g'ri o'qish (ufqni davomiylik yoki muddat deb tushunish); ikkalasi ham darsning hech bir ekranida rost bo'lib ko'rinmaydi. Kulgili-bo'sh variant yo'q.
> 🔴 **§99/§133:** uchalasi ham «Uni olti oy…» bilan boshlanadi va bir xil tinish-shaklda. Uzunlik: 30 · 28 · 31 (tell 1.11 ✓).
> 🔴 **§135-C:** «olti oy» uchala variantda ham bor — yakka-uchraydigan so'z kalitni oshkor qilmaydi. Savol 9 so'z (105b ✓).

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** ⭐ «Sartaroshga baho qo'yish» ishi nega bugun boshlanmaydi?
- A. U boshqa ishlardan ko'proq vaqt oladi *(37)*
- B. Undan foydalanadigan odam kam *(29)*
- **C.** U kutayotgan narsa hali paydo bo'lmagan ✅ *(39)*

**Reveal:** To'g'ri — baho qo'yish uchun avval real navbatlar kerak, ular hali yo'q. Ish o'zi kutgan narsa tayyor bo'lganda boshlanadi.

> 🔴 **§106:** s4 fakt-qatori ish-darajasida gapirgan edi («odam avval navbat olishi kerak»); to'g'ri variant esa **umumlashma** — bola qoidani o'zi chiqaradi, reveal muhrlaydi.
> 🔴 **§102:** A — s4 hech qayerda ish qancha vaqt olishini aytmaydi (ya'ni ekranda rost emas), lekin ishonarli; B — M3-D5 ning foyda-mezoni, bu darsda qo'llanmaydi, lekin bola uni tanlashi mumkin. Ikkalasi ham darsni O'QIGANNI mukofotlaydi (§110 📌). 🔴 **Metodist:** kalit «kerak narsa» dan «kutayotgan narsa» ga o'girildi — «kerak narsa» T4 kalitida ham turgani uchun ikki testda kalitni belgilab qo'yardi (§135-C so'z-telli).
> 🔴 **§99/§133:** uchalasi ham «U/Undan …» olmoshi bilan boshlanadigan darak gap. Uzunlik: 39 · 37 · 29 (tell 1.34 ✓).
> 🔴 **§127:** dars atamasi («ufq») bu savolda umuman yo'q — kalit atama-so'zi bilan topilmaydi.

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 📜 Tesla o'zining uzoq rejasi bilan nima qilgan?
- **A.** Uni hammaga ochiq e'lon qilgan ✅ *(31)*
- B. Uni faqat ishchilariga ko'rsatgan *(32)*
- C. Uni bir yildan keyin bekor qilgan *(33)*

**Reveal:** To'g'ri — reja ochiq turdi va o'n yildan ortiq bajarildi. Uzoq reja yashirin qog'oz emas, hamma ko'radigan varaq.

> 🔴 **§124 (ball-javob sof bank-fakti):** «reja ochiq edi» — bank matnining o'zi (bank: reja ochiq edi); xulosa («uzoq reja — hamma ko'radigan varaq») revealda qoladi.
> 🔴 **§102:** C ni 4-slayd ochiq rad etadi («o'n yildan ortiq bajarildi») — o'qigan bola uni ishonch bilan chiqarib tashlaydi; B esa hech qayerda aytilmagan, lekin ishonarli.
> 🔴 **§110/§118:** mutlaq so'z 0; «faqat» bitta variantda (≤1/4 ✓) va u savolni halollash uchun emas, ma'no uchun turibdi.
> 🔴 **§99/§133:** uchalasi «Uni …gan» qolipida. Uzunlik: 31 · 32 · 33 (tell 1.06 ✓). Savol 8 so'z ✓.
> 🔴 **Bashorat bilan to'qnashmaydi:** bashorat-1 «qaysi mashinadan boshlangan», bashorat-2 «keyingisini nima bilan qurgan» — T3 uchinchi bank-faktini so'raydi.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 📋 Ishni qaysi ufqqa qo'yishni nima hal qiladi?
- A. Ishni bajarish qancha vaqt olishi *(33)*
- **B.** Kerak narsa qachon tayyor bo'lishi ✅ *(33)*
- C. Ishni qancha odam so'rayotgani *(30)*

**Reveal:** To'g'ri — ufqni kerak narsaning tayyor bo'lish payti hal qiladi. Nechta odam so'rashi bitta ufq ichida qaysi ishni oldin qilishni aytadi, ufqni esa emas.

> 🔴 **§108 (o'quvchini ROSTNI rad etishga majburlamaslik):** C — M3-D5 da o'rgatilgan foyda-mezoni. Reveal uni **rad etmaydi**, o'z joyiga qo'yadi (ufq ichidagi tartib). Shu bilan ikki dars orasidagi ziddiyat yopiladi.
> 🔴 **§102:** B — s4/s9 da hech qachon vaqt-uzunligi haqida gap bo'lmagan.
> 🔴 **§99/§133:** uchalasi ham «… -shi» bilan tugaydigan bir xil ot-birikma qolipida. Uzunlik: 33 · 33 · 30 (tell 1.10 ✓). Savol 7 so'z ✓.
> 🔴 **§106:** kalit s4 ning 2-bosqich javobidan («xohish emas, kutilayotgan narsa») so'zma-so'z olinmagan — u yerda ko'chirish-savoli, bu yerda joylash-mezoni.

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan (✅ savol oldida turmaydi).
> 🔴 **Kalit-taqsimoti (naqsh-telli taqiqi, §107 oilasi):** **T1 → B (1) · T2 → C (2) · T3 → A (0) · T4 → B (1)** — bitta indeks takrorlanib qolmadi, oxirgi test ham «oxirgi variant» naqshiga tushmadi. Quruvchi `INLINE_KEYS` ni AYNAN shu tartibda yozadi: `{ s3: 1, s5: 2, s7: 0, s11: 1 }`.

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira, ufq ranglarida — 🟢 yozilgani yashil ✓, joriysi indigo-pulsda, kelgusi kulrang-punktir. Doira yonida ufq nomi to'liq: «Hozir» · «Uch oydan keyin» · «Olti oydan keyin».

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida: ufq yorlig'i (rang bilan) → bitta matn maydoni → jonli javob-qatori. Ufqni o'quvchi TANLAMAYDI — u belgilangan tartibda keladi (yaqindan uzoqqa), o'quvchi faqat ishni yozadi. Sabab: artefakt-shakli muhrlangan (`ufq` uch qiymatning har biridan bittadan), va tartib darsning o'z mantig'ini takrorlaydi.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI — faqat indikator chirog'i yonadi; uchtasi ham yozilgach o'ngdagi yo'l to'liq enda ochiladi (✎ tahrir shu yerda). Saqlangan qator ko'rinishi: `🟡 Uch oydan keyin → Doimiy mijozga tabrik yuborish` (strelkali juftlik, s1 demo bilan bir shaklda — korpus §67d).

**Ipuchalar (92c/85 · korpus §32/§115):** `«Bugun qaysi ish boshlanadi?»` · `«Uch oydan keyin qaysi ish boshlanadi?»` · `«Olti oydan keyin qaysi ish boshlanadi?»` — uchalasi bir gap-turida (fe'l-savol); tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q.

**106d javob (ikki tomonlama):** ✅ «Yozildi — bu ish o'z ufqida turibdi.» · 🤔 «Bu ish nimanidir kutyapti. Hozirga bugun boshlanadigan ishni yozing — buni keyingi ufqda yozasiz.»

**Bo'sh-so'zlar ro'yxati** (106d(c), dars o'z lug'atidan): *kerak · yaxshi · muhim · foydali · qulay*. Faqat shular yozilsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

**Kutish-belgilari lug'ati** (qoida-asosidagi tekshiruv — dars o'z so'zlaridan): *ko'p odam · pul · baho · ishonch · bo'lgach · yig'ilgach · to'lgach · ko'paygach*. Bular «Hozir» kartasida topilsa yumshoq hint chiqadi; boshqa ikki kartada esa hech narsa demaydi (ular u yerda kutilgan holat).

**Muvozanat-sharti:** uchinchi karta saqlanayotganda uchala ish ham bugun boshlanadigan bo'lsa — yumshoq hint (blok 4 dagi qator). Bu darsning ikkinchi yarmi: hammasini bugunga yig'ish reja emas.

**Artefakt-yozuvi:** saqlash paytida `pm-m6d12-yol` ga `{ ufqlar: [ {ufq:'hozir', ish}, {ufq:'uch-oy', ish}, {ufq:'olti-oy', ish} ], savedAt }` yoziladi — `ufq` qiymatlari **ASCII**, ekran-matni esa to'liq o'zbekcha nom. Bir tushuncha, ikki ko'rinish (kod ↔ matn).

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K17 · 91b/33/42/43/56 + keys-ekran qoidasi)

**Freym (91b):** eyebrow — **«🚗 Haqiqiy voqea»**, K-kodi ekranga chiqmaydi.

🔴 **Burchak (registr B5):** «uch ufq — bir varaqdagi uzoq reja». Bank K17 ni birinchi marta ishlatyapti, shuning uchun boshqa dars bilan burchak-to'qnashuvi YO'Q.

**Uzluksiz hisoblagich (keys-ekran qoidasi + §130 — yorliq o'z-o'zini tushuntiradi):** slaydlar tepasida yil-yo'li `2006 ─────── o'n yildan ortiq` va bitta jonli hisoblagich — **«✅ Bajarilgan bosqich: 2 / 3»**. Bo'sh holat «—» EMAS → **«hali boshlanmagan»**. `prefers-reduced-motion` da hisoblagich statik yakuniy holatda.

🔴 **Hisoblagich-uzluksizligi va bashorat-spoyleri (aniq tartib — quruvchiga majburiy):**

| Qadam | Hisoblagich holati |
|---|---|
| 1-slayd (2006) va bashorat-1 | **«hali boshlanmagan»** (reja endi e'lon qilingan) |
| 2-slayd | **1 / 3** ga o'sadi |
| **bashorat-2** | **1 / 3 da to'xtab turadi** — javob ekranda ko'rinmaydi (§102/§123) |
| 3-slayd | bashorat javobidan keyin **2 / 3** ga davom etadi |
| 4-slayd | **3 / 3**; ostiga ikkinchi qator qo'shiladi: «reja o'n yildan ortiq bajarildi» |

> 🔴 **§123:** hisoblagich bashorat-2 ning javobini (keyingi mashina **nima bilan** qurilgani) umuman ko'rsatmaydi — u faqat bosqich SONINI sanaydi.

**4 slayd (hikoya tilida — 42-qonun · korpus §42):**

1. **2006-yil.** Tesla o'zining uzoq rejasini bir varaqqa yozdi va uni hammaga ochiq e'lon qildi. O'shanda kompaniyaning bironta mashinasi ko'chada yurmasdi.
2. *(bashorat-1 dan keyin)* **Birinchi bosqich.** Reja qimmat sport-mashinadan boshlandi — u kichik seriyada chiqarildi, ko'p odam uni sotib ololmasdi.
3. *(bashorat-2 dan keyin)* **Ikkinchi bosqich.** Birinchi mashinadan tushgan pulga arzonroq mashina qurildi — endi uni ko'proq odam ola oldi.
4. **Uchinchi bosqich.** O'sha puldan ommaviy mashina qurildi. Bir varaqqa yozilgan reja **o'n yildan ortiq** bajarildi.

**Bashorat-1 (2-slayddan oldin · 1-o'lchov: TARTIB — qaysi mashinadan boshlangan):**
- «Hammabop arzon mashinadan» *(29)*
- «Kichik seriyadagi qimmat mashinadan» ✅ *(35)*
- «Yuk tashiydigan katta mashinadan» *(33)*

**Bashorat-2 (3-slayddan oldin · 2-o'lchov: MANBA — keyingi mashinani nima bilan qurgan):**
- «Bankdan olingan qarz puli bilan» *(31)*
- «Birinchi mashinadan tushgan pul bilan» ✅ *(38)*
- «Boshqa kompaniyaning yordami bilan» *(35)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! …» — quyruqsiz; adashsa «Adashdingiz — asl javob: …». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — to'liq nom bilan, darsga qaytadi):**
> Tesla uch bosqichni bir varaqqa yozdi va har bosqich o'zidan oldingisini kutdi. Sizning tizimingizda ham shunday: bugun boshlanadigan ish bor, kutadigan ish bor. Buni kod emas, mahsulotni o'ylaydigan odam hal qiladi — endi shu reja sizniki.

> 🔴 **10-qonun (keys-sadoqat — tekshirildi):** bankda bor — 2006-yilda reja e'lon qilingani · rejaning ochiqligi · uch bosqich (qimmat sport-mashina kichik seriyada → o'sha pulga arzonroq → o'sha pulga ommaviy) · «o'n yildan ortiq bajarildi». Bank **«raqamsiz»** deb belgilangan: **hech qanday yangi son qo'shilmadi** — 2006 va «o'n yildan ortiq» bankning o'z matnidan. Narx, sotuv, foyda raqamlari YO'Q.
> 🔴 **§101/§124 (chegaralangan inkor):** «kompaniyaning bironta mashinasi ko'chada yurmasdi» — bank kichik seriyadagi sport-mashinani birinchi qadam deb aytadi, ya'ni undan oldin mahsulot yo'q edi; inkor shu bilan chegaralanadi. Rejaning maxfiy nomlanishi, sotuv soni, boshqa modellar — bankda yo'q, ekranga chiqmaydi.
> 🔴 **§132 (bashorat-slaydi javobni oldindan aytmasin):** 1-slayd qaysi mashinadan boshlanganini AYTMAYDI (bashorat-1 uni so'raydi); 2-slayd pul-manbasini aytmaydi (bashorat-2 uni so'raydi).
> 🔴 **§21/§117 (atama ballanadigan matnda tug'ilmaydi):** bashorat-chiplarida izohsiz chet so'z YO'Q — «sport-mashina», «ommaviy mashina» kundalik so'zlar.
> 🔴 **Bashorat halolligi (17/43/64):** har bashorat bitta o'lchovning uch darajasi; hech biri boshqa slaydda rost bo'lib chiqmaydi; «≥2 bashorat ikki o'lchovda» sharti bajarildi (tartib + manba). Uzunlik-tell: bashorat-1 35÷29 = 1.21 ✓ · bashorat-2 38÷31 = 1.23 ✓ (chegara 1.4).
> 🔴 **Ko'prik:** slot-sanog'i yo'q (63) · «mahsulotni o'ylaydigan odam hal qiladi» — M4-D2/M4a-D2 bilan bir xil ibora (kurs bo'ylab bir til).

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · ⌨️ VS Code + terminal)

**Darvoza-mashq (82e):** bitta savol-tanlov: «Kod `reja[3].ufq` ni chiqarsa, terminalda nima ko'rinadi?» → «To'rtinchi ishning ish nomi» *(26)* / «To'rtinchi ishning ufq nomi» ✅ *(26)* / «Rejadagi ufqlarning umumiy soni» *(30)* — §129: uchala variant ham bir turdagi natija-gapi, farq faqat ma'noda. Tell 30÷26 = 1.15 ✓.

**Boshlang'ich kod (`reja.js` — VS Code'da, qo'lda yoziladi):**

```js
// reja.js — sartaroshxona tizimining uch ufqli rejasi
// Kodda ufq nomlarini qisqa yozamiz: hozir, uch-oy, olti-oy
const reja = [
  { ish: "Sartarosh suratlari", ufq: "hozir" },
  { ish: "Eslatma xabari", ufq: "hozir" },
  { ish: "Manzilni ko'rsatish", ufq: "hozir" },
  { ish: "Sartaroshga baho qo'yish", ufq: "uch-oy" },
  { ish: "Band kunlar", ufq: "uch-oy" },
  { ish: "Oldindan to'lash", ufq: "olti-oy" },
];

const ufqlar = ["hozir", "uch-oy", "olti-oy"];

for (let i = 0; i < ufqlar.length; i++) {
  const u = ufqlar[i];

  // 1) ufq nomini chiqaring:
  //    console.log("== " + u + " ==");
  // 2) reja ichida ikkinchi sikl yozing va shu ufqdagi har ishni chiqaring:
  //    const r = reja[j];
  //    console.log("   - " + r.ish);
}
```

Terminal: `node reja.js`

**Kutilgan natija:**

```
== hozir ==
   - Sartarosh suratlari
   - Eslatma xabari
   - Manzilni ko'rsatish
== uch-oy ==
   - Sartaroshga baho qo'yish
   - Band kunlar
== olti-oy ==
   - Oldindan to'lash
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. `node reja.js` uch ufq nomini chiqaradi
2. Har ufq ostida o'z ishlari turadi
3. Ish boshqa ufq ostiga tushmaydi

**YORDAM (yechimni aytmaydi — korpus §77):** Avval bitta ufq nomini qo'lda chiqarib ko'ring. Ishlagach ichiga `reja` bo'yicha aylanadigan ikkinchi siklni qo'shing — har aylanishda bitta ish qo'lingizda bo'ladi.

**YULDUZCHA:** Har ufq nomi yonida ish sonini chiqaring: `== hozir (3 ta) ==`.

> 🔴 **Sanoq-mosligi (22-qonun):** massivdagi oltita ish — s4 ning AYNAN o'sha oltiligi, va ufq-taqsimoti ham o'sha: 3 · 2 · 1 (korpus §95: raqamning manbasi o'quvchiga tanish, u yo'lni o'z qo'li bilan qurgan).
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`reja` · `ish` · `ufq` · `ufqlar` · `reja.js`): kalitlar artefaktdagi `ufq` qiymatlari bilan **so'zma-so'z bir xil** (`hozir` · `uch-oy` · `olti-oy`) — bola kodda o'zi yozgan rejaning shaklini ko'radi.
> 🔴 **§135-D (bir tirnoqli starter taqiqi):** matn-qiymatlari **qo'shtirnoqda** — «Manzilni ko'rsatish», «Sartaroshga baho qo'yish», «Oldindan to'lash» ichida apostrof bor; bitta tirnoq ishlatilsa kod sinardi.
> 🔴 **87-qonun:** massiv, obyekt, `for`, `if`, `===`, `.length`, matn qo'shish `+`, `console.log` — M2 materiali; `node fayl.js` — M4 da. `filter` bilan yozgan o'quvchiga ham ruxsat (M3 da o'tilgan), ikkala yo'l ham shartni bajaradi.
> 🔴 **Pedagogik ulanish (87c):** mentor ochiq aytadi — s4 va s9 da qo'l bilan qo'yilgan ish endi kodda `ufq` qiymati bo'lib turibdi.
> 🔴 **40-qonun (3 holat):** massiv boshidanoq to'liq — o'quvchi hech narsa yozmagan bo'lsa ham natija chiqadi, singan ekran yo'q.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qator CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo-uchlik s4/s9 to'plamlariga KIRMAYDI · «ufq» so'zi ekranda 0 (§126) |
| **s12 REFLEKSIYA** | Sarlavha: «Uch qatoringizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga» |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha — platformaning odatiy «O'zingizni sinab ko'ring.» (bu darsda «sin-» ildizi band emas) |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Ishlar qachon boshlanishiga qarab bo'lingan bo'lak — ufq.» · «Ish o'zi kutgan narsa tayyor bo'lganda boshlanadi.» · «Yaqin ufqda ish ko'p turadi, uzoq ufqda esa oz.» · «Uzoq rejani kod emas, mahsulotni o'ylaydigan odam yozadi.» |
| **Platforma-matnlari** | 🔴 §130 (ildiz platforma-matnida): bu darsning ildizlari — `ufq` · `boshlan` · `kut` · `reja`. Loader/podium/yakun matnlarida ular boshqa ma'noda turmasin (❌ «Natijangiz kutilmoqda…» → ✅ «Natijangiz kelmoqda…») |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | Ufq nima? | s2 |
| 2 | Rejada nechta ufq bor? | s2 |
| 3 | Ishni ufqqa nima qo'yadi? | s4 + s11 |
| 4 | «Sartaroshga baho qo'yish» nega bugun boshlanmagan? | s4 + s5 |
| 5 | «Sartarosh suratlari» nega bugun boshlangan? | s4 |
| 6 | «Olti oydan keyin» ufqi ishning nimasini aytadi? | s3 |
| 7 | Uzoq ufqdagi ishni yaqinroqqa ko'chirsangiz nima bo'ladi? | s4 (2-bosqich) |
| 8 | Qaysi ufqda ish ko'p turadi? | s9 |
| 9 | Tesla rejasi qaysi mashinadan boshlangan? | s6 |
| 10 | Tesla keyingi mashinani nima bilan qurgan? | s6 |
| 11 | Tesla o'z rejasi bilan nima qilgan? | s6 |
| 12 | Uzoq rejani kim yozadi? | s6 + s15 |

> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q — «roadmap», «backlog», «sprint», «milestone» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «ufq», «reja», «ish», «boshlanadi», «kutadi» so'zlari bilan.
> 🔴 **§114 (fon-dekor so'zlari darsning o'z lug'atidan):** arena-canvas tokenlari — `ufq · reja · ish · yo'l · boshlanadi`; oldingi darslarning so'zlari (`shart · signal · nosozlik · navbat-hisobi`) qolmasin.
> 🔴 **§134:** rang-holatiga tayangan variant YO'Q — yo'l ranglari ma'nosi o'quvchi matnida o'rgatilgan bo'lsa ham, arena savoli rangni emas, HODISAni so'raydi.
> 🔴 9- va 11-savollar bank-faktini so'raydi (§124), 12-savol esa ko'prik-gapdagi xulosani — u ballanadigan matn, shuning uchun javob varianti «mahsulotni o'ylaydigan odam» (dars bo'ylab bir xil ibora).

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Road Builder!** | Uch ufq yo'lini oxirigacha yurdingiz | 34 | s4: oltala ish bosildi + 2-bosqichga javob berildi |
| **Plan Writer!** | Uch ufqqa uchta ishni yozdingiz | 32 | s8: 3/3 saqlandi |
| **Horizon Master!** | Oltita ishni ufqlarga joyladingiz | 33 | s9: oltalasi ham qo'yildi |
| **Code Planner!** | Rejani kod bilan ufqlarga ajratdingiz | 37 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 32–37 belgi (§63 oralig'i) ✓.
> 🔴 **§100 (omonim-tekshiruvi):** «Road», «Plan», «Horizon», «Code» (metodist: «Sorter» → «Master» — «saralash/tartiblash» ma'nosi darsning «tartibga solmaymiz» intizomiga zid edi) — kursning texnik lug'atida boshqa ma'no bermaydi ✓; to'rt nomning hech biri takrorlanmaydi.
> 🔴 **§133/§130 (nishon-desc faqat REAL tekshirilgan ishni aytadi):** «joyladingiz» — s9 da nishon xato javobda ham beriladi (javob doim ochiladi), shuning uchun tavsif «to'g'ri topdingiz» DEMAYDI. «Yurdingiz» — s4 da chindan bajarilgan harakat.
> 🔴 **§93:** har tavsif ekranda chindan bajarilgan harakatni aytadi.

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan · §132: old tomon inglizcha nom so'ramaydi)

| # | Savol | Javob |
|---|---|---|
| 1 | Ufq nima? | Ishlar qachon boshlanishiga qarab bo'lingan bo'lak |
| 2 | Rejada nechta ufq bor? | Uchta: hozir · uch oydan keyin · olti oydan keyin |
| 3 | Ishni ufqqa nima qo'yadi? | Unga kerak narsa qachon tayyor bo'lishi |
| 4 | Ish qachon boshlanadi? | O'zi kutgan narsa tayyor bo'lganda |
| 5 | «Olti oydan keyin» ufqi nimani bildiradi? | Ish olti oydan keyin boshlanadi — olti oy davom etmaydi |
| 6 | Qaysi ufqda ish ko'p turadi? | Eng yaqinida — «hozir» ufqida |
| 7 | «Hozir» ufqiga qanday ish yoziladi? | Bugun boshlanadigani — hech narsa kutmaydigani |
| 8 | Tesla rejasi qaysi mashinadan boshlangan? | Kichik seriyadagi qimmat sport-mashinadan (2006) |
| 9 | Tesla keyingi mashinani nima bilan qurgan? | Birinchi mashinadan tushgan pul bilan |
| 10 | Uch ufqli uzoq reja qanday ataladi? | Yo'l-xarita (inglizchasi — roadmap) |

> 🔴 **Korpus §20/§52📌:** 1-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **§132:** 10-karta old tomoni **tushunchani** so'raydi, «inglizcha nomi nima?» demaydi; inglizcha juftlik javobda qavsda turadi.
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ta'rif · uch ufq · joylash-mezoni · boshlanish-qoidasi · davomiylik farqi · yaqin-uzoq shakli · «hozir» ufqining sharti · keys-tartibi · keys-manbasi · inglizcha juftlik).
> 🔴 **Inglizcha atama faqat 10-kartada** — dars ichida «roadmap» boshqa hech qayerda yo'q (korpus §20).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Ufq — ishning boshlanish payti»** — (1) kanonik ta'rif · (2) ufq ishning uzunligini emas, boshlanishini aytadi · (3) sinfga savol
**s5 · «Ish kutgan narsasini kutadi»** — (1) ish o'zi kutgan narsa tayyor bo'lganda boshlanadi · (2) baho qo'yish real navbatlarni kutadi · (3) savol
**s7 · «Uzoq reja bir varaqqa sig'adi»** — (1) Tesla uch bosqichni bir varaqqa yozdi va ochiq e'lon qildi (2006) · (2) reja o'n yildan ortiq bajarildi · (3) savol
**s11 · «Ufqni kerak narsa hal qiladi»** — (1) ishni ufqqa unga kerak narsaning payti qo'yadi · (2) nechta odam so'rashi bitta ufq ichidagi tartibni aytadi · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** ❌ «K17 xulosasi» → «Tesla misolida».
> 🔴 **§133 (xulosa-bandi keyingi test kalitiga aylanmasin):** s5 recapidagi 2-band ish-darajasida qoladi; s11 kaliti recapga s11 dan KEYIN chiqadi, oldin emas.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K17** — M6 modulida ishlatilmagan; bankda umuman birinchi marta ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — m6-02 katak-tekshiruv · m6-06 oqibat-juftlash · **m6-12 ufq-joylash** ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): sartaroshxona navbati tizimi — s0 dan s15 gacha; keys 91b freymi bilan kiradi va ko'prik bilan qaytadi ✓
- 95 (Toshkent o'smiri): sartaroshxona — o'smir u yerga O'ZI boradi, navbatni o'zi so'raydi ✓
- 96c (ip o'quvchining artefaktida): s8 va uy-vazifa o'quvchining O'Z tizimida; demo-tizim faqat mashq-materiali ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas (grep bilan tasdiqlandi — shapka) ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham yangi; Timeline/ikki o'qli doska farq-dalili 1-bo'limda faylma-fayl yozilgan ✓
- 87 (o'tilgan material): koding faqat M2 (massiv · obyekt · `for` · `if` · `+`) va M4 (`node fayl.js`) materiali ✓
- 29 (kelajak-atama oqmaydi): «RICE», «metrika», «pitch», «slayd», «backlog», «sprint» o'quvchi matnida **0** ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104/§119: hook ikki tanlovi teng (38 ↔ 39 belgi), payoff hech bir tanlovni yolg'onga chiqarmaydi ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda 1 gap); dars **bitta yangi atama** bilan yuradi ✓
- 92d: majburiy maydonlar faqat o'quvchida ANIQ bor ma'lumot uchun (ish nomi — uning O'Z tizimidan) ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN o'qildi — §99–136 bilan birga):**
1. **§20/§80/§85:** «ufq» yagona nom, kanonik ta'rif 5 yuzada so'zma-so'z; «roadmap / yo'l-xarita» o'quvchi ekranida 0 (flashcard-10 dan tashqari) ✓
2. **§99/§133:** har testda variantlar bir qolipda va bir tinish-shaklda (T1 «Uni olti oy…» · T2 «U/Unga/Undan…» · T3 «Uni …gan» · T4 «…-shi») ✓
3. **§102:** distraktorlar darsning biror ekranida rost bo'lib ko'rinmaydi (T1-A/C · T2-A/B · T3-B · T4-A tekshirildi) ✓
4. **§105/§121 (kalit so'z bir ma'noda):** «ish» — faqat rejadagi bo'lak («ishlayapti / ishga tushirish» 0) · «kutadi» — faqat ishning kutishi (demo-tizimda odam «navbat oladi», «kutmaydi») · «xarita» — faqat flashcard-10 javobida ✓
5. **§106/§129:** T1 ta'rifni QO'LLATADI · T2 formulasi s4 da yozilmagan · T3 bank-faktini so'raydi, xulosa reveal'da · T4 kaliti s4 ning 2-bosqich matnidan boshqa so'zlar bilan ✓
6. **§107 (shakl-telli):** ha/yo'q-savol yo'q; kalit-indekslari 1 · 2 · 0 · 1 — naqsh yo'q ✓
7. **§108:** hech bir savol rostni rad ettirmaydi — T4 revealı M3-D5 foyda-mezonini rad etmay, o'z joyiga qo'yadi ✓
8. **§109:** bosh ta'rif zamon-iborasi bilan («qachon boshlanishiga qarab») ✓
9. **§110/§118:** mutlaq so'z bir variantdan oshmaydi; kulgili-bo'sh variant yo'q; cheklov-so'zi bilan halollangan test yo'q ✓
10. **§111:** «degan javob» qurilmasi 0 ✓
11. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi to'rtinchi ish to'xtagandan KEYIN; s9 eslatmasi sabab-qatori ochilgach) ✓
12. **§114:** arena-fon/dekor so'zlari shu dars lug'atidan (ufq · reja · ish · yo'l · boshlanadi) — quruvchiga brifda ✓
13. **§115:** ipuchalar bir gap-turida (uchala placeholder fe'l-savol); uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?») ✓
14. **§116:** s9 YORDAM-savoli oltala ishning to'g'ri javobiga olib boradi ✓
15. **§117:** metafora-so'z ballanadigan matnda tug'ilmaydi; yo'nalish-fe'llari real yo'nalishda; kesik omonim yo'q ✓
16. **§119:** hook payoffi ikkala tanlovni ham rad etmaydi, ikkalasiga bir xil yangilik qo'shadi ✓
17. **§122/§124:** K17 «raqamsiz» — yangi son qo'shilmadi; ball-javob (T3) sof bank-fakti, xulosa revealda ✓
18. **§123/§132:** bashorat-chipida izohsiz atama yo'q; bashorat-slaydlari javobni oldindan aytmaydi; hisoblagich bashorat-2 gacha 1/3 da to'xtaydi ✓
19. **§126/§131:** «ufq» s1 maqsad-ekranida ham, s2 karta-yorliqlarida ham YO'Q — u s2 xulosasida tug'iladi ✓
20. **§127:** dars atamasi yagona to'g'ri variantda yashamaydi — T1/T4 da atama savol-o'zagida, variantlarda umumiy so'zlar ✓
21. **§128:** s1 demo-namunasi darsning O'Z qoidasidan o'tadi (uchala qator tekshirildi); shart-yorliqlari darak gapda ✓
22. **§130:** hisoblagich yorlig'i o'z-o'zini tushuntiradi («✅ Bajarilgan bosqich: 2 / 3», bo'sh holat «hali boshlanmagan»); ✅-qatori faqat rost gapni aytadi; ildiz platforma-matnida ham tekshiriladi ✓
23. **§134/§135-C:** rangga ma'no yuklandi → legenda o'quvchi matnida (🟢/🟡/🔵 + to'liq nom); rang-holatiga tayangan distraktor YO'Q ✓
24. **§135-A:** sonli da'volar ekrandagi belgilarga mos (s4: 3+2+1 = oltita ish); s9 sahnasi va sabab-qatorlari zid emas ✓
25. **§135-B:** dars lug'atining har atamasi ta'riflangan — «ufq» s2 da, uch ufq nomi s2/s4 da; ta'rifsiz atama yo'q ✓
26. **§135-D:** boshlang'ich kod qo'shtirnoqda — apostrofli o'zbek matni kodni sindirmaydi ✓
27. **§136 / MATN_ETALONI 7-C:** ovoz-testi o'tkazildi — 7-C.2 jadvalidagi kantselyarit qoliplari 0 · 7-C.3 dagi sheva-shakl va gap-oxiri yuklamalari 0 · 7-C.1 registri faqat «siz» ✓ (til-lint 87 qoida bilan tasdiqlandi)
28. **§40:** «tizimingiz» M6 texnik darslari bilan tekshirilgan (jadval 0-bo'limda); demo-tizim hech qachon «tizimingiz» emas ✓
29. **§69:** kirish-artefakt jim zaxira — «topilmadi / saqlanmagan / bo'sh» 0 ✓
30. **§97:** «ko'pchilik / sinf / ovozlar» o'quvchi matnida 0 ✓
31. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo-qator (s1) · 2 karta (s2) · 6 ish + 3 ufq (s4) · 4 slayd + 2 bashorat (s6) · 3 ish (s8/s12/uy-vazifa) · 6 ish + 3 ufq (s9) · 6 ish + 3 ufq (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
32. **Ekran-prozalari (Intl.Segmenter bilan qayta o'lchandi — metodist raundi):** s0 323 · s1 194 · s2 349 · s4 228 · s8 87 · s9 178 · s10 161 grapheme (chegara 400) ✓

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**
**(a) Umumiy:** `npm run lint:til src/6-Modull/PmLesson24.jsx` → **0 error** shart (87 qoida).

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M6-D12 ga tegishli):
`roadmap` · `yo'l-xarita` · `xarita` (flashcard-10 javobidan tashqari **0**) ·
`RICE` · `ICE` · `prioritet` · `backlog` · `sprint` · `epic` · `deadline` · `kvartal` · `strategiya` · `master-plan` (29-qonun **0**) ·
`metrika` · `pitch` · `slayd` (m6-14 atamalari — **0**) ·
`arxitektura` · `pipeline` · `Skill` · `mikroservis` · `MVC` · `Native` · `Expo` (109 TMI — o'quvchi matnida **0**) ·
`tartibga sol` · `ketma-ketlik` (Timeline lug'ati — **0**) ·
`ishlayapti` · `ishga tushir` (§105 — «ish» faqat rejadagi bo'lak) ·
`yuklanmoqda` · `kutilmoqda` (§130 — ildiz platforma-matnida boshqa ma'noda turmasin) ·
`3 oy` · `6 oy` (qisqartma **0** — ekranda «uch oydan keyin» / «olti oydan keyin») ·
`masofa` (**0** — ufq vaqt bilan tushuntiriladi) ·
`ko'pchilik` · `ovozlar` (§97) · `ball emas` · `degandingiz` (100-qonun) ·
`topilmadi` · `saqlanmagan` (§69) · `saytingiz` · `Demo Day` (§40) ·
`chala` · `shunchaki` · `g'alati` · `buzuq` (MATN_ETALONI 7-B.3) ·
`keyingi darsda` (73-qonun) ·
`Musk` — 🔴 ATAYLAB yo'q: bank uni tilga oladi, lekin dars kompaniyaning QARORI haqida; shaxs-fokusi kiritilmaydi (10-qonun ruhi).

---

## 13-A. METODIST-KORREKTURA (2026-08-19 · F-0819-12 · senariy-bosqichi)

> Quruvchidan OLDINGI til/pedagogika raundi. Kalit-indekslar (to'g'ri javob POZITSIYASI) **tegilmadi** —
> T1 B · T2 C · T3 A · T4 B o'z joyida qoldi; mexanika-tuzilmasi, ekran soni va artefakt-shakli ham
> o'zgarmadi. Faqat MATN tuzatildi.

**A · Atama-intizomi (bu darsning eng nozik joyi)**
1. 🔴 **«bekat» o'quvchi matnidan chiqarildi.** Dars bitta yangi atama bilan yuraman deb turib, aynan
   o'sha tushunchani ikkinchi nom bilan ham atayotgan edi: yo'ldagi uch nuqta gohida «ufq», gohida
   «bekat» («pastda yo'l va uch **bekat**» · «o'z **bekatida** turibdi» · «uch **bekatdan** biriga
   qo'yadi» · arena fon-so'zi). Ikkalasi hech qayerda tenglashtirilmagan — ya'ni **ta'rifsiz ikkinchi
   atama** (§135-B + §80). Endi o'quvchi ko'radigan hamma yuzada faqat **ufq**; «bekat» faqat senariy
   izohlarida (vizual tavsifi) qoldi.
2. 🔴 **«ufq» so'zining O'ZI ochilmagan edi.** Kanonik ta'rif bor edi, lekin nega aynan «ufq» degan nom —
   hech qayerda aytilmagan (ETALON 41: yordamchi so'zning o'zi tushunarli bo'lsin). s2 xulosa-kartasiga
   bitta yetakchi gap qo'shildi: «Uzoqqa qarasangiz, ko'z yetadigan eng olis joy — ufq. Rejada ham yaqini
   va uzog'i bor.» — keyin kanonik ta'rif so'zma-so'z o'z holicha turadi.
3. **s1 demo yorlig'i «Bugun →» → «Hozir →»** — birinchi ufqning nomi butun darsda «Hozir»; «bugun»
   ergash so'z bo'lib qoladi («bugun boshlanadi»), lekin YORLIQ bo'lib turmaydi (§80).

**B · Test-halolligi (kalitlar tegilmadi, matn tuzatildi)**
4. 🔴 **T1 savol o'zagi kalitni so'zma-so'z qaytarardi:** «Rejadagi ish **"Olti oydan keyin"** ufqiga
   tushdi…» ↔ kalit «Uni **olti oydan keyin** boshlaymiz». So'z-echo bilan kalit tushunmasdan topilardi
   (§129/§134). → savol: «Rejadagi ish **eng uzoq ufqqa** tushdi. Bu nimani bildiradi?» Variantlar
   o'zgarmadi (uchalasida ham «olti oy» bor — §135-C).
5. 🔴 **Ikki test kaliti bitta ibora bilan belgilanib qolgan edi:** T2 kaliti «Unga **kerak narsa** hali
   paydo bo'lmagan» va T4 kaliti «**Kerak narsa** qachon tayyor bo'lishi» — hech bir distraktorda bu
   ibora yo'q edi, ya'ni «kerak narsa» yozilgan variant = to'g'ri javob (§135-C so'z-telli, ikki test
   bo'ylab). T2 kaliti darsning O'Z fe'liga o'girildi: «**U kutayotgan narsa** hali paydo bo'lmagan»
   (39 · 37 · 29 → tell 1.34 ✓). T4 tegilmadi.
6. **T2 izohidagi harf-adashuvi tuzatildi:** izoh «B — vaqt haqida, C — foyda-mezoni» deb yozilgan edi,
   holbuki C — KALIT. Quruvchi shu izohga qarab variantni almashtirib yuborishi mumkin edi.

**C · Matn ↔ ekran zidligi (§135-A)**
7. 🔴 **s9 sahnasi o'z sabab-qatoriga zid edi:** «Sartaroshxona tizimida **yarim yil** o'tdi, har kuni
   navbatlar tushyapti» ↔ 🎁 chegirma ishining sababi «uchinchi tashrif kerak — **ko'pchilik bir marta
   kelgan**». Soch har oy oldiriladi: yarim yilda odam uch marta ham kelib ulgurardi, ya'ni ish
   allaqachon «Hozir» ufqiga tushardi. → sahna «**ochilganiga bir necha oy bo'ldi … birinchi baholar
   endi kelyapti**», sabab «ko'pchilik hozircha **bir-ikki marta** kelgan». MENTORGA va §135-A izohi ham
   shu holatga tortildi.
8. 🔴 **s8 javob-qatori ko'rinmaydigan narsani aytardi:** «Yozildi — bu ish endi **yo'lda o'z bekatida**
   turibdi», holbuki 80c bo'yicha yo'l faqat uchala ish yozilgach ochiladi. → «Yozildi — bu ish **o'z
   ufqida** turibdi» (ufq yorlig'i kartaning o'zida turibdi — rost gap).
9. **s1 EKRAN referentsiz edi:** «o'z tizimingiz uchun reja yozib olasiz» deyilardi, ekranda esa
   sartaroshxona qatorlari yozilardi — bola «bu mening rejammi?» degan savolga tushardi (§24). →
   «**Bu — sartaroshxonaga navbat oladigan ilovaning rejasi.** Dars oxirida o'z tizimingiz uchun shunday
   uch qator yozasiz…» (demo-tizim ham shu yerda birinchi marta tanishtiriladi).

**D · Qoida o'z mexanikasiga zid bo'lmasin**
10. 🔴 **«mayda ↔ yirik» o'lchovi darsning O'Z qoidasini buzardi.** s9 yakuni, flashcard-6, arena-8 va
    s15 qatori «Yaqin ufqda ko'p va **mayda** ish, uzoq ufqda bitta va **yirik** ish» deyardi — bu
    ikkinchi, o'rgatilmagan mezon (ish HAJMI) va u T4 kalitiga ochiq zid («ufqni kerak narsaning payti
    hal qiladi»); ustiga s4 da uzoq ufqdagi ish («oldindan to'lash») boshqalardan yirik emas — ekranda
    ham rost emas edi (34-qonun + §135-A). To'rt yuzada ham faqat SON qoldi: «Yaqin ufqda ish ko'p
    turadi, uzoq ufqda esa oz».
11. 🔴 **Hook yolg'on shart qo'yardi:** «lekin bugun **bittasidan** boshlaysiz» — darsning javobi esa
    bugun UCHTA ish boshlanishi. → «lekin **hammasini birdan boshlab bo'lmaydi**». Ikki tanlov va payoff
    tegilmadi (§119 saqlandi).
12. **Nishon nomi «Horizon Sorter!» → «Horizon Master!»:** «sort» = saralash/tartiblash, ya'ni aynan dars
    rad etadigan harakat (bu darsda ish tartibga solinmaydi, ufqqa qo'yiladi).
13. **s4 2-bosqich javobi aniqlashtirildi:** «ishni ufqqa **xohish** emas, kutilayotgan narsa qo'yadi» →
    «ishni ufqqa **bizning xohishimiz** emas, **uning kutayotgan narsasi** qo'yadi» (43-qonun: egasi
    ko'rinadigan gap).

**E · Koding, flashcard va mayda til-sayqali**
14. 🔴 **Starterdagi jim tuzoq:** izoh o'quvchini `console.log("   - " + r.ish)` yozishga chaqirardi,
    lekin `r` qayerdan kelishi hech qayerda aytilmagan — bola `r is not defined` xatosiga urilardi. →
    izoh endi ichki siklni ochiq aytadi (`const r = reja[j];`), YORDAM matni ham shunga tortildi.
    Tirnoq-tuzog'i yo'q: matn-qiymatlar qo'shtirnoqda ✓ (§135-D).
15. **Terminaldagi `uch-oy` / `olti-oy` endi izohlangan:** faylning birinchi qatoriga «Kodda ufq nomlarini
    qisqa yozamiz: hozir, uch-oy, olti-oy» qo'shildi — ekranda «3 oy» qisqartmasi taqiq bo'lgani holda,
    terminaldagi qisqartma hech qayerda tushuntirilmagan edi.
16. 🔴 **Flashcard-7 darsda o'rgatilmagan qoidani so'rardi:** «Uzoq ufqdagi ish qanday yoziladi? → Bitta
    qator bilan: nima qilinishi hali aniq emas» — bunday gap hech bir ekranda yo'q (§90f/§135-B). →
    «"Hozir" ufqiga qanday ish yoziladi? → Bugun boshlanadigani — hech narsa kutmaydigani» (s4 · s8
    checklisti · s9 — uchtasida ham o'rgatilgan).
17. **Fe'l-intizomi o'z senariysida buzilgan edi:** s8 hinti «Uni keyingi ufqqa **qoldiring**» — taqiq
    ro'yxatidagi «qoladi» oilasi. → «Hozirga bugun boshlanadigan ishni yozing — buni keyingi ufqda
    yozasiz». Yana: «boshqasini **oling**» → «boshqa ish **yozing**».
18. **SOFT ichidagi sen-forma:** juftlik savoli «olti oydagi **ishing** nimani kutyapti?» → «**ishingiz**»
    (7-qonun; o'z-tekshiruvda «Sen murojaati — 0 ✓» deb turgan edi). Uy-vazifa RO'YXATining uchinchi
    bandi darak gapga tortildi: «"Hozir" ishi bugun boshlanadigan ish» → «"Hozir" ishi bugun boshlanadi»
    (§128).

**F · Qayta o'lchandi (Intl.Segmenter):** s0 323 · s1 194 · s2 349 · s4 228 · s8 87 · s9 178 · s10 161
grapheme (chegara 400 ✓ — eng to'lasi s2, yangi yetakchi gap bilan ham 349). Variant-telllari: T1 1.11 ·
T2 1.34 · T3 1.06 · T4 1.10 · darvoza 1.15 · bashorat-1 1.21 · bashorat-2 1.23 (chegara 1.4 ✓). Nishon
tavsiflari 32–37 belgi ✓. `node til-lint.mjs pm-senariylar/M6-D12-Roadmap.md` — **0 error**; qolgan
warn'lar senariy-annotatsiyasiga tegishli (PM_Prompt formatidagi «YADRO» blok-nomi · «keyingi darsda»
TAQIQINI eslatuvchi qatorlar · o'z-tekshiruvdagi «Sen murojaati — 0» · `useTurnWalk` puls-izohi · shu
13-A bo'limidagi ❌-iqtiboslar) — ularning bittasi ham o'quvchi ekraniga chiqmaydi.

**G · 🟡 QURUVCHIGA BRIF (matn emas, ov-bandlari):**
- ekranda «bekat» so'zi 0 · «Bugun» YORLIQ sifatida 0 (ergash so'z bo'lib qoladi);
- arena Q3/Q4/Q5 variantlarini yozganda «kut-» ildizi faqat to'g'ri javobda qolmasin (§135-C) —
  distraktorlarga ham tarqating;
- «navbat» bu darsda demo-olamning so'zi (sartaroshga navbat); UI'dagi yurish-pulsi hech qayerda
  «navbatingiz» deb yozilmasin (§105 ikki ma'no);
- RECAPS s11 va flashcard-3 «kerak narsa» iborasini saqlaydi (T4 bilan bir tilda), T2 esa «kutayotgan
  narsa» — bu ATAYLAB, ikkala testda kalit bitta so'z bilan belgilanmasin uchun.

---

## 14. ⚠️ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq, 2026-08-19)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi.

1. 🔴 **DARS SARLAVHASI VA SUB.** `App.jsx` `m6-12`: title «Roadmap: rejalashtirish» · sub «hozir / 3 oy / 6 oy — nimani oldin?». Registr R3-8 bandi sub'dagi **«RICE»** ni almashtirishni buyurgan edi — hozirgi sub'da RICE yo'q, lekin **«Roadmap»** title'da qolgan (kalka, korpus §20) va sub «3 oy / 6 oy» qisqartmasini beryapti (dars «uch oydan keyin» deydi). **Taklif:** title → **«Bugun qaysi ish boshlanadi?»** · sub → **«uch ufq: hozir, uch oydan keyin, olti oydan keyin»**. Tasdiqlaysizmi?

2. 🔴 **BOSH ATAMA «UFQ».** Butun dars bitta yangi atama bilan yuradi: **ufq** (hozir · uch oydan keyin · olti oydan keyin). Inglizcha juftlik faqat flashcard-10 da («Yo'l-xarita — roadmap»). Sabab: «ufq» — maktabdan tanish o'zbek so'zi, yo'l-vizuali uni bir qarashda ochadi, va artefakt-kaliti (`ufq`) registrda allaqachon muhrlangan. Rozimisiz — yoki «bosqich» kabi boshqa so'z ko'rilsinmi?

3. 🔴 **DEMO-OLAM: ✂️ «SARTAROSHXONA NAVBATI» TIZIMI.** B5 pasporti olamni «o'quvchining O'Z to'liq tizimi» deb bergan; imzo-vizual va tekshiruv esa **aniq** ishlar to'plamini talab qiladi, shuning uchun M4-D15 pretsedenti bo'yicha ikki qatlam olindi: demo-tizim (s0–s4, s9, s10) + o'quvchining O'Z tizimi (s8, uy-vazifa). 96c(e) grepi toza (shapka). 🟡 **Bosh-agentga:** B5 ning qolgan uch senariysi (m6-02 · m6-06 · m6-14) bilan demo-olam to'qnashuvi kesib tekshirilsin. Tasdiqlaysizmi?

4. 🔴 **s4 IKKI BOSQICHLI.** Pasportdagi imzo-vizual («UCH UFQ YO'LI — hozir/3 oy/6 oy yo'l-xaritasi») 1-bosqichda aynan bajarildi: o'quvchi har ishni «▶ Bugun boshlash» bilan sinab ko'radi, to'xtaganlari o'zi bekatiga boradi va yo'l quriladi. Men unga **2-bosqich** qo'shdim: «olti oydagi ishni uch oyga ko'chirsangiz nima bo'ladi?» qarori. Sabab: yo'lni KO'RISH hali qaror emas — dars mavzusi «nimani oldin?» degan QAROR. Qo'shimcha tasdiqlaysizmi?

5. 🟡 **s4 va s9 MEXANIKA-CHEGARASI.** s4 da harakat — **bugun boshlab ko'rish** (yo'l o'zi quriladi, kashfiyot); s9 da harakat — **ufqqa qo'yish** (o'quvchi qoidani o'zi qo'llaydi, yangi oltilik, bir necha oydan keyingi sahna). Ikkalasi bir mexanikaga aylanib qolmasligi uchun shunday ajratildi. Yetarlimi — yoki s9 boshqa primitivga (masalan tayyor rejadan xato ufqni topish) o'tkazilsinmi?

6. 🟡 **s9 TAQSIMOTI 3 / 2 / 1.** s4 ham, s9 ham «yaqin ufqda uch ish, keyin ikki, keyin bitta» shaklida. Bu **ataylab**: shakl darsning ikkinchi kashfiyoti (s9 yakun-qatori uni ochiq aytadi), va s4 da bu shakl OLDINDAN aytilmaydi (yakun-qatori faqat qoidani beradi), ya'ni s9 da sanab topib bo'lmaydi. Rozimisiz — yoki s9 taqsimoti 2/3/1 ga o'zgartirilsinmi?

7. 🔴 **ARTEFAKT SHAKLI (muhrlangan — o'zgartirilmadi).** `pm-m6d12-yol = { ufqlar: [{ufq, ish} × 3], savedAt }`, `ufq` ∈ `hozir` · `uch-oy` · `olti-oy`. 🟡 **Taklif (registrga):** uzoq ufqdagi ish nimani kutayotgani hozir faqat ekranda so'raladi (YULDUZCHA), artefaktda saqlanmaydi — m6-14 uni ishlatmoqchi bo'lsa, uchinchi ixtiyoriy maydon `kutadi` qo'shish mumkin. Shakl hozirgicha qolsinmi?

8. 🟡 **s8 DA UFQNI O'QUVCHI TANLAMAYDI.** Uch karta belgilangan tartibda keladi (Hozir → Uch oydan keyin → Olti oydan keyin), o'quvchi faqat ishni yozadi. Sabab: artefakt-shakli uch ufqning har biridan bittasini talab qiladi, va tartib darsning o'z mantig'ini (yaqindan uzoqqa) takrorlaydi. Rozimisiz — yoki o'quvchi ishni yozib, ufqni O'ZI tanlasinmi (unda uchta ufq to'lishi kafolatlanmaydi)?

9. 🔴 **K17 RAQAM-SIYOSATI.** Bank «raqamsiz» deb belgilangan; senariyda faqat **2006-yil** va **«o'n yildan ortiq»** bor — ikkalasi ham bank matnining o'zidan. Narx, sotuv soni, model nomlari YO'Q. Jonli hisoblagich pul emas, **bosqich** sanaydi («✅ Bajarilgan bosqich: 2 / 3»). Tasdiqlaysizmi?

10. 🟡 **KEYSDA SHAXS NOMI YO'Q.** Bank rejani e'lon qilgan odamni nomlaydi; senariy esa faqat **«Tesla»** deydi — dars kompaniyaning QARORI haqida, shaxs-fokusi darsga hech narsa qo'shmaydi (10-qonun ruhi + personaj-taqiq ruhi). Rozimisiz — yoki 1-slaydda ism aytilsinmi?

11. 🔴 **TIMELINE / IKKI O'QLI DOSKA FARQ-DALILI (pasport majburiy bandi).** `src/3-Modull/PmLesson9.jsx` (Screen9: bitta ishning 5 qadami, bitta chiziq, tartib = javob) va `src/3-Modull/PmLesson8.jsx` (ikki o'q: `foyda` × `vaqt` → 4 katak, natijada «kerak emas» kartasi bor) ochib tekshirildi; farq 1-bo'lim (a)/(b) bandlarida yozildi: **obyekt** (qadam ↔ mustaqil ish), **o'lchov** (nima birinchi qilinadi / qaysi ish qimmatliroq ↔ bu ish qachon MUMKIN), **natija** (bitta chiziq / to'rt katak ↔ uch bekat, bekat ichida tartib yo'q, hech narsa tashlanmaydi). Bu dalil yetarlimi?

12. 🟡 **TEST-4 REVEALI M3-D5 BILAN ZIDDIYATNI YOPADI.** «Nechta odam so'rashi bitta ufq ichida qaysi ishni oldin qilishni aytadi, ufqni esa emas» — §108 bo'yicha o'quvchi rost bilgan narsani rad etmaydi, u boshqa qavatga qo'yiladi. Shu shakl tasdiqlansinmi — yoki foyda-mezoni bu darsda umuman tilga olinmasinmi?

13. 🟡 **UY-VAZIFA O'QUVCHINING O'Z TIZIMIDA QOLADI** (demo-tizimga ko'chirilmaydi). Sabab: 96c — modul-ipi o'quvchining artefaktida yuradi, va chiqish-artefakt m6-14 ga o'tadi. Rozimisiz?

**Metodist raundi qo'shgan savollar (2026-08-19 · F-0819-12):**

14. 🔴 **«UFQ» SO'ZI ENDI KUNDALIK MA'NOSI BILAN OCHILADI.** s2 xulosa-kartasiga bitta yetakchi gap
    qo'shildi: «Uzoqqa qarasangiz, ko'z yetadigan eng olis joy — ufq. Rejada ham yaqini va uzog'i bor.»
    Sabab: nom tanlovi o'quvchi uchun asossiz qolayotgan edi — ta'rif bor, lekin NEGA «ufq» degani yo'q
    (ETALON 41: yordamchi so'zning o'zi tushunarli bo'lsin). Ekran 287 → 349 grapheme (chegara 400).
    Rozimisiz — yoki bu gap mentor-pufagiga ko'chsinmi?

15. 🔴 **«MAYDA ↔ YIRIK» O'LCHOVI OLIB TASHLANDI** (s9 yakuni · flashcard-6 · arena-8 · s15). U darsning
    ikkinchi, o'rgatilmagan mezoni edi (ish HAJMI) va T4 kalitiga zid tushardi; s4 da ham rost emas edi.
    O'rnida faqat SON-shakli qoldi: «Yaqin ufqda ish ko'p turadi, uzoq ufqda esa oz». Tasdiqlaysizmi?

16. 🟡 **s9 SAHNASI «YARIM YIL» EMAS, «BIR NECHA OY».** Yarim yil sabab-qatoriga zid edi: soch har oy
    oldiriladi — yarim yilda odam uch marta ham kelib ulgurardi, ya'ni «uchinchi tashrifga chegirma»
    ishi «Hozir» ufqiga tushib ketardi. Yangi sahna: «ochilganiga bir necha oy bo'ldi … birinchi baholar
    endi kelyapti». Rozimisiz?

17. 🟡 **«BEKAT» SO'ZI O'QUVCHI MATNIDAN OLIB TASHLANDI** — yo'ldagi uch nuqta hamma yuzada «ufq» deb
    ataladi (dars bitta atama bilan yuradi). Tasdiqlaysizmi — yoki yo'l-vizualida «bekat» yorlig'i
    saqlanib, s2 da «yo'ldagi har bekat — bitta ufq» deb ochiq tenglashtirilsinmi?

18. 🟡 **KODINGDA ICHKI SIKL ENDI OCHIQ AYTILADI** (`const r = reja[j];`). Eski izoh `r.ish` ni yozishga
    chaqirardi, `r` ning qayerdan kelishi aytilmagan edi (jim tuzoq). Bu topshiriqni bir pog'ona
    osonlashtiradi — shu ko'rinishda qolsinmi, yoki ichki sikl butunlay o'quvchi zimmasiga qaytarilsinmi?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (0–136, §99–136 bilan) · MATN_ETALONI (lug'at + 7-B + 7-C) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2 Batch 5 pasporti) bo'yicha yozildi. `pm-metodist` SENARIY-KORREKTURA bajarildi (2026-08-19 · F-0819-12 · 13-A bo'lim). Keyingi qadam: **[GATE S]** — 14-bo'lim savollari (1–18).*

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
