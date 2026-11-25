# F-1125-01 · PG-2 AI bloki — haqiqiy AI yurgizishi (25.11.2026)

**Asos:** o'quvchi darsi m4-06 (`src/4-Modull/PostgresCrudLesson.jsx`) — Screen11 «AI bilan #1» (o'quvchi oddiy tilda aytadi: «100 000 so'mdan arzon mahsulotlarni ko'rsat», AI SQL yozadi), Screen14 «AI xatosini tut» (tayyor misol: `FROM product`), amaliyot «VS Code yoki psql'da AI bilan birga O'Z do'koningiz uchun… CRUD — AI SQL yozadi, siz tekshirib bajarasiz».
**Baza:** PG-2 darsining `shop` bazasi, 1-bosqichdagi holat: `products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER)` + 4 qator (Klaviatura 120000 8 · Sichqoncha 75000 15 · Quloqchin 95000 5 · Kolonka 50000 10).
**Topshiriqlar:** o'quvchi amaliyotidagi to'rt amal — ko'rish (WHERE), o'zgartirish, o'chirish, qo'shish — darsning 1-bosqichidagi `products` jadvalida. Uyga vazifa (shop-api: `schema.sql` qoidalari, `orders`, `server.js`, tranzaksiya) bilan to'qnashmaydi: bu to'rt so'rov uning hech bir qismini bajarmaydi.
**AI:** Claude Haiku ×2 (agent), fayl va buyruqsiz — oddiy chatdagi javob.

## A · Oddiy topshiriq (o'quvchi so'zlari, jadval tuzilishi aytilmaydi)
> Do'konim bazasida mahsulotlar bor. PostgreSQL uchun SQL yozib ber:
> 1) 100 000 so'mdan arzon mahsulotlarni ko'rsat
> 2) Quloqchin narxini 90 000 so'm qil
> 3) Kolonkani o'chir
> 4) yangi mahsulot qo'sh: Monitor, 1 500 000 so'm, 3 dona

## B · Jadval tuzilishi va qoidalar bilan
> PostgreSQL, `shop` bazasi. Jadval: `products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER)`.
> Quyidagilar uchun SQL yoz: (o'sha 4 band)
> Har UPDATE va DELETE'da WHERE bo'lsin; o'zgartirishdan oldin SELECT bilan tekshirib olinadigan qilib yoz.

## Agent o'rami (ikkalasiga bir xil)
«Sen oddiy chat-yordamchisan. Foydalanuvchi xabariga chatda qanday javob bersang, shunday javob ber. Fayl o'qima, buyruq yurgizma. Yakuniy javobing — faqat foydalanuvchiga yoziladigan matn, boshqa izohsiz.»

## Mentor tekshiruvi (`ai-tekshir-pg2.sh`)
Vaqtinchalik PostgreSQL 18 klaster, `shop` + 4 qator; AI'ning SQL'i aynan, har buyruq alohida (`psql -e`): javobdagi son (`UPDATE n`, `DELETE n`, `INSERT 0 n`), xato xabari; oxirida `SELECT * FROM products ORDER BY id` — kutilgan holat bilan solishtiriladi: Klaviatura 120000 8 · Sichqoncha 75000 15 · Quloqchin **90000** 5 · Monitor **1500000** 3; Kolonka yo'q.
