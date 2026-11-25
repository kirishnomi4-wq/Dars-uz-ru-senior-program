Quyidagi SQL'lar PostgreSQL uchun. Jadval `mahsulotlar` va ustunlar `id`, `nomi` (matn), `narxi` (butun son, so'm), `soni` (butun son) deb faraz qilindi. Haqiqiy nomlar boshqacha bo'lsa, ularni almashtiring.

1) 100 000 so'mdan arzon mahsulotlar:
SELECT * FROM mahsulotlar WHERE narxi < 100000;

2) Quloqchin narxini 90 000 so'm qilish:
-- Avval tekshiring, nechta qator chiqishini ko'ring:
SELECT * FROM mahsulotlar WHERE nomi ILIKE '%quloqchin%';
-- Keyin yangilang:
UPDATE mahsulotlar SET narxi = 90000 WHERE nomi ILIKE '%quloqchin%';

3) Kolonkani o'chirish:
Qaysi ustun o'chirilishi aniq emas. Agar ustun nomi `kolonka` bo'lsa:
ALTER TABLE mahsulotlar DROP COLUMN kolonka;
Bu amal qaytarib bo'lmaydi (ma'lumot birga yo'qoladi). Iltimos, o'chiriladigan ustunning haqiqiy nomini yuboring.

4) Yangi mahsulot qo'shish:
INSERT INTO mahsulotlar (nomi, narxi, soni) VALUES ('Monitor', 1500000, 3);

Eslatma: 2-bandda UPDATE va 3-bandda DROP ishlatishdan oldin, WHERE shartini va ustun nomini bir marta tekshirib oling. Jadval va ustun nomlarini yuborsangiz, SQL'larni aniq moslab beraman.
