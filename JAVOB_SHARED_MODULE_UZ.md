# JAVOB — «umumiy modulni mantiqiy nom orqali ulash» taklifiga

**Kimdan:** Darslik-platforma jamoasi · **Kimga:** LMS (Coddy Camp) IT jamoasi
**Nimaga javoban:** «TAKLIF — umumiy modulni MANTIQIY NOM orqali ulash», v1.0

---

## Qisqacha

**Nom yo'lini tanlaymiz.** Taklifingiz bizning TZ'mizdan kuchliroq — buni ochiq
tan olamiz. T-5 (barqaror manzil) bekor qilinsin.

Bitta narsa qoldi: siz «T-1 bajarildi» deb yozdingiz, biz esa bugun sinab ko'rdik
va ishlamadi. Buni avval birga aniqlaymiz — quyida batafsil.

Shoshilinch narsa yo'q: hozirgi usul (kompilyatorni har dars fayli ichiga yig'ib
yuborish) ishlab turibdi, hech nima to'xtab qolgani yo'q.

---

## 1. Nimada haqsiz — ochiq aytamiz

Taklifni o'qib chiqib, bir necha joyda **siz bizdan to'g'riroq o'ylagansiz**.

**Kesh masalasi.** Bizning TZ'dagi «yangilanish 1 daqiqa ichida yetsin» talabi —
aslida murosa edi. Manzil o'zgarmagani uchun brauzerni har safar «o'zgardimi?»
deb so'rashga majburlash kerak bo'lardi. Sizning yechimingizda modul umuman
o'zgarmas manzilda turadi, ya'ni uni bir yilga keshlash mumkin, yangi nashr esa
**darhol** yetadi. Bu ham tezroq, ham aniqroq. Biz bu haqda o'ylamagan ekanmiz.

**Tarix yo'qolishi.** «Faylni ustidan yozish — oldingi nusxani o'chirish demak»
degan e'tirozingiz bizning TZ'mizda umuman yozilmagan. To'g'ri e'tiroz.

**Orqaga qaytarish.** Biz o'z TZ'mizning 8-bo'limida «nosoz nashr 28 darsni birdan
buzadi» degan xavfni yozgan edik, lekin yechimini zaif qoldirdik — eski nusxani
qidirib topib qayta yuklash. Sizniki yaxshiroq: ko'rsatkichni almashtirish.

**Xavfsizlik.** Dars muallifi domen yozmasa — ro'yxat orqali cheklashdan ko'ra
ishonchli. Rozimiz.

**Va bitta yutuqni siz o'zingiz sanamagansiz.** Fayl kengaytmasi masalasi
butunlay yo'qoladi. Sizning yuklash oynangiz faqat `.jsx` qabul qiladi (biz buni
sinov moduli bilan aniqladik: `.js` fayl ro'yxatda umuman ko'rinmaydi). Nom
yo'lida fayl qanday atalishi sizning ichki ishingiz bo'lib qoladi — biz uni
bilishimiz ham shart emas. Bu ham ortiqcha kelishuvni olib tashlaydi.

Umuman: taklifingiz **import map** naqshiga o'xshaydi — o'zgarmas kontent-manzilli
fayllar ustidan kichkina o'zgaruvchan ko'rsatkich. Bu zamonaviy vositalarda
sinovdan o'tgan yondashuv. Bizning «ichi almashadigan barqaror fayl» g'oyamiz
esa aksincha edi.

---

## 2. 🔴 Bitta ziddiyat — avval shuni hal qilaylik

Siz yozdingiz: *«T-1 bajarildi… bugun quyidagi satr ishlaydi»*.

Biz bugun sinov modulini yukladik va sinov darsini ochdik. Natija:

```
Darsni kompilyatsiya qilib bo'lmadi

Bajarish xatosi: Modul topilmadi:
"https://go.coddycamp.uz/uploads/course_artifacts/2270fa1dcbebe770b3b8158dc8ff3265.jsx".
Mavjud modullar: react, react/jsx-runtime, react/jsx-dev-runtime, react-dom,
react-dom/client, framer-motion, motion/react, lucide-react, recharts, mathjs, @lesson/runtime

    at je (LessonRunnerQuestion.CxSBksv2.js:5:209)
```

Diqqat qilgan bir narsa: sizning namunangizdagi manzil **boshqa yo'lda**.

| | Yo'l |
|---|---|
| Sizning namunangiz | `go.coddycamp.uz/**modules**/html-compiler.js` |
| Biz sinaganimiz | `go.coddycamp.uz/**uploads/course_artifacts**/…jsx` |

Uch ehtimolni ko'ryapmiz: **(a)** ruxsat etilgan yo'llar ro'yxatiga faqat
`/modules/` kirgan, `/uploads/` esa kirmagan · **(b)** tuzatish biz sinaganimizdan
keyin chiqarilgan · **(c)** tuzatish biz kirgan muhitga hali yetmagan.

**Bu ayb izlash emas** — ehtimol biz noto'g'ri joyni sinaganmiz. Faqat ayting:
qaysi manzilda va qaysi muhitda sinasak to'g'ri bo'ladi? Biz 10 daqiqada qayta
tekshiramiz.

**Nima uchun bu muhim:** T-1 ishlamagani uchun biz **T-2 (bitta React) ni umuman
tekshira olmadik**. Siz «tuzilma darajasida kafolatlanadi» deb yozdingiz va bu
ishonarli tushuntirish, lekin uni **ko'rib** tasdiqlashimiz kerak. Sinov moduli
aynan shuning uchun tuzilgan: ichida `useState` bor, agar modul o'z React
nusxasini olsa — tugmani bir marta bosishda `Invalid hook call` chiqadi.

**Server tomoni esa bizda toza chiqdi** (buni aytib qo'yamiz, chunki bu sizning
ishingiz): `Content-Type: text/javascript; charset=utf-8` ✅ · CORS ✅ · fayl aynan
biz yuklaganidek turibdi ✅. Toza brauzerda (LMS'siz) o'sha manzildan modul to'liq
yuklandi va ishladi. Ya'ni server va modul tayyor.

---

## 3. Nimalarni qo'shishni so'raymiz

Taklifingizga qarshi emas — ustiga qo'shimcha. Beshtasi kichik, biri muhim.

### 3.1 🔴 `registry.json` keshi — sxemaning eng zaif joyi

Modul bir yilga keshlansa, **butun yangilanish mexanizmi ro'yxatga bog'lanib
qoladi**. Agar ro'yxat ham keshlanib qolsa, yangi nashr hech qachon ko'rinmaydi —
va buni sezish qiyin bo'ladi (xato chiqmaydi, shunchaki eski modul ishlayveradi).

Iltimos: `registry.json` **keshlanmasin** yoki juda qisqa muddat bilan berilsin.
Masalan:

```
Cache-Control: no-cache
```
yoki
```
Cache-Control: max-age=60, must-revalidate
```

Bu bitta kichik fayl, seansda bir marta so'raladi — arzon.

### 3.2 Ro'yxat ishlamay qolganda zaxira

Siz bu xavfni o'zingiz sanadingiz («ro'yxat ishlamasa, umumiy modul ishlatadigan
darslar ochilmaydi») va «amalda xavf kichik» dedingiz. Rozimiz — lekin oxirgi
ishlagan ro'yxatni saqlab qo'yish mumkin bo'lsa, xavf deyarli yo'qoladi:

> ro'yxat kelmadi → oxirgi ma'lum ro'yxat bilan davom etamiz → konsolda
> ogohlantirish

Talab qilmaymiz, lekin qilinsa yaxshi bo'lardi.

### 3.3 Versiya raqami — qoidasi aniq bo'lsin

K-2 da «raqamni siz belgilaysiz» deb yozdingiz. Aniqlik so'raymiz:

- `@shared/html-compiler@3` — bu **nashr-raqami** (har yuklashda +1) mi, yoki
  **katta versiya** (faqat mos kelmaydigan o'zgarishda +1) mi?
- Bizning taklif: **nashr-raqami**, ya'ni har nashrda o'sadi. Shunda «falon
  nashrga qaytar» deyish oson bo'ladi.
- Raqamsiz nom (`@shared/html-compiler`) doim **joriy** nashrga ishora qiladi —
  shundaymi?

### 3.4 Ro'yxatga nima yozilishi mumkinligi server tomonida cheklansin

Siz to'g'ri yozdingiz: dars tomonida ruxsat-ro'yxati keraksiz bo'ladi. Lekin
ro'yxatning **o'zi** endi yagona ishonch nuqtasi — unga faqat administrator va
biz yoza olishimiz kerak, va yozilgan yo'l ham sizning domeningizdan chiqmasligi
kerak.

### 3.5 Kompilyator faqat kerak bo'lganda yuklansin

Bizning TZ'ning 12-bo'limida so'ragan edik, takrorlaymiz — nom yo'lida buni
qilish yanada oson: kompilyator faqat **praktika** ekranida kerak, darsning
nazariy qismida emas. Agar dars-yurituvchi modulni dars ochilishida emas, kerak
bo'lganda yuklasa:

- dars tezroq ochiladi;
- modul yuklanmasa ham nazariy qism ishlayveradi (ya'ni 3.2 dagi xavf yana
  kamayadi).

Talab emas, lekin foydali.

### 3.6 Xato xabarlari — nom ko'rinishida ham ajratilsin

Siz TZ'dagi 8 xil xato holatini ajratganingizni yozdingiz. Nom yo'lida bittasi
qo'shiladi:

> **ro'yxatda bunday nom yo'q** — «`@shared/html-compiler` topilmadi.
> Mavjud nomlar: …»

Bu bizga eng ko'p kerak bo'ladigan xabar (nom xato yozilganda).

---

## 4. Bizning tomonda nima o'zgaradi

Siz «deyarli hech narsa» deb yozdingiz — deyarli to'g'ri, lekin bitta narsani
bilishingiz foydali, chunki u **sizning ishingizni kamaytiradi**.

**Bizning darslar ikki joyda ishlaydi:** LMSda va o'z saytimizda (o'quvchilar
uyda takrorlash uchun ochadigan). Shuning uchun dars faylining manbasida
`@shared/html-compiler` yozib qo'yolmaymiz — o'z saytimizda u yechilmaydi.

Yechim bizda tayyor. Bizda LMS uchun fayl yig'adigan skript bor; hozir u
kompilyatorni dars ichiga qo'shadi. Nom yo'lida u **shunchaki import satrini
almashtiradi** va kompilyatorni qo'shmaydi:

| | Hozir | Nom yo'lida |
|---|---|---|
| Dars manbasi (bizda) | `from '../compilator/HtmlCompiler.jsx'` | **o'zgarmaydi** |
| O'z saytimiz | Vite yig'adi | **o'zgarmaydi** |
| LMSga ketadigan fayl | kompilyator ichida, ~400 KB | `from '@shared/html-compiler'`, ~100 KB |

**Ya'ni:** TZ'ning 13-bo'limida biz «har darsda 1 ta satr o'zgaradi» deb
rejalashtirgan edik. Nom yo'lida u ham kerak emas — **0 ta satr**, hammasi
avtomatik. 28 ta darsni qo'lda tahrirlash umuman bo'lmaydi.

**Va yana:** dars fayllari ~400 KB dan ~100 KB ga tushadi. Bu sizning omboringizga
ham, o'quvchining internetiga ham foyda.

---

## 5. K-1…K-5 bo'yicha javoblarimiz

**K-1. Nom formati** — rozimiz. `@shared/html-compiler`.

**K-2. Versiyani qotirish** — rozimiz, 3.3 dagi aniqlik bilan.

**K-3. Ro'yxatni kim to'ldiradi** — rozimiz: modul yuklanganda nom avtomatik
bog'lansin. Yangi nom qo'shish administrator orqali — bizga bu yetarli, chunki
hozircha modul bitta va yaqin kelajakda ham bitta bo'lib qoladi.

**K-4. Nashr tartibi** — rozimiz. Eski nusxalar o'chirilmasligi — biz uchun eng
qimmatli bandlardan biri.

**K-5. Ro'yxat ko'rinishi** — bizga mos. Faqat 3.1 dagi kesh-sarlavhasi qo'shilsin.

---

## 6. Biz beradigan narsalar (o'zgarmadi)

| Nima | Tavsif |
|---|---|
| **Modul fayli** | Sof ESM, **ichida JSX yo'q**, faqat `react` ni import qiladi, ~110 KB |
| **Eksportlar** | `default` — kompilyator komponenti · `checks` — dars shartlarini yozish uchun yordamchilar |
| **Muhit** | `react` 18 yoki 19 |
| **Sinov moduli** | ~3 KB, allaqachon sizda: T-1 va T-2 ni bitta tugma bosishda tekshiradi |
| **Sinov dars fayli** | Import satri **nom ko'rinishida** qayta yoziladi va beriladi |
| **Nashr** | Yangi nusxa + o'zgarishlar ro'yxati, haftasiga 1–2 marta |

Modul faylining o'zi umuman o'zgarmaydi — siz to'g'ri yozdingiz.

---

## 7. Qabul-mezonlari

Sizning N-test 1…9 ro'yxatingizni **to'liq qabul qilamiz**. Uchtasini
aniqlashtirishni so'raymiz:

- **N-test 3 (kesh)** — «Network» panelida modul 1 marta yuklansin, **va**
  `registry.json` ham seansda 1 marta so'ralsin (3.1 bilan bog'liq).
- **N-test 4 (yangilanish)** — «darhol ishlaydi» degani: sahifa yangilangach,
  **qo'shimcha kutishsiz**. Buni birga o'lchaymiz.
- **N-test 7 (noma'lum nom)** — xato xabarida **mavjud nomlar ro'yxati**
  ko'rsatilsin (3.6).

Qo'shimcha bitta test so'raymiz:

- [ ] **N-test 10 — ro'yxat ishlamaganda.** `registry.json` vaqtincha
      o'chiriladi. Oq ekran bo'lmaydi; xato tushunarli; (agar 3.2 qilinsa)
      oxirgi ma'lum ro'yxat bilan dars ochilaveradi.

---

## 8. Tartib

1. **Siz:** T-1 ni qaysi manzilda/muhitda sinash kerakligini aytasiz (2-bo'lim).
2. **Biz:** mavjud sinov moduli bilan T-1 va T-2 ni tekshiramiz — 10 daqiqa.
   Ishlagach, siz aytgan «tuzilma darajasida kafolatlanadi» degan gap **ko'rilgan
   fakt** bo'ladi.
3. **Siz:** nom ro'yxatini va admin-paneldagi «versiyani almashtirish» imkoniyatini
   qo'shasiz; 3.1–3.6 bo'yicha javob berasiz.
4. **Biz:** sinov dars faylini nom ko'rinishida qayta yozib beramiz.
5. **Birga:** N-test 1…10.
6. **Biz:** haqiqiy kompilyator modulini beramiz va darslarni nom ko'rinishiga
   o'tkazamiz (bizda avtomatik, qo'lda tahrir yo'q).

---

## 9. Oxirida

Taklifingiz uchun rahmat — ayniqsa kamchiliklarini o'zingiz sanaganingiz uchun.
Biz TZ'ni yozganda «barqaror manzil» ni majburiy talab deb qo'ygan edik va uni
himoya qilishga tayyor edik; siz esa undan yaxshiroq yo'l ko'rsatdingiz. Shuni
tan olishdan yaxshiroq narsa yo'q.

Bir narsani takrorlaymiz: **shoshilinch emas**. Hozirgi usul ishlab turibdi,
darslar chiqib turibdi. Bu ish tezlik va qulaylik uchun — ikkala jamoaning
kelajakdagi ishini kamaytirish uchun.
