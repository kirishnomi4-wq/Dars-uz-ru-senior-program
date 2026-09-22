# Javob — «Natijani saqlab bo'lmadi» va 22.09 tuzatishlari (dars-platforma jamoasi, 2026-09-22)

Axadulla, salom. 22.09 xabaringiz uchun rahmat. Biz ham deploy qilingan LMS kodini o'qib chiqdik
(`LessonRunnerQuestion` eski/yangi, `question_try` funksiyasi) — sizning tushuntirishingiz bilan **aynan mos**.
Quyida qisqa: nima bo'lgan edi, sizning tuzatish haqida fikrimiz, §4 savollaringizga javob va qayta sinov.

---

## 1. Nima bo'lgan edi — qisqa

Sizning §2 dagi tasviringiz bizning kuzatuvimiz bilan bir xil. Bizda `passed` **ball mezoni** sifatida yuborilardi
(yakuniy savol(lar) ≥ 60%, birinchi urinish bo'yicha — analitika uchun); runner'da esa u **yakunlash-sharti** bo'lib
ishlagan va `false` «saqlanmadi» deb ko'rsatilgan. Ikkalasi o'z o'rnida mantiqli — birga kelganda to'qnashdi. Bu holat
(o'tmagan o'quvchi) sinovlarda bo'lmagan: 21.09 da 3/5 = aynan 60% edi. Endi ajratildi — quyida.

## 2. Sizning tuzatish haqida fikrimiz

**Rozimiz, to'g'ri qaror:** `correct: 1` = «JSX dars yakunlandi» signali, `answer` ichida `passed`/`scorePercent`/
savollar/urinishlar **haqiqiy** qoladi, CRM yuqori `passed` ham yakunlashdan olinadi. Ball va yakunlash ikki alohida
narsa bo'lib ajraldi — biz ham shuni xohlagan edik.

Ikki kichik kuzatuv (bloklamaydi, shoshilinch emas):
1. Runner'da `r.correct !== true → lesson_runner_result_not_passed` shoxi endi yetib bo'lmaydigan bo'lib qoldi —
   o'chirsangiz yoki haqiqiy xato uchun matnni «Natija saqlanmadi (tarmoq/server)» deb aniqlashtirsangiz, o'quvchi
   «o'tmadim» bilan «saqlanmadi»ni ajratadi.
2. `idempotency_key` bir ochilishda bitta — muhr tufayli bizdan bir xil baytlar ketadi, shuning uchun hozir muammo
   emas; kelajakda urinish-boshiga kalit bo'lsa yanada barqaror.

## 3. §4 savollaringizga javob (o'lchov bilan)

**«`onFinished` faqat haqiqiy yakunda chaqirilsin»** — ha:
- 110 darsning hammasida `onFinished` **aynan bir joyda** — `finishLesson`, u faqat yakuniy ekrandagi
  «Keyingi dars →» tugmasidan ishlaydi (110/110); `useEffect` orqali avto-chaqiruv **0**.
- Uyga vazifa paketlari (18): faqat **4/4 bosqich** bajarilganda avto; qo'lda «topshirish» tugmasi yo'q.

**«`passed`/`correct`/`solved`ni soxta `true` qilmang»** — qilmaymiz. Bizda kod **o'zgarmagan**, hammasi
haqiqiy natija bo'yicha ketadi. (Bugun ertalab `passed: true` qilish variantini ko'rib chiqqan edik — sizning
tuzatishingiz va bu so'rovingizdan keyin **rad etdik**.)

**Bitta chegara — sizga aytishimiz kerak:** ikkala holat ham *tugagan* urinish, lekin **takror**:
1. O'quvchi tugagan darsni «Ko'rish rejimi»da qayta ochib «Keyingi dars →» ni yana bossa, `onFinished`
   **ikkinchi marta** ketadi (yangi ochilish = yangi kalit → CRM'da ikkinchi `correct:1` yozuv).
2. Uyga vazifa qayta ochilganda muhrlangan yuk yana bir marta yuboriladi.
CRM uchun takror yozuv muammo bo'lsa — ayting, biz tomondan to'samiz (tugagan urinishda tugma qayta yubormaydi).

## 4. School API (§1) — rahmat

12 hodisaning `manual_review`da qolgani bizning zaxira-holatimizdan: variantsiz savolda ikki urinishga bir xil `at`
va `elapsed_ms: 0` yoziladi. Endi qabul qilinayotgani uchun bizdan o'zgarish kerak emas; agar shu zaxirani boshqacha
ko'rishni xohlasangiz — yozing.

## 5. Qayta sinov

Ertaga sinf oldidan brauzerda (`Ctrl+Shift+R`): savolda ataylab xato → to'g'rilash → oxirigacha → «Dars muvaffaqiyatli
yakunlandi» kutiladi. Natijani yozamiz. Xato takrorlansa — vaqt, dars ID, Network'dagi `question_try` va
`next_lesson_access` javoblari (tokensiz).

Rahmat.
