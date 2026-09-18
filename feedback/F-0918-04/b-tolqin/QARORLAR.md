# QARORLAR — ertalab uchun (19.09)

> Kechagidek: har savolda misol, variantlar va tavsiyam. Javob bir qatorda bo'lsa yetadi, masalan:
> **«Q1-A, Q2-A, Q3: hammasi tavsiya bo'yicha, Q4-A, Q5-B …»**. Tafsilot kerak bo'lsa — fayl nomi yonida.
> Hech biriga tunda tegilmadi (kod ham, matn ham).

## Q1. ⚠ Solo ball teshigi — `solo-ball.md` (eng muhim)

**Misol:** o'quvchi «AI-agent nima» darsini uyda o'tadi, 5 savolning hammasiga to'g'ri javob beradi. Yakuniy savol —
tartiblash (s15). Uning javobi serverga faqat jonli darsda yuboriladi → rasmiy natijada 4/5, «hammasi to'g'ri» nishoni
imkonsiz. 45 ekranga (44 dars) tegishli bo'lishi mumkin; kod-zanjir to'liq tasdiqlangan, haqiqiy sinovda ko'rilmagan.

- **A (tavsiya):** tuzatamiz — dars ildizida `live.mode === 'student'` → `student || solo` (37+ darsda bitta qator; tunda
  qilingan «birinchi urinish» o'zgarishi bilan birga to'g'ri ishlaydi). Keyin lokal server sinovi + staging'da bitta haqiqiy
  solo o'tish. O'zgarish faqat darslarda — server-deploy shart emas, `lms/` qayta yig'iladi. Dushanbagacha ulguriladi.
- B: hozircha tegmaymiz; avval staging'da solo o'tib, teshikni ko'z bilan ko'ramiz, keyin qaror.
- C: Axadulla/Kristina bilan kelishamiz (server tomonida hal qilish).

## Q2. Matnlar — `MATN_TAKLIFLAR.md` (49 taklif)

**Misol:** CssLesson2 debug-ekrani — Mentor «display: flex emas, block yozilgan!» deydi, keyin o'quvchidan xato qatorni
topish so'raladi. Birinchi urinish sharti bu yerda o'qishni tekshiradi, bilimni emas.

- **A (tavsiya):** faylni ochib, partiya bo'yicha tasdiqlaysiz («P1 ok, P3-2 yo'q, P4-5: …»); men kiritaman → metodist →
  👦 o'quvchi 2-o'qish → `lint:til`.
- B: men 49 ni ikki guruhga ajratib beraman: «javobni oldindan aytadi» (muhim) va «tavsif/i18n» (kichik) — avval birinchisi.
- C: matnni o'zingiz yozasiz.

## Q3. ⏸ 8 ta ekran — ikkinchi tekin nishon yoki senariy

| # | Ekran | Muammo | Variantlar (tavsiya — birinchisi) |
|---|---|---|---|
| a | CssLesson1 s13 `bezak` | istalgan 3 chip qabul — tekin; darsda bonus bor (`rang`) | **A** s12 testga («ichki bo'shliq qaysi xususiyat?») ko'chirish + tavsif «Ichki bo'shliq xususiyatini topdingiz» (matn-P1.md, tayyor) · B `rang` o'rniga shu bonus |
| b | DbSqlNosql s3 `packageMaster` | karta o'zi to'g'ri joyga tushadi; darsda bonus bor (`connector`) | **A** s3b testga ko'chirish + yangi tavsif · B bosish ham tekshirilsin (mexanika o'zgaradi) · C bonus almashsin |
| c | BotApiButtons s9 / s11 / s12 | 4 nishondan 3 tasi tekin, `graduate` yo'q | **A** (matn-P6.md, tavsiflar tayyor): s12 `neverSilent` — darsning yagona bonusi (tavsif rost); s9 → s10 testga («Tugma signalini qaysi qator ushlashini topdingiz»), s11 → s14 testga («Chaqiruv so'zlarining farqini topdingiz») · B (inventar taklifi): bonus s9, s11 → s10, s12 → s14 |
| d | PmLesson19 s9 `fullHouse` | istalgan tartibda 20 chiqadi; bonus bor (s4) | **A** kodda tayyor `kamKordi` sharti — kam beradigan joyni bosish = urinish · B s11 testga |
| e | PmLesson20 s4 / s9 | ikkalasi kafolatli; s9 senariyda ataylab ishtirok nishoni | **A** s4 → 151-naqsh (uch variantli tanlov bor), s9 — senariy bo'yicha bonus qoladi · B pm-senariyni ko'rib chiqamiz |

## Q4. Qolgan ball-testlar (8-A ga kirmagan)

**Misol:** Routing s15 — yakuniy test jonli darsda serverga umuman yuborilmaydi (ball yo'q); DataIntro s15 — tanlovli
test, xato tanlasa ham ball «to'g'ri».

- **A (tavsiya):** 7 diskret tanlov/ulash testini ham birinchi urinishga o'tkazamiz (tungi naqsh bilan, prob bilan);
  Routing s15 yuborilishi tuzatiladi. 23 yozma test — «bajarildi» bo'lib qoladi (diskret urinish yo'q) va buni 151-qonunga
  ochiq yozamiz.
- B: faqat Routing s15 (ball umuman yo'qolayotgani uchun), qolgani keyin.
- C: tegmaymiz.
(Kechasi yana 18 ta «hisoblangan» test-ekran tekshirilyapti — natija `inventar-hisoblangan.md` da.)

## Q5. Mayda qarorlar

- **BotIntro s7:** bitta topshiriqqa ikki nishon (`sheetMaster` + `neverSilent`) — **A** qoladi (ikkalasi ham birinchi
  urinishga; `neverSilent` qo'shimcha shart — Sardorni ham ushlash) · B bittasiga birlashtiramiz.
- **PmLesson15 s4** (tungi ishdan oldin ham bor edi): yechilgandan keyin boshqa qism bosilsa ekran «yechilmagan»ga qaytadi,
  «Davom» o'chadi — **A** `if (done) return;` bilan yopamiz · B tegmaymiz.
- **O'lik `earn` (4 ta:** BotFeedbackIteration `neverSilent`, JsConditions `logician`, JsVars/PeanStack `coder`): **A** tozalaymiz · B qoladi.
- **KATTA §42 «nishon → Badge»:** qachon? **A** CRM-yuklashdan keyin, alohida kun · B hozir.

## Q6. Chiqarish tartibi

- **A (tavsiya):** 1) `! git push origin main` (GitHub zaxira) · 2) Q1 bo'yicha qaror → kerak bo'lsa tuzatish · 3) matnlar
  (Q2) · 4) to'liq sinov-aylanishi · 5) `lms/` qayta yig'ish (prod manzili) + md5 + `CRM_YUKLASH_ROYXATI.md` · 6) server-deploy
  (faqat katalog tavsiflari — shoshilinch emas) · 7) CRM'ga yuklash.
- B: avval push + `lms/` (tunda qilingani bilan), matnlar keyingi yuklashda.
