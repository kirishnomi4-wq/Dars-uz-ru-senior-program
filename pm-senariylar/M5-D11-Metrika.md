# M5-D11 — Botingiz yaxshi ishlayotganini qaysi raqam aytadi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (2026-09-28) → pm-metodist korrekturasi ✅ (2026-09-28, oxirgi bo'lim) → **[GATE S]** kutmoqda.
> Fayl: `src/pm/PmMetricsLesson.jsx` shu senariydan **qayta quriladi** (eski `pm-m8d1-v2` avlodi
> almashadi; yangi `lessonId: pm-m5d11-metrika-v1`). Joyi: 5-Modul, `m5-10 BotAiAgentLesson` dan keyin,
> `PmLesson21` dan oldin (PmLesson21 12-dars bo'ladi). v9 manbasi: `CoddyCamp_Senior_2026_v9_14modul .html`,
> 7-modul #11 — «Что такое метрика — DAU, retention, North Star — o'z jonli botida · Natija: North Star +
> botning 3 metrikasi».
> 🔴 Eslatma: brifda aytilgan `pm-senariylar/M8-D1-Metrika.md` repo'da **YO'Q** (find/git bilan tekshirildi) —
> eski dars faqat `.jsx` ko'rinishida bor; qayta ishlatiladigan bo'laklar shu fayldan olindi (14-bo'lim).

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 5 — «Botlar va avtomatlashtirish» (v9 modul 7) · modul g'oyasi: «Real odamlar bilan birinchi jonli mahsulot tajribasi. 20+ real foydalanuvchi» |
| **Dars** | M5-D11 (modulning 11-darsi, uchinchi PM darsi; PmLesson21 dan oldin) · `key: m5-11` (PmLesson21 → `m5-12`) |
| **Mavzu** | Metrika nima — bot haqida sanab tekshirib bo'ladigan raqam; **uch raqam**: bugun kelganlar (DAU) · qaytganlar foizi (retention, **foizda**) · bosh raqam (North Star); «faqat o'sadigan» jami soni nega yetmaydi |
| **TUR** | 🔴 **2-TUR (sof PM)** — artefakt = botning **bosh raqami + uch raqami** (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) majburiy |
| **Bosh keys** | 🏨 **K9 · BOOKING.COM** — bank: deyarli har o'zgarish (tugma rangi, matn, bloklar tartibi) avval odamlarning **bir qismida** sinaladi · bir vaqtda **1000 dan ortiq** sinov (kompaniyaning ochiq chiqishlari, **2017**). Bank-temalar: *A/B test · gipoteza · eksperiment · **metrikalar*** — mavzuga halol yopishadi |
| **ISHLATILGAN_KEYS** | **K9** · M5 ichida band: m5-02 → K8 · m5-08 → K4 · m5-12 (PmLesson21) → K5. K9 **M5 da birinchi marta** ✓ (modul-ichi qoidasi, registr 4-bo'lim 1-band). K9 registrda `m7-08` ga ham biriktirilgan — boshqa modul ✓; burchak farqi 6-bo'limda |
| 🔴 **K5 CHIQARILDI** | Duolingo endi faqat PmLesson21 da (qo'shni dars, AUDIT-YOPILISH 1-band). «Duolingo», «streak», «🔥», «alanga» bu darsda **0** |
| **Oldingi PM darsning TEKSHIRUV mexanikasi** | m5-08 → «SAVOL-ELAK» · keyingi (m5-12) → «KUN-BELGILASH». **Bu dars = «YOZUVDAN SANASH»** (5-blok) — ikkalasidan ham farqli (dalil 5-blokda) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq: story-silosi · JTBD shtampi · **Metrika alangasi** · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» · «GAPSIZ KO'RSATUV» · «XOTIRA TUGMALARI» · «O'LCHAGICH-PANELI» (M4c-D6) · signal-saralash · «BIRINCHI 20» · kanal-funnel · «INTERVYU-STOLI» · savol-elak · «QAYTISH-KALENDARI» · kun-belgilash · MatchPairs · Timeline · Hotspot (tekshiruv sifatida) · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash · PairTimer · jadval-qatorini belgilash · pitch-oilasi |
| **Misol-ip (91/95/96/108)** | 🤖 **O'quvchining O'Z Telegram-boti** — `BotIntro` → `BotApiButtons` (bot.start / bot.command / bot.hears / ctx.reply) → `BotStatefulMemory` (PostgreSQL `users`: `telegram_id`, `created_at`; INSERT/SELECT/UPDATE) → `BotFullProject` → `BotAiAgent`; m5-02 da birinchi odamlarini yig'gan, m5-08 da ular bilan gaplashgan. **Boshqa olam yo'q**: maktab oshxonasi, «umumiy panel», «loyiha/MVP» — **0** |
| 🔴 **Personaj-taqiq (5.8)** | «Botjon» — texnik darslar lug'ati; bu darsda **0**, hamma joyda «botingiz». Yozuvdagi ismlar (Kamola, Otabek, Bekzod, Sevara, Dilshod, Madina) — **kontent-ma'lumot**, gapirmaydi. PmLesson21 ning ismlari (Aziz, Dilnoza, Shohrux, Malika, Nodira, Jasur) ataylab olinmadi |
| **Kirish-artefakt** | `pm-m5d8-javoblar` = `{ javoblar: [{ savol, eshitgan } × 3], savedAt }` (m5-08). O'qiladigan joy: **s10** tasmasi. 🔴 **Jim zaxira** (§69): yo'q/buzuq bo'lsa tasma chiqmaydi, mentor-gapning umumiy shakli; «topilmadi» matni YO'Q |
| **Chiqish-artefakt** | 🔴 `pm-m5mx-raqamlar` = `{ bosh: { nima, qachon: [..] }, raqamlar: [{ nom, nima, qachon: [..] } × 3], savedAt }` · `qachon` ⊂ `['start','xabar','tugma','javob']` (kamida bittasi) · `raqamlar[0].nom = 'Bugun kelganlar'`, `raqamlar[1].nom = 'Qaytganlar foizi'` (tayyor), `raqamlar[2]` — o'quvchiniki. Kalit prefiksi ataylab `pm-m5mx-` — PmLesson21 ning `pm-m5d11-metrika` kaliti bilan adashmasin |
| **Yordamchi kalitlar** | `pm-m5mx-hook` (faqat yoziladi, 100c) · `pm-m5mx-stat` (s4 holati) · `pm-m5mx-ulush` (s7) · `pm-m5mx-yozuv` (s11) · `pm-m5mx-code` · `pm-m5mx-reflection` · `pm-m5mx-hw` · `ccProgress` |
| **Koding** | ⌨️ **VS Code — o'quvchining O'Z `bot.js` fayli**: `/stat` buyrug'i (7-bo'lim). Kompilyator EMAS — sabab AUDIT-YOPILISH 5-band |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82** + 8 bufer = 90 |
| **Ekranlar** | **18 ta** (s0…s17) |

**Atama-glosslar (39/62/126 + korpus §20/§79/§104/§142):**

- 🔴 **Darsning bosh so'zi — «raqam»**, atama — **«metrika»** (s2 da tug'iladi, s0/s1 da **0**). Kanonik ta'rif, hamma yuzada so'zma-so'z: **«Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.»** Birinchi ko'rinishda qavsda: «metrika (o'lchov raqami)» — ⚠️ omonim: o'zbek tilida «metrika» tug'ilganlik guvohnomasi ham (GATE S 3-savol).
- 🔴 **Uch nom — o'zbekcha nom BIRLAMCHI, inglizchasi faqat s5 da, qavsda, bir marta** (§20: o'zbekcha ibora atamaning o'rnini oladi; inglizcha nom v9 talabi va keyingi darslar uchun tanishtiriladi):
  - 🙋 **Bugun kelganlar** (DAU — inglizcha «kunlik faol foydalanuvchilar» qisqartmasi): **«Bugun botga yozgan yoki tugma bosgan odamlar soni — bir odam bir marta sanaladi.»**
  - ↩️ **Qaytganlar foizi** (retention): **«Kecha kelgan odam bugun ham kelsa — u bugun qaytgan hisoblanadi.»** (PmLesson21 ning kanonik ta'rifi AYNAN, §142-A yo'nalishi) + **«Kecha kelgan har yuzta odamdan nechtasi bugun ham keldi — shu qaytganlar foizi.»**
  - ⭐ **Bosh raqam** (North Star — «Shimol yulduzi»): **«Bot nechta odamga keragini berganini sanaydigan eng muhim raqam.»**
- 🔴 **«Jami» — nomsiz qoladi**, hodisa-tilida: **«Jami soni faqat o'sadi — bot yomonlashsa ham kamaymaydi.»** «vanity metric» kabi nom YO'Q (109 · TMI).
- 🔴 **Foiz shu darsda o'rgatiladi** (s7): «yuzta odamga keltirish» · hisob: **qaytganlar ÷ kechagi odamlar × 100** (hisob-qatori vizualda ko'rinadi, prozada formula yozilmaydi — korpus 0/6).
- 🔴 **Fe'l-intizomi (§80/§121):** odam botga **keladi / yozadi / tugma bosadi / qaytadi**; bot **javob beradi / biladi / sanaydi**. «kir-» o'zagi odam haqida **0** (PmLesson21 bilan bir xil).
- ❌ **churn** — olib tashlandi (v9 ro'yxatida yo'q, 109). ❌ MAU · kogorta · dashboard · panel · analitika · statistika · voronka · konversiya · ko'rsatkich · «A/B test» (m7-08 atamasi, 29-qonun) — 8-A jadval.

---

## AUDIT-YOPILISH (brifdagi 6 topilma + qo'shimcha)

| # | Topilma (eski `PmMetricsLesson.jsx`) | Yopilishi | Qayerda |
|---|---|---|---|
| 1 | K5 Duolingo ikki qo'shni darsda (Metrics s0 :85, :633-675, `K5_SLIDES` :918-967 ↔ PmLesson21 s6) | **K5 chiqarildi** → **K9 Booking** (M5 da band emas, bank-temasida «metrikalar» bor). Duolingo/streak/🔥 bu darsda 0; K5 faqat PmLesson21 da qoladi | 0-shapka · 6-bo'lim |
| 2 | «Metrika alangasi» (:691-696) — PmLesson21 va registr TAQIQ ro'yxatida | **Olib tashlandi, oqlanmadi** (23-qonun: imzo-vizual yangi bo'ladi). Yangi imzo-vizual — **«/STAT SUHBATI»** (1-bo'lim) | 1-bo'lim |
| 3 | PmLesson21 «retention/DAU/churn/foiz/%» ni taqiqlaydi, chunki «foiz — M8-D1 ishi» | Foiz **shu darsda** qoladi (s7). PmLesson21 ga **minimal o'zgarish** — alohida bo'lim | 16-bo'lim |
| 4 | Oshxona sahnasi (:772-820), o'ylab topilgan umumiy panel (s1 «panel jonlanadi»), umumiy «loyiha/MVP», M8 shapka/kontekst, «keyingi dars (maqsad qo'yish)» va'dasi (:1511) | Butun dars — **o'quvchining O'Z boti**; s1 panel o'rniga bot-javobi pufagi; «loyiha», «MVP», «8-Modul» ekranlarda **0**; kelajak-va'da faqat uy-vazifa MUDDAT bandida (73-qonun) | 0 · 2 · 8-A |
| 5 | Koding — React `MetrikaPanel` VS Code'da (:1781-1907) — M5 texnik ipidan uzilgan | **`/stat` buyrug'i o'quvchining O'Z `bot.js` faylida**: `bot.command` + `ctx.reply` (m5-03) · `telegram_id` (m5-04) · massiv/`for…of`/`includes`/`push` (M2). Kompilyator tanlanmadi: keyingi PM darsi (PmLesson21) kompilyator — ketma-ket ikki kompilyator 26-qonunga zid | 7-bo'lim |
| 6 | Uy-vazifa «uyda jonli raqam» | **«Botingiz raqamlari»** — botning o'z yozuvlaridan to'rt raqamni sanash | 8-blok |
| 7 | (qo'shimcha) MatchPairs (s9), tekshiruvchi stoli (`peer`), klinika (`clinic`) — registrda band | Olib tashlandi; tekshiruv — yangi «YOZUVDAN SANASH» | 5-blok |
| 8 | (qo'shimcha) churn to'rtinchi atama sifatida | Olib tashlandi (v9 da yo'q, TMI) | 0 |
| 9 | (qo'shimcha) Eski maqsad/uy-vazifa «North Star nomzodi + 3 karta» uzuq, manba-savolsiz | Har raqamga **«Bot buni qachon biladi?»** chipi — raqam bot hodisasiga (start/xabar/tugma/javob) bog'lanadi va koding bilan ulanadi | s10 · 5-bo'lim |

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL — «/STAT SUHBATI»

🔴 **Imzo-vizual:** Telegram-suhbat maketi — o'quvchining boti bilan chat. Ekranda **ikki suhbat yonma-yon**: nomli ikki sarlavha-chip **«O'tgan dushanba»** · **«Bu dushanba»** (§209: ikki holat — nomli ikki chip). `src/` da `/stat` buyrug'i ham, bunday suhbat-vizual ham yo'q (grep bilan tekshirildi).

```
 O'tgan dushanba                    Bu dushanba
 ┌─────────────────────────┐        ┌─────────────────────────┐
 │            /stat  (siz) │        │            /stat  (siz) │
 │ 🤖 👥 Jami: 100          │        │ 🤖 👥 Jami: 120          │
 │    🙋 Bugun kelganlar: 18│        │    🙋 Bugun kelganlar: 6 │
 │    ↩️ Kechagilardan      │        │    ↩️ Kechagilardan      │
 │       qaytgani: 20 dan 9 │        │       qaytgani: 8 dan 1  │
 │    ✅ Keragini olganlar:15│        │    ✅ Keragini olganlar: 4│
 └─────────────────────────┘        └─────────────────────────┘
```

**1-bosqich.** Bitta tugma: **«/stat»** (Telegram buyruq-chipi ko'rinishida). Bosilganda ikkala suhbatga bot javobi chiqadi — **faqat bitta qator**: «👥 Jami: 100» / «👥 Jami: 120».

**2-bosqich — bashorat (ballsiz, to'g'ri javob YO'Q):** «Faqat shu raqamga qarab: bot yaxshilandimi?» → «📈 Ha — 20 odam qo'shildi» · «🤔 Bu raqamdan bilib bo'lmaydi». Ikkala tanlovda ham bir xil javob: «Tanlovingiz yozildi. Endi botdan yana uch raqamni so'rang.» (§215: baho yo'q · §119).

**3-bosqich.** Uch chip ochiladi: **«+ Bugun kelganlar»** · **«+ Kechagilardan qaytgani»** · **«+ Keragini olganlar»**. Har bosishda IKKALA pufakka bitta qator qo'shiladi va ostida bitta fakt-qator chiqadi:

| Chip | Fakt-qator |
|---|---|
| Bugun kelganlar | Bu dushanba botga uch barobar kam odam yozdi: 18 emas, 6 |
| Kechagilardan qaytgani | O'tgan safar kechagi 20 odamdan 9 tasi qaytgan edi, bu safar 8 tadan 1 tasi |
| Keragini olganlar | Botdan kerakli javob olganlar ham kamaydi: 15 tadan 4 taga |

**Yakun-kartasi** (69-qonun — xulosa, maqtov emas):
> **Jami 100 dan 120 ga o'sdi — qolgan uch raqam esa tushdi.** Jami soni faqat o'sadi, shuning uchun bot qanday ishlayotganini u aytmaydi. Buni qolgan uchtasi aytadi.

🔴 **Nega aynan shu:** «faqat o'sadigan raqam» ni ta'rif bilan tushuntirib bo'lmaydi — u **boshqa raqamlar yonida** fosh bo'ladi. Bola raqamni o'zi so'raydi, har qator bilan hukmi o'zgaradi.
🔴 **Raqam halolligi (korpus §36/§95):** bu o'quvchining o'z boti ustidagi sahna; «botlarda odatda shunday» degan gap YO'Q; har son pufakda ko'rinib turadi. Tushish SABABI aytilmaydi (e'lon/reklama mavzusi — PmLesson21 kashfiyoti, o'g'irlanmaydi).
🔴 **Rang:** tushgan raqam **qizil bo'yalmaydi** (bu nosozlik emas, sahna) — neytral indigo; «Jami» qatori xira-kulrang (u endi ma'no bermasligini rang emas, yakun-karta aytadi).
🔴 **Mexanika-farqi (26/59):** PmLesson21 da o'quvchi **kunlarni ochadi** va e'lon beradi (obyekt — odam-belgilar, vaqt o'qi); M4c-D6 da **o'lchagich-chiziqda chegara qo'yadi**. Bu yerda obyekt — **bot javobidagi qatorlar**, harakat — **botdan raqam so'rash**, maqsad — **bitta raqam yolg'iz hukm chiqara olmasligini ko'rish**. Kun-tugmasi, chiziq, chegara yo'q.
🔴 **Kashfiyot-himoyasi:** 3-bosqichda 40 s harakatsizlikda ipucha: «Tugmalarni bosing va ikki suhbatni yonma-yon o'qing» — javobni aytmaydi (§77).

---

## 2. EKRAN-RO'YXATI (18 ekran)

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Bot yaxshi ishlayotganini qaysi raqamga qarab bilasiz?» | 1 | — | 2 tanlov · payoff shu ekranda |
| s1 | MAQSAD — bot-javobi pufagi o'z-o'zidan yoziladi: ⭐ ? + 3 × ? | 2 | — | jonli preview (18) |
| s2 | TEORIYA-1 — ikki gap: fikr ↔ sanaladigan raqam → «metrika» | 3 | — | ikki karta (tap) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **/STAT SUHBATI** (jami ↔ uch raqam, ikki dushanba) | 3 | — | 🔴 markaziy |
| s5 | TEORIYA-2 — pufakdagi qatorni bosing → nomi ochiladi (3 nom) | 3 | — | qator-bosish |
| s6 | **TEST-2** | 3 | ✅ | TestQ |
| s7 | YADRO-2 — **FOIZ**: ikki holatni yuzta odamga keltirish | 3 | — | bashorat + ÷×100 + 10×10 nuqta |
| s8 | **TEST-3** | 3 | ✅ | TestQ |
| s9 | KEYS — 🏨 Booking.com (3 slayd + 2 bashorat + ko'prik) | 3 | — | keys-qolipi · 1/6 |
| s10 | YOZISH — **botingizning to'rt raqami** (bittalab) | 4 | — | 48/80 qolipi |
| s11 | TEKSHIRUV — **YOZUVDAN SANASH** (bir kunlik bot-yozuvi, 3 savol) | 5 | — | 🔴 yangi |
| s12 | KODING — `/stat` buyrug'i (VS Code, o'z `bot.js`) | 6 | — | 26/82/87 |
| s13 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s14 | REFLEKSIYA — juftlikda ayting + bir qator | 7 | — | 2 qadam (54e) |
| s15 | PODIUM | 9 | — | — |
| s16 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99) |
| s17 | **YAKUN** — CodeStrike + uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun |

🔴 **Test-taqsimot:** s3 · s6 · s8 · s13 — har biri o'z teoriyasidan keyin, ketma-ket blok yo'q (P0 saboq-1). Yozma mashq bitta sahifada ≤3 (s10: 4 karta bittalab — bir vaqtda bitta).
🔴 «/STAT SUHBATI», «YOZUVDAN SANASH», «ulush-hisobchi» — senariy-ichi nomlar, ekranda YO'Q (§84).

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 5 — Botlar va avtomatlashtirish
DARS: M5-D11 (11-dars)
DARS_MAVZUSI: Metrika nima — bugun kelganlar (DAU), qaytganlar foizi (retention), bosh raqam (North Star) o'z botingizda
ISHLATILGAN_KEYS: K9 (Booking.com — o'zgarishni raqamlar hal qiladi)
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Botingizga odamlar /start bosib kelyapti. Bot yaxshi ishlayotganini qaysi
raqamga qarab bilasiz?
HARAKAT: Ikki tanlovdan bittasini bosadi; ikkala tanlovda ham bir xil payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkalasi ham halol javob. «Faqat o'sadi» degan joyda
to'xtang va so'rang: bot bir hafta jim tursa, jami soni nima bo'ladi?
```

**Ikki tanlov (104: teng uzunlik, teng og'irlik):** «🔢 Jami nechta odam /start bosganiga» *(35)* · «🙋 Bugun nechta odam botga yozganiga» *(35)*

**Payoff (ikkala tanlovda AYNAN bir xil):**
> Ikkalasi ham botingizda bor raqam. Lekin jami soni faqat o'sadi: bot bir hafta jim tursa ham u kamaymaydi. Bugungi son esa har kuni o'zgaradi — darsda ikkalasini yonma-yon qo'yib ko'rasiz.

> 🔴 **91a:** hook obyekti (botning raqamlari) = darsning obyekti; payoff shu ekranda.
> 🔴 **§119:** payoff xususiyatni aytadi, hukm chiqarmaydi — «xato tanladingiz» yo'q, «To'g'ri sezdingiz» yo'q.
> 🔴 **§126/§39:** «metrika» va uch nom bu ekranda **0**.
> 🔴 **100c:** tanlov `pm-m5mx-hook` ga yoziladi, hech qayerda o'qilmaydi. **§97:** «ko'pchilik/sinf» o'quvchi matnida 0.
> 🔴 Ekran-o'lchovi: savol + tanlovlar + payoff = **353** belgi (Python `len`) (≤400).

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: (sarlavha) Bugun botingiz uchun to'rt raqam tanlaysiz.
(mentor) Bittasi — eng muhimi, uchtasi — unga yordam beradi. Dars oxirida
botingiz ulardan ikkitasini /stat buyrug'i bilan o'zi aytadigan bo'ladi.
HARAKAT: Kuzatadi: bot-javobi pufagiga to'rt qator o'z-o'zidan yozilib chiqadi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Pufak yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

**Demo-pufak (sonlar o'rnida `?`):** `/stat` → 🤖 `⭐ ? · 🔢 ? · 🔢 ? · 🔢 ?`

> 🔴 **§125/§178:** natija NOMLANADI, ko'rsatilmaydi — nomlar ham, sonlar ham yo'q (kashfiyot s4 da). **§126:** «metrika», «bosh raqam» bu ekranda 0 — «eng muhimi» hodisa-tilida.
> 🔴 **159/7:** sarlavha «Bugun …» gap; mentor sarlavhani takrorlamaydi (§216). **§40:** «aytadigan bo'ladi» — /stat hali yo'q.
> 🔴 Ekran-o'lchovi ≈ **175** grapheme.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (/stat suhbati) + Simulation (ulush) + 3 x Quiz + keys
EKRAN: Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.
(🔴 Blok-gapi — s2 xulosa-kartasi; boshqa ekranda takrorlanmaydi, faqat RECAPS/flashcard/yakun)
HARAKAT: (s2) ikki gapni bosib solishtiradi; (s4) botdan raqam so'raydi, ikki
dushanbani solishtiradi; (s5) pufakdagi qatorlarni bosib uch nomni ochadi;
(s7) ikki juftlikni foizga aylantiradi; (s9) Booking voqeasini bashorat bilan ochadi.
JAVOB: s4 — jami o'sdi, qolgan uchtasi tushdi · s7 — 20 foiz va 40 foiz.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da «Jami 120 — ko'payibdi!» degan ovozlar chiqadi. Shunda o'ng pufakdagi
qolgan qatorlarni birga o'qing — xulosani bolalar o'zi aytsin.
```

**s2 — TEORIYA-1: «Qaysi gapni tekshirib ko'rsa bo'ladi?»** (teoriya — savol-sarlavha ruxsat)

Mentor (§210 qolipi): «Botingiz haqida ikki gap — ikkala kartani bosing.»

| Karta | Ochilganda |
|---|---|
| 💬 «Botim juda yaxshi ishlayapti» | Buni sanab bo'lmaydi: har kim «yaxshi»ni o'zicha tushunadi |
| 🔢 «Bugun botga 12 odam yozdi» | Buni sanasa bo'ladi: bot yozuvidan 12 ta ekanini tekshirasiz |

Xulosa-karta (kanonik ta'rif): **«Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.»** + ostida kichik qator: **«So'z «metr» dan olingan — o'lchash degani.»**

MentorNote (omonim): «Kimdir «metrika — guvohnoma-ku» desa: so'z bir xil, ma'no boshqa — bu yerda o'lchash.»

> 🔴 **39/168:** avval hodisa (ikki karta), keyin nom. Sarlavhada atama yo'q. **§103:** qoida fe'l bilan.
> 🔴 **46:** karta toggle; ikkala karta ham ochilgach xulosa chiqadi (`seen`). Ekran ≈ **260** grapheme.

**s4 — YADRO: /STAT SUHBATI** (to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47 — buyruq): **«/stat yuboring va ikki dushanbani solishtiring.»**
Mentor (1 gap): «Ikki dushanba, bitta bot — avval «/stat» tugmasini bosing.»

> 🔴 **98b/60:** mentor natijani aytmaydi. **§131:** har chip bosilganda ikkala pufak darhol yangilanadi.
> 🔴 **§126:** uch nom bu ekranda hali ATAMA emas — chip-yorliqlari hodisa-tilida («Bugun kelganlar», «Kechagilardan qaytgani», «Keragini olganlar»); inglizcha nomlar va «bosh raqam» s5 da.
> 🔴 Ekran ≈ **330** grapheme (sarlavha + mentor + yakun-karta; pufak/fakt-qatorlar — mashq-materiali).

**s5 — TEORIYA-2: «Har raqam qaysi savolga javob beradi?»**

Mentor: «Har raqam bitta savolga javob beradi — bot javobidagi qatorlarni birma-bir bosing.» Chapda s4 ning «Bu dushanba» pufagi (qatorlar bosiladigan); o'ngda bosilgan qatorning kartasi:

| Qator | Karta (savol → nom → ta'rif) |
|---|---|
| 🙋 Bugun kelganlar | **«Botga bugun odam keldimi?»** — Bugun botga yozgan yoki tugma bosgan odamlar soni — bir odam bir marta sanaladi. Inglizcha nomi: **DAU** («kunlik faol foydalanuvchilar») |
| ↩️ Kechagilardan qaytgani | **«Odamlar botga qaytyaptimi?»** — Kecha kelgan odam bugun ham kelsa — u bugun qaytgan hisoblanadi. Yuzta odamdan nechtasi qaytgani — **qaytganlar foizi**. Inglizcha nomi: **retention** |
| ✅ Keragini olganlar | **«Bot odamga keragini berdimi?»** — Bot nechta odamga keragini berganini sanaydigan eng muhim raqam — **bosh raqam**. Inglizcha nomi: **North Star** («Shimol yulduzi»: yo'lni shunga qarab topishadi) |
| 👥 Jami | (bosilsa) Bu raqam faqat o'sadi — u hech bir savolga javob bermaydi |

Xulosa-karta (uchala qator ochilgach): **«Bot qanday ishlayotganini jami emas, shu uch raqam aytadi.»**

> 🔴 **§112:** «Keragini olganlar» → «bosh raqam» tenglashtirish bir gapda, birinchi ishlatilishda.
> 🔴 **§79/§20:** inglizcha nom faqat shu ekranda, qavsdan tashqarida emas — «Inglizcha nomi:» qatorida, bir marta. Testlarda va arenada inglizcha nom **0** (metodist 2026-09-28).
> 🔴 **Hotspot emas:** bu tekshiruv emas, ta'lim-ochilma (ball, xato yo'q) — registr taqiqi TEKSHIRUV-Hotspot'ga tegishli.
> 🔴 Ekran ≈ **390** grapheme (sarlavha + mentor + bitta ochiq karta + xulosa; bir vaqtda bitta karta ochiq).

**s7 — YADRO-2: FOIZ** — sarlavha (buyruq): **«Ikki holatni solishtiring: yuzta odamdan nechtasi qaytgan bo'lardi?»**
Mentor: «Kelgan odamlar soni har kuni har xil — shuning uchun sanaymiz: har yuzta odamdan nechtasi qaytgan bo'lardi. Bu — foiz.»

| Juftlik | Fakt |
|---|---|
| A | Dushanba 40 odam keldi → seshanba ulardan 8 tasi qaytdi |
| B | Payshanba 10 odam keldi → juma ulardan 4 tasi qaytdi |

1) Bashorat (ballsiz): «Qaysi holatda odamlar botga yaxshiroq qaytdi?» [A] [B] → «Tanlovingiz yozildi — endi foizni hisoblab ko'ring.» (§215)
2) Har holat ostida tugma **«Foizni hisoblash»** (ETALON 43: tugmada belgi-formula yo'q) → hisob-qatori bosqichma-bosqich yoziladi: `8 ÷ 40 × 100 = 20` · `4 ÷ 10 × 100 = 40`; yonida 10×10 nuqta-to'r: 20 / 40 nuqta yashil rangga kiradi («yuzta odamdan nechtasi»).
3) Yakun-karta: **«8 odam 4 tadan ko'p, lekin foiz B da ikki barobar katta: A da yuzta odamdan 20 tasi, B da 40 tasi qaytgan bo'lardi. Odam soni har xil bo'lsa — foizni solishtiring.»**

> 🔴 **Foiz shu yerda tug'iladi** (AUDIT 3). §142-A yo'nalishi: «ulardan … qaytdi» — qaytgan keyingi kunga yoziladi.
> 🔴 **§95:** har son nuqta-to'rda sanab ko'riladi. Ekran ≈ **340** grapheme.

**s9 — KEYS:** 6-bo'lim.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Botingizning to'rt raqamini yozing.
(mentor · artefakt bor) Uch odam bilan gaplashgansiz — endi botingiz ular uchun
nima qilganini raqamda yozing.
(mentor · artefakt yo'q) Botingizga odamlar kelyapti — endi bot ular uchun nima
qilganini raqamda yozing.
HARAKAT: To'rt kartani BITTALAB to'ldiradi: ⭐ bosh raqam → 🙋 bugun kelganlar →
↩️ qaytganlar foizi → 🔢 o'zingiz tanlagan raqam. Har kartada «Nimani sanaydi?»
(bosh va 4-karta — o'zi yozadi; 2–3-kartada tayyor, tahrirlasa bo'ladi) va «Bot buni
qachon biladi?» chiplaridan kamida bittasini tanlaydi.
JAVOB: To'rt karta saqlangan · har kartada sanaladigan narsa yozilgan · har kartada
kamida bitta «qachon» chipi.
RO'YXAT: Bosh raqam foydani sanaydi · Har raqamda «qachon» bor ·
4-raqam takrorlanmaydi  (chip ≤4 so'z — ETALON 32; batafsili chip-detail'da)
YULDUZCHA: Bugungi haqiqiy sonni ham yozing: bugun botingizga nechta odam keldi —
terminaldagi yozuvlardan sanang.
YORDAM: Botingiz odamga nima beradi? Odam shuni olsa — bitta sanaladi.
Bosh raqam shu.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Odamlar mamnun» deb yozganlarga bitta savol: buni bot qaysi xabardan
biladi? Javob topilmasa — raqam emas, fikr yozilgan.
```

**Yozuv-kartasi (80b) — bir shakl, to'rt marta:**

| Karta | «Nimani sanaydi?» (placeholder — §32, tayyor javobsiz) | «Bot buni qachon biladi?» (ko'p tanlov) |
|---|---|---|
| ⭐ Bosh raqam | `Nimani sanaysiz?` (bo'sh) | `/start bosilganda` · `xabar kelganda` · `tugma bosilganda` · `bot javob yuborganda` |
| 🙋 Bugun kelganlar | tayyor: «bugun botga yozgan yoki tugma bosgan odamlar» | shu 4 chip |
| ↩️ Qaytganlar foizi | tayyor: «kecha kelganlardan bugun ham kelganlar, foizda» | shu 4 chip |
| 🔢 O'z raqamingiz | nom: `Qisqa nom` · `Nimani sanaysiz?` | shu 4 chip |

🔴 **Chip ↔ texnik dars (87c):** to'rt chip — o'quvchi yozgan to'rt handler: `bot.start` · `bot.on('text')` · `bot.hears` · `ctx.reply` (m5-03). Chip-matnida kod YO'Q (hodisa-tilida); ✎ tahrirda kichik izoh-qator: «= bot.start» va h.k.
🔴 **Saqlash-sharti javob-qatorlari (48 · §12 · 106d):**
- ✅ «⭐ Bosh raqam yozildi: «{nima}» — bot buni {qachon} biladi.» *(o'quvchining o'z matni qaytadi — §94)*
- 🤔 maydon bo'sh → «Bu kartaga bot sanaydigan narsa yoziladi — nimani sanaysiz?»
- 🤔 chip tanlanmagan → «Bot bu raqamni qachon bilishini tanlang — kamida bittasini.»
- 🤔 4-karta nomi 2–3-karta bilan bir xil → «Bu raqam allaqachon yozilgan — boshqasini tanlang.»
🔴 **Kirish-tasma (`pm-m5d8-javoblar`):** «🎙 Eshitganingiz: … · … · …» bir qator, ish-maydoni emas; yo'q bo'lsa qator ham yo'q (jim zaxira, §69).
🔴 **80c:** yozilganlar yozish paytida ko'rinmaydi — qadam-chiroqlar; to'rttasi saqlangach s1 dagi pufak endi o'quvchining o'z nomlari bilan yoziladi (`⭐ {bosh.nima}` …) — maqsad-ekrani va'dasi yopiladi.
🔴 Ekran ≈ **120** grapheme.

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (yozuvdan sanash)
EKRAN: (topshiriq) Botning bir kunlik yozuvidan uch raqamni sanang.
(yo'riq) Har qator — botga kelgan bitta xabar yoki botning javobi. Savolga mos
qatorlarni bosing: bir odam bir marta sanaladi.
HARAKAT: Uch savolni BITTALAB o'tadi: 1) bugun kelganlar · 2) bosh raqam (keragini
olganlar) · 3) qaytganlar (kechagi ro'yxat bilan). Har savolda qatorlarni bosadi →
«Tekshirish» → javob-qatori; oxirida uch raqam bitta tasmada.
JAVOB: 1) 4 odam (Kamola · Otabek · Bekzod · Sevara) · 2) 2 odam (Kamola · Bekzod) ·
3) kechagi 4 odamdan 2 tasi (Kamola · Otabek) — 50 foiz.
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Bu odamning ismi yuqoriroqda ham bormi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda: sherigingizning ⭐ bosh raqamini o'qing va so'rang: «Bot buni
qaysi xabardan biladi?» Javob topilmasa — karta birga qayta yoziladi.
MENTORGA: Eng ko'p adashiladigan joy — Kamolaning ikkinchi qatori va Otabek:
u keldi va qaytdi, lekin keragini olmadi. Uchala raqam har xil chiqishi — darsning o'zi.
```

**Seshanba yozuvi (10 qator):**

| # | Vaqt | Qator |
|---|---|---|
| 1 | 08:40 | 👤 Kamola — /start bosdi |
| 2 | 08:40 | 🤖 bot → Kamola — ✅ kerakli javobni yubordi |
| 3 | 09:15 | 👤 Otabek — «salom» deb yozdi |
| 4 | 09:15 | 🤖 bot → Otabek — 🤷 «Tushunmadim» dedi |
| 5 | 12:02 | 👤 Kamola — tugma bosdi |
| 6 | 12:02 | 🤖 bot → Kamola — ✅ kerakli javobni yubordi |
| 7 | 16:30 | 👤 Bekzod — tugma bosdi |
| 8 | 16:30 | 🤖 bot → Bekzod — ✅ kerakli javobni yubordi |
| 9 | 18:10 | 👤 Sevara — /start bosdi |
| 10 | 18:10 | 🤖 bot → Sevara — 👋 salom berdi |

3-savolda tepada qo'shimcha qator: **«Kecha kelganlar: Kamola · Otabek · Dilshod · Madina»**.

**Javob-qatorlari (106d — noto'g'ri bosishda ham javob DOIM ochiladi):**
- 1-savol: bot-qatori bosilsa → «Bu qatorni bot yozgan — odam emas.» · 5-qator (Kamola 2-marta) → «Kamola allaqachon sanalgan — bir odam bir marta.» · ✅ «Bugun 4 odam keldi: Kamola ikki marta yozdi, lekin bir marta sanaladi.»
- 2-savol: 4-qator → «Otabek javob oldi, lekin keragini emas — bu raqamga qo'shilmaydi.» · 10-qator → «Salom — hali odamga kerakli javob emas.» · ✅ «Keragini 2 odam oldi: Kamola va Bekzod.»
- 3-savol: ✅ «Kecha kelgan 4 odamdan 2 tasi bugun ham keldi — qaytganlar foizi 50 foiz.»

Yakun-tasma: **«🙋 Bugun kelganlar: 4 · ↩️ Qaytganlar foizi: 50 foiz · ⭐ Bosh raqam: 2»** + qator: **«Bir kunning o'zidan uch xil raqam chiqdi — har biri boshqa savolga javob beradi.»**

> 🔴 **26/59 farq-dalili:** m5-08 savol-elak — obyekt SAVOL, harakat to'siqni nomlash; m5-12 kun-belgilash — obyekt kun-katagi, mezon CHAP YON (o'rin); M4-D2 — jadval qatorini bo'lim NOMIGA mosligi (mazmun) bilan belgilash; M4c-D6 signal-saralash — har xabarga YO'L tanlash. Bu yerda obyekt — **bot-yozuvi qatorlari**, harakat — **SANASH** (natija — son), mezon — **odam yagonaligi + hodisa turi** («bir odam bir marta», «✅ keragini oldi»). Hech narsa ko'chirilmaydi, tartiblanmaydi, yo'naltirilmaydi.
> 🔴 **§120:** har savolda qoida bitta va material uni himoyalaydi: takror ism (Kamola) · keragini olmagan kelgan odam (Otabek) · javobsiz /start (Sevara) — uchta yon-mantiq materialning o'zida yiqiladi. **§107:** uch javob har xil (4 · 2 · 2/4).
> 🔴 **§116:** YORDAM-savoli («ismi yuqoriroqda ham bormi?») 1- va 2-savolning har to'g'ri javobiga olib boradi; 3-savolda ipucha: «Bu ism kechagi ro'yxatda bormi?».
> 🔴 **151:** nishon faqat birinchi «Tekshirish» to'g'ri bo'lsa; `AchRule` qatori topshiriq ostida. **SOFT** faqat shu blokda (MentorNote'da).
> 🔴 Ekran ≈ **190** grapheme.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code-topshirig'i — o'quvchining o'z bot.js fayli)
EKRAN: (sarlavha) Botingiz raqamlarni o'zi aytadigan /stat buyrug'ini yozamiz.
(mentor, 2 gap) Yozuvdan qo'lda sanaganingizni endi botingiz o'zi sanaydi.
Kodni bot.js faylingizga, bot.launch() qatoridan oldin yozing.
HARAKAT: Tayyor ro'yxat va kechagilarni yig'adigan qism berilgan; bugungilarni
yig'adi, qaytganlarni sanaydi, foizni hisoblaydi. Botni ishga tushirib,
Telegram'da /stat yuboradi.
JAVOB: Bot javobi: «👥 Bugun: 3 · ↩️ Qaytgan: 2 · 📈 Foiz: 40%».
RO'YXAT: Bot /stat ga javob berdi · Bugun 3, qaytgan 2 · Foiz 40% chiqdi
YULDUZCHA: Javobga to'rtinchi qator qo'shing — kechagi odamlar soni. Shunda 40 foiz
qayerdan chiqqani ko'rinadi.
YORDAM: Kechagilarni yig'adigan uch qatorga qarang: bugungilar uchun ulardan faqat
bitta shart farq qiladi.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Eng foydali xato — bir odamni ikki marta sanash (101 bugun ikki marta
keldi). Bot ishga tushmasa — zaxira-yo'l: console.log bilan terminalda tekshirish.
```

> 🔴 **87 (o'tilgan material):** `bot.command` · `ctx.reply` (m5-03) · `telegram_id` (m5-04 `users` jadvali) · massiv, obyekt, `for…of`, `if`, `!`, `includes`, `push`, `length`, satr qo'shish `+` (M2). SQL `COUNT` o'tilmagan → ishlatilmaydi (87a). **87b:** m5-04 bot odamlarni bazaga yozdi, lekin o'z sonini hech qachon o'qimadi — bu bo'shliq shu yerda yopiladi. **87c:** «bir odam bir marta» qoidasi kodda `!includes` shartiga aylanadi — halol ulanish.
> 🔴 **§19/§48:** sarlavha natijani aytadi. **82(d):** kod nusxalanmaydi. Ekran ≈ **150** grapheme.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Botingizning bosh raqamini yoddan ayta olasizmi?
(mentor) Ekranga qaramay ayting: botingizning bosh raqami nima va bot uni
qachon biladi? (qadamlar — «sherigingizga ayting» → «bir qator yozing» — UI'da, pufakda emas: ETALON 32)
HARAKAT: (s13) yakuniy test; (s14) juftlikda aytadi, bir qator yozadi; (s16) 10 karta.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uchdan biri «bot uni qachon biladi»ni aytolmasa — s11 yozuvini qayta
oching va ✅ qatorlarni birga sanang.
```

> 🔴 **Yakka rejim (§97):** «Avval ovoz chiqarib o'zingizga ayting…». **106f(b):** mukofot — «Endi botingiz haqida «yaxshi ishlayapti» emas, raqam aytasiz» + «🎯 Bugungi qoida: faqat jamiga qarab bot haqida xulosa qilinmaydi».

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda botingiz raqamlarini yozasiz: botning o'z yozuvlaridan bugun kelganlarni,
qaytganlar foizini va bosh raqamni sanab qo'yasiz. Necha kun va nechta raqam —
pastdagi kartada tanlaysiz.
HARAKAT: Har kuni kechqurun botning terminal-yozuvlaridan (yoki users jadvalidan)
odamlarni sanaydi va raqamlarini bitta jadvalga yozadi.
JAVOB: —
RO'YXAT: Har kun uchun raqamlar yozilgan · Qaytganlar foizi foizda hisoblangan ·
Bosh raqam qaysi bot-javobidan sanalgani yozilgan
YULDUZCHA: /stat dagi qo'lda yozilgan ro'yxat o'rniga har xabar kelganda bazaga yozuv
qo'shing (INSERT) — shunda /stat haqiqiy raqamni aytadi.
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Bir kun: bugun kelganlar va bosh raqam — ikki son.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa.
Boti kam odam yig'gan bolalar sinfdoshining botida sanaydi — qoida o'sha.
```

**Variant-kartalar (57 · §96):** «To'liq · ~20 daqiqa» — ikki kun · to'rt raqam · «Qisqa · ~10 daqiqa» — bir kun · ikki raqam.
**Karta qadamlari (§11):** 1) botning yozuvini oching · 2) har odamni bir marta sanang · 3) raqamni jadvalga yozing. **Muddat:** keyingi darsgacha — sonlaringizni darsga olib keling *(73-qonun: kelajak-bog'lam FAQAT shu bandda)*.
> 🔴 Namunasiz harakat yo'q: sanash — s11, foiz — s7, bosh raqam — s10 da bajarilgan. Karta ostida bitta qator: «Botingizda odam kam bo'lsa — sinfdoshingizning botida sanang».

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
MAVZU: Metrika — sanab tekshiriladigan raqam; jami soni faqat o'sadi; bugun
kelganlar (DAU) va bir odam bir marta; kim bugun qaytgan; qaytganlar foizi (retention)
foizda; har xil guruhda foizni solishtirish; bosh raqam (North Star) — bot nechta
odamga keragini bergani; «Tushunmadim» javobi bosh raqamga qo'shilmasligi; Booking
o'zgarishni odamlarning bir qismida sinashi (2017, 1000 dan ortiq sinov); /stat buyrug'i.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74 · 17 · 64 · 105b · 21 (glossli; inglizcha nom testlarda **0**) · 34 · §99 · §102 · §110 · §127 · §129 · §133 · §134 · §147 (3-vs-1 shakl yo'q) · 159/11 (izoh «To'g'ri —» bilan boshlanmaydi, variantni qaytarmaydi) · 159/17 (savol oldida javob-ishora yo'q; savol emojisi javob-ikonkasini takrorlamaydi).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🤖 Mentor botingiz haqida so'radi. Qaysi javobni sanab tekshirib bo'ladi?
- A. Botimni hamma juda yaxshi ko'radi *(33)*
- **B.** Bugun botdan 9 odam javob oldi ✅ *(30)*
- C. Botim sinfdagi eng qulay bot *(28)*

**Izoh:** 9 odamni botning yozuvidan birma-bir sanab tekshirasiz — «yaxshi ko'radi», «qulay» esa har kimda boshqacha.
> §129: s2 kartalari («juda yaxshi ishlayapti» / «12 odam yozdi») so'zma-so'z qaytmaydi. §102: A va C — s2 dagi «sanab bo'lmaydigan» gap turining yangi namunalari. Uzunlik 33 · 30 · 28 — to'g'ri javob eng uzun emas (tell 1.18).

### TEST-2 (s6 — s5 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 🤖 Kecha 10 odam keldi. Ulardan 3 tasi bugun ham keldi. Bu qaysi raqam haqida?
- A. Bugun kelganlar soni *(20)*
- B. Botning bosh raqami *(19)*
- **C.** Qaytganlar foizi ✅ *(17)*

**Izoh:** Kechagi odamlardan bugun ham kelganlari sanalyapti — o'ndan uchtasi.
> §127: uchala variant ham dars nomi — kalit-so'z telli yo'q. To'g'ri javob eng qisqa. Savol emojisi ↩️ EMAS (159/17 — javob-ikonkasi).

### TEST-3 (s8 — s7 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 🤖 Bir kuni 20 odamdan 5 tasi qaytdi, boshqa kuni 6 odamdan 3 tasi. Qaysi kunda foiz katta?
- **A.** Ikkinchisida — 50 foiz, birinchisida 25 ✅ *(39)*
- B. Birinchisida — qaytganlar soni ko'proq, 5 ta *(44)*
- C. Teng — ikkala kunda ham odamlar qaytgan *(39)*

**Izoh:** Yuzta odamga keltirilsa, ikkinchi kunda 50, birinchisida 25 odam qaytgan bo'lardi.
> §106: s7 sonlari (40→8, 10→4) qaytmaydi. §102: B — s7 yakun-kartasi rad etgan «ko'p odam = yaxshi» mantig'i. To'g'ri javob eng uzun emas. Savol 13 so'z (105b chegarasida — metodistga).

### TEST-4 (s13 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 🤖 /stat javobi: jami 300, bugun 6, qaytganlar foizi 5. Bot qanday ishlayapti?
- A. Jamiga qarang: 300 — bot o'syapti *(33)*
- **B.** Foizga qarang: 5 — odamlar deyarli qaytmayapti ✅ *(43)*
- C. Bugungiga qarang: 6 — bot har kuni ishlaydi *(43)*

**Izoh:** Jami soni faqat o'sadi. Yuzta odamdan atigi 5 tasi qaytadi — odamlar botda qolmayapti.
> §99/§147: uchala variant bir qolipda («…ga qarang: son — hukm»). §134: uchala son variantlarda qaytadi. To'g'ri javob eng uzun emas (tell 1.30 — metodist qisqartirishi mumkin).

---

## 5. YOZISH-EKRANI (s10) — qo'shimcha

- **Qadam-indikator (80a):** to'rt doira «⭐ · 🙋 · ↩️ · 🔢» — yozilgani yashil ✓, joriysi indigo, kelgusi kulrang.
- **2–3-kartada tayyor matn** — qulf emas, ✎ bilan tahrirlanadi (o'quvchi o'z botiga moslaydi: «bugun tugma bosgan odamlar»).
- **Tugma ↔ s11 ↔ s12 bog'lanishi:** «bot javob yuborganda» chipi s11 dagi ✅ qatorlar va s12 dagi `ctx.reply` bilan bir hodisa — mentor s12 da shuni ochiq aytadi.
- **Ball yo'q** (`INLINE_KEYS: s10 = -1`); done = 4/4 saqlandi → `pm-m5mx-raqamlar` yoziladi.

---

## 6. KEYS SPETSIFIKATSIYASI (s9 — K9 BOOKING.COM · 33/56/91b/100 qolipi)

🔴 **Burchak:** «o'zgarish yaxshi bo'ldimi — buni raqamlar hal qiladi» → bosh raqam kerakligi. `m7-08` (Analitika birinchi kundan, K9) uchun **sinov usulining o'zi** (guruhlarga bo'lish, «A/B test» nomi, gipoteza) qoldiriladi — bu darsda «A/B» so'zi **0** (29-qonun).
🔴 **Bankdan tashqari fakt YO'Q (§101/§124):** faqat — deyarli har o'zgarish (tugma rangi, matn, bloklar tartibi) · avval odamlarning bir qismida sinaladi · 2017 · bir vaqtda 1000 dan ortiq. **Booking qaysi raqamga qaragani AYTILMAYDI** (bank jim).

**Freym (91b):** eyebrow «🏨 Booking.com · n/6» (uzluksiz hisoblagich — 17-ov b). Kirish-gap: «Biznes olamidan mashhur voqea.» «Keys» so'zi ekranda yo'q.

1. **slayd-1:** Booking.com — mehmonxonada yoki ijara uyda oldindan joy band qilinadigan sayt. U yerda deyarli har bir o'zgarish — tugma rangi, matn, sahifadagi bo'limlar tartibi — hammaga birdan ko'rsatilmaydi.
2. **bashorat-1:** «Yangi tugma rangi avval kimga ko'rsatiladi?» — «Saytdagi hamma odamga birdan» *(28)* · «Odamlarning bir qismiga» ✅ *(23)* · «Faqat kompaniya xodimlariga» *(27)*
3. **slayd-2:** Yangi rangni odamlarning bir qismi ko'radi, qolganlari eskisini ko'rib turadi. Keyin ikki guruhning raqamlari solishtiriladi.
4. **bashorat-2:** «Kompaniya 2017-yilda bir vaqtda nechta shunday sinov o'tkazishini aytgan?» — «10 dan ortiq» · «100 dan ortiq» · «1000 dan ortiq» ✅ *(§43 zinapoya, bir o'lchov)*
5. **slayd-3:** Kompaniya 2017-yilda ochiq aytgan: bir vaqtda 1000 dan ortiq sinov o'tkaziladi. Mingta sinovni chamalab hal qilib bo'lmaydi — har birida raqamlar solishtiriladi.
6. **ko'prik (alohida bosqich, 44/91b):** Botingizga yangi tugma qo'shsangiz ham shu savol chiqadi: bot yaxshi bo'ldimi? Buni bilish uchun eng muhim raqamni o'zgarishdan OLDIN tanlab qo'yasiz — botingizning bosh raqamini.

**Natija-qatorlari (56/100):** topsa «🎯 Topdingiz! …»; adashsa «Aslida: …» (§215). Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring». Bashoratlar BALLANMAYDI.
> 🔴 **109/6:** keys-slaydlarida ballsiz taxmin — 2 ta (M5 keys-qolipi pretsedenti PmLesson19–21; metodist ko'radi).
> 🔴 **§122:** «1000» darsning ta'rifiga kiygizilmaydi — u faqat «ko'z bilan hal qilib bo'lmaydi» degan fikrni ko'taradi.
> 🔴 Ekran: slayd ≈ 150–190 · ko'prik ≈ 200 grapheme.
> 🔴 **MentorNote:** «Booking qaysi raqamga qaraganini bank aytmaydi — o'zingizdan qo'shmang. Sinovning nomini va usulini ochmang: u keyinroq alohida dars.»

---

## 7. KODING SPETSIFIKATSIYASI (s12 — VS Code, o'z `bot.js`)

🔴 **Qobiq (26-qonun, `ScreenLivePractice` naqshi):** panel CHAPDA (yo'riq + darvoza-mashq + 3 bandli checklist + «✅ Bajardim — bot /stat ga javob berdi»), VS Code-maketi O'NGDA (`bot.js` yorlig'i, pastida Telegram-pufak preview). **Jonli preview (WOW):** o'ng pastda s4 dagi suhbat-pufagi — kutilgan javob `👥 Bugun: 3 · ↩️ Qaytgan: 2 · 📈 Foiz: 40%` xira holda, «Bajardim» bosilgach to'liq yonadi. `MentorPracticeStats` · 82(f): sinf natijasi o'quvchiga ko'rinmaydi.

**Darvoza-mashq (82e — o'tilgan texnik bilimdan):** «`bot.command('stat', …)` qachon ishlaydi?» → «Odam botga /stat deb yozganda» ✅ *(30)* · «Bot ishga tushgan zahoti» *(24)* · «Odam har qanday xabar yozganda» *(30)*.

**Boshlang'ich kod** (satr qo'shish bilan — shablon-satr/backtik YO'Q, CLAUDE.md oq-ekran xavfi):

```js
// bot.js — bot.launch() qatoridan OLDIN qo'shing.
// Har qator: kim (telegram_id) qaysi kuni botga keldi.
// Hozircha ro'yxatni qo'lda yozdik — keyin u bazadan keladi.
const kelishlar = [
  { telegram_id: 101, kun: 1 }, { telegram_id: 102, kun: 1 },
  { telegram_id: 103, kun: 1 }, { telegram_id: 104, kun: 1 },
  { telegram_id: 105, kun: 1 },
  { telegram_id: 101, kun: 2 }, { telegram_id: 104, kun: 2 },
  { telegram_id: 106, kun: 2 }, { telegram_id: 101, kun: 2 },
  { telegram_id: 104, kun: 2 },
];

function stat(kelishlar, bugun) {
  // Kechagi odamlar — tayyor: bir odam bir marta
  const kechagilar = [];
  for (const k of kelishlar) {
    if (k.kun === bugun - 1 && !kechagilar.includes(k.telegram_id)) {
      kechagilar.push(k.telegram_id);
    }
  }

  // 1) Bugungi odamlarni xuddi shunday yig'ing
  const bugungilar = [];

  // 2) Bugungilardan nechtasi kechagilar ichida bor?
  let qaytgan = 0;

  // 3) Foiz: qaytgan ÷ kechagilar soni × 100
  let foiz = 0;

  return { bugun: bugungilar.length, qaytgan: qaytgan, foiz: foiz };
}

bot.command('stat', (ctx) => {
  const s = stat(kelishlar, 2);
  ctx.reply('👥 Bugun: ' + s.bugun + '\n↩️ Qaytgan: ' + s.qaytgan + '\n📈 Foiz: ' + s.foiz + '%');
});
```

**Tekshiruv (hisob):** kechagilar = 101…105 (5) · bugungilar = 101, 104, 106 (3; 101 va 104 ikki martadan) · qaytgan = 2 · foiz = 2 × 100 ÷ 5 = **40** (butun son — `Math.round` kerak emas). Starter javobi `Bugun: 0 · Qaytgan: 0 · Foiz: 0%` — **yashil emas** (18-ov).

**Uch band (RO'YXAT bilan bir so'zda):** 1) Bot /stat ga javob berdi · 2) Bugun 3, qaytgan 2 · 3) Foiz 40% chiqdi.

**🛟 Zaxira-yo'l (155-qonun, §188):** «Bot ishga tushmasa — faylning oxiriga `console.log(stat(kelishlar, 2));` yozing va terminalda `node bot.js` bilan natijani ko'ring. Terminalda 3 · 2 · 40 chiqsa — vazifa bajarilgan.» Ayblamaydi, oxirida ruxsat beradi.

> 🔴 **26-qonun (farq-dalili):** m5-08 VS Code — sof JS, natija **terminalda** (suhbat varag'i); m5-12 — kompilyator. Bu dars — VS Code, lekin **o'quvchining ishlaydigan boti ichida**, natija **Telegram'da bot javobi** sifatida. Kompilyator bu yerga qo'yilsa, m5-12 bilan ketma-ket ikki kompilyator bo'lardi (26-qonun «JS-funksiya kompilyatori ikki darsda ketma-ket = zerikarli»). R1 navbati o'zgaradi → GATE S 4-savol.
> 🔴 **Nomlar ASCII, apostrofsiz:** `kelishlar` · `kechagilar` · `bugungilar` · `qaytgan` · `foiz` · `stat`. Satr ichida `'\n'` — quruvchi JSX-ko'rinishda escape qiladi.
> 🔴 **§186:** YORDAM joyni aytadi («uch qatorga qarang»), javobni emas. **89:** takrorlash-yo'li «✓ Bu mashqni sinfda bajarganman — davom etish →».

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| s1 MAQSAD | Pufak CSS-taymlayn bilan yoziladi; `?` o'rnida nom ham, son ham yo'q (§125/§178) |
| s14 REFLEKSIYA | Sarlavha-savol · juftlik + Reflection bir qator · yakka rejim tarmog'i · yozgach mukofot (106f-b) |
| s15 PODIUM | 93: «Bugungi g'oliblarimiz» / «Bugungi natijangiz» (etalondan grep) |
| s16 FLASHCARD | Mentor YO'Q (99a) · «O'zingizni sinab ko'ring.» · `.fc-hint` YO'Q (159/6) |
| s17 YAKUN | hero → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda yo'q) |
| Sarlavhalar | 47: interaktiv (s4 · s7 · s10 · s11 · s12) — buyruq; teoriya/refleksiya (s0 · s2 · s5 · s14) — savol |
| Bezak (159) | chap rang-chiziq · kesik chiziq · bo'sh-holat ramkasi · ico-emoji qatlami · qora tugma — **0**; olam-emojilari (bot javobidagi 👥 🙋 ↩️ ⭐ ✅) qoladi |

**s17 «Endi siz bilasiz» (§52):**
1. Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.
2. Jami soni faqat o'sadi — bot qanday ishlayotganini u aytmaydi.
3. Kecha kelgan har yuzta odamdan nechtasi bugun ham keldi — shu qaytganlar foizi.
4. Bosh raqam — bot nechta odamga keragini berganini sanaydi.

### 8-A. 🔴 TAQIQ-SO'ZLAR (o'quvchi matnida **0**)

| So'z | Sabab | O'rniga |
|---|---|---|
| Duolingo · streak · 🔥 · alanga | K5 — PmLesson21 ga tegishli (AUDIT 1–2) | — |
| churn | v9 da yo'q, TMI | — |
| MAU · kogorta | kattalar atamasi, izohsiz | «bugun kelganlar» |
| dashboard · panel | M4c-D6 imzo-nomi (O'LCHAGICH-PANELI) | «/stat javobi» |
| analitika · statistika · ko'rsatkich | kattalar tili / kantselyarit | «raqam», «sanash» |
| voronka · funnel · konversiya | m5-02 mexanikasi / kalka | — |
| A/B test · gipoteza | m7-08 atamasi (29-qonun) | «odamlarning bir qismida sinash» |
| loyiha · MVP · 8-Modul | eski M8 konteksti (AUDIT 4) | «botingiz» |
| maktab oshxonasi · bufet | eski sahna (AUDIT 4) | — |
| Botjon | personaj-taqiq (5.8) | «botingiz» |
| daftar | global taqiq | «ro'yxat», «jadval» |
| kir- (odam haqida) | §121 + til-lint `yana-kirish` | «keldi», «yozdi» |
| «keyingi darsda …» | 73-qonun | faqat uy-vazifa MUDDAT bandi |
| intriga-so'zlari (korpus §65/§83) | mentor intriga sotmaydi | — |

🔴 **Istisno (metodist 2026-09-28, §20):** DAU · retention · North Star — faqat s5 «Inglizcha nomi:» qatorlarida va flashcard-5/7 JAVOBI oxirida «(inglizcha: …)». Scored matnda (test, arena) inglizcha nom **0** — arena Q5/Q11 o'zbekcha qayta yozildi. Boshqa har joyda — o'zbekcha nom.

### 8-B. Quruvchiga — `SCREEN_INTENTS`

| Ekran | intent (1 gap — bola nima QILADI/BILADI) | done-sharti |
|---|---|---|
| s0 | Bola bot yaxshi ishlayotganini qaysi raqamga qarab bilishini tanlaydi va jami soni faqat o'sishini eshitadi | tanlov bosildi |
| s1 | Bola dars oxirida botining to'rt raqamini yozishini oldindan ko'radi | avto |
| s2 | Bola fikr bilan sanab tekshirib bo'ladigan raqamni ajratib, metrika nima ekanini biladi | 2 karta ochildi |
| s3 | Bola sanab tekshirib bo'ladigan javobni tanlaydi | scored |
| s4 | Bola botdan /stat so'rab, jami o'sganda qolgan uch raqam tushganini ko'radi | 3 chip bosildi, yakun-karta |
| s5 | Bola uch raqamning har biri qaysi savolga javob berishini va nomini ochadi | 3 qator ochildi |
| s6 | Bola kechagilardan bugun ham kelganlar qaytganlar foizi ekanini aniqlaydi | scored |
| s7 | Bola ikki juftlikni yuzta odamga keltirib, foizni solishtirishni o'rganadi | 2 juftlik hisoblandi |
| s8 | Bola har xil kattalikdagi ikki kunda qaysi kunda qaytganlar foizi katta ekanini topadi | scored |
| s9 | Bola Booking har o'zgarishni odamlarning bir qismida sinab, raqamlarni solishtirishini biladi | 6/6 bosqich |
| s10 | Bola o'z botining bosh raqami va uch raqamini bittalab yozadi va har biri qachon sanalishini tanlaydi | 4/4 saqlandi |
| s11 | Bola botning bir kunlik yozuvidan bir odamni bir marta sanab, uch raqamni topadi | 3/3 savol tekshirildi |
| s12 | Bola o'z botiga /stat buyrug'ini yozadi va bot bugungi, qaytgan sonini va foizni aytadi | «Bajardim» |
| s13 | Bola /stat javobidan bot qanday ishlayotganini to'g'ri raqamga qarab aytadi | scored |
| s14 | Bola botining bosh raqamini yoddan aytadi va bir qatorda yozadi | 1 qator |
| s15 | Bola o'z natijasini (jonlida — guruh reytingini) ko'radi | — |
| s16 | Bola o'nta karta bilan o'zini tekshiradi | — |
| s17 | Bola arenada bilimini sinaydi, uy-vazifasi va nishonlarini bir sahifada ko'radi | — |

**`INLINE_KEYS`:** `{ s3: 1, s6: 2, s8: 0, s13: 1, s4: -1, s7: -1, s10: -1, s11: -1, s12: -1 }` (PRACTICE_BASE sentinel).
**s4 holat-mashinasi:** `idle` → (/stat) `jami` → (bashorat) `ask` → (3 chip, istalgan tartibda) `done` + yakun-karta + `Two Mondays!`. Reduced-motion: pufak qatorlari animatsiyasiz. Holat `pm-m5mx-stat` (F-0730-01).
**s11 holat-mashinasi:** `q = 0..2` · qatorlar toggle · «Tekshirish» → javob-qatori → «Keyingi savol ▸» → yakun-tasma. Birinchi xatodan keyin YORDAM (bir marta). `ccProgress.missed` (151/5).

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s · to'g'ri indekslar 0,3,2,1 · 1,0,2,3 · 0,2,1,3)

| # | Savol | Variantlar (✅ = to'g'ri) | idx | Manba |
|---|---|---|---|---|
| 1 | Metrika qanday raqam? | ✅ Sanab tekshirib bo'ladigan raqam · Bot haqidagi yaxshi fikr · Botning chiroyli nomi · Mentor qo'ygan baho | 0 | s2 |
| 2 | Qaysi raqam faqat o'sadi? | Bugun kelganlar · Qaytganlar foizi · Bosh raqam · ✅ Jami /start bosganlar | 3 | s4 |
| 3 | Kamola bugun botga 3 marta yozdi. «Bugun kelganlar» soniga nechta qo'shiladi? | 3 ta · 2 ta · ✅ 1 ta · 0 ta | 2 | s11 |
| 4 | Kecha 10 odam keldi, bugun ulardan 5 tasi qaytdi. Qaytganlar necha foiz? | 5 foiz · ✅ 50 foiz · 10 foiz · 15 foiz | 1 | s7 |
| 5 | «Botga bugun odam keldimi?» — bu savolga qaysi raqam javob beradi? | Jami /start bosganlar · ✅ Bugun kelganlar · Qaytganlar foizi · Bosh raqam | 1 | s5 |
| 6 | Bosh raqam nimani sanaydi? | ✅ Keragini olgan odamlarni · Botga kelgan hamma odamni · Botdagi tugmalar sonini · Bot yozgan xabarlar sonini | 0 | s5/s10 |
| 7 | Guruhlar har xil kattalikda bo'lsa, nimani solishtirasiz? | Qaytgan odamlar sonini · Kelgan odamlar sonini · ✅ Qaytganlar foizini · Jami /start sonini | 2 | s7 |
| 8 | Bot «Tushunmadim» deb javob berdi. Bu bosh raqamga qo'shiladimi? | Ha — bot javob yubordi · Ha — odam botga yozdi · Yo'q — odam /start bosmagan · ✅ Yo'q — odam keragini olmadi | 3 | s11 |
| 9 | Booking yangi o'zgarishni avval kimga ko'rsatadi? | ✅ Odamlarning bir qismiga · Faqat o'z xodimlariga · Hamma odamga birdan · Faqat eski mijozlarga | 0 | s9 |
| 10 | Booking.com 2017-yilda bir vaqtda nechta sinov o'tkazgan? | 10 dan ortiq · 100 dan ortiq · ✅ 1000 dan ortiq · Bittadan, navbat bilan | 2 | s9 |
| 11 | Qaytganlar foizi qaysi savolga javob beradi? | Bugun nechta odam keldi? · ✅ Kechagilar bugun ham keldimi? · Bot odamga keragini berdimi? · Jami nechta odam yig'ildi? | 1 | s5 |
| 12 | /stat buyrug'ini qayerga yozdingiz? | users jadvaliga · Telegram kanaliga · BotFather'ga · ✅ bot.js faylingizga | 3 | s12 |

> 🔴 **16-ov/§107:** Q8 — 2 «Ha» / 2 «Yo'q», farq SABABda. **§144:** arena savollari ekran-savollarining nusxasi emas (T2 ning 10→3 si emas, Q4 da 10→5). **§114:** fon-dekor so'zlari shu dars lug'atidan (raqam · keldi · qaytdi · foiz · /stat · ⭐) — `🔥`, `streak`, `churn`, `DAU` fon-tokeni sifatida **0** (eski `MMX_TOKENS` olib tashlanadi).
> 🔴 **21/§20 (metodist 2026-09-28):** arenada inglizcha nom **0** — Q5/Q11 o'zbekcha savol, variantlar va indekslar o'zgarmadi.

---

## 10. NISHONLAR (4 ta — 6/101: inglizcha nom · tavsif ≤48 · REAL trigger · 151)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Two Mondays!** | Ikki dushanbani to'rt raqamda solishtirdingiz | 44 | s4: 3 chip bosildi, yakun-karta ochildi |
| **Star Picker!** | Botingizga bosh raqam va uch raqam yozdingiz | 44 | s10: 4/4 saqlandi |
| **Fair Counter!** | Yozuvdan har odamni bir martadan sanadingiz | 43 | s11: uch savol ham BIRINCHI urinishda to'g'ri (151) |
| **Stat Command!** | Botingizga /stat buyrug'ini qo'shdingiz | 38 | s12: darvoza-mashq to'g'ri + «Bajardim» |

> 🔴 **§100:** «Streak Master», «Retention Hero», «Dashboard Pro» — RAD (taqiq-so'zlar). **§184/§133:** tavsif bajarilgan ishni aytadi; s12 «qo'shdingiz» — o'z-tasdiq (VS Code, PmLesson20 pretsedenti). Eski `panelPro`/`calcMaster` olib tashlanadi.

---

## 11. FLASHCARD (10 ta — §76 · §90e · §145)

| # | Savol | Javob |
|---|---|---|
| 1 | Metrika nima? | Bot haqida sanab tekshirib bo'ladigan raqam |
| 2 | Qaysi raqam faqat o'sadi va nega u yetmaydi? | Jami /start bosganlar — bot yomonlashsa ham kamaymaydi |
| 3 | «Bugun kelganlar» nimani sanaydi? | Bugun botga yozgan yoki tugma bosgan odamlarni — bir odam bir marta |
| 4 | Kim bugun qaytgan hisoblanadi? | Kecha kelgan odam bugun ham kelsa — u bugun qaytgan hisoblanadi |
| 5 | Qaytganlar foizi qanday hisoblanadi? | Qaytganlar sonini kechagi odamlar soniga bo'lib, 100 ga ko'paytiriladi (inglizcha: retention) |
| 6 | Nega odam soni emas, foiz solishtiriladi? | Guruhlar har xil kattalikda — foiz ularni yuzta odamga keltiradi |
| 7 | Bosh raqam nimani sanaydi? | Bot nechta odamga keragini berganini (inglizcha: North Star) |
| 8 | Bot «Tushunmadim» desa, bosh raqamga qo'shiladimi? | Yo'q — odam javob oldi, lekin keragini emas |
| 9 | Booking yangi o'zgarishni qanday sinaydi? | Avval odamlarning bir qismiga ko'rsatadi; 2017-yilda bir vaqtda 1000 dan ortiq sinov ketgan |
| 10 | /stat buyrug'i nimani aytadi? | Bugun kelganlar, qaytganlar soni va ularning foizi |

> 🔴 **§76:** javoblarda tarjimasiz chet so'z yo'q (5/7-kartada inglizcha nom faqat javob oxirida qavsda «(inglizcha: …)»). **§52📌:** 1 va 4-karta kanonik ta'rif bilan so'zma-so'z.

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

- **s3 · «Sanab tekshiriladigan raqam»** — (1) kanonik ta'rif · (2) «yaxshi», «qulay» — fikr, uni sanab bo'lmaydi · (3) sinfga savol
- **s6 · «Uch raqam — uch savol»** — (1) bugun kelganlar: botga bugun odam keldimi · (2) qaytganlar foizi va bosh raqam: odamlar qaytyaptimi, bot odamga keragini berdimi · (3) savol
- **s8 · «Foizda solishtiring»** — (1) qaytganlar sonini kechagi odamlar soniga bo'lib, 100 ga ko'paytiring · (2) guruhlar har xil bo'lsa — foizni solishtiring · (3) savol
- **s13 · «Faqat jamiga qaramang»** — (1) jami soni faqat o'sadi · (2) odamlar qaytyaptimi — buni foiz aytadi · (3) savol

> 🔴 **§133:** s8 bandlari T4 ning kaliti emas (T4 — qaysi raqamga qarash, foiz hisobi emas). **43:** sarlavhada formula belgisi yo'q.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):** 1) VAQT = 82 ✓ · 2) 13 maydon har blokda ✓ · 3) blok 4 va 8 da RO'YXAT aynan 3 ✓ · 4) blok 8 da EKRAN + QISQA_VARIANT ✓ · 5) K9 M5 ro'yxatida yo'q ✓ · 6) TEKSHIRUV (yozuvdan sanash) ≠ m5-08 savol-elak ✓ · 7) «sen» 0 ✓ · 8) SOFT faqat blok 5 ✓.
**Qonunlar:** 26 (koding-variativlik — dalil 7-bo'lim) · 73 (va'da faqat MUDDAT) · 87 (a/b/c/d — 3-blok 6 izohi) · 91 (bitta ip + keys freym/ko'prik) · 95 (o'smir Telegram'ni o'zi ishlatadi, bot — o'zi qurgan) · 96 (modul-ipi: bot m5-01 → m5-10) · 108/109 (bitta olam; mentor ≤2 gap; churn va eski 4 ekran olindi) · 111 (har interaktiv ekranda bitta tugma-boshlanish) · 151 (s11 birinchi urinish, `AchRule`) · 159 (bezak 0; 159/17 — savol emojisi javob-ikonkasi emas) · 5.8 (personaj 0).
**Til:** siz-forma · ASCII apostrof · kirill 0 · «kir-» odam haqida 0 · 8-A grep-ro'yxati. Grapheme-sonlari **taxminiy** (≈) — quruvchi/metodist dasturiy o'lchaydi (QOIDA 10).

---

## 14. ESKI `PmMetricsLesson.jsx` DAN QAYTA ISHLATILADIGANLAR

| Qoladi (moslab) | Olib tashlanadi |
|---|---|
| Infra/relslar (P0 dan): `useLiveSession`, `LiveGate`, `QuestionScreen`, `MentorTestStats`, `RecapOverlay`, `ScreenPodium`, CodeStrike-arena, `AchCtx`/`AchMissCtx` (151), `PRACTICE_BASE` sentinel, `ccProgress` | s0 Duolingo streak-ovozi (`HOOK_OPTS`, :634-675) |
| `METRIC_DEFS` (:834) — ta'rif-matnlari s5 kartalariga qayta yoziladi («kirdi» → «keldi», foiz s7 ga) | s1 «panel jonlanadi» (`DEMO_METRICS`, CountUp, sparkline) |
| `ScreenMetricWorkshop` (:1082) bittalab-karta skeleti → s10 (maydonlar o'zgaradi: `nom/nima/qachon`) | s2 oshxona haftaligi (`OSHX_DAYS`, :775-820) |
| `QuestionScreen` testlari (s7/s8 → yangi T1–T4 matni) | s3 `MSORT` saralash · `K5_SLIDES`/`K5_BETS` · `peer` · `clinic` · `priority` · `MATCH_PAIRS`/`MMX_TOKENS` |
| VS Code maketi + checklist qobig'i (:1833) → s12 (kontent: `/stat`, React → Telegraf) | `MiniPult` strip · «Metrika alangasi» · `HW_TOKENS` («loyiha») · M8 shapka |

---

## 15. [GATE S] — FOYDALANUVCHIGA SAVOLLAR

1. **Keys: K9 Booking** (tanlandi) — bank-temasida «metrikalar» bor, M5 da band emas. Muqobil: **K13 Telegram** («1 mlrd faol foydalanuvchi oyiga», mart 2025 — botning o'z platformasi, raqami aynan «faol odamlar» o'lchovi; lekin bank-hikoyasi tezlik haqida). **K6 Netflix RAD** — uning 80% raqami PmLesson11 da bashorat sifatida allaqachon so'ralgan.
2. **Inglizcha nomlar:** o'zbekcha nom birlamchi, DAU/retention/North Star faqat s5 da bir marta + flashcard 5/7 + arena Q5/Q11. Yoki korpus §20 bo'yicha inglizchasi umuman chiqmasinmi?
3. **«metrika» so'zi** — o'zbekchada «tug'ilganlik guvohnomasi» ma'nosi ham bor. Qavsda «(o'lchov raqami)» yetadimi, yoki bosh so'z «o'lchov raqami» bo'lsinmi?
4. **Koding — VS Code, o'quvchining o'z `bot.js`** (`/stat`). Registr R1 navbati o'zgaradi: m5-08 VS Code → **m5-11 VS Code (bot ichida)** → m5-12 kompilyator. Ikki VS Code ketma-ket, lekin yuzasi farqli (terminal ↔ Telegram-javob). Rozimisiz?
5. **`/stat` ma'lumoti qo'lda yozilgan ro'yxat** (izohda ochiq aytilgan); haqiqiy sonlar — uy-vazifa YULDUZCHAsida `INSERT` orqali. Yetarlimi?
6. **PmLesson21 ga minimal o'zgarish** (16-bo'lim) — A bandi majburiy, B–C ixtiyoriy.
7. **Hook payoff** «jami soni faqat o'sadi» deydi — bu «Jami» ni tanlagan bolaga yashirin hukm bo'lib qolmaydimi (§119)?
8. **lessonId `pm-m5d11-metrika-v1`** (PmLesson21 `pm-m5d11-v1` bilan to'qnashmaydi — lessonId aniq moslik bilan ishlatiladi, `src/live/progressSync.js` tekshirildi); localStorage prefiksi `pm-m5mx-`.

### `App.jsx` KARTA TAKLIFI (29-qonun — «?»li o'quvchi-savoli)
`{ key: 'm5-11', n: 11, type: 'PM', emoji: '⭐', title: 'Botingiz yaxshi ishlayotganini qaysi raqam aytadi?', sub: 'bitta bosh raqam va unga yordam beradigan uch raqam', comp: PmMetricsLesson }` → PmLesson21 `m5-12` (n: 12), Rezerv/Demo bittadan suriladi. *(App.jsx ga bu senariyda tegilmaydi.)*

---

## 16. PmLesson21 GA O'ZGARTIRISH (minimal, alohida ish — bu senariy tahrir qilmaydi)

**Sabab:** PmLesson21 (`src/5-Modull/PmLesson21.jsx`, senariy `M5-D11-Qaytish.md`) «metrika · retention · foiz — M8-D1 ning ishi, keyin keladi» deb qurilgan. Endi Metrika darsi uning **oldida** turadi: nom va foiz allaqachon o'rgatilgan. PmLesson21 ning o'z mexanikasi (tirik sanoq, kalendar, kun-belgilash, K5) **o'zgarmaydi**.

**A. Majburiy (2 joy):**
1. **Shapka-izohi** (:12, :20-21): «M8-D1 ning "usul" burchagi» → «K5 endi faqat shu darsda (oldingi Metrika darsidan chiqarilgan)»; «foiz, "%" va inglizcha nomlar (M8-D1 atamalari) dars matnida 0» → «foiz va inglizcha nomlar bu darsda 0 — ular oldingi darsda (m5-11 Metrika) o'rgatilgan; bu dars tirik sanoqda qoladi, faqat s2 dagi bitta ko'prik-gap istisno».
2. **s2 xulosa-kartasi ostiga bitta ko'prik-gap** (§59/§112 — orqaga-havola o'quvchi ko'rgan so'z bilan; taqiq-ro'yxatiga yagona istisno):
   > «O'tgan darsda buni foizda hisoblagansiz — qaytganlar foizi. Bugun esa botingizning o'z kunlarida qaytganlarni bittalab sanaysiz.»
   Kanonik ta'rif («Kecha kelgan odam bugun ham kelsa — u bugun qaytgan hisoblanadi.») ikkala darsda so'zma-so'z bir xil — tahrir kerak emas.

**B. Ixtiyoriy:** s8 kirish-tasmasi `pm-m5d8-javoblar` o'rniga (yoki yoniga) `pm-m5mx-raqamlar.bosh.nima` ni o'qisin — «⭐ Bosh raqamingiz: …» (jim zaxira saqlanadi).
**C. Registr/App (alohida):** `PM_KEYS_MEXANIKA_REGISTRI.md` — K5 «BAND: M8-D1» → «m5-12 PmLesson21»; K9 → «m5-11 PmMetricsLesson»; 5-bo'limga «/STAT SUHBATI» · «YOZUVDAN SANASH»; R1 navbati (4-savol). `App.jsx` — 15-bo'lim.

---

## 17. QURUVCHIGA — QISQA ESLATMA

- Fayl `src/pm/PmMetricsLesson.jsx` BUTUNLAY qayta yig'iladi; infra — P0 + `src/5-Modull/PmLesson21.jsx`/`PmLesson20.jsx` (M5 relslari, VS Code maketi PmLesson20 dan). PM-STUDIA palitrasi.
- CSS izohida backtik YO'Q; kod-namunada shablon-satr YO'Q (satr qo'shish). `'\n'` JSX-da escape.
- Har tahrirdan keyin `npm run gates -- src/pm/PmMetricsLesson.jsx`; 8-A taqiq-so'zlari grep = 0; `src/5-Modull/PmLesson21.jsx` ga bu yig'ishda tegilmaydi (16-bo'lim — alohida ish).

---

## METODIST KORREKTURASI (2026-09-28)

**Hukm:** senariy tuzilmasi sog'lom; matn 5 sinf-nuqsondan tozalandi. `lint:til` — **0 error** (11 warn ko'rib chiqildi: 6 × «hisoblanadi» — PmLesson21 kanonik ta'rifi so'zma-so'z, prodda yashaydi → OQLANDI; flashcard-5 «qanday hisoblanadi» — haqiqiy hisob; yadro/va'da/kirill — ichki jadval va shapka-iqtibos, ekranga chiqmaydi). Grapheme dasturiy o'lchandi (Intl.Segmenter): s2 367 · s4 267 · s5 341–365 (eng uzun karta bilan) · s7 396 · s9 ≤351 · s0 ≈357 — hammasi ≤400 (tahrirdan oldin s2 409, s5 422–437 edi).

| # | Sinf | Oldin → Keyin | Asos |
|---|---|---|---|
| 1 | **Atama «ulush»** (butun fayl kaskadi: s5 · s7 · s10 · s11 · s12 kod-satri · T2/T3/T4 · arena · flashcard · RECAPS · artefakt `nom`) | «qaytganlar ulushi» → **«qaytganlar foizi»**; kanonik: «Kecha kelgan har yuzta odamdan nechtasi bugun ham keldi — shu qaytganlar foizi.» · /stat: «📈 Ulush: 40%» → «📈 Foiz: 40%» | MATN_ETALONI lug'ati «ulush (metrika ta'rifida) → foiz» (F-0727-56); kalit `pm-m5mx-ulush` o'zgarmadi (ichki) |
| 2 | **Bosh raqam ta'rifi — «ish»** (ETALON 43: «ish» bosh-atama darsidan tashqarida aniq so'z bilan) | «odamning ishini qilib berganini sanaydigan…» → **«Bot nechta odamga keragini berganini sanaydigan eng muhim raqam.»** — s4 «Keragini olganlar» qatori va s11 sanog'i (odam soni) bilan bir o'lchov | s5 · s10 YORDAM · s11 · s17 · arena Q6/Q11 · flashcard-7 · RECAPS s6 |
| 3 | **Inglizcha nom scored matnda** (§20, ETALON 21) | arena Q5 «DAU ning o'zbekcha nomi qaysi?» → «"Botga bugun odam keldimi?" — bu savolga qaysi raqam javob beradi?»; Q11 «Retention…» → «Qaytganlar foizi…»; flashcard 5/7 — savol o'zbekcha, inglizcha nom javob oxirida «(inglizcha: …)». Variant-matn va indekslar **tegilmadi** | GATE S 2-savolga metodist tavsiyasi: s5 dagi bir marta «Inglizcha nomi:» qatori yetadi |
| 4 | **Sheva / jonsiz odam-fe'l / kitobiy** | «Botim zo'r ishlayapti» → «Botim juda yaxshi ishlayapti» (+ mukofot, RECAPS s3) · «bot o'zi ko'radi» → «bot yozuvidan … tekshirasiz» · «Bot bugun tirikmi?» → «Botga bugun odam keldimi?» · «jami yolg'iz hukm chiqarmaydi / gapirmaydi» → «faqat jamiga qarab xulosa qilinmaydi» / «Faqat jamiga qaramang» · «ko'z bilan hal qilib» → «chamalab» · «bron qilinadigan» → «oldindan joy band qilinadigan» · «sinov ketgan» → «o'tkazgan» · «yana keldi» → «bugun ham keldi» (T2) | ETALON 7-C · §28 · lug'at «yana» |
| 5 | **Belgi-formula / sanoq / mentor-diyeta** | tugma «÷ × 100» → «Foizni hisoblash»; RECAPS s8 va flashcard-5 «÷ … × 100» → so'z bilan · s1 «ulardan uchtasini /stat aytadi» → «ikkitasini» (/stat faqat bugun kelganlar + qaytganlar/foiz beradi — ETALON 22) · s4 mentor natijani oldindan aytardi («yaxshi ham, yomon ham») → «Ikki dushanba, bitta bot — avval «/stat» tugmasini bosing.» · s14 mentor «Avval…, keyin…» qadam-takrori olindi (ETALON 32) · RO'YXAT chiplari ≤4 so'z (s10, s12) · zaxira-yo'l «uch son bir xil chiqsa» (noaniq) → «Terminalda 3 · 2 · 40 chiqsa» | ETALON 43 · 22 · 32 · 98b |

**Testlar (javob-sizishi 159/17 · uzunlik-telli):** T1 30/33/28 · T2 16/20/19 · T3 39/44/39 · T4 33/**43**/43 (tell 1.30, to'g'ri javob yolg'iz eng uzun emas). Savol↔to'g'ri variant o'rtasida umumiy o'zak yo'q (T2: «bugun ham keldi» ↔ «Qaytganlar foizi»). T4-B «odam qaytmayapti» → «odamlar **deyarli** qaytmayapti» — 5 foiz uchun yagona himoyalanadigan gap.

**K9 Booking — bankka sodiq ✅:** faqat bank faktlari (deyarli har o'zgarish · tugma rangi/matn/bo'limlar tartibi · odamlarning bir qismida · 1000 dan ortiq bir vaqtda · 2017, kompaniyaning ochiq chiqishlari). Bashorat-2 «2017-yilda Booking'da … ketgan» → «Kompaniya 2017-yilda bir vaqtda nechta shunday sinov o'tkazishini aytgan?» — manba (ochiq chiqish) savolning o'zida. Ko'prik-gap «Javobni bitta raqam beradi» s4 xulosasiga («bitta raqam yolg'iz yetmaydi») zid o'qilardi → «eng muhim raqamni o'zgarishdan OLDIN tanlab qo'yasiz».

**«Metrika» omonimi (GATE S 3-savol) — tavsiya:** bosh so'z «metrika» QOLADI (v9 va keyingi darslar atamasi). Qavs «(o'lchov raqami)» olib tashlandi — ta'rifning o'zi «raqam» deydi, qavs uni takrorlardi. O'rniga s2 xulosa-kartasi ostida bitta etimologik qator: **«So'z «metr» dan olingan — o'lchash degani.»** — o'smir «metr»ni biladi, ma'no o'lchashga bog'lanadi, «guvohnoma» so'zi ekranga chiqmaydi (TMI emas). Omonim faqat MentorNote'da: «Kimdir «metrika — guvohnoma-ku» desa: so'z bir xil, ma'no boshqa — bu yerda o'lchash.»

**PmLesson21 ko'prik-gapi (16-bo'lim A-2):** yo'nalish to'g'ri — PmLesson21 (m5-12) bu darsdan (m5-11) KEYIN keladi, shuning uchun u orqaga ishora qiladi. Matn: «Oldingi darsda buni qaytganlar ulushi deb foizda hisoblagan edingiz — bugun esa … sonini sanaysiz.» → **«O'tgan darsda buni foizda hisoblagansiz — qaytganlar foizi. Bugun esa botingizning o'z kunlarida qaytganlarni bittalab sanaysiz.»** («ulush» kaskadi · «-gan edingiz» og'ir zamon → «-gansiz» · «sonini» referentsiz edi).

**Uy-vazifa:** «keyingi PM darsigacha — o'sha darsda shu sonlar bilan ishlaysiz» → «keyingi darsgacha — sonlaringizni darsga olib keling» (ekranda «PM» jargoni yo'q; PmLesson21 bu sonlarni o'qishi 16-B ixtiyoriy — tasdiqlanmagan va'da berilmaydi).

**Quruvchiga / GATE S ga qoldirilgan (matn emas):** (a) s7 hisob-qatori `8 ÷ 40 × 100 = 20` — arifmetika-vizual, konsept-formula emas; ETALON 43 bilan ziddiyat yo'q deb hisobladim, lekin 👦 o'qishda tekshirilsin. (b) s1 «to'rt raqam» (1 bosh + 3 yordamchi) ↔ s5 «uch raqam» (kelganlar · qaytganlar · bosh) — ikki xil sanoq; s10 tuzilmasi buni yopadi, lekin s1 mentor-gapini «bosh raqam va unga yordam beradigan uchtasi» deb qoldirdim — 👦 1-o'qishda chalkashsa, s1 ni «to'rt raqam: bittasi eng muhimi» deb soddalashtirish. (c) Korpusga taklif-juftliklar (bu yurishda faqat senariy tahrirlandi — korpusga yozish bosh-agentda): ❌ «Botingiz odamning ishini qilib berganini sanaydi» → ✅ «Bot nechta odamga keragini berganini sanaydi»; ❌ «Metrika (o'lchov raqami)» → ✅ «So'z «metr» dan olingan — o'lchash degani».

---
## ✅ GATE S — TASDIQLANDI (2026-09-28 10:33, foydalanuvchi; hamma javob tavsiya bo'yicha)
Javoblar: `PM_PIPELINE_STATE.md` F-0928-06 yozuvi. Quruvchi shu senariyni metodist korrekturasi bilan birga qo'llaydi.
