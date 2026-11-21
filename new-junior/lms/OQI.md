# LMS (CRM) uchun dars yig'masi

1-dars «Tanishuv» CRM'ga **bitta `.jsx` fayl** bo'lib yuklanadi: `chiqish/junior-001-tanishuv.jsx` (~1,2 MB, siqilganda ~293 KB; tepasida faqat `import … from "react"`).

**Blok studiya — Blockly 13.4.0** (18.11, Apache-2.0; fayllari va litsenziyasi `public/vendor/blockly-13.4.0/`, internetsiz ishlaydi). «Dastur» ustuni ichidagi bloklarni Blockly saqlaydi va chizadi (`dvigatel/blockly.js` — chizuvchi demodagi bloklardan o'lchab moslangan: farq 0–3 px); bloklar javoni, rang doirachalari va «Dastur» sarlavhasi — o'sha HTML. Blockly'siz yig'ma 276 KB edi; CRM 1,2 MB ni qabul qilmasa — Blockly CRM «Umumiy modullar»ga bir marta yuklanadi.
Ko'rinish va dars mantig'i — boshliq tasdiqlagan demo bilan **bir xil fayllardan** (19.11, dvigatel 2d: `dvigatel/yigish.mjs` — demo ham shundan; manbasi `dvigatel/` va `darslar/001-tanishuv/`). `demo.html` o'qilmaydi, hech narsa kesilmaydi va matn qidirib almashtirilmaydi.

| Fayl | Nima |
|---|---|
| `yig.mjs` | Yig'uvchi (2d): `dvigatel/yigish.mjs` dan ekranlar chizuvchisi (brauzerda chiziladi — demo.html'dagi 3,6 MB oldindan chizilgan SVG o'rniga), dars mantig'i (`skript({ demo: false })` — studiya + qobiq) va uslub. Kirish (`KIRISH`: rol, kalit, ism) — `Dars.jsx` dan, aloqa — `aloqa.js`. To'xtaydi: chizuvchida Node narsasi (process / node:fs / import.meta), mantiqda demo aloqasi so'zlari yoki `'demo-…'` kaliti, ekranlar orasida bir xil SVG ichki nomi, yig'mada react'dan boshqa import |
| `Dars.jsx` | Kirish: LMS tokeni → ustoz (sinf ochiladi) yoki o'quvchi (ustoz boshlagan sinfga; boshlanmagan bo'lsa «Dars hali boshlanmadi» va o'zi kutadi). Token yo'q / CRM ko'rigi — ikkala oyna yonma-yon, aloqasiz |
| `aloqa.js` | Server bilan aloqa (AI Startup `src/live` chaqirilmaydi): `/lms/join`, sinf xabarlari `/junior/yubor`·`/junior/oqi`, ustoz qadami va tiriklik belgisi, «Darsni yakunlash» → sessiya yopiladi, o'quvchi progressi (oxirgi qadam = dars tugadi) va yutuqlar `yulduz`, `sahna` |
| `.ish.gen.js`, `.uslub.gen.js` | Yig'uvchi yasaydi (qo'lda tahrirlanmaydi) |
| `sinov/` | Lokal sinov sahifasi (`index.html` — CRM darsni qanday ochsa, shunday) va sinovlar |

Server tomoni: `server/migrations/0019_junior_sinf.sql` + `server/src/modules/junior/routes.js`. Dars server ro'yxatida bo'lishi kerak:
`lesson_id = junior-001-tanishuv-v1`, yutuqlar `yulduz` («Birinchi dastur»), `sahna` («O'z sahnam»). 3d dan (19.11) bular dars e'lonida: `darslar/001-tanishuv/dars.mjs` → `lms` (`id`, `versiya`, `kalit` — noutbukdagi saqlash kaliti boshi, `yutuqlar` — qaysi bola xabarida qaysi yutuq); yig'uvchi, `Dars.jsx` va `aloqa.js` shundan oladi. Yangi dars — o'z e'loni: `node new-junior/lms/yig.mjs <dars-papkasi>` → `chiqish/junior-<dars-papkasi>.jsx`.

## Yig'ish (loyiha ildizidan)

```
node new-junior/lms/yig.mjs                                   # prod: https://dars-api.coddycamp.uz
JR_API=http://127.0.0.1:3101 node new-junior/lms/yig.mjs      # lokal sinov uchun
```
Demo yig'masiga bog'liq emas (2d dan) — dvigatel yoki dars fayli o'zgarsa, ikkala yig'uvchi istalgan tartibda yurgiziladi.

## Lokal sinov

Stek (boshqa loyihalarga tegmaydi: port 3101/3998, baza `dars_test` ichidagi `junior_sinov` bo'limi — server sinovlari faqat `public` ni tozalaydi):
```
cd server
B=<.env dagi DATABASE_URL, port 5432, baza dars_test>
psql "$B" -c "create schema if not exists junior_sinov"
DARS_ENV=dev DATABASE_URL="$B?options=-c%20search_path%3Djunior_sinov" node src/db/migrate-cli.js
#   + lesson_catalog ga junior-001-tanishuv-v1 (yutuqlari bilan) — bir marta
FAKE_PORT=3998 FAKE_GROUPS='{"34174":[861],"34175":[861],"34176":[861]}' node tools/fake-school-api.mjs &
DARS_ENV=dev PORT=3101 DATABASE_URL="$B?options=-c%20search_path%3Djunior_sinov" CORS_ORIGINS=http://localhost:5340 \
  CODDYCAMP_SCHOOL_API_URL=http://127.0.0.1:3998 node --env-file=.env src/index.js &
cd .. && npx vite --config new-junior/vite.config.js --port 5340 --strictPort &
```
| Sinov | Nima |
|---|---|
| `node new-junior/lms/sinov/lms-toliq.mjs` | Demo sinovining 35 bandi (`sinov/demo/toliq-dars.mjs`) LMS orqali + L1–L8: bola ustozdan oldin kirsa kutadi, ustoz kirgach o'zi ochiladi, ism LMS'dan, oxirgi qadam, yutuqlar, sessiya yopilishi, natija LMS'ga yetishi. 18.11: **43/43** |
| `node new-junior/lms/sinov/lms-solo.mjs` | Solo (18.11): «Ustozni kutaman» / «O'zim o'taman», demo solo sinovining bandlari LMS orqali, solo urinish tugatiladi (24/25), «yulduz», natija LMS'ga (mode: solo), kutgan bola ustoz kirgach sinfga o'tadi. 18.11: **19/19** |
| `node new-junior/lms/sinov/lms-sinf.mjs [suratlar]` | Ustoz + 3 bola (kirdi, tanladi 3/3, taxta, sahifani yangilash) va CRM ko'rigi. 18.11: **8/8** |

Sinov sahifasi qo'lda: `http://localhost:5340/lms/sinov/index.html?t=<token>` (token: `cd server && node --env-file=.env tools/mint-token.mjs --role mentor|student …`), ko'rik — `?preview=1`.
