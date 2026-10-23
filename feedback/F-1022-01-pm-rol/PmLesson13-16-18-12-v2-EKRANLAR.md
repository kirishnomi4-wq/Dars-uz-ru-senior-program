# F-1022-01 · QISMAN darslar — m4-12 · m4b-02 · m4c-06 · m4-07 (ekranma-ekran, faqat o'zgaradigan joylar)

> Holat: **QORALAMA — kodga tegilmagan.** Har darsga: matn (uz+ru) + s0 mentor «Natijani ochish» + 111-qonun «Bu slayd nima uchun» 16/16 (mexanizm m3-10 dan). Uy vazifalari tegilmaydi. Test/arena to'g'ri javob o'rinlari o'zgarmaydi.
> Mentor «Bu slayd nima uchun» qatorlari — har darsning `SCREEN_INTENTS` matnidan («Bola…» → «O'quvchi…», mentor tilida); alohida jadvalga yozilmadi, kodda `MENTOR_WHY` sifatida 16 tadan yoziladi.

---

## A. m4-12 «Ilova nimani yozib qoladi?» — `src/4-Modull/PmLesson13.jsx` (9 joy)

**Muammo:** 10-ekran butunlay «dasturchi taklif qilgan sxema» ustiga qurilgan; o'quvchining dasturchisi yo'q — sxemani unga **AI** taklif qiladi.
**Yechim:** «AI (Gemini) taklif qilgan sxemani e'lon bilan solishtirib 2 xatoni topish». Mexanika aynan qoladi. «Sxema» atamasi o'z nomida.

| Ekran | | ❌ hozir | ✅ yangi |
|---|---|---|---|
| 06 · s5 test «Yangi ustun qachon?» | 1-variant (xato) | Dasturchi e'londa yo'q ustunni xohlaganda | AI e'londa yo'q ustunni qo'shganda |
| | to'g'ri izoh | Ustunni dasturchi emas, e'londagi gap ochadi. | Ustunni AI emas, e'londagi gap ochadi. |
| | 1-izoh | Dasturchining xohishi ustun ochmaydi — sabab boshqa joyda. | AI'ning taklifi ustun ochmaydi — sabab boshqa joyda. |
| 07 · s6 Amazon keysi | bashorat 1-chipi (xato) | Dasturchilarga topshiriq qilib | Jamoaga ish ro'yxati qilib |
| 10 · s9 tekshiruv | sarlavha | Dasturchining sxemasini uch shartdan o'tkazing. | AI taklif qilgan sxemani uch shartdan o'tkazing. |
| | mentor gapi | Dasturchi «Kitob navbati» ishiga shu sxemani taklif qildi — shartga mos kelmagan ustunni bosing. | Gemini «Kitob navbati» ishi uchun shu sxemani berdi — e'longa qarang, shartga mos kelmagan ustunni bosing. |
| | SCREEN_INTENTS s9 | Bola dasturchi taklif qilgan sxemani… | Bola AI taklif qilgan sxemani… |
| 16 · s15 arena «Sxema nima?» | 4-variant (xato) | Dasturchi kodi qatorlari | Saytning kod qatorlari |
| 16 · s15 arena «Sxemada yo'q narsani ilova ko'rsata oladimi?» | 3-variant (xato) | Yo'q, dasturchi ko'radi | Yo'q, faqat siz ko'rasiz |
| 16 · s15 yakun «Bugungi asosiy fikr» | | nimani saqlashni dasturchi emas, oldindan yozilgan e'lon hal qiladi. | nimani saqlashni AI emas, oldindan yozilgan e'lon hal qiladi. |

Amazon keysi matni (jamoa, uchinchi shaxs) — qoladi. s0 mentor «Natijani ochish» + 16 «Bu slayd nima uchun».

---

## B. m4b-02 «Bitta xato — nechta odam ketadi?» — `src/4b-Modull/PmLesson16.jsx` (6 joy)

**Muammo:** xato tutiladigan birinchi nuqta «Dasturchi stolida» — o'quvchi o'zi shu stolda o'tiradi (AI bilan kod yozadi).
**Yechim:** «Sizning stolingizda, AI bilan kod yozayotganda». Mexanika, Cyberpunk keysi, uch nuqta tuzilmasi qoladi.

| Ekran | | ❌ hozir | ✅ yangi |
|---|---|---|---|
| 05 · s4 yadro, 1-nuqta fakt | | Test tutdi — dasturchi shu zahoti tuzatdi. Odamlar hech narsani ko'rmadi | Test tutdi — siz shu zahoti tuzatdingiz. Odamlar hech narsani ko'rmadi |
| | 1-nuqta nomi | 🧑‍💻 Kod yozilayotganda | (o'zgarmaydi; emoji qoladi) |
| 06 · s5 test | savol | 🧑‍💻 Dasturchi nosozlikni kod yozilayotganda tutdi. Ilovaga nima bo'ladi? | 🧑‍💻 Siz nosozlikni AI bilan kod yozayotganda tutdingiz. Ilovaga nima bo'ladi? |
| 09 · s8 yozish, jonli javob | | ✅ Kartada fakt bor — dasturchi xuddi shu xatoni o'zida ko'ra oladi. | ✅ Kartada fakt bor — siz xuddi shu xatoni o'zingizda qaytarib ko'ra olasiz. |
| 09 · s8 mentor eslatmasi | | …siz muhokama qiling: dasturchi bu kartadan nimani tuzatadi?… | …siz muhokama qiling: o'quvchi bu kartadan nimani tuzatadi?… |
| 11 · s10 koding darvoza-savoli | 2-variant (to'g'ri) | Dasturchi stolida, kod yozilayotganda | Sizning stolingizda, kod yozilayotganda |
| | tasdiq-qatori | ✓ Dasturchi stolida, kod yozilayotganda | ✓ Sizning stolingizda, kod yozilayotganda |

s0 mentor «Natijani ochish» + 16 «Bu slayd nima uchun».

---

## C. m4c-06 «Saytingiz hozir ochilyaptimi?» — `src/4c-Modull/PmLesson18.jsx` (4 joy)

**Muammo:** «dasturchi» uchinchi shaxs — aslida o'quvchining o'zi (saytni o'zi yozgan).
**Yechim:** «siz». Mexanika o'zgarmaydi.

| Ekran | | ❌ hozir | ✅ yangi |
|---|---|---|---|
| 03 · s2 karta «O'lchagich bo'lmasa» | | Sayt ochilmay qolsa, buni birinchi bo'lib **kirgan odam** ko'radi — dasturchi emas. | Sayt ochilmay qolsa, buni birinchi bo'lib **kirgan odam** ko'radi — siz emas. |
| 04 · s3 test «kim bildi?» | 1-variant (xato) | Ertalab saytga kirgan dasturchi | Ertalab saytga kirgan siz |
| | 1-izoh | Ertalab kirgan dasturchi kechasi nima bo'lganini ko'rmaydi. | Ertalab kirganingizda kechasi nima bo'lganini ko'rmaysiz. |
| 07 · s6 holat bashorati | 1-chip (xato) | 🧑‍💻 Saytni yozgan dasturchi yozib qo'ygan | 🧑‍💻 Saytni yozganingizda o'zingiz yozib qo'ygansiz |

s0 mentor «Natijani ochish» + 16 «Bu slayd nima uchun».

---

## D. m4-07 «Sinfdoshingiz sahifangizni ochsa, nimani ko'radi?» — `src/4-Modull/PmLesson12.jsx` (1 joy)

| Ekran | | ❌ hozir | ✅ yangi |
|---|---|---|---|
| 07 · s6 ilovalar do'koni bashorati | 1-chip (xato) | 🧑‍💻 Dasturchilarga eslatma sifatida | 🧑‍💻 Ilovani yozganlar o'zi uchun eslatma qilib |

s0 mentor «Natijani ochish» + 16 «Bu slayd nima uchun».

---

## Hisob (to'rt dars)
- «dasturchi» 9 + 6 + 4 + 1 = 20 joy → 0 (uz+ru).
- Har darsda: `ScreenIdxCtx` + `MENTOR_WHY` (16 qator, SCREEN_INTENTS'dan mentor tilida) + bo'sh `<MentorNote />` eslatmasiz ekranlarga; s0 `mReveal` + «Natijani ochish» + `mentorLock`.
- Gates: har dars `npm run gates -- <fayl>` — `til` (`dasturchi-topshiriq`) 0, `tell` 0; `emoji` eski qarz bo'lsa HEAD bilan solishtiriladi va jurnalga yoziladi.
- `til-lint-rules.json` `allowFiles`: tuzatilgan darslar ro'yxatdan chiqariladi (PmLesson22, PmLesson13, PmLesson16, PmLesson18, PmLesson12; PmLesson8 ham — 22.10 da tuzatildi, lekin ro'yxatda qolgan bo'lsa).
