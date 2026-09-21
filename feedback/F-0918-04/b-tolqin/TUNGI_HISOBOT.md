# TUNGI HISOBOT — KATTA §41 B to'lqin (18.09 21:45 → 19.09 ertalab)

> Reja va qarorlar: `TUNGI_REJA.md`. Hech narsa push/deploy qilinmagan — hammasi lokal commitlarda.

## ☀️ ERTALABGI XULOSA (shu yerdan o'qing)

**Nima bo'ldi.** 151-qonun («topshiriq nishoni — faqat birinchi urinishga») endi **100 ta ekranda (66 dars)** ishlaydi:
topshiriq ostida «🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.» qatori, xatodan keyin jazosiz matn, xato
belgisi F5 dan keyin ham saqlanadi. Har ekran haqiqiy brauzerda 7 holat bilan isbotlandi (xato → nishon yo'q; F5 → belgi
turibdi; toza → nishon bor; sirpanish sanalmaydi; mashqda va nishon olingach qator yo'q). ⏭ o'tkazilgan ekran yo'q.

Bundan tashqari:
- **Ball halolligi (8-A):** **26 ta yakuniy tartiblash testi** endi birinchi to'liq urinishni sanaydi, F5 dan keyin ham
  (15 tasi oldin doim «to'g'ri» yozardi; 11 tasida birinchi urinish faqat xotirada edi — F5 bilan chetlab o'tilardi).
- **5 ta debug-ekran (Q6)** haqiqiy topshiriqqa aylandi — hamma qator bosiladi, tasdiqlagan matningiz bilan.
- **Teshiklar yopildi:** F5 dan keyin nishon qayta ochilishi (C-halol 21 ekran) · AuthEnv «qayta boshlash» · BotIntro
  `neverSilent` · PmLesson25 `proofFinder` · PmJtbd `jobHunter`.
- **Qonun va korpus:** 152-qonun reyestri (bonus 28 dars — hammasida ko'pi bilan bitta · mehnat 56) · KORPUS §183/§185.
- **Ikki adversarial tekshiruvchi** butun diff'ni o'qidi: mening o'zim kiritgan 2 ta YUQORI nuqsonni ushladi (Y1, Y1b —
  `onFinished` detallarida shartnomaga zid yozuv); ikkalasi tuzatildi va unit-test bilan qotirildi.

**Yakuniy regress (hamma tuzatishlardan keyin, 01:15):** ach-probe **131/131** (118 ekran, 76 dars — har birida xato →
nishon/ball yo'q, F5 → belgi turibdi, toza → bor) · `--seal` smoke CRM ro'yxati uz+ru **140/140** (I1–I12, shartnoma shakli
bilan) · gates 75 dars ✓ · til/dark tun boshiga nisbatan farq 0 · unit 12/12 · server 57/57 · vite build ✓.

**Lokal commitlar** (`16791ee` … hisobot), GitHub'dan ~19 commit oldinda.

## 🙋 SIZDAN KERAK — muhimlik tartibida

> **Tez javob uchun: `QARORLAR.md`** — kechagidek kartalar (misol · variantlar · tavsiya). Bir qatorda javob bering:
> «Q1-A, Q2-A, Q3 tavsiya bo'yicha, …».

1. **⚠ Solo ball teshigi** — `solo-ball.md`. Uyda o'tgan o'quvchining rasmiy natijasida yakuniy maxsus test (tartiblash,
   yozma kod — 45 ekran) hech qachon sanalmaydi → 5 savollik darsda maksimal 4/5. Kod bo'yicha zanjir to'liq tasdiqlangan,
   haqiqiy E2E sinov yo'q. Tuzatish — 37+ darsda bitta qator. **A — dushanbagacha tuzatamiz (tavsiya) · B — kutamiz.**
2. **Matnlar — `MATN_TAKLIFLAR.md` (49 taklif).** Eng muhimi: inventar bo'yicha 34 ekranda Mentor/audio/maslahat javobni urinishdan
   OLDIN aytadi — bunday ekranda «birinchi urinish» sharti bilimni emas, o'qishni tekshiradi (Q6 dagi 3 debug-ekran ham shunda).
> **TUZATISH 21.09:** quyidagi «⏸ 8 ekran» ro'yxati eskirgan. Oltitasi 19.09 da hal qilingan
> (nishon testga ko'chirilgan yoki 151-naqsh ulangan), ikkitasi — `BotApiButtons` s12 va `PmLesson20` s9 —
> 152-qonunga mos **bonus** bo'lib qoldi (foydalanuvchi qarori 21.09). Kodda birma-bir tasdiqlandi;
> holat `holat-P1/P4/P6.json` da ✅ ga o'tkazildi.

3. **⏸ 8 ekran** (ikkinchi tekin nishon yoki senariy): CssLesson1 s13 `bezak` · DbSqlNosql s3 · BotApiButtons s9/s11/s12 ·
   PmLesson19 s9 · PmLesson20 s4/s9 — har birida variantlar `holat-P*.json` da.
4. **Qolgan ball-testlar:** 7 ta diskret tanlov/ulash testi (8-A ga kirmagan; Routing s15 jonli darsda umuman yuborilmaydi) ·
   23 yozma test (diskret urinish yo'q — «bajarildi» bo'lib qoladi).
5. **Mayda qarorlar:** BotIntro — bitta topshiriqqa ikki nishon (`sheetMaster` + `neverSilent`) qolsinmi · PmLesson15 s4 UX
   (yechilgandan keyin boshqa qism bosilsa «yechilmagan»ga qaytadi — tungi ishdan oldin ham bor edi) · o'lik `earn` (4) tozalash ·
   KATTA §42 «nishon → Badge».
6. **Push → staging → prod.** Server kodi tunda o'zgarmadi; katalogda 4 ta tavsif yangilangan (F-0918-06) — keyingi deploy
   bilan. Ikki darsda test-kaliti `-1 → 0` — mentor darsni ochganda o'zi yangilanadi. Keyin `lms/` qayta yig'ish → CRM.

## Halol chegaralar

- Hamma brauzer-sinov — boshsiz Chrome, dars file:// da (esbuild). **Jonli LMS sessiyasida sinalmagan.** Mentor rejimi —
  statik (qator komponenti hamma darsda bir xil).
- Problar nishon va ballni tekshiradi, `onFinished` yuk shaklini emas — Y1/Y1b shu sababli tekshiruvchida chiqdi; endi
  unit-test va smoke I12 bor. Smoke MCQ shaklida urug'laydi — haqiqiy maxsus-ekran shakli faqat unit-testda.
- Solo teshik — faqat kod o'qish bilan.
- Tunda ikki marta jurnal vaqtini `date` siz yozib qo'ydim (tuzatildi; qoida xotirada).

## Qisqa holat

| Band | Holat |
|---|---|
| T0 A to'lqinni commit | ✅ `16791ee` · `9eda330` · `655cd93` |
| T1 vositalar | ✅ `codemod-achrule` · `ach-probe` (pilot 2/2, negativ nazorat ✓) |
| T2 mini-inventar | ✅ tashqi nishon 17 · ball-ekran 45 |
| T3 yo'riqnoma | ✅ |
| T4–T8b partiyalar | ✅ **6/6 partiya — 98 ekran + pilot 2 = 100 ekran** (P1 11 · P2 21 · P3 11 · P4 20 · P5 18 · P6 17) · ⏸ 8 · ⏭ 0 |
| T9 ball + 152-reyestr | ✅ 15 tartiblash testi — ball birinchi to'liq urinish (`cc5abaf` · `4e6c449`) · reyestr 152-qonunda |
| T10 matn takliflari | ✅ `MATN_TAKLIFLAR.md` — 49 taklif |
| T11 qonun/hujjat | ✅ 152-qonun 7-band + reyestr + ulash qoidalari · KORPUS §183/§185 · KATTA §41 (`278aeac`) |
| T11b adversarial tekshiruv | ✅ 2 o'tish (`TEKSHIRUV.md`, `TEKSHIRUV-2.md`): 2 YUQORI (Y1, Y1b) — tuzatildi · PmLesson21 `once` · O'RTA/PAST — ro'yxatda |
| T9c qo'shimcha | ✅ 01:51 — 18 «hisoblangan» test inventari: 11 tartiblash testida F5-teshik yopildi (`0cd0b1e`; prob 24/24, `--seal` 22/22); solo teshigi 63 ekran / 62 dars; 2 debug-test → Q4 |
| T12 regress | ✅ **yakuniy (hamma tuzatishlardan keyin):** ach-probe **131/131** (118 ekran · 76 dars) · `--seal` CRM ro'yxati uz+ru **140/140** (I1–I12) · gates 75 dars ✓ · til/dark tun boshiga nisbatan farq 0 · lint-keys 97 · lint:jsx · unit 12/12 · server 57/57 · vite build ✓ |
| T13 muhr | ✅ hisobot · DAVOM (19.09 00:30) · xotira · jurnal |

## Topilmalar (tun davomida)

1. **Pilot qatorining rangi o'qib bo'lmas edi** (18.09 kunduzgi pilot): `.ach-rule` rangi `ink3` — fonga kontrast
   2.22:1 (13px matn uchun kamida 4.5:1 kerak). Endi rang har dars palitrasidan kontrast bo'yicha tanlanadi: 95 darsda
   `ink2` (6.2–6.7:1), 2 darsda `ink3Deep` (4.74:1). Pilot ham tuzatildi.
2. **s13b (o'yin) sinovi beqaror edi** — paket harakatlanayotganda bosish jim e'tiborsiz qoladi (o'yin to'g'ri
   ishlaydi); sinov kutishni oshirib barqaror qilindi (3/3). Xulosa: animatsiyali ekranlarda prob `after` bilan kutadi.

3. **⚠ Solo ball teshigi (ehtimol — kod bo'yicha, sinovda tasdiqlanmagan):** 45 ta maxsus yakuniy test-ekran (tartiblash,
   yozma kod) javobni serverga faqat jonli darsda yuboradi. Uyda (solo) o'tgan o'quvchining rasmiy natijasi `live_answers`
   dan yig'iladi — bu savol u yerga yetmaydi → hisobda doim «javobsiz»: 5 savollik darsda maksimal 4/5. Staging'da buni
   tasdiqlaydigan tugallangan solo natija yo'q. Tekshirish va loyiha — T9b; kod o'zgarishi sizning qaroringiz bilan.
4. **Jonli darsda ham:** server dars yuborgan «to'g'ri/xato»ni emas, kalitni ko'radi; tartiblash testlarida kalit `-1` =
   «doim to'g'ri». Tartiblash testini birinchi urinishga o'tkazish uchun 4 ekranda kalit ham o'zgaradi (T9, 8-A doirasida).
5. **8-A dagi son aniqlandi:** 13 emas — 15 tartiblash testi; yana 7 ta diskret tanlov/ulash testi (8-A ga kirmagan —
   ertalab qaror); yozma 23 (32 emas).

6. **Qator topshiriq tugagach osilib qolardi (P3 topdi):** «…endi bemalol to'g'risini toping» muvaffaqiyat bloki ostida
   qolardi. Yagona qoida: qayta urinishli ekranda yakundan keyin yashiriladi; bir martalik (`once`) ekranda qoladi. Pilot ham
   moslandi, ishlayotgan agentlarga yetkazildi.

7. **BotIntro `neverSilent` 151-qonunni aylanib o'tardi:** xatodan keyin ham bayram chiqardi (`missed` tekshirilmagan).
   `sheetMaster` bilan bir xil shartga qo'yildi (1 qator). Ochiq savol: bitta topshiriqqa ikki nishon qolsinmi.
8. **Q6 dagi 3 ta debug ekran** (CssLesson1/2, Htmllesson2 s14) — endi haqiqiy topshiriq; lekin Mentor/maslahat hali ham
   javobni oldindan aytadi → matn tasdiqlanmaguncha amalda kafolatli (takliflar `matn-P1.md` da).

9. **⚠ Y1 — mening T9 ishim yangi nuqson kiritgan edi, tekshiruvchi ushladi:** `picked` 0/1 bo'lgach, tartiblash testlari
   `onFinished` detallariga savol matni va variantlarsiz yozuv bo'lib tusha boshladi (LMS shartnomasi bu maydonlarni
   majburiy qiladi; kechagi 422 aynan shu sinfdan edi). Bot-darslarda bu undan oldin ham bor edi. Markazda tuzatildi
   (variantsiz yozuv detallarga kirmaydi), unit-test va smoke'ga I12 invarianti qo'shildi. Brauzer-problar buni ko'rmagan
   edi — ular nishon va ballni tekshiradi, `onFinished` yuk shaklini emas.

10. **⚠ Y1b — Y1 tuzatishimda ham teshik qolgan edi, ikkinchi tekshiruvchi ushladi:** 3 ta tartiblash testida bo'lak
    yorliqlari `options` sifatida bor, `correctIndex` yo'q — filtrdan o'tib, «🔍 Detal» ni to'g'ri javob deb ko'rsatardi.
    Filtr endi `correctIndex` bo'yicha (shartnomada majburiy). Saboq: bitta tekshiruvchi yetmaydi — ikkinchi o'tish arzimaydi.
11. **Tashqi nishonlar ham birinchi urinishga:** PmLesson25 `proofFinder` (duelda tanlov qotmasdi) va PmJtbd `jobHunter`
    (xato javoblar bilan ham berilardi, tavsif esa «yechib chiqdingiz»). Negativ nazorat bilan isbotlandi.

## Jurnal

| Vaqt | Nima |
|---|---|
| 21:50 | T0: 3 commit (A to'lqin: muhrlash · 97 dars · hujjatlar). Oldidan: vite build ✓ · lint:jsx ✓ · unit 11/11 · sir-qidiruv toza |
| 21:52 | Zaxira taymer (har 20 daqiqa: :07 :27 :47) · T2 fonda boshlandi |
| 22:04 | T1 + T3 tayyor; pilot `AchRule` kanonik ko'rinishga (`once` + o'qiladigan rang) |
| 22:05 | Partiyalar P1 (1-Modull + pm) · P3 (3-Modull) · P6 (5-Modull) parallel boshlandi. T11: KORPUS §183 — bir martalik ekran matni + rang qoidasi; DARS_ETALON 152-qonun 7-band — 10 ta qaror aniqlashtirishi |
| 22:09 | T2 yopildi (17 tashqi nishon · 45 ball-ekran). Solo ball teshigi gipotezasi: server kodida zanjir tasdiqlandi (`enqueueSoloAttempt` → `live_answers`; maxsus ekranlar faqat `student` da yuboradi); staging'da dalil yo'q (yagona agent-arch solo urinishi tugallanmagan) → T9b |
| 22:11 | T9b: solo ball teshigi — zanjirning hamma bo'g'ini kodda tasdiqlandi (server `live_answers` · klient ildizi `live.mode === 'student'` · `submitAnswer` solo'da ishlaydi, lekin chaqirilmaydi); E2E sinov yo'q. Dalil + loyiha: `solo-ball.md`; kod — ertalab qaror bilan |
| 22:38 | **P3 ✅ (3-Modull):** 11/11 ekran. Mustaqil qayta tekshiruv: prob 16/16 · gates 11/11 · til/dark farq 0 · lint-keys 0 · `--seal` smoke uz+ru 22/22 → commit `524ac47`. Kodga tegilmagan: mehnat 7 · bonus 4. P2 ishga tushdi |
| 22:52 | P4 (4-Modull) va P5 (4c + 6-Modull) ishga tushdi. Prob: `hcOnboarded_` urug'i, skrinshot animatsiyadan keyin |
| 23:04 | **P1 ✅ (11 ekran, 3 Q6) · P6 ✅ (17 ekran).** Mustaqil qayta tekshiruv: prob 32/32 · gates 16/16 · til/dark farq 0 · lint-keys 0 · `--seal` 31/32 (PmLesson21 ru I6 — dars faqat o'zbekcha). BotIntro s7 `neverSilent` tuzatildi (prob 1/1). Commit `1a6bea5` (P1) · `e6e77b9` (P6) |
| 23:19 | **T9 1-qism ✅:** 6 yakuniy tartiblash testi (BotAiAgent/Brain/Project/FullProject s15, HtmlTakrorlash s11, ReactIntro s15) — ball endi birinchi to'liq urinish; kalit -1 → 0 ikki ekranda; `missTry` nishonsiz ekranni ham yozadi (F5). Prob `"test": true` rejimi qo'shildi; T9 6/6, negativ nazorat ✓, regress 16/16, `--seal` 12/12 → `cc5abaf` |
| 23:44 | **P5 ✅ (18) · P2 ✅ (21).** Mustaqil: prob 18/18 + 23/23 · gates 27/27 · til/dark 0 · lint-keys 0 · `--seal` — I10/I11 0 (✗ faqat I6: ruschasiz PM darslar) → `1bedbd1` · `270f96e`. T9 2-qismi (9 test) agentga berildi |
| 23:50 | **P4 ✅ (20; AuthEnv «qayta boshlash» teshigi yopildi).** Mustaqil: prob 23/23 · gates 12/12 · til/dark 0 · lint-keys 0 · `--seal` 24/24 → `7f285ee`. **Hamma 6 partiya yopildi: 100 ekran, ⏭ 0.** T10: `MATN_TAKLIFLAR.md` (49 taklif) |
| 23:53 | T11 ✅ (`278aeac`). Adversarial tekshiruvchi ishga tushdi (faqat o'qish; T9 fayllaridan tashqari) — probdan o'tib ketadigan nuqsonlarni qidiradi |
| 00:05 | T9 2-qismi (9 test) agentdan keldi; mustaqil: prob 15/15 · gates 9/9 · til/dark 0 · lint-keys 0 · `--seal` 18/18 |
| 00:06 | Adversarial tekshiruvchi: 137 komponent, 115 `miss`, 101 `AchRule`, 30 `onWrong` qo'lda o'qildi. **1 YUQORI (Y1)** — T9 tufayli variantsiz yozuv `onFinished` detallariga; 4 O'RTA (3 tasi ma'lum matn-masalasi) · 3 PAST. 1–8-tur tekshiruvlar toza |
| 00:13 | Y1 tuzatildi (`5261905`): filtr «na variant, na `correctIndex`» — MCQ ga ta'sir yo'q (427 `QuestionScreen` chaqiruvi); unit 12/12 · I12 bilan `--seal` 30/30. T9 2-qismi commit (`4e6c449`) |
| 00:14 | T12 yakuniy regress (1-o'tish): 75 dars gates ✓ · til/dark tun boshiga nisbatan farq 0 · lint-keys 97 · lint:jsx · unit 12 · server 57 · vite build ✓. Fonda: to'liq prob (129 spec) va CRM ro'yxati `--seal` (I12 bilan) |
| 00:18 | PmLesson21 s9 → `once` (1-tekshiruv PAST P1; har qator bir marta tekshiriladi) → `948b8d9` |
| 00:22 | 2-tekshiruv (T9 2-qism + Y1): **Y1b YUQORI** — tuzatildi `8ec93dd` (unit 12/12, isbot «kirmadi»). Tashqi nishonlar `proofFinder` · `jobHunter` → `0ddd58a` (prob 2/2, negativ nazorat ✓) |
| 00:25 | Eskirgan regress (tuzatishlardan oldin boshlangan) to'xtatildi; yakuniy regress hozirgi kod bo'yicha qayta boshlandi |
| 00:30 | T13: hisobot tepasi (xulosa · qarorlar · chegaralar), DAVOM 00:30 muhri, xotira → `738fa8c` |
| 00:48 | `--seal` smoke CRM ro'yxati uz+ru **140/140** (I1–I12) |
| 01:15 | ach-probe **131/131** (118 ekran · 76 dars). **Rejadagi hamma band (T0–T13) yopildi** |
| 01:25 | `QARORLAR.md` — ertalab uchun qaror kartalari (Q1–Q6) → `f8a1adb` |
| 01:30 | 18 «hisoblangan» test inventari: hammasida `correct` birinchi urinishdan, lekin 13 tasida F5-teshik; solo teshigi 18/18 → jami **63 ekran / 62 dars** → `73b753c` |
| 01:51 | **T9c ✅:** 11 tartiblash testida F5-teshik yopildi (PeanStack — kalit -1 → 0, jonli yuborish). Mustaqil: prob 24/24 (regress bilan) · gates 11/11 · til/dark 0 · lint-keys 0 · `--seal` 22/22 → `0cd0b1e` |
