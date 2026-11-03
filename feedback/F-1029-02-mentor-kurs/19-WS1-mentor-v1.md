# Mentor kursi · WebSocket-1 «Doimiy ulanish: Backend o'zi xabar yuboradi» — MD v1

F-ID: F-1029-02 (WebSocket-1) · Sana: 2026-11-01 (avtopilot) · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `18-WS1-PRD.md` v1 (avtopilot takliflari Q1–Q2)
Fayl (quriladi): `src/mentor-kurs/WsBasicsMentorLesson.jsx` · bo'laklar `src/mentor-kurs/ws1/parts/` · dvigatel — umumiy `parts/01–02`
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/ws1-out/` (skript `manba/drive-ws1.sh`) · amaliyotlar mentor yo'lida: `manba/ws1-amal-out/` (`manba/drive-ws1-amaliyot.sh`, klient `manba/ws1-klient.js`)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | NestJS va REST'ni biladigan mentor; token bilan yopiq yo'llarni ko'rgan. WebSocket bilan ishlamagan. |
| Dars oxirida mentor | 1) so'rov–javob va doimiy ulanish farqini ko'rsatadi · 2) gateway'da token qanday tekshirilishini o'qiydi · 3) uch holatni (ulangan · ulanmoqda · ulanmagan) va ularning sababini biladi · 4) hodisa — «nima o'zgardi», son qayta so'raladi · 5) `maydon-jamoa` backend'ini lokal ishga tushirib sinaydi · 6) m10-02 ni o'tadi |
| O'quvchi darsi | **m10-02** «WebSocket: ekran o'zi yangilanadigan ulanish» (20 ekran). |
| Kursdagi o'rni | Telegraf+PG → **shu** → WebSocket-2 (M31: raqamsiz) |
| Til | M9. Atamalar: doimiy ulanish (WebSocket), socket.io, gateway, hodisa (event), tinglovchi (`on`), ulanish holati. |
| Misol-ip | **O'quvchi darsidagi aynan:** Maydon Jamoa, «8 / 10», Ali va Vali (ikkinchi akkaunt), hodisa `oyin-ozgardi { oyinId, sabab }`; repo `maydon-jamoa` — `m12-dars-02-done` (ulanish, hodisa yo'q) va `m12-dars-03-done` (hodisa bor). |
| Haqiqiylik (M10) | 01.11.2026: backend (NestJS 12, `@nestjs/websockets` 12.1.3, socket.io 4.8.4) + lokal PostgreSQL; ilova o'rniga Node `socket.io-client` — `mobil/src/ulanish.ts` qoidasi bilan. Telefon (Expo), Render — sinalmagan, «⚠». |
| Hajm | **22 ekran** · 5 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · jami ≈ 1 soat |
| Me'yor | ≤ 5 segment, ≤ 60 so'z, ko'prik, «Xulosa», kalit 8–14 so'z |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **so'rov–javob** — yo'l faqat ilova so'raganda ochiladi; Backend o'zi yubora olmaydi. Vali qo'shilsa, Ali'ning ekrani eski qoladi.
- **doimiy ulanish** — ilova bir marta ulanadi, yo'l ochiq turadi; ikkala tomon istagan payt xabar yuboradi. socket.io imkon bo'lsa WebSocket orqali (`transport: websocket`).
- **gateway** — Backend'da ulanishlarni qabul qiladigan klass; token ulanish ochilayotganda (`handshake.auth.token`) tekshiriladi, yaroqsiz bo'lsa `disconnect()`.
- **uch holat** — ulangan · ulanmoqda (socket.io o'zi qayta urinadi, `active=true`) · ulanmagan (Backend yopdi yoki ilova o'zi yopdi, `active=false`).
- **hodisa** — `oyin-ozgardi { oyinId, sabab }`: faqat nima o'zgardi; yangi son `GET /oyinlar` bilan qayta so'raladi.

**Darsning ipi:** so'rovsiz eski son → doimiy ulanish → gateway va token → tokensiz/soxta token → uch holat (Backend o'chadi, «uchish rejimi») → hodisa (m12-03) → m10-02 ga ko'prik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | So'ramasa — yangilanmaydi | Lesson | 1 · ulanish |
| 3 | Doimiy ulanish | Lesson | 1 |
| 4 | Tekshiruv 1 — Backend qachon yuboradi | MCRetry | 1 |
| 5 | Gateway: token ulanishda tekshiriladi | Lesson | 2 · gateway |
| 6 | Tokensiz va soxta token | Lesson | 2 |
| 7 | Amaliyot 1 — backend lokal, ulanish | Practice | 2 |
| 8 | Tekshiruv 2 — qaysi satr | LineCheck | 2 |
| 9 | Uch holat | Lesson | 3 · holat |
| 10 | Backend o'chdi va qayta yondi | Lesson | 3 |
| 11 | «Uchish rejimi» — 45 soniya | Lesson | 3 |
| 12 | Tekshiruv 3 — tokensiz ulanishda belgi | MCRetry | 3 |
| 13 | Amaliyot 2 — holatlarni kuzatish | Practice | 3 |
| 14 | Hodisa — konvertda son yo'q | Lesson | 4 · hodisa |
| 15 | `m12-dars-02` — hodisa hali yo'q | Lesson | 4 |
| 16 | Tekshiruv 4 — hodisa kelgach | MCRetry | 4 |
| 17 | Amaliyot 3 — hodisani ko'rish | Practice | 4 |
| 18 | m10-02 xaritasi | Lesson | 5 · ko'prik |
| 19 | Real vaqt sxemasi (README) | Lesson | 5 |
| 20 | O'quvchi darsidagi so'zlar va sinfdagi holatlar | Lesson | 5 |
| 21 | O'z-sinov — 8 savol | Screen27 | — |
| 22 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code `maydon-jamoa` (to'liq Explorer: `backend/`, `mobil/`) + terminal (Backend logi, klient chiqishi) + ikki telefon maketi (Ali · Vali, ⚠; sonlar — haqiqiy chiqishdan).

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · WebSocket` · Sarlavha: **Vali qo'shildi. Ali'ning ekrani buni qachon biladi?**
- Sahna: reja (5 bosqich); natija — terminal (`06`): `HODISA oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}` → `6 / 10` dan `7 / 10`.
- Reja: 01 So'rov va doimiy ulanish · 02 Gateway va token · 03 Uch holat · 04 Hodisa · 05 O'quvchi darsini o'tish
1. **Ekran o'zi yangilanishi uchun Backend o'zi xabar yuborishi kerak — bugun shuni ko'ramiz**
   Ovoz: «Assalomu alaykum. Maydon Jamoa ilovasida Vali o'yinga qo'shildi. Ali'ning ekrani buni qachon biladi? Bugun Backend o'zi xabar yuboradigan doimiy ulanishni ko'ramiz.»
2. **Avval so'rov va ulanish farqi, keyin gateway va token**
   Ovoz: «Avval oddiy so'rov va doimiy ulanish farqi. Keyin Backend'dagi gateway: ulanishni kim qabul qiladi va tokenni qanday tekshiradi.» · reja 01–02
3. **Keyin uch holat va hodisa — hammasi o'quvchi loyihasida, haqiqiy yurgizilgan**
   Ovoz: «Keyin ulanishning uch holati va hodisa. Hammasini o'quvchilar loyihasi maydon jamoa'da haqiqiy yurgizdik, sizda ham shunday bo'ladi.» · reja 03–04
4. **Besh bosqich, uch amaliyot. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars besh bosqichdan iborat, uchta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 05
- Manba: `ws1-out/06-hodisa-bor-m12-03.txt`.

---

## 2 · So'ramasa — yangilanmaydi  ← `Lesson`
- Kicker: `1-bosqich · ulanish` · Sarlavha: **Vali qo'shildi (201) — Ali'da son eski, faqat pastga tortsa yangilanadi**
- Sahna: ikki telefon maketi (Ali · Vali) + terminal (haqiqiy, `05`):
  ```
  [Ali] GET /oyinlar (ochilganda) → Mahalla maydoni 2026-11-08 17:00: 9 / 10
  [Vali] POST /oyinlar/4/qoshilish → 201
  [Ali] 2,5 s kutdi — hodisa kelmadi, ekrandagi son o'zgarmadi
  [Ali] GET /oyinlar (pastga tortildi) → Mahalla maydoni 2026-11-08 17:00: 10 / 10
  ```
1. **O'quvchilar 11-Modulda qurgan ilova: son faqat so'rov bilan keladi**
   Ovoz: «Savoldan boshlaymiz: hozir ilova sonni qanday oladi? Maydon Jamoa'ni o'quvchilar o'n birinchi modulda qurgan. Ilova so'raydi, Backend javob beradi. Ali ekranni ochdi: to'qqizdan o'n.»
2. **Vali qo'shildi — Backend biladi, lekin Ali'ga yubora olmaydi**
   Ovoz: «Vali o'yinga qo'shildi, Backend ikki yuz bir qaytardi va bazada son o'zgardi. Lekin Ali so'ramagan, demak unga yo'l yopiq. Ali'ning ekranida to'qqiz qoldi.»
3. **Ali pastga tortdi — yangi so'rov, yangi son: o'n**
   Ovoz: «Ali pastga tortdi, ya'ni yangi so'rov yubordi va o'nni oldi. So'ramaguncha yangi son kelmaydi. O'quvchi darsi shu holatdan boshlanadi.»
4. **Xulosa: so'rov–javobda yo'l faqat ilova so'raganda ochiladi — Backend kutadi**
   Ovoz: «Xulosa: so'rov va javobda yo'l faqat ilova so'raganda ochiladi. Backend o'zi xabar yubora olmaydi. Buning uchun ochiq turadigan yo'l kerak.»
- Manba: `ws1-out/05-hodisa-yoq.txt`; o'quvchi darsi Screen2–3.

## 3 · Doimiy ulanish  ← `Lesson`
- Kicker: `1-bosqich · ulanish` · Sarlavha: **Ilova bir marta ulanadi — yo'l ochiq turadi, ikkala tomon yuboradi**
- Sahna: `mobil/src/ulanish.ts` (`io(API, { auth: { token } })`) + terminal (`03`): `ulangan (connect)` · `transport: websocket`.
1. **Doimiy ulanish: ilova bir marta ulanadi va yo'l ochiq qoladi**
   Ovoz: «Yo'l faqat so'rovda ochilsa, Backend Ali'ga yetolmaydi. Demak ochiq turadigan yo'l kerak. Doimiy ulanishda ilova bir marta ulanadi va yo'l ochiq qoladi, ikkala tomon istagan payt yuboradi.»
2. **socket.io — kutubxona: imkon bo'lsa WebSocket orqali ulanadi**
   Ovoz: «O'quvchi loyihasida ulanishni socket io kutubxonasi ochadi. Imkon bo'lsa WebSocket orqali ulanadi. Haqiqiy yurgizishda transport websocket chiqdi.»
3. **Ilovada bitta qator: `io(manzil, { auth: { token } })` — token ulanishda yuboriladi**
   Ovoz: «Ilova tomonida asosiy qator bitta: io, Backend manzili va auth ichida token. Token so'rov sarlavhasida emas, ulanish ochilayotganda yuboriladi.»
4. **Xulosa: doimiy ulanish — ochiq yo'l; Backend xabarni o'zi yubora oladi**
   Ovoz: «Xulosa: doimiy ulanish ochiq yo'l, Backend xabarni o'zi yubora oladi. Lekin u yo'lni kimga ochadi? Buni gateway hal qiladi.»
- Manba: `ws1-out/03-token-bilan.txt`; repo `mobil/src/ulanish.ts`.

## 4 · Tekshiruv 1 — Backend qachon yuboradi  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Ulanish ochiq turibdi. Backend ilovaga qachon xabar yubora oladi?**
- Ovoz: «Doimiy ulanishni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Ulanish ochiq turibdi. Backend ilovaga qachon xabar yubora oladi? Variantni tanlang.»
- Variantlar (to'g'risi — 4): 1 Faqat ilova so'raganda · 2 Faqat ilova ochilganda · 3 Har daqiqada bir marta · 4 Istagan payt — so'rovni kutmaydi
- To'g'ri (ovoz, `ok`): «To'g'ri. Ulanish ochiq turganda Backend xabarni istagan paytda yuboradi. So'rov va javobda esa Backend faqat ilova so'raganda javob beradi. Demak, doimiy ulanishning asosiy farqi shu: Backend birinchi bo'lib yoza oladi.» · qisqa: «Ochiq ulanishda — istagan payt, so'rovsiz.»
- Xato izohlari: 1 — «Bu so'rov–javob (2-ekran).» · 2 — «Ochilganda faqat ulanadi; xabar keyin ham keladi.» · 3 — «Jadval yo'q — o'zgarish bo'lganda.»
- Maslahat: «Ochiq yo'l — kim uchun ochiq?»
- Manba: o'quvchi darsi Screen4.

---

## 5 · Gateway: token ulanishda tekshiriladi  ← `Lesson`
- Kicker: `2-bosqich · gateway` · Sarlavha: **Gateway: token yo'q yoki yaroqsiz — `disconnect()` va `return`**
- Sahna: VS Code — `backend/src/oyinlar.gateway.ts` (repo, aynan), qism-qism yoritiladi.
1. **Gateway — Backend'da ulanishlarni qabul qiladigan klass, HTTP bilan bitta portda**
   Ovoz: «Ilova token bilan ulanishni ko'rdik. Endi Backend tomoni: bu ulanishni kim qabul qiladi? Gateway. Bu NestJS klassi, HTTP server bilan bitta portda turadi. O'quvchi loyihasida u oyinlar gateway.»
2. **`handleConnection` — har ulanishda ishlaydi: token `handshake.auth` dan olinadi**
   Ovoz: «Handle connection har yangi ulanishda ishlaydi. Token handshake auth ichidan olinadi, ya'ni ilova io'ga bergan auth.»
3. **Token yo'q yoki yaroqsiz — `ulanish.disconnect()` va `return`**
   Ovoz: «Token JWT kaliti bilan tekshiriladi, yopiq so'rovlardagi kabi. Yo'q yoki yaroqsiz bo'lsa, Backend ulanishni yopadi va funksiyadan chiqadi.»
4. **Xulosa: token har so'rovda emas — ulanish ochilayotganda bir marta tekshiriladi**
   Ovoz: «Xulosa: bu yerda token har so'rovda emas, ulanish ochilayotganda bir marta tekshiriladi. Yaroqli bo'lsa, o'yinchi id ulanishga yozib qo'yiladi.»
- Manba: repo `backend/src/oyinlar.gateway.ts` (m12-dars-02-done).

## 6 · Tokensiz va soxta token  ← `Lesson`
- Kicker: `2-bosqich · gateway` · Sarlavha: **Klient bir lahza «ulangan», keyin `io server disconnect` — «ulanmagan»**
- Sahna: terminal (haqiqiy, `02`) va (`03`):
  ```
  [tokensiz] ulangan  (connect)
  [tokensiz] ulanmagan  (disconnect: io server disconnect · active=false)
  [soxta token] ulangan  (connect)
  [soxta token] ulanmagan  (disconnect: io server disconnect · active=false)
  ```
  Backend terminali (token bilan): `LOG [Ulanish] ulandi: o'yinchi 11`.
1. **Token bilan ulandik: Backend terminalida «ulandi: o'yinchi 11» chiqdi**
   Ovoz: «Gateway kodini o'qidik, endi uni haqiqiy yurgizib sinaymiz. Avval token bilan ulandik. Backend terminalida yozuv chiqdi: ulandi, o'yinchi o'n bir. Bu Ali, u ro'yxatdan o'tgan va kirgan.»
2. **Tokensiz: klient bir lahza «ulangan» bo'ladi, keyin Backend yopadi**
   Ovoz: «Endi tokensiz. Qiziq tomoni: klient bir lahza ulangan bo'ladi, chunki ulanish ochilib bo'lgan. Keyin Backend tekshiradi va yopadi: io server disconnect.»
3. **`active=false` — ilova o'zi qayta urinmaydi: belgi «Ulanmagan»**
   Ovoz: «Active false: Backend yopgan ulanishga socket io o'zi qayta urinmaydi. Ilovadagi belgi ulanmagan bo'ladi. Soxta token bilan ham aynan shunday.»
4. **Xulosa: tokensiz ulanish bir lahza ochiladi va darhol yopiladi — ilova «Ulanmagan»**
   Ovoz: «Xulosa: tokensiz yoki soxta token bilan ulanish bir lahza ochiladi va darhol yopiladi. Sinfda belgi bir lahza yashil bo'lib o'chsa, sabab shu.»
- Manba: `ws1-out/02-tokensiz-soxta.txt`, `03-token-bilan.txt`.

## 7 · Amaliyot 1 — backend lokal, ulanish  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **`maydon-jamoa` backend'i lokal: ro'yxat, kirish, token bilan ulanish** · `tableAt: 3`
1. **Endi siz: o'quvchi loyihasining backend'ini o'z kompyuteringizda ishga tushirasiz**
   Ovoz: «Token bilan va tokensiz ulanishni ko'rdingiz, endi navbat sizga. Maydon jamoa backend'ini o'z kompyuteringizda ishga tushirasiz va Node'dagi kichik klient bilan ulanasiz. O'n besh daqiqa.»
2. **1–2-qadam: clone, `m12-dars-02-done`, `npm ci`; keyin baza, `.env` va ishga tushirish**
   Ovoz: «Birinchi: clone, m12 dars ikki done tegi, keyin backend papkasida npm ci. Ikkinchi: lokal PostgreSQL'da maydon jamoa bazasi, env fayli namunadan, keyin npm run start.»
3. **3–4-qadam: ro'yxat va kirish, keyin klient bilan ulanish; isbot — Backend terminalidagi satr**
   Ovoz: «Uchinchi: curl bilan ro'yxat va kirish, token olinadi. To'rtinchi: klient bilan ulanish. Isbot maydoniga Backend terminalidagi ulandi satrini nusxalang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi loyihasining backend'i sizning kompyuteringizda ishlaydi va siz unga token bilan ulangan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Repo | `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-02-done` · `cd backend` · `npm ci` | `added 282 packages` |
  | 2 | Baza va start | `psql -U postgres -c "CREATE DATABASE maydon_jamoa;"` · `cp .env.example .env` (`DATABASE_URL` dagi parolni o'zingiznikiga) · `npm run start` | `Nest application successfully started` |
  | 3 | Ro'yxat va kirish | `curl -X POST localhost:3000/royxat -H "Content-Type: application/json" -d '{"ism":"Ali","telefon":"+998 90 000 00 01","parol":"parol123"}'` · xuddi shunday `/kirish` | `201` · `{"token":"eyJ…"}` |
  | 4 | Ulanish | yangi papka: `npm i socket.io-client` · `klient.js` — «Kodni ochish» · `TOKEN=<token> node klient.js` | klient `ulangan  (connect)` · Backend `ulandi: o'yinchi 11` |
- Isbot: «Backend terminalidagi ulanish satri» · placeholder: «Backend terminalidan satrni qo'ying» · KOD: `/ulandi: o'yinchi \d+/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `backend` papkasi yo'q | `main` tarmog'ida `backend/` yo'q — avval `git checkout -f m12-dars-02-done` |
  | `JWT_SECRET yo'q — backend/.env ga yozing` | `.env` yo'q — `cp .env.example .env` |
  | `password authentication failed` · `Retrying (1)...` | `.env` dagi `DATABASE_URL` parolini o'zingizniki bilan almashtiring |
  | `409` «Bu telefon ro'yxatdan o'tgan» | ro'yxat bor — to'g'ridan `/kirish` |
  | Klient `ulanmagan (io server disconnect)` | token bo'sh yoki eskisi — `/kirish` dan qayta oling (6-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `ws1-amal-out/01–04`, `09`; `manba/ws1-klient.js` (`klient.js` — aynan).

## 8 · Tekshiruv 2 — qaysi satr  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Tokensiz ulanishda Backend «ulandi: o'yinchi null» deb yozdi**
- Shart (`task`): «Qoida: token yaroqsiz bo'lsa, ulanish yopiladi va funksiya **shu yerda to'xtaydi**. Bu kodda tokensiz ulanish yopildi, lekin Backend terminalida `ulandi: o'yinchi null` chiqdi. **Funksiya to'xtashi kerak bo'lgan satrni bosing.**»
- Ovoz (`q`): «Gateway'ni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Tokensiz ulanish yopildi, lekin Backend terminali ulandi, o'yinchi null dedi. Funksiya to'xtashi kerak bo'lgan satrni bosing.»
- Fayl: `backend/src/oyinlar.gateway.ts` (`ws1-out/08`):
  ```ts
  1  handleConnection(ulanish: Socket) {
  2    const token = ulanish.handshake.auth?.token;
  3    const oyinchiId = this.tokenYaroqli(token);
  4    if (!oyinchiId) {
  5      ulanish.disconnect();          ← shu satrdan keyin return yo'q
  6    }
  7    // Token egasi — keyingi darslarda kerak bo'ladi (xona, o'z harakati)
  8    ulanish.data.oyinchiId = oyinchiId;
  9    this.log.log(`ulandi: o'yinchi ${oyinchiId}`);
 10  }
  ```
  Backend terminali (tokensiz va soxta token, `08`): `LOG [Ulanish] ulandi: o'yinchi null` — ikki marta.
- Tuzatilgan (`fixed`): 5-satrdan keyin yashil `return;` (6-satr, keyingilar bittaga suriladi — har satrga `n`); `fixedExtra`: return bilan tokensiz klient `ulanmagan`, Backend terminalida `ulandi` satri yo'q (`ws1-amal-out/06`).
- To'g'ri (ovoz, `ok`): «To'g'ri. Beshinchi satr: disconnect'dan keyin return yo'q. Ulanish yopildi, lekin funksiya davom etib, yolg'on yozuv qoldirdi. Return qo'shilsa, tokensiz ulanish yozilmaydi. Demak, ulanishni yopgan satrdan keyin funksiya return bilan to'xtashi kerak.»
- Qisqa (`okShort`): «5-satrdan keyin `return` yo'q — funksiya davom etdi, `ulandi: o'yinchi null`.»
- Maslahat (`hint`): «Ulanish yopilgandan keyin qaysi satrlar baribir ishladi?»
- Manba: `ws1-out/08-return-yoq.txt`, `03`.

---

## 9 · Uch holat  ← `Lesson`
- Kicker: `3-bosqich · holat` · Sarlavha: **Ulangan · Ulanmoqda · Ulanmagan — farq `active` da**
- Sahna: `mobil/src/ulanish.ts` (`uzilishdanKeyin`: `ulanish?.active ? 'ulanmoqda' : 'ulanmagan'`) + uch belgi (o'quvchi ilovasidagi ranglar: yashil · sariq · kulrang).
1. **Doimiy ulanish ham uziladi — ilova uch holatni ko'rsatadi**
   Ovoz: «Ulanish ochildi va token tekshirildi. Lekin u doim ochiq turadimi? Yo'q: internet yo'qoladi, Backend qayta ishga tushadi. Shuning uchun ilovada belgi bor va u uch holatni ko'rsatadi.»
2. **Ulangan — hodisalar keladi; ulanmoqda — socket.io o'zi qayta urinmoqda**
   Ovoz: «Ulangan: yo'l ochiq, hodisalar keladi. Ulanmoqda: yo'l yo'q, lekin socket io o'zi qayta urinyapti. O'quvchi kodi buni active qiymatidan biladi.»
3. **Ulanmagan — hech kim urinmayapti: Backend yopgan yoki ilova o'zi yopgan**
   Ovoz: «Ulanmagan: hech kim urinmayapti. Backend yopgan, masalan token yaroqsiz, yoki ilovaning o'zi yopgan, masalan hisobdan chiqilgan.»
4. **Xulosa: «Ulanmoqda» — o'tib ketadi; «Ulanmagan» — kimdir nimadir qilishi kerak**
   Ovoz: «Xulosa: ulanmoqda o'tib ketadigan holat, kutish kifoya. Ulanmagan esa harakat talab qiladi: qayta kirish yoki tokenni yangilash.»
- Manba: repo `mobil/src/ulanish.ts`, `mobil/src/app/index.tsx` (`BELGI`).

## 10 · Backend o'chdi va qayta yondi  ← `Lesson`
- Kicker: `3-bosqich · holat` · Sarlavha: **`transport close` → «Ulanmoqda»: urinish har 5 soniya, Backend yongach o'zi «Ulangan»**
- Sahna: terminal (haqiqiy, `ws1-amal-out/05`, socket.io standart sozlamasi — o'quvchi ilovasidagi kabi):
  ```
  $ TOKEN=<Ali tokeni> node klient.js   # 3 s da Backend terminalida Ctrl+C, 15 s dan keyin npm run start
    0.0s  ulangan  (connect)
    2.8s  ulanmoqda  (disconnect: transport close · active=true)
    3.9s  ulanmoqda  (connect_error: xhr poll error · active=true)
    6.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
   11.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
   16.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
   21.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
   26.2s  ulangan  (connect)
  ```
  yonida: Backend ~21.6 s da tayyor bo'ldi (`npm run start` ~3.5 s).
1. **Backend'da Ctrl+C: klientda `transport close`, `active=true` — belgi «Ulanmoqda»**
   Ovoz: «Uch holatni nazariyada ko'rdik, endi ulanmoqda holatini haqiqiy chaqiramiz. Backend terminalida Ctrl C bosdik. Klient darhol sezdi: transport close, active true. Belgi ulanmoqda.»
2. **socket.io o'zi qayta urinadi: avval tez, keyin har 5 soniyada**
   Ovoz: «Keyin socket io o'zi qayta urinadi: avval bir-ikki soniyada, keyin har besh soniyada. Har urinishda connect error, lekin belgi ulanmoqda'da qoladi.»
3. **Backend yondi — keyingi urinishda o'zi «Ulangan»: 5 soniyagacha kechikadi**
   Ovoz: «Backend qayta yondi, klient esa keyingi urinishda o'zi ulandi. Hech kim hech narsa bosmadi. Faqat kechikish bor: Backend tayyor bo'lgach, besh soniyagacha.»
4. **Xulosa: Backend qayta yonsa, ilova o'zi qaytadi — bir necha soniya sariq normal**
   Ovoz: «Xulosa: Backend qayta ishga tushsa, ilova o'zi qaytadi. O'quvchi belgi bir necha soniya sariq turdi desa, bu xato emas: navbatdagi urinishni kutyapti.»
- Manba: `ws1-amal-out/05-ctrlc-qayta.txt` (standart `reconnectionDelayMax` 5000); `ws1-out/04` — tezlashtirilgan sozlama (2 s), darsda ishlatilmaydi.

## 11 · «Uchish rejimi» — 45 soniya  ← `Lesson`
- Kicker: `3-bosqich · holat` · Sarlavha: **Javob yo'q, ulanish yopilmagan — socket.io buni 45 soniyada sezdi**
- Sahna: terminal (haqiqiy, `07`):
  ```
   2.8s  --- Backend muzlatildi (javob bermaydi, ulanish yopilmagan) ---
  45.0s  [Ali] ulanmoqda  (disconnect: ping timeout · active=true)
  62.8s  --- Backend davom etdi ---
  62.8s  [Ali] ulangan  (connect)
  ```
  yonida: `pingInterval: 25000` + `pingTimeout: 20000` (engine.io kodi).
1. **O'quvchi darsida telefonda uchish rejimi yoqiladi — belgi darhol o'zgarmasligi mumkin**
   Ovoz: «Backend o'chganda klient darhol sezdi. Uchish rejimida esa unday emas. O'quvchi darsi ogohlantiradi: belgi darhol o'zgarmasligi mumkin, bir daqiqagacha. Nega? Sinab ko'rdik.»
2. **Ulanish yopilmasa, klient faqat «ping» javobi kelmaganidan biladi**
   Ovoz: «Backend'ni muzlatdik: ulanish yopilmadi, faqat javob kelmaydi. Uchish rejimida ham shunday. Klient buni faqat ping javobi kelmaganidan biladi.»
3. **45 soniyada `ping timeout`: 25 soniya oraliq va 20 soniya kutish**
   Ovoz: «Natija: qirq besh soniyada ping timeout. Socket io standarti: yigirma besh soniya oraliq va yigirma soniya kutish. Backend qaytgach esa darhol ulangan.»
4. **Xulosa: «uchish rejimi» belgisi 45 soniyagacha kech qoladi — bu normal**
   Ovoz: «Xulosa: uchish rejimida belgi qirq besh soniyagacha kech qoladi. O'quvchi «belgi o'zgarmadi» desa, bir daqiqa kutishni ayting.»
- Manba: `ws1-out/07-muzlash-ping.txt`; `node_modules/engine.io/build/server.js` (`pingInterval: 25000`, `pingTimeout: 20000`); o'quvchi darsi A1 3-qadam.

## 12 · Tekshiruv 3 — tokensiz ulanishda belgi  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **Token yaroqsiz, Backend ulanishni yopdi. Belgi qaysi holatda qoladi?**
- Ovoz: «Uch holatni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. Token yaroqsiz, Backend ulanishni yopdi. Ilovadagi belgi qaysi holatda qoladi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Ulangan · 2 Ulanmoqda — ilova o'zi qayta urinadi · 3 Ulanmagan — Backend yopgan ulanishga qayta urinilmaydi · 4 Belgi yo'qoladi
- To'g'ri (ovoz, `ok`): «To'g'ri, ulanmagan. Backend o'zi yopgan ulanishga socket io qayta urinmaydi, active qiymati false bo'ladi. O'quvchi qayta kirib, yangi token olishi kerak. Demak, Backend o'zi yopgan ulanish o'z-o'zidan tiklanmaydi.» · qisqa: «Ulanmagan — `io server disconnect`, `active=false`.»
- Xato izohlari: 1 — «Bir lahza bo'ladi, keyin yopiladi (6-ekran).» · 2 — «Bu Backend o'chganda (10-ekran).» · 4 — «Belgi doim bor — uch holatdan biri.»
- Maslahat: «Ulanishni kim yopdi — Backend'mi yoki tarmoq?»
- Manba: `ws1-out/02`.

## 13 · Amaliyot 2 — holatlarni kuzatish  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Backend'ni to'xtating va yoqing — klient nima deydi** · `tableAt: 3`
1. **Endi siz: Backend'ni o'zingiz to'xtatib, klientning holatlarini kuzatasiz**
   Ovoz: «Holatlarni ekranda ko'rdingiz, endi ularni o'zingiz chaqirasiz. O'n daqiqa. Bir terminalda Backend, ikkinchisida klient.»
2. **1–2-qadam: klient ulangan; Backend'ni Ctrl+C bilan to'xtating — «ulanmoqda»**
   Ovoz: «Birinchi: klientni token bilan yoqing, ulangan. Ikkinchi: Backend terminalida Ctrl C. Klientda ulanmoqda va sababini o'qing.»
3. **3–4-qadam: Backend'ni yoqing — o'zi «ulangan»; isbot — uzilish sababi**
   Ovoz: «Uchinchi: Backend'ni qayta yoqing, klient o'zi ulanadi. To'rtinchi: tokensiz sinab ko'ring, ulanmagan. Isbot maydoniga ikkinchi qadamdagi uzilish sababini yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz Backend o'chganda va qayta yonganda klient qanday holatlardan o'tishini o'z ko'zingiz bilan ko'rgan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Ulanish | `TOKEN=<token> node klient.js` | `ulangan  (connect)` |
  | 2 | To'xtatish | Backend terminalida Ctrl+C | `ulanmoqda  (disconnect: transport close · active=true)`, keyin `connect_error` |
  | 3 | Yoqish | `npm run start` | 5 s gacha ichida `ulangan  (connect)` |
  | 4 | Tokensiz | klientni Ctrl+C · `TOKEN= node klient.js` | `ulangan`, darhol `ulanmagan  (disconnect: io server disconnect · active=false)` |
- Isbot: «2-qadamdagi uzilish sababi» · placeholder: «disconnect: dan keyingi so'zlarni yozing» · KOD: `/transport close/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 3-qadamda bir necha soniya yana `connect_error` | Backend yonguncha va navbatdagi urinishgacha (har 5 s) — kuting (10-ekran) |
  | 4-qadamda `ulanmagan` bo'lmadi, `ulangan` qoldi | `TOKEN=` bo'sh emas — eski token qolgan; buyruqni aynan `TOKEN= node klient.js` deb yozing |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `ws1-amal-out/05`, `06`.

---

## 14 · Hodisa — konvertda son yo'q  ← `Lesson`
- Kicker: `4-bosqich · hodisa` · Sarlavha: **`oyin-ozgardi { oyinId, sabab }`: nima o'zgardi — son esa qayta so'raladi**
- Sahna: terminal (haqiqiy, `06`, `m12-dars-03-done`):
  ```
   1.0s  [Ali] GET /oyinlar (ochilganda) → Maktab maydoni 2026-11-07 20:00: 6 / 10
   1.1s  [Ali] HODISA oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}
   1.1s  [Vali] POST /oyinlar/2/qoshilish → 201
   1.1s  [Ali] GET /oyinlar (hodisa kelgach) → Maktab maydoni 2026-11-07 20:00: 7 / 10
  ```
  + gateway `oyinOzgardi`: `this.server.emit('oyin-ozgardi', { oyinId, sabab })` (repo m12-03).
1. **Repo'ning keyingi tegida Backend o'zi hodisa yuboradi: `oyin-ozgardi`**
   Ovoz: «Ulanish tayyor, endi undan nima keladi. O'quvchi repo'sining keyingi tegida Backend hodisa yuboradi: oyin ozgardi. Vali qo'shildi, Ali'ga darhol keldi.»
2. **Konvertda faqat `oyinId` va `sabab` — yangi son yo'q**
   Ovoz: «Hodisa ichida faqat ikki narsa: qaysi o'yin va sabab, qo'shildi. Yangi son yo'q. O'quvchi darsi buni konvert deydi: ichida son yo'q.»
3. **Ali hodisani olgach o'zi qayta so'radi: 6 / 10 dan 7 / 10**
   Ovoz: «Ali hodisani olgach o'zi qayta so'radi va yettini oldi. Qiziq tomoni: hodisa Valining o'z javobidan ham oldin yetib keldi.»
4. **Xulosa: hodisa «nima o'zgardi» deydi — haqiqiy son Backend'dan qayta olinadi**
   Ovoz: «Xulosa: hodisa faqat nima o'zgarganini aytadi, haqiqiy son Backend'dan qayta olinadi. Shunda ikki kishi birdan qo'shilsa ham son adashmaydi.»
- Manba: `ws1-out/06-hodisa-bor-m12-03.txt`; repo m12-03 `oyinlar.gateway.ts`; o'quvchi darsi Screen5–6.

## 15 · `m12-dars-02` — hodisa hali yo'q  ← `Lesson`
- Kicker: `4-bosqich · hodisa` · Sarlavha: **O'quvchi darsi bugun faqat ulanish va belgini yozadi — hodisa yuborilmaydi**
- Sahna: ikki ustun: m12-02 (`05`: hodisa kelmadi, pastga tortilsa yangi son) · m12-03 (`06`: hodisa keldi); o'quvchi darsidagi namuna oyna `ulanish.on('oyin-ozgardi', korsat)` (Screen9).
1. **`m12-dars-02-done` gateway izohi: «hozircha hech qanday hodisa yuborilmaydi»**
   Ovoz: «Hodisani m12 dars uch tegida ko'rdik. Lekin ehtiyot bo'ling: o'quvchi darsining tayyor holati m12 dars ikki done. U yerda gateway izohi aniq: hozircha hech qanday hodisa yuborilmaydi.»
2. **O'quvchi tinglovchini namuna oynada yozadi — u yerda hodisani tugma yuboradi**
   Ovoz: «O'quvchi darsida tinglovchi yoziladi: ulanish on, oyin ozgardi. Lekin bu namuna oynada, u yerda hodisani tugma yuboradi, haqiqiy Backend emas.»
3. **O'quvchi telefonida bugun son o'zi o'zgarmaydi — bu xato emas**
   Ovoz: «Shuning uchun bugun o'quvchi telefonida son o'zi o'zgarmaydi, faqat belgi. O'quvchi «ekran yangilanmadi» desa, bu xato emas: hodisa repo'ning keyingi tegida qo'shiladi.»
4. **Xulosa: bugungi natija — ulanish va belgi; hodisa — m12-03 tegida**
   Ovoz: «Xulosa: bugungi o'quvchi natijasi ulanish va belgi. Hodisa m12 dars uch tegida. Ikkalasini ham o'zingiz yurgizib ko'rdingiz.»
- Manba: `ws1-out/05`, `06`; repo m12-02 gateway izohi; o'quvchi darsi Screen9, A1 izohi («hodisalar hali yuborilmaydi»).

## 16 · Tekshiruv 4 — hodisa kelgach  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **Ali'ga `oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}` keldi. Ilova keyin nima qiladi?**
- Ovoz: «Hodisani ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Ali'ga oyin ozgardi keldi: o'yin ikki, sabab qo'shildi. Ilova keyin nima qiladi? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 `GET /oyinlar` bilan sonni qayta so'raydi · 2 Sonni o'zi bittaga oshiradi · 3 Butun sahifani qayta yuklaydi · 4 Keyingi hodisani kutadi
- To'g'ri (ovoz, `ok`): «To'g'ri. Hodisada son yo'q, ilova uni Backend'dan qayta so'raydi. O'zi bittaga oshirsa, ikki kishi birdan qo'shilganda son adashadi. Demak, hodisa faqat nima o'zgarganini aytadi, yangi sonni ilova Backend'dan oladi.» · qisqa: «Qayta so'raydi: son Backend'dan, hodisadan emas.»
- Xato izohlari: 2 — «Ikki kishi birdan qo'shilsa adashadi.» · 3 — «Faqat son so'raladi.» · 4 — «Bu hodisada ham son yo'q.»
- Maslahat: «Konvert ichida son bormi?»
- Manba: `ws1-out/06`; o'quvchi darsi Screen6.

## 17 · Amaliyot 3 — hodisani ko'rish  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **`m12-dars-03-done`: Vali qo'shilsa — Ali'ga hodisa keladi** · `tableAt: 3`
1. **Endi siz: repo'ning keyingi tegida hodisani o'z ko'zingiz bilan ko'rasiz**
   Ovoz: «Hodisa kelgach ilova nima qilishini bildingiz. Oxirgi amaliyot: repo'ning keyingi tegida hodisani o'z ko'zingiz bilan ko'rasiz. O'n daqiqa.»
2. **1–2-qadam: `m12-dars-03-done`, `npm ci` va start; Vali uchun ikkinchi akkaunt**
   Ovoz: «Birinchi: m12 dars uch done tegiga o'ting, npm ci va start. Ikkinchi: Vali uchun ikkinchi akkaunt, ro'yxat va kirish.»
3. **3–4-qadam: Ali ulanadi, Vali qo'shiladi; isbot — hodisa satri**
   Ovoz: «Uchinchi: Ali'ni klient bilan ulang. To'rtinchi: Vali bilan bitta o'yinga qo'shiling. Isbot maydoniga Ali'ga kelgan hodisa satrini nusxalang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz bir o'yinchi qo'shilganda ikkinchisiga hodisa qanday kelishini o'z terminalingizda ko'rgan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Teg | Backend'da Ctrl+C · `git checkout -f m12-dars-03-done` · `npm ci` · `npm run start` (`.env` joyida qoladi) | `Nest application successfully started` |
  | 2 | Vali | `/royxat` va `/kirish` — `+998 90 000 00 02` | ikkinchi token |
  | 3 | Ali | `TOKEN=<Ali> node klient.js` | `ulangan  (connect)` |
  | 4 | Qo'shilish | `curl -X POST localhost:3000/oyinlar/2/qoshilish -H "Authorization: Bearer <Vali>"` | `{"holat":"qoshildi"}` · Ali klientida `HODISA oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}` |
- Isbot: «Ali'ga kelgan hodisa satri» · placeholder: «klient terminalidan HODISA satrini qo'ying» · KOD: `/oyin-ozgardi.*qoshildi/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `201`, lekin hodisa kelmadi | Backend hali `m12-dars-02` kodi bilan ishlayapti — `git log --oneline -1` da `64283b2 m12-03` bo'lsin, Ctrl+C va qayta `npm run start` |
  | `409` «O'yin to'ldi» yoki «Siz bu o'yinga qo'shilgansiz» | boshqa o'yin `id` sini oling (`GET /oyinlar`) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `ws1-amal-out/07–08` (409 «Siz bu o'yinga qo'shilgansiz» — sinalgan); «O'yin to'ldi» — repo README «Backend yo'llari».

---

## 18 · m10-02 xaritasi  ← `Lesson`
- Kicker: `5-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m10-02 · «WebSocket: ekran o'zi yangilanadigan ulanish»` · Sarlavha: **m10-02: yo'l, konvert, belgi va sxema**
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 ekran yangilanmaydi · s1 reja | so'rovsiz eski son (2-ekran) |
  | 2 Ulanish | s2–s4 yo'l yopiq / ochiq · s5–s6 konvert · s7–s8 token bilan ulanish | gateway kodi (5-ekran) · tokensiz (6-ekran) |
  | 3 Tinglovchi | s9 kod oynasi (namuna) | m12-02 da hodisa yo'q (15-ekran) |
  | 4 Holat | s10–s11 uch belgi, uzilishda hodisa yo'qoladi | 45 s (11-ekran) |
  | 5 Sxema va amaliyot | s12–s14 real vaqt sxemasi · A1 o'z repo + Render · A2 README | Render va telefon — sinfda |
1. **m10-02 — 20 ekran: Maydon Jamoa, yo'l, konvert va belgi**
   Ovoz: «O'zingiz hammasini yurgizdingiz, endi o'quvchi darsi: m10-02, yigirma ekran. Maydon Jamoa misoli: yopiq va ochiq yo'l, konvert, token bilan ulanish, tinglovchi, belgi va real vaqt sxemasi.»
2. **Darsning og'ir qismi — 9-ekran kod oynasi va A1: Backend, ilova va Render**
   Ovoz: «O'quvchi darsi o'zi ogohlantiradi: og'ir qism to'qqizinchi ekrandagi kod oynasi va birinchi amaliyot: Backend, ilova va Render. Ikkinchi, to'rtinchi, beshinchi ekranlarga ortiqcha vaqt bermang.»
3. **A1 da Render uyg'onishi va uchish rejimi kechikadi — oldindan ayting**
   Ovoz: «Birinchi amaliyotda ikki kechikish bor. Render'ning bepul xizmati uxlagan bo'lsa, birinchi ulanish cho'ziladi. Uchish rejimida belgi qirq besh soniyagacha kech qoladi. Oldindan ayting.»
4. **Xulosa: vaqt — A1 ga ko'proq; belgi va ulanish ishlasa, dars maqsadi bajarilgan**
   Ovoz: «Xulosa: vaqtning ko'pini birinchi amaliyotga bering. Belgi ulangan ko'rsatsa va uchish rejimida o'zgarsa, darsning maqsadi bajarilgan.»
- Manba: `src/10-Modull/WebSocketBasicsLesson.jsx` — `SCREEN_META` (20), s1 o'qituvchi eslatmasi, A1 qadamlari va izohlari.

## 19 · Real vaqt sxemasi (README)  ← `Lesson`
- Kicker: `5-bosqich · o'quvchi darsini o'tish` · Sarlavha: **README «Real vaqt»: besh ustun — nuqta, kim nima qiladi, hodisa, kim oladi, ekranda**
- Sahna: `maydon-jamoa` README (m12-02) «Real vaqt» jadvali (5 qator, aynan) va ostidagi qator.
1. **O'quvchi ikkinchi amaliyotda o'z mahsuloti uchun shu jadvalni yozadi**
   Ovoz: «Xaritada oxirgi blok sxema edi, uni ochamiz. Ikkinchi amaliyotda o'quvchi o'z mahsuloti uchun shu jadvalni yozadi. Maydon Jamoa'dagi namuna besh qator.»
2. **Har qator: qaysi joy, kim nima qiladi, qaysi hodisa, kim oladi, ekranda nima o'zgaradi**
   Ovoz: «Har qatorda besh ustun: real vaqt nuqtasi, kim nima qiladi, hodisa nomi va sababi, kim oladi va ekranda nima o'zgaradi. Bitta hodisa, besh xil sabab.»
3. **Hodisa nomi — kichik harf va chiziqcha, bo'lib o'tgan ish: `oyin-ozgardi`**
   Ovoz: «Kurs qoidasi: hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida: oyin ozgardi. O'quvchi «o'yinni yangila» deb yozsa, shu qoidani eslating.»
4. **Xulosa: sxema — reja; repo m12-03 da hodisalar aynan shu jadvaldagidek yuboriladi**
   Ovoz: «Xulosa: sxema reja. Repo'ning keyingi tegida Backend aynan shu besh sabab bilan hodisa yuboradi, buni o'n to'rtinchi ekranda ko'rdingiz.»
- Manba: repo README «Real vaqt» (m12-02); repo m12-03 `OyinSababi` (besh sabab); o'quvchi darsi Screen12–13.

## 20 · O'quvchi darsidagi so'zlar va sinfdagi holatlar  ← `Lesson`
- Kicker: `5-bosqich · sinfda` · Sarlavha: **Yo'l, konvert, belgi — va olti holat**
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | yopiq yo'l / ochiq yo'l | so'rov–javob / doimiy ulanish |
  | konvert | hodisa (`oyin-ozgardi`) |
  | belgi | ulanish holati (`active`) |
  | tinglovchi | `ulanish.on(…)` |
  | # | Holat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Belgi bir lahza yashil, keyin kulrang | `io server disconnect` | token — qayta kirish |
  | 2 | Belgi sariq, keyin yashil | `transport close` | Backend qayta yondi — 5 s gacha kechikish, normal |
  | 3 | Uchish rejimida belgi o'zgarmadi | 45 s gacha | kuting |
  | 4 | Son o'zi o'zgarmadi | hodisa yo'q (m12-02) | xato emas |
  | 5 | Birinchi ulanish cho'zildi | Render uxlagan ⚠ | bir daqiqa |
  | 6 | Backend terminali «o'yinchi null» | `return` yo'q | 8-ekran |
- O'quvchi so'rasa:
  - «WebSocket va socket.io bir narsami?» → socket.io — kutubxona, imkon bo'lsa WebSocket orqali ulanadi.
  - «Nega hodisada son yo'q?» → ikki kishi birdan qo'shilsa adashmasin — son Backend'dan.
  - «Uzilgan paytdagi hodisa keyin keladimi?» → bu loyihada yo'q (o'quvchi darsi s11): son eski qoladi, pastga tortib yangilanadi.
  - «Token muddati tugasa?» → keyingi ulanishda Backend yopadi — «Ulanmagan», qayta kirish.
1. **O'quvchi darsi yo'l va konvert deydi — siz atamani birga aytasiz**
   Ovoz: «Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: yopiq va ochiq yo'l, konvert, belgi va tinglovchi. O'quvchi shu so'zni aytganda, siz yonida atamasini ham ayting: ochiq yo'l bu doimiy ulanish, konvert esa hodisa.»
2. **Uch holat belgidan taniladi: kulrang, sariq-yashil, o'zgarmagan belgi**
   Ovoz: «Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi uchtasini ilovadagi belgidan tanish mumkin. Belgi bir lahza yashil bo'lib, keyin kulrang bo'lsa, Backend tokenni qabul qilmagan va o'quvchi qayta kirishi kerak. Belgi sariqdan yashilga o'tsa, Backend qayta yongan, bu normal. Uchish rejimida belgi darrov o'zgarmasa, qirq besh soniyagacha kuting.» · 1–3-karta
3. **Qolgan uchtasi: son o'zgarmadi, Render cho'zildi, «o'yinchi null»**
   Ovoz: «To'rtinchi holat: son o'zi o'zgarmadi. Bu xato emas, o'quvchining shu darsida hodisa hali qo'shilmagan. Beshinchi holat: birinchi ulanish uzoq cho'zildi, chunki Render'dagi server uxlab qolgan, bir daqiqa kuting. Oltinchi holat: Backend terminalida o'yinchi null chiqdi, sababi kodda return yo'q, buni sakkizinchi ekranda ko'rgansiz.» · 4–6-karta
4. **Xulosa: avval belgiga, keyin Backend terminaliga qarang — sabab shu ikkisida**
   Ovoz: «Xulosa va usul: avval belgiga, keyin Backend terminaliga o'quvchi bilan birga qarang. Sabab deyarli doim shu ikkisidan birida ko'rinadi. Pastda o'quvchi savollariga tayyor javoblar bor.» · QA
- Manba: `ws1-out/02…08`; o'quvchi darsi s1, s10–s11, A1.

## 21 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | So'rov–javobda Vali qo'shilsa, Ali'ning soni? | so'ramaguncha eski · o'zi yangilanadi · xato chiqadi · nol bo'ladi | 1 | Yo'l faqat so'rovda ochiladi. | 2 |
  | 2 | Token qachon tekshiriladi? | har hodisada · ulanish ochilayotganda · har daqiqada · hech qachon | 2 | `handleConnection`. | 5 |
  | 3 | Tokensiz ulanishda klient nima ko'radi? | hech narsa · faqat ulangan · bir lahza ulangan, keyin `io server disconnect` · ping timeout | 3 | Ulanish ochiladi va yopiladi. | 6 |
  | 4 | Backend o'chsa belgi? | ulangan · ulanmagan · yo'qoladi · ulanmoqda — o'zi qayta urinadi | 4 | `transport close`, `active=true`. | 10 |
  | 5 | «Uchish rejimi»ni socket.io qachon sezadi? | ~45 s (ping) · darhol · 5 daqiqa · hech qachon | 1 | 25 s + 20 s. | 11 |
  | 6 | Token yaroqsiz, Backend yopdi — belgi? | ulanmoqda · ulanmagan · ulangan · sariq | 2 | `active=false`. | 12 |
  | 7 | `oyin-ozgardi` ichida nima bor? | yangi son · butun ro'yxat · `oyinId` va `sabab` · token | 3 | Son qayta so'raladi. | 14 |
  | 8 | `m12-dars-02-done` da Vali qo'shilsa Ali'ga? | hodisa · xato · yangi son · hech narsa — hodisa hali yo'q | 4 | Hodisa m12-03 da. | 15 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 22 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz**
- Xulosa 6 band: (1) so'rov–javob: yo'l faqat so'rovda; doimiy ulanish: ikkala tomon istagan payt · (2) gateway: token ulanish ochilayotganda, yaroqsiz — `disconnect()` va `return` · (3) tokensiz: bir lahza ulangan, keyin ulanmagan · (4) uch holat: Backend o'chsa ulanmoqda va o'zi qaytadi; uchish rejimi 45 s · (5) hodisa `oyin-ozgardi { oyinId, sabab }` — son qayta so'raladi; m12-02 da hodisa yo'q · (6) o'quvchi darsi: A1 ga vaqt, Render va uchish rejimi kechikishi.
- **Uyga vazifa** (M14): «O'z loyihangizda yoki maydon jamoa nusxasida bitta yangi hodisa sababini qo'shing yoki m12-03 dagini takrorlang: o'zgarish bazaga yozilgach hodisa yuborilsin, ikkinchi klient uni olib, sonni qayta so'rasin. Bir marta Backend'ni o'chirib holatlarni ko'ring. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Gateway | `emit('…', { id, sabab })` — o'zgarish yozilgach | — |
  | 2 | Ikki klient | ikki token bilan `klient.js` | ikkalasi `ulangan` |
  | 3 | Hodisa | o'zgarish → ikkinchi klientda hodisa → `GET` | yangi son |
  | 4 | Uzilish | Backend Ctrl+C → yoqish | ulanmoqda → ulangan |
  | 5 | Topshirish | repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: token ulanishda · `return` · hodisada son yo'q · ikkinchi klient qayta so'raydi.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **WebSocket: ulanish uzilsa** — uzilish, takror hodisa, qayta ulanish».

---

## «KOD» — qurishda
1. Telegraf+PG yordamchilari (`ts()`/`js()`, `jt()`, `Term`, Explorer) — bo'lakda nusxa; telefon maketi (ikki telefon, ⚠); generator `dev/ws1-matn.py`.
2. Chiqishlar `ws1-out/` dan aynan; `/tmp/…` yo'llari qisqartiriladi.
3. LineCheck (8-ekran): 5-satr → `target={4}`; `fixed` da `return;` 6-satr sifatida, har satrga `n`.
4. Isbotlar: 7 — `/ulandi: o'yinchi \d+/` · 13 — `/transport close/i` · 17 — `/oyin-ozgardi.*qoshildi/`.

## Ochiq savollar ([GATE M])
1. Mentor amaliyoti — lokal backend + Node klient (telefon, Render'siz) — PRD Q1; tasdiqlang.
2. `m12-dars-03-done` (hodisa) shu darsda — PRD Q2; tasdiqlang.

## O'quvchi darslari uchun alohida ish (qaror kerak; tegilmadi)
1. **m10-02** A1 izohi: «Render'da yangi versiya chiqqanda … belgi bir lahza «Ulanmoqda…»» — lokal o'lchovda Backend tayyor bo'lgach klient 5 s gacha kech ulanadi (`ws1-amal-out/05`); Render'da sinalmagan ⚠ — «bir lahza» aniqmi, sinfda ko'rish kerak. («Uchish rejimi — bir daqiqagacha» va ustoz izohidagi 45 s — o'lchov bilan mos.)
2. **maydon-jamoa** gateway: `disconnect()` dan keyin `return` bor (to'g'ri) — AI yozgan o'quvchi kodida yo'q bo'lsa, terminal yolg'on «ulandi: o'yinchi null» ko'rsatadi; o'quvchi darsida aytilmagan.
