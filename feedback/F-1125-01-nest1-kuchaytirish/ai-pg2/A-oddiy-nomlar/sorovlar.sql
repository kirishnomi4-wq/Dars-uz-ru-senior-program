SELECT * FROM products WHERE price < 100000;
-- Avval tekshiring, nechta qator chiqishini ko'ring:
SELECT * FROM products WHERE name ILIKE '%quloqchin%';
-- Keyin yangilang:
UPDATE products SET price = 90000 WHERE name ILIKE '%quloqchin%';
ALTER TABLE products DROP COLUMN kolonka;
INSERT INTO products (name, price, stock) VALUES ('Monitor', 1500000, 3);
