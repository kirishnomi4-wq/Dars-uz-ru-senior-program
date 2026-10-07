# 13-Modul · 3-dars «Webhook: to'lov Backend'ga qanday yetib keladi» — MD v3 (yangi dars, TEX — modulning texnik cho'qqisi)

Fayl: `src/11-Modull/PaymentWebhookLesson.jsx` (kalit `m11-03`, App.jsx `type: 'Kod'`) · **20 ekran** (15 dars ekrani + 2 amaliyot bloki + podium, kartochkalar, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. TEX, keyssiz (Qaror-0 21). Qolip: texnik dars (QKirish, QReja, QTushuncha, QTest, QKod, QMustaqil, QTartib) + 2 amaliyot bloki (QBlok). Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx `m11-03`, 447-qator): «Webhook: to'lov Backend'ga qanday yetib keladi» · osti «imzo, takror xabar va rad etilgan to'lov — test rejimda» ·
oldingi `m11-02` «Mahsulotingiz qanday pul topadi?» · keyingi `m11-04` «Narxni qanday belgilaysiz?».
Namuna (tuzilish, hajm): 12-Modul `02-WebSocketBasics-v3.md` + `02-FILTR.md` (TEX shakli, sahna, kod oynasi, ikki blok) · 12-Modul `05-BreakAndFix-v3.md` + `05-FILTR.md` («Tuzatish qilindi», agent — zaxira, kafolatsiz so'zlar) · 10-Modul `05-SecurityBasics-v3.md` + `05-FILTR.md` (maxfiy kalit, himoya chegarasi) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul C 19–31, 11-Modul D 32–39, 12-Modul E 40–55 — majburiy): kartochkalar alohida ekran · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (bitta tugma — halqa; variantlar — har birining o'z yengil chegarasi, E 40) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · taxmin natijasi va QIzoh — yashil xulosa qutisi ichida (E 42) · telefon maketi chapda, o'lchami barqaror (≈170×272) · ≤3 blok · bo'sh ustun yo'q · maketda hech narsa kesilmaydi (E 41) · ko'p elementli mashq ketma-ket · odamlar chizilmaydi (bu darsda odam kerak emas).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 3-ekran **C** · 5-ekran **A** · 8-ekran **D** · 10-ekran **B** · 14-ekran (final tartib, sentinel `0`) · arena A·B·C·D ×3.
Vaqt (reja, o'lchov emas): ≈ 90 daqiqa — 0–1 ≈ 5 · 2–6 ≈ 15 · 7 (kod oynasi) ≈ 8 · 8–12 ≈ 13 · 13–14 ≈ 6 · A1 ≈ 22 · A2 ≈ 16 · podium, kartochkalar, yakun ≈ 5 — jami ≈ 90.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (ikki blokda ikki marta Render kutishi bor); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 11-band.
⚠️ **Pul chegarasi (TAQIQLAR 1, Qaror-0 5, 6) — har ekranga tegadi:** real pul yo'q — faqat test rejim, «mashq to'lov» · karta ma'lumoti hech qayerda (karta raqami, amal qilish muddati, CVV, SMS kod — maketda, namunada, promptda, kalitda yozilmaydi va chizilmaydi; mashq sahifasida karta maydoni yo'q) ·
`TOLOV_KALITI` qiymati faqat `backend/.env` da va Render sozlamasida (kodda, promptda, README'da, maketda — faqat nomi) · «Mashq to'lov» Payme yoki Click nomi va ko'rinishini taqlid qilmaydi; Payme, Click, Stripe — faqat 11-ekran kartalarida, rasmiy fakt bilan.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.3):** dars oxirida o'quvchining o'z repo'sida `backend/` **to'lov xabarini** qabul qiladi: `tolovlar` jadvali, `POST /tolov/webhook` (imzo · takror · rad), `TOLOV_KALITI` faqat `.env` da;
   «mashq to'lov» sahifasi bilan uch tekshiruv o'quvchining o'zi bosgan tugmalar bilan qilingan (imzosiz xabar — `401`; ikki marta yuborilgan xabar — bitta qator; rad — «rad» qatori); `README.md` da **«To'lov»** bo'limi — to'lov oqimi sxemasi.
   Sxema darsda saqlanadi: `pm-m11d3-oqim` (12-band). Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m13-dars-03-done` (`m13-dars-03-start` = `m13-dars-02-done` = `m12-dars-10-done`, tayanch 3).
   **Pro va ilova bu darsda o'zgarmaydi** (tayanch 1.3) — o'quvchi matnida «Pro va ilova hali o'zgarmaydi» deb aytiladi; keyingi dars va'da qilinmaydi (T-038).
2. **Bugungi asosiy fikr (P-013; yakunda ko'rsatilmaydi — darsning ichki o'qi, SABOQ E 50):** To'lov o'tganini Backend'ga to'lov xizmati xabar bilan aytadi; Backend xabarni imzosidan taniydi, bitta to'lovni bir marta yozadi, rad etilganini ham yozadi — hammasi test rejimda.
3. **Oldingi darslardan keladigan narsa (aynan):**
   - 7-Modul (kod `5`): «Webhook — yangi xabar kelganda Telegram uni o'zi botning internetdagi manziliga (URL) yuboradi. Buning uchun botga internetda ochiq manzil kerak.» (1-dars) · «Bepul server uxlaydi; webhook xabari uni uyg'otadi.» (7-dars, Render). Bugungi ko'prik — 2-ekran.
   - 11-Modul: `backend/` (NestJS, TypeORM, Neon; Render) · `oyinchilar` jadvali · `.env` odati (`backend/.env`, `.gitignore`, agentga faqat xato qatori) · `git status` → `git add <fayl>` · Neon SQL Editor (12-Modul 10-darsida ham) · trek `pm-m9d8-platforma.trek` (`mobil` | `web`; ikkala trekda Backend — bitta `backend/`).
   - 12-Modul: `SANOQ_KALITI` qo'yilgan yo'l (8-dars: `backend/.env` ga o'zi o'ylagan uzun kalit + Render'ning Environment bo'limi) — `TOLOV_KALITI` xuddi shu yo'l bilan · `401` — «kalitsiz/tokensiz kirish yo'q» (11, 12-Modul) · «Ortda qoldingizmi» qoidasi.
   - 13-Modul 1–2-darslar: Mentor modeli — tashkilotchi uchun **Pro** (tayanch 1.0); narx — **10 000 so'm / 30 kun — «Mentorning taxmini»** (1-dars). 15 000 — 4-dars soni, bu darsda **ochilmaydi** (tayanch 7.12).
4. **Mazmun (tayanch 1.3 — aynan):**
   - **To'lov oqimi sxemasi** — Mentor sxemasi besh qator; bu darsda uch ustunga yoziladi (`pm-m11d3-oqim` shakli: kim · nima · kimga — TAYANCHGA SAVOL 12); bitta manba `MENTOR_SXEMA` (12-ekran, A2 Yordam va kutilgan natija, kartochka):

   | № | Kim | Nima qiladi | Kimga |
   |---|---|---|---|
   | 1 | Ilova | «To'lovga o'tish» bosilganda to'lov sahifasini ochadi | Brauzer |
   | 2 | Tashkilotchi | to'lov sahifasida to'laydi yoki rad etadi; karta ma'lumoti faqat xizmatda | To'lov xizmati |
   | 3 | To'lov xizmati | to'lov xabarini yuboradi: `POST /tolov/webhook` | Backend |
   | 4 | Backend | imzoni tekshiradi, to'lovni bir marta yozadi, Pro muddatini uzaytiradi, `200` qaytaradi | To'lov xizmati |
   | 5 | Ilova | Pro holatini qayta so'raydi: `GET /men` | Backend |

   Jadval ostidagi halol qator (Mentor README'si): «Hozircha: to'lov xabari `POST /tolov/webhook` da qabul qilinadi va `tolovlar` ga yoziladi; Pro va ilova hali o'zgarmaydi. Test rejim: pul yechilmaydi.»
   - **Uch g'oya** (har biri vaziyatdan, T-011): **soxta xabar → imzo** (4-ekran) · **ikki marta kelgan xabar → takror xabar** (6–8-ekranlar) · **o'tmagan to'lov → rad etilgan to'lov** (9–10-ekranlar). Backend tartibi (final, 14-ekran): imzo → takror → yozuv → `200`.
   - **«Mashq to'lov» xabari** (Mentor misoli va o'quvchi bir xil shaklda): `POST /tolov/webhook` · tana `{ tolovRaqami, holat: 'tolandi' | 'rad', summa, oyinchiId }` · sarlavha `X-Imzo` = HMAC SHA-256 (tana, `TOLOV_KALITI`) ·
     javoblar: imzo mos emas → `401`, hech narsa yozilmaydi · yangi to'lov → `200 { ok: true }` · takror → `200 { takror: true }`, yozuv yo'q · holat «rad» → yoziladi, `200 { ok: true }` (TAYANCHGA SAVOL 5). `summa` so'mda (Payme tiyinda yuboradi — 11-ekran kartasida bir marta).
   - **Namuna xabar** (bitta manba `NAMUNA_XABAR`): `{ tolovRaqami: 'm-101', holat: 'tolandi', summa: 10000, oyinchiId: 7 }` · `X-Imzo: 7c1e…` (qisqartirilgan namuna — hech qanday kalitdan hisoblanmagan) — TAYANCHGA SAVOL 3.
   - **«Mashq to'lov» sahifasi** (Backend ichida `GET /tolov-mashq?oyinchi=…&summa=…`): sarlavha **«Mashq to'lov»**, ostida **«Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.»**; tugmalar **«To'lash (mashq)»** · **«Rad etish (mashq)»**; tekshiruv tugmalari **«Ikki marta yuborish»** · **«Imzosiz yuborish»** (A2).
     Sahifa xabarni Backend'da imzolaydi — kalit brauzerga chiqmaydi. Mentor sahifasida qo'shimcha qator «Maydon Jamoa — Pro, 30 kun · 10 000 so'm» (TAYANCHGA SAVOL 4).
   - **Real xizmatlar — ko'prik** (tayanch 1.3, 6; 11-ekran kartalari, har biri bir-ikki gap): Payme — javob yo'qolsa xuddi shu so'rovni qayta yuboradi, summa tiyinda, kassa — yuridik shaxs yoki YaTT · Click — ikki so'rov (Prepare, Complete), imzo `sign_string`, `-4 Already paid` · Stripe — bir xabar bir necha marta kelishi mumkin, ishlangan xabar raqamlarini yozing; ro'yxatida O'zbekiston yo'q.
     Telegram (7-Modul botingiz) — `secret_token` sarlavhasi va `2XX` bo'lmasa qayta yuborish — faqat O'qituvchi eslatmasida (7-Modul botida `secret_token` qo'yilmagan — Shubhali 10).
   - **Uxlagan Backend (WH-q1 A) — bir gap, 6-ekran QIzohi (tayanch so'zma-so'z):** «Bepul Backend uxlagan bo'lsa, to'lov xabari kechikishi mumkin; xizmat qayta yuboradi — shuning uchun takror xabar himoyasi kerak.» Buzib ko'rish — 5-darsda (o'quvchiga aytilmaydi; O'qituvchi eslatmasida).
   - **Halol gaplar (o'quvchi matnida, so'zma-so'z):** «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» (har mashq sahifa maketida) · «Haqiqiy xizmatda sahifa va xabar boshqa kompaniya serveridan keladi …» (11-ekran xulosasi) · «Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan; bu kursda emas.» (11-ekran QIzohi; FK 27-modda — O'qituvchi eslatmasida).
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z):**
   - **to'lov xizmati** — pulni qabul qiladigan kompaniya (Click, Payme) — 0-ekranda tuguni tug'iladi, 2-ekranda nomi bilan. **to'lov sahifasi** — brauzerda ochiladigan, odam to'laydigan sahifa (2-ekran sahna yorlig'i).
   - **to'lov xabari** — to'lov xizmati Backend'ga yuboradigan xabar (to'landi yoki rad etildi); texnik nomi **webhook** (7-Modulda o'tilgan; 2-ekran, harakatdan keyin). «xabar» bu darsda faqat to'lov xabari va 2-ekrandagi Telegram xabari (7-Modul ko'prigi); har biri birinchi uchrashganda to'liq nomi bilan.
   - **imzo** — xabar haqiqatan to'lov xizmatidan kelganini ko'rsatadigan belgi: xizmat uni maxfiy kalit bilan hisoblaydi, Backend o'sha kalit bilan qayta hisoblab solishtiradi (4-ekran). Ishlatilmaydi: podpis, «sign» (prozada; Click'ning `sign_string` — kod nomi).
   - **takror xabar** — bitta to'lov haqidagi xabar ikki marta kelishi; to'lov raqami bir marta sanaladi (6-ekran); kartochkada «inglizchasi: idempotency». Ishlatilmaydi: dublikat, idempotentlik.
   - **rad etilgan to'lov** — to'lov o'tmagan holat: yoziladi, hech narsa ochilmaydi; sahifada «To'lov o'tmadi» (9-ekran). Tayanchdagi «Pro yoqilmaydi» — bu darsda Pro yo'q, shuning uchun «hech narsa ochilmaydi» (TAYANCHGA SAVOL 6). Ishlatilmaydi: failed payment, «xato to'lov».
   - **test rejim** — real pul yechilmaydigan to'lov holati; bu kursda — «mashq to'lov» bilan; kartochkada «inglizchasi: sandbox» (11-ekran). «test holati» ishlatilmaydi.
   - **mashq to'lov** — o'quvchi o'z Backend'ida quradigan test to'lov sahifasi va xabari: karta so'ralmaydi, pul yechilmaydi. Ishlatilmaydi: soxta to'lov, fake. («soxta» — faqat 4-ekrandagi «soxta xabar», imzosiz begona xabar ma'nosida.)
   - **to'lov raqami** (`tolovRaqami`, jadvalda `tolov_raqami`) — bitta to'lovni ajratadigan raqam; jadvalda noyob. **`tolovlar`** — to'lovlar jadvali (Database).
   - **to'lov oqimi sxemasi** — kim kimga nima yuborishi yozilgan jadval (12-ekran, harakatdan keyin); «sxema» bu darsda faqat shu jadval.
   - **maxfiy kalit** (`TOLOV_KALITI`) · **`.env`** · **`200`** — «qabul qildim» degan javob (2-ekran QIzohida bir marta) · **`401`** — ruxsat yo'q (11–12-Modul so'zi).
   - **Pro** — Mentor misolidagi tashkilotchi uchun 30 kunlik pullik obuna (tayanch 1.0); bu darsda faqat Mentor sxemasining 4–5-qatorida va mashq sahifasi qatorida. «obuna» yolg'iz ishlatilmaydi.
   - **tekshirish · tekshiruv** — o'z ishini ko'rish (A1, A2 «Tekshirish» qadami, uch tekshiruv). «test» o'quvchi matnida — faqat «test rejim» (ballik savollar ekranda «savol» deb ataladi); tayanch so'zi «webhook testi» o'quvchi matnida «tekshiruv» (TAYANCHGA SAVOL 22). «sinov» bu darsda yo'q.
   - **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · **README** · **Neon SQL Editor**.
   - **Ishlatilmaydi:** server (prozada; istisno — faqat «boshqa kompaniya serveri» iborasi (tayanch 9.5)), callback, notifikatsiya, ekvayring, tranzaksiya (Database ma'nosida ham — T-015), hodisa, obuna (yolg'iz), «Modul 13», A1/A2, `m11-03`.
6. **Mentor misolidagi sonlar (tayanch 1.0, 1.3, 1.13, 6 — aynan):** narx **10 000 so'm / 30 kun** — «Mentorning taxmini» (1-dars; har mashq sahifa maketida summa yonida kichik kulrang yorliq «Mentorning taxmini» — 0, 1, 2, 6, 9, 11-ekranlar va A2 kutilgan natija) ·
   Render bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa (tayanch 6; o'quvchi matnida «bir daqiqagacha» — 12-Modul 9.19). Namuna qiymatlar (son emas, belgi): `m-101`, `m-102`, `oyinchiId: 7`, `7c1e…`, `3f9a…` (TAYANCHGA SAVOL 3). Boshqa son yo'q; statistika deyilmaydi (T-043); komissiya aytilmaydi.
7. **Metafora yo'q. Keyssiz** (TEX, Qaror-0 21). Qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: tashkilotchi, o'yinchi. Payme, Click, Stripe — brend sifatida faqat 11-ekranda (nomi o'z rangida, logotipsiz, rasmiy fakt bilan; S-018 izohi bilan).
8. **Kod — kim nima yozadi:** `tolovlar`, `POST /tolov/webhook`, mashq sahifasi va README'ni **agent** yozadi (A1, A2 talabi); **takror tekshiruvini o'quvchi qo'lda yozadi** — kod oynasida (7-ekran), namuna Backend bilan («haqiqiy Backend emas» — oynadagi izohda ochiq).
   Imzo hisoblash kod oynasida yo'q — 4-ekranda o'qiladigan qisqa kod kartasi (P-065) va repo'da (Node `crypto`, HMAC SHA-256). NestJS kodi darsda — faqat o'qiladigan qisqa bo'lak va chizilgan maket (TAQIQLAR 6).
9. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, tugunlar, konvert, chiziq, qulf belgisi — CSS/SVG; «Maydon Jamoa» nomi mashq sahifasi qatorida o'z rangida (11-Modul yashili); logotip yo'q;
   rang — faqat holat foni (D3): yozildi / mos — `ok`, `401` / mos emas / ikki qator — `err`, rad qatori — `ink2`, joriy — `accent`.
10. **Trek (tayanch 4):** bu darsda o'zgarish faqat `backend/` da — **ikkala trekda bloklar bir xil**. `pm-m9d8-platforma.trek` faqat A2 «Ochish» gapini almashtiradi (mashq sahifasini telefon brauzerida yoki kompyuterda ochish). Kalit yo'q bo'lsa — ikkala gap ko'rinadi.
11. **Vaqt (90 daqiqa — reja) va ulgurmagan yo'l:** taqsimot tepada. A1 3-qadamda Render kutishi paytida ish (kodni o'qitadigan prompt); A1 «Davom etish» — 3-qadamdan keyin, A2 — 2-qadamdan keyin ochiladi (SABOQ E 55); blok bajarilgani — faqat 4-qadam «Bajardim»idan.
    Ulgurmasa: A2 (yoki A1 4-qadami) — uyga vazifa ①; sxema 13-ekranda baribir saqlanadi. Yakun sarlavhasi holatga qarab (19-ekran). O'qituvchi eslatmasi — 1-ekranda.
12. **Saqlash kaliti (tayanch 8 — aynan):** o'qiydi `pm-m9d8-platforma` (`trek`; yo'q bo'lsa — ikkala gap) → yozadi `pm-m11d3-oqim` =
    `{ qatorlar: [{ id, kim, nima, kimga }] (3–6), test: { imzo: bool | null, takror: bool | null, rad: bool | null }, savedAt }` — `id` barqaror (`q1`, `q2`…, qayta ishlatilmaydi), tartib o'zgarmaydi;
    `qatorlar` — 13-ekran «Saqlash»; `test` — A2 4-qadam: «Kutilganidek» → `true`, «Boshqacha» → `false`, bosilmagan → `null` (ish fakti: o'quvchi o'zi ko'rgani). Kalitga ism, login, telefon, `TOLOV_KALITI` qiymati yozilmaydi; `kim` — rol («tashkilotchi», «xaridor»).
    Kod oynasi qoralamasi — `pm-m11d3-code`. Boshqa darsning kaliti yozilmaydi va o'qilmaydi (`pm-m11d2-model` — TAYANCHGA SAVOL 13).
13. **Texnik faktlar** — «Manbalar» bo'limida (rasmiy hujjat, 07.10.2026; tayanch 6 va o'zim tekshirganlarim); o'quvchiga ko'rinmaydi.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan ilova (tayanch 1.0); Mentor modeli — tashkilotchi uchun Pro (1–2-darslar). Bugun to'lov o'tganini Backend qanday bilishi ko'riladi: tashkilotchi mashq sahifasida «To'lash (mashq)» ni bosadi,
  xizmat to'lov xabarini Backend'ga yuboradi, Backend uni imzosidan taniydi, ikki marta kelganini bir marta yozadi, rad etilganini ham yozadi. O'quvchi xuddi shuni o'z Backend'ida qiladi (13-ekran, A1, A2).
- **Hook:** «To'lash (mashq)» bosildi, sahifada «To'landi (mashq)», Backend'da esa hali hech narsa yo'q → «Backend qayerdan biladi?» → 2-ekranda 7-Moduldagi bot webhook'i va xuddi shu yo'l to'lov bilan → 4-ekranda begona kompyuterdan soxta xabar → imzo →
  6-ekranda uxlagan Backend va qayta yuborilgan xabar → takror xabar → 7-ekranda takror tekshiruvi qo'lda → 9-ekranda rad → 11-ekranda mashq va haqiqiy xizmat farqi → 12–13-ekranlarda sxema → A1 (yo'l va jadval) → A2 (mashq sahifasi va uch tekshiruv).
- **Bitta vizual — «telefon · to'lov xizmati · Backend» sahnasi** (bitta manba `TOLOV_SAHNA` + `NAMUNA_XABAR`, 163/180; TAQIQLAR 6: «telefon ↔ brauzer (to'lov sahifasi) ↔ Backend; xabar konvert bo'lib uchadi»):
  - **chapda telefon** (ramka ≈170×272, o'lcham barqaror; yorliq ramka ustida «telefon · brauzer»): brauzer satri `maydon-jamoa-….onrender.com/tolov-mashq`; sahifa — **«Mashq to'lov»** · ostida kulrang «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» ·
    «Maydon Jamoa — Pro, 30 kun» (nom o'z rangida) · «10 000 so'm» (yonida kichik kulrang yorliq «Mentorning taxmini») · tugmalar «To'lash (mashq)» · «Rad etish (mashq)». Karta maydoni hech bir holatda chizilmaydi.
  - **o'rtada «To'lov xizmati» tuguni** (ostida kulrang bir qator: «pulni qabul qiladigan kompaniya · bu darsda — mashq»); 4-ekranda ichida qulf belgili qator `TOLOV_KALITI`; 6-ekranda ichida javob kutish soati; 11-ekranda Backend ichiga kiradi va chiqadi.
  - **o'ngda «Backend» tuguni** — ichida mini-jadval `tolovlar` (ustunlar: `tolov_raqami` · `holat`; hisoblagich «N qator») · 4-ekrandan qulf qatori `TOLOV_KALITI · .env` · 6-ekranda holat chirog'i («uxlayapti» — kulrang, «uyg'oq» — yashil) va o'chirgich «Takror tekshiruvi: o'chiq / yoqiq».
  - **konvert** — to'lov xabari (yorliq `POST /tolov/webhook`; ochilsa: tana qatorlari va `X-Imzo` qatori, mono) va javob konverti (`200`, `401`, `200 { takror: true }`). Konvert xizmatdan Backend'ga, javob — Backend'dan xizmatga (ilovaga emas).
  - Holatlar: kulrang (yo'q) → oq (bor) → accent (joriy) → yashil (yozildi / mos) → qizil (`401` / mos emas / bitta raqam ikki marta). Yangi qator jadvalga bir lahza ajralib kiradi. `prefers-reduced-motion` da konvert yurmaydi — holatlar animatsiyasiz almashadi (DE-200).
  - Ishlatilishi: 0 (telefon + Backend, javobdan keyin xizmat tug'iladi) · 1 (tayyor holat) · 2 (avval Telegram · botingiz, keyin to'lov) · 4 (+ «boshqa kompyuter», kod kartasi ostida) · 6 · 9 · 11 · 12 (+ jadval o'ngda) · 14 (final xulosasi) · A1, A2 kutilgan natija.
- **Yakun:** Backend'ingiz to'lov xabarini imzosi, raqami va holati bo'yicha tekshirib yozadi; sxema README'da · keyingi dars — «Narxni qanday belgilaysiz?».

---

## 0 · Kirish — to'landi, Backend jim  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **To'lov o'tdi — Backend buni qayerdan biladi?** (44)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Mentor misolida tashkilotchi brauzerda to'lov sahifasini ochgan — «To'lash (mashq)» ni bosing.
  - variantlar ochilgach: Endi o'ngdagi javoblardan birini tanlang.
- Maket (chap): telefon — mashq sahifasi (`TOLOV_SAHNA` tavsifi: «Mashq to'lov» · «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · «Maydon Jamoa — Pro, 30 kun» · «10 000 so'm» + yorliq «Mentorning taxmini» · «To'lash (mashq)» — halqada; «Rad etish (mashq)» — oddiy, bu ekranda bosilmaydi).
  Telefonning o'ng tomonida — Backend tuguni, ichida mini-jadval `tolovlar` · «0 qator». Xizmat tuguni hali yo'q.
- **Harakat → Vizual o'zgarish:** «To'lash (mashq)» → sahifada yashil qator «To'landi (mashq)»; telefon va Backend orasida uzuq kulrang chiziq, ustida «?»; `tolovlar` · «0 qator» o'zgarmaydi. Shundan keyin o'ngdagi variantlar faollashadi (bosilmaguncha xira).
- Variantlar (radio, ballsiz; har birining o'z yengil chegarasi — E 40):
  - Ilova Backend'ga «to'landi» deb yozadi
  - ✔ To'lov xizmati Backend'ga o'zi yozadi
  - Backend xizmatdan har daqiqa so'raydi
- Javob — 2-variant: **Aynan!** 7-Modulda botingizga Telegram xabarni o'zi yuborardi — bu yerda xabarni to'lov xizmati yuboradi. (103)
- Javob — 1-variant: **Qiziq fikr!** Ilova faqat sahifani ochadi, pulni ko'rmaydi. Uning gapiga ishonsak, to'lamagan ham «to'landi» deya oladi. (118)
- Javob — 3-variant: **Qiziq fikr!** So'rab turish ham yo'l, lekin Mentor misolida xizmat Backend'ga o'zi yozadi — so'rash shart emas. (109)
- Javobdan keyin: telefon va Backend orasida **«To'lov xizmati»** tuguni tug'iladi (ostida kulrang «pulni qabul qiladigan kompaniya»); telefondan xizmatga chiziq bir marta yonadi; xizmatdan Backend'ga konvert uchadi → `tolovlar` · «1 qator» («?» yo'qoladi).
  Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): to'lov o'tganini Backend qanday bilishi. Uchala variant «kim — nima qiladi» shaklida; 1-variant — keyingi ekranlardagi imzoning urug'i (ilovaning gapi — dalil emas), 3-variant — rost yo'l, lekin Mentor misolida emas (P-016: payoff hech bir tanlovni yolg'onga chiqarmaydi).
  «7-Modulda botingiz» — 7-Modul 7-darsida bot Render'da webhook bilan ishlagan (A-bo'lim 3). Mashq sahifasidagi qatorlar — tayanch 1.3 aynan (TAYANCHGA SAVOL 1, 4).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun Backend'ingiz mashq to'lovni qabul qiladi.** (48)
- Mentor: Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z Backend'ingizda qilasiz. Pul yechilmaydi: bu kursda to'lov — mashq.
- Chap — «Dars oxirida»: `TOLOV_SAHNA` tayyor holatda — telefon (mashq sahifasi) · To'lov xizmati · Backend (`tolovlar` · «1 qator», holati «tolandi»); bir marta o'zi yuradi (DE-200): konvert xizmatdan Backend'ga uchadi → qator kiradi → `200` qaytadi.
  Sahna ostida README kartasining bitta qatori: «To'lov» · 5 qator.
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` so'zlari bilan — P-015):
  - 01 · Xabar kimdan kelganini tekshirish · `imzo`
  - 02 · Bitta to'lovni bir marta yozish · `takror xabar`
  - 03 · O'tmagan to'lovni ajratish · `rad etilgan to'lov`
  - 04 · O'z Backend'ingizda mashq to'lov bilan tekshirish · `test rejim`
- Pastki qator (mono, kichik): o'z repo'ngiz — `backend/` va `README.md` «To'lov» · Mentor misoli `maydon-jamoa` · tayyor holat `m13-dars-03-done`
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: darsning og'ir qismi — 7-ekran (kod oynasi) va ikki blok (har birida Render'da yangi versiya kutiladi). 2, 11-ekranlarga ortiqcha vaqt bermang. Vaqt yetmasa A2 uyga vazifaning 1-bandiga o'tadi; sxema 13-ekranda saqlanadi.
  **Pul chegarasi:** darsda hech kim haqiqiy to'lov xizmatiga ro'yxatdan o'tmaydi, karta ma'lumotini yozmaydi va hech kimga ko'rsatmaydi; mashq sahifasi karta so'ramaydi. O'quvchi «Payme ulasam bo'ladimi?» desa — 11-ekrandagi halol gap: real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan (FK 27-modda, lex.uz/docs/-111189); bu kursda emas.
  Uxlagan Backend'ni ataylab buzish — 5-darsning ishi (o'quvchiga va'da qilinmaydi).

## 2 · To'lov xabari  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · to'lov xabari
- Sarlavha: **Xizmat xabarni Backend'ning qayeriga yuboradi?** (46)
- Mentor (bosqichga qarab):
  - boshida: 7-Modulda Telegram yangi xabarni botingiz manziliga o'zi yuborardi — avval «Botga yozish» ni bosib, o'shani eslang.
  - 1-qadamdan keyin: Endi xuddi shu yo'lni to'lov bilan ko'ring — «To'lash (mashq)» ni bosing.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator): **To'lov xizmati xabarni qayerga yuboradi?** · Tashkilotchining telefoniga · Backend'ning ochiq manziliga · To'g'ridan-to'g'ri Database'ga
- Sahna (1-holat — 7-Modul): chapda telefon — Telegram chati (pufak joyi bo'sh; chat ostida tugma «Botga yozish» — halqada) · o'rtada «Telegram» tuguni · o'ngda «botingiz» tuguni (yorliq `…onrender.com/telegram`). Qadam belgilari tugma yonida (SABOQ 21): 1 Botga yozing · 2 To'lang.
- **Harakat → Vizual o'zgarish:**
  1. «Botga yozish» → chatda «Salom!» pufagi → konvert Telegram tugunidan bot tuguniga uchadi (yorliq `…onrender.com/telegram`) → botdan javob qaytadi, chatda javob pufagi.
     Nom qatori 1 (bitta): 7-Modulda: Telegram yangi xabarni botingiz manziliga o'zi yuboradi — bu webhook.
     Keyin sahna yorliqlari bir lahza almashadi, shakli o'sha (P-020 ko'prigi): telefon — mashq sahifasi · «Telegram» → «To'lov xizmati» · «botingiz» → «Backend» (ichida `tolovlar` · «0 qator»). «To'lash (mashq)» halqaga o'tadi.
  2. «To'lash (mashq)» → sahifada «To'landi (mashq)» → konvert xizmatdan Backend'ga uchadi (yorliq `POST /tolov/webhook`) → Backend chetida ochiladi: tana `{ tolovRaqami: 'm-101', holat: 'tolandi', summa: 10000, oyinchiId: 7 }` · sarlavha `X-Imzo: 7c1e…` →
     `tolovlar` ga qator kiradi «m-101 · tolandi» → Backend'dan xizmatga qisqa konvert `200` qaytadi.
     Nom qatori 2 (bitta): To'lov xizmati Backend'ga yuboradigan xabar — to'lov xabari; texnik nomi webhook.
- Natija qatori — yashil xulosaning birinchi kichik qatori (E 42): «Taxminingiz ✕ — aslida: Backend'ning ochiq manziliga» (yoki «Taxminingiz to'g'ri chiqdi ✓»). Hamma tushuncha-ekranda shunday; QIzoh — shu qutining oxirgi kichik qatori.
- Xulosa: Ilova so'ramaydi: to'lov xizmati xabarni Backend manziliga o'zi yuboradi, Backend `200` bilan javob beradi. (107)
- Qator (`QIzoh`, xulosadan keyin, bitta): `200` — «qabul qildim» degan javob; `summa` so'mda, 10 000 — Mentorning taxmini.
- Tugadi (199): qadam belgilari yopiladi, sahna butun enga, ochiq konvert va jadval qatori fokusga; vizual ⛶ ichida (q17). Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ T-011 tartibi: hodisa sahnada (7-Moduldagi bot, keyin to'lov) → «to'lov xabari» → «webhook». «To'lov xizmati», «to'lov sahifasi» — sahna yorliqlari (tugun ostida bir qatorli izoh). Konvertdagi `X-Imzo` qatori bu ekranda izohsiz — 4-ekran uni ochadi (P-036).
  Bir sahna ikki olamda — yorliqlar almashadi, shakl o'zgarmaydi (TAYANCHGA SAVOL 2). `200` — 10-Modul `/health` dan ko'rilgan; ball beriladigan matndan oldin bir marta izoh (S-020).

## 3 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol
- Savol: **Mentor misolida to'lov o'tganini Backend kimdan biladi?**
  - Tashkilotchining ilovasidan
  - Tashkilotchining SMS xabaridan
  - ✔ To'lov xizmatining xabaridan
  - Database'ning o'z yozuvidan
- Kalit: **C** (index 2). To'rttalasi «…dan» shaklida; «Tashkilotchining» ikki variantda, qolgan ikkitasi boshqa so'z bilan (shakl-telli yo'q, §147).
- To'g'ri izohi: Mentor misolida to'lov xizmati to'lov xabarini Backend manziliga o'zi yuboradi.
- Xato izohlari (≤60):
  - A: Ilova faqat sahifani ochadi — pulni kim ko'radi? (48)
  - B: SMS telefonga keladi — Backend'ga-chi? (38)
  - D: Database faqat yozilganni biladi — yozuvni kim boshlaydi? (57)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Distraktorlar uch xil turkumdan (sinf 8): ilovaga ishonish (A) · odamning qo'lda xabari (B) · tizimning noto'g'ri qismi (D). Polling («Backend o'zi so'raydi») varianti ataylab yo'q — haqiqiy hayotda rost bo'lib qolishi mumkin (TAQIQLAR 7).

## 4 · Soxta xabar va imzo  ← QTushuncha (bashorat + 2 qadam; kod kartasi)
- Eyebrow: Tushuncha · imzo
- Sarlavha: **Soxta «to'landi» xabarini Backend qanday ajratadi?** (50)
- Mentor: Backend manzili internetda ochiq — avval «Haqiqiy xabar» ni, keyin «Soxta xabar» ni yuboring.
- Bashorat (ballsiz; tanlangach ixcham qator): **Manzilni bilgan begona odam «to'landi» deb yozsa, nima bo'ladi?** · Backend uni to'lov deb yozadi · Backend uni ajratib, yozmaydi
- Sahna: o'rtada «To'lov xizmati» (ichida qulf belgili qator `TOLOV_KALITI`) · o'ngda «Backend» (ichida qulf qatori `TOLOV_KALITI · .env` va `tolovlar` · «1 qator» — m-101) · xizmat tuguni ostida kichik «boshqa kompyuter» tuguni (noutbuk shakli, odam chizilmaydi).
  Telefon bu ekranda kichik va xira (chapda). Ikki qulf qatori orasida kulrang yozuv: «bir xil kalit — faqat shu ikkalasida». Ostida tugmalar «Haqiqiy xabar» (halqada) · «Soxta xabar». Qadam belgilari: 1 Haqiqiy xabar · 2 Soxta xabar.
- Kod kartasi (sahna ostida — E 46; o'qish uchun, qisqartirilgan — P-065), yorlig'i `backend` · imzo tekshiruvi:
  ```ts
  const kutilgan = createHmac('sha256', process.env.TOLOV_KALITI)
    .update(tana)
    .digest('hex');
  if (imzo !== kutilgan) throw new UnauthorizedException(); // 401
  ```
  Karta ostida kulrang bir qator: `TOLOV_KALITI` — `.env` da, kodda faqat nomi; `imzo` — `X-Imzo` sarlavhasidan, `tana` — kelgan xabar matni.
- **Harakat → Vizual o'zgarish:**
  1. «Haqiqiy xabar» → xizmat ichida mono qator «tana + kalit → `3f9a…`» → konvert (tana `m-102` + `X-Imzo: 3f9a…`) Backend'ga uchadi; qulf qatori xizmatda qoladi — konvertga kirmaydi →
     Backend ichida «tana + kalit → `3f9a…`» → «mos ✓» (yashil); kartada `if` qatori yashil → `tolovlar` ga «m-102 · tolandi» → `200`. «Soxta xabar» halqaga o'tadi.
  2. «Soxta xabar» → «boshqa kompyuter»dan konvert: tana `{ tolovRaqami: 'm-999', holat: 'tolandi', … }`, `X-Imzo` qatori yo'q → Backend ichida «tana + kalit → `b04e…`» → «mos emas ✗» (qizil, bir marta silkinadi);
     kartada `if` qatori qizil → konvert «`401`» bilan qaytadi; `tolovlar` · «2 qator» o'zgarmaydi.
  Nom qatori (2/2 dan keyin, bitta): Xabar haqiqatan to'lov xizmatidan kelganini ko'rsatadigan belgi — imzo: xizmat uni maxfiy kalit bilan hisoblaydi, Backend qayta hisoblab solishtiradi.
- Natija qatori: «Taxminingiz ✕ — aslida: Backend uni ajratib, yozmaydi» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu misolda kalit xabar ichida ketmaydi: faqat imzo ketadi, Backend uni o'zidagi kalit bilan qayta hisoblaydi. (109)
- Qator (`QIzoh`, xulosadan keyin, bitta): Imzo xabarni kim yuborganini ko'rsatadi; to'lov o'tgan-o'tmaganini esa `holat` aytadi.
- Tugadi (199): tugmalar yopiladi, sahna va kod kartasi fokusga (ikki konvert natijasi yonma-yon: «mos ✓ · `200`» va «mos emas ✗ · `401`»); vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikkalasini yuboring (N/2) → Davom etish
- O'qituvchi eslatmasi: imzo — hisob (HMAC SHA-256), qo'l imzosiga o'xshatilmaydi (darsda metafora yo'q). Repo'da imzolar `timingSafeEqual` bilan solishtiriladi — kartadagi `!==` o'qish uchun qisqartirilgan.
  7-Moduldagi bot haqida so'rashsa: Telegram ham webhook so'roviga `X-Telegram-Bot-Api-Secret-Token` sarlavhasini qo'shadi — `setWebhook` da `secret_token` berilgan bo'lsa (tayanch 6); 7-Modul botida bu qo'yilmagan.
✎ T-045: imzo — kim yuborganini ko'rsatadi, to'lov to'g'riligini emas (QIzoh); kalit va imzo — ikki narsa (xulosa). «Soxta xabar» — begona kompyuterdan imzosiz xabar (Qaror-0 2 dagi «soxta imzo» — 5-darsning «Noto'g'ri imzo» tugmasi). Uch blok: sahna · tugmalar · kod kartasi (SABOQ 26).
  Begona odam chizilmaydi — «boshqa kompyuter» tuguni (hujum usuli o'rgatilmaydi: faqat natija — `401`; TAQIQLAR 3).

## 5 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol
- Savol: **Imzosiz «to'landi» xabari keldi. Mentor Backend'i nima qiladi?**
  - ✔ `401` qaytaradi, hech narsa yozmaydi
  - `200` qaytaradi, to'lovni yozib qo'yadi
  - `401` qaytaradi, to'lovni baribir yozadi
  - `200` qaytaradi, qatorni «rad» deb yozadi
- Kalit: **A** (index 0). To'rttalasi «`kod` qaytaradi, … » shaklida; `401` va `200` ikkitadan (shakl-telli yo'q).
- To'g'ri izohi: Imzo mos kelmasa, Backend `401` qaytaradi va `tolovlar` ga hech narsa yozilmaydi.
- Xato izohlari (≤60):
  - B: Imzo tekshirilmasa, soxta xabar ham to'lov bo'lib qoladi. (57)
  - C: Qator yozilsa, soxta xabar baribir jadvalda qoladi. (51)
  - D: «Rad» — xizmat aytadigan holat; bu xabar xizmatdan emas. (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Distraktor turkumlari: tekshiruvsiz (B) · javob to'g'ri, yozuv noto'g'ri (C) · rad bilan aralashtirish (D) — sinf 8.

## 6 · Javob yo'qolsa — takror xabar  ← QTushuncha (bashorat + 3 qadam)
- Eyebrow: Tushuncha · takror xabar
- Sarlavha: **Xizmat javob olmasa, xabarni nima qiladi?** (41)
- Mentor (bosqichga qarab):
  - boshida: Mentor misolida Backend uxlab qolgan — «To'lash (mashq)» ni bosing va xizmatga qarang.
  - 1-qadamdan keyin: Xizmat javobni kutib qoldi — «Kuting» ni bosing.
  - 2-qadamdan keyin: Bitta to'lov ikki marta yozildi — Backend ichidagi «Takror tekshiruvi» ni yoqing.
- Bashorat (ballsiz; tanlangach ixcham qator): **Javob kelmasa, xizmat nima qiladi?** · Xabarni boshqa yubormaydi · Xabarni qayta yuboradi
- Sahna: telefon (mashq sahifasi; «To'lash (mashq)» halqada) · To'lov xizmati (ichida kichik soat — javob kutish) · Backend (holat chirog'i kulrang, yozuv «uxlayapti»; `tolovlar` · «0 qator»; ichida o'chirgich «Takror tekshiruvi: o'chiq»). Qadam belgilari: 1 To'lang · 2 Kuting · 3 Tekshiruvni yoqing.
- **Harakat → Vizual o'zgarish:**
  1. «To'lash (mashq)» → konvert `m-101` Backend'ga yetadi; chiroq «uyg'onmoqda…» (sahnada ≈2 s) → `tolovlar` ga «m-101 · tolandi» → `200` konverti yo'lga chiqadi, lekin xizmatdagi soat to'xtaydi va konvert yo'lda so'nadi; xizmatda qizil yorliq «javob kelmadi». «Kuting» halqaga o'tadi.
  2. «Kuting» → xizmat **o'sha** `m-101` xabarini qayta yuboradi → Backend (chiroq yashil, «uyg'oq») yana yozadi → jadvalda ikki qator «m-101», ikkalasi qizil ajratiladi, yonida «bitta to'lov — ikki qator». O'chirgich «Takror tekshiruvi» halqaga o'tadi.
     Nom qatori (bitta): Bitta to'lov haqidagi xabar ikki marta kelishi — takror xabar.
  3. «Takror tekshiruvi» (o'chiq → yoqiq) → sahna 1-qadamdan qaytadan yuradi (jadval bo'sh, Backend uxlayapti): birinchi xabar yoziladi, javob yana yo'lda so'nadi → xizmat qayta yuboradi →
     Backend ichida qator «m-101 — bor» → yozilmaydi → `200 { takror: true }` xizmatga yetadi → xizmatda yashil «qabul qilindi», qayta yuborish to'xtaydi; jadvalda bitta qator.
- Natija qatori: «Taxminingiz ✕ — aslida: xabarni qayta yuboradi» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu misolda bitta to'lov raqami bir marta yoziladi; takrorga ham `200` qaytadi — xizmat qayta yubormasin. (104)
- Qator (`QIzoh`, xulosadan keyin, bitta — tayanch 1.3 so'zma-so'z): Bepul Backend uxlagan bo'lsa, to'lov xabari kechikishi mumkin; xizmat qayta yuboradi — shuning uchun takror xabar himoyasi kerak.
- Tugadi (199): qadam belgilari va o'chirgich yopiladi, ikki holat yonma-yon fokusga («tekshiruvsiz — 2 qator» · «tekshiruv bilan — 1 qator»); vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish
- O'qituvchi eslatmasi: Render bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa (tayanch 6). Xizmat javobni qancha kutishi har xizmatda boshqa — darsda soniya aytilmaydi.
  Sahna bitta holatni ko'rsatadi (birinchi xabar yozildi, javob kech qoldi); uxlagan Backend'ni ataylab buzish — 5-darsda (o'quvchiga aytilmaydi).
✎ «Kuting» — sahna tugmasi (haqiqiy Backend'da bunday tugma yo'q; vizual bosqichda ramkadan tashqarida, Shubhali 14). Takrorga `200` — tayanch 1.3 («xizmat qayta yubormasin»). Payme va Stripe dalili — 11-ekran kartalarida.

## 7 · Takror tekshiruvi  ← QKod
- Eyebrow: Kod yozish · takror xabar
- Sarlavha: **Bitta to'lovni bir marta yozadigan kod yozamiz.** (47) — §19 sarlavha oilasi
- Mentor: Kod oynasida Backend o'rnida namuna turibdi. Takror tekshiruvini o'zingiz terib yozasiz: qo'lda yozganda o'rganiladi.
- Chap — vazifa (3 band):
  1. `qabulQil` ning eng boshida: to'lov raqami `yozilganlar` ichida bo'lsa — `'takror'` qaytaring.
  2. «Yangi to'lov xabari», keyin «Oxirgi xabar yana keldi» ni bosing: jadvalda bitta qator qolsin.
  3. «Rad etilgan to'lov xabari», keyin «Oxirgi xabar yana keldi» ni bosing: «rad» qatori bitta bo'lsin.
- Yordam: `yozilganlar.includes(raqam)` ro'yxatda shu raqam bor-yo'qligini tekshiradi. «rad» qatori ikki marta yozilsa — tekshiruvingiz `rad` qatoridan pastda turibdi.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi (§19 halol tugma).
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; ostida bir qator: «Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.») → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi:
    ```html
    <p class="javob">Javob: hali yo'q</p>
    <button class="yangi">Yangi to'lov xabari</button>
    <button class="radxabar">Rad etilgan to'lov xabari</button>
    <button class="yana">Oxirgi xabar yana keldi</button>
    <table class="jadval">
      <tr><th>tolov_raqami</th><th>holat</th></tr>
    </table>
    ```
  - `namuna.js` — tayyor, o'zgarmaydi (tepasida izoh ochiq):
    ```js
    // Backend va to'lov xizmati o'rnida NAMUNA (haqiqiy Backend emas):
    // tugmalar to'lov xabarini yuboradi, jadval shu faylda turadi.
    const yozilganlar = [];
    let raqam = 100;
    let oxirgi = null;

    function qatorQosh(xabar) {
      const tr = document.createElement('tr');
      [xabar.tolovRaqami, xabar.holat].forEach(function (matn) {
        const td = document.createElement('td');
        td.textContent = matn;
        tr.appendChild(td);
      });
      document.querySelector('.jadval').appendChild(tr);
    }

    function yubor(xabar) {
      oxirgi = xabar;
      const natija = qabulQil(xabar, yozilganlar);
      if (natija === 'yangi' || natija === 'rad') {
        yozilganlar.push(xabar.tolovRaqami);
        qatorQosh(xabar);
      }
      document.querySelector('.javob').textContent =
        'Javob: 200 · ' + natija;
    }

    function yangiXabar(holat) {
      raqam = raqam + 1;
      yubor({ tolovRaqami: 'm-' + raqam, holat: holat, summa: 10000 });
    }

    function bosilsa(sinf, ish) {
      document.querySelector(sinf).addEventListener('click', ish);
    }

    bosilsa('.yangi', function () {
      yangiXabar('tolandi');
    });
    bosilsa('.radxabar', function () {
      yangiXabar('rad');
    });
    bosilsa('.yana', function () {
      if (oxirgi) yubor(oxirgi);
    });
    ```
  - `app.js` — boshlang'ich holat (o'quvchi to'ldiradi):
    ```js
    // Backend har to'lov xabari kelganda shu funksiyani chaqiradi.
    // 'yangi' — yoziladi, 'rad' — «rad» bo'lib yoziladi,
    // 'takror' — yozilmaydi.
    function qabulQil(xabar, yozilganlar) {
      // 1) To'lov raqami yozilganlar ichida bo'lsa — 'takror'.
      //    Shu yerga yozing:

      if (xabar.holat === 'rad') {
        return 'rad';
      }
      return 'yangi';
    }
    ```
- Kod oynasi sarlavhasi: `app.js — bitta to'lov raqami bir marta`
- Shart xabarlari (≤60):
  - 1 — Yangi to'lov xabari jadvalga bir marta yozilsin. (48)
  - 2 — Shu xabar yana kelsa, javob «takror» bo'lsin. (45)
  - 3 — Rad xabari ikki marta kelsa ham, «rad» qatori bitta. (52)
- **Harakat → Vizual o'zgarish:** boshlang'ich kodda: «Yangi to'lov xabari» → jadvalda «m-101 · tolandi», yuqorida «Javob: 200 · yangi» (1-shart ✓); «Oxirgi xabar yana keldi» → ikkinchi «m-101» qatori — bitta raqam jadvalda ikki marta.
  Tekshiruv yozilgach: «yana» → qator qo'shilmaydi, «Javob: 200 · takror» (2-shart ✓); «Rad etilgan to'lov xabari» → «m-102 · rad», «yana» → qator qo'shilmaydi (3-shart ✓). Tekshiruv `rad` qatoridan pastga yozilsa, 3-shart ✗ qoladi.
  Kod o'zgarsa natija oynasi boshidan ochiladi (jadval bo'sh). «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Bu kodda takror tekshiruvi birinchi turadi: ikki marta kelgan rad xabari ham bir marta yoziladi. (96)
- Qator (`QIzoh`, xulosadan keyin): Bu oynada Backend va xizmat — namuna: haqiqiy Backend emas, xabarni tugma yuboradi.
✎ `includes`, `indexOf`, `some`, `for` sikli — hammasi qabul: tekshiruv xulq-atvor bo'yicha (SABOQ 37; KOD 8). `yozilganlar` — to'lov raqamlari ro'yxati (TAYANCHGA SAVOL 8). Namunada javob faqat `200` — imzo bu oynada yo'q (4-ekran va repo).
  3-shart — tartibni o'qitadigan nuqta: imzo → takror → rad (final, 14-ekran). Namuna jadvalni `textContent` bilan to'ldiradi (10-Modul 5-darsidagi `innerHTML` xavfi namunada ham yo'q).

## 8 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol
- Savol: **Xizmat bitta to'lov xabarini qayta yubordi. Mentor Backend'i nima qiladi?**
  - Ikkinchi qator yozadi, `200` qaytaradi
  - Hech narsa yozmaydi, `401` qaytaradi
  - Qatorni «rad» deb yozadi, `200` qaytaradi
  - ✔ Hech narsa yozmaydi, `200` qaytaradi
- Kalit: **D** (index 3). To'rttalasi «… yozadi / yozmaydi, `kod` qaytaradi» shaklida; «Hech narsa yozmaydi» ikki variantda, `200` uch variantda (shakl-telli yo'q).
- To'g'ri izohi: Raqam allaqachon yozilgan: ikkinchi qator yo'q, `200` esa xizmatga qayta yubormaslikni aytadi.
- Xato izohlari (≤60):
  - A: Bitta to'lov ikki qator bo'lsa, u ikki marta sanaladi. (54)
  - B: `401` olgan xizmat to'xtaydimi yoki yana yuboradimi? (52)
  - C: To'lov o'tgan edi — «rad» qayerdan chiqdi? (42)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Distraktor turkumlari: himoyasiz (A) · noto'g'ri javob — xizmat qayta yuboraveradi (B) · takrorni rad bilan aralashtirish (C). «Eski qatorni yangilaydi» varianti ataylab yo'q — haqiqiy loyihalarda shunday yechim ham bor (TAQIQLAR 7).

## 9 · O'tmagan to'lov  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · rad etilgan to'lov
- Sarlavha: **To'lov o'tmasa ham Backend'ga xabar keladimi?** (45)
- Mentor (bosqichga qarab):
  - boshida: Mashq sahifasida «Rad etish (mashq)» ni bosing va konvert ichiga qarang.
  - 1-qadamdan keyin: Endi «Oxirgi xabar yana keldi» ni bosing — shu xabar ikkinchi marta kelsa-chi?
- Bashorat (ballsiz; tanlangach ixcham qator): **To'lov o'tmasa, Backend'ga nima keladi?** · Hech narsa kelmaydi · Xabar keladi, holati «rad»
- Sahna: telefon (mashq sahifasi; «Rad etish (mashq)» halqada) · To'lov xizmati · Backend (`tolovlar` · «1 qator» — «m-101 · tolandi»; o'chirgich «Takror tekshiruvi: yoqiq»). Qadam belgilari: 1 Rad eting · 2 Yana yuboring.
- **Harakat → Vizual o'zgarish:**
  1. «Rad etish (mashq)» → sahifada qizil qator «To'lov o'tmadi» → konvert `m-102` Backend'ga uchadi va ochiladi: `holat: 'rad'` qatori ajralib turadi → Backend ichida uch qator ketma-ket yonadi: «imzo ✓» · «m-102 — yangi» · «holat: rad» →
     `tolovlar` ga «m-102 · rad» (kulrang) → `200` xizmatga qaytadi; Backend ichida bir qator «hech narsa ochilmaydi». Sahna ostida «Oxirgi xabar yana keldi» halqaga o'tadi.
     Nom qatori (bitta): To'lov o'tmagan holat — rad etilgan to'lov: xabar keladi va yoziladi, lekin hech narsa ochilmaydi.
  2. «Oxirgi xabar yana keldi» → konvert `m-102` yana → Backend ichida «m-102 — bor» → yozilmaydi → `200 { takror: true }`; jadvalda «rad» qatori bitta.
- Natija qatori: «Taxminingiz ✕ — aslida: xabar keladi, holati «rad»» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu misolda rad xabari ham bir marta yoziladi: hech narsa ochilmaydi, takror kelsa — qayta yozilmaydi. (101)
- Qator (`QIzoh`, xulosadan keyin, bitta): Yozuv qoladi: tashkilotchi «to'lovim qayerda?» deb so'rasa, o'tmagan to'lov ham Backend'da ko'rinadi.
- Tugadi (199): qadam belgilari yopiladi, jadval (ikki qator: «tolandi», «rad») va sahifadagi «To'lov o'tmadi» fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ Tayanch 1.3: «rad — yoziladi, Pro o'zgarmaydi, ilova «To'lov o'tmadi» ko'rsatadi». Bu darsda Pro va ilova yo'q — «hech narsa ochilmaydi», «To'lov o'tmadi» — mashq sahifasida (TAYANCHGA SAVOL 6). Rad yozilishining sababi (QIzoh) — TAYANCHGA SAVOL 6.
  2-qadam 7-ekrandagi 3-shartni sahnada qaytaradi: takror tekshiruvi rad xabarini ham ushlaydi.

## 10 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol
- Savol: **Tashkilotchining to'lovi o'tmadi. Mentor misolida `tolovlar` da nima bo'ladi?**
  - Hech qanday yangi qator qo'shilmaydi
  - ✔ Yangi qator qo'shiladi, holati «rad»
  - Yangi qator qo'shiladi, holati «tolandi»
  - Oxirgi to'langan qator o'chib ketadi
- Kalit: **B** (index 1). To'rttalasi `tolovlar` dagi o'zgarishni aytadi; «Yangi qator qo'shiladi» ikki variantda, ««…»» ham ikkitasida (shakl-telli yo'q).
- To'g'ri izohi: Rad xabari ham yoziladi — holati «rad», hech narsa ochilmaydi.
- Xato izohlari (≤60):
  - A: Xabar keldi, imzosi mos — u qayerga yozildi? (44)
  - C: Sahifada «To'lov o'tmadi» chiqqan edi — holat qaysi? (52)
  - D: Oldingi to'lov boshqa raqam — unga hech kim tegmaydi. (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Savol tashkilotchi nuqtai nazaridan (sinf 8); «Mentor misolida» — boshqa loyihada rad yozilmasligi ham mumkin (A varianti umumiy hayotda yolg'on deb aytilmaydi, izohi shu misolning faktini eslatadi).

## 11 · Mashq va haqiqiy xizmat  ← QTushuncha (bashorat + ikki holat + 3 karta)
- Eyebrow: Tushuncha · test rejim
- Sarlavha: **Haqiqiy to'lov xizmatida nima boshqacha?** (40)
- Mentor (bosqichga qarab):
  - boshida: Tepadagi «Mashq to'lov» va «Haqiqiy xizmat» ni almashtirib ko'ring.
  - ikkalasi ko'rilgach: Endi pastdagi uch kartani bittadan oching.
- Bashorat (ballsiz; tanlangach ixcham qator): **Bu darsdagi mashq to'lovda to'lov xizmati qayerda?** · Boshqa kompaniya serverida · Backend'ingizning o'zida · Telefoningizning ichida
- Sahna: telefon · To'lov xizmati · Backend; sahna ustida ikki nomli tugma (§209, bittasi tanlangan): «Mashq to'lov» · «Haqiqiy xizmat». Sahna ostida uch yopiq karta (U-013: «›», bosilgach ✓), har biri nomi o'z rangida, logotipsiz: **Payme** · **Click** · **Stripe**.
  Qadam belgilari: 1 Ikkalasini ko'ring · 2 Uch kartani oching.
- **Harakat → Vizual o'zgarish:**
  1. «Mashq to'lov» → «To'lov xizmati» tuguni Backend ichiga sirg'alib kiradi: Backend ichida ikki qism — «Mashq to'lov» sahifasi (`GET /tolov-mashq`) va `POST /tolov/webhook`; ikkalasining ustida bitta qulf qatori `TOLOV_KALITI · .env`. Telefon sahifasi ostida qator «Karta so'ralmaydi, pul yechilmaydi.»
     Nom qatori (bitta): Real pul yechilmaydigan to'lov holati — test rejim; bu kursda u mashq to'lov bilan.
  2. «Haqiqiy xizmat» → tugun Backend'dan chiqib, alohida tugunga aylanadi: «boshqa kompaniya serveri»; telefondagi sahifa kulrang «xizmatning o'z sahifasi» bo'ladi (karta maydonlari chizilmaydi — faqat yorliq «karta ma'lumoti shu yerda qoladi»); konvert endi o'sha serverdan Backend'ga uchadi.
  3. Kartalar (bittadan ochiladi; har kartada ikki qator — rasmiy fakt, tayanch 6). Ochilgan kartaning fakti sahnada jonlanadi: xizmat tuguni shu nom bilan, o'z rangida (logotipsiz) ataladi va konvert shu faktni ko'rsatadi —
     Payme: javob konverti yo'lda so'nadi, xuddi shu so'rov ikkinchi marta uchadi · Click: ketma-ket ikki konvert «Prepare» va «Complete» · Stripe: bitta xabar Backend'ga ikki marta yetadi:
     - **Payme** · ostida kulrang «O'zbekistondagi to'lov xizmati»:
       Javob yo'qolsa, Payme xuddi shu so'rovni qayta yuboradi; summa tiyinda keladi. ·
       Kassa faqat yuridik shaxs yoki YaTT (yakka tartibdagi tadbirkor) uchun ochiladi.
     - **Click** · ostida kulrang «O'zbekistondagi to'lov xizmati»:
       Click ikki so'rov yuboradi — Prepare va Complete; har birida maxfiy kalit qo'shib hisoblangan imzo bor. ·
       To'lov allaqachon o'tgan bo'lsa, Backend «Already paid» deb javob beradi.
     - **Stripe** · ostida kulrang «xorijdagi to'lov xizmati»:
       Bitta xabar bir necha marta kelishi mumkin — Stripe ishlangan xabar raqamlarini yozib qo'yishni maslahat beradi. ·
       Hisob ochiladigan davlatlar ro'yxatida O'zbekiston yo'q.
- Natija qatori: «Taxminingiz ✕ — aslida: Backend'ingizning o'zida» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Haqiqiy xizmatda sahifa va xabar boshqa kompaniya serveridan keladi; takror xabar u yerda ham bor. (98)
- Qator (`QIzoh`, xulosadan keyin, bitta — TOLOV-q1 A, so'zma-so'z): Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan; bu kursda emas.
- Tugadi (199): ikki nomli tugma va kartalar ixcham qatorga yig'iladi («Payme ✓ · Click ✓ · Stripe ✓»), sahna «Haqiqiy xizmat» holatida fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ko'ring va oching (N/5) → Davom etish
- O'qituvchi eslatmasi: Payme Business — JSON-RPC 2.0, Basic-auth (HMAC emas), so'rovlar faqat Payme IP manzillaridan; sandbox kaliti (TEST_KEY) — merchant kabinetidagi veb-kassada. Click imzosi — `sign_string` (md5). Stripe — `Stripe-Signature` (HMAC SHA-256).
  Uchalasida «imzo» bir ma'noda: xabar xizmatdan kelganini ko'rsatadigan belgi (Payme'da bu ishni Basic-auth va IP ro'yxati qiladi — so'rashsa). Komissiya aytilmaydi (rasmiy narx topilmagan). Qonun: FK 27-modda — 14–18 yoshli bitimni ota-onaning yozma roziligi bilan tuzadi (lex.uz/docs/-111189).
✎ Brend — o'z rangida, logotipsiz, tanish sahnada (xizmat tuguni o'sha nomni oladi, fakt konvert bilan jonlanadi — TAQIQLAR 0); karta faqat fakt matni. To'lov formasi va karta maydoni hech qayerda chizilmaydi (TAQIQLAR 1). Payme rangi — 9-Modul 1-darsidagi maket rangi (vizual bosqichda). Brend izohi kartada bir marta (S-018).
  «Prepare va Complete» — Click hujjatidagi nomlar (T-033: tarjima qilinmaydi). «Already paid» — Click xato kodi `-4`, raqami o'quvchiga aytilmaydi. Telegram `secret_token` — 4-ekran O'qituvchi eslatmasida.

## 12 · Mentor sxemasi  ← QTushuncha (bashorat + 5 qator, bittadan)
- Eyebrow: Tushuncha · sxema
- Sarlavha: **To'lov boshidan oxirigacha kim kimga yozadi?** (44)
- Mentor: Har kartada kim nima qilishini o'qing va bu ish kimga yetib borishini tanlang — qator jadvalga tushadi.
- Bashorat (ballsiz; tanlangach ixcham qator): **To'lov o'tgach, ilova buni qayerdan biladi?** · To'lov xizmatidan · Backend'dan qayta so'rab · Telefonning o'zidan
- Chap — `TOLOV_SAHNA` (telefon · To'lov xizmati · Backend; telefon ichida kichik «ilova» va «brauzer» yorliqlari) — joriy qatorga mos tugun halqada.
- O'ng — sxema jadvali: to'q sarlavha qatori «Mentor sxemasi · n / 5» (E 45 — jadval «ma'lumot» ko'rinishida), ustunlar Kim · Nima qiladi · Kimga; qatorlar hali yo'q.
  Jadval ostida joriy karta — **bittadan** (SABOQ 9, 13; oq, accent chegarali — bosiladigan): «Kim» va «Nima qiladi» matni, to'rt variant (har kartada bir xil tartibda): «Brauzer» · «To'lov xizmati» · «Backend» · «Ilova».
  Kartalar (A-bo'lim 4 jadvali, aynan): 1 Ilova — «To'lovga o'tish» bosilganda to'lov sahifasini ochadi → Brauzer · 2 Tashkilotchi — to'lov sahifasida to'laydi yoki rad etadi; karta ma'lumoti faqat xizmatda → To'lov xizmati ·
  3 To'lov xizmati — to'lov xabarini yuboradi: `POST /tolov/webhook` → Backend · 4 Backend — imzoni tekshiradi, to'lovni bir marta yozadi, Pro muddatini uzaytiradi, `200` qaytaradi → To'lov xizmati · 5 Ilova — Pro holatini qayta so'raydi: `GET /men` → Backend.
- **Harakat → Vizual o'zgarish:** variant →
  - to'g'ri → sahnada shu yo'l bo'ylab konvert uchadi (1: telefonda ilova ustidan brauzer oynasi ochiladi · 2: telefondan xizmatga · 3: xizmatdan Backend'ga · 4: Backend'dan xizmatga `200` · 5: telefondan Backend'ga `GET /men` va javob qaytadi) →
    qator jadvalga sirg'alib kiradi (~1 s yashil), hisoblagich oshadi, keyingi karta chiqadi;
  - boshqa variant → karta bir marta silkinadi, bir qator (`QXato`, ≤60): Kartani qayta o'qing: bu ish kimga yetib boradi? (48)
- Nom qatori (5/5 dan keyin, bitta): Kim kimga nima yuborishi yozilgan jadval — to'lov oqimi sxemasi.
- Natija qatori: «Taxminingiz ✕ — aslida: Backend'dan qayta so'rab» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Mentor sxemasida Backend javobni xizmatga qaytaradi; ilova esa yangi holatni Backend'dan o'zi so'raydi. (103)
- Qator (`QIzoh`, xulosadan keyin, bitta): Sxema — reja: bugun to'lov xabari va uning tekshiruvi quriladi; Pro va ilova hali o'zgarmaydi.
- Tugadi (199): karta yopiladi, to'liq jadval butun enga (sahna kichik, chapda); vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qatorlarni to'ldiring (N/5) → Davom etish
✎ Tayanch 1.3 sxemasi «X → Y → Z» shaklida — bu yerda uch ustunga ajratildi (`pm-m11d3-oqim` shakli; TAYANCHGA SAVOL 12). «To'lovga o'tish» va `GET /men` — tayanch 1.3 sxemasidagi nomlar; Pro — Mentor modeli (tayanch 1.0); QIzoh ularning bugun qurilmasligini halol aytadi (keyingi dars va'da qilinmaydi).
  4-qator — o'qitiladigan nuqta: Backend javobi xizmatga boradi, ilovaga emas; 5-qator — ilova o'zi so'raydi (12-Modulning «ilova Backend'dan qayta so'raydi» naqshi).

## 13 · O'z sxemangiz  ← QMustaqil (bitta karta ketma-ket — SABOQ 29)
- Eyebrow: Mustaqil ish · sxema
- Sarlavha: **Mahsulotingiz uchun to'lov oqimi sxemasini yozing.** (50)
- Mentor: 2-darsda tanlagan modelingizdan boshlang: kim to'laydi va to'lovdan keyin nima ochiladi — har ishga bitta qator.
- Tepada ixcham chiziq (birinchi qator tayyor bo'lgach): ✓ qatorlar, joriysi accent. Bir vaqtda bitta katta karta — uch maydon, **yorliq input ichida** (E 43): doimiy raqam + qisqa savol:
  1 · Kim? · 2 · Nima qiladi? · 3 · Kimga yetib boradi?
  Karta ostida bir qatorda: «Qator tayyor» (asosiy — qatorni yopadi) · «Bekor qilish» (ikkinchi; faqat qator bor bo'lsa) · o'ngda «Yordam». Karta yopilgach: «Saqlash» (asosiy) · «+ Yana qator» (ikkinchi; ko'pi bilan 6) · o'ngda «Yordam».
- Yordam (ochiladigan): **Mentor misoli** — A-bo'lim 4 jadvalining besh qatori (kim · nima qiladi · kimga).
  Bu kursda sxemada kamida uch qator bo'ladi: to'lov xabari, Backend tekshiruvi va natijani kim so'rashi. Odamlar roli bilan yoziladi («tashkilotchi», «xaridor») — ism emas.
  Modelingizda pulni boshqa kompaniya to'lasa (reklama, B2B) — o'sha kompaniyani «Kim» qatoriga yozing; sxema shakli o'zgarmaydi.
- Shart xabari («Saqlash» bosilganda, ≤60): Kamida uch qator kerak; har qatorda uchta katak to'lsin. (56)
- «Saqlash» → `pm-m11d3-oqim` = `{ qatorlar: [{ id, kim, nima, kimga }], test: { imzo: null, takror: null, rad: null }, savedAt }` (`id` — `q1`, `q2`…, yaratilganda beriladi, qayta ishlatilmaydi; tartib o'zgarmaydi; kalit oldin bor bo'lsa `test` qiymatlari saqlanib qoladi).
- **Harakat → Vizual o'zgarish:** «Qator tayyor» → karta ixcham qatorga yig'ilib tepadagi ro'yxatga tushadi (kim · kimga — uzun matn qisqartiriladi); keyingi karta bo'sh ochiladi. «Saqlash» → hammasi bitta ixcham qator: «Sxema · N qator ✓» (SABOQ 17).
- Xulosa (saqlagach): Sxemangiz saqlandi — amaliyotda u README'ga ko'chiriladi. (57)
- Tugma (pastki): Saqlang → Davom etish
✎ Kalit oldin bor bo'lsa — qatorlar to'ldirilgan holda ochiladi, o'zgartirsa bo'ladi. 3–6 qator — tayanch 8. «2-darsda tanlagan modelingiz» — o'quvchi o'zi eslaydi; `pm-m11d2-model` o'qilmaydi (TAYANCHGA SAVOL 13). Kalitga ism yozilmaydi — maydonlar rol bilan.

## 14 · Ishlash tartibi (final)  ← QTartib (ball · sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **To'lov xabari qaysi tartibda ishlanadi?** (39)
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartibda; ekranda aralash; sudrash yoki bosish — 188; bo'lak ko'rinishi — E 44):
  1. Tashkilotchi «To'lash (mashq)» ni bosadi
  2. To'lov xizmati to'lov xabarini yuboradi
  3. Backend imzoni tekshiradi
  4. Backend to'lov raqami yangiligini tekshiradi
  5. Backend to'lovni `tolovlar` ga yozadi
  6. Backend xizmatga `200` qaytaradi
- Uyalar: 6 ta, har birida faqat raqam va «bu yerga qo'ying» (tartibni ochmaydi).
- Xato: Tartib mos emas — bo'lakni bosib qaytaring. (43)
- Xulosa (yechilgach, bir marta): Bu misolda avval imzo, keyin takror tekshiriladi; `200` esa yozib bo'lingandan keyin qaytadi. (93)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
✎ O'qitiladigan nuqtalar: 3 → 4 (imzo birinchi — soxta xabar jadvalga tegmasin; tayanch 1.3 tartibi) va 5 → 6 (Mentor misolida `200` yozuvdan keyin; yozuv chiqmasa `200` ketmaydi — xizmat qayta yuboradi). Ikkalasi «bu misolda» — boshqa loyihalarda ish keyinroq navbat bilan bajarilishi mumkin (Stripe «avval tez `2xx`» maslahati — Manbalar 3; RECAPS 5 sinfga savoli).
  Rad holati bo'laklarda yo'q: final oqimni so'raydi, rad — 9–10-ekranlar.

## 15 · Amaliyot 1 — to'lov xabari uchun yo'l va jadval  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈22 daq)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **Backend'ingiz to'lov xabarini tekshirib qabul qilsin.** (53)
- Mentor: Talab tayyor — ikki joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
- Model (tayanch 4, 12-Modul 9.36): to'rt qadamning hammasi o'quvchining o'z repo'sida, o'z mahsulotida; Mentor misoli — namuna (o'ngda kutilgan natija, `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq talab). 5-qadam yo'q.
  Talab zinapoyasi A1: tayyor talab + 2 joy. Trek: bu blok ikkala trekda bir xil — o'zgarish faqat `backend/` da (A-bo'lim 10).
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»
     `backend/.env` ga yangi qator yozing: `TOLOV_KALITI=` va o'zingiz o'ylagan uzun kalit — harf va raqamlar; boshqa joyda ishlatadigan parolingiz emas. Shu nom va qiymatni Render'da xizmatingizning Environment bo'limiga qo'shib saqlang.
     **Kalitni agentga, chatga, README'ga va skrinshotga yozmang** — agent faqat uning nomini biladi. Bu blok ikkala trekda bir xil: o'zgarish faqat `backend/` da.
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — yangi jadval `tolovlar` va yangi yo'l `POST /tolov/webhook`.
     > Nima qilsin: `tolovlar` ustunlari — `id`, `tolov_raqami` (noyob: bitta raqam jadvalda bir marta), {to'lovchi hisobi}, `summa` (so'mda), `holat` (`tolandi` yoki `rad`), `yaratilgan`. Jadvalni loyihadagi avvalgi jadvallar qanday yaratilgan bo'lsa, shunday yarat.
     > `POST /tolov/webhook` tanasi — `{ tolovRaqami, holat, summa }` va to'lovchi hisobi; sarlavha `X-Imzo`. Tartib: 1) imzoni tekshir — HMAC SHA-256, so'rovning xom tanasi bo'yicha, kalit `.env` dagi `TOLOV_KALITI`; imzolarni `timingSafeEqual` bilan solishtir; imzo yo'q yoki mos kelmasa — `401` va hech narsa yozma; `TOLOV_KALITI` bo'sh bo'lsa ham hech bir xabarni qabul qilma.
     > 2) shu `tolovRaqami` jadvalda bor bo'lsa — yozma, `200 { takror: true }` qaytar. 3) aks holda qatorni `holat` bilan yoz va `200 { ok: true }` qaytar; `rad` bo'lsa ham yoziladi, boshqa hech narsa o'zgarmaydi.
     > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin. `TOLOV_KALITI` qiymatini kodga, logga va README'ga yozma — faqat `.env` dan o'qi; `backend/.env.example` va README'dagi o'zgaruvchilar ro'yxatiga nomini qiymatsiz qo'sh. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {to'lovchi hisobi} — «masalan: `oyinchi_id` — `oyinchilar` jadvalidagi hisob (tanada `oyinchiId`)»
     - {avvalgidek ishlashi kerak bo'lgan ishlar} — «masalan: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `backend/` — yangi jadval `tolovlar` va yangi yo'l `POST /tolov/webhook`.
     > Nima qilsin: `tolovlar` ustunlari — `id`, `tolov_raqami` (noyob: bitta raqam jadvalda bir marta), `oyinchi_id` — `oyinchilar` jadvalidagi hisob (tanada `oyinchiId`), `summa` (so'mda), `holat` (`tolandi` yoki `rad`), `yaratilgan`. Jadvalni loyihadagi avvalgi jadvallar qanday yaratilgan bo'lsa, shunday yarat.
     > `POST /tolov/webhook` tanasi — `{ tolovRaqami, holat, summa, oyinchiId }`; sarlavha `X-Imzo`. Tartib: 1) imzoni tekshir — HMAC SHA-256, so'rovning xom tanasi bo'yicha, kalit `.env` dagi `TOLOV_KALITI`; imzolarni `timingSafeEqual` bilan solishtir; imzo yo'q yoki mos kelmasa — `401` va hech narsa yozma; `TOLOV_KALITI` bo'sh bo'lsa ham hech bir xabarni qabul qilma.
     > 2) shu `tolovRaqami` jadvalda bor bo'lsa — yozma, `200 { takror: true }` qaytar. 3) aks holda qatorni `holat` bilan yoz va `200 { ok: true }` qaytar; `rad` bo'lsa ham yoziladi, boshqa hech narsa o'zgarmaydi.
     > Nima buzilmasin: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar avvalgidek ishlasin. `TOLOV_KALITI` qiymatini kodga, logga va README'ga yozma — faqat `.env` dan o'qi; `backend/.env.example` va README'dagi o'zgaruvchilar ro'yxatiga nomini qiymatsiz qo'sh. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "tolov webhook"`, `git push`.
     Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin).
     Kutayotganda agentdan yozgan kodidagi uch joyni ko'rsatishni so'rang — darsda ko'rgan tartibni o'z loyihangizda topasiz (SABOQ 52; «Nusxalash» bilan):
     > Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: imzo tekshiriladigan qator, to'lov raqami jadvalda bor-yo'qligi tekshiriladigan qator va qator yoziladigan joy. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabning har gapini o'zingiz ko'ring. Mentor misolida:
     (1) Agent ko'rsatgan uch qatorni oching: tartib — avval imzo, keyin to'lov raqami, keyin yozuv.
     (2) Terminalda `git grep -n "TOLOV_KALITI"`: natijada faqat nom bo'lsin (`process.env.TOLOV_KALITI`, `.env.example` va README qatori). Kalitning o'zi chiqsa — agentga «Kalit qiymatini koddan olib tashla, faqat `.env` dan o'qi.» deng, `.env` va Render'da kalitni yangisiga almashtiring.
     (3) Neon SQL Editor'da `SELECT * FROM tolovlar;` — jadval bor va bo'sh: `id`, `tolov_raqami`, `oyinchi_id`, `summa`, `holat`, `yaratilgan` ustunlari ko'rinadi. Jadval yo'q bo'lsa — Render'da yangi versiya tugaganini ko'ring, keyin agentga: «`tolovlar` jadvali Neon'da yo'q. Avvalgi jadvallar qanday yaratilgan bo'lsa, shunday yarat va nima qilganingni ayt.»
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: fayl kartasi — `backend/src/tolov/…` (yangi papka: jadval va yo'l) · `backend/src/main.ts` (o'zgardi — xom tana) · `backend/.env.example` (+ `TOLOV_KALITI=`, qiymatsiz) · `README.md` (o'zgaruvchilar: + `TOLOV_KALITI`);
  ostida terminal kartasi — `git grep -n "TOLOV_KALITI"` natijasi: uch qator, hammasida faqat nom; ostida Neon jadvali `tolovlar` — olti ustun, «0 qator».
- Hammasi bajarilgach (yashil): `POST /tolov/webhook` va `tolovlar` tayyor — endi ularni mashq to'lov bilan tekshirasiz. (88)
- Qator (`QIzoh`, natija ostida, bitta): Kodni agent yozdi — to'g'ri ishlashini 2-amaliyotdagi uch tekshiruv ko'rsatadi.
- Pastki qator (kichik; darsda bir marta — SABOQ 39): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-03-done` —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` ga o'z qiymatlaringizni yozasiz (`TOLOV_KALITI` ham).
- Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadamning (3) Neon tekshiruvi uyda; 3-qadamdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi (12-Modul 9.36 h).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: `{to'lovchi hisobi}`, `{avvalgidek ishlashi kerak bo'lgan ishlar}` — oldindan bo'sh, kulrang «masalan» (`pm-m9d5-prd` bu darsda o'qilmaydi — TAYANCHGA SAVOL 17). Texnik so'zlar promptda (HMAC SHA-256, xom tana, `timingSafeEqual`) — agent uchun; o'quvchi ularni 4-ekranda ko'rgan hisob bilan bog'laydi (TAYANCHGA SAVOL 9, 10).
  Agentning «tayyor» degani — da'vo (sinf 5); bu blokda o'quvchi kod tartibini, kalit yo'qligini va jadvalni o'zi ko'radi, to'g'ri ishlashini — A2. Push odati — `git status` → `git add <fayl>` (tayanch 3).
- O'qituvchi eslatmasi: xom tana — NestJS `rawBody: true` (Manbalar 1): agent `main.ts` ni o'zgartiradi; o'quvchi so'rasa — «imzo xabar matnining o'zidan hisoblanadi, shuning uchun matn o'zgarmasdan olinadi». Jadval yaratilishi — 11-Modul loyihasidagi usulga qarab (agent aytadi).
  Kalit qiymati ekranda, chatda yoki loyihada ko'rinib qolsa — yangisi qo'yiladi (`.env` va Render); eskisi ishlatilmaydi.

## 16 · Amaliyot 2 — mashq to'lov va uch tekshiruv  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈16 daq)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **Mashq to'lov bilan imzo, takror va radni tekshiring.** (52)
- Mentor: Sahifa xabarni Backend'da imzolaydi — kalit brauzerga chiqmaydi; «1 · Ochish»dan boshlang.
- Talab zinapoyasi A2: tayyor talab + 3 joy (`{nima uchun to'lov}` — o'quvchi yozadi; `{sxema qatorlari}` — mustaqil ishdan oldindan; `{hozirgi holat}` — o'quvchi yozadi). Ikkala trekda blok bir xil.
- Qadamlar (o'z repo'ngizda):
  1. **Ochish** — 1-amaliyotdagi yo'l Render'da ishlab turibdi. Neon SQL Editor'da o'z hisobingiz raqamini toping: `SELECT id FROM oyinchilar WHERE login = '{loginingiz}';` (jadval va ustun nomi — mahsulotingizdagidek).
     Topa olmasangiz — agentdan so'rang: «Foydalanuvchilar jadvalida {loginim} hisobining `id` sini ayt. Hech narsani o'zgartirma.» Mustaqil ishdagi sxemangiz pastdagi talabga o'zi qo'yilgan — o'qib chiqing.
     Trekka qarab bir gap: mobil trek — sahifani telefoningiz brauzerida ochasiz · web-trek — kompyuteringiz brauzerida ochasiz (ikkalasida tekshiruv bir xil).
  2. **Prompt** — qavslarni tekshiring va to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — yangi sahifa `GET /tolov-mashq` (oddiy HTML, Backend'ning o'zi beradi) va `README.md` — yangi «To'lov» bo'limi.
     > Nima qilsin: sahifa manzildagi `oyinchi` va `summa` ni oladi. Sahifada: sarlavha «Mashq to'lov», ostida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.», keyin «{nima uchun to'lov}» va summa. Karta yoki boshqa to'lov ma'lumoti so'raladigan maydon bo'lmasin; Payme yoki Click nomi va ko'rinishi ishlatilmasin.
     > To'rt tugma: «To'lash (mashq)» — yangi to'lov raqami, holat `tolandi` · «Rad etish (mashq)» — yangi raqam, holat `rad` · «Ikki marta yuborish» — bitta raqam bilan bir xil xabar ikki marta · «Imzosiz yuborish» — `X-Imzo` sarlavhasisiz.
     > Tugma bosilganda xabarni Backend'da yasasin va `TOLOV_KALITI` bilan imzolasin — kalit brauzerga chiqmasin; keyin xabarni o'zining `POST /tolov/webhook` manziliga haqiqiy so'rov qilib yuborsin. Sahifada har yuborishning javobi ko'rinsin: holat kodi va tanasi.
     > `README.md` dagi «To'lov» bo'limiga pastdagi qatorlarni uch ustunli jadval qilib yoz: kim · nima qiladi · kimga. So'zlarimni o'zgartirma, qator qo'shma.
     > {sxema qatorlari}
     > Jadval ostiga bitta qator yoz: {hozirgi holat}
     > Nima buzilmasin: `POST /tolov/webhook` dagi tekshiruvlar o'zgarmasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar: {nima uchun to'lov} — bo'sh, kulrang «masalan: Maydon Jamoa — Pro, 30 kun» · {sxema qatorlari} — `pm-m11d3-oqim.qatorlar` dan oldindan yoziladi (har qator bir satr: «kim | nima qiladi | kimga»); saqlanmagan bo'lsa — bo'sh, kulrang
     «masalan: To'lov xizmati | to'lov xabarini yuboradi: POST /tolov/webhook | Backend» · {hozirgi holat} — o'quvchi yozadi: «masalan: Hozircha to'lov xabari qabul qilinadi va yoziladi; boshqa hech narsa o'zgarmaydi. Test rejim: pul yechilmaydi.»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `backend/` — yangi sahifa `GET /tolov-mashq` (oddiy HTML, Backend'ning o'zi beradi) va `README.md` — yangi «To'lov» bo'limi.
     > Nima qilsin: sahifa manzildagi `oyinchi` va `summa` ni oladi. Sahifada: sarlavha «Mashq to'lov», ostida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.», keyin «Maydon Jamoa — Pro, 30 kun» va summa. Karta yoki boshqa to'lov ma'lumoti so'raladigan maydon bo'lmasin; Payme yoki Click nomi va ko'rinishi ishlatilmasin.
     > To'rt tugma: «To'lash (mashq)» — yangi to'lov raqami, holat `tolandi` · «Rad etish (mashq)» — yangi raqam, holat `rad` · «Ikki marta yuborish» — bitta raqam bilan bir xil xabar ikki marta · «Imzosiz yuborish» — `X-Imzo` sarlavhasisiz.
     > Tugma bosilganda xabarni Backend'da yasasin va `TOLOV_KALITI` bilan imzolasin — kalit brauzerga chiqmasin; keyin xabarni o'zining `POST /tolov/webhook` manziliga haqiqiy so'rov qilib yuborsin. Sahifada har yuborishning javobi ko'rinsin: holat kodi va tanasi.
     > `README.md` dagi «To'lov» bo'limiga pastdagi qatorlarni uch ustunli jadval qilib yoz: kim · nima qiladi · kimga. So'zlarimni o'zgartirma, qator qo'shma.
     > Ilova | «To'lovga o'tish» bosilganda to'lov sahifasini ochadi | Brauzer
     > Tashkilotchi | to'lov sahifasida to'laydi yoki rad etadi; karta ma'lumoti faqat xizmatda | To'lov xizmati
     > To'lov xizmati | to'lov xabarini yuboradi: POST /tolov/webhook | Backend
     > Backend | imzoni tekshiradi, to'lovni bir marta yozadi, Pro muddatini uzaytiradi, 200 qaytaradi | To'lov xizmati
     > Ilova | Pro holatini qayta so'raydi: GET /men | Backend
     > Jadval ostiga bitta qator yoz: Hozircha: to'lov xabari `POST /tolov/webhook` da qabul qilinadi va `tolovlar` ga yoziladi; Pro va ilova hali o'zgarmaydi. Test rejim: pul yechilmaydi.
     > Nima buzilmasin: `POST /tolov/webhook` dagi tekshiruvlar o'zgarmasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; `git add <fayl>` → `git commit -m "mashq tolov"` → `git push`. Render'da yangi versiya tugashini kuting.
     Kutayotganda agentga (SABOQ 52; «Nusxalash» bilan):
     > Mashq sahifasining kodida ikki joyni fayl nomi va qator raqami bilan ko'rsat: xabar imzolanadigan qator va xabar `POST /tolov/webhook` ga yuboriladigan qator. Kalit brauzerga chiqmasligini qaysi qator ko'rsatadi — bitta gap bilan ayt. Kodni o'zgartirma.
     Render tayyor bo'lgach brauzerda oching: `{Backend manzili}/tolov-mashq?oyinchi={hisob raqami}&summa={summa}` — masalan: `maydon-jamoa-….onrender.com/tolov-mashq?oyinchi=7&summa=10000`.
     Sahifa birinchi ochilishda bir daqiqagacha kechikishi mumkin: bepul Backend uxlab qolgan bo'lsa, uyg'onadi. Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — uch tekshiruv, bittadan; har biridan keyin tekshiruv kartasida «Kutilganidek» yoki «Boshqacha» ni tanlang:
     (1) **Imzo** — «Imzosiz yuborish»: sahifada javob `401` bo'lishi kerak; Neon'da `SELECT * FROM tolovlar;` — yangi qator yo'q.
     (2) **Takror** — «Ikki marta yuborish»: birinchi javob `200 { ok: true }`, ikkinchisi `200 { takror: true }`; `tolovlar` da shu raqam bilan bitta qator.
     (3) **Rad** — «Rad etish (mashq)»: javob `200`; `tolovlar` da yangi qator, holati `rad`.
     «Boshqacha» bo'lsa — agentga: «{tekshiruv}: kutganim {nima kutdim}, bo'ldi {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.» → push → Render → o'sha tugma bilan qayta tekshiring.
     Oxirida README'dagi «To'lov» bo'limini sxemangiz bilan solishtiring: so'zlar bir xilmi, qator qo'shilmaganmi. Farq bo'lsa — agentga «Faqat README.md dagi «To'lov» bo'limini men yozgandek qil.», keyin `git add README.md` → `git commit` → `git push`.
- Tekshiruv kartasi (chapda, 4-qadam ichida; har tekshiruvga bittadan): nima bosiladi · nima kutiladi · tugmalar «Kutilganidek» · «Boshqacha». Saqlanadi: `pm-m11d3-oqim.test.imzo` / `.takror` / `.rad` — har tugma bosilganda (A-bo'lim 12).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: brauzer oynasi `maydon-jamoa-….onrender.com/tolov-mashq` — «Mashq to'lov» sahifasi (sarlavha, «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.», «Maydon Jamoa — Pro, 30 kun · 10 000 so'm» + yorliq «Mentorning taxmini», to'rt tugma);
  ostida javoblar ro'yxati: «Imzosiz yuborish — `401`» · «Ikki marta yuborish — `200 { ok: true }` · `200 { takror: true }`» · «Rad etish (mashq) — `200 { ok: true }`»; yonida Neon jadvali `tolovlar` — ikki qator: «… · tolandi» · «… · rad».
  Pastda README ko'rinishi: «To'lov» · besh qatorli jadval va ostidagi halol qator (A-bo'lim 4).
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - uchalasi «Kutilganidek» — Uch tekshiruv o'tdi: imzosiz `401`, takror bitta qator, rad yozildi. (68)
  - birortasi «Boshqacha» — Tekshiruv tugamagan: «Boshqacha» chiqqanini tuzatib, qayta tekshiring. (70)
- Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadam uyga vazifaning 1-bandi; «Davom etish» 2-qadamdan keyin ochiladi (SABOQ E 55). Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon (bonus): Webhook Tested — 4-qadam «Bajardim»ida, uchala tekshiruv belgilangan bo'lsa (natijasidan qat'i nazar — tavsif qilingan ishni aytadi).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: tekshiruvni o'quvchi o'zi qiladi — agent faqat sahifani yozadi va xato bo'lsa tuzatadi (sinf 10). «Kutilganidek» — o'quvchi o'z ko'zi bilan ko'rgani (ish fakti); agentning «ishlaydi» degani yozilmaydi.
  `tolovlar` dagi qatorlar — mashq: bu kursda real to'lov yo'q, ularni o'chirish shart emas (sanoqqa tushmaydi). Mashq sahifasining ichki yo'li va o'z manziliga so'rov — TAYANCHGA SAVOL 11. Hisob raqami — o'quvchining o'z hisobi (TAYANCHGA SAVOL 16).
- O'qituvchi eslatmasi: mashq sahifasi va tugmalari faqat o'quvchining o'z Backend'ini chaqiradi; boshqa odamning Backend'iga yoki haqiqiy to'lov xizmatiga hech narsa yuborilmaydi. Sahifa ochiq manzilda turadi — pul yo'q, shuning uchun bu darsda xavf yo'q (4-dars uchun savol — TAYANCHGA SAVOL 23).

## 17 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + final + 2 blok «Bajardim» (`PRACTICE_BASE`). QKod (7) va QMustaqil (13) — `practice: -1`.
- Savol yorliqlari (`Q_LABELS`): 3 — «1 — Xabarni kim yuboradi» · 5 — «2 — Imzosiz xabar» · 8 — «3 — Takror xabar» · 10 — «4 — Rad etilgan to'lov» · 14 — «Yakuniy — ishlash tartibi»

## 18 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi ingichka accent chegarada, 3 marta yengil tebranadi, kattalashishsiz (E 49).
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun  ← QYakun (texnik darslar standarti, 192/204; SABOQ E 50)
- Yuqori yorliqlar: ✓ Uch tekshiruv o'tdi (faqat A2 da uchala tekshiruv «Kutilganidek»; aks holda yorliq yo'q) · {N}/5 to'g'ri
- Sarlavha (holatga qarab, P-046; sinf 6 — o'quvchi qilgan ishni aytadi, har holat rost — E 54):
  - A1 va A2 bajarilgan, uchala tekshiruv «Kutilganidek» — **To'lov xabari Backend'ingizda — uch tekshiruv o'tdi.** (52)
  - A1 va A2 bajarilgan, «Boshqacha» bor — **To'lov xabari yo'li bor — tekshiruvni tugatish qoldi.** (53)
  - A1 bajarilgan, A2 yo'q — **Yo'l va jadval tayyor — uch tekshiruv qoldi.** (44)
  - A1 bajarilmagan, sxema saqlangan — **Sxemangiz tayyor — to'lov xabari yo'lini qurish qoldi.** (54)
  - hech biri — **Webhook hali qurilmagan — qadamlarni uyda bajaring.** (51)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- «Bugungi asosiy fikr» qutisi yakunda yo'q (SABOQ E 50) — fikr A-bo'lim 2-bandida, darsning ichki o'qi.
- Endi siz bilasiz (5):
  - To'lov o'tganini Backend'ga to'lov xizmati xabar bilan aytadi — bu webhook.
  - Imzo xabar xizmatdan kelganini ko'rsatadi: Backend uni maxfiy kalit bilan qayta hisoblaydi.
  - Bitta to'lov xabari ikki marta kelishi mumkin, shuning uchun to'lov raqami bir marta yoziladi.
  - Rad etilgan to'lov ham yoziladi, lekin hech narsa ochilmaydi.
  - Test rejimda pul yechilmaydi; haqiqiy xizmatda sahifa va xabar boshqa kompaniya serveridan keladi.
- Uyga vazifa (`uyga`, karta: kim uchun — o'z mahsulotingiz · nechta — ikki ish · muddat — keyingi darsgacha):
  1. **Tugatish** — darsda ulgurmagan blokni bajaring: `tolovlar` da mashq to'lov qatorlari tursin, uchala tekshiruv belgilangan bo'lsin, README'da «To'lov» bo'limi bo'lsin.
  2. **Sxema** — sxemangizni mahsulotingizdagi haqiqiy tugma va ekran nomlari bilan solishtiring: nom farq qilsa — darsdagi sxema kartasida va README'da tuzating.
- Keyingi dars — «Narxni qanday belgilaysiz?»
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Signature Guard** — Imzosiz xabarga Backend nima qilishini topdingiz (5-ekran, 2-savol)
- **Counted Once** — Takror kelgan to'lov xabariga to'g'ri javobni topdingiz (8-ekran, 3-savol)
- **Declined Logged** — Rad etilgan to'lov qanday yozilishini topdingiz (10-ekran, 4-savol)
- **Webhook Tested** — Mashq to'lov bilan uch tekshiruvni o'zingiz o'tkazdingiz (16-ekran, 4-qadam «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 07.10: Signature Guard · Counted Once · Declined Logged · Webhook Tested — 0).

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta (S-026: kod qatori bor joyda kod, qolganida raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «To'lov xabarini xizmat yuboradi»
   - 1 · Tashkilotchi xizmatning sahifasida to'laydi.
   - Xizmat to'lov xabarini Backend manziliga o'zi yuboradi · `POST /tolov/webhook`
   - Backend «qabul qildim» deb javob beradi · `200`
   - Sinfga savol: Ilovaning «to'landi» degan gapiga ishonsak, nima bo'lishi mumkin?
2. 2-savol (5-ekran) — «Imzo»
   - Xizmat imzoni kalit bilan hisoblaydi · `createHmac('sha256', TOLOV_KALITI)`
   - Imzo sarlavhada keladi, kalit esa kelmaydi · `X-Imzo: 3f9a…`
   - Mos kelmasa — hech narsa yozilmaydi · `401`
   - Sinfga savol: Kalit README'ga yozilib qolsa, kim soxta xabar yasay oladi?
3. 3-savol (8-ekran) — «Takror xabar»
   - 1 · Javob yo'qolsa, xizmat o'sha xabarni qayta yuboradi.
   - Backend to'lov raqamini tekshiradi · `yozilganlar.includes(raqam)`
   - Takrorga ham javob, lekin yozuvsiz · `200 { takror: true }`
   - Sinfga savol: Takror xabarga `401` qaytarilsa, xizmat nima qiladi?
4. 4-savol (10-ekran) — «Rad etilgan to'lov»
   - To'lov o'tmasa ham xabar keladi · `holat: 'rad'`
   - Backend uni yozadi · `m-102 · rad`
   - 3 · Hech narsa ochilmaydi; sahifada «To'lov o'tmadi».
   - Sinfga savol: Rad yozuvi bo'lmasa, tashkilotchi «to'lovim qayerda?» desa, nima javob berasiz?
5. Final (14-ekran) — «Ishlash tartibi»
   - 1 · Bosish · 2 · To'lov xabari
   - 3 · Imzo · 4 · To'lov raqami yangimi
   - 5 · Yozuv · 6 · `200`
   - Sinfga savol: Backend `200` ni yozishdan oldin qaytarsa-yu, yozuv chiqmay qolsa, nima bo'ladi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| To'lov xizmati nima? | Pulni qabul qiladigan kompaniya | Masalan, Click va Payme |
| To'lov sahifasi nima? | Brauzerda ochiladigan, odam to'laydigan sahifa | Karta ma'lumoti faqat shu sahifada — Backend'ga kirmaydi |
| To'lov xabari nima? | To'lov xizmati Backend'ga yuboradigan xabar: to'landi yoki rad etildi | Texnik nomi — webhook; 7-Modulda botingiz Telegram xabarini shunday olardi |
| Mentor misolida to'lov xabari qayerga keladi? | `POST /tolov/webhook` | Tanada: `tolovRaqami`, `holat`, `summa`, `oyinchiId` |
| Imzo nima? | Xabar haqiqatan to'lov xizmatidan kelganini ko'rsatadigan belgi | Xizmat maxfiy kalit bilan hisoblaydi, Backend qayta hisoblab solishtiradi |
| Imzo mos kelmasa, Mentor Backend'i nima qiladi? | `401` qaytaradi, hech narsa yozmaydi | Imzo `X-Imzo` sarlavhasida keladi; kalitning o'zi xabarda yo'q |
| Takror xabar nima? | Bitta to'lov haqidagi xabarning ikki marta kelishi | Inglizchasi: idempotency. To'lov raqami bir marta sanaladi |
| Takror xabarga Backend nima javob beradi? | `200`, lekin ikkinchi qator yozilmaydi | `200` bo'lmasa, xizmat yana yuborardi |
| Rad etilgan to'lov nima? | To'lov o'tmagan holat | Yoziladi, lekin hech narsa ochilmaydi; sahifada «To'lov o'tmadi» |
| Test rejim nima? | Real pul yechilmaydigan to'lov holati | Inglizchasi: sandbox. Bu kursda — mashq to'lov bilan |
| `TOLOV_KALITI` qayerda turadi? | Faqat `.env` da va Render sozlamasida | Kodda faqat nomi; agentga, README'ga va skrinshotga yozilmaydi |
| To'lov oqimi sxemasida qaysi uch ustun bor? | Kim · nima qiladi · kimga | Mentor sxemasida besh qator |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. 7-Modulda botingiz yangi xabarni webhook bilan qanday olardi? ✔ Telegram o'zi manziliga yuborardi · Bot Telegram'dan qayta so'rardi · Foydalanuvchi qo'lda yuborardi · Render har daqiqa tekshirib turardi
2. Mentor sxemasida karta ma'lumoti qayerda qoladi? Backend'ning jadvalida · ✔ Faqat to'lov xizmatida · Ilovaning xotirasida · README faylining ichida
3. `X-Imzo` sarlavhasida nima keladi? `.env` dagi kalitning o'zi · Tashkilotchining paroli · ✔ Kalit bilan hisoblangan imzo · To'lovning summasi va sanasi
4. `TOLOV_KALITI` qiymatini qayerga yozasiz? README'ga, hamma ko'rib tursin · Kodga, alohida bitta qatorga · Agentga, promptning ichiga · ✔ `.env` va Render sozlamasiga
5. Imzo mos keldi. Bu nimani ko'rsatadi? ✔ Xabar to'lov xizmatidan kelgan · To'lov muvaffaqiyatli o'tgan · Summa narxga aynan to'g'ri keladi · Xabar birinchi marta kelgan
6. Javob yo'qolsa, Payme nima qiladi? Shu xabarni boshqa yubormaydi · ✔ Xuddi shu so'rovni qayta yuboradi · Yangi raqam bilan qayta yuboradi · Tashkilotchining ilovasiga yozadi
7. Stripe takror xabar haqida nimani maslahat beradi? Har xabarni ikki marta yozib qo'yishni · Xabarlarni tartib bilan kutishni · ✔ Ishlangan xabar raqamlarini yozishni · Takror xabarga `401` qaytarishni
8. Mentor Backend'i takror xabarni nimaga qarab taniydi? Xabardagi summaga qarab · To'lovchining ismiga qarab · Xabar kelgan vaqtga qarab · ✔ To'lov raqamiga qarab
9. Bu darsdagi mashq to'lov sahifasi qayerda turadi? ✔ Backend'ingizning ichida · Payme kompaniyasi serverida · Telefoningiz xotirasida · GitHub repo'ngiz sahifasida
10. Mashq to'lov sahifasi xabarni qayerda imzolaydi? Brauzerda, sahifaning o'zida · ✔ Backend'da, kodning o'zida · Telefonda, ilovaning ichida · GitHub'da, push qilingan paytda
11. Sxemadagi «Kimga» ustuni nimani aytadi? Kim to'lov qilganini · Qancha to'langanini · ✔ Ish kimga borishini · Qachon to'langanini
12. Mentor sxemasida ilova Pro holatini qayerdan biladi? To'lov xizmatining xabaridan · To'lov sahifasining o'zidan · Telefonga kelgan SMS'dan · ✔ Backend'dan qayta so'rab

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): to'lov xabari · webhook · `POST /tolov/webhook` · imzo · `X-Imzo` · `TOLOV_KALITI` · takror xabar · `tolov_raqami` · rad etilgan to'lov · `holat: 'rad'` · test rejim · mashq to'lov · `200` · `401` · `tolovlar` · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 20 ekran: hook · rule · exploration · test · exploration · test · exploration · practice(kod) · test · exploration · test · exploration ×2 · practice(mustaqil) · test(final, `scope: 'final'`) · practice(blok) ×2 · stats · flashcards · summary.
   `INLINE_KEYS`: s3 **2 (C)** · s5 **0 (A)** · s8 **3 (D)** · s10 **1 (B)** · s14 sentinel **0**; QKod (7), QMustaqil (13) va bloklar (15, 16) — `practice: -1`. `LESSON_META.lessonId` — `m11-03-v1`.
2. **Bitta manba (180):** `TOLOV_SAHNA` (telefon, xizmat tuguni holatlari: `alohida` · `backendIchida` · `telegram` · `boshqaKompaniya`; Backend: `tolovlar`, qulf qatori, chiroq, takror o'chirgichi) · `MASHQ_SAHIFA` (sarlavha, test qatori, mahsulot qatori, summa + yorliq, tugmalar) ·
   `NAMUNA_XABAR` (`m-101`, `tolandi`, `10000`, `oyinchiId: 7`, `X-Imzo: 7c1e…`) · `MENTOR_SXEMA` (A-bo'lim 4 jadvali, 5 qator: kim · nima · kimga) · `ISHLASH_TARTIBI` (6 bo'lak) · `XIZMAT_KARTALAR` (Payme · Click · Stripe: nom, izoh, ikki qator, sahna fakti) — 0–2, 4, 6, 9, 11, 12, 14–16-ekranlar va kartochka shundan o'qiydi.
3. **`TolovSahna`** komponenti: chapda telefon (≈170×272, yorliq ramka ustida; ichida brauzer — mashq sahifasi yoki 2-ekran 1-qadamda Telegram chati), o'rtada xizmat tuguni, o'ngda Backend tuguni (mini-jadval `tolovlar` — `tolov_raqami` · `holat`, hisoblagich; 4-ekrandan qulf qatori; 6-ekranda chiroq va o'chirgich);
   4-ekranda qo'shimcha «boshqa kompyuter» tuguni (noutbuk shakli). Konvert turlari: `xabar` (yopiq → ochiq: tana qatorlari + `X-Imzo`), `javob` (`200` · `401` · `200 { takror: true }`), `sorov` (`GET /men`, 12-ekran). Holat ranglari faqat D3 tokenlaridan (`ok`, `err`, `ink2`, `accent`).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: tw-tolash tw-rad tw-bot tw-haqiqiy tw-soxta tw-kuting tw-takror tw-yana tw-chip tw-karta tw-sabab`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4). **Karta maydoni (raqam, muddat, CVV) hech bir holatda chizilmaydi.**
4. **0-ekran:** «To'lash (mashq)» → sahifa holati, «?» chizig'i; variantlar shundan keyin faol; javobdan keyin xizmat tuguni tug'iladi va konvert uchadi (kirish animatsiyasi).
5. **2-ekran:** ikki olam bitta sahnada — yorliqlar almashadi (`telegram` → `alohida`), shakl va o'lcham o'zgarmaydi; Telegram chati faqat 1-qadamda. Konvert ochilishi — mono qatorlar (`NAMUNA_XABAR`).
6. **4-ekran:** kod kartasi (mono, 4 qator, sintaksis rangi yo'q — faqat yonadigan `if` qatori: yashil / qizil); «tana + kalit → …» qatorlari xizmat va Backend ichida; qulf qatori konvertga kirmasligi ko'rinsin (konvert xizmatdan qulfsiz chiqadi).
7. **6-ekran:** uch qadam; 3-qadamda sahna boshidan qayta yuradi (holat `takrorYoqiq`); xizmatdagi soat va «javob kelmadi» / «qabul qilindi» yorliqlari; ikki qator qizil ajratilishi. Sahna tugmalari («Kuting», «Takror tekshiruvi») ramkadan tashqarida, oddiy ilova tugmasidan ajralib tursin.
8. **7-ekran (QKod) → `HtmlCompiler`** (ko'p fayl: `index.html` tayyor · `namuna.js` tayyor · `app.js` — o'quvchi). ⚠️ MEXANIZM 11: `HtmlCompiler` faqat birinchi JS faylni ulaydi — 12-Modul `WebSocketBasicsLesson.jsx` yechimi: `app.js` birinchi JS fayl, `namuna.js` o'qish uchun ko'rinadi, ishlaydigan nusxasi natija hujjatiga o'quvchi kodidan OLDIN qo'yiladi.
   Tekshiruvlar (xulq-atvor, sinxron — 50 ms chegarasi; async yo'q): har shartdan oldin namuna holati boshidan; (1) `.yangi` click → `.jadval tr` (sarlavhasiz) = 1 · (2) `.yana` click → qatorlar 1 va `.javob` matnida `takror` · (3) toza holatda `.radxabar` → `.yana` → «rad» qatorlari = 1.
   `includes`, `indexOf`, `some`, `for` — hammasi qabul. «Bajardim» shartlar ✓ bo'lgach ochiladi (§19). Qoralama kaliti `pm-m11d3-code`.
   ⚠️ Starter fayllar `.jsx` ichida shablon-satr — izohlarda backtik yo'q (CLAUDE.md); JS satrlarida apostrofli so'z yo'q (`'tolandi'`, `'rad'`, `'takror'`, `'Javob: 200 · '` — ataylab). `namuna.js` va `app.js` qatorlari ≤70 belgi (SABOQ 37) — O'lchov bo'limi.
9. **9-ekran:** ikki qadam; Backend ichida uch qator ketma-ket yonadi (imzo · raqam · holat); «To'lov o'tmadi» sahifada qizil qator.
10. **11-ekran:** ikki nomli tugma (§209); xizmat tuguni `backendIchida` ↔ `boshqaKompaniya` (sirg'alib kiradi/chiqadi); uch karta U-013 («›» → ✓), ochilganda tugun nomi va rangi o'sha xizmatniki, konvert fakti jonlanadi (Payme — javob so'nadi va so'rov qayta uchadi · Click — ikki konvert «Prepare», «Complete» · Stripe — bitta xabar ikki marta). Brend ranglari — vizual bosqichda; logotip yo'q.
11. **12-ekran:** jadval 3 ustun (E 45), joriy karta bittadan, 4 variant (bir xil tartib); to'g'ri tanlovda konvert yo'li `MENTOR_SXEMA[i].yol` dan (`ilova-brauzer` · `telefon-xizmat` · `xizmat-backend` · `backend-xizmat` · `telefon-backend`).
12. **13-ekran (QMustaqil):** bitta katta karta (yorliq input ichida — E 43), ixcham chiziq (SABOQ 29); «Qator tayyor» → ixcham qator; «+ Yana qator» (≤6); shart — kamida 3 qator, har qatorda 3 maydon bo'sh emas; saqlash `pm-m11d3-oqim` (A-bo'lim 12), `test` maydoni mavjud bo'lsa saqlanib qoladi.
13. **15, 16-ekran** — `ScreenBlok` (skeletdagi ulagich) + `QPrompt` (2-qadam; `{…}` joylari). A1: `{to'lovchi hisobi}`, `{avvalgidek ishlashi kerak bo'lgan ishlar}` — bo'sh, kulrang «masalan». A2: `{nima uchun to'lov}` — bo'sh, kulrang «masalan»; `{sxema qatorlari}` ← `pm-m11d3-oqim.qatorlar` («kim | nima | kimga» satrlari); `{hozirgi holat}` — bo'sh.
    A2 4-qadamida tekshiruv kartasi (3 ta, bittadan): «Kutilganidek» / «Boshqacha» → `pm-m11d3-oqim.test.{imzo,takror,rad}` (`true` / `false`); yashil xabar va yakun sarlavhasi shu qiymatlardan. A2 1-qadamdagi trek gapi — `pm-m9d8-platforma.trek` dan (yo'q bo'lsa — ikkala gap).
    «Davom etish»: A1 — 3-qadamdan keyin, A2 — 2-qadamdan keyin (E 55); blok bayrog'i — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h). «Ortda qoldingizmi» — faqat A1 da (SABOQ 39). `ACH_TRIGGERS`: A2 4-qadam «Bajardim» (uchala tekshiruv belgilangan) → Webhook Tested.
    ⚠️ Qolipda yo'q (12-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», oldindan yozilgan qiymat, qadam ichidagi «Yordam», tekshiruv kartasi, «Ulgurmasangiz» qatori — o'z faylida kichik o'rovchi bilan, `src/qolip` ga tegilmaydi.
14. `RECAPS` 5 (kalit = 3, 5, 8, 10, 14) · `Q_LABELS` {3, 5, 8, 10, 14} · `ACHIEVEMENTS` 4 (`ACH_TRIGGERS`: 5 → Signature Guard, 8 → Counted Once, 10 → Declined Logged, A2 → Webhook Tested) · `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 (alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi») · `HW_TOKENS` fon so'zlari {uz, ru}.
15. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). Yakunda «Bugungi asosiy fikr» yo'q (E 50).
16. **Darvozalar:** `npm run gates -- src/11-Modull/PaymentWebhookLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran «4 savol» (SABOQ 30) hisobotda.

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m13-dars-03-start` = `m13-dars-02-done` = `m12-dars-10-done` → `m13-dars-03-done`, tayanch 3)
1. `backend/src/main.ts`: `NestFactory.create(AppModule, { rawBody: true })` (Manbalar 1) — imzo xom tana (`req.rawBody`, Buffer) bo'yicha hisoblanadi.
2. `backend/src/tolov/` (yangi bo'lim): `tolovlar` jadvali — `id` · `tolov_raqami` (UNIQUE) · `oyinchi_id` · `summa` (so'm, butun son) · `holat` (`tolandi` | `rad`) · `yaratilgan`; jadval 11-Modul loyihasidagi usul bilan yaratiladi (TypeORM sozlamasi — «qur» da ko'riladi).
   `POST /tolov/webhook`: (1) `X-Imzo` yo'q yoki `createHmac('sha256', process.env.TOLOV_KALITI).update(req.rawBody).digest('hex')` bilan `timingSafeEqual` mos emas (uzunlik teng bo'lmasa — mos emas) → `401`, yozuv yo'q ·
   (2) `tolov_raqami` bor → `200 { takror: true }` · (3) yozish → `200 { ok: true }` (rad ham); bir vaqtda kelgan ikki bir xil xabarda UNIQUE buzilsa — ikkinchisiga ham `200 { takror: true }` · `holat` boshqa qiymat yoki maydon yetishmasa → `400` (o'quvchi matnida yo'q; TAYANCHGA SAVOL 24). Pro va ilova o'zgarmaydi.
3. `GET /tolov-mashq?oyinchi=…&summa=…` — oddiy HTML (tayanch 1.3 matnlari aynan + «Maydon Jamoa — Pro, 30 kun»); to'rt tugma `POST /tolov-mashq/yubor { tur: 'tolash' | 'rad' | 'ikki' | 'imzosiz', oyinchi, summa }` ga so'rov beradi;
   Backend xabarni yasaydi (`tolovRaqami` — `m-` + navbatdagi raqam), `TOLOV_KALITI` bilan imzolaydi va o'zining tashqi manziliga (`RENDER_EXTERNAL_URL` yoki lokal `PORT`) `POST /tolov/webhook` yuboradi; `ikki` — bir xil tana va imzo bilan ketma-ket ikki marta; `imzosiz` — `X-Imzo` siz; javob(lar)ni (holat kodi + tana) sahifaga qaytaradi. Karta maydoni yo'q; Payme/Click nomi yo'q.
4. `backend/.env.example` — `TOLOV_KALITI=` (qiymatsiz); `README.md` — o'zgaruvchilar ro'yxatiga `TOLOV_KALITI` (qiymatsiz) · yangi «To'lov» bo'limi (A2 Mentor talabi natijasi: besh qatorli jadval + halol qator) · «Darslar va teglar» jadvaliga `m13-dars-03-done`.
5. Muhrdan oldin (⛔ «qur» darvozasi): Render'da deploy; mashq sahifasida uch tekshiruv (imzosiz `401` · ikki marta — bitta qator · rad — «rad» qatori); `git grep TOLOV_KALITI` — faqat nom; Render bepul xizmati o'z tashqi manziliga so'rov yuborib javob ola olishi (Shubhali 1); `rawBody` 11-Modul loyihasidagi NestJS versiyasida (Shubhali 2); uxlagan Render'da mashq sahifasining birinchi ochilishi.

## Manbalar (o'zim tekshirdim yoki tayanch 6 orqali, 07.10.2026; o'quvchiga ko'rinmaydi)
1. NestJS — `docs.nestjs.com/faq/raw-body` (o'zim, 07.10.2026): «const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });» · «type the request with the `RawBodyRequest` convenience interface, which exposes a `rawBody` field» ·
   «One of the most common reasons to access the raw request body is webhook signature verification. Verifying a webhook signature usually requires the unparsed request body to calculate an HMAC hash.» → A1 talabidagi «xom tana», REPO 1.
2. Node.js — `nodejs.org/api/crypto.html` (o'zim, 07.10.2026): `crypto.createHmac(algorithm, key)` — «Creates and returns an `Hmac` object that uses the given `algorithm` and `key`. … Examples are 'sha256' and 'sha512'.»
   `crypto.timingSafeEqual(a, b)` — hujjat bo'limini sahifa uzunligi sababli o'qiy olmadim; lokal sinov (Node v24.18.0, scratchpad `md03`): uzunligi har xil buferlarda `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` — «Input buffers must have the same byte length» → REPO 2 dagi «uzunlik teng bo'lmasa — mos emas». Shu sinovda `JSON.parse` + `JSON.stringify` bir xil satrni qaytardi (oddiy obyekt).
3. Stripe — tayanch 6 / MANBA 5 (`docs.stripe.com/webhooks`, `stripe.com/global`, 07.10.2026): «Webhook endpoints might occasionally receive the same event more than once. You can guard against duplicated event receipts by logging the event IDs you've processed» · imzo `Stripe-Signature` (HMAC SHA-256) ·
   «Quickly returns a successful status code (2xx) before any complex logic that might cause a timeout» (14-ekran ✎ — shuning uchun «bu misolda») · ro'yxatda O'zbekiston yo'q → 11-ekran Stripe kartasi, arena 7.
4. Payme Business — tayanch 6 / MANBA 5 (`developer.help.paycom.uz`, 07.10.2026): «В случае потери ответа при вызове метода, Payme Business повторяет запрос с теми же параметрами» · «С кассами могут работать только юридические лица: ИП, ЧП, ООО…» · summa tiyinda · JSON-RPC 2.0, Basic-auth, so'rovlar Payme IP manzillaridan → 11-ekran Payme kartasi, arena 6.
5. Click — tayanch 6 (rasmiy GitHub `click-llc/click-integration-django`, `click/utils.py`; 07.10.2026): Prepare (`action = 0`) va Complete (`action = 1`); `sign_string` = md5(… `secret_key` …); xato kodi `-4 Already paid` → 11-ekran Click kartasi. `docs.click.uz` sahifalarini o'zim ochmadim (skript bilan chiziladi — MANBA 5).
6. Telegram Bot API — tayanch 6 (`core.telegram.org/bots/api`, 07.10.2026): `setWebhook` `secret_token` → sarlavha `X-Telegram-Bot-Api-Secret-Token`; javob `2XY` bo'lmasa, so'rov qayta yuboriladi → 4-ekran O'qituvchi eslatmasi.
7. Render — tayanch 6 (`render.com/docs/free`, 06.10.2026): bepul xizmat 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa → 6-ekran QIzohi va O'qituvchi eslatmasi, A2 3-qadam («bir daqiqagacha»).
8. Qonun — tayanch 6 (lex.uz/docs/-111189, 07.10.2026): FK 27-modda — 14–18 yoshlilar bitimni ota-onaning yozma roziligi bilan tuzadi → 11-ekran QIzohi (o'quvchi matnida qonun nomi yo'q), 1, 11-ekran O'qituvchi eslatmasi.
9. Kursdagi so'zlar (grep, 07.10): 7-Modul webhook ta'rifi — `feedback/F-0928-QA-5modul/YAKUNIY/01-BotIntro.md` 11-ekran, «Bepul server uxlaydi; webhook xabari uni uyg'otadi» — `07-BotFullProject.md` · `.includes(s)` — 9-Modul `03-PmInterviewMvp-v3.md` kod oynasi ·
   Neon SQL Editor — 12-Modul `10-PmUsersCheck-v3.md` · maxfiy kalitni `.env` va Render'ning Environment bo'limiga qo'yish — 12-Modul `08-PmDropOff-v3.md` (`SANOQ_KALITI`) · `200` — 10-Modul `07-ProductionDeploy-v3.md` (`/health`) · `401` — 11-Modul `10-FoundationDay-v3.md`, `11-FeatureOne-v3.md`.

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Hook** — maket mashq sahifasi va Backend (xizmat tuguni javobdan keyin tug'iladi); variantlar «Ilova Backend'ga «to'landi» deb yozadi» · ✔ «To'lov xizmati Backend'ga o'zi yozadi» · «Backend xizmatdan har daqiqa so'raydi»; uchinchisiga «So'rab turish ham yo'l» (P-016).
2. **Sahna:** telefon · To'lov xizmati · Backend (TAQIQLAR 6 «telefon ↔ brauzer ↔ Backend» + tayanch 1.3 «to'lov xizmati»); 2-ekranda shu sahna avval 7-Modul olami (telefon · Telegram · botingiz), keyin to'lov — yorliqlar almashadi.
3. **Namuna qiymatlar:** to'lov raqami `m-101`, `m-102`…, `m-999` (soxta); `oyinchiId: 7`; imzo ko'rinishi `7c1e…`, `3f9a…`, `b04e…` (qisqartirilgan, kalitdan hisoblanmagan); summa **10 000** — 1-darsdagi Mentorning taxmini (15 000 — 4-dars soni, oldindan ochilmadi; tayanch 7.12).
4. **Mashq sahifasidagi qator «Maydon Jamoa — Pro, 30 kun · 10 000 so'm»** — tayanchda sahifa tarkibi: sarlavha, test qatori, tugmalar. Nima uchun to'lanayotgani ko'rinsin deb qo'shdim; A2 promptida o'quvchi uchun `{nima uchun to'lov}` joyi.
5. **Rad uchun javob tanasi** `200 { ok: true }` (tayanch: «holat «rad» → `200`»).
6. **Rad etilgan to'lov — «hech narsa ochilmaydi»** (tayanch: «Pro o'zgarmaydi, ilova «To'lov o'tmadi»» — bu darsda Pro va ilova yo'q); sabab QIzohi: «Yozuv qoladi: tashkilotchi «to'lovim qayerda?» deb so'rasa, o'tmagan to'lov ham Backend'da ko'rinadi.» — tayanchda sabab yo'q.
7. **Takror tekshiruvi rad tekshiruvidan oldin** — kod oynasi 3-sharti va 9-ekran 2-qadami (tayanch tartibi «imzo · takror · rad» dan kelib chiqadi; rad xabari ham takror bo'lishi mumkin).
8. **Kod oynasi:** `yozilganlar` — to'lov raqamlari ro'yxati (satrlar), shuning uchun `includes`; tugmalar «Yangi to'lov xabari» · «Rad etilgan to'lov xabari» · «Oxirgi xabar yana keldi»; javob qatori «Javob: 200 · <natija>».
9. **4-ekran kod kartasi `imzo !== kutilgan`** — o'qish uchun qisqartirilgan; A1 talabi va REPO — `timingSafeEqual`. Taqqoslash vaqti hujumi darsda aytilmaydi (13 yosh; O'qituvchi eslatmasida bir gap).
10. **«Xom tana» (raw body)** — A1 promptida agent uchun; NestJS `rawBody: true` (Manbalar 1). O'quvchi matnida tushuntirilmaydi.
11. **Mashq sahifasining ichki yo'li** `POST /tolov-mashq/yubor` va Backend'ning o'z tashqi manziliga haqiqiy so'rov — tayanchda faqat «sahifa xabarni Backend'da imzolaydi» (07.10: «serverda» → «Backend'da», tayanch 9.5) (REPO 3).
12. **Mentor sxemasi uch ustunda** (kim · nima qiladi · kimga — `pm-m11d3-oqim` shakli); tayanch 1.3 «X → Y → Z» qatorlaridan ajratildi; 2-qator «kim» — **Tashkilotchi** (tayanchda «to'lov xizmati → odam to'laydi»); 1-qator «kimga» — Brauzer.
13. **3-dars `pm-m11d2-model` ni o'qimaydi** (tayanch 8 da 3-dars faqat `pm-m9d8-platforma` ni o'qiydi) — 13-ekran Mentori o'quvchini 2-darsdagi modeliga yuboradi, kalitdan to'ldirilmaydi. O'qisa, sxemaning «kim to'laydi» qatori oldindan to'lardi — qaror sizda.
14. **`pm-m11d3-oqim.test`** — A2 tekshiruv kartasidagi «Kutilganidek» → `true`, «Boshqacha» → `false`, bosilmagan → `null`.
15. **A1 tekshiruvi:** kod tartibi (agent ko'rsatgan uch qator), `git grep -n "TOLOV_KALITI"` (faqat nom), Neon SQL Editor `SELECT * FROM tolovlar;` (bo'sh jadval). Webhook'ning o'zi A2 da tekshiriladi.
16. **A2 hisob raqami** — o'quvchining o'z hisobi: Neon'da login bo'yicha `SELECT id …`, zaxira — agent. Login agentga aytiladi (maxfiy emas); tekshiruv akkaunti ochilmaydi — to'lov qatorlari mashq, Pro bu darsda yo'q.
17. **A1 `{avvalgidek ishlashi kerak bo'lgan ishlar}`** — bo'sh, «masalan» bilan; `pm-m9d5-prd.funksiyalar` dan to'ldirilmaydi (3-darsning o'qish ro'yxatida yo'q).
18. **11-ekran kartalari matni** (Payme, Click, Stripe — tayanch 6 dan, har biri ikki qator) va brend izohlari «O'zbekistondagi to'lov xizmati» / «xorijdagi to'lov xizmati»; Telegram `secret_token` — faqat O'qituvchi eslatmasida.
19. **1-savol distraktori «Tashkilotchining SMS xabaridan»** — odamning qo'lda xabari turkumi; polling varianti ataylab yo'q.
20. **Nishonlar:** Signature Guard · Counted Once · Declined Logged · Webhook Tested (grep 0).
21. **Uyga vazifa ikki bandi** (tugatish · sxemani haqiqiy nomlar bilan solishtirish) — yengil (sinf 14); uchinchi band qo'shilmadi.
22. **«webhook testi» (tayanch, dastur so'zi) o'quvchi matnida — «tekshiruv»** (T-015: «test» — ballik savol yoki test rejim); kalit maydoni `test` o'zgarmaydi (ichki).
23. **Mashq sahifasi ochiq manzilda** — bu darsda xavf yo'q (pul yo'q, Pro yo'q). 4-darsda webhook Pro'ni uzaytiradi — ochiq sahifa orqali kim istasa mashq Pro olishi mumkin: himoya (masalan, faqat kirgan hisob uchun) kerakmi — 4-dars uchun savol.
24. **`holat` faqat `tolandi` / `rad`, boshqa qiymat — `400`** (REPO 2; o'quvchi matnida yo'q).
25. **Kutish vaqtlari:** xizmatning javob kutish vaqti soniyada aytilmaydi; Render uyg'onishi — «bir daqiqagacha» (12-Modul 9.19); Render deploy — «bir necha daqiqa cho'zilishi mumkin».
26. **Reja** sarlavhasi «Bugun Backend'ingiz mashq to'lovni qabul qiladi.» va to'rt qadam (teglar `sub` so'zlaridan).
27. **«Ortda qoldingizmi»** — faqat A1 da, teg `m13-dars-03-done` (SABOQ 39).

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **Render bepul xizmati o'z tashqi manziliga so'rov yuborishi** (`RENDER_EXTERNAL_URL` orqali o'ziga `POST /tolov/webhook`) va javobni sahifaga qaytarishi — sinalmagan. Ishlamasa — mashq sahifasi webhook funksiyasini ichkaridan chaqiradi (imzo tekshiruvi baribir o'tadi), MD va REPO yangilanadi. «Qur» pilotida Mentor repo'sida tekshiriladi.
2. ⛔ **NestJS `rawBody: true`** 11-Modul loyihasidagi NestJS versiyasida va JSON parser bilan birga ishlashi — hujjatda bor, loyihada sinalmagan.
3. ⛔ **90 daqiqa** — 15 dars ekrani + ikki blokda ikki Render kutishi; A2 uyga o'tishi mumkin (A-bo'lim 11). Taymer bilan pilotda.
4. **Render'ning Environment bo'limi nomi** — 11/12-Modul MD laridan olindi; interfeysni o'zim ko'rmadim. **Neon SQL Editor** — 12-Modul matnidan.
5. **`oyinchi_id` tashqi kalit bo'lsa** — mavjud bo'lmagan raqam bilan mashq so'rovi Backend xatosi berishi mumkin; shuning uchun A2 da o'z hisob raqami olinadi. Agent jadvalni qanday bog'lashi — o'zi tanlaydi (talabda yo'q).
6. **6-ekran sahnasi** bitta holatni ko'rsatadi: birinchi xabar yozildi, javob kech qoldi. Haqiqiy uxlagan Backend'da birinchi so'rov yetib bormasligi ham mumkin — xulosa ikkala holatda rost («bir marta yoziladi»), sahna «Mentor misolida».
7. **Payme/Click/Stripe brend ranglari** — vizual bosqichda; kartalarda faqat nom va fakt, logotip va to'lov formasi yo'q.
8. **Click `-4 Already paid`** — tayanch 6 (rasmiy kod fayli); Click hujjat sahifalarini o'zim ochmadim. Kartada raqam `-4` aytilmaydi, faqat «Already paid».
9. **Payme'da «imzo»** — Basic-auth va IP ro'yxati (HMAC emas); shuning uchun 11-ekran xulosasi uchala xizmatdan faqat takror xabarni umumlashtiradi (uchalasining hujjatida bor), imzo — Click va Stripe kartalarida alohida.
10. **Telegram `secret_token`** — 7-Modul botida qo'yilmagan (7-Modul 7-dars prompti: `setWebhook(WEBHOOK_URL + '/telegram')`); shuning uchun o'quvchi matnida yo'q.
11. **Kod oynasidagi `textContent` jadvali** — `HtmlCompiler` ichida `table` uslubi platformaning standart CSS'iga bog'liq; ko'rinishi vizual bosqichda.
12. **`namuna.js` qator uzunligi ≤70** — O'lchov bo'limida o'lchandi (eng uzuni 67); uzun `addEventListener` qatorlari `bosilsa` yordamchisi bilan qisqartirildi.
13. **A1 tekshiruvidagi `git grep`** — Windows terminalida ham ishlaydi (Git bilan keladi), lekin o'quvchi PowerShell'da qo'shtirnoq bilan qiynalishi mumkin — pilotda ko'riladi.
14. **Sahna tugmalari** («Haqiqiy xabar», «Soxta xabar», «Kuting», «Takror tekshiruvi», «Oxirgi xabar yana keldi», «Botga yozish») — haqiqiy ilovada yo'q; ✎ larda ochiq, o'quvchi matnida «sahna» so'zi yo'q — vizual bosqichda oddiy ilova tugmasidan ajralib tursin.
15. **«Webhook Tested» nishoni** natijadan qat'i nazar beriladi (tavsif — «tekshiruvni o'tkazdingiz»); «faqat uchala «Kutilganidek» bo'lsa» varianti ham mumkin — qaror sizda.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — tepada taqsimot «reja, o'lchov emas» va ⛔ pilot taymeri; A-bo'lim 11; har blokda «Ulgurmasangiz»; Render kutishi paytida ish (A1 3-qadam, A2 3-qadam — kodni ko'rsatadigan prompt); «sig'adi» deyilmagan (Shubhali 3).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — Shubhali 1 (Render o'z manziliga so'rov), 2 (`rawBody`), 3 (90 daqiqa) — ⛔; Render Environment, Neon SQL Editor — oldingi modul matnidan (Shubhali 4); kutish vaqtlari «bir daqiqagacha», «bir necha daqiqa cho'zilishi mumkin»; Payme/Click/Stripe faktlari — tayanch 6, menyu va tugma nomlari taxmin qilinmagan.
3. [x] **Saqlash kaliti — shartnoma** — `pm-m11d3-oqim` tayanch 8 aynan (A-bo'lim 12): `test` — `bool | null` uch holat (o'quvchi ko'rgani / boshqacha / qilinmagan), `id` barqaror, 3–6 qator; kalitga ism, login, kalit qiymati yozilmaydi; boshqa darsning kaliti yozilmaydi; o'qiydi faqat `pm-m9d8-platforma` (`pm-m11d2-model` — TAYANCHGA SAVOL 13).
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — xulosalar «Bu misolda», «Mentor sxemasida», «Bu kodda»; testlar «Mentor misolida», «Mentor Backend'i»; 13-ekran Yordami «Bu kursda sxemada kamida uch qator»; «Bu sahifa — mashq»; 14-ekran tartibi «bu misolda» (Stripe «avval tez `2xx`» — ✎).
5. [x] **Kafolat va sabab da'vosi yo'q** — «xabar keladi» emas: «xizmat qayta yuboradi» (6, 11); «kechikishi mumkin», «odatda»; imzo — kim yuborganini ko'rsatadi, to'lov to'g'riligini emas (4-ekran QIzohi, arena 5); agentning «tayyor» degani — da'vo (A1 QIzohi va ✎), natija — o'quvchining uch tekshiruvi; kafolat so'zlari o'quvchi matnida 0 (grep).
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — 19-ekran besh sarlavha, har biri rost («hech biri» holati alohida); ✓ yorliq faqat uchala «Kutilganidek»da; A2 yashil xabari ikki holatli; blok bayrog'i faqat 4-qadamdan; Webhook Tested tavsifi qilingan ishni aytadi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — «to'lov raqami bir marta yoziladi» (birlik — to'lov raqami, jadval qatori); tekshiruv natijalari o'lchanadi: `401`, qatorlar soni, `holat` (Neon `SELECT`); «eng» so'zli ta'rif yo'q.
8. [x] **Test: bitta himoyalanadigan javob** — har testda distraktorlar uch turkumdan (3, 5, 8, 10-ekran ✎); haqiqiy hayotda rost bo'lib qolishi mumkin bo'lganlar chiqarildi (polling, «eski qatorni yangilaydi», Payme «to'lovni bekor qiladi»); arena 6, 7 distraktorlari rasmiy hujjatga zid; uzunlik ±15% (O'lchov); ✔ yolg'iz eng uzun emas.
9. [—] **Real odamlar xavfsizligi** — bu darsda real odam bilan ish yo'q (suhbat, post, tasdiq — boshqa darslar). Tegadigani: kalit agentga, chatga, skrinshotga yozilmaydi (A1 1-qadam); login faqat o'z hisobi uchun (A2); boshqa odamning Backend'i yoki xizmati tekshirilmaydi (A2 O'qituvchi eslatmasi); «boshqa kompyuter» — odam chizilmaydi, hujum usuli yo'q (4-ekran).
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — A2 uch tekshiruvi o'quvchi bosadigan tugmalar bilan; A1 tekshiruvi — kod qatorlari, `git grep`, Neon — o'zi; hisob raqami — Neon, agent zaxira; tekshiruv akkaunti ochilmaydi (TAYANCHGA SAVOL 16).
11. [x] **Web-trek teng yo'l** — o'zgarish faqat `backend/` da, bloklar ikkala trekda bir xil (A-bo'lim 10); A2 1-qadamda trek gapi; sarlavhalarda «Backend'ingiz», «mahsulotingiz» (ikkala trekda rost — 11-Modulda ikkala trek bitta `backend/`).
12. [x] **Mentor misoli ichki izchil** — narx 10 000 (1-dars), 15 000 ochilmadi; Pro — tayanch 1.0; sxema bitta manba (`MENTOR_SXEMA`: 12-ekran, A2 Yordami, kutilgan natija); «To'lovga o'tish», `GET /men` — tayanch 1.3; yangi tafsilotlar — TAYANCHGA SAVOL 3, 4, 5, 6, 11, 12.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — A1 `{to'lovchi hisobi}`, `{avvalgidek ishlashi kerak bo'lgan ishlar}`; A2 `{nima uchun to'lov}`, `{sxema qatorlari}` (o'quvchiniki), `{hozirgi holat}`; jadval yaratish usuli — loyiha odati; qaytarib bo'lmaydigan o'zgarish yo'q (yangi jadval, yangi yo'l, yangi sahifa).
14. [x] **Uyga vazifa yengil va aniq** — ikki band (tugatish · sxemani haqiqiy nomlar bilan solishtirish), muddat bilan.
15. [x] **Ayb da'vosi yo'q** — xato yo'llari: «Shu xato chiqdi: {xato}. Tuzat.», «{nima} talabdagidek emas: …»; «sizda emas», «xatongiz emas» — 0 (grep).
16. [x] **Kelajak va'dasi yo'q** — «Pro va ilova hali o'zgarmaydi» — hozirgi holat; README qatori «Hozircha: …»; mashq sahifasida faqat hozir ishlaydigan narsa; 5-darsdagi buzish — faqat O'qituvchi eslatmasida; kelajak — faqat yakundagi «Keyingi dars» qatori.
+ **12-Modul tayanchi 7 (11-Modul sinflari)** — holatga qarab yakun [x] · da'vo isbot emas [x] · maxfiy qiymat agentga va ochiq joyga chiqmaydi [x] (A1, A2, kartochka 11, arena 4) · tashqi xizmat haqida faqat rasmiy hujjat [x] (Manbalar) · har sonning manbasi [x] (A-bo'lim 6) · tayanchda yo'q narsa to'qilmagan [x] (TAYANCHGA SAVOL 1–27) ·
  saqlash kaliti o'qiydigan darsdan [x] · test: bitta javob [x] · keys [—] (keyssiz, Qaror-0 21) · 90 daqiqa [x] · bir ma'no — bir so'z [x] («test», «kalit», «xabar» — A-bo'lim 5; o'chirgich ↔ maxfiy kalit ajratildi) · web-trek [x] · agent va o'quvchi ishi ajratilgan [x] · o'smir xavfsizligi [x].
+ **13-Modulga xos (pul):** real pul yo'q [x] (tepada, 1, 11-ekran, A2) · karta ma'lumoti hech qayerda [x] (maketlar, promptlar «karta maydoni bo'lmasin», 11-ekran yorlig'i, KOD 3) · «mashq to'lov» Payme/Click ko'rinishini taqlid qilmaydi [x] (A2 promptida taqiq; brendlar faqat 11-ekranda, fakt bilan) ·
  «test rejim» belgisi har to'lov ekranida [x] (har mashq sahifa maketida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.»; to'lov taklifi ekrani bu darsda yo'q) · narx — «Mentorning taxmini» [x] (yorliq har maketda, 2-ekran QIzohi) · suhbat va tasdiqda bosim yo'q [—] (bu darsda suhbat va tasdiq yo'q) · oferta — shablon [—] (7-dars) ·
  «Real ishga tushirish — … bu kursda emas» [x] (11-ekran QIzohi, so'zma-so'z) · komissiya aytilmagan [x].

## O'lchov (scratchpad `md03/olchov.py`, 07.10.2026; yakuniy fayl bo'yicha)
Belgilar — oddiy `len` (✔ va boshidagi bo'shliqsiz). `!!!` — chegaradan oshgan joy: yakuniy yurishda **0** (oldingi yurishlarda topilgan 2 sarlavha, 2 xulosa, 2 xato izohi, 11 arena qatori — uzunlik va «✔ yolg'iz eng uzun» — va 3 kod qatori tuzatildi).
Kod oynasi qatorlari (`namuna.js`, `app.js`) — hammasi ≤70. QIzoh qatorlariga chegara yo'q (bitta qator). Mentor gaplari — interaktiv ekranlarda bitta gap, 1-ekran (reja) va 7-ekran (kod oynasi) — ikki gap.

```
## Sarlavhalar (≤55)
   44  To'lov o'tdi — Backend buni qayerdan biladi?
   48  Bugun Backend'ingiz mashq to'lovni qabul qiladi.
   46  Xizmat xabarni Backend'ning qayeriga yuboradi?
   50  Soxta «to'landi» xabarini Backend qanday ajratadi?
   41  Xizmat javob olmasa, xabarni nima qiladi?
   47  Bitta to'lovni bir marta yozadigan kod yozamiz.
   45  To'lov o'tmasa ham Backend'ga xabar keladimi?
   40  Haqiqiy to'lov xizmatida nima boshqacha?
   44  To'lov boshidan oxirigacha kim kimga yozadi?
   50  Mahsulotingiz uchun to'lov oqimi sxemasini yozing.
   39  To'lov xabari qaysi tartibda ishlanadi?
   53  Backend'ingiz to'lov xabarini tekshirib qabul qilsin.
   52  Mashq to'lov bilan imzo, takror va radni tekshiring.
   25  O'zingizni sinab ko'ring.
   52  To'lov xabari Backend'ingizda — uch tekshiruv o'tdi.
   53  To'lov xabari yo'li bor — tekshiruvni tugatish qoldi.
   44  Yo'l va jadval tayyor — uch tekshiruv qoldi.
   54  Sxemangiz tayyor — to'lov xabari yo'lini qurish qoldi.
   51  Webhook hali qurilmagan — qadamlarni uyda bajaring.
## Xulosalar (≤110)
  107  Ilova so'ramaydi: to'lov xizmati xabarni Backend manziliga o'zi yuboradi, Backend `200` bilan javob beradi.
  109  Bu misolda kalit xabar ichida ketmaydi: faqat imzo ketadi, Backend uni o'zidagi kalit bilan qayta hisoblaydi.
  104  Bu misolda bitta to'lov raqami bir marta yoziladi; takrorga ham `200` qaytadi — xizmat qayta yubormasin.
   96  Bu kodda takror tekshiruvi birinchi turadi: ikki marta kelgan rad xabari ham bir marta yoziladi.
  101  Bu misolda rad xabari ham bir marta yoziladi: hech narsa ochilmaydi, takror kelsa — qayta yozilmaydi.
   98  Haqiqiy xizmatda sahifa va xabar boshqa kompaniya serveridan keladi; takror xabar u yerda ham bor.
  103  Mentor sxemasida Backend javobni xizmatga qaytaradi; ilova esa yangi holatni Backend'dan o'zi so'raydi.
   57  Sxemangiz saqlandi — amaliyotda u README'ga ko'chiriladi.
   93  Bu misolda avval imzo, keyin takror tekshiriladi; `200` esa yozib bo'lingandan keyin qaytadi.
## Hook javoblari (≤120)
  103  Aynan! 7-Modulda botingizga Telegram xabarni o'zi yuborardi — bu yerda xabarni to'lov xizmati yuboradi.
  118  Qiziq fikr! Ilova faqat sahifani ochadi, pulni ko'rmaydi. Uning gapiga ishonsak, to'lamagan ham «to'landi» deya oladi.
  109  Qiziq fikr! So'rab turish ham yo'l, lekin Mentor misolida xizmat Backend'ga o'zi yozadi — so'rash shart emas.
## Xato izohlari / QXato / shart (≤60)
   48  Ilova faqat sahifani ochadi — pulni kim ko'radi?
   38  SMS telefonga keladi — Backend'ga-chi?
   57  Database faqat yozilganni biladi — yozuvni kim boshlaydi?
   57  Imzo tekshirilmasa, soxta xabar ham to'lov bo'lib qoladi.
   51  Qator yozilsa, soxta xabar baribir jadvalda qoladi.
   56  «Rad» — xizmat aytadigan holat; bu xabar xizmatdan emas.
   48  Yangi to'lov xabari jadvalga bir marta yozilsin.
   45  Shu xabar yana kelsa, javob «takror» bo'lsin.
   52  Rad xabari ikki marta kelsa ham, «rad» qatori bitta.
   54  Bitta to'lov ikki qator bo'lsa, u ikki marta sanaladi.
   52  `401` olgan xizmat to'xtaydimi yoki yana yuboradimi?
   42  To'lov o'tgan edi — «rad» qayerdan chiqdi?
   44  Xabar keldi, imzosi mos — u qayerga yozildi?
   52  Sahifada «To'lov o'tmadi» chiqqan edi — holat qaysi?
   53  Oldingi to'lov boshqa raqam — unga hech kim tegmaydi.
   48  Kartani qayta o'qing: bu ish kimga yetib boradi?
   56  Kamida uch qator kerak; har qatorda uchta katak to'lsin.
   43  Tartib mos emas — bo'lakni bosib qaytaring.
## Bloklar «Hammasi bajarilgach»
   88  `POST /tolov/webhook` va `tolovlar` tayyor — endi ularni mashq to'lov bilan tekshirasiz.
   68  Uch tekshiruv o'tdi: imzosiz `401`, takror bitta qator, rad yozildi.
   70  Tekshiruv tugamagan: «Boshqacha» chiqqanini tuzatib, qayta tekshiring.
## Mentor gaplari (gap soni · belgi)
  1 gap ·  94  Mentor misolida tashkilotchi brauzerda to'lov sahifasini ochgan — «To'lash (mashq)» ni bosing.
  1 gap ·  41  Endi o'ngdagi javoblardan birini tanlang.
  2 gap · 127  Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z Backend'ingizda qilasiz. Pul yechilmaydi: bu kursd
  1 gap · 115  7-Modulda Telegram yangi xabarni botingiz manziliga o'zi yuborardi — avval «Botga yozish» ni bosib, o'shani es
  1 gap ·  73  Endi xuddi shu yo'lni to'lov bilan ko'ring — «To'lash (mashq)» ni bosing.
  1 gap ·  93  Backend manzili internetda ochiq — avval «Haqiqiy xabar» ni, keyin «Soxta xabar» ni yuboring.
  1 gap ·  86  Mentor misolida Backend uxlab qolgan — «To'lash (mashq)» ni bosing va xizmatga qarang.
  1 gap ·  48  Xizmat javobni kutib qoldi — «Kuting» ni bosing.
  1 gap ·  81  Bitta to'lov ikki marta yozildi — Backend ichidagi «Takror tekshiruvi» ni yoqing.
  2 gap · 117  Kod oynasida Backend o'rnida namuna turibdi. Takror tekshiruvini o'zingiz terib yozasiz: qo'lda yozganda o'rga
  1 gap ·  72  Mashq sahifasida «Rad etish (mashq)» ni bosing va konvert ichiga qarang.
  1 gap ·  78  Endi «Oxirgi xabar yana keldi» ni bosing — shu xabar ikkinchi marta kelsa-chi?
  1 gap ·  67  Tepadagi «Mashq to'lov» va «Haqiqiy xizmat» ni almashtirib ko'ring.
  1 gap ·  42  Endi pastdagi uch kartani bittadan oching.
  1 gap · 103  Har kartada kim nima qilishini o'qing va bu ish kimga yetib borishini tanlang — qator jadvalga tushadi.
  1 gap · 112  2-darsda tanlagan modelingizdan boshlang: kim to'laydi va to'lovdan keyin nima ochiladi — har ishga bitta qato
  1 gap ·  43  Bo'laklarni bajariladigan tartibda joylang.
  1 gap ·  88  Talab tayyor — ikki joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
  1 gap ·  90  Sahifa xabarni Backend'da imzolaydi — kalit brauzerga chiqmaydi; «1 · Ochish»dan boshlang.
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  ## 3 · 1-savol ✔ (jonli ball)  ← QTest · savol 7 so'z · variantlar [27, 30, 28, 27] · o'rtacha 28.0 · OK · ✔C
      A   27  Tashkilotchining ilovasidan
      B   30  Tashkilotchining SMS xabaridan
      C✔  28  To'lov xizmatining xabaridan
      D   27  Database'ning o'z yozuvidan
  ## 5 · 2-savol ✔ (jonli ball)  ← QTest · savol 8 so'z · variantlar [36, 39, 40, 41] · o'rtacha 39.0 · OK · ✔A
      A✔  36  `401` qaytaradi, hech narsa yozmaydi
      B   39  `200` qaytaradi, to'lovni yozib qo'yadi
      C   40  `401` qaytaradi, to'lovni baribir yozadi
      D   41  `200` qaytaradi, qatorni «rad» deb yozadi
  ## 8 · 3-savol ✔ (jonli ball)  ← QTest · savol 10 so'z · variantlar [38, 36, 41, 36] · o'rtacha 37.8 · OK · ✔D
      A   38  Ikkinchi qator yozadi, `200` qaytaradi
      B   36  Hech narsa yozmaydi, `401` qaytaradi
      C   41  Qatorni «rad» deb yozadi, `200` qaytaradi
      D✔  36  Hech narsa yozmaydi, `200` qaytaradi
  ## 10 · 4-savol ✔ (jonli ball)  ← QTest · savol 9 so'z · variantlar [36, 36, 40, 36] · o'rtacha 37.0 · OK · ✔B
      A   36  Hech qanday yangi qator qo'shilmaydi
      B✔  36  Yangi qator qo'shiladi, holati «rad»
      C   40  Yangi qator qo'shiladi, holati «tolandi»
      D   36  Oxirgi to'langan qator o'chib ketadi
## Arena (12) — ✔ o'rni va variant uzunliklari
  ✔A · 8 so'z · [33, 31, 30, 35] · o'rtacha 32.2 · OK  1. 7-Modulda botingiz yangi xabarni webhook bilan qanday olardi?
  ✔B · 6 so'z · [22, 22, 20, 23] · o'rtacha 21.8 · OK  2. Mentor sxemasida karta ma'lumoti qayerda qoladi?
  ✔C · 4 so'z · [26, 23, 28, 28] · o'rtacha 26.2 · OK  3. `X-Imzo` sarlavhasida nima keladi?
  ✔D · 4 so'z · [30, 28, 26, 28] · o'rtacha 28.0 · OK  4. `TOLOV_KALITI` qiymatini qayerga yozasiz?
  ✔A · 6 so'z · [30, 28, 33, 27] · o'rtacha 29.5 · OK  5. Imzo mos keldi. Bu nimani ko'rsatadi?
  ✔B · 5 so'z · [29, 33, 32, 33] · o'rtacha 31.8 · OK  6. Javob yo'qolsa, Payme nima qiladi?
  ✔C · 7 so'z · [38, 32, 36, 32] · o'rtacha 34.5 · OK  7. Stripe takror xabar haqida nimani maslahat beradi?
  ✔D · 7 so'z · [23, 26, 25, 21] · o'rtacha 23.8 · OK  8. Mentor Backend'i takror xabarni nimaga qarab taniydi?
  ✔A · 7 so'z · [24, 27, 23, 27] · o'rtacha 25.2 · OK  9. Bu darsdagi mashq to'lov sahifasi qayerda turadi?
  ✔B · 6 so'z · [28, 29, 27, 31] · o'rtacha 28.8 · OK  10. Mashq to'lov sahifasi xabarni qayerda imzolaydi?
  ✔C · 5 so'z · [20, 19, 19, 19] · o'rtacha 19.2 · OK  11. Sxemadagi «Kimga» ustuni nimani aytadi?
  ✔D · 7 so'z · [28, 27, 24, 24] · o'rtacha 25.8 · OK  12. Mentor sxemasida ilova Pro holatini qayerdan biladi?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
## Kod oynasi qatorlari (≤70)
  qatorlar: 51 · eng uzuni: 67
```

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m11-02` «Mahsulotingiz qanday pul topadi?» → **`m11-03` «Webhook: to'lov Backend'ga qanday yetib keladi»** (osti «imzo, takror xabar va rad etilgan to'lov — test rejimda», 447-qator) → `m11-04` «Narxni qanday belgilaysiz?»; reja teglari `sub` so'zlari bilan; yakundagi «Keyingi dars» — `00-NOMLAR.md` 4-qator.
- [x] Bitta misol-ip («Maydon Jamoa», hook → bloklar); metafora yo'q; bitta vizual — `TolovSahna` (telefon · to'lov xizmati · Backend; 2-ekranda 7-Modul olami o'sha shaklda; 12-ekranda jadval bilan); o'quvchining o'z mahsuloti — 13-ekran va bloklar. Keyssiz; Payme, Click, Stripe — 11-ekranda rasmiy fakt sifatida (keys emas).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 4, 6, 9, 11, 12 (va 0, 7, 13, 14, 15, 16) — matn-karta yo'q; bashoratlar tanlangach ixcham qator bo'lib qoladi; har harakatli ekranda faol element halqada, Mentor shu harakatni aytadi (bosqichga qarab).
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — O'lchov bo'limi (0 ta oshish).
- [x] Atamalar tayanch 2 bilan bir xil (to'lov xizmati, to'lov sahifasi, to'lov xabari, webhook, imzo, takror xabar, rad etilgan to'lov, test rejim, mashq to'lov, maxfiy kalit, to'lov oqimi sxemasi); siz-forma; tugma ot-shaklda («Nusxalash», «Bajardim», «Saqlash»); agent promptlari — T-002 istisnosi (lint warn 2 — prompt ichida); olam matni — T-008.
- [x] Testlar: variantlar bir shaklda, uzunligi ±15% (skript), ✔ yolg'iz eng uzun emas; kalit so'z/kod/qavs faqat to'g'rida emas (`200`, `401`, «rad» — distraktorlarda ham) · ✔: s3 C · s5 A · s8 D · s10 B · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (3, 5, 8, 10, 14).
- [x] Final: uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q (grep: o'quvchi matnida 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2 — faqat MD izohlarida; o'quvchiga «1-amaliyot», «2-amaliyot»; `m11-03`, kod raqami, «pilot», «sandbox», «idempotency» — faqat kartochkada «inglizchasi» bilan); modul raqami LMS bo'yicha («7-Modulda», «11-Modul»); tarixiy voqea yo'q · «KOD» (16) va «REPO» (5) ro'yxati to'liq.
- [x] Karta (`QURISH_KARTASI.md`) T · P · S ko'rildi: T-002 · T-008 · T-009 · T-010 · T-011 (to'lov xizmati → to'lov xabari → webhook → imzo → takror xabar → rad etilgan to'lov → test rejim → to'lov oqimi sxemasi — hammasi harakatdan keyin; sarlavhalarda yangi atama yo'q, «webhook» — faqat dars nomida va «Webhook hali qurilmagan» yakun holatida, 2-ekrandan keyin) ·
      T-014/015 («kalit» — faqat maxfiy kalit; sahna o'chirgichi «Takror tekshiruvi»; «test» — faqat «test rejim»; «xabar» — to'lov xabari) · T-016/017 (metafora yo'q) · T-024 · T-029 · T-034 · T-039 («Backend'ingiz» — 11-Moduldan bor) · T-042 · T-043 · T-044 · T-045 (imzo to'lov to'g'riligini ko'rsatmaydi; xabar bir marta kelmasligi mumkin; test rejim — real to'lovning nusxasi emas, 11-ekran) ·
      T-047 · T-048 · T-049 · T-052 (to'lov xabari 7-Moduldagi webhook bilan bir gapda tenglashtirildi) · T-064 · T-066 · T-070 · P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-020 (2-ekran ko'prigi) · P-025 · P-026 · P-028 · P-036 · P-046 · P-052 · P-055 · P-059 · P-062 · P-063 (`MENTOR_SXEMA`, `ISHLASH_TARTIBI`) · P-064 · P-065 (4-ekran) · P-067 ·
      S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 · S-018 (11-ekran brend izohlari) · S-019 · S-020 (`200`, `401` izohi 2-ekranda) · S-026 · S-040 · SABOQ 9, 11, 12, 13, 16, 17, 19–31, E 40–55.
