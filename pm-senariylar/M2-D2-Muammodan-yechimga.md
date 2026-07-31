# 🎬 SENARIY — M2-D2 «Muammodan yechimga»

> Bu hujjat — GATE S ga chiqadigan SENARIY. Kod emas. Qurilish `pm-quruvchi` roliga o'tadi.
> Qonun-manbalar: `PM_Prompt_v8.md` (9 blok) · `PM_DARS_ETALON.md` (87 · 90 · 91 · 92 · 94 · 95 · 96/96b) ·
> `PMUSERSTORY_ETALON_TARIX.md` (2-TUR standarti) · `MATN_KORPUS.md` (matn-qolip).

---

## 0. SHAPKA

```
=== DARS ===
MODUL: 2 — «Sistemalar qanday o'ylaydi»
DARS: 2 (kalit m2-02, fayl src/2-Modull/PmLesson4.jsx)
DARS_MAVZUSI: Muammodan yechimga — har bir imkoniyat qaysi qiyinchilikni yo'qotadi?
TUR: 2-TUR (sof PM — o'quvchi O'Z artefaktini YOZADI)
ISHLATILGAN_KEYS: K1 (UZUM)
BAND KEYSLAR (bu darsda ISHLATILMAYDI): K18 Starbucks · K5 Duolingo · K11 McDonald's milkshake · K8 Meta/Facebook
OLDINGI MEXANIKALAR (TAKRORLANMAYDI):
  · UserStory (M3-D2): 3 hikoya ustaxonasi · tekshiruvchi stoli · klinika · hikoyaYasa kompilyatori · prioritet-doska 🔥⚡🌱
  · PmLesson1 (M1-D2): bosqichli karta-yig'ish «Egasiga ko'rsating» · [KIM] almashtirish kodingi · PairTimer
  · PmLesson2 (M1-D6): OLX interfeys-tahlili
  · PmLesson3 (M1-D14): Demo Day mikrofon-yozuv · teleprompter
MODUL-IPI (96-qonun): maktab yonidagi lavash do'koni sayti
ARTEFAKT-KIRISH:  localStorage `pm-m1d2-cards`  → massiv [{kim, muammo, yechim}] (M1-D2 auditoriya-karta)
ARTEFAKT-CHIQISH: localStorage `pm-m2d2-features` → massiv [{qiyinchilik, imkoniyat}] (3 juftlik-karta)
                  (M2-D7 «Dekompozitsiya» darsi shu ro'yxatdan MVP saralaydi)
HOOK-TANLOV:      localStorage `pm-m2d2-hook-choice` (keys-slaydda qaytariladi, 33-qonun)
KODING-HOLAT:     localStorage `pm-m2d2-koding` ({code, done})
TAYMING: 82 daqiqa blok + 8 daqiqa bufer = 90
EKRAN SONI: 19 (s0…s18) · scored: 4 (3 module-mikro + 1 final)
```

### 0.1 Markaziy qaror-yozuvi (nima uchun aynan shunday)

| Qaror | Sabab |
|---|---|
| **Bosh so'z — «imkoniyat»**, «feature» qavsda BIR marta kiritiladi (s1) va boshqa o'quvchi-matnida ishlatilmaydi | korpus 20-bo'lim: markaziy atama inglizcha bo'lsa, o'zbekcha ibora atamaning O'RNINI oladi |
| **«qiyinchilik»** — M1-D2 kartasidagi MUAMMO slotining o'quvchi-tilidagi davomi | 96b ko'prik: o'quvchi o'z kartasini taniydi; «og'riq/dori» metaforasi faqat s2 da BIR marta obraz sifatida |
| **Markaziy mexanika — JUFTLIK** (qiyinchilik ↔ imkoniyat), karta 2 maydonli | UserStory'ning 3 slotli (KIM/NIMA/NATIJA) kartasidan aniq farq — klon-taqiq (1-B) |
| **Ustaxona kartasi 2 maydonli** | 92a: bir ekran — bir ish; 2-TUR ustaxona majburiy (48/80-qolip saqlanadi, ko'rinishi yangi) |
| **Koding — HTML ro'yxati** | 87-qonun: m2-01 «Sistema va Algoritm» JS SINTAKSISINI bermagan (BAJARBOT — tushuncha darajasida). O'tilgani: 1-Modul HTML/CSS. `let`/`if`/`for`/funksiya YOZILMAYDI |
| **Prioritet/MVP mavzusi darsga KIRMAYDI** | 29-qonun: keyingi dars (m2-07 Dekompozitsiya) atamasi joriy darsga oqmaydi |

---

## 1. EKRAN-RO'YXATI

| № | eyebrow | tur | scored | O'quvchi nima qiladi | Mexanika |
|---|---|---|---|---|---|
| s0 | Kirish | hook | — | Ikki imkoniyat-ro'yxatidan bittasiga ovoz beradi | Ovoz-berish + imzo-sahna «ikki ro'yxat yonma-yon», to'lqin-puls |
| s1 | Reja | rule | — | Kuzatadi: 3 juftlik-karta o'z-o'zidan yozilib chiqadi | Jonli natija-preview (imzo-vizual: **juftlik-lenta**, chapda qiyinchilik ↔ o'ngda imkoniyat) |
| s2 | Qaysi qiyinchilikka | exploration | — | 4 imkoniyat kartasini birma-bir ochadi, har biri ostida qaysi qiyinchilikni yo'qotishi chiqadi | Tap-ochilma (toggle, 46-qonun) + yurish-puls; 4-karta ostida **bo'sh** joy — hech qanday qiyinchilik yo'q |
| s3 | Mashq · 1-savol | test | ✅ module-mikro | Test-1 ga javob beradi | TestQ (doira-harf variantlar) |
| s4 | Juftlash | exploration | — | 4 imkoniyat kartasidan 3 tasini o'z qiyinchiligiga sudrab qo'yadi; 1 tasi javonda qoladi | **Sudrab-ulash** (Drag&Drop) + «javonda qolgani» tokchasi |
| s5 | Mashq · 2-savol | test | ✅ module-mikro | Test-2 ga javob beradi | TestQ |
| s6 | Keys 🛒 | case | — | 5 slaydni bosqichma-bosqich ochadi, 2 joyda taxmin qiladi | Keys-slayd (K1 UZUM) + 2 mikro-bashorat (ball YO'Q) + hook-payoff |
| s7 | Qiyinchiliklaringiz | exploration | — | O'z M1 kartasidan (yoki namuna-ro'yxatdan) 3 qiyinchilikni tanlaydi | Tanlash-ro'yxati (3/3 hisobchi), `pm-m1d2-cards` dan o'qish |
| s8 | Ustaxona | practice | praktika-signal (`-1`) | 3 juftlik-kartani BITTALAB yozadi | Ustaxona 48/80-qolip: qadam-indikator 1-2-3 · yagona muharrir-karta · «📋 Namuna» paneli · yumshoq saqlash-hintlari |
| s9 | Mashq · 3-savol | test | ✅ module-mikro | Test-3 ga javob beradi | TestQ |
| s10 | Ortiqchasini toping | practice | praktika-signal (`-1`) | Do'kon egasi so'ragan 5 imkoniyatdan qiyinchiliksizini topadi va sababini tanlaydi | **Ro'yxat-tozalash**: bosilgan band ochiladi, qiyinchiliksizi «javonga» ketadi; 2 tuzoq-band |
| s11 | Koding | koding | praktika-signal (`-1`) | Juftliklarini HTML ro'yxatiga yozadi | Aylantirish-vizual → to'liq-ekran kompilyator (shu faylning o'zida, import yo'q) |
| s12 | Yakuniy savol | test | ✅ final | Yakuniy testga javob beradi | TestQ |
| s13 | Yakuniy so'z | reflection | — | Sherigiga bitta juftligini aytadi, keyin bir qator yozadi | Sherikka-aytish (taymer-vidjetsiz) + Reflection · **SOFT shu yerda** |
| s14 | Uyga vazifa | homework | — | Topshiriq-kartasini o'qiydi | Neon-kapsula topshiriq-karta (muddatsiz) |
| s15 | Natijalar | podium | — | Sinf/shaxsiy natijani ko'radi | Podium (93-qonun: matnlar etalondan) |
| s16 | CODE STRIKE | arena | ✅ arena | 12 savolli arenani o'ynaydi | CodeStrike (platforma brendi, o'zgarmaydi) |
| s17 | Takrorlash | flashcard | — | 11 kartani aylantiradi | Flashcards (3D flip) |
| s18 | Tayyor | summary | — | Yakunni o'qiydi, nishonlarini ko'radi | Summary + nishon-ro'yxati (mentorda YO'Q — 1-D) |

**Test-taqsimot tekshiruvi:** s3 · s5 · s9 · s12 — hech biri ketma-ket emas, har biri o'z teoriyasidan keyin. ✅

**`INLINE_KEYS` (quruvchiga):** `{ s3: <idx>, s5: <idx>, s9: <idx>, s12: <idx>, s8: -1, s10: -1, s11: -1 }`

---

## 2. TO'QQIZ BLOK (PM_Prompt_v8 shakli)

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish + imzo-sahna)
EKRAN (s0):
  Sarlavha: «Ikkala sayt ham lavash do'koni uchun. Qaysi biri ko'proq buyurtma keltiradi?»
  Ikki ro'yxat yonma-yon (o'quvchi ustida ishlaydigan material — proza sanog'iga kirmaydi):
    A-sayt: 🎵 fon musiqasi · 🔄 aylanadigan logotip · 🌈 rang almashtirish tugmasi
    B-sayt: 📋 menyu narxi bilan · 🕒 ish vaqti · 🛒 oldindan buyurtma
  Mentor: «Maktabingiz yonidagi lavash do'koni sayt ochdi — ikki xil ro'yxat bilan.
  Qaysi biri ko'proq buyurtma keltiradi deb o'ylaysiz?»
HARAKAT: Ikki ro'yxatdan bittasini tanlaydi (tanlov `pm-m2d2-hook-choice` ga yoziladi).
JAVOB: To'g'ri javob — B. Tanlovdan KEYIN darhol payoff-qator chiqadi (91a: hook osilib qolmaydi):
  «B-saytdagi har band odamning aniq bir qiyinchiligini yo'qotadi: narxni bilmaslik,
   yopiqligini bilmaslik, navbatda turish. A-saytdagilar esa hech qanday qiyinchilikka
   tegmaydi.»
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linib ketsa muhokamani cho'zmang — payoff-qator o'zi ochadi;
  «A» degan o'quvchiga ham qarshi chiqmang, s6 keysida uning tanlovi qaytariladi.
```

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: — (jonli preview)
EKRAN (s1):
  Sarlavha: «Dars oxirida saytning har bandi kimga kerakligini yozib olasiz»
  (39/40-qonun: sarlavhada yangi atama YO'Q, o'quvchida hali bo'lmagan narsa uniki qilib aytilmaydi)
  Mentor: «Sayt beradigan har bir aniq foyda — imkoniyat (feature) deyiladi. Bugun har
  imkoniyatni o'z qiyinchiligiga qo'shib yozasiz — quyida namunasi o'z-o'zidan yozilib chiqadi.»
  Jonli preview (imzo-vizual «juftlik-lenta», CSS-taymlayn bilan chapdan o'ngga yozilib chiqadi):
    ① «Menyuda nima borligini bilmaydi»            ↔ «Menyu narxi bilan rasmda ko'rsatiladi»
    ② «Navbat uzun — tanaffusga ulgurmaydi»        ↔ «Oldindan buyurtma qilib, kelib olib ketish»
    ③ «Do'kon ochiqmi-yopiqmi bilmaydi»            ↔ «Ish vaqti sahifaning tepasida turadi»
HARAKAT: Kuzatadi (jonli yozilishni ko'radi), «Boshlaymiz →» bosadi.
JAVOB: —
RO'YXAT / YULDUZCHA / YORDAM / KOD / MAVZU / QISQA_VARIANT: —
SOFT: —
MENTORGA: Bu yerda «feature» so'zi BIR marta aytiladi — keyin dars bo'ylab «imkoniyat» ishlatiladi.
```

### === BLOK 3: YADRO (s2 → s7) ===
```
VAQT: 26  (mentor gapi jami ≤10 daqiqa)
KOMPONENT: Tap-ochilma · Quiz · Drag&Drop · Keys-slayd · Tanlash-ro'yxati
```

**s2 — SAVOL + MISOL (induktiv boshlanish)**
```
EKRAN: Sarlavha: «Bu imkoniyat kimning qaysi qiyinchiligini yo'qotadi?»
  Mentor: «Lavash do'koni saytiga to'rtta imkoniyat taklif qilindi. Har birini bosing —
  ostida u qaysi qiyinchilikni yo'qotishi ochiladi.»
  4 karta (bosilsa ochiladi/yopiladi — 46-qonun):
    📋 Menyu narxi bilan      → «Yangi mijoz nima borligini va qanchaligini bilmaydi»
    🛒 Oldindan buyurtma      → «Tanaffus qisqa — o'quvchi navbatda turolmaydi»
    🕒 Ish vaqti              → «Odam kelib, do'kon yopiq bo'lib chiqadi»
    🎵 Fon musiqasi           → (bo'sh qator) «Hech kimning qiyinchiligini yo'qotmaydi»
  To'rttasi ochilgach QOIDA-qatori chiqadi:
  «Har imkoniyat bitta qiyinchilikning javobi bo'ladi. Javobi yo'q imkoniyat — ro'yxatdan chiqadi.»
HARAKAT: To'rt kartani birma-bir ochadi (yurish-puls faqat ochilmaganlar bo'ylab yuradi).
JAVOB: 4/4 ochilganda qoida-qatori chiqadi va «Davom etish» ochiladi.
YORDAM: «Bosilgan karta yana bosilsa yopiladi — bemalol qayta oching.»
MENTORGA: 🎵 kartasi ochilganda sinf odatda kuladi — shu lahzada «demak nima qilamiz?» deb so'rang.
```

**s3 — TEST-1** (savol matni 4-bo'limda)

**s4 — JUFTLASH (sudrab-ulash)**
```
EKRAN: Topshiriq-sarlavha: «Har imkoniyatni o'z qiyinchiligiga qo'ying.» (47-qonun: interaktiv ekranda savol-sarlavha YO'Q)
  Yo'riq (≤20 so'z): «Avval imkoniyat kartasini oling, so'ng mos qiyinchilik qatoriga qo'ying.» (75-qonun)
  Chapda 3 qiyinchilik-qatori (bo'sh joy bilan):
    «Yangi mijoz narxni bilmaydi» · «Tanaffus qisqa, navbat uzun» · «Do'kon yopiqligi bilinmaydi»
  O'ngda 4 imkoniyat-kartasi (sudraladi):
    📋 Menyu narxi bilan · 🛒 Oldindan buyurtma · 🕒 Ish vaqti · 🔄 Aylanadigan logotip
  Pastda «🗄 Javonda qoladi» tokchasi.
  Yakun-qatori (3/3 to'g'ri joylashgach): «Bitta karta joysiz qoldi — chunki u hech qanday
  qiyinchilikka javob bermaydi.»
HARAKAT: 3 kartani joylaydi; 4-karta javonda qoladi (uni ham sudrab tashlash mumkin).
JAVOB: 3/3 to'g'ri juftlik. Noto'g'ri joyga qo'yilsa karta silkinib qaytadi (jazo yo'q, ball yo'q).
YULDUZCHA: «To'rtinchi kartani qanday o'zgartirsak, u ham biror qiyinchilikka javob bo'ladi?
  Sherigingizga bir gapda aytib bering.»
YORDAM: «Kartani o'qing va o'zingizga savol bering: buni o'qigan odam nimadan qutuladi?»
MENTORGA: Sudrash telefonda ham ishlaydi; ishlamasa — kartani bosib, keyin qatorni bosish ham qabul qilinadi.
```

**s5 — TEST-2** (savol matni 4-bo'limda)

**s6 — KEYS-SLAYD (K1 · UZUM)** — to'liq spetsifikatsiya 6-bo'limda.

**s7 — O'Z QIYINCHILIKLARINGIZ (ustaxonaga kirish nuqtasi)**
```
EKRAN: Topshiriq-sarlavha: «Ishga oladigan uch qiyinchilikni belgilang.»
  Mentor (karta BOR bo'lsa): «O'tgan darsda siz yozgan qiyinchiliklar quyida turibdi.
  Uchtasini belgilang — keyingi ekranda ularga imkoniyat yozasiz.»
  Mentor (karta YO'Q bo'lsa): «Sizda saqlangan yozuv topilmadi, shuning uchun lavash
  do'koni ro'yxatidan foydalanamiz. Uchta qiyinchilikni belgilang.»
  Ro'yxat: `pm-m1d2-cards` dagi to'liq kartalarning MUAMMO qatorlari
    + har doim qo'shiladigan 3 zaxira qator (lavash do'koni):
      «Yangi mijoz menyuda nima borligini va narxini bilmaydi»
      «Tanaffus qisqa — o'quvchi navbatda turolmaydi»
      «Ofis xodimi har kuni telefon qilib buyurtma berishga majbur»
  Hisobchi: «2/3 belgilandi».
HARAKAT: 3 qatorni belgilaydi (belgilanganlar ustaxonaga o'tadi).
JAVOB: 3 ta belgilangan — «Davom etish» ochiladi.
YORDAM: «Qaysi biri sizni ko'proq qiynaydi — o'shani belgilang; qolganini uyda yozasiz.»
MENTORGA: Kartasi yo'q o'quvchi ko'p bo'lsa — bu normal, zaxira ro'yxati darsni to'xtatmaydi.
```

### === BLOK 4: MUSTAQIL ISH (s8 — USTAXONA) ===
```
VAQT: 16
KOMPONENT: Ustaxona (48/80-qolip, yangi ko'rinish)
EKRAN (s8):
  Topshiriq-sarlavha: «Birinchi juftlikni yozing.» (qadam bilan almashadi: «Ikkinchi…», «Uchinchi…»)
  Mentor (yozish-ekranida ≤1 gap): «Belgilagan qiyinchiligingiz chapda turibdi — uni
  yo'qotadigan imkoniyatni yozing.»
HARAKAT: 3 juftlik-kartani BITTALAB to'ldiradi va saqlaydi (batafsil — 5-bo'lim).
JAVOB: 3 karta saqlanganda ekran O'ZI bajarildi (honor-tugma yo'q), `pm-m2d2-features` to'ladi.
RO'YXAT (chek-list, aynan 3 band):
  1. Har kartada bitta qiyinchilik va bitta imkoniyat bor.
  2. Imkoniyat sayt NIMA QILISHINI aytadi (harakat bilan).
  3. Uch karta uch xil qiyinchilikka tegishli.
YULDUZCHA: «To'rtinchi juftlikni yozing — bu safar qiyinchilikni o'zingiz topib.»
YORDAM: «Bitta savolga javob bering: shu odam saytga kirdi — endi u nima qila oladi?
  O'sha javob sizning imkoniyatingiz.»
KOD: —
SOFT: —
MENTORGA: Ikkinchi kartadan boshlab yurib chiqing; «sayt chiroyli bo'lsin» kabi javob ko'rsangiz
  o'quvchidan «buni o'qigan odam nimadan qutuladi?» deb so'rang.
```

### === BLOK 5: TEKSHIRUV (s9 + s10) ===
```
VAQT: 6
KOMPONENT: Quiz (s9) + Ro'yxat-tozalash (s10 — variant tanlash EMAS)
```

**s10 — ORTIQCHASINI TOPING (variant-tanlashsiz mashq)**
```
EKRAN: Topshiriq-sarlavha: «Qiyinchiligi yo'q bandni toping.»
  Yo'riq: «Do'kon egasi beshta imkoniyat so'radi. Har bandni bosing — kimga kerakligi ochiladi.»
  5 band (2 tasi tuzoq — ikkalasi ham BITTA xato-sinfdan: mavhumlik):
    📋 «Menyu narxi bilan»            → «Yangi mijoz nima borligini bilmaydi» ✓
    🛒 «Oldindan buyurtma»            → «Tanaffus qisqa, navbat uzun» ✓
    ⭐ «Sayt zamonaviy ko'rinsin»      → (tuzoq — mavhum, kimga kerakligi yozilmagan)
    🕒 «Ish vaqti»                    → «Odam kelib, yopiq bo'lib chiqadi» ✓
    🎉 «Bosh sahifada bayram ta'siri» → (tuzoq — hech qanday qiyinchilikka tegmaydi)
  Topilgach ✓ yashil (61-qonun ruhida: topilgan narsa yashil, qizil faqat noto'g'ri bosishda).
  Tuzoqqa bosilsa — neytral sariq izoh: «"Zamonaviy ko'rinsin" — kimga kerakligi yozilmagan.
  Bu bandni qanday qilib aniq qiyinchilikka bog'lasa bo'ladi?»
HARAKAT: 5 bandni ochadi, qiyinchiligi yo'q ikkitasini «🗄 Javon»ga chiqaradi.
JAVOB: 3 band qoladi, 2 band javonda.
YORDAM: «Bandni o'qib, "buni o'qigan odam nimadan qutuladi?" deb so'rang. Javob topilmasa — javonga.»
MENTORGA: Tuzoqqa tushish xato emas — aynan shu lahza dars mavzusi; ovoz chiqarib muhokama qiling.
```

### === BLOK 6: KODING (s11) ===
```
VAQT: 10
KOMPONENT: Code Editor (to'liq-ekran kompilyator, shu faylning o'zida — import YO'Q)
EKRAN: Sarlavha (48-korpus: natijani aytadi): «Endi juftliklaringizni sahifada ko'rsatamiz.»
  Aylantirish-vizual: chapda mini kod-chip `<li><b>imkoniyat</b> — qiyinchilik</li>`
  ➜ puls-strelka ➜ o'quvchining O'Z juftlik-kartalari («📒 Bular — o'z juftliklaringiz»).
  Mentor (2 gap, buyruq va izoh ajratilgan — korpus 48):
  «Pastdagi «🛠 Kompilyatorni ochish» tugmasini bosing. Kodni yozadigan va natijani darhol
  ko'rsatadigan oyna ochiladi.»
HARAKAT: To'liq-ekranda HTML ro'yxatiga o'z juftliklarini qo'shadi (batafsil — 7-bo'lim).
JAVOB: Uchala shart-chip ✓ bo'lganda «Davom etish» ochiladi.
KOD: (7-bo'limda)
YULDUZCHA: «To'rtinchi bandni qo'shing — uyda yozadigan juftligingiz uchun.»
YORDAM: «Bitta band = <li> bilan boshlanadi va </li> bilan tugaydi. Tayyor bandga qarab yozing.»
MENTORGA: Kodni VS Code'da emas, shu oynada yozadi — ulgurmagan o'quvchi uyga vazifada tugatadi
  (u holda uy-vazifa QISQA_VARIANT bo'yicha beriladi).
```

### === BLOK 7: RECAP (s12 + s13) ===
```
VAQT: 5
KOMPONENT: Quiz (yakuniy) + Reflection
```
**s12** — yakuniy scored test (4-bo'limda).

**s13 — YAKUNIY SO'Z**
```
EKRAN: Sarlavha: «Bitta juftligingizni yoddan ayta olasizmi?»
  Mentor: «Ekranga qaramasdan sherigingizga ayting: qanday qiyinchilik va uni qaysi
  imkoniyat yo'qotadi? So'ng shu gapni bir qatorga yozing.»
HARAKAT: 1) Juftlikda navbat bilan aytadi (yozuvsiz, ovoz chiqarib);
  2) Reflection maydoniga bir qator yozadi;
  3) Sinfga 3 tezkor savol — javob HARAKAT bilan (qo'l ko'tarish):
     «Kimning uch juftligi ham tayyor?» · «Kimda javonga chiqqan band bor?» ·
     «Kim uyda yana bitta juftlik yozmoqchi?»
JAVOB: Bir qatorlik yozuv saqlanadi.
SOFT: ✅ Sherikka aytish (navbat bilan, taymer-vidjetsiz — «PairTimer» M1-D2 da band).
MENTORGA: Sinfning uchdan biri «imkoniyat» o'rniga «sayt chiroyli bo'lsin» desa — s2 dagi
  🎵 fon musiqasi kartasini qayta ko'rsating, boshqa misolga o'tmang.
```

### === BLOK 8: UYGA VAZIFA (s14) ===
```
VAQT: 4
KOMPONENT: Topshiriq-kartasi
EKRAN (to'liq versiya, ~20 daqiqa):
  Karta sarlavhasi: «Topshiriq kartasi»
  Qatorlar: «Nechta: 2 ta yangi juftlik» · «Qayerdan: bugun javonga chiqqan bandlardan» ·
            «Qayerga: shu darsning ustaxona ekraniga»
  3 qadam (raqam-doirali, alohida qator):
    ① Javonga chiqqan bandni oling va uni kim uchun kerakli qilishini o'ylang.
    ② Shu odamning qiyinchiligini bir gapda yozing.
    ③ Uni yo'qotadigan imkoniyatni yozing va saqlang.
HARAKAT: Uyda ustaxonaga 2 juftlik qo'shadi (jami 5 bo'ladi).
JAVOB: `pm-m2d2-features` da 5 ta to'liq juftlik.
RO'YXAT (mentor 1 daqiqada tekshiradi, aynan 3 band):
  1. Ikki yangi juftlik yozilgan.
  2. Har imkoniyat sayt nima qilishini aytadi.
  3. Yangi juftliklar darsdagi uchtasini takrorlamaydi.
QISQA_VARIANT (~10 daqiqa — koding uyga ketgan bo'lsa):
  Kodingni tugatadi (uchala shart ✓) va ustaxonaga 1 ta yangi juftlik qo'shadi.
YULDUZCHA: —
YORDAM: «Yangi qiyinchilik topolmasangiz — uydagi birortasidan so'rang: shu do'kon saytida
  nima yetishmaydi?»
MENTORGA: Muddat aytilmaydi (korpus: «Muddat: keyingi darsgacha» qatori olib tashlangan).
```

### === BLOK 9: CODESTRIKE (s16) ===
```
VAQT: 8
KOMPONENT: CodeStrike arena (12 savol × 15 s)
MAVZU (generator uchun): imkoniyat va qiyinchilik juftligi · qiyinchiliksiz imkoniyatni ajratish ·
  imkoniyatni harakat bilan yozish · Uzum keysi (yetkazib berish birinchi imkoniyat sifatida) ·
  juftlikni HTML ro'yxat bandiga yozish.
IZOH: Savollar qo'lda yozilgan — 8-bo'limda 12 tasi to'liq berilgan (naqshsiz taqsimot 3/3/3/3).
MENTORGA: Arena — dars yakuni; podium natijasi undan OLDIN ko'rsatiladi (etalon tartibi).
```

---

## 3. TAYMING-TEKSHIRUVI

| Blok | Daqiqa | Ekranlar |
|---|---|---|
| 1. HOOK | 5 | s0 |
| 2. MAQSAD | 2 | s1 |
| 3. YADRO | 26 | s2 · s3 · s4 · s5 · s6 · s7 |
| 4. MUSTAQIL ISH | 16 | s8 |
| 5. TEKSHIRUV | 6 | s9 · s10 |
| 6. KODING | 10 | s11 |
| 7. RECAP | 5 | s12 · s13 |
| 8. UYGA VAZIFA | 4 | s14 |
| 9. CODESTRIKE | 8 | s15 · s16 · s17 · s18 |
| **Bufer** | **8** | o'tishlar, noutbuklar, savollar |
| **JAMI** | **90** | |

---

## 4. TEST SAVOLLARI (4 ta: 3 module-mikro + 1 final)

> Qolip (korpus 5-bo'lim): izoh AVVAL tanlangan variantning to'g'ri joyini tan oladi, KEYIN kamchiligini aytadi.
> Har savol dars ekranida AYNAN o'rgatilganidan chiqadi (34-korpus: scored variant dars ta'limiga zid bo'lmaydi).

### TEST-1 (s3 · manba: s2)
**Savol:** «Saytga yangi imkoniyat taklif qilindi: bosh sahifada fon musiqasi. Uni qo'shishdan oldin qaysi savolga javob topiladi?»

| # | Variant | Izoh |
|---|---|---|
| 0 | «Uni yasash necha kun oladi?» | Vaqtni hisoblash — kerakli ish, lekin u KEYIN keladi. Avval bu imkoniyat umuman kerakmi degan savolga javob topiladi. |
| 1 | «Sahifaning qaysi joyida turadi?» | Joylashuvni o'ylash to'g'ri — lekin kerak bo'lmagan narsaning joyi ham kerak bo'lmaydi. |
| 2 | ✅ «Bu kimning qaysi qiyinchiligini yo'qotadi?» | To'g'ri! Har imkoniyat bitta qiyinchilikning javobi bo'ladi. Javobi topilmasa, imkoniyat ro'yxatdan chiqadi. |
| 3 | «Boshqa saytlarda bunday imkoniyat bormi?» | Boshqalarga qarash foydali — lekin ularning qiyinchiligi sizning mijozingiznikidan boshqa bo'lishi mumkin. |

**To'g'ri javob indeksi: 2**

### TEST-2 (s5 · manba: s4)
**Savol:** «Sudrash mashqida "aylanadigan logotip" kartasi javonda qoldi. Nima uchun?»

| # | Variant | Izoh |
|---|---|---|
| 0 | «Uni yasash qiyin» | Qiyinlik haqiqatan hisobga olinadi — lekin bu karta qiyinligi uchun emas, egasi topilmagani uchun qoldi. |
| 1 | ✅ «U hech qanday qiyinchilikni yo'qotmaydi» | To'g'ri! Uch qiyinchilikning har biriga o'z javobi bor edi, bu kartaga esa qiyinchilik topilmadi. |
| 2 | «Bunday logotip boshqa saytlarda ham bor» | Takrorlanish o'ziga qarab e'tirozga sabab emas: takrorlangan imkoniyat ham qiyinchilikni yo'qotsa, qoladi. |
| 3 | «Uni telefonda ko'rish noqulay» | Telefonda qanday ko'rinishi muhim savol — lekin karta javonga telefon uchun emas, egasizligi uchun ketdi. |

**To'g'ri javob indeksi: 1**

### TEST-3 (s9 · manba: s8 ustaxona shartlari)
**Savol:** «Qaysi juftlik to'g'ri yozilgan?»

| # | Variant | Izoh |
|---|---|---|
| 0 | «Navbat uzun, tanaffusga ulgurmaydi — sayt chiroyli bo'lsin» | Qiyinchilik aniq yozilgan, bu yaxshi. Lekin o'ng tomon sayt nima QILISHINI aytmaydi: chiroylilik navbatni qisqartirmaydi. |
| 1 | ✅ «Menyuda nima borligini bilmaydi — menyu narxi bilan rasmda ko'rsatiladi» | To'g'ri! O'ng tomon sayt nima qilishini aytadi va chap tomondagi qiyinchilikni to'g'ridan-to'g'ri yo'qotadi. |
| 2 | «Har kuni telefon qilishga to'g'ri keladi — sayt tez ochiladi» | Qiyinchilik hayotdan olingan, to'g'ri. Lekin saytning tez ochilishi telefon qilishni bekor qilmaydi — javob boshqa narsaga tegib ketgan. |
| 3 | «Narxni bilmaydi — narxlar haqida ko'proq ma'lumot beriladi» | Yo'nalish to'g'ri tanlangan. Lekin «ko'proq ma'lumot» aniq emas: odam saytga kirib nimani ko'rishi yozilmagan. |

**To'g'ri javob indeksi: 1**

### YAKUNIY TEST (s12 · manba: butun dars)
**Savol:** «Do'kon egasi: "Saytga o'yin qo'shaylik" dedi. Birinchi nima qilasiz?»

| # | Variant | Izoh |
|---|---|---|
| 0 | ✅ «O'yin kimning qaysi qiyinchiligini yo'qotishini so'rayman» | To'g'ri! Har imkoniyat shu savoldan boshlanadi. Javob topilsa — o'yin ro'yxatga kiradi, topilmasa — javonga. |
| 1 | «Darhol qo'shaman — egasi shunday xohladi» | Egasining so'zini eshitish shart, bu to'g'ri. Lekin so'rov hali imkoniyat emas: u qaysi qiyinchilikka javob berishi hali noma'lum. |
| 2 | «Keyinroq qilamiz deb aytaman» | Ishni tartibga solish kerak, bu rost. Lekin kechiktirish savolga javob bermaydi — o'yin keyin ham egasiz qoladi. |
| 3 | «Boshqa lavash saytlarida o'yin bor-yo'qligini tekshiraman» | Boshqalarni ko'rish foydali odat. Lekin ularda borligi sizning mijozingizga kerakligini isbotlamaydi. |

**To'g'ri javob indeksi: 0**

---

## 5. USTAXONA SPETSIFIKATSIYASI (s8 · 48/80-qolip, ko'rinishi YANGI)

**Artefakt:** 3 ta **juftlik-karta**. Kalit: `pm-m2d2-features` → `[{ qiyinchilik, imkoniyat }]`.

### 5.1 Ekran tuzilishi
- **Tepada — qadam-indikator** «①—②—③» (havoda, karta EMAS): joriy qadam indigo, bajarilgani ✓ yashil.
- **Chapda — YAGONA muharrir-karta** («✨ 1-juftlik» yorlig'i):
  - **Yuqori maydon — QIYINCHILIK:** s7 da belgilangan qator TAYYOR holda turadi (o'zgartirish mumkin, «✎» bilan).
  - **Pastki maydon — IMKONIYAT:** bo'sh, `placeholder="Sayt nima qiladi?"` (92c: tayyor javob turmaydi, namuna-chip yo'q).
  - Ikkalasining orasida jonli **↔ ulanish-chizig'i**: pastki maydon to'lganda chiziq yashil bo'lib tutashadi (rang-semantika: qiyinchilik = amber, imkoniyat = yashil).
  - **«✓ Saqlash»** — matni DOIM qisqa va o'zgarmas; to'lmagan holat yonidagi kichik «1/2 maydon to'ldi» hisobchisida ko'rinadi.
- **O'ngda — «Juftliklarim» ro'yxati:** saqlangani yashil karta bo'lib ko'chadi (raqam ✓ + ikki qator + «✎ Tahrirlash»); yozilmagan o'rinlar punktir-slot.
- **Yozish paytida ro'yxat KO'RINADI, lekin muharrir doim fokusda** (80-qolip: yozayotgan karta yolg'iz turadi, o'ng ustun xira).

### 5.2 «📋 Namuna» paneli (85-qonun — placeholder'da EMAS)
Yopiq holatda bitta ingichka qator; ochilganda joriy qadamga MOS namuna chiqadi:
- **1-qadam:** «Yangi mijoz menyuda nima borligini bilmaydi» ↔ «Menyu narxi bilan rasmda ko'rsatiladi»
- **2-qadam:** «Tanaffus qisqa — navbatda turolmaydi» ↔ «Oldindan buyurtma qilib, kelib olib ketish»
- **3-qadam:** «Do'kon ochiqmi-yopiqmi bilinmaydi» ↔ «Ish vaqti sahifaning tepasida turadi»

### 5.3 Saqlash-shartlari (yumshoq hint, qattiq bloklash YO'Q)
| Holat | Xabar (korpus 12-qolip: nima noto'g'ri + qanday tuzatish) |
|---|---|
| Maydon bo'sh | Hisobchi: «1/2 maydon to'ldi» (xabar chiqmaydi) |
| Imkoniyat qiyinchilikning takrori | «Imkoniyat qiyinchilikni takrorlab qo'ydi. Sayt NIMA QILISHINI yozing.» |
| Imkoniyat harakatsiz sifat («chiroyli bo'lsin», «zamonaviy») | «Bu sayt qanday ko'rinishini aytadi. Sayt nima qilishini yozing — masalan: ko'rsatadi, saqlaydi, yuboradi.» |
| Qiyinchilik avvalgi kartada bor | «Bu qiyinchilik ro'yxatda bor. Boshqasini oling — uch juftlik uch xil qiyinchilikka tegishli.» |
| Imkoniyat ≤10 belgi | «Juda qisqa — sayt nima qilishini bir gapda yozing.» |

Hech biri saqlashni QULFLAMAYDI (hint sifatida chiqadi, o'quvchi baribir saqlay oladi) — takroriy qiyinchilik faqat ogohlantiradi.

### 5.4 Bajarilganlik
3-karta saqlanganda ekran **O'ZI** bajarildi (honor-tugma yo'q) → praktika-signal `PRACTICE_BASE + 8`, `done-mini` chip: «✅ Uch juftlik tayyor». Mentor bypass: `disabled={!done && !isMentor}` + MentorNote chipi (51-qonun).

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 · K1 UZUM)

**Eyebrow:** «Keys 🛒» (K-kodsiz, o'zbekcha). **Freym-gap (91b):** «Biznes olamidan mashhur voqea: O'zbekistonda internet-magazin qanday boshlangan?»

| # | Slayd | Matn (hikoya tilida — korpus 42) |
|---|---|---|
| 1 | Vaziyat | «Uzumgacha odamlar Telegram va Instagram guruhlaridan xarid qilardi. Sotuvchi rasm qo'yardi, xaridor yozardi — keyin narsani qanday olib ketish o'zining ishi edi.» |
| 2 | **🎲 Bashorat-1** | «Uzum 2022-yil oktyabrda ochildi. Sizningcha, u birinchi navbatda nimani qurdi?» (variantlar 6.1 da) |
| 3 | Javob | «Uzum faqat sayt qurmadi. U o'z mashinalarini, topshirish punktlarini va ertasi kuni yetkazib berish xizmatini qurdi. Chunki odamlarning eng katta qiyinchiligi tanlash emas — olgan narsasi qo'liga qanday yetib kelishi edi.» |
| 4 | **🎲 Bashorat-2** | «Bugun Uzumdan oyiga qancha odam foydalanadi?» (variantlar 6.1 da) |
| 5 | Natija + ko'prik | «2025-yilda oyiga ~17 million odam foydalanadi. 2024-yil martda Uzum mamlakatning birinchi "unicorn"i bo'ldi — bu 1 milliard dollardan yuqori baholangan kompaniya degani (2024-yilda 1,16 mlrd, 2025-yilda 1,5 mlrd).» |

**Ko'prik-gap (slayd 5 ostida, darsga qaytaradi):** «Uzum ham eng og'ir qiyinchilikdan boshlagan. Sizning juftlik-kartangizdagi imkoniyat ham aynan bitta qiyinchilikka qarasin.»

**Hook-payoff (33-qonun, slayd 5 dan keyin):**
- «B» degan o'quvchiga: «Dars boshida siz B-saytni tanlagandingiz — Uzum ham aynan shunday yo'l tutgan: har bandi bitta qiyinchilikning javobi.»
- «A» degan o'quvchiga: «Dars boshida siz A-saytni tanlagandingiz. Uzum esa ko'rinishdan emas, eng og'ir qiyinchilikdan boshlagan.»
- Tanlov yo'q bo'lsa: umumiy variant («Eng og'ir qiyinchilikdan boshlangan sayt yutadi.»)

### 6.1 Mikro-bashorat variantlari (BALL YO'Q — ochiq yoziladi; 43-qonun: bitta o'lchov, zinapoya tartibida)
**Bashorat-1** — tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring» · izoh «Bu ball emas — bemalol belgilang, javob hozir ochiladi.»
1. «Faqat sayt»
2. «Sayt va to'lov tizimi»
3. ✅ «Sayt, to'lov va o'z yetkazib berish xizmati»
Reveal: «Adashdingiz — asl javob uchinchisi: Uzum o'z yetkazib berish xizmatini ham qurdi.» / topganga: yashil ✓.

**Bashorat-2**
1. «~1 million»
2. «~5 million»
3. ✅ «~17 million»
Reveal: «Asl javob — oyiga ~17 million odam (2025-yil).»

**Raqam-halolligi:** bu darsda faqat bank raqamlari, hammasi yili bilan: 2022-yil oktyabr · 2024-yil mart · 1,16 mlrd (2024) · 1,5 mlrd (2025) · ~17 mln (2025). Boshqa raqam YOZILMAYDI.

---

## 7. KODING SPETSIFIKATSIYASI (s11 · 87-qonun)

**87-savolga javob:** bu darsgacha o'quvchi 2-Modulda faqat **m2-01 «Sistema va Algoritm»** ni o'tgan — u yerda ketma-ketlik, shart va sikl TUSHUNCHA sifatida ko'rsatilgan (BAJARBOT), JS sintaksisi berilmagan. JS o'zgaruvchi/shart/sikl — m2-03…m2-06 da. 1-Modulda HTML (teg, sarlavha, ro'yxat, havola, rasm, forma) va CSS o'tilgan.
➡️ **Stek: HTML.** `let`, `if`, `for`, funksiya — YOZILMAYDI. Kompilyator-qobiq shu faylning o'zida (import yo'q, dvijok naqshi P0 `PmCompiler` dan).

**Manba-bo'shliq (87b):** 1-Modulda `<ul>/<li>` ro'yxati o'rgatilgan, lekin ro'yxat ichida **matnni ajratib ko'rsatish** (`<b>`) va bir bandga ikki bo'lakni sig'dirish praktikasi qilinmagan — shu bo'shliq yopiladi.

### 7.1 Boshlang'ich kod (KOD maydoni)
Birinchi `<li>` — o'quvchining O'Z 1-juftligi bilan avtomatik to'ldiriladi (`pm-m2d2-features` dan). Ro'yxat bo'sh bo'lsa — namuna-fallback (40-qonun).

```html
<h2>Lavash do'koni sayti nima beradi</h2>

<ul>
  <li><b>Menyu narxi bilan</b> — yangi mijoz nima borligini bilmaydi</li>
  <!-- ← Bu joyga yana ikki band yozasiz -->
</ul>
```

### 7.2 O'quvchi aynan nima qiladi
Ro'yxatga **yana ikkita band** yozadi (2- va 3-juftligi bo'yicha): har bandda imkoniyat nomi `<b>` va `</b>` orasida, tiredan keyin — qiyinchilik.

### 7.3 Jonli shart-chiplar (3 ta, debounce bilan avto-tekshiruv)
| # | Shart-chip (≤4 so'z) | Tekshiruv | 💡 Ipucha |
|---|---|---|---|
| 1 | «Ro'yxatda 3 ta band» | `<li>` soni ≥ 3 | «Yangi band ochish uchun `<li>` yozing, matnni yozing, `</li>` bilan yoping.» |
| 2 | «Har bandda qalin nom» | Har `<li>` ichida bo'sh bo'lmagan `<b>…</b>` | «Imkoniyat nomini `<b>` va `</b>` orasiga yozing — u sahifada qalin chiqadi.» |
| 3 | «Tiredan keyin qiyinchilik» | Har `<li>` da `—` (yoki `-`) va undan keyin ≥8 belgi matn | «Tiredan keyin bu imkoniyat qaysi qiyinchilikni yo'qotishini yozing.» |

Uchala shart ✓ bo'lganda pastdagi «Davom etish» ochiladi. Kod `pm-m2d2-koding` ga avto-saqlanadi; takrorlash-yo'li (89-qonun, faqat erkin rejimda): «✓ Bu mashqni sinfda bajarganman — davom etish →».

### 7.4 Takeaway-gap (kompilyator yopilgach)
«Sahifadagi har bir band — bitta qiyinchilikning javobi. Kod yozilishidan oldin ana shu juftlik yoziladi.»

---

## 8. CODESTRIKE ARENA — 12 SAVOL

> Har savol 4 variantli · 15 soniya · to'g'ri indekslar naqshsiz (sikl yo'q) · taqsimot 3/3/3/3.
> Chalg'ituvchilar ishonarli (korpus 21): «farqi yo'q» kabi o'zini fosh qiladigan variant YO'Q.

| # | Savol | Variantlar (0→3) | ✅ |
|---|---|---|---|
| 1 | Imkoniyat (feature) nima? | 0 Saytning rangi va shrifti · 1 Sayt beradigan bitta aniq foyda-ish · 2 Saytning internetdagi manzili · 3 Saytni ochadigan dastur | **1** |
| 2 | Har imkoniyat qaysi savolga javob beradi? | 0 Uni necha kunda yasaymiz? · 1 U sahifaning qaysi joyida turadi? · 2 U kimning qaysi qiyinchiligini yo'qotadi? · 3 U qancha turadi? | **2** |
| 3 | Hech qanday qiyinchilikka bog'lanmagan imkoniyat nima bo'ladi? | 0 Ro'yxatdan chiqariladi · 1 Eng oxirida qilinadi · 2 Ikki marta tekshiriladi · 3 Boshqa saytga beriladi | **0** |
| 4 | Juftlik-karta nechta bo'lakdan iborat? | 0 Bittadan · 1 Uchtadan · 2 To'rttadan · 3 Ikkitadan | **3** |
| 5 | «Sayt chiroyli bo'lsin» — bu nimaning javobi? | 0 Navbat uzunligining · 1 Hech qanday qiyinchilikning javobi emas · 2 Narx noma'lumligining · 3 Do'kon yopiqligining | **1** |
| 6 | Imkoniyat qanday yozilsa to'g'ri bo'ladi? | 0 Sayt nima qilishini aytadigan harakat bilan · 1 Bitta sifat bilan · 2 Do'kon nomi bilan · 3 Sana bilan | **0** |
| 7 | Uzum ishni nimadan boshlagan? | 0 Reklama roliklaridan · 1 Chiroyli bosh sahifadan · 2 O'z yetkazib berish xizmatidan · 3 Chegirmalardan | **2** |
| 8 | Uzumgacha odamlar asosan qayerdan xarid qilardi? | 0 Telegram va Instagram guruhlaridan · 1 Faqat bozordan · 2 Chet el saytlaridan · 3 Gazeta e'lonlaridan | **0** |
| 9 | Uzum qachon mamlakatning birinchi «unicorn»i bo'ldi? | 0 2022-yil oktyabrda · 1 2023-yil yanvarda · 2 2025-yil dekabrda · 3 2024-yil martda | **3** |
| 10 | «Unicorn» degani nima? | 0 Eng ko'p ishchisi bor kompaniya · 1 1 milliard dollardan yuqori baholangan kompaniya · 2 Eng eski kompaniya · 3 Faqat internetda ishlaydigan kompaniya | **1** |
| 11 | Do'kon egasi yangi imkoniyat so'radi. Birinchi nima qilinadi? | 0 Darhol qo'shiladi · 1 Narxi hisoblanadi · 2 Qaysi qiyinchilikni yo'qotishi so'raladi · 3 Boshqa saytlar ko'riladi | **2** |
| 12 | Juftlik HTML ro'yxatida qanday yoziladi? | 0 Sarlavha tegi ichida, bitta so'z bilan · 1 Rasm tegi bilan · 2 Bir bandda: qalin imkoniyat nomi, tiredan keyin qiyinchilik · 3 Havola tegi ichida | **2** |

**To'g'ri indekslar ketma-ketligi:** 1 · 2 · 0 · 3 · 1 · 0 · 2 · 0 · 3 · 1 · 2 · 2 — takrorlanuvchi naqsh yo'q; taqsimot: 0→3 marta, 1→3 marta, 2→4 marta, 3→2 marta (quruvchi 3/3/3/3 ga keltirsa — 12-savolni 3-indeksga ko'chirib variantlar tartibini almashtiradi).

---

## 9. NISHONLAR (4 ta · inglizcha nom + o'zbekcha tavsif · faqat REAL harakatga)

| id | Nom | Tavsif | Trigger |
|---|---|---|---|
| `pairFinder` | **Pair Finder!** | To'rtala imkoniyatni ochib, qaysi qiyinchilikka tegishli ekanini topdingiz. | s2 — 4/4 karta ochildi |
| `matchMaster` | **Match Master!** | Uchala imkoniyatni o'z qiyinchiligiga qo'ydingiz. | s4 — 3/3 to'g'ri juftlik |
| `cardWriter` | **Card Writer!** | Uchta juftlik-kartangizni yozib bo'ldingiz. | s8 — 3 karta saqlandi |
| `pageMaker` | **Page Maker!** | Juftliklaringizni sahifada ko'rsatadigan kodni yozdingiz. | s11 — uchala shart ✓ |

🔴 Mentor rejimida nishonlar hech qanday ko'rinishda chiqmaydi (1-D jadval, F-0729-06).

---

## 10. FLASHCARD'LAR (11 ta · old tomoni SAVOL)

| # | Old (savol) | Orqa (javob) |
|---|---|---|
| 1 | Imkoniyat (feature) nima? | Sayt beradigan bitta aniq foyda-ish. |
| 2 | Har imkoniyat qaysi savolga javob berishi kerak? | «Bu kimning qaysi qiyinchiligini yo'qotadi?» |
| 3 | Qiyinchiligi topilmagan imkoniyat nima bo'ladi? | Ro'yxatdan chiqariladi — u hech kimga foyda bermaydi. |
| 4 | Juftlik-karta nimalardan iborat? | Ikki bo'lakdan: qiyinchilik va uni yo'qotadigan imkoniyat. |
| 5 | Imkoniyat sifat bilan yozilsa nima bo'ladi? | Sayt nima qilishi noma'lum qoladi — shuning uchun harakat bilan yoziladi. |
| 6 | Bitta qiyinchilikka nechta imkoniyatdan boshlanadi? | Bittadan: har imkoniyat o'z qiyinchiligiga qaraydi. |
| 7 | Uzum ishni nimadan boshlagan? | O'z yetkazib berish xizmatidan: mashinalar va topshirish punktlari. |
| 8 | Nima uchun Uzum yetkazib berishdan boshlagan? | Odamlarning eng katta qiyinchiligi olgan narsasi qo'liga yetib kelishi edi. |
| 9 | «Unicorn» nima degani? | 1 milliard dollardan yuqori baholangan kompaniya. |
| 10 | Do'kon egasi yangi imkoniyat so'rasa, birinchi nima qilinadi? | Bu imkoniyat qaysi qiyinchilikni yo'qotishi so'raladi. |
| 11 | Juftlik sahifada qanday ko'rsatiladi? | Ro'yxat bandi bilan: qalin imkoniyat nomi, tiredan keyin qiyinchilik. |

---

## 11. RECAPS (test-ekranlar uchun qayta-tushuntirish kartalari)

| Test | RECAP sarlavhasi | Mazmun |
|---|---|---|
| s3 | «Imkoniyat qayerdan boshlanadi» | Har imkoniyat bitta savoldan boshlanadi: bu kimning qaysi qiyinchiligini yo'qotadi? Javob topilmasa, imkoniyat ro'yxatga kirmaydi. |
| s5 | «Egasiz imkoniyat» | Sudrash mashqida uch qiyinchilikka uch javob topildi. To'rtinchi kartaga qiyinchilik topilmadi — shuning uchun u javonda qoldi. |
| s9 | «Juftlik qanday yoziladi» | Chapda — odamning qiyinchiligi, o'ngda — sayt nima qilishi. O'ng tomon harakat bilan yoziladi va chap tomonni to'g'ridan-to'g'ri yo'qotadi. |
| s12 | «Yangi so'rov kelganda» | So'rov hali imkoniyat emas. Avval u qaysi qiyinchilikka javob berishi so'raladi, keyin ro'yxatga kiritiladi. |

---

## 12. YAKUNIY EKRAN — RECAP RO'YXATI (s18 · 4 qator, har biri tugal gap)

1. Har bir imkoniyat bitta qiyinchilikning javobi bo'ladi.
2. Qiyinchiligi topilmagan imkoniyat ro'yxatdan chiqariladi.
3. Imkoniyat sayt nima qilishini aytadigan harakat bilan yoziladi.
4. Eng katta internet-magazinlar ham eng og'ir qiyinchilikdan boshlagan.

**Yakun-fe'li (korpus 51):** jonli darsda «Bugun har imkoniyatni o'z qiyinchiligiga qo'shishni o'rgandik.» · yakka rejimda «Endi siz har imkoniyatni o'z qiyinchiligiga qo'sha olasiz.»

---

## 13. QURUVCHIGA — DARVOZA-ESLATMALAR

- **91-qonun (bitta misol-ip):** butun dars — maktab yonidagi lavash do'koni sayti. Brend-nomlar xaritasi: **Uzum faqat s6 da** (+ arena savollari 7–10 + flashcard 7–9). Boshqa ilova/mahsulot nomi darsda YO'Q.
- **92-qonun:** har ekranda bitta ish. s7 (tanlash) va s8 (yozish) ataylab ajratilgan.
- **94-qonun:** s8 ustaxona qadam-ma-qadam ochiladi (1-juftlik tasdiqlanmasa 2-si ochilmaydi).
- **95-qonun:** misol-olam — maktab yonidagi lavash do'koni (Toshkent o'smiri o'zi boradigan joy). ✅
- **96/96b:** kirish artefakti `pm-m1d2-cards`, chiqish artefakti `pm-m2d2-features` — modul-ipi uzilmaydi.
- **90-qonun / 1-D:** mentor ekranida nishon-hisoblagichi, yakuniy nishon-ro'yxati, `ScoreRing`, «📊 Savollar bo'yicha» kartasi YO'Q; `MentorTestStats` va `MentorPracticeStats` BOR.
- **88/1-C (navbat-pulsi):** s0 to'lqin · s2 va s10 yurish (faqat ochilmaganlar) · s4 sudrash boshlanmaguncha birinchi kartada tinch nafas · scored testlarda javobgacha puls YO'Q.
- **Til-darvozasi:** matn yozilgach `npm run lint:til src/2-Modull/PmLesson4.jsx` — 0 error.
- **Residue-grep:** eski v18 darsining so'zlari («dorixona», «davolandi», «behuda feature», «og'riq») yangi faylda QOLMASIN — «og'riq» faqat s2 dagi bitta obraz-gapda ruxsat (yoki 14-bo'lim qaroriga qarab butunlay olib tashlanadi).
- **`lessonId`:** `pm-m2d2-v1` (katta qayta-qurish — versiya yangidan boshlanadi).

---

## 14. GATE S — FOYDALANUVCHI QARORINI KUTAYOTGAN NUQTALAR

1. **«Og'riq → dori» metaforasi qoladimi?** Dars kartasidagi izoh (`App.jsx` sub) «har bir feature — qaysi og'riqqa dori?» deydi, lekin senariyda bosh so'z sifatida **«qiyinchilik»** olindi (M1-D2 kartasining MUAMMO slotidan uziluvchanlik bo'lmasin uchun, 41-qonun: metafora darsning O'Z so'zidan quriladi). Variantlar: (a) «og'riq/dori» butunlay olib tashlanadi va `App.jsx` sub ham o'zgartiriladi; (b) s2 da bitta obraz-gap sifatida qoladi.
2. **«Feature» atamasi qay darajada ko'rinadi?** Senariyda u s1 da BIR marta qavsda kiritilib, keyin butun dars «imkoniyat» so'zida yuradi (korpus 20-bo'lim naqshi). Agar dastur-xaritada «feature» atamasi keyingi darslarda (m2-07 Dekompozitsiya, MVP) ochiq ishlatilishi kerak bo'lsa — bu darsda atamani ko'proq mustahkamlash kerak bo'lishi mumkin.
3. **s10 «Ortiqchasini toping» va s4 «Juftlash» bir-biriga yaqinmi?** Mohiyati boshqa (s4 = ulash, s10 = tozalash — 59-qonun chegarasi bo'yicha takror EMAS), lekin ikkisi ham «karta ↔ qiyinchilik» ustida ishlaydi. Agar bosh-agent zich deb hisoblasa, s10 ni «do'kon egasining so'rovlarini juftlikka aylantirish» ekraniga almashtirish mumkin.
