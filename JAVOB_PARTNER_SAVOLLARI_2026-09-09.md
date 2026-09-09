# 2026-09-09 xabariga javob

Assalomu alaykum.

## 1. Vaqt zonasi — F-0909-01

Muammo biz tomonda tasdiqlandi va tuzatildi. Sabab MariaDB’dagi vaqt zonasi ko‘rsatilmagan `DATETIME` qiymati Laravel tomonidan `Asia/Tashkent` vaqti sifatida qayta o‘qilganida UTC’ga qo‘shimcha −5 soat siljish qo‘llanilgani edi.

Tuzatish School API’ning `main` branch’iga qo‘shildi. Endi `Z` bilan yuborilgan UTC-vaqt UTC sifatida saqlanadi va lokal vaqt zonasiga o‘tkazilmasdan qaytariladi.

Siz tomonda formatni o‘zgartirish kerak emas. ISO 8601 UTC va `Z` formatida yuborishni davom ettiring.

`sess_782030_20260908T125804Z` uchun kutiladigan javob:

```json
{
  "started_at": "2026-09-08T12:58:04Z",
  "finished_at": "2026-09-08T13:07:35Z"
}
```

## 2. `onFinished` JSON — LMS o‘quvchi 37069

Production yozuv tekshirildi. `37069` LMS o‘quvchisining saqlangan natijasida uchala yangi maydon mavjud:

- `lang`: `"uz"`;
- `questions[]`: 5 ta savol;
- `achievements[]`: 4 ta achievement.

Saqlangan yozuv:

- `student_question_log.id`: `1717692`;
- `question_id`: `16593`;
- legacy-vaqt: `2026-09-08 18:07:02`.

Shaxsiy ma’lumotlar va live PIN olib tashlangan real JSON nusxa ushbu javobga alohida ilova qilinadi:

`DARS_ONFINISHED_37069_SAMPLE_2026-09-08.json`

Saqlash ishlayapti. Tekshiruv paytida payloaddagi quyidagi qiymatlar ham aniqlandi:

- barcha 5 ta attempt’da `elapsed_ms = 0`;
- 4 ta noto‘g‘ri javobda faqat bitta noto‘g‘ri attempt bo‘lsa ham `solved = true`;
- ayrim ketma-ketlik matnlarida yo‘nalish belgisi literal `?` ko‘rinishida kelgan.

Biz JSON’ni kelgan ko‘rinishida to‘liq saqlayapmiz. Agar §9 bo‘yicha `elapsed_ms` haqiqiy vaqt va `solved` yakuniy yechim holatini anglatishi kerak bo‘lsa, keyingi pilotda ushbu qiymatlarni Dars-platforma tomonida to‘g‘rilab yuborishingizni so‘raymiz.

## 3. Qolgan test akkauntlari va qo‘shma sinov

O-2, O-3, O-4, O-5, M-2, T-1, X-1 va V-1 test akkauntlari xavfsiz kanal orqali allaqachon berildi.

Akkauntlar bo‘yicha qo‘shimcha ma’lumot kerak bo‘lsa, aynan qaysi belgi yoki `gid` yetishmayotganini yozing.

30 daqiqalik qo‘shma sinovga tayyormiz. Asosiy sinovdan keyin quyidagi holatlarni alohida tekshirishga rozimiz:

1. V-1 vaqtinchalik mentor muddatini o‘tmishga o‘tkazish;
2. bir xil `event_id` bilan o‘zgartirilgan payload yuborib `409 Conflict` olish;
3. topilmaydigan o‘quvchi ID’sini tekshirish;
4. JWT kalit rotatsiyasini tekshirish.

