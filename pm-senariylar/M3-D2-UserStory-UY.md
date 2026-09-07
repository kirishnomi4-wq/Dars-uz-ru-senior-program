# M3-D2 — UYGA VAZIFA SENARIYSI: «Boshqa odamga ikki hikoya»

> Fayl: `src/pm/PmUserStoryLesson.homework.jsx` · HW_ID `pm-m3-02` · Naqsh: PmLesson2.homework (ETALON)
> Dars-manba: PmUserStoryLesson.jsx (P0 — darsga TEGILMAYDI, faqat o'qiladi). Darsning US-UY
> topshiriq-kartasi: «Kim uchun: tanlangan odam · Nechta: 2 ta yangi (sinfda 3, uyda 2 — jami 5) ·
> Qadamlar: odamni bir gapda ta'rifla → unga 2 to'liq hikoya → 5 tadan eng muhim 3 tasini belgila».
> Vazifa AYNAN shu. Tasdiq: foydalanuvchi 2026-09-02 («shoshilmasdan yaxshilab»).

## Maqsad (bitta ko'nikma)
Hikoya formulasi («Men [KIM] sifatida, [NIMA]ni xohlayman, [NATIJA] uchun») BOSHQA foydalanuvchiga
ko'chiriladi: KIM almashsa NIMA ham, NATIJA ham o'zgarishini his qilish + 5 tadan 3 tasini tanlash
(hammasini birdaniga qilib bo'lmaydi — prioritet).

## 4 bosqich + Natija (mezon 4/4)

**1-bosqich · Hikoyalarim.** Darsdagi 3 hikoya (kirish-artefakt `pm-m3d2-stories`, avto-to'ladi;
bo'sh brauzerda qo'lda). Har hikoya: KIM · NIMA · NATIJA. Validatorlar DARSDAN AYNAN:
har maydon ≥2 belgi · NATIJA ≠ NIMA (kichik harfda) · KIM uch kartada takrorlanmaydi.
Eslatma-matnlar darsning o'zidan («NATIJA harakatning takrori bo'lib qoldi…», «Bu KIM allaqachon
daftarda bor…»).

**2-bosqich · Odam.** Kim uchun yozadi: chip (do'st · mentor · birinchi mehmon · ✍️ o'z variantim,
≤40 belgi; darsdagi `pm-m3d2-hw-target` dan avto) + «qanday odam ekanini bir gapda yozing» (≥8).

**3-bosqich · 2 yangi hikoya.** Ikki karta, KIM maydoni tanlangan odam bilan oldindan to'lgan
(tahrirlanadi). Validatorlar: darsdagilar + ikki yangi hikoyaning NIMA'si bir-biridan farq qilsin
(bir hikoyani ikki marta yozish o'tmaydi).

**4-bosqich · Xulosa.** Beshala hikoya ro'yxatda — AYNAN 3 tasini ⭐ bilan belgilash (uy-kartadagi
qadam), keyin 3 savol birma-bir (Kahoot; tanlov tugamaguncha test xira):
1. NATIJA qatoriga nima yoziladi? → harakatdan keyin hayotda nima o'zgarishi
2. KIM qatoriga nima yoziladi? → foydalanuvchi turi (o'z ismi emas)
3. Nega 5 tadan faqat 3 tasi belgilanadi? → hammasini birdaniga qilib bo'lmaydi — avval eng muhimi
   (qolganlari o'chirilmaydi)

**Natija.** 4/4 → bayram → 🏆 + Hikoya-daftar kartasi: 5 hikoya formula-gap ko'rinishida
(yangilari aksent, belgilanganlari ⭐) → «Vazifani topshirish». <4/4 → sokin ro'yxat.

## Payload
`{lessonId:'pm-m3-02', kind:'homework', done, stages:'n/4', place:<tanlangan odam>, durationSec}`

## Relslar
Etalon-relslar (M2-UY'lar bilan bir xil) · dars-kalitlariga YOZILMAYDI (faqat o'qish) ·
P0 faylga tegilmaydi · saqlov `ccHomework:pm-m3-02` TTLsiz.
