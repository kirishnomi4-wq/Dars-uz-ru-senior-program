# Mentor kursi · WebSocket-2 «Ulanish uzilsa: buzamiz va tuzatamiz» — MD v2 (M41: avval mentor o'rganadi)

F-ID: F-1029-02 (WebSocket-2) · **F-1104-23** (qayta yozish) · Sana: 2026-11-04 · Holat: **QURILMOQDA 04.11** (foydalanuvchi 04.11: «to'g'ridan qurib chiqar» — MD tasdig'isiz, saytda ko'riladi) · Fidbek: qator yoniga `>> …`
Oldingi: `21-WS2-mentor-v1.md` (01.11, avtopilot, o'quvchi loyihasi `maydon-jamoa`) · **TASHLANADI** (uning `maydon-jamoa` chiqishlari `manba/ws2-out/` — 21–23-ekranda ko'prik sifatida qoladi)
Fayl (qayta quriladi): `src/mentor-kurs/WsReconnectMentorLesson.jsx` · bo'laklar `src/mentor-kurs/ws2/parts/` · dvigatel — umumiy `parts/01–02` · generator `dev/ws2-matn.py` (ws1-matn.py dan, M48 ichida) · kod va chiqishlar `dev/ws2-kod.py`
Qonun: `MENTOR_DARS_ETALON.md` M1–M48 · Haqiqiy chiqishlar: `manba/ws2v2-out/` (skript `manba/drive-ws2v2.sh`; server `ws2v2-server.cjs` — OrderBotNest dist, Telegram o'rniga `bot.handleUpdate`, SIGUSR2 = Bobur buyurtma beradi, «navbat» — server o'chiq paytda yozilgan xabar; brauzer — headless Chrome `ws2v2-panel.mjs`; tarmoq uzilishi — `ws2v2-proksi.cjs`; klient — loyihaning o'z `npm run live`) · AI `manba/ws2v2-ai/`
Loyiha: **OrderBotNest** — teglar `ws2-start` (= `ws1-done` fb8b8b4) · `ws2-done` (`public/admin.html` — `connect` da `yukla()`; `scripts/live-client.js` — `connect` da `GET /admin/orders`; `BUZISH.md`; README «Qayta ulanish»)

**v1 → v2 nima o'zgardi (F-1104-23):**
- Misol — **OrderBotNest** (WebSocket-1 davomi): WS-1 da qurilgan jonli panel «o'zi yangilanadi» deydi — shu da'voni buzamiz. O'quvchi loyihasi `maydon-jamoa` — faqat 20–23-ekran (uning uchinchi muammosi — xona — OrderBotNest'da yo'q, shuning uchun 21-ekranda o'quvchi kodi bilan).
- Dars boshida **umumiy tushuncha**: socket.io ulanishni tiklaydi, uzilish paytidagi hodisani esa yo'q.
- Haqiqiy topilmalar: server qayta yonganda Telegram navbatidagi buyurtma panel ulanmasdan oldin bajariladi — belgi «Ulangan», ro'yxatda yo'q (01) · brauzer **Offline 6 s — buzilmaydi** (kadr Online'da keladi), **60 s — buziladi** (33 s da «Ulanmoqda…»; tuzatilgan kodda 40 s — oxirgi ping qachon kelganiga bog'liq, kechikkan kadr tashlanadi) (02) · tinglovchi `connect` ichida — bitta hodisaga 2, keyin 3 `GET`, sariq belgi yo'qoladi (06) · `connectionStateRecovery`: tarmoq uzilishida tiklaydi (`recovered=true`), lekin klient oldin hech hodisa olmagan bo'lsa va server qayta yonganda — yo'q (07) · AI-1 ning bir urinishida panel buyurtmadan oldin ulanib ulgurgan — xato yuz bermagan, «o'tdi» hech narsani isbotlamaydi.
- AI: ikkalasi ham to'g'ri tuzatdi (`connect` da `yukla()`) va ikkalasi o'zicha **eski javob yangisini bosmasin** himoyasini qo'shdi; ikkalasi haqiqiy bazasiz sinagan, AI-2 sinov papkasini shartdan tashqarida ochgan — haqiqiy bazada biz sinadik.

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | WebSocket-1 ni o'tgan mentor: OrderBotNest'da gateway, `order-changed`, `/admin` paneli, `npm run live`, uch holat bor. |
| Dars oxirida mentor | 1) socket.io nimani tiklashini va nimani tiklamasligini aytadi · 2) «o'zi yangilanadi» da'vosini uch usul bilan buzadi va buzish yozuvini yozadi · 3) uzilishda yo'qolgan hodisani `connect` da qayta so'rash bilan tuzatadi · 4) tinglovchini `connect` ichiga qo'yish xatosini GET sonidan taniydi · 5) `connectionStateRecovery` qachon yordam berib, qachon bermasligini biladi · 6) AI tuzatishini «xato haqiqatan yuz berdimi» savoli bilan qabul qiladi · 7) sinfga: m10-05 xaritasi va Maydon Jamoa'dagi xona |
| O'quvchi darsi (faqat 6-bosqich) | **m10-05** «Ulanish uzilsa: buzamiz va tuzatamiz» (`src/10-Modull/BreakAndFixLesson.jsx`, 19 ekran): Maydon Jamoa, agent «uchala chekka holatni bajardim» degan; uch usul (internetni uzish · fonga olish · Backend'ning yangi versiyasi), buzish yozuvi, uch muammo (son eski · jonli xabar ikki marta · «Hozir ko'ryapti» kam), tuzatish `ulanish.ts` da; repo `maydon-jamoa` `m12-dars-05-start` → `m12-dars-05-done` (`BUZISH.md`). |
| Kursdagi o'rni | WebSocket-1 → **shu** → Webhook: to'lov xabari (M31: raqam yozilmaydi). |
| Til | M9 + M32. Atamalar inglizcha: reconnect (qayta ulanish), listener (tinglovchi), connection state recovery, offline, room (xona). «Buzish yozuvi», «da'vo», «buzildi / buzilmadi» — o'zbekcha (o'quvchi darsidan). Ovozda `order-changed` — «order changed». |
| Misol-ip | **OrderBotNest** `ws2-start` (= `ws1-done`): admin panelni ochib qo'ygan; server qayta ishga tushdi yoki brauzer tarmog'i uzildi — shu paytda Bobur botda buyurtma berdi; belgi «Ulangan», ro'yxatda yo'q. `ws2-done`: `connect` da `yukla()`. |
| AI | 2 tajriba (ruxsat 04.11): bitta oddiy prompt — buyurtmachining shikoyati (`ws2v2-ai/p1-prompt.txt`), `ai1` kuchli, `ai2` kuchsizroq; ikkalasi o'zi bazasiz sinagan, haqiqiy PostgreSQL bilan biz sinadik (`ws2v2-ai/*/01-qayta-ishga.txt`). |
| Haqiqiylik (M10) | 04.11: Node 24.18 · NestJS 11.2.8 · socket.io 4.8.4 · PostgreSQL 18 (vaqtinchalik) · headless Chrome (Offline — DevTools'dagi bilan bir xil CDP buyrug'i). Telegram serveri o'rniga smoke'dagi usul (`bot.handleUpdate`); «Telegram navbati» — server o'chiq paytda yozilgan xabar ishga tushishi bilan beriladi (haqiqiy Telegram bilan sinalmagan ⚠). «Tarmoq uzildi» — panel bilan server orasidagi TCP proksi (panel boshqa kompyuterda bo'lgan holat modeli). |
| Hajm | **25 ekran** · 6 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · ovoz ≈ 25 daq · amaliyot ≈ 50–60 daq · jami ≈ 1 s 15 – 1 s 30 daq |
| Me'yor | WebSocket-1 v2 bilan bir xil (≤ 5 segment, ≤ 60 so'z, M17, «Xulosa», kalit 8–14 so'z, M32, M33, M42, M43, M46, M47, M48) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **qayta ulanish (reconnect)** — socket.io uzilgan ulanishni o'zi tiklaydi (WebSocket-1, 14-ekran). Lekin bu **yangi ulanish**: server eski ulanishga yuborgan narsani unga bermaydi.
- **uzilish paytidagi hodisa** — `server.emit` faqat **hozir ulangan** panellarga ketadi. Ulanish yo'q paytda yuborilgan `order-changed` hech kimga yetmaydi va keyin ham kelmaydi (01, 02).
- **haqiqat manbai** — ro'yxat bazada; hodisa faqat «nimadir o'zgardi» deydi. Shuning uchun tuzatish: **har `connect` da** (birinchi va har qayta ulanishda) `GET /admin/orders` (04).
- **tinglovchi bir marta** — `connect` har qayta ulanishda ishlaydi; ichida `ulanish.on('order-changed', …)` bo'lsa, har safar yana bittasi qo'shiladi: bitta hodisaga 2, keyin 3 `GET` (06).
- **buzish yozuvi** — usul · nima qildim · nima kutdim · nima bo'ldi → belgi (buzildi / buzilmadi — shu kompyuterda, shu urinishda). O'quvchi darsidagi `BUZISH.md` bilan bir xil ustunlar.
- **Offline (DevTools)** — brauzer tarmog'i o'chadi, lekin ochiq WebSocket darhol yopilmaydi: qisqa bo'lsa kadr Online'da keladi (buzilmaydi); ping vaqtidan uzun bo'lsa klient o'zi uzadi, kechikkan kadr tashlanadi (buziladi) (02).
- **connection state recovery** — socket.io sozlamasi: qisqa uzilishdan keyin o'tkazilgan hodisalarni qayta beradi (`socket.recovered = true`). Server xotirasida turadi: server qayta yonsa yo'qoladi; klient uzilishdan oldin kamida bitta hodisa olgan bo'lishi kerak (07).

**Darsning ipi:** socket.io nimani tiklaydi → «o'zi yangilanadi» — da'vo, buzish yozuvi → server qayta yondi: buyurtma yo'q → nega: Telegram navbati → brauzer Offline: qisqa va uzoq → tuzatish: `connect` da qayta so'rash → tinglovchi `connect` ichida: takror `GET` → tarmoq uzildi va `connectionStateRecovery` → AI tuzatishlari haqiqiy bazada → sinfga tayyorgarlik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Qayta ulanish nimani tiklaydi, nimani yo'q | Lesson | 1 · umumiy tushuncha |
| 3 | «O'zi yangilanadi» — da'vo; buzish yozuvi | Lesson | 1 |
| 4 | Server qayta yondi: buyurtma bazada, panelda yo'q | Lesson | 2 · yo'qolgan buyurtma |
| 5 | Nega: Telegram navbati panel ulanishidan tez | Lesson | 2 · ichida |
| 6 | Brauzer Offline: 6 soniya — buzilmadi, 60 soniya — buzildi | Lesson | 2 |
| 7 | Tekshiruv 1 — belgi «Ulangan», buyurtma yo'q | MCRetry | 2 |
| 8 | Tuzatish: `connect` da qayta so'rash | Lesson | 2 |
| 9 | Amaliyot 1 — Offline bilan buzish va tuzatish | Practice | 2 |
| 10 | Buzamiz: tinglovchi `connect` ichida | Lesson | 3 · takror tinglovchi |
| 11 | Tekshiruv 2 — qaysi satr takror `GET` beradi | LineCheck | 3 |
| 12 | Amaliyot 2 — Network'da `GET` sanash | Practice | 3 |
| 13 | Tarmoq uzildi: panel boshqa kompyuterda | Lesson | 4 · tarmoq va tiklash |
| 14 | `connectionStateRecovery`: tiklaydi, lekin hammasini emas | Lesson | 4 · ichida |
| 15 | Tekshiruv 3 — tiklash va server qayta yonishi | MCRetry | 4 |
| 16 | Amaliyot 3 — `npm run live` va buzish yozuvi | Practice | 4 |
| 17 | AI tuzatdi — ikki javob | Lesson | 5 · AI |
| 18 | AI tuzatishlari haqiqiy bazada | Lesson | 5 · ichida |
| 19 | Tekshiruv 4 — «sinadim, o'tdi» | MCRetry | 5 |
| 20 | m10-05 xaritasi: Maydon Jamoa | Lesson | 6 · sinfga tayyorgarlik |
| 21 | Maydon Jamoa'dagi uchinchi muammo — xona | Lesson | 6 |
| 22 | A1 va A2 — o'quvchi o'z ilovasini buzadi | Lesson | 6 |
| 23 | Sinfdagi holatlar va o'quvchi savollari | Lesson | 6 |
| 24 | O'z-sinov — 8 savol | Screen27 | — |
| 25 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code `OrderBotNest` (`public/admin.html`, `scripts/live-client.js`, `src/api/telegram/telegram.service.ts`, `src/api/live/live.gateway.ts`, `BUZISH.md`), terminal «npm run live» va server logi, **panel oynasi** (`PanelView` — `ws2v2-panel.mjs` suratidagi haqiqiy qatorlar; skrinshot emas), **vaqt chizig'i** (uzildi → hodisa → ulandi), Network ro'yxati (`GET /admin/orders` soni), buzish yozuvi jadvali, AI javobi kartasi.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · WebSocket` · Sarlavha: **Panel «o'zi yangilanadi» deydi. Server qayta yonsa yoki tarmoq uzilsa ham shundaymi? Bugun buzib tekshiramiz va tuzatamiz**
- Sahna: chapda reja (6 bosqich); o'ngda panel oynasi — dars oxiridagi natija (`04` 3-surat): server qayta yongandan keyin belgi «Ulangan», eng yuqorida sariq `#2` — server o'chiq paytda berilgan buyurtma.
- Reja: 01 Umumiy tushuncha · 02 Yo'qolgan buyurtma · 03 Takror tinglovchi · 04 Tarmoq va tiklash · 05 AI · 06 Sinfga tayyorgarlik
1. **Server qayta yondi — ==server o'chiq paytda berilgan buyurtma ham panelda==**
   Ovoz: «Assalomu alaykum. Oldingi darsda OrderBotNest'ga jonli panel qildik. Bugun undan qiyinroq savol: server qayta yonsa yoki tarmoq uzilsa, panel hamma buyurtmani ko'rsatadimi? Ekranda dars oxiridagi natija: server o'chiq paytda berilgan buyurtma ham sariq bo'lib chiqqan.»
2. **Avval ==umumiy tushuncha==: socket.io nimani o'zi tiklaydi, nimani yo'q**
   Ovoz: «Avval umumiy tushuncha: socket.io qayta ulanishda nimani o'zi tiklaydi va nimani tiklamaydi. Keyin panelning o'zi yangilanadi degan gapini da'vo deb olamiz va uni ataylab buzamiz, buzish yozuvi bilan.» · reja 01–02
3. **Keyin ==takror tinglovchi, tarmoq va tiklash==; oxirida AI va sinf**
   Ovoz: «Uchinchi bosqichda tuzatishdagi tuzoqni ko'ramiz: bitta hodisaga bir necha so'rov. To'rtinchisida tarmoq uzilishi va socket.io'ning tiklash sozlamasi. Beshinchisida ikki AI tuzatishini haqiqiy bazada sinaymiz. Oxirida sinfga tayyorgarlik.» · reja 03–06
4. **Olti bosqich, uchta amaliyot; kerak: ==WebSocket-1 dagi panel, bot va Postgres==**
   Ovoz: «Dars olti bosqich, uchta amaliyot. Oldingi darsdagi OrderBotNest nusxangiz kerak: panel, bot tokeni va Postgres. Buzishni o'z noutbukingizda, brauzer va telefon bilan qilasiz. Shoshilmang, har ekranni boshidan eshitish mumkin. Boshlaymiz.» · reja 06
- Manba: `ws2v2-out/04-qayta-ishga-done.txt` (3-surat), `04-qayta-ishga-done-3.png` (tekshiruv uchun).

## 2 · Qayta ulanish nimani tiklaydi, nimani yo'q  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **socket.io ulanishni o'zi tiklaydi — lekin bu yangi ulanish. Uzilish paytida yuborilgan hodisa unga kelmaydi: server hodisani faqat hozir ulanganlarga beradi**
- Sahna: 1-segmentda terminal «npm run live» `01` (`ws2-start`): `connect · ulangan` · `order-changed {"orderId":1,…}` · `disconnect: transport close` · `connect_error: xhr poll error` ×2 · `connect · ulangan`; 2-segmentda vaqt chizig'i (`Flow`): Ulangan → uzildi → **buyurtma #2 → hodisa hech kimga** → qayta ulandi → ro'yxat eski; 3-segmentda ikki karta: «Tiklanadi» (ulanish, token — `auth` har ulanishda qayta yuboriladi, tinglovchilar — klientda turadi) ↔ «Tiklanmaydi» (uzilish paytidagi hodisa, serverdagi shu ulanishga tegishli narsa — xona); 4-segmentda qoida kartasi: ro'yxat bazada → har `connect` da qayta so'rash.
1. **Qayta ulanish — ==socket.io'ning tayyor xizmati==: uzildi, urinadi, o'zi ulanadi**
   Ovoz: «Oldingi darsda ko'rgansiz: server o'chsa klient transport close, keyin bir necha marta xhr poll error, server yongach o'zi connect. Hech kim hech narsa bosmadi. Ekranda bugungi tajribadan o'sha terminal. Savol: uzilish paytida nima bo'lgan edi?» · 01 terminal
2. **Lekin bu ==yangi ulanish==: uzilish paytidagi hodisa unga kelmaydi**
   Ovoz: «Qayta ulanish bu yangi ulanish. Server order changed'ni faqat hozir ulangan panellarga yuboradi va hech qayerda saqlamaydi. Uzilish paytida buyurtma tushsa, hodisa hech kimga yetmaydi. Panel qayta ulanadi, belgi yashil, lekin ro'yxat eski qoladi.» · vaqt chizig'i
3. **Tiklanadi: ==ulanish va tinglovchilar==; tiklanmaydi: o'tib ketgan hodisa va serverdagi xona**
   Ovoz: «Nima tiklanadi: ulanishning o'zi, token har ulanishda qayta yuboriladi, tinglovchilar klientda turadi. Nima tiklanmaydi: uzilish paytidagi hodisa va serverning shu ulanishga bog'lagan narsasi, masalan xona. Xonani o'quvchi darsida ko'ramiz.» · ikki karta
4. **Xulosa: ro'yxat ==bazada==; har qayta ulanishda panel uni qayta so'rashi kerak**
   Ovoz: «Xulosa: hodisa faqat nimadir o'zgardi deydi, haqiqiy ro'yxat bazada. Uzilishdan keyin panel nima o'tkazib yuborganini bilmaydi, demak ro'yxatni qayta so'rashi kerak. Hozirgi panel buni qilmaydi. Buni isbotlash uchun avval uni buzamiz.» · qoida
- Manba: `ws2v2-out/01-qayta-ishga-start.txt` (terminal), socket.io: `server.emit` — faqat ulangan klientlarga.

## 3 · «O'zi yangilanadi» — da'vo; buzish yozuvi  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **README: «ro'yxat o'zi yangilanadi». Bu da'vo — tekshirilmagan. Tekshiruv — buzib ko'rish va har urinishni to'rt ustunli yozuv bilan qayd qilish**
- Sahna: 1-segmentda `README.md` (`ws2-start`) «Jonli panel» bo'lagi: «Bot yangi buyurtma olganda … ro'yxat **o'zi yangilanadi** — sahifani qayta ochish shart emas»; 2-segmentda buzish yozuvi ustunlari (`BUZISH.md`, `ws2-done`): № · Usul · Nima qildim · Nima kutdim · Nima bo'ldi · Belgi; 3-segmentda uch usul kartasi: server qayta yondi · brauzer Offline · tarmoq uzildi (panel boshqa kompyuterda); 4-segmentda «buzildi / buzilmadi — shu kompyuterda, shu urinishda».
1. **README ==«o'zi yangilanadi»== deydi — oddiy holatda to'g'ri, chekka holatda tekshirilmagan**
   Ovoz: «OrderBotNest README'sida yozilgan: ro'yxat o'zi yangilanadi. Oddiy holatda bu to'g'ri, oldingi darsda ko'rdik. Lekin server qayta yonsa yoki tarmoq uzilsa? Bu tekshirilmagan. O'quvchi darsida bunday gap da'vo deyiladi: aytilgan, isbotlanmagan.» · README
2. **Buzish yozuvi: ==nima qildim · nima kutdim · nima bo'ldi → belgi==**
   Ovoz: «Tekshiruv bu buzib ko'rish. Har urinish bir qator: qaysi usul, nima qildim, nima kutdim, nima bo'ldi va belgi: buzildi yoki buzilmadi. Nima bo'ldi ustuniga taxmin emas, ekranda ko'rgan narsa yoziladi. O'quvchi darsidagi BUZISH fayli aynan shu ustunlar.» · ustunlar
3. **Panel uchun ==uch usul==: server qayta yonadi, brauzer Offline, tarmoq uziladi**
   Ovoz: «Panel uchun uch usul. Birinchisi: server qayta ishga tushadi, deploy yoki xato. Ikkinchisi: brauzerning tarmog'i o'chadi, buni DevTools bilan qilasiz. Uchinchisi: panel boshqa kompyuterda, ular orasidagi tarmoq uziladi. Har birida o'sha paytda buyurtma tushadi.» · uch usul
4. **Xulosa: belgi ==shu kompyuterda, shu urinishda== — «buzilmadi» isbot emas**
   Ovoz: «Xulosa: buzildi belgisi muammo borligini ko'rsatadi. Buzilmadi esa faqat shu kompyuterda, shu urinishda degani, isbot emas. Bugun shunday urinishni ko'rasiz: xato bor, lekin o'sha safar yuz bermagan. Birinchi usuldan boshlaymiz.» · belgi
- Manba: `order-bot` `ws2-start` README «Jonli panel»; `ws2-done` `BUZISH.md`; `maydon-jamoa` `m12-dars-05-done` `BUZISH.md` (ustunlar).

---

## 4 · Server qayta yondi: buyurtma bazada, panelda yo'q  ← `Lesson`
- Kicker: `2-bosqich · yo'qolgan buyurtma` · Sarlavha: **Panel va terminal klienti ochiq; server to'xtadi; o'chiq paytda Bobur botga yozgan; server yondi — belgi «Ulangan», ro'yxatda faqat #1, bazada esa #2 bor**
- Sahna: yonma-yon (M47): chapda panel oynasi `01` surat 1 → 2 → 3 (belgi «Ulangan» #1 → «Ulanmoqda…» → «Ulangan», ro'yxatda faqat #1); o'ngda terminal «npm run live» `01` (qayta ulanishdan keyin `order-changed` yo'q) va server logi (`ishlayapti` · `— Bobur … Telegram navbatidan` · `Buyurtma #2 qabul qilindi!` · keyin `[Live] panel ulandi`); 4-segmentda baza kartasi: `orders — 2 ta, eng yangisi #2` + «#2 hodisasi panelga keldimi: yo'q».
1. **Panel ochiq, ==#1 ko'rindi==; server terminalida Ctrl+C — belgi «Ulanmoqda…»**
   Ovoz: «Tajriba haqiqiy server, baza va brauzerda. Panel ochiq, Bobur birinchi buyurtmani berdi, panelda birinchi qator chiqdi. Endi server terminalida Ctrl C. Panel darhol ulanmoqda, ro'yxat ekranda qoladi. Shu payt Bobur botga yana buyurtma yozdi.» · 1–2-surat
2. **Server yondi — ==bot navbatdagi buyurtmani darhol bajardi==: `Buyurtma #2 qabul qilindi!`**
   Ovoz: «Serverni qayta yoqdik. Server logiga qarang: ishga tushishi bilan bot Bobur yozgan xabarni bajardi, buyurtma ikki qabul qilindi. Panel ulandi satri esa undan keyin. Ya'ni hodisa yuborilgan paytda hech qaysi panel ulanmagan edi.» · server logi
3. **Panel: ==belgi «Ulangan», ro'yxatda faqat #1==; terminal klientida ham hodisa yo'q**
   Ovoz: «Panelga qarang: belgi ulangan, yashil. Ro'yxatda esa faqat birinchi buyurtma. Terminal klienti ham qayta ulandi, lekin order changed kelmadi. Admin ekranga ishonadi va ikkinchi buyurtmani ko'rmaydi. Sahifani yangilasa chiqadi, lekin admin buni bilmaydi.» · 3-surat + terminal
4. **Xulosa: ==bazada 2 ta, panelda 1 ta== — README'dagi da'vo buzildi**
   Ovoz: «Xulosa: bazada ikki buyurtma, panelda bitta, belgi esa hammasi joyida deydi. Bu eng yomon holat: xato ko'rinmaydi. Buzish yozuviga birinchi qator: server qayta yondi, kutdim ikkinchi buyurtma, bo'ldi faqat birinchi, belgi buzildi.» · baza
- Manba: `ws2v2-out/01-qayta-ishga-start.txt` (aynan), `01-qayta-ishga-start-1/2/3.png`.

## 5 · Nega: Telegram navbati panel ulanishidan tez  ← `Lesson`
- Kicker: `2-bosqich · ichida` · Sarlavha: **Server o'chiq paytda Telegram xabarni saqlab turadi; bot ishga tushishi bilan uni oladi. Panel esa 1–5 soniyada qayta urinadi — ko'pincha kech qoladi, ba'zan ulguradi**
- Sahna: 1-segmentda VS Code `telegram.service.ts` (`ws2-start`) `onModuleInit` bo'lagi: `this.bot.launch(…)`; 2-segmentda vaqt chizig'i: server yondi → bot navbatni oldi → `order-changed` (0 panel) → panel qayta urindi (1–5 s, tobora uzayadi) → ulandi; 3-segmentda ikki terminal yonma-yon: `01` (hodisa kelmadi) ↔ AI-1 nusxasidagi bir urinish (`ws2v2-ai/ai1/01a`): panel buyurtmadan oldin ulandi — `order-changed {"orderId":2}` keldi; 4-segmentda qoida kartasi.
1. **Server o'chiq paytda ==Telegram xabarni saqlab turadi==; bot yongach birinchi ishi — navbat**
   Ovoz: «Nega shunday bo'ldi? Telegram server o'chiq paytdagi xabarlarni saqlab turadi. Telegram service faylida on module init ichida bot launch: bot ishga tushishi bilan navbatdagi xabarlarni oladi va darhol bajaradi. Bu bir soniyaga yetmaydi.» · launch
2. **Panel esa ==1–5 soniyada qayta urinadi== — hodisa ketganda u hali ulanmagan**
   Ovoz: «Panel esa uzilishdan keyin bir soniya, keyin ikki, to'rt, eng ko'pi besh soniya kutib qayta urinadi. Server yongan payt bilan panelning keyingi urinishi orasida bot buyurtmani bajarib, hodisani yuborib bo'ladi. Hodisa nolta panelga ketdi.» · vaqt chizig'i
3. **Ba'zan ==panel ulguradi== — o'sha urinishda xato yuz bermaydi**
   Ovoz: «Lekin har safar emas. AI nusxasini sinaganimizda bir urinishda panel buyurtmadan oldin ulanib ulgurdi va hodisa oddiy yo'l bilan keldi. O'sha urinishda xato umuman yuz bermadi, demak u hech narsani tekshirmadi. Buyurtmachi aytgan ba'zan so'zi shu.» · ikki terminal
4. **Demak, sabab: ==hodisa vaqtga bog'liq==; ro'yxat esa bazada — uni vaqtdan qat'i nazar so'rash kerak**
   Ovoz: «Demak, sabab: hodisa kelishi vaqtga bog'liq, kim tezroq. Buni tezlik bilan yutib bo'lmaydi. Ro'yxat esa bazada, u vaqtga bog'liq emas. Panel ulanishi bilan uni qayta so'rasa, kim tez bo'lganining farqi qolmaydi. Avval yana bir usul: brauzer tarmog'ini o'chiramiz.» · qoida
- Manba: `order-bot` `ws2-start` `telegram.service.ts` (`onModuleInit`, `launch`); `ws2v2-out/01`; `ws2v2-ai/ai1/01a-omadli-panel-oldin-ulandi.txt`; socket.io-client standart `reconnectionDelay: 1000`, `reconnectionDelayMax: 5000`.

## 6 · Brauzer Offline: 6 soniya — buzilmadi, 60 soniya — buzildi  ← `Lesson`
- Kicker: `2-bosqich · yo'qolgan buyurtma` · Sarlavha: **DevTools → Network → Offline: 6 soniyada belgi o'zgarmadi, hodisa Online'da keldi — buzilmadi. 60 soniyada — yarim daqiqadan keyin «Ulanmoqda…», Online'dan keyin ro'yxat eski — buzildi**
- Sahna: 1-segmentda DevTools Network paneli kartasi («No throttling» → «Offline»); 2-segmentda panel logi `02` qisqa qism: `Offline yoqildi` · Bobur buyurtma berdi · belgi «Ulangan» o'zgarmadi · `Offline o'chirildi` → `kadr keldi … "orderId":1` → `GET` → ro'yxat #1; 3-segmentda uzoq qism: `Offline yoqildi — 60 s` · Bobur #2 · 33 s dan keyin belgi «Ulangan» → «Ulanmoqda…» · `Offline o'chirildi` → `kadr keldi … "orderId":2` → `WebSocket yopildi` → `WebSocket ochildi` → «Ulangan», `GET` yo'q; 4-segmentda panel `02` 4-surat (ro'yxat #1) + baza (#2).
1. **Offline ==DevTools'da bir tugma==: Network → No throttling o'rniga Offline**
   Ovoz: «Ikkinchi usulni o'z noutbukingizda qilasiz. Brauzerda F12, Network bo'limi, yuqoridagi No throttling ro'yxatidan Offline. Sahifaning tarmog'i o'chadi, server va bot esa ishlab turadi. Shu paytda telefondan buyurtma berasiz.» · DevTools
2. **6 soniya: ==belgi o'zgarmadi==, hodisa Online bo'lganda keldi — buzilmadi**
   Ovoz: «Birinchi urinish: olti soniya Offline, shu payt buyurtma. Belgi ulangan bo'lib turdi. Online qilgan zahoti order changed keldi va ro'yxat yangilandi. Brauzer ochiq ulanishni yopmadi, kadrni ushlab turdi. Belgi buzilmadi, faqat shu urinishda.» · qisqa
3. **60 soniya: ==yarim daqiqadan keyin «Ulanmoqda…»==; Online'da kechikkan kadr keldi, lekin tashlandi**
   Ovoz: «Ikkinchi urinish: bir daqiqa. O'ttiz uchinchi soniyada belgi ulanmoqda bo'ldi: ping kelmadi, klient ulanishni o'zi uzdi. Online qildik: kechikkan kadr brauzerga keldi, lekin socket.io uni yopilgan ulanishniki deb tashladi va yangidan ulandi. Ro'yxat so'ralmadi.» · uzoq
4. **Xulosa: Offline ==ping vaqtidan uzun bo'lsa buziladi== — 45 soniyadan ko'p kuting**
   Ovoz: «Xulosa: belgi ulangan, ro'yxatda birinchi, bazada ikkinchi ham bor. Buzildi. Ping qoidasini oldingi darsda ko'rgansiz: yigirma besh va yigirma. Amaliyotda Offline'ni belgi ulanmoqda bo'lguncha ushlab turing, aks holda buzilmadi chiqadi.» · natija
- Manba: `ws2v2-out/02-offline-start.txt` (aynan), `02-offline-1…4.png`.

## 7 · Tekshiruv 1 — belgi «Ulangan», buyurtma yo'q  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Server qayta yondi. Belgi «Ulangan». Bazada #2 bor, panelda yo'q, terminal klientiga ham `order-changed` kelmadi. Asosiy sabab nima?**
- Material (`above`, M42): server logi `01`: `Buyurtma #2 qabul qilindi!` · keyin `[Live] panel ulandi`.
- Ovoz: «Ikki usulda buzilishni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Server qayta yondi, belgi ulangan, bazada ikkinchi buyurtma bor, panelda yo'q. Server logida buyurtma panel ulanishidan oldin. Asosiy sabab nima? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Bot #2 ni bazaga yozmagan — tranzaksiya qaytarilgan · 2 Hodisa panel ulanmasdan oldin ketgan, server uni saqlamaydi · 3 Panel tokeni eskirgan, server hodisani rad etgan · 4 socket.io hodisani navbatga qo'ygan, keyingisi bilan keladi
- To'g'ri (ovoz): «To'g'ri. Server logida buyurtma ikki qabul qilindi, panel ulandi esa keyin. Order changed shu paytda ulangan panellarga ketdi, ular esa nol. Socket.io bunday hodisani saqlamaydi va qayta ulangan panelga bermaydi. Demak, belgi ulangan bo'lsa ham, uzilishdan keyingi ro'yxatga ishonib bo'lmaydi.» · qisqa: «Hodisa 0 panelga ketdi — server saqlamaydi, qayta ulanganga bermaydi.»
- Isbot (`after`): baza `01`: `orders — 2 ta, eng yangisi #2` · «#2 hodisasi panelga keldimi: yo'q».
- Demak: «Uzilish paytidagi hodisa yo'qoladi; qayta ulangan panel nimani o'tkazib yuborganini bilmaydi.»
- Xato izohlari: 1 — «Bazada 2 ta — buyurtma yozilgan (`psql`).» · 3 — «Token to'g'ri: panel ulandi, belgi «Ulangan».» · 4 — «Navbat yo'q: keyingi hodisa faqat o'zi keladi, eskisi bilan emas.»
- Maslahat: «Server logida «Buyurtma #2» va «panel ulandi» qaysi tartibda?»
- Manba: `ws2v2-out/01-qayta-ishga-start.txt`.

## 8 · Tuzatish: `connect` da qayta so'rash  ← `Lesson`
- Kicker: `2-bosqich · yo'qolgan buyurtma` · Sarlavha: **`ws2-done`: `connect` ichida `yukla()` — birinchi va har qayta ulanishda ro'yxat bazadan; alohida `yukla()` chaqiruvlari olib tashlandi. O'sha tajriba: #2 sariq**
- Sahna: 1-segmentda VS Code `public/admin.html` (`ws2-done`) `ulan()` bo'lagi: `ulanish.on('connect', () => {` · `holatQoy('ulangan');` · `yukla();` · `});` (yangi satrlar yashil, M36) va izoh; 2-segmentda kirish bo'lagi: `localStorage.setItem(…)` · `ulan();` (alohida `yukla()` o'chirildi — qizil) + `09`: noto'g'ri token — bir lahza `connect` → `GET` → «Token noto'g'ri»; 3-segmentda panel `04` 3-surat: belgi «Ulangan», `#2` sariq, `#1` + `scripts/live-client.js` `royxat()` va terminal `04`: `GET /admin/orders → 2 ta, eng yangisi #2`; 4-segmentda `11` (60 s Offline, `ws2-done`): Online'dan keyin ro'yxatda #2.
1. **`admin.html`, `ulan()`: ==`connect` ichida `holatQoy` va `yukla()`== — ikki satr**
   Ovoz: «Tuzatish kichik. Public papkasidagi admin html, ulan funksiyasi. Connect bo'lganda faqat belgini qo'yardik. Endi ichida yukla ham chaqiriladi. Connect birinchi ulanishda ham, har qayta ulanishda ham ishlaydi, demak har safar ro'yxat bazadan keladi.» · connect
2. **Alohida ==`yukla()` chaqiruvlari olib tashlandi==: ro'yxat ikki joyda — `connect` va hodisa**
   Ovoz: «Kirish tugmasi va sahifa ochilishidagi alohida yukla chaqiruvlarini olib tashladik, aks holda ochilishda ro'yxat ikki marta so'raladi. Endi faqat ikki joy: connect va order changed. Noto'g'ri tokenda ham ishlaydi: bir lahza connect, so'rov, token noto'g'ri.» · kirish
3. **O'sha tajriba: ==#2 sariq==; terminal klienti ham `GET … → 2 ta, eng yangisi #2`**
   Ovoz: «To'rtinchi ekrandagi tajribani tuzatilgan kodda qaytardik. Server yongach belgi ulangan va ro'yxatda ikkinchi buyurtma, sariq. Terminal klientiga ham shu qo'shildi: connect'dan keyin get admin orders, nechta va eng yangisi. Amaliyotda isbot shu satr bo'ladi.» · 04
4. **Xulosa: ==Offline 60 soniya ham== takrorlanmadi — bitta tuzatish ikki usulni yopdi**
   Ovoz: «Xulosa: bir daqiqalik Offline ham tuzatilgan kodda qaytarildi: Online'dan keyin ikkinchi buyurtma chiqdi. Buzish yozuvida ikkala qatorga: tuzatish qilindi, qayta tekshiruvda takrorlanmadi. Server kodi o'zgarmadi, testlar o'ttiz ikki, smoke to'qqizdan to'qqiz.» · 11
- Manba: `order-bot` `ws2-done` `public/admin.html`, `scripts/live-client.js`; `ws2v2-out/04`, `09`, `11`, `08` (aynan).

## 9 · Amaliyot 1 — Offline bilan buzish va tuzatish  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **`ws2-start` da panelni Offline bilan buzing (belgi «Ulanmoqda…» bo'lguncha), telefondan buyurtma bering; keyin `ws2-done` da xuddi shu usul bilan qayta tekshiring** · `tableAt: 3`
1. **Endi siz: ==`ws2-start`, DevTools Offline va telefon== — o'z noutbukingizda**
   Ovoz: «Endi navbat sizga. OrderBotNest papkangizda ws2 start tegiga o'tasiz, panelni ochasiz va brauzer tarmog'ini o'chirasiz. Telefoningizdan botga buyurtma berasiz va Online qilasiz. Keyin ws2 done'da xuddi shunday. Yigirma daqiqa ketadi.»
2. **1–2-qadam: ==teg, server, panel; Offline — belgi «Ulanmoqda…» bo'lguncha==, keyin buyurtma**
   Ovoz: «Birinchi qadamda teg va server, brauzerda localhost uch ming admin. Ikkinchisida F12, Network, Offline va kuting: belgi ulanmoqda bo'lishi kerak, qirq besh soniyagacha. Shundan keyin telefondan buyurtma, Telegram'da buyurtma qabul qilindi chiqadi.»
3. **3–4-qadam: ==Online — ro'yxatda yo'q==; `ws2-done` da qayta — chiqadi; isbot — buyurtma raqami**
   Ovoz: «Uchinchi qadamda Online: belgi ulangan, lekin yangi buyurtma ro'yxatda yo'q. Buzildi. To'rtinchisida ws2 done tegi, server qayta, xuddi shu usul: endi Online'dan keyin buyurtma sariq bo'lib chiqadi. Isbot maydoniga o'sha buyurtma raqamini yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz panelning da'vosini o'zingiz buzgansiz va tuzatishni o'sha usul bilan tekshirgansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Teg va panel | `git fetch --tags` · `git checkout ws2-start` · `npm run start:dev` · brauzer: `http://localhost:3000/admin` | belgi «Ulangan», ro'yxat |
  | 2 | Offline | F12 → Network → «No throttling» → «Offline» · belgi «Ulanmoqda…» bo'lguncha kuting · telefondan botga buyurtma | Telegram: `Buyurtma #… qabul qilindi!` |
  | 3 | Online | «Offline» → «No throttling» | belgi «Ulangan», yangi buyurtma ro'yxatda YO'Q (F5 bilan chiqadi) |
  | 4 | Qayta tekshiruv | `git checkout ws2-done` · server qayta · 1–3-qadam yana | Online'dan keyin yangi buyurtma sariq |
- Isbot: «`ws2-done` da Online'dan keyin chiqqan buyurtma raqami» · placeholder: «masalan: #7» · KOD: `/#?\s*\d+/` · xato: «`ws2-done` da Online'dan keyin ro'yxatda chiqqan sariq qatorning raqamini yozing.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `ws2-start` da ham buyurtma chiqdi | Offline qisqa bo'lgan — belgi «Ulanmoqda…» bo'lmaguncha buyurtma bermang (6-ekran: 6 s da buzilmaydi) |
  | Belgi «Ulanmoqda…» bo'lmayapti | Offline yoqilmagan yoki boshqa vkladkada — sahifaning o'z DevTools'ida yoqing; 45 s gacha kuting |
  | Online'dan keyin ham «Ulanmoqda…» | server to'xtagan — server terminalini tekshiring |
  | `ws2-done` da ham ro'yxatda yo'q | sahifa eski — server qayta ishga tushganmi, F5 bilan bir marta yangilang, keyin qayta sinang |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `ws2v2-out/02`, `11`.

---

## 10 · Buzamiz: tinglovchi `connect` ichida  ← `Lesson`
- Kicker: `3-bosqich · takror tinglovchi` · Sarlavha: **Sodda «tuzatish»: hammasini `connect` ichiga. Birinchi ulanishda ishlaydi; har qayta ulanishdan keyin bitta hodisaga 2, keyin 3 `GET` — va sariq belgi yo'qoladi**
- Sahna: 1-segmentda VS Code `admin.html` (xato nusxa, `00b`): `ulanish.on('connect', () => {` · `holatQoy('ulangan');` · `yukla();` · `ulanish.on('order-changed', () => yukla());` (qizil) · `});`; 2-segmentda Network ro'yxati `06`: 1-buyurtma — `GET (2)`; 1 qayta ulanishdan keyin 2-buyurtma — `GET (4)`, `GET (5)`; 2 qayta ulanishdan keyin 3-buyurtma — `GET (7)`, `(8)`, `(9)`; 3-segmentda ikki panel yonma-yon: `06` 2-surat (`#2` sariq emas) ↔ `04` 3-surat (`#2` sariq); 4-segmentda sabab kartasi.
1. **Sodda tuzatish: ==tinglovchi ham `connect` ichiga== — «har ulanishda hammasini sozlaymiz»**
   Ovoz: «Endi tuzatishdagi tuzoq. Sodda yo'l: har ulanishda hammasini qaytadan sozlaymiz, tinglovchini ham connect ichiga ko'chiramiz. Kod chiroyli ko'rinadi va birinchi ulanishda to'g'ri ishlaydi. Sinaymiz: server ikki marta qayta yonadi, har safar keyin bitta buyurtma.» · kod
2. **Network: ==bitta hodisaga 1, keyin 2, keyin 3 `GET`==**
   Ovoz: «Brauzerning Network ro'yxatiga qarang. Birinchi buyurtmaga bitta get admin orders. Bir qayta ulanishdan keyin bitta buyurtmaga ikkita. Ikkinchi qayta ulanishdan keyin uchta. Har qayta ulanishda yana bitta tinglovchi qo'shilgan, hodisa bitta, ishlovchi uchta.» · Network
3. **Ko'rinadigan belgi: ==sariq qator yo'qoldi== — ikki javobdan ikkinchisi «yangi emas» deydi**
   Ovoz: «Bu faqat ortiqcha so'rov emas. Chapda xato nusxa: ikkinchi buyurtma sariq emas. O'ngda to'g'ri kod: sariq. Ikki so'rov bir vaqtda ketadi, birinchi javob qatorni yangi deb chizadi va eng katta raqamni eslaydi, ikkinchisi esa uni endi yangi emas deb chizadi.» · ikki panel
4. **Demak, sabab: ==`connect` har ulanishda ishlaydi== — tinglovchi bir marta, tashqarida**
   Ovoz: «Demak, sabab: connect birinchi ulanishda ham, har qayta ulanishda ham ishlaydi. Ichidagi on har safar yangi tinglovchi qo'shadi, eskisi o'chmaydi. Qoida: connect ichida faqat qayta so'rash, tinglovchi esa bir marta, tashqarida. Ws2 done'da shunday, izoh bilan.» · sabab
- Manba: `ws2v2-out/06-takror-tinglovchi.txt`, `00b-nusxalar-farqi.txt` (xato nusxa), `04` (aynan).

## 11 · Tekshiruv 2 — qaysi satr takror `GET` beradi  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Bu panelda server ikki marta qayta yongandan keyin bitta buyurtmaga uchta `GET /admin/orders` ketadi. Sababchi satrni toping**
- Shart (`task`): «Qoida: `connect` har qayta ulanishda ishlaydi — ichida faqat **bir martalik ish** bo'ladi. Bu bo'lakda bitta satr har ulanishda **yangi tinglovchi qo'shadi**. **O'sha satrni bosing.**»
- Ovoz (`q`): «Tuzoqni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu panelda server ikki marta qayta yongandan keyin bitta buyurtmaga uchta so'rov ketadi. Bo'lakda bitta satr har ulanishda yangi tinglovchi qo'shadi. O'sha satrni bosing.»
- Fayl: `public/admin.html` `ulan()` bo'lagi (`06` dagi xato nusxa, `00b`): `function ulan() {` · `if (ulanish) ulanish.close();` · `ulanish = io({ auth: { token } });` · `holatQoy('ulanmoqda');` · izoh · `ulanish.on('connect', () => {` · `holatQoy('ulangan');` · `yukla();` · **`ulanish.on('order-changed', () => yukla());` ← xato satr** · `});` → `target` = shu satr (✅ KOD).
- Tuzatilgan (`fixed`): tinglovchi `connect` dan tashqariga, bir marta (`ws2-done`); `fixedExtra`: `06` Network: `GET` 1 → 2 → 3 va `04` (to'g'ri kod): har hodisaga bitta.
- To'g'ri (ovoz, `ok`): «To'g'ri. Bu satr connect ichida, connect esa har qayta ulanishda ishlaydi. Ikki qayta ulanishdan keyin uchta tinglovchi, bitta hodisaga uchta so'rov va sariq belgi yo'qoladi. Yukla chaqiruvining o'zi to'g'ri: qayta so'rash connect ichida bo'lishi kerak. Demak, connect ichidagi on, tuzoq.»
- Qisqa (`okShort`): «`connect` ichidagi `ulanish.on(…)` — har qayta ulanishda yana bitta tinglovchi.»
- Maslahat (`hint`): «`connect` ichida qaysi satr har safar yangi narsa qo'shadi, qaysi biri faqat bir ish qiladi?»
- Manba: `ws2v2-out/06-takror-tinglovchi.txt`, `00b-nusxalar-farqi.txt`.

## 12 · Amaliyot 2 — Network'da `GET` sanash  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **Tinglovchini ataylab `connect` ichiga ko'chiring, serverni ikki marta qayta yoqing, bitta buyurtma bering va Network'da `GET` larni sanang; keyin qaytaring** · `tableAt: 3`
1. **Endi siz: ==tinglovchini ataylab `connect` ichiga== ko'chirasiz va sanaysiz**
   Ovoz: «Endi navbat sizga. Ws2 done'dagi admin html'da tinglovchini ataylab connect ichiga ko'chirasiz, serverni ikki marta qayta yoqasiz va bitta buyurtma berasiz. Brauzerning Network ro'yxatida so'rovlarni sanaysiz. O'n besh daqiqa ketadi.»
2. **1–2-qadam: ==tinglovchini ko'chiring==, F12 → Network, filtr `orders`**
   Ovoz: «Birinchi qadamda order changed satrini connect ichiga, yukla'dan keyin ko'chirasiz va saqlaysiz. Ikkinchisida panelni qayta oching, F12, Network, filtrga orders deb yozing. Faqat get admin orders qatorlari qoladi.»
3. **3–4-qadam: ==server ikki marta qayta, keyin bitta buyurtma== — nechta `GET`; isbot — son**
   Ovoz: «Uchinchi qadamda server terminalida ikki marta Ctrl C va qayta yoqish, har safar belgi ulangan bo'lguncha kuting. Keyin Network'ni tozalang va telefondan bitta buyurtma. To'rtinchisida sanang va kodni qaytaring. Isbot maydoniga so'rovlar sonini yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror tinglovchini so'rovlar sonidan taniysiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Buzish | `public/admin.html`: `ulanish.on('order-changed', () => yukla());` → `connect` ichiga, `yukla();` dan keyin | saqlandi |
  | 2 | Network | brauzer: panel → F5 · F12 → Network → filtr `orders` | birinchi ochilishda bitta `orders` |
  | 3 | Ikki qayta yonish | server: Ctrl+C → `npm run start:dev` (×2, har safar belgi «Ulangan») · Network → 🚫 tozalash · telefondan bitta buyurtma | yangi qator chiqdi |
  | 4 | Sanash va qaytarish | Network'dagi `orders` soni · `git checkout -- public/admin.html` | 3 ta `GET`; kod qaytdi |
- Isbot: «Bitta buyurtmadan keyingi `GET /admin/orders` soni» · placeholder: «masalan: 3» · KOD: `/^\D*3\D*$/` · xato: «Ikki qayta yonishdan keyin bitta buyurtmaga nechta `orders` so'rovi ketdi? Uchta bo'lishi kerak — Network'ni buyurtmadan oldin tozalang.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 2 ta `GET` | server bir marta qayta yongan yoki ikkinchi safar belgi «Ulangan» bo'lishini kutmadingiz |
  | 1 ta `GET` | sahifa eski kodda — admin.html saqlandimi; F5 bilan yangilang |
  | Network'da `orders` yo'q | filtr boshqa yoki Network ochilishidan oldingi so'rovlar — sahifani DevTools ochiq holda yangilang |
  | Sariq belgi baribir bor | so'rovlar ketma-ket qaytgan — sanash isbot uchun yetarli |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `ws2v2-out/06-takror-tinglovchi.txt`.

---

## 13 · Tarmoq uzildi: panel boshqa kompyuterda  ← `Lesson`
- Kicker: `4-bosqich · tarmoq va tiklash` · Sarlavha: **Hayotda server Render'da, panel do'kon kompyuterida: ular orasidagi tarmoq uziladi, server va bot ishlayveradi. Proksi bilan modellashtirdik: `ws2-start` — ro'yxat bo'sh, `ws2-done` — #1**
- Sahna: 1-segmentda sxema: panel (do'kon kompyuteri) — tarmoq (proksi `3101`) — server `3100` (+ bot, baza); 2-segmentda panel `03` (`ws2-start`): `WebSocket yopildi` → «Ulanmoqda…» · Bobur #1 · tarmoq qaytdi → «Ulangan», ro'yxat «Hali buyurtma yo'q»; 3-segmentda panel `05` (`ws2-done`): o'sha qadamlar → `GET (2)` → `#1`; 4-segmentda qoida kartasi: uch usul — bitta sabab, bitta tuzatish.
1. **Haqiqiy do'konda ==server Render'da, panel do'konda==: tarmoq ular orasida uziladi**
   Ovoz: «Uchinchi usul. Haqiqiy do'konda server Render kabi joyda, panel do'kon kompyuterida. Do'konda Wi-Fi uzilsa, server va bot ishlayveradi, mijozlar buyurtma beradi, panel esa tarmoqsiz. Buni oralig'iga proksi qo'yib modellashtirdik: proksini kesamiz.» · sxema
2. **`ws2-start`: tarmoq qaytdi — ==«Ulangan», ro'yxat bo'sh==, bazada #1**
   Ovoz: «Eski kodda: tarmoq uzildi, belgi darhol ulanmoqda, chunki ulanish yopildi. Shu payt Bobur buyurtma berdi. Tarmoq qaytdi, belgi ulangan, ro'yxatda esa hali buyurtma yo'q. Bazada birinchi buyurtma bor. Xuddi server qayta yongandagi holat.» · 03
3. **`ws2-done`: ==`connect` dan keyin `GET` — #1 ro'yxatda==**
   Ovoz: «Tuzatilgan kodda o'sha qadamlar: tarmoq qaytgach connect, darhol get admin orders va ro'yxatda birinchi buyurtma. Bitta tuzatish uchala usulni yopdi: server qayta yonishi, brauzer Offline va tarmoq uzilishi.» · 05
4. **Xulosa: usul uch xil, ==sabab bitta== — qayta ulanish yangi ulanish, hodisa o'tib ketgan**
   Ovoz: «Xulosa: usul uch xil, sabab bitta: qayta ulanish yangi ulanish va uzilish paytidagi hodisa o'tib ketgan. Bu tuzatish mijoz tomonda. Savol tug'iladi: server o'zi o'tkazib yuborilganini qayta bera olmaydimi? Socket.io'da shunday sozlama bor.» · qoida
- Manba: `ws2v2-out/03-tarmoq-start.txt`, `05-tarmoq-done.txt` (aynan); proksi `manba/ws2v2-proksi.cjs` (darsda emas — tajriba vositasi).

## 14 · `connectionStateRecovery`: tiklaydi, lekin hammasini emas  ← `Lesson`
- Kicker: `4-bosqich · ichida` · Sarlavha: **Gateway'ga `connectionStateRecovery` — qisqa uzilishdan keyin o'tkazilgan hodisalar qayta keladi (`recovered=true`). Lekin klient oldin hodisa olmagan bo'lsa va server qayta yonganda — yo'q**
- Sahna: 1-segmentda `live.gateway.ts` (tajriba nusxasi, `00b`): `@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } })`; 2-segmentda klient `07` B qismi: `order-changed {"orderId":2}` (ulangan) · `disconnect: transport close` · … · `order-changed {"orderId":3}` · `connect · recovered=true` (id o'sha); 3-segmentda A va C: A — klient hali hech hodisa olmagan: `recovered=false`, #1 kelmadi · C — server qayta yondi: `recovered=false`, navbatdagi buyurtma kelmadi; 4-segmentda qaror kartasi: tiklash — qo'shimcha, `connect` da qayta so'rash — majburiy.
1. **socket.io sozlamasi: ==`connectionStateRecovery`== — uzilgan ulanishning holatini 2 daqiqa saqlaydi**
   Ovoz: «Socket.io'da connection state recovery sozlamasi bor. Gateway dekoratoriga qo'shamiz, ikki daqiqa. Server uzilgan ulanishning holatini va shu vaqtda yuborilgan hodisalarni xotirada saqlaydi. Klient qaytib kelsa, socket recovered true va o'tkazilgan hodisalar keladi.» · sozlama
2. **Tarmoq uzildi, shu payt #3 — qaytganda ==#3 keldi, `recovered=true`==, id o'sha**
   Ovoz: «Tajriba: klient ikkinchi buyurtma hodisasini oldi, keyin tarmoq uzildi, shu payt uchinchi buyurtma. Tarmoq qaytdi: avval order changed uch keldi, keyin connect, recovered true, ulanish raqami ham o'sha. Haqiqatan ishlaydi, panel qayta so'ramasa ham.» · B
3. **Lekin: ==oldin hodisa olmagan klient== va ==server qayta yonishi== — `recovered=false`**
   Ovoz: «Ikki holatda ishlamadi. Birinchisi: klient uzilishdan oldin hali birorta hodisa olmagan edi, recovered false, o'tkazilgan buyurtma kelmadi. Ikkinchisi: server qayta yondi, recovered false, navbatdagi buyurtma kelmadi. Saqlangan holat server xotirasida edi, server bilan yo'qoldi.» · A va C
4. **Xulosa: tiklash — ==qo'shimcha==; `connect` da qayta so'rash — majburiy**
   Ovoz: «Xulosa: tiklash qisqa tarmoq uzilishida yordam beradi. Server qayta yonishi esa eng ko'p uchraydigan holat: deploy, xato. U yerda faqat qayta so'rash ishlaydi. Shuning uchun ws2 done'da gateway o'zgarmadi. Tiklashni qo'shsangiz, qayta so'rash baribir qoladi.» · qaror
- Manba: `ws2v2-out/07-recovery.txt` (aynan), `00b-nusxalar-farqi.txt` (tiklash nusxasi); socket.io hujjati «Connection state recovery» (4.6+).

## 15 · Tekshiruv 3 — tiklash va server qayta yonishi  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **Gateway'da `connectionStateRecovery` yoqilgan, panel `connect` da qayta so'ramaydi. Deploy: server qayta yondi, o'chiq paytda Bobur buyurtma bergan. Panel uni ko'radimi?**
- Material (`above`): klient `07` C qismi: `disconnect: transport close` · `connect_error` ×2 · `connect · recovered=false`.
- Ovoz: «Tiklashni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Gateway'da tiklash yoqilgan, panel esa connect'da qayta so'ramaydi. Deploy bo'ldi, server qayta yondi, o'chiq paytda Bobur buyurtma bergan. Panel uni ko'radimi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Ha — tiklash o'tkazilgan hamma hodisani qaytaradi · 2 Ha, agar server 2 daqiqada yongan bo'lsa · 3 Yo'q — saqlangan holat server xotirasida edi · 4 Yo'q — tiklash faqat polling transportida ishlaydi
- To'g'ri (ovoz): «To'g'ri. Tiklash uzilgan ulanishlarning holatini server jarayonining xotirasida saqlaydi. Server qayta yonganda jarayon yangi, xotira bo'sh: recovered false, navbatdagi buyurtma hodisasi qaytmaydi. Ikki daqiqa muddati bu yerda yordam bermaydi. Demak, deploy va xatodan keyin faqat qayta so'rash ishlaydi.» · qisqa: «Holat server xotirasida — server qayta yonsa yo'qoladi: `recovered=false`.»
- Isbot (`after`): `07` C: `— server qayta ishga tushirildi` → `connect · recovered=false` (yangi id), `order-changed` yo'q.
- Demak: «Tiklash server xotirasida: deploy va qayta yonishdan keyin yo'q — qayta so'rash majburiy.»
- Xato izohlari: 1 — «Faqat shu server jarayoni saqlagan hodisalarni; yangi jarayonda ular yo'q.» · 2 — «Muddat emas, xotira: jarayon yangi bo'lsa, bir soniyada yongan ham tiklamaydi.» · 4 — «Transportga bog'liq emas — 07 da websocket bilan tikladi.»
- Maslahat: «Tiklash ma'lumotni qayerda saqlaydi — bazada, faylda yoki jarayon xotirasida?»
- Manba: `ws2v2-out/07-recovery.txt`.

## 16 · Amaliyot 3 — `npm run live` va buzish yozuvi  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **`ws2-done` da terminal klientini oching, serverni qayta yoqing — qayta ulanishdan keyingi `GET` satrini toping; o'z `BUZISH.md` yozuvingizga uch urinishni yozing** · `tableAt: 3`
1. **Endi siz: ==terminal klienti va o'z buzish yozuvingiz==**
   Ovoz: «Endi navbat sizga. Ws2 done'da terminal klientini ochib, serverni qayta yoqasiz va klient ro'yxatni qayta so'raganini ko'rasiz. Keyin o'z buzish yozuvingizni yozasiz: bugungi uch urinish. Yigirma daqiqa ketadi.»
2. **1–2-qadam: ==`npm run live`, server Ctrl+C va qayta== — `connect`, keyin `GET … → N ta`**
   Ovoz: «Birinchi qadamda ikkinchi terminalda npm run live: connect va get admin orders, nechta va eng yangisi. Ikkinchisida server terminalida Ctrl C, klientda transport close va xhr poll error, keyin server yoqiladi va yana connect, get satri.»
3. **3–4-qadam: ==`BUZISH.md` — uch qator==, `ws2-done` dagi namuna bilan solishtiring; isbot — `GET` satri**
   Ovoz: «Uchinchi qadamda o'z papkangizda BUZISH fayli: birinchi va ikkinchi amaliyotdagi urinishlar va bugungi qayta yonish. To'rtinchisida ws2 done'dagi namuna bilan solishtirasiz. Isbot maydoniga qayta ulanishdan keyingi get satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz qayta ulanishni terminaldan tekshirasiz va buzish yozuvini o'zingiz yozasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Klient | `git checkout ws2-done` · server · ikkinchi terminal: `npm run live` | `connect · ulangan` · `GET /admin/orders → N ta, eng yangisi #…` |
  | 2 | Qayta yonish | server: Ctrl+C · 5 s · `npm run start:dev` | klientda `transport close` → `xhr poll error` → `connect` → yana `GET … → N ta` |
  | 3 | Yozuv | `BUZISH.md`: № · Usul · Nima qildim · Nima kutdim · Nima bo'ldi · Belgi — 3 qator | uch qator, «Nima bo'ldi» da ko'rganingiz |
  | 4 | Solishtirish | `git show ws2-done:BUZISH.md` | ustunlar bir xil, belgi «buzildi / buzilmadi» |
- Isbot: «Qayta ulanishdan keyingi `GET` satri» · placeholder: «masalan: 14:05:31 GET /admin/orders → 7 ta, eng yangisi #7» · KOD: `/GET \/admin\/orders → \d+ ta/` · xato: «Klient terminalida qayta `connect` dan keyingi `GET /admin/orders → … ta` satrini nusxalang.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `connect` bor, `GET` satri yo'q | `ws2-start` dagi klient — `git checkout ws2-done` |
  | `GET /admin/orders → 401` | klient tokeni `.env` dagi `ADMIN_PANEL_TOKEN` bilan bir xil emas |
  | `connect_error: xhr poll error` to'xtamaydi | server ishga tushmadi — server terminalidagi xatoni o'qing |
  | `fetch is not defined` | Node 18 dan eski — `node -v`, kursdagi Node 24 |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `ws2v2-out/04` (terminal), `order-bot` `ws2-done` `BUZISH.md`.

---

## 17 · AI tuzatdi — ikki javob  ← `Lesson`
- Kicker: `5-bosqich · AI` · Sarlavha: **Ikki AI'ga buyurtmachining shikoyati, ishorasiz. Ikkalasi sababni to'g'ri topdi — `connect` da `yukla()` — va ikkalasi o'zicha «eski javob yangisini bosmasin» himoyasini qo'shdi**
- Sahna: 1-segmentda bosqich kartasi («1–4-bosqich · siz» xira → «5-bosqich · AI tuzatadi, siz qabul qilasiz»); 2-segmentda prompt kartasi (`p1-prompt.txt`); 3-segmentda ikki `AiReply`: «1-AI (kuchli model)» — 2 fayl, `connect` → `yukla()`, so'rov raqami (`soroqRaqami`), tarmoq xatosida `try/catch`, README'ga bir qator; o'zi sinagan: headless Chrome, baza o'rnida JSON fayl, 4 holat · «2-AI (kuchsizroq model)» — 1 fayl, `connect` → `yukla()`, so'rov raqami (`sorovSoni`); o'zi sinagan: jsdom, sinov papkasi loyihadan tashqarida; 4-segmentda ikki javobdan iqtibos: «PostgreSQL va Telegram bilan to'liq oqim … ikkalasi ham yo'q» · «Haqiqiy brauzerda (Chrome) qo'lda sinalmagan».
1. **Yana AI bosqichi: ==AI tuzatadi, siz qabul qilasiz== — shikoyat bilan, ishorasiz**
   Ovoz: «Beshinchi bosqich, AI. Ikki AI'ga buyurtmachining shikoyatini berdik, xuddi admin aytgandek: ba'zan yangi buyurtma ko'rinmaydi, belgi ulangan, sahifani yangilasam chiqadi. Connect ham, qayta so'rash ham aytilmagan. Kuchli va kuchsizroq model.» · bosqich
2. **Prompt — ==bir gap==: belgi «Ulangan», buyurtma yo'q, sahifani yangilasam chiqadi**
   Ovoz: «Prompt bitta gap, ekranda aynan. Sizga o'quvchi yoki do'kon egasi xuddi shunday yozadi. Bunday xabardan sababni topish uchun AI kodni o'qishi va qayta ulanish nima qilishini bilishi kerak.» · prompt
3. **Ikkalasi: ==`connect` da `yukla()`== va o'zicha ==so'rov raqami== — kech kelgan eski javob chizilmasin**
   Ovoz: «Ikkalasi sababni to'g'ri topdi va bizdagi tuzatishni yozdi: connect ichida yukla. Ikkalasi o'zicha yana bir himoya qo'shdi: so'rovga raqam, faqat oxirgisining javobi chiziladi. Ikki so'rov bir vaqtda ketsa, kech kelgan eski ro'yxat yangisini bosmasin. Tinglovchini hech biri connect ichiga ko'chirmadi.» · ikki javob
4. **Lekin ikkalasi ==haqiqiy bazasiz== sinagan: biri JSON fayl bilan, biri jsdom'da**
   Ovoz: «Ikkalasi o'zi sinadi: birinchisi Chrome'da, baza o'rniga JSON fayl bilan, ikkinchisi brauzer o'rniga jsdom'da. Ikkinchisi sinov papkasini loyihadan tashqarida ochdi, shartda esa faqat shu papka edi. Endi ularni haqiqiy bazada, bizning tajriba bilan sinaymiz.» · iqtiboslar
- Manba: `ws2v2-ai/p1-prompt.txt`, `ai1/00-javob.md`, `ai1/diff.patch`, `ai2/00-javob.md`, `ai2/diff.patch`.

## 18 · AI tuzatishlari haqiqiy bazada  ← `Lesson`
- Kicker: `5-bosqich · ichida` · Sarlavha: **Haqiqiy PostgreSQL va brauzerda, buyurtma panel ulanishidan oldin: ikkalasida #2 sariq. Qabul — to'rt savol: qayerda so'raydi · tinglovchi nechta · xato haqiqatan yuz berdimi · nima ortiqcha qo'shildi**
- Sahna: 1-segmentda ikki panel yonma-yon: `ai1/01` 3-surat ↔ `ai2/01` 3-surat (ikkalasida `#2` sariq, «hodisa #2 panelga keldimi: yo'q»); 2-segmentda AI-1 diff bo'lagi: `let soroqRaqami = 0;` · `const men = ++soroqRaqami;` · `if (men !== soroqRaqami) return;`; 3-segmentda AI-1 ning birinchi urinishi (`ai1/01a`): panel buyurtmadan oldin ulandi — `kadr keldi … "orderId":2` — bu urinish xatoni tekshirmagan; 4-segmentda to'rt savol kartasi.
1. **Haqiqiy bazada: ==ikkalasida #2 sariq==, hodisa panelga kelmagan — tuzatish ishladi**
   Ovoz: «Ikkala AI nusxasini to'rtinchi ekrandagi tajriba bilan sinadik, haqiqiy Postgres va Chrome'da. Buyurtma ataylab panel ulanishidan oldin. Ikkalasida server yongach ikkinchi buyurtma sariq. Hodisa panelga kelmagan, demak ro'yxatni aynan qayta so'rash chiqardi.» · ikki panel
2. **So'rov raqami: ==to'g'ri himoya==, lekin bizning tajribalarda bu holat chiqmadi**
   Ovoz: «Qo'shimcha himoya: har so'rovga raqam, javob kelganda raqam eng oxirgisi bo'lmasa, chizilmaydi. Mantiq to'g'ri, ortiqcha zarar yo'q. Lekin bizning tajribalarda javoblar tartibi buzilmadi, birinchi AI buni sekinlashtirilgan server bilan ko'rsatgan. Qabul qilsa bo'ladi, asosiy tuzatish emas.» · diff
3. **Diqqat: ==bir urinishda panel ulgurdi== — o'sha «o'tdi» hech narsani isbotlamaydi**
   Ovoz: «Eng muhim saboq. AI nusxasini birinchi sinaganimizda panel buyurtmadan oldin ulanib ulgurdi, hodisa oddiy yo'l bilan keldi. Ro'yxat to'g'ri edi, lekin xato umuman yuz bermagan. Eski kod ham o'tardi. Shuning uchun logda hodisa kelmaganini ko'rib, keyin qayta sinadik.» · 01a
4. **Xulosa: AI tuzatishiga ==to'rt savol==: qayerda so'raydi · tinglovchi nechta · xato yuz berdimi · nima ortiqcha**
   Ovoz: «Xulosa: AI'ning qayta ulanish tuzatishiga to'rt savol. Ro'yxat connect'da so'raladimi. Tinglovchi bitta, tashqaridami. Sinovda xato haqiqatan yuz berdimi, ya'ni eski kod o'sha sinovda yiqilganmi. Va nima ortiqcha qo'shildi, kerakmi. Bu safar ikkalasi o'tdi.» · to'rt savol
- Manba: `ws2v2-ai/ai1/01-qayta-ishga.txt`, `ai2/01-qayta-ishga.txt`, `ai1/01a-omadli-panel-oldin-ulandi.txt`, `ai1/diff.patch` (aynan).

## 19 · Tekshiruv 4 — hodisa kelgan sinov  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **Birinchi sinovimizda AI tuzatgan panel #2 ni ko'rsatdi. Panel logida qayta ulanishdan keyin `kadr keldi … "orderId":2` bor. Bu sinov nimani isbotlaydi?**
- Material (`above`): `ai1/01a` panel logi: `WebSocket ochildi` → `kadr keldi 42["order-changed",{"orderId":2,…}]`.
- Ovoz: «AI tuzatishlarini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Birinchi sinovimizda AI tuzatgan panel ikkinchi buyurtmani ko'rsatdi. Panel logida esa qayta ulanishdan keyin ikkinchi buyurtma hodisasi kelgan. Bu sinov nimani isbotlaydi? Variantni tanlang.»
- Variantlar (to'g'risi — 4): 1 Tuzatish ishlaydi — panel #2 ni ko'rsatdi · 2 Xato tuzatilmagan — hodisa ikki marta kelgan, GET ham ikki · 3 Server o'zgargan — endi hodisa saqlanadi · 4 Hech narsani — bu urinishda xato yuz bermagan
- To'g'ri (ovoz): «To'g'ri. Hodisa kelgan bo'lsa, panel qayta ulanib ulgurgan va oddiy tinglovchi ro'yxatni yangilagan. Eski, tuzatilmagan kod ham shu sinovdan o'tardi. Sinov xatoni tekshirishi uchun eski kod unda yiqilishi kerak. Demak, avval eski kodda buzildi'ni ko'ring, keyin tuzatilganda takrorlanmadi'ni. Birinchi AI o'zi aynan shunday sinagan: eski sahifada xato takrorlandi, yangisida yo'q.» · qisqa: «Hodisa kelgan — xato yuz bermagan; eski kod ham o'tardi. Sinov avval eski kodni yiqitsin.»
- Isbot (`after`): `ai1/01` (qayta sinov): «#2 hodisasi panelga keldimi: yo'q» → `#2` sariq.
- Demak: «Sinov xatoni tekshiradi, agar eski kod unda yiqilsa; hodisa kelgan urinish — isbot emas.»
- Xato izohlari: 1 — «Ko'rsatdi, lekin hodisa ham kelgan — eski kod ham ko'rsatardi.» · 2 — «Logda bitta kadr; GET soni oddiy.» · 3 — «Server kodiga tegilmagan — `diff-stat`: faqat `admin.html` (va README).»
- Maslahat: «Shu sinovni tuzatilmagan kodda yurgizsak, natija boshqacha bo'larmidi?»
- Manba: `ws2v2-ai/ai1/01a-omadli-panel-oldin-ulandi.txt`, `ai1/01-qayta-ishga.txt`.

---

## 20 · m10-05 xaritasi: Maydon Jamoa  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Eyebrow: `m10-05 · «Ulanish uzilsa: buzamiz va tuzatamiz»` · Sarlavha: **O'quvchi darsi: agent «uchala chekka holatni bajardim» degan — o'quvchi Maydon Jamoa'da uch usul bilan buzadi, yozadi va tuzattiradi**
- Sahna: ikki karta: «O'quvchi (m10-05)» — 19 ekran: s0 «bajardim» — da'vo · s1 reja · s2–s7 uch muammo · s8 kod oynasi · s9–s12 yozuv va qayta tekshiruv · A1 o'z ilovasini buzish · A2 agentga tuzattirish · «Siz (bugun)» — OrderBotNest: da'vo, uch usul, `connect` da qayta so'rash, takror tinglovchi, tiklash, AI; 3-segmentda bloklar jadvali; 4-segmentda repo teglari: `m12-dars-05-start` (kod = `m12-dars-04-done`) → `m12-dars-05-done` (`BUZISH.md` + tuzatish, Backend o'zgarmagan).
- Bloklar:
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 «bajardim» — da'vo · s1 reja | README «o'zi yangilanadi» (3-ekran) |
  | 2 Uch muammo | s2–s3 uzilish · s4–s5 takror · s6–s7 xona | 4, 10-ekran; xona — 21-ekran |
  | 3 Tinglovchi | s8 kod oynasi | `connect` ichidagi `on` (11-ekran) |
  | 4 Yozuv va qayta tekshiruv | s9 buzish yozuvi · s10 test · s11 qayta tekshiruv · s12 mustaqil | «shu kompyuterda, shu urinishda» (3-ekran), «hodisa kelgan urinish — isbot emas» (19-ekran) |
  | 5 Amaliyot | A1 o'z ilovasini buzish · A2 agentga tuzattirish | 22-ekran |
1. **m10-05 — 19 ekran: ==agent «bajardim» degan== — o'quvchi buni da'vo deb tekshiradi**
   Ovoz: «Endi sinfga tayyorgarlik. O'quvchi darsi m10-05, o'n to'qqiz ekran. Maydon Jamoa'da agent uchala chekka holatni bajardim degan. O'quvchi buni da'vo deb oladi va uch usul bilan buzadi: internetni uzish, fonga olish va Backend'ning yangi versiyasi.» · kartalar
2. **Uch muammo: ==son eski · jonli xabar ikki marta · «Hozir ko'ryapti» kam==**
   Ovoz: «O'quvchi uchta muammoni topadi. Son eski: siz bugun ko'rgan uzilishdagi hodisa. Jonli xabar ikki marta: takror tinglovchi, o'quvchi kodida u boshidan connect ichida. Hozir ko'ryapti kam: xona. OrderBotNest'da bunday muammo yo'q, uni o'quvchi kodida ko'ramiz.» · uch muammo
3. **Bloklar: ==og'ir joy — 9-ekran kod oynasi va ikki amaliyot==**
   Ovoz: «Bloklar jadvaliga qarang. Og'ir joy to'qqizinchi ekrandagi kod oynasi va ikki amaliyot. Uchinchi, beshinchi, yettinchi ekranlarga ortiqcha vaqt bermang. Har blokda siz qo'shadigan narsa o'ng ustunda: bugungi ekran raqami.» · jadval
4. **Xulosa: o'quvchi yozuvida ==«Nima bo'ldi» — ko'rgani==, taxmin emas; vaqtning ko'pi amaliyotga**
   Ovoz: «Xulosa: vaqtning ko'pi ikki amaliyotga. O'quvchi yozuvida nima bo'ldi qatori ekranda ko'rgani bo'lsin, taxmin emas. Tuzatishdan keyin xuddi shu usul bilan qayta buzsin. Ikki teg: o'n ikkinchi modul beshinchi dars start va done.» · teglar
- Manba: `src/10-Modull/BreakAndFixLesson.jsx` (`SCREEN_META` 19, s0–s13, A1, A2); `maydon-jamoa` `m12-dars-05-start`, `m12-dars-05-done` (`BUZISH.md`).

## 21 · Maydon Jamoa'dagi uchinchi muammo — xona  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **Ilova o'yin ekranini ochganda xonaga kiradi; uzilganda server uni hamma xonadan chiqaradi; qayta ulanish xonaga o'zi qaytmaydi — ikkinchi telefonda «Hozir ko'ryapti: 1»**
- Sahna: 1-segmentda terminal `ws2-out/05` (eski): Ali o'yinni ochdi → `Hozir ko'ryapti: 1` → `Backend yangi versiyasi` → Ali qayta ulandi → Vali ochdi → `Hozir ko'ryapti: 1` (kutilgan 2); 2-segmentda `maydon-jamoa` `mobil/src/ulanish.ts` farqi (`m12-dars-05-start` → `done`): `connect` ichida `qaytaSora();` · `if (ochiqOyin !== null) ulanish?.emit('oyin-ochildi', { oyinId: ochiqOyin });` · tinglovchi tashqarida; 3-segmentda `ws2-out/06` (yangi): Ali qayta ulandi → `Hozir ko'ryapti: 1` → Vali ochdi → ikkalasida `2`; 4-segmentda jadval: OrderBotNest ↔ Maydon Jamoa (uch muammo, qaysi biri qayerda).
1. **Xona: ilova o'yin ekranini ochganda ==`oyin-ochildi`== — server uni o'yin xonasiga qo'shadi**
   Ovoz: «Uchinchi muammo OrderBotNest'da yo'q, chunki bizning panel hammaga bitta hodisa oladi. Maydon Jamoa'da esa o'yin ekrani ochilganda ilova oyin ochildi yuboradi, server uni o'sha o'yin xonasiga qo'shadi. Hozir ko'ryapti soni xonadagi ulanishlar.» · 05 boshi
2. **Uzilganda ulanish ==hamma xonadan chiqadi==; qayta ulanish o'zi qaytmaydi — Vali'da «1»**
   Ovoz: «Backend yangi versiyasi chiqdi, Ali qayta ulandi. Lekin yangi ulanish hech qaysi xonada emas: eski ulanish bilan birga xonadan chiqib ketgan. Vali o'yinni ochdi va hozir ko'ryapti bir ko'rindi, ikki emas. Ikkinchi ekranda aytgan narsa: serverdagi xona tiklanmaydi.» · 05 natija
3. **Tuzatish ==`connect` ichida==: qayta so'rash va ochiq o'yin xonasiga qayta kirish**
   Ovoz: «O'quvchi loyihasidagi tuzatish ulanish ts faylida, connect ichida ikki ish: qayta so'rash va ochiq o'yin bo'lsa, xonaga qayta kirish. Tinglovchi esa tashqariga chiqarilgan. Natija: ikkala telefonda ikki. Backend o'zgarmagan.» · diff + 06
4. **Xulosa: `connect` ichida ==faqat bir martalik ish==: qayta so'rash, xonaga qaytish; tinglovchi — tashqarida**
   Ovoz: «Xulosa: uchala muammo bitta joyda, connect atrofida. Ichida faqat har ulanishda bir marta qilinadigan ish: qayta so'rash va xonaga qaytish. Tinglovchi bir marta, tashqarida. Siz bugun ikkitasini OrderBotNest'da qo'lingiz bilan qildingiz, uchinchisi shu qolipning davomi.» · jadval
- Manba: `manba/ws2-out/05-xona-eski.txt`, `06-xona-yangi.txt` (01.11, haqiqiy Backend `maydon-jamoa`); `maydon-jamoa` `git diff m12-dars-05-start m12-dars-05-done -- mobil/src/ulanish.ts`.

## 22 · A1 va A2 — o'quvchi o'z ilovasini buzadi  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **A1: uch usul — uchish rejimi, fonga olish, Render'da qayta chiqarish; o'zgarishni agent boshqa akkauntdan qiladi. A2: yozuv bilan tuzattirish va xuddi shu usul bilan qayta tekshirish**
- Sahna: A1 qadamlari (o'quvchi darsidan, qisqartirib): (1) uchish rejimi → «Ulanmoqda…» kuting (bir daqiqagacha) → o'zgarish → o'chiring · (2) boshqa ilovaga o'tish → o'zgarish → bir daqiqadan keyin qaytish · (3) Render: «Manual Deploy» → «Deploy latest commit» (⚠ sinalmagan); A2 prompt bandlari: Qayerda · Nima qilsin · Nima buzilmasin; 4-segmentda OrderBotNest ↔ telefon: Offline 60 s ↔ uchish rejimi bir daqiqa, server qayta yonishi ↔ Render deploy.
1. **A1 da kod yozilmaydi: ==o'zgarishni agent boshqa akkauntdan== qiladi, kuzatish — o'quvchida**
   Ovoz: «O'quvchi amaliyotining birinchi bloki. Kod yozilmaydi: o'quvchi ilovani buzadi, o'zgarishni esa agent boshqa akkauntdan qiladi, siz bugun telefondan buyurtma berganingizdek. Kuzatish va yozuv o'quvchida.» · A1
2. **Uchish rejimi — ==bir daqiqa kutish==; siz buni Offline 60 soniyada ko'rdingiz**
   Ovoz: «Birinchi usul uchish rejimi va o'quvchi darsi bir daqiqagacha kuting deydi. Siz sababini bilasiz: ping qoidasi, Offline olti soniyada buzilmadi, bir daqiqada buzildi. O'quvchi erta qaytsa, buzilmadi yozadi va bu ham natija, lekin xato yashirin qoladi.» · uchish rejimi
3. **Render'da qayta chiqarish — ==sizdagi server qayta yonishi==; bir necha daqiqa cho'zilishi mumkin**
   Ovoz: «Uchinchi usul Render'da qo'lda qayta chiqarish, siz bugun serverni qayta yoqqaningiz bilan bir xil. Faqat Render'da bu bir necha daqiqa cho'zilishi mumkin. Biz Render'ni sinamadik, tugma nomi o'quvchi darsida rasmiy hujjatdan olingan.» · Render
4. **Xulosa: A2 da ==agentning «tuzatdim»i ham da'vo== — xuddi shu usul bilan qayta buziladi**
   Ovoz: «Xulosa: ikkinchi blokda o'quvchi yozuvni agentga beradi va tuzattiradi. Agentning tuzatdim degani ham da'vo. Siz bugun ko'rdingiz: AI sinagan urinishda xato yuz bermagan bo'lishi mumkin. O'quvchi buzildi belgili urinishlarni xuddi shu usul bilan qaytarsin.» · A2
- Manba: o'quvchi darsi `ScreenA1` qadamlari va izohlari (Render «Manual Deploy» — rasmiy hujjatdan; Expo Go — «pilotda tekshiriladi»), `ScreenA2` prompt; `ws2v2-out/02`, `ws2v2-ai/ai1/01a`.

## 23 · Sinfdagi holatlar va o'quvchi savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **Olti holat, har biri o'z belgisi bilan — va o'quvchi so'raydigan to'rt savol**
- Sahna: 1–2-segmentda holatlar kartalari (6); 3–4-segmentda «O'quvchi so'rasa» (ovozsiz, bosib ochiladi).
- Holatlar:
  | # | Holat | Belgisi | Sabab |
  |---|---|---|---|
  | 1 | Belgi «Ulangan», son eski | uzilishdan keyin | `connect` da qayta so'rash yo'q |
  | 2 | Jonli xabar ikki marta | qayta ulanishdan keyin | tinglovchi `connect` ichida |
  | 3 | «Hozir ko'ryapti» kam | yangi versiyadan keyin | xonaga qayta kirish yo'q |
  | 4 | Hamma urinish «buzilmadi» | uchish rejimi qisqa yoki Expo Go qayta yuklagan ⚠ | bir daqiqa kutish; bu ham natija |
  | 5 | «Ulanmoqda…» uzoq | Render qayta chiqyapti ⚠ | bir necha daqiqa |
  | 6 | Agent «tuzatdim» dedi | qayta tekshiruv qilinmagan | xuddi shu usul bilan qaytarish |
- O'quvchi so'rasa:
  - «Socket.io o'zi qayta ulanadi-ku, nega tuzatamiz?» → ulanishni tiklaydi, lekin o'tkazib yuborilgan hodisani va xonani tiklamaydi.
  - «Server o'tkazilgan hodisani o'zi qayta bersa bo'lmaydimi?» → socket.io'da `connectionStateRecovery` bor, lekin u server xotirasida: yangi versiya chiqqanda yo'q. Qayta so'rash baribir kerak.
  - «Tinglovchi ikki marta bo'lsa, nima yomon?» → har o'zgarish ikki marta so'raladi, jonli xabar ikki marta chiqadi; har qayta ulanishda yana ko'payadi.
  - «Backend'ni tuzatish kerakmi?» → yo'q: uchala tuzatish ilovada (`ulanish.ts`).
1. **Birinchi uchtasi — ==uch muammo==: son eski, xabar ikki marta, son kam**
   Ovoz: «Sinfda uchraydigan olti holat. Birinchi uchtasi o'quvchi darsidagi uch muammo. Belgi ulangan, son eski: qayta so'rash yo'q. Jonli xabar ikki marta: tinglovchi connect ichida. Hozir ko'ryapti kam: xonaga qayta kirish yo'q.» · 1–3
2. **Qolgan uchtasi: ==hammasi «buzilmadi», Render uzoq, agent «tuzatdim»==**
   Ovoz: «To'rtinchisi: hamma urinish buzilmadi. Uchish rejimi qisqa bo'lgan yoki Expo Go ilovani qayta yuklagan, bu ham natija. Beshinchisi: Render qayta chiqishi bir necha daqiqa. Oltinchisi: agent tuzatdim dedi, uni xuddi shu usul bilan qayta tekshirish kerak.» · 4–6
3. **O'quvchi savollari: ==nega tuzatamiz, server qayta bermaydimi, ikki marta nima yomon, Backend==**
   Ovoz: «O'quvchi savollariga tayyor javoblar pastda, bosib oching: socket.io o'zi qayta ulansa nega tuzatamiz, server o'tkazilganni qayta bera olmaydimi, tinglovchi ikki marta bo'lsa nima yomon, Backend'ni tuzatish kerakmi.» · QA
4. **Xulosa: har ==«bajardim» va «tuzatdim»== dan keyin — xuddi shu usul bilan qayta buzish**
   Ovoz: «Xulosa va usul: o'quvchi yoki agent bajardim, tuzatdim desa, u bilan birga xuddi shu buzish usulini qaytaring va yozuvdagi nima bo'ldi qatoriga qarang. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring.»
- Manba: `ws2-out/01–06`; `ws2v2-out/02`, `07`; o'quvchi darsi s0, s1, A1 izohlari; `maydon-jamoa` `BUZISH.md`.

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran; M48 — uzunliklar tekis):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | socket.io qayta ulanganda nimani o'zi tiklaydi? | Ulanishni — o'tkazilgan hodisalarni emas · Ulanishni va o'tkazilgan hamma hodisani · Faqat hodisalarni, ulanishni sahifa yangilaydi · Hech narsani — admin sahifani qayta ochadi | 1 | Qayta ulanish — yangi ulanish. | 2 |
  | 2 | Ulanish yo'q paytda yuborilgan `order-changed` nima bo'ladi? | Navbatda turadi va qayta ulanganda keladi · Keyingi hodisa bilan birga keladi · Hech kimga yetmaydi va keyin ham kelmaydi · Bazaga yoziladi, panel uni o'zi o'qiydi | 3 | `server.emit` — faqat ulanganlarga. | 2 |
  | 3 | Tuzatish qayerda va qanday? | Gateway'da — hodisani bazaga saqlash · `admin.html` — `connect` ichida `yukla()` · Botda — hodisani ikki marta yuborish · Panelda — sahifani har 3 s yangilash | 2 | Har ulanishda ro'yxat bazadan. | 8 |
  | 4 | Tinglovchi `connect` ichida. Server ikki marta qayta yondi. Bitta buyurtmada nima bo'ladi? | Hodisa umuman kelmaydi — tinglovchi yo'q · Ulanish yopiladi va qayta ochilmaydi · Token qayta so'raladi, admin qayta kiradi · Uchta `GET` ketadi, sariq belgi yo'qoladi | 4 | Har qayta ulanishda yana bitta tinglovchi. | 10 |
  | 5 | DevTools Offline 6 soniya, shu payt buyurtma. Natija? | Buzilmadi — kadr Online'da keldi, ro'yxat yangi · Buzildi — hodisa yo'qoldi, ro'yxat eski · Belgi darhol «Ulanmagan» bo'ldi, qayta urinmadi · Sahifa o'zi qayta yuklandi va ro'yxat yangilandi | 1 | Brauzer ochiq ulanishni yopmadi. | 6 |
  | 6 | DevTools Offline 60 soniya. Nega buziladi? | Brauzer bir daqiqadan keyin sahifani o'zi yopadi · Ping kelmaydi — klient uzadi, kadr tashlanadi · Server 60 s dan keyin tokenni bekor qiladi · Offline paytida bot buyurtma olmaydi | 2 | 25 + 20 s qoidasi. | 6 |
  | 7 | `connectionStateRecovery` qachon yordam bermaydi? | Qisqa tarmoq uzilishida — ikki daqiqagacha · Websocket transportida — polling'da ishlaydi · Server qayta yonganda — holat xotirada edi · Klient uzilishdan oldin hodisa olgan bo'lsa | 3 | Tiklash — server jarayoni xotirasida. | 14 |
  | 8 | AI «sinadim, o'tdi» dedi. Nimani tekshirasiz? | Testlar soni oshdimi va hammasi yashil chiqdimi · Diff qisqami — kam fayl o'zgarganmi · AI kuchli modelmi — javobiga ishonsa bo'ladimi · Sinovda eski kod yiqildimi — xato yuz berdimi | 4 | Hodisa kelgan urinish — isbot emas. | 19 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. socket.io ulanishni o'zi tiklaydi, lekin bu yangi ulanish: uzilish paytida yuborilgan hodisa unga kelmaydi — server hodisani faqat hozir ulanganlarga beradi.
  2. «O'zi yangilanadi» — da'vo; tekshiruv — buzib ko'rish va yozuv: usul · nima qildim · nima kutdim · nima bo'ldi → belgi (shu kompyuterda, shu urinishda).
  3. Uch usul, bitta sabab: server qayta yonishi (Telegram navbati panel ulanishidan tez), Offline ping vaqtidan uzun (60 s buziladi, 6 s — yo'q), tarmoq uzilishi.
  4. Tuzatish: `connect` ichida `yukla()` — birinchi va har qayta ulanishda ro'yxat bazadan; tinglovchi bir marta, `connect` dan tashqarida (ichida — har qayta ulanishda yana bittasi, takror `GET`).
  5. `connectionStateRecovery` — qisqa tarmoq uzilishida yordam beradi; server qayta yonganda va hodisa olmagan klientda — yo'q. Qayta so'rash majburiy, tiklash — qo'shimcha.
  6. AI tuzatishiga to'rt savol: qayerda so'raydi · tinglovchi nechta · sinovda eski kod yiqildimi · nima ortiqcha qo'shildi; hodisa kelgan urinish — isbot emas.
- **Uyga vazifa** (M14, M30): «O'z OrderBotNest nusxangizda (`ws2-done`) holat o'zgarishini ham buzib tekshiring: panel ochiq, DevTools Offline belgi «Ulanmoqda…» bo'lguncha, shu payt admin botda `/orders` dan buyurtmani **tasdiqlasin**, keyin Online. Holat ustuni yangilandimi — `BUZISH.md` ga qator yozing. Keyin `scripts/live-client.js` ga har `connect` da `socket.recovered` ni chiqaradigan satr qo'shing va gateway'ga `connectionStateRecovery` yoqib, tarmoq uzilishi va server qayta yonishida qiymatni yozing (ikki qator). Gateway sozlamasini qoldirish-qoldirmaslik qaroringizni README «Qayta ulanish» bo'limiga bir gap bilan yozing. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Holat | Offline → admin tasdiqlaydi → Online | «Tasdiqlandi» ko'rindi yoki yo'q — yozuvda |
  | 2 | Yozuv | `BUZISH.md`: yangi qator | usul · nima qildim · kutdim · bo'ldi · belgi |
  | 3 | Klient | `live-client.js`: `connect` da `recovered=${s.recovered}` | terminalda `recovered=…` |
  | 4 | Tiklash | `@WebSocketGateway({ connectionStateRecovery: … })` · server Ctrl+C va qayta | ikki qator: tarmoq / qayta yonish |
  | 5 | Topshirish | README qarori · `git push` → repo linki platformaga | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: yozuvda «Nima bo'ldi» — ko'rgani · `recovered` qiymati ikki holatda · qaror sababi bilan · `connect` da qayta so'rash o'chirilmagan.
- **Eslatma:** qayta ulanish — yangi ulanish · uzilish paytidagi hodisa yo'qoladi · buzish yozuvi ustunlari · uch usul (qayta yonish · Offline ≥ 45 s · tarmoq) · `connect` da `yukla()` · tinglovchi tashqarida · `connectionStateRecovery` chegarasi · AI'ga to'rt savol · m10-05 xaritasi va xona · sinfdagi olti holat · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **Webhook** — to'lov xabari: imzo, takror va rad».

---

## «KOD» — qurishda
1. WebSocket-1 v2 yordamchilari (`tsLine`, `outRange`, `outPick`, `lineN`, `kod`, `Code`, `PanelView`, `Flow`) — `ws2/parts/04-yordam.jsx` ga nusxa; `PanelView` — `ws2v2-panel.mjs` SURAT qatorlaridan (`[yangi]` → sariq).
2. Chiqishlar `ws2v2-out/`, `ws2v2-ai/` dan aynan (`dev/ws2-kod.py`); fayllar `order-bot` `ws2-start` / `ws2-done` teglaridan, `maydon-jamoa` `m12-dars-05-*` dan.
3. LineCheck (11-ekran): xato nusxa `ulan()` (`00b`) — `target` = `connect` ichidagi `ulanish.on('order-changed'…)`; `fixed` — `ws2-done` ko'rinishi.
4. Isbotlar: 9 — `/#?\s*\d+/` · 12 — `/^\D*3\D*$/` · 16 — `/GET \/admin\/orders → \d+ ta/`.
5. LESSON_ID o'zgarmaydi (M44) — v1 dagi qiymat.

## Ochiq savollar
1. Haqiqiy Telegram bilan «navbat» (server o'chiq paytda yozilgan xabar) sinalmagan — Telegraf `launch` xatti-harakatidan; amaliyotlar Telegram navbatiga tayanmaydi (Offline va `npm run live`).
2. Render, Expo Go, uchish rejimi — o'quvchi darsidan, sinalmagan (⚠).
