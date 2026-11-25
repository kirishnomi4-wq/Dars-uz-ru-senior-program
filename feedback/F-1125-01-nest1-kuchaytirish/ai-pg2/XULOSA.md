# PG-2 AI bloki — haqiqiy AI yurgizishi xulosasi (25.11.2026)

Topshiriqlar: `00-promptlar.md`. AI: Claude Haiku ×2 (agent, fayl va buyruqsiz). Javoblar aynan: `A-oddiy/javob.md`, `B-tuzilish/javob.md`. `sorovlar.sql` — javobdagi SQL aynan, javob tartibida (B — beshta `sql` blokining hammasi, o'quvchi butun javobni nusxalagandek). Tekshiruv: `ai-tekshir-pg2.sh` — vaqtinchalik PostgreSQL 18, `shop` + PG-2 1-bosqichdagi 4 qator → `natija.txt`.

Kutilgan yakuniy holat: Klaviatura 120000 8 · Sichqoncha 75000 15 · Quloqchin **90000** 5 · Monitor **1500000** 3 · Kolonka yo'q.

| Topshiriq | A · oddiy (tuzilish aytilmagan) | A · nomlar almashtirilgan¹ | B · tuzilish va qoidalar bilan |
|---|---|---|---|
| jadval/ustun | o'ylab topdi: `mahsulotlar (nomi, narxi, soni)` | `products (name, price, stock)` | `products` ✓ |
| 1 arzonlar | ERROR `relation "mahsulotlar" does not exist` | 3 qator ✓ | 3 qator ✓ |
| 2 Quloqchin 90 000 | ERROR (o'sha) | `SELECT` 1 qator → `UPDATE 1` ✓ (`ILIKE '%quloqchin%'`) | `SELECT` 1 qator → `BEGIN` · `UPDATE 1` · `COMMIT` ✓ |
| 3 «Kolonkani o'chir» | **`ALTER TABLE mahsulotlar DROP COLUMN kolonka;`** — mahsulot emas, **ustun** | ERROR `column "kolonka" … does not exist` — Kolonka joyida | **ustun deb tushundi**: «qaysi kolonka aniq emas» + shablon `BEGIN; ALTER TABLE products DROP COLUMN <kolonka_nomi>;` → ERROR `syntax error at or near "<"` |
| 4 Monitor | ERROR (o'sha) | `INSERT 0 1` ✓ | **ERROR `current transaction is aborted…`** — Monitor qo'shilmadi |
| Yakuniy holat | o'zgarmadi (4 qator) | Quloqchin 90000 · Monitor bor · **Kolonka bor** | Quloqchin 90000 · **Monitor yo'q · Kolonka bor** |

¹ A o'zi yozgan: «Haqiqiy nomlar boshqacha bo'lsa, ularni almashtiring». Mentor faqat shuni qildi: `mahsulotlar→products`, `nomi→name`, `narxi→price`, `soni→stock` (`A-oddiy-nomlar/`).

**Tuzatish (`A-tuzatilgan/`, yurgizilgan):** 6-satr `ALTER TABLE products DROP COLUMN kolonka;` → `DELETE FROM products WHERE name = 'Kolonka';` → `DELETE 1`; yakuniy holat kutilgan bilan bir xil.

**Qo'shimcha (`qoshimcha-drop-column/`, yurgizilgan):** agar AI taxmin qilgan ustun jadvalda bo'lsa — `ALTER TABLE products DROP COLUMN stock;` → `ALTER TABLE` (ogohlantirishsiz), to'rtala qatordan `stock` qiymati yo'qoldi.

## Darsga haqiqiy material
1. **Ikkala AI ham «Kolonka»ni ustun (колонка, column) deb tushundi** — hatto jadval tuzilishi va 4 qatorli do'kon aytilganda ham (B ma'lumotni ko'rmagan). So'z ikki ma'noli: mahsulot (kolonka — karnay) va jadval ustuni. Topshiriq «o'chirish» edi (CRUD — `DELETE`), AI esa jadval tuzilishini o'zgartiradigan `ALTER TABLE … DROP COLUMN` yozdi.
2. Tuzilish aytilmasa AI jadval va ustun nomini o'ylab topadi — `relation … does not exist` (m4-06 dagi «`FROM product`» xatosining haqiqiy ko'rinishi).
3. B qoidaga amal qildi (`SELECT` → `BEGIN` → `UPDATE 1` → `COMMIT`) — PG-2 2-bosqichdagi usul. Lekin javobni butunlay nusxalaganda shablondagi `<…>` xatosi tranzaksiyani buzdi va keyingi `INSERT` ham bajarilmadi (PG-2 10-ekran: aborted, `!#`).
4. Mentor tekshiruvi: buyruq fe'li topshiriqqa mosmi (ko'rish — `SELECT`, o'zgartirish — `UPDATE`, o'chirish — `DELETE`, qo'shish — `INSERT`) · jadval va ustun nomi `\d products` bilan bir xilmi · javobdagi son (`UPDATE 1`, `DELETE 1`) · yakunda `SELECT *` bilan kutilgan holat.

## Halol cheklov
Ikkala AI bir model (Haiku), har biri bir marta so'raldi. «Kolonka» ikki ma'noli so'z — boshqa nomli mahsulotda (masalan, «Monitor») bu xato chiqmasligi mumkin; darsda shunday aytiladi.
