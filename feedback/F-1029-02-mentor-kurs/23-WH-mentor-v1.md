# Mentor kursi · Webhook «To'lov xabari: imzo, takror va rad» — MD v1

F-ID: F-1029-02 (Webhook) · Sana: 2026-11-01 (avtopilot) · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `22-WH-PRD.md` v1 (avtopilot takliflari Q1–Q2)
Fayl (quriladi): `src/mentor-kurs/WebhookMentorLesson.jsx` · bo'laklar `src/mentor-kurs/wh/parts/` · dvigatel — umumiy `parts/01–02`
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/wh-out/` (`drive-wh.sh`) · amaliyotlar mentor yo'lida: `manba/wh-amal-out/` (`drive-wh-amaliyot.sh`, brauzerda bosilgan)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | NestJS, PostgreSQL va `.env` ni biladigan mentor; webhook va imzo bilan ishlamagan. |
| Dars oxirida mentor | 1) to'lov xabari kimdan kimga borishini aytadi · 2) imzo qanday hisoblanishi va nega yozuvdan oldin tekshirilishini ko'rsatadi · 3) takror va rad xabarini biladi · 4) `maydon-jamoa` Backend'ida mashq to'lovni yurgizadi · 5) m11-03 ni o'tadi |
| O'quvchi darsi | **m11-03** «Webhook: to'lov Backend'ga qanday yetib keladi» (20 ekran). |
| Kursdagi o'rni | WebSocket-2 → **shu** (M31: raqamsiz) |
| Til | M9. Atamalar: to'lov xabari (webhook), imzo (signature, HMAC), maxfiy kalit, xom tana (raw body), takror xabar, rad etilgan to'lov, test rejim. |
| Misol-ip | **O'quvchi darsidagi aynan:** Maydon Jamoa — «Pro, 30 kun · 10 000 so'm», «Mashq to'lov» sahifasi va to'rt tugma; repo `maydon-jamoa` `m13-dars-03-done`. |
| Haqiqiylik (M10) | 01.11.2026: Backend `maydon-jamoa` (m13-dars-03-done) + lokal PostgreSQL; mashq sahifasi brauzerda bosildi (headless Chrome); soxta xabarlar — curl + HMAC. Render, Neon — sinalmagan, «⚠». |
| Hajm | **20 ekran** · 4 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · jami ≈ 1 soat |
| Me'yor | ≤ 5 segment, ≤ 60 so'z, ko'prik, «Xulosa», kalit 8–14 so'z |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **to'lov xabari (webhook)** — to'lov xizmati natijani Backend manziliga o'zi yuboradi: `POST /tolov/webhook`, tana `{ tolovRaqami, holat, summa, oyinchiId }`.
- **imzo** — `X-Imzo` = HMAC SHA-256 (xom tana, `TOLOV_KALITI`), 64 hex. Backend xuddi shunday hisoblab solishtiradi; mos kelmasa — 401, hech narsa yozilmaydi.
- **xom tana** — imzo baytlardan hisoblanadi; JSON qayta yozilsa (bo'sh joy) imzo mos kelmaydi → NestJS `rawBody: true`.
- **takror xabar** — javob yo'qolsa xizmat qayta yuboradi; `tolov_raqami` noyob → `200 { takror: true }`, ikkinchi qator yo'q.
- **rad etilgan to'lov** — xabar keladi va `holat: rad` bilan yoziladi; hech narsa ochilmaydi.

**Darsning ipi:** ilova «to'landi» desa — dalil emas → xizmat xabari → imzo (soxta 401, xom tana, `rawBody`) → tartib: imzo, maydonlar, takror, yozuv → takror va rad → kalit → m11-03 ga ko'prik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Kim kimga yuboradi | Lesson | 1 · xabar |
| 3 | Mashq to'lov: to'rt tugma | Lesson | 1 |
| 4 | Tekshiruv 1 — ilovaga ishonamizmi | MCRetry | 1 |
| 5 | Imzo: tana + kalit | Lesson | 2 · imzo |
| 6 | Soxta xabarlar — 401 | Lesson | 2 |
| 7 | Xom tana va `rawBody` | Lesson | 2 |
| 8 | Tekshiruv 2 — qaysi satr | LineCheck | 2 |
| 9 | Amaliyot 1 — To'lash va Rad etish | Practice | 2 |
| 10 | Takror xabar | Lesson | 3 · takror |
| 11 | Rad etilgan to'lov | Lesson | 3 |
| 12 | Tekshiruv 3 — ikkinchi javob | MCRetry | 3 |
| 13 | Amaliyot 2 — Ikki marta va Imzosiz | Practice | 3 |
| 14 | Kalit: faqat `.env` va Render'da | Lesson | 3 |
| 15 | Amaliyot 3 — `rawBody` ni buzamiz | Practice | 3 |
| 16 | Tekshiruv 4 — kalit bo'sh bo'lsa | MCRetry | 3 |
| 17 | m11-03 xaritasi | Lesson | 4 · ko'prik |
| 18 | O'quvchi darsidagi so'zlar va sinfdagi holatlar | Lesson | 4 |
| 19 | O'z-sinov — 8 savol | Screen27 | — |
| 20 | Yakun | Screen28 | — |

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · Webhook` · Sarlavha: **To'lov o'tdi. Backend buni kimdan biladi?**
- Sahna: reja (4 bosqich); mashq sahifasining natija satrlari (`wh-amal-out/02–03`).
- Reja: 01 To'lov xabari · 02 Imzo · 03 Takror, rad va kalit · 04 O'quvchi darsini o'tish
1. **To'lov o'tganini Backend ilovadan emas, to'lov xizmatidan biladi — bugun shu yo'l**
   Ovoz: «Assalomu alaykum. Ulanish darslaridan keyin endi pul. Tashkilotchi Pro uchun to'ladi. Backend buni kimdan biladi? Ilovadan emas, to'lov xizmatining o'zidan. Bugun shu yo'l.»
2. **Avval xabar va imzo: kim yuboradi va soxtasi qanday to'xtatiladi**
   Ovoz: «Avval to'lov xabari: kim kimga yuboradi. Keyin imzo: manzil ochiq bo'lsa, soxta xabar qanday to'xtatiladi.» · reja 01–02
3. **Keyin takror, rad va kalit — hammasi o'quvchi loyihasida, haqiqiy yurgizilgan**
   Ovoz: «Keyin takror xabar, rad etilgan to'lov va maxfiy kalit. Hammasini o'quvchilar loyihasida haqiqiy yurgizdik. Pul yechilmaydi, bu mashq.» · reja 03
4. **To'rt bosqich, uch amaliyot. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars to'rt bosqichdan iborat, uchta amaliyot bor. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 04
- Manba: `wh-amal-out/02–03`.

---

## 2 · Kim kimga yuboradi  ← `Lesson`
- Kicker: `1-bosqich · xabar` · Sarlavha: **Ilova sahifani ochadi, xizmat Backend'ga yozadi: `POST /tolov/webhook`**
- Sahna: README «Reja: to'lov oqimi» (aynan, 4 qator: kim · nima qiladi · kimga) + tana `{ tolovRaqami, holat, summa, oyinchiId }`.
1. **To'lov oqimida to'rt ishtirokchi: ilova, tashkilotchi, xizmat, Backend**
   Ovoz: «Avval kim kimga nima yuborishini ko'raylik. O'quvchi README'sidagi rejada to'rt qator: ilova, tashkilotchi, to'lov xizmati va Backend.»
2. **Ilova faqat sahifani ochadi; karta ma'lumoti faqat xizmatda**
   Ovoz: «Ilova faqat to'lov sahifasini ochadi. Tashkilotchi o'sha sahifada to'laydi yoki rad etadi. Karta ma'lumoti faqat xizmatda, Backend uni ko'rmaydi.»
3. **Natijani xizmat Backend'ga o'zi yuboradi — bu to'lov xabari, texnik nomi webhook**
   Ovoz: «Natijani esa xizmat Backend manziliga o'zi yuboradi. Bu to'lov xabari, texnik nomi webhook. Telegram ham yangi xabarni bot manziliga xuddi shunday yuboradi.»
4. **Xulosa: «to'landi» degan gap — faqat xizmatdan; ilovaning gapi dalil emas**
   Ovoz: «Xulosa: to'landi degan gapni Backend faqat xizmatdan qabul qiladi. Ilovaning gapi dalil emas, uni har kim yuborishi mumkin.»
- Manba: repo README «To'lov» → «Reja: to'lov oqimi» (m13-dars-03-done); o'quvchi darsi s2.

## 3 · Mashq to'lov: to'rt tugma  ← `Lesson`
- Kicker: `1-bosqich · xabar` · Sarlavha: **«Mashq to'lov» — xizmat o'rnida, Backend'ning o'zida; karta so'ralmaydi**
- Sahna: sahifa (aynan, `wh-out/01`): «Mashq to'lov» · «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · «Maydon Jamoa — Pro, 30 kun · 10 000 so'm» · to'rt tugma; brauzer natijasi (`wh-amal-out/02`) va `tolovlar` jadvali.
1. **Haqiqiy to'lov xizmati yo'q — uning o'rnida mashq sahifasi, Backend'ning o'zida**
   Ovoz: «Yo'lni ko'rdik, endi uni sinaydigan joy. Kursda haqiqiy to'lov xizmati yo'q, pul yechilmaydi. Uning o'rnida mashq sahifasi turibdi, uni Backend'ning o'zi beradi.»
2. **To'rt tugma: to'lash, rad etish, ikki marta va imzosiz yuborish**
   Ovoz: «To'rt tugma: to'lash, rad etish, ikki marta yuborish va imzosiz yuborish. Har biri bitta haqiqiy holatni chaqiradi.»
3. **Tugma bosilsa Backend xabarni imzolab, o'z `POST /tolov/webhook` iga yuboradi**
   Ovoz: «Tugma bosilganda Backend xabarni yasaydi, maxfiy kalit bilan imzolaydi va o'zining webhook manziliga haqiqiy so'rov qiladi. Kalit brauzerga chiqmaydi.»
4. **Xulosa: «To'lash» → `200 {"ok":true}`, jadvalda bitta qator**
   Ovoz: «Xulosa: to'lash bosildi, javob ikki yuz, ok true. Jadvalda bitta qator paydo bo'ldi. Endi shu yo'lni qadam-baqadam ochamiz.»
- Manba: `wh-out/01`, `wh-amal-out/02`; repo `backend/src/tolov/mashq.controller.ts`.

## 4 · Tekshiruv 1 — ilovaga ishonamizmi  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Ilova Backend'ga «to'landi» deb yozdi. Pro'ni ochamizmi?**
- Ovoz: «Xabar yo'lini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Ilova Backend'ga to'landi deb yozdi. Pro'ni ochamizmi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Ha — ilova bilgan · 2 Ha, agar summa to'g'ri bo'lsa · 3 Yo'q — faqat imzoli xizmat xabari dalil · 4 Ha, token bilan kelgan bo'lsa
- To'g'ri (ovoz, `ok`): «To'g'ri. Ilovaning gapini har kim yasashi mumkin. Dalil faqat xizmatning imzoli xabari. Token esa faqat kim yozayotganini aytadi, to'laganini emas. Demak, to'lov faqat xizmatning imzoli xabari kelganda tasdiqlanadi.» · qisqa: «Yo'q — dalil faqat imzoli xizmat xabari.»
- Xato izohlari: 1 — «Ilova so'rovini har kim yasaydi.» · 2 — «Summani ham yozish mumkin.» · 4 — «Token — kim, to'lov emas.»
- Maslahat: «To'lov o'tganini kim aniq biladi?»
- Manba: o'quvchi darsi s3.

---

## 5 · Imzo: tana + kalit  ← `Lesson`
- Kicker: `2-bosqich · imzo` · Sarlavha: **`X-Imzo` = HMAC SHA-256 (xom tana, `TOLOV_KALITI`) — 64 belgi**
- Sahna: VS Code — `backend/src/tolov/imzo.ts` (aynan, 16 satr).
1. **Manzil internetda ochiq — begona odam ham «to'landi» deb yuborishi mumkin**
   Ovoz: «To'lov xabarini kim yuborganini Backend qanday biladi? Webhook manzili internetda ochiq, begona odam ham unga to'landi deb yozishi mumkin. Shuning uchun imzo kerak.»
2. **Imzo — tana va maxfiy kalitdan HMAC: kalitni faqat xizmat va Backend biladi**
   Ovoz: «Imzo xabar matni va maxfiy kalitdan hisoblanadi, HMAC SHA-256. Kalitni faqat ikki tomon biladi: xizmat va Backend. Natija oltmish to'rt belgi.»
3. **Backend xuddi shunday hisoblaydi va solishtiradi: avval shakl, keyin `timingSafeEqual`**
   Ovoz: «Backend xuddi shu hisobni o'zi qiladi va sarlavhadagi imzo bilan solishtiradi. Avval shaklini tekshiradi, keyin timing safe equal bilan solishtiradi.»
4. **Xulosa: kalitsiz to'g'ri imzo yasab bo'lmaydi; kalit bo'sh bo'lsa — hech bir xabar o'tmaydi**
   Ovoz: «Xulosa: kalitni bilmasdan to'g'ri imzo yasab bo'lmaydi. Kalit bo'sh bo'lsa, hech bir xabar qabul qilinmaydi. Bu ataylab shunday yozilgan.»
- Manba: repo `backend/src/tolov/imzo.ts`; o'quvchi darsi s4, A1 izohi (`timingSafeEqual` uzunlik).

## 6 · Soxta xabarlar — 401  ← `Lesson`
- Kicker: `2-bosqich · imzo` · Sarlavha: **Imzosiz, `abc`, boshqa kalit, summasi o'zgargan — hammasi 401, jadvalda 0**
- Sahna: terminal (haqiqiy, `wh-out/07`).
1. **Imzosiz va `X-Imzo: abc` — 401 «Imzo mos emas»**
   Ovoz: «Imzoni ko'rdik, endi uni buzib sinaymiz. Imzosiz xabar: to'rt yuz bir, imzo mos emas. Abc degan imzo bilan ham to'rt yuz bir, shakli noto'g'ri.»
2. **Boshqa kalit bilan imzolangan — 401: kalitni bilmasa, imzo mos kelmaydi**
   Ovoz: «Boshqa kalit bilan to'g'ri shakldagi imzo: yana to'rt yuz bir. Kalitni bilmagan odam mos imzo yasay olmaydi.»
3. **To'g'ri imzo, lekin summa 10 000 dan 1 ga o'zgartirilgan — 401**
   Ovoz: «Eng qiziq holat: imzo to'g'ri kalit bilan, lekin keyin summa o'n mingdan birga o'zgartirildi. Yana to'rt yuz bir: imzo butun matndan hisoblangan.»
4. **Xulosa: to'rtala soxta xabar 401; jadvalda bitta ham yozuv yo'q**
   Ovoz: «Xulosa: to'rtala soxta xabar to'rt yuz bir oldi va jadvalga bitta ham qator yozilmadi. Imzo tekshiruvi eng birinchi turgani uchun.»
- Manba: `wh-out/07-soxta-imzo.txt`.

## 7 · Xom tana va `rawBody`  ← `Lesson`
- Kicker: `2-bosqich · imzo` · Sarlavha: **Ma'nosi bir xil, bo'sh joyi boshqa JSON — 401; `rawBody` yo'q bo'lsa haqiqiy to'lov ham 401**
- Sahna: terminal (`wh-out/08`, `12`) + `backend/src/main.ts` (8–9-satr, aynan); xulosa qadamida — qaytarilgan `rawBody` bilan `200 {"ok":true}` (`wh-amal-out/05`, M3).
1. **Imzo matndan hisoblanadi: bo'sh joyli JSON — boshqa matn, 401**
   Ovoz: «Soxta xabarlar to'xtadi. Endi nozik joy: imzo matnning har bir belgisidan hisoblanadi. Ma'nosi bir xil, lekin bo'sh joylari boshqa JSON, to'rt yuz bir oldi.»
2. **Shuning uchun Backend so'rovning xom tanasidan hisoblaydi — `rawBody: true`**
   Ovoz: «Shuning uchun Backend imzoni so'rovning xom tanasidan, kelgan baytlardan hisoblaydi. NestJS'da buning uchun main ts da raw body true yoziladi.»
3. **`rawBody` olib tashlandi — haqiqiy «To'lash» ham 401**
   Ovoz: «Sinab ko'rdik: raw body olib tashlandi. Natija: mashq sahifasidagi haqiqiy to'lash ham to'rt yuz bir oldi. Backend xom tanani ko'rmaydi, imzo hech qachon mos kelmaydi.»
4. **Xulosa: o'quvchi «hamma xabar 401» desa — avval kalit, keyin `rawBody`**
   Ovoz: «Xulosa: o'quvchi hamma xabar to'rt yuz bir desa, avval env'dagi kalitni, keyin main ts dagi raw body'ni tekshiring.»
- Manba: `wh-out/08-xom-tana.txt`, `12-rawbody-yoq.txt`; repo `backend/src/main.ts`; o'quvchi darsi A1 o'qituvchi izohi («xom tana»).

## 8 · Tekshiruv 2 — qaysi satr  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Imzosiz xabar 401 oldi — lekin jadvalda yangi qator paydo bo'ldi**
- Shart (`task`): «Qoida: tartib — **avval imzo**, keyin maydonlar, takror va yozuv. Bu kodda imzosiz xabar `401` oldi, lekin `tolovlar` da yangi `tolandi` qatori bor. **O'rni noto'g'ri turgan satrni bosing.**»
- Ovoz (`q`): «Tartib qanchalik muhimligini endi o'zingiz topasiz. Ikkinchi tekshiruv. Imzosiz xabar to'rt yuz bir oldi, lekin jadvalda yangi qator paydo bo'ldi. O'rni noto'g'ri turgan satrni bosing.»
- Fayl: `backend/src/tolov/tolov.controller.ts` (`wh-out/13` — tartib buzilgan, qisqartirilgan; haqiqiy fayl 34–60):
  ```ts
  1  async webhook(sorov, imzo) {
  2    const tana = (sorov.body ?? {}) as Record<string, unknown>;
  3    // … maydonlar tekshiruvi (400)
  4    if (await this.tolovlar.existsBy({ tolov_raqami: tolovRaqami })) return { takror: true };
  5    await this.tolovlar.insert({ tolov_raqami: tolovRaqami, oyinchi_id: oyinchiId, summa, holat });
  6    if (!imzoTogrimi(sorov.rawBody, imzo)) throw new UnauthorizedException("Imzo mos emas");   ← yozuvdan keyin
  7    return { ok: true };
  8  }
  ```
- Tuzatilgan (`fixed`): 6-satr birinchi o'ringa ko'chdi (2-satr sifatida, yashil), eski joyi chizilgan; `fixedExtra`: to'g'ri tartibda — «Imzosiz» 401 va jadvalda yozuv yo'q (`wh-amal-out/03`: 3 qator).
- To'g'ri (ovoz, `ok`): «To'g'ri. Oltinchi satr: imzo tekshiruvi yozuvdan keyin turibdi. Xabar avval jadvalga yozildi, keyin rad etildi. Imzo birinchi tursa, soxta xabar hech narsaga tegmaydi. Demak, imzo tekshiruvi jadvalga yozishdan oldin turishi shart.»
- Qisqa (`okShort`): «6-satr: imzo yozuvdan keyin — 401 qaytdi, lekin qator yozilib bo'ldi.»
- Maslahat (`hint`): «Javob 401 bo'lishidan oldin qaysi satr jadvalga yozib ulgurdi?»
- Manba: `wh-out/13-tartib-buzilgan.txt`; repo `tolov.controller.ts` izohi («Tartib: 1) imzo …»).

## 9 · Amaliyot 1 — To'lash va Rad etish  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **`m13-dars-03-done`: kalit, start, mashq sahifasi — To'lash va Rad etish** · `tableAt: 3`
1. **Endi siz: o'quvchi loyihasining to'lov yo'lini o'z kompyuteringizda yurgizasiz**
   Ovoz: «Imzo va tartibni ko'rdingiz, endi navbat sizga. O'quvchi loyihasining to'lov yo'lini o'z kompyuteringizda yurgizasiz. O'n besh daqiqa.»
2. **1–2-qadam: `m13-dars-03-done`, `npm ci`, `.env` da `TOLOV_KALITI`, start**
   Ovoz: «Birinchi: m13 dars uch done tegi va npm ci. Ikkinchi: env fayliga tasodifiy kalit yozing, buyrug'i tayyor. Kalitni hech kimga ko'rsatmang. Keyin npm run start.»
3. **3–4-qadam: ro'yxat (login), mashq sahifasi — To'lash va Rad etish; isbot — sahifadagi satr**
   Ovoz: «Uchinchi: ro'yxatdan o'ting, bu tegda login bilan. To'rtinchi: brauzerda mashq sahifasi, to'lash va rad etish. Isbot maydoniga rad etish satrini nusxalang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi loyihasining to'lov yo'li sizning kompyuteringizda ishlaydi va siz to'lash va rad etish javoblarini o'zingiz ko'rgan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Repo | `maydon-jamoa` papkasida: `git checkout -f m13-dars-03-done` · `cd backend` · `npm ci` | `added … packages` |
  | 2 | Kalit va start | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` → `.env`: `TOLOV_KALITI=<64 belgi>` · `npm run start` | `Nest application successfully started` |
  | 3 | Ro'yxat | `curl -X POST localhost:3000/royxat -H "Content-Type: application/json" -d '{"ism":"Ali","login":"ali","parol":"parol123"}'` | `{"id":11,"ism":"Ali"}` |
  | 4 | Mashq sahifasi | brauzerda `localhost:3000/tolov-mashq?oyinchi=11&summa=10000` → «To'lash (mashq)», «Rad etish (mashq)» | `… — 200 {"ok":true}` ikki satr |
- Isbot: «Rad etish satri» · placeholder: «sahifadagi satrni nusxalang» · KOD: `/Rad etish.*200/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `Ism, login va parolni yozing` | bu tegda ro'yxat `login` bilan — telefon emas |
  | `409` «Bu login band» | ro'yxat bor — `id` avvalgi javobda; esdan chiqqan bo'lsa boshqa login bilan ro'yxatdan o'ting |
  | sahifada `401 … Imzo mos emas` | `.env` da `TOLOV_KALITI` bo'sh yoki Backend kalitsiz yoqilgan — kalitni yozib, qayta start (16-ekran) |
  | `400 … oyinchiId — mavjud hisob` | manzildagi `oyinchi=` — ro'yxatdagi `id` emas |
- Manba: `wh-amal-out/01–02`; `wh-out/09`, `11`.

---

## 10 · Takror xabar  ← `Lesson`
- Kicker: `3-bosqich · takror` · Sarlavha: **Bir xil xabar ikki marta: `ok`, keyin `takror` — jadvalda bitta qator**
- Sahna: sahifa (`wh-amal-out/03`) + terminal (`wh-out/10`, bir vaqtda) + `tolov.controller.ts` 51–58.
1. **Javob yo'qolsa xizmat o'sha xabarni qayta yuboradi — Backend uni ikkinchi marta yozmasin**
   Ovoz: «Imzo o'tdi, endi boshqa xavf. Javob yo'qolsa, xizmat o'sha xabarni qayta yuboradi. Backend uni ikkinchi marta yozmasligi kerak, aks holda Pro ikki marta uzayadi.»
2. **«Ikki marta yuborish»: birinchisi `ok`, ikkinchisi `takror` — ikkalasi 200**
   Ovoz: «Ikki marta yuborish tugmasi: birinchi javob ok, ikkinchisi takror. Ikkalasi ham ikki yuz, xizmat qayta yubormasin. Jadvalda bitta qator.»
3. **Bir vaqtda ikki xabar — tekshiruvdan ikkalasi o'tadi, noyoblik ikkinchisini to'xtatadi**
   Ovoz: «Ikki xabar aynan bir vaqtda kelsa, ikkalasi tekshiruvdan o'tib ketadi, PostgreSQL logida buni ko'rdik. Lekin to'lov raqami noyob: ikkinchisini baza to'xtatadi va kod uni ham takror deb qaytaradi.»
4. **Xulosa: takrorning ikki himoyasi — oldindan tekshiruv va jadvaldagi noyob raqam**
   Ovoz: «Xulosa: takrordan ikki himoya bor. Avval to'lov raqami tekshiriladi, oxirgi himoya esa bazadagi noyob ustun.»
- Manba: `wh-out/03`, `10-bir-vaqtda.txt`, `10b-pg-log.txt` (PostgreSQL: `duplicate key … (tolov_raqami)=(m-bir-vaqtda) already exists` — ikkinchisi tekshiruvdan o'tib ketgani isboti); `wh-amal-out/03`; repo `tolov.controller.ts` 51–58, `tolov.entity.ts` (`unique: true`).

## 11 · Rad etilgan to'lov  ← `Lesson`
- Kicker: `3-bosqich · takror` · Sarlavha: **To'lov o'tmasa ham xabar keladi: `holat: rad` yoziladi, hech narsa ochilmaydi**
- Sahna: `tolovlar` jadvali (`wh-amal-out/02`: tolandi · rad) + README «Hozir ishlaydi» qatori.
1. **To'lov o'tmasa ham xizmat xabar yuboradi — holat `rad`**
   Ovoz: «Takrorni ko'rdik, endi to'lov o'tmagan holat. Xizmat bunda ham xabar yuboradi, faqat holat rad. Backend uni ham qabul qiladi.»
2. **Rad ham yoziladi — tashkilotchi «to'lovim qayerda?» desa, javob jadvalda**
   Ovoz: «Rad ham jadvalga yoziladi. Tashkilotchi to'lovim qayerda desa, javob shu yerda: urinish bo'lgan, lekin o'tmagan.»
3. **Pro hali ochilmaydi — README: «Pro va ilova hali o'zgarmaydi»**
   Ovoz: «Ehtiyot bo'ling: o'quvchi darsidagi sxemada Backend Pro muddatini uzaytiradi deb yozilgan. Bu reja. Repo'da hozir faqat yozuv bor, Pro hali o'zgarmaydi.»
4. **Xulosa: rad — yoziladigan natija; bugungi qurilgan qism — qabul va yozuv**
   Ovoz: «Xulosa: rad ham yoziladigan natija. Bugun qurilgan qism: xabarni qabul qilish va yozish. Pro'ni ochish keyingi ish.»
- Manba: `wh-amal-out/02`; repo README «To'lov» («Hozir ishlaydi: … Pro va ilova hali o'zgarmaydi»); o'quvchi darsi s9, s12.

## 12 · Tekshiruv 3 — ikkinchi javob  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **Xizmat bir xil xabarni ikkinchi marta yubordi. Backend nima qaytaradi?**
- Ovoz: «Takrorni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. Xizmat bir xil xabarni ikkinchi marta yubordi. Backend nima qaytaradi? Variantni tanlang.»
- Variantlar (to'g'risi — 4): 1 `409` — bu to'lov bor · 2 `500` — noyoblik xatosi · 3 `200` va ikkinchi qator · 4 `200 { takror: true }` — yozuvsiz
- To'g'ri (ovoz, `ok`): «To'g'ri. Backend ikki yuz va takror true qaytaradi, jadvalga hech narsa yozilmaydi. Agar xato kodi qaytsa, xizmat xabarni yana va yana yuboraveradi. Demak, takror xabarga ham muvaffaqiyat javobi qaytariladi, faqat yozuv takrorlanmaydi.» · qisqa: «`200 { takror: true }` — xizmat qayta yubormasin.»
- Xato izohlari: 1 — «Xizmat yana yuboradi.» · 2 — «Kod uni takror qiladi (10-ekran).» · 3 — «Raqam noyob.»
- Maslahat: «Javob 200 bo'lmasa xizmat nima qiladi?»
- Manba: `wh-out/03`, `10`; o'quvchi darsi s6–s7.

## 13 · Amaliyot 2 — Ikki marta va Imzosiz  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 5 daqiqa` · Sarlavha: **Mashq sahifasida «Ikki marta yuborish» va «Imzosiz yuborish»** · `tableAt: 2`
1. **Endi siz: takror va imzosiz xabarni o'z sahifangizda ko'rasiz**
   Ovoz: «Takror va soxta xabarni ko'rdingiz, endi o'zingiz bosasiz. Besh daqiqa. O'sha mashq sahifasi ochiq.»
2. **1–2-qadam: «Ikki marta yuborish», «Imzosiz yuborish»; isbot — ikkinchi javob**
   Ovoz: «Birinchi: ikki marta yuborish, ikkinchi satrga qarang. Ikkinchi: imzosiz yuborish, to'rt yuz bir. Isbot maydoniga ikki marta yuborishning ikkinchi satrini qo'ying.»
3. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Ikkala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror xabar va imzosiz xabarga Backend qanday javob berishini o'z sahifangizda ko'rgan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Ikki marta | «Ikki marta yuborish» | `… — 200 {"ok":true}` va `… — 200 {"takror":true}` (bir xil `m-` raqam) |
  | 2 | Imzosiz | «Imzosiz yuborish» | `… — 401 {"message":"Imzo mos emas",…}` |
- Isbot: «Ikki marta yuborishning ikkinchi satri» · placeholder: «sahifadagi satrni nusxalang» · KOD: `/takror/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Ikkinchisi ham `ok` | ikki xil `m-` raqam bilan bosilgan — «Ikki marta yuborish» tugmasini bosing, «To'lash» ni ikki marta emas |
  | Imzosiz `200` | Backend eski kod bilan — `git log --oneline -1` da `6a1ed16` bo'lsin |
- Manba: `wh-amal-out/03`.

## 14 · Kalit: faqat `.env` va Render'da  ← `Lesson`
- Kicker: `3-bosqich · kalit` · Sarlavha: **`TOLOV_KALITI` — `.env` va Render'da; agentga, chatga, README'ga yozilmaydi**
- Sahna: `backend/.env.example` (to'lov qismi, aynan) + `wh-out/11` (kalit bo'sh → To'lash ham 401) va yonida kalit bilan `200 {"ok":true}` (`wh-amal-out/02`, M3) + o'quvchi A1 qadami (`git status`, `git ls-files backend/.env`).
1. **Kalit kimda bo'lsa, o'sha «to'landi» xabarini yasay oladi**
   Ovoz: «Imzo kalitga tayanadi. Demak kalit kimda bo'lsa, o'sha to'landi xabarini yasay oladi. Shuning uchun u faqat env faylida va Render sozlamasida turadi.»
2. **O'quvchi darsi: kalit agentga, chatga, README'ga va skrinshotga yozilmaydi**
   Ovoz: «O'quvchi darsi qat'iy: kalit agentga, chatga, README'ga va skrinshotga yozilmaydi. Agent faqat uning nomini biladi.»
3. **`.env` bo'sh qolsa — har xabar 401: «To'lash» ham o'tmaydi**
   Ovoz: «Sinfdagi tez-tez holat: env'da kalit bo'sh. Natija: mashq sahifasidagi to'lash ham to'rt yuz bir. Kod buni ataylab qiladi.»
4. **Xulosa: `git ls-files backend/.env` bo'sh bo'lsin; kalit chiqib qolsa — yangisi**
   Ovoz: «Xulosa: git ls files bilan env Git'da yo'qligini tekshiring. Kalit qayerdadir ko'rinib qolsa, yangisi qo'yiladi, eskisi ishlatilmaydi.»
- Manba: repo `backend/.env.example`; `wh-out/11-kalitsiz.txt`; o'quvchi darsi A1 qadamlari va o'qituvchi izohi.

## 15 · Amaliyot 3 — `rawBody` ni buzamiz  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **`main.ts` dan `rawBody` ni olib tashlang — keyin qaytaring** · `tableAt: 3`
1. **Endi siz: xom tana o'qilmasa nima bo'lishini o'zingiz buzib ko'rasiz**
   Ovoz: «Oxirgi amaliyot: xom tanani o'zingiz buzasiz. O'n daqiqa. Sinfda hamma xabar to'rt yuz bir desa, sababni tez topasiz.»
2. **1–2-qadam: `main.ts` da `{ rawBody: true }` ni o'chiring, qayta start, «To'lash»**
   Ovoz: «Birinchi: main ts da raw body true qismini o'chiring va Backend'ni qayta yoqing. Ikkinchi: mashq sahifasida to'lash.»
3. **3–4-qadam: 401 ni ko'ring, qaytaring — yana 200; isbot — buzilgan javob**
   Ovoz: «Uchinchi: to'rt yuz bir chiqdi, imzo mos emas. To'rtinchi: raw body'ni qaytaring, qayta start, to'lash, ikki yuz. Isbot maydoniga to'rt yuz birli satrni qo'ying.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz raw body bo'lmasa haqiqiy to'lov ham to'rt yuz bir olishini o'zingiz buzib ko'rgan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Buzish | `src/main.ts`: `NestFactory.create(AppModule, { rawBody: true })` → `NestFactory.create(AppModule)` · Ctrl+C · `npm run start` | `Nest application successfully started` |
  | 2 | To'lash | sahifada «To'lash (mashq)» | `… — 401 {"message":"Imzo mos emas",…}` |
  | 3 | Qaytarish | `{ rawBody: true }` ni qaytaring · Ctrl+C · `npm run start` | start ✓ |
  | 4 | Tekshirish | «To'lash (mashq)» | `… — 200 {"ok":true}` |
- Isbot: «2-qadamdagi satr» · placeholder: «sahifadagi satrni nusxalang» · KOD: `/401/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 2-qadamda ham `200` | Backend qayta yoqilmagan — `npm run start` eski kodni ishlatyapti; Ctrl+C va qayta start |
  | 4-qadamda ham `401` | `rawBody: true` to'liq qaytmagan — `git diff src/main.ts` bo'sh bo'lsin |
- Manba: `wh-amal-out/04–05`.

## 16 · Tekshiruv 4 — kalit bo'sh bo'lsa  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **O'quvchi `.env` ga `TOLOV_KALITI` ni yozmagan. Mashq sahifasida «To'lash» nima beradi?**
- Ovoz: «Kalitni ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. O'quvchi env fayliga kalitni yozmagan. Mashq sahifasida to'lash nima beradi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 `200` — kalitsiz ham ishlaydi · 2 `401` — kalit bo'sh bo'lsa hech bir xabar qabul qilinmaydi · 3 `500` — Backend yiqiladi · 4 Backend ishga tushmaydi
- To'g'ri (ovoz, `ok`): «To'g'ri, to'rt yuz bir. Kod kalit bo'sh bo'lsa hech bir xabarni qabul qilmaydi. Backend esa ishlab turadi, shuning uchun sabab darrov ko'rinmaydi. Demak, hamma xabar to'rt yuz bir olsa, avval env faylidagi kalitni tekshiring.» · qisqa: «`401` — kalit bo'sh: hech bir xabar o'tmaydi.»
- Xato izohlari: 1 — «Bo'sh kalit — hech narsa o'tmaydi (14-ekran).» · 3 — «Yiqilmaydi, 401.» · 4 — «Ishga tushadi; JWT_SECRET bo'lmasa boshqa gap.»
- Maslahat: «imzo.ts da kalit bo'sh bo'lsa nima qaytadi?»
- Manba: `wh-out/11`; repo `imzo.ts` 12–13.

---

## 17 · m11-03 xaritasi  ← `Lesson`
- Kicker: `4-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m11-03 · «Webhook: to'lov Backend'ga qanday yetib keladi»` · Sarlavha: **m11-03: xabar, imzo, takror, rad va sxema**
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 · s1 reja | ilovaning gapi dalil emas (4-ekran) |
  | 2 Xabar va imzo | s2 to'lov xabari · s3 test · s4 imzo · s5 test | soxta 401, xom tana (6–7-ekran) |
  | 3 Takror | s6 javob yo'qoldi · s7 kod oynasi · s8 test | bir vaqtda ikki xabar (10-ekran) |
  | 4 Rad va test rejim | s9 rad · s10 test · s11 test rejim | Pro hali yo'q (11-ekran) |
  | 5 Sxema va amaliyot | s12–s13 sxema · s14 sinov · A1 o'z Backend'i · A2 mashq sahifa | kalit, `rawBody`, Render (14–15-ekran) |
1. **m11-03 — 20 ekran: xabar, imzo, takror, rad va to'lov oqimi sxemasi**
   Ovoz: «Hammasini o'zingiz yurgizdingiz, endi o'quvchi darsi: m11-03, yigirma ekran. Xabar, imzo, takror, rad, test rejim va to'lov oqimi sxemasi.»
2. **Og'ir qism — 8-ekran kod oynasi va ikki blok; har blokda Render kutiladi**
   Ovoz: «O'quvchi darsi o'zi ogohlantiradi: og'ir qism sakkizinchi ekrandagi kod oynasi va ikki blok, har birida Render'da yangi versiya kutiladi. Uchinchi va o'n ikkinchi ekranlarga ortiqcha vaqt bermang.»
3. **Pul chegarasi: hech kim haqiqiy xizmatga ulanmaydi, karta yozilmaydi**
   Ovoz: «Pul chegarasi qat'iy: darsda hech kim haqiqiy to'lov xizmatiga ro'yxatdan o'tmaydi, karta yozmaydi. O'quvchi Payme ulasam bo'ladimi desa, o'n birinchi ekrandagi javobni o'qing.»
4. **Xulosa: A1 da kalit gigiyenasi, A2 da uch tekshiruv — Render'da `RENDER_EXTERNAL_URL`**
   Ovoz: «Xulosa: birinchi blokda kalit gigiyenasini kuzating, ikkinchisida uch tekshiruvni. Render'da mashq sahifasi o'z manzilini o'zi topadi, biz buni sinamadik.»
- Manba: `src/11-Modull/PaymentWebhookLesson.jsx` — `SCREEN_META` (20), s1 o'qituvchi eslatmalari («Pul chegarasi»), A1/A2; repo `mashq.controller.ts` (`RENDER_EXTERNAL_URL`).

## 18 · O'quvchi darsidagi so'zlar va sinfdagi holatlar  ← `Lesson`
- Kicker: `4-bosqich · sinfda` · Sarlavha: **Xabar, imzo, takror — va olti holat**
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | to'lov xabari | webhook, `POST /tolov/webhook` |
  | imzo · kalit | HMAC SHA-256 · `TOLOV_KALITI` |
  | takror xabar | `tolov_raqami` noyob · `{ takror: true }` |
  | test rejim · mashq to'lov | pul yechilmaydi; xizmat o'rnida Backend sahifasi |
  | # | Holat | Xabar | Sabab |
  |---|---|---|---|
  | 1 | Hamma xabar 401 | `Imzo mos emas` | kalit bo'sh |
  | 2 | Haqiqiy to'lash ham 401 | `Imzo mos emas` | `rawBody` yo'q |
  | 3 | 401, lekin jadvalda qator | — | imzo yozuvdan keyin |
  | 4 | Ro'yxat 400 | `Ism, login va parolni yozing` | `login` maydoni |
  | 5 | 400 `oyinchiId — mavjud hisob` | — | manzildagi `oyinchi=` noto'g'ri |
  | 6 | `.env` Git'da | `git ls-files` da fayl nomi | kalitlar almashtiriladi |
- O'quvchi so'rasa:
  - «Payme ulasam bo'ladimi?» → AI Startup kursida emas: real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan (o'quvchi darsi s1 eslatmasi).
  - «Nega takrorga ham 200?» → xato kodi qaytsa, xizmat qayta yuboraveradi.
  - «Nega rad yoziladi?» → «to'lovim qayerda?» savoliga javob.
  - «Kalitni agentga bersam tezroq bo'lardi-ku?» → kalit kimda bo'lsa, o'sha «to'landi» yasaydi.
1. **O'quvchi «to'lov xabari», «imzo», «takror» deydi — siz koddagi joyini bilasiz**
   Ovoz: «Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: to'lov xabari, imzo va kalit, takror xabar va test rejim. Siz har birining kodda qayerda turishini bilasiz.»
2. **Birinchi uchta holat — 401 bilan bog'liq: kalit, `rawBody`, tartib**
   Ovoz: «Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi uchtasi imzo bilan bog'liq. Hamma xabar to'rt yuz bir olsa, kalit bo'sh. Haqiqiy to'lash ham to'rt yuz bir olsa, raw body yoqilmagan. Javob to'rt yuz bir, lekin jadvalga qator yozilgan bo'lsa, tekshiruv tartibi buzilgan.» · 1–3-karta
3. **Qolgan uchtasi: ro'yxatda `login`, noto'g'ri `oyinchi`, `.env` Git'da**
   Ovoz: «To'rtinchi holat: ro'yxat to'rt yuz qaytaradi, chunki bu tegda login maydoni kerak. Beshinchi holat: manzildagi oyinchi qiymati noto'g'ri. Oltinchi holat: env fayli Git'ga tushib qolgan, bunda kalitlar darhol almashtiriladi.» · 4–6-karta
4. **Xulosa: 401 bo'lsa — kalit, `rawBody`, tartib; qolganida — xabar matnini o'qing**
   Ovoz: «Xulosa va usul: javob to'rt yuz bir bo'lsa, shu tartibda tekshiring: kalit, raw body, keyin tekshiruv tartibi. Qolgan holatlarda javob matnini o'quvchi bilan birga o'qing.» · QA
- Manba: `wh-out/07–13`, `wh-amal-out/`; o'quvchi darsi s1, A1.

## 19 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | To'lov o'tganini Backend kimdan biladi? | to'lov xizmati xabaridan · ilovadan · tashkilotchidan · README'dan | 1 | Ilovaning gapi dalil emas. | 2 |
  | 2 | Imzo nimadan hisoblanadi? | faqat summadan · xom tana va maxfiy kalitdan · tokendan · to'lov raqamidan | 2 | HMAC SHA-256. | 5 |
  | 3 | Summasi o'zgartirilgan xabar (imzo eski)? | 200 · 400 · 401 — imzo mos emas · 500 | 3 | Imzo butun matndan. | 6 |
  | 4 | `rawBody: true` yo'q bo'lsa? | hech narsa o'zgarmaydi · faqat soxtasi o'tadi · Backend yonmaydi · haqiqiy to'lov ham 401 | 4 | Xom tana yo'q. | 7 |
  | 5 | Imzo tekshiruvi qayerda turadi? | eng birinchi · yozuvdan keyin · takrordan keyin · oxirida | 1 | Aks holda soxta xabar yoziladi. | 8 |
  | 6 | Ikkinchi bir xil xabarga javob? | 409 · `200 { takror: true }` · 500 · 200 va yangi qator | 2 | Xizmat qayta yubormasin. | 10 |
  | 7 | Rad etilgan to'lov xabari? | e'tiborsiz qoldiriladi · 401 · yoziladi, hech narsa ochilmaydi · Pro ochiladi | 3 | «To'lovim qayerda?» | 11 |
  | 8 | `TOLOV_KALITI` qayerda turadi? | README'da · agent promptida · kodda · `.env` va Render'da | 4 | Kalit — dalil yasash huquqi. | 14 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 20 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz**
- Xulosa 6 band: (1) to'lov xabarini xizmat o'zi yuboradi; ilovaning gapi dalil emas · (2) imzo — xom tana + kalit (HMAC); soxta — 401, yozuvsiz · (3) `rawBody: true` — xom tana; yo'q bo'lsa hamma 401 · (4) tartib: imzo → maydonlar → takror → yozuv · (5) takror — `200 { takror: true }`, noyob raqam; rad ham yoziladi · (6) kalit faqat `.env`/Render'da; m11-03 — pul chegarasi, A1 kalit gigiyenasi, A2 uch tekshiruv.
- **Uyga vazifa** (M14): «O'z Backend'ingizda yoki maydon-jamoa nusxasida imzo tekshiruvini yozuvdan keyinga ko'chirib, «Imzosiz yuborish» bilan jadvalga yozilib qolishini ko'ring; keyin tartibni qaytarib, mashq sahifasida uch tekshiruvni (401 · ok va takror · rad) qiling. GitHub'ga chiqaring — kalitsiz — va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Buzish | imzo tekshiruvi `insert` dan keyin · «Imzosiz yuborish» | 401, lekin `tolovlar` da qator |
  | 2 | Qaytarish | imzo — birinchi | 401 va qator yo'q |
  | 3 | Uch tekshiruv | Imzosiz · Ikki marta · Rad | 401 · ok+takror · rad qatori |
  | 4 | Kalit | `git ls-files backend/.env` | bo'sh |
  | 5 | Topshirish | repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: imzo birinchi · takror 200 · rad yoziladi · kalit repo'da yo'q.
- Keyingi dars kartasi: yo'q — bu kurs ro'yxatidagi oxirgi mavzu (⚠ tasdiqlang); karta o'rnida «Kurs mavzulari tugadi — o'quvchi darslariga o'ting».

---

## «KOD» — qurishda
1. WebSocket yordamchilari (`ts()`, `tm()`, `Term`, Explorer) — bo'lakda nusxa; mashq sahifasi maketi (haqiqiy matnlar, ⚠ — brauzer oynasi maket); generator `dev/wh-matn.py`.
2. Chiqishlar `wh-out/`, `wh-amal-out/` dan aynan; kalit qiymati hech qayerda ko'rsatilmaydi.
3. LineCheck (8-ekran): 6-satr → `target={5}`; `fixed` da ko'chgan satr `n` bilan.
4. Isbotlar: 9 — `/Rad etish.*200/` · 13 — `/takror/` · 15 — `/401/`.

## Ochiq savollar ([GATE M])
1. Mentor amaliyoti lokal (Render'siz) — PRD Q1.
2. Bu kursning oxirgi mavzusimi — yakunda keyingi dars kartasi o'rniga nima turadi?

## O'quvchi darslari uchun alohida ish (qaror kerak; tegilmadi)
1. **m11-03** sxemasi (s12) — «Backend … Pro muddatini uzaytiradi»: o'quvchi darsining o'zi «Sxema — reja … Pro va ilova hali o'zgarmaydi» deydi — mos; mentor uchun aniq aytildi (11-ekran).
2. **maydon-jamoa** `m13-dars-03-done` da ro'yxat `login` bilan — 11-Moduldagi telefonli ro'yxatdan farq qiladi; o'quvchi eski curl'ni ishlatsa `400` — sinfda ehtimoliy holat.
