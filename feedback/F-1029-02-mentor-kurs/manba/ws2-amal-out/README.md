# ws2-amal-out — WebSocket-2 amaliyotlari mentor yo'lida (01.11.2026 05:02, avtopilot)

Skript: `manba/drive-ws2-amaliyot.sh`. Klient: `manba/ws2-klient.js` (m12-04 qoidasi — darsdagi «Kodni ochish» aynan shu) va `manba/ws2-klient-tuzatilgan.js` (m12-05 qoidasi — 3-amaliyot namunasi).
Backend `m12-dars-04-done`, `cp .env.example .env`, `npm run start`; Ctrl+C = SIGINT jarayon guruhiga; lokal PostgreSQL 5451-portda (`.env` da faqat port).

| Fayl | Nima ko'rindi |
|---|---|
| 01 | start ✓; 3-o'yin «Park maydoni» 4 / 8 |
| 02 | Ali klienti (`OYIN=3`): ulangan, «Hozir ko'ryapti: 1» → Ctrl+C → `transport close` → `npm run start` → 12.7 s da ulangan → Vali qo'shildi (201) → **tinglovchi ishladi (1) va (2)**, `GET` ikki marta |
| 03 | Vali klienti 3-o'yinni ochdi — **«Hozir ko'ryapti: 1»** (Ali ham ochiq, lekin xonada emas) |
| 04 | tuzatilgan klient: qayta ulanganda `GET` va xonaga qayta kirish; Vali ochganda ikkalasida **«Hozir ko'ryapti: 2»**; Vali chiqdi (201) → tinglovchi **(1)** |
