# LMS jamoasiga — 2-raund sinov natijasi: **manzil yo'li ISHLADI**

**Kimdan:** Darslik-platforma jamoasi · **Kimga:** LMS (Coddy Camp) IT jamoasi
**Nimaga javoban:** «SINOV QO'LLANMASI — umumiy modulni nom orqali ulash»

---

## Qisqacha

**Eng muhim ikki talab yopildi: T-1 (manzil orqali import) va T-2 (bitta React).**
Rahmat — bu ish bo'lgan.

Ammo bitta chalkashlik bor va uni darhol aytamiz: **sizning qo'llanmangizdagi
holat jadvali eskirgan.** Unda «manzil orqali import — hali chiqarilmagan» deb
yozilgan, biz esa aynan shu yo'l bilan sinadik va u **ishladi**.

Modul hali ro'yxatga qo'yilmagani uchun **nom yo'li** (`@shared/…`) tekshirilmadi —
u hozir texnik jihatdan ham mumkin emas. Buni pastda dalil bilan ko'rsatamiz.

---

## 1. Nima ko'rindi — sinov natijasi

Sinov darsi LMSda ochildi. Ekranda:

```
LMS tashqi-modul sinovi
React versiyasi: 18.3.1 · dars: lms-sinov-01

✅ T-1  — Modul yuklandi
✅ T-1b — checks eksporti keldi
✅ T-1c — Versiya o'qildi: 1.0.0
✅ T-2a — Darsda React bor

[TASHQI MODUL YUKLANDI]
Sinov moduli ishlayapti
Versiya 1.0.0 · checks: nomi, bor, soni
[Bosing — hisob: 4]
✅ React BITTA nusxada — hook ishladi (hisob 4)
checks.bor("<h1>Salom</h1>", "<h1>") → true
```

Konsolda xato yo'q. Surat ilova qilinadi.

| Talab | Oldingi holat | Hozir |
|---|---|---|
| **T-1** — manzil orqali import | 🔴 «Modul topilmadi» | ✅ **bajarildi** |
| **T-2** — 🔴 bitta React | ⏸ tekshirib bo'lmagan | ✅ **bajarildi** — tugma sanadi, `Invalid hook call` yo'q |
| T-1b — nomli eksportlar (`checks`) | ⏸ | ✅ |
| T-1c — `SINOV_VERSIYA` o'qildi | ⏸ | ✅ |

**T-2 biz uchun eng qo'rqinchli band edi** — agar modul o'z React nusxasini olsa,
butun g'oya quladi. Siz «tuzilma darajasida kafolatlanadi» deb yozgan edingiz;
endi bu ishonch emas, **ko'rilgan fakt**. Rahmat.

---

## 2. 🔴 Jadvalingiz eskirgan — buni bilib qo'ying

Qo'llanmangizning 1-bo'limida:

> LMS: nom orqali import — ❌ hali chiqarilmagan
> LMS: **manzil** orqali import — ❌ hali chiqarilmagan

Ikkinchi qator noto'g'ri. Ikki dalil:

1. Biz yuklagan sinov darsining import satri — **manzil ko'rinishida**:
   `import SinovModul, { checks, SINOV_VERSIYA } from 'https://go.coddycamp.uz/uploads/course_artifacts/2270fa1dcbebe770b3b8158dc8ff3265.jsx';`
2. Ro'yxatni bugun o'zimiz so'radik va u **bo'sh**: `{"modules":{}}`. Ya'ni
   `@shared/html-compiler` yozilgan bo'lsa ham **yechilmasdi**. Demak ishlagan
   narsa — aynan manzil yo'li.

**Bu ayb izlash emas.** Lekin ikki safar «tayyor / tayyor emas» bo'yicha
chalkashib qoldik va har safar bir necha kun yo'qotdik. Shuning uchun bitta
kichik so'rovimiz bor — pastda **S-5**.

---

## 3. Server tomonini bugun o'zimiz o'lchadik

### Ro'yxat — deyarli toza ✅

```
GET https://go.coddycamp.uz/modules/registry.json

HTTP 200
Content-Type: application/json; charset=utf-8    ✅
Cache-Control: no-cache                          ✅  (bizning 3.1 so'rovimiz)
Access-Control-Allow-Origin: *                   ✅
Javob: {"modules":{}}                            — bo'sh, modul yuklanmagan
```

Bo'sh javob to'g'ri — siz aynan shunday bo'lishini yozgansiz.

### Modul fayli — bitta yetishmovchilik 🔴

```
GET https://go.coddycamp.uz/uploads/course_artifacts/2270fa1d….jsx

HTTP 200
Content-Type: text/javascript; charset=utf-8     ✅
Access-Control-Allow-Origin: *                   ✅
ETag + Last-Modified                             ✅
Content-Length: 2862                             ✅ (biz yuklaganday, o'zgarmagan)
Cache-Control:                                   🔴 UMUMAN YO'Q
```

Qo'llanmangizning 4-bo'limida kutilgani deb `cache-control: public,
max-age=31536000, immutable` yozilgan. Bu sarlavha joriy manzilda **yo'q**.

Ehtimol u faqat `/uploads/shared_modules/` yo'liga sozlangan (biz sinagan fayl
`course_artifacts` da turibdi) — shunday bo'lsa hammasi joyida. Faqat aniqlik
kerak, chunki **butun «nom» sxemasining tejami aynan shu sarlavhaga suyanadi**:
modul bir yilga keshlanmasa, u har dars ochilishida qayta so'raladi va
sxemaning asosiy afzalligi yo'qoladi. Bu — **S-2**.

---

## 4. Savollar — nomerlangan, punkt-punkt javob bersangiz yetarli

### S-1. Modul fayli JSX-kompilyatsiyasidan o'tadimi?

Siz «ichkarida fayl `.jsx` sifatida saqlanadi» dedingiz. Savol: u bajarilishdan
oldin **JSX deb tahlil qilinadimi**, yoki to'g'ridan-to'g'ri bajariladimi?

Sinov moduli 3 KB va ichida JSX yo'q — farqi sezilmaydi. **Haqiqiy kompilyator
esa ~110 KB**, ichida `a < b`, `x > y` kabi taqqoslashlar ko'p. Agar kengaytma
tufayli u JSX deb tahlil qilinsa: (a) har dars ochilishida ortiqcha ish,
(b) noto'g'ri tahlil xavfi.

Bizga kerak bo'lgan javob: **modul sof JavaScript sifatida bajariladi** —
shundaymi?

### S-2. `shared_modules` yo'lida `Cache-Control` bormi?

3-bo'limga qarang. Modul nashr qilingach biz o'zimiz o'lchaymiz, lekin oldindan
bilsak yaxshi: o'sha yo'lga `public, max-age=31536000, immutable` sozlanganmi?

### S-3. `registry.json` — statik faylmi yoki PHP-javobmi?

Javob bilan birga `Set-Cookie: PHPSESSID=…` kelyapti. Bugun zarari yo'q. Lekin
ertaga ro'yxat oldiga CDN yoki kesh qo'yilsa, sessiya-cookie'li javob muammoli
sinfga tushadi. Shunchaki bilib qo'yishimiz uchun so'rayapmiz — o'zgartirish
talab qilmaymiz.

### S-4. Nomni tasdiqlaymiz + kim yuklaydi

**`html-compiler`** — rozimiz, shu qolsin. Darsda `@shared/html-compiler`.

Yuklash haqida: bizda CRM'ning «Umumiy modullar» sahifasiga kirish yo'q. Ikki
variantdan qaysi biri qulay bo'lsa:

- **(a)** bizga kirish huquqi berilsin — o'zimiz yuklaymiz va nashrlarni
  o'zimiz boshqaramiz (haftasiga 1–2 nashr rejalashtirilgan, har safar sizni
  bezovta qilmaganimiz ma'qul);
- **(b)** biz fayl yuboramiz, siz yuklaysiz.

**(a)** ni tavsiya qilamiz. Qaysi bo'lsa ham — **hozir sinov modulini
(`2270fa1d….jsx`, 2862 bayt, allaqachon sizda) `html-compiler` emas, alohida
`sinov-modul` nomi bilan ro'yxatga qo'ying.** Ro'yxat bo'sh turganda N-test
1/3/5/6/7 ning birortasini ham yurgiza olmaymiz.

### S-5. Chiqarish belgisi — takror chalkashmaslik uchun

Ikki marta noto'g'ri holatda sinadik. Buning oldini oladigan eng arzon yo'l:
**«chiqarildi» deganda bitta aniq belgi ham aytilsin.** Masalan:

- qaysi manzilda sinash kerak (`lms.coddycamp.uz` — shu, to'g'rimi?),
- `LessonRunner…` faylining joriy xeshi yoki chiqarish sanasi/versiyasi.

Shunda biz ekranda ko'rgan buildni siz aytgan build bilan solishtira olamiz va
«biz noto'g'ri joyni sinadikmi?» degan savol boshqa chiqmaydi. Xuddi shu belgi
sizning «avtomatik sinovlar 23/23 o'tdi» xabaringizga ham bog'lansa — biz qaysi
build tekshirilganini aniq bilamiz.

### S-6. React 18.3.1 — bu qat'iymi?

Ekranda `React versiyasi: 18.3.1` chiqdi. Bu biz uchun **yangi ma'lumot** edi va
foydali bo'ldi.

Bizning tomonda React 19 turibdi. Tekshirdik: kompilyator faqat klassik hook'lar
(`useState`, `useEffect`, `useLayoutEffect`, `useRef`, `useMemo`,
`isValidElement`) ishlatadi, ya'ni **18 bilan to'la mos**. Muammo yo'q.

So'rov: **18 dan 19 ga o'tish rejangiz bo'lsa — oldindan ayting.** Biz modulni
ikkalasida ham sinaymiz va mos qilib turamiz. Kutilmaganda o'zgarsa — modul
bitta bo'lgani uchun barcha darslarga birdan tegadi.

### S-7. 3.5 (kompilyator kerak bo'lganda yuklansin) — **yopamiz**

Sizning tushuntiringiz to'g'ri: dinamik import ikkinchi React nusxasini keltiradi
va T-2 buziladi; alohida yuklovchi esa dars yozish qoidasini o'zgartiradi
(praktika ekranida «yuklanmoqda» holati paydo bo'ladi). Foydasi shu narxga
arzimaydi. **Bu bandni talablar ro'yxatidan olib tashlaymiz** — qaytib
ko'tarmaymiz.

---

## 5. O'zimizning ikki xatoni tuzatamiz

Biz sizdan aniqlikni talab qildik, shuning uchun o'z raqamlarimizni ham
tuzatamiz.

**a) Fayl hajmi.** Javobimizning 4-bo'limida «dars fayllari ~400 KB dan
~100 KB ga tushadi» deb yozganmiz. **Bu xato.** O'lchadik:

| | Haqiqiy |
|---|---|
| Yig'ilgan dars fayli (hozir, kompilyator ichida) | ~400 KB |
| Kompilyatorning ulushi | ~75–110 KB |
| **Nom yo'lida bo'ladigan hajm** | **~330 KB** |

Ya'ni yutuq ~18%, biz aytgan 75% emas. Kechirasiz. Bu ishning asosiy sababini
o'zgartirmaydi (bitta joyda tuzatish — hamma darsda ishlaydi), lekin siz
noto'g'ri raqamga tayanmasligingiz kerak.

**b) Darslar soni.** Turli hujjatlarda 28 va 18 deb yozilgan. Sanadik: kompilyator
ishlatadigan darslar — **19 ta** (1-, 2- va 3-modullarda). Nosoz nashr birdan
shu 19 tasiga tegadi.

---

## 6. N-testlar holati

| Test | Holat |
|---|---|
| **N-test 2 — bitta React** | ✅ **o'tdi** (manzil yo'lida). Nom yo'li chiqqach qayta yuritamiz — 2 daqiqa |
| N-test 1 — nom bilan yuklanish | ⏸ ro'yxat bo'sh (S-4) + LMS chiqarilmagan |
| N-test 3 — kesh (modul 1 marta, ro'yxat 1 marta) | ⏸ o'sha sabab |
| N-test 4 — yangilanish | ⏸ o'sha sabab |
| N-test 5 — orqaga qaytarish | ⏸ o'sha sabab |
| N-test 6 — versiyaga qotirish (`@…@3`) | ⏸ kamida 2 ta nashr kerak |
| N-test 7 — noma'lum nom | ⏸ o'sha sabab |
| N-test 8 — haqiqiy dars | ⏸ **bizda ish bor** (7-bo'lim) |
| N-test 9 — eskilar buzilmadi | ⏳ biz yuritamiz, javob beramiz |
| N-test 10 — ro'yxat ishlamaganda | sizda |

---

## 7. Biz nima qilamiz

1. **Haqiqiy kompilyatorni JSX'siz sof ESM ga aylantiramiz** (~110 KB, faqat
   `react` ni import qiladi, eksportlar: `default` + `checks`). S-1 javobiga
   qarab tayyorlaymiz.
2. **Nom ko'rinishidagi sinov dars faylini** beramiz (va'da qilganimizdek).
3. **N-test 9** ni o'z tomonimizdan yuritamiz — tashqi modul ishlatmaydigan
   darslar avvalgidek ochilishini tasdiqlaymiz.
4. Modulni React 18 va 19 da sinaymiz (S-6).

---

## 8. Tartib — taklif

1. **Siz:** S-1…S-6 ga qisqa javob + sinov modulini ro'yxatga qo'yasiz (S-4).
2. **Biz:** ro'yxat to'lgach uni darhol o'lchaymiz (sarlavhalar, S-2).
3. **Siz:** LMS'ni chiqarasiz va chiqarish belgisini aytasiz (S-5).
4. **Biz:** N-test 1, 2, 3 — 10 daqiqa.
5. **Biz:** haqiqiy kompilyator modulini beramiz.
6. **Birga:** N-test 4–9.

Shoshilinch emas — hozirgi usul (kompilyatorni dars ichiga yig'ish) ishlab
turibdi. Lekin eng qiyin qismi ortda qoldi: **bitta React masalasi hal bo'ldi**,
qolgani texnik tartib.
