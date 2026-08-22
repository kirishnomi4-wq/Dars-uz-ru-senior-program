# PmLesson15–18 — UZ etalon-nusxalari (2026-08-22)

Bu papkadagi fayllar `tools/ru-gate.mjs` uchun **baseline** bo'lib xizmat qiladi:
`node tools/ru-gate.mjs arxiv/pm15-18-uz-baseline-2026-08-22/PmLesson15.jsx src/4a-Modull/PmLesson15.jsx`
→ `✓ TENG` bo'lishi shart (UZ matn tarjimada bir belgiga ham o'zgarmagan).

Nusxalarga tarjima paytida **ataylab** kiritilgan, matnga tegmaydigan o'zgarishlar sabab bilan ko'chirilgan
(shunda ular darvozada jimgina o'tib ketmaydi):

1. **Obyekt-kalit xavfi** — `key={d.q}` / `key={c.h}` / `key={g.t}` / `key={r.nom}` → `key={i}`.
   `{uz,ru}` obyekt kalit sifatida `[object Object]` beradi: barcha elementlar bitta kalitga tushardi.
2. **Ikki tilli belgi-regexlari** — o'quvchi RU rejimda ruscha yozadi, UZ regexlari hech qachon mos kelmasdi
   (M3-D10 da tutilgan sinf). `OGIR_BELGI`/`YENGIL_BELGI`/`BOSH_SOZ`/`HARAKAT`/`NATIJA`/`AKTIV`/`ODAM_RE`
   `{uz, ru}` juftligiga ajratildi, `anyTest(pair, s)` ikkala tilni sinaydi.
3. **`normQism`/`normS`/`normIsh` kirill-diapazoni** — `[^a-z0-9 ]+` ruscha matnni butunlay yeb qo'yardi
   (ikki xil javob bir xil "takror" bo'lib ko'rinardi) → `[^a-z0-9Ѐ-ӿ ]+`.
4. **Shablon-satrga yig'ish** — bir nechta JSX bolasi bitta `` `…${x}…` `` ga yig'ildi (matn o'zgarmagan),
   shunda `tr({uz, ru})` ichiga butun jumla sifatida kiradi.
5. **Arena canvas `TOK` ro'yxati** — `tr({uz:[…], ru:[…]})`: canvas matnini `tr()` ko'rmaydi,
   ro'yxat til bo'yicha tanlanadi.
