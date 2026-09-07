# M4C-D6 — UYGA VAZIFA SENARIYSI: «Chegarangiz sinovda»

> Fayl: `src/4c-Modull/PmLesson18.homework.jsx` · HW_ID `pm-m4c-06` · Naqsh: PmLesson2.homework (ETALON)
> Dars-manba: PmLesson18.jsx. Darsning To'liq-kapsulasi (HW_STEPS.toliq AYNAN): «① saytingizni
> oching, F12 → Network'ni oching va sahifani uch marta yuklang ② har yuklashda holat va vaqtni
> yozib oling ③ har birini chegarangiz bilan solishtiring: signal chiqdimi? Sababini bir gapda
> yozing». Vazifa AYNAN shu.
> Tasdiq: foydalanuvchi 2026-09-02 («shoshilmasdan halol sifatli»).

## Maqsad (bitta ko'nikma)
Chegara odam seza boshlaydigan joyga qo'yiladi va HAQIQIY o'lchov bilan sinaladi: Network'dagi
holat+vaqt raqamlari chegara bilan solishtiriladi — signal chiqdimi, hukmni son chiqaradi.

## 4 bosqich + Natija (mezon 4/4)

**1-bosqich · Chegaralarim.** Darsdagi 3 signal-qoida (kirish-artefakt `pm-m4c6-signal.signallar`,
avto): uch o'lchagich DARSDAN AYNAN (🟢 Sayt ochiladimi·daqiqa / ⏱ Javob vaqti·soniya /
❌ Xatolar·100dan) + chegara-son (sonOqi: faqat raqam) + sabab (≥10). Validatorlar DARSDAN
AYNAN: sonOqi/uzun bloklaydi; BOSH_SOZ («muhim…», odam-belgisiz) va past-chegara (vaqt<1 s,
xato=0) — 🤔 savol, darsdagidek BLOKLAMAYDI.

**2-bosqich · Network-o'lchov.** Kapsula ①–②: sahifa 3 marta yuklanadi, har yuklashda holat
(status-son) va vaqt (ms) yoziladi — 6 katak, hammasi sonOqi (o'lchov artefakt bilan).

**3-bosqich · Solishtirish.** Kapsula ③, HALOL: hukmni TIZIM chiqaradi — har yuklash vaqti
⏱-chegara bilan avtomatik solishtiriladi (ms > chegara×1000 yoki holat ≥ 400 → 📣 signal).
O'quvchi natijani bir gapda yozadi (≥10; ODAM_RE yo'q bo'lsa 🤔 savol, bloklamaydi).

**4-bosqich · Xulosa.** 3 savol birma-bir (Kahoot):
1. Signal nima? → o'lchagich chegaradan o'tganda keladigan xabar
2. Chegara qayerga qo'yiladi? → odam seza boshlaydigan joyga
3. Juda past chegara nima beradi? → quruq signallar ko'payadi

**Natija.** 4/4 → bayram → 🏆 + Signal-panel: 3 qoida + 3 o'lchov (signal-belgilari) + xulosa →
«Vazifani topshirish».

## Payload
`{lessonId:'pm-m4c-06', kind:'homework', done, stages:'n/4', place:<⏱ chegara>, durationSec}`

## Relslar
Etalon-relslar · dars-kaliti faqat O'QILADI · misol-olam o'quvchining o'z sayti (darsdagidek).
