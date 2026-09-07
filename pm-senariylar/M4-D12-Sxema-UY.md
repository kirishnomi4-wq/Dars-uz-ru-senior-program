# M4-D12 — UYGA VAZIFA SENARIYSI: «Sxemangiz o'sadi»

> Fayl: `src/4-Modull/PmLesson13.homework.jsx` · HW_ID `pm-m4-12` · Naqsh: PmLesson2.homework (ETALON)
> Dars-manba: PmLesson13.jsx. Darsning To'liq-kapsulasi: «① odamning yangi savolini toping
> ② unga ustun oching: nomi, belgisi, savoli ③ sxemangizni uch shartdan o'tkazing». Vazifa AYNAN shu.
> Tasdiq: foydalanuvchi 2026-09-02.

## Maqsad (bitta ko'nikma)
«Ustunni e'lon ochadi» qoidasi uyda davom etadi: yangi ustun odamning haqiqiy savolidan tug'iladi
va butun sxema darsdagi uch shartdan o'tkaziladi.

## 4 bosqich + Natija (mezon 4/4)

**1-bosqich · Sxemam.** Darsdagi 3 ustun (kirish-artefakt `pm-m4d12-sxema.ustunlar`, avto-to'ladi):
nom (≥4) + 👁/🔒 belgisi + odam tilidagi savol. Validatorlar DARSDAN AYNAN: savol ≥10 belgi va
≥3 so'z · takrorNom (savol ustun nomining o'zi bo'lmasin) · juftOxshash (oldingi savollar bilan
≥70% mos kelmasin).

**2-bosqich · Yangi ustun.** Odamning YANGI savoli (≥10) + unga ustun: nom + belgi + savol
(validatorlar o'sha, mavjud uchta bilan solishtiriladi).

**3-bosqich · Uch shart.** Darsdagi uch shart, har biriga halol chip «O'tdi / O'tmadi»:
① har ustun e'londagi gapdan chiqqanmi ② yopiq ma'lumot 🔒 belgilanganmi ③ har gapga ustun bormi.
«O'tmadi» tanlansa — qaysi joyi va bir qator izoh (≥8) yoziladi; uchchala «O'tdi» ham halol yo'l.

**4-bosqich · Xulosa.** 3 savol birma-bir (Kahoot):
1. Ilova nimani biladi? → faqat sxemaga yozilganini
2. Ustunni nima ochadi? → odamning e'lon-gapi (dasturchi xohishi emas)
3. E'londa yo'q «balki kerak bo'lar» ustuni → sxemaga kirmaydi

**Natija.** 4/4 → bayram → 🏆 + Sxema-kartasi: 4 ustun (yangi ustun aksent, belgi + savol) +
uch shart natijasi → «Vazifani topshirish».

## Payload
`{lessonId:'pm-m4-12', kind:'homework', done, stages:'n/4', place:<yangi ustun nomi>, durationSec}`

## Relslar
Etalon-relslar · dars-kaliti faqat O'QILADI · validatorlar darsdan aynan · misol-olam darsniki
(maktab kutubxonasi) — placeholderlar shundan.
