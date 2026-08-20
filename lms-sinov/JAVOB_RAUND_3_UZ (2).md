# JAVOB — 3-raund: N-test 8 va ro'yxatga qo'yish

**Kimdan:** LMS (Coddy Camp) IT jamoasi · **Kimga:** Darslik-platforma jamoasi
**Sana:** 2026-08-14
**Nimaga javoban:** «LMS jamoasiga — N-test 8 O'TDI 🎉 + bitta so'rov»

---

## 0. Qisqa holat

| Nima | Holat |
|---|---|
| N-test 8 — haqiqiy dars, haqiqiy modul | ✅ **siz o'tkazdingiz** — tabriklaymiz |
| Modulingizni yuklab tekshirdik | ✅ toza (2-bo'lim) |
| **Ro'yxatga qo'yish — sizda huquq bor, o'zingiz qo'ya olasiz** | 🔵 **qo'llanma 4-bo'limda** |
| Ro'yxatdan keyin modul manzili boshqa bo'ladi | ⚠️ **3-bo'limni o'qing** |
| `sinov-modul` — endi shart emas | kelishildi, qo'ymaymiz |
| S-5 belgisi mo'rt ekan | siz haqsiz — `version.json` yozildi, chiqarilmagan (5-bo'lim) |

Asosiy yangilik: **kutish shart emas.** «Umumiy modullar» bo'limi sizning
rolingizga ochiq — nomni ham, nashrni ham o'zingiz qo'yasiz, bizdan navbat
kutmasdan. 4-bo'limda qadamma-qadam.

---

## 1. N-test 8 — kutib o'tirmaganingiz to'g'ri bo'ldi

Bu sizning natijangiz, biz faqat tasdiqlaymiz: yuklovchi, bitta React, hook'lar,
haqiqiy dars, konsolda nol xato — hammasi bir zanjirda ishladi. Rahmat.

Yon-natija: bu **S-1 javobimizni amalda tasdiqladi**. Modul Babel'dan o'tdi —
va aynan shu o'tish tufayli hook'lar ishladi. Kompilyatsiya bu yerda xavf emas,
u T-2 ning mexanizmi: `import "react"` ni `require("react")` ga o'girish
bo'lmasa, modul brauzerning o'z yuklovchisiga tushardi va ikkinchi React
nusxasini keltirardi. Ya'ni siz ko'rgan yashil natija tasodif emas, tuzilishning
o'zidan kelib chiqadi.

`HC_NASHR` eksporti — yaxshi qaror. Uni ro'yxat tekshiruvida ishlatamiz.

---

## 2. Modulingizni yuklab tekshirdik

Ro'yxatga qo'yishdan oldin faylni o'zimiz olib ko'rdik:

| Nima | Natija |
|---|---|
| Hajm | **98 252 bayt** |
| `import` satrlari | **bitta** — `react` (10-satr), boshqa hech narsa |
| Eksportlar | `default`, `checks`, `formatHtml`, `highlight`, `HC_NASHR` |
| `HC_NASHR` qiymati | `'2026-08-13'` |
| MD5 | `a9141db9671d73a65f1f7e2676aa74c4` |

Hammasi va'da qilinganidek. Bitta kichik tuzatish: xatingizda **96 252 bayt**
yozilgan, aslida **98 252**. Raqam almashib qolgan bo'lsa kerak — aytyapmiz,
chunki hajmni bir-birimizni tekshirishda ishlatyapmiz, keyin chalkashmasin.

---

## 3. ⚠️ Ro'yxatdan keyin modul manzili boshqa bo'ladi

Buni oldindan aytamiz, keyin «nega manzil o'zgardi» degan savol chiqmasin.

Ro'yxatga qo'yish sizning hozirgi manzilingizga **ko'rsatkich qo'yish emas**.
Faylni qaytadan yuklaysiz, u umumiy modullar omboriga tushadi va boshqa yo'ldan
beriladi:

```
hozir:      /uploads/course_artifacts/f9e30f4a….jsx
ro'yxatda:  /uploads/shared_modules/<boshqa-nom>.jsx
```

**Nega shunday — o'lchangan sabab.** Ikki yo'lning kesh sarlavhalari boshqa:

```
$ curl -sSI https://go.coddycamp.uz/uploads/shared_modules/…
cache-control: public, max-age=31536000, immutable      ← bir yil

$ curl -sSI https://go.coddycamp.uz/uploads/course_artifacts/…
(cache-control sarlavhasi umuman yo'q)                  ← har safar qayta yuklanadi
```

Ya'ni hozirgi manzilda dars har ochilganda 96 KB qaytadan tortiladi. Umumiy
modullar yo'lida esa fayl bir yil keshda yotadi, yangilanish esa faylga emas,
**ro'yxatga** keladi — shuning uchun yangi nashr o'quvchiga kesh oynasini
kutmasdan, darhol yetadi.

**Shundan kelib chiqadigan qoida:** yangi manzilni ham darsga yozib qo'ymang.
Darsda faqat `@shared/html-compiler` bo'lsin. Manzil — ichki tafsilot va **har
nashrda o'zgaradi**; bu nuqson emas, sxema shunday qurilgan (fayl o'zgarmas,
o'zgaradigani — ko'rsatkich).

Hozirgi darsingiz to'g'ridan-to'g'ri manzil bilan **ishlashda davom etadi** —
biz hech narsani o'chirmaymiz. Lekin uni ham nom ko'rinishiga o'tkazing.

---

## 4. Ro'yxatga qo'yish — qadamma-qadam qo'llanma

**Huquqingiz bor.** CRM da: chap menyu → **«Media kutubxona»** → **«Umumiy
modullar»**. Agar bo'lim ko'rinmasa — kim kira olmayotganini yozing, biz o'sha
kuni ochamiz.

### 4.1. Nomni yaratish (bir marta)

1. **«Yangi nom»** tugmasi (o'ng yuqorida).
2. **Nom** maydoniga: `html-compiler`
   ⚠️ Maydon oldida `@shared/` allaqachon yozib qo'yilgan — uni qayta yozmang.
   Faqat kichik harf, raqam va chiziqcha (`a–z`, `0–9`, `-`).
3. **Tavsif**: masalan `HTML/CSS/JS kompilyator`. Bu faqat jadvalda ko'rinadi.
4. **«Saqlash»**.

Jadvalda yangi qator paydo bo'ladi: **Import satri** ustunida `@shared/html-compiler`
— darsda aynan shu yoziladi. **Joriy nashr** ustunida hozircha `belgilanmagan`,
bu normal: nom bor, nashr yo'q.

### 4.2. Birinchi nashrni yuklash

1. O'sha qatordagi **«Yangi nashr»** tugmasi.
2. Faylni oynaga tashlang yoki tanlang — `.js` yoki `.jsx`, 20 MB gacha.
   Fayl sizda bor (`node scripts/build-shared-module.mjs` natijasi). Yo'q bo'lsa,
   serverdagi nusxangizdan olsangiz ham bo'ladi:
   ```bash
   curl -O https://go.coddycamp.uz/uploads/course_artifacts/f9e30f4aaecfeada4e3482bfe60877d2.jsx
   ```
   💡 Faylga ma'noli nom bering — masalan `html-compiler-2026-08-13.jsx`. Bu nom
   nashrlar ro'yxatida ko'rinadi, `f9e30f4a…` esa hech narsa demaydi.
3. **«O'zgarishlar»** maydoniga qisqacha yozing — masalan `HC_NASHR 2026-08-13,
   birinchi nashr`. Keyin qaysi nashr nima ekanini shu yerdan bilasiz.
4. **«Darhol joriy qilinsin»** belgisi yoqilgan tursin (u standart holatda yoqiq).
5. **«Yuklash»**.

Bo'ldi. **Joriy nashr** ustuni `1-nashr` ga aylanadi.

**Kutilgan mayda narsalar — xato emas:**

- `.js` yuklasangiz ham fayl serverda `.jsx` bo'lib saqlanadi. Bu ataylab:
  ixtiyoriy `.js` ni o'z domenimizdan berish xavfli, `.jsx` esa baribir
  `text/javascript` bo'lib qaytadi. Darsga bu umuman ko'rinmaydi.
- Fayl nomi tasodifiy belgilarga almashadi — yuqoridagi 3-bo'lim shu haqda.

### 4.3. Tekshirish — bizdan so'ramasdan

`registry.json` **keshlanmaydi** (`Cache-Control: no-cache`, ataylab), demak u
har doim haqiqiy holatni ko'rsatadi:

```bash
curl -s https://go.coddycamp.uz/modules/registry.json
```

Kutilgan javob:

```json
{"modules":{"html-compiler":{
  "versions":{"1":"/uploads/shared_modules/<nom>.jsx"},
  "current":"/uploads/shared_modules/<nom>.jsx"
}}}
```

Manzil `/` bilan boshlanadi — nisbiy. Yuklovchimiz uni ro'yxatning o'z manziliga
nisbatan yechadi, ya'ni ro'yxat boshqa domenga ko'rsata olmaydi. Sizga bu yerda
qiladigan ish yo'q, shunchaki nima ko'rishingiz.

`html-compiler` paydo bo'ldimi — N-testlarni boshlayvering.

### 4.4. Keyingi nashrlar va orqaga qaytarish

Bular ham sizda — bizni kutish shart emas:

- **Yangi nashr** — o'sha «Yangi nashr» tugmasi. Raqam avtomatik oshadi
  (2-nashr, 3-nashr…), eskilari joyida qoladi.
- **Orqaga qaytarish** — «Nashrlar» tugmasi ro'yxatni ochadi, kerakli nashrdagi
  **«Joriy qilish»** bosiladi. Hammasi shu: fayl qayta yuklanmaydi, ko'rsatkich
  ko'chadi, o'quvchiga darhol yetadi.
- **Nashrni qotirish** — darsda `@shared/html-compiler@2` deb yozsangiz, aynan
  2-nashr yuklanadi, `current` o'zgarsa ham.

Ya'ni **N-test 4, 5, 6 ni ham to'liq o'zingiz o'tkaza olasiz.**

⚠️ Nashrni o'chirish yo'q — ataylab. Sxemaning qiymati shundaki, eski nashrlar
joyida qoladi va qaytish bir bosishda bo'ladi.

---

## 5. S-5 — siz haqsiz, belgi mo'rt ekan

Tekshirdik, siz aytgan raqamlar aniq:

| Nima | Qiymat |
|---|---|
| Hozirgi fayl | `assets/LessonRunnerQuestion.B-k4JOBo.js` |
| Hajmi | 21 311 bayt |
| ETag | `"6a7da40f-533f"` |
| O'zgargan vaqti | 2026-08-13, 11:01 GMT |

Ya'ni kod joyida, faqat biz bergan **nom bir kunda eskirdi**. Xato raqamda emas,
mexanizmda: fayl nomi har yig'ilishda o'zgaradi, shuning uchun u belgi bo'la
olmaydi.

**Taklifingizni qabul qildik va yozdik.** Manzil o'zgarmas bo'ladi:

```
https://lms.coddycamp.uz/version.json
```

Javob shu ko'rinishda:

```json
{
  "build": "42",
  "commit": "a1b2c3d",
  "branch": "main",
  "built_at": "2026-08-14T10:00:28.562Z"
}
```

| Maydon | Ma'nosi |
|---|---|
| `build` | yig'ilish raqami — har chiqarishda **faqat oshadi**, ya'ni «qaysi biri yangi» bir qarashda ma'lum |
| `commit` | kod belgisi — qaysi kod yig'ilgani |
| `branch` | qaysi tarmoqdan |
| `built_at` | yig'ilgan vaqti (UTC) |

### ⚠️ Holat kodiga ishonmang, javob tanasini o'qing

Serverimiz noma'lum manzillarga `index.html` qaytaradi. Ya'ni `version.json`
**hali yo'q bo'lsa ham** javob `404` emas, **`200` va HTML** bo'ladi. Shuning
uchun tekshirishni JSON bo'yicha qiling:

```bash
curl -s https://lms.coddycamp.uz/version.json | head -c 200
```

JSON keldimi — belgi ishlayapti. HTML keldimi — demak hali chiqarilmagan.

### Va bu safar «chiqarildi» demaymiz

Ochig'ini aytamiz: **kod yozildi, lekin hali chiqarilmagan** — birlashtirish
navbatida turibdi. Ikki marta «chiqarildi» deb yozib, keyin noto'g'ri
chiqqanimiz uchun bu safar boshqacha qilamiz: yuqoridagi bitta buyruq bizning
xabarimizdan ko'ra ishonchli. HTML o'rniga JSON kelgan payt — chiqarilgan payt.

Aslida S-5 dagi kelishuvimiz shu bo'lishi kerak edi: belgi shunday bo'lsinki,
uni **tekshirish uchun bizdan so'rash shart bo'lmasin**.

Yon-eslatma: CRM tomonda bunday muammo yo'q — `registry.json` ning o'zi belgi
vazifasini bajaradi, chunki u keshlanmaydi va joriy holatni ko'rsatadi (4.3).

---

## 6. Keyingi qadamlar

| Qadam | Kim | Holat |
|---|---|---|
| N-test 8 (haqiqiy dars) | Siz | ✅ o'tdi |
| Modulni tekshirish | Biz | ✅ toza |
| `html-compiler` ni ro'yxatga qo'yish | **Siz** | 🔵 qo'llanma 4-bo'limda |
| N-test 1, 2, 3, 7 | Siz | ro'yxatga qo'ygandan keyin |
| Darslarni `@shared/html-compiler` ga o'tkazish | Siz | ro'yxatdan keyin |
| N-test 9 (eskilar buzilmadi) | Siz | navbatda |
| N-test 4, 5, 6 (yangilash / qaytarish / qotirish) | **Siz** | 4.4 — bizsiz ham bo'ladi |
| `version.json` (o'zgarmas belgi) | Biz | ✍️ yozildi, chiqarilmagan — 5-bo'lim |

Biror qadamda tiqilib qolsangiz — xabar qiling, ekran-surat bilan bo'lsa yanada
tez hal qilamiz.
