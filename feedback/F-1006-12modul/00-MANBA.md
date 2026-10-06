# LMS 12-Modul «Real vaqt: WebSocket + ishga tushirish — flagman» — manba (konveyer 0-bosqich)

Kod: `src/10-Modull` · kalitlar `m10-NN` · App.jsx `id: '10'` (✅ qo'shildi 06.10 12:51 — 13 qator, `comp` siz) · 06.10.2026 · F-ID 350 dan
Bu fayl — faktlar yig'indisi (dastur, App.jsx, grep, rasmiy hujjat). Qarorlar — qaror sahifasidan keyin `GATE_M_JAVOB.md` ga, tayanch — `00-MODUL-TAYANCH.md` ga.

## 1. Dastur v9 — 12-modul (13 dars)

Maqsad (dasturdan): **50+ real foydalanuvchili jonli mahsulot va real vaqt funksiyalari.** G'oya: «Foydalanuvchilaringiz ketyapti → ularni qaytaradigan jonli tizim quring».
**Texnik cho'qqi-flagman:** WebSocket / real vaqt (+ telefonda push, v8.1). TEX 2 · AI-PRAKT 2 · PM+PRAKT 3 · PM 5 · zaxira 1 · Demo Day yo'q. ≈4,5 hafta, jadvalda 13,5–14,5-oy.
Dastur izohi: bu modulda alohida Demo Day yo'q — 50+ foydalanuvchi va real vaqt natijalari 14-Modul bitiruv himoyasining (Demo Day 8: 5 daqiqa pitch + savol-javob) asosiy dalili.
Infratuzilma eslatmasi (dastur): «Expo akkauntlari va o'quvchilar telefonlarida Expo Go — 11-modulgacha; **APK tarqatish testi — 12-modulgacha**».

| № | Tip | Mavzu (dastur) | Mazmun | Natija |
|---|---|---|---|---|
| 1 | PM | Lending + kopirayting | Mahsulotning bir sahifaligi, CTA | Lending e'lon qilingan |
| 2 | TEX | WebSocket — real vaqt asoslari (cho'qqi-flagman) | Doimiy ulanish va HTTP; socket.io; mahsulotida real vaqt qayerda kerak | Mahsulotining real vaqt oqimi sxemasi |
| 3 | PM+PRAKT | Real vaqt funksiyasi spetsifikatsiyasi | GIBRID: mini-PRD (hodisalar, holatlar, chekka holatlar) → agent jonli yangilanishlarni quradi | Jonli yangilanishlar o'z talabi bo'yicha ishlaydi |
| 4 | AI-PRAKT | Jonli xabarlar + presence (v8.1) | «Kim onlayn», hodisa bo'yicha xabar; mobil trekda — telefonda push (Expo Notifications) | Presence + xabarlar mahsulotda |
| 5 | TEX | «Buz va tuzat» | Ulanish uzilishi, hodisa dublikatlari, reconnect — o'quvchi buzadi, agent tuzatadi | 3 topilgan va tuzatilgan muammo |
| 6 | PM | Jalb qilish kanallari | Instagram, Telegram, maktab chatlari; birinchi post | Birinchi post e'lon qilingan |
| 7 | PM+PRAKT | 50 foydalanuvchi strategiyasi + ishga tushirish (v8.1) | GIBRID: yig'ish rejasi yoziladi VA ishga tushadi; mobil trek do'konsiz — Expo Go / APK | 20 foydalanuvchi + 50 gacha reja harakatda |
| 8 | PM+PRAKT | Xatti-harakat tahlili + iteratsiya | GIBRID: voronka — qayerda ketishadi → gipoteza → shu darsda tuzatish | 2 ketish nuqtasi topilgan, iteratsiya chiqarilgan |
| 9 | AI-PRAKT | Real vaqt retention mexanikasi | Foydalanuvchini qaytaradigan xabar (hodisa → push), talab — o'quvchidan | Jonli foydalanuvchilarda retention mexanikasi |
| 10 | PM | 50 foydalanuvchi tekshiruvi | Mentor metrikani tekshiradi; o'sish bo'lmasa antikrizis reja | Metrika hisoboti + reja |
| 11 | PM | Mentor bilan yakkama-yakka | Progress + tuzatishlar | Tuzatilgan pitch |
| 12 | PM | Metrikali pitch | Metrikalar + o'sish trayektoriyasi; grafiklar — dalil | Pitch repetitsiyasi |
| 13 | ZAXIRA | Repetitsiya / zaxira | Taymer bilan to'liq o'tish | — |

**Keyingi modullar shu mahsulotga tayanadi:** 13-modul — yunit-ekonomika, narx va paywall (mobil trekda web sahifa orqali Click/Payme), to'lov webhook'i, retention (email/push), referal · 14-modul — bitiruv himoyasi.
13-Modul 8-darsi ham «retention mexanikalari» — 12-Modul 9-darsi bitta mexanika quradi, mavzuni tugatmaydi.

## 2. App.jsx — hozirgi holat (06.10 12:40)

- ✅ **06.10 12:51 dan bor** (01-FILTR 1): `// ---- 10-Modul` izoh-qatori (11-Modul importlaridan keyin) va `id: '10'` bloki (`id: '9'` dan keyin) — `id: '10', slug: 'm10', title: 'Real vaqt va ishga tushirish', period: 'oy 13.5–14.5', stage: 2`, 13 qator, `comp` siz. Qayta yaratilmaydi; «qur» da faqat `comp` va import qo'shiladi, aniq Edit bilan (App.jsx ni to'rt seans tahrirlaydi).
- 11-Modul oxiri: `m9-16` «G'oyangiz va ilovangiz guruhni ishontiradimi?» → `m9-17` **«Demo Day 7»** (`type: 'Demo'`, `comp` siz) → **`m10-01`**. 12-Modul 1-darsining «oldingi darsi» — «Demo Day 7».
- Zaxira dars namunasi: `{ key: 'm8-13', n: 13, type: 'Rezerv', emoji: '📅', title: 'Zaxira dars', sub: 'yetib olish / sayqallash' }` (`comp` siz).
- `period` ketma-ketligi: `m9` «oy 12–13.5» → `m10` «oy 13.5–14.5» (dastur bilan bir xil).
- PM+PRAKT darslari App.jsx da `type: 'PM'` (9-Modul `m7-06`, 11-Modul `m9-13` naqshi); AI-PRAKT — `type: 'Proyekt'`; TEX — `type: 'Kod'`.

## 3. 11-Moduldan keladigan holat (tayanch `feedback/F-1005-11modul/00-MODUL-TAYANCH.md`, tasdiqlangan)

- **Mentor misoli — «Maydon Jamoa»** (mobil ilova: tashkilotchi o'yin e'lon qiladi, o'yinchilar «Qo'shilaman» ni bosadi; «8 / 10»). Repo `maydon-jamoa`: `prototip/` · `mobil/` (Expo Router) · `backend/` (NestJS, TypeORM, Neon; Render).
  Oxirgi teg — `m11-dars-15-done` (kutish yozuvi). Uch funksiya: o'yin e'loni va qo'shilish · o'yin kuni tasdiq · chiqish va navbat.
- **«Keyinroq (12–13-Modul)» ufqidagi ishlar** (tayanch 1.5): **o'yindan oldin eslatma (push)** — RICE 15 · **ro'yxat o'zi yangilanadi (real vaqt)** — RICE 10. Uzoqroq — maydon pulini bo'lishish.
- **Real vaqt nuqtalari** (11-Modul 8-darsi): «8 / 10» · qo'shilganlar ro'yxati · o'yin kunidagi «Kelaman» belgilari. 11-Modulda ilova ekran ochilganda va pastga tortib yangilaganda so'raydi (web-trekda — «Yangilash» tugmasi).
- **Uch risk** (11-Modul 15-darsi, tayanch 1.9): 1) Render bepul xizmati uxlaydi → kutish yozuvi (bajarilgan) · 2) **12-Modulda 50 foydalanuvchi kerak, hozir 3 sinovchi** → mahalla futbol guruhidan 10 kishini sinovga chaqirish ·
  3) **Expo Go — sinash vositasi, hamma o'yinchida yo'q → 12-Modulda APK** («APK — Android uchun, iPhone yo'li alohida qaror»).
- **Mentor pitchining keyingi qadami** (11-Modul 16-darsi): «Mahalla futbol guruhidan 10 kishini sinovga chaqiraman, keyin o'yindan oldin eslatma qo'shaman.»
- **Kirish:** `oyinchilar` (`id` · `ism` · `telefon` · `parol_hash`); sinovchilar namuna telefon bilan ro'yxatdan o'tgan (o'z raqamini yozmagan). ⚠️ 50 real foydalanuvchida haqiqiy telefon raqami yig'iladi — qaror savoli (maxfiylik).
- **Saqlash kalitlari** `pm-m9dN-…`: 12-Modul o'qishi mumkin bo'lganlar — `pm-m9d4-final` (muammo gapi) · `pm-m9d5-prd` (yechim, bosh raqam) · `pm-m9d6-roadmap` · `pm-m9d8-platforma` (trek) · `pm-m9d13-sinov` · `pm-m9d15-reja` · `pm-m9d16-pitch`.
- **10-Moduldagi o'z analitika tizimi** («Maydon» sayti, repo `maydon` — boshqa repo): jadval `hodisalar` (`nom` · `brauzer_id` · `yaratilgan`), `hodisaYoz(nom)`, `GET /hodisalar/sanoq`, `/dashboard` (har 5 soniyada so'raydi — polling), Umami ikkinchi manba.
  «Maydon Jamoa» repo'sida bu tizim **yo'q** — 12-Modulda kerak bo'lsa, qayta quriladi (qaror savoli).

## 4. O'tilgan atamalar (grep 06.10: 5/6-Modul YAKUNIY, 9/10/11-Modul MD v3, `src/**/*.jsx`)

Modul raqami bu jadvalda — **LMS raqami** (o'quvchiga shunday aytiladi); fayl yo'li — kod raqamida.

| Atama (dastur) | Avval o'tilganmi | Qaysi so'z bilan · qayerda |
|---|---|---|
| WebSocket | **yo'q** (faqat nomi) | 10-Modul 3-darsi: «Backend sahifaga o'zi hech narsa yubormaydi» (WebSocket — MD izohida); 11-Modul 8-darsi: «ekran o'zi yangilanishi (WebSocket) — 12-Modulda», o'rgatilmagan |
| socket.io | **yo'q** | yangi |
| real vaqt | ha (qisman) | 11-Modul 8-darsi: **«real vaqt nuqtasi»** — ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy. 10–11-Modul taqiqlarida: real-time → «real vaqt» |
| polling | ha | 7-Modul (bot: polling va webhook); 10-Modul 3-darsi: «sayt Backend'dan qayta-qayta so'raydi», asosiy fe'l — «so'raydi». WebSocket shu bilan solishtiriladi |
| push | ⚠️ boshqa ma'noda | butun kursda «push» = `git push` (2-Modul Git darsidan); 8-Modul navigatsiyasida «push/pop» (ekran suriladi). Bildirishnoma ma'nosida 11-Modulda ataylab ishlatilmagan — **«o'yindan oldin eslatma»** |
| bildirishnoma | so'z sifatida ha | 8-Modul RN darsi: «telefonning kamerasi, bildirishnomalari kabi imkoniyatlari»; 11-Modul 6-darsi maketi: «telefonning qulf ekrani, bildirishnoma». 10-Modul 7-darsida — «ilovaga ogohlantirish» (monitoring) |
| presence / onlayn | **yo'q** | 10-Modulda «onlayn», «Hozir saytda» ataylab ishlatilmagan («Oxirgi 5 daqiqada» — birligi brauzer). Yangi tushuncha — so'zi qaror sahifasida |
| reconnect, dublikat | **yo'q** | yangi (5-dars) |
| voronka | tushunchasi ha, so'zi yo'q | 9–10-Modul: **«uch qadam»** (ochdi → vaqtni tanladi → band qildi), «voronka» va «zanjir» ishlatilmagan; 9-Modul 6-darsi: «voronka — chuqur mavzu, keyingi darsda». «Foiz» — qadamdan qadamga o'tganlar foizi («konversiya», «ulush» yo'q) |
| retention | ha | 7-Modul `PmLesson21`: **«qaytganlar foizi»** — «inglizchasi: retention»; K5 Duolingo shu darsda ishlatilgan |
| metrika, bosh raqam | ha | 7-Modul: metrika — sanaladigan raqam; bosh raqam (10–11-Modul); 11-Modul Mentor misolida — «haftada to'lgan o'yinlar» |
| gipoteza, tajriba | ha | 10-Modul 4-darsi: «Agar … qilsak, … o'zgaradi, chunki …» |
| CTA | ha (uzoqda) | 2-Modul `PmLesson2`: «CTA — harakatga chaqiruvchi tugma»; keyingi modullarda ishlatilmagan |
| lending, kopirayting | **yo'q** | 2-Modulda sayt bo'limlari (birinchi blok — «katta sarlavha va bir qatorlik izoh») o'tilgan; «lending» so'zi yo'q |
| kanal | ⚠️ boshqa ma'noda | 7-Modul: Telegram kanali. Jalb qilish kanali — yangi ma'no (T-015) |
| APK | faqat nomi | 11-Modul 15-darsi: «APK — Android telefonga o'rnatiladigan ilova fayli» (Mentor riskining qadami, o'rgatilmagan) |
| maxfiylik siyosati, shaxsiy ma'lumot | ha | 10-Modul 6-darsi: ochiq aytish · kerakli minimum · maqsad tugasa o'chirish |
| pitch, zal, repetitsiya, baholash varag'i, halol gap | ha | 9-Modul 12 (1 daqiqa) · 10-Modul 11 (5 daqiqa, besh slayd, Raqamlar slaydi: bosh raqam + A/B) · 11-Modul 16 (3 daqiqa, to'rt bo'lak: Muammo · Yechim · Jonli demo · Keyingi qadam) |
| yakkama-yakka, risk, tuzatilgan reja | ha | 11-Modul 15-darsi (12 ekran) |
| Mentor tekshiruvi | ha | 11-Modul 5-darsi: «qabul» yoki «tuzatish» («chekpoint» ishlatilmaydi) |

## 5. Tekshirilgan tashqi faktlar (06.10.2026, rasmiy hujjat; iqtiboslar — aynan)

**Render (bepul veb-xizmat) va WebSocket**
- «Render spins down a Free web service that goes 15 minutes without receiving any inbound traffic» · uyg'onishi — «about one minute» · **«This includes both HTTP requests and WebSocket messages from existing connections»** ·
  «750 Free instance hours to each workspace per calendar month» · «Do not use them for production applications» (render.com/docs/free).
- «Render web services can accept inbound WebSocket connections from the public internet» · «Render doesn't impose a fixed timeout for WebSocket connections, but they close automatically when the instance is replaced (for example, during a deploy)» ·
  «…it also happens as part of standard platform maintenance» · «Reconnection logic should use exponential backoff» · «…periodically send each other keepalive messages» · «Always use the `wss` protocol» (render.com/docs/websocket).
  Xulosa: ulanish ochiq turib xabar almashilsa, xizmat uxlamaydi (750 soatdan sarflanadi); deploy paytida ulanish uziladi — qayta ulanish kerak (5-dars materiali).

**socket.io va NestJS**
- NestJS: `npm i --save @nestjs/websockets @nestjs/platform-socket.io`; gateway — «a class annotated with the `@WebSocketGateway()` decorator»; «Nest supports two WebSocket platforms out of the box: socket.io and ws»;
  «By default, each gateway listens on the same port as the HTTP server»; `@SubscribeMessage()` · `@WebSocketServer()` · `handleConnection()` · `handleDisconnect()` (docs.nestjs.com/websockets/gateways).
- Mijoz (brauzer va React Native bir xil paket): `import { io } from "socket.io-client"`; haqiqiy telefonda `localhost` emas — kompyuter IP si yoki internetdagi manzil; Android 9+ `http://` ni to'sadi — `https` kerak (socket.io/how-to/use-with-react-native).
- Qayta ulanish — sukutda yoqilgan: `reconnection: true` · `reconnectionAttempts: Infinity` · `reconnectionDelay: 1000` · `reconnectionDelayMax: 5000` («Each attempt increases the reconnection delay by 2x») · `auth` — «Credentials that are sent when accessing a namespace» (socket.io/docs/v4/client-options).
- Yetkazish kafolati: «Socket.IO does guarantee message ordering» · «By default, Socket.IO provides an **at most once** guarantee of delivery» ·
  «there is no such buffer on the server, which means that any event that was missed by a disconnected client will not be transmitted to that client upon reconnection» ·
  mijoz tomonda `retries` — «The client will try to send the event (up to `retries + 1` times), until it gets an acknowledgement from the server» → takror hodisa bo'lishi mumkin (socket.io/docs/v4/delivery-guarantees).
  Xulosa (5-dars): uzilish paytidagi hodisa yo'qoladi → qayta ulanganda ro'yxat Backend'dan qayta so'raladi; takror yuborilgan hodisa ikki marta sanalmasligi kerak.

**Expo Notifications (joriy SDK 57)**
- «Push notifications (remote notifications) functionality provided by `expo-notifications` is unavailable in Expo Go on Android from SDK 53. A development build is required to use push notifications.» ·
  **«Local notifications (in-app notifications) remain available in Expo Go.»** · o'rnatish `npx expo install expo-notifications` · rejalashtirish `scheduleNotificationAsync`, trigger turlari `TIME_INTERVAL`, `DATE` (docs.expo.dev/versions/latest/sdk/notifications).
- «In SDK 53 and later, Expo Go does not support push notifications functionality» · «There is no cost associated with sending notifications through Expo push notification service» · «There is a limit of 600 notifications per second per project» (docs.expo.dev/push-notifications/faq).
- Masofadan push sozlash: «For Android, you need to configure Firebase Cloud Messaging (FCM) to get credentials» · iOS — «A paid Apple Developer Account is required to generate credentials» (docs.expo.dev/push-notifications/push-notifications-setup).
- Development build — «essentially your own version of Expo Go where you are free to use any native libraries»; iPhone uchun — «paid Apple Developer account» (docs.expo.dev/develop/development-builds/introduction).
  Xulosa: telefonga **masofadan** push (Backend → telefon) Expo Go'da ishlamaydi; Android'da Firebase loyihasi va development build, iPhone'da pullik Apple akkaunti kerak. **Mahalliy eslatma** (ilova o'zi rejalashtiradi) Expo Go'da ishlaydi.

**APK va tarqatish (EAS Build)**
- `eas.json`: `{ "build": { "preview": { "android": { "buildType": "apk" } } } }` · buyruq `eas build -p android --profile preview` · «AABs can't be installed directly on your device» ·
  «copy the URL to the APK from the build details page … Send that URL to your device» (docs.expo.dev/build-reference/apk).
- «APKs can be installed directly to an Android device … once the user accepts the security warning» · iPhone: «This method requires a paid Apple Developer account … at most 100 iPhones per year», har qurilma UDID si kerak (docs.expo.dev/build/internal-distribution).
- Bepul reja: «15 Android and 15 iOS builds» oyiga · «Low-priority queue» · «45-minute build timeout» (expo.dev/pricing).
  Xulosa: Android — APK havolasi (bepul, lekin navbat sekin bo'lishi mumkin, oyiga 15 ta); iPhone — do'konsiz bepul yo'l **yo'q**. 11-Modul fakti: iPhone'da Expo Go loyiha egasining Expo akkauntini talab qiladi — begona iPhone'ga tarqatib bo'lmaydi.

**Web-trekda eslatma**
- Web push uchun service worker kerak (developer.mozilla.org/en-US/docs/Web/API/Push_API); iPhone/iPad — 16.4 dan, faqat bosh ekranga qo'shilgan web ilovada: «A web app that has been added to the Home Screen can request permission to receive push notifications», so'rov — «in response to direct user interaction» (webkit.org/blog/13878).

**Ijtimoiy tarmoqlar**
- Instagram: «Instagram requires everyone to be at least 13 years old before they can create an account» (help.instagram.com/517920941588885).
- Telegram: xizmat shartlarida Yevropa Ittifoqi, Buyuk Britaniya va Avstraliya uchun 18 yosh; boshqa hududlar uchun minimal yosh **rasmiy matnda topilmadi — tekshirilmagan** (agent yosh chegarasini aytmaydi).

**Hali tekshirilmagan (tayanch bosqichida yoki pilotda, rasmiy hujjat / haqiqiy qurilmada):** mahalliy eslatma Expo Go'da Android va iPhone'da amalda chiqishi (ruxsat oynasi matni) · EAS Build bepul navbatining haqiqiy kutish vaqti ·
Expo ilovasini web'ga eksport qilish (`expo export -p web`) va unda `expo-secure-store` o'rnini bosish · Render'da `X-Forwarded-For` (10-Modul ochiq savoli) · Telegram guruh va kanal ochish tugma nomlari · Instagram post/story tugma nomlari · Umami hodisasi (`data-umami-event`) hozirgi yozilishi · Netlify hozirgi tugma nomlari (10-Modul tayanchi 6 da qisman).

## 6. Keys banki (K1–K19) — ishlatilishi va 12-Modulga nomzodlar

Qoida (PM-016): bosh-keys **modul ichida** takrorlanmaydi; mintaqaviy keys (K1 Uzum, K2 Telegram Premium) — mavzu yo'l qo'ysa, kamida har 8-darsda. Raqam faqat yili bilan; «raqamsiz» keysga raqam qo'shilmaydi.
Qo'shni modullarda: 9-Modul — K1, K3, K19, K9 · 10-Modul — K9, K1, K12 · 11-Modul — K18, K14, K4, K15, K16, K1, K10, K19.
Kursda hali bosh-keys bo'lmagan: **K2 Telegram Premium** (monetizatsiya — 13-Modulga mos). Oxirgi uch modulda ishlatilmagan: **K5 Duolingo** (7-Modul) · **K6 Netflix** (5-Modul) · **K8 Facebook** (2-Modul) · K7 Altair (8-Modul) · K11 milkshake · K13 Telegram · K17 Tesla (8-Modul).

| Dars | Mavzu | Nomzod (bank «Mavzular» maydoni bo'yicha) |
|---|---|---|
| 1 · lending | bitta sahifa — bitta va'da — bitta tugma | **K3 Instagram** (Burbn: ko'p funksiyadan bittasi qoldi; «fokus · ishga tushirish»; 2010-yil oktabr — birinchi kuni 25 000 ro'yxatdan o'tish) — 9-Modulda bor edi |
| 3 · real vaqt talabi (PM+PRAKT) | chekka holatlar | keyssiz (K10 Cyberpunk «edge cases» — 11-Modul 13-darsida ishlatilgan) |
| 6 · kanallar | birinchi foydalanuvchilar | **K8 Facebook** («birinchi foydalanuvchilar · ishga tushirish strategiyasi · kanallar»: 2004 — faqat Garvard talabalari; zichlik hajmdan muhim) |
| 7 · 50 foydalanuvchi (PM+PRAKT) | ishga tushirish | keyssiz yoki K1 Uzum (mintaqaviy; to'rtinchi modul ketma-ket) |
| 8 · tahlil va iteratsiya (PM+PRAKT) | ma'lumot — mahsulot qarori | **K6 Netflix** («ma'lumot mahsulot qarori sifatida · analitika»; ≈80% ko'rishlar tavsiyalardan — Netflix ochiq bayonoti, 2016) |
| 10 · 50 tekshiruvi | qaytish, jalb etilganlik metrikalari | **K5 Duolingo** («retention · jalb etilganlik metrikalari»: ketma-ket kunlar va eslatmalar; raqamsiz) |
| 11 · yakkama-yakka | — | keyssiz (11-Modul 15-darsi naqshi) |
| 12 · metrikali pitch | o'sish | **K1 Uzum** (mintaqaviy: 2022-yil oktabr → 2024-yil mart; oyiga ≈17 mln foydalanuvchi, 2025) yoki K13 Telegram (1 mlrd, 2025-yil mart) |
TEX va loyiha kunlari (2, 4, 5, 9) — keyssiz.

## 7. Dars turi → qolip va ekran soni (prompt 3.4, 9–11-Modul tajribasi)

| Tip | Darslar | Qolip · ekran |
|---|---|---|
| PM | 1, 6, 10, 12 | PM dars (QKirish · QReja · QTushuncha · QTest · QVoqea · QMustaqil · QKod · podium · kartochkalar · yakun), ≈15–16 ekran (11-Modul 1-dars ritmi) |
| PM (qisqa) | 11 | 12 ekran, keyssiz, kod ekrani yo'q (11-Modul 15-dars shakli) |
| TEX | 2, 5 | texnik dars (QTushuncha, QKod, QTest) + repo bloki, 18–20 ekran |
| PM+PRAKT | 3, 7, 8 | **12 ekran:** PM nazariya → darhol 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun |
| AI-PRAKT | 4, 9 | loyiha kuni: **8 ekran + 3 blok + kartochkalar = 12** |
| ZAXIRA | 13 | `comp` siz qator, MD yo'q |
Uyga vazifa — yakun kartasida, alohida `.homework.jsx` yo'q. Amaliyot bloki — 11-Modul modeli: o'quvchi hamma qadamni o'z repo'sida, o'z mahsuloti va trekida bajaradi; Mentor misoli — namuna.
