# Mentor promptlari — OrderBotNest `tgpg-start` → PostgreSQL (04.11, haqiqiy AI yurgizishi)

Qolip (har prompt): **kontekst** (loyiha nima, hozir qanday) · **bitta bosqich maqsadi** · **qat'iy shartlar** · **nimaga tegmaslik** · **javobda nima bo'lsin** (fayllar + tekshirish buyrug'i).

## Prompt 1 — ulanish, migratsiya, katalog
Bu NestJS + Telegraf loyihasi (Telegram buyurtma boti). Hozir katalog, savat, foydalanuvchilar va buyurtmalar xotirada (Map va array) — server qayta ishga tushsa hammasi yo'qoladi. Ularni PostgreSQL'ga bosqichma-bosqich ko'chiramiz.

1-bosqich — faqat bazaga ulanish va katalog:
- TypeORM ulang (`@nestjs/typeorm`, `pg`). Manzil `.env` dagi `DATABASE_URL` dan, `src/config/index.ts` orqali o'qilsin.
- `synchronize` ishlatmang: jadvallar migratsiya bilan yaratilsin, server ko'tarilganda yurmagan migratsiya o'zi yursin.
- `products` jadvali: id, name (takrorlanmas), price, stock; stock manfiy bo'lmasin — bazada CHECK.
- Seed skript (`npm run seed`): hozirgi 6 mahsulotni kiritsin, ikkinchi marta yurganda takror qo'shmasin.
- `CatalogService` bazadan o'qisin, sahifalash qolsin (2 tadan).
- User, savat, buyurtma servislariga hali tegmang.

Javobingizda: qaysi fayllar o'zgardi, qanday ishga tushirish va psql'da nimani tekshirish kerak.

## Prompt 2 — foydalanuvchilar va state
2-bosqich — foydalanuvchilar bazaga:
- `users` jadvali: telegram_id, name, phone, role (customer/admin), state (IDLE/WAITING_PHONE), yaratilgan vaqt.
- Telegram id katta son bo'ladi (masalan 5123456789) — ustun turini shunga mos tanlang.
- /start ikkinchi marta bosilsa yangi qator ochilmasin, borini qaytarsin.
- role `.env` dagi `ADMIN_TELEGRAM_IDS` dan.
- Telefon kutilayotgan holat (WAITING_PHONE) ham bazada saqlansin: server qayta ishga tushsa ham bot telefon kutayotganini bilsin.
- Yangi migratsiya bilan; birinchi migratsiyani o'zgartirmang.
- Savat va buyurtmaga hali tegmang.

Javobingizda: o'zgargan fayllar va tekshirish (psql so'rovi bilan).

## Prompt 3 — savat
3-bosqich — savat bazaga:
- `cart_items` jadvali: foydalanuvchi, mahsulot, qty. Bitta foydalanuvchida bitta mahsulot faqat bitta qator bo'lsin — qayta qo'shilsa qty bittaga oshsin.
- Ikki marta tez bosilsa ham ikki qator paydo bo'lmasin (buni bazadagi qoida ham ushlasin).
- Savat server qayta ishga tushganda saqlanib qolsin.
- Yangi migratsiya. Buyurtmaga hali tegmang.

Javobingizda: o'zgargan fayllar va tekshirish.

## Prompt 4 — buyurtma, tranzaksiya, admin
4-bosqich — buyurtmalar bazaga:
- `orders` (foydalanuvchi, telefon, jami summa, status NEW/CONFIRMED/DELIVERED/CANCELLED, vaqt) va `order_items` (buyurtma, mahsulot, qty, buyurtma paytidagi narx).
- Buyurtma berish — bitta tranzaksiya: ombordan ayirish, buyurtma va qatorlarini yozish, savatni tozalash. Birortasi bajarilmasa hech narsa o'zgarmasin.
- Omborda yetmasa mijozga aniq xabar: «Planshet: omborda faqat 3 ta qoldi». Ikki mijoz oxirgi mahsulotni bir vaqtda olsa ham ortiqcha sotilmasin.
- Admin buyurtmani bekor qilsa mahsulotlar omborga qaytsin — bu ham tranzaksiyada.
- Bot matnlari va tugmalar o'zgarmasin.
- Yangi migratsiya.

Javobingizda: o'zgargan fayllar, tranzaksiya qanday ishlashi va tekshirish.
