# Mentor kursi · WebSocket-1 «Jonli panel: server o'zi xabar yuboradi» — MD v2 (M41: avval mentor o'rganadi)

F-ID: F-1029-02 (WebSocket-1) · **F-1104-22** (qayta yozish) · Sana: 2026-11-04 · Holat: **QURILMOQDA 04.11** (foydalanuvchi 04.11: «to'g'ridan qurib chiqar» — MD tasdig'isiz, saytda ko'riladi) · Fidbek: qator yoniga `>> …`
Oldingi: `19-WS1-mentor-v1.md` (01.11, avtopilot, o'quvchi loyihasi `maydon-jamoa`) · **TASHLANADI**
Fayl (qayta quriladi): `src/mentor-kurs/WsBasicsMentorLesson.jsx` · bo'laklar `src/mentor-kurs/ws1/parts/` · dvigatel — umumiy `parts/01–02` · generator `dev/ws1-matn.py` (cicd2-matn.py dan, M48 ichida) · kod va chiqishlar `dev/ws1-kod.py`
Qonun: `MENTOR_DARS_ETALON.md` M1–M48 · Haqiqiy chiqishlar: `manba/ws1v2-out/` (skriptlar `manba/drive-ws1v2.sh`, `drive-ws1v2-extra.sh`; server `ws1v2-server.cjs` — OrderBotNest dist, Telegram o'rniga `bot.handleUpdate`; klient — loyihaning o'z `npm run live`; brauzer — headless Chrome `ws1v2-panel.mjs`) · AI `manba/ws1v2-ai/` (`drive-ws1v2-ai.sh` — haqiqiy baza bilan)
Loyiha: **OrderBotNest** — teglar `ws1-start` (= `cicd2-done` 87a5bb1) · `ws1-done` (fb8b8b4: `src/api/live/`, `public/admin.html`, `scripts/live-client.js`, smoke `live`) — push ✓; GitHub CI run 41856397400: test 32 ✓, smoke 9/9 ✓

**v1 → v2 nima o'zgardi (F-1104-22):**
- Misol — **OrderBotNest** (CI/CD-2 davomi): botga do'kon uchun **jonli buyurtmalar paneli** qo'shiladi — yangi buyurtma va holat o'zgarishi brauzerda sahifani yangilamasdan ko'rinadi. Mentor sayt tomonini ham qiladi («faqat bot qildim» xavotiri). O'quvchi loyihasi `maydon-jamoa` — faqat 21–23-ekran.
- Dars boshida **umumiy tushuncha**: so'rov–javob va doimiy ulanish farqi, socket.io nima qiladi.
- Haqiqiy topilmalar: tokensiz klient **bir lahza `connect`** ko'radi, keyin `io server disconnect` (03) · `return` unutilsa server logi `panel ulandi` deb yolg'on yozadi (07) · «muzlash»da `ping timeout` (06) · `() => yukla` qavssiz — hodisa keladi, ro'yxat yangilanmaydi (11) · `ws1-start` da gateway yo'q — klient cheksiz `xhr poll error`, `/admin` 404 (08).
- AI: ikkala AI ham ishlaydigan panel yozdi, lekin **xom `ws`** (socket.io emas), **token URL'da**, hodisada **butun buyurtma telefon bilan**, `OrderService` va uning testi o'zgargan — haqiqiy bazada biz sinadik.
- M46, M47, M48 — boshidan.

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | CI/CD-2 ni o'tgan mentor: OrderBotNest'da bot, testlar, lenta (smoke Postgres bilan) bor. NestJS controller va REST'ni biladi. WebSocket bilan ishlamagan. |
| Dars oxirida mentor | 1) so'rov–javob va doimiy ulanish farqini OrderBotNest misolida aytadi · 2) socket.io gateway'ni o'qiydi: token ulanishda (`handshake.auth.token`), noto'g'ri bo'lsa `disconnect()` + `return` · 3) hodisani tranzaksiya tugagach yuboradi, «konvert» (`{ orderId, reason }`) va qayta so'rash qoidasini biladi · 4) panel kodini o'qiydi: `io({ auth: { token } })`, tinglovchi, uch holat · 5) uch holatni sababi bilan taniydi (`io server disconnect` · `transport close` · `ping timeout`) · 6) `npm run live` va `npm run smoke -- live` bilan brauzersiz tekshiradi · 7) AI yozgan real vaqt kodini to'rt savol bilan qabul qiladi · 8) sinfga: m10-02 xaritasi |
| O'quvchi darsi (faqat 6-bosqich) | **m10-02** «WebSocket: ekran o'zi yangilanadigan ulanish» (`src/10-Modull/WebSocketBasicsLesson.jsx`, 20 ekran): Maydon Jamoa, «8 / 10», yopiq va ochiq yo'l, konvert (`oyin-ozgardi { oyinId, sabab }`), token bilan ulanish, tinglovchi, uch belgi, real vaqt sxemasi; repo `maydon-jamoa` `m12-dars-02` (hodisa yo'q) va `m12-dars-03` (hodisa bor). |
| Kursdagi o'rni | CI/CD-2 → **shu** → WebSocket-2: ulanish uzilsa (M31: raqam yozilmaydi). |
| Til | M9 + M32. Atamalar inglizcha: WebSocket, socket.io, gateway, event (hodisa), listener (tinglovchi), handshake, polling, transport, ping. «Doimiy ulanish», «so'rov–javob», «konvert» — o'zbekcha. Ovozda `order-changed` — «order changed». |
| Misol-ip | **OrderBotNest** `ws1-done`: do'kon admini kompyuterda `/admin` panelini ochib qo'ygan; mijoz Bobur botda Klaviatura buyuradi → panelda yangi qator; admin Jasur botda «Tasdiqlash» bosadi → panelda holat. Hodisa `order-changed { orderId, reason: 'new' | 'status' }`. |
| AI | 2 tajriba (ruxsat 04.11): bitta oddiy prompt (`ws1v2-ai/p1-prompt.txt`), `ai1` kuchli, `ai2` kuchsizroq; ikkalasi o'zi bazasiz sinagan, haqiqiy PostgreSQL bilan biz sinadik (`ws1v2-ai/*/0N`). |
| Haqiqiylik (M10) | 04.11: Node 24.18 · NestJS 11.2.8 · `@nestjs/websockets` 11.2.8 · socket.io 4.8.4 · PostgreSQL 18 (vaqtinchalik klaster) · headless Chrome. Telegram serveri o'rniga smoke'dagi usul (`bot.handleUpdate` — bot kodi haqiqiy). Telefonda Telegram bilan — mentor o'zi (amaliyot). |
| Hajm | **25 ekran** · 6 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · ovoz ≈ 25 daq · amaliyot ≈ 50–65 daq · jami ≈ 1 s 15 – 1 s 30 daq |
| Me'yor | CI/CD-2 v2 bilan bir xil (≤ 5 segment, ≤ 60 so'z, M17, «Xulosa», kalit 8–14 so'z, M32, M33, M42, M43, M46, M47, M48) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **so'rov–javob** — server faqat so'ralganda javob beradi. Panel `GET /admin/orders` ni so'ramaguncha yangi buyurtmani bilmaydi (02: 1-so'rov `[]`, Bobur buyurtma berdi, 2-so'rov — #1).
- **doimiy ulanish** — panel bir marta ulanadi, ulanish ochiq turadi; server istagan payt xabar yuboradi. socket.io avval `polling` (oddiy HTTP so'rovlar), keyin `websocket` ga o'tadi (04).
- **gateway** — serverda ulanishlarni qabul qiladigan klass (`@WebSocketGateway`), HTTP bilan bitta portda. `handleConnection` — har yangi ulanishda, `handleDisconnect` — uzilganda.
- **token ulanishda** — panel `io({ auth: { token } })` bilan ulanadi; server `client.handshake.auth.token` ni tekshiradi; noto'g'ri bo'lsa `client.disconnect()` va `return`. Klient bir lahza `connect` ko'radi, keyin `io server disconnect`, `active=false` — qayta urinmaydi (03).
- **hodisa (event)** — `order-changed { orderId, reason }`: nima o'zgargani, ro'yxat emas. Panel hodisadan keyin `GET /admin/orders` ni qayta so'raydi («konvert» qoidasi — m10-02). Hodisa **tranzaksiya tugagach** yuboriladi: panel so'raganda buyurtma bazada bor.
- **tinglovchi (listener)** — `ulanish.on('order-changed', () => yukla())`. Qavssiz `() => yukla` — funksiya chaqirilmaydi, ro'yxat yangilanmaydi (11).
- **uch holat** — **ulangan** · **ulanmoqda** (`active=true`: server javob bermayapti, klient o'zi qayta urinadi — `transport close`, `xhr poll error`, `ping timeout`) · **ulanmagan** (`active=false`: server yopdi — token).
- **ping** — socket.io har 25 s ping yuboradi, 20 s javob kutadi: javob yo'q bo'lsa ~45 s da `ping timeout` (06).

**Darsning ipi:** so'rov–javob → doimiy ulanish va socket.io → gateway va token → `return` buzilishi → hodisa tranzaksiyadan keyin, konvert → panel kodi va tinglovchi → uch holat (server o'chdi, muzlash) → AI panellari haqiqiy bazada → sinfga tayyorgarlik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | So'rov–javob: panel so'ramaguncha bilmaydi | Lesson | 1 · umumiy tushuncha |
| 3 | Doimiy ulanish va socket.io: polling → websocket | Lesson | 1 |
| 4 | Gateway: token ulanish ochilayotganda tekshiriladi | Lesson | 2 · gateway va token |
| 5 | Tekshiruv 1 — tokensiz klient nima ko'radi | MCRetry | 2 |
| 6 | Buzamiz: `return` unutildi — log yolg'on gapiradi | Lesson | 2 · buzamiz |
| 7 | Amaliyot 1 — server va terminal klienti | Practice | 2 |
| 8 | Hodisa: tranzaksiyadan keyin, ichida faqat «nima o'zgardi» | Lesson | 3 · hodisa va panel |
| 9 | Panel sahifasi: ulanish, tinglovchi, qayta so'rash | Lesson | 3 |
| 10 | Haqiqiy oqim: bot → server → panel | Lesson | 3 |
| 11 | Tekshiruv 2 — qaysi satr ro'yxatni yangilamaydi | LineCheck | 3 |
| 12 | Amaliyot 2 — brauzerda panel va bot | Practice | 3 |
| 13 | Uch holat: ulangan, ulanmoqda, ulanmagan | Lesson | 4 · ulanish holati |
| 14 | Server o'chdi va qayta yondi | Lesson | 4 |
| 15 | «Muzlash»: 45 soniya javobsiz | Lesson | 4 · ichida |
| 16 | Tekshiruv 3 — server javob bermasa | MCRetry | 4 |
| 17 | AI panel yozdi — ikki to'plam | Lesson | 5 · AI |
| 18 | AI panellari haqiqiy bazada: ishladi, lekin… | Lesson | 5 · ichida |
| 19 | Tekshiruv 4 — token URL'da | MCRetry | 5 |
| 20 | Amaliyot 3 — AI'ga aniq prompt, to'rt savol | Practice | 5 |
| 21 | m10-02 xaritasi: Maydon Jamoa | Lesson | 6 · sinfga tayyorgarlik |
| 22 | O'quvchi so'zlari va real vaqt sxemasi | Lesson | 6 |
| 23 | Sinfdagi holatlar va o'quvchi savollari | Lesson | 6 |
| 24 | O'z-sinov — 8 savol | Screen27 | — |
| 25 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code `OrderBotNest` (Explorer `compact()`: `src/api/live/{live.gateway.ts, admin.controller.ts, admin-token.ts}`, `public/admin.html`, `src/api/telegram/telegram.service.ts`), terminal «VS Code terminali · server» va «VS Code terminali · npm run live» yonma-yon, **panel oynasi** (brauzer — `PanelView`, haqiqiy `10-panel.txt` va `GET /admin/orders` javobidan; skrinshot emas: maket, har qator haqiqiy), **oqim chizmasi** (bot → tranzaksiya → `order-changed` → panel → `GET`), uch holat kartasi, AI javobi kartasi.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · WebSocket` · Sarlavha: **Do'kon admini kompyuterda panelni ochib qo'yadi: bot buyurtma olsa, yangi qator sahifani yangilamasdan o'zi paydo bo'ladi — bugun shuni qilamiz**
- Sahna: chapda reja (6 bosqich); o'ngda panel oynasi — dars oxiridagi natija (`10-panel.txt` 10b): belgi «Ulangan», eng yuqorida yangi (sariq) qator `3 · Bobur · Klaviatura × 1 · 120 000 so'm · Yangi`.
- Reja: 01 Umumiy tushuncha · 02 Gateway va token · 03 Hodisa va panel · 04 Ulanish holati · 05 AI · 06 Sinfga tayyorgarlik
1. **Bot buyurtma oladi — ==panel sahifani yangilamasdan o'zi ko'rsatadi==**
   Ovoz: «Assalomu alaykum. OrderBotNest'da hozir admin yangi buyurtmani faqat Telegram xabaridan biladi. Bugun do'kon uchun jonli panel qilamiz: kompyuterda ochiq turadigan sahifa. Mijoz botda buyurtma bersa, panelda yangi qator o'zi paydo bo'ladi. Ekranda dars oxiridagi natija, haqiqiy brauzerdan.»
2. **Avval ==umumiy tushuncha==: so'rov–javob, doimiy ulanish va socket.io**
   Ovoz: «Avval umumiy tushuncha: oddiy so'rov–javob bilan panel nega o'zi yangilanmaydi, doimiy ulanish nima va socket.io nima qiladi. Keyin serverda gateway yozamiz: ulanishlarni qabul qiladigan klass, token bilan.» · reja 01–02
3. **Keyin ==hodisa, panel sahifasi va uch ulanish holati==; oxirida AI va sinf**
   Ovoz: «Uchinchi bosqichda hodisani yuboramiz va panel sahifasini o'qiymiz. To'rtinchisida server o'chsa yoki javob bermasa panel nima ko'rsatishini ko'ramiz. Beshinchisida ikki AI yozgan panelni haqiqiy bazada sinaymiz. Oxirida sinfga tayyorgarlik.» · reja 03–06
4. **Olti bosqich, uchta amaliyot; kerak: ==TgPg darsidagi bot token va Postgres==**
   Ovoz: «Dars olti bosqich, uchta amaliyot. Telegraf darsida yaratgan bot tokeningiz va Postgres bazangiz kerak bo'ladi: panelni o'z telefoningizdan buyurtma berib sinaysiz. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz.» · reja 06
- Manba: `ws1v2-out/10-panel.txt` (10b), `10b-yangi-buyurtma.png` (tekshiruv uchun).

## 2 · So'rov–javob: panel so'ramaguncha bilmaydi  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **Oddiy HTTP'da server faqat so'ralganda javob beradi: panel so'ramasa, Bobur bergan buyurtmani bilmaydi — ekran eski qoladi**
- Sahna: terminal `02`: `$ curl -s …/admin/orders -H 'Authorization: Bearer …'   # 1-so'rov` → `[]`; server logi `— Bobur botda buyurtma beradi` · `bot → …: Buyurtma #1 qabul qilindi!`; `# 2-so'rov` → `[{"id":1,…"customer":"Bobur"…}]`; 3-segmentda ikki karta: «So'rov–javob» (panel → «bormi?» → server → javob; har necha soniyada qayta so'rash — polling) ↔ «Doimiy ulanish» (panel bir marta ulanadi → server «o'zgardi» deydi); 4-segmentda `tokensiz → 401`.
1. **Panel ==`GET /admin/orders` so'radi — bo'sh==; keyin Bobur botda buyurtma berdi**
   Ovoz: «Bizda oddiy yo'l bor: get admin orders, token bilan. Panel so'radi, javob bo'sh ro'yxat. Shu paytda mijoz Bobur botda buyurtma berdi: bot buyurtma bir qabul qilindi dedi. Panel buni biladimi? Yo'q, u faqat so'raganda javob oladi.» · 1-so'rov
2. **Ikkinchi so'rovda ==buyurtma bor== — lekin panel o'zi so'ramaguncha ekran eski edi**
   Ovoz: «Ikkinchi so'rov: endi ro'yxatda birinchi buyurtma, Bobur, Klaviatura. Ma'lumot bazada birinchi so'rovdan keyin darhol paydo bo'lgan, lekin panel so'ramaguncha ekran eski turdi. So'rov–javobda server o'zi gapira olmaydi.» · 2-so'rov
3. **Ikki yo'l: ==har necha soniyada qayta so'rash (polling)== yoki doimiy ulanish**
   Ovoz: «Ikki yo'l bor. Birinchisi: panel har uch soniyada qayta so'raydi, buni polling deyishadi. Oddiy, lekin ko'pincha javob o'zgarmagan bo'ladi va kechikish qoladi. Ikkinchisi: panel bir marta ulanadi, ulanish ochiq turadi, server o'zgarish bo'lganda o'zi xabar beradi.» · ikki karta
4. **Xulosa: so'rov–javobda ==server o'zi gapirmaydi==; jonli panel uchun doimiy ulanish kerak**
   Ovoz: «Xulosa: oddiy HTTP'da server faqat so'ralganda javob beradi, tokensiz so'rovga esa to'rt yuz bir. Panel o'zi yangilanishi uchun server o'zi gapira olishi kerak. Buning uchun doimiy ulanish, keyingi ekranda uning kutubxonasi.» · 401
- Manba: `ws1v2-out/02-sorov-javob.txt` (aynan).

## 3 · Doimiy ulanish va socket.io: polling → websocket  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **socket.io — doimiy ulanish kutubxonasi: avval oddiy HTTP so'rovlar (polling), keyin WebSocket'ga o'tadi; server va klient istalgan payt hodisa yuboradi**
- Sahna: terminal «npm run live» `04` (boshi): `ulanmoqda… http://localhost:3100` · `connect · ulangan · transport: polling` · `transport: websocket`; 2-segmentda server logi 01: `Mapped {/admin, GET}` · `Mapped {/admin/orders, GET}` · `Server 3100-portda ishlayapti` — bitta port; 3-segmentda hodisa kartasi: `order-changed {"orderId":2,"reason":"new"}` (04); 4-segmentda `ws1-start` (08): `connect_error: xhr poll error` ×3, `curl /admin` → `Cannot GET /admin`.
1. **socket.io klienti ulanadi: ==avval `polling`, bir lahzada `websocket`==**
   Ovoz: «OrderBotNest'da buning uchun socket.io ishlatamiz. Terminal klientini ishga tushirdik: npm run live. Avval ulanmoqda, keyin connect, transport polling: oddiy HTTP so'rovlar. Bir lahzadan keyin transport websocket: doimiy ulanishga o'tdi. Agar WebSocket yopiq tarmoq bo'lsa, polling'da qoladi va baribir ishlaydi.» · 04
2. **Bitta port: ==HTTP yo'llari ham, WebSocket ham `3100`da== — alohida server yo'q**
   Ovoz: «Server logiga qarang: admin va admin orders yo'llari, va server uch ming bir yuz portida. WebSocket ham shu portda, alohida server kerak emas. Nest'da buni gateway qiladi, ikkinchi bosqichda yozamiz.» · 01
3. **Hodisa — ==nomi va kichik ma'lumot==: `order-changed`, qaysi buyurtma va nega**
   Ovoz: «Doimiy ulanishda xabar hodisa deyiladi: nomi va kichik ma'lumot. Bizda bitta hodisa: order changed, ichida buyurtma raqami va sabab: yangi yoki holat. Panel uni tinglaydi va ro'yxatni qayta so'raydi.» · hodisa kartasi
4. **Xulosa: serverda ==gateway bo'lmasa, klient cheksiz `xhr poll error`== — WebSocket o'zi paydo bo'lmaydi**
   Ovoz: «Xulosa: socket.io ikki tomon: serverda gateway, klientda kutubxona. Darsning boshlang'ich tegida gateway yo'q: klient cheksiz xhr poll error, admin sahifasi to'rt yuz to'rt. Endi gateway'ni yozamiz.» · 08
- Manba: `ws1v2-out/04-token-hodisa.txt`, `01-server.txt`, `08-ws1-start-gateway-yoq.txt` (aynan).

---

## 4 · Gateway: token ulanish ochilayotganda tekshiriladi  ← `Lesson`
- Kicker: `2-bosqich · gateway va token` · Sarlavha: **`LiveGateway`: har yangi ulanishda `handleConnection` — tokenni tekshiradi; noto'g'ri bo'lsa `disconnect()` va `return`; to'g'ri bo'lsa log yozadi**
- Sahna: VS Code — `src/api/live/live.gateway.ts` (`ws1-done`, Prettier) bo'laklab: 20–24 (`@WebSocketGateway()` · `export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect` · `@WebSocketServer() server?: Server;`) · 26–33 (`handleConnection(client: Socket)` · `if (!isAdminToken(client.handshake.auth?.token)) { client.disconnect(); return; }` · `client.data.admin = true;` · `this.log.log(\`panel ulandi: …\`)`) · 40–44 (`orderChanged(orderId, reason)` · `this.server?.emit('order-changed', { orderId, reason });`); 3-segmentda `admin-token.ts` 5–11 (`isAdminToken` — bo'sh token ham rad); 4-segmentda `live.module.ts` + `telegram.module.ts` import.
1. **`src/api/live/live.gateway.ts`: ==`@WebSocketGateway()` — HTTP bilan bitta portda==**
   Ovoz: «OrderBotNest papkangizda src, api, live papkasini oching, live gateway ts fayli. Klass ustida WebSocket gateway dekoratori: Nest bu klassni ulanishlarni qabul qiladigan joy qiladi, HTTP bilan bitta portda. Ichida WebSocket server maydoni: hamma ulangan panellar shu orqali.» · 20–24
2. **`handleConnection`: ==`handshake.auth.token` noto'g'ri — `disconnect()` va `return`==**
   Ovoz: «Handle connection har yangi ulanishda chaqiriladi. Birinchi ish: handshake auth token, panel ulanayotganda yuborgan token. Noto'g'ri bo'lsa client disconnect, ya'ni server ulanishni yopadi, va return. To'g'ri bo'lsa client data admin true va log: panel ulandi.» · 26–33
3. **Token qoidasi ==bitta joyda: `isAdminToken`== — `.env` dagi `ADMIN_PANEL_TOKEN`, bo'sh ham rad**
   Ovoz: «Tokenni tekshirish alohida faylda: admin token ts, is admin token funksiyasi. U env'dagi admin panel tokeni bilan solishtiradi, bo'sh tokenni ham rad etadi. Bir qoida ikki joyda ishlaydi: WebSocket ulanishida va get admin orders so'rovida.» · admin-token.ts
4. **Xulosa: token ==ulanish ochilayotganda== tekshiriladi; `orderChanged` — hamma ulangan panelga hodisa**
   Ovoz: «Xulosa: token bir marta, ulanish ochilayotganda tekshiriladi, keyingi hodisalarda qayta emas. Gateway'ning ikkinchi ishi order changed funksiyasi: server emit, hamma ulangan panelga hodisa. Live module'ni telegram module'ga ulaymiz, bot shu funksiyani chaqiradi.» · 40–44
- Manba: `order-bot` `ws1-done` `src/api/live/live.gateway.ts`, `admin-token.ts`, `live.module.ts`, `telegram.module.ts` (haqiqiy satrlar).

## 5 · Tekshiruv 1 — tokensiz klient nima ko'radi  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **`npm run live -- ""` — tokensiz ulanamiz. Gateway `disconnect()` qiladi. Terminal klienti nima yozadi?**
- Material (`above`, M42): `live.gateway.ts` 26–30 (`if (!isAdminToken(…)) { client.disconnect(); return; }`); ostida `$ npm run live -- ""`.
- Ovoz: «Gateway'ni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Terminal klientini tokensiz ishga tushirdik. Gateway tokenni rad etadi va disconnect qiladi. Klient terminalida nima chiqadi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Faqat `connect_error` — ulanish umuman ochilmaydi, klient qayta urinaveradi · 2 Bir lahza `connect`, keyin `io server disconnect` — klient qayta urinmaydi · 3 `ulanmoqda` — klient har 3 soniyada token bilan qayta ulanishga urinadi · 4 `connect` va ulanish ochiq qoladi, faqat hodisalar kelmaydi
- To'g'ri (ovoz): «To'g'ri. Ulanish avval ochiladi, chunki token handle connection ichida, ulanish ochilgandan keyin tekshiriladi. Shuning uchun bir lahza connect, keyin io server disconnect, active false: server yopgan ulanishga klient o'zi qayta ulanmaydi. Demak, bu holatda panel belgisi ulanmagan, sabab token.» · qisqa: «Bir lahza `connect` → `io server disconnect`, `active=false` — server yopdi, klient urinmaydi.»
- Isbot (`after`): terminal `03`: `connect · ulangan · transport: websocket` · `disconnect: io server disconnect · active=false → ulanmagan`.
- Demak: «`io server disconnect` — server yopdi (token); klient qayta urinmaydi — «Ulanmagan».»
- Xato izohlari: 1 — «Ulanish ochiladi: token ochilgandan keyin `handleConnection` da tekshiriladi.» · 3 — «Server yopgan ulanishga socket.io o'zi qayta ulanmaydi — `active=false`.» · 4 — «`disconnect()` ulanishni yopadi — ochiq qolmaydi.»
- Maslahat: «Token qachon tekshiriladi — ulanish ochilishidan oldinmi, keyinmi? Kim yopdi — server yoki tarmoq?»
- Manba: `ws1v2-out/03-tokensiz-notogri.txt`.

## 6 · Buzamiz: `return` unutildi — log yolg'on gapiradi  ← `Lesson`
- Kicker: `2-bosqich · buzamiz` · Sarlavha: **`disconnect()` dan keyin `return` yo'q: klient baribir yopildi, lekin server logi «panel ulandi» deb yozdi — log endi ishonchsiz**
- Sahna: yonma-yon (M47): chapda `live.gateway.ts` 26–33 `return;` satri o'chirilgan (qizil, M36) + terminal `07` klient: `connect` · `io server disconnect · active=false → ulanmagan`; o'ngda server logi `07`: `LOG [Live] panel ulandi: …` (qizil belgi); 3-segmentda to'g'ri holat (03): server logida `[Live]` satri yo'q; 4-segmentda sabab kartasi: `disconnect()` funksiyadan chiqmaydi → keyingi satrlar bajariladi → `client.data.admin = true`, log.
- F-1120-02 (M52): 0-band — mentor `client.disconnect();` dan keyingi `return;` ni o'zi bosadi → satr o'chadi. Kod ostida kichik rasm (M51): tokensiz klient → handleConnection → server logi «?» → «panel ulandi» (yolg'on); bo'laklar 1 (klient: io server disconnect) · 2 (server logi).
0. **Endi ==o'zingiz buzasiz==: kodda yonib turgan `return;` ustiga bosing**
   Ovoz: «Gateway to'g'ri ishlaydi: tokensiz klient yopiladi, logda hech narsa yo'q. Endi ataylab buzamiz. Buzishni o'zingiz qilasiz: live gateway ts faylida client disconnect'dan keyingi return satri yonib turibdi, ustiga bosing: satr o'chadi.»
   Bosish: «**live.gateway.ts**dagi **`return;`** ustiga bosing — `client.disconnect();` dan keyingi satr o'chadi.»
1. **Buzildi: ==`client.disconnect();` dan keyingi `return;` yo'q==**
   Ovoz: «Return satrini o'chirdingiz. Kichik o'zgarish, kod kompilyatsiya bo'ladi. Tokensiz klient bilan sinaymiz: npm run live, ikki qo'shtirnoq.» · 26–33
2. **Klient: ==o'sha natija — `io server disconnect`==; ulanish baribir yopildi**
   Ovoz: «Klient terminali o'sha natijani ko'rsatadi: bir lahza connect, keyin io server disconnect, ulanmagan. Disconnect ishladi, ulanish yopildi. Klient tomondan qaraganda hech narsa o'zgarmadi.» · klient
3. **Server logi: ==`panel ulandi`== — rad etilgan klient uchun; to'g'ri kodda bu satr yo'q**
   Ovoz: «Lekin server logiga qarang: Live, panel ulandi. Rad etilgan, tokensiz klient uchun. To'g'ri kodda, uchinchi tajribada, bu satr umuman yo'q edi. Endi log yolg'on gapiryapti: kim ulangani haqida unga ishonib bo'lmaydi.» · server logi
4. **Demak, sabab: ==`disconnect()` funksiyadan chiqmaydi== — keyingi satrlar baribir bajariladi**
   Ovoz: «Demak, sabab bitta: disconnect ulanishni yopadi, lekin funksiyadan chiqmaydi. Return bo'lmasa keyingi satrlar baribir bajariladi: admin belgisi qo'yiladi, log yoziladi. Keyinroq shu yerga xona yoki ruxsat qo'shilsa, rad etilgan klient ularni oladi. Return'ni tiklaymiz.» · sabab kartasi
- Manba: `ws1v2-out/07-return-yoq.txt`, `03-tokensiz-notogri.txt` (aynan).

## 7 · Amaliyot 1 — server va terminal klienti  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **`ws1-done` tegida serverni ishga tushiring, terminal klienti bilan token, noto'g'ri token va tokensiz ulaning, server logini o'qing** · `tableAt: 3`
1. **Endi siz: ==`ws1-done` tegi==, `.env` ga panel tokeni, server va klient**
   Ovoz: «Endi navbat sizga. OrderBotNest papkangizda ws1 done tegiga o'tasiz, env fayliga admin panel tokenini yozasiz, serverni va terminal klientini ishga tushirasiz. Ikkita terminal kerak: biri server, biri klient. O'n besh daqiqa ketadi.»
2. **1–2-qadam: ==teg, `npm install`, `.env`, `npm run start:dev`== — logda `/admin` yo'llari**
   Ovoz: «Birinchi qadamda git fetch va checkout, keyin npm install: yangi paketlar bor. Ikkinchisida env'ga admin panel token qatorini qo'shasiz, o'zingiz o'ylagan so'z, va npm run start dev. Logda admin yo'llari va server porti chiqishi kerak.»
3. **3–4-qadam: ==ikkinchi terminalda `npm run live`== — token, noto'g'ri, tokensiz; isbot — server logidagi satr**
   Ovoz: «Uchinchi qadamda ikkinchi terminalda npm run live: connect, websocket, server logida panel ulandi. To'rtinchisida noto'g'ri token va tokensiz: io server disconnect. Isbot maydoniga server logidagi panel ulandi satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz serverning doimiy ulanishini terminaldan tekshira olasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Teg | `git fetch --tags` · `git checkout ws1-done` · `npm install` | `added … packages` |
  | 2 | Server | `.env` ga `ADMIN_PANEL_TOKEN=<o'z so'zingiz>` · `npm run start:dev` | `Mapped {/admin/orders, GET}` · `Server 3000-portda ishlayapti` |
  | 3 | Klient | ikkinchi terminal: `npm run live` | `connect · ulangan` · `transport: websocket` · serverda `[Live] panel ulandi` |
  | 4 | Rad | `npm run live -- notogri` · `npm run live -- ""` | `disconnect: io server disconnect · active=false → ulanmagan` |
- Isbot: «Server logidagi «panel ulandi» satri» · placeholder: «masalan: LOG [Live] panel ulandi: -GKZthhgExVB6fHnAAAA» · KOD: `/panel ulandi/i` · xato: «Server terminalida `[Live] panel ulandi: …` satrini toping va nusxalang.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `connect_error: xhr poll error` cheksiz | server ishlamayapti yoki port boshqa — server terminalini tekshiring; boshqa port bo'lsa `LIVE_URL=http://localhost:<port> npm run live` |
  | to'g'ri token bilan ham `io server disconnect` | `.env` dagi token bilan klientdagi farq qiladi yoki server `.env` ni o'qimadi — serverni qayta ishga tushiring |
  | `Cannot find module 'socket.io-client'` | `npm install` qilinmagan (yangi paketlar) |
  | `BOT_TOKEN topilmadi` | `.env` da bot tokeni yo'q — Telegraf darsidagi tokenni yozing |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `ws1v2-out/01`, `03`, `04`, `08`.

---

## 8 · Hodisa: tranzaksiyadan keyin, ichida faqat «nima o'zgardi»  ← `Lesson`
- Kicker: `3-bosqich · hodisa va panel` · Sarlavha: **Bot buyurtmani bazaga yozib bo'lgach `orderChanged(order.id, 'new')`; admin holatni o'zgartirgach — `'status'`. Hodisada ro'yxat yo'q: panel qayta so'raydi**
- Sahna: VS Code — `telegram.service.ts` (`ws1-done`) `placeOrder` bo'lagi: `const order = await this.orders.place(…)` · `// tranzaksiya tugadi — buyurtma bazada; ochiq panellarga xabar beramiz` · `this.live.orderChanged(order.id, 'new');`; 2-segmentda status tugmasi bo'lagi: `const order = await this.orders.setStatus(…)` · `this.live.orderChanged(order.id, 'status');`; 3-segmentda oqim chizmasi: bot → `place()` tranzaksiya (COMMIT) → `order-changed {orderId, reason}` → panel → `GET /admin/orders` → bazadan ro'yxat; 4-segmentda `admin.controller.ts` `list()` (token → `recent(20)` → qisqa maydonlar).
1. **`telegram.service.ts`: ==`await this.orders.place(…)` tugagach== — `orderChanged(order.id, 'new')`**
   Ovoz: «Src, api, telegram papkasidagi telegram service ts faylini oching, place order funksiyasi. Avval await orders place: tranzaksiya, buyurtma bazaga yozildi. Faqat shundan keyin live order changed, buyurtma raqami va new. Await tufayli hodisa bazadagi buyurtmadan oldin ketmaydi.» · placeOrder
2. **Admin tugmasi: ==`setStatus` tugagach — `'status'`== — bot kodi o'zgarmadi, bitta satr qo'shildi**
   Ovoz: «Admin holat tugmasini bosganda ham shu qolip: await orders set status, keyin order changed, status sababi bilan. Bot kodining qolgan qismi o'zgarmadi, ikki joyga bittadan satr qo'shildi. Mijozga Telegram xabari avvalgidek boradi.» · status
3. **Hodisada ==faqat `orderId` va `reason`== — panel yangi ro'yxatni `GET /admin/orders` dan so'raydi**
   Ovoz: «Hodisa ichida nima bor? Faqat buyurtma raqami va sabab, ro'yxat ham, mijoz telefoni ham yo'q. Panel hodisani olgach get admin orders'ni qayta so'raydi, token bilan. Ma'lumotning manbai bitta: baza. O'quvchi darsida bu konvert deyiladi.» · oqim chizmasi
4. **Xulosa: hodisa ==«nimadir o'zgardi»== deydi; ma'lumot — token bilan, so'rovda**
   Ovoz: «Xulosa: hodisa tranzaksiya tugagach yuboriladi va faqat nimadir o'zgardi deydi. Ma'lumot token bilan himoyalangan so'rovda keladi. Admin controller'da list funksiyasi: token tekshiriladi, oxirgi yigirma buyurtma, faqat kerakli maydonlar. Endi panel sahifasini ochamiz.» · admin.controller.ts
- Manba: `order-bot` `ws1-done` `telegram.service.ts` (placeOrder, status action), `admin.controller.ts`; `ws1v2-out/04` (server logi: `Buyurtma #2 qabul qilindi` → klientda `order-changed` 3 s da).

## 9 · Panel sahifasi: ulanish, tinglovchi, qayta so'rash  ← `Lesson`
- Kicker: `3-bosqich · hodisa va panel` · Sarlavha: **`public/admin.html`: socket.io klienti serverning o'zidan; `io({ auth: { token } })` — ulanish; uch holat; `order-changed` kelsa `yukla()`**
- Sahna: VS Code — `public/admin.html` (`ws1-done`) bo'laklab: `<script src="/socket.io/socket.io.js"></script>` · `yukla()` (`fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } })`) · `ulan()` (`ulanish = io({ auth: { token } });` · `ulanish.on('connect', () => holatQoy('ulangan'));` · `ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));` · `ulanish.on('order-changed', () => yukla());`); 4-segmentda `esc()` va `${esc(o.customer)}`.
1. **`public/admin.html`: ==socket.io klienti `/socket.io/socket.io.js` — serverning o'zi beradi==**
   Ovoz: «Public papkasidagi admin html faylini oching. Oddiy HTML sahifa, kutubxona alohida o'rnatilmaydi: socket io js faylini serverning o'zi beradi, shu manzildan. Sahifa get admin, ya'ni admin controller'ning page funksiyasi orqali ochiladi.» · script
2. **`ulan()`: ==`io({ auth: { token } })`== — token manzilda emas, ulanish ma'lumotida**
   Ovoz: «Ulan funksiyasi: io, auth, token. Token manzil satriga yozilmaydi, ulanish ochilayotgan paytdagi ma'lumotda ketadi: gateway uni handshake auth'dan o'qiydi. Connect bo'lsa belgi ulangan, disconnect bo'lsa active'ga qarab ulanmoqda yoki ulanmagan.» · ulan()
3. **Tinglovchi: ==`ulanish.on('order-changed', () => yukla())`== — hodisadan keyin qayta so'rash**
   Ovoz: «Eng muhim satr: ulanish on, order changed, yukla. Hodisa kelganda yukla funksiyasi chaqiriladi: get admin orders, yangi ro'yxat. Yangi qator sariq bo'ladi: id oldingi eng kattasidan katta bo'lsa. Ro'yxat har doim bazadan, hodisadan emas.» · tinglovchi
4. **Xulosa: mijoz ismi Telegram'dan keladi — ==`esc()` bilan matn sifatida== qo'yiladi**
   Ovoz: «Xulosa: panel uch ish qiladi: ulanadi, tinglaydi, qayta so'raydi. Va bitta xavfsizlik qoidasi: mijoz ismi Telegram'dan keladi, ichida HTML bo'lishi mumkin. Esc funksiyasi uni matnga aylantiradi, sahifada kod bo'lib ishlamaydi. Endi haqiqiy oqimni ko'ramiz.» · esc
- Manba: `order-bot` `ws1-done` `public/admin.html` (haqiqiy satrlar).

## 10 · Haqiqiy oqim: bot → server → panel  ← `Lesson`
- Kicker: `3-bosqich · hodisa va panel` · Sarlavha: **Panel ochiq; Bobur botda buyuradi — yangi qator o'zi chiqadi; admin tasdiqlaydi — holat o'zi o'zgaradi; terminal klienti ham ikkala hodisani ko'radi**
- Sahna: yonma-yon: chapda panel oynasi (`10-panel.txt` 10a → 10b → 10c: belgi «Ulangan»; #3 sariq «Yangi» → «Tasdiqlandi»); o'ngda terminal «npm run live» `04` (`order-changed {"orderId":2,"reason":"new"}` · `… "status"`) va server logi (`[Live] panel ulandi` · `— Bobur botda buyurtma beradi` · `Buyurtma #2 qabul qilindi!` · `— admin (Jasur) #2 ni tasdiqlaydi` · `#2 → ✅ Tasdiqlangan`); 4-segmentda GitHub CI kartasi (`12`): `smoke` job → `✓ yangi buyurtma → order-changed …` · `NATIJA: 9/9 ✓`.
1. **Panel ochiq, belgi ==«Ulangan»==; ro'yxatda oldingi buyurtmalar**
   Ovoz: «Endi hammasini birga ko'ramiz. Brauzerda admin sahifasi, token kiritildi, belgi ulangan, ro'yxatda oldingi buyurtmalar. Bu haqiqiy brauzer, haqiqiy server va baza. Telegram o'rniga smoke'dagi usul: bot kodi haqiqiy, xabar ichkaridan beriladi.» · 10a
2. **Bobur buyurtma berdi — ==yangi qator sariq, sahifa yangilanmadi==**
   Ovoz: «Bobur botda Klaviatura buyurdi. Panelda eng yuqorida yangi qator, sariq rangda: yangi. Sahifa qayta ochilmadi, hech kim tugma bosmadi. Server hodisa yubordi, panel ro'yxatni qayta so'radi.» · 10b
3. **Admin tasdiqladi — ==holat «Tasdiqlandi»==; terminal klienti ham ikki hodisani ko'rdi**
   Ovoz: «Admin Jasur botda tasdiqlash tugmasini bosdi. Panelda shu qatorning holati tasdiqlandi bo'ldi. O'ngda terminal klienti: ikkita order changed, birinchisi new, ikkinchisi status. Server logida esa bot xabarlari va panel ulandi satri.» · 10c + 04
4. **Xulosa: bu oqim ==lentada ham tekshiriladi== — smoke `live`, GitHub'da 9/9**
   Ovoz: «Xulosa: bot, tranzaksiya, hodisa, panel, qayta so'rash. Shu oqim smoke'ga ham qo'shildi: npm run smoke live. CI/CD darsidagi lentada smoke job Postgres bilan uni har push'da yurgizadi: GitHub'da to'qqizdan to'qqiz. Endi bitta xatoni o'zingiz topasiz.» · CI
- Rasm (F-1120-02, M51, 21.11): xulosada lenta logi ostida darsning rasmi — bot → server → panel (Admin panel: LiveGateway ✓ · order-changed ✓, «Ulangan»), yakundagi rasm bilan bir xil.
- Manba: `ws1v2-out/10-panel.txt`, `10a/b/c-*.png`, `04-token-hodisa.txt`, `12-ci-github.txt` (aynan).

## 11 · Tekshiruv 2 — qaysi satr ro'yxatni yangilamaydi  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Bu panelda belgi «Ulangan», terminal klienti `order-changed` ni oladi, lekin brauzerda yangi qator chiqmaydi. Sababchi satrni toping**
- Shart (`task`): «Qoida: hodisa kelganda ro'yxatni qayta so'raydigan funksiya **chaqirilishi** kerak. Bu bo'lakda bitta satr funksiyani chaqirmaydi, faqat qaytaradi. **O'sha satrni bosing.**»
- Ovoz (`q`): «Panel kodini ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu panelda belgi ulangan, terminal klienti hodisani oladi, lekin brauzerda yangi qator chiqmaydi. Bo'lakda bitta satr funksiyani chaqirmaydi, faqat qaytaradi. O'sha satrni bosing.»
- Fayl: `public/admin.html` `ulan()` bo'lagi (`11b` dagi buzilgan nusxa, 7 satr): `function ulan() {` · `if (ulanish) ulanish.close();` · `ulanish = io({ auth: { token } });` · `holatQoy('ulanmoqda');` · `ulanish.on('connect', () => holatQoy('ulangan'));` · `ulanish.on('disconnect', …);` · **`ulanish.on('order-changed', () => yukla);` ← xato satr** → `target` = shu satr (✅ KOD).
- Tuzatilgan (`fixed`): `() => yukla` → `() => yukla()`; `fixedExtra`: `11b` brauzer: «15 s gacha kutildi — ro'yxat O'ZGARMADI» · o'sha paytda terminal klienti `order-changed {"orderId":2,"reason":"new"}` va `"status"` — va `11a` (to'g'ri panel): «ro'yxat O'ZGARDI» (bo'sh → #1).
- To'g'ri (ovoz, `ok`): «To'g'ri. Strelka funksiya yukla'ni qaytaradi, lekin chaqirmaydi: qavs yo'q. Hodisa keladi, tinglovchi ishlaydi, get so'rovi ketmaydi, ro'yxat eski qoladi. Brauzerda o'n besh soniya kutdik, ro'yxat o'zgarmadi, terminal klienti esa ikkala hodisani ko'rdi. Demak, hodisa kelsa-yu ekran o'zgarmasa, tinglovchi ichini tekshiring.»
- Qisqa (`okShort`): «`() => yukla` — funksiya qaytariladi, chaqirilmaydi. Hodisa keladi, `GET` ketmaydi.»
- Maslahat (`hint`): «Qaysi satrda funksiya nomidan keyin qavs yo'q?»
- Manba: `ws1v2-out/11a-panel-togri.txt`, `11b-panel-qavssiz.txt` (brauzer + klient — aynan).

## 12 · Amaliyot 2 — brauzerda panel va bot  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **Brauzerda `/admin` ni oching, telefondan botda buyurtma bering — panel o'zi yangilanadimi; keyin `/orders` dan tasdiqlang** · `tableAt: 3`
1. **Endi siz: ==brauzerda panel, telefonda bot== — haqiqiy Telegram bilan**
   Ovoz: «Endi navbat sizga. Server ishlab turibdi. Brauzerda admin sahifasini ochasiz, telefoningizda botga buyurtma berasiz va panelning o'zi yangilanishini ko'rasiz. Yigirma daqiqa ketadi.»
2. **1–2-qadam: ==`localhost:3000/admin`, token== — belgi «Ulangan»; botda buyurtma — yangi qator**
   Ovoz: «Birinchi qadamda brauzerda localhost uch ming admin, tokenni kiritasiz: belgi ulangan, ro'yxat chiqadi. Ikkinchisida telefoningizdan botga start, katalog, mahsulot va buyurtma. Panelda yangi qator sariq bo'lib chiqishi kerak.»
3. **3–4-qadam: ==`/orders` dan tasdiqlang== — holat o'zgaradi; `npm run smoke -- live`; isbot — smoke natijasi**
   Ovoz: «Uchinchi qadamda botda orders va tasdiqlash: paneldagi holat o'zgaradi. To'rtinchisida npm run smoke live: Telegram'siz o'sha oqim, to'rt band. Isbot maydoniga smoke'ning natija satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz botingizga jonli sayt sahifasini ulagansiz va uni o'zingiz sinagansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Panel | brauzer: `http://localhost:3000/admin` → token → «Kirish» | belgi «Ulangan», ro'yxat |
  | 2 | Buyurtma | telefon: botga `/start` → `/catalog` → mahsulot → `/cart` → «✅ Buyurtma berish» | panelda yangi sariq qator |
  | 3 | Tasdiq | botda `/orders` → «✅ Tasdiqlash» (`ADMIN_TELEGRAM_IDS` da o'z id'ingiz) | panelda «Tasdiqlandi» |
  | 4 | Smoke | `npm run smoke -- live` | `NATIJA: 4/4 ✓` |
- Isbot: «`npm run smoke -- live` natija satri» · placeholder: «masalan: NATIJA: 4/4 ✓» · KOD: `/NATIJA:\s*4\/4/` · xato: «`npm run smoke -- live` oxiridagi `NATIJA: …` satrini qo'ying — to'rt band.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Panelda «Token noto'g'ri» | kiritgan so'z `.env` dagi `ADMIN_PANEL_TOKEN` bilan bir xil emas |
  | Belgi «Ulanmoqda…» o'zgarmaydi | server ishlamayapti yoki boshqa portda — sahifani o'sha portdan oching |
  | Buyurtma Telegram'da bor, panelda yangi qator yo'q | sahifa eski (`ws1-done` dan oldingi) — `git checkout ws1-done`, server qayta; konsolda xato bormi (F12) |
  | `/orders` — «Bu buyruq faqat admin uchun» | `.env` dagi `ADMIN_TELEGRAM_IDS` da o'z Telegram id'ingiz yo'q |
  | smoke: `baza ulanmagan — live faqat PostgreSQL bilan` | `.env` da `DATABASE_URL` yo'q |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `ws1v2-out/10-panel.txt`; smoke `live` (4 band, 12-ci-github.txt).

---

## 13 · Uch holat: ulangan, ulanmoqda, ulanmagan  ← `Lesson`
- Kicker: `4-bosqich · ulanish holati` · Sarlavha: **Panel belgisi uch holatda: hodisalar keladi · server javob bermayapti, klient o'zi urinmoqda · server yopdi, klient urinmaydi — farqni `active` beradi**
- Sahna: uch karta galma-gal: «Ulangan» (yashil) — `connect` · hodisalar keladi (04) · «Ulanmoqda…» (sariq) — `active=true`: `transport close`, `xhr poll error`, `ping timeout` (05, 06) · «Ulanmagan» (qizil) — `active=false`: `io server disconnect` (03); 4-segmentda `admin.html` 2 satr: `ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));` + panel 10d (server o'chdi: «Ulanmoqda…», ro'yxat ekranda qoladi) va 10e («Ulanmagan», «Token noto'g'ri»).
1. **«Ulangan» — ==ulanish ochiq, hodisalar keladi==; ro'yxat yangi**
   Ovoz: «Paneldagi belgining uch holati bor. Birinchisi ulangan: ulanish ochiq, hodisalar keladi, ro'yxat yangi. Admin ekranga qarab ishonsa bo'ladi.» · 1-karta
2. **«Ulanmoqda…» — ==`active=true`==: server javob bermayapti, klient o'zi qayta urinmoqda**
   Ovoz: «Ikkinchisi ulanmoqda. Ulanish uzildi, lekin socket.io o'zi qayta urinmoqda: active true. Sabab server o'chgani, internet uzilgani yoki server javob bermayotgani. Ro'yxat ekranda qoladi, lekin eskirgan bo'lishi mumkin.» · 2-karta
3. **«Ulanmagan» — ==`active=false`==: server ulanishni yopdi (token), klient urinmaydi**
   Ovoz: «Uchinchisi ulanmagan: active false. Server ulanishni o'zi yopgan, bizda token noto'g'ri bo'lganda. Klient qayta urinmaydi, foydalanuvchi tokenni tuzatishi kerak. Panel buni token noto'g'ri deb ham yozadi.» · 3-karta
4. **Xulosa: holatni ==`disconnect` va `active`== beradi; panelda bir satr**
   Ovoz: «Xulosa: uch holatni ikki narsa ajratadi: uzilish sababi va active. Panelda bu bitta satr: disconnect bo'lsa, active bo'lsa ulanmoqda, bo'lmasa ulanmagan. Endi server o'chib-yonganini haqiqiy terminalda ko'ramiz.» · admin.html
- Manba: `ws1v2-out/03`, `04`, `05`, `06`, `10-panel.txt` (10d, 10e).

## 14 · Server o'chdi va qayta yondi  ← `Lesson`
- Kicker: `4-bosqich · ulanish holati` · Sarlavha: **Server to'xtadi: `transport close` → klient har bir necha soniyada `xhr poll error`; server yondi — klient o'zi ulandi, hech kim hech narsa bosmadi**
- Sahna: terminal «npm run live» `05` galma-gal: `connect · ulangan` · `transport: websocket` → `— server to'xtatildi (Ctrl+C)` · `disconnect: transport close · active=true → ulanmoqda` · `connect_error: xhr poll error` ×3 (oraliqlar) → `— server qayta ishga tushirildi` · `connect · ulangan · transport: polling` · `transport: websocket`; 4-segmentda panel 10d («Ulanmoqda…», ro'yxat qolgan) + savol kartasi: «uzilgan paytdagi buyurtma?» → WebSocket-2.
1. **Server to'xtadi: ==`transport close`, `active=true`== — belgi «Ulanmoqda…»**
   Ovoz: «Klient ulangan turibdi. Server terminalida Ctrl C, server to'xtadi. Klient darhol: disconnect, transport close, active true, ulanmoqda. Ulanishni tarmoq uzdi, server emas, shuning uchun klient taslim bo'lmaydi.» · uzilish
2. **Qayta urinish: ==har bir necha soniyada `xhr poll error`== — oraliq tobora uzayadi**
   Ovoz: «Keyin har bir necha soniyada connect error, xhr poll error: klient polling bilan urinadi, server yo'q. Vaqtlarga qarang: oraliq asta uzayadi, klient serverni bombardimon qilmaydi. Panelda shu vaqt ulanmoqda.» · urinishlar
3. **Server yondi — ==klient o'zi ulandi==: polling, keyin websocket**
   Ovoz: «Serverni qayta ishga tushirdik. Bir necha soniyadan keyin klient o'zi connect, ulangan, avval polling, keyin websocket. Hech kim sahifani yangilamadi, hech narsa bosmadi. Bu socket.io'ning tayyor xizmati.» · qayta ulanish
4. **Xulosa: ==qayta ulanish o'zi== bo'ladi; lekin uzilish paytidagi hodisa — keyingi darsda**
   Ovoz: «Xulosa: server o'chib-yonsa, panel o'zi qayta ulanadi. Lekin bir savol qoldi: server o'chiq paytida buyurtma tushsa, panel uni ko'radimi? Bu keyingi WebSocket darsining mavzusi, uzilishda nima yo'qoladi. Endi qiyinroq holat: server javob bermaydi, lekin uzilmaydi.» · savol
- Manba: `ws1v2-out/05-server-ochdi-yondi.txt`, `10-panel.txt` (10d) — aynan.

## 15 · «Muzlash»: 45 soniya javobsiz  ← `Lesson`
- Kicker: `4-bosqich · ichida` · Sarlavha: **Server jarayonini muzlatamiz: ulanish uzilmaydi, javob ham yo'q — klient 43 soniya «ulangan» deb turadi, keyin `ping timeout`; sabab — 25 + 20 soniya qoidasi**
- Sahna: yonma-yon (M47): chapda terminal `06`: `connect · ulangan` · `— server jarayoni muzlatildi (kill -STOP)` · … (javob yo'q) … · `disconnect: ping timeout · active=true → ulanmoqda` · `— server davom ettirildi (kill -CONT)` · `connect · ulangan`; o'ngda vaqt chizig'i: muzlatildi → +43 s `ping timeout` → davom → darhol ulandi; ping kartasi: server har 25 s `ping` → klient javob → 20 s javob yo'q → uziladi.
1. **Muzlatamiz: ==ulanish ochiq, lekin server javob bermaydi== — telefon uchish rejimiga o'xshash**
   Ovoz: «Endi qiyinroq holat. Server jarayonini muzlatamiz: kill minus STOP. Ulanish uzilmaydi, lekin server hech narsaga javob bermaydi. Hayotda bu telefon uchish rejimida, Wi-Fi o'chganda yoki server qotib qolganda bo'ladi.» · muzlatildi
2. **Klient ==43 soniya «ulangan»== deb turadi — hech narsa bilmaydi**
   Ovoz: «Klient terminaliga qarang: hech narsa yo'q. Qirq uch soniya davomida u o'zini ulangan deb hisoblaydi. Shu vaqt panel belgisi yashil, lekin hodisalar kelmaydi. Admin ekranga ishonadi, ekran esa eskirgan.» · jimlik
3. **Keyin ==`ping timeout`== — socket.io har 25 s ping yuboradi, 20 s javob kutadi**
   Ovoz: «Keyin disconnect, ping timeout, ulanmoqda. Socket.io qoidasi: server har yigirma besh soniyada ping yuboradi va yigirma soniya javob kutadi. Javob kelmasa, ulanish o'lik deb topiladi. Shuning uchun eng uzog'i qirq besh soniya. Server davom etgach, klient darhol ulandi.» · ping
4. **Demak, sabab: ==javob yo'qligi — uzilish emas==; ulanish o'lganini faqat ping aniqlaydi**
   Ovoz: «Demak, sabab bitta: tarmoq javob bermaganda hech kim ulanish uzilganini aytmaydi. Uni faqat ping aniqlaydi, qirq besh soniyagacha kechikish bilan. Sinfda o'quvchi uchish rejimida belgi o'zgarmadi desa, kuting deng. Endi tekshirib olaylik.» · sabab
- Manba: `ws1v2-out/06-muzlash-ping.txt` (aynan); socket.io standart `pingInterval: 25000`, `pingTimeout: 20000`.

## 16 · Tekshiruv 3 — server javob bermasa  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **Admin noutbukida Wi-Fi o'chdi: ulanish uzilmadi, lekin paket ham o'tmaydi. Panel belgisi qachon «Ulanmoqda…» bo'ladi?**
- Material (`above`): terminal `06` qisqa: `connect · ulangan` · `— server jarayoni muzlatildi` · `disconnect: ping timeout · active=true → ulanmoqda`.
- Ovoz: «Muzlashni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Admin noutbukida Wi-Fi o'chdi: ulanish uzilmadi, lekin hech narsa o'tmaydi. Panel belgisi qachon ulanmoqda bo'ladi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Darhol — brauzer Wi-Fi o'chganini sezib socket.io'ga aytadi · 2 Hech qachon — ulanish uzilmagani uchun belgi yashil qoladi · 3 45 soniyagacha — ping javobsiz qolgach `ping timeout` · 4 Keyingi hodisa kelganda — server xato qaytaradi
- To'g'ri (ovoz): «To'g'ri. Ulanish rasman uzilmagan, shuning uchun hech kim darhol aytmaydi. Server har yigirma besh soniyada ping yuboradi va yigirma soniya kutadi; javob kelmasa ping timeout, belgi ulanmoqda. Eng uzog'i qirq besh soniya. Demak, javob bermaydigan tarmoqni faqat ping aniqlaydi, kechikish bilan.» · qisqa: «Javob bermaydigan tarmoq — `ping timeout`, 45 s gacha (25 + 20). Darhol emas.»
- Isbot (`after`): terminal `06`: muzlatildi → 43 s → `disconnect: ping timeout`.
- Demak: «Javob bermaydigan tarmoqni faqat ping aniqlaydi: `ping timeout` — 45 s gacha.»
- Xato izohlari: 1 — «Brauzer har doim sezmaydi; socket.io pingga tayanadi.» · 2 — «Ping javobsiz qolsa, socket.io ulanishni o'zi uzadi — 45 s gacha.» · 4 — «Server hodisani yuboradi, xato qaytmaydi — paket shunchaki yetmaydi.»
- Maslahat: «Ulanish o'lganini kim va qanday aniqlaydi? 15-ekrandagi 25 + 20 ni eslang.»
- Manba: `ws1v2-out/06-muzlash-ping.txt`.

---

## 17 · AI panel yozdi — ikki to'plam  ← `Lesson`
- Kicker: `5-bosqich · AI` · Sarlavha: **Yangi ko'nikma davomi: ikki AI'ga bitta oddiy prompt — «jonli panel, WebSocket bilan»; ikkalasi ishlaydigan panel yozdi, ikkalasi bir xil yo'lni tanladi**
- Sahna: 1-segmentda bosqich kartasi («1–4-bosqich · siz» xira → «5-bosqich · AI yozadi, siz qabul qilasiz»); 2-segmentda prompt kartasi (`p1-prompt.txt`); 3-segmentda ikki `AiReply`: «1-AI (kuchli model)» — 17 fayl, +855 satr: xom `ws` (`@nestjs/platform-ws`), `ws://…/admin/ws?token=…`, ulanganda 30 ta buyurtma (snapshot), keyin `order/created`, `order/updated` — butun buyurtma, `OrderService` + uning testi o'zgardi, `timingSafeEqual`, `textContent`; «2-AI (kuchsizroq model)» — 15 fayl, +512 satr: xuddi shu yo'l, `/ws/orders?token=…`, snapshot 50 ta; 4-segmentda ikki AI javobidan iqtibos: «PostgreSQL yo'qligi uchun … haqiqiy baza bilan ishga tushirilmadi» · «haqiqiy bot → baza → panel oqimi sinalmadi».
1. **Yana AI bosqichi: ==panel yozdi AI, siz qabul qilasiz== — oddiy prompt, ishorasiz**
   Ovoz: «Avvalgi darslardagi kabi oxirgi bosqich AI bilan. Prompt oddiy: do'kon admini uchun jonli buyurtmalar paneli, bot buyurtma olsa yoki holat o'zgarsa, sahifa o'zi yangilansin, WebSocket bilan. Socket.io, token, hodisa tarkibi, bu so'zlar promptda yo'q.» · bosqich + prompt
2. **Ikkalasi ==xom `ws`== tanladi — socket.io emas; qayta ulanishni o'zi yozdi**
   Ovoz: «Ikkala AI ham bir xil yo'lni tanladi: socket.io emas, xom ws kutubxonasi. Brauzerda kutubxonasiz. Ishlaydi, lekin qayta ulanish, ping, polling'ga tushish, bularni o'zi qo'lda yozgan. Shuning uchun birinchisi sakkiz yuz ellik besh satr, ikkinchisi besh yuz o'n ikki.» · AI kartalari
3. **Ikkalasi tokenni o'zi qo'shdi — lekin ==URL'da: `?token=`==; hodisada butun buyurtma**
   Ovoz: «Yaxshi tomoni: promptda yo'q bo'lsa ham, ikkalasi tokenni o'zi qo'shdi, telefon raqamlari bor deb. Lekin token manzilda: savol belgisi token. Va har hodisada butun buyurtma ketadi, mijoz telefoni bilan. Ulanganda esa to'liq ro'yxat keladi.» · token va hodisa
4. **Xulosa: ikkalasi ==bazasiz, mock bilan sinagan== — haqiqiy bazada biz sinab ko'ramiz**
   Ovoz: «Xulosa: ikkala javob ham ishonchli ko'rinadi, testlari yashil. Lekin ikkalasi o'zi aytdi: Postgres yo'q edi, haqiqiy bot, baza va panel oqimi sinalmadi. Keyingi ekranda ikkalasini haqiqiy bazada, haqiqiy bot oqimi bilan sinaymiz.»
- Manba: `ws1v2-ai/00-promptlar.md`, `p1-prompt.txt`, `ai1/diff-stat.txt`, `ai2/diff-stat.txt`, `XULOSA.md`.

## 18 · AI panellari haqiqiy bazada: ishladi, lekin…  ← `Lesson`
- Kicker: `5-bosqich · ichida` · Sarlavha: **Haqiqiy PostgreSQL bilan: ikkalasi ishladi — smoke 5/5, tokensiz yopildi, buyurtma va tasdiq keldi; to'rt joyni esa siz qaror qilasiz**
- Sahna: 1-segmentda natija jadvali (`ws1v2-ai/*`): `tsc` ✓ ✓ · `npm test` 35/35 · 28/28 · smoke `5/5` · `5/5` · tokensiz `close 4401 bad token` · `close 1008 token`; 2-segmentda xom ws klient logi (ai2 `04`): `xabar snapshot orders: 0 ta` · `xabar created {…"phone":"+998907654321"…}` · `xabar updated {…"CONFIRMED"…}`; 3-segmentda yonma-yon (M47): «Bizniki: `io({ auth: { token } })` — manzil toza; hodisa `{ orderId, reason }`» ↔ «AI: `/ws/orders?token=panel-sir` — token manzilda; hodisada telefon»; 4-segmentda to'rt savol ro'yxati.
1. **Haqiqiy bazada: ==ikkalasi ishladi== — smoke 5/5, tokensiz ulanish yopildi**
   Ovoz: «Ikkala nusxani haqiqiy Postgres bilan ishga tushirdik. Tsc toza, testlar yashil, smoke beshdan besh. Tokensiz ulanish yopildi: birinchisida to'rt ming to'rt yuz bir kodi, ikkinchisida bir ming sakkiz. Buni tan olamiz: AI yaxshi ishladi.» · jadval
2. **Bot buyurtma oldi: ==snapshot, created, updated== — ichida mijoz ismi va telefoni**
   Ovoz: «Bot buyurtma oldi, admin tasdiqladi. Xom ws klientida uchta xabar: snapshot, nol ta; created va updated, ichida butun buyurtma: mijoz ismi, telefoni, mahsulotlar. Har ulangan panelga, har o'zgarishda. Ishlaydi, lekin telefon raqam har xabarda ketadi.» · ai2 logi
3. **Farq: token ==manzilda vs ulanish ma'lumotida==; hodisada ==ma'lumot vs konvert==**
   Ovoz: «Yonma-yon qarang. Bizda token auth'da, manzilda ko'rinmaydi; AI'da savol belgisi token, manzil satrida, brauzer tarixida, server va hosting loglarida qoladi. Bizda hodisa konvert, ma'lumot token bilan so'rovda; AI'da hodisaning o'zida. Ikkala yo'l ham ishlaydi, lekin bularni siz tanlaysiz.» · yonma-yon
4. **Xulosa: AI real vaqt kodiga ==to'rt savol==: kutubxona · token qayerda · hodisada nima · mavjud fayllardan nima o'zgardi**
   Ovoz: «Xulosa, to'rt savol. Qaysi kutubxona, o'quvchi darsidagi socket.io'mi. Token qayerda, manzilda emasmi. Hodisada nima bor va uni kim oladi. Mavjud fayllardan nimasi o'zgardi: ikkalasi order service va uning testini o'zgartirgan, diff'ni o'qing. Endi tekshirib olaylik.» · to'rt savol
- Manba: `ws1v2-ai/ai1/01–04`, `ai2/01–04`, `XULOSA.md` (aynan).

## 19 · Tekshiruv 4 — token URL'da  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **AI paneli `ws://…/ws/orders?token=panel-sir` ga ulanadi. Ishlaydi, server tokenni tekshiradi. Bu yerda nima xavf?**
- Material (`above`): AI-2 klient satri `ulanmoqda… ws://localhost:3100/ws/orders?token=panel-sir` (`ws1v2-ai/ai2/04`); ostida bizning `io({ auth: { token } })`.
- Ovoz: «AI panellarini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI paneli tokenni manzilga qo'shib ulanadi, savol belgisi token. Server uni tekshiradi, hammasi ishlaydi. Bu yerda nima xavf? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 Token manzil bilan birga brauzer tarixi va server, proxy loglarida qoladi · 2 Hech qanday — server tokenni tekshiryapti, shu yetarli · 3 WebSocket manzildagi tokenni qabul qilmaydi, ulanish yiqiladi · 4 Token manzilda bo'lsa, server uni har hodisada qayta tekshiradi va sekinlashadi
- To'g'ri (ovoz): «To'g'ri. Tekshiruv ishlaydi, xavf boshqa joyda: manzil ko'p joyga yoziladi. Brauzer tarixi, server va proxy loglari, hosting monitoringi, ularning hammasida token ochiq qoladi. Socket.io'da token auth bilan, ulanish ma'lumotida ketadi. Demak, maxfiy qiymat manzilga emas, sarlavha yoki ulanish ma'lumotiga yoziladi.» · qisqa: «Manzil loglarga va tarixga yoziladi — token u yerda ochiq qoladi. `auth` / sarlavha — xavfsizroq.»
- Isbot (`after`): ikki satr yonma-yon: AI `…/ws/orders?token=panel-sir` ↔ bizniki `ulanmoqda… http://localhost:3100` (token manzilda yo'q, `04`).
- Demak: «Maxfiy qiymat manzilga yozilmaydi: manzil tarix va loglarga tushadi; token — `auth` yoki sarlavhada.»
- Xato izohlari: 2 — «Tekshiruv bor, lekin token manzil bilan loglarga yoziladi — kim o'qisa, panelga kiradi.» · 3 — «Qabul qiladi — ulanish ishladi (`ws1v2-ai/ai2/04`); muammo xavfsizlikda.» · 4 — «Token faqat ulanishda tekshiriladi; tezlikka ta'siri yo'q.»
- Maslahat: «Manzil satridagi matn qayerlarga yozilib qoladi?»
- Manba: `ws1v2-ai/ai2/04-token-hodisa.txt`, `ws1v2-out/04`.

## 20 · Amaliyot 3 — AI'ga aniq prompt, to'rt savol  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **O'z AI'ingizga panelga yangi hodisa qo'shtiring — bekor qilingan buyurtma qizil bo'lsin; to'rt savol bilan qabul qiling, smoke bilan tekshiring** · `tableAt: 3`
1. **Endi siz: AI'ga ==aniq shartli prompt== — bekor qilingan buyurtma panelda qizil**
   Ovoz: «Endi navbat sizga. O'z AI'ingizga panelga kichik o'zgarish qildirasiz: bekor qilingan buyurtma qatori qizil bo'lsin va panel tepasida bugungi buyurtmalar soni chiqsin. Promptni pastdagi tugma bilan nusxalaysiz. Yigirma daqiqa ketadi.»
2. **1–2-qadam: prompt va ==to'rt savol== — kutubxona, token, hodisa, o'zgargan fayllar**
   Ovoz: «Birinchi qadamda promptni berasiz. Ikkinchisida natijani to'rt savol bilan o'qiysiz: socket.io qoldimi, token manzilga chiqmadimi, hodisada faqat raqam va sababmi, git diff stat'da qaysi fayllar o'zgardi.»
3. **3–4-qadam: ==`npm test`, `npm run smoke -- live`==, brauzerda bekor qiling; isbot — smoke natijasi**
   Ovoz: «Uchinchi qadamda npm test va npm run smoke live. To'rtinchisida brauzerda panelni ochib, botda buyurtmani bekor qilasiz: qator qizil bo'lishi kerak. Isbot maydoniga smoke'ning natija satrini yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan real vaqt kodini to'rt savol bilan qabul qilasiz.»
- Prompt (nusxalash): «Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), `ws1-done` tegida jonli panel bor: `src/api/live/live.gateway.ts` (socket.io, `order-changed { orderId, reason }`), `src/api/live/admin.controller.ts` (`GET /admin/orders`, Bearer token), `public/admin.html`. Vazifa: 1) panelda `CANCELLED` holatidagi buyurtma qatori qizil fonli bo'lsin; 2) panel tepasida bugungi buyurtmalar soni chiqsin (`GET /admin/orders` javobidan hisoblang). Shartlar: socket.io qolsin (xom ws emas); token manzilga yozilmasin (faqat `auth` va `Authorization` sarlavhasi); hodisa tarkibi o'zgarmasin (`{ orderId, reason }`, buyurtma ma'lumoti hodisaga qo'shilmasin); mijoz ismi `esc()` bilan qolsin; `src/api/order/` va `src/api/telegram/` ga tegma. Javobda: o'zgargan fayllar ro'yxati va `npm test` natijasi.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Prompt | yuqoridagi prompt — o'z AI'ingizga | o'zgargan fayllar ro'yxati |
  | 2 | To'rt savol | `git diff --stat` — faqat `public/admin.html` (va kerak bo'lsa `admin.controller.ts`) · `grep -n "io(" public/admin.html` — `auth: { token }` · `grep -n "emit" src/api/live/live.gateway.ts` — `{ orderId, reason }` · `grep -n "esc(" public/admin.html` | 4 ✓ |
  | 3 | Testlar | `npm test` · `npm run smoke -- live` | `Tests: 32 passed` · `NATIJA: 4/4 ✓` |
  | 4 | Brauzer | panel ochiq → botda `/orders` → «❌ Bekor» | qator qizil, son yangilandi |
- Isbot: «`npm run smoke -- live` natija satri» · placeholder: «masalan: NATIJA: 4/4 ✓» · KOD: `/NATIJA:\s*4\/4/` · xato: «AI o'zgartirgandan keyin `npm run smoke -- live` yurgizing va `NATIJA: …` satrini qo'ying.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `git diff --stat` da `order.service.ts` yoki `telegram.service.ts` | AI tegmasligi kerak bo'lgan faylga tegdi — `git checkout -- src/api/order src/api/telegram`, shartni takrorlang |
  | AI `ws` paketini o'rnatdi | «socket.io qolsin» bandini takrorlang; `git checkout -- package.json package-lock.json` |
  | smoke `live` ✗ «order-changed null» | hodisa tarkibi yoki nomi o'zgargan — `live.gateway.ts` diff'ini o'qing |
  | Qator qizil emas | holat `CANCELLED` mi? panel ro'yxatni qayta so'radimi (F12 → Network) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `ws1v2-ai/XULOSA.md` (ikkala AI xom ws, token URL'da, hodisada ma'lumot, `OrderService` o'zgargan); smoke `live` (4 band).

---

## 21 · m10-02 xaritasi: Maydon Jamoa  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Eyebrow: `m10-02 · «WebSocket: ekran o'zi yangilanadigan ulanish»` · Sarlavha: **O'quvchi darsi: Maydon Jamoa'dagi «8 / 10» — siz bugun panelda qilgan narsaning telefondagi varianti, socket.io bilan**
- Sahna: ikki karta: «O'quvchi (m10-02)» — 20 ekran: s0 ikki telefon, biri eski «8 / 10» · s2–s4 yopiq va ochiq yo'l · s5 konvert (`oyin-ozgardi { oyinId, sabab }`, son yo'q) · s7 token bilan ulanish · s9 kod oynasi: tinglovchi · s10 uch belgi, uchish rejimi · s12–s13 real vaqt sxemasi · amaliyot: `maydon-jamoa` + Render · «Siz (bugun)» — OrderBotNest panel, gateway, `order-changed`, uch holat, ping, AI; 3-segmentda bloklar jadvali (blok · o'quvchi ekranlari · siz qo'shasiz); 4-segmentda repo teglari: `m12-dars-02-done` (ulanish, hodisa yo'q) · `m12-dars-03-done` (hodisa bor).
- Bloklar:
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 ekran yangilanmaydi · s1 reja | so'rov–javobda server gapirmaydi (2-ekran) |
  | 2 Ulanish | s2–s4 yo'l yopiq / ochiq · s5–s6 konvert · s7–s8 token | tokensiz — bir lahza `connect` (5-ekran) · `return` (6-ekran) |
  | 3 Tinglovchi | s9 kod oynasi | `() => yukla` qavssiz (11-ekran) |
  | 4 Holat | s10–s11 uch belgi, uzilishda hodisa yo'qoladi | 45 s (15-ekran) |
  | 5 Sxema va amaliyot | s12–s14 real vaqt sxemasi · A1 o'z repo + Render · A2 README | Render uxlashi, telefon — sinfda |
1. **m10-02 — 20 ekran: ==Maydon Jamoa, «8 / 10»== — ikki telefon, biri eski son ko'rsatadi**
   Ovoz: «Endi sinfga tayyorgarlik. O'quvchi darsi m10-02, yigirma ekran. Misol Maydon Jamoa: futbol o'yiniga yozilish ilovasi. Ikki telefon: biri qo'shiladi, ikkinchisida eski sakkizdan o'n turadi. Siz bugun panelda ko'rgan muammo, telefonda.» · kartalar
2. **O'quvchi ham ==socket.io, token, konvert va uch belgi== — siz bilgan qoidalar**
   Ovoz: «O'quvchi darsidagi qoidalar sizniki bilan bir xil: socket.io, token ulanishda, konvert ichida son yo'q, ilova qayta so'raydi, va uch belgi. Faqat o'quvchida ilova telefon, server Render'da. Shuning uchun AI xom ws yozsa, o'quvchi darsi bilan to'qnashadi.» · qoidalar
3. **Bloklar: ==og'ir joy — 9-ekran kod oynasi va birinchi amaliyot==**
   Ovoz: «Bloklar jadvaliga qarang. Og'ir joy to'qqizinchi ekrandagi kod oynasi va birinchi amaliyot: Backend, ilova va Render birga. Ikkinchi, to'rtinchi, beshinchi ekranlarga ortiqcha vaqt bermang. Har blokda siz qo'shadigan narsa o'ng ustunda.» · jadval
4. **Xulosa: repo ==`m12-dars-02` da hodisa yo'q, `m12-dars-03` da bor== — o'quvchi farqni ko'rsin**
   Ovoz: «Xulosa: o'quvchi loyihasida ikki teg muhim. Birinchisida ulanish bor, hodisa yo'q: son o'zi o'zgarmaydi, bu xato emas. Ikkinchisida hodisa bor. Sinfda ikkalasini ko'rsating: ulanish bilan hodisa alohida narsa.» · teglar
- Manba: `src/10-Modull/WebSocketBasicsLesson.jsx` (`SCREEN_META` 20, s0–s14, A1); `maydon-jamoa` teglar `m12-dars-02-done` a5e3753, `m12-dars-03-done` 64283b2; v1 `ws1-out/05`, `06`.

## 22 · O'quvchi so'zlari va real vaqt sxemasi  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **Yo'l, konvert, belgi, tinglovchi — atama bilan birga; README «Real vaqt» jadvali: OrderBotNest'da ham, Maydon Jamoa'da ham besh ustun**
- Sahna: 1-segmentda lug'at; 2-segmentda OrderBotNest README «Jonli panel» jadvali (2 qator, `ws1-done`); 3-segmentda `maydon-jamoa` README «Real vaqt» (5 qator, `m12-dars-03-done`) ; 4-segmentda `maydon-jamoa` `mobil/src/ulanish.ts` bo'lagi — `ulanish.on('connect', () => { … ulanish?.on('oyin-ozgardi', …) })` (tinglovchi `connect` ichida — belgilangan, WebSocket-2 kartasi).
- Lug'at:
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | yopiq yo'l / ochiq yo'l | so'rov–javob / doimiy ulanish |
  | konvert | hodisa (`oyin-ozgardi` · bizda `order-changed`) — ichida son yo'q |
  | belgi | ulanish holati (`connected`, `active`) |
  | tinglovchi | `ulanish.on(…)` |
  | qayta so'rash | `GET /oyinlar` · bizda `GET /admin/orders` |
1. **O'quvchi so'zlari: ==ochiq yo'l — doimiy ulanish, konvert — hodisa==**
   Ovoz: «O'quvchi darsidagi so'zlar: yopiq yo'l so'rov–javob, ochiq yo'l doimiy ulanish, konvert hodisa, belgi ulanish holati, tinglovchi ulanish on. O'quvchi so'zni aytganda, siz yonida atamani ayting: konvert, ya'ni hodisa, bizda order changed.» · lug'at
2. **README jadvali: ==nuqta · kim nima qiladi · hodisa · kim oladi · ekranda nima==**
   Ovoz: «OrderBotNest README'sida jonli panel jadvali: real vaqt nuqtasi, kim nima qiladi, hodisa va sabab, kim oladi, panelda nima o'zgaradi. Ikki qator: yangi buyurtma va holat. O'quvchi o'z loyihasi uchun aynan shunday jadval yozadi.» · OrderBotNest README
3. **Maydon Jamoa'da ==besh sabab, bitta hodisa== — `oyin-ozgardi`**
   Ovoz: «Maydon Jamoa'da jadval besh qator: qo'shildi, chiqdi, tasdiqladi, navbatga yozildi, e'lon berildi. Hodisa bitta, sabablar besh. Kurs qoidasi: hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish: oyin ozgardi, order changed.» · maydon-jamoa README
4. **Xulosa: o'quvchi kodida ==tinglovchi `connect` ichida== — bu keyingi darsning birinchi muammosi**
   Ovoz: «Xulosa va bitta ogohlantirish. O'quvchi loyihasining ulanish ts faylida hodisa tinglovchisi connect ichida qo'shiladi. Har qayta ulanishda yana bittasi qo'shiladi. Hozir ishlaydi, keyingi WebSocket darsida buni buzib ko'ramiz. Sinfda tuzatmang, belgilab qo'ying.» · ulanish.ts
- Manba: `order-bot` `ws1-done` README «Jonli panel»; `maydon-jamoa` `m12-dars-03-done` README «Real vaqt», `mobil/src/ulanish.ts` (haqiqiy satrlar).

## 23 · Sinfdagi holatlar va o'quvchi savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **Belgidan va server terminalidan sabab topiladi: oltita holat, har biri o'z xabari bilan — va o'quvchi so'raydigan to'rt savol**
- Sahna: 1–2-segmentda holatlar kartalari (6); 3–4-segmentda «O'quvchi so'rasa» (ovozsiz, bosib ochiladi).
- Holatlar:
  | # | Holat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Belgi bir lahza yashil, keyin qizil | `io server disconnect` | token — qayta kirish |
  | 2 | Belgi sariq, keyin yashil | `transport close` → `connect` | server qayta yondi — normal |
  | 3 | Uchish rejimida belgi o'zgarmadi | 45 s gacha `ping timeout` | kuting |
  | 4 | Son o'zi o'zgarmadi | hodisa yo'q (`m12-dars-02`) | xato emas — keyingi teg |
  | 5 | Birinchi ulanish cho'zildi | Render uxlagan ⚠ | bir daqiqa kuting |
  | 6 | Server terminali «o'yinchi null» / «panel ulandi» rad etilganda | `return` yo'q | 6-ekran |
- O'quvchi so'rasa:
  - «WebSocket va socket.io bir narsami?» → socket.io — kutubxona: imkon bo'lsa WebSocket orqali, bo'lmasa polling; qayta ulanish va ping tayyor.
  - «Nega hodisada son yo'q?» → ikki kishi birdan qo'shilsa adashmasin — son har doim Backend'dan.
  - «Uzilgan paytdagi hodisa keyin keladimi?» → yo'q: socket.io eski hodisani saqlamaydi; qayta ulanganda qayta so'rash kerak — keyingi dars.
  - «Token muddati tugasa?» → keyingi ulanishda Backend yopadi — «Ulanmagan», qayta kirish.
1. **Birinchi uchtasi ==belgidan== taniladi: qizil, sariq-yashil, o'zgarmagan**
   Ovoz: «Sinfda uchraydigan olti holat. Birinchi uchtasi belgidan taniladi. Belgi bir lahza yashil, keyin qizil: token, qayta kirish. Sariqdan yashilga: server qayta yondi, normal. Uchish rejimida belgi o'zgarmadi: qirq besh soniyagacha kuting.» · 1–3
2. **Qolgan uchtasi: ==son o'zgarmadi, Render cho'zildi, «null»== — terminaldan**
   Ovoz: «To'rtinchisi: son o'zi o'zgarmadi, o'quvchi hali hodisasiz tegda, xato emas. Beshinchisi: birinchi ulanish cho'zildi, Render uxlagan, bir daqiqa. Oltinchisi: server terminalida o'yinchi null, sabab return yo'q, oltinchi ekrandagi buzilish.» · 4–6
3. **O'quvchi savollari: ==socket.io nima, nega son yo'q, uzilgan hodisa, token muddati==**
   Ovoz: «O'quvchi savollariga tayyor javoblar pastda, bosib oching: WebSocket va socket.io farqi, nega hodisada son yo'q, uzilgan paytdagi hodisa keyin keladimi, token muddati tugasa nima bo'ladi.» · QA
4. **Xulosa: ==avval belgiga, keyin server terminaliga== qarang — sabab shu ikkisida**
   Ovoz: «Xulosa: o'quvchi ekran o'zgarmayapti desa, u bilan birga avval belgiga, keyin server terminaliga qarang. Sabab deyarli doim shu ikkisidan birida. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring.»
- Manba: `ws1v2-out/03`, `05`, `06`, `07`; v1 `ws1-out/05`, `08`; o'quvchi darsi s1, s10–s11, A1.

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran; M48 — uzunliklar tekis):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Panel `GET /admin/orders` ni bir marta so'radi. Keyin bot buyurtma oldi. Oddiy HTTP'da panel nima biladi? | Hech narsa — server so'ralmaguncha javob bermaydi · Server javobni o'zi qayta yuboradi · Brauzer o'zgarishni o'zi sezib yangilaydi · HTTP ulanishi ochiq qoladi va server yangisini o'zi yuboradi | 1 | So'rov–javobda server o'zi gapirmaydi. | 2 |
  | 2 | Gateway tokenni qayerdan o'qiydi? | So'rov sarlavhasidagi `Authorization`dan · `client.handshake.auth.token` — ulanish ma'lumotidan · Har hodisa bilan kelgan maydondan · `.env` dagi `ADMIN_PANEL_TOKEN`dan — klient hech narsa yubormaydi | 2 | Token ulanish ochilayotganda keladi. | 4 |
  | 3 | `disconnect()` dan keyin `return` yo'q. Tokensiz klient bilan nima bo'ladi? | Klient ulangan qoladi va keyingi hodisalarni ham oladi, token tekshirilmaydi · Server xato beradi va to'xtaydi · Klient yopiladi, lekin server logi «panel ulandi» yozadi · Klient qayta-qayta ulanishga urinadi | 3 | `disconnect()` funksiyadan chiqmaydi. | 6 |
  | 4 | Hodisa `order-changed` ichida nima bor? | Butun ro'yxat — panel to'g'ridan chizadi · Mijoz ismi, telefoni va mahsulotlari — panel shundan chizadi · Yangi buyurtma HTML'i — sahifaga qo'yiladi · `orderId` va `reason` — panel ro'yxatni qayta so'raydi | 4 | Konvert: «nimadir o'zgardi». | 8 |
  | 5 | `ulanish.on('order-changed', () => yukla)`. Hodisa keldi. Nima bo'ladi? | Ro'yxat yangilanadi, lekin biroz kechikib · Tinglovchi ishlaydi, `yukla` chaqirilmaydi — ro'yxat eski · Brauzer konsolida xato chiqadi · Hodisa tinglovchiga umuman yetib kelmaydi — server yubormaydi | 2 | Qavssiz — funksiya qaytariladi. | 11 |
  | 6 | Server to'xtadi. Klient nima ko'radi? | `io server disconnect` — qayta urinmaydi · `ping timeout` — 45 soniya kutadi, keyin o'zi qayta ulanadi · `transport close`, `active=true` — o'zi qayta urinadi · Hech narsa — ulanish o'zi yopilmaydi | 3 | Tarmoq uzdi — klient taslim bo'lmaydi. | 14 |
  | 7 | Wi-Fi o'chdi, ulanish rasman uzilmadi. Belgi qachon o'zgaradi? | Darhol — brauzer socket.io'ga aytadi · Hech qachon — uzilish bo'lmagani uchun · Keyingi buyurtmada — server xato qaytaradi · 45 soniyagacha — `ping timeout` bilan | 4 | 25 + 20 s qoidasi. | 15 |
  | 8 | AI paneli `…/ws/orders?token=…` ga ulanadi va ishlaydi. Asosiy savol? | Token manzilda — tarix va loglarga yoziladi · Ishlayapti — demak qabul qilsa bo'ladi · `ws` sekin — socket.io tezroq ishlaydi · Manzil uzun — brauzer uni qisqartirib, tokenni kesib yuboradi | 1 | Maxfiy qiymat manzilga yozilmaydi. | 19 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. So'rov–javobda server faqat so'ralganda javob beradi; jonli panel uchun doimiy ulanish — socket.io: avval polling, keyin websocket, HTTP bilan bitta portda.
  2. Gateway: `handleConnection` da `client.handshake.auth.token` — noto'g'ri bo'lsa `disconnect()` va **`return`** (aks holda log yolg'on); token bitta joyda (`isAdminToken`), bo'sh token ham rad.
  3. Hodisa tranzaksiya tugagach: `await place(…)` → `orderChanged(id, 'new')`; ichida faqat `{ orderId, reason }` — panel `GET /admin/orders` ni token bilan qayta so'raydi (konvert).
  4. Panel: `io({ auth: { token } })` (token manzilda emas), tinglovchi `() => yukla()` (qavs bilan), matn `esc()` bilan.
  5. Uch holat: ulangan · ulanmoqda (`active=true`: `transport close`, `xhr poll error`, `ping timeout` ≤ 45 s) · ulanmagan (`active=false`: `io server disconnect` — token). Server yongach klient o'zi ulanadi.
  6. AI real vaqt kodiga to'rt savol: kutubxona (socket.io'mi) · token qayerda · hodisada nima (kim oladi) · mavjud fayllardan nima o'zgardi; haqiqiy baza bilan tekshiring (`npm run smoke -- live`).
- **Uyga vazifa** (M14, M30): «O'z OrderBotNest nusxangizda (`ws1-done`) panelga ikkinchi real vaqt nuqtasini qo'shing: **ombor qoldig'i**. Admin `/orders` da buyurtmani bekor qilsa (mahsulot omborga qaytadi) yoki yangi buyurtma omborni kamaytirsa, panel pastida «Omborda: Klaviatura — N ta» ro'yxati o'zi yangilansin. Yangi hodisa ochmang — `order-changed` dan keyin ombor ham qayta so'ralsin (`GET /admin/stock`, token bilan). README «Jonli panel» jadvaliga qator qo'shing. `live.gateway.spec.ts` ga yoki `admin.controller.spec.ts` ga `GET /admin/stock` uchun test yozing (tokensiz 401, token bilan 200). GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | API | `admin.controller.ts`: `@Get('stock')` — token → `products` (nom, qoldiq) | `curl … /admin/stock` 200 |
  | 2 | Test | `admin.controller.spec.ts`: tokensiz 401, token bilan 200 va ro'yxat | `npm test` yashil |
  | 3 | Panel | `admin.html`: `yukla()` ichida ombor ham qayta so'raladi, ro'yxat pastda | bekor qilinsa son o'sadi |
  | 4 | README | «Jonli panel» jadvaliga «ombor qoldig'i» qatori | jadvalda 3 qator |
  | 5 | Topshirish | `git push` → repo linki platformaga | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: yangi hodisa ochilmagan (`order-changed` yetadi) · `/admin/stock` token bilan himoyalangan va testlangan · README jadvali.
- **Eslatma:** so'rov–javob vs doimiy ulanish · socket.io polling → websocket · gateway qolipi (`handleConnection`, `disconnect` + `return`, `isAdminToken`) · hodisa tranzaksiyadan keyin, konvert · panel qolipi (`io({ auth })`, tinglovchi, `esc`) · uch holat va xabarlari · ping 25 + 20 · `npm run live`, `npm run smoke -- live` · AI'ga to'rt savol · m10-02 lug'ati · sinfdagi olti holat · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **WebSocket: ulanish uzilsa** — uzilish paytidagi buyurtma, takror tinglovchi va qayta ulanishda qayta so'rash».

---

## «KOD» — qurishda

**Qurishdan OLDIN yurgiziladi — 04.11:**
1. ✅ OrderBotNest `ws1-done` fb8b8b4 (push ✓, teglar `ws1-start` 87a5bb1 · `ws1-done`): `src/api/live/` (gateway, controller, token, module), `public/admin.html`, `scripts/live-client.js`, smoke `live`, README «Jonli panel»; `npm test` 32/32, `tsc` toza, Prettier ✓; GitHub CI 41856397400: test ✓, smoke 9/9 ✓ (`12-ci-github.txt`).
2. ✅ `drive-ws1v2.sh` → `ws1v2-out/00–10` (toza `ws1-done` nusxasida, 3-yurish; birinchisida server fayli ES-modul deb o'qilib ko'tarilmagan — `.cjs` + skript server ko'tarilmasa to'xtaydi).
3. ✅ `drive-ws1v2-extra.sh` → `11a-panel-togri` (ro'yxat o'zgardi), `11b-panel-qavssiz` (15 s o'zgarmadi, klient 2 hodisani oldi). O'lchov tuzoqlari (tutildi): buyurtma Chrome ochilishidan oldin tushgan; `innerText` ni `textContent` bilan solishtirish yolg'on «o'zgardi» bergan; argumentsiz `wait` fondagi serverni kutib osilgan.
4. ✅ AI: `ws1v2-ai/ai1`, `ai2` (+ `drive-ws1v2-ai.sh` haqiqiy baza bilan), `XULOSA.md`.

**Qurish:**
1. Generator `dev/ws1-matn.py` (cicd2-matn.py dan) · `dev/ws1-kod.py` (repo `ws1-done` fayllari satr raqami bilan, `ws1v2-out/0N` chiqishlar, `10-panel.txt` → `PANEL` (bosqichlar: belgi, qatorlar), `ws1v2-ai/*` → `AI`, `PROMPT1`, `PROMPT2` = 20-ekran prompti; maydon-jamoa README va `ulanish.ts` bo'laklari).
2. Bo'laklar `ws1/parts/` yangidan (v1 — `dev/ws1-v1-parts-zaxira/`): `04-yordam.jsx` (CI/CD-2 dan: `Term`, `kod`, `Code`, `AiReply`, `Card`, `MC`, `mkPractice`, `Cause`; yangi: `PanelView` (brauzer maketi, haqiqiy qatorlar), `Flow` (bot → tranzaksiya → hodisa → panel → GET), `States` (uch holat)) · `05-s01-s07.jsx` · `06-s08-s16.jsx` · `07-s17-s25.jsx`.
3. M43: kod sahnalari ≤ 16 satr, haqiqiy raqamlar; natija kod tagida. M46: ovozda papka · fayl · terminal (server / `npm run live`). M47: 6, 15 — oxirgi segment sabab; 6, 15, 18 — yonma-yon.
4. Isbotlar: 7 — `/panel ulandi/i` · 12 — `/NATIJA:\s*4\/4/` · 20 — `/NATIJA:\s*4\/4/`.
5. `LESSON_ID` o'zgarmaydi (M44). CI/CD-2 yakunidagi keyingi karta «Telegraf + PostgreSQL» → kurs tartibi bo'yicha: CI/CD-2 → WebSocket-1 bo'lsa, karta tuzatiladi (tekshiriladi: `dev/main.jsx` ro'yxat tartibi).
6. Ovoz keshi → Vercel deploy (ruxsat 04.11).
