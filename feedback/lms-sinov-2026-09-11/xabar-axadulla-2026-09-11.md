# Axadulla'ga xabar (2026-09-11) — foydalanuvchi yuboradi

Assalomu alaykum, Axadulla.

Bugun serverimizni prodga chiqardik: `https://dars-api.coddycamp.uz` (staging o'z joyida qoladi).
Qabul-tekshiruvining 19 bandi ham o'tdi. Sizning tomoningizda hech narsa o'zgartirish kerak emas —
manzil, token va kontrakt o'sha-o'sha; natijalar endi prod serverdan keladi.

**1. Bitta qoida o'zgardi (natija ichida).** Endi `rank` va `top_1/top_2/top_3` faqat kamida bitta savolga
TO'G'RI javob bergan o'quvchiga beriladi. Ilgari o'yinchi uchtadan kam bo'lsa, hech narsa yechmagan o'quvchi ham
`top_2` olib qolardi — 10-sentabr sinovida aynan shunday bo'lgan (`correct_answers: 0`, lekin `top_2`).
`correct_answers`, `answered`, `total_questions` avvalgidek hammaga ketaveradi. Tanga `rank`/`badges` dan
hisoblansa, endi u haqiqiy natijaga beriladi.

**2. 10-sentabrdagi to'rt savol javobsiz qoldi** (A-variant va arena `kind: "arena"`). Qisqa «ha/yo'q» ham yetarli:
bizda kod tayyor, «ha» bo'lsa serverda bitta sozlama yoqiladi va avval staging'da bitta test-dars bilan tekshiramiz.

**3. Jonli darsning `onFinished` namunasi.** Mustaqil rejim uchun namunani topdik, jonli dars uchun hali yo'q.
Bazangizdan bitta yozuv yetarli: `question_try`, o'quvchi 31352, 2026-09-10, taxminan 09:26 (UTC).

**4. Birgalikdagi sinov** (kelishuvimiz bor edi): eski token bilan kirish, vaqtinchalik mentor muddati tugashi,
takror natija (409), guruhdan chiqarilgan o'quvchi. 30 daqiqa yetadi — qaysi kun qulay?

**5. Kalitlarni yangilash (rotatsiya).** Prod ishga tushgani uchun JWT kaliti (`kid v2`) va `sapi_` tokenlarini
almashtirish kerak: eskilari ochiq xabar orqali kelgan edi. Bizda ikki kalitni bir vaqtda qabul qilish tayyor,
shuning uchun uzilish bo'lmaydi — siz yangisini berasiz, biz qo'shamiz, keyin eskisi o'chiriladi.

Rahmat.
