# ws1-amal-out — WebSocket-1 amaliyotlari mentor yo'lida (01.11.2026 04:05, avtopilot)

Skript: `manba/drive-ws1-amaliyot.sh` · klient: `manba/ws1-klient.js` (darsdagi «Kodni ochish» — aynan shu fayl).
Farqi `ws1-out/` dan: `.env.example → .env`, `npm run start` (nest start), MD dagi curl'lar aynan, socket.io **standart** sozlamasi (o'quvchi ilovasidagi `ulanish.ts` kabi), Ctrl+C = SIGINT jarayon guruhiga.
Yagona farq mentor kompyuteridan: lokal PostgreSQL 5449-portda (`.env` da faqat port almashtirilgan).

| Fayl | Nima ko'rindi |
|---|---|
| 01 | `main` tarmog'ida `backend/` yo'q (faqat README) → avval `git checkout -f m12-dars-02-done`, keyin `cd backend` · `npm ci` 282 paket · `npm run start` ~4 s → `Nest application successfully started` |
| 02 | `/royxat` 201 `{"id":11,"ism":"Ali"}` · Vali 201 id 12 · `/kirish` 200 token · takror ro'yxat → **409 «Bu telefon ro'yxatdan o'tgan»** |
| 03 | `npm i socket.io-client` → 4.8.4 |
| 04 | `ulangan (connect)` · Backend `LOG [Ulanish] ulandi: o'yinchi 11` |
| 05 | Ctrl+C → `transport close · active=true` → urinishlar 1 s, 2 s, keyin **har 5 s** (standart `reconnectionDelayMax` 5000) → Backend ~21.6 s da tayyor → **26.2 s da** `ulangan` (Backend yongach 5 s gacha kechikish) |
| 06 | `TOKEN=` → `ulangan` va darhol `ulanmagan (io server disconnect · active=false)` |
| 07 | `m12-dars-03-done`, `npm ci`, `.env` joyida qoldi (gitignore), start ✓ |
| 08 | 2-o'yin 6/10 · Vali `qoshilish` 201 `{"holat":"qoshildi"}` · Ali klientida `HODISA oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}` · takror → **409 «Siz bu o'yinga qo'shilgansiz»** |
| 09 | sinf xatolari: `.env` yo'q → `JWT_SECRET yo'q — backend/.env ga yozing` · parol noto'g'ri → `password authentication failed for user "postgres"` + `Unable to connect to the database. Retrying (N)...` · PostgreSQL o'chiq → `ECONNREFUSED` + o'sha Retrying |

**Tuzatilgan oldingi da'vo:** `ws1-out/04` da klient `reconnectionDelayMax: 2000` bilan yurgan edi (urinish har 2 s) — bu o'quvchi ilovasidagi standart emas. MD 10/13-ekranlari `ws1-amal-out/05` (standart, har 5 s) ga o'tkazildi.
**Birinchi yurgizishdagi skript xatolari (natijaga kirmagan):** `cd maydon-jamoa/backend` checkout'dan oldin (main'da papka yo'q) va Backend klient papkasidan qayta yoqilgan — ikkalasi tuzatildi, yuqoridagi natija — uchinchi yurgizish.
