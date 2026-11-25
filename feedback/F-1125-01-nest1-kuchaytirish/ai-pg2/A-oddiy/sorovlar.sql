SELECT * FROM mahsulotlar WHERE narxi < 100000;
-- Avval tekshiring, nechta qator chiqishini ko'ring:
SELECT * FROM mahsulotlar WHERE nomi ILIKE '%quloqchin%';
-- Keyin yangilang:
UPDATE mahsulotlar SET narxi = 90000 WHERE nomi ILIKE '%quloqchin%';
ALTER TABLE mahsulotlar DROP COLUMN kolonka;
INSERT INTO mahsulotlar (nomi, narxi, soni) VALUES ('Monitor', 1500000, 3);
