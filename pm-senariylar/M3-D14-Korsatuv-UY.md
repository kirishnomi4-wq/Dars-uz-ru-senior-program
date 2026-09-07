# M3-D14 — UYGA VAZIFA SENARIYSI: «Ko'rsatuvni haqiqiy saytda sinang»

> Fayl: `src/3-Modull/PmLesson10.homework.jsx` · HW_ID `pm-m3-14` · Naqsh: PmLesson2.homework (ETALON)
> Dars-manba: PmLesson10.jsx. Darsning To'liq-kapsulasi: «3 kadrni oching-o'qing → aytgan
> harakatingizni chindan bajaring → mos kelmagan kadrni tuzating». Vazifa AYNAN shu.
> Tasdiq: foydalanuvchi 2026-09-02 («shoshilmasdan yaxshilab»).

## Maqsad (bitta ko'nikma)
Ko'rsatuv qog'ozda emas, ISHLAYOTGAN saytda sinaladi: kadrda aytilgan harakat chindan bajarilib,
ekran gapga mos kelishi tekshiriladi; mos kelmagani qayta yoziladi.

## 4 bosqich + Natija (mezon 4/4)

**1-bosqich · 3 kadrim.** Darsdagi ish + 3 kadr (kirish-artefakt `pm-m3d14-pitch`, avto-to'ladi).
Har kadr: Gap (≥12; darsdagi ekran-takror tekshiruvi — OGOHLANTIRISH, blok emas, darsdagidek) +
Harakat (1–5 so'z). Kadr nomlari darsdan: Ilgari qanday edi · Mana, ishlaydi · Endi nima oson.

**2-bosqich · Haqiqiy sinov.** Har kadr uchun: harakatni saytingizda CHINDAN bajaring va belgilang:
🙂 «Ekran gapimga mos keldi» / 😕 «Mos kelmadi». Uchala kadr belgilanadi.

**3-bosqich · Tuzatish.** Halol-qulf: birorta kadr 😕 bo'lsa «o'zgartirmayman» yopiq — mos
kelmagan kadr tanlanib, gap va harakat qayta yoziladi (yangi gap eskisidan farq qilsin,
validatorlar o'sha). 3/3 🙂 bo'lsa «Hammasi mos — o'zgartirmayman» ochiq.

**4-bosqich · Xulosa.** 3 savol birma-bir (Kahoot):
1. «Bo'sh gap» nima? → ekranda ko'rinib turganini takrorlagan gap
2. Har kadr nimadan iborat? → bitta gap + bitta harakat
3. Ko'rsatuvda qaysi joy bosiladi? → ish chindan bajariladigan joy

**Natija.** 4/4 → bayram → 🏆 + Ko'rsatuv-kartasi: ish + 3 kadr (gap + 👆 harakat, tuzatilgani
eski→yangi, sinov-natijasi 🙂/😕 chip) → «Vazifani topshirish».

## Payload
`{lessonId:'pm-m3-14', kind:'homework', done, stages:'n/4', place:<ish nomi>, durationSec}`

## Relslar
Etalon-relslar · dars-kaliti faqat O'QILADI · validatorlar darsdan aynan (gap≥12 ·
ekranniTakror warn · harakat 1–5 so'z) · misol-olam darsniki (maydoncha.uz).
