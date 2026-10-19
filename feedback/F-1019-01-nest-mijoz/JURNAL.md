# F-1019-01 · NestArchAlive (LMS 6-Modul, src/4a-Modull/NestArchAliveLesson.jsx) s9 «Buyurtma yo'li» — QA fidbek · 2026-10-19
QA (rasm `F-1019-01-qa-1.png`, `-qa-2.png`): «ko'rsatmada mijoz kartasini bosing deyilgan, u bosilmayapti; to'g'ri mijozni bossa davom etyapti» · «ortiqcha textlarni olib tashlang, yiqiladi — yig'iladi edi».
Foydalanuvchi: «to'g'riladikmi yo'qmi aniqla, bo'lmasa to'g'rila».

## Tashxis
- **LMS'dagi versiya eski** — `lms/6-M/NestArchAliveLesson.jsx` 21.09 yig'masi: `ROUTE = guard → waiter → inspector`. O'quvchi to'g'ri tartibni (nazoratchi ofitsiantdan oldin, F-1012-01 dan keyingi) tergan, eski yig'ma uni xato deb «Tartibni tuzating» ko'rsatgan. Manbada F-1012-01 bilan tuzatilgan — **LMS'ga yangi yig'ma yuklanishi kerak**.
- Manbada ilgari tuzatilgan (rasmdagi eski matn): «Uchala mijozni ham sinab ko'ring: bir yo'l — uch taqdir» (F-1017-213), kirish taxtasi (F-1017-213), POST qatori kartadan natijaga (F-1017-213), «💡 Yo'lakka 6 bekatni sudrang…» (F-0926-06).
- **Manbada hali bor edi (tuzatildi):** (1) «mijoz kartasini (▶) bosing» — yo'lak oxiridagi «Mijoz» katagi karta ko'rinishida, bosilmaydi; bosiladigani pastdagi uch mijoz; (2) «yiqiladi» — natija qatori «… bekatida to'xtadi» deydi; (3) «Nishon birinchi urinish uchun edi — endi bemalol…»; (4) «Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq» + ochiq tugmada «Tartibni tuzating».

## Qilindi (zaxira `arxiv/F-1019-01-oldin/`)
1. Mentor: «keyin **pastdagi mijozlardan birini** (▶) bosing … o'sha bekatda **to'xtaydi**» (ru mos).
2. Mijozlar qatori ustida yorliq: yo'lak to'lmaguncha «Mijozlar — yo'lak to'lgach bosiladi», to'lgach «Mijozni kiriting ▶»; yo'lak to'lgach uch tugmada halqa (213.15, reduced-motion bilan).
3. Yo'lak oxiridagi «Mijoz» katagi — fon va chegarasiz, faqat punktir (manzil, tugma emas).
4. `AchRule oldin` — nishon yo'qotilgach qator ko'rsatilmaydi (urinishdan oldingi «🏅 Birinchi urinishda…» qoladi).
5. Klapan qatori olindi; klapan ochilganda nav-tugma o'zi «Davom etish» deydi.
lessonId o'zgarmadi (`nest-arch-alive-4a-01-v18`, ekranlar soni o'zgarmagan).

## Sinov
- `npm run gates` 11/13 — tell 3 / emoji 7 topilma zaxirada ham aynan shu son (eski), `lint:jsx` 0.
- `sinov.mjs` → `natija.txt`: Mentor matni yangi · boshida yorliq «yo'lak to'lgach bosiladi», «Mijoz» katagi DIV · to'g'ri terilgach «✓ Yo'l to'g'ri terildi», yorliq «Mijozni kiriting ▶», halqa 3 · 201 / 400 / 401 · «Davom etish» · nishon qatori 0, klapan qatori 0 · pageerror 0. Suratlar `uz/t-toldi.png`, `uz/t-tugadi.png`, `uz/s08.png`, `ru/s08.png`.

## Sinf-supurish
- «mijoz kartasi» iborasi o'quvchi matnida faqat shu ekranda edi (`grep -rn "mijoz kartasi" src`: qolganlari kod izohlari — BotIntro, tegilmadi).
- Klapan qatori + zid nav-yorliq — 17 fayl, 94 joy → KATTA_TOZALASH «F-1019-01» (1–6-M, qaror kutadi).
- **Muhrlash:** MATN_KORPUS §BOSILADIGAN-NOM (2 juftlik + qoida).
