SELECT id, name, price, stock
FROM products
WHERE price < 100000;
SELECT id, name, price
FROM products
WHERE name = 'Quloqchin';
BEGIN;

UPDATE products
SET price = 90000
WHERE name = 'Quloqchin';

-- Yangilangan qatorni tekshiring, keyin:
COMMIT;      -- to'g'ri bo'lsa
-- ROLLBACK; -- noto'g'ri bo'lsa
-- Avval tekshirish: bu kolonka bormi?
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'products';

BEGIN;
ALTER TABLE products DROP COLUMN <kolonka_nomi>;
-- Tekshirgach: COMMIT;  yoki ROLLBACK;
INSERT INTO products (name, price, stock)
VALUES ('Monitor', 1500000, 3);
