# Mentor darsi · WebSocket-1: doimiy ulanish — PRD v1 (01.11 avtopilot; savollar berilmagan, tasdiqlanmagan)

> PRD Ilova A shabloni · kursdagi ichki tartib №10 (M31: raqam yozilmaydi). Haqiqiy chiqishlar `manba/ws1-out/` (skript `manba/drive-ws1.sh`).

**O'quvchi darsi:** **m10-02** «WebSocket: ekran o'zi yangilanadigan ulanish» (`src/10-Modull/WebSocketBasicsLesson.jsx`, 20 ekran). Ip: **Maydon Jamoa** (o'quvchilar 11-Modulda qurgan ilova: Expo + NestJS + Neon + Render). So'rovsiz yo'l yopiq → doimiy ulanish (ikki tomon) → hodisa «konvert» (`oyin-ozgardi { oyinId, sabab }`, son yo'q — ilova qayta so'raydi) → token bilan ulanish (socket.io, NestJS gateway) → tinglovchi (`ulanish.on(...)`, namuna oynada) → uch holat (ulangan · ulanmoqda · ulanmagan) → real vaqt sxemasi (besh ustun) → A1 o'z repo: gateway + `ulanish.ts` + belgi, Render, telefonda uchish rejimi · A2 README «Real vaqt» · uyga vazifa: ikki qurilmada isbot. Mentor misoli — `maydon-jamoa`, teg `m12-dars-02-done` (hodisa hali yuborilmaydi); `m12-dars-03-done` — hodisa yuboriladi.
**Oldin:** Telegraf+PG. **Keyin:** WebSocket-2 (m10-05, «Ulanish uzilsa»).

1. **Biladi (3 gap):** so'rov–javobda Backend o'zi yubora olmaydi; doimiy ulanishda ikkalasi istagan payt yuboradi. Token ulanish ochilayotganda tekshiriladi; yaroqsiz bo'lsa Backend yopadi va ilova o'zi qayta ulanmaydi. Uch holat: ulangan · ulanmoqda (o'zi urinadi) · ulanmagan; «uchish rejimi»ni socket.io ~45 s da sezadi. Hodisa faqat «nima o'zgardi» deydi — son qayta so'raladi.
2. **Qo'li bilan (3 amaliyot):** P1 `maydon-jamoa` backend lokal + ulanish (token bilan va tokensiz) → isbot Backend terminalidagi satr · P2 Backend'ni to'xtatib/yoqib holatlarni kuzatish → isbot `transport close` · P3 `m12-dars-03-done` da ikki akkaunt → hodisa → isbot `oyin-ozgardi` satri.
3. **Haqiqiy loyiha:** `maydon-jamoa` backend kodi, lokal PostgreSQL; ilova (Expo) o'rniga Node `socket.io-client` (xuddi shu `ulanish.ts` qoidasi). Telefon, Render — sinalmagan (⚠).
4. **Buzamiz:** tokensiz/soxta token · Backend to'xtadi · «uchish rejimi» (muzlatish, 45 s) · m12-02 da hodisa yo'q · gateway'da `return` unutildi (`ulandi: o'yinchi null`).
5. **Ko'prik:** m10-02 xaritasi · real vaqt sxemasi (README) · o'quvchi tili (yo'l, konvert, belgi) · sinfdagi holatlar (Render uxlashi ⚠, uchish rejimi kechikishi, «Ulanmagan»).
6. **Tekshiruv 4 + o'z-sinov 8.**
7. **Uyga vazifa:** o'z loyihasida belgi + bitta hodisa (m12-03 dagidek) → ikki qurilmada isbot → GitHub linki (M30).
8. **Hajm (taxmin):** ~23 ekran · ~1 soat.
9. **Ochiq / avtopilot takliflari:**
   - **Q1** — mentor amaliyoti telefon/Render'siz: lokal backend + Node klient (sinalgan). Telefon va Render — o'quvchi bilan sinfda (⚠).
   - **Q2** — `m12-dars-03-done` (hodisa yuboriladi) shu darsda ko'rsatiladi: o'quvchi m10-02 da hodisani namuna oynada yozadi, haqiqiy yuborish keyingi tegda — mentor ikkalasini bilsin.
