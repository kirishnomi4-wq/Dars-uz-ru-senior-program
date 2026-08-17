# TAKLIF — umumiy modulni MANTIQIY NOM orqali ulash

**Versiya:** 1.0 · **Sana:** 2026-08-12
**Kimdan:** LMS (Coddy Camp) IT jamoasi · **Kimga:** Darslik-platforma jamoasi
**Nimaga javoban:** TZ «LMS (Coddy Camp) ↔ Dars-yurituvchi: tashqi modulni manzil
orqali yuklash» v1.0, 2026-08-10

> Bu hujjat — **kelishuv uchun taklif**, talab emas. Sizning TZ ingiz bo'yicha ish
> allaqachon bajarildi va ishlaydi. Quyida bitta qo'shimcha ko'rinish taklif
> qilinadi: u sizning eng qimmat va eng xavfli talabingizni — **T-5 (barqaror
> manzil)** — butunlay keraksiz qiladi, va buning uchun sizdan qo'shimcha ish
> talab qilinmaydi.

---

## 1. Hozirgi holat — TZ bo'yicha nima bajarildi

| Talab | Holat |
|---|---|
| T-1 — manzil orqali import | bajarildi |
| T-2 — 🔴 bitta React nusxasi | bajarildi; tuzilma darajasida kafolatlanadi |
| T-3 — rekursiv yuklash shart emas | bajarildi (3 darajagacha, halqa nazorati bilan) |
| T-4 — sof ESM, JSX yo'q | bajarildi |
| T-6 — kesh, yangilanish ko'rinadi | bajarildi |
| T-7 — seansda bir marta yuklanadi | bajarildi |
| T-8 — ruxsat etilgan manzillar ro'yxati | bajarildi |
| T-9 — xatolik ko'rinadi | bajarildi; 8 xil xato holati ajratilgan |
| T-10 — kutish muddati | bajarildi; 10 soniya |
| **T-5 — barqaror manzil** | **server tomonida, hali ochiq** |

T-2 haqida alohida: modul brauzerning o'z `import()` mexanizmi bilan emas,
dars-yurituvchining **o'z quvuri** orqali o'tkaziladi — siz 4-bo'limda tavsiya
qilgan yo'l aynan shu. Shuning uchun modul ichidagi `react` dasturning yagona
React nusxasiga **tuzilishi bo'yicha** ulanadi, kelishuv yoki e'tibor hisobiga
emas. `Invalid hook call` xatosining sababi yo'qotildi.

Ya'ni bugun quyidagi satr ishlaydi:

```js
import HtmlCompiler, { checks } from 'https://go.coddycamp.uz/modules/html-compiler.js';
```

Faqat bitta narsa qoldi — **shu manzilning o'zi**.

---

## 2. Nega aynan T-5 qiyin

Barqaror manzil talabi bizdan yangi tushuncha talab qiladi — «ichi almashadigan,
nomi o'zgarmaydigan fayl». Bizning fayl-omborimiz esa boshqa tamoyilga qurilgan:
har bir yuklangan fayl **o'zgarmas** va o'z alohida manziliga ega. Buning
oqibatlari:

- **Tarix yo'qoladi.** Faylni ustidan yozish — oldingi nusxani o'chirish demak.
  Nosoz nashr chiqsa (sizning 8-bo'limingizdagi xavf — 18 ta dars birdan
  buziladi), orqaga qaytarish uchun eski nusxani qayta yuklash kerak bo'ladi.
- **Kesh noaniq bo'ladi.** Manzil bir xil, mazmun boshqa — shuning uchun har
  ochilishda serverdan qayta so'rash kerak (T-6 shu sababli kerak bo'lgan).
- **Agar fayl dastur kodida tursa — foyda yo'qoladi.** U holda modulni almashtirish
  bizning CRM ni qayta deploy qilishni talab qiladi, ya'ni siz 12-bo'limda rad
  etgan «Variant A» qaytib keladi, faqat boshqa nom bilan.

Bularning hammasi hal qilinadi. Lekin quyidagi taklif ularni **umuman paydo
bo'lmaydigan** qiladi.

---

## 3. Taklif — dars faylida manzil emas, nom

```js
import HtmlCompiler, { checks } from '@shared/html-compiler';
```

Dars faylida **manzil ham, domen ham yozilmaydi** — faqat nom. LMS bu nomni
o'zining ro'yxatidan qidiradi, modulning joriy nusxasini topadi va yuklaydi.
Qolgan hamma narsa o'zgarishsiz: o'sha quvur, o'sha bitta React, o'sha xatolar,
o'sha kutish muddati.

### Nima beradi

1. **T-5 butunlay keraksiz bo'ladi.** Barqaror manzil kerak emas, chunki darsda
   manzil yo'q. Ertaga domen o'zgarsa yoki fayllar boshqa omborga ko'chsa ham —
   darslarga tegilmaydi.

2. **Kesh ideal bo'ladi.** Modul fayli o'zgarmas manzilda turgani uchun uni
   brauzerga **bir yilga** berish mumkin (`immutable`) — qayta so'rovsiz. Yangi
   nashr = yangi manzil, ya'ni o'quvchiga **darhol** yetadi, kechikishsiz. Bu
   T-6 dagi «1 daqiqa ichida» shartidan qat'iyroq natija.

3. **Yagona o'zgaruvchan narsa — ro'yxatning o'zi**, bir necha yuz baytlik kichik
   fayl, 110 KB lik modul emas. Uni har ochilishda tekshirish arzon.

4. **Orqaga qaytarish bir harakatda.** Har bir nashr saqlanib qoladi; versiyani
   almashtirish — admin-panelda ko'rsatkichni o'zgartirish, qayta yuklash emas.
   Bu sizning 8-bo'limingizdagi xavfni kamaytiradi.

5. **Xavfsizlik yaxshilanadi.** Dars muallifi endi ixtiyoriy domenni yoza
   olmaydi — u umuman domen yozmaydi. T-8 dagi ro'yxat dars tomonida keraksiz
   bo'ladi.

6. **Versiyaga qotirish tabiiy ravishda chiqadi** (sizning ixtiyoriy
   so'rovingiz): `@shared/html-compiler@3` — bir dars ataylab eski versiyada
   qoladi.

### Sizga nima o'zgaradi

Deyarli hech narsa:

- TZ ning 13-bo'limida siz har darsda **1 ta satr** o'zgartirishni rejalashtirgansiz.
  Bu yerda ham aynan **o'sha 1 ta satr**, faqat ichida manzil emas, nom.
- **Modul faylining o'zi umuman o'zgarmaydi** (9-bo'lim): sof ESM, JSX yo'q, faqat
  `react` ni import qiladi, ~110 KB.
- Nashr tartibi o'zgarmaydi: yangi nusxani yuklaysiz, u joriy bo'ladi.

---

## 4. Ikki ko'rinishni taqqoslash

| | Manzil bilan (TZ v1.0) | Nom bilan (taklif) |
|---|---|---|
| Darsdagi satr | `from 'https://go.coddycamp.uz/modules/html-compiler.js'` | `from '@shared/html-compiler'` |
| T-5 barqaror manzil | **majburiy** | kerak emas |
| Bizdan yangi infratuzilma | ha — o'zgaruvchan fayl uchun alohida yo'l | yo'q — faqat kichik ro'yxat |
| Modul keshi | har ochilishda qayta tekshiriladi | bir yilga keshlanadi, qayta so'rovsiz |
| Yangilanish o'quvchiga yetishi | sahifa yangilangach | sahifa yangilangach, kechikishsiz |
| Nashr tarixi | ustidan yoziladi | to'liq saqlanadi |
| Orqaga qaytarish | eski nusxani qayta yuklash | ko'rsatkichni almashtirish |
| Domen o'zgarsa | 28 ta darsni tahrirlash | hech narsa qilinmaydi |
| Dars muallifi ixtiyoriy domen yoza oladimi | yo'q (ro'yxat to'sadi) | yo'q (umuman domen yo'q) |

---

## 5. Kelishilishi kerak bo'lgan narsalar

**K-1. Nom formati.** Taklif: `@shared/<modul-nomi>`, kichik harflar, `a-z`, `0-9`
va chiziqcha. Birinchi modul — `@shared/html-compiler`.

**K-2. Versiyani qotirish.** Taklif: `@shared/html-compiler@3`. Raqamni har
nashrda biz emas, siz belgilaysiz.

**K-3. Ro'yxatni kim to'ldiradi.** Taklif: modulni admin-panelga yuklaganingizda
nom avtomatik bog'lanadi — alohida ish talab qilinmaydi. Yangi nom qo'shish
(ikkinchi modul paydo bo'lganda) — LMS administratori orqali, sizning
so'rovingiz bilan.

**K-4. Nashr tartibi.** Yangi nusxa yuklanadi va «joriy» deb belgilanadi. Eskisi
o'chirilmaydi va o'z manzilida qolaveradi — shuning uchun orqaga qaytarish tez.

**K-5. Nomlar ro'yxatining ko'rinishi** (texnik tafsilot, sizga ta'sir qilmaydi):

```
GET https://go.coddycamp.uz/modules/registry.json

{
  "modules": {
    "html-compiler": {
      "current": "/uploads/course_artifacts/3653cce….js",
      "versions": { "3": "/uploads/…", "2": "/uploads/…" }
    }
  }
}
```

---

## 6. Kamchiliklari — ochiq aytamiz

- **Bitta qo'shimcha so'rov.** Dars ochilishidan oldin LMS ro'yxatni o'qiydi. So'rov
  kichik va seansda bir marta bajariladi, lekin u bor.
- **Ro'yxat ishlamay qolsa, umumiy modul ishlatadigan darslar ochilmaydi.** Amalda
  bu xavf kichik: ro'yxat dars fayli bilan bir serverda turadi, ya'ni u ishlamasa
  dars ham baribir yuklanmaydi. Xato xabari 9-bo'limdagi qoidalar bo'yicha
  ko'rsatiladi — oq ekran bo'lmaydi.
- **Bu TZ v1.0 dan chetlanish**, ya'ni ikkala jamoaning roziligini talab qiladi.
  Shuning uchun bu hujjat taklif shaklida yozilgan.

---

## 7. Muhim: bu ikkisi bir-birini inkor qilmaydi

Manzil orqali import **allaqachon ishlaydi va olib tashlanmaydi**. Ya'ni:

- agar siz manzil ko'rinishida qolishni tanlasangiz — biz T-5 ni server tomonida
  hal qilamiz va hammasi TZ bo'yicha ketaveradi;
- agar nom ko'rinishini tanlasangiz — T-5 bekor qilinadi;
- ikkalasini birga ishlatish ham mumkin: masalan sinov darslarida manzil,
  haqiqiy darslarda nom.

**Biz nomni tavsiya qilamiz** — u sizning maqsadingizga (modul bitta joyda
yangilansin, darslarga tegilmasin) manzildan ko'ra to'g'riroq javob beradi va
kelajakdagi domen/ombor o'zgarishlaridan sizni butunlay himoya qiladi.

---

## 8. Qabul-mezonlari (nom ko'rinishi uchun)

TZ ning 11-bo'limidagi testlar o'zgarishsiz qoladi, quyidagi farqlar bilan:

- [ ] **N-test 1 — nom bilan yuklanish.** `@shared/html-compiler` import qilingan
      sinov darsi ochiladi, modul yuklanadi, konsolda xato yo'q.
- [ ] **N-test 2 — bitta React (🔴 asosiy).** O'zgarishsiz: tugma bosiladi, hisob
      0 → 1 → 2 ga o'zgaradi, `Invalid hook call` chiqmaydi.
- [ ] **N-test 3 — kesh.** Bitta seansda 2 ta dars ketma-ket ochiladi; modul
      «Network» panelida 1 marta yuklab olinadi.
- [ ] **N-test 4 — yangilanish.** Yangi nusxa yuklanadi va joriy deb belgilanadi.
      Sahifa yangilangach, yangi nusxa **darhol** ishlaydi — darsga tegilmaydi.
- [ ] **N-test 5 — orqaga qaytarish.** Admin-panelda oldingi versiya joriy deb
      belgilanadi. Sahifa yangilangach, eski nusxa qaytadi.
- [ ] **N-test 6 — versiyaga qotirish.** `@shared/html-compiler@3` yozilgan dars
      joriy versiya o'zgarganda ham 3-versiyada qoladi.
- [ ] **N-test 7 — noma'lum nom.** Ro'yxatda yo'q nom beriladi. Oq ekran
      bo'lmaydi; sababi aniq ko'rsatiladi.
- [ ] **N-test 8 — haqiqiy dars.** Haqiqiy kompilyator moduli bilan bitta haqiqiy
      dars ochiladi: praktika ekrani chiqadi, shart-belgilari yonadi.
- [ ] **N-test 9 — eskilar buzilmadi.** Umumiy modul ishlatmaydigan 2–3 ta mavjud
      dars avvalgidek ochiladi.

---

## 9. Tartib

1. Siz shu hujjatni o'qiysiz → savollaringizni yozasiz, biz javob beramiz.
2. **Ikki ko'rinishdan birini tanlaymiz** (yoki ikkalasini).
3. Nom tanlansa: 5-bo'limdagi K-1…K-4 bo'yicha kelishamiz, biz ro'yxatni va
   admin-paneldagi «versiyani almashtirish» imkoniyatini qo'shamiz.
4. Siz sinov modulini va sinov dars faylini berasiz (TZ, 10-bo'lim) — o'zgarishsiz,
   faqat import satri nom ko'rinishida.
5. Birga qabul: haqiqiy modul bilan haqiqiy dars (N-test 8).

Shoshilinch emas: hozirgi usul (kompilyatorni har dars fayli ichiga yig'ib
yuborish) ishlayapti va to'xtab qolgan narsa yo'q. Bu taklif ham xuddi TZ kabi —
qulaylik va tezlik uchun.
