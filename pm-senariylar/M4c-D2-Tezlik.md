# M4c-D2 — Hammasini birdan chiqaraymi — yoki har hafta bo'lak? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/4c-Modull/PmLesson17.jsx` (hozirgi `pm-delivery-speed-17-v16` — eski avlod dars
> BUTUNLAY almashadi; yangi `lessonId: pm-m4c2-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 Batch 3 (`m4c-02` qatori) — o'zgartirilmagan.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 4c — «CI/CD + Deploy» (oy 8.5–9.5) |
| **Dars** | M4c-D2 (modulning 2-darsi, birinchi PM darsi) · `key: m4c-02` |
| **Mavzu** | Yetkazish tezligi ustunlik beradi: hammasini bir marta katta qilib chiqarish — yoki har hafta kichik bo'lak; kim tez-tez chiqarsa, o'sha oldin biladi |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z rejasini **yozadi** (uch haftalik bo'lak); artefakt = matn (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | **K13 · TELEGRAM (tezlik)** — bankda ✅ «aynan»: katta yangilanish deyarli har oy · reaksiya/stiker/kanal raqiblarda yillar keyin · tez chiqarish — brendning bir qismi · 1 mlrd oylik foydalanuvchi (2025-yil mart). Bankdan tashqari birorta raqam/fakt YO'Q; inkorlar chegaralangan (§124) |
| **ISHLATILGAN_KEYS** | K13 · 🔴 modul-ichi qoidasi (registr 4-bo'lim): M4c da birinchi keys — modul ichida takror YO'Q ✓. K13 kursda birinchi marta ishlatilmoqda |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | **M4a-D2** → yuk-tartiblash (raund-saralash) · **M4b-D2** → bug-triaj saralash (Batch 3 pasporti) · M4-D15 qaror-sabab tanlovi · M4-D12 sxema-shart tekshiruvi. **M4c-D2 = «haftaga-sig'dirish darvozasi»** — hech biriga o'xshamaydi (26/59-qonun; farq-dalili 1-bo'lim va s9 izohida) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim ro'yxati to'liq: story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «GAPSIZ KO'RSATUV» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «UCH QAVAT KESIMI» · «YUK-SINOVI» · Hotspot · Timeline · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · **hafta-chizig'i (M3-D5 — to'ladigan hafta-chizig'i)** · ⚖️ tarozi (M2-D7) · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · pitch-oilasi ro'yxati · Batch 3 qo'shnilari: «SIFAT-TAROZI» · bug-triaj (m4b-02) · «O'LCHAGICH-PANELI» · signal-saralash (m4c-06) |
| **Misol-ip (91/108 + 95 + 96c)** | 🏁 **Ikki sinfdosh-loyiha poygasi** — ikkala sinfdosh bir xil g'oyani oldi: **maktab uchun yo'qolgan narsalar sayti** (quloqchin, kalit, suv idishi). Bittasi «Bir marta katta» yo'lida, ikkinchisi «Har hafta kichik» yo'lida. 95-qonun: o'smir maktabda narsasini o'zi yo'qotadi, o'zi izlaydi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · maydoncha · musiqa ilovasi · maktab jurnali · maktab kutubxonasi · AvtoStoyanka · konsert-chipta · skuter-ijara (m4b-02) · o'quvchining Netlify sayti (m4c-06) — **yo'qolgan narsalar sayti band emas** ✓. Grep-dalili: `yo'qotilgan` / `yo'qolgan narsa` src/ da bosh-misol sifatida **0** (faqat yon-gaplarda «yo'qolgan mijoz», «rasm yo'qolganda»); `poyga` faqat `JestUnitTestLesson` s3 da (qo'lda↔Jestbot **bosish-poygasi**, sekundomer bilan — bir ekranlik tezlik-o'yini) — bu dars esa **6 haftalik chiqarish-poygasi**, boshqa obyekt, boshqa o'lchov |
| **Kirish-artefakt** | 🔴 **YO'Q.** Modul-chegara qoidasi (registr 6-bo'lim): 4c — yangi modul. «topilmadi/saqlanmagan» tarmog'i YOZILMAYDI (korpus §69) |
| **Chiqish-artefakt** | 🔴 `pm-m4c2-reliz` = `{ bolaklar: [ {hafta, ish} × 3 ], savedAt }` — `hafta` = 1 · 2 · 3 (butun son), `ish` = o'quvchi yozgan bitta qator. ⚠️ Kalit-nomi JS uchun **`bolaklar`** (apostrofsiz); ekranda o'quvchi «bo'laklar» so'zini ko'radi. **m4c-06 (`PmLesson18`) shu kalitni AYNAN shu shaklda o'qiydi** — bosh-agent muhri (brif 2-bo'lim); shakl ikkala senariyda bir xil ✓ |
| **Yordamchi kalitlar** | `pm-m4c2-hook-choice` (faqat YOZILADI — 100c) · `pm-m4c2-poyga` (s4 holati: nechta hafta o'tdi) · `pm-m4c2-darvoza` (s9 raundlari) · `pm-m4c2-code` · `pm-m4c2-reflection` · `pm-m4c2-hw-target` · `ccProgress` |
| **Koding** | 🖥 **KOMPILYATOR** — R1 navbati (registr: m4b-02 VS Code → **m4c-02 kompilyator** → m4c-06 VS Code). Sof JS: `previewUrl` YO'Q, shartlar xulq-atvorda tekshiriladi, boshlang'ich kod bironta shartni yashil qilmaydi (18-ov). Senariy navbatni o'zgartirmaydi |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — Batch 2 senariylari bilan bir xil yakun-tuzilma |

**Atama-glosslar (62/39-qonun + korpus §20/§104/§126 — avval hodisa, keyin nom):**

- 🔴 **Bosh atama — «reliz».** Ekranga faqat **s2 da** chiqadi, hodisadan KEYIN (§104/§126: s0 va s1 da **0**). Ochilishi o'smirning o'z bilimidan (korpus §73): o'yin yoki albom relizi — o'sha kuni hamma qo'lida. Kanonik ta'rif dars bo'ylab AYNAN bir xil: **«Tayyor bo'lakni odamlar ishlatadigan joyga chiqarish — reliz deyiladi.»** (§109 — fe'l-iborasi, yasama ot emas). Shu ta'rif s2 · flashcard-1 · RECAPS · s15 da so'zma-so'z. Inglizcha juftlik («release») faqat s2 qavsida bir marta;
- 🔴 **§112 ko'prigi (m4c-01 bilan bir gap):** o'quvchi oldingi darsda «lenta kodni **uchiradi**» deb o'rgangan. s2 da bitta ko'prik-gap: **«O'tgan darsda lenta kodni o'zi uchirardi — u kod endi odamlar qo'liga tegadi.»** Nomni esa ikki karta ochilgach xulosa-karta aytadi (§104). Shundan keyin dars faqat «chiqarish/reliz» deydi; «uchirish», «deploy», «lenta» boshqa ekranlarda **0** — m4c-01 ning o'z so'zlari, bu darsda takrorlanmaydi;
- 🔴 **Darsning qoidasi — fe'l bilan (§103):** **«Kim tez-tez chiqarsa, o'sha oldin biladi.»** — «biladi» = odamlarga nima kerakligini bilib oladi. Bu gap s4 xulosasi · T2 reveal · RECAPS · flashcard-3 · s15 · App.jsx sub taklifida bir xil;
- 🔴 **«bo'lak»** — saytning bir chiqarishda odamlarga tegadigan qismi. Bir tushuncha — bir nom: ❌ «fich», «feature», «funksiya» (kodda funksiya boshqa narsa!), «imkoniyat» (M2-D7 so'zi), «qism» (M4a-D2 so'zi) — bu darsda faqat **«bo'lak»**;
- 🔴 **Fe'l-intizomi (korpus §80):** bo'lak **chiqadi / chiqariladi** · odam **ishlatadi / bosadi** · sayt egasi **biladi / bilib oladi** · ish haftaga **sig'adi / sig'maydi**. ❌ «yetkaziladi» (dars nomida bor, o'quvchi matnida ishlatilmaydi — Uzum yetkazish yo'li bilan chalkashadi), ❌ «relizga chiqadi», ❌ «launch»;
- 🔴 **Qaror-yorliqlari hamma yuzada bir xil** (korpus §80): **«Bir marta katta»** / **«Har hafta kichik»** — s0 tanlovlari · s4 ikki yo'lak · testlar · flashcard · s15 bitta juftlikda gapiradi;
- 🔴 **Haftalik bo'lakning ikki sharti** (s9 darvozasining ikki chirog'i) — hamma yuzada bir xil so'zlar: **⏱ «haftaga sig'adi»** · **👤 «odam ishlata oladi»**. Ikkinchisining ochilishi: «bossa — nimadir bo'ladi»;
- 🔴 **Sinfdoshlar personaj EMAS** (personaj-taqiq): ism yo'q, ikki sayt faqat yo'l-yorlig'i bilan ataladi («Bir marta katta» sayti · «Har hafta kichik» sayti). Vazifani Mentor beradi;
- 🔴 **Hisob va vaqt so'zlari:** «hafta» — 6 ta (poyga) va 3 ta (reja); «ish kuni» — kartadagi «≈ 2 kun» bahosi. Raqam manbasi ekranda aytiladi (korpus §95): «sinfdoshning o'z bahosi» / «maktabdagi o'quvchilar»;
- ❌ **«pipeline», «workflow», «yaml», «GitHub Actions», «job», «runner»** — m4c-03 niki (29-qonun: kelajak-dars atamasi oqmaydi). ❌ **«sprint», «iteratsiya», «agile», «scrum», «MVP», «gipoteza», «delivery», «CI/CD»** — o'quvchi matnida **0**: birinchi to'rttasi bu kursda o'rgatilmaydi, «MVP» M2-D7 atamasi (glosssiz kirmaydi, keragi ham yo'q), «gipoteza» o'rniga «odamlarga nima kerakligini bilib olish», «CI/CD» m4c-01 niki;
- ❌ **«raqib» so'zi ballanadigan matnda faqat gloss bilan** — oddiy shakli «boshqa yozishuv ilovalari» (bank so'zi — raqiblarda); «messenjer» ham ballanadigan matnga kirmaydi. «Brend» ishlatilmaydi — «Telegramning o'ziga xos belgisi bo'lib qoldi» (bank so'zi — brendning bir qismi);
- ❌ «afisha», «reklama qilish» (chiqarish o'rniga) · lint-taqiqidagi buyruq-chorlov («… qiling» shaklidagi bashorat-buyrug'i, 79-qonun) · «daftar» · brifdagi ichki UI-nomlari va tana/kasb-metaforalari — o'quvchi matnida 0.

🔴 **§40 darvozasi (o'quvchida YO'Q narsa uniki qilib aytilmaydi):** yo'qolgan narsalar sayti — sinfdoshlarniki: dars bo'ylab **«sayt» / «"Har hafta kichik" sayti»**, hech qachon «saytingiz». O'quvchiniki — uning **o'z loyihasi** (m4c-01 amaliyotida «O'z loyihangizga kichik CI lenta qo'shing» deb ishlatilgan — o'quvchida bor) va u YOZGAN uch bo'lak («bo'laklaringiz»).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «RELIZ-TASMASI»** — senariy-ichi nomi (ekranda «tasma»/«lenta» so'zi YO'Q — «lenta» m4c-01 da CI/CD ning nomi; ekranda ko'rinadigan nom: **«🏁 Poyga: 6 hafta»**). 23-qonun: registr 5-bo'limdagi birorta imzo klonlanmaydi.

Ekran — ikki yo'lakli poyga-yo'li. **Chapda** yo'lak-nomlari, **o'ngda** 6 hafta-katagi ketma-ket:

| Yo'lak | Nima qiladi |
|---|---|
| 🧱 **«Bir marta katta»** | 6 hafta yasaydi, 6-haftada hammasini birdan chiqaradi |
| 🧩 **«Har hafta kichik»** | 1-haftadayoq kichkina bo'lak chiqaradi, har hafta bittadan qo'shadi |

Pastda bitta boshqaruv: **«▶ Keyingi hafta»** (72-qonun: yorliqli tugma, diqqat-signali bilan; birinchi bosishdan keyin signal tinadi). O'quvchi 6 marta bosadi. Har bosishda ikkala yo'lakda o'sha haftaning katagi ochiladi — ichida **bo'lak** (nima chiqdi), **odam soni** (nechta o'quvchi ishlatdi) va **«nimani bilib oldi»** qatori (odamlar nima qilgani).

| Hafta | 🧱 Bir marta katta | 🧩 Har hafta kichik — bo'lak · odam · nimani bilib oldi |
|---|---|---|
| 1 | 🔒 yasalmoqda · 0 kishi | 📋 E'lonlar ro'yxati («yo'qoldi/topildi» yozuvi) · 9 kishi · hamma yozuvga sinfini qo'shyapti («qora quloqchin, 7-B») |
| 2 | 🔒 yasalmoqda · 0 kishi | 🏫 «Sinf» maydoni · 21 kishi · rasm hech kim qo'ymayapti — rangini yozyapti |
| 3 | 🔒 yasalmoqda · 0 kishi | 🔍 Rang bo'yicha qidiruv · 34 kishi · topilgan narsa ro'yxatda qolib ketyapti |
| 4 | 🔒 yasalmoqda · 0 kishi | ✅ E'lonni yopish tugmasi — e'lon ro'yxatdan ketadi · 52 kishi · eski e'lonlar to'planib qoldi |
| 5 | 🔒 yasalmoqda · 0 kishi | 🕰 30 kunlik e'lon o'zi yashirinadi · 70 kishi · yangi e'lonni ko'rmay qolishyapti |
| 6 | 🚀 Chiqdi: e'lonlar ro'yxati · rasm yuklash · maktab xaritasi · ikki tomonlama chat · e'lon reytingi — 5 bo'lak · 38 kishi · xarita va reytingni hech kim ochmadi; hamma yozuvga sinfini qo'lda yozyapti | 🔔 Kunlik «yangi e'lonlar» xabari · 95 kishi · 6 bo'lak, hammasi ishlatilmoqda |

6-hafta ochilgach ekranga **xulosa-karta** chiqadi (69-qonun — maqtov emas, xulosa):
> **✅ Buni o'zingiz ko'rdingiz: 6 haftada «Har hafta kichik» sayti odamlardan 6 marta bilib oldi, «Bir marta katta» sayti — 1 marta.** Kim tez-tez chiqarsa, o'sha oldin biladi.

🔴 **Rang-qonuni (palitra-pasporti):** 🔒 «yasalmoqda» katagi — **neytral kulrang** (xato emas, holat); chiqqan bo'lak — `success` yashil; «hech kim ochmadi» qatori — **indigo** izoh (qizil EMAS: bu nosozlik emas, kech bilingan fakt). Odam soni — JetBrains Mono.

🔴 **Nima uchun aynan shu:** «tez chiqarish yaxshi» degan gapni o'qib ishonib bo'lmaydi — o'quvchi haftalarni **o'zi o'tkazib**, bir yo'lakda katak-katak «nimani bilib oldi» qatorlari yig'ilishini, ikkinchisida 5 hafta qulf turishini ko'radi. 6-haftada ikkala saytda deyarli bir xil bo'lak bor — farq **bilishda** ekani ko'z bilan ko'rinadi. Bu darsning butun g'oyasi («kim tez-tez chiqarsa, o'sha oldin biladi») qo'lda o'ynaladigan shakli va K13 keysining darsdagi kichik ko'rinishi.

🔴 **Mexanika-farqi (26/59-qonun):** M4a-D2 da o'quvchi **odam sonini oshirib sinish nuqtasini topardi** (miqdor); M4b-D2 da bug-narxini o'lchaydi (Batch 3 pasporti); bu yerda **vaqtni o'zi yurgizib ikki yo'lni yonma-yon solishtiradi** — boshqa o'lchov (hafta), boshqa harakat (o'tkazish), boshqa maqsad (yo'l tanlash). JestUnitTest s3 poygasidan farqi: u yerda bosishlar+sekundomer (soniyalar), bu yerda haftalar va bo'laklar.

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 40–45 soniya harakatsizlikdan keyin bitta ipucha: «Keyingi haftani o'tkazing — kataklar ochiladi» (javobni aytmaydi, korpus §77).

**TEKSHIRUV — «HAFTAGA-SIG'DIRISH DARVOZASI» (s9, batafsil 5-blokda):** ekranda bitta darvoza-eshik («Bu hafta chiqadi») va uning ikki chirog'i — **⏱ haftaga sig'adi** · **👤 odam ishlata oladi**. Har raundda (3 raund = 3 hafta) uchta nomzod-karta beriladi (bitta katta ishning bo'laklari, har birida sinfdosh bahosi «≈ N kun»); o'quvchi bittasini darvozaga bosadi — chiroqlar yonadi, o'tgan bo'lak darvozadan chiqib **hafta-katagiga** joylashadi (s4 dagi 🏁 poyga-katagi shakli qaytadi — bir dars, bir vizual til). 🔴 **M3-D5 hafta-chizig'idan farqi:** u yerda kartalar qo'yilgani sari **chiziq to'lardi** (yig'indi-vizual); bu yerda to'ladigan chiziq YO'Q — darvozaning ikki chirog'i **hukm-o'lchovi**, va ikkinchi chiroq (👤) M3-D5 da umuman yo'q edi. Tekshiruvchi stolidan farqi: 3 tayyor kartaga ✓/✕ qo'yilmaydi — 3 nomzoddan **bittasi o'tkaziladi**, va bu 3 raundda **reja yig'iladi**. Timeline'dan farqi: tartib emas, sig'ish. Bo'laklash-doska/tarozi (M2-D7) dan farqi: karta uch savatga tushmaydi — bitta darvozadan o'tadi yoki qaytadi.

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi Batch 2 senariylari bilan bir xil:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Ikki sinfdosh, bir g'oya: siz qaysi yo'l bilan yurgan bo'lardingiz?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch hafta-bo'lak qatori o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — reliz nima: o'yin relizi ↔ sayt relizi | 3 | — | ikki karta solishtiruvi (tap-ochilma) + m4c-01 ko'prigi |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **RELIZ-TASMASI** (🏁 Poyga: 6 hafta) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K13 Telegram (4 slayd + 2 bashorat + hisoblagich) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 haftalik bo'lak** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **HAFTAGA-SIG'DIRISH DARVOZASI** (3 raund) | 5 | — | 🔴 yangi mexanika |
| s10 | KODING — ishni haftalarga bo'ladigan kod | 6 | — | 26/82/87-qonun · kompilyator |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ustaxona», «tasma», «yo'lak», «darvoza-mexanika» — senariy-ichi so'zlar**, o'quvchi ekranida faqat ko'rinadigan narsaning o'z nomi: «🏁 Poyga: 6 hafta», «Bu hafta chiqadi» eshigi, «bo'laklaringiz» (korpus §84 + 98a).

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 4c — CI/CD + Deploy
DARS: M4c-D2 (2-dars)
DARS_MAVZUSI: Yetkazish tezligi ustunlik beradi — bir marta katta yoki har hafta kichik
ISHLATILGAN_KEYS: K13
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Ikki sinfdoshingiz bir xil g'oyani tanladi: maktabda yo'qolgan narsalar sayti —
quloqchin, kalit. Biri 6 hafta yasab, hammasini birdan chiqarmoqchi. Ikkinchisi
1-haftadayoq kichkina bo'lak chiqarib, har hafta yangisini qo'shmoqchi. Siz qaysi
yo'ldan yurardingiz?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: ikkala yo'l ham 6-haftada saytga olib
keladi; farq saytda emas, yo'lda bilib olinganda.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — «to'liq sayt chiqsin» degani ham, «erta ishlatishsin»
degani ham hayotiy. Hech qaysini «xato» demang: poyga s4 da o'zi ko'rsatadi.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 🧱 Bir marta katta — sayt to'liq bo'lib chiqsin | 46 |
| 🧩 Har hafta kichik — odamlar erta ishlatsin | 43 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkala yo'l ham 6-haftada saytga olib keladi. Farq saytda emas, **yo'lda**: kim nimani bilib olganida. Poygani o'zingiz o'tkazasiz.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsa (quloqchin, kalit — o'smir maktabda yo'qotadigan narsalar) + harakat-fe'llari («yasab», «chiqarmoqchi», «qo'shmoqchi») + o'quvchining o'z holatidan o'sadi («siz qaysi yo'ldan yurardingiz» — u o'zi ham loyiha yasayapti).
> 🔴 **104/§119:** to'g'ri javob YO'Q — payoff hech bir tanlovni yolg'onga chiqarmaydi («ikkala sayt ham 6-haftada tayyor» — «Bir marta katta»ni tanlagan bola o'z tanlovining rad etilganini ko'rmaydi); ikkalasiga bir xil yangilik qo'shiladi («farq yo'lda»); ❌ «To'g'ri o'yladingiz…» yozilmaydi.
> 🔴 **100-qonun:** tanlov `pm-m4c2-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62/§126:** «reliz» atamasi bu ekranda YO'Q — u s2 da ochiladi. «Chiqarmoqchi» — kundalik fe'l, atama emas.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ekran-o'lchovi:** savol + payoff = **389 grapheme** proza (chegara 400) ✓ — chegaraga yaqin, quruvchi bir belgi ham qo'shmaydi.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida o'z loyihangiz uchun uch haftalik rejani yozib olasiz: har haftada
odamlar qo'liga tegadigan bitta bo'lak.
HARAKAT: O'quvchi kuzatadi: bo'sh ro'yxatga uchta hafta-qatori o'z-o'zidan yozilib
chiqadi, har birining yoniga ✅ qo'yiladi.
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

**Demo-uch qator (o'z-o'zidan yozilib chiqadi) — strelkali juftlik, ustun-sarlavhasiz (korpus §67d):**

| Ekranda ko'rinadigan qator |
|---|
| 1-hafta → E'lonni tahrirlash tugmasi — bossa, yozuvni to'g'rilaydi |
| 2-hafta → E'lonni ulashish havolasi — bossa, havola nusxalanadi |
| 3-hafta → «Mening e'lonlarim» ro'yxati — bossa, o'z e'lonlarini ko'radi |

> 🔴 **§126 / 39-qonun:** s1 da «reliz» so'zi **0** — maqsad-ekran natijani sodda so'z bilan NOMLAYDI («uch haftalik reja», «bo'lak»), atama keyingi ekranda tug'iladi.
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo-uchlik s4 dagi «Har hafta kichik» bo'laklariga ham (ro'yxat · sinf · qidiruv · e'lonni yopish · yashirinish · xabar), s9 dagi katta ishning bo'laklariga ham («Topdim!» · xabar · «Menda ✓» · rasm · chat) KIRMAYDI — uchalasi saytning boshqa bo'laklari.
> 🔴 **§123/§128 (demo o'z qoidasidan o'tadi):** uchala demo-qator s8 ning O'Z qabul-shartidan o'tadi — bitta harakat + natija («bossa, …»), «va» bilan ulanmagan, katta-ish so'zi yo'q; ikkala chiroqdan ham o'tadi. ❌ eski «E'lonni o'chirish tugmasi» s4 ning 4-haftasi («e'lonni yopish») bilan to'qnashardi; ❌ eski g'oya «3-hafta → butun saytni qayta yasash» — o'z qoidasiga zid edi.
> 🔴 **40-qonun / korpus §40:** «yozib olasiz» (artefakt) · «loyihangiz» — o'quvchida bor (m4c-01 amaliyoti); «saytingiz» YO'Q.
> 🔴 **42-qonun:** «o'z-o'zidan yozilib chiqadi»; **54(b/c):** `ta-sub` ikkinchi qator YO'Q, demo ostidagi caption YO'Q. Demo-qatorlar poyga saytidan — dars olami bitta.
> 🔴 **Ekran-o'lchovi:** proza **119 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (reliz-tasmasi) + 3 × Quiz
EKRAN: Tayyor bo'lakni odamlar ishlatadigan joyga chiqarish — reliz deyiladi. Reliz katta
bo'lishi mumkin — yoki kichkina; yilda bir marta — yoki har hafta.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) haftani o'zi o'tkazib ikki yo'lakni
solishtiradi va xulosa-kartani o'qiydi; (s6) keys-slaydlarini bashorat bilan ochadi.
JAVOB: s4 — «Har hafta kichik» sayti 6 hafta ichida 6 marta bilib oldi, «Bir marta katta»
sayti 1 marta; qoida: kim tez-tez chiqarsa, o'sha oldin biladi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar 6 haftani tez bosib o'tadi. 3-haftadan keyin to'xtating va
so'rang: «Bir marta katta» sayti hozir nimani biladi? Javob — hech narsani. Shu lahza dars.
```

**s2 — TEORIYA-1: o'yin relizi ↔ sayt relizi** (korpus §73: kundalik bilim bilan bog'lash)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Sinfdoshingiz yozgan bo'lak qachon "chiqdi" hisoblanadi?»**

Mentor (≤2 gap, 32b):
> O'tgan darsda lenta kodni o'zi uchirardi — u kod endi odamlar qo'liga tegadi. Ikki kartani bosing: o'yinda va saytda bu kun qanday o'tadi?

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 🎮 **O'yin relizi** | Kun keladi — o'yin chiqadi, hamma o'sha kundan o'ynay boshlaydi. Katta, yilda bir marta |
| 🌐 **Sayt relizi** | Yangi bo'lak chiqadi — odamlar shu kundan ishlata boshlaydi. Katta ham, kichkina ham bo'ladi; yilda bir marta ham, har hafta ham |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif):
> **Tayyor bo'lakni odamlar ishlatadigan joyga chiqarish — reliz deyiladi** (inglizchasi — release). Reliz katta bo'lishi mumkin — yoki kichkina; yilda bir marta — yoki har hafta.

> 🔴 **39/§104 qolipi:** avval hodisa (ikki karta), keyin «… reliz deyiladi» — to'liq ta'rif-gap, kesik qurilma emas. Sarlavhada yangi atama YO'Q ✓ («chiqdi» — kundalik so'z).
> 🔴 **Karta-nomidagi «O'yin relizi» — o'smirning O'Z so'zi** (korpus §73: o'yin/albom relizi unga tanish), ya'ni hodisaning o'zi; saytga ko'chirilgan ma'no faqat xulosada ta'riflanadi. Bola so'zni bilmay o'qimaydi (§126 buzilmaydi) — GATE S 3-savoli.
> 🔴 **§112:** mentor-gapi m4c-01 ning «lenta uchiradi» nomi bilan yangi nomni BIR gapda bog'laydi; shundan keyin «uchirish/lenta» boshqa ekranda 0.
> 🔴 **§109:** ta'rif fe'l-iborasi bilan («chiqarish»), yasama ot emas; **§24:** xulosa predmetni nomlaydi («Tayyor bo'lakni…»).
> 🔴 **§106 (test ko'chirma bo'lmasin):** xulosa «qachon reliz EMAS» degan misolni yozmaydi — T1 shu qoidani qo'llatadi (kompyuterda ishlagan tugma).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **367 grapheme** proza (karta matnlari — mashq-materiali) ✓.

**s4 — YADRO: RELIZ-TASMASI** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Haftani o'tkazing — ikki saytni solishtiring.»**

Mentor (≤2 gap, 92a):
> Chapda ikki sinfdoshning ikki yo'li, o'ngda 6 hafta. «Keyingi hafta»ni bosib boring — har haftada kim nimani chiqargani va odamlar nima qilgani ochiladi.

> 🔴 **98b:** mentor natijani AYTMAYDI («qaysi biri yutadi» yo'q) — kataklar harakatdan KEYIN ochiladi.
> 🔴 **106d/71:** har haftada javob darhol: ikkala yo'lakda katak + fakt-qatorlar; «nimani bilib oldi» qatori odam harakati bilan yoziladi («hamma yozuvga sinfini qo'shyapti») — abstrakt «feedback keldi» emas.
> 🔴 **§95 raqam-manbasi:** odam sonlari yonida bir marta «maktabdagi o'quvchilar» yorlig'i (katak sarlavhasida); sonlar demo-qiymat, sinfdoshlarning sayti — bank-fakti emas.
> 🔴 **§106:** umumiy qoida («kim tez-tez chiqarsa, o'sha oldin biladi») **faqat xulosa-kartada**, 6-haftadan keyin chiqadi; kataklarda faqat sayt-darajasidagi faktlar. T2 esa qoidani boshqa vaziyatga qo'llatadi.
> 🔴 **Nosozlik emas — kechikish:** «Bir marta katta» yo'lagida qizil YO'Q; «hech kim ochmadi» — indigo izoh (palitra: `err` faqat haqiqiy xato).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa-karta = **370 grapheme** ✓ (kataklar — mashq-materiali).

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Loyihangizga uch haftalik bo'lak yozing.
(mentor, 1 gap) Loyihangizdagi bitta katta ishni oling va uni uch haftaga bo'ling —
har hafta odam ishlata oladigan bitta bo'lak.
HARAKAT: Uchta bo'lakni BITTALAB yozadi. Har kartada hafta raqami turadi (1 · 2 · 3),
o'quvchi ish-qatorini yozadi: odam nimani bosadi va nima bo'ladi. Saqlaganda qator
o'ngdagi ro'yxatga ko'chadi.
JAVOB: Uchala bo'lak yozilgan · har biri bitta ish (ikkitasi «va» bilan ulanmagan) ·
har birida odam qiladigan harakat bor (bosadi/yozadi/ko'radi/oladi/yuboradi) · «hammasi»,
«butun», «to'liq» kabi katta-ish so'zlari yo'q · uch bo'lak bir-birini takrorlamaydi.
RO'YXAT: Uch hafta — uch bo'lak · Har bo'lakda odam nima qilishi yozilgan ·
Har bo'lak bir haftaga sig'adi
YULDUZCHA: Uch bo'lagingizdan qaysi biri odamlar haqida eng ko'p narsa aytadi —
o'shani belgilang.
YORDAM: Har bo'lakka bitta savol bering: hafta oxirida odam buni bosganda nima bo'ladi?
Javob chiqmasa — bo'lak hali ish emas, uni kichraytiring.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Birinchi bo'lakka «butun saytni yasash» yozadiganlar chiqadi — eng foydali
xato. Javob-qatori tutadi; siz so'rang: hafta oxirida odam nimani bosadi?
```

🔴 **Kirish-artefakt YO'Q — zaxira-tarmoq ham YO'Q** (korpus §69, modul-chegara): ekran «oldingi darsdan kelgan ish» haqida gapirmaydi. Boshlanish to'g'ridan-to'g'ri: «Loyihangizga uch haftalik bo'lak yozing.» — «topilmadi / saqlanmagan / bo'sh» so'zlari **0**.

🔴 **Yozish-kartasi (80b) — bitta karta, ikki qadam ichida:**

| Qadam | Ko'rinishi / ipucha (placeholder — korpus §32: qisqa savol, tayyor javob YO'Q) |
|---|---|
| Hafta (o'zi turadi) | `1-hafta` → `2-hafta` → `3-hafta` — o'quvchi yozmaydi, indikator aytadi |
| Bo'lak (matn) | `Odam nimani bosadi va nima bo'ladi?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12; 106d ikki tomonlama):**
- ✅ ish-qatori bitta harakat + natija → «✅ Bo'lak aniq — hafta oxirida odam buni ishlata oladi.»
- 🤔 katta-ish so'zi (*hammasi · butun · to'liq · barcha · to'liq sayt*) → «Bu bir haftaga sig'maydi ko'rinadi — shu ishning odam birinchi bosadigan bo'lagini yozing.»
- 🤔 ikki ish «va» bilan → «Bu ikkita ish — bittasini shu haftaga, ikkinchisini keyingisiga.»
- 🤔 ≤2 so'z → «Bir-ikki so'z yetmaydi: odam nimani bosadi va nima bo'ladi?»
- 🤔 oldingi karta bilan bir xil → «Bu bo'lak yuqorida allaqachon yozilgan — keyingi haftaga boshqa bo'lak.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **Katta-ish so'zlar lug'ati** (qoida-asosidagi tekshiruv — 106d(c), dars o'z so'zlaridan): *hammasi · butun · to'liq · barcha · qayta yasash*. «Va» tekshiruvi: bitta qatorda ikki fe'l-ot juftligi («… qo'shish va … qilish»). Bloklamaydi — yo'naltiradi. Bu darsning ikkinchi yarmi: kichik yozish o'zi ham ko'nikma.

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **154 grapheme** ✓ (javob-qatorlar harakatdan keyin, bittadan chiqadi).

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (haftaga-sig'dirish darvozasi — 3 raund)
EKRAN: (topshiriq) Har haftaga sig'adigan bo'lakni tanlang.
(yo'riqnoma) «Har hafta kichik» saytining navbatdagi katta ishi: topgan odam e'lon
egasiga xabar bera olsin. Uch nomzoddan bittasini darvozaga bosing — ikki chiroq javob
beradi.
HARAKAT: Uch raund (1-, 2-, 3-hafta): har raundda uch nomzod-kartadan bittasini
darvozaga bosadi. Darvozaning ikki chirog'i yonadi: ⏱ haftaga sig'adi · 👤 odam ishlata
oladi. Ikkalasi yashil — bo'lak o'tadi va hafta-katagiga tushadi; keyingi raund ochiladi.
JAVOB: 1-hafta) «Topdim!» tugmasi + e'lon egasiga xabar ketadi + egasi «Menda ✓» deb javob beradi
(≈5 kun) → 2-hafta) Xabarga rasm qo'shish (≈2 kun) → 3-hafta) Ikki tomonlama chat
(≈4 kun). Har raundda aynan bitta nomzod ikkala chiroqni yashil qiladi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Ikki savol bering: bu bo'lak necha kun — 5 dan
oshmaydimi? Odam uni bossa — nimadir bo'ladimi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda ishlating: har o'quvchi sherigining uch bo'lagini o'qib, har biriga
«buni odam hafta oxirida ishlata oladimi?» deb so'raydi. Javob topilmasa — bo'lak qayta
yoziladi.
MENTORGA: Eng ko'p adashiladigan joy — «faqat tugma» nomzodi: haftaga sig'adi, lekin
bosilsa hech narsa bo'lmaydi. Ikkinchi chiroq shuning uchun bor.
```

**Katta ish (yangi sahna: 6 haftadan KEYINGI ish — s4 to'plamidan BOSHQA):** «Topgan odam e'lon egasiga xabar bera olsin». Sinfdosh uni bo'laklarga bo'lib, har biriga o'z bahosini qo'ygan (korpus §95: raqam manbasi — «sinfdoshning o'z bahosi» yorlig'i ekranda). Hafta = **5 ish kuni** (darvoza ustida yozilgan).

| Raund | Nomzodlar (tartib aralash — to'g'risi doim bir joyda emas) | ⏱ | 👤 | O'tadimi |
|---|---|---|---|---|
| 1-hafta | 🔘 «Topdim!» tugmasi — bosilsa hali hech narsa bo'lmaydi (≈1 kun) | ✅ | ❌ | qaytadi |
| | 🔘➡️✉️ «Topdim!» tugmasi + e'lon egasiga xabar ketadi + egasi «Menda ✓» deb javob beradi (≈5 kun) | ✅ | ✅ | **o'tadi** |
| | ✉️🖼💬 Xabar + rasm + xabarlar tarixi + ikki tomonlama chat (≈11 kun) | ❌ | ✅ | qaytadi |
| 2-hafta | 🖼 Xabarga rasm qo'shish (≈2 kun) | ✅ | ✅ | **o'tadi** |
| | 🖼💬 Rasm + chat + tarix birdan (≈9 kun) | ❌ | ✅ | qaytadi |
| | 💬 Chat oynasi — lekin xabar yuborilmaydi (≈2 kun) | ✅ | ❌ | qaytadi |
| 3-hafta | 💬 Ikki tomonlama chat (≈4 kun) | ✅ | ✅ | **o'tadi** |
| | 💬🗂 Chat + xabarlar tarixi birga (≈7 kun) | ❌ | ✅ | qaytadi |
| | 🔘 «Chat» tugmasi — bosilsa hali oyna ochilmaydi (≈1 kun) | ✅ | ❌ | qaytadi |

Chiroq-javoblari (106d — javob darhol, sabab bilan; korpus §98 — qoida beriladi, to'g'ri karta AYTILMAYDI):
- ⏱ qizil → «🤔 ≈11 kun — haftaga sig'madi. Kichikroq bo'lakni tanlang.»
- 👤 qizil → «🤔 Bosilsa hech narsa bo'lmaydi — odam buni ishlata olmaydi. Ish qiladigan bo'lakni tanlang.»
- ikkalasi yashil → «✅ ≈5 kun — sig'di, va odam bosgan zahoti xabar ketadi. 1-hafta tayyor.»

O'tish-gap (22-qonun — yangi to'plam ochiq aytiladi, mentor 1 gap):
> Uch bo'lagingiz tayyor — endi shu ikki savolni sinfdoshning katta ishida qo'llaymiz.

Yakun-qatori (69-qonun — xulosa):
> ✅ **Katta ishni uch haftaga bo'lib chiqdingiz — birinchi haftadayoq odamlar «Topdim!»ni bosa boshlaydi, sayt egasi esa uch marta bilib oladi.**

> 🔴 **26/59-qonun — farq-dalili (1-bo'lim oxirida to'liq):** M3-D5 hafta-chizig'i (to'ladigan chiziq) YO'Q — ikki chiroqli darvoza; tekshiruvchi stoli (3 kartaga ✓/✕) emas — 3 nomzoddan bittasi o'tkaziladi; Timeline (tartib) emas — sig'ish; tarozi/bo'laklash-doska (uch savat) emas — bitta eshik; M4a raund-saralash (zaiflik-tartibi) emas — har raund mustaqil sig'ish-tanlovi va natija REJA bo'lib yig'iladi.
> 🔴 **§120 (material har shart uchun bitta javobni himoyalaydi):** har kartada kun-bahosi yozilgan (⏱ hukmi hisobdan chiqadi), «bosilsa hali hech narsa bo'lmaydi» / «xabar yuborilmaydi» so'zlari kartaning o'zida (👤 hukmi matndan chiqadi). Har raundda AYNAN bitta nomzod ✅✅.
> 🔴 **§116 (YORDAM hamma to'g'ri javobga olib boradi):** ikki savol ikkala chiroqni qamraydi — bir o'lchovli ipucha («kichikmi?») «faqat tugma» tuzog'iga olib borardi.
> 🔴 **Sahna yangi, olam o'sha (91-qonun):** s4 dagi 6 haftalik poyga → s9 da 7-haftadan boshlanadigan katta ish; nomzodlar s4 bo'laklarini takrorlamaydi (§102).
> 🔴 **§105/§121 (kalit so'z bir ma'noda):** «bo'lak» — faqat sayt bo'lagi; «kun» — faqat sinfdosh bahosi; tugma **«Topdim!»** — uni TOPGAN odam bosadi, xabar esa e'lon EGASIGA ketadi (eski «Meniki!» topshiriq-gapiga zid edi: «topgan odam e'lon egasiga xabar bera olsin»); egasining javobi **«Menda ✓»** — «Oldim» ataylab olinmadi («ol-» ildizi qoidadagi «oldin biladi» yonida turardi), «Qabul qildim» ham emas (M3-D10 «qabul» band). Hamma yuzada (kodda `topdim-tugmasi` · `menda-belgisi`) bitta nom — GATE S 6-savoli.
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda) · **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **204 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (kompilyator — R1 navbati · sof JS)
EKRAN: (sarlavha) Ishni haftalarga bo'ladigan kod yozamiz.
(mentor, 2 gap) Hozirgina uch bo'lakni darvozadan qo'lda o'tkazdingiz — endi shu ishni kod
bajaradi. Bo'laklar va kunlar o'sha sinfdoshniki.
HARAKAT: haftalar(bolaklar) funksiyasini to'ldiradi: bo'laklarni tartib bilan haftalarga
joylaydi, har haftada kunlar yig'indisi 5 dan oshmaydi. Uch natija bilan ko'radi.
JAVOB: haftalar(bolaklar) → [['topdim-tugmasi','egasiga-xabar','menda-belgisi'],
['rasm-qoshish'], ['chat']] · length → 3 · har hafta kunlari ≤ 5.
RO'YXAT: Funksiya haftalar ro'yxatini (massiv ichida massivlar) qaytaradi · Har haftadagi
kunlar 5 dan oshmaydi · Uch hafta chiqdi va tartib saqlangan
YULDUZCHA: Hafta sig'imini 7 kunga oshiring (SIGIM = 7) va nechta hafta chiqishini
ko'ring — 2 hafta.
YORDAM: Ikki narsani ushlab turing: hozirgi hafta ro'yxati va undagi kunlar yig'indisi.
Bo'lak sig'masa — haftani natijaga qo'shib, yangisini boshlang.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod — s9 dagi ishning to'g'ridan-to'g'ri tarjimasi, shuni ochiq ayting:
o'quvchi darvozada qo'lda tanlagan bo'laklar endi massiv elementi.
```

> 🔴 **87-qonun (o'tilgan texnik material):** massiv, obyekt, `for`/`for…of`, `if`, `+=`, `push`, funksiya, `console.log` — hammasi M2 da o'tilgan; M3/M4 dan hech narsa talab qilinmaydi. Jest (m4b) shartlari topshiriqqa KIRMAYDI — kompilyator shartlarni xulq-atvor bo'yicha o'zi tekshiradi.
> 🔴 **26-qonun / R1:** m4b-02 VS Code → **m4c-02 kompilyator** — registr navbati, senariy o'zgartirmaydi. Sof JS: `previewUrl` YO'Q — natija paneli `console.log` chiqishlarini ko'rsatadi.
> 🔴 **18-ov (starter yashil emas):** boshlang'ich `return []` uchala shartni ham qizil qoldiradi — birinchisi «massiv ichida massivlar» talab qiladi (bo'sh massiv o'tmaydi), ikkinchisi «har hafta ≤5 kun VA hamma bo'lak joylangan» deb tekshiriladi.
> 🔴 **Korpus §19/§48:** sarlavha «…digan **kod** yozamiz» oilasidan, natijani aytadi.
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq («qo'lda yozganda o'rganiladi»).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **165 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch bo'lagingizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan javob bering: birinchi haftada odam nimani bosadi va nima
bo'ladi? Avval sherigingizga ayting, so'ng shu javobni bir qatorda yozing.
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
MENTORGA: Uchdan biri «nima bo'ladi» savoliga javob berolmasa — s9 darvozasini qayta
oching va «faqat tugma» nomzodini birga ko'ring.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — platforma etaloni **«O'zingizni sinab ko'ring.»** (bu darsda «sin-» ildizi boshqa ma'noda ishlatilmaydi — §121 to'qnashuvi yo'q).
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, so'ng shu javobni bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **106f(b):** yozilgach mukofot-blogi (2 qator): «Endi siz katta ishni haftalik bo'lakka bo'la olasiz.» + «🎯 Bugungi qoida: kim tez-tez chiqarsa, o'sha oldin biladi.»

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda rejangizni davom ettirasiz: bo'laklaringizdan har biriga bitta savol berasiz —
odam buni bosganda nima bo'ladi? Javobini bir gapda yozib qo'yasiz. Qancha vaqtingiz
bor — o'zingiz tanlaysiz.
HARAKAT: To'rtinchi haftaga bo'lak yozadi; to'rt bo'lakning har biriga «odam bosganda
nima bo'ladi» savolining javobini yozadi.
JAVOB: —
RO'YXAT: To'rtinchi bo'lak yozilgan · Har bo'lakda odam bosgandan keyin nima bo'lishi
yozilgan · Har bo'lak bir haftaga sig'adi
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Uch bo'lagingizdan birinchisini oling: odam uni bosganda nima bo'ladi?
Javobini bir gapda yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Muddat — keyingi PM darsigacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi; sarlavha-savol «📝 Uyda nima qilasiz?» (§115).
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «to'rtinchi», «uch bo'lak» sanoqlari faqat kartalarda.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — bo'lak yozish s8 da, «bosganda nima bo'ladi» savoli s8 ipuchasi va s9 ikkinchi chirog'ida.
> 🔴 **§125/§111:** uy-vazifa kuzatiladigan hodisani aytadi («odam buni bosganda nima bo'ladi») — mavhum «savol tug'ilsa» emas; savol va javob ikki qadamga ajratildi («… degan bir gap» qurilmasi olib tashlandi).

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
MAVZU: Reliz nima (tayyor bo'lakni odamlar ishlatadigan joyga chiqarish); kod faqat o'z
kompyuterda ishlasa reliz emas; kim tez-tez chiqarsa, o'sha oldin biladi; poygada
«Har hafta kichik» sayti 6 marta, «Bir marta katta» 1 marta bildi; haftalik bo'lakning
ikki sharti (haftaga sig'adi · odam ishlata oladi); «faqat tugma» nima uchun o'tmaydi;
Telegram katta yangilanishni deyarli har oy chiqaradi; reaksiya/stiker/kanal boshqa
yozishuv ilovalarida yillar keyin; 1 milliard oylik foydalanuvchi (2025-yil mart); nimani qachon
chiqarishni kim hal qiladi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §107 (ha/yo'q teng) · §110 (mutlaq so'z ≤1/4, kulgili-bo'sh yo'q) · §118 (cheklov-so'zsiz) · §127 (atama ≥2 variantda) · §129 (kalit xulosadan so'zma-so'z emas). Variant uzunliklari teng (8.4); to'g'ri javob eng uzun emas.

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🌐 Sinfdoshingiz yangi tugma yozdi — hozircha faqat o'z kompyuterida. Bu reliz bo'ldimi?
- A. Ha — kod tayyor bo'ldi, demak reliz *(35)*
- **B.** Yo'q — odamlar hali ishlata olmaydi ✅ *(35)*
- C. Yo'q — bu o'zgarish juda kichkina *(33)*

**Reveal:** To'g'ri — reliz kod yozilgan kun emas, odamlar ishlata boshlagan kun.

> 🔴 **§106/§129:** s2 xulosasi «odamlar ishlatadigan joyga chiqarish» deydi; savol shu qoidani **vaziyatga qo'llatadi** (o'z kompyuterida ishlagan tugma) — B kalit-so'zi xulosaning so'zma-so'z ko'chirmasi emas («ishlata olmaydi» — odam harakati).
> 🔴 **§107/§108:** 1 «Ha» / 2 «Yo'q», to'g'risi «Yo'q»larning biri — hukmni bilgan bola SABABNI tanlashi kerak; C ning sababini s2 xulosasi ochiq rad etadi («reliz kichkina ham bo'ladi») — ya'ni darsni O'QIGAN bola yutadi (§110). ❌ eski C «sinfdosh hali test yozmagan» olib tashlandi: m4b da o'rgangan test — hayotda ROST amaliyot, bola uni rad etishga majbur bo'lardi (§108).
> 🔴 **§127:** «reliz» atamasi A va savolda — to'g'ri javob yagona «reliz»li variant EMAS ✓. Uzunlik: 35 · 35 · 33 (tell 1.06, to'g'ri javob eng uzun emas ✓). Savol 11 so'z (105b).

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 🧩 Loyihangizga uchta bo'lak yasamoqchisiz. Odamlarga nima kerakligini eng erta qachon bilasiz?
- **A.** Birinchi bo'lak chiqqan haftada ✅ *(31)*
- B. Uchala bo'lak tayyor bo'lgan kuni *(33)*
- C. Hamma sinfdosh ro'yxatdan o'tganda *(34)*

**Reveal:** To'g'ri — birinchi bo'lak chiqqan zahoti odamlar nima qilishi ko'rinadi; kim tez-tez chiqarsa, o'sha oldin biladi.

> 🔴 **§106:** umumiy qoida s4 xulosasida bor, lekin savol boshqa vaziyat (o'quvchining uch bo'lagi) va boshqa savol-shakli («eng erta qachon») — kalit ko'chirma emas.
> 🔴 **§118:** savolda o'lchov-so'zi («eng erta») — distraktorlarda cheklov-so'zi kerak emas. B — «Bir marta katta» yo'lining ishonarli mantig'i (darsning o'zi rad etadi → o'qiganni mukofotlaydi, §110); C — «avval ko'p odam kerak» tasavvuri, s4 da esa 9 kishi bilan ham bilib olindi (ochiq rad).
> 🔴 **§99:** uchalasi «qachon» savoliga vaqt-nuqtasi bilan javob beradi. Uzunlik: 31 · 33 · 34 (tell 1.10; to'g'ri javob eng qisqa — narvon emas, ikki distraktor bir-biriga yaqin) ✓.

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** ⚡ Reaksiya, stiker, kanal — Telegramdan keyin boshqa yozishuv ilovalarida qachon paydo bo'ldi?
- A. Bir necha hafta ichida *(22)*
- **B.** Bir necha yil o'tgach ✅ *(21)*
- C. O'sha kuniyoq, bir vaqtda *(25)*

**Reveal:** To'g'ri — Telegram avval chiqardi, boshqalar yillar keyin yetib keldi. Tez chiqarish uni poygada oldinga chiqardi.

> 🔴 **10-qonun/§101:** savol bankdagi FAKTni so'raydi (bank: bu bo'laklar raqiblarda yillar keyin paydo bo'ladi) — bashorat-1 (chastota) va bashorat-2 (odam soni) savoli TAKRORLANMAYDI (§106: bashoratning o'z savoli testda qaytmaydi). Xulosa («poygada oldinga») reveal'da (§124: ball-javob sof bank-fakti).
> 🔴 **§102:** A — «nusxa ko'chirish tez» degan kundalik tasavvur, bank rad etadi; C — «bir vaqtda» — hech qayerda aytilmagan, ishonarli. Uzunlik: 22 · 21 · 25 (tell 1.19; to'g'ri javob eng uzun emas) ✓.
> 🔴 **§99:** uchalasi «qachon» savoliga vaqt-oralig'i bilan javob beradi.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 📅 Loyihangizda uch haftalik katta ish bor. Uni qanday chiqarasiz?
- A. Uch hafta yasab, hammasini birdan *(33)*
- **B.** Har hafta odam ishlatadigan bo'lakni ✅ *(36)*
- C. Eng katta bo'lagini birinchi haftada *(36)*

**Reveal:** To'g'ri — har hafta odam ishlata oladigan bo'lak chiqadi; siz uch marta bilib olasiz, bir marta emas.

> 🔴 A — s0 dagi «Bir marta katta» yo'li: bola uni ko'rgan, s4 rad etgan (o'qiganni mukofotlaydi); C — «eng qiyinini birinchi» degan ishonarli tasavvur, s9 ⏱ chirog'i rad etadi (≈11 kun sig'maydi). Uzunlik: 33 · 36 · 36 (tell 1.09 — to'g'ri javob yolg'iz eng uzun emas) ✓. B endi darsning o'z fe'li bilan («odam ishlatadigan»), «ishlaydigan bo'lak» chalkashligi olib tashlandi (§80).
> 🔴 **§110:** mutlaq so'z faqat A da («hammasini») ✓. **§99:** uchalasi «qanday chiqarasiz» savoliga chiqarish-usuli bilan javob beradi.

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan (✅ savol oldida turmaydi).

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira «1-hafta · 2-hafta · 3-hafta» — yozilgani yashil ✓, joriysi indigo-signalda, kelgusi kulrang-punktir.

**Yozish-kartasi (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida: hafta-yorlig'i (o'zi turadi, tahrirlanmaydi) → bo'lak matn-maydoni + jonli javob-qatori. Bitta maydon — 92a: bir ekran, bir ish (yozish).

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI — faqat indikator chirog'i yonadi; uchtasi ham yozilgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda). Saqlangan qator ko'rinishi: `1-hafta → «Yozilish» tugmasi — bossa, ism ro'yxatga tushadi` (strelkali juftlik, s1 demo bilan bir shaklda — korpus §67d).

**Ipucha (92c/85 · korpus §32):** `«Odam nimani bosadi va nima bo'ladi?»` — qisqa savol; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q. Namuna faqat s1 demosida ko'rilgan.

**106d javob (ikki tomonlama):** ✅ «Bo'lak aniq — hafta oxirida odam buni ishlata oladi.» · 🤔 «Bu bir haftaga sig'maydi ko'rinadi — shu ishning odam birinchi bosadigan bo'lagini yozing.»

**Katta-ish so'zlar ro'yxati** (106d(c), dars o'z lug'atidan): *hammasi · butun · to'liq · barcha · qayta yasash*. O'quvchi qatorga shulardan birini yozsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

**Artefakt-yozuv:** `pm-m4c2-reliz = { bolaklar: [ {hafta: 1, ish}, {hafta: 2, ish}, {hafta: 3, ish} ], savedAt }` — `hafta` butun son, kartaning indeksidan; `ish` — matn. m4c-06 shu shaklni o'qiydi (bosh-agent muhri).

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K13 · 91b/33/42/43/56 + keys-ekran qoidasi)

**Freym (91b):** eyebrow — **«⚡ Haqiqiy voqea»**, K-kodi ekranga chiqmaydi.

🔴 **Keys-burchagi:** K13 kursda birinchi marta — burchak «tez chiqarish poygada oldinga chiqaradi». Slaydlar faqat bank faktlari: deyarli har oy katta yangilanish · reaksiya/stiker/kanal boshqa yozishuv ilovalarida yillar keyin · tez chiqarish — Telegramning o'ziga xos belgisi · 1 mlrd oylik foydalanuvchi (2025-yil mart). **Bankda YO'Q narsa aytilmaydi:** Telegramning «odamlardan bilib olgani», «har hafta chiqargani», «raqiblarni yengib chiqqani», yillar/sanalar (bank faqat 2025-yil martni beradi). Ya'ni darsning «biladi» qoidasi Telegramga taqilmaydi — u faqat «tez chiqaradi va oldinda» (§101/§124).

**Uzluksiz hisoblagich (keys-ekran qoidasi):** slaydlar tepasida ikki qatorlik panel: (1) **oy-yo'li** — 12 oylik kataklar («bir yil»); (2) **«Oyiga foydalanadigan odam»** hisoblagichi, yonida yil-yorlig'i (raqam yilsiz ko'rinmaydi — 10-qonun). `prefers-reduced-motion` da statik yakuniy holat.

🔴 **Hisoblagich-uzluksizligi va bashorat-spoyleri (aniq tartib — quruvchiga majburiy):**

| Qadam | Oy-yo'li | Odam-hisoblagichi |
|---|---|---|
| 1-slayd va bashorat-1 | 12 katak **bo'sh** (javob ekranda ko'rinmasin — §102/§123) | **«—»** |
| 2-slayd | kataklar ketma-ket yonadi, har birida 📦 belgi — yorlig'i «deyarli har oy — bitta katta yangilanish» | «—» |
| 3-slayd | yonib turadi | «—» |
| **bashorat-2** | yonib turadi | **«—» da to'xtab turadi** (javob ekranda yo'q — §123) |
| 4-slayd | yonib turadi | bashorat javobidan keyin «—» dan **1 mlrd (2025-yil mart)** gacha jonli o'sadi |

> 🔴 **§101 (0 dan boshlanmaydi):** hisoblagich «0 → 1 mlrd» deb yugurmaydi — Telegramda 2025 da 0 foydalanuvchi bo'lmagan; u «—» dan yakuniy songa **bitta yugurish** bilan keladi (M4a-D2 «—» qolipi). Oy-yo'li esa bank aytgan «deyarli har oy»ning vizuali — 12 katakning hammasi yonadi, yorlig'i «deyarli» so'zini saqlaydi.

**4 slayd (hikoya tilida — 42-qonun · korpus §42):**

1. **Telefoningizdagi Telegram.** Vaqti-vaqti bilan «Yangilanish» keladi: yangi tugmalar, yangi bo'laklar. Bu qanchalik tez-tez bo'lishini o'zingiz belgilab ko'ring.
2. *(bashorat-1 dan keyin)* **Deyarli har oy.** Telegram yillar davomida katta yangilanishlarni deyarli har oy chiqarib keladi — to'xtamasdan.
3. **Reaksiya, stiker, kanal.** Bular Telegramda avval chiqqan. Boshqa yozishuv ilovalarida xuddi shunday bo'laklar yillar keyin paydo bo'ldi.
4. *(bashorat-2 dan keyin)* **1 milliard odam (2025-yil mart).** Oyiga shuncha odam Telegramdan foydalanadi. Tez chiqarish — Telegramning o'ziga xos belgisi bo'lib qoldi.

**Bashorat-1 (2-slayddan oldin · 1-o'lchov: CHASTOTA — qanchalik tez-tez):**
- «Yiliga bir marta» *(16)*
- «Deyarli har oy» ✅ *(14)*
- «Uch yilda bir» *(12)*

**Bashorat-2 (4-slayddan oldin · 2-o'lchov: MIQDOR — oyiga nechta odam, 2025-yil mart):**
- «100 million» *(11)*
- «1 milliard» ✅ *(10)*
- «3 milliard» *(10)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! …» — quyruqsiz; adashsa «Adashdingiz — asl javob: …». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — darsga qaytadi):**
> Telegram tez chiqaradi — va poygada oldinda. Loyihangizda ham shunday: har hafta chiqqan bo'lak odamlarga nima kerakligini aytadi. Nimani qachon chiqarishni kod emas, mahsulotni o'ylaydigan odam hal qiladi — endi shu qaror sizniki.

> 🔴 **10-qonun (keys-sadoqati — tekshirildi):** bankda bor — katta yangilanish deyarli har oy, yillar davomida ✓ · reaksiya/stiker/kanal raqiblarda yillar keyin ✓ · tez chiqarish — brendning bir qismi (→ «o'ziga xos belgisi») ✓ · 1 mlrd oylik faol foydalanuvchi (2025-yil mart) ✓. Pul-raqami YO'Q. Har raqam yili bilan ✓. Bankdan tashqari birorta raqam/fakt YO'Q. «Yillar davomida» — bank so'zi, sana emas.
> 🔴 **§124 (chegaralangan inkor):** ❌ «boshqa yozishuv ilovalarida bunday bo'laklar umuman yo'q edi» — bank buni aytmagan; ✅ «yillar keyin paydo bo'ldi» — bank aynan shuni aytadi.
> 🔴 **§122:** 1 mlrd — oylik foydalanuvchi; u «tez chiqarish natijasi» deb ta'rifga zo'rlanmaydi — 4-slayd ikki faktni yonma-yon qo'yadi, «shuning uchun» demaydi.
> 🔴 **§123 (bashorat-chipida atama yo'q):** bashorat variantlarida «reliz», «brend», «raqib» YO'Q — sodda so'zlar (oy · yil · million · milliard).
> 🔴 **Bashorat halolligi (17/43/64):** har bashorat bitta o'lchovning uch darajasi, zinapoya tartibida; hech biri boshqa slaydda rost bo'lib chiqmaydi; «≥2 bashorat ikki o'lchovda» sharti bajarildi (chastota + miqdor). Bashorat-2 da «3 milliard» — bola o'zi rad eta oladigan darajada katta emas (5 mlrd bo'lsa kulgili-bo'sh bo'lardi, §110), lekin ishonarli.
> 🔴 **Ko'prik:** «mahsulotni o'ylaydigan odam hal qiladi» — M4-D2/M4a-D2 bilan bir xil ibora (kurs bo'ylab bir til); slot-sanog'i yo'q (63); «loyihangiz» — §40 ✓.

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · kompilyator, sof JS)

**Darvoza-mashq (82e):** bitta savol-tanlov: «Haftaga sig'ish qanday hisoblanadi?» → «Bo'laklar kunlari qo'shilib 5 dan oshmaydi» ✅ *(42)* / «Har bo'lak alohida 5 kundan kichikroq bo'ladi» *(45)* / «Haftadagi bo'laklar soni 5 tadan oshmaydi» *(41)* — uchalasi bir turda (hisob-qoidasi, §129), tell 45 ÷ 41 = 1.10 ✓, to'g'ri javob eng uzun emas ✓. Bu darvoza kod yozishdan oldin qoidani muhrlaydi (yig'indi, alohida emas).

**Boshlang'ich kod:**

```js
// Sinfdoshning katta ishi — bo'laklar va har biriga baho (s9 dagi darvoza)
const bolaklar = [
  { nom: 'topdim-tugmasi', kun: 1 },
  { nom: 'egasiga-xabar',  kun: 2 },
  { nom: 'menda-belgisi',  kun: 2 },
  { nom: 'rasm-qoshish',   kun: 2 },
  { nom: 'chat',           kun: 4 },
];
const SIGIM = 5; // bir hafta — 5 ish kuni

function haftalar(bolaklar) {
  // Bo'laklarni tartib bilan haftalarga joylang.
  // Har haftada kunlar yig'indisi SIGIM dan oshmasin.
  return [];   // ← bu joyni siz to'ldirasiz
}

console.log(haftalar(bolaklar));
// [['topdim-tugmasi','egasiga-xabar','menda-belgisi'], ['rasm-qoshish'], ['chat']]
console.log(haftalar(bolaklar).length);   // 3
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda — xulq-atvor bo'yicha tekshiriladi, matn-grep emas):**
1. Funksiya haftalar ro'yxatini (massiv ichida massivlar) qaytaradi — `Array.isArray(natija) && natija.length > 0 && natija.every(Array.isArray)`
2. Har haftadagi kunlar 5 dan oshmaydi — har ichki massiv uchun kunlar yig'indisi ≤ 5 **va** barcha 5 bo'lak joylangan
3. Uch hafta chiqdi va tartib saqlangan — `natija.length === 3` va tekislangan tartib `bolaklar` bilan bir xil

**YORDAM (yechimni aytmaydi — korpus §77):** Ikki narsani ushlab turing: hozirgi hafta ro'yxati va undagi kunlar yig'indisi. Bo'lak sig'masa — haftani natijaga qo'shib, yangisini boshlang.

**YULDUZCHA:** `SIGIM = 7` qiling va `haftalar(bolaklar).length` endi nima qaytarishini ko'ring — 2 hafta: katta hafta — kam reliz.

> 🔴 **Sanoq-mosligi (22-qonun):** bo'laklar (5 ta) va bahosi (1·2·2·2·4 kun) s9 kartalari bilan AYNAN bir xil; natija (3 hafta: 5 kun · 2 kun · 4 kun) s9 rejasi bilan bir xil — o'quvchi qo'lda o'tkazgan bo'laklarni kodda qayta uchratadi (korpus §95).
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`bolaklar` · `qoshish` · `SIGIM`): kodda `bolaklar`, prozada «bo'laklar» — artefakt kaliti bilan bir shakl (`pm-m4c2-reliz.bolaklar`).
> 🔴 **87-qonun:** `for…of` + `if` + `+=` + `push` — M2 materiali; `reduce` bilan yozgan o'quvchiga ham ruxsat, JAVOB sharti xulq-atvorda.
> 🔴 **Pedagogik ulanish (87c):** mentor ochiq aytadi — darvozada qo'lda tanlangan bo'laklar endi massiv elementi; YULDUZCHA «katta hafta — kam reliz» ni kodda ko'rsatadi.
> 🔴 **18-ov:** boshlang'ich `return []` — 1-shart `length > 0` talab qilgani uchun qizil; 2-shart «hamma bo'lak joylangan» talab qilgani uchun qizil; 3-shart qizil. Starter yashil emas ✓.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch hafta-qatori CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo-uchlik s4/s9 to'plamlariga KIRMAYDI; «reliz» so'zi 0 (§126) |
| **s12 REFLEKSIYA** | Sarlavha: «Uch bo'lagingizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». Yozilgach 106f(b) mukofot-blogi |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Tayyor bo'lakni odamlar ishlatadigan joyga chiqarish — reliz.» · «Kim tez-tez chiqarsa, o'sha oldin biladi.» · «Haftalik bo'lak haftaga sig'adi va odam uni ishlata oladi.» · «Nimani qachon chiqarishni kod emas, mahsulotni o'ylaydigan odam hal qiladi.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |

---

## 9. CODESTRIKE — 12 SAVOL (arena · to'g'ri indekslar 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.
> 🔴 **21-qonun:** savol o'zagida ham, variantlarda ham izohsiz chet so'z **0** — «reliz» (s2 da glosslangan dars atamasi), «bo'lak», «hafta», «chiqarish» so'zlari bilan; «raqib», «brend», «feature», «deploy» arenaga KIRMAYDI.
> 🔴 **Kalit-taqsimoti (naqshsiz):** 0,3,2,1 · 1,0,2,3 · 0,2,1,3 — har indeks 3 marta, ketma-ket takror yo'q.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | Reliz nima? | s2 |
| 2 | Kod faqat o'z kompyuteringizda ishlasa — bu relizmi? | s2 + s3 |
| 3 | Kim odamlarga nima kerakligini oldin biladi? | s4 |
| 4 | «Har hafta kichik» sayti 6 haftada necha marta bilib oldi? | s4 |
| 5 | «Bir marta katta» sayti 6-haftada nimani kech bildi? | s4 |
| 6 | Haftalik bo'lak qaysi ikki chiroqdan o'tadi? | s9 |
| 7 | «Bosilsa hali hech narsa bo'lmaydi» bo'lagiga nima yetishmaydi? | s9 |
| 8 | ≈11 kunlik bo'lakka darvoza nima deydi? | s9 |
| 9 | Telegram katta yangilanishni qanchalik tez-tez chiqaradi? | s6 |
| 10 | Reaksiya, stiker, kanal boshqa yozishuv ilovalarida qachon paydo bo'ldi? | s6 |
| 11 | 2025-yil martida Telegramdan oyiga nechta odam foydalanadi? | s6 |
| 12 | Nimani qachon chiqarishni kim hal qiladi? | s6 + s15 |

> 🔴 **Korpus §107:** ha/yo'q savolda (2-savol) 4 variantda «ha»/«yo'q» nisbati 2/2 — yolg'iz «yo'q» to'g'ri javob bo'lib qolmaydi; ikkinchi «yo'q»ning sababi darsda rost bo'lib chiqmaydi.
> 🔴 **Korpus §102/§106:** distraktorlar dars ekranida rost bo'lib chiqmaydi va to'g'ri javob slayddan so'zma-so'z ko'chirilmaydi — quruvchi har savolni shu ikki grep bilan tekshiradi.
> 🔴 **Takror-savol bandi:** 3-savol T2 bilan, 10-savol T3 bilan bir xil so'zlarda turmasin — arena qoidani boshqa vaziyatda so'raydi (masalan 3-savol: «Ikki sinfdosh bir vaqtda boshladi. 6-haftada kim keyingi bo'lakni aniq biladi?»).
> 🔴 **11-savol raqamni so'raydi, yilni emas** (M4-D2 saboqi: yod-sana bilim emas); yil savol matnining o'zida turadi. Distraktorlar — boshqa sonlar (yangi fakt-da'vo emas).
> 🔴 **§114:** arena-fon/dekor so'zlari shu dars lug'atidan (reliz · bo'lak · hafta · poyga · chiroq).

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Pace Setter!** | Poygani oxirigacha o'tkazdingiz | 31 | s4: 6/6 hafta ochildi |
| **Fast Shipper!** | Uch haftalik rejangizni yozdingiz | 33 | s8: 3/3 saqlandi |
| **Gate Keeper!** | Uch bo'lakni haftaga sig'dirdingiz | 34 | s9: 3/3 raund o'tdi |
| **Week Planner!** | Ishni haftalarga kod bilan bo'lib chiqdingiz | 44 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 31–44 belgi (§63 oralig'i) ✓.
> 🔴 **§100 (omonim-tekshiruvi):** «Pace», «Shipper», «Gate», «Planner» — kursning texnik lug'atida boshqa ma'no bermaydi ✓ («split» ataylab olinmadi — `split()` M2 da string-metodi; «Packer» olinmadi — bundler-oilasi).
> 🔴 **§93 (tasdiq bajarilgan ishni aytadi):** «o'tkazdingiz» (s4 da 6 haftani o'tkazdi), «yozdingiz» (s8), «sig'dirdingiz» (s9 da darvozadan o'tkazdi), «kod bilan bo'lib chiqdingiz» (s10 — ❌ «bo'ldingiz» ikki ma'noli edi).

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Reliz nima? | Tayyor bo'lakni odamlar ishlatadigan joyga chiqarish |
| 2 | Kod faqat o'z kompyuteringizda ishlasa — bu relizmi? | Yo'q — odamlar hali ishlata olmaydi |
| 3 | Kim odamlarga nima kerakligini oldin biladi? | Kim tez-tez chiqarsa, o'sha oldin biladi |
| 4 | Har hafta chiqarganda nima yutasiz? | Har hafta odamlardan bir narsa bilib olasiz |
| 5 | Haftalik bo'lakning birinchi sharti? | Haftaga sig'adi |
| 6 | Haftalik bo'lakning ikkinchi sharti? | Odam uni ishlata oladi — bossa, nimadir bo'ladi |
| 7 | Katta ish haftaga sig'masa nima qilasiz? | Odam birinchi bosadigan bo'lagini ajratasiz |
| 8 | Telegram katta yangilanishni qanchalik tez-tez chiqaradi? | Deyarli har oy |
| 9 | 2025-yil martida Telegramdan oyiga nechta odam foydalanadi? | 1 milliard |
| 10 | Nimani qachon chiqarishni kim hal qiladi? | Mahsulotni o'ylaydigan odam |

> 🔴 **Korpus §20/§52📌:** 1-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil (qavsdagi «release» faqat s2 da).
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ta'rif · reliz-emas holati · qoida · nima yutish · 2 shart · katta ish · keys-chastota · keys-raqam · kim hal qiladi).
> 🔴 **§76:** chet so'z tarjimasiz yo'q — «reliz» s2 da glosslangan dars atamasi; inglizcha «continuous delivery» ataylab olinmadi (m4c-01 «CD» bilan to'qnashardi).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Reliz — bo'lak odamlar qo'liga tekkan payt»** — (1) kanonik ta'rif · (2) kod o'z kompyuterda ishlagani — hali reliz emas · (3) sinfga savol
**s5 · «Kim tez-tez chiqarsa, o'sha oldin biladi»** — (1) «Har hafta kichik» 6 marta bildi, «Bir marta katta» — 1 marta · (2) birinchi bo'lak chiqqan haftadayoq odamlar nima qilishi ko'rinadi · (3) savol
**s7 · «Telegram deyarli har oy chiqaradi»** — (1) katta yangilanish deyarli har oy, yillar davomida · (2) reaksiya/stiker/kanal boshqa yozishuv ilovalarida yillar keyin; 1 mlrd odam oyiga (2025-yil mart) · (3) savol
**s11 · «Haftalik bo'lak: sig'adi va ishlaydi»** — (1) haftaga sig'adi (≤5 kun) · (2) odam ishlata oladi — bossa, nimadir bo'ladi · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** ❌ «K13 xulosasi» → «Telegram misolida».

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K13** — M4c modulida ishlatilmagan (modul-ichi qoidasi, registr 4-bo'lim; kursda ham birinchi marta) ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — M4a-D2 yuk-tartiblash · M4b-D2 bug-triaj · **M4c-D2 haftaga-sig'dirish darvozasi (ikki chiroq, 3 raund)** ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): yo'qolgan narsalar saytining ikki sinfdosh-poygasi — s0 dan s15 gacha; keys 91b freymi bilan kiradi va ko'prik bilan qaytadi; s8/uy-vazifa — o'quvchining o'z loyihasi (M3-D14/M4-D15 pretsedenti: demo-olam + o'z ishi) ✓
- 95 (Toshkent o'smiri): maktabda narsa yo'qotish, sinfdosh-loyihasi — o'z hayoti ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas (grep bilan tasdiqlandi — shapka) ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m4b-02 VS Code → m4c-02 kompilyator) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat M2 materiali (massiv · obyekt · `for…of` · `if` · `push`) ✓
- 29 (kelajak-atama oqmaydi): «pipeline», «workflow», «yaml», «GitHub Actions», «job» o'quvchi matnida **0** ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104/§119: hook ikki tanlovi teng (46 ↔ 43 belgi), payoff hech birini yolg'onga chiqarmaydi ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda 1 gap) ✓
- 92d: majburiy maydon faqat o'quvchida ANIQ bor ma'lumot uchun (o'z loyihasidagi ish — m4c-01 da o'z loyihasi bilan ishlagan) ✓ — GATE S 2-savolida muqobil bor
- 33: keys-ekran ≥2 bashorat, ikki o'lchovda (chastota + miqdor), hisoblagich uzluksiz («—» → 1 mlrd), faktlar bankda ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN §99–129 o'qildi):**
1. **§20/§80/§85:** «reliz» yagona nom, kanonik ta'rif 4 yuzada so'zma-so'z; «uchirish/lenta/deploy» faqat s2 ko'prik-gapida (§112), boshqa ekranda 0 ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 hukm+sabab · T2 vaqt-nuqtasi · T3 vaqt-oralig'i · T4 chiqarish-usuli) ✓
3. **§102:** distraktorlar ekranda rost bo'lib ko'rinmaydi (T2-B «Bir marta katta» mantig'i — s4 rad etadi; T4-C — s9 ⏱ rad etadi) ✓
3a. **§105/§121:** «bo'lak» faqat sayt bo'lagi · «kun» faqat baho · tugma «Topdim!» (topgan odam bosadi) ↔ javob «Menda ✓» (e'lon egasi) — «Oldim» o'rniga «Menda ✓» (GATE S 6) · «sin-» ildizi bu darsda faqat flashcard sarlavhasida · «bo'l-» ildizi: bo'lak/bo'ling (ajratish) va «nima bo'ladi» (hodisa) — nishon tavsifidagi ikki ma'noli «bo'ldingiz» «bo'lib chiqdingiz» ga o'girildi ✓
3b. **§106/§129:** T1 s2 xulosasini vaziyatga qo'llatadi · T2 qoidani o'quvchining ishiga · T3 bank-fakti (bashorat savoli emas) · T4 qaror-shakli ✓
4. **§107:** T1 da 1 Ha / 2 Yo'q, to'g'risi «Yo'q»larning biri; arena 2-savol 2/2 ✓
5. **§108:** hech bir savol rostni rad ettirmaydi ✓
6. **§109:** bosh ta'rif fe'l-iborasi bilan («chiqarish») ✓
7. **§110:** mutlaq so'z bir variantdan oshmaydi (T4-A «hammasini»); kulgili-bo'sh variant yo'q; bashorat-2 «3 milliard» ishonarli ✓
8. **§111:** «degan javob»/«degan bir gap» qurilmasi 0 ✓ — uy-vazifada savol va javob ikki qadamga ajratildi («bitta savol berasiz: … Javobini bir gapda yozib qo'yasiz») ✓
9. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi 3-haftadan keyin — kataklar shu paytda ochiq) ✓
10. **§114:** arena-fon so'zlari shu dars lug'atidan (reliz · bo'lak · hafta · poyga · chiroq) — quruvchiga brifda ✓
11. **§115:** ipucha bir gap-turida (savol); uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?») ✓
12. **§116:** s9 YORDAM ikkala chiroqni qamraydi ✓
13. **§117:** metafora-so'z ballanadigan matnda tug'ilmaydi («poyga» hookda ochiladi, keyin arena-3 da) · «Menda ✓» kesik omonim emas ✓
14. **§118:** distraktorlarda takror cheklov-so'zi yo'q; T2 savoli o'lchov-so'zli («eng erta») ✓
15. **§40:** «saytingiz» 0 — sayt sinfdoshlarniki; «loyihangiz» — o'quvchida bor ✓
16. **§97:** «ko'pchilik / sinf / ovozlar» o'quvchi matnida 0 ✓
17. **§69:** «topilmadi / saqlanmagan / bo'sh» 0 — modul-chegara ✓
18. **§119:** hook payoff «ikkala sayt ham 6-haftada tayyor» — hech bir tanlov yolg'onga chiqmaydi ✓
19. **§120:** s9 kartalarida kun-bahosi va «bosilsa hech narsa bo'lmaydi» matni — har raundda bitta ✅✅ ✓
20. **§122/§124:** 1 mlrd ta'rifga zo'rlanmaydi; inkor faqat bank aytgan narsaga («yillar keyin») ✓
21. **§123:** demo o'z qoidasidan o'tadi; bashorat-chipida atama yo'q; hisoblagich javobgacha «—» ✓
22. **§126/§127/§128:** «reliz» s1 da 0, s2 da tug'iladi · T1 da atama 2 joyda · s1 demo s8 validatoridan o'tadi (bitta harakat, ≥3 so'z, katta-ish so'zi yo'q) ✓
23. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo-qator (s1) · 2 karta (s2) · 2 yo'lak × 6 hafta (s4) · 4 slayd + 2 bashorat + 12 oy-katak (s6) · 3 bo'lak (s8/s12/uy-vazifa) · 3 raund × 3 nomzod (s9) · 5 bo'lak → 3 hafta (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
24. **Ekran-prozalari (Intl.Segmenter, metodist-raundidan keyin qayta o'lchandi):** s0 389 · s1 119 · s2 367 · s4 370 · s8 154 · s9 204 · s10 165 grapheme (chegara 400) ✓ · variant-telllari T1 1.06 · T2 1.10 · T3 1.19 · T4 1.09 · darvoza 1.10 · bashorat-1 1.23 · bashorat-2 1.10 (chegara 1.4 ✓) · nishon tavsiflari 31–44 belgi ✓
25. **§130 (checklist ma'noni so'raydi):** s8 va uy-vazifa RO'YXATining 3-bandi endi so'z-ovi emas, ma'no-sharti — «Har bo'lak bir haftaga sig'adi» (katta-ish so'zlari ro'yxati faqat ichki tekshiruvda qoladi) ✓

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**
**(a) Umumiy:** `npm run lint:til src/4c-Modull/PmLesson17.jsx` → **0 error** shart (74 qoida).

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M4c-D2 ga tegishli):
`pipeline` · `workflow` · `yaml` · `Actions` · `\bjob\b` (29-qonun) ·
`sprint` · `iteratsiya` · `agile` · `scrum` · `MVP` · `gipoteza` · `delivery` · `CI/CD` (o'quvchi matnida **0**) ·
`uchir` · `lenta` · `deploy` (faqat s2 ko'prik-gapida — boshqa joyda **0**) ·
`fich` · `feature` · `imkoniyat` · `qism` (bo'lak o'rniga — **0**) ·
`yetkaz` (o'quvchi matnida 0 — Uzum yo'li bilan chalkashadi) ·
`saytingiz` (§40) · `tasma` · `yo'lak` (senariy-ichi so'zlar, ekranda 0) ·
`Oldim` (→ «Menda ✓», §121) · `Meniki` (→ «Topdim!») · `messenjer` (→ «yozishuv ilovasi») · `qariyb` (→ «deyarli») · `raqib` (glosssiz ballanadigan matnda 0) · `brend` (0) ·
`ko'pchilik` · `ovozlar` (§97) · `ball emas` · `degandingiz` (100-qonun) ·
`topilmadi` · `saqlanmagan` (§69) · `taxmin qil…` (lint 79-qonun) ·
`0 → ` (hisoblagich 0 dan boshlanmasin — §101) · `har oy\b` yonida `deyarli` bormi (bank so'zi) ·
`hech kimda yo'q` · `umuman yo'q edi` (§124 chegaralanmagan inkor — 0).

---

## 13-A. METODIST-KORREKTURA (2026-08-17 · F-0817-04 · senariy-bosqichi)

> Quruvchidan OLDINGI til/pedagogika raundi. Kalit-indekslar (to'g'ri javob POZITSIYASI) **tegilmadi** —
> T1 B · T2 A · T3 B · T4 B o'z joyida qoldi; faqat MATN o'zgardi.

**A · Test va mashq halolligi (5 tuzatish)**
1. **T1-C** «Yo'q — sinfdosh hali test yozmagan» olib tashlandi: m4b da o'rgatilgan test — hayotda ROST amaliyot, bola to'g'ri javobga kelish uchun uni rad etishi kerak bo'lardi (§108). Yangi C — «Yo'q — bu o'zgarish juda kichkina»: s2 xulosasi («reliz kichkina ham bo'ladi») uni OCHIQ rad etadi, ya'ni darsni o'qigan bola yutadi (§110).
2. **T1-A** «kod yozib bo'lindi» → «kod tayyor bo'ldi» — «bo'l-» ildizining ikki ma'nosi bitta variantda turmasin. Uzunliklar 36·35·34 → **35·35·33**.
3. **T2 savoli** «Saytga uchta bo'lak yasamoqchisiz» → «**Loyihangizga** uchta bo'lak…»: sayt sinfdoshlarniki, o'quvchida esa o'z loyihasi bor (§40).
4. **T4-B** «Har hafta ishlaydigan bitta bo'lakni» → «Har hafta **odam ishlatadigan** bo'lakni» — dars sharti «odam ishlata oladi»; «ishlaydigan bo'lak» boshqa narsani (nosozliksiz ishlash) eslatardi (§80). A qisqartirildi: 33·36·36 (tell 1.09).
5. **s10 darvoza-mashqi:** to'g'ri javob eng uzun variant edi (52 ↔ 42/41 — shakl-telli). Endi 42 · 45 · 41, tell 1.10, to'g'ri javob eng uzun emas ✓.

**B · Keys va atama-intizomi**
6. **«qariyb» → «deyarli»** (14 o'rin: slayd · bashorat · oy-yo'li yorlig'i · flashcard · arena · RECAPS · shapka). Sabab: bitta bank-fakti ikki so'z bilan aytilardi (slayd matnida «deyarli», bashorat javobida «qariyb») — §80/§129 bir nom qoidasi; «deyarli» o'smirga tanishroq.
7. **«messenjer» → «yozishuv ilovasi»** (8 o'rin, shu jumladan T3 va arena-10 — ballanadigan matn): izohsiz chet so'z scored matnda turolmaydi (21-qonun/§21).
8. **Telegram slaydlarida «imkoniyat» → «bo'lak»** (1- va 3-slayd): senariyning O'Z taqiq-ro'yxati «imkoniyat» so'zini man qilgan edi, slaydlar esa uni ishlatardi. Endi keys ham darsning yagona nomi bilan gapiradi.
9. **Ko'prik-gap:** «Loyihangizda ham shu poyga bor» → «Loyihangizda ham **shunday**» (o'quvchida raqib-poyga yo'q — §40) · «bo'lak **sizga** nima kerakligini aytadi» → «**odamlarga** nima kerakligini aytadi» (darsning o'z qoidasi).

**C · Sahna mantig'i (s1 · s4 · s9 · s10)**
10. **s9 «Meniki!» → «Topdim!»** — topshiriq-gapi «topgan odam e'lon egasiga xabar bera olsin» deydi, «Meniki!» esa EGASINING so'zi: yo'nalish teskari edi. Endi yo'nalish bitta: topgan odam «Topdim!»ni bosadi → **e'lon egasiga** xabar ketadi → egasi «Menda ✓» deb **javob beradi**. Kod nomi (`meniki-tugmasi` → `topdim-tugmasi`) va s10 kutilgan natijasi ham yangilandi.
11. **s4 ustun-nomi «bilindi» → «nimani bilib oldi»** — yolg'iz «bilindi» yorlig'i ekranda nima ekanini aytmasdi; yangi nom darsning qoidasi («oldin biladi») bilan bir so'zda turadi.
12. **s4 ning 4-haftasi** «✅ "Topildi" belgisi» → «✅ **E'lonni yopish tugmasi**» — «Topildi»/«Topdim!» ikki ekranda bir xil ish deb o'qilardi (§117 omonim).
13. **s1 demo-qatorlari** yangilandi: «E'lonni o'chirish tugmasi» s4 ning 4-haftasi bilan to'qnashardi, qatorlar esa s8 ning o'z shartidan (harakat + natija) o'tmasdi. Yangi uchlik «tahrirlash tugmasi — bossa, yozuvni to'g'rilaydi» qolipida: namuna o'z qoidasidan o'tadi (§128) va s8 saqlangan qatori bilan bir shaklda.

**D · Ekran matni va so'z-tanlovi**
14. **s0 payoffi:** «Ikkalasini tanlaganlar bor» olib tashlandi — yakka o'qiyotgan bolada ovoz bergan «boshqalar» yo'q (§97). Yangi payoff hech bir tanlovni yolg'onga chiqarmaydi (§119) · «bir xil g'oyani **oldi**» → «**tanladi**» (kalka-ohang).
15. **s2 mentori** qayta yozildi: «Uchirilgan bo'lak odamlar qo'liga tekkan payt uchun alohida so'z bor» bir nafasda o'qilmaydigan ot-birikma edi → «O'tgan darsda lenta kodni o'zi uchirardi — u kod endi odamlar qo'liga tegadi. Ikki kartani bosing: o'yinda va saytda bu kun qanday o'tadi?» Shapkadagi §112 ko'prik-gapi ham shu matnga tenglashtirildi (ikki joyda ikki xil gap turardi), atama esa xulosa-kartada tug'iladi (§104).
16. **Uy-vazifa** §111 bo'yicha ikki qadamga bo'lindi: «"…nima bo'ladi" **degan bir gap** qo'shasiz» → «bitta savol berasiz: odam buni bosganda nima bo'ladi? **Javobini bir gapda yozib qo'yasiz**»; umumiy EKRAN matnidan son ham olib tashlandi (§96).
17. **Checklist 3-bandi (s8 + uy-vazifa)** so'z-ovidan ma'no-shartiga o'girildi: «Hech bir bo'lakda "hammasi/butun" yo'q» → «**Har bo'lak bir haftaga sig'adi**» (§130). Katta-ish so'zlari ro'yxati ichki tekshiruvda qoladi.
18. **s8 YULDUZCHAsi** uy-vazifani takrorlardi («To'rtinchi haftani yozing») va chigal edi → bitta buyruq: «Uch bo'lagingizdan qaysi biri odamlar haqida eng ko'p narsa aytadi — o'shani belgilang.»
19. **Nishon tavsiflari:** «Ishni haftalarga kod bilan **bo'ldingiz**» ikki ma'noli edi («bo'ldingiz» = tugadingizmi?) → «**bo'lib chiqdingiz**» · «Uch haftalik **bo'lakni** yozdingiz» (uchta bo'lak yozilgan edi) → «Uch haftalik **rejangizni** yozdingiz».
20. **Flashcard-3** javobi chala edi («Kim tez-tez chiqarsa») → kanonik qoida to'liq: «Kim tez-tez chiqarsa, o'sha oldin biladi» (§20 kaskadi).

**E · Tekshirildi va OQLANDI:** «reliz» s0/s1 da 0, s2 da tug'iladi (§126) ✓ · kelajak-dars atamalari (pipeline · workflow · yaml · Actions · job) o'quvchi matnida 0 ✓ · K13 faktlari bankdan tashqariga chiqmaydi, 1 mlrd ta'rifga zo'rlanmaydi (§122/§124) ✓ · hook ikki tanlovi teng (46 ↔ 43 belgi) ✓ · «sen»-murojaati 0 ✓ · s4/s9/s10 sanoqlari bir-biriga mos (5 bo'lak · 1+2+2+2+4 kun · 3 hafta) ✓.

**F · Qayta o'lchandi (Intl.Segmenter):** s0 **389** · s1 119 · s2 **367** · s4 370 · s8 154 · s9 **204** · s10 165 grapheme (chegara 400 ✓) · variant-telllari T1 1.06 · T2 1.10 · T3 1.19 · T4 1.09 · darvoza 1.10 · bashorat-1 1.23 · bashorat-2 1.10 ✓ · nishon tavsiflari 31–44 belgi ✓. `node til-lint.mjs pm-senariylar/M4c-D2-Tezlik.md` — **0 error / 3 warn** (warn'lar senariy-annotatsiyasiga tegishli: «YADRO» blok-nomi va o'z-tekshiruvdagi «Sen murojaati — 0» qatori).

---

## 14. ⏳ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq savollar)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi.

1. 🔴 **DARS SARLAVHASI VA SUB.** `App.jsx` `m4c-02`: title «Yetkazish tezligi ustunlik beradi» · sub «oyiga nechta yangilik chiqara olasiz?» (registr R3-8: «uzuq matn»). «Yetkazish» — Uzum keysi (M4a-D2, M2-D2) bilan bir so'z, o'quvchi uni «yetkazib berish» deb o'qiydi. **Taklif (29-qonun, «?»li o'quvchi-savoli):** title → **«Hammasini birdan chiqaraymi — yoki har hafta bo'lak?»** · sub → **«kim tez-tez chiqarsa, o'sha oldin biladi»**. Muqobil sub: «har hafta chiqarsam nima o'zgaradi?». Tasdiqlaysizmi?

2. 🔴 **s8 YOZISH — O'QUVCHINING O'Z LOYIHASI.** Uch haftalik bo'lak o'quvchining O'Z loyihasi uchun yoziladi (m4c-01 «O'z loyihangizga CI lenta» amaliyoti va M4 fullstack loyihasi — o'quvchida bor; m4c-06 shu rejani uning O'Z Netlify-sayti olamida o'qiydi). Poyga sayti esa s0–s7, s9, s10 da demo-olam (M3-D14 «maydoncha + o'z sayti» pretsedenti). **Muqobil:** M4a-D2 kabi yozish ham demo-olamda qolsin («Har hafta kichik» saytining keyingi 3 haftasi) — bunda §40 xavfi nol, lekin artefakt m4c-06 uchun kamroq ma'no beradi. Qaysi yo'l?

3. 🔴 **BOSH ATAMA «RELIZ».** «Reliz» o'smirga o'yin/albom relizidan tanish so'z (§73 ko'prigi bilan ochiladi), va m4c-01 «uchirish»idan §112 ko'prigi bilan ajratiladi. Muqobil «chiqarish» — o'zbekcha, lekin juda umumiy (test-variantlarda «chiqadi» so'zi boshqa ma'nolarda ham keladi). Rozimisiz — «reliz» bosh atama, «chiqarish» uning fe'li?

4. 🔴 **ARTEFAKT SHAKLI (bosh-agent muhri bilan mos).** `pm-m4c2-reliz = { bolaklar: [{hafta, ish}×3], savedAt }` — `hafta` kartadan avtomatik (1·2·3), `ish` erkin matn; saqlash-sharti: katta-ish so'zi yo'q, «va» bilan ikki ish emas, ≥3 so'z. m4c-06 bilan mos ✓. Muhrlansinmi?

5. 🟡 **s4 — BIR BOSQICHLI POYGA (M4a s4 dagi kabi 2-bosqich «qaror» QO'SHILMADI).** Sabab: qaror-mashqi s9 darvozasida to'liq yashaydi (3 raund tanlov); s4 ga yana tanlov qo'shsam ikki ekran bir xil harakatni takrorlardi (26-qonun ichida). O'rniga s4 «kashfiyot» — haftani o'tkazib «nimani bilib oldi» qatorlarining yig'ilishini ko'rish. Yetarlimi — yoki s4 oxiriga «7-haftani siz chiqaring: uch bo'lakdan bittasi» kabi mini-qaror kerakmi?

6. 🟡 **s9 TUGMA-NOMLARI (metodist raundida o'zgardi).** Eski «Meniki!» topshiriq-gapiga zid edi — topshiriq «topgan odam e'lon egasiga xabar bera olsin» deydi, «Meniki!» esa egasining so'zi. Endi: **«Topdim!»** tugmasini topgan odam bosadi → e'lon egasiga xabar ketadi → egasi **«Menda ✓»** deb javob beradi (kodda `topdim-tugmasi` · `menda-belgisi`). «Oldim» ataylab olinmadi («oldin biladi» yonida). Shu uchlik tasdiqlansinmi?

7. 🟡 **K13 RAQAM-SIYOSATI.** Bankdagi yagona raqam — 1 mlrd oylik foydalanuvchi (2025-yil mart) — bashorat-2 va 4-slaydda aytiladi (pul emas — istisno kerak emas). Oy-yo'li (12 katak) «deyarli har oy» bank so'zining vizuali — sana yo'q, faqat «bir yil» yorlig'i. Tasdiqlaysizmi?

8. 🟡 **POYGA RAQAMLARI — DEMO.** Odam sonlari (9 → 21 → 34 → 52 → 70 → 95; «Bir marta katta» 6-haftada 38) va s9 kun-baholari (1·2·2·2·4) — demo-qiymatlar, ekranda manbasi yozilgan («maktabdagi o'quvchilar» / «sinfdoshning o'z bahosi»); s10 kodi AYNAN shu kunlarni ishlatadi (22-qonun). Tasdiqlaysizmi?

9. 🟡 **UY-VAZIFA O'Z LOYIHADA** (2-savol bilan bog'liq): to'rtinchi hafta bo'lagi + har bo'lakka «bosganda nima bo'ladi» gapi. Agar 2-savolda demo-olam tanlansa, uy-vazifa ham demo-olamga o'tadi. Rozimisiz?

10. 🟢 **s9 KATTA ISHI** — «topgan odam egasiga xabar bera olsin»: 6 haftalik poygadan KEYINGI ish (s4 to'plamini takrorlamaydi); nomzod-kartalar bitta ishning bo'laklari, har raundda aynan bitta ✅✅. «Ikki tomonlama chat (≈4 kun)» 3-haftada o'tadi — 2-haftada u taklif qilinmaydi (§120: bir raundda ikki to'g'ri bo'lmasin). OQLANADIMI?

11. 🟢 **NISHON NOMLARI:** Pace Setter! · Fast Shipper! · Gate Keeper! · Week Planner! — «Splitter/Packer» ataylab olinmadi (§100 texnik omonim). Rozimisiz?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (0–129, §99–129 bilan) · MATN_ETALONI (lug'at + 7-B) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2 Batch 3/R3 pasporti) · SENARIY_BRIF_B3 bo'yicha yozildi. `pm-metodist` SENARIY-KORREKTURA bajarildi (2026-08-17 · F-0817-04 · 13-A bo'lim). Keyingi qadam: **[GATE S]** — 14-bo'lim savollari (1–11).*

## ✅ [AVTO-GATE S] YOPILDI — 2026-08-17 (foydalanuvchi avtokontrol-ruxsati asosida, bosh-agent; pretsedent-oila: Batch 2 avto-GATE S)

1. **App.jsx karta TASDIQ:** title **«Hammasini birdan chiqaraymi — yoki har hafta bo'lak?»** · sub **«kim tez-tez chiqarsa, o'sha oldin biladi»** (29-qonun; registr R3-8 supurgisi shu bilan yopildi — bosh-agent kiritdi).
2. **s8 — O'QUVCHINING O'Z LOYIHASI TASDIQ** (pretsedent: M4-D15 «o'z M4 loyihasi + demo-olam», M3-D14 «maydoncha + o'z sayti»); poyga sayti s0–s7/s9/s10 da demo-olam. Quruvchiga: yozuv-katagi placeholder'ida demo-olamdan namuna turadi (§128 — namuna o'z shartidan o'tadi), zaxira-tarmoq matni yozilmaydi (§69).
3. **«Reliz» bosh atama TASDIQ** — s2 da §73 ko'prigi bilan tug'iladi, «chiqarish» — fe'li; s0/s1 da 0.
4. **Artefakt MUHR:** `pm-m4c2-reliz = { bolaklar: [{hafta, ish}×3], savedAt }` — m4c-06 shu shaklni o'qiydi.
5. **s4 bir bosqichli TASDIQ** (26-qonun: qaror-mashqi s9 darvozasida; s4 — kashfiyot-kuzatuv).
6. **s9 «Topdim!» → egasiga xabar → «Menda ✓» uchligi TASDIQ**; s4 4-hafta «E'lonni yopish tugmasi» shu qaror bilan birga.
7. **K13 raqam-siyosati TASDIQ** (1 mlrd oylik foydalanuvchi, 2025-mart; oy-yo'li sanasiz).
8. **Demo-raqamlar TASDIQ** (manbasi ekranda; s10 kodi aynan shu kunlar — 22-qonun).
9. **Uy-vazifa o'z loyihada TASDIQ** (2-qaror bilan bir ip).
10. **s9 katta ishi OQLANDI** (§120 bir raundda bitta ✅✅).
11. **Nishon-nomlari TASDIQ** (Pace Setter! · Fast Shipper! · Gate Keeper! · Week Planner!).
12. Registr yangilanadi (bosh-agent): RELIZ-TASMASI · haftaga-sig'dirish darvozasi · olam · K13 · artefakt-zanjir.
