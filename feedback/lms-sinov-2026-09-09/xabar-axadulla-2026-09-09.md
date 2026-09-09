# Axadulla'ga xabar (2026-09-09) — foydalanuvchi yuboradi

Assalomu alaykum, Axadulla.

Kechagi pilot-natija bo'yicha uchta narsa bor.

**1. Vaqt zonasi (bizning F-0909-01).** `sess_782030_20260908T125804Z` hodisasini biz UTC bilan yuborganmiz:
`started_at 2026-09-08T12:58:04Z`, `finished_at 2026-09-08T13:07:35Z`. School API'dan `GET /lesson-results/{event_id}`
esa `started_at 07:58:04Z`, `finished_at 08:07:35Z` qaytaradi, `received_at 13:07:35Z` to'g'ri. Ya'ni bizning `Z` vaqtimiz
Toshkent-lokal deb o'qilib, yana 5 soat ayirilgan ko'rinadi. Iltimos, `Z` bilan kelgan ISO-vaqtni UTC deb saqlashni
tekshirib ko'ring. Agar sizga lokal vaqt qulay bo'lsa, ayting, biz formatni o'zgartiramiz.

**2. onFinished JSON.** 37069 o'quvchi uchun saqlangan natijada `lang`, `questions`, `achievements` maydonlari
ko'rinyaptimi? Bitta JSON-namuna yetadi (TZ §9).

**3. Qolgan test-akkauntlar (§13 sinovi uchun).** Xavfsiz kanal orqali:
- O-2 — G-1 (gid 1070) o'quvchisi
- O-3 — G-1, muzlatilgan
- O-4 — boshqa guruh (G-2) o'quvchisi, G-2 ning gid'i ham kerak
- O-5 — G-1 va G-2 ikkalasida
- M-2 — TEACHER, G-2
- T-1 — TA, G-1
- X-1 — hech qayerga tayinlanmagan
- V-1 — vaqtincha mentor, G-1, muddati START..END (muddat ichida)

Akkauntlar kelgach bir o'tirishda 30 daqiqalik sinov o'tkazamiz. Undan keyin sizning ishtirokingiz kerak bo'lgan
to'rt band bor (V-1 muddatini o'tmishga qo'yish, bir `event_id` bilan boshqa payload → 409, topilmaydigan o'quvchi,
kalit-rotatsiya), ularga alohida vaqt kelishamiz.

Rahmat.
