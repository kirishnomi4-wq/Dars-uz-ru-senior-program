# JSON v1.2 va mukofot qoidalari bo‘yicha javob

**Sana:** 09.11.2026  
**Asos:** 21-hujjat, 16 v1.2, yangilangan 16a reestri va 20/20a hisoboti.

Asosiy tuzatishlarni qabul qilamiz: server — natija va mukofot manbasi; brauzer — ko‘rsatish va bog‘lash; o‘quv natijasi `attempt_id` bilan aniqlanadi; amaliyot testlardan ajratiladi; `completed` oxirgi ekranga yetganlikdan olinadi.

Quyida mukofot bo‘yicha aniqlik, to‘rtta so‘rovingizga javob va qolgan texnik tuzatishlar.

## 1. Learn va CodeStrike coin’lari

**Learn coin’larini dars oxiriga ko‘chirmaymiz.** Hozirgi javoblar bo‘yicha hisoblash saqlanadi. Takroriy mukofotdan himoya quyidagicha amalga oshiriladi:

- CodeStrike coin’i hisoblanishidan oldin bog‘langan Learn bo‘yicha `student_question_rewards` tekshiriladi. O‘quvchi shu Learn uchun kamida bitta **musbat coin** olgan bo‘lsa, CodeStrike javoblari va podium uchun coin berilmaydi.
- Learn’dagi har bir coin hisoblanishidan oldin bog‘langan CodeStrike mukofoti tekshiriladi. CodeStrike uchun musbat coin berilgan bo‘lsa, Learn javobi saqlanadi, lekin coin berilmaydi.
- Nol coin yoki faqat points yozuvi musbat coin olinganini anglatmaydi.
- Learn mustaqil bajarilgan bo‘lsa, avval kelishilganidek CodeStrike coin’i berilmaydi.
- Tekshirish va hisoblash umumiy blokirovka hamda tranzaksiya bilan bajariladi. Parallel so‘rovlar ikki yo‘ldan mukofot ololmasin.

`student_question_rewards` hozir bir savol uchun takroriy hisoblashni to‘sadi. Learn va CodeStrike o‘rtasidagi tekshiruvni biz qo‘shamiz. Faqat jadval mavjudligiga tayanish yetarli emas.

Bu cheklovlar o‘quv qismining alohida mukofotiga tegmaydi. Arenada qatnashish va Learn avtomatik hisobi qoidalari ham o‘zgarmaydi: birinchi arena savoli ko‘rsatilishi yetarli, ball chegarasi yo‘q; oldin boshlangan Learn urinishini tugatish mumkin.

## 2. Production validatori

Lokal `6b3c85d` kodida ikkala tenglik tekshirildi:

- `answered` = test tafsilotlari soni;
- `correct_answers` = to‘g‘ri birinchi javobli test tafsilotlari soni.

Siz keltirgan production 422 javoblari birinchi tekshiruv ishlayotganini tasdiqlaydi. Ammo production’dagi aniq commit va barcha validator qoidalari bir xil ekanini hali mustaqil tasdiqlamadik.

Hozirgi yechim — amaliyotni `tests` dan chiqarish va to‘liq tafsilotda tengliklarni saqlash — mos. Bizning dastlabki rejadan `partial` qo‘llab-quvvatlash olib tashlanadi.

## 3. `pm-m2d13-v1` ning CRM bog‘lanishi

Production CRM’da quyidagi dalil topildi:

| Maydon | Qiymat |
| --- | --- |
| O‘quvchi | 31136 |
| `student_question_log.id` | 1881580 |
| Yozuv vaqti | 30.09.2026 16:27:21, CRM qaytargan vaqt |
| Saqlangan `lessonId` | `pm-m2d13-v1` |
| Savol | 14121 |
| Mukofot yozuvi | 268068 |
| Mukofotdagi Class | **2444** |
| Berilgan coin | **3** |

Demak, shu sentyabr brauzer natijasining **Class 2444** bilan bog‘lanishi tasdiqlandi.

Hozirgi Class 2444 → **Learn 3184** bog‘lanishi ham mavjud. Lekin bu aynan 21–25 sentyabrda Learn 3184 bog‘langanini isbotlamaydi; tarixiy Learn bog‘lanishi alohida tekshiriladi.

Reestrda eski tashqi ID’larni saqlashni qabul qilamiz. Mukofot himoyasi tashqi `lesson_id` emas, kanonik CRM Class/Learn bo‘yicha ishlaydi.

## 4. Birinchi haqiqiy xabar uchun nomzodlar

Hozircha yuborishga ruxsat berilgan qator yo‘q. Tekshiruvda:

- **35887 / Class 2432:** 30 sentyabrda 3 coin allaqachon berilgan.
- **31136 / Class 2444:** 30 sentyabrda 3 coin allaqachon berilgan.
- **29085 / Class 2461:** 7 noyabrda 0 coin va 3 points yozuvi bor; bog‘langan Learn 3198 bo‘yicha alohida coin yozuvlari ham mavjud. Nol coin sababini va boshqa mukofot manbalarini tekshirish kerak.

35887 yozuvi ma’lumotni tiklab, **takroriy coin bermaslikni** tekshirish uchun nomzod bo‘lishi mumkin:

`solo_35887_pm-m2d2-v1_20260923T114932Z`

Bu hozircha nomzod, yuborish topshirig‘i emas. Avval payload, mavjud hodisa va kutiladigan biznes natijasini tekshiramiz. HTTP 201 olish bilan haqiqiy mukofot qo‘llanishini alohida tekshiramiz.

## 5. V1.2 bo‘yicha qolgan tuzatishlar

1. **Mukofot kaliti.** 16-hujjatning ayrim joylarida hali `student_id + lesson_id` yozilgan. Ularni kanonik o‘quvchi + Class, Learn/CodeStrike cheklovi uchun o‘quvchi + bog‘langan Learn bilan almashtiring.

2. **Jonli sessiya muddati.** Kelishuv — 2 soat. Qo‘shimcha 30 daqiqa o‘yin vaqti kelishilmagan. Mantiqiy tugash va haqiqiy qayta ishlash vaqtini ajrating: sweep kechikishi sessiyada ishlash huquqini uzaytirmasin.

3. **Versiyasiz urinishlar.** Oxirgi 7 kunda yuklash bo‘lmagani har bir eski tab aynan joriy faylda ishlayotganini o‘zi isbotlamaydi. Nashr yoki kontent bilan ishonchli bog‘lanish bo‘lsa `backfill`; dalil yetmasa `unknown`. Hozirgi kalitlarni eski urinishniki deb taxmin qilmang.

4. **C4 namunasi.** Unda eski `ar_<session>_<student>` qolgan. Yangi `ar_<attempt_id>` qoidasiga moslashtiring.

5. **Kuzatish matni.** Eski «10 daqiqadan keyin bir marta» jumlasini olib tashlang; faqat yangi kuzatish tartibi qolsin. 24 soatdan keyin ham tugamagan hodisa yo‘qolmasin — mas’ul tekshiruvga o‘tsin.

6. **`processed_at`.** Hodisa birinchi yig‘ilgan vaqt bo‘lib qoladi. Yetkazish qayta urinishida o‘zgarmaydi, aks holda bir xil `event_id` boshqa mazmun bilan keladi.

## 6. Hisobot va keyingi qadam

20a raqamlari tekshirildi: 229 yozuv, 197 o‘quvchi, 213 nomzod; 47 qatorda `correct_answers` o‘zgargan, jami +36. Oltita `completed` pasayishi va 20 ta nishon o‘zgarishi hisobotga mos.

Tarixiy qiymatlarni tuzatish bilan mukofotni tiklash alohida tekshiriladi. **Oldin berilgan coin’lar avtomatik yechilmaydi.** Eski va qayta hisoblangan qiymatlar saqlanadi.

Siz yuqoridagi kontrakt tuzatishlarini kiriting. Biz production versiyasi, tarixiy bog‘lanishlar va mukofot reyestrini tekshirishni davom ettiramiz. Keyin aniq birinchi xabar va uning kutiladigan natijasini tasdiqlaymiz.

Yangi mahsulot qarori kerak emas; bu aniqliklar asosida bizning server qismini ishlab chiqishni boshlash mumkin.
