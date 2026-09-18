# Axadullaga — `question_try` 409 `submission_key_mismatch` (2026-09-18, loyiha)

Axadulla, salom. Bugun tushdan keyin LMS frontida yangi yig'ma chiqibdi (`index.Dt1n9OIm.js`; ertalab `index.B9TyFiFb.js` edi) —
`question_try` so'roviga `idempotency_key` qo'shilgan. Shundan keyin o'quvchida «Natijani saqlab bo'lmadi. Qayta urinib ko'ring.» chiqyapti.

**Fakt (o'quvchi 31422, dars 2848, savol 16594, 18.09 16:04:56):**
- `POST go.coddycamp.uz/app/index.php?action=question_try`
- so'rov: `{ question_id: 16594, answer: "<onFinished JSON, 3977 belgi>", correct: 0, idempotency_key: "3b0a9239_d973_4619_a6c9_5901aa1e681d" }`
- javob: **409** `{"code":409,"error":"submission_key_mismatch"}`
- Ertalab (05:59Z, o'quvchi 31352) shu so'rov `idempotency_key`siz ketgan va 200 qaytgan.

**Savol:** kalit nimaga bog'lanadi? Agar «bir kalit — aynan bir xil `answer`» bo'lsa: dars `onFinished` yukini har «Yakunlash»
bosilganda qaytadan yig'adi va unda `durationSec` o'sib boradi — ya'ni ikkinchi bosishda `answer` albatta boshqacha bo'ladi.
Biz tomonda yukni birinchi bosishda muhrlab, keyingi bosishlarda AYNAN o'shani qaytarishimiz mumkin — shunisi to'g'ri bo'ladimi,
yoki kalit boshqa narsaga (urinish/sahifa ochilishi) bog'langanmi?

Eslatma: bu sinovda 2848-dars fayli almashtirilgan edi (Internet → PmLesson10) — agar kalit faylga/oldingi yuborishga
bog'lansa, sabab shu ham bo'lishi mumkin. Rasmiy natija (School API `lesson-results`) 201 bilan yetkazilgan: `sess_723255_20260918T103413Z`.
