# M5-D2 — Botingizni birinchi kim ochadi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/5-Modull/PmLesson19.jsx` (hozirgi `pm-first-users-19-v16` chala avlod BUTUNLAY
> almashadi; yangi `lessonId: pm-m5d2-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 **BATCH 4** — yo'lakchadan chiqilmadi.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 5 — «Botlar va avtomatlashtirish» (oy 9.5–11) · modul g'oyasi: «Real odamlar bilan birinchi jonli mahsulot tajribasi. 20+ real foydalanuvchi» |
| **Dars** | M5-D2 (modulning 2-darsi, modulning birinchi PM darsi) · `key: m5-02` |
| **Mavzu** | Birinchi foydalanuvchilar — botni birinchi bo'lib ishlatadigan yigirmata odamni qayerdan topish; nega bitta zich joy katta guruhdan ko'p odam beradi |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z bot-loyihasi uchun uchta joyni **yozadi**; artefakt = matn (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | 👥 **K8 ♻️ META (Facebook)** — registr 3-bo'limi biriktirgan. Bank-temalari (o'zbekchada): *birinchi foydalanuvchilar · ishga tushirish yo'li · guruhlar · odam keladigan joylar* |
| **ISHLATILGAN_KEYS** | **K8** · M5 ichida band: — (bu modulning birinchi PM darsi). Modul-ichi qoidasi (registr 4-bo'lim 1-band) bo'yicha K8 M5 da birinchi marta ishlatilyapti |
| 🔴 **K8 FARQ-DALILI (♻️ takroriy keys)** | K8 avval **M1-D2 (`PmLesson1`)** da ishlatilgan. U yerdagi burchak: **«KIM» — auditoriya kartasidagi aniqlik** (`PmLesson1.jsx:1372–1430`: slaydlar «bitta universitet → boshqa universitetlar → butun dunyo», bashorat «bu sayt boshida **kimlar uchun** ochilgan edi?», yakun-gap «sizning auditoriya kartangizdagi "KIM" ham shunday aniq bo'lsin»). **M5-D2 burchagi — «QAYERDAN va NEGA aynan bir joydan»:** bank gapining ikkinchi yarmi olinadi — *«маленькая закрытая аудитория, где сервисом быстро начали пользоваться "все свои"»* va *«Плотность аудитории важнее размера»*. Ya'ni M1-D2 auditoriyani TA'RIFLASHNI o'rgatgan, M5-D2 esa birinchi odamlarni **qayerdan olib kelishni** o'rgatadi. **Ikki bashorat ham boshqa o'lchovda:** M1-D2 «kimlar uchun» deb so'ragan — bu yerda (a) «yopiq saytda qanday tarqaldi» (tarqalish tezligi), (b) «dunyoga qachon ochilgan» (vaqt). M1-D2 ning bashorat-savoli va yakun-gapi **so'zma-so'z ham, ma'no jihatidan ham** takrorlanmaydi |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | m4c-06 → «signal-saralash» (har signalga yo'l) · m4c-02 → «haftaga-sig'dirish darvozasi» · m4b-02 → «nosozlik-navbati» · M4a-D2 → yuk-tartiblash · M4-D15 → qaror-sabab tanlovi. **M5-D2 = «JOY-QUVURI» — har joyni uch qadamdan o'tkazib, yigirmagacha yig'ish** (pasport yo'lakchasi «kanal-funnel») — hammasidan farq qiladi (26/59-qonun; dalil 1-bo'lim va s9 izohi) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq: story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «GAPSIZ KO'RSATUV» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «UCH QAVAT KESIMI» · «YUK-SINOVI» · «RELIZ-TASMASI» · «SIFAT-TAROZI» · «O'LCHAGICH-PANELI» · Hotspot · Timeline · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · xabardan ortiqcha qatorni olib tashlash · yuk-tartiblash · sxema-shart tekshiruvi · qaror-sabab tanlovi · haftaga-sig'dirish darvozasi · nosozlik-navbati · signal-saralash · pitch-oilasi ro'yxati |
| **Misol-ip (91/108 + 95 + 96c)** | 🤖 **O'quvchining O'Z Telegram-boti** — shu modulda quradigan bot (pasport: modul-ipi). 95-qonun: bot uning o'z ishi, modul unga qurilgan ✓ · 96c(e) **to'qnashuv-grep:** `bot` misol-olam sifatida `src/` da faqat 5-modulda uchraydi — texnik `Bot*Lesson` fayllari (manba-darslar, «Botjon» lug'ati) va `PmLesson19/20/21` (hammasi shu Batch 4 da qayta quriladi). Boshqa PM darslarda `bot` **0** (grep: `PmLesson1…18`, `PmJtbd`, `PmMetrics`, `PmUserStory` — 0 topilma) ✓ · Band olamlar (lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · maydoncha · musiqa ilovasi · maktab jurnali · kutubxona · AvtoStoyanka · konsert-chipta · skuter-ijara · sinfdosh-poyga · o'quvchining Netlify-sayti) — birortasi emas ✓ |
| **Kirish-artefakt** | 🔴 **YO'Q** — modul-chegara (registr 6-bo'lim: modulning BIRINCHI PM darsi kirish-artefakt talab qilmaydi). «Topilmadi / saqlanmagan» tarmog'i **umuman yozilmaydi** (§69), zaxira-gap ham yo'q: s8 mentori bitta shaklda turadi |
| **Chiqish-artefakt** | 🔒 **Bosh-agent muhri (o'zgartirilmadi):** `pm-m5d2-yigirmata` = `{ kanallar: [ { kanal, kim, nechta } × 3 ], savedAt }` · `kanal` — joy nomi (o'quvchi yozadi) · `kim` — o'sha joydan kimlar kelishi (bir qator) · `nechta` — odam soni (son) · uch sonning yig'indisi yigirmaga yaqin bo'lishi darsning bosh g'oyasi (saqlash-sharti emas — yo'naltiruvchi qator). 🔴 Kod-kalit `kanal`, o'quvchi matnida esa **«joy»** (sabab: 0-bo'lim glossi, Telegram-kanali bilan omonimiya) ⚠️ GATE S 3-savoli |
| **Yordamchi kalitlar** | `pm-m5d2-hook-choice` (faqat YOZILADI — 100c) · `pm-m5d2-halqa` (s4 holati: uch halqa ochildi + qaysi haftalar ko'rildi) · `pm-m5d2-quvur` (s9: bosilgan joylar + yig'ilgan son) · `pm-m5d2-code` · `pm-m5d2-reflection` · `pm-m5d2-hw-target` · `ccProgress` |
| **Koding** | 🖥 **KOMPILYATOR** — R1 navbati (registr: m4c-06 VS Code → **m5-02 kompilyator**). Sof JS, `previewUrl` **YO'Q**, shartlar **xulq-atvorda** tekshiriladi (chiqqan qatorlar bo'yicha), boshlang'ich kod yashil emas — 18-ov bandi. Senariy buni o'zgartirmaydi |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — B3 senariylari bilan bir xil yakun-tuzilma |

**Atama-glosslar (62/39-qonun + korpus §20 — avval hodisa, keyin nom):**

- 🔴 **«birinchi yigirma» — darsning bosh nomi.** Kanonik ta'rif dars bo'ylab AYNAN bir xil: **«Botingizni birinchi bo'lib ishlatadigan yigirmata odam — birinchi yigirma»** (§109: zamon-iborasi «birinchi bo'lib ishlatadigan», yasama ot emas). Shu ta'rif s2 xulosa-kartasi · flashcard-1 · RECAPS s3 · s15 yakun-ro'yxatida so'zma-so'z. Atama **s2 da** tug'iladi — s1 maqsad-ekranida YO'Q (§126);
- 🔴 **«zich joy» — darsning ikkinchi nomi**, s4 yakun-kartasida hodisadan KEYIN tug'iladi. Kanonik ta'rif: **«Odamlar bir-birini har kuni ko'radigan joy — zich joy»** (s4 · flashcard-2 · RECAPS s5 · s15). So'z o'smirga jismonan tanish: «avtobus zich», «zich turing» — ya'ni odamlar bir-biriga yaqin. ❌ «zichlik» (yasama ot, §103) — faqat sifat + ot: «zich joy»;
- 🔴 **«joy»** — odamlar yig'iladigan yer (sinfdoshlar guruhi · to'garak · qo'shnilar · katta guruh). Darsda «joy» faqat shu ma'noda (§105/§121): ekran bo'lagi, o'rindiq, bo'sh maydon ma'nosida ishlatilmaydi;
- 🔴 **«kanal» o'quvchi matnida 0** — Telegramda «kanal» boshqa narsa (obuna bo'linadigan lenta), bola «sinfdoshlar guruhi — kanalmi?» degan savolda qoladi (§121 omonim-sinfi). Kod-kalitida `kanallar` qoladi (`tolov`/`bolaklar` pretsedenti — ASCII kod-nomi ↔ o'quvchi so'zi ajratilgan);
- 🔴 **«signal» o'quvchi matnida 0** — 5-modulning texnik lug'atida `trigger` = **signal** (`BotIntroLesson`: «signal → amal»), M4c-D6 da esa signal = o'lchagich xabari. Uchinchi ma'no qo'shilmaydi (§121). Xabar keladigan joyda dars **«xabar»** deydi;
- 🔴 **Halqa-nomlari hamma yuzada bir xil:** ① **«Har kuni ko'rishadiganlar»** · ② **«Ba'zan ko'rishadiganlar»** · ③ **«Sizni tanimaydiganlar»**. Ranglar bilan emas, raqam va nom bilan ataladi (§134: rang-ma'nosi o'quvchi matnida o'rgatilmagani uchun rangga tayanmaydi);
- 🔴 **Uch qadam (s9 quvuri) hamma yuzada bir xil:** **«eshitdi → ochdi → ishlatdi»** (fe'l-qatori, §103). ❌ «qaytdi / qaytish» — bu m5-11 ning atamasi (29-qonun), darsda 0;
- 🔴 **Fe'l-intizomi (korpus §80):** odam **eshitadi / ochadi / ishlatadi / aytadi / ko'rsatadi**; xabar **tarqaladi**; joy **odam beradi**; siz **aytasiz / yozasiz / sanaysiz**. ❌ «jalb qilish», «yig'ib olish» (kantselyarit) — bitta ibora: **«yig'ish»** (yigirmata odamni yig'ish);
- 🔴 **5-modul lug'ati (Botjon)** — `BotIntroLesson` ning modul-metaforasi (🔑 kalit · 📋 qoidalar varag'i · to'xtamaydigan aylana). Bu dars undan **hech narsa olmaydi va hech narsa qo'shmaydi**: PM darsi botning ichiga emas, **botga keladigan odamlarga** qaraydi. «Botjon», «kalit», «qoidalar varag'i», «aylana» ekranda **0** (38-qonun: boshqa dars metaforasi ko'chirilmaydi);
- ❌ **«kanal», «reklama», «tarmoq», «sovuq start», «og'izdan-og'iz», «spam»** — eski `-v16` faylning lug'ati (`PmLesson19.jsx:19–24`). Butunlay olib tashlanadi;
- ❌ **«auditoriya»** — M1-D2 ning so'zi; bu darsda kerak emas, o'rniga **«odamlar»** (109-qonun: ortiqcha atama TMI);
- ❌ **«foydalanuvchi»** ballanadigan matnda ham, oddiy matnda ham **kamaytirilgan**: dars **«odam»** deydi (o'smir tili, korpus §80). «Foydalanuvchi» faqat `App.jsx` kartasi va senariy-annotatsiyasida qoladi.

🔴 **§40/§81 darvozasi (bu darsning eng nozik joyi):** o'quvchida bot **hali yo'q** — u shu modulda quriladi (m5-01 «Bot nima» o'tilgan, BotFather va token keyingi texnik darslarda). Shuning uchun: **(a)** dars bo'ylab bot **«bu modulda quradigan botingiz»** shaklida turadi va bu s1 da bir marta ochiq aytiladi; **(b)** bot havolasi, nomi, tokeni **hech qayerda so'ralmaydi** (92d); **(c)** o'quvchidan so'raladigan yagona narsa — u **allaqachon biladigan odamlar** (sinfdoshlar, qo'shnilar, to'garakdagilar), ya'ni artefakt botsiz ham to'liq yoziladi; **(d)** «botingiz ishlab turibdi», «botingizni oching» kabi hozirgi zamon buyruqlari **0**. ⚠️ GATE S 2-savoli.

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «BIRINCHI 20» — foydalanuvchi-to'lqin xaritasi** (23-qonun: har darsda YANGI — registr 5-bo'limidagi birorta band vizual klonlanmaydi).

Ekran markazida bitta nuqta — **siz**. Uning atrofida uchta halqa, har biri o'z yorlig'i bilan
(halqa kattalashgan sari nuqtalar ko'payadi, lekin ochroq chiziladi):

| Halqa | Yorlig'i | Ichida nechta odam | Ochilganda ko'rinadigan qator |
|---|---|---|---|
| ① | Har kuni ko'rishadiganlar | 12 | Sinfdoshlar, to'garakdagilar, qo'shnilar. Ular sizni ismingiz bilan biladi |
| ② | Ba'zan ko'rishadiganlar | 40 | Boshqa sinflar, maktabdagi tanishlar. Sizni yuzdan taniydi |
| ③ | Sizni tanimaydiganlar | 300 | Katta guruhlardagi begona odamlar. Sizni umuman bilmaydi |

**1-bosqich — xaritani ochish.** O'quvchi halqalarni bittalab bosadi; halqa yonib, ichidagi
odamlar kim ekani bitta qatorda chiqadi. Bu bosqichda natija YO'Q — faqat kim qayerda turgani
(94-qonun progressiv ochilish: uchala halqa ochilmaguncha 2-bosqich yopiq).

**2-bosqich — bir haftani berish.** Uchala halqa ochilgach, ekranga bitta savol-karta chiqadi:
*«Bir hafta vaqtingiz bor. Bot haqida qaysi halqadagilarga aytasiz?»* — uch tugma:
**① Har kuni ko'rishadiganlarga · ② Ba'zan ko'rishadiganlarga · ③ Sizni tanimaydiganlarga**.
Tanlangach o'sha halqada bir hafta ~6 soniyada o'tadi (nuqtalar navbat bilan yonadi) va
natija-qatori chiqadi:

- **①** → «Bir hafta ichida 9 odam ishlatdi. Ular yonidagilarga ko'rsatdi — yana 8 odam qo'shildi. Jami 17.»
- **②** → «Bir hafta ichida 6 odam ishlatdi. Yana qo'shilgani — 2 odam. Jami 8.»
- **③** → «Bir hafta ichida 4 odam ishlatdi. Yana qo'shilgani yo'q. Jami 4.»

🔴 **Atama-tartibi (§104/§126):** savol-kartada ham, natija-qatorlarida ham «zich joy» so'zi
YO'Q — u yerda faqat hodisa tili («har kuni ko'rishadiganlar», «yana 8 odam qo'shildi»).
Atama quyidagi **yakun-kartasida**, ko'rilgan hodisadan keyin tug'iladi.

Uchala tugma ham bosilgach (o'quvchi solishtiradi — 88-qonun: bosilmaganlar navbat bilan
yonadi) yakun-kartasi ochiladi (69-qonun — xulosa, maqtov emas):

> **Odamlar bir-birini har kuni ko'radigan joy — zich joy.** Zich joyda bitta odam botni ochsa,
> qolganlari ko'radi va o'zlari ham ochadi. Birinchi yigirma shunday joydan yig'iladi.

🔴 **Rang-qonuni (palitra-pasporti):** halqalar **rang bilan baholanmaydi** — ② va ③ ning
natijasi «yomon» emas, shunchaki kamroq; qizil ishlatilmaydi. Tanlangan halqa — accent,
qolganlari neytral. Sabab: §134 — rangga ma'no yuklansa, u o'quvchi matnida o'rgatilishi
kerak bo'ladi; bu darsda rang-ma'nosi o'rgatilmaydi, demak rang hech narsa demaydi.

🔴 **Nima uchun aynan shu:** «birinchi foydalanuvchilarni o'z doirangdan top» degan gapni
o'qib tushunib bo'lmaydi — u nasihatga o'xshaydi. Bola xaritada O'ZINI markazda ko'radi,
uchta halqani o'z qo'li bilan ochadi va bir haftani uch marta boshqa joyga berib, natijani
solishtiradi. Kashfiyot raqamda emas — **eng kichik halqa eng ko'p odam berganida**.

🔴 **Mexanika-farqi (26/59-qonun):** M4c-D6 da o'quvchi **kunni ko'rib chegara qo'yardi**
(vaqt chizig'i + uch chegara); M4a-D2 da **surma bilan yukni oshirardi**; M4c-D2 da
**hafta-kataklarini ochardi**; M3-D10 da **soxta formani bosardi**. Bu yerda boshqa obyekt
(odamlar xaritasi — halqalar), boshqa harakat (bitta haftani bitta halqaga berish), boshqa
maqsad (qaysi joy ko'p odam beradi). Surma ham, vaqt chizig'i ham, katak ham YO'Q.

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 2-bosqichda 40–45 soniya harakatsizlikdan
keyin bitta qoida-ipuchasi: «Boshqa halqaga ham bir hafta berib, natijani solishtiring» —
«zich joy» so'zi bu bosqichda hali tug'ilmagan (§104); javobni AYTMAYDIGAN shakl (§77).

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi B3 senariylaridagidek — etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Telegramda hozir nechta botni ishlatasiz?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch joy-qatori o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — bot tayyor ↔ botni odam ishlatdi | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **«BIRINCHI 20» xaritasi** (halqalar + bir hafta) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — Facebook: bitta joydan boshlangan (4 slayd + 2 bashorat) | 3 | — | keys-slayd qolipi (K8) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 joy** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **JOY-QUVURI** (uch qadam · yigirmagacha) | 5 | — | 🔴 yangi mexanika |
| s10 | KODING — odamlarni sanaydigan kod (kompilyator) | 6 | — | 26/82/87-qonun · sof JS |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ustaxona», «keys», «quvur», «halqa-mexanikasi» — senariy-ichi nomlar** (korpus §84).
Ekranda o'quvchi «BIRINCHI 20» yozuvini ham, «JOY-QUVURI» nomini ham ko'rmaydi — u
«odamlar xaritasi»ni va «to'rt joy»ni ko'radi. **«halqa» esa ekran-so'zi** (yorliqlarda va
mentor gapida bor) — u mexanika nomi emas, ko'rinib turgan shaklning nomi.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 5 — Botlar va avtomatlashtirish
DARS: M5-D2 (2-dars)
DARS_MAVZUSI: Birinchi foydalanuvchilar — yigirmata odam qayerdan keladi
ISHLATILGAN_KEYS: K8
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Telegramda hozir nechta botni ishlatasiz? Bittasi ham esingizga kelmasligi
mumkin — ikkala javob ham to'g'ri.
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: botni ko'pincha qidirib emas, kimdir
aytgani uchun ochamiz.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkalasi ham halol javob. Payoff «o'sha odam siz bo'lasiz»
degan joyda to'xtang: aynan shu ish bugungi darsning ishi.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 🤖 Bir-ikkitasi bor — kimdir aytgani uchun ochganman | 49 |
| 🔎 Yo'q shekilli — o'zim hech qachon qidirmaganman | 47 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham bo'ladi. Botni ko'pincha qidirib emas, kimdir aytgani uchun ochamiz. Siz quradigan bot haqida ham birinchi odamlarga kimdir aytishi kerak — o'sha odam siz bo'lasiz.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsa (Telegram, bot) + harakat-fe'l («ishlatasiz») + o'quvchining o'z holatidan o'sadi (Telegram unda bor, bot-ishlatish tajribasi ham). Ovoz chiqarib o'smir og'zidan: «men nechta bot ishlataman?» — tabiiy.
> 🔴 **104-qonun + korpus §119:** to'g'ri javob YO'Q — payoff ikkala tanlovni ham yolg'onga chiqarmaydi: «kimdir aytgani uchun ochganman» degan bola payoffda o'z tajribasini ko'radi; «hech qachon qidirmaganman» degan bola ham xato deb topilmaydi — payoff aynan «qidirib topilmaydi» deydi. ❌ «To'g'ri sezdingiz…» yozilmaydi.
> 🔴 **100-qonun:** tanlov `pm-m5d2-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62/126-qonun:** «birinchi yigirma», «zich joy» atamalari bu ekranda YO'Q — s2/s4 da ochiladi.
> 🔴 **Spoyler-taqiq:** payoff «kimdir aytishi kerak» deydi — KIMGA va QAYERDA aytish kerakligini aytmaydi; s4 kashfiyoti butun qoladi.
> 🔴 **§40:** savol o'quvchida BOR narsadan so'raydi (u ishlatadigan botlar), qurayotgan botidan emas.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ekran-o'lchovi:** savol + payoff = **287 grapheme** proza (chegara 400) ✓.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Bu modulda botingizni qurasiz. Dars oxirida uchta joy yozib olasiz: botni
birinchi bo'lib ishlatadigan yigirmata odam qayerdan kelishini o'zingiz belgilaysiz.
HARAKAT: O'quvchi kuzatadi: bo'sh ro'yxatga uchta joy-qatori o'z-o'zidan yozilib chiqadi,
har birining yoniga ✅ qo'yiladi, pastda yig'indi sanaladi.
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
| 🏫 Sinfdoshlar guruhi → birga o'qiydiganlar → 12 |
| 🏀 To'garak → haftada uchrashadiganlar → 6 |
| 🏠 Qo'shnilar → bir ko'chadagilar → 4 |
| **Jami: 22 odam** |

> 🔴 **39/62/126-qonun:** s1 da «birinchi yigirma» ham, «zich joy» ham **0** — atamalar o'z ekranida ochiladi; demo faqat natijaning SHAKLINI nomlaydi (korpus §125), qaysi joy ko'p odam berishini AYTMAYDI — bu s4 kashfiyoti.
> 🔴 **§128 (namuna o'z qoidasidan o'tsin):** demo-qator s8 ning uchala qabul-shartidan o'tadi (joy nomi bor · kimlar borligi aytilgan · son bor) — bola uni ko'chirsa ham «bu hali sabab emas» olmaydi. Demo raqamlari s4 (12/40/300) va s9 (13/7/2/1) raqamlaridan BOSHQA — ko'chirib olinadigan javob yo'q.
> 🔴 **Spoyler-taqiq:** demo-qatorlar «zich» so'zini ham, halqa-nomlarini ham ishlatmaydi.
> 🔴 **40/§81-qonun:** «bu modulda botingizni qurasiz» — o'quvchida bot hali yo'q, shuning uchun maqsad-gapi uni **quriladigan** narsa sifatida aytadi; so'raladigan narsa esa uning odamlari (bular unda bor) ✓.
> 🔴 **42-qonun:** «o'z-o'zidan yozilib chiqadi»; **54(b/c):** `ta-sub` ikkinchi qator YO'Q, demo ostidagi caption YO'Q.
> 🔴 **Ekran-o'lchovi:** proza **158 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (odamlar xaritasi) + 3 x Quiz
EKRAN: Botni birinchi bo'lib ishlatadigan yigirmata odam — birinchi yigirma. Ularni bot
o'zi olib kelmaydi. Ular bir joydan keladi: odamlar bir-birini har kuni ko'radigan joydan.
(🔴 Bu blok-gapi s2 va s4 xulosalarining yig'indisi — ekranda bir joyda bunday
turmaydi; s2 birinchi gapni, s4 ikkinchisini beradi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) uch halqani ochadi, keyin bir haftani
uch halqaga navbat bilan berib natijalarni solishtiradi; (s6) Facebook voqeasini bashorat
bilan ochadi.
JAVOB: s4 — eng ko'p odam ① halqadan keladi (17); ② — 8; ③ — 4.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar odatda ③ ni bosadi — «u yerda odam ko'p». Uchalasi bosilgach
so'rang: ① da 12 odam bor edi, natija esa 17 — bu qo'shimcha 5 odam qayerdan keldi?
Javobni siz aytmang, bolalar natija-qatoridan o'zi o'qiydi.
```

**s2 — TEORIYA-1: bot tayyor ↔ botni odam ishlatdi** (korpus §73: ikki holatni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Bot tayyor bo'ldi — endi u kimga kerak?»**

Mentor (≤2 gap, 32b):
> Tasavvur qiling: kod yozilgan, tugmalar ishlayapti. Ikki kartani bosib solishtiring.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 🤖 **Bot tayyor** | Buyruqlar ishlaydi, javob keladi. Lekin uni hali hech kim ochmagan — bot bo'sh turibdi |
| 👥 **Botni odam ishlatdi** | Kimdir ochdi, yozdi, javob oldi. Bot endi kimgadir kerak bo'ldi |

Xulosa-karta (69-qonun · kanonik ta'rif):
> **Botingizni birinchi bo'lib ishlatadigan yigirmata odam — birinchi yigirma.** Ularni bot o'zi olib kelmaydi: har biriga siz aytasiz.

> 🔴 **39-qonun qolipi:** avval hodisa (ikki karta), keyin «… — birinchi yigirma». Sarlavhada yangi atama YO'Q ✓ (§126: bosh atama s1 da emas, s2 da tug'iladi).
> 🔴 **§104:** ta'rif-gap to'liq (hodisa → nom → kim olib keladi), kesik qurilma emas.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan.
> 🔴 **Nega aynan yigirma:** son modulning o'z maqsadidan keladi (modul g'oyasi: «20+ real foydalanuvchi»). s1 dagi «yigirmata odam» va s2 dagi ta'rif bitta sondan yuradi (22-qonun sanoq-mosligi) — o'ylab topilgan raqam emas, dastur-raqami.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **254 grapheme** ✓ (karta matnlari — mashq-materiali).

**s4 — YADRO: «BIRINCHI 20» xaritasi** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Uch halqani ochib ko'ring.»**

Mentor (1 gap — 92a/ETALON 32: tugmalar ekranda ko'rinib turibdi, takror ko'rsatma yo'q):
> Markazda siz turibsiz; halqa uzoqlashgan sari odam ko'payadi, lekin siz ularni kamroq taniysiz.

> 🔴 **98b:** mentor qaysi halqa ko'p odam berishini AYTMAYDI — natija-qatorlar 2-bosqichda chiqadi, o'quvchi o'qiydi.
> 🔴 **106d/71:** har bosishda javob darhol: halqa yonadi **va** bitta qator chiqadi — o'quvchi «bu halqada kimlar?» savoliga javobni o'qiydi, taxmin qilmaydi. QOIDA («zich joy») ekranda yakun-kartagacha yozilmaydi (§106).
> 🔴 **72-qonun:** halqa-tugmalari yorliqli, diqqat-signali bilan; bosilgach tinadi. 2-bosqich uch tugmasi — to'lqin (88a1: bittasi tanlanadi, teng emas).
> 🔴 **§95:** 2-bosqich natijalaridagi sonlar 1-bosqich qatorlaridagi odam soni bilan bog'lanadi (12 odamdan 9 tasi; 40 dan 6; 300 dan 4) — raqam manbasi ekranda ko'rinib turadi.
> 🔴 **§104/§105/§126 (atama-tartibi):** «zich joy» savol-kartada ham, natija-qatorlarida ham YO'Q — u yerda faqat hodisa tili. Atama **yakun-kartasida**, ko'rilgan hodisadan keyin tug'iladi.
> 🔴 **§133 (xulosa-bandi keyingi test kaliti bo'lmasin):** yakun-kartada «katta joyda odam ko'p, lekin ishlatgani kam» bandi **YO'Q** — u s11 (yakuniy test) ning javobi; uni natija-qatorlari va s9 materiali o'zi o'rgatadi.
> 🔴 **Ekran-o'lchovi:** sarlavha (26) + mentor (95) + yakun-karta (174) = **295 grapheme** ✓ (halqa-qatorlari va natija-qatorlari — mashq-materiali).

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Uchta joyingizni yozing.
(mentor, 1 gap) Zich joyni eslang: odamlar bir-birini har kuni ko'radigan joy.
HARAKAT: Uchta joyni BITTALAB yozadi. Har kartada: joy nomini yozadi, o'sha joyda kimlar
borligini yozadi, nechta odam ekanini son bilan yozadi. Saqlaganda qator o'ngdagi
ro'yxatga ko'chadi va pastda yig'indi yangilanadi.
JAVOB: Uchala joy yozilgan · har joyda son bor · «kim» qatorida aniq odamlar yozilgan
(sinfdoshlar, qo'shnilar, to'garakdagilar kabi) · «hamma», «odamlar», «do'stlar» kabi
umumiy so'zlar javob emas.
RO'YXAT: Uchta joy yozilgan · Har joyda odam soni bor · Har joyda kimlar borligi aniq
YULDUZCHA: Eng katta joyingizga qarang: undagi odamlarning yarmi botni ochmasa,
yigirmata odam qoladimi? Javobingizni bir qatorda yozing.
YORDAM: O'zingizga ikki savol bering: bu odamlarni haftada necha marta ko'rasiz? Ular
sizni ismingiz bilan biladimi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Butun maktab», «Telegramdagi hamma» kabi katta joylar chiqadi — eng foydali
xato. Javob-qatori uni tutadi; siz s4 dagi ③ halqa natijasini eslating: 300 odamdan 4 tasi.
```

🔴 **Kirish-artefakt YO'Q (modul-chegara):** s8 da hech qanday kalit o'qilmaydi, tasma ham,
zaxira-gap ham chizilmaydi. Mentor pufagi — **bitta shakl, bitta gap** (ETALON 32). §69
bo'yicha «topilmadi / saqlanmagan / bo'sh» so'zlari **0** va yo'qlik haqida gap YO'Q.

🔴 **Yozish-kartasi (80b) — bitta karta, uch joy uchun uch marta:**

| Qadam | Kartada nima turadi | Ipucha (placeholder — korpus §32: qisqa savol, tayyor javob YO'Q) |
|---|---|---|
| Joy (matn) | — | `Qaysi joy?` |
| Kimlar bor (matn) | — | `U yerda kimlar bor?` |
| Nechta odam (qisqa son-maydon) | yonida «odam» so'zi turadi | `Nechta?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12; 106d ikki tomonlama):**
- ✅ son bor + «kim» qatorida aniq odamlar → «✅ Bu joydagi odamlarni siz o'zingiz taniysiz.»
- 🤔 son maydonida son yo'q → «Nechta odam? Sonini yozing.»
- 🤔 «kim» qatorida umumiy so'z (*hamma · odamlar · do'stlar · yoshlar · bolalar*) → «Bu hali javob emas. U yerda kimlar bor: sinfdoshlarmi, qo'shnilarmi, to'garakdagilarmi? Shuni yozing.»
- 🤔 bitta joyda son 100 dan katta → «Bu joyda odam ko'p. Ularning nechtasi sizni taniydi? O'sha sonni yozing.» (bloklamaydi — yo'naltiradi; o'quvchi o'z soni bilan qoldirsa saqlanadi)
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»
- yig'indi qatori (§131 — yig'iladigan natija har qadamda sanaladi): «Hozircha: 13 odam» → uchala joy yozilgach «Jami: 24 odam»

🔴 **Yig'indi-qatori hukm bermaydi:** yigirmadan kam chiqsa qizil bo'lmaydi, faqat bitta
yo'naltiruvchi qator chiqadi: «Yigirmaga yetmadi — joylardan birida sonni qayta sanang yoki
yana bitta joy qo'shing.» Yigirmaga yetgan-yetmagani **saqlashni bloklamaydi** (o'quvchining
o'z hayoti — undan yolg'on son yozish talab qilinmaydi).

🔴 **Umumiy-so'zlar lug'ati** (qoida-asosidagi tekshiruv — 106d(c), dars o'z so'zlaridan):
*hamma · odamlar · do'stlar · yoshlar · bolalar · hech kim*. Checklist yorlig'ida o'quvchi
ko'radigan matn — **«Har joyda kimlar borligi aniq»** (§130: mezon AYNAN so'zni emas,
MA'NOni so'raydi). Yordam chipida ikki savol turadi: «Bu odamlarni haftada necha marta
ko'rasiz?» · «Ular sizni ismingiz bilan biladimi?»

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **87 grapheme** ✓ — javob-qatorlar harakatdan keyin, bittadan chiqadi.

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (joy-quvuri — uch qadam, yigirmagacha)
EKRAN: (topshiriq) Yigirmata odamni yig'ing.
(yo'riqnoma) To'rt joy bor. Bittasini tanlang — undan nechta odam botni ochib ishlatgani
ko'rinadi. Yigirmaga yetguncha davom eting.
HARAKAT: To'rt joydan birini bosadi; tanlangan joy uch qadamdan o'tadi (eshitdi → ochdi →
ishlatdi), oxirgi son pastdagi hisobga qo'shiladi va bir qatorlik sabab ochiladi.
Yigirmaga yetguncha davom etadi; oxirida bosilgan joylar xulosa-tasmada.
JAVOB: Yigirma ikkita joydan yig'iladi: 🏫 Sinfdoshlar guruhi (13) + 🏀 To'garakdagilar (7).
🌐 Notanish odamlar guruhi 2 odam, 📌 Maktab e'lonlar taxtasi 1 odam beradi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi kam natijadan keyin) Ikki savol bering: bu odamlar bir-birini taniydimi?
Ular bir-birini haftada necha marta ko'radi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda: har o'quvchi sherigining uch joyini o'qib, har biriga «bu odamlar
bir-birini haftada necha marta ko'radi?» deb so'raydi. Javob topilmasa — joy qayta yoziladi.
MENTORGA: Eng ko'p bosiladigan joy — 1200 kishilik guruh. Uch qadam ochilgach so'rang:
1200 odam eshitdi, ishlatgani 2 ta — qolgan 1198 tasi qayerda qoldi?
```

**To'rt joy (o'quvchi bosishdan OLDIN ko'radigan ma'lumot — §120: har joyda yetarli material):**

| # | Joy | Nechta odam bor | Odamlar qanchalik tez-tez ko'rishadi |
|---|---|---|---|
| 1 | 🏫 Sinfdoshlar guruhi | 26 | har kuni ko'rishadi |
| 2 | 🏀 To'garakdagilar | 11 | haftada uch marta ko'rishadi |
| 3 | 🌐 Notanish odamlar guruhi | 1200 | umuman ko'rishmaydi |
| 4 | 📌 Maktab e'lonlar taxtasi | 300 | faqat o'tib ketayotganda ko'rishadi |

**Bosilgandan keyin (uch qadam va sabab-qatori):**

| # | eshitdi | ochdi | **ishlatdi** | Sabab-qatori |
|---|---|---|---|---|
| 1 | 26 | 18 | **13** | Biri ochdi, yonidagilarga ko'rsatdi |
| 2 | 11 | 9 | **7** | Haftada uch marta uchrashadi — bir-biriga eslatadi |
| 3 | 1200 | 46 | **2** | Sizni tanimaydi — ochib, yopib qo'ydi |
| 4 | 300 | 12 | **1** | O'qidi va o'tib ketdi — eslatadigan odam yo'q |

Hisob (ekran pastida, har bosishdan keyin yangilanadi): **«Yig'ildi: 0 / 20»**

Yakun-qatori (xulosa-tasma ostida):
> ✅ **Yigirmata odamni ikkita joy berdi: sinfdoshlar guruhi 13, to'garakdagilar 7. Notanish odamlar guruhi 1200 odamdan atigi 2 tasini berdi.**

> 🔴 **26/59-qonun — farq-dalili (pasport talabi):** «signal-saralash» (m4c-06) har kelgan xabarga **yo'l** tanlaydi; «nosozlik-navbati» (m4b-02) kartani **javonga** tushiradi; «haftaga-sig'dirish darvozasi» (m4c-02) nomzodni **ikki chiroqdan** o'tkazadi; «yuk-tartiblash» (M4a-D2) **tartib** quradi; «tekshiruvchi stoli» (M3-D2) **✓/✕ hukm** beradi. Joy-quvurida esa hech narsa baholanmaydi, yo'naltirilmaydi, tartiblanmaydi va hech qayerga tushmaydi — o'quvchi **maqsadga (20 ga) yetguncha joy tanlaydi va har joyning uch qadamdagi yo'qotishini o'qiydi**. Boshqa obyekt (odam beradigan joy), boshqa harakat (maqsadga yig'ish), boshqa maqsad (qaysi joy chindan odam beradi).
> 🔴 **§120 (material har shart uchun bitta javobni himoyalaydi):** har joy kartasida bosishdan OLDIN uchala narsa turadi — joy nomi · odam soni · odamlar qanchalik tez-tez ko'rishadi. Ya'ni «zich joyni tanish» qoidasi materialdan chiqadi, yodlashdan emas; darsni tushungan bola 1200 lik guruhni ochmasdan ham chetlab o'tadi.
> 🔴 **§107 (teng nisbat):** to'rt joyning **ikkitasi zich, ikkitasi tarqoq** (2/2); tartib naqshsiz (zich · zich · tarqoq · tarqoq emas — ekranda aralash: 🏫 · 🌐 · 🏀 · 📌).
> 🔴 **§116:** YORDAM ikki o'lchovni qamraydi (taniydimi? necha marta ko'rishadi?) — to'rttala joyning ham holatini to'g'ri beradi.
> 🔴 **106d + korpus §77/§98:** kam natijali joy bosilganda javob DOIM ochiladi: «🤔 1200 odam eshitdi, ishlatgani 2 ta — ular sizni tanimaydi»; tugma bloklanmaydi, YORDAM faqat birinchi kam natijadan keyin.
> 🔴 **61-qonun:** tugmalar baho EMAS (✓/✕ emas) — joy nomining o'zi tugma.
> 🔴 **§134:** hisob va natijalar rang bilan hukm qilmaydi; «2 odam» qizil emas — u shunchaki kichik son.
> 🔴 **SOFT aynan shu blokda** · **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **147 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (kompilyator — R1 navbati; sof JS, previewUrl YO'Q)
EKRAN: (sarlavha) Odamlarni sanaydigan kod yozamiz.
(mentor, 2 gap) Uchta joyingiz kodda ro'yxat bo'lib turibdi. Sizga sanash va bitta shart
qoladi.
HARAKAT: Ro'yxat bo'ylab yuradi, har joy uchun bitta qator chiqaradi, sonlarni jamlaydi va
oxirida jami yigirmaga yetgan-yetmaganini bitta shart bilan yozadi.
JAVOB: Uch joy qatori + jami son + yigirmaga yetmasa nechta odam kamligi chiqadi.
RO'YXAT: Har joy uchun bitta qator chiqadi · Jami son chiqadi · Yigirmaga yetmasa,
nechta odam kamligi chiqadi
YULDUZCHA: Eng ko'p odam beradigan joyning nomini alohida qatorda chiqaring.
YORDAM: Bitta qatordan boshlang: joylar[0].joy ni chiqarib ko'ring. Ishlagach, shu
joyning sonini jami ga qo'shing.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ro'yxat o'quvchining o'z uch joyi bilan to'ldirilgan bo'ladi. Sonlar har kimda
har xil — natija ham har xil chiqadi, bu to'g'ri.
```

> 🔴 **87-qonun (o'tilgan texnik material):** massiv, obyekt maydonlari (`.joy`, `.nechta`), `for (let i = 0; …)`, `if/else`, `+` bilan matn qo'shish, `console.log` — hammasi M2–M4 da o'tilgan. Yangi hech narsa talab qilinmaydi; `for…of`, `reduce`, shablon-satr — ishlatilmaydi ⚠️ GATE S 7-savoli.
> 🔴 **26-qonun / R1:** m4c-06 VS Code → **m5-02 kompilyator** — registr navbati, senariy o'zgartirmaydi. Terminal YO'Q, brauzer-ko'rinishi (`previewUrl`) YO'Q: natija faqat chiqqan qatorlarda.
> 🔴 **18-ov bandi (starter yashil emas):** boshlang'ich kod ishga tushganda **birorta shart bajarilmaydi** — hech qanday qator chiqmaydi (`for` ichi bo'sh, oxirgi shart yozilmagan). Uchala shart ham xulq-atvorda tekshiriladi: (1) chiqishda uchta joy-qatori bormi, (2) jami soni bormi, (3) yigirmaga yetmagan holatda kam odam soni chiqadimi.
> 🔴 **Korpus §19/§48:** sarlavha «…digan **kod** yozamiz» oilasidan, natijani aytadi.
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»).
> 🔴 **87c (halol ulanish):** PM ishi kodga halol o'tadi — o'quvchi s8 da yozgan uch joyi kodda ro'yxat bo'lib turadi, `if` esa «yigirmaga yetdimi?» degan darsning o'z savoli.
> 🔴 **§69 (jim zaxira):** ro'yxat `pm-m5d2-yigirmata` dan to'ldiriladi; kalit bo'lmasa (o'quvchi s8 ni o'tkazib yuborgan bo'lsa) uchta namuna-joy turadi — «saqlanmagan» kabi matn YO'Q.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **114 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch joyingizni yoddan ayta olasizmi?
(mentor) Ekranga qaramay javob bering: eng zich joyingiz qaysi va u yerdagi odamlar
bir-birini haftada necha marta ko'radi? Avval sherigingizga ayting, keyin bir qatorda yozing.
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
MENTORGA: Uchdan biri «haftada necha marta ko'radi» savoliga javob berolmasa — s4 ekranini
qayta oching va ① halqa natijasini birga o'qing.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — **«O'zingizni sinab ko'ring.»**
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, keyin bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **106f(b):** yozib bo'lgach mukofot: «Endi siz botni qurib qo'yib ketmaysiz — birinchi odamlarni o'zingiz olib kelasiz» + qoida-qatori «🎯 Bugungi qoida: birinchi yigirma zich joydan yig'iladi».
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **205 grapheme** ✓.

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda uchta joyingizdagi odamlarni ismma-ism yozib chiqasiz: maqsad — yigirmata
ism. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
HARAKAT: Har joy uchun alohida ro'yxat ochadi va o'sha joydan taniydigan odamlarning
ismini yozadi; har ism yoniga qaysi joydan ekanini belgilaydi; oxirida jami ismni sanaydi.
JAVOB: —
RO'YXAT: Uch joydan ism yozilgan · Har ism yonida joyi belgilangan · Jami yigirmata ism
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Bitta — eng zich joyingizdan yettita ism yozing va har birining yoniga uni
haftada necha marta ko'rishingizni qo'shing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa.
Yigirmata ism chiqmasa — bu ham natija: joylardan biri zich emas ekan, uni qayta ko'radi.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni ham «yigirmata ism» ni aytadi (bu darsning bosh soni, yashirilmaydi), lekin «uchtadan nechtadan» taqsimotini AYTMAYDI — u To'liq-kartada.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — joyni nomlash s8 da, odam sanash s8 va s9 da bajarilgan.
> 🔴 **§81/92d:** vazifa o'quvchida ANIQ bor narsani so'raydi — u taniydigan odamlarning ismi; bot, havola, telefon, hech kimning ma'lumoti so'ralmaydi.
> 🔴 **Korpus §125:** kuzatiladigan hodisa aytiladi («haftada necha marta ko'rasiz»), mavhum «o'ylab ko'ring» emas.
> 🔴 **Ekran-o'lchovi:** **126 grapheme** ✓.

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
MAVZU: Birinchi yigirma nima va uni kim olib keladi; zich joy nima va nega u ko'p odam
beradi; uch qadam (eshitdi · ochdi · ishlatdi); katta joyda odam ko'p, ishlatgani kam;
Facebook qayerdan boshlagan, dunyoga qachon ochilgan va nima ish bergan; uchta joy
yozganda nimalar yoziladi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §110 (mutlaq so'z ≤1) · §118 (cheklov-so'zsiz) · §127 (atama ≥2 variantda yoki hech birida) · §129 (kalit xulosadan so'zma-so'z emas) · §133 (tinish-shakl telli yo'q) · §134 (rang-holati va son-echo yo'q). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🤖 Bot bir hafta ishlab turdi, siz hech kimga aytmadingiz. Nechta odam yozdi?
- A. Bir nechta — Telegram botni o'zi ko'rsatadi *(43)*
- **B.** Hech kim — uni topadigan odam bo'lmadi ✅ *(38)*
- C. Ko'p — bot qidiruvda birinchi chiqadi *(37)*

**Reveal:** To'g'ri — bot o'zi odam olib kelmaydi. Birinchi odamlarga siz aytasiz, keyin ular boshqasiga aytadi.

> 🔴 **§129:** s2 xulosasi ta'rifni aytadi («ularni bot o'zi olib kelmaydi»); savol esa VAZIYATNI beradi (bir hafta, hech kimga aytilmagan) va bola qoidani QO'LLAYDI. Kalit so'zma-so'z ko'chirma emas — «hech kim yozmadi» xulosada yo'q.
> 🔴 **§102:** A va C — kundalik tasavvur (bot qidiruvda o'zi chiqadi degan taxmin); ikkalasi ham hook payoffi bilan ochiq rad etilgan, ya'ni darsni O'QIGANNI mukofotlaydi. Uzunlik: 43 · 38 · 37 (to'g'ri javob eng uzun emas, narvon yo'q) ✓. Savol 11 so'z ✓.
> 🔴 **§110:** mutlaq ohang («hech kim») bitta variantda ✓. **§133:** uchala variant bir qolipda («… — sabab») ✓.
> 🔴 **§127:** «birinchi yigirma» atamasi birorta variantda yo'q — kalit-so'z bilan topib bo'lmaydi ✓.

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** 👥 Xabarni 15 tanishga va 500 notanishga yubordingiz. Qaysi tomondan ko'proq odam yozadi?
- **A.** O'n beshtasidan — ular ko'rishib turadi ✅ *(39)*
- B. Besh yuztasidan — ularning soni ancha ko'p *(42)*
- C. Ikkala tomondan ham bir xil odam yozadi *(39)*

**Reveal:** To'g'ri — bir-birini har kuni ko'radigan odamlar orasida xabar o'zi tarqaladi; notanishlar orasida u bitta odamda qolib ketadi.

> 🔴 **§106/§129:** s4 da 12 · 40 · 300 sonlari bo'lgan; test YANGI sonlar beradi (15 va 500) va odam HARAKATINI so'raydi — ekrandan ko'chirib bo'lmaydi, qoida qo'llanadi. **§134 (son-echo):** to'g'ri variant savolning sonini takrorlaydi («O'n beshtasidan») — lekin B ham savolning ikkinchi sonini takrorlaydi, ya'ni son-echo tell bermaydi (ikkala tomon bir xil shaklda) ✓.
> 🔴 **§102:** B — s4 ③ halqasi ochiq rad etadi (300 odamdan 4 tasi); C — ishonarli, lekin s4 natijalari yolg'onga chiqaradi. Uzunlik: 39 · 42 · 39 (to'g'ri javob eng uzun EMAS ✓, tell 1.08).
> 🔴 **§99:** uchalasi ham «qaysi tomondan?» savoliga bir turdagi gap bilan javob beradi.
> 🔴 **§127:** «zich joy» birorta variantda yo'q ✓.

### TEST-3 (s7 — s6 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 🌍 Sayt bitta universitetda tez tarqaldi. Buning sababi nima?
- A. Saytni ko'rgan har kim ro'yxatdan o'ta olardi *(45)*
- B. Sayt birinchi kundan butun dunyoga ochilgan *(43)*
- **C.** Universitetdagilar bir-birini tanirdi ✅ *(37)*

**Reveal:** To'g'ri — sayt yopiq edi: faqat o'sha universitetdagilar kira olardi, va ular bir-birini tanirdi.

> 🔴 **§101 (keys-fakti bankda):** uchala variant ham bank matni bilan tekshirilgan — bank uch faktni beradi: sayt faqat bitta universitet talabalari uchun ochilgan; yopiq va kichik joyda uni «hammasi o'zinikilar» tez o'zlashtirgan; butun dunyoga esa ikki yildan keyin ochilgan. A va B — bankning O'ZI rad etadigan gaplar (§102: slayd-1 ularni ochiq yolg'onga chiqaradi) ✓.
> 🔴 **§106:** slayd-2 «sayt tez tarqaldi» faktini beradi, SABABNI aytmaydi — sabab reveal'da muhrlanadi.
> 🔴 Uzunlik: 45 · 43 · 37 (to'g'ri javob eng qisqa ✓, tell 1.22). Savol 8 so'z ✓.
> 🔴 **§122:** keys-raqami («ikki yil», «2004») bu savolga zo'rlab kiritilmagan — u bashorat-2 da o'z ma'nosida so'raladi.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 🧲 Bot havolasi bir kunda 900 notanish odamga yuborildi. Ertasiga nima ko'rinadi?
- A. Yigirmatadan ko'p odam ishlatadi — soni katta *(45)*
- **B.** Bir-ikki odam — qolgani ochib ko'rmagan ✅ *(39)*
- C. Hech kim yo'q — xabar umuman yetmagan *(37)*

**Reveal:** To'g'ri — katta joyda xabar ko'p odamga yetadi, lekin ochib ishlatadigan odam kam qoladi. Yigirmata odam zich joydan yig'iladi.

> 🔴 **§129/§133:** s4 yakun-kartasidan «katta joy» bandi ATAYLAB olib tashlangan (§133 — xulosa-bandi keyingi test kaliti bo'lmasin); bu qoidani o'quvchi s4 natija-qatorlaridan va s9 materialidan chiqaradi, ko'chirmaydi. Savolda YANGI son (900 — darsda yo'q).
> 🔴 **§102:** A — «odam ko'p bo'lsa natija ham ko'p» degan kundalik tasavvur, s4 ③ va s9 3-joyi rad etadi; C — s9 materiali rad etadi (1200 odam **eshitgan** edi, ya'ni xabar yetgan) — ikkalasi ham darsni O'QIGANNI mukofotlaydi.
> 🔴 **§110:** mutlaq ohang («Hech kim») bitta variantda ✓ · **§118:** cheklov-so'zi («faqat», «hech qachon») birorta variantda yo'q ✓.
> 🔴 **§127:** darsning atamasi («zich joy», «birinchi yigirma») birorta variantda yo'q — kalit-so'z to'g'ri javobga olib bormaydi ✓.
> 🔴 Uzunlik: 45 · 39 · 37 (to'g'ri javob eng uzun emas ✓, tell 1.22).

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan (✅ savol oldida turmaydi).

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — 1 · 2 · 3: yozilgani yashil ✓, joriysi indigo
miltillashda, kelgusi kulrang-punktir. Indikator o'quvchiga nechanchi joyni yozayotganini
aytadi — alohida yorliq kerak emas.

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida: joy nomi
maydoni → «kimlar bor» maydoni → son-maydoni (yonida «odam» so'zi) + jonli javob-qatori.
Uch joy uchun bir xil karta — bir shakl, uch marta.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI — faqat indikator chirog'i yonadi va pastda
yig'indi sanaladi; uchtasi ham yozilgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda).
Saqlangan qator ko'rinishi: `🏫 Sinfdoshlar guruhi → birga o'qiydiganlar → 12 odam`
(strelkali juftlik, s1 demo bilan bir shaklda — korpus §67d).

**Ipuchalar (92c/85 · korpus §32 · §115 bir tilda):** `«Qaysi joy?»` · `«U yerda kimlar bor?»` ·
`«Nechta?»` — hammasi qisqa savol; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q.
s1 demo-qatorlari ham placeholder'ga ko'chirilmaydi — o'quvchi o'z joylarini yozadi.

**106d javob (ikki tomonlama):** ✅ «Bu joydagi odamlarni siz o'zingiz taniysiz.» ·
🤔 «Bu hali javob emas. U yerda kimlar bor: sinfdoshlarmi, qo'shnilarmi, to'garakdagilarmi?»

**Umumiy-so'zlar ro'yxati** (106d(c), dars o'z lug'atidan): *hamma · odamlar · do'stlar ·
yoshlar · bolalar · hech kim*. O'quvchi «kim» qatoriga faqat shularni yozsa — savol
qaytariladi (bloklamaydi, yo'naltiradi).

**Katta-son sharti (yumshoq):** bitta joyda son 100 dan katta → hint «Ularning nechtasi
sizni taniydi?». Bu darsning ikkinchi yarmi: katta son o'zi natija bermaydi.

**Yig'indi-qatori (§131 · §94):** har saqlashdan keyin «Hozircha: n odam», uchtasidan keyin
«Jami: n odam». Yigirmadan kam bo'lsa bitta yo'naltiruvchi qator chiqadi va **saqlash
bloklanmaydi** — ✅-qatori tekshirilmagan narsani tasdiqlamaydi (§130: «yigirma yig'ildi»
deb yozilmaydi, chunki bu hali reja, natija emas).

**Kirish-artefakt YO'Q:** sarlavha ostida tasma ham, ko'prik-gap ham chizilmaydi — modul-chegara.

---

## 6. KEYS SPETSIFIKATSIYASI (s6 — K8 META · 33/56/100-qonun qolipi)

🔴 **Nima uchun K8 halol yopishadi:** bank-temalari aynan shu dars haqida —
*birinchi foydalanuvchilar · ishga tushirish yo'li · guruhlar · odam keladigan joylar*.
Zaxira ilgak kerak emas.

**Freym (91b):** eyebrow — **«👥 Biznes olamidan · Facebook»**. Keys ochiq freym bilan kiradi
(`PM_Prompt_v8` 1-blok) va oxirida ko'prik-gap bilan darsga qaytadi.

**Bosqich-hisoblagichi (17-ov b · uzluksiz):** eyebrow har bosqichda bitta hisoblagich bilan
turadi — «👥 Biznes olamidan · Facebook · 1/7» … «7/7». Bosqichlar: slayd-1 · bashorat-1 ·
slayd-2 · bashorat-2 · slayd-3 · slayd-4 · ko'prik-gap. Bashorat javobidan keyin hisoblagich
yo'qolmaydi, uzuq raqam qolmaydi (naqsh: `PmLesson9.jsx` s6).

🔴 **Jonli son-hisoblagichi YO'Q:** K8 bankda «raqamsiz» belgisi bilan turibdi — sanaladigan bank-raqami yo'q
(§101/§123). Bosqich-hisoblagichi esa progress-ko'rsatkichi, u raqam-taqig'i bilan
to'qnashmaydi (M4c-D6 da yopilgan masala).

**4 slayd (hikoya tilida — 42-qonun · faqat bank faktlari):**

1. **2004-yil.** Bitta universitetda oddiy sayt ochildi. Unga faqat o'sha universitet talabalari yozila olardi — boshqalar ro'yxatdan o'ta olmasdi.
2. *(bashorat-1 dan keyin)* Sayt tez tarqaldi: universitetdagilar uni «o'zimizniki» deb ishlata boshladi.
3. *(bashorat-2 dan keyin)* Keyin sayt boshqa universitetlarga ochildi — bittalab, joyma-joy.
4. Butun dunyoga sayt ikki yil o'tib ochildi. Bugun uni Facebook nomi bilan bilamiz. Bu voqeada odam soni emas — odamlarning bir-birini tanishi ish bergan.

**Bashorat-1 (2-slayddan oldin · 1-o'lchov: TARQALISH — yopiq joyda nima bo'ldi):**
**Savol:** «Sayt faqat bitta universitetda ochiq edi. Sizningcha, u yerda qanday tarqaldi?»
- «Sekin — har kim o'zi qidirib topdi» *(34)*
- «Tez — u yerda hamma o'ziniki edi» ✅ *(32)*
- «Tarqalmadi — odam soni kam edi» *(30)*

**Bashorat-2 (3-slayddan oldin · 2-o'lchov: VAQT — dunyoga qachon ochilgan):**
**Savol:** «Sayt butun dunyoga qachon ochilgan?»
- «O'sha yilning o'zida ochilgan» *(29)*
- «Ikki yildan keyin ochilgan» ✅ *(26)*
- «Bir necha oydan keyin ochilgan» *(30)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! …» — quyruqsiz; adashsa
«Adashdingiz — asl javob: …». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq
«🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — darsga qaytadi) — 🔴 ALOHIDA BOSQICH (7/7):**
> Facebook birinchi odamlarni butun dunyodan qidirmagan — bitta zich joydan boshlagan, keyin joyma-joy kengaygan. Sizda ham shunday joylar bor. Endi ularni o'zingiz yozasiz.

> 🔴 **§101 (fakt-halolligi, ikki qadamli tekshiruv):** **(a)** har slayd-gapi bank matni bilan yonma-yon qo'yildi — «2004 · faqat Garvard talabalari uchun · закрытая аудитория, "все свои" · университет за университетом · через два года — для всех · плотность важнее размера»: **hammasi bankda bor**, bankdan tashqari birorta fakt, raqam yoki nom qo'shilmadi. **(b)** slaydlar ketma-ket o'qildi — birinchisi keyingisini yolg'onga chiqarmaydi ✓. Saytni kim ochgani (asoschi) ham aytilmaydi — bank bu haqda jim, demak slayd-1 faqat bank sanagan narsani aytadi. Universitet nomi (Garvard) ekranda AYTILMAYDI: u darsga hech narsa qo'shmaydi va bola uchun begona nom (109-qonun TMI); bank uni talab qilmaydi.
> 🔴 **§122:** «ikki yil» bank bergan ma'noda ishlatiladi (dunyoga ochilish vaqti) va darsning ta'rifiga zo'rlanmaydi — «birinchi yigirma» ta'rifi keys-raqamiga tayanmaydi.
> 🔴 **§124 (chegaralangan inkor):** «Boshqalar ro'yxatdan o'ta olmasdi» — bank aynan shuni aytadi (sayt faqat o'sha universitet talabalari uchun ochilgan); undan kengroq inkor («hech kim bilmasdi», «reklama umuman yo'q edi») yozilmadi.
> 🔴 **Bashorat halolligi (17/43/64):** har bashorat bitta o'lchovning uch varianti; birinchisi ikkinchisining javobini ochmaydi (17-ov c ✓ — tarqalish tezligi ↔ dunyoga ochilish vaqti). Uzunlik: 34·32·30 va 29·26·30 (to'g'ri eng uzun emas ✓).
> 🔴 **§123 (bashorat-chipida izohsiz atama yo'q):** «universitet», «ro'yxatdan o'tish» — o'quvchiga tanish so'zlar; dars atamasi («zich joy») bashorat-variantlarida YO'Q.
> 🔴 **§132 (bashorat-slaydi javobni oldindan aytmasin):** slayd-1 saytning yopiqligini aytadi, TARQALISH haqida hech narsa demaydi — bashorat-1 ochiq qoladi; slayd-3 kengayishni aytadi, VAQTNI aytmaydi — bashorat-2 ochiq qoladi ✓.
> 🔴 **K8 farq-dalili (M1-D2 bilan):** M1-D2 bashoratlari «kimlar uchun ochilgan edi?» deb so'ragan va yakun-gapi «auditoriya kartasidagi "KIM" shunday aniq bo'lsin» bo'lgan. Bu yerda bashoratlar **tarqalish** va **vaqt** haqida, ko'prik-gap esa **joy** haqida. Slaydlarning bank-faktlari bir manbadan, lekin savol ham, xulosa ham boshqa (registr: K12 pretsedenti — bitta keys, besh burchak).
> 🔴 **Mentorga (`MentorNote`):** «"Facebook"ni bolalar o'zi aytadi — kutib turing, keyin 4-slaydni oching. "Bizda ham shunaqa bo'ladimi?" degan savol chiqsa: dars aynan shu haqda — sizning universitetingiz yo'q, lekin sinfingiz bor.»

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · KOMPILYATOR, sof JS)

**Darvoza-mashq (82e):** bitta savol-tanlov: «Uch joyda 13, 7 va 4 odam bor. Kod nima
chiqaradi?» → **«Jami: 24 odam · Yigirmata odam bor»** ✅ *(34)* / «Jami: 24 odam · Yana 4 odam
kerak» *(33)* / «Jami: 20 odam · Yigirmata odam bor» *(34)* — §129: uchala variant ham bir
turdagi chiqish-qatori, farq faqat ma'noda.

**Boshlang'ich kod (`yigirma.js` — kompilyator oynasida, qo'lda yoziladi):**

```js
// yigirma.js — birinchi yigirmani sanaydigan kod
// Ro'yxat s8 da yozgan uch joyingizdan to'ldirildi.
const joylar = [
  { joy: 'Sinfdoshlar guruhi', nechta: 12 },
  { joy: 'Togarakdagilar',     nechta: 6  },
  { joy: 'Qoshnilar',          nechta: 4  }
];

let jami = 0;

for (let i = 0; i < joylar.length; i++) {
  // 1) shu joy uchun bitta qator chiqaring: joy nomi va nechta odam
  // 2) jami ga shu joyning odam sonini qo'shing
}

// 3) jami 20 dan kam bo'lsa: 'Yana ... odam kerak'
//    aks holda:              'Yigirmata odam bor'
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda, xulq-atvorda tekshiriladi):**
1. Har joy uchun bitta qator chiqadi
2. Jami son chiqadi
3. Yigirmaga yetmasa, nechta odam kamligi chiqadi

**YORDAM (yechimni aytmaydi — korpus §77):** Bitta qatordan boshlang: `joylar[0].joy` ni
chiqarib ko'ring. Ishlagach, shu joyning sonini `jami` ga qo'shing.

**YULDUZCHA:** Eng ko'p odam beradigan joyning nomini alohida qatorda chiqaring.

> 🔴 **Sanoq-mosligi (22-qonun):** 20 — darsning bosh soni (s1 · s2 · s4 · s8 · s9 · uy-vazifa); kod ham aynan shu son bilan ishlaydi. Boshlang'ich ro'yxatdagi 12/6/4 — s1 demo-qatorlari bilan bir xil (o'quvchining o'z kaliti bo'lmasa shu turadi).
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`joylar` · `joy` · `nechta` · `jami` · `Togarakdagilar` · `Qoshnilar`): kodda apostrofsiz, prozada «to'garak», «qo'shnilar» (lug'at `tolov`/`bolaklar` pretsedenti).
> 🔴 **87-qonun:** massiv, obyekt maydoni, `for`, `if/else`, `console.log`, matn qo'shish — o'tilgan. `for…of`, `reduce`, shablon-satr, `sort` — talab qilinmaydi.
> 🔴 **18-ov (starter yashil emas):** boshlang'ich kod ishga tushsa hech qanday qator chiqmaydi — uchala shart ham qizil turadi.
> 🔴 **previewUrl YO'Q:** dars sahifa ko'rsatmaydi; natija faqat chiqish qatorlarida (kompilyator rejimi — R1 navbati).
> 🔴 **Pedagogik ulanish (87c):** mentor ochiq aytadi — s8 da yozgan uch joyingiz kodda ro'yxat bo'lib turibdi; `if` esa darsning o'z savoli: «yigirmaga yetdimi?».
> 🔴 **82(c):** panel (yo'riq + darvoza-mashq + «✅ Bajardim — jami chiqdi») CHAPDA, kod O'NGDA · **82(f):** sinf-holati o'quvchiga ko'rinmaydi.
> 🔴 **89-qonun:** takrorlash-yo'li (erkin rejim, matn-havola): «✓ Bu mashqni sinfda bajarganman — davom etish →».

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch joy-qatori CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi, oxirida «Jami: 22 odam» (18-qonun). 🔴 Demo raqamlari s4 va s9 raqamlaridan boshqa — ko'chirib olinadigan javob yo'q |
| **s12 REFLEKSIYA** | Sarlavha: «Uch joyingizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». Yozgach mukofot (106f-b) |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Botingizni birinchi bo'lib ishlatadigan yigirmata odam — birinchi yigirma.» · «Odamlar bir-birini har kuni ko'radigan joy — zich joy.» · «Zich joyda bitta odam aytsa, qolganlari eshitadi.» · «Birinchi odamlarni bot emas, siz olib kelasiz.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |
| **Bot-holati** | 🔴 §40: butun darsda bot **quriladigan** narsa; «botingiz ishlab turibdi», «botingizni oching», «havolangizni yozing» — **0** (92d) |

### 8-A. Quruvchiga — `SCREEN_INTENTS` va s4/s9 holat-mashinasi (qisqa)

| Ekran | intent | done-sharti (PRACTICE_BASE signali) |
|---|---|---|
| s0 | hook-vote | tanlov bosildi (payoff ochildi) |
| s1 | preview | animatsiya tugadi (avto) |
| s2 | compare-2 | ikkala karta kamida bir marta ochildi (`seen`, 46-qonun) |
| s4 | map-waves | uchala halqa ochildi **va** uchala hafta-tugmasi bosildi (yakun-karta ochilgach) |
| s6 | case-slides | 4 slayd o'tildi (2 bashorat belgilangan) |
| s8 | workshop-3 | 3/3 saqlandi (`pm-m5d2-yigirmata` yozildi) |
| s9 | funnel-20 | hisob 20 ga yetdi (nechta joy bosilganidan qat'i nazar) |
| s10 | compiler-check | «✅ Bajardim — jami chiqdi» (darvoza-mashq to'g'ri bo'lgach ochiladi) |
| s12 | reflection | bir qator yozildi |

**s4 holat-mashinasi:** `idle` → halqa bosilganda `ring(i)` ochiladi (qator chiqadi va qoladi)
→ uchalasi ochilgach `mapDone` (savol-karta ochiladi) → `week(1|2|3)` (~6 s, nuqtalar navbat
bilan yonadi) → `result(1|2|3)` (natija-qatori; tugma «bosildi» holatiga o'tadi) → uchalasi
bosilgach `done` (yakun-karta + `Inner Circle!`). `prefers-reduced-motion`: hafta-animatsiyasi
o'rniga natija bir zumda chiqadi. Holat `pm-m5d2-halqa` ga yoziladi (F-0730-01 progress-saqlov:
qayta kirganda `done` bo'lsa yakun-karta ochiq turadi).

**s9 holat-mashinasi:** `idle` → joy bosilganda `run(i)` (uch qadam ketma-ket: eshitdi → ochdi →
ishlatdi, har qadam ~0,6 s) → `added(i)` (hisob yangilanadi + sabab-qatori) → hisob ≥ 20
bo'lgunicha davom → `strip` (bosilgan joylar bir qatorda) + yakun-qatori. Birinchi kam
natijali joydan keyin YORDAM chipi ochiladi (bir marta). Bosilgan joylar va hisob
`pm-m5d2-quvur` ga yoziladi. Bosilgan joy qayta bosilmaydi (tugma «bosildi» holatida qoladi).

**s6 keys-slaydlari:** eyebrow «👥 Biznes olamidan · Facebook · n/7» (uzluksiz bosqich-hisoblagichi
— 17-ov b) · slayd-1 → bashorat-1 (savol + 3 variant) → natija-qatori → slayd-2 → bashorat-2 →
natija-qatori → slayd-3 → slayd-4 → **ko'prik-gap alohida bosqichda** (slayd-4 = 152, ko'prik =
171; birga chiqsa 323 bo'ladi va 400 dan oshmaydi — lekin ko'prik darsga qaytish gapi bo'lgani
uchun alohida bosqichda turadi, M4c-D6 naqshi).

### 8-B. 🔴 TAQIQ-SO'ZLAR — bu darsning O'Z ro'yxati (har biri: **bu darsda 0**)

> Linter bilmaydigan, faqat M5-D2 ga tegishli residue-greplar. Qurishdan keyin
> `npm run lint:til src/5-Modull/PmLesson19.jsx` (0 error) bilan birga yuritiladi.

**(a) Marketing-jargoni** — hodisa tilida aytiladi, ekranda **0**:
`growth` · `growth hacking` · `funnel` · `voronka` · `konversiya` · `CAC` · `retention` ·
`traffic` · `trafik` · `target` · `targetlash` · `promo` · `reklama` · `auditoriya` ·
`segment` · `kogorta` — **bu darsda 0** (o'rniga: «joy», «odam», «eshitdi/ochdi/ishlatdi»).

**(b) Omonim-xavfi (§105/§121)** — o'quvchi matnida **0**:
`kanal` (Telegramda boshqa narsa; kod-kalitida `kanallar` qoladi) · `signal` (5-modulda
`trigger`, M4c-D6 da o'lchagich xabari — uchinchi ma'no qo'shilmaydi) · `zichlik` (yasama ot;
faqat «zich joy») · `tarmoq` (mavhum) — **bu darsda 0**. 🔴 **«halqa» — faqat s4 xaritasining
shakli:** s10 koding ekranida `for` «halqa» deb ATALMAYDI (bir so'z — bir ma'no, §121).

**(c) Kelajak-dars atamalari (29-qonun)** — **0**:
`qaytish` · `qaytdi` · `metrika` · `DAU` (m5-11) · `intervyu` · `savol shabloni` va m5-08 ning
jonli-suhbat atamalari · `PRD` (m6-02) · `A/B` (m7-08) — **bu darsda 0**.

**(d) Eski `-v16` merosi** (`PmLesson19.jsx:19–24`) — **0**:
`sovuq start` · `og'izdan-og'iz` · `spam` · `5 ta pulsiz kanal` · `shaxsiy taklif quruvchi` ·
`oltin 20` — **bu darsda 0**.

**(e) Boshqa dars metaforalari (38-qonun)** — **0**:
`Botjon` · `kalit` (token ma'nosida) · `qoidalar varag'i` · `to'xtamaydigan aylana` (m5-01) ·
`o'lchagich` · `chegara` · `chin/quruq` (m4c-06) · `lenta` (4c) — **bu darsda 0**.

**(f) Umumiy lug'at-taqiqlari** — bu ro'yxat senariyda **takrorlanmaydi**: uni `til-lint` ning
`error` darajasidagi 49 qoidasi to'liq qamraydi (og'ir so'zlar, tibbiyot-metaforalari, «sir»,
inglizcha-sifat so'zlari, buyruqsiz chorlov, ichki-atama nomlari va boshqalar). Darvoza:
`npm run lint:til src/5-Modull/PmLesson19.jsx` → **0 error** shart. Senariy faqat linter
BILMAYDIGAN so'zlarni sanaydi — (a)–(e) va (g)–(h) bandlari.

**(g) §40/§81 darvozasi** — **0**:
`botingiz ishlab turibdi` · `botingizni oching` · `havolangiz` · `tokeningiz` ·
`botingizning nomi` — **bu darsda 0** (bot hali qurilmagan).

**(h) §97 yakka-rejim** — o'quvchi matnida **0**:
`ko'pchilik` · `sinf` (jonli sinf ma'nosida) · `ovozlar` · `hammamiz` — **bu darsda 0**
(«sinfdoshlar guruhi» — o'quvchining o'z odamlari, boshqa ma'no; u qoladi).

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s · to'g'ri indekslar 0,3,2,1 · 1,0,2,3 · 0,2,1,3)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.

| # | Savol (qisqa) | To'g'ri idx | Manba |
|---|---|---|---|
| 1 | Birinchi yigirma nima? | 0 | s2 |
| 2 | Botga birinchi odamlarni kim olib keladi? | 3 | s2 |
| 3 | Zich joyda xabar nega tez tarqaladi? | 2 | s4 |
| 4 | Uch halqadan qaysi biri eng ko'p odam berdi? | 1 | s4 |
| 5 | Katta guruhda odam ko'p — nega ishlatgani kam? | 1 | s9 |
| 6 | Xabar qaysi joydan tez tarqaladi? | 0 | s4/s9 |
| 7 | Odam botga kelguncha qaysi uch qadamdan o'tadi? | 2 | s9 |
| 8 | Facebook 2004-yilda saytni qayerda ochgan? | 3 | s6 |
| 9 | Facebook butun dunyoga qachon ochilgan? | 0 | s6 |
| 10 | Facebook voqeasida nima ish bergan? | 2 | s6/s7 |
| 11 | Zich joy qanday joy? | 1 | s4 |
| 12 | Uchta joy yozganda har joyda nimalarni yozasiz? | 3 | s8 |

> 🔴 **§117 (metafora-so'z ballanadigan matnda tug'ilmaydi):** «zich» arenaga s4 yakun-kartasidan keyin keladi — dars ichida ochilgan ✓.
> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q — «growth», «funnel», «retention», «konversiya», «kanal» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «joy», «odam», «zich», «eshitdi/ochdi/ishlatdi» so'zlari bilan.
> 🔴 **§114:** arena-fon/dekor so'zlari shu dars lug'atidan (joy · odam · zich · halqa · yigirma) — 5-modulning texnik so'zlari (kalit, aylana, buyruq) fonga chiqmaydi.
> 🔴 **§134:** birorta savolda rang-holatiga tayangan variant yo'q (bu darsda rangga ma'no berilmagan).

🔴 **Arena-yozish sharti (metodist · 16-ov + §99/§110/§127 — quruvchiga majburiy):** har variant
savolning O'Z shaklida javob bersin va dars atamasi yo hech birida, yo kamida ikkitasida tursin.
Joy-turi so'ralgan savolda variantlar **2/2** yoziladi (farq SABABda qoladi); atamaning o'zi
so'ralgan savolda esa **to'rttasi ham** shu atama bilan boshlanadi — bo'sh to'ldiruvchi variant
o'ylab topilmaydi va birorta distraktor darsda ham, hayotda ham rost gap bo'lmaydi. Ikki eng
xavflisi shu yerda to'liq yozildi, qolgan 10 tasi shu qolipda:

**Q6 (to'g'ri idx 0)** — «Xabar qaysi joydan tez tarqaladi?»
- **«Har kuni ko'rishadigan joydan — ular bir-biriga aytadi»** ✅ *(54)* · «Har kuni ko'rishadigan joydan — odam soni ko'p» *(46)* · «Bir-birini tanimaydigan joydan — odam soni ko'p» *(47)* · «Bir-birini tanimaydigan joydan — ular bir-biriga aytadi» *(55)*
- 2 «har kuni ko'rishadigan» / 2 «tanimaydigan» — bola joy-nomini emas, SABABni tanlaydi (§107); to'g'ri javob eng uzun EMAS (54 < 55) ✓; har noto'g'ri sababning yolg'onligi s4/s9 da ochiq ko'rsatilgan.

**Q11 (to'g'ri idx 1)** — «Zich joy qanday joy?»
- «Zich joy — eng ko'p odam yig'iladigan joy» *(41)* · **«Zich joy — odamlar har kuni ko'rishadi»** ✅ *(38)* · «Zich joy — odamlar bir-birini tanimaydi» *(39)* · «Zich joy — xabar o'zi tarqalmaydigan joy» *(40)*
- To'rttala variant ham «Zich joy qanday joy?» savoliga javob beradi (§99) va atama to'rttasida ham turadi (§127) — kalit-so'z bilan topib bo'lmaydi; to'g'ri javob eng qisqa (tell 1.08). Birinchi distraktor darsning eng keng tarqalgan xatosini («ko'p = zich») ushlaydi, qolgan ikkitasi darsda ochiq rad etilgan (§102) va hech biri hayotda ham rost gap emas.

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Inner Circle!** | Uch halqani ochib solishtirdingiz | 33 | s4: uchala halqa va uchala hafta bosildi, yakun-karta ochildi |
| **Twenty Plan!** | Uchta joyni odam soni bilan yozdingiz | 37 | s8: 3/3 saqlandi |
| **Full House!** | Yigirmata odamni yig'ib bo'ldingiz | 34 | s9: hisob 20 ga yetdi |
| **Head Count!** | Kodingiz uch joyni sanab berdi | 30 | s10: uchala shart bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 30–37 belgi ✓.
> 🔴 **§100 (omonim-tekshiruvi):** «Inner Circle», «Twenty Plan», «Full House», «Head Count» — kursning texnik lug'atida (sichqoncha, tugma, konsol, port, klaviatura, massiv, funksiya) boshqa ma'no bermaydi ✓ (❌ «Pipe Master» — `pipe` texnik atama, rad; ❌ «Channel King» — kanal-omonimi, rad; ❌ «Node Finder» — `node` texnik atama, rad).
> 🔴 **§133/§93 (tasdiq faqat REAL tekshirilgan ishni aytadi):** «solishtirdingiz» (s4 da uchala natija ko'rildi — bu holat mexanikada tekshiriladi), «yozdingiz» (s8 3/3), «yig'ib bo'ldingiz» (s9 hisob 20), «Kodingiz uch joyni sanab berdi» (s10 chiqishida uch qator + jami). Birortasi ham «to'g'ri tanladingiz» demaydi — s9 da xato tanlov ham bo'lishi mumkin, nishon esa yakunga beriladi.

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Birinchi yigirma nima? | Botingizni birinchi bo'lib ishlatadigan yigirmata odam |
| 2 | Zich joy nima? | Odamlar bir-birini har kuni ko'radigan joy |
| 3 | Zich joyda xabar nega tez tarqaladi? | Bittasi aytsa, qolganlari eshitadi |
| 4 | Katta guruhda odam ko'p — nega ishlatgani kam? | Ular sizni tanimaydi |
| 5 | Botga birinchi odamlarni kim olib keladi? | Siz aytasiz — bot o'zi olib kelmaydi |
| 6 | Bitta joy haqida nimalarni yozib qo'yasiz? | Joy nomi, u yerda kimlar borligi va odam soni |
| 7 | Odam botga kelguncha qaysi uch qadamdan o'tadi? | Eshitdi, ochdi, ishlatdi |
| 8 | Facebook sayti qayerdan boshlangan? | Bitta universitetdan — boshqalar yozila olmasdi |
| 9 | Facebook butun dunyoga qachon ochilgan? | Ikki yildan keyin |
| 10 | Facebook voqeasida nima ish bergan? | Odam soni emas, odamlarning bir-birini tanishi |

> 🔴 **Korpus §20/§52📌:** 1-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil; 2-karta ham s4 yakun-kartasi bilan so'zma-so'z.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **§76/§132:** birorta kartada tarjimasiz chet so'z yo'q; o'rgatilmagan inglizcha nom so'ralmaydi (bu darsda inglizcha juftlik YO'Q — «birinchi yigirma» va «zich joy» o'zbekcha atamalar, chet so'z-juftligi kerak emas).
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ta'rif · zich joy · tarqalish · katta joy · kim olib keladi · artefakt tarkibi · uch qadam · keys 3 fakti).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Birinchi odamlarni siz olib kelasiz»** — (1) kanonik ta'rif so'zma-so'z: «Botingizni birinchi bo'lib ishlatadigan yigirmata odam — birinchi yigirma» · (2) bot o'zi odam olib kelmaydi: har biriga siz aytasiz · (3) sinfga savol
**s5 · «Zich joy ko'p odam beradi»** — (1) kanonik ta'rif so'zma-so'z: «Odamlar bir-birini har kuni ko'radigan joy — zich joy» · (2) zich joyda bitta odam aytsa, qolganlari eshitadi · (3) savol
**s7 · «Facebook bitta joydan boshlagan»** — (1) 2004-yil: sayt faqat bitta universitet uchun ochiq edi · (2) butun dunyoga ikki yildan keyin ochildi · (3) savol
**s11 · «Katta joy odam bermaydi»** — (1) katta joyda xabar ko'p odamga yetadi, ochib ishlatadigani kam · (2) yigirmata odam ikki-uchta zich joydan yig'iladi · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** s7 kartasi «Facebook» deb ataladi, «K8» emas.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys — **K8**, M5 modulida birinchi marta (modul-ichi qoidasi, registr 4-bo'lim) ✓; bankdan tashqari fakt/raqam/nom **0** ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — m4c-06 signal-saralash · m4c-02 haftaga-sig'dirish · m4b-02 nosozlik-navbati · **M5-D2 joy-quvuri (uch qadam, yigirmagacha)** ✓
7. Sensirash — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): o'quvchining o'z Telegram-boti — s0 dan s15 gacha; keys (s6) ham shu ipga qaytadi ✓
- 95 (Toshkent o'smiri): sinfdoshlar guruhi, to'garak, qo'shnilar — o'smir o'zi boradigan joylar ✓
- 96c: ip modul-loyihasida; to'qnashuv-grep shapkada ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m4c-06 VS Code → m5-02 kompilyator) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat M2–M4 materiali (massiv · `for` · `if` · `console.log`) ✓
- 29 (kelajak-atama oqmaydi): «qaytish», «metrika», «intervyu», «PRD», m5-08/m7 atamalari o'quvchi matnida **0** ✓
- 33/56/100: keys-ekranda 2 bashorat, ikki o'lchov (tarqalish · vaqt); natija asl javobni aytadi; «ball emas» va hook-echo yo'q ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 104/§119: hook ikki tanlovi teng (49 ↔ 47), payoff hech birini yolg'onga chiqarmaydi ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (s4 va s8 da 1 gap) ✓
- 92d/§81: majburiy maydonlar faqat o'quvchida ANIQ bor ma'lumot uchun (joy, kimlar, son); bot havolasi/tokeni HECH QAYERDA so'ralmaydi ✓
- 88: navbat-to'lqini — s4 uch halqa → uch hafta-tugmasi; s9 to'rt joy; testda javobgacha yo'q ✓
- 89: koding takrorlash-yo'li erkin rejimda ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN §99–134 o'qildi):**
1. **§20/§80/§85:** «birinchi yigirma» va «zich joy» — yagona nomlar, kanonik ta'riflar 4 yuzada so'zma-so'z ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 «nechta odam + sabab» · T2 «kimdan + sabab» · T3 «sabab» · T4 «nima ko'rinadi + sabab») ✓
3. **§102:** distraktorlar ekranda rost bo'lib qolmaydi — T1-A/C hook payoffi, T2-B s4 ③ halqasi, T4-A/C s9 materiali rad etadi ✓
4. **§105/§121:** «joy» faqat odam-joyi ma'nosida · «zich» faqat joy haqida · «kanal» va «signal» o'quvchi matnida 0 (omonim-xavfi 8-B(b) da qayd etildi) ✓
5. **§106/§129:** T1 vaziyat-qo'llash · T2 yangi sonlar · T3 sabab-savoli · T4 yangi son (900) — hech biri xulosa-ko'chirma emas ✓
6. **§107:** ha/yo'q-savol yo'q; s9 joylari 2/2; arena Q6 2/2, Q11 — to'rttala variant bir turda ✓
7. **§108:** hech bir savol rostni rad ettirmaydi ✓
8. **§109:** ikkala bosh ta'rif ham zamon-iborasi bilan («birinchi bo'lib ishlatadigan», «har kuni ko'radigan») ✓
9. **§110:** mutlaq so'z bir variantdan oshmaydi (T1 «hech kim», T4 «Hech kim» — har testda bittadan); kulgili-bo'sh variant yo'q ✓
10. **§111:** «degan javob» 0 ✓
11. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi uchala hafta bosilgach; s9 savoli uchinchi joy ochilgach) ✓
12. **§114:** arena-dekor so'zlari shu dars lug'atidan ✓
13. **§115:** ipuchalar bir gap-turida (uchala qisqa savol); uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?») ✓
14. **§116:** s9 YORDAM-savoli ikkala o'lchovni qamraydi (taniydimi + necha marta ko'rishadi) ✓
15. **§117:** metafora-so'z ballanadigan matnda tug'ilmaydi («zich» s4 yakun-kartasida ochiladi, keyin arenada) ✓
16. **§118:** distraktorlarda cheklov-so'zi umuman yo'q ✓
17. **§119:** hook payoffi hech bir tanlovni yolg'onga chiqarmaydi ✓
18. **§120:** s9 har joy kartasida bosishdan oldin uchala ma'lumot bor (nom · son · odamlar qanchalik tez-tez ko'rishadi) ✓
19. **§122/§124:** keys-raqami («ikki yil») bank bergan ma'noda; inkor chegaralangan («boshqalar ro'yxatdan o'ta olmasdi» — bank aynan shuni aytadi) ✓
20. **§123:** demo-namuna (s1) darsning o'z qoidasiga bo'ysunadi; bashorat-chipida izohsiz atama yo'q; jonli son-hisoblagichi yo'q (bankda raqam yo'q) ✓
21. **§125:** s1 natijani NOMLAYDI, kashfiyotni ko'rsatmaydi ✓
22. **§126:** bosh atama s1 da yo'q — s2 da tug'iladi; ikkinchi atama s4 da ✓
23. **§127:** har scored-savolda dars atamasi yo yo'q (T1–T4), yo ≥2 variantda (arena Q11) ✓
24. **§128:** shart-yorliqlari darak gapda («Har joyda odam soni bor», «Har joyda kimlar borligi aniq»); s1 namunasi s8 ning uchala shartidan o'tadi ✓
25. **§130:** checklist mezoni MA'NOni so'raydi («Har joyda kimlar borligi aniq»), ✅-qatori tekshirilmagan narsani tasdiqlamaydi (yigirma yig'ilgani tasdiqlanmaydi — u hali reja) ✓
26. **§131:** yig'iladigan natija har qadamda sanaladi (s8 «Hozircha: n odam», s9 «Yig'ildi: n / 20») ✓
27. **§132:** artefakt-nomi omonimi tekshirildi («joy» mashq-materialida boshqa ma'noda yo'q); «yo… yo…» qurilmasi yo'q; bashorat-slaydi javobni oldindan aytmaydi ✓
28. **§133:** test variantlari bir tinish-qolipda; s4 xulosasidan keyingi test kaliti bo'ladigan band olib tashlandi; nishon-desc faqat real tekshirilgan ishni aytadi ✓
29. **§134:** rang-holatiga tayangan variant yo'q (rangga ma'no berilmagan); test-kalitida savol soni tell bermaydi (T2 da ikkala tomon ham savolning sonini takrorlaydi); senariy taqiq-so'zi §112 ko'prigidan kuchli — 5-modulning `signal` ko'prigi (BotIntro lug'ati) TAQIQ bo'lgani uchun ishlatilmadi, uning o'rniga «xabar» so'zi turadi ✓
30. **§97:** «ko'pchilik / sinf / ovozlar» o'quvchi matnida 0 ✓ · **§69:** modul-chegara — «topilmadi / saqlanmagan» 0 ✓
31. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo-qator (s1) · 2 karta (s2) · 3 halqa + 3 hafta (s4) · 4 slayd + 2 bashorat (s6) · 3 joy (s8/s12/uy-vazifa/koding) · 4 joy + 3 qadam (s9) · 3 shart (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator · **20** — darsning bosh soni, hamma ekranda bir xil ✓
32. **Ekran-prozalari (Intl.Segmenter bilan o'lchandi):** s0 287 · s1 158 · s2 254 · s4 295 · s6 slayd-1 140 · slayd-2 77 · slayd-3 65 · slayd-4 152 · ko'prik 171 · s8 87 · s9 145 · s10 114 · s12 205 · uy-vazifa 126 grapheme (chegara 400) ✓ · variant-telllari T1 1.13 · T2 1.08 · T3 1.22 · T4 1.22 · bashorat 1.13/1.15 · arena Q6 1.20 · Q11 1.08 · hook 1.04 ✓

**Lint natijasi:** `node til-lint.mjs pm-senariylar/M5-D2-BirinchiYigirma.md` — **0 error · 4 warn**.
Ikkala warn-sinfi ham faqat **senariy-annotatsiyasida**, o'quvchi matnida emas:
**(1)** `yadro-jargon` ×2 — `PM_Prompt_v8` ning majburiy «BLOK 3: YADRO» sarlavhasi va
ekran-ro'yxatidagi blok-nomi (ekranga chiqmaydi); **(2)** `kirill-lotin-matnda` ×2 — K8 bank-matnining
asl ruscha iqtiboslari (§101 dalili: shapkadagi farq-dalili va 6-bo'limdagi fakt-tekshiruvi).
Iqtiboslar ataylab qoldirildi — ular bank-sadoqatini tekshiradigan yagona asl manba; qolgan
oltita ruscha parcha o'zbekchaga o'girildi. **O'quvchi matnida kirill harf 0.**
`node prompt-lint.mjs` — **0 topilma**.

---

## 14. ⏳ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq savollar)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi. Bosh-agent avto-GATE S bilan yopishi mumkin.

1. 🔴 **DARS SARLAVHASI VA SUB (`App.jsx` `m5-02`).** Hozir: title «Birinchi foydalanuvchilar» · sub «pulsiz 20 ta foydalanuvchi qanday?» — sarlavha o'quvchi-savoli emas (29-qonun), sub esa g'aliz («qanday?» tugallanmagan) va «pulsiz» darsda umuman ishlatilmaydi. **Taklif:** title → **«Botingizni birinchi kim ochadi?»** · sub → **«yigirmata odam qayerdan keladi»**. Tasdiqlaysizmi?

2. 🔴 **BOT HALI YO'Q — «BOTINGIZ» SO'ZINING SHAKLI (§40/§81).** m5-02 modulning 2-darsi: o'quvchi faqat «Bot nima» (m5-01) ni o'tgan, BotFather/token keyinroq. Senariy buni shunday hal qildi: **(a)** s1 bir marta ochiq aytadi — «Bu modulda botingizni qurasiz»; **(b)** butun darsda bot **quriladigan** narsa, hozirgi zamon buyruqlari («botingizni oching») **0**; **(c)** so'raladigan yagona narsa — o'quvchi allaqachon biladigan odamlar, ya'ni artefakt botsiz ham to'liq yoziladi; **(d)** hook o'quvchida BOR narsadan so'raydi (u ishlatadigan botlar). Shu yechim tasdiqlanadimi — yoki modul-ipini «botingiz» emas, «shu modulda quradigan botingiz» deb har ekranda to'liq aytish kerakmi (109-qonun TMI xavfi bor)?

3. 🔴 **ARTEFAKT KOD-KALITI `kanal` ↔ O'QUVCHI SO'ZI «joy».** Shakl bosh-agent muhri bilan o'zgarmadi: `pm-m5d2-yigirmata = { kanallar: [{ kanal, kim, nechta } × 3], savedAt }`. Lekin o'quvchi matnida «kanal» **ishlatilmaydi** — Telegramda kanal boshqa narsa (obuna lentasi), bola «sinfdoshlar guruhi — kanalmi?» degan savolda qoladi (§121). Ekranda hamma joyda **«joy»** turadi; kod-kaliti `kanal` bo'lib qoladi (`tolov`/`bolaklar` pretsedenti: ASCII kod-nomi ↔ o'quvchi so'zi ajratiladi). Shu ajratma tasdiqlanadimi — yoki kalit ham `joylar: [{joy, kim, nechta}]` ga o'tsinmi?
   🔴 **Ikki tomonlama shart (F-0803-22-B), m5-08 senariysi bilan solishtirildi:** m5-08 senariysi (`pm-senariylar/M5-D8-…` fayli) shu kalitning `kanallar[].kim` ustunini **suhbatdosh nomi** sifatida o'qiydi (zaxira-nom «sinfdoshingiz»). Bu darsda `kim` — **o'sha joyda kimlar borligi** (masalan «birga o'qiydiganlar», «bir ko'chadagilar»), ya'ni guruh nomi; m5-08 yorlig'ida u «suhbatdosh: birga o'qiydiganlar» bo'lib o'qiladi — ma'no buzilmaydi, lekin bosh-agent ikki senariyni bir o'qishda solishtirib tasdiqlashi kerak. Yana bir band: m5-08 shapkasi «m5-02 hali `-v16` avlodda va kalitni YOZMAYDI» deb yozilgan — bu senariy qurilgach kalit **yoziladi**, demak m5-08 ning jim zaxira-tarmog'i kamdan-kam ishlaydi (nuqson emas, faqat holat o'zgaradi).

4. 🔴 **BOSH ATAMALAR: «BIRINCHI YIGIRMA» + «ZICH JOY».** «Birinchi yigirma» — modulning o'z soni (20+ real foydalanuvchi) va artefakt nomi bilan bir xil; «zich joy» — o'smirga jismonan tanish so'z («avtobus zich»), yasama otga aylanmaydi. Muqobillar rad etildi: «kanal» (omonim), «doira» (musiqa asbobi omonimi), «tor auditoriya» (chet so'z + M1-D2 ning burchagi), «yopiq joy» (uy-ichi ma'nosi). Rozimisiz?

5. 🔴 **K8 BURCHAGI M1-D2 DAN FARQLI (♻️ takroriy keys).** M1-D2 (`PmLesson1`) K8 ni «auditoriya kartasidagi KIM» burchagida ishlatgan (bashorat: «kimlar uchun ochilgan edi?»). M5-D2 esa **«qayerdan va nega bitta joydan»** burchagini oladi; ikkala bashorat ham boshqa o'lchovda (tarqalish tezligi · dunyoga ochilish vaqti), ko'prik-gap ham boshqa (auditoriya kartasi emas, o'quvchining joylari). Universitet nomi (Garvard) ekranga chiqarilmadi — u darsga hech narsa qo'shmaydi (109-qonun). Bu farq yetarlimi — yoki keys butunlay boshqa slayd-to'plami bilan qayta yozilsinmi?

6. 🟡 **s9 «JOY-QUVURI» — MAQSADGA YIG'ISH MEXANIKASI.** TEKSHIRUV yo'lakchasi «kanal-funnel» edi; senariy uni shunday ochdi: to'rt joy, har birida uch qadam (eshitdi → ochdi → ishlatdi), o'quvchi 20 ga yetguncha joy tanlaydi. Hech narsa baholanmaydi/tartiblanmaydi/yo'naltirilmaydi — bu band mexanikalardan farqi 5-blok izohida hujjatlangan. Registr-nomi **«JOY-QUVURI»** bo'lib muhrlansinmi?

7. 🟡 **KODINGDA `for` HALQASI.** Kompilyator navbati (R1) va sof JS sharti bajarildi; kod faqat o'tilgan material bilan yoziladi: massiv, obyekt maydoni, `for (let i = 0; …)`, `if/else`, `console.log`. `for…of`, `reduce`, shablon-satr ATAYLAB ishlatilmadi (87a). Muqobil: kodni umuman halqasiz qilish (uch qatorni qo'lda yozdirish) — lekin unda «ro'yxat bo'ylab yurish» g'oyasi yo'qoladi. Hozirgi shaklni tasdiqlaysizmi?

8. 🟡 **DEMO-RAQAMLAR TIZIMI.** s1 demo 12/6/4 (jami 22) · s4 xaritasi 12/40/300, natijalar 17/8/4 · s9 quvuri 13+7=20, 2 va 1 · testlar 15/500 va 900 · koding 20. Hammasi demo-qiymat (bank-fakti EMAS), bir tizimda va bir-birini takrorlamaydi (22-qonun; §106 — testdagi sonlar ekrandan ko'chirilmaydi). Tasdiqlaysizmi?

9. 🟡 **UY-VAZIFA — YIGIRMATA ISM.** To'liq variant: uch joydan ismma-ism yozib, jami yigirmata ism. Qisqa variant: bitta zich joydan yettita ism. Hech kimning telefoni, havolasi yoki ma'lumoti so'ralmaydi — faqat o'quvchining o'z ro'yxati (§81/92d). Rozimisiz?

10. 🟢 **s4 XARITASIDA REAL EMAS, DEMO ODAMLAR.** Halqalardagi 12/40/300 — demo sonlar; o'quvchining o'z odamlari faqat s8 da yoziladi. Ixtiyoriy kuchaytirish: s4 ning 1-bosqichida o'quvchi har halqaga o'z sonini kiritsin (shaxsiylashadi, lekin 2-bosqich natijalari solishtirib bo'lmaydigan bo'lib qoladi). Hozirgi (demo xarita) qolsinmi?

11a. 🟡 **s9 YAKUN-QATORI BOSILGAN JOYLARGA BOG'LIQ (metodist-korrektura bandi).** To'rt joyning jami natijasi 23 (13+7+2+1), maqsad esa 20: o'quvchi to'rttasini ham bosib 23 ga chiqishi mumkin, ya'ni «yigirma ikkita joydan yig'ildi» degan qat'iy gap har yo'lda rost bo'lmaydi (§94 — holat-matni ekranda sodir bo'lgan narsani aytadi). Matn yo'l-neytral shaklga o'tkazildi: «Yigirmata odamni ikkita joy berdi: sinfdoshlar guruhi 13, to'garakdagilar 7…». Quruvchiga savol: shu qat'iy matn qolsinmi, yoki yakun-qatori bosilgan joylar ro'yxatidan **dinamik** yig'ilsinmi (u holda qolip: «N odam M joydan yig'ildi: …»)?

11. 🟢 **«FACEBOOK» NOMI EKRANDA.** K8 real keys bo'lgani uchun kompaniya nomi 4-slaydda aytiladi (M1-D2 pretsedenti). Meta/Facebook nomi bilan bog'liq boshqa hech narsa (egasi, daromadi, bugungi holati) aytilmaydi — `PM_Prompt_v8` ning «mashhur shaxslar — faqat mahsulot qarorlari uchun» bandi. Rozimisiz?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (§99–134 bilan) · MATN_ETALONI (lug'at + 7-B) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2 Batch 4 pasporti/R3) bo'yicha yozildi. Keyingi qadam: pm-metodist SENARIY-KORREKTURA → **[GATE S]** — 14-bo'lim savollari (1–11).*
