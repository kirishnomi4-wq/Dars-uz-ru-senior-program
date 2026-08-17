# TZ — LMS (Coddy Camp) ↔ Dars-yurituvchi: TASHQI MODULNI MANZIL ORQALI YUKLASH

**Versiya:** 1.0 · **Sana:** 2026-08-10 · **Buyurtmachi:** Darslik-platforma jamoasi · **Bajaruvchi:** LMS (Coddy Camp) IT jamoasi

> Bu hujjat **nima kerakligini** aytadi, **qanday yozishni** emas. Amalga oshirish
> yo'lini jamoangiz o'zi tanlaydi — biz faqat natija va tekshirish mezonlarini beramiz.
> Hujjat frontend va backend ishlarini o'z ichiga oladi; qaysi qism kimga tegishli
> ekanini har bo'limda belgilab qo'ydik.

---

## 1. Maqsad — nima uchun kerak

Darslarimizda **umumiy kod-kompilyator** ishlatiladi: o'quvchi HTML/CSS/JS yozadi,
natijani jonli ko'radi, shartlar avtomatik tekshiriladi. Bu komponent **27 ta darsning
18 tasida** bir xil ishlatiladi va hajmi ~110 KB.

**Hozirgi holat:** LMS bitta darsga bitta fayl qabul qiladi va tashqi modulni
yuklay olmaydi. Shuning uchun biz kompilyatorni **har bir dars fayli ichiga
nusxalab** yubormoqdamiz. Natija:

| | Hozir | Talab qilinayotgan holat |
|---|---|---|
| Dars fayli hajmi | ~393 KB (dars + kompilyator nusxasi) | ~330 KB (faqat dars) |
| Kompilyatorda 1 ta tuzatish | **18 ta faylni qayta yig'ish va qayta yuklash** | **1 ta faylni almashtirish** |
| Nusxalar bir xilmi | qo'lda nazorat qilinadi | tabiiy ravishda bir xil |

Kompilyator faol rivojlanmoqda: faqat **8–9 avgust kunlari 7 ta tuzatish** kiritildi
(shart-belgilari yonmasligi, sensor-klaviatura, sintaksis-xatolar ko'rsatilishi va h.k.).
Har bir shunday tuzatish bugungi tartibda **18 marta qayta yuklashni** talab qiladi.

**So'ralayotgan imkoniyat:** dars fayli umumiy modulni **manzil (URL) orqali**
import qila olsin. Shunda modul bitta joyda yangilanadi va barcha darslarga
bir zumda tegadi — darslarga qayta tegilmaydi, LMS qayta deploy qilinmaydi.

---

## 2. Hozirgi holat — o'lchangan faktlar

Ikkita sinov o'tkazdik (ikkalasi ham 2026-08-10, sinov darsi orqali).

**Sinov 1 — nisbiy yo'l bilan import:**
```
Bajarish xatosi: Modul topilmadi: "../compilator/HtmlCompiler.jsx".
Mavjud modullar: react, react/jsx-runtime, react/jsx-dev-runtime, react-dom,
react-dom/client, framer-motion, motion/react, lucide-react, recharts, mathjs, @lesson/runtime
```

**Sinov 2 — to'liq manzil (URL) bilan import:**
```
Bajarish xatosi: Modul topilmadi: "https://go.coddycamp.uz/uploads/course_artifacts/3653cce…jsx".
Mavjud modullar: react, react/jsx-runtime, ... , @lesson/runtime
```
Xato manbasi: `LessonRunnerQuestion.<hash>.js`

**Xulosa:** dars-yurituvchida modul-nomlarining **yopiq ro'yxati** bor. Manzil
berilganda ham u shunchaki ro'yxatdan qidiriladi — **yuklab olishga urinilmaydi**.

**Server tomonidan o'lchangan (2026-08-10):**
```
$ curl -I https://go.coddycamp.uz/uploads/course_artifacts/3653cce….jsx
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *          ← CORS to'g'ri sozlangan
X-Content-Type-Options: nosniff
(Content-Type sarlavhasi YO'Q)          ← tuzatilishi kerak, 6-bo'limga qarang
```

---

## 3. Talab — nima ishlashi kerak

**T-1. Manzil orqali import.** Dars faylida quyidagi satr ishlashi kerak:
```js
import HtmlCompiler, { checks } from 'https://go.coddycamp.uz/modules/html-compiler.js';
```
Dars-yurituvchi manzilni yuklab olsin, modulni bajarsin va uning eksportlarini darsga bersin.

**T-2. 🔴 BITTA React nusxasi — eng muhim shart.** Yuklangan modul ichidagi
`import ... from "react"` **dars-yurituvchining o'z React nusxasiga** ulanishi shart.
Agar modul alohida React olsa yoki React'ni umuman topa olmasa — komponent ishlamaydi
(`Invalid hook call` xatosi bilan qulaydi). Bu — eng ko'p uchraydigan va eng qimmat
xato, shuning uchun uni alohida qabul-testi bilan tekshiramiz (11-bo'lim, T-test 2).

**T-3. Modul boshqa hech narsani so'ramaydi.** Biz beradigan modul **faqat `react`**
ni import qiladi — u sizning ro'yxatingizda allaqachon bor. Ya'ni rekursiv (ichma-ich)
manzil-yuklashni qo'llab-quvvatlash **shart emas**. Kelajakda kerak bo'lsa —
alohida kelishamiz.

**T-4. Modul sof JavaScript bo'ladi.** Biz JSX'siz, oldindan kompilyatsiya qilingan
standart ESM fayl beramiz. Ya'ni tashqi modul uchun JSX kompilyatori **kerak emas** —
faqat import-larni hal qilish va bajarish kifoya.

**T-5. Barqaror manzil (⚠️ maqsadning o'zagi).** Modul manzili **o'zgarmasligi** kerak:
```
https://go.coddycamp.uz/modules/html-compiler.js     ← nomi doim shu, ichi yangilanadi
```
Agar manzil har yangilanishda o'zgarsa (masalan kontent-xeshli `3653cce….js`), biz
28 ta darsning hammasida manzilni tahrirlab qayta yuklashimiz kerak bo'ladi —
bu butun ishning ma'nosini yo'qotadi. **Barqaror manzil — majburiy talab.**

Qo'shimcha (ixtiyoriy, foydali): versiyaga qotirilgan manzil ham bo'lsin —
`…/modules/html-compiler-v3.js`. Bir dars ataylab eski versiyada qolishi kerak bo'lsa
ishlatiladi.

**T-6. Kesh — yangilanish ko'rinadigan bo'lsin.** Modul brauzerda keshlansin (tezlik
uchun), lekin **yangi versiya chiqqanda o'quvchiga yetib borsin**. Ya'ni «bir marta
yuklab olib, abadiy eslab qolish» **yaramaydi**. Amaliy talab: modul yangilangach,
o'quvchi sahifani yangilaganda **1 daqiqa ichida** yangi nusxa ishlashi kerak.
(Texnik yo'li sizniki — `ETag`/`Last-Modified` bilan qayta tekshirish yoki qisqa
`max-age` odatda yetarli.)

**T-7. Bitta seansda bir marta yuklansin.** O'quvchi ketma-ket 3 ta darsni ochsa,
modul 3 marta emas, **1 marta** yuklab olinsin (xotira keshi).

**T-8. Ruxsat etilgan manzillar ro'yxati.** Faqat siz sozlagan domenlardan yuklansin
(boshlanishiga bitta yozuv yetarli: `go.coddycamp.uz`). Ro'yxatda yo'q manzil —
aniq xato bilan rad etilsin.

**T-9. Xatolik ko'rinadigan bo'lsin.** Modul yuklanmasa — **oq ekran bo'lmasin**.
O'quvchiga tushunarli xabar, mualliflar uchun konsolda sabab ko'rinsin. Ajratilishi
kerak bo'lgan holatlar:
- manzilga ulanib bo'lmadi / 404
- ruxsat etilmagan domen
- modul ichida bajarish xatosi
- kutilgan eksport topilmadi

**T-10. Kutish muddati.** Modul yuklanishi cheksiz kutilmasin (masalan 10 soniya),
muddat o'tsa — T-9 dagi xabar chiqsin.

---

## 4. Eng ehtimolli amalga oshirish yo'li (maslahat, majburiy emas)

Sizda dars fayli allaqachon shu bosqichlardan o'tadi: **matn → kompilyatsiya →
import-larni ro'yxatdan hal qilish → bajarish**. Tashqi modulni **xuddi shu quvur
orqali** o'tkazish eng arzon va eng xavfsiz yo'l:

```
manzil → fetch → matn → (JSX kerak emas) → import-larni O'SHA ro'yxatdan hal qilish
       → bajarish → natijani manzil bo'yicha keshlash
```

Bu yo'lning afzalligi: **T-2 (bitta React) o'z-o'zidan bajariladi** — chunki modul
darsning o'zi bilan bir xil hal qiluvchidan o'tadi.

Agar buning o'rniga brauzerning o'z `import()` mexanizmi ishlatilsa — modul ichidagi
`react` nomini brauzer hal qila olmaydi va qo'shimcha ish (import map) talab qilinadi.
Shuning uchun birinchi yo'lni tavsiya qilamiz.

---

## 5. Nima O'ZGARMAYDI

Bu ish quyidagilarga **tegmasligi** kerak:
- dars faylini yuklash tartibi;
- dars fayllarining JSX kompilyatsiyasi;
- mavjud modul-ro'yxati (`react`, `recharts`, `mathjs`, `@lesson/runtime` va h.k.);
- eski darslar — ular tashqi modul ishlatmaydi va o'zgarishsiz ishlayveradi.

---

## 6. Server tomoni (backend / Apache)

**S-1. `Content-Type` sarlavhasi.** Hozir modul-fayl **hech qanday `Content-Type` siz**
qaytmoqda (2-bo'limdagi o'lchov). Modul fayllari uchun quyidagisi berilsin:
```
Content-Type: text/javascript; charset=utf-8
```
Brauzerning o'z modul-yuklovchisi ishlatilsa, bu **majburiy**; sizning o'z
yuklovchingiz ishlatilsa — baribir to'g'ri bo'lgani yaxshi.

**S-2. CORS.** Hozir to'g'ri sozlangan (`Access-Control-Allow-Origin: *`) — o'zgartirish
shart emas.

**S-3. Barqaror manzil uchun joy.** T-5 dagi manzil ishlashi uchun modul fayllari
uchun alohida yo'l ochilsin (masalan `/modules/`), unda fayl nomi **o'zgarmaydi**,
faqat ichidagi mazmun almashtiriladi.

**S-4. Modulni almashtirish yo'li.** Biz yangi nusxani qanday joylashtirishimiz kerak —
shuni belgilang: admin-panel orqali yuklashmi, FTP/SSH mi, yoki API. Bizga qulayi —
admin-panelda «modulni almashtirish» tugmasi.

**S-5. Sahifa xavfsizlik siyosati (CSP).** Agar LMS sahifasida `Content-Security-Policy`
qo'llanilsa, `go.coddycamp.uz` manzili `script-src` va `connect-src` ga qo'shilsin —
aks holda brauzer yuklashni jimgina to'sadi.

---

## 7. Xavfsizlik

- Modul manzili **faqat sozlangan ro'yxatdan** olinadi (T-8). Dars muallifi
  ixtiyoriy manzil yozib, undan kod ishga tushira olmasligi kerak.
- Modul fayllarini almashtirish huquqi — faqat LMS administratorlari va biz.
- Modul kodi dars kodi bilan bir xil muhitda ishlaydi, ya'ni yangi xavf-sinfi
  paydo bo'lmaydi: dars fayllari ham hozir xuddi shunday ishlamoqda.
- Ixtiyoriy qo'shimcha himoya: modul faylining nazorat yig'indisini (hash) tekshirish.
  Talab qilmaymiz, lekin xohlasangiz biz har nashrda hash berib turamiz.

---

## 8. Xavf va uni kamaytirish

**Xavf:** modul barcha darslarga birdan tegadi — nosoz nashr 18 ta darsni birdan buzadi.

**Kamaytirish (biz tomondan):** har nashrdan oldin modul bizning tarafda avtomatik
tekshiruvdan o'tadi (brauzerda ochib, kompilyator ekrani chizilishi tekshiriladi).

**Kamaytirish (sizdan so'raladigan, ixtiyoriy):** T-5 dagi versiyaga qotirilgan
manzil bo'lsa — muammo chiqqanda darsni tez orqaga qaytarish mumkin bo'ladi.

---

## 9. Biz beradigan narsalar

| Nima | Tavsif |
|---|---|
| **Modul fayli** | `html-compiler.js` — standart ESM, JSX yo'q, faqat `react` ni import qiladi. Hajmi ~110 KB (siqilganda ~30 KB) |
| **Eksportlar** | `default` — kompilyator komponenti (React) · `checks` — dars shartlarini yozish uchun yordamchilar |
| **Talab qilinadigan muhit** | `react` 18 yoki 19 (sizda mavjud) |
| **Sinov dars fayli** | 11-bo'limdagi testlarni yurgizish uchun tayyor `.jsx` fayl |
| **Yangilanish tartibi** | yangi nusxa + o'zgarishlar ro'yxati; nashr chastotasi — haftasiga 1–2 marta |

---

## 10. Sinov-vektor (ishni tekshirish uchun)

Ish boshlanishidan oldin biz quyidagilarni beramiz:

1. **Sinov moduli** — manzil bo'yicha turadigan kichik fayl. Ichida:
   - `default` — bosilganda hisobni oshiradigan tugma (React `useState` bilan);
   - `checks` — oddiy obyekt.
   Bu modul **maxsus shunday tuzilgan**: agar React ikki nusxa bo'lsa, tugma bosilishi
   bilan xato beradi. Ya'ni T-2 shartini bir bosishda tekshiradi.
2. **Sinov dars fayli** — shu modulni import qilib, ekranga chiqaradi.
3. **Kutilgan natija tavsifi** — ekranda nima ko'rinishi kerakligi.

---

## 11. Qabul-mezonlari (ish «tayyor» sanaladi, qachonki)

- [ ] **T-test 1 — yuklanish.** Sinov darsi ochilganda modul yuklanadi, ekranda
      kutilgan matn ko'rinadi, konsolda xato yo'q.
- [ ] **T-test 2 — bitta React (🔴 asosiy).** Sinov modulidagi tugma bosiladi va
      hisob 0 → 1 → 2 ga o'zgaradi. `Invalid hook call` kabi xato **chiqmaydi**.
- [ ] **T-test 3 — kesh.** Bitta seansda shu modulni ishlatadigan 2 ta dars ketma-ket
      ochiladi. Brauzer «Network» panelida modul **1 marta** yuklab olinadi.
- [ ] **T-test 4 — yangilanish ko'rinadi.** Modul fayli serverda almashtiriladi
      (manzil o'zgarmaydi). Sahifa yangilangach, **1 daqiqa ichida** yangi nusxa
      ishlaydi — darsga tegilmagan holda.
- [ ] **T-test 5 — noto'g'ri manzil.** Mavjud bo'lmagan manzil beriladi. Oq ekran
      **bo'lmaydi**; tushunarli xato ko'rsatiladi.
- [ ] **T-test 6 — ruxsatsiz domen.** Ro'yxatda yo'q domendan import qilinadi.
      Yuklanmaydi, sababi aniq aytiladi.
- [ ] **T-test 7 — haqiqiy dars.** Bizning haqiqiy kompilyator modulimiz bilan
      bitta haqiqiy dars ochiladi: praktika ekrani chiqadi, o'quvchi kod yozadi,
      shart-belgilari yonadi, natija oynasi ishlaydi.
- [ ] **T-test 8 — eskilar buzilmadi.** Tashqi modul ishlatmaydigan 2–3 ta mavjud
      dars avvalgidek ochiladi.

---

## 12. Savol-javob

**Nega modulni LMS'ning o'z bog'liqliklariga qo'shib qo'ymaymiz?**
Bu ham yechim (biz uni «Variant A» deb ataymiz), lekin unda kompilyatorning har
yangilanishi LMS'ni qayta deploy qilishni talab qiladi — ya'ni har safar sizning
jamoangizni band qiladi. Manzil orqali yuklash esa bir marta qilinadi va keyin
ikkala tomon bir-biriga bog'liq bo'lmaydi.

**Modul yuklanmay qolsa, dars butunlay ishlamaydimi?**
Kompilyator faqat **praktika** qismida kerak. Dars-yurituvchi modulni dars
ochilishida emas, kerak bo'lganda yuklasa — nazariy qism baribir ishlayveradi.
Bu talab emas, lekin qilinsa yaxshi bo'lardi.

**Bu ish tugaguncha darslar ishlamay turadimi?**
Yo'q. Hozir biz kompilyatorni har dars fayli ichiga yig'ib yubormoqdamiz va bu
usul **sinovdan o'tdi, ishlayapti**. Ya'ni sizni shoshirmayapmiz — bu ish
qulaylik va tezlik uchun, to'xtab qolgan narsa yo'q.

**Boshqa modullar ham shu yo'l bilan qo'shiladimi?**
Hozircha faqat bittasi — kod-kompilyator. Kelajakda qo'shilishi mumkin, lekin
har biri alohida kelishiladi va T-8 ro'yxati orqali nazorat qilinadi.

---

## 13. Tartib

1. LMS IT jamoasi TZ ni o'qiydi → savollarini yozadi, biz javob beramiz.
2. Biz sinov modulini va sinov dars faylini beramiz (10-bo'lim).
3. Jamoa ishni bajaradi → 11-bo'limdagi testlarni o'zi yurgizadi.
4. Birga qabul: haqiqiy kompilyator moduli bilan haqiqiy dars ochiladi (T-test 7).
5. Shundan keyin biz darslarni «yig'ilgan» shakldan «manzilli» shaklga o'tkazamiz —
   har darsda 1 ta satr o'zgaradi, dars mazmuniga tegilmaydi.
