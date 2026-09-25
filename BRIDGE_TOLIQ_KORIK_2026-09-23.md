# Bridge (o'tish) darslari — TO'LIQ KO'RIK · 2026-09-23

> Bu hujjat — tasdiq uchun. To'rt o'tish yo'lidagi 10 dars o'rni, 7 alohida dars. Har dars **ekran-ekran, matni bilan** berilgan: pasport → asosiy fikrlar → halollik qaydi → 19–21 ekran → ball va nishonlar → vaqt.
> Bir dars ikki o'tishda takrorlansa, to'liq matni birinchi uchragan joyda, ikkinchi joyda qisqa ko'rinish (pasport + ekranlar ro'yxati).
> Ichki ish-izohlari (metodist jurnali, qoida-raqamlari) olib tashlangan — ular senariy-fayllarda (`pm-senariylar/BRIDGE-B*.md`) turadi.
>
> **Fikr berish tartibi:** dars nomi + ekran raqami + nima o'zgarsin («3-o'tish 2-dars, 8-ekran: …»). Tasdiq-qolipi hujjat oxirida.

## 0. Xarita

| O'tish yo'li | 1-dars | 2-dars | 3-dars |
|---|---|---|---|
| **1-o'tish · JavaScript** | «Kim uchun qilyapmiz?» · OLX · Facebook keysi | — | — |
| **2-o'tish · React** | «Kim uchun qilyapmiz?» · OLX · Facebook keysi *(1-o'tish bilan bir xil)* | «Muammoni topamiz» · taksi ilovasi · Airbnb keysi | «Birinchi versiya va uni ko'rsatish» · eMaktab · Instagram keysi |
| **3-o'tish · Node-Express** | «Kim uchun va qanday muammo?» · Uzum · Uzum keysi | «Nima quramiz va qachon tayyor?» · taksi ilovasini biz qursak · Instagram keysi | «Qanday ko'rsatamiz?» · eMaktab, ota-onalar yig'ilishi · Airbnb pitch keysi |
| **4-o'tish · NestJS** | «Kim uchun va qanday muammo?» · Uzum *(3-o'tish bilan bir xil)* | «Nima quramiz va qachon tayyor?» · taksi *(3-o'tish bilan bir xil)* | «Ma'lumot, ishonch va "Qanday ishlaydi?"» · YouTube kabi ilovani biz qursak · Netflix keysi |

Jami: **10 dars o'rni, 7 alohida dars.** Har o'tishda keys takrorlanmaydi: 2-o'tish K8 · K4 · K3 — 3-o'tish K1 · K3 · K12 — 4-o'tish K1 · K3 · K6.

**Hamma darsga bir xil qolip:** 19–21 ekran · 90 daqiqa · mentor bilan jonli · uyga vazifa, koding, LMS yo'q · 4 ballik test (har biri o'z nazariyasidan keyin) · yakunda arena 12 savol · 8 flashcard · 4 nishon (nomi inglizcha, tavsifi o'zbekcha) · har dars **bitta real mahsulot** misol-ip sifatida — undan faqat ko'rinadigan narsa aytiladi, «biz noldan qursak» farazi ekranda ochiq yoziladi · har dars **bitta bank keysi** — faqat bank faktlari · o'quvchining **g'oya-kartasi** darsdan darsga o'tadi (kartasi bo'lmagan o'quvchiga 4 tayyor g'oya: futbol · o'yin · sinf · kiyim) · har dars oxirida **AI qadami** (gemini.google.com; AI taklif qiladi yoki sinaydi, qaror o'quvchiniki) · **juftlik** mashqi · UZ + RU.

**Texnik:** alohida sayt (Vercel, `dist-bridge`), LMS'siz; jonli ball — eski Supabase. Bu hujjatda texnik tomon yo'q, faqat dars mazmuni.

---

# 1-O'TISH · JavaScript (1 dars)

## 1-o'tish · 1-dars — «Kim uchun qilyapmiz?» (OLX · Facebook keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B1-KimUchun.md`

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | JavaScript'ga qo'shiladigan o'quvchi (1 dars — shu) · React'ga qo'shiladigan o'quvchi (3 darsning 1-si) |
| Mavzular | Kim mening foydalanuvchim? · Struktura — foydalanuvchi birinchi nimani ko'radi |
| Maqsad | O'quvchi o'zi tanlagan g'oya **kim uchun** ekanini aniq yozadi va shunga qarab sahifasida **birinchi nima turishini** hal qiladi |
| Misol-ip | **OLX** — boshidan oxirigacha. Ikki xil odam: narsasini sotmoqchi bo'lgan va arzon narsa izlayotgan |
| Keys | K8 Facebook — «avval bitta aniq guruh» (faqat bank-faktlari: 2004 · bitta universitet · ikki yildan keyin hamma uchun) |
| O'z ishi | O'z g'oyasi kartasi (KIM · MUAMMO · YECHIM) + sahifasining birinchi tartibi. Karta keyingi bridge darsga o'tadi |
| Format | 21 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

### 2. Darsning uch asosiy fikri

1. **Auditoriya — «kam odam» emas, «aniq odam, aniq vaziyatda».** OLX'ga ikki xil odam keladi: biri sotadi, biri qidiradi. Saytda ikkalasiga ham o'z joyi bor.
2. **Sahifaning eng ko'zga tashlanadigan joyida — shu odam birinchi qiladigan ish.** OLX'da katta qidiruv qatori: xaridor narsa izlab keladi.
3. **OLX'ni ko'pchilik taniydi — yangi saytni hali hech kim tanimaydi.** Shuning uchun yangi sayt tepasida avval «bu nima va kim uchun» yoziladi. *(Bu bridge'ning o'z fikri — asl darslarda yo'q.)*

Ip-zanjir: **ikki odam → karta → birinchi ekran → o'z g'oyasi.**

> **OLX halolligi (butun dars uchun):** OLX haqida faqat sahifada **ko'rinib turgan** narsa aytiladi — qidiruv qatori, kategoriyalar, «E'lon berish» tugmasi, sotuvchiga xaridor yozishi. OLX tarixi, raqamlari (necha foydalanuvchi, necha e'lon), ichki qarorlari («OLX shuning uchun qidiruvni tepaga qo'ydi») aytilmaydi — «nega?» savoliga javob OLX'ning qarori sifatida emas, **auditoriyaning harakati** sifatida beriladi («xaridor narsa izlab keladi»). Tugma yozuvi qurishda olx.uz'ning hozirgi o'zbekcha ko'rinishi bilan solishtiriladi (6-bo'lim, 4-band).

---

### 3. Ekranlar

#### KIRISH

**1 · Hook** — ovoz berish, javob hozir ochilmaydi
- Sarlavha: «OLX sayti kim uchun qilingan?»
- Variantlar: Telefoni bor har qanday odam uchun · Biror narsa sotadigan yoki oladiganlar uchun · Faqat o'z do'koni bor katta sotuvchilar uchun
- Mentor: «Javobni birozdan keyin birga bilib olamiz.»
- Nega shunday: savol o'quvchining o'z tajribasidan — ko'pchilik OLX'ga biror marta kirgan.

**2 · Maqsad** — jonli preview (imzo-vizual)
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Dars oxirida o'zingiz tanlagan g'oya kim uchun ekanini yozasiz. Keyin uning sahifasida birinchi nima turishini hal qilasiz.»
- Vizual: chapda karta o'zi yozilib chiqadi (KIM · MUAMMO · YECHIM) → qatorlari o'ngdagi sahifaning bo'limlariga uchib o'tadi. **Karta sahifaga aylanadi** — butun darsning surati shu. *(«Karta» so'zi bu yerda matnda aytilmaydi — nom 7-ekranda beriladi.)*

#### 1-QISM · KIM UCHUN

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
- 3 maydon navbat bilan: KIM · MUAMMO · YECHIM. Pastda gap yig'iladi: «Saytimga … kiradi. Ular …. Saytim ularga ….»
 - Maydon-namunalari kesim shaklida: KIM «avtobus kutadigan o'quvchilar» · MUAMMO «avtobus qachon kelishini bilmay kutishadi» · YECHIM «avtobus qayerdaligini xaritada ko'rsatadi».
- KIM ga «hamma» yozilsa: «"Hamma" — bu hali auditoriya emas. Kim, qaysi vaziyatda?»
- G'oyasi yo'q o'quvchiga 4 ta tayyor g'oya (foydalanuvchi tasdiqladi, 2026-09-23) — bittasini tanlab, o'z so'zi bilan davom etadi:

 | Olam | KIM | MUAMMO | YECHIM |
 |---|---|---|---|
 | Futbol | Hovlida futbol o'ynaydigan o'smirlar | Maydonga borsa, band bo'lib chiqadi | Bo'sh vaqtni ko'rsatib, oldindan band qilish |
 | O'yin | Onlayn o'yin o'ynaydigan o'quvchilar | Tasodifiy sheriklar o'yinni tashlab ketadi | Darajasi va vaqti mos jamoadosh topish |
 | Sinf | Sinf sardori | Sovg'aga pul yig'ilganda kim berdi, kim bermadi — chalkashadi | Kim berganini belgilab boradigan ro'yxat |
 | Kiyim | Internetdan kiyim oladigan o'smir | O'lcham to'g'ri kelmay qoladi, qaytarish qiyin | Bo'y va vaznni kiritsa, mos o'lchamni tavsiya qiladi |

 Matnlar qurishda metodist bilan so'nggi marta silliqlanadi.
- Saqlanadi → keyingi bridge darsda shu karta ochiladi. Ekranda faqat «✓ Karta saqlandi».

#### 2-QISM · BIRINCHI NIMA KO'RINADI

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

#### AI BILAN

**17 · AI bilan birinchi blok**
- Sarlavha: «AI birinchi blokingizga qanday gaplar taklif qiladi?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI sizga sarlavha variantlarini taklif qiladi. Qaysi biri qolishini o'zingiz tanlaysiz.»
- O'quvchining kartasi va yozgan gapidan so'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
 > «Men [KIM] uchun sayt qilyapman. Ular [MUAMMO]. Saytim ularga [YECHIM]. Sahifaning birinchi bloki uchun 3 xil qisqa sarlavha yozib bering: har biri sayt nima ekanini va kim uchun ekanini aytsin, 8 so'zdan oshmasin, [KIM] tushunadigan oddiy tilda.»
- «Nusxalash» → gemini.google.com → 3 variantdan birini tanlaydi yoki o'zinikini qoldiradi → 16-ekrandagi sahifaga qo'yadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda o'quvchining kartasidan yig'ilgan 3 tayyor sarlavha chiqadi, u bittasini tanlaydi yoki o'zinikini qoldiradi: «{YECHIM} — {KIM} uchun» · «{KIM}, endi {YECHIM}» · «{MUAMMO}? {YECHIM}» (qolip qiymatlari kesim shaklida yig'iladi; namuna: «Avtobus qayerdaligini xaritada ko'rsatadi — avtobus kutadigan o'quvchilar uchun»). Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi (155-qonun).
- Qoida ekranda: «Kim uchun ekanini siz hal qildingiz. AI faqat gap taklif qiladi — qaysi biri qolishini siz tanlaysiz.»
- Saboq — mentor og'zaki aytadi, ekranda turmaydi (ekran so'rov bilan birga 400 belgidan oshadi): «Karta qancha aniq bo'lsa, taklif ham shuncha aniq chiqadi.»

#### YAKUN

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

### 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 5 · 8 · 11 · 14 — har biri o'z nazariyasidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Card Builder!** (7) — «Sotuvchi kartasini uch savol bilan yig'dingiz» · **My Audience!** (9) — «O'z g'oyangiz kim uchun ekanini yozdingiz» · **Right Order!** (15) — «Sotuvchini tugmagacha olib bordingiz» · **Page Maker!** (16) — «O'z sahifangizning tepasini yozdingiz» |

### 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| Kim uchun | 3–9 | 30 |
| Birinchi nima ko'rinadi | 10–16 | 30 |
| AI bilan | 17 | 7 |
| Yakun | 18–21 | 13 |
| Bufer | | 5 |

---

# 2-O'TISH · React (3 dars)

## 2-o'tish · 1-dars — «Kim uchun qilyapmiz?» (OLX · Facebook keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B1-KimUchun.md` · **Bu dars 1-o'tish 1-darsi bilan aynan bir xil** — to'liq matni yuqorida.

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | JavaScript'ga qo'shiladigan o'quvchi (1 dars — shu) · React'ga qo'shiladigan o'quvchi (3 darsning 1-si) |
| Mavzular | Kim mening foydalanuvchim? · Struktura — foydalanuvchi birinchi nimani ko'radi |
| Maqsad | O'quvchi o'zi tanlagan g'oya **kim uchun** ekanini aniq yozadi va shunga qarab sahifasida **birinchi nima turishini** hal qiladi |
| Misol-ip | **OLX** — boshidan oxirigacha. Ikki xil odam: narsasini sotmoqchi bo'lgan va arzon narsa izlayotgan |
| Keys | K8 Facebook — «avval bitta aniq guruh» (faqat bank-faktlari: 2004 · bitta universitet · ikki yildan keyin hamma uchun) |
| O'z ishi | O'z g'oyasi kartasi (KIM · MUAMMO · YECHIM) + sahifasining birinchi tartibi. Karta keyingi bridge darsga o'tadi |
| Format | 21 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |


**Ekranlar (to'liq matni — 1-o'tish 1-darsi):**

1. Hook
2. Maqsad
3. Ikki odam
4. «Hamma uchun» almashtirgichi
5. TEST-1
6. Keys: Facebook
7. Kartani yig'ing
8. TEST-2
9. O'z g'oyangiz
10. OLX'ning bosh sahifasi
11. TEST-3
12. «Yangi saytni-chi?»
13. Kartadan sahifaga
14. TEST-4
15. Tartibga qo'ying
16. O'z sahifangiz
17. AI bilan birinchi blok
18. Juftlik
19. Podium
20. Flashcard
21. Arena + yakun

---

## 2-o'tish · 2-dars — «Muammoni topamiz» (taksi ilovasi · Airbnb keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B2-MuammoniTopamiz.md`

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | React'ga qo'shiladigan o'quvchi (3 darsning 2-si, «Kim uchun qilyapmiz?» dan keyin) |
| Mavzular | Muammoni qanday izlash · Muammo → yechim |
| Maqsad | O'quvchi o'zi tanlagan g'oyaning muammosini **aniq gap** qilib yozadi (kim · qachon · nimasi og'ir) va har yechim **bitta muammoga javob** berishini tekshiradi |
| Misol-ip | **Yandex Go** (ekranda — «taksi ilovasi», sxema brendsiz) — boshidan oxirigacha. Ilova bo'lmasa taksi qanday topiladi → ilovadagi to'rt narsa qaysi muammoni yo'qotadi |
| Keys | K4 Airbnb — «muammo o'z hayotidan + borib o'z ko'zi bilan ko'rish» (faqat bank-faktlari) |
| O'z ishi | Oldingi darsdagi karta ochiladi: MUAMMO aniq gapga aylanadi, 2 ta yechim yoziladi, sherikdan 2 savol so'raladi |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

### 2. Darsning uch asosiy fikri

1. **Odam o'zicha chora topgan joyda — real muammo bor.** Tanish haydovchining raqamini saqlab qo'yish, Telegram guruhga «kim ketyapti?» deb yozish — bular muammo belgisi.
2. **Muammo aniq gap bilan yoziladi: kim · qachon · nimasi og'ir.** «Taksi yomon» — nolish; «Kechqurun, yomg'irda to'garakdan qaytadigan o'quvchi ko'chada 20 daqiqa taksi kutadi» — aniq muammo.
3. **Har yechim bitta muammoga javob beradi.** Muammosi topilmagan narsa ro'yxatdan chiqadi, qanchalik chiroyli bo'lmasin.

Ip-zanjir: **o'zicha chora → aniq muammo → yechim → o'z kartasi → sherikdan so'rash.**

> **Yandex Go halolligi:** ilovada **ko'rinib turgan** narsalargina aytiladi — narx buyurtmadan oldin ko'rinadi, mashina xaritada keladi, haydovchi va mashina ma'lumoti, safardan keyin baho qo'yish. Kompaniya tarixi, raqamlari va ichki qarorlari aytilmaydi («Yandex shuning uchun … qo'shdi» — yo'q; «ilovadagi har narsa muammoga javob» — yo'q, faqat ko'rsatilgan to'rt narsa haqida gapiriladi). «Ilova bo'lmasa qanday edi» — shahar hayotining umumiy tajribasi sifatida beriladi, Yandex tarixi sifatida emas. Ilovada yo'q narsa (12-ekran) faqat «o'ylab topilgan» deb ochiq aytiladi. Sharhlar — **namuna** sharhlar, ekranda shunday yoziladi; haqiqiy foydalanuvchi so'zi deb ko'rsatilmaydi.

---

### 3. Ekranlar

#### KIRISH

**1 · Hook** — ovoz berish (hamma javob to'g'ri)
- Sarlavha: «Taksi ilovasi bo'lmasa, yomg'irli kechada uyga qanday yetasiz?»
- Variantlar: Ko'chada qo'l ko'tarib, bo'sh taksi kutaman · Tanish haydovchiga qo'ng'iroq qilaman · Ota-onamdan olib ketishni so'rayman
- Javob (ovozdan keyin): «Uchala usul ham uyga yetkazadi. Lekin har biri vaqt oladi yoki birovni bezovta qiladi. Odam shunday o'zicha chora izlagan joyda muammo bor.» Hech bir tanlov noto'g'ri chiqmaydi.

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Tanlagan g'oyangiz kimning qanday muammosini hal qilishini aniq yozasiz. Keyin har bir yechim shu muammoga javob beradimi — tekshirasiz.»
- Vizual: xira «taksi yomon» gapi bo'laklarga bo'linib, aniq gapga aylanadi (kim · qachon · nimasi og'ir), keyin undan ikkita yechim-karta o'sib chiqadi.

#### 1-QISM · MUAMMONI QANDAY TOPAMIZ

**3 · Muammoning to'rt belgisi** — bosib ochish
- Sarlavha: «Qayerda muammo borligini qanday bilasiz?»
- To'rt karta, har birida bitta odam — to'garakdan qaytadigan o'quvchi:
 - Bu holat qayta-qayta bo'ladi — har safar to'garakdan qaytishda taksi topolmaydi
 - Odam o'zicha yo'l topishga urinadi — tanish haydovchining raqamini saqlab qo'ygan
 - Vaqt yoki pul yo'qotadi — ko'chada 20 daqiqa turadi, narx talashadi
 - Oxiri voz kechadi — «Bugun bormay qo'ya qolay» deydi
- Xulosa: «Eng kuchli belgi — o'zicha chora. Demak, muammo odamni rostdan qiynayapti.»

**4 · TEST-1** (ball)
- Lead: «Qo'shningiz har kuni Telegram guruhga "Yunusobodga kim ketyapti?" deb yozadi.» Cue: «Bu nimani ko'rsatadi?»
- ✓ U taksi topish muammosini o'zicha hal qilib yuribdi · U guruhda ko'proq gaplashishni yaxshi ko'radi · Bu shunchaki odat — orqasida muammo yo'q · Unga har kuni borish unchalik shart emas

**5 · Muammoni qayerdan qidiramiz?** — saralash
- Sarlavha: «Muammoni qayerdan qidirasiz?»
- Uch joy (chip): O'z kuningiz · Oila va do'stlar · Past baholi sharhlar.
- Mashq: 6 ta **namuna** sharh (ekranda: «Namuna sharhlar (o'ylab topilgan)») → o'quvchi ularni «Muammo bor» / «Shunchaki fikr» ga ajratadi:
 - Muammo bor: «Xaritada "3 daqiqa" deb turdi, mashina 15 daqiqada keldi.» · «Yarim soat birorta haydovchi buyurtmani olmadi.» · «Haydovchi manzilni topolmay, uch marta qo'ng'iroq qildi.»
 - Shunchaki fikr: «Rangi menga yoqmadi.» · «Eski ko'rinishi chiroyliroq edi.» · «Boshqa ilova menga ko'proq yoqadi.»
- Saboq — mentor og'zaki: «Past baholi sharhlarda ba'zan odam boshidan o'tgan aniq muammo yoziladi.»

**6 · Keys: Airbnb** — bashorat + 3 slayd (har slaydda bitta usul, sarlavha bilan)
- Sarlavha: «Airbnb muammoni qayerdan topdi?»
- Bashorat: «2007-yil, San-Fransisko. Shaharda konferensiya, mehmonxonalarda bo'sh joy qolmagan. Airbnb asoschilari nima qilishdi?» — Shoshilib shahar chetida kichik mehmonxona qurishdi · O'z uyidagi uchta havo matrasni ijaraga berishdi · Mehmonlarni qo'shni shaharlarga avtobusda yuborishdi
- Slaydlar (har birida tepada usul-nomi, ostida voqea — o'quvchi Airbnb tarixini emas, usulni eslab qolsin):
 1. **Muammo o'z hayotidan.** «Muammo asoschilarning ko'z oldida edi: shaharga kelganlarga joy yo'q. Ular o'z uyidagi uchta havo matrasni ijaraga berishdi.»
 2. **Boshqalarning muammosini borib izlash.** «O'sish to'xtaganda asoschilar Nyu-Yorkka borib, uylarni birma-bir aylanishdi.»
 3. **Ko'rib, muammoni aniq tushunish.** «Uylarni o'zlari suratga olishdi — va o'z ko'zi bilan ko'rishdi: rasmi yomon uyni odamlar band qilmaydi.»
- Ko'prik: «Birinchi muammoni asoschilar o'z hayotida uchratishdi. Ikkinchisini esa uyma-uy yurib, o'z ko'zlari bilan ko'rishdi. Siz ham shunday qidirasiz: avval o'z kuningizdan, keyin odamlardan.»

**7 · Aniq gap yig'ing** — konstruktor
- Sarlavha: «"Taksi yomon" gapini qanday aniq qilasiz?»
- Lead (sarlavha ostida): «Voqea: to'garakdan qaytayotgan o'quvchi kechqurun, yomg'irda ko'chada 20 daqiqa taksi kutdi.»
- O'quvchi uch bo'lakdan gap yig'adi, har bo'lakda 3 variant (✓ birinchi). Noto'g'ri variantlar ham tabiiy eshitiladi — faqat voqeadagi aniq ma'lumotni bermaydi:
 - KIM: to'garakdan qaytadigan o'quvchi · hamma odamlar · shahardagi yo'lovchilar
 - QACHON: kechqurun, yomg'irda · ertalab, darsdan oldin · dam olish kunlari
 - NIMASI OG'IR: ko'chada 20 daqiqa taksi kutadi · taksi xizmatidan norozi · taksi topishda qiynaladi
- Gap-qolipi: «{QACHON} {KIM} {NIMASI OG'IR}.» — har juftlik tugal chiqadi («Ertalab, darsdan oldin hamma odamlar taksi xizmatidan norozi.» · «Dam olish kunlari shahardagi yo'lovchilar taksi topishda qiynaladi.»).
- ✕ tanlansa, bir qator: KIM — «Kim ekani aniq emas: qaysi odam, qaysi vaziyatda?» · QACHON — «Voqeada bu vaqt yo'q: o'quvchi kechqurun, yomg'irda kutgan edi» · NIMASI OG'IR — «Norozi yoki qiynaladi — lekin aynan nima bo'ldi, qancha vaqt ketdi?»
- Natija-gap: «Kechqurun, yomg'irda to'garakdan qaytadigan o'quvchi ko'chada 20 daqiqa taksi kutadi.»
- Xulosa (atama harakatdan keyin): «Uchala bo'lagi bor gap **aniq muammo** deyiladi. "Taksi yomon" esa nolish: undan nimani tuzatish kerakligi bilinmaydi.»

**8 · TEST-2** (ball)
- «Qaysi gapda kim, qachon va nimasi og'ir — uchalasi ham bor?»
- ✓ Ertalab maktabga boradigan o'quvchi bekatda avtobusni 15 daqiqa kutadi · Ertalab bekatda hamma odamlar avtobusni juda uzoq kutib qoladi · Maktabga qatnaydigan o'quvchi bekatda avtobusni ancha uzoq kutadi · Ertalab maktabga boradigan o'quvchi bekatdagi avtobusni yomon deydi

**9 · O'z muammongiz** — ustaxona (bitta majburiy ish)
- Sarlavha: «G'oyangizdagi muammo aniq yozilganmi?»
- Oldingi darsdagi karta yonda ochiq turadi (bo'lmasa — 1-darsning 4 tayyor g'oyasi tanlov bo'lib chiqadi). **Majburiy ish bitta:** MUAMMO qatorini uch bo'lakda yozish — «Kim?» · «Qachon?» · «Nimasi og'ir?». Gap 7-ekrandagi qolip bilan yig'iladi: «{QACHON} {KIM} {NIMASI OG'IR}.»
 - Maydon-namunalari kesim shaklida: KIM «avtobus kutadigan o'quvchilar» · QACHON «ertalab, darsdan oldin» · NIMASI OG'IR «avtobus qachon kelishini bilmay, bekatda turadi».
- Saqlanadi → ekranda faqat «✓ Karta yangilandi». Uch bo'lak to'lgan bo'lsa saqlash ochiq — boshqa shart yo'q.
- **Ixtiyoriy (saqlashni to'xtatmaydi):** pastda yig'ma «Belgilarini tekshiring» — to'rt belgi ro'yxati, o'quvchi borini belgilaydi. Bittasi ham bo'lmasa yumshoq eslatma: «Belgisi yo'q muammo — hali taxmin. Sherigingizdan so'rab ko'ring.» Mentor jonli darsda shu yig'mani sinf bilan og'zaki ko'radi.

#### 2-QISM · MUAMMODAN YECHIMGA

**10 · Har joy — bitta javob** — bosib ochish
- Sarlavha: «Taksi ilovasidagi har bir sahifa qaysi muammoni yo'qotadi?»
- Ilova ekranining sxemasi (brendsiz). To'rt joy bosiladi, har biri o'z muammosini ochadi:
 - «Narx oldindan ko'rinadi — haydovchi bilan narx talashilmaydi» (3-ekran muammosi)
 - «Mashina xaritada keladi — qancha kutish kerakligi bilinadi» (3-ekran muammosi)
 - «Haydovchi ismi va mashina raqami — begona mashinaga o'tirilmaydi»
 - «Safardan keyin baho — keyingi yo'lovchi uni ko'radi»
- Xulosa: «Har biri bitta aniq muammoga javob beradi. Muammoga javob beradigan shunday narsa **yechim** deyiladi.»

**11 · TEST-3** (ball)
- Lead: «Taksi ilovasi jamoasida kimdir taklif qildi: "Ilova ochilganda chiroyli animatsiya qo'shaylik".» Cue: «Birinchi qaysi savolni berasiz?»
- ✓ Bu kimning qaysi muammosini hal qiladi? · Bu animatsiya necha kunda tayyor bo'ladi? · Bu animatsiya qaysi rangda chiroyliroq? · Boshqa ilovalarda ham animatsiya bormi?

**12 · Juftini toping** — sudrash
- Sarlavha: «Har yechimning o'z muammosi bormi?»
- Ochiq aytiladi (sarlavha ostida, birinchi gap): «Bu 4 taklif o'ylab topilgan — yangi taksi ilovasi uchun.» 4 yechim → 3 muammo:
 - «Turgan joyni xaritada belgilash» → «Haydovchi yo'lovchini topolmay qoladi»
 - «Yo'l haqini do'stlar orasida bo'lish» → «Do'stlar pulni bo'lishda adashib ketadi»
 - «Safarni ota-onaga havola bilan yuborish» → «Ota-ona farzandi uchun xavotir oladi»
 - «Ilova ochilganda foydalanuvchiga kunning motivatsion xabarini ko'rsatish» → hech qaysi muammoga tushmaydi → «Muammosi topilmadi» qutisiga ketadi.
- Xulosa: «Muammosi topilmagan yechim ro'yxatdan chiqadi.»

**13 · TEST-4** (ball)
- «Qaysi yechimda ilova nima qilishi va qaysi muammo yo'qolishi aniq aytilgan?»
- ✓ Ilova mashina kelganda xabar yuboradi — yo'lovchi ko'chada ortiqcha kutmaydi · Ilova yangi, qulay va zamonaviy ko'rinishda bo'ladi — odamlarga ko'proq yoqadi · Ilova chiroyli dizayn bilan ishlaydi — yo'lovchilar undan xursand bo'ladi · Ilova eng yaxshi taksi xizmatini beradi — mijozlari tez ko'payib boradi

**14 · O'z yechimlaringiz** — ustaxona
- Sarlavha: «Sizning muammongizga qaysi ikki yechim javob beradi?»
- Ekran boshida eslatma (kichik yozuv) + 9-ekranda yozgan aniq muammo yonda ochiq turadi: «Avval yozgan muammoingizni o'qing. Yechim shu muammoga javob berishi kerak.»
- 2 ta yechim-karta, har biri: «nima qiladi» (fe'l bilan) → «qaysi muammoni yo'qotadi». Tekshiruvchi-xabarlar:
 - sifat-so'zlar («chiroyli, zamonaviy, qulay»): «Bu — baho. Sayt aynan nima qiladi?»
 - muammoni takrorlash: «Bu muammoning o'zi. Unga qarshi sayt nima qiladi?»
 - juda qisqa javob: «Yana bir-ikki so'z qo'shing: sayt nima qiladi?»
- Saqlanadi → ekranda faqat «✓ Karta yangilandi».

#### AI BILAN

**15 · AI bilan savollar**
- Sarlavha: «Muammongiz haqiqatan bormi — kimdan va nima deb so'raysiz?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI sizga savol tuzishda yordam beradi. Qaysi savolni berishni o'zingiz tanlaysiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
 > «Men shu muammo ustida ishlayapman: [QACHON] [KIM] [NIMASI OG'IR]. Bu muammo haqiqatan bor-yo'qligini bilish uchun [KIM]ga beriladigan 5 ta savol yozib bering. Savollar uning boshidan o'tgan aniq voqea haqida bo'lsin, javobni o'zi aytib qo'ymasin va "shunday ilova kerakmi?" deb so'ramasin.»
- «Nusxalash» → gemini.google.com → o'quvchi 5 savoldan 2 tasini tanlab, ekranga yozadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda 5 ta tayyor savol chiqadi, o'quvchi shulardan 2 tasini tanlaydi. Tayyor savollar (hamma muammoga mos, o'tgan voqea haqida): «Oxirgi marta bu qachon bo'ldi?» · «O'sha payt nima qildingiz?» · «Eng ko'p nimasi og'ir bo'ldi?» · «Buni hal qilish uchun nima sinab ko'rgansiz?» · «Bu qanchalik tez-tez takrorlanadi?» Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi (155-qonun).
- Qoida ekranda: «AI savol taklif qiladi — o'tgan voqea haqidagi 2 tasini siz tanlaysiz.»
- Bu ikki qoida (maqsad bir gapda · zaxira 5 tayyor savol/variant) **hamma bridge darslarining AI ekraniga** qo'llanadi — foydalanuvchi qarori 2026-09-23.

**16 · Sherikdan so'rang** — juftlik (ballsiz)
- Yo'riq: «Tanlagan 2 savolingizni sherigingizga bering va javobini tinglang. Keyin almashing.»
- O'quvchi bir qator yozadi: «Sherigim aytdi: …. Demak, muammom …»
- Mentor: «"Shu ilova kerakmi?" deb so'ramang. "Oxirgi marta qachon shunday bo'lgan?" deb so'rang.»

#### YAKUN

**17 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**18 · Flashcard** (5 ta — foydalanuvchi qarori: yakunda arena ham bor, 8 ta ko'p)

| Old tomoni | Orqa tomoni |
|---|---|
| Muammoning eng kuchli belgisi qaysi? | Odam o'zicha chora topgan |
| Aniq muammo qaysi uch bo'lakdan iborat? | Kim · qachon · nimasi og'ir |
| Muammoni qayerdan qidirasiz? | O'z hayotingiz · oila va do'stlar · past baholi sharhlar |
| Yangi taklif kelsa, birinchi qaysi savol beriladi? | Bu kimning qaysi muammosini hal qiladi? |
| Muammosi topilmagan yechim nima bo'ladi? | Ro'yxatdan chiqadi |

**19 · Arena** — 12 savol (3/3/3/3), ikkala mavzudan teng, ekran savollarining nusxasi emas.

**20 · Yakun** — 3 qator:
- Odam o'zicha chora topgan joyda muammo bor.
- Aniq muammoda kim, qachon va nimasi og'ir — uchalasi aytiladi.
- Har yechim bitta muammoga javob beradi.
- Mentor og'zaki: «AI Startup'da mahsulot g'oyadan emas, muammodan boshlanadi.»

---

### 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 4 · 8 · 11 · 13 — har biri o'z nazariyasidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Review Sorter!** (5) — «Namuna sharhlarni muammo va fikrga ajratdingiz» · **Clear Problem!** (7) — «"Taksi yomon" gapini aniq muammoga aylantirdingiz» · **Perfect Match!** (12) — «Har yechimni o'z muammosiga ulab chiqdingiz» · **Solution Maker!** (14) — «O'z muammongizga ikki yechim yozdingiz» |

### 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| Muammoni topamiz | 3–9 | 32 |
| Muammodan yechimga | 10–14 | 25 |
| AI + sherik | 15–16 | 13 |
| Yakun | 17–20 | 10 |
| Bufer | | 5 |

---

## 2-o'tish · 3-dars — «Birinchi versiya va uni ko'rsatish» (eMaktab · Instagram keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B3-BirinchiVersiya.md`

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | React'ga qo'shiladigan o'quvchi (3 darsning 3-si, oxirgisi) |
| Mavzular | Dekompozitsiya — birinchi versiya (MVP) · Sistemani kod bilmaydigan odamga tushuntirish (pitch) |
| Maqsad | O'quvchi o'zi tanlagan g'oyani bo'laklarga bo'lib, **birinchi versiyaga 3 ta bo'lak** tanlaydi va uni **kod bilmaydigan odamga 5 gapda** tushuntiradi |
| Misol-ip | **eMaktab — ilgari Kundalik.com** (tekshirildi 2026-09-23: 2023-yildan `emaktab.uz`, odamlar hali ham «Kundalik» deydi) — «agar biz uni noldan qursak»: bo'laklar → birinchi versiya → buviga tushuntirish. Ekranda nom: birinchi ko'rinishda «eMaktab (Kundalik)», keyin «eMaktab». Tinglovchi: nabirasining bahosini bilmoqchi bo'lgan buvi |
| Keys | K3 Instagram — «Burbn'dan uchta narsa qoldi» (faqat bank-faktlari: Burbn'da chekinlar (joy belgilash), rejalar, foto va yana ko'p narsa bor edi · uni deyarli hech kim ishlatmadi · asoschilar odamlarga yoqqanidan boshqa hammasini olib tashladi: foto + filtr + izoh · 2010-yil oktabr, birinchi kunda 25 000 ro'yxatdan o'tish). **Ekranda sana va 25 000 raqami aytilmaydi** — foydalanuvchi qarori 23:02: darsning asosiy fikriga xizmat qilmaydi |
| O'z ishi | Oldingi darsdagi karta ochiladi (kim · muammo · 2 yechim) → bo'laklar ro'yxati → 🔥 birinchi versiya (3) → 5 gapli tushuntirish |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

### 2. Darsning uch asosiy fikri

1. **Katta ish bo'lakdan boshlanadi.** Yaxshi bo'lak — alohida qilib tugatsa bo'ladigan ish: boshi va oxiri ko'rinadi.
2. **Birinchi versiyaga saytning asosiy ishiga kerak va tez tayyor bo'ladigan bo'laklar kiradi — mashq shartida bir haftaga uchtasi sig'adi.** Qolgani o'chirilmaydi, navbati keyin keladi.
3. **Kod bilmaydigan odamga avval uning foydasi aytiladi, kasbiy so'z tanish so'zga almashadi, saytning ichi o'xshatish bilan tushuntiriladi.**

Ip-zanjir: **eMaktabni bo'laklaymiz → uchtasini tanlaymiz → buviga tushuntiramiz → o'z g'oyamizga xuddi shunday.**

> **eMaktab halolligi (tekshirildi 2026-09-23, emaktab.uz):** saytda haqiqatan bor bo'limlar — **baholar (kunlik, chorak, yillik) · uyga vazifa va muddati · dars jadvali va o'zgarishlari · davomat va kechikish**; ota-onalar uchun alohida Kundalik.Family ilovasi bor. 1-ekrandagi to'rt variant va 3-ekrandagi birinchi to'rt bo'lak shulardan. Qolgan to'rt bo'lak (ota-onaga xabar · o'qituvchi bilan yozishuv · o'rtacha baho grafigi · e'lonlar) — **bizning taklifimiz**, «noldan qursak» ro'yxatining qismi; ular eMaktab'da bor deb aytilmaydi. Platforma tarixi, raqamlari, «birinchi versiyasi qanday bo'lgan» — aytilmaydi. Butun mashq ochiq faraz: «Agar eMaktabni biz noldan qursak». Ekran matnlarida «eMaktab» (birinchi ko'rinishda «eMaktab (Kundalik)») — 23:02 da almashtirildi; «qog'oz kundalik» (kichik harf) — o'xshatish, qoladi.

---

### 3. Ekranlar

#### KIRISH

**1 · Hook** — ovoz berish (hamma javob to'g'ri)
- Sarlavha: «eMaktab (Kundalik) saytini noldan qursangiz, birinchi kuni faqat bitta bo'lak tayyor bo'ladi. Qaysi bo'lakdan boshlaysiz?»
- Variantlar: Baholarni ko'rish · Dars jadvalini ko'rish · Uyga vazifani ko'rish · Davomatni ko'rish
- Javob (ovozdan keyin): «Javoblar turlicha chiqdi. Qaysi birini tanlamang, sayt birinchi kuniyoq kimgadir foyda beradi. Demak, katta sayt bitta bo'lakdan ham boshlanishi mumkin. Qaysi bo'lakdan — buni bugun o'rganamiz.» bu yoki: «To'rtta javobning hammasi to'g'ri. Muhimi — birinchi kuni kimdirga foyda beradigan bitta bo'lim ishlashi. Bugun shunday bo'limlarni qanday tanlashni o'rganasiz.» ni qoy 1 tasin halol oylab

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «O'zingiz tanlagan g'oyani bo'laklarga bo'lasiz va birinchi versiyasida ishlaydigan uchtasini tanlaysiz — ya'ni sayt ochilgan kuni ishlaydigan qismini. Keyin shu g'oyani kod bilmaydigan odamga besh gapda tushuntirasiz.»
- Vizual: katta «eMaktab» kartasi 8 bo'lakka sochiladi → uchtasi 🔥 ga tushadi → pastda besh gapli tushuntirish o'z-o'zidan yozilib chiqadi.

#### 1-QISM · BIRINCHI VERSIYA

**3 · Bo'laklaymiz** — bosib ochish
- Sarlavha: «eMaktab saytini noldan qurish — bitta katta ishmi yoki bir nechta kichik ishmi?»
- Bitta karta «eMaktab saytini qurish» → bosilsa 8 bo'lakka bo'linadi: Baholarni ko'rish · Dars jadvalini ko'rish · Uyga vazifani ko'rish · Davomatni ko'rish · Ota-onaga xabar · O'qituvchi bilan yozishuv · O'rtacha baho grafigi · E'lonlar.
- Kartalar ostida kichik yozuv: «Bu ro'yxat mashq uchun tuzildi. Saytni noldan qursak, uni shunday bo'laklarga ajratishimiz mumkin.»
- Xulosa: «Katta saytni birdaniga qurmaymiz. Avval uni alohida bo'laklarga ajratamiz, keyin birma-bir qurib tugatamiz. Katta ishni shunday bo'laklarga bo'lish **dekompozitsiya** deyiladi.»

**4 · Tugatsa bo'ladimi?** — 4 karta, bosib tekshirish
- Sarlavha: «Qaysi bo'lakning oxiri ko'rinadi?»
- Kartalar: «Baholarni ko'rish» ✓ («Boshlanishi ham, tugashi ham aniq») · «Davomatni ko'rish» ✓ («Boshlanishi ham, tugashi ham aniq») · «Saytni chiroyli qilish» ✗ («Bu juda umumiy ish: qaysi sahifani, nimani, qachongacha chiroyli qilish aniq emas») · «Hamma maktab ishlatsin» ✗ («Bu bajariladigan bo'lak emas, natija. Avval saytni ishlaydigan qilib qurish kerak»).
- Xulosa: «Yaxshi bo'lakning boshlanishi ham, tugashi ham aniq.»

**5 · TEST-1** (ball)
- Lead: «eMaktab ustida ishlayapsiz.» Cue: «Qaysi ishni boshqa ishlarni bajarmasdan ham tugatish mumkin?»
- ✓ Bugungi dars jadvalini ko'rsatish · Saytning butun ishini qurish · Saytni chiroyli qilib bezash · Saytni ko'proq maktabga tanitish
- Reveal (✓): «To'g'ri. "Bugungi dars jadvalini ko'rsatish" — chegarasi aniq kichik ish: uni alohida bajarib, natijasini ko'rish mumkin. Boshi ham, oxiri ham ko'rinadi.»
- Xato: «butun ish» — «Bu butun ishning o'zi. Uni avval bo'laklarga bo'lish kerak.» · «chiroyli» — «Bu juda umumiy ish: qaysi sahifani, nimani, qachongacha — aniq emas.» · «tanitish» — «Bu natija, ish emas. Uni sayt ustida o'tirib tugatib bo'lmaydi.»

**6 · Tarozi — ikki savol** — demo
- Sarlavha: «Qaysi bo'lak birinchi versiyaga kiradi — buni qanday bilamiz?»
- «Ota-onaga xabar» bo'lagi tarozida. 1-savol: «Bu bo'laksiz sayt o'z asosiy ishini qila oladimi?» → Ha · Yo'q. 2-savol: «Bu bo'lakni qancha vaqtda tayyorlash mumkin?» → Bir-ikki kun · Bir haftadan ko'p. Javobga qarab bo'lak o'z joyiga tushadi: 🔥 Birinchi versiya · ⚡ Keyingi versiya · 🌱 Keyinga qoldirilganlar.
- Har joyning izohi (bo'lak tushgach chiqadi): 🔥 «Saytning asosiy ishi shu bo'laksiz bajarilmasa va uni tez tayyorlash mumkin bo'lsa — bo'lak birinchi versiyaga kiradi.» · ⚡ «Bu bo'lak kerak, lekin tayyorlash ko'proq vaqt oladi. Uni keyingi versiyaga qoldiramiz.» · 🌱 «Sayt bu bo'laksiz ham ishlaydi. Uni hozir emas, keyinroq qilamiz.»
- Muhim izoh (harakatdan keyin, hamma holatda): «Keyinga qoldirish — keraksiz deb tashlab yuborish degani emas. Faqat uning navbati keyin keladi.»

**7 · Keys: Instagram** — bashorat + 3 slayd
- Sarlavha: «Burbn ilovasida ko'p narsa bor edi. Odamlarga yoqqan nimalar qoldi?»
- Bashorat: «Instagram asoschilari avval Burbn degan ilova qilgan. Unda ko'p narsa bor edi: joy belgilash, reja tuzish, surat va yana boshqalar. Odamlarga undagi qaysi narsa yoqqan?» — Joy belgilash · Reja tuzish · Surat qo'yish
- Slaydlar:
 1. «Burbn'da ko'p narsa bor edi, lekin uni ishlatadiganlar juda kam edi.»
 2. «Jamoa odamlar eng ko'p yoqtirgan qismlarni qoldirdi: surat, filtr va izoh.»
 3. «Shu kichik ilova Instagram nomi bilan chiqdi — bugun hamma biladigan Instagram.»
- Ko'prik: «Instagram birinchi kuni uchta narsa bilan chiqdi — bu uning **birinchi versiyasi** (MVP). Birinchi versiyada hamma narsa emas, eng kerakli bo'laklar bo'ladi.»

**8 · TEST-2** (ball)
- Lead: «eMaktab bo'laklari tarozidan o'tdi.» Cue: «Birinchi versiyaga qaysi bo'laklar kiradi?»
- ✓ Saytning asosiy ishi uchun zarur va qisqa vaqtda tayyor bo'ladigan bo'laklar · Tez tayyor bo'ladigan, lekin saytning asosiy ishiga kerak bo'lmagan bo'laklar · Saytning asosiy ishiga kerak, lekin uzoq vaqtda tayyor bo'ladigan bo'laklar · Boshqa maktab saytlarida allaqachon bor bo'lgan barcha bo'laklar
- Reveal (✓): «To'g'ri. Tarozining ikkala savoliga javob "kerak va tez" bo'lsa — bo'lak birinchi versiyaga kiradi.»
- Xato: «tez, lekin kerak emas» — «Tez tayyor bo'lishi yetarli emas. U saytning asosiy ishiga kerak bo'lishi ham kerak.» · «kerak, lekin uzoq» — «Bu bo'lak foydali, lekin birinchi versiyani kechiktiradi. Uni keyingi versiyaga qoldiramiz.» · «boshqa saytlarda bor» — «Boshqa saytda borligi hech narsani hal qilmaydi. Savol boshqa: busiz sayt o'z ishini qila oladimi?»

**9 · Birinchi versiya ro'yxati** — sudrash + simulyatsiya
- Sarlavha: «eMaktab saytining birinchi versiyasida qaysi uchta bo'lak ishlaydi?»
- Lead: «Bu mashqda shart shunday: saytni bir kishi bir hafta ichida ishga tushiradi. Shuning uchun eng kerakli va tez tayyor bo'ladigan 3 ta bo'lakni tanlaymiz.»
- 8 bo'lak tarozidan o'tadi (har biriga 2 savol) → o'quvchi 🔥 da faqat 3 ta qolguncha suradi. Keyin simulyatsiya **o'quvchi tanlagan uchta bo'lak bilan**: «Sayt ochildi. O'quvchi kirdi: {1-bo'lak} ✓ · {2-bo'lak} ✓ · {3-bo'lak} ✓. Sayt ishlaydi.»
- 🔥 da 4 ta qolsa: «Bir haftaga uchtasi sig'adi. Qaysi birini keyingi versiyaga o'tkazasiz?»
- Xulosa: «Nega uchta? Bir haftada bitta odam uchta bo'lakni tugata oladi. Vaqt ko'proq bo'lsa, son ham boshqacha bo'lardi.»

**10 · O'z birinchi versiyangiz** — ustaxona
- Sarlavha: «Tanlagan g'oyangizning birinchi versiyasida nimalar ishlaydi?»
- Lead: «Endi shu qoidani o'z g'oyangizga qo'llang.»
- Oldingi darsdagi karta ochiladi: 2 yechim tayyor bo'lak bo'lib turadi. O'quvchi yana 2–4 bo'lak yozadi (jami 4–6) → har birini tarozidan o'tkazadi → 🔥 da ko'pi bilan 3 ta. Karta bo'lmasa — 1-darsning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim) tanlov bo'lib chiqadi, tanlagach 4 bo'lakni o'zi yozadi.
- Mentor (1 gap): «Oldingi darsda yozgan 2 yechimingizni bo'lak sifatida oling — keyin ularga yana 2–4 ta bo'lak qo'shing.»
- Shart-chiplari: «4–6 ta bo'lak» · «Hammasi tarozidan o'tdi» · «🔥 da ko'pi bilan 3»
- 🔥 da 4 ta qolsa — 9-ekrandagi gap.
- Saqlanadi: «✓ Birinchi versiya tanlandi».

#### 2-QISM · KOD BILMAYDIGAN ODAMGA TUSHUNTIRISH

**11 · Tushunish chizig'i** — so'zma-so'z sahna
- Sarlavha: «Buviga eMaktabni tushuntiryapsiz. Qaysi so'zda u sizni tushunmay qoladi?»
- Gap so'zma-so'z chiqadi: «Baholar bazada saqlanadi, serverdan telefonga keladi.» Chiziq (yorlig'i: «Buvi qanchalik tushunyapti») tanish so'zda ko'tariladi, «bazada» va «serverdan» da tushadi. Mentor: «Chiziq tushgan so'zlarni bosing.»
- Xulosa: «Faqat kod yozadiganlar tushunadigan bunday so'z **kasbiy so'z** deyiladi. Uni tinglovchi biladigan oddiy so'z bilan almashtiring. Buviga shunday deysiz: "Baholar maktab jurnaliga yoziladi va siz ularni telefonda ko'rasiz."»

**12 · TEST-3** (ball)
- Lead: «Buvi faqat bitta narsani bilmoqchi: nabirasining baholari qanday.» Cue: «Qaysi gapdan boshlasangiz, u oxirigacha tinglaydi?»
- ✓ Endi nabirangizning bahosini telefoningizda ko'rasiz · Sayt uchta bo'lakdan qurildi, hammasi yaxshi ishlaydi · Baholar bazada turadi, sahifa ularni ekranga chiqaradi · Men bu saytni bir hafta davomida o'zim qurib chiqdim
- Reveal (✓): «To'g'ri. Birinchi gapda buvi bilmoqchi bo'lgan narsa turibdi. Sayt nimadan qurilgani — keyin.» *(qoida «avval tinglovchi oladigan foyda» shu yerda ochiq aytiladi)*
- Xato: «uchta bo'lakdan» — «Bu sayt qanday qurilgani haqida. Buvi esa bahoni bilmoqchi.» · «bazada» — «"Baza" — kasbiy so'z. Buvi aynan shu yerda tushunmay qoladi.» · «o'zim qurdim» — «Bu gap siz haqingizda. Mehnatingizni oxirida aytsangiz ham bo'ladi.»

**13 · Sayt ichida nima bo'ladi — o'xshatish** — juftlash
- Sarlavha: «Sayt ichida nima bo'lishini buviga nimaga o'xshatib tushuntirasiz?»
- Saytning uch qismi: Ko'rinadigan qism · Saytning ishlashi · Ma'lumot saqlanadigan joy. O'xshatishlar: qog'oz kundalikning sahifasi · sinf rahbari jurnaldan bahoni topib, kundalikka yozishi · maktab jurnali. Chalg'ituvchilar: «server» · «ma'lumotlar bazasi» — ular qo'yilsa: «Bu o'xshatish emas, yana bitta kasbiy so'z.»
- To'g'ri juftlangach to'liq gap chiqadi: «Ko'rinadigan qism — qog'oz kundalikning sahifasiga o'xshaydi.» · «Saytning ishlashi — sinf rahbari jurnaldan bahoni topib, kundalikka yozishiga o'xshaydi.» · «Ma'lumot saqlanadigan joy — maktab jurnaliga o'xshaydi.»
- Xulosa: «Yaxshi o'xshatish tinglovchining o'z hayotidan olinadi.»

**14 · TEST-4** (ball)
- Lead: «Do'stingiz futbol to'garagiga qatnaydi, kod bilmaydi.» Cue: «Unga "ma'lumot saqlanadigan joy"ni qanday tushuntirasiz?»
- ✓ Murabbiyning daftari kabi — kim nechta gol urgani shu yerga yoziladi · Serverning xotirasi kabi — ma'lumot shu yerda saqlanib turadi · Ma'lumotlar bazasi kabi — hamma saytlarda xuddi shunday bo'ladi · Saytning ichki qismi kabi — uni tushunib o'tirish unchalik shart emas
- Reveal (✓): «To'g'ri. Murabbiyning daftarini do'stingiz har mashg'ulotda ko'radi — darrov tushunadi. Yaxshi o'xshatish tinglovchining hayotida bor narsadan olinadi.»
- Xato: «server» / «ma'lumotlar bazasi» — «Bu tushuntirish kerak bo'lgan kasbiy so'z, o'xshatish emas.» · «ichki qism» — «"Ichki qism" hech qanday aniq narsani ko'rsatmaydi.»

**15 · Besh gap** — ustaxona
- Sarlavha: «G'oyangizni kod bilmaydigan odamga besh gapda ayta olasizmi?»
- 5 maydon, yorliqlar bir xil savol shaklida, **avval tinglovchi va foydasi** (TEST-3 qoidasi): «Bu sayt kimga yordam beradi va ular endi nimaga erishadi?» · «Hozirgacha ular nimada qiynalardi?» · «Birinchi versiyada qaysi 3 ta bo'lak ishlaydi?» · «Saytning ishlashini tinglovchiga tanish nimaga o'xshatasiz?» · «Tinglovchidan keyin nima qilishini so'raysiz?» Birinchi ikki maydon kartadan namuna oladi, uchinchisi — 10-ekrandagi 🔥 bo'laklardan; o'quvchi tuzatishi mumkin.
- Maydon-namunalari kesim shaklida: «avtobus kutadigan o'quvchilar» + «avtobus qachon kelishini bilib, bekatda kutmaydi» · «avtobus qachon kelishini bilmay, bekatda turardi» · «avtobus qayerdaligini xaritada ko'rsatadi, qachon kelishini aytadi va kechiksa ogohlantiradi» · «bekatdagi jonli jadval» · «bir hafta sinab ko'rib, fikringizni ayting».
- Jonli tekshiruv: kasbiy so'z yozilsa qizil chiziq va «Bu kasbiy so'z. Uni tanish so'z bilan ayting.» O'xshatish maydonida «server/baza/kod» so'zi — «Bu o'xshatish emas, yana bitta kasbiy so'z.»
- Beshta maydon besh gapga yig'iladi: «Bu sayt {kim}ga yordam beradi: endi ular {natija}. Hozirgacha ular {muammo}. Birinchi versiyada sayt {3 bo'lak}. Saytning ishlashi {o'xshatish}ga o'xshaydi. Sizdan bitta iltimos — {so'rov}.» Namuna bilan: «Bu sayt avtobus kutadigan o'quvchilarga yordam beradi: endi ular avtobus qachon kelishini bilib, bekatda kutmaydi. Hozirgacha ular avtobus qachon kelishini bilmay, bekatda turardi. Birinchi versiyada sayt avtobus qayerdaligini xaritada ko'rsatadi, qachon kelishini aytadi va kechiksa ogohlantiradi. Saytning ishlashi bekatdagi jonli jadvalga o'xshaydi. Sizdan bitta iltimos — bir hafta sinab ko'rib, fikringizni ayting.»
- Saqlanadi: «✓ Tushuntirish tayyor».

#### AI BILAN

**16 · AI — tinglovchi rolida**
- Sarlavha: «Tushuntirishingizda qaysi so'z tushunarsiz qoldi?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI buvi o'rnida tinglaydi va qaysi so'zni tushunmaganini aytadi. Gapni o'zgartirish yoki o'zgartirmaslikni siz hal qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
 > «Siz kod umuman bilmaydigan odamsiz. Men sizga loyihamni tushuntiryapman: "{besh gap}". Javob bering: 1) Qaysi so'zlarni tushunmadingiz? 2) Menga qaysi bitta savolni berasiz? Tushuntirishni qayta yozmang, faqat shu ikki javobni bering.»
- «Nusxalash» → gemini.google.com → o'quvchi tushunilmagan so'zni o'zi almashtiradi, savolga javobni 15-ekrandagi maydonga o'zi qo'shadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda ikki narsa chiqadi: (1) o'quvchining besh gapida kasbiy so'zlar ro'yxati bo'yicha topilgan so'zlar belgilanadi (baza · server · API · kod · dizayn · interfeys · funksiya · sozlama); (2) 3 tayyor «buvi savoli» — «Buni telefonimda qanday ochaman?» · «Bu pullikmi?» · «Nabiramning bahosini qayerdan ko'raman?» — o'quvchi bittasini tanlab, javobini besh gapiga qo'shadi. Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi (155-qonun).
- Qoida ekranda: «AI faqat qaysi so'z tushunarsiz ekanini aytadi, qayta yozmaydi. Qaysi so'zni almashtirishni siz hal qilasiz.»

#### YAKUN

**17 · Sherigingizga ayting** — juftlik (ballsiz)
- Sarlavha: «Sherigingiz besh gapingizni tushunadimi?»
- Yo'riq: «Ekranga qaramay, besh gapingizni sherigingizga ayting. Sherigingiz buvi o'rnida tinglaydi va belgilaydi: 🙂 Tushundim · 😐 Qisman · 😕 Tushunmadim. Tushunmagan so'zini ham aytadi. Keyin almashasiz.»
- Yozish: «Sherigingiz tushunmagan so'zni va uning o'rniga nima deyishingizni bir qatorga yozing.»

**18 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**19 · Flashcard** (5 ta — foydalanuvchi qarori: hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Dekompozitsiya nima? | Katta ishni alohida tugatsa bo'ladigan bo'laklarga bo'lish |
| Birinchi versiyaga qaysi bo'laklar kiradi? | Saytning asosiy ishiga kerak va tez tayyor bo'ladiganlar |
| Keyinga qolgan bo'lak nima bo'ladi? | O'chirilmaydi — navbati keyin keladi |
| Kasbiy so'zni nima qilasiz? | Tinglovchi biladigan oddiy so'z bilan almashtirasiz |
| Tushuntirish qaysi gapdan boshlanadi? | Tinglovchi oladigan foydadan |

**20 · Arena + yakun**
- Arena: 12 savol (3/3/3/3), ikkala mavzudan teng, ekran savollarining nusxasi emas — boshqa vaziyat (o'yin ilovasi, sinf chati, futbol jamoasi sayti).
- Yakun — 3 qator:
 - Katta ish bo'lakdan boshlanadi.
 - Birinchi versiyada eng kerakli va tez tayyor bo'ladigan bo'laklar bo'ladi.
 - Kod bilmaydigan odamga avval uning foydasini aytasiz, kasbiy so'zsiz.
- Mentor og'zaki: «React modulida shu bo'laklarni birma-bir qurishni o'rganasiz.»

---

### 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 5 · 8 · 12 · 14 — har biri o'z nazariyasidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Piece by Piece!** (3) — «eMaktabni sakkiz bo'lakka ajratdingiz» · **Launch List!** (9) — «Birinchi versiyaga uchta bo'lak tanladingiz» · **First Version!** (10) — «O'z g'oyangizning birinchi versiyasini tanladingiz» · **Plain Words!** (15) — «Besh gapni kasbiy so'zsiz yozdingiz» |

### 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| Birinchi versiya | 3–10 | 33 |
| Kod bilmaydigan odamga | 11–15 | 27 |
| AI + sherik | 16–17 | 12 |
| Yakun | 18–20 | 8 |
| Bufer | | 5 |

---

# 3-O'TISH · Node-Express (3 dars)

## 3-o'tish · 1-dars — «Kim uchun va qanday muammo?» (Uzum · Uzum keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B4-KimUchunQandayMuammo.md`

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | Node-Express'ga va NestJS'ga qo'shiladigan o'quvchi (3 darsning 1-si). Bu o'quvchi texnikada kuchli, lekin PM ko'rmagan |
| Mavzular (5) | Auditoriya + Struktura (bitta blok) · Muammoni qanday izlash · Muammo → yechim · Jobs-to-be-Done |
| Maqsad | O'quvchi o'zi tanlagan g'oyaga **to'rt savolli karta** yozadi: sayt kim uchun · odam qanday muammoga duch keladi (qachon · nimasi og'ir) · sayt nima qiladi · odam oxirida nimaga erishadi |
| Misol-ip | **Uzum Market** — boshidan oxirigacha: kim kiradi va birinchi nimaga qaraydi → Uzum bo'lmaganda xarid qanday edi → ilovadagi to'rt narsa qaysi muammoga javob → odam telefonning o'zini emas, «do'konga bormay, ertaga qo'lida bo'lishini» oladi |
| Keys | K1 Uzum — ip bilan bitta olam; keys **bir marta** hikoya bo'lib kiradi (6-ekran), faqat bank-faktlari |
| O'z ishi | O'z g'oyasi kartasi — 4 savol (muammo savolida ikki yozuv joyi: qachon · nimasi og'ir). Keyingi ikki darsga o'tadi |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

**Eng og'ir bridge dars.** Besh mavzu 4 blokka yig'ildi; har blok — bitta g'oya, bitta harakat, bitta test. Chuqurlik emas, tasavvur darajasi.

### 2. Darsning to'rt asosiy fikri

1. **Auditoriya — ehtiyoji o'xshash odamlar guruhi.** Uni tushunish uchun guruhdagi bitta odamni aniq vaziyatda tasavvur qilamiz. Sahifaning eng ko'zga tashlanadigan joyida — ular birinchi qiladigan ish.
2. **Muammo belgilar bilan topiladi** (takrorlanadi · odam o'zicha chora izlaydi · vaqt yoki pul ketadi · ba'zan voz kechadi) va aniq gap bilan yoziladi: kim · qachon · nimasi og'ir. O'zicha chora — muammo odamga befarq emasligini ko'rsatadi, lekin uning kuchini yolg'iz o'zi isbotlamaydi.
3. **Har yechim bitta muammoga javob beradi.** Qaysi muammoga javob ekani topilmagan narsa ro'yxatdan chiqadi.
4. **Odam mahsulotning o'zini emas, u beradigan natijani oladi.** Telefonning o'zi emas — «do'konga bormay, ertaga qo'limda bo'lsin».

Ip-zanjir: **Uzumga kim kiradi → Uzum bo'lmaganda muammo qayerda edi → ilovadagi to'rt narsa qaysi muammoga javob → odam aslida nimani oladi → o'z g'oyam kartasi.**

> **Uzum halolligi:** Uzum haqida ikki xil manba bor va ular aralashtirilmaydi. (1) **Ko'rinadigan narsalar** — ilovada hozir bor: tepadagi qidiruv qatori, kategoriyalar, savat, mahsulot sahifasidagi yetkazib berish muddati, topshirish punktlari, mahsulot sharhlari va bahosi (qurishda ilovaning hozirgi ko'rinishi bilan tekshiriladi; «ertaga yetkazib berish» **filtri** v1 da bor edi — ilovada borligi tasdiqlanmagan, olib tashlandi). (2) **Bank-faktlari (K1)** — faqat 6-ekranda, ekranda ehtiyotkor ifodada (foydalanuvchi qarori 23:17: «yetkazib berish har doim ham yo'q edi», «dastlabki asosiy e'tibor — yetkazib berish»; bank faktidan kuchli xulosa chiqarilmaydi): 2022-yil oktabrda ochilgan · saytdan emas, yetkazib berishdan boshlagan: o'z mashinalari, topshirish punktlari, ertasi kuni yetkazish · chunki undan oldin odamlar Instagram va Telegram guruhlaridan yetkazib berishsiz olardi · 2024-yil martda O'zbekistonning birinchi «yagona shoxli»si (1 mlrd dollardan qimmat kompaniya — atamani tushuntirish uchun summa aytiladi) · oyiga ~17 mln foydalanuvchi (2025). Bundan boshqa raqam, tarix va ichki qaror aytilmaydi. «Nega qidiruv tepada» kabi savollarga javob Uzumning qarori sifatida emas, xaridorning harakati sifatida beriladi. 5-ekrandagi «Uzum hali yo'q paytdagi xarid» — umumiy hayot tajribasi, Uzum tarixi emas. 10-ekrandagi taklif — Uzum jamoasiniki emas, nomsiz «internet-do'kon ilovasi»niki.

---

### 3. Ekranlar

#### KIRISH

**1 · Hook** — ovoz berish (hamma javob to'g'ri)
- Sarlavha: «Uzumga oxirgi marta nima sababdan kirgansiz?»
- Kichik yozuv (sarlavha ostida): «Uzumga kirmagan bo'lsangiz — boshqa internet-do'konni o'ylang.»
- Variantlar: Aniq bir narsani izlab topish uchun · Narxlarni solishtirib ko'rish uchun · Buyurtmam qayerdaligini bilish uchun · Shunchaki ko'rib chiqish uchun
- Javob (ovozdan keyin): «To'rttasi ham odatiy sabab. Bitta odam ilovaga turli kuni turli maqsadda kiradi. Bugun odamlar ilovaga nima uchun kirishini va ularga nima kerakligini ko'rib chiqamiz.» (hech bir tanlov rad etilmaydi; «muammo» so'zi hali aytilmaydi)

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Dars oxirida o'zingiz tanlagan g'oya haqida to'rt savolga javob yozasiz: sayt kim uchun, odam qanday muammoga duch keladi, sayt nima qiladi va odam oxirida nimaga erishadi.»
- Vizual: to'rt savol-javob birma-bir yozilib chiqadi; to'rtinchisi yonida «✓ TAYYOR» shtampi («yollandi» so'zi 11-ekrandan oldin ekranga chiqmaydi).

#### 1-BLOK · KIM UCHUN VA BIRINCHI NIMA KO'RINADI

**3 · Ikki vaziyat, bitta ilova** — bosib ochish
- Sarlavha: «Uzumga kirgan ikki odam nimaga ko'proq qaraydi?»
- Ikki karta: «Yangi telefon izlayotgan o'quvchi» · «Ertaga sovg'a bermoqchi bo'lgan o'quvchi». Bosilganda ilova sxemasida (brendsiz) har biri eng ko'p qaraydigan joy yonadi: biri — sharhlar va baho («yaxshi telefonmi?»), ikkinchisi — mahsulot sahifasidagi yetkazib berish muddati («ertaga yetib keladimi?»).
- Xulosa: «Bitta saytga kirgan odamlarning maqsadi har xil bo'ladi. Hammaga yozilgan gapda hech kim o'zini tanimaydi. Saytdan foydalanadigan, ehtiyoji o'xshash odamlar guruhi **auditoriya** deyiladi. Ular kirganda birinchi qiladigan ish ko'zga tashlanib tursin: Uzumda xaridor odatda avval kerakli narsani qidiradi — qidiruv qatori tepada.»

**4 · TEST-1** (ball)
- Lead: «Sahifa tepasida faqat "Bizda hamma narsa bor!" deb yozilgan.» Cue: «Bunday sahifaning asosiy kamchiligi nimada?»
- ✓ Uni o'qigan odam sayt aynan unga kerakligini tushunmaydi · Uni qurish oddiy sahifadan ancha qimmatga tushadi · Unda sahifalar oddiy saytdan sekinroq ochiladi · Uni reklamasiz internetda hech kim topolmaydi
- Reveal: «To'g'ri. "Hamma narsa" — juda umumiy gap. Telefon izlayotgan o'quvchi ham, sovg'a bermoqchi bo'lgan o'quvchi ham unda o'ziga kerakli narsani ko'rmaydi.»
- Xato-izohlar (bir gap): qimmat → «Gap narxda emas. Sahifani o'qigan odam nimani o'ylaydi?» · sekin → «Gap tezlikda emas. Bu gap kimga aytilgan?» · reklama → «Gap topishda emas. Sahifani ochgan odam unda o'zini ko'radimi?»

#### 2-BLOK · MUAMMO QAYERDA BO'LADI

**5 · Muammoning to'rt belgisi** — bosib ochish
- Sarlavha: «Tumanda yashaydigan odam telefon sotib olmoqchi bo'lsa, nima qilardi?»
- Kichik sarlavha (kartalar ustida): «Muammo borligini qanday bilamiz?»
- To'rt karta, bitta odam — tumanda yashaydigan xaridor:
 - Muammo qayta-qayta takrorlanadi — har safar katta shaharga borishi kerak
 - Odam o'zicha chora izlaydi — shaharga ketayotgan tanishidan «olib keling» deb so'raydi
 - Vaqt yoki pul yo'qotadi — borib-kelishga bir kun va yo'l haqi ketadi
 - Ba'zan kerakli narsasidan voz kechadi — «Mayli, olmay qo'ya qolay» deydi
- Xulosa: «Odam muammoni o'zicha hal qilishga urinayotgan bo'lsa, bu muammo unga befarq emasligini ko'rsatadi. Belgilar qancha ko'p bo'lsa, muammo shuncha rost.»

**6 · Keys: Uzum** — bashorat + 3 slayd (bank-faktlari)
- Sarlavha: «Uzum dastlab qaysi muammoga javob berdi?»
- Bashorat: «2022-yil oktabr, Uzum Market ishga tushyapti. Sizningcha, Uzum avval nimaga e'tibor qaratdi?» — Narsani xaridorga yetkazib berishga · Chiroyli sayt va qulay ilovaga · Televizor va ko'chadagi reklamaga
- Slaydlar:
 1. «Undan oldin ko'pchilik narsani Instagram va Telegram guruhlaridan xarid qilardi. Lekin narsani xaridorga yetkazib berish har doim ham yo'q edi.»
 2. «Uzumning dastlabki asosiy e'tibori narsani xaridorga yetkazib berishga qaratildi: o'z mashinalari, topshirish punktlari (buyurtmani borib oladigan joy) va ertasi kuni yetkazish.»
 3. «2024-yil martda Uzum O'zbekistonda 1 milliard dollardan qimmat baholangan birinchi kompaniya bo'ldi. Bunday kompaniyalarni "yagona shoxli" deb atashadi. 2025-yilda Uzumga oyiga 17 millionga yaqin odam kirgan.»
- Ko'prik: «Odamlar kerakli narsani Instagram va Telegram orqali topishi mumkin edi, lekin uni xaridorga yetkazib berish masalasi hal qilinmagan edi. Uzum shu muammoga javob beradigan xizmatni yo'lga qo'ydi.»

**7 · TEST-2** (ball)
- Lead: «Qo'shningiz har safar biror narsa kerak bo'lsa, Telegram guruhga "Toshkentdan kim olib kelib beradi?" deb yozadi.» Cue: «Bu nimani ko'rsatadi?»
- ✓ U narsa olish muammosini o'zicha hal qilyapti · U guruhda ko'proq gaplashishni yaxshi ko'radi · Bu shunchaki odat — orqasida muammo yo'q · Unga o'sha narsalar unchalik shart emas
- Reveal: «To'g'ri. U kerakli narsani olish uchun har safar boshqa odamdan yordam so'rayapti. Bu — muammoni o'zicha hal qilishga urinayotganining belgisi.»
- Xato-izohlar: gaplashish → «U guruhga suhbat uchun emas, narsa olish uchun yozadi.» · odat → «Har safar birovdan so'rash — oddiy odat emas. U qulay yo'l topa olmaganini ko'rsatishi mumkin.» · shart emas → «Har safar boshqa odamdan so'rashi — unga o'zi uchun qulay yechim topilmaganini ko'rsatishi mumkin.»

**8 · Aniq gap yig'ing** — konstruktor
- Sarlavha: «"Xarid qilish qiyin" gapini qanday aniq qilasiz?»
- Lead (sarlavha ostida): «Voqea: tumanda yashaydigan xaridor telefon olmoqchi bo'ldi va bir kunini shaharga borib-kelishga sarfladi.»
- Uch bo'lak, har birida 3 variant (✓ birinchi). Noto'g'ri variantlar ham tabiiy eshitiladi — faqat voqeadagi aniq ma'lumotni bermaydi (2-o'tish 2-darsi 7-ekrani bilan bir qoida):
 - KIM: tumanda yashaydigan xaridor · hamma odamlar · shahardagi xaridorlar
 - QACHON: telefon olmoqchi bo'lganda · bayram oldidan · dam olish kunlari
 - NIMASI OG'IR: bir kunini yo'lga sarflaydi · do'konlardan norozi · narsa tanlashda qiynaladi
- Gap-qolipi: «{QACHON} {KIM} {NIMASI OG'IR}.» — har juftlik tugal chiqadi («Bayram oldidan shahardagi xaridorlar do'konlardan norozi.» · «Dam olish kunlari hamma odamlar narsa tanlashda qiynaladi.»).
- ✕ tanlansa, bir qator: KIM — «Kim ekani aniq emas: qaysi odam, qayerda yashaydi?» · QACHON — «Voqeada bu vaqt yo'q: u telefon olmoqchi bo'lgan edi» · NIMASI OG'IR — «Norozi yoki qiynaladi — lekin aynan nima bo'ldi, nima ketdi?»
- Natija-gap: «Telefon olmoqchi bo'lganda tumanda yashaydigan xaridor bir kunini yo'lga sarflaydi.»
- Xulosa (harakatdan keyin): «Uchala bo'lagi bor gap **aniq muammo** deyiladi. "Xarid qilish qiyin" esa nolish: undan nimani tuzatish kerakligi bilinmaydi.»

#### 3-BLOK · MUAMMODAN YECHIMGA

**9 · Har narsa — bitta javob** — bosib ochish
- Sarlavha: «Uzum ilovasidagi bu to'rt narsa qaysi muammoga javob beradi?»
- Ilova sxemasida 4 joy bosiladi, har biri o'z muammosini ochadi:
 - «Yetkazib berish muddati — narsa qachon kelishi oldindan bilinadi»
 - «Topshirish punkti — uyda kutmaysiz, qulay vaqtda borib olasiz»
 - «Sharhlar va baho — ushlab ko'rmay turib ham, boshqalar fikriga qarab tanlaysiz»
 - «Qidiruv qatori — kerakli narsani varaqlab o'tirmay topasiz»
- Xulosa: «Har biri bitta aniq muammoga javob beradi. Muammoga javob beradigan shunday narsa **yechim** deyiladi.»

**10 · TEST-3** (ball)
- Lead: «Internet-do'kon ilovasi jamoasida kimdir taklif qildi: "Ilova ochilganda chiroyli animatsiya qo'shaylik".» Cue: «Birinchi qaysi savolni berasiz?»
- ✓ Bu kimning qaysi muammosini hal qiladi? · Bu animatsiya necha kunda tayyor bo'ladi? · Bu animatsiya qaysi rangda chiroyliroq? · Boshqa ilovalarda ham animatsiya bormi?
- Reveal: «To'g'ri. Uzumdagi to'rt narsaning har biri bitta muammoga javob edi. Animatsiya ham avval shu savoldan o'tadi.»
- Xato-izohlar: kunlar → «Qancha vaqt ketishi keyin so'raladi. Avval: bu kimga kerak?» · rang → «Rang — keyingi savol. Avval: bu qaysi muammoga javob?» · boshqa ilovalar → «Boshqalarda borligi — sabab emas. Bu kimning muammosini hal qiladi?»

#### 4-BLOK · ODAM ASLIDA NIMANI OLADI

**11 · Telefon emas — natija** — bosib ochish
- Sarlavha: «Uzumdan telefon olgan odam aslida nimani oldi?»
- Uch karta ochiladi (oldida — odam nima qildi, orqasida — aslida nimaga erishdi):
 - «Telefon buyurtma qildi» → «Do'konga bormay, ertaga telefonli bo'ldi»
 - «Eng yangi modelni tanladi» → «Do'stlari orasida zamonaviy ko'rinadi»
 - «Onasiga sovg'a buyurtma qildi» → «Onasini xursand qildi»
- Xulosa: «Odam mahsulotning o'zini emas, u beradigan natijani oladi. Odam erishmoqchi bo'lgan natija **vazifa** deyiladi (Jobs-to-be-Done) — uy vazifasi emas, odam hayotida bajarmoqchi bo'lgan ish. Mahsulotni odam go'yo shu ishga yollaydi.»

**12 · TEST-4** (ball)
- Lead: «Sinfdoshingiz bir oy ichida yugurish poyabzali oldi, telefoniga mashq ilovasini yukladi va sport soati taqdi.» Cue: «U bularning hammasi bilan aslida nimaga erishmoqchi?»
- ✓ Sog'lom, baquvvat va chaqqon bo'lishga · Yangi yugurish poyabzaliga ega bo'lishga · Mashq ilovasidan har kuni foydalanishga · Qo'lida sport soati bilan yurishga
- Reveal: «To'g'ri. Poyabzal, ilova va soat — shu natija uchun olingan mahsulotlar. Vazifa — sog'lom va baquvvat bo'lish.»
- Xato-izohlar: poyabzal → «Poyabzal — mahsulot. U nima uchun olindi?» · ilova → «Ilovadan foydalanish — harakat. Oxirida u nimaga erishadi?» · soat → «Soat — mahsulot. Uni taqib nimaga erishmoqchi?»

**13 · Juftini toping** — juftlash (ballsiz)
- Sarlavha: «Har mahsulot qaysi vazifaga yollangan?»
- 4 juft: velosiped → maktabga tez yetib borish · budilnik → ertalab vaqtida uyg'onish · til o'rgatuvchi ilova → chet tilida erkin gapirish · rangli telefon g'ilofi → do'stlar orasida ajralib turish.
- Xulosa: «Vazifa — mahsulotning nomi ham, u bilan qilinadigan harakat ham emas. Bu — odam erishadigan natija.»

#### O'Z G'OYANGIZ

**14 · To'rt savolli karta** — ustaxona, bittalab
- Sarlavha: «Tanlagan g'oyangiz haqida to'rt savolga javob bera olasizmi?»
- Mentor (1 gap): «To'rt savolga javob bering — ular bitta kartaga yig'iladi.»
- 4 savol navbat bilan, yorliqlar savol shaklida, namunalar kesim shaklida. Muammo savolida ikki yozuv joyi bor (qachon · nimasi og'ir), KIM birinchi savoldan o'zi qo'shiladi:
 - «Sayt kim uchun?» — namuna: «hovlida futbol o'ynaydigan o'smirlar»
 - «Odam qanday muammoga duch keladi?» — ikki joy: «Qachon?» (namuna: «kechqurun, maktabdan keyin») · «Nimasi og'ir?» (namuna: «maydonga borib, uni band holda topadi»); gap 8-ekran qolipi bilan yig'iladi: «{QACHON} {KIM} {NIMASI OG'IR}.»
 - «Sayt nima qiladi?» — namuna: «bo'sh vaqtni ko'rsatib, band qilib beradi»
 - «Odam oxirida nimaga erishadi?» — namuna: «do'stlari bilan kutmasdan o'ynaydi»
- Tekshiruvlar: KIM da «hamma» → «"Hamma" — bu hali auditoriya emas. Kim, qaysi vaziyatda?»; YECHIM da sifat-so'z («chiroyli, zamonaviy, qulay») → «Bu — baho. Sayt aynan nima qiladi?»; VAZIFA da mahsulot nomi yoki harakat → «Bu — mahsulot yoki harakat. Odam oxirida nimaga erishadi?».
- G'oyasi yo'q o'quvchiga 4 tayyor g'oya (1-o'tish 1-darsidagi olam; bu yerda to'rt savolga to'ldirildi, qolipga qo'yib tekshirildi):

 | Olam | KIM | QACHON | NIMASI OG'IR | SAYT NIMA QILADI | ODAM NIMAGA ERISHADI |
 |---|---|---|---|---|---|
 | Futbol | hovlida futbol o'ynaydigan o'smirlar | Kechqurun, maktabdan keyin | maydonga borib, uni band holda topadi | bo'sh vaqtni ko'rsatib, band qilib beradi | do'stlari bilan kutmasdan o'ynaydi |
 | O'yin | onlayn o'yin o'ynaydigan o'quvchilar | Jamoaviy bellashuv o'rtasida | sherigi chiqib ketib, yutqazib qo'yadi | darajasi va vaqti mos jamoadosh topib beradi | o'yinni oxirigacha o'ynab, yutadi |
 | Sinf | sinf sardori | Ustozga sovg'aga pul yig'ilganda | kim bergani, kim bermaganini adashtirib yuboradi | kim pul berganini belgilab boradi | sovg'ani janjalsiz, vaqtida oladi |
 | Kiyim | internetdan kiyim oladigan o'smir | Posilkani ochganda | kiyim to'g'ri kelmay, qaytarishga ovora bo'ladi | bo'y va vaznga qarab mos o'lchamni ko'rsatadi | birinchi urinishdayoq mos kiyim oladi |

- **3-dars uchun qo'shimcha ikki ustun:**

 | Olam | BIRINCHI BO'LAK | 1 SHART — foydalanuvchi nima qiladi? → shundan keyin nima bo'ladi? |
 |---|---|---|
 | Futbol | bo'sh vaqtni band qilish | Bo'sh vaqt bosilsa → «Band qilindi» yozuvi chiqadi |
 | O'yin | mos jamoadosh topish | «Qidirish» bosilsa → darajasi mos o'yinchilar ro'yxati chiqadi |
 | Sinf | pul berganni belgilash | Ism bosilsa → yonida ✓ chiqadi |
 | Kiyim | mos o'lchamni ko'rsatish | Bo'y va vazn yozilsa → bitta mos o'lcham chiqadi |

- Saqlanadi: ekranda faqat «✓ Karta saqlandi».

**15 · Sherik-tekshiruv** — 3 tayyor kartaga hukm
- Sarlavha: «Har kartada bitta qator chala. Nimasi yetishmaydi?»
- Karta 1: MUAMMO «Odamlar ko'p ovqat buyurtma qiladi» · Karta 2: YECHIM «Zamonaviy va qulay ilova» · Karta 3: VAZIFA «Ilovani ochadi». Har karta uchun o'quvchi sababni bitta umumiy uch variantdan tanlaydi: «Nimasi og'irligi aytilmagan» · «Sayt nima qilishi aytilmagan» · «Natija emas, harakat yozilgan» (har sabab aynan bitta kartaga tushadi).
- Xulosa: «Har qatorning o'z savoli bor: muammoda — nimasi og'ir, yechimda — sayt nima qiladi, vazifada — odam nimaga erishadi.»

#### AI BILAN

**16 · AI — foydalanuvchi rolida**
- Sarlavha: «Kartangizdagi odam bu muammo haqida nima der edi?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI kartangizdagi odam o'rnida javob beradi. Kartada nima qolishini o'zingiz hal qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
 > «Siz shunday odamsiz: [KIM]. Menimcha, sizda shunday muammo bor: [QACHON] [NIMASI OG'IR]. Javob bering: 1) Bu sizda oxirgi marta qachon bo'lgan? 2) O'shanda aslida nimaga erishmoqchi edingiz? Mahsulot taklif qilmang, faqat o'z vaziyatingizni aytib bering.»
- «Nusxalash» → gemini.google.com → o'quvchi javobni kartasidagi muammo va «odam oxirida nimaga erishadi» javobi bilan solishtiradi, o'zi tuzatadi yoki qoldiradi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda o'sha ikki savol katta yozuv bilan chiqadi: «Bu sizda oxirgi marta qachon bo'lgan?» · «O'shanda aslida nimaga erishmoqchi edingiz?» Sherigingiz kartangizdagi odam o'rnida javob beradi, siz javobni kartangiz bilan solishtirasiz. Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi.
- Qoida ekranda: «AI — o'ylab topilgan bitta odam, haqiqiy foydalanuvchi emas. Kartada nima qolishini siz hal qilasiz.»

#### YAKUN

**17 · Juftlik** — ballsiz
- Sarlavha: «Sherigingiz g'oyangizni 30 soniyada tushuna oladimi?»
- Yo'riq: «Sherigingizga 30 soniyada aytib bering: g'oyangiz kim uchun va o'sha odam oxirida nimaga erishadi.» → «Sherigingiz nima dedi? Bir qatorga yozing.»

**18 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**19 · Flashcard** (5 ta — hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Auditoriya nima? | Saytdan foydalanadigan, ehtiyoji o'xshash odamlar guruhi |
| Odam o'zicha chora izlasa, bu nimani ko'rsatadi? | Muammo unga befarq emas |
| Aniq muammo qaysi uch bo'lakdan iborat? | Kim · qachon · nimasi og'ir |
| Yangi taklif kelsa, birinchi qaysi savol beriladi? | Bu kimning qaysi muammosini hal qiladi? |
| Odam aslida nimani oladi? | Mahsulotning o'zini emas, u beradigan natijani |

**20 · Arena + yakun**
- Arena: 12 savol (3/3/3/3), to'rt blokdan teng, ekran savollarining nusxasi emas.
- Yakun — 4 qator (to'rt blok):
 - Sayt ehtiyoji o'xshash aniq odamlar uchun qilinadi.
 - Muammo belgilar bilan topiladi va aniq gap bilan yoziladi: kim, qachon, nimasi og'ir.
 - Har yechim bitta muammoga javob beradi.
 - Odam mahsulotning o'zini emas, u beradigan natijani oladi.
- Mentor og'zaki: «Backend modulida shu kartadagi ma'lumot qayerda va qanday saqlanishini hal qilasiz.»

---

### 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 4 · 7 · 10 · 12 — har biri o'z blokidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Clear Problem!** (8) — «"Xarid qilish qiyin" gapini aniq muammoga aylantirdingiz» · **Perfect Match!** (13) — «To'rt mahsulotni o'z vazifasiga ulab chiqdingiz» · **Idea Card!** (14) — «O'z g'oyangiz uchun to'rt savolli karta yozdingiz» · **Nice Catch!** (15) — «Uch kartadagi chala qatorni topdingiz» |

### 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| 1-blok · Kim uchun | 3–4 | 10 |
| 2-blok · Muammo qayerda | 5–8 | 22 |
| 3-blok · Muammodan yechimga | 9–10 | 10 |
| 4-blok · Aslida nimani oladi | 11–13 | 15 |
| O'z g'oyasi + sherik | 14–15 | 12 |
| AI + juftlik | 16–17 | 8 |
| Yakun | 18–20 | 5 |
| Bufer | | 3 |

Bufer 3 daqiqa — bu dars zich. Sinovda vaqt yetmasa, 13-ekran (juftlash) qisqartiriladi.

---

## 3-o'tish · 2-dars — «Nima quramiz va qachon tayyor?» (taksi ilovasini biz qursak · Instagram keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B5-NimaQuramiz.md`

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | Node.js (Express) va NestJS darslariga o'tadigan o'quvchi (3 darsning 2-si, «Kim uchun va qanday muammo?» dan keyin) |
| Mavzular (4) | User Story · Dekompozitsiya · Prioritet · Acceptance Criteria |
| Maqsad | O'quvchi o'z g'oyasiga **bitta foydalanuvchi hikoyasi** yozadi, g'oyani alohida bo'laklarga ajratadi, qaysi bo'lakni avval qurishni **odamlar ehtiyoji va taxminiy vaqtga** qarab tanlaydi va tanlangan bo'lakka **3 ta tekshiriladigan shart** yozadi |
| Misol-ip | **O'zimizning taksi ilovamiz** — «taksi chaqirish xizmatini o'zimiz noldan qursak». Yandex Go faqat taqqoslash namunasi (5-ekranda bir marta): qurilayotgan ilova — bizniki, uning bo'laklari, sonlari va xatolari ham bizniki |
| Keys | K3 Instagram — «Burbn'dan uchta narsa qoldi». Matn 2-o'tish 3-darsida foydalanuvchi tasdiqlagan ko'rinishda (sana va 25 000 raqami ekranda aytilmaydi) |
| O'z ishi | Oldingi darsdagi karta ochiladi → 1 hikoya → 4 bo'lak → birinchi bo'lak + sabab → 3 shart. Keyingi darsga o'tadi |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

### 2. Darsning to'rt asosiy fikri

1. **Hikoyada uchta narsa bor: kim, nimani xohlaydi va nima uchun.** Uchalasi ham kerak. «Nima uchun» qismi dasturchiga bu imkoniyat odamga qanday foyda berishini tushuntiradi. «Xaritaga mashinani qo'shing» — oddiy topshiriq; «Men kechqurun to'garakdan qaytadigan o'quvchi sifatida, mashina qayerdaligini xaritada ko'rishni xohlayman — ko'chada kutib qolmaslik uchun» — hikoya.
2. **Katta ish alohida bajarib, tekshirib bo'ladigan kichikroq bo'laklarga ajratiladi.** Birinchi versiya — odamga asosiy foydani beradigan va g'oyani sinab ko'rishga yetadigan eng kichik mahsulot.
3. **Qaysi bo'lak avval — bu darsda ikki sodda mezon bilan tanlanadi:** qancha odamga kerak va qancha vaqt oladi. Real loyihalarda boshqa mezonlar ham bo'ladi (masalan, xavfsizlik yoki bir bo'lak boshqasiga bog'liqligi).
4. **«Ishlaydi» va «tayyor» boshqa-boshqa.** «Ishlaydi» — biror holatda to'g'ri natija berdi. «Tayyor» — oldindan kelishilgan hamma shart bajarildi va muhim holatlar tekshirildi. Shartda nima qilinishi va natijada nima bo'lishi aniq yozilsin — kerak bo'lsa son bilan.

Ip-zanjir: **hikoya → bo'laklar → birinchisi → uch shart → o'z g'oyamga xuddi shunday.**

> **Yandex Go halolligi:** Yandex Go bir marta (5-ekran) taqqoslash namunasi sifatida nomlanadi — unda **ko'rinib turgan** narsalar: manzil kiritish · narx buyurtmadan oldin · mashina xaritada · haydovchi va mashina ma'lumoti · safardan keyin baho (qurishda ilovaning hozirgi ko'rinishi bilan tekshiriladi). Qolgan hamma narsa — «biz qurayotgan ilova» haqida: uning bo'laklari, 8-ekrandagi odamlar soni va kunlar (mashq uchun taxmin), xatolari (10-ekrandagi bo'sh manzil bilan ketgan buyurtma) **bizning ilovamizda**, Yandex Go'da emas. Ekranda shu farq ochiq yoziladi: 5-ekranda «ro'yxatni biz o'zimiz tuzdik», 8-ekranda «Odamlar soni va vaqt — mashq uchun qilgan taxminimiz, Yandex Go ma'lumoti emas», 10-ekranda «…bizning ilovamizning "Mashina chaqirish" bo'lagi, Yandex Go emas».

---

### 3. Ekranlar

#### KIRISH

**1 · Hook** — ikki so'rovni solishtirish, ovoz berish
- Sarlavha: «Dasturchiga ikki xil topshiriq keldi. Qaysi biri unga ko'proq yordam beradi?»
- Ikki karta: «Xaritaga mashinani qo'shing.» ↔ «Men kechqurun to'garakdan qaytadigan o'quvchi sifatida, mashina qayerdaligini xaritada ko'rishni xohlayman — ko'chada kutib qolmaslik uchun.»
- Javob (ovozdan keyin, ikkala tanlovga bir xil): «Birinchisi qisqa va nimani qilish kerakligini aytadi. Lekin unda kim uchun va nima sababdan kerakligi yo'q. Ikkinchisida esa odam, uning istagi va kutayotgan foydasi ham bor. Ikkinchisi uzunroq bo'lgani uchun emas, shu uchta narsa uchun foydaliroq.»

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «O'zingiz tanlagan g'oyaga bitta hikoya yozasiz. Keyin g'oyani bo'laklarga bo'lib, qaysi biridan boshlashni tanlaysiz. Oxirida tanlagan bo'lagingiz tayyor bo'lganini qanday tekshirishni uchta shart bilan yozasiz.»
- Vizual: hikoya-karta → 4 bo'lakka sochiladi → bittasi yashil «birinchi» bo'lib ajraladi → yonida 3 ta ✓ shart yozilib chiqadi. Chapdan o'ngga.

#### 1-BLOK · HIKOYA

**3 · Uch qism** — sudrab yig'ish
- Sarlavha: «Hikoyaning uch qismini joyiga qo'ya olasizmi?»
- Uch qism aralash turadi (yakka o'qilganda ham tugal): «kechqurun to'garakdan qaytadigan o'quvchi» (KIM) · «mashina qayerdaligini xaritada ko'rish» (NIMANI XOHLAYDI) · «ko'chada kutib qolmaslik» (NIMA UCHUN). O'quvchi qolipga joylaydi: «Men {KIM} sifatida, {NIMA}ni xohlayman — {NIMA UCHUN} uchun.» Yig'ilgan gap 1-ekrandagi ikkinchi kartaning aynan o'zi.
- Xulosa (harakatdan keyin): «Kimligi, nimani xohlashi va nima uchun xohlashi ko'rsatilgan bunday gap **foydalanuvchi hikoyasi** (User Story) deyiladi. Uchala qism ham kerak: "nima uchun" qismi dasturchiga bu imkoniyat odamga qanday foyda berishini tushuntiradi.»

**4 · TEST-1** (ball)
- Cue: «Qaysi gapda kim, nimani xohlashi va nima uchun — uchalasi ham bor?»
- ✓ Men shoshayotgan o'quvchi sifatida, narxni oldindan ko'rishni xohlayman — pulim yetishini bilish uchun · Men ilovadan har kuni foydalanadigan odam sifatida, narxni buyurtmadan oldin ekranda ko'rishni xohlayman · Narx buyurtmadan oldin ekranda ko'rinib tursin — safarimni oldindan rejalashtirib olish uchun · Xaritani kattaroq qiling, mashinani esa unda yaxshiroq ko'rinadigan va yorqin qilib qo'ying
- Reveal: «To'g'ri — bu gapda kim ham, nimani xohlashi ham, nima uchun ham bor.» · Xato-izohlar: (2) «Kim va nima bor, lekin odam buni nima uchun xohlayotgani aytilmagan.» · (3) «Nimani xohlashi va nima uchun bor, lekin kim ekani aytilmagan.» · (4) «Bu — oddiy topshiriq: kim uchun va nima uchun, aytilmagan.»

#### 2-BLOK · BO'LAKLAR

**5 · Bo'laklaymiz** — bosib ochish
- Sarlavha: «Taksi ilovasini noldan qurish — bitta ishmi yoki bir nechta alohida ishmi?»
- Ekranda ochiq: «Yandex Go'da manzilni yozasiz, narxni oldindan ko'rasiz, mashinani xaritada ko'rasiz. Shunga qarab o'z ilovamizni bo'laklarga bo'ldik — ro'yxatni biz o'zimiz tuzdik.» Bitta karta «Taksi ilovasini qurish» → 6 bo'lak: Mashina chaqirish · Narxni oldindan ko'rish · Mashinani xaritada ko'rish · Haydovchini baholash · Karta bilan to'lash · Safarlar tarixi.
- Kartalar ostida kichik yozuv: «Bo'laklar bir xil kattalikda bo'lishi shart emas. Biz ularni alohida qurib, keyin tekshirib bo'ladigan qismlar sifatida ajratdik.»
- Xulosa: «Katta ilovani bitta ulkan ish sifatida boshqarish qiyin. Har bo'lakni alohida rejalashtirish, qurish va tekshirish osonroq. Katta ishni shunday bo'laklarga bo'lish **dekompozitsiya** deyiladi.»

**6 · Keys: Instagram** — bashorat + 3 slayd (2-o'tish 3-darsi bilan bir xil matn)
- Sarlavha: «Burbn ilovasida ko'p narsa bor edi. Odamlarga yoqqan nimalar qoldi?»
- Bashorat: «Instagram asoschilari avval Burbn degan ilova qilgan. Unda ko'p narsa bor edi: joy belgilash, reja tuzish, surat va yana boshqalar. Odamlarga undagi qaysi narsa yoqqan?» — Joy belgilash · Reja tuzish · Surat qo'yish
- Slaydlar:
 1. «Burbn'da ko'p narsa bor edi, lekin uni ishlatadiganlar juda kam edi.»
 2. «Jamoa odamlar eng ko'p yoqtirgan qismlarni qoldirdi: surat, filtr va izoh.»
 3. «Shu kichik ilova Instagram nomi bilan chiqdi — bugun hamma biladigan Instagram.»
- Ko'prik: «Instagram birinchi kuni uchta narsa bilan chiqdi. Odamga asosiy foydani beradigan va g'oyani sinab ko'rishga yetadigan shunday eng kichik mahsulot **birinchi versiya** (MVP) deyiladi.»

**7 · TEST-2** (ball)
- Cue: «Taksi ilovamizning birinchi versiyasi uchun qaysi to'plam yetarli?»
- ✓ Mashina chaqirishning o'zi — qolgani keyin · Karta bilan to'lashning o'zi — qolgani keyin · Olti bo'lakning hammasi, birortasi ham qolmasdan · Haydovchini baholash va safarlar tarixi
- Reveal: «To'g'ri — bu bo'lak odamga asosiy ishni bajarishga imkon beradi: mashina chaqirib, uyiga yetadi. Qolgan bo'laklar keyingi versiyalarda qo'shilishi mumkin.» · Xato-izohlar: (2) «To'lov bor, lekin mashina chaqirib bo'lmaydi — asosiy foyda yo'q.» · (3) «Hammasi bo'lsa, bu to'liq ilova. Birinchi versiya — asosiy foydani beradigan eng kichik mahsulot.» · (4) «Bu bo'laklar bilan mashina chaqirib bo'lmaydi — ilova asosiy foydani bermaydi.»

#### 3-BLOK · QAYSI BIRI AVVAL

**8 · Ikki savol, to'rt katak** — joylashtirish
- Sarlavha: «Olti bo'lakdan qaysi biri avval quriladi?»
- Ekran boshida kichik yozuv: «Bu darsda ikkita sodda mezon bilan tanlaymiz. Real loyihalarda boshqa mezonlar ham bo'ladi — masalan, xavfsizlik.»
- Ikki savol ochiladi: «Nechta odamga kerak? ↑» · «Qancha vaqt oladi? →». Ostida bir qator: «Bu mashqda bir haftagacha bo'lgan ishni "tez", bir haftadan ko'pini "uzoq" deb olamiz.» To'rt katak: 🎯 Avval qilinadi (ko'p · tez) · 🏔 Rejaga tushadi (ko'p · uzoq) · 🌱 Vaqt bo'lsa (kam · tez) · ⏳ Hozircha keyinroq (kam · uzoq).
- Har bo'lakda ikki javob yozilgan; kartalar ostida: «Odamlar soni va vaqt — mashq uchun qilgan taxminimiz, Yandex Go ma'lumoti emas.» Ma'lumot: Mashina chaqirish — deyarli hamma yo'lovchiga kerak · 2 kun (🎯) · Narxni oldindan ko'rish — ko'p yo'lovchiga kerak · 2 kun (🎯) · Mashinani xaritada ko'rish — deyarli hamma yo'lovchiga kerak · 3 hafta (🏔) · Karta bilan to'lash — ko'p yo'lovchiga kerak · 2 hafta (🏔) · Haydovchini baholash — kam yo'lovchiga kerak · 1 kun (🌱) · Safarlar tarixi — kam yo'lovchiga kerak · 2 kun (🌱). O'quvchi 6 bo'lakni kataklarga joylaydi.
- Xulosa: «Birinchi bo'lak — 🎯 Avval qilinadi katagidan. U yerda ikki bo'lak bor, ikkalasi ham ikki kunlik. Vaqt teng bo'lsa, bu mashqda ko'proq odamga kerak bo'lganini oldin tanlaymiz: "Mashina chaqirish". Qaysi ishni avval, qaysini keyin qilishni shunday tanlash **prioritet belgilash** deyiladi.»

**9 · TEST-3** (ball)
- Lead: «Yangi bo'lak — "Safarda qo'shiq tanlash": kam yo'lovchiga kerak, qurish uch hafta oladi.» Cue: «Bu bo'lak qaysi katakka tushadi?»
- ✓ Hozircha keyinroq — kam odamga kerak, qurish ham uzoq · Rejaga tushadi — uch hafta uzoq, demak rejaga qo'yamiz · Vaqt bo'lsa — kam odamga kerak, demak keyinroq qilamiz · Avval qilinadi — bu kichik bo'lak, tez qo'shiladi
- Reveal: «To'g'ri — ikkala savol ham shu katakni ko'rsatadi: kam odamga kerak, vaqt uzoq. Bu "keraksiz" degani emas — navbati keyin keladi.» · Xato-izohlar: (2) «Bu mashqda "Rejaga tushadi" katagi ko'p odamga kerak, lekin uzoq quriladigan ishlar uchun. Bu bo'lak kam odamga kerak.» · (3) «"Vaqt bo'lsa" katagiga tez quriladigan ish tushadi. Bu esa uch hafta oladi.» · (4) «Uch hafta bir haftadan ko'p — bu mashqda "tez" emas.»

#### 4-BLOK · QACHON TAYYOR

**10 · «Ishlaydi» yoki «tayyor»?** — buyurtma oynasi + 4 shart
- Sarlavha: «Dasturchi "Chaqirish tugmasi ishlaydi" dedi. Bu "tayyor" deganimi?»
- Ekranda ochiq: «Bu — bizning ilovamizning "Mashina chaqirish" bo'lagi, Yandex Go emas.» Oyna: manzil maydoni · «Chaqirish» tugmasi · buyurtmalar ro'yxati. Yonida 4 shart: «Manzil yozib bosilsa, "Buyurtma yuborildi" yozuvi chiqadi» · «Manzil bo'sh bo'lsa, buyurtma yuborilmaydi» · «Tugma ketma-ket ikki marta bosilsa ham, faqat bitta buyurtma yuboriladi» · «Buyurtmalar ro'yxatida yuborilgan buyurtmaning manzili ko'rinadi». O'quvchi bosib ko'radi: 1 va 4 ✓; manzilsiz buyurtma yuborildi ✗; ikki bosish — ikki buyurtma ✗.
- Xulosa: «"Ishlaydi" — biror holatda to'g'ri natija berdi. "Tayyor" — oldindan kelishilgan hamma shart bajarildi va muhim holatlar tekshirildi, odam adashishi mumkin bo'lgan holatlar ham. Ish qachon tayyor deb hisoblanishini ko'rsatadigan, oldindan kelishilgan tekshiriladigan shartlar ro'yxati **qabul shartlari** (Acceptance Criteria) deyiladi.»

**11 · TEST-4** (ball)
- Cue: «Qaysi shartni aniq tekshirib bo'ladi?»
- ✓ Safar tugagach, 1 dan 5 gacha yulduz tanlash oynasi chiqadi · Safar tugagach, baho qo'yish oynasi chiroyli ko'rinadi · Mashina chaqirilgach, kutish vaqti juda qisqa bo'ladi · Ilova ochilgach, undagi hamma narsa qulay va tushunarli bo'ladi
- Reveal: «To'g'ri — safar tugagach oyna chiqadimi va unda 1 dan 5 gacha yulduz tanlash mumkinmi, buni amalda tekshirish mumkin.» · Xato-izohlar (umumiy): «"Chiroyli", "qisqa", "qulay" o'zicha noaniq — har kim har xil tushunadi. Shartda nima qilinishi, natijada nima bo'lishi yoki aniq son yozilsin: masalan, "kutish 5 daqiqadan oshmaydi".»

**12 · Besh qadam tartibi** — tartiblash (ballsiz)
- Sarlavha: «Shartlar qachon yoziladi — ishdan oldinmi, keyinmi?»
- 5 qadam aralash: Shartlarni yozamiz → Shartlarni dasturchi bilan kelishamiz → Dasturchi kodni yozadi → Har shartni birma-bir tekshiramiz → Hammasi bajarilsa, «tayyor» deymiz.
- Xulosa: «Shartlar ish boshlanishidan oldin yoziladi. Shunda dasturchi nimani qurishini oldindan biladi, "tayyor" deganda esa nimani tekshirish kerakligi aniq bo'ladi. Tekshiruvda xato chiqsa, dasturchi tuzatadi va shart qayta tekshiriladi.»

#### O'Z G'OYANGIZ

**13 · Hikoyangiz** — ustaxona
- Sarlavha: «Tanlagan g'oyangizga bitta hikoya yoza olasizmi?»
- Oldingi darsdagi kartangiz yonda ochiq turadi (sayt kim uchun · qanday muammo · sayt nima qiladi · odam oxirida nimaga erishadi). **Karta bo'lmasa** (boshqa kompyuter): oldingi darsning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim) tanlov bo'lib chiqadi — tanlangani karta o'rnida turadi.
- Ko'prik-gap (maydonlar ustida): «Kartada sayt nima qilishi yozilgan edi. Endi shu fikrni odamning o'z tilida yozamiz: "Men … ni xohlayman".»
- Uch maydon, yorliqlar savol shaklida: «Kim?» (kartadagi «Sayt kim uchun?» javobidan) · «Nimani xohlaydi?» (kartadagi «Sayt nima qiladi?» javobidan) · «Nima uchun?» (kartadagi «Odam oxirida nimaga erishadi?» javobidan). Karta javobi maydonga o'zi tushmaydi — namuna bo'lib turadi (karta qatorlari boshqa shaklda yozilgan).
- Qolip: «Men {KIM} sifatida, {NIMA}ni xohlayman — {NIMA UCHUN} uchun.» Namuna (futbol): «hovlida futbol o'ynaydigan o'smir» · «maydonning bo'sh vaqtini oldindan band qilish» · «maydon bo'shashini kutmasdan do'stlarim bilan o'ynash».
- Tekshiruvlar: KIM ko'plikda → «Bu qolipda bitta odam nomidan yozamiz: "o'smirlar" o'rniga "futbol o'ynaydigan o'smir". Shunda uning ehtiyoji aniqroq ko'rinadi.»; NIMA UCHUN harakatni takrorlasa → «Bu hali harakat. Shundan keyin odam nimaga erishadi?»

**14 · Bo'laklar va birinchisi** — ustaxona
- Sarlavha: «G'oyangiz qaysi bo'lakdan boshlanadi?»
- Mentor (1 gap): «Taksi bo'laklariga bergan ikki savolni endi o'z bo'laklaringizga bering.» Shart-yorliqlari: «4 ta bo'lak» · «Har biriga ikki javob» · «Birinchisi va sababi».
- Yo'riq (kichik yozuv): «G'oyangizni 4 ta asosiy bo'lakka ajrating — juda mayda ham, juda katta ham emas: har birini alohida bajarib, tekshirib bo'ladigan qilib yozing.»
- O'quvchi 4 bo'lak yozadi → har biriga ikki javob: «Ko'p odamga · Kam odamga» · «Bir haftagacha · Bir haftadan ko'p» → katak o'zi chiqadi → 🎯 dagi bittasini «birinchi» deb belgilaydi → sabab bir qator. Sababda odam soni ham, vaqt ham bo'lmasa: «Sababda kamida bitta mezon ko'rinsin: nechta odamga kerakligi yoki qancha vaqt olishi. Imkon bo'lsa, ikkalasini ham yozing.»
- 🎯 bo'sh qolsa: «🎯 katagi bo'sh qoldi. Qaysi bo'lakni soddalashtirib, tezroq foyda beradigan kichik qismga aylantirish mumkinligini o'ylang.»

**15 · Uch shart** — ustaxona
- Sarlavha: «Birinchi bo'lagingiz qachon "tayyor" bo'ladi?»
- Birinchi bo'lakka 3 shart bittalab, ikki maydonda: «Foydalanuvchi nima qiladi?» · «Shundan keyin nima bo'ladi?» Namuna: «Bo'sh vaqt bosilsa» · «"Band qilindi" yozuvi chiqadi».
- Jonli tekshiruv: baho-so'zlar (chiroyli · qulay · zamonaviy · tez · yaxshi) → «Buni qanday tekshirasiz? Nima qilinishi va nima bo'lishini aniq yozing, kerak bo'lsa son bilan: masalan, "2 soniyada ochiladi".»; takror shart → «Bu shart oldingisini takrorlayapti. Boshqa holatni oling.»
- Saqlanadi: «✓ Hikoya, bo'laklar va shartlar saqlandi».

#### AI BILAN

**16 · AI — sinovchi rolida**
- Sarlavha: «Shartlaringiz qaysi holatni o'tkazib yuborgan?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI shartlaringizda yetishmagan holatni topishga yordam beradi. Qaysi shartni qo'shishni o'zingiz hal qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
 > «Siz ilovadagi xatolarni qidiradigan sinovchisiz. Ilovaning bir bo'lagi: {birinchi bo'lak}. Uning shartlari: 1) {shart} 2) {shart} 3) {shart}. Ikki savolga javob bering: qaysi shart noaniq yozilgan — uni qanday ikki xil tushunish mumkin? Foydalanuvchi qaysi holatda adashishi mumkin, lekin bu holat shartlarda tekshirilmagan? Yangi shartni o'zingiz yozmang — faqat yetishmagan holatni tushuntiring, shartni keyin men o'zim yozaman.»
- «Nusxalash» → gemini.google.com → javobni o'qib, o'quvchi to'rtinchi shart qo'shadi yoki borini aniqroq yozadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda 3 tayyor sinov-savoli chiqadi, o'quvchi shartlariga qarab bittasini tanlaydi va to'rtinchi shartni o'zi yozadi: «Maydon bo'sh qoldirilsa-chi?» · «Tugma ketma-ket ikki marta bosilsa-chi?» · «Internet uzilib qolsa-chi?» Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi.
- Qoida ekranda: «AI shart yozmaydi, faqat yetishmagan holatni ko'rsatadi. Shartni qo'shish yoki qo'shmaslikni siz hal qilasiz.»

#### YAKUN

**17 · Juftlik** — ballsiz
- Sarlavha: «Sherigingiz shartingizni tekshira oladimi?»
- Yo'riq: «Sherigingizga 30 soniyada ayting: "Birinchi bo'lagim — …, chunki …. U tayyor ekanini shundan bilaman: …". Sherigingiz shartni qanday tekshirishini aytadi: nima qiladi va qanday natija kutadi.» → «Sherigingiz nima dedi? Bir qatorda yozing.»

**18 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**19 · Flashcard** (5 ta — hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Foydalanuvchi hikoyasida qaysi uch narsa bor? | Kim · nimani xohlaydi · nima uchun |
| Dekompozitsiya nima? | Katta ishni alohida bajarib, tekshirib bo'ladigan bo'laklarga bo'lish |
| Birinchi versiya nima? | Odamga asosiy foydani beradigan va g'oyani sinab ko'rishga yetadigan eng kichik mahsulot |
| Bu darsda qaysi bo'lak avval quriladi? | Ko'p odamga kerak va tez quriladigan |
| «Ishlaydi» va «tayyor» farqi nimada? | «Ishlaydi» — biror holatda to'g'ri natija berdi · «Tayyor» — kelishilgan hamma shart bajarildi va tekshirildi |

**20 · Arena + yakun**
- Arena: 12 savol (3/3/3/3), to'rt blokdan teng; ekran savollari va flashcard javoblarining nusxasi emas — boshqa vaziyatda (ovqat yetkazish ilovasi, maktab kutubxonasi sayti, o'yin ilovasi).
- Yakun — sarlavha: «Endi sizda shunchaki g'oya emas, uni qurishni boshlash uchun aniq reja bor.» Ostida 4 qator:
 - Hikoyangizda kim, nimani xohlashi va nima uchun — uchalasi bor.
 - Katta g'oyani alohida tekshirib bo'ladigan bo'laklarga ajratdingiz.
 - Birinchi bo'lakni odamlar ehtiyoji va vaqtga qarab tanladingiz.
 - Birinchi bo'lakka tekshiriladigan shartlar yozdingiz — ular bajarilib, muhim holatlar tekshirilsa, ish tayyor.
- Mentor og'zaki: «Backend modulida shu hikoya va bo'laklardan kelib chiqib, qanday ma'lumot kerakligini va uni qayerda saqlashni o'rganasiz.»

---

### 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 4 · 7 · 9 · 11 — har biri o'z blokidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Story Built!** (3) — «Hikoyaning uch qismini joyiga qo'ydingiz» · **Grid Master!** (8) — «Olti bo'lakni to'rt katakka joyladingiz» · **First Pick!** (14) — «G'oyangizning birinchi bo'lagini sababi bilan tanladingiz» · **Done Means Done!** (15) — «Birinchi bo'lagingizga uchta tekshiriladigan shart yozdingiz» |

### 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| 1-blok · Hikoya | 3–4 | 9 |
| 2-blok · Bo'laklar | 5–7 | 13 |
| 3-blok · Birinchisi | 8–9 | 10 |
| 4-blok · Tayyor | 10–12 | 14 |
| O'z g'oyasi | 13–15 | 20 |
| AI + juftlik | 16–17 | 9 |
| Yakun | 18–20 | 6 |
| Bufer | | 4 |

Dars zich (4 blok + 3 ustaxona). Vaqt yetmasa, birinchi qisqaradigan joy — 12-ekran (besh qadam), uni mentor og'zaki aytadi.

---

## 3-o'tish · 3-dars — «Qanday ko'rsatamiz?» (eMaktab, ota-onalar yig'ilishi · Airbnb pitch keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B6-QandayKorsatamiz.md`

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | Node.js (Express) darslariga o'tadigan o'quvchi (3 darsning 3-si, oxirgisi; «Kim uchun, qanday muammo» va «Nima quramiz» dan keyin) |
| Mavzular (2 + 2) | Sistemani kod bilmaydigan odamga tushuntirish (kasbiy so'z · birinchi gap · o'xshatish · Airbnb tartibi) · Ko'rsatuv (ekran va gap · uch kadr · bosiladigan joy) |
| Maqsad | O'quvchi o'z g'oyasini kod bilmaydigan odamga **besh gapda** aytadi va birinchi bo'lagini **uch kadrda** ko'rsatadi: har kadrda bitta gap, o'rta kadrda bitta bosish va ko'rinadigan natija |
| Misol-ip | **eMaktab — «biz noldan qursak»** (ochiq faraz): birinchi versiyada ota-ona farzandining bugungi bahosini ko'radi. Uni **ota-onalar yig'ilishida** ko'rsatish kerak. eMaktabdan faqat ko'rinadigan narsa: baholar bo'limi bor (2-o'tish 3-darsida tekshirilgan, 2026-09-23). Tinglovchi: ota-ona (ekranda «ota-ona», «ota-onangiz» emas) |
| Keys | K12 Airbnb pitch — faqat bank-faktlari: birinchi taqdimoti — o'ntacha oddiy varaq · tartibi: muammo → yechim → bozor → mahsulot → jamoa · internetda ochiq turadi · raqamsiz. Ekranda «bozor» o'rniga PmLesson14 dagi ifoda: «yechimni qancha odam kutayotgani». Burchak (PmLesson14 bilan bir xil): besh qadamda «sayt qanday qurilgani» degan qadam yo'q — tartib odamlarning muammosidan boshlanadi, jamoa bilan tugaydi |
| O'z ishi | Oldingi darslardagi karta (kim · qachon + nimasi og'ir · sayt nima qiladi · odam nimaga erishadi) va birinchi bo'lak + 3 shart ochiladi → 5 gap → 3 kadr → tinglovchi kursisi. Kartasiz o'quvchiga 1-darsning 4 tayyor g'oyasi tanlov bo'lib chiqadi |
| Format | 19 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

### 2. Darsning to'rt asosiy fikri

1. **Kasbiy so'z tinglovchining boshida rasm hosil qilmaydi.** Uni tanish so'z bilan almashtirasiz — ma'nosi qoladi, faqat tushunarli bo'ladi; saytning ichi tinglovchining o'z hayotidan olingan o'xshatish bilan tushuntiriladi.
2. **Birinchi gap tinglovchi haqida:** u nimani bilmoqchi — shundan boshlaysiz. «Men qurdim» — oxirida. Airbnb besh qadami ham shu tartibda: odamlar qiynalgan muammodan boshlanadi, jamoa bilan tugaydi.
3. **Ekran nima borligini ko'rsatadi, gap nima uchunligini aytadi.** Ekranni takrorlagan gap tinglovchiga hech narsa bermaydi.
4. **Ko'rsatuv — uch kadr:** ilgari → mana, ishlaydi → endi. O'rta kadrda bitta bosish bor; bosiladigan joy — ish chindan bajariladigan joy, natijasi ko'rinishi shart.

Ip-zanjir: **eMaktab-farazini ota-onaga tushuntiramiz → Airbnb tartibi → ekranga gap qo'shamiz → uch kadr → o'z g'oyamizga xuddi shunday.**

> **eMaktab halolligi:** butun mashq ochiq faraz — «eMaktab kabi saytni biz noldan qurdik, birinchi versiyasida ota-ona farzandining bugungi bahosini ko'radi». eMaktabdan faqat **ko'rinadigan** narsa aytiladi: saytda baholar bo'limi bor (2-o'tish 3-darsi tekshiruvi). Saytning tarixi, raqamlari, ichki qarorlari aytilmaydi. Ekranlardagi sayt-maketi (bosh sahifa, farzand ismi, baholar ro'yxati) — **bizning farazimiz**, eMaktab skrinshoti emas; 1-ekran lead'ida faraz ochiq yoziladi. Nom faqat 1-ekranda («eMaktab kabi sayt»), keyin «sayt».

---

### 3. Ekranlar

#### KIRISH

**1 · Hook** — fikr-so'rovi, ovoz berish (hamma javob to'g'ri)
- Lead (kichik yozuv): «Deylik, eMaktab kabi saytni noldan qurdingiz. Birinchi versiyasida ota-ona farzandining bugungi bahosini ko'radi.»
- Sarlavha: «Yig'ilishda saytni ko'rsatib: "Baholar bazadan chiqadi" dedingiz. Ota-ona so'radi: "Bu nima degani?" Unga nima yetishmadi?»
- Variantlar: «Sayt kim uchun va nega kerakligini aytgan gap» · «Bosilganda natija chiqqan bitta tugma» · «"Baza" o'rniga ota-onaga tanish so'z»
- Javob (ovozdan keyin, hamma tanlovga bir xil): «Uchalasi ham to'g'ri — ota-onaga uchalasi ham yetishmadi. Ekran faqat nima borligini ko'rsatadi. Qolganini siz aytasiz — bugun shuni o'rganamiz.»

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Tanlagan g'oyangizni kod bilmaydigan odamga besh gapda ayta olasiz. Keyin birinchi bo'lagingizni uch kadrda ko'rsatasiz: har kadrda bitta gap, o'rtasida bitta bosish.»
- Vizual: besh gap-qatori yozilib chiqadi → uch kadr (ilgari · mana, ishlaydi · endi) → tinglovchi kursisi 🙂. Zanjir chapdan o'ngga.

#### 1-BLOK · GAP

**3 · Tushunish chizig'i** — so'zma-so'z sahna
- Sarlavha: «Ota-onaga saytni tushuntiryapsiz. Qaysi so'zda u sizni tushunmay qoladi?»
- Gap so'zma-so'z chiqadi: «Baholar bazada saqlanadi, API orqali sahifaga keladi.» Chiziq (yorlig'i: «Ota-ona qanchalik tushunyapti») tanish so'zda ko'tariladi, «bazada» va «API» da tushadi. Mentor: «Chiziq tushgan so'zlarni bosing.»
- Tanish so'z bosilsa: «Bu so'zni ota-ona biladi — chiziq bu yerda ko'tarilgan.»
- Xulosa: «Faqat kod yozadiganlar tushunadigan bunday so'z **kasbiy so'z** deyiladi. Uni tanish so'z bilan almashtirasiz — ma'nosi qoladi. Ota-onaga shunday deysiz: "Baholar maktab jurnaliga yoziladi va telefonda ko'rinadi."»

**4 · TEST-1** (ball)
- Lead: «Ota-ona bitta narsani bilmoqchi: farzandining bugungi bahosi.» Cue: «Qaysi gapdan boshlasangiz, u oxirigacha tinglaydi?»
- ✓ Endi farzandingizning bahosini telefonda ko'rasiz · Saytning birinchi bo'lagi qurildi, uch sharti bajarildi · Baholar bazada turadi, sahifa ularni ekranga chiqaradi · Bu saytni bir hafta davomida o'zim qurib chiqdim
- Reveal: «To'g'ri — birinchi gapda ota-ona bilmoqchi bo'lgan narsa turibdi. Sayt qanday qurilgani — keyin.» · Xato-izohlar: (2) «Bu gap sayt qanday qurilgani haqida. Ota-ona esa bahoni bilmoqchi.» · (3) «"Baza" — kasbiy so'z. Ota-ona aynan shu yerda tushunmay qoladi.» · (4) «Bu gap siz haqingizda. Mehnatingizni oxirida aytsangiz ham bo'ladi.»

**5 · Sayt ichida nima bo'ladi — o'xshatish** — juftlash
- Sarlavha: «Sayt ichida nima bo'lishini ota-onaga nimaga o'xshatib tushuntirasiz?»
- Saytning uch qismi: Ko'rinadigan qism · Saytning ishlashi · Ma'lumot saqlanadigan joy. O'xshatishlar: qog'oz kundalikning sahifasi · sinf rahbari jurnaldan bahoni topib, kundalikka yozishi · maktab jurnali. Chalg'ituvchilar: «server» · «ma'lumotlar bazasi» — ular qo'yilsa: «Bu o'xshatish emas, yana bitta kasbiy so'z.»
- O'xshatish noto'g'ri qismga qo'yilsa: «Bu qism nima ish qiladi? Hayotda shu ishni kim yoki nima qiladi?»
- To'g'ri juftlangach to'liq gap chiqadi: «Ko'rinadigan qism — qog'oz kundalikning sahifasiga o'xshaydi.» · «Saytning ishlashi — sinf rahbari jurnaldan bahoni topib, kundalikka yozishiga o'xshaydi.» · «Ma'lumot saqlanadigan joy — maktab jurnaliga o'xshaydi.»
- Xulosa: «Yaxshi o'xshatish tinglovchining o'z hayotidan olinadi. Ota-ona qog'oz kundalikni ham, sinf rahbarini ham biladi.»

**6 · Keys: Airbnb** — bashorat + 3 slayd (bank-faktlari)
- Sarlavha: «Airbnb o'z ishini qanday tushuntirgan?»
- Bashorat: «Airbnb — odam boshqa birovning uyida ijaraga turadigan sayt. U o'z ishini birinchi marta o'ntacha oddiy varaq bilan tushuntirgan. Sizningcha, tushuntirish nimadan boshlangan?» — Uni kim qurganidan · Odamlar qiynalgan muammodan · Sayt qanday qurilganidan (javob 2-slaydda ochiladi)
- Slaydlar:
 1. «O'sha varaqlar hozir ham internetda ochiq turibdi. Ularda Airbnb o'z ishini besh qadamda aytib bergan.»
 2. «Besh qadam shunday: odamlar qiynalgan muammo, yechim, yechimni qancha odam kutayotgani, mahsulot va jamoa.»
 3. «Shu beshtada "sayt qanday qurilgani" degan qadam yo'q. Tartib odamlarning muammosidan boshlanadi va jamoa bilan tugaydi.»
- Ko'prik: «Bu tartibda avval tinglovchi biladigan qiyinchilik keladi, "biz" esa oxirida. G'oyangizni siz ham shunday tartibda aytasiz.»

**7 · TEST-2** (ball)
- Lead: «Do'stingiz kompyuter klubi uchun sayt qildi va uni Airbnb tartibida tushuntirmoqchi.» Cue: «U qaysi gapdan boshlashi kerak?»
- ✓ Kechqurun klubdan bo'sh joy topish qiyin · Shahrimizda minglab o'smir klubga boradi · Saytda bo'sh kompyuterlar ro'yxati ko'rinadi · Saytni ikki do'st bir oy ichida qurdi
- Reveal: «To'g'ri — Airbnb tartibi odamlar qiynalgan muammodan boshlanadi. Qolganlari keyingi qadamlarda.» · Xato-izohlar: (2) «Bu — yechimni qancha odam kutayotgani, uchinchi qadam. Undan oldin muammo va yechim aytiladi.» · (3) «Bu — yechim. U muammodan keyin keladi.» · (4) «Kim qurgani — jamoa haqida, bu oxirgi qadam.»

#### 2-BLOK · KO'RSATUV

**8 · Ekran va gap** — to'rt gap, hukm
- Sarlavha: «To'rt gapdan qaysi ikkitasi ekranga hech narsa qo'shmaydi?»
- Sinfdoshingiz shu saytni yig'ilishda ko'rsatib, to'rt gap aytdi. Har gap yonida o'sha paytdagi ekran turibdi. O'quvchi har gapga hukm beradi: **Qo'shadi** · **Takrorlaydi**.
 1. Ekran: bosh sahifa, tepada «Baholar» tugmasi. Gap: «Mana bu yerda "Baholar" tugmasi bor.» → Takrorlaydi
 2. Ekran: o'sha sahifa. Gap: «Ota-ona ishdan kelib, farzandi bugun nima olganini bilmoqchi.» → Qo'shadi
 3. Ekran: baholar ro'yxati. Gap: «Ro'yxatda beshta baho bor.» → Takrorlaydi
 4. Ekran: o'sha ro'yxat. Gap: «Bitta bosish — va bugungi baho shu yerda, kundalikni kutish shart emas.» → Qo'shadi
- Xulosa: «Ekran nima borligini o'zi ko'rsatadi. Gap nima uchunligini aytadi: kim uchun, qaysi qiyinchilikdan qutqaradi. Ekranda ko'rinib turgan narsani takrorlagan gap tinglovchiga yangi hech narsa bermaydi.»

**9 · TEST-3** (ball)
- Lead: «Sinfdoshingiz futbol maydoni saytini ko'rsatyapti. Ekranda bo'sh vaqtlar jadvali turibdi.» Cue: «Qaysi gap ko'rsatuvga hech narsa qo'shmaydi?»
- ✓ Jadvalda maydonning bo'sh vaqtlari ko'rsatilgan · Ilgari bolalar maydonga borib, uni band holda topardi · Bu yerda bola do'stlari bilan qachon o'ynashini tanlaydi · Bitta bosish — va vaqt siz uchun band bo'ladi
- Reveal: «To'g'ri — jadval ekranda o'zi turibdi, gap uni qayta aytdi.» · Xato-izohlar: (2) «Bu gap ilgarigi qiyinchilikni aytadi — ekranda u ko'rinmaydi.» · (3) «Bu gap kim uchun va nima uchunligini aytadi — jadval buni aytmaydi.» · (4) «Bu gap bosishni va uning natijasini aytadi — ekranda u hali yo'q.»

**10 · Uch kadr** — tartiblash + bosiladigan joy tanlash
- Sarlavha: «Ko'rsatuv nechta kadrdan bo'ladi va o'rtasida nima bosiladi?»
- Uch kadr aralash turadi, o'quvchi tartiblaydi: **Ilgari** — «Ota-ona bahoni bilish uchun kundalik uyga kelishini kutardi» (ekran: qog'oz kundalik) · **Mana, ishlaydi** — bitta bosish (ekran: sayt) · **Endi** — «Endi ota-ona bugungi bahoni ishdan qaytayotib telefonda ko'radi» (ekran: baho chiqqan sahifa).
- O'rta kadrda o'quvchi **bosiladigan joyni tanlaydi** — sahifada uch joy: «Sayt logotipi» · «Farzand ismi» · «Sozlamalar tugmasi». Bosilgach natija ko'rinadi: logotip → bosh sahifa qaytdi: «Sahifa o'zgarmadi — ota-ona yangi hech narsa bilmadi.» · ism → bugungi baho chiqdi: «Bugungi baho chiqdi — ota-ona bilmoqchi bo'lgan narsa shu.» · sozlamalar → sozlamalar ro'yxati: «Sozlamalar ochildi. Ota-ona esa bahoni bilmoqchi edi.» To'g'ri joy bosilgach o'rta kadr gapi chiqadi: «Farzandining ismini bosadi — bugungi baho shu zahoti chiqadi.»
- Xulosa: «Ko'rsatuv uch kadrdan iborat: ilgari, mana ishlaydi, endi. O'rta kadrda bitta bosish bor va natijasi shu zahoti ko'rinadi.»

**11 · TEST-4** (ball)
- Lead: «Sinf sardori uchun qurilgan saytni ko'rsatyapsiz: u kim pul berganini belgilaydi.» Cue: «O'rta kadrda bosiladigan joy qanday tanlanadi?»
- ✓ Ish chindan bajariladigan joy tanlanadi · Sahifada birinchi ko'ringan joy tanlanadi · Eng chiroyli chiqqan sahifa tanlanadi · Qurish ko'p vaqt olgan joy tanlanadi
- Reveal: «To'g'ri — "Berdi" katagini bossangiz, ism yashil bo'ladi: ish bajarildi, natija ko'rindi.» · Xato-izohlar: (2) «Birinchi ko'ringan joy ko'pincha logotip yoki sarlavha — u hech narsa qilmaydi.» · (3) «Chiroyli sahifa — bu ko'rinish. Ko'rsatuvda ish bajarilishi kerak.» · (4) «Qancha mehnat ketgani tinglovchiga ko'rinmaydi. Unga natija ko'rinsin.»

#### O'Z G'OYANGIZ

**12 · Besh gap** — ustaxona
- Sarlavha: «G'oyangizni kod bilmaydigan odamga besh gapda ayta olasizmi?»
- Oldingi darslardagi kartangiz (kim · qachon + nimasi og'ir · sayt nima qiladi · odam nimaga erishadi) va birinchi bo'lagingiz yonda ochiq turadi. **Karta bo'lmasa** (boshqa kompyuter): 1-darsning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim, 5 qatorli jadval) tanlov bo'lib chiqadi; tanlangan g'oyaning birinchi bo'lagi va bitta sharti jadvalning qo'shimcha ikki ustunidan tushadi (1-dars senariysi 14-ekran ostida).
- 6 maydon, yorliqlar savol shaklida, tartib — Airbnb tartibi (odam va uning qiyinchiligi birinchi, so'rov oxirida): «Sayt kimga yordam beradi?» · «Hozirgacha ular nimada qiynalardi?» · «Birinchi versiyada sayt nima qiladi?» (birinchi bo'lak) · «Endi ular nimaga erishadi?» · «Saytning ishlashini tinglovchiga tanish nimaga o'xshatasiz?» · «Tinglovchidan keyin nima qilishini so'raysiz?» (bitta aniq so'rov). Birinchi to'rt maydon kartadan va birinchi bo'lakdan namuna oladi, o'quvchi o'zi yozadi. Birinchi ikki maydon bitta gapga yig'iladi — 6 maydon, 5 gap.
- Maydon-namunalari: «hovlida futbol o'ynaydigan o'smirlar» · «maydonga borib, uni band holda topardi» · «maydonning bo'sh vaqtini ko'rsatadi va band qilib beradi» · «do'stlari bilan kutmasdan o'ynaydi» · «kinoteatrda joy tanlash» · «bir hafta sinab ko'rib, fikringizni ayting».
- Yig'iladigan besh gap: «{Kim} hozirgacha {qiyinchilik}. Birinchi versiyada sayt {nima qiladi}. Endi {natija}. Saytning ishlashi {o'xshatish}ga o'xshaydi. Sizdan bitta iltimos — {so'rov}.» Namuna bilan: «Hovlida futbol o'ynaydigan o'smirlar hozirgacha maydonga borib, uni band holda topardi. Birinchi versiyada sayt maydonning bo'sh vaqtini ko'rsatadi va band qilib beradi. Endi ular do'stlari bilan kutmasdan o'ynaydi. Saytning ishlashi kinoteatrda joy tanlashga o'xshaydi. Sizdan bitta iltimos — bir hafta sinab ko'rib, fikringizni ayting.»
- Jonli tekshiruv: kasbiy so'z (baza · API · server · kod · JSON · deploy) yozilsa qizil chiziq va «Bu kasbiy so'z. Uni tanish so'z bilan ayting.» O'xshatish maydonida kasbiy so'z — «Bu o'xshatish emas, yana bitta kasbiy so'z.»
- Saqlanadi: «✓ Besh gap tayyor».

**13 · Uch kadr** — ustaxona
- Sarlavha: «Birinchi bo'lagingizni uch kadrda ko'rsata olasizmi?»
- Uch kadr, har birida bitta gap: **Ilgari** — 12-ekrandagi birinchi gap («… hozirgacha …») namuna bo'lib turadi · **Mana, ishlaydi** — gap + ikki maydon: «Nima bosiladi?» · «Nima chiqadi?» (oldingi darsdagi birinchi shartingiz «Foydalanuvchi nima qiladi? · Shundan keyin nima bo'ladi?» yonda turadi — o'sha juftlik shu kadrga tushadi) · **Endi** — 12-ekrandagi uchinchi gap («Endi …») namuna.
- Namuna (futbol): «Ilgari bolalar maydonga borib, uni band holda topardi» · «Bo'sh vaqtni bosaman — maydon shu zahoti band bo'ladi»: «Bo'sh vaqt» → «"Band qilindi" yozuvi» · «Endi bola vaqtini uydan chiqmay band qiladi».
- Tekshiruvlar: «Nima chiqadi?» bo'sh → «Natija ko'rinmasa, tinglovchi ish bajarilganini bilmaydi.»; gapda ekranni takrorlashi mumkin bo'lgan so'z bo'lsa («bu yerda», «ko'rinib turibdi», «tugmasi bor») — sariq ogohlantirish, saqlashni to'xtatmaydi: «Bu gap ekranni takrorlamayaptimi? Ekran ko'rsatmaydigan narsani ayting: kim uchun, nima uchun.»
- Saqlanadi: «✓ Uch kadr tayyor».

**14 · Tinglovchi kursisi** — 3 tayyor ko'rsatuvga hukm (ballsiz)
- Sarlavha: «Endi siz tinglovchisiz. Uch ko'rsatuvga qanday baho berasiz?»
- Uch tayyor ko'rsatuv (kiyim o'lchami sayti — 1-darsning 4-g'oyasi), har biri uch kadr (o'rtasida: bo'y va vazn yozilib, «O'lchamni ko'rish» bosiladi):
 - A: «Ma'lumot bazadan API orqali keladi» → bosish → «O'lcham JSON'da qaytadi» — kasbiy so'z
 - B: «Bu yerda bo'y va vazn maydoni bor» → bosish → «Mana, jadval ko'rinib turibdi» — ekranni takrorlaydi
 - C: «Posilka ochilganda kiyim to'g'ri kelmasdi» → bosish, o'lcham chiqdi → «Endi birinchi buyurtmadayoq mos kiyim keladi» — hammasi joyida
- O'quvchi har ko'rsatuvga bitta sabab qo'yadi (uch sabab, har biri aynan bitta ko'rsatuvga): «Kasbiy so'z bor» · «Gap ekranni takrorlaydi» · «Hammasi joyida».
- Sabab noto'g'ri qo'yilsa: «Gaplarni yana o'qing: ota-ona qaysi so'zda to'xtab qoladi, qaysi gap ekranda bor narsani aytadi?»
- Xulosa: «Tinglovchi o'rnida o'tirsangiz, boshqaning xatosi darrov ko'rinadi. Endi shu ko'z bilan o'z uch kadringizga qarang — kerak bo'lsa tuzating.»

#### AI BILAN

**15 · AI — ota-ona rolida**
- Sarlavha: «Besh gapingizda qaysi so'z tushunarsiz qoldi?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI ota-ona o'rnida tinglaydi va qaysi so'zni tushunmaganini aytadi. Nimani almashtirishni o'zingiz hal qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
 > «Siz kod umuman bilmaydigan ota-onasiz, farzandingiz maktabda o'qiydi. Men sizga loyihamni tushuntiryapman: "{besh gap}". Keyin ko'rsatyapman: 1) {1-kadr gapi} 2) {2-kadr gapi} 3) {3-kadr gapi}. Uch savolga javob bering: qaysi so'zlarni tushunmadingiz? Qaysi kadr gapi faqat ekranda ko'rinadigan narsani aytadi? Menga qaysi bitta savolni berasiz? Qayta yozmang, faqat shu uch javobni bering.»
- «Nusxalash» → gemini.google.com → o'quvchi tushunilmagan so'zni o'zi almashtiradi, takror kadr gapini o'zi qayta yozadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda ikki narsa chiqadi: (1) besh gap va uch kadr gapida kasbiy so'zlar ro'yxati bo'yicha topilgan so'zlar belgilanadi (baza · server · API · kod · JSON · deploy); (2) 3 tayyor «ota-ona savoli» — «Buni telefonimda qanday ochaman?» · «Bu pullikmi?» · «Farzandim buni o'zi ishlata oladimi?» — o'quvchi bittasini tanlab, javobini besh gapiga qo'shadi. Takror kadrni sherik 16-ekranda tekshiradi. Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi.
- Qoida ekranda: «AI faqat qaysi so'z tushunarsiz va qaysi kadr takror ekanini aytadi, qayta yozmaydi. Nimani almashtirishni siz hal qilasiz.»

#### YAKUN

**16 · Juftlik** — ballsiz
- Sarlavha: «Sherigingiz uch kadringizni tushunadimi?»
- Yo'riq: «Yozganingizga qaramay, besh gapingizni ayting. Keyin uch kadrni ko'rsatib, har kadrda o'z gapingizni ayting. Sherigingiz ota-ona o'rnida tinglaydi va belgilaydi: 🙂 Tushundim · 😐 Qisman · 😕 Tushunmadim. Tushunmagan so'zini yoki takror kadrni aytadi. Keyin almashasiz.»
- Yozish: «Sherigingiz nimani aytdi va nimani o'zgartirasiz — bir qatorda yozing.»

**17 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**18 · Flashcard** (5 ta — hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Kasbiy so'zni nima qilasiz? | Tanish so'z bilan almashtirasiz — ma'nosi qoladi |
| Tushuntirish qaysi gapdan boshlanadi? | Tinglovchi bilmoqchi bo'lgan narsadan |
| Yaxshi o'xshatish qayerdan olinadi? | Tinglovchining o'z hayotidan |
| Ekran nimani ko'rsatadi, gap nimani aytadi? | Ekran nima borligini ko'rsatadi, gap nima uchunligini aytadi |
| Ko'rsatuv qaysi uch kadrdan iborat? | Ilgari · mana, ishlaydi · endi — o'rtasida bitta bosish |

**19 · Arena + yakun**
- Arena: 12 savol (3/3/3/3): kasbiy so'z va birinchi gap · o'xshatish va Airbnb tartibi · ekran va gap · uch kadr va bosiladigan joy. Ekran savollari va flashcard javoblarining nusxasi emas — boshqa vaziyatda (maktab kutubxonasi sayti · oshxona buyurtma ilovasi · sport to'garagi jadvali).
- Yakun — 4 qator:
 - Kasbiy so'zni tanish so'z bilan almashtirasiz.
 - Birinchi gap tinglovchi bilmoqchi bo'lgan narsa haqida bo'ladi.
 - Ekran nima borligini ko'rsatadi, gap nima uchunligini aytadi.
 - Ko'rsatuv uch kadrdan iborat: ilgari, mana ishlaydi, endi — o'rtasida bitta bosish.
- Mentor og'zaki: «Backend modulida texnik qarorlaringizni ham odamga foydasi bilan tushuntirasiz — shu besh gap va uch kadr bilan.»

---

### 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 4 · 7 · 9 · 11 — har biri o'z blokidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Word Catcher!** (3) — «Ota-ona tushunmay qolgan so'zlarni topdingiz» · **Plain Words!** (12) — «Besh gapni kasbiy so'zsiz yozdingiz» · **Show Time!** (13) — «Birinchi bo'lagingiz uchun uch kadr yozdingiz» · **Listener's Seat!** (14) — «Uch ko'rsatuvga tinglovchi ko'zi bilan baho berdingiz» |

### 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| 1-blok · Gap | 3–7 | 22 |
| 2-blok · Ko'rsatuv | 8–11 | 16 |
| O'z g'oyasi | 12–14 | 22 |
| AI + juftlik | 15–16 | 10 |
| Yakun | 17–19 | 8 |
| Bufer | | 7 |

Vaqt yetmasa, birinchi qisqaradigan joy — 14-ekran (tinglovchi kursisi): ekran butunlay tushiriladi, mentor C ko'rsatuvni og'zaki aytib, sinfdan «nimasi joyida?» deb so'raydi. Ikki ko'rsatuv bilan uch sabab-varianti ishlamaydi — shuning uchun qisman qisqartirilmaydi.

---

# 4-O'TISH · NestJS (3 dars)

## 4-o'tish · 1-dars — «Kim uchun va qanday muammo?» (Uzum · Uzum keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B4-KimUchunQandayMuammo.md` · **Bu dars 3-o'tish 1-darsi bilan aynan bir xil** — to'liq matni yuqorida.

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | Node-Express'ga va NestJS'ga qo'shiladigan o'quvchi (3 darsning 1-si). Bu o'quvchi texnikada kuchli, lekin PM ko'rmagan |
| Mavzular (5) | Auditoriya + Struktura (bitta blok) · Muammoni qanday izlash · Muammo → yechim · Jobs-to-be-Done |
| Maqsad | O'quvchi o'zi tanlagan g'oyaga **to'rt savolli karta** yozadi: sayt kim uchun · odam qanday muammoga duch keladi (qachon · nimasi og'ir) · sayt nima qiladi · odam oxirida nimaga erishadi |
| Misol-ip | **Uzum Market** — boshidan oxirigacha: kim kiradi va birinchi nimaga qaraydi → Uzum bo'lmaganda xarid qanday edi → ilovadagi to'rt narsa qaysi muammoga javob → odam telefonning o'zini emas, «do'konga bormay, ertaga qo'lida bo'lishini» oladi |
| Keys | K1 Uzum — ip bilan bitta olam; keys **bir marta** hikoya bo'lib kiradi (6-ekran), faqat bank-faktlari |
| O'z ishi | O'z g'oyasi kartasi — 4 savol (muammo savolida ikki yozuv joyi: qachon · nimasi og'ir). Keyingi ikki darsga o'tadi |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

**Eng og'ir bridge dars.** Besh mavzu 4 blokka yig'ildi; har blok — bitta g'oya, bitta harakat, bitta test. Chuqurlik emas, tasavvur darajasi.


**Ekranlar (to'liq matni — 3-o'tish 1-darsi):**

1. Hook
2. Maqsad
3. Ikki vaziyat, bitta ilova
4. TEST-1
5. Muammoning to'rt belgisi
6. Keys: Uzum
7. TEST-2
8. Aniq gap yig'ing
9. Har narsa — bitta javob
10. TEST-3
11. Telefon emas — natija
12. TEST-4
13. Juftini toping
14. To'rt savolli karta
15. Sherik-tekshiruv
16. AI — foydalanuvchi rolida
17. Juftlik
18. Podium
19. Flashcard
20. Arena + yakun

---

## 4-o'tish · 2-dars — «Nima quramiz va qachon tayyor?» (taksi · Instagram keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B5-NimaQuramiz.md` · **Bu dars 3-o'tish 2-darsi bilan aynan bir xil** — to'liq matni yuqorida.

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | Node.js (Express) va NestJS darslariga o'tadigan o'quvchi (3 darsning 2-si, «Kim uchun va qanday muammo?» dan keyin) |
| Mavzular (4) | User Story · Dekompozitsiya · Prioritet · Acceptance Criteria |
| Maqsad | O'quvchi o'z g'oyasiga **bitta foydalanuvchi hikoyasi** yozadi, g'oyani alohida bo'laklarga ajratadi, qaysi bo'lakni avval qurishni **odamlar ehtiyoji va taxminiy vaqtga** qarab tanlaydi va tanlangan bo'lakka **3 ta tekshiriladigan shart** yozadi |
| Misol-ip | **O'zimizning taksi ilovamiz** — «taksi chaqirish xizmatini o'zimiz noldan qursak». Yandex Go faqat taqqoslash namunasi (5-ekranda bir marta): qurilayotgan ilova — bizniki, uning bo'laklari, sonlari va xatolari ham bizniki |
| Keys | K3 Instagram — «Burbn'dan uchta narsa qoldi». Matn 2-o'tish 3-darsida foydalanuvchi tasdiqlagan ko'rinishda (sana va 25 000 raqami ekranda aytilmaydi) |
| O'z ishi | Oldingi darsdagi karta ochiladi → 1 hikoya → 4 bo'lak → birinchi bo'lak + sabab → 3 shart. Keyingi darsga o'tadi |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |


**Ekranlar (to'liq matni — 3-o'tish 2-darsi):**

1. Hook
2. Maqsad
3. Uch qism
4. TEST-1
5. Bo'laklaymiz
6. Keys: Instagram
7. TEST-2
8. Ikki savol, to'rt katak
9. TEST-3
10. «Ishlaydi» yoki «tayyor»?
11. TEST-4
12. Besh qadam tartibi
13. Hikoyangiz
14. Bo'laklar va birinchisi
15. Uch shart
16. AI — sinovchi rolida
17. Juftlik
18. Podium
19. Flashcard
20. Arena + yakun

---

## 4-o'tish · 3-dars — «Ma'lumot, ishonch va "Qanday ishlaydi?"» (YouTube kabi ilovani biz qursak · Netflix keysi)

> Senariy-fayl: `pm-senariylar/BRIDGE-B7-MalumotIshonch.md`

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | NestJS darslariga o'tadigan o'quvchi (3 darsning 3-si, oxirgisi; «Kim uchun, qanday muammo» va «Nima quramiz» dan keyin) |
| Mavzular (4) | Ma'lumot (maydon → bo'lim) · Ochiq va yopiq ma'lumot (zarar mezoni) · Sxema (ilova faqat yozilganini biladi) · Uch qavat, texnik so'zsiz |
| Maqsad | O'quvchi o'z g'oyasi uchun **3 maydon** tanlaydi (har biriga bo'lim), har maydonni **ochiq yoki yopiq** deb belgilaydi (sababi bilan) va birinchi bo'lagida tugma bosilganda ilova ichida nima bo'lishini **uch qavat gapida**, kasbiy so'zsiz aytadi |
| Misol-ip | **YouTube kabi ilovani biz qursak** (ochiq faraz). YouTube bir marta (3-ekran) real namuna sifatida nomlanadi — faqat ko'rinadigan narsalari: video nomi · kanal · ko'rishlar soni · yuklangan sana · «Tarix» bo'limi · layk · izoh. Qolgan hamma qaror (maydonlar, bo'limlar, ochiq/yopiq, e'lon gaplari, layk yo'li) — **bizning ilovamizda** |
| Keys | K6 Netflix — faqat bank-faktlari: har kimning bosh sahifasi o'ziniki — tavsiyalar ko'rish tarixidan yig'iladi · ko'rishlarning taxminan 80 foizi tavsiyadan keladi, qidiruvdan emas (Netflix ochiq bayonoti, 2016) |
| O'z ishi | Oldingi darslardagi karta va birinchi bo'lak + 3 shart ochiladi → 3 maydon + bo'lim → ochiq/yopiq + sabab → uch qavat gapi. Kartasiz o'quvchiga 1-darsning 4 tayyor g'oyasi tanlov bo'lib chiqadi |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

### 2. Darsning to'rt asosiy fikri

1. **Ilova har safar yozib qo'yadigan bitta narsa — maydon.** Bu darsda maydonni u ochadigan bo'limga qarab tanlaymiz: bo'lim topilmasa, hozircha yozib qo'ymaymiz. Ertangi ekran bugun yozilgan ma'lumotdan foydalanib tuziladi.
2. **Ma'lumotni zarar yopadi, turi emas.** Begona ko'rsa egasiga zarar yetadigan maydon yopiladi. Qaysi ma'lumot ochiq qolishini ham tanlaymiz — ochiq qolish ham qaror.
3. **Ilova odamga ko'rsatadigan ma'lumot qayerdadir yozilgan bo'lishi kerak.** Bizning ilovamizda u sxemadagi maydonda turadi: e'londa aytilgan har ma'lumot ortida kerakli maydon bor; hech qaysi gapga kerak bo'lmagan maydon sxemaga kirmaydi.
4. **Ilova uch qavat:** sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi. Layk kabi yozib qo'yiladigan bosish uchalasidan o'tadi. Kod bilmaydigan odamga qavatning nomi emas, ishi tanish so'z bilan aytiladi.

Ip-zanjir: **nimani yozib qo'yamiz → kimga ko'rsatamiz → gap ortida maydon → bosish uch qavatdan o'tadi → o'z g'oyamizga xuddi shunday.**

> **YouTube halolligi:** ilova bir marta (3-ekran) real namuna sifatida nomlanadi — unda **ko'rinib turgan** narsalar: video nomi · kanal nomi · ko'rishlar soni · yuklangan sana · ko'rilgan videolar «Tarix» bo'limida · layk · izohlar (qurishda ilovaning hozirgi ko'rinishi bilan tekshiriladi). Qolgan hamma narsa — «biz qurayotgan ilova» haqida: 3-ekrandagi maydonlar va ularning bo'limlari («Kecha ko'rganlaringiz», «Davom ettiring», Wi-Fi va kontaktlardan bo'lim chiqmasligi), 6-ekrandagi profil maydonlari va ularning ochiq/yopiqligi, 8-ekrandagi e'lon gaplari va maydonlar ro'yxati, 10-ekrandagi layk yo'li — **bizning ilovamizda**, YouTube'da emas. Ekranda shu farq ochiq yoziladi: 3-ekranda «Ilovamiz nimani yozib qo'yishini esa biz hal qilamiz», 6-ekranda «bizning ilovamizdagi sahifangiz», 8-ekranda «ilovamizning e'loni». YouTube'ning tarixi, raqamlari, ichki qarorlari aytilmaydi.

---

### 3. Ekranlar

#### KIRISH

**1 · Hook** — fikr-so'rovi, ovoz berish (ikkala javob to'g'ri)
- Sarlavha: «Kechqurun video ko'rdingiz. Ertalab ilova buni eslasinmi?»
- Variantlar: «Ha — qayerda to'xtaganimni ko'rsatsin» · «Yo'q — men haqimda hech narsa saqlamasin»
- Javob (ovozdan keyin, ikkalasiga bir xil): «Ikkala javob ham bo'lishi mumkin — ikkalasi ham qaror. Ilova eslashi uchun nimanidir yozib qo'yishi kerak. Yozmasa, ertalab u hech narsani bilmaydi. Nimani yozib qo'yishni ilovani quradigan odam hal qiladi — bugun shu odam sizsiz.»

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Tanlagan g'oyangiz uchun ilova nimani yozib qo'yishini tanlaysiz. Qaysi ma'lumot hammaga ochiq, qaysi biri yopiq bo'lishini hal qilasiz. Oxirida tugma bosilganda ilova ichida nima bo'lishini kod bilmaydigan odamga uch gapda aytasiz.»
- Vizual: uchta karta → har birida 🔓/🔒 belgisi → bitta bosish uch bosqichdan strelka bilan o'tadi. Zanjir chapdan o'ngga. Vizualda «maydon», «sxema», «qavat» so'zlari yozilmaydi — ular keyingi ekranlarda tug'iladi.

#### 1-BLOK · NIMANI YOZIB QO'YAMIZ

**3 · Xotira tugmalari** — bosib ochish
- Sarlavha: «YouTube kabi ilova qursak, video ko'rilganda nimani yozib qo'yamiz?»
- Ekranda ochiq: «YouTube'da video nomi, kanal, ko'rishlar soni va sana ko'rinadi. Ko'rganlaringiz "Tarix"da turadi. Ilovamiz nimani yozib qo'yishini esa biz hal qilamiz.»
- 5 tugma, har biri bosilganda «ertangi ekran»da qaysi bo'lim ochilishi ko'rinadi: «Qaysi video ko'rildi» → «Tarix» bo'limi · «Qachon ko'rildi» → «Kecha ko'rganlaringiz» bo'limi · «Qaysi daqiqada to'xtatildi» → «Davom ettiring» bo'limi · «Qaysi Wi-Fi orqali ko'rildi» → «Bizning ilovamizda bundan bo'lim ochilmaydi» · «Telefondagi kontaktlar» → «Bizning ilovamizda kontaktlardan foydalanadigan bo'lim yo'q».
- Xulosa: «Ilova har safar video ko'rganingizda yozib qo'yadigan bitta narsa **maydon** deyiladi. Bu darsda maydonni u ochadigan bo'limga qarab tanlaymiz: bo'lim topilmasa, uni hozircha yozib qo'ymaymiz.»

**4 · Keys: Netflix** — bashorat + 3 slayd (bank-faktlari)
- Sarlavha: «Netflix bosh sahifasi nimadan yig'iladi?»
- Bashorat: «Netflix'da odamlar film va seriallarni ikki yo'l bilan topadi: qidiruvdan yoki tavsiyadan. Ko'rishlarning qanchasi tavsiyadan keladi?» 20 % · 50 % · 80 %
- Slaydlar:
 1. «Netflix'da har kimning bosh sahifasi o'ziniki. Undagi tavsiyalar odamning ko'rish tarixidan yig'iladi.»
 2. «Netflix 2016-yilda ochiq aytgan: ko'rishlarning taxminan 80 foizi tavsiyadan keladi, qidiruvdan emas.»
 3. «Ya'ni har beshta ko'rishdan taxminan to'rttasi qidiruvdan emas, tavsiyadan keladi.»
- Ko'prik: «Ilova nimani yozib qo'ysa, ertangi bosh sahifani tuzishda shu ma'lumotdan foydalanadi. Shuning uchun nimani yozib qo'yish — ilovani quradigan jamoaning muhim qarori.»

**5 · TEST-1** (ball)
- Lead: «Jamoa ilovamizga to'rtta yangi maydon taklif qildi.» Cue: «Bizning ilovamizda qaysi birini yozib qo'yishga arziydi?»
- ✓ Qaysi videoga layk bosildi · Qaysi telefon modelidan kirildi · Batareyada necha foiz qolgan edi · Telefonda bo'sh joy qancha edi
- Reveal: «To'g'ri — bu maydondan "Yoqtirganlaringiz" bo'limi ochiladi.» · Xato-izohlar: (2) «Bizning ilovamizda telefon modelidan ochiladigan bo'lim yo'q. Bo'lim topilmasa — hozircha yozib qo'ymaymiz.» · (3) «Batareya foizidan bizning ilovamizda qaysi bo'lim ochiladi? Bo'lim topilmasa — hozircha yozib qo'ymaymiz.» · (4) «Telefondagi bo'sh joydan bizning ilovamizda qaysi bo'lim ochiladi? Bo'lim topilmasa — hozircha yozib qo'ymaymiz.»

#### 2-BLOK · KIMGA KO'RINADI

**6 · Sahifangizni kim ko'radi** — joylashtirish
- Sarlavha: «Bizning ilovamizdagi sahifangizni begona odam ochsa, qaysi maydonlarni ko'rishi mumkin?»
- Yo'riq: «Bu darsda ikki holat bilan ishlaymiz. Har maydonni ikki tomondan biriga qo'ying.» Tomonlar: **Hammaga ochiq** · **Faqat egasiga**. Sahifadagi 6 maydon: Kanal nomi · Kanalga joylagan videolaringiz · Qaysi videolarga layk bosgansiz · Qaysi videolarni ko'rgansiz · Telefon raqamingiz · Parolingiz.
- Tekshiruv: Kanal nomi → ochiq («Kanalingizni odamlar topishi kerak.») · Kanalga joylagan videolaringiz → ochiq («Bu videolarni odamlar ko'rishi uchun kanalingizga joylagansiz.») · Qaysi videolarni ko'rgansiz → yopiq («Begona siz nimalarni ko'rganingizni bilib oladi.») · Telefon raqamingiz → yopiq («Raqamingizni bilgan begona sizga qo'ng'iroq qilib, bezovta qila oladi.») · Parolingiz → yopiq («Parolni bilgan begona sahifangizga kirib oladi.») · Qaysi videolarga layk bosgansiz → ikkala tomon ham qabul: «Bu maydon ikkala tomonda ham bo'lishi mumkin — ochiq qolish ham qaror, uni egasi beradi.»
- Xulosa: «Kanal nomi ham, parol ham — oddiy yozuv. Kanal nomi odamlar sizni topishi uchun ochiq, parol esa sahifangizni himoya qilgani uchun yopiq. Demak, yozuvning turiga emas, begona ko'rsa nima bo'lishiga qaraymiz: ma'lumotni zarar yopadi. Bizning kanal ilovamizda hamma maydon yopilsa, odamlar kanalingizni topolmaydi — ochiq qolish ham qaror.»

**7 · TEST-2** (ball)
- Lead: «Ilovamizga yangi maydon qo'shildi: "Oxirgi marta qachon kirgan".» Cue: «Bu maydonni yopish yoki ochiq qoldirishda nimaga qaraymiz?»
- ✓ Begona ko'rsa, egasiga zarar yetadimi · Ilova buni har kuni yangilab turadimi · Bunga boshqa odamlar ko'p qiziqadimi · Unda so'z bormi yoki faqat raqam turadimi
- Reveal: «To'g'ri — mezon bitta: begona buni ko'rsa, egasiga zarar yetadimi. Yetsa — maydon yopiladi, yetmasa — ochiq qolishi mumkin.» · Xato-izohlar: (2) «Qanchalik tez-tez yangilanishi hech narsani hal qilmaydi. Begona buni ko'rsa, nima bo'ladi?» · (3) «Qiziqish kam yoki ko'pligi mezon emas. Begona buni ko'rsa, kimga zarar yetadi?» · (4) «Yozuvning turi hech narsani hal qilmaydi. Begona buni ko'rsa, egasiga nima bo'ladi?»

#### 3-BLOK · GAP ORTIDA MAYDON

**8 · Ilova faqat yozilganini biladi** — konstruktor
- Sarlavha: «E'londagi har va'dani ilova qayerdan biladi?»
- Ekranda: «Bu — ilovamizning e'loni: odamga nima ko'rinishini aytadigan besh gap. Har gapni maydon bilan bog'lang.» O'ngda ilova yozib qo'yadigan maydonlar ro'yxati: Video nomi · Kanal · Ko'rishlar soni.
- Bog'lash: «Video nomini ko'rasiz» → Video nomi ✓ · «Kim yuklaganini ko'rasiz» → Kanal ✓ · «Nechta odam ko'rganini ko'rasiz» → Ko'rishlar soni ✓ · «Video qachon yuklanganini ko'rasiz» → mos maydon yo'q. Shu gap bosilsa: «Bizning ilovamizda sana hech qayerda yozilmagan — ilova uni ko'rsata olmaydi, gap yolg'on chiqadi.» → «Maydon qo'shish» → ro'yxatda «Yuklangan sana» paydo bo'ladi, gap ✓ ga o'tadi. Gap noto'g'ri maydonga ulansa: «Bu maydonda boshqa narsa yozilgan. Sana qaysi maydonda turibdi?»
- Beshinchi gap: «Ilova juda tez ishlaydi» → hech qaysi maydonga ulanmaydi: «"Juda tez" — hozircha umumiy baho: unda nima o'lchanishi aytilmagan. Bu gap odamga hech qanday ma'lumot ko'rsatmaydi, shuning uchun unga maydon tanlamaymiz.»
- Xulosa: «Ilova odamga ko'rsatadigan ma'lumot qayerdadir yozilgan bo'lishi kerak. Bizning ilovamizda e'londagi har ma'lumot ortida kerakli maydon turadi. Ilovaning hamma maydonlari ro'yxati **sxema** deyiladi. Sxema qisqa qoladi: kontaktlar kabi hech qaysi gapga kerak bo'lmagan maydon unga kirmaydi.»

**9 · TEST-3** (ball)
- Lead: «Jamoa ilovamiz e'loniga yangi gap qo'shdi: "Video qaysi tilda ekanini ko'rasiz".» Cue: «Endi sxemaga nima bo'ladi?»
- ✓ Sxemaga yangi "Til" maydoni qo'shiladi · Sxemaga "Yaxshi video" maydoni qo'shiladi · "Ko'rishlar soni" o'rniga "Til" yoziladi · Hech narsa — e'londagi gapning o'zi yetadi
- Reveal: «To'g'ri — bizning sxemamizda til yozilgan maydon yo'q. Ilova tilni ko'rsatishi uchun yangi maydon kerak.» · Xato-izohlar: (2) «"Yaxshi" — baho so'zi, ma'lumot emas. Yangi gap odamga nimani ko'rsatadi?» · (3) «"Ko'rishlar soni" o'chsa, "Nechta odam ko'rganini ko'rasiz" gapi yolg'on chiqadi.» · (4) «Gap — odamga va'da. Ilova tilni qayerdan oladi?»

#### 4-BLOK · QANDAY ISHLAYDI

**10 · Uch qavat** — bosib ochish, layk yo'li
- Sarlavha: «Layk bosdingiz. Ilovaning ichida nima bo'ldi?»
- Ekranda ilovamizning video sahifasi. O'quvchi 👍 bosadi → yo'l uch qadamda ochiladi: ① **Sahifa** — ko'rsatadi (👍 belgisi yonadi) → ② **Server** — tekshiradi (kim bosdi va u shu videoga oldin layk bosmaganmi) → ③ **Baza** — eslab qoladi (ertaga ham turadi). Keyin «Telefonni o'chirish» tugmasi → ilova qayta ochilganda layk joyida: «Layk joyida — baza uni eslab qoldi, ilova shu ma'lumotdan foydalanib uni yana ko'rsatdi.»
- Xulosa: «Siz ko'rgan uch qadam — ilovaning uch qismi. Ularni **qavat** deymiz, binodagi kabi: har qavatning bitta ishi bor. Sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi. Layk kabi yozib qo'yiladigan bosish uchalasidan o'tadi.»

**11 · TEST-4** (ball)
- Lead: «Akkauntingizga kirmasdan layk bosdingiz. Ekranda "Avval kiring" yozuvi chiqdi.» Cue: «Siz kirmaganingizni qaysi qavat aniqladi?»
- ✓ Server — u kim bosganini tekshirdi · Sahifa — u tugmani qulflab qo'ydi · Baza — u laykni o'chirib tashladi · Telefon — u layk bosishni to'xtatdi
- Reveal: «To'g'ri — kim bosganini va bunga ruxsat bormi, server tekshiradi. Sahifa esa uning javobini ko'rsatdi.» · Xato-izohlar: (2) «Sahifa tugmani qulflamadi — siz uni bosdingiz. Bosishdan keyin kim tekshiradi?» · (3) «Baza laykni o'chirmadi — u hali hech narsa yozib qo'ymagan edi. Kim bosishi mumkinligini qaysi qavat tekshiradi?» · (4) «Telefon — qurilma, ilovaning qavati emas. Uch qavatdan qaysi biri tekshiradi?»

**12 · Kasbiy so'zsiz** — so'z almashtirish (ballsiz)
- Sarlavha: «Kod bilmaydigan odamga layk haqida gapiryapsiz. Qaysi so'zda u sizni tushunmay qoladi?»
- Gap so'zma-so'z chiqadi: «Layk bazaga yoziladi, API orqali sahifaga qaytadi.» Chiziq (yorlig'i: «U qanchalik tushunyapti») tanish so'zda ko'tariladi, «bazaga» va «API» da tushadi. Mentor: «Chiziq tushgan so'zlarni bosing.» Bosilgan so'z o'rniga tanish so'z chiqadi: «bazaga yoziladi» → «ilova eslab qoladi» · «API orqali sahifaga qaytadi» → «sahifa uni ilovadan so'rab, qayta ko'rsatadi». Yangi gap: «Layk bosilganda ilova uni eslab qoladi, sahifa esa uni so'rab, qayta ko'rsatadi.»
- Xulosa: «Faqat kod yozadiganlar tushunadigan bunday so'z **kasbiy so'z** deyiladi. Uni tashlamaysiz, tanish so'z bilan almashtirasiz. Kod bilmaydigan odamga qavatning nomini emas, ishini ayting: eslab qoladi, tekshiradi, ko'rsatadi.»

#### O'Z G'OYANGIZ

**13 · Uch maydon** — ustaxona
- Sarlavha: «Tanlagan g'oyangizda ilova nimani yozib qo'yadi?»
- Oldingi darslardagi kartangiz va birinchi bo'lagingiz yonda ochiq turadi. **Karta bo'lmasa** (boshqa kompyuter): 1-darsning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim, 5 qatorli jadval) tanlov bo'lib chiqadi; tanlangan g'oyaning birinchi bo'lagi va bitta sharti jadvalning qo'shimcha ikki ustunidan tushadi — 15-ekran ularni ishlatadi.
- Uch karta, har birida ikki savol: «Ilova nimani yozib qo'yadi?» · «Bundan qaysi bo'lim ochiladi?» Shart-yorliqlari: «3 maydon» · «Har biriga bo'lim».
- Namuna (futbol, birinchi bo'lak «bo'sh vaqtni band qilish»): «Qaysi kun va soat band qilindi» → «Bugungi jadval» · «Kim band qildi» → «Band qilganlarim» · «Kim o'ynashga yozildi» → «Bugun kim o'ynaydi».
- Tekshiruv: bo'lim bo'sh → «Bo'lim topilmasa — bu maydonni hozircha yozib qo'ymaymiz. Boshqa maydon oling yoki bo'limni yozing.»; baho so'zi («yaxshi», «tez», «qulay») → «Bu baho so'zi, ma'lumot emas. Ilova nimani yozib qo'yadi?»

**14 · Ochiq yoki yopiq** — ustaxona
- Sarlavha: «Uch maydoningizdan qaysi biri begonaga ko'rinmasin?»
- Har maydon yonida almashtirgich: **Hammaga ochiq** · **Faqat egasiga** (bu darsdagi ikki holat). Tanlovdan keyin bitta savol chiqadi — javobni o'quvchi o'zi yozadi: yopiq tanlansa «Begona ko'rsa, egasiga qanday zarar yetishi mumkin?» · ochiq tanlansa «Bu ma'lumotni boshqalarga ko'rsatish nega kerak?»
- Hammasi yopilsa: «Hamma maydon yopiq. Ilovangizda boshqalar hech narsani ko'rmasligi kerakmi? Ochiq qolish ham qaror.»
- Namuna: «Kim band qildi» → ochiq (do'stlar kim o'ynashini ko'rsin) yoki yopiq — «Bu maydon ikkala tomonda ham bo'lishi mumkin. Qarorni siz berasiz, sababini yozing.»
- Saqlanadi: «✓ Sxema tayyor: 3 maydon, har biri ochiq yoki yopiq».

**15 · Uch qavat gapi** — ustaxona
- Sarlavha: «Birinchi bo'lagingizda tugma bosilsa, ilova ichida nima bo'ladi?»
- Oldingi darsdagi birinchi shartingiz («Foydalanuvchi nima qiladi? · Shundan keyin nima bo'ladi?») yonda turadi; kartasiz o'quvchida — 13-ekranda tanlangan tayyor g'oyaning bo'lagi va sharti (qo'shimcha jadval). Uch yozuv joyi, yorliqlar savol shaklida: «Ko'rsatadigan qavat: odam ekranda nimani ko'radi?» · «Tekshiradigan qavat: ilova nimani tekshiradi?» · «Eslab qoladigan qavat: ilova nimani eslab qoladi?» — har biriga bitta gap.
- Namuna (futbol): «Bo'sh vaqt bosilganda katak yashil bo'lib, "Band qilindi" yozuvi chiqadi» · «Shu vaqtni boshqa birov oldin band qilmaganini tekshiradi» · «Kim, qaysi kun va soatda band qilganini eslab qoladi — ertaga ham turadi».
- Jonli tekshiruv: kasbiy so'z (baza · API · server · JSON · fetch · kod) yozilsa qizil chiziq va «Bu kasbiy so'z. Qavatning ishini tanish so'z bilan ayting.»; ikki gap bir xil ishni aytsa → «Bu ikki gap bitta ishni aytyapti. Har qavatning o'z ishi bor.»
- Saqlanadi: «✓ Uch qavat gapi tayyor».

#### AI BILAN

**16 · AI — maxfiylik savollarini beruvchi**
- Sarlavha: «Ochiq maydonlaringizni begona ko'rsa, nima bo'lishi mumkin?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI ochiq maydonlaringiz haqida savol beradi. Ilovani to'liq tekshirmaydi — qarorni siz qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
 > «Ilovam: {g'oya bir gapda}. Maydonlari: 1) {maydon} — {ochiq/yopiq} 2) {maydon} — {ochiq/yopiq} 3) {maydon} — {ochiq/yopiq}. Har ochiq maydon uchun menga bitta savol bering: begona bu ma'lumotni bilsa, undan qanday foydalanishi mumkin? Yoki uni ochiq qoldirish nima uchun kerak? Maydonni yopish yoki ochiq qoldirishni aytmang — qarorni o'zim qilaman.»
- «Nusxalash» → gemini.google.com → o'quvchi savollarni o'qib, 14-ekrandagi almashtirgichni o'zi qoldiradi yoki o'zgartiradi, sababini yozadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → har ochiq maydoni yonida ikki tayyor savol chiqadi: «Begona buni bilsa, undan qanday foydalanishi mumkin?» · «Buni ochiq qoldirish kimga, nima uchun kerak?» O'quvchi javob yozadi va almashtirgichni o'zi hal qiladi. Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi.
- Qoida ekranda: «AI ilovani to'liq tekshirmaydi, faqat savol beradi. Maydonni yopish yoki ochiq qoldirishni siz hal qilasiz.»

#### YAKUN

**17 · Juftlik** — ballsiz
- Sarlavha: «Sherigingiz gapingizdan qavatni topa oladimi?»
- Yo'riq: «Uch qavat gapingizdan bittasini sherigingizga o'qing — u qaysi qavat ekanini topsin. Topolmasa, gap qavatning ishini aniq aytmagan yoki ikki qavat ishini aralashtirgan bo'lishi mumkin: birga tuzating. Keyin o'rin almashing.»
- Yozish: «Sherigingiz qaysi gapni topolmadi va nimani o'zgartirdingiz — bitta gapda yozing.»

**18 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**19 · Flashcard** (5 ta — hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Maydon nima? | Ilova har safar yozib qo'yadigan bitta narsa |
| Ma'lumotni nima yopadi? | Zarar: begona ko'rsa egasiga zarar yetadigan maydon yopiladi |
| Sxema nima? | Ilovaning hamma maydonlari ro'yxati |
| Uch qavat qaysi ishlarni qiladi? | Sahifa ko'rsatadi · server tekshiradi · baza eslab qoladi |
| Kasbiy so'zni nima qilasiz? | Tanish so'z bilan almashtirasiz: qavatning nomi emas, ishi aytiladi |

**20 · Arena + yakun**
- Arena: 12 savol (3/3/3/3), to'rt blokdan teng; ekran savollari va flashcard javoblarining nusxasi emas — boshqa vaziyatda (musiqa ilovasi · maktab kutubxonasi sayti · oshxona buyurtma ilovasi).
- Yakun — 4 qator:
 - Bu darsda maydonni u ochadigan bo'limga qarab tanladik.
 - Ma'lumotni zarar yopadi: begona ko'rsa egasiga zarar yetadigan maydon yopiladi.
 - Odamga aytilgan har ma'lumot ortida sxemada kerakli maydon turadi.
 - Layk kabi yozib qo'yiladigan bosish uch qavatdan o'tadi: sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi.
- Mentor og'zaki: «NestJS modulida shu uch qavatning o'rtadagisini — tekshiradigan serverni qurasiz.»

---

### 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 5 · 7 · 9 · 11 — har biri o'z blokidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Field Finder!** (3) — «Bo'lim ochadigan maydonlarni topdingiz» · **Who Sees It!** (6) — «Har maydonni kim ko'rishini hal qildingiz» · **Schema Ready!** (14) — «G'oyangizga uch maydonli sxema yozdingiz» · **Three Floors!** (15) — «Uch qavat gapini kasbiy so'zsiz yozdingiz» |

### 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| 1-blok · Maydon | 3–5 | 13 |
| 2-blok · Ochiq va yopiq | 6–7 | 10 |
| 3-blok · Sxema | 8–9 | 10 |
| 4-blok · Uch qavat | 10–12 | 14 |
| O'z g'oyasi | 13–15 | 20 |
| AI + juftlik | 16–17 | 8 |
| Yakun | 18–20 | 6 |
| Bufer | | 4 |

Dars zich (4 blok + 3 ustaxona). Vaqt yetmasa, birinchi qisqaradigan joy — 12-ekran (kasbiy so'zsiz): uni mentor 15-ekran oldidan og'zaki aytadi.

---

# TASDIQ-QOLIPI

Har dars uchun bir qator yozing:

```
1-o'tish 1-dars:   ✅ / o'zgartirish: <ekran raqami> — <nima>
2-o'tish 2-dars:   ✅ / …
2-o'tish 3-dars:   ✅ / …
3-o'tish 1-dars:   ✅ / …
3-o'tish 2-dars:   ✅ / …
3-o'tish 3-dars:   ✅ / …
4-o'tish 3-dars:   ✅ / …
```

Hammasi ✅ bo'lsa — qurish tartibi: infra (alohida sayt + jonli ball) → 1-o'tish 1-dars pilot (qolipni qotiradi, siz ko'rasiz) → qolgan darslar shu qolipda.
