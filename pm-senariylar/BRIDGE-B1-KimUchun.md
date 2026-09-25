# Bridge · «Kim uchun qilyapmiz?» — dars rejasi

> Holat: QORALAMA v2 (OLX) → **metodist korrekturasi ✅ (2026-09-23, jurnal fayl oxirida)** → **foydalanuvchi bilan kelishildi ✅ (2026-09-23: 12- va 15-ekran qoladi, tayyor g'oyalar tanlandi)** → qurish.
> v1 (lavash) foydalanuvchi qarori bilan rad etildi (2026-09-23): «haqiqiy misollar kerak».

## 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | JavaScript'ga qo'shiladigan o'quvchi (1 dars — shu) · React'ga qo'shiladigan o'quvchi (3 darsning 1-si) |
| Mavzular | Kim mening foydalanuvchim? · Struktura — foydalanuvchi birinchi nimani ko'radi |
| Maqsad | O'quvchi o'zi tanlagan g'oya **kim uchun** ekanini aniq yozadi va shunga qarab sahifasida **birinchi nima turishini** hal qiladi |
| Misol-ip | **OLX** — boshidan oxirigacha. Ikki xil odam: narsasini sotmoqchi bo'lgan va arzon narsa izlayotgan |
| Keys | K8 Facebook — «avval bitta aniq guruh» (faqat bank-faktlari: 2004 · bitta universitet · ikki yildan keyin hamma uchun) |
| O'z ishi | O'z g'oyasi kartasi (KIM · MUAMMO · YECHIM) + sahifasining birinchi tartibi. Karta keyingi bridge darsga o'tadi |
| Format | 21 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

## 2. Darsning uch asosiy fikri

1. **Auditoriya — «kam odam» emas, «aniq odam, aniq vaziyatda».** OLX'ga ikki xil odam keladi: biri sotadi, biri qidiradi. Saytda ikkalasiga ham o'z joyi bor.
2. **Sahifaning eng ko'zga tashlanadigan joyida — shu odam birinchi qiladigan ish.** OLX'da katta qidiruv qatori: xaridor narsa izlab keladi.
3. **OLX'ni ko'pchilik taniydi — yangi saytni hali hech kim tanimaydi.** Shuning uchun yangi sayt tepasida avval «bu nima va kim uchun» yoziladi. *(Bu bridge'ning o'z fikri — asl darslarda yo'q.)*

Ip-zanjir: **ikki odam → karta → birinchi ekran → o'z g'oyasi.**

> **OLX halolligi (butun dars uchun):** OLX haqida faqat sahifada **ko'rinib turgan** narsa aytiladi — qidiruv qatori, kategoriyalar, «E'lon berish» tugmasi, sotuvchiga xaridor yozishi. OLX tarixi, raqamlari (necha foydalanuvchi, necha e'lon), ichki qarorlari («OLX shuning uchun qidiruvni tepaga qo'ydi») aytilmaydi — «nega?» savoliga javob OLX'ning qarori sifatida emas, **auditoriyaning harakati** sifatida beriladi («xaridor narsa izlab keladi»). Tugma yozuvi qurishda olx.uz'ning hozirgi o'zbekcha ko'rinishi bilan solishtiriladi (6-bo'lim, 4-band).

---

## 3. Ekranlar

### KIRISH

**1 · Hook** — ovoz berish, javob hozir ochilmaydi
- Sarlavha: «OLX sayti kim uchun qilingan?»
- Variantlar: Telefoni bor har qanday odam uchun · Biror narsa sotadigan yoki oladiganlar uchun · Faqat o'z do'koni bor katta sotuvchilar uchun
- Mentor: «Javobni birozdan keyin birga bilib olamiz.»
- Nega shunday: savol o'quvchining o'z tajribasidan — ko'pchilik OLX'ga biror marta kirgan.

**2 · Maqsad** — jonli preview (imzo-vizual)
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Dars oxirida o'zingiz tanlagan g'oya kim uchun ekanini yozasiz. Keyin uning sahifasida birinchi nima turishini hal qilasiz.»
- Vizual: chapda karta o'zi yozilib chiqadi (KIM · MUAMMO · YECHIM) → qatorlari o'ngdagi sahifaning bo'limlariga uchib o'tadi. **Karta sahifaga aylanadi** — butun darsning surati shu. *(«Karta» so'zi bu yerda matnda aytilmaydi — nom 7-ekranda beriladi.)*

### 1-QISM · KIM UCHUN

**3 · Ikki odam** — bosib ochish
- Sarlavha: «OLX'ga kirgan ikki odamning maqsadi bir xilmi?»
- Ikki karta: «Velosipedini sotmoqchi bo'lgan o'quvchi» · «Arzon telefon izlayotgan o'quvchi». Bosilganda OLX sahifasida har biri birinchi bosadigan joy yonadi: biri — «E'lon berish», ikkinchisi — qidiruv qatori.
- Xulosa (hook javobi shu yerda ochiladi): «OLX'ga ikki xil odam keladi: biri sotadi, biri qidiradi. Saytdan foyda oladigan shunday aniq odamlar guruhi saytning **auditoriyasi** deyiladi.»

**4 · «Hamma uchun» almashtirgichi**
- Sarlavha: «"Hamma uchun" yozilgan sahifa sotuvchiga tushunarlimi?»
- Almashtirgich: «Bizda hamma narsa bor!» ↔ «Keraksiz narsangizni uydan chiqmay soting». Ikkinchisida sotuvchi-karta «bu men!» deb yonadi.
- Xulosa: «Hammaga yozilgan gapda hech kim o'zini tanimaydi.»

**5 · TEST-1** (ball)
- Lead: «Sahifa tepasida faqat "Bizda hamma narsa bor!" deb yozilgan.» Cue: «Nega bunday sahifa kam odamni qiziqtiradi?»
- ✓ Uni o'qigan odam "bu aynan men uchun" demaydi · Uni qurish oddiy sahifadan ancha qimmatga tushadi · Unda sahifalar oddiy saytdan sekinroq ochiladi · Uni reklamasiz internetda hech kim topolmaydi

**6 · Keys: Facebook** — bashorat + 3 slayd
- Bashorat: «Facebook 2004-yilda ochilganda kimlar uchun edi?» — Butun dunyodagi odamlar uchun · Bitta mamlakat aholisi uchun · Bitta universitet talabalari uchun
- Slaydlar: bitta universitet → boshqa universitetlar → ikki yildan keyin hamma uchun.
- Ko'prik: «Eng katta ijtimoiy tarmoq ham avval bitta aniq guruh uchun ochilgan. Yangi g'oya ham shunday boshlanadi.»

**7 · Kartani yig'ing** — bittalab tanlash
- Sarlavha: «OLX sotuvchisi haqida uch savolga javob bera olasizmi?»
- Uch qadam, har birida 3 variant, noto'g'risi sababini aytib qaytadi:
  - KIM → ✓ Eski narsasini sotmoqchi bo'lgan odam (✕ «Hamma odamlar»)
  - MUAMMO → ✓ Sotish uchun bozorda kun bo'yi turishi kerak (✕ «Sayt zerikarli ko'rinadi»)
  - YECHIM → ✓ Uydan chiqmay e'lon beradi, xaridor o'zi unga yozadi (✕ «Chiroyli sayt»)
- Yig'ilgach nom beriladi: «Uch javob bitta yozuvga yig'ildi — shu yozuv **auditoriya-karta** deyiladi.»

**8 · TEST-2** (ball)
- «Qaysi g'oyada KIM, MUAMMO va YECHIM — uchalasi ham bor?»
- ✓ Avtobus qachon kelishini bilmagan o'quvchiga uni xaritada ko'rsatadigan sayt · Sportni yaxshi ko'radigan o'quvchilar uchun chiroyli va zamonaviy sayt · Maktab o'quvchilari uchun kerakli hamma narsa bir joyda turgan sayt · Oshxonaga onlayn buyurtma berish mumkin bo'lgan qulay va juda tez ishlaydigan sayt

**9 · O'z g'oyangiz** — ustaxona, bittalab yozish
- Sarlavha: «Qaysi g'oya ustida ishlaysiz — u kim uchun?»
- 3 maydon navbat bilan: KIM · MUAMMO · YECHIM. Pastda gap yig'iladi: «Saytimga … kiradi. Ular … . Saytim ularga … .»
  - Maydon-namunalari kesim shaklida (§37 — istalgan KIM bilan gap tugal chiqsin): KIM «avtobus kutadigan o'quvchilar» · MUAMMO «avtobus qachon kelishini bilmay kutishadi» · YECHIM «avtobus qayerdaligini xaritada ko'rsatadi».
- KIM ga «hamma» yozilsa: «"Hamma" — bu hali auditoriya emas. Kim, qaysi vaziyatda?»
- G'oyasi yo'q o'quvchiga 4 ta tayyor g'oya (foydalanuvchi tasdiqladi, 2026-09-23) — bittasini tanlab, o'z so'zi bilan davom etadi:

  | Olam | KIM | MUAMMO | YECHIM |
  |---|---|---|---|
  | Futbol | Hovlida futbol o'ynaydigan o'smirlar | Maydonga borsa, band bo'lib chiqadi | Bo'sh vaqtni ko'rsatib, oldindan band qilish |
  | O'yin | Onlayn o'yin o'ynaydigan o'quvchilar | Tasodifiy sheriklar o'yinni tashlab ketadi | Darajasi va vaqti mos jamoadosh topish |
  | Sinf | Sinf sardori | Sovg'aga pul yig'ilganda kim berdi, kim bermadi — chalkashadi | Kim berganini belgilab boradigan ro'yxat |
  | Kiyim | Internetdan kiyim oladigan o'smir | O'lcham to'g'ri kelmay qoladi, qaytarish qiyin | Bo'y va vaznni kiritsa, mos o'lchamni tavsiya qiladi |

  Matnlar qurishda metodist bilan so'nggi marta silliqlanadi (§37 — gap-qolipiga tushganda tugal chiqsin).
- Saqlanadi → keyingi bridge darsda shu karta ochiladi. Ekranda faqat «✓ Karta saqlandi» (kelajak-va'da ekranga chiqmaydi, §17).

### 2-QISM · BIRINCHI NIMA KO'RINADI

**10 · OLX'ning bosh sahifasi** — bosib ochish
- Sarlavha: «Nega OLX bosh sahifasida "E'lon berish" ko'zga tashlanadi?»
- OLX bosh sahifasining sxemasi (brendsiz, ko'rinadigan tartib bilan). Uch joy bosiladi, har biri kim uchun ekanini ochadi:
  - qidiruv qatori — «Aniq narsa izlab kelgan xaridor uchun»
  - kategoriyalar — «Nima olishini hali bilmagan xaridor uchun: bo'limlarni ko'rib chiqadi»
  - «E'lon berish» tugmasi — «Narsasini sotmoqchi bo'lgan odam uchun»
- Xulosa: «Eng ko'zga tashlanadigan joyga auditoriya birinchi qiladigan ish qo'yiladi.»

**11 · TEST-3** (ball)
- «OLX'da qidiruv qatori nega eng katta va eng ko'zga tashlanadigan joyda turadi?»
- ✓ Xaridor saytga kirishi bilan kerakli narsani qidiradi · Sotuvchi e'lonini shu qidiruv qatori orqali joylaydi · Qidiruv qatori sahifani chiroyliroq ko'rsatadi · Kategoriyalar qidiruv qatorisiz ishlay olmaydi

**12 · «Yangi saytni-chi?»** — almashtirgich (darsning burilish nuqtasi)
- Sarlavha: «OLX'ni ko'pchilik taniydi. Yangi saytni-chi?»
- Yangi g'oyaning sahifasi ikki holatda: tepada qidiruv ↔ tepada «bu nima va kim uchun». Birinchisida birinchi marta kirgan odam «bu nima?» deb chiqib ketadi.
- Xulosa: «Yangi saytni hali hech kim tanimaydi. Shuning uchun uning tepasida avval "bu nima va kim uchun" yoziladi.»

**13 · Kartadan sahifaga** — bosib ochish
- Sarlavha: «Yangi sahifadagi beshta bo'lim nima qiladi?»
- 5 bo'lim bittalab: Birinchi blok · Muammo · Qanday ishlaydi · Isbot · Tugma.
  - Birinchi blok — «Kirgan odam birinchi ko'radigan joy: bu nima va kim uchun» (12-ekrandagi hodisaga shu yerda nom beriladi)
- Ko'prik-animatsiya: 7-ekrandagi OLX-sotuvchi kartasi yonida turadi — «Muammo» bosilsa kartaning MUAMMO qatori unga uchib kiradi, «Qanday ishlaydi» ga YECHIM, birinchi blok KIM ga qarab yoziladi.

**14 · TEST-4** (ball)
- «Yangi sahifada tugma qayerda turishi kerak?»
- ✓ Muammo va yechim ko'rsatilgandan keyin, oxirroqda · Eng tepada, hatto birinchi blokdan ham oldinda · Muammo bo'limidan oldin, sahifa o'rtasida · Faqat menyuning ichida, alohida sahifada

**15 · Tartibga qo'ying** — sudrash + simulyatsiya
- Sarlavha: «Sotuvchi bu sahifani oxirigacha o'qiydimi?»
- Ochiq aytiladi (sarlavha ostida, birinchi gap): «Bu sahifa o'ylab topilgan, OLX'niki emas. Tasavvur qilaylik: OLX sotuvchilar uchun alohida sahifa ochdi.» 5 bo'lim aralash turadi → o'quvchi sudrab tartiblaydi → sotuvchi sahifani tepadan pastga «o'qiydi»: tartib to'g'ri bo'lsa tugmagacha yetadi, buzuq bo'lsa yarim yo'lda chiqib ketadi.
- «Isbot» bo'limida OLX raqami yoki o'ylab topilgan son yo'q — faqat «Sotuvchilar fikri» kabi umumiy yorliq.
- Muvaffaqiyat: «Sotuvchi muammosini ko'rdi, yechimini tushundi va tugmani bosdi.»
- Buzuq tartib: «Sotuvchi yarim yo'lda chiqib ketdi: tugmani ko'rdi, lekin nega bosishini hali bilmaydi.»

**16 · O'z sahifangiz** — ustaxona
- Sarlavha: «Sahifangizning tepasida nima turadi?»
- 9-ekrandagi kartadan sahifa o'zi yig'iladi: MUAMMO va YECHIM o'z bo'limida. O'quvchi 2 qator yozadi: **birinchi blok gapi** · **tugma matni**. «Isbot» bo'limi «Birinchi foydalanuvchilar fikri — keyin qo'shiladi» holatida (yangi g'oyada isbot yo'q — to'qilmaydi).
- Yonida sahifa jonli ko'rinadi.

### AI BILAN

**17 · AI bilan birinchi blok**
- Sarlavha: «AI birinchi blokingizga qanday gaplar taklif qiladi?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI sizga sarlavha variantlarini taklif qiladi. Qaysi biri qolishini o'zingiz tanlaysiz.»
- O'quvchining kartasi va yozgan gapidan so'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
  > «Men [KIM] uchun sayt qilyapman. Ular [MUAMMO]. Saytim ularga [YECHIM]. Sahifaning birinchi bloki uchun 3 xil qisqa sarlavha yozib bering: har biri sayt nima ekanini va kim uchun ekanini aytsin, 8 so'zdan oshmasin, [KIM] tushunadigan oddiy tilda.»
- «Nusxalash» → gemini.google.com → 3 variantdan birini tanlaydi yoki o'zinikini qoldiradi → 16-ekrandagi sahifaga qo'yadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda o'quvchining kartasidan yig'ilgan 3 tayyor sarlavha chiqadi, u bittasini tanlaydi yoki o'zinikini qoldiradi: «{YECHIM} — {KIM} uchun» · «{KIM}, endi {YECHIM}» · «{MUAMMO}? {YECHIM}» (qolip qiymatlari kesim shaklida yig'iladi; namuna: «Avtobus qayerdaligini xaritada ko'rsatadi — avtobus kutadigan o'quvchilar uchun»). Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi (155-qonun).
- Qoida ekranda: «Kim uchun ekanini siz hal qildingiz. AI faqat gap taklif qiladi — qaysi biri qolishini siz tanlaysiz.»
- Saboq — mentor og'zaki aytadi, ekranda turmaydi (ekran so'rov bilan birga 400 belgidan oshadi): «Karta qancha aniq bo'lsa, taklif ham shuncha aniq chiqadi.»

### YAKUN

**18 · Juftlik** — ballsiz
- «Sherigingizga 30 soniyada aytib bering: g'oyangiz kim uchun va sahifangiz tepasida nima turadi — nega?» → «Eng muhim fikrni bir qatorga yozing.»

**19 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**20 · Flashcard** (5 ta — foydalanuvchi qarori 2026-09-23: hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Auditoriya nima? | Saytdan foyda oladigan aniq odamlar guruhi |
| «Hamma uchun» yozilgan sahifada nima bo'ladi? | Unda hech kim o'zini tanimaydi |
| Auditoriya-karta qaysi uch savolga javob beradi? | Kim · qaysi muammo · qanday yechim |
| Sahifaning eng ko'zga tashlanadigan joyiga nima qo'yiladi? | Auditoriya birinchi qiladigan ish |
| Yangi sayt tepasida nima yoziladi? | Bu nima va kim uchun ekani |

**21 · Arena + yakun**
- Arena: 12 savol (3/3/3/3), ikkala mavzudan teng, ekran savollarining nusxasi emas.
- Yakun — 3 qator:
  - Sayt aniq odamlar uchun qilinadi.
  - Sahifa tepasida ular birinchi qiladigan ish turadi.
  - Yangi sayt tepasida avval «bu nima va kim uchun» yoziladi.
- Ko'prik: «AI Startup kursida har bir loyiha shu savoldan boshlanadi: kim uchun?»

---

## 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 5 · 8 · 11 · 14 — har biri o'z nazariyasidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Card Builder!** (7) — «Sotuvchi kartasini uch savol bilan yig'dingiz» · **My Audience!** (9) — «O'z g'oyangiz kim uchun ekanini yozdingiz» · **Right Order!** (15) — «Sotuvchini tugmagacha olib bordingiz» · **Page Maker!** (16) — «O'z sahifangizning tepasini yozdingiz» |

## 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| Kim uchun | 3–9 | 30 |
| Birinchi nima ko'rinadi | 10–16 | 30 |
| AI bilan | 17 | 7 |
| Yakun | 18–21 | 13 |
| Bufer | | 5 |

## 6. Kelishib olinadigan joylar

1. **12-ekran («Yangi saytni-chi?»)** — asl darslarda yo'q yangi fikr. Qolsinmi?
2. **15-ekran** — «OLX sotuvchilar sahifasi» faraz ekani ochiq aytiladi. Shu yo'l ma'qulmi yoki butunlay o'ylab topilgan yangi sayt bilan qilaylikmi?
3. ✅ **Tayyor g'oyalar** (9-ekran) — HAL QILINDI: futbol · o'yin · sinf · kiyim (2026-09-23). *(Metodist: lavash/bufet olami v1 da rad etilgan — tayyor muammolarda ham qaytmasin.)*
4. **OLX sxemasi** — qurishda olx.uz ning hozirgi ko'rinishi skrinshot bilan solishtiriladi; logotip qo'yilmaydi. Tugma yozuvi («E'lon berish») saytdagi hozirgi o'zbekcha yozuvga moslanadi.

---

**Foydalanuvchi ko'rigi (2026-09-23 22:06 o'zi tahrirladi · 22:48 umumiy qoidalar kiritildi):**
- O'zi yozgan 4 sarlavha (1, 3, 4, 10-ekran) — qoldi; qiyshiq apostrof/qo'shtirnoq to'g'rilandi.
- Hamma darsga o'tadigan qoidalar (2-o'tish 2-darsi ko'rigida qabul qilingan): 17-ekran AI — so'rovdan oldin maqsad bir gapda · so'rov yig'mada · **«Gemini ochilmasa» zaxira 3 tayyor sarlavha-qolipi** · **flashcard 8 → 5** (Facebook · tugma joyi · YECHIM→«Qanday ishlaydi» kartalari olindi; qidiruv-kartasi umumiy qoidaga aylandi).
- Ochiq: 10-ekran sarlavha «E'lon berish» ↔ TEST-3 «qidiruv qatori» — foydalanuvchi qarori.

## Korrektura-jurnali (pm-metodist, 2026-09-23, v2)

Tuzilma, ekran soni (21), mexanika, ball-joylari o'zgarmadi. Variantlarda ✓ birinchi yozilgan — qurishda pozitsiyani Jonli aralashtiradi. Asl v2 nusxasi: scratchpad `B1-v2-orig.md`.

### A. Tuzatishlar (❌ → ✅ · sabab)

| # | Ekran | ❌ edi | ✅ bo'ldi | Sabab |
|---|---|---|---|---|
| 1 | 1 sarlavha | «OLX'ni kim ochadi?» | «OLX kim uchun qilingan?» | §3: «kim ochadi» — voqea-savoli, dars mavzusi «kim uchun»; §163: 3-ekran sarlavhasi shu so'zga ulanadi |
| 2 | 1 variantlar | Hamma · Narsasini sotmoqchi yoki arzon narsa izlayotgan odam · Faqat do'kon egalari (5/52/20 belgi) | Telefoni bor har qanday odam uchun · Biror narsa sotadigan yoki oladiganlar uchun · Faqat o'z do'koni bor katta sotuvchilar uchun (34/44/45) | §21: hook variantlari teng og'irlikda; «Hamma» bir so'zli, to'g'ri variant 10× uzun — uzunlik o'zi javobni aytardi |
| 3 | 2 | sarlavha yo'q; «…o'z g'oyangiz kim uchun ekanini yozasiz va sahifasida…» (bitta uzun gap) | Sarlavha «Dars oxirida nimani qila olasiz?»; «…o'zingiz tanlagan g'oya kim uchun ekanini yozasiz. Keyin uning sahifasida…» | §40: g'oyasi yo'q o'quvchi bor (9-ekrandagi tayyor muammolar) — egalik yolg'on; §0-3 bir gap bir fikr; §162 va'da, reklama emas |
| 4 | 3 sarlavha | «Bir saytga kirgan ikki odam bir xil narsani qidiradimi?» | «OLX'ga kirgan ikki odam bir xil maqsadda keladimi?» | sotuvchi hech narsa qidirmaydi — savol o'zi noto'g'ri tasvir berardi; §75 ip-nomi (OLX) sarlavhada |
| 5 | 3 xulosa | «Bitta saytga ikki xil odam keladi, har birining muammosi boshqa. Saytdan real foyda oladigan aniq odamlar — uning auditoriyasi.» | «OLX'ga ikki xil odam keladi: biri sotadi, biri qidiradi. Saytdan foyda oladigan shunday aniq odamlar guruhi saytning auditoriyasi deyiladi.» | «real foyda» — kalka; §104 bosh atama kesik qurilmada tug'ilmaydi — «… deyiladi» ta'rif-gapi; birinchi gap hook javobini ochiq aytadi |
| 6 | 4 almashtirgich | «Ortiqcha buyumingizni 3 daqiqada soting» | «Keraksiz narsangizni uydan chiqmay soting» | OLX-sahnasidagi «3 daqiqa» — OLX nomidan o'ylab topilgan raqam (real mahsulot halolligi); 7-ekran YECHIMi bilan bir so'z («uydan chiqmay») |
| 7 | 4 xulosa | «Hammaga yozilgan gap hech kimga aniq gapirmaydi.» | «Hammaga yozilgan gapda hech kim o'zini tanimaydi.» | §28 jonsiz narsaga odam-fe'li («gap gapiradi»); yangi fe'l ekrandagi «bu men!» harakatiga aynan mos (ETALON 42) |
| 8 | 5 TEST-1 savol | «"Hamma uchun" yozilgan sahifa nega kam ishlaydi?» | Lead «Sahifa tepasida faqat "Bizda hamma narsa bor!" deb yozilgan.» + cue «Nega bunday sahifa kam odamni qiziqtiradi?» | «kam ishlaydi» — noaniq (texnik ishlashmi?); test-shart naqshi lead → cue |
| 9 | 5 TEST-1 ✓ | «Unda hamma narsa bor, lekin hech kim o'zi izlaganini topolmaydi» | «Uni o'qigan odam "bu aynan men uchun" demaydi» | **halollik:** eski ✓ OLX'ning o'zi bilan zid — OLX'da hamma narsa bor va odamlar izlaganini topadi (10-ekran qidiruvi); 4-ekran o'rgatgani «o'zini tanimaydi», «topolmaydi» emas. Uzunlik-tell 1.91× → 1.09× |
| 10 | 5 distraktorlar | qisqa (33–34 belgi) | «…oddiy sahifadan ancha qimmatga tushadi» · «…oddiy saytdan sekinroq ochiladi» · «…internetda hech kim topolmaydi» | uzunlik-balans; «juda» mutlaqligi olindi; shakl «Uni/Unda» to'rttasida bir xil (§147) |
| 11 | 6 bashorat | Butun dunyo · Bitta mamlakat · Bitta universitet talabalari | …odamlar uchun · …aholisi uchun · …talabalari uchun | §21 teng og'irlik (11/14/27 → 29/28/34) |
| 12 | 6 ko'prik | «Katta bo'lish uchun ham avval bitta aniq guruhdan boshlanadi. Sizning g'oyangiz ham shunday.» | «Eng katta ijtimoiy tarmoq ham avval bitta aniq guruh uchun ochilgan. Yangi g'oya ham shunday boshlanadi.» | birinchi gapda ega yo'q (nima boshlanadi?); §40 «g'oyangiz» hali yo'q. K8 faktlari o'zgarmadi (2004 · bitta universitet · ikki yildan keyin) |
| 13 | 7 sarlavha | «OLX sotuvchisining kartasi qanday bo'ladi?» | «OLX sotuvchisi haqida uch savolga javob bera olasizmi?» | §39 sarlavhada hali nomlanmagan atama («karta» — o'smir uchun bank-karta); §168 nom harakatdan keyin |
| 14 | 7 MUAMMO/YECHIM | «Xaridor topish uchun bozorga borish kerak» · «Uydan chiqmasdan e'lon beradi, xaridor o'zi yozadi» | «Sotish uchun bozorda kun bo'yi turishi kerak» · «Uydan chiqmay e'lon beradi, xaridor o'zi unga yozadi» | ko'z oldiga keladigan detal (S26-27); «kimga yozadi» ochildi |
| 15 | 7 nom | «Bu — auditoriya-karta: kim, qaysi muammo, qanday yechim.» | «Uch javob bitta yozuvga yig'ildi — shu yozuv auditoriya-karta deyiladi.» | §104/§39 ta'rif-gap qolipi; slot-sanoq olindi (§0-6); manba PmLesson1 bilan bir ifoda |
| 16 | 8 TEST-2 ✓ | «Avtobus kutayotgan o'quvchiga u qachon kelishini ko'rsatadigan sayt» | «Avtobus qachon kelishini bilmagan o'quvchiga uni xaritada ko'rsatadigan sayt» | eski ✓ da MUAMMO faqat taxmin qilinardi — «uchalasi ham bor» deb himoyalash zaif edi; endi uchala bo'lak so'z bilan bor |
| 17 | 8 distraktorlar | 35–48 belgi | «…chiroyli va zamonaviy sayt» · «…kerakli hamma narsa bir joyda turgan sayt» · «…qulay va juda tez ishlaydigan sayt» | uzunlik-tell 1.91× → 1.22×; «Oshxona uchun» — KIM kimligi noaniq edi (oshxona egasimi, mijozmi) |
| 18 | 9 sarlavha | «Sizning g'oyangiz kim uchun?» | «Qaysi g'oya ustida ishlaysiz — u kim uchun?» | §40 — g'oyasi yo'q o'quvchi ham shu ekranda |
| 19 | 9 yig'iladigan gap | «Saytimga … kiradi. Ularning muammosi — … . Saytim ularga … beradi.» | «Saytimga … kiradi. Ular … . Saytim ularga … .» + kesim-shakl namunalari | §37: «muammosi — bilmaydi», «ularga ko'rsatadi beradi» — qo'shilganda gap sinardi; bo'laklar kesim shaklida |
| 20 | 9 «hamma» xabari | «Aniqroq: kim, qaysi vaziyatda?» | «"Hamma" — bu hali auditoriya emas. Kim, qaysi vaziyatda?» | §12 xabar nima noto'g'rini aytsin; manba PmLesson1 ifodasi |
| 21 | 9 saqlash | «keyingi bridge darsda shu karta ochiladi» (ekranga chiqishi noaniq) | ekranda faqat «✓ Karta saqlandi» | §17 kelajak-va'da ekranda turmaydi |
| 22 | 10 sarlavha | «OLX'ning eng tepasida nima turadi — nega?» | «OLX'ni ochganda birinchi nima ko'zga tashlanadi — nega?» | **real mahsulot:** olx.uz'da eng tepada sarlavha-chiziq turadi (logotip, «E'lon berish» tugmasi) — qidiruv undan pastda, lekin eng katta. «Eng tepada qidiruv» — rost emas |
| 23 | 10 joy-matnlari | yo'q («har biri kim uchun ekanini ochadi») | qidiruv · kategoriyalar · «E'lon berish» uchun bir qatordan | Quruvchi o'zi to'qimasin; kategoriyalar — «nima olishini bilmagan xaridor» (11-ekran distraktoriga asos) |
| 24 | 10 xulosa | «Tepada qidiruv — chunki xaridor narsa izlab keladi. Sahifada birinchi turgan narsa — auditoriyaning birinchi ishi.» | «Eng ko'zga tashlanadigan joyga auditoriya birinchi qiladigan ish qo'yiladi.» | §106: eski xulosa 11-ekran ✓ ni so'zma-so'z aytardi; «nega» endi test-revealda ochiladi; OLX ichki qarori da'vo qilinmaydi |
| 25 | 11 savol | «OLX sahifasida qidiruv nega eng tepada turadi?» | «OLX'da qidiruv qatori nega eng katta va eng ko'zga tashlanadigan joyda turadi?» | #22 bilan bir sabab — savol yolg'on asosga qurilmasin |
| 26 | 11 distraktor | «Sotuvchilar e'lonni shu yerdan beradi» | «Sotuvchi e'lonini shu qidiruv qatori orqali joylaydi» | **§102 to'qnashuv (vazifa 4-band):** «shu yerdan» = «tepadan» deb o'qilsa — ROST: «E'lon berish» tugmasi haqiqatan sahifa tepasida, 10-ekran uni o'sha yerda ko'rsatadi. E'tiborli bola shu variantni himoya qila olardi. Yangi variant 3- va 10-ekran ochiq rad etadi (e'lon — alohida tugma orqali) |
| 27 | 11 distraktorlar | «Qidiruv bloki boshqalardan chiroyliroq ko'rinadi» · «Uni pastga qo'yishga joy qolmagan» | «Qidiruv qatori sahifani chiroyliroq ko'rsatadi» · «Kategoriyalar qidiruv qatorisiz ishlay olmaydi» | «joy qolmagan» — kulgili-bo'sh (§110); yangi variantni 10-ekran rad etadi (kategoriyalar alohida joy); «blok» so'zi 13-ekrangacha ishlatilmaydi |
| 28 | 12 sarlavha | «OLX'ni hamma biladi. Sizning saytingizni-chi?» | «OLX'ni ko'pchilik taniydi. Yangi saytni-chi?» | §40 — o'quvchida hali sayt yo'q; «hamma» — mutlaq da'vo (darsning o'zi «hamma» ni rad etadi) |
| 29 | 12 xulosa | «…u avval o'zini tanishtiradi: nima u va kimga.» | «…uning tepasida avval "bu nima va kim uchun" yoziladi.» | §28 saytga odam-fe'l; «nima u va kimga» — g'aliz tartib. Kaskad: 2-bo'lim 3-fikr, 20-flashcard, 21-yakun bir ifodaga keltirildi |
| 30 | 13 | «Birinchi blok» izohsiz | «Kirgan odam birinchi ko'radigan joy: bu nima va kim uchun» | §168 — 12-ekrandagi hodisaga shu yerda nom; bo'lak vazifasi ochiq |
| 31 | 14 distraktor | «Eng tepada, birinchi blokdan ham oldinda» | «Eng tepada, hatto birinchi blokdan ham oldinda» | uzunlik-balans (✓ yolg'iz eng uzun edi) |
| 32 | 15 faraz | «Tasavvur qilaylik, OLX sotuvchilar uchun alohida sahifa qildi.» | «Bu sahifa o'ylab topilgan, OLX'niki emas. Tasavvur qilaylik: OLX sotuvchilar uchun alohida sahifa ochdi.» | **faraz ochiqligi (vazifa 3-band):** «tasavvur qilaylik» yolg'iz bo'lsa, bola sahifani haqiqiy deb eslab qoladi; «sahifa qildi» → «ochdi». «Isbot» bo'limiga OLX raqami qo'yilmasligi yozildi; buzuq-tartib matni qo'shildi |
| 33 | 16 sarlavha | «Sizning sahifangizda birinchi nima turadi?» | «Sahifangizning tepasida nima turadi?» | qisqa; 12-ekran («tepada») so'zi bilan zanjir |
| 34 | 17 sarlavha | «Birinchi blokingizni AI bilan kuchaytiramizmi?» | «AI birinchi blokingizga qanday gaplar taklif qiladi?» | §173 fe'l-shkalasi: AI «taklif qiladi»; «kuchaytirish» — mavhum |
| 35 | 17 so'rov | «…Saytim ularga [YECHIM] beradi. … 13 yoshli o'quvchi tushunadigan tilda…» | «…Ular [MUAMMO]. Saytim ularga [YECHIM]. … har biri sayt nima ekanini va kim uchun ekanini aytsin … [KIM] tushunadigan oddiy tilda.» | §37 (9-ekran qolipi bilan bir xil); «13 yoshli» — o'quvchining auditoriyasi 13 yoshli bo'lmasligi mumkin, darsning o'z fikri: til auditoriyaga mos; 12-ekran qoidasi so'rovga kirdi |
| 36 | 17 saboq | ekranda | mentor og'zaki | ekran so'rov bilan 573 belgi (>400) |
| 37 | 18 | «Sherigiga 30 soniyada: «G'oyam kim uchun…» → bir qator yozadi.» | «Sherigingizga 30 soniyada aytib bering: g'oyangiz kim uchun…» → «Eng muhim fikrni bir qatorga yozing.» | siz-forma; yo'riq aniq harakat bilan |
| 38 | 20 flashcard | «Saytdan real foyda…» · «Hech kimga aniq gapirmaydi» · «Bu nima va kimga» · «Kartadagi muammo … qayerga tushadi? — «Muammo» bo'limiga» | #5/#7/#29 kaskadi · oxirgi karta YECHIM → «Qanday ishlaydi» | eski oxirgi karta javobni savolning o'zida aytardi («muammo» → «Muammo»); YECHIM 13-ekranda o'rgatilgan, tanib bo'lmaydi |
| 39 | 21 yakun | «Birinchi turgan narsa — ularning birinchi ishi.» · «Yangi sayt avval o'zini tanishtiradi.» | «Sahifa tepasida ular birinchi qiladigan ish turadi.» · «Yangi sayt tepasida avval «bu nima va kim uchun» yoziladi.» | belgi-formula-ohang (ETALON 43), §28, #29 kaskadi |
| 40 | 4-bo'lim | nishonlar o'zbekcha tasvir | **Card Builder! · My Audience! · Right Order! · Page Maker!** + o'zbekcha siz-forma `desc` | nishon `name` faqat inglizcha (2026-07-16 ogohlantirishi) |

Ichki (o'quvchi ko'rmaydigan) joylar ham kaskad bilan tekislandi: 2-bo'lim uch fikri, pasport «Maqsad» (§40), OLX-halollik qaydnomasi qo'shildi.

### B. Test-halollik o'lchovi (Intl.Segmenter, grapheme; ✓ birinchi)

| Ekran | Uzunliklar | max/min | ✓ / eng uzun distraktor | Oldin max/min |
|---|---|---|---|---|
| 1 hook (ballsiz) | 44 / 34 / 45 | 1.32× | 0.98 | 10.40× |
| 6 bashorat (ballsiz) | 34 / 29 / 28 | 1.21× | 1.17 | 2.45× |
| 5 TEST-1 | 45 / 49 / 46 / 45 | 1.09× | 0.92 | **1.91×** |
| 8 TEST-2 | 76 / 70 / 67 / 82 | 1.22× | 0.93 | **1.91×** |
| 11 TEST-3 | 53 / 52 / 46 / 46 | 1.15× | 1.02 | 1.45× |
| 14 TEST-4 | 49 / 46 / 41 / 40 | 1.23× | 1.07 | 1.23× |

- **3-vs-1 shakl (§147):** TEST-1 to'rttasi «Uni/Unda» bilan; TEST-2 to'rttasi «… sayt» bilan tugaydi, boshlanishi har xil; TEST-3 to'rt xil ega (Xaridor/Sotuvchi/Qidiruv/Kategoriyalar) — yolg'iz qolip yo'q; TEST-4 da ✓ va bitta distraktor «Muammo …» bilan boshlanadi. Toza.
- **Mutlaq so'z (§110):** har testda ko'pi bilan bittada («hech kim» T1 · «hamma» T2 · «Faqat» T4).
- **§102 (distraktor ekranda rost emasmi):** T3 «Sotuvchi … qidiruv qatori orqali» — 3/10-ekran rad etadi; «Kategoriyalar … ishlay olmaydi» — 10-ekran rad etadi. T1/T2/T4 distraktorlari hech bir ekranda xulosa sifatida ko'rinmaydi.
- **§106 (slayddan ko'chirish):** T1 ✓ ↔ 4-ekran xulosasi — so'z bo'yicha kesishmaydi (fikr chiqariladi); T3 ✓ ↔ 10-ekran — xulosa endi umumiy qoida, «nega» faqat revealda; T4 ✓ — 13-ekranda gap sifatida yo'q, tartibdan chiqariladi.
- **Bitta himoyalanadigan to'g'ri:** T2 da «Maktab … hamma narsa bir joyda» YECHIMga yaqin ko'rinadi, lekin KIM umumiy va MUAMMO yo'q — 7-ekrandagi «Hamma odamlar» rad etilishi bilan himoyalanmaydi. Qolganlarida ikkinchi rost variant topilmadi.

### C. Mexanik tekshiruvlar

- Kirill `grep -nP '[\x{0400}-\x{04FF}]'` → **0**.
- Qiyshiq apostrof (U+2018 · U+2019 · U+02BB) grep → **0**.
- Sen-forma grep (agent-faylidagi naqsh: -ding/-lading/-san qo'shimchalari, sen-olmoshlari) → 1 topilma: 16-qator «koding» (pasport, so'z o'zagi) — soxta.
- Ichki jargon `grep -ni "yadro|artefakt|hook|recap"` → faqat «Hook» ekran-yorlig'i va jurnal-izoh (o'quvchiga chiqmaydi).
- Ekran-hajmi (≤400): 10-ekran ≈278 · 15-ekran ≈284 · 17-ekran 573 → saboq-qatori mentorga o'tkazildi, qolgani so'rov-quti bilan ~515 (quyida E'tiroz 1).
- `npm run lint:til pm-senariylar/BRIDGE-B1-KimUchun.md` → **0 error · warn faqat `zanjir-streak`** («Ip-zanjir», «Sarlavha zanjiri» — ichki reja/jurnal so'zi, streak emas; soxta).

### D. Tuzilmaviy e'tirozlar (tuzatilmadi — foydalanuvchi/Quruvchiga)

1. **17-ekran 400 belgidan oshadi** (so'rov ~390 belgining o'zi). Taklif: so'rovni default-yopiq «So'rovni ko'rish» yig'masiga solish yoki qoida-gapni mentorga o'tkazish.
2. **21-ekran ko'prigi** «AI Startup kursida har bir loyiha shu savoldan boshlanadi» — §17 bo'yicha kelajak-gap yakun-ekranda turmaydi. Bridge-darsning maqsadi shu bo'lgani uchun o'zgartirmadim; foydalanuvchi qarori: qolsa — mentor og'zaki aytsin.
3. **8-ekran testi** misol-ipdan (OLX) chiqadi — avtobus/sport/maktab/oshxona (§75). Vazifasi «o'z g'oyasi» 9-ekraniga ko'prik bo'lgani uchun qoldirdim; qat'iy bitta ip kerak bo'lsa, variantlar OLX-ga yaqin g'oyalarga o'tadi.
4. **10-ekran sxemasi:** olx.uz'da «E'lon berish» tugmasi qidiruvdan YUQORIDA (sarlavha-chizig'ida) turadi. Darsning 2-fikri «eng ko'zga tashlanadigan joy» deb qayta yozildi; sxemani chizishda tugma o'z joyida (tepada, kichik) qolishi shart — uni pastga surib qo'yish haqiqatni buzadi.
5. **9-ekran tayyor muammolar** hali yozilmagan — senariy tasdiqlangach metodist yozadi; v1 lavash/bufet olami qaytmasin.
6. **1-ekran hook** — mentor gapi va'da-quyruq bilan (§38). Bu yerda javob darhol emas, 3-ekranda ochilgani uchun va'da kerak — qoldirildi.
