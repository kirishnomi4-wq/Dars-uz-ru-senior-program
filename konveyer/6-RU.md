# 6 · RU-tarjimon (bitta dars = bitta agent = bitta fayl)

Darsning o'zbekcha matni MD bo'yicha tayyor, ruscha (`ru:`) esa eski yoki quruvchining qisqa varianti. Vazifa: `uz` o'zgargan juftliklarda `ru` ni YANGI `uz`
ma'nosiga moslab yozish. **`uz` ga TEGILMAYDI.** `S` — o'z scratchpad'ingiz, ishchi papka `$S/<NN>-ru/`.

## Kirish
- Ish-ro'yxati: `node konveyer/vositalar/ru-wl.mjs <FAYL> $S/<NN>-ru/wl.json` (baza — git HEAD). `items[]`: `id`, `line`, `kind` (str | tpl | jsx | arr | expr),
  `uz` (yangi, etalon), `ru_old` (faqat ma'lumot), `emojiOnly`, `ruByBuilder` (quruvchining qisqa ruschasi — yaxshilang). `_`-maydonlarga tegmang. `manual: true` — Edit bilan.
- Ma'no-manba: MD v3 (A-bo'lim — atamalar). Uslub: `RU_I18N_SPEC.md` 5, 9, 10-bo'limlar. Karta: `QURISH_KARTASI.md` R guruhi.

## Qoidalar
1. Tarjima YANGI `uz` dan; `ru_old` iborasi ma'no bir xil bo'lsa qayta ishlatiladi.
2. «Вы»-forma, 13–16 yoshli o'smirga tabiiy ruscha, kantselyaritsiz; uzunligi uz bilan taxminan teng (tugma, sarlavha bir qatorga sig'sin).
3. Emoji uz bilan AYNAN bir xil. `kind: jsx` — teglar (`<b>`, `<code>`, `<span …>`) mantiqan o'sha joyda, `{…}` ifodalar aynan. `kind: tpl` — `${…}` belgima-belgi.
4. Kod identifikatorlari, buyruqlar, fayl nomlari, tekshiruv qidiradigan qiymatlar O'ZGARMAYDI — faqat izoh va xabar-satrlar.
5. Narx-son U+00A0 saqlanadi («35 000 сумов»). Analitika-payload (`questionText`, `onAnswer(... question)`, `options`, `correctAnswer`) O'ZBEKCHA qoladi.
6. Fon so'zlari (arena `QZ_BG_SHAPES`, canvas `TOK`, `HW_TOKENS`) — o'quvchi so'zi `{ uz, ru }`, kod-belgi o'zgarmaydi (R-008).
7. Bir tushuncha — bir ruscha nom: modul lug'ati MD A-bo'limida; oldingi modul darslaridagi tarjima bilan bir xil (grep `ru:` da). AI → «ИИ» (oddiy matnda).

## Ish tartibi (turn-byudjeti ≤40)
1. `cp <FAYL> $S/<NN>-ru/base.jsx` (uz-etalon, tarjimadan OLDIN). Ish-ro'yxatini yarating.
2. Tarjimalar `$S/<NN>-ru/tr-1.json`, `-2.json` … (har birida ≤80 ta `"<id>": "<ru>"`).
3. Birlashtiring va qo'ying: `node konveyer/vositalar/ru-wl.mjs --apply $S/<NN>-ru/wl.json $S/<NN>-ru/tr.json` — «tarjimasiz: 0 · XATO: 0».
4. `manual` bandlar va ru-gate «qoldiq-nomzod»lari — Edit bilan.
5. Darvozalar:
   - `node tools/ru-gate.mjs $S/<NN>-ru/base.jsx <FAYL>` → **TENG** (uz bitta belgiga ham o'zgarmagan).
   - `npm run gates -- <FAYL>` → 12/12 · `npm run lint:jsx` → 0.
   - `CHROME_PATH=/usr/bin/google-chrome node tools/ru-walk.mjs <FAYL> --langs=ru --shots` → **✓ TOZA**; 4–5 ta ekranni Read bilan ko'ring.
6. `git diff` da kalitlar o'zgarmagan. Commit YO'Q.

## Hisobot
Qo'yilgan ru soni · manual soni · ru-gate · gates · ru-walk · lug'atdan tashqari tanlangan atamalar · shubhali joylar (id + sabab).
