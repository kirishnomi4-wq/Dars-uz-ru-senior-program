# 6-Modul · Sarlavha bitta qator (164-qonun) — yopishdan oldin (F-1004-69, 05.10.2026)

`scripts/sarlavha-qator.mjs` (1280×800, uz va ru) ikki qatorga tushgan ekran sarlavhalarini (`.h-title`) topdi. Vazifa — ularni **bitta qatorga sig'dirish**.
Faqat ro'yxatdagi sarlavhalar va faqat o'zingizga berilgan fayl(lar). Boshqa matn, tuzilma, kalitlar — O'ZGARMAYDI. Commit YO'Q.

## Qoidalar
1. Ma'no saqlanadi, so'z qisqaradi: ortiqcha so'zni oling, sinonim qo'shmang (MK §225: sarlavha ≤55 belgi, Mentor gapini takrorlamaydi). Siz-forma, adabiy til.
2. Rangli `<span className="italic" …>` urg'usi qoladi (boshqa so'zga ko'chishi mumkin). Oxiridagi nuqta/so'roq belgisi qoladi.
3. Faqat ruschasi ikki qatorga tushsa — faqat `ru` qisqaradi; o'zbekchasi tushsa — `uz` (va ma'no bir xil bo'lishi uchun `ru` ham).
4. CSS bilan yechmang (`white-space: nowrap`, shrift kichraytirish yo'q) — faqat matn.
5. O'zbekcha sarlavha o'zgarsa — `feedback/F-0929-QA-6modul/YAKUNIY/NN-<Nom>.md` dagi shu ekranning «Sarlavha: …» qismini ham aynan yangilang (YAKUNIY = kod).

## Tekshiruv
`CHROME=/usr/bin/google-chrome node scripts/sarlavha-qator.mjs <FAYL>` — **0 ta 2 qatorli** · `npm run gates -- <FAYL>` 12/12 ·
`CHROME_PATH=/usr/bin/google-chrome node tools/ru-walk.mjs <FAYL> --langs=ru` ✓ TOZA · `npm run lint:jsx` 0. TimeoutError — yolg'iz qayta (parallel Chrome).
Turn-byudjeti ≤40 (bitta fayl). Vaqtinchalik — `$S/<NN>-sarlavha/`.

## Hisobot
Har sarlavha: ekran · til · eski → yangi (belgi soni) · YAKUNIY yangilandi (ha/yo'q). Oxirida darvozalar natijasi.
