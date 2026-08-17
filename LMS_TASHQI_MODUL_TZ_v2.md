# TZ v2 — LMS (Coddy Camp) ↔ Dars-yurituvchi
## TASHQI MODULNI MANZIL ORQALI YUKLASH

> Bu hujjat oldingi TZ'ning **to'liq o'rnini bosadi**. Unda yozilgan talablarning bir
> qismi bajarilgan, bir qismi yo'q — quyida ikkalasi ham aniq ko'rsatilgan.
> Hujjat o'zi-yetarli: sinov natijalari, xato matni va nima qilish kerakligi shu yerda.

---

## 1. Bir jumlada — nima kerak

Dars faylida quyidagi satr ishlashi kerak:

```js
import HtmlCompiler, { checks } from 'https://go.coddycamp.uz/modules/html-compiler.jsx';
```

Ya'ni: **dars-yurituvchi manzilni yuklab olsin, modulni bajarsin, eksportlarini darsga bersin.**

### Nima uchun bu kerak

Bizda 28 ta darsda ishlaydigan **bitta umumiy kod-kompilyator** bor. Hozir u har bir
darsning **ichiga nusxalanadi** — natijada:

- har dars fayli **400–500 KB** (kompilyatorning o'zi ~110 KB);
- kompilyatorga **bitta tuzatish** kiritilsa — **28 ta darsni qayta yig'ib, qayta yuklash** kerak;
- darslar bir-biridan asta uzoqlashadi (bir darsda tuzatilgan, boshqasida yo'q).

Tashqi modul bo'lsa: **bitta joyda tuzatiladi — hamma darsda ishlaydi.**

---

## 2. Hozirgi holat — o'lchangan faktlar

### ✅ Ishlayotgan qism (tuzatilgan, rahmat)

Modul fayli serverda to'g'ri turibdi va to'g'ri sarlavhalar bilan qaytadi:

```
$ curl -I https://go.coddycamp.uz/uploads/course_artifacts/<fayl>.jsx

HTTP/1.1 200 OK
Content-Type: text/javascript; charset=utf-8      ← ✅ to'g'ri
Access-Control-Allow-Origin: *                    ← ✅ to'g'ri
X-Content-Type-Options: nosniff
Content-Length: 2862
```

### 🔴 Ishlamayotgan qism — asosiy talab

Sinov darsi ochilganda:

```
Darsni kompilyatsiya qilib bo'lmadi

Bajarish xatosi: Modul topilmadi:
"https://go.coddycamp.uz/uploads/course_artifacts/<fayl>.jsx".
Mavjud modullar: react, react/jsx-runtime, react/jsx-dev-runtime, react-dom,
react-dom/client, framer-motion, motion/react, lucide-react, recharts, mathjs, @lesson/runtime

    at je (LessonRunnerQuestion.<hash>.js)
```

### Xato nimani anglatadi

Xabarning o'zi sababni aytib turibdi: **«Mavjud modullar: …»**

Dars-yurituvchi import nomini **oldindan tuzilgan yopiq ro'yxatdan** qidiryapti.
Manzil o'sha ro'yxatda yo'q — «topilmadi» deyilyapti. **Manzilni yuklab olishga
urinilmayapti.**

Ya'ni hozir mantiq shunday:

```
import nomi → ro'yxatdan qidir → topilsa ber, topilmasa XATO
```

Kerak bo'lgan mantiq:

```
import nomi → "https://" bilan boshlanadimi?
                ├─ HA  → ruxsat etilgan domenmi? → fetch qil → bajar → keshla
                └─ YO'Q → hozirgidek ro'yxatdan qidir
```

### Muammo bizning tarafimizda emasligi — tekshirilgan

Xuddi shu manzilni **LMS'siz, toza brauzerda** sinadik:

**Sinov A — oddiy `import(url)`:**
```
Failed to resolve module specifier "react".
```
Bu **muvaffaqiyat belgisi**: brauzer faylni yuklab oldi, `Content-Type` ni qabul qildi,
faylni ES-modul sifatida tahlil qildi. Faqat `react` nomini yecha olmadi — bu kutilgan,
chunki `react` ni muhit beradi (sizda u allaqachon bor).

**Sinov B — `react` berilganda:** modul **to'liq ishladi**:
- eksportlar chiqdi: `default`, `checks`, `SINOV_VERSIYA`;
- komponent ekranga chizildi;
- tugma bosildi, hisob `0 → 1 → 2` o'zgardi (React bitta nusxa, hook ishlayapti);
- konsolda xato **0**.

**Xulosa:** modul to'g'ri, server to'g'ri, manzil to'g'ri. Qolgan yagona joy —
dars-yurituvchining import-hal qiluvchisi.

---

## 3. 🔴 Yangi aniqlangan cheklov — fayl kengaytmasi `.jsx`

LMS'ning fayl-yuklash oynasi **faqat `.jsx`** turini qabul qiladi: `.js` fayl
tanlash ro'yxatida umuman ko'rinmaydi.

Shuning uchun modulimiz `.jsx` kengaytmasi bilan yuklandi. **Fayl ichida JSX YO'Q** —
u sof standart ESM, kengaytma shunchaki yorliq.

**Sizdan kerak — ikkitadan biri (qaysi biri qulay bo'lsa):**

- **(a)** Barqaror modul-manzili `.jsx` bilan tugasin — biz uchun muammo emas:
  `https://go.coddycamp.uz/modules/html-compiler.jsx`
- **(b)** Modul fayllari uchun `.js` yuklashga ruxsat berilsin.

🔴 **Muhim:** tanlangan variantda ham modul faylini **JSX deb hisoblab kompilyatsiya
qilish shart emas** — u allaqachon sof JavaScript. Uni shunchaki yuklab, bajarish kifoya.

---

## 4. 🔴 Barqaror manzil — majburiy talab

Hozirgi manzil **kontent-xeshi**:
```
https://go.coddycamp.uz/uploads/course_artifacts/2270fa1dcbebe770b3b8158dc8ff3265.jsx
```
Fayl har yangilanganda bu xesh **o'zgaradi**.

Agar shunday qolsa — butun ishning ma'nosi yo'qoladi: kompilyatorga bitta tuzatish
kiritilganda **28 ta darsning hammasida manzilni qo'lda tahrirlab, qayta yuklashimiz**
kerak bo'ladi. Bu hozirgi holatdan yaxshiroq emas.

**Kerak:** nomi o'zgarmaydigan, ichi almashtiriladigan manzil:

```
https://go.coddycamp.uz/modules/html-compiler.jsx      ← nom DOIM shu, ichi yangilanadi
```

**Ixtiyoriy, foydali:** versiyaga qotirilgan manzil ham bo'lsin —
`…/modules/html-compiler-v3.jsx`. Bir dars ataylab eski versiyada qolishi kerak
bo'lganda yoki nosoz nashrni tez orqaga qaytarishda ishlatiladi.

---

## 5. Talablar ro'yxati

| # | Talab | Holat |
|---|---|---|
| **T-1** | **Manzil orqali import.** `import X from 'https://…'` ishlashi kerak: yuklovchi manzilni yuklab olsin, bajarsin, eksportlarni bersin | 🔴 **kutilmoqda** |
| **T-2** | **🔴 BITTA React nusxasi — eng muhim shart.** Modul ichidagi `import ... from "react"` **dars-yurituvchining o'z React nusxasiga** ulansin. Alohida React olsa — `Invalid hook call` bilan qulaydi | ⏸ T-1 dan keyin |
| **T-3** | **Modul boshqa hech narsa so'ramaydi.** Bizning modul **faqat `react`** ni import qiladi — u ro'yxatingizda bor. Ichma-ich manzil-yuklash **shart emas** | ✅ biz ta'minlaymiz |
| **T-4** | **Modul sof JavaScript.** JSX'siz, oldindan kompilyatsiya qilingan ESM. Tashqi modul uchun JSX kompilyatori **kerak emas** | ✅ biz ta'minlaymiz |
| **T-5** | **Barqaror manzil** (4-bo'lim). Nomi o'zgarmaydi, ichi yangilanadi | 🔴 **kutilmoqda** |
| **T-6** | **Kesh yangilanishni ko'rsatsin.** Modul keshlansin, lekin yangi nashr o'quvchiga yetib borsin: sahifa yangilangach **1 daqiqa ichida** yangi nusxa ishlasin (`ETag`/`Last-Modified` yoki qisqa `max-age`) | 🔴 kutilmoqda |
| **T-7** | **Seansda bir marta.** O'quvchi 3 ta darsni ketma-ket ochsa, modul **1 marta** yuklansin (xotira keshi) | 🔴 kutilmoqda |
| **T-8** | **Ruxsat etilgan domenlar ro'yxati.** Faqat siz sozlagan domendan yuklansin (boshlash uchun bitta yozuv yetarli: `go.coddycamp.uz`). Ro'yxatda yo'q manzil — aniq xato bilan rad etilsin | 🔴 kutilmoqda |
| **T-9** | **Xato ko'rinadigan bo'lsin — oq ekran BO'LMASIN.** Ajratiladigan holatlar: ulanib bo'lmadi/404 · ruxsatsiz domen · modul ichida bajarish xatosi · kutilgan eksport topilmadi | 🔴 kutilmoqda |
| **T-10** | **Kutish muddati.** Modul cheksiz kutilmasin (masalan 10 soniya), muddat o'tsa T-9 dagi xabar chiqsin | 🔴 kutilmoqda |
| **T-11** | **Fayl kengaytmasi** (3-bo'lim): `.jsx` manzil qabul qilinsin yoki `.js` yuklashga ruxsat berilsin | 🔴 **kutilmoqda** |

---

## 6. Qanday qilish — tavsiya etilgan yo'l

Sizda dars fayli allaqachon shu quvurdan o'tadi:

```
matn → kompilyatsiya → import-larni ro'yxatdan hal qilish → bajarish
```

Tashqi modulni **xuddi shu quvur orqali** o'tkazish eng arzon va eng xavfsiz yo'l:

```
manzil → fetch → matn → (JSX kerak emas) → import-larni O'SHA ro'yxatdan hal qilish
       → bajarish → natijani manzil bo'yicha keshlash
```

**Bu yo'lning asosiy afzalligi: T-2 (bitta React) o'z-o'zidan bajariladi** — chunki
modul darsning o'zi bilan bitta hal qiluvchidan o'tadi, ya'ni `react` nomi o'sha
bitta nusxaga bog'lanadi.

### Taxminiy ko'rinish (tushuntirish uchun, majburiy emas)

```js
const RUXSAT = ['go.coddycamp.uz'];
const kesh = new Map();                      // manzil → bajarilgan modul

async function moduliniOl(nom) {
  // 1) Oddiy nom — hozirgidek ro'yxatdan
  if (!nom.startsWith('https://')) return ROYXAT[nom];   // react, recharts, ...

  // 2) Manzil — ruxsat tekshiriladi (T-8)
  const u = new URL(nom);
  if (!RUXSAT.includes(u.hostname)) throw new Error('Ruxsat etilmagan domen: ' + u.hostname);

  // 3) Seans keshi (T-7)
  if (kesh.has(nom)) return kesh.get(nom);

  // 4) Yuklab olish (T-10 — muddat bilan)
  const javob = await fetch(nom, { signal: AbortSignal.timeout(10000) });
  if (!javob.ok) throw new Error('Modul yuklanmadi (' + javob.status + '): ' + nom);
  const matn = await javob.text();

  // 5) Bajarish — import-lar O'SHA ro'yxatdan hal qilinadi (shu sabab React bitta)
  const modul = bajar(matn, moduliniOl);     // dars fayli uchun ishlatiladigan mexanizm

  kesh.set(nom, modul);
  return modul;
}
```

---

## 7. Server tomoni

| # | Talab | Holat |
|---|---|---|
| **S-1** | `Content-Type: text/javascript; charset=utf-8` | ✅ **bajarilgan** |
| **S-2** | CORS: `Access-Control-Allow-Origin: *` | ✅ **bajarilgan** |
| **S-3** | **Barqaror manzil uchun joy** — modul fayllari uchun alohida yo'l (masalan `/modules/`), unda fayl nomi o'zgarmaydi, faqat ichi almashtiriladi | 🔴 kutilmoqda |
| **S-4** | **Modulni almashtirish yo'li** — biz yangi nusxani qanday joylashtiramiz? Admin-panel, FTP/SSH yoki API. Bizga qulayi: admin-panelda «modulni almashtirish» tugmasi | 🔴 belgilanishi kerak |
| **S-5** | **CSP.** Agar LMS sahifasida `Content-Security-Policy` bo'lsa, `go.coddycamp.uz` `script-src` va `connect-src` ga qo'shilsin — aks holda brauzer jimgina to'sadi | 🔴 tekshirilsin |

---

## 8. Xavfsizlik

- Modul manzili **faqat sozlangan ro'yxatdan** olinadi (T-8). Dars muallifi ixtiyoriy
  manzil yozib, undan kod ishga tushira olmasligi kerak.
- Modul fayllarini almashtirish huquqi — faqat LMS administratorlari va biz.
- Modul kodi dars kodi bilan **bir xil muhitda** ishlaydi, ya'ni yangi xavf-sinfi
  paydo bo'lmaydi: dars fayllari ham hozir xuddi shunday ishlamoqda.
- Ixtiyoriy: modul faylining nazorat yig'indisini (hash) tekshirish. Talab qilmaymiz,
  lekin xohlasangiz har nashrda hash berib turamiz.

---

## 9. Xavf va uni kamaytirish

**Xavf:** modul barcha darslarga birdan tegadi — nosoz nashr 28 ta darsni birdan buzadi.

**Kamaytirish (biz tomondan):** har nashrdan oldin modul bizning tarafda avtomatik
tekshiruvdan o'tadi — brauzerda ochilib, kompilyator ekrani chizilishi va kod-yozish
ishlashi tasdiqlanadi.

**Kamaytirish (sizdan, ixtiyoriy):** T-5 dagi versiyaga qotirilgan manzil bo'lsa,
muammo chiqqanda darsni tez orqaga qaytarish mumkin bo'ladi.

---

## 10. Nima O'ZGARMAYDI

Bu ish quyidagilarga **tegmasligi** kerak:

- dars faylini yuklash tartibi;
- dars fayllarining JSX kompilyatsiyasi;
- mavjud modul-ro'yxati (`react`, `recharts`, `mathjs`, `@lesson/runtime` va h.k.);
- eski darslar — ular tashqi modul ishlatmaydi va o'zgarishsiz ishlayveradi.

---

## 11. Biz beradigan narsalar

| Nima | Tavsif |
|---|---|
| **Modul fayli** | `html-compiler.jsx` — standart ESM, **ichida JSX yo'q**, faqat `react` ni import qiladi. ~110 KB (siqilganda ~30 KB) |
| **Eksportlar** | `default` — kompilyator komponenti (React) · `checks` — dars shartlarini yozish uchun yordamchilar |
| **Talab qilinadigan muhit** | `react` 18 yoki 19 (sizda bor) |
| **Sinov moduli** | ~3 KB, T-1 va T-2 ni bir bosishda tekshiradi (12-bo'lim) |
| **Sinov dars fayli** | Sinov modulini import qilib ekranga chiqaradi |
| **Yangilanish tartibi** | Yangi nusxa + o'zgarishlar ro'yxati; nashr chastotasi haftasiga 1–2 marta |

---

## 12. Sinov to'plami (bizda tayyor, sizga berilgan)

**Sinov moduli** atayin shunday tuzilgan: ichida `useState` bor. Agar modul **o'z React
nusxasini** olsa, tugma bosilishi bilan `Invalid hook call` chiqadi. Ya'ni **T-2 sharti
bitta bosishda** ma'lum bo'ladi — uzoq tekshirish kerak emas.

**Ishlagan holatda ekranda ko'rinishi kerak:**

1. To'rt qator, hammasi yashil ✅:
   `T-1 Modul yuklandi` · `T-1b checks eksporti keldi` · `T-1c Versiya o'qildi: 1.0.0` · `T-2a Darsda React bor`
2. To'q sariq ramkali quti: «TASHQI MODUL YUKLANDI» · «Sinov moduli ishlayapti»
3. Tugma «Bosing — hisob: 0» → bosilganda **1**, yana bosilganda **2**, va yashil qator:
   «✅ React BITTA nusxada — hook ishladi»
4. Konsolda xato **yo'q**

**Nosozlik holatlari va ma'nosi:**

| Ekranda | Ma'nosi |
|---|---|
| «Modul topilmadi: https://…» | Yuklovchi hamon yopiq ro'yxatdan qidiryapti (T-1 bajarilmagan) |
| Ochiladi, lekin tugmada «Invalid hook call» | Modul o'z React nusxasini olyapti — ikki nusxa (T-2 bajarilmagan) |
| `🔴 T-1b checks eksporti keldi` | Modul yuklandi, lekin nomli eksportlar o'tmayapti |
| Oq ekran | Xato ushlanmayapti (T-9 bajarilmagan) |

---

## 13. Qabul-mezonlari — ish «tayyor» sanaladi, qachonki

- [ ] **T-test 1 — yuklanish.** Sinov darsi ochilganda modul yuklanadi, kutilgan matn
      ko'rinadi, konsolda xato yo'q.
- [ ] **T-test 2 — bitta React (🔴 asosiy).** Tugma bosiladi, hisob `0 → 1 → 2` o'zgaradi.
      `Invalid hook call` **chiqmaydi**.
- [ ] **T-test 3 — kesh.** Bitta seansda modulni ishlatadigan 2 ta dars ketma-ket ochiladi.
      «Network» panelida modul **1 marta** yuklab olinadi.
- [ ] **T-test 4 — yangilanish ko'rinadi.** Modul fayli serverda almashtiriladi (manzil
      o'zgarmaydi). Sahifa yangilangach **1 daqiqa ichida** yangi nusxa ishlaydi.
- [ ] **T-test 5 — noto'g'ri manzil.** Mavjud bo'lmagan manzil beriladi. Oq ekran
      **bo'lmaydi**, tushunarli xato ko'rsatiladi.
- [ ] **T-test 6 — ruxsatsiz domen.** Ro'yxatda yo'q domendan import qilinadi.
      Yuklanmaydi, sababi aniq aytiladi.
- [ ] **T-test 7 — barqaror manzil.** Modul `/modules/html-compiler.jsx` manzilidan
      yuklanadi; fayl almashtirilgach **manzil o'zgarmaydi**.
- [ ] **T-test 8 — haqiqiy dars.** Haqiqiy kompilyator moduli bilan bitta haqiqiy dars
      ochiladi: praktika ekrani chiqadi, o'quvchi kod yozadi, shart-belgilari yonadi,
      natija oynasi ishlaydi.
- [ ] **T-test 9 — eskilar buzilmadi.** Tashqi modul ishlatmaydigan 2–3 ta mavjud dars
      avvalgidek ochiladi.

---

## 14. Tartib

1. **Siz:** T-1 va T-11 ni bajarasiz (manzil orqali yuklash + `.jsx`/`.js` masalasi).
2. **Biz:** mavjud sinov moduli bilan T-test 1 va 2 ni yuritamiz — 10 daqiqa.
3. **Siz:** T-5 va S-3 (barqaror manzil + `/modules/` yo'li) va qolgan talablar.
4. **Biz:** haqiqiy `html-compiler.jsx` ni tayyorlab beramiz.
5. **Birga:** T-test 3–9.
6. **Biz:** 28 ta darsni tashqi modulga o'tkazamiz.

---

## 15. Savol bo'lsa

Har bir talab yonida **nima uchun kerakligi** yozilgan. Agar biror talab sizning
arxitekturangizga to'g'ri kelmasa — ayting, muqobil yo'lni birga topamiz. Bizga
muhimi **natija** (bitta joyda tuzatish — hamma darsda ishlaydi), amalga oshirish
yo'li sizniki.
