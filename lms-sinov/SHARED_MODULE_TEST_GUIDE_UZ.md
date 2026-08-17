# SINOV QO'LLANMASI — umumiy modulni nom orqali ulash

**Kimdan:** LMS (Coddy Camp) IT jamoasi · **Kimga:** Darslik-platforma jamoasi
**Sana:** 2026-08-13
**Nimaga:** TZ «LMS ↔ Dars-yurituvchi» v1.0 + sizning javobingiz (nom ko'rinishi tanlandi)

> ⚠️ **Avval holatni o'qing.** O'tgan safar biz «ishlaydi» deb yozdik, siz sinab
> ko'rdingiz va ishlamadi — chunki kod hali chiqarilmagan edi. Bu safar nima
> **tayyor**, nima **hali yo'q** — aniq yozilgan. Vaqtingizni behuda sarflamang.

---

## 1. Holat — nima tayyor, nima yo'q

| Qism | Holat | Sinash mumkinmi |
|---|---|---|
| **Server: `/modules/registry.json`** | ✅ ishchi serverda | **HA, hoziroq** |
| **Server: modul yuklash oynasi** | ✅ ishchi serverda | HA (bizning administrator orqali) |
| **Server: `.js` fayl qabul qilinishi** | ✅ | HA |
| **LMS: nom orqali import** | ❌ **hali chiqarilmagan** | **YO'Q** |
| **LMS: manzil orqali import** | ❌ **hali chiqarilmagan** | **YO'Q** |

**Ya'ni:** server tomoni tayyor va uni bugun tekshirsangiz bo'ladi. Dars ichidan
import qilish esa **hali ishlamaydi** — LMS'ning yangi versiyasi chiqarilmagan.
Chiqarilgach alohida xabar beramiz, o'shanda 5-bo'limdagi sinovlarni yurgizasiz.

Hozir foydali qiladigan ish: **modulni yuklab qo'yish** (3-bo'lim) va **ro'yxat
to'g'ri ko'rinayotganini tekshirish** (4-bo'lim). Shunda LMS chiqishi bilan
hammasi darhol sinovga tayyor bo'ladi.

---

## 2. Sizga nima o'zgardi

### Import satri

```js
// Asosiy ko'rinish — joriy nashr
import HtmlCompiler, { checks } from '@shared/html-compiler';

// Nashrga qotirish (ixtiyoriy)
import HtmlCompiler, { checks } from '@shared/html-compiler@3';
```

Darsda **na manzil, na domen** yoziladi. Bu sizning yig'uvchi skriptingiz uchun
ham qulay: TZ'ning 13-bo'limida siz «har darsda 1 ta satr» deb rejalashtirgan
edingiz — nom ko'rinishida skript o'zi almashtiradi, qo'lda tahrir umuman yo'q.

### Fayl kengaytmasi masalasi yopildi

Siz to'g'ri aniqlagan edingiz: yuklash oynasi faqat `.jsx` qabul qilardi. Endi
**`.js` ham, `.jsx` ham** qabul qilinadi. Ichkarida fayl `.jsx` sifatida
saqlanadi (bizning texnik sababimiz), lekin bu sizga umuman ko'rinmaydi — dars
faqat `@shared/nom` ni biladi.

### Manzil orqali import ham qoladi

`https://…` ko'rinishidagi import ham ishlaydi va olib tashlanmaydi. Lekin
**nomni tavsiya qilamiz** — sabablari taklif hujjatida.

---

## 3. Modulni nashr qilish

Yuklash CRM'dagi **«Umumiy modullar»** sahifasi orqali. Kirish huquqi
administratorlarda; sizga kerak bo'lsa — ayting, ochamiz yoki biz yuklab beramiz.

Tartib:

1. **«Yangi nom»** — bir marta. Nom: `html-compiler` (faqat kichik harf, raqam,
   chiziqcha). Darsda u `@shared/html-compiler` bo'lib yoziladi.
2. **«Yangi nashr»** — har chiqarishda. Faylni tashlaysiz, o'zgarishlarni
   yozasiz, «Darhol joriy qilinsin» belgilangan holda saqlaysiz.
3. Tayyor. Nashr raqami avtomatik o'sadi: 1, 2, 3, …

**Orqaga qaytarish:** «Nashrlar» → eski nashr yonidagi **«Joriy qilish»**. Fayl
qayta yuklanmaydi, hech narsa o'chmaydi — shunchaki ko'rsatkich almashadi.
Sizning TZ'ingizning 8-bo'limidagi xavf (nosoz nashr 18 ta darsni buzadi) shu
tugma bilan bir harakatda qaytariladi.

---

## 4. Ro'yxatni tekshirish — buni hoziroq qilsangiz bo'ladi

```
curl -sS -D- https://go.coddycamp.uz/modules/registry.json
```

Kutilgan javob:

```
HTTP/2 200
content-type: application/json; charset=utf-8
cache-control: no-cache
access-control-allow-origin: *

{"modules":{"html-compiler":{"versions":{"1":"/uploads/shared_modules/….jsx"},
 "current":"/uploads/shared_modules/….jsx"}}}
```

Hozir modul yuklanmagan bo'lsa `{"modules":{}}` qaytadi — bu ham to'g'ri javob.

Nimaga e'tibor berish kerak:

- **`cache-control: no-cache`** — bu sizning 3.1 talabingiz. Modul fayllari bir
  yilga keshlanadi, shuning uchun ro'yxat yagona yangilanish kanali; u keshlansa
  yangi nashr **hech qachon** yetib bormaydi va buni sezish qiyin bo'lardi.
- **`access-control-allow-origin: *`** — LMS boshqa domenda.
- **Javob toza JSON** bo'lishi kerak, oldida hech qanday matn yo'q.

Modul faylining o'zini ham tekshirib ko'ring:

```
curl -sS -D- https://go.coddycamp.uz/uploads/shared_modules/<fayl>.jsx | head
```

Kutilgani: `content-type: text/javascript; charset=utf-8`,
`cache-control: public, max-age=31536000, immutable`, CORS `*`.

---

## 5. Sinovlar — LMS chiqarilgandan keyin

Sizning javobingizdagi N-test ro'yxati. Belgilangan joylarni to'ldirib
qaytarsangiz — biz shu bo'yicha tuzatamiz.

- [ ] **N-test 1 — nom bilan yuklanish.** `@shared/html-compiler` import qilgan
      sinov darsi ochiladi; ekranda kutilgan narsa ko'rinadi, konsolda xato yo'q.
- [ ] **N-test 2 — 🔴 bitta React.** Sinov modulidagi tugma bosiladi, hisob
      0 → 1 → 2. `Invalid hook call` **chiqmaydi**. Eng muhim sinov.
- [ ] **N-test 3 — kesh.** Bitta seansda shu modulni ishlatadigan 2 ta dars
      ketma-ket ochiladi. «Network» panelida modul **1 marta**, `registry.json`
      ham **1 marta** so'raladi.
- [ ] **N-test 4 — yangilanish.** Yangi nashr yuklanadi va joriy qilinadi.
      Sahifa yangilangach, yangi nusxa **darhol** ishlaydi — darsga tegilmaydi.
- [ ] **N-test 5 — orqaga qaytarish.** «Joriy qilish» bilan oldingi nashr
      tanlanadi. Sahifa yangilangach eski nusxa qaytadi.
- [ ] **N-test 6 — versiyaga qotirish.** `@shared/html-compiler@3` yozilgan dars
      joriy nashr o'zgarganda ham 3-nashrda qoladi.
- [ ] **N-test 7 — noma'lum nom.** `@shared/yoq-bunday-nom` yoziladi. Oq ekran
      **bo'lmaydi**; xabarda mavjud nomlar ro'yxati ko'rsatiladi.
- [ ] **N-test 8 — haqiqiy dars.** Haqiqiy kompilyator moduli bilan bitta
      haqiqiy dars: praktika ekrani, shart-belgilari, natija oynasi.
- [ ] **N-test 9 — eskilar buzilmadi.** Umumiy modul ishlatmaydigan 2–3 ta
      mavjud dars avvalgidek ochiladi.
- [ ] **N-test 10 — ro'yxat ishlamaganda.** Buni biz o'zimiz sinab qo'yamiz
      (ro'yxatni vaqtincha o'chirish kerak). Kutilgani: oxirgi ma'lum ro'yxat
      bilan dars ochilaveradi, konsolda ogohlantirish chiqadi.

Bizning tomonda avtomatik sinovlar 23/23 o'tdi — shu jumladan bitta React,
seansda bitta so'rov, noma'lum nom, noma'lum nashr, ro'yxat ishlamagan holat va
10 soniyalik kutish muddati. Lekin **brauzersiz tekshirib bo'lmaydigan** ikkitasi
qoldi: N-test 4 (kesh brauzerda) va N-test 8 (haqiqiy modul) — ular aynan
birgalikdagi qabul uchun.

---

## 6. Xato xabarlari — nimani ko'rasiz

Modul yuklanmasa oq ekran bo'lmaydi. Ekrandagi sarlavha — «Dars moduli
yuklanmadi», ostida sabab. Ajratiladigan holatlar:

| Holat | Xabarda nima bo'ladi |
|---|---|
| Ro'yxatda bunday nom yo'q | mavjud nomlar sanab beriladi |
| Bunday nashr yo'q | mavjud nashrlar sanab beriladi |
| Ro'yxat yuklanmadi va zaxira ham yo'q | ro'yxat manzili va sabab |
| Ruxsat etilmagan domen | domen nomi va ruxsat etilganlar ro'yxati |
| Modul yuklanmadi / 404 | manzil va HTTP kodi |
| Kutish muddati tugadi | 10 soniya, manzil |
| Modul ichida bajarish xatosi | modul manzili va xato matni |
| Kutilgan eksport topilmadi | qaysi eksport yo'q + mavjudlari |

Oxirgisi darsning o'z `import` satrini o'qiydi, ya'ni `checks` yozib qo'yib uni
eksport qilmasangiz — aynan shunday deb aytadi, dars keyinroq tushunarsiz joyda
qulamaydi.

---

## 7. Sizning 3.1–3.6 so'rovlaringiz

| | So'rov | Holat |
|---|---|---|
| 3.1 | `registry.json` keshlanmasin | ✅ `Cache-Control: no-cache` |
| 3.2 | Ro'yxat ishlamaganda zaxira | ✅ oxirgi ma'lum ro'yxat saqlanadi + ogohlantirish |
| 3.3 | Nashr raqami, raqamsiz = joriy | ✅ aynan shunday |
| 3.4 | Ro'yxatga nima yozilishi cheklansin | ✅ yozish faqat administrator orqali; ro'yxat bergan manzil ham domen tekshiruvidan o'tadi |
| 3.5 | Kompilyator faqat kerak bo'lganda yuklansin | ❌ **bajarilmadi** |
| 3.6 | «Bunday nom yo'q» xatosi | ✅ mavjud nomlar bilan |

**3.5 haqida ochiq.** Buni qilish uchun dars ichida dinamik import kerak, uni
brauzerga to'g'ridan-to'g'ri berib bo'lmaydi — u modulni o'zi yuklab, ikkinchi
React nusxasini keltiradi va T-2 buziladi. Ya'ni alohida yuklovchi va alohida
o'zgartirish kerak, bu esa darsni yozish qoidasini o'zgartiradi: praktika
ekranida `await` va «yuklanmoqda» holati paydo bo'ladi. Hozircha kelishilgan
holda qoldirdik. Kerak bo'lsa — alohida ish sifatida kelishamiz.

---

## 8. Bizga sizdan nima kerak

1. **Sinov moduli** — sizda tayyor, o'zgartirish shart emas.
2. **Sinov dars fayli** — import satri **nom ko'rinishida** qayta yozilgan
   (`@shared/…`). Javobingizning 8-bo'limida shuni va'da qilgansiz.
3. **Haqiqiy kompilyator moduli** — N-test 8 uchun.
4. Ro'yxatga qo'shiladigan **nomni tasdiqlash**: `html-compiler` — shundaymi?

---

## 9. Tartib

1. **Siz:** hozir 4-bo'limni tekshirasiz (ro'yxat, sarlavhalar) va xohlasangiz
   modulni yuklab qo'yasiz.
2. **Biz:** LMS'ni chiqaramiz va sizga aniq aytamiz — qaysi manzilda sinash
   kerak. Bu safar «tayyor» deganda haqiqatan chiqarilgan bo'ladi.
3. **Siz:** N-test 1, 2, 3 — 10 daqiqa.
4. **Birga:** N-test 4–9.
5. **Siz:** darslarni nom ko'rinishiga o'tkazasiz (sizda avtomatik).

Shoshilinch emas — hozirgi usul (kompilyatorni dars ichiga yig'ish) ishlab
turibdi va to'xtab qolgan narsa yo'q.
