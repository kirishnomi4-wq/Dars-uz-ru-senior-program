# LMS 11-Modul «Final loyiha: g'oya va rivojlantirish + React Native» — manba (konveyer 0-bosqich)

Kod: `src/9-Modull` · kalitlar `m9-NN` · App.jsx `id: '9'` (hali yo'q) · 05.10.2026 · F-ID 250 dan

## 1. Dastur v9 — 11-modul (17 dars, zaxira yo'q)

Maqsad (dasturdan): bitiruvgacha olib boriladigan **final mahsulotni** tanlash, tekshirish va qurishni boshlash. Platforma tanlovi (web yoki mobil) — **PM-qaror**.
**Texnik cho'qqi:** jonli prototip + mobil trek (React Native, v8.1). TEX 3 · AI-PRAKT 4 · PM+PRAKT 1 · PM 8 · DEMO 1. ≈6 hafta, jadvalda 12–13.5-oy.
Infratuzilma eslatmasi (dastur): «Expo akkauntlari va o'quvchilar telefonlarida Expo Go — 11-modulgacha; APK — 12-modulgacha».

| № | Tip | Mavzu (dastur) | Mazmun | Natija |
|---|---|---|---|---|
| 1 | PM | G'oyalar generatsiyasi | Bir darsda 10 g'oya: muammo + auditoriya + yechim | Asoslangan 10 yozma g'oya |
| 2 | PM | Saralash va g'oya tanlovi | Bajariladigan / real auditoriya / qiziq; RICE | RICE baholi 3 g'oya |
| 3 | PM | Custdev: 10 intervyu — 1-qism | Eng yaxshi 2 g'oya bo'yicha intervyular | Birinchi 5 intervyu yozilgan |
| 4 | PM | Custdev: 10 intervyu — 2-qism | Patternlar tahlili, final g'oya tanlovi | 10 intervyu + final g'oya |
| 5 | PM | Mentor bilan tekshiruv + PRD | Mentor g'oyani tasdiqlaydi; to'liq PRD | Tasdiqlangan g'oya + PRD |
| 6 | PM | Final mahsulot roadmap'i | RICE orqali bitiruvgacha roadmap | Roadmap qayd etilgan |
| 7 | TEX | Figma o'rniga jonli prototip (cho'qqi) | 15 daq qog'ozda wireframe → talab → kodlangan, bosiladigan prototip (animatsiyalar 9-moduldan) | Jonli prototip: bosiladi, javob beradi |
| 8 | TEX | Arxitektura + stek + platforma tanlovi | Komponentlar, real vaqt nuqtalari + platforma PM-qaror: web yoki mobil (React Native + Expo)? | Arxitektura + stek + asoslangan platforma |
| 9 | TEX | React Native takrori + Expo | Expo sozlash, navigatsiya, prototipni telefonga yig'ish; web-trek — adaptiv/PWA | Prototip o'z telefonida ishga tushadi |
| 10 | AI-PRAKT | Vibe-coding: poydevor | Database, autentifikatsiya, deploy — tanlangan stekda | Mahsulot skeleti ishlaydi |
| 11 | AI-PRAKT | Vibe-coding: 1-funksiya | Roadmap bo'yicha birinchi asosiy funksiya; talab — o'quvchidan | 1-funksiya tayyor |
| 12 | AI-PRAKT | Vibe-coding: 2-funksiya | Ikkinchi asosiy funksiya | 2-funksiya tayyor |
| 13 | PM+PRAKT | Auditoriya bilan sinov + tuzatish | GIBRID: auditoriyadan 3 kishi bilan sinov → eng muhimi shu darsda tuzatiladi | Yaxshilangan versiya |
| 14 | AI-PRAKT | Vibe-coding: 3-funksiya | Uchinchi asosiy funksiya | 3-funksiya tayyor |
| 15 | PM | Mentor bilan yakkama-yakka | Progress vs roadmap; risklar, tuzatishlar | Tuzatilgan reja |
| 16 | PM | G'oya va prototip pitchi | Muammo → yechim → jonli prototip (mobil trekda — telefonda) | Guruh oldida pitch |
| 17 | DEMO | Demo Day 7 | Final mahsulot g'oyasi + jonli prototip ommaviy himoyasi | Prototip demosi (mobil — telefonda) |

**Keyingi modullar final mahsulotga tayanadi** (Mentor misoli shularga ham yarashi kerak): 12-modul — real vaqt (WebSocket), 50+ real foydalanuvchi, «kim onlayn» + xabarnoma
(mobil trekda push — Expo Notifications), mobil trekda do'konsiz tarqatish (Expo Go / APK) · 13-modul — narx va paywall (mobil trekda — web sahifa orqali Click/Payme) · 14-modul — bitiruv himoyasi.

## 2. App.jsx — hozirgi holat

- `id: '9'` bloki va `// ---- 9-Modul` importi **yo'q** — yangidan qo'shiladi (`id: '8'` blokidan keyin, 359-qator atrofida; import — 140–143-qatorlardan keyin).
- 10-Modul oxiri: `m8-11` «Besh daqiqada nimani ko'rsatasiz?» → `m8-12`, `m8-13` «Zaxira dars» → **`m9-01`**. 10-Modul MD 11: «Keyingi dars — «Zaxira dars»» — o'zgarmaydi;
  10-Modul pitchi `pm-m8d11-pitch` «keyingi modul (Demo Day 7) o'qishi mumkin» deb yozilgan (11-Modul 16–17-darslari).
- **Demo Day qatorlari — namuna bor:** hamma oldingi Demo Day `type: 'Demo'`, `comp` siz kulrang qator (`m1-13`, `m2-15`, `m3-16`, `m4-17`, `m5-13`, `m6-16`). Konveyerda DEMO turi yo'q.
- `period` hamma modulda eski hisobda (9-Modul MEXANIZM-TAKLIF 1): `m7` «oy 9–10.5», `m8` «oy 10.5–12» → ketma-ketlik bo'yicha `m9` «oy 12–13.5» (dasturdagi bilan tasodifan bir xil).

## 3. O'tilgan atamalar (grep, 05.10: 5/6-Modul YAKUNIY, 9/10-Modul MD v3, `src/**/*.jsx`)

| Atama | Avval o'tilganmi | Qaysi so'z bilan · qayerda |
|---|---|---|
| RICE | **yo'q** | yangi (2-dars) |
| PRD | ha | 6-Modul `m6-02` (`PmLesson22`): «Bunday varaqni **PRD** deyishadi — mahsulot talablari hujjati (Product Requirements Document)»; u yerda — to'rt katak |
| talab | ha | 9-Modul: «talab — o'quvchi agentga yozadigan vazifa matni (qayerda · nima qilsin · nima buzilmasin)» (spec, TZ — ishlatilmaydi). ⚠️ PRD ham «talablar hujjati» — bir so'z ikki ma'noga yaqin (T-015) |
| intervyu · yozuv | ha | 9-Modul `m7-02`, `m7-03`: «intervyu — bitta odam bilan suhbat; yozuv — shablonga yozilgani»; texnika — «bo'lib o'tgan ishni so'rash»; custdev — kartochkada bir marta. Lug'atda «intervyu → suhbat» (ziddiyat — 10-Modul TAQIQLAR 6) |
| 10 muammo | ha | 9-Modul `m7-01` «atrofdan 10 muammo» (`pm-m7d1-muammolar`) — 11-Modul 1-darsi shu ro'yxatni o'qiy oladi |
| roadmap | so'z sifatida **yo'q** | tushuncha bor: 6-Modul `m6-12` «Bugun qaysi ish boshlanadi?» — **«uch ufqli reja»** (hozir · keyinroq · uzoqroq), keys K17 Tesla |
| prioritet | ha | P0 `PmUserStoryLesson`: «navbat belgilash (prioritet)», doska Hozir / Keyin / Keyinroq |
| wireframe · prototip · Figma | **yo'q** | yangi (7-dars) |
| animatsiya · Motion | ha | 9-Modul `m7-05` (transition, transform, Motion — web), `m7-08` (namuna + animatsiya agent orqali) |
| React Native · Expo · Expo Go · navigatsiya | ha | 6-Modul `m6-09` (View, Text, StyleSheet, Expo, Expo Go + QR, `npx expo start`, bitta Wi-Fi sharti), `m6-10` (FlatList, **Stack Navigator**, `navigation.navigate`, fetch, AsyncStorage), `m6-11` (eski loyihaning mobil versiyasi, Expo Go bilan ulashish — «App Store yoki Play Market emas») |
| PWA · adaptiv | **yo'q** | yangi (9-dars, web-trek) |
| autentifikatsiya | ha | 4-Modul `AuthEnvLesson`: «login (autentifikatsiya)», JWT; 9-Modul `POST /kirish` (ega paroli → token); 10-Modul 2FA |
| vibe-coding | ha | 2-Modul `PracticeLesson1/2`: «vibecoding (gapirib qurish)»; keyin modullarda — «agent», «talab», «prompt» |
| funksiya (fichа) | ha | 9-Modul osti: «qolgan funksiyalar» — «ficha» ishlatilmaydi |
| pitch · Demo Day | ha | 9-Modul `m7-12` (1 daqiqa), 10-Modul `m8-11` (5 daqiqa, baholash varag'i), Demo Day 1–3 |
| keyingi qadam · jamoa yig'ish | ha | 10-Modul `m8-10`: «Bu misolda Mentor jamoa yig'ishni tanladi; suhbatdagi «2 / 5» — dalillardan biri» (9-Modul MVP «Keyin» ro'yxati) |
| risk | **yo'q** | yangi (15-dars) |

## 4. Tekshirilgan tashqi faktlar (05.10, rasmiy hujjat)

- `npx create-expo-app@latest` — yangi loyiha (docs.expo.dev/get-started/create-a-project).
- Shablonlar: `default` · `blank` · `blank-typescript` · `tabs` · `bare-minimum`. **Default** — «Designed to build multi-screen apps. Includes … Expo CLI, **Expo Router** library and **TypeScript** configuration enabled» (docs.expo.dev/more/create-expo).
  6-Modulda esa **Stack Navigator** (React Navigation) va JavaScript o'tilgan → 9-dars uchun qaror savoli.
- Dev server — `npx expo start`. «Expo Go is a playground for students and learners to test out Expo quickly. It's limited and not useful for building production-grade projects» (docs.expo.dev/get-started/set-up-your-environment).
- Hali tekshirilmagan (tayanch bosqichida, rasmiy hujjatdan): Expo Go qaysi SDK ni qo'llaydi, `--tunnel` (boshqa Wi-Fi), PWA o'rnatish shartlari (manifest, HTTPS), Expo Router «Stack» yozuvi.

## 5. Keys banki (K1–K19) — ishlatilishi (grep `src/`) va 11-Modulga nomzodlar

Qoida: bosh-keys **modul ichida** takrorlanmaydi; mintaqaviy keys kamida har 8-darsda (bankda ikkita: K1 Uzum, K2 Telegram Premium).
Qo'shni modullarda: 9-Modul — K1 Uzum (`m7-01`), K3 Instagram (`m7-03`), K19 iPhone (`m7-08`), K9 Booking (texnik darslarda); 10-Modul — K9 Booking (`m8-04`), K1 Uzum (`m8-10`), K12 Airbnb deck (`m8-11`); 6-Modul — K7 Altair (`m6-02`), K17 Tesla (`m6-12`), K12 (`m6-14`).

| Dars | Mavzu | Nomzod (bank «Темы» bo'yicha) |
|---|---|---|
| 1 · g'oyalar | muammodan g'oya | K15 YouTube (foydalanuvchini kuzatib, g'oyani o'zgartirish) yoki K4 Airbnb (o'z hayotidagi muammo) |
| 2 · saralash, RICE | fokus, tanlov | K3 Instagram/Burbn (ko'p narsadan bittasi qoldi) — 9-Modulda ham bor; yoki K19 iPhone |
| 3 · intervyu 1 | custdev | K4 Airbnb (asoschilar uyma-uy yurib, o'zlari tekshirgan) |
| 4 · intervyu 2 | haqiqiy ehtiyoj | K11 McDonald's milkshake (JTBD) yoki K15 YouTube |
| 5 · PRD | hujjat koddan oldin | **K16 Amazon** (press-reliz koddan oldin) |
| 6 · roadmap | uzoq reja | K17 Tesla (6-Modulda bor) yoki K14 Instagram Stories (vaqtida chiqarish) |
| 13 · sinov | sifat, tekshiruv | K10 Cyberpunk 2077 |
| 15 · yakkama-yakka | sur'at, muddat | keyssiz yoki K13 Telegram |
| 16 · pitch | jonli demo | **K19 iPhone** (2007 taqdimoti — mahsulotni jonli ko'rsatish) — 9-Modulda `m7-08` da bor; yoki K7 Altair |

## 6. Dars turi → qolip va ekran soni (foydalanuvchi qoidasi 05.10 + 9/10-Modul tajribasi)

| Tip | Darslar | Qolip · ekran |
|---|---|---|
| PM | 1, 2, 3, 4, 5, 6, 15, 16 | PM dars (`PM_DARS_ETALON`, QVoqea, QMustaqil, QNatija), 9-Modulda 16–17 ekran |
| TEX | 7, 8, 9 | texnik dars (QTushuncha, QKod, QTest) + kerak bo'lsa repo bloki, 18–20 ekran |
| PM+PRAKT | 13 | **12 ekran:** PM nazariya → 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun |
| AI-PRAKT | 10, 11, 12, 14 | loyiha kuni: **8 ekran + 3 blok + kartochkalar = 12** |
| DEMO | 17 | qaror sahifasida: oldingi Demo Day kabi `comp` siz qator (tavsiya) |
Uyga vazifa — yakun kartasida, alohida `.homework.jsx` yo'q.
