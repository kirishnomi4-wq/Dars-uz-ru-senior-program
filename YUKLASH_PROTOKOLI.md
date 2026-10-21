# YUKLASH PROTOKOLI — yuklovchi Claude seansi uchun (CRM go.coddycamp.uz → LMS)

Siz paket papkasini olasiz (`yuklash-<sana>-prod/`). Unda `README.md`, `yakka/<N>-Modul/ROYXAT.md`, `yuklangan.csv` bor.
Faqat shu papkadagi darslar yuklanadi. Boshqa qatorlarga, boshqa darslarga, boshqa papkalarga tegilmaydi.

## Boshlashdan oldin
1. `README.md` → **Server** bo'limi. «AVVAL SHART» bo'lsa — foydalanuvchi serverni deploy qilmaguncha yuklash BOSHLANMAYDI
   (health'da `version` yangi commit, `catalog` soni README'dagi son). Shartni foydalanuvchidan tasdiqlab oling.
2. Papka to'g'ri loyihada: `/home/kali/Desktop/internetLesson/` (kichik «i»). `InternetLesson` (katta «I») — eski nusxa, tegilmaydi.
3. README'dagi ⚠ qatorlar (lesson_id o'zgargan darslar) — birinchi yuklanadi.

## Har dars uchun
1. CRM → kurs «AI startup» → bo'lim (ROYXAT'dagi **bo'lim id**) → dars (ROYXAT'dagi **nom**; CRM material id ma'lum bo'lsa — to'g'ridan-to'g'ri).
2. Mavjud qator: «Tahrirlash» → **JSX faylni almashtirish** → ROYXAT'dagi YANGI fayl (`…-vN.jsx`). Eski faylni o'chirish shart emas — yangisi almashadi.
   uz qatoriga ham, ru qatoriga ham — **bir xil fayl** (til `lang` prop bilan keladi). Sarlavha, tartib, tur, holat o'zgarmaydi.
   Yangi dars (ROYXAT'da «— (yangi qator)»): «Yangi savol» → tur **JSX dars (Lesson Runner)**, uz tartib 1, ru tartib 2, sarlavha — ROYXAT'dagi nom (uz/ru).
3. **Tekshirish (majburiy):** yuklangan fayl havolasini oching (`…/uploads/lessons/lesson_runner/<hash>.jsx`), faylni yuklab olib
   md5 ni ROYXAT'dagi bilan solishtiring. Mos bo'lmasa — qayta yuklang; ikkinchi marta ham mos bo'lmasa — TO'XTANG, foydalanuvchiga ayting.
4. `yuklangan.csv` da shu qatorga: `yuklandi` = sana (YYYY-MM-DD), `crm_uz` / `crm_ru` = material id'lari (jadvaldagi # ustuni), `izoh` — bo'lsa.

## Taqiq
- Tartib, til, sarlavha, holat (Draft/Active) ni o'zgartirmaslik — faqat fayl.
- Paketda yo'q darsga tegmaslik; «CRM'da bor, paketda yo'q» qatorlar (`LMS_REESTR.json` → `crm_tashqari`) — so'ramasdan o'tkazib yuboriladi.
- Nomuvofiqlik (dars topilmadi · nom mos emas · bo'limda ortiqcha/kam qator) — to'xtab, foydalanuvchiga ayting; o'zingiz «moslashtirmang».

## Tugagach
Hisobot: nechta dars, qaysilari, md5 ✓ soni, to'xtagan joylar. Foydalanuvchi (yoki mexanizm seansi) yurgizadi:
`node scripts/lms-farq.mjs muhrla yuklash-<sana>-prod/yuklangan.csv --kim <seans nomi> [--server <gitlab-sha>]`
