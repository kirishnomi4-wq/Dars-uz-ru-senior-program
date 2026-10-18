# NAZORAT-TOPSHIRIQ · Oq sudraladigan elementlar — qolgan 6 fayl (5, 7, 8, 12-Modul)
Manba: F-1015-361 supurishi (17.10), qaror sahifasi 4-raund savol 13 — foydalanuvchi 18.10 tasdiqladi.
Qoida: DE-159.15 / tekshiruvchi 22-band — sudraladigan CHIP faqat to'ldirilgan gradient (#B3361A, oq yozuv, ⠿), namuna `src/6-Modull/SystemArchitectureLesson.jsx` `.dd-chip`.
KARTA (ustunga sudraladigan katta karta) qoida doirasida EMAS — oq qoladi (foydalanuvchi qarori 18.10: DbSqlNosql `.qx-card`, NestArchAlive `.rz-card` oq qoldi).

## Nima qilinadi (nazorat seansi, LMS 7–14 doirasi)
1. `grep -rln "cursor: *grab" src/5-Modull src/7-Modull src/8-Modull src/12-Modull` — sudraladigan element bor fayllar (17.10 sanog'ida 6 ta).
2. Har faylda element chipmi yoki kartami — brauzerda surat (chip: bir qatorli yorliq; karta: sarlavha + matn/ikonka).
3. Chip bo'lsa — `qurish/f361-dd-global.py` uslubida faqat o'sha klassning fon/rang/`::before` qatori gradientga; karta — tegilmaydi, ro'yxatga yoziladi.
4. Har fayl `npm run gates -- <fayl>`; tell/emoji soni HEAD bilan bir xil bo'lishi shart. Oq matnli gradient chip kontrast-ro'yxatiga kirmaydi.
5. Natija shu faylga: fayl · klass · chip/karta · qilindi/qoldi.

Holat 4 va 4a-Modul (3-seans, F-1017-202 — tugagan): DataIntro `.cdrag-chip` ✓ · NestArchResource `.oc-plate-chip` ✓ · DbSqlNosql `.qx-card` karta · NestArchAlive `.rz-card` karta.
