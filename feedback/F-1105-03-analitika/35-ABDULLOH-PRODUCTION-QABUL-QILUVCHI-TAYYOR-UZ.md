# Dars v2 — production qabul qiluvchi tayyor

Abdulloh, salom. Bizning tomon production'ga chiqarildi. Quyidagi holat 2026-yil 10-noyabr, Toshkent vaqti bilan 18:31 dagi tekshiruvga tegishli.

## Bizning tomonda bajarildi

- CRM, School API va LMS production'ga chiqarildi.
- CRM'dagi to'rtta Dars jadvali va School API'dagi `dars_v2_events` jadvali yaratildi.
- CRM va School API'da `DARS_V2_ENABLED` yoqildi. School API fon ishlovchisi har daqiqada ishlaydi.
- `POST /api/v1/integrations/dars-platform/lesson-results` va `GET /api/v1/integrations/dars-platform/lesson-results/{event_id}` tayyor. Mavjud production manzili va tokenlari ishlaydi; yangisini so'rash shart emas.
- LMS yangi `onFinished` descriptorini qabul qiladi, server natijasini kutadi va sahifadan avtomatik chiqarmaydi.
- Learn / CodeStrike mukofotlarini takror bermaslik va server orqali progressni qo'llash kodi chiqarildi.
- Foydalanuvchi qaroriga ko'ra, ushbu reliz uchun rezerv nusxa yaratilmagan. Tarixiy natijalar qayta yuborilmadi va tarixiy balanslar qayta hisoblanmadi.

## Production tekshiruvlari

Tekshiruvlar haqiqiy o'quvchi natijasi yoki mukofoti yaratmasdan bajarildi:

| Tekshiruv | Natija |
| --- | --- |
| School API health | HTTP 200 |
| Dars production konteyneridan tokensiz murojaat | HTTP 401 |
| Mavjud production token bilan noma'lum eventni o'qish | HTTP 404 |
| V2 endpointga ataylab to'liq bo'lmagan payload | HTTP 422 |
| CRM'ga imzosiz murojaat | HTTP 401 |
| School API'dan to'g'ri HMAC imzoli, to'liq bo'lmagan payload | HTTP 422, `invalid_dars_event` |
| Yangi production inbox | 0 ta hodisa |
| Fon ishlovchisi va jadvali | Ishlaydi, har daqiqada |
| LMS kirish sahifasi, kompyuter va mobil o'lcham | Ochiladi, JS xatosi va gorizontal overflow yo'q |

Bu tekshiruvlar transport, autentifikatsiya va validator tayyorligini tasdiqlaydi. Birgalikdagi jonli dars sinovi hali o'tkazilmagan; production'da o'quvchi nomidan sun'iy natija yuborilmadi.

## Sizning tomonda qolgan ketma-ketlik

1. Dars API production'ga yangi cutoff tuzatishini va `0017_v2_cutoff.sql` migratsiyasini chiqarish. Dastlab `RESULT_SCHEMA_V2=off` qolsin.
2. Production uchun yangi JSX darslarini yuklash. QA faylidagi staging manzilini production'ga ko'chirmaslik kerak. Tekshiruv paytida Internet darsining 13381-materiali hali v5 edi.
3. Yangi versiya, cutoff va darslar tayyorligini tekshirish; kelishilgan jonli QA sinovini yakunlash.
4. Shundan keyin Dars API'da `RESULT_SCHEMA_V2=on` qilish va birinchi yangi haqiqiy urinishning hodisalarini `GET` orqali yakuniy holatgacha kuzatish. Avvalgi urinishlarni yangi v2 oqimiga qayta yubormaslik kerak.

Hozir production Dars health: `0.1.0+55fd1797`, 16 ta migratsiya, `result_schema_v2: off`. Shu sababli biz Dars'ning umumiy flagini yoqmadik. Qabul qiluvchi tayyor, lekin yangi v2 oqimi hali umumiy yoqilgan emas.

Yangi texnik kontrakt yoki navbatdagi mayda aniqlashtirishlar kerak emas: 25-kontrakt asosida davom etamiz. Keyingi xabarda yangi Dars production SHA, darslar yuklanganligi va birinchi haqiqiy yangi event ID'lari yetarli; maxfiy tokenlarni yubormang.

## Chiqarilgan versiyalar

- CRM production: `2d93e2993476555d2bb7a4ae631cbe7688694797`. Dars o'zgarishlari `f9a9896a` merge orqali kiritilgan. [Pipeline](https://gitlab.com/azimkhon/coddycamp-crm/-/pipelines/3049783147).
- School API production / v2 validator: `40c8989b176fa276ebe516065edfe56f97c18509`. [Pipeline](https://gitlab.com/Axadulla/school-api/-/pipelines/3049749637).
- LMS production: `7df6c25f52288e1457361182e2adcc5e042a599b`. [Build va deploy](https://github.com/AzamkhonKh/coddycamp-frontend/actions/runs/42822324731).

CRM muvaffaqiyatli pipeline: lint + test + deploy bajarilishi 386 soniya, ularning navbat kutishi alohida 211 soniya. School API test + build + deploy urinishlari jami 322 soniya, navbat alohida 1,2 soniya. LMS build/deploy job 94 soniya; navbat uchun alohida o'lchov olinmagan. CRM eski SHA deploy'i parallel main yangilanishi sabab to'xtagan; uning ustidan eski kod chiqarilmadi. School API deploy'idagi SSH alias tuzatilib, faqat yiqilgan deploy takrorlandi.

Shahzoda uchun analitik view'lar konnektori va hisobotlar ushbu reliz tarkibiga kirmaydi. Bu server natijalarini saqlash, progress va mukofotlar ishlashiga to'sqinlik qilmaydi.
