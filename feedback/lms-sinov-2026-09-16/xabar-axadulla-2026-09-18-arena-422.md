# Axadulla'ga xabar (2026-09-18) — F-0918-02: arena-yozuvlarda matn-maydonlari yo'q → 422 · yuboradi: foydalanuvchi

Assalomu alaykum, Axadulla.

Avval rahmat: `present|array` tuzatishingiz ishladi. Kecha 422 olgan uchta hodisani bugun 07:40 da o'sha payload bilan qayta yubordik, uchalasi 201 oldi va `lesson-results/{event_id}` da ko'rinyapti.

Bugungi jonli sinovda (staging, guruh 1072, mentor 240, o'quvchi 31352) bitta yangi nomuvofiqlik chiqdi.

**Nima bo'ldi.** Hodisa `sess_018937_20260918T033756Z` (X-Request-Id `3bd0c3e1-488f-4378-b36a-2d49b06f0107`, 2026-09-18 03:47 UTC) 422 oldi. 40 ta xato, hammasi 8 ta arena-yozuvga (`kind: "arena"`, indeks 5–12) tegishli, 5 turda:

```
students.0.questions.5.options            → The ... field is required.
students.0.questions.5.question           → The ... field is required.
students.0.questions.5.correct_answer     → The ... field is required.
students.0.questions.5.attempts.0.answer  → The ... field is required.
students.0.questions.5.attempts.0.option  → The option must reference an item in options.
```

5 ta test-yozuv (`kind: "test"`) to'liq va xatosiz.

**Sabab.** Arena (CodeStrike) tezlik-viktorina. Dars-testlaridan farqli, unda javob-matnlar serverga yozilmaydi: faqat `question_id`, `correct_option`, tanlangan `option`, `correct`, `elapsed_ms` bor. Kelishuvda arena ballga kirmaydi (15.09, §2-2), matn-maydonlarini esa test-yozuvlar uchun ko'zda tutgan edik.

**Biz tomondan (bugun).**
1. Validatorimiz va soxta School API endi sizning qoidalaringizni aynan takrorlaydi, bunday payload navbatga tushmasdan tutiladi.
2. Matn-maydonlari to'liq bo'lmagan yozuvlar `questions[]`ga kirmaydi. Demak arena-yozuvlar hozircha yuborilmaydi, arena natijasi `arena_top_1/2/3` nishonlarida qoladi.
3. Keyingi bosqichda darslar arena matnlarini ham serverga yozadi, shunda arena-yozuvlar to'liq ketadi (sanasini alohida aytamiz). onFinished'dagi ma'lumot o'zgarmaydi, u avvalgidek to'liq.

**Iltimos (ixtiyoriy, lekin foydali).** `kind: "arena"` yozuvlar uchun `question`, `options`, `correct_answer`, `attempts.*.answer` ni `nullable` (yoki `required_unless:kind,arena`) qilsangiz va `options` bo'lmaganda `attempts.*.option` tekshiruvini o'tkazib yuborsangiz, arena-yozuvlarni matnsiz ham hozirdan yubora olamiz. Qilmasangiz ham ishlaydi: biz ularni matn tayyor bo'lguncha yubormaymiz.

**Uch savol.**
1. O'quvchi darsni tugatgach LMS «Dars muvaffaqiyatli yakunlandi» dedi, keyin «Hali bu darsga kelmagansiz» modalini ko'rsatdi (test-guruh, davomat belgilanmagan). Bu kutilgan holatmi? Haqiqiy guruhda mentor davomatni darsdan oldin belgilashi kerakmi?
2. 17.09 xabaridagi `participant` bo'yicha ikki savol ochiq: kalit sizda muammo tug'dirmaydimi, tanga-formulasiga kirmasligi kerak.
3. Mentor 240 birinchi test-guruhda darsni ochganda LMS `preview` sahifasi darsga live-token bermadi (dars «Darsga qo'shilish» darvozasini ko'rsatdi, bizning serverga `lms/join` so'rovi umuman kelmadi): `mentor_launch=aef0dad8-ee68-4e34-8d1c-946fc682a180` (08:35) va `c2c2eed5-f7e1-4f13-ac0d-d735…` (09:39). Ikkinchi test-guruhda (1072) o'sha mentor bilan token darhol keldi va hammasi ishladi. Birinchi guruhda mentor biriktirilmaganmi yoki guruh faol emasmi, tekshirib bera olasizmi?

Rahmat.
