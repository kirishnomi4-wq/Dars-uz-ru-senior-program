q# Dars-platforma jamoasiga javob — 2026-09-21

Assalomu alaykum.

18.09 va 20.09 dagi xabarlaringizni birga ko'rib chiqdik. Bo'sh `badges`
tuzatishidan keyin uchta hodisa 201 olganini tasdiqlaganingiz uchun rahmat.

## 1. Matnsiz `arena` yozuvlari

Bu biz tomondagi kontrakt cheklovi edi. Tuzatdik:

- `kind: "arena"` uchun `question`, `options`, `correct_answer` va
  `attempts.*.answer` endi yuborilmasligi yoki `null` bo'lishi mumkin;
- `options` yo'q bo'lsa, `correct_option` va `attempts.*.option` ning massiv
  elementiga havolasi tekshirilmaydi;
- `kind: "test"` uchun shu matn-maydonlar avvalgidek majburiy;
- arena yozuvlari analitika uchun saqlanadi, lekin `answered`,
  `correct_answers`, `total_questions`, `rank` va kelajakdagi coin hisobiga
  kirmaydi.

O'zgarish uchun control DB'da quyidagi migratsiya bajarilishi kerak:

```text
database/migrations/2026_09_21_000012_allow_sparse_arena_question_details.php
```

Kod va migratsiya staging/prod muhitiga chiqarilgani alohida tasdiqlanmaguncha,
hozirgi himoyangizni — matni to'liq bo'lmagan arena yozuvlarini `questions[]`dan
chiqarib turishni — saqlang. Deploy tasdiqlangach, `sess_018937_20260918T033756Z`
payloadini yangi `event_id` bilan qayta yuborib tekshirish mumkin. Eski
`event_id` boshqa payload bilan qayta ishlatilsa, idempotency sababli 409 bo'ladi.

## 2. Davomat modali

Bu kutilgan holat: dars natijasini saqlash va CRM davomatini belgilash ikki
alohida jarayon. `lesson-results` qabul qilinishi o'quvchini avtomatik ravishda
kelgan deb belgilamaydi. Haqiqiy guruhda mentor davomatni amaldagi CRM jarayoni
bo'yicha belgilashi kerak; davomat belgilanmagan test-guruhda
`Hali bu darsga kelmagansiz` modali chiqishi mumkin.

## 3. `participant` nishoni

`participant` kaliti qabul qilinadi: badge kalitlari yopiq ro'yxat bilan
cheklanmagan, `lower_snake_case` format va bir o'quvchi ichida noyoblik
tekshiriladi. Hozir coin formulasi yoqilmagan (`reward_status: pending_policy`).
Formula yoqilganda `participant` yutuq sifatida hisoblanmaydi va coin bermaydi.

Bo'sh `badges: []` endi qabul qilinayotgani sababli texnik fallback sifatida
`participant` yuborish majburiy emas. Uni haqiqiy qatnashuv belgisi sifatida
qoldirishingiz yoki fallbackni olib tashlashingiz mumkin.

## 4. Mentor 240 va birinchi test-guruh

Ikkinchi guruh 1072 da o'sha mentor bilan token muvaffaqiyatli berilgani umumiy
token integratsiyasi va mentor akkaunti ishlayotganini ko'rsatadi. Lekin yuborgan
`mentor_launch` qiymatlaridan birinchi guruhning `group_id` si aniqlanmaydi.

Aniq tekshiruv uchun birinchi guruhning `group_id` sini hamda brauzer Network'dagi
`/account/ajax/group_list/dars_live_token.php` so'rovining HTTP statusi va
javobini yuboring. Agar bu endpointga so'rov umuman chiqmagan bo'lsa, preview
handshake logi ham kerak bo'ladi. Shunda guruh faolmi, mentor biriktirilganmi yoki
so'rov token endpointigacha yetib bormaganmi — ajratib tekshiramiz.

## 5. `question_try` va `submission_key_mismatch`

Siz topgan sabab to'g'ri: bitta idempotency key faqat bitta o'zgarmas payload
uchun ishlatiladi.

1. Serverda kalit `(student_id, action=question_try, idempotency_key)` doirasida
   noyob. U bevosita dars ochilishiga yoki faqat savol ID siga bog'lanmagan.
   `idempotency_key` dan tashqari butun so'rov payloadi hash qilinadi; shu sababli
   `durationSec` o'zgarishi ham boshqa mazmun hisoblanadi. Har bir yangi mantiqiy
   urinish uchun yangi key kerak.
2. Birinchi so'rov yakunlanib, saqlangandan keyin aynan bir xil key va aynan bir
   xil payload bilan takroriy so'rov keshlangan javobni `200` bilan oladi. Birinchi
   so'rov hali bajarilayotgan paytdagi parallel takror `409
   submission_in_progress` olishi mumkin.
3. `submission_key_mismatch` ni umumiy holda muvaffaqiyat deb qabul qilish va
   yashirish kerak emas. School API'dagi rasmiy natijaning 201 javobi va CRM'dagi
   `question_try` ikki alohida operatsiya; birinchisining muvaffaqiyati
   ikkinchisini avtomatik tasdiqlamaydi. Siz qilgan `sealed payload` tuzatishi
   mismatchni yo'qotishi kerak. Faqat brauzer ayni mantiqiy yuborish uchun oldin
   `question_try` dan 200 olganini aniq saqlagan bo'lsa, keyingi UI xabarini
   takroriy texnik xato sifatida jim loglash mumkin.

## 6. To'rt soniyadagi ko'p so'rov

School/CRM backend `question_try` ga o'zi qayta so'rov yubormaydi; u faqat kelgan
har bir HTTP so'rovga javob beradi. Demak ~15 ta so'rov klient tomondan kelgan.
`Yakunlash` tugmasini birinchi yuborishdan keyin bloklash, bitta in-flight Promise
ni qayta ishlatish va retry'larni ketma-ket yuborish to'g'ri himoya bo'ladi.

## 7. Qayta sinov

Deploy tasdiqlangach quyidagilarni birga tekshiramiz:

1. matn-maydonlarisiz arena yozuvi 201 oladi va GET javobida `null` bilan qaytadi;
2. xuddi shunday yetishmayotgan maydonlarga ega test yozuvi 422 oladi;
3. bir xil `question_try` key + bir xil payload takrorida 200 qaytadi;
4. yangi urinish yangi key bilan yuboriladi va bitta tugma bosilishida bitta faol
   so'rov bo'ladi.

Rahmat.
