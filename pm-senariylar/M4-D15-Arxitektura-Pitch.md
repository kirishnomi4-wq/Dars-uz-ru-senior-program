# M4-D15 — «Bu qanday ishlaydi?» deb so'rashsa, nima deysiz? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl (kelajakda): `src/4-Modull/PmLesson14.jsx` (hozirgi `-v16` avlod dars BUTUNLAY almashadi;
> yangi `lessonId: pm-m4d15-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.
> 🔴 Bu dars **4-Modulni YOPADI** — undan keyin faqat Demo Day (m4-17).

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 4 — «Ma'lumot va bog'lanishlar» (Node.js + PostgreSQL) |
| **Dars** | M4-D15 (modulning 15-darsi) · `key: m4-15` |
| **Mavzu** | Texnik qarorni texnik bo'lmagan odamga tushuntirish — uch qavat, oddiy tilda |
| **TUR** | 🔴 **2-TUR (sof PM)** — artefakt = matn (uch qavat-gap), Demo Day'ga o'tadi (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | **K12 ♻️ · AIRBNB PITCH DECK** (registr R2 Batch 2 biriktiruvi). 🔴 **TO'RTINCHI burchak:** bankdagi **besh qadamli tartibda** («muammo, yechim, bozor, mahsulot, jamoa») **sayt qanday qurilgani qadami yo'q**; mahsulot qadamida esa mahsulotning o'zi turadi. 🔴 **Inkor CHEGARALANGAN (F-0813-01 sabog'i):** har gap «shu besh qadamda yo'q» shaklida yoziladi — «bironta varaqda yo'q», «umuman bo'lmagan» kabi bankdan tashqariga chiqadigan mutlaq inkor **hech qayerda ishlatilmaydi** (bank «около десятка слайдов» deydi, ya'ni ro'yxat varaqlarni emas, TARTIBNI sanaydi). Band burchaklar TAKRORLANMAYDI: M1-D12 tuzilish · M2-D13 tinglovchi («har slaydda bitta sodda fikr», «o'nga yaqin sodda slayd») · M3-D14 «tartib ishladi + jamoa» (band bashoratlar: «Birinchi slaydda nima turgan?» · «Har slaydda qancha gap bo'lgan?» · «Oxirgi varaqda nima turgan?»). Yangi fakt QO'SHILMAGAN — burchak bankdagi tartib-ro'yxatining o'zidan chiqarilgan (6-bo'lim) |
| **ISHLATILGAN_KEYS (modul-ichi)** | M4 da band: K6 (M4-D2) · zaxira ilgak (M4-D7) · K16 (M4-D12) → **K12 M4 da birinchi marta** ✓ (registr 4-bo'lim: modul-ichi qoidasi) |
| **Oldingi PM dars (M4-D12) TEKSHIRUV mexanikasi** | **artefakt-checklist** (registr R2; senariy parallel yozilmoqda) — **takrorlanmaydi** |
| **Band mexanikalar (TAQIQ)** | story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli foyda-vaqt doskasi · «ISHGA TUSHIRIB KO'RISH» formasi · Timeline · MatchPairs · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · kartani ko'chirish · PairTimer · klinika · tekshiruvchi stoli · 3 hikoya ustaxonasi · `hikoyaYasa` kompilyatori · «XOTIRA TUGMALARI» · «UCH KIRISH — BIR SAHIFA» · «ortiqchasini olib tashlash» · 🔴 **M4-D12 (parallel):** «SXEMA-TO'QISH» ustun-bog'lash doskasi · artefakt-checklist · 🔴 **PITCH-OILASI (registr 5-bo'lim, TO'LIQ):** tushunish chizig'i · so'z-elagi · tinglovchi-javobi kartalari · **uch qatlam o'xshatishi** (M2-D13 — farq-asosi 1-bo'limda) · tinglovchi kursisi · sahna-taymeri · MicRecorder · **texnik↔odamcha juftlik-tanlovi** (M2-D13 — farq-asosi 1-bo'limda) · demo 3 qadam-akkordeoni · ota-ona savollari · repetitsiya kabinasi · 30s sekundomer · **«GAPSIZ KO'RSATUV» 4-kadr tasma** (M3-D14) · **Hotspot** (M3-D14) |
| **Misol-ip (91/108 + 95 + 96 + 96c)** | 🅿️ **AVTOSTOYANKA** — o'quvchining O'Z M4 fullstack loyihasi (m4-13 «Fullstack loyiha kuni»da qurilgan: baza + server + panel; m4-14 da sinfdosh fikri bilan yaxshilangan). 96-qonun modul-ipi: demo-olam = modul-loyihaning o'zi. 95-qonun: o'quvchi bu saytni oxirgi ikki darsda O'ZI qurdi va tuzatdi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · maydoncha (M3-D14) · musiqa ilovasi (M4-D2) · maktab jurnali (M4-D7) · maktab kutubxonasi (M4-D12) — **AvtoStoyanka PM darslarida band emas** ✓. 96c(b) izohi: demo «yana shumi?» bermaydi — M4 ning PM darslari boshqa olamlarda yurdi, yakuniy dars esa o'quvchining O'Z loyihasiga qaytadi (bu modulni yopadigan darsning mazmuni) |
| **Kirish-artefakt** | `pm-m4d12-sxema` — ⚠️ **KUTILAYOTGAN shakl** (M4-D12 senariysi parallel yozilmoqda; GATE S da moslashtiriladi — M4-D7 dagi `maydonlar` pretsedenti): `{ ustunlar: [ { maydon, kimKoradi } × N ], savedAt }`. 🔴 Bu dars **faqat `ustunlar[].maydon` nomlarini** o'qiydi (3 tagacha) — s8 «Eslab qoladi» qadami uchun. Ikki tomonlama shart-tekshiruvi (F-0803-22-B) GATE S dan keyin muhrlanadi. **Zaxira yo'l MAJBURIY** (5-bo'lim): yo'q bo'lsa AvtoStoyanka uchligi — «joy raqami · kim band qilgani · qaysi kungacha» |
| **Chiqish-artefakt** | 🔴 `pm-m4d15-pitch` = `{ qavatlar: [ { qavat: 'front'\|'server'\|'baza', gap } × 3 ], savedAt }` — **M4 ni yopadi**. Keyingi egasi: Demo Day (m4-17) o'qishi mumkin ⚠️ GATE S 7-savoli |
| **Yordamchi kalitlar** | `pm-m4d15-hook-choice` (faqat YOZILADI — 100c) · `pm-m4d15-qavatlar` (s4 holati) · `pm-m4d15-qarorlar` (s9 holati) · `pm-m4d15-code` · `pm-m4d15-reflection` · `pm-m4d15-hw-target` · `ccProgress` |
| **Koding** | ⌨️ **VS Code topshirig'i** — R1 navbati (m4-12 kompilyator → **m4-15 VS Code**) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D10/M3-D14 da tasdiqlangan yakun-tuzilmasi bilan bir xil |

### Atama-glosslar (62/39-qonun + korpus §20/§104 — avval hodisa, keyin nom)

- 🔴 **«qavat» — darsning bosh so'zi.** Ta'rif-gap s1 da to'liq beriladi (§104): «Saytingiz uch
  qismdan turadi — ularni **qavat** deymiz, xuddi binoning qavatlari kabi.» O'smirga «qavat» har
  kuni tanish (uy, savdo markazi), gloss talab qilmaydi. ⚠️ M2-D13 da xuddi shu tushuncha
  «qatlam» deb atalgan — GATE S 10-savoli; bu dars matnida «qatlam» so'zi **0**.
  🔴 **Metodist qo'shimchasi (§112):** M2-D13 ning uch nomi (`ko'rinadigan qism · ishni bajaradigan
  qism · ma'lumot saqlanadigan joy`) bu darsning uch glossi bilan so'zma-so'z ustma-ust tushadi —
  ya'ni tushuncha-ko'prigi allaqachon bor, faqat umumiy nom boshqa. Shuning uchun to'liq
  orqaga-havola SHART EMAS; s1 ta'rif-gapiga **yarim jumlalik** ko'prik yetadi: «…ularni **qavat**
  deymiz (ba'zan **qatlam** ham deyishadi), xuddi binoning qavatlari kabi». Bu bilan eslab qolgan
  bola «ikki nom bitta narsagami?» savolida qolmaydi, eslamagani esa ortiqcha yuk olmaydi;
- 🔴 **Uch qavat nomi va fe'li BUTUN darsda bitta** (korpus §80 kaskad): **sahifa — ko'rsatadi ·
  server — tekshiradi · baza — eslab qoladi.** Bu uch fe'l s1 · s4 · s8-indikator · s9-izohlar ·
  flashcard · arena · yakun-ro'yxatida AYNAN shu shaklda yuradi;
- 🔴 **«front» — faqat BITTA ko'prik-eslatma, keyin butunlay «sahifa».** m4-13 da o'quvchi
  «fullstack (front + server + baza)» ni ko'rgan, shuning uchun s1 ta'rif-gapida bir marta
  qavs-ko'prigi turadi: «ko'rinadigan sahifa (texnik darslarda — front)». Undan keyin dars bo'ylab
  **«sahifa»** — chunki darsning o'z qoidasi «texnik so'zsiz ayting». «server» va «baza» M4 texnik
  darslaridan tanish, lekin baribir birinchi ko'rinishda qisqa izoh oladi: «server — ko'rinmay
  ishlaydigan qism», «baza — ma'lumot saqlanadigan joy»;
- 🔴 **«ko'rsatuv»** — kurs atamasi (M3-D14 da ochilgan), bu darsda **s6 ko'prik-gapida** hodisa →
  nom tartibida qayta ochiladi: «Siz ham ishingizni odam oldida ochib tushuntirasiz — buni
  **ko'rsatuv** deymiz» (§104/62: s1 da atama-yuki bo'lmasin, u yerda «qavat» tug'iladi). Undan
  keyin s9 · s10 · TEST-4 · arena · flashcardda erkin yuradi. «pitch» ekranga CHIQMAYDI
  (korpus §20). «ko'rsatuv» (ot) va sahifaning «ko'rsatadi» fe'li — bir o'zak, bir ma'no-oila,
  to'qnashuv emas (§105 tekshirildi: ikkalasi «ko'rsatish» ma'nosida);
- 🔴 **«arxitektura» o'quvchi matnida ISHLATILMAYDI** — kattalar so'zi; tushuncha butun darsda
  «uch qavat» deb yuradi. `App.jsx` kartasidagi «arxitektura» va «stakeholder» ham ketadi —
  GATE S 1-savoli;
- 🔴 **«qarab turgan odam»** — kurs nomi (M3-D14, korpus §80): tinglovchi shu nom bilan.
  ❌ «tomoshabin» · «tinglovchi» · «investor» · «stakeholder»;
- 🔴 **«texnik so'z»** — dars ichida «qarab turgan odam bilmaydigan kasb-so'z» ma'nosida, s2 da
  hodisa bilan ochiladi. ❌ «jargon» (o'zi izoh talab qiladi);
- 🔴 **«holat-qatori»** — s10 da kiritiladigan yagona yangi narsa-nomi: «sahifada chiqadigan,
  odam tilida yozilgan bitta qator». Kodda yoziladigan narsa o'z nomi bilan ataladi (korpus §88);
- ❌ **fetch · JSON · API · endpoint · JWT · token · PostgreSQL · SQL — o'quvchi PROZA-matnida
  ishlatilmaydi** (ular s2/s10 da faqat MATERIAL ichida — «texnik javob» kartasi va kod-mockup —
  ko'rinadi; 21-qonun: material proza emas, sanalmaydi). Scored matnlarda (test, arena) bu
  so'zlar **0**;
- ❌ **«fullstack» ishlatilmaydi** — «uch qavat birga» deyiladi (kartada ham almashadi, GATE S 1);
- ❌ **Ichki blok-nomlari ekranga OQMAYDI** (korpus §84): YADRO · USTAXONA · HOOK · RECAP ·
  artefakt. Quruvchi tekshiruvi: `grep -ni "yadro\|ustaxona\|artefakt"` — JSX satrida **0**;
- 🔴 **BIR NARSA — BIR NOM: «sayt».** O'quvchi qurgan narsa butun darsda **sayt** deb ataladi;
  «ilova» so'zi **0** (avvalgi qoralamada s9 sababi va flashcardda «ilova yopilsa ham» bor edi —
  «sayt/ilova» ikkilanishi §105/§112 sinfi). Yopilish-hodisasi ham bitta obrazda: **«telefon
  o'chsa ham»** (s0 · s5 · s9 · flashcard bir xil) — «sahifani yopsa» ISHLATILMAYDI, chunki
  «sahifa» bu darsda qavat nomi;
- 🔴 **Saqlanadigan narsa ham bir nom: «band joylar».** s0 hook · s5 test · s9 sabab · flashcard
  bir xil so'zni ishlatadi («yozilganlar» / «yozganlarim» varianti olib tashlandi);
- ❌ **Belgi-formula ekranda YO'Q** (ETALON 43): strelka, tenglik va tengsizlik belgilari
  o'quvchi matnida ishlatilmaydi — yo'l ham, tartib ham so'z bilan aytiladi («sahifadan serverga,
  serverdan bazaga»). Senariy-meta matnidagi strelka (bu hujjat) — ekran matni emas;
- ❌ «sir» o'zagi YO'Q (lint error) · «daftar» YO'Q (F-0729-04) · «chala» YO'Q (7-B.3) ·
  «mezon» YO'Q (53-qonun) · «... ko'zi bilan» qurilmasi YO'Q (korpus §46).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «ARXITEKTURA-QAVATLARI»** (registr R2 yo'lakchasi; 23-qonun: band ro'yxatdagi
birorta vizual klonlanmaydi).

> ⚠️ **Quruvchiga (metodist ogohlantirishi):** bu nom — **ichki yo'lakcha nomi**, ekranga
> chiqmaydi. «arxitektura» so'zi eyebrow, sarlavha, nav-yorliq, komponent-caption va
> `SCREEN_INTENTS` ekran-matnlarida **0** bo'lishi shart (kodda `ArxitekturaQavatlari` funksiya
> nomi bo'lishi mumkin, matn emas). Ekranda bu ekran shunchaki **«Uch qavat»** deb ataladi.

Ekranda **uch qavatli AvtoStoyanka sayti** turadi — xuddi uch qavatli bino kesimi:
tepada 📱 **ko'rinadigan sahifa**, o'rtada ⚙️ **server**, pastda 🗄 **baza**. Qavatlar boshda jim.

**1-bosqich (ochish):** o'quvchi qavatni bosadi → qavat yonadi va uning **bitta ish-gapi** ochiladi
(+ kichik mini-lahza vizuali):

| Qavat | Bosilganda ochiladigan ish-gap | Mini-lahza |
|---|---|---|
| 📱 Sahifa | Bo'sh joylarni **ko'rsatadi** va bosishni qabul qiladi. | «Band qilaman» tugmasi yonib-o'chadi |
| ⚙️ Server | Joy chindan bo'shligini **tekshiradi**. | tekshiruv-chirog'i yonadi |
| 🗄 Baza | Kim qaysi joyni olganini **eslab qoladi**. | jadvalga bitta qator yoziladi |

**2-bosqich (94-qonun — uchala qavat ochilgach):** «▶ Bitta bosishning yo'lini ko'ring» tugmasi
ochiladi. Bosilganda sahifadagi «Band qilaman» avto-bosiladi va **yorug' nuqta yo'l yuradi**:
sahifa → server → baza → yana sahifa; har to'xtashda bitta qisqa holat so'zi
(«qabul qilindi → tekshirildi → yozib qo'yildi → ko'rsatildi»).

Yakun-qatori (bitta gap):
> ✅ **Bitta bosish uch qavatdan o'tdi: sahifa ko'rsatdi, server tekshirdi, baza eslab qoldi.**

🔴 **Rang semantikasi (71-qonun):** har qavat o'z rangida va shu rang s8 indikatori, s9 qaror
kartalari va flashcardgacha O'ZGARMAYDI (aniq palitrani `pm-dizayn` 1-bo'lim pasportidan tanlaydi;
qizil `err` qavat-rangi bo'lolmaydi). Nuqta-yo'l `prefers-reduced-motion` da qadam-qadam statik
holatga tushadi.

**Nima uchun aynan shu:** «texnika ko'rinmaydi» — bu darsning bosh to'sig'i. Bola serverni ham,
bazani ham hech qachon KO'RMAGAN — u faqat kod yozgan. Bu ekranda u ko'rinmas qavatlarni birinchi
marta **bitta bosishning yo'li** sifatida ko'radi va har qavatning ishi uch oddiy fe'lga tushadi.
Shu uch fe'l keyin uning o'z ko'rsatuv-gaplariga aylanadi (s8).

🔴 **Band mexanikalardan farqi (23/26-qonun — OCHIQ asos):**
- **M2-D13 «uch qatlam o'xshatishi» EMAS:** u yerda o'quvchi qatlamga do'kon dunyosidan
  TAYYOR O'XSHATISH TANLARDI (peshtaxta · oshpaz · javon) va tinglovchida sinardi. Bu yerda
  o'xshatish umuman YO'Q — qavatlar o'z ishini o'z fe'li bilan aytadi, o'quvchi esa KUZATADI
  (bitta bosishning yo'li). Tanlov yo'q, sinov yo'q, boshqa dunyo yo'q.
- **M3-D14 «GAPSIZ KO'RSATUV» EMAS:** u yerda 4 kadr-tasma va gap-hukmlari edi; bu yerda tasma
  yo'q — vertikal qavat-kesim va yo'l-animatsiya.

🔴 **TEKSHIRUV mexanikasi (s9): «QAROR-SABAB TANLOVI»** — registr yo'lakchasi. Farq-asoslari
5-bo'limda (blok 5) ochiq yozilgan: MatchPairs'dan ham, M2-D13 juftlik-tanlovidan ham farqi bor.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D10/M3-D14 dagidek — etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Ma'lumotlar o'chib ketmaydimi?» | 1 | — | 2 tanlov · ovoz berish · payoff s2 ga ulanadi |
| s1 | MAQSAD — uch qavat-gap o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — ikki rost javob, bittasi yetib boradi | 3 | — | savol-karta + 2 javob-karta (46-qonun toggle) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **ARXITEKTURA-QAVATLARI** | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K12 to'rtinchi burchak (4 slayd + **2 bashorat** + uzluksiz hisoblagich) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | USTAXONA — o'z loyihasiga **3 qavat-gap** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **QAROR-SABAB TANLOVI** | 5 | — | 🔴 yangi mexanika |
| s10 | KODING — ko'rinmas qavatni ekranda ko'rsatish | 6 | — | 26/82/87-qonun · VS Code topshirig'i |
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
MODUL: 4 — Ma'lumot va bog'lanishlar
DARS: M4-D15 (15-dars)
DARS_MAVZUSI: Texnik qarorni oddiy tilda tushuntirish — uch qavat, uch gap
ISHLATILGAN_KEYS: K12
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: AvtoStoyanka saytingizni ochib ko'rsatyapsiz. Qarab turgan odam so'radi:
«Band qilingan joylar o'chib ketmaydimi?» Nima deb javob berasiz?
HARAKAT: O'quvchi ikki javobdan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL izoh ochiladi: ikkala javob ham rost — farqni keyingi ekranda sinab ko'ramiz.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff s2 da ochiladi (91a: keyingi ekran ruxsat).
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ko'pchilik texnik javobni tanlaydi — bu tabiiy: ular endigina shu so'zlarni
o'rgandi. Tanlovni muhokama qilmang, s2 o'zi ochadi.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Ostidagi izoh (ikkala tanlovda BIR XIL, maqtovsiz) |
|---|---|
| 🗄 «Ular PostgreSQL bazasida saqlanadi» deyman *(42)* | Ikkala javob ham rost. Keyingi ekranda ikkalasini yonma-yon qo'yib, qaysi biri savol bergan odamga yetib borishini ko'ramiz. |
| 🙂 «Telefon o'chsa ham band joylar turadi» deyman *(45)* | Ikkala javob ham rost. Keyingi ekranda ikkalasini yonma-yon qo'yib, qaysi biri savol bergan odamga yetib borishini ko'ramiz. |

> 🔴 **97-qonun:** savol o'quvchi bajargan harakatdan o'sadi — u m4-13/14 da saytini qurib
> tuzatdi, endi ko'rsatyapti; savolda aniq narsa (AvtoStoyanka) va harakat fe'li («o'chib
> ketmaydimi») bor. 🔴 **Tuzatildi (metodist):** avvalgi «Yozganlarim o'chib ketmaydimi?» —
> qarab turgan odam tilida yolg'on jaranglardi (u hech narsa yozmagan, u faqat qarab turibdi) va
> javob-variantidagi «yozilganlar» bilan ham to'qnashardi. Endi savol saytning REAL harakatiga
> bog'landi: **«Band qilingan joylar o'chib ketmaydimi?»**
> 🔴 **104-qonun:** to'g'ri javob YO'Q — izoh ikkala tanlovda so'zma-so'z bir xil, hech biri
> «to'g'ri sezdingiz» olmaydi; ikkala tanlov matni ham javob-shaklida va teng uzunlikda (42 ↔ 45).
> 🔴 **100-qonun:** tanlov `pm-m4d15-hook-choice`ga faqat YOZILADI, hech qayerda o'qilmaydi.
> 🔴 **Korpus §97 (yakka rejim):** ovoz-diagrammasi faqat jonli darsda; «ko'pchilik/sinf/ovozlar»
> o'quvchi matnida **0**; payoff ikkala rejimda bir xil o'qiladi.
> 🔴 **62-qonun:** «qavat» ham, «ko'rsatuv» ham bu ekranda YO'Q — «qavat» s1 da, «ko'rsatuv»
> s6 ko'prik-gapida tug'iladi (bir ekranda bittadan yangi nom).

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Saytingiz uch qismdan turadi: ko'rinadigan sahifa (texnik darslarda — front), server
va baza. Ularni qavat deymiz (ba'zan qatlam ham deyishadi), xuddi binoning qavatlari kabi.
Dars oxirida har qavat nima qilishini bitta oddiy gap bilan istalgan odamga aytib bera olasiz.
HARAKAT: O'quvchi kuzatadi: uch qavat-karta o'z-o'zidan yozilib chiqadi — tepadan pastga.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kartalar yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

**Preview-kartalar (uch qavat NOMI va bitta fe'li — s4 ni ochib qo'ymaydi):**
1. 📱 «Sahifa — ko'rsatadi.»
2. ⚙️ «Server — tekshiradi.»
3. 🗄 «Baza — eslab qoladi.»

> 🔴 **Tuzatildi (metodist · spoyler):** avvalgi preview-kartalar («Sahifa bo'sh joylarni
> ko'rsatadi», «Server joy bo'shligini tekshiradi», «Baza kim qaysi joyni olganini eslab qoladi»)
> s4 da bosib ochiladigan ish-gaplarning deyarli AYNAN o'zi edi — ya'ni darsning o'zagi s1 da
> ochib qo'yilardi va s4 «kashfiyot» bo'lishdan to'xtardi. Endi s1 faqat **nom + fe'l** beradi
> (uch so'z), s4 esa har qavat AYNAN nimani ko'rsatishi/tekshirishi/eslab qolishini ochadi —
> induktiv zina saqlanadi va 106d-detektor uchun namuna-gap faqat s4 da qoladi.
> 🔴 **§104 (bosh ta'rif — ta'rif-gap):** «qavat» birinchi gapda hodisa → nom tartibida to'liq
> ochiladi; «ko'rsatuv» atamasi bu ekranda YO'Q — u s6 ko'prik-gapida tug'iladi (atama-yuki
> bir ekranda bittadan).
> 🔴 **42-qonun:** kartalar «o'z-o'zidan yozilib chiqadi» (to'lmaydi).
> 🔴 **54(b/c):** `ta-sub` ikkinchi qator YO'Q · demo ostidagi caption YO'Q.
> 🔴 **18-qonun:** jonli preview, statik siluet emas.
> ⚠️ **Spoyler-eslatma:** s1 kartalari nom + fe'ldan iborat, ya'ni ko'chirib bo'lmaydi; namuna-gap
> faqat s4 da chiqadi va 106d-detektor s8 da AYNAN o'sha s4 gaplarini qaytaradi (5-bo'lim).

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (arxitektura-qavatlari) + 3 × Quiz
EKRAN: Rost javob ham notanish so'z bilan aytilsa, odamga yetib bormaydi. Ishni oddiy so'z
bilan aytsangiz — yetib boradi.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) savol-kartani o'qib, ikki javob-kartani bosib solishtiradi; (s4) uch qavatni
bosib ish-gaplarini ochadi, so'ng bitta bosishning yo'lini ko'radi; (s6) keys-slaydlarini
ikki bashorat bilan ochadi.
JAVOB: s2 — texnik javob rost, lekin odam undan hech narsa tushunmaydi; s4 — sahifa
ko'rsatadi, server tekshiradi, baza eslab qoladi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da uchala qavat ochilgach so'rang: telefon o'chganda band joylarni qaysi
qavat ushlab qoladi? Javobni aytmang — s5 testi shuni so'raydi.
```

**s2 — TEORIYA-1: ikki rost javob** (hook-payoff shu yerda)

Sarlavha (savol-murojaat, ruxsat): **«Ikkala javob ham rost — qaysi biri yetib boradi?»**

Tepada savol-karta (material): 🗣 «Band qilingan joylar o'chib ketmaydimi?»
Ostida ikki javob-karta, bosilganda ochiladi (46-qonun toggle):

| Karta | Ochilganda |
|---|---|
| 🗄 «Ular PostgreSQL bazasida saqlanadi» | Javob rost. Lekin so'ragan odam «PostgreSQL» so'zini birinchi marta eshityapti — bu so'z unga hech narsa aytmaydi. |
| 🙂 «Telefon o'chsa ham band joylar turadi» | Odam o'z savoliga javob oldi: band joylar turaveradi. Texnik so'z kerak ham bo'lmadi. |

Xulosa-karta (69-qonun · blok-gapining O'ZI):
> **Rost javob ham notanish so'z bilan aytilsa, odamga yetib bormaydi.** Ishni oddiy so'z bilan aytsangiz — yetib boradi.

> 🔴 **62-qonun:** «texnik so'z» atamasi hodisadan KEYIN: avval «bu so'z unga hech narsa aytmaydi»
> hodisasi, xulosadan so'ng mentor bir gap bilan nomlaydi: «Odam bilmaydigan bunday kasb-so'zlarni
> texnik so'z deymiz.»
> 🔴 **Tuzatildi (metodist · kollokatsiya):** «notanish so'zda aytilsa» → «notanish so'z **bilan**
> aytilsa» (vosita kelishigi); «unga notanish so'z **tegdi**» → «bu so'z unga hech narsa
> **aytmaydi**» (ruscha «unga tegdi» kalkasi ketdi va TEST-1 varianti bilan so'zma-so'z
> to'qnashuvi ham yo'qoldi — §106).
> 🔴 **88-qonun (yurish):** ikki javob-kartaning ochilmagani bo'ylab puls yuradi; ikkalasi ham
> ochilishi shart (`seen 2/2`), xulosa shundan keyin chiqadi + avto-scroll (77-qonun).
> ⚠️ **Ekran-o'lchovi (proza, Intl.Segmenter):** sarlavha + xulosa + mentor ≈ **240 grapheme**
> (savol-karta va javob-kartalar — material, sanalmaydi). Chegara 400 ✓.

**s4 — YADRO: ARXITEKTURA-QAVATLARI** (markaziy mexanika — to'liq spets 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Uch qavatni bosib, har birining ishini o'qing.»**

Mentor (1 gap — sahnani qo'yadi, buyruqni takrorlamaydi):
> Pastda AvtoStoyanka saytingiz uch qavatga ajratib qo'yilgan.

> 🔴 **Tuzatildi (metodist · §28):** «— qavatlar hozircha jim» olib tashlandi: jonsiz narsaga
> odam-fe'li (jim turish) 13 yoshli o'quvchini gapga qaytaradi; «jim» holati vizualda ko'rinib
> turibdi (xira qavatlar), matn uni takrorlamaydi (109-TMI).

Ish-gaplar, mini-lahzalar, 2-bosqich va yakun-qatori — 1-bo'lim jadvalida (ekranda AYNAN shu matnlar).

> 🔴 **98b:** mentor qavatlarning ishini AYTMAYDI — o'quvchi bosib o'zi o'qiydi.
> 🔴 **72-qonun:** qavat-kesim yorliqli idishda, diqqat-pulsi bilan; birinchi bosishda puls tinadi.
> 🔴 **88-qonun (yurish):** puls ochilmagan qavatlar bo'ylab (tepadan pastga); uchalasi ochilgach
> navbat «▶» tugmasiga o'tadi (94-qonun: 2-bosqich shundagina ochiladi).
> 🔴 **106-budjet:** sarlavha → qavat-kesim → (uchalasi ochilgach) ▶ yo'l → yakun-qatori. Boshqa
> blok qo'shilmaydi.
> 🔴 **§117 (yo'nalish-fe'li):** nuqta-yo'l matnlarida yo'nalish real oqimga mos: sahifa so'rovni
> **serverga** yuboradi, server **bazaga** yozadi, javob **sahifaga** qaytadi.

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (USTAXONA) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish ustaxonasi)
EKRAN: (sarlavha) Loyihangizning uch qavatiga bittadan gap yozing.
(mentor, 1 gap) Qarab turgan odam uchun yozasiz — u kod bilmaydi.
HARAKAT: Uch qavat-gapni BITTALAB yozadi: sahifa nimani ko'rsatadi, server nimani
tekshiradi, baza nimani eslab qoladi. Saqlangach gap o'ngdagi qavat-kesimga ko'chadi.
JAVOB: Uch gap yozilgan · har gap texnik so'zsiz · har gap o'z loyihasining aniq ishini aytadi.
RO'YXAT: Har qavatga bitta gap · Gaplarda texnik so'z yo'q · Har gap loyihangizning aniq
ishini aytadi
YULDUZCHA: «Eslab qoladi» gapida aynan nimalar saqlanishini ayting — pastdagi maydon
nomlari bilan.
YORDAM: Gapni ipuchadagi savolga javob qilib yozing: bitta gap, texnik so'zsiz.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Eng ko'p xato — gapga «fetch», «JSON» kirib qoladi. Javob-qatori uni tutadi;
siz muhokama qiling: bu so'zni qarab turgan odam qayerdan bilsin?
```

> 🔴 **Tuzatildi (metodist · ETALON 25/32):** **(a)** mentor endi shart-ro'yxatini aytmaydi
> («texnik so'zsiz» sharti chip'da turibdi) — o'rniga SABABni aytadi: «u kod bilmaydi»;
> **(b)** checklist yorliqlari ≤5 so'zga tortildi; **(c)** YORDAM qayta yozildi: avvalgisi
> («Eng osonidan boshlang: bazangiz nimani eslab qoladi») mexanikaga ZID edi — ekran gaplarni
> BITTALAB, tartib bilan so'raydi (1-qadam «ko'rsatadi»), ya'ni bola uchinchi qadamdan
> boshlolmaydi (§113); yangi yordam uchala qadamda ham ishlaydi (§116);
> **(d)** YULDUZCHA «sxemangizdagi» so'zidan tozalandi — sxema saqlanmagan bo'lsa (zaxira
> tarmoq) gap yolg'on chiqardi; «pastdagi maydon nomlari» ikkala tarmoqda ham rost (§69).

To'liq spetsifikatsiya — 5-bo'limda.

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (qaror-sabab tanlovi)
EKRAN: (sarlavha) Har qarorga uni tushuntiradigan sababni tanlang.
(yo'riqnoma, ≤20 so'z) Qaror texnika tilida yozilgan. Sabab esa qarab turgan odam
tilida — uchtadan bittasi mos.
HARAKAT: Uch texnik qaror BITTALAB ochiladi; har biriga uch sababdan mosini tanlaydi.
Xato tanlovda qoida-qatori chiqadi, to'g'risida bir qatorlik izoh.
JAVOB: Q1↔S-A · Q2↔S-B · Q3↔S-C (jadval quyida).
RO'YXAT: —
YULDUZCHA: —
YORDAM: Bitta savol yetadi: bu qaror odamni qaysi noqulaylikdan qutqaradi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Uch gapingizdan bittasini sherigingizga o'qing — u qaysi qavat ekanini topsin.
Topolmasa, gap qavatning ishini aytmagan — birga tuzating.
MENTORGA: SOFT — sinf ish-tartibi, u faqat shu eslatmada turadi (o'quvchi ekranida yo'q).
Juftliklarga 2 daqiqa bering, 2-3 gapni ovoz chiqarib muhokama qiling.
```

**Uch qaror va uch sabab (sabablar uchala qadam davomida bir xil turadi):**

| Qaror (texnika tilida) | Mos sabab (odam tilida) |
|---|---|
| Q1. Band joylar ro'yxati bazada saqlanadi | S-A. Telefon o'chsa ham band joylar unutilmasligi uchun |
| Q2. Joy bo'shligini server tekshiradi | S-B. Ikki odam bir joyni baravar band qilib qo'ymasligi uchun |
| Q3. Sahifa ro'yxatni serverdan so'rab oladi | S-C. Ro'yxat hammada bir xil ko'rinishi uchun |

**Fidbek (106d — ikki tomonlama, darhol):**
- To'g'ri: ✅ bitta qator (masalan Q1: «Baza — eslab qolish uchun: telefon o'chsa ham turadi.»)
- Xato: 🤔 «Bu sabab boshqa qarorni tushuntiradi. Bu qaror odamni qaysi noqulaylikdan
  qutqaradi?» (qizil YO'Q, bloklamaydi)

Yakun-qatori:
> ✅ **Texnik qarorni odamga foydasi tushuntiradi.**

> 🔴 **Mexanika-farqi (26-qonun — OCHIQ asos):** **(a)** MatchPairs EMAS — u ikki ustunni erkin
> nom-nomga juftlash doskasi; bu yerda qarorlar BITTALAB ochiladi (94-qonun) va bola QARORNI
> SABABGA bog'laydi — nomni nomga emas, mazmunni mazmunga. **(b)** M2-D13 «texnik↔odamcha
> juftlik-tanlovi» EMAS — u SO'Z-ALMASHTIRISH edi (texnik so'z → sodda sinonim, ma'no o'zgarmaydi);
> bu yerda so'z almashmaydi — QARORGA uning ODAM-FOYDASI bog'lanadi (boshqa turdagi mazmun).
> **(c)** M4-D12 artefakt-checklist EMAS — u ro'yxat-tekshiruv; bu tanlov-bog'lash.
> 🔴 **PM_Prompt_v8 tekshiruv-turi:** bu «variant tanlash» testi emas — sootnesenie (MatchPairs
> M7-D2/M8-D1 da TEKSHIRUV sifatida qabul qilingan janr), unscored, PRACTICE signal.
> 🔴 **§116:** YORDAM-savoli («qaysi noqulaylikdan qutqaradi?») uchala to'g'ri javobga ham olib
> boradi. 🔴 **§98:** xato-qatori juftlikni NOMLAMAYDI — qoida beradi.
> 🔴 **§102:** sabablar bir-birining ma'nodoshi emas — uch xil noqulaylik (unutilish ·
> to'qnashuv · eskirgan ro'yxat).
> 🔴 **M2-D13 dan farq — MATN darajasidagi dalil (metodist tekshiruvi):** M2-D13 «so'z-elagi»da
> almashtirish so'zma-so'z va bir ma'noda edi («massivda» → «ro'yxatda», «localStorage» →
> «brauzer eslab qoladi») — ya'ni juftlikning ikki tomoni SINONIM. Bu yerda esa har sabab
> qarorda umuman yo'q **yangi vaziyat + oqibat** olib keladi: «bazada saqlanadi» ↔ «telefon
> o'chsa ham unutilmasligi uchun» (yangi vaziyat: telefon o'chdi) · «server tekshiradi» ↔ «ikki
> odam bir joyni baravar band qilib qo'ymasligi uchun» (yangi qatnashchi: ikkinchi odam) ·
> «serverdan so'rab oladi» ↔ «ro'yxat hammada bir xil ko'rinishi uchun» (yangi ko'z: boshqa
> odamlar ekrani). Uchala juftlikning birortasi ham sinonim-almashtirish emas ✓ — janr chegarasi
> matn darajasida ham ushlab turibdi.
> 🔴 **44-qonun:** mentor-rejimda to'g'ri juftliklar reveal'gacha ko'rinmaydi.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code topshirig'i)
EKRAN: (sarlavha) Ko'rinmas qavatni ekranda ko'rsatadigan kod yozamiz.
(mentor) Baza ishlayotganini qarab turgan odam ko'rmaydi. Sahifada odam tilida chiqadigan
bitta qator buni ko'rsatib beradi — shu qatorni holat-qatori deymiz.
HARAKAT: O'z loyihasini VS Code'da ochadi; tugma bosilganda serverdan ro'yxatni olib,
sahifada odam tilidagi holat-qatorini chiqaradi. Keyin o'zi bosib ko'radi.
JAVOB: Tugma bosilganda sahifada holat-qatori chiqadi (o'quvchi o'z brauzerida ko'radi).
RO'YXAT: Serverdan ro'yxat keladi · Sahifada odam tilidagi holat-qatori chiqadi ·
O'zingiz bosib ko'rdingiz
YULDUZCHA: Ro'yxat bo'sh bo'lsa ham odam tilida ayting: «Hali birorta joy band emas».
YORDAM: Avval nechta joy band ekanini chiqaring: yozuvlar.length. Odam tilidagi gapni
keyin qo'shing.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Bu topshiriq s8 dagi «eslab qoladi» gapini isbotlaydigan qiladi — shuni ochiq
ayting: holat-qatori bo'lmasa, baza ishlayotganini odam bilmaydi.
```

> 🔴 **Tuzatildi (metodist · §104):** «holat-qatori» — darsning yagona yangi narsa-nomi, lekin
> avvalgi mentor-gapida u **ta'rifsiz** kirib kelardi («sahifadagi holat-qatori uni ko'rsatib
> beradi» — bola «holat-qatori nima?» deb qoladi). Endi tartib: hodisa (odam ko'rmaydi) → narsa
> (odam tilida chiqadigan bitta qator) → nom (holat-qatori). 🔴 YORDAM'dagi referentsiz «sonini»
> (§24) → «nechta joy band ekanini».

To'liq spetsifikatsiya — 7-bo'limda.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uchala gapingizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan ayting: sahifa nimani ko'rsatadi, server nimani tekshiradi,
baza nimani eslab qoladi. Avval sherigingizga ayting, keyin bir qatorda yozing.
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
MENTORGA: Uchdan biri server gapini ayta olmasa — s4 ni qayta oching va yo'l-animatsiyani
birga kuzating.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha
> «O'zingizni sinab ko'ring.» · **76-qonun:** mentor niyatni ochiq aytadi, dars atamalari bilan.
> 🔴 **Yakka rejim (korpus §97):** sherik yo'q o'quvchiga «Avval ovoz chiqarib o'zingizga
> ayting, keyin bir qatorda yozing» — ikki tarmoq bir shakl, bir uzunlikda.

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda yozgan gaplaringizni kod yozmaydigan odamga aytib sinaysiz: qaysi gapdan keyin
u qaytadan so'rasa — o'sha gapni tuzatasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
HARAKAT: Gaplarni jonli odamda sinab, qayta so'ralganini ✎ tahrirlash bilan tuzatadi.
JAVOB: —
RO'YXAT: Kod bilmaydigan odamga aytilgan · Qayta so'ralgan gap tuzatilgan ·
Tuzatilgan gap qayta saqlangan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: «Eslab qoladi» gapingizni kod yozmaydigan odamga aytib sinang — u qaytadan
so'rasa, gapni tuzatib qayta saqlang.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa.
Muddat — Demo Day'gacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §96:** tepadagi EKRAN matni SONNI aytmaydi — «uchala gap» sanog'i faqat
> To'liq-kartada. 🔴 **Korpus §115:** karta sarlavhasi savol: «📝 Uyda nima qilasiz?».
> 🔴 **Namunasiz harakat taqiqi:** aytib sinash s12 da, ✎ tahrirlash s8 da ko'rsatilgan.
> 🔴 **Tuzatildi (metodist · aniq-fe'l):** «savol tug'ilsa / savol tug'dirgan gap» — kitobiy va
> o'lchab bo'lmaydigan; o'quvchi uyda AYNAN nimani kuzatishini bilmaydi. Endi kuzatiladigan
> hodisa aytiladi: **«u qaytadan so'rasa»**. Checklist yorliqlari ham ≤5 so'zga tortildi
> (ETALON 25).
> 🔴 M1-D14 «ota-ona savollari» mexanikasi EMAS — savol-kartalar yo'q, shunchaki jonli sinov.

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
MAVZU: Saytning uch qavati va ularning ishi (sahifa ko'rsatadi, server tekshiradi, baza
eslab qoladi); texnik so'z bilan javob nima beradi; bitta bosishning yo'li; texnik
qarorni odamga foydasi tushuntirishi; Airbnb aytib bergan besh qadamda sayt qanday
qurilgani yo'qligi; sahifadagi holat-qatori.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) ·
> 105b (bir nafasda) · 21 (glossli — scored matnda izohsiz chet so'z 0) · §99 (variantlar savol
> shaklida) · §102 (distraktor darsning o'z ekranida rost emas) · §108 (rostni rad ettirmaydi) ·
> §110 (mutlaq so'z / kulgili-bo'sh yo'q) · §118 (cheklov-so'zi bilan hallolash yo'q).
> Qavsdagi son = belgi soni; to'g'ri javob indekslari taqsimoti: B · C · B · A (naqshsiz).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🗣 «Ma'lumot qayerda turadi?» deb so'rashdi. Javobingizda texnik so'z bo'lsa,
so'ragan odam nimani oladi?
- A. Yana ham aniqroq javob oladi *(28)*
- **B.** Javob o'rniga notanish so'z oladi ✅ *(33)*
- C. Xuddi shu javobni qisqaroq oladi *(32)*

**Reveal:** To'g'ri — so'z notanish bo'lsa, javob yetib bormaydi. Ishni aytsangiz — yetib boradi.

> 🔴 **17-qonun:** A — kuchli distraktor (texnik so'z chindan aniqroq TUYULADI, lekin s2
> ko'rsatdi: aniqlik so'ragan odamga yetib bormaydi); C darsning hech bir ekranida rost emas.
> Uchala variant «… oladi» shaklida (§99). Uzunlik-tell: 33 ÷ 32 = 1.03 ✓.
> 🔴 **Tuzatildi (metodist · §106):** savol avval s2 vaziyatining o'zini takrorlardi («Savolga
> texnik so'z bilan javob bersangiz…») — bola javobni s2 kartasidan ko'chirib olardi. Endi
> YANGI savol-vaziyat («Ma'lumot qayerda turadi?») beriladi: qoida o'sha, lekin bola uni yangi
> holatga qo'llaydi. s2 kartasidagi «notanish so'z tegdi» iborasi ham olib tashlangani uchun
> B varianti endi hech qayerda so'zma-so'z turmaydi.

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 📵 Kechqurun telefonni o'chirdingiz. Ertalab saytga kirsangiz — band joylar
joyida turibdi. Bu qaysi qavatning ishi?
- A. Yuqori qavat — sahifa *(21)*
- B. O'rta qavat — server *(20)*
- **C.** Pastki qavat — baza ✅ *(19)*

**Reveal:** To'g'ri — eslab qolish bazaning ishi: telefon o'chsa ham band joylar turadi.

> 🔴 **§106:** savol s4 gapini ko'chirmaydi — yangi vaziyat (telefon o'chdi), bola «joyida
> turibdi → eslab qolish → baza» ko'prigini o'zi quradi; variantlarda fe'l YO'Q (fe'l javobni
> aytib qo'yardi), faqat qavat o'rni + nomi. Uzunlik-tell: 21 ÷ 19 = 1.11 ✓.

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🏠 Airbnb aytib bergan besh qadamda qaysi biri aytilmagan?
- A. Odamlar nimadan qiynalgani *(26)*
- **B.** Saytni qanday qurgani ✅ *(21)*
- C. Ishni kim qilayotgani *(21)*

**Reveal:** To'g'ri — besh qadam odam va mahsulot haqida bo'lgan; saytni qanday qurgani
ularning orasida yo'q.

> 🔴 **10-qonun (keys-sadoqati) + §101:** A va C bankdagi besh qadamda BOR (qiyinchilik ·
> jamoa) — ya'ni «aytilmagan» savoliga javob bo'lolmaydi; faqat B himoyalanadi. Savol ham,
> reveal ham **besh qadam** doirasidan chiqmaydi: «bironta varaqda yo'q» kabi bank tashqarisiga
> chiqadigan mutlaq inkor ishlatilmagan.
> 🔴 **§108:** bola o'zi rost deb bilgan narsani rad etmaydi — u s6 da ko'rgan besh qadamga
> tayanadi (A va C rost bo'lgani uchun aynan javob bo'lolmaydi).
> 🔴 **§106:** bashorat-1 «qaysi biri yo'q?» deb TAXMIN so'ragan edi (ro'yxat hali ochilmagan);
> bu yerda ro'yxat ochilgandan keyin bola uchta ANIQ gapni ro'yxatga solishtiradi — ko'chirma
> emas, qo'llash. Uzunlik-tell: 26 ÷ 21 = 1.24 ✓ (to'g'ri javob eng uzun ham, yolg'iz shakl ham
> emas — uchalasi «… -gani» ot-shaklida, §99).

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **A (indeks 0)**
**Savol:** 🎤 Ko'rsatuvda texnik qarorning sababi qanday aytiladi?
- **A.** Qaror odamga nima berishi aytiladi ✅ *(32)*
- B. Qavat nomlari birma-bir sanab beriladi *(35)*
- C. Kod qatorlari ochib ko'rsatiladi *(30)*

**Reveal:** To'g'ri — texnik qarorni odamga foydasi tushuntiradi, texnika so'zlari emas.

> 🔴 **§99:** uchala variant «qanday aytiladi?» savoliga usul bilan javob beradi.
> 🔴 **§102:** B — s4 da qavat nomlari chindan sanaladi, LEKIN u yerda hech qachon «sabab»
> sifatida emas (ekran-rost tekshiruvi o'tdi); C darsda umuman ko'rsatilmagan usul.
> Uzunlik-tell: 35 ÷ 32 = 1.09 ✓. **55-qonun:** savol yalang'och · **105:** `title h-ask`.

---

## 5. USTAXONA SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira, ostida nomlari —
**«Ko'rsatadi» · «Tekshiradi» · «Eslab qoladi»** (uch qavat-fe'li, s4 bilan bir xil so'zlar;
har doira o'z qavat-rangida — 71-qonun). Yozilgani yashil ✓, joriysi pulsda, kelgusi xira-punktir.

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida **bitta maydon** —
qavat-gap (bitta jumla). Yozish paytida yozilganlar ro'yxati KO'RINMAYDI (80c) — uchalasi
saqlangach qavat-kesim to'liq enda ochiladi (✎ tahrir shu yerda).

**Maydon-ipuchalari (92c/85 — qisqa savol, bir tilda §115, tayyor javob TURMAYDI):**

| Qadam | Ipucha |
|---|---|
| 1 · Ko'rsatadi | «Sahifangiz odamga nimani ko'rsatadi?» |
| 2 · Tekshiradi | «Serveringiz nimani tekshiradi?» |
| 3 · Eslab qoladi | «Bazangiz nimani eslab qoladi?» |

**3-qadam materiali (kirish-artefakt):** maydon ostida chip-qator — sxema maydon-nomlari
(faqat shu qadamda ko'rinadi, 92-qonun):
- **Artefakt BOR:** «Sxemangizdagi maydonlar pastda turibdi — bazangiz aynan shularni eslab qoladi.»
- **Artefakt YO'Q:** «AvtoStoyanka sxemasining maydonlari pastda turibdi — baza aynan shularni
  eslab qoladi.» *(zaxira uchligi: joy raqami · kim band qilgani · qaysi kungacha)*
- 🔴 «topilmadi / saqlanmagan / bo'sh» so'zlari **0** (korpus §69) · ikki tarmoq bir shaklda,
  ikkinchi yarmi so'zma-so'z bir xil ✓.

**106d javob (ikki tomonlama, saqlash paytida — alohida checklist-panel YO'Q):**
- ✅ «Texnik so'zsiz — qarab turgan odam tushunadi.»
- 🤔 (texnik so'z detektori — ro'yxat: *fetch · JSON · API · PostgreSQL · SQL · endpoint · JWT ·
  token · React · props · kod · funksiya · massiv*) → «"{so'z}" — texnik so'z. Bu qavat odamga
  nima qilib berishini yozing.»
- 🤔 (gap demo-namuna bilan aynan bir xil — **s4 ning uch ish-gapi** ro'yxatdan tekshiriladi;
  s1 kartalari nom + fe'ldan iborat, ko'chirish predmeti emas) →
  «Bu — darsdagi namuna gapi. O'z loyihangiz aynan nima qilib berishini yozing.»
- 🤔 (qisqa qolsa) «Qisqa qoldi: to'liq gap bilan yozing.»
- Holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

**Saqlov:** har saqlashda `pm-m4d15-pitch.qavatlar[]` yangilanadi; 3-saqlashda ekran O'ZI
bajarildi (honor-tugma yo'q — real signal, `PRACTICE_BASE+8`).

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K12 · 91b/33/43/56/100/§101)

**Freym (91b):** eyebrow — **«🏠 Haqiqiy voqea»**, K-kodi ekranga chiqmaydi.

🔴 **TO'RTINCHI BURCHAK (majburiy).** K12 uch darsda ishlatilgan, band matn va bashoratlar
(shapkada) TAKRORLANMAYDI. Bu dars burchagi: **Airbnb aytib bergan besh qadamda «sayt qanday
qurilgani» qadami YO'Q**, mahsulot qadamida esa **mahsulotning o'zi — odamga qiladigan ishi**
turadi.

🔴 **INKOR CHEGARASI — METODIST TUZATISHI (F-0813-01 sabog'ining aynan takrori edi).**
Qoralamada da'volar mutlaq shaklda turgan edi: «bankdagi varaq-ro'yxatida texnika varag'i
**umuman yo'q**», «Sayt qanday qurilgani haqidagi varaq — **bitta ham yo'q**», «Qanday qurilgani
esa **bironta varaqda** aytilmagan». Bank esa boshqa narsa deydi: «**около десятка** простых
слайдов: проблема → решение → рынок → продукт → команда» — ya'ni ro'yxat ~10 VARAQNI emas,
**tartibning besh qadamini** sanaydi. Demak «bironta varaqda yo'q» — bank tashqarisiga chiqadigan
asossiz inkor (M3-D14 da aynan shu sinf arena-savolini buzgan edi). 🔧 **Yechim:** har gap
**«besh qadamda yo'q»** shakliga o'tkazildi — bu ro'yxatning O'ZIDAN chiqadigan halol kuzatuv.
Burchak kuchi yo'qolmadi: bola baribir «texnika o'z varag'ini olmagan» xulosasiga keladi, lekin
dars unga bank tekshirmagan gapni fakt qilib bermaydi.
📌 Qo'shimcha: bankdagi «около десятка слайдов» va «tartib» ikkalasi bir gapda berilgani uchun
slayd-2 «varaqlar shu besh qadam bo'yicha ketgan» deb ochadi — «qolgan varaqlarda nima bo'lgan?»
degan javobsiz savol tug'ilmaydi.

🔴 **KEYS-EKRAN QOIDASI (registr R3):** **2 bashorat ikki O'LCHOVDA** — b1: qadam TURI
(«qaysi qadam yo'q?») · b2: qadam MAZMUNI («mahsulot qadamida nima aytilgan?») —
**+ UZLUKSIZ HISOBLAGICH:** ekran tepasida bitta doira-qator: 4 slayd-doira orasida 2 ta 🎲
taxmin-nuqtasi; ochilgan doira bo'yalgan holatga o'tadi, taxmin topilsa 🎯, adashsa ⚪ bo'lib
QOLADI (qizil yo'q,
reset yo'q — hisoblagich ekran oxirigacha uzluksiz). Ball-relsga yozilmaydi.

**Oqim (4 slayd + 2 bashorat):**

1. **Slayd-1:** «Airbnb — odam boshqa birovning uyida ijaraga turadigan sayt. O'z ishini
   birinchi marta tushuntirganda qo'lida o'nga yaqin oddiy varaq bor edi — o'sha varaqlar
   bugungacha internetda ochiq turibdi.»
2. **Bashorat-1** *(o'lchov: qadam turi)* — «Varaqlar besh qadam bo'yicha ketgan. Sizningcha,
   o'sha beshtaning ichida qaysi biri yo'q?» → «Odamlarning qiyinchiligi» *(24)* ·
   «Ishni kim qilayotgani» *(21)* · «Sayt qanday qurilgani» ✅ *(21)*
3. **Slayd-2 (reveal):** «Besh qadam shunday bo'lgan: odamlarning qiyinchiligi, yechim, buni
   qancha odam kutayotgani, mahsulot va jamoa. Sayt qanday qurilgani bu beshtada yo'q.»
4. **Bashorat-2** *(o'lchov: qadam mazmuni)* — «Beshtaning ichida "mahsulot" qadami bor.
   Sizningcha, unda nima aytilgan?» → «Saytda nechta uy borligi» *(24)* ·
   «Sayt odamga nima berishi» ✅ *(24)* · «Sayt qaysi shaharda ishlashi» *(28)*
5. **Slayd-3 (reveal):** «Mahsulot qadamida mahsulotning o'zi turgan: sayt odamga nima qilib
   berishi.»
6. **Slayd-4 (xulosa):** «Besh qadamning hammasi odam va mahsulotning ishi haqida — texnika
   o'ziga alohida qadam olmagan.»

**Natija-qatorlari (56/100-qonun — quyruqsiz, «ball emas» izohisiz, hook-echo yo'q):**
- b1: topsa «🎯 Topdingiz! Besh qadamda "sayt qanday qurilgani" yo'q» · adashsa «Adashdingiz —
  asl javob: "sayt qanday qurilgani" yo'q»
- b2: topsa «🎯 Topdingiz! Sayt odamga nima berishi aytilgan» · adashsa «Adashdingiz — asl
  javob: sayt odamga nima berishi aytilgan»
- Tepa-yorliq (79-qonun): «🎲 Avval o'zingiz belgilab ko'ring»

**Ko'prik-gap (91b · 44-qonun):**
> Airbnb besh qadamda texnikani emas, mahsulotning ishini aytgan. Siz ham ishingizni odam
> oldida ochib tushuntirasiz — buni ko'rsatuv deymiz. Uch qavatingiz unda o'z ishini aytadi:
> nimani ko'rsatadi, nimani tekshiradi, nimani eslab qoladi.

> 🔴 **10-qonun:** raqam · sana · pul · «investor» · «millionlab» YO'Q; «o'nga yaqin varaq» —
> bankdagi «около десятка» ning o'zi. Tinglovchi umuman nomlanmaydi.
> 🔴 **Gloss (metodist qo'shdi):** slayd-1 ga «Airbnb — odam boshqa birovning uyida ijaraga
> turadigan sayt» qaytarildi. M2-D13 va M3-D14 da bu izoh bor edi, bu yerda tushib qolgan edi —
> ikki modul o'tgan, bola kompaniya nomini eslamasligi mumkin, izohsiz esa butun keys havoda
> qoladi (§20/21).
> 🔴 **§43 (zinapoya):** b1 variantlari — besh qadamning ikkitasi + ro'yxatda yo'q bittasi
> (bitta o'lchov: qadam turi); b2 variantlari — mahsulot qadamida bo'lishi mumkin bo'lgan uch
> mazmun (bitta o'lchov: nima aytilgan). Ikki bashorat ikki xil narsani o'lchaydi ✓
> 🔴 **§102 (bashorat-chipi):** b2 ning distraktorlari («nechta uy borligi», «qaysi shaharda
> ishlashi») bolaning kundalik kuzatuvida ham, dars ekranida ham rost emas; «sayt qanday
> qurilgani» chipi b2 dan OLIB TASHLANDI — b1 reveali uni allaqachon rad etgani uchun u
> o'z-o'zini fosh qiladigan variant bo'lib qolardi (§110).
> 🔴 **§106:** «besh qadamda yo'q» formulasi bashorat-reveal va slayd-2 da; TEST-3 esa uchta
> ANIQ gapni ro'yxatga solishtirishni so'raydi — ko'chirma emas, qo'llash.
> 🔴 **Band matn tekshiruvi:** «o'nga yaqin sodda slayd» (M2-D13) va «o'ntacha oddiy varaq ...
> tushuntirgan» (M3-D14) jumlalari so'zma-so'z OLINMADI — slayd-1 yangi qurilishda; band uchala
> burchak (tuzilish · tinglovchi · tartib+jamoa) bu darsda kashfiyot sifatida ishlatilmaydi.
> 🔴 **Tartib-burchagi bilan to'qnashmaslik (M3-D14):** slayd-2 besh qadamni **to'plam** sifatida
> sanaydi — «avval … keyin … oxirida» ketma-ketlik so'zlari ATAYLAB yo'q, chunki tartibning O'ZI
> M3-D14 ning burchagi edi (u yerda RECAPS «aniq tartib» deb o'rgatgan). Bu yerda ro'yxat faqat
> **nima yo'qligini** ko'rsatish uchun keladi.

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · VS Code topshirig'i)

> 🔴 **87-qonun (o'tilgan texnik material, `App.jsx` MODULES m4 dan grep):** m4-04 Express
> endpoint · m4-06 SQL so'rovlari · m4-09 API/status kodlari · m4-10 **fetch, front↔back ulash** ·
> m4-13 **o'z fullstack loyihasi (baza + server + panel)** · M3 dan React/useState/onClick ·
> M2 dan funksiya. Topshiriqda shundan tashqari hech narsa yo'q (useEffect ISHLATILMAYDI —
> tugma-bosish bilan yuklanadi).
> 🔴 **26-qonun (R1 navbati):** m4-12 kompilyator → **m4-15 VS Code topshirig'i** ✓.
> 🔴 **M3-D14 koding-farqi:** u yerda serversiz `useState` toggle (tasdiq qatori); bu yerda
> **serverdan kelgan javobni odam tiliga o'girish** — fetch + ro'yxat uzunligi. Darvoza-mashg'i
> ham boshqa turda (quyida).

**Darvoza-mashq (82e — honor-checkbox YO'Q, darsning O'Z bilimi):**
«Qaysi qator qavat ishini **odam tiliga** o'giradi?»
*(ekranda bosh harf-ta'kid YO'Q — urg'u qalin shrift bilan; «Ko'rsatuv paytida» kirish-bo'lagi
olib tashlandi: mashq kod ekranida turadi, ko'rsatuv esa hozir bo'lmayapti — §113.)*

```
a)  GET /api/joylar → 200 OK
b)  Ro'yxat serverdan keldi — 5 ta joy band
c)  fetch('/joylar').then(r => r.json())
```
✅ **b**. Izoh: «a — serverning o'z tili, c — kodning tili; ikkalasini ham faqat dasturchi o'qiydi.»

**Boshlang'ich kod (VS Code-mockupda ko'rsatiladi, nusxalanmaydi — 82d):**

```jsx
function JoylarPaneli() {
  const [yozuvlar, setYozuvlar] = useState([]);

  function yukla() {
    fetch('http://localhost:3000/joylar')
      .then(r => r.json())
      .then(malumot => setYozuvlar(malumot));
  }

  return (
    <div>
      <button onClick={yukla}>Joylarni ko'rish</button>
      {/* ← holat-qatori shu yerga: nechta joy band, odam tilida */}
    </div>
  );
}
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. Serverdan ro'yxat keladi
2. Sahifada odam tilidagi holat-qatori chiqadi
3. O'zingiz bosib ko'rdingiz

**Tasdiqlash tugmasi (korpus §93 — aynan bajarilgan ishni aytadi):**
«✅ **VS Code'da qo'shdim** — tugmani bosdim, holat-qatori chiqdi»

> 🔴 **82(b/d):** preview/mock-panel YO'Q · kod nusxalanmaydi, mentor sababini ochiq aytadi
> («qo'lda yozganda o'rganiladi»). 🔴 **82(f):** sinf-pulsi bu ekranda o'quvchiga ko'rinmaydi.
> 🔴 **Namuna-komponent demo-olamdan** (`JoylarPaneli`) — matn ochiq aytadi: «namunadagi nomlar
> sizniki bilan boshqacha bo'ladi». 🔴 **Pedagogik ulanish (87c):** holat-qatori s8 dagi «eslab
> qoladi» gapini KO'RINADIGAN qiladi — ko'rsatuvning isbot-lahzasi.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qavat-karta CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun), tepadan pastga. Kartada faqat **nom + fe'l** («Sahifa — ko'rsatadi») — aniq ish-gaplar s4 da ochiladi, ya'ni s1 yadroni oldindan aytib qo'ymaydi; 106d namuna-nusxa detektori s4 gaplariga bog'lanadi (5-bo'lim) |
| **s12 REFLEKSIYA** | Sarlavha: «Uchala gapingizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator; yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». Taymer/sekundomer YO'Q (pitch-oila taqiqi) |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlari: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). Qatorlar (korpus §52): «Rost javob ham notanish so'z bilan aytilsa, odamga yetib bormaydi.» · «Sayt uch qavatdan turadi: sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi.» · «Texnik qarorni odamga foydasi tushuntiradi.» · «Bitta bosish uch qavatdan o'tib, natijasi sahifada ko'rinadi.» |
| **Barcha ekranlar** | 47-qonun: `?</h2>` s4 · s8 · s9 · s10 da **0**; s0 · s2 · s6 · s12 da savol-sarlavha RUXSAT · 60-qonun flex-qoidasi · 88-qonun puls-darvozasi · 89-qonun takrorlash-yo'li (s8 · s9 · s10) |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan. 🔴 **21-qonun:** ballanadigan
> matnda izohsiz chet so'z 0 — «pitch», «fetch», «arxitektura» arena savollariga KIRMAYDI.
> 🔴 **§101 (metodist tuzatishi):** avvalgi 10-savol «Mahsulot varag'ida nima ko'rsatilgan?» edi —
> uning javobi bankda yozilmagan, ro'yxatdan CHIQARILGAN xulosa; xulosa esa **ball beriladigan**
> savolda to'g'ri javob bo'lolmaydi. Endi 10-savol sof bank-faktiga tayanadi («o'nga yaqin oddiy
> varaq bilan»), 9-savol esa chegaralangan inkorni so'raydi («besh qadamda nima yo'q»). Xulosa
> (mahsulot qadami mazmuni) ballanmaydigan joylarda — s6 bashorati va flashcardda — qoladi.
> 🔴 **§114:** arena-fon dekor-so'zlari shu dars lug'atidan: *qavat · sahifa · server · baza ·
> gap · sabab · holat-qatori*.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | Texnik so'z bilan javob bersangiz, odam nimani oladi? | s2 |
| 2 | Rost javob qachon yetib boradi? | s2 |
| 3 | Sayt nechta qavatdan turadi? | s1 + s4 |
| 4 | Ko'rinadigan sahifa nima qiladi? | s4 |
| 5 | Server nima qiladi? | s4 |
| 6 | Baza nima qiladi? | s4 |
| 7 | Bitta bosish qavatlardan qaysi tartibda o'tadi? | s4 |
| 8 | Telefon o'chsa ham yozilganlar turishi — qaysi qavat ishi? | s4 + s5 |
| 9 | Airbnb besh qadamida qaysi biri yo'q edi? | s6 |
| 10 | Airbnb o'z ishini nima bilan tushuntirgan? | s6 |
| 11 | Ko'rsatuvda texnik qarorni nima tushuntiradi? | s9 |
| 12 | Ko'rinmas qavat ishlayotganini odam qanday ko'radi? | s10 |

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Three Floors!** | Uch qavatning ishini ochib chiqdingiz | 37 | s4: 3/3 qavat + yo'l ko'rildi |
| **Plain Talk!** | Uch qavatga oddiy gap yozdingiz | 30 | s8: 3/3 saqlandi |
| **Good Reason!** | Uchala qarorga mos sababni topdingiz | 35 | s9: 3/3 to'g'ri bog'landi |
| **On Screen!** | Ko'rinmas qavatni ekranda ko'rsatdingiz | 38 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓ · tavsiflar o'zbekcha siz-formada, ≤48 belgi ✓ · 101(c): tavsif nom
> aytganini takrorlamaydi. 🔴 **§100 (texnik-omonim tekshiruvi):** «floor», «plain», «reason»,
> «screen» — kursning texnik lug'atida boshqa ma'noda uchramaydi ✓ («Status Line!» ataylab
> OLINMADI — «status» m4-09 da status-kod atamasi).

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §24: referentsiz «bu» yo'q)

| # | Savol | Javob |
|---|---|---|
| 1 | Savolga texnik so'z bilan javob bersangiz, odam nimani oladi? | Javob o'rniga notanish so'z |
| 2 | Sayt nechta qavatdan turadi? | Uch qavat: sahifa, server, baza |
| 3 | Ko'rinadigan sahifa nima qiladi? | Ko'rsatadi va bosishni qabul qiladi |
| 4 | Server nima qiladi? | Tekshiradi — masalan, joy chindan bo'shligini |
| 5 | Baza nima qiladi? | Eslab qoladi — telefon o'chsa ham |
| 6 | Bitta bosish qavatlardan qanday o'tadi? | Sahifadan serverga, serverdan bazaga, javob yana sahifaga |
| 7 | Ko'rsatuvda texnik qarorni nima tushuntiradi? | Odamga foydasi |
| 8 | Airbnb besh qadamida nima yo'q edi? | Sayt qanday qurilgani |
| 9 | Mahsulot qadamida nima aytilgan? | Sayt odamga nima qilib berishi |
| 10 | Ko'rinmas qavat ishlayotganini odam qanday ko'radi? | Sahifada chiqadigan holat-qatori orqali |

> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ ·
> darsning har kalit qoidasi kartada bor ✓ (texnik so'z · uch qavat · uch fe'l · yo'l ·
> qaror-sabab · keys · holat-qatori).
> 🔴 **Tuzatildi (ETALON 43):** 6-karta javobidagi strelkali formula so'z bilan yozildi —
> o'quvchi matnida strelka va tenglik belgilari ishlatilmaydi. 5-karta «ilova»
> so'zidan tozalandi (dars bo'ylab bitta nom — «sayt», yopilish-hodisasi «telefon o'chsa ham»).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Notanish so'z»** — (1) rost javob ham notanish so'z bilan aytilsa, odamga yetib bormaydi ·
(2) ishni oddiy so'z bilan aytsangiz yetib boradi · (3) sinfga savol
**s5 · «Uch qavat»** — (1) sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi · (2) bitta
bosish uchala qavatdan o'tadi · (3) savol
**s7 · «Texnika o'z qadamini olmagan»** — (1) Airbnb besh qadamida «sayt qanday qurilgani» yo'q ·
(2) mahsulot qadamida sayt odamga nima berishi aytilgan · (3) savol
**s11 · «Qaror va sabab»** — (1) texnik qarorni odamga foydasi tushuntiradi · (2) sabab — odam
qaysi noqulaylikdan qutulishi · (3) savol

> 🔴 **43-qonun:** sarlavhalarda matematik belgi yo'q · K-kod ekranga oqmaydi.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K12** — M4 modulida ishlatilmagan ✓ (modul-ichi qoidasi, registr 4-bo'lim)
6. TEKSHIRUV mexanikasi oldingi darsni (M4-D12 artefakt-checklist) takrorlamaydi —
   **qaror-sabab tanlovi** ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): AvtoStoyanka — s0 dan s15 gacha; keys 91b freymi bilan kiradi va ko'prik
  bilan qaytadi ✓
- 95 (Toshkent o'smiri): o'quvchi saytni m4-13/14 da O'ZI qurgan — «o'zi ishlatadimi?» testi
  eng kuchli shaklda o'tadi ✓
- 96/96c: modul-ipi — modul-loyihaning o'zi; PM darslar demo-olamlari bilan to'qnashuv yo'q ✓
- 23 (imzo-vizual yangi): «ARXITEKTURA-QAVATLARI» — band ro'yxatda yo'q; M2-D13 o'xshatishi va
  M3-D14 tasmasidan farqi 1-bo'limda ochiq asoslangan ✓
- 26 (koding-navbat R1): m4-12 kompilyator → m4-15 VS Code ✓
- 87 (o'tilgan material): fetch · useState · onClick · o'z loyihasi — useEffect YO'Q ✓
- 47: `?</h2>` interaktiv ekranlarda 0 ✓
- 54 (P0 o'chirishlar merosi): hook-izoh vizual ostida yo'q · `ta-sub` yo'q · demo-caption yo'q ·
  keys-oxiri «sizning saytingiz ham...» ramkasi yo'q · recap 2 qadam · yakun `h-sub` yo'q ✓
- 100: «ball emas» izohi va hook-echo yo'q; hook-choice faqat yoziladi ✓
- 104: hook ikkala tanlov teng son/uzunlik/og'irlikda, izohlar so'zma-so'z bir xil ✓
- 106/109 (TMI): har mashq-ekranda ≤4 blok · mentor ≤2 gap (yozish-ekranda 1) ✓
- **PITCH-OILASI TAQIQI (to'liq):** tushunish chizig'i YO'Q · so'z-elagi YO'Q · tinglovchi-javobi
  kartalari YO'Q · uch qatlam o'xshatishi YO'Q (o'xshatish umuman yo'q) · tinglovchi kursisi YO'Q ·
  sahna-taymeri YO'Q · MicRecorder YO'Q · texnik↔odamcha juftlik-tanlovi YO'Q (so'z almashtirilmaydi) ·
  demo 3 qadam-akkordeoni YO'Q · ota-ona savollari YO'Q · repetitsiya kabinasi YO'Q ·
  30s sekundomer YO'Q · GAPSIZ KO'RSATUV 4-kadr tasma YO'Q · Hotspot YO'Q ✓
- **K12 to'rtinchi burchak:** band uchala burchak matnlari va band bashoratlar ishlatilmadi ✓ ·
  burchak-da'vosi bank ro'yxatining chegarasidan chiqmaydi («besh qadamda yo'q») ✓ · M3-D14 ning
  tartib-burchagi bilan to'qnashmaslik uchun slayd-2 qadamlarni ketma-ketlik so'zlarisiz sanaydi ✓

**Matn-darvozalari (MATN_KORPUS — testlar §99–118 bilan boshidan yozildi):**
1. §99: to'rt testda variantlar savol shaklida (jadvalda tekshirilgan) ✓
2. §100: nishon nomlarida texnik omonim yo'q; «Status Line!» ataylab rad ✓
3. §101: keys gaplari bank bilan yonma-yon tekshirildi; slaydlar bir-biriga zid emas ✓
   🔴 **Metodist raundida TUZATILDI:** mutlaq inkorlar («bitta ham yo'q», «bironta varaqda
   aytilmagan», «umuman yo'q») bank chegarasidan chiqib ketardi — hammasi «besh qadamda yo'q»
   shakliga o'tkazildi; bank-tashqari xulosa (mahsulot qadami mazmuni) ballanadigan matndan
   (arena 10-savol) chiqarildi ✓
4. §102: har distraktor ekran-rost tekshiruvidan o'tdi (TEST-4 B bandi ochiq yozildi) ✓ ·
   b2 dan «sayt qanday qurilgani» chipi olib tashlandi (b1 reveali uni rad etib bo'lgan edi) ✓
5. §103: qoida fe'l bilan — «Texnik qarorni odamga foydasi tushuntiradi» (yasama ot yo'q);
   kaskad: s9 yakun-qatori · TEST-4 reveal · RECAPS s11 · arena MAVZU · s15 ✓
6. §104: «qavat» ta'rif-gap bilan s1 da tug'iladi (kesik qurilma emas) ✓
7. §105: «qavat» yorliqlarda faqat dars ma'nosida; «ko'rsatuv»↔«ko'rsatadi» bir o'zak, bir
   ma'no-oila — to'qnashuv emas (tekshirildi) ✓
8. §106: «besh qadamda yo'q» formulasi bashorat-revealda; TEST-3 esa uchta aniq gapni ro'yxatga
   solishtirishni so'raydi (ko'chirma emas, qo'llash) ✓ · TEST-1 ham yangi savol-vaziyatga
   o'tkazildi, s2 kartasidan so'zma-so'z olinadigan javob qolmadi ✓
9. §107: ha/yo'q savoli ishlatilmagan ✓
10. §108: TEST-3 inkor-savoli bolaning o'z rost bilimini rad ettirmaydi (s6 ro'yxatiga tayanadi) ✓
11. §110: mutlaq so'z bitta variantda ham takrorlanmaydi; kulgili-bo'sh variant yo'q ✓
12. §111: «degan javob» qurilmasi yo'q ✓
13. §112: «ko'rsatuv» va «qarab turgan odam» — M3-D14 nomlari bilan bir xil (yangi nom
    kiritilmagan); «qavat»↔M2-D13 «qatlam» — s1 ta'rif-gapiga yarim jumlalik ko'prik qo'shildi
    («ba'zan qatlam ham deyishadi»); M2-D13 ning uch nomi bu darsning uch glossi bilan ustma-ust
    tushishi — GATE S 10-savoliga dalil sifatida yozildi
14. §113: MentorNote'lar ekran-mexanikasiga zid emas (s4 eslatmasi javobni so'ramaydi —
    s5 testiga qoldiradi) ✓ · **TUZATILDI:** s8 YORDAM bittalab-yozish tartibiga zid edi
    («eng osonidan — bazadan boshlang», holbuki 1-qadam «ko'rsatadi») — qayta yozildi ✓
15. §114: arena-dekor so'zlari shu dars lug'atidan ✓
16. §115: s8 ipuchalari bitta gap-turida (uchala «nimani …?» fe'l-savoli) · uy-vazifa kartasi
    sarlavha-savol ✓
17. §116: s9 YORDAM-savoli uchala to'g'ri javobga olib boradi ✓
18. §117: metafora ballanadigan matnda tug'ilmaydi · yo'nalish-fe'llari real oqimga mos ·
    sarlavha-omonim yo'q ✓
19. §118: distraktorlarda cheklov-so'zi («faqat») ishlatilmagan ✓
20. **Sanoq-mosligi (22-qonun):** 3 qavat (s1/s4/s8/flashcard-2) · 2 bashorat + 4 slayd (s6
    hisoblagichi) · 3 qaror / 3 sabab (s9) · 12 arena · 10 flashcard · 4 nishon · «Endi siz
    bilasiz» 4 qator ✓
21. **Test halolligi (17-qonun, har savol qayta o'qildi):** TEST-1 A ishonarli-noto'g'ri, C hech
    qayerda rost emas ✓ · TEST-2 fe'lsiz variantlar ✓ · TEST-3 A/C bank-ro'yxatda bor ✓ ·
    TEST-4 B/C sabab sifatida hech qayerda ko'rsatilmagan ✓ · bashoratlar bir o'lchovda ✓ ·
    hook — to'g'ri javob yo'q, izohlar bir xil ✓
22. **Metodist-raundining qolgan tuzatishlari (matn darajasi):** s1 preview-kartalari s4 ni
    ochib qo'yardi (spoyler) → nom + fe'lga qisqartirildi · s0/s2 savoli «Yozganlarim…» qarab
    turgan odam tilida yolg'on edi → «Band qilingan joylar…» · «ilova» so'zi darsdan chiqarildi
    (bitta nom — «sayt») · «notanish so'zda aytilsa» → «notanish so'z bilan aytilsa» ·
    «unga notanish so'z tegdi» (kalka) → «bu so'z unga hech narsa aytmaydi» · s4 mentoridagi
    jonlantirish («qavatlar jim») olib tashlandi · s10 mentorida «holat-qatori» endi ta'rif bilan
    tug'iladi · uy-vazifadagi «savol tug'ilsa» → kuzatiladigan hodisa («u qaytadan so'rasa») ·
    flashcard-6 dagi strelkali formula so'zga aylantirildi ✓

**`lint:til` holati (yozuvchi o'lchovi): 🔴 error 0 · 🟡 warn 11 — hammasi senariy-meta
matnida, o'quvchi ekraniga chiqadigan birorta matn emas.** Sinflari: blok-nom qoidasida —
taqiq-bandining o'zi va PM_Prompt_v8 blok-sarlavhalari; diqqat-belgisi qoidasida — 88-qonun
mexanika-nomi spets-izohlarda; homoglif qoidasida — keys-bankdan ruscha iqtibos; murojaat
qoidasida — o'z-tekshiruv bandining o'z nomi; artefakt-ketma-ketligi so'zida — GATE S
9-savolining o'zi (o'yin-hisobi emas).

---

## 14. ⚠️ [GATE S] — FOYDALANUVCHI QARORLARI (OCHIQ, 2026-08-14)

> 🔴 Quruvchi ishni BOSHLAMAYDI — quyidagi 10 savol yopilishi shart.

| # | Savol | Taklif |
|---|---|---|
| 1 | 🔴 **Dars kartasi (`App.jsx` `m4-15`).** Hozirgi title «Fullstack arxitektura pitchi» · sub «texnik qarorni stakeholder'ga tushuntirish» — «fullstack», «arxitektura», «pitch», «stakeholder» to'rttasi ham izohsiz inglizcha/kattalar so'zi (korpus §20; M4-D7 pretsedenti) | title → **«"Bu qanday ishlaydi?" deb so'rashsa, nima deysiz?»** · sub → **«uch qavat — oddiy tilda»**. Tasdiqlaysizmi? |
| 2 | 🟡 **Misol-olam = o'quvchining O'Z loyihasi (AvtoStoyanka).** Registr R2 shuni biriktirgan; 96c(b) «demo har darsda yangi» talabiga izoh: modulni YOPADIGAN dars o'quvchining o'z ishiga qaytadi — bu «yana shumi?» emas, «endi o'zimniki» lahzasi. Demo-nusxa xavfi 106d-detektor bilan yopilgan (s8: namuna-gap aynan ko'chirilsa savol qaytariladi) | Shunday qolsin. Tasdiqlaysizmi? |
| 3 | 🔴 **K12 TO'RTINCHI marta (global).** Modul-ichi qoidasi bo'yicha ruxsat (M4 da birinchi). Burchak yangi: «bank-tartibida texnika varag'i yo'q + mahsulot varag'ida ish». Band uchala burchak va band bashoratlar ishlatilmadi (6-bo'lim tekshiruvi) | K12 **qoladi** shu burchak bilan. Yoki zaxira ilgakka (o'smir hayotidan sahna) o'tamizmi? |
| 4 | 🔴 **Keys-ekran qoidasi (registr R3):** 2 bashorat ikki o'lchovda + uzluksiz hisoblagich — M3-D14 da «bashorat aynan bitta» degan TMI-qarori bor edi; bu dars R3 ning yangi talabiga bo'ysundi (2 ta, lekin har biri bitta qatorli natija bilan, TMI saqlangan) | Shu tartib tasdiqlansinmi? |
| 5 | 🔴 **Koding = VS Code topshirig'i** (R1 navbati: m4-12 kompilyator → m4-15 VS Code). Topshiriq: serverdan kelgan ro'yxatni odam tilidagi holat-qatoriga o'girish (fetch + useState, useEffect'siz) | Tasdiqlaysizmi? |
| 6 | 🔴 **Kirish-artefakt `pm-m4d12-sxema` — KUTILAYOTGAN shakl.** M4-D12 parallel yozilmoqda; men `{ ustunlar: [ {maydon, kimKoradi} × N ], savedAt }` deb kutdim va **faqat `maydon` nomlarini** o'qiyman (s8 3-qadam chiplari). Zaxira yo'l bor (AvtoStoyanka uchligi) | M4-D12 GATE S yopilgach kalit/shakl shu senariyga qaytib MUHRLANADI (M4-D7 dagi `maydonlar` pretsedenti). Rozimisiz? |
| 7 | 🟡 **Chiqish-artefakt `pm-m4d15-pitch` kimga boradi.** M4 shu darsda yopiladi. Tabiiy nomzod — **Demo Day (m4-17)**: o'quvchi ko'rsatuvida uch qavat-gapni o'qib turadi | Zanjir m4-17 ga ulansinmi (Demo Day skripti o'qiydi), yoki M4 da yopiq qolsinmi? |
| 8 | 🟡 **TEKSHIRUV — «QAROR-SABAB TANLOVI».** MatchPairs (nom-nomga doska) emas, M2-D13 so'z-almashtirish ham emas — qaror BITTALAB ochilib sababga bog'lanadi (farq-asosi blok 5 da). PM_Prompt_v8 janri: sootnesenie (MatchPairs pretsedenti) | Tasdiqlaysizmi? |
| 9 | 🔴 **Registrni yangilash (GATE S yopilgach, bosh-agent):** 5-bo'limga qator — imzo-vizual **«ARXITEKTURA-QAVATLARI»** · TEKSHIRUV **«qaror-sabab tanlovi»** · olam **🅿️ o'quvchining o'z M4 loyihasi (AvtoStoyanka)** · keys **K12 ♻️ (4-burchak)**; 6-bo'limga: `pm-m4d12-sxema` → `pm-m4d15-pitch` (M4 yopiq / m4-17?) | ✅ GATE S yopilgach darhol |
| 10 | 🟡 **«qavat» so'zi.** M2-D13 xuddi shu tushunchani «qatlam» degan (uch qatlam o'xshatishi). Registr bu darsga «ARXITEKTURA-QAVATLARI» nomini biriktirgan; «qavat» o'smirga tanishroq (bino), M2-D13 esa 2 modul oldin edi va «qatlam» u darsning bosh atamasi emas edi — §112 ko'prigisiz ham o'tadi deb hisoblayman | **«qavat»** qoladi (registr nomi). Yoki M2-D13 bilan bir xil «qatlam»ga o'tamizmi? |

**Quruvchiga qo'shimcha (yozuvchi ogohlantirishi):** s4 — darsning o'zagi. Qavat ish-gaplari
JONLI va qisqa turishi shart; nuqta-yo'l animatsiyasi bitta bosishdan boshlanadi va har to'xtash
bitta so'z bilan izohlanadi — matn ko'paysa, mexanika o'qish-ekraniga aylanadi. s8 da texnik-so'z
detektori bloklamaydi — faqat savol qaytaradi (106d: yo'naltiradi, jazolamaydi).

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–112) · MATN_KORPUS (0–118,
testlar §99–118 bilan boshidan) · MATN_ETALONI (lug'at) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2/R3
pasporti) bo'yicha yozildi. Keyingi qadam: **pm-metodist korrektura** → **[GATE S]**.*

---

## ✅ [AVTO-GATE S] YOPILDI — 2026-08-14 (foydalanuvchi avtokontrol-ruxsati asosida, bosh-agent)

① **App.jsx karta:** title **«"Qanday ishlaydi?" deb so'rashsa»** · sub «uch qavat — uch
   oddiy gap» (bosh-agent qurilishda kiritadi; «stakeholder/pitch/arxitektura» ketadi).
② **Olam TASDIQ** — o'z M4 loyihasi + AvtoStoyanka demo (96c).
③ **K12 to'rtinchi burchak TASDIQ** — metodistning chegaralangan formulasida («Airbnb aytib
   bergan BESH QADAMDA sayt qanday qurilgani yo'q»); «umuman yo'q» inkorlari tuzatilgan.
④ **2 bashorat TASDIQ** (qadam TURI ↔ qadam MAZMUNI, hisoblagich uzluksiz).
⑤ **Koding = VS Code TASDIQ** (R1).
⑥ 🔴 **Kirish-shakl MOSLANDI:** M4-D12 avto-GATE S da chiqish `{ustulnar:[{nom,savol,kim}×3]}`
   deb muhrlandi — bu dars `d.ustunlar[].nom` ni o'qiydi (senariyda kutilgan `maydon` maydoni
   EMAS — quruvchi shunga quradi). Zaxira-tarmoq o'z holida.
⑦ **Chiqish M4 da yopiq qoladi** (M3 pretsedenti) — m4-17 Demo Day kartasi ulanmaydi.
⑧ **TEKSHIRUV TASDIQ** — «QAROR-SABAB TANLOVI», M2-D13 farqi matn-darajasida dalillangan.
⑨ **Imzo-vizual registr-nomi:** «ARXITEKTURA-QAVATLARI» → **«UCH QAVAT KESIMI»** (ichki-nom
   sizish xavfini yopish uchun; ekranga baribir chiqmaydi).
⑩ **«qavat» TASDIQ** + yarim-jumlalik «qatlam» ko'prigi (metodist kiritgan) qoladi.
