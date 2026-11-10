# WebSocket-1 v2 · AI tajribasi — xulosa (F-1104-22, 04.11)

Loyiha: OrderBotNest `ws1-start` (= `cicd2-done` 87a5bb1, WebSocket yo'q). Har agent alohida nusxada (scratchpad `ws1-ai1`, `ws1-ai2`, tarmoq `ish`), bitta oddiy prompt (`p1-prompt.txt`):
«OrderBotNest'ga do'kon admini uchun jonli buyurtmalar paneli kerak: bot yangi buyurtma olganda yoki admin buyurtma holatini o'zgartirganda, brauzerdagi panel sahifani yangilamasdan o'zi yangilansin. WebSocket bilan qilib ber.»
Ishorasiz: token, socket.io, hodisa tarkibi, tranzaksiya, qayta ulanish so'zlari yo'q. Ikkala AI'ga baza va Telegram berilmadi — ular o'zi mock bilan sinadi; haqiqiy baza bilan **biz** sinadik (`drive-ws1v2-ai.sh`).

| | 1-AI (Opus) | 2-AI (Haiku) |
|---|---|---|
| Hajm | 17 fayl, +855 satr | 15 fayl, +512 satr |
| Transport | xom `ws` (`@nestjs/platform-ws`), brauzerda kutubxonasiz | xuddi shu |
| Manzil | `ws://…/admin/ws?token=…` | `ws://…/ws/orders?token=…` |
| Token | `ADMIN_PANEL_TOKEN`, `timingSafeEqual`; WS — **URL'da** (`?token=`), sahifa — `#token` (manzil satridan o'chiriladi) | `PANEL_TOKEN`, `timingSafeEqual`; sahifa ham, WS ham **URL'da** (`?token=`) |
| Rad etish | `close 4401 bad token` (bo'sh token — 4403) | `close 1008 token` |
| Hodisa tarkibi | ulanganda `snapshot` (30 ta), keyin `order/created`, `order/updated` — **butun buyurtma** (ism, telefon, mahsulotlar) | `snapshot` (50 ta), `created`, `updated` — butun buyurtma |
| Hodisa qayerdan | `OrderService` ichida, tranzaksiya COMMIT bo'lgach (rxjs Subject) | xuddi shu |
| Mavjud kod | `OrderService` konstruktoriga yangi dependency → **`order.service.spec.ts` o'zgartirildi** (+4 test) | xuddi shu (+3 test) |
| Qayta ulanish | o'zi yozgan (ws'da tayyori yo'q); 30 s ping | o'zi yozgan |
| XSS | `textContent` — `<img onerror>` ismi matn bo'lib chiqadi (o'zi sinagan) | `textContent` |
| O'z sinovi | mock baza, headless Chrome, 11/11 | mock servis, 10/10 |

## Haqiqiy baza bilan (biz, 04.11 20:12–20:14)

| | 1-AI | 2-AI |
|---|---|---|
| `tsc --noEmit` | ✓ | ✓ |
| `npm test` | 35/35 | 28/28 |
| `npm run smoke` (PostgreSQL 18) | `NATIJA: 5/5 ✓` | `NATIJA: 5/5 ✓` |
| tokensiz / noto'g'ri token | `close 4401 bad token` | `close 1008 token` |
| token bilan + bot buyurtma + admin tasdiq | `snapshot 0 ta` → `order/created {…"phone":"+998907654321"…}` → `order/updated {…"CONFIRMED"…}` | `snapshot 0 ta` → `created {…}` → `updated {…}` |

## Xulosa (darsga — AI ekranlari)
1. **Ikkalasi ham ishladi** — haqiqiy baza, haqiqiy bot oqimi, Telegram xabarlari avvalgidek. Tan olamiz.
2. **Ikkalasi socket.io emas, xom `ws` tanladi.** Ishlaydi, lekin qayta ulanish, ping, polling'ga tushish — hammasini o'zi qo'lda yozgan (+300–500 satr). O'quvchi darsi (m10-02) socket.io'da: `auth: { token }`, `active`, uch holat — mentor AI'ga kutubxonani **o'zi aytishi** kerak.
3. **Token URL'da** (`?token=`) — brauzer tarixi, proxy va hosting loglarida qoladi. socket.io'da token `auth` bilan yuboriladi — manzilda ko'rinmaydi.
4. **Hodisada butun buyurtma, telefon bilan** — har ulangan panelga har o'zgarishda. Ishlaydi; muqobili — «konvert» (`{ orderId, reason }`) va panel qayta so'raydi (m10-02 qoidasi). Farq: konvertda bitta manba (baza), ma'lumot faqat token bilan GET'da.
5. **Mavjud kodga tegdi:** `OrderService` ga yangi dependency → Jest-2 dagi `order.service.spec.ts` o'zgardi. Diff'ni o'qimasdan qabul qilinmaydi.
6. **Ulanganda snapshot** — qayta ulanganda ham yangi ro'yxat keladi: uzilish paytidagi o'zgarish yo'qolmaydi. Bu yaxshi qaror (WS-2 mavzusi) — bizning `ws1-done` da hali yo'q.
7. Mentor uchun to'rt savol: qaysi kutubxona (o'quvchi bilan bir xilmi) · token qayerda (URL'da emasmi) · hodisada nima bor (kim oladi) · mavjud fayllardan nimasi o'zgardi (diff, testlar).

Fayllar: `ai*/diff.patch`, `ai*/diff-stat.txt`, `ai*/01-tsc-test.txt`, `02-smoke.txt`, `03-tokensiz-notogri.txt`, `04-token-hodisa.txt`; AI javoblari — 00-promptlar.md.
