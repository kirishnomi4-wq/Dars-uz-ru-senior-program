# M4B-D2 — UYGA VAZIFA SENARIYSI: «Nosozlik-kartalari davom etadi»

> Fayl: `src/4b-Modull/PmLesson16.homework.jsx` · HW_ID `pm-m4b-02` · Naqsh: PmLesson2.homework (ETALON)
> Dars-manba: PmLesson16.jsx. Darsning To'liq-kapsulasi (HW_STEPS.toliq AYNAN): «① o'zingiz
> ishlatadigan ilovada uchragan nosozlikni eslang ② kartaga yozing: nima bosildi — nima bo'ldi,
> kimda, nima bo'ladi ③ javonini belgilang va sababini bir gap bilan yozing». Vazifa AYNAN shu.
> Tasdiq: foydalanuvchi 2026-09-02 («shoshilmasdan halol sifatli»).

## Maqsad (bitta ko'nikma)
Nosozlik his bilan emas, karta bilan boshqariladi: kartada FAKT (nima bosildi — nima bo'ldi),
navbatni esa ikki savol belgilaydi — kimda? ish to'xtaydimi? Javon hukmdan O'ZI chiqadi.

## 4 bosqich + Natija (mezon 4/4)

**1-bosqich · Kartalarim.** Darsdagi 3 karta (kirish-artefakt `pm-m4b2-sifat.kartalar`, avto):
nima (≥12) + kimda-chip (Hammada/Ba'zilarda) + oqibat-chip (Ish to'xtaydi/Noqulay lekin ishlaydi).
Validatorlar DARSDAN AYNAN: BOSH_RE (faqat «yomon/sekin…» — savol qaytariladi, BLOKLAMAYDI,
darsdagidek) · HARAKAT_RE+NATIJA_RE (fakt-maslahat, bloklamaydi) · normS-takror (bloklaydi).

**2-bosqich · Yangi karta.** O'z ilovasidagi nosozlik (kapsula ①–②): nima + kimda + oqibat,
takror emas. Validatorlar o'sha.

**3-bosqich · Javon.** Yangi kartaning javonini belgilash + sabab (≥12). HALOLLIK: darsda javon
hukmdan O'ZI chiqadi (o'quvchi tartib tanlamaydi) — shuning uchun tanlangan javon kartadagi ikki
hukmga MOS bo'lishi shart: hammada+to'xtaydi→🔴 Hozir · ba'zilarda+noqulay→⚪ Keyin · qolgan
ikkovi→🟠 Bugun. Nomos bo'lsa — darsdagi uslubda savol-note (javob yozib berilmaydi).

**4-bosqich · Xulosa.** 3 savol birma-bir (Kahoot):
1. Kartada nima yoziladi? → fakt: nima bosildi — nima bo'ldi, kimda, nima bo'ladi
2. Navbatni nima belgilaydi? → ikki savol: kimda? ish to'xtaydimi? (his emas)
3. «Ba'zilarda · noqulay» qaysi javonga? → ⚪ Keyin (darsdagi savol aynan)

**Natija.** 4/4 → bayram → 🏆 + Karta-javon: 4 karta (yangi aksent + javon-belgisi) →
«Vazifani topshirish».

## Payload
`{lessonId:'pm-m4b-02', kind:'homework', done, stages:'n/4', place:<javon nomi>, durationSec}`

## Relslar
Etalon-relslar · dars-kaliti faqat O'QILADI · misol-olam darsniki (skuter-ijara ilovasi).
