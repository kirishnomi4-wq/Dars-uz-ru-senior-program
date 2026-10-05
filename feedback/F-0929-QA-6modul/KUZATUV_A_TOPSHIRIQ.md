# 6-Modul · Kuzatuvlar A guruhi — matn nomuvofiqliklarini tuzatish (F-1004-70, 05.10.2026)

Bandlar: `feedback/F-0929-QA-6modul/KUZATUVLAR_2026-10-05.md` → **A** jadvali (topshiriq xabarida qaysi band sizga berilgani yozilgan).
Faqat shu bandlar, faqat o'zingizga berilgan dars fayli(lar)i va uning YAKUNIY MD fayli. Commit YO'Q.

## Qoidalar
1. O'zgaradi faqat o'quvchi ko'radigan matn (uz + ru juftligi). Ekranlar, mexanika, kalitlar (`INLINE_KEYS`, `correctIdx`, `correct`, `Q_LABELS`, `RECAPS` kalitlari),
   analitika-payload (`questionText`) — O'ZGARMAYDI. Tugma/yorliq matnini o'zgartirmang — Mentor/izoh gapini tugmaga moslang (aksincha emas), band boshqacha demasa.
2. Avval kodda haqiqiy holatni toping (grep/sed): tugmaning aniq matni, sanagich qaysi son, qaysi ekran. Matn shunga AYNAN mos bo'lsin.
3. Adabiy til, siz-forma, sinonim yo'q (bir ma'no — bir so'z), Mentor ≤2 gap, sarlavha bitta qator (≤55).
4. O'zbekcha matn o'zgarsa — `feedback/F-0929-QA-6modul/YAKUNIY/NN-<Nom>.md` dagi o'sha joyni ham aynan yangilang (YAKUNIY = kod).
5. Band noaniq yoki tuzatish mexanikaga tegishi kerak bo'lib chiqsa — TEGMANG, hisobotda «B ga» deb yozing.

## Tekshiruv (har fayl)
`npm run gates -- <FAYL>` 12/12 · `CHROME_PATH=/usr/bin/google-chrome node tools/ru-walk.mjs <FAYL> --langs=ru` ✓ TOZA · `npm run lint:jsx` 0 ·
sarlavha o'zgarsa: `CHROME=/usr/bin/google-chrome node scripts/sarlavha-qator.mjs <FAYL>` 0 (skript endi shriftni kutadi; TimeoutError — yolg'iz qayta) ·
o'zgargan ekran surati: `node konveyer/vositalar/ekran.mjs <FAYL> $S/<NN>-kuz/c "<ekran>:<bosish>"` — Read bilan ko'ring. Turn-byudjeti ≤35 bitta fayl uchun.

## Hisobot
Har band: eski → yangi (file:line) · YAKUNIY yangilandi (ha/yo'q) · darvozalar. «B ga» o'tganlar alohida.
