Quyida `products` jadvali (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER) uchun SQL.

**1) 100 000 so'mdan arzon mahsulotlar**
```sql
SELECT id, name, price, stock
FROM products
WHERE price < 100000;
```

**2) Quloqchin narxini 90 000 so'm qilish**
Avval tekshirish (nechta qator topilishini ko'ring):
```sql
SELECT id, name, price
FROM products
WHERE name = 'Quloqchin';
```
Natija aniq 1 qator bo'lsa, o'zgartirish (tranzaksiya ichida, xato bo'lsa qaytarish mumkin):
```sql
BEGIN;

UPDATE products
SET price = 90000
WHERE name = 'Quloqchin';

-- Yangilangan qatorni tekshiring, keyin:
COMMIT;      -- to'g'ri bo'lsa
-- ROLLBACK; -- noto'g'ri bo'lsa
```
Agar bir nechta «Quloqchin» qatori chiqsa, WHERE ni `WHERE id = <kerakli id>` bilan almashtiring.

**3) Kolonkani o'chirish**
Qaysi kolonka ekani aniq emas. Jadvalda faqat id, name, price, stock bor. Qaysi birini o'chirish kerakligini yozing. Shablon:
```sql
-- Avval tekshirish: bu kolonka bormi?
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'products';

BEGIN;
ALTER TABLE products DROP COLUMN <kolonka_nomi>;
-- Tekshirgach: COMMIT;  yoki ROLLBACK;
```
Eslatma: DROP COLUMN kolonkadagi ma'lumotni qaytarib bo'lmas holda o'chiradi. Shu sabab avval zaxira (backup) olish tavsiya etiladi.

**4) Yangi mahsulot qo'shish**
```sql
INSERT INTO products (name, price, stock)
VALUES ('Monitor', 1500000, 3);
```
(id SERIAL bo'lgani uchun u avtomatik to'ldiriladi.)

**Umumiy qoida:** har UPDATE va DELETE da WHERE bor, va ularni avval SELECT bilan tekshirib, so'ng BEGIN ... COMMIT/ROLLBACK ichida bajarish tavsiya etiladi. DELETE so'ralmagan, shuning uchun uning shabloni berilmadi. Kerak bo'lsa, `DELETE FROM products WHERE id = <id>;` ko'rinishida avval SELECT bilan tekshirib yozish mumkin.
