# 14-Modul (LMS) — manba (0-bosqich, 08.10.2026, F-1008-551)

> Faqat faktlar: dastur, App.jsx, 13-Moduldan keladigan holat, o'tilgan atamalar, tekshirilgan tashqi faktlar, keyslar. Qarorlar — `qaror-0.json` (TAXMIN bilan), tayanch — `00-MODUL-TAYANCH.md`.
> 13-Modul holati o'qilgan payt: `feedback/F-1007-13modul` oxirgi commit `e3d665b` + ishchi daraxtdagi o'zgarishlar (08.10 02:30 gacha; 13-Modul seansi tunda 10–12-darslar Filtrini qilmoqda — MD lar hali o'zgarishi mumkin).

## 1. Dastur v9 — 14-modul «BITIRUVCHI (Выпускник) + PERFORMANCE» (17 qator, 15.5–16.5-oy, ≈6 hafta, 2-bosqich yakuni)
Maqsad (so'zma-so'z): «Investorlar hakamlar hay'ati oldida final himoya. Mahsulot texnik jihatdan yarqiraydi. TEXNIK CHO'QQI: performance + polish + agent bilan demo-test. Keyingi qadamga tayyorgarlik.»
Javob: TEX 3 · AI-PRAKT 1 · PM+PRAKT 1 · PM 9 · Demo Day 1 + marosim · Rezerv 1 = 17.
| № | Tip | Mavzu | Mazmun | Natija |
|---|---|---|---|---|
| 1 | PM | Структура питча инвестору | Muammo → Bozor → Yechim → Metrikalar → Jamoa → Keyin; YC Demo Day tahlili | Pitchning birinchi chernoviki |
| 2 | PM | Storytelling: история продукта | 5 daqiqa pitch — hikoya, ficha ro'yxati emas | O'zini videoga yozadi |
| 3 | TEX | Performance: скорость продукта (CHO'QQI) | Lighthouse, lazy load, bundle hajmi | Mahsulot tezroq: oldin/keyin o'lchov |
| 4 | AI-PRAKT | Финальный polish: анимации демо | Demo uchun mikro-o'zaro ta'sirlar (9-modul mahorati maksimumda) | Mahsulot demoda «yarqiraydi» |
| 5 | PM | Питч-тренинг 1 | Guruh oldida pitch — qattiq fidbek | Tuzatishlar ro'yxati |
| 6 | TEX | Подготовка демо продукта | Stresssiz jonli ko'rsatish; texnik risklar, B reja; feature freeze | Repetitsiya qilingan demo |
| 7 | PM+PRAKT | Демо-тест: продукт глазами инвестора | GIBRID: demo-risklar chek-listi → agent bilan progon: o'quvchi buzadi (tarmoq uzilishi, bo'sh data, ikki klik), agent tuzatadi | Demo 3 progonni xatosiz o'taydi + B reja ishlaydi |
| 8 | PM | Питч-тренинг 2 (финальный) | Tuzatishlar + taymer bilan final repetitsiya | Final pitch tayyor |
| 9 | TEX | Видео-портфолио | O'zi va mahsuloti haqida 3 daqiqalik video (frilans/stajirovka uchun) | Tayyor video-portfolio |
| 10 | PM | Что дальше: фриланс и стажировка | Birinchi buyurtma (Upwork, lokal bozor) + kompaniyaga xat, suhbat | Birinchi buyurtma rejasi + 2 kompaniyaga xat |
| 11 | PM | Международные программы | Y Combinator, Diamond Challenge, lokal grantlar | 1 dastur + boshlangan ariza |
| 12 | PM | Финальная 1-на-1 с ментором | Keyingi 6 oyga shaxsiy reja | Yozma reja |
| 13 | PM | Генеральная репетиция | Real hakamlar oldidan to'liq progon | — |
| 14 | REZERV | Подготовка зала | Tashkiliy dars | — |
| 15 | PM | Встреча выпускников | O'tgan bitiruvchilar bilan networking | — |
| 16 | DEMO | Demo Day 8 — Bitiruv himoyasi | Hakamlar: 5–7 investor va tadbirkor | 5 daqiqa pitch + Q&A |
| 17 | MAROSIM | Выпускной — Bitiruv marosimi | Sertifikatlar, video-portfolio, g'oliblar | — |
Dars sifat filtri (dastur, v8.1): har dars kamida bittasidan o'tadi — ko'rsatsa bo'ladigan artefakt · real element (jonli foydalanuvchi, ma'lumot, sandbox pul) · texnik darsda «sindir va tuzat» · PM-qaror shu darsda yoki jonli odam bilan.
**MD — 1–13-darslar (foydalanuvchi tasdiqlagan, F-1008-550).** 14, 15, 16, 17 — App.jsx da `comp` siz qator (11-Modul «Demo Day 7», 13-Modul «Zaxira dars» naqshi).

## 2. App.jsx — hozirgi holat (08.10 02:30)
- `// ---- 11-Modul` izoh-qatori (183-qator) va `id: '11'` bloki — ro'yxatda oxirgi (13-Modul; `m11-03` va `m11-06` ga `comp` ulangan — 13-Modul seansi tunda pilot quryapti). Oxirgi qator: `m11-13` «Zaxira dars» (`type: 'Rezerv'`, `comp` siz).
- 14-Modul bloki undan keyin: `id: '12', slug: 'm12', period: 'oy 15.5–16.5', stage: 2`. 14-Modul 1-darsining «oldingi darsi» — 13-Modul «Zaxira dars».
- Tip naqshi: PM va PM+PRAKT — `type: 'PM'` · AI-PRAKT — `type: 'Proyekt'` · TEX — `type: 'Kod'` · zaxira — `'Rezerv'` · Demo Day — `'Demo'` (11-Modul `m9-17` naqshi) · marosim — `'Demo'` (yoki alohida — qaror sahifasi).
- Komponent nomlari (taklif; `src/` da band emas — grep 08.10 02:33): `PmInvestorPitchLesson` · `PmStoryPitchLesson` · `ProductSpeedLesson` · `PolishDayLesson` · `PmPitchTrainingLesson` · `DemoPrepLesson` · `PmDemoTestLesson` ·
  `PmFinalPitchLesson` · `VideoPortfolioLesson` · `PmFreelanceLesson` · `PmProgramsLesson` · `PmNextStepsLesson` · `PmDressRehearsalLesson`.

## 3. 13-Moduldan keladigan holat (`feedback/F-1007-13modul/00-MODUL-TAYANCH.md`, GATE M ✅)
- **Mentor misoli «Maydon Jamoa»** (mahalla mini-futboli; tashkilotchi o'yin e'lon qiladi, o'yinchilar «Qo'shilaman»; «8 / 10»; namuna o'yin «Shanba, 18:00 · Mahalla maydoni»). Repo `maydon-jamoa`: `mobil/` · `backend/` (NestJS, Neon, Render) · `prototip/` · `lending/`.
  13-Modul oxirida bor: freemium + tashkilotchi uchun **Pro** (30 kun, «Doimiy o'yin»), test rejimdagi to'lov (`tolovlar`, `POST /tolov/webhook`, «mashq to'lov» sahifasi), `lending/oferta.html`, Telegram xabari, taklif kodi va mukofot, `XATOLAR.md`.
- **Oxirgi teg:** `m13-dars-12-done` (barqarorlashtirish; yangi versiya) → 14-Modul boshlanishi `m14-dars-01-start` = `m13-dars-12-done`.
- **Mentor sonlari (13-Modul 1.13 — boshqa son yo'q):** ro'yxatdan o'tgan 44 (11 sinfdosh) → taklif havolasidan +7 → **jami 51** · asosiy harakat 24 (+4 taklifdan) · qaytganlar 61 dan 26 (43%) · to'lgan o'yinlar haftada 1, keyin 3 · tashkilotchilar **6** ·
  narx **15 000 so'm / 30 kun** (4-dars; Render pullik 7 dollar/oy ≈ 83 000 so'm, kurs 07.10) · pul suhbatlari 3: ha · yo'q · qimmat · **3 yozma tasdiq** (15 000 — 2, 10 000 — 1) · taklif havolasi: 18 tashrif · 7 ro'yxat · 4 asosiy harakat ·
  12-dars: 5 tekshiruvdan 4 buzilmadi, 1 buzildi → tuzatildi. Telegram'ni ulaganlar va Pro'ni yoqqanlar soni **yo'q** — to'qilmaydi.
- **Mentor pitchi** (12-Modul 12-darsi, `pm-m10d12-pitch`): besh bo'lak — Muammo · Yechim · Jonli demo · Raqamlar (o'sish grafigi 20 → 38 → 44, halol gap: «44 kishidan 11 tasi — sinfdoshlarim; ikkinchi haftada o'sish sekinlashdi») · Keyingi qadam; 5 daqiqa; baholash varag'i ✓/✗.
  11-Modul 16-darsi (Demo Day 7): «muammo → yechim → jonli demo».
- **Refleksiya** (13-Modul 11-darsi, `pm-m11d11-refleksiya`) — 14-Modul 12-darsi (6 oylik reja) shuni o'qiydi. Mentor javobi 3: «To'lashga tayyorligini yozgan uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinab ko'raman.»
- **13-Modul 12-darsi chegarasi** (tayanch 1.12): «Performance va "investor ko'zi bilan" demo-test — bu darsda yo'q (14-Modul ishi)».
- **Saqlash kalitlari** (14-Modul o'qishi mumkin): `pm-m10d12-pitch` · `pm-m10d10-hisobot` · `pm-m11d1-birlik` · `pm-m11d2-model` · `pm-m11d4-narx` · `pm-m11d9-tasdiq` · `pm-m11d11-refleksiya` · `pm-m9d5-prd` · `pm-m9d6-roadmap` · `pm-m9d8-platforma` (trek).

## 4. O'tilgan atamalar (grep 08.10: 9–13-Modul MD v3, 9–12-Modul YAKUNIY, `src/7…11-Modull`)
| Atama | O'tilganmi | Qayerda / izoh |
|---|---|---|
| pitch · zal · baholash varag'i · fidbek · bosh raqam · metrika · taymer · repetitsiya | **ha**, ko'p | 10, 11, 12-Modul (12-Modulda 439 joy «pitch») — 14-Modul shu so'zlar bilan |
| jonli demo · B reja / zaxira reja · feature freeze | **ha** | 11-Modul 16 («jonli demo»), 12-Modul («zaxira reja» — 10-dars; «feature freeze» 23 joy) |
| animatsiya · mikro-o'zaro ta'sir | **ha** | 9-Modul (animatsiya darslari), kodda 86+ joy |
| video | **ha** | 11-Modul (ekran videosi — demo B rejasi) |
| portfolio | **ha** (10-Modul) | 10-Modul «Bir yilda nimalarni qurdingiz?» (`m8` PmYearPath) — portfolio so'zi 51 joy |
| investor | qisman | 9, 10-Modul (keys tilida) |
| storytelling / hikoya | **yo'q** | «hikoya» moslashuvlari — «hikoyat» (shikoyat); storytelling o'tilmagan |
| Y Combinator / YC · Demo Day | YC **yo'q** (kodda «yc» — CSS prefiks); Demo Day — ha (7-Demo Day) | — |
| Lighthouse · lazy load · bundle · kesh | **yo'q** | 14-Modul 3-darsida birinchi marta |
| hakam | **yo'q** | Demo Day 8 — birinchi marta |
| frilans · stajirovka · rezyume · Upwork · grant | **yo'q** (rezyume 3 joy — tasodifiy) | 10, 11-darsda birinchi marta |
| MAU | 4 joy (12-Modul — ishlatilmaydi deb) | 12-Modul atamasi: «faol foydalanuvchi» ishlatilmaydi |

## 5. Tekshirilgan tashqi faktlar (08.10.2026; rasmiy sahifa, iqtibos aynan)
- **Lighthouse — Performance bahosi** (developer.chrome.com/docs/lighthouse/performance/performance-scoring, Lighthouse 10): First Contentful Paint 10% · Speed Index 10% · Largest Contentful Paint 25% · Total Blocking Time 30% · Cumulative Layout Shift 25%.
  Ranglar: «0 to 49 (red): Poor; 50 to 89 (orange): Needs Improvement; 90 to 100 (green): Good». 100 ga yetish «extremely challenging».
- **Expo bundle** (docs.expo.dev/guides/analyzing-bundles): SDK 51+ — Expo Atlas: `EXPO_ATLAS=true npx expo start` (Shift + M → dev tools); aniqroq o'lchov — `EXPO_ATLAS=true npx expo start --no-dev`; eksport — `EXPO_ATLAS=true npx expo export` → `npx expo-atlas .expo/atlas.jsonl`.
  Web uchun: `npx expo export -p web` → `npx lighthouse <url> --view`. «Avoid publishing source maps to production».
- **Lazy load** (web.dev/articles/browser-level-image-lazy-loading): `<img src="image.png" loading="lazy" alt="…" width="200" height="200">` · «Don't lazy-load images that are likely to be in-viewport when the page loads, especially LCP images.»
- **Render** (12-Modul tayanchi 6, render.com/docs/free, 06.10): bepul xizmat 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa — **demo xavfi** (6, 7, 13-darslar: demo oldidan uyg'otish yoki B reja).
- **Diamond Challenge** (diamondchallenge.org/competition, 08.10.2026): «Teams must consist of 2-4 high school students aged 14-18 at the submission deadline» · «one adult advisor aged 21 or older» · worldwide (pitch event hamkorlari 28 joyda; O'zbekiston ro'yxatda yo'q) ·
  ikki yo'nalish: Business Innovation, Social Innovation · 2027: ro'yxat 16.09.2026 ochilgan · topshirish muddati **14.01.2027** (5PM EST) · finalistlar 09.03.2027 · Summit 29–30.04.2027 · sovrin fondi 100K dollar. Qatnashish puli — sahifada aniq yozilmagan («free resources»).
- **Y Combinator** (ycombinator.com/faq, 08.10.2026): yosh haqida FAQ da hech narsa yo'q; «You can certainly apply when you are a full-time student or employee, but we expect the founders to commit to working full-time on their company during the batch».
  Early Decision (ycombinator.com/early-decision): «designed for students who want to finish their degree before starting a company» — daraja (universitet) talabasiga qaratilgan; maktab o'quvchisi haqida aniq gap yo'q.
  Ikkinchi darajali manbalar (Fortune 2025, TechCrunch): YC odatda 18 yoshdan kichiklarni ko'rmaydi, istisnolar bo'lgan — **rasmiy qoida emas, darsda da'vo qilinmaydi**.
- **Upwork** — rasmiy sahifalar (upwork.com/legal, support.upwork.com) 403 bilan yopiq (bot himoyasi) → **rasmiy matnda tekshirilmadi**. Bir nechta mustaqil manba va Upwork hamjamiyati postlari: hisob ochish uchun 18 yosh (yoki mamlakatdagi balog'at yoshi).
  Darsda: «Upwork kabi xalqaro saytlar — 18 yoshdan; o'shagacha — lokal buyurtma, ota-ona bilan» (tayanchda TAXMIN; tasdiq — foydalanuvchidan).
- **Lokal grantlar (O'zbekiston, yoshlar):** bu tunda rasmiy manba bilan tekshirilmadi — darsda nom aytilmaydi, «tashkilotchi bilan aniqlanadi» (TAXMIN savoli).

## 6. Keys banki (K1–K19) — ishlatilishi va 14-Modulga nomzodlar
Qoida (PM-016): bosh-keys **modul ichida** takrorlanmaydi; mintaqaviy (K1, K2) — mavzu yo'l qo'ysa har 8-darsda; raqam faqat yili bilan.
Qo'shni modullarda: 10-Modul — K9, K1, **K12** · 11-Modul — K18, K14, K4, K15, K16, K1, K10, K19 · 12-Modul — K3, K8, K6, K5, K1 · 13-Modul — K2, K17.
| Dars | Mavzu | Nomzod (bank «Темы» bo'yicha) |
|---|---|---|
| 1 · pitch tuzilmasi | структура питча · питч инвестору | **K12 Airbnb pitch deck** — «Темы: структура питча · питч инвестору · storytelling»; raqamsiz; 10-Modulda bosh-keys bo'lgan (boshqa modul — ruxsat); dasturdagi «YC Demo Day tahlili» bankda **yo'q** → TAXMIN savoli |
| 2 · storytelling | презентация продукта | **K19 Apple iPhone** — «Темы: … презентация продукта»; 2007, «uch qurilma bittada» hikoya bilan taqdimot; raqamsiz (taqdimot sanasi 9.01.2007) |
| 3 · performance | tezlik | **K13 Telegram** — «скорость delivery» (yetkazish tezligi — performance emas; mos emas) → keyssiz (TEX) |
| 5, 8, 13 · pitch mashqi | — | keyssiz (12-Modul 12-dars naqshi) |
| 10 · frilans · 11 · dasturlar · 12 · reja | — | bankda mos keys yo'q → keyssiz yoki K1 (mintaqaviy, har 8-darsda) — qaror sahifasi |

## 7. Dars turi → qolip va ekran soni (13-Modul 7-bo'lim tajribasi)
| Tip | Darslar | Qolip · ekran |
|---|---|---|
| PM (keysli) | 1, 2 | ≈15–16 ekran (QKirish · QReja · QTushuncha · QVoqea · QTest · QMustaqil · podium · kartochkalar · yakun) |
| PM (keyssiz; mashq/real odam) | 5, 8, 10, 11, 12, 13 | 12 ekran (12-Modul 11-dars shakli) |
| TEX | 3, 6, 9 | texnik dars + repo bloki, 18–20 ekran (6 va 9 — kodi kam: qaror sahifasida ekran soni) |
| PM+PRAKT | 7 | **12 ekran:** PM nazariya → 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun |
| AI-PRAKT | 4 | loyiha kuni: **8 ekran + 3 blok + kartochkalar = 12** |
| ZAXIRA · tadbir | 14, 15, 16, 17 | `comp` siz qator, MD yo'q |

## 8. Halollik chegarasi (prompt 8-bo'lim)
- Hakamlar, investorlar, bitiruvchilar — o'ylab topilmaydi; Demo Day hakamlari haqida faqat dastur gapi («5–7 investor va tadbirkor»), ism yo'q.
- O'smirning yuzi, ismi, ovozi (video, 9-dars) — ixtiyoriy; ommaviy joylanmaydi (havola orqali); ota-ona roziligi — qaror sahifasi.
- Frilans/xalqaro dasturlar: yosh chegarasi, muddat, pul — faqat rasmiy manba bilan; tekshirilmagani aytilmaydi. Kafolat gaplari («albatta qabul qilinasiz») yo'q.
