# Mentor kursi · Webhook «To'lov xabari: imzo, takror va rad» — MD v2 (M41: avval mentor o'rganadi)

F-ID: F-1029-02 (Webhook) · **F-1104-24** (qayta yozish) · Sana: 2026-11-04 · Holat: **QURILMOQDA 04.11** (foydalanuvchi 04.11: «to'g'ridan qurib chiqar» — MD tasdig'isiz, saytda ko'riladi) · Fidbek: qator yoniga `>> …`
Oldingi: `23-WH-mentor-v1.md` (01.11, avtopilot, o'quvchi loyihasi `maydon-jamoa`) · **TASHLANADI** (uning `maydon-jamoa` chiqishlari `manba/wh-out/` — 21–22-ekranda ko'prik sifatida qoladi)
Fayl (qayta quriladi): `src/mentor-kurs/WebhookMentorLesson.jsx` · bo'laklar `src/mentor-kurs/wh/parts/` · dvigatel — umumiy `parts/01–02` · generator `dev/wh-matn.py` (ws2-matn.py dan, M48 ichida) · kod va chiqishlar `dev/wh-kod.py`
Qonun: `MENTOR_DARS_ETALON.md` M1–M48 · Haqiqiy chiqishlar: `manba/whv2-out/` (skript `manba/drive-whv2.sh`; server `whv2-server.cjs` — loyihaning o'z `dist/main.js`, Telegram o'rniga `bot.handleUpdate`; to'lov xizmati o'rnida loyihaning o'z `npm run pay` va curl + HMAC; brauzer — headless Chrome `ws2v2-panel.mjs`) · AI `manba/whv2-ai/` (`drive-whv2-ai.sh` — haqiqiy baza bilan)
Loyiha: **OrderBotNest** — teglar `wh-start` (= `ws2-done` 71c72a4) · `wh-done` (72b34a6: `src/api/payment/`, `payments` jadvali, `main.ts` `rawBody`, panelda «To'lov», `npm run pay`, smoke `payment`)

**v1 → v2 nima o'zgardi (F-1104-24):**
- Misol — **OrderBotNest** (WebSocket-2 davomi): botdagi buyurtmaga onlayn to'lov — to'lov xizmati natijani serverga o'zi yuboradi, panelda «To'lov» ustuni o'zi yangilanadi (WebSocket darslaridagi `order-changed`). O'quvchi loyihasi `maydon-jamoa` — faqat 21–23-ekran.
- Dars boshida **umumiy tushuncha**: kim kimga yuboradi, nega ilova yoki mijozning «to'ladim»i dalil emas.
- Haqiqiy topilmalar: `wh-start` — `Cannot POST /payments/webhook` (01) · imzosiz va boshqa kalit bilan — 401, qator yo'q (05) · takror — `duplicate: true`, bitta qator; bir vaqtda ikki xabar ham bitta (04, 15) · rad ham yoziladi (06) · bo'sh joyli JSON: to'g'ri kod qabul qiladi, `JSON.stringify(body)` dan imzo hisoblagan kod rad etadi (07) · `rawBody` yo'q — haqiqiy to'lov ham 401 (08) · **tartib buzilsa: 401 qaytadi, lekin panelda «To'landi»** (09) · kalit bo'sh — ogohlantirish va 401 (10) · tartib buzilganini testlar ushlaydi: 3 ta qizil (14).
- AI: ikkalasi ishlaydigan webhook yozdi (xom tana, `timingSafeEqual`, takror). AI-2 **summa mos kelmasa ham «to'landi»** deydi (1 200 so'm — 120 000 so'mlik buyurtma) — haqiqiy bazada biz sinadik.

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | WebSocket-2 ni o'tgan mentor: OrderBotNest'da bot, PostgreSQL, testlar, lenta va jonli panel bor. Webhook va imzo bilan ishlamagan. |
| Dars oxirida mentor | 1) to'lov xabari kimdan kimga borishini va nega ilovaning «to'landi»si dalil emasligini aytadi · 2) HMAC imzoni o'qiydi: xom tana + kalit, `timingSafeEqual`, bo'sh kalit · 3) tekshiruv tartibini biladi: imzo → maydonlar → yozuv · 4) takror va bir vaqtdagi xabarni `UNIQUE` + `ON CONFLICT` bilan yopadi, rad ham yozadi · 5) `rawBody`, tartib va kalit buzilishlarini taniydi va testdan ko'radi · 6) AI webhook'ini haqiqiy bazada qabul qiladi · 7) sinfga: m11-03 xaritasi |
| O'quvchi darsi (faqat 6-bosqich) | **m11-03** «Webhook: to'lov Backend'ga qanday yetib keladi» (`src/11-Modull/PaymentWebhookLesson.jsx`, 20 ekran): Maydon Jamoa — Pro obuna, test rejim; to'lov xabari, imzo, takror, rad, mashq to'lov sahifasi (to'rt tugma), to'lov oqimi sxemasi; repo `maydon-jamoa` `m13-dars-03-done` (`POST /tolov/webhook`, `X-Imzo`, `TOLOV_KALITI`). |
| Kursdagi o'rni | WebSocket-2 → **shu** (M31: raqam yozilmaydi). Kurs ro'yxatidagi oxirgi mentor darsi. |
| Til | M9 + M32. Atamalar inglizcha: webhook, signature (imzo), HMAC, secret (maxfiy kalit), raw body (xom tana), idempotency (takrorga chidamlilik), `401`, `400`. «To'lov xabari», «takror», «rad» — o'zbekcha. |
| Misol-ip | **OrderBotNest** `wh-done`: Bobur botda Klaviatura buyurdi (120 000 so'm) → to'lov xizmati `POST /payments/webhook` → imzo to'g'ri → `payments` ga qator → panelda «To'landi». |
| AI | 2 tajriba (ruxsat 04.11): bitta prompt — xizmat hujjatidagi kabi qisqa talab (`whv2-ai/p1-prompt.txt`); `ai1` kuchli, `ai2` kuchsizroq; ikkalasi bazasiz sinagan, haqiqiy PostgreSQL bilan biz sinadik (`whv2-ai/*/01-haqiqiy-baza.txt`). |
| Haqiqiylik (M10) | 04.11: Node 24.18 · NestJS 11.2.8 · TypeORM · PostgreSQL 18 (vaqtinchalik) · headless Chrome. To'lov xizmati o'rnida — loyihaning o'z `npm run pay` (xizmat qiladigan ishni qiladi: HMAC bilan imzolab POST) va curl; haqiqiy Payme/Click bilan sinalmagan (⚠, darsda ham ulanmaydi). Telegram serveri o'rniga smoke'dagi usul. |
| Hajm | **25 ekran** · 6 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · ovoz ≈ 25 daq · amaliyot ≈ 50 daq · jami ≈ 1 s 15 daq |
| Me'yor | WebSocket-2 v2 bilan bir xil (≤ 5 segment, ≤ 60 so'z, M17, «Xulosa», kalit 8–14 so'z, M32, M33, M42, M43, M46, M47, M48) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **webhook (to'lov xabari)** — to'lov xizmati natijani bizning manzilga **o'zi** yuboradi: `POST /payments/webhook`, tana `{ paymentId, orderId, status: 'paid' | 'failed', amount }`. Server so'ramaydi, kutadi.
- **dalil** — mijoz yoki ilovaning «to'ladim»i emas; faqat xizmatning **imzoli** xabari.
- **imzo** — `X-Signature` = HMAC-SHA256(**xom tana**, `PAYMENT_WEBHOOK_SECRET`), 64 belgili hex. Server xuddi shu hisobni qilib `timingSafeEqual` bilan solishtiradi. Kalit faqat bizda va xizmatda.
- **xom tana (raw body)** — imzo baytlardan; JSON qayta yozilsa (bo'sh joy) mos kelmaydi → `NestFactory.create(AppModule, { rawBody: true })`, `req.rawBody`.
- **tartib** — 1) imzo → 2) maydonlar (400) → 3) buyurtma va summa (400) → 4) yozuv. Imzo yozuvdan **oldin**.
- **takror (idempotency)** — xizmat javobni olmasa qayta yuboradi; `payment_id` UNIQUE + `INSERT … ON CONFLICT DO NOTHING RETURNING` → `200 { duplicate: true }`, ikkinchi qator yo'q (bir vaqtda kelsa ham).
- **rad** — `status: 'failed'` ham yoziladi; oldin to'langan buyurtmani «rad» ga tushirmaydi.

**Darsning ipi:** kim kimga yuboradi → `wh-start` da manzil yo'q → imzo (HMAC) → tartib va `rawBody` → haqiqiy oqim → imzosiz/soxta → takror va rad → buzamiz: xom tana, `rawBody`, tartib, kalit → testlar buzilishni ushlaydi → AI webhook'lari haqiqiy bazada → sinfga tayyorgarlik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Kim kimga yuboradi: to'lov xabari | Lesson | 1 · umumiy tushuncha |
| 3 | `wh-start`: manzil yo'q — 404 | Lesson | 1 |
| 4 | Imzo: xom tana + kalit → HMAC | Lesson | 2 · imzo |
| 5 | Controller: imzo, maydonlar, yozuv — shu tartibda | Lesson | 2 |
| 6 | Tekshiruv 1 — imzosiz xabar | MCRetry | 2 |
| 7 | Haqiqiy oqim: `npm run pay` → panelda «To'landi» | Lesson | 2 |
| 8 | Amaliyot 1 — webhook va soxta to'lov xizmati | Practice | 2 |
| 9 | Imzosiz va boshqa kalit — 401 | Lesson | 3 · takror va rad |
| 10 | Takror va rad | Lesson | 3 |
| 11 | Amaliyot 2 — ikki marta, imzosiz, rad | Practice | 3 |
| 12 | Buzamiz: xom tana va `rawBody` | Lesson | 4 · buzamiz |
| 13 | Buzamiz: tartib — 401, lekin «To'landi» | Lesson | 4 |
| 14 | Tekshiruv 2 — qaysi satr joyida emas | LineCheck | 4 |
| 15 | Kalit bo'sh, summa va maydon xato | Lesson | 4 · ichida |
| 16 | Tekshiruv 3 — kalit bo'sh bo'lsa | MCRetry | 4 |
| 17 | Amaliyot 3 — tartibni buzing, testlar qizarsin | Practice | 4 |
| 18 | AI webhook yozdi — ikki javob | Lesson | 5 · AI |
| 19 | AI webhook'lari haqiqiy bazada | Lesson | 5 · ichida |
| 20 | Tekshiruv 4 — summa mos emas | MCRetry | 5 |
| 21 | m11-03 xaritasi: Maydon Jamoa | Lesson | 6 · sinfga tayyorgarlik |
| 22 | O'quvchi so'zlari: `X-Imzo`, `TOLOV_KALITI`, mashq sahifa | Lesson | 6 |
| 23 | Sinfdagi holatlar va o'quvchi savollari | Lesson | 6 |
| 24 | O'z-sinov — 8 savol | Screen27 | — |
| 25 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code `OrderBotNest` (`src/api/payment/{signature.ts, payment.controller.ts, payment.service.ts}`, `src/main.ts`, migratsiya), terminal «npm run pay» va server logi, psql natijasi, **panel oynasi** (`PanelView` — `ws2v2-panel.mjs` suratidagi haqiqiy qatorlar, 8 ustun), **oqim chizmasi** (mijoz → xizmat → webhook → server → baza → panel), AI javobi kartasi.

---
## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · Webhook` · Sarlavha: **Mijoz to'lov qildi. Server buni kimdan biladi? Bugun to'lov xabarini qabul qilamiz: imzo, takror va rad**
- Sahna: chapda reja (6 bosqich); o'ngda panel oynasi — dars oxiridagi natija (`12` 3-surat): #2 «Rad etildi», #1 «To'landi», sahifa yangilanmagan.
- Reja: 01 Umumiy tushuncha · 02 Imzo · 03 Takror va rad · 04 Buzamiz · 05 AI · 06 Sinfga tayyorgarlik
1. **Mijoz to'ladi — ==panelda «To'landi» o'zi chiqdi==; xabarni to'lov xizmati yubordi**
   Ovoz: «Assalomu alaykum. OrderBotNest'da buyurtma bor, endi unga onlayn to'lov qo'shamiz. Ekranda dars oxiridagi natija: birinchi buyurtma to'landi, ikkinchisi rad etildi, panel buni o'zi ko'rsatdi. Bu xabarni mijoz ham, bot ham emas, to'lov xizmati yubordi.»
2. **Avval ==umumiy tushuncha==: kim kimga yuboradi va nega mijozning gapi dalil emas**
   Ovoz: «Avval umumiy tushuncha: to'lov xabari kimdan kimga boradi va nega mijozning to'ladim degani dalil emas. Keyin imzo: manzil ochiq bo'lgani uchun soxta xabarni qanday ajratamiz.» · reja 01–02
3. **Keyin ==takror, rad va to'rt buzilish==; oxirida AI va sinf**
   Ovoz: «Uchinchi bosqichda bitta xabar ikki marta kelsa va to'lov rad etilsa nima bo'ladi. To'rtinchisida to'rtta xatoni ataylab yasaymiz. Beshinchisida ikki AI yozgan webhook'ni haqiqiy bazada sinaymiz. Oxirida sinfga tayyorgarlik.» · reja 03–06
4. **Olti bosqich, uchta amaliyot; kerak: ==WebSocket-2 dagi OrderBotNest va Postgres==**
   Ovoz: «Dars olti bosqich, uchta amaliyot. Oldingi darsdagi OrderBotNest nusxangiz va Postgres kerak. Haqiqiy to'lov xizmatiga ulanmaymiz, karta yozilmaydi: xizmat o'rnida loyihadagi kichik skript ishlaydi. Shoshilmang, har ekranni boshidan eshitish mumkin. Boshlaymiz.» · reja 06
- Manba: `whv2-out/12-panel.txt` (3-surat).

## 2 · Kim kimga yuboradi: to'lov xabari  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **To'lov xizmati natijani serverga o'zi yuboradi — bu webhook. Mijoz yoki ilovaning «to'ladim»i dalil emas: dalil faqat xizmatning imzoli xabari**
- Sahna: 1-segmentda oqim chizmasi: Mijoz (karta) → To'lov xizmati → `POST /payments/webhook` → Server (imzo, yozuv) → Baza → Panel (`order-changed`); 2-segmentda ikki karta: «Mijoz: to'ladim» (soxta skrinshot, dalil emas) ↔ «Xizmat: imzoli xabar» (dalil); 3-segmentda WebSocket bilan solishtirish kartasi: WebSocket-1 — server panelga o'zi yuboradi; webhook — xizmat serverga o'zi yuboradi; 4-segmentda xabar tanasi (`03`): `{"paymentId":"pay_…","orderId":1,"status":"paid","amount":120000}` + `X-Signature`.
1. **Mijoz kartani xizmatga beradi; ==xizmat natijani serverga o'zi yuboradi==**
   Ovoz: «Mijoz kartani bizga emas, to'lov xizmatiga beradi: Payme, Click kabi. Pul o'tdimi, buni xizmat biladi. Keyin xizmat bizning server manziliga o'zi so'rov yuboradi: shu buyurtma to'landi. Bu so'rov webhook deyiladi.» · oqim
2. **Mijozning ==«to'ladim»i dalil emas==: skrinshotni har kim yasaydi**
   Ovoz: «Nega botga to'ladim tugmasini qo'ymaymiz? Chunki mijozning gapi yoki skrinshoti dalil emas, uni har kim yasaydi. Ilovaning o'zi ham dalil emas. Dalil faqat xizmatning xabari, va u imzolangan bo'lishi kerak.» · ikki karta
3. **WebSocket'da server panelga o'zi yuborardi; ==webhook'da xizmat serverga o'zi yuboradi==**
   Ovoz: «Oldingi darslarni eslang: WebSocket'da server panelga o'zi xabar berardi. Webhook xuddi shunday, faqat yo'nalish boshqa: tashqi xizmat bizning serverga o'zi yuboradi. Server so'ramaydi, kutadi. Shuning uchun manzil internetda ochiq turadi.» · solishtirish
4. **Xulosa: xabar — ==JSON tana va imzo sarlavhasi==; to'rt maydon**
   Ovoz: «Xulosa: xabar oddiy POST so'rov. Tanada to'rt maydon: to'lov raqami, buyurtma raqami, holat va summa. Sarlavhada imzo. Manzil ochiq bo'lgani uchun imzo kerak, uni keyingi bosqichda ochamiz. Avval boshlang'ich tegda nima bo'lishini ko'ramiz.» · xabar
- Manba: `whv2-out/03-tolov-ok.txt` (tana), `12-panel.txt`.

## 3 · `wh-start`: manzil yo'q — 404  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **`wh-start` da xizmat xabar yubordi — `Cannot POST /payments/webhook`, 404. Buyurtma bazada «NEW» qoldi: server to'lov bo'lganini bilmaydi**
- Sahna: terminal `01`: `$ curl -s -X POST …/payments/webhook …` → `{"message":"Cannot POST /payments/webhook","error":"Not Found","statusCode":404}`; 2-segmentda psql `01`: `orders` — `1 | NEW | 120000`; 3-segmentda ochiq manzil kartasi: internetdagi har kim POST yubora oladi; 4-segmentda vazifa kartasi: manzil + imzo + yozuv.
1. **`wh-start` da xizmat yubordi — ==`Cannot POST /payments/webhook`, 404==**
   Ovoz: «Boshlang'ich tegda tajriba: Bobur buyurtma berdi, to'lov xizmati xuddi haqiqiydek xabar yubordi. Server javobi to'rt yuz to'rt: Cannot POST payments webhook. Bunday manzil yo'q.» · curl
2. **Bazada buyurtma ==«NEW» qoldi== — server to'lov bo'lganini bilmaydi**
   Ovoz: «Bazaga qarang: buyurtma yangi holatda qoldi. Pul o'tgan, lekin server bilmaydi, panel ham bilmaydi. Haqiqiy xizmat bunday javobdan keyin bir necha marta qayta urinadi, keyin taslim bo'ladi.» · psql
3. **Manzil qo'shsak — u ==internetda ochiq==: har kim POST yubora oladi**
   Ovoz: «Manzil qo'shamiz, lekin bir narsani tushunib oling: u internetda ochiq turadi. Xizmat ham, istalgan odam ham unga so'rov yubora oladi. Ochiq manzilga to'landi deb yozish juda oson bo'lib qoladi.» · ochiq manzil
4. **Xulosa: kerak — ==manzil, imzo va bir martalik yozuv==**
   Ovoz: «Xulosa: bizga uch narsa kerak. Manzil, ya'ni POST payments webhook. Imzo, xabar haqiqatan xizmatdanmi. Va bir martalik yozuv: bitta to'lov ikki marta kelsa ham bir marta yoziladi. Imzodan boshlaymiz.» · vazifa
- Manba: `whv2-out/01-start-404.txt` (aynan).

---

## 4 · Imzo: xom tana + kalit → HMAC  ← `Lesson`
- Kicker: `2-bosqich · imzo` · Sarlavha: **`signature.ts`: xizmat va server bitta maxfiy kalitni biladi; imzo = HMAC-SHA256(xom tana, kalit). Server qayta hisoblaydi va `timingSafeEqual` bilan solishtiradi**
- Sahna: VS Code `src/api/payment/signature.ts` (`wh-done`) bo'laklab: `sign()` (`createHmac('sha256', secret).update(rawBody).digest('hex')`) · `isValidSignature()` boshi: `if (!secret || !rawBody || typeof header !== 'string') return false;` · oxiri: `got.length === expected.length && timingSafeEqual(got, expected)`; 4-segmentda `.env.example` `PAYMENT_WEBHOOK_SECRET=` va `config/index.ts` satri.
1. **Kalit ==faqat ikki tomonda==: to'lov xizmatida va bizning `.env` da**
   Ovoz: «Imzo qanday ishlaydi? To'lov xizmati bilan biz bitta maxfiy kalitni bilamiz: u xizmat kabinetida va bizning env faylimizda. Boshqa hech kim bilmaydi. Xizmat har xabar uchun shu kalit bilan imzo hisoblaydi va sarlavhaga yozadi.» · kalit
2. **`sign()`: ==HMAC-SHA256 — xom tana va kalitdan== 64 belgili hex**
   Ovoz: «Src, api, payment papkasidagi signature ts faylini oching. Sign funksiyasi: create hmac sha256, kalit bilan, tananing o'zi, hex. Natija oltmish to'rt belgili satr. Tanada bitta harf o'zgarsa, imzo butunlay boshqacha chiqadi.» · sign
3. **Tekshiruv: ==kalit bo'sh, tana yoki sarlavha yo'q — darhol rad==**
   Ovoz: «Is valid signature funksiyasi avval uch holatni rad etadi: kalit bo'sh, tana yo'q yoki sarlavha yo'q. Kalit bo'sh bo'lsa ayniqsa xavfli: bo'sh kalit bilan imzoni har kim hisoblay oladi. Shuning uchun bo'sh kalit — hech qanday xabar qabul qilinmaydi.» · boshi
4. **Xulosa: solishtirish ==`timingSafeEqual`== — javob vaqtidan imzoni taxmin qilib bo'lmaydi**
   Ovoz: «Xulosa: server imzoni o'zi qayta hisoblaydi va kelgani bilan solishtiradi. Oddiy teng belgisi emas, timing safe equal: u har doim bir xil vaqtda solishtiradi, javob tezligidan imzoni bo'lakma-bo'lak topib bo'lmaydi. Uzunlik farq qilsa, darhol yo'q.» · oxiri
- Manba: `order-bot` `wh-done` `src/api/payment/signature.ts`, `.env.example`, `src/config/index.ts`.

## 5 · Controller: imzo, maydonlar, yozuv — shu tartibda  ← `Lesson`
- Kicker: `2-bosqich · imzo` · Sarlavha: **`payment.controller.ts`: avval imzo (401), keyin maydonlar (400), keyin yozuv. Imzo `req.rawBody` dan — shuning uchun `main.ts` da `rawBody: true`**
- Sahna: VS Code `payment.controller.ts` `webhook()` (`wh-done`): `@Post('webhook')` · `if (!isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)) { … throw new UnauthorizedException(…) }` · `const p = parsePayment(body);` · `const r = await this.payments.record(p);` · `return { ok: true, duplicate: r.duplicate };`; 3-segmentda `src/main.ts`: `NestFactory.create(AppModule, { rawBody: true })` + server logi `02`: `main.ts: NestFactory.create(AppModule, {"rawBody":true})` · `Mapped {/payments/webhook, POST} route`; 4-segmentda tartib kartasi (1 imzo → 2 maydonlar → 3 yozuv).
1. **`webhook()`: ==birinchi qator — imzo==; noto'g'ri bo'lsa 401 va boshqa hech narsa**
   Ovoz: «Payment controller ts faylida webhook funksiyasi. Birinchi ish imzo: req raw body, sarlavhadagi imzo va env'dagi kalit. Mos kelmasa, logga ogohlantirish va to'rt yuz bir. Funksiya shu yerda tugaydi, bazaga hech narsa yetib bormaydi.» · imzo
2. **Keyin ==maydonlar (400)==, keyin ==yozuv==: `parsePayment`, `record`**
   Ovoz: «Imzo to'g'ri bo'lsa, maydonlar: parse payment to'lov raqami, buyurtma raqami, holat va summani tekshiradi, xato bo'lsa to'rt yuz. Faqat shundan keyin record, ya'ni yozuv. Javob: ok va duplicate, takrormi yoki yo'q.» · maydonlar
3. **`main.ts`: ==`rawBody: true`== — imzo baytlardan hisoblanadi**
   Ovoz: «Muhim satr main ts faylida: Nest factory create, raw body true. Nest odatda tanani JSON obyektga aylantiradi va xom baytlarni tashlab yuboradi. Imzo esa aynan o'sha baytlardan hisoblangan. Raw body true bo'lsa, ular req raw body'da saqlanadi.» · main.ts
4. **Xulosa: tartib — ==imzo, maydonlar, yozuv==; buzilsa nima bo'lishini 4-bosqichda ko'ramiz**
   Ovoz: «Xulosa: uch qadam, shu tartibda. Imzo, maydonlar, yozuv. Imzo yozuvdan oldin, aks holda soxta xabar ham bazaga yetib boradi. Server logida yangi yo'l va raw body ko'rinadi. To'rtinchi bosqichda shu tartibni buzib ko'ramiz.» · tartib
- Manba: `order-bot` `wh-done` `payment.controller.ts`, `src/main.ts`; `whv2-out/02-done-start.txt`.

## 6 · Tekshiruv 1 — imzosiz xabar  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Kimdir ochiq manzilga `X-Signature` siz xabar yubordi: «#1 to'landi, 120 000». Bu controller nima qiladi?**
- Material (`above`, M42): `payment.controller.ts` — `if (!isValidSignature(…)) { throw new UnauthorizedException(…) }` va undan keyingi `parsePayment`, `record` satrlari.
- Ovoz: «Controller'ni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Kimdir ochiq manzilga imzosiz xabar yubordi: birinchi buyurtma to'landi, bir yuz yigirma ming. Bu controller nima qiladi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Yozadi, lekin holatni «tekshirilmagan» deb belgilaydi · 2 Maydonlarni tekshiradi, to'g'ri bo'lsa yozadi · 3 401 qaytaradi va hech narsa yozmaydi · 4 Xizmatdan imzoni so'rab qayta yuborishini kutadi
- To'g'ri (ovoz): «To'g'ri. Imzo birinchi qadam: sarlavha yo'q, demak is valid signature yo'q deydi va controller to'rt yuz bir tashlaydi. Parse payment ham, record ham chaqirilmaydi, bazaga hech narsa yetmaydi. Demak, imzosiz xabar maydonlari to'g'ri bo'lsa ham, uning mazmuniga qaralmaydi.» · qisqa: «Imzo — birinchi: yo'q bo'lsa 401, `record` chaqirilmaydi.»
- Isbot (`after`): terminal `05`: `$ npm run pay -- 1 imzosiz` → `← 401 {"message":"imzo noto'g'ri",…}` · psql `payments_qatorlari` o'zgarmadi.
- Demak: «Imzo yozuvdan oldin: imzosiz xabar mazmuniga qaralmaydi — 401, qator yo'q.»
- Xato izohlari: 1 — «Imzosiz xabar umuman yozilmaydi — «tekshirilmagan» holati ham yo'q.» · 2 — «Maydonlarga imzodan keyin yetiladi; imzo yo'q — undan nariga o'tilmaydi.» · 4 — «Server hech narsa kutmaydi: javob 401, xabar tashlanadi.»
- Maslahat: «`webhook()` dagi birinchi `if` nima qiladi va undan keyin nima chaqiriladi?»
- Manba: `whv2-out/05-imzosiz-soxta.txt`.

## 7 · Haqiqiy oqim: `npm run pay` → panelda «To'landi»  ← `Lesson`
- Kicker: `2-bosqich · imzo` · Sarlavha: **Soxta to'lov xizmati (`npm run pay`) xabarni xuddi haqiqiydek imzolab yuboradi: 200, `payments` da qator, `payment_status = paid` — panelda «To'landi» o'zi chiqdi**
- Sahna: 1-segmentda `scripts/pay.js` bo'lagi (`sign(body, secret)` · `fetch(…/payments/webhook, { headers: { 'X-Signature': … } })`); 2-segmentda terminal `03`: `$ npm run pay -- 1` · `→ POST /payments/webhook {"paymentId":"pay_…","orderId":1,"status":"paid","amount":120000}` · `← 200 {"ok":true,"duplicate":false}` + server logi `LOG [Payment] pay_… · #1 · paid · 120000`; 3-segmentda psql `03`: `payments` 1 qator, `orders.payment_status = paid`; 4-segmentda panel `12` 1 → 2-surat («—» → «To'landi»), `kadr keldi … "reason":"payment"`.
1. **`npm run pay`: ==xizmat qiladigan ishni qiladi== — tanani kalit bilan imzolab yuboradi**
   Ovoz: «Haqiqiy to'lov xizmatiga ulanmaymiz, uning o'rniga loyihada kichik skript bor: scripts, pay js. U xizmat qiladigan ishni qiladi: buyurtma summasini oladi, tanani env'dagi kalit bilan imzolaydi va webhook manziliga yuboradi.» · pay.js
2. **Javob ==200, `duplicate: false`==; server logida to'lov satri**
   Ovoz: «Ishga tushiramiz: npm run pay, birinchi buyurtma. Yuborilgan tana va imzoning boshi ko'rinadi. Javob ikki yuz, ok true, duplicate false. Server logida: to'lov raqami, buyurtma bir, paid, bir yuz yigirma ming.» · terminal
3. **Bazada: ==`payments` da qator, `payment_status = paid`==**
   Ovoz: «Bazaga qarang: payments jadvalida bitta qator, xizmatning to'lov raqami bilan. Orders jadvalida payment status paid. Ikkalasi bitta tranzaksiyada yozildi: yoki ikkalasi, yoki hech biri.» · psql
4. **Xulosa: panel ==`order-changed` 'payment'== bilan o'zi yangilandi**
   Ovoz: «Xulosa: panelda to'lov ustuni chiziqchadan to'landi'ga o'zgardi, sahifa yangilanmadi. Tranzaksiya tugagach server order changed yubordi, sabab payment. WebSocket darsidagi qoida shu yerda ham ishladi. Endi buni o'zingiz qilasiz.» · panel
- Manba: `order-bot` `wh-done` `scripts/pay.js`; `whv2-out/03-tolov-ok.txt`, `12-panel.txt` (aynan).

## 8 · Amaliyot 1 — webhook va soxta to'lov xizmati  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **`wh-done` tegida `.env` ga kalit yozing, serverni ishga tushiring, telefondan buyurtma bering va `npm run pay` bilan to'lang — panelda «To'landi»** · `tableAt: 3`
1. **Endi siz: ==`wh-done` tegi, kalit, server va `npm run pay`==**
   Ovoz: «Endi navbat sizga. OrderBotNest papkangizda wh done tegiga o'tasiz, env fayliga to'lov kalitini yozasiz, serverni ishga tushirasiz va telefondan buyurtma berasiz. Keyin npm run pay bilan to'laysiz. O'n besh daqiqa ketadi.»
2. **1–2-qadam: ==teg, `.env` da `PAYMENT_WEBHOOK_SECRET`==, server — logda `/payments/webhook`**
   Ovoz: «Birinchi qadamda git fetch va checkout. Ikkinchisida env'ga payment webhook secret qatori: uzun tasodifiy satr, uni hech kimga bermaysiz. Server ishga tushganda migratsiya o'zi yuradi, logda payments webhook yo'li chiqishi kerak.»
3. **3–4-qadam: ==telefondan buyurtma, `npm run pay -- <raqam>`==; isbot — javob satri**
   Ovoz: «Uchinchi qadamda brauzerda panel va telefondan botga buyurtma. To'rtinchisida ikkinchi terminalda npm run pay, buyurtma raqami bilan. Panelda to'landi chiqadi. Isbot maydoniga ikki yuz javob satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz botingizga to'lov xabarini qabul qiladigan manzil qo'shgansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Teg | `git fetch --tags` · `git checkout wh-done` · `npm install` | `added … packages` yoki `up to date` |
  | 2 | Kalit va server | `.env` ga `PAYMENT_WEBHOOK_SECRET=<uzun tasodifiy satr>` · `npm run start:dev` | `Mapped {/payments/webhook, POST} route` |
  | 3 | Buyurtma | brauzer: `http://localhost:3000/admin` · telefon: botga buyurtma | panelda yangi qator, «To'lov» — «—» |
  | 4 | To'lov | ikkinchi terminal: `npm run pay -- <buyurtma raqami>` | `← 200 {"ok":true,"duplicate":false}` · panelda «To'landi» |
- Isbot: «`npm run pay` javob satri» · placeholder: «masalan: ← 200 {"ok":true,"duplicate":false}» · KOD: `/200 \{"ok":true,"duplicate":false\}/` · xato: «`npm run pay -- <raqam>` dan keyingi `← 200 …` satrini aynan nusxalang.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `← 401 … imzo noto'g'ri` | server `.env` ni o'qimagan (kalit qo'shilgach qayta ishga tushiring) yoki skript va serverda kalit boshqa |
  | `GET /admin/orders → 401` | `.env` da `ADMIN_PANEL_TOKEN` yo'q — skript summani panel yo'lidan oladi |
  | `#… oxirgi 20 buyurtma ichida yo'q` | buyurtma raqami noto'g'ri — paneldagi `#` ustuniga qarang |
  | `relation "payments" does not exist` | server `wh-done` dan oldingi `dist` bilan — `npm run start:dev` ni qayta ishga tushiring |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `whv2-out/02`, `03`.

---

## 9 · Imzosiz va boshqa kalit — 401  ← `Lesson`
- Kicker: `3-bosqich · takror va rad` · Sarlavha: **Imzosiz xabar ham, boshqa kalit bilan imzolangani ham — 401, `payments` da yangi qator yo'q; server logida ikkita ogohlantirish**
- Sahna: terminal `05`: `$ npm run pay -- 1 imzosiz` → `X-Signature: (yo'q)` · `← 401 {"message":"imzo noto'g'ri",…}`; 2-segmentda `$ npm run pay -- 1 soxta` → `X-Signature: b429…` · `← 401`; 3-segmentda server logi `WARN [Payment] imzo noto'g'ri — xabar rad etildi` ×2 + psql `payments_qatorlari` (o'zgarmadi); 4-segmentda qoida kartasi.
1. **Imzosiz: ==`X-Signature` yo'q — 401==; tana to'g'ri bo'lsa ham**
   Ovoz: «Endi ochiq manzilga begona xabarlar. Birinchisi imzosiz: tana xuddi haqiqiydek, birinchi buyurtma to'landi, summa to'g'ri. Javob to'rt yuz bir, imzo noto'g'ri. Mazmuni to'g'ri bo'lsa ham, imzosiz xabarga ishonilmaydi.» · imzosiz
2. **Boshqa kalit: ==imzo bor, lekin kalit boshqa — 401==**
   Ovoz: «Ikkinchisi ayyorroq: imzo bor, oltmish to'rt belgi, faqat boshqa kalit bilan hisoblangan. Kalitni bilmagan odam shunday qiladi. Server o'z kaliti bilan hisoblaydi, natija mos kelmaydi, yana to'rt yuz bir.» · soxta
3. **Server logida ==ikki ogohlantirish==; `payments` da yangi qator yo'q**
   Ovoz: «Server logida ikkita ogohlantirish: imzo noto'g'ri, xabar rad etildi. Bazada payments qatorlari soni o'zgarmadi. Hujum bo'lsa ham, logdan ko'rinadi, ma'lumot buzilmaydi.» · log + psql
4. **Xulosa: imzoni ==faqat kalit egasi yasaydi==; kalit sirligi — butun himoya**
   Ovoz: «Xulosa: to'g'ri imzoni faqat kalitni bilgan yasaydi. Demak himoyaning hammasi kalit sirligida. Kalit env faylida va hosting sozlamasida, kodda ham, git'da ham, chatda ham emas. Endi xizmatning o'zi ikki marta yuborsa nima bo'lishini ko'ramiz.» · qoida
- Manba: `whv2-out/05-imzosiz-soxta.txt` (aynan).

## 10 · Takror va rad  ← `Lesson`
- Kicker: `3-bosqich · takror va rad` · Sarlavha: **Xizmat javobni olmasa, xabarni qayta yuboradi: ikkinchisi `200 { duplicate: true }`, qator bitta — bir vaqtda kelsa ham. Rad etilgan to'lov ham yoziladi**
- Sahna: 1-segmentda terminal `04`: `$ npm run pay -- 1 ikki` → `← 200 {"ok":true,"duplicate":false}` · `→ xuddi shu xabar yana` · `← 200 {"ok":true,"duplicate":true}` + server logi `… — takror, yozilmadi`; 2-segmentda `payment.service.ts` `INSERT … ON CONFLICT (payment_id) DO NOTHING RETURNING id` · `if (rows.length === 0) return { duplicate: true };` + `15`: ikki curl parallel → biri `false`, biri `true`, psql 1 qator; 3-segmentda `06`: `$ npm run pay -- 2 rad` → `200` · psql `#2 | failed`; 4-segmentda panel `12` 3-surat (#2 «Rad etildi», #1 «To'landi») + `UPDATE … WHERE … payment_status IS DISTINCT FROM 'paid'`.
1. **Javob yo'qolsa ==xizmat qayta yuboradi==: ikkinchisi `duplicate: true`**
   Ovoz: «Haqiqiy xizmat javobimizni olmasa, masalan tarmoq uzilsa, xuddi shu xabarni qayta yuboradi. Npm run pay, ikki rejimi: birinchisi duplicate false, ikkinchisi duplicate true. Server logida: takror, yozilmadi. Javob baribir ikki yuz, aks holda xizmat qayta urinaveradi.» · ikki
2. **`ON CONFLICT (payment_id) DO NOTHING` — ==bir vaqtda kelgan ikki xabar ham bitta qator==**
   Ovoz: «Payment service faylida insert, on conflict payment id do nothing, returning. Payment id noyob, takrorda hech narsa qaytmaydi va biz duplicate deymiz. Ikki xabar bir vaqtda kelganini ham sinadik: biri yozildi, biri takror, bazada bitta qator. Avval qidirib keyin yozsak, bu joyda ikkala so'rov ham o'tib ketishi mumkin edi.» · servis
3. **Rad: ==`status: 'failed'` ham yoziladi== — «to'lovim qayerda?» savoliga javob**
   Ovoz: «Ikkinchi buyurtma, karta rad etdi: xabar baribir keladi va yoziladi, holat failed. Nega yozamiz? Mijoz to'lovim qayerda desa, admin ko'radi: urinish bo'lgan, rad etilgan. Hech narsa yozmasak, bu savolga javob yo'q.» · rad
4. **Xulosa: panelda ==«To'landi» va «Rad etildi»==; to'langani «rad» ga tushmaydi**
   Ovoz: «Xulosa: panelda ikkala holat, sahifa yangilanmadi. Yana bir qoida servisda: buyurtma allaqachon to'langan bo'lsa, keyingi rad xabari uni rad'ga tushirmaydi. Smoke shuni ham tekshiradi. Endi bu uchtasini o'zingiz sinaysiz.» · panel
- Manba: `whv2-out/04-takror.txt`, `15-bir-vaqtda.txt`, `06-rad.txt`, `12-panel.txt`; `order-bot` `wh-done` `payment.service.ts`; smoke `payment` 5-band.

## 11 · Amaliyot 2 — ikki marta, imzosiz, rad  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **`npm run pay` ning to'rt rejimi: ikki marta, imzosiz, soxta, rad — har birining javobi va bazadagi natijasini ko'ring** · `tableAt: 3`
1. **Endi siz: ==to'rt rejim== — xizmat ikki marta yuborsa, begona yuborsa, karta rad etsa**
   Ovoz: «Endi navbat sizga. Npm run pay'ning to'rt rejimini sinaysiz: ikki marta, imzosiz, soxta kalit va rad. Har birida javobni va bazani ko'rasiz. O'n besh daqiqa ketadi.»
2. **1–2-qadam: ==`ikki`, keyin `imzosiz` va `soxta`== — `duplicate: true` va 401**
   Ovoz: «Birinchi qadamda ikki rejimi: ikkinchi javobda duplicate true. Ikkinchisida imzosiz va soxta: ikkalasi to'rt yuz bir, server terminalida ogohlantirish. Bazada payments jadvalini oching, qatorlar soni o'zgarmaganini ko'ring.»
3. **3–4-qadam: ==yangi buyurtma va `rad`==; panelda «Rad etildi»; isbot — takror javobi**
   Ovoz: «Uchinchi qadamda yangi buyurtma va rad rejimi: panelda rad etildi. To'rtinchisida payments jadvalida to'lovlar va holatlar. Isbot maydoniga ikki rejimidagi duplicate true satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror, begona va rad xabarlarni o'zingiz sinab ko'rgansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Takror | `npm run pay -- <raqam> ikki` | 2-javob `← 200 {"ok":true,"duplicate":true}` |
  | 2 | Begona | `npm run pay -- <raqam> imzosiz` · `npm run pay -- <raqam> soxta` | ikkalasi `← 401`, serverda `imzo noto'g'ri` |
  | 3 | Rad | telefondan yangi buyurtma · `npm run pay -- <yangi raqam> rad` | `← 200`, panelda «Rad etildi» |
  | 4 | Baza | psql: `SELECT payment_id, order_id, status FROM payments;` | takror bitta qator, imzosiz/soxta yo'q, rad bor |
- Isbot: «`ikki` rejimining ikkinchi javobi» · placeholder: «masalan: ← 200 {"ok":true,"duplicate":true}» · KOD: `/"duplicate":true/` · xato: «`npm run pay -- <raqam> ikki` dagi ikkinchi `← 200 …` satrini qo'ying — unda `"duplicate":true`.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Ikkala javob `duplicate: false` | `payments.payment_id` da UNIQUE yo'q — migratsiya yurmagan; serverni qayta ishga tushiring, `\d payments` |
  | `imzosiz` ham 200 | server eski kodda yoki tartib buzilgan — `git status`, `git checkout wh-done` |
  | `rad` → 400 `summa mos emas` | buyurtma raqami boshqa (summa boshqa buyurtmaniki) |
  | Panelda «To'lov» ustuni yo'q | sahifa eski — F5 |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `whv2-out/04`, `05`, `06`.

---

## 12 · Buzamiz: xom tana va `rawBody`  ← `Lesson`
- Kicker: `4-bosqich · buzamiz` · Sarlavha: **Imzo baytlardan: xizmat JSON'ni bo'sh joy bilan yuborsa, xom tanadan hisoblagan kod qabul qiladi, `JSON.stringify(body)` dan hisoblagani rad etadi. `rawBody` o'chsa — haqiqiy to'lov ham 401**
- Sahna: 1-segmentda xato nusxa `payment.controller.ts` (`00b` json): `isValidSignature(Buffer.from(JSON.stringify(body)), …)` (qizil, M36); 2-segmentda yonma-yon (M47): `07` done — `{ "paymentId": "pay_bosh_joy", … }` → `← 200` ↔ `07` json — o'sha xabar → `← 401`; 3-segmentda `00b` norawbody: `main.ts` `NestFactory.create(AppModule)` (rawBody yo'q) + `08`: server logi `main.ts: NestFactory.create(AppModule)` · `npm run pay -- 1` → `← 401`, `payments_qatorlari 0`; 4-segmentda sabab kartasi.
- F-1120-02 (M52): 0-band — mentor wh-done controller'idagi `req.rawBody` ni o'zi bosadi → imzo `JSON.stringify(body)` dan. Kod ostida kichik rasm (M51): to'lov xizmati → imzo manbasi → javob «?» → 401; bo'laklar 1 (imzo manbasi) · 2 (401).
0. **Endi ==o'zingiz buzasiz==: kodda yonib turgan `req.rawBody` ustiga bosing**
   Ovoz: «Endi to'rtta xatoni ataylab yasaymiz, birinchisini o'zingiz qilasiz. Payment controller ts'da imzo req raw body'dan hisoblanyapti, raw body yonib turibdi, ustiga bosing: imzo JSON stringify body'dan hisoblanadi.»
   Bosish: «**payment.controller.ts**dagi **`req.rawBody`** ustiga bosing — imzo `JSON.stringify(body)` dan hisoblanadi.»
1. **Sodda xato: imzoni ==`JSON.stringify(body)` dan== hisoblash — «baribir o'sha ma'lumot-ku»**
   Ovoz: «Imzo endi xom tanadan emas, JSON stringify body'dan hisoblanadi. Bu juda keng tarqalgan xato. Ma'lumot baribir o'sha, deb o'ylaysiz. Bizning skript bo'sh joysiz yuboradi, shuning uchun bu kod u bilan ishlaydi.» · kod
2. **Xizmat ==bo'sh joy bilan== yubordi: to'g'ri kod 200, xato kod 401**
   Ovoz: «Lekin xizmat JSON'ni bo'sh joylar bilan yuborsa-chi? Imzo aynan shu baytlardan. To'g'ri kod qabul qildi, ikki yuz. Stringify qilgan kod esa obyektni qayta yozdi, bo'sh joylar yo'qoldi, imzo mos kelmadi, to'rt yuz bir. Haqiqiy to'lov rad etildi.» · yonma-yon
3. **`main.ts` da ==`rawBody` yo'q==: `req.rawBody` bo'sh — haqiqiy to'lov ham 401**
   Ovoz: «Ikkinchi xato: main ts'dan raw body true olib tashlandi. Server logida create, ikkinchi argumentsiz. Npm run pay to'g'ri kalit bilan yuboradi, javob baribir to'rt yuz bir, bazada nol qator. Req raw body umuman yo'q, imzoni solishtiradigan narsa yo'q.» · norawbody
4. **Demak, sabab: imzo ==baytlardan==; xom tanani faqat `rawBody: true` saqlaydi**
   Ovoz: «Demak, sabab bitta: imzo matn ma'nosidan emas, aniq baytlardan hisoblanadi. Nest tanani o'qib, obyektga aylantiradi va baytlarni tashlaydi. Ularni faqat raw body true saqlaydi. Har ikki xatoda belgi bir xil: haqiqiy, to'g'ri imzoli to'lov to'rt yuz bir oladi.» · sabab
- Manba: `whv2-out/07-xom-tana-done.txt`, `07-xom-tana-json.txt`, `08-rawbody-yoq.txt`, `00b-nusxalar-farqi.txt` (aynan).

## 13 · Buzamiz: tartib — 401, lekin «To'landi»  ← `Lesson`
- Kicker: `4-bosqich · buzamiz` · Sarlavha: **Yozuvni imzodan oldin qo'ysak: imzosiz xabar 401 oladi — lekin `payments` da qator bor va panelda «To'landi». Javob to'g'ri, bazada esa yolg'on**
- Sahna: 1-segmentda xato nusxa `payment.controller.ts` (`00b` tartib): `const p = parsePayment(body);` · `const r = await this.payments.record(p);` (qizil) · keyin `if (!isValidSignature(…))`; 2-segmentda terminal `09`: `$ npm run pay -- 1 imzosiz` → `X-Signature: (yo'q)` · `← 401 {"message":"imzo noto'g'ri",…}`; 3-segmentda psql `09` (`pay_… | 1 | paid`, `orders #1 paid`) + panel `09b` («To'landi»); 4-segmentda sabab kartasi.
- F-1120-02 (M52): 0-band — mentor wh-done controller'idagi `this.payments.record` satrini o'zi bosadi → yozuv imzodan oldinga ko'chadi. Kichik rasm: imzosiz xabar → record → imzo → javob «?» → 401, baza «?» → paid; bo'laklar 1 (record imzodan oldin) · 2 (paid).
0. **Uchinchi xato eng xavflisi — ==uni ham o'zingiz qilasiz==: `record` satri ustiga bosing**
   Ovoz: «Uchinchi xato eng xavflisi, uni ham o'zingiz qilasiz. Controller'da yozuv satri yonib turibdi, ustiga bosing: u imzo tekshiruvidan oldinga ko'chadi.»
   Bosish: «**payment.controller.ts**dagi **`this.payments.record`** ustiga bosing — yozuv imzo tekshiruvidan oldinga ko'chadi.»
1. **Uchinchi xato: ==`record` imzo tekshiruvidan oldin== — «avval yozib olay, keyin tekshiraman»**
   Ovoz: «Tartib almashdi: avval parse va record, keyin imzo. Kod ishlaydi, testlarsiz ko'rinmaydi. Imzosiz xabar yuboramiz.» · kod
2. **Javob ==401==: tashqaridan qaraganda hammasi to'g'ri**
   Ovoz: «Javob to'rt yuz bir, imzo noto'g'ri. Xabar yuborgan odam rad etildim deb o'ylaydi, server logida ham ogohlantirish. Tashqaridan qaraganda himoya ishlayapti.» · terminal
3. **Bazada ==`paid`==, panelda ==«To'landi»== — imzosiz xabar ishini qildi**
   Ovoz: «Lekin bazaga qarang: payments'da qator, buyurtma paid. Panelda ham to'landi, sahifa o'zi yangilandi. Yozuv tranzaksiyasi to'rt yuz birdan oldin tugagan. Admin buyurtmani yetkazib beradi, pul esa yo'q.» · psql + panel
4. **Demak, sabab: ==401 yozilganni qaytarmaydi==; imzo — eng birinchi qadam**
   Ovoz: «Demak, sabab: to'rt yuz bir faqat javob, u bazaga yozilganni qaytarmaydi. Shuning uchun imzo eng birinchi qadam, hech qanday yozuvdan oldin. Bunday xatoni ko'z bilan topish qiyin, uni test ushlaydi, uchinchi amaliyotda ko'rasiz.» · sabab
- Manba: `whv2-out/09-tartib.txt`, `09b-tartib-panel.txt`, `00b-nusxalar-farqi.txt` (aynan).

## 14 · Tekshiruv 2 — qaysi satr joyida emas  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Bu controller imzosiz xabarga 401 qaytaradi, lekin buyurtma «to'landi» bo'lib qoladi. Joyida turmagan satrni toping**
- Shart (`task`): «Qoida: bazaga yozadigan chaqiruv **imzo tekshiruvidan keyin** turadi. Bu bo'lakda bitta satr imzodan **oldin bazaga yozadi**. **O'sha satrni bosing.**»
- Ovoz (`q`): «Tartib buzilishini ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu controller imzosiz xabarga to'rt yuz bir qaytaradi, lekin buyurtma to'landi bo'lib qoladi. Bo'lakda bitta satr imzodan oldin bazaga yozadi. O'sha satrni bosing.»
- Fayl: `payment.controller.ts` `webhook()` (`tartib` nusxasi, `00b`): `const p = parsePayment(body);` · **`const r = await this.payments.record(p);` ← xato satr** · `if (` · `!isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)` · `) {` · `this.log.warn(…)` · `throw new UnauthorizedException(…)` · `}` → `target` = `record` satri (✅ KOD).
- Tuzatilgan (`fixed`): `wh-done` tartibi (imzo → `parsePayment` → `record`); `fixedExtra`: `09` psql (`paid`) va `05` (to'g'ri tartib: imzosiz — qator yo'q).
- To'g'ri (ovoz, `ok`): «To'g'ri. Record chaqiruvi imzo tekshiruvidan oldin turibdi: tranzaksiya tugab, buyurtma paid bo'ladi, keyin imzo tekshirilib to'rt yuz bir qaytadi. Parse payment ham oldin, lekin u bazaga yozmaydi. Demak, javob kodiga emas, bazaga qarab tekshiring: yozuvni imzodan keyinga qo'ying.»
- Qisqa (`okShort`): «`record(p)` imzodan oldin — yozuv bo'ladi, keyin 401. 401 yozilganni qaytarmaydi.»
- Maslahat (`hint`): «Qaysi satr bazaga yozadi va u `isValidSignature` dan oldinmi, keyinmi?»
- Manba: `whv2-out/09-tartib.txt`, `00b-nusxalar-farqi.txt`.

## 15 · Kalit bo'sh, summa va maydon xato  ← `Lesson`
- Kicker: `4-bosqich · ichida` · Sarlavha: **To'rtinchi xato — kalit `.env` da bo'sh: server ishga tushganda ogohlantiradi va har xabar 401. Imzo to'g'ri bo'lsa ham, summa yoki maydon xato — 400 va qator yo'q**
- Sahna: 1-segmentda server logi `10`: `WARN [Payment] PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)`; 2-segmentda terminal `10`: `npm run pay -- 1` → `← 401` · `payments_qatorlari 0` + `signature.ts` `if (!secret …) return false;`; 3-segmentda terminal `11`: `amount 1200` → `400 summa mos emas: 1200 ≠ 120000` · `status "ok"` → `400 status: 'paid' yoki 'failed'` · `payments_qatorlari 0`; 4-segmentda kalit gigiyenasi kartasi.
1. **Kalit bo'sh: server ==ishga tushganda ogohlantiradi==**
   Ovoz: «To'rtinchi xato: env faylida payment webhook secret bo'sh qoldi, masalan hostingda qo'shish esdan chiqdi. Server ishga tushganda logda ogohlantirish: kalit bo'sh, har to'lov xabari to'rt yuz bir bilan rad etiladi. Bu satrni ishga tushirish logida qidiring.» · log
2. **Har xabar ==401==, qator yo'q — bo'sh kalit bilan imzoni har kim yasardi**
   Ovoz: «Npm run pay ham bo'sh kalit bilan imzolaydi, server baribir to'rt yuz bir beradi. Bu ataylab shunday: bo'sh kalit bilan hisoblangan imzoni har kim hisoblay oladi. Bo'sh kalitni qabul qilish manzilni himoyasiz qoldirish bilan bir xil.» · 401
3. **Imzo to'g'ri, lekin ==summa mos emas yoki holat noma'lum — 400==**
   Ovoz: «Imzo to'g'ri bo'lsa ham hamma narsa yozilavermaydi. Summa bir ming ikki yuz, buyurtma esa bir yuz yigirma ming: to'rt yuz, summa mos emas. Holat ok deb kelsa: to'rt yuz, paid yoki failed. Ikkalasida bazada nol qator.» · 400
4. **Xulosa: kalit — ==`.env` va hostingda==; kodda, git'da, chatda — yo'q**
   Ovoz: «Xulosa va kalit qoidalari. Kalit faqat env faylida va hosting sozlamasida. Git'ga tushmaydi, kodga yozilmaydi, AI'ga yoki chatga berilmaydi. Tushib qolsa, xizmat kabinetida darhol almashtiriladi. Endi tekshirib olaylik.» · gigiyena
- Manba: `whv2-out/10-kalit-bosh.txt`, `11-summa-maydon.txt` (aynan); `order-bot` `wh-done` `signature.ts`.

## 16 · Tekshiruv 3 — kalit bo'sh bo'lsa  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **Hostingda `PAYMENT_WEBHOOK_SECRET` qo'shilmay qoldi. Nega server bunday holatda imzoni umuman tekshirib o'tirmay, har xabarni rad etadi?**
- Material (`above`): `signature.ts`: `if (!secret || !rawBody || typeof header !== 'string') return false;` + server logi `10`.
- Ovoz: «Kalitni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Hostingda kalit qo'shilmay qoldi. Server bunday holatda imzoni umuman tekshirmay, har xabarni rad etadi. Nega? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Bo'sh kalit bilan HMAC hisoblab bo'lmaydi, kod xato tashlaydi · 2 Bo'sh kalit bilan to'g'ri imzoni har kim hisoblay oladi · 3 Kalit bo'lmasa to'lov xizmati xabar yubormaydi · 4 Bo'sh kalitda server to'xtaydi, xatoni ko'rish qiyin
- To'g'ri (ovoz): «To'g'ri. HMAC bo'sh kalit bilan ham hisoblanadi, xato chiqmaydi. Lekin bo'sh kalitni hamma biladi: istalgan odam to'g'ri ko'rinadigan imzo yasaydi va to'landi deb yozadi. Shuning uchun bo'sh kalit, darhol rad, va ishga tushganda ogohlantirish. Demak, kalitning yo'qligi ham xato, uni qabul qilib bo'lmaydi.» · qisqa: «Bo'sh kalit — hammaga ma'lum kalit: imzoni har kim yasaydi. Shuning uchun darhol 401.»
- Isbot (`after`): `10`: ogohlantirish + `← 401` + `payments_qatorlari 0`; `payment.controller.spec.ts` testi «kalit bo'sh — to'g'ri ko'rinadigan imzo ham 401».
- Demak: «Bo'sh kalit — himoya yo'q degani: server uni qabul qilmaydi va ishga tushganda aytadi.»
- Xato izohlari: 1 — «Hisoblanadi — `createHmac` bo'sh kalit bilan ham ishlaydi; muammo xavfsizlikda.» · 3 — «Xizmat o'z kabinetidagi kalit bilan yuboradi; bizdagi bo'sh kalitni bilmaydi.» · 4 — «Server to'xtamaydi — ishlaydi va logda ogohlantiradi.»
- Maslahat: «Bo'sh kalitni kim biladi?»
- Manba: `whv2-out/10-kalit-bosh.txt`; `order-bot` `wh-done` `payment.controller.spec.ts`.

## 17 · Amaliyot 3 — tartibni buzing, testlar qizarsin  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **Controller'da `record` ni imzodan oldinga ko'chiring, `npm test` ni yurgizing — uchta test qizil bo'lishi kerak; keyin kodni qaytaring** · `tableAt: 3`
1. **Endi siz: tartibni ==ataylab buzasiz== va testlar ushlashini ko'rasiz**
   Ovoz: «Endi navbat sizga. Payment controller'da tartibni ataylab buzasiz: parse va record'ni imzo tekshiruvidan oldinga ko'chirasiz. Keyin testlarni yurgizasiz va qaysilari qizarishini ko'rasiz. O'n besh daqiqa ketadi.»
2. **1–2-qadam: ==ikki satrni yuqoriga== ko'chiring; `npm test -- payment.controller`**
   Ovoz: «Birinchi qadamda const p va const r satrlarini if'dan yuqoriga ko'chirib saqlaysiz. Ikkinchisida npm test, payment controller. Uchta test qizil: imzosiz, boshqa kalit va tana o'zgargan. Ular servis chaqirilmasligini tekshiradi.»
3. **3–4-qadam: ==qizil test nomlarini== o'qing; `git checkout` bilan qaytaring; isbot — natija satri**
   Ovoz: «Uchinchi qadamda qizil testlarning nomini o'qing: hammasi yozuvga yetmaslik haqida. To'rtinchisida git checkout bilan faylni qaytarib, testlarni yana yurgizasiz, hammasi yashil. Isbot maydoniga qizil natijadagi Tests satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz bilasiz: ko'z bilan ko'rinmaydigan xatoni to'g'ri yozilgan test ushlaydi.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Buzish | `src/api/payment/payment.controller.ts`: `const p = parsePayment(body);` va `const r = await this.payments.record(p);` → `if (` dan oldinga | saqlandi |
  | 2 | Testlar | `npm test -- payment.controller` | `FAIL` · `✕ imzosiz — 401, yozuvga yetmaydi` |
  | 3 | O'qish | qizil testlar nomi | 3 ta: imzosiz · boshqa kalit · tana o'zgargan |
  | 4 | Qaytarish | `git checkout -- src/api/payment/payment.controller.ts` · `npm test` | `Tests: 48 passed` |
- Isbot: «Qizil natijadagi `Tests:` satri» · placeholder: «masalan: Tests: 3 failed, 3 passed, 6 total» · KOD: `/3 failed/` · xato: «Buzilgan kod bilan `npm test -- payment.controller` dagi `Tests: …` satrini qo'ying — unda `3 failed`.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Hammasi yashil | fayl saqlanmagan yoki satrlar `if` ichiga tushgan — `git diff` |
  | `Cannot find name 'p'` | `const p` `record` dan keyin qolgan — avval `parsePayment`, keyin `record` |
  | 6 tadan ko'p test qizil | `if` bloki buzilgan (qavs) — `git checkout` bilan qaytarib qayta urining |
  | `npm test` umuman ishlamaydi | `npm install` qilinmagan (`wh-done` da yangi paket yo'q, lekin `node_modules` kerak) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `whv2-out/14-tartib-test.txt`, `13-test-smoke.txt` (aynan).

---
## 18 · AI webhook yozdi — ikki javob  ← `Lesson`
- Kicker: `5-bosqich · AI` · Sarlavha: **Ikki AI'ga xizmat hujjatidagi kabi qisqa talab: «POST, JSON, HMAC-SHA256, X-Signature, kalit .env da». Ikkalasi xom tana, `timingSafeEqual` va takrorni o'zi qildi**
- Sahna: 1-segmentda bosqich kartasi («1–4-bosqich · siz» xira → «5-bosqich · AI yozadi, siz qabul qilasiz»); 2-segmentda prompt kartasi (`p1-prompt.txt`); 3-segmentda ikki `AiReply`: «1-AI (kuchli model)» — 24 fayl, +789: `POST /payments/webhook`, `payment_id`/`order_id`/`paid`/`rejected`, `rawBody`, `timingSafeEqual`, `sha256=` ham qabul, UNIQUE + `FOR UPDATE`, **«Summa mos emas» holati**, 409, smoke 15/15 (`embedded-postgres` bilan) · «2-AI (kuchsizroq model)» — 20 fayl, +551: `POST /webhooks/payment`, xuddi shu maydonlar, `rawBody`, 64-hex tekshiruvi + `timingSafeEqual`, takror — mavjud qatorni yangilaydi, **summa farq qilsa — 200 va faqat log**; 4-segmentda iqtiboslar: AI-2 «Summa buyurtma jamidan farq qilsa, xabar qabul qilinadi (200), faqat log'da ogohlantirish yoziladi. Rad etish yoki boshqacha ish kerakmi — siz hal qiling.» · AI-1 «Doiradan bir marta chiqib ketdim…».
1. **Yana AI bosqichi: ==AI webhook yozadi, siz qabul qilasiz== — qisqa talab bilan**
   Ovoz: «Beshinchi bosqich, AI. Ikki AI'ga to'lov xizmati hujjatidagi kabi qisqa talab berdik: POST, JSON, HMAC SHA256, X Signature sarlavhasi, kalit env'da. Xom tana, takror, tartib, summa haqida bir so'z yo'q. Kuchli va kuchsizroq model.» · bosqich
2. **Prompt — ==to'rt maydon va imzo==; qolganini AI o'zi o'ylashi kerak**
   Ovoz: «Prompt ekranda aynan. To'lov raqami, buyurtma raqami, holat, summa va imzo. Bunday talabdan to'g'ri webhook chiqishi uchun AI bugun siz o'rgangan hamma narsani o'zi bilishi kerak: baytlar, takror, tartib, summa.» · prompt
3. **Ikkalasi: ==xom tana, `timingSafeEqual`, takror==; farq — summa va takror javobida**
   Ovoz: «Ikkalasi ham raw body'ni yoqdi, timing safe equal ishlatdi, payment id'ni noyob qildi. Birinchisi ancha chuqur: sha256 old qo'shimchasini ham qabul qiladi, summa mos kelmasa alohida holat. Ikkinchisi summa farq qilsa ham to'landi deydi, faqat logga yozadi.» · ikki javob
4. **AI-2 o'zi aytdi: ==«summa farq qilsa — 200, siz hal qiling»==; AI-1 — doiradan chiqqanini**
   Ovoz: «Ikkinchi AI'ning javobida halol jumla bor: summa farq qilsa xabar qabul qilinadi, siz hal qiling. Ya'ni qaror sizda. Birinchisi esa bir marta papkasidan tashqariga fayl ko'chirib, o'chirganini aytdi. Endi ikkalasini haqiqiy bazada sinaymiz.» · iqtiboslar
- Manba: `whv2-ai/p1-prompt.txt`, `ai1/00-javob.md`, `ai1/diff-stat.txt`, `ai2/00-javob.md`, `ai2/diff-stat.txt`.

## 19 · AI webhook'lari haqiqiy bazada  ← `Lesson`
- Kicker: `5-bosqich · ichida` · Sarlavha: **Haqiqiy PostgreSQL bilan yetti sinov: imzo, takror, bo'sh joyli JSON, bir vaqtda — ikkalasi o'tdi. Summa 1 200 (buyurtma 120 000): AI-1 «Summa mos emas», AI-2 «To'landi»**
- Sahna: 1-segmentda natija jadvali (`ai1/01`, `ai2/01`): to'g'ri imzo · takror · imzosiz · «abc» · bo'sh joyli JSON · bir vaqtda — hammasi to'g'ri; 2-segmentda 5-sinov yonma-yon: AI-1 `{"result":"applied","payment_status":"AMOUNT_MISMATCH"}` ↔ AI-2 `{"ok":true,"status":"PAID"}` + `GET /admin/orders` → `#2 · payment {"status":"PAID","amount":1200}`; 3-segmentda uch yondashuv kartasi: bizniki — 400, yozilmaydi · AI-1 — yoziladi, «Summa mos emas» · AI-2 — «To'landi»; 4-segmentda to'rt savol kartasi.
1. **Haqiqiy bazada: imzo, takror, bo'sh joyli JSON, bir vaqtda — ==ikkalasi to'g'ri==**
   Ovoz: «Ikkala nusxani haqiqiy Postgres bilan, bizning sinovlar bilan tekshirdik. To'g'ri imzo ikki yuz, takror bitta qator, imzosiz va qisqa imzo to'rt yuz bir, bo'sh joyli JSON qabul, bir vaqtda ikki xabar bitta qator. Bu qismda ikkalasi to'g'ri.» · jadval
2. **Summa 1 200, buyurtma 120 000: ==AI-2 panelda «To'landi»==, AI-1 «Summa mos emas»**
   Ovoz: «Beshinchi sinov: imzo to'g'ri, lekin summa bir ming ikki yuz, buyurtma esa bir yuz yigirma ming. Ikkinchi AI'da panel to'landi deydi, admin yetkazib beradi. Birinchisida summa mos emas holati: to'lov yozildi, lekin admin farqni ko'radi.» · 5-sinov
3. **Halol solishtiruv: ==bu yerda AI-1 bizdan yaxshiroq== — pul o'tgan bo'lsa, yozuv yo'qolmaydi**
   Ovoz: «Halol solishtiramiz. Bizning kod bunday xabarga to'rt yuz qaytaradi va yozmaydi. Lekin pul haqiqatan o'tgan bo'lishi mumkin, yozuv esa yo'q. Birinchi AI yozib, alohida belgilaydi. Bu yerda u bizdan yaxshiroq, uyga vazifada shuni qilasiz.» · uch yondashuv
4. **Xulosa: AI webhook'iga ==to'rt savol==: baytlarmi · tartib · takror · summa**
   Ovoz: «Xulosa: AI yozgan webhook'ga to'rt savol. Imzo xom baytlardanmi. Imzo yozuvdan oldinmi. Takror va bir vaqtda kelgan xabar bitta qatormi. Summa buyurtma bilan solishtiriladimi. Javobni kodda va haqiqiy bazada tekshiring.» · to'rt savol
- Manba: `whv2-ai/ai1/01-haqiqiy-baza.txt`, `ai2/01-haqiqiy-baza.txt`, `XULOSA.md` (aynan).

## 20 · Tekshiruv 4 — summa mos emas  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **2-AI panelida: #2 «To'landi · 1 200 so'm», buyurtma esa 120 000 so'm. Server logida faqat ogohlantirish. Bu yerda nima xavf?**
- Material (`above`): `ai2/01` 5-sinov: `{"ok":true,"status":"PAID"} ← 200` · `GET /admin/orders` → `#2 total 120000 · payment {"status":"PAID","amount":1200,…}` · `WARN [Payment] #2: to'lov summasi 1200, buyurtma summasi 120000 — tekshiring`.
- Ovoz: «AI webhook'larini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Ikkinchi AI panelida buyurtma to'landi, bir ming ikki yuz so'm, buyurtma esa bir yuz yigirma ming. Server logida faqat ogohlantirish. Bu yerda nima xavf? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 Admin buyurtmani to'liq to'langan deb yetkazib yuboradi · 2 Xavf yo'q — log ogohlantiryapti, admin uni baribir har kuni o'qiydi · 3 Imzo buzilgan — demak xabar soxta bo'lishi mumkin · 4 Takror xabar keyin ikkinchi qatorni ham yozib qo'yadi
- To'g'ri (ovoz): «To'g'ri. Admin logni emas, panelni ko'radi, panel esa to'landi deydi. Buyurtma yetkaziladi, pulning yuzdan biri kelgan. Imzo to'g'ri, xabar haqiqiy: masalan, xizmat summani tiyinda yuborgan. Demak, summa buyurtma jami bilan solishtiriladi va mos kelmasa, alohida ko'rinadigan holat bo'ladi.» · qisqa: «Panel «To'landi» — admin yetkazadi, pul 1 %. Summani jami bilan solishtiring.»
- Isbot (`after`): AI-1 o'sha xabarga: `{"result":"applied","payment_status":"AMOUNT_MISMATCH"}` · panel `#2 · payment "AMOUNT_MISMATCH"`.
- Demak: «Imzo xabar haqiqiyligini isbotlaydi, summaning to'g'riligini emas — summa alohida tekshiriladi.»
- Xato izohlari: 2 — «Admin panelga qaraydi, logga emas — ogohlantirish ko'rinmaydi.» · 3 — «Imzo to'g'ri — xabar haqiqiy; muammo summada (masalan, tiyinda yuborilgan).» · 4 — «Takror bu yerda yo'q — ikkala AI ham bitta qator yozadi.»
- Maslahat: «Admin qayerga qaraydi — logga yoki panelga? Imzo nimani isbotlaydi?»
- Manba: `whv2-ai/ai2/01-haqiqiy-baza.txt`, `ai1/01-haqiqiy-baza.txt`.

---

## 21 · m11-03 xaritasi: Maydon Jamoa  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Eyebrow: `m11-03 · «Webhook: to'lov Backend'ga qanday yetib keladi»` · Sarlavha: **O'quvchi darsi: Maydon Jamoa'da Pro obuna, test rejim — siz bugun OrderBotNest'da qilgan xabar, imzo, takror va radning o'zi**
- Sahna: ikki karta: «O'quvchi (m11-03)» — 20 ekran: s0–s1 kirish · s2–s5 to'lov xabari va imzo · s6–s8 takror (s7 kod oynasi) · s9–s11 rad va test rejim · s12–s14 to'lov oqimi sxemasi · A1 o'z Backend'ida `POST /tolov/webhook` (agent bilan) · A2 «Mashq to'lov» sahifasi va uch tekshiruv · «Siz (bugun)» — OrderBotNest: imzo, tartib, `rawBody`, takror, rad, summa, AI; 3-segmentda bloklar jadvali; 4-segmentda repo: `maydon-jamoa` `m13-dars-03-done` — `POST /tolov/webhook`, `X-Imzo`, `TOLOV_KALITI`.
- Bloklar:
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 · s1 reja | mijozning gapi dalil emas (2-ekran) |
  | 2 Xabar va imzo | s2 to'lov xabari · s3 test · s4 imzo · s5 test | soxta 401, xom tana (9, 12-ekran) |
  | 3 Takror | s6 javob yo'qoldi · s7 kod oynasi · s8 test | bir vaqtda ikki xabar (10-ekran) |
  | 4 Rad va test rejim | s9 rad · s10 test · s11 test rejim | to'langani «rad» ga tushmaydi (10-ekran) |
  | 5 Sxema va amaliyot | s12–s14 sxema va sinov · A1 o'z Backend'i · A2 mashq sahifa | tartib (13), kalit (15), Render ⚠ |
1. **m11-03 — 20 ekran: ==Maydon Jamoa, Pro obuna, test rejim== — pul yechilmaydi**
   Ovoz: «Endi sinfga tayyorgarlik. O'quvchi darsi m11-03, yigirma ekran. Misol Maydon Jamoa: o'yin tashkilotchisi Pro obuna uchun to'laydi, o'ttiz kun, o'n ming so'm. Hammasi test rejimda, karta so'ralmaydi, pul yechilmaydi.» · kartalar
2. **O'quvchi ham ==xabar, imzo, takror va rad==; amaliyotda agent bilan o'z Backend'i**
   Ovoz: «O'quvchi darsidagi yo'l siznikidek: to'lov xabari, imzo, takror, rad va to'lov oqimi sxemasi. Amaliyotda o'quvchi o'z Backend'iga webhook qo'shadi, agent bilan, keyin mashq sahifasida uch tekshiruv. Kalit faqat env va Render'da.» · yo'l
3. **Bloklar: ==og'ir joy — 7-ekran kod oynasi va ikki amaliyot==**
   Ovoz: «Bloklar jadvaliga qarang. Og'ir joy yettinchi ekrandagi kod oynasi va ikki amaliyot, har birida Render'da yangi versiya kutiladi. Har blokda siz qo'shadigan narsa o'ng ustunda, bugungi ekran raqami bilan.» · jadval
4. **Xulosa: repo ==`m13-dars-03-done`==: `POST /tolov/webhook`, `X-Imzo`, `TOLOV_KALITI`**
   Ovoz: «Xulosa: o'quvchi loyihasi maydon jamoa, o'n uchinchi modul uchinchi dars done tegi. Manzil tolov webhook, imzo X Imzo sarlavhasida, kalit TOLOV KALITI. Nomlar o'zbekcha, qoidalar siz bugun ko'rgandek. Keyingi ekranda o'quvchi so'zlari.» · repo
- Manba: `src/11-Modull/PaymentWebhookLesson.jsx` (`SCREEN_META` 20, s0–s14, A1, A2); `maydon-jamoa` `m13-dars-03-done`; v1 `manba/wh-out/README.md`.

## 22 · O'quvchi so'zlari: `X-Imzo`, `TOLOV_KALITI`, mashq sahifa  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **O'quvchi tilida: to'lov xabari, imzo, kalit, takror — va «Mashq to'lov» sahifasining to'rt tugmasi; tartib buzilganda o'quvchi loyihasida ham 401, lekin qator yozilgan**
- Sahna: 1-segmentda lug'at (o'quvchi ↔ siz/OrderBotNest); 2-segmentda `wh-out/01`: «Mashq to'lov» · «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · «Maydon Jamoa — Pro, 30 kun · 10 000 so'm» · to'rt tugma; 3-segmentda `wh-out/02`, `05`: «tolash» → `200 {"ok":true}` · «imzosiz» → `401 Imzo mos emas`; 4-segmentda `wh-out/13`: o'quvchi loyihasida tartib buzilsa — «Imzosiz» → 401, lekin `tolovlar` da qator.
- Lug'at:
  | O'quvchi aytadi | Siz bilasiz (OrderBotNest) |
  |---|---|
  | to'lov xabari · `POST /tolov/webhook` | webhook · `POST /payments/webhook` |
  | imzo · `X-Imzo` · `TOLOV_KALITI` | `X-Signature` · `PAYMENT_WEBHOOK_SECRET` |
  | takror xabar · `{ takror: true }` | `{ duplicate: true }` |
  | `holat: tolandi / rad` | `status: paid / failed` |
  | mashq to'lov sahifasi | `npm run pay` |
1. **O'quvchi so'zlari: ==`X-Imzo`, `TOLOV_KALITI`, `takror: true`== — siznikining o'zbekcha nomi**
   Ovoz: «O'quvchi darsidagi so'zlar: to'lov xabari, imzo X Imzo sarlavhasida, kalit TOLOV KALITI, takror xabarga javob takror true. Siz bilgan narsalar, faqat nomlar o'zbekcha. O'quvchi aytganda, yonida OrderBotNest nomini ayting.» · lug'at
2. **«Mashq to'lov» sahifasi: ==to'rt tugma== — xizmat o'rnida Backend'ning o'zi**
   Ovoz: «O'quvchida npm run pay o'rniga sahifa bor: mashq to'lov. Karta so'ralmaydi, pul yechilmaydi. To'rt tugma: to'lash, rad etish, ikki marta yuborish, imzosiz yuborish. Siz bugun skriptning xuddi shu to'rt rejimini sinadingiz.» · sahifa
3. **Tugmalar: ==«To'lash» 200, «Imzosiz» 401== — o'quvchi loyihasida haqiqiy Backend bilan**
   Ovoz: «Bu chiqishlar o'quvchi loyihasining haqiqiy Backend'idan: to'lash, ikki yuz ok. Imzosiz, to'rt yuz bir, imzo mos emas. Sinfda o'quvchi shu ikki javobni ko'rishi kerak.» · tugmalar
4. **Xulosa: o'quvchida ham ==tartib buzilsa 401, lekin qator yozilgan== — 13-ekrandagi xato**
   Ovoz: «Xulosa va ogohlantirish. O'quvchi loyihasida ham tekshiruv tartibini buzib ko'rdik: imzosiz to'rt yuz bir, lekin to'lovlar jadvalida qator. Agent kodni yozganda o'quvchi javob kodiga emas, jadvalga qarasin.» · tartib
- Manba: `manba/wh-out/01-mashq-sahifa.txt`, `02-tugma-tolash.txt`, `05-tugma-imzosiz.txt`, `13-tartib-buzilgan.txt` (01.11, `maydon-jamoa` haqiqiy Backend).

## 23 · Sinfdagi holatlar va o'quvchi savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **401 bo'lsa — kalit, `rawBody`, tartib; qolganida javob matnini o'qing: olti holat va o'quvchi so'raydigan to'rt savol**
- Sahna: 1–2-segmentda holatlar kartalari (6); 3–4-segmentda «O'quvchi so'rasa» (ovozsiz, bosib ochiladi).
- Holatlar:
  | # | Holat | Belgisi | Sabab |
  |---|---|---|---|
  | 1 | Hamma xabar 401 | `Imzo mos emas` | kalit bo'sh yoki Render'dagi kalit boshqa |
  | 2 | Haqiqiy «To'lash» ham 401 | `Imzo mos emas` | `rawBody` yoqilmagan |
  | 3 | 401, lekin jadvalda qator | — | imzo yozuvdan keyin |
  | 4 | «Ikki marta» — ikki qator | `takror` kelmadi | to'lov raqami noyob emas |
  | 5 | 400 | javob matnida maydon nomi | maydon yoki summa xato |
  | 6 | `.env` Git'da | `git ls-files` da fayl nomi | kalitlar darhol almashtiriladi |
- O'quvchi so'rasa:
  - «Payme ulasam bo'ladimi?» → AI Startup kursida emas: real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan (o'quvchi darsi s1 eslatmasi).
  - «Nega takrorga ham 200?» → xato kodi qaytsa, xizmat qayta yuboraveradi.
  - «Nega rad yoziladi?» → «to'lovim qayerda?» savoliga javob.
  - «Kalitni agentga bersam tezroq bo'lardi-ku?» → kalit kimda bo'lsa, o'sha «to'landi» yasaydi.
1. **Birinchi uchtasi — ==401 bilan bog'liq==: kalit, `rawBody`, tartib**
   Ovoz: «Sinfda uchraydigan olti holat. Birinchi uchtasi imzo bilan bog'liq. Hamma xabar to'rt yuz bir: kalit bo'sh yoki Render'dagisi boshqa. Haqiqiy to'lash ham to'rt yuz bir: raw body yoqilmagan. Javob to'rt yuz bir, lekin jadvalda qator: tartib buzilgan.» · 1–3
2. **Qolgan uchtasi: ==ikki qator, 400 va `.env` Git'da==**
   Ovoz: «To'rtinchisi: ikki marta tugmasi ikki qator yozdi, to'lov raqami noyob emas. Beshinchisi: to'rt yuz, javob matnida qaysi maydon xato yozilgan. Oltinchisi: env fayl Git'ga tushib qolgan, bunda kalitlar darhol almashtiriladi.» · 4–6
3. **O'quvchi savollari: ==Payme, takrorga 200, rad, kalitni agentga berish==**
   Ovoz: «O'quvchi savollariga tayyor javoblar pastda, bosib oching: Payme ulasam bo'ladimi, nega takrorga ham ikki yuz, nega rad yoziladi va kalitni agentga bersam bo'ladimi.» · QA
4. **Xulosa: 401 da ==kalit → `rawBody` → tartib==; jadvalga qarang, javobga emas**
   Ovoz: «Xulosa va usul: javob to'rt yuz bir bo'lsa, shu tartibda tekshiring: kalit, raw body, keyin tekshiruv tartibi. Har doim jadvalga qarang, faqat javob kodiga emas. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring.»
- Manba: `whv2-out/08`, `09`, `10`; v1 `manba/wh-out/07–13`; o'quvchi darsi s1, A1.

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran; M48 — uzunliklar tekis):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Mijoz to'laganini server nimadan biladi? | Mijoz yuborgan to'lov skrinshotidan · Botdagi «To'ladim» tugmasi bosilganidan · To'lov xizmatining imzoli xabaridan · Admin panelda qo'ygan belgidan | 3 | Dalil — faqat xizmatning imzoli xabari. | 2 |
  | 2 | Imzo nimadan hisoblanadi? | Xom tana va maxfiy kalitdan · JSON obyekt va buyurtma raqamidan · Sarlavhalar va IP manzildan · Summa va vaqt belgisidan | 1 | HMAC — baytlar va kalitdan. | 4 |
  | 3 | `main.ts` da `rawBody: true` yo'q. Nima bo'ladi? | Imzosiz xabarlar ham o'tib ketadi · Haqiqiy to'lov ham 401 oladi · Takror xabarlar ikki marta yoziladi · Server umuman ishga tushmaydi | 2 | Imzoni solishtiradigan bayt yo'q. | 12 |
  | 4 | Imzosiz xabar 401 oldi, lekin buyurtma «To'landi». Sabab? | Kalit .env faylida bo'sh qolib ketgan · main.ts da rawBody yoqilmagan · timingSafeEqual ishlatilmagan · Yozuv imzo tekshiruvidan oldin | 4 | 401 yozilganni qaytarmaydi. | 13 |
  | 5 | Xizmat bitta xabarni ikki marta yubordi. Server nima qiladi? | Ikkinchisiga 409 qaytaradi · Ikkala marta yozadi · 200 duplicate, qator bitta · Ikkinchisiga 401 qaytaradi | 3 | payment_id noyob, ON CONFLICT. | 10 |
  | 6 | Karta rad etildi, xizmat xabar yubordi. Nima qilinadi? | Yoziladi, holati failed · Tashlab yuboriladi, chunki pul o'tmagan · 400 qaytariladi · Buyurtma o'chiriladi | 1 | «To'lovim qayerda?» ga javob. | 10 |
  | 7 | .env da kalit bo'sh. Server nima qiladi? | Imzoni tekshirmay hammasini qabul qiladi · Ogohlantiradi va har xabarni rad etadi · Umuman ishga tushmaydi · Kalitni xizmatdan o'zi so'raydi | 2 | Bo'sh kalitni hamma biladi. | 15 |
  | 8 | AI webhook'i 1 200 so'mlik to'lovni 120 000 so'mlik buyurtmaga «To'landi» dedi. To'g'ri qaror? | Ishlayapti, imzo to'g'ri — shundayligicha qabul qilish · Faqat logni o'qib turish · Imzoni uzunroq qilish · Summani jami bilan solishtirib ajratish | 4 | Imzo summani isbotlamaydi. | 19 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. To'lov xizmati natijani serverga o'zi yuboradi (webhook); mijoz yoki ilovaning «to'ladim»i dalil emas — dalil faqat imzoli xabar.
  2. Imzo — HMAC-SHA256(xom tana, kalit); server qayta hisoblaydi, `timingSafeEqual`; bo'sh kalit — hamma xabar rad; kalit faqat `.env` va hostingda.
  3. Tartib: imzo → maydonlar → buyurtma va summa → yozuv. Yozuv imzodan oldin bo'lsa — 401, lekin bazada «to'landi».
  4. Imzo baytlardan: `rawBody: true` va `req.rawBody`; `JSON.stringify(body)` dan hisoblash — bo'sh joyli haqiqiy to'lovni rad etadi.
  5. Takror — `payment_id` UNIQUE + `ON CONFLICT DO NOTHING` (bir vaqtda kelsa ham bitta qator), javob 200; rad ham yoziladi, to'langanini tushirmaydi.
  6. AI webhook'iga to'rt savol: baytlarmi · tartib · takror · summa; haqiqiy bazada sinang — bu safar summada AI-1 bizdan yaxshiroq edi.
- **Uyga vazifa** (M14, M30): «O'z OrderBotNest nusxangizda (`wh-done`) summa mos kelmaydigan to'lovni 400 o'rniga **yozib, alohida belgilang**: `payments` ga qator, `orders.payment_status = 'amount_mismatch'`, panelda «Summa mos emas». `payment.service.spec.ts` dagi «summa mos emas — 400» testini yangi xatti-harakatga moslang va smoke'ga bitta band qo'shing. README «To'lov webhook'i» jadvalini yangilang. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Servis | `payment.service.ts`: summa farq qilsa — yozish va `amount_mismatch` | `BadRequestException` o'rniga yozuv |
  | 2 | Panel | `admin.html` `TOLOV` ga `amount_mismatch: 'Summa mos emas'` | panelda yangi belgi |
  | 3 | Test | `payment.service.spec.ts` + `npm run smoke -- payment` | yashil, yangi band |
  | 4 | Sinov | `curl` bilan summa 1200 (imzoni `openssl dgst -sha256 -hmac`) | `200`, panelda «Summa mos emas» |
  | 5 | Topshirish | README jadvali · `git push` → repo linki platformaga | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: imzo hali ham birinchi · mos kelmagan summa yozilgan va ajratilgan (to'landi emas) · test yangilangan · README.
- **Eslatma:** webhook — xizmat o'zi yuboradi · dalil — imzoli xabar · HMAC(xom tana, kalit), `timingSafeEqual`, bo'sh kalit · tartib: imzo → maydonlar → summa → yozuv · `rawBody: true` · takror: UNIQUE + `ON CONFLICT` · rad yoziladi · `npm run pay` rejimlari · to'rt buzilish va belgilari · AI'ga to'rt savol · m11-03 lug'ati · sinfdagi olti holat · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Bu kursdagi oxirgi mentor darsi — OrderBotNest'ni boshidan oxirigacha qurdingiz: bot, baza, testlar, lenta, jonli panel va to'lov».

---

## «KOD» — qurishda
1. WebSocket-2 v2 yordamchilari (`tsLine`, `liveLine`, `sec`, `secRaw`, `ms`, `lineN`, `kod`, `Code`, `PanelView`, `Flow`) — `wh/parts/04-yordam.jsx` ga nusxa; `PanelView` — 8 ustun («To'lov»).
2. Chiqishlar `whv2-out/`, `whv2-ai/` dan aynan (`dev/wh-kod.py`); fayllar `order-bot` `wh-start` / `wh-done` teglaridan; xato nusxalar (norawbody, tartib, json) — `drive-whv2.sh` dagi o'sha almashtirish bilan; `maydon-jamoa` chiqishlari — `manba/wh-out/`.
3. LineCheck (14-ekran): `tartib` nusxasi `webhook()` — `target` = `const r = await this.payments.record(p);`; `fixed` — `wh-done` tartibi.
4. Isbotlar: 8 — `/200 \{"ok":true,"duplicate":false\}/` · 11 — `/"duplicate":true/` · 17 — `/3 failed/`.
5. LESSON_ID o'zgarmaydi (M44) — v1 dagi qiymat.

## Ochiq savollar
1. Haqiqiy to'lov xizmati (Payme, Click) bilan sinalmagan: maydon nomlari, summa birligi (so'm/tiyin), imzo ko'rinishi (hex/base64) xizmat hujjatiga bog'liq (AI-1 ham shuni yozgan) — darsda ⚠.
2. Render, `RENDER_EXTERNAL_URL`, Neon — o'quvchi darsidan, sinalmagan (⚠).
