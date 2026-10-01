# RU-tarjimon topshirig'i — 5-Modul v2 (bitta dars = bitta agent = bitta fayl)

Namuna: `feedback/F-0929-QA-6modul/RU_TARJIMON_SHABLON.md`. Darsning o'zbekcha matni MD v2 bo'yicha yangilandi (01.10), ruscha (`ru:`) esa
asosan eski holida. Vazifa: `uz` o'zgargan juftliklarda `ru` ni YANGI `uz` ma'nosiga moslab qayta yozish. **`uz` ga TEGILMAYDI.**

`S=/tmp/claude-1000/-home-kali-Desktop-internetLesson/3bd76e5f-7e09-4e18-8722-cf23767cf55b/scratchpad` · ishchi papka: `$S/<NN>-ru/`

## Kirish
- Ish-ro'yxati: `node $S/ru-wl.mjs <FAYL> $S/<NN>-ru/wl.json` (baza — git HEAD). `items[]`: `id`, `line`, `kind` (str | tpl | jsx | arr | expr),
  `uz` (yangi, etalon — manba-kod ko'rinishida, qo'shtirnoq bilan), `ru_old` (eski ruscha — faqat ma'lumot), `emojiOnly` (uz'dan faqat emoji olingan),
  `ruByBuilder` (quruvchi yangi elementga yozgan qisqa ruscha — tekshirib, yaxshilang). `_`-maydonlarga tegmang. `manual: true` — qo'lda (Edit).
- Ma'no-manba: `feedback/F-0928-QA-5modul/<NN>-<NOM>-v2.md` — A-bo'lim va «Darsning ipi» majburiy; qolganini kerak bo'lsa grep bilan.
- Uslub: `RU_I18N_SPEC.md` 5 va 9-bo'limlar. Dars fayli — kontekst kerak bo'lsa `sed -n` bilan qator atrofi (butun faylni o'qimang).

## Tarjima qoidalari
1. Tarjima YANGI `uz` dan. `ru_old` dagi ibora ma'no bir xil bo'lsa qayta ishlatiladi; ma'no o'zgargan bo'lsa — yangidan.
2. «Вы»-forma, 13–16 yoshli o'smirga tabiiy ruscha, kantselyaritsiz. So'zma-so'z emas — ma'no. Uzunligi uz bilan taxminan teng.
3. **Emoji uz bilan AYNAN bir xil:** uz'da emoji yo'q bo'lsa ru'da ham yo'q (`emojiOnly` — ru_old'dan emojini olib tashlang, matn o'zgarmaydi).
4. `kind: jsx` — qiymat `<>…</>` bo'ladi; uz'dagi `<b>`, `<code>`, `<br/>`, `<span …>` teglari mantiqan o'sha joyda; `{…}` ifodalar aynan ko'chiriladi.
5. `kind: str` — oddiy satr (qo'shtirnoqsiz yozasiz, skript o'zi qo'yadi). `kind: tpl` — `${…}` ifodalar belgima-belgi bir xil.
6. Kod ichidagi identifikatorlar, buyruqlar (`/start`, `bot.action`, `ctx.reply`, `SELECT`), holat qiymatlari (`OLCHAM_KUTYAPMAN`), fayl nomlari,
   tekshiruvga bog'liq qiymatlar O'ZGARMAYDI — faqat izohlar va o'quvchi ko'radigan xabar-satrlar tarjima qilinadi.
7. Narx-sonlarda uz'dagi bo'linmas bo'shliq (U+00A0, «35 000 so'm») ruschada ham saqlanadi: «35 000 сумов» (F-1001-61). Sonlar, «» qo'shtirnoqlar, tire (—), `·` ajratkichlar uz bilan bir xil joyda. «N-darsda» → «на N-м уроке» (raqam o'sha).
9. **Analitika-payload O'ZBEKCHA qoladi** (RU_I18N_SPEC 159): `questionText`, `onAnswer(... question: …)`, `options`/`correctAnswer` payload'i, `recordAttempt` — `tr()` ga o'ralmaydi (F-1001-78).
8. Bir tushuncha — bir ruscha nom (pastdagi lug'at). Eski metaforalar (Ботжон, тетрадь, сигнал, лист правил, Советчик, стол, ключ-токен) ruschada ham QOLMAYDI.

## Modul lug'ati (12 dars bir xil)
| uz | ru |
|---|---|
| Mentor · Aynan! · Qiziq fikr! | Ментор · Именно! · Интересная мысль! |
| Qisqa takrorlash · Sinfga savol | Короткое повторение · Вопрос классу |
| Keyingi dars — «…» | Следующий урок — «…» (nom App.jsx dagi ruscha nom bilan) |
| bot · botingiz | бот · Ваш бот |
| hodisa | событие |
| handler · fallback handler | handler · fallback handler (lotincha, uz kabi; birinchi chiqqanda uz izohi tarjimasi) |
| javob (bot yuboradigan) | ответ |
| token · .env fayli · @BotFather · Telegram Bot API | токен · файл .env · @BotFather · Telegram Bot API |
| sikl (botning ish sikli) | цикл |
| polling · webhook | polling · webhook |
| holat · tanlov · sessiya | состояние · выбор · сессия |
| baza (PostgreSQL) | база (PostgreSQL) |
| prompt · system prompt | промпт · system prompt |
| kontekst oynasi · temperature · hallutsinatsiya · faktni tekshirish | окно контекста · temperature · галлюцинация · проверка фактов |
| birinchi foydalanuvchilar · guruh · yaqin guruh · katta guruh | первые пользователи · группа · близкая группа · большая группа |
| nishon · «Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.» | значок · «Справитесь с первой попытки — значок ваш.» (modulda shu shakl) |
| deploy · server | деплой · сервер |
| AI (oddiy matnda) · AI API · `AI_API_KEY` | ИИ · AI API · `AI_API_KEY` (F-1001-77; 6-Modul ruschasi ham «ИИ») |
| Tushundim · Bajardim (tugma) | Понятно · Готово (jinsga bog'liq emas) |

## Ish tartibi (turn-byudjeti ≤40)
1. `cp <FAYL> $S/<NN>-ru/base.jsx` (uz-etalon, tarjimadan OLDIN). Ish-ro'yxatini yarating, MD A-bo'limni o'qing.
2. Tarjimalarni `$S/<NN>-ru/tr-1.json`, `-2.json` … ga yozing (Write; har birida ≤80 ta `"<id>": "<ru>"`). Hammasi yopilishi shart.
3. Birlashtiring va qo'ying:
   `node -e "const f=require('fs');const o={};for(const p of process.argv.slice(1))Object.assign(o,JSON.parse(f.readFileSync(p)));f.writeFileSync('$S/<NN>-ru/tr.json',JSON.stringify(o))" $S/<NN>-ru/tr-*.json`
   `node $S/ru-wl.mjs --apply $S/<NN>-ru/wl.json $S/<NN>-ru/tr.json` — «tarjimasiz: 0 · XATO: 0» shart.
4. `manual` bandlar va ru-gate «qoldiq-nomzod»lari — Edit bilan (o'quvchiga ko'rinadigan o'zbekcha matn `ru`siz qolgan bo'lsa — `{ uz, ru }` ga o'rang;
   data-konstantada `tr()` chaqirmang). Eski metafora so'zlari ruschada qolganini grep qiling: `Ботжон|тетрад|сигнал|Советчик|лист правил`.
5. Darvozalar:
   - `node tools/ru-gate.mjs $S/<NN>-ru/base.jsx <FAYL>` → **TENG** (uz bitta belgiga ham o'zgarmagan). FARQ — to'xtang, hisobot bering.
   - `npm run gates -- <FAYL>` → 9/9 · `npm run lint:jsx` → 0.
   - `SHOT_LANG=ru SHOT_WAIT=2500 node $S/shots.mjs <FAYL> $S/<NN>-ru/shots` → hamma ekran «xato: yo'q»; 4–5 ta asosiy ekranni Read bilan ko'ring.
6. `git diff` da `INLINE_KEYS`, `correct:`, `correctIdx` o'zgarmagan. Commit YO'Q. Boshqa faylga tegilmaydi.

## Hisobot (qisqa)
Qo'yilgan ru soni · manual/o'rash soni · ru-gate · gates · skrinshot · lug'atdan tashqari tanlangan atamalar (1 qatordan) · shubhali joylar (id + sabab).
