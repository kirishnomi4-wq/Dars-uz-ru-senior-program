# F-1019-02 · CODE STRIKE arena savollari — LMS 2–10 (QUIZ_BANK) · 2026-10-19
Foydalanuvchi: «codestrike'larni LMS 2–10 modullarda ko'rib chiqishimiz kerak: ba'zi savollarda to'g'ri javob yo'q, ba'zilari tushunarsiz, ba'zilari juda uzun — qisqa, aniq, 15 soniyaga real o'quvchi ulgursin». Muddat 1–2 soat; keyin 2–14 hammasi bir yo'la LMS'ga yuklanadi.

## O'lchov (04:00, faylga tegilmagan)
Arena: savol + 4 variant birga chiqadi, 15 s (o'qish bosqichi yo'q) → ~10 s o'qish + 3–4 s bosish.
121 dars, 1440 savol (m2-16 PmMuammoIzlash — bank yo'q). Kalit indeksi xatosi 0, to'g'ri javob o'rinlari 360/360/360/360. Takror variant 1 (m7-06 — ataylab, harf shakli savoli).
Mezon 70/35/160 bo'yicha oshgan 762 · to'g'ri javob boshqalardan 1,3× uzun 91.

## Qarorlar (foydalanuvchi, 04:00)
- Me'yor: savol ≤ 60 · variant ≤ 30 · jami ≤ 140 belgi; to'g'ri javob eng uzun emas; `correct` o'rni o'zgarmaydi; ru ham yangilanadi. Shu bo'yicha 1011 savol oshadi.
- 9 agent parallel (har LMS moduli), faqat ro'yxat (`fix-m<N>.json`), faylga men qo'llayman (`vositalar/qolla.mjs` — faqat bank qatori).
- LMS 2–6 — darhol qo'llanadi; LMS 7–10 (src/5…8-Modull, QA seansi papkasi) — ro'yxat tayyor turadi, u seans tugagach qo'llanadi.

## Vositalar (`vositalar/`)
`qz.py` + `qz2.mjs` + `qz3.mjs` — App.jsx dan dars ro'yxati, bankni Node'da hisoblab eksport (m<N>.json) · `tekshir.mjs <N>` — tuzatish ro'yxati mezoni · `qolla.mjs <N…> [--quruq]` — bank qatorlarini almashtirish, qayta o'qib tekshirish.
Zaxira: `arxiv/F-1019-02-oldin/` (LMS 2–6, 71 fayl).

## Natija (04:45)
| LMS | Savol | O'zgardi | Holat |
|---|---|---|---|
| 2 | 168 | 79 | ✅ qo'llandi |
| 3 | 156 | 89 | ✅ qo'llandi |
| 4 | 180 | 102 | ✅ qo'llandi |
| 5 | 180 | 120 | ✅ qo'llandi |
| 6 | 168 | 152 | ✅ qo'llandi |
| 7 | 144 | 132 | ✅ qo'llandi |
| 8 | 168 | 137 | ✅ qo'llandi |
| 9 | 144 | 125 | ✅ qo'llandi |
| 10 | 132 | 117 | ✅ qo'llandi |
Jami 1440 savoldan 1053 tasi qayta yozildi (542 qo'llandi, 511 kutmoqda). Sabablar: uzun 1050 · to'g'ri javob uzunligidan sezilardi 152 · tushunarsiz 26 · darsda yo'q 21 · ikki to'g'ri javob 9 · javob yo'q 3 · kalit xato 1.

**Tekshiruv:** har ro'yxat `tekshir.mjs` — xato 0, me'yordan oshgan qolmadi. LMS 2–6: 70 fayl `npm run gates`, har birida tell/emoji soni zaxiradan ko'p emas (aksariyatda tell kamaydi, masalan ReactProjectDay 8→3, FullPipelineProject 4→0); boshqa darvoza yiqilmadi; `lint:jsx` toza; `vite build` toza.
Qo'llash paytida tutilgan va tuzatilgan: PmLesson1 #9 (faqat to'g'ri javob katta harfda), ReactIntro #8 («muharrir» → til qoidasi), PmLesson17 #1 («-ku» yuklamasi), 3 savolda variantlar ruschasiz satrga aylangan edi (ReactProjectDay #3, Routing #10, PostgresCrud #11) — {uz, ru} ga qaytarildi. LMS 7–10: zaxira nusxada tell yurgizildi — 18 savolda yangi tell (strelka/backtick/atama faqat to'g'ri variantda) → ro'yxatda tuzatildi, qayta tekshiruv toza.
**Tuzoqlar:** (1) PmLesson5 bankida yozuvlar ko'p qatorli — birinchi qo'llovchi faqat bir qatorni almashtirib, sintaksis buzardi; qayta o'qish tekshiruvi ushladi, qo'llovchi yozuv chegarasini oraliq bo'yicha topadigan qilindi. (2) Tirnoqsiz heredoc backtick'ni bajardi — 3 variantdan `rang`/`hodisa`/`ochdi` tushib qoldi, tirnoqli heredoc bilan tiklandi (xotira «Jurnalga xavfsiz yozish»). (3) `while read` oxirgi qatorsiz faylda oxirgi faylni o'tkazib yubordi — qayta yurgizildi.

## LMS 7–10 ni qo'llash (QA seansi tugagach)
```
node feedback/F-1019-02-codestrike/vositalar/tekshir.mjs 7   # 8, 9, 10 ham
node feedback/F-1019-02-codestrike/vositalar/qolla.mjs 7 8 9 10 --quruq
node feedback/F-1019-02-codestrike/vositalar/qolla.mjs 7 8 9 10
```
Keyin har fayl `npm run gates` (tell/emoji zaxira bilan solishtirib — `vositalar/darvoza.sh`), `lint:jsx`. Qo'llovchi faqat bank yozuvini almashtiradi; fayl o'rtada o'zgargan bo'lsa ham ishlaydi (indeks bo'yicha), lekin kalit `correct` mos kelmasa — o'sha faylni qo'llamaydi.

## Mazmun xatolari (javob yo'q · ikki javob · kalit xato · darsda yo'q) — mentor ko'rsin
- LMS 2 · `InternetLesson.jsx` #0 · ikki-javob — Savol 78 belgi; «Wi-Fi routerga» varianti ham bahsli (so'rov texnik jihatdan routerdan o'tadi, router darsda o'tilmagan).
- LMS 2 · `PmLesson1.jsx` #3 · ikki-javob — Jami 171; «Sayt xuddi shunday ishlayveradi» texnik jihatdan ham to'g'ri — almashtirildi.
- LMS 2 · `Htmllesson1.jsx` #6 · darsda-yoq — Savol 66 belgi; `meta` darsda o'tilmagan.
- LMS 2 · `PmLesson2.jsx` #1 · ikki-javob — Jami 180; «Menyu va qidiruv qatori» ham tepada turadi — bahsli, darsdagi bo'limlarga almashtirildi.
- LMS 2 · `CssLesson1.jsx` #1 · ikki-javob — «Teg» varianti ham to'g'ri deb olinishi mumkin edi (`h1` — teg nomi); «Izoh» bilan almashtirildi.
- LMS 2 · `CssLesson2.jsx` #6 · ikki-javob — «margin: auto» ham elementni gorizontal markazga qo'yadi (o'quvchi «margin: 0 auto»ni ko'rgan) — almashtirildi.
- LMS 2 · `HtmlPractice.jsx` #6 · darsda-yoq — Savol 66 belgi; `meta` hech qaysi darsda o'tilmagan.
- LMS 2 · `DeployLesson.jsx` #10 · darsda-yoq — Darsdagi promptda telefon/kompyuterga moslash yo'q; savol darsdagi «har sahifada menyu bir xil tursin» shartiga almashtirildi.
- LMS 3 · `JsFunctionsLesson.jsx` #5 · javob-yoq — zarar(5) = 5 * 3 = 15, lekin variantlarda 15 yo'q, kalit 25 ga qo'yilgan edi.
- LMS 3 · `JsFunctionsLesson.jsx` #11 · javob-yoq — zarar(4) = 4 * 3 = 12, lekin to'g'ri variantda «16» yozilgan edi.
- LMS 3 · `PracticeLesson2.jsx` #0 · darsda-yoq — «Vibecoding» so'zi darsda umuman yo'q; to'g'ri javob eng uzuni edi.
- LMS 3 · `PracticeLesson3.jsx` #9 · darsda-yoq — «Ro'yxat → narx → ko'rinish» tartibi darsda yo'q; darsda reja: ro'yxat → kartochkalar → toifa/qidiruv.
- LMS 3 · `PracticeLesson4.jsx` #8 · darsda-yoq — «Oxirgi yaxshilanish» atamasi darsda yo'q; «Buyurtma berish» tugmasi uyga vazifada bor.
- LMS 4 · `ReactIntroLesson.jsx` #8 · darsda-yoq — Darsda oddiy DOM ta'riflanmaydi, faqat Virtual DOM («sahifaning xotiradagi yengil nusxasi») o'rgatiladi.
- LMS 4 · `ReactBuildSiteLesson.jsx` #9 · darsda-yoq, kalit-xato — Darsda fetch/API yo'q: taomlar App.jsx dagi massivdan keladi, kalit «API (fetch)» noto'g'ri edi.
- LMS 5 · `DataIntroLesson.jsx` #2 · darsda-yoq — Uzun edi; «brauzer keshi» darsda o'tilmagan — darsdagi «havoda» bilan almashtirildi.
- LMS 5 · `RoutingLesson.jsx` #7 · darsda-yoq — «Shablon» so'zi darsda yo'q — darsdagi «joy belgisi» olindi.
- LMS 6 · `NestArchPracticeLesson.jsx` #7 · darsda-yoq — `where` sharti bu darsda o'rgatilmagan; darsdagi agent ishini tekshirish so'raladi.
- LMS 6 · `NestArchPracticeLesson.jsx` #11 · darsda-yoq — `relations` bu darsda o'rgatilmagan; darsdagi 403 debug misoli so'raladi.
- LMS 6 · `CiCdIntroLesson.jsx` #7 · darsda-yoq — «Artefakt» atamasi darsda o'rgatilmagan; darsdagi «o'raydi» ta'rifi bilan so'raladi.
- LMS 6 · `CiCdIntroLesson.jsx` #10 · darsda-yoq — Rollback bu darsda o'rgatilmagan; darsdagi «yo'lovchi eski saytni ko'radi» fakti so'raladi.
- LMS 6 · `FullPipelineProjectLesson.jsx` #4 · darsda-yoq — `${{ secrets }}` yozuvi bu darsda o'rgatilmagan; darsdagi «kalit ulanmasa — 401» fakti so'raladi.
- LMS 6 · `FullPipelineProjectLesson.jsx` #5 · darsda-yoq — Sinov reysi (staging) bu darsda o'rgatilmagan; darsdagi START SIGNALI fakti so'raladi.
- LMS 6 · `FullPipelineProjectLesson.jsx` #6 · darsda-yoq — Production/staging farqi bu darsda o'rgatilmagan; darsdagi jurnal (skip) fakti so'raladi.
- LMS 6 · `FullPipelineProjectLesson.jsx` #11 · darsda-yoq — Mustaqil parallel nuqtalar bu darsda o'rgatilmagan; darsdagi «qo'lda tekshirish xavfi» so'raladi.
- LMS 6 · `PmLesson18.jsx` #1 · ikki-javob — «Chiqqandan keyin — sayt tez ochilsin uchun» varianti ham vaqt bo'yicha to'g'ri edi; variantlar uzun.
- LMS 7 · `BotAiProjectLesson.jsx` #0 · javob-yoq — «To'g'ri» variant «texnologiya va token yo'q» degan, darsda esa ular promptda aytilmaydi (repo va .env'da); darsdagi sabab — juftlar va tugma turi yo'q.
- LMS 7 · `BotFeedbackIterationLesson.jsx` #4 · darsda-yoq — Darsda voronka ekrani yo'q; darsda faqat «ketib qolish (drop-off)» kartasi bor: o'sha qadamda nimadir xalaqit beradi.
- LMS 7 · `BotFeedbackIterationLesson.jsx` #5 · darsda-yoq — «Menyu tugmasi, 60 dan 15 ga» darsda yo'q; darsdagi misol — narx shikoyati (18 kishi). Savol 96 belgi edi.
- LMS 8 · `PmLesson23.jsx` #11 · ikki-javob — Savol uzun edi; «kod yozgan dasturchi» ham ilovani yaratayotgan odam bo'lgani uchun ikkinchi to'g'ri javobga o'xshardi.
- LMS 8 · `PmLesson24.jsx` #11 · ikki-javob — Variantlar uzun edi; «kodni yozadigan dasturchi» ham ilovani yaratayotgan odam bo'lishi mumkin edi.
- LMS 9 · `PmDesignMotionLesson.jsx` #0 · darsda-yoq — Behance darsda faqat nomi bilan bor, ta'rif Dribbble uchun berilgan; jami 172.
- LMS 9 · `PmUserStoryPitchLesson.jsx` #8 · darsda-yoq, javob-yoq — Darsda tinglovchi yozmaydi va slayd baholamaydi — eslab qolgan odamini aytadi, qatorni so'zlovchi yozadi; asl to'g'ri javob darsda yo'q edi.
- LMS 10 · `EventTrackingLesson.jsx` #0 · darsda-yoq — Variantlar 39 belgigacha; «analitika» so'zi darsda o'tilmagan, darsda «harakat jadvalga yoziladi».
- LMS 10 · `ProductionDeployLesson.jsx` #7 · darsda-yoq — Darsda GET / va 503/200 kodlari o'tilmagan; dars `/health` Database'ni so'ramasligini o'rgatadi.
- LMS 10 · `PmYearPathLesson.jsx` #5 · ikki-javob — Jami 183 belgi; «bozor va do'konlar» hayotda ham to'g'ri bo'lardi — savol internet xaridiga aniqlashtirildi.

## LMS 7–10 qo'llandi (19.10, foydalanuvchi: «LMS 7–10 tayyor qilindi, codestrike barchasini qil»)
Oldin: 49 fayl banki eksport bilan solishtirildi — farq 0 (QA seansi banklarga tegmagan). Zaxira `arxiv/F-1019-02-oldin/` (7–10 ham). `qolla.mjs 7 8 9 10` → 511 savol. `darvoza-7-10.txt`: 49 fayl, boshqa darvoza yiqilmadi, tell/emoji hech birida ko'paymadi; `lint:jsx` toza; `vite build` toza.
**LMS 11–14** (636 savol, 554 me'yordan oshgan): 4 agent ro'yxat tayyorlamoqda (`scratchpad/cs14`, sinov skripti `sinov.sh` — tell/til nusxada oldindan tekshiriladi); fayllar QA seansi papkasida — bo'shatilgach qo'llanadi.

## LMS 11–14 ro'yxati (19.10)
| LMS | Savol | O'zgardi | Holat |
|---|---|---|---|
| 11 | 192 | 178 | ✅ qo'llandi |
| 12 | 144 | 128 | ✅ qo'llandi |
| 13 | 144 | 133 | ✅ qo'llandi |
| 14 | 156 | 117 | ✅ qo'llandi |
Sabablar: {'uzun': 553, 'togri-uzun': 32, 'darsda-yoq': 5, 'javob-yoq': 1, 'ikki-javob': 3, 'tushunarsiz': 10}.
Qo'shimcha (men): PmOneOnOne #9 — variantlardan modul raqami olindi; DemoPrep #7, PmFinalPitch #1, PmMoneyTalk #10 — son/nom/«» faqat to'g'ri variantda edi; BreakAndFix #1 — o'qituvchi eslatmasidagi fakt o'rniga «connect har qayta ulanishda». Hammasi `tekshir.mjs` va `sinov.sh` (nusxada tell/til) toza.
Qo'llash (fayllar QA seansidan bo'shagach): avval bank eksport bilan solishtiriladi (farq 0 bo'lishi kerak), keyin `qolla.mjs 11 12 13 14`, `darvoza.sh`.

### Mazmun xatolari, LMS 11–14
- LMS 11 · `PmFinalIdeaLesson.jsx` #3 · darsda-yoq, javob-yoq — Darsda jamoa yig'ishda 3 o'yinchi yozuvi bor va uchalasi kun belgilagan (belgi 3 / 3); «5 tadan 4 tasi» darsda yo'q.
- LMS 11 · `PmRoadmapLesson.jsx` #3 · ikki-javob — «12–13-Modulda tugaydi» chalg'ituvchisi ham to'g'ri deb o'qilardi (ufq 12–13-Modul), almashtirildi; qisqartirildi.
- LMS 11 · `FeatureTwoLesson.jsx` #4 · ikki-javob — «Ilovani o'chirib qo'yadi» qayta ochish ma'nosida to'g'ri bo'lib qolardi (ochilganda son keladi); chalg'ituvchi almashtirildi, qisqartirildi.
- LMS 12 · `BreakAndFixLesson.jsx` #1 · darsda-yoq — Urinishlar soni faqat o'qituvchi eslatmasida; savol darsdagi «connect har qayta ulanishda ishlaydi» faktiga o'tkazildi.
- LMS 12 · `PmGrowthPitchLesson.jsx` #6 · darsda-yoq — «Unicorn» va Uzum keysi darsdan olib tashlangan (fayl boshidagi izoh: «Olindi: … Uzum keysi»); savol darsdagi grafik mashqiga almashtirildi.
- LMS 13 · `StabilizeDayLesson.jsx` #11 · ikki-javob — Jami 161 belgi; «namuna deb belgilanib qoladi» ham sanoqdan chiqaradi (8-darsdagi namuna tekshiruv hisobi) — ikkinchi to'g'ri javobga o'xshardi, almashtirildi.
- LMS 14 · `PmFinalPitchLesson.jsx` #2 · darsda-yoq — «Eski gapning bir qismini olib tashlash» qisqartirilgan darsda yo'q; darsda uzaygan gap vaqti taymer bilan tekshiriladi.
- LMS 14 · `VideoPortfolioLesson.jsx` #3 · darsda-yoq — Backend'ni uyg'otish bu darsda yo'q; o'rniga darsdagi ssenariy qoidasi so'raldi.

## LMS 11–12 qo'llandi (19.10, foydalanuvchi: «11–12 ni qil, 13–14 ustida ishlayapmiz»)
28 fayl banki eksport bilan solishtirildi — farq 0 (QA seansi 7 faylga 20 daqiqa ichida yozgan, banklarga emas). Zaxira `arxiv/F-1019-02-oldin/`. `qolla.mjs 11 12` → 306 savol. `darvoza-11-12.txt`: 28 fayl, boshqa darvoza yiqilmadi, tell/emoji ko'paymadi; yozilgandan keyin 306/306 yangi savol faylda turibdi; `lint:jsx` toza; `vite build` toza.
LMS 13–14 (250 savol) — ro'yxat tayyor, QA seansi ishlayapti, kutadi.

## LMS 13–14 qo'llandi (19.10 ≈06:40, foydalanuvchi: «qolgan ishlarni tugataylik»)
25 fayl banki eksport bilan solishtirildi — farq 0. Zaxira `arxiv/F-1019-02-oldin/`. `qolla.mjs 13 14` → 250 savol, faylda 250/250. `darvoza-13-14.txt`: 25 fayl, boshqa darvoza yiqilmadi, tell/emoji ko'paymadi.
**Jami:** LMS 2–14 — 2076 savoldan 1609 tasi qayta yozildi va qo'llandi. QA seansi bir vaqtda 9–14 da ishladi — har qo'llashdan keyin saqlanganlik tekshirildi (hammasi joyida).
