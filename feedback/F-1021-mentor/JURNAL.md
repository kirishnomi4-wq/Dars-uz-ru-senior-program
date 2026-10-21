# F-1021 · Mentor fidbeki (21.10)

## F-1021-01 · m4-05 Routing — Nest o'rgatilmagan, routing Nest'ga tiqilgan

**Mentor (LMS preview, 18/21-ekran surati):** «Backend Node.js Express SQL modulida mavzu Routing, lekin vazifada NestJS ko'rsatilyapti.
Undan oldin NestJS nimaligi, project create, install haqida info yo'q. Oldingi dars server yaratish — hammasi Express'da edi.
Bolalar buni qila olishmaydi.»

**Tashxis:**
- 13.07 qaror (`a1318975`): «dars NEST-yo'naltirilgan, Express ko'rsatilmaydi» — o'sha paytda keyingi modul 4a NestJS edi.
  LMS v9 da Nest 6-Modulga ko'chdi, dars eski rejaga bog'liq qoldi. Modul ipi: m4-04 Express → m4-05 Nest → m4-07 Express.
- Amaliyot ekrani birinchi kundan bajarilmas: Nest o'rnatish/`nest new` yo'q; «robo-games» = 3-Modul React (Vite) loyihasi —
  controller ham, `npm run start:dev` ham yo'q; `POST` yuborish — Postman m4-08 da.
- Uyga vazifa testi 5-5 ham Nest kodida edi. 19.10 da `hw-qa2/data.js` ga «faqat Nest» deb yozilgan, lekin muammo sifatida aytilmagan.

**Qaror (foydalanuvchi, 21.10):** A — dars to'liq Express'da, m4-04 dagi server.js davomi; Nest olib tashlanadi.

**Qilindi (21.10 11:20–11:55):**
- `src/4-Modull/RoutingLesson.jsx`: 21 → 20 ekran. s7 Nest controller → Express routing (app.get / app.get('/games/:id') / req.params.id / app.post);
  s8 «Nega Nest tartibli» olindi; s0, s1 (reja + natija-oynasi `localhost:3000/games/7`), s5, s6, s9 (test), s10 (sayohat), s11 (debug: app.get → app.post),
  s13 (sudrash: tilak → route qatori), s14 (qoida 3), yakuniy sinov (eshiklar app.get/app.post), amaliyot, kartochkalar, arena (QUIZ_BANK 4 savol;
  to'g'ri javob o'rinlari 3/3/3/3 saqlandi), nishon matnlari, yakun (recap, uyga vazifa, keyingi dars — PostgreSQL).
  RECAPS va Q_LABELS indekslari s8 olingani uchun siljitildi (10→9, 13→12, 16→15). `lessonId` o'zgarmadi.
- Amaliyot: o'z server.js'ga `GET /games` + `GET /games/:id` → `node server.js` → brauzerda `/games/7` va `/gams` (Cannot GET = 404). POST amaliyotda yo'q.
- `.lp-step .qcode` o'ralish qoidasi (m4-04 dagi bilan bir xil) — uzun kod qatori kartadan chiqmaydi.
- Uyga vazifa 5-5: `uyga-vazifa-v2/data/testlar.json` + `data/ru/testlar-2.json` + `VAZIFALAR.md` kartasi Express'ga;
  `node vositalar/ru-testlar.mjs` (16/79, xato 0) · `node scripts/gen-hw-qa2.mjs` (faqat 5-5 o'zgardi).
- m4-08 ApiPostman: sxema/mentor «Nest server» → «Express server» (3 joy). m4-06 PostgresCrud: faqat koddagi izoh.

**Tekshiruv:** gates RoutingLesson 12/13 — `tell` qizil (QUIZ_BANK #6 «DELETE» eng uzun; HEAD da ham bor edi, HEAD da 2 error edi → 1).
ApiPostman/PostgresCrud: tell+emoji qizil — HEAD bilan bir xil son (eski qarz). Suratlar uz 1440 (s1 s8 s9 s10 s11 s13 s15 s16 s19), ru s8, 390 s16 — pageerror 0.

**Ochiq:** LMS'ga yuklash (dars + uyga vazifa 5-5) — G retsepti, foydalanuvchi buyrug'i bilan · sinf-supurish (o'tilmagan vosita talab qiladigan amaliyot,
2–6-M) — foydalanuvchi qarori kutilmoqda · qonunlashtirish (tekshiruvchi rol-fayli) — kutilmoqda. Commit yo'q.

## F-1021-02 · 14/20 sudrash — katak yozuvi siqilgan, chip katakdan chiqqan (foydalanuvchi surati, 21.10 12:07)
**Sabab:** F-1021-01 da chiplar uzaydi (`findOne()` → `app.get('/games/:id')`), blok 560px va `.dd` ustunlari 1.15fr/1fr qolgan edi.
Suratlar bo'sh kataklarda olingani uchun ko'rinmagan. **Qilindi:** blok 860px, `.dd` 1.8fr/1fr, ≤640px da `.dd-slot` flex-wrap.
Tekshiruv: to'ldirilgan kataklar bilan 1920 · 1440 · 1366 · 390 — yozuv bir qatorda, chip katak ichida.

## F-1021-03 · 16/20 yakuniy sinov — «② SERVER.JS» yorlig'i
**Sabab:** flow-label katta harfga o'tkazadi; 404 savati server.js qatori emas. **Qilindi:** «② Eshiklar» / «② Двери».
Gates 12/13 (tell — eski QUIZ_BANK #6). Saboq: sudrash ekranini suratga olishda kataklar TO'LDIRILGAN holatda ham olinadi.

## F-1021-04…06 · Tushunarlilik ko'rigi (foydalanuvchi: «o'quvchiga tushunarli bo'larmikin?» → 1,2,3 + «animatsiya, mehr ber»; 👦 tekshiruv — kerak emas)
- **04 · endpoint ↔ route:** m4-04 «endpoint» (91 marta), m4-05 «route», m4-07 yana «endpoint» — bog'lovchi gap yo'q edi.
  s3 mentor: «(o'tgan darsdagi endpoint'lar — xuddi shu)» / «(это те же endpoint'ы из прошлого урока)».
- **05 · obyekt olib tashlandi:** `games[req.params.id]` (sonli kalitli obyekt + kvadrat qavs) → `res.send("O'yin raqami: " + req.params.id)`.
  s7 kodi, s1 natija-oynasi, amaliyot qadamlari, uyga vazifa 5-5 kodi (uz + ru, Q2 ru kodi qo'shildi) — hammasi bir xil kod.
- **03→ amaliyot 4-qadam:** «`Ctrl+C` (server to'xtaydi), keyin `node server.js`. Yangi kod faqat qayta yoqilganda ishlaydi.» Qadamlar 6 ta qoldi.
- **06 · mehr:** s7 da bosilgan qism ostida jonli brauzer (URL sarlavhada → javob); `req.params.id` bosilganda manzildagi «7» kodga
  tushadi (`.s7-fall`, reduced-motion o'chiradi). Ma'lumot galma-gal: oyna faqat bosilgan qism uchun, keyingisida almashadi.
- Gates 12/13 (tell — eski). Suratlar: s7 getid/param uz 1440, ru 390; amaliyot 1440. gen-hw-qa2: faqat 5-5 o'zgargan.
- Ochiq (foydalanuvchi bilan alohida): 4-band — «method+path → 404» 6 ekranda takror, Minecraft o'xshatishi pochta ipini buzadi.
