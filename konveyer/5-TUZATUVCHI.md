# 5 · Tuzatuvchi — ro'yxatdagi vizual buzilishlar (bitta dars)

Ro'yxat — topshiriq xabarida (4-VIZUAL hisobotidan). Ro'yxatdan tashqariga chiqmaysiz.

## Qoidalar
1. Faqat ko'rsatilgan fayl. `App.jsx`, `src/live/*`, `src/qolip/*`, boshqa darslar — TEGILMAYDI (qolipdagi nuqson bo'lsa — hisobotga). Commit yo'q.
2. O'quvchi ko'radigan `uz` matni O'ZGARMAYDI (MD — manba-haqiqat). Faqat JSX ichida o'rash (`whiteSpace: 'nowrap'`) yoki kodni qayta formatlash.
3. Kalitlar (`INLINE_KEYS`, `correctIdx`, `QUIZ_BANK.correct`, variantlar tartibi, `Q_LABELS`) o'zgarmaydi.
4. Tor ekranda ustunlar ustma-ust tushganda ustunlararo bog'lovchi chiziq/strelka ko'rsatilmaydi; ⛶ tugmasi matn ustiga tushmaydi (qolip `Zoomable`).
5. Animatsiya qo'shmang; borlari `prefers-reduced-motion` da o'chadi. CSS shablon-satri ichida BACKTIK yo'q; bir qatorli funksiya ichida `//` yo'q.
6. Rang — faqat qolip tokenlari (q13). Vaqtinchalik fayllar — scratchpad ichida `<NN>-tuzat/`.

## Tekshiruv (har band)
- kompyuter: `SHOT_WAIT=2500 SHOT_H=773 node konveyer/vositalar/shots.mjs <FAYL> $S/<NN>-tuzat/desk <ekran>`
- telefon: `SHOT_W=390 SHOT_H=844 SHOT_WAIT=2500 …` · bosish: `node konveyer/vositalar/ekran.mjs <FAYL> $S/<NN>-tuzat/c "<ekran>:<sel>"`
Har bandni ikkala qurilmada Read bilan KO'RING. Oxirida: `npm run gates -- <FAYL>` 12/12 · `npm run lint:jsx` 0. Turn-byudjeti ≤60.

## Hisobot
| band | nima qilindi (file:line) | tekshiruv rasmi | holat (✓ / qisman + sabab) |
Oxirida: gates, lint:jsx, kalitlar o'zgarmadi (ha/yo'q), matn o'zgarmadi (ha/yo'q).
