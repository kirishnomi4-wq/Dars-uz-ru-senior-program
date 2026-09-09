# Qolgan 2 akkaunt + ID'lar — so'rov №2 (2026-09-09)

Assalomu alaykum. 7 ta test-akkaunt uchun rahmat — hammasi qabul qilindi, rollar taqsimlandi
(guruhlar: 1071 = G-1, 1072 = G-2). Bugun kechqurun qo'shma sinovni o'tkazamiz.

Sinovning to'liq bo'lishi uchun **yana 2 akkaunt** yetishmayapti — iloji bo'lsa kechgacha:

| Belgi | Rol | Shart | Nima uchun kerak |
|---|---|---|---|
| **X-1** | STUDENT | **Hech qaysi guruhga tayinlanmagan** (guruhsiz foydalanuvchi). LMS unga dars-token bermasligi kerak | Band 9a: token berilmasa, o'quvchi PIN-darvozaga tushishi va oq ekran chiqmasligi tekshiriladi |
| **V-1** | TEACHER (vaqtincha) | Guruh **1071**, `START_DATE..END_DATE` bugungi kunni qamrasin (masalan bugundan +7 kun). Keyinroq END sanasini **o'tmishga** o'tkazish imkoni bo'lsin | Band 8: vaqtincha mentor dars ocha oladimi. Band 9b: muddat tugagach token berilmasligi |

## Yana bir iltimos — ID'lar
Bizning loglarda ism ko'rinmaydi, faqat raqamli ID. Kelgan 7 akkaunt uchun **LMS ID**'larini yuborsangiz
(o'qituvchilar uchun `teacher_id`, o'quvchilar uchun `student_id`), sinov dalillarini akkauntlarga to'g'ri
bog'lay olamiz:

- `+998800850202` (O'qituvchi, 1071) — teacher_id: ?
- `+998800850303` (O'qituvchi 2, 1072) — teacher_id: ?
- `+998800850101` (TA, 1071) — id: ?
- `998945848654` (o'quvchi, 1071 faol) — student_id: ?
- `998935885045` (o'quvchi, 1071 muzlatilgan) — student_id: ?
- `998504595975` (o'quvchi, 1072 faol) — student_id: ?
- `998950145778` (o'quvchi, 1071 + 1072) — student_id: ?

## Eslatma (sinov kuni, alohida vaqt)
Quyidagi 4 band siz tomondan bir necha daqiqalik amal talab qiladi — vaqtini alohida kelishamiz:
V-1 END sanasini o'tmishga o'tkazish · bitta o'quvchini LMS bazasida «topilmaydigan» qilish ·
bir `event_id` bilan o'zgartirilgan payload (409 tekshiruvi) · JWT kalit-rotatsiyasi.

Rahmat!
