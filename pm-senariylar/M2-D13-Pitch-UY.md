# M2-D13 — UYGA VAZIFA SENARIYSI: «Pitchni jonli tinglovchiga ayting»

> Fayl: `src/2-Modull/PmLesson6.homework.jsx` · HW_ID `pm-m2-13` · Naqsh: PmLesson2.homework (ETALON)
> Dars-manba: PmLesson6.jsx (pm-m2d13-v1). Darsning uy-vazifa kapsulasi: «1) Pitchni bitta odamga
> ayting — kod bilmaydigan tinglovchiga · 2) Savolini yozib qo'ying · 3) Bitta bo'lakni qayta
> yozing — tushunarsiz chiqqanini». Vazifa AYNAN shu. PmLesson1.homework suhbat-relsi.
> Tasdiq: foydalanuvchi 2026-09-02 (uchala reja birga).

## Maqsad (bitta ko'nikma)
Pitch qog'ozda emas, jonli tinglovchida sinaladi: kod bilmaydigan odam tushundimi — shu yagona
o'lchov. Savol va qayta yozish — tinglovchidan kelgan haqiqiy signal bilan ishlash.

## 4 bosqich + Natija (mezon 4/4)

**1-bosqich · Pitch.** Darsda yozilgan 5 bo'lak (kirish-artefakt `pm-m2d13-pitch`, avto-to'ladi):
Kim uchun (≥3, «hamma» taqiq) · Qanday muammo (≥8) · Nima qiladi (≥8) · Nega ishlaydi (≥8,
peshtaxta/oshpaz/javon o'xshatishidan bittasi SHART — darsdagidek) · Nima so'rayman (≥6).
Jargon-elak (darsdagi `findJargon`, UZ+RU o'zaklar) beshala bo'lakda ishlaydi — kasbiy so'z
chiqsa, o'sha so'z ko'rsatilib almashtirish so'raladi.

**2-bosqich · Suhbat.** Kimga aytdingiz (chip: oila a'zosi · qo'shni · do'st · o'qituvchi) ·
tushundimi (🙂 tushundi / 😐 yarmini / 😕 tushunmadi) · tinglovchi nima dedi yoki so'radi (≥8).

**3-bosqich · Qayta yozish.** Tanlov: «Tushundi — o'zgartirmayman» (faqat 🙂 bo'lsa ochiq —
😐/😕 da halol yo'l bitta: qayta yozish) yoki «Bitta bo'lakni aniqlashtiraman» → bo'lak-chip +
yangi matn (o'sha bo'lakning validatori + jargon-elak qayta ishlaydi, matn eskisidan farq qilsin).

**4-bosqich · Xulosa.** 3 savol birma-bir (Kahoot):
1. Jargon chiqib qolsa → tanish so'z bilan almashtiriladi (tashlanmaydi)
2. Birinchi gap nimadan boshlanadi → tinglovchi oladigan foydadan
3. Yaxshi o'xshatish qayerdan → tinglovchining o'z hayotidan

**Natija.** 4/4 → bayram → 🏆 + Pitch-karta: 5 bo'lak (qayta yozilgani eski→yangi ko'rinishda) +
tinglovchi-chip (kim · 🙂/😐/😕) → «Vazifani topshirish». <4/4 → sokin ro'yxat.

## Payload
`{lessonId:'pm-m2-13', kind:'homework', done, stages:'n/4', place:<Kim uchun bo'lagi>, durationSec}`

## Relslar
Etalon-relslar · misol-olam darsniki (lavash do'koni sayti, tinglovchi-namuna — do'kon egasi) ·
validatorlar darsdan qat'iyroq ham, yumshoqroq ham emas (PITCH_FIELDS min-lari aynan).
