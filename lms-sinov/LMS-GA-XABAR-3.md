# LMS jamoasiga — N-test 8 O'TDI 🎉 + bitta so'rov

**Kimdan:** Darslik-platforma jamoasi · **Kimga:** LMS (Coddy Camp) IT jamoasi
**Sana:** 2026-08-13
**Nimaga javoban:** «JAVOB — 2-raund sinov natijasiga»

---

## 1. Xushxabar — haqiqiy dars tashqi modul bilan ishladi

Kutib o'tirmadik: haqiqiy kompilyator-modulni tayyorlab yukladik va **haqiqiy dars
bilan** sinadik. Natija — ishladi, boshdan-oxirigacha:

- **Modul:** `https://go.coddycamp.uz/uploads/course_artifacts/f9e30f4aaecfeada4e3482bfe60877d2.jsx`
  (96 KB, sof ESM, JSX yo'q, faqat `react` import qiladi — va'da qilganimizdek)
- **Dars:** JsVarsLesson (o'zgaruvchilar darsi), import satri manzil ko'rinishida
- **Sinov joyi:** `lms.coddycamp.uz/course/20/module/73/…`, ruscha rejimda

Ko'rilganlar (rasmlar ilova):

| Tekshiruv | Natija |
|---|---|
| Modul manzildan yuklandi | ✅ |
| Praktika ekranida kompilyator ochildi | ✅ |
| Bola kod yozdi, shartlar 2/2 yashil, konsol-panelda natija | ✅ |
| **Hook'lar ishladi — React BITTA nusxada (T-2)** | ✅ |
| Dars oxirigacha yetdi («Dars muvaffaqiyatli yakunlandi») | ✅ |
| Brauzer konsolida qizil xato | 0 |

Ya'ni **T-test/N-test 8 (haqiqiy dars) — o'tdi.** Sizning yuklovchi to'g'ri ishlayapti,
buni endi ikkala tomon ham o'z ko'zi bilan ko'rdi. Rahmat!

Yon-ma'lumot: modul har nashrida `HC_NASHR` (sana) eksport qiladi — qaysi nashr
ishlayotganini dars ichidan aniqlash mumkin. Har nashrdan oldin biz tomonda
avtomatik sinov yuritiladi (React 18.3.1 va 19 da — sizdagi versiyani hisobga oldik).

---

## 2. So'rov — modulni ro'yxatga qo'ying

Endi hammasi bitta qadamga qadalib turibdi: **`registry.json` hali bo'sh**, shu sabab
nom yo'lini (`@shared/html-compiler`) sinay olmayapmiz va darslarni nom ko'rinishiga
o'tkaza olmayapmiz.

So'raymiz:

1. **«Umumiy modullar»da yangi nom yarating: `html-compiler`** (kelishilgan nom).
2. **Birinchi nashr sifatida yuqoridagi faylni qo'ying** — u allaqachon
   serveringizda: `f9e30f4aaecfeada4e3482bfe60877d2.jsx` (96 252 bayt). Qulay bo'lsa
   qayta yuklaymiz — ayting, darhol beramiz.
3. «Darhol joriy qilinsin» belgilangan holda saqlang.
4. Tayyor bo'lgach bitta xabar — S-5 dagi kelishuvimizdagi **chiqarish belgisi** bilan
   (bu safar registry uchun: `registry.json` javobida `html-compiler` ko'rinishi kifoya).

Ro'yxat to'lgan kunning o'zida biz:

- N-test **1** (nom bilan yuklanish), **2** (bitta React — nom yo'lida qayta),
  **3** (kesh: modul 1 marta, ro'yxat 1 marta) va **7** (noma'lum nom) ni yurgizamiz;
- so'ng barcha darslarimizni (~19 ta, keyin qolganlari ham) `@shared/html-compiler`
  ko'rinishiga o'tkazamiz — bizda avtomatik, qo'lda tahrir yo'q.

`sinov-modul`ni alohida qo'yish endi **shart emas** — haqiqiy modul haqiqiy dars bilan
sinovdan o'tdi, sinov-modul o'z vazifasini bajarib bo'ldi. Lekin qo'ysangiz ham
xalaqit bermaydi (N-test 7 uchun ikkinchi nom sifatida asqotishi mumkin).

---

## 3. Eslatma — S-5 belgisi haqida kichik kuzatuv

Xatingizdagi belgi-fayl (`LessonRunnerQuestion.D_V_XsWq.js`) biz tekshirganda 404
edi — ~15:00 dagi chiqarishingiz xeshni almashtirgan (jorinisi `B-k4JOBo`, hajmi
aynan siz aytgan 21 311 bayt, `remote_module_forbidden_origin` belgisi ichida bor —
ya'ni kod joyida, faqat nom eskirgan). Ayb emas, shunchaki fakt: **fayl-nom belgi
sifatida mo'rt ekan** — har buildda o'zgaradi.

Taklif (ixtiyoriy, keyinga): o'zgarmas manzilli kichik `version.json`
(build-raqam + sana) — bir marta qilinadi, boshqa hech qachon adashtirmaydi.
Shoshilinch emas, hozirgi tartib ham ishlaydi.

---

## 4. Qisqa holat-jadval

| Qadam | Kim | Holat |
|---|---|---|
| Haqiqiy modul + haqiqiy dars sinovi (N-test 8) | Biz | ✅ **O'TDI** (1-bo'lim) |
| `html-compiler`ni ro'yxatga qo'yish | **Siz** | 🔴 **kutilmoqda — yagona to'siq** |
| N-test 1, 2, 3, 7 | Biz | ro'yxat to'lgach, o'sha kuni |
| N-test 9 (eskilar buzilmadi) | Biz | navbatda |
| N-test 4, 5, 6 (yangilash/qaytarish/qotirish) | Birga | ro'yxatda 2-nashr paydo bo'lgach |
| Darslarni nom ko'rinishiga o'tkazish | Biz | ro'yxatdan keyin, avtomatik |

Ilova: 2 ta ekran-surat (praktika ekrani kompilyator bilan · dars yakuni).
