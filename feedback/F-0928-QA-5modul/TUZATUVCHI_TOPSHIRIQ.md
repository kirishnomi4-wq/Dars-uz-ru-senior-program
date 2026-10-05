> ⚠️ ESKI (tarix) — 04.10.2026 dan amaldagisi: **`konveyer/5-TUZATUVCHI.md`** (zanjir: `konveyer/README.md`). Bu nusxa F-0928-QA-5m jurnalidagi havolalar uchun saqlandi.

# Tuzatuvchi topshirig'i — vizual buzilishlar (5-Modul, 01.10, F-1001-70)

Siz bitta darsdagi aniq ro'yxatdagi VIZUAL buzilishlarni tuzatasiz. Ro'yxat — topshiriq xabarida. Ro'yxatdan tashqariga chiqmaysiz.

## Qoidalar
1. Faqat ko'rsatilgan fayl. `App.jsx`, `src/live/*`, boshqa darslar — TEGILMAYDI. Commit yo'q.
2. O'quvchi ko'radigan `uz` matni O'ZGARMAYDI (MD v2 — manba-haqiqat). Matnni faqat JSX ichida o'rash (`<span style={{ whiteSpace: 'nowrap' }}>`)
   yoki kodni qator-qator qayta formatlash mumkin — so'zlar o'sha.
3. Kalitlar (`INLINE_KEYS`, `correctIdx`, `QUIZ_BANK.correct`, variantlar tartibi) o'zgarmaydi.
4. **Telefondagi bog'lovchi chiziq qoidasi (N20 nomzodi):** ustunlar tor ekranda ustma-ust tushganda (odatda `@media (max-width: 760px)`)
   ustunlararo bog'lovchi chiziq/strelka KO'RSATILMAYDI (`display: none` yoki chizish shartida `side`/kenglik tekshiruvi) — ma'no qator
   matnida, rangda yoki ✓ belgisida qoladi. Bir qator ichidagi kalta chiziq — qoladi.
5. **⛶ tugmasi qoidasi (U2):** tugma matn yoki qatordagi `›`/`✓` ustiga tushmaydi. Namuna (1-dars): `.zoomable:not(.z-empty):not(.zoom-on) { padding-top: 36px; }`
   `.zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: 0; }`.
6. Animatsiya qo'shmang. Bor animatsiyalar `prefers-reduced-motion` da o'chishi saqlanadi.
7. CSS shablon-satri ichida (izohda ham) BACKTIK yo'q; bir qatorli funksiya ichida `//` yo'q.
8. Vaqtinchalik fayllar — faqat `$S/<NN>-tuzat/` ichida.

## Tekshiruv (har band uchun)
`S=/tmp/claude-1000/-home-kali-Desktop-internetLesson/3bd76e5f-7e09-4e18-8722-cf23767cf55b/scratchpad`, `cd /home/kali/Desktop/internetLesson`:
- kompyuter: `SHOT_WAIT=2500 node $S/shots.mjs <FAYL> $S/<NN>-tuzat/desk <ekran>`
- telefon: `SHOT_W=390 SHOT_H=844 SHOT_WAIT=2500 node $S/shots.mjs <FAYL> $S/<NN>-tuzat/tel <ekran>`
- ekran ichida bosish: `CLICK='<sel>,<sel>' TAG=nom CLICK_WAIT=1500 …` · o'lchash: `EVAL='return …'`
Tuzatilgan har bandni ikkala qurilmada Read bilan KO'RING. Oxirida: `npm run gates -- <FAYL>` 9/9 · `npm run lint:jsx` 0.
Turn-byudjeti ≤60.

## Hisobot (qisqa)
| band | nima qilindi (file:line) | tekshiruv rasmi | holat (✓ / qisman + sabab) |
Oxirida: gates, lint:jsx, kalitlar o'zgarmadi (ha/yo'q), matn o'zgarmadi (ha/yo'q).
