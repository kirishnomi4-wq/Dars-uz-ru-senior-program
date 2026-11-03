# WebSocket-1 — haqiqiy chiqishlar (01.11.2026, avtopilot)

Yasash: `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-ws1.sh`. O'quvchi loyihasi **maydon-jamoa** (`m12-dars-02-done`, a5e3753): backend — haqiqiy (NestJS 12, `@nestjs/websockets` 12.1.3, socket.io 4.8.4), lokal PostgreSQL 18 (vaqtinchalik klaster), `.env.example` dagi namuna qiymatlar. **Ilova (Expo) o'rniga** — Node'dagi `socket.io-client` 4: ulanish va holat qoidasi `mobil/src/ulanish.ts` dagidek (`io(API, { auth: { token } })`; `connect` → ulangan; `disconnect`/`connect_error` → `active` bo'lsa ulanmoqda, aks holda ulanmagan). Telefondagi belgi — ⚠ sinalmagan (Expo ishga tushirilmagan).

| Fayl | Nima |
|---|---|
| 00 | repo `a5e3753` (m12-02), Node 24.18, @nestjs/websockets 12.1.3, socket.io 4.8.4 |
| 01 | `POST /royxat` Ali → 201 `{"id":11,"ism":"Ali"}`; `POST /kirish` → 200 `{ token }` (Vali — ikkinchi akkaunt ham) |
| 02 | tokensiz va soxta token: klient **bir lahza `connect`** (ulangan), darhol `disconnect: io server disconnect · active=false` → **ulanmagan** (Backend `ulanish.disconnect()`) |
| 03 | token bilan: ulangan, `transport: websocket`; Backend terminali `LOG [Ulanish] ulandi: o'yinchi 11` · yopilganda `uzildi: o'yinchi 11` |
| 04 | Backend to'xtatildi → `disconnect: transport close · active=true` → **ulanmoqda**; har ~2 s `connect_error: xhr poll error`; Backend qayta yoqilgach o'zi **ulangan** (≈1,5 s ichida) |
| 05 | m12-02: Vali qo'shildi (201) — Ali'ga **hodisa kelmadi**, son eski; Ali o'zi so'raganda (pastga tortish) — 10 / 10 |
| 06 | `m12-dars-03-done` (64283b2): Vali qo'shildi → Ali'ga `oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}` — Valining o'z javobidan ham oldin; Ali qayta so'radi → 6 / 10 dan 7 / 10 |
| 07 | «uchish rejimi»ga o'xshash: Backend jarayoni muzlatildi (SIGSTOP — TCP yopilmaydi, javob yo'q) → klient **45 s** dan keyin `disconnect: ping timeout · active=true` → ulanmoqda; Backend davom etgach darhol ulangan. 45 s = engine.io standarti `pingInterval: 25000` + `pingTimeout: 20000` (`node_modules/engine.io/build/server.js`). O'quvchi darsidagi «bir daqiqagacha» — shu |
| 08 | gateway'da `ulanish.disconnect()` dan keyin `return` olib tashlandi: tokensiz klient baribir `io server disconnect` (ulanmagan), lekin Backend terminali **`ulandi: o'yinchi null`** deb yozadi — jurnal yolg'on gapiradi; `return` qaytarilgach yo'q (03 dagi kabi) |
