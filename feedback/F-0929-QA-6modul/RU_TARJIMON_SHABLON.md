# RU-tarjimon topshirig'i — 6-Modul v2 (bitta dars = bitta agent = bitta fayl)

Darsning o'zbekcha matni MD v2 bo'yicha yangilangan (29.09), ruscha (`ru:`) esa eski holida qolgan.
Vazifa: `uz` o'zgargan juftliklarda `ru` ni YANGI `uz` ma'nosiga moslab qayta yozish. `uz` ga TEGILMAYDI.

## Kirish
- Ish-ro'yxati: `<SCRATCH>/wl-<FAYL>.json` — `items[]`: `id`, `line`, `kind` (str | tpl | jsx), `uz` (yangi, etalon),
  `ru_old` (eski ruscha — faqat ma'lumot uchun), `emojiOnly` (true = uz'dan faqat emoji olib tashlangan).
  `_`-bilan boshlangan maydonlar — skript uchun, tegmang.
- Ma'no-manba: `feedback/F-0929-QA-6modul/<NN>-<NOM>-v2.md` — faqat **A-bo'lim** (darsning tayanchi, atamalar) majburiy;
  qolganini kerak bo'lsa grep bilan.
- Uslub: `RU_I18N_SPEC.md` 5 va 9-bo'limlar.
- Dars fayli: `src/6-Modull/<FAYL>.jsx` — kontekst kerak bo'lsa `sed -n` bilan qator atrofi (butun faylni o'qimang).

## Tarjima qoidalari
1. Tarjima YANGI `uz` dan qilinadi. `ru_old` dagi yaxshi ibora ma'no bir xil bo'lsa qayta ishlatiladi; ma'no o'zgargan bo'lsa — yangidan.
2. «Вы»-forma, 13–16 yoshli o'smirga tabiiy ruscha, kantselyaritsiz. So'zma-so'z emas — ma'no.
3. **Emoji uz bilan AYNAN bir xil** (161-qonun): uz'da yo'q emoji ru'da ham bo'lmaydi; `emojiOnly: true` — ru_old'dan o'sha emojini olib tashlang, matn o'zgarmaydi.
4. `kind: jsx` — uz'da `<b>`, `<code>`, `<br/>`, `<span …>` bo'lsa, ru ham `<>…</>` bo'ladi va o'sha teglar mantiqan o'sha joyda turadi; `{…}` ifodalar aynan ko'chiriladi. Teg bo'lmasa — oddiy matn qaytarish mumkin.
5. `kind: tpl` — `${…}` ifodalar belgima-belgi bir xil.
6. Kod ichidagi identifikatorlar (`dalillar`, `sanagani`, `royxat`, `saqlash()`, fayl nomlari, `API_URL`…) va `"natija"` kabi tekshiruvga bog'liq qiymatlar O'ZGARMAYDI — faqat izohlar/xabar-satrlar tarjima qilinadi (9-bo'lim).
7. Sonlar, «» qo'shtirnoqlar, tire (—), `·` ajratkichlar uz bilan bir xil joyda.
8. Dars ichida bir tushuncha — bir ruscha nom (A-bo'limdagi atamalar uchun o'zingiz tanlang va izchil qoling).

## Modul lug'ati (14 dars bir xil bo'lsin)
| uz | ru |
|---|---|
| Mentor | Ментор |
| Aynan! (hook, to'g'ri) · Qiziq fikr! (hook, boshqa variant) | Именно! · Интересная мысль! |
| bu yerga qo'ying (DnD katak) | положите сюда |
| Kod yozish (bo'lim) | Пишем код |
| O'zingiz o'ylab ko'ring (bo'lim) | Подумайте сами |
| Qisqa takrorlash | Короткое повторение |
| foydalanuvchi · mijoz (rol) | пользователь · клиент |
| kompilyator — lug'at izohi bilan | компилятор |
| Skill, description, body, frontmatter, pipeline, deploy, Expo, AsyncStorage | aslicha (lotin) |
| ilovani yaratayotgan odam — siz | тот, кто создаёт приложение, — вы |
| tayyor starter loyiha | готовый стартовый проект |
| o'tgan dars / N-darsda | прошлый урок / на N-м уроке (raqam uz bilan bir xil) |

## Pilot saboqlari (14-dars, 29.09)
- `emojiOnly` belgisi bo'lmasa ham: uz'da emoji yo'q joyda eski ru'dagi emoji olib tashlanadi (3-qoida).
- ru-gate «qoldiq-nomzod»lari orasida tekshiruv kutadigan qiymatlar bo'ladi (`KOD_DATA`, `evalEquals`, `checks`) — ular o'quvchiga ko'rinmaydi, TEGILMAYDI.
- Ruscha kod-shablonida o'zbekcha qiymatlarni (`"natija"`) izohlaydigan bitta izoh-qator qolishi mumkin — rus o'quvchi uchun.

## Ish tartibi (turn-byudjeti: ≤150 juft — ≤25, undan ko'p — ≤35)
1. Ish-ro'yxati + MD A-bo'lim + SPEC 5/9 ni o'qing.
2. Tarjimalarni `<SCRATCH>/tr-<FAYL>-1.json`, `-2.json` … ga yozing (Write; har birida ≤80 ta `"<id>": "<ru>"`). Hammasi yopilishi shart.
3. Birlashtiring va qo'ying:
   `node -e "const f=require('fs');const o={};for(const p of process.argv.slice(1))Object.assign(o,JSON.parse(f.readFileSync(p)));f.writeFileSync('<SCRATCH>/tr-<FAYL>.json',JSON.stringify(o))" <SCRATCH>/tr-<FAYL>-*.json`
   `node <SCRATCH>/apply.mjs <SCRATCH>/wl-<FAYL>.json <SCRATCH>/tr-<FAYL>.json` — «tarjimasiz: 0» bo'lishi shart. XATO chiqsa — o'sha id'ni tuzatib qayta.
4. Darvozalar:
   - `node tools/ru-gate.mjs arxiv/m6-v2-uz-baseline-2026-09-29/<FAYL>.jsx src/6-Modull/<FAYL>.jsx` → **TENG** (uz bitta belgiga ham o'zgarmagan). FARQ — to'xtang, hisobot bering.
   - ru-gate «qoldiq-nomzod» ro'yxatini ko'ring: o'quvchiga ko'rinadigan o'zbekcha matn `ru`siz qolgan bo'lsa — `tr({ uz: <o'sha matn aynan>, ru: '…' })` ga o'rang (Edit; data-konstantada `tr()` chaqirmang — `{ uz, ru }` obyekt, render'da `tr`). Keyin ru-gate yana TENG bo'lishi shart.
   - `npm run gates -- src/6-Modull/<FAYL>.jsx` → 9/9.
   - `CHROME_PATH=/usr/bin/google-chrome node tools/ru-walk.mjs src/6-Modull/<FAYL>.jsx --langs=ru` → TOZA.
5. `git diff` da `INLINE_KEYS`, `correct:`, `correctIdx` o'zgarmagan bo'lsin. Commit YO'Q. Boshqa faylga tegilmaydi.

## Hisobot (qisqa)
Qo'yilgan ru soni · o'rash (qoldiq) soni · ru-gate · gates · ru-walk · A-bo'lim atamalari uchun tanlangan ruscha nomlar (1 qatordan) · shubhali joylar (id + sabab).
