# JAVOB — 2-raund sinov natijasiga

**Kimdan:** LMS (Coddy Camp) IT jamoasi · **Kimga:** Darslik-platforma jamoasi
**Sana:** 2026-08-13
**Nimaga javoban:** «LMS jamoasiga — 2-raund sinov natijasi: manzil yo'li ISHLADI»

---

## 0. Avvalo — jadval haqida haqsiz

Siz haqsiz, uzr. Sabab ham aniq, yashirmaymiz:

| Vaqt (Toshkent) | Nima bo'ldi |
|---|---|
| 11:32 | LMS `staging` ga chiqarildi |
| **11:44** | LMS **ishchi serverga** chiqarildi |
| 12:21 | Biz sizga «hali chiqarilmagan» deb yozdik |

Ya'ni kod siz sinaganda allaqachon ishlab turgan edi — biz esa 37 daqiqa oldingi
holatga qarab yozdik. Bu ikkinchi marta takrorlandi, shuning uchun **S-5 ni
to'liq qabul qilamiz** va pastda darhol beramiz: endi har «chiqarildi»
xabarimizda siz o'z ko'zingiz bilan tekshiradigan belgi bo'ladi.

Qolgan hamma narsa — javoblar, punkt-punkt. Ikkitasi allaqachon serverda:

| | Nima | Holat |
|---|---|---|
| S-2 | `shared_modules` yo'lida `immutable` kesh sarlavhasi | ✅ bor edi, o'lchab tasdiqladik |
| S-3 | `registry.json` dan seans-cookie olib tashlandi | ✅ bugun chiqarildi |
| S-3b | `HEAD` 403 qaytarardi — tuzatildi | ✅ bugun chiqarildi |
| S-4 | Sinov moduli ro'yxatda | ⏳ hali yo'q, ro'yxat bo'sh |

---

## S-1. Modul JSX-kompilyatsiyasidan o'tadimi?

**O'tadi — har doim. Va bu shart.** Lekin qo'rqqan narsangiz bo'lmaydi.

**Nega shart.** Modul `import ... from "react"` yozadi, `export default` qiladi.
Bularni `require`/`exports` ga o'girish kerak — aynan shu o'girish tufayli
moduldagi `react` bizning ilovamiz Reactiga tushadi. Agar modul «sof JavaScript»
sifatida, o'girilmasdan bajarilsa, uni brauzerning o'z `import()` i yuklaydi,
u esa `react` ni yechaolmaydi va ikkinchi React nusxasini keltiradi — **T-2
buziladi**. Ya'ni kompilyatsiya — ortiqcha yuk emas, T-2 ning mexanizmi.

**Kengaytma hech narsaga ta'sir qilmaydi.** Kompilyatorga fayl nomi doim
qat'iy `remote-module.js` deb beriladi, manzildagi `.jsx` / `.js` / kengaytmasiz
holat o'qilmaydi ham. Uch holat ham bitta natija beradi.

**`a < b`, `x > y` noto'g'ri tahlil qilinmaydi.** JSX faqat *ifoda boshlanadigan*
joyda ochiladi; `a` dan keyin kelgan `<` — bir ma'noli taqqoslash belgisi.
Tekshirdik: taqqoslashlarga to'la ESM matnini o'girdik —
`a < b && x > y || n < 10 && n > 2` o'zgarmagan holda chiqdi, `react` esa
`require("react")` ga aylandi, `.jsx` va `.js` uchun natija **bayt-baytga bir xil**.

**Narxi — o'lchadik.** 110 KB modul: **~270–400 ms**, va **seansda bir marta**.
Modul keshi manzil bo'yicha saqlanadi va tayyor eksportlarni tutadi, shuning
uchun 2-, 3-, 10-dars uni qayta o'girmaydi.

Bu hozirgi holatdan **arzonroq**. Hozir kompilyator dars ichida yig'ilgan, ya'ni
~400 KB **har dars ochilishida** o'giriladi. Nom sxemasida dars ~330 KB bo'ladi
va 110 KB seansda bir marta o'giriladi.

**Xulosa:** modulni sof ESM qilib (JSX'siz) berish rejangiz to'g'ri — JSX
buzilgani uchun emas, shunchaki modul o'qishga qulay bo'lgani uchun. Zarurat yo'q.

---

## S-2. `shared_modules` yo'lida `Cache-Control` bormi?

**Bor.** Ishchi serverda hozir o'lchab ko'rsatamiz:

```
GET https://go.coddycamp.uz/uploads/shared_modules/<istalgan fayl>
cache-control: public, max-age=31536000, immutable     ✅
access-control-allow-origin: *                          ✅
```

Siz sinagan fayl `/uploads/course_artifacts/` da turibdi — bu boshqa katalog,
unga bu qoida qo'yilmagan. O'lchoveringiz to'g'ri, taxminingiz ham to'g'ri.

Modul ro'yxatga qo'yilgach fayl `/uploads/shared_modules/` ga tushadi va
sarlavhani o'zingiz ko'rasiz.

---

## S-3. `registry.json` — statik faylmi yoki PHP?

**PHP.** Manzil `.json` bilan tugaydi (kelishuvimiz shunday edi), lekin ichkarida
u `modules/registry.php` ga yo'naltiriladi.

`Set-Cookie: PHPSESSID` — CRM yadrosi seans ochgani uchun chiqardi. CDN haqidagi
fikringiz to'g'ri, shuning uchun **olib tashladik** — bugun, 13-avgust, soat
15:00 atrofida chiqarildi. `expires: 1981` va `pragma: no-cache` ham o'sha
seansdan kelardi, ular ham ketdi. Hozirgi javob:

```
GET https://go.coddycamp.uz/modules/registry.json

HTTP/2 200
content-type: application/json; charset=utf-8
cache-control: no-cache                          ✅ ataylab, o'zgarmadi
access-control-allow-origin: *
access-control-allow-methods: GET, HEAD, OPTIONS
                                                 🚫 set-cookie — yo'q
                                                 🚫 expires    — yo'q
                                                 🚫 pragma     — yo'q
```

O'zingiz o'lchab ko'ring — bir so'rov yetadi.

---

## S-3b. Biz topgan kamchilik — `HEAD` 403 qaytarardi (tuzatildi ✅)

Bu savolingiz emas — o'lchayotganimizda o'zimiz duch keldik va aytib qo'yamiz,
chunki siz ham shunga urilishingiz aniq edi:

```
GET     /modules/registry.json → 200 ✅
OPTIONS /modules/registry.json → 204 ✅
HEAD    /modules/registry.json → 403 🔴   ← shunday edi
```

Sababi: serverda `HEAD` ni bloklaydigan eski umumiy qoida bor edi, va u faqat
manzil haqiqiy faylga to'g'ri kelmagan holatda ishlardi. `registry.json` —
yo'naltirilgan manzil, shuning uchun blokka tushardi; `registry.php` esa —
haqiqiy fayl, u normal javob berardi. Shuning uchun manzarasi chalkash edi.

**Bu sizga muhim**, chunki sarlavhalarni odatda `curl -I` bilan o'lchashadi, u
esa aynan `HEAD` yuboradi.

**Tuzatildi**, o'sha chiqarishda (13-avgust, ~15:00). Endi:

```
$ curl -sSI https://go.coddycamp.uz/modules/registry.json

HTTP/2 200                                       ✅
cache-control: no-cache
content-type: application/json; charset=utf-8
```

`HEAD` — xavfli usul emas, u standart bo'yicha tanasiz `GET`.

---

## S-4. Nom va yuklash huquqi

**`html-compiler`** — kelishildi, shu qoladi.

**Sinov modulini `sinov-modul` nomi bilan ro'yxatga qo'yamiz** — ma'qul, siz
N-testlarni kuta olmay turibsiz, buni to'siq deb tushunamiz.

⚠️ Ochiq aytamiz: **bu xat yozilayotgan payt ro'yxat hali bo'sh** —
`{"modules":{}}`. Modul qo'yilgach alohida xabar beramiz, unda nom va fayl
manzili bo'ladi. Undan oldin N-test 1, 3, 5, 6, 7 ni yurgizishga urinmang.

Kirish huquqi (variant **a**) — mumkin, CRM'da bu oddiy rol sozlamasi. Kim uchun
ochish kerakligini ayting (ism va CRM'dagi login), biz beramiz. Haftasiga 1–2
nashrni o'zingiz boshqarganingiz ikkalamiz uchun ham qulay — roziyiz.

---

## S-5. Chiqarish belgisi — qabul qilindi, mana

**Sinash manzili: `https://lms.coddycamp.uz`** — shu, boshqasi emas.

⚠️ **`lms-coddy.vercel.app` da sinamang.** Bu boshqa, eskirgan chiqarish; yangi
kod u yerda **yo'q** (tekshirdik: kerakli fayl 404). Agar oldin o'sha manzilda
sinagan bo'lsangiz — chalkashlikning yana bir manbai shu bo'lishi mumkin.

**Joriy chiqarish belgisi:**

| | |
|---|---|
| Fayl | `/assets/LessonRunnerQuestion.D_V_XsWq.js` |
| Hajmi | 21 311 bayt |
| ETag | `"6a7d67e7-533f"` |
| Chiqarilgan | 2026-08-13, 11:44 (Toshkent) |

Bir qatorda tekshirish — `1` chiqsa, sizdagi build aynan shu:

```bash
curl -sS https://lms.coddycamp.uz/assets/LessonRunnerQuestion.D_V_XsWq.js \
  | grep -c remote_module_forbidden_origin
```

Bundan keyin har «chiqarildi» xabarimizda shu to'rt qator bo'ladi. Fayl nomidagi
harflar har chiqarishda o'zgaradi — yangi nomni o'zimiz aytamiz.

Avtomatik sinovlar (23/23) aynan shu kodga tegishli.

---

## S-6. React 18.3.1 — qat'iymi?

Hozir `18.3.1`, va yaqin rejada 19 ga o'tish **yo'q**.

Tahlilingiz to'g'ri: `useState`, `useEffect`, `useLayoutEffect`, `useRef`,
`useMemo`, `isValidElement` — 19 da ham o'zgarmagan, moslik to'liq.

O'tish qaroriga kelsak — **oldindan aytamiz**, chiqarishdan keyin emas. Xavotiringiz
o'rinli: modul bitta bo'lgani uchun nosozlik 19 ta darsga birdan tegadi.

---

## S-7. 3.5 — yopildi

Rahmat. Talablar ro'yxatidan olib tashladik, hujjatlarimizda ham shunday yozildi.

---

## Sizning tuzatishlaringiz haqida

Raqamlarni o'zingiz tuzatganingiz uchun rahmat — 18% va 19 ta dars deb yozib
qo'ydik. **Ishning sababi o'zgarmaydi:** bitta joyda tuzatish 19 ta darsga
birdan tegadi, va 9-avgustdagi 7 ta tuzatish 7 marta 19 ta fayl qayta yig'ish
degani edi. Hajm — bu ishning ikkinchi darajali foydasi.

Qo'shimcha: seans keshi tufayli o'quvchi ketma-ket bir necha dars ochsa,
kompilyator faqat birinchisida o'giriladi (S-1). Ya'ni tejam 18% dan biroz
ko'proq, lekin buni siz o'zingiz o'lchaganingiz ma'qul.

---

## Keyingi qadamlar

| # | Kim | Nima | Holat |
|---|---|---|---|
| 1 | Biz | `registry.json` dan seans-cookie, `HEAD` bloki | ✅ **bajarildi** (S-3, S-3b) |
| 2 | Biz | `sinov-modul` ni ro'yxatga qo'yish | ⏳ navbatda, xabar qilamiz |
| 3 | Biz | Kirish huquqi — kimga ochilsin? | ⏸ ismlarni kutamiz (S-4) |
| 4 | Siz | Ro'yxat to'lgach N-test 1, 2, 3, 7 | ⏸ 2-qadamdan keyin |
| 5 | Siz | Haqiqiy kompilyator moduli (JSX'siz ESM — S-1 ga ko'ra shart emas, lekin ma'qul) | ⏳ sizda |
| 6 | Birga | N-test 4, 5, 6 — ikkinchi nashr yuklangach | ⏸ |

N-test 9 (eskilar buzilmadi) sizda — kutamiz. N-test 10 (ro'yxat ishlamaganda)
bizda, avtomatik sinovda o'tgan, siz ham tekshirsangiz bo'ladi.

Va yana bir bor — T-2 ni siz tasdiqlaganingiz eng muhimi edi. Rahmat.
