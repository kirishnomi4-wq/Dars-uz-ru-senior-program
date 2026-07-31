# M2-D7 — Dekompozitsiya: katta rejadan ochilish ro'yxatiga (SENARIY, PM_Prompt_v8)

> Holat: YOZILDI → **[GATE S] kutilmoqda** (foydalanuvchi tasdig'isiz qurilishga o'tilmaydi).
> Fayl-nishon: `src/2-Modull/PmLesson5.jsx` (noldan qayta quriladi).

---

## 0. SHAPKA

| Maydon | Qiymat |
|---|---|
| **Dars-ID** | M2-D7 · dastur bo'yicha 2-Modulning 7-darsi |
| **lessonId (yangi)** | `pm-m2d7-v1` (eski `pm-decomposition-05-v18` bekor — to'liq qayta qurilish, 11-qonun formati) |
| **Dars mavzusi** | Dekompozitsiya — katta rejani bo'laklab, MVP va backlog qilish |
| **TUR** | 🔀 **GIBRID** (1-B jadval) — pastda aniq taqsimot |
| **Bosh keys** | **K3 · INSTAGRAM** (Burbn → foto+filtr+izoh; MVP · fokus · imkoniyat-saralash · ishga tushirish) |
| **ISHLATILGAN_KEYS** | K3 |
| **Band keyslar (bosh-keys sifatida OLINMAYDI)** | K18 Starbucks · K5 Duolingo · K11 McDonald's · K8 Facebook · **K1 UZUM (M2-D2 da)** |
| **Modul-ipi (96-qonun)** | 🌯 **Maktab yonidagi lavash do'koni sayti** — butun 2-Modul shu olamda |
| **Misol-olam sinovi (95-qonun)** | «Toshkent o'smiri maktab yonidagi lavash do'koniga o'zi boradimi?» → HA ✓ |
| **Artefakt-kirish** | `pm-m2d2-features` — M2-D2 «Muammo → Yechim» darsida yozilgan imkoniyat-kartalar |
| **Artefakt-chiqish** | `pm-m2d7-mvp` = `{ v1: [3 ta], v2: [...], backlog: [...], savedAt }` |
| **Yordamchi kalitlar** | `pm-m2d7-hook-choice` (33-qonun shaxsiylash) · `pm-m2d7-code` · `pm-m2d7-hw` |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82** + 8 bufer = 90 |
| **Ekran soni** | **19** |

### GIBRID taqsimoti (GATE S da muhrlanadi)

| Dars qismi | Qaysi turdan | Nima olinadi |
|---|---|---|
| **Nazariya-blok** (s2–s7) | **2-TUR** (`PmUserStoryLesson`) | KEYS-SLAYD + mikro-bashorat · induktiv «savol → misol → qoida → keys» · tushuncha odam/voqea orqali ochiladi |
| **Amaliyot-blok** (s8–s11) | **1-TUR** (`PmLesson2`) | o'quvchi **YOZMAYDI, SARALAYDI** — tanlaydi, o'lchaydi, tartiblaydi, xatoni topadi; navbat-pulsi 1-C bo'yicha |
| **Yakun** (s9) | **2-TUR belgisi** | saralash natijasi **o'quvchining O'Z ro'yxati** bo'lib yoziladi va keyingi darslarga o'tadi (`pm-m2d7-mvp`) |
| **Koding** (s12) | 87-qonun | 2-Modul JS materiali ustida (massiv + sikl + shart + funksiya) |

### Oldingi mexanikalar (TAKRORLANMAYDI — 10/26-qonun, 5-bo'lim)

| Dars | Band mexanika |
|---|---|
| UserStory (P0) | 3 hikoya ustaxonasi · tekshiruvchi-stoli (✓/✕ hukm) · klinika · `hikoyaYasa` kompilyatori · **🔥⚡🌱 prioritet-doska lagancha bilan** |
| PmLesson1 | bosqichli karta-yig'ish «Egasiga ko'rsating» · `[KIM]` almashtirish kodingi · PairTimer |
| PmLesson2 | OLX interfeys-solishtiruvi |
| PmLesson3 | Demo Day mikrofon-yozuv |

🔴 **Shu darsning saralash-mexanikasi prioritet-doska EMAS:** o'quvchi darajani **tanlamaydi** — u har imkoniyatga **ikki aniq savolga** javob beradi, daraja esa javoblardan **o'zi kelib chiqadi** (⚖️ TAROZI). Qaror ham, ko'rinish ham boshqa: doskada «bu men uchun qanchalik muhim?», tarozida «busiz sayt ish beradimi va bu qancha vaqt oladi?».

### 87-QONUN TEKSHIRUVI (koding loyihalashdan OLDIN)

O'quvchi bu darsgacha 2-Modulda o'tgan: `m2-01` JS kirish · `m2-03` o'zgaruvchilar · `m2-04` if/else (`===` bilan taqqoslash) · `m2-05` sikllar (`for`, massiv, indeks, `.length`) · `m2-06` funksiyalar (parametr, `return`, `console.log`).

🔴 **Fayl-tekshiruvi natijasi (grep, `src/2-Modull/`):**
- ✅ ishlatiladi: massiv (`[]`), indeks `[i]`, `.length`, `for`, `if`, `===`, matn qo'shish `+`, funksiya + `return`, `console.log`.
- ⛔ **KIRITILMAYDI:** **obyekt** (`{ nom: ... }`) — `JsFunctionsLesson`/`JsLoopsLesson`da o'rgatilmagan · `.push()` — faqat dvijok kodida uchraydi, darsda o'rgatilmagan · klass, `async`, `fetch`, `map/filter`.
- **Bo'shliq (87b):** funksiya darsi massivni funksiyaga **parametr qilib berishni** ko'rsatmagan — shu dars aynan o'sha bo'shliqni yopadi.

---

## 1. EKRAN-RO'YXATI (19 ekran)

| № | id | eyebrow | tur | scored | O'quvchi nima qiladi | Mexanika |
|---|---|---|---|---|---|---|
| 0 | `s0` | Ochilish kuni 🚀 | hook | — | 12 ta ishdan nechtasi bir haftaga sig'ishiga ovoz beradi (12 / 6 / 3) | ovoz-plitkalar + Kahoot-reveal; tanlov `pm-m2d7-hook-choice` ga yoziladi |
| 1 | `s1` | Bugungi natija | rule | — | kuzatadi | 🚀 «Ochilish ro'yxati» kartasi jonli o'z-o'zidan yozilib chiqadi (imzo-vizual: shtamp-qator) |
| 2 | `s2` | Katta ish | exploration | — | katta kartani bosadi — u bo'laklarga ajraladi, har bo'lakni birma-bir ochadi | split-animatsiya: 1 karta → 6 bo'lak (navbat-**yurish**, 1-C.4) |
| 3 | `s3` | Bo'lak qanday yoziladi | exploration | — | 4 yozuvdan tugatib bo'ladiganlarini tanlaydi (2 ta to'g'ri) | tap-tanlov + darhol izoh; jazosiz |
| 4 | `s4` | — | **TEST-1** | ✅ | javob beradi | `TestQ` (49-qonun) |
| 5 | `s5` | Ikki savol | exploration | — | BITTA namuna-imkoniyat ustida ikki savolga javob beradi, tarozi qanday ishlashini ko'radi | ⚖️ tarozi-demo (1 karta, tushuntirish rejimi) |
| 6 | `s6` | Biznes olamidan mashhur voqea 📸 | case | — | 5 slaydni ochadi, 2 joyda taxmin qiladi (ballsiz) | keys-slayd + mikro-bashorat (33/56-qonun) |
| 7 | `s7` | — | **TEST-2** | ✅ | javob beradi | `TestQ` |
| 8 | `s8` | Tarozi | practice | — | 6 imkoniyatni **birma-bir** ikki savoldan o'tkazadi | ⚖️ **TAROZI** — progressiv ochilish (94-qonun), tasdiqlangani bir qatorga yig'iladi |
| 9 | `s9` | Ochilish ro'yxati | practice | — | 🔥 ro'yxatni **aniq 3 taga** keltiradi va saqlaydi | qisqartirish + `pm-m2d7-mvp` ga yozish; `done-mini` tasdiq |
| 10 | `s10` | — | **TEST-3** | ✅ | javob beradi | `TestQ` |
| 11 | `s11` | Boshqa guruhning ro'yxati | exploration | — | noto'g'ri joydagi kartani topadi, so'ng uni joyiga qo'yadi | xato-topish, 2 qadam (progressiv); jazosiz neytral izoh |
| 12 | `s12` | Kod | koding | — | kompilyatorda funksiyani to'ldiradi | launch-vizual → to'liq-ekran `PmCompiler`, 3 jonli shart-chip (50/82-qonun) |
| 13 | `s13` | Yoddan | recap | — | sherigiga 30s aytadi, keyin 1 qator yozadi | `PairTimer` + `Reflection` (**SOFT shu blokda**) |
| 14 | `s14` | Uyga vazifa | homework | — | hajm-variantni tanlaydi | shartnoma-karta (57-qonun: «To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa») |
| 15 | `s15` | — | **YAKUNIY TEST** | ✅ (final) | javob beradi | `TestQ` |
| 16 | `s15b` | — | stats | — | natijani ko'radi | Podium (90-qonun · 1-D) |
| 17 | `sflash` | — | review | — | 12 kartani aylantiradi | Flashcard |
| 18 | `s16` | — | summary | — | yakunni o'qiydi, arenaga kiradi | Summary + CodeStrike |

**Test-taqsimot tekshiruvi:** s4 · s7 · s10 · s15 — ketma-ket EMAS, har biri o'z nazariyasidan keyin ✓

---

## 2. SARALASH-MEXANIKASI SPETSIFIKATSIYASI ⚖️ TAROZI

### 2.1 Ko'rinishi
Ekran markazida **bitta** imkoniyat-kartasi (o'quvchining O'Z kartasi, `pm-m2d2-features` dan). Kartaning tagida — **tarozi**: chapda 🎯 **foyda** kosasi, o'ngda 🧱 **yuk** kosasi. Kosalar boshida bo'sh va tekis turadi. O'quvchi savolga javob berganda kosa **og'irlashadi** (kichik CSS-egilish, `prefers-reduced-motion`da statik). Ikkala javob berilgach karta tarozidan pastga **sirg'alib** uchta savatdan biriga tushadi.

Uchta savat ekranning pastida ingichka qator bo'lib turadi (kartalarsiz, faqat son bilan):
`🔥 Ochilish ro'yxati 0` · `⚡ Keyingi versiya 0` · `🌱 Keyinga qoldirilganlar 0`

🔴 **Prioritet-doskadan farqi:** ustunlar **qabul qiluvchi zona emas** — ularga bosib bo'lmaydi, karta ularga **o'zi** tushadi. Ko'chiriladigan «lagancha» YO'Q (72-qonun bu ekranga tegishli emas).

### 2.2 Qadamlari (94-qonun — progressiv ochilish)
1. Ekran ochilganda **faqat 1-savol** ko'rinadi. 2-savol qulf-qator holida: «⏳ Ikkinchi savol — javobdan keyin».
2. **1-savol:** «Ochilish kuni bu bo'lmasa, sayt ish beradimi?»
   · `🚫 Yo'q — busiz sayt ish bermaydi` · `✅ Ha — busiz ham ish beradi`
3. Javob berilgach 1-savol bir qatorga yig'iladi (`✓ javob + ↻`), **2-savol** ochiladi.
4. **2-savol:** «Buni qurish qancha vaqt oladi?»
   · `⚡ Bir kunda bo'ladi` · `🧱 Bir necha kun ketadi`
5. Karta savatga tushadi → keyingi karta chiqadi. Tepada havodagi qadam-indikator: `1 2 3 4 5 6` (80a naqshi — karta emas, doiralar).
6. 6/6 da ekran **o'zi bajarildi** (honor-tugma yo'q, 48-qonun), signal `PRACTICE_BASE + screen`.

### 2.3 Daraja qanday kelib chiqadi (o'quvchi darajani TANLAMAYDI)

| 1-savol | 2-savol | Karta qayerga tushadi |
|---|---|---|
| Busiz ish bermaydi | Bir kunda bo'ladi | 🔥 **Ochilish ro'yxati (v1)** |
| Busiz ish bermaydi | Bir necha kun ketadi | ⚡ **Keyingi versiya (v2)** |
| Busiz ham ish beradi | Bir kunda bo'ladi | ⚡ **Keyingi versiya (v2)** |
| Busiz ham ish beradi | Bir necha kun ketadi | 🌱 **Keyinga qoldirilganlar (backlog)** |

Har tushishdan keyin **bitta qator** izoh (mexanikani emas, **sababni** aytadi):
- 🔥 → «Busiz sayt ish bermaydi va bir kunda bo'ladi — ochilish kuniga shu kerak.»
- ⚡ (kerak+og'ir) → «Kerak, lekin bir haftaga sig'maydi. Ochilishdan keyin quriladi.»
- ⚡ (shart emas+yengil) → «Tez bo'ladi, lekin busiz ham sayt ish beradi. Navbati keyin.»
- 🌱 → «Busiz ham ish beradi, ustiga bir necha kun ketadi. Hozircha kutib turadi.»

### 2.4 Xato tanlovga javob — JAZOSIZ
🔴 Bu ekranda **to'g'ri/noto'g'ri javob YO'Q**: qizil rang, ✕ belgi, ball — hech biri ishlatilmaydi. Sabab: bu o'quvchining O'Z mahsuloti haqidagi qarori.

Yagona «tuzatuvchi» kuch — **oqibat**, keyingi ekranda ko'rinadi:
- Agar 🔥 ga **3 tadan ko'p** karta tushsa → s9 da chegara ochiladi: o'quvchi ortiqchasini ⚡ ga suradi.
- Agar 🔥 ga **3 tadan kam** tushsa → s9 da ⚡ ro'yxatidan tortib olib to'ldiradi.
- Agar 🔥 **bo'sh** qolsa → s9 mentor gapi: «Ochilish kunida hech narsa ishlamaydigan sayt ochiladi. Ro'yxatga uchtasini tanlang.» (ayblov yo'q, holat aytiladi).

Tarozi qaroriga qaytish har doim ochiq: har yig'ilgan qatorda `↻` tugmasi turadi.

### 2.5 «Eng muhim» chegarasi — 🔥 ro'yxatiga AYNAN 3 ta
**Chegara-gap (ekranda so'zma-so'z):**
> «Ochilishgacha bir hafta bor, sayt ustida bitta odam ishlaydi. Bir haftada uchta ish tugaydi. To'rtinchisi boshlanadi-yu, tugamaydi — ochilish kuni sayt yarim qolgan holda ochiladi.»

Ya'ni chegara — **fikr emas, vaqt**. Shuning uchun u muhokama qilinmaydi va o'quvchi «meningcha to'rtta kerak» deb chiqib ketolmaydi: `s9` da «Saqlash» tugmasi faqat `v1.length === 3` bo'lganda ochiladi, qulf-yorliq esa qaysi qadam qolganini aytadi (30/83-qonun):
- 4+ bo'lsa: «🔒 Yana 1 tasini ⚡ ga suring»
- 2 bo'lsa: «🔒 Yana 1 tasini 🔥 ga ko'taring»

---

## 3. KEYS-SLAYD SPETSIFIKATSIYASI (s6 · K3 INSTAGRAM)

**Freym (91b):** eyebrow — «Biznes olamidan mashhur voqea 📸». Sarlavha: «Hamma imkoniyatni o'chirgan ilova».
**Slayd soni:** 5. **Mikro-bashorat:** 2 ta (2- va 4-slayd oldidan), **ball YO'Q** va bu ochiq yoziladi (79-qonun).

| # | Sarlavha | Matn |
|---|---|---|
| 1 | Avval boshqa ilova bor edi | Burbn degan ilova ichida bir nechta ish birga turardi: joy belgilash, uchrashuv rejasi, foto qo'yish, do'stlarga xabar. Hammasi bitta ilovada. |
| 2 | Odamlar nimani ishlatardi? | Odamlar ilovani ochib, deyarli hech narsaga tegmasdi. Faqat bitta ish qiziq bo'lgan: **foto qo'yish**. |
| 3 | Asoschilar og'ir qaror qildi | Ular qolgan hamma imkoniyatni **o'chirib tashladi**. Saqlab qolgani uchtasi: **foto · filtr · izoh**. |
| 4 | Nima bo'ldi? | Ilova 2010-yilning oktyabrida yangi nom bilan chiqdi — **Instagram**. **Birinchi kunning o'zida 25 000 odam ro'yxatdan o'tdi.** |
| 5 | Xulosa | Ilova ko'p ish qilgani uchun emas, bitta ishni **oxirigacha** qilgani uchun yurdi. Instagram ham ochilish kuniga uchta ishni olib chiqqan edi. |

**Bashorat 1 (2-slayd oldidan):**
Savol: «Sizningcha, Burbn'da odamlar nimani ishlatardi?»
Variantlar: `📍 Joy belgilashni` · `📅 Uchrashuv rejasini` · `📷 Foto qo'yishni` → to'g'risi 3-chi.
Adashganga: «Adashdingiz — asl javob "foto qo'yish".» (56-qonun: javob DOIM ochiladi, qizil yo'q)

**Bashorat 2 (4-slayd oldidan) — zinapoya tartibida (korpus 43):**
Savol: «Ortiqcha imkoniyatlarni o'chirgan ilova bilan nima bo'ldi?»
Variantlar: `😶 Hech kim yozilmadi` · `🙂 Bir necha yuz odam yozildi` · `🚀 Birinchi kuniyoq 25 000 odam yozildi` → to'g'risi 3-chi.

**Hook-payoff shaxsiylashuvi (33-qonun):** 5-slaydda `pm-m2d7-hook-choice` o'qiladi —
«Dars boshida siz *bir haftaga N ta ish sig'adi* degandingiz. Instagram esa uchta ish bilan chiqqan.»
Tanlov yo'q bo'lsa — umumiy matn (fallback).

**Ko'prik-gap (91b — darsga QAYTADI, oxirgi slayddan keyin bir qator):**
> «Instagram ham ochilish kuniga faqat uchta ishni olib chiqdi. Sizning lavash-saytingiz ham xuddi shunday ochiladi — endi qaysi uchtasi ekanini o'zingiz aniqlaysiz.»

⛔ **Keys darsning boshqa hech bir ekranida ishlatilmaydi** (91-qonun) — arena-savollari (Q9, Q10) va dekor-tokenlardan boshqa joyda «Instagram/Burbn» so'zi chiqmaydi.

---

## 4. KODING SPETSIFIKATSIYASI (s12 · 87-qonun)

**Sarlavha (korpus 48 — natijani aytadi):** «Ochilish ro'yxatini kod o'zi ajratib beradi.»
**Launch-vizual (50-qonun):** chapda kod-chip `ochilishRoyxati(nomlar, darajalar)` ➜ puls-strelka ➜ o'ngda o'quvchining O'Z 🔥 kartalari (`pm-m2d7-mvp` dan o'qiladi; bo'sh bo'lsa namuna-fallback, 40-qonun). Ostida bitta CTA: «🛠 Kompilyatorni ochish» + bir qator izoh: «Kodni yozadigan va natijani darhol ko'rsatadigan oyna ochiladi.»

### 4.1 Boshlang'ich kod (KOD maydoni)

```js
// Lavash do'koni sayti — imkoniyatlar va ularning darajasi.
// Ikkala massivda ham bir xil o'rindagi element bir imkoniyatga tegishli.
const nomlar = ["Menyu va narxlar", "Ish vaqti va manzil", "Buyurtma tugmasi",
                "Yetkazib berish xaritasi", "Chegirma kodi", "Sharhlar bo'limi"];
const darajalar = ["v1", "v1", "v1", "backlog", "v2", "backlog"];

function ochilishRoyxati(nomlar, darajalar) {
  let natija = "";
  for (let i = 0; i < nomlar.length; i++) {
    // ← Bu joyni siz to'ldirasiz
  }
  return natija;
}

console.log(ochilishRoyxati(nomlar, darajalar));
```

**O'quvchi nima qiladi:** sikl ichiga bitta shart yozadi — daraja `"v1"` bo'lsa, nomni `natija` ga qo'shadi.
Kutilgan yechim (mentor uchun, ekranda KO'RSATILMAYDI):
```js
if (darajalar[i] === "v1") {
  natija = natija + nomlar[i] + " · ";
}
```

### 4.2 Uchta jonli tekshiruv-sharti (debounce avto-tekshiruv, birinchi bajarilmaganida 💡)

| # | Chip (≤4 so'z) | Shart | 💡 Ipucha |
|---|---|---|---|
| 1 | `Sikl ichida shart bor` | kodda `if` va `darajalar[i]` birga uchraydi | «Sikl har imkoniyatni birma-bir oladi. Ichida so'rang: bu imkoniyatning darajasi nima?» |
| 2 | `"v1" tekshirilyapti` | shartda `=== "v1"` bor | «Tenglikni bitta emas, **uchta** teng belgi tekshiradi: `=== "v1"`.» |
| 3 | `Uchta nom chiqdi` | `console.log` natijasida aynan 3 ta nom bor | «Natija bo'sh chiqsa — `natija` ga nom qo'shilmayapti. `natija = natija + nomlar[i]` qatorini eslang.» |

**YULDUZCHA:** yana bitta funksiya yozing — `nechta(darajalar, daraja)` — berilgan darajada nechta imkoniyat borligini **son** qilib qaytarsin (`return son`).
**YORDAM:** «`darajalar[i]` — shu o'rindagi daraja, `nomlar[i]` — shu o'rindagi nom. Ikkalasi bir xil `i` bilan yuradi.»

**Takeaway (65-qonun qoplamasi, ekranda bir qator):**
> «Qoida: ochilish ro'yxati **kod yozishdan oldin** tuziladi — kod faqat tanlanganini quradi.»

**Nusxa-taqiq (82d):** kod nusxalanmaydi, mentor sababini ochiq aytadi: «Kodni o'zingiz terib yozasiz — qo'lda yozganda o'rganiladi.»
**Takrorlash-yo'li (89-qonun):** faqat erkin rejimda xira matn-havola — «✓ Bu mashqni sinfda bajarganman — davom etish →».

---

## 5. BLOKLAR (PM_Prompt_v8 qat'iy shabloni)

```
=== DARS ===
MODUL: 2 — Jonli sayt (JavaScript asoslari + lavash do'koni sayti)
DARS: M2-D7 (2-Modulning 7-darsi)
DARS_MAVZUSI: Dekompozitsiya — katta rejani bo'laklab, MVP va backlog qilish
ISHLATILGAN_KEYS: K3

=== BLOK 1: HOOK ===
VAQT: 5
KOMPONENT: Quiz (ovoz-berish, Kahoot-reveal)
EKRAN: Lavash do'koni egasi sayt uchun 12 ta ish aytdi: menyu, buyurtma tugmasi, xarita, chegirma, sharhlar va boshqalar. Ochilishgacha bir hafta bor, ishlaydigan odam — bitta. Bir haftada nechtasi tugaydi? [A] 12 ta [B] 6 ta [C] 3 ta
HARAKAT: O'quvchi variantga ovoz beradi; tanlov saqlanadi (keys-slaydda qaytariladi).
JAVOB: C — bir haftada uchta ish tugaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Javobni oldindan aytmang. Ovoz berilgach reveal: «Uchta. Demak qolgan to'qqiztasi bilan nima qilamiz — shuni bugun hal qilamiz.»

=== BLOK 2: MAQSAD ===
VAQT: 2
KOMPONENT: Natija-preview (jonli yozilib chiqadigan karta)
EKRAN: Dars oxirida do'kon saytining ochilish ro'yxatini tuzishni bilib olasiz: uchta ish ochilish kuniga, qolganlari esa navbatiga qarab ikkita ro'yxatga tushadi. Quyida namunasi o'z-o'zidan yozilib chiqadi.
HARAKAT: Natija-previewni kuzatadi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ro'yxat 8-darsdan boshlab loyihada quriladi va 13-darsda taqdim qilinadi — shuni bir gapda aytib o'ting.

=== BLOK 3: YADRO ===
VAQT: 26
KOMPONENT: Split-animatsiya + tap-tanlov + tarozi-demo + keys-slayd + 2 scored test
EKRAN: (s2) «Lavash do'koniga sayt qilish» — bitta ish bo'lib ko'rinadi. Kartani bosing: u alohida ishlarga bo'linadi. Katta ishni shunday bo'laklarga bo'lish dekompozitsiya deyiladi. · (s3) Yaxshi bo'lakni tugatib bo'ladi: qilindi — tamom. Qaysi ikki yozuvni tugatib bo'ladi? · (s5) Har bo'lak ikki savoldan o'tadi: busiz sayt ish beradimi va uni qurish qancha vaqt oladi. · (s6) Biznes olamidan mashhur voqea 📸 · Instagram.
HARAKAT: (1) katta kartani bosib bo'lib yuboradi va 6 bo'lakni birma-bir ochadi; (2) tugatib bo'ladigan ikki yozuvni tanlaydi; (3) TEST-1; (4) namuna-imkoniyatni tarozidan o'tkazadi; (5) keys-slaydlarni ochadi, 2 joyda taxmin qiladi; (6) TEST-2.
JAVOB: Bo'lak = boshi va oxiri ko'rinadigan ish · Ikki savol: kerakmi + qancha vaqt oladi · MVP = sayt ish beradigan eng sodda birinchi versiya.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Frontal gap jami 10 daqiqadan oshmasin. Atama tartibi buzilmasin: avval hodisa, keyin nom (dekompozitsiya → tarozi → MVP).

=== BLOK 4: MUSTAQIL ISH ===
VAQT: 16
KOMPONENT: Tarozi (progressiv) + Ochilish ro'yxati (saqlash)
EKRAN: 2-darsda yozgan imkoniyatlaringiz shu yerda. Har birini birma-bir tarozidan o'tkazing: busiz sayt ish beradimi va uni qurish qancha vaqt oladi. Karta o'zi tushadigan joyini topadi.
HARAKAT: 6 imkoniyatni tarozidan o'tkazadi (s8), so'ng ochilish ro'yxatini aynan 3 taga keltirib saqlaydi (s9).
JAVOB: 3/3 = qabul · 2/3 = joyida to'g'rilanadi · undan kam = mentor bilan qaytadan.
RO'YXAT: 1) Oltala imkoniyat ikki savoldan o'tgan 2) Ochilish ro'yxatida aynan 3 ta ish bor 3) Qolganlari ikki ro'yxatga taqsimlangan — hech biri yo'qolmagan
YULDUZCHA: Ochilish ro'yxatidagi uchta ishni ochilish kunidagi tartibda raqamlang: qaysi biri birinchi qilinadi va nega aynan u?
YORDAM: Bitta savolga javob bering: shu bo'lak bo'lmasa, odam saytga kirib nima qila oladi? Hech narsa qila olmasa — u ochilish ro'yxatiga tushadi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Bu ekranda to'g'ri javob yo'q — bahslashmang. Uchtaga sig'may qolgan o'quvchiga vaqt-chegarasini eslatish kifoya.

=== BLOK 5: TEKSHIRUV ===
VAQT: 6
KOMPONENT: Xato-topish (2 qadam) + scored test
EKRAN: Boshqa guruh xuddi shu do'kon uchun ochilish ro'yxatini tuzdi. Bitta karta noto'g'ri joyda turibdi — uni toping, so'ng joyiga qo'ying.
HARAKAT: (1) TEST-3 ga javob beradi; (2) tayyor ro'yxatdagi noto'g'ri kartani bosadi; (3) unga to'g'ri ro'yxatni tanlaydi.
JAVOB: Noto'g'ri karta — «⭐ Sharhlar bo'limi» (🔥 da turibdi); to'g'ri joyi — 🌱 Keyinga qoldirilganlar.
RO'YXAT: —
YULDUZCHA: —
YORDAM: Har kartadan so'rang: busiz sayt ochilish kuni ish beradimi? Javob «ha» bo'lsa — u ochilish ro'yxatida turmaydi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Mexanika oldingi PM darslarini takrorlamaydi: UserStory'da tayyorga hukm chiqarilgan edi, bu yerda xato QIDIRILADI.

=== BLOK 6: KODING ===
VAQT: 10
KOMPONENT: PmCompiler (to'liq-ekran, shu faylning o'zida)
EKRAN: Ochilish ro'yxatini kod o'zi ajratib beradi. Ikki massiv tayyor: nomlar va darajalar. Siklning ichiga bitta shart yozing — daraja "v1" bo'lsa, nom natijaga qo'shilsin.
HARAKAT: Kompilyatorni ochadi, siklga shartni yozadi, natijani ko'radi (3 nom chiqishi kerak).
JAVOB: Kod ishga tushdi va konsolda aynan 3 ta nom chiqdi = qabul.
RO'YXAT: —
YULDUZCHA: nechta(darajalar, daraja) funksiyasini yozing — berilgan darajada nechta imkoniyat borligini son qilib qaytarsin.
YORDAM: darajalar[i] — shu o'rindagi daraja, nomlar[i] — shu o'rindagi nom. Ikkalasi bir xil i bilan yuradi.
KOD: (4.1-bo'limdagi boshlang'ich kod)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Obyekt va .push bu darsgacha o'tilmagan — o'quvchi ularni so'rasa, «keyingi modulda» deb qo'ying, kodga kiritmang.

=== BLOK 7: RECAP ===
VAQT: 5
KOMPONENT: PairTimer + Reflection
EKRAN: Ochilish ro'yxatingizni yoddan ayta olasizmi? Ekranga qaramasdan sherigingizga ayting: qaysi uchta ish tanladingiz va nega aynan ular ochilish kuniga tushdi. Keyin javobingizni bir qatorda yozing.
HARAKAT: (1) juftlikda 30 soniyadan navbatma-navbat aytadi; (2) Reflection'ga 1 qator yozadi; (3) 3 tez savolga harakat bilan javob beradi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda 30+30 soniyalik navbatma-navbat aytish (halqa-taymer bilan).
MENTORGA: Sinfning uchdan biridan ko'pi «nega aynan bu uchtasi» degan savolga javob berolmasa — vaqt-chegarasi gapini qayta tushuntiring.

=== BLOK 8: UYGA VAZIFA ===
VAQT: 4
KOMPONENT: SHARTNOMA (hajm-tanlovi)
EKRAN: Ochilish ro'yxatingizdagi uchta ishning har biriga bittadan qator yozing: bu tayyor bo'lganda odam saytga kirib nima qila oladi? So'ng keyingi versiya ro'yxatiga o'zingizdan yana bitta imkoniyat qo'shing va uni ikki savoldan o'tkazing: busiz sayt ish beradimi, qancha vaqt oladi.
HARAKAT: 3 qator yozadi + 1 yangi imkoniyat qo'shib, ikki savolga javob yozadi.
JAVOB: —
RO'YXAT: 1) Uchta ishning har biriga bittadan qator yozilgan 2) Har qator odam nima qila olishini aytadi 3) Yangi imkoniyat ikki savoldan o'tkazilgan va darajasi belgilangan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Faqat uchta qator: har bir ish tayyor bo'lganda odam saytda nima qila olishini yozing.
SOFT: —
MENTORGA: Koding sinfda tugamagan bo'lsa — qisqa variant beriladi, koding uyda tugatiladi. Tashqi ma'lumot so'ralmaydi: hammasi o'quvchida allaqachon bor (92d).

=== BLOK 9: CODESTRIKE ===
VAQT: 8
KOMPONENT: CodeStrike arena (12 savol · 15s · 3/3/3/3)
EKRAN: —
HARAKAT: 12 savollik jonli arena.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: Dekompozitsiya va ochilish ro'yxati: katta ishni bo'laklarga bo'lish, tugatib bo'ladigan bo'lak, ikki savol (busiz ish beradimi / qancha vaqt oladi), MVP, keyingi versiya, keyinga qoldirilganlar ro'yxati (backlog), uchta ish chegarasi, Instagram voqeasi, ro'yxat koddan oldin tuziladi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: —
```

---

## 6. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> Qolip: 74-qonun (savol darsning O'Z ta'rifi so'zlari bilan · variantlar grammatik javob beradi · reveal-izoh qisqa hukm+sabab) · 17-qonun (faqat BITTA himoyalanadigan to'g'ri) · korpus 21 (distraktorlar ishonarli).

### TEST-1 (s4) — dekompozitsiya
**Savol:** «Quyidagilardan qaysi biri alohida qilib, tugatib bo'ladigan bo'lak?»
| # | Variant | Izoh |
|---|---|---|
| A | Lavash do'koniga sayt qilish | «Bu — butun ishning o'zi. Uni bo'laklarga bo'lish kerak edi.» |
| B | Saytni chiroyli qilish | «"Chiroyli qilish" qachon tugaganini hech kim ayta olmaydi. Bo'lakning oxiri ko'rinib turishi kerak.» |
| **C ✅** | **Menyu ro'yxatini sahifaga qo'shish** | «To'g'ri. Boshi va oxiri bor ish: menyu qo'shildi — bo'lak tugadi.» |
| D | Do'konni mashhur qilish | «Bu — natija, ish emas. Uni sayt ustida o'tirib tugatib bo'lmaydi.» |

**To'g'ri indeks: 2**

### TEST-2 (s7) — MVP
**Savol:** «Sayt ochilish kunida ish berishi uchun birinchi versiyaga qaysi imkoniyatlar kiradi?»
| # | Variant | Izoh |
|---|---|---|
| A | O'ylab topilgan hamma imkoniyatlar | «Hammasi kirsa, ochilish kuni kelganda ishlarning yarmi tugamagan bo'ladi.» |
| B | Eng oson qilinadigan imkoniyatlar | «Osonligi yetarli emas: chegirma kodi oson, lekin busiz ham sayt ish beradi.» |
| **C ✅** | **Busiz sayt ish bermaydigan imkoniyatlar** | «To'g'ri. Birinchi versiyaga faqat busiz sayt ish bermaydigan ishlar kiradi — Instagram uchun bu foto, filtr va izoh edi.» |
| D | Do'kon egasiga eng ko'p yoqqan imkoniyatlar | «Yoqish-yoqmaslik qaror qilmaydi. Savol boshqa: busiz sayt ish beradimi?» |

**To'g'ri indeks: 2**

### TEST-3 (s10) — daraja qarori
**Savol:** «Bir imkoniyat kerak, lekin uni qurish bir necha kun oladi. U qaysi ro'yxatga tushadi?»
| # | Variant | Izoh |
|---|---|---|
| A | 🔥 Ochilish ro'yxatiga | «Sig'maydi: bir haftada uchta ish tugaydi, bu esa o'zi bir necha kun oladi.» |
| **B ✅** | **⚡ Keyingi versiyaga** | «To'g'ri. Kerak, lekin bir haftaga sig'maydi — ochilishdan keyin quriladi.» |
| C | 🌱 Keyinga qoldirilganlar ro'yxatiga | «U yerda busiz ham ish beradiganlar turadi. Bu esa kerak.» |
| D | Hech qayerga — u qilinmaydi | «Hech narsa o'chirilmaydi: navbati kechroqqa suriladi, xolos.» |

**To'g'ri indeks: 1**

### YAKUNIY TEST (s15) — chegara sababi
**Savol:** «Ochilish ro'yxatiga uchta ish sig'adi. Nega aynan uchta?»
| # | Variant | Izoh |
|---|---|---|
| A | Uchtadan ko'p imkoniyat foydalanuvchini chalg'itadi | «Bu yerda gap chalg'ishda emas — masala ulgurishda.» |
| **B ✅** | **Bir haftada bitta odam uchta ishni tugatadi, to'rtinchisi tugamay qoladi** | «To'g'ri. Chegara — vaqt: ochilishgacha bir hafta, ishlaydigan odam bitta.» |
| C | Uchta imkoniyat har qanday saytga yetadi | «Uchta — har doimgi son emas: bu bir haftaga sig'adigan son.» |
| D | Ko'p imkoniyat saytni sekinlashtiradi | «Sayt tezligi bu qarorni belgilamaydi.» |

**To'g'ri indeks: 1**

---

## 7. CODESTRIKE — 12 SAVOL (3/3/3/3, qo'shni-takrorsiz)

| # | Savol | Variantlar (✅ = to'g'ri) | Qaysi ekran o'rgatgan (65-qonun) |
|---|---|---|---|
| 1 | Katta ishni bo'laklarga bo'lish nima deyiladi? | ✅ Dekompozitsiya · Optimizatsiya · Prezentatsiya · Registratsiya | s2 |
| 2 | Qaysi biri tugatib bo'ladigan bo'lak? | ✅ Menyu ro'yxatini sahifaga qo'shish · Sayt qilish · Do'konni mashhur qilish · Saytni yaxshilash | s3, s4 |
| 3 | MVP — bu nima? | ✅ Mahsulotning ish beradigan eng sodda birinchi versiyasi · Eng qimmat versiyasi · Reklama rejasi · Sayt manzili | s5, s7 |
| 4 | Keyinga qoldirilganlar ro'yxati qanday ataladi? | ✅ Backlog · Deadline · Feedback · Interfeys | s9 |
| 5 | Tarozining birinchi savoli qanday? | ✅ Busiz sayt ish beradimi? · Bu chiroylimi? · Buni kim so'radi? · Bu qanchaga tushadi? | s5, s8 |
| 6 | Tarozining ikkinchi savoli qanday? | ✅ Buni qurish qancha vaqt oladi? · Bu kimga yoqadi? · Bu qanchaga sotiladi? · Buni kim quradi? | s5, s8 |
| 7 | Kerak, lekin bir necha kun oladigan ish qayerga tushadi? | ✅ Keyingi versiyaga · Ochilish ro'yxatiga · Keyinga qoldirilganlarga · Hech qayerga | s8, s10 |
| 8 | Busiz ham sayt ish beradigan, lekin bir kunda bo'ladigan ish qayerga tushadi? | Ochilish ro'yxatiga · ✅ Keyingi versiyaga · Keyinga qoldirilganlarga · O'chiriladi | s8 |
| 9 | Instagram asoschilari eski ilova bilan nima qildi? | ✅ Ortiqcha imkoniyatlarni o'chirib, uchtasini qoldirdi · Yangi imkoniyatlar qo'shdi · Narxni oshirdi · Ilovani sotdi | s6 |
| 10 | Instagram chiqqan birinchi kuni nima bo'ldi? | Hech kim yozilmadi · ✅ 25 000 odam ro'yxatdan o'tdi (2010-yil, oktyabr) · Ilova yopildi · Faqat nomi o'zgardi | s6 |
| 11 | Ochilish ro'yxatiga nechta ish sig'adi va nega? | ✅ Uchta — bir haftada bitta odam shuncha ishni tugatadi · Oltita — hamma imkoniyat kerak · Bitta — ko'pi shart emas · Cheksiz — vaqt muhim emas | s9, s15 |
| 12 | Ochilish ro'yxati qachon tuziladi? | ✅ Kod yozishdan oldin · Kod yozilgandan keyin · Sayt ochilgandan keyin · Umuman tuzilmaydi | s12 (takeaway) |

**Ball-fidbek matni (93-qonun — etalondan so'zma-so'z):** «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.» · ketma-ketlik: «🔥 ketma-ket 3 ta».

---

## 8. NISHONLAR (4 ta · inglizcha o'yin-nom · real triggerga bog'langan)

| Nom | O'zbekcha tavsif | Trigger |
|---|---|---|
| **Splitter!** | Katta ishni oltita bo'lakka bo'ldingiz. | s2 — 6/6 bo'lak ochildi |
| **Weigh In!** | Oltala imkoniyatni tarozidan o'tkazdingiz. | s8 — 6/6 karta joylashdi |
| **Launch List!** | Ochilish ro'yxatini tuzib saqladingiz. | s9 — `pm-m2d7-mvp` yozildi (v1 = 3) |
| **Sharp Eye!** | Noto'g'ri joydagi kartani topdingiz. | s11 — xato karta topildi va joyiga qo'yildi |

🖥 **Mentor rejimida nishonlar hech qanday ko'rinishda chiqmaydi** (90-qonun · 1-D jadval).

---

## 9. FLASHCARD (12 ta · old tomoni SAVOL)

| # | Old (savol) | Orqa (javob) |
|---|---|---|
| 1 | Katta ishni bo'laklarga bo'lish nima deyiladi? | Dekompozitsiya |
| 2 | Yaxshi bo'lak qanday yozilgan bo'ladi? | Uni alohida qilib, tugatib bo'ladi — boshi ham, oxiri ham ko'rinadi |
| 3 | Imkoniyat (feature) nima? | Saytning odamga foyda beradigan bitta ishi |
| 4 | MVP nima? | Mahsulotning ish beradigan eng sodda birinchi versiyasi |
| 5 | Backlog nima? | Keyinga qoldirilganlar ro'yxati |
| 6 | Tarozining birinchi savoli qanday yozilgan? | «Busiz sayt ish beradimi?» |
| 7 | Tarozining ikkinchi savoli qanday yozilgan? | «Buni qurish qancha vaqt oladi?» |
| 8 | Kerak, lekin og'ir ish qaysi ro'yxatga tushadi? | ⚡ Keyingi versiyaga |
| 9 | Ochilish ro'yxatiga nechta ish sig'adi? | Uchta — bir haftaga shuncha sig'adi |
| 10 | Nega hamma imkoniyat birdan qilinmaydi? | Bir haftada hammasi tugamaydi — sayt yarim qolgan holda ochiladi |
| 11 | Instagram ochilishida qaysi uch ish qolgan edi? | Foto, filtr, izoh |
| 12 | Ochilish ro'yxati qachon tuziladi? | Kod yozishdan oldin |

---

## 10. RECAP — 4 QATOR

1. Dekompozitsiya — katta ishni alohida tugatib bo'ladigan bo'laklarga bo'lish.
2. Har bo'lak ikki savoldan o'tadi: busiz sayt ish beradimi va uni qurish qancha vaqt oladi.
3. MVP — ochilish kunida ish beradigan eng sodda birinchi versiya; unga uchta ish sig'adi.
4. Qolganlari yo'qolmaydi: biri keyingi versiyaga, biri keyinga qoldirilganlar ro'yxatiga tushadi.

---

## 11. ARTEFAKT-ZANJIRI VA ZAXIRA MA'LUMOT

**Kirish:** `pm-m2d2-features` → o'quvchi M2-D2 da yozgan imkoniyat-kartalar.
**Zaxira (kalit bo'sh yoki 6 tadan kam bo'lsa)** — lavash do'koni namunasidan 6 ta tayyor imkoniyat qo'yiladi. Ekranda ochiq aytiladi: «2-darsdagi kartalaringiz topilmadi — namuna ro'yxat bilan ishlaymiz.»

| # | Imkoniyat | Kutilgan daraja (mentor uchun; o'quvchiga KO'RSATILMAYDI) |
|---|---|---|
| 1 | 📋 Menyu va narxlar ro'yxati | 🔥 v1 |
| 2 | 🕒 Ish vaqti va manzil | 🔥 v1 |
| 3 | 🛒 Buyurtma tugmasi | 🔥 v1 |
| 4 | 🎟 Chegirma kodi | ⚡ v2 |
| 5 | 🗺 Yetkazib berish xaritasi | 🌱 backlog |
| 6 | ⭐ Sharhlar bo'limi | 🌱 backlog |

**Chiqish:** `pm-m2d7-mvp` = `{ v1: [3], v2: [...], backlog: [...], savedAt }` → 8–12-darslarda loyiha shu ro'yxat bo'yicha quriladi, 13-darsda taqdim qilinadi.

**s11 (xato-topish) uchun tayyor ro'yxat — «boshqa guruh»niki:**
- 🔥 Ochilish ro'yxati: 📋 Menyu va narxlar · 🛒 Buyurtma tugmasi · **⭐ Sharhlar bo'limi ← noto'g'ri**
- ⚡ Keyingi versiya: 🎟 Chegirma kodi · 📸 Taomlar rasmi galereyasi
- 🌱 Keyinga qoldirilganlar: 🗺 Yetkazib berish xaritasi

Aynan BITTA karta noto'g'ri (59-qonun ma'lumot-qoidasi ruhi). Xato kartani topgach izoh: «Yangi ochilgan do'konda sharh yozadigan odam hali yo'q — busiz ham sayt ish beradi.» Boshqa kartaga bosilsa neytral: «Bu karta o'z joyida: busiz sayt ish bermaydi. Yana qarang.»

---

## 12. ATAMA-XARITASI (birinchi uchrash → gloss; 62/21-qonun)

| Atama | Birinchi chiqadigan ekran | Ekrandagi shakli |
|---|---|---|
| dekompozitsiya | s2 | avval hodisa (karta bo'linadi), keyin: «Katta ishni shunday bo'laklarga bo'lish **dekompozitsiya** deyiladi.» |
| imkoniyat (feature) | s2 | «Har bo'lak — saytning bitta **imkoniyati** (feature).» |
| MVP | s5 | «Sayt ish beradigan eng sodda birinchi versiya — shu ro'yxat **MVP** deb ataladi.» |
| backlog | s9 | «Keyinga qoldirilganlar ro'yxati — uni **backlog** deyishadi.» |

🔴 Sarlavhalarda yangi atama YO'Q (korpus 39): s2 sarlavhasi «Bitta ish yoki oltita ish?», s5 — «Har bo'lakdan nima so'raymiz?», s9 — «Ochilish kuniga nima sig'adi?».
🔴 Ta'rif dars bo'ylab **bir xil** yoziladi (93-qonun · korpus 52): «MVP — mahsulotning ish beradigan eng sodda birinchi versiyasi» — testda ham, flashcardda ham, yakun-ro'yxatida ham so'zma-so'z shu.

---

## 13. O'Z-TEKSHIRUV (PM_Prompt_v8 yakuniy ro'yxati)

1. VAQT yig'indisi: 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, qo'llanilmagani «—» ✓
3. BLOK 4 va BLOK 8 RO'YXAT = aynan 3 band ✓
4. BLOK 8: EKRAN (to'liq) + QISQA_VARIANT to'ldirilgan ✓
5. Bosh-keys K3 — 2-Modulda birinchi marta (band: K1 UZUM) ✓
6. TEKSHIRUV mexanikasi oldingi darsni takrorlamaydi: xato-topish ≠ hukm-stoli ≠ klinika ≠ OLX-solishtiruv ≠ mikrofon ✓
7. «sen»-forma: 0 ✓ (qurilishda grep bilan qayta tasdiqlanadi)
8. SOFT faqat BLOK 7 da ✓
9. 91-qonun: bitta misol-ip (lavash do'koni) — keys faqat s6 da, ko'prik bilan qaytadi ✓
10. 95-qonun: misol-olam Toshkent o'smirining o'z hayotidan ✓
11. 87-qonun: koding faqat o'tilgan JS ustida (obyekt/`.push` YO'Q) ✓
12. 92-qonun: har ekranda bitta ish (tarozi va ro'yxat AJRATILGAN) ✓
13. Prioritet-doska takrorlanmagan ✓ — o'quvchi darajani tanlamaydi, ikki savolga javob beradi

---

## 14. 🔶 QAROR KUTADIGAN NUQTALAR (GATE S)

1. **`pm-m2d2-features` hozircha mavjud emas.** `src/2-Modull/PmLesson4.jsx` (M2-D2 «Muammo → Yechim») bu kalitga hech narsa yozmaydi — grep bo'sh chiqdi. Ikki yo'l: (a) shu darsni zaxira-namuna bilan qurib ketish (senariyda shunday yozilgan), (b) PmLesson4 ga kichik yozuv-qadam qo'shib, zanjirni haqiqiy qilish. **(b) tavsiya etiladi** — aks holda «artefakt-zanjiri» faqat qog'ozda qoladi.
2. **`lessonId` almashadi:** `pm-decomposition-05-v18` → `pm-m2d7-v1` (11-qonun formati). Bu eski `ccProgress` saqlovini va eski jonli-sessiya kalitlarini uzadi. Tasdiqlansinmi?
3. **🔥 ro'yxati sig'imi = 3.** Chegara sababi vaqt bilan asoslangan («bir hafta, bitta odam»). Agar 2-Modul loyiha-kunlari boshqa muddat bilan rejalashtirilgan bo'lsa — sig'im va sabab-gap shunga moslanishi kerak (raqam bir joyda emas, butun darsda: hook · s9 · TEST-yakuniy · arena Q11).
