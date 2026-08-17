# 🗂️ PM KEYS VA MEXANIKA REGISTRI

> **Nima uchun bu fayl bor.** Hozirgacha har senariy o'z shapkasida «ISHLATILGAN_KEYS» va
> «band mexanikalar» ro'yxatini **qo'lda ko'chirib** yurardi. 7 darsda bu ishladi. Qolgan
> 24 PM darsni **parallel** yozganda ishlamaydi: ikki senariy bir vaqtda bir xil keysni yoki
> bir xil mexanikani oladi va buni faqat oxirida bilamiz.
>
> Shu sababli: **fan-out'dan OLDIN** har senariyga keys va mexanika shu registrdan
> **biriktiriladi**. Senariy yozuvchi o'zi keys tanlamaydi — biriktirilganini oladi.
>
> Manba: `PM_Prompt_v8.md` (keys-bank K1…K19) + 8 senariy + 10 qurilgan dars (2026-08-13 skani).
> Yangilash: har GATE S dan keyin — «BAND» ustuni to'ldiriladi.

---

## 1. 🔴 ASOSIY TO'SIQ — bank yetmaydi

| | Soni |
|---|---|
| Bankdagi keys | **19** (K1…K19) |
| Band (10 qurilgan + M3-D10) | **11** |
| Bo'sh qolgan | **8** |
| Qurilishi kerak bo'lgan PM dars | **24** |

**8 bo'sh keys 24 darsga yetmaydi.** Uchta yo'l bor:

**(a) Modul-ichi qoidasi** — `PM_Prompt_v8.md` «Правила использования банка» AYNAN shunday deydi:
«Кейс из поля *кейсы, уже использованные **в этом модуле*** нельзя брать главным» — ya'ni
taqiq **modul ichida**, global emas. Loyiha buni allaqachon qilgan: **K12 (Airbnb pitch)
ikki marta** ishlatilgan — M1-D14 va M2-D13.
→ Shu qoida bilan 24 darsning **21 tasiga** mos keys topiladi (3-bo'limdagi taqsimot).

**(b) Bankni kengaytirish** — promptning o'zi buni kutgan: «После расширения банка до
6 региональных кейсов частоту вернуть к каждый 3–4-й урок». Hozir mintaqaviy keys **2 ta**
(K1 UZUM, K2 Telegram Premium) — 4 tasi yetishmaydi.

**(c) Zaxira ilgak** (`PM_Prompt_v8` 1-blok) — mos keys bo'lmagan darslar uchun.

🔴 **Bu sizning qaroringiz** — 4-bo'limga qarang.

---

## 2. KEYS-BANK HOLATI

| Keys | Nomi | Temalar | Holat | Qayerda |
|---|---|---|---|---|
| K1 | 🇺🇿 UZUM | muammo→yechim · birinchi mahsulot · infra-imkoniyat · o'sish | 🔴 BAND | M2-D2 (`PmLesson4`) |
| K2 | ✈️ TELEGRAM PREMIUM | monetizatsiya · freemium · narx | 🟢 **BO'SH** | — |
| K3 | 📸 INSTAGRAM (Burbn) | MVP · fokus · imkoniyat-saralash | 🔴 BAND | M2-D7 (`PmLesson5`) |
| K4 | 🏠 AIRBNB (matras) | muammo izlash · custdev · intervyu | 🟢 **BO'SH** | — |
| K5 | 🦉 DUOLINGO | retention · jalb-metrikasi · o'yinlashtirish | 🔴 BAND | M8-D1 (`PmMetricsLesson`) |
| K6 | 🎬 NETFLIX | ma'lumot qaror qiladi · ma'lumot-sxemasi · analitika | 🟢 **BO'SH** | — |
| K7 | 💾 MICROSOFT (Altair) | MVP · gipotezani kodgacha tekshirish · tezlik | 🟢 **BO'SH** | — |
| K8 | 👥 META (Facebook) | birinchi foydalanuvchilar · tor auditoriya · kanallar | 🔴 BAND | M1-D2 (`PmLesson1`) |
| K9 | 🏨 BOOKING.COM | A/B test · gipoteza · eksperiment | 🟢 **BO'SH** | — |
| K10 | 🎮 CYBERPUNK 2077 | sifat · testlash · kutilmagan holat · ishonch | 🔴 BAND | M3-D10 (`PmLesson9`) |
| K11 | 🥤 MCDONALD'S (milkshake) | JTBD · haqiqiy ehtiyoj | 🔴 BAND | M3-D2 (`PmUserStoryLesson`) |
| K12 | 📊 AIRBNB PITCH DECK | pitch tuzilishi · storytelling | 🔴 BAND ×2 | M1-D14 (`PmLesson3`) · M2-D13 (`PmLesson6`) |
| K13 | ⚡ TELEGRAM (tezlik) | yetkazish tezligi · CI/CD ustunlik · raqobat | 🟢 **BO'SH** | — |
| K14 | 📱 INSTAGRAM STORIES | prioritet · raqobat · ishga tushirish vaqti | 🔴 BAND | M3-D5 (`PmLesson8`) |
| K15 | ▶️ YOUTUBE (pivot) | pivot · kuzatish · g'oya · risk | 🔴 BAND | M3-D2 (`PmUserStoryLesson`, yordamchi) |
| K16 | 📦 AMAZON (press-reliz) | hujjat koddan oldin · fokus · stakeholder | 🟢 **BO'SH** | — |
| K17 | 🚗 TESLA (master-plan) | roadmap · rejalash ufqlari · strategiya | 🟢 **BO'SH** | — |
| K18 | ☕ STARBUCKS | JTBD · qiymat · pozitsiyalash | 🔴 BAND | M7-D2 (`PmJtbdLesson`) |
| K19 | 🍏 APPLE (iPhone) | fokus · imkoniyat-saralash · UX · taqdimot | 🔴 BAND | M1-D6 (`PmLesson2`) |

**Bo'sh 8 ta:** K2 · K4 · K6 · K7 · K9 · K13 · K16 · K17

---

## 3. TAQSIMOT — 24 PM darsga keys biriktirish

Modul-ichi qoidasi (1a) bilan hisoblangan. «♻️» = boshqa modulda ishlatilgan, shu modulda birinchi marta.

| Dars | Mavzu | Biriktirilgan keys | Moslik |
|---|---|---|---|
| **m3-14** `PmLesson10` | Storytelling: frontend pitchi | K12 ♻️ Airbnb pitch | ✅ aynan |
| **m4-02** `PmLesson11` | Ma'lumot ham mahsulot qarori | **K6** Netflix | ✅ aynan |
| **m4-07** `PmLesson12` | Xavfsizlik — foydalanuvchi ishonchi | ⛔ **ZAXIRA ILGAK** (K10 RAD — GATE S 1-qarori) | ✅ zaxira ilgak |
| **m4-12** `PmLesson13` | Sxema — PRD artefakti | **K16** Amazon | ✅ aynan |
| **m4-15** `PmLesson14` | Fullstack arxitektura pitchi | K12 ♻️ Airbnb pitch | ✅ aynan |
| **m4a-02** `PmLesson15` | Masshtablanuvchanlik | K1 ♻️ UZUM (infra-imkoniyat) | ✅ aynan |
| **m4b-02** `PmLesson16` | Sifat — mahsulot qiymati | K10 ♻️ Cyberpunk | ✅ aynan |
| **m4c-02** `PmLesson17` | Yetkazish tezligi ustunlik beradi | **K13** Telegram tezlik | ✅ aynan |
| **m4c-06** `PmLesson18` | Monitoring — mahsulot metrikasi | 🔴 **YO'Q** | ⛔ zaxira ilgak |
| **m5-02** `PmLesson19` | Birinchi foydalanuvchilar | K8 ♻️ META | ✅ aynan |
| **m5-08** `PmLesson20` | Custdev: jonli foydalanuvchi | **K4** Airbnb custdev | ✅ aynan |
| **m5-11** `PmLesson21` | Foydalanuvchi yig'ish + metrika | K5 ♻️ Duolingo | ✅ aynan |
| **m6-02** `PmLesson22` | PRD nima | **K7** Microsoft (sotdi-keyin-yozdi) | ✅ aynan |
| **m6-06** `PmLesson23` | Etika va mas'uliyat | 🔴 **YO'Q** | ⛔ zaxira ilgak |
| **m6-12** `PmLesson24` | Roadmap: rejalashtirish | **K17** Tesla | ✅ aynan |
| **m6-14** `PmLesson25` | Metrikali pitch — Demo Day 3 | K12 ♻️ Airbnb pitch | ✅ aynan |
| **m7-01** `PmLesson26` | Mahsulot vs loyiha | K15 ♻️ YouTube pivot | ✅ aynan |
| **m7-03** `PmLesson28` | Muammoni qanday izlash | **K4** Airbnb (muammo izlash) | ✅ aynan |
| **m7-04** `PmLesson29` | Custdev: savol berish (Mom Test) | K11 ♻️ McDonald's | ✅ aynan |
| **m7-05** `PmLesson30` | Custdev: 5 real intervyu | 🔴 **YO'Q** (K4 shu modulda band) | ⛔ zaxira ilgak |
| **m7-06** `PmLesson31` | Tahlil + MVP chegarasi | K3 ♻️ Instagram | ✅ aynan |
| **m7-08** `PmLesson32` | Analitika birinchi kundan | **K9** Booking | ✅ aynan |
| **m7-10** `PmLesson33` | Dizayn va nasmotrennost | K19 ♻️ Apple | ✅ aynan |
| **m7-12** `PmLesson34` | Real odam bilan test | K10 ♻️ Cyberpunk | 🟡 qisman |

**Natija:** 21 dars ✅/🟡 qoplanadi · **3 dars zaxira ilgak talab qiladi**
(`m4c-06` monitoring · `m6-06` etika · `m7-05` intervyu).
🟢 Ishlatilmay qoladigan yagona keys: **K2** (Telegram Premium — monetizatsiya). Dasturda
monetizatsiya darsi yo'q; bank kengaytirilsa shu bo'shliqqa ishlatiladi.

---

## 4. ✅ QAROR MUHRLANDI (2026-08-13, foydalanuvchi)

1. 🔴 **MODUL-ICHI QOIDASI QABUL QILINDI.** Keys taqiqi **modul ichida** amal qiladi, global
   emas. Manba: `PM_Prompt_v8.md` «Правила использования банка» + amaldagi pretsedent
   (K12 → M1-D14 va M2-D13). **M3-D10 shapkasidagi global sanoq bekor** — u xato talqin edi.
   → 3-bo'limdagi ♻️ taqsimoti kuchga kirdi.
2. 🔴 **ZAXIRA ILGAK QABUL QILINDI.** Qoplanmagan 3 dars (`m4c-06` monitoring · `m6-06` etika ·
   `m7-05` intervyu) `PM_Prompt_v8` 1-blokdagi **zaxira ilgak** bilan yoziladi. Bank
   kengaytirilmaydi (keyinga qoldirildi).

**Amalda nimani anglatadi:** senariy yozuvchi keysni O'ZI tanlamaydi — 3-bo'limdan
biriktirilganini oladi. Agar biriktirilgan keys mavzuga **halol** yopishmasa (🟡 belgililar),
zo'rlamaydi — zaxira ilgakka o'tadi va buni shapkada yozadi.

### ✅ BATCH 1 GATE S YOPILDI (2026-08-13, foydalanuvchi «tavsiyang bo'yicha»)

- **M4-D7 da K10 amalda RAD bo'ldi** → zaxira ilgak (yozuvchi dalili tasdiqlandi: K10 ning
  ishonch tomoni M3-D10 da band; 3-bo'lim jadvalidagi m4-07 qatori endi «zaxira ilgak»).
- **Koding-navbati muhrlandi:** M3-D10 kompilyator → **M3-D14 VS Code** → **M4-D2
  kompilyator** → **M4-D7 VS Code** (26-qonun).
- **Artefakt kaliti:** `pm-m3d14-pitch` (M3 da yopiq) · `pm-m4d2-data.maydonlar`
  (`qatorlar` EMAS) · `pm-m4d7-ishonch`.
- **Modul-ipi:** M4 PM darslari o'z olamlarida qoladi (musiqa · jurnal), ip artefakt
  orqali (96c(b)); AvtoIjara olamiga ko'chirilmaydi.
- To'liq qarorlar har senariyning «[GATE S] YOPILDI» bo'limida.

---

## 5. BAND MEXANIKALAR REGISTRI

🔴 **23-qonun:** har darsda imzo-vizual YANGI bo'ladi. 26/59-qonun: TEKSHIRUV mexanikasi
oldingi PM darsdan farq qiladi.

| Dars | Imzo-vizual | TEKSHIRUV mexanikasi |
|---|---|---|
| M1-D2 `PmLesson1` | — | — |
| M1-D6 `PmLesson2` | — | — |
| M1-D14 `PmLesson3` | Demo Day repetitsiyasi · mikrofon-yozuv | muammo-qidiruv |
| M2-D2 `PmLesson4` | — | — |
| M2-D7 `PmLesson5` | bo'laklash-doska | — |
| M2-D13 `PmLesson6` | — | — |
| M3-D2 `PmUserStory` | **story-silosi** | 3 hikoya ustaxonasi · tekshiruvchi stoli · klinika · bir o'lchovli prioritet-doska · `hikoyaYasa` kompilyatori · PairTimer |
| M3-D5 `PmLesson8` | **ikki o'qli foyda-vaqt doskasi** | kartani boshqa katakka ko'chirish · hafta-chizig'i · rang-juftlash darvozasi |
| M3-D10 `PmLesson9` 🔨 | **«ISHGA TUSHIRIB KO'RISH»** — ishlaydigan soxta forma | **Timeline** (qabul qadamlarini tartibga solish) |
| M3-D14 `PmLesson10` ✍️ | **«GAPSIZ KO'RSATUV»** — 4 kadrli tasma | **Hotspot** (ikki bosqichli) 🔒 |
| M4-D2 `PmLesson11` ✍️ | **«XOTIRA TUGMALARI»** — 5 tugma, 2 tasi bo'sh | **«BO'LIMNI JADVALDAN QURING»** — jadval-qatorini belgilash 🔒 |
| M7-D2 `PmJtbd` | **JTBD shtampi** | MatchPairs |
| M8-D1 `PmMetrics` | **Metrika alangasi** | MatchPairs |

🔴 **SABOQ (2026-08-13, Batch 1):** parallel yozuvda **m3-14 va m4-02 ikkalasi ham Hotspot ni
tanladi.** Mening yo'lakcha-biriktirishim imzo-vizual, keys va olamni qamragan edi — lekin
**TEKSHIRUV mexanikasini emas.** m3-14 va m4-02 ketma-ket PM darslar, ya'ni 26/59-qonun
buzilardi. **Hotspot m3-14 ga muhrlandi** (birinchi tugagan), m4-02 boshqasiga o'tkazildi.
→ Bundan keyin har batch-brifiga **TEKSHIRUV mexanikasi ham oldindan biriktiriladi**, va
biriktirilmagan primitivlar ro'yxati beriladi.

**PM TEKSHIRUV primitivlari — bandlik holati:** MatchPairs 🔴band (M7-D2, M8-D1) ·
Timeline 🔴band (M3-D10) · kartani ko'chirish 🔴band (M3-D5) · tekshiruvchi stoli 🔴band (M3-D2) ·
klinika 🔴band (M3-D2) · **Hotspot 🔴band (M3-D14)** · Reflection/juftlik-mexanika — yordamchi,
TEKSHIRUV sifatida sanalmaydi · 🟢 **bo'sh:** prioritet-doska (bir o'lchovli) · funnel ·
persona-karta saralash · artefakt-checklist · roadmap-Timeline (M3-D10 Timeline'idan farqli
ufq-versiyasi) · juftlik-mexanika (nomlar juftlash emas, qaror juftlash).

🔴 **PITCH-DARSLARI OILASI — alohida taqiq ro'yxati** (M3-D14 senariysi skani bilan topildi,
2026-08-13; registrda yo'q edi). Dasturda **4 ta** pitch darsi bor (M1-D12, M1-D14, M2-D13,
M3-D14) va yana 3 tasi kelmoqda (m4-15, m6-14, m7-14) — shuning uchun bu ro'yxat majburiy:
tushunish chizig'i · so'z-elagi · tinglovchi-javobi kartalari · uch qatlam o'xshatishi ·
**tinglovchi kursisi** (M2-D13) · sahna-taymeri · **MicRecorder ovoz-yozuv** ·
texnik↔odamcha juftlik-tanlovi · demo 3 qadam-akkordeoni · **ota-ona savollari** ·
repetitsiya kabinasi (M1-D14) · 30s juftlik-sekundomeri (M1-D12) ·
**«GAPSIZ KO'RSATUV» 4 kadrli tasma** (M3-D14).

🔴 **TAQIQ (takrorlanmaydi):** story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli
doska · ishga-tushirib-ko'rish formasi · MatchPairs · bo'laklash-doska · hafta-chizig'i ·
rang-juftlash darvozasi · kartani ko'chirish · PairTimer · klinika · tekshiruvchi stoli.

### 🔒 BATCH 1 — bandlashuv (2026-08-13, senariylar yozilmoqda)

Parallel yozuvda to'qnashuv bo'lmasligi uchun **oldindan** biriktirildi. Aniq imzo-vizual
nomlari senariylardan kelgach shu jadvalga ko'chiriladi.

| Dars | Keys | Mexanika-yo'lakcha | Misol-ip (olam) |
|---|---|---|---|
| **m3-14** `PmLesson10` ✅ | K12 ♻️ (3-burchak) | ✅ **«GAPSIZ KO'RSATUV»** · Hotspot | 🏀 **maydoncha** (demo-olam) + o'quvchining O'Z M3 sayti (uning ishi) |
| **m4-02** `PmLesson11` ✅ | K6 | ✅ **«XOTIRA TUGMALARI»** · «BO'LIMNI JADVALDAN QURING» | 🎧 musiqa/pleylist ilovasi |
| **m4-07** `PmLesson12` ✅ | ⛔ zaxira ilgak (K10 RAD) | ✅ **«UCH KIRISH — BIR SAHIFA»** · «xabardan ortiqcha qatorni olib tashlash» | 🏫 maktab baholar/jurnal ilovasi |

🔴 **m3-14 ga alohida ogohlantirish:** M1-D14 (`PmLesson3`) ham pitch darsi — uning
**mikrofon-yozuvi**, **3 daqiqalik nutq sanog'i** va **muammo-qidiruv tekshiruvi**
takrorlanmaydi. Farq: M1-D14 = nutqni mashq qilish · M3-D14 = ishlaydigan mahsulotni
ko'rsatish tartibi.

🔴 **Band olamlar ro'yxati** (96c to'qnashuv-tekshiruvi, har yangi senariyga beriladi):
lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo ·
Instagram · maktab bufeti (M3-D10) · 🏀 **maydoncha** (M3-D14) · o'quvchining o'z React sayti
(M3-D14, uning ishi) · musiqa/pleylist ilovasi (M4-D2) · maktab baholar/jurnal ilovasi (M4-D7).

Yangi senariy yozilganda bu jadvalga **darhol** qator qo'shiladi — aks holda parallel
senariylar bir xil mexanikani oladi.

---

## 6. ARTEFAKT-ZANJIRI

Ketma-ketlik **majburiy**: chiqish-artefakt keyingi darsning kirishi. 🔴 F-0803-22-B saboqi —
ikki tomonlama shart-tekshiruvi (yozuvchi dars va o'quvchi dars bir xil shakl va kalitni kutadi).

| Dars | Kirish | Chiqish |
|---|---|---|
| M1-D2 | — | `pm-m1d2-cards` `{kim, muammo, yechim}` |
| M2-D7 | — | `pm-m2d7-mvp` |
| M2-D13 | `pm-m2d7-mvp` · `pm-m1d2-cards` | — |
| M3-D2 | — | `pm-m3d2-stories` — **aynan 3 ta** `{kim, nima, natija}` |
| M3-D5 | `pm-m3d2-stories` | `pm-m3d5-board` `{items[], birinchi, sabab}` |
| M3-D10 🔨 | `pm-m3d5-board` | `pm-m3d10-shartlar` `{ish, shartlar[3], savedAt}` |
| **m3-14** ✍️ | `pm-m3d10-shartlar` | `pm-m3d14-pitch` — M3 modulini YOPADI |
| **m4-02** ✍️ | 🔴 **YO'Q** — modul ochilishi (2–3 oy oralab, oldingi artefaktga bog'lanmaydi) | `pm-m4d2-data` |
| **m4-07** ✍️ | `pm-m4d2-data` | `pm-m4d7-ishonch` |

🔴 **Modul-chegara qoidasi (Batch 1 da o'rnatildi):** modulning BIRINCHI PM darsi kirish-artefakt
talab qilmaydi — o'quvchi yangi modulga 2–3 oy tanaffusdan keyin kiradi. Bu, shu bilan birga,
parallel yozuvdagi aylanma-bog'liqlikni ham uzadi (m3-14 va m4-02 bir vaqtda yozilmoqda).

Qolgan 21 darsning zanjiri **hali chizilmagan** — har batch senariysida aniqlanadi va shu
jadvalga yoziladi.

✍️ = senariy hozir yozilmoqda

---

## 7. FAYL-HOLATI (2026-08-13 skani)

**Chala (`-v16` avlod, 18 ekran, jonli-ball/test/flashcard qatlami YO'Q):** 30 fayl.
Hammasi bir xil qolipdan — 0 `useLiveSession`, 0 `QUIZ_BANK`, 0 `FLASHCARDS`,
0 `INLINE_KEYS`, 0 `SCREEN_INTENTS`.

**O'lik fayl — 1 ta** (`arxiv/olik-darslar/` ga ko'chirildi, `App.jsx` dagi importi olib tashlandi):
- `PmLesson27.jsx` — importi bor edi, lekin hech bir `comp:` da ishlatilmasdi; o'rnini
  `PmJtbdLesson` (m7-02) egallagan.

**`PmLesson7.jsx` — O'LIK EMAS, `src/3-Modull/` da qoladi.** `App.jsx` da importi yo'q,
lekin uni `src/solishtir/SolishtirApp.jsx` **solishtirish-vositasi** yuklaydi:
«PmLesson7 (chala) ↔ PmUserStory (etalon)» juftligi. Ya'ni u — chala-avlodning tirik
namunasi. 🔴 **Ko'chirilmaydi va o'chirilmaydi** (`arxiv/` dan `../assets/...` rasm-yo'llari
yechilmaydi — sinab ko'rilgan).

---

# 🗺️ BATCH 2–5 BOSH-REJA (2026-08-14, «PM qismanlarni to'liq qilish»)

> Maqsad: M4·M4a·M4b·M4c·M5·M6 dagi **13 chala PM darsni** yopish — shunda M1–M6 to'liq
> bo'ladi (M7/M8 alohida bosqich). Batch 1 saboqlariga qurilgan: **to'rt yo'lakcha ham
> (keys · imzo-vizual · TEKSHIRUV · olam) + koding-mexanika + artefakt-zanjir fan-out'dan
> OLDIN biriktiriladi** — Hotspot-to'qnashuvi (F-0813 saboq) takrorlanmasin.

## R1. KODING-NAVBAT — butun o'quvchi-yo'li bo'ylab muhrlangan (26-qonun)

Oxirgi yopilgan: m4-07 = VS Code. Undan keyin qat'iy almashinish:

| Dars | Koding | Dars | Koding |
|---|---|---|---|
| m4-12 | 🖥 kompilyator | m5-02 | 🖥 kompilyator |
| m4-15 | ⌨️ VS Code | m5-08 | ⌨️ VS Code |
| m4a-02 | 🖥 kompilyator | m5-11 | 🖥 kompilyator |
| m4b-02 | ⌨️ VS Code | m6-02 | ⌨️ VS Code |
| m4c-02 | 🖥 kompilyator | m6-06 | 🖥 kompilyator |
| m4c-06 | ⌨️ VS Code | m6-12 | ⌨️ VS Code |
| — | — | m6-14 | 🖥 kompilyator |

Senariy yozuvchi buni O'ZGARTIRMAYDI; istisno faqat GATE S da.

## R2. BATCH-JADVALLAR (yo'lakchalar oldindan band)

### BATCH 2 — «M4 ni yopish» (3 dars)
| Dars | Fayl | Keys | Imzo-vizual YO'LAKCHASI | TEKSHIRUV yo'lakchasi | Olam (misol-ip) | Kirish → Chiqish |
|---|---|---|---|---|---|---|
| **m4-12** Sxema — PRD artefakti | `PmLesson13` | **K16** Amazon (press-reliz koddan oldin) | «SXEMA-TO'QISH» — ustun-bog'lash doskasi | artefakt-checklist | 📚 maktab kutubxonasi (kitob band qilish sayti) | `pm-m4d7-ishonch` («kim ko'radi» ustuni — M4-D7 GATE S 4-taklifi) → `pm-m4d12-sxema` |
| **m4-15** Fullstack arxitektura pitchi | `PmLesson14` | **K12** ♻️ Airbnb pitch (4-burchak — arxitektura-varag'i) | «ARXITEKTURA-QAVATLARI» ko'rsatuvi (front·server·baza — uch qavat, oddiy tilda) | qaror-juftlash (texnik qaror ↔ oddiy sabab) | o'quvchining O'Z M4 fullstack loyihasi (🅿️ AvtoStoyanka demo-olami) | `pm-m4d12-sxema` → `pm-m4d15-pitch` (M4 yopiladi) |
| **m4a-02** Masshtablanuvchanlik | `PmLesson15` | **K1** ♻️ UZUM (infra-imkoniyat) | «YUK-SINOVI» — foydalanuvchi-soni slayderi, nima birinchi sinishini ko'rsatadi | yuk-tartiblash (qaysi qism birinchi sinadi — saralash) | 🎟️ konsert-chipta sayti (hamma birdan kirganda) | modul-chegara: kirish YO'Q → `pm-m4a2-yuk` |

🔴 m4-15 ga **PITCH-OILASI TAQIQ-RO'YXATI** to'liq beriladi (yuqoridagi bo'lim) + «GAPSIZ
KO'RSATUV»/Hotspot ham band.

### BATCH 3 — «sifat · tezlik · monitoring» (3 dars)
| Dars | Fayl | Keys | Imzo yo'lakchasi | TEKSHIRUV yo'lakchasi | Olam | Kirish → Chiqish |
|---|---|---|---|---|---|---|
| **m4b-02** Sifat — mahsulot qiymati | `PmLesson16` | **K10** ♻️ Cyberpunk (M4b da birinchi; SIFAT tomoni — M3-D10 ishlatgan qabul-shartlari burchagi TAKRORLANMAYDI) | «SIFAT-TAROZI» — bug-narxi ko'rsatkichi | bug-triaj saralash (qaysi nosozlik birinchi) | 🛴 skuter-ijara ilovasi | modul-chegara: YO'Q → `pm-m4b2-sifat` |
| **m4c-02** Yetkazish tezligi | `PmLesson17` | **K13** Telegram (oyiga yangilik) | «RELIZ-TASMASI» — haftalik chiqarish lentasi | haftaga-sig'dirish darvozasi (katta ishdan haftalik bo'lak tanlash) | 🏁 ikki sinfdosh-loyiha poygasi | modul-chegara: YO'Q → `pm-m4c2-reliz` |
| **m4c-06** Monitoring | `PmLesson18` | ⛔ ZAXIRA ILGAK (fakt-halollik: o'quvchi O'ZI tekshiradigan holat) | «O'LCHAGICH-PANELI» — jonli soxta uptime/tezlik paneli | signal-saralash (qaysi ogohlantirish chin) | 🌐 o'quvchining O'Z Netlify-sayti (M1 dan bor!) | `pm-m4c2-reliz` → `pm-m4c6-signal` |

### BATCH 4 — «M5 to'liq» (3 dars; modul-ipi: o'quvchining O'Z Telegram-boti)
| Dars | Fayl | Keys | Imzo yo'lakchasi | TEKSHIRUV yo'lakchasi | Kirish → Chiqish |
|---|---|---|---|---|---|
| **m5-02** Birinchi foydalanuvchilar | `PmLesson19` | **K8** ♻️ META (tor auditoriya) | «BIRINCHI 20» — foydalanuvchi-to'lqin xaritasi | kanal-funnel (qaysi kanaldan kim keladi) | YO'Q → `pm-m5d2-yigirmata` |
| **m5-08** Custdev: jonli foydalanuvchi | `PmLesson20` | **K4** Airbnb (custdev oyoqda) | «INTERVYU-STOLI» — savol tanlab javob eshitish | savol-elak (yaroqli/yaroqsiz savol saralash — M2-D13 «so'z-elagi»dan FARQLI: u so'z, bu savol-TURI) | `pm-m5d2-yigirmata` → `pm-m5d8-javoblar` |
| **m5-11** Foydalanuvchi + metrika | `PmLesson21` | **K5** ♻️ Duolingo (retention) | «QAYTISH-KALENDARI» — kim qaytdi-kim ketdi taqvimi | kun-belgilash (qaytgan kunlarni topish) | `pm-m5d8-javoblar` → `pm-m5d11-metrika` |

### BATCH 5 — «M6 to'liq» (4 dars; modul-ipi: o'quvchining O'Z AI-loyihasi)
| Dars | Fayl | Keys | Imzo yo'lakchasi | TEKSHIRUV yo'lakchasi | Kirish → Chiqish |
|---|---|---|---|---|---|
| **m6-02** PRD nima | `PmLesson22` | **K7** Microsoft (sotdi-keyin-yozdi) | «BIR VARAQ PRD» — to'rt-katakli muharrir | katak-tekshiruv (to'rt katakning to'g'ri to'ldirilishi) | YO'Q → `pm-m6d2-prd` |
| **m6-06** Etika va mas'uliyat | `PmLesson23` | ⛔ ZAXIRA ILGAK | «OQIBAT-KO'ZGUSI» — qaror → kim jabr ko'radi | oqibat-juftlash (qaror↔jabr; nom-juftlash EMAS) | `pm-m6d2-prd` → `pm-m6d6-chegara` |
| **m6-12** Roadmap | `PmLesson24` | **K17** Tesla (master-plan) | «UCH UFQ YO'LI» — hozir/3 oy/6 oy yo'l-xaritasi (M3-D10 Timeline'idan FARQI: tartib emas, UFQqa joylash) | ufq-joylash | `pm-m6d6-chegara` → `pm-m6d12-yol` |
| **m6-14** Metrikali pitch — Demo Day 3 | `PmLesson25` | **K12** ♻️ pitch (5-burchak — metrika-varag'i) | «METRIKA-SLAYDI» — raqam gapiradigan slayd | raqam-tanlov (qaysi raqam isbot, qaysi shovqin) | `pm-m6d12-yol` → `pm-m6d14-pitch` (M6 + Demo Day 3 yopiladi) |

🔴 m6-14 ga ham PITCH-OILASI taqiq-ro'yxati + m4-15 ning yangi mexanikalari (GATE S dan keyin
bu jadvalga qaytib yoziladi).

## R3. JARAYON-PROTOKOLI (har batch, Batch 1 dan qattiqlashtirilgan)

1. **Fan-out'dan oldin:** shu jadvaldan pasport — 6 ustun ham. Yozuvchi yo'lakchadan chiqmaydi.
2. **Senariylar parallel** (3–4 yozuvchi, har biri o'z faylida) → har biri tugashi bilan
   bosh-agent ANIQ mexanika-nomlarini shu registrga muhrlaydi (birinchi tugagan — egasi).
3. **Korrektura parallel** (pm-metodist ×N) → **[GATE S] bitta o'tirishda N senariy**.
4. **Qurish parallel** (fayl-izolyatsiya; brif = M3-D10 ning 12-saboqli shabloni + 16/17-ov
   bandlari + §110/§118 + keys-ekran ≥2 bashorat/uzluksiz hisoblagich + klon-residue-grep).
5. **Har dars o'z zanjirida** (dizayn→jonli→👦→metodist→👦→tekshiruvchi→verifikator→qabulchi),
   bir faylda bir vaqtda BITTA rol; bosqich-almashish faqat notification'dan keyin.
6. **F-0813-09 protokoli:** istalgan geytda topilgan yangi sinf — bosh-agent DARHOL
   opa-singil fayllarni grep qiladi va navbatga tuzatish qo'yadi.
7. **Umumiy fayllar** (registr · korpus · STATE · App.jsx kartalari) — faqat bosh-agent.
8. **App.jsx karta-supurgisi qurish paytida:** m4c-02 sub (uzuq matn) · m5-11 «DAU,
   retention» · m6-12 «RICE» — 29-qonunga moslash.
9. Har batch yakuni: STATE-yozuv + GATE 3 taqdimoti. **Commit faqat buyruq bilan.**

### 🔒 BATCH 2 — aniq mexanika-muhrlari (senariylar tugagani sayin)

| Dars | Imzo-vizual (ANIQ) | TEKSHIRUV (ANIQ) | Holat |
|---|---|---|---|
| m4-12 | **«SXEMA-TO'QISH»** — gap→ustun ip-tortish + 👁/🔒 belgi + 4-gap yangi-ustun qarori (MatchPairs-farqi hujjatlangan) | **«sxema-shart tekshiruvi»** — taklif-sxemani 3 shartdan o'tkazib 2 nuqson topish | ✅ muhrlangan (2026-08-14) |
| m4a-02 | **«YUK-SINOVI»** — odam-soni surmasi (50→3000), qaysi qism sinishi ko'rinadi + 2-bosqich «bitta qismni oldindan kuchaytir» qarori | **«yuk-tartiblash»** — 4 qismga zaiflik-hukmi, raund-saralash (Timeline-farqi: vaqt emas, ZAIFLIK) | ✅ muhrlangan (2026-08-14) |
| m4-15 | **«ARXITEKTURA-QAVATLARI»** — 3 qavat kesimi (sahifa·server·baza), har qavat o'z ish-gapi + «bitta bosishning yo'li» nuqta-animatsiyasi (M2-D13 «uch qatlam o'xshatishi»dan farqi: o'xshatish YO'Q, qavat o'z fe'li bilan) | **«QAROR-SABAB TANLOVI»** — 3 qaror bittalab, har biriga odam-foydasi sababi (M2-D13 so'z-almashtirishdan farqi: so'z emas, qaror↔foyda) | ✅ muhrlangan (2026-08-14) |

### ✅ BATCH 2 AVTO-GATE S YOPILDI (2026-08-14, avtokontrol)

- m4-15 imzo-nomi: «ARXITEKTURA-QAVATLARI» → **«UCH QAVAT KESIMI»** (⑨-qaror).
- **K12 burchak-registri:** M1-D12 tuzilish · M2-D13 tinglovchi · M3-D14 tartib+jamoa ·
  **M4-D15 «besh qadamda texnika yo'q» (chegaralangan inkor)** · m6-14 uchun qolgan yo'nalish:
  metrika-varag'i (5-burchak).
- **Artefakt-zanjir muhri:** `pm-m4d7-ishonch` → `pm-m4d12-sxema {ustunlar:[{nom,savol,kim}x3]}`
  → m4-15 (`nom` o'qiydi) → `pm-m4d15-pitch {qavatlar:[{qavat,gap}x3]}` (M4 yopiq) ·
  `pm-m4a2-yuk {qarorlar:[{qism,qaror,sabab}x3]}` (modul-ochilish, kirishsiz).
- Batch 2 kartalar (bosh-agent qurilishda kiritadi): m4-12 «Ilova nimani yozib qoladi?» ·
  m4-15 «"Qanday ishlaydi?" deb so'rashsa» · m4a-02 «Hamma birdan kirsa, sayt chidaydimi?».
