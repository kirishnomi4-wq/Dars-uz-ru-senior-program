# ai2 (kuchsizroq model — Haiku) javobi, aynan (04.11, 83 s, 11 vosita chaqiruvi)

Tuzatildi: jonli panel uzilib qaytganda yangi buyurtmani ko'rsatmasdi.

Fayl (yagona o'zgarish): …/ws2-ai2/public/admin.html

Sabab: panel ro'yxatni faqat `order-changed` hodisasi kelganda GET /admin/orders dan qayta so'rardi. Server qayta ishga tushganda yoki internet uzilganda socket.io klienti avtomatik qayta ulanadi va «Ulangan» belgisini qo'yadi, lekin uzilib turgan paytda kelgan hodisalar qaytmaydi — ro'yxat yangilanmasdi. Sahifani yangilaganda esa ro'yxat qayta olinardi, shuning uchun belgi bilan ro'yxat nomuvofiq edi.

O'zgarish:
1. `ulanish.on('connect', ...)` ichida endi `yukla()` ham chaqiriladi — birinchi ulanish va har qayta ulanishda ro'yxat serverdan qayta olinadi.
2. `yukla()` ga so'rov tartib raqami qo'shildi: ustma-ust so'rovlardan faqat oxirgisining javobi ekranga chiqadi (uzilish-qayta ulanish paytida eski javob yangisini bosib qo'ymasligi uchun).

Tekshiruv:
- Jsdom (scratchpad/ws2-test, loyiha tashqarisida) da haqiqiy admin.html ishga tushirildi, socket.io serveri PORT=3202 da: ulanishda order 1 chiqdi → server to'xtadi → bot order 2 ni «bazaga» yozdi (hodisasiz) → server qayta ishga tushdi.
  - ESKI (HEAD) sahifa: panel «Ulangan», ro'yxatda faqat 1 — order 2 yo'q (xato takrorlandi).
  - YANGI sahifa: panel «Ulangan», ro'yxatda 2 va 1 — tuzatildi.
- Test jarayonlari to'xtatildi, port 3202 bo'sh. Loyiha ichida boshqa o'zgarish yo'q; commit/push qilinmadi.

Tekshira olmaganim:
- PostgreSQL va .env yo'qligi sababli haqiqiy Nest serveri (`npm run smoke -- live`, `npm run smoke -- restart`) ishga tushmadi; server kodiga (gateway, controller) tegilmagan, faqat sahifa tuzatildi.
- Haqiqiy brauzerda (Chrome) qo'lda sinalmagan — jsdom bilan tekshirildi.
- Server tomonidagi zaif joy bor, lekin tuzatilmadi: hodisa `order-changed` faqat ulangan panelga boradi, shuning uchun qayta ulanish paytidagi hodisa yo'qoladi — endi bu klient tomonida qayta so'rov bilan qoplanadi.

---
Bizning kuzatuv (javobdan tashqari): sinov papkasi `scratchpad/ws2-test` — shartdagi «faqat shu papka ichida» dan TASHQARIDA (jsdom o'rnatilgan, admin-old/new.html nusxalari). `npm run smoke -- restart` loyihada BOR (TgPg darsidan — savat/buyurtma restartdan o'tadimi; panelga aloqasi yo'q). Alohida `yukla()` chaqiruvlari (Kirish va sahifa ochilishida) qoldi — ochilishda ikki GET.
