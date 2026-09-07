# M4-D15 — UYGA VAZIFA SENARIYSI: «Uch gapni jonli odamda sinang»

> Fayl: `src/4-Modull/PmLesson14.homework.jsx` · HW_ID `pm-m4-15` · Naqsh: PmLesson2.homework (ETALON)
> Dars-manba: PmLesson14.jsx. Darsning To'liq-kapsulasi: «① kod bilmaydigan odamga uch gapingizni
> aytib bering ② u qaytadan so'ragan gapni tuzating ③ tuzatilgan gapni qayta saqlang». Vazifa AYNAN shu.
> Tasdiq: foydalanuvchi 2026-09-02.

## Maqsad (bitta ko'nikma)
Uch qavat-gap («Sahifa ko'rsatadi · Server tekshiradi · Baza eslab qoladi») kod bilmaydigan
odamda sinaladi: qaytadan so'ralgan gap — tushunarsiz gap, u tuzatiladi.

## 4 bosqich + Natija (mezon 4/4)

**1-bosqich · Uch gapim.** Darsdagi 3 gap (kirish-artefakt `pm-m4d15-pitch.qavatlar`, avto-to'ladi).
Har qavat o'z nomi+fe'li bilan (darsdan aynan). Validatorlar DARSDAN AYNAN: gap ≥14 belgi ·
TEXNIK_RE elagi (fetch/json/api/postgresql/token… — topilgan so'z ko'rsatiladi).

**2-bosqich · Suhbat.** Kimga aytdi (chip: oila a'zosi · qo'shni · do'st · o'qituvchi) + har gap
uchun halol belgi: «Tushunishdi 🙂» / «Qayta so'rashdi 🤔» (hurmat-shakl — F-0828-09 relsi).

**3-bosqich · Tuzatish.** Halol-qulf: birorta gap «qayta so'rashdi» bo'lsa «o'zgartirmayman»
yopiq — o'sha gap(lar)dan biri tanlanib qayta yoziladi (validatorlar o'sha + eskidan farq qilsin).
3/3 🙂 bo'lsa «Tushunishdi — o'zgartirmayman» ochiq.

**4-bosqich · Xulosa.** 3 savol birma-bir (Kahoot):
1. Uch qavat o'z fe'li bilan → Sahifa ko'rsatadi · Server tekshiradi · Baza eslab qoladi
2. Texnik qarorni odamga nima tushuntiradi? → foydasi (texnologiya nomi emas)
3. Qaysi gap tuzatiladi? → odam qaytadan so'ragani

**Natija.** 4/4 → bayram → 🏆 + Uch-qavat kartasi: har qavat o'z gapi bilan (tuzatilgani
eski→yangi, sinov-belgilari) + tinglovchi-chip → «Vazifani topshirish». M4 shu yerda yopiladi.

## Payload
`{lessonId:'pm-m4-15', kind:'homework', done, stages:'n/4', place:<tinglovchi>, durationSec}`

## Relslar
Etalon-relslar · dars-kaliti faqat O'QILADI · validatorlar darsdan aynan · hurmat-shakl
(«tushunishdimi/so'rashdi») katta tinglovchiga.
