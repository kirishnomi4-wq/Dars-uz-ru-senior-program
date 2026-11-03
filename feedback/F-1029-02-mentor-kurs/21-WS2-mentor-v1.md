# Mentor kursi · WebSocket-2 «Ulanish uzilsa: buzamiz va tuzatamiz» — MD v1

F-ID: F-1029-02 (WebSocket-2) · Sana: 2026-11-01 (avtopilot) · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `20-WS2-PRD.md` v1 (avtopilot takliflari Q1–Q2)
Fayl (quriladi): `src/mentor-kurs/WsReconnectMentorLesson.jsx` · bo'laklar `src/mentor-kurs/ws2/parts/` · dvigatel — umumiy `parts/01–02`
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/ws2-out/` (`drive-ws2.sh` + `ws2-sinov.js`) · amaliyotlar mentor yo'lida: `manba/ws2-amal-out/` (`drive-ws2-amaliyot.sh`, klientlar `manba/ws2-klient.js`, `manba/ws2-klient-tuzatilgan.js`)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | WebSocket-1 ni o'tgan mentor: gateway, uch holat, hodisa `oyin-ozgardi`. |
| Dars oxirida mentor | 1) «bajardim» da'vosini uch usul bilan buzib tekshirishni biladi · 2) buzish yozuvini o'qiydi va yozadi · 3) uch xatoning sababini koddan ko'rsatadi · 4) tuzatishni o'zi yozadi va qayta tekshiradi · 5) m10-05 ni o'tadi |
| O'quvchi darsi | **m10-05** «Ulanish uzilsa: buzamiz va tuzatamiz» (19 ekran). |
| Kursdagi o'rni | WebSocket-1 → **shu** → keyingi mavzu (M31: raqamsiz) |
| Til | M9. Atamalar: chekka holat (edge case), qayta ulanish (reconnect), tinglovchi (listener), xona (room), buzish yozuvi. |
| Misol-ip | **O'quvchi darsidagi aynan:** Maydon Jamoa, «Hozir ko'ryapti», jonli xabar, `BUZISH.md`; repo `maydon-jamoa` — `m12-dars-05-start` (agent «bajardim» degan holat) → `m12-dars-05-done` (tuzatilgan). |
| Haqiqiylik (M10) | 01.11.2026: Backend `maydon-jamoa` (m12-dars-04-done = 05-start kodi) + lokal PostgreSQL; ilova o'rniga Node `socket.io-client` 4.8.4 — `mobil/src/ulanish.ts` ning ikki versiyasi aynan. «Internet uzildi» — TCP proksi kesildi. Telefon, Expo Go, Render — sinalmagan, «⚠». |
| Hajm | **20 ekran** · 5 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · jami ≈ 1 soat |
| Me'yor | ≤ 5 segment, ≤ 60 so'z, ko'prik, «Xulosa», kalit 8–14 so'z |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **chekka holat** — odatdagi yo'ldan chetdagi holat: internet uzildi, ilova fonda, Backend qayta chiqdi. README «Chekka holatlar» — uchta.
- **buzish yozuvi** — har urinish: usul · nima qildim · nima kutdim · nima bo'ldi → belgi («buzildi» / «buzilmadi» — shu telefonda, shu urinishda).
- **uzilish paytidagi hodisa** — Backend uni faqat ulangan ilovalarga yuboradi; uzilgan ilova keyin ham olmaydi → qayta ulanganda qayta so'rash.
- **`connect` har ulanishda** — birinchi va har qayta ulanishda ishlaydi; ichida qo'shilgan tinglovchi har safar ko'payadi.
- **xona** — `oyin-{id}`; uzilganda ulanish hamma xonadan chiqadi; qayta ulanish o'zi kirmaydi.

**Darsning ipi:** «bajardim» — da'vo → buzish yozuvi → internet uzildi (son eski) → yangi versiya (tinglovchi ikki marta) → yangi versiya (xona: «Hozir ko'ryapti: 1») → tuzatish (bitta fayl) → qayta tekshiruv → m10-05 ga ko'prik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | «Bajardim» — da'vo | Lesson | 1 · talab |
| 3 | Buzish yozuvi | Lesson | 1 |
| 4 | Internet uzildi — son eski | Lesson | 2 · uzilish |
| 5 | Sabab va tuzatish: qayta so'rash | Lesson | 2 |
| 6 | Tekshiruv 1 — uzilishdan keyin son | MCRetry | 2 |
| 7 | `connect` har ulanishda ishlaydi | Lesson | 3 · takror |
| 8 | Tekshiruv 2 — qaysi satr | LineCheck | 3 |
| 9 | Amaliyot 1 — takror tinglovchi | Practice | 3 |
| 10 | Xona — «Hozir ko'ryapti: 1» | Lesson | 4 · xona |
| 11 | Tekshiruv 3 — ikkinchi telefon | MCRetry | 4 |
| 12 | Amaliyot 2 — ikkinchi telefon | Practice | 4 |
| 13 | Tuzatish: bitta fayl, uch joy | Lesson | 4 |
| 14 | Amaliyot 3 — tuzatib qayta tekshirish | Practice | 4 |
| 15 | Tekshiruv 4 — fonga olish nega buzilmadi | MCRetry | 4 |
| 16 | m10-05 xaritasi | Lesson | 5 · ko'prik |
| 17 | A1 va A2 — o'quvchi o'z ilovasini buzadi | Lesson | 5 |
| 18 | O'quvchi darsidagi so'zlar va sinfdagi holatlar | Lesson | 5 |
| 19 | O'z-sinov — 8 savol | Screen27 | — |
| 20 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code `maydon-jamoa` (`mobil/src/ulanish.ts`, `backend/src/oyinlar.gateway.ts`) + terminal (klient va Backend) + `BUZISH.md` jadvali + ikki telefon maketi (⚠; sonlar haqiqiy chiqishdan).

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · WebSocket` · Sarlavha: **Agent «bajardim» dedi. Uch usul bilan buzib ko'ramiz**
- Sahna: reja (5 bosqich); `BUZISH.md` (m12-dars-05-done) jadvalining «Usul» va «Belgi» ustunlari: internetni uzish — buzildi · fonga olish — buzilmadi · yangi versiya — buzildi.
- Reja: 01 Talab va buzish yozuvi · 02 Internet uzildi · 03 Yangi versiya: takror tinglovchi · 04 Yangi versiya: xona va tuzatish · 05 O'quvchi darsini o'tish
1. **Agent «bajardim» degan ishni uch usul bilan buzib, tekshirib ko'ramiz**
   Ovoz: «Assalomu alaykum. Oldingi darsda ulanish va belgini ko'rdik. Endi agent «uchala chekka holatni bajardim» degan ilovani uch usul bilan buzib, tekshirib ko'ramiz.»
2. **Avval talab va buzish yozuvi, keyin internet uzilishi**
   Ovoz: «Avval talab va buzish yozuvi: nima qildim, nima kutdim, nima bo'ldi. Keyin birinchi usul, internetni uzish.» · reja 01–02
3. **Keyin Backend'ning yangi versiyasi: ikki xato va bitta faylda tuzatish**
   Ovoz: «Keyin Backend'ning yangi versiyasi. U ikki xatoni ochadi. Uchala xato bitta faylda tuzatiladi, Backend o'zgarmaydi.» · reja 03–04
4. **Uch xato — haqiqiy yurgizilgan; uch amaliyot. Shoshilmang: Davom ustozdan keyin**
   Ovoz: «Uchala xatoni o'quvchilar loyihasida haqiqiy yurgizdik. Uchta amaliyot bor. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 05
- Manba: repo `BUZISH.md` (m12-dars-05-done); `ws2-out/README.md`.

---

## 2 · «Bajardim» — da'vo  ← `Lesson`
- Kicker: `1-bosqich · talab` · Sarlavha: **README'da uch chekka holat; agent «bajardim» degan — hech kim tekshirmagan**
- Sahna: README «Chekka holatlar» (aynan, 3 band) + `m12-dars-04-done` README izohi «Qayta ulanish maxsus boshqarilmaydi» + o'quvchi darsi s0 belgisi «da'vo · tekshirilmagan».
1. **README'da uchta chekka holat yozilgan: uzilish, takror, fon**
   Ovoz: «Avval talabni ko'raylik. Maydon Jamoa README'sida uchta chekka holat yozilgan. Birinchi: internet uzilib qaytsa, ro'yxat yangi holatni ko'rsatsin.»
2. **Ikkinchisi — bitta o'zgarish bir marta; uchinchisi — fondan qaytganda yangi holat**
   Ovoz: «Ikkinchi: bitta o'zgarish ekranni bir marta yangilasin, qayta ulangandan keyin ham. Uchinchi: ilova fonda bo'lganda o'zgarish bo'lsa, qaytganda yangi holat ko'rinsin.»
3. **Agent «bajardim» dedi — bu da'vo: kodda qayta ulanish maxsus boshqarilmaydi**
   Ovoz: «Agent uchalasini bajardim dedi. Lekin bu da'vo, hech kim tekshirmagan. Repo yozuvida ochiq yozilgan: qayta ulanish maxsus boshqarilmaydi.»
4. **Xulosa: «bajardim» — tekshiruv emas; tekshiruv — buzib ko'rish**
   Ovoz: «Xulosa: agentning bajardim degani tekshiruv emas. Tekshiruv bitta: shu holatni ataylab chaqirib, ekranga qarash. O'quvchi darsi shu fikrdan boshlanadi.»
- Manba: repo README «Chekka holatlar» (m12-dars-04-done), README «Ortda qoldingizmi» jadvali (`m12-dars-04-done` qatori); o'quvchi darsi s0.

## 3 · Buzish yozuvi  ← `Lesson`
- Kicker: `1-bosqich · talab` · Sarlavha: **Har urinish: nima qildim · nima kutdim · nima bo'ldi → belgi**
- Sahna: `BUZISH.md` (m12-dars-05-done) jadvali — 3 qator, ustunlar aynan; pastda: «buzilmadi — shu telefonda, shu urinishda».
1. **Buzish yozuvi — har urinishga bitta qator, besh ustun**
   Ovoz: «Talabni ko'rdik, endi uni qanday tekshirib yozish. Buzish yozuvida har urinishga bitta qator: usul, nima qildim, nima kutdim, nima bo'ldi va belgi.»
2. **«Nima kutdim» — talabdan; «Nima bo'ldi» — ekranda ko'rgan, taxmin emas**
   Ovoz: «Nima kutdim, talabdan olinadi. Nima bo'ldi, ekranda ko'rganingiz, taxmin emas. Belgi shu ikkisini solishtirib qo'yiladi: buzildi yoki buzilmadi.»
3. **Mentor misolida: ikki usul buzdi, fonga olish buzmadi**
   Ovoz: «Mentor misolida uch urinishdan ikkitasi buzdi: internetni uzish va yangi versiya. Fonga olib qaytarish buzmadi. Nega, o'n beshinchi ekranda ko'ramiz.»
4. **Xulosa: «buzilmadi» — shu telefonda, shu urinishda; hamma telefon uchun isbot emas**
   Ovoz: «Xulosa: buzilmadi degani faqat shu telefonda va shu urinishda. Bu hamma telefon uchun isbot emas. O'quvchi ham shunday yozadi.»
- Manba: repo `BUZISH.md`; o'quvchi darsi s9.

---

## 4 · Internet uzildi — son eski  ← `Lesson`
- Kicker: `2-bosqich · uzilish` · Sarlavha: **Belgi yana «Ulangan», lekin ekranda 6 / 10 — Backend'da 7 / 10**
- Sahna: terminal (haqiqiy, `ws2-out/01`, eski ilova = m12-dars-04-done):
  ```
    0.9s  [Ali] ulangan
    1.0s  [Ali] GET /oyinlar (ekran ochildi) → Maktab maydoni: 6 / 10
    1.8s  --- internet uzildi ---
    1.8s  [Ali] ulanmoqda  (disconnect: transport close)
    2.4s  [Ali] ulanmoqda  (connect_error: xhr poll error) …
    3.3s  [Sardor] POST /oyinlar/2/qoshilish → 201
    4.8s  --- internet qaytdi ---
    5.3s  [Ali] ulangan
    6.8s  NATIJA: Ali ekranida 6 / 10 · Backend'da 7 / 10
  ```
  + ikki telefon maketi: Ali «Ulangan» · 6 / 10 (qizil) · Backend 7 / 10.
1. **Birinchi usul: Ali'ning internetini uzdik — belgi «Ulanmoqda»**
   Ovoz: «Yozuv qanday bo'lishini bildik, endi birinchi urinish: internetni uzish. Ali ilovani ochdi: olti. Keyin uning internetini uzdik. Belgi ulanmoqda bo'ldi, bu kutilgan.»
2. **Uzilish paytida Sardor qo'shildi — Backend 201 qaytardi va hodisa yubordi**
   Ovoz: «Shu paytda Sardor o'yinga qo'shildi. Backend ikki yuz bir qaytardi va hamma ulangan ilovaga hodisa yubordi. Ali esa hozir ulanmagan.»
3. **Internet qaytdi, belgi «Ulangan» — lekin Ali'da 6, Backend'da 7**
   Ovoz: «Internet qaytdi, belgi yana ulangan. Lekin Ali'ning ekranida hali olti, Backend'da esa yetti. Talab buzildi: ro'yxat yangi holatni ko'rsatmayapti.»
4. **Xulosa: belgi «Ulangan» — bu ekrandagi son to'g'ri degani emas**
   Ovoz: «Xulosa: belgi ulangan bo'lishi ekrandagi son to'g'ri degani emas. Mentor misolidagi buzish yozuvi ham aynan shuni yozgan: buzildi.»
- Manba: `ws2-out/01-uzilish-eski.txt`; repo `BUZISH.md` 1-qator. «Internet uzildi» — TCP proksi kesildi (telefonda uchish rejimi ⚠).

## 5 · Sabab va tuzatish: qayta so'rash  ← `Lesson`
- Kicker: `2-bosqich · uzilish` · Sarlavha: **Uzilish paytidagi hodisa keyin kelmaydi — qayta ulanganda `GET /oyinlar`**
- Sahna: VS Code — `mobil/src/ulanish.ts` (m12-dars-05-done, 54–58-satr) + terminal (`ws2-out/02`, yangi ilova):
  ```
    6.0s  [Ali] ulangan
    6.0s  [Ali] GET /oyinlar (qayta ulanganda) → Maktab maydoni: 8 / 10
    7.5s  NATIJA: Ali ekranida 8 / 10 · Backend'da 8 / 10
  ```
1. **Backend hodisani faqat hozir ulangan ilovalarga yuboradi — navbatga qo'ymaydi**
   Ovoz: «Nega son eski qoldi? Backend hodisani faqat hozir ulangan ilovalarga yuboradi. Uzilgan ilova uchun navbatga qo'ymaydi. Qayta ulangach ham u kelmaydi.»
2. **Tuzatish: `connect` ichida bitta qator qo'shiladi — ro'yxatni qayta so'rash `qaytaSora()`**
   Ovoz: «Tuzatish bitta qator: connect ichida qayta so'rash. Connect har qayta ulanishda ishlaydi, demak ulanish tiklangan zahoti ilova yangi sonni oladi.»
3. **Tuzatilgan ilova: qayta ulandi va darhol 8 / 10 — Backend bilan bir xil**
   Ovoz: «Tuzatilgan ilovada xuddi shu sinov: uzilish paytida Jasur qo'shildi, qayta ulangach darhol so'radi va sakkiz oldi. Backend'da ham sakkiz.»
4. **Xulosa: qayta ulanish — «nima o'tkazib yubordim?» deb qayta so'rash payti**
   Ovoz: «Xulosa: qayta ulanish, nimani o'tkazib yubordim deb qayta so'rash payti. O'quvchi darsi buni bir gap bilan aytadi: uzilish paytidagi hodisa keyin kelmaydi.»
- Manba: `ws2-out/02-uzilish-yangi.txt`, `00b-ulanish-farq.txt`; o'quvchi darsi s2.

## 6 · Tekshiruv 1 — uzilishdan keyin son  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Uzilish paytida Sardor qo'shildi. Belgi yana «Ulangan». Eski ilovada ekranda nima?**
- Ovoz: «Uzilish xatosini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Uzilish paytida Sardor qo'shildi, belgi yana ulangan. Tuzatilmagan ilovada ekranda nima turadi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Yangi son — hodisa qayta ulangach keladi · 2 Eski son — uzilish paytidagi hodisa kelmaydi · 3 Xato xabari · 4 Bo'sh ro'yxat
- To'g'ri (ovoz, `ok`): «To'g'ri. Hodisa faqat ulangan ilovaga ketdi, keyin kelmaydi. Shuning uchun ekranda eski son qoladi. Tuzatish shunday: ilova qayta ulanganda sonni Backend'dan qayta so'raydi. Demak, uzilish paytida o'tkazib yuborilgan hodisa qaytib kelmaydi, ma'lumotni qayta so'rash kerak.» · qisqa: «Eski son: uzilish paytidagi hodisa keyin kelmaydi.»
- Xato izohlari: 1 — «Haqiqiy natijada kelmadi (4-ekran).» · 3 — «Xato yo'q, lekin natija buzilgan.» · 4 — «Ro'yxat joyida, faqat son eski.»
- Maslahat: «Hodisa yuborilganda Ali ulangan edimi?»
- Manba: `ws2-out/01`.

---

## 7 · `connect` har ulanishda ishlaydi  ← `Lesson`
- Kicker: `3-bosqich · takror` · Sarlavha: **Yangi versiyadan keyin bitta hodisa — tinglovchi ikki marta**
- Sahna: VS Code — `mobil/src/ulanish.ts` (m12-dars-04-done, 48–55-satr) + terminal (`ws2-out/03`, eski ilova):
  ```
    1.8s  --- Backend yangi versiyasi: qayta ishga tushirildi ---
    1.8s  [Ali] ulanmoqda  (disconnect: transport close)
    2.9s  [Ali] ulangan
    4.0s  [Ali] oyin-ozgardi {"oyinId":3,"sabab":"qoshildi"} — tinglovchi ishladi (1)
    4.0s  [Ali] oyin-ozgardi {"oyinId":3,"sabab":"qoshildi"} — tinglovchi ishladi (2)
    4.0s  [Bekzod] POST /oyinlar/3/qoshilish → 201
    5.5s  NATIJA: bitta o'zgarish — Ali'da tinglovchi 2 marta ishladi
  ```
1. **Uchinchi usul: Backend'ning yangi versiyasi — ulanish uziladi va o'zi tiklanadi**
   Ovoz: «Ikkinchi usulga keyin qaytamiz. Hozir uchinchisi: Backend'ning yangi versiyasi. Backend qayta ishga tushdi, ulanish uzildi va bir soniyada o'zi tiklandi.»
2. **Keyin Bekzod qo'shildi — bitta hodisa, lekin tinglovchi ikki marta ishladi**
   Ovoz: «Keyin Bekzod qo'shildi. Bitta o'zgarish, bitta hodisa. Lekin Ali'da tinglovchi ikki marta ishladi va ro'yxat ikki marta so'raldi. Telefonda jonli xabar ikki marta chiqadi.»
3. **Sabab: tinglovchi `connect` ichida — har qayta ulanishda yana bittasi qo'shiladi**
   Ovoz: «Sabab kodda: oyin ozgardi tinglovchisi connect ichida qo'shilgan. Connect birinchi ulanishda ham, har qayta ulanishda ham ishlaydi. Har safar yana bitta tinglovchi.»
4. **Xulosa: `connect` ichiga faqat har ulanishda qilinadigan ishni yozing**
   Ovoz: «Xulosa: connect ichiga faqat har ulanishda qayta qilinadigan ishni yozing. Tinglovchi bir marta, tashqarida qo'shiladi.»
- Manba: `ws2-out/03-versiya-eski.txt`; repo m12-dars-04-done `mobil/src/ulanish.ts` 48–55; `BUZISH.md` 2-muammo.

## 8 · Tekshiruv 2 — qaysi satr  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Qayta ulangandan keyin jonli xabar ikki marta chiqdi**
- Shart (`task`): «Qoida: tinglovchi **bir marta** qo'shiladi; `connect` har qayta ulanishda qayta ishlaydi. Backend qayta chiqqach bitta o'zgarish tinglovchini ikki marta ishlatdi. **Har qayta ulanishda yana bitta tinglovchi qo'shadigan satrni bosing.**»
- Ovoz (`q`): «Sababni ko'rdingiz, endi kodda toping. Ikkinchi tekshiruv. Qayta ulangandan keyin jonli xabar ikki marta chiqdi. Har qayta ulanishda yana bitta tinglovchi qo'shadigan satrni bosing.»
- Fayl: `mobil/src/ulanish.ts` (m12-dars-04-done, 48–55):
  ```ts
  48  ulanish.on('connect', () => {
  49    holatQoy('ulangan');
  50    ulanish?.on('oyin-ozgardi', async () => {     ← connect ichida
  51      const oldingi = oxirgiRoyxat();
  52      const yangi = await qaytaSora();
  53      if (oldingi && yangi) jonliXabarlar(oldingi, yangi).forEach(jonliXabarQosh);
  54    });
  55  });
  ```
- Tuzatilgan (`fixed`): m12-dars-05-done ko'rinishi — `connect` ichida `holatQoy('ulangan')` · `qaytaSora()` · `if (ochiqOyin !== null) ulanish?.emit('oyin-ochildi', …)`; tinglovchi `connect` dan keyin, alohida (yashil). `fixedExtra`: tuzatilgan ilova — `tinglovchi ishladi (1)` (`ws2-out/04`).
- To'g'ri (ovoz, `ok`): «To'g'ri. Ellikinchi satr: tinglovchi connect ichida. Har qayta ulanishda u yana qo'shiladi. Tuzatishda u connect'dan tashqariga chiqadi va bir marta qo'shiladi. Demak, har qayta ulanishda ishlaydigan joyga tinglovchi qo'yilmaydi.»
- Qisqa (`okShort`): «50-satr: tinglovchi `connect` ichida — har qayta ulanishda yana bittasi.»
- Maslahat (`hint`): «Qaysi satr connect bilan birga har safar qayta ishlaydi va yangi narsa qo'shadi?»
- Manba: `ws2-out/03`, `04`, `00b-ulanish-farq.txt`.

## 9 · Amaliyot 1 — takror tinglovchi  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **`m12-dars-05-start`: Backend'ni qayta yoqing — bitta hodisa ikki marta** · `tableAt: 3`
1. **Endi siz: takror tinglovchi xatosini o'z kompyuteringizda o'zingiz chaqirasiz**
   Ovoz: «Satrni topdingiz, endi xatoni o'zingiz chaqirasiz. O'n besh daqiqa. Backend o'quvchi loyihasidan, ilova o'rnida kichik klient, u ulanish ts ning eski qoidasini aynan takrorlaydi.»
2. **1–2-qadam: `m12-dars-05-start`, `npm ci`, start; klient Ali tokeni va `OYIN=3` bilan**
   Ovoz: «Birinchi: m12 dars besh start tegi, npm ci va start. Ikkinchi: klientni Ali tokeni bilan yoqing, o'yin uch ochiq. Hozir ko'ryapti: bir.»
3. **3–4-qadam: Backend'da Ctrl+C va start; Vali qo'shiladi — isbot: «ishladi (2)»**
   Ovoz: «Uchinchi: Backend'da Ctrl C, keyin yana start, klient o'zi ulanadi. To'rtinchi: Vali uchinchi o'yinga qo'shiladi. Isbot maydoniga ikkinchi marta ishlagan satrni qo'ying.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror tinglovchi xatosini o'z kompyuteringizda chaqirgan va bitta hodisa ikki marta ishlaganini ko'rgan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Backend | `maydon-jamoa` papkasida: `git checkout -f m12-dars-05-start` · `cd backend` · `npm ci` · `npm run start` (`.env` WebSocket-1 dan qoladi) | `Nest application successfully started` |
  | 2 | Ali klienti | `ws-klient` papkasida: `klient.js` — «Kodni ochish» · `TOKEN=<Ali tokeni> OYIN=3 node klient.js` | `ulangan` · `Hozir ko'ryapti: 1` |
  | 3 | Yangi versiya | Backend terminalida Ctrl+C · `npm run start` | klient: `ulanmoqda (disconnect: transport close)`, keyin `ulangan` |
  | 4 | O'zgarish | `curl -X POST localhost:3000/oyinlar/3/qoshilish -H "Authorization: Bearer <Vali tokeni>"` | `{"holat":"qoshildi"}` · klient: `tinglovchi ishladi (1)` va `(2)` |
- Isbot: «Ikkinchi marta ishlagan satr» · placeholder: «klient terminalidan HODISA satrini qo'ying» · KOD: `/ishladi \(2\)/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Faqat `(1)` | klient qayta ulanmasdan oldin qo'shildingiz — `ulangan` ikkinchi marta chiqqanini kuting (5 s gacha) |
  | `409` «Siz bu o'yinga qo'shilgansiz» | Vali allaqachon qo'shilgan — `.../oyinlar/3/chiqish` qiling, keyin 3-qadamdan qayta |
  | `JWT_SECRET yo'q — backend/.env ga yozing` | `.env` yo'q — `cp .env.example .env` (WebSocket-1, 7-ekran) |
- Manba: `ws2-amal-out/01–02`; `manba/ws2-klient.js` (`klient.js` — aynan).

---

## 10 · Xona — «Hozir ko'ryapti: 1»  ← `Lesson`
- Kicker: `4-bosqich · xona` · Sarlavha: **Ikki telefonda o'yin ochiq, lekin «Hozir ko'ryapti: 1» — Ali xonaga qaytmagan**
- Sahna: VS Code — `backend/src/oyinlar.gateway.ts` (m12-dars-04-done) izohi «Ulanish uzilganda u hamma xonadan o'zi chiqadi» + `ochildi` (`join`) + terminal (`ws2-out/05` eski · `06` yangi) + ikki telefon maketi (Vali: 1 qizil · 2 yashil).
  ```
  # eski (05):
    7.5s  [Vali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {"oyinId":1,"soni":1})
  # yangi (06):
    5.1s  [Ali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {"oyinId":1,"soni":2})
    5.1s  [Vali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {"oyinId":1,"soni":2})
  ```
1. **«Hozir ko'ryapti» — o'yin xonasidagi ulanishlar soni; ekran ochilganda xonaga kiriladi**
   Ovoz: «Takror tinglovchini ko'rdik, yangi versiya yana bir xatoni ochadi. Hozir ko'ryapti, o'yin xonasidagi ulanishlar soni. O'yin ekrani ochilganda ilova oyin ochildi yuboradi va xonaga kiradi.»
2. **Uzilganda ulanish hamma xonadan chiqadi — qayta ulanish o'zi kirmaydi**
   Ovoz: «Backend kodida yozilgan: ulanish uzilganda u hamma xonadan o'zi chiqadi. Qayta ulangan ilova esa xonaga o'zi qaytmaydi. Ekran ochiq, lekin xonada emas.»
3. **Yangi versiyadan keyin Vali o'yinni ochdi — 2 o'rniga 1**
   Ovoz: «Natija: yangi versiyadan keyin Vali shu o'yinni ochdi. Ikki telefonda ham ochiq, lekin Vali bir ko'rdi. Tuzatilgan ilovada ikkalasi ikki ko'radi.»
4. **Xulosa: qayta ulanganda ilova ochiq o'yin xonasiga qayta kiradi**
   Ovoz: «Xulosa: ilova qaysi o'yin ochiqligini eslab qoladi va qayta ulanganda o'sha xonaga qayta kiradi. Backend o'zgarmaydi.»
- Manba: `ws2-out/05-xona-eski.txt`, `06-xona-yangi.txt`; repo m12-dars-04-done gateway (`handleDisconnect` izohi).

## 11 · Tekshiruv 3 — ikkinchi telefon  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **Ali o'yin ekranida. Backend qayta chiqdi. Keyin Vali shu o'yinni ochdi. Eski ilovada Vali nechani ko'radi?**
- Ovoz: «Xonani ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. Ali o'yin ekranida, Backend qayta chiqdi, keyin Vali shu o'yinni ochdi. Tuzatilmagan ilovada Vali nechani ko'radi? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 Bir — Ali xonaga qaytmagan · 2 Ikki · 3 Nol · 4 Uch — eski ulanish ham sanaladi
- To'g'ri (ovoz, `ok`): «To'g'ri, bir. Ali uzilganda xonadan chiqdi va qayta ulangach xonaga qaytmadi, shuning uchun xonada faqat Vali bor. Tuzatish shunday: ilova qayta ulanganda ochiq o'yin xonasiga qayta kiradi. Demak, qayta ulanish xonani tiklamaydi, xonaga kirishni ilova o'zi takrorlashi kerak.» · qisqa: «Bir — Ali xonaga qaytmagan.»
- Xato izohlari: 2 — «Bu tuzatilgan ilovada (10-ekran).» · 3 — «Vali o'zi sanaladi.» · 4 — «Uzilgan ulanish xonadan chiqqan.»
- Maslahat: «Qayta ulangan Ali oyin-ochildi yubordimi?»
- Manba: `ws2-out/05`.

## 12 · Amaliyot 2 — ikkinchi telefon  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 5 daqiqa` · Sarlavha: **Vali klienti o'yinni ochadi — «Hozir ko'ryapti» nechani ko'rsatadi** · `tableAt: 2`
1. **Endi siz: ikkinchi telefon o'rnida Vali klientini yoqasiz**
   Ovoz: «Xatoni tushundingiz, endi uni o'zingiz ko'rasiz. Besh daqiqa. Ali klienti birinchi amaliyotdan beri ishlab turibdi, u qayta ulangan.»
2. **1–2-qadam: Ali klienti ishlab turibdi; ikkinchi terminalda Vali klienti `OYIN=3`**
   Ovoz: «Birinchi: Ali klienti ishlab turganini tekshiring. Ikkinchi: yangi terminalda Vali klientini xuddi shu o'yin bilan yoqing. Isbot maydoniga Vali ko'rgan sonni yozing.»
3. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Ikkala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz qayta ulangan Ali xonaga qaytmaganini Vali'dagi son orqali o'z ko'zingiz bilan ko'rgan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Ali | 1-amaliyotdagi klient yopilmagan | oxirgi satrlar `ulangan` va `tinglovchi ishladi (2)` |
  | 2 | Vali | yangi terminalda: `TOKEN=<Vali tokeni> OYIN=3 node klient.js` | `ulangan` · `Hozir ko'ryapti: 1` |
- Isbot: «Vali'dagi «Hozir ko'ryapti» soni» · placeholder: «faqat sonni yozing» · KOD: `/^1$/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `Hozir ko'ryapti: 2` | Ali klienti qayta ulanishdan oldin yopilib qayta yoqilgan (yangi jarayon xonaga kiradi) — 1-amaliyotning 3-qadamini qaytaring |
- Manba: `ws2-amal-out/03`.

## 13 · Tuzatish: bitta fayl, uch joy  ← `Lesson`
- Kicker: `4-bosqich · tuzatish` · Sarlavha: **`ulanish.ts`: `connect` ichida qayta so'rash va xonaga qaytish, tinglovchi tashqarida**
- Sahna: VS Code — `mobil/src/ulanish.ts` (m12-dars-05-done, 50–64-satr, aynan) + `git diff --stat m12-dars-04-done m12-dars-05-done` (`backend/` yo'q).
1. **Uchala xato bitta faylda — `mobil/src/ulanish.ts`; Backend o'zgarmagan**
   Ovoz: «Uch xatoni ko'rdik, endi tuzatish. Uchalasi ham ilovadagi bitta faylda: ulanish ts. Backend'ga tegilmagan, repo farqida backend papkasi yo'q.»
2. **`connect` ichida: holat, qayta so'rash va ochiq o'yin xonasiga qayta kirish**
   Ovoz: «Connect ichida endi uchta ish: belgi ulangan, ro'yxatni qayta so'rash va ochiq o'yin bo'lsa, xonaga qayta kirish. Hammasi har ulanishda qayta qilinishi kerak bo'lgan ishlar.»
3. **`oyin-ozgardi` tinglovchisi — `connect` dan tashqarida, bir marta**
   Ovoz: «Oyin ozgardi tinglovchisi esa connect'dan tashqarida, faylda bir marta. Ochiq o'yin esa o'yin ekrani ochilganda eslab qolinadi.»
4. **Xulosa: «har ulanishda» va «bir marta» ishlarni ajrating**
   Ovoz: «Xulosa: kodda ikki xil ish bor. Har ulanishda qayta qilinadigani connect ichida, bir marta qilinadigani tashqarida. O'quvchi agentga tuzattirganda shuni tekshiring.»
- Manba: `ws2-out/00b-ulanish-farq.txt`, `00-versiyalar.txt`; repo m12-dars-05-done `mobil/src/ulanish.ts` 50–64.

## 14 · Amaliyot 3 — tuzatib qayta tekshirish  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **`klient.js` ni tuzating va xuddi shu usul bilan qayta buzing** · `tableAt: 3`
1. **Endi siz: klientni tuzatasiz va xuddi shu usul bilan qayta buzasiz**
   Ovoz: «Tuzatishni ko'rdingiz, endi o'zingiz yozasiz. O'n besh daqiqa. Ikki klientni ham Ctrl C bilan yoping va Ali klientining klient js faylini tuzating.»
2. **1–2-qadam: `connect` ichida qayta so'rash va xona; tinglovchi tashqarida; Ali klienti**
   Ovoz: «Birinchi: connect ichida faqat qayta so'rash va xonaga kirish qolsin, tinglovchini tashqariga chiqaring. Namuna kod oynasida, nusxalamang. Ikkinchi: Ali klientini yoqing.»
3. **3–4-qadam: Backend'ni qayta yoqing, Vali'ni oching — isbot «Hozir ko'ryapti: 2»**
   Ovoz: «Uchinchi: Backend'da Ctrl C va start. Ali qayta ulanadi. To'rtinchi: Vali klientini yoqing va Vali'ni o'yindan chiqaring. Isbot: Vali ko'rgan son.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin klient tuzatilgan va siz xuddi shu usul bilan qayta buzib, tuzatish ishlashini isbotlagan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Tuzatish | `klient.js` — «Kodni ochish» (namuna, nusxalash yo'q) | fayl saqlandi |
  | 2 | Ali | `TOKEN=<Ali tokeni> OYIN=3 node klient.js` | `ulangan` · `Hozir ko'ryapti: 1` · `GET /oyinlar (ulanganda)` |
  | 3 | Yangi versiya | Backend: Ctrl+C · `npm run start` | Ali: `ulangan` · `Hozir ko'ryapti: 1` · `GET /oyinlar (ulanganda)` |
  | 4 | Vali | `TOKEN=<Vali tokeni> OYIN=3 node klient.js` · `curl -X POST localhost:3000/oyinlar/3/chiqish -H "Authorization: Bearer <Vali tokeni>"` | ikkalasida `Hozir ko'ryapti: 2` · Ali: `tinglovchi ishladi (1)` |
- Isbot: «Vali'dagi «Hozir ko'ryapti» soni» · placeholder: «faqat sonni yozing» · KOD: `/^2$/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Vali'da yana `1` | `connect` ichida `oyin-ochildi` yo'q yoki `OYIN` tekshirilmagan — namunaga qarang |
  | Ali'da `(1)` va `(2)` | tinglovchi hali `connect` ichida |
  | Ali'da `(1)` yo'q | Vali chiqmagan (`409`) — avval qo'shiling, keyin chiqing |
- Manba: `ws2-amal-out/04`; `manba/ws2-klient-tuzatilgan.js` (namuna — aynan).

## 15 · Tekshiruv 4 — fonga olish nega buzilmadi  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **Ikkinchi usul — fonga olib qaytarish — mentor misolida buzilmadi. Nega?**
- Ovoz: «Uch xatoning ikkitasi yangi versiyadan chiqdi. Endi buzilmagan usul. To'rtinchi tekshiruv. Fonga olib qaytarish mentor misolida buzilmadi. Nega? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Fonda ulanish uzilmaydi · 2 Hodisa navbatda kutib turadi · 3 Ilova fondan qaytganda ro'yxatni o'zi qayta so'raydi · 4 Backend fonni sezadi
- To'g'ri (ovoz, `ok`): «To'g'ri. Ulanish ts faylida ilova holati kuzatiladi: ilova fondan qaytganda ro'yxat qayta so'raladi. Bu kod m12 dars uch tegidan beri bor. Shuning uchun mentor misolida, shu telefonda va shu urinishda buzilmadi. Demak, ilova fondan qaytganda ma'lumotni qayta so'rasa, fonga olish xatoga olib kelmaydi.» · qisqa: «Fondan qaytganda `AppState` — qayta so'rash.»
- Xato izohlari: 1 — «Uzilishi mumkin — telefonga bog'liq.» · 2 — «Navbat yo'q (5-ekran).» · 4 — «Backend o'zgarmagan.»
- Maslahat: «Ulanish ts da AppState nima qiladi?»
- Manba: repo m12-dars-04-done `mobil/src/ulanish.ts` 63–68 (`AppState` → `qaytaSora`); README m12-dars-03-done qatori («fondan qaytganda ham qayta so'raladi»); `BUZISH.md` 2-qator. Telefonda sinalmagan ⚠.

---

## 16 · m10-05 xaritasi  ← `Lesson`
- Kicker: `5-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m10-05 · «Ulanish uzilsa: buzamiz va tuzatamiz»` · Sarlavha: **m10-05: avval Maydon Jamoa'da topish, keyin o'z ilovasida**
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 «bajardim» — da'vo · s1 reja | README «Chekka holatlar» (2-ekran) |
  | 2 Uch muammo | s2–s3 uzilish · s4–s5 takror · s6–s7 xona | haqiqiy chiqishlar (4, 7, 10-ekran) |
  | 3 Tinglovchi | s8 kod oynasi (namuna, tugma bilan uzilish) | 50-satr (8-ekran) |
  | 4 Yozuv va qayta tekshiruv | s9 buzish yozuvi · s10 test · s11 qayta tekshiruv · s12 mustaqil | «shu telefonda, shu urinishda» (3-ekran) |
  | 5 Amaliyot | A1 o'z ilovasini buzish · A2 agentga tuzattirish | Render, Expo Go (17-ekran) |
1. **m10-05 — 19 ekran: avval Maydon Jamoa'da uch muammo, keyin o'z ilovasi**
   Ovoz: «Uchala xatoni o'zingiz yurgizdingiz, endi o'quvchi darsi: m10-05, o'n to'qqiz ekran. Avval Maydon Jamoa'da uch muammo va sababi, keyin xuddi shu ish o'z ilovasida.»
2. **Darsning og'ir qismi — 8-ekran kod oynasi va ikki blok**
   Ovoz: «O'quvchi darsi o'zi ogohlantiradi: og'ir qismlar sakkizinchi ekrandagi kod oynasi va ikki blok. Ikkinchi, to'rtinchi, oltinchi ekranlarga ortiqcha vaqt bermang.»
3. **Juftlikda qulay — sherik telefonida «Hozir ko'ryapti» ikkini ko'rsatadi**
   Ovoz: «Juftlikda ishlash qulay: sherik telefonida ham shu ekran ochiq bo'lsa, Hozir ko'ryapti xatosi ko'rinadi. Sherik bo'lmasa, agent boshqa akkauntdan o'zgarish qiladi.»
4. **Xulosa: vaqtni bloklarga bering; o'quvchi yozuvida «taxmin» emas, «ko'rdim» bo'lsin**
   Ovoz: «Xulosa: vaqtning ko'pi ikki blokka. O'quvchi yozuvida nima bo'ldi qatori taxmin emas, ekranda ko'rgani bo'lsin. Shuni tekshiring.»
- Manba: `src/10-Modull/BreakAndFixLesson.jsx` — `SCREEN_META` (19), s1 o'qituvchi eslatmasi.

## 17 · A1 va A2 — o'quvchi o'z ilovasini buzadi  ← `Lesson`
- Kicker: `5-bosqich · o'quvchi darsini o'tish` · Sarlavha: **A1: uch usul, agent boshqa akkauntdan; A2: yozuv bilan tuzattirish va qayta tekshirish**
- Sahna: A1 qadamlari (o'quvchi darsidan aynan, qisqartirib): (1) uchish rejimi → «Ulanmoqda…» kuting (bir daqiqagacha) → o'zgarish → o'chiring · (2) boshqa ilovaga o'tish → o'zgarish → bir daqiqadan keyin qaytish · (3) Render: «Manual Deploy» → «Deploy latest commit» (⚠ sinalmagan); A2 prompt bandlari: Qayerda · Nima qilsin · Nima buzilmasin.
1. **A1 da kod yozilmaydi: o'zgarishni agent boshqa akkauntdan qiladi, kuzatish — o'quvchida**
   Ovoz: «Xaritadagi beshinchi blokni ochamiz, darsning asosiy qismi. Birinchi blokda kod yozilmaydi: o'zgarishni agent boshqa akkauntdan qiladi, kuzatish va yozuv o'quvchida.»
2. **Uchinchi usul — Render'da qo'lda qayta chiqarish; bir necha daqiqa cho'zilishi mumkin**
   Ovoz: «Uchinchi usulda o'quvchi Render'da Backend'ni qo'lda qayta chiqaradi. Bu bir necha daqiqa cho'zilishi mumkin. Biz Render'ni sinamadik, dars ham tugma nomini rasmiy hujjatdan olgan.»
3. **Expo Go uchish rejimidan keyin ilovani qayta yuklasa — 1-xato ko'rinmay qolishi mumkin**
   Ovoz: «Ehtiyot bo'ling: o'quvchi darsi ogohlantiradi, Expo Go uchish rejimidan keyin ilovani boshidan yuklasa, birinchi xato ko'rinmay qolishi mumkin. Unda belgi buzilmadi bo'ladi va bu ham natija.»
4. **Xulosa: A2 da agentga yozuv yuboriladi; tuzatishdan keyin xuddi shu usul bilan qayta buziladi**
   Ovoz: «Xulosa: ikkinchi blokda o'quvchi yozuvni agentga yuboradi va tuzattiradi. Keyin buzildi belgili urinishlarni xuddi shu usul bilan qaytaradi. Agentning tuzatdim degani ham da'vo.»
- Manba: o'quvchi darsi `ScreenA1` qadamlari va izohlari (Render «Manual Deploy» — rasmiy hujjatdan; Expo Go — «pilotda tekshiriladi»), `ScreenA2` prompt; s11.

## 18 · O'quvchi darsidagi so'zlar va sinfdagi holatlar  ← `Lesson`
- Kicker: `5-bosqich · sinfda` · Sarlavha: **Da'vo, buzish, belgi — va olti holat**
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | da'vo · tekshirilmagan | agent «bajardim» dedi |
  | buzildi · buzilmadi | ko'rilgan kutilgandan farq qildi yoki farq qilmadi (shu telefonda, shu urinishda) |
  | qayta ulanish | `connect` (har ulanishda) |
  | xona | `oyin-{id}`, «Hozir ko'ryapti» |
  | # | Holat | Belgisi | Sabab |
  |---|---|---|---|
  | 1 | Belgi «Ulangan», son eski | uzilishdan keyin | `connect` da qayta so'rash yo'q |
  | 2 | Jonli xabar ikki marta | qayta ulangandan keyin | tinglovchi `connect` ichida |
  | 3 | «Hozir ko'ryapti» kam | yangi versiyadan keyin | xonaga qayta kirish yo'q |
  | 4 | Hamma urinish «buzilmadi» | Expo Go qayta yuklagan bo'lishi mumkin ⚠ | bu ham natija |
  | 5 | «Ulanmoqda…» uzoq | Render qayta chiqyapti ⚠ | bir necha daqiqa |
  | 6 | Agent «tuzatdim» dedi | qayta tekshiruv qilinmagan | xuddi shu usul bilan qaytarish |
- O'quvchi so'rasa:
  - «Socket.io o'zi qayta ulanadi-ku, nega tuzatamiz?» → ulanishni tiklaydi, lekin o'tkazib yuborilgan hodisani va xonani tiklamaydi.
  - «Qayta ulanish necha marta urinadi?» → sukutda cheklanmagan; kutish ≈1 s dan ikki barobar o'sadi, 5 s dan oshmaydi (o'quvchi darsi s1 o'qituvchi eslatmasi; WebSocket-1 da o'lchangan).
  - «Tinglovchi ikki marta bo'lsa, nima yomon?» → har o'zgarish ikki marta so'raladi, jonli xabar ikki marta chiqadi; har qayta ulanishda yana ko'payadi.
  - «Backend'ni tuzatish kerakmi?» → yo'q: uchala tuzatish ilovada.
1. **O'quvchi «da'vo», «buzildi», «xona» deydi — siz koddagi joyini bilasiz**
   Ovoz: «Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: da'vo, buzildi va buzilmadi, qayta ulanish va xona. Siz har birining kodda qayerda turishini bilasiz.»
2. **Birinchi uchta holat — uch xato: son eski, xabar ikki marta, son kam**
   Ovoz: «Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi uchtasi bugun ko'rgan uch xato. Birinchisi: belgi ulangan, lekin son eski qolgan. Ikkinchisi: jonli xabar ikki marta chiqadi. Uchinchisi: hozir ko'ryapti degan son kam chiqadi.» · 1–3-karta
3. **Qolgan uchtasi: hammasi «buzilmadi», Render uzoq, agent «tuzatdim»**
   Ovoz: «To'rtinchi holat: hamma urinishda ilova buzilmadi. Bunda Expo Go ilovani qayta yuklagan bo'lishi mumkin. Beshinchi holat: Render'dagi server qayta ishga tushishi uzoq vaqt oladi. Oltinchi holat: agent tuzatdim dedi, lekin buni xuddi shu usul bilan qayta tekshirish kerak.» · 4–6-karta
4. **Xulosa: har «bajardim» va «tuzatdim» dan keyin — xuddi shu usul bilan qayta buzish**
   Ovoz: «Xulosa va usul: o'quvchi bajardim yoki tuzatdim deganidan keyin u bilan birga xuddi shu buzish usulini qaytaring. Pastda o'quvchi savollariga tayyor javoblar bor.» · QA
- Manba: `ws2-out/01–06`; o'quvchi darsi s0, s1 o'qituvchi eslatmasi, A1 izohlari; `BUZISH.md`.

## 19 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Agent «bajardim» dedi. Bu nima? | da'vo — tekshirilmagan · tekshiruv · isbot · tuzatish | 1 | Tekshiruv — buzib ko'rish. | 2 |
  | 2 | Buzish yozuvida «Nima bo'ldi» qatori? | talabdan · ekranda ko'rgani · agent aytgani · taxmin | 2 | Taxmin emas. | 3 |
  | 3 | Uzilish paytidagi hodisa? | qayta ulangach keladi · navbatda turadi · keyin kelmaydi · ikki marta keladi | 3 | Faqat ulangan ilovaga ketadi. | 4 |
  | 4 | Uzilish xatosining tuzatishi? | Backend'da navbat · tinglovchini o'chirish · sahifani yangilash · `connect` da qayta so'rash | 4 | Har ulanishda yangi son. | 5 |
  | 5 | `connect` qachon ishlaydi? | birinchi va har qayta ulanishda · faqat birinchi ulanishda · faqat hodisada · hech qachon | 1 | Shuning uchun tinglovchi tashqarida. | 7 |
  | 6 | Tinglovchi `connect` ichida bo'lsa? | hodisa kelmaydi · bitta hodisa ikki marta ishlaydi · ulanish yopiladi · xato chiqadi | 2 | Har qayta ulanishda yana bittasi. | 8 |
  | 7 | Qayta ulangach «Hozir ko'ryapti» kam — nega? | Backend xato · tinglovchi ikki marta · ilova xonaga qayta kirmagan · token eskirgan | 3 | Uzilganda hamma xonadan chiqadi. | 10 |
  | 8 | Uchala tuzatish qayerda? | Backend gateway'da · README'da · Render'da · ilovadagi `ulanish.ts` da | 4 | Backend o'zgarmagan. | 13 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 20 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz**
- Xulosa 6 band: (1) «bajardim» — da'vo; tekshiruv — buzib ko'rish va yozuv · (2) uzilish paytidagi hodisa kelmaydi → `connect` da qayta so'rash · (3) `connect` har ulanishda → tinglovchi tashqarida · (4) uzilganda xonadan chiqadi → qayta ulanganda xonaga qaytish · (5) uchala tuzatish `ulanish.ts` da, Backend o'zgarmagan · (6) m10-05: A1 — o'z ilovasi, A2 — agent tuzatadi, keyin xuddi shu usul bilan qayta tekshiruv.
- **Uyga vazifa** (M14): «O'z loyihangizda yoki maydon-jamoa nusxasida bitta usulni tanlang (Backend'ni qayta yoqish yoki internetni uzish), buzish yozuviga bitta qator yozing, xatoni tuzating va xuddi shu usul bilan qayta tekshiring. `BUZISH.md` va tuzatishni GitHub'ga chiqaring, linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Usul | Backend Ctrl+C → start yoki internet | — |
  | 2 | Yozuv | `BUZISH.md`: usul · nima qildim · nima kutdim · nima bo'ldi · belgi | bitta qator |
  | 3 | Tuzatish | `ulanish` fayli: `connect` ichida qayta so'rash / xona; tinglovchi tashqarida | — |
  | 4 | Qayta tekshiruv | xuddi shu usul | «takrorlanmadi» |
  | 5 | Topshirish | repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: yozuvda taxmin yo'q · tinglovchi bir marta · qayta ulanganda qayta so'rash · qayta tekshiruv natijasi.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **Webhook** — to'lov xabari: imzo, takror va rad». (01.11 sifat ko'rigi B1: Webhook darsi yozilgan, karta uning nomiga moslandi.)

---

## «KOD» — qurishda
1. WebSocket-1 yordamchilari (`ts()`, `tm()`, `Term`, `Phone`, Explorer) — bo'lakda nusxa; generator `dev/ws2-matn.py`.
2. Chiqishlar `ws2-out/`, `ws2-amal-out/` dan aynan.
3. LineCheck (8-ekran): 50-satr → `target={2}`; `fixed` — m12-05 ko'rinishi, har satrga `n`.
4. Isbotlar: 9 — `/ishladi \(2\)/` · 12 — `/^1$/` · 14 — `/^2$/`.

## Ochiq savollar ([GATE M])
1. «Internetni uzish» amaliyotda yo'q (proksi kerak bo'lardi) — faqat haqiqiy demo (PRD Q1); tasdiqlang.
2. Amaliyot tegi `m12-dars-05-start` (kod = `m12-dars-04-done`, farq faqat README) — PRD Q2.
3. Yakundagi keyingi dars kartasi — «Webhook»: kurs tartibi to'g'rimi?

## O'quvchi darslari uchun alohida ish (qaror kerak; tegilmadi)
1. **m10-05** A1 izohi (Expo Go uchish rejimidan keyin qayta yuklashi) — «pilotda tekshiriladi» deb turibdi; pilot natijasi bormi — ma'lum emas.
2. **m10-05** s8 kod oynasi — namuna: uzilishni tugma qiladi; haqiqiy Backend bilan farqi (qayta ulanish 5 s gacha) aytilmagan — kerak emasligi mumkin.
