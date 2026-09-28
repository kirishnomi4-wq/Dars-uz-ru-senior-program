# 🔎 SENARIY — M2-D3 «Muammoni qanday topamiz»

> Bu hujjat — GATE S ga chiqadigan SENARIY. Kod emas. Qurilish `pm-quruvchi` roliga o'tadi.
> Holat: YOZILDI (2026-09-28) → pm-metodist korrekturasi KUTILMOQDA → **[GATE S]**.
> Manba: v9 dasturi (`CoddyCamp_Senior_2026_v9_14modul .html`), 3-modul · 3-dars: «Как искать проблему
> (М7 dan ko'chirilgan) — Kuzatuv, og'riq, frustratsiya; otzivlar, forumlar · Natija: Atrofdan 10 muammo + baho».
> Qonun-manbalar: `PM_Prompt_v8.md` (9 blok) · `PM_DARS_ETALON.md` (33 · 43 · 47 · 48/80 · 62 · 73 · 85 · 87 ·
> 91 · 92 · 94 · 95 · 96 · 100) · `DARS_ETALON.md` (5.8 · 108 · 109 · 111 · 151 · 156 · 159) · `MATN_KORPUS.md`.
> Format-namuna: `M2-D2-Muammodan-yechimga.md` (bir modulli qo'shni dars) + `M5-D11-Qaytish.md` (FARQ-DALILI qatorlari).

---

## 0. SHAPKA

```
=== DARS ===
MODUL: 2 — «Sistemalar qanday o'ylaydi» (v9 dasturida 3-modul)
DARS: 3 — m2-02 PmLesson4 «Muammodan yechimga» dan KEYIN, m2-03 JsVarsLesson dan OLDIN
      (taklif: fayl src/2-Modull/PmMuammoIzlash.jsx · kalit m2-16 · n: 3 — ⚠️ GATE S 1-savol)
DARS_MAVZUSI: Muammoni qanday topamiz — kuzatuv, sharhlar, chatdagi savollar va muammoga baho
TUR: 2-TUR (sof PM — o'quvchi O'Z artefaktini YOZADI: 10 muammo + har biriga ikki baho)
ISHLATILGAN_KEYS: K4 (AIRBNB — havo-matras boshlanishi) · M2 modulida birinchi marta ✓
LESSON_ID: pm-m2d3-v1 · storage prefiksi pm-m2d3-
TAYMING: 5+2+26+16+6+10+5+4+8 = 82 daqiqa + 8 bufer = 90
EKRAN SONI: 19 (s0…s18) · scored: 4 (3 module-mikro + 1 final) + arena
```

| Maydon | Qiymat |
|---|---|
| **Bosh keys** | 🏠 **K4 · AIRBNB** — bank: 2007, San-Fransiskoda anjuman, mehmonxonalar to'lgan, asoschilar o'z uyidagi uchta havo-matrasni ijaraga bergan · **raqamsiz** (faqat bank-hikoyasining o'z detallari: 2007-yil, uchta matras). Registr 3-bo'lim: K4 **m7-03 «Muammoni qanday izlash»** ga biriktirilgan edi — bu dars aynan o'sha mavzu M7 dan ko'chirilgan holi, keys u bilan birga keladi. M2 da band keyslar: K1 (M2-D2) · K3 (M2-D7) · K12 (M2-D13) — **K4 band emas** ✓ (modul-ichi qoidasi, registr 4-bo'lim 1-band) |
| 🔴 **K4 FARQ-DALILI (takroriy keys — burchak bo'lingan)** | K4 **M5-D8 `PmLesson20`** da band: u yerda faqat **Nyu-York uy-ma-uy bo'lagi** olingan (asoschilar uylarga borib o'zi suratga olgan — custdev oyoqda). Registr B4 izohi so'zma-so'z: «matras-boshlanishi + "muammo qayerdan topiladi" **m7-03 ga qoldi**». Bu dars **faqat matras-boshlanishini** oladi: burchak — «muammo uzoqda emas, o'z shahringizda, ko'z oldingizda». Nyu-York, suratga olish, intervyu — bu darsda **0** (M5-D8 ga qoldi). Bridge `BRIDGE-B2-MuammoniTopamiz.md` ham K4 ni oladi — lekin u boshqa o'quvchilar oqimi (React'ga keyin qo'shiladiganlar, M2 ni o'tmaydi), kesishuv o'quvchi-yo'lida yo'q |
| 🔴 **PmLesson4 (M2-D2) dan FARQ-DALILI** | M2-D2 da muammo **TAYYOR** keladi (M1 kartasidan yoki kinoteatr zaxira-ro'yxatidan) va ish — unga **yechim juftlash** (juftlik-lenta · sudrab-ulash · «javonga» ro'yxat-tozalash · `<ul>/<li>/<b>` kodingi · Uzum keysi). **M2-D3 da muammo hali YO'Q** — ish uni dunyodan **TOPISH** (kuzatuv, sharhlar, chatdagi savollar) va **BAHOLASH** (tez-tezlik × og'irlik). Yechim bu darsda yozilmaydi: «yechim» so'zi faqat bitta joyda — ustaxona saqlash-hintida qarama-qarshi qo'yish uchun («Bu yechim. Odam nimadan qiynalishini yozing»). Uchala mexanika ham, koding ham M2-D2 da yo'q (1-bo'lim jadvali). Kinoteatr misollari ham boshqa: M2-D2 zaxira-muammolari («film qachon boshlanishini bilmaydi» · «zalda bo'sh joy bormi» · «chiptani qayerdan olish») bu darsda **so'zma-so'z takrorlanmaydi** — bu dars o'z kinoteatr-hodisalari bilan ishlaydi (kassa navbati, narx topilmasligi, sayt telefonda ochilmasligi, seans vaqti eskirgani) |
| 🔴 **PmLesson5 (M2-D7) dan FARQ-DALILI (eng jiddiy takror-xavfi)** | M2-D7 «Dekompozitsiya» ham ikki savolli baho beradi: **⚖️ TAROZI (zarurat × yuk)** — lekin **IMKONIYATLARGA** (qurmoqchi bo'lgan narsaga) va natija **savatga** tushadi (🔥 v1 · ⚡ v2 · 🌱 backlog). M2-D3 baho beradi **MUAMMOGA** (hali hech narsa qurilmagan) — ikki o'lchov boshqa: **qanchalik tez-tez** va **qanchalik og'ir** (qurish yuki umuman so'ralmaydi), natija — savat emas, **jonli qayta tiziladigan reyting** (1…10 o'rin). Taqiq: «tarozi», «savat», «v1», «backlog», 🔥 ⚡ 🌱 belgilari bu darsda **0**. Zanjirda bu dars M2-D7 dan **oldin** — ya'ni o'quvchi avval muammoni saralashni ko'radi, keyin M2-D7 da yechim-bo'laklarni saralaydi (⚠️ GATE S 3-savol) |
| 🔴 **PmLesson28 (m7-03, eski avlod) dan** | Mavzu-manba. Olinmaydi: «radar», «ov/ovchi», «oltin kon», «workaround», «chastota», «og'riq» so'zlari, 2×2 matritsa-kvadrant, o'ylab topilgan qahramonlar. Olinadigan g'oyalar (o'z so'zimiz bilan): odam o'zicha yo'l topishi — eng kuchli belgi · past yulduzli sharh — muammo manbai · ikki bahoni ko'paytirish. m7-03 taqdiri — ⚠️ GATE S 2-savol |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | M2-D2 → «ro'yxat-tozalash» (javon) · M1-D14 → muammo-qidiruv · M3-D2 → tekshiruvchi stoli/klinika · M3-D5 → kartani ko'chirish · M3-D10 → Timeline · M3-D14 → Hotspot · M4-D2 → jadval-qatorini belgilash · M4c-06 → signal-saralash · M5-D11 → kun-belgilash. **M2-D3 = «DALILDAN BAHO»** — sharh matnidagi so'zga qarab ikki darajani o'zi qo'yish (o'qish → daraja). Registr 5-bo'limidagi birorta band mexanika bilan mos emas (dalil 2-bo'lim s11 da) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq: story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · ishga-tushirib-ko'rish formasi · MatchPairs · Timeline · Hotspot · bo'laklash-doska · hafta-chizig'i · rang-juftlash · kartani ko'chirish · PairTimer · klinika · tekshiruvchi stoli · TAROZI (M2-D7) · juftlik-lenta/sudrab-ulash/ro'yxat-tozalash (M2-D2) · QAYTISH-KALENDARI/KUN-BELGILASH (M5-D11) · signal-saralash (M4c-06) · pitch-oilasi ro'yxati |
| **Misol-ip (91/108 + 95 + 96)** | 🎬 **savdo markazidagi kinoteatr** — M2 modul-ipi (M2-D2 · M2-D7 shu olamda). Bu darsda kinoteatrning **hozirgi sayti va foyesi**: odamlar qayerda qiynalyapti. 95-qonun: Toshkent o'smiri savdo markazidagi kinoga **o'zi boradi** ✓. Brend-nom yo'q (kinoteatr nomsiz). Yagona boshqa olam — keys (Airbnb), freym bilan, bir marta (91b). **Istisno — o'quvchining O'Z atrofi:** ustaxonada (s8) o'quvchi 10 muammoni o'z hayotidan yozadi (maktab, yo'l, uy, savdo markazi) — bu misol-olam emas, uning artefakti (v9: «Atrofdan 10 muammo») |
| 🔴 **Personaj-taqiq (5.8)** | Ismli qahramon **YO'Q**. Sahnadagi odamlar ismsiz («sinfdoshingiz», «bir yigit», «uch kishilik oila») va gapirmaydi — ular faqat nima QILGANI bilan ko'rinadi. Sharhlar — kontent-ma'lumot (imzosiz), chat-pufak emas. Vazifani Mentor beradi |
| **Kirish-artefakt** | Yo'q (jim). `pm-m2d2-features` o'qilmaydi — bu dars yangi muammo topadi, M2-D2 juftliklariga tayanmaydi |
| **Chiqish-artefakt** | 🔴 `pm-m2d3-muammolar = { muammolar: [ { matn, tez: 1\|2\|3, ogir: 1\|2\|3 } × 10 ], savedAt }` · jami saqlanmaydi (`tez * ogir` dan olinadi) · tartib — yozilgan tartib (reyting ekranda tuziladi) |
| **Yordamchi kalitlar** | `pm-m2d3-hook-choice` (faqat YOZILADI — 100c) · `pm-m2d3-surma` (s4: qaysi yulduzlar ko'rildi) · `pm-m2d3-dalil` (s11 holati) · `pm-m2d3-koding` (`{code, done, open}`) · `pm-m2d3-reflection` · `ccProgress` |
| **Koding** | 🖥 KOMPILYATOR (`HtmlCompiler` dvijogi, qobiq shu faylda) · HTML `<ol>` + CSS klass · `useCompilerScale()` naqshi |

### 0.1 Atama-intizomi (bir tushuncha — bir nom, §80/§156)

- **«muammo»** — M1-D2/M2-D2 dan tanish; bu darsda yangi ta'rif berilmaydi.
- **Uch belgi — dars bo'ylab AYNAN shu yorliqlar** (s2 · T1 · s4 · flashcard · arena · yakun):
  **«Qayta-qayta bo'ladi»** · **«Odam o'zicha yo'l topgan»** · **«Odam voz kechgan»**. Belgi oldida emoji YO'Q (159/4).
- **Ikki baho — hamma yuzada bir xil yorliq va darajalar:**
  - **«Qanchalik tez-tez?»** — 1 «Kamdan-kam» · 2 «Ba'zan» · 3 «Tez-tez»
  - **«Qanchalik og'ir?»** — 1 «Biroz noqulay» · 2 «Vaqt yoki pul ketadi» · 3 «Maqsadiga yetmaydi»
- **«jami»** — ikki bahoning ko'paytmasi (1…9). 🔴 **«ball» so'zi bu ma'noda ISHLATILMAYDI** — u platformada test-ballini bildiradi (podium, arena). Belgi-formula yo'q (43a): «Ikki bahoni ko'paytiramiz: 3 marta 2 — jami 6.»
- **«sharh»** — ekranda faqat «sharh» (yulduzli karta o'zi tushuntiradi); «otziv» — faqat mentorning og'zaki izohi (metodist 28.09, 14-bo'lim 6-savol).
- **«chat»** — «sinfdoshlar chati»; ilova nomi aytilmaydi (24-qonun).
- ❌ Taqiq: «og'riq», «frustratsiya», «signal», «radar», «workaround», «ov», «ball» (baho ma'nosida), «prioritet», «tarozi», «savat», «yechim» (1 joydan tashqari).

---

## 1. EKRAN-RO'YXATI + SCREEN_INTENTS

| № | eyebrow | tur | scored | SCREEN_INTENTS — bola nima QILADI / BILADI | Mexanika |
|---|---|---|---|---|---|
| s0 | Kirish | hook | — | Ikki sharhdan kinoteatr egasiga foydaliroq bittasini tanlaydi va nega aynan u ekanini ko'radi | Ovoz-berish + payoff shu ekranda |
| s1 | Reja | rule | — | 10 qatorli muammo-ro'yxat baho olib, o'zi qayta tizilishini kuzatadi — dars natijasini oldindan ko'radi | Jonli preview «MUAMMO-REYTINGI» (imzo-vizual) |
| s2 | Kuzatuv | exploration | — | Kinoteatr foyesidagi 4 lahzani vaqt bo'yicha ochib, muammo odamning QILGAN ISHIDA ko'rinishini va uch belgini biladi | «▶ Keyingi lahza» soat-lentasi + belgi-yorliqlar |
| s3 | Mashq · 1-savol | test | ✅ module-mikro | Yangi lahzada qaysi belgi borligini topadi | TestQ |
| s4 | Sharhlar | exploration | — | Yulduz-surgichni 5⭐ dan 1⭐ gacha surib, muammo maqtovda emas, past yulduzli va sababi yozilgan sharhda ekanini ko'radi | «Yulduz-surgich» |
| s5 | Mashq · 2-savol | test | ✅ module-mikro | To'rt yangi sharhdan muammoni aniq aytganini tanlaydi | TestQ |
| s6 | Ikki savol | exploration | — | Uch kinoteatr muammosining ikki bahosini ochib, jami qanday chiqishini va tez-tez VA og'ir muammo birinchi turishini biladi | Tap-ochilma baho-kartalar + jami-chip |
| s7 | Haqiqiy voqea 🏠 | case | — | Airbnb matras-voqeasini 2 bashorat bilan ochadi: muammo o'z shahrida ko'rilgan | Keys-slayd (K4) + 2 mikro-bashorat |
| s8 | Ustaxona ✍️ | practice | praktika (`-1`) | O'z atrofidan 10 muammoni BITTALAB yozadi | 48/80-qolip: 10 nuqtali qadam-indikator · yagona yozish-kartasi · «📋 Namuna» |
| s9 | Baho qo'ying | practice | praktika (`-1`) | O'z 10 muammosiga ikki baho qo'yadi — reyting jonli qayta tiziladi | «MUAMMO-REYTINGI» (bittalab baho-karta → reytingga tushadi) |
| s10 | Mashq · 3-savol | test | ✅ module-mikro | Ikki yangi muammodan qaysi biridan boshlashni tanlaydi | TestQ |
| s11 | Dalildan baho | practice | praktika (`-1`) | Uch sharhning so'zlariga qarab ikki bahoni o'zi qo'yadi — xato bo'lsa qaysi so'zga qarashni biladi | «DALILDAN BAHO» (TEKSHIRUV — variant-tanlash EMAS) |
| s12 | Koding | koding | praktika (`-1`) | Eng kuchli uchta muammosini `<ol>` da jami kamayib boradigan tartibda yozadi va birinchisini CSS klass bilan ajratadi | Aylantirish-vizual → to'liq-ekran kompilyator |
| s13 | Yakuniy savol | test | ✅ final | Qaysi dalil muammoni eng kuchli ko'rsatishini tanlaydi | TestQ |
| s14 | Yakuniy so'z | reflection | — | Eng kuchli muammosini sherigiga yoddan aytadi, keyin bir qator yozadi | Sherikka-aytish + Reflection · **SOFT** |
| s15 | Natijalar | podium | — | Sinf/shaxsiy natijani ko'radi | Podium |
| s16 | CODE STRIKE | arena | ✅ arena | 12 savolli arenani o'ynaydi | CodeStrike |
| s17 | Takrorlash | flashcard | — | 10 kartani aylantiradi | Flashcards (3D flip) |
| s18 | Tayyor | summary | — | Yakun-ro'yxatini va uy vazifasi kartasini ko'radi | Summary + uy-vazifa kartasi (M5-D11 yakun-pretsedenti) |

**Test-taqsimot:** s3 · s5 · s10 · s13 — hech biri ketma-ket emas, har biri o'z teoriyasidan keyin ✅
(s3 ← s2 · s5 ← s4 · s10 ← s6+s9 · s13 ← butun dars).

**`INLINE_KEYS` (quruvchiga):** `{ s3: 2, s5: 3, s10: 0, s13: 1, s8: -1, s9: -1, s11: -1, s12: -1 }`

**Imzo-vizual — «MUAMMO-REYTINGI»** (23-qonun: yangi): o'quvchining 10 qatorli ro'yxati; har qator baho olgach o'ng
chetida «jami» chipi paydo bo'ladi va qator jami bo'yicha o'z o'rniga **suzib** o'tadi (FLIP-animatsiya, reduced-motion'da
darhol). Tepadagi uch qator «Eng kuchli uchtasi» deb bir fon bilan ajraladi (chap chiziq EMAS — 159/1). Band
ro'yxatdagi birorta vizual bilan mos emas: ustun/katak yo'q (prioritet-doska emas), savat yo'q (tarozi emas), kalendar yo'q.

---

## 2. TO'QQIZ BLOK (PM_Prompt_v8 shakli)

### === BLOK 1: HOOK (s0) ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN:
  Sarlavha: «Kinoteatr egasi saytni yangilamoqchi. Qaysi sharh unga ko'proq yordam beradi?»
  Mentor: «Savdo markazidagi kinoteatr saytida ikki sharh turibdi — ikkalasini o'qib, bittasini tanlang.»
  Ikki sharh-karta yonma-yon (material):
    A · ⭐⭐⭐⭐⭐ «Juda yaxshi kinoteatr, hammaga maslahat beraman!»
    B · ⭐⭐ «Saytdagi seans vaqti eski turibdi. Ikki marta keldim — ikkalasida ham film boshlanib ketgan ekan.»
HARAKAT: Bitta sharhni tanlaydi (tanlov `pm-m2d3-hook-choice` ga YOZILADI, o'qilmaydi — 100c).
JAVOB: Tanlovdan keyin darhol payoff (91a — hook osilib qolmaydi; §119 — hech bir tanlov kamsitilmaydi):
  B tanlanganda: «Topdingiz! B-sharh nima buzilganini aytadi: seans vaqti eski, odam ikki marta kechikdi.»
  A tanlanganda: «Maqtov yoqimli, lekin undan nimani tuzatishni bilib bo'lmaydi. B-sharh esa aytadi: seans vaqti
  eski, odam ikki marta kechikdi.»
  ⚠️ Quruvchiga (400-chegara): payoff mentor-pufak O'RNIDA chiqadi (ikkalasi birga turmaydi) — shunda ≈ 345 belgi.
RO'YXAT / YULDUZCHA / YORDAM / KOD / MAVZU / QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozni sanamang, muhokamani cho'zmang — payoff o'zi ochadi. Kartalar yulduzli bo'lgani uchun «sharh» ekranda glossiz tushuniladi; og'zaki bir marta «sharh — ya'ni otziv» deb ayting (ekranga ruscha qavs chiqmaydi — 14-bo'lim 6-savol tavsiyasi).
```
*Proza sanog'i (metodist 28.09, Intl.Segmenter): sarlavha + 2 sharh + payoff ≈ 345 belgi (mentor-pufak payoff bilan almashadi).*

### === BLOK 2: MAQSAD (s1) ===
```
VAQT: 2
KOMPONENT: — (jonli preview «MUAMMO-REYTINGI»)
EKRAN:
  Sarlavha: «Bugun atrofingizdan 10 ta muammo topasiz. Qaysi biri eng kuchli chiqadi?»
  Mentor: «Muammoni har kuni ko'rasiz — maktabda, yo'lda, kinoteatrda. Ro'yxat baho olgach qanday qayta tizilishini kuzating.»
  Preview: 10 ta namuna-qator (kinoteatr + maktab + yo'l) ketma-ket paydo bo'ladi → har biriga ikki kichik baho-chip
  tushadi → «jami» chipi chiqadi → qatorlar jami bo'yicha suzib o'rin almashadi → tepadagi uchtasi ajraladi.
HARAKAT: Kuzatadi, «Boshlaymiz →» bosadi.
JAVOB / RO'YXAT / YULDUZCHA / YORDAM / KOD / MAVZU / QISQA_VARIANT: —
SOFT: —
MENTORGA: Bu ekranda belgilar ham, baho nomlari ham aytilmaydi (74: reja-ekran ta'rif aytmaydi; 178: kashfiyot oldindan aytilmaydi).
```

### === BLOK 3: YADRO (s2 → s7) ===
```
VAQT: 26 (mentor gapi jami ≤10 daqiqa)
KOMPONENT: Soat-lentasi · Quiz · Yulduz-surgich · Quiz · Tap-ochilma baho-kartalar · Keys-slayd
```

**s2 — KUZATUV (SAVOL → MISOL → QOIDA)**
```
EKRAN:
  Sarlavha: «Kino oldidan odamlar nima qilyapti?»
  Mentor: «Odam "menda muammo bor" demaydi, buni qilgan ishi ko'rsatadi — «▶ Keyingi lahza»ni bosing.»
  Soat-lentasi (har bosishda bitta lahza-karta, vaqt yorlig'i bilan):
    18:30 · «Chatda uch sinfdosh birin-ketin so'radi: "Bugun 19:00 da qaysi film bor?"»
    18:45 · «Bir yigit saytda seans vaqtini topolmay, kassaga qo'ng'iroq qildi.»
    18:55 · «Oila kassadagi uzun navbatni ko'rib, chipta olmay ketdi.»
    19:05 · «Ikki do'st popkorn olib, zalga kirdi.»
  To'rttasi ochilgach har kartaga belgi-yorliq tushadi: 1 → «Qayta-qayta bo'ladi» · 2 → «Odam o'zicha yo'l topgan» ·
  3 → «Odam voz kechgan» · 4 → yorliqsiz (karta xiralashadi, matn-yorliq YO'Q).
  ⚠️ Quruvchiga (400-chegara, o'lchov ≈ 440): qoida-qatori ochilganda lahza-kartalar yig'ilib, faqat yorliq + vaqt qoladi
  (matni bosilsa ochiladi) — shunda ≈ 250. Yig'ish imkoni bo'lmasa — s2 ni ikki ekranga bo'lish taklifi.
  Qoida-qatori (mentor-pufak o'rnida chiqadi — 400-chegara): «Uch belgidan biri bor joyda muammo bor. Eng kuchlisi — odam o'zicha yo'l topgani.»
HARAKAT: «▶ Keyingi lahza» ni 4 marta bosadi.
JAVOB: 4/4 ochilganda belgilar tushadi, «Davom etish» ochiladi.
YORDAM: —
MENTORGA: 4-lahzada sinf odatda «bu yerda muammo yo'q» deydi — shu gapni tasdiqlang: muammo har joyda emas.
```

**s3 — TEST-1** (4-bo'lim)

**s4 — SHARHLAR (Yulduz-surgich)**
```
EKRAN:
  Sarlavha: «Qaysi yulduzli sharhda muammo yashiringan?»
  Mentor: «Maqtovdan nima buzilganini bilib bo'lmaydi — yulduz-surgichni beshdan birgacha surib, har sharhni o'qing.»
  Kinoteatr sahifasidagi sharhlar (surgich qaysi yulduzda tursa — faqat o'shalar ko'rinadi):
    5⭐ «Zal chiroyli, kreslolar qulay ekan.»
    4⭐ «Yaxshi. Faqat popkorn biroz qimmat.»
    3⭐ «O'rtacha, yomon emas.»
    2⭐ «Saytda chipta narxi yozilmagan. Har safar kassaga borib so'rashga to'g'ri keladi.» (namuna-panel va TEST-1 endi bu gapni takrorlamaydi)
    1⭐ «Sayt telefonda ochilmadi, chiptani kassadan olmoqchi bo'ldik. Navbat uzun ekan — oxiri ketib qoldik.»
  2⭐ va 1⭐ ko'ringanda s2 belgilari o'zi yonadi: 2⭐ → «Qayta-qayta bo'ladi» + «Odam o'zicha yo'l topgan» ·
  1⭐ → «Odam voz kechgan».
  Qoida-qatori (1⭐ ga yetgach): «Past yulduzli, sababi yozilgan sharh — tayyor muammo.»
HARAKAT: Surgichni 5 → 1 suradi (har bir yulduz kamida bir marta ko'rilishi kerak).
JAVOB: Beshala yulduz ko'rildi → qoida-qatori → «Davom etish».
YORDAM: —
MENTORGA: 4⭐ dagi «popkorn qimmatroq» ham shikoyat — lekin undan nima qilish kerakligi bilinmaydi; savol bo'lsa shuni ayting.
```

**s5 — TEST-2** (4-bo'lim)

**s6 — IKKI SAVOL (baho qoidasi, induktiv)**
```
EKRAN:
  Sarlavha: «Uchta muammo bor. Qaysi biridan boshlash kerak?»
  Mentor: «Muammoga ikki savol beramiz: qanchalik tez-tez bo'ladi va qanchalik og'ir — har kartani bosib, bahosini oching.»
  Uch karta (sharhlardan chiqqan kinoteatr muammolari; bosilganda ikki baho + jami ochiladi, qayta bosilsa yopiladi — 46):
    A «Seans vaqti saytda eski turadi — odam kelganda film boshlanib ketgan bo'ladi.»
       Qanchalik tez-tez? Tez-tez (3) · Qanchalik og'ir? Maqsadiga yetmaydi (3) · jami 9
    B «Popkorn narxi saytda yozilmagan.»
       Qanchalik tez-tez? Tez-tez (3) · Qanchalik og'ir? Biroz noqulay (1) · jami 3
    C «Yangi yil kechasi zal to'lib, chipta qolmaydi.»
       Qanchalik tez-tez? Kamdan-kam (1) · Qanchalik og'ir? Maqsadiga yetmaydi (3) · jami 3
  Uchala ochilgach qoida-qatori (mentor-pufak o'rnida): «Ikki bahoni ko'paytiramiz. Tez-tez bo'ladigan va og'ir muammo birinchi turadi.»
  ⚠️ Quruvchiga (400-chegara): bir vaqtda bitta karta ochiq (boshqasini ochsa, oldingisi yopiladi); baho-qatori chip ko'rinishida.
HARAKAT: Uch kartani ochadi.
JAVOB: 3/3 ochilganda qoida-qatori va «Davom etish».
YORDAM: —
MENTORGA: C kartada «lekin u juda og'ir-ku!» degan e'tiroz chiqadi — bu yaxshi savol: yilda bir marta bo'lgani uchun B bilan teng.
  Darajalar jadvali (1-2-3) shu ekranda baho-kartalarning o'zida ko'rinadi — alohida jadval chizilmaydi.
```

**s7 — KEYS-SLAYD (K4 · AIRBNB)** — to'liq spetsifikatsiya 6-bo'limda.

### === BLOK 4: MUSTAQIL ISH (s8 + s9) ===
```
VAQT: 16 (s8 ≈ 11 · s9 ≈ 5)
KOMPONENT: Ustaxona (48/80-qolip) + «MUAMMO-REYTINGI»
EKRAN (s8):
  Sarlavha: «Birinchi muammongiz qaysi?» (qadam bilan almashadi: «Ikkinchi…» … «O'ninchi muammongiz qaysi?»)
  Mentor (≤1 gap): «O'zingiz ko'rgan muammoni aniq yozish oson — kecha maktabda, yo'lda yoki uyda kim qiynalganini eslang.»
EKRAN (s9):
  Sarlavha: «Qaysi muammongiz eng kuchli chiqadi?»
  Mentor (≤1 gap): «Bahoni o'zingiz ko'rgan narsaga qarab qo'ying — ikkala savolga javob bersangiz, muammo reytingda o'z o'rniga o'tadi.»
HARAKAT: s8 — 10 muammoni BITTALAB yozadi va saqlaydi · s9 — har muammoga 2 baho qo'yadi (batafsil — 5-bo'lim).
JAVOB: s8 — 10 karta saqlandi (honor-tugma yo'q) · s9 — 10/10 baho → reyting to'liq, `pm-m2d3-muammolar` yoziladi.
RO'YXAT (chek-list, aynan 3 band, yorliq ≤5 so'z — ETALON 25/32):
  1. «Kim, qayerda, nimadan qiynaldi»
  2. «Yechim emas, muammo»
  3. «Ikkala baho qo'yilgan»
YULDUZCHA: «Eng kuchli uchtangizdan birida qaysi belgi bor? Sherigingizga bir gapda ayting.»
YORDAM: «Kecha uydan chiqqaningizdan qaytguningizcha borgan joylaringizni sanang: bekat, maktab eshigi, bufet, savdo markazi.
  Qayerda kutdingiz yoki kimdandir so'radingiz? O'sha — birinchi muammo.»
KOD: —
SOFT: —
MENTORGA: 6-muammodan keyin sinf sekinlashadi — «yechim yozib qo'yish» (…kerak, …qilish kerak) eng ko'p xato; o'quvchidan
  «bu odam nimadan qiynaldi?» deb so'rang. 10 taga ulgurmagan o'quvchi s9 ga qolganlari bilan o'tadi — uyda to'ldiradi.
```

### === BLOK 5: TEKSHIRUV (s10 + s11) ===
```
VAQT: 6
KOMPONENT: Quiz (s10) + «DALILDAN BAHO» (s11 — variant-tanlash EMAS)
```

**s11 — DALILDAN BAHO**
```
EKRAN:
  Sarlavha: «Har sharhga qanday baho qo'yasiz?»
  Yo'riq (≤20 so'z, 75-qonun): «Bahoni sharhdagi so'zdan oling: qanchalik tez-tez bo'lgani va odam nima yo'qotgani.»
  Uch karta (yangi kinoteatr sharhlari; har kartada ikki qator 1-2-3 chiplari):
    K1 «Har kelganimda sayt ochilmaydi — chiptani kassadan olaman, navbatda yigirma daqiqa turaman.»
    K2 «Bir marta chiptam ikki kishiga sotilgan ekan. Joyimda boshqa odam o'tirdi — filmni ko'rolmay qaytdim.»
    K3 «Ba'zan saytda film nomi ruscha chiqadi. Biroz chalg'itadi, lekin tushunsa bo'ladi.»
  Kalitlar: K1 → tez-tez 3 · og'ir 2 (jami 6) · K2 → 1 · 3 (jami 3) · K3 → 2 · 1 (jami 2)
  Har karta ikkala qator tanlangach O'ZI tekshiriladi:
    ✓ — karta yashil, jami chiqadi.
    ✕ — karta silkinadi, noto'g'ri qatorning ostida neytral ipucha (175: mezonni eslatadi, javobni aytmaydi):
      tez-tezlik xato: «Sharhda necha marta bo'lgani aytilgan so'zni toping.»
      og'irlik xato: «Odam oxirida nima yo'qotdi — vaqtmi, filmni ko'rishmi yoki shunchaki noqulay bo'ldimi?»
  Uchala to'g'ri bo'lgach: «Eng yuqori jami — birinchi kartada: har safar bo'ladi va vaqt ketadi.»
HARAKAT: 3 kartaga 6 ta baho qo'yadi.
JAVOB: 3/3 karta to'g'ri → «Davom etish».
YORDAM: yuqoridagi ipuchalar (faqat xatodan KEYIN — §186).
MENTORGA: K2 da sinf ko'pincha «juda og'ir» deb 3·3 qo'yadi — «necha marta bo'lgan?» deb so'rang. Bu mashq ball bermaydi, nishon
  birinchi urinishga (151).
```

**Mexanika farq-dalili (26/59-qonun):** M4-D2 «jadval-qatorini belgilash» — tayyor jadvaldan qator TANLASH; M4c-06
«signal-saralash» — har signalga ikki YO'Ldan birini berish; M5-D11 «kun-belgilash» — o'rin munosabati bo'yicha belgilash;
M2-D2 «ro'yxat-tozalash» — ortiqchani javonga chiqarish. «Dalildan baho» — **matndagi so'zni o'qib ikki mustaqil darajani
qo'yish**, jami hisoblanadi; xato qaysi o'lchovda ekani alohida aytiladi. Band ro'yxatda o'xshashi yo'q.

### === BLOK 6: KODING (s12) ===
```
VAQT: 10
KOMPONENT: Code Editor (to'liq-ekran kompilyator, qobiq shu faylda)
EKRAN: Sarlavha (48-korpus: natijani aytadi): «Eng kuchli uchta muammongiz sahifada tartib bilan turadi»
  Aylantirish-vizual (50-qonun): chapda mini kod-chip `<li class="birinchi">…</li>` ➜ puls-strelka ➜ o'quvchining O'Z reytingidagi
  uchta eng yuqori muammo (s9 dan).
  Mentor: «Kompilyatorda kod yozsangiz, natijasi shu zahoti ko'rinadi — «🛠 Kompilyatorni ochish»ni bosing.»
HARAKAT: Kompilyatorda ro'yxatni to'ldiradi va CSS qoida yozadi (7-bo'lim).
JAVOB: Uchala shart ✓ → «Davom etish».
KOD: 7-bo'limda.
YULDUZCHA: «To'rtinchi va beshinchi muammoni ham qo'shing — tartib buzilmasin.»
YORDAM: «Jami kattasi yuqorida turadi. Klass nomini nuqta bilan yozasiz: .birinchi { … }»
MENTORGA: 87-qonun: `<ol>` 1-Modulda «tartib muhim bo'lsa» deb o'tilgan, klass-selektor CSS darsida `.box` bilan — yangi teg yo'q.
  Ulgurmagan o'quvchi uyda tugatadi (uy vazifasi QISQA_VARIANT).
```

### === BLOK 7: RECAP (s13 + s14) ===
```
VAQT: 5
KOMPONENT: Quiz (yakuniy) + Reflection
```
**s13** — yakuniy scored test (4-bo'lim).

**s14 — YAKUNIY SO'Z**
```
EKRAN: Sarlavha: «Eng kuchli muammongizni yoddan ayta olasizmi?»
  Mentor: «Ekranga qaramay sherigingizga ayting: muammoni qayerda ko'rdingiz va nega jami yuqori chiqdi? Keyin shu gapni bir qatorga yozing.»
HARAKAT: 1) juftlikda navbat bilan aytadi (ovoz chiqarib); 2) Reflection maydoniga bir qator yozadi;
  3) sinfga 3 tezkor savol — javob qo'l ko'tarish bilan: «Kimning o'nta muammosi tayyor?» · «Kimning eng kuchli
  muammosi maktabda?» · «Kimda jami 9 chiqqan muammo bor?»
JAVOB: Bir qatorlik yozuv saqlanadi (`pm-m2d3-reflection`).
SOFT: ✅ Sherikka yoddan aytish + sherik bitta savol beradi: «Bu necha marta bo'lgan?» (taymer-vidjetsiz — PairTimer band).
MENTORGA: Sinfning uchdan biri «jami nega yuqori»ni aytolmasa — s6 dagi C kartani (og'ir, lekin kamdan-kam) qayta ko'rsating.
```

### === BLOK 8: UYGA VAZIFA (s18 da karta) ===
```
VAQT: 4
KOMPONENT: Topshiriq-kartasi (yakun-ekranida — M5-D11 yakun-tuzilmasi pretsedenti)
EKRAN (to'liq versiya, ~20 daqiqa):
  Karta sarlavhasi: «Topshiriq kartasi»
  Qatorlar: «Nechta: eng kuchli 3 muammo» · «Kim bilan: shu joyda bo'ladigan bitta odam» · «Qayerga: shu darsning baho ekraniga»
  3 qadam:
    ① Eng kuchli uchta muammongizdan birini oling.
    ② Shu joyda bo'ladigan bitta odamdan so'rang: «Siz ham shundan qiynalasizmi? Necha marta bo'ladi?»
    ③ Javobiga qarab ikki bahoni yangilang. Qolgan ikkitasi bilan ham shunday qiling.
HARAKAT: Uyda 3 muammoni real odam bilan tekshiradi va bahosini yangilaydi.
JAVOB: `pm-m2d3-muammolar` da 3 ta muammo bahosi yangilangan (yoki o'zgarmagani tasdiqlangan).
RO'YXAT (mentor 1 daqiqada tekshiradi, aynan 3 band):
  1. Uch muammo bo'yicha uch odamdan so'ralgan.
  2. Har javobdan keyin baho yangilangan yoki o'zgarmagani yozilgan.
  3. Reytingda tepadagi uchtalik bugungisi bilan solishtirilgan.
QISQA_VARIANT (~10 daqiqa — koding uyga ketgan bo'lsa): kodingni tugatadi (uchala shart ✓) va bitta muammoni bitta odam bilan tekshiradi.
YULDUZCHA: —
YORDAM: «So'rash noqulay bo'lsa — uydagilardan boshlang: ular ham shu bekatdan yoki shu do'kondan foydalanadi.»
MENTORGA: Muddat yozilmaydi. Uy vazifasi fayli — `src/2-Modull/PmMuammoIzlash.homework.jsx` (PmLesson2.homework etaloni
  naqshida, dars fayli nomi + `.homework`) — BU SENARIY DOIRASIDAN TASHQARI, alohida yoziladi.
```

### === BLOK 9: CODESTRIKE (s16) ===
```
VAQT: 8
KOMPONENT: CodeStrike arena (12 savol × 15 s)
MAVZU: muammo odamning qilgan ishida ko'rinadi · uch belgi (qayta-qayta bo'ladi · odam o'zicha yo'l topgan ·
  odam voz kechgan) · past yulduzli sababi yozilgan sharh · chatdagi takror savol · ikki baho (tez-tezlik, og'irlik)
  va jami · Airbnb havo-matras voqeasi · <ol> tartibli ro'yxat.
IZOH: 12 savol qo'lda — 8-bo'limda.
MENTORGA: Podium arenadan oldin (etalon tartibi).
```

---

## 3. TAYMING-TEKSHIRUVI

| Blok | Daqiqa | Ekranlar |
|---|---|---|
| 1. HOOK | 5 | s0 |
| 2. MAQSAD | 2 | s1 |
| 3. YADRO | 26 | s2 · s3 · s4 · s5 · s6 · s7 |
| 4. MUSTAQIL ISH | 16 | s8 · s9 |
| 5. TEKSHIRUV | 6 | s10 · s11 |
| 6. KODING | 10 | s12 |
| 7. RECAP | 5 | s13 · s14 |
| 8. UYGA VAZIFA | 4 | s18 (karta) |
| 9. CODESTRIKE | 8 | s15 · s16 · s17 |
| **Bufer** | **8** | |
| **JAMI** | **90** | |

---

## 4. TEST SAVOLLARI (3 module-mikro + 1 final)

> Qolip (korpus §5/§210): izoh avval variantning rost tomonini tan oladi, keyin kamchiligini aytadi. Har savol dars
> ekranida o'rgatilganidan chiqadi, lekin ekrandagi misolni ko'chirmaydi (§106/§144). Variantlar bir qolipda (§204/§205).

### TEST-1 (s3 · manba: s2)
**Lead:** «Kinoteatr saytida film necha soat davom etishi yozilmagan — sinfdoshingiz buni internetdan qidirib bildi.»
**Savol:** «Bu lahzada qaysi belgi bor?»

| # | Variant | Izoh |
|---|---|---|
| 0 | «Odam voz kechgan» | Bilolmasa, kinodan voz kechishi mumkin edi. Lekin u qaytmadi — javobni qayerdan oldi? |
| 1 | «Qayta-qayta bo'ladi» | Takrorlanishi mumkin, bu rost. Lekin lahzada faqat bir marta bo'lgani ko'rinadi — takrorga hali dalil yo'q. |
| 2 | ✅ «Odam o'zicha yo'l topgan» | To'g'ri! Sayt kerakli narsani aytmadi — u boshqa yo'l bilan bilib oldi. Shu aylanma yo'l muammo borligini ko'rsatadi. |
| 3 | «Hech qanday belgi yo'q» | Internetdan qidirish oddiy ishdek ko'rinadi. Lekin nega bu ma'lumot kinoteatr saytida yo'q? |

**To'g'ri indeks: 2**

### TEST-2 (s5 · manba: s4)
**Lead:** «Kinoteatr egasi nimani tuzatishni bilmoqchi.»
**Savol:** «Qaysi sharh unga eng ko'p yordam beradi?»

| # | Variant | Izoh |
|---|---|---|
| 0 | «5⭐ — "Eng yaxshi kinoteatr, doim do'stlarim bilan kelaman!"» | Bunday sharh egasini xursand qiladi. Lekin undan nimani tuzatish kerakligi bilinmaydi. |
| 1 | «3⭐ — "O'rtacha ekan, boshqa kinoteatrlardan farqi yo'q."» | Baho past, bu to'g'ri. Lekin sababi yozilmagan: nima yetishmayotgani noma'lum. |
| 2 | «1⭐ — "Umuman yoqmadi, hammasi juda yomon ekan!"» | Eng past baho — lekin nimasi yomonligi aytilmagan. Egasi qaysi joyni tuzatishni bilolmaydi. |
| 3 | ✅ «2⭐ — "Saytda joy tanlab bo'lmaydi, har safar kassaga boraman."» | To'g'ri! Baho past, sababi aniq yozilgan va u har safar takrorlanadi. Bu tayyor muammo. |

**To'g'ri indeks: 3** · uzunliklar tekislandi (metodist 28.09): 55 · 51 · 46 · 58 belgi → 1,26×; «sayt» so'zi lead'dan olindi (§204 aks-sado).

### TEST-3 (s10 · manba: s6 + s9)
**Lead:** «Kinoteatr sharhlaridan ikki muammo chiqdi.»
Material (ikki qator):
- **1-muammo:** «Har kuni kechqurun sayt telefonda ochilmaydi — chiptani kassada navbatda turib olishga to'g'ri keladi.»
- **2-muammo:** «Yilda bir marta, eng mashhur film chiqqan kuni chipta bir soatda tugaydi — ko'p odam filmni ko'rolmaydi.»

**Savol:** «Qaysi biridan boshlaysiz?»

| # | Variant | Izoh |
|---|---|---|
| 0 | ✅ «Birinchisidan — u har kuni bo'ladi va vaqt oladi» | To'g'ri! Birinchisi har kuni bo'ladi (3) va vaqt oladi (2) — jami 6. Ikkinchisi og'ir (3), lekin yilda bir marta (1) — jami 3. |
| 1 | «Ikkinchisidan — unda odam filmni ko'rolmaydi» | Ikkinchisi og'irroq, bu rost. Lekin u yilda bir marta bo'ladi — ikki bahoni ko'paytirsangiz, qaysi biri katta chiqadi? |
| 2 | «Ikkalasidan baravar — ikkalasida ham odam qiynaladi» | Ikkalasida ham qiynalish bor, to'g'ri. Lekin biri har kuni, biri yilda bir marta — jami bir xil chiqmaydi. |
| 3 | «Ikkinchisidan — o'sha kuni odam ko'p keladi» | O'sha kuni odam ko'p, bu rost. Lekin savol — muammo qanchalik tez-tez va og'ir. Qaysi biri har kuni bo'ladi? |

**To'g'ri indeks: 0**

### YAKUNIY TEST (s13 · manba: butun dars)
**Lead:** «Kinoteatr sayti uchun muammo qidiryapsiz.»
**Savol:** «Qaysi biri muammo borligiga dalil bo'ladi?» (s2 «eng kuchli belgi — o'zicha yo'l topgan» qoidasi bilan to'qnashmasin — metodist 28.09)

| # | Variant | Izoh |
|---|---|---|
| 0 | «Bitta tanishingiz "kinoteatrlar zerikarli" dedi» | Odamning fikri — foydali. Lekin nimadan qiynalgani ham, necha marta bo'lgani ham aytilmagan. |
| 1 | ✅ «Chatda bir xil savolni har hafta turli odamlar yozyapti» | To'g'ri! Bir savol qayta-qayta so'ralsa, demak uning javobi hech qayerda yo'q. Shu muammo. |
| 2 | «Besh yulduzli sharhda "hammasi yoqdi" deyilgan» | Maqtov yoqimli. Lekin undan nima buzilgani bilinmaydi. |
| 3 | «Sizga kinoteatr logotipi eskidek ko'rindi» | O'z ko'zingiz bilan qarash — yaxshi odat. Lekin logotip hech kimni qiynamayapti: kim nimadan qiynaldi? |

**To'g'ri indeks: 1**

---

## 5. USTAXONA VA REYTING SPETSIFIKATSIYASI (s8 · s9)

### 5.1 s8 — 10 muammo, bittalab (48/80-qolip)
- **Tepada — qadam-indikator** 10 nuqta (havoda, karta EMAS): yozilgani yashil ✓, joriysi indigo-puls, kelgusi kulrang-punktir. Nuqtalar ostida nom YO'Q (10 ta sig'maydi) — faqat joriy raqam «3/10».
- **Yagona yozish-kartasi:** bitta maydon, `placeholder="Kim, qayerda, nimadan qiynaldi?"` (92c — tayyor javob yo'q). Pastda «✓ Saqlash» (matni o'zgarmaydi) + «Keyingisi» avtomatik ochiladi.
- **Yozilganlar ro'yxati yozish paytida KO'RINMAYDI** (80c); 10 tasi tayyor bo'lgach to'liq ro'yxat ochiladi, har qatorda «✎ Tahrirlash».
- **«📋 Namuna» paneli** (85-qonun — placeholder'da emas; yopiq holatda bitta qator; bosqichga qarab joy-namunasi almashadi):
  - 1, 6-qadam · maktab: «Tanaffusda bufet navbati uzun — o'quvchilar ovqat olishga ulgurmaydi.»
  - 2, 7-qadam · yo'l: «Avtobus qachon kelishi noma'lum — bekatda kutib turamiz.»
  - 3, 8-qadam · savdo markazi: «Savdo markazida kerakli do'konni topish qiyin — odamlar qo'riqchidan so'rab yuradi.»
  - 4, 9-qadam · uy: «Uy vazifasi sinf chatida boshqa xabarlar orasida yo'qolib ketadi.»
  - 5, 10-qadam · to'garak: «Mashg'ulot vaqti o'zgarsa, buni faqat chatdagi xabar aytadi — ko'pchilik ko'rmay qoladi.»
- **Saqlash-hintlari (yumshoq — qulflamaydi, korpus §12 qolipi):**

| Holat | Xabar |
|---|---|
| ≤ 15 belgi | «Juda qisqa — kim, qayerda va nimadan qiynalganini bir gapda yozing.» |
| Yechim yozilgan («…kerak», «…qilish kerak», «sayt/ilova qilaman») | «Bu yechim. Avval odam nimadan qiynalishini yozing.» |
| Mavhum («yomon», «qiyin», «hamma» — kimsiz) | «Bu umumiy gap. Kim qiynaldi va qayerda?» |
| Avvalgi qatorning takrori | «Bu muammo ro'yxatda bor. Boshqa joyni eslang.» |

- **Bajarilganlik:** 10-karta saqlanganda ekran O'ZI bajariladi → praktika-signal, `done-mini` «✅ O'nta muammo tayyor». Mentor bypass (51-qonun). Nishon `problemHunter`.
- **Ulgurmaganlar:** 10 tadan kam bo'lsa ham s9 ga «Davom etish» faqat **mentor-rejimida** ochiq; yakka rejimda 10/10 kerak (⚠️ GATE S 4-savol).

### 5.2 s9 — MUAMMO-REYTINGI (baho qo'yish)
- **Chapda — bitta baho-karta** (94-qonun: bittalab): tepada muammo matni, ostida ikki qator:
  «Qanchalik tez-tez?» — [Kamdan-kam] [Ba'zan] [Tez-tez] · «Qanchalik og'ir?» — [Biroz noqulay] [Vaqt yoki pul ketadi] [Maqsadiga yetmaydi].
  Chip ichida raqam yo'q (raqam faqat jami-chipda) — o'quvchi so'zni tanlaydi, son emas.
- Ikkala qator tanlanganda karta «jami N» chipini oladi va o'ngdagi **reytingga suzib tushadi**, keyingi karta ochiladi.
- **O'ngda — reyting:** qatorlar jami bo'yicha kamayib boradi (teng jamida yozilgan tartib saqlanadi); tepadagi uchtasi «Eng kuchli uchtasi» foni bilan. Har qatorni bosib bahoni o'zgartirish mumkin (↻).
- **Bajarilganlik:** 10/10 → `done-mini` «✅ Reyting tayyor», `pm-m2d3-muammolar` yoziladi, nishon `rankBuilder`.
- **Xato yo'q** — bu o'quvchining o'z bahosi; tekshirilmaydi, faqat to'liqligi sanaladi.

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s7 · K4 AIRBNB)

**Eyebrow:** «Haqiqiy voqea 🏠» (§203: «keys» — jamoa so'zi, ekranga chiqmaydi). **Freym-gap (91b):** «Biznes olamidan mashhur voqea: Airbnb qanday boshlangan?»
**Brend-izohi (156):** birinchi slaydda «Airbnb — safarda birovning uyini ijaraga olish xizmati».

| # | Slayd | Matn (hikoya tilida — korpus §42) |
|---|---|---|
| 1 | Vaziyat | «2007-yil, Amerikaning San-Fransisko shahri. U yerda katta anjuman bo'ldi — boshqa shaharlardan ko'p odam keldi. Mehmonxonalar to'lib ketdi, ko'pchilik tunashga joy topolmadi.» |
| 2 | 🎲 Bashorat-1 | «Shu shaharda yashaydigan yigitlar — keyinchalik Airbnb'ni ochganlar — buni ko'rdi. Sizningcha, ular nima qildi?» |
| 3 | Javob | «Ular o'z uyiga havo bilan shishiriladigan uchta matras qo'yib, joy topolmagan mehmonlarga ijaraga berdi. Airbnb shu uchta matrasdan boshlangan.» |
| 4 | 🎲 Bashorat-2 | «Ular bu muammoni qayerda ko'rdi?» |
| 5 | Natija + ko'prik | «Muammoni ular o'ylab topmadi — o'z shahrida, o'z ko'zi bilan ko'rdi. Siz ham muammoni uzoqdan emas, o'z atrofingizdan qidirasiz.» |

### 6.1 Bashorat-variantlari (43: bitta o'lchov; 100: «bu ball emas» izohi YO'Q, hook-qaytarish YO'Q)
Tepa-yorliq: «🎲 Avval o'zingiz belgilab ko'ring».

**Bashorat-1** (o'lchov — «nima qildi»):
1. «Mehmonxonalar haqida sharh yozdi»
2. «Yangi mehmonxona ochish uchun pul yig'di»
3. ✅ «Uyidagi matraslarni mehmonlarga ijaraga berdi»
Reveal: topganga «🎯 Topdingiz!» · adashganga «Asl javob — uchinchisi: ular uyidagi matraslarni mehmonlarga ijaraga berdi.»

**Bashorat-2** (o'lchov — «qayerda»):
1. «Boshqa davlatdan kelgan xatda»
2. «Internetdagi maqolada»
3. ✅ «O'z shahrida, anjuman kunlari»
Reveal: «Asl javob — o'z shahrida, anjuman kunlari.»

**Raqam-halolligi:** keys «без цифр» — faqat bank-hikoyasining o'z detallari: **2007-yil** va **uchta matras**. Foydalanuvchilar soni, qiymat, Nyu-York, suratga olish — YO'Q (M5-D8 burchagi). «Anjuman» — «konferensiya» o'rniga; metodist qarori (28.09): alohida qavs-gloss YO'Q, gapning o'zi ochadi («boshqa shaharlardan ko'p odam keldi»). «Havo-matras» → «havo bilan shishiriladigan matras» (1-marta), keyin «matras».

---

## 7. KODING SPETSIFIKATSIYASI (s12 · 87-qonun)

**87-savolga javob:** bu darsgacha o'quvchi 2-Modulda faqat **m2-01 «Sistema va Algoritm»** (tushuncha, JS sintaksisi YO'Q) va
**m2-02 PmLesson4** (HTML `<ul>/<li>/<b>` kodingi) ni o'tgan. 1-Modul: HTML (`Htmllesson1` — `<ol>` «tartib muhim bo'lsa»,
389-qator) va CSS (`CssLesson1` — `.box` klass-selektori bilan padding/margin). ➡️ **Stek: HTML + CSS.** `let`/`if`/`for` YOZILMAYDI.

**Manba-bo'shliq (87b):** `<ol>` 1-Modulda «retsept qadamlari» misolida ko'rsatilgan, lekin tartibni **ma'no bo'yicha o'zi
belgilash** (qaysi band yuqorida — sabab bilan) mashq qilinmagan; klass-selektor tayyor `.box` bilan ishlatilgan, lekin
**o'zi nom berib, o'z klassiga qoida yozish** qilinmagan. Ikkalasi shu yerda yopiladi. M2-D2 kodingidan farq: u `<ul>` +
`<b>` (tartibsiz ro'yxat, matn ichi), bu — `<ol>` (tartib ma'noli) + `<style>` qoidasi.

### 7.1 Boshlang'ich kod (1-band o'quvchining O'Z reytingidagi 1-o'rin bilan to'ldiriladi; bo'sh bo'lsa — s6 A-kartasi, 40-qonun)

```html
<h2>Atrofimdagi eng kuchli muammolar</h2>

<ol>
  <li class="birinchi">Seans vaqti saytda eski turadi — jami 9</li>
  <!-- Bu yerga yana ikkita muammo: jami kattasi yuqorida -->
</ol>

<style>
  li { margin: 8px 0; }
  /* .birinchi uchun fon rangini shu yerga yozing */
</style>
```

### 7.2 Jonli shartlar (3 ta, debounce bilan; starter yashil EMAS — 18-ov bandi)
| # | Shart (≤4 so'z) | Tekshiruv (xulq-atvor) | 💡 Ipucha |
|---|---|---|---|
| 1 | «Ro'yxatda 3 ta muammo» | `<ol>` ichida ≥ 3 ta bo'sh bo'lmagan `<li>` | «Yangi band `<li>` bilan ochiladi va `</li>` bilan yopiladi.» |
| 2 | «Kattasi yuqorida turadi» | ≥ 3 `<li>` bor VA har `<li>` oxiridagi son oldingisidan katta emas | «Har band oxirida jamini yozing. Kattasi yuqorida turadi.» |
| 3 | «Birinchisi ajralib turadi» | `.birinchi` qoidasida `background` yoki `background-color` bor (`C.cssProp`) | «Klass nomi nuqta bilan yoziladi: `.birinchi { background: … }`» |

Uchala ✓ → «Davom etish»; kod `pm-m2d3-koding` ga avto-saqlanadi; takrorlash-yo'li (89-qonun, faqat erkin rejimda). Nishon `topList` — birinchi urinishda (151: «Tekshirish» bosilib natija xato chiqqani — urinish).

### 7.3 Takeaway-gap (kompilyator yopilgach)
«Ro'yxatingiz endi o'zi aytadi: qaysi muammodan boshlash kerak.»

---

## 8. CODESTRIKE ARENA — 12 SAVOL

> 4 variant · 15 s · to'g'ri indekslar naqshsiz · taqsimot 3/3/3/3 · ekran-savol nusxasi emas (§144) · o'zini fosh qiladigan variant yo'q (§21/§110).

| # | Savol | Variantlar (0→3) | ✅ |
|---|---|---|---|
| 1 | Kuzatuvda muammoni nima ko'rsatadi? | 0 Odamning qilgan ishi · 1 Joyning rangi va bezagi · 2 Kassaning ish vaqti · 3 Afishadagi film nomi | **0** |
| 2 | Odam saytda yo'q narsani kassaga qo'ng'iroq qilib bilib oldi. Qaysi belgi? | 0 Odam voz kechgan · 1 Qayta-qayta bo'ladi · 2 Odam o'zicha yo'l topgan · 3 Hech qanday belgi yo'q | **2** |
| 3 | Qiz saytda narxni topolmay, chipta olmasdan sahifani yopdi. Qaysi belgi? | 0 Odam o'zicha yo'l topgan · 1 Odam voz kechgan · 2 Qayta-qayta bo'ladi · 3 Hech qanday belgi yo'q | **1** |
| 4 | Qaysi sharh muammoni aniq aytadi? | 0 «Kinoteatr juda yoqdi, yana kelaman» · 1 «Yomon emas, o'rtacha kinoteatr ekan» · 2 «Hammasi joyida, xodimlarga rahmat» · 3 «Saytda seans vaqti har hafta eski turadi» | **3** |
| 5 | Qaysi sharhdan muammo ko'proq topiladi? | 0 Besh yulduzli, maqtovga to'lasi · 1 Eng qisqa yozilgani · 2 Ertalab yozilgani · 3 Past yulduzli, sababi yozilgani | **3** |
| 6 | Chatda bir xil savolni ko'p odam alohida yozsa, bu nimani ko'rsatadi? | 0 Savolning javobi hech qayerda yo'q · 1 Odamlar gaplashishni yaxshi ko'radi · 2 Chat juda qiziqarli · 3 Savol juda oson | **0** |
| 7 | Muammoga qaysi ikki baho qo'yiladi? | 0 Narxi va rangi · 1 Kim yozgani va qachon · 2 Qanchalik tez-tez va qanchalik og'ir · 3 Uzunligi va tili | **2** |
| 8 | Muammo bahosi: tez-tez — 3, og'ir — 2. Ko'paytirsak, jami qancha? | 0 5 · 1 6 · 2 9 · 3 1 | **1** |
| 9 | Qaysi muammoning jami eng yuqori? | 0 Yilda bir marta bo'ladi va biroz noqulay · 1 Ba'zan bo'ladi va biroz noqulay · 2 Har safar bo'ladi va odam maqsadiga yetmaydi · 3 Kamdan-kam bo'ladi va vaqt ketadi | **2** |
| 10 | Airbnb (uy ijarasi xizmati) nimadan boshlangan? | 0 Uyga qo'yilgan matraslardan · 1 Yangi mehmonxonadan · 2 Reklama roligidan · 3 Telefon ilovasidan | **0** |
| 11 | Airbnb asoschilari muammoni qayerda ko'rdi? | 0 Internetdagi maqolada · 1 Televizordagi yangilikda · 2 Do'stlarining xatida · 3 O'z shahrida, anjuman kunlarida | **3** |
| 12 | Muammolarni 1, 2, 3 deb raqamlab, tartib bilan qaysi teg ko'rsatadi? | 0 `<ul>` · 1 `<ol>` · 2 `<img>` · 3 `<a>` | **1** |

**Indekslar:** 0 · 2 · 1 · 3 · 3 · 0 · 2 · 1 · 2 · 0 · 3 · 1 — sikl yo'q · 0→3 · 1→3 · 2→3 · 3→3 ✓
**Tell-tekshiruv (§204/§205):** 4-savol distraktorlari uzaytirildi (34–35 / ✓ 40 belgi); 8-savolda «ko'paytirsak» qo'shildi — «jami» qo'shish deb o'qilib, 5 ni tanlagan bola jazolanmasin; 9-savolda «lekin» olindi (bog'lovchi hamma variantda «va»). 12-savolda `<ul>` ham ro'yxat — lekin raqamlab tartib bermaydi; 1-Modul ta'rifi («tartib muhim bo'lsa — `<ol>`») bilan himoyalangan.

---

## 9. NISHONLAR (4 ta · inglizcha o'yin-nom · 151 — amaliy nishon birinchi urinishga)

| id | Nom | Tavsif (qilingan ishni aytadi — §184) | Trigger |
|---|---|---|---|
| `problemHunter` | **Problem Hunter!** | O'z atrofingizdan o'nta muammo yozdingiz. | s8 — 10 karta saqlandi (mehnat nishoni, 152) |
| `rankBuilder` | **Rank Builder!** | O'nta muammongizga baho qo'yib, reyting tuzdingiz. | s9 — 10/10 baho (mehnat nishoni, 152) |
| `sharpEye` | **Sharp Eye!** | Uch sharhning bahosini birinchi urinishda to'g'ri qo'ydingiz. | s11 — 3/3, birinchi urinish (151 + `AchRule` qatori) |
| `topList` | **Top List!** | Eng kuchli muammolaringizni tartib bilan sahifaga chiqardingiz. | s12 — uchala shart ✓, birinchi urinish |

🔴 M2-D2 nomlari (Pair Finder · Match Master · Card Writer · Page Maker) takrorlanmaydi ✓. Mentor rejimida nishon ko'rinmaydi (1-D).

---

## 10. FLASHCARD'LAR (10 ta · old tomoni SAVOL)

| # | Old | Orqa |
|---|---|---|
| 1 | Muammo borligini nima ko'rsatadi? | Odamning qilgan ishi — u o'zi «muammo bor» demaydi. |
| 2 | Muammoning uch belgisi qaysilar? | Qayta-qayta bo'ladi · Odam o'zicha yo'l topgan · Odam voz kechgan. |
| 3 | Qaysi belgi eng kuchli? | Odam o'zicha yo'l topgani — demak, u rostdan qiynalgan. |
| 4 | Qaysi sharh muammo topishga yordam beradi? | Past yulduzli, sababi yozilgan sharh. |
| 5 | Maqtov-sharhdan nega muammo topilmaydi? | Undan nima buzilgani bilinmaydi. |
| 6 | Chatda bitta savol qayta-qayta so'ralsa-chi? | Uning javobi hech qayerda yo'q — bu muammo. |
| 7 | Muammoga qaysi ikki baho qo'yiladi? | Qanchalik tez-tez bo'ladi va qanchalik og'ir. |
| 8 | Jami qanday chiqadi? | Ikki bahoni ko'paytiramiz: 3 marta 2 — jami 6. |
| 9 | Og'ir, lekin yilda bir marta bo'ladigan muammo-chi? | Jami past chiqadi — tez-tez bo'ladigan og'ir muammo oldinda turadi. |
| 10 | Airbnb muammoni qayerdan topgan? | O'z shahrida: mehmonxonalar to'lganini o'z ko'zi bilan ko'rgan. |

---

## 11. RECAPS (test-ekranlar uchun qayta-tushuntirish kartalari)

> Har scored test uchun 3 karta (metodist 28.09 — 1 kartadan 3 ga to'ldirildi; kinoteatr olamida, dars so'zlari bilan).

| Test | # | Sarlavha | Mazmun |
|---|---|---|---|
| s3 | 1 | «Odam aytmaydi — qiladi» | Hech kim «menda muammo bor» demaydi. Muammoni odamning qilgan ishi ko'rsatadi. |
| s3 | 2 | «Uch belgi» | Qayta-qayta bo'ladi · odam o'zicha yo'l topgan · odam voz kechgan. Bittasi bo'lsa ham — o'sha joyda muammo bor. |
| s3 | 3 | «Eng kuchlisi» | Odam boshqa yo'l qidirgan bo'lsa (qo'ng'iroq qildi, birovdan so'radi) — u rostdan qiynalgan. |
| s5 | 1 | «Maqtov yordam bermaydi» | «Juda yoqdi!» yoqimli, lekin undan nimani tuzatish kerakligi bilinmaydi. |
| s5 | 2 | «Sababsiz shikoyat ham» | «Juda yomon» deyilgan, lekin nima yomonligi yozilmagan bo'lsa — egasi qayerni tuzatishni bilmaydi. |
| s5 | 3 | «Kerakli sharh» | Past yulduzli va sababi aniq yozilgan sharh — tayyor muammo. |
| s10 | 1 | «Ikki savol» | Har muammoga ikki savol: qanchalik tez-tez bo'ladi va qanchalik og'ir. |
| s10 | 2 | «Ko'paytiramiz» | Ikki bahoni ko'paytiramiz: 3 marta 2 — jami 6. |
| s10 | 3 | «Og'ir, lekin kamdan-kam» | Yilda bir marta bo'ladigan og'ir muammoning jami past chiqadi. Tez-tez bo'ladigan va og'ir muammo oldinda turadi. |
| s13 | 1 | «Fikr — dalil emas» | «Kinoteatrlar zerikarli» degan bir kishining gapi nima buzilganini aytmaydi. |
| s13 | 2 | «Qilingan ish — dalil» | Odamlar bir savolni qayta-qayta bersa, o'zicha yo'l topsa yoki voz kechsa — shu dalil. |
| s13 | 3 | «Chatdagi takror savol» | Bir xil savolni har hafta turli odamlar yozsa, uning javobi hech qayerda yo'q. |


---

## 12. YAKUNIY EKRAN (s18) — 4 qator + uy-vazifa kartasi

1. Muammo odamning qilgan ishida ko'rinadi.
2. Past yulduzli, sababi yozilgan sharh — tayyor muammo.
3. Har muammoga ikki baho qo'yiladi: qanchalik tez-tez va qanchalik og'ir.
4. Airbnb ham muammoni o'z shahrida, o'z ko'zi bilan ko'rgan.

**Yakun-fe'li (§51):** jonli darsda «Bugun atrofimizdan muammo topib, unga baho qo'yishni o'rgandik.» · yakka rejimda
«Endi siz atrofingizdan muammo topib, unga baho qo'ya olasiz.» Ostida uy-vazifa kartasi (Blok 8, to'liq takror — §11).

---

## 13. QURUVCHIGA — DARVOZA-ESLATMALAR

- **91/108:** butun dars — savdo markazidagi kinoteatr. Brend faqat s7 (+ arena 10–11, flashcard 10). Boshqa mahsulot/ilova nomi YO'Q.
- **92:** har ekranda bitta ish — s8 (yozish) va s9 (baho) ataylab ajratilgan.
- **94:** s9 baho-kartalar bittalab; s2 lahzalar bittalab; s6 kartalar tap-ochilma (toggle, 46).
- **95:** misol-olam o'smir o'zi boradigan joy ✅.
- **159:** belgi-yorliqlar va baho-chiplari oldida emoji YO'Q; chap rang-chiziq YO'Q; bo'sh-holat ramkasi YO'Q.
- **1-D / 90:** mentor ekranida nishon/shaxsiy ball yo'q; `MentorTestStats`, `MentorPracticeStats` bor (s8/s9/s11/s12).
- **143:** mentor-rejimida `isMentor` bilan bloklangan element `disabled`, s11 da javobni doskaga chiqarish tugmasi (`.mstats-reveal`).
- **Til-darvozasi:** `npm run lint:til src/2-Modull/PmMuammoIzlash.jsx` — 0 error. Residue-grep: «og'riq · signal · radar · workaround · ov · tarozi · savat · ball (baho ma'nosida)» — o'quvchi matnida 0.
- **`lessonId`:** `pm-m2d3-v1`.

---

## 14. GATE S — FOYDALANUVCHI QARORINI KUTAYOTGAN NUQTALAR

1. **Kalit va joy.** `m2-03` kaliti band (JsVarsLesson). Taklif: yangi kalit **`m2-16`**, `n: 3`, keyingi darslarning `n` raqami bittaga suriladi (kalitlar o'zgarmaydi — LMS/progress uzilmasin). Fayl `src/2-Modull/PmMuammoIzlash.jsx`. Boshqa nom yoki kalit kerakmi?
2. **m7-03 `PmLesson28` taqdiri.** Mavzu M7 dan ko'chdi (v9). M7 dagi eski dars (a) olib tashlanadimi, (b) boshqa burchakka o'tadimi (masalan «muammoni odam bilan tekshirish»), yoki (c) hozircha tegilmaydimi? K4 ikki darsda bir modulda bo'lmasligi uchun shu qaror kerak.
3. **M2-D7 bilan ikki-savolli baho yaqinligi.** M2-D7 TAROZI (zarurat × yuk → savat) va bu dars (tez-tezlik × og'irlik → reyting) ikkalasi ham «ikki savol». Farq-dalili shapkada, lekin o'quvchi uchun yaqin tuyulishi mumkin. Qoldiramizmi yoki bu darsda bitta o'lchov (faqat tez-tezlik) bilan cheklanamizmi?
4. **10 ta muammo sinfda.** v9 «10 muammo» deydi; PM_DARS_ETALON 4-bo'lim 2-band «katta artefakt sinf(3)+uy(+2)» deydi. Taklif: bittalab-yozish (bir ekranda bitta qator) bilan sinfda 10 ta; ulgurmagan — uyda. Muqobil: sinfda 6 + uyda 4.
5. **«jami» so'zi** (baho ko'paytmasi) — «ball» platforma-ballidan ajratish uchun olindi. Ma'qulmi?
6. **«sharh (otziv)»** — birinchi ko'rinishda ruscha so'z qavsda. Yoki faqat «sharh»?

---

## METODIST KORREKTURASI (2026-09-28)

**Nima o'zgardi (faqat matn; ekran tuzilishi, indekslar va `INLINE_KEYS` o'zgarmagan):**
- **Grammatika:** «muammoingiz» → «muammongiz» (unli bilan tugagan so'z + «-ngiz»; s12, s14, uy vazifasi, nishon).
- **Ko'p ma'noli so'z:** «surma» (ko'zga suriladigan bo'yoq) → «yulduz-surgich». «Keys 🏠» eyebrow → «Haqiqiy voqea 🏠» (§203).
- **Joy so'zi (§211):** «Quyida», «Pastdagi» olib tashlandi (s1, s12). Sarlavhalar savol shakliga o'tdi (s1, s4, s8, s9, s11).
- **Test halolligi:** yakuniy test «eng kuchli dalil» deb so'rardi, s2 esa «eng kuchlisi — o'zicha yo'l topgan» deydi → savol «Qaysi biri muammo borligiga dalil bo'ladi?», RECAP moslandi. TEST-1 lead'dagi «topolmadi» to'g'ri variantdagi «topgan»ni takrorlardi va s4 sharhini ko'chirardi → yangi lahza (film davomiyligi). TEST-2: «sayt» faqat ✓ da edi (§204), ✓ 1,75× uzun edi → 1,26×. Arena 4 (uzunlik), 8 («jami» qo'shish deb o'qilmasin — «ko'paytirsak»), 9 («lekin» bog'lovchisi faqat bitta variantda edi).
- **s11 noaniqlik:** K1 «Har juma» («Ba'zan» deb ham himoyalanardi) → «Har kelganimda»; K3 «ba'zan ruscha, ba'zan o'zbekcha» (chastota emas, nom haqida) → «Ba'zan … ruscha chiqadi».
- **Keys K4** bankka sodiq (2007, San-Fransisko, anjuman, mehmonxonalar to'lgan, uchta matras; yangi raqam yo'q, «ikki yigit» qo'shilmadi). «Havo-matras» → «havo bilan shishiriladigan matras», «tadqiqot» → «maqola», «premyera» → «eng mashhur film chiqqan kuni».
- **Checklist** yorliqlari ≤5 so'z; YULDUZCHA qisqardi; **RECAPS** 1 → 3 karta har testga.
- **400 belgi:** s0 ≈ 345 (payoff mentor-pufak o'rnida), s4 ≈ 316, s6 ≈ 353, s11 ≈ 390 — o'lchandi (Intl.Segmenter).

**Tavsiyalar (14-bo'lim 5–6-savol):**
- **«jami» vs «ball»:** «ball»ni rad etish to'g'ri. Lekin «jami» o'smirga *qo'shish* bo'lib eshitiladi (3 va 2 → «jami 5»). Tavsiya: **«kuchi»** («Muammo kuchi: 6») — «eng kuchli uchtasi», «eng kuchli muammongiz» bilan bitta so'z oilasi. Foydalanuvchi «jami»ni qoldirsa, «ko'paytiramiz» har baho-ekranda yonida turadi (qo'yildi).
- **«sharh (otziv)»:** ekranga ruscha qavs chiqarmaslik; yulduzli kartaning o'zi «sharh»ni ochib beradi, «otziv»ni mentor bir marta og'zaki aytadi (0.1 va s0 MENTORGA yangilandi).

**Ochiq savollar / Quruvchiga:**
1. **s2 ≈ 440 belgi** (400 dan oshadi): qoida-qatori ochilganda lahza-kartalarni yig'ish (faqat vaqt + yorliq) yoki s2 ni ikki ekranga bo'lish kerak.
2. Belgi-nomi «Odam o'zicha yo'l topgan» — bridge B2 da «muammoni o'zicha hal qilishga urinadi» sinovdan o'tgan (§205-30). Bu darsda «yo'l topgan» qoldirildi (qisqa, lahzalar bilan mos); 👦 1-o'qishda tekshirilsin.
3. Baho-darajasi «Maqsadiga yetmaydi» mavhum bo'lishi mumkin («Kerakli ishini qilolmaydi» muqobili) — 👦 1-o'qishda tekshirilsin.
4. Ichki kalit `pm-m2d3-surma` ekranga chiqmaydi, lekin nom izchilligi uchun `pm-m2d3-surgich` qilish mumkin (Quruvchi qarori).

---
## ✅ GATE S — TASDIQLANDI (2026-09-28 10:33, foydalanuvchi; hamma javob tavsiya bo'yicha)
Javoblar: `PM_PIPELINE_STATE.md` F-0928-06 yozuvi. Quruvchi shu senariyni metodist korrekturasi bilan birga qo'llaydi.
