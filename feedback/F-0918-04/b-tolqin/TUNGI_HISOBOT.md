# TUNGI HISOBOT — KATTA §41 B to'lqin (18.09 21:45 → 19.09 ertalab)

> Har band yopilganda yangilanadi. Oxirgi yangilanish vaqti — pastdagi «Jurnal» ning oxirgi qatori.
> Reja va qarorlar: `TUNGI_REJA.md`. Hech narsa push/deploy qilinmagan.

## Qisqa holat

| Band | Holat |
|---|---|
| T0 A to'lqinni commit | ✅ `16791ee` · `9eda330` · `655cd93` |
| T1 vositalar | ✅ `codemod-achrule` · `ach-probe` (pilot 2/2, negativ nazorat ✓) |
| T2 mini-inventar | ✅ tashqi nishon 17 · ball-ekran 45 |
| T3 yo'riqnoma | ✅ |
| T4–T8b partiyalar | ✅ **6/6 partiya — 98 ekran + pilot 2 = 100 ekran** (P1 11 · P2 21 · P3 11 · P4 20 · P5 18 · P6 17) · ⏸ 8 · ⏭ 0 |
| T9 ball + 152-reyestr | 🔄 6 tartiblash testi ✅ (`cc5abaf`) · qolgan 9 — agent ishlayapti |
| T10 matn takliflari | ✅ `MATN_TAKLIFLAR.md` — 49 taklif |
| T11 qonun/hujjat | 🔄 §183 uchinchi matn + 152-qonun 7-band (qarorlar) yozildi |
| T12 regress | ⬜ |
| T13 muhr | ⬜ |

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
