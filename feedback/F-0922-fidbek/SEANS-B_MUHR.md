# 🔏 MUHRLASH NAVBATI — Seans B (parallel)

> Bu fayl — **vaqtinchalik**. Qonun-fayllar (`MATN_KORPUS.md`, `DARS_ETALON.md`,
> `MATN_ETALONI.md`, `PIPELINE_STATE.md`) ikkala seans uchun umumiy, shuning uchun
> ularga darhol yozilmadi — bir seans yozayotganda ikkinchisi ustidan yozib yuborardi.
> Foydalanuvchi «muhrla» deganda bu yerdagi bloklar o'z fayliga ko'chiriladi.
> Qonun/§ raqamlari **muhrlash paytida** beriladi (narigi seans ham raqam olayotgan bo'lishi mumkin).

Sana: 2026-09-22 · Seans B · Dars: `src/2-Modull/JsVarsLesson.jsx` (M2-03)

---

## 1. `MATN_KORPUS.md` → yangi bo'lim (keyingi bo'sh § — hozircha oxirgisi §195)

```
## <§>. «RAQAM» EMAS, «SON» — number ma'nosida (F-0922-51, mentor topilmasi 22.09)

- ❌ «Qaysi biri RAQAM (number)?» · «Tirnoqsiz — bu raqam» · «Turlar: matn, raqam, boolean»
- ✅ «Qaysi biri SON (number)?» · «Tirnoqsiz — bu son» · «Turlar: matn, son, boolean»

Sabab: **raqam — 0 dan 9 gacha bo'lgan belgi** (ruscha «цифра»), **son — miqdor**
(ruscha «число», inglizcha number). `25` raqam emas, son: u ikki raqamdan tuzilgan.
O'quvchi «raqam» deb o'rgansa, keyin `3.14` yoki `-7` ni «raqam» deyishga uriniladi.

🔧 Tekshiruv: `grep -n "raqam" <fayl>` — har uchrashini savol bilan saralang:
«bu yerda 0–9 belgisi haqida gapyaptimi?» Ha bo'lsa — **raqam to'g'ri** va tegilmaydi
(masalan «O'zgaruvchi nomi raqam bilan boshlansa bo'ladimi?» — bu 0–9 haqida).
Yo'q bo'lsa — **son**.

CHEGARA: «telefon raqami», «eshik raqami (port)», «qator raqami» — bular tartib-belgisi,
son emas; ularga tegilmaydi.

Dalil (nega bu bitta darsning didi emas, tizim): `JsConditionsLesson`, `JsLoopsLesson`,
`JsIntroLesson` allaqachon «son» ishlatadi — `JsVarsLesson` 2-Modulda yolg'iz «raqam»
deb turgan edi va o'z ichida ham qarama-qarshi edi («Qo'shtirnoqsiz son — raqam: 25»).
```

## 2. `MATN_KORPUS.md` → yangi bo'lim (undan keyingi §)

```
## <§>. NAMUNA BITTA JOYDA — yozish topshirig'ida javob takrorlanmasin (F-0922-52, mentor topilmasi 22.09)

O'quvchi kod YOZADIGAN ekranda tayyor namuna **bitta** joyda turadi.

- ❌ Mentor: «…let, keyin nom, = va qo'shtirnoqda ismingiz. **Masalan: `let name = "Aziza"`**»
     + input placeholder: **`let name = "Aziza"`** (ikkalasi bir ekranda)
- ✅ Mentor tuzilmani **so'z bilan** aytadi: «let, keyin nom, = va qo'shtirnoqda ismingiz.»
     Namuna esa faqat **placeholder**da — o'quvchi yoza boshlashi bilan yo'qoladi.

Sabab: yozish topshirig'ida tayyor javob ekranda qolib tursa, o'quvchi uni **ko'chiradi**
— mashq yodda saqlashni emas, ko'zda ko'chirishni o'rgatadi. Placeholder esa birinchi
harf bosilishi bilan o'chadi: namuna yozishni BOSHLASHGA yetadi, ko'chirishga yetmaydi.

CHEGARA: bosqich-chiplar (`1 let/const · 2 nom · 3 = · 4 qiymat`) va pastdagi qoida-izohi
namuna EMAS — ular progress va qoida; ular qoladi.
```

## 3. `DARS_ETALON.md` → yangi raqamli qonun (keyingi bo'sh raqam)

```
### <N>-qonun. KOD MISOLIDAGI O'ZGARUVCHI NOMLARI — INGLIZCHA (F-0922-53, mentor topilmasi 22.09)

O'quvchi ko'radigan **kod** ichidagi o'zgaruvchi nomlari inglizcha bo'ladi:
`name`, `age`, `score`, `city`, `school`, `birth_year`, `lives`, `is_studying`.
O'zbekcha nom (`ism`, `yosh`, `ball`, `tugilgan_yil`) kodga **yozilmaydi**.

- Ko'p so'zli nom **pastki chiziq** bilan: `birth_year`, `is_studying`
  (dars aynan shu qoidani o'rgatadi: «nomda bo'sh joy bo'lmaydi»).
- **Proza-matn o'zbekcha qoladi:** «Ismingizni saqlaydigan o'zgaruvchi yozing»,
  «Yoshni qo'shtirnoqsiz yozing», «O'yinda ball ortib boradi» — bular tushuntirish,
  kod emas. Faqat `mono`/`<Vr>`/backtik ichidagi nom inglizcha bo'ladi.
- Praktika-tekshiruvchi regexlari (`C.js(/let\s+name\s*=/)`) va uy-vazifa paketi
  (`uyga-vazifa/<modul>/<kod>-lms-paket.md`) nom bilan **birga** o'zgaradi —
  aks holda o'quvchi to'g'ri yozadi, tekshiruvchi qabul qilmaydi.

Sabab: o'quvchi keyingi darsda (`JsConditionsLesson`) `age`, `score`, `price`, `grade`
ko'radi — nom tili dars o'rtasida almashsa, u buni **yangi qoida** deb o'ylaydi.
Haqiqiy JS kodi ham inglizcha yoziladi: bu dars birinchi odatni qo'yadi.

🔧 Tekshiruv: `grep -oE "<Vr>[a-z_]+</Vr>|(let|const) [a-z_]+" <fayl> | sort -u` —
ro'yxatda o'zbekcha so'z chiqmasin.
```

## 4. `MATN_ETALONI.md` → LUG'AT jadvaliga bitta qator

```
| raqam (number ma'nosida) | son | raqam = 0–9 belgisi (цифра), son = miqdor (число/number); `25` bitta raqam emas, son. 0–9 belgisi haqida gap ketsa «raqam» to'g'ri qoladi (JsVars, F-0922-51, 2026-09-22) |
```

## 5. `til-lint-rules.json` → tor qoida taklifi (grep-lanadigan shakl)

Butun «raqam» so'zini taqiqlab bo'lmaydi (0–9 ma'nosida u to'g'ri). Shuning uchun
faqat **number bilan yonma-yon** kelgan shakl tutiladi:

```json
{
  "id": "son-emas-raqam",
  "severity": "error",
  "pattern": "(?i)raqam[a-z]*\\s*\\(number\\)|number\\s*\\(raqam[a-z]*\\)",
  "suggest": "number ma'nosida «son» yoziladi — «raqam» 0–9 belgisi (цифра). KORPUS: «RAQAM» EMAS, «SON»"
}
```

> Qoida faylga qo'shilgach: `npm run lint:til src/2-Modull/JsVarsLesson.jsx` — 0 yangi error bo'lishi shart.

---

## 6. `PIPELINE_STATE.md` → raund-yozuv

```
### 2026-09-22 · Seans B · JsVarsLesson (M2-03) — mentor fidbeklari F-0922-51/52/53

**F-0922-51 — «raqam» → «son».** Mentor: «Qaysi biri son (number) bo'lishi kerak,
chunki raqam deb 0 dan 9 gacha aytiladi». Tashxis: so'z darsda 30 satrda, ~34 ko'rinadigan
joyda edi; qo'shni darslar (JsConditions/JsLoops/JsIntro) allaqachon «son» ishlatardi.
Qilindi: 36 almashtirish (sarlavha, mentor matni, flashkarta, arena, nishon, praktika brifi,
uy-vazifa paketi). TEGILMADI: «O'zgaruvchi nomi raqam bilan boshlansa bo'ladimi?» (0–9 ma'nosi)
va ovoz-matni (ovoz ishlatilmaydi).

**F-0922-52 — namuna takrori.** Mentor: «Namunani bittasi qolsin — hamma joyda qanaqa
qilinishi yozilgan». s15 (yakuniy yozish) ekranida `let ism = "Aziza"` ikki joyda edi:
Mentor matni + input placeholder. Qilindi: Mentordagi «Masalan: …» olindi (uz+ru),
placeholder qoldi — u yoza boshlaganda yo'qoladi. Chiplar va qoida-izohi tegilmadi.

**F-0922-53 — o'zgaruvchi nomlari inglizcha.** Mentor: «nomlarini inglizcha ishlatish kerak».
Qilindi: `ism→name` · `yosh→age` · `ball→score` · `tugilgan_yil→birth_year` · `shahar→city` ·
`maktab→school` · `jon→lives` · `oqiyaptimi→is_studying` (kod-konteksti; proza o'zbekcha qoldi).
Ehtiyot nuqtasi: `ball` so'zi faylda 49 marta — 26 tasi kod, qolgani darsning O'Z ball
tizimi («15 ball», «0 ball») — ularga tegilmadi.
Birga o'zgardi: `uyga-vazifa/2-Modull/m2-03-jsvars-lms-paket.md` (11 joy, uz+ru),
`_prac-smoke.mjs` (sinov kiritmasi), `src/hw-qa/data.js` (qayta yig'ildi — faqat m2-03 satri).

**Darvozalar:** esbuild ✓ · jsx ✓ · keys ✓ · prompt ✓ · dark 🔴6 · til 🔴4/🟡5 —
oxirgi ikkisi **bazada ham aynan shunday** (tegilmagan nusxada tekshirildi): yangi topilma 0.
**Ko'z bilan:** s13 (SON savoli) · s16 (yakuniy yozish, uz+ru) · s14 (bloklar) · s11 (turlar) ·
s19 (uy-vazifa ro'yxati) — skrinshot bilan ko'rildi, dizayn o'zgarmagan.
**Tekshirilmagani:** praktika-kompilyator modali skrinshot-muhitida ochilmadi (ilova
qobig'ini talab qiladi) — shartlar `C.js` regexlari kod ichidan o'qib sinaldi:
yangi yechim ✓, eski nom ✗ (kutilgan).
```

---
---

# 🔏 Ikkinchi dars — `ReactIntroLesson` (M3-01) · 2026-09-22

## 7. `MATN_KORPUS.md` → yangi bo'lim

```
## <§>. FLASHKARTA FAQAT DARSDA O'RGATILGAN SO'ZNI SO'RAYDI (F-0922-57, mentor topilmasi 22.09)

Takrorlash kartasining javobi — dars **asosiy oqimida** aytilgan so'z bo'lishi shart.
Ixtiyoriy joyda turgan so'z o'rgatilgan hisoblanmaydi.

Asosiy oqim = sarlavha · Mentor matni · ta'rif-kartasi · ekran matni.
Asosiy oqim EMAS: (a) RECAPS oynasi — tugma bosilsa ochiladi; (b) test javob-izohlari
(`explainWrong`) — faqat o'sha variantni tanlagan o'quvchi ko'radi; (c) yakuniy ro'yxat —
u flashkartadan KEYIN keladi; (d) ovoz-matni.

- ❌ ReactIntro: karta «React nima qurish uchun ishlatiladi? → **Interfeys**», lekin ta'rif
  «React — **saytni** tayyor bo'laklardan qurishga yordam beradigan JavaScript kutubxonasi»
  der edi. «Interfeys» faqat RECAPS'da, izohlarda va yakunda bor edi.
- ✅ Ta'rifning o'ziga kiritildi: «React — saytning **ko'rinadigan qismini, ya'ni interfeysni**,
  tayyor bo'laklardan qurishga yordam beradigan JavaScript kutubxonasi».

🔧 Tekshiruv: har flashkarta javobi uchun `grep -n "<javob>" <fayl>` — topilgan satrlar
RECAPS/`explainWrong`/yakun bo'lsa, so'z **o'rgatilmagan**: yo ta'rifga kiriting, yo kartani
almashtiring. Yangi atamani kartaga qo'yishdan oldin ham shu tekshiruv.
```

## 8. `MATN_KORPUS.md` → yana bir bo'lim

```
## <§>. KARTA SAVOLI BITTA JAVOBGA OLIB BORSIN (F-0922-58/59/60, mentor topilmasi 22.09)

Takrorlash kartasi savolida (a) kontekst, (b) nimaning haqida ekani, (c) qanday turdagi
javob kutilayotgani bo'lishi kerak — aks holda bola to'g'ri o'ylab ham «xato» javob beradi.

- ❌ «Tayyor asboblar to'plami qanday ataladi?» → paket? dastur? to'plam? (React aytilmagan)
- ✅ «**React kabi** tayyor asboblar to'plami qanday ataladi?» → Kutubxona (library)

- ❌ «React xotirasida saqlaydigan yengil nusxa qanday ataladi?» — NIMANING nusxasi?
- ✅ «React **sahifaning** yengil nusxasini xotirada saqlaydi — u qanday ataladi?» → Virtual DOM
  (darsdagi Mentor gapining aynan o'zi — karta va dars bir xil gapiradi)

- ❌ «React bilimi bilan telefon ilovasi yasash **nima deyiladi**?» — ISH nomini so'raydi,
  javob esa MAHSULOT nomi (React Native): savol va javob turi mos emas.
- ✅ «React bilimi bilan telefon ilovasi yasaydigan **vositaning nomi** nima?» → React Native

CHEGARA: savolni aniqlashtirish uchun darsda YO'Q so'z kiritilmaydi. «framework» atamasi
ReactIntro'da umuman ishlatilmagan (grep 0) — shuning uchun «vosita» ishlatildi; u dars
izohida allaqachon bor («React Native — telefon ilovalarini qurish vositasi»).
```

## 9. `MATN_ETALONI.md` → LUG'AT / konvensiya qatori

```
| Kutubxona · Komponent · Interfeys (yolg'iz) | Kutubxona (library) · Komponent (component) · Interfeys (interface) | takrorlash kartasida atama inglizcha originali bilan beriladi — o'quvchi keyin real hujjat va darsliklarda aynan shu so'zni uchratadi (ReactIntro, F-0922-58, 2026-09-22) |
```

## 10. `.claude/agents/role/darslik-tekshiruvchi.md` → yangi ov-bandi

```
- **Sudrash/tartiblash ro'yxatida takror `key`.** `DragDropOrder` kabi komponentlarda
  element ikki joyda (ro'yxat + katak) qolib ketadigan yo'l bormi? Tekshiruv: `place()`
  reduceriga «o'z katagiga qayta tashlash» holatini bering (`from === slotIdx`) —
  natijada elementlar soni boshlang'ichdan ko'p bo'lmasligi shart.
  Manba: F-0922-54 (ReactIntro 17-ekran, mentor topdi; 40 faylda bir xil satr).
```

## 11. `PIPELINE_STATE.md` → raund-yozuv

```
### 2026-09-22 · Seans B · ReactIntroLesson (M3-01) — mentor fidbeklari F-0922-54…60

**F-0922-54 🔴 xato — sudrash bloki takrorlanadi.** `place()` da `if (occ)` sharti o'z
katagiga qaytarilgan blokni ham «siqib chiqarilgan» deb hisoblardi → blok ham katakda,
ham ro'yxatda qolardi. Tuzatildi: `if (occ && occ !== id)`. Mantiq koddan ko'chirib
alohida sinaldi — 6 holat, takrorsiz/yo'qotishsiz. Bir xil satr yana **39 faylda** —
`KATTA_TOZALASH.md` §43 ga yozildi (bu yerda tuzatilmadi).

**F-0922-55 ⚪ takrorlanmadi.** Mentor rasmida kod qatorlari ustma-ust tushgan. Ekran
ochib, xato qator bosilib, skrinshot olindi — uch qator ham alohida; JSX har qatorni bir
marta chizadi, CSS `flex-direction: column` + `gap`. Ehtimol ekran-olish artefakti
(bayram animatsiyasi paytidagi kadr). Foydalanuvchiga aytildi, band ochiq qoldirildi.

**F-0922-56 — maket «chiroyliroq primer».** `Screen13` o'ng ustunidagi sayt maketi real
skin-do'konga o'xshatildi: piksel-teksturali skin rasmi + nom + «♥ 12 · 12 000 so'm» +
«Savatga» tugmasi (keyingi ekrandagi `<Savat />` bilan bitta ip), qidiruv maydoni ramka
bilan, footer'ga «Aloqa · Yordam». Bloklar tarkibi va mexanika o'zgarmadi.

**F-0922-57 — «interfeys» o'rgatilmagan edi.** So'z faqat RECAPS, `explainWrong` va yakuniy
ro'yxatda bor edi; flashkarta esa uni javob deb so'rardi. `Screen3` ta'rifiga kiritildi.

**F-0922-58/59/60 — flashkarta savollari.** «Tayyor asboblar to'plami…» → «React kabi tayyor
asboblar to'plami…»; Virtual DOM savoli darsning o'z Mentor gapiga moslandi; React Native
savoli endi VOSITA nomini so'raydi. Atamalar: Interfeys (interface) · Kutubxona (library) ·
Komponent (component) — izchillik uchun uchtasi ham. «framework» ISHLATILMADI: u darsda yo'q.

**Darvozalar:** 6/6 toza (esbuild · jsx · keys · dark · til · prompt).
**Ko'z bilan:** s3 (yangi ta'rif) · s14 (yangi maket, 5 blok qo'yib) · s16 (sudrash, 4 blok) ·
s18 (flashkarta «Interfeys (interface)») — skrinshot bilan ko'rildi.
```

---
---

# 🔏 Oltinchi dars — `PracticeLesson3` (M2-05) · 2026-09-22

> ⚠️ Bu banddagi **`til-lint-rules.json` qoidasi allaqachon QO'YILGAN** (foydalanuvchi
> buyrug'i bilan) — muhrlashda takror qo'shilmasin. Qolgan ikki band navbatda.

## 18. `MATN_ETALONI.md` → LUG'AT jadvaliga bitta qator

```
| vasvasaga berilib | eng oson yo'lni tanlaymiz / o'ylab o'tirmay / shoshib | «vasvasa» — kitobiy-diniy registr; o'smir lug'atida yo'q va ma'nosi noaniq qoladi. Niyat to'g'ridan-to'g'ri aytiladi (PracticeLesson3 s0, F-0922-64, 2026-09-22) |
```

## 19. `MATN_KORPUS.md` → yangi bo'lim

```
## <§>. XATONI ATAYLAB QILAYOTGANDA — NIYATNI SODDA SO'Z BILAN AYTING (F-0922-64, mentor topilmasi 22.09)

Dars ataylab noto'g'ri yo'ldan boradigan ekranda («mana shunday qilsak nima bo'ladi?»)
niyat o'quvchiga tushunarli, kundalik so'z bilan aytiladi.

- ❌ «**Vasvasaga berilib**, AI'ga rejasiz "do'kon yasab ber" deb yuboramiz.»
- ✅ «**Eng oson yo'lni tanlaymiz**: AI'ga rejasiz "do'kon yasab ber" deb yuboramiz.»

Sabab: «vasvasa» kitobiy-diniy registrdan — o'smir uni lug'atidan bilmaydi, ma'nosini
kontekstdan ham topolmaydi. Natijada gap «bilib turib oson yo'lga ketdik» degan
PEDAGOGIK ma'nosini yo'qotadi, holbuki keyingi savol («bu yetarlimi?») aynan shunga tayanadi.

CHEGARA: «shoshib» ham sodda, lekin xatoni TASODIFga aylantiradi — bu ekranda xato
ataylab qilinadi, shuning uchun tanlov-fe'li kerak.

🔧 Darvoza: `til-lint-rules.json` → `kitobiy-vasvasa` (error) — 2026-09-22 da qo'yildi.
Sinovdan o'tdi: `PmLesson34.jsx:560` dagi tegilmagan nusxani to'g'ri tutdi.
```

## 20. `PIPELINE_STATE.md` → raund-yozuv

```
### 2026-09-22 · Seans B · PracticeLesson3 (M2-05) — F-0922-64

**Mentor:** «Vasvasaga berilim #changeText». Tekshirildi: so'z `src/2-Modull/PracticeLesson3.jsx:839`
(Screen0 hook) da. Til-lintning 92 qoidasi ichida uni tutadigan qoida YO'Q edi —
mentor topdi, darvoza topmadi.

Qilindi: uz «Vasvasaga berilib, AI'ga rejasiz…» → «**Eng oson yo'lni tanlaymiz**: AI'ga
rejasiz…»; ru «Поддадимся соблазну и без плана…» → «**Пойдём по самому простому пути**:
без плана…». **`til-lint-rules.json` ga `kitobiy-vasvasa` qoidasi qo'shildi** (92 → 93,
severity: error) — foydalanuvchi buyrug'i bilan to'g'ridan-to'g'ri, diff 8 satr (toza
qo'shimcha, qayta formatlash yo'q).

**Qoida sinovdan o'tdi:** tuzatilgan darsda 0 topilma; `PmLesson34.jsx:560` (7-Modul,
TEGILMADI) dagi nusxani esa to'g'ri tutdi — ya'ni qoida tirik, bo'sh emas.

**Darvozalar:** esbuild ✓ jsx ✓ keys ✓ prompt ✓ · dark 🔴7 va til 🔴2/🟡8 — bazada
(yangi qoida bilan) 🔴3 edi, ya'ni **mening tuzatishim bitta xatoni yopdi**, qolgani eski
qarz («usta/sandiqcha» 864, «professional» 1268). **Ko'z bilan:** s0 skrinshot ✓.

**Aytib qo'yiladi:** yangi qoida umumiy — endi «vasvasa» bo'lgan har qanday dars til-lintda
qizil beradi. Loyihada bunday yagona joy qoldi: `PmLesson34.jsx:560` (7-Modul, chetga surilgan).
```

---
---

# 🔏 Qo'shimchalar · 2026-09-22 kech

## 21. `MATN_ETALONI.md` → LUG'AT qatori (F-0922-65)

```
| ha/yo'q (boolean ta'rifida) | rost/yolg'on | `true/false` — javob emas, rost-yolg'onlik. «Ha/yo'q» savolga javob beradi, shart esa savol emas — DA'VO: `yosh > 18` natijasi «ha» emas, «rost». Loyiha konvensiyasi ham shu: rost/yolg'on 118 marta, ha/yo'q 10 marta (JsVars, F-0922-65, 2026-09-22) |
```

## 22. `MATN_KORPUS.md` → yangi bo'lim (F-0922-65)

```
## <§>. ATAMA BIRINCHI UCHRAGAN DARSDA KEYINGI DARS BILAN BIR XIL BO'LSIN (F-0922-65, mentor topilmasi 22.09)

Tushuncha BIRINCHI marta o'rgatilgan darsdagi nom — keyingi darslarda ishlatiladigan
nom bilan aynan bir xil bo'lishi shart. Aks holda o'quvchi ikkinchi nomni YANGI
tushuncha deb oladi.

- ❌ `JsVarsLesson` (boolean birinchi marta): «**Ha/yo'q** — boolean», «true (ha) yoki false (yo'q)»
     `JsConditionsLesson` (keyingi dars): «**rost** (true)», «**yolg'on** (false)» — 26 marta
- ✅ ikkalasida ham: «**Rost/yolg'on** — boolean», «true (rost) yoki false (yolg'on)»

Bu darsning ICHIDA ham ziddiyat bor edi: 10-ekran «ha/yo'q» derdi, o'sha darsning
takrorlash kartasi esa «faqat ikki qiymat: rost yoki yolg'on». Ya'ni o'quvchi bitta
darsda ikki nom ko'rardi.

🔧 Tekshiruv: yangi atama kiritilayotganda `grep -rc "<atama>" src/` bilan loyihadagi
ustun shaklni toping — yangi dars ozchilikka qo'shilmasin. (Bu F-0922-51 «raqam→son»
bilan bir sinf: o'sha darsning o'zi butun modulda istisno bo'lib qolgan edi.)

CHEGARA: ma'lumotlar bazasi ustuni ma'nosidagi «ha/yo'q» («Joy bandmi? ha/yo'q»,
4-Modul) — boshqa kontekst, tegilmaydi.
```

## 23. `PIPELINE_STATE.md` → raund-yozuvga qo'shimcha

```
### 2026-09-22 · Seans B · qo'shimchalar

**F-0922-61 davomi:** `PmLesson1` da «Yandex Taxi» → **«Yandex Go»** (4 joy, uz+ru) —
O'zbekistondagi hozirgi rasmiy nom. Manzil `taxi.yandex.uz` qoldirildi (haqiqiy domen).

**F-0922-65 — boolean «ha/yo'q» → «rost/yolg'on».** Mentor «rost yolg'on» deb yozgan.
Tekshiruv uni tasdiqladi: (1) dars O'Z ICHIDA ziddiyatli edi — 10-ekran «ha/yo'q»,
o'sha darsning flashkartasi «rost yoki yolg'on»; (2) keyingi dars `JsConditionsLesson`
«rost (true)» ni 26 marta ishlatadi; (3) loyiha bo'ylab rost/yolg'on 118, ha/yo'q 10.
Qilindi: `JsVarsLesson` da 6 almashtirish (tur nomi · tavsif · mentor matni · 2 javob-izohi,
uz+ru). RU: «Да/нет» → «Истина/ложь». Darvozalar o'zgarmadi (til 🔴4/🟡5 — baza bilan bir xil).
Ko'z bilan: 12-ekran, karta ochilgan holatda skrinshot ✓.
**Tegilmadi:** 4-Modulda 6 ta «ha/yo'q» bor, lekin ular MB-ustuni ma'nosida.
```

---
---

# 🔏 Yettinchi dars — `JsFunctionsLesson` (M2-04) · 2026-09-22

## 24. `DARS_ETALON.md` → yangi raqamli qonun (keyingi bo'sh raqam)

```
### <N>-qonun. KOD TEKSHIRUVI TO'G'RI JAVOBNI RAD ETMASIN — KALIT SO'Z QAT'IY, NOM VA QIYMAT ERKIN (F-0922-66, mentor topilmasi 22.09)

O'quvchi yozgan kod tekshirilganda ikki narsa ajratiladi:

**QAT'IY qoladi** — JavaScript'ning o'zi talab qiladigan narsa:
- kalit so'zlar faqat kichik harfda: `function`, `return`, `let`, `const`, `if`
- kalit so'zdan keyin IDENTIFIKATOR kelsa — probel majburiy (`return a` ✓ · `returna` ✗)

**ERKIN bo'ladi** — kod baribir to'g'ri ishlaydigan narsa:
- nom va parametrlarning katta-kichik harfi: `function Salom()` · `zarar(Kuch)`
- qiymat-matnning harfi: `return "salom!"` = `return "Salom!"`
- kalit so'zdan keyin QAVS yoki QO'SHTIRNOQ kelsa — probel ixtiyoriy (`return"Salom!"` ✓)
- amallar atrofidagi probellar: `kuch*3` = `kuch * 3` = `3 * kuch`

🔧 Amalda: `/i` bayrog'ini BUTUN regexga qo'ymang — u kalit so'zni ham erkin qilib
yuboradi va `RETURN "salom"` kabi YAROQSIZ kod o'tib ketadi. Faqat erkin bo'lishi
kerak bo'lgan qismga harf-sinfi yozing:
❌ `/return\s+["']Salom!?["']/i`      → `RETURN "salom"` ni ham qabul qiladi
✅ `/return\s*["'][sS][aA][lL][oO][mM]!?["']/` → `return` qat'iy, qiymat erkin

Sabab: bola to'g'ri JavaScript yozadi, chiroq esa yonmaydi va nega ekani aytilmaydi —
bu eng tushkun holat. Mentor uchta misolda tutdi: kichik harfli «salom», probelsiz
`return"Salom!"`, katta harfli `Kuch * 3`.

🔧 Qabul-sinovi (har yangi kod-tekshiruvga): 3 ta TO'G'RI variant (kichik · katta ·
probelsiz) o'tishi SHART; 3 ta YAROQSIZ variant (`RETURN`, `Function`, `returna`)
rad etilishi SHART.
```

## 25. `PIPELINE_STATE.md` → raund-yozuv

```
### 2026-09-22 · Seans B · JsFunctionsLesson (M2-04) — F-0922-66

**Mentor:** «probellar, katta harfda yozishlar to'g'rilash kerak · kichik harf bilan salom
deb qiymat qaytarsa qabul qilmayapti · Kuch * 3 yozsak dostup berdi».

Tashxis (regexlar fayldan o'qib sinaldi): to'rt mashqning HAMMASI harfma-harf tekshirardi —
`return "salom!"` RAD, `return"Salom!"` RAD, `function Salom()` RAD, `zarar(Kuch)` RAD.
Hammasi to'g'ri JavaScript.

Qilindi: **9 ta tekshiruv** yumshatildi (1-mashq salom · 2-mashq qosh(a,b) · 3-mashq
chaqirish · yakuniy kuch*3). `/i` bayrog'i ATAYLAB ishlatilmadi — u `RETURN`/`Function`
kabi yaroqsiz kodni ham o'tkazib yuborardi; o'rniga harf-sinfi (`[sS][aA][lL][oO][mM]`).
`return` dan keyingi probel: qo'shtirnoq oldida ixtiyoriy, identifikator oldida majburiy.

**Sinov (avtomatik, regexlar fayldan o'qib):** 6 blok · to'g'ri variantlar ✓ qabul,
yaroqsiz uchtasi (`RETURN "Salom!"` · `Function salom()` · `returna + b`) ✗ rad — ya'ni
yumshatish kerakli joyda bo'ldi, kalit so'zlar qat'iy qoldi.
**Ko'z bilan (haqiqiy yozib):** `function salom(){return"salom!"}` → 6/6 yashil,
«To'g'ri yozdingiz!» · `function zarar(Kuch){ return Kuch * 3 }` → 6/6 yashil,
«Return Master» nishoni, natija `zarar(4) → 12`.

**Darvozalar:** esbuild ✓ jsx ✓ keys ✓ til ✓ prompt ✓ · dark 🔴5 — bazada ham 5.

**Qamrov:** bu `ok: /…/` naqshi loyihada FAQAT shu darsda (grep: 1 fayl) — sivirma
shart emas. Yonidagi sinf: praktika-kompilyatorining `C.js(/…/)` tekshiruvlari —
**15 ta, 6 faylda** (masalan `let name`, `let score`). Ular ham katta-kichik harfga
qat'iy, lekin mentor ulardan shikoyat qilmagan; qaror foydalanuvchida.
```
