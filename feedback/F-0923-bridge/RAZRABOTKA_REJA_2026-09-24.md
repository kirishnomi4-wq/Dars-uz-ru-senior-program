# Bridge darslari — RAZRABOTKA REJASI va TUNGI AVTOPILOT · 2026-09-24

> Foydalanuvchi (23:50): «darslar rejasi tayyor · mentor kod kiritadi · eski Supabase · dizayn hozirgi PM darsidan (rang, umumiy joylar), qolgani vaziyatga qarab, o'quvchiga vizual yoqsin, keraksiz narsa bo'lmasin · men uxlayman, avtopilotda ishla, har 20 daqiqada tekshir, ertalab umumiy hisobot · Vercel'ga men ertalab ko'rib aytaman».
> **Chegaralar:** commit YO'Q · deploy YO'Q · LMS darslariga, `src/live/` umumiy fayllariga, `dars-api` ga, mentor saytiga TEGILMAYDI.

## 1. Jonli ball — eski Supabase (tekshirildi 23:52)

- Loyiha `dwoubexcexzsinogojiu.supabase.co`, publishable kalit eski darsda (`feedback/lms-sinov-2026-09-09/16-eski-InternetLesson-177ee1a.jsx`). `live_sessions` · `live_players` · `live_answers` → HTTP 200.
- RPC nomlari va parametrlari hozirgi `useLiveSession.js` bilan **aynan bir xil** (create_session · join_session · advance_session · session_heartbeat · end_session · reveal_screen · set_quiz_keys · quiz_control · submit_answer). Faqat `record_attempt` Supabase'da yo'q — mijoz 3 marta urinib jim yutadi (analitika kerak emas).
- Farq faqat o'qish-transportida: sessiya `live_sessions?pin=eq.X` (massivning birinchisi), o'yinchilar/javoblar — jadval-select.
- **Yechim — umumiy faylga tegmasdan:** `src/bridge/liveClientSupabase.js` — `src/live/liveClient.js` ning barcha eksportlari bilan bir xil interfeys, transporti Supabase. `vite.bridge.config.js` da maxsus `resolveId`-plugin faqat `src/live/` ichidan `./liveClient.js` importini shu faylga yo'naltiradi. LMS yig'malari, mentor sayti, 97 dars — o'zgarmaydi.
- Mentor kodi `create_session` da so'raladi (Supabase tomonda). Jonli sinov: 1 mentor + 2 o'quvchi (Playwright), podium 0 emas.

## 2. Sayt tuzilishi

| | |
|---|---|
| Papka | `src/bridge/` — `BridgeMain.jsx` · `BridgeApp.jsx` (bosh sahifa: 4 o'tish kartasi → darslar ro'yxati) · `lessons.js` (import.meta.glob — yozilmagan dars «Tayyorlanmoqda») · `bridgeCard.js` (karta + 4 tayyor g'oya) · `liveClientSupabase.js` · 7 dars fayli `src/bridge/lessons/` da |
| Kirish | `bridge.html` → build'da `index.html` ga qayta nomlanadi (mentor sayti naqshi) |
| Build | `vite.bridge.config.js` → `dist-bridge/` · `npm run build:bridge` |
| lessonId | `bridge-b1-v1` … `bridge-b7-v1` (Supabase'da boshqa darslar bilan to'qnashmaydi) |
| Karta darsdan darsga | localStorage `ccBridgeCard` (kim · qachon · nimasi og'ir · sayt nima qiladi · odam nimaga erishadi · 1-bo'lak · shartlar · 5 gap · 3 kadr) — kartasiz o'quvchiga 4 tayyor g'oya |
| Til | UZ + RU (`tr({uz,ru})`, RU_I18N_SPEC) |

Fayllar: `BridgeKimUchun.jsx` (1/2-o'tish 1-dars) · `BridgeMuammoniTopamiz.jsx` · `BridgeBirinchiVersiya.jsx` · `BridgeKimUchunMuammo.jsx` (3/4-o'tish 1-dars) · `BridgeNimaQuramiz.jsx` · `BridgeQandayKorsatamiz.jsx` · `BridgeMalumotIshonch.jsx`.

## 3. Dizayn yondashuvi

- **Asos — PM-STUDIA pasporti (PM_DARS_ETALON 1-bo'lim), o'zgarmaydi:** `T` tokenlar (indigo `#5B3DE6`, fon `#F2F0FA`, yashil faqat bajarildi, qizil faqat haqiqiy xato), Source Serif 4 · Manrope · JetBrains Mono, oq karta + indigo soya, layout 1100px, xira LiveBadge, arena CodeStrike brendi, reduced-motion.
- **Umumiy joylar P0 dan (`src/pm/PmUserStoryLesson.jsx`):** ekran-karkasi, mentor-bloki, test-karta + reveal, RecapOverlay, flashcard, nishonlar, podium, arena, onboarding, progress-saqlov, jonli-ball skeleti — **ko'chiriladi**, qayta ixtiro qilinmaydi.
- **Har dars o'z imzo-vizuali (vaziyatga qarab, bitta):** 1-dars OLX bosh sahifasi → karta sahifaga aylanadi · 2-dars taksi ilovasi sxemasi, «aniq gap» konstruktori · 3-dars 8 bo'lak → 🔥 uchta, buvi tushunish chizig'i · Uzum darsi — ilova sxemasi + to'rt belgi · taksi-biz-qursak — to'rt katak (🎯🏔🌱⏳) + buyurtma oynasi · ko'rsatuv — uch kadr lentasi + tinglovchi kursisi · YouTube — xotira tugmalari, ochiq/yopiq ikki tomon, uch qavat lifti.
- **Keraksiz narsa yo'q:** senariyda yo'q ekran/element qo'shilmaydi; dekor faqat dars atamasidan; har ekran ≤400 belgi; AI-so'rov yig'mada; P0 dagi texnik (kod-kompilyator, uy vazifasi) qismlar olib tashlanadi.
- **Brend nomlari:** real mahsulot sxemalari **brendsiz** chiziladi (logotip yo'q), nom faqat senariy aytgan joyda matnda.

## 4. Har dars zanjiri (CLAUDE.md A-retsepti, GATE S o'tgan — quruvchidan)

pm-quruvchi (+SCREEN_INTENTS) → pm-dizayn → darslik-jonli → 👦 darslik-oquvchi (1-o'qish) → pm-metodist → 👦 2-o'qish → pm-tekshiruvchi → darslik-verifikator → pm-qabulchi.
Har qadamdan keyin `npm run gates -- <fayl>` (esbuild · jsx · dark · til · prompt) — 0 xato. **GATE 2 va GATE 3 — foydalanuvchiniki**: tunda imzo qo'yilmaydi, ertalab ko'rik uchun «tayyor» deb belgilanadi.
Maks 2 QA-aylanish; hal bo'lmasa — hisobotga «qaror kerak».

## 5. Tartib (tungi)

| # | Ish | Holat |
|---|---|---|
| 0 | Infra: Supabase-adapter · bridge sayt karkasi · vite config · build · jonli sinov-skripti | ✅ 00:00 |
| 1 | **1-dars pilot** «Kim uchun» — to'liq zanjir, qolipni qotiradi (karta, AI yig'ma+zaxira, tayyor g'oyalar, podium) | quruvchi ✅ 00:29 · dizayn ✅ 00:53 (6/6) · jonli ✅ 01:05 (Supabase: 14 javob, podium 4/4·0/4) · 👦1 ✗ · metodist ✅ 01:22 (6/6) · 👦2 ✅ · tekshiruvchi ✅ 02:01 (120 tartib ✓) · QA-1 ✅ · verifikator ❌→tuzatildi 03:35 (RU Mentor, ustun) · yakuniy umumiy verifikator |
| 2 | 2-o'tish 2-dars + 3-dars — parallel | 2-dars quruvchi ✅ 00:44 · dizayn ✅ 01:17 · jonli ✅ 01:30 (Supabase 14 javob) · 👦1 ✗ · metodist ✅ 01:52 · 👦2 ✅ · tekshiruvchi ✅ 03:27 (6/6) · verifikator — yakuniy umumiy · 3-dars quruvchi ✅ 01:41 · dizayn ✅ 03:31 (6/6) · jonli+metodist — keyin |
| 3 | 3/4-o'tish 1-dars + 2-dars — parallel | 1-dars quruvchi ✅ 03:26 (6/6) · dizayn ✅ 04:43 (6/6) · 2-dars quruvchi ✅ 03:56 · jonli batch ⏳ · dizayn ✅ 04:31 (6/6) |
| 4 | 3-o'tish 3-dars + 4-o'tish 3-dars — parallel | 3-o'tish 3-dars quruvchi ✅ 04:01 (6/6) · 4-o'tish 3-dars quruvchi ✅ 04:05 (6/6) · jonli ✅ 04:21 (ikkalasi) · 3-o'tish 3-dars dizayn ✅ 04:38 (6/6) · 4-o'tish 3-dars dizayn ✅ 04:51 (6/6) |
| 5 | Yakun: `npm run build:bridge` · jonli sinov (mentor + 2 o'quvchi) har darsda · lokal preview skrinshotlari · ertalabki hisobot | ✅ 08:02 — 7/7 dars 👦2 · tekshiruvchi · verifikator IMZO; jonli qayta sinov 7/7 (bazadan); hisobot `ERTALAB_HISOBOT_2026-09-24.md` |

## 6. Avtopilot qoidalari

- Har 20 daqiqada tekshiruv: agentlar holati → keyingi qadam → shu fayl 5-bo'limi + `TUNGI_JURNAL_2026-09-24.md` ga vaqt (`date`) bilan yozuv.
- Xato chiqsa: tashxis → tuzatish → darvozalar; 2 aylanishdan keyin hal bo'lmasa — to'xtatilmaydi, keyingi darsga o'tiladi, hisobotda ochiq yoziladi.
- Halollik: tekshirilmaganni «tekshirildi» demaslik; ko'z bilan ko'rilgan skrinshot bo'lmasa — «ko'rilmagan».
- Ertalab: `feedback/F-0923-bridge/ERTALAB_HISOBOT_2026-09-24.md` — har dars: tayyorligi, darvozalar, jonli sinov, skrinshotlar, ochiq qarorlar; build buyrug'i; «Vercel'ga chiqarish» — faqat buyruq bilan.
