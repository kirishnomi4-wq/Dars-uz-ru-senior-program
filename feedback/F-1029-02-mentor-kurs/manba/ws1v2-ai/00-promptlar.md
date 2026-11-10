# WebSocket-1 v2 · AI tajribasi (F-1104-22) — 04.11
Loyiha: OrderBotNest `ws1-start` (= `cicd2-done` 87a5bb1), har agent alohida nusxada (scratchpad `ws1-ai1`, `ws1-ai2`, tarmoq `ish`). ai1 — Opus, ai2 — Haiku.
Shartlar (ikkalasiga bir xil): faqat o'z papkasida; commit/push yo'q; npm paket o'rnatish mumkin; PostgreSQL va Telegram tokeni yo'q; server sinovi uchun PORT=3201 / 3202.
## Prompt 1
Matn: `p1-prompt.txt`. Ishorasiz: token, socket.io, hodisa tarkibi, tranzaksiya, qayta ulanish yo'q.
## Javoblar (qisqa)
- ai1: «Oddiy WebSocket ishlatildi (`@nestjs/platform-ws`), brauzer tomonda tashqi kutubxona yo'q… WebSocket manzili `/admin/ws?token=…`… ulanganda avval oxirgi 30 buyurtma keladi… PostgreSQL yo'qligi uchun to'liq server haqiqiy baza bilan ishga tushirilmadi va `npm run smoke` yurgizilmadi.» Tokenni o'zi qo'shgan; `README.md` ga bo'lim yozgan.
- ai2: «@nestjs/websockets, @nestjs/platform-ws, ws… WebSocket /ws/orders. Ulanganda token tekshiriladi, keyin snapshot… GET /admin/orders?token=… Bu talab buyurtmachining so'rovida yo'q edi: buyurtmalarda mijoz telefoni bor, shuning uchun men tokenni qo'shdim… haqiqiy bot → baza → panel oqimi sinalmadi (faqat mock servis bilan).»
Natijalar va xulosa — `XULOSA.md`.
